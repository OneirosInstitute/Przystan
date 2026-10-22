import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.6.0-rc.4: po topieniu Marzanny ludzie nie zostają w wodzie przy brzegu
const stuck=E=>E(`S.people.filter(p=>{const t=tileOf(p.x,p.z);return !walk[t[1]*N+t[0]]&&p.state!=='sleep'}).length`);
test('the Marzanna crowd stands on land and walks back to work afterwards',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("(()=>{S.day=Math.floor(S.day)+T1-.05;cerSet('marzanna')})()");
 E('(()=>{for(let k=0;k<400;k++){step(1/10);cerFrame(1/10)}})()');
 assert.equal(E('cerActive()'),true);assert.equal(stuck(E),0,'nobody stands in the water during the rite');
 E('(()=>{for(let k=0;k<3600;k++){step(1/10);cerFrame(1/10)}})()');
 assert.equal(stuck(E),0);assert.equal(E("S.people.filter(p=>p.blocked&&/zamknięta|Brak drogi/.test(p.blocked.reason||'')).length"),0);
});

test('people saved standing in the water (older versions) walk out after loading',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("(()=>{const c=cerCenter('marzanna');S.people.forEach((p,i)=>{const a=Math.PI*(.2+.6*(i/Math.max(1,S.people.length-1)));p.x=c.x+Math.cos(a)*2.2;p.z=c.z+Math.sin(a)*2.2;p.path=null;p.state='idle'});localStorage.setItem(SAVEKEY,serializeSave());boot(false)})()");
 assert.ok(stuck(E)>5,'the old save really has people in the water');
 E('(()=>{for(let n=0;n<2400;n++)step(1/10)})()');
 assert.equal(stuck(E),0,'everyone walked out');
});

// 4.8.0-rc.1: wieś nie może zamarznąć przez jedną osobę ani przez obrzęd zapisany w połowie
test('one broken person cannot stop the whole village, and a half-saved ceremony ends by itself',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E("closeSheet();S.evT=1e9;openEvent=function(){}");
 E("S.day=Math.floor(S.day)+.4;S.t=S.day*DAY");
 // pierwsza osoba na liście ma stan, na którym stepPerson się wywraca
 const res=JSON.parse(E(`(()=>{const p0=S.people[0];const real=stepPerson;let left=3;stepPerson=function(p,dt){if(p===p0&&left>0){left--;throw new Error('test')}return real(p,dt)};
   const a=S.people.map(p=>[p.x,p.z]);for(let n=0;n<240;n++)step(1/4);stepPerson=real;const moved=S.people.filter((p,i)=>Math.hypot(p.x-a[i][0],p.z-a[i][1])>.3).length;
   return JSON.stringify({moved,n:S.people.length,fault:(S.fault||[]).length,state:p0.state})})()`));
 assert.ok(res.moved>=res.n/2,'the others keep moving: '+res.moved+' of '+res.n);assert.ok(res.fault>=1,'the fault is recorded in the save');
 // obrzęd zapisany jako trwający, ludzie z cerA i ruchem bez drogi, a w środku dnia
 const raw=E(`(()=>{S.cer={k:'marzanna',d:Math.floor(S.day)-1,ids:[],c:{x:tcx(camp.i),z:tcx(camp.j)},t0:.75,t1:.92,on:1,slots:S.people.map(p=>p.id)};S.people.forEach(p=>{p.cerA=1;p.state='move';p.path=null;p.act='patrzy'});return serializeSave()})()`);
 const other=createGame();other.game.startGame(true);
 const after=JSON.parse(other.evaluate(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw)});boot(false);closeSheet();openEvent=function(){};S.evT=1e9;cerFrame(.1);const a=S.people.map(p=>[p.x,p.z]);for(let n=0;n<DAY*.3*4;n++)step(1/4);
   return JSON.stringify({on:S.cer.on,cerA:S.people.filter(p=>p.cerA).length,moved:S.people.filter((p,i)=>Math.hypot(p.x-a[i][0],p.z-a[i][1])>.3).length,n:S.people.length})})()`));
 assert.equal(after.on,0);assert.equal(after.cerA,0);assert.ok(after.moved>=after.n/2,'people walk away: '+after.moved+' of '+after.n);
});

// 4.9.0-rc.2: na plaży bywają pola, do których świat liczył dojście na ukos między dwoma polami bez przejścia.
// Kto stanął tam po obrzędzie, nie mógł wyznaczyć drogi ("Brak drogi do celu") i strażnik go nie ruszał.
test('people left on a beach pocket reachable only across a corner walk back to work',()=>{
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E("closeSheet();S.evT=1e9;openEvent=function(){}");
 const pk=JSON.parse(E(`(()=>{const A=navReach();const L=[];for(let k=0;k<N*N;k++)if(reach[k]&&walk[k]&&!A[k])L.push([k%N,(k/N)|0]);return JSON.stringify(L)})()`));
 assert.ok(pk.length>0,'the island has such pockets');
 E(`(()=>{const L=${JSON.stringify(pk)};S.day=Math.floor(S.day)+.38;S.t=S.day*DAY;S.people.forEach((p,i)=>{const t=L[i%L.length];p.x=tcx(t[0]);p.z=tcx(t[1]);p.path=null;p.state='idle';p.wait=0})})()`);
 const before=E(`S.people.filter(p=>{const t=tileOf(p.x,p.z);return !navReach()[t[1]*N+t[0]]}).length`);assert.ok(before>=S0(E),'everyone starts in the pocket');
 E('(()=>{for(let n=0;n<DAY*.35*4;n++)step(1/4)})()');
 const r=JSON.parse(E(`JSON.stringify({pocket:S.people.filter(p=>{const t=tileOf(p.x,p.z);return !navReach()[t[1]*N+t[0]]&&p.state!=='sleep'}).length,blocked:S.people.filter(p=>p.blocked&&/Brak drogi/.test(p.blocked.reason||'')).length,n:S.people.length})`));
 assert.equal(r.pocket,0,'nobody is left in the pocket');assert.equal(r.blocked,0,'nobody waits for a route');
});
function S0(E){return E('S.people.length')}

test('in the evening people on such a beach pocket go home for the night instead of sleeping on the sand',()=>{
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E("closeSheet();S.evT=1e9;openEvent=function(){}");
 const pk=JSON.parse(E(`(()=>{const A=navReach();const L=[];for(let k=0;k<N*N;k++)if(reach[k]&&walk[k]&&!A[k])L.push([k%N,(k/N)|0]);return JSON.stringify(L)})()`));
 E(`(()=>{const L=${JSON.stringify(pk)};S.day=Math.floor(S.day)+.7;S.t=S.day*DAY;S.people.forEach((p,i)=>{const t=L[i%L.length];p.x=tcx(t[0]);p.z=tcx(t[1]);p.path=null;p.state='idle';p.wait=0})})()`);
 E('(()=>{for(let n=0;n<DAY*.15*4;n++)step(1/4)})()');
 assert.equal(E(`S.people.filter(p=>{const t=tileOf(p.x,p.z);return !navReach()[t[1]*N+t[0]]}).length`),0,'everyone left the pocket before night');
 // droga z zewnątrz nigdy nie prowadzi w taką kieszeń
 const into=E(`(()=>{const L=${JSON.stringify(pk)};const s=nearestWalk(camp.i,camp.j+1);let n=0;for(const t of L.slice(0,6)){const r=astar(s[0],s[1],t[0],t[1]);if(r&&r.length>1)n++}return n})()`);
 assert.equal(into,0,'nobody is routed into the pocket');
});
