import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('../public/lectura-controller.js').catch(()=>({}));
const createReader=module.createReader;
function setup(){
 const spoken=[],states=[],finishes=[];
 const speech={speak:u=>spoken.push(u),cancel(){},pause(){},resume(){},getVoices:()=>[{lang:'en-US'},{lang:'es-CL'}]};
 class Utterance{constructor(text){this.text=text;}}
 assert.equal(typeof createReader,'function','Debe existir el controlador de lectura');
 const reader=createReader({speech,Utterance,onState:s=>states.push(s),onFinish:()=>finishes.push(true)});
 return {reader,spoken,states,finishes};
}
test('lee el texto del capítulo en español',()=>{const x=setup();x.reader.start('Oscar crea experiencias.',1.25);assert.equal(x.spoken[0].text,'Oscar crea experiencias.');assert.equal(x.spoken[0].lang,'es-CL');assert.equal(x.spoken[0].rate,1.25);assert.equal(x.spoken[0].voice.lang,'es-CL');assert.equal(x.reader.state,'playing');});
test('detener impide que un final tardío adelante un capítulo',()=>{const x=setup();x.reader.start('Capítulo uno.');const old=x.spoken[0];x.reader.stop();old.onend();assert.equal(x.reader.state,'idle');assert.equal(x.finishes.length,0);});
test('reemplazar la lectura ignora el final de la anterior',()=>{const x=setup();x.reader.start('Uno.');const old=x.spoken[0];x.reader.start('Dos.');old.onend();assert.equal(x.finishes.length,0);x.spoken[1].onend();assert.equal(x.finishes.length,1);});
test('pausar y reanudar conservan el capítulo',()=>{const x=setup();x.reader.start('Uno.');x.reader.pause();assert.equal(x.reader.state,'paused');x.reader.resume();assert.equal(x.reader.state,'playing');assert.equal(x.spoken.length,1);});
test('un error de voz detiene sin avance automático',()=>{const x=setup();x.reader.start('Uno.');x.spoken[0].onerror({error:'synthesis-failed'});assert.equal(x.reader.state,'error');assert.equal(x.finishes.length,0);});
