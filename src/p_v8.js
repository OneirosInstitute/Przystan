
/* ================= v8: woda, pożary, rozbudowa, rada, niezgoda, prośby, dymki ================= */
const law=id=>!!(S&&S.laws&&S.laws[id]);
const isWorker=p=>p.age>=12||(law('pomoc')&&p.age>=10);
const wellCount=()=>S.bld.filter(b=>b.kind==='studnia'&&bDone(b)).length;
const waterCap=()=>18+14*wellCount()+8*S.bld.filter(b=>bDone(b)&&hasExt(b,'zuraw')).length;
function waterNeedOn(){return seasonIdx()===0||S.weather.k==='drought'}

/* ---- rozbudowa domów w miejscu ---- */
const UPG={szalas:'chata',chata:'dom'};
function upCost(from,to){const a=BD[to].cost,b=BD[from].cost,c={};Object.keys(a).forEach(k=>{const v=a[k]-Math.floor((b[k]||0)*.8);if(v>0)c[k]=v});return c}
function upFree(b,to){const d=BD[to];if(b.i+d.w>N||b.j+d.h>N)return false;for(let a=0;a<d.w;a++)for(let q=0;q<d.h;q++){const k=(b.j+q)*N+b.i+a;if(!land[k])return false;if(occ[k]>=0&&occ[k]!==b.id)return false}return true}
function upgradeB(id){const b=bById(id);if(!b||!bDone(b))return;const to=UPG[b.kind];if(!to)return;
 if(!bAvail(to)){toast('Jeszcze nie wiemy, jak to zbudować. Zobacz zakładkę Wiedza.');return}
 if(!upFree(b,to)){toast('Obok musi być wolne miejsce na większy dom.');return}
 const c=upCost(b.kind,to);if(!canAfford(c)){toast('Brakuje: '+Object.entries(c).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>RN[k].toLowerCase()+' '+Math.ceil(v-(S.res[k]||0))).join(', '));return}
 Object.entries(c).forEach(([k,v])=>S.res[k]-=v);
 const old=bMesh[b.id];if(old){bGroup.remove(old);if(old.userData.scaf)bGroup.remove(old.userData.scaf)}
 log('Rozbudowa: '+BD[b.kind].n.toLowerCase()+' staje się '+(to==='chata'?'chatą z bali':'domem z piecem')+'.');
 b.kind=to;b.prog=0;b.work=BD[to].work;b.workers=0;placeFootprint(to,b.i,b.j,b.id);
 const d=BD[to];nodes.forEach(n=>{if(n.type!=='fish'&&n.i>=b.i&&n.i<b.i+d.w&&n.j>=b.j&&n.j<b.j+d.h){n.gone=1;n.amt=0;S.nodeAmt[n.id]=0;nodeVis(n)}});
 addBuildingMesh(b);if(freeCount()===0)toast('Nikt nie buduje: wszyscy mają pracę.');renderSel();renderPanel()}
function removeBuilding(b,why){S.bld=S.bld.filter(x=>x!==b);const d=BD[b.kind];
 for(let a=0;a<d.w;a++)for(let q=0;q<d.h;q++){const k=(b.j+q)*N+b.i+a;if(occ[k]===b.id)occ[k]=-1}recomputeWalk();
 const m=bMesh[b.id];if(m){bGroup.remove(m);if(m.userData.scaf)bGroup.remove(m.userData.scaf);delete bMesh[b.id]}
 Object.values(S.fams).forEach(f=>{if(f.home===b.id)f.home=null});if(selB===b.id)select(null);fireFxRemove(b.id);assign();assignHomes()}

/* ---- pożary ---- */
const FLAM={szalas:1.4,chata:1,dom:.6,zbieracz:1,mysliwy:1,drwal:1.2,lesnik:1,kamien:.5,glinianka:.6,drewutnia:1.6,pracownia:1.4,mielerz:3,kuznia:2,warsztat:1.2,szwalnia:1.2,sklad:1.3,spizarnia:1,pomost:.6,ruda:.6,zagroda:.5,cmentarz:0,studnia:0,piec:.3,cegielnia:.4,pole:0};
function fireRoll(){if(S.day<6||S.bld.some(b=>b.fire))return;const s=seasonIdx();const sea=dM()*(law('straz')?.7:1)*[1.8,1,.5,.8][s]*(S.weather.k==='drought'?3:S.weather.k==='rain'||S.weather.k==='snow'?.25:1)*(law('straz')?.45:1)*(offHolder('straznik')?.7:1);
 for(const b of S.bld){if(!bDone(b))continue;const f=(FLAM[b.kind]||0)*(condOf(b)<.5?1.5:1);if(f&&Math.random()<.0022*K*f*sea){startFire(b);break}}}
function startFire(b){b.fire={s:1,hp:1};S.seen.fire1=1;log('Pożar! Pali się '+BD[b.kind].n.toLowerCase()+'. Ludzie biegną z wiadrami.'+(wellCount()?'':' Bez studni wodę trzeba nosić z daleka.'));toast('Pożar: '+BD[b.kind].n);sfx('bell');
 const c=bCenter(b);const ppl=S.people.filter(p=>p.age>=13&&p.job!=='wyp'&&p.state!=='away').sort((x,y)=>Math.hypot(x.x-c.x,x.z-c.z)-Math.hypot(y.x-c.x,y.z-c.z)).slice(0,law('straz')?6:4);
 ppl.forEach(p=>{release(p);if(p.workKind==='build'&&p.tgt&&p.tgt.workers)p.tgt.workers--;p.path=null;p.state='idle';p.wait=0;p.fireB=b.id});b.fire.crew=ppl.map(p=>p.id);fireFx(b)}
