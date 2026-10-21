
/* ================= 4.8.0 Wieczory i noce: o czym mówią ludzie ================= */
// Zdania składają się z tego, co ludzie naprawdę przeżyli (dzień, wspomnienia, bliscy), z usposobienia, stanu osady,
// pory roku, epoki i wierzeń. Osada pamięta ostatnie tematy i szablony, więc te same słowa nie wracają co wieczór.
// Składnia: {A} mówiący, {B} drugi człowiek, {Bg} dopełniacz imienia B, [on|ona] forma mówiącego, <on|ona> forma B, {x} zmienna z v().
const W_AD=A=>A.age>=14,W_KID=A=>A.age>=5&&A.age<12,W_OLD=A=>A.age>=50;
const wTop=A=>{const z=A.dzn;if(!z||z.d!==Math.floor(S.day))return null;let b=null,bv=0;for(const c in z.w)if(z.w[c]>bv){bv=z.w[c];b=c}return bv>8?b:null};
const wDid=c=>A=>W_AD(A)&&wTop(A)===c;
const wGot=(r,q)=>A=>W_AD(A)&&A.dzn&&A.dzn.d===Math.floor(S.day)&&(A.dzn.g[r]||0)>=q;
const wFriend=A=>{const f=friendsOf(A).filter(q=>q.age>=5);return f.length?f[(Math.random()*f.length)|0]:null};
const wRival=A=>{const r=rivalsOf(A);return r[0]||null};
const wMate=A=>A.pair!==null&&A.pair!==undefined?pById(A.pair):null;
const wKidOf=A=>{const k=S.people.filter(q=>(q.par||[]).includes(A.id)&&q.age<12);return k.length?k[(Math.random()*k.length)|0]:null};
const wAny=A=>{const L=S.people.filter(q=>q!==A&&q.age>=14&&q.job!=='wyp');return L.length?L[(Math.random()*L.length)|0]:null};
const wSea=s=>()=>seasonIdx()===s,wWx=(...k)=>()=>k.includes(S.weather.k),wEp=e=>()=>epNow()===e;
const wSong=()=>{const L=(S.songs||[]).map(s=>Array.isArray(s)?s[0]:s&&s.t).filter(Boolean);return L.length?L[(Math.random()*L.length)|0]:null};
const ZWIERZ=[['lisicę z młodymi pod skarpą','czaplę nad strumieniem','zaskrońca wygrzanego na kamieniu','sarnę z koźlęciem','dzięcioła na starej olszy','orła nad graniem','wydrę przy brodzie'],
 ['klucz żurawi nad zatoką','dzika ryjącego w żołędziach','wiewiórkę z orzechem w pyszczku','jeża pod liśćmi','jelenia, co ryczał na rykowisku','stado szpaków nad polem'],
 ['tropy wilka przy samej drodze','gila na jarzębinie','zająca bielutkiego jak śnieg','kunę na płocie','łosia w olszynie','kruka, co krakał z dachu stodoły'],
 ['bociana na mokrej łące','żaby w rowie przy polu','pierwszego motyla','kosa przy gnieździe','skowronka nad ugorem','borsuka z norą pod sosną']];
const JADLO=()=>{const r=S.res,L=[];if((r.ryby||0)>5)L.push('zupa rybna z koprem','pieczone ryby na kiju');if((r.mieso||0)>5)L.push('mięso duszone z jałowcem','kiełbasa z ognia');if((r.grzyby||0)>3)L.push('żur z grzybami','grzyby smażone na łoju');
 if((r.jagody||0)>3)L.push('jagody z miodem','kisiel z jagód');if((r.warzywa||0)>3)L.push('kapuśniak','rzepa pieczona w popiele');if((r.chleb||0)>1)L.push('świeży chleb z masłem');if((r.ser||0)>1)L.push('twaróg z ziołami');if((r.ziarno||0)>5||(r.maka||0)>3)L.push('kasza ze skwarkami','placki z mąki');
 if(!L.length)L.push('polewka z pokrzyw','zupa z tego, co było');return L};
const OGIEN=['iskry lecą prosto do gwiazd','w żarze widać zamki i smoki','dym pachnie jałowcem','ogień trzaska jak ktoś, kto chce coś powiedzieć','płomień kładzie się od wiatru, a potem wstaje'];
const NIEBO=['Wóz stoi nad borem','Droga Mleczna to ślad, którym dusze idą do Wyraju','gwiazda spadła nad zatoką','Kosy, trzy gwiazdy w rządku, już wysoko','księżyc ma dziś obwódkę'];
const PRZYSL=[['„Gdy w lipcu upał, w zimie mróz.”','„Czerwiec stały, grudzień doskonały.”','„Jak deszcz na żniwa, to i chleba mniej bywa.”'],
 ['„Gdy październik ciepło trzyma, zwykle mroźna bywa zima.”','„Pierwszy śnieżek w błoto pada, słabą zimę zapowiada.”','„Jarzębiny dużo, zima będzie srogo.”'],
 ['„Mroźne Gody, wczesne wody.”','„Gdy w Gromniczną z dachów ciecze, zima jeszcze się przewlecze.”','„Luty stały, latem upały.”'],
 ['„Suchy kwiecień, mokry maj, będzie żyto jak gaj.”','„Majowe błoto więcej niż złoto.”','„Kwiecień, gdy deszczem plecie, maj wystroi kwieciem.”']];
