
/* ================= RC11 (z 3.5) Zadania główne: po trzy na epokę, bez nich osada nie idzie dalej ================= */
// Wątek przez całą grę: ogień na cyplu i światło na zachodzie (I), przybysz z Wysp Kręgu i zimny rok (II),
// rejs na zachód i ognie na wzgórzach (III). Do tego serce osady, które rośnie od ogniska do ratusza.
// Kroki: 'cond' (stan osady), 'trip' (ktoś idzie w konkretne miejsce, da się go pokazać i śledzić),
// 'give' (osada oddaje materiał), 'sea' (rejs załogi). Wiec pokoleń, koniec epoki II i III czekają na komplet.
const MQ_EP=['','Rozbitkowie','Dzieci wyspy','Cała wyspa','Rody i folwarki'];
const mqEp=()=>S.epoch===4?4:S.e3&&S.e3.on?3:S.epoch===2?2:1;
const MQM=()=>S.mq;
const mqP=()=>{const g=S.mq&&S.mq.guest;return g?pById(g):null};
const mqGN=()=>{const p=mqP();return p?p.name:(S.mq&&S.mq.gName)||'przybysz'};
function mqSerceStep(k){return{k:'cond',t:()=>SERCE[k].n,ok:()=>scSt()>=k,show:'serce',
 how:()=>`Zaznacz ognisko w osadzie (serce osady). Karta pokazuje zadania ${k===2?'pierwszego':k===3?'drugiego':k===4?'trzeciego':'czwartego'} etapu: sześć filarów, czasem też wielkość osady. Gdy wszystkie są spełnione, rozbudujesz serce.`,
 pr:()=>{const st=scSt();if(st>=k)return[1,'stoi'];if(st<k-1)return[0,'najpierw: '+SERCE[k-1].n.toLowerCase()];const P=scPkg();if(!P)return[0,''];const n=FILK.filter(f=>scTaskOk(k,f)).length,sz=scSizeOk(k);
  if(scReady())return[.95,'wszystko gotowe: rozbuduj serce w jego karcie'];return[(n+(sz?1:0))/(FILK.length+1)*.9,`filary: ${n} z ${FILK.length}${sz?'':' · osada jeszcze za mała'}`]}}}
// ---------- miejsca ----------
function mqSeaNear(i,j,r){for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const x=i+a,y=j+b;if(x<0||y<0||x>=N||y>=N||!land[y*N+x])return true}return false}
function mqCape(){const M=MQM();if(M.cape)return M.cape;let best=null,bv=-1e9;
 for(let j=2;j<N-2;j++)for(let i=2;i<N-2;i++){const k=j*N+i;if(!land[k]||!walk[k]||!reach||!reach[k])continue;const d=Math.hypot(i-camp.i,j-camp.j);if(d<12||d>72)continue;if(!mqSeaNear(i,j,2))continue;
  const v=tileH(i,j)*1.2+(camp.i-i)*.3-Math.max(0,d-28)*.3;if(v>bv){bv=v;best=[i,j]}}
 M.cape=best||[camp.i-6,camp.j];return M.cape}
function mqShore(c){let best=null,bv=1e9;for(let a=-12;a<=12;a++)for(let b=-12;b<=12;b++){const i=c[0]+a,j=c[1]+b,k=j*N+i;if(i<2||j<2||i>=N-2||j>=N-2||!land[k]||!walk[k]||!reach||!reach[k])continue;if(!mqSeaNear(i,j,1))continue;
  const v=tileH(i,j)*2+Math.hypot(a,b)*.25;if(v<bv){bv=v;best=[i,j]}}return best||c}
