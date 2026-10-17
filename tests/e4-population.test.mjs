import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createGame} from './runtime.mjs';
const require=createRequire(import.meta.url),world=require('../src/p_e4_world.js'),domain=require('../src/p_e4_domain.js'),economy=require('../src/p_e4_economy.js');
test('autonomous society survives five generations with births, kinship, learning, succession and save continuity',()=>{
 const life=require('../src/p_e4_population.js'),runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit();');
 let state=domain.migrate(JSON.parse(runtime.evaluate('serializeSave()')),{world:world.create({seed:2207,town:{x:0,z:50}})});
 Object.assign(state.res,{suchary:12000,drewno:3000,deski:3000,kamien:3000,ziarno:3000,opal:3000});economy.ensure(state);
 const originalIds=new Set(state.people.map(person=>person.id));
 for(let day=0;day<1500;day++){economy.advance(state,1,life.daily);if(day%100===0){assert.equal(domain.validate(state),true);state=JSON.parse(JSON.stringify(state));}}
 assert.ok(state.people.length>=12,'society remains alive: '+state.people.length);
 assert.ok(state.e4.stats.maxGeneration>=5,'generation '+state.e4.stats.maxGeneration);
 assert.ok(state.e4.stats.births>0);assert.ok(state.e4.stats.succession>0);
 assert.ok(Object.values(state.e4.archive).some(person=>originalIds.has(person.id)));
 assert.ok(state.people.some(person=>person.par?.length===2&&person.sk.rolnik>0));
 console.log(JSON.stringify({days:1500,living:state.people.length,generations:state.e4.stats.maxGeneration,births:state.e4.stats.births,deaths:state.e4.stats.deaths,succession:state.e4.stats.succession,bytes:JSON.stringify(state).length}));
 const first=JSON.parse(JSON.stringify(state)),second=JSON.parse(JSON.stringify(state));economy.advance(first,8,life.daily);for(let part=0;part<32;part++)economy.advance(second,.25,life.daily);assert.deepEqual(first,second);
});

test('several settlements retain productive descendants for five generations without manual resupply',()=>{
 const life=require('../src/p_e4_population.js'),runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit()');
 const source=JSON.parse(runtime.evaluate('serializeSave()'));source.hamlets=[{id:1,name:'Podlesie',i:120,j:90,pop:8,zap:1,rod:1},{id:2,name:'Zagórze',i:70,j:80,pop:8,zap:1,rod:2},{id:3,name:'Miodowa',i:150,j:110,pop:8,zap:1,rod:3}];
 let state=domain.migrate(source,{world:world.create({seed:2207,town:{x:0,z:50}})});Object.assign(state.res,{suchary:12000,drewno:3000,deski:3000,kamien:3000,ziarno:3000,opal:3000});
 for(const settlement of Object.values(state.e4.settlements)){settlement.homeCapacity=Math.max(12,settlement.homeCapacity);settlement.specialization=settlement.id==='przystan'?'drzewny':settlement.id.endsWith('1')?'rolniczy':settlement.id.endsWith('2')?'garncarski':'hodowlany';}
 for(let day=0;day<1500;day++){economy.advance(state,1,life.daily);if(day%50===0){assert.equal(domain.validate(state),true);state=JSON.parse(JSON.stringify(state));}}
 const inhabited=Object.values(state.e4.settlements).filter(settlement=>domain.residents(state,settlement.id).length>=4);
 console.log(JSON.stringify({scenario:'multi',living:state.people.length,inhabited:inhabited.length,stats:state.e4.stats,bytes:JSON.stringify(state).length}));
 assert.ok(inhabited.length>=3);assert.ok(state.e4.stats.maxGeneration>=5);assert.ok(state.e4.stats.deliveries>0);
 assert.ok(inhabited.every(settlement=>settlement.fields.some(field=>field.harvests>10)));
 assert.ok(state.people.every(person=>Number.isFinite(person.hp)&&person.hp>0));
 runtime.sandbox.__e4Checkpoint=JSON.stringify(state);assert.equal(runtime.evaluate('S=JSON.parse(window.__e4Checkpoint);decodeSave(serializeSave())!==null'),true,'real save decoder accepts the eighth generation');assert.equal(runtime.game.save(),true);
});

test('legacy twins survive migration even when the old save has no surviving father identity',()=>{
 const life=require('../src/p_e4_population.js'),runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit()');const source=JSON.parse(runtime.evaluate('serializeSave()')),mother=source.people.find(person=>person.sex==='k'&&person.pair!=null);
 const father=mother.pair;source.people=source.people.filter(person=>person.id!==father);mother.pair=null;mother.ciaza={s:source.day-5,d:source.day+1,n:2};
 const state=domain.migrate(source,{world:world.create({seed:2207,town:{x:0,z:50}})});state.res.suchary=3000;state.res.ziarno=200;state.e4.settlements.przystan.capacity=10000;
 economy.advance(state,2,life.daily);const children=state.people.filter(person=>person.par?.length===1&&person.par[0]===mother.id&&person.age<1);
 assert.equal(children.length,2);assert.ok(children.every(person=>person.unknownFather));assert.equal(domain.validate(state),true);
});
