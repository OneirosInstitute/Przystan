
/* ================= 3.4 Serce osady: od ogniska do ratusza ================= */
// Jedno miejsce rośnie razem z ludźmi: ognisko pod gołym niebem, wiata ze stołami, Dom osadników, Dom rady i ratusz.
// Każdy następny etap otwiera pakiet sześciu zadań, po jednym na każdy filar życia osady (dach, stół, ciepło, zdrowie,
// rzemiosło, wspólnota). Gdy wszystkie są spełnione, a osada jest dość duża, serce można rozbudować. Każdy etap odblokowuje
// nowe budynki i urzędy, a jego wygląd widać z daleka. Plac 5 × 5 kroków zostaje zarezerwowany od pierwszego dnia.

// ---------- nowe zasoby: napitki i to, z czego powstają ----------
Object.assign(RN,{slod:'Słód',chmiel:'Chmiel',beczki:'Beczki',piwo:'Piwo',mpitny:'Miód pitny',winogrona:'Winogrona',wino:'Wino'});
Object.assign(IC,{
 beczki:'<path d="M7 4h10c1.6 3 1.6 13 0 16H7C5.4 17 5.4 7 7 4z"/><path d="M6 9h12M6 15h12"/>',
 piwo:'<path d="M6 8h9v12H6z"/><path d="M15 11h2.5a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5H15"/><path d="M6 8c-.5-2.5 2-4 4-3 1.2-1.6 4-1.2 4.5 1"/><path d="M9 12v5M12 12v5"/>',
 mpitny:'<path d="M9 3h6M10 3v3c-3 1-4.5 4-4.5 7 0 4 2.8 7 6.5 7s6.5-3 6.5-7c0-3-1.5-6-4.5-7V3"/><path d="M8 13h8"/>',
 wino:'<path d="M7 3h10c0 5.5-2 8.5-5 8.5S7 8.5 7 3z"/><path d="M12 11.5V19M8 21h8"/><path d="M8 6h8"/>',
 winogrona:'<circle cx="9.5" cy="10" r="2.2"/><circle cx="14.5" cy="10" r="2.2"/><circle cx="12" cy="14" r="2.2"/><circle cx="7.6" cy="14" r="2"/><circle cx="16.4" cy="14" r="2"/><circle cx="12" cy="18" r="2.1"/><path d="M12 7.8V4l3-1.5"/>',
 slod:'<path d="M7 9c-2.2 3-2.2 8.5 0 11h10c2.2-2.5 2.2-8 0-11z"/><path d="M8 9l2-4h4l2 4"/><path d="M10 14.5h4M11 17h2"/>',
 chmiel:'<path d="M12 5c3 2 5 5 5 8.5S15 20 12 20s-5-3-5-6.5S9 7 12 5z"/><path d="M8 10.5c2 1.2 6 1.2 8 0M7.4 14.5c2.6 1.2 6.6 1.2 9.2 0M8.4 18c2 .9 5.2.9 7.2 0"/><path d="M12 5V2.5l2.5-1"/>',
 serce:'<path d="M3.5 20.5h17"/><path d="M5 20.5V11l7-5.5 7 5.5v9.5"/><path d="M12 11.5c1.2 2.2 3 3 3 5.3a3 3 0 01-6 0c0-1.2.6-1.8 1.2-2.4.3 1 .8 1.5 1.5 1.5 0-1.6-.6-2.9.3-4.4z"/>'});
const NAPK=['piwo','mpitny','wino'],NAPM={piwo:1,mpitny:1.3,wino:1.6};
['slod','chmiel','beczki','piwo','mpitny','winogrona','wino'].forEach(k=>{if(!NEWRES.includes(k))NEWRES.push(k)});
try{ZAP_G.push(['Napitki',['piwo','mpitny','wino','slod','chmiel','winogrona','beczki']])}catch(e){}
const scNap=()=>NAPK.reduce((a,k)=>a+(S.res[k]||0),0);

// ---------- etapy serca ----------
const SC_R=[0,10,12,14,16,18];// zasięg: ludzie mieszkający bliżej przychodzą wieczorem chętniej
const SERCE=[null,
 {n:'Ognisko',kr:'Ognisko',loc:'przy ognisku',cost:{drewno:10},work:4,
  d:'Krąg z kamieni, kłody do siedzenia i kocioł na trójnogu. Tu osada je wspólny posiłek, siada wieczorem i świętuje. To serce osady: będzie rosło razem z nią, aż do ratusza. Plac pięć na pięć kroków wokół ogniska zostaje wolny pod rozbudowę.',
  fx:['Wieczorem ludzie siadają przy ognisku, zwłaszcza ci, którzy mieszkają w jego zasięgu. Wspólne wieczory dają nadzieję.','Tu jest wspólny posiłek w południe i tu odbywają się obrzędy.','Jesienią, zimą i wiosną ognisko pali trochę opału.'],open:[]},
 {n:'Wiata przy ognisku',kr:'Wiata',loc:'pod wiatą',cost:{drewno:30,kamien:6},work:10,
  d:'Dach z żerdzi i strzechy nad ogniskiem, dwa długie stoły i ławy, kocioł na łańcuchu. Wieczory odbywają się teraz także w słotę.',
  fx:['Wieczory przy ogniu także w deszczu i śniegu.','Wspólny kocioł: z posiłku w południe wraca więcej jedzenia.'],open:['bednarnia']},
 {n:'Dom osadników',kr:'Dom osadników',loc:'w Domu osadników',cost:{drewno:60,deski:24,kamien:20,gwozdzie:24},work:26,
  d:'Długa chata z bali z paleniskiem pośrodku i dymnikiem w dachu. Mieści całą osadę. Zimą i w słotę wieczory są w ciepłej izbie, latem przy ognisku przed wejściem.',
  fx:['Zimą i w słotę wieczory w ciepłej izbie: więcej nadziei i zgody, więzi między ludźmi rosną.','Obyczaje zmienia się łagodniej, spory gasną szybciej.','Wieczorem pije się piwo, miód pitny albo wino, jeśli są w zapasie. Napitki dają radość i zgodę.','Izba zimą pali opał.'],open:['slodownia','chmielnik','browar','miodosytnia','piekarz']},
 {n:'Dom rady',kr:'Dom rady',loc:'w Domu rady',cost:{deski:50,kamien:40,cegla:30,gwozdzie:36,plotno:8},work:44,
  d:'Wysoki dom na kamiennej podmurówce, z podcieniem na rzeźbionych słupach i chorągwiami rodów. W izbie stoi stół rady, a przed domem plac wyłożony kamieniem.',
  fx:['Rada osady: trzech radnych, każdy z teką. Radny wzmacnia swoją dziedzinę i co jakiś czas zgłasza wniosek, konkretne zadanie na kilka dni.','Wiec obraduje w Domu rady: zmiana obyczaju kosztuje mniej zgody.'],open:['szpital','winnica','winiarnia','wiatrak']},
 {n:'Ratusz',kr:'Ratusz',loc:'w ratuszu',cost:{kamien:90,cegla:70,deski:60,gwozdzie:60,narz:6,plotno:12},work:80,
  d:'Murowany ratusz z drewnianym piętrem i wieżą z dzwonem, widoczną z całej okolicy. Przed nim rynek z bruku, studnia i kram. Tu obraduje rada całej wyspy.',
  fx:['Pięciu radnych.','Wieża z dzwonem: widać z niej daleko, a dzwon szybciej zwołuje do gaszenia ognia.','Jarmark raz w roku, trzeciego dnia jesieni: przysiółki przywożą podwójne dary.','Cechy rzemieślników, gdy w każdej krainie pali się nasz ogień.'],open:[]}];
const SC_OPEN_N=st=>(SERCE[st].open||[]).map(k=>BD[k]?BD[k].n:k);
const SC_INST={4:['rada osady (3 radnych)'],5:['rada wyspy (5 radnych)','jarmark','cechy rzemieślników','prawa miejskie']};

// ---------- filary i pakiety zadań ----------
const FIL={dach:['Dach','osada'],stol:['Stół','zywnosc'],cieplo:['Ciepło','cieplo'],zdrowie:['Zdrowie','zdrowie'],rzem:['Rzemiosło','narz'],wsp:['Wspólnota','ludzie']};
const FILK=Object.keys(FIL);
const scNeed=()=>Math.max(1,K*S.people.reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0));
const scDays=()=>foodTotal()/scNeed();
const scTypes=()=>FOOD.filter(k=>(S.res[k]||0)>=5).length;
function scFuelDay(){let f=0;Object.values(S.fams).forEach(x=>{if(!famMembers(x.id).length)return;const h=x.home&&bById(x.home);if(h&&bDone(h)&&BD[h.kind].fuel)f+=BD[h.kind].fuel});
 return Math.max(1,f*K*1.6*(hasB('piec')?.6:1)*(law('z_oszcz')?.85:1))}
const scFuelDays=()=>(S.res.opal||0)/scFuelDay();
const scCnt=ks=>S.bld.filter(b=>ks.includes(b.kind)&&bDone(b)).length;
function scSzal(){return Object.values(S.fams).filter(f=>{if(!famMembers(f.id).length)return false;const h=f.home&&bById(f.home);return h&&h.kind==='szalas'}).length}
function scShops(){const s=new Set();S.bld.forEach(b=>{const c=BD[b.kind].cat;if(bDone(b)&&(c==='rzemioslo'||c==='przetw'))s.add(b.kind)});return[...s]}
const scProc=()=>(S.res.chleb||0)+(S.res.ser||0)+(S.res.kiszonki||0);
const scM4=c=>S.people.some(p=>isAdult(p)&&(p.sk[c]||0)>=4);
let scRegC=0,scRegD=-9;
function scRegNeed(){if(S.e3&&S.e3.regN)return S.e3.regN;if(S.day-scRegD>1||!scRegC){scRegC=Math.max(1,e3Regs().length);scRegD=S.day}return scRegC}
const scHalf=()=>e3Settled()>=Math.ceil(scRegNeed()/2);
const scFull=()=>e3Settled()>=scRegNeed();
const scHouses=()=>S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;
const scSizeTxt=t=>`domy: ${scHouses()} z ${TIERS[t][1]}, ludzie: ${S.people.length} z ${TIERS[t][2]}`;
const dniS=n=>`${n} ${dniW(n)}`;
const rodzW=n=>n===1?'rodzina':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'rodziny':'rodzin';
// zadanie: [tytuł, warunek, postęp, jak to zrobić, budynek do postawienia]
const SPK={
 2:{n:'Wspólny ogień',intro:'Ognisko pali się co wieczór. Żeby postawić nad nim dach i stoły, osada musi najpierw stanąć na nogi.',size:null,t:{
  dach:['Każda rodzina pod dachem',()=>S.people.length>0&&S.people.every(p=>homeOf(p)),()=>`dach ma ${S.people.filter(p=>homeOf(p)).length} z ${S.people.length} osób`,'Budowa → Domy. Szałas wystarczy na początek.','szalas'],
  stol:['Jedzenie na 6 dni',()=>scDays()>=6,()=>`teraz starczy na ${dniS(Math.floor(scDays()))}`,'Zbieracze, rybacy i myśliwi. Zapas liczy się względem tego, ile osada zjada w ciągu dnia.','zbieracz'],
  cieplo:['Drewutnia i 40 opału',()=>hasB('drewutnia')&&(S.res.opal||0)>=40,()=>hasB('drewutnia')?`opał: ${fmt(S.res.opal)} z 40`:'brakuje drewutni','Drewutnia rąbie kłody na opał: z jednej kłody trzy porcje.','drewutnia'],
  zdrowie:['Studnia',()=>hasB('studnia'),()=>'jeszcze nie ma studni','Czysta woda dla 14 osób. Bez niej latem ludzie chorują od wody ze strumienia.','studnia'],
  rzem:['Pracownia cieśli albo warsztat',()=>hasB('pracownia')||hasB('warsztat'),()=>'deski i narzędzia są jeszcze z wraku','Pracownia piłuje deski z kłód, warsztat robi kamienne narzędzia.','pracownia'],
  wsp:['Pięć wieczorów przy ognisku',()=>(S.sc.ev||0)>=5,()=>`wieczorów: ${Math.min(5,S.sc.ev||0)} z 5`,'Liczy się wieczór, przy którym siedzi co najmniej co trzecia osoba z osady. Chętniej przychodzą ci, którzy mieszkają w zasięgu ogniska.']}},
 3:{n:'Pod jednym dachem',intro:'Pod wiatą robi się ciasno, a zimą wieje. Ludzie chcą długiej chaty z paleniskiem pośrodku, w której zmieści się cała osada. Najpierw osada musi urosnąć i okrzepnąć.',
  size:['Osada: 4 domy i 20 osób',()=>S.tier>=1,()=>scSizeTxt(1)],t:{
  dach:['Cztery chaty z bali albo domy',()=>scCnt(['chata','dom','dwor'])>=4,()=>`${scCnt(['chata','dom','dwor'])} z 4`,'Szałas rozbudujesz w chatę z bali: zaznacz go i wybierz „Rozbuduj”.','chata'],
  stol:['Jedzenie na 10 dni, z czterech rodzajów',()=>scDays()>=10&&scTypes()>=4,()=>`${dniS(Math.floor(scDays()))}, rodzajów: ${scTypes()} z 4`,'Rodzaj liczy się od 5 porcji w zapasie: jagody, grzyby, ryby, mięso, ziarno, mleko, miód, warzywa, chleb, ser, kiszonki.'],
  cieplo:['Odzież w zapasie dla połowy osady',()=>(S.res.odziez||0)>=Math.ceil(S.people.length/2),()=>`odzież: ${fmt(S.res.odziez)} z ${Math.ceil(S.people.length/2)}`,'Szwalnia szyje odzież ze skór, skóry dają myśliwi.','szwalnia'],
  zdrowie:['Czysta woda dla wszystkich',()=>waterCap()>=S.people.length,()=>`studnie dają wodę dla ${waterCap()} z ${S.people.length} osób`,'Każda studnia daje wodę dla 14 osób, żuraw przy studni dla kolejnych 8.','studnia'],
  rzem:['Cztery różne warsztaty',()=>scShops().length>=4,()=>{const L=scShops();return`${L.length} z 4${L.length?': '+L.map(k=>BD[k].n.toLowerCase()).join(', '):''}`},'Liczą się budynki rzemiosła i przetwórstwa: drewutnia, pracownia, warsztat, szwalnia, żarna, piec chlebowy i inne.'],
  wsp:['Nadzieja 60%, niezgoda poniżej 30%',()=>S.hope>=.6&&(S.dis||0)<.3,()=>`nadzieja ${Math.round(S.hope*100)}%, niezgoda ${Math.round((S.dis||0)*100)}%`,'Nadzieję dają syte brzuchy, ciepłe domy, wspólne wieczory i spełnione prośby. Niezgodę gaszą obyczaje i wspólne święta.']}},
 4:{n:'Rada przy stole',intro:'Wieś ma już swoje sprawy: miedze, zapasy, budowy na wiosnę. Starsi chcą izby, w której rada usiądzie przy stole. Rada ma jednak sens tylko we wsi, która stoi pewnie na każdej nodze.',
  size:['Wieś: 8 domów i 32 osoby',()=>S.tier>=2,()=>scSizeTxt(2)],t:{
  dach:['Trzy domy z piecem, nikt w szałasie',()=>scCnt(['dom','dwor'])>=3&&scSzal()===0,()=>{const n=scCnt(['dom','dwor']),s=scSzal();return`domy z piecem: ${n} z 3${s?`, w szałasach: ${s} ${rodzW(s)}`:''}`},'Chatę z bali rozbudujesz w dom z piecem, gdy osada zna piec zduński.','dom'],
  stol:['60 porcji przetworów',()=>scProc()>=60,()=>`chleb, ser i kiszonki: ${fmt(scProc())} z 60`,'Przetwory nie psują się tygodniami: piec chlebowy, serownia, komora kiszonek.','piekarnia'],
  cieplo:['Opał na 15 dni zimy',()=>scFuelDays()>=15,()=>`opał: ${fmt(S.res.opal)} z ${Math.ceil(15*scFuelDay())}`,'Ile opału zjada zima, zależy od domów: dom z piecem pali najmniej.','drewutnia'],
  zdrowie:['Chata zielarki i 20 ziół',()=>hasB('izbachorych')&&(S.res.ziola||0)>=20,()=>hasB('izbachorych')?`zioła: ${fmt(S.res.ziola)} z 20`:'brakuje chaty zielarki','Chata zielarki wymaga wiedzy o opatrywaniu ran. Zioła rosną w ogrodzie ziołowym albo zbierają je zbieracze.','izbachorych'],
  rzem:['Własne żelazo: kuźnia albo dymarka',()=>hasB('kuznia')||hasB('dymarka'),()=>'żelazo jest jeszcze z wraku','Kuźnia potrzebuje rudy i węgla drzewnego, a najpierw udanej próby wytopu.','kuznia'],
  wsp:['Uczta z napitkami',()=>(S.sc.ucz||0)>=1,()=>scNap()>=1?`napitków w zapasie: ${fmt(scNap())}, czekają na najbliższe święto albo wesele`:'nie ma jeszcze napitków','Na święcie albo weselu musi być piwo, miód pitny albo wino. Browar i miodosytnię odblokowuje Dom osadników.','browar']}},
 5:{n:'Wyspa jak jedno gospodarstwo',intro:'Rada obraduje w Domu rady, ale sprawy całej wyspy już się w nim nie mieszczą: przysiółki, drogi, wozy, jarmark. Potrzebny jest ratusz z wieżą widoczną z daleka. Taki dom stawia się dopiero wtedy, gdy wyspa żyje jak jedno gospodarstwo.',
  size:['Przystań: 14 domów i 50 osób, przysiółki w połowie krain',()=>S.tier>=3&&scHalf(),()=>scSizeTxt(3)+`, zasiedlone krainy: ${e3Settled()} z ${Math.ceil(scRegNeed()/2)}`],t:{
  dach:['Osiem domów z piecem, żaden budynek w ruinie',()=>scCnt(['dom','dwor'])>=8&&!S.bld.some(b=>bDone(b)&&condOf(b)<.5),()=>{const n=scCnt(['dom','dwor']),r=S.bld.filter(b=>bDone(b)&&condOf(b)<.5).length;return`domy z piecem: ${n} z 8${r?`, do remontu: ${r}`:''}`},'Budynek w ruinie to taki, którego stan spadł poniżej 50%. Remonty są w zakładce Budowa.','dom'],
  stol:['Jedzenie na 20 dni, z siedmiu rodzajów',()=>scDays()>=20&&scTypes()>=7,()=>`${dniS(Math.floor(scDays()))}, rodzajów: ${scTypes()} z 7`,'Pola, stada, łowiska i przetwórnie. Spichlerze i spiżarnie mieszczą więcej.'],
  cieplo:['Opał na 25 dni zimy',()=>scFuelDays()>=25,()=>`opał: ${fmt(S.res.opal)} z ${Math.ceil(25*scFuelDay())}`,'Drewutnie, kopanki torfu, a domy z piecem palą mniej.','drewutnia'],
  zdrowie:['Szpital i zdrowie osady 80%',()=>hasB('szpital')&&S.health>=.8,()=>hasB('szpital')?`zdrowie osady: ${Math.round(S.health*100)}%`:'brakuje szpitala','Szpital odblokowuje Dom rady. Można go postawić albo rozbudować w niego chatę zielarki.','szpital'],
  rzem:['Mistrzowie poziomu 4: cieśla, kowal, murarz, krawiec',()=>['ciesla','kowal','murarz','krawiec'].every(scM4),()=>{const m=['ciesla','kowal','murarz','krawiec'].filter(c=>!scM4(c)).map(c=>CN[c]);return m.length?'brakuje: '+m.join(', '):''},'Poziom fachu rośnie z pracy, a uczniowie przy mistrzu uczą się szybciej.'],
  wsp:['Trzy wnioski rady spełnione',()=>(S.sc.wnOk||0)>=3,()=>`spełnione wnioski: ${Math.min(3,S.sc.wnOk||0)} z 3`,'Radni w Domu rady zgłaszają wnioski: konkretne zadania na kilka dni.']}}};

