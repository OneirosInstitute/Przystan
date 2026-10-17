import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
const key='przystan-v7';
function fixture(){const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();runtime.evaluate(`ludInit();const region=REGIONS.find(region=>region&&region.id!==0);S.hamlets=[{id:77,rid:region.id,i:region.i,j:region.j,name:'Lubomirowice',head:'Lubomir',rod:1,pop:5,st:1,day:S.day,zap:.5,wiez:.5,road:1,need:{k:'odziez',q:2,until:S.day+5}}];S.res.odziez=92;reveal(region.i,region.j,4);kolInit()`);return runtime;}

test('a hamlet request exposes its exact cost, actionable help and map location in Tasks',()=>{
 const runtime=fixture();const task=runtime.evaluate("taskList().find(task=>task.id==='ham:77')");
 assert.match(task.title,/Lubomirowice/);assert.match(task.detail,/92/);assert.match(task.detail,/2/);
 assert.equal(task.status,'Gotowe do pomocy');assert.equal(task.location.type,'hamlet');
 runtime.evaluate("taskOpen('ham:77')");const markup=runtime.elements.get('body').innerHTML;
 assert.match(markup,/Wyślij 2/);assert.match(markup,/data-task-help="77"/);assert.match(markup,/Pokaż na mapie/);
 assert.ok(runtime.evaluate("CZ_TABS.some(item=>item[0]==='zadania')"));
});

test('help spends only requested goods and cannot pay twice; completion survives restart',()=>{
 const runtime=fixture();assert.equal(runtime.evaluate('answerHamletNeed(77).ok'),true);
 assert.equal(runtime.game.S.res.odziez,90);assert.equal(runtime.game.S.hamlets[0].need,null);
 assert.equal(runtime.evaluate('answerHamletNeed(77).ok'),false);assert.equal(runtime.game.S.res.odziez,90);
 assert.equal(runtime.evaluate("taskList().some(task=>task.id==='ham:77')"),false);
 assert.ok(runtime.evaluate("S.tasksUI.history.some(entry=>entry.title.includes('Lubomirowice'))"));
 const restarted=createGame({storage:{[key]:runtime.memory.get(key)}});restarted.game.startGame(false);
 assert.equal(restarted.game.S.res.odziez,90);assert.equal(restarted.game.S.hamlets[0].need,null);
 assert.ok(restarted.game.S.tasksUI.history.length);
});

test('insufficient stock has an explicit reason and preserves the request and inventory',()=>{
 const runtime=fixture();runtime.game.S.res.odziez=1;
 assert.equal(runtime.evaluate('answerHamletNeed(77).ok'),false);
 assert.equal(runtime.game.S.res.odziez,1);assert.ok(runtime.game.S.hamlets[0].need);
 const task=runtime.evaluate("taskList().find(task=>task.id==='ham:77')");assert.match(task.status,/Brakuje/);
 runtime.evaluate("taskOpen('ham:77')");assert.match(runtime.elements.get('body').innerHTML,/Jak zdobyć/);
});

test('help guidance opens the missing knowledge instead of an unavailable building',()=>{
 const runtime=fixture();runtime.game.S.hamlets[0].need={k:'ziarno',q:6,until:runtime.game.S.day+5};runtime.game.S.res.ziarno=0;runtime.game.S.know.pole='nie';
 assert.equal(runtime.evaluate("bAvail('pole')"),false);
 runtime.evaluate("taskGo('ham:77')");assert.equal(runtime.evaluate('tab'),'wiedza');
 assert.match(runtime.elements.get('toast').textContent,/Najpierw|wiedz/i);
});

test('dismissed request marker stays hidden after reload, while a new need is visible',()=>{
 const runtime=fixture();assert.ok(runtime.evaluate('czTargets().some(target=>target.ham===77)'));
 runtime.evaluate('taskDismissNeed(77)');assert.equal(runtime.evaluate('czTargets().some(target=>target.ham===77)'),false);
 assert.ok(runtime.evaluate("taskList().some(task=>task.id==='ham:77')"));
 const restarted=createGame({storage:{[key]:runtime.memory.get(key)}});restarted.game.startGame(false);
 assert.equal(restarted.evaluate('taskNeedHidden(S.hamlets[0])'),true);
 restarted.game.S.hamlets[0].need={k:'opal',q:10,until:restarted.game.S.day+6};
 assert.equal(restarted.evaluate('taskNeedHidden(S.hamlets[0])'),false);
});

