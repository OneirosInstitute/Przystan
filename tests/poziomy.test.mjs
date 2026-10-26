import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.8: poziom budynku widać na modelu, a zapas pod przybudówką zależy od fachu
const count=(E,kind,lv)=>E(`(()=>{const base=S.bld.find(b=>b.kind==='chata');const bb=Object.assign({},base,{kind:'${kind}',id:777,i:5,j:5,ext:[],lv:${lv},proj:null,fire:0,cond:1});
 const g=makeBuildingModel('${kind}',bb);let n=0;g.traverse(o=>{if(o.isMesh)n++});return n})()`);
test('each level adds something you can see',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 for(const k of ['drwal','kuznia','mysliwy','piekarnia','kopalnia','spizarnia','zagroda']){
  const a=count(E,k,1),b=count(E,k,2),c=count(E,k,3);
  assert.ok(b>a,`${k}: level 2 (${b}) adds a lean-to over level 1 (${a})`);
  assert.ok(c>b+8,`${k}: level 3 (${c}) adds a yard, a path and a pennant over level 2 (${b})`);
 }
});
test('the stock under the lean-to belongs to the trade',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);
 assert.equal(E("__lv.LV_OF.drwal"),'drewno');assert.equal(E("__lv.LV_OF.kuznia"),'ogien');assert.equal(E("__lv.LV_OF.mysliwy"),'lowy');
 assert.equal(E("__lv.LV_OF.spichlerz"),'sklad');assert.equal(E("__lv.LV_OF.kopalnia"),'kop');
 for(const t of ['drewno','ogien','lowy','przetw','kop','sklad','zagroda','inne'])
  assert.ok(E(`(()=>{const g=new THREE.Group();__lv.lvStock(g,'${t}',2);let n=0;g.traverse(o=>{if(o.isMesh)n++});return n})()`)>2,t);
});
test('a lean-to or a yard is not drawn into a neighbouring building',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 const free=count(E,'drwal',3);
 E("S.bld.push({id:778,kind:'sklad',i:3,j:5,prog:1},{id:779,kind:'sklad',i:7,j:5,prog:1})");
 const tight=count(E,'drwal',3);
 assert.ok(tight<free-10,`with neighbours on both sides (${tight}) the lean-to and the yard are left out (${free})`);
});
