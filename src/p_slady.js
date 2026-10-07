
/* ================= 0.20: ślady dawnego ludu — rzeczy pozornie proste, które z czasem okazują się potrzebne ================= */
// W osadzie nie ma lekarza, rolnika, pasterza ani garncarza. Gdy kończą się zapasy z wraku, ktoś przypomina sobie, co zostawił dawny lud.
function bestAt(c){return S.people.filter(isAdult).sort((a,b)=>(b.sk[c]||0)-(a.sk[c]||0))[0]||S.people[0]}
function healer(){return offHolder('zielarka')||S.people.filter(p=>isAdult(p)&&p.sex==='k').sort((a,b)=>b.age-a.age)[0]||bestAt('zbieracz')}
const SLAD=[
 {k:'leki',eff:'Ranni i chorzy zdrowieją szybciej. Zioła rozpoznane: zielarstwo poznane.',why:'gdy ktoś ciężko zachoruje albo zostanie ranny',
  need:()=>S.people.some(p=>p.hp<.45),
  ctx:()=>({sick:S.people.filter(p=>p.hp<.45).sort((a,b)=>a.hp-b.hp)[0]||null,h:healer()}),
  t:'Gorzka mieszanka',text:c=>`${c.sick?c.sick.name+' od trzech dni leży w gorączce i nic nie pomaga.':'W osadzie co chwilę ktoś kaszle i gorączkuje.'} Nikt z nas nie był lekarzem, a zioła z wraku dawno się skończyły. ${c.h.name} przypomina sobie małe naczynka zalepione woskiem, które ktoś przyniósł ze skały. W środku sucha, gorzka mieszanka: kora, korzeń, coś jak kwiat krwawnika.`,
  opts:[{n:'Zaparzyć i podać choremu',d:'może pomóc, może zaszkodzić',f:c=>{if(c.sick){c.sick.hp=Math.max(c.sick.hp,.78);c.sick.hurt=0}sladDo(0);return`Po dwóch dniach gorączka spada. ${c.h.name} rozkłada resztę mieszanki na części i szuka w lesie tych samych roślin. Od teraz osada ma swoje leki.`}},
   {n:'Najpierw spróbować na sobie',d:`ostrożniej, ale ${'zielarka'} ryzykuje`,f:c=>{c.h.hp=Math.max(.3,c.h.hp-.12);if(c.sick)c.sick.hp=Math.max(c.sick.hp,.62);sladDo(0);return`${c.h.name} pije napar pierwsza. Noc jest ciężka, ale rano wstaje i podaje go choremu. Odtąd pilnuje, z czego i ile.`}}]},
 {k:'luk',eff:'Łuk z cisu i krzemienne groty: myśliwi przynoszą o 25% więcej i rzadziej odnoszą rany.',why:'gdy skończą się żelazne narzędzia z wraku albo myśliwy zostanie ranny',
  need:()=>S.day>YEAR*.3&&((S.res.narz<4&&S.day>YEAR*.5)||S.people.some(p=>p.hurt&&p.job==='wb'&&(p.sk.mysliwy||0)>=1)),
  ctx:()=>({h:bestAt('mysliwy')}),
  t:'Łuk z cisu',text:c=>`Żelaznych noży i grotów z wraku jest coraz mniej, a te, które zostały, tępią się na kościach. Myśliwi podchodzą zwierzynę z oszczepem i często wracają poranieni. ${c.h.name} obraca w palcach krzemienny grot spod skalnego nawisu: cienki, ostry jak liść, z wcięciami na wiązanie. I ten kawałek cisu obok, wygięty. To był łuk.`,
  opts:[{n:'Zrobić łuk z cisu i krzemienne groty',d:'myśliwi celniej i bezpieczniej',f:c=>{c.h.xp.mysliwy=(c.h.xp.mysliwy||0)+60;sladDo(1);return`${c.h.name} przez tydzień łupie krzemień i strzela do pnia, aż strzały zaczynają lecieć prosto. Dzieci zbierają lotki z gęsich piór.`}},
   {n:'Zostać przy oszczepach',d:'może później',f:()=>{sladLater(1);return'Groty wracają do sakwy. Może kiedyś.'}}]},
 {k:'rosl',eff:'Zbieracze wiedzą, co jeść, a czego unikać: przynoszą o 20% więcej, także korzenie na przednówek.',why:'na przednówku albo gdy brakuje jedzenia',
  need:()=>(S.hungerDays||0)>0||foodTotal()<S.people.length*6||(seasonIdx()===3&&S.day>YEAR),
  ctx:()=>({h:bestAt('zbieracz')}),
  t:'Co mówi skała',text:c=>`Przednówek. Spiżarnia pustoszeje, a do lata daleko. Nikt z nas nie zna tutejszych roślin, a jedna pomyłka może kosztować życie. ${c.h.name} wraca od malowanej skały i mówi, że już rozumie, co tam narysowano: kłącza tataraku, korzeń łopianu, młode pędy pokrzyw, orzechy. Przy jadalnych odcisk dłoni. Przy trujących przekreślenie.`,
  opts:[{n:'Zbierać według skały',d:'więcej jedzenia, mniej pomyłek',f:c=>{S.res.warzywa=(S.res.warzywa||0)+25;sladDo(2);return`Zbieracze idą z rysunkiem na korze. Wieczorem w kotle są korzenie i pędy, których nikt wcześniej nie tknął. Nikt się nie truje.`}},
   {n:'Nie ufać obcym rysunkom',d:'',f:()=>{sladLater(2);return'„Kto wie, co oni jedli” — mówi ktoś. Zbierają tylko to, co znają.'}}]},
 {k:'wypal',eff:'Garncarstwo poznane: naczynia z gliny, garncarnia i komora kiszonek.',why:'gdy skończą się beczki i naczynia z wraku',
  need:()=>!tech('r_garn')&&S.day>YEAR*.6&&S.res.naczynia<4,
  ctx:()=>({h:bestAt('murarz')}),
  t:'Dół do wypału',text:c=>`Beczki i skrzynie z wraku butwieją, a nie ma w czym trzymać ziarna, mleka ani kiszonek. Garnek z surowej gliny rozmięka przy pierwszym deszczu. ${c.h.name} przypomina sobie dół pełen czerwonych skorup w dawnym siedlisku. Lepi kilka garnków, kładzie je w dole, obkłada chrustem i pali przez całą noc, tak jak tamci musieli palić.`,
  opts:[{n:'Palić w dole, jak dawny lud',d:'pierwsze naczynia z gliny',f:c=>{S.res.naczynia=(S.res.naczynia||0)+6;c.h.xp.murarz=(c.h.xp.murarz||0)+50;sladDo(3);return'Rano połowa garnków jest pęknięta, ale reszta dzwoni, gdy się w nie stuknie. Nie przeciekają. Odtąd glina z gliniska ma nowe zadanie.'}},
   {n:'Szukać innej drogi',d:'',f:()=>{sladLater(3);return'Garnki ze skorupami zostają w dole. Może później.'}}]},
 {k:'siec',eff:'Ciężarki do sieci: rybacy łowią o 25% więcej.',why:'gdy osada ma pomost, a sieci z wraku się drą',
  need:()=>S.bld.some(b=>b.kind==='pomost'&&bDone(b))&&S.day>YEAR*.4,
  ctx:()=>({h:bestAt('rybak')}),
  t:'Kamienie z otworem',text:c=>`Sieci z wraku są podarte, a te, które zostały, unosi prąd i ryby uciekają spod nich. ${c.h.name} przypomina sobie płaskie kamienie z otworem, ułożone w rzędzie przy ujściu strumienia. To ciężarki. Dawny lud łowił tu tak samo, tylko sieci miał z łyka.`,
  opts:[{n:'Obciążyć sieci kamieniami',d:'więcej ryb',f:c=>{sladDo(4);return`${c.h.name} wierci otwory w kamieniach kościanym świdrem. Sieć stoi teraz w wodzie jak ściana.`}},
   {n:'Łowić jak dotąd',d:'',f:()=>{sladLater(4);return'Kamienie zostają w strumieniu.'}}]},
 {k:'zarna',eff:'Dzikie zboże: wiadomo, jak je zbierać, mleć i siać. Pola dają więcej.',why:'gdy kończy się ziarno z wraku',
  need:()=>(S.know.pole!=='tak'&&S.day>YEAR*.5)||(S.res.ziarno<10&&S.day>YEAR),
  ctx:()=>({h:bestAt('zbieracz')}),
  t:'Ziarno dawnego ludu',text:c=>`Ziarno z wraku się kończy, a nikt z nas nie był rolnikiem. ${c.h.name} wraca do płaskiego kamienia z wgłębieniem i zwęglonych ziaren w szczelinach. Takie same kłosy rosną dziko na łąkach. Dawny lud je zbierał, rozcierał na mąkę i chyba siał przy domach.`,
  opts:[{n:'Zebrać dzikie kłosy i posiać',d:'pola i mąka',f:c=>{S.res.ziarno=(S.res.ziarno||0)+10;sladDo(5);return'Kobiety idą na łąki z koszami. Część ziarna idzie na żarna, część zostaje na siew. Wiosną przy osadzie zielenieje pierwsze pole z dzikiego zboża.'}},
   {n:'Czekać na lepszy rok',d:'',f:()=>{sladLater(5);return'Kamień z wgłębieniem zostaje w trawie.'}}]},
 {k:'okol',eff:'Oswajanie kóz: zagroda i hodowla. Kozy w zagrodzie dają więcej.',why:'gdy myśliwi widzą dzikie kozy, a nikt nie umie ich oswoić',
  need:()=>S.day>YEAR*.7,
  ctx:()=>({h:bestAt('mysliwy')}),
  t:'Ktoś tu trzymał kozy',text:c=>`Na halach pasą się dzikie kozy, ale uciekają na sam widok człowieka. Nikt z nas nie był pasterzem. ${c.h.name} wspomina kamienny krąg z wąskim wejściem i kości kóz w środku. Dawny lud zapędzał je w kamienie, karmił solą i liśćmi, aż przestały uciekać.`,
  opts:[{n:'Zrobić tak samo',d:'pierwsze oswojone kozy',f:c=>{sladDo(6);return'Przez kilka tygodni ktoś codziennie zostawia w kamiennym kręgu sól i gałęzie. Pewnego ranka w środku stoją trzy kozy i nie uciekają.'}},
   {n:'Polować, jak dotąd',d:'',f:()=>{sladLater(6);return'Kozy wciąż uciekają na skały.'}}]},
 {k:'sad',eff:'Sadownictwo: drzewa owocowe w osadzie (Budowa → Ład wsi). Jesienią dają owoce.',why:'jesienią, gdy osada już stoi',
  need:()=>seasonIdx()===1&&S.tier>=1,
  ctx:()=>({h:bestAt('zbieracz')}),
  t:'Kto sadził te drzewa',text:c=>`Jesień. ${c.h.name} przynosi z puszczy kosz małych, kwaśnych jabłek i twardych gruszek ze zdziczałego sadu. Drzewa rosną tam w równych rzędach, a na starych gałęziach widać ślady szczepienia. Ktoś je sadził, przycinał i pielęgnował. Pod najstarszą jabłonią śpi ten, kto to robił.`,
  opts:[{n:'Przesadzić młode drzewka do osady',d:'drzewa owocowe przy domach',f:c=>{S.res.jagody+=20;sladDo(7);return'Wiosną przy chatach stają pierwsze młode jabłonki. Za kilka lat będą owoce. Dzieci dostają po jabłku z kosza.'}},
   {n:'Zebrać owoce i zostawić sad',d:'',f:()=>{S.res.jagody+=20;sladLater(7);return'Kosz jabłek idzie do spiżarni. Sad zostaje w puszczy.'}}]}];
