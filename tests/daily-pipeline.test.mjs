import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

function fixture(){const game=createGame();game.game.startGame(true);game.evaluate('ludInit()');return game}
function probe(game,throwCore=false){return JSON.parse(game.evaluate(`(()=>{
 const events=[];S.day=2;S.res.sol=1;S.res.opal=100;
 const meat=SPOIL.mieso,fish=SPOIL.ryby;
 expTick=()=>{events.push('core');${throwCore?"throw Error('core failure')":""}};
 zapSnap=()=>events.push('snapshot');e2Daily=()=>{events.push('e2');S.res._probe=7};
 e2Daily21=()=>events.push('e21');e2Daily22=()=>events.push('e22');
 kozDaily=()=>events.push('goats');scFuelBack=opal=>events.push('fuel:'+opal);
 scDaily=()=>events.push('heart');scTick=()=>events.push('goals');
 save=()=>events.push('save:'+S.res._probe);
 let error=null;try{newDay()}catch(e){error=e.message}
 return JSON.stringify({events,error,restored:SPOIL.mieso===meat&&SPOIL.ryby===fish});
})()`))}

test('daily phases retain their existing order and capture fuel before the core',()=>{
 const result=probe(fixture());
 assert.deepEqual(result.events.filter(event=>!event.startsWith('save:')),['core','snapshot','e2','e21','e22','goats','fuel:100','heart','goals']);
 assert.equal(result.restored,true);
});
test('the daily checkpoint includes every completed daily phase',()=>{
 const result=probe(fixture());assert.equal(result.events.at(-1),'save:7');
 assert.equal(result.events.filter(event=>event.startsWith('save:')).length,1);
});
test('core failure restores temporary spoilage settings and does not save a partial day',()=>{
 const result=probe(fixture(),true);assert.equal(result.error,'core failure');
 assert.equal(result.restored,true);assert.deepEqual(result.events,['core']);
});
test('a failed optional daily phase is reported and later phases still run',()=>{
 const game=fixture();game.evaluate("e2Daily=()=>{throw Error('daily phase probe')};S.day=2");
 assert.doesNotThrow(()=>game.evaluate('newDay()'));
 assert.ok(game.warnings.some(message=>message.includes('daily phase probe')));
});
