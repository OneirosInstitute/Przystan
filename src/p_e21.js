// ================= 2.1 Epoka II: drugie rozdroża i akt VIII =================
RN.jaja='Jaja';RN.pierze='Pierze';SPOIL.jaja=.03;if(!FOOD.includes('jaja'))FOOD.push('jaja');
IC.jaja='<ellipse cx="12" cy="13" rx="6" ry="8"/>';IC.pierze='<path d="M5 19C9 9 14 5 20 4c-1 6-5 11-15 15z"/><path d="M5 19l9-9"/>';
const e2R2=id=>!!(S&&S.e2&&S.e2.r2===id);
const e2A9=()=>!!(S&&S.e2&&S.e2.a>=9);
function e2ResFix(){if(!S||!S.res)return;['jaja','pierze'].forEach(k=>{if(!(S.res[k]>=0))S.res[k]=0})}
// ---------- nowe budowle ----------
Object.assign(BD,{
 lawa:{cat:'wsp',n:'Ława starszych',w:2,h:2,cost:{kamien:24,drewno:12},work:8,e2:'rada',d:'Kamienne ławy w kręgu pod starą lipą. Tu zasiada rada starszych i tu rozsądza spory.'},
 plac:{cat:'wsp',n:'Plac wiecowy',w:3,h:3,cost:{drewno:24,kamien:16,plotno:6},work:10,e2:'wiec',d:'Ubity plac z kamieniem mówcy, ławami w półkolu i chorągwiami rodów. Tu każdy dorosły ma głos.'},
 dwor:{cat:'dom',n:'Dwór rodu',w:3,h:2,cost:{drewno:40,deski:24,cegla:16,gwozdzie:30,kamien:16},work:24,house:10,fuel:.5,e2:'rod',d:'Duży dom z bali z wieżyczką i rzeźbionym szczytem, siedziba rodu, który prowadzi osadę. Mieści 10 osób.'},
 ptasznik:{cat:'jedzenie',n:'Chata ptaszników',w:2,h:2,cost:{drewno:16,deski:6,wlokna:4},work:7,wk:2,c:'zbieracz',shore:1,e2:'skaly',prod:{in:{},out:{jaja:2,pierze:1},t:22,when:()=>{const s=seasonIdx();return(s===0||s===3)&&(S.res.jaja||0)<160}},d:'Ptasznicy schodzą na linach po skałach nad morzem i zbierają jaja mew, a z gniazd pierze. Jaja wiosną i latem, pierze na ciepłe posłania. Stawia się ją na brzegu.'}});
E2_WHERE.ptasznik='chata ptaszników musi stać na brzegu, przy wodzie';
Object.assign(E2ACT,{lawa:'zasiada w radzie',plac:'przemawia na wiecu',ptasznik:'zbiera jaja na skałach'});
Object.assign(SIGNK,{ptasznik:'zywnosc'});
// ---------- rody ----------
function e2RodCnt(){const c={};S.people.forEach(p=>{if(p.rod!==undefined)c[p.rod]=(c[p.rod]||0)+1});return c}
function e2RodBig(){const c=e2RodCnt();return Object.keys(c).sort((a,b)=>c[b]-c[a])[0]}
const e2LeadN=()=>S.people.filter(p=>String(p.rod)===String(S.e2.rodLead)).length;
const e2LeadM=()=>S.people.filter(p=>String(p.rod)===String(S.e2.rodLead)&&Math.max(...Object.values(p.sk))>=3).length;
// ---------- druga osada ----------
function e2Second(){const id=S.e2&&S.e2.second;return(S.hamlets||[]).find(h=>h.id===id)||null}
const E2_WOZ={drewno:40,kamien:20,narz:2};
function e2WozWhy(){const h=e2Second();if(!h)return'Druga osada nie istnieje.';const miss=Object.entries(E2_WOZ).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>RN[k].toLowerCase()+' '+Math.ceil(v-(S.res[k]||0)));if(miss.length)return'Brakuje: '+miss.join(', ')+'.';if(foodTotal()<60)return'Za mało jedzenia (60).';if(S.day-(S.e2.wozD||-99)<2)return'Poprzedni wóz jeszcze nie wrócił.';return''}
function e2Woz(){const why=e2WozWhy();if(why){toast(why);return}const h=e2Second();Object.entries(E2_WOZ).forEach(([k,v])=>S.res[k]-=v);const tot=foodTotal();FOOD.forEach(k=>{S.res[k]-=60*((S.res[k]||0)/tot)});
 h.zap=Math.min(1,(h.zap||0)+.35);h.wiez=Math.min(1,(h.wiez||0)+.12);S.e2.wypN=(S.e2.wypN||0)+1;S.e2.wozD=S.day;for(let k=0;k<3;k++)spawnWalker(h,1,null,1,k*.6);
 log(`Wóz z zapasami jedzie do ${h.name}: kłody, kamień, narzędzia i jedzenie. Druga osada ma z czego budować.`);toast('Wóz jedzie do '+h.name);renderPanel()}
{const _hg=hamGifts;hamGifts=function(h){const g=_hg(h);if(e2R2('druga')&&S.e2.second===h.id)return g.map(([k,v])=>[k,Math.round(v*1.6)]);return g}}
// ---------- sąsiednie wyspy ----------
const ISL=[{k:'mew',n:'Wyspa Mew',d:'niska i skalista, pełna gniazd',g:{ryby:3,jaja:3,pierze:1},a:.55,r:14},
 {k:'sosn',n:'Sosnowa Wyspa',d:'porośnięta starym borem',g:{drewno:5,miod:1,skory:1},a:2.25,r:19},
 {k:'garb',n:'Kamienny Garb',d:'goła skała z żyłami rudy',g:{kamien:4,ruda:2},a:3.7,r:12},
 {k:'foki',n:'Wyspa Fok',d:'piaszczysta, z fokami na mieliznach',g:{ryby:2,skory:3,mieso:2},a:5.0,r:16}];
