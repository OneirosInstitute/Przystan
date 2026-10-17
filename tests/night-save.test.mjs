import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
const key='przystan-v7';

test('autosave during skipped night persists progress and the ordinary resume speed',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();
 runtime.evaluate('S.day=19.85;setSpeed(4);nocStart();S.res.drewno=347');
 assert.equal(runtime.game.S.speed,40);
 runtime.advanceTime(15000);
 const stored=JSON.parse(runtime.memory.get(key));
 assert.equal(stored.day,19.85);assert.equal(stored.res.drewno,347);assert.equal(stored.speed,4);
 assert.equal(runtime.game.S.speed,40);assert.equal(runtime.evaluate('saveStatus.ok'),true);
 const restarted=createGame({storage:{[key]:runtime.memory.get(key)}});restarted.game.startGame(false);
 assert.equal(restarted.game.S.day,19.85);assert.equal(restarted.game.S.res.drewno,347);
 restarted.game.closeSheet();assert.equal(restarted.game.S.speed,4);
});

test('the midnight save succeeds while night acceleration is active',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();
 runtime.evaluate('S.day=18.999;setSpeed(2);nocStart();step(.3)');
 assert.ok(runtime.game.S.day>=19);
 const stored=JSON.parse(runtime.memory.get(key));
 assert.ok(stored.day>=19);assert.ok([0,2].includes(stored.speed));
 assert.equal(runtime.evaluate('saveStatus.ok'),true);
});

test('a paused decision opened during night skip resumes at the player speed after restart',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();
 runtime.evaluate("S.day=19.85;setSpeed(8);nocStart();openEvent(EVENTS.find(event=>event.id==='swieto'),{})");
 runtime.advanceTime(15000);
 const stored=JSON.parse(runtime.memory.get(key));
 assert.equal(stored.speed,0);assert.equal(stored.pendingDecision.prev,8);
 const restarted=createGame({storage:{[key]:runtime.memory.get(key)}});restarted.game.startGame(false);
 const click=dataset=>restarted.elements.get('ev').listeners.click.forEach(callback=>callback({target:{closest:()=>({dataset})}}));
 click({o:'1'});click({close:'1'});
 assert.equal(restarted.game.S.speed,8);
});

test('legacy temporary night speed is migrated while unsupported speeds are rejected',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 const stored=JSON.parse(runtime.memory.get(key));stored.speed=40;stored.day=7.4;stored.res.drewno=347;
 runtime.memory.set(key,JSON.stringify(stored));runtime.game.startGame(false);
 assert.equal(runtime.game.S.speed,1);assert.equal(runtime.game.S.day,7.4);assert.equal(runtime.game.S.res.drewno,347);
 stored.speed=120;
 assert.equal(runtime.evaluate(`decodeSave(${JSON.stringify(JSON.stringify(stored))})`),null);
});
