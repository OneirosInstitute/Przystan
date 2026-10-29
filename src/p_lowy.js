
/* ================= 4.9.0-rc.24 Myśliwy, leśniczy i łowiska ================= */
// Plan życia Wyspy, pakiet 5, razem z gałęzią leśniczego z planu wiedzy (W3).
// - Leśniczy to fach (CN.lesniczy): rośnie z sadzenia i obchodów lasu, uczeń go przejmuje, a bez następcy osada traci jego wiedzę.
// - Obchód lasu: gdy nie ma gdzie sadzić, leśniczy obchodzi okolicę, liczy zwierzynę, a zimą (paśniki) dokarmia stada.
// - Rada leśniczego: przerwa w polowaniach na słabnące stado albo stado z młodymi; decyduje gracz.
// - Współpraca: leśniczy i myśliwy pracujący blisko siebie uczą się polować tam, gdzie zwierzyny jest za dużo.
// - Myśliwy: gdy w zasięgu nic nie ma, mówi, gdzie jest najbliższa zwierzyna; karta chaty pokazuje, czy zwierzyny ubywa.
// - Wiec: okres ochronny wiosną albo święty gaj (ostoja bez polowań i wyrębu). Obława na wilki po napadzie na zagrodę.
CN.lesniczy='leśniczy';DOMC.lesniczy='hodowla';
BD.lesnik.c='lesniczy';BD.lesnik.d='Leśniczy sadzi drzewa na pniakach, obchodzi las i liczy zwierzynę. Gdy osada zna paśniki, zimą dokarmia stada.';
// ---------- gałąź leśniczego w drzewku (Hodowla) ----------
[{id:'h_umiar',d:'hodowla',r:3,c:0,n:'Łowy z umiarem',xp:140,req:['h_trop'],gate:()=>hasB('lesnik')&&hasB('mysliwy'),gt:()=>'Tego uczą się razem leśniczy i myśliwy: potrzebne są leśniczówka i chata myśliwego.',
  desc:'Nie strzela się do łani z młodymi, a przetrzebione stado zostawia się w spokoju.',eff:'Leśniczy radzi przerwy w polowaniach, a stada, na które się nie poluje, odrastają o połowę szybciej.'},
 {id:'h_odnow',d:'hodowla',r:4,c:1,n:'Odnowienie lasu',xp:160,req:['h_umiar','u_sad'],desc:'Siewki z najlepszych drzew sadzi się na zrębach, zanim zarosną jeżyną.',eff:'Leśniczy sadzi dwa razy szybciej. Przy leśniczówce można postawić szkółkę drzew.'},
 {id:'h_pasnik',d:'hodowla',ep:2,r:5,c:0,n:'Paśniki i lizawki',xp:450,req:['h_umiar','h_siano'],desc:'Zimą siano w paśniku i bryła soli na pniu. Zwierzyna przestaje głodować.',eff:'Zimą leśniczy dokarmia zwierzynę w okolicy: stada lepiej przechodzą zimę, a wiosną mają więcej młodych.'},
 {id:'h_gajowka',d:'hodowla',ep:2,r:6,c:1,n:'Gajówka',xp:650,req:['h_pasnik','h_odnow'],desc:'Leśniczy ma swój dom w lesie i ucznia, który chodzi z nim na obchody.',eff:'Wiec może powierzyć urząd leśniczego: zwierzyna na całej wyspie odrasta szybciej.'}
].forEach(t=>{TECH.push(t);TECH_BY[t.id]=t});
Object.assign(TPRAC,{h_umiar:['lesniczy','mysliwy'],h_odnow:['lesniczy','drwal'],h_pasnik:['lesniczy','hodowca'],h_gajowka:['lesniczy','mysliwy']});
Object.assign(TCOST,{h_umiar:{jagody:6,drewno:6},h_odnow:{jagody:8,drewno:8},h_pasnik:{ziarno:20,drewno:12},h_gajowka:{deski:10,drewno:10}});
Object.assign(TCRAFT,{h_umiar:['lesniczy','mysliwy'],h_odnow:['lesniczy'],h_pasnik:['lesniczy'],h_gajowka:['lesniczy']});
Object.assign(ZR_HINT,{h_umiar:'Myśliwi przynieśli wczoraj łanię, a za nią szło młode. Trzeba by się umówić, na co się poluje.',h_odnow:'Na zrębie rośnie już tylko jeżyna. Gdyby posadzić siewki z najlepszych drzew…'});
BAD_IDX=null;
{const e=(EXT.lesnik||[]).find(x=>x.id==='szkolka');if(e)e.need='h_odnow'}
// ---------- urząd leśniczego (z gajówką) ----------
OFFS.push({id:'lesniczy',n:['Leśniczy osady','Leśniczka osady'],when:()=>tech('h_gajowka'),why:'Osada ma gajówkę: ktoś musi pilnować lasów całej wyspy.',d:'Pilnuje lasów i zwierzyny całej wyspy: stada odrastają szybciej.',fit:p=>(p.sk.lesniczy||0)*8+(p.sk.mysliwy||0)*2+(p.age>30?3:0)});
OFF_BY.lesniczy=OFFS[OFFS.length-1];
// ---------- obyczaj łowów (wiec) ----------
CUSTOMS.push({k:'lowy',n:'Łowy',trig:()=>hasB('mysliwy')&&S.day>=YEAR,why:'Po roku polowań na wyspie.',
 t:'Ile wolno brać z lasu',x:()=>'Myśliwi chodzą coraz dalej, a przy osadzie sarny widuje się rzadko. Przy ognisku ktoś mówi, że las też trzeba oszczędzać, jak spiżarnię.',
 o:[{id:'l_wolne',n:'Łowy bez zakazów',d:'Myśliwi polują, gdzie i kiedy chcą. Więcej mięsa teraz, mniej zwierzyny później.',r:'Postanowiono: las jest dla wszystkich i nikt nikomu nie zabrania polować.'},
  {id:'ochronny',n:'Okres ochronny wiosną',d:'Wiosną nikt nie poluje: rodzi się więcej młodych, ale wiosną nie ma dziczyzny.',r:'Postanowiono: od pierwszych liści do lata łuki wiszą na ścianie. Niech się rodzi młode.'},
  {id:'gaj',n:'Święty gaj',d:'Jeden las przy osadzie staje się ostoją: nie wolno w nim polować ani ścinać drzew. Zwierzyna ma dokąd wracać.',r:'Postanowiono: stary las niedaleko osady będzie święty. Nikt nie podniesie w nim siekiery ani łuku.'}]});