const LEGENDY=['Droga Mleczna to ptasia droga do Wyraju, ciepłego kraju za morzem','spadająca gwiazda to dusza, która właśnie rodzi się na ziemi','tęcza pije wodę z morza i oddaje ją deszczem','pierwszy chleb z nowego ziarna trzeba podzielić z ptakami','w noc Kupały drzewa rozmawiają ze sobą','kto zabije pająka, ten zgasi szczęście w domu'];
const PRACA_OG=['Ręce wiedzą, co robić, nawet jak głowa śpi.','Byle zdrowie było, robota się znajdzie.','Kto rano wstaje, temu bogowie dają.','Najgorsze pierwsze sto razy. Potem już tylko bolą plecy.'];
const TALK=[
 // ---------- dzisiejszy dzień ----------
 {k:'drwal1',t:'dzien',a:wDid('drwal'),x:['Dziś padł taki dąb, że ziemia jęknęła. Ręce mi jeszcze drżą.','Cały dzień z siekierą. Wieczorem słyszę ją we śnie.','Las pachnie żywicą po każdym cięciu. Lubię ten zapach, choć plecy go nie lubią.']},
 {k:'drwal2',t:'dzien',a:wDid('drwal'),b:wAny,x:['{B} pyta, czemu ścinam od tej strony. Bo wiatr, mówię. Wiatr zawsze wie, gdzie drzewo ma paść.','Dziś pod korą znalazłem gniazdo szerszeni. Uciekałem szybciej niż kiedykolwiek. || Dziś pod korą znalazłam gniazdo szerszeni. Uciekałam szybciej niż kiedykolwiek.']},
 {k:'kamien1',t:'dzien',a:wDid('kamieniarz'),x:['Kamień ma swoje żyły jak drewno. Trzeba tylko trafić klinem.','Dzisiaj łupałem tak długo, że zęby mi dzwonią. || Dzisiaj łupałam tak długo, że zęby mi dzwonią.','Pod skałą była zimna woda. Piłem z dłoni jak dziecko. || Pod skałą była zimna woda. Piłam z dłoni jak dziecko.']},
 {k:'zbier1',t:'dzien',a:wDid('zbieracz'),x:['Kosz pełny do brzegu. Jagody same wchodziły do ręki.','W lesie trafiłem na polanę pełną grzybów. Nikomu nie powiem gdzie. || W lesie trafiłam na polanę pełną grzybów. Nikomu nie powiem gdzie.','Pokrzywy poparzyły mi ręce, ale zupa z nich będzie dobra.']},
 {k:'zbier2',t:'dzien',a:A=>wDid('zbieracz')(A)&&seasonIdx()===1,x:['Jesień w lesie jest najhojniejsza. Byle przed przymrozkiem zdążyć.','Orzechy sypią się z leszczyny. Wiewiórki były szybsze, ale i dla nas zostało.']},
 {k:'rybak1',t:'dzien',a:wDid('rybak'),x:['Morze było dziś spokojne jak misa mleka. Ryba sama szła.','Sieć wróciła pusta, a potem pełna. Morze lubi się droczyć.','Mewa ukradła mi rybę prosto z łodzi. Bezczelna.']},
 {k:'rybak2',t:'dzien',a:wGot('ryby',12),x:['Pełna sieć dzisiaj. Takiego połowu dawno nie było.','Ryb tyle, że ledwo doniosłem. Starczy na kilka wieczerzy. || Ryb tyle, że ledwo doniosłam. Starczy na kilka wieczerzy.']},
 {k:'mysl1',t:'dzien',a:wDid('mysliwy'),x:['Szedłem za tropem do zmroku. Jeleń był mądrzejszy. || Szłam za tropem do zmroku. Jeleń był mądrzejszy.','Dzik patrzył na mnie zza krzaka, a ja na niego. Obaj udawaliśmy, że się nie boimy. || Dzik patrzył na mnie zza krzaka, a ja na niego. Oboje udawaliśmy, że się nie boimy.','Las mówi, kiedy ktoś w nim jest. Trzeba tylko słuchać.']},
 {k:'mysl2',t:'dzien',a:wGot('mieso',6),x:['Dziś będzie mięso w kotle. Dziękuję lasowi, nie sobie.','Upolowałem sarnę. Skórę oddam garbarzowi, róg zostawię dla dzieci. || Upolowałam sarnę. Skórę oddam garbarzowi, róg zostawię dla dzieci.']},
 {k:'ciesla1',t:'dzien',a:wDid('ciesla'),x:['Dziś postawiliśmy krokwie. Z daleka widać już kształt dachu.','Bal pasował jak ulał. Czasem drewno samo chce się złożyć.','Wbiłem sobie drzazgę pod paznokieć. Całe popołudnie przeklinałem. || Wbiłam sobie drzazgę pod paznokieć. Całe popołudnie przeklinałam.']},
 {k:'ciesla2',t:'dzien',a:A=>wDid('ciesla')(A)&&czRecent(/Ukończono/,0),x:['Skończone. Stoi i nie krzywi się. Jutro obejdę ją jeszcze raz dookoła.','Jeszcze pachnie świeżym drewnem. Każdy, kto przechodzi, dotyka ściany.']},
 {k:'murarz1',t:'dzien',a:wDid('murarz'),x:['Glina wszędzie: na rękach, we włosach, w uszach. Ale piec ciągnie.','Wypał się udał. Cegły dzwonią, kiedy się w nie stuknie.']},
 {k:'krawiec1',t:'dzien',a:wDid('krawiec'),x:['Szyję kożuch dla najmłodszych. Zima nie będzie pytać, czy zdążyłem. || Szyję kożuch dla najmłodszych. Zima nie będzie pytać, czy zdążyłam.','Igła z kości pęka, jak się za mocno ciągnie. Trzecią dziś złamałem. || Igła z kości pęka, jak się za mocno ciągnie. Trzecią dziś złamałam.']},
 {k:'kowal1',t:'dzien',a:wDid('kowal'),x:['Żelazo jest jak koń. Nie lubi, jak się je pogania.','Cały dzień przy ogniu, a i tak lubię usiąść przy tym wieczornym. Ten nie parzy.','Wykułem dziś nóż dla {B}. Ostry, że włos przetnie. || Wykułam dziś nóż dla {B}. Ostry, że włos przetnie.'],b:wAny,v:()=>({})},
 {k:'rolnik1',t:'dzien',a:wDid('rolnik'),x:['Ziemia dziś była ciężka i mokra. Za tydzień będzie jak puch.','Skowronek wisiał nad polem cały dzień. Dobry znak na plon.','Ręce mam czarne od ziemi do łokci. Tak ma być.']},
 {k:'rolnik2',t:'dzien',a:A=>wDid('rolnik')(A)&&seasonIdx()===1,x:['Snopy stoją w polu jak ludzie w szeregu. Jeszcze dzień i zwozimy.','Ostatni kłos zostawiłem dla ptaków. Tak robił mój ojciec. || Ostatni kłos zostawiłam dla ptaków. Tak robiła moja matka.']},
 {k:'hodow1',t:'dzien',a:wDid('hodowca'),x:['Najstarsza koza znowu przeskoczyła płot. Pół dnia ją goniłem. || Najstarsza koza znowu przeskoczyła płot. Pół dnia ją goniłam.','Kozy wiedzą, kto je lubi. Do mnie przychodzą same.']},
 {k:'awans',t:'dzien',a:A=>W_AD(A)&&A.dzn&&A.dzn.d===Math.floor(S.day)&&A.dzn.e.some(e=>e[0]==='awans'),x:['Coś mi się dziś udało, co nie wychodziło od tygodnia. Ręka wreszcie zrozumiała.','Stary {B} pokiwał głową nad moją robotą. Nic nie powiedział. Nie musiał.'],b:A=>S.people.filter(q=>q.age>=45&&q!==A)[0]||null},
 {k:'zmeczony',t:'dzien',a:A=>W_AD(A)&&A.dzn&&A.dzn.d===Math.floor(S.day)&&Object.values(A.dzn.w).reduce((a,b)=>a+b,0)>DAY*.4,x:['Nie czuję nóg. Zasnę, zanim głowa dotknie posłania.','Dziś robota nie chciała się skończyć. Jutro zacznę wolniej.']},
 // ---------- wspomnienia i rocznice ----------
 {k:'rocz',t:'pamiec',a:A=>W_AD(A)&&memAnniv(A).length>0,v:A=>{const m=memAnniv(A)[0],y=Math.round((Math.floor(S.day)-m[0])/YEAR);return{y:y===1?'rok':y+' '+lata(y),Y:y===1?'Rok':y+' '+lata(y),co:{slub:'braliśmy ślub',dziecko:'urodziło się nasze dziecko',smierc:`żegnaliśmy ${m[2]?acc(m[2]):'kogoś bliskiego'}`,dom:'pierwszy raz spaliśmy pod własnym dachem',wyprawa:'wracaliśmy z wyprawy',rana:gw(A,'leżałem z raną i myślałem','leżałam z raną i myślałam')+', że nie wstanę',mistrz:'pierwszy raz ktoś '+gw(A,'nazwał mnie mistrzem','nazwał mnie mistrzynią')}[m[1]]||'stało się coś, czego nie zapomnę'}},x:['{Y} temu o tej porze {co}. Dziwne, jak szybko to minęło.','Dziś mija {y} od dnia, kiedy {co}. Wciąż pamiętam zapach tamtego dnia.'],c:()=>true},
 {k:'zaloba',t:'pamiec',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='smierc'&&Math.floor(S.day)-m[0]<=5),v:A=>{const n=(A.mem.filter(m=>m[1]==='smierc').pop()[2])||'tamtego';return{n:gen(n)}},x:['Wciąż odwracam się, żeby coś powiedzieć do {n}. A tam nikogo.','Tu zawsze było miejsce dla {n}. Nikt nie chce go zająć.','Przy ogniu jest ciszej, odkąd zabrakło jednego głosu.']},
 {k:'zaloba2',t:'pamiec',a:A=>W_OLD(A)&&(S.zmarli||[]).length>0&&Math.random()<.5,v:()=>{const z=S.zmarli[(Math.random()*S.zmarli.length)|0];return{n:z[1],ng:gen(z[1])}},x:['Pamiętacie śmiech {ng} przy tym ogniu? Tak głośny, że psy szczekały.','Na Dziady postawię miskę i dla {n}. Niech wie, że nie zapomnieliśmy.']},
 {k:'slub1',t:'pamiec',a:A=>W_AD(A)&&wMate(A)&&A.wedDay!==undefined&&S.day-A.wedDay<YEAR,b:wMate,x:['Pół wsi tańczyło na naszym weselu. A {B} <deptał|deptała> mi po stopach.','Wciąż nie mogę uwierzyć, że {B} <powiedział|powiedziała> mi „tak”.']},
 {k:'dziecko1',t:'pamiec',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='dziecko'&&Math.floor(S.day)-m[0]<=YEAR/2),v:A=>({n:A.mem.filter(m=>m[1]==='dziecko').pop()[2]||'maleństwo'}),x:['Maleństwo złapało mnie dziś za palec. Mocno, jak kowal. Na imię ma {n}.','Nie śpię po nocach, bo {n} płacze. A jak nie płacze, to wstaję sprawdzić, czy oddycha.']},
 {k:'rana1',t:'pamiec',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='rana'&&Math.floor(S.day)-m[0]<=YEAR),x:['Noga jeszcze boli na zmianę pogody. Lepsza niż niejedna wróżka.','Blizna swędzi. Stara mówi, że to znaczy, że się goi.']},
 {k:'dom1',t:'pamiec',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='dom'&&Math.floor(S.day)-m[0]<=YEAR/2),x:['Pierwsza zima pod własnym dachem. Słucham wiatru i nie boję się go.','W chacie pachnie żywicą i dymem. Tak pachnie dom.']},
 {k:'wypr1',t:'pamiec',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='wyprawa'),v:A=>({r:(A.mem.filter(m=>m[1]==='wyprawa').pop()[2])||'tamtej krainy'}),x:['Na wyprawie do {r} widziałem rzeczy, w które nikt mi nie wierzy. || Na wyprawie do {r} widziałam rzeczy, w które nikt mi nie wierzy.','Czasem śni mi się droga z {r}. Idę i idę, a ogień osady wciąż daleko.']},
 {k:'zjawa1',t:'wiara',w:2,a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='zjawa'&&Math.floor(S.day)-m[0]<=6),v:A=>({z:A.mem.filter(m=>m[1]==='zjawa').pop()[2]||'to'}),x:['Śmiejcie się, ale ja wiem, co [widziałem|widziałam]: {z}. Nie zapomnę tego do śmierci.','Od tamtej pory ({z}) nie chodzę tamtędy po zmroku.','Nie pytajcie mnie więcej o to ({z}). Nie chcę o tym mówić przy dzieciach.']},
 {k:'zjawa2',t:'wiara',a:A=>W_AD(A)&&!(A.mem||[]).some(m=>m[1]==='zjawa'),b:A=>{const L=S.people.filter(q=>q!==A&&(q.mem||[]).some(m=>m[1]==='zjawa'&&Math.floor(S.day)-m[0]<=6));return L[0]||null},v:(A,B)=>({z:B?B.mem.filter(m=>m[1]==='zjawa').pop()[2]:'to'}),x:['{B} opowiada, że <widział|widziała> to na własne oczy: {z}. Ja tam nie wierzę. Ale drzwi na noc zamykam.','Każdy już słyszał, co spotkało {Ba}: {z}. Dziwne rzeczy dzieją się na tej wyspie.']},
 {k:'radosc1',t:'pamiec',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='radosc'&&Math.floor(S.day)-m[0]<=2),v:A=>({r:A.mem.filter(m=>m[1]==='radosc').pop()[2]||'dzisiejszy dzień'}),x:['Długo będę pamiętać ten dzień: {r}.','Takie chwile jak ta ({r}) są warte każdej zimy.']},
 {k:'zalot1',t:'ludzie',w:1.6,a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='zalot'&&Math.floor(S.day)-m[0]<=8),b:A=>{const n=A.mem.filter(m=>m[1]==='zalot').pop()[2];return S.people.find(q=>q.name===n)||null},x:['Nie patrzcie tak na mnie. Nic nie mówię o {Bg}. Nic.','{B} ma takie oczy… Dobra, już nic nie mówię.','Jutro pójdę po wodę wtedy, kiedy chodzi {B}. Przypadkiem.']},
 {k:'klotnia1',t:'ludzie',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='klotnia'&&Math.floor(S.day)-m[0]<=4),v:A=>({b:gen(A.mem.filter(m=>m[1]==='klotnia').pop()[2]||'tamtego')}),x:['Może za ostro [powiedziałem|powiedziałam] do {b}. Może. Ale nie przeproszę [pierwszy|pierwsza].','Ta kłótnia chodzi za mną cały dzień jak pies.']},
 {k:'zgoda1',t:'ludzie',a:A=>W_AD(A)&&(A.mem||[]).some(m=>m[1]==='zgoda'&&Math.floor(S.day)-m[0]<=4),x:['Dobrze, że już po kłótni. Ciężko się nosi taki kamień.','Zgoda buduje, niezgoda rujnuje. Babka miała rację.']},
 // ---------- bliscy ----------
 {k:'przyj1',t:'ludzie',a:W_AD,b:wFriend,x:['Gdyby nie {B}, dawno bym się poddał. || Gdyby nie {B}, dawno bym się poddała.','{B} zawsze wie, kiedy mam zły dzień. Przychodzi i siada obok. Nic nie mówi.','Z {B} można konie kraść. No, kozy.']},
 {k:'riv1',t:'ludzie',a:W_AD,b:wRival,x:['{B} znowu <siadł|siadła> po drugiej stronie ognia. Niech siedzi.','Nie będę udawać, że lubię {Ba}. Ale pracuje uczciwie, to trzeba przyznać.','Z {B} się nie dogadam, choćby niebo spadło.']},
 {k:'mate1',t:'ludzie',a:W_AD,b:wMate,x:['{B} chrapie jak niedźwiedź w gawrze. Ale ciepło przy <nim|niej>.','Jak {B} <wraca|wraca> z pracy, cały dzień robi się lżejszy.']},
 {k:'kid1',t:'ludzie',a:W_AD,b:wKidOf,x:['{B} pyta, dlaczego gwiazdy nie spadają. A ja nie wiem.','{B} <chce|chce> być jak ja, jak dorośnie. Niech będzie lepsz<y|a>.','{B} <przyniósł|przyniosła> mi dziś kamień z dziurką. Ponoć na szczęście.']},
 {k:'kid2',t:'ludzie',a:A=>usp(A,'opiek')&&W_AD(A),x:['Dzieci znowu biegały nad wodą. Trzeba im powiedzieć o topielcu, to przestaną.','Mała ma gorące czoło. Dam jej naparu z lipy i niech śpi.']},
 // ---------- osada ----------
 {k:'glod',t:'osada',w:5,c:c=>c.days<4,a:W_AD,x:['W spiżarni coraz luźniej. Długo tak nie pociągniemy.','Kasza rzadka jak woda. Dzieci jedzą pierwsze, potem my.','Jutro trzeba wszystkich wysłać po jedzenie. Inaczej zima nas zje.']},
 {k:'opal',t:'osada',w:5,c:c=>(c.sea===1||c.sea===2)&&S.res.opal<30,a:W_AD,x:['Opału starczy na parę nocy. Trzeba iść z siekierą.','Ogień przygasa, a drewna mało. Śpimy w kożuchach.']},
 {k:'bezdom',t:'osada',w:4,c:()=>Object.values(S.fams).some(f=>!f.home&&famMembers(f.id).length),a:W_AD,x:['Nie wszyscy mają dach. Wstyd, póki choć jedna rodzina śpi pod niebem.']},
 {k:'chory',t:'osada',w:3,c:()=>S.people.some(p=>p.hp<.5),a:W_AD,b:()=>{const L=S.people.filter(p=>p.hp<.5);return L[(Math.random()*L.length)|0]},x:['{B} słabnie od kilku dni. Trzeba kogoś, kto zna się na ziołach.','[Zaniosłem|Zaniosłam] naparu do {Bg}. <Wypił|Wypiła> i <zasnął|zasnęła>. Może jutro będzie lepiej.']},
 {k:'klotnie',t:'osada',w:4,c:()=>(S.dis||0)>.5,a:W_AD,x:['Każdy ciągnie w swoją stronę. Tak się nie da żyć.','Na wiecu krzyczą coraz głośniej. Kiedyś ktoś kogoś uderzy.']},
 {k:'pelno',t:'osada',w:2,c:c=>c.days>14,a:W_AD,x:['Spichrz pełny. Pierwszy raz nie liczę worków przed snem.','Jest co jeść i jest gdzie spać. Czego więcej trzeba?','Tłusto w tym roku. Oby bogowie nie byli zazdrośni.']},
 {k:'budowa',t:'osada',w:2,c:()=>czRecent(/Ukończono/,1),a:W_AD,x:['Jeszcze jedna budowa skończona. Ręce bolą, ale było warto.','Wieś rośnie. Jak przyjdzie wiosna, nikt nie pozna tego brzegu.']},
 {k:'wesele',t:'osada',w:3,c:()=>czRecent(/wesel|ślub/,3),a:W_AD,x:['Dawno nie było tak wesoło jak na tym weselu.','Po weselu boli głowa, ale serce lekkie.']},
 {k:'narodz',t:'osada',w:3,c:()=>czRecent(/Rodzi się|urodził|narodziny/i,3),a:W_AD,x:['Nowe dziecko we wsi. Niech rośnie zdrowe i niech zna tylko dobre zimy.','Czerwona wstążka na rączce maleństwa. Żeby boginki nie podmieniły.']},
 {k:'las',t:'osada',w:2,c:()=>S.mark&&Object.keys(S.mark).length>8,a:W_AD,x:['Las przy obozie rzednie. Za parę lat po drewno trzeba będzie chodzić dalej.']},
 {k:'wrak',t:'osada',w:4,c:()=>!S.wreck.gone&&YEAR-5-Math.floor(S.day)<10&&YEAR-5-Math.floor(S.day)>0,a:W_AD,x:['Wrak długo nie wytrzyma. Morze już go szarpie.','Każdej nocy wrak trzeszczy głośniej. Jakby się z nami żegnał.']},
 {k:'nadzieja',t:'osada',w:2,c:c=>S.hope>.75&&c.days>8,a:W_AD,x:['Pierwszy raz od rozbicia myślę, że damy radę.','Patrzę na te chaty i nie wierzę, że to my postawiliśmy.']},
 {k:'cisza',t:'osada',w:.6,a:W_AD,x:['Cicho dziś. Tylko fale i ogień.','Plecy bolą, ale dach nad głową jest.','Ryby podchodzą pod brzeg. Jutro może być dobry połów.','Dobry dzień. Nic się nie stało, i dobrze.']},
 // ---------- pora roku, pogoda, przyroda ----------
 {k:'lato1',t:'pora',c:wSea(0),a:W_AD,x:['Wieczory takie ciepłe, że nikt nie chce iść spać.','Świetliki nad łąką jak iskry z ogniska.','Skowronki do zmroku. Lato w pełni.']},
 {k:'lato2',t:'pora',c:()=>seasonIdx()===0&&S.weather.k==='drought',a:W_AD,x:['Ziemia popękana jak stary garnek. Trzeba nosić wodę na grządki.','W taki upał w południe nie wolno spać na miedzy. Południca nie lubi leniuchów.']},
 {k:'jesien1',t:'pora',c:wSea(1),a:W_AD,x:['Jarzębina obsypana jak nigdy. Starzy mówią: będzie sroga zima.','Gęsi ciągną na południe. Słychać je nawet w nocy.','Liście już rude. Trzeba zdążyć z drewnem przed słotą.']},
 {k:'jesien2',t:'pora',c:()=>seasonIdx()===1&&S.weather.k==='fog',a:W_AD,x:['Mgła taka, że ręki nie widać. W taką noc błędne ogniki wodzą ludzi po bagnach.']},
 {k:'zima1',t:'pora',c:wSea(2),a:W_AD,x:['Mróz tak trzaska, że drzewa pękają w lesie jak z łuku.','Śnieg skrzypi pod nogami. Jutro trzeba odgarnąć przy drzwiach.','Zimą noc długa. Dobrze, że jest o czym opowiadać.']},
 {k:'zima2',t:'pora',c:()=>seasonIdx()===2&&czRecent(/wilk/i,4),a:W_AD,x:['Wilki wyły pod lasem. Psy całą noc nie spały.','W taką zimę stary mówił, że wilkołak chodzi z watahą. Bzdury. Ale drzwi [zaryglowałem|zaryglowałam].']},
 {k:'wiosna1',t:'pora',c:wSea(3),a:W_AD,x:['Bociany wróciły na stary dąb. Teraz to już na pewno wiosna.','Ziemia odmarza. Niedługo trzeba będzie siać.','Czuć sok w brzozach. Jutro natoczę dla dzieci.']},
 {k:'wiosna2',t:'pora',c:()=>seasonIdx()===3&&wWx('burza','storm','rain')(),a:W_AD,x:['Pierwszy grzmot! Kto się nie wytarza w trawie, cały rok będzie słaby w krzyżu.','Grzmi na nagie drzewa. Stare przysłowie mówi, że to na głodny rok. Oby kłamało.']},
 {k:'deszcz',t:'pora',c:wWx('rain'),a:W_AD,x:['Deszcz bębni o strzechę. Najlepiej się przy nim śpi.','Leje od rana. Żaby szczęśliwe, ludzie mniej.']},
 {k:'sztorm',t:'pora',c:wWx('storm'),a:W_AD,x:['Morze dziś złe. Łodzie wyciągnięte wysoko, i dobrze.','Takim wiatrem rozbił się nasz statek. Nie lubię tego dźwięku.']},
 {k:'jasno',t:'pora',c:()=>S.weather.k==='clear'&&seasonIdx()!==2,a:W_AD,x:['Niebo czerwone na zachodzie. Jutro będzie pogodnie, mówią rybacy.','Gwiazd tyle, że można je liczyć do rana.']},
 {k:'znakw',t:'pora',w:1.4,c:()=>S.weather.next&&SIGN[S.weather.next]&&S.weather.left<=1,a:A=>W_AD(A)&&(A.age>=40||usp(A,'zabobon')||A.sk.rybak>=2||A.sk.rolnik>=2),v:()=>({z:SIGN[S.weather.next][0].replace(/\.$/,'').toLowerCase(),p:SIGN[S.weather.next][1]}),x:['Widzieliście? {z}. Mówię wam: {p}.','Patrzcie w niebo, nie w ogień. {z}. Znaczy, że {p}.']},
 // ---------- usposobienie ----------
 {k:'u_marzy',t:'charakter',a:A=>usp(A,'marzy'),x:['Gdyby tak zbudować łódź i popłynąć za tamte chmury…','Myślicie, że za morzem ktoś teraz też siedzi przy ogniu i myśli o nas?','Księżyc dziś jak srebrna miska. Ciekawe, kto z niej je.']},
 {k:'u_zrzeda',t:'charakter',a:A=>usp(A,'zrzeda'),x:['Kasza znowu przypalona. Kto dziś stał przy kotle?','Wszyscy gadają, a robić nie ma komu.','Dym z ogniska zawsze leci na mnie. Zawsze.']},
 {k:'u_wesoly',t:'charakter',a:A=>usp(A,'wesoly'),b:wAny,x:['Słyszeliście, jak {B} <gonił|goniła> dziś kozę dookoła studni? Koza wygrała.','Jak mówiła moja babka: lepiej się śmiać, niż płakać, bo od płaczu kasza słona.','Jutro będzie lepiej. A jak nie, to pojutrze.']},
 {k:'u_bogo',t:'charakter',a:A=>usp(A,'bogo'),x:['Trzeba podziękować Mokoszy za plony. Kto zapomina o bogini, ten jej potem szuka.','Perun dziś milczy. Dobrze. Niech śpi spokojnie.','Weles pilnuje stad i zmarłych. [Zostawiłem|Zostawiłam] mu kawałek chleba przy kamieniu.']},
 {k:'u_ciekaw',t:'charakter',a:A=>usp(A,'ciekaw'),x:['Za tamtym wzgórzem jest jaskinia. Ktoś musi kiedyś do niej zajrzeć.','Czemu mrówki noszą jaja przed deszczem? Skąd one wiedzą?','Znalazłem dziś skorupkę ślimaka, jakiego jeszcze nie widziałem. || Znalazłam dziś skorupkę ślimaka, jakiego jeszcze nie widziałam.']},
 {k:'u_teskni',t:'charakter',c:()=>epNow()<=2,a:A=>usp(A,'teskni')&&A.age>=20,x:['U nas w domu teraz pewnie piecze się chleb. Czuję ten zapach, jak zamknę oczy.','Matka zawsze śpiewała przy kądzieli. [Zapomniałem|Zapomniałam] słów. To najgorsze.','Czasem idę na cypel i patrzę na morze. Nikogo nie wypatruję. Po prostu patrzę.']},
 {k:'u_dumny',t:'charakter',a:A=>usp(A,'dumny')&&W_AD(A),v:A=>({f:CN[Object.keys(CN).sort((x,y)=>A.sk[y]-A.sk[x])[0]]}),x:['Ja wam powiem jedno: lepszego fachowca niż ja nie ma na tej wyspie. Fach: {f}.','Zobaczcie jutro moją robotę. Za sto lat ktoś będzie ją podziwiał.']},
 {k:'u_gosp',t:'charakter',a:A=>usp(A,'gosp')&&W_AD(A),x:['[Policzyłem|Policzyłam] worki. Starczy do wiosny, jeśli nikt nie będzie rozrzutny.','Grosz do grosza, ziarno do ziarna. Tak się buduje gospodarstwo.']},
 {k:'u_porywczy',t:'charakter',a:A=>usp(A,'porywczy')&&W_AD(A),b:wRival,x:['Jak {B} jeszcze raz ruszy moje narzędzia, to nie ręczę za siebie.','Wiem, wiem, za szybko się zapalam. Ale ktoś musi mówić prosto.']},
 {k:'u_lagodny',t:'charakter',a:A=>usp(A,'lagodny')&&W_AD(A),x:['Nie ma takiej kłótni, której nie da się zgasić przy wspólnym chlebie.','Każdy ma swoją biedę. Nie trzeba dokładać.']},
 {k:'u_spiew',t:'charakter',a:A=>usp(A,'spiew')&&!!wSong(),v:()=>({s:wSong()}),x:['Zaśpiewam wam „{s}”. Kto zna słowa, niech wtóruje.','Nucę „{s}” od rana. Nie chce wyjść z głowy.']},
 {k:'u_milczek',t:'charakter',a:A=>usp(A,'milczek')&&W_AD(A),x:['Dobrze jest.','Jutro też będzie dzień.','Słucham. Ktoś musi słuchać.']},
 {k:'u_gadula',t:'charakter',a:A=>usp(A,'gadula'),b:wAny,x:['A wiecie, co mi dziś {B} <powiedział|powiedziała>? Nie, nie powiem. No dobra, powiem…','Trzeba by wreszcie pomówić o tym płocie przy polu. I o kozach. I o pogodzie. I o…']},
 {k:'u_kpiarz',t:'charakter',a:A=>usp(A,'kpiarz'),b:wFriend,x:['{B} tak dziś <pracował|pracowała>, że aż drzewa ziewały.','Patrzcie na {Ba}, siedzi jak mysz pod miotłą. Pewnie znowu coś <przeskrobał|przeskrobała>.']},
 {k:'u_zabobon',t:'wiara',a:A=>usp(A,'zabobon'),x:['Kto gwiżdże w izbie, ten wygwizduje biedę. Nie gwiżdżcie mi tu.','Sowa siadła dziś na dachu u sąsiadów. Nic nie mówię, ale nic dobrego to nie wróży.','Nie liczcie gwiazd na głos. Kto policzy swoją, ten umrze.']},
 {k:'u_opiek',t:'charakter',a:A=>usp(A,'opiek')&&W_AD(A),x:['Dzieci już śpią? To dobrze. Ja jeszcze posiedzę, póki ogień.','Kto dziś nie jadł do syta, niech przyjdzie do mnie. Zostało trochę polewki.']},
 // ---------- epoka ----------
 {k:'e1a',t:'epoka',c:wEp(1),a:A=>A.age>=20&&!A.born,x:['Pamiętam pokład i to, jak trzeszczał. Teraz trzeszczy tylko ogień. Wolę ogień.','Myślicie, że ktoś nas jeszcze szuka?','Morze nas wyrzuciło, ale ziemia przyjęła. Trzeba jej się odwdzięczyć.']},
 {k:'e2a',t:'epoka',c:wEp(2),a:W_AD,x:['Już nikt nie mówi „rozbitkowie”. Mówią „ludzie z Przystani”.','Na wiecu znowu o miedzy. Kiedyś kłóciliśmy się o jagody, teraz o ziemię. To chyba dobrze.','Z przysiółka przyszła wieść, że u nich kozy się mnożą jak króliki.']},
 {k:'e3a',t:'epoka',c:wEp(3),a:W_AD,x:['Woźnica mówi, że za górami jest dolina, gdzie trawa sięga do pasa.','Wyspa jest nasza od brzegu do brzegu. Kto by pomyślał, tamtej pierwszej nocy.','Drogą jedzie wóz z drewnem z boru. Słychać go już od mostu.']},
 {k:'e4a',t:'epoka',c:wEp(4),a:W_AD,x:['Rody rosną jak dęby. Każdy ma swoją ziemię i swój znak nad drzwiami.','Folwark pod lasem przysłał miód. Dobry, gęsty, ciemny.']},
 // ---------- wiara, wierzenia, obawy ----------
 {k:'w_zmora',t:'wiara',a:A=>W_AD(A)&&(usp(A,'zabobon')||A.age>=45||Math.random()<.3),x:['Zmora siadła mi w nocy na piersi. [Chciałem|Chciałam] krzyczeć i nie [mogłem|mogłam] ruszyć ręką.','Rano kozy mokre i zgonione, a sierść poplątana w supełki. Zmora na nich jeździła, mówię wam.','Na noc kładę nóż pod poduszką. Zmora boi się żelaza.']},
 {k:'w_topiel',t:'wiara',c:()=>seasonIdx()!==2,a:A=>W_AD(A)&&(usp(A,'zabobon')||usp(A,'opiek')||A.age>=40),x:['Nad stawem coś chlupnęło, choć wiatru nie było. Topielec. Nie chodźcie tam po zmroku.','Moja babka mówiła: utopiec siedzi na wierzbie nad wodą i czeka, aż ktoś się nachyli.']},
 {k:'w_poludnica',t:'wiara',c:()=>seasonIdx()===0,a:W_AD,x:['W samo południe [widziałem|widziałam] na miedzy kobietę w bieli. [Odwróciłem|Odwróciłam] się, a tam tylko kurz.','Dzieci, w żniwa nie biegajcie w zboże. Południca chodzi po polu z sierpem i pyta o rzeczy, na które nie ma odpowiedzi.']},
 {k:'w_boginki',t:'wiara',c:()=>S.people.some(p=>p.age<1),a:A=>W_AD(A)&&(A.sex==='k'||A.age>=50),x:['Nie pierzcie pieluch po zachodzie słońca. Boginki to widzą.','Księżyc świeci prosto w kołyskę. Zasłońcie, bo dziwożona przyjdzie podmienić dziecko.','Pod poduszkę maleństwa [włożyłem|włożyłam] dziurawiec. Od złych mocy.']},
 {k:'w_planetnik',t:'wiara',c:wWx('burza','storm','grad'),a:A=>W_AD(A)&&A.age>=35,x:['To płanetnik pędzi chmury. Rzućcie garść mąki w ogień, niech nas oszczędzi.','Gradowa chmura nad lasem. Dziadek mówił, że płanetnicy to dusze utopionych.']},
 {k:'w_leszy',t:'wiara',a:A=>W_AD(A)&&(A.sk.mysliwy>=1||A.sk.drwal>=1||A.sk.zbieracz>=1),x:['Wczoraj w borze ktoś gwizdał za mną. Odwróciłem kurtkę na lewą stronę i trafiłem do domu. || Wczoraj w borze ktoś gwizdał za mną. Odwróciłam chustę na lewą stronę i trafiłam do domu.','Zostawiłem placek na pniu dla borowego. Niech nie zwodzi. || Zostawiłam placek na pniu dla borowego. Niech nie zwodzi.']},
 {k:'w_ogniki',t:'wiara',c:()=>seasonIdx()===1||S.weather.k==='fog',a:W_AD,x:['Nad mokradłem tańczą światełka. Nie idźcie za nimi. Błędne ogniki wodzą w bagno.','To dusze, co nie zaznały spokoju. Dlatego świecą i krążą.']},
 {k:'w_domowik',t:'wiara',a:A=>W_AD(A)&&!!homeOf(A),x:['Zostawiam okruchy przy piecu. Domowik lubi, jak się o nim pamięta.','W nocy coś stuka za piecem. To domowik sprząta. Albo mysz.','Nie wylewajcie gorącej wody za próg bez ostrzeżenia. Domowe duchy się obrażą.']},
 {k:'w_licho',t:'wiara',c:()=>S.people.some(p=>p.hp<.5)||(S.dis||0)>.45,a:A=>A.age>=40,x:['Licho nie śpi. Nie wymawiajcie jego imienia na głos.','Ziele nad drzwiami trzeba odnowić. Stare już nie pachnie, to i licho się nie boi.']},
 {k:'w_kukulka',t:'wiara',c:wSea(3),a:W_AD,x:['Kukułka kukała mi dziś dwanaście razy. Tyle lat jeszcze pożyję. Albo dwanaście razy się pomyliła.','Pierwszy raz w tym roku słyszałem kukułkę, a w kieszeni miałem grosz. Będzie dostatek. || Pierwszy raz w tym roku słyszałam kukułkę, a w kieszeni miałam grosz. Będzie dostatek.']},
 {k:'w_bocian',t:'wiara',c:()=>seasonIdx()!==2,a:W_AD,x:['Bocian na dachu to szczęście. Ogień omija takie chaty.','Nie wolno ruszać bocianiego gniazda. Kto ruszy, temu dom spłonie.']},
 {k:'w_wilkolak',t:'wiara',c:()=>seasonIdx()===2,a:A=>A.age>=45,x:['Dawno temu u nas we wsi był taki, co w pełnię chodził z wilkami. Rano miał pokaleczone ręce.','Wilkołaka poznasz po tym, że brwi mu się zrastają. Albo po tym, że nie je chleba.']},
 {k:'w_rusalki',t:'wiara',c:()=>seasonIdx()===3,a:A=>W_AD(A)&&A.age<30,x:['W zielony tydzień nie kąpcie się w zatoce. Rusałki łaskoczą do śmierci.','Mówią, że rusałki to dziewczęta, co nie doczekały wesela. Tańczą przy księżycu na łące.']},
 {k:'w_dziady',t:'wiara',c:()=>{const r=Math.floor(rday());return r>=8&&r<=10},a:W_AD,x:['Niedługo Dziady. Trzeba przygotować kaszę i miód dla tych, co odeszli.','W noc Dziadów nie wolno zamiatać izby, żeby nie wymieść dusz.']},
 {k:'w_kupala',t:'wiara',c:()=>{const r=Math.floor(rday());return r>=18||r<=1},a:A=>A.age>=14&&A.age<35,x:['W noc Kupały pójdę szukać kwiatu paproci. Kto znajdzie, temu się poszczęści.','Mój wianek popłynął najdalej. Ciekawe, kto go wyłowi. || Wianek mojej siostry popłynął najdalej. Ciekawe, kto go wyłowi.']},
 {k:'w_gromnica',t:'wiara',c:()=>{const r=Math.floor(rday());return r>=13&&r<=14},a:A=>A.age>=30,x:['Zapalimy gromnicę i obejdziemy chaty. Niech wilki i pioruny trzymają się z dala.','Gdy w Gromniczną z dachów ciecze, zima jeszcze się przewlecze. A dziś kapało.']},
 {k:'w_zaduszki',t:'wiara',c:()=>(S.zmarli||[]).length>0&&seasonIdx()===1,a:A=>A.age>=40,x:['Jesienią zmarli są blisko. Czuć ich, kiedy wiatr ucichnie.']},
 // ---------- starzy i dzieci ----------
 {k:'stary1',t:'starzy',a:W_OLD,x:['Za moich młodych lat zimy były takie, że wrony spadały z drzew zmarznięte.','Kiedyś opowiem wam o moim dziadku. Ale nie dziś. Dziś jestem zmęczony. || Kiedyś opowiem wam o mojej babce. Ale nie dziś. Dziś jestem zmęczona.','Młodzi myślą, że wszystko wiedzą. Ja też tak myślałem. || Młodzi myślą, że wszystko wiedzą. Ja też tak myślałam.']},
 {k:'stary2',t:'starzy',c:()=>(S.found||[]).length>0,a:W_OLD,x:['Ci, co tu mieszkali przed nami, też siedzieli przy ogniu. Kamienie z ich kręgu jeszcze leżą.','Dawny lud wyspy znał drogi, których my jeszcze nie znamy.']},
 {k:'dziecko1',t:'dzieci',a:W_KID,x:['A czy wieloryb może połknąć łódź? A dwie?','Jak dorosnę, to będę miał własną łódź i popłynę do końca morza! || Jak dorosnę, to będę miała własną łódź i popłynę do końca morza!','Dziś znalazłem żabę. Nazywa się Rechotek. Mieszka w kubku. || Dziś znalazłam żabę. Nazywa się Królowa.']},
 {k:'dziecko2',t:'dzieci',c:wEp(1),a:W_KID,x:['Czy kiedyś wrócimy? Nikt mi nie odpowiada.','Mama mówi, że nasz dom jest tutaj. A tata patrzy na morze.']},
 {k:'dziecko3',t:'dzieci',c:wSea(2),a:W_KID,x:['Zrobiliśmy bałwana! Ma nos z marchwi i oczy z węgli.','Kiedy spadnie dużo śniegu, będziemy zjeżdżać z górki na korze!']},
 // ---------- przyroda, kocioł, ogień (z podstawianiem) ----------
 {k:'zw',t:'przyroda',a:A=>W_AD(A)||W_KID(A),s:()=>ZWIERZ[seasonIdx()],x:['[Widziałem|Widziałam] dziś {s}. [Stałem|Stałam] cicho i [patrzyłem|patrzyłam], aż mi nogi zdrętwiały.','Rano przy drodze [spotkałem|spotkałam] {s}. Dobry znak, mówią.','Dzieci, jutro pokażę wam {s}. Wiem, gdzie szukać.']},
 {k:'kociol',t:'przyroda',a:W_AD,s:()=>JADLO(),x:['Dziś w kotle {s}. Tak można żyć.','Kto gotował {s}? Niech gotuje częściej.','Po {s} od razu cieplej na sercu.']},
 {k:'ogien',t:'przyroda',a:W_AD,s:()=>OGIEN,x:['Patrzcie, {s}.','Lubię tę chwilę, kiedy {s}.']},
 {k:'niebo',t:'przyroda',c:()=>S.weather.k==='clear',a:W_AD,s:()=>NIEBO,x:['Spójrzcie w górę: {s}.','Cicho. Popatrzcie: {s}.']},
 {k:'legenda',t:'wiara',a:A=>A.age>=35,s:()=>LEGENDY,x:['Mój ojciec mówił, że {s}. || Moja matka mówiła, że {s}.','Starzy u nas powiadali, że {s}.']},
 {k:'przyslowie',t:'przyroda',a:A=>A.age>=30,s:()=>PRZYSL[seasonIdx()],x:['Stare przysłowie mówi: {s}','Jak mawiała moja babka: {s}']},
 {k:'praca_og',t:'dzien',a:A=>W_AD(A)&&!!wTop(A),v:A=>({c:CN[wTop(A)]}),s:()=>PRACA_OG,x:['Jutro znowu robota: {c}. {s}','Każdy ma swoje. Ja: {c}. {s}']},
 // ---------- wymiany zdań ----------
 {k:'x_przyj',t:'rozmowa',w:1.4,a:W_AD,b:wFriend,x2:[['{B}, pamiętasz naszą pierwszą zimę?','Pamiętam. <Miałeś|Miałaś> katar przez trzy miesiące.'],['Jutro idziesz ze mną?','Jak zawsze. Kto inny by z tobą wytrzymał?'],['Myślisz, że bogowie nas widzą?','Jeśli widzą, to się śmieją. Ale życzliwie.']]},
 {k:'x_riv',t:'rozmowa',w:1.2,a:W_AD,b:wRival,x2:[['Znowu <zostawiłeś|zostawiłaś> narzędzia na deszczu.','Bo ktoś zajął wiatę swoimi workami.'],['Przesuń się, siedzisz na moim miejscu.','Nie [widziałem|widziałam] tu twojego imienia.']]},
 {k:'x_mate',t:'rozmowa',w:1.3,a:W_AD,b:wMate,x2:[['Zimno ci?','Przy tobie nigdy.'],['Jutro naprawię ten płot, obiecuję.','<Mówiłeś|Mówiłaś> tak w zeszłym tygodniu. I tydzień wcześniej.']]},
 {k:'x_kid',t:'rozmowa',w:1.2,a:W_KID,b:A=>{const L=S.people.filter(q=>q.age>=40);return L.length?L[(Math.random()*L.length)|0]:null},x2:[['<Dziadku|Babciu>, a skąd się bierze wiatr?','Strzybóg dmucha, dziecko. Jak się złości, to mocniej.'],['Czy zmora przyjdzie dziś do mnie?','Do grzecznych dzieci nie przychodzi. Śpij spokojnie.']]},
 {k:'x_bogo',t:'rozmowa',w:1,a:A=>usp(A,'bogo')||usp(A,'zabobon'),b:A=>{const L=S.people.filter(q=>q!==A&&q.age>=14&&(usp(q,'kpiarz')||usp(q,'ciekaw')));return L[0]||null},x2:[['Nie siadaj tyłem do ognia, to obraza dla domowego.','A jak usiądę bokiem, to pół obrazy?'],['<Słyszałeś|Słyszałaś> puszczyka? Woła „pójdź, pójdź”.','To ptak woła ptaka. Nie dorabiaj mu słów.']]}
];
// ---------- noc ----------
const NOC=[
 {k:'n_dziecko',c:()=>S.people.some(p=>p.age<2),b:()=>{const L=S.people.filter(p=>p.age<2);return L[(Math.random()*L.length)|0]},x:['Małe {B} płacze przez sen. Matka nuci <mu|jej> cicho.','Ktoś kołysze dziecko w ciemnej izbie. Skrzypi biegun kołyski.']},
 {k:'n_straz',b:A=>{const L=S.people.filter(p=>p.age>=18&&p.age<60);return L[(Math.random()*L.length)|0]},x:['Przy ogniu czuwa {B}. Raz po raz dorzuca szczapę i patrzy na las.','{B} wychodzi przed chatę, patrzy w gwiazdy i wraca do ciepła.']},
 {k:'n_pies',c:()=>S.people.length>0,x:['Łata szczeka na coś w ciemności. Potem cichnie.','Pies obchodzi chaty, węszy przy każdym progu i kładzie się przy ostatnim żarze.']},
 {k:'n_morze',x:['Fale biją o brzeg równo jak oddech. Wieś śpi.','Od morza ciągnie chłodem. Dym z kominów kładzie się nisko.']},
 {k:'n_lato',c:wSea(0),x:['Nad łąką świetliki. Gdzieś nad wodą rechoczą żaby.','Krótka noc. Zanim zgaśnie ogień, już szarzeje nad morzem.']},
 {k:'n_jesien',c:wSea(1),x:['Wiatr zrywa liście i niesie je po dachach.','Nad mokradłem błądzi światełko. Nikt nie wychodzi sprawdzić, co to.']},
 {k:'n_zima',c:wSea(2),x:['Mróz trzaska w drzewach. W chatach przykrywają się czym kto ma.','Śnieg skrzypi pod czyimiś krokami. To tylko Łata wraca z obchodu.','Wilki wyją daleko za lasem. Dzieci przytulają się do matek.']},
 {k:'n_wiosna',c:wSea(3),x:['Pierwsze ptaki śpiewają, zanim jeszcze zaświta.','Pachnie mokrą ziemią. W nocy spadł ciepły deszcz.']},
 {k:'n_burza',c:wWx('burza','storm'),x:['Grzmi nad wyspą. Ktoś zapala gromnicę w oknie.','Wiatr szarpie strzechę. W chatach nikt nie śpi.']},
 {k:'n_puszczyk',c:()=>Math.random()<.5,x:['Na dachu woła puszczyk. Stara gospodyni spluwa przez lewe ramię i przewraca się na drugi bok.']},
 {k:'n_zmora',b:A=>{const L=S.people.filter(p=>p.age>=14);return L[(Math.random()*L.length)|0]},x:['{B} budzi się z krzykiem, mokr<y|a> od potu. Mówi, że coś siedziało <mu|jej> na piersi.','W zagrodzie niespokojnie. Rano kozy będą miały splątaną sierść.']},
 {k:'n_para',c:()=>S.people.some(p=>p.wedDay!==undefined&&S.day-p.wedDay<YEAR),x:['W jednej z chat jeszcze szepczą i śmieją się cicho. Młodzi.']},
 {k:'n_lunatyk',b:A=>{const L=S.people.filter(p=>p.age>=10&&p.age<40);return L[(Math.random()*L.length)|0]},x:['{B} wychodzi we śnie przed chatę i staje twarzą do morza. Ktoś delikatnie zawraca <go|ją> do łóżka.']},
 {k:'n_niebo',c:()=>S.weather.k==='clear',x:['Niebo pełne gwiazd. Wóz stoi nad borem dyszlem w dół.','Księżyc wychodzi zza chmury i srebrzy wodę zatoki.']},
 {k:'n_glos',s:()=>[['świerszcze w trawie','żaby nad stawem','sowę w olszynie','plusk ryby w zatoce'],['jelenia na rykowisku','deszcz na strzechach','skrzypienie starej sosny','klucz gęsi w ciemności'],['wilki za borem','trzask lodu na stawie','wiatr w kominach','śnieg zsuwający się z dachu'],['pierwsze żaby','słowika w łozach','ciepły deszcz','bekasa nad łąką']][seasonIdx()],x:['Z ciemności słychać {s}. Ktoś przewraca się na drugi bok.','Wieś śpi. Tylko {s}.']},
 {k:'n_zar',s:()=>['żarzące się polana pękają cicho','ostatnie iskry gasną w trawie','węgle w ognisku pulsują jak serce','popiół przykrywa żar do rana'],x:['Ognisko dogasa: {s}.']},
 {k:'n_mowi',b:()=>{const L=S.people.filter(p=>p.age>=6);return L[(Math.random()*L.length)|0]},s:()=>['łodzi','matce','kozach','miodzie','wielkiej rybie','dawnym domu','burzy','weselu'],x:['{B} mówi przez sen coś o {s}. Potem cichnie.']},
 {k:'n_piec',c:wSea(2),b:()=>{const L=S.people.filter(p=>p.age>=16);return L[(Math.random()*L.length)|0]},x:['{B} wstaje w nocy dołożyć do pieca. Ściany trzeszczą od mrozu.']},
 {k:'n_mlodzi',c:()=>S.people.filter(p=>p.age>=16&&p.age<26&&(p.pair===null||p.pair===undefined)).length>=2,x:['Pod starą wierzbą dwie postacie siedzą jeszcze długo po zgaśnięciu ognia.','Ktoś cicho gwiżdże pod czyimś oknem. Okiennica uchyla się na chwilę.']},
 {k:'n_staw',c:()=>seasonIdx()!==2,x:['Nad stawem coś plusnęło, choć wiatru nie ma. Nikt nie wychodzi sprawdzić.','Mgła nad wodą układa się w kształt, który rano każdy opisze inaczej.']},
 {k:'n_stara',c:()=>S.people.some(p=>p.age>=60),x:['Najstarsza z kobiet nie śpi. Siedzi przy oknie i liczy coś na palcach.','Stary gospodarz kaszle przez sen. Rano powie, że to od dymu.']},
 {k:'n_kurnik',c:()=>S.bld.some(b=>b.kind==='kurnik'&&bDone(b)),x:['W kurniku poruszenie i gdakanie. Kuna? Rano się okaże.']}
];
// ---------- sny, które się sprawdzają ----------
const SEN_WX={storm:['czarny koń galopuje po wodzie i rży jak wiatr','morze wchodzi do chaty po kolana'],burza:['ogień spada z nieba na stary dąb','ktoś woła z chmury dudniącym głosem'],
 snow:['biała gęś siada na dachu i rozpościera skrzydła','mąka sypie się z dziurawego worka bez końca'],frost:['woda w dzbanie zamienia się w szkło','szklane kwiaty rosną na ścianie izby'],
 rain:['ryby pływają po izbie jak w stawie','płacząca kobieta przechodzi przez wieś'],fog:['mleko rozlewa się po całym polu','idzie przez las i nie widzi własnych rąk'],drought:['studnia jest pusta, a dzban pęknięty','rozgrzany kamień leży na każdym progu']};
