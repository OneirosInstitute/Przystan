
/* ================= wydarzenia z wyborami ================= */
const alive=n=>S.people.find(p=>p.name===n);
const pickP=f=>{const a=S.people.filter(f);return a.length?a[(Math.random()*a.length)|0]:null};
const adultsN=()=>S.people.filter(isAdult);
function spawnGroup(n,txt){const fid=S.fid++;S.fams[fid]={id:fid,home:null};const names=[];
 for(let q=0;q<n;q++){const sex=q===0?'m':q===1?'k':(Math.random()<.5?'k':'m');const age=q<2?20+Math.random()*18:3+Math.random()*9;const cr=Object.keys(CN)[(Math.random()*Object.keys(CN).length)|0];
  const p=newPerson(S.pid++,newName(sex),age,sex,fid,{[cr]:1+((Math.random()*2)|0)},TKEYS[(Math.random()*TKEYS.length)|0]);p.x=tcx(wreck.stand[0])+q*.5;p.z=tcx(wreck.stand[1]);p.tool={t:0,d:0};p.hp=.6;S.people.push(p);addPersonMesh(p);names.push(p.name)}
 const ps=S.people.slice(-n);if(n>=2){ps[0].pair=ps[1].id;ps[1].pair=ps[0].id}assign();assignHomes();return names}
const LOGBOOK=[
 'Dzień czwarty po wypłynięciu. Za rufą wciąż widać łunę nad miastem. Nikt nie pyta, czy wrócimy.',
 'Kapitan każe trzymać kurs na zachód, choć mapa kończy się dwa dni drogi stąd. Mówi, że starzy wiedzą, dokąd płyniemy.',
 'Lubomir i Wszebora rozmawiali w nocy z kapitanem. Słyszałem nazwę wyspy, której nie ma na żadnej mapie.',
 'Ostatni wpis, pisany drżącą ręką: „Jeśli ktoś to czyta, to dopłynęliśmy. Nie szukajcie drogi powrotnej.”'];
