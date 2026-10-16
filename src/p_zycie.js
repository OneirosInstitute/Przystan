
// ================= 1.4 Życie wsi: rytm dnia, dzieci, psy, tłoka =================
// bez przybyszów: łódź z obcymi nigdy nie przypływa
{const e=EVENTS.find(e=>e.id==='lodz');if(e)e.cond=()=>false}
const dayN=()=>Math.floor(S.day);
const ZYOFF=(()=>{try{return new URLSearchParams(location.search).get('zyoff')||''}catch(e){return''}})();
const campX=()=>{const c=scC();return c?c.x:tcx(camp.i)},campZ=()=>{const c=scC();return c?c.z:tcx(camp.j)+.6};
function ringSpot(k,n,r){const a=k/Math.max(1,n)*6.283+.4;const x=campX()+Math.cos(a)*r,z=campZ()+Math.sin(a)*r;return nearestWalk(...tileOf(x,z))}
const cerOn=()=>typeof cerActive==='function'&&cerActive();
const isSobota=()=>dayN()%7===5;

// ---------- rytm dnia: mycie rano, wspólny posiłek w południe, wieczór przed domem, sobotnia bania ----------
{const _pj=planJob;planJob=function(p){
  if(S&&!p.fireB&&p.state!=='away'){
   if(S.search&&S.day<S.search.until&&searchJob(p))return true;
   if(S.tloka&&tlokaJob(p))return true;
   if(isWorker(p)&&p.job!=='wyp'&&isWork()){const t=tod(),d=dayN();
    if(!ZYOFF.includes('m')&&t>=.49&&t<.52&&p.mealD!==d&&Math.hypot(p.x-campX(),p.z-campZ())>=9){p.mealD=d;p.ryK='field';p.state='work';p.workKind='rytm';p.wt=0;p.act='je chleb w polu';return true}
    if(!ZYOFF.includes('m')&&t>=.49&&t<.52&&p.mealD!==d){p.mealD=d;const ad=S.people.filter(isWorker);const k=ad.indexOf(p);const s=ringSpot(k,ad.length,2.4+(k%3)*.7);
     if(s&&go(p,s,'rytm',null)){p.ryK='meal';p.act='idzie na wspólny posiłek';return true}}
    if(!ZYOFF.includes('w')&&t<.265&&p.washD!==d){p.washD=d;if(Math.random()<.3){const w=waterNear(p.x,p.z);if(w&&Math.hypot(w.x-p.x,w.z-p.z)<9){const s=nearestWalk(...tileOf(w.x,w.z));if(s&&go(p,s,'rytm',null)){p.ryK='wash';p.act='myje się w strumieniu';return true}}}}}
   if(!ZYOFF.includes('k')&&!isWorker(p)&&p.age>=5&&isWork()&&kidJob(p))return true}
  return _pj(p)}}
{const _oa=onArrive;onArrive=function(p){const a=p.after;
  if(a==='rytm'){p.after=null;p.wt=0;p.state='work';p.workKind='rytm';if(p.ryK==='meal')p.act='je wspólny posiłek przy ognisku';return}
  if(a==='eve'){p.after=null;p.state='eve';p.wt=0;return}
  if(a==='kid'){p.after=null;p.wt=0;if(p.kidK==='berek'&&S.t<(p.kidUntil||0)){const c=S.play;if(c){const a2=Math.random()*6.28,r=1+Math.random()*2.6;const s=nearestWalk(...tileOf(c.x+Math.cos(a2)*r,c.z+Math.sin(a2)*r));if(s&&go(p,s,'kid',null))return}}
   p.state=p.kidK==='berek'?'idle':'work';p.workKind='kid';if(p.state==='idle')p.wait=.5;return}
  if(a==='srch'){p.after=null;p.state='idle';p.wait=.3;return}
  return _oa(p)}}
function eveSpot(p){const d=dayN();const ban=isSobota()&&S.bld.find(b=>b.kind==='laznia'&&bDone(b));
 if(ban&&p.age>=12){p.eveK='bania';return entryOf(ban.kind,ban.i,ban.j)}
 const h=homeOf(p);if(h&&bDone(h)&&(p.id+d)%5!==0){p.eveK='dom';const e=entryOf(h.kind,h.i,h.j);if(e){const c=bCenter(h);const off=[[1,0],[0,1],[-1,0],[0,-1]][(p.id)%4];return nearestWalk(e[0]+off[0],e[1]+off[1])||e}}
 p.eveK='ogien';const all=S.people.filter(q=>q.age>=3);const k=all.indexOf(p);return ringSpot(k,all.length,3+(k%4)*.6)}