// ---------- stan ----------
function scB(){return S&&S.bld?S.bld.find(b=>b.kind==='serce'):null}
function scSt(){const b=scB();return b&&bDone(b)?(b.st||1):0}
function wspOn(){return hasB('domwsp')||scSt()>=3}
function wspName(){const s=scSt();return s>=3?SERCE[s].n:hasB('domwsp')?'Chata wiecowa':'Dom osadników'}
function scFire(b){b=b||scB();if(!b)return null;const c=bCenter(b);return{x:c.x,z:c.z+((b.st||1)>=3?1.4:.5)}}
function scC(){return scSt()?scFire():null}
const scReach=()=>SC_R[scSt()]||SC_R[1];
function scInit(){if(!S)return;S.sc=S.sc||{};const s=S.sc;s.done=s.done||{};s.ev=s.ev||0;s.ucz=s.ucz||0;s.wn=s.wn||[];s.wnOk=s.wnOk||0;s.wnCd=s.wnCd||{};s.cech=s.cech||{};s.rada=s.rada||[];s.jarN=s.jarN||0;
 NEWRES.forEach(k=>{if(typeof S.res[k]!=='number')S.res[k]=0});scKnow();scRadaSeats()}
function scKnow(){if(!S||!S.know)return;const s=scSt();for(let k=2;k<=5;k++)S.know['sc'+k]=s>=k?'tak':'nie'}

// ---------- budynki ----------
Object.assign(BD,{
 serce:{cat:'wsp',w:5,h:5,sc:1,get n(){const b=scB();return b?SERCE[b.st||1].n:'Ognisko'},get cost(){const b=scB();return(b&&bDone(b)?SERCE[b.st||1]:SERCE[1]).cost},get work(){const b=scB();return(b&&bDone(b)?SERCE[b.st||1]:SERCE[1]).work},
  get r(){return scReach()},get d(){const b=scB();return b?SERCE[b.st||1].d:SERCE[1].d+' Stawia się je raz, tam, gdzie ma być środek osady.'}},
 bednarnia:{cat:'rzemioslo',n:'Bednarnia',w:2,h:2,cost:{drewno:14,deski:6},work:7,wk:1,c:'ciesla',need:'sc2',prod:{in:{deski:2},out:{beczki:3},t:18,target:40},d:'Bednarz gnie klepki nad ogniem i ściąga je obręczami z leszczyny. W beczce kisi się kapusta (komora kiszonek robi z nią więcej kiszonek), a później leżakuje piwo, miód pitny i wino.'},
 slodownia:{cat:'przetw',n:'Słodownia',w:2,h:2,cost:{drewno:16,kamien:10,glina:6},work:8,wk:1,c:'rolnik',need:'sc3',prod:{in:{ziarno:6},out:{slod:5},t:16,target:40,reserve:()=>({ziarno:10*S.bld.filter(b=>b.field).length})},d:'Ziarno moczy się w kadzi, kiełkuje na klepisku i suszy nad ogniem. Tak powstaje słód do piwa. Ziarna na siew słodownia nie rusza.'},
 chmielnik:{cat:'uprawa',n:'Chmielnik',w:2,h:2,cost:{drewno:12},work:5,wk:1,c:'zbieracz',need:'sc3',prod:{in:{},out:{chmiel:2},t:22,target:30,when:()=>seasonIdx()<2},d:'Wysokie tyczki, po których pnie się chmiel. Szyszki zbiera się latem i jesienią. Bez chmielu piwo szybko kwaśnieje.'},
 browar:{cat:'przetw',n:'Browar',w:3,h:2,cost:{drewno:24,deski:12,kamien:12,gwozdzie:8},work:12,wk:2,c:'rolnik',need:'sc3',prod:{in:{slod:4,chmiel:1,beczki:1,opal:1},out:{piwo:10},t:28,target:100},d:'Kocioł nad paleniskiem, kadzie i beczki. Piwowar warzy piwo ze słodu i chmielu. Pije się je wieczorem w Domu osadników i na każdym weselu.'},
 miodosytnia:{cat:'przetw',n:'Miodosytnia',w:2,h:2,cost:{drewno:14,deski:8,glina:6},work:8,wk:1,c:'zbieracz',need:'sc3',prod:{in:{miod:4,beczki:1},out:{mpitny:6},t:40,target:60},d:'Miód rozcieńczony wodą, sycony w kotle i odstawiony w beczkach na długie miesiące. Miód pitny jest mocniejszy od piwa i cieszy bardziej.'},
 piekarz:{cat:'przetw',n:'Piekarnia',w:3,h:2,cost:{kamien:16,glina:16,deski:10,cegla:8},work:12,wk:2,c:'rolnik',need:'sc3',prod:{in:{maka:6,opal:1},out:{chleb:12},t:18,target:120},d:'Murowany piec i izba piekarza. Piekarz piecze co dzień dla całej osady: z tej samej mąki więcej chleba niż w glinianym piecu chlebowym.'},
 winnica:{cat:'uprawa',n:'Winnica',w:3,h:3,cost:{drewno:16,kamien:8},work:8,wk:2,c:'rolnik',need:'sc4',prod:{in:{},out:{winogrona:3},t:20,target:90,when:()=>seasonIdx()<2},d:'Rzędy winorośli na palikach. Najlepiej rodzi na stoku od południa, na płaskim słabiej, na stoku od północy marnie. Winogrona zbiera się latem i jesienią.'},
 winiarnia:{cat:'przetw',n:'Winiarnia',w:2,h:2,cost:{kamien:20,deski:12,gwozdzie:10},work:10,wk:1,c:'rolnik',need:'sc4',prod:{in:{winogrona:5,beczki:1},out:{wino:4},t:24,target:60},d:'Prasa do winogron, kadzie i chłodna piwnica z beczkami. Wino jest najmocniejszym napitkiem: na uczcie cieszy najbardziej.'},
 wiatrak:{cat:'przetw',n:'Wiatrak',w:2,h:2,cost:{drewno:30,deski:20,kamien:10,gwozdzie:16,plotno:6},work:16,wk:1,c:'rolnik',need:'sc4',prod:{in:{ziarno:10},out:{maka:9},t:12,target:120,reserve:()=>({ziarno:10*S.bld.filter(b=>b.field).length})},d:'Koźlak: cały obraca się pod wiatr, a skrzydła mielą ziarno szybciej niż żarna. Im wyżej stoi ponad okolicą, tym lepiej wieje. Ziarna na siew nie rusza.'},
 szpital:{cat:'wsp',n:'Szpital',w:3,h:2,cost:{deski:30,kamien:20,cegla:16,plotno:10,gwozdzie:16},work:30,need:'sc4',d:'Bielona izba z rzędem posłań, ogród ziół i kocioł z wrzątkiem. Zielarki pilnują chorych dniem i nocą: chorzy i ranni zdrowieją dużo szybciej, dzieci rzadziej umierają. Zużywa zioła i płótno.'}});
// kapusta kiszona w beczce: z beczką komora kiszonek robi więcej i nie zużywa naczyń
try{const KP0=[].concat(BD.kiszarnia.prod),KPB={in:{warzywa:8,beczki:1},out:{kiszonki:10},t:14,target:90};
 Object.defineProperty(BD.kiszarnia,'prod',{get(){return S&&S.know&&S.know.sc2==='tak'?[KPB].concat(KP0):KP0},configurable:true})}catch(e){}
const SC_NEW=['serce','bednarnia','slodownia','chmielnik','browar','miodosytnia','piekarz','winnica','winiarnia','wiatrak','szpital'];
SC_NEW.forEach(k=>{if(!BKEYS.includes(k))BKEYS.push(k)});
{const i=BKEYS.indexOf('domwsp');if(i>=0)BKEYS.splice(i,1)}// chata wiecowa jest teraz etapem serca osady
Object.assign(E2ACT,{bednarnia:'robi beczki',slodownia:'słoduje ziarno',chmielnik:'zbiera chmiel',browar:'warzy piwo',miodosytnia:'syci miód',piekarz:'piecze chleb',winnica:'pielęgnuje winorośl',winiarnia:'tłoczy wino',wiatrak:'miele na wiatraku'});
Object.assign(SIGNK,{bednarnia:'beczki',slodownia:'slod',browar:'piwo',miodosytnia:'mpitny',piekarz:'zywnosc',winiarnia:'wino'});
ROZB_NO.serce='Serca osady się nie rozbiera: tu osada je, świętuje i radzi.';
UPG.izbachorych='szpital';
try{Object.assign(FLAM,{bednarnia:1.2,slodownia:1.4,browar:1.3,miodosytnia:1,piekarz:.8,winiarnia:.5,wiatrak:1.1,szpital:.6})}catch(e){}

