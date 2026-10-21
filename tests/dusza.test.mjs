import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.8.0-rc.1: osadnicy mają charakter, nastrój, dzień i wspomnienia, a wieczory się nie powtarzają
function village(epoch=2){const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("openEvent=function(){};closeSheet()");if(epoch>=2)E("S.epoch=2;S.path='dom';e2Init()");return {runtime,E}}

test('every settler gets the same character every time, also in an old save without it',()=>{
 const {E}=village();
 const first=E("JSON.stringify(S.people.map(p=>{soulOf(p);return [p.id,p.us,p.lub]}))");
 assert.equal(E("S.people.every(p=>p.us.length===2&&p.us[0]!==p.us[1]&&p.us.every(k=>USP[k]))"),true);
 E("S.people.forEach(p=>{delete p.us;delete p.lub;delete p.mood})");
 assert.equal(E("JSON.stringify(S.people.map(p=>{soulOf(p);return [p.id,p.us,p.lub]}))"),first,'deterministic from the person and the island');
 assert.ok(E("new Set(S.people.map(p=>p.us.join())).size")>10,'characters differ between people');
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
 const html=E("duszaHTML(S.people.find(p=>p.age>=20))");assert.match(html,/class="dusza"/);assert.match(html,/Najlepiej czuje się/);
});

test('evening talk does not repeat the same words for many evenings',()=>{
 const {E}=village();
 const res=JSON.parse(E(`(()=>{const out=[];for(let i=0;i<100;i++){S.day+=1;S.t=S.day*DAY;out.push(wieczorLines().map(x=>x[0]))}return JSON.stringify(out)})()`));
 const last={};let minGap=1e9;const all=[];res.forEach((L,i)=>{assert.ok(L.length>=2,'two or three voices every evening');L.forEach(x=>{all.push(x);if(last[x]!==undefined)minGap=Math.min(minGap,i-last[x]);last[x]=i})});
 assert.ok(minGap>=15,'the same sentence comes back at the earliest after 15 evenings, got '+minGap);
 assert.ok(new Set(all).size>=120,'many different sentences: '+new Set(all).size);
 const nights=JSON.parse(E(`(()=>{const o=[];for(let i=0;i<40;i++){S.day+=1;S.sen=null;o.push(nocLine())}return JSON.stringify(o)})()`));
 assert.ok(new Set(nights).size>=30,'nights vary too: '+new Set(nights).size);
});

test('every line agrees with the speaker and the other person, for women and men',()=>{
 const {E}=village();
 const bad=JSON.parse(E(`(()=>{const bad=[];const mk=(sex,id)=>Object.assign({},S.people.find(p=>p.age>=20),{id,sex,name:sex==='k'?'Dobrawa':'Bogdan'});
  for(const sa of ['k','m'])for(const sb of ['k','m']){const A=mk(sa,9001),B=mk(sb,9002);soulOf(A);soulOf(B);
   for(const T of __wiecz.TALK){const L=T.x2?T.x2.flat():T.x;let v={};try{v=T.v?T.v(A,B)||{}:{}}catch(e){v={}}if(T.s){try{const o=T.s(A);v.s=o&&o[0]}catch(e){}}
    for(const x of L){for(const key of Object.keys(v))if(v[key]===undefined)v[key]='x';const t=__wiecz.wFill(x,A,B,Object.assign({y:'rok',Y:'Rok',co:'coś',n:'Jana',ng:'Jana',r:'Doliny',c:'drwal',f:'drwal',z:'jaskółki nisko',p:'będzie deszcz',s:'coś'},v));
     if(/[\\[\\]<>{}|]/.test(t))bad.push(T.k+': '+t)}}}
  for(const T of __wiecz.NOC)for(const x of T.x){const t=x.replace(/\\{B\\}/g,'Jan').replace(/\\{s\\}/g,'coś').replace(/<([^|>]*)\\|([^>]*)>/g,'$1');if(/[\\[\\]<>{}|]/.test(t))bad.push(T.k+': '+t)}
  return JSON.stringify(bad)})()`));
 assert.deepEqual(bad,[]);
 assert.equal(E("__wiecz.wFill('[Byłem|Byłam] tam z {B}, <sam|sama>.',{name:'Ola',sex:'k'},{name:'Jan',sex:'m'},{})"),'Byłam tam z Jan, sam.');
 assert.equal(E("__wiecz.wFill('Szedłem. || Szłam.',{name:'Ola',sex:'k'},null,{})"),'Szłam.');
});