const EVENTS=[
 {id:'klotnia',w:3,cd:30,cond:()=>adultsN().length>=8,t:'Kłótnia o racje',
  text:c=>`${c.a.name} twierdzi przy ognisku, że ${c.b.name} bierze więcej jedzenia niż inni. Robi się głośno, a dzieci chowają się za dorosłych.`,
  ctx:()=>{const a=pickP(isAdult),b=pickP(p=>isAdult(p)&&p!==a);return a&&b?{a,b}:null},
  opts:[{n:'Równe racje dla wszystkich',d:'spokój w osadzie',f:c=>{S.hope=clamp(S.hope+.05,0,1);return'Racje są równe. Nikt nie jest zadowolony do końca, ale kłótnia gaśnie.'}},
   {n:'Więcej dla tych, którzy ciężko pracują',d:'szybsza praca przez kilka dób, ale żal',f:c=>{S.buff={k:'praca',until:S.day+3};S.hope=clamp(S.hope-.04,0,1);return'Ludzie pracują ciężej, żeby zasłużyć na więcej. Ale żal zostaje.'}},
   {n:'Niech rozsądzi najstarszy',d:'zależy, kto jest najstarszy',f:c=>{const o=S.people.filter(isAdult).sort((a,b)=>b.age-a.age)[0];S.hope=clamp(S.hope+(o&&o.age>55?.08:.02),0,1);return o?`${o.name} wysłuchuje obu stron i każe im razem iść po wodę. Wieczorem siedzą przy jednym ogniu.`:'Nie ma komu rozsądzić.'}}]},
 {id:'owoc',w:3,cd:40,cond:()=>seasonIdx()<=1&&S.bld.some(b=>b.kind==='zbieracz'&&bDone(b)),t:'Nieznany owoc',
  text:c=>`Zbieracze przynoszą kosz ciemnoczerwonych owoców, których nikt nie zna. Pachną słodko. ${c.p.name} już sięga po jeden.`,
  ctx:()=>{const p=pickP(isAdult);return p?{p}:null},
  opts:[{n:'Spróbować ostrożnie',d:'nowe jedzenie albo choroba',f:c=>{if(Math.random()<.6){S.res.jagody+=40;S.seen.owoc=1;return'Owoce są dobre. Zbieracze wiedzą już, gdzie ich szukać.'}c.p.hp=Math.max(.15,c.p.hp-.45);return`${c.p.name} wymiotuje przez całą noc. Owoce lądują w ogniu.`}},
   {n:'Najpierw sprawdzić na zwierzęciu',d:'potrzebna oswojona koza',f:c=>{const pen=S.bld.find(b=>b.kind==='zagroda'&&(b.animals||0)>0);if(pen){S.res.jagody+=30;return'Koza zjada owoce i ma się dobrze. Można je zbierać.'}return'Nie ma na czym sprawdzić. Owoce gniją w koszu.'}},
   {n:'Wyrzucić',d:'bez ryzyka',f:()=>'Lepiej nie ryzykować. Owoce zostają w lesie.'}]},
 {id:'wilk',w:3,cd:35,cond:()=>S.day>6&&S.herds.some(h=>h.type==='wilk'&&Math.hypot(h.x-tcx(camp.i),h.z-tcx(camp.j))<60),t:'Ślady wilka przy obozie',
  text:()=>'Rano przy spiżarni widać świeże tropy. Duże, cztery palce, ślady pazurów. W nocy ktoś słyszał wycie od strony lasu.',
  opts:[{n:'Wystawić nocne warty',d:'bezpieczniej, ale ludzie zmęczeni',f:()=>{S.buff={k:'zmeczenie',until:S.day+3};S.hope=clamp(S.hope+.03,0,1);return'Dorośli pilnują na zmianę. Wilki krążą, ale nie podchodzą.'}},
   {n:'Rozpalić więcej ognisk',d:'kosztuje 15 opału',f:()=>{if(S.res.opal<15)return'Nie ma czym palić. Noc mija w strachu.';S.res.opal-=15;S.herds.forEach(h=>{if(h.type==='wilk'){h.tx=clamp(h.x+(h.x-tcx(camp.i))*.6,-N/2+3,N/2-3);h.tz=clamp(h.z+(h.z-tcx(camp.j))*.6,-N/2+3,N/2-3)}});return'Ogień płonie do świtu. Wilki odchodzą w głąb wyspy.'}},
   {n:'Nic nie robić',d:'ryzyko',f:()=>{const pen=S.bld.find(b=>b.kind==='zagroda'&&(b.animals||0)>0);if(pen&&Math.random()<.5){pen.animals--;return'Nad ranem w zagrodzie brakuje kozy.'}S.hope=clamp(S.hope-.05,0,1);return'Nic się nie dzieje, ale dzieci boją się wychodzić po zmroku.'}}]},
 {id:'lodz',w:2,cd:80,cond:()=>seasonIdx()===0&&S.day>8,t:'Łódź u brzegu',
  text:c=>`Morze przyniosło szalupę. W środku ${c.n} wycieńczonych ludzi z innego statku. Proszą o wodę i dach nad głową.`,
  ctx:()=>({n:2+((Math.random()*3)|0)}),
  opts:[{n:'Przyjąć ich do osady',d:'więcej rąk i więcej ust',f:c=>{const names=spawnGroup(c.n);S.hope=clamp(S.hope+.03,0,1);return`Do osady dołączają: ${names.join(', ')}. Trzeba im znaleźć miejsce do spania.`}},
   {n:'Nakarmić i pomóc odpłynąć',d:'kosztuje 30 jedzenia',f:()=>{FOOD.forEach(k=>{S.res[k]=Math.max(0,S.res[k]-30*(S.res[k]/(foodTotal()||1)))});return'Dostają jedzenie i wodę na drogę. Odpływają wzdłuż brzegu.'}},
   {n:'Odmówić',d:'osada to zapamięta',f:()=>{S.hope=clamp(S.hope-.08,0,1);return'Szalupa odpływa. Przez kilka dni nikt o tym nie mówi.'}}]},
 {id:'dziennik',w:4,cd:20,cond:()=>(S.logbook||0)<LOGBOOK.length&&S.day>3+(S.logbook||0)*9,t:'Dziennik okrętowy',
  text:()=>`${(S.people.find(p=>p.trait==='Dociekliwy'&&isAdult(p))||S.people[0]).name} czyta przy ognisku kolejną stronę dziennika kapitana:\n\n„${LOGBOOK[S.logbook||0]}”`,
  opts:[{n:'Czytać dalej na głos',d:'wspólna pamięć',f:()=>{S.logbook=(S.logbook||0)+1;S.hope=clamp(S.hope+.03,0,1);log('Z dziennika kapitana: „'+LOGBOOK[S.logbook-1]+'”');return'Wszyscy słuchają w milczeniu. Ktoś dorzuca drewna do ognia.'}},
   {n:'Zamknąć dziennik na dziś',d:'',f:()=>{S.logbook=(S.logbook||0)+1;log('Z dziennika kapitana: „'+LOGBOOK[S.logbook-1]+'”');return'Strona zostaje przeczytana po cichu. Starsi długo patrzą w ogień.'}}]},
 {id:'goraczka',w:2,cd:45,cond:()=>S.people.length>6&&S.day>5,t:'Gorączka',
  text:c=>`${c.p.name} ma wysoką gorączkę i dreszcze. Nikt nie wie, czy to od wody, czy od zimna.`,
  ctx:()=>{const p=pickP(p=>p.age>2);return p?{p}:null},
  opts:[{n:'Odosobnić chorego',d:'bezpieczniej dla innych',f:c=>{c.p.hp=Math.max(.25,c.p.hp-.25);return`${c.p.name} leży w osobnym szałasie. Choroba nie przechodzi na innych.`}},
   {n:'Napar z ziół',d:'ktoś musi znać zioła',f:c=>{const h=S.people.find(p=>(p.sk.zbieracz>=3||tech('u_ziel'))&&isAdult(p));if(h&&(tech('u_ziel')||S.res.ziola>=1||p_rnd()<.6)){S.res.ziola=Math.max(0,S.res.ziola-1);c.p.hp=Math.min(1,c.p.hp+.1);return`${h.name} parzy gorzki napar z kory. Do rana gorączka spada.`}c.p.hp=Math.max(.2,c.p.hp-.3);return'Nikt nie zna się na ziołach. Napar nic nie pomaga.'}},
   {n:'Czekać',d:'może przejdzie samo',f:c=>{if(Math.random()<.5){S.people.filter(p=>p!==c.p&&Math.random()<.25).forEach(p=>p.hp=Math.max(.3,p.hp-.2));c.p.hp=Math.max(.2,c.p.hp-.3);return'Gorączka przechodzi na kilka kolejnych osób.'}return`Po trzech dniach ${c.p.name} wstaje o własnych siłach.`}}]},
 {id:'termin',w:3,cd:40,cond:()=>!!termCtx(),t:'Prośba o naukę',
  text:c=>`${c.k.name} (${Math.floor(c.k.age)} l.) od tygodni przygląda się pracy mistrza. Mistrz to ${c.m.name}, fach: ${CN[c.c]}. Dziecko prosi, żeby mogło się uczyć.`,
  ctx:()=>termCtx(),
  opts:[{n:'Zgoda, niech terminuje',d:'szybka nauka fachu',f:c=>{c.k.xp[c.c]+=LVL[0]+40;if(c.k.sk[c.c]<1)c.k.sk[c.c]=1;S.hope=clamp(S.hope+.02,0,1);log(c.k.name+' zaczyna terminować. Mistrz: '+c.m.name+'.');return`${c.m.name} pokazuje pierwsze chwyty. ${c.k.name} ma już podstawy fachu.`}},
   {n:'Jeszcze nie, niech pomaga rodzinie',d:'',f:c=>{S.hope=clamp(S.hope+.01,0,1);return`${c.k.name} wraca do rodziny, ale wieczorami wciąż przygląda się pracy mistrza.`}}]},
 {id:'posztormie',w:3,cd:25,cond:()=>S.lastStorm&&S.day-S.lastStorm<2,t:'Po sztormie',
  text:()=>'Sztorm ucichł. Na plaży leżą powyrywane drzewa, wodorosty i śnięte ryby. Morze wyrzuciło też coś ciemnego przy wraku.',
  opts:[{n:'Zebrać ryby i drewno',d:'ryby i kłody',f:()=>{S.res.ryby+=35;S.res.drewno+=15;return'Do wieczora na stosie leży 15 kłód, a w koszach 35 porcji ryb.'}},
   {n:'Sprawdzić, co leży przy wraku',d:'coś z ładunku',f:()=>{if(S.wreck.gone){S.res.deski+=8;return'Wraku już nie ma, ale fale wyrzuciły kilka desek.'}const r=['narz','gwozdzie','deski','plotno'][(Math.random()*4)|0];const q={narz:2,gwozdzie:30,deski:12,plotno:3}[r];S.res[r]+=q;return`Fale wyrwały z wraku skrzynię: ${RN[r].toLowerCase()} ${q}.`}},
   {n:'Dać ludziom odpocząć',d:'nadzieja',f:()=>{S.hope=clamp(S.hope+.05,0,1);return'Ludzie śpią do południa. Po burzy wszyscy potrzebowali ciszy.'}}]},
 {id:'jaskinia',w:2,cd:999,once:1,cond:()=>S.day>10&&tribe.some(t=>!S.found.includes(t.k)),t:'Dzieci i jaskinia',
  text:()=>'Dzieci wracają podekscytowane: za wzgórzem widziały otwór w skale, a w nim coś jak kamienne groty. Opisują to bardzo dokładnie.',
  opts:[{n:'Wysłać tam kogoś',d:'odsłania kawałek wyspy',f:()=>{const t=tribe.filter(t=>!S.found.includes(t.k)).sort((a,b)=>Math.hypot(a.i-camp.i,a.j-camp.j)-Math.hypot(b.i-camp.i,b.j-camp.j))[0];reveal(t.i,t.j,7);return'Zwiadowca idzie wskazaną drogą i znajduje to, o czym mówiły dzieci.'}},
   {n:'Zabronić dzieciom chodzić tak daleko',d:'',f:()=>'Dzieci obiecują, że nie pójdą. Pewnie pójdą.'}]},
 {id:'swieto',w:2,cd:60,cond:()=>foodTotal()>350&&S.day>15,t:'Święto',
  text:()=>'Spiżarnia jest pełna, a wieczór ciepły. Ktoś proponuje, żeby po raz pierwszy od katastrofy zrobić prawdziwą ucztę.',
  opts:[{n:'Wyprawić ucztę',d:'kosztuje 60 jedzenia',f:()=>{FOOD.forEach(k=>{S.res[k]=Math.max(0,S.res[k]-60*(S.res[k]/(foodTotal()||1)))});S.hope=clamp(S.hope+.14,0,1);return'Śpiew niesie się nad zatoką do późnej nocy. Pierwszy raz ktoś się śmieje.'}},
   {n:'Skromna kolacja przy ognisku',d:'',f:()=>{S.hope=clamp(S.hope+.04,0,1);return'Zjadają trochę więcej niż zwykle i opowiadają o dawnym życiu.'}}]},
 {id:'mistrz',w:2,cd:80,cond:()=>!!masterCtx(),t:'Stary mistrz',
  text:c=>`${c.m.name} coraz częściej siada w czasie pracy. Mówi, że ręce już nie te, i pyta, komu przekazać fach: ${CN[c.c]}.`,
  ctx:()=>masterCtx(),
  opts:[{n:'Przydzielić mu ucznia na stałe',d:'wiedza przetrwa',f:c=>{const u=S.people.filter(p=>p!==c.m&&p.age>=12&&p.age<35).sort((a,b)=>b.sk[c.c]-a.sk[c.c])[0];if(!u)return'Nie ma nikogo młodego, kto mógłby się uczyć.';u.xp[c.c]+=300;while(u.sk[c.c]<5&&u.xp[c.c]>=LVL[u.sk[c.c]])u.sk[c.c]++;log(c.m.name+' przekazuje fach ('+CN[c.c]+') uczniowi: '+u.name+'.');return`${u.name} przez wiele dni pracuje ramię w ramię z mistrzem. Teraz ${CN[c.c]} ${u.sk[c.c]}.`}},
   {n:'Spisać jego wiedzę w Księdze osady',d:'trwałe ulepszenie fachu',f:c=>{S.bonus[c.c]=(S.bonus[c.c]||0)+.05;log('Księga osady: spisano wiedzę '+c.m.name+' o fachu '+CN[c.c]+'.');return'Wieczorami ktoś zapisuje to, co mówi mistrz. Wiedza zostanie, nawet gdy jego zabraknie.'}}]},
 {id:'swiatla',w:1,cd:999,once:1,cond:()=>S.day>14,t:'Błędne ogniki',
  text:()=>'W nocy nad mokradłem pojawiają się blade, chwiejne światełka. Starsze kobiety mówią, że to błędne ogniki: dusze, które wodzą ludzi w topiel.',
  opts:[{n:'Iść i sprawdzić',d:'odwaga albo wstyd',f:()=>{S.hope=clamp(S.hope+.03,0,1);log('Światła nad bagnem okazały się gazem z gnijących liści. Lubomir mówi, że widywał takie w dzieciństwie, nad bagnami za wsią.');return'To gaz z gnijących liści. Płonie sam z siebie. Wracają, śmiejąc się z własnego strachu.'}},
   {n:'Trzymać się z daleka',d:'',f:()=>{S.hope=clamp(S.hope-.02,0,1);return'Nikt nie zbliża się do bagna. Dzieci wymyślają o nim historie.'}}]}
];
function termCtx(){const k=S.people.find(p=>p.age>=9&&p.age<15&&!S.seen['term'+p.id]);if(!k)return null;const m=S.people.filter(p=>isAdult(p)&&p.age>25).map(p=>{const c=Object.keys(CN).sort((a,b)=>p.sk[b]-p.sk[a])[0];return{m:p,c,l:p.sk[c]}}).filter(x=>x.l>=3).sort((a,b)=>b.l-a.l)[0];if(!m)return null;S.seen['term'+k.id]=1;return{k,m:m.m,c:m.c}}
function masterCtx(){for(const m of S.people){if(m.age<58||S.seen['mistrz'+m.id])continue;const c=Object.keys(CN).find(c=>m.sk[c]>=3&&!S.people.some(q=>q!==m&&q.sk[c]>=m.sk[c]-1));if(c){S.seen['mistrz'+m.id]=1;return{m,c}}}return null}
let evOpen=null;
function storyTick(){if(evOpen||placing||!S.people.length)return;if(S.evT===undefined)S.evT=S.day+1.2;if(S.day<S.evT||!isWork())return;
 S.evT=S.day+1.3+Math.random()*1.8;S.evCd=S.evCd||{};
 const pool=EVENTS.filter(e=>(S.evCd[e.id]||0)<=S.day&&!(e.once&&S.seen['ev'+e.id])&&e.cond());if(!pool.length)return;
 let tot=pool.reduce((a,e)=>a+e.w,0),x=Math.random()*tot,ev=pool[0];for(const e of pool){if(x<e.w){ev=e;break}x-=e.w}
 const ctx=ev.ctx?ev.ctx():{};if(ev.ctx&&!ctx)return;
 S.evCd[ev.id]=S.day+ev.cd/K;if(ev.once)S.seen['ev'+ev.id]=1;openEvent(ev,ctx)}