function fireStep(dt){for(const b of S.bld){if(!b.fire)continue;const f=b.fire;f.hp-=dt*.0055*(law('straz')?.6:1)*(offHolder('straznik')?.8:1)*(hasB('wieza')?.8:1);
  if(f.hp<.55&&seasonIdx()===0&&Math.random()<dt*.0015){const c=bCenter(b);const nb=S.bld.find(x=>x!==b&&!x.fire&&bDone(x)&&(FLAM[x.kind]||0)>0&&Math.hypot(bCenter(x).x-c.x,bCenter(x).z-c.z)<3.6);if(nb){startFire(nb);log('Ogień przeskakuje na '+BD[nb.kind].n.toLowerCase()+'.')}}
  if(f.s<=0||f.hp<=0)endFire(b)}}
function endFire(b){const f=b.fire;b.fire=null;fireFxRemove(b.id);S.people.forEach(p=>{if(p.fireB===b.id){p.fireB=null;if(p.state==='work'){p.state='idle';p.wait=.5}}});
 if(f.hp<=0){log('Ogień strawił '+BD[b.kind].n.toLowerCase()+'. Zostały zgliszcza.');toast('Spłonęło: '+BD[b.kind].n);S.dis=clamp((S.dis||0)+.06,0,1);S.hope=clamp(S.hope-.04,0,1);
  if(BD[b.kind].store){['drewno','deski','opal','skory','plotno'].forEach(k=>S.res[k]=(S.res[k]||0)*.75)}removeBuilding(b);return}
 if(f.hp<.8){b.prog=b.work*Math.max(.2,f.hp);const m=bMesh[b.id];if(m){bGroup.remove(m);if(m.userData.scaf)bGroup.remove(m.userData.scaf)}addBuildingMesh(b);log('Pożar ugaszony, ale '+BD[b.kind].n.toLowerCase()+' trzeba naprawić ('+Math.round((1-f.hp)*100)+'% zniszczeń).')}
 else log('Pożar ugaszony w porę. '+BD[b.kind].n+' ocalało.');S.dis=clamp((S.dis||0)+.02,0,1)}
const fireFxs={};
function fireFx(b){fireFxRemove(b.id);const c=bCenter(b);const g=new THREE.Group();g.position.set(c.x,Hy(c.x,c.z),c.z);const d=BD[b.kind];const fl=[];
 for(let k=0;k<11;k++){const big=k<5;const m=new THREE.Mesh(new THREE.ConeGeometry(big?.32+Math.random()*.15:.18+Math.random()*.1,big?1.2+Math.random()*.6:.7+Math.random()*.4,6),new THREE.MeshBasicMaterial({color:k%3===0?0xffd070:k%3===1?0xff8a30:0xff5a20,toneMapped:false,transparent:true,opacity:.92}));m.position.set((Math.random()-.5)*d.w*.8,(big?1.9:1.2)+Math.random()*.7,(Math.random()-.5)*d.h*.8);m.renderOrder=6;g.add(m);fl.push(m)}
 const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.8}));gl.scale.set(6,6,1);gl.position.y=2.2;g.add(gl);
 const sm=[];for(let k=0;k<8;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:0x3a3632,transparent:true,opacity:0,depthWrite:false}));s.userData.t=k/8;g.add(s);sm.push(s)}
 scene.add(g);fireFxs[b.id]={g,fl,gl,sm}}
function fireFxRemove(id){const f=fireFxs[id];if(f){scene.remove(f.g);delete fireFxs[id]}}
function fireFxTick(rdt){for(const id in fireFxs){const f=fireFxs[id],b=bById(+id);if(!b||!b.fire){fireFxRemove(id);continue}const k=.4+.6*Math.max(b.fire.s,.15);
  f.fl.forEach((m,i)=>{m.scale.set(k,k*(.8+.4*Math.sin(clock*10+i*1.7)),k)});f.gl.material.opacity=.5+.3*Math.sin(clock*7);
  f.sm.forEach(s=>{s.userData.t=(s.userData.t+rdt*.25)%1;const t=s.userData.t;s.position.set(Math.sin(t*5+s.id)*.4+t*1.5,2.6+t*5,Math.cos(t*4+s.id)*.4);const sc=.8+t*3;s.scale.set(sc,sc,1);s.material.opacity=(1-t)*.55*k})}}

