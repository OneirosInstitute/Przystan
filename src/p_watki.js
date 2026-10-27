
/* ================= 4.9.0-rc.16 Wątki: historie, które trwają kilka dni ================= */
// Wątek to historia dwóch osób w pięciu krokach: zalążek, dwa kroki narastania, punkt zwrotny (jedna karta z wyborem)
// i rozwiązanie, które zostawia ślad we wspomnieniach i w kronice. Krok przychodzi dopiero, gdy minie jego czas
// i obie osoby są w osadzie. Naraz najwyżej 3 wątki, jedna osoba w jednym, najwyżej jedna karta wątku na dzień gry.
// Ten pakiet: romans (przejmuje swaty) i konflikt. Złe zakończenia romansów dopiero w epoce IV (tam wątki jeszcze nie
// działają), a bójka, kradzież, podpalenie i wygnanie przez wiec dopiero od epoki III (decyzje z 27.10.2026).
const WAT_MAX=3,WAT_TICK=.25,WAT_GAP=[.8,1.6],WAT_NAME={romans:'Zaloty',konflikt:'Spór'},WAT_END_KEEP=30;
let watNext=0;const watQ=[];
function watS(){if(!S.watki)S.watki={n:1,a:[],z:[],nast:0,karta:-9,seed:[],ost:{}};const W=S.watki;W.a=W.a||[];W.z=W.z||[];W.seed=W.seed||[];W.ost=W.ost||{};return W}
const watOn=()=>!!(S&&S.people&&S.people.length&&(S.epoch||1)<4);
const watHere=p=>!!p&&p.state!=='away'&&!p.lost&&p.job!=='wyp'&&!p.e4Transport;
function watOf(p){if(!p||!S||!S.watki)return null;return S.watki.a.find(w=>w.a===p.id||w.b===p.id)||null}
const watBusy=p=>!!watOf(p);
const watPeople=w=>[pById(w.a),pById(w.b)];
const watPick=a=>a[(Math.random()*a.length)|0];
const watGap=()=>WAT_GAP[0]+Math.random()*(WAT_GAP[1]-WAT_GAP[0]);
const watEra=()=>S.epoch||1;
const watSingle=p=>p&&(p.pair===null||p.pair===undefined)&&p.age>=16&&p.age<=40&&!p.waitHome;
const watWed=p=>!!(S.wed&&(S.wed.k===p.id||S.wed.m===p.id));// swaty zaplanowane po staremu
function watLovers(a,b){return watSingle(a)&&watSingle(b)&&a!==b&&wedOk(a,b)&&Math.abs(a.age-b.age)<12&&!watWed(a)&&!watWed(b)}

// ---------- start, krok, koniec ----------
function watStart(t,A,B,o){o=o||{};if(!watOn()||!A||!B||A===B||watBusy(A)||watBusy(B)||watWed(A)||watWed(B))return null;const W=watS();if(W.a.length>=WAT_MAX)return null;
 const w={id:W.n++,t,a:A.id,b:B.id,an:A.name,bn:B.name,st:0,d0:Math.floor(S.day),dn:S.day+watGap(),kroki:[],x:{}};W.a.push(w);W.ost[t]=S.day;W.nast=S.day+.6;
 if(o.text){w.kroki.push([Math.floor(S.day),o.text]);w.st=1}// zalążkiem była już scena, która to zaczęła
 else{const txt=WAT_STEP[t][0](w,A,B);if(txt)watSay(w,A,txt);w.st=1}
 if(o.st)w.st=o.st;return w}
