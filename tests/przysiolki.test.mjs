import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.12: przysiółki później (od 50 mieszkańców), dalej od Przystani i z własną kartą na mapie
function setup(){const runtime=createGame();runtime.game.startGame(true);const E=s=>runtime.evaluate(s);
 E('(()=>{for(let k=0;k<N*N;k++)rev[k]=1;regionScan(true);S.tier=1})()');return E}
const far=E=>JSON.parse(E('JSON.stringify(freeRegions().map(r=>Math.round(Math.hypot(r.i-camp.i,r.j-camp.j))))'));

test('epoch I is about the harbour: no hamlet below 50 people and no hamlet goal in act IV',()=>{
 const E=setup();
 assert.match(E('kolWhyNot()'),/co najmniej 50 osób/);
 assert.equal(E("EVENTS.find(e=>e.id==='kol_mlodzi').cond()"),false,'young couples do not ask to leave yet');
 assert.equal(E("ACTS[4].g.some(g=>/przysiółek/.test(g[0]))"),false);
 E('__przys.min=0');assert.doesNotMatch(E('kolWhyNot()'),/50 osób/);
});

test('the three regions nearest to the harbour stay plain land and every hamlet stands at least 50 steps away',()=>{
 const E=setup();
 const near=JSON.parse(E('JSON.stringify([...__przys.hamNear3()])'));assert.equal(near.length,3);
 const free=JSON.parse(E('JSON.stringify(freeRegions().map(r=>r.id))'));for(const id of near)assert.ok(!free.includes(id),'near region '+id+' is not offered');
 for(const d of far(E))assert.ok(d>=50,'region '+d+' steps away');
 const h=JSON.parse(E(`(()=>{const r=freeRegions()[0];const c=kolCands()[0];const h=kolGo(c,r.id,true);return JSON.stringify({d:Math.hypot(h.i-camp.i,h.j-camp.j),m:h.mies.length,pop:h.pop,head:h.head,names:h.mies.map(f=>f.n)})})()`));
 assert.ok(h.d>=45,'the hamlet camp stands far from the harbour: '+h.d.toFixed(1));
 assert.equal(h.m,h.pop,'founders are listed by name');assert.ok(h.names.includes(h.head));
});

test('an old hamlet standing too close moves further away once, keeping what it built',()=>{
 const E=setup();
 const r=JSON.parse(E(`(()=>{const r0=REGIONS.find(r=>r&&__przys.hamNear3().has(r.id));const h={id:(S.hid=(S.hid||0)+1),rid:r0.id,i:camp.i+12,j:camp.j+9,name:'Bliskowo',rod:0,pop:6,wiez:.5,zap:.5,day:S.day,ppl:['Lech','Wanda'],head:'Lech',why:''};
  S.hamlets=S.hamlets||[];S.hamlets.push(h);hamInit(h);h.bud.glowa='chata';h.st=hamStage(h);const b0=JSON.stringify(h.bud);kolDaily();
  return JSON.stringify({d:Math.hypot(h.i-camp.i,h.j-camp.j),same:JSON.stringify(h.bud)===b0,mv:S.hamMv,log:S.log.slice(0,6).map(x=>x.t).join(' | '),news:(h.news||[]).length})})()`));
 assert.ok(r.d>=45,'moved away: '+r.d.toFixed(1));assert.equal(r.same,true,'buildings and stage stay');assert.equal(r.mv,1);
 assert.match(r.log,/Bliskowo przenosi się dalej/);assert.ok(r.news>=1,'the move is in the hamlet news');
});

test('residents follow the population, a death removes that very person, and the card shows people, stock and news',()=>{
 const E=setup();E('__przys.min=0');
 const r=JSON.parse(E(`(()=>{const h=kolGo(kolCands()[0],freeRegions()[0].id,true);h.arr=0;h.pop+=3;const n1=__przys.hamFolks(h).length;
  const nm=hamDeath(h,'glod');const gone=!h.mies.some(f=>f.n===nm);log('W przysiółku '+h.name+' urodziło się dziecko.');
  __przys.selH=h.id;renderSel();const html=$('sel').innerHTML;return JSON.stringify({n1,pop:h.pop,len:h.mies.length,gone,html,name:h.name})})()`));
 assert.equal(r.n1,r.pop+1);assert.equal(r.len,r.pop);assert.equal(r.gone,true,'the dead are no longer listed');
 for(const part of [r.name,'Mieszkańcy','Zapasy i dobytek','Więź z Przystanią','Co u nich słychać','urodziło się dziecko','Cała wspólnota'])assert.ok(r.html.includes(part),part);
 assert.equal(E('(()=>{select(null);return __przys.selH})()'),null,'selecting something else closes the hamlet card');
});

test('the three regions by the harbour count as settled and epoch III does not ask for hamlets there (4.9.0-rc.13)',()=>{
 const E=setup();
 const r=JSON.parse(E(`(()=>{S.e3={on:1,regN:999};const all=e3Regs().length,near=e3Regs().filter(r=>__przys.hamNear3().has(r.id)).length;return JSON.stringify({need:e3Need(),all,near,settled:settledCount()})})()`));
 assert.equal(r.need,r.all-r.near-JSON.parse(E('JSON.stringify(e3Regs().filter(r=>__przys.hamNear3().has(r.id)===false&&Math.hypot(r.i-camp.i,r.j-camp.j)<50).length)')),'only regions where a hamlet can stand are needed');
 assert.ok(r.need<r.all);assert.equal(E('S.e3.regN'),r.need,'an old cached count is replaced');
 assert.ok(r.settled>=4,'the harbour region and its three neighbours are settled: '+r.settled);
});