const ISL_BY={};ISL.forEach(x=>ISL_BY[x.k]=x);
function e2Isl(){S.e2.isl=S.e2.isl||[];return S.e2.isl}
function e2HorWhy(){if(!hasDone('szkutnia'))return'Potrzebna szkutnia.';const big=(S.e2.big||0)>=4;if(!big&&(S.res.lodz||0)<2)return S.e2.r1==='wielka'?'Wielka łódź nie jest jeszcze gotowa.':'Potrzebne dwie łodzie przy brzegu.';
 if(S.exps.some(e=>e.type==='horyzont'))return'Jedna wyprawa już płynie za horyzont.';if(expCandidates(4).length<4)return'Za mało wolnych, zdrowych ludzi (4).';if(foodTotal()<K*4*8)return'Za mało jedzenia na drogę.';return''}
function e2Hor(){const why=e2HorWhy();if(why){toast(why);return}const sz=S.bld.find(b=>b.kind==='szkutnia'&&bDone(b));const ppl=expCandidates(4);const big=(S.e2.big||0)>=4,days=big?6:8;
 const tot=foodTotal();FOOD.forEach(k=>{S.res[k]-=K*4*days*((S.res[k]||0)/tot)});if(!big)S.res.lodz-=2;const ex=entryOf(sz.kind,sz.i,sz.j)||[camp.i,camp.j];
 const e={id:(S.expN=(S.expN||0)+1),r:0,type:'horyzont',ppl:ppl.map(p=>p.id),days,left:days,exit:ex,big,risk:(big?.05:.12)*wxSea()*(seasonIdx()===2?1.7:1)};S.exps.push(e);
 ppl.forEach(p=>{release(p);p.path=null;p.state='idle';p.wait=0;p.job='wyp';p.wb=null;p.exp=e.id;p.act='płynie za horyzont'});
 log(`${big?'Wielka łódź':'Dwie łodzie'} wypływa${big?'':'ją'} za horyzont. Płyną: ${ppl.map(p=>p.name).join(', ')}. Wrócą za ${days} dni.`);toast('Wyprawa za horyzont');assign();renderPanel()}
{const _fe=finishExp;finishExp=function(e,out){if(e.type!=='horyzont')return _fe(e,out);S.exps=S.exps.filter(x=>x!==e);const lines=[];const L=e2Isl();
 const lost=Math.random()<e.risk*.4;if(!e.big&&!lost)S.res.lodz=(S.res.lodz||0)+2;else if(!e.big&&lost)S.res.lodz=(S.res.lodz||0)+1;
 const nx=ISL.find(x=>!L.some(y=>y.k===x.k));
 if(nx){L.push({k:nx.k,camp:0,pop:0,d:S.day});e2IslVis();lines.push(`Po dwóch dniach żeglugi z mgły wyłania się ląd: ${nx.n}, ${nx.d}. Nikogo tam nie ma, tylko ptaki i wiatr. Zostawiają na brzegu znak z kamieni.`);song('Pieśń o '+(nx.k==='mew'?'Wyspie Mew':nx.k==='sosn'?'Sosnowej Wyspie':nx.k==='garb'?'Kamiennym Garbie':'Wyspie Fok'));pamAdd(3,'wyspa')}
 else lines.push('Opłynęli wszystkie znane wyspy. Za nimi jest już tylko otwarte morze.');
 const got={ryby:Math.round(30+Math.random()*40),skory:Math.round(2+Math.random()*5)};if(nx)Object.entries(nx.g).forEach(([k,v])=>{const n=Math.round(v*5);got[k]=(got[k]||0)+n;S.e2.islGoods=(S.e2.islGoods||0)+n});Object.entries(got).forEach(([k,v])=>S.res[k]=(S.res[k]||0)+v);
 lines.push('Przywieźli: '+Object.entries(got).map(([k,v])=>RN[k].toLowerCase()+' '+v).join(', ')+'.');
 out.forEach(p=>{if(Math.random()<e.risk){p.hp=Math.max(.3,p.hp-.25);p.hurt=1;lines.push(p.name+' wraca chory od zimna i słonej wody.')}gainXp(p,'rybak',50)});
 if(lost)lines.push(e.big?'':'Jedna łódź przepadła w sztormie. Ludzie przesiedli się do drugiej.');
 out.forEach(p=>{p.job='rob';p.exp=null;p.state='idle';const st=e.exit;p.x=tcx(st[0]);p.z=tcx(st[1]);p.wait=.2});S.e2.horN=(S.e2.horN||0)+1;techXp('nauka',14);
 S.expLog=S.expLog||[];S.expLog.unshift({d:Math.floor(S.day)+1,r:'Za horyzont',t:lines.join(' ')});if(S.expLog.length>8)S.expLog.pop();
 log('Wyprawa za horyzont wraca. '+lines.filter(Boolean).join(' '));toast('Wyprawa wróciła zza horyzontu');assign();renderPanel()}}