const mqXZ=t=>({x:tcx(t[0]),z:tcx(t[1])});
function mqKrag(){const far=tribe.filter(t=>S.found.includes(t.k)).sort((a,b)=>Math.hypot(b.i-camp.i,b.j-camp.j)-Math.hypot(a.i-camp.i,a.j-camp.j))[0];if(!far)return null;return nearestWalk(far.i,far.j)||[far.i,far.j]}
const mqNk=()=>Math.floor(S.day-T0);// numer nocy: noc należy do dnia, w którego wieczór się zaczęła
const mqNight=()=>!isWork()&&(tod()>=T1||tod()<T0);
const mqDaysTo=d=>{const r=(d-rday()+YEAR)%YEAR;return r};
// ---------- zadania ----------
const MQ=[
 {id:'cypel',ep:1,n:'Ogień na cyplu',open:()=>(S.act||1)>=2||S.day>=YEAR*.3,lock:'Gdy każda rodzina będzie miała dach nad głową (akt II).',
  intro:'Wieczorem przy ognisku ktoś mówi głośno to, o czym myślą wszyscy: jeśli obok wyspy przepłynie statek, nawet nas nie zobaczy. Na zachodnim cyplu, wysoko nad morzem, trzeba ułożyć wielki stos i palić go nocami.',
  st:[{k:'trip',t:'Zanieście drewno na cypel',cost:{drewno:20},work:.3,act:'układa stos na cyplu',
    how:'Jedna osoba niesie kłody na zachodni cypel i układa tam stos. W drodze nocuje przy małym ognisku.',
    dest:()=>{const c=mqCape();return{t:c,what:'zachodni cypel'}},
    worked:(p)=>{MQM().stos=1;mqVis();log(`${p.name} kończy stos na zachodnim cyplu. Kłody ułożone w wysoką piramidę, od morza osłonięte kamieniami.`);return true}},
   {k:'cond',t:'Palcie ogień przez trzy noce',ok:()=>(MQM().cyN||0)>=3,show:()=>mqXZ(mqCape()),
    how:'Co noc stos spala 4 opału ze składu. Ogień pali się sam, byle opału nie zabrakło.',
    pr:()=>{const n=MQM().cyN||0;return[n/3,`noce: ${n} z 3${(S.res.opal||0)<4?' · brakuje opału!':''}`]}}],
  finAt:()=>.1,fin(){const M=MQM(),c=mqXZ(mqCape());const w=S.people.filter(isAdult).sort((a,b)=>(b.trait==='Dociekliwy')-(a.trait==='Dociekliwy')||b.age-a.age)[0];
   return{ey:'Zadanie główne',t:'Odpowiedź z morza',text:()=>`Trzeciej nocy ${w?w.name:'ktoś'} pilnuje stosu sam. Nad ranem budzi całą osadę: daleko na zachodzie, tam gdzie morze styka się z niebem, mruga maleńkie światło. Trzy razy zapala się i gaśnie, jakby ktoś odpowiadał. Potem zostaje tylko ciemność.\n\nNikt nie wie, co to było. Statek? Ludzie? Gwiazda odbita w wodzie?`,
    opts:[{n:'To ktoś żywy. Ogień zapłonie w każdą Noc Kupały',d:'nadzieja, pamięć osady, pieśń',f:()=>{M.west=1;M.kup=1;S.hope=clamp(S.hope+.06,0,1);pamAdd(3,'cypel');song('Pieśń o ogniu na cyplu');try{placeAdd('Cypel Ognia',c.x,c.z,'tu płonął stos dla statków, których nie było')}catch(e){}return'Odtąd w każdą Noc Kupały na cyplu płonie stos. Nikt już nie odpowiada, ale wszyscy patrzą na zachód.'}},
     {n:'To tylko gwiazda. Szkoda opału',d:'opał wraca do składu, mniej niezgody',f:()=>{M.west=1;S.res.opal=(S.res.opal||0)+6;S.dis=Math.max(0,(S.dis||0)-.03);pamAdd(1,'cypel');try{placeAdd('Cypel Ognia',c.x,c.z,'tu płonął stos dla statków, których nie było')}catch(e){}return'Stos gaśnie. Ale dzieci jeszcze długo opowiadają o świetle na morzu.'}}]}}},
 {id:'krag',ep:1,n:'Kamienny krąg',open:()=>(S.act||1)>=3||S.found.length>=1,lock:'Gdy zwiadowcy znajdą pierwszy ślad dawnego ludu albo osada zacznie się zakorzeniać (akt III).',
  intro:'Zwiadowcy przynoszą z głębi wyspy rysunki: łodzie, fale, słońce zachodzące nad morzem. Ktoś mieszkał tu przed nami. Jeśli złożyć znaki z kilku miejsc dawnego ludu, może pokażą, dokąd ten lud odszedł.',
  st:[{k:'cond',t:'Znajdźcie trzy ślady dawnego ludu',ok:()=>S.found.length>=3||!!S.krag,how:'Zwiadowcy i wyprawy odsłaniają wyspę. Ślady leżą w głębi lądu, często na wzgórzach.',pr:()=>[Math.min(3,S.found.length)/3,`śladów: ${Math.min(3,S.found.length)} z 3`]},
   {k:'trip',t:'Wyprawa do kręgu',work:.4,act:'przerysowuje znaki z głazu',food:1,ok:()=>!!S.krag,
    how:'Znaki prowadzą w jedno miejsce. Idzie jedna osoba, najlepiej zwiadowca. Na drogę bierze jedzenie.',
    dest:()=>{const t=mqKrag();return t?{t,what:'miejsce, do którego prowadzą znaki'}:{why:'Najpierw trzeba znaleźć ślady dawnego ludu.'}},
    worked:(p,z)=>{const R=sprInit();R.ch.krag='mq';R.a=R.a.filter(s=>s.chain!=='krag');try{CHAIN.krag.fin({tg:tileOf(z.x,z.z)},p)}catch(e){S.krag=1}if(!S.krag)S.krag=1;return true}}],
  fin(){log('Mapa z kamiennego kręgu trafia do Księgi osady. Dawny lud nie wymarł: odpłynął na zachód.');return null}},
 {id:'serce1',ep:1,n:'Pod jednym dachem',open:()=>true,
  intro:'Ognisko, przy którym spędziliśmy pierwszą noc na plaży, to serce osady. Niech rośnie razem z nią: najpierw dach nad ogniem, potem długa chata, w której zmieści się cała osada.',
  st:[mqSerceStep(2),mqSerceStep(3)],fin(){log('Serce osady ma już dach i ściany. Cała osada mieści się pod jednym dachem.');return null}},
 // ---------- epoka II ----------
 {id:'przybysz',ep:2,n:'Przybysz z zachodu',open:()=>S.epoch===2&&S.day>=(S.finDay||0)+2,lock:'Kilka dni po wiecu pokoleń.',
  intro:()=>`${MQM().west?'Pamiętacie światło na zachodzie? ':''}Rybacy widzą na zachodnim brzegu tratwę wyrzuconą przez fale. Leży na niej człowiek w obcym ubraniu. Żyje, ale ledwo.`,
  onOpen(){const M=MQM();M.raft=mqShore(mqCape());mqVis();const p=S.people.filter(isAdult).sort((a,b)=>(b.sk.rybak||0)-(a.sk.rybak||0))[0];
   log(`${p?p.name:'Rybacy'} ${p?'widzi':'widzą'} na zachodnim brzegu tratwę z człowiekiem. Trzeba go przynieść do osady.`);toast('Zadanie główne: przybysz z zachodu');sfx('bell')},
  st:[{k:'trip',t:'Przynieście go z brzegu',work:.15,act:'opatruje przybysza',back:1,
    how:'Jedna osoba idzie na brzeg, opatruje rozbitka i prowadzi go do osady.',
    dest:()=>{const M=MQM();if(!M.raft)M.raft=mqShore(mqCape());return{t:M.raft,what:'tratwa na zachodnim brzegu'}},
    worked:(p,z)=>{mqGuest(z.x,z.z,p);return false},home:()=>true},
   {k:'give',t:'Wyleczcie go ziołami',cost:{ziola:6},btn:'Podaj zioła',how:'Przybysz jest wycieńczony i rozpalony gorączką. Bez ziół nie wyzdrowieje. Zioła zbierają zbieracze i rosną w ogrodzie ziołowym.',
    give(){const M=MQM();M.herb=S.day;const g=mqP();log(`${hasB('izbachorych')||hasB('szpital')?'Zielarka':'Najstarsza z kobiet'} parzy zioła dla przybysza. ${g?g.name+' pije':'Pije'} i pierwszy raz od dni śpi spokojnie.`)}},
   {k:'cond',t:'Nauczcie się jego mowy',ok:()=>{const M=MQM(),g=mqP();return!!M.herb&&S.day-M.herb>=3&&(!g||g.hp>=.8)},
    how:'Przybysz mieszka z nami. Dzieci uczą go pierwszych słów, on uczy je swoich. Potrwa to kilka dni, a zdrowieje szybciej przy zielarce.',
    pr:()=>{const M=MQM(),g=mqP();const d=M.herb?Math.min(3,S.day-M.herb):0;return[d/3*.8+(g?Math.min(1,g.hp)*.2:.2),`dni nauki: ${Math.floor(d)} z 3${g?` · zdrowie ${Math.round(g.hp*100)}%`:''}`]},show:()=>{const g=mqP();return g?{x:g.x,z:g.z,pid:g.id}:null}}],
  fin(){const M=MQM(),nm=mqGN();
   return{ey:'Zadanie główne',t:'Opowieść przybysza',text:()=>`${nm} mówi już na tyle, żeby opowiedzieć swoją historię. Przypłynął z wysp leżących daleko na zachodzie. Jego lud nazywa je Wyspami Kręgu. Dawno temu jego przodkowie mieszkali tutaj, na tej wyspie, i to oni postawili kamienie${S.krag?', które znaleźli nasi zwiadowcy':''}.\n\nOdpłynęli po zimnym roku, w którym morze zamarzło przy brzegu, a zboże nie dojrzało. „Zimny rok wraca” — mówi. — „Raz na pokolenie. Starzy u nas mówią, że już niedługo.”`,
    opts:[{n:`Zostań z nami, ${nm}`,d:'zostaje jako rybak, rybacy uczą się jego sieci',f:()=>{M.gOk=1;S.bonus=S.bonus||{};S.bonus.rybak=(S.bonus.rybak||0)+.06;S.hope=clamp(S.hope+.04,0,1);pamAdd(3,'przybysz');song('Pieśń o przybyszu z zachodu',nm);return`${nm} zostaje. Uczy rybaków swoich węzłów i sieci, a dzieci liczą w jego mowie do dziesięciu.`}},
     {n:'Kiedyś pomożemy ci wrócić',d:'obietnica, pamięć osady, nadzieja',f:()=>{M.gOk=1;M.promise=1;S.hope=clamp(S.hope+.06,0,1);pamAdd(5,'przybysz');song('Pieśń o przybyszu z zachodu',nm);return`${nm} kiwa głową i długo patrzy w ogień. Do tego czasu będzie żył z nami jak swój.`}}]}}},
 {id:'zimny',ep:2,n:'Zimny rok',open:()=>mqDone('przybysz'),lock:'Przybysz musi najpierw opowiedzieć swoją historię.',
  intro:()=>`${mqGN()} ostrzega: raz na pokolenie przychodzi zimny rok. Morze zamarza przy brzegu, a mróz trzyma całą zimę. Dawny lud odpłynął, bo nie był gotowy. My musimy być.`,
  st:[{k:'cond',t:'Jedzenie na 25 dni',ok:()=>scDays()>=25,how:'Zapas liczy się względem tego, ile osada zjada w ciągu dnia. Przetwory, spichlerze i piwnice pomagają go utrzymać.',pr:()=>[Math.min(1,scDays()/25),`teraz starczy na ${dniS(Math.floor(scDays()))}`]},
   {k:'cond',t:'Opał na 20 dni zimy i ciepłe ubrania dla wszystkich',ok:()=>scFuelDays()>=20&&mqCoats()>=.9,how:'Drewutnie i kopanki torfu. Ciepłą odzież szyje szwalnia ze skór. Domy z piecem palą najmniej.',
    pr:()=>{const f=Math.min(1,scFuelDays()/20),c=mqCoats();return[(f+Math.min(1,c/.9))/2,`opał: ${fmt(S.res.opal)} z ${Math.ceil(20*scFuelDay())} · ciepłe ubrania: ${Math.round(c*100)}% osady`]}},
   {k:'cond',t:'Przetrwajcie zimny rok',ok:()=>MQM().zr==='end',how:'Zimny rok przychodzi z najbliższą zimą: mróz codziennie, przez pięć dni. Domy palą więcej, ludzie bez ciepłych ubrań chorują.',
    pr:()=>{const M=MQM();if(M.zr==='on'){const d=Math.min(5,Math.max(0,rday()-YEAR/2));return[d/5,`zima trwa: dzień ${Math.min(5,Math.floor(d)+1)} z 5, mróz co dzień`]}return[0,`zimny rok przyjdzie z najbliższą zimą, za ${dniS(Math.ceil(mqDaysTo(YEAR/2)))}`]}}],
  fin(){const M=MQM();const dead=Math.max(0,(S.died||0)-(M.zrD||0));
   return{ey:'Zadanie główne',t:'Wiosna po zimnym roku',text:()=>`Lód przy brzegu pęka z hukiem, a nad zatoką wracają mewy. Zimny rok minął.${dead?` Odeszło w nim ${dead} ${osb(dead)}. Ich imiona wyryto na kamieniu przy sercu osady.`:' Nikt nie umarł z zimna ani z głodu.'}\n\n${mqGN()} mówi przy ognisku, że jego przodkowie odpłynęli po takiej zimie. My zostaliśmy.`,
    opts:[{n:'Dalej',d:'nadzieja, zgoda, pamięć osady, pieśń',f:()=>{S.hope=clamp(S.hope+.1,0,1);S.dis=Math.max(0,(S.dis||0)-.06);pamAdd(6,'zimny');song('Pieśń o zimnym roku');M.zrOk=1;return'Odtąd w osadzie mówi się: kto przetrwał zimny rok, przetrwa wszystko.'}}]}}},
 {id:'rada',ep:2,n:'Rada przy stole',open:()=>S.epoch===2,
  intro:'Wieś ma już swoje sprawy: miedze, zapasy, budowy na wiosnę. Kiedy dzieci pytają, kto u nas rządzi, nikt nie umie odpowiedzieć. Czas, żeby rada usiadła przy stole w sercu osady.',
  st:[mqSerceStep(4),{k:'cond',t:'Pierwszy wniosek rady spełniony',ok:()=>(S.sc&&S.sc.wnOk||0)>=1,show:'serce',how:'Radni w Domu rady zgłaszają wnioski: konkretne zadania na kilka dni. Wnioski są w karcie serca osady.',pr:()=>[Math.min(1,(S.sc&&S.sc.wnOk)||0),'wnioski spełnione: '+((S.sc&&S.sc.wnOk)||0)]}],
  fin(){log('Rada siedzi przy stole w sercu osady. Pierwszy wniosek spełniony, następne czekają.');return null}},
 // ---------- epoka III ----------
 {id:'zachod',ep:3,n:'Wyspy Kręgu',open:()=>e3On(),
  intro:()=>`${MQM().promise?`Obiecaliśmy ${mqGN()}, że pomożemy mu wrócić. `:''}Na zachodzie, za horyzontem, leżą Wyspy Kręgu: ziemia ludu, który postawił kamienie na naszej wyspie. Czas tam popłynąć. Potrzebna jest łódź, jakiej osada jeszcze nie budowała: z masztem i żaglem, na otwarte morze.`,
  st:[{k:'give',t:'Zbudujcie łódź dalekomorską',cost:{deski:30,gwozdzie:12,plotno:8,drewno:10},btn:'Zbudujcie łódź',how:'Cieśle składają ją na zachodnim brzegu: deski na zakładkę, gwoździe, maszt i żagiel z płótna.',
    give(){const M=MQM();M.boat=mqShore(mqCape());mqVis();log('Na zachodnim brzegu stoi łódź dalekomorska: maszt z sosny, żagiel z płótna, na dziobie wyrzeźbione słońce.')},show:()=>{const M=MQM();return M.boat?mqXZ(M.boat):null}},
   {k:'sea',t:'Rejs na zachód',crew:3,food:30,how:()=>`Troje ludzi płynie na zachód${mqP()?`, prowadzi ${mqGN()}`:''}. Najpierw idą na brzeg do łodzi, potem ${mqP()?'trzy dni':'cztery dni'} na morzu. Na drogę biorą 30 porcji jedzenia.`,
    dest:()=>{const M=MQM();return{t:M.boat||mqShore(mqCape()),what:'łódź na zachodnim brzegu'}},days:()=>mqP()?3:4}],
  fin(){const M=MQM(),L=pById(M.lead);const lead=L?L.name:'Sternik';
   return{ey:'Zadanie główne',t:'Wyspy Kręgu',text:()=>`Łódź wraca o świcie. ${lead} opowiada przy ognisku: trzy wyspy, niskie i zielone, a na każdej kamienny krąg taki jak nasz. Mieszkają tam rybacy i pasterze${mqP()?` mówiący jak ${mqGN()}`:''}. Przyjęli ich jak krewnych, a starszyzna pamięta jeszcze opowieści o naszej wyspie.\n\nNa pożegnanie dostali dary. Mogli zabrać jeden.`,
    opts:[{n:'Ziarno z Wysp Kręgu',d:'pola dają o 12% więcej',f:()=>{M.seed=1;pamAdd(4,'zachod');song('Pieśń o rejsie na zachód',lead);return'Ziarno jest drobne i ciemne, ale rośnie nawet w zimny rok. Pierwszą garść sieje ten, kto prowadził łódź.'}},
     {n:'Rodzina, która chce zamieszkać u nas',d:'czworo nowych ludzi w osadzie',f:()=>{let nm=[];try{nm=spawnGroup(4)}catch(e){}pamAdd(4,'zachod');song('Pieśń o rejsie na zachód',lead);return`Z łodzi wysiada czworo: ${nm.join(', ')||'rodzina z Wysp Kręgu'}. Wracają na wyspę swoich przodków.`}},
     {n:'Kamienne tablice z ich wiedzą',d:'dużo wiedzy, pamięć osady',f:()=>{techXp('nauka',160);pamAdd(7,'zachod');song('Pieśń o rejsie na zachód',lead);return'Na tablicach są znaki gwiazd, pór roku i dróg morskich. Starsi ślęczą nad nimi całą zimę.'}}]}}},
 {id:'kopiec',ep:3,n:'Kopiec na szczycie',open:()=>e3On()&&(S.e3.a||10)>=11,lock:'Gdy wyspa zacznie wymieniać się towarem (akt XI).',
  intro:'Z najwyższego szczytu widać całą wyspę. Starsi chcą tam usypać kopiec z kamieni, po kamieniu od każdej rodziny, z osady i z przysiółków. W Noc Kupały zapłonie na nim ogień widoczny z każdej krainy.',
  st:[{k:'trip',t:'Usypcie kopiec na szczycie',cost:{kamien:30},work:.5,act:'usypuje kopiec z kamieni',food:1,how:'Jedna osoba prowadzi wóz z kamieniami na najwyższy szczyt wyspy i usypuje tam kopiec.',
    dest:()=>{const t=hiTile();return t?{t,what:'najwyższy szczyt wyspy'}:{why:'Nie znamy drogi na szczyt.'}},worked:(p)=>{MQM().kop=1;mqVis();log(`${p.name} usypuje kopiec na szczycie. Na wierzchu kładzie płaski kamień pod ogień.`);return true}},
   {k:'cond',t:'Ogień na kopcu w Noc Kupały',ok:()=>!!MQM().kopK,show:()=>{const t=hiTile();return t?mqXZ(t):null},how:'W Noc Kupały ogień na kopcu zapala się sam. Potrzeba 10 opału w składzie.',
    pr:()=>{const d=Math.ceil(mqDaysTo(0));return[0,d?`Noc Kupały za ${dniS(d)}${(S.res.opal||0)<10?' · brakuje opału':''}`:'dziś Noc Kupały']}}],
  fin(){const H=(S.hamlets||[]).slice().sort((a,b)=>b.pop-a.pop);const h=H[0];
   return{ey:'Zadanie główne',t:'Ognie na wzgórzach',text:()=>`W Noc Kupały na kopcu płonie ogień. Po chwili odpowiada mu drugi${h?`, na wzgórzu nad przysiółkiem ${h.name}`:''}, potem trzeci i czwarty, aż po najdalsze krainy.${MQM().west?' Daleko na zachodzie, na morzu, mruga jeszcze jedno światło.':''}\n\nCała wyspa patrzy na siebie przez noc.`,
    opts:[{n:'Dalej',d:'nadzieja, pamięć osady, pieśń',f:()=>{const t=hiTile();S.hope=clamp(S.hope+.06,0,1);pamAdd(6,'kopiec');song('Pieśń o ogniach na wzgórzach');try{if(t)placeAdd('Kopiec Pamięci',tcx(t[0]),tcx(t[1]),'kamień od każdej rodziny wyspy')}catch(e){}return'Od tej nocy ogień na kopcu pali się w każdą Noc Kupały.'}}]}}},
 {id:'ratusz',ep:3,n:'Ratusz nad rynkiem',open:()=>e3On(),
  intro:'Sprawy całej wyspy nie mieszczą się już w Domu rady. Wyspa potrzebuje ratusza z wieżą widoczną z daleka i rynku, na który zjadą wozy ze wszystkich przysiółków.',
  st:[mqSerceStep(5),{k:'cond',t:'Pierwszy jarmark przed ratuszem',ok:()=>(S.sc&&S.sc.jarN||0)>=1,show:'serce',how:'Jarmark odbywa się raz w roku, siódmego dnia lata, gdy osada ma co najmniej dwa przysiółki.',pr:()=>[0,`do jarmarku: ${dniS(Math.ceil(mqDaysTo(7))||YEAR)}${(S.hamlets||[]).length<2?' · potrzebne dwa przysiółki':''}`]}],
  fin(){log('Przed ratuszem odbył się pierwszy jarmark. Wyspa żyje jak jedno gospodarstwo.');return null}}];
