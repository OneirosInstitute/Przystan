
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
function zwDaily(){if(!S||!S.herds)return;zwBuild();const sea=zwSea();try{zwMapDaily()}catch(e){console.warn('przyroda: mapa',e)}
 S.herds.forEach((h,k)=>{if(!ZW_FEAR[h.type])return;
  if(h.n>0)zwRehome(h,k);if(h.n>=2)return;// samotne zwierzę nie da młodych: czeka na resztę stada z sąsiedztwa
  // wybite stado wraca tylko z sąsiedztwa: wiosną i latem część większego stada tego gatunku przenosi się na puste miejsce
  if(sea===2||sea===1)return;const[hi,hj]=zwHome(h,k);if(zwDist[hj*N+hi]<ZW_FEAR[h.type].b+4)return;// pusta ostoja w osadzie: nikt tam nie wróci
  let src=null,sd=1e9;S.herds.forEach((o,q)=>{if(q===k||o.type!==h.type||o.n<4)return;const d=Math.hypot(o.x-tcx(hi),o.z-tcx(hj));if(d<sd&&d<=80){sd=d;src=o}});
  if(src&&Math.random()<K*.05){src.n-=2;h.n+=2;h.x=src.x;h.z=src.z;h.tx=tcx(hi);h.tz=tcx(hj);h.huntPressure=0}})}
// ================= pakiet 2 (4.9.0-rc.21): mapa spokoju i siedlisk =================
// Wyspa ma zgrubną siatkę 24 × 24 komórek po 16 × 16 pól. Raz na dobę każda komórka dostaje spokój (odległość od zabudowań,
// wydeptane ścieżki, polowania) i las (ile drzew naprawdę stoi). Pojemność komórki dla gatunku = siedlisko × las × spokój^wrażliwość.
// Stado, któremu w ostoi jest źle albo ciasno, przenosi się do lepszej komórki w pobliżu (najdalej dwie komórki, nie częściej niż co 3 dni).
const ZW_C=16,ZW_CN=Math.ceil(N/ZW_C),ZW_CELLS=ZW_CN*ZW_CN;
const ZW_SENS={sarna:1.6,koza:1.2,dzik:.6,zajac:.5,lis:.4,wilk:1.4,niedzwiedz:1.8,foka:1};
const ZW_FULL={sarna:14,koza:12,dzik:10,zajac:12,lis:6,wilk:8,niedzwiedz:3,foka:12};// ile zwierząt wyżywi pełna komórka
const ZW_FOREST={sarna:f=>.45+.55*f,dzik:f=>.2+.8*f,wilk:f=>.15+.85*f,niedzwiedz:f=>.15+.85*f,zajac:f=>1.15-.35*f,lis:f=>.85+.15*f,koza:()=>1,foka:()=>1};
const ZW_PL={sarna:'Sarny odeszły',koza:'Dzikie kozy odeszły',dzik:'Dziki odeszły',wilk:'Wilki odeszły',zajac:'Zające odeszły',lis:'Lisy odeszły',foka:'Foki odpłynęły',niedzwiedz:'Niedźwiedź odszedł'};
let zwHab=null,zwTrees=null,zwQuiet=null,zwForest=null;
const zwCell=(i,j)=>Math.min(ZW_CN-1,Math.max(0,(j/ZW_C)|0))*ZW_CN+Math.min(ZW_CN-1,Math.max(0,(i/ZW_C)|0));
// siedlisko z rzeźby i lasu z mapy: raz na grę (próbka co trzecie pole)
function zwHabInit(){zwHab={};for(const t in ZW_HAB){const A=new Float32Array(ZW_CELLS),C=new Float32Array(ZW_CELLS);
  for(let j=1;j<N-1;j+=3)for(let i=1;i<N-1;i+=3){const c=zwCell(i,j);C[c]++;if(zwHabOk(t,i,j))A[c]++}for(let c=0;c<ZW_CELLS;c++)A[c]=C[c]?A[c]/C[c]:0;zwHab[t]=A}
 zwTrees=Array.from({length:ZW_CELLS},()=>[]);for(const n of (typeof nodeBy!=='undefined'&&nodeBy.tree)||[])zwTrees[zwCell(n.i,n.j)].push(n)}
// raz na dobę: spokój i las w każdej komórce
function zwMap(){if(!zwHab)zwHabInit();if(!zwDist)zwBuild();const Q=zwQuiet||(zwQuiet=new Float32Array(ZW_CELLS)),F=zwForest||(zwForest=new Float32Array(ZW_CELLS));
 const hunt=new Float32Array(ZW_CELLS);for(const h of S.herds)if(h.huntPressure>0){const t=tileOf(h.x,h.z);hunt[zwCell(t[0],t[1])]+=h.huntPressure}
 const TP=typeof TREAD_PATH==='number'?TREAD_PATH:.5;
 for(let cj=0;cj<ZW_CN;cj++)for(let ci=0;ci<ZW_CN;ci++){const c=cj*ZW_CN+ci;let qb=0,path=0,n=0;
  for(let j=cj*ZW_C+1;j<Math.min(N,(cj+1)*ZW_C);j+=3)for(let i=ci*ZW_C+1;i<Math.min(N,(ci+1)*ZW_C);i+=3){const k=j*N+i;n++;qb+=Math.max(0,Math.min(1,(zwDist[k]-4)/30));if(tread[k]>=TP)path++}
  const pf=n?path/n:0;Q[c]=(n?qb/n:1)*(1-.5*Math.min(1,pf*4))*(1-Math.min(.6,hunt[c]*.3));
  const L=zwTrees[c];if(L.length>=4){let a=0;for(const t of L)if(!t.gone&&t.amt>0)a++;F[c]=a/L.length}else F[c]=-1}}
