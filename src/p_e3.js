
/* ================= 3.0: Epoka III — cała wyspa ================= */
let E3START=false;
const e3On=()=>!!(S&&S.e3&&S.e3.on);
// krainy, do których da się dojść lądem z osady
function e3Regs(){return REGIONS.filter(r=>{if(!r||r.id===0)return false;const t=nearestWalk(r.i,r.j);return!!(t&&reach&&reach[t[1]*N+t[0]])})}
function e3Need(){if(!S.e3.regN)S.e3.regN=e3Regs().length;return S.e3.regN}
const e3Settled=()=>{const ok=new Set(e3Regs().map(r=>r.id));return new Set((S.hamlets||[]).filter(h=>ok.has(h.rid)).map(h=>h.rid)).size};
const e3Pop=()=>S.people.length+(S.hamlets||[]).reduce((a,h)=>a+h.pop,0);
const e3Roads=()=>(S.hamlets||[]).filter(h=>h.road===2).length;
const e3Big=()=>(S.hamlets||[]).filter(h=>(h.st||0)>=3).length;
const e3Han=()=>(S.hanN||0)-(S.e3.han0||0);
const e3Types=()=>Object.keys(S.hanTy||{}).length;
const E3A={
 10:{n:'Krainy',intro:'Wiec całej wyspy zbiera się po raz pierwszy: z osady i ze wszystkich przysiółków. Ktoś rozkłada na ziemi mapę z kory. Połowa krain jest jeszcze pusta. Starsi mówią: wyspa jest nasza dopiero wtedy, gdy w każdej krainie pali się czyjś ogień.',
  g:[['Przysiółki w połowie krain',()=>e3Settled()>=Math.ceil(e3Need()/2),'Ludzie → Wspólnota → nowy przysiółek. Duże przysiółki mogą też wysłać młodych dalej (karta przysiółka).',()=>`Zasiedlonych krain: ${e3Settled()} z ${e3Need()}. Za borem i za górami są jeszcze puste doliny.`],
   ['Przysiółek zakłada przysiółek',()=>(S.e3.corki||0)>=1,'Karta przysiółka w zakładce Ludzie → Wspólnota: „Wyślij młodych dalej”. Przysiółek musi mieć co najmniej 8 osób.',()=>'W przysiółkach rosną dzieci, którym jest tam za ciasno. Mogą pójść dalej, nie wracając do osady.'],
   ['Drogi do pięciu przysiółków',()=>e3Roads()>=5,'Karta przysiółka → Wytycz drogę. Droga kosztuje kłody i kamień.',()=>`Wyrównanych dróg: ${e3Roads()} z 5. Po ścieżkach wóz nie przejedzie.`]]},
 11:{n:'Wymiana',intro:'Przysiółki rosną i każdy ma coś, czego brakuje innym: wybrzeże ryby, bór drewno i miód, góry kamień, łąki ziarno. Na wiecu ktoś mówi, że wyspa powinna być jak jedno gospodarstwo. Trzeba dróg, wozów i miejsca, gdzie woźnica odpocznie.',
  g:[['Postaw zajazd przy drodze',()=>S.bld.some(b=>b.kind==='zajazd'&&bDone(b)),'Budowa → Wspólnota → Zajazd. Wozy jeżdżą wtedy częściej i przywożą więcej.',()=>'Woźnice nocują pod gołym niebem i wracają zmęczeni. Przydałby się dach i ciepła strawa przy drodze.'],
   ['40 wozów z towarem',()=>e3Han()>=40,'Wozy jeżdżą same po wyrównanych drogach. Więcej dróg i zajazd to więcej wozów. Wozy robi warsztat.',()=>`Wozów z towarem od początku tej epoki: ${e3Han()} z 40.`],
   ['Towar z czterech rodzajów krain',()=>e3Types()>=4,'Potrzebne przysiółki na wybrzeżu, w borze, w górach i na łąkach, każdy z wyrównaną drogą.',()=>`Rodzaje krain, z których przyjechał towar: ${e3Types()} z 4.`]]},
 12:{n:'Wyspa nasza',intro:'Drogi łączą już większość wyspy. Wieczorami przy ogniskach w przysiółkach śpiewa się te same pieśni co w osadzie. Zostało ostatnie: zasiedlić każdą krainę i dorosnąć do tego, żeby wyspa naprawdę była nasza.',
  g:[['Ogień w każdej krainie',()=>e3Settled()>=e3Need(),'Każda kraina, do której da się dojść lądem, potrzebuje przysiółka. Mapa wspólnoty pokazuje puste krainy.',()=>{const n=e3Need()-e3Settled();return n>0?`Pustych krain: ${n}. Mapa wspólnoty pokazuje, gdzie jeszcze nikt nie mieszka.`:'Wszystkie krainy mają już swój ogień.'}],
   ['Cała wyspa: 150 osób',()=>e3Pop()>=150,'Rośnie osada i przysiółki. Przysiółki rosną, gdy mają zapasy i więź z osadą: dary, wozy, drogi.',()=>`Na całej wyspie żyje ${e3Pop()} ${osb(e3Pop())}.`],
   ['Trzy przysiółki urosły do osiedli',()=>e3Big()>=3,'Przysiółek staje się osiedlem przy 14 osobach.',()=>`Osiedli i wsi: ${e3Big()} z 3.`]]}};