const EVE_ACT={dom:'siedzi przed domem',ogien:'siedzi przy ognisku',bania:'w bani'};
{const _sp=stepPerson;stepPerson=function(p,dt){
  // wieczór: zanim pójdą spać
  const t=tod();
  if(!ZYOFF.includes('e')&&S&&p.age>=3&&t>=T1&&t<.9&&!isWork()&&p.job!=='wyp'&&p.state!=='away'&&!p.fireB&&!p.lost&&!cerOn()){
   if(p.state==='eve'){if(p.eveK==='bania'){p.bathD=dayN()}return}
   if(p.state==='move'&&p.after==='eve')return _sp(p,dt);
   if(p.eveD!==dayN()){p.eveD=dayN();if(p.state==='work'&&p.workKind==='build'&&p.tgt&&p.tgt.workers)p.tgt.workers--;release(p);if(p.haulB&&typeof haulEnd==='function')haulEnd(p);if(p.carry)deposit(p);
    const s=eveSpot(p);if(s&&go(p,s,'eve',null)){p.act=EVE_ACT[p.eveK]||'odpoczywa';return}}}
  if(p.state==='eve'&&(t<T1||t>=.9)){p.state='idle';p.wait=.2}
  if(p.lost){p.state='away';return}
  if(p.state==='work'&&p.workKind==='rytm'){if(!isWork()){p.state='idle';return _sp(p,dt)}
   if(p.ryK==='field'){if(t>=.525){p.state='idle';p.wait=.1;p.mealBuff=S.day+.28}return}
   if(p.ryK==='meal'){if(t>=.535){p.state='idle';p.wait=Math.random()*.6;p.mealBuff=S.day+.28}return}
   p.wt+=dt;if(p.wt>=2.5){p.hp=Math.min(1,p.hp+.004);p.state='idle';p.wait=.2}return}
  if(p.state==='work'&&p.workKind==='kid'){if(!isWork()){p.state='idle';return _sp(p,dt)}p.wt+=dt;
   if(p.kidK==='follow'){const q=pById(p.kidP);const c=q&&jobCraft(q);if(c){p.xp[c]=(p.xp[c]||0)+dt*.05}if(p.wt>=6||!q){p.state='idle';p.wait=.3}}
   else if(p.wt>=5){p.state='idle';p.wait=.4}return}
  return _sp(p,dt)}}
{const _e=eff;eff=function(p){return _e(p)*(p.mealBuff>S.day?1.12:1)}}
function rytmDaily(){const d=dayN()-1;const ad=S.people.filter(isWorker);if(!ad.length)return;
 const ate=ad.filter(p=>p.mealD===d).length/ad.length;if(ate>.4){S.hope=clamp(S.hope+.012*ate*KF,0,1);S.dis=Math.max(0,(S.dis||0)-.008*ate*KF);
  // wspólny kocioł: gotuje się raz dla wszystkich, nic się nie marnuje
  const tot=foodTotal(),back=K*S.people.length*.12*ate;if(tot>0)FOOD.forEach(k=>S.res[k]+=back*(S.res[k]/tot));S.kociol=(S.kociol||0)+back}
 const eve=S.people.filter(p=>p.eveD===d).length/Math.max(1,S.people.length);if(eve>.5){S.hope=clamp(S.hope+.008*KF,0,1);S.dis=Math.max(0,(S.dis||0)-.01*KF)}
 const bath=S.people.filter(p=>p.bathD===d);if(bath.length>=3){bath.forEach(p=>p.hp=Math.min(1,p.hp+.04));S.hope=clamp(S.hope+.02,0,1);S.banD=d;if(!S.seen.bania1){S.seen.bania1=1;log('Pierwsza sobota w bani. Para, kamienie, zimna woda po wszystkim. Ludzie wracają czerwoni i weseli.')}}}

// ---------- dzieci ----------
function playSpot(){const d=dayN();if(S.play&&S.play.d===d)return S.play;for(let t=0;t<20;t++){const a=Math.random()*6.28,r=3+Math.random()*5;const s=nearestWalk(...tileOf(campX()+Math.cos(a)*r,campZ()+Math.sin(a)*r));if(s){S.play={d,x:tcx(s[0]),z:tcx(s[1])};return S.play}}return null}
function kidJob(p){const r=Math.random(),sea=seasonIdx();
 const par=S.people.filter(q=>(p.par||[]).includes(q.id)&&isWorker(q)&&q.state==='work'&&q.job!=='wyp'&&Math.hypot(q.x-p.x,q.z-p.z)<22);
 if(par.length&&r<.35){const q=par[(Math.random()*par.length)|0];const s=nearestWalk(...tileOf(q.x+(Math.random()-.5)*1.6,q.z+(Math.random()-.5)*1.6));
  if(s&&go(p,s,'kid',null)){p.kidK='follow';p.kidP=q.id;p.act=`patrzy, jak ${q.sex==='k'?'matka':'ojciec'} ${(q.act||'pracuje').split(':')[0]}`;return true}}
 if(r<.75&&sea!==2){const c=playSpot();if(c){const s=nearestWalk(...tileOf(c.x+(Math.random()-.5)*3,c.z+(Math.random()-.5)*3));if(s&&go(p,s,'kid',null)){p.kidK='berek';p.kidUntil=S.t+6+Math.random()*6;p.act='gra w berka';return true}}}
 if(sea===0||sea===3){const w=waterNear(campX(),campZ());if(w&&Math.hypot(w.x-campX(),w.z-campZ())<16){const s=nearestWalk(...tileOf(w.x,w.z));if(s&&go(p,s,'kid',null)){p.kidK='kaczki';p.act='puszcza kaczki na wodzie';return true}}}
 return false}