function watSay(w,p,txt){w.kroki.push([Math.floor(S.day),txt]);if(w.kroki.length>10)w.kroki.splice(1,1);log(txt);dayEv(p,'watek',w.t);watBubble(p,txt,WAT_NAME[w.t])}
// quiet: tekst trafia do rozdziału wątku, ale nie drugi raz do kroniki (wynik karty zapisuje już obsługa karty)
function watEnd(w,k,txt,quiet){const W=watS();W.a=W.a.filter(x=>x!==w);if(txt){w.kroki.push([Math.floor(S.day),txt]);if(!quiet)log(txt)}
 W.z.unshift({id:w.id,t:w.t,an:w.an,bn:w.bn,d0:w.d0,d1:Math.floor(S.day),k,kroki:w.kroki.slice(-6)});if(W.z.length>WAT_END_KEEP)W.z.length=WAT_END_KEEP;
 W.nast=Math.max(W.nast||0,S.day+1);if(W.kartaW===w.id)W.kartaW=null}

// ---------- romans ----------
const WAT_STEP={romans:[
 // zalążek (gdy wątek nie zaczął się od sceny)
 (w,A,B)=>watPick([
  `${A.name} przynosi wodę pod dom ${gen(B.name)}, chociaż nikt ${gw(A,'go','jej')} o to nie prosił.`,
  `${A.name} ${gw(A,'zostawił','zostawiła')} przed drzwiami ${gen(B.name)} garść poziomek zawiniętych w liść łopianu.`,
  `Przy pracy ${A.name} raz po raz ${gw(A,'zerka','zerka')} na ${acc(B.name)}. Ktoś to zauważył i już się uśmiecha.`]),
 // narastanie: wieczory razem
 (w,A,B)=>{relAdd(A,B,8);memAdd(A,'zalot',B.name);memAdd(B,'zalot',A.name);return watPick([
  `Wieczorem ${A.name} i ${B.name} siedzą przy ogniu dłużej niż inni. Rozmawiają cicho, a kiedy ktoś podchodzi, milkną.`,
  `${A.name} i ${B.name} wracają razem znad strumienia. Niosą jeden dzban, choć mogliby dwa.`,
  `${B.name} ${gw(B,'zaszył','zaszyła')} ${gen(A.name)} rozdartą koszulę. Mówi, że to nic takiego. Wszyscy wiedzą swoje.`])},
 // narastanie: plotka albo rywal
 (w,A,B)=>{const C=sPick(q=>q!==A&&q!==B&&q.sex===A.sex&&watSingle(q)&&!watBusy(q)&&relGet(q,B)>=15);
  if(C){relAdd(C,A,-10);memAdd(C,'klotnia',A.name);w.x.rywal=C.id;return`${C.name} też ${gw(C,'patrzył','patrzyła')} na ${acc(B.name)}. Teraz ${gw(C,'chodzi markotny','chodzi markotna')} i nie odzywa się do ${gen(A.name)}.`}
  relAdd(A,B,6);return watPick([
   `Przy studni wszyscy już wiedzą: ${A.name} i ${B.name}. ${B.name} czerwieni się, kiedy ktoś o to pyta.`,
   `Dzieci biegają za ${gw(A,'nim','nią')} i śpiewają przezwiskę o ${gen(B.name)}. ${A.name} udaje, że nie słyszy.`])}
],konflikt:[
 (w,A,B)=>{relAdd(A,B,-10);memAdd(A,'klotnia',B.name);memAdd(B,'klotnia',A.name);const o=watPick(['deski z wraku','miejsce pod dachem','to, kto pierwszy bierze wodę ze źródła','pożyczoną i niezwróconą siekierę','drewno, które ktoś wziął z cudzego stosu']);
  return`${A.name} i ${B.name} kłócą się o ${o}. Nikt nie chce ustąpić.`},
 (w,A,B)=>{relAdd(A,B,-8);return watPick([
  `Rano ${B.name} ${gw(B,'znalazł','znalazła')} swoje narzędzia rozrzucone w błocie. Mówi głośno, że wie, kto to zrobił.`,
  `${A.name} odchodzi od ognia, kiedy przysiada się ${B.name}. Wszyscy to widzą.`,
  `${A.name} mówi przy studni, że ${B.name} ${gw(B,'pracuje','pracuje')} za dwóch, ale je za trzech. Słowa szybko wracają.`])},
 (w,A,B)=>{const fa=S.people.filter(q=>q.fam===A.fam&&q!==A&&q.age>=16),fb=S.people.filter(q=>q.fam===B.fam&&q!==B&&q.age>=16);fa.forEach(x=>fb.forEach(y=>relAdd(x,y,-2)));
  if(watEra()>=3){const k=watPick(['bojka','kradziez','podpalenie']);w.x.esk=k;
   if(k==='bojka'){A.hp=Math.max(.3,A.hp-.06);B.hp=Math.max(.3,B.hp-.06);relAdd(A,B,-10);return`Za kuźnią dochodzi do bójki. ${A.name} i ${B.name} tarzają się w błocie, zanim ktoś ich rozdzieli. Oboje chodzą z podbitymi oczami.`}
   if(k==='kradziez'){const q=Math.min(8,Math.floor(S.res.ziarno||0));S.res.ziarno=(S.res.ziarno||0)-q;relAdd(A,B,-10);return`Ze spichrza znika worek ziarna${q?'':' i kosz suszonych ryb'}. ${B.name} wskazuje na ${acc(A.name)}, a ${A.name} przysięga, że nic nie ${gw(A,'wziął','wzięła')}.`}
   const q=Math.min(15,Math.floor((S.res.ziarno||0)*.2));S.res.ziarno=(S.res.ziarno||0)-q;relAdd(A,B,-12);return`W nocy płonie sterta snopków za domem ${gen(B.name)}. Nikt nic nie widział, ale ${A.name} ${gw(A,'miał','miała')} ostatnio dużo do powiedzenia.`}
  return`Do sporu ${gen(A.name)} i ${gen(B.name)} wtrącają się ich rodziny. Przy studni ludzie stają po dwóch stronach.`}
]};

