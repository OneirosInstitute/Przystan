/* ================= ikony ================= */
const IC={
 zywnosc:'<circle cx="8" cy="14" r="3.2"/><circle cx="14" cy="15" r="3.2"/><circle cx="11" cy="9" r="3.2"/><path d="M11 6c0-2 1-3 3-3"/>',
 drewno:'<rect x="3" y="8" width="15" height="8" rx="2"/><ellipse cx="18" cy="12" rx="2.6" ry="4"/><path d="M6 11h6M7 14h5"/>',
 opal:'<path d="M4 20l16-5M4 15l16 5"/><path d="M12 3c1 3 3.5 4 3.5 6.5a3.5 3.5 0 01-7 0c0-1.5.7-2.3 1.3-3 .2 1.3.9 2 1.7 2 0-2-.6-3.6.5-5.5z"/>',
 kamien:'<path d="M4 17l2-7 5-4 6 2 3 6-3 4H7z"/><path d="M11 6l1 5 5 3"/>',
 glina:'<path d="M4 15c0-4 4-7 8-7s8 3 8 7c0 2-4 3-8 3s-8-1-8-3z"/><path d="M8 12c2 1 6 1 8 0"/>',
 deski:'<path d="M3 7h18M3 12h18M3 17h18"/><path d="M7 7v10M17 7v10" opacity=".5"/>',
 gwozdzie:'<path d="M8 4h8M12 4v14l-1.5 2"/><path d="M15 9h4M15 13h4" opacity=".6"/>',
 plotno:'<path d="M4 6c3-2 5 2 8 0s5-2 8 0v12c-3-2-5 2-8 0s-5-2-8 0z"/>',
 cegla:'<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 12h18M9 6v6M15 12v6"/>',
 skory:'<path d="M7 4l2.5 2.5h5L17 4l2 6-2 2 1 8H6l1-8-2-2z"/>',
 odziez:'<path d="M8 4L4 7l2 4 2-1v10h8V10l2 1 2-4-4-3c-1 2-2 3-4 3S9 6 8 4z"/>',
 narz:'<path d="M4 20l9-9"/><path d="M11.5 5.5l7 7-3 3-7-7z"/>',
 osada:'<path d="M3 20V10l5-4 5 4v10"/><path d="M13 20v-7l4-3 4 3v7"/><path d="M3 20h18"/>',
 praca:'<path d="M14 4l6 6-3 1-4-4z"/><path d="M13 7L4 16l2 2 9-9"/>',
 budowa:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
 wiedza:'<path d="M4 5c3-1 6-1 8 1v14c-2-2-5-2-8-1z"/><path d="M20 5c-3-1-6-1-8 1v14c2-2 5-2 8-1z"/>',
 ludzie:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6"/><path d="M15 15c3 0 6 1.5 6 5"/>',
 kronika:'<path d="M6 4h11a2 2 0 012 2v12a2 2 0 01-2 2H7"/><path d="M6 4a2 2 0 00-2 2v1h4"/><path d="M8 4v14a2 2 0 01-2 2"/><path d="M11 9h5M11 13h5"/>',
 cieplo:'<path d="M12 3c1 4 5 6 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
 zdrowie:'<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
 nadzieja:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 fs:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 fsx:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
 inst:'<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>',
 woda:'<path d="M12 3c3.5 5 6 8 6 11a6 6 0 01-12 0c0-3 2.5-6 6-11z"/>',
 niezgoda:'<path d="M4 8h9l-3-3M20 16h-9l3 3"/><path d="M13 8l7 0M4 16h7" opacity=".4"/>',
 fire:'<path d="M12 3c1 4 6 6 6 11a6 6 0 01-12 0c0-3 2-4.5 3-6 .5 2 1.5 3 2.5 3 0-3-1-5.5.5-8z"/>',
 rada:'<path d="M6 4h10a2 2 0 012 2v14H8a2 2 0 01-2-2z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 up:'<path d="M12 19V6M6 12l6-6 6 6"/>',
 eye:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
 isl:'<path d="M3 15c2-1 3-4 6-5s4 1 6 0 4-3 6-1"/><path d="M4 19c2.5 1 5 1 8 0s5.5-1 8 0" opacity=".6"/><path d="M9 10V6l3 1.5L9 9"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
 cloud:'<path d="M7 18h10a4 4 0 00.5-8 6 6 0 00-11.3 1.5A3.3 3.3 0 007 18z"/>',
 rain:'<path d="M7 14h10a4 4 0 00.5-8 6 6 0 00-11.3 1.5A3.3 3.3 0 007 14z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
 snow:'<path d="M7 14h10a4 4 0 00.5-8 6 6 0 00-11.3 1.5A3.3 3.3 0 007 14z"/><path d="M8 18h.01M12 20h.01M16 18h.01M10 22h.01M14 22h.01"/>',
 fog:'<path d="M4 9h16M3 13h18M5 17h14M8 21h8"/>',
 storm:'<path d="M7 14h10a4 4 0 00.5-8 6 6 0 00-11.3 1.5A3.3 3.3 0 007 14z"/><path d="M12 14l-2 4h3l-2 4"/>',
 chev:'<path d="M6 9l6 6 6-6"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 pause:'<path d="M9 5v14M15 5v14"/>',
 zapasy:'<path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/>',
 rotl:'<path d="M4 9a8 8 0 1 1 1 7"/><path d="M4 4v5h5"/>',rotr:'<path d="M20 9a8 8 0 1 0-1 7"/><path d="M20 4v5h-5"/>',
 dom:'<circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',
 snd:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6M19 6c3 3 3 9 0 12"/>',
 mute:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
 ruda:'<path d="M4 17l2-7 5-4 6 2 3 6-3 4H7z"/><circle cx="10" cy="12" r="1.2"/><circle cx="14.5" cy="10" r="1.2"/><circle cx="13" cy="15" r="1.2"/>',
 wegiel:'<path d="M5 16l3-7 6-2 5 5-2 6H8z"/><path d="M9 12l3 2 3-3"/>',
 wlokna:'<path d="M6 4c4 4 4 12 0 16M12 4c4 4 4 12 0 16M18 4c-3 4-3 12 0 16"/>',
 miod:'<path d="M12 3l7 4v8l-7 4-7-4V7z"/><path d="M12 7l3.5 2v4L12 15l-3.5-2V9z"/>',
 ziola:'<path d="M12 21v-9"/><path d="M12 13c-4 0-6-3-6-6 3 0 6 2 6 6zM12 12c4 0 6-3 6-6-3 0-6 2-6 6z"/><circle cx="12" cy="5" r="1.6"/>',
 natura:'<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19l8-8"/>',
 wyprawy:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 ziarno:'<path d="M12 21V7"/><path d="M12 9c-2-1-3-3-3-5 2 0 3 2 3 5zM12 13c-2-1-3-3-3-5 2 0 3 2 3 5zM12 13c2-1 3-3 3-5-2 0-3 2-3 5zM12 17c2-1 3-3 3-5-2 0-3 2-3 5zM12 17c-2-1-3-3-3-5 2 0 3 2 3 5z"/>'
};
const ico=(k,cls)=>`<svg class="i${cls?' '+cls:''}" viewBox="0 0 24 24" aria-hidden="true">${IC[k]}</svg>`;

