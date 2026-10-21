import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.8.0-rc.2: SI czasu wolnego — odwiedziny, ulubione miejsca, rozmowy w drodze, burza, praca, którą się lubi
function village(){const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("S.epoch=2;S.path='dom';e2Init();closeSheet();S.evT=1e9;openEvent=function(){}");return {runtime,E}}

test('evenings are spent in different ways and the words fit',()=>{
 const {E}=village();E("window.__k={};window.__t=new Set()");
 E(`(()=>{for(let n=0;n<DAY*5*4;n++){step(1/4);if(n%30===0)S.people.forEach(p=>{if(p.state==='eve'||p.after==='eve'){__k[p.eveK]=1;if(p.eveTxt)__t.add(p.act)}})}})()`);
 const kinds=JSON.parse(E('JSON.stringify(Object.keys(__k))'));const special=kinds.filter(k=>['odw','miejsce','gaj','lowi','grob','ogrod'].includes(k));
 assert.ok(special.length>=2,'people choose their own evenings: '+kinds.join(', '));
 assert.ok(kinds.includes('ogien')||kinds.includes('hala'),'the fire still gathers most people');
 const acts=JSON.parse(E('JSON.stringify([...__t])'));assert.ok(acts.every(a=>!/undefined|null|\[|\|/.test(a)),acts.join(' / '));
});

test('names are declined correctly when people sit or talk together',()=>{
 const {E}=village();
 const r=JSON.parse(E(`JSON.stringify([['Dobrawa','k'],['Radosław','m'],['Mirek','m'],['Bolko','m'],['Staś','m'],['Zbysław','m'],['Wojsław','m']].map(([name,sex])=>zInst({name,sex})))`));
 assert.deepEqual(r,['z Dobrawą','z Radosławem','z Mirkiem','z Bolkiem','ze Stasiem','ze Zbysławem','z Wojsławem']);
});

test('friends who meet on the path stop for a chat, and a storm sends children home',()=>{
 const {E}=village();
 const chat=E(`(()=>{const [a,b]=S.people.filter(p=>p.age>=20);relAdd(a,b,60);S.day=Math.floor(S.day)+.4;S.t=S.day*DAY;
   a.state=b.state='move';a.path=[{x:a.x+3,z:a.z}];b.path=[{x:a.x-3,z:a.z}];b.x=a.x+.5;b.z=a.z;a.chatN=0;a.carry=b.carry=null;a.chatCd=b.chatCd=0;
   stepPerson(a,.05);return JSON.stringify({a:a.chatT>S.t,b:b.chatT>S.t,act:a.act})})()`);
 const c=JSON.parse(chat);assert.equal(c.a,true);assert.equal(c.b,true);assert.match(c.act,/^rozmawia z/);
 const kids=JSON.parse(E(`(()=>{S.weather.k='storm';S.day=Math.floor(S.day)+.45;S.t=S.day*DAY;for(let n=0;n<300;n++)step(1/4);return JSON.stringify(S.people.filter(p=>p.age<12&&homeOf(p)).map(p=>p.act))})()`));
 assert.ok(kids.length>0&&kids.filter(a=>/burz/.test(a)).length>=kids.length/2,'children hide from the storm: '+kids.join(' / '));
});

test('someone who does work they do not like swaps with someone equally good, and the staffing stays the same',()=>{
 const {E}=village();
 const r=JSON.parse(E(`(()=>{const ws=S.bld.filter(b=>bDone(b)&&BD[b.kind].wk&&S.people.some(p=>p.job==='wb'&&p.wb===b.id));let a=null,B=null;
   for(const x of S.people)for(const y of S.people){if(a)break;if(x===y||x.job!=='wb'||y.job!=='wb'||x.wb===y.wb)continue;const cx=jobCraft(x),cy=jobCraft(y);if(!cx||!cy||cx===cy)continue;a=x;B=y}
   if(!a)return JSON.stringify({skip:1});soulOf(a);soulOf(B);const cx=jobCraft(a),cy=jobCraft(B);a.lub.f=cy;B.lub.f=cx;a.sk[cy]=B.sk[cy];B.sk[cx]=a.sk[cx];a.niech=5;
   const count=()=>JSON.stringify(S.bld.map(b=>S.people.filter(p=>p.job==='wb'&&p.wb===b.id).length));const before=count(),wa=a.wb,wb=B.wb;wolSwap();
   return JSON.stringify({ok:a.wb===wb&&B.wb===wa,same:before===count(),log:S.log[0].t})})()`));
 if(r.skip)return;assert.equal(r.ok,true);assert.equal(r.same,true);assert.match(r.log,/Zamiana przy pracy/);
});
