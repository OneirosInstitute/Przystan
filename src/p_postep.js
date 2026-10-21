
/* ================= 4.7.0 Drzewo postępu w każdej epoce i nowe rozbudowy ================= */
// Każda epoka dokłada w każdej dziedzinie trzy umiejętności. Doświadczenie dalej bierze się z pracy ludzi (techXp),
// więc nowe węzły pojawiają się dopiero wtedy, gdy osada dojdzie do epoki. Część z nich otwiera rozbudowy budynków.
// Epoka IV ma własne nauki rodów (p_e4_nauki.js), bo tam gospodarka liczy się inaczej.
const EP2=()=>epNow()>=2,EP3=()=>epNow()>=3;
[
 // ---------- EPOKA II · WIEŚ ----------
 {id:'u_radlo',d:'uprawa',ep:2,r:4,c:0,n:'Radło z lemieszem',xp:450,req:['u_selek'],desc:'Żelazny lemiesz kraje darń, której drewniane radło nie ruszy.',eff:'Zboże rośnie o 15% szybciej. Przy polu: rozbudowa „Brona”.'},
 {id:'u_inspekt',d:'uprawa',ep:2,r:4,c:2,n:'Rozsada i inspekty',xp:450,req:['u_len'],desc:'Rozsada w skrzynkach przy piecu, potem na grządki pod matami.',eff:'Ogrody przy domach dają o połowę więcej warzyw. Przy domu: rozbudowa „Inspekt” (warzywa także zimą).'},
 {id:'u_trojpol',d:'uprawa',ep:2,r:5,c:1,n:'Trójpolówka z obornikiem',xp:650,req:['u_radlo','u_nawoz'],desc:'Ozime, jare i ugór, a na ugór obornik z zagród.',eff:'Pola dają o 15% więcej, a gleba męczy się o 40% mniej.'},
 {id:'h_lodzie',d:'hodowla',ep:2,r:4,c:0,n:'Łodzie klepkowe',xp:450,req:['h_sieci'],desc:'Burty z klepek na zakładkę, uszczelnione mchem i smołą.',eff:'Rybacy łowią o 20% więcej. Przy pomoście: rozbudowa „Suszarnia sieci”.'},
 {id:'h_siano',d:'hodowla',ep:2,r:4,c:2,n:'Siano na zimę',xp:450,req:['h_rozr'],desc:'Łąki kosi się dwa razy w roku, a stogi stoją na palach.',eff:'Zimą kozy dają więcej mleka także bez obory. Przy zagrodzie: rozbudowa „Kojec” (4 kozy więcej).'},
 {id:'h_ser',d:'hodowla',ep:2,r:5,c:1,n:'Ser podpuszczkowy',xp:650,req:['h_siano','h_doj'],desc:'Podpuszczka z żołądka koźlęcia ścina mleko w twardy ser.',eff:'Serownia i komora kiszonek pracują o 30% szybciej, mleko w osadzie psuje się o ćwierć wolniej.'},
 {id:'r_czeladz',d:'rzemioslo',ep:2,r:4,c:0,n:'Czeladnicy',xp:450,req:['r_stal'],desc:'Mistrz ma przy sobie dwóch czeladników, a warsztat rośnie razem z nimi.',eff:'Budynki z pracownikami mają jedno miejsce na rozbudowę więcej.'},
 {id:'r_kolo',d:'rzemioslo',ep:2,r:4,c:2,n:'Koło garncarskie',xp:450,req:['r_garn'],desc:'Koło kręcone stopą: naczynie rośnie w rękach w kilka chwil.',eff:'Garncarnia, piec do cegły, glinianki i gliniaki pracują o 25% szybciej. Przy garncarni: rozbudowa „Półki do suszenia”.'},
 {id:'r_gont',d:'rzemioslo',ep:2,r:5,c:1,n:'Gont i więźba',xp:650,req:['r_czeladz','r_zrab'],desc:'Dach z łupanego gontu na krokwiach, które nie siadają.',eff:'Budynki zużywają się o 30% wolniej. Przy składzie: rozbudowa „Strych” (200 więcej).'},
 {id:'n_rach',d:'nauka',ep:2,r:4,c:0,n:'Rachunek na karbach',xp:450,req:['n_pamiec'],desc:'Karby na kijach liczą zboże, długi i dni pracy.',eff:'Każda dziedzina zbiera o 10% więcej doświadczenia.'},
 {id:'n_leki',d:'nauka',ep:2,r:4,c:2,n:'Lecznictwo',xp:450,req:['n_opat'],desc:'Napary, okłady i spokój. Zielarka wie, kogo położyć, a kogo wysłać do pracy.',eff:'Zimowe choroby są o 30% łagodniejsze, a chata zielarki leczy o połowę szybciej. Przy niej: rozbudowa „Suszarnia ziół”.'},
 {id:'n_miern',d:'nauka',ep:2,r:5,c:1,n:'Miernictwo',xp:650,req:['n_rach'],desc:'Sznur z węzłami co sążeń i tyczki z kory pokazują, którędy poprowadzić drogę.',eff:'Drogi do przysiółków kosztują o 30% mniej i powstają o ćwierć szybciej.'},
 // ---------- EPOKA III · CAŁA WYSPA ----------
 {id:'u_mlyn',d:'uprawa',ep:3,r:6,c:0,n:'Młynarstwo',xp:750,req:['u_trojpol'],desc:'Kamień biegun na kamieniu leżaku, a mąka coraz drobniejsza.',eff:'Żarna, wiatrak i piekarnie pracują o 30% szybciej.'},
 {id:'u_przys',d:'uprawa',ep:3,r:6,c:2,n:'Pola przysiółków',xp:750,req:['u_inspekt'],desc:'Ziarno z osady idzie do przysiółków, a z nimi wiedza o siewie.',eff:'Przysiółki zbierają i wytwarzają o 20% więcej.'},
 {id:'u_chmiel',d:'uprawa',ep:3,r:7,c:1,n:'Słód i chmiel',xp:1000,req:['u_mlyn'],desc:'Ziarno kiełkuje na klepisku, chmiel dojrzewa na tyczkach do szyszek.',eff:'Chmielnik, słodownia, browar, miodosytnia, winnica i winiarnia pracują o 25% szybciej.'},
 {id:'h_woly',d:'hodowla',ep:3,r:6,c:0,n:'Woły w zaprzęgu',xp:750,req:['h_ser'],desc:'Jarzmo na karku, a wóz idzie pod górę bez popychania.',eff:'Wozy jeżdżą o 25% szybciej i ruszają częściej. Przy zajeździe: rozbudowa „Stajnia”.'},
 {id:'h_hale',d:'hodowla',ep:3,r:6,c:2,n:'Wypas na halach',xp:750,req:['h_siano'],desc:'Latem stada idą na hale, a wracają tłuste i zdrowe.',eff:'Kozy dają o 15% więcej mleka i sierści, a koźlęta rodzą się częściej.'},
 {id:'h_masar',d:'hodowla',ep:3,r:7,c:1,n:'Masarstwo',xp:1000,req:['h_hale','h_wedz'],desc:'Sól, dym i jelita: kiełbasa przetrwa do wiosny.',eff:'Mięso i ryby psują się o 30% wolniej. Przy spiżarni: rozbudowa „Solarnia”.'},
 {id:'r_kute',d:'rzemioslo',ep:3,r:6,c:0,n:'Okucia wozów',xp:750,req:['r_woz','r_czeladz'],desc:'Żelazna obręcz na kole, a oś w tulei.',eff:'Warsztat robi wozy o 30% szybciej.'},
 {id:'r_kolowrot',d:'rzemioslo',ep:3,r:6,c:2,n:'Kołowrót i bloczek',xp:750,req:['r_czeladz'],desc:'Bęben z korbą podnosi to, czego nie uniosą czterej.',eff:'Kamieniołomy, łomy, wykopy, kopalnie i szyby pracują o 20% szybciej. Przy nich: rozbudowa „Kołowrót”.'},
 {id:'r_zaprawa',d:'rzemioslo',ep:3,r:7,c:1,n:'Zaprawa wapienna',xp:1000,req:['r_gont'],desc:'Wapno gaszone w dole spaja kamień lepiej niż glina.',eff:'Trzeci poziom budynków kosztuje o 25% mniej, a budowy idą o 15% szybciej.'},
 {id:'n_szkola',d:'nauka',ep:3,r:6,c:0,n:'Szkoła przy wiecu',xp:750,req:['n_rach','n_szk'],desc:'Dzieci z osady i przysiółków uczą się razem przy jednym stole.',eff:'Uczniowie i dzieci uczą się fachu o połowę szybciej.'},
 {id:'n_atlas',d:'nauka',ep:3,r:6,c:2,n:'Atlas wyspy',xp:750,req:['n_miern'],desc:'Wszystkie mapy z kory przerysowane na jedną skórę.',eff:'Wyprawy są o 25% krótsze i o 20% bezpieczniejsze.'},
 {id:'n_prawo',d:'nauka',ep:3,r:7,c:1,n:'Spisane prawo',xp:1000,req:['n_szkola'],desc:'Co ustalił wiec, wisi wyryte na tablicy przy placu.',eff:'Przysiółki rosną o połowę szybciej.'}
].forEach(t=>{TECH.push(t);TECH_BY[t.id]=t});

