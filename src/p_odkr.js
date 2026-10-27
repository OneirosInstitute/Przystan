
/* ================= 3.2: odkrycia na wyspie ================= */
RN.sol='Sól';RN.bursztyn='Bursztyn';RN.wegiel='Węgiel';
IC.sol='<path d="M7 9h10l1 11H6z"/><path d="M9 9c0-2 1-4 3-5 2 1 3 3 3 5"/><path d="M9 14h6"/>';
IC.bursztyn='<path d="M12 3l6 7-6 11-6-11z"/><path d="M6 10h12"/><path d="M12 3v18"/>';
const ODK_T={
 kury:{q:'Gdakanie w zaroślach',n:['Kurza Gęstwina'],r:6,d:'Zdziczałe kury z ładowni statku. W kurniku dadzą jaja i pierze.',
  find:p=>`${p.name} idzie za gdakaniem w gęstwinę i staje jak ${gw(p,'wryty','wryta')}: kury! Chude, płochliwe, z rudym kogutem na czele. To kury z ładowni, przeżyły na wyspie. W kurniku dałoby się je trzymać.`},
 tok:{q:'Polana na wrzosowisku',n:['Tokowisko','Cietrzewia Polana'],r:4,d:'Wiosną o świcie tokują tu cietrzewie. Myśliwi przynoszą mięso i pióra.',
  find:p=>`Na polanie wśród wrzosów ${p.name} widzi wydeptane kręgi i czarne pióra z lirowatych ogonów. Tokowisko cietrzewi: wiosną o świcie samce tańczą tu i bulgoczą, a myśliwi mają łatwą zdobycz.`},
 lis:{q:'Nory pod skarpą',n:['Lisie Jamy','Rude Nory','Lisia Skarpa','Lisi Pagór'],r:4,d:'Jesienią i zimą myśliwi zastawiają tu sidła: lisie futro jest najcieplejsze. Lisy z tych nor podchodzą do kurników.',
  find:p=>`Pod skarpą ${p.name} znajduje nory z wydeptanymi ścieżkami i kośćmi przy wejściu. Lisie jamy. Zimą lis ma najgęstsze futro, a sidła przy norach rzadko zostają puste.`},
 wilk:{q:'Wykrot w borze',n:['Wilczy Dół','Wilczy Wykrot','Wilcza Jama'],r:4,d:'Wilcze legowisko. Wiosną wadera rodzi tu szczenięta.',
  find:p=>`Pod korzeniami wywróconego świerka ${p.name} widzi wydeptaną jamę i kłaki szarej sierści. Wilcze legowisko. Wiosną wadera rodzi tu szczenięta.`},
 wegiel:{q:'Czarne skały',n:['Czarny Jar','Węglowa Skarpa'],r:4,d:'Wychodnia węgla kamiennego. Odkrywka da węgiel dla kuźni i na opał, aż żyła się wyczerpie.',
  find:p=>`W jarze ${p.name} odłupuje kawałek czarnej, błyszczącej skały. Wieczorem kamień wrzucony do ogniska rozżarza się i pali długo, równym, gorącym płomieniem. Węgiel kamienny!`},
 torf:{q:'Brunatne mokradło',n:['Torfowe Błota','Czarne Bagno','Brunatne Torfy'],r:4.5,d:'Torfowisko. Kopanka torfu daje opał bez ścinania lasu, ale nie zimą.',
  find:p=>`${p.name} wycina łopatą darń z brunatnego mokradła. Pod spodem czarna, włóknista ziemia, która po wysuszeniu pali się jak drewno. Torf. Opał bez ścinania lasu.`},
 sol:{q:'Źródło, gdzie piją sarny',n:['Słone Źródło'],r:3.5,d:'Słona woda. Warzelnia wygotuje z niej sól: mięso i ryby psują się wolniej.',
  find:p=>`Przy źródle, do którego schodzą się sarny, ${p.name} nabiera wody w dłonie. Słona! Na kamieniach dokoła biały nalot. Gdyby ją wygotować w panwi, byłaby sól.`},
 bursztyn:{q:'',n:['Bursztynowy Brzeg','Złota Plaża'],r:9,d:'Po sztormach morze wyrzuca tu bursztyn. Zbieracze i rybacy z okolicy przynoszą go do osady.',
  find:p=>`Po sztormie ${p.name} idzie brzegiem i podnosi z wodorostów miodowe grudki, lekkie i ciepłe w dłoni. Bursztyn! Morze wyrzuca go po każdym większym sztormie.`},
 kapusta:{q:'Zielone kępy na klifie',n:['Kapuściany Klif'],r:4,d:'Dzika kapusta i rzepa. Odkąd ktoś przyniósł nasiona, można je siać na polach.',
  find:p=>`Na klifie nad morzem ${p.name} zrywa sinozielone liście z mięsistym głąbem. Dzika kapusta, gorzka, ale jadalna. Obok rośnie dzika rzepa. Gdyby wziąć nasiona i siać na polu, urosłyby słodsze.`}};
// ---------- miejsca: z ziarna wyspy, zawsze te same ----------
const ODK=[];
// 4.5: miejsca dawnej wyspy losowane jak dawniej, we współrzędnych dawnej wyspy; numery (id) bez zmian
(function odkGen(){const N=N0,land=LEG.land,beach=LEG.beach,reach=reach0,biomeOf=LEG.biomeOf,forestF=LEG.forestF,tileH=LEG.tileH,tileHH=LEG.tileHH,slope=LEG.slope,tcx=LEG.tcx,camp={i:CAMP0.i,j:CAMP0.j},herdsDef=HERDS0;
 const R0=rng(SEED*7+515);const dc=(i,j)=>Math.hypot(i-camp.i,j-camp.j);const ok=(i,j)=>i>3&&j>3&&i<N-4&&j<N-4&&land[j*N+i]&&reach[j*N+i];
 const used=[[camp.i,camp.j]];const far=(i,j,d)=>used.every(u=>Math.hypot(u[0]-i,u[1]-j)>=d);
 const nearB=(i,j,r)=>{for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<N&&y<N&&(beach[y*N+x]||!land[y*N+x]))return true}return false};
 const wetN=(i,j,r)=>{let n=0;for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<N&&y<N&&land[y*N+x]&&biomeOf(x,y)==='wet')n++}return n};
 const add=(t,i,j)=>{used.push([i,j]);ODK.push({id:ODK.length,t,i,j,x:tcx(i),z:tcx(j),rot:R0()*6.28})};
 const pick=(t,cnt,test,dmin,dmax,sep,test2)=>{let made=0;for(let pass=0;pass<4&&made<cnt;pass++){const lo=dmin*(1-Math.min(2,pass)*.3),hi=dmax*(1+Math.min(2,pass)*.5),T=pass===3&&test2?test2:test;
  for(let k=0;k<26000&&made<cnt;k++){const i=(R0()*N)|0,j=(R0()*N)|0;if(!ok(i,j))continue;const d=dc(i,j);if(d<lo||d>hi||!far(i,j,sep)||!T(i,j))continue;add(t,i,j);made++}}};
 pick('kury',1,(i,j)=>{const b=biomeOf(i,j),f=forestF(i+.5,j+.5);return!beach[j*N+i]&&(b==='decid'||b==='meadow')&&f>.36&&f<.6},12,26,6);
 pick('kapusta',1,(i,j)=>!beach[j*N+i]&&nearB(i,j,3)&&tileH(i,j)>1.5,14,55,12,(i,j)=>!beach[j*N+i]&&nearB(i,j,4)&&tileH(i,j)>.5);
 pick('sol',1,(i,j)=>!beach[j*N+i]&&biomeOf(i,j)!=='high'&&(nearB(i,j,7)||biomeOf(i,j)==='wet')&&slope(i,j)<.6,20,55,15);
 pick('torf',2,(i,j)=>biomeOf(i,j)==='wet'&&wetN(i,j,4)>=18,18,75,25);
 pick('wegiel',2,(i,j)=>{const h=tileHH(i,j);return biomeOf(i,j)==='high'&&h>.3&&h<.85&&slope(i,j)>.3},30,80,30,(i,j)=>{const b=biomeOf(i,j),h=tileHH(i,j);return(b==='high'||b==='conif')&&h>.25&&slope(i,j)>.2});
 pick('tok',2,(i,j)=>{const b=biomeOf(i,j);return(b==='high'&&slope(i,j)<.6)||(b==='conif'&&forestF(i+.5,j+.5)<.5)},25,65,30);
 pick('bursztyn',2,(i,j)=>!!beach[j*N+i],15,60,30);
 // nory i legowiska przy stadach lisów i wilków
 const den=(type,t,cnt)=>{let m=0;for(const h of herdsDef){if(h.type!==type||m>=cnt)continue;for(let k=0;k<60;k++){const i=h.i+((R0()*7)|0)-3,j=h.j+((R0()*7)|0)-3;if(ok(i,j)&&!beach[j*N+i]&&far(i,j,6)){add(t,i,j);m++;break}}}};
 den('lis','lis',4);den('wilk','wilk',3);
 for(const o of ODK){o.i+=OFF;o.j+=OFF}})();