// ---------- plac: zarezerwowany 5 × 5, zajęte tylko to, co stoi ----------
function scTiles(b){const L=[[2,3]];if((b.st||1)>=3)for(let a=0;a<5;a++)for(let q=0;q<2;q++)L.push([a,q]);return L}
function scOcc(b){for(let a=0;a<5;a++)for(let q=0;q<5;q++){const k=(b.j+q)*N+b.i+a;if(occ[k]===b.id)occ[k]=-1;decoHidden.add(k);if(typeof tread!=='undefined')tread[k]=Math.max(tread[k],(b.st||1)>=4?.25:.62)}
 scTiles(b).forEach(([a,q])=>{occ[(b.j+q)*N+b.i+a]=b.id});recomputeWalk();try{treadDirty=true}catch(e){}}
{const _pf=placeFootprint;placeFootprint=function(kind,i,j,val){if(kind!=='serce')return _pf(kind,i,j,val);const b=bById(val)||{i,j,id:val,st:1};scOcc(b);levelFootprint(i,j,5,5)}}
{const _rw=rebuildWorldFromState;rebuildWorldFromState=function(){const r=_rw();try{const b=scB();if(b){scOcc(b);recomputeWalk()}}catch(e){}return r}}
function scInZone(kind,i,j){const b=scB();if(!b||kind==='serce')return false;const d=BD[kind];return i<b.i+5&&i+d.w>b.i&&j<b.j+5&&j+d.h>b.j}
{const _cp=checkPlace;checkPlace=function(kind,i,j){if(kind==='serce'&&scB())return false;if(!_cp(kind,i,j))return false;return!scInZone(kind,i,j)}}
{const _sp=startPlace;startPlace=function(kind){if(kind==='serce'&&scB()){scShow();return}return _sp(kind)}}

// ---------- miejsce spotkań: posiłek, wieczór, obrzędy ----------
{const _rs=ringSpot;ringSpot=function(k,n,r){const st=scSt();if(st<3)return _rs(k,n,r);const f=scFire();const a=-.12*Math.PI+(k/Math.max(1,n-1))*1.24*Math.PI;
  const x=f.x+Math.cos(a)*r,z=f.z+Math.sin(a)*r*.85;return nearestWalk(...tileOf(x,z))}}
{const _cc=cerCenter;cerCenter=function(k){const c=_cc(k);const st=scSt();if(!st||k==='kupala'&&hasB('gaj')||k==='dziady'&&hasB('cmentarz')||k==='marzanna')return c;
  const f=scFire();let x=f.x,z=f.z+(st>=3?.9:0);const t=nearestWalk(...tileOf(x,z));if(t){x=tcx(t[0]);z=tcx(t[1])}return{x,z}}}
function scBadWx(){const k=S.weather&&S.weather.k;return WX.rain>.35||WX.snow>.35||['rain','storm','snow','zamiec','grad','burza'].includes(k)}
function scCold(){const s=seasonIdx();return s===2||(s!==0&&WEATHER[S.weather.k]&&WEATHER[S.weather.k][2]<0)}
function scHallSpot(p){const b=scB();const a=1+(p.id%3);return nearestWalk(b.i+a,b.j+2)}
{const _es=eveSpot;eveSpot=function(p){const st=scSt();if(!st)return _es(p);
  if(isSobota()&&p.age>=12&&S.bld.some(b=>b.kind==='laznia'&&bDone(b)))return _es(p);
  const f=scFire(),h=homeOf(p);let dist=0;if(h&&bDone(h)){const c=bCenter(h);dist=Math.hypot(c.x-f.x,c.z-f.z)}
  const near=dist<=scReach(),bad=scBadWx(),inside=st>=3&&(bad||scCold());
  let pr=near?.55:.14;if(bad&&st<2)pr*=.3;if(inside)pr=near?.62:.18;if(p.age<12)pr*=.8;
  if(Math.random()<pr){if(inside){p.eveK='hala';p.inHall=0;return scHallSpot(p)}p.eveK='ogien';const all=S.people.filter(q=>q.age>=3);const k=all.indexOf(p);return ringSpot(k,all.length,2.6+(k%4)*.6)}
  const r=_es(p);return r}}
Object.defineProperty(EVE_ACT,'hala',{get(){const s=scSt();return'siedzi '+(SERCE[s]?SERCE[s].loc:'przy ognisku')},configurable:true});
{const _oa=onArrive;onArrive=function(p){if(p.after==='eve'&&p.eveK==='hala'){const r=_oa(p);p.inHall=1;return r}return _oa(p)}}
{const _sp2=stepPerson;stepPerson=function(p,dt){if(p.inHall&&p.state!=='eve')p.inHall=0;return _sp2(p,dt)}}

// ---------- codziennie: wieczory, napitki, opał, kocioł ----------
function scDaily(){if(!S||!S.sc)return;const st=scSt();if(!st)return;const d=dayN()-1;const pop=S.people.length;if(!pop)return;
 const at=S.people.filter(p=>p.eveD===d&&(p.eveK==='ogien'||p.eveK==='hala'));const share=at.length/pop;S.sc.evShare=share;
 if(share>=.3){S.sc.ev=(S.sc.ev||0)+1;S.hope=clamp(S.hope+.004*KF*share,0,1)}
 // wieczór w ciepłej izbie
 const inH=at.filter(p=>p.eveK==='hala').length/pop;if(inH>=.25){S.hope=clamp(S.hope+.006*KF*inH,0,1);S.dis=Math.max(0,(S.dis||0)-.006*KF*inH)}
 // ogień i izba palą opał w chłodne pory
 if(seasonIdx()!==0&&share>=.2){const use=(st>=3?.55:.3)*K*(st>=5?1.2:1);S.res.opal=Math.max(0,(S.res.opal||0)-use)}
 // napitki do wieczerzy
 if(st>=3&&share>=.2){const ad=at.filter(isAdult).length;const want=ad*.12*K;const got=scDrink(want);S.sc.napD=got;
  if(want>0&&got>0){const f=Math.min(1,got/want);S.hope=clamp(S.hope+.008*KF*share*f,0,1);S.dis=Math.max(0,(S.dis||0)-.008*KF*share*f);
   if(!S.seen.nap1){S.seen.nap1=1;log(`Pierwszy wieczór z ${S.res.piwo>0?'piwem':'miodem pitnym'} ${SERCE[st].loc}. Ktoś przynosi gęśle, starzy śpiewają pieśni z dawnej wsi.`)}}}
 // wspólny kocioł pod dachem: z posiłku wraca więcej
 if(st>=2){const ad=S.people.filter(isWorker);const ate=ad.length?ad.filter(p=>p.mealD===d).length/ad.length:0;if(ate>.4){const tot=foodTotal(),back=K*pop*.06*ate;if(tot>0)FOOD.forEach(k=>S.res[k]+=back*(S.res[k]/tot));S.kociol=(S.kociol||0)+back}}
 scRadaDaily();scSzpDaily();scJarmark();scWnDaily()}
// wypić: zwraca, ile „mocy” udało się podać (wino mocniejsze niż piwo)
function scDrink(want){if(want<=0)return 0;let got=0;const tot=NAPK.reduce((a,k)=>a+(S.res[k]||0)*NAPM[k],0);if(tot<=0)return 0;const f=Math.min(1,want/tot);
 NAPK.forEach(k=>{const v=(S.res[k]||0)*f;S.res[k]=Math.max(0,(S.res[k]||0)-v);got+=v*NAPM[k]});return got}
{const _nd=newDay;newDay=function(){const op=S?(S.res.opal||0):0;const r=_nd.apply(this,arguments);try{scFuelBack(op);scDaily();scTick()}catch(e){console.warn('serce',e)}return r}}
// uczty: święta i wesela z napitkami
{const _cs=cerStart;cerStart=function(){_cs();try{const C=S.cer;if(!C||C.napD)return;C.napD=1;if(scSt()<3&&scNap()<1)return;const n=(C.slots||[]).length;if(n<3)return;
  const want=n*.6,got=scDrink(want);if(got<=0)return;const f=Math.min(1,got/want);S.hope=clamp(S.hope+.03*f,0,1);S.dis=Math.max(0,(S.dis||0)-.03*f);
  if(f>=.5){S.sc.ucz=(S.sc.ucz||0)+1;if(S.sc.ucz===1)log(`${CER_N[C.k]||'Święto'} z napitkami. Beczki stoją na placu, dzban krąży od rąk do rąk. Takiej uczty wyspa jeszcze nie widziała.`)}}catch(e){}}}
CER_N.jarmark='Jarmark';

// ---------- rozbudowa serca ----------
function scPkgKey(st,f){return'p'+st+'_'+f}
function scPkg(){const b=scB();if(!b||!bDone(b))return null;const st=b.st||1;if(st>=5)return null;return{to:st+1,P:SPK[st+1]}}
function scTaskOk(to,f){return!!S.sc.done[scPkgKey(to,f)]}
function scSizeOk(to){const P=SPK[to];if(!P||!P.size)return true;try{return P.size[1]()}catch(e){return false}}
function scReady(){const k=scPkg();if(!k)return false;return FILK.every(f=>scTaskOk(k.to,f))&&scSizeOk(k.to)}
function scTick(){if(!S)return;if(!S.sc)scInit();const b=scB();
 if(!b&&S.day>=1.35&&!S.seen.scHint&&S.people.length){S.seen.scHint=1;log('Wieczorem ktoś mówi, że osada potrzebuje własnego ogniska, nie obozowego: miejsca, gdzie wszyscy zjedzą razem i usiądą po pracy. Budowa → Wspólnota → Ognisko. To będzie serce osady.');toast('Postaw ognisko: serce osady')}
 if(!b||!bDone(b))return;const k=scPkg();
 if(k&&!b.proj){const got=[];FILK.forEach(f=>{const key=scPkgKey(k.to,f);if(S.sc.done[key])return;const T=k.P.t[f];let ok=false;try{ok=T[1]()}catch(e){}
   if(ok){S.sc.done[key]=Math.floor(S.day)+1;got.push(f)}});
  if(got.length===1){const T=k.P.t[got[0]];log(`Serce osady, ${FIL[got[0]][0].toLowerCase()}: ${T[0].toLowerCase()}. Spełnione.`);toast(`${FIL[got[0]][0]}: ${T[0]}`)}
  else if(got.length>1){log(`Serce osady, pakiet „${k.P.n}”: spełnione ${got.map(f=>k.P.t[f][0].toLowerCase()).join('; ')}.`);toast(`Serce osady: spełnione zadania (${got.length})`)}
  if(scReady()&&S.sc.readyN!==k.to){S.sc.readyN=k.to;log(`Wszystko gotowe, żeby rozbudować serce osady: ${SERCE[k.to].n.toLowerCase()}. Zaznacz ${SERCE[b.st||1].n.toLowerCase()} i wybierz „Rozbuduj”.`);toast('Serce osady: można rozbudować');try{sfx('bell')}catch(e){}}}
 if(b.proj&&b.proj.t==='serce'){const q=Math.floor(4*b.proj.prog/Math.max(1,b.proj.work));if(q!==b._pq){b._pq=q;rebuildMesh(b)}}
 scWnCheck()}
{const _gt=goalsTick;goalsTick=function(){_gt();try{scTick()}catch(e){console.warn('serce',e)}}}
function scUp(){const b=scB();if(!b||!bDone(b))return;if(b.proj){toast('Tu już trwają prace.');return}const k=scPkg();if(!k)return;
 if(!scReady()){toast('Najpierw pakiet zadań: wszystkie filary i wielkość osady.');return}const c=SERCE[k.to].cost;
 if(!canAfford(c)){toast('Brakuje: '+Object.entries(c).filter(([r,v])=>(S.res[r]||0)<v).map(([r,v])=>RN[r].toLowerCase()+' '+Math.ceil(v-(S.res[r]||0))).join(', '));return}
 Object.entries(c).forEach(([r,v])=>S.res[r]-=v);b.proj={t:'serce',id:k.to,prog:0,work:SERCE[k.to].work};b._pq=0;
 log(`Zaczyna się rozbudowa serca osady: ${SERCE[k.to].n.toLowerCase()}. Cieśle i murarze przychodzą, kiedy tylko mogą.`);toast('Rozbudowa: '+SERCE[k.to].n);rebuildMesh(b);
 if(freeCount()===0)toast('Nikt nie buduje: wszyscy mają pracę. Zwolnij kogoś w zakładce Praca.');renderSel();renderPanel()}
{const _fp=finishProj;finishProj=function(b){if(!b||!b.proj||b.proj.t!=='serce')return _fp(b);const to=b.proj.id;b.proj=null;b.workers=0;scSetStage(b,to);
  try{const c=bCenter(b);dustPuff(c.x,Hy(c.x,c.z),c.z,16,5);sfx('bell')}catch(e){}scStageScene(to);assign();renderSel();renderPanel()}}
function scSetStage(b,st,quiet){b.st=st;b.cond=1;scOcc(b);rebuildMesh(b);scKnow();scRadaSeats();
 if(st>=5&&!S.sc.tower){S.sc.tower=1;try{reveal(b.i+2,b.j+2,30);fogPass(true)}catch(e){}}
 if(!quiet){S.hope=clamp(S.hope+.06,0,1);S.dis=Math.max(0,(S.dis||0)-.04);try{pamAdd(st>=3?3:2,'serce')}catch(e){}log(`Serce osady: ${SERCE[st].n.toLowerCase()} gotowe.`);toast(SERCE[st].n+' gotowe')}}
const SC_SCENE={
 2:'Nad ogniskiem stoi dach z żerdzi i strzechy. Pod nim dwa długie stoły, ławy i kocioł na łańcuchu. Pierwszego wieczoru pada deszcz, a nikt nie idzie do szałasów. Ktoś zaczyna śpiewać.',
 3:'Długa chata z bali, z paleniskiem pośrodku i dymnikiem pod kalenicą. Mieści całą osadę. Na ścianie przy wejściu wisi deska z wyciętymi imionami tych, którzy przypłynęli na statku.\n\nPierwszej zimy nikt już nie siedzi sam w ciemnym domu.',
 4:'Dom rady stoi na kamiennej podmurówce, z podcieniem na rzeźbionych słupach. W izbie długi stół i ławy dla radnych, na ścianach chorągwie rodów. Przed domem ułożono kamienny plac.\n\nPierwsza rada musi zdecydować, czym się zajmie.',
 5:'Wieżę ratusza widać z każdego przysiółka, a dzwon słychać aż na halach. Przed ratuszem leży rynek z bruku, ze studnią i kramem. Ludzie z przysiółków przychodzą popatrzeć i długo nie odchodzą.\n\nWyspa ma swoje miasto.'};
