import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createGame} from './runtime.mjs';
const require=createRequire(import.meta.url),world=require('../src/p_e4_world.js'),domain=require('../src/p_e4_domain.js'),economy=require('../src/p_e4_economy.js'),catalog=require('../src/p_e4_catalog.js');

// 4.7.0: drzewo postępu rośnie z każdą epoką, a część nowych umiejętności otwiera rozbudowy budynków
function village(epoch){const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 if(epoch>=2)E("S.epoch=2;S.path='dom';e2Init();closeSheet()");if(epoch>=3)E('e3Start();closeSheet()');return {runtime,E}}

test('each epoch adds three skills in every domain and they open only when the settlement reaches that epoch',()=>{
 const {runtime,E}=village(1);
 const counts=JSON.parse(E("JSON.stringify(DOMS.map(d=>[2,3].map(e=>TECH.filter(t=>t.d===d[0]&&tEp(t)===e).length)))"));
 assert.deepEqual(counts,[[3,3],[3,3],[3,3],[5,3]],'4.9.0-rc.24: hodowla ma w epoce II także paśniki i gajówkę');
 assert.equal(E("TECH.filter(t=>tEp(t)>1).every(t=>t.req.every(r=>TECH_BY[r]&&tEp(TECH_BY[r])<=tEp(t)))"),true,'nothing depends on a later epoch');
 assert.equal(E("techState(TECH_BY.u_radlo)"),'ep');assert.equal(E("techTarget('uprawa')"),undefined,'at the end of epoch I all its skills are known and the next ones wait');
 E("openSheet('wiedza')");const html=runtime.elements.get('body').innerHTML;
 assert.match(html,/Epoka II · Wieś/);assert.match(html,/Radło z lemieszem/);assert.doesNotMatch(html,/data-tn="u_radlo"/,'epoch II nodes are only announced');
 assert.equal(E('S.tech.u_radlo||0'),0,'the ready village of epoch I does not get epoch II skills for free');
});

test('in epoch II work experience flows into the new skills and epoch III stays closed',()=>{
 const {runtime,E}=village(2);
 assert.equal(E('epNow()'),2);assert.equal(E("techTarget('nauka').id"),'n_rach');assert.equal(E("techState(TECH_BY.u_mlyn)"),'ep');
 E('(()=>{for(let n=0;n<DAY*3*4;n++)step(1/4)})()');
 assert.ok(E("DOMS.every(d=>TECH.some(t=>t.d===d[0]&&tEp(t)===2&&(S.tp[t.id]||0)>0))"),'every domain gains experience toward epoch II');
 E("openSheet('wiedza')");const html=runtime.elements.get('body').innerHTML;
 assert.match(html,/data-tall="1"/,'the finished epoch I folds into one line');assert.match(html,/data-tn="u_radlo"/);
 E("techAll=true;renderPanel()");assert.match(runtime.elements.get('body').innerHTML,/data-tn="u_rozp"/);
 const before=E("S.dxp.nauka||0");E("techXp('nauka',100)");const plain=E("S.dxp.nauka")-before;
 E("S.tech.n_rach=1");const b2=E("S.dxp.nauka");E("techXp('nauka',100)");assert.ok(Math.abs(E("S.dxp.nauka")-b2-plain*1.1)<1e-6,'counting on notches gives 10% more experience');
});

test('the quick start of epoch III knows epoch II and learns epoch III',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true;E3START=true;boot(true);closeSheet()');
 assert.equal(E('epNow()'),3);assert.equal(E("TECH.filter(t=>tEp(t)===2).every(t=>S.tech[t.id])"),true);
 assert.equal(E("TECH.filter(t=>tEp(t)===3).some(t=>S.tech[t.id])"),false);assert.equal(E("techTarget('uprawa').id"),'u_mlyn');
});

test('skills change the economy where they say they do',()=>{
 const {E}=village(2);
 const b=JSON.parse(E(`(()=>{const k=S.bld.find(b=>b.kind==='kuznia'&&bDone(b)),w=wearRate(k),s=extSlots(k),h=S.hamlets[0];hamPath[h.id]=hamPath[h.id]||{len:120};const r=roadCost(h);
  const l=lvCost(k,3),c=foodCap();S.tech.r_gont=1;S.tech.r_czeladz=1;S.tech.n_miern=1;S.tech.r_zaprawa=1;
  return JSON.stringify({w:wearRate(k)/w,s:[s,extSlots(k)],r:[r.drewno,roadCost(h).drewno,r.dni,roadCost(h).dni],l:[l.deski,lvCost(k,3).deski],house:extSlots(S.bld.find(b=>b.kind==='chata'&&bDone(b)))})})()`));
 assert.ok(Math.abs(b.w-.7)<1e-9,'shingles slow down wear');assert.equal(b.s[1],b.s[0]+1,'journeymen give one more extension place');assert.equal(b.house,5,'houses keep their own limit');
 assert.ok(b.r[1]<b.r[0]&&b.r[3]<=b.r[2],'surveying makes roads cheaper and faster');assert.ok(b.l[1]<b.l[0],'lime mortar makes level 3 cheaper');
 const m=JSON.parse(E(`(()=>{const b=S.bld.find(b=>b.kind==='serownia'&&bDone(b))||S.bld.find(b=>b.kind==='zarna'&&bDone(b));if(!b)return 'null';const k=b.kind,a=bMul(b);S.tech.h_ser=1;S.tech.u_mlyn=1;return JSON.stringify({k,r:bMul(b)/a})})()`));
 if(m)assert.ok(m.r>1.25,'workshops of the skill work faster');
});