// zgubione dziecko
EVENTS.push({id:'zgubione',w:1.1,cd:YEAR*.7,cond:()=>S.day>12&&seasonIdx()!==2&&isWork()&&tod()<.6&&!S.search&&S.people.some(p=>p.age>=5&&p.age<11&&!p.lost),
 ctx:()=>{const k=S.people.filter(p=>p.age>=5&&p.age<11&&!p.lost);const p=k[(Math.random()*k.length)|0];return p?{p}:null},t:'Nie ma dziecka',
 text:c=>{const p=c.p,o=p.sex==='k';return`${p.name} ${o?'poszła':'poszedł'} rano z koszykiem na jagody i ${o?'nie wróciła':'nie wrócił'} na posiłek. Ktoś widział ${o?'ją':'go'} przy skraju lasu. Do zmroku zostało kilka godzin.`},
 opts:[{n:'Wszyscy szukają',d:'dzień pracy przepada, ale szans jest najwięcej',f:c=>searchStart(c.p,'all')},
  {n:'Szukają najlepsi tropiciele',d:'dwie osoby, reszta pracuje',f:c=>searchStart(c.p,'two')},
  {n:'Poczekać do wieczora',d:'dzieci często same wracają',f:c=>searchStart(c.p,'wait')}]});
function searchStart(p,mode){let spot=null;for(let t=0;t<40&&!spot;t++){const a=Math.random()*6.28,r=10+Math.random()*9;const s=nearestWalk(...tileOf(campX()+Math.cos(a)*r,campZ()+Math.sin(a)*r));if(s&&revAt(s[0],s[1]))spot=s}
 spot=spot||[camp.i+8,camp.j];p.lost=1;p.state='away';p.path=null;p.x=tcx(spot[0]);p.z=tcx(spot[1]);
 const best=S.people.filter(q=>isWorker(q)&&q.job!=='wyp').sort((a,b)=>(b.sk.mysliwy||0)-(a.sk.mysliwy||0)).slice(0,2).map(q=>q.id);
 const ch=mode==='all'?.92:mode==='two'?.7:.45;S.search={pid:p.id,x:tcx(spot[0]),z:tcx(spot[1]),until:S.day+(mode==='wait'?.22:.18),mode,who:mode==='two'?best:null,ok:Math.random()<ch};
 return mode==='all'?'Wszyscy rzucają robotę. Idą tyralierą w las, nawołując.':mode==='two'?'Dwoje najlepszych tropicieli rusza śladem.':'Czekacie. Każdy co chwilę spogląda w stronę lasu.'}
function searchJob(p){const s=S.search;if(!isWorker(p)||p.job==='wyp'||s.mode==='wait')return false;if(s.mode==='two'&&!(s.who||[]).includes(p.id))return false;
 const a=Math.random()*6.28,r=2+Math.random()*7;const t=nearestWalk(...tileOf(s.x+Math.cos(a)*r,s.z+Math.sin(a)*r));const kid=pById(s.pid);
 if(t&&go(p,t,'srch',null)){p.act='szuka: '+(kid?kid.name:'dziecka');return true}return false}
function searchEnd(){const s=S.search;S.search=null;const p=pById(s.pid);if(!p)return;p.lost=0;p.state='idle';p.wait=1;
 const o=p.sex==='k';if(s.ok){p.x=s.x;p.z=s.z;S.hope=clamp(S.hope+.04,0,1);log(`${p.name} ${o?'znaleziona':'znaleziony'}. ${o?'Siedziała':'Siedział'} pod wykrotem z pełnym koszykiem jagód i ${o?'płakała':'płakał'}. Matka nie wypuszcza ${o?'jej':'go'} z rąk do wieczora.`);toast(`${p.name} ${o?'znaleziona':'znaleziony'}`)}
 else{p.x=campX()+1;p.z=campZ()+1;p.hp=Math.min(p.hp,.35);S.hope=clamp(S.hope-.02,0,1);log(`${p.name} ${o?'wróciła':'wrócił'} ${o?'sama':'sam'} dopiero nad ranem, ${o?'przemarznięta':'przemarznięty'} i ${o?'pogryziona':'pogryziony'} przez komary. Przez kilka dni nikt nie spuszcza dzieci z oka.`);toast(`${p.name} ${o?'wróciła':'wrócił'} nad ranem`)}}

