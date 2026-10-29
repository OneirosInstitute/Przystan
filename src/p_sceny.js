
/* ================= 4.8.0-rc.2 Małe sceny z życia i nowe wydarzenia ================= */
// Małe sceny nie zatrzymują gry: linijka nad człowiekiem na mapie i wpis w Kronice, mniej więcej raz na dobę.
// Każda zostawia ślad w pamięci i w relacjach, więc wieczorem i po roku ktoś do niej wraca.
// Zjawy są tym, co ludzie twierdzą, że widzieli: skutki mają przez ludzki strach i ludzkie zabiegi.
Object.assign(MEMW,{radosc:.15,zalot:.22,wstyd:-.1,strach:-.12});
const sPick=f=>{const a=S.people.filter(p=>p.state!=='away'&&!p.lost&&p.job!=='wyp'&&!p.e4Transport&&(S.epoch!==4||p.settlementId===(typeof e4Selected!=='undefined'?e4Selected:'przystan'))&&f(p));return a.length?a[(Math.random()*a.length)|0]:null};
const sAd=p=>p.age>=16,sKid=p=>p.age>=4&&p.age<12;
const sNearWater=p=>{try{const w=waterNear(p.x,p.z);return!!w&&Math.hypot(w.x-p.x,w.z-p.z)<14}catch(e){return false}};
const sRd=()=>Math.floor(rday()),sYr=()=>Math.floor(S.day/YEAR);
const sOnceYr=k=>{const key='sc_'+k+sYr();if(S.seen[key])return false;return true},sMarkYr=k=>{S.seen['sc_'+k+sYr()]=1};
const nameDay=p=>{let h=0;for(const ch of p.name)h=(h*31+ch.charCodeAt(0))>>>0;return h%YEAR};
const SLOWA=['mama','tata','baba','koza','ogień','am','daj','pies'];
const SCENY=[
 // ---------- dzieci i rodzina ----------
 {k:'slowo',cat:'dzieci',w:2,cd:2,c:()=>S.people.some(p=>p.age>=1&&p.age<2.2&&!p.slowo),A:()=>sPick(p=>p.age>=1&&p.age<2.2&&!p.slowo),
  f:A=>{A.slowo=1;const w=SLOWA[(Math.random()*SLOWA.length)|0];(A.par||[]).map(pById).filter(Boolean).forEach(q=>memAdd(q,'radosc','pierwsze słowo '+gen(A.name)));return`${A.name} mówi pierwsze słowo: „${w}”. Rodzice powtarzają je całej wsi do wieczora.`}},
 {k:'zab',cat:'dzieci',w:1.4,cd:2,c:()=>S.people.some(p=>p.age>=.4&&p.age<1.2&&!p.zab),A:()=>sPick(p=>p.age>=.4&&p.age<1.2&&!p.zab),
  f:A=>{A.zab=1;return`${A.name} ma pierwszy ząbek. Babka daje ${gw(A,'mu','jej')} do gryzienia skórkę chleba, żeby ${gw(A,'rósł mocny','rosła mocna')}.`}},
 {k:'szalas',cat:'dzieci',w:1.4,cd:5,c:()=>seasonIdx()!==2&&S.people.filter(sKid).length>=3,A:()=>sPick(sKid),
  f:A=>{S.people.filter(sKid).slice(0,5).forEach(q=>memAdd(q,'radosc','szałas w lesie'));return`Dzieci budują w zagajniku własny szałas z gałęzi. ${A.name} ${gw(A,'jest wodzem','jest wodzem')} i nikogo dorosłego nie wpuszcza.`}},
 {k:'plywanie',cat:'dzieci',w:1.4,cd:4,c:()=>seasonIdx()===0,A:()=>sPick(p=>p.age>=6&&p.age<12&&!p.plywa&&sNearWater(p)),
  f:A=>{A.plywa=1;memAdd(A,'radosc','nauka pływania');return`${A.name} ${gw(A,'nauczył się','nauczyła się')} pływać w zatoce. Ojciec trzymał rękę pod brzuchem, aż ${gw(A,'sam','sama')} ${gw(A,'odpłynął','odpłynęła')}.`}},
 {k:'miod_dz',cat:'dzieci',w:1,cd:8,c:()=>(S.res.miod||0)>=4&&S.people.filter(sKid).length>=2,A:()=>sPick(sKid),
  f:A=>{S.res.miod=Math.max(0,S.res.miod-2);memAdd(A,'wstyd','podebrany miód');return`Z garnka w spiżarni zniknęło trochę miodu. ${A.name} ma lepkie palce i niewinną minę.`}},
 {k:'zima_dz',cat:'dzieci',w:1.4,cd:4,c:()=>seasonIdx()===2&&S.weather.k==='snow',A:()=>sPick(sKid),
  f:A=>{S.people.filter(sKid).slice(0,6).forEach(q=>memAdd(q,'radosc','zjazd na korze'));return`Dzieci zjeżdżają z górki na korze i na skórach. ${A.name} ${gw(A,'wpadł','wpadła')} w zaspę po same uszy.`}},
 {k:'stary_dz',cat:'dzieci',w:1.2,cd:3,c:()=>S.people.some(p=>p.age>=55)&&S.people.filter(sKid).length>=2,A:()=>sPick(p=>p.age>=55),
  f:A=>{techXp('nauka',2,'opowiesc');const o=['dawnych stronach','statku, który przywiózł ich na wyspę','smoku spod Wawelu, jak to u nas mówiono','tym, jak '+gw(A,'pierwszy raz zobaczył','pierwszy raz zobaczyła')+' morze'][(Math.random()*4)|0];return`${A.name} siada na progu i opowiada dzieciom o ${o}. Nikt z małych się nie rusza.`}},
 {k:'imieniny',cat:'ludzie',w:2,cd:1,c:()=>S.people.some(p=>p.age>=14&&nameDay(p)===sRd()&&p.imD!==sYr()),A:()=>sPick(p=>p.age>=14&&nameDay(p)===sRd()&&p.imD!==sYr()),
  f:A=>{A.imD=sYr();memAdd(A,'radosc','imieniny');friendsOf(A).forEach(q=>relAdd(A,q,3));return`Dziś imieniny ${gen(A.name)}. Ktoś przynosi garnuszek miodu, dzieci wianek z polnych kwiatów, a wieczorem śpiewają ${gw(A,'mu','jej')} „Sto lat”.`}},
 {k:'zalot',cat:'ludzie',w:1.6,cd:4,c:()=>true,A:()=>sPick(p=>p.age>=16&&p.age<32&&(p.pair===null||p.pair===undefined)),B:A=>sPick(q=>q.sex!==A.sex&&q.age>=16&&q.age<32&&(q.pair===null||q.pair===undefined)&&q.fam!==A.fam&&relGet(A,q)>-10),
  f:(A,B)=>{relAdd(A,B,14);memAdd(A,'zalot',B.name);memAdd(B,'zalot',A.name);return`${A.name} ${gw(A,'przyniósł','przyniosła')} dla ${gen(B.name)} ${A.sex==='m'?'wianek z chabrów':'haftowaną chustę'} i długo nie ${gw(A,'umiał','umiała')} nic powiedzieć. ${B.name} się śmieje, ale dar zostaje.`}},
 {k:'klotnia',cat:'spor',w:1.4,cd:3,c:()=>S.people.filter(sAd).length>=6,A:()=>sPick(p=>sAd(p)&&(usp(p,'porywczy')||usp(p,'zrzeda')||usp(p,'dumny'))),B:A=>sPick(q=>sAd(q)&&q!==A&&q.fam!==A.fam),
  f:(A,B)=>{relAdd(A,B,-12);memAdd(A,'klotnia',B.name);memAdd(B,'klotnia',A.name);return`${A.name} i ${B.name} kłócą się przy studni ${['o pożyczoną siekierę','o to, czyja koza zjadła kapustę','o miejsce przy ogniu','o źle ułożony stos drewna'][(Math.random()*4)|0]}. Słychać ich na drugim końcu wsi.`}},
 {k:'zgoda',cat:'spor',w:1.8,cd:3,c:()=>S.people.some(p=>rivalsOf(p).length),A:()=>sPick(p=>sAd(p)&&rivalsOf(p).length>0),
  f:A=>{const B=rivalsOf(A)[0];if(!B)return null;const L=sPick(q=>usp(q,'lagodny')&&q!==A&&q!==B);relAdd(A,B,22);memAdd(A,'zgoda',B.name);memAdd(B,'zgoda',A.name);
   return L?`${L.name} sadza ${acc(A.name)} i ${acc(B.name)} przy jednym kubku. Po długim milczeniu ktoś pierwszy się uśmiecha. Zgoda.`:`${A.name} i ${B.name} spotykają się na ścieżce. Stoją chwilę, potem podają sobie ręce. Bez słowa.`}},
 {k:'dar',cat:'ludzie',w:1.2,cd:2,c:()=>true,A:()=>sPick(p=>sAd(p)&&friendsOf(p).length>0),
  f:A=>{const B=friendsOf(A)[0];if(!B)return null;relAdd(A,B,5);memAdd(B,'dar',A.name);return`Przed drzwiami ${gen(B.name)} leży ${['rzeźbiona łyżka','kosz suszonych grzybów','nowy trzonek do siekiery','sznur bursztynowych paciorków'][(Math.random()*4)|0]}. ${A.name} ${gw(A,'zostawił','zostawiła')} to bez słowa.`}},
 {k:'spiew',cat:'ludzie',w:1,cd:3,c:()=>isWork(),A:()=>sPick(p=>usp(p,'spiew')&&p.state==='work'),
  f:A=>{const s=wSong();S.hope=clamp(S.hope+.003,0,1);return`${A.name} śpiewa przy pracy${s?' „'+s+'”':''}. Po chwili wtóruje ${gw(A,'mu','jej')} pół wsi.`}},
 {k:'zaklad',cat:'ludzie',w:1,cd:6,c:()=>S.people.some(p=>p.sk.kowal>=2)&&S.people.some(p=>p.sk.ciesla>=2),A:()=>sPick(p=>p.sk.kowal>=2&&sAd(p)),B:A=>sPick(q=>q.sk.ciesla>=2&&q!==A),
  f:(A,B)=>{const w=Math.random()<.5?A:B,l=w===A?B:A;memAdd(w,'radosc','wygrany zakład');relAdd(A,B,4);return`${A.name} i ${B.name} zakładają się, kto szybciej zrobi trzonek. Wygrywa ${w.name}, a ${l.name} stawia ${gw(w,'mu','jej')} kubek miodu.`}},
 {k:'zguba',cat:'ludzie',w:.8,cd:4,c:()=>isWork(),A:()=>sPick(p=>sAd(p)&&p.state==='work'),
  f:A=>`${A.name} cały ranek ${gw(A,'szukał','szukała')} noża. Był za pasem.`},
 {k:'kapiel',cat:'ludzie',w:1,cd:3,c:()=>seasonIdx()===0&&S.weather.k!=='rain'&&tod()>.6,A:()=>sPick(p=>p.age>=12&&p.age<35&&sNearWater(p)),
  f:A=>{memAdd(A,'radosc','kąpiel w zatoce');return`Po pracy młodzi biegną do zatoki. ${A.name} ${gw(A,'skoczył','skoczyła')} z kamienia na główkę i ${gw(A,'wypłynął','wypłynęła')} z wodorostami we włosach.`}},
 // ---------- przyroda ----------
 {k:'bociany',cat:'przyroda',w:3,cd:1,c:()=>seasonIdx()===3&&sOnceYr('bociany'),A:()=>sPick(sAd),f:A=>{sMarkYr('bociany');S.hope=clamp(S.hope+.01,0,1);return`${A.name} pierwsz${gw(A,'y','a')} widzi bociany nad łąką. Wróciły. Gospodynie wystawiają na płot garnki do góry dnem, żeby gniazdo się trzymało.`}},
 {k:'snieg',cat:'przyroda',w:3,cd:1,c:()=>seasonIdx()===2&&S.weather.k==='snow'&&sOnceYr('snieg'),A:()=>sPick(sKid)||sPick(sAd),f:A=>{sMarkYr('snieg');return`Pierwszy śnieg. ${A.name} łapie płatki na język, a psy tarzają się w białym puchu.`}},
 {k:'jarzebina',cat:'przyroda',w:1.4,cd:1,c:()=>seasonIdx()===1&&sOnceYr('jarz'),A:()=>sPick(p=>p.age>=40),f:A=>{sMarkYr('jarz');return`${A.name} patrzy na jarzębinę obsypaną owocem i kiwa głową: będzie sroga zima. Trzeba więcej drewna pod ścianą.`}},
 {k:'los',cat:'przyroda',w:.8,cd:6,c:()=>seasonIdx()>=1&&seasonIdx()<=2,A:()=>sPick(sAd),f:A=>`Przez wieś przechodzi łoś. Spokojnie, jakby był u siebie. ${A.name} stoi z wiadrem w ręku i nie oddycha, dopóki zwierz nie zniknie w olszynie.`},
 {k:'roj',cat:'przyroda',w:1,cd:6,c:()=>seasonIdx()===0||seasonIdx()===3,A:()=>sPick(p=>sAd(p)&&(p.sk.zbieracz>=1||usp(p,'bogo'))),f:A=>{S.res.miod=(S.res.miod||0)+3;return`Na płocie przysiadł rój pszczół. ${A.name} spokojnie zgarnia go do kosza i niesie do barci. Pszczoły to dar, mówią starzy.`}},
 {k:'grzyby',cat:'przyroda',w:1.6,cd:3,c:()=>seasonIdx()===1&&czRecent(/deszcz|pada/i,2),A:()=>sPick(sAd),f:A=>{S.res.grzyby=(S.res.grzyby||0)+8;memAdd(A,'radosc','grzybobranie');return`Po deszczu pół wsi idzie na grzyby. ${A.name} wraca z koszem prawdziwków i nie zdradza miejsca.`}},
 {k:'bursztyn',cat:'przyroda',w:.9,cd:5,c:()=>czRecent(/sztorm|wiatr/i,3)||seasonIdx()===1,A:()=>sPick(p=>p.age>=6&&sNearWater(p)),f:A=>{S.res.bursztyn=(S.res.bursztyn||0)+1;memAdd(A,'radosc','bursztyn na plaży');return`${A.name} znajduje na plaży bursztyn z uwięzioną muszką. Każdy chce go potrzymać pod światło.`}},
 {k:'beczka',cat:'przyroda',w:1,cd:8,c:()=>czRecent(/sztorm/i,2),A:()=>sPick(p=>sAd(p)&&sNearWater(p)),f:A=>{const g=[['sol',4,'soli'],['plotno',3,'płótna'],['gwozdzie',6,'gwoździ']][(Math.random()*3)|0];S.res[g[0]]=(S.res[g[0]]||0)+g[1];return`Sztorm wyrzucił na brzeg beczkę. ${A.name} wybija dno: w środku trochę ${g[2]}. Skąd? Nikt nie wie.`}},
 {k:'wieloryb',cat:'przyroda',w:.4,cd:YEAR*2,c:()=>S.day>YEAR,A:()=>sPick(sAd),f:A=>{S.res.mieso=(S.res.mieso||0)+30;S.res.opal=(S.res.opal||0)+8;S.hope=clamp(S.hope+.02,0,1);memAdd(A,'radosc','wieloryb na mieliźnie');return`Na mieliźnie leży wieloryb. ${A.name} pierwsz${gw(A,'y','a')} go ${gw(A,'zobaczył','zobaczyła')}. Cała wieś tnie mięso i wytapia tran do lampek. Starzy dziękują morzu.`}},
 // ---------- wierzenia i zjawy ----------
 {k:'poludnica',cat:'zjawa',w:1.8,cd:4,t:'p',c:()=>seasonIdx()===0&&(S.weather.k==='drought'||S.weather.k==='clear'),A:()=>sPick(p=>sAd(p)&&p.state==='work'),
  f:A=>{A.hp=Math.max(.2,A.hp-.06);memAdd(A,'zjawa','południca na miedzy');S.wd=(S.wd||0)+.004;return`${A.name} wraca z pola ${gw(A,'blady','blada')} i spocon${gw(A,'y','a')}. Mówi, że na miedzy stała kobieta w bieli i pytała, ile ziaren jest w kłosie. Starzy kiwają głowami: w południe trzeba odpoczywać w cieniu.`}},
 {k:'topielec',cat:'zjawa',w:1.2,cd:5,t:'n',c:()=>seasonIdx()!==2,A:()=>sPick(p=>sAd(p)&&sNearWater(p)),
  f:A=>{memAdd(A,'zjawa','topielec przy stawie');S.wd=(S.wd||0)+.003;return`${A.name} przysięga, że przy stawie ktoś w zielonym kaftanie wołał ${gw(A,'go','ją')} po imieniu, a potem plusnął w wodę. Matki trzymają dziś dzieci z dala od brzegu.`}},
 {k:'zmora',cat:'zjawa',w:1.4,cd:4,t:'n',c:()=>true,A:()=>sPick(sAd),
  f:A=>{A.hp=Math.max(.2,A.hp-.03);memAdd(A,'zjawa','zmora w nocy');const pen=S.bld.some(b=>b.kind==='zagroda'&&bDone(b));
   return`${A.name} budzi się w nocy i nie może się ruszyć ani krzyknąć: coś ciężkiego siedzi ${gw(A,'mu','jej')} na piersi. Rano ${pen?'ktoś wiesza nad zagrodą pęk maku i stawia w kącie miotłę':'kładzie pod poduszkę nóż'}. Od zmory.`}},
 {k:'boginki',cat:'zjawa',w:1.6,cd:6,t:'n',c:()=>S.people.some(p=>p.age<.6),A:()=>{const k=sPick(p=>p.age<.6);return k?pById((k.par||[])[0])||sPick(sAd):null},
  f:A=>{memAdd(A,'zjawa','boginki przy strumieniu');return`${A.name} słyszy nocą plusk prania przy strumieniu, choć nikt z wioski nie pierze po zmroku. Do rana czuwa przy kołysce. Maleństwo ma na rączce czerwoną wstążkę, a pod poduszką gałązkę dziurawca.`}},
 {k:'ogniki',cat:'zjawa',w:1.2,cd:5,t:'n',c:()=>seasonIdx()===1||S.weather.k==='fog',A:()=>sPick(sAd),
  f:A=>{A.hp=Math.max(.2,A.hp-.03);memAdd(A,'zjawa','błędne ogniki');return`${A.name} ${gw(A,'szedł','szła')} nocą za światełkiem nad mokradłem i ${gw(A,'wpadł','wpadła')} po pas w bagno. ${gw(A,'Wrócił','Wróciła')} do ognia ${gw(A,'mokry','mokra')} i ${gw(A,'cichy','cicha')}. Błędne ogniki, mówią wszyscy.`}},
 {k:'leszy',cat:'zjawa',w:1.2,cd:5,c:()=>S.weather.k==='fog'||seasonIdx()===1,A:()=>sPick(p=>sAd(p)&&(p.sk.drwal>=1||p.sk.mysliwy>=1||p.sk.zbieracz>=1)),
  f:A=>{memAdd(A,'zjawa','leszy w borze');return`${A.name} pół dnia ${gw(A,'krążył','krążyła')} w borze w kółko, choć zna te ścieżki. Dopiero kiedy ${gw(A,'przewrócił','przewróciła')} kaftan na lewą stronę, las ${gw(A,'go','ją')} wypuścił. Na pniu przy ścieżce ${gw(A,'zostawił','zostawiła')} placek dla borowego.`}},
 {k:'planetnik',cat:'zjawa',w:1.6,cd:3,c:()=>['burza','storm','grad'].includes(S.weather.k),A:()=>sPick(p=>p.age>=35),
  f:A=>{const k=(S.res.maka||0)>=1?'maka':'ziarno';S.res[k]=Math.max(0,(S.res[k]||0)-1);return`Nad lasem kłębi się czarna chmura. ${A.name} rzuca garść ${k==='maka'?'mąki':'ziarna'} na wiatr i w ogień: dla płanetnika, żeby przegnał grad nad las, a nie na pola.`}},
 {k:'domowik',cat:'zjawa',w:1.2,cd:4,t:'n',c:()=>true,A:()=>sPick(p=>sAd(p)&&!!homeOf(p)),
  f:A=>{if((S.res.mleko||0)>=.5)S.res.mleko-=.5;memAdd(A,'radosc','domowik');return`W chacie ${gen(A.name)} coś stuka za piecem. ${A.name} nie wstaje. Rano stawia przy palenisku miseczkę mleka i okruchy chleba, żeby domowik był zadowolony.`}},
 {k:'puszczyk',cat:'zjawa',w:1,cd:5,t:'n',c:()=>S.people.some(p=>p.hp<.45||p.age>65),A:()=>sPick(p=>p.age>=40),
  f:A=>`Na dachu obok chaty ${gen(A.name)} woła puszczyk: „pójdź, pójdź”. ${A.name} wychodzi i rzuca w niego grudą ziemi. Nie lubi takich gości.`},
 {k:'wilkolak',cat:'zjawa',w:1,cd:6,t:'n',c:()=>seasonIdx()===2&&czRecent(/wilk/i,5),A:()=>sPick(p=>p.age>=40),
  f:A=>{memAdd(A,'zjawa','wilkołak');S.wd=(S.wd||0)+.003;return`${A.name} ${gw(A,'widział','widziała')} w świetle księżyca wilka, który szedł na dwóch łapach. Do rana wszyscy ryglują drzwi.`}},
 {k:'kukulka',cat:'zjawa',w:1.2,cd:4,c:()=>seasonIdx()===3,A:()=>sPick(sAd),
  f:A=>{const n=3+((Math.random()*20)|0);return`${A.name} pyta kukułkę, ile lat ${gw(A,'mu','jej')} zostało. Kukułka kuka ${n} razy. ${n>15?'Śmiech przy studni.':'Ktoś szybko mówi, że kukułki kłamią.'}`}},
 {k:'grzmot',cat:'zwyczaj',w:2.5,cd:1,c:()=>seasonIdx()===3&&['burza','storm','rain'].includes(S.weather.k)&&sOnceYr('grzmot'),A:()=>sPick(sAd),
  f:A=>{sMarkYr('grzmot');S.people.forEach(p=>p.hp=Math.min(1,p.hp+.01));return`Pierwszy grzmot tej wiosny! ${A.name} pierwsz${gw(A,'y','a')} tarza się w mokrej trawie, a za ${gw(A,'nim','nią')} pół wsi. Kto się wytarza, tego cały rok nie będą bolały plecy.`}},
 {k:'paproc',cat:'zwyczaj',w:3,cd:1,t:'n',c:()=>sRd()===0&&sOnceYr('paproc'),A:()=>sPick(p=>p.age>=15&&p.age<30),
  f:A=>{sMarkYr('paproc');memAdd(A,'radosc','kwiat paproci');S.hope=clamp(S.hope+.01,0,1);return`W noc Kupały ${A.name} wraca z lasu nad ranem i twierdzi, że ${gw(A,'widział','widziała')} kwiat paproci. Nikomu nie pokaże gdzie, bo inaczej szczęście przepadnie.`}},
 {k:'wrozby',cat:'zwyczaj',w:2.5,cd:1,t:'n',c:()=>sRd()===11&&sOnceYr('wrozby'),A:()=>sPick(p=>p.sex==='k'&&p.age>=14&&p.age<26),
  f:A=>{sMarkYr('wrozby');return`Dziewczęta leją wosk przez ucho klucza do wody. ${A.name} widzi w swoim cieniu na ścianie ${['łódź','koło od wozu','drzewo z koroną','ptaka'][(Math.random()*4)|0]} i rumieni się, gdy ktoś pyta, co to znaczy.`}},
 {k:'gromnica',cat:'zwyczaj',w:2.5,cd:1,c:()=>(sRd()===13||sRd()===14)&&sOnceYr('gromnica'),A:()=>sPick(p=>p.age>=35),
  f:A=>{sMarkYr('gromnica');S.wh=(S.wh||0)+.01;return`Gromniczna. ${A.name} obchodzi chaty z zapaloną świecą. Dymem świecy kreśli na belce nad drzwiami znak słońca, żeby piorun i wilk omijały dom.`}},
 {k:'majenie',cat:'zwyczaj',w:2.5,cd:1,c:()=>(sRd()===17||sRd()===18)&&sOnceYr('maj'),A:()=>sPick(p=>p.age>=12&&p.age<30),
  f:A=>{sMarkYr('maj');S.wh=(S.wh||0)+.01;return`Zielony tydzień. ${A.name} z młodymi przybija nad drzwiami świeże gałęzie brzozy i tataraku. Wieś pachnie zielenią, a w zatoce nikt się nie kąpie: rusałki tańczą.`}}
];
// ---------- losowanie: mniej więcej raz na dobę, kategorie się zmieniają ----------
function scWhen(T){const t=tod(),k=T.t||'d';if(k==='n')return t>=T1||t<T0+.02;if(k==='p')return t>=.45&&t<.56&&isWork();return isWork()}
function sceneTick(){if(!S||!S.people.length||evOpen||placing||(typeof cerActive==='function'&&cerActive()))return;
 if(S.scN===undefined)S.scN=S.day+.5;if(S.day<S.scN)return;S.scCd=S.scCd||{};const cats=S.scCat||[];
 const pool=SCENY.filter(T=>(S.scCd[T.k]||0)<=S.day&&scWhen(T)&&(()=>{try{return T.c()}catch(e){return false}})());
 if(!pool.length){S.scN=S.day+.08;return}
 const w=T=>T.w*(cats.includes(T.cat)?.3:1)*(cats[cats.length-1]===T.cat?.3:1);let tot=pool.reduce((a,T)=>a+w(T),0),r=Math.random()*tot,T=pool[0];for(const x of pool){if(r<w(x)){T=x;break}r-=w(x)}
 S.scCd[T.k]=S.day+(T.cd||3);let A=null,B=null,txt=null;try{A=T.A();if(A&&T.B){B=T.B(A);if(!B||B===A)A=null}if(A)txt=T.f(A,B)}catch(e){console.warn('scena',T.k,e);txt=null}
 if(!txt){S.scN=S.day+.1;return}
 S.scN=S.day+.7+Math.random()*.6;cats.push(T.cat);if(cats.length>3)cats.shift();S.scCat=cats;S.scLast={k:T.k,d:Math.floor(S.day)};
 log(txt);if(S.epoch===4){try{E4Domain.record(S,'scena',txt,{settlementId:A&&A.settlementId})}catch(e){}}if(A){dayEv(A,'scena',T.k);scBubble(A,txt)}}
{const _st=step;step=function(dt){_st(dt);try{sceneTick()}catch(e){console.warn('sceny',e)}}}
// linijka nad człowiekiem: pierwsze zdanie, przez kilka sekund, tylko gdy widać go na ekranie
const scBubEl=document.createElement('div');scBubEl.id='scBub';scBubEl.hidden=true;document.body.appendChild(scBubEl);let scBP=null,scBU=0,scBW=0;const scV=new THREE.Vector3();
// 4.9.0-rc.15: dymek miał tylko max-width, więc przeglądarka liczyła jego szerokość z miejsca od osoby do prawej krawędzi ekranu.
// Gdy osoba szła w prawo, dymek zwężał się z 300 do 79 px i rósł do 337 px w górę, a przy lewej krawędzi wychodził poza ekran.
// Teraz szerokość zależy tylko od tekstu, dymek zawsze mieści się na ekranie, ogonek wskazuje osobę, a czas zależy od długości zdania.
function scBubble(p,txt){if(typeof czOn!=='undefined'&&!czOn)return;scBP=p.id;const L=txt.split(/(?<=[.!?])\s/);const t=txt.length<=150?txt:(L.find(x=>x.includes(p.name))||L[0]);const shown=t.length>150?t.slice(0,147)+'…':t;scBubEl.textContent=shown;scBubEl.hidden=false;scBU=performance.now()+Math.min(14000,Math.max(6000,3000+shown.length*70));scBW=0}
function scBubFrame(){if(scBP===null)return;const p=S&&pById(scBP);if(!p||performance.now()>scBU||evOpen||!$('sheet').hidden){scBubEl.hidden=true;scBP=null;return}
  // 4.9.0-rc.16: przy otwartej karcie osoby dymek nie zasłania karty (ta sama historia jest na karcie)
  if(document.body.classList.contains('selon')){scBubEl.style.opacity='0';return}
  scV.set(p.x,Hy(p.x,p.z)+2.3,p.z).project(cam);if(Math.abs(scV.x)>.95||Math.abs(scV.y)>.9||scV.z>1){scBubEl.style.opacity='0';return}scBubEl.style.opacity='1';
  if(!scBW)scBW=scBubEl.offsetWidth;const x=(scV.x+1)/2*innerWidth,half=scBW/2,cx=Math.min(Math.max(x,half+8),innerWidth-half-8);
  scBubEl.style.left=Math.round(cx)+'px';scBubEl.style.top=Math.round((1-scV.y)/2*innerHeight)+'px';if(typeof scBubEl.style.setProperty==='function')scBubEl.style.setProperty('--ax',Math.round(Math.min(Math.max(x-cx+half,14),scBW-14))+'px')}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);scBubFrame()}}
