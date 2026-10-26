import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.6: po wybraniu osoby ze znakiem nad głową karta mówi, o co chodzi i co zrobić
test('a person with a request shows what they ask for, what to do and how long is left',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("(()=>{const p=S.people.find(q=>q.age>=16);S.reqs=[{k:'pomost',pid:p.id,made:Math.floor(S.day),until:Math.floor(S.day)+12}];window.__p=p})()");
 const h=E('__sprawa.sprawaHTML(__p)');
 assert.match(h,/Prośba: .* chce łowić ryby z pomostu/);
 assert.match(h,/Co zrobić:<\/b> Postaw pomost rybacki/);
 assert.match(h,/Zostało 12 dni/);
 assert.match(h,/data-sprawy/,'a button leads to the list of all needs');
 assert.match(E('ludCard(__p)'),/class="card sprawa"/,'the person card starts with the description');
});
test('a person with nothing to say gets no extra card',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("S.reqs=[];S.spr&&(S.spr.a=[])");
 const h=E("(()=>{const p=S.people.find(q=>q.age>=16);return __sprawa.sprawaHTML(p)})()");
 assert.equal(typeof h,'string');assert.doesNotMatch(h,/Prośba:/);
});
test('Polish plurals agree with the number',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);
 assert.equal(E("[1,2,5,12,22,25,104,111].map(n=>n+' '+plW(n,'osoba','osoby','osób')).join(', ')"),'1 osoba, 2 osoby, 5 osób, 12 osób, 22 osoby, 25 osób, 104 osoby, 111 osób');
 assert.equal(E("[1,3,5,21].map(n=>n+' '+latW(n)).join(', ')"),'1 rok, 3 lata, 5 lat, 21 lat');
});
