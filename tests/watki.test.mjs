import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.16: wątki — historie dwóch osób, które trwają kilka dni
function village(epoch){
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E('closeSheet()');
 E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;S.wed=null;S.watki=null;S.people.forEach(p=>{p.state='work';p.job=p.job==='wyp'?null:p.job});window.__t=[];{const _t=toast;toast=(m,ms)=>{__t.push(m);return _t(m,ms)}}");
 if(epoch)E(`S.epoch=${epoch}`);
 // dwoje wolnych młodych z różnych rodów (w gotowej wsi prawie wszyscy dorośli mają już pary)
 E(`(()=>{const fams=Object.keys(S.fams).map(Number);const mk=(sex,age,fam)=>{const p=newPerson(S.pid++,newName(sex),age,sex,fam,{zbieracz:1},TKEYS[0]);p.par=[];p.rod=1000+p.id;p.mirX=0;const c={x:tcx(camp.i),z:tcx(camp.j)};p.x=c.x+.5;p.z=c.z+.5;p.state='work';S.people.push(p);addPersonMesh(p);return p};
  mk('m',23,fams[0]);mk('k',21,fams[1])})()`);
 const tap=ds=>{const b={dataset:ds,closest:()=>b};for(const l of runtime.elements.get('ev').listeners.click||[])l({target:{closest:()=>b}})};
 // krok wątku przychodzi po 0,8–1,6 dnia, więc 1,7 dnia to zawsze dokładnie jeden krok
 const day=(n=1)=>{for(let k=0;k<n;k++)E('S.day+=1.7;__watki.watTick()')};
 return {runtime,E,tap,day};
}
const lovers=`(()=>{const s=S.people.filter(p=>p.age>=17&&p.age<=40&&p.pair===null&&!p.waitHome);for(const a of s)for(const b of s)if(a.sex==='m'&&b.sex==='k'&&wedOk(a,b)&&Math.abs(a.age-b.age)<12)return [a.id,b.id];return null})()`;

test('a romance grows over several days, asks once at its turning point and ends in a wedding',()=>{
 const {E,tap,day}=village();const pair=E(lovers);assert.ok(pair,'two singles in the village');
 E(`relAdd(pById(${pair[0]}),pById(${pair[1]}),30);window.__w=__watki.watStart('romans',pById(${pair[0]}),pById(${pair[1]}))`);
 assert.equal(E('__w.st'),1);assert.equal(E('__w.kroki.length'),1,'the first small step is already told');
 assert.equal(E('S.log[0].t'),E('__w.kroki[0][1]'),'and written in the chronicle');
 E('__watki.watTick()');assert.equal(E('__w.st'),1,'the next step waits for its time');
 day(2);assert.equal(E('__w.kroki.length'),3,'two more steps, one at a time');assert.equal(E('__w.st'),3);
 day(1);assert.equal(E('evOpen&&evOpen.ev.id'),'watek','the turning point is one decision card');assert.equal(E('evOpen.ev.ey'),'Zaloty');
 assert.match(E('$("ev").innerHTML'),/Niech swaci idą/);
 tap({o:'0'});assert.equal(E('!!evOpen'),false,'one tap, no "Dalej" card');assert.ok(E('__w.x.wed')>E('S.day'),'the wedding has a day');
 day(4);const [a,b]=pair;assert.equal(E(`pById(${a}).pair`),b,'they are married');
 assert.equal(E('S.watki.a.length'),0);assert.equal(E('S.watki.z[0].k'),'wesele');
 assert.ok(E(`(pById(${a}).mem||[]).some(m=>m[1]==='zalot')`),'the courtship stays in their memories');
 assert.match(E('__watki.watkiHTML()'),/Zaloty: .+ · wesele/);
});

