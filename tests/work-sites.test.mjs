import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
function fixture(kind='pracownia'){
 const runtime=createGame();runtime.evaluate(`S=freshState();S.day=15.4;S.wreck.gone=1;S.people=S.people.slice(0,3);walk.fill(1);reach.fill(1);rev.fill(1);occ.fill(-1);
 const definition=BD['${kind}'];const building={id:501,kind:'${kind}',i:110,j:100,prog:definition.work,work:definition.work,cond:1,lv:1,want:3};if(definition.field)building.field={st:'dojrzale',g:1,q:1,left:30,fert:1};S.bld=[building];
 for(let i=building.i;i<building.i+definition.w;i++)for(let j=building.j;j<building.j+definition.h;j++)walk[j*N+i]=0;
 S.res.drewno=100;S.res.deski=0;S.res.ruda=20;S.res.wegiel=20;S.res.narz=0;
 for(const person of S.people){person.job='wb';person.wb=501;person.hp=1;person.state='idle';person.path=null;person.carry=null;person.wait=0;person.x=tcx(105);person.z=tcx(100)}
 globalThis.arriveAtWork=person=>{for(let count=0;count<3000&&person.state==='move';count++)movePerson(person,.05)};`);return runtime;
}
test('a fully occupied workshop waits instead of assigning its last station twice',()=>{
 const runtime=fixture();const outcome=runtime.evaluate(`(()=>{walk.fill(0);walk[99*N+109]=1;for(const person of S.people){person.x=tcx(109);person.z=tcx(99)}const first=go(S.people[0],[109,99],'prod',bById(501)),second=go(S.people[1],[109,99],'prod',bById(501));return {first,second}})()`);
 assert.equal(outcome.first,true);assert.equal(outcome.second,false);
});
test('another side of a workshop remains usable when the preferred entrance is disconnected',()=>{
 const runtime=fixture();const outcome=runtime.evaluate(`(()=>{walk.fill(0);walk[99*N+109]=1;walk[101*N+112]=1;walk[101*N+113]=1;const person=S.people[0];person.x=tcx(113);person.z=tcx(101);const planned=go(person,[109,99],'prod',bById(501));arriveAtWork(person);return {planned,state:person.state,tile:tileOf(person.x,person.z)}})()`);
 assert.equal(outcome.planned,true);assert.equal(outcome.state,'work');assert.deepEqual(Array.from(outcome.tile),[112,101]);
});
test('a distant or stale production pose earns no materials before reaching the workshop',()=>{
 const runtime=fixture();const outcome=runtime.evaluate(`(()=>{const person=S.people[0];go(person,[109,99],'prod',bById(501));arriveAtWork(person);person.x=tcx(80);person.z=tcx(80);person.wt=100;const wood=S.res.drewno;stepPerson(person,.2);return {wood:S.res.drewno,before:wood,planks:S.res.deski,state:person.state}})()`);
 assert.equal(outcome.wood,outcome.before);assert.equal(outcome.planks,0);assert.notEqual(outcome.state,'work');
});
test('a critically ill worker releases production before earning more work',()=>{
 const runtime=fixture();const outcome=runtime.evaluate(`(()=>{const person=S.people[0];go(person,[109,99],'prod',bById(501));arriveAtWork(person);S.laws.odpoczynek=true;person.hp=.1;person.wt=100;stepPerson(person,.2);return {planks:S.res.deski,target:person.tgt?.id,after:person.after,kind:person.workKind}})()`);
 assert.equal(outcome.planks,0);assert.notEqual(outcome.target,501);assert.notEqual(outcome.kind,'prod');
});
test('a changed job cannot complete an old workshop operation',()=>{
 const runtime=fixture();const outcome=runtime.evaluate(`(()=>{const person=S.people[0];go(person,[109,99],'prod',bById(501));arriveAtWork(person);person.job='rob';person.wb=null;person.wt=100;stepPerson(person,.2);return {planks:S.res.deski,kind:person.workKind}})()`);
 assert.equal(outcome.planks,0);assert.notEqual(outcome.kind,'prod');
});
test('field work waits if its worker has lost access to every work position',()=>{
 const runtime=fixture('pole');const outcome=runtime.evaluate(`(()=>{const person=S.people[0];go(person,[109,99],'field',bById(501));arriveAtWork(person);const harvest=bById(501).field.left;walk.fill(0);walkRevision++;person.wt=100;stepPerson(person,.2);return {harvest,balance:bById(501).field.left,carry:person.carry}})()`);
 assert.equal(outcome.balance,outcome.harvest);assert.equal(outcome.carry,null);
});
test('workers use distinct positions on all three managed worksites',()=>{
 for(const kind of ['kuznia','pracownia','pole']){const runtime=fixture(kind);const outcome=runtime.evaluate(`(()=>{const results=S.people.map(person=>go(person,[109,99],${JSON.stringify(kind==='pole'?'field':'prod')},bById(501)));return {results,goals:S.people.map(person=>person.routeGoal.join(':'))}})()`);assert.ok(Array.from(outcome.results).every(Boolean));assert.equal(new Set(outcome.goals).size,3,kind)}
});
test('a blocked attempt keeps its existing cargo and does not teleport',()=>{
 const runtime=fixture();const outcome=runtime.evaluate(`(()=>{const person=S.people[0];person.carry=[{res:'ruda',q:2}];const before=[person.x,person.z];walk.fill(0);const planned=go(person,[109,99],'prod',bById(501));return {planned,before,after:[person.x,person.z],cargo:person.carry[0].q}})()`);assert.equal(outcome.planned,false);assert.equal(outcome.cargo,2);assert.deepEqual(Array.from(outcome.before),Array.from(outcome.after));
});