function senPick(){const d=Math.floor(S.day),who=S.people.filter(p=>p.age>=12&&(usp(p,'marzy')||usp(p,'zabobon')||usp(p,'bogo')||Math.random()<.25));if(!who.length)return null;const A=who[(Math.random()*who.length)|0];
 const nx=S.weather.next;
 if(nx&&SEN_WX[nx]&&S.weather.left<=1.2){const v=SEN_WX[nx][(Math.random()*2)|0];return{A,k:'wx',v:nx,txt:`${A.name} śni, że ${v}. Rano powie, że to znak.`}}
 const preg=S.people.find(p=>p.ciaza);if(preg&&Math.random()<.5)return{A,k:'dz',v:preg.fam,txt:`${A.name} śni rybę w czystej wodzie. Ryba we śnie to dziecko, mówią starzy.`};
 const weak=S.people.find(p=>p!==A&&(p.hp<.3||p.age>72));if(weak&&Math.random()<.35)return{A,k:'sm',v:weak.id,txt:`${A.name} śni, że wypada ${gw(A,'mu','jej')} ząb. Budzi się i długo nie może zasnąć.`};
 if(S.weather.k==='drought'&&Math.random()<.4)return{A,k:'og',v:0,txt:`${A.name} śni ogień, który idzie od lasu. Rano obchodzi chaty i patrzy na strzechy.`};
 if((S.dis||0)>.45&&Math.random()<.4)return{A,k:'kl',v:0,txt:`${A.name} śni, że dwa koguty biją się na progu. Zły sen, na kłótnię.`};
 if(usp(A,'teskni')&&epNow()<=2)return{A,k:'dom',v:0,txt:`${A.name} śni dawny dom: piec, ławę i matkę przy kądzieli. Budzi się z mokrymi oczami.`};
 return null}
