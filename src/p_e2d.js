// ================= 2.0 Epoka II: trzy drogi, akt VI, pierwsze rozdroże, akt VII =================
RN.lodz='Łodzie';RN._wl='praca przy wielkiej łodzi';
IC.lodz='<path d="M3 14h18l-3 5H6z"/><path d="M12 3v11M12 4l6 8h-6"/>';
const E2ACT={targ:'handluje na targu',stanica:'pilnuje stanicy',torfowisko:'kopie torf',dymarka:'wytapia żelazo w dymarce',sztolnia:'kuje rudę w sztolni',szkutnia:'buduje łódź',brama:'pilnuje bramy',piwnica:'układa zapasy w piwnicy'};
const hasDone=k=>S.bld.some(b=>b.kind===k&&bDone(b));
const cntDone=k=>S.bld.filter(b=>b.kind===k&&bDone(b)).length;
// ---------- nowe budowle ----------
Object.assign(BD,{
 targ:{cat:'wsp',n:'Targowisko',w:3,h:2,cost:{drewno:30,deski:16,plotno:6},work:12,e2:'dom',d:'Kramy pod daszkami przy drodze do przysiółków. Co pięć dni jest dzień targowy: przysiółki przynoszą swoje dobra, zabierają, czego im brak, a więź z nimi rośnie.'},
 brama:{cat:'wsp',n:'Brama grodu',w:2,h:2,cost:{drewno:120,kamien:40,deski:20,gwozdzie:24},work:30,e2:'grod',d:'Brama z dwiema wieżami. Gdy stanie, ludzie usypią wał i wbiją ostrokół dookoła wsi, tak daleko od ogniska jak brama. Wilki nie wejdą do zagród za wałem, a ludzie śpią spokojniej.'},
 stanica:{cat:'wsp',n:'Stanica',w:2,h:2,cost:{drewno:30,kamien:10,deski:8},work:14,store:'all',cap:150,e2:'glab',far:30,d:'Warowna chata w głębi lądu, z częstokołem i pomostem do patrzenia. Skład na urobek z dala od osady. Wyprawy idą szybciej, a przysiółki w pobliżu są bezpieczniejsze. Musi stać co najmniej 30 kroków od ogniska.'},
 torfowisko:{cat:'surowce',n:'Kopanka torfu',w:2,h:2,cost:{drewno:12,deski:4},work:6,wk:2,c:'drwal',e2:'bagna',wet:1,prod:{in:{},out:{opal:2},t:10,when:()=>S.res.opal<320&&seasonIdx()!==2},d:'Na mokradle tnie się torf w cegiełki i suszy na stosach. Opał bez ścinania lasu, oprócz zimy, gdy torfowisko zamarza. Stawia się ją na mokradle albo tuż przy nim.'},
 dymarka:{cat:'rzemioslo',n:'Dymarka',w:2,h:2,cost:{glina:16,kamien:10,drewno:6},work:9,wk:2,c:'kowal',e2:'bagna',prod:[{in:{ruda:3,opal:4},out:{narz:1},t:30,when:()=>S.res.narz<14},{in:{ruda:2,opal:3},out:{gwozdzie:12},t:16,when:()=>S.res.gwozdzie<220}],d:'Gliniany piec na rudę darniową, opalany torfem. Żelazo bez mielerza: narzędzia, a gdy jest ich dość, gwoździe.'},
 sztolnia:{cat:'surowce',n:'Sztolnia',w:2,h:2,cost:{drewno:20,deski:10,narz:2},work:12,wk:2,c:'kamieniarz',e2:'gory',high:1,prod:{in:{},out:{ruda:1,kamien:1},t:18,when:()=>S.res.ruda<90},d:'Chodnik wykuty w zboczu, podparty stemplami. Ruda i kamień prosto ze skały, przez cały rok. Stawia się ją w górach albo przy skałach.'},
 piwnica:{cat:'magazyn',n:'Piwnica w skale',w:2,h:2,cost:{kamien:30,drewno:10,deski:6},work:10,store:'food',cap:500,e2:'gory',d:'Komora wykuta pod wielkim głazem i przysypana ziemią. Chłodno przez cały rok: jedzenie w osadzie psuje się o jedną piątą wolniej.'},
 szkutnia:{cat:'rzemioslo',n:'Szkutnia',w:3,h:2,cost:{drewno:30,deski:20,gwozdzie:20},work:14,wk:2,c:'ciesla',shore:1,e2:'morze',get prod(){return e2SzkProd()},d:'Pochylnia nad wodą, wręgi z dębu i smoła w kotle. Cieśle budują tu łodzie z desek, gwoździ i płótna. Stawia się ją na brzegu.'}});
const E2K=Object.keys(BD).filter(k=>BD[k].e2);
const E2_WHERE={stanica:'stanica musi stać w głębi lądu, co najmniej 30 kroków od ogniska',torfowisko:'kopanka musi stać na mokradle albo tuż przy nim',sztolnia:'sztolnia musi stać w górach albo przy skałach',szkutnia:'szkutnia musi stać na brzegu, przy wodzie'};
function e2Keys(){if(!S)return;Object.keys(BD).filter(k=>BD[k].e2).forEach(k=>{const on=S.tech&&S.tech['e2_'+BD[k].e2];const i=BKEYS.indexOf(k);if(on&&i<0)BKEYS.push(k);else if(!on&&i>=0)BKEYS.splice(i,1)})}
// miejsce: stanica daleko, torf na mokradle, sztolnia w skałach
function e2WetNear(i,j,w,h){for(let a=-1;a<=w;a++)for(let b=-1;b<=h;b++){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<N&&y<N&&biomeOf(x,y)==='wet')return true}return false}
function e2RockNear(i,j,w,h){if(tileH(i,j)>5.4)return true;return nodes.some(n=>n.type==='rock'&&Math.abs(n.i-i-w/2)<4&&Math.abs(n.j-j-h/2)<4)}
{const _cp=checkPlace;checkPlace=function(kind,i,j){if(!_cp(kind,i,j))return false;const d=BD[kind];
 if(d.far&&Math.hypot(i+d.w/2-camp.i,j+d.h/2-camp.j)<d.far)return false;if(d.wet&&!e2WetNear(i,j,d.w,d.h))return false;if(d.high&&!e2RockNear(i,j,d.w,d.h))return false;return true}}
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);if(!placing||!E2_WHERE[placing]||!ghostTile)return;const ok=checkPlace(placing,ghostTile[0],ghostTile[1]);const el=$('pinfo');if(!ok&&el)el.innerHTML=el.innerHTML.replace(/<span class="no">[^<]*<\/span>/,`<span class="no">Tu nie da się budować: ${E2_WHERE[placing]}</span>`)}}
{const _tp=tryPlace;tryPlace=function(){if(placing&&E2_WHERE[placing]&&ghostTile&&!checkPlace(placing,ghostTile[0],ghostTile[1])){toast('Tu nie da się budować: '+E2_WHERE[placing]);return}return _tp()}}