const odkSt=o=>S&&S.odk&&S.odk[o.id];
const odkFound=t=>!!(S&&S.odk&&ODK.some(o=>o.t===t&&S.odk[o.id]&&S.odk[o.id].s===2));
const odkName=o=>{const st=odkSt(o);return st&&st.nm?st.nm:ODK_T[o.t].n[0]};
function odkInit(){if(!S)return;S.odk=S.odk||{};['sol','bursztyn','pierze','jaja'].forEach(k=>{if(!(S.res[k]>=0))S.res[k]=0})}
// ---------- odkrycie ----------
function odkFind(o,p){odkInit();const st=S.odk[o.id]||(S.odk[o.id]={s:1,d:S.day});if(st.s===2)return;st.s=2;st.d=S.day;
 const same=ODK.filter(q=>q.t===o.t&&S.odk[q.id]&&S.odk[q.id].s===2&&q!==o).length;const N0=ODK_T[o.t].n;st.nm=N0[same%N0.length];
 if(o.t==='kury'){S.know.kury='tak';st.n=9;S.atlas&&(S.atlas.kura=1)}if(o.t==='wegiel'){S.know.wegiel_k='tak';st.left=600}if(o.t==='torf')S.know.torf='tak';if(o.t==='sol')S.know.sol='tak';
 if(o.t==='kapusta'){S.know.warzywa='tak';if(S.atlas)S.atlas.kapusta=1}if(o.t==='tok'&&S.atlas)S.atlas.cietrzew=1;if(o.t==='bursztyn'){S.know.burszt='tak';st.amt=0}
 log(ODK_T[o.t].find(p||{name:'Ktoś'})+` Ludzie mówią na to miejsce: ${st.nm}.`);toast('Odkrycie: '+st.nm);try{techXp('nauka',12)}catch(e){}
 S.people.forEach(q=>{if(q.odkT===o.id&&!q.odkPup)q.odkT=null});odkKeys();odkLblDirty=true}
function odkKeys(){if(!S)return;if(S.know.torf==='tak'&&!BKEYS.includes('torfowisko'))BKEYS.push('torfowisko')}
{const _ek=e2Keys;e2Keys=function(){_ek();odkKeys()}}
let odkT=0;const odkRev=o=>revAt(o.i,o.j);
function odkTick(){if(!S)return;odkInit();const t=tod(),sea=seasonIdx();
 for(const o of ODK){let st=S.odk[o.id];const rv=odkRev(o);
  if(!st&&rv&&o.t!=='bursztyn'){st=S.odk[o.id]={s:1,d:S.day};odkLblDirty=true}
  if(st&&st.s===2){if(o.t==='wilk'){const pp=S.people.find(p=>p.odkPup&&p.odkT===o.id&&p.state!=='away'&&Math.hypot(p.x-o.x,p.z-o.z)<ODK_T.wilk.r);if(pp)odkPupTry(o,pp)}continue}
  const R=ODK_T[o.t].r;let who=null;
  for(const p of S.people){if(p.state==='away'||p.state==='sleep'||p.age<6)continue;const d=Math.hypot(p.x-o.x,p.z-o.z);if(d>R+(o.t==='kury'&&t>T0&&t<.5?3:0))continue;who=p;break}
  if(!who)continue;
  if(o.t==='bursztyn'&&!(S.lastStorm!==undefined&&S.day-S.lastStorm<2.2))continue;
  odkFind(o,who)}
 // wysłani, którzy błądzą zbyt długo, wracają
 S.people.forEach(p=>{if(p.odkT!=null&&S.day-(p.odkD||0)>2){p.odkT=null;p.odkPup=0}})}
// ---------- wysłanie kogoś do miejsca ----------
function odkSend(o,pup){const ad=S.people.filter(p=>isAdult(p)&&isWorker(p)&&p.state!=='away'&&p.job!=='wyp'&&p.odkT==null&&!p.hurt);if(!ad.length){toast('Nie ma kogo posłać');return null}
 const sc=p=>(pup?(p.sk.mysliwy||0)*3:0)+(p.job==='zwiad'?6:p.job==='rob'||p.job==='bud'?3:0)-Math.hypot(p.x-o.x,p.z-o.z)*.02+(p.hp||1);
 const p=ad.sort((a,b)=>sc(b)-sc(a))[0];p.odkT=o.id;p.odkD=S.day;p.odkPup=pup?1:0;
 const nm=odkSt(o)&&odkSt(o).s===2?odkName(o):ODK_T[o.t].q.toLowerCase();log(pup?`${p.name} idzie do legowiska po wilcze szczenięta. Bierze oszczep i worek.`:`${p.name} idzie sprawdzić: ${nm}.`);toast(`${p.name} wyrusza`);return p}
{const _pj=planJob;planJob=function(p){if(p.odkT!=null&&S&&!p.fireB&&isWork()&&p.state!=='away'&&isAdult(p)){const o=ODK[p.odkT];if(o){const st=nearestWalk(o.i,o.j);if(st&&go(p,st,'odk',null)){p.act=p.odkPup?'idzie do wilczego legowiska':'idzie zobaczyć, co tam jest';return true}}p.odkT=null}
  // zwiadowcy sami zaglądają do zagadkowych miejsc
  if(p.job==='zwiad'&&S&&isWork()&&Math.random()<.15){const o=ODK.filter(o=>{const st=odkSt(o);return st&&st.s===1}).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];
   if(o&&Math.hypot(o.x-p.x,o.z-p.z)<45){const st=nearestWalk(o.i,o.j);if(st&&go(p,st,'odk',null)){p.act='idzie sprawdzić, co tam jest';return true}}}
  const r=_pj(p);if(!r&&p.job==='wb'&&S){const b=bById(p.wb);if(b&&b.kind==='kurnik'&&bDone(b))return kurJob(p,b)}return r}}
{const _oa=onArrive;onArrive=function(p){const a=p.after;if(a==='odk'){p.after=null;p.state='idle';p.wait=1.5;p.act='rozgląda się';return}
  if(a==='kurlap'){p.after=null;p.wt=0;p.state='work';p.workKind='kurlap';return}if(a==='kurdom'){p.after=null;const b=bById(p.kurB);if(b&&p.kurN){b.hens=Math.min(KUR_CAP,(b.hens||0)+p.kurN);kurVisDirty=true}p.kurN=0;p.state='idle';p.wait=.5;return}return _oa(p)}}