/* ---- obyczaje osady: ustalenia, które rodzą się z wydarzeń ---- */
const CUSTOMS=[
 {k:'umowa',n:'Umowa z brzegu',trig:()=>true,why:'Pierwszej nocy na wyspie, przy ognisku na plaży.',
  t:'Pierwsza noc przy ognisku',x:()=>S.day<2?'Najkrótsza noc w roku. W domu palono by teraz kupalne ognie nad rzeką. Tu jest osiemnaście osób, mokre ubrania i płonący stos desek z wraku. Nikt tu nie rządzi. Zanim ktoś zaśnie, trzeba ustalić, jak będziemy żyć.':'Osada żyje już kilka dni bez żadnych ustaleń. Wieczorem przy ognisku ktoś mówi, że tak dalej nie można. Trzeba się umówić, jak będziemy żyć.',
  o:[{id:'u_wspolne',n:'Wszystko wspólne',d:'Jedzenie i narzędzia należą do wszystkich. Więcej nadziei, mniej sporów, praca idzie trochę wolniej.',r:'Postanowiono: nikt nic nie ma na własność. Co wyniesione z wraku, należy do wszystkich.'},
   {id:'u_swoje',n:'Każdy na swoim',d:'Kto więcej pracuje, ten więcej ma. Praca idzie szybciej, ale łatwiej o kłótnie.',r:'Postanowiono: każdy odpowiada za siebie i swoją rodzinę. Kto pracuje, ten je.'},
   {id:'u_starsi',n:'Słuchamy starszych',d:'Decydują najstarsi. Spory szybko gasną, ale młodzi z czasem zaczną się buntować.',r:'Postanowiono: ostatnie słowo należy do najstarszych. Lubomir i Wszebora kiwają głowami.'}]},
 {k:'glod',n:'Podział jedzenia',trig:()=>S.hungerDays>=1,why:'Gdy pierwszy raz zabrakło jedzenia dla wszystkich.',
  t:'Pusta spiżarnia',x:()=>'Wieczorem garnek jest pusty, zanim wszyscy dostaną swoją porcję. Ktoś musi zdecydować, kto je pierwszy, gdy jedzenia jest za mało.',
  o:[{id:'g_rowno',n:'Po równo dla wszystkich',d:'Każdy dostaje tyle samo. Głód mniej skłóca ludzi.',r:'Każdy dostaje tyle samo, nawet jeśli to tylko kilka łyżek.'},
   {id:'g_praca',n:'Więcej dla pracujących',d:'Pracujący słabną wolniej, dzieci i starsi szybciej.',r:'Kto dźwiga kłody i łowi ryby, dostaje więcej. Dzieci patrzą w milczeniu.'},
   {id:'g_dzieci',n:'Najpierw dzieci i starzy',d:'Dzieci i starsi są chronieni, dorośli słabną szybciej.',r:'Dorośli oddają część swoich porcji najmłodszym i najstarszym.'}]},
 {k:'smierc',n:'Pochówek',trig:()=>S.died>=1,why:'Po pierwszej śmierci na wyspie.',
  t:'Pierwszy grób',x:()=>'Ktoś z nas odszedł. Nikt nie wie, jak tu żegnać zmarłych. Trzeba zdecydować, co robimy z ciałem i z pamięcią.',
  o:[{id:'cmentarz',n:'Miejsce pamięci',d:'Zmarłych chowa się w ziemi, przy osadzie. Każda śmierć mniej rani osadę, ale trzeba postawić miejsce pamięci.',r:'Grób wykopano na wzgórzu za obozem. Z kamieni ułożono znak.'},
   {id:'morze',n:'Pochówek w morzu',d:'Zmarłych oddaje się morzu. Nie trzeba nic budować, ale każda śmierć zostawia większy żal.',r:'Ciało owinięte płótnem żaglowym popłynęło na łodzi, którą fale zabrały w mgłę.'}]},
 {k:'ogien',n:'Ogień',trig:()=>!!S.seen.fire1||S.bld.some(b=>b.fire),why:'Po pierwszym pożarze w osadzie.',
  t:'Po pożarze',x:()=>'Dym jeszcze unosi się nad zgliszczami. Wszyscy wiedzą, że to może się powtórzyć. Drewniane domy, strzecha i suche lato.',
  o:[{id:'straz',n:'Nocna straż',d:'Ktoś zawsze czuwa przy ogniu. Pożary wybuchają rzadziej i są szybciej gaszone, wilki rzadziej podchodzą do zagród.',r:'Od tej nocy ktoś zawsze czuwa. Na zmianę, po kolei.'},
   {id:'o_swoj',n:'Każdy pilnuje swojego ognia',d:'Nic się nie zmienia. Nikt nie traci snu.',r:'Ustalono, że każda rodzina pilnuje swojego paleniska. I tyle.'}]},
 {k:'dzieci',n:'Dzieci',trig:()=>S.people.some(p=>p.age>=10&&p.age<12),why:'Gdy pierwsze dziecko skończyło dziesięć lat.',
  t:'Dziecko chce pomagać',x:()=>{const c=S.people.find(p=>p.age>=10&&p.age<12);return(c?c.name:'Jedno z dzieci')+' kręci się przy dorosłych i chce nosić drewno jak oni. Czy dzieci mają pracować, czy się uczyć?'},
  o:[{id:'pomoc',n:'Dzieci pomagają',d:'Od 10 lat pracują jako pomocnicy, o połowę słabiej. Nadzieja spada.',r:'Dzieci od dziesięciu lat pomagają przy pracy. Rąk jest więcej.'},
   {id:'nauka',n:'Dzieci się uczą',d:'Uczą się fachu półtora raza szybciej. Rośnie nadzieja.',r:'Dzieci mają się uczyć. Na pracę przyjdzie jeszcze czas.'}]},
 {k:'chorzy',n:'Chorzy i ranni',trig:()=>S.people.some(p=>p.hp<.5),why:'Gdy ktoś pierwszy raz ciężko zachorował albo został ranny.',
  t:'Ranny przy ognisku',x:()=>{const p=S.people.find(q=>q.hp<.5);return(p?p.name:'Ktoś')+' leży przy ognisku i ledwo wstaje. Pracy jest dużo, rąk mało.'},
  o:[{id:'odpoczynek',n:'Chorzy odpoczywają',d:'Nie pracują, ale zdrowieją dwa razy szybciej.',r:'Chorzy leżą, dopóki nie wyzdrowieją. Inni przejmują ich pracę.'},
   {id:'kazdy',n:'Każdy pracuje',d:'Ranni pracują dalej, wolniej zdrowieją, rośnie niezgoda.',r:'Kto może stać, ten pracuje. Wyspa nie poczeka.'}]},
 {k:'spory',n:'Spory',trig:()=>(S.dis||0)>.35,why:'Po pierwszej poważnej kłótni w osadzie.',
  t:'Kłótnia',x:()=>{const a=S.people.filter(isAdult);const x=a[0],y=a[a.length-1];return`${x?x.name:'Ktoś'} i ${y?y.name:'ktoś inny'} krzyczą na siebie przy całej osadzie. Poszło o drewno, a naprawdę o wszystko. Kto ma rozstrzygać takie spory?`},
  o:[{id:'sad',n:'Sąd starszych',d:'Spory rozstrzygają najstarsi. Niezgoda wyraźnie spada.',r:'Spór rozstrzygną najstarsi. Ich słowo jest ostatnie.'},
   {id:'s_wiec',n:'Rozstrzyga wiec',d:'Decyduje cała osada. Niezgoda spada wolniej, ale zmiany na wiecu przychodzą łatwiej.',r:'Spory będzie rozstrzygać cała osada, na wiecu, przy ognisku.'}]},
 {k:'lup',n:'Zdobycz z wypraw',trig:()=>!!S.seen.zbior1,why:'Po powrocie pierwszej wyprawy z łupem.',
  t:'Czyje to?',x:()=>'Wyprawa wróciła objuczona. Ci, którzy szli, mówią, że ryzykowali życiem. Ci, którzy zostali, mówią, że pilnowali ich dzieci.',
  o:[{id:'l_wspolny',n:'Wszystko do wspólnego zapasu',d:'Nikt nie zazdrości, nic się nie zmienia.',r:'Wszystko trafia do wspólnego zapasu. Wyprawa dostaje podziękowanie.'},
   {id:'lup',n:'Część dla tych, co szli',d:'Wyprawy przynoszą o 25% więcej, ale reszta osady trochę szemrze.',r:'Kto idzie na wyprawę, zatrzymuje część zdobyczy.'}]},
 {k:'zniwa',n:'Jesień',trig:()=>S.day>12&&Math.floor(rday()/SD)===1,why:'Na pierwszą jesień na wyspie.',
  t:'Pierwsza jesień',x:()=>'Liście żółkną, jagody się kończą. Ktoś proponuje, żeby uczcić to, że przeżyliśmy lato. Ktoś inny, że trzeba oszczędzać na zimę.',
  o:[{id:'swieto',n:'Dożynki co roku',d:'Na początku jesieni wieniec z ostatniego snopa i uczta: zapas na dwa dni, ale dużo nadziei i mniej sporów.',r:'Każdej jesieni będą dożynki: wieniec, uczta, wszyscy przy jednym ogniu.'},
   {id:'zapasy',n:'Zapasy ważniejsze niż uczta',d:'Żywność psuje się o 20% wolniej. Bez świąt.',r:'Żadnych uczt. Jedzenie suszy się i odkłada na zimę.'}]},
 {k:'zima',n:'Zimowe wieczory',trig:()=>S.day>12&&Math.floor(rday()/SD)===2,why:'Na pierwszą zimę na wyspie.',
  t:'Długie noce',x:()=>'Noce są coraz dłuższe. Ludzie siedzą w ciemnych domach i milczą. Można palić wspólne ognisko, ale opału jest mało.',
  o:[{id:'opowiesci',n:'Wieczory przy ognisku',d:'Starsi opowiadają o dawnym świecie. Nadzieja i nauka rosną, niezgoda spada. Ognisko pali opał.',r:'Co wieczór wszyscy siadają przy ognisku. Lubomir opowiada o dawnej wsi, o rzece i o kupalnych ogniach.'},
   {id:'z_oszcz',n:'Każdy w swoim domu',d:'Domy palą o 15% mniej opału, ale nadzieja spada.',r:'Opału jest za mało na wspólne ognisko. Każdy siedzi u siebie.'}]},
 {k:'wiara',n:'Dawne obyczaje',trig:()=>S.day>=6||S.bld.some(b=>b.kind==='chata'&&bDone(b)),why:'Gdy ktoś pierwszy raz postawił miskę dla domowika.',
  t:'Miska dla domowika',x:()=>{const w=S.people.filter(p=>isAdult(p)&&p.sex==='k').sort((a,b)=>b.age-a.age)[0];return(w?w.name:'Ktoś')+' stawia wieczorem przy palenisku miskę z resztką kaszy. „Dla domowika, żeby z nami został.” Jedni kiwają głowami, inni się krzywią. Czy na wyspie trzymamy się dawnych obrzędów?'},
  o:[{id:'obrzedy',n:'Trzymamy się dawnych obrzędów',d:'Kupała, Dziady, Szczodre Gody, Marzanna i postrzyżyny dzieci w rytmie roku. Dają nadzieję i zgodę, kosztują trochę jedzenia i opału. Wierzenia mocniej działają na ludzi.',r:'Będziemy żyć jak w domu: z ogniem na Kupałę, z jadłem dla dziadów, z wieczerzą w Szczodre Gody.'},
   {id:'skromnie',n:'Nie czas na obrzędy',d:'Każdy wierzy po swojemu. Święta tylko się wspomina: nic nie kosztują, ale dają mniej, a niezgoda rośnie odrobinę szybciej.',r:'Na obrzędy przyjdzie czas, gdy będzie co jeść. Kto chce, niech wierzy po cichu.'}]}];
