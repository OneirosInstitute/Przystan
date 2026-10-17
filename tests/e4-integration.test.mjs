import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
test('Epoka IV unlocks after III, retains the settlement and saves through the real game decoder',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 assert.equal(runtime.evaluate('e4Start().ok'),false);
 runtime.evaluate('ludInit();S.e3={done:1};');const original=JSON.parse(runtime.evaluate('serializeSave()'));
 assert.equal(runtime.evaluate('e4Start().ok'),true);
 assert.equal(runtime.game.S.epoch,4);assert.equal(runtime.game.S.people.length,original.people.length);
 assert.deepEqual(JSON.parse(JSON.stringify(runtime.game.S.bld)),original.bld);
 assert.equal(runtime.game.save(),true);const saved=runtime.memory.get('przystan-save');
 assert.ok(runtime.evaluate('decodeSave(serializeSave())'));
 runtime.evaluate('E4Economy.advance(S,40,e4Daily)');assert.equal(runtime.game.save(),true);
 runtime.evaluate('boot(false)');assert.equal(runtime.game.S.epoch,4);assert.ok(runtime.game.S.e4.stats.harvests>0);
 runtime.game.openSheet('osada');assert.match(runtime.elements.get('body').innerHTML,/Epoka IV|Rody i folwarki/);
 assert.ok(runtime.evaluate('e4Scene.children.length>0'));
 const before=JSON.stringify(runtime.game.S.res);runtime.evaluate('mapTick(1000)');assert.equal(JSON.stringify(runtime.game.S.res),before,'camera does not generate trade goods');
});

test('all estate buildings have working 3D models and every Epoka IV panel renders',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.evaluate('ludInit();S.e3={done:1};e4Start()');
 runtime.evaluate("E4Domain.createSettlement(S,{id:'preview',name:'Folwark próbny',x:48,z:0,stage:'folwark',specialization:'winiarski',autonomy:false});for(const kind of Object.keys(E4Catalog.buildings))S.e4.settlements.preview.buildings[kind]=1;S.e4.settlements.preview.fields=Object.keys(E4Catalog.crops).map((crop,index)=>({id:100+index,crop,planted:S.day,age:50,progress:3,soil:1,sown:true,harvests:0}));e4Sync();e4Selected='preview'");
 for(const tab of ['osada','budowa','praca','wyprawy','wiedza','natura','kronika']){runtime.game.openSheet(tab);assert.ok(runtime.elements.get('body').innerHTML.length>500,tab);}
 assert.equal(runtime.evaluate('validateSave(JSON.parse(serializeSave()))'),true);
 runtime.game.closeSheet();runtime.game.look(120,-30);runtime.evaluate('mapTick(1)');assert.equal(runtime.game.save(),true);
});

test('migration completes paid legacy work and carts once and preserves the remaining ripe harvest',()=>{
 const runtime=createGame();runtime.game.startGame(true);
 runtime.evaluate("ludInit();S.e3={done:1};Object.assign(S.res,{suchary:10000,ziarno:100,drewno:200,opal:200});S.bld.push({id:91,kind:'kuznia',i:90,j:162,prog:2,work:5,mat:10,del:5,cond:1},{id:92,kind:'warsztat',i:94,j:162,prog:5,work:5,cond:1,wozQ:1,wozP:45},{id:93,kind:'pole',i:100,j:162,prog:5,work:5,cond:1,field:{st:'dojrzale',g:1,fert:.8,left:5,q:1}});S.bid=94;rebuildWorldFromState();");
 const initialCarts=runtime.game.S.wozy||0;
 assert.equal(runtime.evaluate('e4Start().ok'),true);runtime.evaluate("S.e4.settlements.przystan.autonomy=false;S.e4.settlements.przystan.capacity=100000;step(240);boot(false);step(240)");
 assert.equal(runtime.game.S.res.drewno,200,'materials already paid are neither refunded nor debited twice');
 assert.equal(runtime.game.S.bld.find(building=>building.id===91).prog,5);
 assert.equal(runtime.game.S.wozy,initialCarts+1);
 assert.equal(runtime.game.S.e4.settlements.przystan.output.ziarno,5,'only the remaining five portions are harvested');
 assert.equal(runtime.game.save(),true);
});