const E2_OBOZ={drewno:40,deski:10,narz:2};
function e2ObozWhy(k){const x=e2Isl().find(y=>y.k===k);if(!x)return'Wyspa nie jest odkryta.';if(x.camp)return'Obóz już stoi.';const miss=Object.entries(E2_OBOZ).filter(([r,v])=>(S.res[r]||0)<v).map(([r,v])=>RN[r].toLowerCase()+' '+Math.ceil(v-(S.res[r]||0)));if(miss.length)return'Brakuje: '+miss.join(', ')+'.';
 if(foodTotal()<60)return'Za mało jedzenia (60).';if((S.res.lodz||0)<1&&(S.e2.big||0)<4)return'Nie ma łodzi, która ich zawiezie.';if(expCandidates(3).length<3)return'Za mało wolnych, zdrowych ludzi (3).';return''}
function e2Oboz(k){const why=e2ObozWhy(k);if(why){toast(why);return}const x=e2Isl().find(y=>y.k===k),I=ISL_BY[k];Object.entries(E2_OBOZ).forEach(([r,v])=>S.res[r]-=v);const tot=foodTotal();FOOD.forEach(f=>{S.res[f]-=60*((S.res[f]||0)/tot)});
 const ppl=expCandidates(3);x.camp=1;x.pop=ppl.length;x.ppl=ppl.map(p=>p.name);x.cd=S.day;ppl.forEach(p=>{p.waitHome=0;leavePerson(p)});e2IslVis();pamAdd(3,'wyspa');
 log(`Na wyspie ${I.n} staje obóz: szałas z desek, wędzarnia i znak osady. Zostają tam ${x.ppl.join(', ')}. To wciąż nasi ludzie, tylko za wodą.`);toast('Obóz: '+I.n);song('Pieśń o obozie za wodą');assign();assignHomes();renderPanel()}
function e2IslDaily(){const L=e2Isl();if(!L.length)return;const d=Math.floor(S.day);if(d%5!==3||S.e2.islD===d)return;S.e2.islD=d;
 const camps=L.filter(x=>x.camp);if(!camps.length)return;if((S.res.lodz||0)<1&&(S.e2.big||0)<4){log('Z obozów na wyspach nikt nie przypłynął: przy brzegu nie ma żadnej łodzi.');return}const got={};
 camps.forEach(x=>{const I=ISL_BY[x.k];Object.entries(I.g).forEach(([k,v])=>{const n=Math.round(v*x.pop*(.7+Math.random()*.6));if(n>0){S.res[k]=(S.res[k]||0)+n;got[k]=(got[k]||0)+n;S.e2.islGoods=(S.e2.islGoods||0)+n}})});
 log('Łódź z obozów na wyspach przywozi: '+Object.entries(got).map(([k,v])=>RN[k].toLowerCase()+' '+v).join(', ')+'.');toast('Łódź z wysp')}
// wyspy na horyzoncie: niskie, zielone garby z plażą, a przy obozie dym
const islG=new THREE.Group();scene.add(islG);let islKey='';
function e2IslVis(){const L=S&&S.e2&&S.e2.isl||[];const key=L.map(x=>x.k+x.camp).join(',');if(key===islKey)return;islKey=key;islG.children.slice().forEach(o=>islG.remove(o));
 L.forEach(x=>{const I=ISL_BY[x.k];const g=new THREE.Group();const R=I.r,D=112+R;g.position.set(Math.cos(I.a)*D,-.1,Math.sin(I.a)*D);const rnd=rng(I.k.length*977+R);
  const sand=new THREE.Mesh(new THREE.CylinderGeometry(R*1.08,R*1.18,.5,24),M(0xd8c8a0));sand.position.y=.1;g.add(sand);
  const hill=new THREE.Mesh(new THREE.SphereGeometry(R,20,10,0,6.283,0,Math.PI/2),M(I.k==='garb'?0x8a8880:0x5f7a45));hill.scale.y=(I.k==='garb'?.55:.32);hill.position.y=.3;hill.castShadow=true;hill.receiveShadow=true;g.add(hill);
  if(I.k!=='garb')for(let q=0;q<(I.k==='sosn'?40:12);q++){const a=rnd()*6.28,r=rnd()*R*.75,h=hill.scale.y*R*Math.sqrt(Math.max(0,1-(r/R)**2))+.3;const t=new THREE.Mesh(new THREE.ConeGeometry(.8+rnd()*.6,2.6+rnd()*1.8,6),M(I.k==='sosn'?0x2f4a32:0x4a6a3a));t.position.set(Math.cos(a)*r,h+1.2,Math.sin(a)*r);t.castShadow=true;g.add(t)}
  for(let q=0;q<10;q++){const a=rnd()*6.28;const s=mesh(new THREE.DodecahedronGeometry(.6+rnd()*1.2,0),matStone,Math.cos(a)*R*1.02,.3,Math.sin(a)*R*1.02,rnd()*3,rnd()*3,0);g.add(s)}
  if(x.camp){const c=new THREE.Group();const a=I.a+Math.PI;c.position.set(Math.cos(a)*R*.7,hill.scale.y*R*.7+.3,Math.sin(a)*R*.7);c.scale.setScalar(1.6);const hut=makeBuildingModel('szalas',null);c.add(hut);
   const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,transparent:true,opacity:.35,depthWrite:false,color:0xd8dcdc}));sp.scale.set(2.5,5,1);sp.position.set(.6,3.5,0);c.add(sp);g.add(c)}
  islG.add(g)})}
