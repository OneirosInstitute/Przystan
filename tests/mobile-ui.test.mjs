import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

test('touch launch requests immersive fullscreen even in an installed standalone app',()=>{
 const runtime=createGame({pointerCoarse:true,standalone:true});let requested=0;
 runtime.sandbox.document.fullscreenEnabled=true;runtime.sandbox.document.documentElement.requestFullscreen=options=>{requested++;assert.equal(options.navigationUI,'hide');return Promise.resolve()};
 runtime.game.startGame(true);assert.equal(requested,1);
});
test('game options expand in the current panel and expose version and fullscreen controls',()=>{
 const runtime=createGame();runtime.game.startGame(true);const markup=runtime.evaluate('classicModeTools()');
 assert.match(markup,/<details[^>]*data-ui-section/);assert.match(markup,/<summary/);assert.match(markup,/data-ui-fullscreen/);assert.match(markup,/4\.0\.0-rc\.7/);assert.doesNotMatch(markup,/<a\b/);
});
test('stock views retain separate live daily production, use and balance columns',()=>{
 const runtime=createGame();runtime.game.startGame(true);const markup=runtime.evaluate('zapBody()');
 for(const label of ['Produkcja','Zużycie','Bilans'])assert.ok(markup.includes(label),label);
 assert.match(markup,/<details[^>]*data-ui-section/);
});
test('live measurements survive a real save and restore without changing resources',()=>{
 const runtime=createGame();runtime.game.startGame(true);assert.equal(runtime.evaluate('typeof ResourceFlow'), 'object');
 const result=runtime.evaluate(`(()=>{const before=S.res.drewno;ResourceFlow.run(S,'economy',()=>{S.res.drewno+=10;S.res.drewno-=4});S.day+=.25;const value=ResourceFlow.stats(S,'przystan','drewno');save();boot(false);return {stock:S.res.drewno,expected:before+6,gain:value.produced,use:value.used,restored:ResourceFlow.stats(S,'przystan','drewno').produced}})()`);
 assert.equal(result.stock,result.expected);assert.equal(result.gain,10);assert.equal(result.use,4);assert.equal(result.restored,10);
});
test('service worker updates checkpoint before reload and preserve a failed save',()=>{
 const runtime=createGame();runtime.game.startGame(true);let reloaded=0;runtime.sandbox.location.reload=()=>reloaded++;
 runtime.evaluate('updatePending=true');assert.equal(runtime.evaluate('gameApplyUpdate()'),true);assert.equal(reloaded,1);
 const failure=createGame();failure.game.startGame(true);failure.sandbox.location.reload=()=>{throw Error('must not reload')};failure.sandbox.localStorage.setItem=()=>{throw Error('storage unavailable')};failure.evaluate('updatePending=true');assert.equal(failure.evaluate('gameApplyUpdate()'),false);assert.ok(failure.elements.get('game-update'));assert.equal(failure.evaluate('updateReloading'),false);
});
test('first worker activation does not reload and hidden updates wait for visibility',()=>{
 const runtime=createGame();runtime.game.startGame(true);let reloaded=0;runtime.sandbox.location.reload=()=>reloaded++;const first={},second={};runtime.sandbox.navigator.serviceWorker={controller:first};
 runtime.evaluate('gameControllerChanged()');assert.equal(reloaded,0);runtime.sandbox.navigator.serviceWorker.controller=second;runtime.sandbox.document.hidden=true;runtime.evaluate('gameControllerChanged()');assert.equal(reloaded,0);assert.equal(runtime.evaluate('updatePending'),true);runtime.sandbox.document.hidden=false;runtime.evaluate('gameApplyUpdate()');assert.equal(reloaded,1);
});
