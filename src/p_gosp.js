
/* ================= 0.21: gospodarstwa — spiżarki rodzin, wieczory i prządki, dowóz materiałów, jakość wyrobów i pamiątki ================= */
// ---------- spiżarki rodzin ----------
const SPIZ_CAP={szalas:8,chata:20,dom:32};
function spizCap(f){const h=f&&f.home?bById(f.home):null;if(!h)return 0;let k=h.kind;if(!bDone(h)){if(!h.upFrom)return 0;k=h.upFrom}return(SPIZ_CAP[k]||10)+(typeof hasExt==='function'&&hasExt(h,'piwnica')?15:0)}
function pNeed(p){return p.age<3?.3:p.age<12?.6:p.age>55?.8:1}
function fedOf(p){return p.fedR===undefined?S.fedR:p.fedR}
function famNeed(fid){return K*famMembers(fid).filter(p=>p.job!=='wyp').reduce((a,p)=>a+pNeed(p),0)*(law('oszczedne')?.8:1)}
function foodWorker(p){const b=p.job==='wb'?bById(p.wb):null;return!!b&&['zbieracz','mysliwy','pomost','zagroda','pole','piekarnia','serownia','kiszarnia','zarna'].includes(b.kind)}
function gospEat(){const fams=Object.values(S.fams);S.people.forEach(p=>p.fedR=S.fedR);
 const allNeed=K*S.people.reduce((a,p)=>a+pNeed(p),0);const qN=(S.toolQ||{}).naczynia||1;
 fams.forEach(f=>{f.sp=f.sp||0;const cap=spizCap(f);if(f.sp>cap)f.sp=cap;const fn=famNeed(f.id);const mem=famMembers(f.id);if(!mem.length)return;
  // głód: rodzina sięga do swojej spiżarki
  if(S.fedR<1&&f.sp>0&&fn>0){const take=Math.min(f.sp,(1-S.fedR)*fn);f.sp-=take;const fr=Math.min(1,S.fedR+take/fn);mem.forEach(p=>p.fedR=fr);f.used=(f.used||0)+take}
  // psucie się w domu: dobre naczynia pomagają
  f.sp=Math.max(0,f.sp*(1-.006*K*(1.25-.25*Math.min(1.4,qN))*(S.res.naczynia>2?.8:1)))});
 // dopełnianie spiżarek, gdy we wspólnym jest zapas
 if(S.fedR>=1&&foodTotal()>allNeed*6){let pool=Math.min(foodTotal()-allNeed*6,K*S.people.length*1.4);const sw=law('u_swoje'),st=law('u_starsi');
  const order=fams.slice().sort((a,b)=>st?Math.max(...famMembers(b.id).map(p=>p.age),0)-Math.max(...famMembers(a.id).map(p=>p.age),0):0);
  order.forEach(f=>{const cap=spizCap(f);const mem=famMembers(f.id);if(!cap||!mem.length||pool<=0)return;let fac=1;
   if(sw){const w=mem.filter(isAdult);fac=.4+1.6*(w.length?w.filter(foodWorker).length/w.length:0)}if(st)fac*=1.15;
   const want=Math.min(cap-f.sp,K*mem.length*1.2*fac,pool);if(want<=0)return;const tot=foodTotal();FOOD.forEach(k=>S.res[k]=Math.max(0,S.res[k]-want*(S.res[k]/tot)));f.sp+=want;pool-=want})}}
{const _dp=dailyPeople;dailyPeople=function(c,h){if(S&&S.fams)gospEat();_dp(c,h)}}
function spizTot(){return Object.values(S.fams||{}).reduce((a,f)=>a+(f.sp||0),0)}
function spizWord(f){const cap=spizCap(f);if(!cap)return'';const fn=famNeed(f.id);return` · spiżarka ${Math.round(f.sp||0)}/${cap}${fn>0?` (na ${Math.floor((f.sp||0)/fn)} d.)`:''}`}
EVENTS.push({id:'gosp_pelna',w:3,cd:40,cond:()=>(S.hungerDays||0)>=2&&!law('u_wspolne')&&spizRich()&&spizPoor(),t:'Pełna spiżarka',
 ctx:()=>{const a=spizRich(),b=spizPoor();return a&&b?{a,b}:null},
 text:c=>`We wspólnej spiżarni pusto. Rodzina ${gen(famName(c.a.id))} ma jeszcze pełne garnki pod ławą, a u ${gen(famName(c.b.id))} dzieci chodzą głodne. Ktoś mówi o tym na głos przy ognisku.`,
 opts:[{n:'Wiec prosi o podział',d:'połowa zapasu idzie do głodnych',f:c=>{const q=c.a.sp/2;c.a.sp-=q;c.b.sp+=q;famMembers(c.a.id).forEach(p=>p.zad=Math.max(0,(p.zad||.5)-.08));S.dis=clamp((S.dis||0)-.02,0,1);S.hope=clamp(S.hope+.02,0,1);return`Rodzina ${gen(famName(c.a.id))} oddaje połowę. Niechętnie, ale oddaje. Dzieci jedzą.`}},
  {n:'Każdy je swoje',d:'zgodnie z umową, ale z goryczą',f:c=>{S.dis=clamp((S.dis||0)+.05,0,1);famMembers(c.b.id).forEach(p=>{p.zad=Math.max(0,(p.zad||.5)-.12);if(p.age<12)p.hp=Math.max(.1,p.hp-.05)});return'Nikt nic nie oddaje. Przez kilka dni przy ognisku jest cicho, a rodziny siedzą osobno.'}}]});