// ---------- drugie rozdroża ----------
const ROZ2={
 dom:{t:'Kto stanowi prawo?',x:'Prawo jest spisane, ale kto ma go strzec, gdy najstarsi odejdą? Wiec zbiera się na rozstajach po raz drugi. Jedni chcą rady starszych, inni wiecu, na którym każdy dorosły ma głos. Najliczniejszy ród mówi, że ktoś musi prowadzić i że powinien to być on.',o:[
  {id:'rada',n:'Rada starszych',d:'Pięcioro najstarszych sądzi spory i strzeże obyczajów. Niezgoda gaśnie szybciej, a ludzie chętniej przychodzą ze sprawami przed radę.',r:'Postanowiono: rada starszych. Pięcioro siwych głów siada w kręgu i milczy, dopóki ktoś nie zacznie mówić.',song:'Pieśń o pięciu starszych'},
  {id:'wiec',n:'Wiec wszystkich',d:'Każdy dorosły ma głos, także młodzi urodzeni na wyspie. Dawne obyczaje można zmienić, nadzieja rośnie, ale sporów jest więcej.',r:'Postanowiono: wiec wszystkich. Najmłodszy dorosły pierwszy zabiera głos i nikt mu nie przerywa.',song:'Pieśń o wiecu, na którym mówią wszyscy'},
  {id:'rod',n:'Najstarszy ród',d:'Najliczniejszy ród prowadzi osadę. Praca idzie sprawniej, ale inne rody łatwiej się obrażają.',r:'Postanowiono: prowadzi najliczniejszy ród. Jego najstarszy wbija w ziemię słup ze znakiem rodu.',song:'Pieśń o rodzie, który prowadzi'}]},
 glab:{t:'Jedna silna osada czy łańcuch przysiółków?',x:'Przysiółków jest coraz więcej, a drogi między nimi coraz dłuższe. Jedni mówią: zbudujmy w głębi wyspy drugą prawdziwą osadę, żeby nie wracać po wszystko na wybrzeże. Inni wolą wiele małych przysiółków jeden przy drugim, jak paciorki na sznurku.',o:[
  {id:'druga',n:'Jedna silna druga osada',d:'Największy przysiółek staje się drugą osadą: rośnie szybciej i przysyła więcej. Osada może wysyłać do niej wozy z zapasami.',r:'Postanowiono: druga osada. Wiec wybiera miejsce, a starsi błogosławią pierwszy wóz z narzędziami.',song:'Pieśń o drugim ognisku'},
  {id:'lancuch',n:'Łańcuch przysiółków',d:'Drogi między przysiółkami są tańsze, nowe przysiółki zaczynają z lepszymi zapasami, a więź słabnie wolniej.',r:'Postanowiono: łańcuch przysiółków. Każdy nowy przysiółek dostaje od sąsiada ogień w glinianym garnku.',song:'Pieśń o ogniu niesionym w garnku'}]},
 morze:{t:'Za horyzont czy wokół własnej wyspy?',x:'Łodzie wracają z rejsów pełne ryb i opowieści. Z najwyższego cypla w pogodny dzień widać na morzu ciemną kreskę lądu. Jedni chcą tam płynąć. Inni mówią, że wokół naszej wyspy są jeszcze zatoki i ptasie skały, na których nikt z nas nie postawił stopy.',o:[
  {id:'wyspy',n:'Sąsiednie bezludne wyspy',d:'Wyprawy za horyzont odkrywają małe bezludne wyspy. Na każdej można założyć obóz, który co kilka dni przysyła swoje dobra. Kto płynie daleko, ryzykuje.',r:'Postanowiono: za horyzont. Na dziobie łodzi ktoś wycina znak osady, żeby obcy ląd wiedział, czyja to łódź.',song:'Pieśń o ciemnej kresce na morzu'},
  {id:'skaly',n:'Zatoki i ptasie skały',d:'Chaty ptaszników dają jaja i pierze na ciepłe posłania, rejsy wokół wyspy przywożą więcej, a łowiska przy pomostach są bogatsze.',r:'Postanowiono: zostajemy przy naszej wyspie. Młodzi uczą się schodzić na linach po skałach.',song:'Pieśń o ptasich skałach'}]}};