// ---------- psy ----------
const DOG_M=['Bury','Kieł','Szarak','Wilczek','Kruk','Mruk','Grom','Łapa'],DOG_F=['Sowa','Kruczka','Mgła','Iskra','Sarna','Bystra','Wila','Zgrzyta'];
const dogsOk=()=>(S.dogs||[]).filter(d=>!d.dead);
function dogName(sex){const used=new Set((S.dogs||[]).map(d=>d.name));const L=(sex==='k'?DOG_F:DOG_M).filter(n=>!used.has(n));return L.length?L[(Math.random()*L.length)|0]:(sex==='k'?'Suczka':'Szczeniak')}
function dogNew(o){S.dogs=S.dogs||[];S.dogId=(S.dogId||0)+1;const d=Object.assign({id:S.dogId,age:0,x:campX()+1,z:campZ()+1,tame:1,wolf:0,hp:1,life:10+Math.random()*4,role:null},o);S.dogs.push(d);dogDirty=true;return d}
function dogsInit(){if(!S)return;if(!S.dogs){S.dogs=[];dogNew({name:'Łata',sex:'k',age:4,origin:'statek',life:13});
  log(S.day<1?'Z wraku na brzeg przepłynęła też Łata, suka kapitana. Mokra i chuda, ale żywa. Od razu przywarła do dzieci.':'Łata, suka kapitana, przez te wszystkie dni trzymała się wraku i lasu. Dziś przyszła do ogniska i już nie odeszła.')}dogDirty=true}
const dogAdult=d=>!d.dead&&d.age>=1&&d.tame>=1;
function dogWord(d){return d.sex==='k'?'suka':'pies'}
function dogOrigin(d){if(d.origin==='statek')return'z wraku, pies kapitana';if(d.origin==='wilk')return'z wilczego legowiska';return`mieszaniec po ${d.ma||'?'} i ${d.pa||'?'}`}
function dogGuard(){let n=0;dogsOk().forEach(d=>{if(dogAdult(d))n+=.6+.8*d.wolf});return Math.max(.35,1-.22*n)}
function dogHunt(p){const d=dogsOk().find(d=>dogAdult(d)&&d.with===p.id);return d?1.15+.25*d.wolf:1}
function dogPick(d){const day=dayN();if(d.with&&d.withD===day){const q=pById(d.with);if(q&&q.state!=='away'&&q.state!=='sleep'&&!q.lost)return q}
 let L=[];const hunters=S.people.filter(q=>q.job==='wb'&&(bById(q.wb)||{}).kind==='mysliwy'&&q.state!=='away');const kids=S.people.filter(q=>q.age>=4&&q.age<12&&!q.lost);
 if(d.age<1||d.tame<1)L=kids.length?kids:S.people.filter(isWorker);
 else if(d.role==='hunt'||(d.role!=='kids'&&d.wolf>=.4))L=hunters.length?hunters:kids;
 else L=kids.length?kids:S.people.filter(isWorker);
 L=L.filter(q=>q.state!=='away');if(!L.length)return null;const q=L[(d.id*7+day)%L.length];d.with=q.id;d.withD=day;return q}
