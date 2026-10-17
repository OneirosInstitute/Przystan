import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createGame} from './runtime.mjs';
const require=createRequire(import.meta.url),world=require('../src/p_e4_world.js'),domain=require('../src/p_e4_domain.js'),economy=require('../src/p_e4_economy.js');

function fixture(){const runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit();S.wozy=3');const source=JSON.parse(runtime.evaluate('serializeSave()'));for(const resource of ['suchary','drewno','deski','kamien','narz','opal','ziarno'])source.res[resource]=3000;
 const state=domain.migrate(source,{world:world.create({seed:2207,town:{x:0,z:50}})});state.e4.settlements.przystan.capacity=100000;return state;
}
function destination(state){return domain.createSettlement(state,{id:'cel',name:'Nowe Łąki',x:60,z:0,road:2,stage:'folwark',autonomy:false})}

test('one shipment moves real stock and is delivered once after a save and reload',()=>{
 const state=fixture();destination(state);const initial=state.res.deski;
 const result=economy.ship(state,{from:'przystan',to:'cel',items:{deski:10}});
 assert.equal(result.ok,true);assert.equal(state.res.deski,initial-10);assert.equal(state.e4.settlements.cel.stock.deski||0,0);
 const restored=JSON.parse(JSON.stringify(state));economy.advance(restored,10);
 assert.equal(restored.e4.settlements.cel.stock.deski,10);
 economy.advance(restored,10);assert.equal(restored.e4.settlements.cel.stock.deski,10);
 assert.equal(restored.e4.transports.length,0);assert.equal(domain.validate(restored),true);
});

test('failed transport contracts do not debit the source or allocate workers',()=>{
 const state=fixture();destination(state);economy.ensure(state);const original=JSON.stringify(state);
 for(const items of [{deski:999999},{deski:-2},{deski:Infinity},{unknown:1}]){
  assert.equal(economy.ship(state,{from:'przystan',to:'cel',items}).ok,false);assert.equal(JSON.stringify(state),original);
 }
});

test('founding physically moves the same family, constructs an ancestral home and preserves old town houses',()=>{
 const state=fixture(),family=Object.values(state.e4.households).find(household=>domain.members(state,household.id).filter(person=>person.age>=16).length>=2);
 const region=state.e4.world.regions.filter(region=>Math.hypot(region.x,region.z-50)>35&&Math.hypot(region.x,region.z-50)<90).find(region=>world.route(state.e4.world,state.e4.world.town,region));
 const peopleIds=domain.members(state,family.id).map(person=>person.id),initialPopulation=state.people.length,oldHouses=JSON.stringify(state.bld);
 const result=economy.found(state,{householdId:family.id,regionId:region.id,specialization:'rolniczy'});
 assert.equal(result.ok,true);assert.ok(peopleIds.every(id=>state.people.find(person=>person.id===id).e4Transport));
 assert.equal(Object.keys(state.e4.settlements[result.id].stock).length,0);
 economy.advance(state,20);
 assert.equal(state.people.length,initialPopulation);assert.equal(JSON.stringify(state.bld),oldHouses);
 assert.ok(peopleIds.every(id=>state.people.find(person=>person.id===id).settlementId===result.id));
 assert.equal(state.e4.settlements[result.id].buildings.dom_rodowy,1);
 assert.equal(domain.validate(state),true);
});

test('transport and construction have the same result under different clock subdivisions',()=>{
 const first=fixture();destination(first);economy.ship(first,{from:'przystan',to:'cel',items:{deski:20}});
 const second=JSON.parse(JSON.stringify(first));economy.advance(first,6);
 for(let count=0;count<24;count++)economy.advance(second,.25);
 assert.deepEqual(second,first);
});

test('wine uses grapes, a barrel, worker time and fermentation; restart cannot duplicate the batch',()=>{
 const state=fixture(),town=state.e4.settlements.przystan;town.autonomy=false;town.buildings.winiarnia=1;
 state.res.winogrona=12;state.res.beczki=1;
 assert.equal(economy.batch(state,'przystan','wino').ok,true);
 assert.equal(state.res.winogrona,0);assert.equal(state.res.beczki,0);assert.equal(state.res.wino||0,0);
 economy.advance(state,1);assert.equal(state.res.wino||0,0);
 const saved=JSON.parse(JSON.stringify(state));economy.advance(saved,5);assert.equal(saved.res.wino||0,0);
 economy.advance(saved,2);assert.equal(saved.res.wino,8);
 economy.advance(saved,5);assert.equal(saved.res.wino,8);assert.equal(saved.e4.settlements.przystan.batches.length,0);
});

test('a field consumes seed, requires care, grows and produces a finite harvest',()=>{
 const state=fixture(),town=state.e4.settlements.przystan;town.autonomy=false;
 const original=state.res.ziarno;
 assert.equal(economy.project(state,'przystan','pole').ok,true);assert.equal(state.res.ziarno,original-2);
 economy.advance(state,2);assert.equal(town.fields.length,1);assert.ok(town.fields[0].progress>0);
 const harvestsBefore=state.e4.stats.harvests||0;economy.advance(state,8);
 assert.ok((state.e4.stats.harvests||0)>harvestsBefore);
 assert.ok(Number.isFinite(state.res.ziarno)&&state.res.ziarno>=0);
});