function zwCap(t,c){const hab=zwHab[t]?zwHab[t][c]:0;if(!hab)return 0;const f=zwForest[c];const fm=f<0?1:(ZW_FOREST[t]||(()=>1))(f);return Math.min(1,hab*1.6)*fm*Math.pow(Math.max(0,zwQuiet[c]),ZW_SENS[t]||1)}
// ile zwierząt danego gatunku żyje w każdej komórce (raz na dobę, poprawiane przy każdej przeprowadzce)
let zwCrowdT=null;
function zwCrowdBuild(){zwCrowdT={};S.herds.forEach((o,k)=>{if(o.n<=0||!ZW_FULL[o.type])return;const A=zwCrowdT[o.type]||(zwCrowdT[o.type]=new Float32Array(ZW_CELLS));const[hi,hj]=zwHome(o,k);A[zwCell(hi,hj)]+=o.n})}
function zwCrowd(t,c,skip){const A=zwCrowdT&&zwCrowdT[t];if(!A)return 0;let n=A[c];if(skip&&skip.n>0){const k=S.herds.indexOf(skip);const[hi,hj]=zwHome(skip,k);if(zwCell(hi,hj)===c)n-=skip.n}return n}
function zwPlaceIn(t,c,need){const ci=c%ZW_CN,cj=(c/ZW_CN)|0;let best=null,bd=-1;
 for(let q=0;q<40;q++){const i=ci*ZW_C+1+((q*7)%14),j=cj*ZW_C+1+((q*11)%14);if(i>=N-2||j>=N-2||!zwHabOk(t,i,j))continue;const d=zwDist[j*N+i];if(d>=need&&d>bd){bd=d;best=[i,j]}}return best}
// stado ocenia swoją ostoję; zwraca nazwę krainy, z której odeszło (dla Kroniki), albo null
function zwMigrate(h,k){const t=h.type;if(!ZW_FULL[t]||h.n<=0)return null;const d=Math.floor(S.day);if(d-(h.migD??-99)<3)return null;
 const[hi,hj]=zwHome(h,k),c=zwCell(hi,hj),full=ZW_FULL[t];const own=zwCrowdT&&zwCrowdT[t]?zwCrowdT[t]:null;const score=cc=>zwCap(t,cc)*full-(own?own[cc]-(cc===c?h.n:0):0);
 const here=score(c),capHere=zwCap(t,c);if(capHere>=.3&&here>=0)return null;
 const ci=c%ZW_CN,cj=(c/ZW_CN)|0;let best=-1,bs=here+2;
 for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){if(!di&&!dj)continue;const a=ci+di,b=cj+dj;if(a<0||b<0||a>=ZW_CN||b>=ZW_CN)continue;const cc=b*ZW_CN+a;const sc=score(cc)-Math.hypot(di,dj)*.8;if(sc>bs){bs=sc;best=cc}}
 if(best<0)return null;const spot=zwPlaceIn(t,best,(ZW_FEAR[t]?ZW_FEAR[t].b:0)+4);if(!spot)return null;
 const from=typeof regionAt==='function'?regionAt(hi,hj):null,to=typeof regionAt==='function'?regionAt(spot[0],spot[1]):null;
 if(own){own[c]-=h.n;own[best]+=h.n}h.hi=spot[0];h.hj=spot[1];h.tx=tcx(spot[0]);h.tz=tcx(spot[1]);h.migD=d;h.moved=d;
 const why=zwQuiet[c]<.4?'ludzie':zwForest[c]>=0&&zwForest[c]<.45&&ZW_FOREST[t]&&ZW_FOREST[t](0)<.5?'las':'ciasno';
 return from&&from.known&&to!==from&&h.n>=3?{t,from,to,why}:null}
function zwMapDaily(){zwMap();zwCrowdBuild();const d=Math.floor(S.day);let note=null;const order=S.herds.map((h,k)=>k).sort((a,b)=>((a*7919+d)%97)-((b*7919+d)%97));let moved=0;
 for(const k of order){if(moved>=16)break;const h=S.herds[k];const r=zwMigrate(h,k);if(h.migD===d)moved++;if(r&&!note)note=r}
 if(note&&S.zwLogD!==d){S.zwLogD=d;log(`${ZW_PL[note.t]} z krainy ${note.from.name}${note.to&&note.to.name?' w stronę krainy '+note.to.name:''}. ${{ludzie:'Za blisko tam ludzi, ścieżek i polowań.',las:'Wycięto tam las.',ciasno:'Za ciasno im tam było.'}[note.why]}`)}}
window.__przyroda={zwMap,zwCap,zwMigrate,zwMapDaily,zwCell,get quiet(){return zwQuiet},get forest(){return zwForest},get hab(){return zwHab},ZW_FEAR,zwBuild,zwD,zwCheck,zwRehome,zwDaily,zwAvoid,zwFlight,zwHome,zwPestTarget,get dist(){return zwDist}};