function spizRich(){return Object.values(S.fams).filter(f=>(f.sp||0)>=12).sort((a,b)=>b.sp-a.sp)[0]}
function spizPoor(){return Object.values(S.fams).filter(f=>(f.sp||0)<2&&famMembers(f.id).some(p=>fedOf(p)<.9)).sort((a,b)=>famMembers(b.id).length-famMembers(a.id).length)[0]}

// ---------- wieczory i prządki ----------
const WIECZ={kadziel:['Kądziel','Przędą len i sierść, tkają płótno. Potrzeba włókien.'],naprawy:['Naprawy','Ostrzą narzędzia, łatają odzież. Rzeczy służą dłużej.'],plecionki:['Plecionki','Kosze, maty i łapcie z łyka. W koszach też da się przechować zapasy.'],opowiesci:['Opowieści','Starsi opowiadają, dzieci słuchają i uczą się. Rośnie nadzieja i pamięć.']};
function wieczAuto(){const ad=S.people.filter(isAdult);const worn=ad.filter(p=>(p.tool.t>0&&p.tool.d<30)||(p.coat>0&&p.coat<30)).length/Math.max(1,ad.length);
 if(worn>.35)return'naprawy';if((S.res.wlokna||0)>=4&&(S.res.plotno||0)<20)return'kadziel';if(S.people.filter(p=>p.age>=5&&p.age<14).length>=3)return'opowiesci';return(S.res.naczynia||0)<15?'plecionki':'opowiesci'}
