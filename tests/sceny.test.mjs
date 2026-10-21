import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.8.0-rc.2: małe sceny z życia, wierzenia i nowe wydarzenia
function village(){const runtime=createGame();const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);
 E("S.epoch=2;S.path='dom';e2Init();closeSheet();S.evT=1e9");return {runtime,E}}

test('small scenes happen about once a day, vary and leave memories',()=>{
 const {E}=village();E("S.log=[];openEvent=function(){}");
 E('(()=>{for(let n=0;n<DAY*20*4;n++)step(1/4)})()');
 const keys=JSON.parse(E("JSON.stringify(Object.keys(S.scCd||{}))"));
 assert.ok(keys.length>=10,'many different scenes in 20 days: '+keys.length);
 const n=E("S.log.filter(l=>__sceny.SCENY.some(T=>(S.scCd[T.k]||0)>0)).length");assert.ok(n>0);
 assert.ok(E("S.people.some(p=>(p.mem||[]).some(m=>['radosc','zjawa','zalot','klotnia','zgoda','dar','wstyd'].includes(m[1])))"),'scenes are remembered');
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});

test('every scene and every new event works for women and men and leaves no unfilled words',()=>{
 const {E}=village();E("openEvent=function(){}");
 const bad=JSON.parse(E(`(()=>{const bad=[];for(const sex of ['k','m']){S.people.forEach(p=>{if(p.age>=16&&Math.random()<.5)p.sex=sex});
   for(const T of __sceny.SCENY){let A=null,B=null,t=null;try{A=T.A();if(A&&T.B)B=T.B(A);if(A&&(!T.B||B))t=T.f(A,B)}catch(e){bad.push(T.k+' błąd: '+e.message)}
    if(t&&/[\\[\\]<>{}|]|undefined|null|NaN/.test(t))bad.push(T.k+': '+t)}
   for(const ev of EVENTS.filter(e=>e.id.startsWith('s_'))){let c=null;try{c=ev.ctx?ev.ctx():{}}catch(e){bad.push(ev.id+' ctx: '+e.message)}if(!c)continue;
    let t='';try{t=ev.text(c)}catch(e){bad.push(ev.id+' text: '+e.message)}if(/[\\[\\]<>{}|]|undefined|NaN/.test(t))bad.push(ev.id+': '+t);
    for(const o of ev.opts){try{const r=o.f(c);if(typeof r!=='string'||/[\\[\\]<>{}|]|undefined|NaN/.test(r))bad.push(ev.id+' '+o.n+': '+r)}catch(e){bad.push(ev.id+' '+o.n+' błąd: '+e.message)}}}}
  return JSON.stringify(bad)})()`));
 assert.deepEqual(bad,[]);
 assert.equal(E('validateSave(JSON.parse(serializeSave()))'),true);
});

test('a warning dream that was heeded saves the stores, a mocked one costs them',()=>{
 const left={};for(const ok of [1,0]){const {E}=village();
  left[ok]=E(`(()=>{S.res.ryby=100;S.senWarn={k:'storm',until:S.day+3,ok:${ok}};S.weather.k='storm';newDay();return S.res.ryby})()`);
  assert.equal(E('S.senWarn'),null);assert.equal(E("S.log.some(l=>l.t.startsWith('Sen się sprawdził'))"),true);}
 assert.ok(left[0]<left[1]*.9,'the stores suffer when nobody listened: '+left[0]+' vs '+left[1]);
});

test('events of one kind make room for other kinds',()=>{
 const {E}=village();E("window.__op=[];openEvent=function(ev){window.__op.push(ev.cat||ev.id)};S.evT=0");
 const seq=JSON.parse(E(`(()=>{for(let i=0;i<40;i++){S.evT=0;S.evCd={};storyTick()}return JSON.stringify(window.__op)})()`));
 assert.ok(seq.length>=30);let same=0;for(let i=1;i<seq.length;i++)if(seq[i]===seq[i-1])same++;
 assert.ok(same<=seq.length*.3,'kinds change: '+same+' repeats in '+seq.length);
});
