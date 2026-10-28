import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.18: przyjaźń z pobratymstwem, żałoba po śmierci bliskiego, mistrz i uczeń, plotki przy ogniu
function village(){
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E('closeSheet()');
 E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;S.wed=null;S.watki=null;S.people.forEach(p=>{p.state='work';p.job=p.job==='wyp'?null:p.job})");
 const tap=ds=>{const b={dataset:ds,closest:()=>b};for(const l of runtime.elements.get('ev').listeners.click||[])l({target:{closest:()=>b}})};
 const day=(n=1)=>{for(let k=0;k<n;k++)E('S.day+=1.7;__watki.watTick()')};
 const pick=re=>E(`[...$('ev').innerHTML.matchAll(/data-o="(\\d+)"><b>([^<]+)/g)].find(m=>${re}.test(m[2]))[1]`);
 return {runtime,E,tap,day,pick};
}
const two=`(()=>{const a=S.people.filter(p=>p.age>=20&&p.age<60);const x=a.find(p=>p.sex==='m'),y=a.find(p=>p.sex==='m'&&p!==x&&p.fam!==x.fam&&x.pair!==p.id);return[x.id,y.id]})()`;

test('a friendship grows and can be sealed with pobratymstwo, after which the two are never set against each other',()=>{
 const {E,tap,day,pick}=village();const [a,b]=E(two);
 E(`relAdd(pById(${a}),pById(${b}),40);window.__w=__watki.watStart('przyjazn',pById(${a}),pById(${b}))`);assert.equal(E('__w.t'),'przyjazn');
 day(2);assert.equal(E('__w.kroki.length'),3);day(1);assert.equal(E('evOpen&&evOpen.ev.ey'),'Przyjaźń');
 assert.match(E('$("ev").innerHTML'),/pobratymstwo przy ogniu/);tap({o:pick('/zawrą/')});
 assert.equal(E(`pById(${a}).pobr`),b);assert.equal(E('S.watki.z[0].k'),'pobratymstwo');
 assert.ok(E(`pById(${a}).mem.some(m=>m[1]==='przyjazn'&&m[4]===1)`),'a lasting memory');
 assert.match(E(`__watki.watCardHTML(pById(${a}))`),new RegExp('Pobratym: '+E(`pById(${b}).name`)),'the person card remembers the sworn brother');
 assert.equal(E("__watki.watSoon('przyjazn')"),true,'another friendship story waits a while');
 assert.ok(!E("JSON.stringify(__watki.watFind('przyjazn'))").includes(`"id":${a},`),'one sworn brother for life');
 E(`relAdd(pById(${a}),pById(${b}),-200)`);const f=E("JSON.stringify(__watki.watFind('konflikt'))");assert.ok(!f.includes(`${a},${b}`)&&!f.includes(`${b},${a}`),'sworn brothers do not start a feud');
});

test('two women seal a friendship with posestrzenie',()=>{
 const {E}=village();const ids=E(`(()=>{const a=S.people.filter(p=>p.age>=20&&p.sex==='k');const x=a[0],y=a.find(p=>p.fam!==x.fam);return[x.id,y.id]})()`);
 assert.equal(E(`__watki.watRite(pById(${ids[0]}),pById(${ids[1]}))`),'posestrzenie');
});

test('a death starts mourning for the closest person, and remembering by the fire leaves a song',()=>{
 const {E,tap,day,pick}=village();
 const ids=E(`(()=>{const m=S.people.find(p=>p.pair!==null&&p.pair!==undefined&&p.age>=25&&pById(p.pair));return[m.id,m.pair]})()`);
 const name=E(`pById(${ids[1]}).name`);E(`killPerson(pById(${ids[1]}),'ze starości');S.watki.nast=S.day+5;__watki.watTick()`);
 assert.equal(E('S.watki.a.length'),1,'mourning starts at once, even right after another story');
 assert.equal(E('S.watki.a[0].t'),'zaloba');assert.equal(E('S.watki.a[0].a'),ids[0],'the widow or widower mourns');
 assert.match(E('__watki.watTitle(S.watki.a[0])'),new RegExp(name+' †'));
 day(2);day(1);assert.equal(E('evOpen&&evOpen.ev.ey'),'Żałoba');tap({o:pick('/Dziady/')});
 assert.equal(E('S.watki.z[0].k'),'pamiec');assert.ok(E(`(S.songs||[]).some(s=>s.t==='Pamięci '+gen('${name}'))`),'a song in memory of the dead');
});

