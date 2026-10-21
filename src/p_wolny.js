
/* ================= 4.8.0-rc.3 SI czasu wolnego: odwiedziny, ulubione miejsca, rozmowy w drodze, reakcje ================= */
// Wieczór każdy spędza po swojemu: u przyjaciela, w ulubionym miejscu, w gaju, z wędką albo przy grobie bliskiego.
// Zwaśnieni siadają osobno. Przyjaciele, którzy mijają się na ścieżce, przystają na rozmowę.
// Kto długo robi pracę, której nie lubi, zamienia się z kimś, kto zrobi ją równie dobrze (decyzja 3: SI sama).
// Burza i wilki zaganiają dzieci i bojaźliwych pod dach. Decyzje liczą się tylko wtedy, gdy ktoś szuka zajęcia.
const WOL_K=['odw','miejsce','gaj','lowi','grob','ogrod'];
const wolNear=(a,b,r)=>Math.hypot(a.x-b.x,a.z-b.z)<r;
// narzędnik imienia: „z Dobrawą”, „z Radosławem”, „z Mirkiem”, „z Bolkiem”, „ze Stasiem”
function inst(p){const n=p.name;if(/a$/.test(n))return n.slice(0,-1)+'ą';if(p.sex==='k')return n;if(/ek$/.test(n))return n.slice(0,-2)+'kiem';if(/[kg]o$/.test(n))return n.slice(0,-1)+'iem';if(/o$/.test(n))return n.slice(0,-1)+'em';
 if(/ś$/.test(n))return n.slice(0,-1)+'siem';if(/ń$/.test(n))return n.slice(0,-1)+'niem';if(/ź$/.test(n))return n.slice(0,-1)+'ziem';if(/[kg]$/.test(n))return n+'iem';return n+'em'}
const zInst=p=>(/^[SsZzŚśŹź][^aeiouyąęó]/.test(p.name)||/^W[^aeiouyąęó]/.test(p.name)?'ze ':'z ')+inst(p);
function wolPlace(p){const k=p.lub&&p.lub.m,cx=tcx(camp.i),cz=tcx(camp.j);
 if(k==='morze'){const w=waterNear(p.x,p.z);if(w&&Math.hypot(w.x-cx,w.z-cz)<30){const t=nearestWalk(...tileOf(w.x,w.z));if(t)return[t,'siedzi nad morzem i patrzy na wodę','idzie nad morze']}}
 if(k==='las'){let best=null,bd=1e9;for(const n of nodeBy.tree){if(n.gone||n.amt<=0)continue;const d=Math.hypot(n.x-p.x,n.z-p.z);if(d<bd&&d>4){bd=d;best=n}if(bd<10)break}if(best&&bd<26){const t=nearestWalk(best.i,best.j);if(t)return[t,'siedzi na skraju lasu i słucha ptaków','idzie na skraj lasu']}}
 if(k==='pola'){const f=S.bld.find(b=>b.field&&bDone(b));if(f){const t=entryOf(f.kind,f.i,f.j);if(t)return[t,'chodzi po miedzy i patrzy na zboże','idzie na miedzę']}}
 if(k==='gory'){const h=S.bld.find(b=>bDone(b)&&(b.kind==='wieza'||b.kind==='kamien'||b.kind==='lom'));if(h){const t=entryOf(h.kind,h.i,h.j);if(t)return[t,'patrzy z góry na wyspę','idzie popatrzeć z góry na wyspę']}}
 return null}