CUST_BY.lowy=CUSTOMS[CUSTOMS.length-1];
// ---------- pomocnicze ----------
const lwSea=()=>seasonIdx();
const lwYear=()=>Math.floor(S.day/YEAR);
const lwHuntable=h=>h.n>0&&ANIMAL[h.type]&&ANIMAL[h.type][3];
function lwRegion(x,z){const t=tileOf(x,z);return regionAt(t[0],t[1])}
function lwWhere(x,z){const r=lwRegion(x,z);if(r&&r.known&&r.name)return`w krainie ${r.name}`;const dx=x-tcx(camp.i),dz=z-tcx(camp.j);const a=Math.atan2(dz,dx);const k=Math.round(((a+Math.PI)/(Math.PI*2))*8)%8;
 return'daleko na '+['zachód','północny zachód','północ','północny wschód','wschód','południowy wschód','południe','południowy zachód'][k]+' od osady'}
function lwInGaj(x,z){if(S.gaj==null)return false;const r=lwRegion(x,z);return!!r&&r.id===S.gaj}
// stado chronione: rada leśniczego, okres ochronny wiosną, święty gaj, współpraca (nie rusza słabych stad)
function lwProtected(h){if(h.ochr>S.day)return true;if(law('ochronny')&&lwSea()===3)return true;if(lwInGaj(h.x,h.z))return true;if(S.wspOk&&h.n<=Math.ceil(h.max*.4))return true;return false}
function lwCount(x,z,r){const L={};let n=0,st=0;for(const h of S.herds){if(!lwHuntable(h)||Math.hypot(h.x-x,h.z-z)>r)continue;L[h.type]=(L[h.type]||0)+h.n;n+=h.n;st++}return{L,n,st}}
const lwListTxt=c=>Object.entries(c.L).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`${ANIMAL[t][0]} ${n}`).join(', ');
const lwForesters=()=>S.people.filter(p=>p.job==='wb'&&bById(p.wb)&&bById(p.wb).kind==='lesnik'&&p.state!=='away');
const lwHunters=()=>S.people.filter(p=>p.job==='wb'&&bById(p.wb)&&bById(p.wb).kind==='mysliwy'&&p.state!=='away');
// ---------- myśliwy: wybór stada i wiadomość, gdy w zasięgu nic nie ma ----------
{const _pj=planJob;planJob=function(p){const b=p.job==='wb'&&p.wb!=null?bById(p.wb):null;
  if(b&&b.kind==='mysliwy'&&bDone(b)&&S.epoch!==4){const hid=[];for(const h of S.herds)if(h.n>0&&lwProtected(h)){hid.push([h,h.n]);h.n=0}
   let r;try{r=_pj(p)}finally{for(const[h,n]of hid)h.n=n}
   if(!r&&/nie ma zwierzyny w zasięgu/.test(p.act||''))lwNoGame(p,b,hid.length>0);return r}
  if(b&&b.kind==='lesnik'&&bDone(b)&&S.epoch!==4){const r=_pj(p);if(r||!isWork()||p.fireB||restNow(p)||p.act!=='nie ma gdzie sadzić')return r;return lwObchodGo(p,b)}
  return _pj(p)}}
