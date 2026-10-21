// ================= 2.2 Epoka II: trzecie rozdroża, akt IX i 28 zakończeń =================
RN._sh='praca przy statku';
const e2R3=id=>!!(S&&S.e2&&S.e2.r3===id);
// ---------- nowe budowle ----------
Object.assign(BD,{
 cech:{cat:'wsp',n:'Dom cechowy',w:3,h:2,cost:{drewno:36,deski:24,kamien:16,gwozdzie:24},work:18,e2:'cechy',d:'Długi dom z podcieniem, w którym zbierają się mistrzowie. Nad wejściem wiszą szyldy wszystkich cechów.'},
 spichlerz:{cat:'magazyn',n:'Spichlerz na palach',w:2,h:2,cost:{drewno:16,deski:10,kamien:8},work:7,store:'food',cap:300,e2:'gosp',d:'Mały spichlerz na kamiennych grzybach, żeby myszy nie dosięgły ziarna. Stoi przy domach, a każda rodzina ma w nim swój kąt.'},
 stodola:{cat:'magazyn',n:'Stodoła',w:3,h:2,cost:{drewno:40,deski:16,gwozdzie:12},work:12,store:'food',cap:400,e2:'karcz',d:'Wielka stodoła z wrotami na wóz. Zboże z karczowisk schnie tu w snopach do zimy.'},
 przystan:{cat:'jedzenie',n:'Przystań łodzi',w:3,h:2,cost:{drewno:30,deski:24,gwozdzie:20},work:12,shore:1,e2:'swoje',d:'Długi pomost na palach, szopa na łodzie i suszarnie sieci. Łodzie budowane po swojemu cumują tu jedna przy drugiej. Stawia się ją na brzegu.'}});
E2_WHERE.przystan='przystań łodzi musi stać na brzegu, przy wodzie';
Object.assign(E2ACT,{cech:'pilnuje cechu'});Object.assign(SIGNK,{cech:'narz'});
// ---------- trzecie rozdroża ----------
const ROZ3={
 dom:{t:'Cechy czy każdy dom sobie?',x:'Rzemieślników jest coraz więcej, a ich wyroby idą do przysiółków i na targ. Mistrzowie chcą cechów: wspólnych zasad, pieczęci i nauki po kolei, od ucznia do mistrza. Gospodarze mówią, że każdy dom powinien umieć wszystko sam: utkać płótno, wykuć gwóźdź i upiec chleb.',o:[
  {id:'cechy',n:'Cechy mistrzów',d:'Dom cechowy i cechy fachów. Warsztaty pracują o 12% sprawniej. Celem jest mistrz w każdym fachu.',r:'Postanowiono: cechy. Każdy mistrz dostaje pieczęć z wyciętym znakiem swojego fachu.',song:'Pieśń o pieczęciach mistrzów'},
  {id:'gosp',n:'Każdy dom samowystarczalny',d:'Spichlerze na palach przy domach, a przy każdym domu ogród i kurnik: codziennie trochę jedzenia z każdego domu. Warsztaty pracują trochę wolniej.',r:'Postanowiono: każdy dom sobie. Ojcowie uczą dzieci wszystkiego, co sami umieją, matki tak samo.',song:'Pieśń o domu, który ma wszystko'}]},
 glab:{t:'Karczować pod pola czy żyć z lasu?',x:'Puszcza zaczyna się tuż za ostatnimi chatami. Jedni chcą ją wykarczować pod pola, żeby ziarna starczyło dla wszystkich i dla dzieci ich dzieci. Inni mówią, że las karmi lepiej niż pole: miód z barci, zwierzyna, grzyby i zioła, a stare dęby są święte.',o:[
  {id:'karcz',n:'Karczować pod pola',d:'Stodoła i nowe pola na karczowiskach. Pola dają o 15% więcej. Drwale wycinają puszczę.',r:'Postanowiono: karczujemy. Pierwszy dąb pada z hukiem, a dzieci liczą jego słoje.',song:'Pieśń o pierwszym karczowisku'},
  {id:'las',n:'Żyć z lasu',d:'Barcie, łowy i zbieranie dają o 25% więcej. Celem są trzy barcie, drugi święty gaj i zapas miodu.',r:'Postanowiono: żyjemy z lasu. Najstarszy dąb za osadą dostaje wstążkę od każdego rodu.',song:'Pieśń o ludziach puszczy'}]},
 morze:{t:'Statek jak tamten czy łodzie po swojemu?',x:'Szkutnicy umieją już wszystko, czego nauczyło ich morze. Najstarsi pamiętają statek, którym tu przypłynęli: dwa maszty i wysoką rufę. Chcą zbudować taki sam. Młodzi mówią, że wyspa nauczyła ich budować inaczej: lżej, z tego, co rośnie tutaj.',o:[
  {id:'statek',n:'Statek jak tamten',d:'Szkutnia buduje w trzech etapach statek na wzór dawnego: kadłub, pokład z masztami, żagle i liny. Gdy będzie gotowy, stanie na kotwicy przy brzegu.',r:'Postanowiono: statek jak tamten. Najstarsi rysują patykiem na piasku kształt rufy, którą pamiętają.',song:'Pieśń o statku, który wrócił'},
  {id:'swoje',n:'Łodzie po swojemu',d:'Przystań łodzi z długim pomostem. Łodzie są jeszcze tańsze, a rejsy bezpieczniejsze. Celem jest osiem łodzi i dziesięć rejsów.',r:'Postanowiono: po swojemu. Pierwsza łódź z wyspy dostaje imię po dziecku, które urodziło się tej nocy.',song:'Pieśń o łodziach z wyspy'}]}};