function openEvent(ev,ctx){evOpen={ev,ctx,prev:S.speed};setSpeed(0);const el=$('ev');
 el.innerHTML=`<div class="box"><div class="eyebrow">${ev.ey||'Wydarzenie'}</div><h2>${ev.t}</h2><p>${ev.text(ctx).replace(/\n\n/g,'</p><p>')}</p><div class="opts">${ev.opts.map((o,i)=>`<button data-o="${i}"><b>${o.n}</b>${o.d?`<small>${o.d}</small>`:''}</button>`).join('')}</div></div>`;el.hidden=false;sfx('bell')}
$('ev').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!evOpen)return;
 if(b.dataset.o!==undefined){const o=evOpen.ev.opts[+b.dataset.o];const r=o.f(evOpen.ctx)||'';log(evOpen.ev.t+': '+o.n.toLowerCase()+'. '+r);
  $('ev').querySelector('.box').innerHTML=`<div class="eyebrow">${evOpen.ev.ey||'Wydarzenie'}</div><h2>${evOpen.ev.t}</h2><p>${r}</p><div class="opts"><button data-close="1" class="pri"><b>Dalej</b></button></div>`}
 else if(b.dataset.close){$('ev').hidden=true;setSpeed(evOpen.prev||1);evOpen=null;renderPanel()}});

