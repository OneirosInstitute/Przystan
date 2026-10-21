
/* ================= 4.8.0 Dusza osadnika: usposobienie, upodobania, nastrój, dzień i wspomnienia ================= */
// Każdy ma dwa rysy usposobienia, upodobania, nastrój liczony raz na dobę, zapis dzisiejszego dnia i do 12 wspomnień.
// Z tego biorą się wieczorne rozmowy (p_wieczor.js). Nic nie liczy się w każdej klatce poza jednym dodawaniem przy pracy.
const USP={
 gadula:['Gadatliwy','Gadatliwa','mówi dużo i chętnie'],milczek:['Milczący','Milcząca','odzywa się rzadko'],spiew:['Rozśpiewany','Rozśpiewana','nuci przy pracy i przy ogniu'],
 marzy:['Marzyciel','Marzycielka','patrzy w morze i w gwiazdy, ma żywe sny'],zrzeda:['Zrzędliwy','Zrzędliwa','zawsze coś mu nie pasuje'],wesoly:['Wesoły','Wesoła','żartuje nawet w złe dni'],
 bogo:['Bogobojny','Bogobojna','pamięta o bogach i obrzędach'],ciekaw:['Ciekawski','Ciekawska','wszędzie zajrzy, o wszystko pyta'],teskni:['Tęskniący','Tęskniąca','wciąż wspomina dawne strony'],
 opiek:['Opiekuńczy','Opiekuńcza','pilnuje dzieci i chorych'],porywczy:['Porywczy','Porywcza','łatwo wybucha, szybko się godzi'],lagodny:['Łagodny','Łagodna','godzi zwaśnionych'],
 dumny:['Dumny','Dumna','chwali swoją robotę'],zabobon:['Zabobonny','Zabobonna','widzi znaki i boi się złych mocy'],kpiarz:['Kpiarz','Kpiarka','docina, ale bez złości'],gosp:['Gospodarny','Gospodarna','liczy każdy worek']};
const UKEYS=Object.keys(USP);
const UMIEJ={morze:'nad morzem',las:'w lesie',ogien:'przy ogniu',pola:'w polu',gory:'w górach'},ULEK={wilki:'wilków',morze:'głębokiej wody',burza:'burzy',ciemnosc:'ciemności',choroba:'choroby'};
// deterministyczny skrót: ten sam człowiek ma zawsze ten sam charakter, także w starym zapisie
function dHash(a,b){let h=(Math.imul((a|0)+0x9e37,0x85ebca6b)^Math.imul((b|0)+0x27d4,0xc2b2ae35))>>>0;h^=h>>>15;h=Math.imul(h,0x2c1b3c6d)>>>0;h^=h>>>12;return h>>>0}
const usp=(p,k)=>!!(p&&p.us&&p.us.includes(k));
function soulOf(p){if(p.us&&p.lub)return p;const h=dHash(p.id,S&&S.seed||7),h2=dHash(h,p.id+3);
 if(!p.us){const par=(p.par||[]).map(pById).filter(Boolean);let a=UKEYS[h%UKEYS.length];if(par.length&&h%3===0){const q=par[h%par.length];if(q.us)a=q.us[h%2]}
  let b=UKEYS[(h2>>>3)%UKEYS.length];if(b===a)b=UKEYS[(UKEYS.indexOf(a)+5)%UKEYS.length];p.us=[a,b]}
 if(!p.lub){const best=Object.keys(CN).sort((x,y)=>(p.sk[y]||0)-(p.sk[x]||0))[0];const crafts=Object.keys(CN);
  p.lub={m:Object.keys(UMIEJ)[(h>>>5)%5],p:(h2>>>7)%4,f:(h>>>9)%3===0?crafts[(h2>>>11)%crafts.length]:best,l:Object.keys(ULEK)[(h2>>>13)%5]}}
 if(p.mood===undefined)p.mood=0;return p}
function uspN(p,k){const u=USP[k];return u?(p.sex==='k'?u[1]:u[0]):''}
const gw=(p,m,f)=>p&&p.sex==='k'?f:m;