function dogStep(dt){if(!S||!S.dogs)return;const t=tod(),night=t<T0-.02||t>.9;
 for(const d of S.dogs){if(d.dead)continue;let tx,tz,sp=2.5;
  if(night){const h=d.home?bById(d.home):null;const c=h&&bDone(h)?bCenter(h):{x:campX()+.8+((d.id*13)%5)*.3,z:campZ()-.9};tx=c.x+.6;tz=c.z+.9;d.st='sleep';sp=1.6}
  else{const q=dogPick(d);if(q){const back=1+((d.id*3)%3)*.4;const a=(q.dir||0)+Math.PI+((d.id%2)?.6:-.6);tx=q.x+Math.sin(a)*back;tz=q.z+Math.cos(a)*back;d.st='with';d.home=homeOf(q)?homeOf(q).id:d.home}else{tx=campX()+Math.sin(S.t*.1+d.id)*3;tz=campZ()+Math.cos(S.t*.1+d.id)*3;d.st='roam'}}
  const dx=tx-d.x,dz=tz-d.z,dd=Math.hypot(dx,dz);
  if(dd>28){d.x=tx;d.z=tz}else if(dd>.35){const v=Math.min(dd,(dd>3?sp*1.3:sp*.6)*dt);const nx=d.x+dx/dd*v,nz=d.z+dz/dd*v;const ti=tileOf(nx,nz);if(land[ti[1]*N+ti[0]]){d.x=nx;d.z=nz}else{d.x+=dz/dd*v*.6;d.z-=dx/dd*v*.6}d.dir=Math.atan2(dx,dz);d.mv=1}
  else{d.mv=0;if(Math.random()<dt*.3){d.x+=(Math.random()-.5)*.5;d.z+=(Math.random()-.5)*.5}}
  // wilki: ujada i odgania
  if(dogAdult(d)&&(d.barkT||0)<S.t)for(const h of S.herds){if(h.type!=='wilk'||h.n<=0)continue;if(Math.hypot(h.x-d.x,h.z-d.z)<14+6*d.wolf){d.barkT=S.t+40;d.bark=S.t;h.tx=clamp(h.x+(h.x-d.x)*1.2,-N/2+3,N/2-3);h.tz=clamp(h.z+(h.z-d.z)*1.2,-N/2+3,N/2-3);S.dogScare=(S.dogScare||0)+1;if(!S.seen.dogBark){S.seen.dogBark=1;log(`${d.name} ujada w ciemność, sierść na karku zjeżona. Wilki odchodzą od osady.`)}break}}}}
{const _st=step;step=function(dt){_st(dt);try{dogStep(dt);if(S.search&&S.day>=S.search.until)searchEnd();tlokaTick()}catch(e){console.warn(e)}}}
function dogDaily(){if(!S.dogs)return;const sea=seasonIdx(),yr=Math.floor(S.day/YEAR);
 for(const d of S.dogs){if(d.dead)continue;const was=d.age;d.age+=1/YEAR;
  if(d.tame<1){const food=S.res.mieso>=.6*KF?'mieso':S.res.ryby>=.6*KF?'ryby':null;if(food){S.res[food]-=.6*KF;d.tame+=.035*KF}else d.tame-=.07*KF;
   if(d.tame<=0){d.dead=1;d.gone=1;log(`${d.name} uciekł${d.sex==='k'?'a':''} w nocy do lasu. Głód był silniejszy niż ludzie.`);dogDirty=true;continue}
   if(d.tame>=1){d.tame=1;log(`${d.name} już nie ucieka do lasu. Przychodzi na wołanie i śpi przy drzwiach.`)}}
  if(was<1&&d.age>=1&&d.origin!=='statek')log(`${d.name} wyrasta na ${d.wolf>=.5?'rosłego, szarego psa o wilczym spojrzeniu':'silnego psa'}.`);
  if(d.age>=d.life){d.dead=1;S.dogsDead=(S.dogsDead||[]).concat([d.name]);log(`${d.name} nie wstał${d.sex==='k'?'a':''} rano. Dzieci pochowały ${d.sex==='k'?'ją':'go'} pod brzozą i długo nikt nic nie mówił.`);dogDirty=true;continue}
  if(dogAdult(d)&&Math.random()<.035*KF){const q=Math.random()<.6;S.res.mieso=(S.res.mieso||0)+(q?2.5:1.5);if(!S.seen['dogGift'+d.id]){S.seen['dogGift'+d.id]=1;log(`${d.name} przynosi z lasu ${q?'zająca':'kaczkę'}. Od dziś dzieci chodzą z ${d.sex==='k'?'nią':'nim'} na łąki.`)}}}
 S.hope=clamp(S.hope+.002*KF*Math.min(4,dogsOk().filter(dogAdult).length),0,1);
 // szczenięta wiosną
 if(sea===3&&dogsOk().length<9){const A=dogsOk().filter(d=>dogAdult(d)&&d.age>=1.5&&d.litY!==yr);const f=A.filter(d=>d.sex==='k'),m=A.filter(d=>d.sex!=='k');
  if(f.length&&m.length&&Math.random()<.06*KF){const ma=f[(Math.random()*f.length)|0],pa=m[(Math.random()*m.length)|0];ma.litY=yr;pa.litY=yr;const n=Math.min(9-dogsOk().length,2+((Math.random()*3)|0));const w=(ma.wolf+pa.wolf)/2;
   for(let k=0;k<n;k++){const sex=Math.random()<.5?'k':'m';dogNew({name:dogName(sex),sex,age:0,origin:w>0&&w<1?'mies':ma.origin==='wilk'?'wilk':'statek',wolf:Math.max(0,Math.min(1,w+(Math.random()-.5)*.1)),ma:ma.name,pa:pa.name,x:ma.x,z:ma.z,home:ma.home})}
   log(`${ma.name} ma szczenięta: ${n}. Ojcem jest ${pa.name}.${w>0&&w<1?' Po ojcu i matce mają po trochu: szarą sierść i krótki psi ogon, wilcze uszy i psią ufność.':''}`);toast(`Szczenięta u ${gen(ma.name)}`)}}}
