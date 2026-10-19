
/* ================= 0.18: akty epoki I, sceny, wiec pokoleń, Księga rozbitków, trudność, Rok na wyspie ================= */
// ---- trudność ----
let DIFF_SEL=1;try{const d=localStorage.getItem('przystan-diff');if(d==='0'||d==='1'||d==='2')DIFF_SEL=+d}catch(e){}
function osb(n){return n===1?'osoba':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'osoby':'osób'}
const DIFF_N=['Łagodny','Zwykły','Surowy'];
function dM(){return[.7,1,1.3][S&&S.diff!==undefined?S.diff:1]}
{const box=document.createElement('div');box.className='diffsel';box.innerHTML=`<span>Poziom trudności nowej gry</span><div>${DIFF_N.map((n,i)=>`<button data-diff="${i}" class="${i===DIFF_SEL?'on':''}">${n}</button>`).join('')}</div><small id="diffInfo"></small>`;
 const acts=document.querySelector('#intro .acts');if(acts)acts.parentNode.insertBefore(box,acts);
 const info=['Praca idzie szybciej, ludzie jedzą i palą mniej, jedzenie i budynki zużywają się wolniej, mniej złych chwil, krótsze mrozy.','Tak, jak gra była pomyślana.','Praca idzie wolniej, jedzenie i opał znikają szybciej, wszystko psuje się szybciej, więcej pożarów i wilków, dłuższe mrozy i więcej sztormów.'];
 const upd=()=>{box.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.diff===DIFF_SEL));const i=document.getElementById('diffInfo');if(i)i.textContent=info[DIFF_SEL]};upd();
 box.addEventListener('click',e=>{const b=e.target.closest('[data-diff]');if(!b)return;DIFF_SEL=+b.dataset.diff;try{localStorage.setItem('przystan-diff',String(DIFF_SEL))}catch(er){}upd()});
 const st=document.createElement('style');st.textContent=`.diffsel{margin:14px 0 4px}.diffsel>span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
 .diffsel>div{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.diffsel button{padding:8px 4px;font-size:13.5px}.diffsel button.on{border-color:var(--gold);background:#2c2a20;color:var(--hi)}.diffsel small{display:block;color:var(--mut);font-size:12px;margin-top:6px;line-height:1.35;min-height:2.7em}`;document.head.appendChild(st)}
function diffWeather(){const w=S.weather;if(!w||w.adj===Math.floor(S.day))return;w.adj=Math.floor(S.day);const d=S.diff===undefined?1:S.diff,sea=seasonIdx();
 if(d===2){if(sea===2&&w.k==='clear'&&Math.random()<.35)w.k='frost';else if((sea===1||sea===3)&&w.k==='clear'&&Math.random()<.12)w.k='storm'}
 else if(d===0){if(w.k==='frost'&&Math.random()<.5)w.k='snow';else if(w.k==='storm'&&Math.random()<.5)w.k='rain'}}