// ---------- akty i rozdroża ----------
const e2Known=()=>knownFrac();
const e2FarHam=()=>{const hs=S.hamlets||[];if(!hs.length)return null;return hs.slice().sort((a,b)=>Math.hypot(b.i-camp.i,b.j-camp.j)-Math.hypot(a.i-camp.i,a.j-camp.j))[0]};
const e2OldCust=n=>Object.keys(S.cust||{}).filter(k=>obyStage(k)>=1).length>=n;
const e2InWal=b=>{const w=S.e2&&S.e2.wal;if(!w)return false;const c=bCenter(b);return Math.hypot(c.x-w.x,c.z-w.z)<w.r-.6};
const e2Boats=()=>Math.floor(S.res.lodz||0)+anyExt('lodz');
const E2A={
 dom:{n:'Gospodarze',intro:'Wiec postanowił: ta wyspa jest nasza. Teraz trzeba nią gospodarzyć jak u siebie. Przysiółki mają mieć dokąd przyjść z tym, co wyhodowały i złowiły, obyczaje mają stać się prawem, a każda rodzina ma mieszkać w porządnym domu.',g:[
  ['Postaw targowisko',()=>hasDone('targ'),'Budowa → Wspólnota → Targowisko. Co pięć dni przysiółki przychodzą na targ.'],
  ['Pierwszy dzień targowy',()=>(S.e2.targN||0)>=1,'Dzień targowy przychodzi co pięć dni, gdy targowisko stoi, a osada ma choć jeden przysiółek.'],
  ['Spisz prawo zwyczajowe',()=>!!S.e2.prawo,'Potrzebny Dom osadników (serce osady, trzeci etap) i co najmniej cztery obyczaje, które trwają od dwóch lat. Wtedy wiec sam zbierze się, żeby je spisać.'],
  ['Każda rodzina w chacie albo domu',()=>{const f=Object.values(S.fams).filter(x=>famMembers(x.id).length);return f.length&&f.every(x=>{const h=x.home&&bById(x.home);return h&&h.kind!=='szalas'&&bDone(h)})},'Każda rodzina, także młode pary po weselu, potrzebuje chaty z bali albo domu z piecem. Szałas rozbudujesz w chatę z jego karty.']]},
 glab:{n:'W głąb wyspy',intro:'Wiec postanowił iść w głąb wyspy. Za lasami są krainy, w których nikt z nas jeszcze nie nocował. Trzeba je poznać, postawić stanicę, w której wyprawa przeczeka noc i zawieruchę, i założyć przysiółki daleko od brzegu.',g:[
  ['Poznaj wszystkie krainy',()=>e2Known()>=.95,'Wyprawy → zwiad. Krainę uznaje się za poznaną, gdy widać jej większą część.'],
  ['Postaw stanicę w głębi lądu',()=>hasDone('stanica'),'Budowa → Wspólnota → Stanica, co najmniej 30 kroków od ogniska.'],
  ['Trzy przysiółki',()=>(S.hamlets||[]).length>=3,'Ludzie → Wspólnota → nowy przysiółek. Młode rodziny chętnie odchodzą, gdy w osadzie brakuje domów.'],
  ['Droga do najdalszego przysiółka',()=>{const h=e2FarHam();return!!h&&h.road===2&&(S.hamlets||[]).length>=2},'Karta przysiółka → wytycz drogę. Najdalszy przysiółek potrzebuje jej najbardziej.']]},
 morze:{n:'Szkutnicy',intro:'Wiec postanowił wrócić na morze. Nikt nie zna drogi do domu i nikt jej już nie szuka. Ale woda wokół wyspy jest pełna ryb, a za horyzontem mogą być inne lądy. Najpierw trzeba nauczyć się budować łodzie.',g:[
  ['Postaw szkutnię',()=>hasDone('szkutnia'),'Budowa → Rzemiosło → Szkutnia. Stawia się ją na brzegu.'],
  ['Zbuduj dwie łodzie',()=>(S.e2.boats||0)>=2,'Cieśle w szkutni budują łódź z desek, gwoździ i płótna. Przydziel ich w karcie szkutni.'],
  ['Trzy rejsy wzdłuż brzegu',()=>(S.e2.rejsy||0)>=3,'Wyprawy → Rejs wzdłuż brzegu. Potrzebna łódź, trzy osoby i jedzenie na drogę.'],
  ['Łodzie rybackie przy dwóch pomostach',()=>anyExt('lodz')>=2,'Karta pomostu → Rozbudowa → Łódź rybacka.']]}};
const ROZ={
 dom:{t:'Gród czy otwarta wieś?',x:'Wiec zbiera się przy ogniu na rozstajach, tam, gdzie ścieżka z osady rozchodzi się do przysiółków. Starsi chcą wału i ostrokołu wokół domów, żeby nic już nie przyszło nocą. Młodzi mówią, że wyspa jest duża i ludzie powinni mieszkać tam, gdzie mają pola i łowiska.',o:[
  {id:'grod',n:'Gród z wałem i ostrokołem',d:'Brama i ostrokół wokół wsi. Za wałem wilki nie dostaną się do zagród, jest mniej strachu i sporów. Przysiółki będą trochę dalej od serca osady.',r:'Postanowiono: będzie gród. Najstarsi wbijają pierwszy pal tam, gdzie stanie brama.',song:'Pieśń o pierwszym palu'},
  {id:'wies',n:'Otwarta wieś z siecią przysiółków',d:'Drogi kosztują połowę, przysiółki rosną szybciej, a więź z nimi słabnie wolniej. Na targ przychodzi więcej ludzi.',r:'Postanowiono: bez wałów. Wyspa jest dość duża dla wszystkich, byle drogi łączyły domy.',song:'Pieśń o drogach między domami'}]},
 glab:{t:'Przez bagna czy przez góry?',x:'Za stanicą droga się rozwidla. W jedną stronę mokradła: torf na opał i ruda darniowa, ale też komary i gorączka. W drugą góry: kamień, jaskinie i żyły rudy w skale, ale też mróz i wiatr. Na obie strony nie starczy rąk.',o:[
  {id:'bagna',n:'Przez bagna',d:'Kopanki torfu dają opał bez ścinania lasu, a dymarka wytapia żelazo z rudy darniowej na torfie. Latem przy mokradłach łatwo o gorączkę bagienną.',r:'Postanowiono: idziemy przez bagna. Pierwsi kładą przez mokradło kładki z żerdzi.',song:'Pieśń o kładkach przez mokradło'},
  {id:'gory',n:'Przez góry',d:'Sztolnia daje rudę prosto ze skały, a piwnica w skale trzyma jedzenie dłużej niż spiżarnia. Zimy będą ostrzejsze: osada pali więcej opału.',r:'Postanowiono: idziemy w góry. Na grani ktoś układa znak z kamieni, żeby wracający trafili do domu.',song:'Pieśń o znaku na grani'}]},
 morze:{t:'Wielka łódź czy flotylla?',x:'Na brzegu przy szkutni stoją łodzie, a wszyscy patrzą w morze. Szkutnicy chcą zbudować jedną wielką łódź z masztem, która popłynie tam, skąd nie widać już wyspy. Rybacy wolą wiele małych łodzi: więcej ryb i mniej ryzyka.',o:[
  {id:'wielka',n:'Wielka łódź na dalekie wyprawy',d:'Szkutnia buduje wielką łódź w czterech etapach: stępka, wręgi, poszycie, maszt z żaglem. To dużo drewna i pracy, ale z nią osada popłynie daleko.',r:'Postanowiono: wielka łódź. Na pochylni kładą pierwszą kłodę na stępkę.',song:'Pieśń o stępce'},
  {id:'flotylla',n:'Flotylla łodzi rybackich',d:'Łodzie kosztują połowę, każda łódź na wodzie zwiększa połów przy pomostach, a wędzarnie dają zapas ryb na zimę.',r:'Postanowiono: flotylla. Każdy pomost dostanie swoją łódź, a dzieci uczą się wiosłować.',song:'Pieśń o łodziach o świcie'}]}};