/* ================= cele osady ================= */
const GOALS=[
 ['Postaw chatę zbieracza',()=>S.bld.some(b=>b.kind==='zbieracz'&&bDone(b))],
 ['Postaw chatę drwala',()=>S.bld.some(b=>b.kind==='drwal'&&bDone(b))],
 ['Rozpoznaj kajutę kapitana na wraku',()=>S.wreck.parts[2].open],
 ['Każda rodzina pod własnym dachem',()=>S.people.length&&S.people.every(p=>homeOf(p))],
 ['Postaw drewutnię i zgromadź 80 opału',()=>S.res.opal>=80&&S.bld.some(b=>b.kind==='drewutnia'&&bDone(b))],
 ['Przetrwaj pierwszą zimę',()=>S.day>=YEAR*.75&&S.people.length>0],
 ['Przeczytaj księgę z wraku',()=>S.books.kowal===2||S.books.siew===2],
 ['Oswój pierwszą kozę',()=>S.bld.some(b=>(b.animals||0)>0)],
 ['Zbierz pierwsze plony z pola',()=>!!S.seen.harvest],
 ['Wytop żelazo',()=>S.know.kuznia==='tak'],
 ['Odkryj trzy ślady dawnego ludu',()=>S.found.length>=3],
 ['Osada: 4 domy i 20 osób',()=>S.tier>=1],
 ['Wieś: 8 domów i 32 osoby',()=>S.tier>=2],
 ['Pierwsze dziecko urodzone na wyspie dorasta do pracy',()=>S.people.some(p=>p.born&&p.age>=12)]];