function slad(k){return!!(S&&S.slady&&S.slady[k])}
function sladLater(i){S.sladCd=S.sladCd||{};S.sladCd[i]=S.day+SD*2}
function sladDo(i){const s=SLAD[i];S.slady=S.slady||{};if(S.slady[s.k])return;S.slady[s.k]=1;pamAdd(2,'slad');techXp('nauka',20);
 if(i===0){['u_rozp','u_ziel'].forEach(id=>TECH_BY[id]&&techDone(TECH_BY[id]));S.res.ziola=(S.res.ziola||0)+6}
 if(i===1)S.bonus.mysliwy=(S.bonus.mysliwy||0)+.25;
 if(i===2){S.bonus.zbieracz=(S.bonus.zbieracz||0)+.2;TECH_BY.u_rozp&&techDone(TECH_BY.u_rozp)}
 if(i===3)TECH_BY.r_garn&&techDone(TECH_BY.r_garn);
 if(i===4){if(tech('h_sieci'))S.bonus.rybak=(S.bonus.rybak||0)+.15;else TECH_BY.h_sieci&&techDone(TECH_BY.h_sieci)}
 if(i===5){if(S.know.pole!=='tak')S.know.pole='tak';else S.bonus.rolnik=(S.bonus.rolnik||0)+.15}
 if(i===6){if(tech('h_zagr'))S.bonus.hodowca=(S.bonus.hodowca||0)+.2;else TECH_BY.h_zagr&&techDone(TECH_BY.h_zagr)}
 if(i===7)TECH_BY.u_sad&&techDone(TECH_BY.u_sad,true);
 log(`Dar dawnego ludu: ${TRIBE[i][0].toLowerCase()}. ${s.eff}`);toast('Dar dawnego ludu: '+s.t);sfx('bell')}
