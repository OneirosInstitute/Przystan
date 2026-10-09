
// ================= 1.5 Rytm roku: dłuższa doba, trójpolówka, przednówek, choroby, progi, znaki pogody =================
// ---------- stare zapisy: doba trwała 2 minuty, rok 40 dni ----------
const DAYKEYS=new Set(['until','evT','waitD','sporNext','mealBuff','arr','zorzaN','zimaGlod','widowT','wedDay','unr','tlokaCd','stD','since','reqNext','przD','pamT','needD','late','lastStorm','kolTT','finDay','bd','d0','d','day','wreckRush','sporD','racjeD','signD']);
function halveDays(o,depth){if(!o||typeof o!=='object'||depth>6)return;if(Array.isArray(o)){if(o.length>400)return;o.forEach(x=>halveDays(x,depth+1));return}
 for(const k in o){const v=o[k];if(typeof v==='number'&&DAYKEYS.has(k))o[k]=Number.isInteger(v)&&k==='d'?Math.floor(v/2):v/2;else if(v&&typeof v==='object'&&!['nodeAmt','grow','rev','tread','rel'].includes(k))halveDays(v,depth+1)}}
{const _sf=saveFix;saveFix=function(o){o=_sf(o);if(!o||o.v15)return o;o.v15=1;
  halveDays(o,0);(o.kron||[]).forEach(x=>{if(Array.isArray(x)&&typeof x[0]==='number')x[0]=Math.floor(x[0]/2)});
  if(o.evCd)for(const k in o.evCd)o.evCd[k]=o.evCd[k]/2;if(o.wreck&&o.wreck.gone===undefined)o.wreck.gone=0;o._v15note=1;return o}}
{const _fs=freshState;freshState=function(){const st=_fs();st.v15=1;return st}}

// ---------- trójpolówka, chwasty, sporysz ----------
const ROT_N=['zboże ozime','zboże jare i groch','ugór'];
function fieldInit(f){if(f.rot===undefined)f.rot=0;if(f.weed===undefined)f.weed=0;if(!f.mode)f.mode=tech('u_odlog')?'trzy':'zboze';if(f.mono===undefined)f.mono=0}
function fieldMul(b){const f=b.field;fieldInit(f);let m=f.mode==='trzy'?(f.rot===0?1.15:.85):1;m*=1-.45*Math.min(1,f.weed||0);return m}
function fertLoss(f){fieldInit(f);const base=tech('u_odlog')?.06:.12;if(f.mode==='trzy')return f.rot===0?base*1.1:base*.35;return base*1.25}
function fieldDone(b){const f=b.field;fieldInit(f);const crop=ROT_N[f.mode==='trzy'?f.rot:0];
 if(f.mode==='trzy'&&f.rot===1){const add=Math.round(12*f.fert);S.res.warzywa=(S.res.warzywa||0)+add;log(`Żniwa skończone. Z jarego pola obok ziarna zebrano groch i bób (warzywa ${add}). Groch zostawia ziemi siłę.`);f.fert=Math.min(1,f.fert+.05)}
 else log(f.mode==='trzy'?'Żniwa skończone. Ziemia po ozimym jest zmęczona, za rok pójdzie pod jare.':'Żniwa skończone. Ziemia jest coraz bardziej zmęczona, a chwastów przybywa.');
 if(f.mode==='trzy'){f.rot=(f.rot+1)%3;if(f.rot===2){f.ugD=S.day;log('Za rok to pole odpocznie: ugór. Kozy mogą tam paść, a chwasty się wypalą.')}f.mono=0}
 else{f.mono=(f.mono||0)+1;f.weed=Math.min(1,(f.weed||0)+.18);
  if(f.mono>=2&&(S.wet||0)>=3&&Math.random()<.4){S.sporD=S.day+YEAR*.4;log('W ziarnie z tego pola czarne rożki sporyszu. Kto zje chleb z takiego ziarna, może ciężko zachorować.');toast('Sporysz w ziarnie')}}
 harvestDone()}
