import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.24: myśliwy, leśniczy i łowiska (plan życia Wyspy, pakiet 5) z gałęzią leśniczego w drzewku (plan wiedzy, W3)
function game(o){const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);if(o&&o.e2)E('E2START=true');runtime.game.startGame(true);
 E("closeSheet();S.evT=1e9;if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null");return {runtime,E}}
const tap=(runtime,ds)=>{const b={dataset:ds,closest:()=>b};for(const l of runtime.elements.get('ev').listeners.click||[])l({target:{closest:()=>b}})};
const LOG=E=>JSON.parse(E('JSON.stringify(S.log.slice(0,10).map(l=>l.t))'));
// leśniczówka i chata myśliwego z pracownikami blisko siebie
const HUTS=`(()=>{const c={i:camp.i,j:camp.j};const put=(kind,di,dj,id)=>{const b={id,kind,i:c.i+di,j:c.j+dj,prog:1,work:1,cmp:1,cond:1,want:1,ext:[]};S.bld.push(b);return b};
 const L=put('lesnik',8,6,9101),M=put('mysliwy',-8,6,9102);const a=S.people.filter(p=>p.age>=20&&p.age<50);const f=a[0],h=a[1];f.job='wb';f.wb=L.id;h.job='wb';h.wb=M.id;h.sk.mysliwy=3;f.sk.lesniczy=2;
 window.__f=f;window.__h=h;window.__L=L;window.__M=M;return 1})()`;