// sprawdzenie snu rano: pogoda nadeszła, dziecko się urodziło, ktoś odszedł
function senCheck(){const s=S.sen;if(!s)return null;const d=Math.floor(S.day),A=pById(s.a);if(d-s.d>(s.k==='dz'?YEAR/2:s.k==='sm'?6:3)){S.sen=null;return null}
 let ok=false;if(s.k==='wx')ok=S.weather.k===s.v;else if(s.k==='dz')ok=S.people.some(p=>p.born&&p.fam===s.v&&p.age<.2);else if(s.k==='sm')ok=!pById(s.v);else if(s.k==='og')ok=S.bld.some(b=>b.fire);else if(s.k==='kl')ok=czRecent(/kłót|spór|bój/i,1);
 if(!ok)return null;S.sen=null;S.senOk=(S.senOk||0)+1;if(A){memAdd(A,'sen',null);if(A.sex)S.wh=(S.wh||0)+.005}
 const t=`Sen ${A?gen(A.name):'jednego z nas'} się sprawdził.`+(s.k==='wx'?' Pogoda przyszła taka, jak we śnie.':s.k==='dz'?' Urodziło się dziecko.':s.k==='sm'?' Ktoś odszedł.':s.k==='og'?' Ogień przyszedł.':' Była kłótnia.');log(t+(S.senOk>=3?' Coraz więcej ludzi mówi przy śniadaniu, co im się śniło.':''));return t}

