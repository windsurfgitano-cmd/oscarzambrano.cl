import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('../public/personaje-frame.js').catch(()=>({}));
const fitActor=module.fitActor;
const setup=()=>assert.equal(typeof fitActor,'function','Debe existir el ajuste del personaje al espacio disponible');
test('la pose de Ideas deja margen bajo una cabecera de 128 px',()=>{
 setup();const frame=fitActor({y:268.14,scale:.95,height:346.86,viewportHeight:654,headerHeight:128,readerHeight:58});
 assert.equal(frame.scale,.95);assert.ok(Math.abs(frame.y-324.7585)<.001);
});
test('en una pantalla baja reduce el personaje para dejar libres ambas barras',()=>{
 setup();const frame=fitActor({y:318,scale:1,height:600,viewportHeight:600,headerHeight:94,readerHeight:66});
 assert.equal(frame.scale,.6);assert.equal(frame.y,306);
});
test('con espacio suficiente conserva la composición original',()=>{
 setup();assert.deepEqual(fitActor({y:400,scale:.8,height:300,viewportHeight:900,headerHeight:94,readerHeight:66}),{y:400,scale:.8});
});
test('protege el margen durante posiciones intermedias de una transición',()=>{
 setup();for(const y of [0,120,268,420,654]){
  const frame=fitActor({y,scale:.95,height:346.86,viewportHeight:654,headerHeight:128,readerHeight:58});
  assert.ok(frame.y-346.86*frame.scale/2>=160-.001);
  assert.ok(frame.y+346.86*frame.scale/2<=548+.001);
 }
});