// wyprawa przynosi wieści o miejscach w swojej krainie
{const _fe=finishExp;finishExp=function(e,out){const r0=e.r,typ=e.type,ppl=out.slice();_fe(e,out);if(!S)return;const al=ppl.filter(p=>S.people.includes(p));if(!al.length)return;
  ODK.forEach(o=>{const st=odkSt(o);if((st&&st.s===2)||o.t==='bursztyn'||REGION[o.j*N+o.i]!==r0)return;if(Math.random()<(typ==='zwiad'?.6:.3))odkFind(o,al[(Math.random()*al.length)|0])})}}
// ---------- wilcze szczenięta ----------
function odkPupOk(o){const st=odkSt(o);const yd=yday();return st&&st.s===2&&yd>=72&&yd<92&&st.py!==Math.floor(S.day/YEAR)}
function odkPupTry(o,p){if(!p.odkPup||p.odkT!==o.id)return;const st=odkSt(o);p.odkT=null;p.odkPup=0;if(!odkPupOk(o)){log(`${p.name} wraca od legowiska z pustymi rękami: w jamie nikogo nie ma.`);return}st.py=Math.floor(S.day/YEAR);
 const dogs=typeof dogsOk==='function'?dogsOk().length:0;if(Math.random()<.28*(dogs?.6:1)*(p.trait==='Ostrożny'?.5:1)){p.hp=Math.max(.15,p.hp-.4);p.hurt=1;log(`Wadera wraca do jamy, zanim ${p.name} zdąży odejść. Pogryziona ręka, podarty kożuch, ale szczenięta są w worku.`)}
 else log(`${p.name} wyciąga z jamy szczenięta, póki wadera poluje. Piszczą w worku całą drogę do osady.`);try{wolfPups(2+((Math.random()*2)|0))}catch(e){}}
// ---------- kurnik ----------
const KUR_CAP=12;let kurVisDirty=true;
const odkFlock=()=>ODK.find(o=>o.t==='kury'&&odkSt(o)&&odkSt(o).s===2&&(odkSt(o).n||0)>0);
function kurJob(p,b){const e=entryOf(b.kind,b.i,b.j);const fl=odkFlock();
 if((b.hens||0)<KUR_CAP&&fl&&isWork()){const st=nearestWalk(fl.i,fl.j);if(st&&go(p,st,'kurlap',null)){p.kurB=b.id;p.act='łapie kury w gęstwinie';return true}}
 if(e&&go(p,e,'care',b)){p.act=(b.hens||0)?'karmi kury i zbiera jaja':'ścieli grzędy i czeka na kury';return true}return false}
{const _sp=stepPerson;stepPerson=function(p,dt){if(p.state!=='work'||p.workKind!=='kurlap')return _sp(p,dt);const fl=odkFlock(),b=bById(p.kurB);if(!fl||!b){p.state='idle';return}
  p.wt+=dt*eff(p)*craftEff(p,'hodowca');gainXp(p,'hodowca',dt);p.act='łapie kury w gęstwinie';if(p.wt<10)return;p.wt=0;
  if(Math.random()<.45){p.state='idle';p.wait=.5;return}const st=odkSt(fl);const n=Math.min(1+((Math.random()*2)|0),st.n,KUR_CAP-(b.hens||0));if(n<=0){p.state='idle';return}st.n-=n;p.kurN=n;
  if(!S.seen.kur1){S.seen.kur1=1;log(`${p.name} wraca z gęstwiny z kurami pod pachą. Pierwsze kury w kurniku.`);toast('Pierwsze kury w kurniku')}
  const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'kurdom',null)){p.act='niesie kury do kurnika'}else{b.hens=Math.min(KUR_CAP,(b.hens||0)+n);p.kurN=0;p.state='idle'}}}
function kurDaily(){const sea=seasonIdx();
 // dzikie stado powoli się odradza
 const fl=ODK.find(o=>o.t==='kury'&&odkSt(o)&&odkSt(o).s===2);if(fl&&(sea===0||sea===3)&&odkSt(fl).n<9&&Math.random()<.3)odkSt(fl).n++;
 S.bld.forEach(b=>{if(b.kind!=='kurnik'||!bDone(b))return;let h=b.hens||0;if(!h)return;const care=S.people.some(p=>p.job==='wb'&&p.wb===b.id);
  let eg=h*.22*K*[1,.65,.25,1.1][sea]*(care?1:.55);if(sea===2){const need=h*.06*K;if(S.res.ziarno>=need+10){S.res.ziarno-=need}else{eg=0;if(Math.random()<.2){h--;log('Zimą zabrakło ziarna dla kur. Jedna nie przeżyła mrozu.')}}}
  S.res.jaja=(S.res.jaja||0)+eg;S.res.pierze=(S.res.pierze||0)+h*.025*K;
  if((sea===3||sea===0)&&h>=3&&h<KUR_CAP&&Math.random()<.28){const n=Math.min(KUR_CAP-h,1+((Math.random()*2)|0));h+=n;if(!S.seen['kwoka'+Math.floor(S.day/YEAR)]){S.seen['kwoka'+Math.floor(S.day/YEAR)]=1;log('Kwoka wysiedziała pisklęta. Po kurniku drepczą żółte kulki.')}}
  const c=bCenter(b),fox=S.herds.some(x=>x.type==='lis'&&x.n>0&&Math.hypot(x.x-c.x,x.z-c.z)<32);const trap=ODK.some(o=>o.t==='lis'&&odkSt(o)&&odkSt(o).s===2&&Math.hypot(o.x-c.x,o.z-c.z)<40)&&S.bld.some(m=>m.kind==='mysliwy'&&bDone(m));
  if(Math.random()<(fox?.07:.015)*(trap?.5:1)*(typeof dogGuard==='function'?dogGuard():1)*(care?.8:1)){const n=Math.min(h,fox?1+((Math.random()*2)|0):1);h-=n;
   log(fox?`Lis zakradł się nocą do kurnika: ${n===1?'jedna kura mniej':n+' kury mniej'}. Pod płotem świeżo wykopana nora.`:'Jastrząb spadł z nieba na wybieg i porwał kurę.')}
  b.hens=h;kurVisDirty=true})}