function scStageScene(st){const ul=SC_OPEN_N(st).concat(SC_INST[st]||[]);const txt=SC_SCENE[st]||'';
 if(st===3)try{song('Pieśń o Domu osadników')}catch(e){}if(st===5)try{song('Pieśń o ratuszowym dzwonie')}catch(e){}
 const opts=st===4?[
   {n:'Budowy, spiżarnia i zdrowie',d:'osada rośnie, jedzenie się nie psuje, ludzie zdrowieją',f:()=>{scSetTeki(['dach','stol','zdrowie']);return scUl(ul)}},
   {n:'Spiżarnia, opał i zgoda',d:'syto, ciepło i spokojnie',f:()=>{scSetTeki(['stol','cieplo','wsp']);return scUl(ul)}},
   {n:'Rzemiosło, budowy i zgoda',d:'warsztaty, budowy i mniej sporów',f:()=>{scSetTeki(['rzem','dach','wsp']);return scUl(ul)}}]
  :[{n:'Dalej',d:'',f:()=>scUl(ul)}];
 const go=()=>{if(evOpen||placing){gameLater(go,3000);return}openEvent({ey:'Serce osady',t:SERCE[st].n,text:()=>txt,opts},{})};go()}
const scUl=ul=>ul.length?'Odblokowano: '+ul.join(', ')+'.':'Serce osady urosło.';

// ---------- rada osady (Dom rady: 3 radnych, ratusz: 5) ----------
const TEKI={
 dach:{n:'Budowy',fx:'budowy i remonty idą do 16% szybciej',sk:['ciesla','murarz']},
 stol:{n:'Spiżarnia',fx:'jedzenie psuje się do 20% wolniej, przetwórnie pracują do 10% szybciej',sk:['rolnik','zbieracz','hodowca']},
 cieplo:{n:'Opał i odzież',fx:'domy palą do 12% mniej opału, drewutnie i szwalnie pracują do 10% szybciej',sk:['drwal','krawiec']},
 zdrowie:{n:'Zdrowie',fx:'chorzy zdrowieją szybciej, dzieci rzadziej chorują',sk:['zbieracz']},
 rzem:{n:'Rzemiosło',fx:'warsztaty, kuźnie i garncarnie do 10% szybciej, nauka fachu szybsza',sk:['kowal','ciesla','murarz','krawiec']},
 wsp:{n:'Zgoda',fx:'niezgoda spada szybciej, nadzieja rośnie',sk:[]}};
const TEKK=Object.keys(TEKI);
const radSeats=()=>{const s=scSt();return s>=5?5:s>=4?3:0};
function scRadaSeats(){if(!S||!S.sc)return;const n=radSeats();const R=S.sc.rada;const def=['dach','stol','zdrowie','wsp','rzem','cieplo'];
 while(R.length<n){const t=def.find(x=>!R.some(r=>r.t===x))||def[R.length%6];R.push({t,p:null})}if(R.length>n)R.length=n}
function scSetTeki(L){scRadaSeats();L.forEach((t,i)=>{if(S.sc.rada[i]){S.sc.rada[i].t=t;S.sc.rada[i].p=null}});scRadaFill();S.sc.radaSk=seasonKey()}
function radFit(p,t){const T=TEKI[t];let q=.6+Math.min(.35,mirOf(p)/90)+Math.max(0,...T.sk.map(c=>(p.sk[c]||0)*.05));if(t==='wsp'&&(p.trait==='Pogodny'||p.trait==='Nauczyciel'))q+=.12;
 if(S.e2&&S.e2.r2==='rada'&&p.age>45)q+=.08;return clamp(q,.6,1.2)}
function scRadaFill(){if(!S||!S.sc)return;const R=S.sc.rada;const used=new Set();R.forEach(r=>{const p=r.p!==null&&pById(r.p);if(p&&isAdult(p)&&p.state!=='away'&&!used.has(p.id))used.add(p.id);else r.p=null});
 R.forEach(r=>{if(r.p!==null)return;const c=S.people.filter(p=>isAdult(p)&&p.age>=18&&p.state!=='away'&&p.job!=='wyp'&&!used.has(p.id)).sort((a,b)=>radFit(b,r.t)-radFit(a,r.t))[0];if(c){r.p=c.id;used.add(c.id);if(S.day>1)log(`Do rady wchodzi ${c.name}, z teką: ${TEKI[r.t].n.toLowerCase()}.`)}})}
let radC={},radCT=-1;
function radQ(t){if(!S||!S.sc||!S.sc.rada||!S.sc.rada.length)return 0;if(S.t!==radCT){radC={};radCT=S.t}if(radC[t]!==undefined)return radC[t];const r=S.sc.rada.find(x=>x.t===t&&x.p!==null);let v=0;if(r){const p=pById(r.p);v=p&&isAdult(p)&&p.state!=='away'?radFit(p,t):0}radC[t]=v;return v}
const radWord=(p,q)=>q>=1?(p.sex==='k'?'biegła':'biegły'):q>=.8?(p.sex==='k'?'dobra':'dobry'):(p.sex==='k'?'zwykła':'zwykły');
function scRadaDaily(){if(radSeats())scRadaFill()}
function scTekaSet(i,t){const R=S.sc.rada;if(!R[i]||!TEKI[t])return;if(S.sc.radaSk===seasonKey()&&S.day>2){toast('Teki zmienia się raz na porę roku, na wiecu.');return}
 if(R.some((r,k)=>k!==i&&r.t===t)){toast('Ta teka ma już swojego radnego.');return}R[i].t=t;R[i].p=null;scRadaFill();S.sc.radaSk=seasonKey();S.sc.wn=S.sc.wn.filter(w=>R.some(r=>r.t===w.t));log(`Wiec zmienia teki w radzie: ${TEKI[t].n.toLowerCase()} zamiast dawnej.`);renderSel();renderPanel()}
// wpływ radnych na istniejące mechanizmy
{const _ol=offLv;offLv=function(id){let v=_ol(id);try{if(id==='budowa')v+=Math.round(4*radQ('dach'));else if(id==='spizarnia')v+=Math.round(4*radQ('stol'));else if(id==='zielarz')v+=Math.round(3*radQ('zdrowie'))+(hasB('szpital')?2:0)}catch(e){}return v}}
const SC_CIEPLO=['drewutnia','szwalnia','torfowisko','mielerz'];
{const _bm=bMul;bMul=function(b){let m=_bm(b);try{if(!b||!S||!S.sc)return m;const d=BD[b.kind];
  if(d.cat==='przetw')m*=1+.1*radQ('stol');if(SC_CIEPLO.includes(b.kind))m*=1+.1*radQ('cieplo');else if(d.cat==='rzemioslo')m*=1+.1*radQ('rzem');
  const g=scCechOf(b.kind);if(g&&S.sc.cech[g])m*=1.15;
  if(b.kind==='wiatrak')m*=b.wnd||1;if(b.kind==='winnica')m*=b.sun||1}catch(e){}return m}}
{const _gx=gainXp;gainXp=function(p,c,dt){let m=1;try{if(S&&S.sc){m+=.15*radQ('rzem');const g=CECHY.find(x=>x.c===c&&S.sc.cech[x.k]);if(g)m+=.3}}catch(e){}return _gx(p,c,dt*m)}}
function scFuelBack(op){const q=radQ('cieplo');if(!q)return;const used=op-(S.res.opal||0);if(used>0)S.res.opal+=used*.12*q}
{const _dd=disDaily;disDaily=function(){_dd();try{const q=radQ('wsp');if(q){S.dis=clamp((S.dis||0)-.004*K*q,0,1);S.hope=clamp(S.hope+.002*K*q,0,1)}}catch(e){}}}
{const _cr=rodChildRisk;rodChildRisk=function(p){let r=_cr(p);try{if(hasB('szpital'))r*=.6;r*=1-.2*radQ('zdrowie')}catch(e){}return r}}
{const _cc2=changeCost;changeCost=function(){return _cc2()*(scSt()>=4?.75:1)}}

// ---------- wnioski radnych: konkretne zadania na kilka dni ----------
const WN_T={
 res:{ok:w=>(S.res[w.r]||0)>=w.q,t:w=>`${RN[w.r]}: ${w.q} w zapasie`,p:w=>`${fmt(S.res[w.r]||0)} z ${w.q}`},
 food:{ok:w=>scDays()>=w.q,t:w=>`Jedzenie na ${w.q} dni`,p:()=>`teraz na ${dniS(Math.floor(scDays()))}`},
 fuel:{ok:w=>scFuelDays()>=w.q,t:w=>`Opał na ${w.q} dni zimy`,p:w=>`${fmt(S.res.opal)} z ${Math.ceil(w.q*scFuelDay())}`},
 build:{ok:w=>cntDone(w.b)>=w.q,t:w=>`${BD[w.b].n}: ${w.q>1?'jeszcze jedna, razem '+w.q:'postawić'}`,p:w=>`stoi: ${cntDone(w.b)} z ${w.q}`},
 rep:{ok:()=>!S.bld.some(b=>bDone(b)&&condOf(b)<.5),t:()=>'Wyremontować budynki w złym stanie',p:()=>`do remontu: ${S.bld.filter(b=>bDone(b)&&condOf(b)<.5).length}`},
 szal:{ok:()=>scSzal()===0,t:()=>'Nikt w szałasie: rozbudować szałasy w chaty',p:()=>`w szałasach: ${scSzal()} ${rodzW(scSzal())}`},
 dis:{ok:w=>(S.dis||0)<=w.q,t:w=>`Niezgoda poniżej ${Math.round(w.q*100)}%`,p:()=>`teraz ${Math.round((S.dis||0)*100)}%`},
 hope:{ok:w=>S.hope>=w.q,t:w=>`Nadzieja co najmniej ${Math.round(w.q*100)}%`,p:()=>`teraz ${Math.round(S.hope*100)}%`},
 heal:{ok:()=>!S.people.some(p=>p.hp<.5),t:()=>'Postawić chorych na nogi',p:()=>`ciężko chorych: ${S.people.filter(p=>p.hp<.5).length}`},
 water:{ok:()=>waterCap()>=S.people.length+6,t:()=>'Woda z zapasem: studnie dla wszystkich i jeszcze sześciu',p:()=>`woda dla ${waterCap()} z ${S.people.length+6}`},
 nap:{ok:w=>scNap()>=w.q,t:w=>`Napitki na święto: ${w.q}`,p:w=>`${fmt(scNap())} z ${w.q}`},
 proc:{ok:w=>scProc()>=w.q,t:w=>`Przetwory: ${w.q} porcji chleba, sera i kiszonek`,p:w=>`${fmt(scProc())} z ${w.q}`},
 master:{ok:w=>S.people.some(p=>isAdult(p)&&(p.sk[w.c]||0)>=3),t:w=>`Mistrz w fachu: ${CN[w.c]}`,p:()=>'uczniowie przy mistrzach uczą się szybciej'}};
function scWnMake(t){const pop=S.people.length,ad=S.people.filter(isAdult).length,R=x=>Math.ceil(x/10)*10;
 if(t==='dach'){if(S.bld.some(b=>bDone(b)&&condOf(b)<.5))return{k:'rep',say:'Część budynków się sypie. Trzeba je wyremontować, zanim przyjdzie zima.'};if(scSzal())return{k:'szal',say:'Niektóre rodziny wciąż śpią w szałasach. Czas na chaty z bali.'};
  const kd=bAvail('dom')?'dom':'chata';return{k:'build',b:kd,q:cntDone(kd)+1,say:'Młodzi chcą się żenić, a nie mają gdzie mieszkać. Trzeba nowego domu.'}}
 if(t==='stol'){const d=scDays();if(d<14)return{k:'food',q:Math.max(10,Math.min(30,Math.floor(d)+5)),say:'Zapas jedzenia jest za mały na przednówek.'};if(scProc()<100)return{k:'proc',q:R(scProc()+40),say:'Chleb, ser i kiszonki leżą długo. Niech piekarnia i serownia dołożą.'};
  return{k:'res',r:'ziarno',q:R((S.res.ziarno||0)+80),say:'Ziarno to chleb na zimę i siew na wiosnę. Odłóżmy więcej.'}}
 if(t==='cieplo'){const fd=scFuelDays();if(fd<20)return{k:'fuel',q:Math.max(10,Math.min(30,Math.floor(fd)+6)),say:'Opału jest za mało, żeby przezimować bez strachu.'};if((S.res.odziez||0)<pop/2)return{k:'res',r:'odziez',q:Math.ceil(pop/2),say:'Dzieci rosną z kożuchów. Trzeba więcej odzieży.'};
  return{k:'res',r:'opal',q:R((S.res.opal||0)+120),say:'Lepiej mieć opał na dwie zimy niż na jedną.'}}
 if(t==='zdrowie'){if(waterCap()<pop+6)return{k:'water',say:'Przy studniach są kolejki. Latem woda się kończy.'};if((S.res.ziola||0)<30)return{k:'res',r:'ziola',q:30,say:'Zielarki mają puste półki. Bez ziół choroba idzie szybciej.'};
  if(S.people.some(p=>p.hp<.5))return{k:'heal',say:'Kilka osób ledwo wstaje. Trzeba ich wyleczyć, zanim zachorują inni.'};return{k:'res',r:'plotno',q:R((S.res.plotno||0)+15),say:'Czyste płótno na opatrunki to połowa leczenia.'}}
 if(t==='rzem'){const tl=(S.res.narz||0)+(S.res.narzk||0);if(tl<ad/3)return{k:'res',r:'narz',q:Math.max(4,Math.ceil(ad/3)),say:'Ludzie pracują tępymi narzędziami. Kuźnia musi dorobić.'};
  const c=['ciesla','kowal','murarz','krawiec','rolnik','rybak'].find(c=>!S.people.some(p=>isAdult(p)&&(p.sk[c]||0)>=3));if(c)return{k:'master',c,say:`Nie mamy mistrza w fachu: ${CN[c]}. Niech ktoś się uczy.`};
  return{k:'res',r:'deski',q:R((S.res.deski||0)+60),say:'Deski idą na wszystko. Pracownia cieśli niech piłuje na zapas.'}}
 if(t==='wsp'){if((S.dis||0)>.25)return{k:'dis',q:.2,say:'Ludzie się kłócą. Trzeba to uspokoić, zanim ktoś odejdzie.'};if(scSt()>=3&&scNap()<30)return{k:'nap',q:30,say:'Zbliża się święto, a beczki są puste.'};
  return{k:'hope',q:Math.min(.9,Math.max(.7,Math.round((S.hope+.08)*20)/20)),say:'Niech ludzie mają więcej powodów do radości.'}}
 return null}
