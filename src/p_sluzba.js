
// ================= 1.3 Prace we wsi: kto nie ma przydziału, robi to, co trzeba =================
// [co robi (do karty człowieka), nazwa na liście, czas pracy]
const CHORE={chrust:['zbiera chrust na opał','Chrust na opał',6],rabanie:['rąbie drewno przy domu','Rąbanie drewna',7],zbior:['zbiera jagody i grzyby','Zbieranie jedzenia',5],
 ryby:['łowi ryby z brzegu','Ryby z brzegu',8],naprawa:['łata dach i ściany','Naprawy domostw',9],woda:['nosi wodę do domów','Noszenie wody',3],opieka:['opiekuje się chorym','Opieka nad chorymi',12]};
const isFree=p=>p.job==='rob'||p.job==='bud'||!p.job;
function choreCands(p){const C=[],sea=seasonIdx(),fd=czNeedDays(),op=S.res.opal,pop=S.people.length,young=p.age<15,old=p.age>=55;
 const winterish=sea===1||sea===2;const add=(k,w)=>C.push([k,w]);
 const opNeed=winterish?Math.max(0,(160-op)/160):Math.max(0,(70-op)/70)*.7;
 if(opNeed>0||op<300){add('chrust',.5+3*opNeed);if(S.res.drewno>=25&&!young&&opNeed>.2)add('rabanie',(.2+2*opNeed)*(S.res.drewno>60?1:.5))}
 const room=foodTotal()<foodCap()-20;const fNeed=room&&fd<15?(15-fd)/15:0;
 if(room&&sea!==2)add('zbior',.4+3*fNeed);
 if(room&&fNeed>0&&!young)add('ryby',.3+2*fNeed);
 const worn=S.bld.filter(b=>bDone(b)&&!b.proj&&!b.fire&&condOf(b)<.8);
 if(worn.length&&!young){const low=Math.min(...worn.map(condOf));add('naprawa',.6+3*(1-low)*Math.min(1,worn.length/3))}
 if(waterNeedOn()&&waterCap()<pop)add('woda',1+3*(1-waterCap()/pop)*(young?1.4:1));
 const sick=S.people.filter(q=>q!==p&&q.hp<.6&&q.job!=='wyp');if(sick.length){const own=sick.some(q=>q.fam===p.fam);add('opieka',(own?2.6:.9)*(old?1.4:1))}
 C.forEach(c=>{const n=S.people.filter(q=>q!==p&&q.chK===c[0]&&isFree(q)&&q.state!=='sleep').length;c[1]/=1+.5*n;if(p.chK===c[0])c[1]*=1.35;
  if(p.trait==='Silny'&&(c[0]==='rabanie'||c[0]==='chrust'))c[1]*=1.3;if(young&&c[0]==='zbior')c[1]*=1.4;if(old&&c[0]==='naprawa')c[1]*=1.3});
 return C.sort((a,b)=>b[1]-a[1])}