const MQI={};MQ.forEach(q=>MQI[q.id]=q);
const mqF=(v,...a)=>typeof v==='function'?v(...a):v;
function mqCoats(){const A=S.people.filter(q=>q.age>=3);if(!A.length)return 1;return A.filter(q=>q.coat>0).length/A.length}
function mqQ(id){const M=MQM();return M.q[id]||(M.q[id]={s:0})}
const mqDone=id=>!!(S.mq&&S.mq.q[id]&&S.mq.q[id].done);
const mqEpQ=ep=>MQ.filter(q=>q.ep===ep);
const mqEpDone=ep=>mqEpQ(ep).every(q=>mqDone(q.id));
function mqInit(){S.mq=S.mq||{};const M=S.mq;M.q=M.q||{};const ep=mqEp();
 MQ.forEach(q=>{if(q.ep<ep&&!mqDone(q.id))M.q[q.id]={s:q.st.length,done:1,skip:1}});return M}
function mqSkip(ep){const M=mqInit();MQ.forEach(q=>{if(q.ep<=ep)M.q[q.id]={s:q.st.length,done:1,skip:1}})}
// start od epoki II albo III: wcześniejsze zadania główne zaliczone
{const _b=e2Build;e2Build=function(){_b();try{mqSkip(1)}catch(e){}}}
{const _q=e3Quick;e3Quick=function(){_q();try{mqSkip(2)}catch(e){}}}
// małe ognisko noclegu w drodze
const mqFx={};
const zbCost=d=>Math.max(4,Math.round(3+d/14));// jedzenie na drogę zależnie od odległości
function mqFxOn(p){if(mqFx[p.id])return;const g=new THREE.Group();const x=p.x+.6,z=p.z+.4;g.position.set(x,Hy(x,z),z);makeFire(g,0,0,0,true);g.scale.setScalar(.55);scene.add(g);mqFx[p.id]=g}
function mqFxOff(id){const g=mqFx[id];if(!g)return;for(let k=fires.length-1;k>=0;k--){let o=fires[k].g;while(o&&o!==g)o=o.parent;if(o)fires.splice(k,1)}scene.remove(g);delete mqFx[id]}
// ---------- wyprawy zadań ----------
function mqWho(n,pref){const L=S.people.filter(q=>isAdult(q)&&q.age>=16&&q.age<60&&q.hp>.55&&q.state!=='away'&&!q.mqT&&!q.lost&&!q.fireB&&q.job!=='wyp'&&!q.exp&&!q.mqG&&!pendingDelivery(q));
 return L.sort((a,b)=>((b.job==='zwiad')-(a.job==='zwiad'))*2+(pref?pref(b)-pref(a):0)+(b.hp-a.hp)).slice(0,n)}