const BIG=[{n:'Stępka',in:{drewno:2},need:24,d:'kłody na stępkę i dziobnicę'},{n:'Wręgi',in:{drewno:1,deski:1},need:30,d:'dębowe wręgi, jedna przy drugiej'},{n:'Poszycie',in:{deski:2,gwozdzie:3},need:36,d:'deski na zakładkę i smoła'},{n:'Maszt i żagiel',in:{drewno:1,plotno:1},need:26,d:'maszt z sosny i żagiel z płótna'}];
const E2B={
 grod:{n:'Gród',intro:'Gród zaczyna się od bramy. Kto wybiera miejsce na bramę, wybiera, jak duży będzie gród: ostrokół pójdzie od niej dookoła wsi.',g:[
  ['Postaw bramę grodu',()=>hasDone('brama'),'Budowa → Wspólnota → Brama grodu. Ostrokół obiegnie wieś w takiej odległości od ogniska, w jakiej stoi brama.'],
  ['Osiem domów za ostrokołem',()=>S.bld.filter(b=>bDone(b)&&BD[b.kind].house&&e2InWal(b)).length>=8,'Domy stawiaj bliżej ogniska niż brama.'],
  ['Serce osady za ostrokołem',()=>S.bld.some(b=>(b.kind==='domwsp'||(b.kind==='serce'&&(b.st||1)>=3))&&bDone(b)&&e2InWal(b)),'Dom osadników (albo wyższy etap serca osady) w grodzie, za wałem. Wał otacza serce osady, tak daleko jak brama.'],
  ['Gród: 40 osób',()=>S.people.length>=40,'Więcej domów i rodzin. Dzieci rodzą się w domach.']]},
 wies:{n:'Sieć przysiółków',intro:'Bez wałów i bram. Wieś jest tam, gdzie są nasi ludzie, a drogi łączą domy na całej wyspie.',g:[
  ['Cztery przysiółki',()=>(S.hamlets||[]).length>=4,'Ludzie → Wspólnota → nowy przysiółek.'],
  ['Drogi do wszystkich przysiółków',()=>(S.hamlets||[]).length>=2&&S.hamlets.every(h=>h.road===2),'Karta przysiółka → wytycz drogę. Drogi kosztują teraz połowę.'],
  ['Przysiółek urósł do osiedla',()=>(S.hamlets||[]).some(h=>(h.st||0)>=3),'Przysiółek rośnie, gdy ma pełne zapasy i silną więź.'],
  ['Wspólnota: 60 osób',()=>S.people.length+(S.hamlets||[]).reduce((a,h)=>a+h.pop,0)>=60,'Liczą się ludzie w osadzie i w przysiółkach.']]},
 bagna:{n:'Za bagnami',intro:'Na mokradłach zaczyna się nowa robota: cięcie torfu i wytop żelaza z rudy darniowej. Kto chodzi na bagna latem, niech bierze zioła.',g:[
  ['Postaw kopankę torfu',()=>hasDone('torfowisko'),'Budowa → Surowce → Kopanka torfu, na mokradle.'],
  ['Wykop 300 opału z torfu',()=>(S.e2.torf||0)>=300,'Kopanki pracują od wiosny do jesieni.'],
  ['Postaw dymarkę',()=>hasDone('dymarka'),'Budowa → Rzemiosło → Dymarka. Potrzebuje rudy i opału.'],
  ['Nowy przysiółek za bagnami',()=>(S.hamlets||[]).some(h=>h.day>(S.e2.t7||0)),'Ludzie → Wspólnota → nowy przysiółek.']]},
 gory:{n:'W górach',intro:'W górach kamień jest wszędzie, a w skale biegną żyły rudy. Wiatr na grani nie ustaje, a zima przychodzi wcześniej.',g:[
  ['Postaw sztolnię',()=>hasDone('sztolnia'),'Budowa → Surowce → Sztolnia, w górach albo przy skałach.'],
  ['Wydobądź 60 rudy ze skały',()=>(S.e2.rudaS||0)>=60,'Sztolnia daje rudę przez cały rok.'],
  ['Postaw piwnicę w skale',()=>hasDone('piwnica'),'Budowa → Magazyny → Piwnica w skale.'],
  ['Przysiółek w górach',()=>(S.hamlets||[]).some(h=>hType(h)==='high'),'Ludzie → Wspólnota → nowy przysiółek w górskiej krainie.']]},
 wielka:{n:'Wielka łódź',intro:'Na pochylni szkutni rośnie wielka łódź. Etap po etapie: najpierw stępka, potem wręgi, poszycie, a na końcu maszt i żagiel.',g:BIG.map((s,i)=>[s.n+' wielkiej łodzi',()=>(S.e2.big||0)>i,'Szkutnicy pracują w szkutni: '+s.d+'.'])},
 flotylla:{n:'Flotylla',intro:'Łodzie są teraz tańsze, a każda na wodzie to więcej ryb przy pomostach. Wędzarnie zamienią połów w zapas na zimę.',g:[
  ['Pięć łodzi',()=>e2Boats()>=5,'Łodzie w szkutni i łodzie rybackie przy pomostach liczą się razem.'],
  ['Wędzarnie przy dwóch pomostach',()=>anyExt('wedzarnia')>=2,'Karta pomostu → Rozbudowa → Wędzarnia. Pomost, który ma już łódź, trzeba najpierw ulepszyć do poziomu 2, żeby zmieścił drugą rozbudowę.'],
  ['Zapas: 300 ryb',()=>(S.res.ryby||0)>=300,'Rybacy na łodziach łowią więcej, a wędzarnie sprawiają, że ryby leżą dłużej.']]}};
const E2RN={6:'VI',7:'VII',9:'VIII',11:'IX'};
function e2Act(){const e=S.e2;return!e?null:e.a===6?E2A[S.path]:e.a===7?E2B[e.r1]:e.a===9&&e.r2&&typeof E2C!=='undefined'?E2C[e.r2]:e.a===11&&e.r3&&typeof E2D!=='undefined'?E2D[e.r3]:null}
function e2Init(){if(!S||S.epoch!==2||!PATHS[S.path])return;if(!S.e2){S.e2={a:6,g:{},t6:S.day,introQ:1,targN:0,torf:0,rudaS:0,boats:0,rejsy:0,big:0,bigP:0};S.tech=S.tech||{};}
 S.tech['e2_'+S.path]=1;if(S.e2.r1)S.tech['e2_'+S.e2.r1]=1;if(S.e2.r2)S.tech['e2_'+S.e2.r2]=1;if(S.e2.r3)S.tech['e2_'+S.e2.r3]=1;e2Keys()}
