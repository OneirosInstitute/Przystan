import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.16: „Wszyscy w las i nad wodę” nie zatrzymuje drewutni przy zerowym opale ani prac przy jedzeniu
test('during the hungry gap the woodshed keeps working while fuel is low, builders go for food, and the card says why',()=>{
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 E(`if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;let at=null;for(let r=3;r<20&&!at;r++)for(let a=0;a<24;a++){const i=Math.round(camp.i+Math.cos(a/24*6.28)*r),j=Math.round(camp.j+Math.sin(a/24*6.28)*r);if(checkPlace('drewutnia',i,j)){at=[i,j];break}}
  window.__b=e2Put('drewutnia',at[0],at[1],{});addBuildingMesh(__b);window.__p=S.people.find(p=>p.age>=18);__p.job='wb';__p.wb=__b.id;window.__q=S.people.find(p=>p.age>=18&&p!==__p);__q.job='rob';racje('zbior');S.res.opal=0`);
 assert.equal(E('racjeKeeps(__p)'),true,'the woodshed worker stays while fuel is at 0');
 assert.equal(E('racjeKeeps(__q)'),false,'a builder goes to look for food');
 E('S.res.opal=500');assert.equal(E('racjeKeeps(__p)'),false,'with plenty of fuel the woodshed worker helps with food too');
 E('S.res.opal=0');assert.match(E('racjeNoteHTML(__b)'),/Przednówek: tu praca idzie dalej, bo opału jest mało.*Wracamy do zwykłych prac/);
 E("__q.job='wb';__q.wb=__b.id;S.res.opal=500");assert.match(E('racjeNoteHTML(__b)'),/pracownicy szukają jedzenia jeszcze \d+ dni/);
 E('__b.proj={t:"lv",prog:0,work:10}');assert.match(E('racjeNoteHTML(__b)'),/budowy stoją jeszcze/);
 const btn={closest:sel=>sel==='[data-racje-end]'?btn:null};for(const l of runtime.documentListeners.click||[]){try{l({target:btn,stopPropagation(){}})}catch(e){}}
 assert.equal(E("racjeOn('zbior')"),false,'the player can end the hungry gap early');
});
test('the hungry gap ends by itself when there is enough food again',()=>{
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 E("racje('zbior');S.res.suchary=5000;gospEat()");assert.equal(E("racjeOn('zbior')"),false);assert.match(E('S.log[0].t'),/Przednówek minął/);
});
