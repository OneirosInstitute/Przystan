import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.6.0-rc.4: po topieniu Marzanny ludzie nie zostają w wodzie przy brzegu
const stuck=E=>E(`S.people.filter(p=>{const t=tileOf(p.x,p.z);return !walk[t[1]*N+t[0]]&&p.state!=='sleep'}).length`);
test('the Marzanna crowd stands on land and walks back to work afterwards',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("(()=>{S.day=Math.floor(S.day)+T1-.05;cerSet('marzanna')})()");
 E('(()=>{for(let k=0;k<400;k++){step(1/10);cerFrame(1/10)}})()');
 assert.equal(E('cerActive()'),true);assert.equal(stuck(E),0,'nobody stands in the water during the rite');
 E('(()=>{for(let k=0;k<3600;k++){step(1/10);cerFrame(1/10)}})()');
 assert.equal(stuck(E),0);assert.equal(E("S.people.filter(p=>p.blocked&&/zamknięta|Brak drogi/.test(p.blocked.reason||'')).length"),0);
});

test('people saved standing in the water (older versions) walk out after loading',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("(()=>{const c=cerCenter('marzanna');S.people.forEach((p,i)=>{const a=Math.PI*(.2+.6*(i/Math.max(1,S.people.length-1)));p.x=c.x+Math.cos(a)*2.2;p.z=c.z+Math.sin(a)*2.2;p.path=null;p.state='idle'});localStorage.setItem(SAVEKEY,serializeSave());boot(false)})()");
 assert.ok(stuck(E)>5,'the old save really has people in the water');
 E('(()=>{for(let n=0;n<2400;n++)step(1/10)})()');
 assert.equal(stuck(E),0,'everyone walked out');
});