const E3RN={10:'X',11:'XI',12:'XII'};
function e3Start(){S.e3={on:1,a:10,g:{},d0:S.day,han0:S.hanN||0,corki:0};S.e3.regN=e3Regs().length;S.know.e3_zajazd='nie';pamAdd(4,'e3');log('Zaczyna się epoka III: cała wyspa.');e3ActScene()}
function e3ActScene(){const a=S.e3.a,A=E3A[a];if(!A)return;S.e3.sceneQ=a}
{const _gi=goalInfo;goalInfo=function(){const g=_gi();if(!e3On())return g;if(S.e3.done)return{ch:'Epoka III · Wyspa nasza',t:'Wyspa jest nasza',d:'Wszystkie krainy mają swój ogień. Osada i przysiółki żyją dalej.'};
  const A=E3A[S.e3.a];if(!A)return g;const i=A.g.findIndex((x,k)=>!S.e3.g[S.e3.a+'_'+k]);const x=A.g[i<0?0:i];let d=x[2];try{d=x[3]()}catch(e){}
  return{ch:`Epoka III · Akt ${E3RN[S.e3.a]} · ${A.n}`,t:x[0],d,how:x[2]}}}
function e3Tick(){if(!S)return;
 if(!S.e3&&S.epoch===2&&S.e2&&S.e2.endName&&!S.e3Q)S.e3Q=1;
 if(S.e3Q&&!S.e3&&!evOpen&&!placing&&isWork()){S.e3Q=0;openEvent({id:'e3-start',ey:'Epoka III',t:'Cała wyspa',text:()=>`Minęło ${Math.floor(S.day/YEAR)} ${lata(Math.floor(S.day/YEAR))} od rozbicia. Osada ma już swoją nazwę w pieśniach, a przysiółki swoje drogi.\n\nAle mapa wyspy wciąż ma puste miejsca. Dzieci tych, którzy budowali przysiółki, pytają, co jest dalej.`,
   opts:[{n:'Wyspa ma być cała nasza',d:'zaczyna się epoka III',f:()=>{e3Start();return'Wiec postanawia: w każdej krainie ma się palić nasz ogień.'}}]},{});return}
 if(e3On()&&S.e3.a>=11)S.know.e3_zajazd='tak';{const on=e3On(),i=BKEYS.indexOf('zajazd');if(on&&i<0)BKEYS.push('zajazd');else if(!on&&i>=0)BKEYS.splice(i,1)}
 if(!e3On()||S.e3.done)return;
 if(S.e3.sceneQ&&!evOpen&&!placing){const a=S.e3.sceneQ;S.e3.sceneQ=0;if(a===11)S.know.e3_zajazd='tak';
  openEvent({ey:`Epoka III · Akt ${E3RN[a]}`,t:E3A[a].n,text:()=>E3A[a].intro,opts:[{n:'Dalej',d:'',f:()=>E3A[a].g.map(x=>'· '+x[0]).join('\n')}]},{});return}
 const a=S.e3.a,A=E3A[a];if(!A)return;
 A.g.forEach((x,k)=>{const key=a+'_'+k;if(!S.e3.g[key]){let ok=false;try{ok=x[1]()}catch(e){}if(ok){S.e3.g[key]=1;S.hope=clamp(S.hope+.04,0,1);log('Cel osiągnięty: '+x[0].toLowerCase()+'.');toast('Cel osiągnięty: '+x[0]);sfx('bell')}}});
 if(A.g.every((x,k)=>S.e3.g[a+'_'+k])){pamAdd(4,'akt');if(a<12){S.e3.a=a+1;e3ActScene()}else{S.e3.done=1;S.e3.endDay=S.day;e3Final()}}}