const SHIP=[{n:'Kadłub z dębu',in:{drewno:2,deski:1},need:60},{n:'Pokład i dwa maszty',in:{deski:2,gwozdzie:3},need:66},{n:'Żagle i liny',in:{plotno:1,wlokna:1},need:54}];
const e2Masters=()=>Object.keys(CN).filter(c=>S.people.some(p=>p.sk[c]>=3)).length;
const e2FullSp=()=>Object.values(S.fams).filter(f=>famMembers(f.id).length&&typeof spizCap==='function'&&spizCap(f)>0&&(f.sp||0)>=.8*spizCap(f)).length;
const e2Stumps=()=>nodes.reduce((a,n,k)=>a+(n.type==='tree'&&!n.gone&&(S.nodeAmt[k]||0)<=0?1:0),0)+(S.karczN||0);   // 4.6.0-rc.3: wykarczowane pniaki też się liczą
const E2D={
 cechy:{n:'Cechy mistrzów',intro:'Każdy fach ma swój cech, swoją pieczęć i swojego mistrza. Uczeń przechodzi od mistrza do mistrza, aż sam nim zostanie.',g:[
  ['Postaw dom cechowy',()=>hasDone('cech'),'Budowa → Wspólnota → Dom cechowy.'],
  ['Mistrz w każdym fachu',()=>e2Masters()>=Object.keys(CN).length,'Mistrz to poziom fachu 3 lub wyżej. Zobacz, któremu fachowi brakuje mistrza, i przydziel tam ludzi.'],
  ['Cechy wytwarzają 100 wyrobów',()=>(S.e2.cechN||0)>=100,'Liczy się wszystko, co powstaje w warsztatach, przetwórniach i drewutniach od chwili wyboru. Warsztat staje, gdy zapas jest pełny.']]},
 gosp:{n:'Każdy dom sobie',intro:'Każdy dom ma swój ogród, kurnik i kąt w spichlerzu. Nikt nie czeka, aż coś przyniesie osada.',g:[
  ['Trzy spichlerze na palach',()=>cntDone('spichlerz')>=3,'Budowa → Magazyny → Spichlerz na palach.'],
  ['Każda rodzina z pełną spiżarką',()=>{const n=Object.values(S.fams).filter(f=>famMembers(f.id).length).length;return n>0&&e2FullSp()>=n},'Rodziny same napełniają spiżarki, gdy osada ma zapasy. Młode pary bez domu nie mają gdzie trzymać zapasów.'],
  ['Dwadzieścia dni bez głodu',()=>(S.e2.fedD||0)>=20,'Jedzenia dla wszystkich przez dwadzieścia dni z rzędu.']]},
 karcz:{n:'Karczowiska',intro:'Puszcza ustępuje polom. Drewno z karczowisk idzie na stodoły, a popiół na ziemię.',g:[
  ['Postaw stodołę',()=>hasDone('stodola'),'Budowa → Magazyny → Stodoła.'],
  ['Sześć pól',()=>S.bld.filter(b=>b.kind==='pole'&&bDone(b)).length>=6,'Budowa → Pola i stada → Pole.'],
  ['Wykarczuj 60 drzew',()=>e2Stumps()-(S.e2.karcz0||0)>=60,'Drwale ścinają drzewa w zasięgu. Leśnik sadzi nowe, więc nie stawiaj go przy karczowisku.']]},
 las:{n:'Ludzie Puszczy',intro:'Las karmi tych, którzy go znają. Barcie na starych sosnach, łowy jesienią i święte gaje, w których nikt nie podnosi siekiery.',g:[
  ['Trzy barcie',()=>cntDone('pasieka')>=3,'Budowa → Jedzenie → Barć.'],
  ['Drugi święty gaj',()=>cntDone('gaj')>=2,'Budowa → Wspólnota → Święty gaj.'],
  ['Zapas: 80 miodu',()=>(S.res.miod||0)>=80,'Barcie dają miód od wiosny do jesieni.']]},
 statek:{n:'Statek jak tamten',intro:'Na pochylni szkutni rośnie statek na wzór tego, którym tu przypłynęli. Najstarsi przychodzą co dzień i poprawiają szkutników.',g:SHIP.map((s,i)=>[s.n,()=>(S.e2.ship||0)>i,'Szkutnicy pracują w szkutni etap po etapie.'])},
 swoje:{n:'Łodzie z wyspy',intro:'Łodzie z wyspy są lżejsze i krótsze niż tamte, ale wracają z każdego rejsu.',g:[
  ['Postaw przystań łodzi',()=>hasDone('przystan'),'Budowa → Jedzenie → Przystań łodzi, na brzegu.'],
  ['Osiem łodzi',()=>e2Boats()>=8,'Łodzie przy brzegu i łodzie rybackie przy pomostach liczą się razem.'],
  ['Dziesięć rejsów',()=>(S.e2.rejsy||0)>=10,'Wyprawy → Rejs wzdłuż brzegu.']]}};