// ---------- punkt zwrotny: karta z wyborem ----------
function watParent(child,other){const ps=(child.par||[]).map(pById).filter(q=>q&&q.age>=30);return ps.find(q=>relGet(q,other)<10)||null}
function watElder(w){return S.people.filter(q=>q.age>=50&&q.id!==w.a&&q.id!==w.b&&watHere(q)).sort((x,y)=>mirOf(y)-mirOf(x))[0]||null}
function watCard(w){const[A,B]=watPeople(w);if(!A||!B)return false;const W=watS();W.karta=S.day;W.kartaW=w.id;w.x.karta=1;S.evT=Math.max(S.evT||0,S.day+.8);
 const ev={id:'watek',ey:WAT_NAME[w.t],t:`${w.an} i ${w.bn}`,quick:true,text:()=>watCardText(w,A,B),opts:watCardOpts(w,A,B).map(o=>({n:o.n,d:o.d,f:()=>watChoose(w.id,o.k)}))};
 openEvent(ev,{});return true}
function watCardText(w,A,B){const dni=Math.max(1,Math.floor(S.day)-w.d0);
 if(w.t==='romans'){const P=watParent(B,A)||watParent(A,B);w.x.rodzic=P?P.id:null;
  if(P){const ch=(B.par||[]).includes(P.id)?B:A;return`${A.name} i ${B.name} chcą być razem. Ale ${P.name}, ${gw(P,'ojciec','matka')} ${gen(ch.name)}, kręci głową: „Za wcześnie. I nie z tej rodziny”.\n\nTrwa to już ${dni} ${dniW(dni)}. Ktoś musi zdecydować, co dalej.`}
  return`${A.name} i ${B.name} chodzą wokół siebie od ${dni} ${dni===1?'dnia':'dni'}. Cała osada to widzi, tylko oni udają, że nic się nie dzieje.\n\nKtoś musi zrobić pierwszy krok.`}
 const E=watElder(w);w.x.starszy=E?E.id:null;
 const why={bojka:' Po bójce za kuźnią nikt już nie udaje, że to drobiazg.',kradziez:' Od zniknięcia ziarna nikt nikomu nie ufa.',podpalenie:' Po pożarze snopków ludzie zamykają drzwi na noc.'}[w.x.esk]||'';
 return`Spór ${gen(A.name)} i ${gen(B.name)} trwa już ${dni} ${dniW(dni)}.${why} Praca idzie gorzej, a przy ogniu ludzie siadają po dwóch stronach.\n\nTrzeba to rozstrzygnąć.`}