test('mood is computed once a day, stays in range and changes work by at most 8%',()=>{
 const {E}=village();E('(()=>{for(let n=0;n<DAY*2*4;n++)step(1/4)})()');
 assert.equal(E("S.people.every(p=>Number.isFinite(p.mood)&&Math.abs(p.mood)<=1)"),true);
 const words=JSON.parse(E("JSON.stringify([...new Set(S.people.map(moodWord))])"));assert.ok(words.length>=2,'people do not all feel the same: '+words.join(', '));
 const r=JSON.parse(E("(()=>{const p=S.people.find(q=>q.age>=20);p.mood=0;const a=eff(p);p.mood=1;const b=eff(p);p.mood=-1;const c=eff(p);p.mood=0;return JSON.stringify([b/a,c/a])})()"));
 assert.ok(Math.abs(r[0]-1.08)<1e-9&&Math.abs(r[1]-.92)<1e-9);
});

test('days, memories, grief and promotions are remembered the way people tell them',()=>{
 const {E}=village();
 E("(()=>{const [a,b,c]=S.people.filter(p=>p.age>=20);lvUp(a,'drwal',2);lvUp(b,'rybak',3);lvUp(c,'zbieracz',1);lvFlush()})()");
 assert.match(E("S.log[0].t"),/^Troje lepiej zna swój fach: /);
 assert.match(E("(()=>{const a=S.people.find(p=>p.age>=20);lvUp(a,'kowal',5);return S.log[0].t})()"),/mistrz/);
 const dead=E("(()=>{const p=S.people.find(q=>q.age>=30&&famMembers(q.fam).length>1);const kin=famMembers(p.fam).filter(q=>q!==p).map(q=>q.id);const n=p.name;killPerson(p,'test');return JSON.stringify({n,ok:kin.every(id=>(pById(id).mem||[]).some(m=>m[1]==='smierc'&&m[2]===n))})})()");
 assert.equal(JSON.parse(dead).ok,true,'family remembers the death');
 assert.match(E("moodWord(S.people.find(p=>(p.mem||[]).some(m=>m[1]==='smierc'&&m[3]<=-.6)))"),/żałob/);
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});

test('a dream can come true and people remember it',()=>{
 const {E}=village();
 const s=JSON.parse(E("(()=>{S.weather.next='storm';S.weather.left=1;let r=null;for(let i=0;i<40&&!r;i++){r=senPick();if(r&&r.k!=='wx')r=null}return JSON.stringify(r&&{k:r.k,v:r.v,a:r.A.id,txt:r.txt})})()"));
 assert.equal(s.k,'wx');assert.match(s.txt,/śni/);
 const t=E(`(()=>{S.sen={d:Math.floor(S.day),a:${s.a},k:'wx',v:'storm'};S.weather.k='storm';return senCheck()})()`);
 assert.match(t,/sprawdził/);assert.equal(E(`(pById(${s.a}).mem||[]).some(m=>m[1]==='sen')`),true);assert.equal(E('S.sen'),null);
});

test('evenings, nights and mornings run on the game clock and are kept in the Chronicle',()=>{
 const {runtime,E}=village();E('(()=>{for(let n=0;n<DAY*3*4;n++)step(1/4)})()');
 const arch=JSON.parse(E('JSON.stringify(S.wArch||[])'));assert.ok(arch.length>=2);assert.ok(arch.some(o=>o.L.length>=2));assert.ok(arch.some(o=>o.n));
 E("openSheet('kronika')");assert.match(runtime.elements.get('body').innerHTML,/Wieczory/);
 const raw=E('serializeSave()');const other=createGame();other.game.startGame(true);
 assert.equal(other.evaluate(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw)});boot(false);return (S.wArch||[]).length>=2&&S.people.every(p=>p.us)})()`),true);
});