test('tracking resolves live builders, activity and current coordinates rather than stale assignments',()=>{
 const runtime=fixture();runtime.evaluate(`const building={id:900,kind:'chata',i:90,j:160,prog:3,work:12,cmp:0,ext:[]};S.bld.push(building);const worker=S.people[0];worker.tgt=building;worker.state='work';worker.workKind='build';worker.act='buduje chatę';worker.x=12;worker.z=70`);
 const task=runtime.evaluate("taskList().find(task=>task.id==='building:900')");assert.equal(task.progress,25);assert.ok(task.peopleIds.includes(0));
 runtime.evaluate("taskOpen('building:900')");assert.match(runtime.elements.get('body').innerHTML,/Bożydar/);assert.match(runtime.elements.get('body').innerHTML,/buduje chatę/);
 runtime.evaluate('taskLocatePerson(0)');assert.equal(runtime.evaluate('selId'),0);assert.equal(runtime.evaluate('camT.x'),12);assert.equal(runtime.evaluate('camT.z'),70);
 runtime.evaluate("release(S.people[0]);S.people[0].state='idle'");assert.equal(runtime.evaluate("taskList().find(task=>task.id==='building:900').peopleIds.includes(0)"),false);
});

test('expedition and reading tasks name actual workers and navigate to their relevant area',()=>{
 const runtime=fixture();runtime.evaluate(`S.exps=[{id:42,r:S.hamlets[0].rid,type:'zwiad',days:4,left:3,ppl:[S.people[0].id],exit:[camp.i,camp.j+1],risk:0}];S.people[0].exp=42;S.people[0].job='wyp';S.people[0].state='away';S.books.kowal=1;S.readP.kowal=50;S.people[1].job='czyt';S.people[1].book='kowal'`);
 const expedition=runtime.evaluate("taskList().find(task=>task.id==='exp:42')"),reading=runtime.evaluate("taskList().find(task=>task.id==='book:kowal')");
 assert.deepEqual(Array.from(expedition.peopleIds),[0]);assert.equal(expedition.progress,25);
 assert.ok(reading.peopleIds.includes(1));assert.equal(reading.progress,25);
 runtime.evaluate("taskLocate('exp:42')");assert.equal(runtime.elements.get('sheet').hidden,true);
});

test('ordinary requests can be fulfilled from Tasks and retain a single completion record',()=>{
 const runtime=fixture();runtime.evaluate("S.reqs=[{k:'slodkie',pid:S.people[0].id,made:S.day,until:S.day+5}];S.reqNext=S.day+100;S.res.miod=4");
 assert.equal(runtime.evaluate("taskList().find(task=>task.id==='request:0:slodkie').requestReady"),true);
 runtime.game.reqTick();runtime.game.reqTick();
 assert.equal(runtime.game.S.res.miod,0);assert.equal(runtime.game.S.reqs.length,0);
 assert.equal(runtime.game.S.tasksUI.history.filter(entry=>entry.id==='request:0:slodkie').length,1);
});

test('Epoka IV projects, batches and transports appear in Tasks using actual crew and route positions',()=>{
 const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();runtime.evaluate('ludInit();S.e3={done:1};e4Start()');
 runtime.evaluate("S.e4.settlements.przystan.projects.push({kind:'magazyn',work:24,progress:6,materials:{},started:S.day});S.e4.settlements.przystan.batches.push({id:999,recipe:'deski',materials:{drewno:3},progress:1,work:4,readyAt:null,started:S.day});taskState().pinned='batch:999'");
 const shipment=runtime.evaluate("(()=>{const town=S.e4.settlements.przystan;E4Domain.createSettlement(S,{id:'sasiad',name:'Sąsiedzi',x:town.x+4,z:town.z-4,autonomy:false});S.res.suchary=3000;S.res.deski=20;return E4Economy.ship(S,{from:'przystan',to:'sasiad',items:{deski:2}})})()");
 assert.equal(shipment.ok,true);
 const tasks=runtime.evaluate('taskList()');assert.ok(tasks.some(task=>task.id==='batch:999'));
 assert.equal(tasks.find(task=>task.id.startsWith('project:przystan:magazyn')).progress,25);
 const transport=runtime.game.S.e4.transports[0],tracked=tasks.find(task=>task.id==='transport:'+transport.id);
 assert.deepEqual(Array.from(tracked.peopleIds),Array.from(transport.peopleIds));
 runtime.evaluate('E4Economy.advance(S,.1)');
 const moved=runtime.evaluate("taskList().find(task=>task.id==='transport:'+S.e4.transports[0].id)");
 assert.ok(Math.hypot(moved.location.x-tracked.location.x,moved.location.z-tracked.location.z)>0);
 runtime.game.openSheet('zadania');assert.match(runtime.elements.get('body').innerHTML,/śledzone/);
 assert.equal(runtime.game.save(),true);
 runtime.game.startGame(false);runtime.game.openSheet('zadania');assert.equal(runtime.game.S.tasksUI.pinned,'batch:999');
});
