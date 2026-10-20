import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createGame} from './runtime.mjs';
const require=createRequire(import.meta.url),world=require('../src/p_e4_world.js'),domain=require('../src/p_e4_domain.js'),economy=require('../src/p_e4_economy.js'),catalog=require('../src/p_e4_catalog.js');

// 4.4: folwark wybiera specjalizację z tego, co daje kraina; huta potrzebuje złoża rudy, a głębokie złoże sięga się szybem
// świat z rdzeniem prawdziwej wyspy (jak przy Wiecu Rodów), bo dopiero z nim są wysokie granie
function fixture(seed){const runtime=createGame(seed?{search:'?seed='+seed}:{});runtime.game.startGame(true);runtime.evaluate('ludInit();S.wozy=3;S.e3={done:1};e4Start()');const state=JSON.parse(runtime.evaluate('serializeSave()'));
 const stock=domain.stock(state,'przystan');for(const resource of ['suchary','drewno','deski','kamien','narz','opal','ziarno'])stock[resource]=3000;state.e4.settlements.przystan.capacity=100000;return state}
test('every specialty fits at least one region on several islands, and an ironworks needs ore',()=>{
 for(const seed of [2207,31,4096]){const w=fixture(seed).e4.world;
  for(const key of Object.keys(catalog.specialties))assert.ok(w.regions.some(r=>catalog.specialtyFit(key,r).ok),`wyspa ${seed}: ${key} nie pasuje nigdzie`);
  const high=w.regions.find(r=>r.biome==='high'),meadow=w.regions.find(r=>r.biome==='meadow'&&r.ore<.4);
  assert.equal(catalog.specialtyFit('hutniczy',high).ok,true);assert.deepEqual(catalog.specialtyFit('hutniczy',meadow).missing,['złoże rudy w skale'])}
});
test('founding refuses a specialty the region cannot carry and names what is missing',()=>{
 const state=fixture(),family=Object.values(state.e4.households).find(h=>domain.members(state,h.id).filter(p=>p.age>=16).length>=2);
 const region=state.e4.world.regions.find(r=>r.ore<.4&&world.route(state.e4.world,state.e4.world.town,r));const before=JSON.stringify(state.e4.settlements);
 const result=economy.found(state,{householdId:family.id,regionId:region.id,specialization:'hutniczy'});
 assert.equal(result.ok,false);assert.match(result.reason,/złoże rudy/);assert.equal(JSON.stringify(state.e4.settlements),before);
});
test('a mine shaft reaches the deep ore deposit and digs it faster than surface digging',()=>{
 const state=fixture();const high=state.e4.world.regions.find(r=>r.ore>=.6&&(Math.abs(r.x)>=96||Math.abs(r.z)>=96));
 const place=domain.createSettlement(state,{id:'huta',name:'Rudne Wzgórze',x:high.x,z:high.z,road:2,stage:'folwark',specialization:'hutniczy',autonomy:false});
 const pool=economy.nature(state,place);assert.ok(pool.oreDeep>=12000,'głębokie złoże');pool.ore=500;const surface0=pool.ore,deep0=pool.oreDeep;
 const workers=()=>domain.members?state.people.filter(p=>p.age>=16).slice(0,4):[];
 const crew=workers();crew.forEach(p=>{p.settlementId='huta';p.hp=1;p.e4HoursLeft=8});place.capacity=100000;
 const a=economy.gather(state,place,crew,'ruda',20);assert.ok(a>0);assert.ok(pool.ore<surface0);assert.equal(pool.oreDeep,deep0);
 crew.forEach(p=>{p.e4HoursLeft=8});place.buildings.szyb=1;const b=economy.gather(state,place,crew,'ruda',200);
 assert.ok(pool.oreDeep<deep0,'szyb bierze z głębokiego złoża');
 // ta sama praca daje z szybu dwa i pół raza więcej rudy
 crew.forEach(p=>{p.e4HoursLeft=1});const c0=pool.oreDeep;place.buildings.szyb=1;const withShaft=economy.gather(state,place,crew,'ruda',1000);
 crew.forEach(p=>{p.e4HoursLeft=1});delete place.buildings.szyb;const noShaft=economy.gather(state,place,crew,'ruda',1000);
 assert.ok(Math.abs(withShaft/noShaft-2.5)<.01,withShaft+' / '+noShaft);
});
test('core deposits found before the clan council carry their remaining ore, stone and clay into the regions',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 const r=JSON.parse(runtime.evaluate(`(()=>{const o=__zl.deposits().find(q=>q.t==='rudne');odkInit();S.odk[o.id]={s:2,d:0,nm:'Rudne'};const z=__zl.zlInit(o);z[0]=100;
  ludInit();S.e3={done:1};e4Start();const region=E4World.regionAt(S.e4.world,o.x,o.z);return JSON.stringify({deep:E4Economy.nature(S,region).oreDeep,left:z.reduce((a,b)=>a+b,0)})})()`));
 assert.equal(r.deep,r.left);assert.equal(r.left,100+5000+9000);
});