// ---------- 28 zakończeń ----------
const ENDS={
 'grod-rada-cechy':'Gród Mistrzów pod Lipą','grod-rada-gosp':'Gród Starszych i Gospodarzy','grod-wiec-cechy':'Wolny Gród Rzemieślników','grod-wiec-gosp':'Wolny Gród Gospodarzy','grod-rod-cechy':'Gród Rodu i Cechów','grod-rod-gosp':'Gniazdo Rodu za Wałem',
 'wies-rada-cechy':'Wieś Mistrzów pod Lipą','wies-rada-gosp':'Wieś Starszych','wies-wiec-cechy':'Wolne Wsie Rzemieślników','wies-wiec-gosp':'Wolne Wsie Gospodarzy','wies-rod-cechy':'Ziemia Rodu i Cechów','wies-rod-gosp':'Ziemia Jednego Rodu',
 'bagna-druga-karcz':'Osada za Bagnami','bagna-druga-las':'Ludzie Puszczy za Bagnami','bagna-lancuch-karcz':'Szlak przez Mokradła','bagna-lancuch-las':'Ludzie Mszarów',
 'gory-druga-karcz':'Osada pod Granią','gory-druga-las':'Ludzie Puszczy spod Grani','gory-lancuch-karcz':'Szlak Grani','gory-lancuch-las':'Ludzie Gór i Lasów',
 'wielka-wyspy-statek':'Statek do Dalekich Wysp','wielka-wyspy-swoje':'Żeglarze Dalekich Wysp','wielka-skaly-statek':'Statek spod Ptasich Skał','wielka-skaly-swoje':'Żeglarze Ptasich Skał',
 'flotylla-wyspy-statek':'Flota Wysp','flotylla-wyspy-swoje':'Rybacy Wysp','flotylla-skaly-statek':'Statek z Zatoki','flotylla-skaly-swoje':'Rybacy z Zatoki'};