/* ---- składanie ---- */
function wFill(s,A,B,v){if(s.includes(' || ')){const q=s.split(' || ');s=A.sex==='k'?q[1]:q[0]}   // całe zdanie w formie żeńskiej po „ || ”
 s=s.replace(/\{(\w+)\}/g,(m,k)=>k==='A'?A.name:k==='B'?(B?B.name:''):k==='Bg'?(B?gen(B.name):''):k==='Ba'?(B?acc(B.name):''):(v&&v[k]!==undefined?v[k]:''));
 return s.replace(/\[([^|\]]*)\|([^\]]*)\]/g,(m,a,b)=>A.sex==='k'?b:a).replace(/<([^|>]*)\|([^>]*)>/g,(m,a,b)=>B&&B.sex==='k'?b:a)}
function wCtx(){const d=Math.floor(S.day);return{d,sea:seasonIdx(),days:typeof czNeedDays==='function'?czNeedDays():99}}
function wSpeakers(){return S.people.filter(p=>p.job!=='wyp'&&p.state!=='away'&&!p.lost&&p.age>=5&&(S.epoch!==4||p.settlementId==='przystan'))}
function wChoose(list,ctx,who,mem,forNight){const out=[];const seen=new Set(mem.seen),tseen=mem.top.slice(-5),last=mem.last||{};
 for(const T of list){let ok=true;try{if(T.c&&!T.c(ctx))ok=false}catch(e){ok=false}if(!ok)continue;
  const base=(typeof T.w==='number'?T.w:1)*(tseen.includes(T.t)?.35:1)*(tseen.slice(-2).includes(T.t)?.4:1);
  if(forNight){const vi=(Math.random()*T.x.length)|0;if(!T.s&&seen.has(T.k+':'+vi+':-1'))continue;if(mem.seen.slice(-6).some(k=>k.startsWith(T.k+':')))continue;let B=null;try{B=T.b?T.b(null):null}catch(e){}if(T.b&&!B)continue;out.push({T,A:null,B,vi,w:base});continue}
  const cand=who.filter(A=>{try{return T.a?T.a(A):W_AD(A)}catch(e){return false}});if(!cand.length)continue;
  const A=cand[(Math.random()*cand.length)|0];soulOf(A);let B=null;if(T.b){try{B=T.b(A)}catch(e){B=null}if(!B||B===A)continue}
  const L=T.x2||T.x,vi=(Math.random()*L.length)|0;let si=-1,sv=null;if(T.s){let o=null;try{o=T.s(A)}catch(e){}if(!o||!o.length)continue;si=(Math.random()*o.length)|0;sv=o[si]}
  const key=T.k+':'+vi+(si>=0?':'+si:'');if(seen.has(key))continue;let w=base*(seen.has(T.k+':*')?.45:1);
  const spoke=last[A.id];if(spoke!==undefined&&ctx.d-spoke<3&&!usp(A,'gadula'))w*=.25;if(usp(A,'milczek'))w*=.4;if(usp(A,'gadula'))w*=1.6;
  if(T.t==='dzien'||T.t==='pamiec'||T.t==='ludzie')w*=1.5;if(T.t==='wiara'&&(usp(A,'zabobon')||usp(A,'bogo')))w*=1.6;
  out.push({T,A,B,vi,si,sv,key,w})}
 return out}
