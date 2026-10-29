import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.23: źródła wiedzy — pamięć rozbitków, ślady dawnego ludu, przypadki, przysiółki, mgła wiedzy, podpowiedzi przy ogniu
function game(o){const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);if(o&&o.e2)E('E2START=true');runtime.game.startGame(true);
 E("closeSheet();S.evT=1e9;if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;openEvent=function(){}");return {runtime,E}}
const LOG=E=>JSON.parse(E('JSON.stringify(S.log.slice(0,10).map(l=>l.t))'));
// osoba bez fachu myśliwego, która pamięta wędzenie z domu
const REM=`(()=>{S.tech.h_trop=1;S.people.forEach(p=>delete p.pam);S.tsrc={};const p=S.people.find(p=>p.age>=20&&p.age<50);p.sk.mysliwy=0;p.sk.rybak=0;p.trait='Pogodny';p.pam=['h_wedz'];
 const q=S.people.find(q=>q!==p&&q.age>=20);q.sk.mysliwy=3;S.res.mieso=40;S.res.drewno=60;window.__p=p;window.__q=q;return p.id})()`;

test('every grown castaway remembers one or two things from home, and the card shows it',()=>{
 const {runtime,E}=game();
 const r=JSON.parse(E(`JSON.stringify(S.people.filter(p=>!p.born&&p.age>=16).map(p=>({n:(p.pam||[]).length,old:p.age>=40,ok:(p.pam||[]).every(id=>TECH_BY[id]&&!TECH_BY[id].sync&&tEp(TECH_BY[id])<=2)})))`));
 assert.ok(r.length>=10);assert.ok(r.every(x=>x.n===(x.old?2:1)),JSON.stringify(r));assert.ok(r.every(x=>x.ok));
 assert.equal(E('S.people.filter(p=>p.age<16&&p.pam).length'),0,'children do not remember home');
 const id=E('S.people.find(p=>p.pam).id');E(`select(${id});renderSel()`);assert.match(runtime.elements.get('sel').innerHTML,/Pamięta z domu: /);
 E('zrPamInit()');assert.equal(E('S.people.filter(p=>p.pam).length'),r.length,'memories are given once');
});

test('a living castaway who remembers lets the trial start at half the feeling; leading it costs half and goes surer',()=>{
 const {E}=game();E(REM);
 E('S.tp.h_wedz=TECH_BY.h_wedz.xp/4');assert.equal(E("badState(TECH_BY.h_wedz)"),'ready','half of the feeling is enough');
 assert.equal(E("badPick(TECH_BY.h_wedz)===__p"),true,'the one who remembers leads, even without the craft');
 assert.deepEqual(JSON.parse(E("JSON.stringify(badCost(TECH_BY.h_wedz,__p))")),{mieso:4,drewno:4});assert.deepEqual(JSON.parse(E("JSON.stringify(badCost(TECH_BY.h_wedz,__q))")),{mieso:8,drewno:8});
 assert.equal(E("Math.round(100*badChance(TECH_BY.h_wedz,__p))"),75,'50% base, +15 for the source, +10 for leading it yourself');
 assert.match(E("zrSrcHTML(TECH_BY.h_wedz)"),/pamięta to z domu/);
 assert.equal(E("badStart('h_wedz')"),'');assert.match(LOG(E)[0],/Prowadzi ją .+, (który|która) pamięta to z domu, potrwa ok\. 2 dni\.$/);
});

test('when the one who remembers dies, the memory is gone and the full feeling is needed again',()=>{
 const {E}=game();E(REM);E('S.tp.h_wedz=TECH_BY.h_wedz.xp/4');
 E("killPerson(__p,'z choroby')");assert.ok(LOG(E).some(t=>/^.+ (zabrał|zabrała) do grobu pamięć z domu: wędzenie\. Tego nikt już nie pamięta\.$/.test(t)),LOG(E).join('|'));
 assert.equal(E("badState(TECH_BY.h_wedz)"),'czuje');assert.equal(E("zrSrc(TECH_BY.h_wedz).length"),0);
});