const ENDS_N=Object.keys(ENDS).length;
const ENDS_D={dom:'Wyspa należy do nas. Mamy prawo, drogi i warsztaty, a przysiółki przychodzą na targ jak do siebie.',glab:'Wnętrze wyspy przestało być nieznane. Tam, gdzie kiedyś chodziły tylko wyprawy, dymią kominy przysiółków.',morze:'Morze nie jest już tym, co nas tu wyrzuciło. Jest drogą, którą umiemy płynąć.'};
function e2EndName(){const e=S.e2;return ENDS[[e.r1,e.r2,e.r3].join('-')]||'Przystań'}
function endsSeen(){try{return JSON.parse(localStorage.getItem('przystan-konce')||'[]')}catch(er){return[]}}
function endsAdd(n){try{const L=endsSeen();if(!L.includes(n)){L.push(n);localStorage.setItem('przystan-konce',JSON.stringify(L))}}catch(er){}}
function e2Roz3(){const R=ROZ3[S.path];const e=S.e2;openEvent({id:'e2-third',ey:'Rozstaje · trzecie rozdroże',t:R.t,text:()=>R.x+'\n\nTej decyzji nie da się cofnąć.',
 opts:R.o.map(o=>({n:o.n,d:o.d,f:()=>{e.r3=o.id;e.a=11;e.t11=S.day;S.tech['e2_'+o.id]=1;e2Keys();pamAdd(4,'rozdroze');song(o.song);log('Trzecie rozstaje: '+o.n.toLowerCase()+'. '+o.r);e.introQ=1;e2Apply3();renderPanel();return o.r}}))},{})}
function e2Apply3(){const e=S.e2;if(e.r3==='karcz')e.karcz0=e2Stumps();if(e.r3==='statek'){e.ship=e.ship||0;e.shipP=0}}
const zyjeW=n=>osb(n)==='osoby'?'żyją':'żyje';
function e2Final(){const e=S.e2;const nm=e2EndName();e.endName=nm;e.endDay=S.day;endsAdd(nm);song('Pieśń o '+nm);pamAdd(8,'koniec');
 const yrs=Math.floor(S.day/YEAR),ham=(S.hamlets||[]).reduce((a,h)=>a+h.pop,0),old=S.people.filter(p=>!p.born).length;
 const txt=`${ENDS_D[S.path]}\n\nMinęło ${yrs} ${lata(yrs)} od rozbicia. W osadzie ${zyjeW(S.people.length)} ${S.people.length} ${osb(S.people.length)}${ham?', w przysiółkach '+ham:''}. ${old?'Z tych, którzy wyszli na brzeg, '+zyjeW(old)+' jeszcze '+old+' '+osb(old)+'.':'Nie żyje już nikt z rozbitków. Statek znają tylko z pieśni.'}\n\nPieśniarze mają już nazwę dla tego, czym stała się osada: ${nm}.\n\nTo zakończenie epoki II. Osada żyje dalej. Zakończeń jest ${ENDS_N}, a to, które zdobyłeś, zostaje zapisane na ekranie startowym.`;
 log(`Koniec epoki II. Osada przechodzi do pieśni jako ${nm}.`);
 openEvent({ey:'Koniec epoki II',t:nm,text:()=>txt,opts:[{n:'Pobierz Księgę rozbitków',d:'plik tekstowy z całą historią',f:()=>{dlFile(`ksiega-rozbitkow-${(S.vname||'przystan').toLowerCase()}.txt`,ksiegaText(),'text/plain;charset=utf-8');return'Księga zapisana. Osada żyje dalej.'}},{n:'Graj dalej',d:'',f:()=>'Osada żyje dalej. Wyspa jest wciąż do zasiedlenia.'}]},{})}