function wPick(c){let tot=c.reduce((a,x)=>a+x.w,0),r=Math.random()*tot;for(const x of c){if(r<x.w)return x;r-=x.w}return c[c.length-1]}
function wMem(){S.wm=S.wm||{seen:[],top:[],last:{}};return S.wm}
function wRemember(x){const m=wMem();m.seen.push(x.key||x.T.k+':'+x.vi,x.T.k+':*');if(m.seen.length>140)m.seen.splice(0,m.seen.length-140);m.top.push(x.T.t);if(m.top.length>12)m.top.shift();if(x.A)m.last[x.A.id]=Math.floor(S.day)}
function wLine(x){const L=x.T.x2?x.T.x2[x.vi]:null;if(L)return[[wFill(L[0],x.A,x.B,x.v),x.A.name],[wFill(L[1],x.B,x.A,x.v),x.B.name]];let v=null;try{v=x.T.v?x.T.v(x.A,x.B):null}catch(e){v=null}if(x.sv!==null&&x.sv!==undefined)v=Object.assign({},v,{s:x.sv});
 return[[wFill(x.T.x[x.vi],x.A,x.B,v),x.A.name]]}
// wieczór: 2–3 wypowiedzi albo wymiana i jedna wypowiedź
function wieczorLines(){if(!S||!S.people.length)return[];const ctx=wCtx(),who=wSpeakers();if(who.length<2)return[];const mem=wMem();
 let cand=wChoose(TALK,ctx,who,mem,false);const out=[],used=new Set(),topics=new Set();const n=who.length>=8&&Math.random()<.45?3:2;
 while(out.length<n&&cand.length){const x=wPick(cand);cand=cand.filter(y=>y!==x);if(used.has(x.A.id)||(x.B&&x.T.x2&&used.has(x.B.id))||topics.has(x.T.t))continue;
  const lines=wLine(x);if(out.length+lines.length>n+1)continue;used.add(x.A.id);if(x.B&&x.T.x2)used.add(x.B.id);topics.add(x.T.t);wRemember(x);out.push(...lines)}
 return out}