function watCardOpts(w,A,B){
 if(w.t==='romans'){const P=w.x.rodzic?pById(w.x.rodzic):null;return[
  {k:'swaty',n:'Niech swaci idą z chlebem i solą',d:P?'wesele za kilka dni, gorycz u '+gen(P.name):'wesele za kilka dni'},
  {k:'wiosna',n:'Niech poczekają do wiosny',d:'spokój w rodzinie, młodzi markotni'},
  {k:'sami',n:'Zostawić to im',d:'niech sami zdecydują'}]}
 const E=w.x.starszy?pById(w.x.starszy):null,L=[];
 if(E)L.push({k:'starszy',n:`Niech ${E.name} ich pogodzi`,d:usp(E,'lagodny')?gw(E,'łagodny','łagodna')+', ma posłuch':'może się udać, może nie'});
 L.push({k:'sad',n:'Sąd na wiecu',d:'rozstrzygnie, ale ktoś wyjdzie z niczym'});
 L.push({k:'razem',n:'Niech pracują razem przy jednym dachu',d:'dwa dni razem, zgoda albo rozejście'});
 if(watEra()>=3)L.push({k:'wygnanie',n:'Wiec wygania winnego',d:'spokój, ale osada traci człowieka'});
 return L}
function watChoose(id,k){const W=watS(),w=W.a.find(x=>x.id===id);if(!w)return'Sprawa sama się rozwiązała.';const[A,B]=watPeople(w);if(!A||!B){watEnd(w,'brak');return'Sprawa sama się rozwiązała.'}
 w.x.karta=0;w.st=4;w.x.wyb=k;
 if(w.t==='romans'){const[k1,m1]=A.sex==='k'?[A,B]:[B,A];
  if(k==='swaty'){const P=w.x.rodzic?pById(w.x.rodzic):null;if(P){const ch=(B.par||[]).includes(P.id)?B:A,other=ch===B?A:B;relAdd(P,other,-10);memAdd(P,'klotnia',other.name)}
   w.x.wed=Math.floor(S.day)+2+((Math.random()*2)|0);S.hope=clamp(S.hope+.01,0,1);const t=`Swaty. Do chaty, w której mieszka ${k1.name}, przychodzą swaci od ${gen(m1.name)} z chlebem i solą. Chleb zostaje przyjęty: za kilka dni wesele.`;w.kroki.push([Math.floor(S.day),t]);return t}
  if(k==='wiosna'){const Y=Math.floor(S.day/YEAR)*YEAR,sp=Y+3*SD;w.x.wed=S.day<sp?sp:(S.day<sp+SD?Math.floor(S.day)+3:sp+YEAR);w.x.czeka=1;memAdd(A,'strach','czekanie na ślub',-.1);memAdd(B,'strach','czekanie na ślub',-.1);
   const t=`${A.name} i ${B.name} mają czekać do wiosny. Markotnieją, ale nikt nie słyszy od nich złego słowa.`;w.kroki.push([Math.floor(S.day),t]);return t}
  if(relGet(A,B)>=40||Math.random()<.5){w.x.wed=Math.floor(S.day)+3;const t=`${A.name} i ${B.name} dogadali się sami. Któregoś wieczoru po prostu stają razem przy ogniu i mówią wszystkim, że będzie wesele.`;w.kroki.push([Math.floor(S.day),t]);return t}
  relAdd(A,B,-14);memAdd(A,'rozstanie',B.name,-.2);memAdd(B,'rozstanie',A.name,-.2);const t=`Nic z tego nie wyszło. ${A.name} i ${B.name} mijają się teraz grzecznie, bez słowa.`;watEnd(w,'rozstanie',t,true);return t}
 // konflikt
 if(k==='starszy'){const E=w.x.starszy?pById(w.x.starszy):null;const ok=!!E&&Math.random()<(usp(E,'lagodny')?.8:.45);
  if(ok){relAdd(A,B,32);memAdd(A,'zgoda',B.name);memAdd(B,'zgoda',A.name);const t=`${E.name} sadza ${acc(A.name)} i ${acc(B.name)} przy jednym stole i każe im mówić po kolei. Po długim milczeniu podają sobie ręce.`;watEnd(w,'zgoda',t,true);return t}
  relAdd(A,B,4);const t=`Nie słuchają nawet ${gen(E?E.name:'starszych')}. ${A.name} i ${B.name} omijają się odtąd szerokim łukiem, ale przynajmniej się nie kłócą.`;watEnd(w,'rozejm',t,true);return t}
 if(k==='sad'){const win=mirOf(A)>=mirOf(B)?A:B,lose=win===A?B:A;relAdd(A,B,6);memAdd(lose,'zguba','wyrok wiecu',-.15);memAdd(win,'zgoda','wyrok wiecu',.05);
  const t=`Wiec wysłuchuje obu stron. Racja przy ${gen(win.name)}. ${lose.name} spuszcza głowę, ale wyrok przyjmuje.`;watEnd(w,'wyrok',t,true);return t}
 if(k==='razem'){w.x.razem=1;w.dn=S.day+1.5;relAdd(A,B,6);const t=`${A.name} i ${B.name} dostają razem jedną robotę: przez dwa dni mają stawiać ścianę przy tym samym domu.`;w.kroki.push([Math.floor(S.day),t]);return t}
 if(k==='wygnanie'&&watEra()>=3){const lose=mirOf(A)<=mirOf(B)?A:B,win=lose===A?B:A;const H=(S.hamlets||[]).filter(h=>h.st===undefined||h.st>=0).sort((x,y)=>Math.hypot(y.i-camp.i,y.j-camp.j)-Math.hypot(x.i-camp.i,x.j-camp.j))[0];
  memAdd(win,'zgoda','wygnanie '+lose.name,.05);const t=H?`Wiec postanawia: ${lose.name} musi odejść. Jeszcze tego dnia ${gw(lose,'idzie','idzie')} z tobołkiem do przysiółka ${H.name}, na drugim końcu wyspy.`:`Wiec postanawia: ${lose.name} musi odejść. Jeszcze tego dnia ${gw(lose,'odchodzi sam','odchodzi sama')} w głąb wyspy. Ktoś mówi, że widział potem dym nad dalekim lasem.`;
  watEnd(w,'wygnanie',t,true);if(H){H.pop=(H.pop||0)+1;if(Array.isArray(H.mies))H.mies.push({n:lose.name,s:lose.sex,b:S.day-lose.age*YEAR})}leavePerson(lose);return t}
 return'Sprawa zostaje bez rozstrzygnięcia.'}