// ---------- skutki ----------
{const _bm3=bMul;bMul=function(b){let m=_bm3(b);if(!b||!S||!S.e2||!S.e2.r3)return m;const d=BD[b.kind];
 if(e2R3('cechy')&&d&&d.prod)m*=1.12;if(e2R3('gosp')&&d&&d.prod)m*=.93;if(e2R3('las')&&(b.kind==='pasieka'||b.kind==='mysliwy'||b.kind==='zbieracz'))m*=1.25;return m}}
{const _gm3=gospMade;gospMade=function(b,r,v){const x=_gm3(b,r,v);if(S&&S.e2&&e2R3('cechy')&&b&&BD[b.kind]&&BD[b.kind].prod&&r[0]!=='_'&&r!=='lodz')S.e2.cechN=(S.e2.cechN||0)+v;return x}}
{const _fm=typeof fieldMul==='function'?fieldMul:null;if(_fm)fieldMul=function(b){return _fm(b)*(e2R3('karcz')?1.15:1)}}
{const _sp=e2SzkProd;e2SzkProd=function(){let r=_sp();const L=[].concat(r);const boat=L[L.length-1];
 if(e2R3('swoje')&&boat&&boat.out&&boat.out.lodz){const b2=Object.assign({},boat,{in:{},t:Math.round(boat.t*.7)});Object.entries(boat.in).forEach(([k,v])=>b2.in[k]=Math.max(1,Math.ceil(v*.6)));L[L.length-1]=b2;r=L.length===1?b2:L}
 if(e2R3('statek')&&(S.e2.ship||0)<3){const st=SHIP[S.e2.ship||0];return[{in:st.in,out:{_sh:1},t:20}].concat([].concat(r).filter(x=>x.out&&x.out.lodz))}return r}}
{const _bw=e2BoatWant;e2BoatWant=function(){return e2R3('swoje')?(S.res.lodz||0)<9:_bw()}}
function e2ShipTick(){const e=S.e2;if(!e||e.r3!=='statek'||(e.ship||0)>=3)return;const w=S.res._sh||0;if(w<=0)return;S.res._sh=0;e.shipP=(e.shipP||0)+w;const st=SHIP[e.ship||0];
 if(e.shipP>=st.need){e.shipP=0;e.ship=(e.ship||0)+1;log(`Statek: ${st.n.toLowerCase()} gotowe.${e.ship<3?' Teraz: '+SHIP[e.ship].n.toLowerCase()+'.':' Statek spływa z pochylni i staje na kotwicy przy brzegu. Najstarsi płaczą i nikt się z nich nie śmieje.'}`);toast('Statek: '+st.n.toLowerCase());sfx('bell');
  S.bld.filter(b=>b.kind==='szkutnia').forEach(b=>{try{rebuildMesh(b)}catch(er){}});if(e.ship>=3){shipKey='';pamAdd(5,'statek')}}}
{const _fe3=finishExp;finishExp=function(e,out){if(e.type==='rejs'&&e2R3('swoje'))e.risk*=.5;return _fe3(e,out)}}
function e2Daily22(){if(!S||S.epoch!==2||!S.e2||!S.e2.r3)return;const e=S.e2;
 if(e.r3==='gosp'){const hh=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;const sea=seasonIdx();if(sea!==2){S.res.warzywa=(S.res.warzywa||0)+K*.15*hh;S.res.jaja=(S.res.jaja||0)+K*.1*hh}e.fedD=(S.hungerDays||0)===0?(e.fedD||0)+1:0}
 e2ShipTick()}
// Dzienna aktualizacja: p_daily.js (jedna jawna kolejność).
// karta
function e2HTML22(){const e=S.e2;if(!e||!e.r3)return'';let h='';
 if(e.r3==='cechy'){const miss=Object.keys(CN).filter(c=>!S.people.some(p=>p.sk[c]>=3)).map(c=>CN[c]);h+=`<p class="mut">Cechy z mistrzem: ${e2Masters()} z ${Object.keys(CN).length}${miss.length?' · bez mistrza: '+miss.join(', '):''} · wyroby: ${e.cechN||0}.</p>`}
 if(e.r3==='gosp')h+=`<p class="mut">Rodziny z pełną spiżarką: ${e2FullSp()} z ${Object.values(S.fams).filter(f=>famMembers(f.id).length).length} · dni bez głodu z rzędu: ${e.fedD||0}.</p>`;
 if(e.r3==='karcz')h+=`<p class="mut">Wykarczowane drzewa: ${Math.max(0,e2Stumps()-(e.karcz0||0))} z 60.</p>`;
 if(e.r3==='statek'){const st=Math.min(e.ship||0,3);h+=`<p class="mut">Statek: ${st<3?SHIP[st].n.toLowerCase()+' '+Math.round(100*(e.shipP||0)/SHIP[st].need)+'%':'stoi na kotwicy przy brzegu'}.</p>`}
 if(e.r3==='swoje')h+=`<p class="mut">Łodzie: ${e2Boats()} z 8 · rejsy: ${e.rejsy||0} z 10.</p>`;
 return h}
