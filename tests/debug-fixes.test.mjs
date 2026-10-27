import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.13: poprawki z przeglądu całego main
const flush=async()=>{for(let k=0;k<6;k++)await new Promise(r=>setImmediate(r))};

test('weekly island: score matches the server formula in every epoch and errors do not resend every 5 seconds',async()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);
 for(const ep of [1,2,3,4]){const v=E(`(()=>{S.epoch=${ep};const base=Math.round(S.day*10+S.people.length*25+(S.pam||0)*3+(S.hamlets||[]).reduce((a,h)=>a+h.pop,0)*10);return tydScore()-base})()`);assert.equal(v,ep>=2?500:0,'epoch '+ep)}
 E("S.epoch=1;S.week='2026-W44';S.weekRun='tok';S.weekS=-1;window.__calls=0;window.__all=[]");
 // odrzucenie przez serwer (400): nie ponawia w tej porze roku
 E("fetch=(u)=>{if(/wynik$/.test(u))__calls++;return Promise.resolve({ok:false,status:400,json:()=>Promise.resolve({})})}");
 E('tydSend()');await flush();assert.equal(E('__calls'),1);
 assert.equal(E('S.weekS'),-1,'weekS is set by the caller, not reset to force a resend');
 E('S.weekS=Math.floor(S.day/SD)');for(let k=0;k<5;k++){E('tydT=10;mapTick(0)');await flush()}assert.equal(E('__calls'),1,'no resend in the same season after a 4xx');
 // brak sieci: ponowienie dopiero po czasie, z rosnącą przerwą
 E("fetch=(u)=>{if(/wynik$/.test(u))__calls++;return Promise.reject(new TypeError('offline'))};S.weekS=-1;tydRetryAt=0");
 E('tydT=10;mapTick(0)');await flush();assert.equal(E('__calls'),2);
 const wait1=E('tydRetryAt-performance.now()');assert.ok(wait1>=29000&&wait1<=31000,'first retry after about 30 s: '+wait1);
 for(let k=0;k<5;k++){E('tydT=10;mapTick(0)');await flush()}assert.equal(E('__calls'),2,'nothing is sent before the retry time');
 runtime.advanceTime(31000);E('tydT=10;mapTick(0)');await flush();assert.equal(E('__calls'),3);
 const wait2=E('tydRetryAt-performance.now()');assert.ok(wait2>=59000,'second retry waits longer: '+wait2);
});

test('epoch IV hunger warns once and weakens the youngest and the oldest first instead of killing everyone the same day',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');E('ludInit();S.e3={done:1};e4Start()');E('closeSheet()');
 const r=JSON.parse(E(`(()=>{const town=S.e4.settlements.przystan;for(const k of Object.keys(S.res))if(E4Catalog.food.includes(k))S.res[k]=0;
  S.people.forEach(p=>p.hp=1);const ev0=S.e4.events.length;for(let d=0;d<4;d++){E4Economy.daily(S);S.day+=1;for(const k of Object.keys(S.res))if(E4Catalog.food.includes(k))S.res[k]=0}
  const hs=S.people.map(p=>p.hp);return JSON.stringify({spread:Math.max(...hs)-Math.min(...hs),warn:S.e4.events.slice(ev0).filter(e=>e.type==='hunger').length,min:Math.min(...hs)})})()`));
 assert.equal(r.warn,1,'one warning, not one per day');assert.ok(r.spread>.05,'people weaken at different speeds: '+r.spread);assert.ok(r.min>0,'nobody dies in four days');
});

test('a save made while the evening card holds time keeps the speed from before the card',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 E("setSpeed(4);rdPages=[{h:'Wieczór',L:['a']}];rdStart()");assert.equal(E('S.speed'),0);
 assert.equal(JSON.parse(E('serializeSave()')).speed,4);assert.equal(E('S.speed'),0,'the running game stays paused while reading');
 E('rdClose()');assert.equal(E('S.speed'),4);
});

test('calling the Clan Assembly too early says why instead of doing nothing',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 E("S.e3={done:1};ludInit();window.__t=[];toast=m=>__t.push(m)");
 const button={dataset:{e4Begin:'1'},closest:()=>button};const event={target:{closest:sel=>sel==='button'?button:null},stopPropagation(){},preventDefault(){}};
 for(const listener of runtime.documentListeners.click||[]){try{listener(event)}catch(e){}}
 assert.equal(E('!!S.e4Preparing'),false,'main quests of epoch III are not done yet');
 assert.ok(JSON.parse(E('JSON.stringify(__t)')).some(t=>/zadania główne epoki III/.test(t)),'the player is told what is missing');
});

test('a section opened by tapping its header stays open when the panel redraws at once',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);
 E("delete uiSections['osada:people']");
 const details={open:false,dataset:{uiSection:'osada:people'}};const summary={parentElement:details};
 const event={target:{closest:sel=>sel==='details.ui-section > summary'?summary:null}};
 for(const listener of runtime.documentListeners.click||[]){try{listener(event)}catch(e){}}
 assert.equal(E("uiSections['osada:people']"),true,'the state is stored on the tap, before the toggle event');
 assert.match(E("uiDisclosure('osada:people','Rodziny','x')"),/data-ui-section="osada:people" open/);
});

test('a release deployed during play reloads the open page once, but the page that registered the new worker does not reload',()=>{
 const run=(prevV,curV)=>{const runtime=createGame();runtime.game.startGame(true);let reloaded=0;runtime.sandbox.location.reload=()=>reloaded++;
  const ver=runtime.evaluate('GAME_VER');const url=v=>'https://x/sw.js?v='+encodeURIComponent(v==='this'?ver:v);
  runtime.sandbox.navigator.serviceWorker={controller:{scriptURL:url(prevV)}};runtime.evaluate('gameControllerChanged()');
  runtime.sandbox.navigator.serviceWorker.controller={scriptURL:url(curV)};runtime.evaluate('gameControllerChanged()');return reloaded};
 assert.equal(run('4.0.0-old','this'),0,'the new page registered its own worker: no second load');
 assert.equal(run('this','this'),1,'new worker content under the same address: the open page reloads');
 assert.equal(run('this','4.0.0-old'),1,'another version took over: reload');
});