const E2C={
 rada:{n:'Rada starszych',intro:'Rada zbiera się pod lipą. Ma rozsądzać spory i pilnować, żeby osada żyła w zgodzie.',g:[
  ['Postaw ławę starszych',()=>hasDone('lawa'),'Budowa → Wspólnota → Ława starszych.'],
  ['Rada rozsądza trzy spory',()=>(S.e2.sporN||0)>=3,'Ludzie sami przychodzą ze sprawami przed radę. Wyrok wybierasz w scenie sporu.'],
  ['Dziesięć dni zgody',()=>(S.e2.calmD||0)>=10,'Niezgoda poniżej 15% przez dziesięć dni z rzędu.']]},
 wiec:{n:'Wiec wszystkich',intro:'Na wiecu mówi każdy, kto skończył dwanaście lat. Dawne obyczaje przestają być nietykalne.',g:[
  ['Postaw plac wiecowy',()=>hasDone('plac'),'Budowa → Wspólnota → Plac wiecowy.'],
  ['Wiec zmienia dwa obyczaje',()=>(S.e2.custN||0)>=2,'Na początku każdej pory roku wiec może zmienić jeden obyczaj: Ludzie → Obyczaje.'],
  ['Dziesięć dni nadziei',()=>(S.e2.hopeD||0)>=10,'Nadzieja powyżej 80% przez dziesięć dni z rzędu.']]},
 rod:{n:'Ród prowadzi',intro:'Prowadzi najliczniejszy ród. Musi pokazać, że umie to robić: postawić dwór, wychować mistrzów i nie zrazić do siebie innych.',g:[
  ['Postaw dwór rodu',()=>hasDone('dwor'),'Budowa → Domy → Dwór rodu.'],
  ['Ród rośnie o czworo',()=>e2LeadN()>=(S.e2.rodN0||0)+4,'Wesela i narodziny w rodzie. Żona przechodzi do rodu męża.'],
  ['Dwóch nowych mistrzów w rodzie',()=>e2LeadM()>=(S.e2.rodM0||0)+2,'Mistrz to poziom fachu 3 lub wyżej. Młodzi uczą się przy mistrzach.']]},
 druga:{n:'Druga osada',intro:'Druga osada ma stać się prawdziwą wsią w głębi wyspy, z własnym ogniem i własnymi ludźmi.',g:[
  ['Druga osada: 18 osób',()=>{const h=e2Second();return!!h&&h.pop>=18},'Druga osada rośnie, gdy ma pełne zapasy. Droga i wozy z zapasami pomagają.'],
  ['Droga do drugiej osady',()=>{const h=e2Second();return!!h&&h.road===2},'Karta przysiółka → wytycz drogę.'],
  ['Trzy wozy z zapasami',()=>(S.e2.wypN||0)>=3,'Ludzie → karta Epoka II → wyślij wóz.']]},
 lancuch:{n:'Łańcuch przysiółków',intro:'Przysiółki mają leżeć jeden przy drugim, połączone drogami, tak żeby z każdego dało się dojść do sąsiada przed zmrokiem.',g:[
  ['Sześć przysiółków',()=>(S.hamlets||[]).length>=6,'Ludzie → Wspólnota → nowy przysiółek.'],
  ['Drogi do wszystkich przysiółków',()=>(S.hamlets||[]).length>=2&&S.hamlets.every(h=>h.road===2),'Drogi są teraz tańsze.'],
  ['Każdy przysiółek ma zapasy',()=>(S.hamlets||[]).length>=2&&S.hamlets.every(h=>(h.zap||0)>=.4),'Zapasy przysiółka rosną, gdy odpowiadasz na jego prośby.']]},
 wyspy:{n:'Za horyzont',intro:'Za horyzontem są małe bezludne wyspy. Trzeba je odnaleźć, nazwać i postawić na nich obozy.',g:[
  ['Odkryj dwie sąsiednie wyspy',()=>e2Isl().length>=2,'Wyprawy → Za horyzont. Potrzebna wielka łódź albo dwie łodzie i czworo ludzi.'],
  ['Załóż obóz na sąsiedniej wyspie',()=>e2Isl().some(x=>x.camp),'Wyprawy → Za horyzont → załóż obóz. Troje ludzi zostaje na wyspie.'],
  ['Przywieź z wysp 100 dóbr',()=>(S.e2.islGoods||0)>=100,'Łódź z obozów przypływa co pięć dni, jeśli przy brzegu stoi choć jedna łódź.']]},
 skaly:{n:'Ptasie skały',intro:'Wokół wyspy są zatoki, do których nikt jeszcze nie wpłynął, i skały, na których gnieżdżą się tysiące ptaków.',g:[
  ['Postaw chatę ptaszników',()=>hasDone('ptasznik'),'Budowa → Jedzenie → Chata ptaszników, na brzegu.'],
  ['Zbierz 80 jaj',()=>(S.e2.jajaN||0)>=80,'Ptasznicy zbierają jaja wiosną i latem.'],
  ['Sześć rejsów wokół wyspy',()=>(S.e2.rejsy||0)>=6,'Wyprawy → Rejs wzdłuż brzegu. Rejsy przywożą teraz więcej.']]}};
function e2Roz2(){const R=ROZ2[S.path];const e=S.e2;openEvent({ey:'Rozstaje · drugie rozdroże',t:R.t,text:()=>R.x+'\n\nTej decyzji nie da się cofnąć.',
 opts:R.o.map(o=>({n:o.n,d:o.d,f:()=>{e.r2=o.id;e.a=9;e.t9=S.day;S.tech['e2_'+o.id]=1;e2Keys();pamAdd(4,'rozdroze');song(o.song);log('Drugie rozstaje: '+o.n.toLowerCase()+'. '+o.r);e.introQ=1;e2Apply2();renderPanel();return o.r}}))},{})}
function e2Apply2(){const e=S.e2;if(e.r2==='rod'){e.rodLead=e2RodBig();e.rodN0=e2LeadN();e.rodM0=e2LeadM();log(`Prowadzi ${rodName(e.rodLead)}.`)}
 if(e.r2==='druga'){const hs=(S.hamlets||[]).slice().sort((a,b)=>b.pop-a.pop||Math.hypot(b.i-camp.i,b.j-camp.j)-Math.hypot(a.i-camp.i,a.j-camp.j));if(hs[0]){e.second=hs[0].id;hs[0].zap=Math.max(hs[0].zap||0,.6);log(`Drugą osadą będzie ${hs[0].name}.`)}}}