// karta osoby otwarta przy zatrzymanym czasie: klatki wtedy nie biegną (oszczędzanie baterii), więc dymek chowa się od razu
{const _rs=renderSel;renderSel=function(){_rs();if(scBP!==null&&document.body.classList.contains('selon'))scBubEl.style.opacity='0'}}
{const st=document.createElement('style');st.textContent='#scBub{position:absolute;z-index:3;transform:translate(-50%,-100%);width:max-content;max-width:min(300px,calc(100vw - 16px));box-sizing:border-box;padding:7px 11px;border-radius:12px;background:#18201ce6;border:1px solid #c9a66b77;color:var(--hi);font:14px/1.35 var(--serif);font-style:italic;pointer-events:none;box-shadow:0 3px 12px #0007;transition:opacity .4s}#scBub[hidden]{display:none}#scBub::after{content:"";position:absolute;left:var(--ax,50%);bottom:-6px;width:10px;height:10px;transform:translateX(-50%) rotate(45deg);background:#18201ce6;border-right:1px solid #c9a66b77;border-bottom:1px solid #c9a66b77}';document.head.appendChild(st)}
window.__sceny={SCENY,sceneTick,nameDay};

/* ---- nowe wydarzenia z wyborem: ludzie, wierzenia, sny ---- */
const evPick=f=>{const a=S.people.filter(p=>p.state!=='away'&&!p.lost&&p.job!=='wyp'&&f(p));return a.length?a[(Math.random()*a.length)|0]:null};
const evSingle=p=>p.pair===null||p.pair===undefined;
EVENTS.push(
 {id:'s_zaloty',cat:'ludzie',w:2,cd:YEAR*.6,cond:()=>S.people.some(p=>(p.mem||[]).some(m=>m[1]==='zalot'&&S.day-m[0]<YEAR/2)),t:'Zaloty',ey:'Ludzie',
  ctx:()=>{const a=evPick(p=>evSingle(p)&&p.age>=16&&(p.mem||[]).some(m=>m[1]==='zalot'));if(!a)return null;const n=(a.mem.filter(m=>m[1]==='zalot').pop()||[])[2];const b=S.people.find(q=>q.name===n&&evSingle(q)&&q.sex!==a.sex);if(!b)return null;
   const o=S.people.filter(q=>(b.par||[]).includes(q.id)&&q.age>=30)[0]||S.people.filter(q=>q.fam===b.fam&&q.age>=35&&q!==b)[0];return o?{a,b,o}:null},
  text:c=>`${c.a.name} i ${c.b.name} spotykają się wieczorami pod starą wierzbą. Cała wieś o tym wie, tylko ${c.o.name} udaje, że nie widzi. Przy studni ${c.o.name} mówi głośno, że ${c.b.name} jest jeszcze za ${gw(c.b,'młody','młoda')} i że ${gw(c.a,'ten','ta')} z drugiego końca wsi to nie partia.`,
  opts:[{n:'Niech wiec ich pobłogosławi',d:'swaty wkrótce, gorycz u starszych',f:c=>{relAdd(c.a,c.b,30);relAdd(c.o,c.a,-10);const k=c.a.sex==='k'?c.a:c.b,m=k===c.a?c.b:c.a;if(!S.wed&&typeof wedOk==='function'&&wedOk(k,m))S.wed={k:k.id,m:m.id,day:Math.floor(S.day)+2};S.hope=clamp(S.hope+.02,0,1);return`Wiec mówi swoje: młodzi wybrali. ${c.o.name} mruczy pod nosem, ale chleb i sól dla swatów jednak przygotowuje.`}},
   {n:'Niech poczekają rok',d:'spokój w rodzinie, młodzi markotni',f:c=>{relAdd(c.a,c.b,8);memAdd(c.a,'strach','czekanie na ślub',-.1);memAdd(c.b,'strach','czekanie na ślub',-.1);return'Młodzi się zgadzają, ale pod wierzbą spotykają się dalej.'}},
   {n:'Wysłuchać obu rodzin przy ogniu',d:'zależy od łagodności starszych',f:c=>{const ok=usp(c.o,'lagodny')||usp(c.o,'wesoly')||Math.random()<.5;if(ok){relAdd(c.o,c.a,15);relAdd(c.a,c.b,20);return`${c.o.name} słucha długo, a potem ${gw(c.o,'pierwszy','pierwsza')} podaje rękę młodym. Wieś oddycha z ulgą.`}relAdd(c.o,c.a,-8);return`${c.o.name} nie ustępuje. Rozmowa kończy się trzaśnięciem drzwiami.`}}]},
 {id:'s_cypel',cat:'ludzie',w:1.6,cd:YEAR,cond:()=>epNow()<=2&&S.people.some(p=>usp(p,'teskni')&&p.age>=25&&(p.mood||0)<.05),t:'Tęsknota',ey:'Ludzie',
  ctx:()=>{const a=evPick(p=>usp(p,'teskni')&&p.age>=25&&(p.mood||0)<.05);return a?{a}:null},
  text:c=>`${c.a.name} od kilku dni nie je i patrzy na morze. Wieczorem mówi, że pójdzie na cypel i będzie wypatrywać statku. Może ktoś jeszcze ich szuka. Może ktoś z dawnej wsi.`,
  opts:[{n:'Puścić na cypel',d:'dzień bez pracy, potem spokój',f:c=>{c.a.mood=Math.min(1,(c.a.mood||0)+.4);memAdd(c.a,'radosc','noc na cyplu');return`${c.a.name} wraca po dwóch dniach. Statku nie było, ale ${gw(c.a,'wraca','wraca')} spokojniejs${gw(c.a,'zy','za')}. Mówi, że morze odpowiedziało: tu jest dom.`}},
   {n:'Iść razem',d:'dwoje traci dzień pracy, więź',f:c=>{const b=friendsOf(c.a)[0]||evPick(p=>p!==c.a&&p.age>=20);if(b){relAdd(c.a,b,20);memAdd(b,'przyjazn',c.a.name)}c.a.mood=Math.min(1,(c.a.mood||0)+.5);return`${b?b.name:'Ktoś'} idzie razem z ${gw(c.a,'nim','nią')}. Siedzą na cyplu do świtu i rozmawiają o domu. Wracają razem, już nie tacy samotni.`}},
   {n:'Zatrzymać przy pracy',d:'praca idzie, smutek zostaje',f:c=>{c.a.mood=Math.max(-1,(c.a.mood||0)-.3);return`${c.a.name} zostaje. Pracuje w milczeniu i coraz częściej patrzy na morze.`}}]},
 {id:'s_opowiesc',cat:'ludzie',w:1.4,cd:YEAR*2,once:false,cond:()=>S.people.some(p=>p.age>=66&&!p.opow),t:'Ostatnia opowieść',ey:'Ludzie',
  ctx:()=>{const a=evPick(p=>p.age>=66&&!p.opow);return a?{a}:null},
  text:c=>`${c.a.name} prosi, żeby wieczorem wszyscy przyszli do ognia. Mówi, że ma do opowiedzenia rzecz, której nie chce zabrać ze sobą.`,
  opts:[{n:'Cała wieś przychodzi',d:'pamięć osady i pieśń',f:c=>{c.a.opow=1;pamAdd(3,'opowiesc');song('Pieśń o tym, co opowiedział'+gw(c.a,'','a')+' '+c.a.name,c.a.name);S.hope=clamp(S.hope+.03,0,1);S.people.filter(p=>p!==c.a&&p.age>=10).forEach(p=>memAdd(p,'radosc','opowieść '+gen(c.a.name)));return`Opowiada do późnej nocy: o dawnej wsi, o tym, kogo kochał${gw(c.a,'','a')}, i o tym, czego żałuje. Ktoś układa z tego pieśń.`}},
   {n:'Wysłuchają najbliżsi',d:'rodzina pamięta',f:c=>{c.a.opow=1;famMembers(c.a.fam).forEach(p=>p!==c.a&&memAdd(p,'radosc','opowieść '+gen(c.a.name)));return'Rodzina siedzi przy ogniu do świtu. Nikt nie mówi, co usłyszał.'}}]},
 {id:'s_miod',cat:'dzieci',w:1.2,cd:YEAR,cond:()=>S.people.some(p=>(p.mem||[]).some(m=>m[1]==='wstyd'&&m[2]==='podebrany miód'&&S.day-m[0]<3)),t:'Lepkie palce',ey:'Dzieci',
  ctx:()=>{const a=evPick(p=>p.age<12&&(p.mem||[]).some(m=>m[1]==='wstyd'));return a?{a}:null},
  text:c=>`Okazuje się, że to nie pierwszy raz: z garnków w spiżarni od tygodnia znika miód. ${c.a.name} z kolegami ${gw(c.a,'przyznaje się','przyznaje się')}, gdy ktoś znajduje w szałasie pusty dzbanek.`,
  opts:[{n:'Niech pomagają przy barci',d:'dzieci uczą się zbieractwa',f:c=>{S.people.filter(p=>p.age>=6&&p.age<12).forEach(p=>{p.xp.zbieracz=(p.xp.zbieracz||0)+8});return'Przez tydzień dzieci noszą dym do uli i uczą się, ile pracy jest w jednym garnku miodu. Pszczoły kąsają, ale nikt nie płacze głośno.'}},
   {n:'Śmiech i przestroga',d:'nadzieja',f:()=>{S.hope=clamp(S.hope+.02,0,1);return'Dorośli śmieją się do łez. Dzieci dostają po jednej łyżce na zgodę i obietnicę, że następnym razem zapytają.'}},
   {n:'Surowa kara',d:'porządek, ale żal',f:c=>{S.dis=clamp((S.dis||0)+.01,0,1);memAdd(c.a,'wstyd','kara za miód');return'Dzieci przez trzy dni noszą wodę dla całej wsi. Miód przestaje znikać.'}}]},
 {id:'s_zmora_kozy',cat:'zjawa',w:1.4,cd:YEAR*.7,cond:()=>S.bld.some(b=>b.kind==='zagroda'&&bDone(b)&&(b.animals||0)>=3)&&S.day>6,t:'Zmora w zagrodzie',ey:'Wierzenia',
  ctx:()=>{const a=evPick(p=>p.sk.hodowca>=1||p.age>=40);return a?{a}:null},
  text:c=>`Rano kozy stoją mokre i zgonione, jakby całą noc biegały, a sierść mają poplątaną w supełki. ${c.a.name} mówi, że to zmora na nich jeździła. Mleka jest dziś o połowę mniej.`,
  opts:[{n:'Mak, miotła i lustro w zagrodzie',d:'trochę roboty, spokój ludzi',f:c=>{S.wh=(S.wh||0)+.01;memAdd(c.a,'radosc','obrona przed zmorą');return'Nad wejściem zawisa pęk maku, w kącie stoi miotła, a na słupie kawałek błyszczącej blachy. Następnej nocy kozy śpią spokojnie. Może to mak, a może tylko cichsza noc.'}},
   {n:'Czuwać w nocy przy kozach',d:'ktoś zmęczony, prawda wychodzi na jaw',f:c=>{c.a.hp=Math.max(.3,c.a.hp-.05);return`${c.a.name} czuwa z kijem do rana. Około północy przez płot przeciska się kuna, a kozy wpadają w panikę. Zmora czy kuna, płot trzeba załatać.`}},
   {n:'Nie dawać wiary bajkom',d:'nic nie kosztuje',f:()=>{S.wd=(S.wd||0)+.01;return'Kozy wracają do siebie po dwóch dniach. Starsi kręcą głowami, że młodzi nie szanują dawnej wiedzy.'}}]},
 {id:'s_topielec',cat:'zjawa',w:1.2,cd:YEAR*.8,cond:()=>seasonIdx()===0&&S.people.filter(p=>p.age>=6&&p.age<14).length>=2,t:'Kąpiel po zmroku',ey:'Wierzenia',
  ctx:()=>{const a=evPick(p=>p.age>=8&&p.age<14),m=a&&pById((a.par||[]).find(id=>pById(id)));return a?{a,m:m||evPick(p=>p.age>=30)}:null},
  text:c=>`Dzieci chcą iść wieczorem kąpać się w zatoce, bo woda nagrzana jak w bani. ${c.m?c.m.name:'Matka'} nie pozwala: po zachodzie słońca w wodzie siedzi topielec i ciągnie za nogi. ${c.a.name} płacze, że to bajki.`,
  opts:[{n:'Zakazać',d:'bezpiecznie, dzieci markotne',f:c=>{memAdd(c.a,'strach','zakaz kąpieli',-.08);return'Dzieci zostają przy ognisku. Ktoś opowiada im o topielcu tak, że nikt już nie chce do wody.'}},
   {n:'Pozwolić, ale z dorosłym',d:'radość i nauka pływania',f:c=>{memAdd(c.a,'radosc','wieczorna kąpiel');c.a.plywa=1;return`Dorośli idą razem z dziećmi. Woda ciepła, księżyc na zatoce, ${c.a.name} pierwszy raz płynie sam${gw(c.a,'','a')} aż do kamienia.`}},
   {n:'Pozwolić samym',d:'ryzyko',f:c=>{if(Math.random()<.25){c.a.hp=Math.max(.2,c.a.hp-.25);memAdd(c.a,'zjawa','topielec w zatoce');return`${c.a.name} łapie skurcz w łydce i ledwo dopływa do brzegu. Mówi, że coś ${gw(c.a,'go','ją')} złapało za nogę. Matki mają swoją przestrogę na długie lata.`}return'Dzieci wracają mokre i szczęśliwe. Nic się nie stało, tym razem.'}}]},
 {id:'s_poludnica',cat:'zjawa',w:1.4,cd:YEAR*.8,cond:()=>seasonIdx()===0&&S.bld.some(b=>b.field&&bDone(b)&&b.field.st==='dojrzale'),t:'Żniwa w upale',ey:'Wierzenia',
  ctx:()=>({}),
  text:()=>'Żniwa, a słońce pali od rana. Stara gospodyni mówi, że w samo południe trzeba zejść z pola w cień, bo po miedzy chodzi południca i zamraczy każdego, kogo zastanie w słońcu.',
  opts:[{n:'W południe odpoczynek w cieniu',d:'wolniejsze żniwa, nikt nie słabnie',f:()=>{S.buff={k:'zmeczenie',until:S.day+1};return'W południe pole pustoszeje. Żniwiarze leżą pod gruszą, piją zsiadłe mleko i drzemią. Wieczorem pracują dłużej.'}},
   {n:'Żąć bez przerwy',d:'szybciej, ale ryzyko',f:()=>{const L=S.people.filter(p=>p.age>=16&&(p.job==='wb'||p.sk.rolnik>=1)).slice(0,4);let hit=null;L.forEach(p=>{if(Math.random()<.35){p.hp=Math.max(.25,p.hp-.15);hit=p}});
    if(hit){memAdd(hit,'zjawa','południca w żniwa');return`${hit.name} pada na miedzy jak podcięt${gw(hit,'y','a')}. Leży do wieczora w chłodzie z mokrą chustą na czole. Mówi, że ktoś w bieli ${gw(hit,'go','ją')} dotknął.`}S.buff={k:'praca',until:S.day+1};return'Żniwa idą szybko. Wieczorem wszyscy mają spieczone karki i zawroty głowy, ale snopy stoją.'}}]},
 {id:'s_sen_znak',cat:'sen',w:2.2,cd:YEAR*.4,cond:()=>S.weather.next&&['storm','frost','snow','drought','burza'].includes(S.weather.next)&&S.weather.left<=2,t:'Sen, który ostrzega',ey:'Sny',
  ctx:()=>{const k=S.weather.next;if(!['storm','frost','snow','drought','burza'].includes(k))return null;const a=evPick(p=>p.age>=16&&(usp(p,'marzy')||usp(p,'zabobon')||usp(p,'bogo')))||evPick(p=>p.age>=30);return a?{a,k}:null},
  text:c=>`${c.a.name} budzi wieś przed świtem: we śnie ${({storm:'czarny koń galopował po wodzie, a za nim szło morze',frost:'woda w dzbanie zamieniała się w szkło',snow:'biała gęś przykryła chaty skrzydłami',drought:'wszystkie studnie były puste',burza:'ogień spadał z nieba na stary dąb'})[c.k]}. ${gw(c.a,'Mówi','Mówi')}, że to znak i że trzeba się przygotować.`,
  opts:[{n:'Posłuchać snu',d:'dzień przygotowań',f:c=>{S.senWarn={k:c.k,until:S.day+3,ok:1};S.buff={k:'zmeczenie',until:S.day+1};memAdd(c.a,'radosc','wysłuchany sen');
    return c.k==='storm'?'Łodzie wyciągnięte wysoko na brzeg, sieci zdjęte, dachy przyciśnięte kamieniami.':c.k==='drought'?'Ludzie noszą wodę do beczek i podlewają grządki o świcie.':'Drewno pod ścianą, kożuchy wyjęte ze skrzyń, zwierzęta w zagrodach przykryte słomą.'}},
   {n:'Wyśmiać sen',d:'praca idzie dalej',f:c=>{S.senWarn={k:c.k,until:S.day+3,ok:0};return`${c.a.name} odchodzi obrażon${gw(c.a,'y','a')}. Dzień płynie jak zwykle.`}}]},
 {id:'s_grajek',cat:'goscie',w:1.2,cd:YEAR,cond:()=>epNow()>=2&&(S.hamlets||[]).length>=1&&foodTotal()>40,t:'Grajek z przysiółka',ey:'Goście',
  ctx:()=>{const h=(S.hamlets||[])[(Math.random()*(S.hamlets||[]).length)|0];return h?{h}:null},
  text:c=>`Z przysiółka ${c.h.name} przychodzi grajek z gęślami i z bębenkiem. Mówi, że zagra całej wsi, jeśli dostanie miskę strawy i miejsce przy ogniu na kilka nocy.`,
  opts:[{n:'Przyjąć jak gościa',d:'jedzenie, nadzieja, pieśń',f:c=>{const t=foodTotal(),q=Math.min(t*.5,12);FOOD.forEach(k=>S.res[k]=Math.max(0,(S.res[k]||0)-q*((S.res[k]||0)/Math.max(1,t))));S.hope=clamp(S.hope+.04,0,1);c.h.wiez=Math.min(1,(c.h.wiez||.5)+.06);song('Pieśń grajka z przysiółka '+c.h.name);
    S.people.filter(p=>p.age>=12).slice(0,12).forEach(p=>memAdd(p,'radosc','grajek z '+c.h.name));return'Przez trzy wieczory grają, tańczą i śpiewają. Dzieci uczą się nowych przyśpiewek, a stare kobiety ocierają oczy.'}},
   {n:'Podziękować',d:'bez kosztów',f:c=>{c.h.wiez=Math.max(0,(c.h.wiez||.5)-.03);return'Grajek kłania się i rusza dalej. W przysiółku powiedzą, że w osadzie skąpią strawy.'}}]},
 {id:'s_swaty',cat:'goscie',w:1.2,cd:YEAR,cond:()=>epNow()>=2&&(S.hamlets||[]).some(h=>(h.pop||0)>=6)&&S.people.some(p=>evSingle(p)&&p.age>=17&&p.age<28),t:'Swaty z przysiółka',ey:'Goście',
  ctx:()=>{const h=(S.hamlets||[]).filter(h=>(h.pop||0)>=6)[0],a=evPick(p=>evSingle(p)&&p.age>=17&&p.age<28);return h&&a?{h,a}:null},
  text:c=>`Z przysiółka ${c.h.name} przychodzą swaci z chlebem i solą. Pytają o ${acc(c.a.name)}: u nich jest ${c.a.sex==='m'?'panna':'młodzieniec'} do wzięcia, ${c.a.sex==='m'?'gospodarna':'gospodarny'} i z dobrego rodu.`,
  opts:[{n:'Przyjąć chleb',d:'więź z przysiółkiem, osoba przybywa do osady',f:c=>{c.h.wiez=Math.min(1,(c.h.wiez||.5)+.15);if((c.h.pop||0)>4)c.h.pop--;const sex=c.a.sex==='m'?'k':'m';const p=newPerson(S.pid++,newName(sex),18+Math.random()*6,sex,c.a.fam,{rolnik:1},TKEYS[(Math.random()*TKEYS.length)|0]);p.x=c.a.x+1;p.z=c.a.z;S.people.push(p);addPersonMesh(p);
    const k=sex==='k'?p:c.a,m=sex==='k'?c.a:p;wedding(k,m);assign();return`Wesele jest w osadzie. ${p.name} z przysiółka ${c.h.name} zostaje u nas, a obie wsie przez tydzień chodzą do siebie w gości.`}},
   {n:'Odmówić grzecznie',d:'',f:c=>{c.h.wiez=Math.max(0,(c.h.wiez||.5)-.05);return'Swaci wracają z chlebem. Nikt się nie obraża, ale w przysiółku długo się o tym mówi.'}}]},
 {id:'s_plotki',cat:'goscie',w:1,cd:YEAR,cond:()=>epNow()>=3&&(S.hanN||0)>3,t:'Plotki woźniców',ey:'Goście',
  ctx:()=>{const R=REGIONS.filter(r=>r&&r.id&&!S.regs[r.id]);const r=R[(Math.random()*R.length)|0];return r?{r}:null},
  text:c=>`Woźnica przy zajeździe opowiada, że za krainą ${c.r.name} widział nocą światła, a w dzień dym, choć nikt tam nie mieszka. Jedni mówią, że to błędne ogniki, inni, że dawny lud wraca.`,
  opts:[{n:'Wysłać zwiadowców',d:'wiedza i odkryta kraina',f:c=>{for(let j=0;j<N;j+=4)for(let i=0;i<N;i+=4)if(REGION[j*N+i]===c.r.id)reveal(i,j,4);S.regs[c.r.id]=1;try{regionScan(true)}catch(e){}techXp('nauka',15,'zwiad');return`Zwiadowcy wracają po trzech dniach. Świateł nie znaleźli, ale znają już drogi przez ${c.r.name}. Na kamieniu przy brodzie były świeże ślady ogniska.`}},
   {n:'Nie słuchać plotek',d:'',f:()=>'Woźnica wzrusza ramionami i zamawia drugi kubek piwa.'}]}
);
const SEN_PRZ={storm:'przyszedł sztorm',frost:'przyszedł mróz',snow:'przyszła śnieżyca',drought:'przyszła susza',burza:'przyszła burza'};
// sen, którego posłuchano, chroni: łodzie, zwierzęta i zapasy; wyśmiany kosztuje
{const _nd=newDay;newDay=function(){try{const w=S.senWarn;if(w&&S.day<=w.until&&S.weather.k===w.k){S.senWarn=null;
  if(w.ok){S.hope=clamp(S.hope+.02,0,1);log(`Sen się sprawdził: ${SEN_PRZ[w.k]||'przyszła zła pogoda'}, a osada była gotowa. Ludzie częściej opowiadają sobie sny.`)}
  else{const L=['ryby','mieso','jagody'];L.forEach(k=>S.res[k]=Math.max(0,(S.res[k]||0)*.85));S.dis=clamp((S.dis||0)+.02,0,1);log(`Sen się sprawdził: ${SEN_PRZ[w.k]||'przyszła zła pogoda'}, a nikt nie był gotów. Część zapasów przepadła. Teraz każdy pamięta, kto miał rację.`)}}
  else if(w&&S.day>w.until)S.senWarn=null}catch(e){}return _nd.apply(this,arguments)}}