function przHost(){return S.bld.filter(b=>bDone(b)&&(b.kind==='dom'||b.kind==='chata')).sort((a,b)=>(b.kind==='dom')-(a.kind==='dom')||Math.hypot(a.i-camp.i,a.j-camp.j)-Math.hypot(b.i-camp.i,b.j-camp.j))[0]}
function przOn(){const sea=seasonIdx();return(sea===1||sea===2)&&!!przHost()&&!['naprawy','plecionki'].includes(S.wiecz)}
function przGoes(p){return p.age>=14&&(p.sex==='k'&&isAdult(p)||p.age<=24)&&p.job!=='wyp'&&p.hp>.4}
function wieczDaily(){const sea=seasonIdx(),mul=[.6,1,1.6,1.1][sea];const mode=(S.wiecz&&S.wiecz!=='auto')?S.wiecz:wieczAuto();S.wieczM=mode;
 const ppl=S.people.filter(p=>p.age>=8&&p.job!=='wyp');const W=ppl.reduce((a,p)=>a+(p.age<14?.5:p.age>55?1.2:1),0)*mul*(przOn()?1.25:1);let out='';
 if(mode==='kadziel'){const kr=Math.max(0,...S.people.map(p=>p.sk.krawiec||0));const m=Math.min((S.res.wlokna||0)/2,W*.045*K);if(m>.05){S.res.wlokna-=2*m;gospMade({kind:'szwalnia',_q:.7+.12*kr},'plotno',m);S.res.plotno=(S.res.plotno||0)+m;out=`uprzędzono i utkano ${m.toFixed(1)} płótna`}else out='brak włókien, przędą to, co zostało'}
 else if(mode==='naprawy'){let n=0;S.people.filter(isAdult).forEach(p=>{if(p.tool.t){p.tool.d+=K*.35;n++}if(p.coat>0)p.coat+=K*.4});out=`naprawiono narzędzia i odzież (${n} os.)`}
 else if(mode==='plecionki'){const m=W*.018*K;S.res.naczynia=(S.res.naczynia||0)+m;out=`uplecione kosze i maty: ${m.toFixed(1)}`}
 else{S.hope=clamp(S.hope+.0012*K*mul,0,1);pamAdd(.05);S.people.filter(p=>p.age>=5&&p.age<14).forEach(p=>{const c=Object.keys(CN)[(Math.random()*11)|0];p.xp[c]=(p.xp[c]||0)+1.5*K*mul});out='dzieci słuchają opowieści o dawnym życiu i o statku'}
 S.wieczLast=out;
 // prządki: od jesieni do wiosny młodzi i kobiety spotykają się w jednej chacie
 if(przOn()){const h=przHost(),who=S.people.filter(przGoes);S.przH=h.id;S.przD=Math.floor(S.day);
  for(let a=0;a<who.length;a++)for(let b=a+1;b<who.length;b++){const x=who[a],y=who[b];if(typeof relAdd==='function')relAdd(x,y,x.sex!==y.sex&&x.age<26&&y.age<26?1.6:.6)}
  S.hope=clamp(S.hope+.002*K,0,1);if(!S.seen.przadki){S.seen.przadki=1;const fm=famName(Object.values(S.fams).find(f=>f.home===h.id)?.id);log(`Pierwsze prządki. Wieczorem kobiety i młodzi schodzą się z kądzielami do chaty ${fm!=='?'?'rodziny '+gen(fm):'przy placu'}. Przędą przy łuczywie, śpiewają, a chłopcy przychodzą niby po ogień.`);toast('Prządki');pamAdd(2,'obrzed')}
  else if(Math.random()<.06)log(['Na prządkach ktoś opowiada o strzygach i wszyscy boją się wracać po ciemku.','Na prządkach dziewczęta śpiewają przyśpiewki o chłopcach, a chłopcy udają, że nie słyszą.','Na prządkach wróży się z wosku lanego do wody. Każda chce wiedzieć, kogo poślubi.'][(Math.random()*3)|0])}
 else S.przH=null}
{const _hs=homeSpot;homeSpot=function(p){if(S&&S.przH&&tod()>=T1-.02&&przGoes(p)){const h=bById(S.przH);if(h&&bDone(h)){const e=entryOf(h.kind,h.i,h.j);if(e)return e}}return _hs(p)}}
const przGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffb060,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));przGlow.scale.set(3.2,3.2,1);scene.add(przGlow);
function wieczHTML(){const m=S.wiecz||'auto',cur=S.wieczM||wieczAuto();return`<h3>Wieczory</h3><div class="card"><p>Po pracy, przy łuczywie, każda chata coś robi. Zimą wieczory są długie, więc i pożytek większy.</p>
 <div class="dchips" style="margin-top:6px">${[['auto','Sami wiedzą']].concat(Object.entries(WIECZ).map(([k,v])=>[k,v[0]])).map(([k,n])=>`<button data-wiecz="${k}" class="${m===k?'on':''}">${n}</button>`).join('')}</div>
 <p class="mut" style="margin-top:6px">${m==='auto'?'Teraz: '+WIECZ[cur][0].toLowerCase()+'. ':''}${WIECZ[cur][1]}${S.wieczLast?' Ostatni wieczór: '+S.wieczLast+'.':''}${przOn()?' Od jesieni do wiosny przy kądzieli są prządki: młodzi i kobiety schodzą się do jednej chaty, a z tego bywają swaty.':''}</p></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-wiecz]');if(!b||!S)return;S.wiecz=b.dataset.wiecz;S.wieczM=S.wiecz==='auto'?wieczAuto():S.wiecz;renderPanel()});

// ---------- dowóz materiałów na budowę ----------
const MATW={drewno:1,kamien:1,glina:1,cegla:.8,deski:.6,gwozdzie:.08,plotno:.3,narz:.5,skory:.4,wlokna:.2,naczynia:.3};
function matOf(c){return Object.entries(c||{}).reduce((a,[k,v])=>a+v*(MATW[k]===undefined?.5:MATW[k]),0)}
function matRes(b){const c=BD[b.kind].cost||{};return Object.entries(c).sort((x,y)=>y[1]*(MATW[y[0]]||.5)-x[1]*(MATW[x[0]]||.5))[0]?.[0]||'drewno'}
function haulCap(p){return 6*(p.trait==='Silny'?1.4:1)*(p.age<16?.6:1)*(p.woz?WOZ_CAP:1)}
{const _tp=tryPlace;tryPlace=function(){const n0=S?S.bld.length:0;_tp();if(S&&S.bld.length>n0){const b=S.bld[S.bld.length-1];const m=matOf(BD[b.kind].cost);if(m>0){b.mat=Math.round(m*10)/10;b.del=0;
  // budowa tuż przy składzie albo obozie: część materiału od razu na miejscu
  const c=bCenter(b);const near=[[camp.i,camp.j]].concat(S.bld.filter(x=>bDone(x)&&BD[x.kind].store==='all').map(x=>[x.i,x.j])).some(([i,j])=>Math.hypot(i-b.i,j-b.j)<7);if(near)b.del=b.mat*.6}}}}
function haulEnd(p){const s=bById(p.haulB);if(s){s.haul=Math.max(0,(s.haul||0)-1);if(p.haulQ)s.inTr=Math.max(0,(s.inTr||0)-p.haulQ)}p.haulB=null;p.haulQ=0;if(p.carry&&p.carry[0]&&p.carry[0].q===0)p.carry=null}
function haulSite(lim){return S.bld.find(b=>!bDone(b)&&b.mat&&!(b.unr>S.day)&&(b.del||0)+(b.inTr||0)<b.mat-.01&&(b.haul||0)<lim)}
function siteCap(b){return b.mat?b.work*Math.min(1,(b.del||0)/b.mat):b.work}
function goNow(p,tile,after){const[pi,pj]=tileOf(p.x,p.z);if(Math.hypot(tile[0]-pi,tile[1]-pj)<=1.01){p.after=after;p.path=null;onArrive(p);return true}if(go(p,tile,after,null))return true;const t=nearestWalk(pi,pj);if(t&&(t[0]!==pi||t[1]!==pj)){p.x=tcx(t[0]);p.z=tcx(t[1]);return go(p,tile,after,null)}return false}
{const _pj=planJob;planJob=function(p){if(p.haulB)haulEnd(p);{const[ti,tj]=tileOf(p.x,p.z);if(!walk[tj*N+ti]){const t=nearestWalk(ti,tj);if(t){p.x=tcx(t[0]);p.z=tcx(t[1])}}}
  if(S&&!p.fireB&&isAdult(p)&&(p.job==='rob'||!p.job)&&isWorker(p)&&!restNow(p)){
   const cand=S.bld.filter(b=>!bDone(b)&&!b.proj&&(b.workers||0)<4&&b.prog<siteCap(b)-.02&&!(b.unr>S.day)).sort((a,b)=>Math.hypot(a.i-p.x-N/2,a.j-p.z-N/2)-Math.hypot(b.i-p.x-N/2,b.j-p.z-N/2));const bs=cand[0];
   const hs=haulSite(2)||(!bs&&haulSite(6));
   if(bs&&(!hs||Math.random()<.6)){for(const b of cand.slice(0,4)){const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'build',b)){b.workers=(b.workers||0)+1;p.act='buduje: '+BD[b.kind].n.toLowerCase();return true}b.unr=S.day+.5;b.unrN=(b.unrN||0)+1}}
   if(hs){const st=haulFrom(p,hs);hs.haul=(hs.haul||0)+1;p.haulB=hs.id;p.act='idzie po materiał: '+BD[hs.kind].n.toLowerCase();if(st&&goNow(p,st,'haulPick'))return true;haulEnd(p)}}
  return _pj(p)}}
{const _oa=onArrive;onArrive=function(p){const a=p.after;if(a!=='haulPick'&&a!=='haulDrop')return _oa(p);p.after=null;p.wt=0;const s=bById(p.haulB);
  if(!s||bDone(s)||!s.mat){haulEnd(p);p.state='idle';return}
  if(a==='haulPick'){const q=Math.min(haulCap(p),s.mat-(s.del||0)-(s.inTr||0));if(q<=.01){haulEnd(p);p.state='idle';return}s.inTr=(s.inTr||0)+q;p.haulQ=q;p.carry=[{res:matRes(s),q:0}];
   p.act='niesie materiał na budowę: '+BD[s.kind].n.toLowerCase();const e=entryOf(s.kind,s.i,s.j);if(e&&goNow(p,e,'haulDrop'))return;const t=nearestWalk(...tileOf(p.x,p.z));if(t){p.x=tcx(t[0]);p.z=tcx(t[1]);if(e&&goNow(p,e,'haulDrop'))return}
   s.del=Math.min(s.mat,(s.del||0)+q);s.inTr=Math.max(0,(s.inTr||0)-q);p.haulQ=0;p.carry=null;haulEnd(p);p.state='idle';p.wait=1.5;return}
  s.del=Math.min(s.mat,(s.del||0)+(p.haulQ||0));s.inTr=Math.max(0,(s.inTr||0)-(p.haulQ||0));p.haulQ=0;p.carry=null;haulEnd(p);gainXp(p,'ciesla',.4);p.state='idle';p.wait=.2}}
function haulDaily(){S.bld.forEach(b=>{b.haul=0;b.inTr=0;b.workers=S.people.filter(p=>p.tgt===b&&p.state==='work').length});S.people.forEach(p=>{if(p.haulB){p.haulB=null;p.haulQ=0;if(p.carry&&p.carry[0]&&p.carry[0].q===0)p.carry=null}})}

// ---------- jakość wyrobów i pamiątki ----------
const QRES={narz:'narzędzia żelazne',narzk:'narzędzia kamienne',odziez:'odzież',naczynia:'naczynia',deski:'deski',plotno:'płótno',chleb:'chleb',ser:'ser'};
function qWord(q){return q<.85?'licha':q<1?'zwykła':q<1.15?'dobra':'mistrzowska'}
const PAM_N={narz:[['siekierę','Siekiera',1],['topór','Topór'],['nóż','Nóż']],odziez:[['kożuch','Kożuch'],['serdak','Serdak'],['płaszcz','Płaszcz']],naczynia:[['dzban','Dzban'],['misę','Misa',1]],deski:[['skrzynię','Skrzynia',1],['kołyskę','Kołyska',1]],plotno:[['obrus','Obrus'],['pas tkany','Pas tkany']]};
function gospMade(b,r,v){if(!S)return;const workers=b.id!==undefined?S.people.filter(x=>x.job==='wb'&&x.wb===b.id):[];const d=BD[b.kind]||{};
 const sk=workers.length?Math.max(...workers.map(x=>x.sk[d.c]||0)):0;
 if(r in QRES&&!(r==='narz'||r==='narzk'||r==='odziez')){const q=b._q||(.7+.12*sk);S.toolQ=S.toolQ||{};const o=S.toolQ[r]||1,st=Math.max(0,S.res[r]||0);S.toolQ[r]=(o*st+q*v)/(st+v)}
 // wyrób mistrzowski: tylko z ręki mistrza
 if(PAM_N[r]&&sk>=4&&workers.length&&S.day>=(S.pamT||0)&&Math.random()<.005*(sk-3)){S.pamT=S.day+YEAR/2;const m=workers.sort((x,y)=>(y.sk[d.c]||0)-(x.sk[d.c]||0))[0];S.pamiatki=S.pamiatki||[];if(S.pamiatki.length>=24)return;
  const nn=PAM_N[r][(Math.random()*PAM_N[r].length)|0];const it={n:`${nn[1]} ${gen(m.name)}`,k:r,by:m.name,owner:m.id,d:Math.floor(S.day)+1};S.pamiatki.push(it);m.pamiatka=1;pamAdd(2,'pamiatka');
  log(`${m.name} kończy ${nn[0]}, o ${nn[2]?'której':'którym'} mówi cała osada. Ludzie przychodzą popatrzeć. Takie rzeczy przechodzą z ojca na syna i z matki na córkę.`);toast('Wyrób mistrzowski: '+it.n)}}
function pamOwner(it){return pById(it.owner)}
{const _e=eff;eff=function(p){return _e(p)*(p.pamiatka?1.05:1)}}
{const _kp=killPerson;killPerson=function(p,why){const mine=(S.pamiatki||[]).filter(it=>it.owner===p.id);_kp(p,why);
  mine.forEach(it=>{const heir=S.people.filter(q=>(q.par||[]).includes(p.id)).sort((a,b)=>b.age-a.age)[0]||S.people.filter(q=>q.fam===p.fam&&isAdult(q)).sort((a,b)=>b.age-a.age)[0]||S.people.filter(q=>String(q.rod)===String(p.rod)).sort((a,b)=>b.age-a.age)[0];
   if(heir){it.owner=heir.id;it.h=(it.h||[]).concat(heir.name);heir.pamiatka=1;log(`${it.n} przechodzi w ręce ${gen(heir.name)}. Odtąd ${heir.sex==='k'?'ona':'on'} tego pilnuje.`)}else{it.owner=null;it.lost=1}})}}
function qualDaily(){const q=S.toolQ||{};if(S.res.chleb>1&&q.chleb)S.hope=clamp(S.hope+(q.chleb-1)*.004*K,0,1);if(S.res.ser>1&&q.ser)S.hope=clamp(S.hope+(q.ser-1)*.002*K,0,1);
 S.people.forEach(p=>{p.pamiatka=(S.pamiatki||[]).some(it=>it.owner===p.id)?1:0})}

// ---------- codziennie ----------
{const _ad=actDaily;actDaily=function(){_ad();wieczDaily();haulDaily();qualDaily()}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;const t=tod(),night=t>=T1-.02||t<T0;const h=S.przH&&night?bById(S.przH):null;
  if(h){const c=bCenter(h);przGlow.position.set(c.x,Hy(c.x,c.z)+1.4,c.z);przGlow.material.opacity=.55+.1*Math.sin(clock*7)}else przGlow.material.opacity=0}}

// ---------- panel: gospodarstwa ----------
function gospHTML(){const fams=Object.values(S.fams).filter(f=>famMembers(f.id).length);const tot=spizTot(),allNeed=K*S.people.reduce((a,p)=>a+pNeed(p),0);const q=S.toolQ||{};
 const rich=fams.filter(f=>spizCap(f)).sort((a,b)=>(b.sp||0)-(a.sp||0));const pam=(S.pamiatki||[]).filter(x=>!x.lost);
 return`<div class="card"><h4>Gospodarstwa</h4><p>W spiżarkach rodzin: ${Math.round(tot)} jedzenia${allNeed>0?`, dla całej osady na ${Math.floor(tot/allNeed)} ${dniW(Math.floor(tot/allNeed))}`:''}. Gdy we wspólnej spiżarni zabraknie, rodziny jedzą ze swoich.</p>
 ${rich.length>1?`<p class="mut">Najwięcej ma rodzina ${gen(famName(rich[0].id))}, najmniej ${gen(famName(rich[rich.length-1].id))}. ${law('u_swoje')?'Każdy na swoim: więcej mają rodziny, które zdobywają jedzenie.':law('u_wspolne')?'Wszystko wspólne: spiżarki pełnią się po równo.':law('u_starsi')?'Słuchamy starszych: najpierw dostają rody najstarszych.':''}</p>`:''}
 <p><b>Wyroby:</b> ${Object.entries(QRES).filter(([k])=>q[k]).map(([k,n])=>`${n} ${qWord(q[k])}`).join(' · ')||'jeszcze nic nie zrobiono w osadzie'}</p>
 <p class="mut">Jakość zależy od ręki: mistrz robi rzeczy, które służą dłużej. Dobre naczynia chronią zapasy w domach, dobry chleb i ser cieszą ludzi.</p>
 ${pam.length?`<p><b>Pamiątki:</b> ${pam.map(it=>{const o=pamOwner(it);return`${it.n}${o&&o.name!==it.by?' (teraz u '+gen(o.name)+')':''}`}).join(', ')}</p>`:''}</div>`}
{const _hh=hamletHTML;hamletHTML=function(){return gospHTML()+_hh()}}
{const _kt=ksiegaText;ksiegaText=function(){let t=_kt();const pam=(S.pamiatki||[]).filter(x=>!x.lost);if(!pam.length)return t;
 const sec='PAMIĄTKI\n\n'+pam.map(it=>`${it.n}: zrobione ${dayName(it.d)}${it.h&&it.h.length?', potem u: '+it.h.join(', '):''}.`).join('\n')+'\n\n';const k=t.indexOf('Pamięć osady:');return k>=0?t.slice(0,k)+sec+t.slice(k):t+'\n\n'+sec}}
