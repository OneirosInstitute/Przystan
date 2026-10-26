import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.10: życie przy budynkach tylko na grafice wysokiej i ultra
const setup=E=>{E('E2START=true');E('startGame(true)');E("S.day=Math.floor(S.day/YEAR)*YEAR+YEAR+50.45;S.speed=1;document.hidden=false")};
test('on high graphics chimneys smoke in winter and the pennants move',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);setup(E);E('GFX.level=1');
 const r=JSON.parse(E(`(()=>{const h=S.bld.find(b=>b.kind==='chata'&&bDone(b));bGroup.remove(bMesh[h.id]);addBuildingMesh(h);
  const g=bMesh[h.id];const ch=g.userData.anims.filter(o=>o.userData.an==='chim');camT.x=g.position.x;camT.z=g.position.z;
  const y0=ch.map(o=>o.position.y);__oz.ozFrame(.5);__oz.ozFrame(.5);const y1=ch.map(o=>o.position.y);
  const w=S.bld.find(b=>bDone(b)&&BD[b.kind].wk&&b.kind!=='pole');w.lv=3;bGroup.remove(bMesh[w.id]);addBuildingMesh(w);const fg=bMesh[w.id].userData.anims.find(o=>o.userData.an==='flag');
  camT.x=bMesh[w.id].position.x;camT.z=bMesh[w.id].position.z;const a0=fg&&fg.rotation.y;__oz.ozFrame(.3);const a1=fg&&fg.rotation.y;
  return JSON.stringify({chim:ch.length,vis:ch.every(o=>o.visible),moved:y0.some((y,k)=>Math.abs(y-y1[k])>1e-3),flag:!!fg,flagMoved:fg?Math.abs(a0-a1)>1e-4:false})})()`));
 assert.equal(r.chim,3,'three puffs over the chimney');assert.equal(r.vis,true,'in winter the chimney smokes');assert.equal(r.moved,true);
 assert.equal(r.flag,true);assert.equal(r.flagMoved,true);
});
test('on low graphics nothing moves and no chimney smoke is made',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);setup(E);E('GFX.level=0');
 const r=JSON.parse(E(`(()=>{const h=S.bld.find(b=>b.kind==='chata'&&bDone(b));bGroup.remove(bMesh[h.id]);addBuildingMesh(h);const g=bMesh[h.id];
  return JSON.stringify({chim:(g.userData.anims||[]).filter(o=>o.userData.an==='chim').length,run:__oz.ozFrame(.5)})})()`));
 assert.equal(r.chim,0);assert.equal(r.run,false);
});
test('summer chimneys smoke only in the morning and in the evening',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);setup(E);
 E('S.day=Math.floor(S.day/YEAR)*YEAR+YEAR+2.5');assert.equal(E('__oz.ozChimOn()'),false);
 E('S.day=Math.floor(S.day)+T1-.05');assert.equal(E('__oz.ozChimOn()'),true);
});