function wieczorPlace(){const d=Math.floor(S.day),at=S.people.filter(p=>p.eveIntentD===d||p.eveD===d);const c={};at.forEach(p=>c[p.eveK]=(c[p.eveK]||0)+1);
 const k=Object.keys(c).sort((a,b)=>c[b]-c[a])[0];if(k==='bania')return'W bani';if(k==='dom')return'Przed chatami';if(k==='hala')return typeof scSt==='function'&&SERCE[scSt()]?SERCE[scSt()].loc.replace(/^./,x=>x.toUpperCase()):'W izbie';return'Przy ognisku'}
function nocLine(){const ctx=wCtx(),mem=wMem();
 if(!S.sen&&Math.random()<.32){const s=senPick();if(s){S.sen={d:ctx.d,a:s.A.id,k:s.k,v:s.v};return s.txt}}
 const cand=wChoose(NOC,ctx,[],mem,true);if(!cand.length)return null;const x=wPick(cand);let si=-1,sv='';if(x.T.s){const o=x.T.s();si=(Math.random()*o.length)|0;sv=o[si]}mem.seen.push(x.T.k+':'+x.vi+':'+si);if(mem.seen.length>140)mem.seen.shift();
 const t=x.T.x[x.vi];const B=x.B;return t.replace(/\{B\}/g,B?B.name:'').replace(/\{s\}/g,sv).replace(/<([^|>]*)\|([^>]*)>/g,(m,a,b)=>B&&B.sex==='k'?b:a)}
