import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

function fixture(){
 const runtime=createGame();
 runtime.evaluate(`S=freshState();S.day=.4;S.wreck.gone=1;S.know.kuznia='tak';walk.fill(1);reach.fill(1);rev.fill(1);
 const ore=nodeBy.ruda.find(node=>mkUsable(node));globalThis.oreId=ore.id;
 const smithy={id:501,kind:'kuznia',i:ore.i+2,j:ore.j,prog:12,work:12,cmp:1,lv:1,cond:1,want:1};S.bld.push(smithy);
 S.res.ruda=0;S.res.wegiel=8;S.res.narz=0;S.res.gwozdzie=0;
 const worker=S.people[0];worker.x=ore.x;worker.z=ore.z;worker.job='wb';worker.wb=501;worker.hp=1;worker.state='idle';worker.wait=0;`);
 return runtime;
}

test('an ore-starved smith collects real ore instead of unrelated village chores',()=>{
 const runtime=fixture();runtime.evaluate('planJob(S.people[0])');const worker=runtime.game.S.people[0];
 assert.equal(worker.tgt?.type,'ruda');assert.equal(worker.job,'wb');assert.equal(worker.wb,501);
 assert.match(worker.act,/zaopatrz|rudy|rudę/i);assert.equal(runtime.game.S.res.ruda,0);
});

test('supply work is slower than professional gathering and conserves the source and delivery',()=>{
 const runtime=fixture();runtime.evaluate('planJob(S.people[0]);S.people[0].path=null;S.people[0].after="mark";onArrive(S.people[0])');
 const before=runtime.evaluate('nodes[oreId].amt');
 const effort=runtime.evaluate('(()=>{const person=S.people[0];const start=person.wt;stepPerson(person,1);return person.wt-start})()');
 const professional=runtime.evaluate('eff(S.people[0])*craftEff(S.people[0],BD.ruda.c)');
 assert.ok(Math.abs(effort/professional-.55)<1e-8);
 runtime.evaluate('for(let tick=0;tick<1500&&!S.people[0].carry;tick++)stepPerson(S.people[0],.1)');
 assert.equal(runtime.evaluate('nodes[oreId].amt'),before-1);assert.equal(runtime.game.S.res.ruda,0);
 assert.equal(runtime.game.S.people[0].carry[0].res,'ruda');assert.equal(runtime.game.S.people[0].carry[0].q,1.5);
 runtime.evaluate('for(let tick=0;tick<3000&&S.people[0].carry;tick++)stepPerson(S.people[0],.1)');
 assert.equal(runtime.game.S.res.ruda,1.5);assert.equal(runtime.game.S.people[0].carry,null);
});

test('meeting every configured output target returns the crew to village help even with empty inputs',()=>{
 const runtime=fixture();runtime.evaluate('bById(501).lim=10;S.res.narz=10;S.res.gwozdzie=10;S.res.wegiel=0;planJob(S.people[0])');
 const worker=runtime.game.S.people[0];assert.equal(worker.supply,undefined);assert.ok(worker.limC);
 assert.notEqual(worker.tgt?.type,'ruda');assert.match(worker.act,/zapas pełny/);
});

test('exhausted sources are not invented or replaced by social work',()=>{
 const runtime=fixture();runtime.evaluate("for(const node of nodeBy.ruda)node.amt=0;planJob(S.people[0])");
 assert.equal(runtime.game.S.res.ruda,0);assert.match(runtime.game.S.people[0].act,/brak.*źródła|brak.*rudy/i);
 assert.equal(runtime.game.S.people[0].chK,null);
});

test('hidden, claimed and unreachable deposits are excluded without creating resources',()=>{
 const runtime=fixture();
 for(const mode of ['hidden','claimed','unreachable']){
  runtime.evaluate(`release(S.people[0]);S.people[0].path=null;S.people[0].state='idle';S.people[0].wait=0;for(const node of nodeBy.ruda){node.amt=node.id===oreId?10:0;node.claim=${mode==='claimed'?1:0}};rev.fill(${mode==='hidden'?0:1});walk.fill(${mode==='unreachable'?0:1});reach.fill(${mode==='unreachable'?0:1});planJob(S.people[0])`);
  assert.equal(runtime.game.S.people[0].supply,undefined,mode);assert.equal(runtime.game.S.res.ruda,0,mode);assert.equal(runtime.game.S.people[0].chK,null,mode);
 }
});

test('manual reassignment releases the claimed source and abandons the supply role',()=>{
 const runtime=fixture();runtime.evaluate('planJob(S.people[0])');const nodeId=runtime.game.S.people[0].tgt.id;
 runtime.evaluate("czSetJob(S.people[0],'rob');stepPerson(S.people[0],.1)");
 assert.equal(runtime.evaluate(`nodes[${nodeId}].claim`),0);assert.equal(runtime.game.S.people[0].supply,undefined);assert.equal(runtime.game.S.people[0].job,'rob');
});

test('suppliers relinquish the source and return to production when another delivery resolves the shortage',()=>{
 const runtime=fixture();runtime.evaluate('planJob(S.people[0])');const nodeId=runtime.game.S.people[0].tgt.id;
 assert.equal(runtime.evaluate(`nodes[${nodeId}].claim`),1);
 runtime.evaluate('S.res.ruda=3;stepPerson(S.people[0],.1)');
 assert.equal(runtime.evaluate(`nodes[${nodeId}].claim`),0);assert.equal(runtime.game.S.people[0].supply,undefined);
 runtime.evaluate('planJob(S.people[0])');assert.equal(runtime.game.S.people[0].after,'prod');
});

test('upstream charcoal shortage targets wood only through an existing charcoal kiln',()=>{
 const runtime=fixture();runtime.evaluate("S.res.ruda=3;S.res.wegiel=0;S.res.drewno=0;S.bld.push({id:502,kind:'mielerz',i:camp.i+4,j:camp.j,prog:5,work:5,cmp:1,cond:1});");
 const shortage=runtime.evaluate('productionSupplyState(bById(501))');assert.equal(shortage.needs[0].resource,'drewno');
 runtime.evaluate("S.bld=S.bld.filter(building=>building.id!==502)");
 assert.match(runtime.evaluate('productionSupplyState(bById(501)).reason'),/mielerz|Mielerz/);assert.equal(runtime.evaluate('productionSupplyState(bById(501)).requiredBuilding'),'mielerz');
});

test('a supply delivery survives restart and returns to the original workshop without double harvest',()=>{
 const runtime=fixture();runtime.evaluate('planJob(S.people[0]);S.people[0].path=null;S.people[0].after="mark";onArrive(S.people[0]);for(let tick=0;tick<1500&&!S.people[0].carry;tick++)stepPerson(S.people[0],.1);save();S=load()');
 const source=runtime.evaluate('nodes[oreId].amt');assert.equal(runtime.game.S.people[0].wb,501);
 runtime.evaluate('for(let tick=0;tick<3000&&S.people[0].carry;tick++)stepPerson(S.people[0],.1)');
 assert.equal(runtime.game.S.res.ruda,1.5);assert.equal(runtime.evaluate('nodes[oreId].amt'),source);assert.equal(runtime.game.S.people[0].wb,501);
});
