import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from './runtime.mjs';

// 4.9.0-rc.20: życie wyspy, pakiet 1 — dzikie zwierzęta trzymają się z dala od ludzi i osady
function village(){
 const runtime=createGame({search:'?seed=2207'});const E=s=>runtime.evaluate(s);E('E2START=true');runtime.game.startGame(true);E('closeSheet()');
 E("S.evT=1e9;if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null");
 const days=n=>{for(let d=0;d<n;d++)for(let i=0;i<40;i++){E('for(let q=0;q<6;q++)step(1)');E("if(evOpen){$('ev').hidden=true;evOpen=null}S.pendingDecision=null")}};
 return {runtime,E,days};
}
const DAYTIME='S.day=Math.floor(S.day)+.5';
const NIGHT='S.day=Math.floor(S.day)+.9';

test('by day no wild herd stays among the houses: the ones the settlement grew over move away',()=>{
 const {E,days}=village();E(DAYTIME);
 const close=`(()=>{__przyroda.zwBuild();const F=__przyroda.ZW_FEAR;return S.herds.filter(h=>h.n>0&&F[h.type]&&__przyroda.zwD(h.x,h.z)<F[h.type].b-2).length})()`;
 assert.ok(E(close)>0,'the old herds start inside the settlement');
 days(2);E(DAYTIME);E('for(let q=0;q<60;q++)step(1)');
 assert.equal(E(close),0);assert.ok(E("S.herds.filter(h=>typeof h.hi==='number').length")>0,'some herds found a new home');
});

test('a herd whose home becomes a building site finds a quiet place with its own habitat',()=>{
 const {E}=village();
 const k=E(`S.herds.findIndex(h=>h.type==='sarna'&&h.n>0)`);
 const r=JSON.parse(E(`JSON.stringify((()=>{const h=S.herds[${k}];const[hi,hj]=__przyroda.zwHome(h,${k});S.bld.push({id:9001,kind:'chata',i:hi,j:hj,prog:1,work:1});__przyroda.zwBuild();
  const moved=__przyroda.zwRehome(h,${k});const[ni,nj]=__przyroda.zwHome(h,${k});return{moved,d:__przyroda.dist[nj*N+ni],need:__przyroda.ZW_FEAR.sarna.b+4,biome:biomeOf(ni,nj)}})())`));
 assert.equal(r.moved,true);assert.ok(r.d>=r.need,JSON.stringify(r));assert.ok(!['coast','high','sea'].includes(r.biome),r.biome);
});

test('a herd flees from a person who comes too close, away from that person',()=>{
 const {E}=village();E(DAYTIME);
 const r=JSON.parse(E(`JSON.stringify((()=>{const k=S.herds.findIndex(h=>h.type==='sarna'&&h.n>0);const h=S.herds[k];h.fleeT=0;h.calm=0;const p=S.people.find(q=>q.age>=16);p.state='idle';p.herd=null;p.after=null;p.x=h.x+5;p.z=h.z;
  const before=Math.hypot(h.tx-p.x,h.tz-p.z);__przyroda.zwCheck();return{flee:h.fleeT>S.t,before,after:Math.hypot(h.tx-p.x,h.tz-p.z),want:__przyroda.ZW_FEAR.sarna.p}})())`));
 assert.equal(r.flee,true);assert.ok(r.after>r.want,JSON.stringify(r));
});

test('a hunter stalks his herd; it may scent him once per approach, but not every moment',()=>{
 const {E}=village();E(DAYTIME);
 const setup=`(()=>{const k=S.herds.findIndex(h=>h.type==='sarna'&&h.n>0);const h=S.herds[k];h.fleeT=0;h.spk=null;S.people.forEach(q=>{q.x=1e4;q.z=1e4});const p=S.people.find(q=>q.age>=16);p.state='move';p.herd=k;p.after='hunt';p.x=h.x+6;p.z=h.z;window.__k=k;window.__p=p;return k})()`;
 E(setup);E('window.__r=Math.random;Math.random=()=>.99');E('__przyroda.zwCheck()');assert.equal(E('S.herds[__k].fleeT>S.t'),false,'the hunter got close');
 E('Math.random=()=>0');E('__przyroda.zwCheck()');assert.equal(E('S.herds[__k].fleeT>S.t'),false,'one roll per approach');
 E(setup);E('Math.random=()=>0');E('__przyroda.zwCheck()');E('Math.random=__r');assert.equal(E('S.herds[__k].fleeT>S.t'),true,'scented on a new approach');
});

test('at night only pests come close: the boar to the crops, the fox to the pen; the roe deer keeps away',()=>{
 const {E}=village();E(NIGHT);
 assert.equal(E('isNight()'),true);
 const r=JSON.parse(E(`JSON.stringify((()=>{const F=__przyroda.ZW_FEAR;const by=t=>S.herds.find(h=>h.type===t&&h.n>0);const d=by('dzik'),s=by('sarna'),l=by('lis');
  const k=S.herds.indexOf(d);const[hi,hj]=__przyroda.zwHome(d,k);S.bld.push({id:9002,kind:'pole',i:hi+4,j:hj+4,prog:1,work:1,field:{st:'dojrzale',g:1,fert:1,q:0,left:20}});
  const sea=Math.floor(rday()/SD)%4;return{dzik:__przyroda.zwAvoid(d),sarna:__przyroda.zwAvoid(s),lis:__przyroda.zwAvoid(l),pest:!!__przyroda.zwPestTarget(d,k),sea,day:{dzik:F.dzik.b}}})())`));
 if(r.sea!==2)assert.equal(r.dzik,0);assert.equal(r.lis,0);assert.ok(r.sarna>0);if(r.sea!==2)assert.equal(r.pest,true);
});

test('a hunted-out herd does not grow back by itself; it comes back only from a neighbouring herd in spring or summer',()=>{
 const {E}=village();
 const k=E(`(()=>{const k=S.herds.findIndex(h=>h.type==='sarna'&&h.n>0&&S.herds.some((o,q)=>q!==S.herds.indexOf(h)&&o.type==='sarna'&&Math.hypot(o.x-h.x,o.z-h.z)<70));const h=S.herds[k];h.n=0;return k})()`);
 E('S.herds.forEach((h,q)=>{if(q!==__k0&&h.type===S.herds[__k0].type)h.n=0})'.replace(/__k0/g,k));
 E('S.day=Math.floor(S.day/YEAR)*YEAR+3*SD+1');for(let i=0;i<8;i++)E('newDay()');assert.equal(E(`S.herds[${k}].n`),0,'nothing grows from nothing');
 E(`(()=>{const h=S.herds[${k}];const o=S.herds.find((o,q)=>q!==${k}&&o.type===h.type&&Math.hypot(o.x-h.x,o.z-h.z)<70);o.n=6;window.__o=o})()`);
 E('window.__r=Math.random;Math.random=()=>0');E('__przyroda.zwDaily()');E('Math.random=__r');
 const[hi,hj]=E(`__przyroda.zwHome(S.herds[${k}],${k})`);const quiet=E(`__przyroda.dist[${hj}*N+${hi}]>=__przyroda.ZW_FEAR.sarna.b+4`);
 if(quiet){assert.equal(E(`S.herds[${k}].n`),2);assert.equal(E('__o.n'),4)}else assert.equal(E(`S.herds[${k}].n`),0);
});

test('the new home of a herd survives saving and loading',()=>{
 const {E}=village();
 E(`(()=>{const h=S.herds.find(h=>h.n>0);h.hi=100;h.hj=120;save();S=load()})()`);
 assert.equal(E('S.herds.find(h=>typeof h.hi==="number").hi'),100);
});
