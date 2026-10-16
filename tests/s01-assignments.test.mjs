import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S01: failed routing does not overwrite the existing chore assignment',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
  const previousGo=go;
  const worker={chK:'naprawa',chN:13,chB:4,chP:9,chPh:1,act:'naprawia'};
  try{
   go=()=>false;
   const ok=chGo(worker,[80,90],'chrust',{chN:22});
   return {ok,worker};
  }finally{go=previousGo}
 })()`);
 assert.equal(result.ok,false);
 assert.equal(result.worker.chK,'naprawa');
 assert.equal(result.worker.chN,13);
 assert.equal(result.worker.chB,4);
 assert.equal(result.worker.chP,9);
 assert.equal(result.worker.chPh,1);
 assert.equal(result.worker.act,'naprawia');
});

test('S01: successful routing installs the new chore and clears stale targets',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
  const previousGo=go;
  const worker={chK:'naprawa',chN:13,chB:4,chP:9,chPh:1,act:'naprawia'};
  try{
   go=()=>true;
   const ok=chGo(worker,[80,90],'chrust',{chN:22});
   return {ok,worker};
  }finally{go=previousGo}
 })()`);
 assert.equal(result.ok,true);
 assert.equal(result.worker.chK,'chrust');
 assert.equal(result.worker.chN,22);
 assert.equal(result.worker.chB,null);
 assert.equal(result.worker.chP,null);
 assert.equal(result.worker.chPh,0);
 assert.match(result.worker.act,/chrust/);
});