function scWnDaily(){const R=S.sc.rada||[];if(!R.length)return;
 S.sc.wn=S.sc.wn.filter(w=>{if(S.day>w.until){S.dis=clamp((S.dis||0)+.015,0,1);const p=pById(w.p);log(`Wniosek ${p?p.name+' ':''}nie został spełniony: ${WN_T[w.k].t(w).toLowerCase()}.`);S.sc.wnCd[w.t]=S.day+4;return false}return true});
 R.forEach(r=>{if(r.p===null||S.sc.wn.some(w=>w.t===r.t)||S.day<(S.sc.wnCd[r.t]||0)||Math.random()>.35)return;const x=scWnMake(r.t);if(!x||!WN_T[x.k])return;
  const w=Object.assign({id:(S.sc.wnId=(S.sc.wnId||0)+1),t:r.t,p:r.p,made:Math.floor(S.day),until:Math.floor(S.day)+10},x);let ok=false;try{ok=WN_T[w.k].ok(w)}catch(e){}if(ok){S.sc.wnCd[r.t]=S.day+3;return}
  S.sc.wn.push(w);const p=pById(r.p);log(`Wniosek w radzie: ${p?p.name:'radny'} (${TEKI[r.t].n.toLowerCase()}): „${w.say}” Zadanie: ${WN_T[w.k].t(w).toLowerCase()}, na 10 dni.`);toast('Wniosek rady: '+WN_T[w.k].t(w))})}
function scWnCheck(){if(!S.sc||!S.sc.wn||!S.sc.wn.length)return;S.sc.wn=S.sc.wn.filter(w=>{const T=WN_T[w.k];let ok=false;try{ok=T&&T.ok(w)}catch(e){}if(!ok)return true;
  S.sc.wnOk=(S.sc.wnOk||0)+1;S.hope=clamp(S.hope+.03,0,1);S.dis=Math.max(0,(S.dis||0)-.03);const p=pById(w.p);if(p)p.mirX=(p.mirX||0)+2;S.sc.wnCd[w.t]=S.day+5;
  log(`Wniosek spełniony: ${T.t(w).toLowerCase()}.${p?' '+p.name+' dziękuje na wiecu.':''}`);toast('Wniosek spełniony: '+T.t(w));return false})}

// ---------- szpital ----------
function scSzpDaily(){if(!hasB('szpital'))return;const P=S.people.filter(p=>p.hp<.75||p.hurt);if(!P.length)return;const zi=Math.min(S.res.ziola||0,P.length*.25*KF),pl=Math.min(S.res.plotno||0,P.length*.04*KF);
 S.res.ziola=(S.res.ziola||0)-zi;S.res.plotno=(S.res.plotno||0)-pl;const f=.5+.5*Math.min(1,zi/Math.max(.01,P.length*.25*KF));P.forEach(p=>{p.hp=Math.min(1,p.hp+.03*K*f)})}

// ---------- cechy rzemieślników (ratusz i cała wyspa) ----------
const CECHY=[
 {k:'ciesle',n:'Cech cieśli',c:'ciesla',kinds:['pracownia','warsztat','bednarnia','szkutnia'],col:0x8a5a2a},
 {k:'murarze',n:'Cech murarzy i zdunów',c:'murarz',kinds:['cegielnia','garncarnia','piec'],col:0x9a4a3a},
 {k:'kowale',n:'Cech kowali',c:'kowal',kinds:['kuznia','dymarka'],col:0x3a3c44},
 {k:'krawcy',n:'Cech krawców i tkaczy',c:'krawiec',kinds:['szwalnia'],col:0x4a5a8a},
 {k:'piekarze',n:'Cech piekarzy i piwowarów',c:'rolnik',kinds:['piekarnia','piekarz','browar','slodownia','zarna','wiatrak','winiarnia'],col:0xb08a3a},
 {k:'rybacy',n:'Bractwo rybackie',c:'rybak',kinds:['pomost','przystan'],col:0x3a6a7a}];
const CECH_COST={deski:12,gwozdzie:12,plotno:3};
function scCechOf(kind){const g=CECHY.find(x=>x.kinds.includes(kind));return g?g.k:null}
const scCechPath=()=>!!(S.e2&&S.tech&&S.tech.e2_cechy);
function scCechReq(g){const lv=scCechPath()?3:4;const m=S.people.some(p=>isAdult(p)&&(p.sk[g.c]||0)>=lv);const cz=S.people.filter(p=>isAdult(p)&&(p.sk[g.c]||0)>=2).length;const ws=S.bld.some(b=>bDone(b)&&g.kinds.includes(b.kind));
 return{m,cz,ws,lv,ok:m&&cz>=3&&ws}}
function scCechOn(){return scSt()>=5&&scFull()}
function scCechFound(k){const g=CECHY.find(x=>x.k===k);if(!g||S.sc.cech[k])return;if(!scCechOn()){toast('Cechy powstają przy ratuszu, gdy w każdej krainie pali się nasz ogień.');return}
 const r=scCechReq(g);if(!r.ok){toast('Cech potrzebuje mistrza, trzech czeladników i warsztatu.');return}const c=scCechPath()?costMul(CECH_COST,.5):CECH_COST;
 if(!canAfford(c)){toast('Brakuje: '+Object.entries(c).filter(([x,v])=>(S.res[x]||0)<v).map(([x,v])=>RN[x].toLowerCase()+' '+Math.ceil(v-(S.res[x]||0))).join(', '));return}
 Object.entries(c).forEach(([x,v])=>S.res[x]-=v);S.sc.cech[k]=Math.floor(S.day)+1;S.hope=clamp(S.hope+.03,0,1);try{pamAdd(2,'cech')}catch(e){}
 const ms=S.people.filter(p=>isAdult(p)&&(p.sk[g.c]||0)>=r.lv).sort((a,b)=>b.sk[g.c]-a.sk[g.c])[0];
 log(`${g.n} założony w ratuszu. ${ms?ms.name+' zostaje starszym cechu i dostaje pieczęć z wyciętym znakiem fachu.':''} Nad warsztatami zawisną znaki cechu.`);toast(g.n);
 S.bld.forEach(b=>{if(g.kinds.includes(b.kind))rebuildMesh(b)});scMiasto();renderSel();renderPanel()}
{const _av=addBldVisuals;addBldVisuals=function(g,b){if(b&&b.kind==='serce'){const pr=b.proj;b.proj=null;try{_av(g,b)}finally{b.proj=pr}return}_av(g,b);
  try{const k=S&&S.sc&&scCechOf(b.kind);if(k&&S.sc.cech[k]){const G=CECHY.find(x=>x.k===k),d=BD[b.kind];const p=new THREE.Group();p.add(cyl(.03,1.5,matDark,0,.75,0,0,0,0,5));
   const fl=new THREE.Mesh(new THREE.PlaneGeometry(.36,.5),M(G.col,{side:THREE.DoubleSide}));fl.position.set(.2,1.22,0);p.add(fl);const st=new THREE.Mesh(new THREE.PlaneGeometry(.1,.5),M(0xe8dcc0,{side:THREE.DoubleSide}));st.position.set(.2,1.22,.003);p.add(st);
   p.position.set(-d.w*.5+.15,0,d.h*.5+.15);g.add(p)}}catch(e){}}}

// ---------- jarmark i prawa miejskie ----------
function scJarmark(){if(scSt()<5)return;const rd=Math.floor(rday()),yr=Math.floor(S.day/YEAR);if(rd!==7||S.seen['jarm'+yr])return;const H=S.hamlets||[];if(H.length<2)return;S.seen['jarm'+yr]=1;
 const got={};H.forEach(h=>{let g=[];try{g=hamGifts(h)||[]}catch(e){}g.forEach(([k,v])=>{const q=Math.round(v*2*(h.road===2?1.3:1));S.res[k]=(S.res[k]||0)+q;got[k]=(got[k]||0)+q});h.wiez=Math.min(1,(h.wiez||.5)+.06)});
 const n=S.people.filter(isAdult).length+H.length*3;const dr=scDrink(n*.4);S.hope=clamp(S.hope+.06,0,1);S.dis=Math.max(0,(S.dis||0)-.04);S.sc.jarN=(S.sc.jarN||0)+1;try{cerSet('jarmark')}catch(e){}try{pamAdd(2,'jarmark')}catch(e){}
 log(`Jarmark na rynku przed ratuszem. Z ${H.length} ${H.length<5?'przysiółków':'przysiółków'} zjeżdżają wozy: ${Object.entries(got).map(([k,v])=>RN[k].toLowerCase()+' '+v).join(', ')||'dary'}.${dr>0?' Beczki pustoszeją do zmroku.':' Szkoda tylko, że nie ma czym wznieść toastu.'}`);toast('Jarmark przed ratuszem');scMiasto()}
function scMiasto(){if(!S.sc||S.sc.miasto||scSt()<5)return;const n=Object.keys(S.sc.cech).length;if(n<4||(S.sc.jarN||0)<1)return;S.sc.miasto=Math.floor(S.day)+1;try{song('Pieśń o mieście na wyspie');pamAdd(6,'miasto')}catch(e){}S.hope=clamp(S.hope+.1,0,1);
 const go=()=>{if(evOpen||placing){gameLater(go,3000);return}const nm=(S.e2&&S.e2.endName)||S.vname||'Przystań';openEvent({ey:'Serce osady',t:'Prawa miejskie',text:()=>`Na rynku przed ratuszem staje cała wyspa: osada, przysiółki, cechy pod swoimi znakami. Najstarszy z rady odczytuje spisane prawa: o targu, o cechach, o radzie wybieranej co roku i o tym, że nikt na wyspie nie jest niczyim panem.\n\n${nm} jest od dziś miastem. Rozbitkowie zostali gospodarzami całej wyspy.`,opts:[{n:'Dalej',d:'',f:()=>'Rozbici na brzegu stali się mieszczanami. Wyspa żyje dalej.'}]},{})};go()}

// ---------- ludzie proszą o napitki, przysiółki też ----------
REQS.piwo={w:2,make:()=>{if(scSt()<3||scNap()>=8||seasonIdx()===2)return null;const p=pickAdult(q=>q.age>25);return p?{pid:p.id}:null},t:(r,p)=>`${p.name} prosi o piwo na wieczór`,
 d:'Zgromadź 10 napitków: piwa, miodu pitnego albo wina. Browar i miodosytnię odblokowuje Dom osadników.',done:()=>scNap()>=10};
NEEDS.piwo=[8,'piwa na wesele'];NEEDS.mpitny=[8,'miodu pitnego na wesele'];
{const _gn=genNeed;genNeed=function(h){try{if(scSt()>=3&&h.zap>=.3&&seasonIdx()!==2&&Math.random()<.18){const k=(S.res.mpitny||0)>(S.res.piwo||0)?'mpitny':'piwo';
   h.need={k,q:NEEDS[k][0],until:S.day+SD};log(`${h.head} z przysiółka ${h.name} przysyła wieść: szykują wesele. Proszą o ${NEEDS[k][0]} ${k==='piwo'?'piwa':'miodu pitnego'}.`);return}}catch(e){}return _gn(h)}}

// ---------- wiatrak i winnica: miejsce ma znaczenie ----------
function scWind(i,j){const h=tileH(i+1,j+1);let s=0,n=0;for(let a=-5;a<=6;a+=2)for(let q=-5;q<=6;q+=2){const x=i+a,y=j+q;if(x<0||y<0||x>=N-1||y>=N-1||!land[y*N+x])continue;s+=tileH(x,y);n++}const pr=h-(n?s/n:h);
 return clamp(.75+pr*.35+Math.min(.35,Math.max(0,h-1.5)*.06),.6,1.6)}
function scSun(i,j,w,h){let nz=0,sz=0;for(let a=0;a<w;a++){nz+=tileH(i+a,j);sz+=tileH(i+a,j+h-1)}const dz=(nz-sz)/w;// spadek ku południu (+z)
 return clamp(1+dz*.55,.55,1.55)}
const scPct=v=>Math.round(v*100)+'%';
const scRing=new THREE.Mesh(new THREE.RingGeometry(.97,1,96),new THREE.MeshBasicMaterial({color:0xf0d49a,transparent:true,opacity:.55,depthWrite:false,toneMapped:false}));scRing.rotation.x=-Math.PI/2;scRing.renderOrder=9;scRing.visible=false;scene.add(scRing);
function scRingShow(){const f=scFire();if(!f)return;const r=scReach();scRing.scale.set(r,r,r);scRing.position.set(f.x,Hy(f.x,f.z)+.45,f.z);scRing.visible=true}
{const _cp2=cancelPlace;cancelPlace=function(){scRing.visible=false;return _cp2()}}
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);try{if(!placing||!ghostTile)return;const el=$('pinfo');if(!el)return;const [gi,gj]=ghostTile;
  if(scInZone(placing,gi,gj)){const ok=el.innerHTML.replace(/<span class="no">Tu nie da się budować[^<]*<\/span>/,'<span class="no">Tu jest plac serca osady: zostaje wolny pod rozbudowę</span>');if(ok!==el.innerHTML)el.innerHTML=ok;return}
  let add='';if(placing==='wiatrak')add=`wiatr na tym wzgórzu: ${scPct(scWind(gi,gj))} (im wyżej ponad okolicą, tym lepiej)`;else if(placing==='winnica')add=`słońce na tym stoku: ${scPct(scSun(gi,gj,3,3))} (najlepiej stok od południa)`;
  else if(BD[placing]&&BD[placing].house&&scSt()){const f=scFire(),d=BD[placing];const x=tcx(gi)+(d.w-1)/2,z=tcx(gj)+(d.h-1)/2,dd=Math.round(Math.hypot(x-f.x,z-f.z));add=dd<=scReach()?`w zasięgu serca osady (${dd} ${krokW(dd)} od ognia): wieczorem przyjdą do wspólnego ognia`:`poza zasięgiem serca osady (${dd} ${krokW(dd)} od ognia, zasięg ${scReach()}): wieczorami rzadziej przyjdą`;scRingShow()}
  if(add&&!el.innerHTML.includes('class="scg"'))el.insertAdjacentHTML('beforeend',`<br><small class="scg">${add}</small>`)}catch(e){}}}
{const _tp=tryPlace;tryPlace=function(){const kind=placing,gt=ghostTile&&ghostTile.slice();const n0=S.bld.length;const r=_tp();try{if(S.bld.length>n0&&gt){const b=S.bld[S.bld.length-1];
   if(kind==='wiatrak'){b.wnd=scWind(b.i,b.j);log(`Wiatrak na tym miejscu: wiatr ${scPct(b.wnd)}.`)}if(kind==='winnica'){b.sun=scSun(b.i,b.j,3,3);log(`Winnica na tym stoku: słońce ${scPct(b.sun)}.`)}
   if(kind==='serce'){b.st=1;scOcc(b);if(!S.seen.serce1){S.seen.serce1=1;log('Ognisko na środku przyszłej osady. Plac wokół zostaje wolny: tu kiedyś stanie dom, w którym zmieści się cała wyspa.')}}}}catch(e){}return r}}