function sladClear(){S.sladClr=S.sladClr||{};S.found.forEach(k=>{if(S.sladClr[k])return;S.sladClr[k]=1;const t=tribe[k];if(!t)return;const x0=tcx(t.i),z0=tcx(t.j);
 nodeBy.tree.forEach(n=>{if(n.amt>0&&Math.hypot(n.x-x0,n.z-z0)<(k===7?5.2:4.6)){n.amt=0;const q=nodes.indexOf(n);if(q>=0)S.nodeAmt[q]=0;nodeVis(n)}})})}
function sladDaily(){if(!S.found||!S.found.length)return;sladClear();S.slady=S.slady||{};S.foundD=S.foundD||{};S.sladCd=S.sladCd||{};
 S.found.forEach(i=>{if(S.foundD[i]===undefined)S.foundD[i]=S.day});
 // leki działają co dzień
 if(slad('leki'))S.people.forEach(p=>{if(p.hp<1&&(p.hurt||p.hp<.6))p.hp=Math.min(1,p.hp+K*.012)});
 if(evOpen||placing||S.sladQ!==undefined&&S.sladQ!==null)return;
 for(const i of S.found){const s=SLAD[i];if(!s||S.slady[s.k]||(S.sladCd[i]||0)>S.day||S.day-S.foundD[i]<4)continue;
  const late=S.day-S.foundD[i]>YEAR*2;if(s.need()||late){S.sladQ=i;break}}}