function mqTripOf(id){return S.people.filter(q=>q.mqT&&q.mqT.q===id)}
function mqStepSt(q){const Q=mqQ(q.id);const s=q.st[Q.s];if(!s)return null;
 if(s.k!=='trip'&&s.k!=='sea')return null;const on=mqTripOf(q.id);if(on.length)return{on};
 const d=s.dest();if(d.why)return{why:d.why};const n=s.crew||1;const W=mqWho(n,s.k==='sea'?(p=>p.id===S.mq.guest?9:(p.sk.rybak||0)):null);
 if(s.k==='sea'){const g=mqP();if(g&&!W.includes(g)&&g.hp>.55&&!g.mqT&&g.state!=='away'){W.unshift(g);W.length=Math.min(W.length,n)}}
 if(W.length<n)return{why:n>1?`Potrzeba ${n} zdrowych dorosłych, którzy nie są teraz na innych wyprawach.`:'Nie ma kogo wysłać: wszyscy dorośli są chorzy albo na wyprawach.',d};
 const c=Object.assign({},s.cost||{});const x=mqXZ(d.t);const dist=Math.hypot(x.x-tcx(camp.i),x.z-tcx(camp.j));let food=s.food?(s.food>1?s.food:zbCost(dist)):0;
 if(Object.keys(c).length){if(!canAfford(c))return{why:'Brakuje materiału: '+costHave(c)+'.',d,W,c,food}}
 if(food&&!needHave('jedzenie',food))return{why:`Na drogę trzeba ${food} ${plW(food,'porcji','porcji','porcji')} jedzenia, a zapasy są za małe.`,d,W,c,food};
 return{d,W,c,food,dist}}
function mqStart(id){const q=MQI[id];if(!q)return;const st=mqStepSt(q);if(!st||st.on)return;if(st.why){toast(st.why);return}const Q=mqQ(id),s=q.st[Q.s];
 Object.entries(st.c).forEach(([k,v])=>S.res[k]-=v);if(st.food)needTake('jedzenie',st.food);const x=mqXZ(st.d.t);
 st.W.forEach((p,k)=>{release(p);if(p.state==='work'&&p.workKind==='build'&&p.tgt&&p.tgt.workers)p.tgt.workers--;p.path=null;p.state='idle';p.wait=k*.05;
  p.mqT={q:id,s:Q.s,ph:'go',t0:S.day,x:x.x+(k?(k-1)*.7:0),z:x.z+(k?.5:0),d0:st.dist,what:st.d.what}});
 if(s.k==='sea'){S.mq.lead=st.W[0].id;Q.crew=st.W.map(p=>p.id);Q.until=0}
 const names=st.W.map(p=>p.name);log(`Zadanie główne: ${q.n.toLowerCase()}. ${names.join(', ')} ${names.length>1?'wyruszają':'wyrusza'}: ${st.d.what}, ${Math.round(st.dist)} ${krokW(Math.round(st.dist))} od osady.`);
 toast(`${names.length>1?'Wyruszają':'Wyrusza'}: ${s.t.toLowerCase()}`);st.W.forEach(p=>mqPlan(p));mqJRender(1);renderPanel()}
function mqEnd(p,txt){const z=p.mqT;if(!z)return;p.mqT=null;mqFxOff(p.id);if(p.state==='nocleg'||p.state==='away')p.state='idle';if(txt)log(txt)}
function mqFail(p,txt){const z=p.mqT;mqEnd(p,txt);if(!z)return;const q=MQI[z.q],Q=q&&mqQ(z.q);if(Q&&Q.s===z.s&&!mqTripOf(z.q).length&&q.st[z.s].k==='sea')Q.until=0}
function mqPlan(p){const z=p.mqT;if(!z)return false;const q=MQI[z.q];if(!q){mqEnd(p);return false}
 if(S.day-z.t0>(q.st[z.s]&&q.st[z.s].k==='sea'?9:4)){mqFail(p,`${p.name} wraca do osady: zadanie trwało za długo.`);return false}
 if(z.ph==='go'){const st=nearestWalk(...tileOf(z.x,z.z));if(st&&go(p,st,'mqdo',null)){p.act=`idzie: ${z.what}`;return true}mqFail(p,`${p.name} nie znajduje drogi: ${z.what}.`);return false}
 if(z.ph==='back'){const st=storeTile(p,true);if(st&&go(p,st,'mqret',null)){p.act='wraca do osady'+(p.mqG?' z pomocą':'');return true}mqHome(p);return false}
 if(z.ph==='work'||z.ph==='sea'||z.ph==='board')return true;return false}