/* ================= stałe ================= */
const N=192, VW=N+1, DAY=240, SD=5, YEAR=20, K=96/YEAR, KF=K/2.4, SEAS=['Lato','Jesień','Zima','Wiosna'];
const T0=0.22, T1=0.80, SAVEKEY='przystan-v7';
const FOOD=['suchary','jagody','grzyby','ryby','mieso','ziarno','mleko','miod','warzywa','chleb','ser','kiszonki'];
const RN={suchary:'Suchary',jagody:'Jagody',grzyby:'Grzyby',ryby:'Ryby',mieso:'Mięso',drewno:'Kłody',opal:'Opał',kamien:'Kamień',glina:'Glina',deski:'Deski',gwozdzie:'Gwoździe',plotno:'Płótno',skory:'Skóry',odziez:'Odzież',narz:'Narzędzia żelazne',narzk:'Narzędzia kamienne',cegla:'Cegły',ziarno:'Ziarno',mleko:'Mleko',ruda:'Ruda darniowa',wegiel:'Węgiel drzewny',wlokna:'Włókna lnu',miod:'Miód',ziola:'Zioła',warzywa:'Warzywa',maka:'Mąka',chleb:'Chleb',ser:'Ser',kiszonki:'Kiszonki',naczynia:'Naczynia'};
const SPOIL={suchary:.004,jagody:.025,grzyby:.02,ryby:.035,mieso:.03,ziarno:.002,mleko:.09,miod:.0005,warzywa:.02,chleb:.02,ser:.004,kiszonki:.001};
const CN={drwal:'drwal',kamieniarz:'kamieniarz',zbieracz:'zbieracz',rybak:'rybak',mysliwy:'myśliwy',ciesla:'cieśla',murarz:'murarz',krawiec:'krawiec',kowal:'kowal',rolnik:'rolnik',hodowca:'hodowca'};
const LVL=[90,300,750,1500,2800];
const BD={
 szalas:{cat:'dom',n:'Szałas',w:2,h:2,cost:{drewno:8,plotno:2},work:6,house:5,fuel:1.4,d:'Dom dla jednej rodziny, do 5 osób. Słabo trzyma ciepło.'},
 chata:{cat:'dom',up:1,n:'Chata z bali',w:3,h:2,cost:{drewno:30,kamien:10,glina:8,gwozdzie:16},work:14,house:6,fuel:.8,d:'Ciepły dom dla rodziny do 6 osób. Pali prawie o połowę mniej opału.'},
 zbieracz:{cat:'jedzenie',n:'Chata zbieracza',w:2,h:2,cost:{drewno:12},work:5,wk:3,r:11,nodes:['bush','grzyb','zboze','len','ziola','ul'],c:'zbieracz',d:'Zbieracze zbierają jagody, grzyby, dzikie zboże i len w zasięgu. Z wiedzą także zioła i miód dzikich pszczół.'},
 mysliwy:{cat:'jedzenie',n:'Chata myśliwego',w:2,h:2,cost:{drewno:14},work:6,wk:2,r:16,c:'mysliwy',d:'Polowanie na sarny, kozy i dziki: mięso i skóry. Dzik potrafi zranić.'},
 zagroda:{cat:'uprawa',n:'Zagroda',w:3,h:3,cost:{drewno:24},work:8,wk:2,r:22,c:'hodowca',pen:1,need:'h_zagr',d:'Hodowcy oswajają dzikie kozy w zasięgu. Oswojone dają mleko i rodzą młode. Wilki polują na zagrody bez opieki.'},
 pole:{cat:'uprawa',n:'Pole',w:4,h:4,cost:{drewno:4},work:6,wk:3,c:'rolnik',need:'pole',field:1,d:'Siew wiosną lub na początku lata (10 ziarna), żniwa jesienią. Gleba męczy się po każdym zbiorze i odpoczywa, gdy pole leży odłogiem.'},
 pomost:{cat:'jedzenie',n:'Pomost rybacki',w:2,h:2,cost:{drewno:10,deski:6},work:6,wk:2,r:9,nodes:['fish'],c:'rybak',shore:1,d:'Stawia się na brzegu. Rybacy łowią w łowiskach w zasięgu.'},
 drwal:{cat:'surowce',n:'Chata drwala',w:2,h:2,cost:{drewno:8},work:4,wk:3,r:10,nodes:['tree'],c:'drwal',d:'Drwale ścinają drzewa w zasięgu. Las nie odrasta sam.'},
 lesnik:{cat:'surowce',n:'Leśniczówka',w:2,h:2,cost:{drewno:12},work:5,wk:2,r:10,c:'drwal',plant:1,d:'Leśniczy sadzi drzewa na pniakach. Las odrasta w około rok.'},
 kamien:{cat:'surowce',n:'Kamieniołom',w:2,h:2,cost:{drewno:10},work:5,wk:2,r:11,nodes:['rock'],c:'kamieniarz',d:'Kamieniarze zbierają kamień z odkrywek w zasięgu.'},
 ruda:{cat:'surowce',n:'Wykop rudy',w:2,h:2,cost:{drewno:10},work:5,wk:2,r:12,nodes:['ruda'],c:'kamieniarz',d:'Wydobywa rudę darniową z podmokłych łąk. Bez kuźni jest bezużyteczna.'},
 glinianka:{cat:'surowce',n:'Glinianka',w:2,h:2,cost:{drewno:8},work:4,wk:2,r:10,nodes:['clay'],c:'murarz',d:'Kopacze wydobywają glinę z odsłonięć w zasięgu.'},
 drewutnia:{cat:'rzemioslo',n:'Drewutnia',w:2,h:2,cost:{drewno:10},work:5,wk:2,c:'drwal',prod:{in:{drewno:1},out:{opal:3},t:8,when:()=>S.res.opal<120},d:'Rąbie kłody na opał: z jednej kłody trzy porcje opału.'},
 pracownia:{cat:'rzemioslo',n:'Pracownia cieśli',w:2,h:2,cost:{drewno:14,kamien:4},work:6,wk:2,c:'ciesla',prod:{in:{drewno:3},out:{deski:2},t:14,when:()=>S.res.deski<80},d:'Piłuje kłody na deski. Deski z wraku kiedyś się skończą.'},
 mielerz:{cat:'rzemioslo',n:'Mielerz',w:2,h:2,cost:{drewno:10,glina:6},work:5,wk:1,c:'drwal',prod:{in:{drewno:3},out:{wegiel:2},t:20,when:()=>S.res.wegiel<40},d:'Wypala węgiel drzewny dla kuźni.'},
 kuznia:{cat:'rzemioslo',n:'Kuźnia',w:2,h:2,cost:{kamien:20,glina:10,deski:8},work:12,wk:2,c:'kowal',need:'kuznia',prod:[{in:{ruda:3,wegiel:2},out:{narz:1},t:30,when:()=>S.res.narz<10},{in:{ruda:1,wegiel:1},out:{gwozdzie:10},t:14}],d:'Z rudy i węgla robi żelazne narzędzia, a gdy jest ich dość, gwoździe.'},
 warsztat:{cat:'rzemioslo',n:'Warsztat',w:2,h:2,cost:{drewno:16,kamien:8},work:7,wk:2,c:'ciesla',prod:{in:{kamien:1,drewno:1},out:{narzk:1},t:16,when:()=>S.res.narzk<12},d:'Robi kamienne narzędzia. Gorsze od żelaznych z wraku, ale własne.'},
 szwalnia:{cat:'rzemioslo',n:'Szwalnia',w:2,h:2,cost:{drewno:14,plotno:1},work:6,wk:1,c:'krawiec',prod:[{in:{skory:2},out:{odziez:1},t:18},{in:{wlokna:4},out:{plotno:1},t:16}],d:'Szyje ciepłą odzież ze skór, a z włókien lnu tka płótno.'},
 cegielnia:{cat:'rzemioslo',n:'Piec do cegły',w:2,h:2,cost:{kamien:15,glina:20,drewno:10},work:8,wk:2,c:'murarz',need:'cegla',prod:{in:{glina:10,drewno:6},out:{cegla:8},t:100},d:'Wypala cegły z gliny.'},
 sklad:{cat:'magazyn',n:'Skład',w:2,h:2,cost:{drewno:6},work:3,store:'all',cap:250,d:'Miejsce na wszystko. Ludzie odnoszą tu urobek zamiast iść do obozu.'},
 spizarnia:{cat:'magazyn',n:'Spiżarnia',w:2,h:2,cost:{drewno:12,deski:10,gwozdzie:20},work:8,store:'food',cap:700,d:'Chłodny magazyn żywności. Zapasy psują się o połowę wolniej.'},
 dom:{cat:'dom',n:'Dom z piecem',w:3,h:2,cost:{drewno:20,cegla:20,deski:16,gwozdzie:24,kamien:10},work:18,house:8,fuel:.45,need:'piec',d:'Dom z murowanym piecem i gontem. Mieści 8 osób, pali najmniej opału i rzadko się zapala. Najtaniej przez rozbudowę chaty.'},
 studnia:{cat:'wsp',n:'Studnia',w:1,h:1,cost:{kamien:12,drewno:4},work:6,d:'Czysta woda dla 14 osób. Bez niej latem pije się wodę ze strumienia i ludzie chorują. Przy pożarze to stąd noszą wiadra.'},
 cmentarz:{cat:'wsp',n:'Miejsce pamięci',w:2,h:2,cost:{kamien:6,drewno:6},work:5,d:'Groby otoczone płotem z wikliny. Daje osadzie spokój i pozwala uchwalić godny pochówek.'},
 laznia:{cat:'wsp',n:'Łaźnia',w:2,h:2,cost:{drewno:20,kamien:12},work:8,d:'Parowa łaźnia z kamiennym piecem. Ludzie zdrowieją, rośnie nadzieja. Pali opał.'},
 wieza:{cat:'wsp',n:'Strażnica',w:1,h:1,cost:{drewno:16,deski:6},work:7,d:'Z góry widać daleko: odsłania okolicę, wcześniej widać dym pożaru i wilki przy zagrodach.'},
 domwsp:{cat:'wsp',n:'Chata wiecowa',w:4,h:2,cost:{drewno:40,deski:16,kamien:10,gwozdzie:20},work:20,d:'Długa chata na wiece, obrzędy i zimowe wieczory. Mniej sporów, więcej nadziei, wiec zmienia obyczaje łagodniej.'},
 izbanauki:{cat:'wsp',n:'Izba nauki',w:2,h:2,cost:{drewno:16,deski:10,gwozdzie:8},work:10,need:'n_szk',d:'Tu starsi uczą dzieci. Dzieci podpatrują fach szybciej, osada szybciej się rozwija.'},
 izbachorych:{cat:'wsp',n:'Chata zielarki',w:2,h:2,cost:{drewno:14,deski:8,plotno:4},work:9,need:'n_opat',d:'Posłania, czyste płótno, zioła pod strzechą. Ciężko chorzy i ranni zdrowieją dużo szybciej.'},
 pasieka:{cat:'jedzenie',n:'Barć',w:2,h:2,cost:{drewno:10,deski:4},work:5,wk:1,c:'zbieracz',need:'u_bart',prod:{in:{},out:{miod:2},t:30,when:()=>S.res.miod<60&&seasonIdx()!==2},d:'Wydrążone kłody zawieszone wysoko na drzewach przy osadzie. Miód bez szukania dzikich rojów po lesie, oprócz zimy.'},
 ogrodziol:{cat:'jedzenie',n:'Ogród ziołowy',w:2,h:2,cost:{drewno:8},work:4,wk:1,c:'zbieracz',need:'u_ziel',prod:{in:{},out:{ziola:2},t:25,when:()=>S.res.ziola<40&&seasonIdx()!==2},d:'Grządki krwawnika, dziurawca i mięty. Zioła rosną pod ręką, oprócz zimy.'},
 zarna:{cat:'przetw',n:'Żarna',w:2,h:2,cost:{kamien:14,drewno:8},work:6,wk:1,c:'rolnik',need:'pole',prod:{in:{ziarno:6},out:{maka:5},t:14,when:()=>S.res.maka<60&&S.res.ziarno>=6+10*S.bld.filter(b=>b.field).length},d:'Dwa kamienie obracane ręką pod daszkiem. Mielą ziarno na mąkę, a ziarno na siew zostaje nietknięte.'},
 piekarnia:{cat:'przetw',n:'Piec chlebowy',w:2,h:2,cost:{glina:16,kamien:10,drewno:6},work:8,wk:1,c:'rolnik',need:'pole',prod:{in:{maka:4,opal:1},out:{chleb:7},t:16,when:()=>S.res.chleb<80},d:'Gliniany piec na kamiennej podmurówce. Z mąki i odrobiny opału wypieka chleb: z tego samego ziarna wychodzi prawie półtora raza więcej jedzenia.'},
 serownia:{cat:'przetw',n:'Serownia',w:2,h:2,cost:{drewno:12,deski:4,kamien:4},work:6,wk:1,c:'hodowca',need:'h_zagr',prod:{in:{mleko:6},out:{ser:3},t:14,when:()=>S.res.ser<60},d:'Mleko psuje się w dwa dni, a ser leży miesiącami. Zamienia mleko kóz w zapas na zimę.'},
 garncarnia:{cat:'rzemioslo',n:'Garncarnia',w:2,h:2,cost:{drewno:10,glina:8,kamien:6},work:6,wk:1,c:'murarz',need:'r_garn',prod:{in:{glina:4,opal:2},out:{naczynia:2},t:18,when:()=>S.res.naczynia<40},d:'Koło garncarskie i mały piec. Garnki i dzbany z pokrywą: im więcej naczyń w osadzie, tym wolniej psuje się jedzenie (do 30%). Potrzebne do kiszenia.'},
 kiszarnia:{cat:'przetw',n:'Komora kiszonek',w:2,h:2,cost:{drewno:10,deski:6,kamien:8},work:7,wk:1,c:'zbieracz',need:'r_garn',prod:[{in:{warzywa:6,naczynia:1},out:{kiszonki:6},t:12,when:()=>S.res.kiszonki<90},{in:{grzyby:6,naczynia:1},out:{kiszonki:5},t:12,when:()=>S.res.kiszonki<90}],d:'Ziemianka z beczkami. Kapusta, ogórki i grzyby w solance przetrwają całą zimę.'},
 gaj:{cat:'wsp',n:'Święty gaj',w:2,h:2,cost:{kamien:8,plotno:1},work:4,d:'Stary dąb za osadą, krąg kamieni i wstążki na gałęziach. Nie ma w nim mocy, ale ludzie w niego wierzą: obrzędy dają więcej, wiec zmienia obyczaje łagodniej, mniej sporów.'},
 piec:{cat:'dom',n:'Piec zduński',w:2,h:2,cost:{cegla:24,glina:12},work:10,need:'piec',d:'Lepszy piec: domy palą mniej opału, a nadmiar żywności się suszy.'}
};
const BKEYS=Object.keys(BD);
const CATS=[['dom','Domy'],['jedzenie','Jedzenie'],['uprawa','Pola i stada'],['przetw','Przetwórstwo'],['surowce','Surowce'],['rzemioslo','Rzemiosło'],['magazyn','Magazyny'],['wsp','Wspólnota']];
const TIERS=[['Obóz',0,0],['Osada',4,20],['Wieś',8,32],['Przystań',14,50]];
const TRIBE=[
 ['Naczynka w skale','W szczelinie skały stoi kilka małych glinianych naczynek, zalepionych woskiem. W środku sucha, gorzko pachnąca mieszanka. Nikt nie wie, do czego służyła.'],
 ['Krzemienne groty','Pod skalnym nawisem leżą krzemienne groty, cienkie i ostre jak liść, z wcięciami u nasady. Obok spróchniały kawałek cisu, lekko wygięty. Ładne, ale na co komu kamienie, skoro mamy żelazo z wraku.'],
 ['Malowana skała','Na gładkiej skale ktoś namalował ochrą rośliny: liście, kłącza, korzenie. Przy jednych odcisk dłoni, inne przekreślone. Nikt nie umie tego odczytać.'],
 ['Dół z czerwonymi skorupami','Płytki dół wyłożony kamieniami, pełen popiołu i czerwonych skorup. Obok kupka gliny, zeschłej na kamień. Ktoś tu coś palił, wiele razy.'],
 ['Kamienie z otworem','Na płyciźnie przy ujściu strumienia leżą płaskie kamienie z wywierconym otworem, ułożone w równym rzędzie, jakby coś je kiedyś łączyło.'],
 ['Kamień z wgłębieniem','Płaski kamień z gładkim wgłębieniem i otoczak wytarty od używania. W szczelinach zwęglone ziarna, drobne jak u dzikiej trawy.'],
 ['Kamienny okół','Krąg z ułożonych płasko kamieni, z wąskim wejściem. W środku kości kóz, młodych i starych, i strzępy rzemieni.'],
 ['Zdziczały sad','Stare, pokręcone jabłonie i grusze rosną w równych rzędach, choć dokoła jest puszcza. Pod najstarszą jabłonią porośnięty kopiec z płaskim kamieniem.']];