// „Wczoraj”: najważniejsze chwile poprzedniego dnia z dzienników ludzi i z kroniki
function wczorajLines(){const d=Math.floor(S.day)-1,L=[];const pri={dziecko:9,slub:9,smierc:9,sen:8,wyprawa:6,dom:6,mistrz:5,budowa:4,rana:4,zdobycz:3,zjawa:5,klotnia:4,zgoda:4,dar:3};
 const ev=[];for(const p of S.people){const z=p.dznY&&p.dznY.d===d?p.dznY:(p.dzn&&p.dzn.d===d?p.dzn:null);if(!z)continue;for(const e of z.e)if(pri[e[0]])ev.push([pri[e[0]],p,e]);
  const fish=z.g.ryby||0,meat=z.g.mieso||0;if(fish>=14)ev.push([3,p,['zdobycz','ryby']]);if(meat>=8)ev.push([3,p,['zdobycz','mieso']])}
 ev.sort((a,b)=>b[0]-a[0]);const seen=new Set();
 for(const [w,p,e] of ev){const k=e[0]+':'+(e[1]||'');if(seen.has(k))continue;seen.add(k);const r=e[1];let t='';
  if(e[0]==='dziecko')t=`${p.name} ${gw(p,'został ojcem','została matką')}: ${r}.`;else if(e[0]==='slub')t=`${p.name} i ${r} są po ślubie.`;else if(e[0]==='smierc')t=`${p.name} żegna ${r?acc(r):'bliską osobę'}.`;
  else if(e[0]==='wyprawa')t=`${p.name} ${gw(p,'wrócił','wróciła')} z wyprawy${r?': '+r:''}.`;else if(e[0]==='dom')t=`${p.name} ${gw(p,'spał','spała')} pierwszy raz we własnym domu.`;
  else if(e[0]==='mistrz')t=`${p.name}: mistrzostwo w fachu (${CN[r]||r}).`;else if(e[0]==='budowa')t=`${p.name} ${gw(p,'skończył','skończyła')} budowę: ${(BD[r]&&BD[r].n||'').toLowerCase()}.`;
  else if(e[0]==='rana')t=`${p.name} ${gw(p,'odniósł','odniosła')} ranę.`;else if(e[0]==='zdobycz')t=r==='ryby'?`${p.name} ${gw(p,'przyniósł','przyniosła')} pełną sieć ryb.`:`${p.name} ${gw(p,'wrócił','wróciła')} z polowania z mięsem dla kilku rodzin.`;
  else if(e[0]==='sen')t=`Sen ${gen(p.name)} się sprawdził.`;else if(e[0]==='zjawa')t=`${p.name} twierdzi, że ${gw(p,'widział','widziała')}: ${r||'coś w ciemności'}.`;
  else if(e[0]==='klotnia')t=`${p.name} ${gw(p,'pokłócił się','pokłóciła się')}${r?' z: '+r:''}.`;else if(e[0]==='zgoda')t=`${p.name} ${gw(p,'pogodził się','pogodziła się')}${r?' z: '+r:''}.`;else if(e[0]==='dar')t=`${p.name} ${gw(p,'dostał','dostała')} dar${r?' od: '+r:''}.`;
  if(t)L.push(t);if(L.length>=3)break}
 // reszta z kroniki: ważne wpisy z wczoraj, bez powtórzeń
 if(L.length<3&&typeof SINCE_RX!=='undefined')for(const l of S.log){if(l.d!==d+1)continue;if(!SINCE_RX.test(l.t)||/^Wspomnienie|lepiej zna swój fach/.test(l.t))continue;const t=l.t.split('. ')[0].replace(/\.$/,'')+'.';if(!L.some(x=>x.slice(0,24)===t.slice(0,24)))L.push(t);if(L.length>=3)break}
 return L}

/* ---- pokazywanie: wieczór, noc, rano ---- */
let wPhase=null,wUntil=0;
function wShow(head,lines,talk){czTalk.innerHTML=`<small>${head}</small>`+lines.map(x=>talk?`<p>„${escapeHtml(x[0])}”<span>${escapeHtml(x[1])}</span></p>`:`<p class="wnar">${escapeHtml(x)}</p>`).join('');czTalk.classList.add('on');wUntil=performance.now()+(talk?11000:8000)}
function wArchive(o){S.wArch=S.wArch||[];S.wArch.push(o);if(S.wArch.length>20)S.wArch.shift()}
// składanie idzie z zegarem gry (także bez ekranu), pokazywanie z klatką obrazu
function wTick(){if(!S||S.epoch===4||!S.people.length)return;const t=tod(),d=Math.floor(S.day);
 if(t>=.8&&t<.93&&S.czTalkD!==d&&!evOpen){S.czTalkD=d;const L=wieczorLines();if(L.length){const h=wieczorPlace();wArchive({d,h,L});wQ={h,L,talk:1}}return}
 if((t>=.95||t<T0-.04)){const nd=t>=.95?d:d-1;if(S.nocD!==nd){S.nocD=nd;const n=nocLine();if(n){const a=S.wArch&&S.wArch[S.wArch.length-1];if(a&&a.d===nd)a.n=n;else wArchive({d:nd,h:'Nocą',L:[],n});wQ={h:'Nocą',L:[n]}}}return}
 if(t>=T0&&t<T0+.12&&S.ranoD!==d&&d>0){S.ranoD=d;const s=senCheck();const L=wczorajLines();if(s)L.unshift(s);if(L.length)wQ={h:'Wczoraj',L:L.slice(0,3)}}}
let wQ=null;
{const _st=step;step=function(dt){_st(dt);try{wTick()}catch(e){console.warn('wieczór',e)}}}
czTalkTick=function(){if(!S)return;const now=performance.now();
 if(evOpen){if(wPhase){czTalk.classList.remove('on');wPhase=null}return}
 if(wQ){const q=wQ;wQ=null;if(czOn){wShow(q.h,q.L,!!q.talk);wPhase=q.h}return}
 if(wPhase&&now>wUntil){czTalk.classList.remove('on');wPhase=null}};
czTalkLines=function(){return wieczorLines()};
{const st=document.createElement('style');st.textContent='#cz-talk p.wnar{font-style:normal;font-size:16px}.wiecz-a p{margin:3px 0}.wiecz-a .wn{color:var(--mut);font-style:italic}';document.head.appendChild(st)}
// Kronika → Wieczory
function wieczoryHTML(){const L=(S.wArch||[]).slice().reverse();if(!L.length)return'<p class="mut">Jeszcze nikt nie siedział przy ogniu.</p>';
 return L.map(o=>`<div class="card wiecz-a"><h4>${dayName(o.d+1)} · ${escapeHtml(o.h||'')}</h4>${(o.L||[]).map(x=>`<p>„${escapeHtml(x[0])}” <span class="mut">${escapeHtml(x[1])}</span></p>`).join('')}${o.n?`<p class="wn">${escapeHtml(o.n)}</p>`:''}</div>`).join('')}
{const _kt=kronTools;kronTools=function(){return uiDisclosure('game:wieczory','Wieczory przy ogniu',wieczoryHTML())+_kt()}}
window.__wiecz={wieczorLines,nocLine,wczorajLines,senPick,senCheck,TALK,NOC,wFill};