function e2Intro(){const A=e2Act();if(!A)return;const e=S.e2;openEvent({ey:'Epoka II · '+PATHS[S.path].n+' · Akt '+E2RN[e.a],t:A.n,text:()=>A.intro,opts:[{n:'Dalej',d:'',f:()=>{log(`Zaczyna się akt ${E2RN[e.a]}: ${A.n.toLowerCase()}.`);return A.g.map(g=>'· '+g[0]).join('\n')}}]},{})}
function e2Roz(){const R=ROZ[S.path];const e=S.e2;openEvent({ey:'Rozstaje · pierwsze rozdroże',t:R.t,text:()=>R.x+'\n\nTej decyzji nie da się cofnąć.',
 opts:R.o.map(o=>({n:o.n,d:o.d,f:()=>{e.r1=o.id;e.a=7;e.t7=S.day;S.tech['e2_'+o.id]=1;e2Keys();pamAdd(4,'rozdroze');song(o.song);log('Rozstaje: '+o.n.toLowerCase()+'. '+o.r);e.introQ=1;e2Apply();renderPanel();return o.r}}))},{})}
function e2Prawo(){const n=Object.keys(S.cust||{}).filter(k=>obyStage(k)>=1).length;openEvent({ey:wspName(),t:'Prawo zwyczajowe',
 text:()=>`Wiec zbiera się ${scSt()>=3?SERCE[scSt()].loc:'w chacie wiecowej'}. Starsi wyliczają obyczaje, których trzymamy się od lat: ${n} ${n<5?'obyczaje':'obyczajów'}. Młodzi chcą, żeby to, co dotąd było zwyczajem, stało się prawem dla wszystkich, także w przysiółkach. Pytanie tylko, kto ma je przechowywać.`,
 opts:[{n:'Prawo pamięta starszyzna',d:'spory gasną szybciej, starsi mają więcej do powiedzenia',f:()=>{S.e2.prawo='starsi';S.dis=Math.max(0,(S.dis||0)-.08);pamAdd(3,'prawo');song('Pieśń o prawie starszych');log('Prawo zwyczajowe: przechowuje je starszyzna. Każdy spór idzie najpierw do najstarszych.');return'Najstarsi powtarzają prawo na głos, słowo po słowie. Kto chce je znać, musi ich słuchać.'}},
  {n:'Prawo wyryte na słupie',d:'więcej pamięci i nadziei, prawo zna każdy',f:()=>{S.e2.prawo='slup';S.hope=clamp(S.hope+.05,0,1);pamAdd(5,'prawo');song('Pieśń o słupie prawa');log('Prawo zwyczajowe: wyryte znakami na słupie przed chatą wiecową.');return'Cieśle wycinają znaki na dębowym słupie. Dzieci uczą się ich jak pieśni.'}}]},{})}
function e2GoalsTick(){if(!S||S.epoch!==2)return;e2Init();const e=S.e2;if(!e)return;const A=e2Act();
 if(A){A.g.forEach((g,i)=>{const k=e.a+'_'+i;let ok=false;try{ok=g[1]()}catch(er){}if(!e.g[k]&&ok){e.g[k]=1;S.hope=clamp(S.hope+.04,0,1);log('Cel osiągnięty: '+g[0].toLowerCase()+'.');toast('Cel osiągnięty: '+g[0]);sfx('bell')}});
  if(A.g.every((g,i)=>e.g[e.a+'_'+i])){if(e.a===6&&!e.rozQ&&!e.r1)e.rozQ=1;else if(e.a===7){e.a=8;e.t8=S.day;pamAdd(5,'akt');log(`Akt VII zakończony: ${A.n.toLowerCase()}. Osada czeka na drugie rozdroże.`)}else if(e.a===9){e.a=10;e.t10=S.day;pamAdd(5,'akt');log(`Akt VIII zakończony: ${A.n.toLowerCase()}. Osada czeka na trzecie rozdroże.`);if(typeof e2Roz3!=='function')e.endQ=1}else if(e.a===11){e.a=12;e.t12=S.day;pamAdd(6,'akt');log(`Akt IX zakończony: ${A.n.toLowerCase()}.`);e.finQ2=1}}}
 if(e.a===10&&!e.r3&&!e.roz3Q&&S.day-(e.t10||0)>=1&&typeof e2Roz3==='function')e.roz3Q=1;
 if(e.a===8&&!e.r2&&!e.roz2Q&&S.day-(e.t8||0)>=1&&typeof e2Roz2==='function')e.roz2Q=1;
 if(evOpen||placing)return;
 if(e.introQ){e.introQ=0;e2Intro();return}
 if(e.rozQ&&isWork()){e.rozQ=0;e2Roz();return}
 if(e.prawoQ&&isWork()){e.prawoQ=0;e2Prawo();return}
 if(e.roz2Q&&isWork()){e.roz2Q=0;e2Roz2();return}
 if(e.roz3Q&&isWork()){e.roz3Q=0;e2Roz3();return}
 if(e.finQ2&&isWork()&&typeof e2Final==='function'){e.finQ2=0;e2Final();return}
 if(typeof e2Tick21==='function'&&e2Tick21())return;
 if(e.endQ){e.endQ=0;const B=e.r2&&typeof E2C!=='undefined'?E2C[e.r2]:E2B[e.r1];openEvent({ey:'Epoka II · '+PATHS[S.path].n,t:B.n+': gotowe',text:()=>'Wszystkie cele tego aktu są spełnione. Trzecie rozdroże tej drogi przyjdzie w następnej wersji gry. Do tego czasu osada żyje dalej, a wyspa czeka na kolejne przysiółki.',opts:[{n:'Dalej',d:'',f:()=>'Osada żyje dalej.'}]},{})}}
{const _gt=goalsTick;goalsTick=function(){_gt();try{e2GoalsTick()}catch(er){console.warn(er)}}}
{const _gi=goalInfo;goalInfo=function(){const g=_gi();if(!S||S.epoch!==2||!S.e2)return g;const e=S.e2,A=e2Act();if(!A){if(e.a===8&&!e.r2)return{ch:'Epoka II · '+PATHS[S.path].n,t:'Drugie rozdroże',d:'Wiec zbierze się na rozstajach po raz drugi, gdy przyjdzie pora pracy.'};if(e.a===10&&!e.r3&&typeof e2Roz3==='function')return{ch:'Epoka II · '+PATHS[S.path].n,t:'Trzecie rozdroże',d:'Wiec zbierze się na rozstajach po raz trzeci, gdy przyjdzie pora pracy.'};if(e.a===12&&e.endName&&g)return{ch:'Epoka II: '+e.endName,t:g.t,d:g.d};return g}
 const i=A.g.findIndex((x,i)=>!e.g[e.a+'_'+i]);if(i<0)return{ch:'Epoka II · '+PATHS[S.path].n,t:e.a===6?'Rozstaje':e.a===7?'Drugie rozdroże':e.a===9?'Trzecie rozdroże':'Koniec epoki II',d:e.a===6?'Wiec zbierze się na rozstajach, gdy przyjdzie pora pracy.':e.a===7?'Wiec zbierze się na rozstajach po raz drugi.':e.a===9?'Wiec zbierze się na rozstajach po raz trzeci.':'Wiec zbierze się, gdy przyjdzie pora pracy.'};
 const x=A.g[i];return{ch:`${PATHS[S.path].n} · Akt ${E2RN[e.a]} · ${A.n}`,t:x[0],d:x[2]}}}