DECISION_RECOVERY.watek=()=>{const W=watS(),w=W.a.find(x=>x.id===W.kartaW&&x.x.karta);if(w){watCard(w);return}S.pendingDecision=null};

// ---------- co pół doby gry: kroki, rozwiązania, nowe wątki ----------
function watTick(){if(!S||!S.people)return;const W=watS();if(!watOn()){if(W.a.length)W.a.slice().forEach(w=>watEnd(w,'przerwany',null));return}
 for(const w of W.a.slice()){const[A,B]=watPeople(w);
  if(!A||!B){const z=A||B;watEnd(w,'odejscie',z?`${z.name} zostaje ${gw(z,'sam','sama')} ze sprawą, która już nikogo nie obchodzi.`:null);continue}
  if(w.t==='romans'&&(!watSingle(A)||!watSingle(B))&&!(A.pair===B.id)){watEnd(w,'inne',null);continue}
  if(w.st===4){
   if(w.t==='romans'&&w.x.wed!==undefined){
    if(w.x.czeka===1&&S.day>=w.d0+1&&S.day<w.x.wed-1&&watHere(A)){w.x.czeka=2;watSay(w,A,watPick([`${A.name} rzeźbi wieczorami skrzynię na wiano. Mówi, że do wiosny zdąży.`,`${A.name} i ${B.name} widują się tylko przy studni. Wystarczy jedno spojrzenie.`]))}
    if(S.day>=w.x.wed&&watHere(A)&&watHere(B)){const[k,m]=A.sex==='k'?[A,B]:[B,A];if(k.pair===null&&m.pair===null&&wedOk(k,m)){wedding(k,m);watEnd(w,'wesele',`Wesele: ${k.name} i ${m.name}.`,true)}else watEnd(w,'inne',null)}}
   else if(w.t==='konflikt'&&w.x.razem&&S.day>=w.dn&&watHere(A)&&watHere(B)){
    if(Math.random()<.65){relAdd(A,B,26);memAdd(A,'zgoda',B.name);memAdd(B,'zgoda',A.name);watEnd(w,'zgoda',`Po dwóch dniach przy jednej ścianie ${A.name} i ${B.name} siadają razem do miski. Ściana stoi prosto, a o dawnym sporze nikt już nie mówi.`)}
    else{relAdd(A,B,8);watEnd(w,'rozejscie',`${A.name} i ${B.name} skończyli robotę i rozeszli się każde w swoją stronę. Zgody nie ma, ale nie ma też kłótni.`)}}
   continue}
  if(S.day<w.dn||!watHere(A)||!watHere(B))continue;
  if(w.st<3){const txt=WAT_STEP[w.t][w.st](w,A,B);w.st++;w.dn=S.day+watGap();if(txt)watSay(w,w.t==='konflikt'&&w.st===2?B:A,txt);continue}
  if(w.st===3&&!w.x.karta&&!evOpen&&!placing&&!(typeof rdOpen!=='undefined'&&rdOpen)&&S.day-W.karta>=1&&!W.a.some(x=>x.x.karta))watCard(w)}
 // nowe wątki: najpierw z tego, co się wydarzyło (sceny), potem z więzi
 if(W.a.length>=WAT_MAX||S.day<(W.nast||0))return;
 while(W.seed.length){const s=W.seed.shift();const A=pById(s.a),B=pById(s.b);if(!A||!B||S.day-s.d>2)continue;if(s.t==='romans'&&!watLovers(A,B))continue;if(watStart(s.t,A,B,{text:s.txt}))return}
 if(Math.random()>.18)return;
 const lastR=W.ost.romans||-99,lastK=W.ost.konflikt||-99;const order=lastR<=lastK?['romans','konflikt']:['konflikt','romans'];
 for(const t of order){const pair=watFind(t);if(pair){watStart(t,pair[0],pair[1]);return}}}