function chPick(C){const top=C.slice(0,3);let tot=top.reduce((a,c)=>a+c[1],0),x=Math.random()*tot;for(const c of top){if(x<c[1])return c;x-=c[1]}return top[0]}
function chGo(p,tile,k,extra){if(!tile)return false;Object.assign(p,{chK:k,chN:null,chB:null,chP:null,chPh:0},extra||{});if(go(p,tile,'chore',null)){p.act=CHORE[k][0]+(extra&&extra.actX?extra.actX:'');return true}return false}
function nearHouse(p){const h=homeOf(p);if(h&&bDone(h))return h;let best=null,bd=1e9;S.bld.forEach(b=>{if(!bDone(b)||!BD[b.kind].house)return;const c=bCenter(b);const d=Math.hypot(c.x-p.x,c.z-p.z);if(d<bd){bd=d;best=b}});return best}
function choreDo(p,k){const c={x:tcx(camp.i),z:tcx(camp.j)};
 if(k==='zbior'||k==='ryby'){const T=k==='ryby'?['fish']:['bush','grzyb','zboze'].concat(tech('u_rozp')?['ziola']:[]);let best=null,bd=1e9;
  for(const t of T)for(const n of nodeBy[t]){const max=t==='fish'?2:1;if(!mkUsable(n)||n.claim>=max||n.bad>S.t||seasonYield(n.type)<=0)continue;const st=mkStand(n);if(!revAt(st[0],st[1]))continue;
   const dc=Math.hypot(n.x-c.x,n.z-c.z);if(dc>28)continue;const d=Math.abs(n.x-p.x)+Math.abs(n.z-p.z)+dc*.4;if(d<bd){bd=d;best=n}}
  if(!best)return false;const s=mkStand(best);const st=nearestWalk(s[0],s[1]);if(!st){best.bad=S.t+40;return false}
  if(go(p,st,'mark',best)){best.claim++;p.mkAuto=true;p.chK=k;p.act=CHORE[k][0];return true}return false}
 if(k==='chrust'){const L=[];for(const n of nodeBy.tree){if(n.gone)continue;const dc=Math.hypot(n.x-c.x,n.z-c.z);if(dc<4||dc>22||!revAt(n.i,n.j))continue;L.push([Math.abs(n.x-p.x)+Math.abs(n.z-p.z),n])}
  if(!L.length)return false;L.sort((a,b)=>a[0]-b[0]);const n=L[(Math.random()*Math.min(6,L.length))|0][1];return chGo(p,nearestWalk(n.i,n.j),k,{chN:n.id})}
 if(k==='rabanie'){const h=nearHouse(p);const e=h?entryOf(h.kind,h.i,h.j):[camp.i,camp.j+1];return chGo(p,e,k,{chB:h?h.id:null})}
 if(k==='naprawa'){const L=S.bld.filter(b=>bDone(b)&&!b.proj&&!b.fire&&condOf(b)<.8&&!S.people.some(q=>q!==p&&q.chK==='naprawa'&&q.chB===b.id&&q.state!=='sleep'));if(!L.length)return false;
  L.sort((a,b)=>(condOf(a)-condOf(b))+(BD[b.kind].house?0:.15)-(BD[a.kind].house?0:.15));const b=L[0];const own=Object.values(S.fams).find(f=>f.home===b.id);
  return chGo(p,entryOf(b.kind,b.i,b.j),k,{chB:b.id,actX:own?` u ${gen(famName(own.id))}`:`: ${BD[b.kind].n.toLowerCase()}`})}
 if(k==='woda'){const w=S.bld.find(b=>b.kind==='studnia'&&bDone(b));let src=null;if(w)src=entryOf(w.kind,w.i,w.j);else{const q=waterNear(p.x,p.z);if(q)src=nearestWalk(...tileOf(q.x,q.z))}
  return chGo(p,src,k,{actX:w?' ze studni':' ze strumienia'})}
 if(k==='opieka'){const sick=S.people.filter(q=>q!==p&&q.hp<.6&&q.job!=='wyp').sort((a,b)=>((b.fam===p.fam)-(a.fam===p.fam))||(a.hp-b.hp));const q=sick[0];if(!q)return false;
  const h=homeOf(q);const t=h&&bDone(h)?entryOf(h.kind,h.i,h.j):nearestWalk(...tileOf(q.x,q.z));return chGo(p,t,k,{chP:q.id,actX:`: ${q.name}`})}
 return false}
function choreJob(p){if(!S||!isWorker(p)||!isFree(p))return false;const C=choreCands(p);
 for(let t=0;t<3&&C.length;t++){const c=chPick(C);C.splice(C.indexOf(c),1);if(choreDo(p,c[0]))return true}
 p.chK=null;p.act='odpoczywa, nic pilnego';return false}
autoJob=function(p){return choreJob(p)};
{const _oa=onArrive;onArrive=function(p){if(p.after!=='chore')return _oa(p);p.after=null;p.wt=0;p.state='work';p.workKind='chore'}}
function chLog(p,k,x){S.chLog=S.chLog||[];S.chLog.push({k,id:p.id,x:x||'',d:Math.floor(S.day)});if(S.chLog.length>12)S.chLog.shift();S.chDay=S.chDay||{};S.chDay[k]=(S.chDay[k]||0)+1}
{const _sp=stepPerson;stepPerson=function(p,dt){
  if(p.state==='work'&&p.workKind==='chore'&&isWork()&&!p.fireB){const k=p.chK;
   if(!k||!CHORE[k]||!isFree(p)){p.state='idle';p.wait=.2;return}
   const e=eff(p);p.wt+=dt*e;const T=CHORE[k][2];
   if(k==='chrust'){gainXp(p,'drwal',dt*.3);if(p.wt>=T){p.wt=0;chLog(p,k);finishTrip(p,[{res:'opal',q:1.2}])}return}
   if(k==='rabanie'){gainXp(p,'drwal',dt*.5);if(p.wt>=T*(p.trait==='Silny'?.8:1)){p.wt=0;if(S.res.drewno>=20){S.res.drewno-=1;S.res.opal+=2;chLog(p,k)}else{p.chK=null}p.state='idle';p.wait=.3}return}
   if(k==='naprawa'){const b=bById(p.chB);if(!b||!bDone(b)||b.proj||condOf(b)>=.98){p.chK=null;p.state='idle';p.wait=.2;return}gainXp(p,'ciesla',dt*.6);
    if(p.wt>=T){p.wt=0;const wood=S.res.drewno>=.3;if(wood)S.res.drewno-=.3;b.cond=Math.min(1,condOf(b)+(wood?.06:.025)*craftEff(p,'ciesla'));const own=Object.values(S.fams).find(f=>f.home===b.id);chLog(p,k,own?gen(famName(own.id)):'');p.state='idle';p.wait=.3}return}
   if(k==='woda'){if(p.chPh!==1){if(p.wt>=T){p.wt=0;p.chPh=1;p.carry=[{res:'woda',q:0}];const h=nearHouse(p)||null;const S2=S.bld.filter(b=>bDone(b)&&BD[b.kind].house);const tgt=S2.length?S2[(Math.random()*S2.length)|0]:h;
      const t=tgt?entryOf(tgt.kind,tgt.i,tgt.j):[camp.i,camp.j+1];p.act='niesie wodę';if(!go(p,t,'chore',null)){p.carry=null;p.state='idle'}}return}
    if(p.wt>=1){p.wt=0;p.carry=null;p.chPh=0;S.wBonus=(S.wBonus||0)+2.5;chLog(p,k);p.state='idle';p.wait=.2}return}
   if(k==='opieka'){const q=pById(p.chP);if(!q||q.hp>=.85){p.chK=null;p.state='idle';p.wait=.2;return}q.hp=Math.min(1,q.hp+dt*.0035*(offHolder&&offHolder('zielarka')?1.3:1)*(S.res.ziola>0?1.2:1));if(p.wt>=T){p.wt=0;chLog(p,k,q.name);p.state='idle';p.wait=.2}return}
   p.state='idle';return}
  return _sp(p,dt)}}