function wolPick(p){if(!S||p.age<12||!p.lub)return null;const d=Math.floor(S.day),r=Math.random();
 // żałoba: najpierw do bliskich na mogiłę
 const sm=(p.mem||[]).some(m=>m[1]==='smierc'&&d-m[0]<=3);const grob=S.bld.find(b=>b.kind==='cmentarz'&&bDone(b));
 if(sm&&grob&&r<.7){const t=entryOf(grob.kind,grob.i,grob.j);if(t)return{k:'grob',t,txt:'stoi przy grobie bliskiej osoby',go:'idzie na mogiłę bliskiej osoby'}}
 // zwaśniony siedzi przy ogniu: zostanę przed domem
 const rv=rivalsOf(p)[0];if(rv&&rv.eveK==='ogien'&&rv.eveIntentD===d&&r<.75){const h=homeOf(p);if(h&&bDone(h)){const t=entryOf(h.kind,h.i,h.j);if(t)return{k:'odw',t,txt:'siedzi sam'+gw(p,'','a')+' przed domem, z dala od ognia',go:'wraca do domu, nie do ognia'}}}
 let w=.18;if(usp(p,'gadula')||usp(p,'wesoly'))w+=.08;if(usp(p,'milczek')||usp(p,'marzy'))w+=.06;if(seasonIdx()===2||['rain','storm','snow','frost'].includes(S.weather.k))w*=.35;
 if(r>w)return null;const q=Math.random();
 if(q<.35){const kin=S.people.filter(x=>x.fam!==p.fam&&((p.par||[]).includes(x.id)||(x.par||[]).includes(p.id)||((p.par||[]).length&&(x.par||[]).some(id=>(p.par||[]).includes(id)))));const L=relsOf(p).filter(x=>x[1]>=18).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).concat(kin);
 const f=L.find(x=>x.age>=12&&x.fam!==p.fam&&homeOf(x)&&bDone(homeOf(x))&&x.job!=='wyp'&&x.state!=='away');if(f){const h=homeOf(f),t=entryOf(h.kind,h.i,h.j);if(t){const tt=nearestWalk(t[0]+(p.id%2?1:-1),t[1])||t;f.wolGuest=d;return{k:'odw',t:tt,txt:'siedzi '+zInst(f)+' przed '+gw(f,'jego','jej')+' chatą',go:'idzie w odwiedziny do '+gen(f.name),w:f.id}}}}
 if(q<.55&&(usp(p,'bogo')||usp(p,'zabobon'))){const g=S.bld.find(b=>b.kind==='gaj'&&bDone(b));if(g){const t=entryOf(g.kind,g.i,g.j);if(t)return{k:'gaj',t,txt:'siedzi pod świętym dębem',go:'idzie do świętego gaju'}}}
 if(q<.7&&((p.sk.rybak||0)>=1||p.lub.m==='morze')&&seasonIdx()!==2){const w2=waterNear(p.x,p.z);if(w2&&Math.hypot(w2.x-p.x,w2.z-p.z)<22){const t=nearestWalk(...tileOf(w2.x,w2.z));if(t)return{k:'lowi',t,txt:'łowi z brzegu na kolację',go:'idzie z wędką nad wodę'}}}
 if(q<.82&&(usp(p,'gosp')||usp(p,'opiek'))){const h=homeOf(p);if(h&&bDone(h)&&hasExt(h,'ogrod')){const t=entryOf(h.kind,h.i,h.j);if(t)return{k:'ogrod',t,txt:'pieli ogród przy chacie',go:'idzie do ogrodu'}}}
 const pl=wolPlace(p);if(pl)return{k:'miejsce',t:pl[0],txt:pl[1],go:pl[2]};return null}
{const _es=eveSpot;eveSpot=function(p){try{if(!(isSobota()&&S.bld.some(b=>b.kind==='laznia'&&bDone(b))&&p.age>=12)){const c=wolPick(p);if(c){p.eveK=c.k;p.eveTxt=c.txt;p.eveGo=c.go||null;p.eveWith=c.w||null;return c.t}}}catch(e){console.warn('wolny',e)}p.eveTxt=null;p.eveGo=null;p.eveWith=null;return _es(p)}}
{const _sp=stepPerson;stepPerson=function(p,dt){const r=_sp(p,dt);if(p.eveTxt&&WOL_K.includes(p.eveK)&&(p.after==='eve'||p.state==='eve'))p.act=p.state==='eve'?p.eveTxt:(p.eveGo||p.eveTxt);return r}}

/* ---- rozmowy w drodze: przyjaciele przystają na chwilę ---- */
const TALK_T=3.2;
{const _sp=stepPerson;stepPerson=function(p,dt){
  if(p.chatT){if(S.t<p.chatT&&p.state==='move'&&isWork()){const q=pById(p.chatW);if(q)p.dir=Math.atan2(q.x-p.x,q.z-p.z);return}p.chatT=0;p.chatW=null}
  const r=_sp(p,dt);
  if(p.state==='move'&&p.age>=7&&isWork()&&!p.carry&&S.t>=(p.chatN||0)){p.chatN=S.t+1.1+Math.random()*.6;
   for(const q of S.people){if(q===p||q.state!=='move'||q.chatT||q.carry||!wolNear(p,q,1.3)||S.t<(q.chatCd||0)||S.t<(p.chatCd||0))continue;if(relGet(p,q)<25)continue;
    p.chatT=q.chatT=S.t+TALK_T;p.chatW=q.id;q.chatW=p.id;p.chatCd=q.chatCd=S.t+DAY*.35;p.act='rozmawia '+zInst(q);q.act='rozmawia '+zInst(p);relAdd(p,q,1.5);break}}
  return r}}