// ---------- dzień: tokowisko, sidła, bursztyn, sól, pierzyny ----------
function odkDaily(){if(!S)return;odkInit();const sea=seasonIdx(),k=S.weather.k,y=Math.floor(S.day/YEAR);
 const hunters=(o,r)=>S.bld.some(b=>b.kind==='mysliwy'&&bDone(b)&&Math.hypot(bCenter(b).x-o.x,bCenter(b).z-o.z)<r&&S.people.some(p=>p.job==='wb'&&p.wb===b.id));
 ODK.forEach(o=>{const st=odkSt(o);if(!st||st.s!==2)return;
  if(o.t==='tok'&&sea===3&&hunters(o,34)){S.res.mieso=(S.res.mieso||0)+3;S.res.pierze=(S.res.pierze||0)+2;if(!S.seen['tok'+y]){S.seen['tok'+y]=1;log('Myśliwi wracają o świcie z tokowiska z cietrzewiami na kiju. Mięso i czarne pióra.')}}
  if(o.t==='lis'&&(sea===1||sea===2)&&hunters(o,32)){S.res.skory=(S.res.skory||0)+.7;if(!S.seen['sidla'+y]){S.seen['sidla'+y]=1;log('Myśliwi zastawiają sidła przy lisich jamach. Zimowe lisie futro jest najcieplejsze.')}}
  if(o.t==='bursztyn'&&(k==='storm'||k==='wiatr')){st.amt=(st.amt||0)+2+Math.random()*4;
   if(S.bld.some(b=>(b.kind==='zbieracz'||b.kind==='pomost')&&bDone(b)&&Math.hypot(bCenter(b).x-o.x,bCenter(b).z-o.z)<44)){const n=Math.round(st.amt);if(n>0){S.res.bursztyn=(S.res.bursztyn||0)+n;st.amt=0;if(!S.seen['bursz'+Math.floor(S.day)])log(`Po sztormie zbieracze chodzą brzegiem i przynoszą ${n} ${plW(n,'grudkę','grudki','grudek')} bursztynu.`);S.seen['bursz'+Math.floor(S.day)]=1}}}});
 // zbieracze i rybacy chodzą po sztormie brzegiem: tak znajdują bursztyn
 if(k==='storm'||k==='wiatr'||(S.lastStorm!==undefined&&S.day-S.lastStorm<1.2))ODK.forEach(o=>{if(o.t!=='bursztyn'||odkSt(o)&&odkSt(o).s===2)return;const b=S.bld.find(b=>(b.kind==='zbieracz'||b.kind==='pomost')&&bDone(b)&&Math.hypot(bCenter(b).x-o.x,bCenter(b).z-o.z)<44);
  if(!b||Math.random()>.6)return;const p=S.people.find(q=>q.job==='wb'&&q.wb===b.id)||S.people.find(isAdult);if(p){odkFind(o,p);odkSt(o).amt=3+Math.random()*3}});
 // bursztyn: korale na święta i wesela, ludzie się cieszą
 if((S.res.bursztyn||0)>=3)S.wh=(S.wh||0)+.0015*Math.min(1,S.res.bursztyn/20);
 // pierzyny: zimą ciepłe posłania, domy palą mniej
 if(sea===2&&(S.res.pierze||0)>=20&&!(S.e2&&S.e2.r2==='skaly')){const hh=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;S.res.opal+=K*.05*hh;if(!S.seen['pierz'+y]){S.seen['pierz'+y]=1;log('Z pierza uszyto pierzyny. Pod nimi zimowe noce są cieplejsze, domy palą mniej opału.')}}
 // sól: zjadana z mięsem i rybą
 if((S.res.sol||0)>0)S.res.sol=Math.max(0,S.res.sol-K*.004*((S.res.mieso||0)+(S.res.ryby||0))/10);
 // pianie koguta: wskazówka, że kury żyją
 const kq=ODK.find(o=>o.t==='kury');if(kq&&!odkSt(kq)&&S.day>3+((SEED%5))&&!S.seen.kogut){S.seen.kogut=1;reveal(kq.i,kq.j,3);S.odk[kq.id]={s:1,d:S.day};odkLblDirty=true;log('O świcie od strony lasu ktoś słyszy pianie koguta. Czyżby kury z ładowni przeżyły?')}
 kurDaily()}
{const _ad=actDaily;actDaily=function(){_ad();if(!S)return;try{odkDaily()}catch(e){console.warn(e)}}}
// sól w spiżarni: mięso i ryby psują się wolniej
// Dzienna aktualizacja: p_daily.js (jedna jawna kolejność).
// ---------- nowe budowle ----------
Object.assign(BD,{kurnik:{cat:'uprawa',n:'Kurnik',w:2,h:2,cost:{drewno:14,deski:4},work:6,wk:1,c:'hodowca',need:'kury',d:'Kurnik na palach z grzędami i wybiegiem. Hodowca łapie w gęstwinie zdziczałe kury i trzyma je tu: jaja przez większą część roku, pierze na pierzyny. Zimą kury jedzą ziarno. Lisy podchodzą nocą.'},
 odkrywka:{cat:'surowce',n:'Odkrywka węgla',w:2,h:2,cost:{drewno:16,deski:6,narz:1},work:8,wk:2,c:'kamieniarz',need:'wegiel_k',site:'wegiel',prod:[{in:{},out:{wegiel:2},t:14,target:80},{in:{},out:{opal:3},t:12,target:260}],d:'Wykop w czarnej skale. Węgiel kamienny dla kuźni, a gdy go dość, na opał: pali się dłużej niż drewno. Żyła kiedyś się wyczerpie. Stawia się ją przy odkrytej wychodni węgla.'},
 warzelnia:{cat:'przetw',n:'Warzelnia soli',w:2,h:2,cost:{drewno:12,glina:10,kamien:6},work:7,wk:1,c:'zbieracz',need:'sol',site:'sol',prod:{in:{opal:2},out:{sol:2},t:16,target:60},d:'Szałas nad słonym źródłem, gliniane panwie i ogień pod nimi. Z solanki wytrąca się sól: mięso i ryby psują się prawie o połowę wolniej. Stawia się ją przy słonym źródle.'}});
