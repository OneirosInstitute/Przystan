
/* ================= drzewka postępu ================= */
// 4.9.0-rc.22: wiedza pół na pół. Praca w fachu węzła daje przeczucie (najwyżej połowę węzła),
// a drugą połowę daje próba, którą wybiera gracz: osoba, materiały, kilka dni i szansa (p_badania.js).
// Pierwszy rząd epoki I przychodzi z samej praktyki. Część węzłów to dawne próby i księgi (osobne mechanizmy).
const DOMS=[['nauka','Nauka','Pismo, niebo, mapa i leczenie. Przeczucie rośnie z czytania, zwiadów, wypraw, odkryć i nauczania.'],
 ['rzemioslo','Rzemiosło','Drewno, glina, ogień i żelazo. Przeczucie rośnie z pracy cieśli, kamieniarzy, murarzy, krawców i kowali.'],
 ['uprawa','Uprawa','Zbieractwo, zioła i pola. Przeczucie rośnie z pracy zbieraczy i rolników.'],
 ['hodowla','Hodowla','Łowy, ryby i stada. Przeczucie rośnie z pracy myśliwych, rybaków i hodowców.']];
const DOMC={zbieracz:'uprawa',rolnik:'uprawa',mysliwy:'hodowla',hodowca:'hodowla',rybak:'hodowla',drwal:'rzemioslo',kamieniarz:'rzemioslo',ciesla:'rzemioslo',murarz:'rzemioslo',krawiec:'rzemioslo',kowal:'rzemioslo'};
const TECH=[
 // UPRAWA
 {id:'u_rozp',d:'uprawa',r:0,c:1,n:'Rozpoznawanie roślin',xp:50,req:[],desc:'Które jagody jeść, a które omijać. Zbieracze uczą się tego z każdym koszem.',eff:'Zbieracze przynoszą o 15% więcej. Można zbierać zioła.'},
 {id:'u_ziel',d:'uprawa',r:1,c:0,n:'Zielarstwo',xp:110,req:['u_rozp'],desc:'Krwawnik na rany, dziurawiec na gorączkę, kora wierzby na ból.',eff:'Zioła leczą dwa razy skuteczniej. Gorączka jest mniej groźna.'},
 {id:'u_pole',d:'uprawa',r:1,c:1,n:'Siew dzikiego zboża',xp:0,req:['u_rozp'],sync:()=>S.know.pole==='tak',gt:()=>`Obserwacja: ${Math.floor(S.zbozeTot)} z 25 porcji ziarna zebranych przez zbieraczy albo księga „${BOOKS.siew}”.`,desc:'Ziarno rozsypane przy obozie wykiełkowało.',eff:'Można zakładać pola.'},
 {id:'u_susz',d:'uprawa',r:1,c:2,n:'Suszenie owoców',xp:80,req:['u_rozp'],desc:'Jagody i grzyby rozkładane na matach z trzciny, w dymie i na wietrze.',eff:'Jagody i grzyby psują się o 40% wolniej.'},
 {id:'u_bart',d:'uprawa',r:2,c:0,n:'Bartnictwo',xp:120,req:['u_ziel'],desc:'Dym, cierpliwość i ostrożna ręka przy dziupli dzikich pszczół.',eff:'Zbieracze wybierają miód z dzikich barci.'},
 {id:'u_odlog',d:'uprawa',r:2,c:1,n:'Odłóg i płodozmian',xp:140,req:['u_pole'],desc:'Pole, które odpoczywa, oddaje więcej.',eff:'Gleba wraca do sił trzy razy szybciej, żniwa męczą ją o połowę mniej.'},
 {id:'u_sad',d:'uprawa',r:2,c:2,n:'Sadzonki krzewów',xp:120,req:['u_susz'],desc:'Odrosty jagód przesadzane bliżej domów.',eff:'Krzewy jagód odrastają o 50% szybciej.'},
 {id:'u_nawoz',d:'uprawa',r:3,c:0,n:'Nawożenie obornikiem',xp:180,req:['u_odlog','h_zagr'],desc:'To, co zostaje po kozach, wraca do ziemi.',eff:'Gdy w zagrodzie są kozy, pola dają o 25% więcej.'},
 {id:'u_selek',d:'uprawa',r:3,c:1,n:'Selekcja ziarna',xp:220,req:['u_odlog'],desc:'Do siewu tylko najcięższe kłosy.',eff:'Zboże rośnie szybciej i daje o 20% więcej.'},
 {id:'u_len',d:'uprawa',r:3,c:2,n:'Uprawa lnu',xp:160,req:['u_sad'],desc:'Len wysiewany bliżej osady.',eff:'Len odrasta dwa razy szybciej i daje półtora raza więcej włókna.'},
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
 {id:'r_garn',d:'rzemioslo',r:3,c:2,n:'Garncarstwo',xp:130,req:['r_cegla'],desc:'Szczelne gliniane naczynia z pokrywą.',eff:'Cała żywność psuje się o 25% wolniej. Można postawić garncarnię i komorę kiszonek.'},
 // NAUKA
 {id:'n_kron',d:'nauka',r:0,c:1,n:'Kronika osady',xp:50,req:[],desc:'Ktoś zaczyna zapisywać, co się udało, a co nie.',eff:'Uczniowie uczą się fachu o 25% szybciej.'},
 {id:'n_kal',d:'nauka',r:1,c:0,n:'Kalendarz nieba',xp:90,req:['n_kron'],desc:'Wschody słońca liczone na nacięciach kija.',eff:'Dłuższe okno siewu. Wiadomo, ile potrwa pogoda.'},
 {id:'n_mapa',d:'nauka',r:1,c:1,n:'Mapa wyspy',xp:100,req:['n_kron'],desc:'Rysunek na korze brzozy, poprawiany po każdej wyprawie.',eff:'Wyprawy są krótsze o 30% i bezpieczniejsze.'},
 {id:'n_szk',d:'nauka',r:1,c:2,n:'Nauka dzieci',xp:120,req:['n_kron'],desc:'Wieczorami przy ogniu starsi uczą młodszych.',eff:'Dzieci uczą się fachu dwa razy szybciej, a próby trwają o 10% krócej.'},
 {id:'n_opat',d:'nauka',r:2,c:0,n:'Opatrywanie ran',xp:150,req:['n_kal','u_ziel'],desc:'Czysta woda, płótno i zioła z ogrodu zielarki.',eff:'Ranni i chorzy wracają do zdrowia dwa razy szybciej.'},
 {id:'n_znaki',d:'nauka',r:2,c:1,n:'Znaki dawnego ludu',xp:140,req:['n_mapa'],gate:()=>S.found.length>=3,gt:()=>`Trzeba najpierw znaleźć trzy ślady dawnego ludu (${S.found.length}/3).`,desc:'Te same znaki powtarzają się na skałach i słupach. Wskazują miejsca.',eff:'Na mapie pojawiają się miejsca pozostałych śladów.'},
 {id:'n_gwiazd',d:'nauka',r:2,c:2,n:'Nawigacja po gwiazdach',xp:200,req:['n_mapa'],desc:'Łodzie wypływają dalej i wracają przed nocą.',eff:'Rybacy łowią o 20% więcej, wyprawy wzdłuż brzegu są bezpieczniejsze.'},
 {id:'n_pamiec',d:'nauka',r:3,c:1,n:'Księga osady',xp:220,req:['n_szk'],desc:'Wszystko, co umieją mistrzowie, zapisane dla następnych.',eff:'Gdy mistrz umiera, najlepszy uczeń przejmuje jego wiedzę.'}];