function lwNoGame(p,b,someHidden){const c=bCenter(b);let best=null,bd=1e9;for(const h of S.herds){if(!lwHuntable(h)||lwProtected(h)||(h.type==='niedzwiedz'&&(p.sk.mysliwy||0)<3))continue;const d=Math.hypot(h.x-c.x,h.z-c.z);if(d<bd){bd=d;best=h}}
 const closed=law('ochronny')&&lwSea()===3;
 if(closed){p.act='okres ochronny: wiosną się nie poluje';return}
 if(!best){p.act=someHidden?'zwierzyna w okolicy jest pod ochroną':'na całej wyspie nie widać zwierzyny';return}
 const who=best.type==='niedzwiedz'?'niedźwiedź':ANIMAL[best.type][0],where=lwWhere(best.x,best.z);
 p.act=`w zasięgu nie ma zwierzyny; najbliżej ${best.type==='niedzwiedz'?'jest':'są'} ${who}, ${where}`;
 S.lwNoD=S.lwNoD||{};if(S.lwNoD[b.id]!==undefined&&S.day-S.lwNoD[b.id]<SD)return;S.lwNoD[b.id]=S.day;
 log(`${p.name} wraca z tropienia: w pobliżu chaty nie ma już zwierzyny. Najbliżej ${best.type==='niedzwiedz'?'jest':'są'} ${who}, ${where}. Łowisku trzeba dać odpocząć albo postawić chatę dalej, na skraju lasu.`)}