EVENTS.push({id:'wilczeta',w:2.4,cd:YEAR*.9,cond:()=>seasonIdx()===3&&S.day>YEAR*.4&&dogsOk().length<8&&S.herds.some(h=>h.type==='wilk')&&S.people.some(p=>isWorker(p)&&(p.job==='zwiad'||(p.job==='wb'&&(bById(p.wb)||{}).kind==='mysliwy'))),
 ctx:()=>{const L=S.people.filter(p=>isWorker(p)&&(p.job==='zwiad'||(p.job==='wb'&&(bById(p.wb)||{}).kind==='mysliwy')));const p=L[(Math.random()*L.length)|0];return p?{p,n:2+((Math.random()*2)|0)}:null},t:'Wilcze szczenięta',
 text:c=>`${c.p.name} ${c.p.sex==='k'?'znalazła':'znalazł'} pod korzeniami wywróconego świerka legowisko. Wadera nie wraca od kilku dni, może wpadła w bagno, może dopadł ją niedźwiedź. W środku ${c.n} szczenięta, chude, piszczą z głodu. Same nie przeżyją.`,
 opts:[{n:'Zabrać jedno',d:'trzeba je karmić mięsem albo rybą i oswajać przez kilka tygodni',f:c=>{wolfPups(1);return'Jedno, najśmielsze, wtula się w kożuch. Reszta zostaje w ciemności legowiska.'}},
  {n:'Zabrać wszystkie',d:'więcej jedzenia, a któreś może uciec z powrotem do lasu',f:c=>{wolfPups(c.n);return'Dzieci nie odstępują ich na krok. Dorośli kręcą głowami: z wilka pies? Zobaczymy.'}},
  {n:'Zostawić',d:'las ma swoje prawa',f:c=>{return'Odchodzą bez słowa. Nikt potem o tym nie mówi.'}}]});
function wolfPups(n){for(let k=0;k<n;k++){const sex=Math.random()<.5?'k':'m';dogNew({name:dogName(sex),sex,age:.15,origin:'wilk',wolf:1,tame:.2,life:11+Math.random()*3})}log(n===1?'Do osady trafia wilcze szczenię. Trzeba je karmić i cierpliwie oswajać.':`Do osady trafiają wilcze szczenięta: ${n}. Trzeba je karmić i cierpliwie oswajać.`)}
// efekty w świecie: wilki rzadziej w zagrodach, lepsze polowania (wstawione do p_rest)
// ---------- psy w 3D ----------
const dogGroup=new THREE.Group();scene.add(dogGroup);let dogDirty=true;const dogMesh={};
function dogColor(d){const a=[2.7,1.95,1.25],b=[1.3,1.3,1.28];const w=d.wolf||0;return new THREE.Color(a[0]+(b[0]-a[0])*w,a[1]+(b[1]-a[1])*w,a[2]+(b[2]-a[2])*w)}
function dogFrame(){if(!S||!S.dogs)return;if(dogDirty){dogDirty=false;for(const id in dogMesh){const d=S.dogs.find(x=>x.id===+id);if(!d||d.dead){dogGroup.remove(dogMesh[id]);delete dogMesh[id]}}
  S.dogs.forEach(d=>{if(d.dead||dogMesh[d.id])return;const m=new THREE.Mesh(wolfG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,color:dogColor(d)}));m.castShadow=true;m.userData.did=d.id;dogMesh[d.id]=m;dogGroup.add(m)})}
 const tm=performance.now()/1000;
 S.dogs.forEach(d=>{const m=dogMesh[d.id];if(!m)return;const ti=tileOf(d.x,d.z);m.visible=revAt(ti[0],ti[1]);const s=(d.age<1?.45+.5*d.age:1)*(d.wolf>.5?.95:.82);
  const bob=d.mv?Math.abs(Math.sin(tm*9+d.id))*.05:0;m.position.set(d.x,Hy(d.x,d.z)+bob,d.z);m.rotation.set(0,(d.dir||0)-Math.PI/2,d.st==='sleep'?0:0);m.scale.set(s,d.st==='sleep'?s*.6:s,s);
  if(d.bark&&S.t-d.bark<2)m.rotation.z=.25*Math.sin(tm*20)})}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{dogFrame()}catch(e){}}}
