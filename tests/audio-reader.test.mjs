import test from 'node:test';
import assert from 'node:assert/strict';
import * as controllers from '../public/lectura-controller.js';

// Node has no HTMLAudioElement. Keep real event dispatch and emulate only media I/O.
class Media extends EventTarget {
 src='';currentTime=0;playbackRate=1;paused=true;pending=[];
 play(){this.paused=false;return new Promise((resolve,reject)=>this.pending.push({resolve,reject}));}
 pause(){this.paused=true;}
 load(){this.currentTime=0;}
 removeAttribute(name){if(name==='src')this.src='';}
}
function setup(){
 assert.equal(typeof controllers.createAudioReader,'function','Debe existir el reproductor por capítulos');
 const audio=new Media(),states=[],finishes=[];
 const reader=controllers.createAudioReader({audio,onState:s=>states.push(s),onFinish:()=>finishes.push(true)});
 return {audio,reader,states,finishes};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('no solicita audio hasta que el visitante inicia un capítulo',async()=>{
 const x=setup();assert.equal(x.audio.src,'');assert.equal(x.reader.state,'idle');
 x.reader.start('/assets/audio/inicio.mp3',1.25);
 assert.equal(x.reader.state,'loading');assert.equal(x.audio.src,'/assets/audio/inicio.mp3');
 x.audio.pending[0].resolve();await settle();assert.equal(x.reader.state,'playing');
});
test('cerrar durante la carga impide resucitar la voz o avanzar',async()=>{
 const x=setup();x.reader.start('/uno.mp3');x.reader.stop();
 x.audio.pending[0].resolve();x.audio.dispatchEvent(new Event('ended'));await settle();
 assert.equal(x.reader.state,'idle');assert.equal(x.audio.src,'');assert.deepEqual(x.finishes,[]);
});
test('una promesa tardía del capítulo anterior no altera el nuevo',async()=>{
 const x=setup();x.reader.start('/uno.mp3');x.reader.start('/dos.mp3');
 x.audio.pending[1].resolve();await settle();
 x.audio.pending[0].reject(new Error('interrupted'));await settle();
 assert.equal(x.reader.state,'playing');assert.deepEqual(x.finishes,[]);
 x.audio.dispatchEvent(new Event('ended'));x.audio.dispatchEvent(new Event('ended'));
 assert.equal(x.reader.state,'idle');assert.deepEqual(x.finishes,[true]);
});
test('pausa, velocidad y continuación conservan la posición',async()=>{
 const x=setup();x.reader.start('/uno.mp3');x.audio.pending[0].resolve();await settle();
 x.audio.currentTime=12.5;x.reader.pause();x.reader.setRate(1.5);
 assert.equal(x.reader.state,'paused');x.reader.resume();x.audio.pending[1].resolve();await settle();
 assert.equal(x.reader.state,'playing');assert.equal(x.audio.currentTime,12.5);assert.equal(x.audio.playbackRate,1.5);
});
test('si el navegador rechaza reproducir, informa error sin avance',async()=>{
 const x=setup();x.reader.start('/uno.mp3');x.audio.pending[0].reject(new Error('NotAllowedError'));await settle();
 assert.equal(x.reader.state,'error');assert.deepEqual(x.finishes,[]);
});
test('un archivo fallido no adelanta el recorrido',async()=>{
 const x=setup();x.reader.start('/no-existe.mp3');x.audio.dispatchEvent(new Event('error'));
 x.audio.pending[0].reject(new Error('NotSupportedError'));await settle();
 assert.equal(x.reader.state,'error');assert.deepEqual(x.finishes,[]);
});