// sceny i liczniki
function e2Tick21(){return false}
{const _os=openSpor;openSpor=function(){if(S&&S.spor&&e2A9()&&S.e2.r2==='rada'&&S.e2.a===9)S.e2.sporN=(S.e2.sporN||0)+1;return _os()}}
{const _cc=custChange;custChange=function(k,id){const b=S.cust[k];_cc(k,id);if(S.cust[k]!==b&&e2R2('wiec')&&S.e2.a===9)S.e2.custN=(S.e2.custN||0)+1}}
{const _yv=youngVoice;youngVoice=function(){return e2R2('wiec')||_yv()}}
{const _bm2=bMul;bMul=function(b){let m=_bm2(b);if(e2R2('rod'))m*=1.05;if(b&&b.kind==='pomost'&&e2R2('skaly'))m*=1.15;return m}}
{const _gm2=gospMade;gospMade=function(b,r,v){const x=_gm2(b,r,v);if(S&&S.e2&&b&&b.kind==='ptasznik'&&r==='jaja')S.e2.jajaN=(S.e2.jajaN||0)+v;return x}}
{const _rc2=roadCost;roadCost=function(h){const c=_rc2(h);if(e2R2('lancuch')){c.drewno=Math.ceil(c.drewno*.65);c.kamien=Math.ceil(c.kamien*.65)}return c}}
{const _fh=foundHamlet;foundHamlet=function(m,why,rid,o){if(e2R2('lancuch')){o=Object.assign({},o||{});if(o.zap===undefined)o.zap=.62}return _fh(m,why,rid,o)}}
// rejs przy ptasich skałach przywozi więcej
{const _fe2=finishExp;finishExp=function(e,out){const r0={ryby:S.res.ryby,skory:S.res.skory};const x=_fe2(e,out);if(e.type==='rejs'&&e2R2('skaly')){const ry=Math.round(Math.max(0,S.res.ryby-r0.ryby)*.5),ja=Math.round(10+Math.random()*16),pi=Math.round(3+Math.random()*5);S.res.ryby+=ry;S.res.jaja=(S.res.jaja||0)+ja;S.res.pierze=(S.res.pierze||0)+pi;log(`Z zatok i ptasich skał łódź przywozi też jaja ${ja} i pierze ${pi}.`)}return x}}
function e2Daily21(){if(!S||S.epoch!==2||!S.e2||!S.e2.r2)return;const e=S.e2,sea=seasonIdx();e2ResFix();
 if(e.r2==='rada'){S.dis=Math.max(0,(S.dis||0)-.004);e.calmD=(S.dis||0)<.15?(e.calmD||0)+1:0;
  if(!S.spor&&S.day>12&&(!S.sporNext||S.day>=S.sporNext-4)&&Math.random()<.3){const ad=S.people.filter(isAdult);const a=lpick(ad),b=lpick(ad.filter(q=>a&&q.fam!==a.fam));if(a&&b){S.spor={a:a.id,b:b.id,why:S.bld.filter(x=>x.field).length>=2&&Math.random()<.5?'miedza':'krzywda',day:S.day};S.sporNext=S.day+3+Math.random()*3;openSpor()}}}
 if(e.r2==='wiec'){S.hope=clamp(S.hope+.002,0,1);e.hopeD=S.hope>.8?(e.hopeD||0)+1:0;if(S.sporNext&&S.sporNext>S.day+6)S.sporNext-=.4}
 if(e.r2==='rod'){const c=e2RodCnt();const others=Object.keys(c).filter(k=>k!==String(e.rodLead)&&c[k]>=3).length;S.dis=clamp((S.dis||0)+.0012*others,0,1)}
 if(e.r2==='druga'){const h=e2Second();if(h&&(h.zap||0)>.45&&Math.random()<.18+(h.road===2?.08:0)){h.pop++;h.ppl=h.ppl||[];if(Math.random()<.35)log(`Do drugiej osady, ${h.name}, przybyło ludzi: ${h.pop} ${osb(h.pop)}.`)}}
 if(e.r2==='lancuch')(S.hamlets||[]).forEach(h=>h.wiez=Math.min(1,(h.wiez||0)+.002));
 if(e.r2==='wyspy')e2IslDaily();
 if(e.r2==='skaly'&&sea===2&&(S.res.pierze||0)>=30){const hh=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;S.res.opal+=K*.08*hh}}
{const _nd2=newDay;newDay=function(){_nd2();try{e2Daily21()}catch(er){console.warn(er)}}}
// karta: druga osada, wyspy
function e2HTML21(){const e=S.e2;if(!e||!e.r2)return'';let h='';
 if(e.r2==='druga'){const s=e2Second();if(s){const why=e2WozWhy();h+=`<p class="mut">Druga osada: <b>${s.name}</b>, ${s.pop} ${osb(s.pop)}, zapasy ${zapWord(s.zap||0)}, ${s.road===2?'droga':'ścieżka'}. Wozy: ${e.wypN||0}.</p>${why?`<p class="no" style="font-size:12.5px">${why}</p>`:`<button class="pri" data-e2woz="1">Wyślij wóz: kłody 40, kamień 20, narzędzia 2, jedzenie 60</button>`}`}}
 if(e.r2==='rod')h+=`<p class="mut">Prowadzi ${rodName(e.rodLead)}: ${e2LeadN()} ${osb(e2LeadN())} (na początku ${e.rodN0||0}), mistrzów ${e2LeadM()} (na początku ${e.rodM0||0}).</p>`;
 if(e.r2==='rada')h+=`<p class="mut">Spory przed radą: ${e.sporN||0} · dni zgody z rzędu: ${e.calmD||0}.</p>`;
 if(e.r2==='wiec')h+=`<p class="mut">Obyczaje zmienione przez wiec: ${e.custN||0} · dni nadziei z rzędu: ${e.hopeD||0}.</p>`;
 if(e.r2==='wyspy'){const L=e2Isl();h+=`<p class="mut">Wyspy: ${L.length?L.map(x=>ISL_BY[x.k].n+(x.camp?' (obóz, '+x.pop+' os.)':'')).join(', '):'jeszcze żadnej'} · dobra z wysp: ${e.islGoods||0}.</p>`}
 if(e.r2==='skaly')h+=`<p class="mut">Jaja zebrane: ${e.jajaN||0} · pierze w zapasie: ${Math.floor(S.res.pierze||0)} · rejsów: ${e.rejsy||0}.</p>`;
 return h}
