import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('building missions require a completed building and an assigned adult',()=>{
 const runtime=createGame();
 runtime.evaluate('S=freshState();S.tech.h_zagr=1;S.bld.push({id:77,kind:"zagroda",i:80,j:160,prog:8,work:8,cmp:1,ext:[],cond:1});');
 assert.match(runtime.evaluate('missionRequirement(bById(77))'),/Przydziel dorosłego/);
 assert.equal(runtime.evaluate('missionFor(bById(77)).kind'),'koza');
});
test('building mission cannot be dispatched twice without consuming more food',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
 S=freshState();S.tech.h_zagr=1;S.bld.push({id:77,kind:'zagroda',i:80,j:160,prog:8,work:8,cmp:1,ext:[],cond:1});
 const person=S.people.find(p=>p.age>=16);person.job='wb';person.wb=77;person.hp=1;
 S.res.ryby=200;const before=foodTotal();
 const first=sendBuildingMission(77);const after=foodTotal();
 const second=sendBuildingMission(77);
 return{first,second,before,after,count:S.exps.filter(e=>e.missionBuilding===77).length,mission:S.exps.find(e=>e.missionBuilding===77)?.missionKind};
 })()`);
 assert.equal(result.first,true);assert.equal(result.second,false);assert.equal(result.count,1);
 assert.equal(result.mission,'koza');assert.ok(result.before>result.after);
});
test('mission payload survives validated save serialization',()=>{
 const runtime=createGame();
 const valid=runtime.evaluate(`(()=>{S=freshState();S.exps.push({id:5,r:1,type:'zwiad',ppl:[],days:4,left:3,exit:[85,173],risk:.2,missionBuilding:77,missionKind:'koza'});return !!decodeSave(serializeSave())})()`);
 assert.equal(valid,true);
});
test('returning explorer transfers one real wild goat without exceeding the pen and resumes work',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
 S=freshState();S.tech.h_zagr=1;const pen={id:77,kind:'zagroda',i:80,j:160,prog:8,work:8,cmp:1,cond:1,animals:0,want:1,ext:[]};S.bld.push(pen);
 const explorer=S.people.find(person=>person.age>=16);explorer.job='wb';explorer.wb=77;explorer.hp=1;
 const herd=S.herds.find(herd=>herd.type==='koza');herd.n=3;
 S.res.ryby=200;const first=sendBuildingMission(77);if(!first)return {first};
 const expedition=S.exps[0];expedition.risk=0;explorer.state='away';const before=herd.n;
 finishExp(expedition,[explorer]);
 return {first,before,after:herd.n,animals:pen.animals,assigned:explorer.job==='wb'&&explorer.wb===pen.id,remaining:S.exps.length,valid:save()};})()`);
 assert.equal(result.first,true);assert.equal(result.after,result.before-1);
 assert.equal(result.animals,1);assert.equal(result.assigned,true);
 assert.equal(result.remaining,0);assert.equal(result.valid,true);
});
