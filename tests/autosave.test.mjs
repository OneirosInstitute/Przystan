import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

const key='przystan-v7';
const snapshot=runtime=>JSON.parse(runtime.memory.get(key));
function startWaterTrip(runtime){
 runtime.evaluate(`S.day=.4;const worker=S.people[0];
  chGo(worker,[camp.i,camp.j+1],'woda');worker.path=null;worker.state='work';
  worker.workKind='chore';worker.after=null;worker.wt=CHORE.woda[2];stepPerson(worker,.1)`);
 assert.equal(runtime.game.S.people[0].carry?.[0]?.res,'woda');
}

test('starting a new settlement immediately persists the completed boot state',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 const saved=snapshot(runtime);
 assert.equal(saved.people.length,runtime.game.S.people.length);
 assert.equal(saved.bld.length,runtime.game.S.bld.length);
 assert.equal(saved.seen.originHeart,1);
 assert.equal(runtime.evaluate('saveStatus.ok'),true);
});

test('real-time autosave persists paused play within 15 seconds and survives restart',()=>{
 const before=createGame();before.game.startGame(true);
 before.evaluate('setSpeed(0);S.res.drewno=37;S.day=2.45');
 before.advanceTime(15000);
 assert.equal(snapshot(before).res.drewno,37);
 const after=createGame({storage:{[key]:before.memory.get(key)}});after.game.startGame(false);
 assert.equal(after.game.S.res.drewno,37);
 assert.equal(after.game.S.day,2.45);
 assert.equal(after.game.S.speed,0);
});

test('water hauling is saved by the timer, resumed after restart and delivered exactly once',()=>{
 const before=createGame();before.game.startGame(true);before.game.closeSheet();startWaterTrip(before);
 before.advanceTime(15000);
 assert.equal(snapshot(before).day,.4);
 assert.equal(snapshot(before).people[0].carry[0].res,'woda');
 const after=createGame({storage:{[key]:before.memory.get(key)}});after.game.startGame(false);after.game.closeSheet();
 const result=after.evaluate(`(()=>{const worker=S.people[0];const bonus=S.wBonus||0;
  for(let tick=0;tick<1000&&worker.carry;tick++)stepPerson(worker,.1);
  return {gain:(S.wBonus||0)-bonus,carry:worker.carry,deliveries:(S.chLog||[]).filter(entry=>entry.k==='woda').length,water:S.res.woda};})()`);
 assert.equal(result.gain,2.5);assert.equal(result.carry,null);assert.equal(result.deliveries,1);assert.equal(result.water,undefined);
 after.advanceTime(15000);
 const completed=createGame({storage:{[key]:after.memory.get(key)}});completed.game.startGame(false);
 assert.equal(completed.game.S.wBonus,2.5);
 assert.equal(completed.game.S.people[0].carry,null);
});

test('background and page-exit callbacks persist the current state without manual save',()=>{
 for(const event of ['visibilitychange','pagehide','beforeunload']){
  const runtime=createGame();runtime.game.startGame(true);
  runtime.game.S.res.drewno++;
  if(event==='visibilitychange')runtime.sandbox.document.hidden=true;
  const listeners=event==='visibilitychange'?runtime.documentListeners:runtime.windowListeners;
  for(const callback of listeners[event]||[])callback();
  assert.equal(snapshot(runtime).res.drewno,runtime.game.S.res.drewno,event);
 }
});

test('autosave preserves a good snapshot on storage error and retries successfully',()=>{
 const runtime=createGame();runtime.game.startGame(true);const previous=runtime.memory.get(key);
 const setItem=runtime.sandbox.localStorage.setItem;
 runtime.game.S.res.drewno=41;
 runtime.sandbox.localStorage.setItem=()=>{throw new Error('QuotaExceededError')};
 runtime.advanceTime(15000);
 assert.equal(runtime.memory.get(key),previous);
 assert.equal(runtime.evaluate('saveStatus.ok'),false);
 assert.equal(runtime.elements.get('save-warning').hidden,false);
 runtime.sandbox.localStorage.setItem=setItem;runtime.advanceTime(15000);
 assert.equal(snapshot(runtime).res.drewno,41);
 assert.equal(runtime.elements.get('save-warning').hidden,true);
});

test('automatic triggers never overwrite an unreadable existing save',()=>{
 const runtime=createGame({storage:{[key]:'{broken'}});runtime.game.startGame(false);
 runtime.advanceTime(30000);runtime.sandbox.document.hidden=true;
 for(const callback of runtime.documentListeners.visibilitychange||[])callback();
 for(const callback of runtime.windowListeners.pagehide||[])callback();
 assert.equal(runtime.memory.get(key),'{broken');
});

test('water exception accepts only the real zero-quantity chore marker',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();startWaterTrip(runtime);
 assert.ok(runtime.evaluate('decodeSave(serializeSave())'));
 runtime.game.S.people[0].carry[0].q=2;
 assert.equal(runtime.evaluate('decodeSave(serializeSave())'),null);
 runtime.game.S.people[0].carry[0].q=0;runtime.game.S.people[0].chK='chrust';
 assert.equal(runtime.evaluate('decodeSave(serializeSave())'),null);
});

test('manual save reports success only after storage accepts the snapshot',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 runtime.evaluate("openSheet('kronika')");runtime.game.S.res.drewno=54;
 const click={target:{closest:selector=>selector==='[data-kron]'?{dataset:{kron:'now'}}:null}};
 for(const callback of runtime.documentListeners.click||[])callback(click);
 assert.equal(snapshot(runtime).res.drewno,54);
 assert.match(runtime.elements.get('save-status').textContent,/Zapisano w przeglądarce/);
 runtime.sandbox.localStorage.setItem=()=>{throw new Error('QuotaExceededError')};
 for(const callback of runtime.documentListeners.click||[])callback(click);
 assert.match(runtime.elements.get('save-status').textContent,/Zapis nie działa/);
});

test('a water carrier retains the trip overnight and finishes after reassignment',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();startWaterTrip(runtime);
 const result=runtime.evaluate(`(()=>{const worker=S.people[0];worker.job='zwiad';S.day=.9;
  for(let tick=0;tick<1000;tick++)stepPerson(worker,.1);
  const nightBonus=S.wBonus||0,nightCarry=!!worker.carry;
  S.day=1.4;for(let tick=0;tick<1000&&worker.carry;tick++)stepPerson(worker,.1);
  return {nightBonus,nightCarry,dayBonus:S.wBonus||0,carry:worker.carry,job:worker.job};})()`);
 assert.equal(result.nightBonus,0);assert.equal(result.nightCarry,true);
 assert.equal(result.dayBonus,2.5);assert.equal(result.carry,null);assert.equal(result.job,'zwiad');
});