function mqHome(p){const z=p.mqT;if(!z)return;deposit(p);const q=MQI[z.q],s=q&&q.st[z.s];mqEnd(p,null);p.state='idle';p.wait=.4;
 if(s&&s.home&&mqQ(z.q).s===z.s&&(!p.mqG||!mqTripOf(z.q).length)){if(s.home(p,z))mqStepDone(z.q,z.s)}}
{const _pj=planJob;planJob=function(p){if(p.mqT&&S){const r=mqPlan(p);if(r||p.mqT)return r}return _pj(p)}}
{const _oa=onArrive;onArrive=function(p){const a=p.after,z=p.mqT;
  if(z&&a==='mqdo'){p.after=null;const q=MQI[z.q],s=q.st[z.s];
   if(s.k==='sea'){const Q=mqQ(z.q);p.state='away';z.ph='board';p.act='wsiada do łodzi';if(!Q.until)Q.until=S.day+.25+mqF(s.days);mqVis();return}
   p.state='work';p.workKind='mqwork';z.ph='work';z.wEnd=S.day+(s.work||.2);p.act=s.act||'pracuje';return}
  if(z&&a==='mqret'){p.after=null;mqHome(p);return}
  return _oa(p)}}
{const _sp=stepPerson;stepPerson=function(p,dt){if(p.mqG&&S&&!mqDone('przybysz')){if(p.hp<.25)p.hp=.25;if(!S.mq.herb&&p.hp>.4)p.hp=.4}const z=p.mqT;if(!z)return _sp(p,dt);
  if(z.ph==='board'||z.ph==='sea'){const Q=mqQ(z.q);p.state='away';if(z.ph==='board'&&S.day>=Q.until-mqF(MQI[z.q].st[z.s].days)){z.ph='sea';p.act='na morzu, płynie na zachód'}
   if(Q.until&&S.day>=Q.until){const t=nearestWalk(...tileOf(z.x,z.z));if(t){p.x=tcx(t[0]);p.z=tcx(t[1])}p.state='idle';p.wait=.2;z.ph='back';z.sea=1;Q.back=1;mqVis()}return}
  if(!isWork()&&!p.fireB){if(p.state==='move'&&p.path&&p.path.length&&z.ph==='back')return _sp(p,dt);
   if(p.state==='move'){p.path=null;p.after=null}if(p.state!=='nocleg'){if(z.ph==='work')z.wLeft=Math.max(.02,z.wEnd-S.day);p.state='nocleg';p.act='nocuje pod gołym niebem';mqFxOn(p)}return}
  if(p.state==='nocleg'){mqFxOff(p.id);if(z.ph==='work'){p.state='work';p.workKind='mqwork';z.wEnd=S.day+(z.wLeft||.05);p.act=MQI[z.q].st[z.s].act||'pracuje'}else{p.state='idle';p.wait=.3}}
  if(p.state==='work'&&p.workKind==='mqwork'){if(S.day<z.wEnd)return;const q=MQI[z.q],s=q.st[z.s];p.state='idle';p.wait=.2;z.ph='back';
   if(mqQ(z.q).s===z.s&&s.worked){let ok=false;try{ok=s.worked(p,z)}catch(e){console.warn(e)}if(ok)mqStepDone(z.q,z.s)}return}
  return _sp(p,dt)}}
{const _lc=ludCard;ludCard=function(p){let h=_lc(p);if(p&&p.mqT){const q=MQI[p.mqT.q];if(q)h=`<p class="mut">Zadanie główne: ${q.n.toLowerCase()} (${p.mqT.what}). ${mqTxt(p)}.</p>`+h}if(p&&p.mqG&&!mqDone('przybysz'))h=`<p class="mut">Przybysz z zachodu. Mówi obcą mową, dopiero uczy się naszej.</p>`+h;return h}}
function mqTxt(p){const z=p.mqT;const left=p.path&&p.path.length?Math.hypot(p.path[p.path.length-1].x-p.x,p.path[p.path.length-1].z-p.z):0;
 if(p.state==='nocleg')return'nocuje pod gołym niebem';if(z.ph==='go')return`w drodze, zostało ok. ${Math.round(left)} ${krokW(Math.round(left))}`;
 if(z.ph==='work')return p.act;if(z.ph==='board')return'czeka przy łodzi na resztę załogi';if(z.ph==='sea'){const Q=mqQ(z.q);const d=Math.max(0,Q.until-S.day);return`na morzu, wrócą za ${dniS(Math.ceil(d))}`}
 return`wraca do osady, zostało ok. ${Math.round(left)} ${krokW(Math.round(left))}`}
function mqTripPr(q,on){const s=q.st[mqQ(q.id).s];const p=on[0],z=p.mqT;if(s.k==='sea'){const Q=mqQ(q.id);if(z.ph==='go')return.1;if(z.ph==='board')return.2;if(z.ph==='sea'){const D=mqF(s.days);return.2+.7*clamp(1-(Q.until-S.day)/D,0,1)}return.95}
 const left=p.path&&p.path.length?Math.hypot(p.path[p.path.length-1].x-p.x,p.path[p.path.length-1].z-p.z):0;if(z.ph==='go')return.05+.55*clamp(1-left/Math.max(1,z.d0),0,1);if(z.ph==='work')return.6+.3*clamp(1-(z.wEnd-S.day)/(s.work||.2),0,1);return.92}
// ---------- przybysz ----------
function mqGuest(x,z,res){const M=MQM();if(M.guest&&pById(M.guest))return;const fid=S.fid++;S.fams[fid]={id:fid,home:null};const used=new Set(S.people.map(q=>q.name));const nm=['Ilmar','Tarvo','Aino','Kalev','Urmas'].find(n=>!used.has(n))||'Ilmar';
 const p=newPerson(S.pid++,nm,44,nm==='Aino'?'k':'m',fid,{rybak:3,ciesla:2},'Dociekliwy');p.born=1;p.mqG=1;p.hp=.3;p.x=x+.5;p.z=z+.4;p.tool={t:1,d:60};S.people.push(p);addPersonMesh(p);
 M.guest=p.id;M.gName=nm;p.mqT={q:'przybysz',s:0,ph:'back',t0:S.day,x,z,d0:Math.hypot(x-tcx(camp.i),z-tcx(camp.j)),what:'do osady'};p.state='idle';p.wait=.4;M.raftGone=1;mqVis();
 log(`${res.name} opatruje rozbitka z tratwy. Nazywa się ${nm}, tyle udaje się zrozumieć. Idą razem do osady, ${nm} wsparty na ramieniu ${gen(res.name)}.`);try{assignHomes()}catch(e){}}
// ---------- przebieg ----------
function mqStepDone(id,si){const q=MQI[id],Q=mqQ(id);if(Q.done||Q.s!==si)return;Q.s++;const s=q.st[si];
 if(Q.s<q.st.length){const n=q.st[Q.s];log(`Zadanie główne „${q.n}”: ${mqF(s.t).toLowerCase()} — gotowe. Dalej: ${mqF(n.t).toLowerCase()}.`);toast(`${q.n}: ${mqF(n.t)}`);try{sfx('bell')}catch(e){}}
 else{Q.done=1;Q.dd=S.day;const fa=q.finAt?q.finAt():0;Q.finQ=S.day+fa;S.hope=clamp(S.hope+.04,0,1);log(`Zadanie główne wykonane: ${q.n.toLowerCase()}.`);toast('Zadanie główne wykonane: '+q.n);try{sfx('bell')}catch(e){}}
 mqJRender(1)}