document.addEventListener('click',ev=>{if(!S)return;if(ev.target.closest('[data-e2woz]'))e2Woz();const o=ev.target.closest('[data-e2oboz]');if(o)e2Oboz(o.dataset.e2oboz);if(ev.target.closest('[data-e2hor]'))e2Hor()});
{const _eh2=expHTML;expHTML=function(){let h=_eh2();if(!S||!S.e2||S.e2.r2!=='wyspy')return h;const why=e2HorWhy(),on=S.exps.find(e=>e.type==='horyzont'),L=e2Isl();
 let c=`<div class="card"><h4>Za horyzont</h4><p>${(S.e2.big||0)>=4?'Wielka łódź':'Dwie łodzie'} i czworo ludzi płyną ${(S.e2.big||0)>=4?'sześć':'osiem'} dni na otwarte morze. Każda wyprawa może odnaleźć nową bezludną wyspę. Wracają z rybami, skórami i tym, co da wyspa.</p>${on?`<p class="ok">Wyprawa płynie. Powrót za ${on.left} dni.</p>`:why?`<p class="no">${why}</p>`:'<button class="pri" data-e2hor="1">Wypłyń za horyzont</button>'}`;
 L.forEach(x=>{const I=ISL_BY[x.k];const w=e2ObozWhy(x.k);c+=`<div style="margin-top:8px"><b>${I.n}</b> <span class="mut">${I.d} · daje: ${Object.keys(I.g).map(k=>RN[k].toLowerCase()).join(', ')}</span><br>${x.camp?`<span class="ok">Obóz: ${(x.ppl||[]).join(', ')}</span>`:w?`<span class="no" style="font-size:12.5px">${w}</span>`:`<button data-e2oboz="${x.k}">Załóż obóz: kłody 40, deski 10, narzędzia 2, jedzenie 60, troje ludzi</button>`}</div>`});
 return c+'</div>'+h}}
// po wczytaniu: zasoby, wyspy
{const _bt=boot;boot=function(fresh){_bt(fresh);try{e2ResFix();islKey='';if(S&&S.e2&&S.e2.isl)e2IslVis();else islG.children.slice().forEach(o=>islG.remove(o))}catch(er){console.warn(er)}}}
{const _sf=saveFix;saveFix=function(o){o=_sf(o);if(o&&o.res){if(!(o.res.jaja>=0))o.res.jaja=0;if(!(o.res.pierze>=0))o.res.pierze=0}return o}}
// ---------- modele ----------
function e2Lawa(g){const tr=new THREE.Mesh(oakTrunkG,new THREE.MeshStandardMaterial({color:0x5a4634,roughness:1,flatShading:true,vertexColors:true}));tr.scale.set(1.5,1.4,1.5);tr.position.set(0,0,-.35);
 const cr=new THREE.Mesh(oakG,new THREE.MeshStandardMaterial({color:0x7a9a4a,roughness:.95,flatShading:true,vertexColors:true}));cr.scale.setScalar(1.45);cr.position.set(0,0,-.35);tr.castShadow=cr.castShadow=true;cr.receiveShadow=true;g.add(tr,cr);
 for(let q=0;q<5;q++){const a=-Math.PI*.15+q/4*Math.PI*1.3+Math.PI*.1,x=Math.cos(a)*.78,z=Math.sin(a)*.62+.1;const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=-a+Math.PI/2;
  b.add(tbox(.5,.08,.2,mStone,0,.3,0,0,.9),tbox(.1,.28,.16,mStone,-.18,.14,0,0,.9),tbox(.1,.28,.16,mStone,.18,.14,0,0,.9));g.add(b)}
 g.add(tbox(.45,.12,.32,mStone,0,.06,.2,0,.9));g.add(mesh(new THREE.CylinderGeometry(.06,.06,.05,8),mPlankD,0,.15,.2))}
