import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.8.0-rc.3: życie osadników działa także w epoce IV (rody i folwarki)
function epoch4(){const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('ludInit();S.e3={done:1};e4Start()');assert.equal(E('S.epoch'),4);E('closeSheet()');return {runtime,E}}

test('in epoch IV people keep their character, get a day record, mood and memories from the life of the clans',()=>{
 const {E}=epoch4();
 E('(()=>{for(let n=0;n<DAY*4*4;n++)step(1/4)})()');
 assert.equal(E('S.people.every(p=>Array.isArray(p.us)&&p.lub&&Number.isFinite(p.mood)&&Math.abs(p.mood)<=1)'),true);
 assert.ok(E("S.people.filter(p=>p.dzn&&Object.keys(p.dzn.w||{}).length).length")>0||E("S.people.filter(p=>p.dznY&&Object.keys(p.dznY.w||{}).length).length")>0,'work of the clans becomes the day record');
 assert.ok(E('Array.isArray(S.e4Alive)&&S.e4Alive.length===S.people.length'));
 assert.equal(E('E4Domain.validate(S)'),true);assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});

test('evenings, nights and small scenes run on the clock of the clans',()=>{
 const {E}=epoch4();E('S.wArch=[];S.scCd={};S.scN=0');
 E('(()=>{for(let n=0;n<DAY*4*4;n++)step(1/4)})()');
 const arch=JSON.parse(E('JSON.stringify(S.wArch||[])'));assert.ok(arch.length>=2,'evenings are kept');assert.ok(arch.some(o=>(o.L||[]).length>=2),'people talk by the fire');
 assert.ok(arch.some(o=>/Przystani|domu rodowym|dworze|Przy ogniu/.test(o.h||'')||o.n));
 assert.ok(E('Object.keys(S.scCd||{}).length')>=1,'small scenes happen');assert.ok(E("S.e4.events.some(e=>e.type==='scena')"),'scenes are written into the chronicle of the clans');
});

test('a death among the clans is remembered by the family, and mood changes the work of the clans',()=>{
 const {E}=epoch4();E('(()=>{for(let n=0;n<DAY*4;n++)step(1/4)})()');
 const r=JSON.parse(E(`(()=>{const p=S.people.find(q=>q.age>=30&&S.people.some(o=>o!==q&&o.fam===q.fam));const kin=S.people.filter(o=>o!==p&&o.fam===p.fam).map(o=>o.id);const n=p.name;E4Domain.remove?E4Domain.remove(S,p.id,'test'):null;
   if(S.people.includes(p)){S.e4.archive[p.id]={id:p.id,name:p.name,sex:p.sex,fam:p.fam,par:(p.par||[]).slice(),generation:p.generation||1};S.people=S.people.filter(o=>o!==p)}
   duszaE4Daily();return JSON.stringify({n,ok:kin.every(id=>(S.people.find(o=>o.id===id).mem||[]).some(m=>m[1]==='smierc'&&m[2]===n))})})()`));
 assert.equal(r.ok,true);
 const f=JSON.parse(E(`(()=>{const L=E4Domain.residents(S,'przystan').filter(p=>p.age>=18&&p.hp>.5);const p=L[0];const day=Math.floor(S.day);p.e4AttendanceDay=day-1;p.e4Credits={t:420000};p.e4UsedCredits={};p.e4HoursLeft=8;
   const go=m=>{p.mood=m;p.e4HoursLeft=8;p.e4UsedCredits={};return E4Economy.recordedLabor(S,[p],100,'ciesla','test','t')};return JSON.stringify([go(0),go(1),go(-1)])})()`));
 assert.ok(f[1]>f[0]&&f[2]<f[0],'a good mood helps, a bad one slows: '+f.join(' '));
});

test('an evening of their own: visits and favourite places come from the clans life',()=>{
 const {E}=epoch4();
 const r=JSON.parse(E(`(()=>{const out=new Set();for(let d=0;d<30;d++)for(const p of S.people.filter(q=>q.age>=16)){soulOf(p);const o=e4Evening(S,p,Math.floor(S.day)+d+.75);if(o){out.add(o.text);if(!Number.isFinite(o.target.x)||!Number.isFinite(o.target.z))return JSON.stringify({bad:o})}}return JSON.stringify([...out])})()`));
 assert.ok(Array.isArray(r)&&r.length>=2,'several kinds of evenings: '+JSON.stringify(r));
 assert.ok(r.every(t=>!/undefined|null|\[|\|/.test(t)));
});