function fieldDaily(){const sea=seasonIdx();
 if(S.weather.k==='rain'||S.weather.k==='storm')S.wet=(S.wet||0)+1;if(sea===3&&yday()<74)S.wet=0;
 S.bld.forEach(b=>{const f=b.field;if(!f)return;fieldInit(f);
  if(!f.mode||f.mode==='zboze'){if(tech('u_odlog')&&!f.asked){f.asked=1;f.mode='trzy';f.rot=f.rot||0;log('Pola przechodzą na trójpolówkę: rok zboże ozime, rok jare z grochem, rok ugór.')}}
  if(f.st==='rosnie'&&sea!==2)f.weed=Math.min(1,f.weed+.012*KF*(f.mode==='zboze'?1.4:1));
  if(f.rot===2&&f.st==='puste'){f.fert=Math.min(1,f.fert+.012*KF*(S.bld.some(z=>z.kind==='zagroda'&&(z.animals||0)>0)?1.6:1));f.weed=Math.max(0,f.weed-.03*KF);
   if(f.ugD!==undefined&&S.day-f.ugD>=YEAR*.7){f.rot=0;f.weed=0;f.ugD=undefined;log('Ugór odpoczął. W tym roku pole pójdzie pod zboże ozime.')}}
  if(f.st==='dojrzale'&&S.weather.k==='frost'&&(sea===1||sea===2)&&!f.frostHit){f.frostHit=1;f.left=Math.floor(f.left*.45);log('Przymrozek zważył niezebrane zboże. Zostało niewiele ponad połowę.');toast('Przymrozek na polu')}
  if(f.st!=='dojrzale')f.frostHit=0})}
let harvY=-1;
function harvestDone(){const y=Math.floor(S.day/YEAR);if(harvY===y||S.dozY===y)return;const left=S.bld.some(b=>b.field&&b.field.st==='dojrzale');if(left)return;S.dozY=y;
 const c=Math.round(K*S.people.length*.3),tot=foodTotal();if(tot>c*4){FOOD.forEach(k=>S.res[k]=Math.max(0,S.res[k]-c*(S.res[k]/tot)));S.hope=clamp(S.hope+.05,0,1);S.dis=Math.max(0,(S.dis||0)-.04);
  log('Dożynki. Z ostatnich kłosów dziewczęta plotą wieniec, wieczorem cała osada je i śpiewa przy ogniu. Ziarno w spichrzu, można odetchnąć.');toast('Dożynki')}}
function fieldCard(b){const f=b.field;if(!f)return'';fieldInit(f);
 const rot=f.mode==='trzy'?`Płodozmian: w tym roku ${ROT_N[f.rot]}, potem ${ROT_N[(f.rot+1)%3]}, potem ${ROT_N[(f.rot+2)%3]}.`:`Co roku zboże.${f.mono>=2?' Ziemia słabnie, chwasty i sporysz coraz groźniejsze.':''}`;
 return`<div class="rot-box"><p>${rot}</p><p class="mut">Chwasty ${Math.round(100*f.weed)}% · żyzność ${Math.round(100*f.fert)}%</p>${tech('u_odlog')?`<div class="cz-act"><button data-frot="trzy" class="${f.mode==='trzy'?'pri':''}">Trójpolówka</button><button data-frot="zboze" class="${f.mode==='zboze'?'pri':''}">Co roku zboże</button></div>`:'<p class="mut">Odpoczywające pole i płodozmian to wiedza do odkrycia (Uprawa).</p>'}</div>`}