// dotknięcie psa: karta
let selD=null;
{const _sel=select;select=function(id){selD=null;return _sel(id)}}
const dogV=new THREE.Vector3();
function dogAtScreen(x,y){const r=cv.getBoundingClientRect();let best=null,bd=30;for(const d of (S.dogs||[])){if(d.dead)continue;dogV.set(d.x,Hy(d.x,d.z)+.35,d.z).project(cam);if(dogV.z>1)continue;const sx=(dogV.x+1)/2*r.width+r.left,sy=(1-dogV.y)/2*r.height+r.top;const dd=Math.hypot(sx-x,sy-y);if(dd<bd){bd=dd;best=d}}return best}
{const _ot=onTap;onTap=function(x,y){if(S&&!placing&&!(typeof ladTool!=='undefined'&&ladTool)){const h=pick(x,y,[dogGroup])[0];const d=h&&h.object.userData.did!==undefined?S.dogs.find(q=>q.id===h.object.userData.did):dogAtScreen(x,y);if(d){select(null);selD=d.id;renderSel();return}}return _ot(x,y)}}
function dogCard(d){const age=d.age<1?`${Math.max(1,Math.round(d.age*12))} mies.`:`${Math.floor(d.age)} ${Math.floor(d.age)===1?'rok':Math.floor(d.age)<5?'lata':'lat'}`;const q=d.with&&d.withD===dayN()?pById(d.with):null;
 return`<h4>${d.name} <span class="mut" style="font-size:13px">${dogWord(d)} · ${age}</span></h4><p>${dogOrigin(d)}${d.wolf>0&&d.wolf<1?` · krew wilka: ${Math.round(d.wolf*100)}%`:''}</p>`+
 (d.tame<1?`<p class="no">Jeszcze dziki: oswojenie ${Math.round(d.tame*100)}%. Codziennie zjada trochę mięsa albo ryb; bez jedzenia ucieknie do lasu.</p>`:'')+
 `<p class="mut">${d.st==='sleep'?'Śpi przy ogniu.':q?`Chodzi za: ${q.name}.`:'Węszy wokół obozu.'} ${d.wolf>=.5?(d.sex==='k'?'Czujna, dobrze tropi, mniej posłuszna.':'Czujny, dobrze tropi, mniej posłuszny.'):(d.sex==='k'?'Łagodna, pilnuje dzieci.':'Łagodny, pilnuje dzieci.')}</p>`+
 (dogAdult(d)?`<div class="cz-act"><button data-dogr="hunt" class="${d.role==='hunt'?'pri':''}">Na polowania</button><button data-dogr="kids" class="${d.role==='kids'?'pri':''}">Przy dzieciach</button><button data-dogr="" class="${!d.role?'pri':''}">Sam wybiera</button></div>`:'')}
{const _rs=renderSel;renderSel=function(){const el=$('sel');if(selD!==null&&S){const d=(S.dogs||[]).find(x=>x.id===selD&&!x.dead);if(!d){selD=null;return _rs()}el.style.display='block';const h=dogCard(d);if(el._h!==h){el._h=h;el.innerHTML=h}
  if(typeof czOn!=='undefined'&&czOn){document.body.classList.add('selon');if(!el.querySelector('.cz-x'))el.insertAdjacentHTML('afterbegin',`<button class="cz-x" aria-label="Zamknij">${ico('x')}</button>`)}return}return _rs()}}
$('sel').addEventListener('click',e=>{const b=e.target.closest('[data-dogr]');if(!b||selD===null)return;const d=S.dogs.find(x=>x.id===selD);if(d){d.role=b.dataset.dogr||null;d.withD=-1;$('sel')._h=null;renderSel()}});
function dogsHTML(){const L=(S.dogs||[]).filter(d=>!d.dead);if(!L.length)return'';return`<h3>Psy</h3><div class="card">${L.map(d=>`<p><b style="color:var(--hi)">${d.name}</b> <span class="mut">${dogWord(d)}, ${d.age<1?'szczenię':Math.floor(d.age)+' l.'} · ${d.origin==='statek'?'z wraku':d.origin==='wilk'?'wilk':'mieszaniec'}${d.tame<1?` · oswojenie ${Math.round(d.tame*100)}%`:''}</span></p>`).join('')}<p class="mut">Psy chodzą za dziećmi albo myśliwymi, ujadają na wilki i czasem przynoszą zdobycz. Dotknij psa na mapie, żeby zobaczyć jego kartę.</p></div>`}
{const _rh=rodyHTML;rodyHTML=function(){return _rh()+dogsHTML()}}

// ---------- tłoka ----------
function tlokaCan(b){return b&&!bDone(b)&&!S.tloka&&S.day>=(S.tlokaCd||0)}
function tlokaCost(){return Math.round(K*S.people.length*.7)}
function tlokaStart(b){const d=dayN()+(tod()>.6?1:0);if(b.mat)b.del=b.mat;S.tloka={b:b.id,d,fed:0};S.tlokaCd=S.day+SD;
 log(`Zwołano tłokę przy budowie: ${BD[b.kind].n.toLowerCase()}. ${d>dayN()?'Jutro od świtu':'Od zaraz'} wszyscy rzucają swoje zajęcia, każdy przynosi coś ze sobą.`);toast('Tłoka zwołana')}
