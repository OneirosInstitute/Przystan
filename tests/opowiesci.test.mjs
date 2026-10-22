import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.5: wieczorne opowieści czyta się w swoim tempie — karta stoi, dopóki gracz jej nie dotknie
function night(E){E("closeSheet();S.evT=1e9;openEvent=function(){}");E('(()=>{for(let n=0;n<DAY*.5*4;n++)step(1/4);let g=0;while((tod()<T1-.012||tod()>T1+.05)&&g++<DAY*8)step(1/4);setSpeed(2)})()')}
test('when night falls the evening card opens with the talk by the fire, the day and the night, and time stops',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);night(E);
 E('(()=>{for(let n=0;n<40;n++)step(1/4)})()');assert.ok(E('__rd.pages.length')>=1,'pages are waiting');
 E('czTalkTick()');assert.equal(E('__rd.open'),true);assert.equal(E('S.speed'),0,'time stops while reading');
 const heads=JSON.parse(E("JSON.stringify(__rd.pages.map(p=>p.h))"));assert.ok(heads.includes('Wieczór')||heads.includes('Nocą'),heads.join());
 assert.equal(E('isNight()'),true,'it opens at night, together with the skip-night button');
 // nikt nie przewija nocy pod spodem, dopóki karta jest otwarta
 E('(()=>{for(let n=0;n<200;n++)step(1/4)})()');assert.equal(E('__rd.open'),true,'the card waits for the player');
 E('__rd.rdClose()');assert.equal(E('__rd.open'),false);assert.equal(E('S.speed'),2,'time runs again at the old speed');
 const a=JSON.parse(E('JSON.stringify(S.wArch[S.wArch.length-1])'));assert.ok((a.L||[]).length||a.n,'the evening is kept in the chronicle');
});
test('the evening card can be switched off and then everything stays only in the chronicle',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E("localStorage.setItem('przystan-wieczory','0')");night(E);
 E('(()=>{for(let n=0;n<40;n++)step(1/4)})()');E('czTalkTick()');assert.equal(E('__rd.open'),false);assert.equal(E('S.speed'),2);
 assert.ok(E('(S.wArch||[]).length')>=1,'the evening is still written to the chronicle');
});
test('the day scenes are collected so the evening can show them whole',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E("closeSheet()");
 E("(()=>{const p=S.people.find(q=>q.age>=16);scBubble(p,'Test: '+p.name+' długo patrzy na morze i milczy.')})()");
 assert.ok(E("__rd.dzisLines().some(t=>/długo patrzy na morze/.test(t))"));
});