test('processing without inputs or workers cannot create goods',()=>{
 const state=fixture();const target=destination(state);target.buildings.huta=1;
 target.stock.ruda=8;target.stock.wegiel=6;
 assert.equal(economy.batch(state,'cel','zelazo').ok,false);
 assert.equal(target.stock.ruda,8);assert.equal(target.stock.zelazo||0,0);
 assert.equal(economy.batch(state,'przystan','wino').ok,false);
});

test('every recipe consumes its inputs and produces one delayed result',()=>{
 const source=fixture();source.e4.settlements.przystan.autonomy=false;
 for(const [recipeId,recipe]of Object.entries(economy.catalog.recipes)){
  const state=JSON.parse(JSON.stringify(source)),town=state.e4.settlements.przystan;town.buildings[recipe.building]=1;town.capacity=100000;
  for(const key of Object.keys(state.res))state.res[key]=0;state.res.suchary=10000;Object.assign(state.res,recipe.input);
  assert.equal(economy.batch(state,'przystan',recipeId).ok,true,recipeId);
  for(const key of Object.keys(recipe.input))assert.equal(state.res[key],0,recipeId+' reserves '+key);
  economy.advance(state,recipe.days+2);
  for(const key of Object.keys(recipe.output))assert.ok(town.output[key]>=recipe.output[key],recipeId+' produces '+key);
  assert.equal(town.batches.length,0,recipeId);
 }
});

test('livestock has identities, wild capture, reproduction and irreversible slaughter',()=>{
 for(const species of ['koza','kura','swinia']){
  const state=fixture(),town=state.e4.settlements.przystan;town.autonomy=false;town.buildings[economy.catalog.animals[species].building]=1;
  const pool=economy.nature(state,town),wild=pool.wild[species];
  assert.equal(economy.capture(state,'przystan',species).ok,true);assert.equal(pool.wild[species],wild-1);
  economy.advance(state,2);assert.equal(town.herd.length,1);
  economy.capture(state,'przystan',species);economy.advance(state,2);assert.equal(town.herd.length,2);
  const saved=JSON.parse(JSON.stringify(state));economy.advance(saved,60);const target=saved.e4.settlements.przystan;
  assert.ok(saved.e4.stats.animalBirths>0,species);assert.ok(target.herd.length>2,species);
  if(species==='koza')assert.ok(saved.res.mleko>0);if(species==='kura')assert.ok(saved.res.jaja>0);
  const animal=target.herd[0],meat=saved.res.mieso||0;assert.equal(economy.slaughter(saved,'przystan',animal.id).ok,true);assert.ok(saved.res.mieso>meat);assert.equal(economy.slaughter(saved,'przystan',animal.id).ok,false);
 }
});

test('nature is shared by region and generations advance without replacing residents',()=>{
 const state=fixture(),town=state.e4.settlements.przystan;
 const other=domain.createSettlement(state,{id:'sasiad',name:'Sąsiedzi',x:town.x-.1,z:town.z});
 assert.equal(economy.nature(state,town),economy.nature(state,other));
});

test('full destination rejects transport and full store delays harvesting without losing crops',()=>{
 const state=fixture(),target=destination(state);target.capacity=5;economy.ensure(state);const source=JSON.stringify(state.res);
 assert.equal(economy.ship(state,{from:'przystan',to:'cel',items:{deski:10}}).ok,false);assert.equal(JSON.stringify(state.res),source);
 const town=state.e4.settlements.przystan;town.autonomy=false;town.capacity=0;town.fields=[{id:99,crop:'zboze',planted:0,age:20,progress:6,soil:1,sown:true,harvests:0}];
 economy.advance(state,1);assert.equal(town.fields[0].harvests,0);assert.ok(town.fields[0].sown);
 town.capacity=100000;economy.advance(state,1);assert.equal(town.fields[0].harvests,1);
});

test('a vineyard requires a successful trial, matures slowly and feeds actual wine production',()=>{
 const state=fixture(),town=state.e4.settlements.przystan;town.autonomy=false;town.buildings.winiarnia=1;town.buildings.stolarnia=1;state.e4.randomState=1;
 assert.equal(economy.project(state,'przystan','winnica').ok,false);
 const tools=state.res.narz;assert.equal(economy.trial(state,'przystan','winogrona').ok,true);assert.equal(state.res.narz,tools-1);
 economy.advance(state,1);assert.ok(town.land.seeds.winogrona>0);
 assert.equal(economy.project(state,'przystan','winnica').ok,true);economy.advance(state,20);assert.equal(town.output.winogrona||0,0,'immature vines do not yield');
 economy.advance(state,20);assert.ok(town.output.winogrona>=12);
 state.res.zelazo=1;assert.equal(economy.batch(state,'przystan','beczki').ok,true);economy.advance(state,1);
 assert.equal(economy.batch(state,'przystan','wino').ok,true);const restarted=JSON.parse(JSON.stringify(state));economy.advance(restarted,8);assert.equal(restarted.e4.settlements.przystan.output.wino,8);
});