['kurnik','odkrywka','warzelnia'].forEach(k=>{if(!BKEYS.includes(k))BKEYS.push(k)});
Object.assign(E2ACT,{odkrywka:'kopie węgiel',warzelnia:'warzy sól'});Object.assign(SIGNK,{odkrywka:'wegiel',warzelnia:'sol',kurnik:'jaja'});
const ODK_WHERE={odkrywka:'odkrywka musi stać przy odkrytej wychodni węgla',warzelnia:'warzelnia musi stać przy słonym źródle',torfowisko:'kopanka musi stać przy odkrytym torfowisku'};
function odkNear(t,i,j,w,h,r){const cx=i+w/2,cy=j+h/2;return ODK.some(o=>o.t===t&&odkSt(o)&&odkSt(o).s===2&&Math.hypot(o.i-cx,o.j-cy)<=r)}
const odkNeedWhere=k=>k==='odkrywka'||k==='warzelnia'||(k==='torfowisko'&&!(S&&S.tech&&S.tech.e2_bagna));
{const _cp=checkPlace;checkPlace=function(kind,i,j){if(!_cp(kind,i,j))return false;const d=BD[kind];if(!S)return true;
  if(d.site&&!odkNear(d.site,i,j,d.w,d.h,7))return false;if(kind==='torfowisko'&&!(S.tech&&S.tech.e2_bagna)&&!odkNear('torf',i,j,d.w,d.h,10))return false;return true}}
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);if(!placing||!odkNeedWhere(placing)||!ghostTile)return;const ok=checkPlace(placing,ghostTile[0],ghostTile[1]);const el=$('pinfo');if(!ok&&el)el.innerHTML=el.innerHTML.replace(/<span class="no">[^<]*<\/span>/,`<span class="no">Tu nie da się budować: ${ODK_WHERE[placing]}</span>`)}}
{const _tp=tryPlace;tryPlace=function(){if(placing&&odkNeedWhere(placing)&&ghostTile&&!checkPlace(placing,ghostTile[0],ghostTile[1])){const d=BD[placing];if(d.site?!odkNear(d.site,ghostTile[0],ghostTile[1],d.w,d.h,7):!odkNear('torf',ghostTile[0],ghostTile[1],d.w,d.h,10)){toast('Tu nie da się budować: '+ODK_WHERE[placing]);return}}return _tp()}}
// odkrywka: żyła się wyczerpuje
const odkVein=b=>{const c=bCenter(b);return ODK.filter(o=>o.t==='wegiel'&&odkSt(o)&&odkSt(o).s===2).sort((a,c2)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(c2.x-c.x,c2.z-c.z))[0]};
{const _gm=gospMade;gospMade=function(b,r,v){const x=_gm(b,r,v);if(S&&b&&b.kind==='odkrywka'){const o=odkVein(b);if(o){const st=odkSt(o);st.left=Math.max(0,(st.left===undefined?600:st.left)-v);if(st.left<=0&&!st.exh){st.exh=1;log(`Żyła węgla w miejscu ${odkName(o)} się wyczerpała. Na wyspie mogą być inne czarne skały.`);toast('Żyła węgla wyczerpana')}}}return x}}
{const _pj=planJob;planJob=function(p){if(p.job==='wb'&&S){const b=bById(p.wb);if(b&&b.kind==='odkrywka'&&bDone(b)){const o=odkVein(b);if(!o||odkSt(o).left<=0){p.act='żyła wyczerpana';return false}}}return _pj(p)}}
// ---------- modele budowli ----------
const sRGBo=(r,g,b)=>new THREE.Color().setRGB(r,g,b,THREE.SRGBColorSpace);
function henGeo(){return mdMerge([[new THREE.SphereGeometry(.07,7,5),sRGBo(.62,.36,.18),mdM(0,.08,0,0,0,0,.9,.8,1.25)],[new THREE.SphereGeometry(.04,6,4),sRGBo(.58,.32,.16),mdM(0,.14,.08)],
 [new THREE.ConeGeometry(.045,.1,5),sRGBo(.2,.18,.16),mdM(0,.13,-.09,-.9)],[new THREE.BoxGeometry(.012,.03,.035),sRGBo(.8,.15,.12),mdM(0,.18,.085)],[new THREE.ConeGeometry(.012,.03,4),sRGBo(.85,.65,.2),mdM(0,.135,.125,Math.PI/2)],
 [new THREE.CylinderGeometry(.006,.006,.05,3),sRGBo(.8,.6,.25),mdM(.025,.02,0)],[new THREE.CylinderGeometry(.006,.006,.05,3),sRGBo(.8,.6,.25),mdM(-.025,.02,0)]])}
function cietGeo(){return mdMerge([[new THREE.SphereGeometry(.08,7,5),sRGBo(.08,.08,.1),mdM(0,.1,0,0,0,0,.9,.8,1.3)],[new THREE.SphereGeometry(.045,6,4),sRGBo(.09,.09,.12),mdM(0,.17,.1)],[new THREE.BoxGeometry(.03,.012,.02),sRGBo(.8,.12,.1),mdM(0,.2,.11)],
 [new THREE.ConeGeometry(.03,.12,4),sRGBo(.1,.1,.12),mdM(.05,.17,-.13,-.6,0,.5)],[new THREE.ConeGeometry(.03,.12,4),sRGBo(.1,.1,.12),mdM(-.05,.17,-.13,-.6,0,-.5)],[new THREE.SphereGeometry(.04,5,4),sRGBo(.92,.92,.9),mdM(0,.12,-.1,0,0,0,1,.7,.6)]])}
const ODKG={};const odkG=(k,f)=>ODKG[k]||(ODKG[k]=f());
function kurnikModel(g){g.add(tbox(1,.06,.8,mPlankD,0,.5,-.2));for(const[x,z]of[[-.42,-.52],[.42,-.52],[-.42,.12],[.42,.12]])g.add(cyl(.045,.5,matLog2,x,.25,z));
 g.add(tbox(.92,.5,.72,mPlank,0,.78,-.2,0,1.2));{const r=gable(.92,.72,.38,mThatch,1.03,.14);r.position.z=-.2;g.add(r)}g.add(tbox(.16,.18,.03,matDark,.18,.72,.17));
 const ramp=mesh(new THREE.BoxGeometry(.16,.03,.62),mPlankD,.18,.28,.42,-.75);g.add(ramp);for(let k=0;k<4;k++)g.add(tbox(.15,.02,.02,matDark,.18,.16+k*.1,.28+k*.1));
 for(let k=0;k<9;k++){const a=k/8*Math.PI;g.add(cyl(.025,.32,matDark,Math.cos(a)*.85,.16,.25+Math.sin(a)*.6,0,0,0,4))}g.add(cyl(.012,1.7,matWood,0,.3,.85,0,0,Math.PI/2,4));
 const hm=new THREE.InstancedMesh(odkG('hen',henGeo),MD.mat,8);hm.userData.noMerge=1;hm.castShadow=true;hm.count=0;g.add(hm);g.userData.hens=hm;
 const P=[];for(let k=0;k<8;k++)P.push([(Math.random()-.5)*1.2,.42+Math.random()*.4,Math.random()*6.28]);hm.userData.P=P;return 1}
function odkrywkaModel(g){g.add(mesh(new THREE.CylinderGeometry(.95,.8,.12,10),M(0x24221f),0,.02,0));
 for(let k=0;k<7;k++){const a=k*.9;g.add(mesh(new THREE.DodecahedronGeometry(.16+.05*(k%3),0),M(0x1a1a1d,{roughness:.45,metalness:.2}),Math.cos(a)*.62,.1,Math.sin(a)*.5))}
 g.add(mesh(new THREE.ConeGeometry(.42,.42,8),M(0x161618,{roughness:.4,metalness:.25}),-.35,.22,.35));
 g.add(cyl(.05,1.3,matLog2,.35,.62,-.25,0,0,.32),cyl(.05,1.3,matLog2,.9,.62,-.25,0,0,-.32),cyl(.035,.8,matLog2,.62,1.22,-.25,0,0,Math.PI/2));g.add(cyl(.12,.5,matWood,.62,1.15,-.25,0,0,Math.PI/2,8));
 barrel(g,-.7,-.55,.8);g.add(tbox(.5,.22,.32,mPlankD,.55,.12,.6));for(let k=0;k<4;k++)g.add(mesh(new THREE.BoxGeometry(.12,.1,.12),M(0x1c1c1e),.45+(k%2)*.14,.29,.55+((k>>1)*.12)));return 1}
