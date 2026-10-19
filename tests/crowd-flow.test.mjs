import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// RC11: w RC9 dostawy do obozu stawały („brak drogi do dostawy”), a w RC10 ludzie zakleszczali się w kolejkach
// przy wraku i przy zabawie dzieci („Przejście zajęte”). Ta próba gra pół pierwszego dnia nowej gry krokami jak przy tempie 1.
function firstHalfDay(){
 const g=createGame();g.game.startGame(true);
 return JSON.parse(g.evaluate(`(()=>{S.evT=1e9;const d0=S.day,food0=foodTotal(),deski0=S.res.deski;let n=0,samples=0,worst=0,longest=0;const wait={};
  while(S.day<d0+.5&&n<20000){step(1/60);n++;
   if(n%120===0){samples++;const y=S.people.filter(p=>p.navWait>0).length;worst=Math.max(worst,y/S.people.length)}
   for(const p of S.people){if(p.navWait>0){wait[p.id]=(wait[p.id]||0)+1/60;longest=Math.max(longest,wait[p.id])}else wait[p.id]=0}}
  return JSON.stringify({worst,longest,food:foodTotal()-food0,deski:S.res.deski-deski0,noRoute:S.people.filter(p=>/brak drogi/.test(p.act||'')).length})})()`));
}
test('a new settlement keeps working on its first day instead of queueing at the camp',()=>{
 const r=firstHalfDay();
 assert.ok(r.worst<.35,'too many residents yielding at once: '+r.worst.toFixed(2));
 assert.ok(r.longest<6,'a resident waited '+r.longest.toFixed(1)+' s without passing');
 assert.ok(r.deski>0,'nothing carried from the wreck');
 assert.ok(r.food>-15,'food fell by '+r.food.toFixed(1));
 assert.equal(r.noRoute,0);
});
test('two residents waiting for each other do not wait forever',()=>{
 const g=createGame();g.evaluate('S=freshState();S.day=.4;S.wreck.gone=1;S.people=S.people.slice(0,2);land.fill(1);occ.fill(-1);H.fill(1);rev.fill(1);recomputeWalk();for(const p of S.people){p.job="rob";p.carry=null;p.hp=1;p.state="idle"}');
 // wąski korytarz jednego kafla: obejść się nie da
 const r=JSON.parse(g.evaluate(`(()=>{walk.fill(0);for(let i=95;i<=110;i++)walk[100*N+i]=1;walkRevision++;const [p,q]=S.people;p.x=tcx(96);p.z=tcx(100);q.x=tcx(109);q.z=tcx(100);go(p,[109,100],'idle',null);go(q,[96,100],'idle',null);
  let n=0;for(;n<3000&&(p.state==='move'||q.state==='move');n++){movePerson(p,.05);movePerson(q,.05);S.t+=.05}return JSON.stringify({n,states:[p.state,q.state]})})()`));
 assert.deepEqual(r.states,['idle','idle']);
 assert.ok(r.n<600,'took '+r.n+' ticks');
});
