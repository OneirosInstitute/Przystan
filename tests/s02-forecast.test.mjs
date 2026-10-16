import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S02 autumn fuel shortage increases wood-gathering priority without consuming stock',()=>{
 const game=createGame();
 const result=game.evaluate(`(()=>{
  S=freshState();S.day=7;
  const resident=S.people.find(person=>person.age>=16);resident.job='rob';
  const before={...S.res};S.res.opal=15;
  const urgent=choreCands(resident).find(candidate=>candidate[0]==='chrust')[1];
  S.res.opal=250;
  const stocked=choreCands(resident).find(candidate=>candidate[0]==='chrust')[1];
  return {urgent,stocked,woodUnchanged:S.res.drewno===before.drewno};
 })()`);
 assert.ok(result.urgent>result.stocked);
 assert.equal(result.woodUnchanged,true);
});

test('S02 before winter increases food gathering priority while reserves are low',()=>{
 const game=createGame();
 const result=game.evaluate(`(()=>{
  S=freshState();
  const worker=S.people.find(person=>person.age>=16);worker.job='rob';
  for(const resource of FOOD)S.res[resource]=0;
  const daily=K*S.people.reduce((sum,person)=>sum+(person.age<3?.3:person.age<12?.6:person.age>55?.8:1),0);
  S.res.ryby=daily*16;
  for(let index=0;index<10;index++)S.bld.push({id:900+index,kind:'sklad',prog:1,work:1,ext:[],lv:1});
  S.day=2;
  const summer=choreCands(worker);
  S.day=7;
  const autumn=choreCands(worker);
  return {summer,autumn};
 })()`);
 assert.ok(result.autumn.find(choice=>choice[0]==='zbior')?.[1]>result.summer.find(choice=>choice[0]==='zbior')?.[1]);
});