let mqT0=0;
function mqTick(){if(!S||!S.people.length)return;const M=mqInit();const ep=mqEp();
 MQ.forEach(q=>{const Q=mqQ(q.id);if(Q.done)return;if(q.ep>ep)return;let op=false;try{op=q.open()}catch(e){}
  if(!Q.op){if(!op)return;Q.op=1;Q.d0=S.day;if(q.onOpen)try{q.onOpen()}catch(e){console.warn(e)}else if(q.ep===ep&&S.day>1){log(`Nowe zadanie główne: ${q.n.toLowerCase()}.`);toast('Nowe zadanie główne: '+q.n)}M.newQ=1}
  const s=q.st[Q.s];if(!s)return;
  if(s.k==='cond'||s.k==='give'){if(s.ok){let ok=false;try{ok=s.ok()}catch(e){}if(ok)mqStepDone(q.id,Q.s)}}
  else if(s.ok){let ok=false;try{ok=s.ok()}catch(e){}if(ok&&!mqTripOf(q.id).length)mqStepDone(q.id,Q.s)}
  if(s.k==='sea'&&Q.back&&!mqTripOf(q.id).length)mqStepDone(q.id,Q.s);
  // ktoś zginął w drodze: krok wraca do „wyślij”
  if((s.k==='trip'||s.k==='sea')&&Q.crew&&s.k==='sea'&&!Q.back&&Q.until&&!mqTripOf(q.id).length){Q.until=0;Q.crew=null}});
 // noce przy stosie
 const nk=mqNk(),nt=mqNight();
 if(nt&&M.stos&&!mqDone('cypel')&&mqQ('cypel').s===1&&M.cyD!==nk){M.cyD=nk;if((S.res.opal||0)>=4){S.res.opal-=4;M.cyN=(M.cyN||0)+1;M.cyOn=nk;
   if(M.cyN<3)log(`Na zachodnim cyplu płonie stos. Noc ${M.cyN} z 3.`);else{M.ans=nk;log('Trzecia noc przy stosie. Na zachodzie, daleko na morzu, mruga światło!');toast('Na zachodzie mruga światło!')}}
  else log('Na cyplu stos stoi zimny: w składzie brakuje opału.')}
 if(nt&&M.kup&&Math.floor(rday())===0&&M.cyD!==nk){M.cyD=nk;M.cyOn=nk}
 // Kupała na kopcu
 if(nt&&M.kop&&Math.floor(rday())===0&&M.kopD!==nk){M.kopD=nk;if(!M.kopK&&mqQ('kopiec').s===1){if((S.res.opal||0)>=10){S.res.opal-=10;M.kopK=1}else log('Noc Kupały, a na kopiec nie ma opału.')}if(M.kopK)M.kopOn=nk}
 // zimny rok
 if(mqQ('zimny').s===2&&!mqDone('zimny')){const w=seasonIdx()===2;if(!M.zr&&!w)M.zr='arm';if(M.zr==='arm'&&w){M.zr='on';M.zrD=S.died||0;M.zrQ=1;S.weather.k='frost';S.weather.left=1}if(M.zr==='on'&&!w)M.zr='end'}
 if(M.zrQ&&!evOpen&&!placing){M.zrQ=0;openEvent({ey:'Zadanie główne',t:'Zimny rok',text:()=>`Rano zatoka jest biała. Morze zamarzło przy brzegu, a mróz ścina oddech w piersi. ${mqGN()} patrzy na lód i mówi tylko jedno słowo w swojej mowie. Nikt nie musi go tłumaczyć.\n\nPięć dni mrozu. Trzeba je przetrwać.`,opts:[{n:'Wszyscy pod dach',d:'',f:()=>'Rodziny zsuwają posłania bliżej pieców. Opał idzie jak nigdy.'}]},{})}
 // przybysz zdrowieje
 const g=mqP();if(g&&M.herb&&!mqDone('przybysz')){const dt=S.day-(M.hT||S.day);M.hT=S.day;g.hp=Math.min(1,g.hp+dt*(hasB('izbachorych')||hasB('szpital')?.3:.18))}else if(g)M.hT=S.day;
 // finał zadania i bramy epok
 if(!evOpen&&!placing){for(const q of MQ){const Q=mqQ(q.id);if(Q.finQ&&S.day>=Q.finQ){Q.finQ=0;let e=null;try{e=q.fin()}catch(er){console.warn(er)}if(e){openEvent(e,{});mqVis();return}}}
  if(M.fin1&&mqEpDone(1)&&isWork()&&S.epoch!==2){M.fin1=0;wiecPokolen();return}
  if(M.fin2&&mqEpDone(2)&&isWork()&&S.e2&&!S.e2.endName){M.fin2=0;e2Final();return}
  if(M.fin3&&mqEpDone(3)&&S.e3&&S.e3.done&&!M.fin3x){M.fin3=0;M.fin3x=1;e3Final();return}}
 if(performance.now()-mqT0>1500){mqT0=performance.now();mqVisTick()}}
{const _gt=goalsTick;goalsTick=function(){_gt();try{mqTick()}catch(e){console.warn(e)}}}
// bramy: wiec pokoleń, koniec epoki II i III czekają na zadania główne
{const _w=wiecPokolen;wiecPokolen=function(){if(S&&!mqEpDone(1)){mqInit().fin1=1;return}return _w()}}
{const _f=e2Final;e2Final=function(){if(S&&!mqEpDone(2)){mqInit().fin2=1;return}return _f()}}
{const _f=e3Final;e3Final=function(){if(S&&!mqEpDone(3)){mqInit().fin3=1;return}return _f()}}
{if(typeof e4Prepare==='function'){const _e4=e4Prepare;e4Prepare=function(){if(S&&!S.e4Preparing&&!mqEpDone(3))return{ok:false,reason:'Najpierw wykonaj zadania główne epoki III (Zadania).'};return _e4.apply(this,arguments)}}}
// zimny rok: mróz przez całą zimę
{const _dw=diffWeather;diffWeather=function(){_dw();try{if(S&&S.mq&&S.mq.zr==='on'&&seasonIdx()===2&&S.weather&&S.weather.k!=='storm'&&S.weather.k!=='frost')S.weather.k=Math.random()<.7?'frost':'snow'}catch(e){}}}
// ziarno z Wysp Kręgu
{const _fm=fieldMul;fieldMul=function(b){return _fm(b)*(S&&S.mq&&S.mq.seed?1.12:1)}}
// ---------- cel na ekranie: co blokuje przejście dalej ----------
function mqCur(ep){for(const q of mqEpQ(ep)){const Q=mqQ(q.id);if(Q.done)continue;if(!Q.op)return{q,lock:1};return{q,s:q.st[Q.s]}}return null}
{const _gi=goalInfo;goalInfo=function(){const g=_gi();if(!S||!S.mq)return g;const M=S.mq,ep=mqEp();
  const wait=(ep===1&&S.actDone)||(M.fin1&&ep===1)||(M.fin2&&ep===2)||(ep===3&&S.e3&&S.e3.done&&!mqEpDone(3))||(ep===2&&S.e2&&S.e2.a===12&&!S.e2.endName&&!mqEpDone(2));
  if(!wait||mqEpDone(ep))return g;const c=mqCur(ep);if(!c)return g;
  if(c.lock)return{ch:'Zadanie główne · '+c.q.n,t:c.q.n,d:c.q.lock||'Zadanie jeszcze się nie zaczęło.',kind:null};
  return{ch:'Zadanie główne · '+c.q.n,t:mqF(c.s.t),d:'Epoka idzie dalej, gdy wszystkie zadania główne są wykonane. '+(mqF(c.s.how)||''),kind:null}}}
// ---------- modele: stos, tratwa, łódź, kopiec, światło na morzu ----------
let mqG=null;const mqO={};
function mqMk(){if(mqG)return;mqG=new THREE.Group();mqG.name='mq';scene.add(mqG)}
function mqStos(){const g=new THREE.Group();for(let k=0;k<4;k++){const s=1.1-k*.24;for(let q=0;q<2;q++){const r=mesh(new THREE.CylinderGeometry(.07,.08,s*1.6,5),k%2?matLog2:matLog,0,.08+k*.15,(q?-1:1)*s*.32,0,0,Math.PI/2);if(k%2)r.rotation.y=Math.PI/2,r.position.set((q?-1:1)*s*.32,.08+k*.15,0);g.add(r)}}
 for(let k=0;k<6;k++){const a=k/6*6.28;g.add(mesh(new THREE.DodecahedronGeometry(.18,0),matStone,Math.cos(a)*.95,.08,Math.sin(a)*.95))}
 const f=makeFire(g,0,.62,0);f.scale.setScalar(1.9);f.children.slice(0,10).forEach(c=>c.visible=false);g.userData.fire=f;return g}
function mqRaft(){const g=new THREE.Group();for(let k=0;k<5;k++)g.add(mesh(new THREE.CylinderGeometry(.08,.08,1.5,5),k%2?matLog:matLog2,(k-2)*.17,.06,0,Math.PI/2,0,0));g.add(mesh(new THREE.CylinderGeometry(.03,.03,.9,4),matDark,.2,.45,.3,.4,0,.2));g.rotation.y=.6;return g}
function mqBoat(){const g=new THREE.Group();rowboat(g,0,0,0);g.scale.set(1.5,1.5,1.9);g.add(mesh(new THREE.CylinderGeometry(.035,.045,1.9,5),matWood,0,1,0));
 const sail=new THREE.Mesh(new THREE.PlaneGeometry(.95,1.05),new THREE.MeshStandardMaterial({color:0xe2d6b8,roughness:1,side:THREE.DoubleSide,flatShading:true}));sail.position.set(0,1.15,.04);g.add(sail);return g}