// ---- akty ----
const knownFrac=()=>{const n=REGIONS.filter(r=>r).length||1;return(S.regs?Object.keys(S.regs).length:0)/n};
const bornMasters=()=>S.people.filter(p=>p.born&&Math.max(...Object.values(p.sk))>=3).length;
const ACTS=[null,
 {n:'Brzeg',intro:'',g:[['Postaw chatę zbieracza',()=>S.bld.some(b=>b.kind==='zbieracz'&&bDone(b)),'Budowa → Jedzenie → Chata zbieracza. Najlepiej przy krzewach jagód i grzybach.'],
  ['Postaw chatę drwala',()=>S.bld.some(b=>b.kind==='drwal'&&bDone(b)),'Budowa → Surowce. Drwal ścina drzewa w swoim zasięgu, leśnik sadzi nowe.'],
  ['Rozpoznaj kajutę kapitana na wraku',()=>S.wreck.parts[2].open,'Praca → Wrak. Wolni robotnicy rozpoznają wskazaną część statku.'],
  ['Każda rodzina pod własnym dachem',()=>S.people.length&&S.people.every(p=>homeOf(p)),'Budowa → Domy. Szałas wystarczy na początek, chata z bali trzyma ciepło.']]},
 {n:'Pierwsza zima',intro:'Liście żółkną, noce się wydłużają. Każda rodzina ma już dach nad głową, ale prawdziwa próba dopiero nadchodzi: zima i wiosenny sztorm, który zabierze wrak.',g:[
  ['Postaw drewutnię i zgromadź 80 opału',()=>S.res.opal>=80&&S.bld.some(b=>b.kind==='drewutnia'&&bDone(b)),'Drewutnia rąbie kłody na opał. Zimą domy palą go codziennie.'],
  ['Wynieś z wraku, co się da, zanim przyjdzie sztorm',()=>!!S.wreck.gone,'Praca → Wrak. Sztorm przyjdzie wiosną, zapowiedź pięć dni wcześniej.'],
  ['Przetrwaj pierwszą zimę',()=>S.day>=YEAR*.78&&S.people.length>0,'Jedzenie, opał i ciepła odzież, zanim spadnie śnieg.']]},
 {n:'Zakorzenienie',intro:'Wraku już nie ma. Od teraz wszystko, co osada ma, musi zrobić sama. Ludzie przestają mówić „kiedy wrócimy”, a zaczynają mówić „u nas”.',g:[
  ['Przeczytaj księgę z wraku',()=>S.books.kowal===2||S.books.siew===2,'Gdy księga trafi do obozu, przydziel czytelników w Ludzie → Praca.'],
  ['Oswój pierwszą kozę',()=>S.bld.some(b=>(b.animals||0)>0),'Wiedza → Hodowla → Oswajanie kóz, potem zagroda i hodowca.'],
  ['Zbierz pierwsze plony z pola',()=>!!S.seen.harvest,'Pole wymaga wiedzy o siewie i ziarna. Siej wiosną albo na początku lata.'],
  ['Osada: 4 domy i 20 osób',()=>S.tier>=1,'Więcej domów i rodzin. Wesela i narodziny przyjdą same, gdy będzie gdzie mieszkać.']]},
 {n:'Wyspa',intro:'Osada stoi pewnie. Młodzi pytają, co jest za Czarnym Borem i za górami. Czas poznać wyspę i nadać jej krainom nasze nazwy.',g:[
  ['Poznaj 70% krain wyspy',()=>knownFrac()>=.7,'Wyprawy → zwiad. Każda poznana kraina dostaje nazwę.'],
  ['Wytop żelazo',()=>S.know.kuznia==='tak','Ruda, mielerz i kuźnia. Najpierw księga kowalska z kajuty.'],
  ['Odkryj trzy ślady dawnego ludu',()=>S.found.length>=3,'Zwiadowcy i wyprawy odsłaniają wyspę. Ślady leżą w głębi lądu.']]},
 {n:'Pierwsze pokolenie',intro:'Rozbitków jest coraz mniej. Przy warsztatach stoją ich dzieci, które statku nigdy nie widziały. Osada musi przejść w ich ręce.',g:[
  ['Wieś: 8 domów i 32 osoby',()=>S.tier>=2,'Wieś potrzebuje domów dla młodych par, pól, stad i rzemiosła.'],
  ['Głos młodych na wiecu',()=>youngVoice(),'Gdy założycieli zostanie mniej niż połowa, a dorosłych urodzonych na wyspie co najmniej dwoje.'],
  ['Trzech mistrzów urodzonych na wyspie',()=>bornMasters()>=3,'Dzieci uczą się przy mistrzach. Mistrz to poziom fachu 3 lub wyżej.'],
  ['Pamięć osady co najmniej żywa',()=>(S.pam||0)>=25,'Obrzędy, pieśni, groby z imionami i pierwsze razy.']]}];