// ---------- choroby o jasnej przyczynie ----------
const ILL={szkorbut:['szkorbut','brak owoców, warzyw i kiszonek',.022,.8,0,'szkorbut'],biegunka:['biegunka','woda ze strumienia zamiast ze studni',.035,.6,3,'biegunkę'],goraczka:['gorączka','zimno i wilgoć w domu',.03,.65,4,'gorączkę'],sporysz:['zatrucie sporyszem','chleb z zepsutego ziarna',.04,.5,3,'zatrucie sporyszem']};
const FRESH=['jagody','warzywa','kiszonki'];
function illGive(p,k){if(p.ill||p.job==='wyp'||p.lost)return false;p.ill={k,d:S.day};return true}
function illDaily(){const sea=seasonIdx(),pop=S.people.length;if(!pop)return;const got={};
 const fresh=FRESH.reduce((a,k)=>a+(S.res[k]||0),0);S.vitD=fresh>pop*.25?0:(S.vitD||0)+1;
 for(const p of S.people){if(p.ill||p.job==='wyp'||p.lost)continue;let k=null;
  if(S.vitD>4/KF&&Math.random()<.06*KF*(p.age>55||p.age<6?1.4:1))k='szkorbut';
  else if(sea===0&&!S.bld.some(b=>b.kind==='studnia'&&bDone(b))&&pop>8&&Math.random()<.006*KF)k='biegunka';
  else if((sea===2||sea===1)&&(p.warm||1)<.6&&Math.random()<.05*KF*(S.banD>=Math.floor(S.day)-7?.5:1))k='goraczka';
  else if(S.sporD>S.day&&S.res.ziarno>2&&Math.random()<.03*KF*(tech('u_ziel')?.5:1))k='sporysz';
  if(k&&illGive(p,k))got[k]=(got[k]||0)+1}
 // biegunka zaraża
 if(got.biegunka){S.people.filter(q=>!q.ill&&Math.random()<.18).slice(0,3).forEach(q=>{if(illGive(q,'biegunka'))got.biegunka++})}
 Object.entries(got).forEach(([k,n])=>{const I=ILL[k];log(`${n>1?(n<5?`Zachorowały ${n} osoby`:`Zachorowało ${n} osób`):'Ktoś zachorował'}: ${I[0]}. Przyczyna: ${I[1]}.`);if(!S.seen['ill'+k]){S.seen['ill'+k]=1;toast(`Choroba: ${I[0]} (${I[1]})`)}});
 // przebieg
 for(const p of [...S.people]){if(!p.ill)continue;const I=ILL[p.ill.k];const herb=S.res.ziola>=.1;if(herb)S.res.ziola-=.1;
  p.hp=Math.max(.03,p.hp-I[2]*KF*(herb?.5:1)*(tech('n_opat')?.7:1));
  const over=p.ill.k==='szkorbut'?S.vitD===0&&S.day-p.ill.d>2/KF:S.day-p.ill.d>=I[4]/KF*(herb?.6:1);
  if(over){p.ill=null;continue}
  if(p.hp<=.05&&(p.age>58||p.age<4||Math.random()<.3)&&Math.random()<.2*KF){killPerson(p,'na '+I[5]);S.illDead=(S.illDead||0)+1}}}
{const _e=eff;eff=function(p){return _e(p)*(p.ill?ILL[p.ill.k][3]:1)}}
{const _lc=ludCard;ludCard=function(p){let h=_lc(p);if(p.ill){const I=ILL[p.ill.k];h=`<p class="no">Choruje: ${I[0]}. Przyczyna: ${I[1]}.</p>`+h}return h}}
function illCount(){const c={};S.people.forEach(p=>{if(p.ill)c[p.ill.k]=(c[p.ill.k]||0)+1});return c}
{const _ct=czThreats;czThreats=function(){const L=_ct();const c=illCount();const n=Object.values(c).reduce((a,b)=>a+b,0);if(n>=2){const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];L.push([`chorzy: ${n} (${ILL[top][0]})`,n>=5?3:2,n>=5?'bad':''])}return L.sort((a,b)=>b[1]-a[1]).slice(0,2)}}

// ---------- przednówek: kto je pierwszy ----------
EVENTS.push({id:'przednowek',w:6,cd:YEAR*.6,cond:()=>(seasonIdx()===3||(seasonIdx()===2&&yday()>62))&&S.day>YEAR*.5&&czNeedDays()<8&&S.racjeY!==Math.floor(S.day/YEAR),
 ctx:()=>({}),t:'Przednówek',
 text:()=>`Zima się kończy, a spiżarnia razem z nią. Do pierwszych jagód i grochu daleko, a jedzenia starczy na ${Math.max(1,Math.floor(czNeedDays()))} ${dniW(Math.max(1,Math.floor(czNeedDays())))}. Trzeba zdecydować, kto je pierwszy.`,
 opts:[{n:'Najpierw dzieci i karmiące matki',d:'dzieci zdrowe, dorośli słabną i pracują wolniej',f:()=>racje('dzieci')},
  {n:'Najpierw ci, którzy pracują',d:'praca idzie, ale dzieci i starzy chorują',f:()=>racje('praca')},
  {n:'Po równo',d:'wszyscy głodni tak samo',f:()=>racje('rowno')},
  {n:'Wszyscy w las i nad wodę',d:'budowy stoją, każdy szuka jedzenia',f:()=>racje('zbior')}]});
function racje(m){S.racje={m,until:S.day+YEAR*.3};S.racjeY=Math.floor(S.day/YEAR);
 return{dzieci:'Matki dostają podwójną miskę, dzieci jedzą do syta. Mężczyźni zaciskają pasa i milczą.',praca:'Kto idzie do lasu i na pole, je pierwszy. Starzy oddają swoje dzieciom po cichu, kiedy nikt nie widzi.',rowno:'Każdy dostaje tyle samo. Za mało dla wszystkich, ale nikt nie może powiedzieć, że go skrzywdzono.',zbior:'Budowy stoją. Kto może, chodzi po korzonki, pokrzywę, szczaw i ryby. Każda garść się liczy.'}[m]}