const CUST_BY={};CUSTOMS.forEach(c=>CUST_BY[c.k]=c);
function custRebuild(){S.laws={};Object.values(S.cust).forEach(id=>{if(id)S.laws[id]=1})}
function custInit(){if(!S.cust){S.cust={};const old=S.laws||{};CUSTOMS.forEach(c=>{const o=c.o.find(x=>old[x.id]);if(o)S.cust[c.k]=o.id})}
 S.custQ=S.custQ||[];S.custLog=S.custLog||{};S.offices=S.offices||{};custRebuild()}
function custDay(){const d=Math.floor(S.day)+1,y=Math.floor(S.day/YEAR)+1;return`doba ${d}, rok ${y}`}
function custTick(){if(!S||!S.cust)return;CUSTOMS.forEach(c=>{if(!S.cust[c.k]&&!S.custQ.includes(c.k)&&c.trig())S.custQ.push(c.k)});
 if(!S.custQ.length||evOpen||placing||!S.people.length)return;if(S.custQ[0]!=='umowa'&&!isWork())return;
 const c=CUST_BY[S.custQ.shift()];if(!c||S.cust[c.k])return;
 openEvent({ey:'Ustalenie',t:c.t,text:c.x,opts:c.o.map(o=>({n:o.n,d:o.d,f:()=>{S.cust[c.k]=o.id;custRebuild();S.custLog[c.k]={d:custDay(),why:c.why,hist:[]};
  if(o.id==='pomoc'){S.hope=clamp(S.hope-.04,0,1)}if(o.id==='nauka'){S.hope=clamp(S.hope+.02,0,1)}assign();return o.r+' Od teraz to obyczaj osady.'}}))},{})}
