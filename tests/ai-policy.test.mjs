import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
const fixture=()=>{const g=createGame();g.evaluate('S=freshState();S.day=1.4');return g};
test('a configured target replaces the recipe default',()=>{const g=fixture();assert.equal(g.evaluate(`(()=>{const b={kind:'pracownia',lim:200,cond:1};S.res.deski=80;S.res.drewno=100;return productionReady(b)})()`),true)});
test('all grain processors expose shortages while protecting seed',()=>{const g=fixture();for(const kind of ['zarna','wiatrak','slodownia']){const result=g.evaluate(`(()=>{S.bld=[{field:{}}];S.res.ziarno=10;S.res.maka=0;S.res.slod=0;const b={kind:'${kind}',lim:200,cond:1};return {ready:productionReady(b),state:productionSupplyState(b)}})()`);assert.equal(result.ready,false,kind);assert.equal(result.state.mode,'shortage',kind);assert.equal(result.state.needs[0].resource,'ziarno',kind);assert.ok(result.state.needs[0].quantity>10,kind)}});
test('winter and damaged workshops give an explicit non-shortage blocker',()=>{const g=fixture();g.evaluate('S.day=11.4;S.res.miod=0');assert.equal(g.evaluate(`productionSupplyState({kind:'pasieka',cond:1}).mode`),'blocked');assert.match(g.evaluate(`productionSupplyState({kind:'pasieka',cond:1}).reason`),/zim/i);assert.match(g.evaluate(`productionSupplyState({kind:'pracownia',cond:0}).reason`),/remont|stan/i)});
