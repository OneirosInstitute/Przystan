import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.5.0-rc.2: przysiółki na nowym lądzie od epoki II, wiec wybiera krainę naprawdę
test('ring regions open for hamlets in epoch II, the chosen region is honoured and boat-only isles are skipped',()=>{
 const runtime=createGame();runtime.game.startGame(true);const E=s=>runtime.evaluate(s);
 E('(()=>{for(let k=0;k<N*N;k++)rev[k]=1;regionScan(true);S.tier=1})()');
 assert.equal(E('freeRegions().filter(r=>r.ring).length'),0,'epoch I settles only the old island');
 E("S.epoch=2;S.path='dom'");
 const ring=JSON.parse(E('JSON.stringify(freeRegions().filter(r=>r.ring).map(r=>r.name))'));
 assert.ok(ring.length>=15,'most of the new land is open in epoch II');
 assert.ok(!ring.includes('Wyspy Mew'),'islands reachable only by boat are not offered');
 const opts=E('(()=>{__przys.min=0;let cap=null;const o=openEvent;openEvent=ev=>{cap=ev};kolNew();openEvent=o;return cap.opts.map(x=>x.n+"|"+x.d).join("\\n")})()');
 assert.match(opts,/za zatoką/,'the council map always shows one place across the bay');
 const h=JSON.parse(E(`(()=>{const r=REGIONS.find(r=>r&&r.name==='Dolina Wierzby');const c=kolCands()[0];const h=kolGo(c,r.id,true);return JSON.stringify({rid:h.rid,want:r.id,path:!!hamPath[h.id],len:hamPath[h.id]&&hamPath[h.id].len})})()`));
 assert.equal(h.rid,h.want,'the hamlet goes where the council decided');
 assert.ok(h.path&&h.len>150,'a walked path leads across a neck to the new land');
 E('(()=>{for(let n=0;n<4800;n++)step(1/10)})()');
 assert.ok(E('S.hamlets.every(h=>h.arr<=S.day&&h.pop>0)'),'the settlers arrive');
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
 E('boot(false)');assert.ok(E('!!hamPath[S.hamlets[0].id]'),'the path is rebuilt after loading');
});
