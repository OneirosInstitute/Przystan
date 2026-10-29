
/* ================= 4.9.0-rc.23 Źródła wiedzy: nic z niczego ================= */
// Plan wiedzy i rozwoju, pakiet W2. Źródło zastępuje połowę praktyki (próba może ruszyć przy połowie przeczucia)
// i daje pewniejszą próbę (p_badania.js: badFeelNeed, badChance, badCost). Źródła:
// - pamięć rozbitków: każdy dorosły rozbitek pamięta z domu 1–2 rzeczy; kto pamięta i sam prowadzi próbę, płaci połowę materiałów; gdy umrze albo odpłynie, pamięć przepada;
// - ślady dawnego ludu: dar daje pełne przeczucie i tańszą próbę zamiast gotowej wiedzy;
// - przypadki: pożar, wilki przy zagrodzie, rana podsuwają pomysł;
// - przysiółki (epoka II i dalej): każdy zna się na czymś według swojej krainy, a wozy przywożą przeczucie.
// Do tego mgła wiedzy w drzewku (p_tech.js) i podpowiedzi przy wieczornym ogniu, gdy przeczucie jest pełne.
const ZR_HAM={coast:['h_sieci','h_lodzie','h_masar'],meadow:['u_selek','u_radlo','u_trojpol','u_mlyn'],forest:['r_zrab','r_gont','r_kolowrot'],high:['h_rozr','h_siano','h_hale','r_zaprawa']};
const ZR_EV=[
 [/^Pożar! Pali się/,'r_garn','W popiele po pożarze leżą twarde, wypalone grudy gliny. Ktoś stuka w jedną paznokciem: brzmi jak garnek.','glina wypalona w pożarze'],
 [/zagryzły kozę/,'h_ostr','Po nocy z wilkami hodowcy długo patrzą na płot. Gdyby tak wbić zaostrzone pale…','wilki przy zagrodzie'],
 [/ ranny przez /,'n_opat','Rana się paprze. Ktoś przypomina sobie, że czysta woda i płótno pomagały bardziej niż zaklęcia.','rana, która się paprała']];
