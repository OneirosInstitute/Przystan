import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const worldModel=require('../src/p_e4_world.js');

test('E4 world has four times the map area, stable terrain and distinct functional regions',()=>{
 const world=worldModel.create({seed:2207,town:{x:0,z:65}});
 assert.equal(world.size**2,4*192**2);
 assert.deepEqual(world,worldModel.create({seed:2207,town:{x:0,z:65}}));
 assert.ok(world.regions.length>25);
 assert.ok(new Set(world.regions.map(region=>region.biome)).size>=5);
 assert.ok(world.regions.every(region=>region.fertility>=0&&region.fertility<=1&&Number.isFinite(region.ore)));
 assert.notDeepEqual(world.regions,worldModel.create({seed:842,town:{x:0,z:65}}).regions);
 assert.equal(worldModel.sectors(world).length,144);
});

test('E4 core preserves old inhabited land and the landing bay remains open',()=>{
 const samples=[];
 for(let row=0;row<=96;row++)for(let column=0;column<=96;column++)samples.push(Math.hypot(column*2-96,row*2-96)<60?3:-2);
 const world=worldModel.create({seed:22,core:{size:192,step:2,heights:samples},town:{x:0,z:60}});
 assert.equal(worldModel.height(world,10,10),3);
 assert.equal(worldModel.height(world,-32,20),3);
 assert.ok(worldModel.height(world,0,180)<0);
 assert.ok(worldModel.height(world,125,0)>0);
});

test('roads follow land, survive world serialization and do not cut through sea',()=>{
 const world=worldModel.create({seed:2207,town:{x:0,z:50}});
 const route=worldModel.route(world,{x:0,z:0},{x:120,z:0});
 assert.ok(route&&route.length>=120);
 assert.ok(route.points.every(point=>worldModel.height(world,point.x,point.z)>.05));
 assert.deepEqual(route,worldModel.route(JSON.parse(JSON.stringify(world)),{x:0,z:0},{x:120,z:0}));
 assert.equal(worldModel.route(world,{x:0,z:0},{x:190,z:190}),null);
});

test('world rejects invalid imported dimensions and oversized or nonfinite core samples',()=>{
 assert.throws(()=>worldModel.create({seed:NaN,town:{x:0,z:0}}));
 assert.throws(()=>worldModel.create({seed:1,core:{size:192,step:2,heights:[NaN]},town:{x:0,z:0}}));
});