// ---------- modele ----------
const mDirtSc=M(0x6e5c45,{roughness:1}),mThatchB=M(0xb49a5e,{roughness:1}),mIronSc=M(0x2f2d2b,{metalness:.4,roughness:.6}),mPlaster=M(0xe6dfcf,{roughness:.95}),mBrickSc=M(0x9a5a42,{roughness:.95}),mCopper=M(0x9a6038,{metalness:.55,roughness:.45}),mVine=M(0x4e6e34,{roughness:.9}),mGrape=M(0x4a2a4e,{roughness:.6}),mHop=M(0x8aa850,{roughness:.9});
function scBenchLog(g,x,z,a,L){g.add(cyl(.12,L||1.1,matLog2,x,.12,z,0,Math.PI/2-a,Math.PI/2,7))}
function scTripod(g,x,z){for(let k=0;k<3;k++){const a=k/3*6.283;const l=cyl(.022,1.25,matDark,x+Math.cos(a)*.32,.55,z+Math.sin(a)*.32,0,0,0,4);l.rotation.set(Math.sin(a)*.27,0,-Math.cos(a)*.27);g.add(l)}
 g.add(cyl(.17,.2,mIronSc,x,.62,z,0,0,0,10));g.add(cyl(.004,.4,matDark,x,.92,z,0,0,0,3))}
function scStakes(g){for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.035,.5,matLog2,sx*2.38,.25,sz*2.38,0,0,0,5));
 for(const s of[-1,1]){g.add(cyl(.007,4.76,M(0xcfc2a0),s*2.38,.42,0,Math.PI/2,0,0,3));g.add(cyl(.007,4.76,M(0xcfc2a0),0,.42,s*2.38,0,0,Math.PI/2,3))}}
function scDirt(g,x,z,w,d){const m=tbox(w,.03,d,mDirtSc,x,.015,z);m.castShadow=false;g.add(m)}
function scPave(g,x,z,w,d,full){const m=tbox(w,.05,d,mStone,x,.025,z,0,1.7);m.castShadow=false;g.add(m);if(full){g.add(tbox(w+.1,.07,.14,matStone,x,.035,z+d/2),tbox(.14,.07,d,matStone,x-w/2,.035,z),tbox(.14,.07,d,matStone,x+w/2,.035,z))}}
function scBanner(g,x,z,col,h){g.add(cyl(.035,h||2.4,matDark,x,(h||2.4)/2,z,0,0,0,5));const f=new THREE.Mesh(new THREE.PlaneGeometry(.5,.8),M(col,{side:THREE.DoubleSide}));f.position.set(x+.27,(h||2.4)-.5,z);g.add(f);
 const s=new THREE.Mesh(new THREE.PlaneGeometry(.5,.12),M(0xe8dcc0,{side:THREE.DoubleSide}));s.position.set(x+.27,(h||2.4)-.6,z+.004);g.add(s)}
function scPlankBench(g,x,z,ry,L){const b=new THREE.Group();b.add(tbox(L||1.2,.05,.24,mPlank,0,.32,0,0,2),tbox(.06,.3,.2,matDark,-(L||1.2)/2+.12,.15,0),tbox(.06,.3,.2,matDark,(L||1.2)/2-.12,.15,0));b.position.set(x,0,z);b.rotation.y=ry||0;g.add(b)}
function scTable(g,x,z,L){g.add(tbox(L,.06,.55,mPlank,x,.5,z,0,2));for(const s of[-1,1])g.add(tbox(.08,.48,.4,matDark,x+s*(L/2-.2),.24,z));for(const s of[-1,1])scPlankBench(g,x,z+s*.5,0,L-.1)}
function scHall(g,st){// hala stoi z tyłu placu: od z=-2.4 do z=-0.5
 const H=new THREE.Group();H.position.set(0,0,-1.45);g.add(H);
 if(st===3){logHouse(H,4.6,1.9,1.25,{win:true,rh:1.4,roof:mThatch,over:.36,lamp:true});
  const vent=gable(.7,.55,.3,mThatch,.3+1.25+1.4-.12,.06);H.add(vent);H.add(tbox(.62,.32,.04,mPlankD,-1.35,1.08,.98,0,2));
  try{const gr=H.children.find(o=>o.userData&&o.userData.ridge);if(gr)koniki({grp:gr})}catch(e){}return H}
 if(st===4){logHouse(H,4.75,1.95,1.55,{win:true,rh:1.5,roof:mShingle,over:.34,lamp:true,logs:mLogsD});win(H,-.95,.3+1.55*.6,1.0);win(H,.95,.3+1.55*.6,1.0);
  for(const x of[-2.2,-1.1,1.1,2.2]){H.add(cyl(.075,1.62,matLog2,x,.81,1.6,0,0,0,7));H.add(tbox(.2,.12,.2,matLog2,x,1.6,1.6))}
  const pr=tbox(4.95,.06,.78,mShingle,0,1.72,1.3,0,2);pr.rotation.x=.24;H.add(pr);H.add(tbox(4.7,.08,.12,matLog2,0,1.62,1.62));
  try{const gr=H.children.find(o=>o.userData&&o.userData.ridge);if(gr)koniki({grp:gr})}catch(e){}return H}
 // ratusz: murowany parter, piętro z ryglowym szkieletem, dach kalenicą wzdłuż rynku i wieża
 H.add(tbox(4.95,.3,2.1,mStone,0,.15,0,0,.9));H.add(tbox(4.8,1.3,2.0,mBrickSc,0,.3+.65,0,0,1.2));
 for(const x of[-1.7,0,1.7]){H.add(tbox(.74,.95,.08,matDark,x,.3+.48,1.0));const ar=new THREE.Mesh(new THREE.CircleGeometry(.37,10,0,Math.PI),matDark);ar.position.set(x,.3+.95,1.01);H.add(ar)}
 door(H,0,1.06,0,.5,.82);
 H.add(tbox(4.95,1.05,2.12,mPlaster,0,1.6+.52,0,0,1));
 for(const x of[-2.4,-1.2,0,1.2,2.4])H.add(tbox(.1,1.05,.04,matDark,x,1.6+.52,1.07));H.add(tbox(4.95,.08,.05,matDark,0,1.62,1.07),tbox(4.95,.08,.05,matDark,0,2.62,1.07));
 for(const x of[-1.8,-.6,.6,1.8]){H.add(tbox(.07,.9,.04,matDark,x-.3,2.12,1.075).rotateZ(.62));win(H,x,2.15,1.07)}
 const rf=gable(2.12,4.95,1.25,mShingle,2.66,.3);rf.rotation.y=Math.PI/2;H.add(rf);
 const T=new THREE.Group();T.position.set(0,0,-.15);H.add(T);
 T.add(tbox(1.15,2.6,1.15,mPlaster,0,3.2+1.3-.3,0,0,1));for(const sx of[-1,1])for(const sz of[-1,1])T.add(tbox(.09,2.6,.09,matDark,sx*.55,4.2,sz*.55));
 for(const sx of[-1,1])for(const sz of[-1,1])T.add(tbox(.1,.75,.1,matLog2,sx*.5,5.9,sz*.5));T.add(tbox(1.2,.08,1.2,matLog2,0,5.5,0),tbox(1.25,.08,1.25,matLog2,0,6.3,0));
 const bell=new THREE.Mesh(new THREE.CylinderGeometry(.13,.24,.32,10,1,true),M(0x8a6a38,{metalness:.6,roughness:.4,side:THREE.DoubleSide}));bell.position.set(0,5.95,0);T.add(bell);T.add(cyl(.02,.2,matDark,0,6.15,0,0,0,0,4));
 const sp=new THREE.Mesh(new THREE.ConeGeometry(.98,1.7,4),mShingle);sp.rotation.y=Math.PI/4;sp.position.y=6.34+.85;sp.castShadow=true;T.add(sp);T.add(cyl(.025,.5,matDark,0,8.25,0,0,0,0,4));T.add(mesh(new THREE.SphereGeometry(.08,8,6),M(0xb89a50,{metalness:.6,roughness:.4}),0,8.48,0));
 win(T,0,4.6,.58);win(T,0,3.7,.58);return H}