// wieczorne podpowiedzi: ktoś z fachu mówi o tym przy ogniu, gdy przeczucie jest pełne
const ZR_HINT={u_ziel:'Krwawnik na rany, kora wierzby na gorączkę. Babka tak robiła, tylko trzeba by spróbować.',u_susz:'Jagody gniją w koszach. Rozłożone na matach w dymie przetrwałyby do zimy.',
 u_bart:'W starym dębie za strumieniem brzęczą pszczoły. Z dymem i cierpliwością można by sięgnąć po miód.',u_odlog:'To pole jest zmęczone. Gdyby rok odpoczęło, oddałoby więcej.',
 u_sad:'Odrosty jagód dałoby się przesadzić bliżej chat. Nie trzeba by chodzić tak daleko.',u_nawoz:'Tam, gdzie stały kozy, trawa rośnie najgęściej. Może na polu będzie tak samo.',
 u_selek:'Gdyby do siewu odkładać tylko najcięższe kłosy, następne zboże byłoby lepsze.',u_len:'Len rośnie dziko przy strumieniu. Posiany bliżej dałby włókna dla wszystkich.',
 h_wedz:'Ryby, które wisiały nad ogniskiem, wytrzymały dłużej niż reszta. Może dym je chroni.',h_zagr:'Kozy na halach już nie uciekają tak daleko. Gdyby podejść je powoli, z garścią soli…',
 h_garb:'Skóry sztywnieją i gniją. Kora dębu i popiół podobno pomagają.',h_sieci:'Z lnu dałoby się upleść sieć. Na płyciźnie złowilibyśmy więcej niż na wędkę.',
 h_doj:'Kozy dają mleko, a połowę wylewamy, bo kwaśnieje. Ser przetrwałby zimę.',h_ostr:'Wilki krążą przy zagrodzie. Zaostrzone pale trzymałyby je z dala.',
 h_rozr:'Spokojne kozy rodzą zdrowsze młode. Gdyby tylko je dopuszczać do rozrodu…',h_siersc:'Zimą kozy mają pod sierścią miękki puch. Dałoby się go uprząść.',
 r_narz:'Siekiery tępią się za szybko. Lepszy krzemień i mocniej osadzony trzonek by pomogły.',r_zrab:'Bale można by łączyć bez gwoździ, na jaskółczy ogon. Szybciej by szło.',
 r_tkac:'Szyjemy z tego, co zostało z wraku. Z krosnem płótna byłoby pod dostatkiem.',r_stal:'Żelazo jest za miękkie. Rozgrzane do wiśniowego i wrzucone do wody podobno twardnieje.',
 r_garn:'Glina przy ogniu twardnieje. Garnki z pokrywą trzymałyby jedzenie dłużej.',r_woz:'Koło i oś, a wóz przewiózłby więcej niż dziesięciu ludzi na plecach.',
 n_kal:'Słońce wschodzi coraz bardziej na lewo od tej skały. Gdyby liczyć dni nacięciami…',n_mapa:'Każdy zwiadowca opowiada co innego. Trzeba by to narysować, żeby się nie gubić.',
 n_szk:'Dzieci słuchają wieczorami jak zaczarowane. Można by je czegoś uczyć przy ogniu.',n_opat:'Rany się paprzą. Czysta woda, płótno i zioła, gdyby ktoś wiedział, jak to robić.',
 n_znaki:'Te same znaki są na trzech skałach. One coś wskazują.',n_gwiazd:'W nocy gwiazdy stoją zawsze w tym samym miejscu. Po nich dałoby się wrócić z morza.',
 n_pamiec:'Gdyby zapisać, co umieją mistrzowie, nic by nie zginęło razem z nimi.'};
{const st=document.createElement('style');st.textContent='.tn.fog{opacity:.38;border-style:dotted}.tn.fog .tt{color:var(--mut)}.zr-src{margin:6px 0}.zr-pam{margin:2px 0 6px}';document.head.appendChild(st)}
function zrS(){S.tsrc=S.tsrc||{};S.zrEv=S.zrEv||{};S.bhint=S.bhint||[];return S}
// źródła węzła: żywi, którzy pamiętają to z domu, i źródła z wyspy
function zrSrc(t){if(!S||!S.people)return[];const L=[];for(const p of S.people)if(p.pam&&p.pam.includes(t.id))L.push({k:'pam',n:p.name,p});const x=S.tsrc&&S.tsrc[t.id];if(x)L.push(x);return L}
const zrAvail=t=>!S.tech[t.id]&&!t.sync&&tEp(t)<=epNow()&&t.req.every(r=>tech(r));
// źródło z wyspy: pełne przeczucie albo jego część, raz na węzeł
function zrGive(id,k,n,feel){const t=TECH_BY[id];if(!t||S.tech[id])return false;zrS();if(!S.tsrc[id])S.tsrc[id]={k,n};const cap=tHalf(t);S.tp[id]=Math.max(S.tp[id]||0,Math.min(cap,cap*(feel===undefined?1:feel)));
 if(zrAvail(t)&&badFeelOk(t))badReadyNote(t);return true}
// ---------- pamięć rozbitków ----------
function zrPamPool(){return TECH.filter(t=>tEp(t)<=2&&!t.sync&&!tRoot(t)&&TCOST[t.id])}
function zrTopCraft(p){let best=null,v=-1;for(const c in CN){const s=p.sk[c]||0;if(s>v){v=s;best=c}}return best}
function zrPamInit(){if(!S||!S.tech||S.epoch===4||S.pamV)return;S.pamV=1;const pool=zrPamPool(),taken={};
 for(const p of S.people.filter(p=>!p.born&&p.age>=16&&!p.pam).sort((a,b)=>a.id-b.id)){const c=zrTopCraft(p),n=p.age>=40?2:1,got=[];
  for(let k=0;k<n;k++){const W=pool.filter(t=>!got.includes(t.id)).map(t=>[t,((badCrafts(t).includes(c)?4:0)+(t.d==='nauka'&&(p.age>=40||p.trait==='Nauczyciel')?3:0)+.5)*(taken[t.id]?.2:1)]);
   let r=Math.random()*W.reduce((a,w)=>a+w[1],0);for(const[t,w]of W){r-=w;if(r<=0){got.push(t.id);taken[t.id]=1;break}}}
  if(got.length)p.pam=got}}
