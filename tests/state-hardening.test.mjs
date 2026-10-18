import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createGame} from './runtime.mjs';
const require=createRequire(import.meta.url),D=require('../src/p_e4_domain.js'),E=require('../src/p_e4_economy.js'),W=require('../src/p_e4_world.js');
const runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit();S.wozy=2');
const raw=JSON.parse(runtime.evaluate('serializeSave()'));
function fixture(initialized=true){const state=D.migrate(raw,{world:W.create({seed:raw.seed,town:{x:0,z:50}})});if(initialized)E.ensure(state);return state}

test('a rejected clock step never initializes or mutates the simulation',()=>{
 for(const days of [NaN,Infinity,-1,10001]){const state=fixture(false),before=structuredClone(state);assert.throws(()=>E.advance(state,days));assert.deepEqual(state,before)}
});
test('a persisted E4 clock must have a coherent finite origin and elapsed time',()=>{
 const original=fixture();assert.equal(D.validate(original),true);
 for(const [key,value]of [['startTime','bad'],['startTicks',-1],['startTicks',original.e4.simTicks+1],['elapsed',-1],['startTime',NaN]]){const state=structuredClone(original);state.e4[key]=value;assert.equal(D.validate(state),false,key+':'+value)}
 const missing=structuredClone(original);delete missing.e4.startTime;assert.equal(D.validate(missing),false);
});
test('a transport checkpoint cannot contain an arrival at or before its current clock',()=>{
 const state=fixture();D.createSettlement(state,{id:'destination',name:'Cel',x:60,z:0,road:2});state.res.deski=100;state.res.suchary=10000;
 assert.equal(E.ship(state,{from:'przystan',to:'destination',items:{deski:1}}).ok,true);
 assert.equal(D.validate(state),true);state.e4.simTicks=state.e4.transports[0].arrival;state.day=state.e4.simTicks/1e6;state.e4.elapsed=(state.e4.simTicks-state.e4.startTicks)/1e6;state.t=state.e4.startTime+state.e4.elapsed*240;
 assert.equal(D.validate(state),false);const before=structuredClone(state);assert.throws(()=>E.advance(state,.01));assert.deepEqual(state,before);
});
test('route length agrees with geometry and corrupt action targets or labor ledgers are rejected',()=>{
 const original=fixture();E.advance(original,.01);assert.equal(D.validate(original),true);
 const person=original.people.find(person=>person.e4Action);assert.ok(person);
 for(const change of [p=>p.e4Action.target=null,p=>p.e4Action.length+=100,p=>p.e4Action.accounted=-1,p=>p.e4Credits={bad:-10},p=>p.e4UsedCredits={bad:-1}]){const state=structuredClone(original);change(state.people.find(p=>p.id===person.id));assert.equal(D.validate(state),false)}
});
test('valid RC5 snapshots, blocked actions and long walks remain loadable after repeated restarts',()=>{
 const state=fixture();state.res.suchary=10000;
 for(let day=0;day<4;day++){E.advance(state,.25);assert.equal(D.validate(JSON.parse(JSON.stringify(state))),true)}
 const person=state.people.find(person=>person.e4Action);person.e4Action.blocked=true;person.e4Action.route=[];person.e4Action.length=0;person.e4Action.arrival=person.e4Action.end+1;
 assert.equal(D.validate(state),true);
});

test('invalid clock origins and safe-integer overflow are rejected before runtime mutation',()=>{
 for(const corrupt of [state=>delete state.e4.startTime,state=>{state.e4.simTicks=Number.MAX_SAFE_INTEGER;state.day=state.e4.simTicks/1e6;state.e4.startTicks=state.e4.simTicks;state.e4.elapsed=0;state.t=state.e4.startTime}]){const state=fixture();corrupt(state);const before=structuredClone(state);assert.throws(()=>E.advance(state,1));assert.deepEqual(state,before)}
});
test('the sub-decimeter arrival tolerance remains compatible with existing action snapshots',()=>{
 const state=fixture();E.advance(state,.01);const action=state.people.find(person=>person.e4Action).e4Action;action.route=[{x:0,z:50},{x:.05,z:50}];action.length=0;assert.equal(D.validate(state),true);
});
test('the real save decoder rejects a corrupt E4 clock without touching the running colony',()=>{
 const state=fixture();runtime.sandbox.__candidate=JSON.stringify(state);
 assert.ok(runtime.evaluate('decodeSave(window.__candidate)'));
 const before=runtime.evaluate('serializeSave()');state.e4.startTime='broken clock';runtime.sandbox.__candidate=JSON.stringify(state);
 assert.equal(runtime.evaluate('decodeSave(window.__candidate)'),null);
 assert.equal(runtime.evaluate('serializeSave()'),before);
});
test('catalog validation accepts only declared resources, buildings, crops, recipes and animals',()=>{
 const changes=[state=>state.res.toString=1,state=>state.e4.settlements.przystan.buildings.toString=1,state=>state.e4.settlements.przystan.projects.push({kind:'toString',progress:0,work:1,materials:{}}),state=>state.e4.settlements.przystan.fields.push({crop:'toString',age:0,progress:0,soil:1}),state=>state.e4.settlements.przystan.batches.push({recipe:'toString',progress:0,work:1,readyAt:null,materials:{}}),state=>state.e4.settlements.przystan.herd.push({id:1,species:'toString',sex:'k',age:1,hp:1})];
 for(const change of changes){const state=fixture();change(state);assert.equal(D.validate(state),false)}
});
test('a legitimate one-point transport route remains valid and delivers its cargo once',()=>{
 const state=fixture(),town=state.e4.settlements.przystan;D.createSettlement(state,{id:'neighbor',name:'Sąsiedzi',x:town.x-.01,z:town.z+.01,road:2});Object.assign(state.res,{deski:100,suchary:10000});
 const result=E.ship(state,{from:'przystan',to:'neighbor',items:{deski:1}});assert.equal(result.ok,true);assert.equal(state.e4.transports[0].route.points.length,1);assert.equal(D.validate(state),true);
 E.advance(state,1);assert.equal(state.e4.settlements.neighbor.stock.deski,1);assert.equal(state.e4.transports.length,0);assert.equal(D.validate(state),true);
});