/* ---- dzień: co ktoś robił, co przyniósł, co go spotkało ---- */
function dzOf(p){const d=Math.floor(S.day);if(!p.dzn||p.dzn.d!==d){if(p.dzn&&p.dzn.d===d-1)p.dznY=p.dzn;p.dzn={d,w:{},g:{},e:[]}}return p.dzn}
function dayEv(p,k,ref){if(!p)return;const z=dzOf(p);if(z.e.length<6&&!z.e.some(e=>e[0]===k&&e[1]===ref))z.e.push([k,ref===undefined?null:ref])}
{const _g=gainXp;gainXp=function(p,c,dt){_g(p,c,dt);if(S&&p&&dt>0){const z=dzOf(p);z.w[c]=(z.w[c]||0)+dt}}}
{const _ft=finishTrip;finishTrip=function(p,items){_ft(p,items);if(S&&p&&items){const z=dzOf(p);for(const it of items)if(it&&it.res)z.g[it.res]=(z.g[it.res]||0)+(it.q||0)}}}
// awanse: jedna linijka dnia zamiast osobnego wpisu dla każdego; mistrzostwo zostaje osobno
lvUp=function(p,c,lv){dayEv(p,'awans',c+':'+lv);if(lv>=4){log(`${p.name} ${lv===5?gw(p,'jest już mistrzem','jest już mistrzynią'):gw(p,'jest już biegły','jest już biegła')}: ${CN[c]} ${lv}.`);memAdd(p,'mistrz',c,.3,1);return}
 S.lvq=S.lvq||[];if(S.lvq.length<40)S.lvq.push([p.name,CN[c],lv])};
function lvFlush(){const q=S.lvq;if(!q||!q.length)return;S.lvq=[];if(q.length===1){log(`${q[0][0]} lepiej zna swój fach: ${q[0][1]} ${q[0][2]}.`);return}
 log(`${LICZ[Math.min(q.length,LICZ.length-1)]||q.length+' osób'} lepiej zna swój fach: ${q.slice(0,6).map(x=>`${x[0]} (${x[1]} ${x[2]})`).join(', ')}${q.length>6?' i inni':''}.`)}
const LICZ=['','Jedna osoba','Dwoje','Troje','Czworo','Pięcioro','Sześcioro','Siedmioro','Ośmioro','Dziewięcioro','Dziesięcioro'];

/* ---- wspomnienia: [dzień, rodzaj, odniesienie, waga, trwałe] ---- */
const MEMW={slub:.5,dziecko:.45,smierc:-.6,dom:.3,rana:-.25,budowa:.12,wyprawa:.18,mistrz:.25,zdobycz:.12,pozar:-.3,sen:.08,obrzed:.12,zguba:-.2,klotnia:-.15,zjawa:-.12,dar:.15,przyjazn:.15,zgoda:.12};
function memAdd(p,k,ref,w,perm){if(!p||!S)return;soulOf(p);p.mem=p.mem||[];const d=Math.floor(S.day);w=w===undefined?(MEMW[k]||0):w;
 if(p.mem.some(m=>m[1]===k&&m[2]===ref&&d-m[0]<YEAR/2))return;p.mem.push([d,k,ref===undefined?null:ref,w,perm?1:0]);dayEv(p,k,ref);
 if(p.mem.length>12){let worst=-1,ws=1e9;p.mem.forEach((m,i)=>{if(m[4])return;const s=Math.abs(m[3])/(1+(d-m[0])/YEAR);if(s<ws){ws=s;worst=i}});p.mem.splice(worst>=0?worst:0,1)}}
const memRecent=(p,days)=>(p.mem||[]).filter(m=>Math.floor(S.day)-m[0]<=days);
// rocznica: wspomnienie z tego samego dnia roku, rok albo więcej temu
const memAnniv=p=>(p.mem||[]).filter(m=>{const a=Math.floor(S.day)-m[0];return a>=YEAR&&a%YEAR===0&&Math.abs(m[3])>=.2});

{const _w=wedding;wedding=function(k,m){const r=_w.apply(this,arguments);try{if(k&&m){memAdd(k,'slub',m.name,MEMW.slub,1);memAdd(m,'slub',k.name,MEMW.slub,1);relAdd(k,m,10)}}catch(e){}return r}}
{const _k=killPerson;killPerson=function(p,why){const near=S.people.filter(q=>q!==p&&(q.fam===p.fam||q.pair===p.id||(p.par||[]).includes(q.id)||(q.par||[]).includes(p.id)||relGet(q,p)>=30));
  const r=_k(p,why);try{near.forEach(q=>{if(S.people.includes(q))memAdd(q,'smierc',p.name,q.pair===p.id||(q.par||[]).includes(p.id)||(p.par||[]).includes(q.id)?-.75:-.45,1)});S.zmarli=S.zmarli||[];S.zmarli.push([Math.floor(S.day),p.name,p.sex]);if(S.zmarli.length>30)S.zmarli.shift()}catch(e){}return r}}
{const _cs=completeSite;completeSite=function(s){const who=S.people.filter(q=>q.tgt===s);const r=_cs(s);try{who.forEach(q=>memAdd(q,'budowa',s.kind,BD[s.kind]&&BD[s.kind].house?.2:.12))}catch(e){}return r}}
{const _er=expReturn;expReturn=function(person,e){const r=_er(person,e);try{const R=REGIONS[e&&e.r];memAdd(person,'wyprawa',R?R.name:null)}catch(err){}return r}}