// karta drogi w podsumowaniu osady
function e2HTML(){if(!S||S.epoch!==2||!S.e2)return'';const e=S.e2,A=e2Act();const P=PATHS[S.path];let h=`<div class="card e2c"><h4>Epoka II · ${P.n} <small>${P.q}</small></h4>`;
 if(e.r1){const o=ROZ[S.path].o.find(o=>o.id===e.r1);h+=`<p class="mut">Pierwsze rozdroże: <b>${o.n}</b>.</p>`}
 if(e.r2&&typeof ROZ2!=='undefined'){const o=ROZ2[S.path].o.find(o=>o.id===e.r2);if(o)h+=`<p class="mut">Drugie rozdroże: <b>${o.n}</b>.</p>`}
 if(e.r3&&typeof ROZ3!=='undefined'){const o=ROZ3[S.path].o.find(o=>o.id===e.r3);if(o)h+=`<p class="mut">Trzecie rozdroże: <b>${o.n}</b>.</p>`}
 if(e.endName)h+=`<p class="ok">Zakończenie epoki II: <b>${e.endName}</b>.</p>`;
 if(A){h+=`<p><b>Akt ${E2RN[e.a]} · ${A.n}</b></p><ul class="e2g">${A.g.map((g,i)=>`<li class="${e.g[e.a+'_'+i]?'ok':''}">${e.g[e.a+'_'+i]?'✓':'·'} ${g[0]}</li>`).join('')}</ul>`;if(e.a===6)h+=`<p class="mut">Potem: rozstaje. ${ROZ[S.path].t}</p>`}
 if(A&&e.a===7&&typeof ROZ2!=='undefined')h+=`<p class="mut">Potem: drugie rozdroże. ${ROZ2[S.path].t}</p>`;
 if(A&&e.a===9&&typeof ROZ3!=='undefined')h+=`<p class="mut">Potem: trzecie rozdroże. ${ROZ3[S.path].t}</p>`;
 if(A&&e.a===11)h+='<p class="mut">Potem: koniec epoki II i nazwa, pod którą osada przejdzie do pieśni.</p>';
 if(!A)h+=e.a===8?'<p class="mut">Akt VII zakończony. Wiec zbierze się na rozstajach po raz drugi.</p>':e.a===10?'<p class="mut">Akt VIII zakończony. Wiec zbierze się na rozstajach po raz trzeci.</p>':e.a===12&&!e.endName?'<p class="mut">Akt IX zakończony. Wiec zbierze się po raz ostatni w tej epoce.</p>':'';
 if(typeof e2HTML22==='function')h+=e2HTML22();
 if(typeof e2HTML21==='function')h+=e2HTML21();
 if(S.e2.r1==='wielka'&&hasDone('szkutnia')){const st=Math.min(S.e2.big||0,4);h+=`<p class="mut">Wielka łódź: ${st<4?BIG[st].n.toLowerCase()+' '+Math.round(100*(S.e2.bigP||0)/BIG[st].need)+'%':'gotowa, stoi przy szkutni'}.</p>`}
 return h+'</div>'}
{const _th=troubleHTML;troubleHTML=function(){const h=_th();try{return h+e2HTML()}catch(er){return h}}}
{const st=document.createElement('style');st.textContent='.e2c h4 small{display:block;font-weight:400;color:var(--mut);font-size:12px}.e2g{list-style:none;margin:4px 0;padding:0}.e2g li{padding:2px 0;color:var(--fg)}.e2g li.ok{color:var(--moss)}';document.head.appendChild(st)}
{const _kt=ksiegaText;ksiegaText=function(){let t=_kt();if(S&&S.e2&&S.path){const e=S.e2,L=['','EPOKA II · '+PATHS[S.path].n.toUpperCase(),''];
 const A=E2A[S.path];L.push(`Akt VI, ${A.n.toLowerCase()}: ${A.g.filter((g,i)=>e.g['6_'+i]).map(g=>g[0].toLowerCase()).join(', ')||'dopiero się zaczyna'}.`);
 if(e.r1){const o=ROZ[S.path].o.find(o=>o.id===e.r1);L.push(`Pierwsze rozdroże: ${o.n.toLowerCase()}. ${o.r}`);const B=E2B[e.r1];L.push(`Akt VII, ${B.n.toLowerCase()}: ${B.g.filter((g,i)=>e.g['7_'+i]).map(g=>g[0].toLowerCase()).join(', ')||'dopiero się zaczyna'}.`)}
 if(e.r2&&typeof ROZ2!=='undefined'){const o=ROZ2[S.path].o.find(o=>o.id===e.r2);L.push(`Drugie rozdroże: ${o.n.toLowerCase()}. ${o.r}`);const C=E2C[e.r2];L.push(`Akt VIII, ${C.n.toLowerCase()}: ${C.g.filter((g,i)=>e.g['9_'+i]).map(g=>g[0].toLowerCase()).join(', ')||'dopiero się zaczyna'}.`)}
 if(e.r3&&typeof ROZ3!=='undefined'){const o=ROZ3[S.path].o.find(o=>o.id===e.r3);L.push(`Trzecie rozdroże: ${o.n.toLowerCase()}. ${o.r}`);const D=E2D[e.r3];L.push(`Akt IX, ${D.n.toLowerCase()}: ${D.g.filter((g,i)=>e.g['11_'+i]).map(g=>g[0].toLowerCase()).join(', ')||'dopiero się zaczyna'}.`)}
 if(e.endName)L.push('',`ZAKOŃCZENIE EPOKI II: ${e.endName.toUpperCase()}`,'');
 if(e.targN)L.push(`Dni targowych: ${e.targN}.`);if(e.boats)L.push(`Łodzi zbudowanych w szkutni: ${e.boats}. Rejsów wzdłuż brzegu: ${e.rejsy||0}.`);t+='\n'+L.join('\n')}return t}}

// ---------- skutki dróg ----------
function e2Apply(){const e=S.e2;if(!e)return;if(e.r1==='wielka'){e.big=e.big||0;e.bigP=e.bigP||0}}
const e2R=id=>!!(S&&S.e2&&S.e2.r1===id);
// otwarta wieś: drogi za pół ceny
{const _rc=roadCost;roadCost=function(h){const c=_rc(h);if(e2R('wies')){c.drewno=Math.ceil(c.drewno/2);c.kamien=Math.ceil(c.kamien/2);c.dni=Math.max(1,Math.round(c.dni*.6))}return c}}
// gród: wilki nie wchodzą za wał
{const _hd=hamDng;hamDng=function(h){let d=_hd(h);if(S&&S.bld.some(b=>b.kind==='stanica'&&bDone(b)&&Math.hypot(bCenter(b).x-tcx(h.i),bCenter(b).z-tcx(h.j))<40))d-=.12;return Math.max(.05,d)}}
{const _ed=expDays;expDays=function(r,type){const d=_ed(r,type);return S&&S.bld&&S.bld.some(b=>b.kind==='stanica'&&bDone(b))?Math.max(2,Math.round(d*.8)):d}}
// flotylla: każda łódź na wodzie to więcej ryb
{const _bm=bMul;bMul=function(b){let m=_bm(b);if(b&&b.kind==='pomost'&&e2R('flotylla'))m*=1+Math.min(.3,.06*Math.floor(S.res.lodz||0));return m}}
// licznik torfu i rudy ze sztolni, łodzie, wielka łódź
{const _gm=gospMade;gospMade=function(b,r,v){const x=_gm(b,r,v);if(S&&S.e2&&b){if(b.kind==='torfowisko'&&r==='opal')S.e2.torf=(S.e2.torf||0)+v;if(b.kind==='sztolnia'&&r==='ruda')S.e2.rudaS=(S.e2.rudaS||0)+v;
 if(b.kind==='szkutnia'&&r==='lodz'){S.e2.boats=(S.e2.boats||0)+v;log(`W szkutni zwodowano łódź. Łodzi przy brzegu: ${Math.floor((S.res.lodz||0)+v)}.`);toast('Nowa łódź');sfx('bell')}}return x}}