// wiec: raz na porę roku można zmienić jeden obyczaj
const seasonKey=()=>Math.floor(S.day/SD);
function founders(){return S.people.filter(p=>!p.born).length}
function youngVoice(){return founders()<9&&S.people.filter(p=>p.born&&isAdult(p)).length>=2}
function wiecOpen(){return S.day>3&&S.wiecUsed!==seasonKey()}
function changeCost(){const st=offHolder('starszy');return .04*(law('s_wiec')?.5:1)*(hasB('domwsp')?.5:1)*(hasB('gaj')?.7:1)*(st?(st.trait==='Pogodny'?.6:st.trait==='Uparty'?1.5:1):1)}
function custChange(k,id){const c=CUST_BY[k];if(!c||!S.cust[k]||S.cust[k]===id)return;if(!wiecOpen()){toast('Obyczaj można zmienić tylko na wiecu, raz na porę roku.');return}
 if(k==='umowa'&&!youngVoice()){toast('Umowy z brzegu nikt nie odważy się zmienić, dopóki żyje większość rozbitków.');return}
 const from=c.o.find(o=>o.id===S.cust[k]),to=c.o.find(o=>o.id===id);S.cust[k]=id;custRebuild();S.wiecUsed=seasonKey();S.dis=clamp((S.dis||0)+changeCost(),0,1);
 (S.custLog[k]=S.custLog[k]||{d:custDay(),why:c.why,hist:[]}).hist.push(`${custDay()}: wiec zmienił „${from.n}” na „${to.n}”`+(k==='umowa'?' głosami młodych':''));
 log('Wiec przy ognisku: „'+from.n+'” zastąpiono obyczajem „'+to.n+'”. '+to.r);toast('Wiec: '+to.n);assign();renderPanel()}
function custDaily(){custInit();
 if(law('opowiesci')&&!hasB('domwsp'))S.res.opal=Math.max(0,S.res.opal-.6*K);
 const d=Math.floor(rday());if(d%SD===0&&S.day>3){log('Nowa pora roku. Wieczorem zbiera się wiec: można zmienić jeden obyczaj osady.');toast('Wiec przy ognisku');}
 if(youngVoice()&&!S.seen.young){S.seen.young=1;log('Na wiecu odzywają się młodzi urodzeni na wyspie: „To były wasze zasady, nie nasze.” Od teraz można zmienić nawet umowę z brzegu.');toast('Głos młodych')}
 if(law('swieto')&&d===SD&&!S.seen['swieto'+Math.floor(S.day/YEAR)]){S.seen['swieto'+Math.floor(S.day/YEAR)]=1;const need=K*S.people.length*2;const tot=foodTotal();if(tot>need*4){FOOD.forEach(k=>S.res[k]-=need*(S.res[k]/tot));S.hope=clamp(S.hope+.1,0,1);S.dis=clamp(S.dis-.15,0,1);log('Dożynki. Dziewczęta niosą wieniec z ostatniego snopa, cała osada ucztuje do późnej nocy. Ktoś gra na fujarce.');toast('Dożynki');pamAdd(2,'obrzed');if(typeof fujarka==='function')fujarka()}else log('Na dożynki nie starczy jedzenia. Wieniec wisi nad pustym stołem.')}}