const racjeOn=m=>S.racje&&S.racje.until>S.day&&S.racje.m===m;
{const _ge=gospEat;gospEat=function(){_ge();if(!S.racje||S.racje.until<=S.day||S.fedR>=1)return;const m=S.racje.m;
  S.people.forEach(p=>{const f=fedOf(p);if(m==='dzieci'){if(p.age<12||(p.sex==='k'&&S.people.some(c=>c.age<2&&(c.par||[]).includes(p.id))))p.fedR=Math.min(1,f+.4);else p.fedR=f*.85}
   else if(m==='praca'){if(isWorker(p)&&p.age<56)p.fedR=Math.min(1,f+.3);else p.fedR=f*.72}});
  if(m==='praca'&&Math.random()<.3*KF){const q=S.people.filter(p=>(p.age<8||p.age>58)&&!p.ill);const p=q[(Math.random()*q.length)|0];if(p)illGive(p,'goraczka')}}}
{const _cc=choreCands;choreCands=function(p){const C=_cc(p);if(racjeOn('zbior'))C.forEach(c=>{if(c[0]==='zbior'||c[0]==='ryby')c[1]*=4});return C.sort((a,b)=>b[1]-a[1])}}
{const _bs=budSites;budSites=function(){return racjeOn('zbior')?0:_bs()}}

// ---------- progi zapasów w warsztatach ----------
function limOut(b){const d=BD[b.kind];if(!d.prod)return null;return Object.keys([].concat(d.prod)[0].out)[0]}
function limHit(b,x){if(!b.lim)return false;return Object.keys(x.out).every(r=>(S.res[r]||0)>=b.lim)}
function limChore(p,why){if(typeof choreCands!=='function')return false;const C=choreCands(p);for(const c of C.slice(0,3)){p.limC=true;if(choreDo(p,c[0])){p.act=(why==='ugór'?'pole odpoczywa: ':'zapas pełny: ')+p.act;return true}}p.limC=false;return false}
{const _pj=planJob;planJob=function(p){if(p.job==='wb')p.limC=false;return _pj(p)}}
function limCard(b){const d=BD[b.kind];if(!d.prod||!bDone(b))return'';const r=limOut(b);return`<div class="lim-box" style="display:flex;align-items:center;gap:8px;margin-top:6px"><div style="flex:1"><b style="color:var(--hi)">Rób do</b><br><span class="mut" style="font-size:13px">${RN[r]?RN[r].toLowerCase():r}: teraz ${fmt(S.res[r]||0)}${b.lim?'. Potem pracownicy pomagają w pracach we wsi.':''}</span></div><button class="mini" data-lim="-10" aria-label="Mniej">−</button><span class="cnt" style="min-width:58px;text-align:center">${b.lim?b.lim:'bez limitu'}</span><button class="mini" data-lim="10" aria-label="Więcej">+</button></div>`}

// ---------- pogoda ze znaków przyrody ----------
const SIGN={storm:['Jaskółki latają nisko nad wodą, a mewy siedzą na piasku.','idzie sztorm'],frost:['Wieczorem niebo czyste, gwiazdy jasne i ostre jak lód.','idzie mróz'],rain:['Mrówki zamykają kopce, żaby rechoczą od południa.','będzie padać'],
 snow:['Wrony krążą nisko i kraczą, powietrze pachnie śniegiem.','spadnie śnieg'],drought:['Rano nie ma rosy na trawie, a dym idzie prosto w górę.','idzie upał i susza']};
function signDaily(){const nx=S.weather.next;if(!nx||!SIGN[nx]||S.signFor===nx+':'+Math.floor(S.day-S.weather.left))return;S.signFor=nx+':'+Math.floor(S.day-S.weather.left);
 const ad=S.people.filter(p=>isAdult(p)&&p.job!=='wyp');if(!ad.length)return;const who=ad.sort((a,b)=>(b.age+8*((b.sk.zbieracz||0)+(b.sk.rolnik||0)))-(a.age+8*((a.sk.zbieracz||0)+(a.sk.rolnik||0))))[0];
 const acc=tech('n_kal')?1:Math.min(.92,.55+.006*Math.max(0,who.age-30)+.05*((who.sk.zbieracz||0)+(who.sk.rolnik||0)));
 const keys=Object.keys(SIGN).filter(k=>k!==nx&&(seasonIdx()===2||k!=='snow'));const pred=Math.random()<acc?nx:keys[(Math.random()*keys.length)|0];
 S.sign={k:pred,who:who.name,d:S.day,txt:SIGN[pred][0]};log(`${who.name}: „${SIGN[pred][0]} ${SIGN[pred][1][0].toUpperCase()+SIGN[pred][1].slice(1)}.”`);
 if((pred==='frost'||pred==='storm')&&S.bld.some(b=>b.field&&b.field.st==='dojrzale')){S.rush={until:S.day+.9};toast(`${who.name}: ${SIGN[pred][1]}. Zbierać zboże, póki czas!`)}else toast(`${who.name}: ${SIGN[pred][1]}`)}