function warzelniaModel(g){for(const[x,z]of[[-.7,-.5],[.7,-.5],[-.7,.5],[.7,.5]])g.add(cyl(.05,1.2,matLog2,x,.6,z));{const r=gable(1.5,1.1,.5,mThatch,1.2,.12);g.add(r)}
 g.add(tbox(1.1,.28,.55,matStone,0,.14,0,0,.9));g.add(tbox(.95,.06,.42,M(0x9a5a34),0,.3,0));g.add(tbox(.85,.02,.34,M(0xd8dcd8,{roughness:.5}),0,.335,0));
 g.add(mesh(new THREE.SphereGeometry(.09,6,4),M(0xff8a3a,{emissive:0xff6a20,emissiveIntensity:1.2}),0,.12,.3));
 for(let k=0;k<3;k++)g.add(mesh(new THREE.CylinderGeometry(.13,.15,.26,8),M(0xd9d2c0),-.95+k*.32,.13,.75));barrel(g,.95,.7,.8);
 g.add(mesh(new THREE.CylinderGeometry(.45,.5,.06,12),M(0x5a7078,{roughness:.2}),0,.02,-1.05));g.add(mesh(new THREE.TorusGeometry(.48,.06,4,14),M(0xe8e8e2),0,.04,-1.05,Math.PI/2));return 1}
{const _nm=newModel;newModel=function(kind,g){if(kind==='kurnik')return kurnikModel(g);if(kind==='odkrywka')return odkrywkaModel(g);if(kind==='warzelnia')return warzelniaModel(g);return _nm(kind,g)}}
{const _kc=kolChims;kolChims=function(ch){_kc(ch);if(!S)return;S.bld.forEach(b=>{if(!bDone(b)||(b.kind!=='warzelnia'&&b.kind!=='odkrywka'))return;const c=bCenter(b);if(Math.hypot(c.x-camT.x,c.z-camT.z)<45)ch.push([c.x+(b.kind==='odkrywka'?-.35:0)*(bMir(b)?-1:1),Hy(c.x,c.z)+(b.kind==='warzelnia'?1.6:.5),c.z+(b.kind==='odkrywka'?.35:0)])})}}
// ---------- miejsca w świecie ----------
function odkSiteGeo(t){const T=[];const C=sRGBo;const rnd=rng(t.length*97+3);
 if(t==='kury'){for(let k=0;k<6;k++){const a=k*1.05,r=.7+rnd()*.5;T.push([new THREE.IcosahedronGeometry(.42+rnd()*.2,1),C(.2+rnd()*.06,.32+rnd()*.06,.16),mdM(Math.cos(a)*r,.3,Math.sin(a)*r,0,0,0,1,.75,1)])}}
 else if(t==='tok'){T.push([new THREE.CircleGeometry(1.1,14),C(.55,.5,.36),mdM(0,.04,0,-Math.PI/2)]);for(let k=0;k<8;k++){const a=k*.8,r=1.3+rnd()*.4;T.push([new THREE.SphereGeometry(.22,6,4),C(.42,.3,.4),mdM(Math.cos(a)*r,.08,Math.sin(a)*r,0,0,0,1,.5,1)])}
  for(let k=0;k<5;k++)T.push([new THREE.PlaneGeometry(.05,.16),C(.08,.08,.1),mdM((rnd()-.5)*1.4,.06,(rnd()-.5)*1.4,-1.3,rnd()*6,0)])}
 else if(t==='lis'){T.push([new THREE.SphereGeometry(.7,10,6,0,6.283,0,1.4),C(.62,.5,.32),mdM(0,-.1,0,0,0,0,1,.55,1)]);for(const a of[0,2.2]){T.push([new THREE.CircleGeometry(.17,10),C(.06,.05,.04),mdM(Math.cos(a)*.55,.16,Math.sin(a)*.55,0,Math.PI/2-a,0)])}
  for(let k=0;k<3;k++)T.push([new THREE.CylinderGeometry(.015,.015,.18,4),C(.9,.88,.82),mdM(.8+rnd()*.3,.03,(rnd()-.5)*.6,Math.PI/2,rnd()*3,0)])}
 else if(t==='wilk'){T.push([new THREE.CylinderGeometry(.16,.2,2.4,7),C(.32,.24,.16),mdM(.3,.2,0,0,0,Math.PI/2)]);T.push([new THREE.CylinderGeometry(.7,.75,.16,10),C(.28,.2,.14),mdM(-.95,.62,0,0,0,Math.PI/2)]);
  T.push([new THREE.CircleGeometry(.32,10),C(.04,.03,.03),mdM(-.8,.28,0,0,-Math.PI/2,0)]);for(let k=0;k<5;k++){const a=k*1.2;T.push([new THREE.CylinderGeometry(.03,.01,.5,4),C(.3,.22,.15),mdM(-.95+Math.cos(a)*.1,.6+Math.sin(a)*.6,Math.cos(a)*.6,a,0,0)])}}
 else if(t==='wegiel'){for(let k=0;k<4;k++){const a=k*1.6+.4;T.push([new THREE.DodecahedronGeometry(.45+rnd()*.25,0),k%2?C(.12,.12,.13):C(.2,.19,.18),mdM(Math.cos(a)*.7,.35,Math.sin(a)*.6,rnd(),rnd(),rnd(),1,1.5,1)])}for(let k=0;k<7;k++){const a=k*.9,r=.3+rnd()*.7;T.push([new THREE.BoxGeometry(.6+rnd()*.5,.12+rnd()*.1,.4+rnd()*.3),k%3?C(.1,.1,.11):C(.32,.3,.27),mdM(Math.cos(a)*r,.08+(k%3)*.12,Math.sin(a)*r,rnd()*.3,rnd()*3,rnd()*.3)])}
  for(let k=0;k<6;k++)T.push([new THREE.DodecahedronGeometry(.08,0),C(.07,.07,.08),mdM((rnd()-.5)*1.6,.05,(rnd()-.5)*1.6)])}
 else if(t==='torf'){for(let k=0;k<3;k++){const a=k*2.1,r=.6+rnd()*.4;T.push([new THREE.CircleGeometry(.45+rnd()*.25,12),C(.16,.12,.08),mdM(Math.cos(a)*r,.03,Math.sin(a)*r,-Math.PI/2)])}
  for(let k=0;k<14;k++){const x=(rnd()-.5)*2.2,z=(rnd()-.5)*2.2;T.push([new THREE.CylinderGeometry(.006,.006,.3,3),C(.5,.5,.3),mdM(x,.15,z)]);T.push([new THREE.SphereGeometry(.045,5,4),C(.95,.95,.92),mdM(x,.32,z)])}}
 else if(t==='sol'){T.push([new THREE.CircleGeometry(.55,14),C(.32,.42,.46),mdM(0,.04,0,-Math.PI/2)]);T.push([new THREE.TorusGeometry(.62,.08,4,16),C(.9,.9,.86),mdM(0,.04,0,Math.PI/2)]);
  for(let k=0;k<4;k++){const a=k*1.6;T.push([new THREE.DodecahedronGeometry(.16,0),C(.75,.74,.7),mdM(Math.cos(a)*.85,.08,Math.sin(a)*.85)])}for(let k=0;k<8;k++){const a=k*.8+.3;T.push([new THREE.CylinderGeometry(.008,.01,.6,3),C(.45,.5,.3),mdM(Math.cos(a)*1.05,.3,Math.sin(a)*1.05,(rnd()-.5)*.3,0,(rnd()-.5)*.3)])}}
 else if(t==='kapusta'){for(let k=0;k<6;k++){const a=k*1.05,r=.4+rnd()*.6;T.push([new THREE.SphereGeometry(.16,7,5),C(.42,.55,.5),mdM(Math.cos(a)*r,.08,Math.sin(a)*r,0,0,0,1,.55,1)]);T.push([new THREE.CylinderGeometry(.01,.01,.4,3),C(.4,.5,.3),mdM(Math.cos(a)*r+.1,.2,Math.sin(a)*r)]);T.push([new THREE.SphereGeometry(.04,5,4),C(.92,.85,.3),mdM(Math.cos(a)*r+.1,.4,Math.sin(a)*r)])}}
 else return null;return mdMerge(T)}