function mqKop(){const g=new THREE.Group();const L=[[0,.2,0,.55],[.5,.12,.2,.35],[-.45,.12,.25,.33],[.1,.12,-.5,.36],[-.2,.45,-.1,.32],[.25,.42,.1,.28],[0,.7,0,.26]];
 L.forEach(([x,y,z,r])=>g.add(mesh(new THREE.DodecahedronGeometry(r,0),matStone,x,y,z)));const f=makeFire(g,0,.9,0);f.scale.setScalar(1.6);f.children.slice(0,10).forEach(c=>c.visible=false);g.userData.fire=f;return g}
function mqDrop(o){for(let k=fires.length-1;k>=0;k--){let x=fires[k].g;while(x&&x!==o)x=x.parent;if(x)fires.splice(k,1)}mqG.remove(o)}
function mqPut(key,make,t,on){let o=mqO[key];if(!on){if(o)o.visible=false;return null}mqMk();if(!o){o=make();mqO[key]=o;mqG.add(o)}const x=tcx(t[0]),z=tcx(t[1]);o.position.set(x,Hy(x,z),z);o.visible=true;return o}
let mqAns=null;
function mqVis(){if(!S||!S.mq)return;const M=S.mq;
 mqPut('stos',mqStos,M.cape||[0,0],!!M.stos&&!!M.cape);
 mqPut('raft',mqRaft,M.raft||[0,0],!!M.raft&&!M.raftGone);
 const Q=M.q.zachod;const sea=Q&&!Q.done&&S.people.some(p=>p.mqT&&p.mqT.q==='zachod'&&p.mqT.ph==='sea');const b=mqPut('boat',mqBoat,M.boat||[0,0],!!M.boat&&!sea);if(b){const x=tcx(M.boat[0]),z=tcx(M.boat[1]);b.position.y=Math.max(Hy(x,z),.02);b.rotation.y=Math.PI/2}
 const t=M.kop?hiTile():null;mqPut('kop',mqKop,t||[0,0],!!t);mqVisTick()}
function mqVisTick(){if(!S||!S.mq||!mqG)return;const M=S.mq,nk=mqNk(),nt=mqNight();
 const s=mqO.stos;if(s&&s.visible)s.userData.fire.visible=nt&&M.cyOn===nk;
 const k=mqO.kop;if(k&&k.visible)k.userData.fire.visible=nt&&M.kopOn===nk;
 const want=nt&&M.ans===nk&&!!M.cape;if(want&&!mqAns){mqMk();mqAns=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffd7a0,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0,fog:false}));mqAns.scale.set(3,3,1);mqG.add(mqAns)}
 if(mqAns){mqAns.visible=want;if(want){const c=mqXZ(M.cape);mqAns.position.set(c.x-38,1.2,c.z+4)}}}
{const _b=boot;boot=function(fresh){_b(fresh);try{if(mqG){Object.keys(mqO).forEach(k=>{mqDrop(mqO[k]);delete mqO[k]});if(mqAns){mqG.remove(mqAns);mqAns=null}}if(S){mqInit();S.people.forEach(p=>{if(p.mqT&&p.state==='nocleg')p.state='idle'});mqVis()}}catch(e){console.warn(e)}}}
// mruganie światła na morzu: trzy błyski i przerwa, tylko gdy widać
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(mqAns&&mqAns.visible){const t=performance.now()/1000%5;const on=t<2.4&&(t%.8)<.42;mqAns.material.opacity+=((on?.95:0)-mqAns.material.opacity)*Math.min(1,rdt*10)}}}
// ---------- księga zadań: sekcja na górze zakładki Zadania ----------
function mqStepHTML(q,Q,s,i){const cur=i===Q.s&&!Q.done,ok=i<Q.s||Q.done;let h=`<li class="${ok?'y':cur?'c':'n'}"><i>${ok?'✓':cur?'•':'○'}</i><div><b>${mqF(s.t)}</b>`;
 if(cur){const how=mqF(s.how);if(how)h+=`<small>${how}</small>`;
  if(s.k==='cond'){let pr=null;try{pr=s.pr&&s.pr()}catch(e){}if(pr){h+=`<div class="pbar"><div style="width:${Math.round(clamp(pr[0],0,1)*100)}%"></div></div><small class="pt">${pr[1]}</small>`}
   const sh=s.show==='serce'?'serce':s.show?mqF(s.show):null;if(sh)h+=`<div class="mqb"><button data-mqshow="${sh==='serce'?'serce':sh.pid!==undefined?'p'+sh.pid:sh.x.toFixed(1)+','+sh.z.toFixed(1)}">Pokaż</button></div>`}
  else if(s.k==='give'){const c=s.cost;const af=canAfford(c);h+=`<small class="pt">Potrzeba: ${costHave(c)}</small><div class="mqb"><button class="${af?'pri':''}" data-mqgive="${q.id}"${af?'':' disabled'}>${af?s.btn:'Brakuje materiału'}</button>${s.show&&mqF(s.show)?`<button data-mqshow="${mqF(s.show).x.toFixed(1)},${mqF(s.show).z.toFixed(1)}">Pokaż</button>`:''}</div>`}
  else{const st=mqStepSt(q);if(st&&st.on){const p=st.on[0];const pr=mqTripPr(q,st.on);const names=st.on.map(x=>x.name).join(', ');
    h+=`<p class="pt"><b>${names}</b> · ${mqTxt(p)}</p><div class="pbar"><div style="width:${Math.round(pr*100)}%"></div></div><div class="mqb">${p.state==='away'?`<button data-mqshow="${p.mqT.x.toFixed(1)},${p.mqT.z.toFixed(1)}">Pokaż łódź</button>`:`<button data-mqshow="p${p.id}">Pokaż</button><button data-mqfol="${p.id}">Śledź</button>`}</div>`}
   else if(st&&st.why)h+=`<small class="pt no">${st.why}</small>${st.d&&st.d.t?`<div class="mqb"><button data-mqshow="${mqXZ(st.d.t).x.toFixed(1)},${mqXZ(st.d.t).z.toFixed(1)}">Pokaż cel</button></div>`:''}`;
   else if(st){const c=Object.keys(st.c).length?costHTML(st.c):'';h+=`<small class="pt">Cel: ${st.d.what}, ${Math.round(st.dist)} ${krokW(Math.round(st.dist))} od osady. ${st.W.length>1?'Płyną':'Idzie'}: ${st.W.map(p=>p.name).join(', ')}.${c?' Bierze: '+c+'.':''}${st.food?` Jedzenie na drogę: ${st.food}.`:''}</small>
    <div class="mqb"><button class="pri" data-mqgo="${q.id}">${s.k==='sea'?'Wypłyńcie':'Wyślij'}</button><button data-mqshow="${mqXZ(st.d.t).x.toFixed(1)},${mqXZ(st.d.t).z.toFixed(1)}">Pokaż cel</button></div>`}}}
 return h+'</div></li>'}
function mqQHTML(q){const Q=mqQ(q.id);const n=q.st.length;const lock=!Q.op&&!Q.done;
 let h=`<div class="mqq${Q.done?' done':lock?' lock':''}"><div class="mqt"><span>${Q.done?'✓':lock?'◌':Q.s+'/'+n}</span><b>${q.n}</b></div>`;
 if(lock)return h+`<p class="mut">${q.lock||'Zacznie się później.'}</p></div>`;
 if(Q.skip)return h+`<p class="mut">Zaliczone wcześniej.</p></div>`;
 h+=`<p class="mqi">${mqF(q.intro)}</p><ol>${q.st.map((s,i)=>mqStepHTML(q,Q,s,i)).join('')}</ol>`;return h+'</div>'}
function mqActHTML(ep){let A=null,done=()=>false,nm='';
 if(ep===1&&!S.actDone&&S.act&&ACTS[S.act]){A=ACTS[S.act];done=i=>!!S.agoals[S.act+'_'+i];nm='Akt '+['','I','II','III','IV','V'][S.act]+' · '+A.n}
 else if(ep===2&&S.e2&&typeof e2Act==='function'){A=e2Act();if(A){done=i=>!!S.e2.g[S.e2.a+'_'+i];nm=`Akt ${E2RN[S.e2.a]} · ${A.n}`}}
 else if(ep===3&&S.e3&&!S.e3.done){A=E3A[S.e3.a];if(A){done=i=>!!S.e3.g[S.e3.a+'_'+i];nm=`Akt ${E3RN[S.e3.a]} · ${A.n}`}}
 if(!A)return'';return`<h4>Cele aktu</h4><p class="mut" style="margin:0 0 4px">${nm}</p><ul class="mqa">${A.g.map((g,i)=>`<li class="${done(i)?'y':''}"><i>${done(i)?'✓':'○'}</i><span>${g[0]}</span></li>`).join('')}</ul>`}