function e2BoatWant(){const w=e2R('flotylla')?6:3;return (S.res.lodz||0)<w}
function e2SzkProd(){const half=e2R('flotylla');const boat={in:half?{deski:6,gwozdzie:8,plotno:1}:{deski:12,gwozdzie:16,plotno:2},out:{lodz:1},t:half?150:240,when:()=>e2BoatWant()};
 if(S&&S.e2&&S.e2.r1==='wielka'&&(S.e2.big||0)<4){const st=BIG[S.e2.big];return[{in:st.in,out:{_wl:1},t:20},boat]}return boat}
function e2BigTick(){const e=S.e2;if(!e||e.r1!=='wielka'||(e.big||0)>=4)return;const w=S.res._wl||0;if(w<=0)return;S.res._wl=0;e.bigP=(e.bigP||0)+w;const st=BIG[e.big];
 if(e.bigP>=st.need){e.bigP=0;e.big++;log(`Wielka łódź: ${st.n.toLowerCase()} gotowe.${e.big<4?' Teraz '+BIG[e.big].n.toLowerCase()+'.':' Łódź stoi gotowa przy szkutni. Dzieci nie odchodzą od niej na krok.'}`);toast('Wielka łódź: '+st.n.toLowerCase()+' gotowe');sfx('bell');
  S.bld.filter(b=>b.kind==='szkutnia').forEach(b=>{try{rebuildMesh(b)}catch(er){}});if(e.big>=4){song('Pieśń o wielkiej łodzi');pamAdd(4,'lodz')}}}
// gorączka bagienna
ILL.bagienna=['gorączka bagienna','komary i wilgoć mokradeł',.028,.6,4,'gorączkę bagienną'];
// targ, gród, góry, bagna: codziennie
function e2Targ(){const hs=S.hamlets||[];if(!hs.length)return;const mul=e2R('wies')?1.5:1;const got={};
 hs.forEach((h,q)=>{hamGifts(h).forEach(([k,v])=>{const n=Math.round(v*(1+h.pop/8)*mul*(.7+Math.random()*.6));if(n>0){S.res[k]=(S.res[k]||0)+n;got[k]=(got[k]||0)+n}});
  h.zap=Math.min(1,(h.zap||0)+.12);h.wiez=Math.min(1,(h.wiez||0)+.05);for(let w=0;w<2;w++)spawnWalker(h,-1,null,1,q*.5+w*.3)});
 S.e2.targN=(S.e2.targN||0)+1;S.hope=clamp(S.hope+.012,0,1);
 log(`Dzień targowy. Z przysiółków przyszli ludzie: ${Object.entries(got).map(([k,v])=>RN[k].toLowerCase()+' '+v).join(', ')}. Wracają z narzędziami, solą i nowinami.`);toast('Dzień targowy');if(S.e2.targN===1)song('Pieśń o pierwszym targu')}
function e2Daily(){if(!S||S.epoch!==2||!S.e2)return;const e=S.e2,sea=seasonIdx(),d=Math.floor(S.day);
 if(S.path==='dom'&&!e.prawo&&!e.prawoQ&&wspOn()&&e2OldCust(4))e.prawoQ=1;
 if(hasDone('targ')&&d%5===0&&e.targD!==d){e.targD=d;e2Targ()}
 if(e.r1==='grod'&&e.wal){S.dis=Math.max(0,(S.dis||0)-.003);(S.hamlets||[]).forEach(h=>h.wiez=Math.max(.1,(h.wiez||0)-.002))}
 if(e.r1==='wies'){(S.hamlets||[]).forEach(h=>{h.wiez=Math.min(1,(h.wiez||0)+.003);if((h.zap||0)>.5&&Math.random()<.04){h.pop++;if(Math.random()<.4)log(`W przysiółku ${h.name} przybyło ludzi: ${h.pop} ${osb(h.pop)}.`)}})}
 if(e.r1==='gory'&&sea===2){const hh=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;S.res.opal=Math.max(0,S.res.opal-K*.12*hh)}
 if(e.r1==='bagna'&&sea===0){const at=S.people.filter(p=>p.wb&&(()=>{const b=bById(p.wb);return b&&(b.kind==='torfowisko'||b.kind==='ruda')})());let n=0;at.forEach(p=>{if(Math.random()<.035*KF*(tech('u_ziel')?.6:1)&&__rok.illGive(p,'bagienna'))n++});
  if(n)log(`${n>1?'Zachorowały '+n+' osoby':'Ktoś zachorował'}: gorączka bagienna. Przyczyna: komary i wilgoć mokradeł.`)}
 if(hasDone('piwnica'))FOOD.forEach(k=>{const v=S.res[k]||0;if(v>0)S.res[k]=v+v*SPOIL[k]*K*.2});
 e2BigTick()}
{const _nd=newDay;newDay=function(){_nd();try{e2Daily()}catch(er){console.warn(er)}}}
{const _dg=dogGuard;dogGuard=function(){const v=_dg();return e2R('grod')&&S.e2.wal?v*.15:v}}