function actInit(){if(S.act)return;S.agoals=S.agoals||{};let a=1;while(a<=5&&ACTS[a].g.every(g=>g[1]())){ACTS[a].g.forEach((g,i)=>S.agoals[a+'_'+i]=1);a++}S.act=Math.min(a,5);if(a>5)S.actDone=1}
goalInfo=function(){if(!S)return null;actInit();if(S.epoch===2)return{ch:'Epoka II · '+PATHS[S.path].n,t:PATHS[S.path].goal,d:'Osada żyje dalej. Rozdroża tej drogi przyjdą w kolejnych wersjach gry.'};
 if(S.actDone)return{ch:'Akt V · Pierwsze pokolenie',t:'Wiec pokoleń',d:'Osada jest gotowa. Wiec zbierze się wkrótce przy ogniu.'};
 const A=ACTS[S.act];const i=A.g.findIndex((g,i)=>!S.agoals[S.act+'_'+i]);const g=A.g[i<0?0:i];return{ch:'Akt '+['','I','II','III','IV','V'][S.act]+' · '+A.n,t:g[0],d:g[2]}};
goalsTick=function(){if(!S||!S.people.length)return;actInit();if(S.epoch===2)return;if(S.actDone){if(S.finQ&&!evOpen&&!placing&&isWork()){S.finQ=0;wiecPokolen()}return}const A=ACTS[S.act];
 A.g.forEach((g,i)=>{const k=S.act+'_'+i;if(!S.agoals[k]&&g[1]()){S.agoals[k]=1;S.hope=clamp(S.hope+.04,0,1);log('Cel osiągnięty: '+g[0].toLowerCase()+'.');toast('Cel osiągnięty: '+g[0]);sfx('bell')}});
 if(A.g.every((g,i)=>S.agoals[S.act+'_'+i])){if(S.act<5){S.act++;S.actQ=S.act;pamAdd(2,'akt')}else{S.actDone=1;S.finQ=1}}
 if(S.actQ&&!evOpen&&!placing){const a=S.actQ;S.actQ=0;openEvent({ey:'Akt '+['','I','II','III','IV','V'][a],t:ACTS[a].n,text:()=>ACTS[a].intro,opts:[{n:'Dalej',d:'',f:()=>{log('Zaczyna się akt '+['','I','II','III','IV','V'][a]+': '+ACTS[a].n.toLowerCase()+'.');return ACTS[a].g.map(g=>'· '+g[0]).join('\n')}}]},{})}
 if(S.finQ&&!evOpen&&!placing&&isWork()){S.finQ=0;wiecPokolen()}actScenesF()};
