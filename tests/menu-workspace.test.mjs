import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
function fixture(){const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();return runtime;}

test('classic navigation retains the original sections and adds Tasks in both modes',()=>{
 const runtime=fixture(),expected=['osada','praca','budowa','zadania','wyprawy','wiedza','natura','kronika'];
 assert.deepEqual(Array.from(runtime.evaluate('CZ_TABS.map(entry=>entry[0])')),expected);
 assert.deepEqual(Array.from(runtime.evaluate('TABS.map(entry=>entry[0])')).sort(),expected.slice().sort());
 for(const quiet of [true,false]){
  runtime.evaluate(`czOn=${quiet};setSpeed(2);openSheet('osada')`);
  assert.match(runtime.elements.get('body').innerHTML,/Rodziny/);
  assert.doesNotMatch(runtime.elements.get('body').innerHTML,/menu-directory|menu-hero|menu-section/);
  assert.equal(runtime.game.S.speed,quiet?0:2);runtime.game.closeSheet();assert.equal(runtime.game.S.speed,2);
 }
});
test('classic Chronicle retains save and mode controls',()=>{
 const runtime=fixture();runtime.game.openSheet('kronika');
 assert.match(runtime.elements.get('body').innerHTML,/data-kron="now"/);assert.match(runtime.elements.get('body').innerHTML,/data-czui/);
 runtime.evaluate('setSpeed(2);menuSetMode(false)');assert.equal(runtime.game.S.speed,2);
 runtime.evaluate('menuSetMode(true)');assert.equal(runtime.game.S.speed,0);runtime.game.closeSheet();assert.equal(runtime.game.S.speed,2);
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
test('classic views render in Epoka IV and preserve production and transport controls',()=>{
 const runtime=fixture();runtime.evaluate("ludInit();S.e3={done:1};openSheet('zadania')");assert.equal(runtime.elements.get('sheet').children.find(element=>element.dataset.e4Begin)?.hidden,false);runtime.evaluate('e4Start()');
 for(const key of ['osada','zadania','praca','budowa','wyprawy','wiedza','natura','kronika']){runtime.game.openSheet(key);assert.ok(runtime.elements.get('body').innerHTML.length>20,key)}
 runtime.game.openSheet('wyprawy');assert.match(runtime.elements.get('body').innerHTML,/data-e4-ship/);
 runtime.game.openSheet('praca');assert.match(runtime.elements.get('body').innerHTML,/Partie w pracowniach/);
 runtime.game.openSheet('osada');runtime.game.openSheet('zadania');runtime.game.openSheet('osada');assert.match(runtime.elements.get('body').innerHTML,/Wspólna polityka/);assert.doesNotMatch(runtime.elements.get('body').innerHTML,/data-task-filter/);runtime.game.openSheet('kronika');assert.match(runtime.elements.get('body').innerHTML,/data-czui/);
});
test('battery and photo controls never write an invalid simulation speed or break saving',()=>{
 const runtime=fixture();runtime.evaluate('setSpeed(2)');
 for(const key of ['bat','photo']){
  const control={dataset:{[key]:'1'}},event={target:{closest:selector=>selector==='button'||selector===`[data-${key}]`?control:null},preventDefault(){},stopPropagation(){}};
  for(const callback of runtime.elements.get('speed').listeners.click||[])callback(event);
  assert.equal(runtime.game.S.speed,2,key);assert.equal(runtime.game.save(),true,key);
 }
});