const lawDaily=custDaily;
function hungerMul(p){if(law('g_praca'))return isWorker(p)?.6:1.5;if(law('g_dzieci'))return(p.age<12||p.age>55)?.4:1.3;return 1}
// starszy osady
function offHolder(id){const pid=S&&S.offices&&S.offices[id];if(pid===undefined||pid===null)return null;const p=pById(pid);if(!p||!isAdult(p)){S.offices[id]=null;return null}return p.state==='away'?null:p}
function offLv(id){if(id!=='starszy')return 0;const p=offHolder(id);return p?2+(p.trait==='Nauczyciel'||p.trait==='Pogodny'?2:0):0}
function setOffice(id,pid){S.offices=S.offices||{};if(S.offices[id]!==undefined&&S.offices[id]!==null&&!wiecOpen()){toast('Starszego wybiera wiec, raz na porę roku.');renderPanel();return}
 S.offices[id]=pid===''?null:+pid;const p=pById(+pid);if(p){log('Wiec wybiera starszego osady: '+p.name+'.');if(S.day>3)S.wiecUsedSt=seasonKey()}renderPanel()}
function custHTML(){custInit();let h='<h3>Obyczaje osady</h3>';
 const w=wiecOpen();const next=SD-Math.floor(rday())%SD;
 h+=`<p class="lead">Na wyspie nikt nie rządzi. Ustalenia rodzą się z tego, co się wydarza, i z czasem stają się obyczajem. ${w?'<b style="color:var(--hi)">Wiec trwa:</b> do końca tej pory roku można zmienić jeden obyczaj.':(S.wiecUsed===seasonKey()?'Wiec w tej porze roku już zdecydował. ':'')+'Następny wiec za '+next+' d., na początku nowej pory roku.'}</p>`;
 h+=officesHTML();
 const set=CUSTOMS.filter(c=>S.cust[c.k]);
 set.forEach(c=>{const cur=c.o.find(o=>o.id===S.cust[c.k]);const lg=S.custLog[c.k];const canU=c.k!=='umowa'||youngVoice();
  h+=`<div class="card law on"><div class="eyebrow">${c.n}</div><h4>${cur.n}</h4><p>${cur.d}</p>${lg?`<p class="mut">Od kiedy: ${lg.why.toLowerCase()} (${lg.d}).${(lg.hist||[]).length?'<br>'+lg.hist.join('<br>'):''}</p>`:''}`+
  (w&&canU?c.o.filter(o=>o.id!==cur.id).map(o=>`<button data-cust="${c.k}" data-co="${o.id}" style="margin:4px 6px 0 0">Zmień na: ${o.n}</button>`).join(''):c.k==='umowa'&&!canU?'<p class="mut">Umowy z brzegu nie zmienia się, dopóki żyje większość rozbitków.</p>':'')+'</div>'});
 const left=CUSTOMS.length-set.length;if(left)h+=`<p class="lead">Jeszcze ${left} ${left===1?'sprawa czeka':left<5?'sprawy czekają':'spraw czeka'} na ustalenie. Wyspa sama je przyniesie.</p>`;
 return h}

/* ---- niezgoda ---- */
function disDaily(){let d=0;if(S.hungerDays>0)d+=.03;if(S.warm<.75)d+=.025*(1-S.warm);if(law('oszczedne'))d+=.01;if(law('dlugi'))d+=.008;if(law('pomoc'))d+=.004;
 if(law('kazdy')&&S.people.some(p=>p.hp<.5&&isWorker(p)))d+=.006;if(S.thirst>0)d+=.02*S.thirst;if(law('opowiesci'))d-=.012;if(hasB('domwsp'))d-=.006;if(law('sad'))d-=.01;if(law('s_wiec'))d-=.004;if(law('lup'))d+=.002;if(law('u_wspolne'))d-=.004;if(law('u_swoje'))d+=.005;if(law('u_starsi'))d+=S.people.filter(p=>p.born&&isAdult(p)).length>=3?.008:-.006;if(S.hungerDays>0&&law('g_rowno'))d-=.012;d-=.002*offLv('starszy');d+=slavDis()+ludDis();if(law('wspolne'))d-=.008;d-=.01*(S.hope-.5);
 S.dis=clamp((S.dis||0)+K*d+(.08-(S.dis||0))*.03*K,0,1);
 if(S.dis>.8&&Math.random()<.25*K){const a=S.people.filter(isAdult);if(a.length>1){const x=a[(Math.random()*a.length)|0],y=a[(Math.random()*a.length)|0];if(x!==y)log(['Kłótnia przy ognisku: '+x.name+' i '+y.name+' oskarżają się o lenistwo.',x.name+' mówi głośno, że rada prowadzi wszystkich na zgubę.','Ktoś podzielił zapasy po swojemu. Nikt się nie przyznaje.'][(Math.random()*3)|0])}}
 if(S.dis>=.97){const fams=Object.values(S.fams).map(f=>famMembers(f.id)).filter(m=>m.length&&m.length<=4&&!m.some(p=>p.id===selId));if(fams.length){const m=fams.sort((a,b)=>avgZad(a)-avgZad(b))[0];foundHamlet(m,'spor');S.dis=.6}}}