nextGoal=function(){const g=goalInfo();return g?g.t:null};
// ---- sceny ----
function actScenesF(){if(evOpen||placing||!isWork())return;
 // Nikt nas nie szuka
 if(!S.seen.niktnas&&(S.logbook||0)>=LOGBOOK.length&&!evOpen){S.seen.niktnas=1;openEvent({ey:'Dziennik kapitana',t:'Nikt nas nie szuka',
  text:()=>'Ostatnia strona dziennika. Kapitan pisze, że statek zszedł z kursu daleko na zachód, poza wszystkie szlaki. Nikt nie wie, gdzie jesteśmy. Nikt nie przypłynie. Przy ognisku robi się bardzo cicho.',
  opts:[{n:'Przysięga przy ogniu: wytrwamy',d:'nadzieja i zgoda, pamięć osady',f:()=>{S.hope=clamp(S.hope+.06,0,1);S.dis=clamp((S.dis||0)-.04,0,1);pamAdd(3,'przysiega');song('Pieśń o przysiędze przy ogniu');const st=S.people.filter(isAdult).sort((a,b)=>b.age-a.age)[0];return(st?st.name:'Najstarszy')+' pierwszy podnosi rękę nad ogniem. Potem drugi, trzeci, wszyscy. Ta wyspa jest teraz naszym domem.'}},
   {n:'Każdy przeżywa to po swojemu',d:'nadzieja spada, ale nic nie jest wymuszone',f:()=>{S.hope=clamp(S.hope-.06,0,1);return'Ludzie rozchodzą się do szałasów bez słowa. Ktoś długo stoi na plaży i patrzy w morze.'}}]},{});return}
 // Za pięć dni sztorm
 if(!S.seen.sztorm5&&Math.floor(S.day)>=YEAR-10&&!S.wreck.gone&&!evOpen&&isWork()){S.seen.sztorm5=1;openEvent({ey:'Zapowiedź',t:'Za pięć dni sztorm',
  text:()=>'Starzy rybacy patrzą na niebo i kręcą głowami. Za pięć dni przyjdzie wielki sztorm i zerwie wrak z mielizny. Co nie zostanie wyniesione, przepadnie na zawsze.',
  opts:[{n:'Wszyscy do wraku',d:'wrak rozbierany dwa razy szybciej, ale ludzie jedzą więcej',f:()=>{S.wreckRush=YEAR-5;return'Kto żyw, idzie na mieliznę. Liny, deski, skrzynie: wszystko, co da się unieść.'}},
   {n:'Zostawić go morzu',d:'spokój, praca idzie zwykłym rytmem',f:()=>{S.hope=clamp(S.hope+.03,0,1);return'„Co morze dało, to morze weźmie” — mówi ktoś. Osada wraca do swoich prac.'}}]},{});return}
 const ad=S.people.filter(isAdult).length;if(ad<4&&S.people.length&&!S.seen.ostatni&&!evOpen){S.seen.ostatni=1;openEvent({ey:'Kronika',t:'Ostatni',
  text:()=>`Zostało ${ad} dorosłych. Domy stoją puste, w części chat nie pali się ogień. Ci, którzy zostali, siadają razem i długo milczą.`,
  opts:[{n:'Trzymamy się razem',d:'',f:()=>{S.hope=clamp(Math.max(S.hope,.4),0,1);S.dis=0;return'Zestawiają posłania w jednej chacie. Póki ktoś pamięta pieśni, osada żyje.'}}]},{})}}
function actScenes(){
 if(S.wreckRush&&S.day<S.wreckRush){const t=foodTotal(),c=K*S.people.length*.15;if(t>c*2)FOOD.forEach(k=>S.res[k]=Math.max(0,S.res[k]-c*(S.res[k]/t)))}
 // dziecko w 12. roku wybiera fach
 S.people.forEach(p=>{if(p.age<12||p.fachChosen)return;p.fachChosen=1;if(!p.born&&S.day<2)return;const par=S.people.filter(q=>(p.par||[]).includes(q.id));
  const c=Object.keys(CN).sort((a,b)=>(p.sk[b]-p.sk[a])||(p.xp[b]-p.xp[a]))[0];p.xp[c]=(p.xp[c]||0)+30;while(p.sk[c]<5&&p.xp[c]>=LVL[p.sk[c]])p.sk[c]++;
  const who=par.find(q=>q.sk[c]>=2);log(`${p.name} kończy dwanaście lat i wybiera fach: ${CN[c]}${who?', jak '+(who.sex==='k'?'matka':'ojciec'):''}.`)})}