function goalsTick(){S.goals=S.goals||{};GOALS.forEach((g,i)=>{if(!S.goals[i]&&g[1]()){S.goals[i]=1;S.hope=clamp(S.hope+.04,0,1);log('Cel osiągnięty: '+g[0].toLowerCase()+'.');toast('Cel osiągnięty: '+g[0]);sfx('bell')}})}
const GHINT=['Budowa → Chata zbieracza. Najlepiej przy krzewach jagód i grzybach.','Drwal ścina drzewa w swoim zasięgu. Leśnik sadzi nowe.','Praca → Wrak. Wolni robotnicy rozpoznają wskazaną część.','Szałasy i chaty. Dzieci rodzą się tylko pod własnym dachem.','Drewutnia rąbie kłody na opał. Zimą domy palą codziennie.','Jedzenie, opał i odzież, zanim spadnie śnieg.','Gdy księga trafi do obozu, przydziel czytelników w zakładce Praca.','Najpierw Oswajanie kóz (Wiedza → Hodowla). Potem zagroda i hodowca przy stadzie.','Pole wymaga wiedzy o siewie i ziarna. Siej w porze siewu.','Ruda, mielerz i kuźnia. Najpierw trzeba przeczytać księgę kowalską.','Zwiadowcy odsłaniają wyspę. Ślady leżą w głębi lądu.','Więcej domów i rodzin. Osada rośnie sama, jeśli jest bezpieczna.','Wieś potrzebuje pól, stad i rzemiosła.','Dzieci uczą się od dorosłych. Wiedza przechodzi z pokolenia na pokolenie.'];
const CHAP=[[0,'Rozdział I · Rozbitkowie'],[4,'Rozdział II · Pierwsza zima'],[7,'Rozdział III · Gospodarze'],[11,'Rozdział IV · Pokolenia']];
function goalInfo(){S.goals=S.goals||{};const i=GOALS.findIndex((g,i)=>!S.goals[i]);if(i<0)return null;let ch=CHAP[0][1];CHAP.forEach(c=>{if(i>=c[0])ch=c[1]});return{t:GOALS[i][0],d:GHINT[i]||'',ch,n:i}}
function p_rnd(){return Math.random()}
function nextGoal(){S.goals=S.goals||{};const i=GOALS.findIndex((g,i)=>!S.goals[i]);return i<0?null:GOALS[i][0]}