const TECH_BY={};TECH.forEach(t=>TECH_BY[t.id]=t);
// 4.7: drzewo rośnie z każdą epoką. Węzeł z polem ep czeka, aż osada do tej epoki dojdzie (ep brak = epoka I).
const EP_N={1:'Epoka I · Wyspa',2:'Epoka II · Wieś',3:'Epoka III · Cała wyspa',4:'Epoka IV · Rody'};
function epNow(){if(!S)return 1;if(S.epoch===4)return 4;if(S.e3&&S.e3.on)return 3;return S.epoch===2?2:1}
const tEp=t=>t.ep||1;
const tq=(id,v)=>tech(id)?v:1;
function tech(id){return !!(S&&S.tech&&S.tech[id])}
function techAvail(t){return !S.tech[t.id]&&!t.sync&&tEp(t)<=epNow()&&t.req.every(requirement=>tech(requirement))&&(!t.gate||t.gate())}
// węzeł, o którym teraz mowa w dziedzinie: trwająca próba, potem kolejka, potem najbliższy próby (gra nie wybiera już sama, czego się uczyć)
function techTarget(d){const A=TECH.filter(t=>t.d===d&&techAvail(t));if(!A.length)return undefined;const B=(S.bad||[]).map(b=>TECH_BY[b.id]).find(t=>t&&t.d===d);if(B)return B;
 const Q=(S.bq||[]).map(id=>TECH_BY[id]).find(t=>t&&A.includes(t));if(Q)return Q;let best=A[0],bp=-1;for(const t of A){const p=(S.tp[t.id]||0)/t.xp;if(p>bp+1e-9){bp=p;best=t}}return best}
