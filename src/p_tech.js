
/* ================= drzewka postępu ================= */
// Postęp nie spada z nieba: każda dziedzina zbiera doświadczenie z codziennej pracy ludzi,
// a ono zamienia się w kolejne umiejętności osady. Część węzłów to próby i księgi (osobne mechanizmy).
const DOMS=[['nauka','Nauka','Pismo, niebo, mapa i leczenie. Rośnie z czytania, zwiadu, wypraw, odkryć i nauczania.'],
 ['rzemioslo','Rzemiosło','Drewno, glina, ogień i żelazo. Rośnie z budowy i pracy w warsztatach.'],
 ['uprawa','Uprawa','Zbieractwo, zioła i pola. Rośnie z pracy zbieraczy i rolników.'],
 ['hodowla','Hodowla','Łowy, ryby i stada. Rośnie z pracy myśliwych, rybaków i hodowców.']];
const DOMC={zbieracz:'uprawa',rolnik:'uprawa',mysliwy:'hodowla',hodowca:'hodowla',rybak:'hodowla',drwal:'rzemioslo',kamieniarz:'rzemioslo',ciesla:'rzemioslo',murarz:'rzemioslo',krawiec:'rzemioslo',kowal:'rzemioslo'};
const TECH=[
 // UPRAWA
 {id:'u_rozp',d:'uprawa',r:0,c:1,n:'Rozpoznawanie roślin',xp:50,req:[],desc:'Które jagody jeść, a które omijać. Zbieracze uczą się tego z każdym koszem.',eff:'Zbieracze przynoszą o 15% więcej. Można zbierać zioła.'},
 {id:'u_ziel',d:'uprawa',r:1,c:0,n:'Zielarstwo',xp:110,req:['u_rozp'],desc:'Krwawnik na rany, dziurawiec na gorączkę, kora wierzby na ból.',eff:'Zioła leczą dwa razy skuteczniej. Gorączka jest mniej groźna.'},
 {id:'u_pole',d:'uprawa',r:1,c:1,n:'Siew dzikiego zboża',xp:0,req:['u_rozp'],sync:()=>S.know.pole==='tak',gt:()=>`Obserwacja: ${Math.floor(S.zbozeTot)} z 25 ziarna zebranego przez zbieraczy albo księga „${BOOKS.siew}”.`,desc:'Ziarno rozsypane przy obozie wykiełkowało.',eff:'Można zakładać pola.'},
 {id:'u_susz',d:'uprawa',r:1,c:2,n:'Suszenie owoców',xp:80,req:['u_rozp'],desc:'Jagody i grzyby rozkładane na matach z trzciny, w dymie i na wietrze.',eff:'Jagody i grzyby psują się o 40% wolniej.'},
 {id:'u_bart',d:'uprawa',r:2,c:0,n:'Bartnictwo',xp:120,req:['u_ziel'],desc:'Dym, cierpliwość i ostrożna ręka przy dziupli dzikich pszczół.',eff:'Zbieracze wybierają miód z dzikich barci.'},
 {id:'u_odlog',d:'uprawa',r:2,c:1,n:'Odłóg i płodozmian',xp:140,req:['u_pole'],desc:'Pole, które odpoczywa, oddaje więcej.',eff:'Gleba wraca do sił trzy razy szybciej, żniwa męczą ją o połowę mniej.'},
 {id:'u_sad',d:'uprawa',r:2,c:2,n:'Sadzonki krzewów',xp:120,req:['u_susz'],desc:'Odrosty jagód przesadzane bliżej domów.',eff:'Krzewy jagód odrastają o 50% szybciej.'},
 {id:'u_nawoz',d:'uprawa',r:3,c:0,n:'Nawożenie obornikiem',xp:180,req:['u_odlog','h_zagr'],desc:'To, co zostaje po kozach, wraca do ziemi.',eff:'Gdy w zagrodzie są kozy, pola dają o 25% więcej.'},
 {id:'u_selek',d:'uprawa',r:3,c:1,n:'Selekcja ziarna',xp:220,req:['u_odlog'],desc:'Do siewu tylko najcięższe kłosy.',eff:'Zboże rośnie szybciej i daje o 20% więcej.'},
 {id:'u_len',d:'uprawa',r:3,c:2,n:'Uprawa lnu',xp:160,req:['u_sad'],desc:'Len przesiany bliżej osady.',eff:'Len odrasta dwa razy szybciej i daje półtora raza więcej włókna.'},
 // HODOWLA
 {id:'h_trop',d:'hodowla',r:0,c:1,n:'Tropienie',xp:50,req:[],desc:'Ślady, wiatr i cisza. Myśliwi uczą się zwierzyny tej wyspy.',eff:'Polowanie idzie o 20% szybciej, rany zdarzają się rzadziej.'},
 {id:'h_wedz',d:'hodowla',r:1,c:0,n:'Wędzenie',xp:90,req:['h_trop'],desc:'Mięso i ryby wiszą w dymie z olchy.',eff:'Mięso i ryby psują się o połowę wolniej.'},
 {id:'h_zagr',d:'hodowla',r:1,c:1,n:'Oswajanie kóz',xp:80,req:['h_trop'],desc:'Dzikie kozy z hal przestają uciekać przed człowiekiem.',eff:'Można postawić zagrodę.'},
 {id:'h_garb',d:'hodowla',r:1,c:2,n:'Garbowanie skór',xp:100,req:['h_trop'],desc:'Kora dębu, popiół i czas.',eff:'Z każdego polowania półtora raza więcej skór.'},
 {id:'h_sieci',d:'hodowla',r:2,c:0,n:'Sieci i więcierze',xp:120,req:['h_wedz'],desc:'Sieci plecione z lnu, kosze z wikliny na płyciznach.',eff:'Rybacy łowią o 25% więcej.'},
 {id:'h_doj',d:'hodowla',r:2,c:1,n:'Dojenie i ser',xp:120,req:['h_zagr'],desc:'Mleko zsiadłe, potem ser, który przetrwa zimę.',eff:'Kozy dają o 40% więcej mleka, a mleko psuje się wolniej.'},
 {id:'h_ostr',d:'hodowla',r:2,c:2,n:'Ostrokół',xp:110,req:['h_zagr'],desc:'Zaostrzone pale wokół zagrody.',eff:'Wilki rzadko przedostają się do zagród.'},
 {id:'h_rozr',d:'hodowla',r:3,c:1,n:'Dobór do rozrodu',xp:200,req:['h_doj'],desc:'Do rozrodu tylko zdrowe i spokojne zwierzęta.',eff:'Koźlęta rodzą się dwa razy częściej, nie tylko wiosną.'},
 {id:'h_siersc',d:'hodowla',r:3,c:2,n:'Czesanie sierści',xp:160,req:['h_doj'],desc:'Zimowy podszerstek kóz da się prząść.',eff:'Kozy w zagrodzie dają włókna.'},
 // RZEMIOSŁO
 {id:'r_ciesla',d:'rzemioslo',r:0,c:1,n:'Ciesielka',xp:0,req:[],sync:()=>S.books.ciesla===2,gt:()=>'Z podręcznika ciesielki i rąk cieśli.',desc:'Siekiera, piła i zrąb.',eff:'Budowa domów z bali.'},
 {id:'r_narz',d:'rzemioslo',r:1,c:0,n:'Krzemień i trzonki',xp:70,req:['r_ciesla'],desc:'Lepszy krzemień, lepiej osadzony trzonek.',eff:'Kamienne narzędzia służą o 70% dłużej.'},
 {id:'r_zrab',d:'rzemioslo',r:1,c:1,n:'Zrąb na jaskółczy ogon',xp:120,req:['r_ciesla'],desc:'Bale łączone bez gwoździ, szczelnie i szybko.',eff:'Budowa idzie o 25% szybciej.'},
 {id:'r_cegla',d:'rzemioslo',r:1,c:2,n:'Wypał cegły',xp:0,req:['r_ciesla'],sync:()=>S.know.cegla==='tak',gt:()=>'Próba w zakładce Wiedza, poniżej schematu.',desc:'Glina, ogień i wiele pękniętych cegieł.',eff:'Piec do cegły.'},
 {id:'r_tkac',d:'rzemioslo',r:2,c:0,n:'Krosno',xp:110,req:['r_narz'],desc:'Proste krosno pionowe z ciężarkami z gliny.',eff:'Płótno powstaje szybciej, odzież służy dłużej.'},
 {id:'r_kuznia',d:'rzemioslo',r:2,c:1,n:'Wytop żelaza',xp:0,req:['r_narz'],sync:()=>S.know.kuznia==='tak',gt:()=>S.books.kowal===2?'Próba w zakładce Wiedza, poniżej schematu.':'Najpierw trzeba przeczytać „'+BOOKS.kowal+'” z wraku.',desc:'Ruda darniowa, węgiel drzewny i mieszek.',eff:'Kuźnia: żelazne narzędzia i gwoździe.'},
 {id:'r_piec',d:'rzemioslo',r:2,c:2,n:'Piec zduński',xp:0,req:['r_cegla'],sync:()=>S.know.piec==='tak',gt:()=>'Próba w zakładce Wiedza, poniżej schematu.',desc:'Sklepienie, które trzyma ciąg.',eff:'Domy palą mniej, nadmiar żywności się suszy.'},
 {id:'r_stal',d:'rzemioslo',r:3,c:1,n:'Hartowanie',xp:220,req:['r_kuznia'],desc:'Ostrze rozgrzane do wiśniowego koloru i zanurzone w wodzie.',eff:'Żelazne narzędzia służą o połowę dłużej.'},
 {id:'r_garn',d:'rzemioslo',r:3,c:2,n:'Garncarstwo',xp:130,req:['r_cegla'],desc:'Szczelne gliniane naczynia z pokrywą.',eff:'Cała żywność psuje się o 25% wolniej.'},
 // NAUKA
 {id:'n_kron',d:'nauka',r:0,c:1,n:'Kronika osady',xp:50,req:[],desc:'Ktoś zaczyna zapisywać, co się udało, a co nie.',eff:'Uczniowie uczą się fachu o 25% szybciej.'},
 {id:'n_kal',d:'nauka',r:1,c:0,n:'Kalendarz nieba',xp:90,req:['n_kron'],desc:'Wschody słońca liczone na nacięciach kija.',eff:'Dłuższe okno siewu. Wiadomo, ile potrwa pogoda.'},
 {id:'n_mapa',d:'nauka',r:1,c:1,n:'Mapa wyspy',xp:100,req:['n_kron'],desc:'Rysunek na korze brzozy, poprawiany po każdej wyprawie.',eff:'Wyprawy są krótsze o 30% i bezpieczniejsze.'},
 {id:'n_szk',d:'nauka',r:1,c:2,n:'Nauka dzieci',xp:120,req:['n_kron'],desc:'Wieczorami przy ogniu starsi uczą młodszych.',eff:'Dzieci uczą się fachu dwa razy szybciej.'},
 {id:'n_opat',d:'nauka',r:2,c:0,n:'Opatrywanie ran',xp:150,req:['n_kal','u_ziel'],desc:'Czysta woda, płótno i zioła z ogrodu zielarki.',eff:'Ranni i chorzy wracają do zdrowia dwa razy szybciej.'},
 {id:'n_znaki',d:'nauka',r:2,c:1,n:'Znaki plemienia',xp:140,req:['n_mapa'],gate:()=>S.found.length>=3,gt:()=>`Trzeba najpierw znaleźć trzy ślady plemienia (${S.found.length}/3).`,desc:'Te same znaki powtarzają się na skałach i słupach. Wskazują miejsca.',eff:'Na mapie pojawiają się miejsca pozostałych śladów.'},
 {id:'n_gwiazd',d:'nauka',r:2,c:2,n:'Nawigacja po gwiazdach',xp:200,req:['n_mapa'],desc:'Łodzie wypływają dalej i wracają przed nocą.',eff:'Rybacy łowią o 20% więcej, wyprawy wzdłuż brzegu są bezpieczniejsze.'},
 {id:'n_pamiec',d:'nauka',r:3,c:1,n:'Księga osady',xp:220,req:['n_szk'],desc:'Wszystko, co umieją mistrzowie, zapisane dla następnych.',eff:'Gdy mistrz umiera, najlepszy uczeń przejmuje jego wiedzę.'}];
