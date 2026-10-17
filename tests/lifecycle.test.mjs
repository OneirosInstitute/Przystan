import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

function emit(runtime,name,hidden){
 if(hidden!==undefined)runtime.sandbox.document.hidden=hidden;
 const listeners=['visibilitychange','freeze','resume'].includes(name)?runtime.documentListeners:runtime.windowListeners;
 for(const callback of listeners[name]||[])callback({type:name,persisted:true});
}
function start(){const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();runtime.evaluate('setSpeed(0);globalThis.renders=0;renderer.render=()=>renders++');return runtime;}
const active=runtime=>runtime.intervals.filter(timer=>timer.active).length;

test('hiding stops the render scheduler, autosave timer and simulation while retaining the exit save',()=>{
 const runtime=start();runtime.game.S.res.drewno=71;emit(runtime,'visibilitychange',true);
 assert.equal(JSON.parse(runtime.memory.get('przystan-v7')).res.drewno,71);
 assert.equal(runtime.pendingFrames.size,0,'no queued render callback');
 assert.equal(active(runtime),0,'no periodic wakeup');
 const saved=runtime.memory.get('przystan-v7'),day=runtime.game.S.day;
 runtime.advanceTime(60000,{timeouts:true});runtime.runFrame();
 assert.equal(runtime.evaluate('renders'),0);assert.equal(runtime.game.S.day,day);assert.equal(runtime.memory.get('przystan-v7'),saved);
});

test('pagehide and freeze stop independently; returning starts exactly one loop without catching up time',()=>{
 for(const event of ['pagehide','freeze']){
  const runtime=start();runtime.evaluate('S.speed=1;step=dt=>{S.day+=dt}');
  emit(runtime,event);assert.equal(runtime.pendingFrames.size,0,event);assert.equal(active(runtime),0,event);
  runtime.advanceTime(3600000,{timeouts:true});const day=runtime.game.S.day;
  emit(runtime,event==='freeze'?'resume':'pageshow');emit(runtime,'pageshow');emit(runtime,'visibilitychange',false);
  assert.equal(runtime.pendingFrames.size,1);assert.equal(active(runtime),1);
  runtime.runFrame(34);assert.ok(runtime.game.S.day-day<.04,'background hour is excluded');
  assert.ok(runtime.evaluate('renders')>0);runtime.game.S.res.drewno=67;runtime.advanceTime(15000);
  assert.equal(JSON.parse(runtime.memory.get('przystan-v7')).res.drewno,67);
 }
});

test('a hidden page cannot be restarted by pageshow/resume until it becomes visible',()=>{
 const runtime=start();emit(runtime,'visibilitychange',true);emit(runtime,'freeze');emit(runtime,'pagehide');
 emit(runtime,'resume');emit(runtime,'pageshow');assert.equal(runtime.pendingFrames.size,0);assert.equal(active(runtime),0);
 emit(runtime,'visibilitychange',false);assert.equal(runtime.pendingFrames.size,1);assert.equal(active(runtime),1);
});

test('delayed story retries sleep in the background and continue after return',()=>{
 const runtime=start();runtime.evaluate("S.vname='';evOpen={};askVName();globalThis.storyOpens=0;openEvent=()=>{storyOpens++}");
 emit(runtime,'visibilitychange',true);runtime.advanceTime(60000,{timeouts:true});
 assert.equal(runtime.evaluate('storyOpens'),0);assert.equal(runtime.timers.filter(timer=>timer.active).length,0,'no outstanding native story timers');
 runtime.evaluate('evOpen=null');emit(runtime,'visibilitychange',false);runtime.advanceTime(4000,{timeouts:true});
 assert.equal(runtime.evaluate('storyOpens'),1);
});

test('sound follows lifecycle even if a suspend finishes after the app has returned',async()=>{
 const runtime=start();runtime.evaluate(`globalThis.finishSuspend=null;globalThis.resumes=0;
 AUD={state:'running',suspend(){return new Promise(resolve=>{finishSuspend=()=>{this.state='suspended';resolve()}})},resume(){resumes++;this.state='running';return Promise.resolve()}}`);
 emit(runtime,'visibilitychange',true);emit(runtime,'visibilitychange',false);runtime.evaluate('finishSuspend()');
 await new Promise(resolve=>setImmediate(resolve));assert.equal(runtime.evaluate('AUD.state'),'running');assert.equal(runtime.evaluate('resumes'),1);
 runtime.evaluate('AUD.suspend=()=>Promise.reject(new Error("not allowed"))');emit(runtime,'pagehide');
 await new Promise(resolve=>setImmediate(resolve));
});

test('a hidden initial load does not schedule frames, timers, audio or render an intro snapshot',()=>{
 const runtime=createGame({hidden:true});assert.equal(runtime.pendingFrames.size,0);assert.equal(active(runtime),0);
 assert.equal(runtime.timers.filter(timer=>timer.active).length,0);
 runtime.evaluate('audioStart()');assert.equal(runtime.evaluate('AUD'),null);
});

test('one successful exit save covers visibility/pagehide/freeze; a failed exit save can retry',()=>{
 const runtime=start();const write=runtime.sandbox.localStorage.setItem;let writes=0;
 runtime.sandbox.localStorage.setItem=(key,value)=>{if(key==='przystan-v7')writes++;return write(key,value)};
 emit(runtime,'visibilitychange',true);emit(runtime,'pagehide');emit(runtime,'freeze');emit(runtime,'beforeunload');assert.equal(writes,1);
 emit(runtime,'resume');emit(runtime,'pageshow');emit(runtime,'visibilitychange',false);
 runtime.game.S.res.drewno=69;let attempts=0;
 runtime.sandbox.localStorage.setItem=(key,value)=>{if(key==='przystan-v7'&&attempts++===0)throw new Error('disk busy');return write(key,value)};
 emit(runtime,'visibilitychange',true);assert.equal(runtime.evaluate('saveStatus.ok'),false);
 emit(runtime,'pagehide');assert.equal(JSON.parse(runtime.memory.get('przystan-v7')).res.drewno,69);
});

test('hiding aborts an outstanding weekly request and prevents new background requests',async()=>{
 const runtime=start();await new Promise(resolve=>setImmediate(resolve));
 let calls=0;runtime.sandbox.fetch=(url,{signal})=>{calls++;return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}))};
 const request=runtime.evaluate("tydFetch('wyniki').catch(error=>error.message)");
 assert.equal(calls,1);emit(runtime,'visibilitychange',true);assert.equal(await request,'aborted');
 assert.equal(runtime.evaluate('tydRequests.size'),0);
 await runtime.evaluate("tydFetch('wyniki').catch(()=>null)");assert.equal(calls,1);
 assert.equal(runtime.timers.filter(timer=>timer.active).length,0);
});