const zrPamLeft=p=>(p.pam||[]).filter(id=>TECH_BY[id]&&!S.tech[id]&&!S.people.some(q=>q!==p&&q.pam&&q.pam.includes(id)));
function zrPamCard(p){if(!p.pam||!p.pam.length)return'';const now=epNow();
 const L=p.pam.map(id=>{const t=TECH_BY[id];if(!t)return'';if(S.tech[id])return`<span class="ok">✓ ${t.n.toLowerCase()}</span>`;return tEp(t)>now?`${t.n.toLowerCase()} <span class="mut">(przyda się w epoce ${tEp(t)===2?'II':'III'})</span>`:t.n.toLowerCase()}).filter(Boolean);
 const use=p.pam.some(id=>TECH_BY[id]&&!S.tech[id]&&tEp(TECH_BY[id])<=now);
 return`<p class="mut zr-pam">Pamięta z domu: ${L.join(', ')}.${use?' Gdy sam prowadzi próbę, potrzeba połowy materiałów i idzie pewniej.':''}</p>`}
{const _lc=ludCard;ludCard=function(p){const h=_lc(p);let s='';try{if(badOn())s=zrPamCard(p)}catch(e){console.warn('pamięć',e)}return s+h}}
{const _kp=killPerson;killPerson=function(p,why){let L=[];try{if(badOn())L=zrPamLeft(p)}catch(e){}_kp(p,why);if(L.length)log(`${p.name} ${gw(p,'zabrał','zabrała')} do grobu pamięć z domu: ${L.map(id=>TECH_BY[id].n.toLowerCase()).join(', ')}. Tego nikt już nie pamięta.`)}}
{const _lp=leavePerson;leavePerson=function(p){let L=[];try{if(badOn()&&!p.born)L=zrPamLeft(p)}catch(e){}_lp(p);if(L.length)log(`${p.name} zabiera ze sobą pamięć z domu: ${L.map(id=>TECH_BY[id].n.toLowerCase()).join(', ')}.`)}}
// ---------- przypadki z kroniki ----------
function zrEvents(){zrS();const mark=S.zrMark,hit=[];let k=0;for(const l of S.log){if(l===mark||k++>60)break;for(const e of ZR_EV){const t=TECH_BY[e[1]];if(S.zrEv[e[1]]||hit.includes(e)||!e[0].test(l.t)||!t||!zrAvail(t))continue;hit.push(e)}}
 S.zrMark=S.log[0];for(const[,id,txt,short]of hit){S.zrEv[id]=1;log(txt);zrGive(id,'ev',short,1)}if(hit.length)S.zrMark=S.log[0]}