/* ---- rozbudowy budynków: wymagania z drzewa (need) i nowe opcje ---- */
const EXN=(id,n,d,cost,work,need,sp)=>Object.assign({id,n,d,cost,work},need?{need}:{},sp?{sp}:{});
const KOLOWROT=EXN('kolowrot','Kołowrót z bloczkiem','Praca idzie o 25% szybciej.',{drewno:10,deski:4,gwozdzie:4},5,'r_kolowrot',1.25);
EXT.pole.push(EXN('brona','Brona','Plon o 10% większy.',{drewno:6,narz:1},3,'u_radlo'));
EXT.chata.push(EXN('inspekt','Inspekt','Warzywa rosną także zimą, pod matami przy ścianie od słońca.',{deski:4,plotno:1},4,'u_inspekt'));   // EXT.dom to ta sama lista
EXT.pomost.push(EXN('sieci','Suszarnia sieci','Rybacy pracują o 25% szybciej.',{drewno:8,wlokna:4},4,'h_lodzie',1.25));
EXT.zagroda.push(EXN('kojec','Kojec','Zagroda mieści 4 kozy więcej.',{drewno:10,deski:2},4,'h_siano'));
EXT.sklad.push(EXN('strych','Strych','Skład mieści 200 więcej.',{deski:10,gwozdzie:6},6,'r_gont'));
EXT.spizarnia.push(EXN('solarnia','Solarnia','Mięso i ryby psują się o kolejne 20% wolniej.',{kamien:8,deski:4},6,'h_masar'));
EXT.garncarnia=[STOL,EXN('polki','Półki do suszenia','Garncarnia pracuje o 25% szybciej.',{deski:6},4,'r_kolo',1.25)];
EXT.izbachorych=[EXN('suszz','Suszarnia ziół','Zielarka suszy zioła: kilka porcji na tydzień, poza zimą.',{drewno:6,deski:2},4,'n_leki')];
EXT.zajazd=[EXN('stajnia','Stajnia','Wozy z przysiółków przywożą o 25% więcej.',{drewno:16,deski:8},6,'h_woly')];
EXT.kurnik=[STOL,EXN('grzedy','Grzędy i gniazda','Kurnik daje o 25% więcej.',{drewno:6,wlokna:2},3,null,1.25)];
['kamien','lom','ruda','kopalnia','szybw'].forEach(k=>{EXT[k]=(EXT[k]||[]).concat(KOLOWROT)});
// lepsze stanowisko w pracowniach z epok II i III, które do tej pory nie miały żadnej rozbudowy
['zarna','piekarnia','serownia','kiszarnia','bednarnia','slodownia','browar','miodosytnia','piekarz','winiarnia','wiatrak','torfowisko','dymarka','sztolnia','szkutnia','ptasznik','odkrywka','lom','gliniak','kopalnia','szybw']
 .forEach(k=>{if(!BD[k])return;EXT[k]=EXT[k]||[];if(!EXT[k].includes(STOL))EXT[k].unshift(STOL)});