// doświadczenie z pracy: tag to fach (np. 'rybak') albo rodzaj nauki ('zwiad', 'czytanie'…); bez tagu liczy się jako ogólna nauka dziedziny
function techXp(d,v,tag){if(!S||!d||!S.tech)return;if(S.laws&&S.laws.wymiana)v*=1.15;S.dxp[d]=(S.dxp[d]||0)+v;if(typeof badPractice==='function')badPractice(tag||d,v)}
function techDone(t,quiet){if(S.tech[t.id])return;S.tech[t.id]=1;if(S.bq)S.bq=S.bq.filter(id=>id!==t.id);
 if(!quiet){log('Postęp ('+DOMS.find(d=>d[0]===t.d)[1].toLowerCase()+'): '+t.n+'. '+t.eff);toast('Postęp: '+t.n);sfx('bell')}
 if(t.id==='n_znaki'){tribe.forEach(s=>reveal(s.i,s.j,4));log('Znaki prowadzą do miejsc, gdzie dawny lud zostawił swoje ślady. Zaznaczono je na mapie.')}
 if(tab==='wiedza'||tab==='budowa')renderPanel()}
function techTick(){if(!S||!S.tech)return;TECH.forEach(t=>{if(t.sync&&!S.tech[t.id]&&t.sync())techDone(t,t.id==='r_ciesla')})}
function techState(t){if(S.tech[t.id])return'done';if(tEp(t)>epNow())return'ep';if(t.sync)return'sync';if(t.req.every(requirement=>tech(requirement)))return(!t.gate||t.gate())?'avail':'gate';return'lock'}
// 4.9.0-rc.23 mgła wiedzy: widać węzły dostępne i jeden rząd dalej; głębiej tylko nazwa z pytajnikiem, opis po poznaniu poprzednika
function techFog(t){if(S.tech[t.id]||techState(t)!=='lock')return false;return t.req.some(r=>{const q=TECH_BY[r];return q&&!tech(r)&&techState(q)==='lock'})}
let techDom='uprawa',techSel=null,techAll=false;
// układ: każda epoka to pas z nagłówkiem; ukończone dawne epoki zwijają się do jednej linii (techAll je rozwija)
function techLayout(d){const now=epNow(),all=TECH.filter(t=>t.d===d),eps=[...new Set(all.map(tEp))].sort((a,b)=>a-b);
 const shown=eps.filter(e=>e<=now&&(techAll||e===now||all.some(t=>tEp(t)===e&&!S.tech[t.id]))),folded=eps.filter(e=>e<now&&!shown.includes(e));
 const RH=88,HD=26,pos={};let y=0;
 for(const e of shown){const L=all.filter(t=>tEp(t)===e),rs=[...new Set(L.map(t=>t.r))].sort((a,b)=>a-b);pos['ep'+e]=y;y+=HD;rs.forEach((r,k)=>L.filter(t=>t.r===r).forEach(t=>pos[t.id]=y+k*RH));y+=rs.length*RH}
 return{now,all,shown,folded,next:eps.find(e=>e>now),list:all.filter(t=>shown.includes(tEp(t))),pos,H:y,RH,HD}}