function scBuild(g,b){const st=b?(b.st||1):1;const pr=b&&b.proj&&b.proj.t==='serce'?b.proj:null;const pk=pr?Math.min(1,pr.prog/Math.max(1,pr.work)):0;
 if(st<=2){scDirt(g,0,.3,4.6,4.2);if(st===1)scStakes(g)}
 else if(st===3)scDirt(g,0,1.15,4.9,2.6);
 else{scPave(g,0,1.15,4.9,2.6,st>=5)}
 const fz=st>=3?1.4:.5;makeFire(g,0,0,fz);
 if(st===1){for(let k=0;k<4;k++){const a=k/4*6.283+.4;scBenchLog(g,Math.cos(a)*1.25,fz+Math.sin(a)*1.25,a)}scTripod(g,.0,fz);woodpile(g,-1.75,-1.55,10,.3);sack(g,1.6,-1.5);sack(g,1.85,-1.3,.8);barrel(g,1.4,-1.75)}
 if(st===2){const cz=.6;for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.075,1.6,matLog2,sx*1.45,.8,cz+sz*1.15,0,0,0,7));
  const rf=gable(2.5,3.1,1.0,mThatch,1.58,.34);rf.rotation.y=Math.PI/2;rf.position.z=cz;g.add(rf);
  for(const sz of[-1,1])g.add(tbox(3.0,.08,.1,matLog2,0,1.55,cz+sz*1.15));
  g.add(cyl(.006,1.0,matDark,0,2.08,fz,0,0,0,3));g.add(cyl(.16,.2,mIronSc,0,1.05,fz,0,0,0,10));
  scTable(g,0,-.65,2.2);scTable(g,0,1.85,2.2);woodpile(g,-2.0,-1.6,12,.2);barrel(g,1.95,-1.7);barrel(g,2.15,-1.35,.85);scStakes(g)}
 if(st>=3){const H=scHall(g,st);
  for(let k=0;k<3;k++){const a=Math.PI*(.18+k*.32);scBenchLog(g,Math.cos(a)*1.05,fz+Math.sin(a)*1.05,a,1.0)}
  if(st===3){woodpile(g,2.25,-.2,12,Math.PI/2);barrel(g,-2.2,-.1);sack(g,-2.05,.25)}
  if(st===4){scBanner(g,-2.25,2.15,0x8a3a2a);scBanner(g,2.05,2.15,0x4a6a8a);scPlankBench(g,-1.5,.35,0,1.0);scPlankBench(g,1.5,.35,0,1.0);barrel(g,2.25,-.05)}
  if(st>=5){scBanner(g,-2.3,.15,0x8a3a2a,2.8);scBanner(g,2.1,.15,0x4a6a8a,2.8);
   const w=new THREE.Group();w.position.set(1.75,0,1.75);w.add(cyl(.34,.5,mStone,0,.25,0,0,0,0,12),cyl(.27,.06,M(0x2a3a3c,{roughness:.2}),0,.47,0,0,0,0,12));for(const s of[-1,1])w.add(cyl(.04,1.1,matLog2,s*.32,.75,0,0,0,0,5));const wr=gable(.5,.8,.25,mShingle,1.25,.06);wr.rotation.y=Math.PI/2;w.add(wr);g.add(w);
   const k=new THREE.Group();k.position.set(-1.7,0,1.85);for(const sx of[-1,1])for(const sz of[-1,1])k.add(cyl(.03,1.1,matDark,sx*.45,.55,sz*.3,0,0,0,4));const aw=tbox(1.05,.04,.75,M(0xa8462e),0,1.12,0,0,2);aw.rotation.x=.16;k.add(aw);k.add(tbox(.9,.06,.5,mPlank,0,.6,0,0,2));
   for(let q=0;q<3;q++)k.add(mesh(new THREE.SphereGeometry(.07,6,4),M([0xc8463c,0xe0c050,0x6a9a50][q]),-.25+q*.25,.68,0));g.add(k)}}
 // rozbudowa: widać, co rośnie
 if(pr){const to=pr.id,pq=Math.max(.15,pk);
  if(to===2){for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.07,1.6*pq,matLog2,sx*1.45,.8*pq,.6+sz*1.15,0,0,0,7));for(let q=0;q<5;q++)g.add(cyl(.12,.7,mThatchB,1.7+(q%2)*.25,.12+((q/2)|0)*.2,-1.5,0,0,Math.PI/2,7))}
  else if(to===3){const W=4.6,D=1.9;g.add(tbox(W,1.25*pq,D,mLogs,0,.3+.62*pq,-1.45,0,1.1));g.add(tbox(W+.14,.3,D+.14,mStone,0,.15,-1.45,0,.9));
   for(const sx of[-1,0,1])for(const sz of[-1,1])g.add(cyl(.06,2.2,matLog2,sx*2.4,1.1,-1.45+sz*1.05,0,0,0,5));woodpile(g,2.2,1.9,15,0)}
  else{const top=to===5?3.4+3.6*pq:2.4+1.4*pq;for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.05,top,matLog2,sx*2.55,top/2,-1.45+sz*1.15,0,0,0,5));
   for(const y of[.9,1.8,2.7].filter(y=>y<top))for(const sz of[-1,1])g.add(tbox(5.2,.05,.25,mPlank,0,y,-1.45+sz*1.2,0,2));
   if(to===5){const t=3.6*pq;for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.05,t+2.6,matLog2,sx*.7,(t+2.6)/2,-1.6+sz*.7,0,0,0,5))}
   for(let q=0;q<6;q++)g.add(tbox(.34,.22,.26,to===5&&q%2?mBrickSc:matStone,1.4+(q%3)*.36,.11+((q/3)|0)*.22,2.0,q*.3))}}}
{const _nm=newModel;newModel=function(kind,g){
  if(kind==='serce'){const st0=STY;STY=null;try{const b=g.userData.scB;scBuild(g,b||null)}finally{STY=st0}return 1}
  if(kind==='bednarnia'){plankHut(g,1.5,1.25,.95,{win:true,lamp:true});for(let q=0;q<3;q++)g.add(cyl(.17,.42,mPlank,-1.05,.21,-.4+q*.4,0,0,Math.PI/2,10));g.add(cyl(.17,.42,mPlank,-1.05,.52,-.2,0,0,Math.PI/2,10));
   barrel(g,1.05,.55);barrel(g,1.1,.15,.9);const hp=new THREE.Mesh(new THREE.TorusGeometry(.2,.02,4,12),matDark);hp.position.set(.95,.3,.95);hp.rotation.x=Math.PI/2;g.add(hp);g.add(cyl(.12,.03,matStone,.55,.02,.95,0,0,0,8));return 1}
  if(kind==='slodownia'){logHouse(g,1.5,1.3,1.0,{chim:.45,win:false,rh:.8});for(let q=0;q<3;q++)sack(g,-1.05,-.35+q*.35);g.add(cyl(.26,.4,mPlank,1.05,.2,.55,0,0,0,10));g.add(cyl(.24,.02,M(0xc8a860),1.05,.39,.55,0,0,0,10));return 1}
  if(kind==='chmielnik'){g.add(tbox(1.85,.04,1.85,M(0x4a3524),0,.02,0));for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=-.6+c*.6,z=-.6+r*.6;g.add(cyl(.025,2.2,matDark,x,1.1,z,0,0,0,4));
    const v=new THREE.Mesh(new THREE.ConeGeometry(.16,1.6,6),mHop);v.position.set(x,1.0,z);v.rotation.x=Math.PI;g.add(v);for(let k=0;k<3;k++)g.add(mesh(new THREE.SphereGeometry(.05,5,4),M(0xb8c870),x+Math.cos(k*2)*.12,.6+k*.35,z+Math.sin(k*2)*.12))}
   g.add(cyl(.006,1.3,M(0xcfc2a0),0,2.15,-.6,0,0,Math.PI/2,3),cyl(.006,1.3,M(0xcfc2a0),0,2.15,0,0,0,Math.PI/2,3),cyl(.006,1.3,M(0xcfc2a0),0,2.15,.6,0,0,Math.PI/2,3));g.add(cyl(.18,.22,mWattle,1.05,.11,1.0,0,0,0,9));return 1}
  if(kind==='browar'){logHouse(g,2.3,1.5,1.15,{chim:.75,win:true,rh:1.0});const sh=new THREE.Group();sh.position.set(-1.45,0,.3);sh.add(tbox(.06,1.0,.06,matDark,-.3,.5,-.45),tbox(.06,1.0,.06,matDark,-.3,.5,.45));const r=tbox(.8,.05,1.1,mBoards,0,1.0,0,0,2);r.rotation.z=.3;sh.add(r);
   sh.add(cyl(.3,.38,mCopper,.05,.42,0,0,0,0,12));sh.add(cyl(.32,.22,mStone,.05,.11,0,0,0,0,10));g.add(sh);for(let q=0;q<3;q++)barrel(g,1.4,-.4+q*.38,.9);barrel(g,1.4,-.21,.85);g.children[g.children.length-3].position.y+=.36;return 1}
  if(kind==='miodosytnia'){plankHut(g,1.5,1.25,.95,{win:true,lamp:true});barrel(g,1.05,.45);barrel(g,1.05,.05,.9);for(let q=0;q<3;q++){const p=mesh(new THREE.SphereGeometry(.12,8,6),mPot,-1.05,.12,-.35+q*.33);p.scale.y=1.2;g.add(p)}g.add(cyl(.2,.25,mCopper,.45,.12,1.0,0,0,0,10));return 1}
  if(kind==='piekarz'){logHouse(g,2.2,1.5,1.1,{win:true,rh:1.0,roof:mShingle});const ov=new THREE.Group();ov.position.set(-1.55,0,.15);ov.add(tbox(.9,.35,.9,mStone,0,.17,0,0,1));const d=mesh(new THREE.SphereGeometry(.45,12,8,0,6.283,0,Math.PI/2),mClay,0,.35,0);d.scale.set(1,.8,1);ov.add(d);
   ov.add(tbox(.18,.5,.18,mClay,0,.85,-.25));ov.add(tbox(.24,.18,.05,matDark,0,.45,.44));g.add(ov);woodpile(g,1.45,-.3,10,Math.PI/2);g.add(tbox(.8,.06,.3,mPlank,.6,.55,1.0),tbox(.06,.55,.2,matDark,.25,.27,1.0),tbox(.06,.55,.2,matDark,.95,.27,1.0));
   for(let q=0;q<4;q++)g.add(mesh(new THREE.SphereGeometry(.07,7,5),M(0xb0783a),.35+q*.17,.62,1.0));return 1}
  if(kind==='winnica'){g.add(tbox(2.85,.04,2.85,M(0x5a4430),0,.02,0));for(let r=0;r<4;r++){const z=-1.1+r*.73;for(let c=0;c<5;c++){const x=-1.15+c*.58;g.add(cyl(.02,.9,matDark,x,.45,z,0,0,0,4));const v=tbox(.5,.32,.18,mVine,x+.29,.6,z,0,1);v.castShadow=true;g.add(v);
     if((r+c)%2===0)g.add(mesh(new THREE.SphereGeometry(.06,5,4),mGrape,x+.2,.42,z+.1))}g.add(cyl(.005,2.4,M(0xcfc2a0),0,.78,z,0,0,Math.PI/2,3))}
   g.add(cyl(.2,.26,mWattle,1.3,.13,1.35,0,0,0,9));return 1}
  if(kind==='winiarnia'){g.add(tbox(1.7,.25,1.4,mStone,0,.12,0,0,.9));g.add(tbox(1.55,.95,1.25,mStone,0,.25+.47,0,0,1.4));g.add(gable(1.55,1.25,.75,mShingle,1.2,.25));door(g,0,.66,0,.48,.74);
   for(let q=0;q<2;q++)barrel(g,-1.05,-.2+q*.42);const pr=new THREE.Group();pr.position.set(1.1,0,.45);pr.add(cyl(.25,.3,mPlank,0,.15,0,0,0,0,10),cyl(.04,.9,matDark,0,.6,0,0,0,0,6),tbox(.7,.07,.07,matDark,0,.95,0));g.add(pr);return 1}
  if(kind==='wiatrak'){const tr=new THREE.Group();g.add(tr);for(const a of[0,Math.PI/2]){const b=tbox(1.6,.12,.12,matLog2,0,.2,0,a,1);tr.add(b)}for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;const s=cyl(.04,1.1,matLog2,Math.cos(a)*.38,.62,Math.sin(a)*.38,0,0,0,5);s.rotation.set(Math.sin(a)*.6,0,-Math.cos(a)*.6);tr.add(s)}
   tr.add(cyl(.11,1.2,matLog2,0,.75,0,0,0,0,8));const body=new THREE.Group();body.position.y=1.3;g.add(body);body.add(tbox(1.0,1.25,1.15,mBoards,0,.62,0,0,1.6));const rf=gable(1.0,1.15,.55,mShingle,1.25,.1);body.add(rf);
   body.add(tbox(.36,.05,.9,mPlank,0,-.03,.85,0,2));door(body,0,.58,0,.36,.6);g.add(cyl(.04,1.9,matLog2,0,.95,-1.05,-.7,0,0,5));
   const sl=new THREE.Group();sl.position.set(0,2.05,.66);body.parent.add(sl);sl.add(cyl(.08,.22,matDark,0,0,0,Math.PI/2,0,0,8));
   for(let k=0;k<4;k++){const arm=new THREE.Group();arm.rotation.z=k*Math.PI/2+.3;arm.add(tbox(.07,1.75,.05,matLog2,0,.9,0));arm.add(tbox(.36,1.25,.02,mCanvas,.2,1.1,.02));for(let q=0;q<5;q++)arm.add(tbox(.36,.025,.03,matDark,.2,.55+q*.27,.035));sl.add(arm)}
   g.userData.sails=sl;return 1}
  if(kind==='szpital'){plankHut(g,2.5,1.5,1.05,{win:true,lamp:true,roof:mShingle});g.traverse(o=>{if(o.isMesh&&(o.material===mPlank||o.material===mPlankG))o.material=mPlankW});win(g,-.65,.16+1.05*.6,.79);win(g,.25,.16+1.05*.6,.79);
   garden(g,-.6,1.25,1.4,.55);rack(g,1.6,.3,Math.PI/2,r=>{for(let k=0;k<4;k++){const b=new THREE.Mesh(new THREE.ConeGeometry(.07,.22,5),M(k%2?0x7a6a9a:0x7a9a50));b.position.set(0,.66,-.27+k*.18);b.rotation.x=Math.PI;r.add(b)}});
   g.add(tbox(.9,.12,.38,mCanvas,.9,.22,1.15),tbox(.06,.22,.3,matDark,.5,.11,1.15),tbox(.06,.22,.3,matDark,1.3,.11,1.15));g.add(cyl(.16,.2,mIronSc,1.6,.1,-.5,0,0,0,10));return 1}
  return _nm(kind,g)}}
{const _mb=makeBuildingModel;makeBuildingModel=function(kind,bb){if(kind!=='serce')return _mb(kind,bb);const g=new THREE.Group();VR=rng(bb?bb.id*7919+13:7);g.userData.scB=bb||null;const st0=STY;STY=null;try{scBuild(g,bb||null)}finally{STY=st0}if(bb)addBldVisuals(g,bb);delete g.userData.scB;return g}}
{const _ac=addCharacter;addCharacter=function(g,kind){if(kind==='serce'||kind==='wiatrak'||kind==='winnica'||kind==='chmielnik')return;return _ac(g,kind)}}
// zniszczony model: ogień z serca nie może zostać w tablicy płomieni
{const _rm=rebuildMesh;rebuildMesh=function(b){const old=bMesh[b.id];if(old&&b.kind==='serce'){for(let k=fires.length-1;k>=0;k--){let o=fires[k].g;while(o&&o!==old)o=o.parent;if(o)fires.splice(k,1)}}return _rm(b)}}
// skrzydła wiatraka kręcą się, gdy mielą
let scAnimT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S||!S.speed)return;const sp=(.6+1.6*(WX.wind||.3))*rdt*Math.min(4,S.speed);for(const b of S.bld){if(b.kind!=='wiatrak'||!bDone(b))continue;const m=bMesh[b.id];const sl=m&&m.userData.sails;if(!sl)continue;
   const on=S.people.some(p=>p.wb===b.id&&p.state==='work');sl.rotation.z-=sp*(on?1:.15)*(b.wnd||1)}}}

// ---------- karty ----------
let scShowRoad=false,scShowFx=false;
function scRow(ic,txt,ok,pr,how,bk){const can=bk&&BD[bk]&&bAvail(bk)&&!ok;
 return`<div class="scr${ok?' ok':''}"><span class="sci">${ok?'<b>✓</b>':ico(ic)}</span><div><b>${txt}</b>${!ok&&pr?`<small>${pr}</small>`:''}${!ok&&how?`<small class="mut">${how}</small>`:''}</div>${can?`<button data-scput="${bk}">${S.bld.some(b=>b.kind===bk)&&!['szalas','chata','dom','studnia'].includes(bk)?'Jeszcze':'Postaw'}</button>`:''}</div>`}
function scBalHTML(){return`<div class="scbal"><b>Filary:</b>${FILK.map(f=>{let n=0;for(let s=2;s<=5;s++)if(S.sc.done[scPkgKey(s,f)])n++;return`<span title="${FIL[f][0]}">${ico(FIL[f][1])}<i>${'●'.repeat(n)}${'○'.repeat(4-n)}</i></span>`}).join('')}</div>`}
function scSteps(st){return`<div class="scst">${[1,2,3,4,5].map(k=>`<span class="${k<st?'p':k===st?'on':''}">${SERCE[k].kr}</span>`).join('<i>›</i>')}</div>`}
function scCardHTML(b){const st=b.st||1;let h=scSteps(st);const k=scPkg();
 if(b.proj&&b.proj.t==='serce'){const pc=Math.round(100*b.proj.prog/b.proj.work);h+=`<p><b>Rozbudowa: ${SERCE[b.proj.id].n}</b> · ${pc}% · przy pracy: ${b.workers||0}</p><div class="pbar"><div style="width:${pc}%"></div></div><p class="mut">Budują wolni robotnicy. Serce działa dalej, jak dotąd.</p>`}
 else if(k){const P=k.P;const n=FILK.filter(f=>scTaskOk(k.to,f)).length;const so=scSizeOk(k.to);
  h+=`<h5 class="sch">Do etapu ${SERCE[k.to].n}: ${P.n} · ${n} z 6</h5><p class="mut">${P.intro}</p>`;
  if(P.size){let sp='';try{sp=P.size[2]()}catch(e){}h+=scRow('osada',P.size[0],so,sp,'Wielkość osady liczy się na bieżąco: domy i ludzie mieszkający w osadzie.',null)}
  FILK.forEach(f=>{const T=P.t[f];const ok=scTaskOk(k.to,f);let pr='';if(!ok)try{pr=T[2]()}catch(e){}h+=scRow(FIL[f][1],`${FIL[f][0]}: ${T[0]}`,ok,pr,T[3],T[4])});
  const c=SERCE[k.to].cost,rd=scReady();const bl=n<6?`Brakuje zadań: ${6-n}`:'Osada jeszcze za mała';
  h+=`<div class="scup"><button class="${rd&&canAfford(c)?'pri':''}" data-scup="1"${rd?'':' disabled'}>${rd?'Rozbuduj: '+SERCE[k.to].n:bl}</button><span class="cost">${costHave(c)} · ${SERCE[k.to].work} osobodni</span></div>`;
  const ul=SC_OPEN_N(k.to).concat(SC_INST[k.to]||[]);if(ul.length)h+=`<p class="mut">Odblokuje: ${ul.join(', ')}.</p>`}
 else h+=`<p class="mut">Serce osady osiągnęło ostatni etap.</p>`;
 h+=scBalHTML();
 h+=`<button class="scbt" data-scfx="1">${scShowFx?'▾':'▸'} Co daje teraz</button>`;if(scShowFx)h+=`<ul class="scl">${SERCE.slice(1,st+1).flatMap(s=>s.fx).map(x=>`<li>${x}</li>`).join('')}<li>Zasięg: ${scReach()} ${krokW(scReach())}. ${S.sc.evShare!==undefined?`Wczoraj wieczorem ${SERCE[st].loc} siedziało ${Math.round(S.sc.evShare*100)}% osady.`:''}</li></ul>`;
 if(st>=4)h+=scRadaHTML();
 if(st>=5)h+=scCechHTML();
 h+=`<button class="scbt" data-scroad="1">${scShowRoad?'▾':'▸'} Droga rozwoju: od ogniska do ratusza</button>`;
 if(scShowRoad)h+=`<div class="scroad">${[1,2,3,4,5].map(s=>{const u=SC_OPEN_N(s).concat(SC_INST[s]||[]);return`<div class="${s<=st?'ok':''}"><b>${s<=st?'✓ ':''}${s}. ${SERCE[s].n}</b>${s>1?`<small>pakiet: ${SPK[s].n}${SPK[s].size?' · '+SPK[s].size[0].split(':')[0].toLowerCase():''}</small>`:'<small>od pierwszego dnia</small>'}${u.length?`<small>otwiera: ${u.join(', ')}</small>`:''}</div>`}).join('')}</div>`;
 return h}
