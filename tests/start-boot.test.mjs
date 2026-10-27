import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.15: start gry bez przebicia starego menu i bez dodatkowych ekranów
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');

test('before the game script runs, the page shows a loading screen in place of the new start screen, never the old menu',()=>{
 const intro=html.indexOf('<div id="intro">'),boot=html.indexOf('class="st-boot"',intro),box=html.indexOf('<div class="box">',intro);
 assert.ok(intro>0&&boot>intro&&box>boot,'the loading screen comes first inside the start overlay');
 const css=html.slice(0,html.indexOf('<div id="app">'));
 assert.match(css,/#intro:not\(\.st2\) \.box\{display:none\}/,'the old menu is hidden by the stylesheet in the page head, before any script');
 assert.match(css,/#intro \.st-boot\{position:absolute;inset:0/,'the loading screen covers the start overlay from the first paint');
 assert.ok(html.indexOf('<meta name="viewport"')<html.indexOf('<style'),'the mobile viewport is set before the first style');
 const bootHtml=html.slice(html.indexOf('class="st-boot"'),html.indexOf('<div class="box">'));
 assert.match(bootHtml,/<svg class="st-boot-emb"/,'the real emblem, drawn at build time by the same function as on the start screen');
 assert.doesNotMatch(bootHtml,/id="stPaper"/,'its filter id does not clash with the start screen emblem');
});

test('the start screen replaces the loading screen and keeps the title where it was',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);
 assert.equal(E("$('intro').classList.contains('st2')"),true);
 const start=fs.readFileSync(new URL('../src/p_start.js',import.meta.url),'utf8');
 assert.match(start,/const boot=intro\.querySelector\('\.st-boot'\);if\(boot\)boot\.remove\(\)/);
 assert.doesNotMatch(start,/\.st-title,\.st-sub\{animation/,'the title does not vanish and slide in a second time');
});

test('tapping the start button answers at once and the heavy world build waits for the next frame',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);
 E("window.__started=0;{const _sg=startGame;startGame=function(f){__started++;return _sg(f)}}");
 const go=runtime.elements.get('go');const label=go.textContent;
 for(const listener of go.listeners.click||[])listener({});
 assert.equal(E('__started'),0,'the game does not start inside the tap');
 assert.equal(go.disabled,true);assert.match(go.textContent,/Schodzimy na brzeg|Wracamy do osady/);
 for(const listener of go.listeners.click||[])listener({});
 runtime.runFrame();runtime.advanceTime(300,{timeouts:true});
 assert.equal(E('__started'),1,'one start, even after a double tap');
 assert.equal(go.disabled,false);assert.equal(go.textContent,label,'the button is ready again if the player comes back to the menu');
});

test('the first night decision comes at the first dusk and closes after the choice without a second card',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;S.custQ=[];S.cust={};S.day=.3;window.__t=[];{const _t=toast;toast=(m,ms)=>{__t.push([m,ms]);return _t(m,ms)}}");
 E('custTick()');assert.equal(E('!!evOpen'),false,'no decision right after landing on the shore');
 E('S.day=.71;custTick()');assert.equal(E("evOpen&&evOpen.ev.t"),'Pierwsza noc przy ognisku');
 const button={dataset:{o:'0'},closest:()=>button};
 for(const listener of runtime.elements.get('ev').listeners.click||[])listener({target:{closest:()=>button}});
 assert.equal(E('!!evOpen'),false,'no result card with a "Dalej" button');assert.equal(E("$('ev').hidden"),true);
 assert.equal(E('S.cust.umowa'),'u_wspolne');assert.equal(E('S.pendingDecision'),null);
 const shown=JSON.parse(E('JSON.stringify(__t)'));assert.ok(shown.some(([m,ms])=>/Postanowiono/.test(m)&&ms>=6000),'the outcome stays on screen long enough to read');
 assert.ok(E("S.log.some(l=>/Pierwsza noc przy ognisku/.test(l.t))"),'and goes to the chronicle');
});

test('the first night decision waits while an evening story is open',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;S.custQ=[];S.cust={};S.day=.75;rdPages=[{h:'Wieczór',L:['a']}];rdStart()");
 E('custTick()');assert.equal(E('!!evOpen'),false,'no card on top of the story');
 E('rdClose();custTick()');assert.equal(E('evOpen&&evOpen.ev.t'),'Pierwsza noc przy ognisku');
});

test('after an update reload during play the game goes straight back to the village; from the start screen it does not',()=>{
 const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
 const store=new Map();runtime.sandbox.sessionStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 let reloaded=0;runtime.sandbox.location.reload=()=>reloaded++;
 E("S.res.drewno=61.5;updatePending=true");assert.equal(E('gameApplyUpdate()'),true);assert.equal(reloaded,1);
 assert.equal(store.get('przystan-resume'),'1','the page remembers that the player was in the village');
 // nowa strona: ekran startowy widoczny, gra wraca sama
 E("$('intro').style.display='';S=null");assert.equal(E('gameResumeAfterUpdate()'),true);
 assert.equal(E("$('intro').style.display"),'none');assert.equal(E('S.res.drewno'),61.5);assert.equal(store.has('przystan-resume'),false,'only once');
 assert.equal(E('gameResumeAfterUpdate()'),false,'a normal reload shows the start screen');
 // aktualizacja na ekranie startowym nie zaczyna gry sama
 const menu=createGame();const M=s=>menu.evaluate(s);const st=new Map();menu.sandbox.sessionStorage={getItem:k=>st.get(k)??null,setItem:(k,v)=>st.set(k,String(v)),removeItem:k=>st.delete(k)};
 menu.sandbox.location.reload=()=>{};M('updatePending=true;gameApplyUpdate()');assert.equal(st.has('przystan-resume'),false);
});

test('coming back to a saved village shows one summary card that closes with one tap, and none after an update reload',()=>{
 const run=(viaUpdate)=>{const runtime=createGame();const E=s=>runtime.evaluate(s);runtime.game.startGame(true);E('closeSheet()');
  E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null;S.cust.umowa='u_wspolne';S.custQ=[];S.sess={d0:S.day,lt:Date.now()-5*36e5};S.day+=3;save()");
  const store=new Map([['przystan-resume','1']]);runtime.sandbox.sessionStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
  E("S=null;$('intro').style.display=''");if(viaUpdate)E('gameResumeAfterUpdate()');else E('startGame(false)');
  const tap=ds=>{const b={dataset:ds,closest:()=>b};for(const l of runtime.elements.get('ev').listeners.click||[])l({target:{closest:()=>b}})};
  let card=null;for(let k=0;k<80;k++){runtime.advanceTime(250,{timeouts:true});runtime.runFrame();const ey=E("evOpen&&evOpen.ev.ey");
   if(ey==='Od ostatniego razu'){card=ey;break}if(ey){tap(E("evOpen.phase")==='result'?{close:'1'}:{o:'0'})}}
  let after=null;
  if(card){const b={dataset:{o:'0'},closest:()=>b};for(const l of runtime.elements.get('ev').listeners.click||[])l({target:{closest:()=>b}});after=E('!!evOpen')}
  return {card,after}};
 const normal=run(false);assert.equal(normal.card,'Od ostatniego razu');assert.equal(normal.after,false,'"Wracam do osady" closes it, no "Dalej" card');
 const update=run(true);assert.equal(update.card,null,'after an update reload the player goes straight on');
});