// ---------- rejsy wzdłuż brzegu ----------
let e2CoastT=null;
function e2Coast(){if(e2CoastT)return e2CoastT;const cx=N/2,cz=N/2;const L=[];for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const k=j*N+i;if(!land[k]||!beach[k])continue;L.push([i,j,Math.atan2(j-cz,i-cx)])}return e2CoastT=L}
function e2RejsCands(){return expCandidates(3)}
function e2RejsWhy(){if(!hasDone('szkutnia'))return'Najpierw trzeba postawić szkutnię.';if((S.res.lodz||0)<1)return'Nie ma wolnej łodzi. Szkutnia musi ją najpierw zbudować.';if(S.exps.some(e=>e.type==='rejs'))return'Jedna łódź jest już w rejsie.';if(e2RejsCands().length<3)return'Za mało wolnych, zdrowych ludzi (3).';if(foodTotal()<K*3*4)return'Za mało jedzenia na drogę.';return''}
function e2Rejs(){const why=e2RejsWhy();if(why){toast(why);return}const sz=S.bld.find(b=>b.kind==='szkutnia'&&bDone(b));const ppl=e2RejsCands();const days=4,food=Math.ceil(K*3*days);
 const tot=foodTotal();FOOD.forEach(k=>{S.res[k]-=food*(S.res[k]/tot)});S.res.lodz-=1;const ex=entryOf(sz.kind,sz.i,sz.j)||[camp.i,camp.j];
 const arc=(S.e2.rejsy||0)%3;const e={id:(S.expN=(S.expN||0)+1),r:0,type:'rejs',ppl:ppl.map(p=>p.id),days,left:days,exit:ex,risk:.08*wxSea()*(seasonIdx()===2?1.6:1),arc};S.exps.push(e);
 ppl.forEach(p=>{release(p);p.path=null;p.state='idle';p.wait=0;p.job='wyp';p.wb=null;p.exp=e.id;p.act='wypływa w rejs wzdłuż brzegu'});
 log(`Łódź wypływa w rejs wzdłuż brzegu. Płyną: ${ppl.map(p=>p.name).join(', ')}. Wrócą za ${days} dni.`);toast('Łódź wypłynęła');assign();renderPanel()}
{const _fe=finishExp;finishExp=function(e,out){if(e.type!=='rejs')return _fe(e,out);S.exps=S.exps.filter(x=>x!==e);const lines=[];
 const C=e2Coast(),a0=-Math.PI+e.arc*2.0944;let rv=0;C.forEach(([i,j,a])=>{let d=a-a0;while(d<0)d+=6.283;if(d<2.2&&!rev[j*N+i]){reveal(i,j,5);rv++}});regionScan(true);
 const lost=Math.random()<e.risk*.35;if(!lost)S.res.lodz=(S.res.lodz||0)+1;
 out.forEach(p=>{if(Math.random()<e.risk){p.hp=Math.max(.35,p.hp-.2);p.hurt=1;lines.push(p.name+' wraca przemarznięty i potłuczony.')}gainXp(p,'rybak',40)});
 const ry=Math.round(30+Math.random()*40),sk=Math.round(2+Math.random()*4),dr=Math.round(Math.random()*14);S.res.ryby+=ry;S.res.skory+=sk;S.res.drewno+=dr;
 lines.unshift(['Opłynęli cypel, za którym nikt z nas jeszcze nie był.','Na skałach przy brzegu siedziały setki ptaków.','Morze było spokojne, a woda tak czysta, że widać było dno.','Trzy dni wiał wiatr od lądu i ledwo wrócili.'][(Math.random()*4)|0]);
 lines.push(`Przywieźli: ryby ${ry}, skóry fok ${sk}${dr?', drewno z wyrzutów '+dr:''}.`);if(rv)lines.push('Na mapie przybyło wybrzeża.');if(lost)lines.push('Łodzi nie udało się uratować: rozbiła się o skały przy powrocie. Ludzie wrócili brzegiem.');
 S.e2.rejsy=(S.e2.rejsy||0)+1;techXp('nauka',10);
 out.forEach(p=>{p.job='rob';p.exp=null;p.state='idle';const st=e.exit;p.x=tcx(st[0]);p.z=tcx(st[1]);p.wait=.2});
 S.expLog=S.expLog||[];S.expLog.unshift({d:Math.floor(S.day)+1,r:'Rejs wzdłuż brzegu',t:lines.join(' ')});if(S.expLog.length>8)S.expLog.pop();
 log('Rejs wraca. '+lines.join(' '));toast('Łódź wróciła z rejsu');if(S.e2.rejsy===1)song('Pieśń o pierwszym rejsie');assign();renderPanel()}}
{const _eh=expHTML;expHTML=function(){let h=_eh();if(!S||!S.e2||S.path!=='morze')return h;const why=e2RejsWhy();const on=S.exps.find(e=>e.type==='rejs');
 const card=`<div class="card"><h4>Rejs wzdłuż brzegu</h4><p>Łódź z szkutni i trzy osoby płyną cztery dni wzdłuż brzegu wyspy. Przywożą ryby i skóry fok, a każda wyprawa odsłania inny kawał wybrzeża. Przy sztormie i zimą łatwiej o wypadek.</p><p class="mut">Łodzi przy brzegu: ${Math.floor(S.res.lodz||0)} · rejsów: ${S.e2.rejsy||0}</p>${on?`<p class="ok">Łódź jest w rejsie. Powrót za ${on.left} dni.</p>`:why?`<p class="no">${why}</p>`:'<button class="pri" data-rejs="1">Wypłyń</button>'}</div>`;
 return card+h}}
document.addEventListener('click',e=>{if(e.target.closest('[data-rejs]')&&S){e2Rejs()}});

// ---------- gród: wał i ostrokół od bramy dookoła wsi ----------
const walG=new THREE.Group();scene.add(walG);let walKey='';
const mPal=TM(TX.logs,0xc4b49c);
function e2WalSet(b){const c=bCenter(b);const sf=typeof scC==='function'&&scC();const cx=sf?sf.x:tcx(camp.i),cz=sf?sf.z:tcx(camp.j);S.e2.wal={x:cx,z:cz,r:Math.max(6,Math.hypot(c.x-cx,c.z-cz)),a:Math.atan2(c.z-cz,c.x-cx)};const w=S.e2.wal;
 nodeBy.tree.forEach(n=>{if(n.amt>0&&Math.abs(Math.hypot(n.x-w.x,n.z-w.z)-w.r)<1.3){n.amt=0;const q=nodes.indexOf(n);if(q>=0)S.nodeAmt[q]=0;nodeVis(n)}});e2WalBuild()}
function e2WalBuild(){const w=S&&S.e2&&S.e2.wal;const key=w?w.r.toFixed(2)+'|'+S.bld.length:'';if(key===walKey)return;walKey=key;
 walG.children.slice().forEach(o=>{walG.remove(o);if(o.geometry)o.geometry.dispose()});if(!w)return;
 const n=Math.floor(w.r*6.283/.3);const P=[],B=[];const gi=S.bld.find(b=>b.kind==='brama');
 for(let q=0;q<n;q++){const a=q/n*6.283;let da=a-w.a;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;if(Math.abs(da)*w.r<1.3)continue;
  const x=w.x+Math.cos(a)*w.r,z=w.z+Math.sin(a)*w.r;const t=tileOf(x,z),k=t[1]*N+t[0];if(!land[k])continue;if(occ[k]>=0&&occ[k]!==999)continue;let near=false;for(const[di,dj]of[[1,0],[-1,0],[0,1],[0,-1]]){const kk=k+dj*N+di;if(occ[kk]>=0&&occ[kk]!==999&&Math.hypot(x-tcx(t[0]+di),z-tcx(t[1]+dj))<.8)near=true}if(near)continue;
  const y=Hy(x,z);P.push([x,y,z,a,.9+((q*7919)%13)/40]);if(q%3===0)B.push([x,y,z,a])}
 const pg=new THREE.CylinderGeometry(.11,.12,1,6);pg.translate(0,.5,0);const tip=new THREE.ConeGeometry(.12,.28,6);tip.translate(0,1.14,0);
 const geo=e2Merge([pg,tip]);const im=new THREE.InstancedMesh(geo,mPal,P.length);const m4=new THREE.Matrix4(),q4=new THREE.Quaternion(),e4=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3();
 P.forEach(([x,y,z,a,h],i)=>{e4.set((Math.sin(i*3.1)*.04),a,Math.cos(i*2.3)*.04);q4.setFromEuler(e4);m4.compose(v.set(x,y+.02,z),q4,s.set(1,1.15*h,1));im.setMatrixAt(i,m4)});im.castShadow=true;im.receiveShadow=true;walG.add(im);
 const bank=new THREE.InstancedMesh(new THREE.BoxGeometry(1.15,.32,.9),TM(TX.thatch,0x6a7a4a),B.length);B.forEach(([x,y,z,a],i)=>{e4.set(0,-a+Math.PI/2,0);q4.setFromEuler(e4);m4.compose(v.set(x-Math.cos(a)*.35,y+.02,z-Math.sin(a)*.35),q4,s.set(1,1,1));bank.setMatrixAt(i,m4)});bank.receiveShadow=true;walG.add(bank)}