function sladTick(){if(S.sladQ===undefined||S.sladQ===null||evOpen||placing||!isWork())return;const i=S.sladQ;S.sladQ=null;const s=SLAD[i];if(!s||slad(s.k))return;
 const c=s.ctx();if(!c.h)return;openEvent({ey:'Ślad dawnego ludu',t:s.t,text:x=>s.text(x),opts:s.opts},c)}
{const _ad=actDaily;actDaily=function(){_ad();sladDaily()}}
{const _gt=goalsTick;goalsTick=function(){_gt();if(S)sladTick()}}
function sladHTML(){const n=Object.keys(S.slady||{}).length;let h=`<h3>Ślady dawnego ludu (${S.found.length} z ${tribe.length})</h3><p class="lead">Na wyspie nie ma lekarza, rolnika, pasterza ani garncarza. Dawny lud zostawił rzeczy, które wyglądają na drobiazgi. Z czasem, gdy zabraknie czegoś z wraku, okazują się potrzebne. Zrozumiane: ${n} z ${SLAD.length}.</p>`;
 if(!S.found.length)return h+'<p class="lead">Nic jeszcze nie znaleziono. Zwiadowcy odsłaniają wyspę.</p>';
 return h+S.found.map(i=>{const s=SLAD[i],ok=slad(s.k);return`<div class="card"><h4>${TRIBE[i][0]}${ok?' <span class="ok" style="font-size:13px">✓ zrozumiane</span>':''}</h4><p>${TRIBE[i][1]}</p><p class="${ok?'':'mut'}">${ok?'<b>Dar:</b> '+s.eff:'Nikt nie wie, do czego to służyło. Może przyda się '+s.why+'.'}</p></div>`}).join('')}
