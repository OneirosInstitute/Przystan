import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('new game preserves landing fire as its one expandable settlement heart',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 const result=runtime.evaluate('({heartCount:S.bld.filter(building=>building.kind==="serce").length,origin:heartAtOrigin(),stage:scSt(),visible:campG.visible,persisted:save()})');
 assert.equal(JSON.stringify(result),JSON.stringify({heartCount:1,origin:true,stage:1,visible:false,persisted:true}));
});
test('legacy heart is migrated on restart without changing population or buildings',()=>{
 const initial=createGame();initial.game.startGame(true);
 initial.evaluate(`(()=>{const building=scB();building.i=camp.i-13;building.j=camp.j-1;S.day=52.2;save()})()`);
 const raw=initial.memory.get('przystan-v7');
 const restored=createGame({storage:{'przystan-v7':raw}});restored.game.startGame(false);
 const result=restored.evaluate('({day:S.day,people:S.people.length,completed:S.bld.filter(b=>bDone(b)).length,origin:heartAtOrigin(),hearts:S.bld.filter(b=>b.kind==="serce").length,valid:save()})');
 assert.equal(result.day,52.2);assert.equal(result.people,18);assert.equal(result.completed,1);
 assert.equal(result.origin,true);assert.equal(result.hearts,1);assert.equal(result.valid,true);
});
test('heart migration refuses to overwrite houses near original fire',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 const result=runtime.evaluate(`(()=>{const original=scB(),position=[original.i,original.j];
 const conflict={id:S.nid++,kind:'chata',i:position[0],j:position[1],prog:14,work:14,cmp:1,cond:1};S.bld.push(conflict);
 const slot=position[1]*N+position[0];occ[slot]=conflict.id;
 return{can:originHeartCanOccupy(original),origin:heartAtOrigin(),collision:occ[slot]===conflict.id}})()`);
 assert.equal(result.can,false);assert.equal(result.collision,true);
});