function watFind(t){const ad=S.people.filter(p=>p.age>=16&&watHere(p)&&!watBusy(p));let best=null,bv=t==='romans'?22:-25;
 for(let i=0;i<ad.length;i++)for(let j=i+1;j<ad.length;j++){const a=ad[i],b=ad[j],v=relGet(a,b);
  if(t==='romans'?(v>bv&&watLovers(a,b)):(v<bv&&a.fam!==b.fam)){bv=v;best=[a,b]}}
 if(best&&t==='romans'&&best[0].sex==='k')best.reverse();return best}
{const _st=step;step=function(dt){_st(dt);if(S&&S.day>=watNext){watNext=S.day+WAT_TICK;try{watTick()}catch(e){console.warn('wątki',e)}}}}

// ---------- sceny, które zaczynają wątek; swaty przez wątek ----------
{for(const[k,t]of[['zalot','romans'],['klotnia','konflikt']]){const sc=SCENY.find(s=>s.k===k);if(!sc)continue;const f0=sc.f;
 sc.f=(A,B)=>{const txt=f0(A,B);try{if(txt&&A&&B&&watOn())watS().seed.push({t,a:A.id,b:B.id,d:S.day,txt})}catch(e){}return txt}}}
function watBlocks(k,m){return watOn()&&(watBusy(k)||watBusy(m))}
function watSwaty(k,m){if(!watOn())return false;const W=watS();if(W.a.length>=WAT_MAX)return false;
 const w=watStart('romans',m,k,{text:`Wszyscy widzą, że ${m.name} i ${k.name} mają się ku sobie. Pytanie tylko, kiedy ktoś to powie głośno.`});if(!w)return false;w.st=2;w.dn=S.day+watGap();log(w.kroki[0][1]);return true}

