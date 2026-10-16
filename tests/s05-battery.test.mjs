import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S05 battery mode throttles animal pose updates without mutating herd simulation',()=>{
 const game=createGame({storage:{'przystan-bat':'1'}});
 const value=game.evaluate(`(()=>{
  S=freshState();
  const original=S.herds.map(herd=>herd.n);
  performance.now=()=>1000;drawAnimals();const first=batAnimalAt;
  performance.now=()=>1010;drawAnimals();const second=batAnimalAt;
  performance.now=()=>1200;drawAnimals();const third=batAnimalAt;
  return {first,second,third,herdsUnchanged:S.herds.every((herd,index)=>herd.n===original[index])};
 })()`);
 assert.equal(value.first,1000);
 assert.equal(value.second,1000);
 assert.equal(value.third,1200);
 assert.equal(value.herdsUnchanged,true);
});