test('giving time ends mourning by itself two days later',()=>{
 const {E,tap,day,pick}=village();
 const ids=E(`(()=>{const m=S.people.find(p=>p.pair!==null&&p.pair!==undefined&&p.age>=25&&pById(p.pair));return[m.id,m.pair]})()`);
 E(`killPerson(pById(${ids[1]}),'ze starości');__watki.watTick()`);day(3);tap({o:pick('/Dać czas/')});assert.equal(E('S.watki.a.length'),1);
 day(2);assert.equal(E('S.watki.z[0].k'),'powrot');
 assert.equal(E("JSON.stringify([1,3,5,12,22].map(__watki.watMinelo))"),JSON.stringify(['minął dzień','minęły 3 dni','minęło 5 dni','minęło 12 dni','minęły 22 dni']));
});

test('a master teaches an apprentice, the masterpiece can raise the craft, and the apprentice takes over after the master dies',()=>{
 const {E,tap,day,pick}=village();
 const ids=E(`(()=>{const A=S.people.find(p=>p.age>=40);const B=S.people.find(p=>p.age>=15&&p.age<=22&&p!==A);A.sk.kowal=4;B.sk.kowal=1;B.xp.kowal=lvXp(1);return[A.id,B.id]})()`);
 assert.ok(E(`(()=>{const f=__watki.watFind('mistrz');return!!f&&f[0].age>=35&&f[0].sk[f[2]]>=4&&f[1].age>=14&&f[1].age<=25&&(f[1].sk[f[2]]||0)<=2})()`),'the game finds a master and a young one for the same craft');
 E(`window.__w=__watki.watStart('mistrz',pById(${ids[0]}),pById(${ids[1]}),{x:{c:'kowal',cn:CN.kowal}})`);const xp0=E(`pById(${ids[1]}).xp.kowal`);
 day(2);assert.ok(E(`pById(${ids[1]}).xp.kowal`)>xp0,'learning moves the craft forward');
 day(1);assert.equal(E('evOpen&&evOpen.ev.ey'),'Mistrz i uczeń');assert.doesNotMatch(E('$("ev").innerHTML'),/aem|ąem|ęem/,'no broken word endings');
 E('window.__r=Math.random;Math.random=()=>0.01');tap({o:pick('/majstersztyk/')});E('Math.random=__r');
 assert.equal(E(`pById(${ids[1]}).sk.kowal`),2);assert.equal(E('S.watki.z[0].k'),'majstersztyk');assert.equal(E(`pById(${ids[1]}).uczen.m`),ids[0]);
 E(`killPerson(pById(${ids[0]}),'ze starości')`);assert.ok(E('S.log.slice(0,8).some(l=>/przejmuje fach po/.test(l.t))'));assert.equal(E(`pById(${ids[1]}).uczen`),null);
});

test('people gossip by the fire about running stories, and every gossip line comes out whole',()=>{
 const {E}=village();const [a,b]=E(two);
 E(`window.__w=__watki.watStart('konflikt',pById(${a}),pById(${b}))`);
 const out=JSON.parse(E(`(()=>{const T=__wiecz.TALK.find(t=>t.k==='w_spor');const A=S.people.find(p=>p.age>=20&&!__watki.watOf(p));const B=T.b(A);const v=T.v(A,B);return JSON.stringify(T.x.map(x=>__wiecz.wFill(x,A,B,v)))})()`));
 assert.equal(out.length,3);for(const l of out)assert.doesNotMatch(l,/[{}\[\]|<>]/,l);
 const [na,nb]=[E(`pById(${a}).name`),E(`pById(${b}).name`)];assert.ok(out[0].startsWith(`${na} i ${nb} znowu`)||out[0].startsWith(`${nb} i ${na} znowu`),'both names in the nominative: '+out[0]);
 assert.ok(E("['w_zal','w_spor','w_zal2','w_mistrz','w_dawny_konflikt','w_dawny_romans','w_dawny_przyjazn'].every(k=>__wiecz.TALK.some(t=>t.k===k))"));
});