// gorączka w przysiółku: leki pomagają
{const e=EVENTS.find(x=>x.id==='kol_goraczka');if(e){const f=e.opts[0].f;e.opts[0].f=c=>{if(slad('leki')&&Math.random()<.5){c.h.wiez=Math.min(1,c.h.wiez+.12);S.res.ziola=Math.max(0,S.res.ziola-3);return'Zielarka niesie mieszankę dawnego ludu. Gorączka spada w trzy dni.'}return f(c)}}}

/* ---- modele śladów ---- */
const plantTex=(function(){const c=document.createElement('canvas');c.width=256;c.height=160;const x=c.getContext('2d');x.fillStyle='#8b8378';x.fillRect(0,0,256,160);
 const r0=rng(912);for(let k=0;k<400;k++){x.fillStyle=`rgba(${60+r0()*60|0},${55+r0()*50|0},${50+r0()*40|0},.25)`;x.fillRect(r0()*256,r0()*160,2+r0()*5,2+r0()*5)}
 x.strokeStyle='#9c3f22';x.fillStyle='#9c3f22';x.lineWidth=3;x.lineCap='round';
 const plant=(px,py,kind)=>{x.beginPath();x.moveTo(px,py+40);x.lineTo(px,py);x.stroke();for(let q=0;q<3;q++){x.beginPath();x.ellipse(px+(q%2?9:-9),py+8+q*10,8,3.5,(q%2?-.6:.6),0,6.3);x.fill()}
  if(kind){x.beginPath();x.moveTo(px,py+40);x.lineTo(px-10,py+52);x.moveTo(px,py+40);x.lineTo(px+8,py+54);x.moveTo(px,py+40);x.lineTo(px,py+56);x.stroke()}};
 [[38,30,1],[98,24,0],[160,32,1],[218,26,0]].forEach(([a,b,k])=>plant(a,b,k));
 x.globalAlpha=.85;[[38,118],[160,118]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b,10,13,0,0,6.3);x.fill();for(let f=0;f<5;f++){x.beginPath();x.ellipse(a-12+f*6,b-16-(f%4?4:0),3,8,0,0,6.3);x.fill()}});
 x.lineWidth=5;[[98,118],[218,118]].forEach(([a,b])=>{x.beginPath();x.moveTo(a-14,b-14);x.lineTo(a+14,b+14);x.moveTo(a+14,b-14);x.lineTo(a-14,b+14);x.stroke()});
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t})();
makeTribeModel=function(k){const g=new THREE.Group();const clay=M(0x9a5a3a),clayD=M(0x6e3f2a),flint=M(0x5b5d63),bone=matBone,moss=matMoss;
 if(k===0){g.add(mesh(new THREE.DodecahedronGeometry(1.1,0),matStone,0,.6,0,0,.3));g.add(mesh(new THREE.DodecahedronGeometry(.8,0),matStone,1.2,.4,.3,0,1.2));
  [[.55,.08,.75,.16],[.8,.06,.95,.12],[.35,.07,1.0,.14],[.7,.08,.55,.1]].forEach(([x,y,z,r])=>{g.add(mesh(new THREE.SphereGeometry(r,8,6),clay,x,y+r*.8,z));g.add(mesh(new THREE.CylinderGeometry(r*.5,r*.55,r*.35,8),M(0xd9c27a),x,y+r*1.75,z))})}
 else if(k===1){const r=mesh(new THREE.DodecahedronGeometry(1.4,0),matStone,0,.9,-.4,0,.5);r.scale.set(1.2,.8,1);g.add(r);
  for(let q=0;q<7;q++)g.add(mesh(new THREE.TetrahedronGeometry(.09,0),flint,(q%4)*.22-.3,.05,.55+((q/4)|0)*.22,q,q*2,.3));
  const bow=new THREE.Mesh(new THREE.TorusGeometry(.8,.035,5,16,2.2),M(0x5e3a22));bow.rotation.set(Math.PI/2,0,.5);bow.position.set(.2,.06,.9);g.add(bow)}
 else if(k===2){g.add(mesh(new THREE.DodecahedronGeometry(1.3,0),matStone,0,.8,0,0,.4));const p=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.95),new THREE.MeshStandardMaterial({map:plantTex,roughness:1}));p.position.set(.05,.9,1.13);p.rotation.x=-.12;g.add(p);const p2=p.clone();p2.position.set(-.05,.9,-1.13);p2.rotation.set(.12,Math.PI,0);g.add(p2)}
 else if(k===3){for(let q=0;q<11;q++){const a=q/11*6.28;g.add(mesh(new THREE.DodecahedronGeometry(.17,0),matStone,Math.cos(a)*.8,.08,Math.sin(a)*.8))}g.add(mesh(new THREE.CylinderGeometry(.72,.6,.06,12),M(0x3a332c),0,.02,0));
  for(let q=0;q<9;q++)g.add(mesh(new THREE.BoxGeometry(.16,.03,.12),clay,Math.sin(q*2.3)*.45,.07,Math.cos(q*1.7)*.45,0,q,0));g.add(mesh(new THREE.DodecahedronGeometry(.32,0),M(0x9a7a5a),1.3,.15,.2))}
 else if(k===4){for(let q=0;q<6;q++){const s=mesh(new THREE.CylinderGeometry(.2,.22,.08,9),matStone,-1+q*.4,.04,Math.sin(q)*.1);g.add(s);g.add(mesh(new THREE.CylinderGeometry(.05,.05,.09,6),M(0x2a2622),-1+q*.4,.05,Math.sin(q)*.1))}}
 else if(k===5){g.add(mesh(new THREE.CylinderGeometry(.6,.68,.22,10),matStone,0,.11,0));g.add(mesh(new THREE.CylinderGeometry(.42,.42,.04,10),M(0x6d6a63),0,.22,0));g.add(mesh(new THREE.SphereGeometry(.2,8,6),matStone,.25,.36,.1));
  for(let q=0;q<10;q++)g.add(mesh(new THREE.SphereGeometry(.03,4,3),M(0x1d1712),Math.cos(q)*.75,.03,Math.sin(q*1.3)*.75))}
 else if(k===6){for(let q=0;q<20;q++){const a=q/20*6.28;if(a>5.7)continue;for(let l=0;l<2;l++)g.add(mesh(new THREE.BoxGeometry(.42,.18,.26),matStone,Math.cos(a)*1.6,.09+l*.18,Math.sin(a)*1.6,0,-a+l*.3,0))}
  for(let q=0;q<7;q++)g.add(mesh(new THREE.CylinderGeometry(.035,.035,.45,4),bone,(q%3)*.3-.3,.04,((q/3)|0)*.3-.2,0,q,Math.PI/2))}
 else{const trunk=M(0x5a4532),crown=M(0x6f8a4a),fruit=M(0xb84a2a);for(let q=0;q<5;q++){const x=(q%3-1)*1.6,z=((q/3)|0)*1.7-.8;const t=mesh(new THREE.CylinderGeometry(.09,.14,1.1,6),trunk,x,.55,z,0,0,(q%2?.18:-.15));g.add(t);
   const c=mesh(new THREE.IcosahedronGeometry(.6,0),crown,x+(q%2?.15:-.12),1.3,z);c.scale.set(1.15,.8,1.1);g.add(c);for(let f=0;f<4;f++)g.add(mesh(new THREE.SphereGeometry(.06,5,4),fruit,x+Math.cos(f*1.7)*.5,1.1+(f%2)*.3,z+Math.sin(f*1.7)*.5))}
  g.add(mesh(new THREE.SphereGeometry(.7,9,5,0,6.283,0,1.3),moss,.2,-.25,1.6));g.add(mesh(new THREE.BoxGeometry(.6,.1,.45),matStone,.2,.42,1.6,.1))}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});return g};
// ślady zwrócone ku domyślnemu widokowi, żeby było widać naczynka, groty i malowidło
{const _bs=buildStatic;buildStatic=function(){_bs();tribe.forEach(t=>{if(t.m&&[0,1,2,7].includes(t.k))t.m.rotation.y=Math.PI/4+(t.i%5-2)*.12})}}