/* ---- burza i wilki: dzieci i bojaźliwi pod dach ---- */
function wolShelter(p){if(!S||p.fireB||p.job==='wyp')return null;const w=S.weather.k,storm=w==='storm'||w==='burza';const wolves=czRecent(/wilk/i,0)&&tod()>.7;
 if(!storm&&!wolves)return null;const kid=p.age<12,fear=p.lub&&((storm&&p.lub.l==='burza')||(wolves&&p.lub.l==='wilki'));
 if(!kid&&!(fear&&Math.random()<.6))return null;const h=homeOf(p);if(!h||!bDone(h))return null;return storm?(kid?'siedzi w chacie, boi się burzy':'chowa się przed burzą'):'nie wychodzi z chaty, bo wilki są blisko'}
{const _pj=planJob;planJob=function(p){const why=wolShelter(p);if(why){const h=homeOf(p),t=entryOf(h.kind,h.i,h.j);if(t){const at=tileOf(p.x,p.z);if(Math.abs(at[0]-t[0])+Math.abs(at[1]-t[1])>1){if(go(p,t,'idle',null)){p.act='biegnie do domu: '+why.replace(/^siedzi w chacie, /,'');return true}}else{p.act=why;p.wait=4;return false}}}return _pj(p)}}

/* ---- praca, którą się lubi: zamiana, gdy nikt na tym nie traci ---- */
function wolSwap(){if(!S||S.epoch===4)return;const d=Math.floor(S.day);let done=0;
 for(const a of S.people){if(done>=2)break;if(!isAdult(a)||a.job!=='wb'||!a.lub||a.age<16)continue;const ca=jobCraft(a);if(!ca||ca===a.lub.f){a.niech=0;continue}
  a.niech=(a.niech||0)+1;if(a.niech<3)continue;
  const B=S.people.find(b=>b!==a&&b.job==='wb'&&isAdult(b)&&jobCraft(b)===a.lub.f&&b.lub&&b.lub.f!==a.lub.f&&((b.lub.f===ca)||((a.sk[a.lub.f]||0)>=(b.sk[a.lub.f]||0)-1&&(b.sk[ca]||0)>=(a.sk[ca]||0)-1)));
  if(!B)continue;const wa=a.wb,wb=B.wb,ba=bById(wa),bb=bById(wb);if(!ba||!bb)continue;
  release(a);release(B);a.path=B.path=null;a.state=B.state='idle';a.wb=wb;B.wb=wa;a.niech=0;B.niech=0;done++;memAdd(a,'radosc','praca, którą lubi');
  log(`Zamiana przy pracy: ${a.name} ${gw(a,'przechodzi','przechodzi')} do budynku ${BD[bb.kind].n.toLowerCase()} (${CN[a.lub.f]}, lubi to), a ${B.name} na ${gw(B,'jego','jej')} miejsce: ${BD[ba.kind].n.toLowerCase()}. Obsada budynków się nie zmienia.`)}}
{const _kd=kozDaily;kozDaily=function(){_kd();try{wolSwap();wolEveDaily()}catch(e){console.warn('wolny',e)}}}
// wspólny wieczór zbliża: goście i gospodarze, przyjaciele przy jednym ogniu
function wolEveDaily(){const d=Math.floor(S.day)-1;
 for(const p of S.people){if(p.eveD!==d)continue;if(p.eveK==='lowi')S.res.ryby=(S.res.ryby||0)+.8+.3*(p.sk.rybak||0);if(p.eveK==='odw'&&p.eveWith){const q=pById(p.eveWith);if(q){relAdd(p,q,4);if(Math.random()<.25)memAdd(p,'przyjazn',q.name,.1)}}}
 const fire=S.people.filter(p=>p.eveD===d&&(p.eveK==='ogien'||p.eveK==='hala'));if(fire.length>=2)for(let i=0;i<Math.min(6,fire.length);i++){const a=fire[(Math.random()*fire.length)|0],b=fire[(Math.random()*fire.length)|0];if(a!==b)relAdd(a,b,1)}}
window.__wolny={wolPick,wolShelter,wolSwap,wolPlace};
