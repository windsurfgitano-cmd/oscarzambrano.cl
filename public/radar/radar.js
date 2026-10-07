import {filterArticles} from './radar-logic.mjs';
const $=id=>document.getElementById(id);
let payload=null,toastTimer;
const labels={agentes:'Agentes',modelos:'Modelos',crear:'Crear',trabajo:'Trabajo'};
const kinds={original:'Fuente original',press:'Prensa',community:'Comunidad / autores'};
const format=new Intl.DateTimeFormat('es-CL',{timeZone:'America/Santiago',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
function node(tag,text,className){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
function safeUrl(raw){try{const u=new URL(raw);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
function link(text,url){const a=node('a',text);a.href=safeUrl(url)||'#';a.target='_blank';a.rel='noopener noreferrer';return a;}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
async function share(url='https://www.oscarzambrano.cl/radar/',title='Radar IA de Oscar Zambrano'){
 try{if(navigator.share){await navigator.share({title,url});return;}await navigator.clipboard.writeText(url);toast('Enlace copiado. Compártelo con quien le sirva.');}
 catch(error){if(error.name!=='AbortError')toast('Puedes copiar el enlace desde la barra del navegador.');}
}
function renderArticle(article){
 const row=node('article',undefined,'news');
 const meta=node('div',undefined,'news-meta');meta.append(node('p',article.source,'source-name'));
 const time=node('time',format.format(new Date(article.published_at))+' · Chile');time.dateTime=article.published_at;meta.append(time,node('span',kinds[article.source_kind]||'Fuente','kind'));
 const content=node('div'),heading=node('h3');heading.append(link(article.title,article.url));content.append(heading);
 if(article.tags?.length){const tags=node('div',undefined,'news-tags');for(const tag of article.tags)if(labels[tag])tags.append(node('span',labels[tag]));content.append(tags);}
 if(article.summary){const details=node('details');details.append(node('summary','Ver resumen de la fuente'),node('p',article.summary,'news-summary'));content.append(details);}
 const actions=node('div',undefined,'news-actions');actions.append(link('Abrir fuente',article.url));
 const button=node('button','Compartir');button.type='button';button.setAttribute('aria-label','Compartir noticia: '+article.title);button.addEventListener('click',()=>share(article.url,article.title));actions.append(button);content.append(actions);
 row.append(meta,content);return row;
}
function render(){
 if(!payload)return;
 const hours=Number(new FormData($('filters')).get('hours')||24);
 const articles=filterArticles(payload.articles,{hours,topic:$('topic').value,query:$('search').value});
 const results=$('results');results.replaceChildren();results.setAttribute('aria-busy','false');
 $('count').textContent=articles.length+' '+(articles.length===1?'publicación':'publicaciones')+' en las últimas '+hours+' horas';
 for(const article of articles)if(safeUrl(article.url))results.append(renderArticle(article));
 if(!articles.length){const empty=node('div',undefined,'empty');empty.append(node('h3','No hay publicaciones que coincidan.'),node('p','Prueba otro tema, borra la búsqueda o cambia a 48 horas. Si una fuente está caída, su estado aparece más abajo.'));results.append(empty);}
}
function renderSources(){
 const ul=node('ul');for(const source of payload.sources){const li=node('li');li.append(link(source.name,source.url),node('span',source.status==='ok'?' — consultada':' — no respondió en esta consulta'));ul.append(li);}$('sources').replaceChildren(ul);
}
async function load(){
 $('reload').disabled=true;$('results').setAttribute('aria-busy','true');$('updated').textContent='Consultando las fuentes…';
 let saved=false;
 try{
  const response=await fetch('/api/radar',{signal:AbortSignal.timeout(14000)});
  if(!response.ok)throw new Error('feeds unavailable');
  const data=await response.json();if(!Array.isArray(data.articles)||!Array.isArray(data.sources)||!Number.isFinite(Date.parse(data.generated_at)))throw new Error('invalid feed');payload=data;
 }catch{
  try{const response=await fetch('/radar/data.json',{signal:AbortSignal.timeout(6000)});if(!response.ok)throw new Error('saved unavailable');const data=await response.json();if(!Array.isArray(data.articles)||!Array.isArray(data.sources)||!Number.isFinite(Date.parse(data.generated_at)))throw new Error('invalid saved feed');payload=data;saved=true;}
  catch{$('updated').textContent='No pudimos consultar las fuentes. Pulsa Consultar fuentes para intentar de nuevo.';$('count').textContent='Consulta no disponible.';$('results').setAttribute('aria-busy','false');$('reload').disabled=false;return;}
 }
 const checked=format.format(new Date(payload.generated_at));
 const stale=Date.now()-Date.parse(payload.generated_at)>3600000;
 const failed=payload.sources.filter(s=>s.status!=='ok').length;
 $('updated').textContent=(saved?'Copia guardada del ':stale?'Consulta anterior del ':'Fuentes consultadas el ')+checked+' (Chile).'+(failed?' '+failed+' fuente(s) no respondieron.':'')+(saved||stale?' Las noticias vencidas se ocultan.':'');
 render();renderSources();$('reload').disabled=false;
}
$('filters').addEventListener('submit',event=>event.preventDefault());$('filters').addEventListener('input',render);$('filters').addEventListener('change',render);
$('clear').addEventListener('click',()=>{$('filters').reset();render();});
$('reload').addEventListener('click',load);$('share').addEventListener('click',()=>share());$('share-bottom').addEventListener('click',()=>share());
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});setInterval(render,60000);load();