// ---------- dymek z nazwą wątku i kolejka dymków ----------
{const _sb=scBubble;scBubble=function(p,t){delete scBubEl.dataset.w;return _sb(p,t)}}
function watBubble(p,txt,label){if(scBP!==null||!watOnScreen(p)){if(watQ.length<4)watQ.push([p.id,txt,label]);return}scBubble(p,txt);if(!scBubEl.hidden)scBubEl.dataset.w=label}
function watOnScreen(p){if(!p||typeof cam==='undefined')return false;scV.set(p.x,Hy(p.x,p.z)+2.3,p.z).project(cam);return Math.abs(scV.x)<.9&&Math.abs(scV.y)<.85&&scV.z<1}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(watQ.length&&scBP===null&&S&&!evOpen){const[id,txt,label]=watQ[0];const p=pById(id);if(!p){watQ.shift();return}if(watOnScreen(p)){watQ.shift();scBubble(p,txt);if(!scBubEl.hidden)scBubEl.dataset.w=label}}}}

// ---------- karta osoby: co się u niej dzieje; „Pchnij ich ku sobie” ----------
const WAT_ST={romans:['zaczyna się','rośnie','rośnie','czeka na decyzję'],konflikt:['zaczyna się','narasta','narasta','czeka na rozstrzygnięcie']};
function watStage(w){if(w.st===4){if(w.t==='romans')return w.x.czeka?'czekają do wiosny':'szykują wesele';return'pracują razem'}return WAT_ST[w.t][w.st]||''}
function watPushCand(p){if(!watOn()||!watSingle(p)||watBusy(p)||watS().a.length>=WAT_MAX)return null;
 return S.people.filter(q=>watLovers(p,q)&&!watBusy(q)&&relGet(p,q)>=10).sort((a,b)=>relGet(p,b)-relGet(p,a))[0]||null}
