import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createGame} from './runtime.mjs';

test('autosave has a real-time timer independent of simulated days',()=>{
 const source=fs.readFileSync(new URL('../src/p_end.js',import.meta.url),'utf8');
 assert.match(source,/autosaveIntervalMs=90000/);
 assert.match(source,/setInterval\(\(\)=>\{if\(S&&!document.hidden&&!saveStatus.blocked\)save\(\)\}/);
 assert.match(source,/addEventListener\('pagehide'/);
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