// ---------- statek na kotwicy ----------
const shipG=new THREE.Group();scene.add(shipG);let shipKey='';
function e2ShipVis(){const ok=S&&S.e2&&S.e2.r3==='statek'&&(S.e2.ship||0)>=3;const sz=ok&&S.bld.find(b=>b.kind==='szkutnia'&&bDone(b));const key=ok&&sz?sz.id+'':'';if(key===shipKey)return;shipKey=key;shipG.children.slice().forEach(o=>shipG.remove(o));if(!key)return;
 const c=bCenter(sz);let best=null,bd=1e9;for(let dj=-16;dj<=16;dj++)for(let di=-16;di<=16;di++){const i=sz.i+di,j=sz.j+dj;if(i<2||j<2||i>N-3||j>N-3)continue;let wet=true;for(let a=-3;a<=3&&wet;a++)for(let q=-3;q<=3;q++)if(land[(j+q)*N+i+a]){wet=false;break}if(!wet)continue;const d=Math.hypot(di,dj);if(d<bd){bd=d;best=[i,j]}}
 if(!best)return;const g=e2BigHull(4,0);g.scale.setScalar(1.9);const m2=cyl(.05,2.2,matLog2,0,1.7,-.7,0,0,0,6);g.add(m2);const s2=new THREE.Mesh(new THREE.PlaneGeometry(1.0,1.2),mCanvN);s2.position.set(0,1.75,-.62);s2.rotation.y=Math.PI/2;g.add(s2);
 g.add(tbox(.9,.5,.6,mPlankD,0,.95,-1.1));g.position.set(tcx(best[0]),-.35,tcx(best[1]));g.rotation.y=Math.atan2(tcx(best[0])-c.x,tcx(best[1])-c.z)+Math.PI/2;g.traverse(o=>{if(o.isMesh)o.castShadow=true});shipG.add(g)}
{const _mt3=mapTick;mapTick=function(rdt){_mt3(rdt);try{e2ShipVis();const g=shipG.children[0];if(g){const t=performance.now()/1000;g.position.y=-.35+Math.sin(t*.9)*.04;g.rotation.z=Math.sin(t*.7)*.025}}catch(er){}}}
// szkutnia: na pochylni kadłub statku
{const _sf=e2SzkFull;e2SzkFull=function(G,b){if(!(S&&S.e2&&S.e2.r3==='statek'))return _sf(G,b);const r1=S.e2.r1,lz=S.res.lodz;S.e2.r1='_';S.res.lodz=0;try{_sf(G,b)}finally{S.e2.r1=r1;S.res.lodz=lz}
 G.children.filter(o=>o.userData&&o.userData.ribs).forEach(o=>G.remove(o));const st=S.e2.ship||0;if(st>=3)return;const hh=e2BigHull(st===0?1:st===1?2:3,st===0?(S.e2.shipP||0)/SHIP[0].need:0);hh.scale.setScalar(.95);hh.position.set(0,.1,1.0);
 if(st===2){hh.add(cyl(.05,2.0,matLog2,0,1.6,-.7,0,0,0,6))}G.add(hh)}}
