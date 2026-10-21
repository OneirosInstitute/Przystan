import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createGame} from './runtime.mjs';

// 4.8.0-rc.4: po resecie GPU na telefonie budynki nie robią się czarne
test('textures of buildings are sent again after the GPU context comes back',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);
 const r=JSON.parse(E(`(()=>{const L=Object.values(TX);const before=L.map(t=>t.version);gpuRestored();return JSON.stringify({n:L.length,before,after:L.map(t=>t.version)})})()`));
 assert.ok(r.n>=6);
 // tekstury użyte w scenie dostają nową wersję, więc WebGL wgra je jeszcze raz
 assert.ok(r.after.some((v,i)=>v>r.before[i]),'at least the textures used by buildings are marked for upload');
});

test('texture canvases live in ordinary memory and redraw themselves when Chrome restores them',()=>{
 const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.match(html,/HTMLCanvasElement\.prototype\.getContext=function\(type,opt\)\{if\(type==='2d'&&!this\.isConnected/);
 assert.match(html,/willReadFrequently:true/);
 assert.match(html,/c\.addEventListener\('contextrestored',\(\)=>\{try\{draw\(x,w,h\);t\.needsUpdate=true\}/);
 assert.match(html,/addEventListener\('webglcontextrestored'/);
});
