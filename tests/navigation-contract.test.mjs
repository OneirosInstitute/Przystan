import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';
function fixture(){const g=createGame();g.evaluate('S=freshState();S.day=1.4;S.wreck.gone=1;land.fill(1);occ.fill(-1);rev.fill(1);recomputeWalk();S.res.ryby=2000');return g}
test('an expedition cannot leave or advance through a closed exit',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0];p.job='wyp';p.exp=501;p.state='idle';p.carry=null;S.exps=[{id:501,r:1,type:'zwiad',ppl:[p.id],days:4,left:4,exit:[110,100],risk:0}];walk.fill(0);planJob(p);expTick();return {state:p.state,left:S.exps[0]?.left,act:p.act}})()`);
 assert.notEqual(r.state,'away');assert.equal(r.left,4);assert.match(r.act,/drogi|przejści|wyjści/i);
});
test('an adjacent delivery cannot deposit across a blocked tile',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0];p.x=tcx(110);p.z=tcx(100);p.carry=[{res:'ruda',q:2}];walk[100*N+111]=0;const before=S.res.ruda;const ok=goNow(p,[111,100],'deposit');return {ok,before,after:S.res.ruda,cargo:p.carry?.[0].q}})()`);
 assert.equal(r.ok,false);assert.equal(r.after,r.before);assert.equal(r.cargo,2);
});
test('a failed transport route cannot snap a stranded carrier to distant walkable land',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0];p.x=tcx(110);p.z=tcx(100);p.carry=[{res:'ruda',q:2}];walk.fill(0);walk[100*N+115]=1;const before=[p.x,p.z];const ok=goNow(p,[115,100],'deposit');return {ok,before,after:[p.x,p.z],cargo:p.carry?.[0].q}})()`);
 assert.equal(r.ok,false);assert.deepEqual(Array.from(r.after),Array.from(r.before));assert.equal(r.cargo,2);
});
test('the ordinary planner cannot teleport a stranded person',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0];p.x=tcx(110);p.z=tcx(100);p.job='rob';p.carry=null;walk.fill(0);walk[100*N+115]=1;const before=[p.x,p.z];planJob(p);return {before,after:[p.x,p.z]}})()`);
 assert.deepEqual(Array.from(r.after),Array.from(r.before));
});
test('construction under a person is rejected before paying or changing the map',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{H.fill(1);const p=S.people[0];p.x=tcx(110);p.z=tcx(100);S.res.drewno=500;S.res.kamien=500;const before=JSON.stringify(S.res),count=S.bld.length;placing='pracownia';ghostTile=[110,100];tryPlace();return {count,after:S.bld.length,before,res:JSON.stringify(S.res),occupied:occ[100*N+110]}})()`);
 assert.equal(r.after,r.count);assert.equal(r.res,r.before);assert.equal(r.occupied,-1);
});
test('unreachable expedition dispatch does not consume provisions or reassign the crew',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{walk.fill(0);reach.fill(0);const before=foodTotal(),jobs=S.people.map(p=>p.job).join();sendExp(1,'zwiad');return {before,after:foodTotal(),count:S.exps.length,jobs,afterJobs:S.people.map(p=>p.job).join()}})()`);
 assert.equal(r.count,0);assert.equal(r.after,r.before);assert.equal(r.afterJobs,r.jobs);
});
test('expeditions never take a person away from a pending delivery',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people.find(isAdult);S.people=[p];p.hp=1;p.age=30;p.job='rob';p.carry=[{res:'ruda',q:2}];const general=expCandidates(1).length;p.job='wb';p.wb=501;return {general,building:missionEligible({id:501}).length,cargo:p.carry[0].q}})()`);
 assert.equal(r.general,0);assert.equal(r.building,0);assert.equal(r.cargo,2);
});
test('construction cargo can reach another side when the preferred entrance is disconnected',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0],d=BD.pracownia;S.bld=[{id:501,kind:'pracownia',i:110,j:100,prog:0,work:d.work,mat:20,del:0,inTr:6,haul:1}];p.x=tcx(113);p.z=tcx(101);p.haulB=501;p.haulQ=6;p.carry=[{res:'drewno',q:0}];walk.fill(0);for(const [i,j] of [[109,102],[112,101],[113,101]])walk[j*N+i]=1;resumeDelivery(p);for(let n=0;n<1000&&p.state==='move';n++)movePerson(p,.05);return {del:S.bld[0].del,inTr:S.bld[0].inTr,cargo:p.carry,position:tileOf(p.x,p.z)}})()`);
 assert.equal(r.del,6);assert.equal(r.inTr,0);assert.equal(r.cargo,null);assert.deepEqual(Array.from(r.position),[112,101]);
});
test('an adjacent delivery consumes travel time before it deposits',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0];p.x=tcx(110);p.z=tcx(100);p.carry=[{res:'ruda',q:2}];const before=S.res.ruda,start=p.x;goNow(p,[111,100],'deposit');const early=S.res.ruda;movePerson(p,.05);const distance=Math.hypot(p.x-start,p.z-tcx(100));for(let n=0;n<100&&p.state==='move';n++)movePerson(p,.05);return {before,early,after:S.res.ruda,distance}})()`);
 assert.equal(r.early,r.before);assert.ok(r.distance>0&&r.distance<.2);assert.equal(r.after,r.before+2);
});
test('blocked construction cargo survives restart and is delivered once after reopening',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0],id=p.id,d=BD.pracownia;S.bld=[{id:501,kind:'pracownia',i:110,j:100,prog:0,work:d.work,mat:20,del:0,inTr:6,haul:1}];p.x=tcx(113);p.z=tcx(101);p.haulB=501;p.haulQ=6;p.carry=[{res:'drewno',q:0}];walk.fill(0);const before=[p.x,p.z];resumeDelivery(p);if(!save())throw Error('save');S=load();if(!S)throw Error('load');const loaded=pById(id);const retained=loaded.haulQ;resumeDelivery(loaded);const stopped=[loaded.x,loaded.z];walk.fill(1);walkRevision++;for(let x=110;x<112;x++)for(let z=100;z<102;z++)walk[z*N+x]=0;resumeDelivery(loaded);for(let n=0;n<3000&&loaded.state==='move';n++)movePerson(loaded,.05);const delivered=bById(501).del;resumeDelivery(loaded);return {before,stopped,retained,delivered,again:bById(501).del,inTr:bById(501).inTr,cargo:loaded.carry}})()`);
 assert.deepEqual(Array.from(r.before),Array.from(r.stopped));assert.equal(r.retained,6);assert.equal(r.delivered,6);assert.equal(r.again,6);assert.equal(r.inTr,0);assert.equal(r.cargo,null);
});
test('a reachable expedition departs only on arrival, then its elapsed days advance',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0];p.x=tcx(110);p.z=tcx(100);p.job='wyp';p.exp=501;p.carry=null;S.exps=[{id:501,r:1,type:'zwiad',ppl:[p.id],days:4,left:4,exit:[112,100],risk:0}];planJob(p);expTick();const before={state:p.state,left:S.exps[0].left};for(let n=0;n<200&&p.state==='move';n++)movePerson(p,.05);expTick();return {before,state:p.state,left:S.exps[0].left}})()`);
 assert.equal(r.before.state,'move');assert.equal(r.before.left,4);assert.equal(r.state,'away');assert.equal(r.left,3);
});
test('all thirty production workshops reject stale remote work and allocate distinct stations',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const kinds=Object.keys(BD).filter(kind=>BD[kind].prod),results=[];S.people=S.people.slice(0,2);for(const kind of kinds){walk.fill(1);const d=BD[kind],b={id:501,kind,i:110,j:100,prog:d.work,work:d.work,lv:1,want:2,cond:1,wozQ:1,wozP:0};S.bld=[b];for(let x=110;x<110+d.w;x++)for(let z=100;z<100+d.h;z++)walk[z*N+x]=0;for(const p of S.people){release(p);p.job='wb';p.wb=501;p.hp=1;p.carry=null;p.x=tcx(105);p.z=tcx(100);if(!go(p,[109,99],'prod',b))throw Error(kind+': no station');for(let n=0;n<2000&&p.state==='move';n++)movePerson(p,.05)}const goals=S.people.map(p=>p.routeGoal.join(':'));const p=S.people[0];p.x=tcx(80);p.z=tcx(80);p.wt=1000;const before=JSON.stringify(S.res),xp=JSON.stringify(p.xp);stepPerson(p,.1);results.push({kind,distinct:goals[0]!==goals[1],unchanged:JSON.stringify(S.res)===before,xp:JSON.stringify(p.xp)===xp,cart:b.wozP})}return results})()`);
 assert.equal(r.length,30);for(const item of r){assert.equal(item.distinct,true,item.kind);assert.equal(item.unchanged,true,item.kind);assert.equal(item.xp,true,item.kind);assert.equal(item.cart,0,item.kind)}
});
test('a person at the corner of a station tile walks to its working position without getting stuck',()=>{
 const g=fixture();const r=g.evaluate(`(()=>{const p=S.people[0],d=BD.pracownia,b={id:501,kind:'pracownia',i:110,j:100,prog:d.work,work:d.work,cond:1,want:1};S.bld=[b];p.job='wb';p.wb=501;p.carry=null;p.x=tcx(109)+.49;p.z=tcx(99)+.49;walk.fill(0);walk[99*N+109]=1;const before=[p.x,p.z];go(p,[109,99],'prod',b);const immediate={state:p.state,position:[p.x,p.z]};for(let n=0;n<100&&p.state==='move';n++)movePerson(p,.05);return {before,immediate,state:p.state,check:workSiteCheck(p)}})()`);
 assert.equal(r.immediate.state,'move');assert.deepEqual(Array.from(r.immediate.position),Array.from(r.before));assert.equal(r.state,'work');assert.equal(r.check,null);
});