// mark-zbiór z prac we wsi też liczony
{const _fy=mkYield;mkYield=function(p,n){if(p.mkAuto&&(p.chK==='zbior'||p.chK==='ryby'))chLog(p,p.chK);return _fy(p,n)}}
{const _ad=actDaily;actDaily=function(){_ad();if(!S)return;S.wBonus=(S.wBonus||0)*.35;S.chDay={}}}

// ---------- karta w zakładce Praca ----------
function choreHTML(){const L={};S.people.forEach(p=>{if(isFree(p)&&isWorker(p)&&p.chK&&CHORE[p.chK]&&p.state!=='sleep')(L[p.chK]=L[p.chK]||[]).push(p.name)});
 const ks=Object.keys(L);const done=S.chDay?Object.entries(S.chDay):[];
 return`<div class="card"><h4>Prace we wsi</h4>${ks.length?ks.map(k=>`<p><b style="color:var(--hi)">${CHORE[k][1]}</b>: ${L[k].join(', ')}</p>`).join(''):'<p class="mut">Teraz nikt nie ma wolnej chwili.</p>'}<p class="mut">Kto nie ma przydziału, sam bierze się za proste prace, których osada w tej chwili najbardziej potrzebuje: chrust i rąbanie na opał, jagody i grzyby, ryby z brzegu, łatanie domów, noszenie wody latem, opieka nad chorymi. Najpierw jednak zaznaczone na mapie, budowa i wrak.</p></div>`}
{const _br=budRowHTML;budRowHTML=function(){return _br()+choreHTML()}}

// ---------- przy ognisku: ludzie mówią o swojej pracy ----------
function chSay(e){const p=pById(e.id);if(!p)return null;const s=p.sex==='k'?'am':'em';
 const T={chrust:`Nazbierał${s} chrustu na kilka wieczorów.`,rabanie:`Narąbał${s} drewna pod ścianą. Zima nas nie zaskoczy.`,zbior:`Jagód było tyle, że kosz ledwo doniosł${s}.`,ryby:`Z brzegu też coś bierze, jak się ma cierpliwość.`,
  naprawa:e.x?`Połatał${s} dach u ${e.x}. Przez jakiś czas nie będzie kapać.`:`Połatał${s} ściany w warsztacie. Wytrzyma do wiosny.`,woda:`Nanosił${s} wody do domów. Ręce mi odpadają.`,opieka:e.x?`${e.x} już lepiej. Gorączka spada.`:`Chorym trzeba siedzieć przy głowie, nic więcej.`}[e.k];
 return T?[T,p.name]:null}
{const _ct=czTalkLines;czTalkLines=function(){const L=_ct();if(!S.chLog||Math.random()<.35)return L;const d=Math.floor(S.day);const R=S.chLog.filter(e=>e.d===d);if(!R.length)return L;
  const s=chSay(R[(Math.random()*R.length)|0]);if(s){if(L.length>=2)L[1]=s;else L.push(s)}return L}}
window.__ch={choreDo,choreCands,choreJob,choreHTML,CHORE};