/* ================= dźwięk ================= */
let AUD=null,amb=null,muted=false;try{muted=localStorage.getItem('przystan-mute')==='1'}catch(e){}
function audioStart(){if(AUD||muted)return;try{AUD=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 const len=AUD.sampleRate*4,buf=AUD.createBuffer(1,len,AUD.sampleRate),d=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5}
 const mk=(f,q,g)=>{const s=AUD.createBufferSource();s.buffer=buf;s.loop=true;const fl=AUD.createBiquadFilter();fl.type='lowpass';fl.frequency.value=f;fl.Q.value=q;const gn=AUD.createGain();gn.gain.value=g;s.connect(fl);fl.connect(gn);gn.connect(AUD.destination);s.start(0,Math.random()*3);return{fl,gn}};
 amb={sea:mk(420,.4,.0),wind:mk(900,.8,0),master:1};}
function sfx(k){if(!AUD||muted)return;const t=AUD.currentTime;
 if(k==='bell'){const o=AUD.createOscillator(),g=AUD.createGain();o.type='sine';o.frequency.value=660;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+1.4);o.connect(g);g.connect(AUD.destination);o.start(t);o.stop(t+1.5)}
 else if(k==='bird'){const o=AUD.createOscillator(),g=AUD.createGain();o.type='sine';const f=2200+Math.random()*1800;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*(.7+Math.random()*.6),t+.12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.025,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(AUD.destination);o.start(t);o.stop(t+.2)}
 else if(k==='crack'){const o=AUD.createBufferSource();const b=AUD.createBuffer(1,800,AUD.sampleRate),d=b.getChannelData(0);for(let i=0;i<800;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/800,3);o.buffer=b;const g=AUD.createGain();g.gain.value=.05;o.connect(g);g.connect(AUD.destination);o.start(t)}
 else if(k==='cricket'){const o=AUD.createOscillator(),g=AUD.createGain();o.type='square';o.frequency.value=4300;for(let i=0;i<3;i++){g.gain.setValueAtTime(.006,t+i*.07);g.gain.setValueAtTime(0,t+i*.07+.035)}o.connect(g);g.connect(AUD.destination);o.start(t);o.stop(t+.25)}}