function leavePerson(p){S.people=S.people.filter(q=>q!==p);release(p);if(p.pair!==null){const q=pById(p.pair);if(q&&q.fam!==p.fam)q.pair=null}removePersonMesh(p.id);if(selId===p.id)select(null);
 const f=S.fams[p.fam];if(f&&!famMembers(f.id).length){f.home=null;delete S.fams[f.id]}S.left=(S.left||0)+1;assign()}

/* ---- woda ---- */
function waterDaily(){const pop=S.people.length;if(!pop)return;const cap=waterCap();S.thirst=waterNeedOn()?Math.max(0,pop-cap)/pop:0;
 if(S.thirst>0){const n=Math.ceil(S.thirst*pop*.5);for(let k=0;k<n;k++){const p=S.people[(Math.random()*pop)|0];p.hp=Math.max(.15,p.hp-.06*K)}
  if(!S.seen['woda'+Math.floor(S.day/YEAR)]){S.seen['woda'+Math.floor(S.day/YEAR)]=1;log('Upał. Woda w strumieniu jest mętna, kilka osób ma biegunkę. Osada potrzebuje studni.');toast('Brakuje czystej wody')}}}

/* ---- prośby mieszkańców ---- */
const pickAdult=f=>{const a=S.people.filter(p=>isAdult(p)&&p.job!=='wyp'&&!S.reqs.some(r=>r.pid===p.id)&&(!f||f(p)));return a.length?a[(Math.random()*a.length)|0]:null};
const REQS={
 dach:{w:3,make:()=>{const p=pickAdult(p=>!homeOf(p));return p?{pid:p.id}:null},t:(r,p)=>`${p.name} prosi o własny dach nad głową`,d:'Rodzina śpi pod gołym niebem. Postaw szałas albo chatę.',done:(r,p)=>!!(homeOf(p)&&bDone(homeOf(p)))},
 fach:{w:2,make:()=>{const masters=Object.keys(CN).filter(c=>S.people.some(q=>isAdult(q)&&q.sk[c]>=3));const p=pickAdult(p=>p.age<22&&Math.max(...Object.values(p.sk))<2);if(!p||!masters.length)return null;return{pid:p.id,c:masters[(Math.random()*masters.length)|0]}},
  t:(r,p)=>`${p.name} chce się uczyć fachu: ${CN[r.c]}`,d:'Przydziel tę osobę do budynku, w którym pracuje mistrz tego fachu.',done:(r,p)=>p.sk[r.c]>=2},
 slodkie:{w:1,make:()=>S.people.some(isChild)&&(tech('u_bart')||S.res.miod>0)?{pid:(pickAdult(p=>famMembers(p.fam).some(isChild))||{}).id}:null,t:()=>'Dzieci proszą o coś słodkiego',d:'Zgromadź 4 porcje miodu.',done:()=>S.res.miod>=4,take:()=>{S.res.miod-=4}},
 pamiec:{w:3,make:()=>S.died>0&&!hasB('cmentarz')?{pid:(S.people.filter(isAdult).sort((a,b)=>b.age-a.age)[0]||{}).id}:null,t:(r,p)=>`${p.name} prosi o miejsce pamięci dla zmarłych`,d:'Postaw miejsce pamięci (zakładka Budowa).',done:()=>hasB('cmentarz')},
 ubrania:{w:2,make:()=>seasonIdx()===1&&S.res.odziez<8?{pid:(pickAdult(p=>famMembers(p.fam).some(isChild))||{}).id}:null,t:()=>'Matki proszą o ciepłe ubrania na zimę',d:'Zgromadź 8 sztuk odzieży (szwalnia szyje ją ze skór).',done:()=>S.res.odziez>=8},
 studnia:{w:3,make:()=>(seasonIdx()===0||seasonIdx()===3)&&!hasB('studnia')?{pid:(pickAdult()||{}).id}:null,t:(r,p)=>`${p.name} mówi, że woda w strumieniu jest mętna`,d:'Postaw studnię, zanim przyjdzie upał.',done:()=>hasB('studnia')},
 gory:{w:1,make:()=>REGIONS.some(r=>r&&r.type==='high'&&!r.known)?{pid:(pickAdult(p=>p.age<40)||{}).id}:null,t:(r,p)=>`${p.name} chce zobaczyć, co jest za górami`,d:'Wyślij zwiad w hale albo skały.',done:()=>REGIONS.some(r=>r&&r.type==='high'&&r.known)},
 ziola:{w:1,make:()=>tech('u_rozp')&&S.res.ziola<8?{pid:(pickAdult(p=>p.age>35)||{}).id}:null,t:(r,p)=>`${p.name} prosi o zapas ziół na zimę`,d:'Zgromadź 8 porcji ziół.',done:()=>S.res.ziola>=8},
 pomost:{w:2,make:()=>!hasB('pomost')&&S.day>4?{pid:(pickAdult(p=>p.sk.rybak>=1)||pickAdult()||{}).id}:null,t:(r,p)=>`${p.name} chce łowić ryby z pomostu`,d:'Postaw pomost rybacki na brzegu.',done:()=>hasB('pomost')},
 cieply:{w:2,make:()=>{const f=Object.values(S.fams).find(f=>{const h=f.home&&bById(f.home);return h&&h.kind==='szalas'&&bDone(h)});if(!f||seasonIdx()===2)return null;const p=famMembers(f.id).find(isAdult);return p&&!S.reqs.some(r=>r.pid===p.id)?{pid:p.id}:null},
  t:(r,p)=>`${p.name} prosi o cieplejszy dom przed zimą`,d:'Rozbuduj ich szałas w chatę z bali (zaznacz dom i wybierz „Rozbuduj”).',done:(r,p)=>{const h=homeOf(p);return !!(h&&h.kind!=='szalas'&&bDone(h))}}};