// pośpiech przy żniwach: wolne ręce do pola
{const _pj=planJob;planJob=function(p){if(S&&S.rush&&S.rush.until>S.day&&isWork()&&isWorker(p)&&(p.job==='rob'||p.job==='bud')&&!p.fireB){const b=S.bld.find(x=>x.field&&x.field.st==='dojrzale'&&bDone(x));
   if(b){const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'field',b)){p.act='pomaga przy żniwach przed złą pogodą';return true}}}return _pj(p)}}
{const _cz=czekamy;czekamy=function(){const L=_cz();if(S.sign&&S.day-S.sign.d<1.2)L.push([`Znaki: ${S.sign.who} mówi, że ${SIGN[S.sign.k][1]}`,S.sign.k==='frost'||S.sign.k==='storm'?1:3]);
  const c=illCount();Object.entries(c).forEach(([k,n])=>L.push([`Choroba: ${ILL[k][0]} (${n}). Przyczyna: ${ILL[k][1]}`,1]));
  if(S.racje&&S.racje.until>S.day)L.push([`Przednówek: ${{dzieci:'najpierw dzieci',praca:'najpierw pracujący',rowno:'po równo',zbior:'wszyscy szukają jedzenia'}[S.racje.m]}`,2]);
  return L.sort((a,b)=>a[1]-b[1])}}
{const _ct=czTalkLines;czTalkLines=function(){const L=_ct();if(S.sign&&S.day-S.sign.d<1&&Math.random()<.6){if(L.length>=2)L[1]=[`${S.sign.txt} Zobaczycie, ${SIGN[S.sign.k][1]}.`,S.sign.who];}
  const c=illCount();if(c.szkorbut&&Math.random()<.5&&L.length)L[0]=['Dziąsła krwawią, zęby się chwieją. Trzeba czegoś zielonego, choćby pokrzywy.',(S.people.find(p=>p.ill&&p.ill.k==='szkorbut')||{}).name||'ktoś'];return L}}

// ---------- karty, dzień, start ----------
{const _rs=renderSel;renderSel=function(){_rs();if(!S||selB===null)return;const b=bById(selB);const el=$('sel');if(!b||el.style.display!=='block')return;
  if(b.field&&bDone(b)&&!el.querySelector('.rot-box'))el.insertAdjacentHTML('beforeend',fieldCard(b));
  if(BD[b.kind].prod&&bDone(b)&&!el.querySelector('.lim-box'))el.insertAdjacentHTML('beforeend',limCard(b))}}
$('sel').addEventListener('click',e=>{if(!S||selB===null)return;const b=bById(selB);if(!b)return;const t=e.target.closest('[data-frot],[data-lim]');if(!t)return;
 if(t.dataset.frot){fieldInit(b.field);b.field.mode=t.dataset.frot;if(b.field.mode==='zboze')b.field.rot=0}
 if(t.dataset.lim){const v=+t.dataset.lim;b.lim=Math.max(0,(b.lim||0)+v*(b.lim||v>0?1:0));if(b.lim===0)b.lim=null;else if(b.lim<10)b.lim=10;if(!b.lim&&v>0)b.lim=Math.max(10,Math.ceil((S.res[limOut(b)]||0)/10)*10)}
 $('sel')._h=null;renderSel()});
{const _ad=actDaily;actDaily=function(){_ad();if(!S)return;try{fieldDaily();illDaily();signDaily();if(S.rush&&S.rush.until<=S.day)S.rush=null}catch(e){console.warn(e)}}}
{const _b=boot;boot=function(fresh){_b(fresh);if(S&&S._v15note){delete S._v15note;log('Od tej wersji doba trwa dwa razy dłużej, a rok ma dwadzieścia dni. Twoja osada została przeliczona: pory roku i wiek ludzi się nie zmieniły.')}}}
window.__rok={DAY,YEAR,K,fieldMul,fertLoss,fieldDone,illDaily,illGive,racje,signDaily,limHit,limChore,ILL,halveDays,fieldInit};