// ---- Rok na wyspie ----
function yearSnap(){return{born:S.born||0,died:S.died||0,weds:S.weds||0,bld:S.bld.filter(bDone).length,songs:(S.songs||[]).length,firsts:Object.keys(S.firsts||{}).length,ham:(S.hamlets||[]).length,dead:(S.deadNames||[]).length,day:S.day}}
function rokNaWyspie(){const rd=Math.floor(rday()),yr=Math.floor(S.day/YEAR);if(!S.ysnap)S.ysnap=yearSnap();if(rd!==0||yr<1||S.seen['rok'+yr])return;if(evOpen){return}S.seen['rok'+yr]=1;
 const a=S.ysnap,b=yearSnap();S.ysnap=b;const dn=(S.deadNames||[]).slice(a.dead),sg=(S.songs||[]).slice(a.songs).map(s=>'„'+s.t+'”'),fs=Object.values(S.firsts||{}).filter(f=>f.d>a.day).map(f=>f.t.toLowerCase());
 const lines=[`Mija ${yr===1?'pierwszy':yr===2?'drugi':yr===3?'trzeci':yr===4?'czwarty':yr===5?'piąty':yr===6?'szósty':yr===7?'siódmy':yr===8?'ósmy':yr+'.'} rok na wyspie. Ognie Kupały płoną nad zatoką.`,
  `Urodziło się: ${b.born-a.born}. Odeszło: ${b.died-a.died}${dn.length?' ('+dn.join(', ')+')':''}. Wesel: ${b.weds-a.weds}. Nowych budowli: ${Math.max(0,b.bld-a.bld)}.`];
 if(sg.length)lines.push('Nowe pieśni: '+sg.join(', ')+'.');if(fs.length)lines.push('Po raz pierwszy: '+fs.join(', ')+'.');if(b.ham>a.ham)lines.push('Nowe przysiółki: '+(b.ham-a.ham)+'.');
 lines.push(`${S.vname||'Przystań'}: ${S.people.length} ${osb(S.people.length)}${(S.hamlets||[]).length?', w przysiółkach '+S.hamlets.reduce((x,h)=>x+h.pop,0):''}. Pamięć ${pamWord()}.`);
 openEvent({ey:'Rok na wyspie',t:'Rocznica rozbicia',text:()=>lines.join('\n\n'),opts:[{n:'Dalej',d:'',f:()=>{log('Rok na wyspie: '+lines.slice(1).join(' '));return'Gra zapisana. Dobry moment na przerwę.'}}]},{});save()}
// ---- wiec pokoleń i Księga rozbitków ----
const PATHS={dom:{n:'Dom',q:'„To nasza wyspa.”',d:'gospodarze: gród, prawo zwyczajowe, rzemiosło i targi między przysiółkami',goal:'Gród, prawo i targi'},
 glab:{n:'Głąb',q:'„Pójdziemy w puszczę.”',d:'kolonizacja wnętrza wyspy: druga osada, góry, jaskinie, drogi i przysiółki',goal:'Wnętrze wyspy i druga osada'},
 morze:{n:'Morze',q:'„Zbudujemy statek.”',d:'łodzie, dalekie łowiska i sąsiednie bezludne wyspy',goal:'Łodzie i bezludne wyspy'}};
function wiecPokolen(){if(S.epoch===2)return;const f=S.people.filter(p=>!p.born&&isAdult(p)).sort((a,b)=>b.age-a.age)[0];
 const teller=f?`${f.name}, ${Math.floor(f.age)} lat, ostatni${f.sex==='k'?'a':''} z tych, którzy pamiętają statek`:'najstarsza z córek rozbitków, która zna opowieść od matki';
 openEvent({id:'campaign-route',ey:'Wiec pokoleń',t:'Czym mamy być dalej?',
  text:()=>`Cała osada przy jednym ogniu, także ludzie z przysiółków. Mówi ${teller}. Opowiada o statku, o sztormie, o pierwszej nocy na plaży i o tych, których już nie ma. Młodzi słuchają, jakby to była baśń.\n\nPotem wiec musi zdecydować, dokąd osada pójdzie dalej. Tej decyzji nie da się cofnąć.`,
  opts:Object.entries(PATHS).map(([k,p])=>({n:p.n+': '+p.q,d:p.d,f:()=>{S.epoch=2;S.path=k;S.finDay=S.day;pamAdd(5,'wiec');song('Pieśń o wiecu pokoleń');log(`Wiec pokoleń wybiera drogę: ${p.n}. ${p.q}`);gameLater(ksiegaRozbitkow,600);return`Wiec wybrał: ${p.n}. Kończy się epoka rozbitków. Zaczyna się epoka ich dzieci.`}}))},{})}