let sndT=0;
function soundTick(rdt,Lt){if(!AUD||muted||!amb)return;slavSound(rdt,Lt);const k=S.weather.k;const near=1/Math.max(.6,zoom);
 const sea=(.05+.04*Math.sin(clock*.35)+.02*Math.sin(clock*.9))*(1+1.6*Math.max(0,WX.wind-.35));amb.sea.gn.gain.setTargetAtTime(sea*(.6+.4*near),AUD.currentTime,.3);
 const gust=.75+.25*Math.sin(clock*.7)*Math.sin(clock*.23+1),wind=(.012+.13*WX.wind*WX.wind*gust)+.01*Math.sin(clock*.2);amb.wind.gn.gain.setTargetAtTime(wind,AUD.currentTime,.5);amb.wind.fl.frequency.setTargetAtTime(600+500*Math.sin(clock*.3)+700*WX.wind*gust,AUD.currentTime,.5);wxSound();
 sndT-=rdt;if(sndT<=0){sndT=.4+Math.random()*1.4;if(Lt.day>.5&&WX.rain<.15&&WX.wind<.7&&WX.snow<.3&&Math.random()<.45)sfx('bird');else if(Lt.night>.6&&seasonIdx()!==2&&Math.random()<.5)sfx('cricket');else if(Lt.night>.4&&Math.random()<.4)sfx('crack')}}
function toggleMute(){muted=!muted;try{localStorage.setItem('przystan-mute',muted?'1':'0')}catch(e){}if(muted&&AUD){AUD.close();AUD=null;amb=null}else if(!muted)audioStart();toast(muted?'Dźwięk wyłączony':'Dźwięk włączony');renderCtl()}
