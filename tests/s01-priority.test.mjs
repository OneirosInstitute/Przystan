import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S01: critical village task wins regardless of random draw or input order',()=>{
 const runtime=createGame();
 const selected=runtime.evaluate(`(()=>{
  const before=Math.random;
  Math.random=()=>.99999;
  const first=chPick([['opieka',1],['chrust',9],['ryby',2]]);
  const second=chPick([['ryby',2],['opieka',1],['chrust',9]]);
  Math.random=before;
  return [first[0],second[0]];
 })()`);
 assert.deepEqual([...selected],['chrust','chrust']);
});

test('S01: balanced priorities preserve choice and invalid priorities cannot win',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
 const invalid=chPick([['bad',NaN],['zero',0],['valid',3]]);
 const none=chPick([['bad',NaN]]);
 const choices=new Set();
 for(let trial=0;trial<120;trial++)choices.add(chPick([['food',3],['heat',2.5]])[0]);
 return {invalid:invalid[0],none,choices:[...choices]};
 })()`);
 assert.equal(result.invalid,'valid');
 assert.equal(result.none,null);
 assert.deepEqual(new Set(result.choices),new Set(['food','heat']));
});

test('S01: priority planning leaves serialized village state valid',()=>{
 const runtime=createGame();
 const valid=runtime.evaluate(`(()=>{S=freshState();const worker=S.people.find(person=>person.age>=16);worker.job='rob';choreCands(worker);return !!decodeSave(serializeSave())})()`);
 assert.equal(valid,true);
});
