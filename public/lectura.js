import {createAudioReader} from './lectura-controller.js?v=20261005-voz';
const chapters=[...document.querySelectorAll('[data-chapter]')];
const bar=document.querySelector('.chapter-controls');
const launcher=document.querySelector('.reader-launcher');
const previous=bar.querySelector('[data-previous]'),next=bar.querySelector('[data-next]');
const read=bar.querySelector('[data-read]'),stop=bar.querySelector('[data-stop]');
const speed=bar.querySelector('#reading-speed'),automatic=bar.querySelector('#reading-auto');
const count=bar.querySelector('.chapter-count'),status=bar.querySelector('[role=status]');
const names={inicio:'Inicio',mirada:'Mirada',crear:'Crear',obras:'Obras','en-escena':'En escena',curiosidad:'Curiosidad','lo-que-me-mueve':'Lo que me mueve',contacto:'Contacto'};
let index=0,spokenIndex=0,scrollFrame=0,lastHeight=-1;
const audio=document.querySelector('#oscar-narration');
const supported=Boolean(audio.canPlayType('audio/mpeg'));
function draw(){
 previous.disabled=index===0;next.disabled=index===chapters.length-1;
 count.textContent=(index+1)+' / '+chapters.length;
 count.setAttribute('aria-label','Capítulo '+(index+1)+' de '+chapters.length+': '+names[chapters[index].id]);
}
function start(){spokenIndex=index;reader.start('/assets/audio/'+chapters[index].id+'.mp3',Number(speed.value));}
function go(target,focus=true){
 const continuing=reader?.state==='playing'||reader?.state==='loading';reader?.stop();
 index=Math.max(0,Math.min(chapters.length-1,target));
 const chapter=chapters[index],heading=chapter.querySelector('h1,h2');
 const header=document.querySelector('.site-header');
 const mobile=innerWidth<=720&&!document.documentElement.classList.contains('reading-layout');
 const keyboard=document.activeElement?.matches(':focus-visible');
 if(mobile&&!keyboard)document.documentElement.classList.add('header-hidden');
 const headerVisible=!document.documentElement.classList.contains('header-hidden');
 const reserve=getComputedStyle(header).position==='fixed'&&(!mobile||headerVisible)?header.offsetHeight+16:16;
 const top=(mobile?heading:chapter).getBoundingClientRect().top+scrollY-reserve;
 history.replaceState(null,'','#'+chapter.id);scrollTo({top:Math.max(0,top),behavior:'instant'});
 dispatchEvent(new Event('chapternavigation'));draw();
 heading.setAttribute('tabindex','-1');if(focus)heading.focus({preventScroll:true});
 status.textContent='Capítulo '+(index+1)+': '+names[chapter.id]+'.';
 if(continuing)start();
}
const reader=supported?createAudioReader({audio,onState(state){
 read.textContent=state==='loading'?'Cargando voz…':state==='playing'?'Pausar voz':state==='paused'?'Continuar voz':'Escuchar a Oscar';
 read.disabled=state==='loading';
 read.setAttribute('aria-pressed',String(state==='playing'||state==='paused'));stop.disabled=state==='idle'||state==='error';
 if(state==='idle')status.textContent='';
 if(state==='loading')status.textContent='Cargando la voz de Oscar.';
 if(state==='playing')status.textContent='Escuchando a Oscar. Capítulo '+(spokenIndex+1)+': '+names[chapters[spokenIndex].id]+'.';
 if(state==='paused')status.textContent='Voz en pausa.';
 if(state==='error')status.textContent='No se pudo reproducir el audio. Pulsa Escuchar a Oscar para reintentar.';
},onFinish(){
 if(automatic.checked&&spokenIndex<chapters.length-1){go(spokenIndex+1,false);start();}
 else status.textContent='Narración terminada.';
}}):null;
read.disabled=!supported;if(!supported)status.textContent='El audio no está disponible en este navegador. Puedes leer el contenido y recorrer los capítulos.';
previous.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
read.addEventListener('click',()=>{if(reader?.state==='playing')reader.pause();else if(reader?.state==='paused')reader.resume();else if(reader)start();});
stop.addEventListener('click',()=>{reader?.stop();status.textContent='Narración detenida.';});
speed.addEventListener('change',()=>reader?.setRate(Number(speed.value)));
function setOpen(open){
 if(!open){reader?.stop();bar.querySelector('details').open=false;}
 bar.hidden=!open;launcher.setAttribute('aria-expanded',String(open));
 launcher.setAttribute('aria-label',open?'Cerrar lectura y capítulos':'Abrir lectura y capítulos');
 document.documentElement.classList.toggle('reader-open',open);measure();
 if(open)(read.disabled?(next.disabled?previous:next):read).focus({preventScroll:true});
 else {
  launcher.focus({preventScroll:true});
  const header=document.querySelector('.site-header');
  const heading=chapters[index].querySelector('h1,h2'),rect=heading.getBoundingClientRect();
  const clearance=getComputedStyle(header).position==='fixed'?header.offsetHeight+16:16;
  if(rect.bottom>0&&rect.top<clearance){
   scrollBy({top:rect.top-clearance,behavior:'instant'});
   dispatchEvent(new Event('chapternavigation'));
  }
 }
}
launcher.addEventListener('click',()=>setOpen(bar.hidden));
bar.querySelector('[data-close-reader]').addEventListener('click',()=>setOpen(false));
document.addEventListener('keydown',event=>{
 if(bar.hidden||event.key!=='Escape')return;event.preventDefault();
 const details=bar.querySelector('details');
 if(details.open){details.open=false;details.querySelector('summary').focus();}
 else setOpen(false);
});
function measure(){const height=bar.offsetHeight;if(height===lastHeight)return;lastHeight=height;document.documentElement.style.setProperty('--reader-height',height+'px');dispatchEvent(new Event('readerlayout'));}
new ResizeObserver(measure).observe(bar);
addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const sample=scrollY+innerHeight*.45;let current=0;chapters.forEach((chapter,i)=>{if(sample>=chapter.offsetTop)current=i;});index=current;draw();});},{passive:true});
['wheel','touchstart'].forEach(type=>addEventListener(type,event=>{if(!event.target.closest('.chapter-controls'))reader?.stop();},{passive:true}));
document.addEventListener('click',event=>{if(event.target.closest('a[href^="#"]')&&!event.target.closest('.chapter-controls'))reader?.stop();});
addEventListener('pagehide',()=>reader?.stop());
launcher.hidden=false;draw();measure();