function e2Plac(g){const gr=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.5,.05,24),M(0x8a7a5c));gr.position.y=.025;gr.receiveShadow=true;g.add(gr);
 g.add(mesh(new THREE.DodecahedronGeometry(.32,0),matStone,0,.22,-.5,0,.5,0));g.add(tbox(.12,1.3,.12,matLog2,.32,.65,-.62));g.add(tbox(.22,.18,.05,mPlankD,.32,1.25,-.56));
 for(let q=0;q<5;q++){const a=Math.PI*.15+q/4*Math.PI*.7,x=Math.cos(a)*1.05,z=Math.sin(a)*.95-.05;const l=cyl(.09,.8,matLog,x,.1,z,0,-a+Math.PI/2,Math.PI/2,7);g.add(l)}
 const fc=[0xa83a2a,0xe8e0cc,0x4a6a8a,0x5a7a4a];for(let q=0;q<4;q++){const a=q/4*6.28+.4,x=Math.cos(a)*1.38,z=Math.sin(a)*1.38;g.add(cyl(.035,1.8,matLog2,x,.9,z,0,0,0,5));const f=new THREE.Mesh(new THREE.PlaneGeometry(.38,.5),M(fc[q],{side:THREE.DoubleSide}));f.position.set(x+.2,1.5,z);g.add(f)}
 g.add(cyl(.22,.06,matStone,-.55,.03,.35,0,0,0,9));for(let q=0;q<3;q++)g.add(cyl(.03,.3,matDark,-.55+Math.cos(q*2.1)*.08,.12,.35+Math.sin(q*2.1)*.08,.3,0,q,4))}
function e2Dwor(g){logHouse(g,2.7,1.7,1.4,{chim:.9,dx:-.3,sidewin:true,roof:mShingle,rh:1.25});
 const tw=new THREE.Group();tw.position.set(-.8,0,-.05);tw.add(tbox(.74,1.35,.74,mLogsE2,0,2.85,0,0,1.1));tw.add(tbox(.86,.08,.86,mPlankD,0,3.55,0,0,1.5));const rf=new THREE.Mesh(new THREE.ConeGeometry(.66,.85,4),mShingE);rf.rotation.y=Math.PI/4;rf.position.y=4.0;rf.castShadow=true;tw.add(rf);
 for(const[x,z,r]of[[0,.38,0],[.38,0,Math.PI/2],[0,-.38,0],[-.38,0,Math.PI/2]])tw.add(tbox(.14,.2,.04,mBlack,x,3.15,z,r));tw.add(cyl(.025,.6,matDark,0,4.65,0,0,0,0,4));const fl=new THREE.Mesh(new THREE.PlaneGeometry(.34,.2),M(0xa83a2a,{side:THREE.DoubleSide}));fl.position.set(.18,4.82,0);tw.add(fl);g.add(tw);
 const gz=1.12;for(let q=0;q<5;q++){const x=-1.25+q*.62;g.add(tbox(.09,1.15,.09,matLog2,x,.3+.57,gz));g.add(tbox(.16,.1,.12,mPlankD,x,1.42,gz))}
 g.add(tbox(2.75,.06,.55,mPlank,0,.33,gz-.18,0,1.5));const pr=gable(2.8,.5,.22,mShingle,1.45,.06);pr.position.z=gz-.12;g.add(pr);
 g.add(tbox(.14,1.6,.14,matLog2,1.7,.8,1.25));g.add(tbox(.34,.34,.05,mPlankD,1.7,1.5,1.33))}
function e2Ptasznik(g){plankHut(g,1.2,1.0,.85,{win:true,lamp:true});
 for(const[x,z]of[[.75,.4],[-.75,.45]]){const r=new THREE.Group();r.position.set(x,0,z);r.add(tbox(.05,.8,.05,matDark,-.25,.4,0),tbox(.05,.8,.05,matDark,.25,.4,0),cyl(.02,.6,matDark,0,.75,0,0,0,Math.PI/2,4));for(let k=0;k<4;k++){const f=new THREE.Mesh(new THREE.PlaneGeometry(.06,.18),M(0xf0ece4,{side:THREE.DoubleSide}));f.position.set(-.2+k*.13,.62,0);r.add(f)}g.add(r)}
 for(let k=0;k<3;k++){g.add(cyl(.15,.14,mWattle,-.45+k*.32,.07,.8,0,0,0,9));for(let q=0;q<4;q++)g.add(mesh(new THREE.SphereGeometry(.045,6,4),M(q%2?0xe8e2d0:0xc8c0a8),-.45+k*.32+(q%2-.5)*.08,.15,.8+(q>1?.05:-.05)))}
 g.add(cyl(.03,2.2,matWood,.95,1.1,-.5,.15,0,.2,4));const rope=cyl(.012,1.6,M(0xcfc6b0),-.95,.8,-.4,0,0,.1,3);g.add(rope)}
{const _nm2=newModel;newModel=function(kind,g){if(kind==='lawa'){e2Lawa(g);return 1}if(kind==='plac'){e2Plac(g);return 1}if(kind==='dwor'){e2Dwor(g);return 1}if(kind==='ptasznik'){e2Ptasznik(g);return 1}return _nm2(kind,g)}}
window.__e21={e2HorWhy,e2ObozWhy,CUSTOMS,e2Roz2,e2Hor,e2Oboz,e2Woz,e2Isl,e2Second,e2IslVis,islG,ISL,E2C,ROZ2,e2Daily21};
{const _fs2=freshState;freshState=function(){const st=_fs2();st.res.jaja=0;st.res.pierze=0;return st}}
