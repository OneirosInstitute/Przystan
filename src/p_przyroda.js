
/* ================= 4.9.0-rc.20 Życie wyspy, pakiet 1: płochliwość ================= */
// Dzikie zwierzęta trzymają się z dala od ludzi i osady („Przystań — plan życia Wyspy”, 29.10.2026).
// Każdy gatunek ma dystans ucieczki od ludzi i psów (p) i odległość, na jaką trzyma się od zabudowań (b), w polach mapy.
// Nocą dystans od ludzi spada o połowę, a szkodniki podchodzą bliżej: dzik do pól, lis pod zagrody, wilk zimą pod zagrody.
// Gdy osada zajmie ostoję stada, stado szuka nowej w spokojnym miejscu ze swoim siedliskiem. Myśliwy i hodowca podchodzą
// do „swojego” stada, ale myśliwego stado może zwęszyć. Wybite stado nie odrasta samo: wraca tylko z sąsiedniego stada.
const ZW_FEAR={sarna:{p:14,b:9,v:2.6},koza:{p:12,b:9,v:2.2},dzik:{p:8,b:6,v:2},zajac:{p:6,b:4,v:3},lis:{p:8,b:5,v:2.4},wilk:{p:18,b:12,v:2.4},niedzwiedz:{p:20,b:14,v:1.6},foka:{p:6,b:10,v:.6}};
const ZW_HAB={sarna:(b,f)=>b!=='coast'&&b!=='high'&&b!=='sea',koza:(b,f)=>f<=.45&&b!=='coast'&&b!=='sea',dzik:(b,f)=>(f>=.45||b==='wet')&&b!=='coast'&&b!=='sea',
 wilk:(b,f)=>f>=.45&&b!=='coast'&&b!=='sea',zajac:b=>b==='meadow',lis:(b,f)=>f>.35&&f<.7&&b!=='coast'&&b!=='sea',foka:b=>b==='coast',niedzwiedz:b=>b==='conif'||b==='high'};
const ZW_FAR=60,ZW_CHECK=.4;
let zwDist=null,zwSig='',zwSigT=-1e9,zwCheckT=0;const zwQ=new Int32Array(N*N);

// ---------- odległość od zabudowań (pola mapy, do 60) ----------
function zwSigNow(){let s=S.bld.length+':';const L=S.bld;s+=L.length?L[L.length-1].id+':'+L[0].id:'';const H=(S.hamlets||[]).filter(h=>h.st===undefined||h.st>=0);return s+':'+H.length}
function zwBuild(){const D=zwDist||(zwDist=new Uint8Array(N*N));D.fill(255);let h=0,t=0;
 const seed=(i,j)=>{if(i<0||j<0||i>=N||j>=N)return;const k=j*N+i;if(D[k]===0)return;D[k]=0;zwQ[t++]=k};
 for(const b of S.bld){const d=BD[b.kind];if(!d)continue;const w=d.w||1,hh=d.h||1;for(let y=0;y<hh;y++)for(let x=0;x<w;x++)seed(b.i+x,b.j+y)}
 if(typeof camp!=='undefined')seed(camp.i,camp.j);
 for(const H of S.hamlets||[]){if(H.st!==undefined&&H.st<0)continue;if(typeof H.i!=='number')continue;for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)seed(H.i+x,H.j+y)}
 while(h<t){const k=zwQ[h++],v=D[k];if(v>=ZW_FAR)continue;const x=k%N,y=(k/N)|0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const a=x+dx,b=y+dy;if(a<0||b<0||a>=N||b>=N)continue;const n=b*N+a;if(D[n]>v+1){D[n]=v+1;zwQ[t++]=n}}}
 zwSig=zwSigNow();zwSigT=S.t}
function zwD(x,z){if(!zwDist)zwBuild();const t=tileOf(x,z);return zwDist[t[1]*N+t[0]]}
function zwFresh(){if(!zwDist||S.t-zwSigT>2){const s=zwSigNow();if(!zwDist||s!==zwSig)zwBuild();else zwSigT=S.t}}

// ---------- co wolno o tej porze ----------
const zwNight=()=>typeof isNight==='function'&&isNight();
const zwSea=()=>Math.floor(rday()/SD)%4;
function zwHome(h,k){if(typeof h.hi==='number')return[h.hi,h.hj];const d=herdsDef[k];return d?[d.i,d.j]:tileOf(h.x,h.z)}
// odległość od zabudowań, którą stado trzyma teraz; szkodniki nocą podchodzą bliżej
function zwAvoid(h){const F=ZW_FEAR[h.type];if(!F)return 0;if(!zwNight())return F.b;
 if(h.type==='dzik'&&zwSea()!==2)return 0;if(h.type==='lis')return 0;if(h.type==='wilk')return zwSea()===2?0:F.b*.5;return F.b*.7}