function mqJHTML(){const ep=mqEp();const L=mqEpQ(ep);const dn=L.filter(q=>mqDone(q.id)).length;
 let h=`<div class="mqhd"><div class="eyebrow">Zadania główne · Epoka ${['','I','II','III','IV'][ep]}</div><h2>${MQ_EP[ep]}</h2>
  <p class="mut">${L.length?`Wykonane: ${dn} z ${L.length}. `:''}${ep<3?'Osada przejdzie do następnej epoki, gdy wykona wszystkie zadania główne i cele aktów.':ep===3?'Wyspa będzie nasza, gdy wykonacie wszystkie zadania główne i cele aktów.':'Epoka rodów i folwarków. Jej zadania główne przyjdą w kolejnej wersji.'}</p></div>`;
 h+=L.slice().sort((a,b)=>{const r=q=>mqDone(q.id)?2:mqQ(q.id).op?0:1;return r(a)-r(b)}).map(mqQHTML).join('');h+=mqActHTML(ep);
 const prev=MQ.filter(q=>q.ep<ep&&mqDone(q.id)&&!mqQ(q.id).skip);if(prev.length)h+=`<details class="mqp"><summary>Wcześniejsze epoki</summary>${prev.map(q=>`<p class="mut">✓ ${q.n}</p>`).join('')}</details>`;
 return h+'<h3 class="mqsep">Bieżące zadania osady</h3>'}
function mqJRender(){try{if(S&&!$('sheet').hidden&&tab==='zadania')renderPanel()}catch(e){}}
function mqJOpen(){if(!S)return;mqInit();S.mq.newQ=0;openSheet('zadania');const b=$('body');if(b)b.scrollTop=0}
function mqJClose(){}
{const _tr=taskRender;taskRender=function(){_tr();try{if(!S||!S.mq)return;const body=$('body');let sec=body.querySelector('#mqsec');if(!sec){sec=document.createElement('section');sec.id='mqsec';body.insertBefore(sec,body.firstChild)}
  const h=mqJHTML();if(sec._h!==h){sec._h=h;sec.innerHTML=h}}catch(e){console.warn(e)}}}
document.addEventListener('click',ev=>{const t=ev.target.closest('[data-mqgo],[data-mqgive],[data-mqshow],[data-mqfol]');if(!t||!S)return;ev.stopPropagation();
 if(t.dataset.mqgo){mqStart(t.dataset.mqgo);mqJRender();return}
 if(t.dataset.mqgive){const q=MQI[t.dataset.mqgive],Q=mqQ(q.id),s=q.st[Q.s];if(!s||s.k!=='give'||!canAfford(s.cost))return;Object.entries(s.cost).forEach(([k,v])=>S.res[k]-=v);try{s.give()}catch(e){console.warn(e)}mqStepDone(q.id,Q.s);mqJRender();return}
 const v=t.dataset.mqshow||t.dataset.mqfol;try{closeSheet()}catch(e){}
 if(t.dataset.mqfol){const p=pById(+v);if(p){lookAt(p.x,p.z,Math.max(zoomT,1.6));select(p.id);follow=true}return}
 if(v==='serce'){scShow();return}if(v[0]==='p'){const p=pById(+v.slice(1));if(p){lookAt(p.x,p.z,Math.max(zoomT,1.6));select(p.id)}return}
 const[x,z]=v.split(',').map(Number);lookAt(x,z,Math.max(zoomT,1.3))},true);
// kafelek celu: dotknięcie otwiera księgę zadań, ikonka zwija
{const cg=$('cz-goal');if(cg){cg.addEventListener('click',()=>{if(S)mqJOpen()});const st=document.createElement('style');st.textContent='#cz-goal.on{pointer-events:auto;cursor:pointer}';document.head.appendChild(st)}}
{const g=$('goal');g.addEventListener('click',ev=>{if(ev.target&&ev.target.closest&&ev.target.closest('svg'))return;ev.stopImmediatePropagation();mqJOpen()},true)}
{const _rt=renderTop;renderTop=function(){_rt();try{if(!S||!S.mq)return;const gl=$('goal');const ep=mqEp(),L=mqEpQ(ep),dn=L.filter(q=>mqDone(q.id)).length;const tx=`Zadania główne ${dn}/${L.length}`;
  let r=gl.querySelector('.mqr');if(!r){r=document.createElement('div');r.className='mqr';gl.appendChild(r)}const nw=!!S.mq.newQ;if(r._t!==tx+nw){r._t=tx+nw;r.innerHTML=`<span>${tx}</span><em>${nw?'nowe ':''}›</em>`;r.classList.toggle('nw',nw)}}catch(e){}}}
// w podsumowaniu osady
{const _th=troubleHTML;troubleHTML=function(){let h=_th();if(!S||!S.mq||czOn)return h;const ep=mqEp(),L=mqEpQ(ep);const c=mqCur(ep);
  return`<div class="card mqcard"><h4>Zadania główne · ${MQ_EP[ep]}</h4><p class="mut">${L.map(q=>`${mqDone(q.id)?'✓':'○'} ${q.n}`).join(' · ')}</p>${c&&!c.lock?`<p style="margin:4px 0">Teraz: <b>${c.q.n}</b> — ${mqF(c.s.t).toLowerCase()}</p>`:''}<button data-mqopen="1">Księga zadań</button></div>`+h}}
document.addEventListener('click',ev=>{const t=ev.target.closest('[data-mqopen]');if(!t)return;ev.stopPropagation();mqJOpen()},true);
{const st=document.createElement('style');st.textContent=`#mqsec{margin-bottom:6px}#mqsec .eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}#mqsec h2{font-family:var(--serif);font-size:22px;margin:2px 0 4px;color:var(--hi)}#mqsec h4{margin:14px 0 2px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}.mqsep{margin:16px 0 6px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold)}
.mqq{margin:10px 0;padding:10px 12px;border:1px solid #c9a66b33;border-radius:10px;background:#ffffff06}.mqq.done{border-color:#a8d09044;opacity:.8}.mqq.lock{opacity:.65}
.mqt{display:flex;gap:9px;align-items:baseline}.mqt span{flex:none;min-width:26px;font-size:12px;color:var(--gold);font-variant-numeric:tabular-nums}.mqq.done .mqt span{color:#a8d090}.mqt b{font-family:var(--serif);font-size:17px;color:var(--hi)}
.mqi{font-style:italic;color:#c9c4b2;font-size:13.5px;line-height:1.4;margin:5px 0 6px}.mqq.done .mqi{display:none}
.mqq ol{list-style:none;margin:0;padding:0}.mqq li{display:flex;gap:8px;margin:6px 0 0;font-size:13.5px}.mqq li>i{flex:none;width:14px;font-style:normal;color:var(--mut)}.mqq li.y>i{color:#a8d090}.mqq li.c>i{color:var(--gold)}
.mqq li>div{flex:1;min-width:0}.mqq li b{font-weight:600;color:#e6e0cc}.mqq li.y b{color:#9fa898;font-weight:400}.mqq li.n b{color:var(--mut);font-weight:400}.mqq li small{display:block;color:#a8a290;font-size:12.5px;line-height:1.35;margin-top:2px}
.mqq .pt{margin:4px 0 0}.mqq .no{color:#f0b8a8}.mqq .pbar{margin-top:5px}.mqb{display:flex;gap:6px;margin-top:7px;flex-wrap:wrap}.mqb button{flex:1;min-height:38px;min-width:96px}
.mqa{list-style:none;margin:0;padding:0}.mqa li{display:flex;gap:8px;font-size:13.5px;margin:4px 0}.mqa i{font-style:normal;width:14px;flex:none;color:var(--mut)}.mqa li.y{color:#9fa898}.mqa li.y i{color:#a8d090}
.mqp{margin-top:12px}.mqp summary{cursor:pointer;color:var(--gold);font-size:13px}
#goal .mqr{display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:5px;border-top:1px solid #c9a66b2a;font-size:11.5px;color:var(--mut);letter-spacing:.04em}#goal .mqr em{font-style:normal;color:var(--gold)}#goal .mqr.nw em{color:#ffd28a}
#goal.min .mqr{margin-top:4px;padding-top:3px}.mqcard button{margin-top:6px}`;document.head.appendChild(st)}
window.__mq={MQ,MQI,mqTick,mqStart,mqStepDone,mqEpDone,mqDone,mqQ,mqCape,mqJOpen,mqJClose,mqJHTML,mqVis,mqGuest,mqStepSt,mqInit};