function e3Final(){const yrs=Math.floor(S.day/YEAR),pop=e3Pop(),hs=(S.hamlets||[]).length,old=S.people.filter(p=>!p.born).length;song('Pieśń o wyspie, która jest nasza');pamAdd(10,'koniec3');
 try{localStorage.setItem('przystan-wyspa',String((+(localStorage.getItem('przystan-wyspa')||0))+1))}catch(e){}
 const nm=(S.e2&&S.e2.endName)||'Przystań';log(`Koniec epoki III. Wyspa jest nasza: ${pop} ${osb(pop)}, ${hs} ${hs===1?'przysiółek':'przysiółków'}.`);
 openEvent({ey:'Koniec epoki III',t:'Wyspa jest nasza',text:()=>`Na wiecu całej wyspy nie mieści się już nikt przy jednym ogniu. Rozpalają więc ogniska na każdym wzgórzu, od zatoki wraku po najdalsze hale, i o zmroku widać je wszystkie naraz.\n\nMinęło ${yrs} ${lata(yrs)} od rozbicia. Na wyspie żyje ${pop} ${osb(pop)}, w osadzie ${nm} i w ${hs} ${hs===1?'przysiółku':'przysiółkach'}. ${old?`Z tych, którzy wyszli na brzeg, ${zyjeW(old)} jeszcze ${old} ${osb(old)}.`:'Nikt już nie pamięta statku. Pamiętają go tylko pieśni i kamień z imionami.'}\n\nTo zakończenie epoki III. Wyspa żyje dalej.`,
  opts:[{n:'Pobierz Księgę rozbitków',d:'plik tekstowy z całą historią',f:()=>{dlFile(`ksiega-rozbitkow-${(S.vname||'przystan').toLowerCase()}.txt`,ksiegaText(),'text/plain;charset=utf-8');return'Księga zapisana. Wyspa żyje dalej.'}},{n:'Graj dalej',d:'',f:()=>'Wyspa żyje dalej.'}]},{})}
{const _kt=ksiegaText;ksiegaText=function(){let t=_kt();if(S&&S.e3){t+=`\n\nEPOKA III: CAŁA WYSPA\nZaczęła się w roku ${Math.floor(S.e3.d0/YEAR)+1}. Zasiedlone krainy: ${e3Settled()} z ${e3Need()}. Na wyspie żyje ${e3Pop()} ${osb(e3Pop())}. Wozów z towarem: ${e3Han()}.`;if(S.e3.done)t+=`\nWyspa jest nasza od roku ${Math.floor(S.e3.endDay/YEAR)+1}.`}return t}}
// ---- przysiółek zakłada przysiółek ----
function e3FreeNear(h){const ok=new Set(e3Regs().map(r=>r.id));const used=new Set((S.hamlets||[]).map(x=>x.rid));return REGIONS.filter(r=>r&&r.id!==0&&ok.has(r.id)&&!used.has(r.id)).sort((a,b)=>Math.hypot(a.i-h.i,a.j-h.j)-Math.hypot(b.i-h.i,b.j-h.j))[0]}
function e3NewHam(src,r,pop){const taken=new Set((S.hamlets||[]).map(x=>x.name).concat([S.vname||'']));let head=newName('m');for(let q=0;q<14&&taken.has(placeName(head));q++)head=NAMES.m[(Math.random()*NAMES.m.length)|0];const[i,j]=hamletSpot(r);reveal(i,j,6);S.regs=S.regs||{};S.regs[r.id]=1;r.known=true;
 const ppl=[head];for(let q=1;q<pop;q++)ppl.push(newName(q%2?'k':'m'));
 let nm=placeName(head);if(taken.has(nm))nm=(r.type==='high'?'Górne ':r.type==='coast'?'Nadmorskie ':'Nowe ')+nm;const h={id:(S.hid=(S.hid||0)+1),rid:r.id,i,j,name:nm,rod:src?src.rod:0,pop,wiez:.55,zap:.5,day:S.day,ppl,head,why:'corka',road:1,from:src?src.id:0};
 S.hamlets.push(h);kolInit();kolPath(h);kolReveal(h);kolClearPath(h,false);kolTread();hamVis();try{regionScan(true)}catch(e){}return h}