// ---------- leśniczy: obchód lasu ----------
function lwObchodGo(p,b){const c=bCenter(b),R=rOf(b)*1.6;for(let k=0;k<6;k++){const a=Math.random()*6.28,d=R*(.4+Math.random()*.6);const t=nearestWalk(...tileOf(c.x+Math.cos(a)*d,c.z+Math.sin(a)*d));
  if(t&&go(p,t,'obchod',b)){p.act=lwSea()===2&&tech('h_pasnik')?'idzie do paśnika':'obchodzi las';return true}}return false}
{const _oa=onArrive;onArrive=function(p){if(p.after==='obchod'){const b=p.tgt||bById(p.wb);p.after=null;p.wt=0;p.state='work';p.workKind='obchod';p.tgt=b;return}_oa(p)}}
{const _sp=stepPerson;stepPerson=function(p,dt){if(p.state==='work'&&p.workKind==='obchod'&&isWork()&&!p.fireB){const b=bById(p.wb);if(!b||b.kind!=='lesnik'){p.state='idle';return}
   p.wt+=dt;gainXp(p,'lesniczy',dt);if(p.wt>=8){lwObchod(p,b);p.state='idle';p.wait=.5;p.tgt=null}return}_sp(p,dt)}}
{const _pm=personMotion;personMotion=function(p){if(S&&S.epoch!==4&&p.state==='work'&&p.workKind==='obchod'&&!p.carry)return 'care';return _pm(p)}}
function lwObchod(p,b){const c=bCenter(b),R=rOf(b)*2;S.lwCnt=S.lwCnt||{};S.lwCnt[b.id]={d:Math.floor(S.day),...lwCount(c.x,c.z,R)};
 // zima: paśnik
 if(lwSea()===2&&tech('h_pasnik')){S.lwPas=S.lwPas||{};const key=b.id+':'+Math.floor(S.day);if(!S.lwPas[key]&&(S.res.ziarno||0)>=2){S.lwPas={[key]:1};S.res.ziarno-=2;const y=lwYear();let n=0;
   for(const h of S.herds)if(lwHuntable(h)&&Math.hypot(h.x-c.x,h.z-c.z)<=R){h.fed=y;n++}
   if(n&&!S.seen['pasnik'+y]){S.seen['pasnik'+y]=1;log(`${p.name} wykłada w paśniku siano i ziarno, a na pniu zostawia bryłę soli. Zwierzyna z okolicy przychodzi tu zimą: ${n} ${n===1?'stado':n<5?'stada':'stad'}.`)}}}}
// ---------- leśniczy: sadzenie szybsze z odnowieniem lasu ----------
{const _st=stepPerson;stepPerson=function(p,dt){if(p.state==='work'&&p.workKind==='plant'&&tech('h_odnow'))p.wt+=dt*eff(p);_st(p,dt)}}
// ---------- codziennie: odrastanie, współpraca, rada, historia zwierzyny ----------
function lwDaily(){if(!S||S.epoch===4)return;const sea=lwSea(),y=lwYear();
 // odrastanie: odpoczynek łowiska, okres ochronny, paśnik, urząd leśniczego; bez następcy leśniczego gorzej
 const off=typeof offHolder==='function'&&offHolder('lesniczy');const bez=S.lwBez>S.day;
 for(const h of S.herds){if(!lwHuntable(h)&&h.type!=='wilk')continue;if(h.n<2||h.n>=h.max||sea===2)continue;let p=0;
  if(tech('h_umiar')&&(h.huntPressure||0)<.1)p+=.055;if(law('ochronny')&&sea===3)p+=.11;if(off)p+=.03;if(lwInGaj(h.x,h.z))p+=.05;if(bez)p-=.03;
  if(p>0&&Math.random()<K*p)h.n++;
  // stado dokarmiane zimą ma wiosną dodatkowe młode (zima i następna wiosna to ten sam rok gry)
  if(sea===3&&h.fed===y&&h.fedY!==y){h.fedY=y;h.n=Math.min(h.max,h.n+1)}}
 // współpraca leśniczego i myśliwego
 const F=lwForesters(),H=lwHunters();
 if(F.length&&H.length){const fb=bById(F[0].wb),hb=bById(H[0].wb);const a=bCenter(fb),c=bCenter(hb);
  if(Math.hypot(a.x-c.x,a.z-c.z)<=40){S.wsp=(S.wsp||0)+1;if(S.wsp>=8&&!S.wspOk){S.wspOk=1;try{if(typeof relAdd==='function')relAdd(F[0],H[0],10)}catch(e){}
    log(`${F[0].name} i ${H[0].name} od kilku dni chodzą razem po lesie. Myśliwi polują teraz tam, gdzie zwierzyny jest za dużo, i nie ruszają stad, które ledwo się trzymają.`)}}}
 // historia zwierzyny w zasięgu chat myśliwych
 S.lwH=S.lwH||{};for(const b of S.bld){if(!bDone(b)||(b.kind!=='mysliwy'&&b.kind!=='lesnik'))continue;const c=bCenter(b);const n=lwCount(c.x,c.z,b.kind==='lesnik'?rOf(b)*2:rOf(b)).n;const L=S.lwH[b.id]||(S.lwH[b.id]=[]);L.push(n);if(L.length>6)L.shift()}
 for(const k in S.lwH)if(!bById(+k))delete S.lwH[k];
 // rada leśniczego
 lwRada();
 // święty gaj (obyczaj z wiecu)
 lwGaj()}