const extNeedOk=e=>!e.need||tech(e.need);
function extNeedTxt(e){const t=TECH_BY[e.need];if(!t)return'';const dn=DOMS.find(x=>x[0]===t.d)[1];return tEp(t)>epNow()?`przyjdzie z epoką: ${EP_N[tEp(t)]}`:`wymaga wiedzy „${t.n}” (Wiedza → ${dn})`}
{const _sp=startProj;startProj=function(b,t,id,quiet){if(t==='ext'&&b){const e=(EXT[b.kind]||[]).find(x=>x.id===id);if(e&&!extNeedOk(e)){toast(e.n+': '+extNeedTxt(e)+'.');return}}return _sp(b,t,id,quiet)}}
// karta budynku: rozbudowa bez wiedzy jest widoczna, ale z wymaganiem zamiast przycisku; z dalszej epoki dopiero wtedy, gdy ta epoka jest blisko
{const _bp=bldPanelHTML;bldPanelHTML=function(b){const exts=EXT[b.kind];if(!exts||!exts.some(e=>e.need))return _bp(b);
  const keep=EXT[b.kind];EXT[b.kind]=keep.filter(e=>extNeedOk(e)||hasExt(b,e.id));let h;try{h=_bp(b)}finally{EXT[b.kind]=keep}
  const locked=keep.filter(e=>!extNeedOk(e)&&!hasExt(b,e.id)&&tEp(TECH_BY[e.need]||{})<=epNow()+1);
  if(locked.length&&bDone(b))h+=locked.map(e=>`<div class="ext lockx"><b>${e.n}</b><small>${e.d}</small><span class="cost no">${extNeedTxt(e)}</span></div>`).join('');
  return h}}

