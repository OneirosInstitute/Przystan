import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.3: każda kraina ma rolę liczoną z ziemi i złóż; rola zmienia wydajność budynków i plon pól
function game(seed){const g=createGame(seed?{search:'?seed='+seed}:{});g.game.startGame(true);return g}
test('every island has all ten region characters and each deposit region is where its deposit lies',()=>{
 for(const seed of [2207,4096,12345]){const g=game(seed);
  const r=JSON.parse(g.evaluate(`JSON.stringify({roles:Object.keys(__kr.KR),got:__kr.regions().map(r=>r.kr),zag:__kr.regions().filter(r=>r.kr==='zaglebie').map(r=>r.id),dep:__zl.deposits().filter(o=>o.t==='wegiel'||o.t==='rudne').map(o=>REGION[o.j*N+o.i])})`));
  for(const role of r.roles)assert.ok(r.got.includes(role),`wyspa ${seed}: brak krainy ${role}`);
  for(const id of r.zag)assert.ok(r.dep.includes(id),`wyspa ${seed}: Zagłębie bez węgla ani rudy`)}
});
test('a region character speeds up the matching buildings and raises field yield',()=>{
 const g=game();
 const r=JSON.parse(g.evaluate(`(()=>{const R=__kr.regions();const at=role=>R.find(x=>x.kr===role);const other=R.find(x=>x.kr==='gran');
  const mk=(kind,reg)=>({id:990,kind,i:reg.i,j:reg.j,prog:9,work:9,cmp:1,cond:1,ext:[],lv:1});
  const laki=at('laki'),niz=at('niziny');const pa=bMul(mk('pasieka',laki)),pb=bMul(mk('pasieka',other)),dr=bMul(mk('drwal',at('bory'))),db=bMul(mk('drwal',other));
  const f1={...mk('pole',niz),field:{st:'rosnie',fert:1,q:1,m:.5}},f2={...mk('pole',laki),field:{st:'rosnie',fert:1,q:1,m:.5}};f1.field.soil=f2.field.soil='czarna';
  return JSON.stringify({pa,pb,dr,db,fn:fieldMul(f1),fo:fieldMul(f2),line:__kr.krLine(laki)})})()`));
 assert.ok(Math.abs(r.pa/r.pb-1.5)<1e-6,'barć na kwietnej łące');assert.ok(Math.abs(r.dr/r.db-1.2)<1e-6,'drwal w starym borze');
 assert.ok(Math.abs(r.fn/r.fo-1.3)<1e-6,'pole na żyznej nizinie');assert.match(r.line,/Kwietne Łąki/);assert.match(r.line,/barć \+50%/);
});
test('regions also charge a price: grazing eats the meadow, stony ground feeds less, marsh and mine work make people ill',()=>{
 const g=game();
 const r=JSON.parse(g.evaluate(`(()=>{const R=__kr.regions();const at=role=>R.find(x=>x.kr===role);const laki=at('laki'),gran=at('gran');
  const mk=(id,kind,reg)=>({id,kind,i:reg.i,j:reg.j,prog:9,work:9,cmp:1,cond:1,ext:[],lv:1});const hive=mk(991,'pasieka',laki);const before=bMul(hive);
  S.bld.push(mk(992,'zagroda',laki),mk(993,'zagroda',laki));const after=bMul(hive);
  const forage=bMul(mk(994,'zbieracz',gran))/bMul(mk(995,'zbieracz',laki));
  const line=__kr.krLine(gran);
  const mine=mk(996,'kopalnia',at('zaglebie'));S.bld.push(mine);const p=S.people.find(isAdult);p.job='wb';p.wb=996;p.ill=null;p.warm=1;S.res.jagody=1000;S.sporD=-1;S.bld.push(mk(997,'studnia',laki));const rnd=Math.random;Math.random=()=>.001;try{illDaily()}finally{Math.random=rnd}
  const camp=REGIONS[0];const campFree=Object.keys(BD).every(k=>__kr.krMulKind(camp,k)>=1);
  return JSON.stringify({ratio:after/before,forage,line,ill:p.ill&&p.ill.k,campFree})})()`));
 assert.ok(Math.abs(r.ratio-.76)<1e-6,'dwie zagrody na łące');assert.ok(Math.abs(r.forage-.75/1.1)<1e-6,'zbieracz na grani');
 assert.match(r.line,/Czym płaci:/);assert.equal(r.ill,'gornicza');assert.equal(r.campFree,true,'kraina obozu nie płaci');
});