function lwRada(){if(!tech('h_umiar')||(S.lwRadaD!==undefined&&S.day-S.lwRadaD<6)||(typeof evOpen!=='undefined'&&evOpen))return;const F=lwForesters(),H=lwHunters();if(!F.length||!H.length)return;const sea=lwSea();
 let best=null;for(const b of S.bld.filter(b=>b.kind==='mysliwy'&&bDone(b))){const c=bCenter(b);for(const h of S.herds){if(!lwHuntable(h)||lwProtected(h)||Math.hypot(h.x-c.x,h.z-c.z)>rOf(b))continue;
   const weak=h.n<=Math.ceil(h.max*.4),young=sea===3&&h.n<h.max;if(!weak&&!young)continue;if(!best||h.n/h.max<best.n/best.max)best=h}}
 if(!best)return;S.lwRadaD=S.day;const f=F[0],k=S.herds.indexOf(best),weak=best.n<=Math.ceil(best.max*.4);
 openEvent({ey:'Rada leśniczego',t:'Przerwa w polowaniach?',text:()=>`${f.name} wraca z obchodu i siada przy ognisku obok myśliwych.\n\n„${ANIMAL[best.type][0][0].toUpperCase()+ANIMAL[best.type][0].slice(1)} ${lwWhere(best.x,best.z)} ${weak?'ledwo się trzymają: zostało ich '+best.n:'mają młode'}. Dajcie im kilka dni spokoju, to stado się odbuduje.”`,
  opts:[{n:'Posłuchać leśniczego',d:'przez 5 dni nikt nie poluje na to stado',f:()=>{const h=S.herds[k];if(h)h.ochr=S.day+SD;return`Myśliwi kiwają głowami. Przez kilka dni będą chodzić gdzie indziej, a ${f.name} obiecuje dać znać, kiedy stado się odbuduje.`}},
   {n:'Polować dalej',d:'mięso teraz',f:()=>`Myśliwi wzruszają ramionami: zima nie poczeka. ${f.name} długo patrzy w ogień.`}]},{})}
// ---------- święty gaj ----------
function lwGaj(){if(!law('gaj')){if(S.gaj!=null){S.gaj=null;lwGajNodes()}return}if(S.gaj!=null)return;
 const ci=camp.i,cj=camp.j,cr=regionAt(ci,cj);let best=null,bd=1e9;
 for(const r of REGIONS){if(!r||!r.known||r.type!=='forest'||(cr&&r.id===cr.id))continue;const d=Math.hypot(r.i-ci,r.j-cj);if(d<bd){bd=d;best=r}}
 if(!best)return;S.gaj=best.id;lwGajNodes();log(`Las w krainie ${best.name} staje się świętym gajem. Nikt nie podniesie w nim siekiery ani łuku, a zwierzyna ma dokąd wracać.`);
 try{placeAdd('Święty Gaj',tcx(best.i),tcx(best.j),'ostoja bez polowań i wyrębu')}catch(e){}}
