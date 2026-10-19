import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame } from './runtime.mjs';

test('save/load conserves a carried resource', () => {
  const runtime = createGame();
  runtime.evaluate("S=freshState();S.people[0].carry=[{res:'drewno',q:6}];save();S=load()");
  assert.equal(runtime.game.S.res.drewno + (runtime.game.S.people[0].carry?.[0]?.q || 0), 28);
});

test('storage failure is returned and visible; export still contains live state', () => {
  const runtime = createGame();
  runtime.evaluate('S=freshState();save();S.res.drewno=31');
  runtime.sandbox.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.equal(runtime.evaluate('save()'), false);
  assert.equal(JSON.parse(runtime.memory.get('przystan-v7')).res.drewno, 22);
  assert.match(runtime.elements.get('toast').textContent, /zapis|pamię/i);
  assert.equal(JSON.parse(runtime.evaluate('serializeSave()')).res.drewno, 31);
});

test('invalid imported state is rejected without touching existing storage', () => {
  const runtime = createGame();
  runtime.evaluate('S=freshState();save()');
  const good = runtime.memory.get('przystan-v7');
  const changes = [
    state => { delete state.fams; },
    state => { state.day = 'invalid'; },
    state => { state.res.suchary = -100; },
    state => { state.seed = 999999; },
    state => { state.herds[0].type = 'missing-animal'; },
    state => { state.weather.k = 'missing-weather'; },
    state => { state.people[0].name = '<em data-proof="1">Osadnik</em>'; },
    state => { state.bld.push({id:987,kind:'missing-building',i:4,j:4,prog:0,work:1}); },
  ];
  for (const change of changes) {
    const state = JSON.parse(good); change(state);
    assert.equal(runtime.evaluate(`decodeSave(${JSON.stringify(JSON.stringify(state))})`), null);
    assert.equal(runtime.memory.get('przystan-v7'), good);
  }
});

test('unrecoverable primary is protected from an automatic fresh-state overwrite', () => {
  const runtime=createGame({storage:{'przystan-v7':'{broken'}});
  runtime.game.startGame(false);
  assert.equal(runtime.evaluate('save()'),false);
  assert.equal(runtime.memory.get('przystan-v7'),'{broken');
});

test('a chosen decision restores its result without repeating the reward', () => {
  const before=createGame();
  before.evaluate("S=freshState();openEvent(EVENTS.find(event=>event.id==='swieto'),{})");
  before.elements.get('ev').listeners.click.forEach(listener=>listener({target:{closest:()=>({dataset:{o:'0'}})}}));
  before.evaluate('save()');
  const food=before.evaluate('foodTotal()');
  const after=createGame({storage:{'przystan-v7':before.memory.get('przystan-v7')}});
  after.game.startGame(false);
  assert.equal(after.evaluate('evOpen?.phase'),'result');
  after.elements.get('ev').listeners.click.forEach(listener=>listener({target:{closest:()=>({dataset:{o:'0'}})}}));
  assert.equal(after.evaluate('foodTotal()'),food);
});

test('invalid backup never replaces the primary save; valid backup can recover', () => {
  const runtime = createGame();
  runtime.evaluate('S=freshState();save()');
  const good = runtime.memory.get('przystan-v7');
  runtime.memory.set('przystan-v7', '{broken');
  runtime.memory.set('przystan-v7-bak', '{also-broken');
  assert.equal(runtime.evaluate('load()'), null);
  assert.equal(runtime.memory.get('przystan-v7'), '{broken');
  runtime.memory.set('przystan-v7-bak', good);
  assert.equal(runtime.evaluate('load()').res.drewno, 22);
});

test('interrupted captain chest can be offered after a fresh restart, exactly once', () => {
  const before = createGame();
  before.evaluate('S=freshState();S.day=16.35;S.wreck.gone=1;S.skrzD=16;bookRescueTick();save()');
  const after = createGame({storage:{'przystan-v7':before.memory.get('przystan-v7')}});
  after.evaluate('S=load();bookRescueTick()');
  assert.equal(after.evaluate('evOpen?.ev.t'), 'Skrzynia kapitana');
  after.evaluate('evOpen.ev.opts[0].f(evOpen.ctx)');
  assert.equal(after.game.S.books.kowal, 1);
  assert.equal(after.game.S.books.siew, 1);
});

test('one-shot registered decision is replayed after load and cannot pay twice', () => {
  const before = createGame();
  before.evaluate("S=freshState();S.seen.evjaskinia=1;openEvent(EVENTS.find(event=>event.id==='jaskinia'),{});save()");
  const after = createGame({storage:{'przystan-v7':before.memory.get('przystan-v7')}});
  after.game.startGame(false);
  assert.equal(after.evaluate('evOpen?.ev.id'), 'jaskinia');
  const click={target:{closest:()=>({dataset:{o:'1'}})}};
  const listeners=after.elements.get('ev').listeners.click;
  listeners.forEach(listener=>listener(click));
  const entries=after.game.S.log.length;
  listeners.forEach(listener=>listener(click));
  assert.equal(after.game.S.log.length, entries);
});

test('the campaign council returns after restart and can choose the next epoch',()=>{
 const before=createGame();
 // RC11: wiec pokoleń zbiera się dopiero po zadaniach głównych epoki I, więc zaliczamy je w przygotowaniu
 before.evaluate('S=freshState();S.actDone=1;S.finQ=0;mqSkip(1);wiecPokolen();save()');
 const after=createGame({storage:{'przystan-v7':before.memory.get('przystan-v7')}});
 after.game.startGame(false);
 assert.equal(after.evaluate('evOpen?.ev.id'),'campaign-route');
 after.elements.get('ev').listeners.click.forEach(listener=>listener({target:{closest:()=>({dataset:{o:'0'}})}}));
 assert.equal(after.game.S.epoch,2);
 assert.equal(after.game.S.path,'dom');
});

test('decision context restores live hamlet, region and scene-backed landmark references',()=>{
 const before=createGame();
 before.evaluate("E2START=true;E3START=true;boot(true);closeSheet();openEvent(EVENTS.find(event=>event.id==='e3_dalej'),{h:S.hamlets[0],r:REGIONS.find(region=>region.id!==0),t:tribe[0]})");
 assert.equal(before.game.save(),true);
 const after=createGame({storage:{'przystan-v7':before.memory.get('przystan-v7')}});
 after.game.startGame(false);
 assert.equal(after.evaluate('evOpen.ctx.h===S.hamlets[0]'),true);
 assert.equal(after.evaluate('REGIONS.includes(evOpen.ctx.r)&&tribe.includes(evOpen.ctx.t)'),true);
});