test('a trace of the old people gives the full feeling and a cheaper, surer trial, not the knowledge itself',()=>{
 const {E}=game();E('S.people.forEach(p=>delete p.pam);S.tsrc={};S.tech.r_ciesla=1;S.know.cegla="tak"');
 E('sladDo(3)');assert.equal(E('S.tech.r_garn||0'),0,'no knowledge from nothing');assert.equal(E('S.tp.r_garn'),E('TECH_BY.r_garn.xp/2'));
 assert.equal(E('S.tsrc.r_garn.k'),'slad');assert.deepEqual(JSON.parse(E("JSON.stringify(badCost(TECH_BY.r_garn,null))")),{glina:6,drewno:4});
 assert.match(E("zrSrcHTML(TECH_BY.r_garn)"),/ślad dawnego ludu/);
});

test('chance events give an idea: a fire teaches about fired clay, wolves at the pen about a palisade',()=>{
 const {E}=game();E('S.people.forEach(p=>delete p.pam);S.tsrc={};S.tech.r_ciesla=1;S.know.cegla="tak";S.tech.r_cegla=1;S.tech.h_trop=1;S.tech.h_zagr=1;zrEvents()');
 E("log('Pożar! Pali się drewutnia. Ludzie biegną z wiadrami.');log('Wilki w nocy zagryzły kozę w zagrodzie.');zrEvents()");
 assert.equal(E('S.tsrc.r_garn.k'),'ev');assert.equal(E('S.tsrc.h_ostr.k'),'ev');assert.equal(E("badState(TECH_BY.h_ostr)"),'ready');
 assert.ok(LOG(E).some(t=>/^W popiele po pożarze/.test(t)));
 const n=E('S.log.length');E("log('Wilki w nocy zagryzły kozę w zagrodzie.');zrEvents()");assert.equal(E('S.log.length'),n+1,'each idea comes once');
});

test('from epoch II a hamlet knows something by its land, and its carts bring the feeling',()=>{
 const {E}=game({e2:true});
 const r=JSON.parse(E(`JSON.stringify((()=>{const h=S.hamlets[0];if(!h)return null;h.wz=null;h.wiez=.5;zrHamDaily();const t=TECH_BY[h.wz];if(!t)return{none:1};
  const before=S.tp[t.id]||0;S.tsrc={};delete S.tsrc[h.wz];zrHamDaily();cartArrive({h:h.id,dir:-1});return{id:h.wz,ty:hType(h),src:S.tsrc[h.wz],grew:(S.tp[t.id]||0)>=before,list:__zr.ZR_HAM[hType(h)]}})())`));
 assert.ok(r,'the ready village has a hamlet');if(r.none)return;
 assert.ok(r.list.includes(r.id));assert.equal(r.src.k,'przys');assert.equal(r.grew,true);
});

test('the fog of knowledge: deeper skills show only their name with a question mark',()=>{
 const {runtime,E}=game();E("openSheet('wiedza');techDom='hodowla';techSel='h_doj';renderPanel()");const html=runtime.elements.get('body').innerHTML;
 assert.equal(E('techFog(TECH_BY.h_zagr)'),false,'one row further is visible');assert.equal(E('techFog(TECH_BY.h_doj)'),true);
 assert.match(html,/Dojenie i ser \?/);assert.doesNotMatch(html,/Mleko zsiadłe, potem ser/,'no description before its predecessor is known');assert.match(html,/Więcej będzie wiadomo, gdy osada pozna: Oswajanie kóz/);
});

test('when a feeling is full someone of the craft says so by the evening fire',()=>{
 const {E}=game();E("S.people.forEach(p=>delete p.pam);S.tsrc={};S.bhint=[];S.tnote={};S.tech.h_trop=1;S.people.find(p=>p.age>=20).sk.rybak=3;S.tp.h_wedz=TECH_BY.h_wedz.xp/2;badReadyNote(TECH_BY.h_wedz)");
 const L=JSON.parse(E('JSON.stringify(czTalkLines())'));assert.equal(L[0][0],__HINT);assert.ok(E(`!!S.people.find(p=>p.name===${JSON.stringify(L[0][1])})`));
 assert.equal(E('S.bhint.length'),0,'said once');
});
const __HINT='Ryby, które wisiały nad ogniskiem, wytrzymały dłużej niż reszta. Może dym je chroni.';