// drzewa w gaju są nietykalne dla drwali (pickNodeB pomija węzły z bad w przyszłości)
function lwGajNodes(){for(const n of nodeBy.tree){const r=regionAt(n.i,n.j);const inG=S.gaj!=null&&r&&r.id===S.gaj;if(inG)n.bad=1e12;else if(n.bad===1e12)n.bad=0}}
{const _zm=zwMap;zwMap=function(){_zm.apply(this,arguments);try{if(S&&S.gaj!=null&&zwQuiet)for(let c=0;c<zwQuiet.length;c++){const W=Math.round(Math.sqrt(zwQuiet.length));const i=(c%W)*16+8,j=Math.floor(c/W)*16+8;const r=regionAt(i,j);if(r&&r.id===S.gaj)zwQuiet[c]=1}}catch(e){}}}
// ---------- leśniczy umiera bez następcy ----------
{const _kp=killPerson;killPerson=function(p,why){let lost=false;try{if(S.epoch!==4&&(p.sk.lesniczy||0)>=3)lost=!S.people.some(q=>q!==p&&(q.sk.lesniczy||0)>=2)}catch(e){}const r=_kp(p,why);
  if(lost){S.lwBez=S.day+YEAR*2;log(`Z ${gw(p,'leśniczym','leśniczką')} odchodzi wiedza o lesie: nikt nie chodził z ${gw(p,'nim','nią')} na obchody. Przez kilka lat las i zwierzyna będą radzić sobie gorzej.`)}return r}}
// ---------- obława na wilki po napadzie na zagrodę ----------
function lwWolves(){if((S.lwWolfD!==undefined&&S.day-S.lwWolfD<YEAR/2)||(typeof evOpen!=='undefined'&&evOpen))return;const pen=S.bld.find(b=>b.kind==='zagroda'&&bDone(b));if(!pen)return;
 const c=bCenter(pen);const w=S.herds.filter(h=>h.type==='wilk'&&h.n>0).sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z))[0];if(!w)return;S.lwWolfD=S.day;const k=S.herds.indexOf(w);
 openEvent({ey:'Zagroda',t:'Wilki wrócą',text:()=>`Rano przy zagrodzie leżą resztki kozy, a w błocie widać tropy kilku wilków. ${H0()} mówi, że wataha wróci, skoro raz się tu najadła.`,
  opts:[{n:'Obława',d:'myśliwi i kilku mężczyzn idą na watahę; ktoś może zostać ranny',f:()=>{const h=S.herds[k];const L=S.people.filter(p=>isAdult(p)&&p.job!=='wyp'&&p.hp>.5).sort((a,b)=>(b.sk.mysliwy||0)-(a.sk.mysliwy||0)).slice(0,4);if(!h||!L.length)return'Nie ma kogo posłać.';
    const sk=Math.max(...L.map(p=>p.sk.mysliwy||0));const kill=Math.min(h.n,1+(Math.random()<.3+.1*sk?1:0));h.n-=kill;S.res.skory=(S.res.skory||0)+kill*2;h.alertT=S.t+600;if(typeof zwRehome==='function')try{zwRehome(h,k)}catch(e){}
    let x='';if(Math.random()<.25){const p=L[(Math.random()*L.length)|0];p.hp=Math.max(.15,p.hp-.3);p.hurt=1;x=` ${p.name} wraca z pogryzionym ramieniem.`}
    return`Obława trwa cały dzień. ${kill===1?'Jeden wilk pada':'Dwa wilki padają'}, reszta watahy ucieka daleko od osady.${x}`}},
   {n:'Pilnować zagrody nocami',d:'przez pół roku wilki rzadziej napadają, ale ludzie są niewyspani',f:()=>{S.lwPiln=S.day+YEAR/2;return'Przy zagrodzie co noc pali się ognisko, a ktoś czuwa z kijem i psem. Wataha krąży, ale nie podchodzi.'}}]},{})}