function scRadaHTML(){const R=S.sc.rada||[];const ch=S.sc.radaSk!==seasonKey()||S.day<=2;let h=`<h5 class="sch">Rada osady · ${R.length} ${R.length<5?'radnych':'radnych'}</h5><p class="mut">Każdy radny ma tekę: wzmacnia swoją dziedzinę i zgłasza wnioski. ${ch?'Jedną tekę można teraz zmienić (raz na porę roku).':'Teki zmieniono w tej porze roku; następna zmiana na kolejnym wiecu.'}</p>`;
 R.forEach((r,i)=>{const p=r.p!==null?pById(r.p):null;const q=p?radFit(p,r.t):0;const w=S.sc.wn.find(x=>x.t===r.t);
  h+=`<div class="scr rad"><span class="sci">${ico(FIL[r.t][1])}</span><div><b>${TEKI[r.t].n}${p?`: ${p.name}`:': miejsce puste'}</b><small>${p?radWord(p,q)+' · ':''}${TEKI[r.t].fx}</small>${w?`<small class="scw">Wniosek: ${WN_T[w.k].t(w)} · ${WN_T[w.k].p(w)} · zostało ${Math.max(0,Math.ceil(w.until-S.day))} ${dniW(Math.max(0,Math.ceil(w.until-S.day)))}</small>`:''}</div>${ch?`<select data-scteka="${i}">${TEKK.map(t=>`<option value="${t}"${t===r.t?' selected':''}${t!==r.t&&R.some(x=>x.t===t)?' disabled':''}>${TEKI[t].n}</option>`).join('')}</select>`:''}</div>`});
 return h+`<p class="mut">Spełnione wnioski: ${S.sc.wnOk||0}.</p>`}
function scCechHTML(){const on=scCechOn();let h=`<h5 class="sch">Cechy rzemieślników</h5><p class="mut">${on?'Cała wyspa jest nasza: rzemieślnicy mogą zakładać cechy. Cech przyspiesza swoje warsztaty o 15% i uczy fachu szybciej.':`Cechy powstają, gdy w każdej krainie pali się nasz ogień: zasiedlone krainy ${e3Settled()} z ${scRegNeed()}.`}</p>`;
 CECHY.forEach(g=>{const f=S.sc.cech[g.k];const r=scCechReq(g);
  h+=`<div class="scr${f?' ok':''}"><span class="sci">${f?'<b>✓</b>':ico('narz')}</span><div><b>${g.n}</b><small>${f?'założony w roku '+(Math.floor((f-1)/YEAR)+1):`mistrz (poziom ${r.lv}) ${r.m?'✓':'✗'} · czeladnicy ${Math.min(3,r.cz)} z 3 · warsztat ${r.ws?'✓':'✗'}`}</small></div>${!f&&on&&r.ok?`<button data-sccech="${g.k}">Załóż</button>`:''}</div>`});
 h+=`<p class="mut">Założenie cechu: ${costHTML(scCechPath()?costMul(CECH_COST,.5):CECH_COST)}. Jarmarki: ${S.sc.jarN||0}.${S.sc.miasto?' Przystań ma prawa miejskie.':' Cztery cechy i jarmark dadzą osadzie prawa miejskie.'}</p>`;return h}
{const _bp=bldPanelHTML;bldPanelHTML=function(b){if(!b||b.kind!=='serce'||!S)return _bp(b);const pr=b.proj;b.proj=null;let h='';try{h=_bp(b)}finally{b.proj=pr}if(!bDone(b))return h;if(!S.sc)scInit();return scCardHTML(b)+h}}
// chata zielarki: rozbudowa w szpital czeka na Dom rady, a nie na „wiedzę”
{const _rs=renderSel;renderSel=function(){_rs();try{if(selB===null||!S)return;const b=bById(selB);if(!b||b.kind!=='izbachorych'||bAvail('szpital'))return;const el=$('sel');const t='Rozbudowa w szpital: najpierw wiedza.';if(el.innerHTML.includes(t))el.innerHTML=el.innerHTML.replace(t,'Rozbudowa w szpital: najpierw serce osady musi urosnąć do Domu rady.')}catch(e){}}}
// karta w zakładce Ludzie (osada): serce na wierzchu
function scOsadaHTML(){if(!S||!S.sc)return'';const b=scB();
 if(!b)return`<div class="card scc"><h4>${ico('serce')} Serce osady</h4><p>Osada nie ma jeszcze swojego serca. Postaw ognisko tam, gdzie ma być środek osady: tu ludzie będą jeść, siadać wieczorem i świętować. Ognisko urośnie w wiatę, Dom osadników, Dom rady i ratusz.</p><button class="pri" data-scput="serce">Postaw ognisko</button> <span class="cost">${costHTML(SERCE[1].cost)}</span></div>`;
 if(!bDone(b))return`<div class="card scc"><h4>${ico('serce')} Serce osady</h4><p>Ognisko jest w budowie: ${Math.round(100*b.prog/b.work)}%.</p></div>`;
 const st=b.st||1,k=scPkg();const n=k?FILK.filter(f=>scTaskOk(k.to,f)).length:6;
 return`<div class="card scc"><h4>${ico('serce')} Serce osady: ${SERCE[st].n}</h4>${scSteps(st)}<p>${b.proj?`Trwa rozbudowa: ${SERCE[b.proj.id].n.toLowerCase()}, ${Math.round(100*b.proj.prog/b.proj.work)}%.`:k?`Do etapu ${SERCE[k.to].n}: ${n} z 6 zadań${k.P.size?(scSizeOk(k.to)?', osada dość duża':', osada jeszcze za mała'):''}.${scReady()?' <b>Można rozbudować.</b>':''}`:'Ostatni etap.'}</p>${scBalHTML()}<button data-scshow="1">Pokaż serce osady</button></div>`}
{const _th=troubleHTML;troubleHTML=function(){let h='';try{h=scOsadaHTML()}catch(e){}return h+_th()}}
function scShow(){const b=scB();if(!b)return;closeSheet();const c=bCenter(b);lookAt(c.x,c.z,Math.max(zoomT,1.5));selectB(b.id)}
// pigułka na cichej wyspie
{const l=$('cz-l');if(l&&!$('cz-sc')){l.insertAdjacentHTML('beforeend','<button id="cz-sc" type="button" aria-label="Serce osady"></button>');$('cz-sc').addEventListener('click',e=>{e.stopPropagation();if(!S)return;if(scB())scShow();else openSheet('osada')})}}
function scPill(){const el=$('cz-sc');if(!el||!S||!S.sc)return;const b=scB();let h;
 if(!b)h=`${ico('serce')}<b>Postaw ognisko</b>`;else if(!bDone(b))h=`${ico('serce')}<b>${Math.round(100*b.prog/b.work)}%</b>`;
 else{const k=scPkg();if(b.proj)h=`${ico('serce')}<b>${Math.round(100*b.proj.prog/b.proj.work)}%</b>`;else if(!k)h=`${ico('serce')}<b>${SERCE[b.st||1].kr}</b>`;else{const n=FILK.filter(f=>scTaskOk(k.to,f)).length;h=`${ico('serce')}<b>${n}/6</b>${scReady()?'<i class="up">↑</i>':''}`}}
 el.classList.toggle('rdy',!!(b&&scReady()&&!b.proj));setH(el,h)}
{const _rt=renderTop;renderTop=function(){_rt();try{scPill()}catch(e){}}}
// przycisk „dom” na cichej wyspie i kamera na start: do serca, jeśli stoi
{const hm=$('cz-home');if(hm)hm.addEventListener('click',e=>{const b=scB();if(S&&b&&bDone(b)){e.stopImmediatePropagation();const f=scFire();lookAt(f.x,f.z,Math.max(zoomT,1.4))}},true)}
// budowa: ognisko jest jedno; zablokowane budynki mówią, który etap serca je odblokuje
{const _rp=renderPanel;renderPanel=function(){_rp();try{if(tab!=='budowa'||!S)return;const sh=$('sheet');if(!sh)return;
  const bt=sh.querySelector('button[data-b="serce"]');if(bt&&!scB()){const cd=bt.closest('.card');if(cd&&cd.parentNode){const first=cd.parentNode.querySelector('.card.bk');if(first&&first!==cd)cd.parentNode.insertBefore(cd,first)}}
  if(bt&&scB()){bt.removeAttribute('data-b');bt.dataset.scshow='1';bt.textContent='Pokaż serce osady';bt.disabled=false;bt.classList.add('pri')}
  sh.querySelectorAll('.unkc p').forEach(p=>{const nm=p.querySelector('b');const sp=p.querySelector('span');if(!nm||!sp)return;const k=SC_NEW.find(x=>BD[x].n===nm.textContent);if(k&&BD[k].need){const s=+BD[k].need.slice(2);sp.textContent=`serce osady: ${SERCE[s].n}`}})}catch(e){}}}
// propozycja na cichej wyspie: gdy nie ma serca, ognisko jest na liście pierwsze
{const _cs=czSuggest;czSuggest=function(i,j){const L=_cs(i,j);try{const x=L.find(o=>o.k==='serce');if(x){x.sc+=60;x.why='serce osady: tu ludzie będą jeść i świętować';L.sort((a,b)=>b.sc-a.sc)}}catch(e){}return L}}
document.addEventListener('click',ev=>{if(!S)return;const t=ev.target.closest('[data-scup],[data-scput],[data-scshow],[data-scroad],[data-scfx],[data-sccech]');if(!t)return;ev.stopPropagation();ev.preventDefault();
 if(t.dataset.scup)scUp();else if(t.dataset.scput){const k=t.dataset.scput;if(k==='serce'&&scB()){scShow();return}if(!bAvail(k)){toast('Jeszcze nie umiecie tego zbudować.');return}if(!canAfford(BD[k].cost)){toast('Brakuje: '+Object.entries(BD[k].cost).filter(([r,v])=>(S.res[r]||0)<v).map(([r,v])=>RN[r].toLowerCase()+' '+Math.ceil(v-(S.res[r]||0))).join(', '));return}select(null);startPlace(k);return}
 else if(t.dataset.scshow)scShow();else if(t.dataset.scroad)scShowRoad=!scShowRoad;else if(t.dataset.scfx)scShowFx=!scShowFx;else if(t.dataset.sccech)scCechFound(t.dataset.sccech);
 const el=$('sel');if(el)el._h=null;renderSel()},true);
document.addEventListener('change',ev=>{const t=ev.target.closest('[data-scteka]');if(!t||!S)return;scTekaSet(+t.dataset.scteka,t.value);const el=$('sel');if(el)el._h=null;renderSel()},true);
{const st=document.createElement('style');st.textContent=`
.scst{display:flex;flex-wrap:wrap;align-items:center;gap:3px 4px;margin:2px 0 8px;font:600 12px var(--sans);color:#a8a290}
.scst span{padding:2px 7px;border-radius:10px;border:1px solid #c9a66b33}.scst span.p{color:#a8d090;border-color:#a8d09055}.scst span.on{color:#141b18;background:var(--gold,#c9a66b);border-color:transparent}.scst i{font-style:normal;opacity:.5}
.sch{margin:10px 0 2px;font:600 15px var(--serif);color:var(--hi)}
.scr{display:flex;align-items:flex-start;gap:9px;padding:6px 0;border-top:1px solid #ffffff12}.scr .sci{flex:none;width:22px;height:22px;display:flex;align-items:center;justify-content:center;color:var(--gold,#c9a66b)}.scr .sci svg{width:20px;height:20px}
.scr>div{flex:1;min-width:0}.scr b{display:block;font-weight:600;font-size:14px;line-height:1.3}.scr small{display:block;font-size:12.5px;line-height:1.35;color:#d8d2bf}.scr small.mut{color:#a8a290}.scr.ok b{color:#a8d090}.scr.ok .sci b{color:#a8d090;font-size:16px}
.scr button{flex:none;min-height:34px;padding:0 10px}.scr select{flex:none;max-width:46%;min-height:34px}.scr small.scw{color:#f0d49a}
.scup{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin:8px 0 4px}.scup button{min-height:40px}
.scbal{display:flex;flex-wrap:wrap;gap:4px 12px;margin:8px 0 4px;font-size:12px;color:#c9c3ad}.scbal span{display:inline-flex;align-items:center;gap:3px}.scbal svg{width:15px;height:15px;color:var(--gold,#c9a66b)}.scbal i{font-style:normal;letter-spacing:1px;color:#a8d090}.scbal b{font-weight:600;color:#c9c3ad}
.scbt{display:block;width:100%;text-align:left;margin-top:8px;background:transparent;border:1px solid #c9a66b33}
.scl{margin:6px 0 0 18px;padding:0;font-size:13px;line-height:1.4}.scl li{margin:3px 0}
.scroad>div{padding:5px 0;border-top:1px solid #ffffff12}.scroad b{display:block;font-size:13.5px}.scroad small{display:block;font-size:12px;color:#a8a290}.scroad .ok b{color:#a8d090}
.scc h4 svg{width:20px;height:20px;vertical-align:-3px;color:var(--gold,#c9a66b)}
#cz-sc{display:none}body.cz #cz-sc{display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 10px;margin-top:-2px;border-radius:16px;border:1px solid #c9a66b66;background:#18201cc7;color:var(--hi);font:600 14px var(--sans);cursor:pointer;box-shadow:0 2px 8px #0005}
#cz-sc svg{width:17px;height:17px;color:var(--gold)}#cz-sc i.up{font-style:normal;color:#a8d090}#cz-sc.rdy{border-color:#a8d090aa;box-shadow:0 0 0 2px #a8d09044}
.scg{color:#d8c89a}`;document.head.appendChild(st)}

// ---------- start, zapis i epoki ----------
{const _b=boot;boot=function(fresh){_b(fresh);try{scInit();const b=scB();if(b){if(!b.st)b.st=1;scOcc(b);rebuildMesh(b)}
  if(!fresh&&!b&&S.day>2&&!S.seen.serceInfo){S.seen.serceInfo=1;S.seen.scHint=1;log('Nowe w osadzie: serce osady. Postaw ognisko (Budowa → Wspólnota) tam, gdzie ma być środek osady. Urośnie razem z ludźmi aż do ratusza.');toast('Nowe: serce osady')}}catch(e){console.warn('serce',e)}}}
{const _q=e3Quick;e3Quick=function(){_q();try{scInit();const b=scB();if(b&&(b.st||1)<4){scSetStage(b,4,true);scSetTeki(['dach','stol','wsp']);S.sc.radaSk=-1}}catch(e){console.warn('serce',e)}}}
window.__sc={SERCE,SPK,FIL,TEKI,CECHY,scB,scSt,scC,scFire,scTick,scDaily,scUp,scSetStage,scPkg,scReady,scInit,scOcc,radQ,scWnMake,WN_T,scCechFound,scCechReq,scJarmark,scDrink,scNap,scWind,scSun,scCardHTML,scOsadaHTML,scFuelDay,scDays,scTypes,scShops,scRadaFill,scSetTeki,wspOn};