test('the forester is a craft of its own: everyone has it, the lodge trains it, old foresters keep their practice',()=>{
 const {E}=game();
 assert.equal(E("CN.lesniczy"),'leśniczy');assert.equal(E("BD.lesnik.c"),'lesniczy');assert.equal(E("S.people.every(p=>p.sk.lesniczy!==undefined&&p.xp.lesniczy!==undefined)"),true);
 E(HUTS);const xp=E('__f.xp.lesniczy');E("gainXp(__f,'lesniczy',50)");assert.ok(E('__f.xp.lesniczy')>xp);
 // stary zapis bez fachu leśniczego
 const raw=E("(()=>{S.people.forEach(p=>{delete p.sk.lesniczy;delete p.xp.lesniczy});delete S.lwV;__f.sk.drwal=3;return serializeSave()})()");
 const other=createGame({search:'?seed=2207'});other.game.startGame(true);
 const r=JSON.parse(other.evaluate(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw)});boot(false);const f=S.people.find(p=>p.job==='wb'&&bById(p.wb)&&bById(p.wb).kind==='lesnik');return JSON.stringify({all:S.people.every(p=>p.sk.lesniczy>=0),f:f?f.sk.lesniczy:null})})()`));
 assert.equal(r.all,true);assert.equal(r.f,2,'the one who planted trees keeps a forester level from the woodcutting');
});

test('the forest branch: moderate hunting needs a forester and a hunter together; the nursery needs regrowing the forest',()=>{
 const {E}=game();E("S.tech.h_trop=1");
 assert.equal(E("techState(TECH_BY.h_umiar)"),'gate','without both huts');assert.match(E("TECH_BY.h_umiar.gt()"),/leśniczówka i chata myśliwego/);
 E(HUTS);assert.equal(E("techState(TECH_BY.h_umiar)"),'avail');
 E("for(let k=0;k<200;k++)techXp('hodowla',5,'lesniczy')");assert.equal(E('S.tp.h_umiar'),E('TECH_BY.h_umiar.xp/2'),'practice from the forester');
 assert.equal(E("(EXT.lesnik.find(e=>e.id==='szkolka')||{}).need"),'h_odnow');
 assert.deepEqual(JSON.parse(E("JSON.stringify(['h_pasnik','h_gajowka'].map(id=>tEp(TECH_BY[id])))")),[2,2]);
 assert.ok(E("TECH_BY.h_gajowka.req.includes('h_pasnik')"));
});

test('a hunter with no game in range says where the nearest game is, and the hut card shows whether game is going down',()=>{
 const {E}=game();E(HUTS);
 E("S.herds.forEach(h=>{const c=bCenter(__M);if(Math.hypot(h.x-c.x,h.z-c.z)<=rOf(__M)+4)h.n=0});__lowy.lwNoGame(__h,__M,false)");
 assert.match(E('__h.act'),/^w zasięgu nie ma zwierzyny; najbliżej (są|jest) .+, (w krainie |daleko na |blisko osady)/);
 assert.match(LOG(E)[0],/wraca z tropienia: w pobliżu chaty nie ma już zwierzyny\. Najbliżej .+ Łowisku trzeba dać odpocząć albo postawić chatę dalej, na skraju lasu\.$/);
 E("S.lwH={};S.lwH[__M.id]=[12,10,8,5,0]");const card=E("bldPanelHTML(__M)");assert.match(card,/Zwierzyna w zasięgu/);assert.match(card,/4 dni temu: 12\. Ubywa\./);assert.match(card,/Daj łowisku odpocząć/);
});

test('the forester walks the forest when there is nothing to plant, and in winter with feeders he feeds the herds',()=>{
 const {E}=game();E(HUTS);
 E("__f.state='idle';__lowy.lwObchodGo(__f,__L)");
 assert.equal(E("__f.after"),'obchod');assert.match(E('__f.act'),/obchodzi las/);
 E("S.tech.h_umiar=1;S.tech.h_siano=1;S.tech.h_pasnik=1;S.res.ziarno=20;S.day=Math.floor(S.day/YEAR)*YEAR+2*SD+1.5");
 E("(()=>{const c=bCenter(__L);const h=S.herds.find(h=>lwHuntable(h));h.x=c.x+3;h.z=c.z+3;window.__hh=h;h.n=3;h.fed=undefined;__lowy.lwObchod(__f,__L)})()");
 assert.equal(E('S.res.ziarno'),18);assert.equal(E('__hh.fed'),E('Math.floor(S.day/YEAR)'));assert.ok(LOG(E).some(t=>/wykłada w paśniku siano i ziarno/.test(t)));
 E("S.day=Math.floor(S.day/YEAR)*YEAR+3*SD+.5;__hh.n=3;__hh.max=Math.max(__hh.max,6);__lowy.lwDaily()");assert.ok(E('__hh.n')>=4,'a fed herd has more young in spring');
});

test('the forester advises a break in hunting a weak herd; the player decides',()=>{
 const {runtime,E}=game();E(HUTS);E("S.tech.h_umiar=1;delete S.lwRadaD");
 E("(()=>{const c=bCenter(__M);const h=S.herds.find(h=>lwHuntable(h)&&h.type==='sarna');h.x=c.x+4;h.z=c.z;h.max=8;h.n=2;h.ochr=0;window.__hh=h})()");
 E('__lowy.lwRada()');assert.equal(E("evOpen&&evOpen.ev.ey"),'Rada leśniczego');assert.match(E('$("ev").innerHTML'),/Posłuchać leśniczego/);
 tap(runtime,{o:'0'});
 assert.ok(E('__hh.ochr')>E('S.day'),'the herd is left alone for a few days');assert.equal(E('__lowy.lwProtected(__hh)'),true);
});

test('a forester and a hunter who work near each other learn to leave weak herds alone',()=>{
 const {E}=game();E(HUTS);E("S.wsp=0;S.wspOk=0;for(let k=0;k<8;k++)__lowy.lwDaily()");
 assert.equal(E('S.wspOk'),1);assert.ok(LOG(E).some(t=>/chodzą razem po lesie/.test(t)));
 const h=E("(()=>{const h=S.herds.find(h=>lwHuntable(h));h.max=8;h.n=2;h.ochr=0;return __lowy.lwProtected(h)})()");assert.equal(h,true);
});

test('the council can choose a closed season in spring or a sacred grove where nobody hunts or cuts trees',()=>{
 const {E}=game();
 assert.ok(E("CUST_BY.lowy.o.map(o=>o.id).join()")==='l_wolne,ochronny,gaj');
 E("S.cust.lowy='ochronny';custRebuild();S.day=Math.floor(S.day/YEAR)*YEAR+3*SD+.5");assert.equal(E("__lowy.lwProtected(S.herds.find(h=>lwHuntable(h)))"),true,'nobody hunts in spring');
 E("S.cust.lowy='gaj';custRebuild();for(const r of REGIONS)if(r)r.known=true;S.gaj=null;__lowy.lwGaj()");
 assert.notEqual(E('S.gaj'),null);assert.ok(LOG(E).some(t=>/staje się świętym gajem/.test(t)));
 assert.ok(E("nodeBy.tree.filter(n=>{const r=regionAt(n.i,n.j);return r&&r.id===S.gaj}).every(n=>n.bad===1e12)"),'no woodcutter takes a tree in the grove');
 E("S.cust.lowy='l_wolne';custRebuild();__lowy.lwGaj()");assert.equal(E('S.gaj'),null);assert.ok(E("nodeBy.tree.every(n=>n.bad!==1e12)"));
});

test('wolves at the pen bring a card: a battue thins the pack, or the pen is guarded at night',()=>{
 const {runtime,E}=game();E("(()=>{const b={id:9200,kind:'zagroda',i:camp.i+5,j:camp.j+5,prog:1,work:1,cmp:1,cond:1,ext:[],animals:3};S.bld.push(b);const w=S.herds.find(h=>h.type==='wilk');S.herds.forEach(h=>{if(h.type==='wilk')h.n=0});w.n=4;window.__w=w;delete S.lwWolfD;return 1})()");
 E("log('Wilki w nocy zagryzły kozę w zagrodzie.');__lowy.lwDaily();lwScan()");assert.equal(E("evOpen&&evOpen.ev.t"),'Wilki wrócą');
 E("window.__r=Math.random;Math.random=()=>.9");tap(runtime,{o:'0'});E('Math.random=__r');
 assert.equal(E('__w.n'),3,'one wolf falls');
});