function H0(){const h=lwHunters()[0]||S.people.filter(isAdult).sort((a,b)=>(b.sk.mysliwy||0)-(a.sk.mysliwy||0))[0];return h?h.name:'Ktoś'}
if(typeof dogGuard==='function'){const _dg=dogGuard;dogGuard=function(){return _dg()*(S&&S.lwPiln>S.day?.5:1)}}
{const _e=eff;eff=function(p){return _e(p)*(S&&S.lwPiln>S.day&&isAdult(p)?.98:1)}}
// wilki: napad na zagrodę otwiera kartę obławy (raz na pół roku)
function lwScan(){const mark=S.lwMark;let k=0,hit=false;for(const l of S.log){if(l===mark||k++>40)break;if(/zagryzły kozę/.test(l.t))hit=true}S.lwMark=S.log[0];if(hit)lwWolves()}
// ---------- karta chaty myśliwego i leśniczówki ----------
{const _bp=bldPanelHTML;bldPanelHTML=function(b){let h=_bp(b);try{if(S.epoch!==4&&bDone(b)&&(b.kind==='mysliwy'||b.kind==='lesnik'))h+=lwCardHTML(b)}catch(e){console.warn(e)}return h}}
function lwCardHTML(b){const c=bCenter(b),f=b.kind==='lesnik',R=f?rOf(b)*2:rOf(b),now=lwCount(c.x,c.z,R),H=(S.lwH||{})[b.id]||[];const old=H.length>=4?H[0]:null;
 let t=`<div class="card lw-card"><h4>${f?'Zwierzyna w okolicy':'Zwierzyna w zasięgu'}</h4><p>${now.n?`${lwListTxt(now)} <span class="mut">(${now.st} ${now.st===1?'stado':now.st<5?'stada':'stad'})</span>`:'Teraz nic. Zwierzyna odeszła albo została wybita.'}</p>`;
 if(old!==null){const d=now.n-old;t+=`<p class="mut">${H.length-1} dni temu: ${old}. ${d<=-Math.max(2,old*.3)?'Ubywa.':d>=Math.max(2,old*.3)?'Przybywa.':'Bez większych zmian.'}</p>`;
  if(!f&&(d<=-Math.max(2,old*.3)||now.n<=3))t+=`<p class="mut">Daj łowisku odpocząć albo postaw chatę dalej, na skraju lasu. Przy osadzie zwierzyny z czasem ubywa.</p>`}
 if(f){if(tech('h_pasnik'))t+=`<p class="mut">Zimą leśniczy dokarmia stada w paśniku: 2 ziarna dziennie, jest ${Math.floor(S.res.ziarno||0)}.</p>`;else t+='<p class="mut">Leśniczy obchodzi las, gdy nie ma gdzie sadzić.</p>';
  if(S.wspOk)t+='<p class="ok">Leśniczy i myśliwi współpracują: słabe stada zostają w spokoju.</p>'}
 const pr=S.herds.filter(h=>lwHuntable(h)&&Math.hypot(h.x-c.x,h.z-c.z)<=R&&lwProtected(h)).length;if(pr)t+=`<p class="mut">Pod ochroną: ${pr} ${pr===1?'stado':pr<5?'stada':'stad'}.</p>`;
 return t+'</div>'}
// ---------- zapis i codzienność ----------
function lwMigrate(){if(!S||!S.people)return;for(const p of S.people){if(!p.sk||!p.xp)continue;if(p.sk.lesniczy===undefined)p.sk.lesniczy=0;if(p.xp.lesniczy===undefined)p.xp.lesniczy=lvXp(p.sk.lesniczy)}
 if(!S.lwV){S.lwV=1;for(const p of S.people){const b=p.job==='wb'&&bById(p.wb);if(b&&b.kind==='lesnik'&&p.sk.lesniczy<1){p.sk.lesniczy=Math.max(1,Math.min(2,p.sk.drwal||0));p.xp.lesniczy=lvXp(p.sk.lesniczy)}}}
 if(S.gaj!=null)lwGajNodes();S.lwMark=S.log&&S.log[0]}
{const _b=boot;boot=function(f){_b(f);try{lwMigrate()}catch(e){console.warn(e)}}}
{const _ad=actDaily;actDaily=function(){_ad();try{if(S&&S.epoch!==4){lwScan();lwDaily()}}catch(e){console.warn(e)}}}
window.__lowy={lwObchodGo,lwProtected,lwCount,lwNoGame,lwObchod,lwDaily,lwRada,lwGaj,lwWolves,lwCardHTML,lwMigrate,lwWhere};