function techHTML(){const d=techDom;const Lo=techLayout(d),list=Lo.list,W=300;
 const cur=techTarget(d);const dd=DOMS.find(x=>x[0]===d);
 let h=`<div class="dchips">${DOMS.map(x=>{const n=TECH.filter(t=>t.d===x[0]&&tEp(t)<=Lo.now),k=n.filter(t=>S.tech[t.id]).length;return`<button data-dom="${x[0]}" class="${x[0]===d?'on':''}">${x[1]}<small>${k}/${n.length}</small></button>`}).join('')}</div>`;
 h+=`<p class="lead">${dd[2]} Wiedzę zdobywa się dopiero próbą, którą wybierasz.</p>`;
 if(typeof badPanelHTML==='function')h+=badPanelHTML();
 if(Lo.folded.length)h+=`<button class="tfold" data-tall="1">${Lo.folded.map(e=>EP_N[e]).join(', ')}: wszystko poznane (${Lo.all.filter(t=>Lo.folded.includes(tEp(t))).length}). Pokaż</button>`;
 else if(techAll&&Lo.shown.length>1)h+=`<button class="tfold" data-tall="0">Zwiń poznane epoki</button>`;
 const cx=c=>(c+.5)*W/3;
 let svg=`<svg class="tlines" viewBox="0 0 ${W} ${Lo.H}" preserveAspectRatio="none">`;
 list.forEach(t=>t.req.forEach(r=>{const p=TECH_BY[r];if(!p||p.d!==d||Lo.pos[r]===undefined)return;const on=S.tech[r],y0=Lo.pos[r]+42,y1=Lo.pos[t.id]+2;svg+=`<path d="M${cx(p.c)} ${y0} C${cx(p.c)} ${y0+16},${cx(t.c)} ${y1-14},${cx(t.c)} ${y1}" class="${on?'on':''}"/>`}));svg+='</svg>';
 h+=`<div class="tree" style="height:${Lo.H}px">${svg}`;
 Lo.shown.forEach(e=>{const L=Lo.all.filter(t=>tEp(t)===e),k=L.filter(t=>S.tech[t.id]).length;h+=`<div class="tep" style="top:${Lo.pos['ep'+e]}px">${EP_N[e]}<small>${k} z ${L.length}</small></div>`});
 list.forEach(t=>{const st=techState(t);const bs=st==='avail'&&typeof badState==='function'?badState(t):'';const ext=t.req.filter(r=>TECH_BY[r].d!==d).map(r=>TECH_BY[r].n);
  const pc=st==='avail'&&typeof badFeel==='function'?Math.round(100*badFeel(t)):0;
  const tag=st==='done'?'<span class="ts">✓ poznane</span>':st==='sync'?'<span class="ts">próba / księga</span>':st==='gate'?'<span class="ts">warunek</span>':st==='lock'?`<span class="ts">${ext.length?'też: '+ext.join(', '):'zablokowane'}</span>`:
   bs==='bada'?`<span class="ts">próba ${Math.round(100*badProg(t))}%</span>`:bs==='kol'?'<span class="ts">w kolejce</span>':bs==='ready'?'<span class="ts">można próbować</span>':`<span class="tb"><i style="width:${pc}%"></i></span>`;
  const fog=techFog(t);h+=`<button class="tn ${st}${fog?' fog':''}${bs?' b-'+bs:''}${techSel===t.id?' sel':''}${bs==='bada'?' cur':''}" data-tn="${t.id}" style="left:calc(${t.c*33.333}% + 3px);top:${Lo.pos[t.id]}px">
  <span class="tt">${t.n} ${fog?'?':''}</span>${fog?'<span class="ts">nieznane</span>':tag}</button>`});
 h+='</div>';
 if(Lo.next&&Lo.next<4){const L=Lo.all.filter(t=>tEp(t)===Lo.next);if(L.length)h+=`<div class="card tnext"><h4>${EP_N[Lo.next]}</h4><p class="mut">Gdy osada dojdzie do tej epoki, w tej dziedzinie będzie można poznać: ${L.map(t=>t.n).join(', ')}.</p></div>`}
 const t=techSel&&TECH_BY[techSel]&&TECH_BY[techSel].d===d?TECH_BY[techSel]:cur||list.find(x=>!S.tech[x.id])||list[0];
 if(t&&techFog(t)){h+=`<div class="card tdet"><h4>${t.n} ?</h4><p class="mut">Nikt jeszcze nie wie, jak to wygląda ani co da. Więcej będzie wiadomo, gdy osada pozna: ${t.req.filter(r=>!tech(r)).map(r=>TECH_BY[r].n).join(', ')}.</p></div>`}
 else if(t){const st=techState(t);h+=`<div class="card tdet"><h4>${t.n}</h4><p>${t.desc}</p><p><b style="color:var(--gold2)">Daje:</b> ${t.eff}</p>`;
  if(t.req.length)h+=`<p class="mut">Wymaga: ${t.req.map(r=>(S.tech[r]?'✓ ':'')+TECH_BY[r].n).join(', ')}</p>`;
  if(st==='done')h+='<p class="ok">Osada to już umie.</p>';
  else if(st==='sync')h+=`<p class="mut">${t.gt()}</p>`;
  else if(st==='ep')h+=`<p class="mut">Przyjdzie z epoką: ${EP_N[tEp(t)]}.</p>`;
  else if(st==='avail'||st==='gate'){if(st==='gate')h+=`<p class="mut">${t.gt()}</p>`;if(typeof badNodeHTML==='function')h+=badNodeHTML(t)}
  else h+='<p class="mut">Najpierw trzeba poznać to, co wyżej.</p>';h+='</div>'}
 return h}
