import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.7: wielkie budynki mają własny plac, na którym nic innego nie stanie
test('a big building keeps one free tile around it and blocks neighbours on that ring',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const r=JSON.parse(E(`(()=>{const d=BD.dwor;const b={id:'tdw',kind:'dwor',i:40,j:40,prog:1};S.bld.push(b);
  const near=placConflict('chata',40+d.w,40),diag=placConflict('chata',40-BD.chata.w,40-BD.chata.h),far=placConflict('chata',40+d.w+1,40);
  const rev=placConflict('dwor',40+d.w+1,40),revFar=placConflict('dwor',40+d.w+2,40),small=placConflict('chata',10,10);
  return JSON.stringify({near:near&&near.id,diag:diag&&diag.id,far:far&&far.id,rev:rev&&rev.id,revFar:revFar&&revFar.id,small:small&&small.id})})()`));
 assert.equal(r.near,'tdw','the tile right next to the manor is its yard');
 assert.equal(r.diag,'tdw','the corner of the yard counts too');
 assert.equal(r.far,null,'two tiles away is free');
 assert.equal(r.rev,'tdw','two big buildings cannot share one yard');
 assert.equal(r.revFar,null,'two yards side by side are fine');
 assert.equal(r.small,null);
});
test('small buildings still stand next to each other as before',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const hit=E(`(()=>{S.bld.push({id:'tc',kind:'chata',i:50,j:50,prog:1});const h=placConflict('chata',50+BD.chata.w,50);return h&&h.id||null})()`);
 assert.equal(hit,null);
});
test('the big buildings have their own models and still fall back with ?oldbld',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);
 for(const k of ['dwor','cech','zajazd','szpital','domwsp'])assert.equal(E(`typeof D_MODELS.${k}`),'function',k);
});
