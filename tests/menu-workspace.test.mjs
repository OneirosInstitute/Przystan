import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
function fixture(){const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();return runtime;}

test('both modes expose the same five primary destinations and preserve pause semantics',()=>{
 const runtime=fixture();
 assert.deepEqual(Array.from(runtime.evaluate('MENU_PRIMARY.map(entry=>entry[0])')),['pulpit','zadania','praca','budowa','dzialy']);
 for(const quiet of [true,false]){
  runtime.evaluate(`czOn=${quiet};setSpeed(2);openSheet('pulpit')`);
  assert.match(runtime.elements.get('body').innerHTML,/Najważniejsze teraz/);
  assert.match(runtime.elements.get('cz-chips').innerHTML,/data-czt="zadania"/);
  assert.equal(runtime.game.S.speed,quiet?0:2);runtime.game.closeSheet();assert.equal(runtime.game.S.speed,2);
 }
});
test('all sections, including save and settings, are reachable through a grouped directory',()=>{
 const runtime=fixture();runtime.game.openSheet('dzialy');
 for(const key of ['ludzie','osada','praca','zapasy','budowa','wiedza','natura','wyprawy','kronika','ustawienia'])assert.match(runtime.elements.get('body').innerHTML,new RegExp('data-menu-go="'+key+'"'));
 runtime.game.openSheet('ustawienia');assert.match(runtime.elements.get('body').innerHTML,/data-kron="now"/);assert.match(runtime.elements.get('body').innerHTML,/data-menu-mode/);
});
test('goals use current act predicates and progress instead of the stale legacy checklist',()=>{
 const runtime=fixture();runtime.evaluate('S.act=1;S.agoals={};S.goals={};S.wreck.parts[2].open=1');
 const goals=runtime.evaluate('taskMilestones()');assert.ok(goals.some(goal=>goal.title.includes('kajutę')&&goal.done));
 runtime.evaluate("taskState().filter='goals';openSheet('zadania')");assert.match(runtime.elements.get('body').innerHTML,/task-milestones/);
});
test('pinning produces an actionable map tracker and survives save/reload',()=>{
 const runtime=fixture();runtime.evaluate("taskState().pinned='campaign';taskTrackerTick(1)");
 assert.equal(runtime.elements.get('task-tracker').hidden,false);assert.match(runtime.elements.get('task-tracker').innerHTML,/data-task-locate="campaign"/);
 runtime.game.save();runtime.game.startGame(false);runtime.evaluate('taskTrackerTick(1)');assert.equal(runtime.game.S.tasksUI.pinned,'campaign');
});
test('production blockers appear as tasks linked to real assigned suppliers and building',()=>{
 const runtime=fixture();runtime.evaluate("S.day=.4;S.wreck.gone=1;S.bld.push({id:501,kind:'kuznia',i:camp.i+2,j:camp.j,prog:12,work:12,cmp:1,cond:1});S.res.ruda=0;S.res.wegiel=3;S.res.narz=0;S.res.gwozdzie=0;S.people[0].job='wb';S.people[0].wb=501");
 const task=runtime.evaluate("taskList().find(task=>task.id==='production:501')");assert.ok(task);assert.equal(task.location.id,501);assert.ok(task.peopleIds.includes(0));assert.match(task.detail,/ruda/i);
 runtime.evaluate('S.res.ruda=10');assert.equal(runtime.evaluate("taskList().some(task=>task.id==='production:501')"),false);
});
test('all new views render in Epoka IV and preserve its existing production and transport controls',()=>{
 const runtime=fixture();runtime.evaluate('ludInit();S.e3={done:1};e4Start()');
 for(const key of ['pulpit','zadania','ludzie','zapasy','dzialy','ustawienia']){runtime.game.openSheet(key);assert.ok(runtime.elements.get('body').innerHTML.length>20,key)}
 runtime.game.openSheet('wyprawy');assert.match(runtime.elements.get('body').innerHTML,/data-e4-ship/);
 runtime.game.openSheet('praca');assert.match(runtime.elements.get('body').innerHTML,/Partie w pracowniach/);
});

test('battery and photo controls never write an invalid simulation speed or break saving',()=>{
 const runtime=fixture();runtime.evaluate('setSpeed(2)');
 for(const key of ['bat','photo']){
  const control={dataset:{[key]:'1'}},event={target:{closest:selector=>selector==='button'||selector===`[data-${key}]`?control:null},preventDefault(){},stopPropagation(){}};
  for(const callback of runtime.elements.get('speed').listeners.click||[])callback(event);
  assert.equal(runtime.game.S.speed,2,key);assert.equal(runtime.game.save(),true,key);
 }
});