/* ---- działanie węzłów ---- */
// warsztaty: mnożnik pracy budynku
const TBM={serownia:['h_ser',1.3],kiszarnia:['h_ser',1.3],garncarnia:['r_kolo',1.25],cegielnia:['r_kolo',1.25],glinianka:['r_kolo',1.25],gliniak:['r_kolo',1.25],
 zarna:['u_mlyn',1.3],wiatrak:['u_mlyn',1.3],piekarnia:['u_mlyn',1.3],piekarz:['u_mlyn',1.3],
 chmielnik:['u_chmiel',1.25],slodownia:['u_chmiel',1.25],browar:['u_chmiel',1.25],miodosytnia:['u_chmiel',1.25],winnica:['u_chmiel',1.25],winiarnia:['u_chmiel',1.25],
 kamien:['r_kolowrot',1.2],lom:['r_kolowrot',1.2],ruda:['r_kolowrot',1.2],kopalnia:['r_kolowrot',1.2],sztolnia:['r_kolowrot',1.2],szybw:['r_kolowrot',1.2],odkrywka:['r_kolowrot',1.2]};
{const _bm=bMul;bMul=function(b){const m=_bm(b);const x=b&&TBM[b.kind];return x&&tech(x[0])?m*x[1]:m}}
{const _tx=techXp;techXp=function(d,v){return _tx(d,tech('n_rach')?v*1.1:v)}}
{const _fl=fertLoss;fertLoss=function(f){return _fl(f)*(tech('u_trojpol')?.6:1)}}
{const _wr=wearRate;wearRate=function(b){return _wr(b)*(tech('r_gont')?.7:1)}}
{const _yl=yearsLeft;yearsLeft=function(b){return _yl(b)/(tech('r_gont')?.7:1)}}
{const _rc=roadCost;roadCost=function(h){const c=_rc(h);if(!tech('n_miern'))return c;return{drewno:Math.round(c.drewno*.7),kamien:Math.round(c.kamien*.7),dni:Math.max(2,Math.round(c.dni*.75))}}}
{const _lc=lvCost;lvCost=function(b,to){const c=_lc(b,to);if(to!==3||!tech('r_zaprawa'))return c;const o={};for(const k in c)o[k]=Math.ceil(c[k]*.75);return o}}
{const _ed=expDays;expDays=function(r,type){const d=_ed(r,type);return tech('n_atlas')?Math.max(2,Math.round(d*.75)):d}}
{const _er=expRisk;expRisk=function(r,n){return _er(r,n)*(tech('n_atlas')?.8:1)}}
{const _hr=hamRate;hamRate=function(h,r){return _hr(h,r)*(tech('u_przys')?1.2:1)}}
{const _he=hanEvery;hanEvery=function(){return _he()*(tech('h_woly')?.8:1)}}
{const _hm=hanMul;hanMul=function(){return _hm()*(S&&S.bld.some(b=>bDone(b)&&hasExt(b,'stajnia'))?1.25:1)}}
{const _cs=cartSpawn;cartSpawn=function(h,dir){const ok=_cs(h,dir);if(ok&&tech('h_woly')){const c=carts[carts.length-1];if(c)c.sp*=1.25}return ok}}
{const _fc=foodCap;foodCap=function(){return _fc()+200*S.bld.filter(b=>bDone(b)&&hasExt(b,'strych')).length}}
// codzienne: inspekt zimą, suszarnia ziół, mocniejsza chata zielarki
{const _bd=bldDaily;bldDaily=function(){_bd();const sea=seasonIdx();
  S.bld.forEach(b=>{if(!bDone(b))return;
   if(hasExt(b,'inspekt'))S.res.warzywa=(S.res.warzywa||0)+(sea===2?.5:.3)*K;
   if(hasExt(b,'suszz')&&sea!==2)S.res.ziola=(S.res.ziola||0)+.3*K;
   if(hasExt(b,'ogrod')&&sea!==2&&tech('u_inspekt'))S.res.warzywa=(S.res.warzywa||0)+(sea===0?.6:.4)*K});
  if(tech('n_leki')&&hasB('izbachorych'))S.people.forEach(p=>{if(p.hp<.6)p.hp=Math.min(1,p.hp+.012*K)})}}