// ---------- przysiółki ----------
function zrHamDaily(){for(const h of (S.hamlets||[])){const L=ZR_HAM[hType(h)]||[];if(!h.wz||S.tech[h.wz]||!TECH_BY[h.wz])h.wz=L.find(id=>TECH_BY[id]&&!S.tech[id]&&tEp(TECH_BY[id])<=epNow())||null;if(!h.wz)continue;
  const t=TECH_BY[h.wz];if((h.wiez||0)>=.45&&!(S.tsrc&&S.tsrc[h.wz])){zrS();S.tsrc[h.wz]={k:'przys',n:h.name};log(`W przysiółku ${h.name} znają się na tym: ${t.n.toLowerCase()}. Próba w osadzie będzie tańsza i pewniejsza.`)}}}
{const _ca=cartArrive;cartArrive=function(c){_ca(c);try{if(!badOn()||c.dir>=0)return;const h=(S.hamlets||[]).find(x=>x.id===c.h);const t=h&&h.wz&&TECH_BY[h.wz];if(!t||!zrAvail(t))return;const cap=tHalf(t);S.tp[t.id]=Math.min(cap,(S.tp[t.id]||0)+cap*.08);if(badFeelOk(t))badReadyNote(t)}catch(e){}}}
// ---------- widok źródeł w karcie węzła ----------
function zrSrcHTML(t){const L=zrSrc(t);if(!L.length)return'';const txt=L.map(s=>s.k==='pam'?`${s.n} pamięta to z domu`:s.k==='slad'?`ślad dawnego ludu: ${s.n.toLowerCase()}`:s.k==='przys'?`przysiółek ${s.n} zna się na tym`:s.k==='ev'?`przypadek: ${s.n}`:s.n);
 return`<p class="zr-src"><b style="color:var(--gold2)">Źródło:</b> ${txt.join('; ')}. Wystarczy połowa przeczucia, a próba jest pewniejsza${S.tsrc&&S.tsrc[t.id]?' i tańsza':''}.</p>`}
// ---------- podpowiedzi przy wieczornym ogniu ----------
{const _rn=badReadyNote;badReadyNote=function(t){const was=S.tnote&&S.tnote[t.id];_rn(t);if(!was&&S.tnote&&S.tnote[t.id]){zrS();if(!S.bhint.includes(t.id))S.bhint.push(t.id);if(S.bhint.length>4)S.bhint.shift()}}}
function zrHintLine(){zrS();while(S.bhint.length){const id=S.bhint.shift(),t=TECH_BY[id];if(!t||S.tech[id])continue;const C=(TPRAC[id]||[]).filter(g=>CN[g]);
  const ad=S.people.filter(p=>isAdult(p)&&p.state!=='away');let sp=null;
  if(C.length&&t.d!=='nauka')sp=ad.filter(p=>C.some(c=>(p.sk[c]||0)>=1)).sort((a,b)=>Math.max(...C.map(c=>b.sk[c]||0))-Math.max(...C.map(c=>a.sk[c]||0)))[0];
  if(!sp)sp=ad.slice().sort((a,b)=>b.age-a.age)[0];if(!sp)continue;
  return[ZR_HINT[id]||`Gdyby tak spróbować: ${t.n.toLowerCase()}. Chyba wiem już, od czego zacząć.`,sp.name]}return null}
{const _ct=czTalkLines;czTalkLines=function(){const L=_ct();try{if(badOn()){const h=zrHintLine();if(h){if(L.length)L[0]=h;else L.push(h)}}}catch(e){console.warn(e)}return L}}
// ---------- na co czekamy: stara pamięć ----------
{const _cz=czekamy;czekamy=function(){const L=_cz();try{if(badOn())for(const p of S.people){if(p.age<58||!p.pam)continue;const U=zrPamLeft(p).filter(id=>tEp(TECH_BY[id])<=epNow());if(U.length)L.push([`Tylko ${p.name} (${Math.floor(p.age)} l.) pamięta z domu: ${U.map(id=>TECH_BY[id].n.toLowerCase()).join(', ')}`,1])}}catch(e){}return L.sort((a,b)=>a[1]-b[1])}}
// ---------- codziennie i przy wczytaniu ----------
{const _ad=actDaily;actDaily=function(){_ad();if(!badOn())return;try{zrPamInit();zrEvents();zrHamDaily()}catch(e){console.warn(e)}}}
{const _b=boot;boot=function(f){_b(f);try{if(badOn()){zrPamInit();zrS();S.zrMark=S.log[0]}}catch(e){console.warn(e)}}}
window.__zr={zrSrc,zrGive,zrPamInit,zrPamLeft,zrPamCard,zrEvents,zrHamDaily,zrHintLine,zrSrcHTML,ZR_HAM,ZR_HINT};
