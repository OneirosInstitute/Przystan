import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.22: wiedza pół na pół — przeczucie z pracy w fachu węzła, próba wybierana przez gracza, jedno badanie naraz
function game(){const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);runtime.game.startGame(true);
 E("closeSheet();S.evT=1e9;if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;openEvent=function(){}");
 E('S.people.forEach(p=>delete p.pam);S.tsrc={}');   // W2: pamięć rozbitków losowa — tu sprawdzamy samą mechanikę prób
 const days=n=>{for(let d=0;d<n;d++)for(let i=0;i<40;i++){E('for(let q=0;q<6;q++)step(1)');E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;if(typeof rdOpen!=='undefined'&&rdOpen)rdClose()")}};
 return {runtime,E,days}}
// tropienie z samej praktyki, potem wędzenie gotowe do próby, materiały w składzie
const READY=`(()=>{S.tp.h_trop=0;__bad.badPractice('mysliwy',999);S.tp.h_wedz=TECH_BY.h_wedz.xp/2;S.res.mieso=40;S.res.drewno=Math.max(S.res.drewno,60);
 const p=S.people.find(p=>p.age>=20&&p.age<50);p.sk.mysliwy=3;S.bsel.h_wedz=p.id;return p.id})()`;

test('work gives a feeling only to the skills of its own craft, at most half; the first row comes from practice alone',()=>{
 const {E}=game();
 E("S.tech.h_trop=1;S.tp={}");
 E("for(let k=0;k<20;k++)techXp('hodowla',5,'mysliwy')");
 assert.ok(E('S.tp.h_wedz')>0,'hunters feel how to smoke meat');assert.equal(E('S.tp.h_sieci||0'),0,'hunting teaches nothing about nets');assert.equal(E('S.tp.u_susz||0'),0,'nor about drying fruit');
 E("for(let k=0;k<200;k++)techXp('hodowla',5,'mysliwy')");
 assert.equal(E('S.tp.h_wedz'),E('TECH_BY.h_wedz.xp/2'),'practice stops at half of the skill');assert.equal(E('S.tech.h_wedz||0'),0,'practice alone does not teach it');
 assert.equal(E("badState(TECH_BY.h_wedz)"),'ready');
 E("S.tp.u_rozp=0;for(let k=0;k<20;k++)techXp('uprawa',5,'zbieracz')");assert.equal(E('S.tech.u_rozp'),1,'recognising plants comes from gathering alone');
 E("S.tp.n_kron=0;techXp('nauka',60,'czytanie')");assert.equal(E('S.tech.n_kron'),1,'the chronicle comes from reading');
 E("S.tp.h_garb=0;techXp('hodowla',100)");assert.equal(E('S.tp.h_garb||0'),0,'experience without a source teaches nothing particular');
 assert.ok(E("TECH.filter(t=>!t.sync).every(t=>__bad.TPRAC[t.id]&&__bad.TPRAC[t.id].length)"),'every skill has a source of practice');
 assert.ok(E("TECH.filter(t=>!t.sync&&!__bad.tRoot(t)).every(t=>__bad.TCOST[t.id])"),'every trial has its materials');
});

test('a trial needs the full feeling, a person with the craft and the materials; it takes the person off work for days',()=>{
 const {E}=game();E("S.tech.h_trop=1;S.tp.h_wedz=10;S.res.mieso=40;S.res.drewno=60");
 assert.match(E("badWhy(TECH_BY.h_wedz,badPick(TECH_BY.h_wedz))"),/^Najpierw przeczucie z pracy/);
 const pid=E(READY);
 E('S.res.mieso=3');assert.match(E("badWhy(TECH_BY.h_wedz,badPick(TECH_BY.h_wedz))"),/^Brakuje: mięso 5/);E('S.res.mieso=40');
 E("S.people.forEach(p=>{p.sk.mysliwy=Math.min(p.sk.mysliwy||0,1);p.sk.rybak=Math.min(p.sk.rybak||0,1)})");assert.match(E("badWhy(TECH_BY.h_wedz,badPick(TECH_BY.h_wedz))"),/^Nikt nie umie dość/);
 E(`pById(${pid}).sk.mysliwy=3`);
 const meat=E('S.res.mieso'),wood=E('S.res.drewno');
 assert.equal(E("badStart('h_wedz')"),'');assert.equal(E('S.res.mieso'),meat-8);assert.equal(E('S.res.drewno'),wood-8);
 assert.equal(E(`pById(${pid}).job`),'bad','the person works only on the trial');assert.equal(E('S.bad[0].pid'),pid);
 assert.equal(E('S.bad[0].ch'),.65,'skill 3 gives 65%');assert.equal(E("badDays(TECH_BY.h_wedz)"),3);
 assert.match(E("S.log[0].t"),/^Zaczyna się próba: wędzenie\. Prowadzi ją .+ \(myśliwy 3\), potrwa ok\. 3 dni\.$/);
});

test('without the school only one study runs at a time, old trials included; with the school up to three',()=>{
 const {E}=game();E(READY);E("S.tech.u_rozp=1;S.tp.u_susz=TECH_BY.u_susz.xp/2;S.res.jagody=99");
 assert.equal(E("badStart('h_wedz')"),'');
 assert.match(E("badStart('u_susz')"),/Na raz trwa jedno badanie/);
 E("badCancel('h_wedz');S.know.active='cegla'");assert.match(E("badStart('u_susz')"),/Na raz trwa jedno badanie/,'the old brick trial takes the place too');
 E("S.know.active=null;S.tech.n_szkola=1");assert.equal(E('badSlots()'),3);
 assert.equal(E("badStart('h_wedz')"),'');assert.equal(E("badStart('u_susz')"),'');assert.equal(E('S.bad.length'),2);
});

test('a successful trial teaches the settlement and the person goes back to the old work',()=>{
 const {E,days}=game();const pid=E(READY);
 const wb=E(`(()=>{const p=pById(${pid});const b=S.bld.find(b=>bDone(b)&&BD[b.kind].wk);if(!b)return null;p.job='wb';p.wb=b.id;b.want=Math.max(b.want||0,1);return b.id})()`);
 E("window.__r=Math.random;Math.random=()=>0");assert.equal(E("badStart('h_wedz')"),'');
 E(`(()=>{const b=S.bad[0];b.prog=b.need-.01;const p=pById(${pid});p.state='work';p.workKind='bad';S.day=Math.floor(S.day)+.5;stepPerson(p,1)})()`);E('Math.random=__r');
 assert.equal(E('S.tech.h_wedz'),1);assert.equal(E('S.bad.length'),0);
 if(wb!==null){assert.equal(E(`pById(${pid}).job`),'wb');assert.equal(E(`pById(${pid}).wb`),wb)}else assert.notEqual(E(`pById(${pid}).job`),'bad');
 assert.ok(S_log(E).some(t=>/^Próba udana: wędzenie\./.test(t)));assert.ok(S_log(E).some(t=>/^Postęp \(hodowla\): Wędzenie\./.test(t)));
 days(1);assert.equal(E("S.people.filter(p=>p.job==='bad').length"),0);
});
const S_log=E=>JSON.parse(E('JSON.stringify(S.log.slice(0,12).map(l=>l.t))'));

test('a failed trial takes the materials but the next one is surer; some failures cost more',()=>{
 const {E}=game();const pid=E(READY);
 E("window.__r=Math.random;Math.random=()=>.99");assert.equal(E("badStart('h_wedz')"),'');const ch=E('S.bad[0].ch');
 E(`(()=>{const b=S.bad[0];b.prog=b.need;__bad.badFinish(b)})()`);
 assert.equal(E('S.tech.h_wedz||0'),0);assert.equal(E('S.tfail.h_wedz'),1);
 assert.ok(E(`badChance(TECH_BY.h_wedz,pById(${pid}))`)>ch+.19,'the second trial is surer');
 assert.match(S_log(E)[0],/^Próba nieudana: wędzenie\. Materiały przepadły, ale .+ wie już więcej: następnym razem pójdzie pewniej\.$/);
 // oswajanie kóz: czasem rana
 E(`(()=>{S.tp.h_zagr=TECH_BY.h_zagr.xp/2;S.res.jagody=50;const p=pById(${pid});p.hp=1;p.sk.hodowca=2;S.bsel.h_zagr=p.id})()`);
 E('Math.random=()=>0');assert.equal(E("badStart('h_zagr')"),'');E('window.__k=0;Math.random=()=>(__k++===0?.99:.1)');E('(()=>{const b=S.bad[0];b.prog=b.need;__bad.badFinish(b)})()');E('Math.random=__r');
 assert.ok(E(`pById(${pid}).hp`)<.8,'taming wild goats can hurt');assert.match(S_log(E)[0],/poturbowan/);
});

test('stopping a trial gives the materials back; the queue starts the next study by itself',()=>{
 const {E}=game();const pid=E(READY);const meat=E('S.res.mieso');
 assert.equal(E("badStart('h_wedz')"),'');E("badCancel('h_wedz')");assert.equal(E('S.res.mieso'),meat);assert.notEqual(E(`pById(${pid}).job`),'bad');
 E("S.tech.u_rozp=1;S.tp.u_susz=10;S.res.jagody=99;badQueue('u_susz',true)");assert.equal(E('S.bad.length'),0,'not before the feeling is full');
 assert.equal(E("badStart('h_wedz')"),'');E("S.tp.u_susz=TECH_BY.u_susz.xp/2");E('badAuto()');assert.equal(E('S.bad.length'),1,'the slot is taken');
 E("(()=>{const b=S.bad[0];b.prog=b.need;__bad.badFinish(b)})()");assert.deepEqual(JSON.parse(E('JSON.stringify(S.bad.map(b=>b.id))')),['u_susz'],'the queued study started');
 assert.deepEqual(JSON.parse(E('JSON.stringify(S.bq)')),[]);
});

test('when the person dies another one takes the trial over, or it waits',()=>{
 const {E}=game();const pid=E(READY);assert.equal(E("badStart('h_wedz')"),'');
 E(`(()=>{const q=S.people.find(p=>p.id!==${pid}&&p.age>=20);q.sk.mysliwy=2;killPerson(pById(${pid}),'z choroby');__bad.badWatch()})()`);
 assert.equal(E('S.bad.length'),1);assert.notEqual(E('S.bad[0].pid'),null);assert.equal(E('pById(S.bad[0].pid).job'),'bad');assert.match(S_log(E)[0],/nie może dalej prowadzić próby \(wędzenie\)\. Przejmuje ją /);
 E("S.people.forEach(p=>{if(p.id!==S.bad[0].pid){p.sk.mysliwy=0;p.sk.rybak=0}});killPerson(pById(S.bad[0].pid),'z choroby');__bad.badWatch()");
 assert.equal(E('S.bad[0].pid'),null);assert.match(S_log(E)[0],/stanęła: nie ma kto jej prowadzić/);
});

test('an old save moves over: points become a feeling up to half, the chosen goal is queued, the bank is gone',()=>{
 const {E}=game();
 const raw=E(`(()=>{S.tech.h_trop=1;S.tp.h_wedz=80;S.tp.h_zagr=20;S.focus={hodowla:'h_wedz'};S.bank={uprawa:40};delete S.bad;delete S.bq;delete S.badV;return serializeSave()})()`);
 const other=createGame({search:'?seed=2207'});const O=s=>other.evaluate(s);other.game.startGame(true);
 O(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw)});boot(false)})()`);
 assert.equal(O('S.tp.h_wedz'),O('TECH_BY.h_wedz.xp/2'));assert.equal(O('S.tp.h_zagr'),20);
 assert.deepEqual(JSON.parse(O('JSON.stringify(S.bq)')),['h_wedz']);assert.equal(O("'bank' in S"),false);assert.equal(O("badState(TECH_BY.h_wedz)"),'kol');
 // stan próby przechodzi przez zapis
 O(READY.replace('S.tp.h_trop=0;__bad.badPractice(\'mysliwy\',999);',''));assert.equal(O("badStart('h_wedz')"),'');
 assert.equal(O('validateSave(JSON.parse(serializeSave()))'),true);const pid=O('S.bad[0].pid');
 const raw2=O('serializeSave()');const third=createGame({search:'?seed=2207'});third.game.startGame(true);
 assert.equal(third.evaluate(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw2)});boot(false);return S.bad.length===1&&pById(${pid}).job==='bad'})()`),true);
});

