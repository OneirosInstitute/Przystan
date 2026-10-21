import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.6.0-rc.3: pniaki we wsi się karczuje, a kozy mają cały wybieg zagrody
test('stumps where the village grows are cleared for firewood, stay cleared after loading and still count as cleared forest',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const before=E('karStumps().length'),stumps0=E('e2Stumps()');assert.ok(before>0,'the ready village has stumps between the houses');
 E('(()=>{for(let n=0;n<4800;n++)step(1/10)})()');
 const cleared=E('S.karczN||0');assert.ok(cleared>0,'stumps get cleared by people without a more urgent job');
 assert.ok(E('S.karcz.every(id=>nodes[id].gone&&nodes[id].type==="tree")'));
 assert.ok(E('e2Stumps()')>=stumps0,'cleared stumps still count for the clearing goal of epoch II');
 const raw=E('serializeSave()'),ids=E('JSON.stringify(S.karcz)');assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
 const other=createGame();other.game.startGame(true);
 assert.equal(other.evaluate(`(()=>{localStorage.setItem(SAVEKEY,${JSON.stringify(raw)});boot(false);return ${ids}.every(id=>nodes[id].gone)})()`),true,'cleared stumps do not come back');
 E("openSheet('praca')");assert.match(runtime.elements.get('body').innerHTML,/Karczowanie/);
});

test('a clearing job can be assigned and is a valid saved job',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);
 E("S.people.find(p=>p.age>=18).job='kar'");assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
 assert.match(E("jobLabel(S.people.find(p=>p.job==='kar'))"),/karczown/);
});

test('goats spread over the whole pen and the larger run in front of it',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);
 const slots=JSON.parse(E('JSON.stringify(PEN_SLOTS)'));assert.equal(slots.length,16);
 for(const [x,z] of slots.slice(0,10))assert.ok(Math.abs(x)<=1.3&&Math.abs(z)<=1.3,'the first ten stand inside the fence');
 for(const [x,z] of slots.slice(10))assert.ok(Math.abs(x)<=1.3&&z>1.6&&z<2.7,'the next six stand in the larger run');
 const spread=Math.max(...slots.slice(0,10).map(([x,z])=>Math.hypot(x,z)));assert.ok(spread>1.1,'not crowded in the middle any more');
});
