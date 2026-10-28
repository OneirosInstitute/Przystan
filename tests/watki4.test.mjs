import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.19: rywalizacja w fachu, tajemnica, tęsknota za domem, przezwiska, pieśni i Księga rozbitków
function village(){
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E('closeSheet()');
 E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;S.wed=null;S.watki=null;S.people.forEach(p=>{p.state='work';p.job=p.job==='wyp'?null:p.job})");
 const tap=ds=>{const b={dataset:ds,closest:()=>b};for(const l of runtime.elements.get('ev').listeners.click||[])l({target:{closest:()=>b}})};
 const day=(n=1)=>{for(let k=0;k<n;k++)E('S.day+=1.7;__watki.watTick()')};
 const pick=re=>E(`[...$('ev').innerHTML.matchAll(/data-o="(\\d+)"><b>([^<]+)/g)].find(m=>${re}.test(m[2]))[1]`);
 const card=()=>E('evOpen?$("ev").innerHTML:""');
 const clean=h=>{assert.doesNotMatch(h,/undefined|null|NaN|\$\{|\{[A-Za-z]+\}/,h.slice(0,300))};
 return {runtime,E,tap,day,pick,card,clean};
}
const rivals=`(()=>{const a=S.people.filter(p=>p.age>=20&&p.age<55);const x=a[0],y=a.find(p=>p!==x&&p.fam!==x.fam&&p.pair!==x.id);for(const c of Object.keys(CN)){x.sk[c]=Math.min(x.sk[c]||0,1);y.sk[c]=Math.min(y.sk[c]||0,1)}x.sk.rybak=3;y.sk.rybak=3;S.people.forEach(p=>{if(p!==x&&p!==y)for(const c of Object.keys(CN))p.sk[c]=Math.min(p.sk[c]||0,1)});return[x.id,y.id]})()`;

test('two of the best in one craft compete, and the winner of the contest gets a nickname for life',()=>{
 const {E,tap,day,pick,card,clean}=village();const [a,b]=E(rivals);
 const f=JSON.parse(E(`JSON.stringify((__watki.watFind('rywal')||[]).map(x=>x.id??x.c))`));assert.deepEqual(f.slice(0,2).sort(),[a,b].sort());assert.equal(f[2],'rybak');
 E(`window.__w=__watki.watStart('rywal',pById(${a}),pById(${b}),{x:{c:'rybak',cn:CN.rybak}})`);day(2);assert.equal(E('__w.kroki.length'),3);
 day(1);assert.equal(E('evOpen&&evOpen.ev.ey'),'Rywalizacja');clean(card());assert.match(card(),new RegExp(E('__watki.watFeast()')));
 tap({o:pick('/Konkurs/')});assert.match(E('S.watki.z[0].k'),/^(szacunek|uraza)$/);
 const nick=E(`[pById(${a}),pById(${b})].map(p=>p.przez).filter(Boolean)`);assert.deepEqual(JSON.parse(JSON.stringify(nick)),['Szczupak']);
 const w=E(`pById(${a}).przez?${a}:${b}`);assert.match(E(`__watki.watCardHTML(pById(${w}))`),/Zwą (go|ją): „Szczupak”/);
 assert.ok(E("S.log.slice(0,6).some(l=>/wszyscy wołają „Szczupak”/.test(l.t))"));
});

test('a rivalry can also end with the two sharing the work',()=>{
 const {E,tap,day,pick}=village();const [a,b]=E(rivals);
 E(`__watki.watStart('rywal',pById(${a}),pById(${b}),{x:{c:'rybak',cn:CN.rybak}})`);day(3);tap({o:pick('/podzielą/')});
 assert.equal(E('S.watki.z[0].k'),'podzial');assert.equal(E(`!!(pById(${a}).przez||pById(${b}).przez)`),false);
});

test('someone takes food at night; the settlement can help the hungry family instead of punishing',()=>{
 const {E,tap,day,pick,card,clean}=village();
 const ids=E(`(()=>{const A=S.people.find(p=>p.age>=20&&p.age<=50&&S.people.some(q=>(q.par||[]).includes(p.id)&&q.age<10));const B=S.people.find(q=>q!==A&&q.fam!==A.fam&&q.age>=20);return[A.id,B.id]})()`);
 const f0=E('foodTotal()');E(`__watki.watStart('tajemnica',pById(${ids[0]}),pById(${ids[1]}),{x:{v:'zapasy'}})`);day(2);assert.ok(E('foodTotal()')<f0,'food goes missing');
 day(1);assert.equal(E('evOpen&&evOpen.ev.ey'),'Tajemnica');clean(card());assert.match(card(),/podbiera zapasy/);
 const f1=E('foodTotal()');tap({o:pick('/Pomóc rodzinie/')});assert.equal(E('S.watki.z[0].k'),'pomoc');assert.ok(E('foodTotal()')<f1);
});

test('the elders judge the one who took food, without banishing anyone',()=>{
 const {E,tap,day,pick}=village();
 const ids=E(`(()=>{const A=S.people.find(p=>p.age>=20&&p.age<=50&&S.people.some(q=>(q.par||[]).includes(p.id)&&q.age<10));const B=S.people.find(q=>q!==A&&q.fam!==A.fam&&q.age>=20);return[A.id,B.id]})()`);
 const n=E('S.people.length'),m0=E(`pById(${ids[0]}).mirX||0`);E(`__watki.watStart('tajemnica',pById(${ids[0]}),pById(${ids[1]}),{x:{v:'zapasy'}})`);day(3);tap({o:pick('/osądzą/')});
 assert.equal(E('S.watki.z[0].k'),'kara');assert.equal(E(`pById(${ids[0]}).mirX`),m0-3);assert.equal(E('S.people.length'),n);
});

test('a hidden illness: telling the elders uses herbs and heals',()=>{
 const {E,tap,day,pick,card,clean}=village();
 const ids=E(`(()=>{const A=S.people.find(p=>p.age>=45);const B=S.people.find(q=>q!==A&&q.fam!==A.fam&&q.age>=20);A.hp=.8;S.res.ziola=5;return[A.id,B.id]})()`);
 E(`__watki.watStart('tajemnica',pById(${ids[0]}),pById(${ids[1]}),{x:{v:'choroba'}})`);day(3);clean(card());assert.match(card(),/ukrywa to przed wszystkimi/);
 const hp=E(`pById(${ids[0]}).hp`);tap({o:pick('/leczyć/')});assert.equal(E('S.watki.z[0].k'),'leczenie');assert.equal(E('S.res.ziola'),3);assert.ok(E(`pById(${ids[0]}).hp`)>hp+.25);
});

test('night walks turn out to be secret help for a lonely elder',()=>{
 const {E,tap,day,pick,card,clean}=village();
 const ids=E(`(()=>{const C=S.people.filter(p=>p.age>=55).sort((a,b)=>b.age-a.age)[0];const A=S.people.find(p=>p.age>=20&&p.age<=50&&p.fam!==C.fam);const B=S.people.find(q=>q!==A&&q!==C&&q.fam!==A.fam&&q.age>=20);return[A.id,B.id,C.id,C.name]})()`);
 E(`__watki.watStart('tajemnica',pById(${ids[0]}),pById(${ids[1]}),{x:{v:'noc',c:${ids[2]},cn:'${ids[3]}'}})`);day(2);
 assert.ok(E(`S.watki.a[0].kroki.some(k=>k[1].includes(gen('${ids[3]}')))`),'the steps lead to the elder');day(1);clean(card());
 const m0=E(`pById(${ids[0]}).mirX||0`);tap({o:pick('/przy ogniu/')});assert.equal(E('S.watki.z[0].k'),'chwala');assert.equal(E(`pById(${ids[0]}).mirX`),m0+3);
});

test('the game finds secrets of every kind it can tell',()=>{
 const {E}=village();const seen=new Set();
 for(let i=0;i<40;i++){const v=E("(()=>{const f=__watki.watFind('tajemnica');return f&&f[2].v})()");if(v)seen.add(v)}
 assert.ok(seen.has('zapasy')&&seen.has('choroba'),[...seen].join(','));
});

test('homesickness belongs to the castaways of epoch I and can end with sailing away forever',()=>{
 const {E,tap,day,pick,card,clean}=village();
 const f=E("(()=>{const f=__watki.watFind('tesknota');return f&&[f[0].id,f[1].id,!f[0].born]})()");assert.ok(f&&f[2],'a castaway who remembers home');
 E('S.epoch=2');assert.equal(E("__watki.watFind('tesknota')"),null,'not in epoch II');E('S.epoch=1');
 const [a,b]=f;const name=E(`pById(${a}).name`),n=E('S.people.length'),boats=E('S.res.lodz||0');
 E(`__watki.watStart('tesknota',pById(${a}),pById(${b}))`);assert.match(E('__watki.watTitle(S.watki.a[0])'),new RegExp('^Tęsknota: '+name+'$'));
 day(3);assert.equal(E('evOpen&&evOpen.ev.ey'),'Tęsknota');clean(card());
 tap({o:pick('/odpłynąć/')});assert.equal(E('S.watki.z[0].k'),'odplynal');assert.equal(E('S.people.length'),n-1);assert.equal(E(`!!pById(${a})`),false);
 assert.equal(E(`S.people.some(q=>q.pair===${a})`),false,'the spouse is free');assert.ok(E(`(S.songs||[]).some(s=>s.t==='${name} odpływa')`));
 if(boats>=1)assert.equal(E('S.res.lodz'),boats-1);
 const book=E('ksiegaText()');assert.match(book,/ODPŁYNĘLI ZA MORZE/);assert.match(book,new RegExp('HISTORIE[\\s\\S]*Tęsknota: '+name+': odpłynięcie'));
});

test('a castaway who stays plants an orchard and is called the orchard keeper',()=>{
 const {E,tap,day,pick}=village();const f=E("(()=>{const f=__watki.watFind('tesknota');return[f[0].id,f[1].id]})()");
 E(`__watki.watStart('tesknota',pById(${f[0]}),pById(${f[1]}))`);day(3);tap({o:pick('/sad/')});
 assert.equal(E('S.watki.z[0].k'),'sad');assert.match(E(`pById(${f[0]}).przez`),/^Sadowni(k|czka)$/);assert.match(E('ksiegaText()'),/PRZEZWISKA/);
});

test('if the homesick castaway dies, the closest one keeps the little bark boat',()=>{
 const {E}=village();const f=E("(()=>{const f=__watki.watFind('tesknota');return[f[0].id,f[1].id]})()");
 E(`__watki.watStart('tesknota',pById(${f[0]}),pById(${f[1]}));killPerson(pById(${f[0]}),'ze starości')`);
 assert.equal(E("S.watki.z.find(z=>z.t==='tesknota').k"),'pamiatka');assert.ok(E(`pById(${f[1]}).mem.some(m=>m[1]==='dar'&&/pamiątka/.test(m[2])&&m[4]===1)`));
});

test('people gossip about rivalries, secrets and homesickness, and remember the ones who sailed away',()=>{
 const {E}=village();const [a,b]=E(rivals);E(`__watki.watStart('rywal',pById(${a}),pById(${b}),{x:{c:'rybak',cn:CN.rybak}})`);
 E(`(()=>{const A=S.people.find(p=>p.age>=45&&!__watki.watOf(p));const B=S.people.find(q=>q!==A&&!__watki.watOf(q)&&q.fam!==A.fam&&q.age>=20);__watki.watStart('tajemnica',A,B,{x:{v:'choroba'}});const f=__watki.watFind('tesknota');__watki.watStart('tesknota',f[0],f[1]);S.odplyneli=[{n:'Lubomir',s:'m',d:0,b:f[1].id}]})()`);
 for(const k of['w_rywal','w_tajem','w_teskn','w_odplynal']){
  const out=JSON.parse(E(`(()=>{const T=__wiecz.TALK.find(t=>t.k==='${k}');const A=S.people.find(p=>p.age>=20&&!__watki.watOf(p)&&T.a(p));if(!A)return'[]';const B=T.b(A);if(!B)return'[]';const v=T.v(A,B);return JSON.stringify(T.x.map(x=>__wiecz.wFill(x,A,B,v)))})()`));
  assert.ok(out.length>0,k);for(const l of out)assert.doesNotMatch(l,/[{}\[\]|<>]|undefined/,k+': '+l);
 }
});
