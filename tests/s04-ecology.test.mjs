import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('S04 hunting pressure decays and cannot become negative or exceed the cap',()=>{
 const game=createGame();
 const value=game.evaluate(`(()=>{
  S=freshState();
  const herd=S.herds.find(item=>item.type==='sarna');
  herd.huntPressure=1;
  S.day=1;
  newDay();
  const first=herd.huntPressure;
  for(let step=0;step<50;step++)newDay();
  return {first,after:herd.huntPressure};
 })()`);
 assert.ok(value.first<1&&value.first>=0);
 assert.ok(value.after>=0&&value.after<=value.first);
});