function watCardHTML(p){if(!S||!p)return'';const w=watOf(p);let h='';
 if(w){const o=pById(w.a===p.id?w.b:w.a),on=o?o.name:(w.a===p.id?w.bn:w.an);
  h+=`<div class="card watek"><h4>${WAT_NAME[w.t]}: ${escapeHtml(p.name)} i ${escapeHtml(on)}</h4><p class="mut">Od dnia ${w.d0+1}, teraz: ${watStage(w)}.</p>${w.kroki.slice(-3).map(k=>`<p><small>dzień ${k[0]+1}</small> ${escapeHtml(k[1])}</p>`).join('')}</div>`}
 else{const q=watPushCand(p);if(q)h+=`<div class="card watek"><p class="mut">${escapeHtml(p.name)} i ${escapeHtml(q.name)} lubią się. Można im pomóc, ale nie trzeba.</p><button data-watek-push="${p.id}:${q.id}">Pchnij ich ku sobie</button></div>`}
 return h}
{const _lc=ludCard;ludCard=function(p){const h=_lc(p);let s='';try{s=watCardHTML(p)}catch(e){console.warn('wątek',e)}return s+h}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-watek-push]');if(!b||!S)return;e.stopPropagation();const[a,c]=b.dataset.watekPush.split(':').map(Number);const A=pById(a),B=pById(c);
 if(!A||!B||!watLovers(A,B)||watBusy(A)||watBusy(B)){toast('Teraz się nie da.');return}relAdd(A,B,6);
 const t=watPick([`${A.name} i ${B.name} dostają razem robotę przy suszeniu ryb. Nikt nie mówi tego głośno, ale wszyscy wiedzą, po co.`,`Ktoś sadza ${acc(A.name)} obok ${gen(B.name)} przy wieczornym ogniu i zostawia ich samych.`]);
 const w=watStart('romans',A,B,{text:t});if(w){log(t);watBubble(A,t,WAT_NAME.romans);toast('Zaloty: '+A.name+' i '+B.name)}try{renderSel()}catch(er){}});

// ---------- kronika: wątki jak rozdziały ----------
const WAT_END={wesele:'wesele',rozstanie:'rozstali się',zgoda:'zgoda',rozejm:'rozejm bez zgody',wyrok:'wyrok wiecu',rozejscie:'rozeszli się bez zgody',wygnanie:'wygnanie',odejscie:'jedno odeszło',inne:'sprawa się rozeszła',brak:'sprawa się rozeszła',przerwany:'przerwany'};
function watkiHTML(){if(!S)return'';const W=watS();if(!W.a.length&&!W.z.length)return'<p class="mut">Na razie nic się nie dzieje. Wątki zaczynają się same, z tego, co ludzie przeżywają.</p>';let h='';
 for(const w of W.a)h+=`<div class="card watek"><h4>${WAT_NAME[w.t]}: ${escapeHtml(w.an)} i ${escapeHtml(w.bn)}</h4><p class="mut">Od dnia ${w.d0+1}, teraz: ${watStage(w)}.</p>${w.kroki.map(k=>`<p><small>dzień ${k[0]+1}</small> ${escapeHtml(k[1])}</p>`).join('')}</div>`;
 if(W.z.length)h+=`<h4>Zakończone</h4>`+W.z.map(z=>`<details class="watek-z"><summary>${WAT_NAME[z.t]}: ${escapeHtml(z.an)} i ${escapeHtml(z.bn)} · ${WAT_END[z.k]||z.k}, dni ${z.d0+1}–${z.d1+1}</summary>${z.kroki.map(k=>`<p><small>dzień ${k[0]+1}</small> ${escapeHtml(k[1])}</p>`).join('')}</details>`).join('');
 return h}
{const _kt=kronTools;kronTools=function(){let s='';try{s=uiDisclosure('game:watki','Wątki',watkiHTML())}catch(e){console.warn('wątki',e)}return s+_kt()}}
{const st=document.createElement('style');st.textContent=`.card.watek{border-color:#c9a66b66}.card.watek h4{color:var(--gold2,#e0c080);margin:0 0 4px}.card.watek p{margin:4px 0}.card.watek small,.watek-z small{color:var(--mut);margin-right:4px}
.card.watek button{width:100%;margin-top:6px}.watek-z{margin:6px 0}.watek-z summary{cursor:pointer}
#scBub[data-w]::before{content:attr(data-w);display:block;font:600 11px var(--sans);font-style:normal;letter-spacing:.04em;color:var(--gold);margin-bottom:2px}`;document.head.appendChild(st)}
window.__watki={watS,watStart,watTick,watChoose,watCard,watOf,watFind,watSwaty,watBlocks,watkiHTML,watCardHTML,watPushCand,WAT_STEP,watQ,get next(){return watNext},set next(v){watNext=v}};
