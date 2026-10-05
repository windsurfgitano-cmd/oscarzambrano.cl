import {fitActor} from './personaje-frame.js';
const root=document.documentElement;
const sections=[...document.querySelectorAll('[data-chapter]')];
const button=document.querySelector('.motion-toggle');
const poses=[...document.querySelectorAll('.pose')];
let readingLayout=false;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const actor=document.querySelector('.actor');
const props=['experiencia','colaboradores','microfono','cuaderno'].map(name=>document.querySelector('.prop-'+name));
const pointer={x:0,y:0};
let paused=false, master=null, textContext=null, sculpture=null, lastFrame=0, activePose=-1, resizeTimer;
const state={};
const frameTransitions=[];
const actorFrame={height:0,headerHeight:0,readerHeight:0};
function measureActorFrame(){actorFrame.height=actor.offsetHeight;actorFrame.headerHeight=document.querySelector('.site-header').offsetHeight;actorFrame.readerHeight=document.querySelector('.chapter-controls')?.offsetHeight||0;}
const shot=(actorX,actorY,actorScale,pose,actorAlpha,objects,sculptureX,sculptureY,sculptureScale,turn,roll,sculptureAlpha)=>{
 const result={actorX,actorY,actorScale,pose,actorAlpha,sculptureX,sculptureY,sculptureScale,turn,roll,sculptureAlpha};
 objects.forEach((o,i)=>{result['x'+i]=o[0];result['y'+i]=o[1];result['s'+i]=o[2];result['r'+i]=o[3];result['a'+i]=o[4];});return result;
};
function shotsForViewport(){
 const mobile=innerWidth<=720;
 const hidden=[50,90,.6,0,0];
 if(mobile)return [
  shot(61,46,.86,0,1,[[87,36,.87,-12,.95],[18,44,.74,-4,1],hidden,hidden],60,24,.44,.4,-.2,.8),
  shot(30,41,.95,1,1,[hidden,hidden,hidden,[78,36,.49,-12,.9]],32,25,.39,1.5,.2,.85),
  shot(77,46,.9,2,1,[[42,65,1.13,9,1],[77,72,.8,0,1],hidden,hidden],57,49,.58,2.4,-.45,.8),
  shot(92,36,.55,2,0,[hidden,hidden,hidden,hidden],82,38,.4,2.8,-.2,0),
  shot(64,41,.88,3,1,[hidden,hidden,[19,37,.95,-9,1],hidden],72,23,.44,3.5,.35,.85),
  shot(30,42,.84,4,1,[hidden,hidden,hidden,[77,38,.55,-12,1]],29,24,.4,4.4,-.25,.85),
  shot(92,36,.55,2,0,[hidden,hidden,hidden,hidden],82,38,.4,2.8,-.2,0),
  shot(79,34,.61,5,1,[hidden,hidden,hidden,hidden],62,24,.42,5.5,.4,.8)
 ];
 return [
  shot(73,53,1,0,1,[[85,69,.82,-12,.96],[54,83,.92,-3,1],hidden,hidden],74,31,.72,.45,-.15,.88),
  shot(24,57,1.06,1,1,[hidden,hidden,hidden,[34,85,.68,-14,.8]],23,42,.62,1.4,-.35,.8),
  shot(81,48,.89,2,1,[[61,80,1.15,8,1],[55,58,.78,2,1],hidden,hidden],66,50,1.07,2.1,.4,.78),
  shot(92,53,.55,2,0,[hidden,hidden,hidden,hidden],88,45,.55,2.8,.2,0),
  shot(76,59,1.05,3,1,[hidden,hidden,[62,53,1.18,-9,1],hidden],79,33,.78,3.5,.35,.85),
  shot(23,53,.99,4,1,[hidden,hidden,hidden,[34,81,.99,-13,1]],25,31,.65,4.4,-.25,.8),
  shot(92,53,.55,2,0,[hidden,hidden,hidden,hidden],88,45,.55,2.8,.2,0),
  shot(87,62,.7,5,.96,[hidden,hidden,hidden,hidden],85,38,.63,5.4,.4,.88)
 ];
}
function showPose(index){
 const next=Math.max(0,Math.min(poses.length-1,Math.round(index)));
 if(next===activePose)return;
 frameTransitions.forEach(t=>t.kill());frameTransitions.length=0;
 poses.forEach((img,i)=>{img.style.visibility=i===next?'visible':'hidden';img.style.opacity=i===next?'1':'0';img.classList.toggle('is-active',i===next);});
 activePose=next;
 if(!paused&&!preference.matches&&!readingLayout){frameTransitions.push(gsap.fromTo(poses[next],{scale:.98,opacity:.35},{scale:1,opacity:1,duration:.18,ease:'power2.out'}));}
}
function paint(time=0,force=false){
 if(innerWidth<=720)return;
 if(!force&&(paused||preference.matches||readingLayout||document.hidden||time-lastFrame<1/30))return;
 lastFrame=time;
 if(!state.actorX)return;
 showPose(state.pose);
 const px=preference.matches||readingLayout||paused?0:pointer.x,py=preference.matches||readingLayout||paused?0:pointer.y;
 const frame=fitActor({...actorFrame,y:innerHeight*state.actorY/100+py*6,scale:state.actorScale,viewportHeight:innerHeight});
 gsap.set(actor,{x:innerWidth*state.actorX/100+px*9,y:frame.y,xPercent:-50,yPercent:-50,scale:frame.scale,autoAlpha:state.actorAlpha});
 gsap.set('.actor-drift',{y:paused||preference.matches||readingLayout?0:Math.sin(time*.9)*5});
 props.forEach((node,i)=>gsap.set(node,{x:innerWidth*state['x'+i]/100+px*(i+1)*8,y:innerHeight*state['y'+i]/100+py*(i+1)*5,xPercent:-50,yPercent:-50,scale:state['s'+i],rotation:state['r'+i],autoAlpha:state['a'+i]}));
 gsap.set('.connection path',{strokeDashoffset:1200-(1-state.pose/7)*700});
 sculpture?.update(state,paused||preference.matches||readingLayout?0:time,{x:px,y:py});
}
function updateNav(){
 const sample=scrollY+innerHeight*.45;
 let index=0;sections.forEach((s,i)=>{if(sample>=s.offsetTop)index=i;});
 const active={mirada:'#mirada',crear:'#mirada',obras:'#obras','en-escena':'#en-escena',curiosidad:'#en-escena',contacto:'#contacto'}[sections[index].id]||null;
 document.querySelectorAll('.site-header nav a').forEach(link=>{
 if(link.getAttribute('href')===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
 });
 const max=document.documentElement.scrollHeight-innerHeight;
 document.querySelector('.scroll-progress span').style.transform='scaleY('+Math.min(1,scrollY/Math.max(1,max))+')';
 return index;
}
function teardown(){
 master?.scrollTrigger?.kill();master?.kill();master=null;
 textContext?.revert();textContext=null;
 frameTransitions.forEach(t=>t.kill());frameTransitions.length=0;
}
function build(){
 measureActorFrame();
 teardown();
 const shots=shotsForViewport();
 root.classList.toggle('static-motion',preference.matches||readingLayout);
 button.hidden=preference.matches||readingLayout;
 if(preference.matches||readingLayout){Object.assign(state,shots[updateNav()]);paint(0,true);return;}
 if(paused){paint(0,true);return;}
 if(innerWidth<=720){
  // Each mobile composition travels with its own words in normal page flow.
  textContext=gsap.context(()=>{
   document.querySelectorAll('.mobile-scene').forEach(scene=>{
    const trigger={trigger:scene,start:'top bottom',end:'bottom top',scrub:.5};
    gsap.fromTo(scene.querySelector('.mobile-oscar'),{y:10},{y:-6,ease:'none',scrollTrigger:trigger});
    const object=scene.querySelector('.mobile-object');
    if(object)gsap.fromTo(object,{y:-6},{y:8,ease:'none',scrollTrigger:{...trigger}});
   });
  });
  ScrollTrigger.refresh();updateNav();return;
 }
 Object.assign(state,shots[0]);
 const maxScroll=Math.max(1,document.querySelector('main').offsetHeight-innerHeight);
 const duration=maxScroll/innerHeight;
 master=gsap.timeline({defaults:{ease:'power2.inOut'},paused:true});
 for(let i=1;i<shots.length;i++){
  const at=Math.max(0,(sections[i].offsetTop-innerHeight*.95)/innerHeight);
  master.to(state,{...shots[i],duration:Math.min(.66,duration-at)},at);
 }
 master.to({}, {duration:.01},duration);
 ScrollTrigger.create({trigger:'main',start:'top top',end:'bottom bottom',animation:master,scrub:.75,invalidateOnRefresh:true});
 // Seek immediately on reload/deep links instead of flashing the entry pose.
 master.progress(Math.min(1,scrollY/maxScroll));
 textContext=gsap.context(()=>{
  document.querySelectorAll('.chapter:not(.hero) h2').forEach((heading)=>{
   const lines=heading.querySelectorAll('.title-line');
   gsap.from(lines,{clipPath:'inset(0 0 100% 0)',yPercent:12,stagger:.06,ease:'power2.out',scrollTrigger:{trigger:heading,start:'top 94%',end:'top 62%',scrub:.45}});
  });
  document.querySelectorAll('.project-art img').forEach((image,i)=>{
   gsap.fromTo(image,{y:42,rotation:i?3:-3,scale:.94},{y:0,rotation:0,scale:1,ease:'none',scrollTrigger:{trigger:image.closest('.project'),start:'top bottom',end:'center center',scrub:.7}});
  });
 });
 ScrollTrigger.refresh();paint(gsap.ticker.time,true);updateNav();
}
function syncReadingLayout(){
 const paragraph=getComputedStyle(document.querySelector('.intro'));
 const size=parseFloat(paragraph.fontSize);
 const next=parseFloat(getComputedStyle(root).fontSize)>20 ||
  parseFloat(paragraph.letterSpacing)/size>=.1 || parseFloat(paragraph.wordSpacing)/size>=.14;
 const changed=next!==readingLayout;readingLayout=next;
 root.classList.toggle('reading-layout',readingLayout);
 const header=document.querySelector('.site-header');
 root.style.setProperty('--header-height',(readingLayout?0:header.offsetHeight)+'px');
 return changed;
}
const renderTick=time=>paint(time);
async function init(){
 if(!window.gsap||!window.ScrollTrigger){root.classList.add('static-motion');return;}
 gsap.registerPlugin(ScrollTrigger);
 await document.fonts.ready;
 await poses[0].decode().catch(()=>{});
 // Load decorative 3D only when a visitor starts interacting; the entry stays light.
 let sculptureRequested=false;
 const startSculpture=async()=>{
  if(innerWidth<=720||sculptureRequested||preference.matches||readingLayout||paused)return;
  sculptureRequested=true;
  ['pointerdown','wheel','keydown'].forEach(type=>removeEventListener(type,startSculpture));
  try{const {createSculpture}=await import('./escultura.js');sculpture=createSculpture(document.querySelector('#sculpture'));paint(gsap.ticker.time,true);}
  catch{document.querySelector('#sculpture').hidden=true;}
 };
 ['pointerdown','wheel','keydown'].forEach(type=>addEventListener(type,startSculpture,{passive:true}));
 syncReadingLayout();build();
 new ResizeObserver(()=>{if(syncReadingLayout())build();}).observe(document.querySelector('.intro'));
 new ResizeObserver(()=>{measureActorFrame();syncReadingLayout();paint(gsap.ticker.time,true);}).observe(document.querySelector('.site-header'));
 // Retreat on forward scroll; reveal on upward scroll or keyboard navigation.
 const header=document.querySelector('.site-header');
 let headerScroll=scrollY,headerTravel=0,headerDirection=0,headerKeyboard=false;
 addEventListener('chapternavigation',()=>{headerScroll=scrollY;headerTravel=0;headerDirection=0;});
 const revealHeader=()=>root.classList.remove('header-hidden');
 addEventListener('scroll',()=>{
  const current=Math.max(0,scrollY),delta=current-headerScroll;headerScroll=current;
  if(current<16||headerKeyboard){headerTravel=0;revealHeader();return;}
  if(Math.abs(delta)<1)return;
  const direction=Math.sign(delta);headerTravel=direction===headerDirection?headerTravel+Math.abs(delta):Math.abs(delta);headerDirection=direction;
  if(direction<0&&headerTravel>12)revealHeader();
  else if(direction>0&&headerTravel>24&&!header.matches(':has(:focus-visible)'))root.classList.add('header-hidden');
 },{passive:true});
 header.addEventListener('focusin',event=>{if(event.target.matches(':focus-visible'))headerKeyboard=true;revealHeader();});
 ['pointerdown','wheel','touchstart'].forEach(type=>addEventListener(type,()=>{headerKeyboard=false;},{passive:true}));
 addEventListener('keydown',event=>{if(event.key==='Tab'){headerKeyboard=true;revealHeader();}});
 // Fonts can move an anchor during the first load; align the final layout once.
 const initialTarget=document.getElementById(decodeURIComponent(location.hash.slice(1)));
 if(initialTarget){
  const top=Math.max(0,initialTarget.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(root).scrollPaddingTop)||0));
  scrollTo(0,top);ScrollTrigger.update();
  if(master)master.progress(Math.min(1,scrollY/Math.max(1,document.querySelector('main').offsetHeight-innerHeight)));
  paint(gsap.ticker.time,true);
 }
 root.classList.add('motion-ready');gsap.ticker.add(renderTick);
 if(scrollY<30&&!preference.matches&&!readingLayout){
  gsap.fromTo('.hero-signature',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1.2,ease:'power2.inOut'});
 }
 button.addEventListener('click',()=>{
  paused=!paused;root.dataset.motion=paused?'paused':'active';
  button.setAttribute('aria-pressed',String(paused));
  const label=paused?'Reanudar movimiento':'Pausar movimiento';
  button.setAttribute('aria-label',label);button.querySelector('.motion-label').textContent=label;button.querySelector('[aria-hidden]').textContent=paused?'▶':'Ⅱ';
  if(paused){const frozen={...state};teardown();Object.assign(state,frozen);paint(0,true);}else build();
 });
 preference.addEventListener('change',build);
 const refreshLayout=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{syncReadingLayout();build();},180);};
 addEventListener('readerlayout',refreshLayout);
 addEventListener('focusin',event=>{
  const content=event.target.closest('.scene-content');
  if(content)gsap.set(content,{opacity:1});
  const node=event.target;
  if(node instanceof HTMLElement && !node.closest('.site-header,.chapter-controls')){
   const rect=node.getBoundingClientRect();
   const top=readingLayout||root.classList.contains('header-hidden')?16:document.querySelector('.site-header').offsetHeight+16;
   if(rect.top<top)scrollBy(0,rect.top-top);
   else {const dock=document.querySelector('.chapter-controls');const bottom=dock&&!dock.hidden?dock.getBoundingClientRect().top-16:innerHeight-16;if(rect.bottom>bottom&&rect.height<bottom-top)scrollBy(0,rect.bottom-bottom);}
  }
 });
 addEventListener('scroll',()=>{updateNav();if(preference.matches||readingLayout){Object.assign(state,shotsForViewport()[updateNav()]);paint(0,true);}},{passive:true});
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&innerWidth>720){pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;}},{passive:true});
 addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{syncReadingLayout();sculpture?.resize();build();},180);});
 addEventListener('pagehide',()=>{gsap.ticker.remove(renderTick);sculpture?.dispose();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