function tlokaJob(p){const T=S.tloka;if(dayN()!==T.d||!isWork()||!isWorker(p)||p.job==='wyp')return false;const b=bById(T.b);if(!b||bDone(b))return false;
 const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'build',b)){b.workers=(b.workers||0)+1;p.act='tłoka: '+BD[b.kind].n.toLowerCase();return true}return false}
function tlokaTick(){const T=S.tloka;if(!T)return;const b=bById(T.b);
 if(dayN()>T.d||(dayN()===T.d&&tod()>=T1)){if(!T.fed){T.fed=1;const c=tlokaCost(),tot=foodTotal();if(tot>=c){FOOD.forEach(k=>S.res[k]=Math.max(0,S.res[k]-c*(S.res[k]/tot)));S.hope=clamp(S.hope+.06,0,1);S.dis=Math.max(0,(S.dis||0)-.06);
    const own=b?Object.values(S.fams).find(f=>f.home===b.id):null;if(own){Object.keys(S.fams).forEach(f=>{if(+f!==own.id)relAdd(own.id,+f,6)});S.tlokaDebt=S.tlokaDebt||{};S.tlokaDebt[own.id]=(S.tlokaDebt[own.id]||0)+1}
    log(`Wieczorem po tłoce ${own?'rodzina '+gen(famName(own.id))+' ugaszcza':'osada ugaszcza'} wszystkich przy ogniu. Śpiewają do późna.${own?' Ten dług się pamięta.':''}`)}
   else log('Po tłoce nie ma czym ugościć ludzi. Rozchodzą się zmęczeni i trochę urażeni.')}S.tloka=null}}
{const _rs=renderSel;renderSel=function(){_rs();if(!S||selB===null)return;const b=bById(selB);const el=$('sel');if(!b||el.style.display!=='block'||el.querySelector('.tl-box'))return;
  if(!bDone(b))el.insertAdjacentHTML('beforeend',S.tloka&&S.tloka.b===b.id?`<p class="tl-box" style="color:var(--gold)">Tłoka trwa: wszyscy budują.</p>`:tlokaCan(b)?`<div class="tl-box" style="margin-top:8px"><button class="pri" data-tloka="${b.id}" style="width:100%">Zwołaj tłokę</button><p class="mut" style="margin:4px 0 0">Cała osada przez dzień buduje tylko to. Wieczorem uczta: jedzenie ${tlokaCost()}. Raz na porę roku.</p></div>`:`<p class="tl-box mut">Tłokę można zwołać raz na porę roku.</p>`)}}
$('sel').addEventListener('click',e=>{const t=e.target.closest('[data-tloka]');if(!t||!S)return;const b=bById(+t.dataset.tloka);if(b&&tlokaCan(b)){tlokaStart(b);$('sel')._h=null;renderSel()}});

// ---------- przy ognisku i dzień ----------
{const _ct=czTalkLines;czTalkLines=function(){const L=_ct();const X=[];const ds=dogsOk();
  if(ds.length&&Math.random()<.4){const d=ds[(Math.random()*ds.length)|0];const q=d.with?pById(d.with):null;X.push(d.tame<1?`${d.name} znowu warczy przy misce. Ale już bierze jedzenie z ręki.`:q?`${d.name} cały dzień nie ${d.sex==='k'?'odstępowała':'odstępował'} ${gen(q.name)} na krok.`:`${d.name} warczy w stronę lasu. Coś tam chodzi.`)}
  if(S.tloka&&S.tloka.fed)X.push('Tak się buduje: wszyscy naraz. Ręce bolą, ale dom stoi.');
  if(S.banD===dayN()-1||(isSobota()&&S.seen.bania1))X.push('Po bani człowiek jak nowo narodzony.');
  if(X.length){const ad=S.people.filter(isAdult);const x=X[(Math.random()*X.length)|0];const sp=ad[(Math.random()*ad.length)|0];if(sp){if(L.length>=2)L[0]=[x,sp.name];else L.unshift([x,sp.name])}}return L}}
{const _ad=actDaily;actDaily=function(){_ad();if(!S)return;try{rytmDaily();dogDaily()}catch(e){console.warn(e)}}}
{const _b=boot;boot=function(fresh){_b(fresh);try{dogsInit();selD=null}catch(e){console.warn(e)}}}
window.__zy={dogAtScreen,get selD(){return selD},dogsInit,dogNew,wolfPups,dogStep,dogDaily,searchStart,tlokaStart,tlokaCan,get dogs(){return S.dogs},dogGuard,dogHunt,kidJob,eveSpot};