/* ---- nastrój: raz na dobę ---- */
function moodCalc(p){soulOf(p);const sea=seasonIdx(),w=S.weather.k,d=Math.floor(S.day);
 // podstawą jest zadowolenie z życia (p.zad: jedzenie, ciepło, dach, zdrowie, bliscy, praca, nadzieja), do tego uczucia:
 // usposobienie do świata (stała z numeru osoby), dni lepsze i gorsze, wspomnienia, pora roku, pogoda, wieczór z ludźmi
 let m=((p.zad===undefined?.65:p.zad)-.64)*1.8+((dHash(p.id,77)%21)-10)/100+(Math.random()-.5)*.16;
 if(isAdult(p)&&p.job&&p.job!=='rob'){const c=jobCraft(p);if(c&&c===p.lub.f)m+=.1}
 if(p.eveD===d-1)m+=.05;if(p.lub.p===sea)m+=.05;
 if(['rain','storm','fog','burza'].includes(w)){if(usp(p,'zrzeda'))m-=.06;if(p.lub.l==='burza'&&(w==='storm'||w==='burza'))m-=.12}
 if(usp(p,'wesoly'))m+=.08;if(usp(p,'teskni'))m-=.04;if(usp(p,'zrzeda'))m-=.03;
 for(const x of p.mem||[]){const a=d-x[0];if(a<0)continue;m+=x[3]*Math.max(0,1-a/(x[3]<0?6:4))*(a<=1?1:.6)}
 p.mood=clamp((p.mood||0)*.45+clamp(m,-1,1)*.55,-1,1)}
// powody do karty osoby, obok tych z zadowolenia
function moodWhy(p){const d=Math.floor(S.day),r=[];const sm=(p.mem||[]).filter(x=>x[1]==='smierc'&&d-x[0]<=5).pop();if(sm)r.push('żałoba'+(sm[2]?' po '+sm[2]:''));
 if(p.wedDay!==undefined&&S.day-p.wedDay<3)r.push('świeżo po ślubie');const ch=(p.mem||[]).find(x=>x[1]==='dziecko'&&d-x[0]<=3);if(ch)r.push('narodziny dziecka');
 if(usp(p,'teskni')&&(p.mood||0)<0)r.push('tęsknota za dawnymi stronami');const rn=(p.mem||[]).find(x=>x[1]==='zjawa'&&d-x[0]<=2);if(rn)r.push('strach po tym, co widział'+(p.sex==='k'?'a':''));return r}
function moodWord(p){soulOf(p);const d=Math.floor(S.day),m=p.mood||0;
 if((p.mem||[]).some(x=>x[1]==='smierc'&&d-x[0]<=3&&x[3]<=-.6))return'w żałobie';
 if(p.wedDay!==undefined&&S.day-p.wedDay<3)return gw(p,'zakochany','zakochana');
 if(p.fedR!==undefined&&p.fedR<.6)return gw(p,'głodny','głodna');
 if(usp(p,'teskni')&&m<0)return'tęskni';
 if(p.dznY&&Object.values(p.dznY.w).reduce((a,b)=>a+b,0)>DAY*.42&&m<.2)return gw(p,'zmęczony','zmęczona');
 return m>.5?gw(p,'szczęśliwy','szczęśliwa'):m>.2?gw(p,'pogodny','pogodna'):m>-.12?gw(p,'spokojny','spokojna'):m>-.38?gw(p,'przygnębiony','przygnębiona'):gw(p,'nieszczęśliwy','nieszczęśliwa')}
