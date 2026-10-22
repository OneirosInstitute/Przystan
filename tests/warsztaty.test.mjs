import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.1: każdy warsztat ma własną sylwetkę, mieści się na swoim placu i nie przekracza budżetu trójkątów
function game(){const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);return E}
const measure=`(k,lv,gl)=>{const keep=GFX.level;GFX.level=gl;try{const g=makeBuildingModel(k,{id:4242,kind:k,ext:[],lv,prog:1,work:1,cond:1});let t=0,n=0;const sig=[];
  g.traverse(o=>{if(o.isMesh){n++;const gg=o.geometry;t+=(gg.index?gg.index.count:gg.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);sig.push(gg.type[0]+Math.round((gg.boundingSphere||(gg.computeBoundingSphere(),gg.boundingSphere)).radius*20))}});
  const b=new THREE.Box3().setFromObject(g);return{t:Math.round(t),n,sig:sig.sort().join(''),x0:b.min.x,x1:b.max.x,z0:b.min.z,z1:b.max.z,y1:b.max.y}}finally{GFX.level=keep}}`;

test('every craft building builds at all levels and graphics settings within the triangle budget',()=>{
 const E=game();
 const r=JSON.parse(E(`(()=>{const m=${measure};const out={};for(const k of Object.keys(__warsztaty.W_MODELS))for(const lv of[1,2,3])for(const gl of[0,1,2]){const x=m(k,lv,gl);if(x.t>4200||x.n<12)out[k+lv+gl]=x.t+'/'+x.n}return JSON.stringify({bad:out,n:Object.keys(__warsztaty.W_MODELS).length})})()`));
 assert.ok(r.n>=22,'22 craft buildings have their own model');
 assert.deepEqual(r.bad,{});
});

test('craft buildings stay on their plot and differ from each other',()=>{
 const E=game();
 const r=JSON.parse(E(`(()=>{const m=${measure};const out={},sigs={};for(const k of Object.keys(__warsztaty.W_MODELS)){const x=m(k,1,1),d=BD[k],hw=d.w/2+.3,hh=d.h/2+.3;
   if(x.x0<-hw||x.x1>hw||x.z0<-hh||x.z1>hh)out[k]=[x.x0,x.x1,x.z0,x.z1].map(v=>+v.toFixed(2));sigs[k]=x.sig}
   const dup=[];const ks=Object.keys(sigs);for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++)if(sigs[ks[i]]===sigs[ks[j]])dup.push(ks[i]+'='+ks[j]);return JSON.stringify({out,dup})})()`));
 assert.deepEqual(r.out,{},'models fit the plot');
 assert.deepEqual(r.dup,[],'no two crafts share the same model');
});

test('the old generic hut no longer stands in for the craft buildings, and epoch IV uses the new hen house and saw pit',()=>{
 const E=game();
 assert.equal(E("E4Catalog.buildings.kurnik.model"),'kurnik');assert.equal(E("E4Catalog.buildings.tartak.model"),'pracownia');
 // gotowa wioska nadal się składa i łączy w bryły
 E('(()=>{for(let n=0;n<40;n++)step(1/4)})()');assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});