const TECH_BY={};TECH.forEach(t=>TECH_BY[t.id]=t);
function tech(id){return !!(S&&S.tech&&S.tech[id])}
function techAvail(t){return !S.tech[t.id]&&!t.sync&&t.req.every(r=>S.tech[r])&&(!t.gate||t.gate())}
function techTarget(d){const f=S.focus[d];const ft=f&&TECH_BY[f];if(ft&&techAvail(ft))return ft;return TECH.find(t=>t.d===d&&techAvail(t))}
function techXp(d,v){if(!S||!d||!S.tech)return;if(S.laws&&S.laws.wymiana)v*=1.15;S.dxp[d]=(S.dxp[d]||0)+v;const t=techTarget(d);if(!t){S.bank[d]=Math.min(150,(S.bank[d]||0)+v);return}
 const add=v+(S.bank[d]||0);S.bank[d]=0;S.tp[t.id]=(S.tp[t.id]||0)+add;if(S.tp[t.id]>=t.xp)techDone(t)}
function techDone(t,quiet){if(S.tech[t.id])return;S.tech[t.id]=1;if(S.focus[t.d]===t.id)S.focus[t.d]=null;
 if(!quiet){log('Postęp ('+DOMS.find(d=>d[0]===t.d)[1].toLowerCase()+'): '+t.n+'. '+t.eff);toast('Postęp: '+t.n);sfx('bell')}
 if(t.id==='n_znaki'){tribe.forEach(s=>reveal(s.i,s.j,4));log('Znaki prowadzą do miejsc, gdzie plemię zostawiło swoje ślady. Zaznaczono je na mapie.')}
 if(tab==='wiedza'||tab==='budowa')renderPanel()}
