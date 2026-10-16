import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('reassigning builders releases reserved slots, including travel',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();const site={id:501,kind:'sklad',i:camp.i+5,j:camp.j-7,prog:0,work:10,workers:4};S.bld.push(site);S.alloc.bud=4;S.people.slice(0,4).forEach((person,index)=>{person.job='bud';person.state=index%2?'move':'work';person.after='build';person.workKind='build';person.tgt=site});S.people.slice(0,4).forEach(person=>czSetJob(person,'rob'))");
 assert.equal(runtime.game.S.bld[0].workers,0);
});

test('a saved delivery reaches its warehouse along a path after the workday ends',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.day=.79;walk.fill(1);reach.fill(1);const person=S.people[0];person.x=tcx(camp.i+10);person.z=tcx(camp.j+1);finishTrip(person,[{res:'drewno',q:6}]);stepPerson(person,.1);save();S=load()");
 runtime.evaluate("for(let tick=0;tick<1500&&S.people[0].carry;tick++){S.t+=.1;S.day+=.1/DAY;stepPerson(S.people[0],.1)}");
 assert.equal(runtime.game.S.res.drewno,28);
 assert.equal(runtime.game.S.people[0].carry,null);
 assert.ok(runtime.game.S.day>.8);
});

test('midnight preserves material delivery and reserves it once after restart',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.bld.push({id:501,kind:'sklad',i:camp.i+5,j:camp.j-7,prog:0,work:10,mat:10,del:0,inTr:6,haul:1});const person=S.people[0];person.haulB=501;person.haulQ=6;person.carry=[{res:'drewno',q:0}];person.after='haulDrop';person.state='move';haulDaily();save();S=load();haulDaily()");
 assert.equal(runtime.game.S.people[0].haulQ,6);
 assert.equal(runtime.game.S.bld[0].inTr,6);
 runtime.evaluate("const person=S.people[0];person.after='haulDrop';onArrive(person)");
 assert.equal(runtime.game.S.bld[0].del,6);
 assert.equal(runtime.game.S.bld[0].inTr,0);
});

test('full storage conserves deliveries and represents excess consistently',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();FOOD.forEach(key=>S.res[key]=0);S.res.suchary=600;S.people[0].carry=[{res:'ryby',q:4}];deposit(S.people[0]);S.res.chleb+=7");
 assert.equal(runtime.evaluate('foodTotal()'),611);
 assert.equal(runtime.evaluate('foodOverflow()'),11);
 assert.equal(runtime.game.S.people[0].carry,null);
 assert.match(runtime.evaluate('troubleHTML()'),/poza|osłon/i);
});

test('ration priorities redistribute exactly the existing food equivalent',()=>{
 const runtime=createGame();
 for(const mode of ['dzieci','praca','rowno']){
  runtime.evaluate("S=freshState();S.fedR=.4;Object.values(S.fams).forEach(family=>family.sp=0)");
  const budget=runtime.evaluate('S.people.reduce((sum,person)=>sum+K*pNeed(person)*S.fedR,0)');
  runtime.evaluate(`racje(${JSON.stringify(mode)});gospEat()`);
  const distributed=runtime.evaluate('S.people.reduce((sum,person)=>sum+K*pNeed(person)*fedOf(person),0)');
  assert.ok(Math.abs(distributed-budget)<1e-8,`${mode}: ${distributed} != ${budget}`);
 }
});

test('unfeasible workshop helps without repeatedly planning production',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.wreck.gone=1;S.bld.push({id:501,kind:'drewutnia',i:camp.i+5,j:camp.j-7,prog:5,work:5,lv:1,cond:1,want:1});S.res.drewno=0;const person=S.people[0];person.job='wb';person.wb=501;planJob(person)");
 assert.notEqual(runtime.game.S.people[0].after,'prod');
 assert.equal(runtime.game.S.people[0].job,'wb');
});

test('food emergency policy reaches the last planner and releases active builders',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.wreck.gone=1;S.bld.push({id:501,kind:'sklad',i:camp.i+5,j:camp.j-7,prog:0,work:10,workers:1});const person=S.people[0];person.job='bud';person.state='work';person.workKind='build';person.tgt=S.bld[0];racje('zbior');planJob(person)");
 assert.notEqual(runtime.game.S.people[0].after,'build');
 assert.equal(runtime.game.S.bld[0].workers,0);
});

test('unreachable and night deliveries retain ownership instead of teleporting',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.day=.95;walk.fill(0);reach.fill(0);const person=S.people[0];person.x=0;person.z=0;finishTrip(person,[{res:'drewno',q:6}]);stepPerson(person,.1)");
 assert.equal(runtime.game.S.res.drewno,22);
 assert.equal(runtime.game.S.people[0].carry[0].q,6);
});

test('feast consumes exactly 60 and insufficient food gives no feast reward',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();FOOD.forEach(key=>S.res[key]=0);S.res.jagody=140;S.res.ryby=160;S.res.mieso=120");
 const before=runtime.evaluate('foodTotal()');
 runtime.evaluate("EVENTS.find(event=>event.id==='swieto').opts[0].f({})");
 assert.ok(Math.abs(before-runtime.evaluate('foodTotal()')-60)<1e-8);
 runtime.evaluate('FOOD.forEach(key=>S.res[key]=0);S.res.suchary=10');
 const hope=runtime.game.S.hope;
 runtime.evaluate("EVENTS.find(event=>event.id==='swieto').opts[0].f({})");
 assert.equal(runtime.game.S.hope,hope);
 assert.equal(runtime.evaluate('foodTotal()'),10);
});

test('forgotten technology cannot satisfy a new prerequisite',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.tech.u_rozp=1;S.lostT={u_rozp:2}");
 assert.equal(runtime.evaluate("techAvail(TECH.find(item=>item.req.includes('u_rozp')))"),false);
});

test('led goat survives restart, full pen and removal of its destination',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();const person=S.people[0];person.kozN=1;person.kozB=501;S.bld.push({id:501,kind:'zagroda',i:camp.i+5,j:camp.j-7,prog:5,work:5,animals:10});save();S=load()");
 assert.equal(runtime.game.S.people[0].kozN,1);
 const total=()=>runtime.evaluate("S.herds.filter(herd=>herd.type==='koza').reduce((sum,herd)=>sum+herd.n,0)+S.bld.reduce((sum,building)=>sum+(building.animals||0),0)+S.people.reduce((sum,person)=>sum+(person.kozN||0),0)");
 const before=total();runtime.evaluate('kozDeliver(S.people[0])');assert.equal(total(),before);
 runtime.evaluate('S.bld=[]');const removed=total();runtime.evaluate('kozDeliver(S.people[0])');assert.equal(total(),removed);
});