test('a building extension that needs knowledge shows what to learn and cannot be started before',()=>{
 const {E}=village(2);E('S.res.drewno=500;S.res.deski=500;S.res.gwozdzie=500;S.res.narz=50;S.res.kamien=500');
 const pen=E("(()=>{const b=S.bld.find(b=>b.kind==='zagroda'&&bDone(b));return b?b.id:-1})()");assert.ok(pen>=0,'the ready village has a pen');
 const html=E(`bldPanelHTML(bById(${pen}))`);assert.match(html,/Kojec/);assert.match(html,/Siano na zimę/);assert.doesNotMatch(html,/data-eid="kojec"/);
 const wood=E('S.res.drewno');E(`startProj(bById(${pen}),'ext','kojec')`);assert.ok(!E(`bById(${pen}).proj`),'no project without the skill');assert.equal(E('S.res.drewno'),wood,'nothing is paid');
 E('S.tech.h_siano=1');assert.match(E(`bldPanelHTML(bById(${pen}))`),/data-eid="kojec"/);
 E(`(()=>{const b=bById(${pen});b.ext=(b.ext||[]).filter(x=>x!=='kojec');if((b.ext||[]).length>=extSlots(b))b.lv=3;b.proj=null;startProj(b,'ext','kojec');b.proj.prog=b.proj.work;finishProj(b)})()`);
 assert.equal(E(`hasExt(bById(${pen}),'kojec')`),true);assert.equal(E(`penCap(bById(${pen}))`),E(`hasExt(bById(${pen}),'wybieg')`)?20:14);
 assert.equal(E(`penSlots(bById(${pen})).length`),E(`penCap(bById(${pen}))`),'every goat has its own place');
 const raw=E('serializeSave()');assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
 const other=createGame();other.game.startGame(true);assert.equal(other.evaluate(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw)});boot(false);return hasExt(bById(${pen}),'kojec')&&!!S.tech.h_siano})()`),true);
});

test('workshops of later epochs got their first extension and new extensions have their look',()=>{
 const {E}=village(1);
 assert.equal(E("['zarna','piekarnia','serownia','kiszarnia','browar','wiatrak','kopalnia','lom','szybw'].every(k=>(EXT[k]||[]).some(e=>e.id==='stol'))"),true);
 assert.equal(E("['brona','inspekt','sieci','kojec','polki','strych','suszz','stajnia','solarnia','kolowrot','grzedy'].every(id=>typeof EXTV[id]==='function')"),true);
 assert.equal(E("Object.values(EXT).flat().filter(e=>e.need).every(e=>TECH_BY[e.need])"),true,'every requirement is a real skill');
 E("(()=>{const g=new THREE.Group();['brona','inspekt','sieci','kojec','polki','strych','suszz','stajnia','solarnia','kolowrot','grzedy'].forEach(id=>EXTV[id](g,1,1));return g.children.length})()");
});

function e4State(){const runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit();S.wozy=3');const source=JSON.parse(runtime.evaluate('serializeSave()'));for(const resource of ['suchary','drewno','deski','kamien','narz','opal','ziarno','plotno'])source.res[resource]=3000;
 const state=domain.migrate(source,{world:world.create({seed:2207,town:{x:0,z:50}})});state.e4.settlements.przystan.capacity=100000;return state}

test('epoch IV learns by the work of a settlement: one study at a time, paid once, then it works for every estate',()=>{
 const state=e4State();economy.ensure(state);assert.deepEqual(state.e4.nauki,{done:{},active:null});
 assert.equal(Object.keys(catalog.research).length,8);
 assert.equal(economy.study(state,'przystan','e4_goscince').ok,false,'a later study needs the earlier one');
 const deski=state.res.deski;const r=economy.study(state,'przystan','e4_ksiegi');assert.equal(r.ok,true,r.reason);assert.equal(state.res.deski,deski-4);
 assert.equal(economy.study(state,'przystan','e4_rama').ok,false,'only one study at a time');
 const cap=state.e4.settlements.przystan.capacity;
 economy.advance(state,12);assert.equal(domain.validate(state),true);
 assert.ok(state.e4.nauki.done.e4_ksiegi!==undefined,'people learnt it with their work');assert.equal(state.e4.nauki.active,null);
 assert.ok(state.e4.events.some(event=>event.type==='research'&&/księgi rachunkowe/i.test(event.text)));
 assert.equal(economy.known(state,'e4_ksiegi'),true);assert.equal(state.e4.settlements.przystan.capacity,cap,'the stored capacity itself is unchanged');
 const restored=JSON.parse(JSON.stringify(state));economy.ensure(restored);assert.equal(economy.known(restored,'e4_ksiegi'),true);assert.equal(domain.validate(restored),true);
 assert.equal(economy.study(state,'przystan','e4_ksiegi').ok,false,'nothing is learnt twice');
});

test('an epoch IV save without studies stays valid and a broken study is rejected',()=>{
 const state=e4State();economy.ensure(state);delete state.e4.nauki;assert.equal(domain.validate(state),true);economy.ensure(state);assert.ok(state.e4.nauki);
 state.e4.nauki.active={id:7};assert.equal(domain.validate(state),false);
});
