import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createGame} from './runtime.mjs';

test('autosave retains an open decision while simulation is paused',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 runtime.evaluate("openEvent(EVENTS.find(event=>event.id==='swieto'),{})");
 runtime.advanceTime(15000);
 const state=JSON.parse(runtime.memory.get('przystan-v7'));
 assert.equal(state.pendingDecision.id,'swieto');
 assert.equal(state.speed,0);
});
test('building panel lists requirements for locked residential upgrade and household reserves',()=>{
 const runtime=createGame();
 runtime.evaluate('S=freshState();S.bld.push({id:100,kind:"chata",i:83,j:166,prog:14,work:14,cmp:1,ext:[],cond:1});S.fams[1].home=100;selectB(100);renderSel()');
 const markup=runtime.elements.get('sel').innerHTML;
 assert.match(markup,/Kolejny poziom: Dom z piecem/);
 assert.match(markup,/Wymagania/);
 assert.match(markup,/Zapasy domu/);
});
test('distant map labels are collapsed and aurora cannot blank out island overview',()=>{
 const css=fs.readFileSync(new URL('../src/p_head.html',import.meta.url),'utf8');
 const aurora=fs.readFileSync(new URL('../src/p_swiat.js',import.meta.url),'utf8');
 assert.match(css,/#labels:not\(\.map-labels-expanded\) \.rl span\{display:none\}/);
 assert.match(aurora,/zoom>\.9/);
});
