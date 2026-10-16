import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('a hidden document never advances simulation or the render clock',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();
 runtime.evaluate('S.speed=1');const before=runtime.game.S.day;
 runtime.sandbox.document.hidden=true;
 for(let index=1;index<=10;index++)runtime.evaluate(`frame(${index*1000})`);
 assert.equal(runtime.game.S.day,before);
});

test('epoch II and III starter villages remain loadable, including a heart upgrade',()=>{
 const runtime=createGame();
 for(const epoch of [2,3]){
  runtime.evaluate(`E2START=true;E3START=${epoch===3};boot(true);closeSheet()`);
  assert.equal(runtime.game.S.people.length,33);
  runtime.evaluate("const heart=scB();heart.proj={t:'serce',id:5,prog:0,work:80};save()");
  const count=runtime.game.S.bld.length;
  assert.equal(runtime.evaluate('load()?.bld.length'),count);
  if(epoch===3){
   assert.equal(JSON.parse(runtime.memory.get('przystan-v7')).path,'dom');
   runtime.game.startGame(false);
   assert.equal(runtime.game.S.path,'dom');
  }
 }
});

test('legacy epoch II campaign route is recovered from its recorded knowledge',()=>{
 const runtime=createGame();
 runtime.evaluate("S=freshState();S.epoch=2;S.path='morze';S.tech.e2_morze=1;save()");
 const state=JSON.parse(runtime.memory.get('przystan-v7'));delete state.path;delete state.saveSchema;
 runtime.memory.set('przystan-v7',JSON.stringify(state));
 assert.equal(runtime.evaluate('load()?.path'),'morze');
 delete state.tech.e2_morze;
 state.kron=[[1,'Wiec pokoleń wybiera drogę: Morze. Zbudujemy statek.']];
 runtime.memory.set('przystan-v7',JSON.stringify(state));
 assert.equal(runtime.evaluate('load()?.path'),'morze');
});

test('a legacy completed chest is not reset and an interrupted legacy chest recovers',()=>{
 const runtime=createGame();runtime.evaluate('S=freshState();S.wreck.gone=1;S.seen.skrzynia=1;save();S=load()');
 assert.equal(runtime.game.S.seen.skrzynia,undefined);
 runtime.evaluate("S.books.kowal=2;S.books.siew=2;S.seen.skrzynia=1;save();S=load()");
 assert.equal(runtime.game.S.seen.skrzynia,1);
});