const e3CanSend=h=>e3On()&&h.pop>=8&&!(h.arr&&S.day<h.arr)&&!!e3FreeNear(h);
function e3Send(id){const h=(S.hamlets||[]).find(x=>x.id===id);if(!h||!e3CanSend(h))return;if(!needHave('jedzenie',20)||S.res.drewno<10){toast('Osada musi dać im na drogę 20 jedzenia i 10 kłód.');return}
 const r=e3FreeNear(h);needTake('jedzenie',20);S.res.drewno-=10;h.pop-=3;const n=e3NewHam(h,r,3);S.e3.corki=(S.e3.corki||0)+1;
 log(`Z przysiółka ${h.name} wychodzi troje młodych. Idą dalej, do krainy ${r.name}, i stawiają tam pierwszy szałas. Tak zaczyna się ${n.name}.`);toast('Nowy przysiółek: '+n.name);sfx('bell');renderPanel()}
{const _hh=hamletHTML;hamletHTML=function(){let h=_hh();if(!e3On())return h;(S.hamlets||[]).forEach(x=>{if(!e3CanSend(x))return;const tag=`<button data-klook="${x.id}">Pokaż</button>`;
   h=h.replace(tag,`<button data-e3send="${x.id}" ${needHave('jedzenie',20)&&S.res.drewno>=10?'':'disabled'}>Wyślij młodych dalej (3 osoby, 20 jedzenia, 10 kłód)</button>`+tag)});
  return`<div class="card"><h4>Epoka III: cała wyspa</h4><p>Zasiedlone krainy: <b>${e3Settled()} z ${e3Need()}</b> (te, do których da się dojść lądem). Na wyspie żyje ${e3Pop()} ${osb(e3Pop())}. Wozów z towarem w tej epoce: ${e3Han()}.</p></div>`+h}}
document.addEventListener('click',ev=>{const t=ev.target.closest('[data-e3send]');if(!t||t.disabled||!S)return;ev.stopPropagation();e3Send(+t.dataset.e3send)},true);
EVENTS.push({id:'e3_dalej',w:2.2,cd:YEAR*.5,cond:()=>e3On()&&!S.e3.done&&(S.hamlets||[]).some(e3CanSend),t:'Za ciasno w przysiółku',ctx:()=>{const L=(S.hamlets||[]).filter(e3CanSend);const h=L[(Math.random()*L.length)|0];return h?{h,r:e3FreeNear(h)}:null},
 text:c=>`Z przysiółka ${c.h.name} przychodzi młoda para. Mówią, że u nich jest już za ciasno, a za wzgórzem leży pusta kraina, ${c.r.name}. Nie chcą wracać do osady. Chcą iść dalej.`,
 opts:[{n:'Pobłogosławić i wyposażyć',d:'20 jedzenia i 10 kłód z osady, nowy przysiółek',f:c=>{if(!needHave('jedzenie',20)||S.res.drewno<10)return'Osada nie ma teraz z czego ich wyposażyć. Obiecują wrócić z tą prośbą wiosną.';e3Send(c.h.id);return`Idą we troje, z kozą i workiem ziarna. W krainie ${c.r.name} wkrótce zapali się nowy ogień.`}},
  {n:'Niech jeszcze poczekają',d:'',f:c=>{c.h.wiez=Math.max(0,(c.h.wiez||.5)-.04);return'Wracają do siebie. Ale za wzgórze patrzą coraz częściej.'}}]});