function ksiegaText(){if(typeof ludInit==='function')ludInit();const L=[],yrs=Math.floor(S.day/YEAR),r=S.rody||{};const nm=S.vname||'Przystań';
 L.push(`KSIĘGA ROZBITKÓW · ${nm.toUpperCase()}`,'',`Epoka rozbitków trwała ${yrs} ${lata(yrs)}. Poziom trudności: ${DIFF_N[S.diff===undefined?1:S.diff].toLowerCase()}.`,'');
 L.push(`Osiemnaścioro wyszło na brzeg. Dziś ${nm} to ${S.people.length} ${osb(S.people.length)}${(S.hamlets||[]).length?' i '+S.hamlets.reduce((x,h)=>x+h.pop,0)+' w przysiółkach: '+S.hamlets.map(h=>h.name).join(', '):''}. Urodziło się ${S.born||0}, odeszło ${S.died||0}, wesel było ${S.weds||0}.`,'');
 const alive=S.people.filter(p=>!p.born);L.push('ZAŁOŻYCIELE','',alive.length?'Żyją jeszcze: '+alive.map(p=>p.name+' ('+Math.floor(p.age)+' l.)').join(', ')+'.':'Nie żyje już nikt z rozbitków.',(S.deadNames||[]).length?'Pamiętamy: '+S.deadNames.join(', ')+'.':'','');
 const sec=(h,arr)=>{arr=arr.filter(Boolean);if(arr.length)L.push(h,'',...arr,'')};
 sec('RODY',Object.keys(S.rody||{}).map(id=>{const m=S.people.filter(p=>String(p.rod)===id);return`${S.rody[id].znak||''} ${rodName(id)}: ${m.length} ${osb(m.length)}${m.length?' ('+m.map(p=>p.name).join(', ')+')':''}.`}));
 if(0)Object.keys(r).forEach(id=>{const m=S.people.filter(p=>String(p.rod)===id);L.push(`${r[id].znak||''} ${rodName(id)}: ${m.length} ${osb(m.length)}${m.length?' ('+m.map(p=>p.name).join(', ')+')':''}.`)});L.push('');
 sec('OBYCZAJE',CUSTOMS.map(c=>{const o=c.o.find(x=>x.id===S.cust[c.k]);return o?`${c.n}: ${o.n} (${OBY[obyStage(c.k)][1]}).`:''}));
 sec('URZĘDY',OFFS.map(o=>{const p=offHolder(o.id);return p?`${offTitle(o.id,p)}: ${p.name}.`:''}));
 sec('PIEŚNI',(S.songs||[]).map(s=>'„'+s.t+'”'));sec('PIERWSZE RAZY',Object.values(S.firsts||{}).map(f=>`${dayName(f.d)}: ${f.t}.`));
 L.push(`Pamięć osady: ${pamWord()}.`,'');if(S.path)L.push(`Wiec pokoleń wybrał drogę: ${PATHS[S.path].n}. ${PATHS[S.path].q} Dalej: ${PATHS[S.path].d}.`);
 return L.filter((x,i,a)=>!(x===''&&a[i-1]==='')).join('\n')}
function ksiegaRozbitkow(){if(evOpen){gameLater(ksiegaRozbitkow,1500);return}const t=ksiegaText();
 openEvent({ey:'Koniec epoki I',t:'Księga rozbitków',text:()=>t.split('\n').slice(2,14).join('\n'),opts:[{n:'Pobierz Księgę rozbitków',d:'plik tekstowy',f:()=>{dlFile(`ksiega-rozbitkow-${(S.vname||'przystan').toLowerCase()}.txt`,t,'text/plain;charset=utf-8');return'Księga zapisana. Osada żyje dalej.'}},{n:'Graj dalej',d:'',f:()=>'Osada żyje dalej. Epoka II dopiero się zaczyna.'}]},{})}
function actDaily(){actInit();diffWeather();actScenes();rokNaWyspie()}
// po wiecu pokoleń Księgę można pobrać w każdej chwili z karty pamięci
{const _ph=pamHTML;pamHTML=function(){let h=_ph();if(S.epoch===2)h=h.replace(/<\/div>$/,`<button data-ksiega style="margin-top:6px;width:100%">Pobierz Księgę rozbitków</button></div>`);return h}}
document.addEventListener('click',e=>{if(!e.target.closest('[data-ksiega]')||!S)return;dlFile(`ksiega-rozbitkow-${(S.vname||'przystan').toLowerCase()}.txt`,ksiegaText(),'text/plain;charset=utf-8')});