function duszaDaily(){if(!S||S.epoch===4)return;const d=Math.floor(S.day);
 for(const p of S.people){soulOf(p);dzOf(p);
  // nowe dziecko: rodzice to pamiętają
  if(p.born&&!p.mB&&p.age<1){p.mB=1;(p.par||[]).map(pById).filter(Boolean).forEach(q=>memAdd(q,'dziecko',p.name,MEMW.dziecko,1))}
  // rana
  if(p.hurt&&!p.mH){p.mH=1;memAdd(p,'rana',null)}else if(!p.hurt)p.mH=0;
  // pierwszy własny dom z bali
  const h=homeOf(p);if(h&&bDone(h)&&h.kind!=='szalas'&&!p.mD&&p.age>=12&&S.day>3){p.mD=1;memAdd(p,'dom',h.kind,MEMW.dom,1)}
  moodCalc(p)}
 lvFlush()}
{const _kd=kozDaily;kozDaily=function(){_kd();try{duszaDaily()}catch(e){console.warn('dusza',e)}}}

/* ---- karta osoby ---- */
function duszaHTML(p){if(!S||!p)return'';soulOf(p);const d=Math.floor(S.day);
 const u=p.us.map(k=>`<span class="tag" title="${USP[k][2]}">${uspN(p,k)}</span>`).join('');
 const lub=p.age>=7?`<p class="mut">Najlepiej ${gw(p,'czuje się','czuje się')} ${UMIEJ[p.lub.m]}, ${['latem','jesienią','zimą','wiosną'][p.lub.p]}${p.lub.f?' · lubi pracę: '+CN[p.lub.f]:''} · boi się ${ULEK[p.lub.l]}</p>`:'';
 const z=p.dzn&&p.dzn.d===d?p.dzn:null,top=z?Object.entries(z.w).sort((a,b)=>b[1]-a[1])[0]:null,got=z?Object.entries(z.g).filter(x=>x[1]>=1).sort((a,b)=>b[1]-a[1]).slice(0,2):[];
 const dzis=top&&top[1]>5?`<p class="mut">Dziś: ${CN[top[0]]}${got.length?' · '+got.map(([r,q])=>(RN[r]||r).toLowerCase()+' '+Math.round(q)).join(', '):''}</p>`:'';
 const mem=(p.mem||[]).slice().sort((a,b)=>(b[4]-a[4])||(Math.abs(b[3])-Math.abs(a[3]))).slice(0,4).map(m=>`<li>${memText(p,m)} <small>${agoTxt(d-m[0])}</small></li>`).join('');
 return`<div class="dusza"><p class="mut">Usposobienie: ${u}</p>${lub}${dzis}${mem?`<details class="dmem"><summary>Wspomnienia</summary><ul>${mem}</ul></details>`:''}</div>`}
function agoTxt(a){if(a<=0)return'dziś';if(a===1)return'wczoraj';if(a<YEAR)return a+' dni temu';const y=Math.floor(a/YEAR);return y===1?'rok temu':y+' '+(y%10>=2&&y%10<=4&&(y%100<10||y%100>=20)?'lata':'lat')+' temu'}
function memText(p,m){const k=m[1],r=m[2];switch(k){
 case'slub':return`Ślub${r?' z: '+r:''}`;case'dziecko':return`Narodziny dziecka${r?': '+r:''}`;case'smierc':return`Śmierć: ${r||'ktoś bliski'}`;
 case'dom':return`Własny dom (${(BD[r]&&BD[r].n||'chata').toLowerCase()})`;case'rana':return'Rana';case'budowa':return`Przy budowie: ${(BD[r]&&BD[r].n||'budowla').toLowerCase()}`;
 case'wyprawa':return`Wyprawa${r?': '+r:''}`;case'mistrz':return`Mistrzostwo: ${CN[r]||r}`;case'zdobycz':return'Wielka zdobycz';case'pozar':return'Pożar';case'sen':return'Sen, który się sprawdził';
 case'obrzed':return`Obrzęd${r?': '+r:''}`;case'zguba':return'Zgubił się w lesie';case'klotnia':return`Kłótnia${r?' z: '+r:''}`;case'zjawa':return`${r||'Zjawa'}`;case'dar':return'Dar od kogoś';
 case'przyjazn':return`Przyjaźń${r?': '+r:''}`;case'zgoda':return`Zgoda${r?' z: '+r:''}`;default:return k}}
{const st=document.createElement('style');st.textContent='.dusza{margin:6px 0 2px}.dusza p{margin:3px 0}.dusza .tag{margin-left:4px}.dmem summary{cursor:pointer;color:var(--gold);font-size:13px;margin:3px 0}.dmem ul{margin:2px 0 4px 18px;padding:0}.dmem li{font-size:13px;margin:2px 0}.dmem small{color:var(--mut)}';document.head.appendChild(st)}