const odkGrp=new THREE.Group();scene.add(odkGrp);const odkM={};let odkHenW=null,odkCiet=null,odkAmb=null;
function odkVisInit(){ODK.forEach(o=>{const g=odkG('s_'+o.t,()=>odkSiteGeo(o.t));if(!g)return;const m=new THREE.Mesh(g,MD.mat);m.position.set(o.x,Hy(o.x,o.z),o.z);m.rotation.y=o.rot;m.castShadow=true;m.receiveShadow=true;m.visible=false;odkGrp.add(m);odkM[o.id]=m});
 odkHenW=new THREE.InstancedMesh(odkG('hen',henGeo),MD.mat,6);odkHenW.count=0;odkHenW.castShadow=true;odkGrp.add(odkHenW);
 odkCiet=new THREE.InstancedMesh(odkG('ciet',cietGeo),MD.mat,10);odkCiet.count=0;odkGrp.add(odkCiet);
 odkAmb=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.05,0),new THREE.MeshStandardMaterial({color:0xe8962a,emissive:0xa04a08,emissiveIntensity:.6,roughness:.3}),24);odkAmb.count=0;odkGrp.add(odkAmb)}
const odkD=new THREE.Object3D();
function odkFrame(){if(!S||!odkHenW)return;const t=tod(),sea=seasonIdx();ODK.forEach(o=>{const m=odkM[o.id];if(m)m.visible=odkRev(o)&&(o.t!=='bursztyn')});
 // dzikie kury w gęstwinie
 const kq=ODK.find(o=>o.t==='kury');let n=0;if(kq&&odkRev(kq)){const st=odkSt(kq);const cnt=Math.min(6,st&&st.s===2?(st.n||0):6);for(let k=0;k<cnt;k++){const a=k*1.7+Math.sin(clock*.2+k)*.6,r=1.5+(k%3)*.35;const x=kq.x+Math.cos(a)*r,z=kq.z+Math.sin(a)*r;odkD.position.set(x,Hy(x,z),z);odkD.rotation.set(Math.max(0,Math.sin(clock*2.3+k*1.7))*.5,a+1.6,0);odkD.scale.setScalar(1.9);odkD.updateMatrix();odkHenW.setMatrixAt(n++,odkD.matrix)}}
 odkHenW.count=n;odkHenW.instanceMatrix.needsUpdate=true;
 // cietrzewie tokują wiosną o świcie
 n=0;if(sea===3&&t>T0-.06&&t<.4)ODK.forEach(o=>{if(o.t!=='tok'||!odkRev(o))return;for(let k=0;k<5&&n<10;k++){const a=k*1.26+clock*.15*(k%2?1:-1),r=.5+(k%3)*.25;const x=o.x+Math.cos(a)*r,z=o.z+Math.sin(a)*r;odkD.position.set(x,Hy(x,z)+Math.max(0,Math.sin(clock*4+k*2))*.12,z);odkD.rotation.set(0,a+Math.PI/2+Math.sin(clock*3+k)*.6,0);odkD.scale.setScalar(1.2);odkD.updateMatrix();odkCiet.setMatrixAt(n++,odkD.matrix)}});
 odkCiet.count=n;odkCiet.instanceMatrix.needsUpdate=true;
 // bursztyn połyskuje na plaży
 n=0;ODK.forEach(o=>{if(o.t!=='bursztyn')return;const st=odkSt(o);if(!st||st.s!==2||!odkRev(o))return;const c=Math.min(12,Math.round(st.amt||0)*2);const r0=rng(o.id*31+Math.floor((S.lastStorm||0)));for(let k=0;k<c&&n<24;k++){const x=o.x+(r0()-.5)*5,z=o.z+(r0()-.5)*5;odkD.position.set(x,Math.max(Hy(x,z),0)+.04,z);odkD.rotation.set(r0()*3,r0()*3,0);odkD.scale.setScalar(.8+r0()*.8);odkD.updateMatrix();odkAmb.setMatrixAt(n++,odkD.matrix)}});
 odkAmb.count=n;odkAmb.instanceMatrix.needsUpdate=true;
 // kury w kurnikach
 S.bld.forEach(b=>{if(b.kind!=='kurnik')return;const g=bMesh[b.id];const hm=g&&g.userData.hens;if(!hm)return;const P=hm.userData.P,c=Math.min(8,b.hens||0);for(let k=0;k<c;k++){const p=P[k];odkD.position.set(p[0]+Math.sin(clock*.3+k)*.08,0,p[1]);odkD.rotation.set(Math.max(0,Math.sin(clock*2.1+k*1.3))*.55,p[2]+Math.sin(clock*.4+k)*.5,0);odkD.scale.setScalar(1);odkD.updateMatrix();hm.setMatrixAt(k,odkD.matrix)}hm.count=c;hm.instanceMatrix.needsUpdate=true})}
// ---------- etykiety ----------
let odkLblDirty=true;const odkEl={};const odkV=new THREE.Vector3();
{const st=document.createElement('style');st.textContent=`.odk{position:absolute;transform:translate(-50%,-100%);font-family:var(--serif);font-style:italic;font-size:13.5px;color:#f1e6cc;text-shadow:0 1px 3px #000,0 0 8px #000a;white-space:nowrap;pointer-events:none;display:none}
.odk::before{content:'';display:inline-block;width:7px;height:7px;border-radius:2px;transform:rotate(45deg);background:#9ab88a;margin-right:6px;vertical-align:middle}.odk.q{color:#d8d2c0;opacity:.9}.odk.q::before{background:none;border:1px solid #d8c8a0;width:6px;height:6px}body.pre .odk{display:none!important}`;document.head.appendChild(st)}
function odkLbl(){if(!S)return;const op=Math.max(0,Math.min(1,(zoom-.75)/.3));
 ODK.forEach(o=>{const st=odkSt(o);let e=odkEl[o.id];if(!st||(o.t==='bursztyn'&&st.s!==2)){if(e)e.style.display='none';return}
  if(!e){e=document.createElement('div');e.className='odk';$('labels').appendChild(e);odkEl[o.id]=e}
  if(odkLblDirty||e._s!==st.s){e._s=st.s;e.classList.toggle('q',st.s!==2);e.textContent=st.s===2?odkName(o):ODK_T[o.t].q+'?'}
  if(op<=.02||!odkRev(o)){e.style.display='none';return}odkV.set(o.x,Hy(o.x,o.z)+1.2,o.z).project(cam);
  if(odkV.z>1||Math.abs(odkV.x)>1.05||Math.abs(odkV.y)>1.05){e.style.display='none';return}e.style.display='block';e.style.opacity=op;e.style.left=((odkV.x+1)/2*innerWidth)+'px';e.style.top=((1-odkV.y)/2*innerHeight)+'px'});odkLblDirty=false}
