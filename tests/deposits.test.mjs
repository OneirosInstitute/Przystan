import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.1: złoża skupione w miejscach wyspy, rozpoznawane przez ludzi, wyczerpywane warstwami
function game(){const g=createGame();g.game.startGame(true);return g}
test('every deposit kind exists on the island and can be reached from the camp',()=>{
 const g=game();
 const r=JSON.parse(g.evaluate(`JSON.stringify(__zl.deposits().map(o=>({t:o.t,reach:!!reach[o.j*N+o.i]})))`));
 for(const t of ['wegiel','torf','rudne','lom','glinisko'])assert.ok(r.some(o=>o.t===t),'brak złoża: '+t);
 assert.ok(r.every(o=>o.reach),'złoże poza zasięgiem lądowym');
});
test('other islands also get the full set of deposits within reach of their camp',()=>{
 for(const seed of [31,4096,12345]){const g=createGame({search:'?seed='+seed});g.game.startGame(true);
  const r=JSON.parse(g.evaluate(`JSON.stringify({seed:SEED,d:__zl.deposits().map(o=>({t:o.t,reach:!!reach[o.j*N+o.i],d:Math.hypot(o.i-camp.i,o.j-camp.j)}))})`));
  assert.equal(r.seed,seed);
  for(const t of ['wegiel','rudne','lom','glinisko'])assert.ok(r.d.some(o=>o.t===t&&o.reach&&o.d<140),`wyspa ${seed}: brak złoża ${t} w zasięgu`)}
});
test('a deposit becomes known only when someone reaches it and then unlocks its buildings',()=>{
 const g=game();
 const r=JSON.parse(g.evaluate(`(()=>{const o=__zl.deposits().find(q=>q.t==='rudne');const before=bAvail('kopalnia');reveal(o.i,o.j,6);odkTick();const seen=odkSt(o).s;
  const p=S.people.find(isAdult);p.x=o.x;p.z=o.z;p.state='idle';odkTick();return JSON.stringify({before,seen,after:odkSt(o).s,know:S.know.zl_rudne,avail:bAvail('kopalnia'),layers:odkSt(o).zl})})()`));
 assert.equal(r.before,false);assert.equal(r.seen,1);assert.equal(r.after,2);assert.equal(r.know,'tak');assert.equal(r.avail,true);
 assert.deepEqual(r.layers,[1500,5000,9000]);
});
test('a quarry built on a deposit draws its layers and stops when they are empty',()=>{
 const g=game();
 const r=JSON.parse(g.evaluate(`(()=>{const o=__zl.deposits().find(q=>q.t==='lom');odkInit();S.odk[o.id]={s:2,d:0,nm:'Kamienne Łomy'};zlKeys();
  const b={id:900,kind:'lom',i:o.i,j:o.j,prog:8,work:8,cmp:1,ext:[],cond:1};S.bld.push(b);
  const on=!!__zl.zlOf(b);gospMade(b,'kamien',100);const z1=odkSt(o).zl.slice();
  odkSt(o).zl=[0,0,5];gospMade(b,'kamien',12);const z2=odkSt(o).zl.slice();
  const p=S.people.find(isAdult);p.job='wb';p.wb=900;p.state='idle';const planned=planJob(p);
  const off={id:901,kind:'lom',i:camp.i+3,j:camp.j+3,prog:8,work:8,cmp:1,ext:[],cond:1};
  return JSON.stringify({on,z1,z2,planned,act:p.act,offDeposit:__zl.zlOf(off)===null,placeFar:checkPlace('lom',camp.i+4,camp.j+4)})})()`));
 assert.equal(r.on,true);assert.deepEqual(r.z1,[3900,12000,30000]);assert.deepEqual(r.z2,[0,0,0]);
 assert.equal(r.planned,false);assert.match(r.act,/złoże wyczerpane/);assert.equal(r.offDeposit,true);assert.equal(r.placeFar,false);
});
test('an old coal seam keeps what was already dug when the deposit model takes over',()=>{
 const g=game();
 const r=JSON.parse(g.evaluate(`(()=>{const o=ODK.find(q=>q.t==='wegiel');odkInit();S.odk[o.id]={s:2,d:0,left:450,nm:'Czarny Jar'};const z=__zl.zlInit(o);return JSON.stringify({z,left:odkSt(o).left})})()`));
 assert.deepEqual(r.z,[1850,6000,12000]);assert.equal(r.left,1850);
});