function e2Merge(list){let tot=0;const parts=list.map(g=>{const n=g.index?g.toNonIndexed():g;tot+=n.attributes.position.count;return n});const P=new Float32Array(tot*3),Nn=new Float32Array(tot*3),U=new Float32Array(tot*2);let o=0;
 parts.forEach(g=>{P.set(g.attributes.position.array,o*3);Nn.set(g.attributes.normal.array,o*3);if(g.attributes.uv)U.set(g.attributes.uv.array,o*2);o+=g.attributes.position.count});const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.BufferAttribute(P,3));m.setAttribute('normal',new THREE.BufferAttribute(Nn,3));m.setAttribute('uv',new THREE.BufferAttribute(U,2));return m}
{const _cs=completeSite;completeSite=function(s){_cs(s);if(!S.e2)return;if(s.kind==='brama'){e2WalSet(s);log('Brama stoi. Przez całe lato ludzie sypią wał i wbijają ostrokół dookoła wsi.');song('Pieśń o bramie grodu');pamAdd(3,'grod')}
 if(s.kind==='stanica'){reveal(s.i,s.j,18);regionScan(true);log('Stanica stoi w głębi lądu. Z jej pomostu widać daleko.')}if(s.kind==='szkutnia'&&!S.e2.szk){S.e2.szk=1;song('Pieśń o pierwszej łodzi')}}}

// ---------- łodzie na wodzie ----------
const boatG=new THREE.Group();scene.add(boatG);const boats=[];let boatWater=null;
function e2BoatMesh(sail){const b=new THREE.Group();const hull=new THREE.Mesh(hullGeo(1.6,.36,.3,10,6),mHullD);hull.position.y=-.24;hull.castShadow=true;b.add(hull);
 for(const z of[-.35,.25])b.add(tbox(.6,.04,.12,mPlank,0,-.02,z,0,1.5));
 if(sail){b.add(cyl(.025,1.5,matDark,0,.75,.05,0,0,0,5));const sl=new THREE.Mesh(new THREE.PlaneGeometry(.75,.9),mCanvas);sl.position.set(0,.9,.08);sl.rotation.y=Math.PI/2;b.add(sl);b.userData.sail=sl}
 else{b.add(cyl(.02,1.0,matWood,.22,.05,.1,0,.4,Math.PI/2.3,4));b.add(cyl(.02,1.0,matWood,-.22,.05,.1,0,-.4,-Math.PI/2.3,4))}
 b.traverse(o=>{if(o.isMesh){o.castShadow=true}});return b}
function e2WaterPts(){if(boatWater)return boatWater;const L=[];for(let j=2;j<N-2;j+=1)for(let i=2;i<N-2;i+=1){const k=j*N+i;if(land[k])continue;if(Math.hypot(i-camp.i,j-camp.j)>34)continue;let dl=9;for(let r=1;r<=5&&dl===9;r++)for(let a=0;a<8;a++){const x=Math.round(i+Math.cos(a*.785)*r),y=Math.round(j+Math.sin(a*.785)*r);if(x>=0&&y>=0&&x<N&&y<N&&land[y*N+x]){dl=r;break}}if(dl>=2&&dl<=5)L.push([tcx(i),tcx(j)])}return boatWater=L}
function e2LineWet(x0,z0,x1,z1){const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/.6);for(let q=1;q<n;q++){const t=tileOf(x0+(x1-x0)*q/n,z0+(z1-z0)*q/n);if(land[t[1]*N+t[0]])return false}return true}
function e2BoatTick(rdt){if(!S||!S.e2||S.path!=='morze'){if(boats.length){boats.forEach(b=>boatG.remove(b.m));boats.length=0}return}
 const want=Math.min(7,Math.floor(S.res.lodz||0)+(e2R('flotylla')?anyExt('lodz'):0));const W=e2WaterPts();if(!W.length)return;
 while(boats.length<want){const p=W[(Math.random()*W.length)|0];const m=e2BoatMesh(boats.length%2===0||e2R('wielka'));m.position.set(p[0],0,p[1]);boatG.add(m);boats.push({m,tx:p[0],tz:p[1],w:Math.random()*4})}
 while(boats.length>want){const b=boats.pop();boatG.remove(b.m)}
 const sp=(S.speed||0)>0?rdt*Math.min(3,S.speed):0;const night=!isWork();const t=performance.now()/1000;
 boats.forEach((b,q)=>{const m=b.m;const dx=b.tx-m.position.x,dz=b.tz-m.position.z,d=Math.hypot(dx,dz);
  if(d<.3){b.w-=sp;if(b.w<=0&&!night){for(let k=0;k<8;k++){const p=W[(Math.random()*W.length)|0];if(Math.hypot(p[0]-m.position.x,p[1]-m.position.z)<16&&e2LineWet(m.position.x,m.position.z,p[0],p[1])){b.tx=p[0];b.tz=p[1];break}}b.w=2+Math.random()*6}}
  else{const v=Math.min(d,sp*.55);m.position.x+=dx/d*v;m.position.z+=dz/d*v;const a=Math.atan2(dx,dz);let da=a-m.rotation.y;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;m.rotation.y+=da*Math.min(1,rdt*2)}
  m.position.y=-.02+Math.sin(t*1.3+q)*.03;m.rotation.z=Math.sin(t*1.1+q*2)*.05;m.visible=!overview})}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{e2BoatTick(rdt);if(S&&S.e2&&S.e2.wal&&!walG.children.length)e2WalBuild();walG.visible=!!(S&&S.e2&&S.e2.wal)}catch(er){}}}
// przy wczytaniu: klucze budowli, wał
{const _bt=boot;boot=function(fresh){_bt(fresh);try{boats.forEach(b=>boatG.remove(b.m));boats.length=0;boatWater=null;walKey='';if(S&&S.epoch===2){e2Init();if(S.e2&&S.e2.wal)e2WalBuild()}else e2Keys()}catch(er){console.warn(er)}}}

window.__e2={pickB:(x,y)=>pick(x,y,[bGroup]).slice(0,3).map(h=>[h.object.userData.bid,h.object.visible,h.distance.toFixed(1)]),e2Rejs,e2Targ,e2Daily,e2GoalsTick,e2WalBuild,e2Coast,get boats(){return boats},walG,E2A,E2B,ROZ,e2Boats,e2HTML,e2SzkProd,e2BigTick};