test('in the first epochs a quarrel never turns into a fight, and the council can settle it',()=>{
 const {E,tap,day}=village(1);
 const ids=E(`(()=>{const a=S.people.filter(p=>p.age>=20);const x=a[0],y=a.find(p=>p.fam!==x.fam);return[x.id,y.id]})()`);
 E(`window.__w=__watki.watStart('konflikt',pById(${ids[0]}),pById(${ids[1]}))`);assert.ok(E('__w.kroki[0][1]').includes('kłócą się'));
 day(2);assert.equal(E('__w.x.esk'),undefined,'no fight, theft or fire before epoch III');
 day(1);assert.equal(E('evOpen.ev.ey'),'Spór');const html=E('$("ev").innerHTML');
 assert.match(html,/Sąd na wiecu/);assert.doesNotMatch(html,/wygania/,'banishment only from epoch III');
 const idx=E(`[...$('ev').innerHTML.matchAll(/data-o="(\\d+)"><b>([^<]+)/g)].find(m=>/Sąd/.test(m[2]))[1]`);tap({o:idx});
 assert.equal(E('S.watki.z[0].k'),'wyrok');assert.equal(E('!!evOpen'),false);
});

test('from epoch III a feud can escalate and the council can banish the guilty one to a hamlet',()=>{
 const {E,tap,day}=village(3);
 const ids=E(`(()=>{const a=S.people.filter(p=>p.age>=20);const x=a[0],y=a.find(p=>p.fam!==x.fam);return[x.id,y.id]})()`);
 const n0=E('S.people.length'),h0=E('(S.hamlets||[]).reduce((s,h)=>s+h.pop,0)');
 E(`window.__w=__watki.watStart('konflikt',pById(${ids[0]}),pById(${ids[1]}))`);day(2);
 assert.ok(['bojka','kradziez','podpalenie'].includes(E('__w.x.esk')),'the third step is a fight, a theft or a fire');
 day(1);const idx=E(`[...$('ev').innerHTML.matchAll(/data-o="(\\d+)"><b>([^<]+)/g)].find(m=>/wygania/.test(m[2]))[1]`);tap({o:idx});
 assert.equal(E('S.watki.z[0].k'),'wygnanie');assert.equal(E('S.people.length'),n0-1,'one person leaves the village');
 if(E('(S.hamlets||[]).length'))assert.equal(E('(S.hamlets||[]).reduce((s,h)=>s+h.pop,0)'),h0+1,'and goes to a hamlet');
});

test('at most three stories at once, one per person, and only one decision card a day',()=>{
 const {E,day}=village();
 const made=E(`(()=>{const a=S.people.filter(p=>p.age>=18);let n=0;const used=new Set();for(const x of a)for(const y of a){if(used.has(x.id)||used.has(y.id)||x===y||x.fam===y.fam)continue;if(__watki.watStart('konflikt',x,y)){n++;used.add(x.id);used.add(y.id)}}return n})()`);
 assert.equal(made,3,'a fourth story does not start');
 assert.equal(E(`(()=>{const w=S.watki.a[0];return __watki.watStart('romans',pById(w.a),S.people.find(p=>!__watki.watOf(p)&&p.age>=18))})()`),null,'a person in a story does not start another');
 E('S.watki.a.forEach(w=>{w.st=3;w.dn=S.day})');E('__watki.watTick()');
 assert.equal(E("S.watki.a.filter(w=>w.x.karta).length"),1);E("$('ev').hidden=true;evOpen=null;S.pendingDecision=null");
 E('S.day+=.5;__watki.watTick()');assert.equal(E("S.watki.a.filter(w=>w.x.karta).length"),1,'the next card waits a day');
});

test('a courtship scene and a quarrel scene start a story with that scene as its first step',()=>{
 const {E}=village();const pair=E(lovers);
 const txt=E(`(()=>{const sc=__sceny.SCENY.find(s=>s.k==='zalot');return sc.f(pById(${pair[0]}),pById(${pair[1]}))})()`);
 E('S.watki.nast=0;__watki.watTick()');assert.equal(E('S.watki.a.length'),1);assert.equal(E('S.watki.a[0].t'),'romans');assert.equal(E('S.watki.a[0].kroki[0][1]'),txt);
});