// szybki start epoki III: wieś z epoki II już umie to, co jej epoka dała
{const _q=e3Quick;e3Quick=function(){const r=_q.apply(this,arguments);if(S&&S.tech)TECH.forEach(t=>{if(tEp(t)===2)S.tech[t.id]=1});return r}}

/* ---- wygląd nowych rozbudów ---- */
Object.assign(EXTV,{
 brona:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(.9,.05,.06,mPlank,0,.08,0),tbox(.9,.05,.06,mPlank,0,.08,.36),tbox(.06,.05,.42,mPlank,-.42,.08,.18),tbox(.06,.05,.42,mPlank,.42,.08,.18));
  for(let k=0;k<5;k++)s.add(cyl(.015,.14,matDark,-.36+k*.18,.02,.18,0,0,0,4));s.position.set(W+.35,0,H-.25);s.rotation.y=.4;g.add(s)},
 inspekt:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(1.1,.18,.5,mPlankD,0,.09,0));const f=tbox(1.08,.03,.48,M(0xb8c8a8,{transparent:true,opacity:.55,roughness:.2}),0,.2,0);f.rotation.x=-.18;s.add(f);
  for(let k=0;k<4;k++)s.add(mesh(new THREE.SphereGeometry(.07,6,4),M(0x5a8a40),-.38+k*.25,.17,.02));s.position.set(-W-.2,0,H+.6);g.add(s)},
 sieci:(g,W,H)=>{const s=new THREE.Group();for(const x of[-.5,.5])s.add(cyl(.035,1,matDark,x,.5,0,0,0,0,5));s.add(cyl(.025,1.05,matLog,0,.95,0,0,0,Math.PI/2,5));
  const n=new THREE.Mesh(new THREE.PlaneGeometry(.95,.7),M(0x8a8060,{side:THREE.DoubleSide,transparent:true,opacity:.75}));n.position.set(0,.6,0);s.add(n);s.position.set(-W-.5,0,-H*.4);g.add(s)},
 kojec:(g,W,H)=>{const x0=W+.45,x1=W+1.3,z0=-.75,z1=.75;for(const[x,z]of[[x0,z0],[x1,z0],[x1,z1],[x0,z1],[x1,0]])g.add(cyl(.04,.55,matDark,x,.27,z,0,0,0,5));
  for(const y of[.2,.42]){g.add(tbox(x1-x0,.05,.05,mPlank,(x0+x1)/2,y,z0,0,2),tbox(x1-x0,.05,.05,mPlank,(x0+x1)/2,y,z1,0,2),tbox(.05,.05,z1-z0,mPlank,x1,y,0,0,2))}
  const r=tbox(.8,.04,.6,mThatch,(x0+x1)/2,.62,-.42);r.rotation.x=.25;g.add(r,cyl(.03,.62,matDark,x0+.1,.31,-.68,0,0,0,4),cyl(.03,.62,matDark,x1-.1,.31,-.68,0,0,0,4))},
 polki:(g,W,H)=>{rack(g,W+.35,0,Math.PI/2,r=>{for(let k=0;k<4;k++){const p=cyl(.07,.12,M(0x9a5a3a),0,.62,-.27+k*.18,0,0,0,8);r.add(p)}})},
 strych:(g,W,H)=>{const s=new THREE.Group();shed(s,1,1.1,.95,mShingle);crate(s,.1,.15,.2);s.position.set(-W-.6,0,0);g.add(s)},
 suszz:(g,W,H)=>{rack(g,W+.35,.2,Math.PI/2,r=>{for(let k=0;k<5;k++){const b=new THREE.Mesh(new THREE.ConeGeometry(.06,.2,5),M(k%2?0x8a9a50:0x9a7a9a));b.position.set(0,.64,-.3+k*.15);b.rotation.x=Math.PI;r.add(b)}})},
 stajnia:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(1.4,.75,.9,mLogs,0,.37,0,0,1.1));s.add(gable(1.45,1,.45,mThatch,.75,.15));s.add(tbox(.45,.5,.03,matDark,0,.25,.46));s.position.set(W+.9,0,-H*.2);g.add(s)},
 solarnia:(g,W,H)=>{const s=new THREE.Group();s.add(tbox(.7,.5,.55,mStone,0,.25,0,0,1.2));s.add(gable(.75,.6,.25,mPlankD,.5,.08));barrel(s,.55,.1,.5);s.position.set(W+.45,0,H*.25);g.add(s)},
 kolowrot:(g,W,H)=>{const s=new THREE.Group();for(const z of[-.3,.3])s.add(tbox(.06,.6,.06,matDark,0,.3,z));s.add(cyl(.11,.66,matLog,0,.55,0,Math.PI/2,0,0,8));
  s.add(tbox(.04,.04,.25,matDark,0,.55,.42),tbox(.04,.2,.04,matDark,0,.45,.54));s.position.set(-W-.35,0,H*.3);g.add(s)},
 grzedy:(g,W,H)=>{for(let k=0;k<3;k++)g.add(tbox(.7,.04,.05,mPlank,-W-.3,.25+k*.18,-.2+k*.12,0,2));for(let k=0;k<3;k++)g.add(cyl(.12,.12,mWattle,-W-.3+(k-1)*.25,.06,.45,0,0,0,8))}});
