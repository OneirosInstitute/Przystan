import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.2: pięć działów, w każdym widoki; dawne zakładki zostają pod spodem, więc wywołania openSheet działają jak wcześniej
function fixture(){const runtime=createGame();runtime.game.startGame(true);runtime.game.closeSheet();return runtime}
test('five sections cover every former tab and both navigation bars show only them',()=>{
 const g=fixture();
 const r=JSON.parse(g.evaluate(`JSON.stringify({sections:__nv.NV.map(s=>s.k),covered:[...new Set(Object.values(__nv.NV_VIEWS).map(v=>v.t))].sort(),tabs:TABS.map(t=>t[0]).sort(),czOn})`));
 assert.deepEqual(r.sections,['osada','ludzie','budowa','zadania','wiedza']);assert.deepEqual(r.covered,r.tabs);
 for(const quiet of [true,false]){g.evaluate(`czOn=${quiet};openSheet('budowa')`);
  const bar=g.elements.get(quiet?'cz-chips':'tabbar').innerHTML;assert.equal((bar.match(/data-nvs=/g)||[]).length,5,quiet?'cicha':'pełne');g.game.closeSheet()}
});
test('views split the settlement and chronicle tabs without hiding content from older callers',()=>{
 const g=fixture();const body=()=>g.elements.get('body');
 g.evaluate(`openSheet('osada')`);assert.equal(g.evaluate('__nv.view'),'przeglad');assert.equal(body().dataset.nv,'przeglad');assert.match(body().innerHTML,/Rodziny/);
 g.evaluate(`__nv.nvGo('mieszkancy')`);assert.equal(g.evaluate('tab'),'osada');assert.equal(body().dataset.nv,'mieszkancy');
 g.evaluate(`__nv.nvGo('opcje')`);assert.equal(g.evaluate('tab'),'kronika');assert.equal(body().dataset.nv,'opcje');assert.match(body().innerHTML,/data-czui/);
 g.evaluate(`__nv.nvGo('wyprawy')`);assert.equal(g.evaluate('tab'),'wyprawy');assert.equal(body().dataset.nv,'');
 // kod, który otwiera zakładkę bez wskazania widoku, trafia w pierwszy widok z tą zakładką
 g.evaluate(`closeSheet();openSheet('osada')`);assert.equal(g.evaluate('__nv.view'),'przeglad');
 g.evaluate(`openSheet('kronika')`);assert.equal(g.evaluate('__nv.view'),'kronika');
});
test('building search finds by name and category and "build now" lists only affordable buildings',()=>{
 const g=fixture();
 const r=JSON.parse(g.evaluate(`(()=>{openSheet('budowa');__nv.q='chata';const chata=__nv.nvKeys();__nv.q='pola';const pola=__nv.nvKeys();__nv.q='żółw';const none=__nv.nvKeys(),empty=nvEmpty();__nv.q='';
  S.res.drewno=0;S.res.deski=0;S.res.kamien=0;buildCat='teraz';const now=__nv.nvKeys();const ok=now.every(k=>bAvail(k)&&canAfford(BD[k].cost));S.res.drewno=500;const more=__nv.nvKeys().length;
  $('body')._h=null;renderPanel();return JSON.stringify({chata,pola,none,empty,ok,now:now.length,more,html:$('body').innerHTML.includes('data-build-card')})})()`));
 assert.ok(r.chata.includes('zbieracz')&&r.chata.includes('drwal'));assert.ok(BDname(r.chata[0]).startsWith('Chata'));
 assert.ok(r.pola.includes('pole'));assert.deepEqual(r.none,[]);assert.match(r.empty,/Nic nie pasuje/);
 assert.equal(r.ok,true);assert.ok(r.more>r.now);assert.equal(r.html,true);
 function BDname(k){return g.evaluate(`BD['${k}'].n`)}
});