const TRAITS={Wytrwały:['Wytrwała','pracuje o 10% wydajniej'],Silny:['Silna','szybciej przy ciężkiej pracy'],Dociekliwy:['Dociekliwa','uczy się o 25% szybciej'],Ostrożny:['Ostrożna','rzadziej odnosi rany'],Uparty:['Uparta','próby udają się częściej'],Nauczyciel:['Nauczycielka','uczniowie przy nim uczą się szybciej'],Pogodny:['Pogodna','podnosi nadzieję osady'],Cierpliwy:['Cierpliwa','lepiej znosi głód i zimno']};
const TKEYS=Object.keys(TRAITS);
const WEATHER={frost:['siarczysty mróz',.8,-12],clear:['pogodnie',1,0],rain:['deszcz',.75,-2],fog:['mgła',.88,-1],storm:['sztorm',.5,-5],drought:['upał',.92,4],snow:['śnieg',.7,-5]};
const WROLL=[[['clear',.55],['rain',.2],['fog',.15],['drought',.1]],[['clear',.35],['rain',.3],['fog',.2],['storm',.15]],[['snow',.38],['clear',.28],['frost',.14],['fog',.1],['storm',.1]],[['clear',.4],['rain',.35],['fog',.25]]];
const BOOKS={ciesla:'Podręcznik ciesielki',zdun:'Fragmenty podręcznika zduńskiego',dziennik:'Dziennik okrętowy',kowal:'Mistrzowska księga kowalska',siew:'O siewie i gospodarstwie'};
const WRECK0=[{n:'Pokład',open:1,need:0,items:{deski:50,plotno:6,wlokna:12,narz:2}},{n:'Ładownia rufowa',open:0,need:40,items:{narz:8,gwozdzie:160,ziarno:30,odziez:8}},{n:'Kajuta kapitana',open:0,need:30,items:{ks_kowal:1,ks_siew:1,narz:2}},{n:'Zalana ładownia dziobowa',open:0,need:80,items:{deski:60,gwozdzie:80,skory:6,suchary:40}}];
const ANIMAL={sarna:['sarny',6,7,1],koza:['kozy',7,5,1],dzik:['dziki',5,10,2],wilk:['wilki',4,0,0],zajac:['zające',6,2,1],lis:['lisy',3,1,2],foka:['foki',5,12,2],niedzwiedz:['niedźwiedź',2,30,4]};
const NAMES={k:['Dobrawa','Radomira','Mila','Wiesława','Bogumiła','Ludmiła','Jarosława','Zdzisława','Sławomira','Bożena','Dobromiła','Wszebora','Świętosława','Jagna','Mira','Lubomira','Wanda','Bogna','Danuta','Mścisława'],m:['Bożydar','Dobromir','Radosław','Wojsław','Mirosław','Lubomir','Sławomir','Bogdan','Zbysław','Przemysł','Racibor','Ziemowit','Siemowit','Mieszko','Bolko','Mirek','Wit','Ostoja','Dobrosław','Gniewko']};