function techTick(){if(!S||!S.tech)return;TECH.forEach(t=>{if(t.sync&&!S.tech[t.id]&&t.sync())techDone(t,t.id==='r_ciesla')})}
function techState(t){if(S.tech[t.id])return'done';if(t.sync)return'sync';if(t.req.every(r=>S.tech[r]))return(!t.gate||t.gate())?'avail':'gate';return'lock'}
let techDom='uprawa',techSel=null;
function techHTML(){const d=techDom;const list=TECH.filter(t=>t.d===d);const rows=Math.max(...list.map(t=>t.r))+1;const RH=88,W=300;
 const cur=techTarget(d);const dd=DOMS.find(x=>x[0]===d);
 let h=`<div class="dchips">${DOMS.map(x=>{const n=TECH.filter(t=>t.d===x[0]),k=n.filter(t=>S.tech[t.id]).length;return`<button data-dom="${x[0]}" class="${x[0]===d?'on':''}">${x[1]}<small>${k}/${n.length}</small></button>`}).join('')}</div>`;
 h+=`<p class="lead">${dd[2]}${cur?` Teraz: <b style="color:var(--hi)">${cur.n}</b>.`:' Nic nie jest teraz rozwijane.'}</p>`;
 const cx=c=>(c+.5)*W/3;
 let svg=`<svg class="tlines" viewBox="0 0 ${W} ${rows*RH}" preserveAspectRatio="none">`;
 list.forEach(t=>t.req.forEach(r=>{const p=TECH_BY[r];if(!p||p.d!==d)return;const on=S.tech[r];svg+=`<path d="M${cx(p.c)} ${p.r*RH+62} C${cx(p.c)} ${p.r*RH+78},${cx(t.c)} ${t.r*RH+8},${cx(t.c)} ${t.r*RH+22}" class="${on?'on':''}"/>`}));svg+='</svg>';
 h+=`<div class="tree" style="height:${rows*RH}px">${svg}`;
 list.forEach(t=>{const st=techState(t);const pc=t.xp?Math.min(100,Math.round(100*(S.tp[t.id]||0)/t.xp)):0;const ext=t.req.filter(r=>TECH_BY[r].d!==d).map(r=>TECH_BY[r].n);
  h+=`<button class="tn ${st}${techSel===t.id?' sel':''}${cur&&cur.id===t.id?' cur':''}" data-tn="${t.id}" style="left:calc(${t.c*33.333}% + 3px);top:${t.r*RH+20}px">
  <span class="tt">${t.n}</span>${st==='done'?'<span class="ts">✓ poznane</span>':st==='sync'?'<span class="ts">próba / księga</span>':st==='gate'?'<span class="ts">warunek</span>':st==='lock'?`<span class="ts">${ext.length?'też: '+ext.join(', '):'zablokowane'}</span>`:`<span class="tb"><i style="width:${pc}%"></i></span>`}</button>`});
 h+='</div>';
 const t=techSel&&TECH_BY[techSel]&&TECH_BY[techSel].d===d?TECH_BY[techSel]:cur||list.find(x=>!S.tech[x.id])||list[0];
 if(t){const st=techState(t);h+=`<div class="card tdet"><h4>${t.n}</h4><p>${t.desc}</p><p><b style="color:var(--gold2)">Daje:</b> ${t.eff}</p>`;
  if(t.req.length)h+=`<p class="mut">Wymaga: ${t.req.map(r=>(S.tech[r]?'✓ ':'')+TECH_BY[r].n).join(', ')}</p>`;
  if(st==='done')h+='<p class="ok">Osada to już umie.</p>';
  else if(st==='sync')h+=`<p class="mut">${t.gt()}</p>`;
  else if(st==='gate')h+=`<p class="mut">${t.gt()}</p>`;
  else if(st==='avail'){const pc=Math.round(100*(S.tp[t.id]||0)/t.xp);h+=`<div class="pbar"><div style="width:${pc}%"></div></div><p class="mut">${pc}% · doświadczenie przychodzi z pracy w tej dziedzinie.</p>`+(cur&&cur.id===t.id?'<p class="ok">Osada skupia się na tym.</p>':`<button class="pri" data-focus="${t.id}">Skup się na tym</button>`)}
  else h+='<p class="mut">Najpierw trzeba poznać to, co wyżej.</p>';h+='</div>'}
 return h}
