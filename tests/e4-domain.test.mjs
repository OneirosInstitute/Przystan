import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createGame} from './runtime.mjs';
const require=createRequire(import.meta.url),worldModel=require('../src/p_e4_world.js'),domain=require('../src/p_e4_domain.js');

function fixture(){const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();runtime.evaluate('ludInit()');return JSON.parse(runtime.evaluate('serializeSave()'))}
const options=()=>({world:worldModel.create({seed:2207,town:{x:0,z:65}}),dailyFactor:4.8});

test('E4 migration retains living identities, kinship, possessions and all ordinary homes',()=>{
 const source=fixture(),unchanged=JSON.stringify(source),migrated=domain.migrate(source,options());
 assert.equal(JSON.stringify(source),unchanged);
 assert.deepEqual(migrated.people.map(person=>[person.id,person.name,person.pair,person.par,person.sk,person.carry]),source.people.map(person=>[person.id,person.name,person.pair,person.par,person.sk,person.carry]));
 assert.deepEqual(migrated.bld,source.bld);assert.deepEqual(migrated.res,source.res);
 assert.equal(migrated.epoch,4);assert.ok(domain.validate(migrated));
 assert.deepEqual(domain.migrate(migrated,options()),migrated);
});

test('legacy hamlet residents become persistent people with unknown history explicitly marked',()=>{
 const source=fixture();source.hamlets=[{id:8,rid:3,i:120,j:70,rod:1,pop:4,ppl:['Mira','Mieszko'],name:'Podlesie',zap:.5,st:2,road:2}];
 const migrated=domain.migrate(source,options()),residents=migrated.people.filter(person=>person.settlementId==='przysiolek:8');
 assert.equal(residents.length,4);assert.deepEqual(residents.slice(0,2).map(person=>person.name),['Mira','Mieszko']);
 assert.ok(residents.every(person=>person.historyUnknown&&person.ageEstimated&&person.par.length===0));
 assert.equal(new Set(migrated.people.map(person=>person.id)).size,migrated.people.length);
 const opening=migrated.e4.migration.reservesConverted[0];assert.equal(opening.source,8);assert.equal(opening.quantity,migrated.e4.settlements['przysiolek:8'].stock.suchary);
 assert.equal(domain.validate(migrated),true);
});

test('all people have exactly one household, clan and settlement; duplicate or orphan references fail validation',()=>{
 const migrated=domain.migrate(fixture(),options());
 assert.equal(domain.validate(migrated),true);
 const duplicate=structuredClone(migrated);duplicate.people.push({...duplicate.people[0]});assert.equal(domain.validate(duplicate),false);
 for(const property of ['settlementId','rod','fam']){const broken=structuredClone(migrated);broken.people[0][property]='missing';assert.equal(domain.validate(broken),false)}
 const badWorld=structuredClone(migrated);badWorld.e4.world.size=100000;assert.equal(domain.validate(badWorld),false);
});

test('repeated migration and save reload preserve one balance and the same identifiers',()=>{
 const initial=domain.migrate(fixture(),options());
 for(let count=0;count<6;count++){const reloaded=domain.migrate(JSON.parse(JSON.stringify(initial)),options());assert.deepEqual(reloaded,initial)}
});