test('matchmaking goes through a courtship story while there is room, and the old way when there is not',()=>{
 const {E}=village();const pair=E(lovers);
 assert.equal(E(`__watki.watSwaty(pById(${pair[1]}),pById(${pair[0]}))`),true);assert.equal(E('S.watki.a[0].st'),2,'they already like each other, so the story starts further on');
 E(`S.watki.a.length=0;S.watki.a.push({t:'x',a:-1,b:-2,x:{}},{t:'x',a:-3,b:-4,x:{}},{t:'x',a:-5,b:-6,x:{}})`);
 assert.equal(E(`__watki.watSwaty(pById(${pair[1]}),pById(${pair[0]}))`),false);
});

test('a story survives save and load, also with its decision card open',()=>{
 const {runtime,E,day}=village();const pair=E(lovers);
 E(`relAdd(pById(${pair[0]}),pById(${pair[1]}),30);window.__w=__watki.watStart('romans',pById(${pair[0]}),pById(${pair[1]}))`);day(3);
 assert.equal(E('evOpen&&evOpen.ev.id'),'watek');E('save()');runtime.game.startGame(false);E('closeSheet()');
 assert.equal(E('S.watki.a.length'),1);assert.equal(E('S.watki.a[0].kroki.length'),3);
 assert.equal(E('evOpen&&evOpen.ev.id'),'watek','the card comes back after loading');
});

test('a story ends when someone dies, and no stories run in epoch IV',()=>{
 const {E}=village();const ids=E(`(()=>{const a=S.people.filter(p=>p.age>=20);const x=a[0],y=a.find(p=>p.fam!==x.fam);return[x.id,y.id]})()`);
 E(`__watki.watStart('konflikt',pById(${ids[0]}),pById(${ids[1]}));killPerson(pById(${ids[1]}),'test');__watki.watTick()`);
 assert.equal(E('S.watki.a.length'),0);assert.equal(E('S.watki.z[0].k'),'odejscie');
 E(`S.epoch=4;S.watki.nast=0`);assert.equal(E(`__watki.watStart('konflikt',pById(${ids[0]}),S.people.find(p=>p.age>=20&&p.id!==${ids[0]}))`),null);
});

test('the person card shows the story and offers an optional nudge for two who like each other',()=>{
 const {runtime,E}=village();const pair=E(lovers);E(`relAdd(pById(${pair[0]}),pById(${pair[1]}),15)`);
 const html=E(`__watki.watCardHTML(pById(${pair[0]}))`);assert.match(html,/Pchnij ich ku sobie/);
 const btn={dataset:{watekPush:`${pair[0]}:${pair[1]}`},closest:sel=>sel==='[data-watek-push]'?btn:null};
 for(const l of runtime.documentListeners.click||[]){try{l({target:btn,stopPropagation(){}})}catch(e){}}
 assert.equal(E('S.watki.a.length'),1);assert.match(E(`__watki.watCardHTML(pById(${pair[0]}))`),/Zaloty: .+ i .+/);
});

test('the stories section lives in the Chronicle tab, and the card counts days correctly',()=>{
 const {E,day}=village();assert.ok(E("NV_JOURNAL.includes('game:watki')"),'shown under Osada → Kronika, not under Opcje');
 const pair=E(lovers);E(`relAdd(pById(${pair[0]}),pById(${pair[1]}),30);window.__w=__watki.watStart('romans',pById(${pair[0]}),pById(${pair[1]}));__w.d0=Math.floor(S.day)`);
 day(3);assert.match(E('$("ev").innerHTML'),/od \d+ (dnia|dni)\./,'genitive after "od"');assert.doesNotMatch(E('$("ev").innerHTML'),/od 1 dzień/);
});