function zwFlight(h){const F=ZW_FEAR[h.type];if(!F)return 0;return F.p*(zwNight()?.5:1)}
// cel szkodnika nocą: pole z plonem albo zagroda z kozami w pobliżu ostoi
function zwPestTarget(h,k){if(!zwNight())return null;const[hi,hj]=zwHome(h,k),hx=tcx(hi),hz=tcx(hj);let L=null;
 if(h.type==='dzik'&&zwSea()!==2)L=S.bld.filter(b=>b.field&&(b.field.st==='rosnie'||b.field.st==='dojrzale'));
 else if(h.type==='lis')L=S.bld.filter(b=>b.kind==='zagroda'&&bDone(b)&&(b.animals||0)>0);
 else if(h.type==='wilk'&&zwSea()===2)L=S.bld.filter(b=>b.kind==='zagroda'&&bDone(b)&&(b.animals||0)>0);
 if(!L||!L.length)return null;let best=null,bd=1e9;for(const b of L){const c=bCenter(b),d=Math.hypot(c.x-hx,c.z-hz);if(d<bd){bd=d;best=c}}
 return best&&bd<=(h.type==='wilk'?40:30)?best:null}

// ---------- nowa ostoja, gdy osada zajęła starą ----------
function zwHabOk(type,i,j){if(i<2||j<2||i>=N-2||j>=N-2)return false;const k=j*N+i;if(!land[k]||!walk[k]||tileH(i,j)>8.5)return false;const f=ZW_HAB[type];return!f||f(biomeOf(i,j),forestF(i+.5,j+.5))}
function zwRehome(h,k){const F=ZW_FEAR[h.type];if(!F)return false;zwFresh();const[hi,hj]=zwHome(h,k);const need=F.b+4;if(zwDist[hj*N+hi]>=need)return false;
 let best=null,bs=-1e9;for(let r=6;r<=72&&!best;r+=3)for(let a=0;a<24;a++){const an=a/24*6.283+r*.37,i=Math.round(hi+Math.cos(an)*r),j=Math.round(hj+Math.sin(an)*r);
  if(!zwHabOk(h.type,i,j)||zwDist[j*N+i]<need)continue;
  const crowd=S.herds.some((o,q)=>q!==k&&o.type===h.type&&o.n>0&&Math.abs((typeof o.hi==='number'?o.hi:tileOf(o.x,o.z)[0])-i)+Math.abs((typeof o.hj==='number'?o.hj:tileOf(o.x,o.z)[1])-j)<6);
  const sc=-r-(crowd?20:0)+Math.min(zwDist[j*N+i],40)*.2;if(sc>bs){bs=sc;best=[i,j]}}
 if(!best)return false;h.hi=best[0];h.hj=best[1];h.tx=tcx(best[0]);h.tz=tcx(best[1]);h.moved=Math.floor(S.day);return true}

// ---------- ucieczka ----------
function zwFlee(h,fx,fz){const F=ZW_FEAR[h.type];const ang=Math.atan2(h.z-fz,h.x-fx),want=F.p+8;let best=null,bs=-1e9;
 for(const da of[0,-.5,.5,-1,1,-1.6,1.6]){const an=ang+da,tx=h.x+Math.cos(an)*want,tz=h.z+Math.sin(an)*want;const ti=tileOf(tx,tz),tk=ti[1]*N+ti[0];
  if(!walk[tk]||(h.type==='foka'&&!beach[tk]))continue;const sc=Math.min(zwDist[tk],40)-Math.abs(da)*4;if(sc>bs){bs=sc;best=[tx,tz]}}
 if(!best)return false;h.tx=best[0];h.tz=best[1];h.fleeT=S.t+5+Math.random()*4;h.alertT=S.t+DAY*.15;return true}
