import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.11: co drugi budynek stoi w lustrzanym odbiciu, zawsze tak samo dla tego samego budynku
test('about half of the buildings of one kind are mirrored, the same way every time',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);
 const n=E("(()=>{let n=0;for(let id=1;id<=400;id++)if(__mir.bMir({id,kind:'drwal'}))n++;return n})()");
 assert.ok(n>150&&n<250,`mirrored: ${n} of 400`);
 assert.equal(E("__mir.bMir({id:77,kind:'chata'})"),E("__mir.bMir({id:77,kind:'chata'})"));
 for(const k of ['serce','pole','dwor','pomost','wiatrak'])assert.equal(E(`(()=>{for(let id=1;id<50;id++)if(__mir.bMir({id,kind:'${k}'}))return true;return false})()`),false,k);
});
test('a mirrored building stays mirrored after the finishing bounce, and its lean-to checks the right neighbour',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const r=JSON.parse(E(`(()=>{let id=900;while(!__mir.bMir({id,kind:'drwal'}))id++;const b={id,kind:'drwal',i:30,j:30,prog:1,work:1,workers:0,lv:2,ext:[]};S.bld.push(b);addBuildingMesh(b);const g=bMesh[id];
  const s0=g.scale.x;g.userData.popT=0;for(let k=0;k<20;k++)budFrame(.05);const s1=g.scale.x;
  const cnt=()=>{bGroup.remove(bMesh[id]);addBuildingMesh(b);let n=0;bMesh[id].traverse(o=>{if(o.isMesh&&o.geometry.attributes.position)n+=o.geometry.attributes.position.count});return n};
  const free=cnt();S.bld.push({id:'L',kind:'sklad',i:28,j:30,prog:1});const left=cnt();S.bld.push({id:'R',kind:'sklad',i:32,j:30,prog:1});const both=cnt();
  return JSON.stringify({s0,s1,free,left,both})})()`));
 assert.ok(r.s0<0,'mirrored');assert.ok(r.s1<0,'still mirrored after the bounce');
 assert.equal(r.left,r.free,'a mirrored lean-to stands on the right, so a building on the left does not matter');
 assert.ok(r.both<r.free,'a building on the right takes its place');
});
