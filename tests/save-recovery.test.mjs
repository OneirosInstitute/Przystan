import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
const key='przystan-v7';

test('quota occupied by the secondary backup is recovered without clearing unrelated storage',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();
 const previous=runtime.memory.get(key);runtime.memory.set(key+'-bak',previous);runtime.memory.set('other-app','keep');
 runtime.evaluate("S.day=2.4;S.kron.push([3,'Nowy wpis '.repeat(100)]);S.res.drewno=73");
 const expected=JSON.parse(runtime.evaluate('serializeSave()')),limit=previous.length*2+20;
 runtime.sandbox.localStorage.setItem=(name,value)=>{const size=[...runtime.memory].reduce((total,[storedName,storedValue])=>total+(storedName===name?0:storedValue.length),0)+String(value).length;
  if(size>limit){const error=new Error('QuotaExceededError');error.name='QuotaExceededError';throw error}runtime.memory.set(name,String(value));};
 assert.equal(runtime.game.save(),true);
 const stored=JSON.parse(runtime.memory.get(key));delete expected.sess.lt;delete stored.sess.lt;
 assert.deepEqual(stored,expected);
 assert.equal(runtime.memory.get('other-app'),'keep');
 assert.equal(runtime.memory.has(key+'-bak'),false);
 const restarted=createGame({storage:{[key]:runtime.memory.get(key)}});restarted.game.startGame(false);
 assert.equal(restarted.game.S.res.drewno,73);
});

test('a failed quota retry restores the secondary backup and preserves the primary',()=>{
 const runtime=createGame();runtime.game.startGame(true);const previous=runtime.memory.get(key);
 runtime.memory.set(key+'-bak',previous);runtime.game.S.res.drewno=99;
 runtime.sandbox.localStorage.setItem=(name,value)=>{if(name===key){const error=new Error('quota');error.name='QuotaExceededError';throw error}runtime.memory.set(name,String(value));};
 assert.equal(runtime.game.save(),false);
 assert.equal(runtime.memory.get(key),previous);assert.equal(runtime.memory.get(key+'-bak'),previous);
 assert.match(runtime.evaluate('saveStatusText()'),/QuotaExceededError/);
});

test('invalid state reports the responsible field and version without replacing a good save',()=>{
 const runtime=createGame();runtime.game.startGame(true);const previous=runtime.memory.get(key);
 runtime.game.S.people[0].hp=NaN;assert.equal(runtime.game.save(),false);
 assert.equal(runtime.memory.get(key),previous);
 assert.match(runtime.evaluate('saveStatusText()'),/people\[0\].*hp/);
 assert.match(runtime.evaluate('saveStatusText()'),/4\.0\.0-rc\.4/);
 const diagnostic=runtime.evaluate('saveDiagnostics()');assert.equal(diagnostic.ok,false);assert.ok(diagnostic.error);
});

test('text validation identifies unsafe nested input without accepting it',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 const state=JSON.parse(runtime.memory.get(key));state.kron.push([1,'<img src=x onerror=alert(1)>']);
 assert.equal(runtime.evaluate(`decodeSave(${JSON.stringify(JSON.stringify(state))})`),null);
 assert.match(runtime.evaluate('saveDecodeError'),/kron\[/);
});
