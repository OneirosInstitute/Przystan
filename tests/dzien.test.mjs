import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.21: jedno okno na koniec dnia (1–5 rzeczy), jedno rano tylko wtedy, gdy w nocy coś się stało; sny rzadko
function village(){const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("closeSheet();S.evT=1e9;if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;openEvent=function(){}");return{runtime,E}}
const EVENING=`(()=>{rdClose();rdPages=[];S.czTalkD=-1;S.day=Math.floor(S.day)+T1;wTick();return JSON.stringify(rdPages)})()`;
const MORNING=`(()=>{rdClose();rdPages=[];S.ranoD=-1;S.day=Math.floor(S.day)+1+T0+.01;wTick();return JSON.stringify(rdPages)})()`;

test('the end of the day is one window with one to five things, the important ones first',()=>{
 const {E}=village();
 for(let i=0;i<12;i++){const P=JSON.parse(E(EVENING));assert.ok(P.length<=1,'one window');if(!P.length)continue;
  assert.equal(P[0].h,'Wieczór');assert.ok(P[0].items.length>=1&&P[0].items.length<=5,String(P[0].items.length));E('S.day+=1')}
 // dzień pełen wydarzeń: najpierw ważne rzeczy, razem nie więcej niż 5
 const items=JSON.parse(E(`JSON.stringify(__dzien.dzItems([['a','A'],['b','B'],['c','C']],['Urodziło się dziecko.','Wesele.','Wyprawa wróciła.','Nowy dom.'],['scena 1','scena 2']))`));
 assert.equal(items.length,5);assert.deepEqual(items.slice(0,3).map(x=>x.n),['Urodziło się dziecko.','Wesele.','Wyprawa wróciła.']);
 // zwyczajny dzień: krótko
 const calm=JSON.parse(E(`JSON.stringify(__dzien.dzItems([['a','A'],['b','B']],[],['scena 1','scena 2','scena 3']))`));
 assert.ok(calm.length<=3,'an ordinary day is short: '+calm.length);
});

test('in the morning a window shows only when something happened at night or someone tells a dream',()=>{
 const {E}=village();E('window.__r=Math.random;Math.random=()=>.99');
 E('S.sen=null;S.senLast=Math.floor(S.day)+1');E(EVENING);
 const P=JSON.parse(E(MORNING));assert.equal(P.length,0,'a quiet night: no window');
 E(EVENING);E("log('Wilki w nocy zagryzły kozę w zagrodzie.')");const W=JSON.parse(E(MORNING));E('Math.random=__r');
 assert.equal(W.length,1);assert.equal(W[0].h,'Ranek');assert.ok(W[0].items.some(x=>/Wilki w nocy/.test(x.n)));
});

test('prophetic dreams are rare: at most one in eight nights',()=>{
 const {E}=village();
 const days=JSON.parse(E(`(()=>{const out=[];for(let i=0;i<80;i++){S.day=Math.floor(S.day)+1;nocLine();if(S.senLast===Math.floor(S.day))out.push(Math.floor(S.day));S.sen=null}return JSON.stringify(out)})()`));
 assert.ok(days.length<=10,'dreams: '+days.length);for(let i=1;i<days.length;i++)assert.ok(days[i]-days[i-1]>=8,days.join(','));
});

test('a card in the old format still opens and closes with one tap',()=>{
 const {E}=village();E("setSpeed(2);rdPages=[{h:'Wieczór',L:['a',['słowa','Wiesia']]}];rdStart()");
 assert.equal(E('__rd.open'),true);assert.match(E("document.getElementById('rdCard').innerHTML"),/słowa/);
 E('__rd.rdClose()');assert.equal(E('__rd.open'),false);
});
