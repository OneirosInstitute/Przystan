import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S01: delivery to a completed construction releases the in-transit reservation',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
  S=freshState();
  const building={id:998,kind:'sklad',cmp:1,mat:10,del:10,inTr:3};
  S.bld.push(building);
  const person={siteB:998,siteQ:3,after:'siteDrop',wt:7,state:'move',carry:[{res:'deski',q:2}],wait:0};
  const originalDeposit=deposit;
  try{
   deposit=worker=>{worker.carry=null};
   onArrive(person);
   return {inTr:building.inTr,del:building.del,siteB:person.siteB,siteQ:person.siteQ,state:person.state};
  }finally{deposit=originalDeposit}
 })()`);
 assert.equal(result.inTr,0);
 assert.equal(result.del,10);
 assert.equal(result.siteB,null);
 assert.equal(result.siteQ,0);
 assert.equal(result.state,'idle');
});
