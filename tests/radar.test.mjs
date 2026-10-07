import test from 'node:test';
import assert from 'node:assert/strict';
import {filterArticles,normalise} from '../public/radar/radar-logic.mjs';
const now=Date.parse('2026-10-07T19:00:00Z');
const articles=[
 {id:'new',title:'Agéntica para crear',summary:'Voz propia',tags:['agentes','crear'],published_at:'2026-10-07T18:00:00Z'},
 {id:'edge24',title:'Modelo',tags:['modelos'],published_at:'2026-10-06T19:00:00Z'},
 {id:'older',title:'Trabajo',tags:['trabajo'],published_at:'2026-10-06T18:59:59Z'},
 {id:'edge48',title:'Agente',tags:['agentes'],published_at:'2026-10-05T19:00:00Z'},
 {id:'expired',title:'Antigua',tags:[],published_at:'2026-10-05T18:59:59Z'},
 {id:'future',title:'Futura',tags:[],published_at:'2026-10-08T19:00:00Z'},
 {id:'bad',title:'Sin fecha',tags:[],published_at:'invalid'}
];
test('24h includes boundary and excludes older, future and missing dates',()=>{
 assert.deepEqual(filterArticles(articles,{hours:24,now}).map(x=>x.id),['new','edge24']);
});
test('48h ages a saved copy using real current time',()=>{
 assert.deepEqual(filterArticles(articles,{hours:48,now}).map(x=>x.id),['new','edge24','older','edge48']);
 assert.equal(filterArticles(articles.filter(x=>x.id!=='future'),{hours:48,now:now+49*3600000}).length,0);
});
test('topic and accent-independent search combine',()=>{
 assert.deepEqual(filterArticles(articles,{hours:48,now,topic:'crear',query:'agentica'}).map(x=>x.id),['new']);
 assert.deepEqual(filterArticles(articles,{hours:48,now,topic:'agentes',query:'voz'}).map(x=>x.id),['new']);
});
test('normalises accents for useful search',()=>assert.equal(normalise(' AGÉNTICA '),' agentica '));