test('the knowledge tab shows the studies, the feeling and the trial with person, materials, time and chance',()=>{
 const {runtime,E}=game();E(READY);
 E("openSheet('wiedza');techDom='hodowla';techSel='h_wedz';renderPanel()");let html=runtime.elements.get('body').innerHTML;
 assert.match(html,/Badania <small class="mut">0 z 1<\/small>/);assert.match(html,/data-bgo="h_wedz"/,'a ready skill is offered');
 assert.match(html,/można próbować/);assert.match(html,/Przeczucie z pracy: 100%/);assert.match(html,/Próba:<\/b> 3 dni pracy jednej osoby/);
 assert.match(html,/Szansa: 65%/);assert.match(html,/mięso 8/);assert.match(html,/data-bstart="h_wedz"/);
 E("badStart('h_wedz')");E('renderPanel()');html=runtime.elements.get('body').innerHTML;
 assert.match(html,/Badania <small class="mut">1 z 1<\/small>/);assert.match(html,/data-bcancel="h_wedz"/);assert.match(html,/próba 0%/);
 E("S.tech.u_rozp=1;techDom='uprawa';techSel='u_susz';renderPanel()");html=runtime.elements.get('body').innerHTML;assert.match(html,/data-bq="u_susz"/,'a later study can be queued');
});