const zwThreatOk=p=>p.state!=='away'&&p.state!=='sleep'&&!p.lost&&!p.e4Transport&&p.job!=='wyp';
const zwStalk=(p,k)=>p.herd===k&&(p.after==='hunt'||p.after==='tame'||(p.state==='work'&&(p.workKind==='hunt'||p.workKind==='tame')));
// raz na kilka chwil: kto stoi za blisko którego stada (siatka 16 × 16 pól, żeby nie liczyć każdy z każdym)
function zwCheck(){zwFresh();const C=16,G=new Map(),put=(x,z,o)=>{const key=((Math.floor((x+N/2)/C))<<8)|Math.floor((z+N/2)/C);let L=G.get(key);if(!L)G.set(key,L=[]);L.push(o)};
 for(const p of S.people)if(zwThreatOk(p))put(p.x,p.z,p);
 for(const d of S.dogs||[])if(!d.dead&&d.st!=='sleep')put(d.x,d.z,{dog:1,x:d.x,z:d.z});
 S.herds.forEach((h,k)=>{if(h.n<=0||!ZW_FEAR[h.type])return;if(h.calm>S.t)return;const fl=zwFlight(h);
  if(!(h.fleeT>S.t)){const cx=Math.floor((h.x+N/2)/C),cz=Math.floor((h.z+N/2)/C);let near=null,nd=1e9,hunter=null;
   for(let a=cx-2;a<=cx+2;a++)for(let b=cz-2;b<=cz+2;b++){const L=G.get((a<<8)|b);if(!L)continue;for(const o of L){const d=Math.hypot(o.x-h.x,o.z-h.z)*(o.dog?1/.7:1);if(d>=fl)continue;
     if(!o.dog&&zwStalk(o,k)){if(o.after==='hunt'||o.workKind==='hunt')hunter=o;continue}if(d<nd){nd=d;near=o}}}
   if(near){zwFlee(h,near.x,near.z);return}
   // myśliwy podchodzi: stado może go zwęszyć, raz na jedno podejście
   if(hunter&&h.spk!==hunter.id){h.spk=hunter.id;if(Math.random()<Math.max(.1,.35-.05*(hunter.sk.mysliwy||0))*(zwNight()?.6:1)){zwFlee(h,hunter.x,hunter.z);h.spooked=(h.spooked||0)+1;return}}}
  // za blisko zabudowań: odwrót do ostoi (szkodnik nocą idzie swoją drogą)
  const av=zwAvoid(h);if(av>0&&zwD(h.x,h.z)<av-1&&!(h.fleeT>S.t)){const[hi,hj]=zwHome(h,k);if(zwDist[hj*N+hi]<av&&!zwRehome(h,k))return;const[ri,rj]=zwHome(h,k);h.tx=tcx(ri)+(Math.random()-.5)*4;h.tz=tcx(rj)+(Math.random()-.5)*4}})}

// ---------- ruch stad ----------
stepHerds=function(dt){if(!S||!S.herds)return;zwCheckT-=dt;if(zwCheckT<=0){zwCheckT=ZW_CHECK;try{zwCheck()}catch(e){console.warn('przyroda',e)}}
 S.herds.forEach((h,k)=>{if(h.calm>S.t)return;const dx=h.tx-h.x,dz=h.tz-h.z,d=Math.hypot(dx,dz);
  if(d<.3){if(Math.random()<dt*.15)zwWander(h,k)}
  else{const F=ZW_FEAR[h.type],flee=h.fleeT>S.t;const sp=(flee&&F?F.v:(h.type==='zajac'?1.1:h.type==='foka'?.15:.5))*dt;h.x+=dx/d*Math.min(sp,d);h.z+=dz/d*Math.min(sp,d)}})};
function zwWander(h,k){const[hi,hj]=zwHome(h,k);const av=zwAvoid(h);
 const pest=zwPestTarget(h,k);if(pest&&Math.random()<.5){const tx=pest.x+(Math.random()-.5)*6,tz=pest.z+(Math.random()-.5)*6,ti=tileOf(tx,tz);if(walk[ti[1]*N+ti[0]]){h.tx=tx;h.tz=tz;return}}
 for(let n=0;n<6;n++){const a=Math.random()*6.28,r=Math.random()*(h.type==='wilk'?16:9);const tx=tcx(hi)+Math.cos(a)*r*(h.type==='foka'?.35:1),tz=tcx(hj)+Math.sin(a)*r*(h.type==='foka'?.35:1);
  const ti=tileOf(tx,tz),tk=ti[1]*N+ti[0];if(!walk[tk]||(h.type==='foka'&&!beach[tk]))continue;if(av>0&&zwDist&&zwDist[tk]<av)continue;h.tx=tx;h.tz=tz;return}}

// ---------- raz na dobę: ostoje, powrót wybitych stad ----------
function zwDaily(){if(!S||!S.herds)return;zwBuild();const sea=zwSea();
 S.herds.forEach((h,k)=>{if(!ZW_FEAR[h.type])return;
  if(h.n>0)zwRehome(h,k);if(h.n>=2)return;// samotne zwierzę nie da młodych: czeka na resztę stada z sąsiedztwa
  // wybite stado wraca tylko z sąsiedztwa: wiosną i latem część większego stada tego gatunku przenosi się na puste miejsce
  if(sea===2||sea===1)return;const[hi,hj]=zwHome(h,k);if(zwDist[hj*N+hi]<ZW_FEAR[h.type].b+4)return;// pusta ostoja w osadzie: nikt tam nie wróci
  let src=null,sd=1e9;S.herds.forEach((o,q)=>{if(q===k||o.type!==h.type||o.n<4)return;const d=Math.hypot(o.x-tcx(hi),o.z-tcx(hj));if(d<sd&&d<=80){sd=d;src=o}});
  if(src&&Math.random()<K*.05){src.n-=2;h.n+=2;h.x=src.x;h.z=src.z;h.tx=tcx(hi);h.tz=tcx(hj);h.huntPressure=0}})}
window.__przyroda={ZW_FEAR,zwBuild,zwD,zwCheck,zwRehome,zwDaily,zwAvoid,zwFlight,zwHome,zwPestTarget,get dist(){return zwDist}};