// ekran startowy: zdobyte zakończenia
{const acts=document.querySelector('#intro .acts');const L=endsSeen();if(acts&&L.length){const el=document.createElement('small');el.className='e2note';el.textContent=`Zakończenia epoki II: ${L.length} z ${ENDS_N}. Ostatnie: ${L[L.length-1]}.`;acts.appendChild(el)}}
// ---------- modele ----------
function e2Cech(g){logHouse(g,2.7,1.5,1.25,{chim:.9,dx:0,sidewin:true,roof:mShingle,rh:1.0});const gz=1.0;
 for(let q=0;q<6;q++){const x=-1.3+q*.52;g.add(tbox(.1,1.1,.1,matLog2,x,.3+.55,gz));if(q<5){const sg=new THREE.Group();sg.position.set(x+.26,1.18,gz+.02);sg.add(tbox(.02,.18,.02,matDark,0,.12,0));const kk=['narz','deski','odziez','cegla','ziarno'][q];
  let mat=mPlankD;try{if(typeof signTex==='function')mat=signTex(kk)}catch(er){}sg.add(tbox(.3,.22,.03,mat,0,-.06,0));g.add(sg)}}
 g.add(tbox(2.85,.07,.5,mPlank,0,.33,gz-.2,0,1.5));const pr=gable(2.9,.6,.26,mShingle,1.42,.06);pr.position.z=gz-.15;g.add(pr)}
function e2Spich(g){for(const sx of[-1,1])for(const sz of[-1,1]){g.add(cyl(.07,.42,matStone,sx*.5,.21,sz*.42,0,0,0,7));g.add(cyl(.17,.07,matStone,sx*.5,.45,sz*.42,0,0,0,9))}
 g.add(tbox(1.25,.75,1.05,mLogsE,0,.48+.38,0,0,1.1));g.add(gable(1.25,1.05,.6,mThatch,1.23,.24));door(g,0,.53,0,.36,.55).position.y=.48;
 g.add(tbox(.36,.05,.5,mPlankD,0,.25,.75,-.5,1.4));sack(g,.75,.6,.8);sack(g,-.7,.65,.7)}
function e2Stodola(g){g.add(tbox(2.8,1.35,1.7,mPlank,0,.68,0,0,1.2));for(const sx of[-1,1])for(const sz of[-1,1])g.add(tbox(.12,1.4,.12,matLog2,sx*1.4,.7,sz*.85));
 g.add(gable(2.8,1.7,1.25,mThatch,1.35,.3));g.add(tbox(1.0,1.05,.06,mPlankD,0,.53,.86,0,1.4));g.add(tbox(.06,1.05,.08,matLog2,0,.53,.9));g.add(tbox(1.1,.08,.08,matLog2,0,1.08,.9));
 for(let q=0;q<4;q++){const sn=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,.55,7),M(0xc8a85a));sn.position.set(1.65,.27,-.6+q*.35);sn.castShadow=true;g.add(sn)}
 const hay=new THREE.Mesh(new THREE.SphereGeometry(.45,9,6,0,6.28,0,Math.PI/2),M(0xc8a85a));hay.position.set(-1.75,0,.5);hay.castShadow=true;g.add(hay)}
function e2Przystan(g){g.add(tbox(.7,.08,3.0,mPlank,.6,.3,.6,0,1.5));for(let q=0;q<5;q++)for(const sx of[.3,.9])g.add(cyl(.05,1.0,matDark,sx,-.2,-.7+q*.65,0,0,0,6));
 g.add(tbox(2.0,.08,.6,mPlank,-.2,.3,1.9,0,1.5));for(let q=0;q<3;q++){const b=e2BoatMesh(q===1);b.position.set(-.8+q*.75,.02,2.55);b.rotation.y=.05*q;g.add(b)}
 const sh=new THREE.Group();sh.position.set(-.75,0,-.2);shed(sh,1.1,1.2,1.0,mBoards);g.add(sh);rack(g,-.8,.8,0,r=>{const n=new THREE.Mesh(new THREE.PlaneGeometry(.7,.55,6,5),new THREE.MeshBasicMaterial({color:0x4a4a3a,wireframe:true}));n.position.y=.55;r.add(n)});barrel(g,.1,-.6,.8)}
{const _nm3=newModel;newModel=function(kind,g){if(kind==='cech'){e2Cech(g);return 1}if(kind==='spichlerz'){e2Spich(g);return 1}if(kind==='stodola'){e2Stodola(g);return 1}if(kind==='przystan'){e2Przystan(g);return 1}return _nm3(kind,g)}}
window.__e22={e2Roz3,e2Final,e2EndName,ENDS,ROZ3,E2D,e2Masters,e2FullSp,e2Stumps,e2ShipVis,shipG,endsSeen};