function reqTick(){S.reqs=S.reqs||[];
 for(const r of [...S.reqs]){const p=pById(r.pid);const R=REQS[r.k];if(!p||!R){S.reqs=S.reqs.filter(x=>x!==r);continue}
  if(R.done(r,p)){if(R.take)R.take(r);S.reqs=S.reqs.filter(x=>x!==r);S.hope=clamp(S.hope+.04,0,1);S.dis=clamp((S.dis||0)-.07,0,1);if(r.k==='fach')p.xp[r.c]+=40;S.reqDone=(S.reqDone||0)+1;log('Prośba spełniona. '+R.t(r,p)+'. '+p.name+' dziękuje.');toast('Prośba spełniona');continue}
  if(S.day>r.until){S.reqs=S.reqs.filter(x=>x!==r);S.dis=clamp((S.dis||0)+.04,0,1);log('Prośba bez odpowiedzi. '+R.t(r,p)+'.')}}
 if(S.reqs.length<3&&S.day>=(S.reqNext||3)){const keys=Object.keys(REQS).filter(k=>!S.reqs.some(r=>r.k===k));const pool=[];keys.forEach(k=>{for(let q=0;q<REQS[k].w;q++)pool.push(k)});
  for(let t=0;t<8&&pool.length;t++){const k=pool[(Math.random()*pool.length)|0];const x=REQS[k].make();if(x&&x.pid!==undefined&&pById(x.pid)){const r=Object.assign({k,made:Math.floor(S.day),until:Math.floor(S.day)+12},x);S.reqs.push(r);const p=pById(r.pid);log('Prośba: '+REQS[k].t(r,p)+'. '+REQS[k].d);toast('Nowa prośba: '+p.name);break}}
  S.reqNext=S.day+3+Math.random()*4}}
function reqHTML(){S.reqs=S.reqs||[];let h='<h3>Prośby mieszkańców</h3>';
 if(!S.reqs.length)return h+'<p class="lead">Nikt teraz o nic nie prosi.</p>';
 S.reqs.forEach(r=>{const p=pById(r.pid);if(!p)return;const R=REQS[r.k];h+=`<div class="card req"><h4>${R.t(r,p)}</h4><p>${R.d}</p><p class="mut">Zostało ${Math.max(0,Math.ceil(r.until-S.day))} dni · spełnienie: nadzieja w górę, niezgoda w dół</p></div>`});return h}

/* ---- dymki potrzeb nad głowami ---- */
const bubTex={};
function bubbleTex(key,col){const id=key+col;if(bubTex[id])return bubTex[id];const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');
 x.fillStyle='rgba(244,236,216,.96)';x.strokeStyle=col;x.lineWidth=6;x.beginPath();x.arc(48,44,34,0,6.283);x.fill();x.stroke();x.beginPath();x.moveTo(40,76);x.lineTo(48,92);x.lineTo(56,76);x.fill();
 x.save();x.translate(48-24*1.15,44-24*1.15);x.scale(1.15,1.15);x.strokeStyle=col;x.lineWidth=2.8;x.lineCap='round';x.lineJoin='round';
 if(key==='!'){x.restore();x.fillStyle='#8a5a1a';x.font='bold 50px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('!',48,46)}
 else{const svg=IC[key]||'';(svg.match(/d="([^"]+)"/g)||[]).forEach(m=>{x.stroke(new Path2D(m.slice(3,-1)))});(svg.match(/<circle[^>]*>/g)||[]).forEach(m=>{const g=a=>+(m.match(new RegExp(a+'="([\\d.]+)"'))||[0,0])[1];x.beginPath();x.arc(g('cx'),g('cy'),g('r'),0,6.283);x.stroke()});x.restore()}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;bubTex[id]=new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true});return bubTex[id]}
function needOf(p){if(p.state==='away')return null;if(p.fireB)return['fire','#d0501c'];if(p.hp<.45)return['zdrowie','#b8342a'];if(S.fedR<.95&&S.hungerDays>0&&p.id%3===1)return['zywnosc','#a8641a'];
 if(p.warm!==undefined&&p.warm<.6)return['cieplo','#2a6aa8'];if(S.thirst>0&&p.id%3===0)return['woda','#2a74a8'];if(S.reqs&&S.reqs.some(r=>r.pid===p.id))return['!','#c9a66b'];if((S.dis||0)>.72&&p.id%4===0&&isAdult(p))return['niezgoda','#a8342a'];return null}
let bubT=0;
function bubbleTick(rdt){bubT+=rdt;for(const p of S.people){const m=pMesh[p.id];if(!m)continue;let s=m.userData.bub;const n=needOf(p);
  if(!n){if(s)s.visible=false;continue}if(!s){s=new THREE.Sprite(bubbleTex(n[0],n[1]));s.renderOrder=20;m.add(s);m.userData.bub=s}
  s.material=bubbleTex(n[0],n[1]);s.visible=m.visible;const k=1/m.scale.x;s.scale.set(.6*k*1.55,.6*k*1.55,1);s.position.y=(2.15+Math.sin(bubT*3+p.id)*.06)*k}}
