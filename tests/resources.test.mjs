import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createGame} from './runtime.mjs';

test('rebuilding twenty times disposes retired private geometries',()=>{
 const runtime=createGame();
 const result=runtime.evaluate(`(()=>{
 S=freshState();const building={id:501,kind:'chata',i:camp.i+6,j:camp.j-8,prog:5,work:5,lv:1,ext:[]};S.bld.push(building);addBuildingMesh(building);
 const retired=new Map();
 for(let index=0;index<20;index++){
  bMesh[501].traverse(object=>{if(object.geometry&&!retired.has(object.geometry)){const counter={count:0};retired.set(object.geometry,counter);object.geometry.addEventListener('dispose',()=>counter.count++)}});
  rebuildMesh(building);
 }
 const active=new Set();scene.traverse(object=>{if(object.geometry)active.add(object.geometry)});
 const previous=[...retired].filter(([geometry])=>!active.has(geometry));
 return {retired:previous.length,notDisposed:previous.filter(([,counter])=>!counter.count).length};
})()`);
 assert.ok(result.retired>300);
 assert.equal(result.notDisposed,0);
});

test('shared geometry survives until its final scene user is removed',()=>{
 const runtime=createGame();
 assert.equal(runtime.evaluate(`(()=>{const geometry=new THREE.BoxGeometry(1,1,1),material=M(0xffffff),a=new THREE.Mesh(geometry,material),b=new THREE.Mesh(geometry,material);let count=0;geometry.addEventListener('dispose',()=>count++);scene.add(a,b);retireObjects(a);if(count)return false;retireObjects(b);return count===1})()`),true);
});

test('confirmed person-name sink escapes markup even without the import boundary',()=>{
 const runtime=createGame();
 runtime.game.startGame(true);runtime.game.closeSheet();
 runtime.evaluate("S.people[0].name='<em data-proof=\"1\">Osadnik</em>';select(S.people[0].id);renderSel()");
 assert.equal(runtime.elements.get('sel').innerHTML.includes('<em data-proof='),false);
 assert.ok(runtime.elements.get('sel').innerHTML.includes('&lt;em'));
});

test('service worker deletes only own caches and never intercepts API',async()=>{
 const events={},deleted=[];
 const worker=fs.readFileSync(new URL('../dist/sw.js',import.meta.url),'utf8');
 const context={URL,location:{origin:'https://example.test'},self:{registration:{scope:'https://example.test/'},addEventListener:(name,callback)=>events[name]=callback,clients:{claim:async()=>{}},skipWaiting:async()=>{}},caches:{keys:async()=>['przystan-_-old','other-app-cache','font-cache'],delete:async name=>{deleted.push(name);return true}}};
 vm.runInNewContext(worker,context);
 let done;events.activate({waitUntil:promise=>done=promise});await done;
 assert.deepEqual(deleted,['przystan-_-old']);
 let intercepted=false;events.fetch({request:{method:'GET',url:'https://example.test/api/tydzien'},respondWith:()=>intercepted=true});
 assert.equal(intercepted,false);
});