// ---------- karta miejsca ----------
let selO=null;
{const _sel=select;select=function(id){selO=null;return _sel(id)}}
function odkAtScreen(x,y){const r=cv.getBoundingClientRect();let best=null,bd=34;for(const o of ODK){const st=odkSt(o);if(!st||(o.t==='bursztyn'&&st.s!==2)||!odkRev(o))continue;odkV.set(o.x,Hy(o.x,o.z)+.6,o.z).project(cam);if(odkV.z>1)continue;
  const sx=(odkV.x+1)/2*r.width+r.left,sy=(1-odkV.y)/2*r.height+r.top;const d=Math.hypot(sx-x,sy-y);if(d<bd){bd=d;best=o}}return best}
{const _ot=onTap;onTap=function(x,y){if(S&&!placing&&!(typeof ladTool!=='undefined'&&ladTool)&&!pick(x,y,[bGroup])[0]){const o=odkAtScreen(x,y);if(o){select(null);selO=o.id;renderSel();return}}return _ot(x,y)}}
function odkCard(o){const st=odkSt(o),T=ODK_T[o.t];const goer=S.people.find(p=>p.odkT===o.id);
 if(st.s!==2)return`<h4>${T.q}?</h4><p>Nikt z osady tu jeszcze nie był. Z daleka nie widać, co to jest.</p>${goer?`<p class="mut">${goer.name} już tam idzie.</p>`:`<div class="cz-act"><button class="pri" data-odks="${o.id}">Wyślij kogoś, żeby obejrzał</button></div>`}`;
 let h=`<h4>${odkName(o)}</h4><p>${T.d}</p>`;
 if(o.t==='kury')h+=`<p class="mut">W gęstwinie żyje jeszcze ${st.n||0} ${plW(st.n||0,'kura','kury','kur')}.${BD.kurnik&&!S.bld.some(b=>b.kind==='kurnik')?' Kurnik stawia się w zakładce Budowa, wśród pól i stad.':''}</p>`;
 if(o.t==='wegiel')h+=`<p class="mut">${st.left>0?`W żyle zostało około ${Math.round(st.left)} węgla.`:'Żyła wyczerpana.'}</p>`;
 if(o.t==='bursztyn')h+=`<p class="mut">Bursztynu w osadzie: ${Math.floor(S.res.bursztyn||0)} ${plW(Math.floor(S.res.bursztyn||0),'grudka','grudki','grudek')}.${S.bld.some(b=>(b.kind==='zbieracz'||b.kind==='pomost')&&bDone(b)&&Math.hypot(bCenter(b).x-o.x,bCenter(b).z-o.z)<44)?'':' Bez zbieraczy albo rybaków w okolicy nikt go nie pozbiera.'}</p>`;
 if(o.t==='wilk'){if(goer)h+=`<p class="mut">${goer.name} idzie do legowiska.</p>`;else if(odkPupOk(o))h+=`<p class="mut">Wiosną w jamie są szczenięta. Wadera poluje i zostawia je same, ale potrafi wrócić w złą chwilę.</p><div class="cz-act"><button class="pri" data-odkp="${o.id}">Zabrać szczenięta</button></div>`;else h+=`<p class="mut">${st.py===Math.floor(S.day/YEAR)?'W tym roku szczenięta już zabrano.':'Szczenięta rodzą się wiosną.'}</p>`}
 return h}
{const _rs=renderSel;renderSel=function(){const el=$('sel');if(selO!==null&&S){const o=ODK[selO];if(!o||!odkSt(o)){selO=null;return _rs()}el.style.display='block';const h=odkCard(o);if(el._h!==h){el._h=h;el.innerHTML=h}
  if(typeof czOn!=='undefined'&&czOn){document.body.classList.add('selon');if(!el.querySelector('.cz-x'))el.insertAdjacentHTML('afterbegin',`<button class="cz-x" aria-label="Zamknij">${ico('x')}</button>`)}return}return _rs()}}
$('sel').addEventListener('click',e=>{const s=e.target.closest('[data-odks],[data-odkp]');if(!s||!S)return;const id=+(s.dataset.odks||s.dataset.odkp);const o=ODK[id];if(!o)return;odkSend(o,!!s.dataset.odkp);$('sel')._h=null;renderSel()});
// ---------- atlas i podpowiedzi ----------
ATLAS.push(['Zwierzęta','kura','Zdziczała kura','Kury z ładowni statku, które przeżyły w gęstwinie. Jaja i pierze.',()=>odkFound('kury')],
 ['Zwierzęta','cietrzew','Cietrzew','Czarny ptak z lirowatym ogonem. Wiosną o świcie tokuje na polanach.',()=>odkFound('tok')],
 ['Rośliny','kapusta','Dzika kapusta','Sinozielone kępy na nadmorskich klifach. Z nasion urośnie na polu.',()=>odkFound('kapusta')]);
{const _nh=natureHTML;natureHTML=function(){let h=_nh();if(!S)return h;const F=ODK.filter(o=>odkSt(o)&&odkSt(o).s===2),Q=ODK.filter(o=>odkSt(o)&&odkSt(o).s===1),U=ODK.filter(o=>!odkSt(o)&&o.t!=='bursztyn').length;
  h+=`<h3>Miejsca na wyspie <span class="mut" style="font-size:13px">${F.length}</span></h3><div class="atlas">`+F.map(o=>`<div class="card"><h4>${odkName(o)}</h4><p>${ODK_T[o.t].d}</p></div>`).join('')+
   Q.map(o=>`<div class="card unk"><h4>${ODK_T[o.t].q}?</h4><p class="mut">Widziane z daleka. Ktoś musi tam pójść.</p></div>`).join('')+'</div>'+(U?`<p class="mut">Wyspa kryje jeszcze miejsca, o których nikt nie wie.</p>`:'');return h}}
{const _ct=czTalkLines;czTalkLines=function(){const L=_ct();if(!S||!L.length)return L;const Q=ODK.filter(o=>odkSt(o)&&odkSt(o).s===1);if(Q.length&&Math.random()<.3){const o=Q[(Math.random()*Q.length)|0];const ad=S.people.filter(isAdult);const sp=ad[(Math.random()*ad.length)|0];
  const T={kury:'Znowu słyszałam kury w zaroślach. Ktoś powinien tam zajrzeć.',tok:'Na wrzosowisku o świcie coś bulgocze, jakby woda w kotle. Ciekawe, co to.',lis:'Pod skarpą za lasem są jakieś nory. Lisie albo borsucze.',wilk:'W borze jest wykrot, przy którym psy się jeżą.',
   wegiel:'W jarze są czarne skały, błyszczą jak smoła. Nigdy takich nie widziałem.',torf:'Na mokradle ziemia jest brunatna i miękka jak gąbka. Dziwne miejsce.',sol:'Sarny chodzą pić do jednego źródła, choć strumień jest bliżej. Czemu?',kapusta:'Na klifie nad morzem rosną sine kępy. Kozy by to jadły.'}[o.t];
  if(sp&&T)L[L.length-1]=[sp.sex==='k'?T:T.replace('słyszałam','słyszałem'),sp.name]}return L}}
// nazwy wiedzy w kartach „Jeszcze nie umiecie”
// ---------- start i rytm ----------
{const _b=boot;boot=function(f){_b(f);if(!S)return;odkInit();odkKeys();odkLblDirty=true;for(const k in odkEl){odkEl[k].remove();delete odkEl[k]}if(!odkHenW)try{odkVisInit()}catch(e){console.warn(e)}}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;try{odkFrame();odkLbl()}catch(e){}odkT+=rdt;if(odkT>1){odkT=0;try{odkTick()}catch(e){console.warn(e)}}}}
window.__odk={ODK,odkFind,odkSend,odkTick,odkDaily,kurDaily,odkCard,odkFound,ODK_T,sel:id=>{select(null);selO=id;renderSel()}};
