import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.6.0-rc.1: przysiółek nie rośnie sam; buduje się za zgodą gracza, z materiału i pracy
const day=E=>E('(()=>{for(let n=0;n<2400;n++)step(1/10)})()');
function setup(){const runtime=createGame();runtime.game.startGame(true);const E=s=>runtime.evaluate(s);
 E('(()=>{for(let k=0;k<N*N;k++)rev[k]=1;regionScan(true);S.tier=1;const r=freeRegions()[0];const h=kolGo(kolCands()[0],r.id,true);h.arr=0;window.__h=h})()');return{runtime,E}}

test('a new hamlet starts as a hut with a fire and does not build anything by itself',()=>{
 const {E}=setup();
 assert.deepEqual(JSON.parse(E('JSON.stringify(__h.bud)')),{glowa:'szalas',srodek:'ognisko'});
 E('__h.pop=5;__h.zap=.9');for(let d=0;d<9;d++)day(E);
 assert.equal(E('__h.st'),0,'no stage without building');
 assert.equal(E('__h.proj.length'),0,'nothing starts without consent');
 assert.ok(E('__h.pop<=hamCap(__h)'),'no one moves in without a roof');
 assert.ok(E('!!__h.prop'),'the clan asks for consent instead');
 assert.equal(E('__h.prop.k'),'chata','when it is crowded the clan asks for a log cabin first');
});

test('a log cabin needs local gathering, nails carried from the harbour and work; then it replaces the hut in place',()=>{
 const {E}=setup();
 assert.equal(E("hamStart(__h,'chata')"),true);
 for(let d=0;d<8;d++)day(E);
 assert.equal(E('__h.bud.glowa'),'szalas','without nails the cabin cannot be finished');
 assert.match(E('__h.proj[0].st'),/gwo/);
 const before=E('S.res.gwozdzie');assert.equal(E('hamSend(__h,__h.proj[0])'),true);
 assert.ok(E('S.res.gwozdzie')<before,'nails leave the harbour');
 for(let d=0;d<10&&E("__h.bud.glowa")!=='chata';d++)day(E);
 assert.equal(E('__h.bud.glowa'),'chata');assert.equal(E('hamCap(__h)'),6);
 E("__h.bud.praca='stanowisko';__h.bud.tyl='ogrod';__h.st=hamStage(__h)");assert.equal(E('__h.st'),1,'cabin, work place and garden make a farmstead');
});

test('builders from the harbour go only with consent, leave the harbour and come back',()=>{
 const {E}=setup();
 E("hamStart(__h,'chata')");assert.ok(E('!!__h.ask'),'a small hamlet asks for builders');
 assert.equal(E('hamSendHelp(__h)'),true);const ids=JSON.parse(E("JSON.stringify(S.exps.find(e=>e.type==='bud').ppl)"));
 assert.equal(E("S.exps.filter(e=>e.type==='bud').length"),1);
 for(let d=0;d<14&&E("S.exps.some(e=>e.type==='bud')");d++)day(E);
 assert.equal(E("S.exps.some(e=>e.type==='bud')"),false,'they come back');
 assert.ok(E(`${JSON.stringify(ids)}.every(id=>S.people.some(p=>p.id===id&&!p.exp))`),'the builders are back home');
});

test('old hamlets keep what they showed, and epoch III counts only hamlets with a log cabin',()=>{
 const {E}=setup();
 E('S.hamlets.push({id:99,rid:__h.rid,i:__h.i+3,j:__h.j,name:"Stara Wieś",pop:16,st:3,wiez:.5,zap:.5,road:1,head:"Bogdan"});kolInit()');
 const old=JSON.parse(E('JSON.stringify(S.hamlets.find(h=>h.id===99))'));
 assert.equal(old.st,3);assert.equal(old.bud.glowa,'dom');assert.ok(old.bud.plot&&old.bud.brama);
 assert.equal(E('hamCap(S.hamlets.find(h=>h.id===99))'),20);
 E('S.hamlets=S.hamlets.filter(h=>h.id!==99);S.e3={on:1,g:{},regN:0}');
 assert.equal(E('e3Settled()'),0,'a hut is not yet a settled land');
 E("__h.bud.glowa='chata';__h.bud.praca='stanowisko';__h.bud.tyl='ogrod';__h.st=hamStage(__h)");
 assert.equal(E('e3Settled()'),1);
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});

test('in epoch IV a hamlet keeps what it built, a clan house makes it a folwark, and new buildings wait for consent',()=>{
 const {runtime,E}=setup();
 E("hamGrant(__h,4);__h.st=hamStage(__h);__h.pop=12;__h.ang=.7;ludInit();S.e3={done:1};walkers.forEach(w=>retireObjects(w.m));walkers.length=0");
 assert.equal(E('e4Start().ok'),true);
 const place=JSON.parse(E(`JSON.stringify(Object.values(S.e4.settlements).find(p=>p.legacyHamletId===__h.id))`));
 assert.equal(place.stage,'folwark','a hamlet with a clan house starts as a folwark');
 assert.equal(place.buildings.dom_rodowy,1);assert.equal(place.buildings.chata,2);assert.equal(place.buildings.magazyn,1);
 assert.ok(place.homeCapacity>=26,'roofs carry over');assert.equal(place.ang,.7,'the yard keeps its orientation');
 assert.equal(E('S.e4.policy.autoBuild'),false);
 const before=E("JSON.stringify(Object.values(S.e4.settlements).map(p=>p.projects.length))");
 E('E4Economy.advance(S,12,e4Daily)');
 assert.equal(E("Object.values(S.e4.settlements).reduce((a,p)=>a+p.projects.filter(x=>x.kind!=='dom_rodowy').length,0)"),0,'nothing new is built without consent');
 assert.ok(E('Object.values(S.e4.settlements).some(p=>p.proposals.length)'),'clans ask instead');
 const id=E('Object.values(S.e4.settlements).find(p=>p.proposals.length).id'),kind=E(`S.e4.settlements['${id}'].proposals[0].kind`);
 const result=JSON.parse(E(`JSON.stringify(E4Economy.decide(S,'${id}','${kind}',true))`));
 assert.ok(result.ok||/Brakuje|Najpierw|dorosłego/.test(result.reason),'consent starts the work or says what is missing');
 assert.ok(E(`e4FolwarkStage(Object.values(S.e4.settlements).find(p=>p.legacyHamletId===__h.id)).st`)>=4);
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});