// ---- zajazd przy drodze ----
BD.zajazd={cat:'wsp',n:'Zajazd',w:3,h:2,cost:{drewno:36,deski:16,gwozdzie:16,kamien:8},work:10,need:'e3_zajazd',d:'Dom przy drodze, gdzie woźnice nocują i jedzą. Wozy jeżdżą do przysiółków prawie dwa razy częściej i przywożą więcej towaru.'};
{const _nm=newModel;newModel=function(kind,g){if(kind!=='zajazd')return _nm(kind,g);
  g.add(tbox(2.8,.22,1.7,mStone,0,.11,0,0,.9));g.add(tbox(2.5,1.05,1.4,mLogsE,0,.74,-.05,0,1.1));logEnds(g,2.5,1.4,1.05,.26);
  g.add(gable(2.75,1.6,.8,mShingE,1.27,.2));door(g,-.55,.66,0,.42,.72).position.y=.22;
  for(const x of[.45,.95])g.add(tbox(.3,.26,.04,mPlankD,x,.88,.66));
  g.add(tbox(2.5,.06,.55,mPlankD,0,1.12,.9));for(const x of[-1.15,-.1,1.15])g.add(cyl(.05,.9,matLog2,x,.67,1.12,0,0,0,5));g.add(tbox(1.0,.06,.3,mPlankD,.5,.3,.98));
  g.add(cyl(.04,1.3,matLog2,1.45,.65,1.05,0,0,0,5));const sg=tbox(.5,.32,.04,mPlankD,1.45,1.15,1.08);g.add(sg);g.add(cyl(.09,.16,mPlankD,1.45,1.15,1.11,Math.PI/2,0,0,8));
  for(const[x,z]of[[-1.3,1.15],[-1.05,1.25]])g.add(cyl(.14,.28,mPlankD,x,.14,z,0,0,0,9));
  g.add(cyl(.03,1.2,matLog2,-.2,.45,1.55,0,0,Math.PI/2,5));for(const x of[-.75,.35])g.add(cyl(.04,.45,matLog2,x,.22,1.55,0,0,0,5));woodpile(g,-1.45,-.55,5,0);return 1}}
// wozy jeżdżą częściej przy zajeździe, a w epoce III przywożą więcej
// ---- start od epoki III ----
function e3Quick(){if(!S)return;S.finQ=0;S.epoch=2;S.path='dom';S.finDay=S.day;e2Init();const e=S.e2;e.introQ=0;e.r1='wies';e.r2='wiec';e.r3='gosp';e.a=12;e.prawo=e.prawo||1;
 ['dom','wies','wiec','gosp'].forEach(k=>S.tech['e2_'+k]=1);if(typeof e2Keys==='function')e2Keys();e.endName=e2EndName();e.endDay=S.day;S.wozy=Math.max(S.wozy||0,3);S.tech.r_woz=1;

 for(let k=0;k<5;k++){const src=S.hamlets[k%Math.max(1,S.hamlets.length)]||{i:camp.i,j:camp.j,rod:0};const r=e3FreeNear(src);if(!r)break;const h=e3NewHam(null,r,6+((Math.random()*6)|0));h.wiez=.62;h.zap=.6;if(k<3)h.road=2}
 (S.hamlets||[]).forEach((h,k)=>{if(k<4)h.road=2;h.pop=Math.max(h.pop,8);h.st=h.pop>=14?3:h.pop>=9?2:1});kolInit();hamVis();S.e3Q=0;e3Start();renderTop();renderPanel()}
{const _bt=boot;boot=function(fresh){_bt(fresh);if(fresh&&E3START){E3START=false;e3Quick()}}}
{const acts=document.querySelector('#intro .acts');if(acts){const b=document.createElement('button');b.id='goE3';b.textContent='Zacznij od epoki III';
 const sm=document.createElement('small');sm.className='e2note';sm.textContent='Wieś po epoce II z przysiółkami i drogami. Cel: cała wyspa.';const ref=$('goInstall');acts.insertBefore(b,ref);acts.insertBefore(sm,ref);
 b.addEventListener('click',()=>{let has=false;try{has=!!localStorage.getItem(SAVEKEY)}catch(e){}if(has&&!confirm('Zacząć od epoki III? Obecna osada zostanie zastąpiona.'))return;try{localStorage.removeItem(SAVEKEY);localStorage.removeItem('przystan-fresh')}catch(e){}freshFlag=false;E2START=true;E3START=true;startGame(true)})}}
{const _st=sprTick;sprTick=function(){_st();try{e3Tick()}catch(e){console.warn('e3',e)}}}
window.__e3={e3Start,e3Quick,e3Tick,e3Send,e3Regs,e3Settled,e3Need,e3Pop,E3A};
