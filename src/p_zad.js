
/* ================= 2.4: zadania i opowieść — cele bez ślepych zaułków, sprawy ludzi, wątki z historią ================= */
// ---------- cele aktów: podpowiedź w głosie wsi, „jak” dopiero na żądanie ----------
const zHomeless=()=>S.people.filter(p=>!homeOf(p)).length;
const zHouses=()=>S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;
const zLad=t=>Object.values(S.lad||{}).filter(x=>x.t===t).length;
const zAnimals=()=>S.bld.reduce((a,b)=>a+(b.animals||0),0);
const zKids=()=>S.people.filter(p=>p.age<12).length;
const wreckEmpty=()=>!!S.wreck.gone||S.wreck.parts.every(p=>p.open&&Object.values(p.items).every(v=>v<=0));
function wreckLeftTxt(){const m={};S.wreck.parts.forEach(p=>{if(!p.open)return;Object.entries(p.items).forEach(([k,v])=>{if(v>0)m[k]=(m[k]||0)+v})});
 return Object.entries(m).map(([k,v])=>k.startsWith('ks_')?'księga':RN[k].toLowerCase()+' '+Math.round(v)).join(', ')}
function zDaysFood(){const need=K*S.people.reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)*(law('oszczedne')?.8:1)||1;return foodTotal()/need}
// cel wraku: wystarczy go opróżnić, nie trzeba czekać na sztorm
{const g=ACTS[2].g[1];g[0]='Wynieś z wraku wszystko, co się da';g[1]=wreckEmpty;g[2]='Praca → Wrak. Wolni robotnicy rozbierają wrak sami; „Wynieś najpierw” ściąga tam wszystkich.';HINT[g[0]]=['praca',null,'[data-wt]']}
const ZH={
 'Postaw chatę zbieracza':()=>'Jagody i grzyby rosną tuż za obozem, a każdy zbiera je na własną rękę. Przydałby się ktoś, kto zajmie się tym na stałe.',
 'Postaw chatę drwala':()=>'Kłody na szałasy noszą z daleka ci, którzy akurat mają wolne ręce. A las stoi tuż obok.',
 'Rozpoznaj kajutę kapitana na wraku':()=>'Drzwi kajuty kapitana są zaklinowane. Kapitan trzymał tam księgi i swoje narzędzia.',
 'Każda rodzina pod własnym dachem':()=>{const n=zHomeless();return n?`Pod gołym niebem śpi jeszcze ${n} ${osb(n)}. Noce na brzegu są zimne i mokre.${S.res.drewno<8?' Kłód nie starczy nawet na szałas.':''}`:'Wszyscy mają już dach nad głową.'},
 'Postaw drewutnię i zgromadź 80 opału':()=>{const dw=S.bld.find(b=>b.kind==='drewutnia'&&bDone(b));if(dw&&S.res.drewno<10)return`Drewutnia stoi, ale kłód jest tylko ${fmt(S.res.drewno)}. Bez drwali nie będzie czego rąbać.`;if(dw&&!S.people.some(q=>q.job==='wb'&&q.wb===dw.id))return'Drewutnia stoi pusta. Nikt w niej nie rąbie.';return dw?`Drewutnia stoi. Opału jest ${fmt(S.res.opal)}, a na zimę trzeba co najmniej 80 porcji.`:`Opału jest ${fmt(S.res.opal)}. Zimą każdy dom spala go codziennie, a kłody same się nie porąbią.`},
 'Wynieś z wraku wszystko, co się da':()=>{const t=wreckLeftTxt(),cl=S.wreck.parts.filter(p=>!p.open).map(p=>p.n.toLowerCase());return t?`Na wraku zostało: ${t}. Morze co porę roku zabiera część, a wiosną przyjdzie sztorm.`:cl.length?`Zamknięte są jeszcze: ${cl.join(', ')}. Ktoś musi się tam dostać.`:'Wrak jest pusty.'},
 'Przetrwaj pierwszą zimę':()=>{const d=Math.floor(zDaysFood()),o=fmt(S.res.opal),L=[];if(d<15)L.push(`jedzenia na ${d} ${dniW(d)}`);if(S.res.opal<60)L.push(`opału ${o}`);const hl=zHomeless();if(hl)L.push(`bez dachu ${hl}`);if((S.res.odziez||0)<S.people.length*.3)L.push('mało ciepłej odzieży');
  return L.length?`Do wiosny daleko: ${L.join(', ')}. Tego może nie starczyć.`:'Zapasy wyglądają dobrze. Teraz trzeba po prostu doczekać wiosny.'},
 'Przeczytaj księgę z wraku':()=>{const bk=Object.keys(S.books).find(k=>S.books[k]===1);return bk?`„${BOOKS[bk]}” leży w obozie zawinięta w płótno. Nikt jej jeszcze nie otworzył.`:'Księgi kapitana zostały w kajucie na wraku.'},
 'Oswój pierwszą kozę':()=>'Na halach za lasem pasą się dzikie kozy. Gdyby tak zagnać kilka za płot…',
 'Zbierz pierwsze plony z pola':()=>S.know.pole!=='tak'?'Przy obozie ktoś rozsypał trochę ziarna z wraku. Warto patrzeć, czy coś z niego wyrośnie.':S.bld.some(b=>b.field)?'Pole jest. Ziarno idzie w ziemię wiosną albo na początku lata, a potem trzeba pilnować chwastów.':'Wiemy już, że ziarno tu kiełkuje. Brakuje kawałka ziemi, który ktoś zaorze.',
 'Osada: 4 domy i 20 osób':()=>`Domów ${zHouses()}, ludzi ${S.people.length}. Młode pary czekają na własny kąt.`,
 'Poznaj 70% krain wyspy':()=>`Znamy ${Math.round(knownFrac()*100)}% wyspy. Młodzi pytają, co jest za borem i za górami.`,
 'Wytop żelazo':()=>S.books.kowal===2?'Księga kowalska jest przeczytana. Ruda leży w ziemi, węgla dostarczy mielerz.':'Kapitan miał w kajucie księgę o kowalstwie. Bez niej żelaza nie będzie.',
 'Odkryj trzy ślady dawnego ludu':()=>`Znaleźliśmy ${S.found.length} z trzech. Ktoś tu kiedyś żył przed nami, ale ślady leżą w głębi lądu.`,
 'Wieś: 8 domów i 32 osoby':()=>`Domów ${zHouses()}, ludzi ${S.people.length}. Wieś rośnie tak szybko, jak szybko stają nowe domy.`,
 'Głos młodych na wiecu':()=>'Rozbitków ubywa. Dorastają dzieci, które statku nie pamiętają.',
 'Trzech mistrzów urodzonych na wyspie':()=>`Mistrzów urodzonych na wyspie: ${bornMasters()}. Dzieci uczą się przy dorosłych, którzy pracują w swoim fachu.`,
 'Pamięć osady co najmniej żywa':()=>'Obrzędy, pieśni, groby z imionami i pierwsze razy. To trzyma ludzi razem.'};
// cele, przy których teraz nie ma nic do zrobienia: nie zasłaniają innych
const ZW={'Przetrwaj pierwszą zimę':()=>true,'Głos młodych na wiecu':()=>true,'Trzech mistrzów urodzonych na wyspie':()=>true,
 'Przeczytaj księgę z wraku':()=>!Object.values(S.books).includes(1)&&!(S.wreck.parts[2].open&&Object.entries(S.wreck.parts[2].items).some(([k,v])=>k.startsWith('ks_')&&v>0)),
 'Zbierz pierwsze plony z pola':()=>S.know.pole!=='tak'||(S.bld.some(b=>b.field&&bDone(b))&&!inSow()&&!S.bld.some(b=>b.field&&b.field.st==='dojrzale'))};
{const _gi=goalInfo;goalInfo=function(){const g=_gi();if(!S||!g||S.epoch===2||S.actDone||!S.act||!ACTS[S.act])return g;
  const A=ACTS[S.act];const open=A.g.map((x,i)=>[x,i]).filter(([x,i])=>!S.agoals[S.act+'_'+i]);if(!open.length)return g;
  const pick=(open.find(([x])=>!(ZW[x[0]]&&ZW[x[0]]()))||open[0])[0];const w=!!(ZW[pick[0]]&&ZW[pick[0]]());
  let d=pick[2];try{if(ZH[pick[0]])d=ZH[pick[0]]()}catch(e){}
  return{ch:g.ch,t:pick[0],d,how:pick[2],wait:w}}}
// pulsujące podpowiedzi dopiero, gdy cel stoi w miejscu od ponad doby
{const _ht=hintTick;hintTick=function(rdt){let stuck=true;if(S){const g=goalInfo();if(g){S.gSince=S.gSince||{};if(S.gSince.t!==g.t){S.gSince={t:g.t,d:S.day}}stuck=S.day-S.gSince.d>1&&!g.wait}}
  const was=hintsOn;if(!stuck)hintsOn=false;try{_ht(rdt)}finally{hintsOn=was}}}
// ---------- prośby mieszkańców: więcej próśb, mówią własnymi słowami, „jak” dopiero na żądanie ----------
const adultsZ=()=>S.people.filter(p=>p.age>=16&&p.state!=='away');
const oldestZ=()=>S.people.filter(p=>p.age>=16&&!S.reqs.some(r=>r.pid===p.id)).sort((a,b)=>b.age-a.age)[0];
const motherZ=()=>pickAdult(p=>p.sex==='k'&&famMembers(p.fam).some(c=>c.age<12&&c!==p));
const anyZ=L=>L.length?L[(Math.random()*L.length)|0]:null;
const mk=(p,x)=>p?Object.assign({pid:p.id},x||{}):null;
Object.assign(REQS.dach,{say:'Śpimy pod gołym niebem. Dzieci budzą się mokre od rosy.',end:p=>`${p.name} wnosi do nowego domu tobołek z wraku i od razu rozpala ogień.`});
Object.assign(REQS.fach,{say:'Od tygodni patrzę, jak pracuje mistrz. Chcę umieć to samo.',end:p=>`${p.name} ma już pierwsze odciski od roboty. Mistrz mówi, że będą z tego ludzie.`});
Object.assign(REQS.slodkie,{say:'A będzie coś słodkiego? W domu zawsze był miód.',end:p=>'Dzieci mają lepkie palce i lepkie buzie. Nikt im tego nie żałuje.'});
Object.assign(REQS.pamiec,{say:'Pochowaliśmy ich byle gdzie. Nie ma nawet gdzie postać i pomówić.',end:p=>{pamAdd(1);return`${p.name} przychodzi o zmierzchu i stawia przy grobach gliniany kaganek.`}});
Object.assign(REQS.ubrania,{say:'Zima idzie, a dzieci mają tylko to, w czym wyszły z wraku.',end:p=>'Dzieci biegają w nowych kubrakach. Rękawy są trochę za długie, ale to dobrze: urosną.'});
Object.assign(REQS.studnia,{say:'Po deszczu woda w strumieniu jest mętna, a potem dzieci bolą brzuchy.',end:p=>{S.health=clamp(S.health+.04,0,1);return`${p.name} nabiera pierwsze wiadro ze studni. Woda jest zimna i czysta.`}});
Object.assign(REQS.gory,{say:'Z plaży widać szczyty. Ktoś musi wreszcie zobaczyć, co jest po drugiej stronie.',end:p=>`${p.name} słucha opowieści zwiadowców z otwartymi ustami. Już planuje własną wyprawę.`});
Object.assign(REQS.ziola,{say:'Zimą przyjdą gorączki. Bez krwawnika i rumianku nie będzie czym leczyć.',end:p=>`Pod strzechą wiszą pęki ziół. ${p.name} zna każdy po zapachu.`});
Object.assign(REQS.pomost,{say:'Z brzegu łowi się marnie. Ryba stoi dalej, za płycizną.',end:p=>`${p.name} zarzuca sieć z końca pomostu. Pierwszy połów jest większy niż cały tydzień z brzegu.`});
Object.assign(REQS.cieply,{say:'W szałasie wieje ze wszystkich stron. Zimy w nim nie przetrwamy.',end:p=>`W nowej chacie jest tak ciepło, że ${p.name} pierwszą noc śpi bez okrycia.`});
Object.assign(REQS,{
 lawa:{w:1,make:()=>S.people.some(p=>p.age>50)&&zLad('lawa')<2?mk(oldestZ(),{base:zLad('lawa')}):null,t:(r,p)=>`${p.name} ${gw(p,'chciałby','chciałaby')} ławę przed chatą`,
  say:'Nogi już nie te. Wieczorem chciałoby się usiąść i popatrzeć, jak dzieci się bawią.',d:'Budowa → Ład wsi → ława, przy chatach. Trzy kłody.',done:r=>zLad('lawa')>r.base,
  end:p=>{pamAdd(1);return`${p.name} siada na nowej ławie i od razu zaczyna opowiadać o statku. Dzieci zbierają się wokół.`}},
 grzadki:{w:1,make:()=>S.day>YEAR*.4&&zLad('grzadka')<4?mk(motherZ()||pickAdult(),{base:zLad('grzadka')}):null,t:(r,p)=>`${p.name} chce mieć warzywa przy domu`,
  say:'Jagody z lasu to nie wszystko. W domu, skąd płynęliśmy, każdy miał kawałek ziemi pod oknem.',d:'Budowa → Ład wsi → grządka, dwie sztuki. Od wiosny do jesieni dają warzywa.',done:r=>zLad('grzadka')>=r.base+2,
  end:p=>`${p.name} wsadza w ziemię pierwsze cebule. Mówi, że teraz to już naprawdę dom.`},
 sklad:{w:2,make:()=>!hasB('sklad')&&S.bld.filter(bDone).length>=5?mk(pickAdult(p=>p.job==='rob'||p.job==='bud')||pickAdult()):null,t:(r,p)=>`${p.name} ma dość noszenia wszystkiego do obozu`,
  say:'Wszystko nosimy do obozu, a potem z obozu z powrotem. Nogi bolą od samego chodzenia.',d:'Budowa → Magazyny → Skład, między lasem a budowami.',done:()=>hasB('sklad'),
  end:p=>`${p.name} zrzuca pierwsze kłody pod dachem składu. Droga jest teraz o połowę krótsza.`},
 opal:{w:2,make:()=>seasonIdx()===1&&S.res.opal<120?mk(oldestZ(),{until:Math.floor(S.day)+SD*2}):null,t:(r,p)=>`${p.name} boi się zimy`,
  say:'Kości bolą od wilgoci. Gdyby choć tej zimy było ciepło do samej wiosny.',d:'Drewutnia rąbie kłody na opał. Przed zimą trzeba mieć 120 porcji opału.',done:()=>S.res.opal>=120,
  end:p=>`Pod ścianami rosną sągi drewna. ${p.name} kiwa głową: tej zimy nikt nie zmarznie.`},
 kozy:{w:1,make:()=>S.bld.some(b=>b.kind==='zagroda'&&bDone(b))&&S.people.some(p=>p.age<6)?mk(motherZ()||pickAdult(),{base:zAnimals()}):null,t:(r,p)=>`${p.name} prosi o mleko dla małych`,
  say:'Najmłodsze słabo rosną. Kozie mleko by im pomogło.',d:'Hodowca w zagrodzie oswaja dzikie kozy. Potrzeba jeszcze dwóch kóz.',done:r=>zAnimals()>=r.base+2,
  end:p=>{S.health=clamp(S.health+.03,0,1);return`${p.name} przynosi dzban mleka prosto z zagrody. Dzieci piją na zmianę.`}},
 dom:{w:2,make:()=>S.day>YEAR*.6?mk(pickAdult(p=>p.age>=16&&p.age<26),{base:zHouses()}):null,t:(r,p)=>`${p.name} chce zamieszkać osobno`,
  say:'Śpimy u rodziców, we czworo pod jednym kocem. Chciałoby się mieć coś swojego.',d:'Budowa → Domy. Wystarczy każdy nowy dom.',done:r=>zHouses()>r.base,
  end:p=>`${p.name} wnosi do nowego domu własną łyżkę i miskę. To pierwsze rzeczy, które są tylko jej albo jego.`},
 kwiaty:{w:1,make:()=>{if(zLad('kwiaty')>=6||seasonIdx()===2)return null;const c=anyZ(S.people.filter(p=>p.age>=6&&p.age<12&&!S.reqs.some(r=>r.pid===p.id)));return mk(c,{base:zLad('kwiaty')})},t:(r,p)=>`${p.name} chce kwiatów pod oknami`,
  say:'Na łące rosną takie żółte. Można by je przesadzić do nas?',d:'Budowa → Ład wsi → kwiaty, trzy kępy. Nic nie kosztują.',done:r=>zLad('kwiaty')>=r.base+3,
  end:p=>`${p.name} podlewa kwiaty co rano z glinianego kubka. Wieś jest od razu weselsza.`},
 laznia:{w:1,make:()=>!hasB('laznia')&&bAvail('laznia')&&S.people.length>=16?mk(pickAdult()):null,t:(r,p)=>`${p.name} tęskni za gorącą parą`,
  say:'Po całym dniu przy glinie albo w lesie nie da się domyć w zimnym strumieniu.',d:'Budowa → Wspólnota → Łaźnia.',done:()=>hasB('laznia'),
  end:p=>{S.health=clamp(S.health+.04,0,1);return`W łaźni para gęsta jak mgła. ${p.name} wychodzi ${gw(p,'czerwony i szczęśliwy','czerwona i szczęśliwa')} prosto w śnieg.`}},
 gaj:{w:1,make:()=>!hasB('gaj')&&bAvail('gaj')?mk(oldestZ()):null,t:(r,p)=>`${p.name} szuka miejsca dla bogów`,
  say:'Dziadowie mieli miejsce, gdzie się nie rąbie drzew i nie podnosi głosu. Tu takiego nie mamy.',d:'Budowa → Wspólnota → Święty gaj. Najlepiej na wzgórzu, wśród starych drzew.',done:()=>hasB('gaj'),
  end:p=>{pamAdd(2,'gaj');return`${p.name} wiesza na najstarszym dębie pierwszy wieniec. Ludzie mówią tam ciszej.`}},
 slup:{w:1,make:()=>{if(!S.vname||!ladFreeRod())return null;const r=ladFreeRod();return mk(S.people.filter(p=>isAdult(p)&&String(p.rod)===String(r)&&!S.reqs.some(q=>q.pid===p.id)).sort((a,b)=>b.age-a.age)[0],{base:zLad('slup')})},t:(r,p)=>`${p.name} chce postawić słup rodu`,
  say:'Inne rody mają już swoje znaki przy domach. Nasz jeszcze nie.',d:'Budowa → Ład wsi → słup rodowy. Sześć kłód.',done:r=>zLad('slup')>r.base,
  end:p=>{pamAdd(1);return`${p.name} rzeźbi znak rodu do późnej nocy. Rano słup stoi przy obejściu.`}}});
Object.keys(REQS).forEach(k=>{const R=REQS[k],t0=R.take;R.take=r=>{if(t0)t0(r);const p=pById(r.pid);if(R.end&&p){try{log(R.end(p))}catch(e){}}}});
const reqSay=(R,r,p)=>R.say?(typeof R.say==='function'?R.say(r,p):R.say):'';
reqHTML=function(){S.reqs=S.reqs||[];let h='<h3>Prośby mieszkańców</h3>';if(!S.reqs.length)return h+'<p class="lead">Nikt teraz o nic nie prosi.</p>';
 S.reqs.forEach(r=>{const p=pById(r.pid);const R=REQS[r.k];if(!p||!R)return;const sy=reqSay(R,r,p);const left=Math.max(0,Math.ceil(r.until-S.day));
  h+=`<div class="card req zad"><h4>${R.t(r,p)}</h4>${sy?`<p style="font-style:italic">„${sy}”</p>`:''}<details><summary>Jak?</summary><p class="mut">${R.d}</p></details><p class="mut">Zostało ${left} ${dniW(left)}</p></div>`});return h};
function sprInit(){S.spr=S.spr||{a:[],ch:{}};S.spr.ch=S.spr.ch||{};S.spr.a=S.spr.a||[];return S.spr}
function sprTick(){if(!S||!S.people.length)return;const R=sprInit();
 for(const s of R.a.slice()){const p=pById(s.pid);const d=CHAIN[s.chain];if(d&&!p&&d.noRe){R.a.splice(R.a.indexOf(s),1);R.ch[s.chain]='x';if(d.lost)log(d.lost());continue}
  if(d&&!p){const q=s.chain==='kamien'?S.people.filter(x=>!x.born&&x.age>=30).sort((a,b)=>b.age-a.age)[0]:adultsZ()[0];if(q){s.pid=q.id;log(`${q.name} przejmuje sprawę: ${d.t.toLowerCase()}.`);continue}}
  if(!d||!p){R.a.splice(R.a.indexOf(s),1);if(d&&!p)R.ch[s.chain]=s.chain==='kamien'?undefined:'x';continue}
  if(d.ok(s)&&!evOpen&&!placing&&isWork()){R.a.splice(R.a.indexOf(s),1);R.ch[s.chain]='ok';d.fin(s,p);return}}
 chainTick()}
// ---------- wątki z historią ----------
function zDir(i,j){const a=Math.atan2(j-camp.j,i-camp.i)*180/Math.PI;const D=['na wschód','na południowy wschód','na południe','na południowy zachód','na zachód','na północny zachód','na północ','na północny wschód'];return D[((Math.round(a/45)%8)+8)%8]}
function zCoast(rMin,rMax){const r0=rng(SEED*7+91);let best=null;for(let t=0;t<4000;t++){const i=(r0()*N)|0,j=(r0()*N)|0,k=j*N+i;if(!land[k]||!walk[k]||!(reach&&reach[k]))continue;const d=Math.hypot(i-camp.i,j-camp.j);if(d<rMin||d>rMax)continue;
  let sea=false;for(let a=-2;a<=2&&!sea;a++)for(let b=-2;b<=2;b++){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<N&&y<N&&!land[y*N+x]){sea=true;break}}if(!sea||revAt(i,j))continue;let rv=0;for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(revAt(i+a,j+b))rv++;if(rv)continue;best=[i,j];break}return best}
const CHAIN={
 szalupa:{t:"Szukać szalupy",ok:s=>S.day>s.d0+1.2&&S.people.some(q=>q.state!=="away"&&Math.hypot(q.x-tcx(s.tg[0]),q.z-tcx(s.tg[1]))<4.5),how:s=>`Zwiadowca albo wyprawa. Brzeg, skąd przyszło wiosło, leży ${zDir(s.tg[0],s.tg[1])} od obozu, około ${Math.round(Math.hypot(s.tg[0]-camp.i,s.tg[1]-camp.j))} kroków stąd.`,
  say:()=>'Wiosło przyniosło morze z tamtej strony. Szalupa musiała gdzieś tam wyjść na brzeg.',
  fin:(s,p)=>{openEvent({ey:'Opowieść',t:'Szalupa',text:()=>`Zwiadowcy znajdują ją w małej zatoce, przewróconą dnem do góry i zasypaną piaskiem. Obok, pod kamieniami, są dwa groby, a na desce z burty ktoś wyrył dwa imiona.\n\nBosman Wszebor przeżył swoich ludzi. Pochował ich, a potem nie miał już siły iść dalej. Leży pod szalupą, owinięty w żagiel, z ręką na skrzyni.\n\n${p.name} długo stoi nad zatoką. Byli tak blisko. Kilka dni drogi brzegiem.`,
   opts:[{n:'Pochować bosmana obok jego ludzi',d:'pieśń o bosmanie, pamięć osady',f:()=>{pamAdd(3,'szalupa');song('Pieśń o bosmanie z szalupy','Wszebor');S.deadNames=(S.deadNames||[]).concat(['bosman Wszebor']);zChest();return'Trzy kopce nad zatoką, jeden przy drugim. Na desce z burty dochodzi trzecie imię. Skrzynia bosmana wraca z nimi do osady.'}},
    {n:'Zanieść go do osady',d:'nadzieja, jego imię przy naszych grobach',f:()=>{S.hope=clamp(S.hope+.04,0,1);pamAdd(2,'szalupa');S.deadNames=(S.deadNames||[]).concat(['bosman Wszebor']);zChest();return'Niosą go na noszach z wioseł przez dwa dni. Teraz leży wśród swoich, a dzieci znają jego imię.'}}]},{})}},
 kamien:{t:'Kamień z imionami',ok:s=>hasB('cmentarz')&&S.people.some(q=>(q.sk.kamieniarz||0)>=2)&&S.res.kamien>=20,
  how:()=>{const L=[];if(!hasB('cmentarz'))L.push('miejsce pamięci (Budowa → Wspólnota)');if(!S.people.some(q=>(q.sk.kamieniarz||0)>=2))L.push('ktoś, kto umie ciosać kamień (fach kamieniarza 2, kamieniołom)');if(S.res.kamien<20)L.push('20 kamienia');return L.length?'Potrzeba: '+L.join(', ')+'.':'Wszystko gotowe.'},
  say:()=>'Tamtej nocy na statku było nas więcej. Coraz mniej pamiętam ich twarzy. Imiona trzeba wyryć w kamieniu, póki ktoś je jeszcze zna.',
  fin:(s,p)=>{S.res.kamien-=20;openEvent({ey:'Opowieść',t:'Kamień z imionami',text:()=>{const mason=S.people.filter(q=>(q.sk.kamieniarz||0)>=2).sort((a,b)=>b.sk.kamieniarz-a.sk.kamieniarz)[0];return`${mason?mason.name:'Kamieniarz'} ciosa kamień przez cały tydzień. ${p.name} siedzi obok i dyktuje imiona, jedno po drugim. Przy niektórych długo milknie.\n\nNa końcu zostaje miejsce. Ktoś pyta, po co. ${p.name} mówi, że kiedyś będzie trzeba dopisać i nas.`},
   opts:[{n:'Postawić kamień przy grobach',d:'pieśń, pamięć osady, nadzieja',f:()=>{pamAdd(5,'kamien');song('Pieśń o kamieniu z imionami',p.name);S.hope=clamp(S.hope+.05,0,1);return'Kamień stoi na miejscu pamięci. W Dziady pali się przy nim najwięcej świateł.'}}]},{})}}};
function zChest(){S.res.narz=(S.res.narz||0)+2;S.res.gwozdzie=(S.res.gwozdzie||0)+40;S.res.plotno=(S.res.plotno||0)+4;log('W skrzyni bosmana: dwa żelazne narzędzia, garść gwoździ, zwój płótna i nóż z rękojeścią z kości.')}
function chainTick(){const R=S.spr;R.ch=R.ch||{};if(evOpen||placing||!isWork()||S.epoch===2)return;
 // wiosło na plaży
 if(!R.ch.szalupa&&S.day>=2.5&&(S.act||1)<=3&&S.people.length){const tg=zCoast(40,70)||zCoast(30,80);if(!tg){R.ch.szalupa='x';return}
  const p=anyZ(adultsZ().filter(q=>q.job!=='wyp'))||adultsZ()[0];if(!p)return;R.ch.szalupa='intro';
  openEvent({ey:'Opowieść',t:'Wiosło z napisem',text:()=>`${p.name} przynosi z dalekiego brzegu wiosło. Na piórze wypalone są litery: nazwa naszego statku.\n\nTamtej nocy szalupa odbiła od burty z bosmanem i dwoma marynarzami. Nikt nie wie, co się z nimi stało. Wiosło przyszło od strony, gdzie jeszcze nikt z nas nie był.`,
   opts:[{n:'Trzeba ich poszukać',d:'nowa sprawa: zwiad brzegiem',f:()=>{R.ch.szalupa='szuka';R.a.push({chain:'szalupa',id:'ch_szalupa',pid:p.id,d0:S.day,tg});return'Zwiadowcy dostają wiosło na drogę. Pójdą brzegiem, aż coś znajdą.'}},
    {n:'Morze ich zabrało',d:'nadzieja trochę spada',f:()=>{R.ch.szalupa='x';S.hope=clamp(S.hope-.02,0,1);return'Wiosło zostaje wbite w piasek przy obozie. Nikt o nim nie mówi, ale każdy na nie patrzy.'}}]},{});return}
 // kamień z imionami
 if(!R.ch.kamien&&S.wreck.gone&&(S.act||1)>=3){const p=S.people.filter(q=>!q.born&&q.age>=40).sort((a,b)=>b.age-a.age)[0];if(!p){if((S.act||1)>=5)R.ch.kamien='x';return}R.ch.kamien='szuka';
  R.a.push({chain:'kamien',id:'ch_kamien',pid:p.id,d0:S.day});log(`${p.name} prosi: kamień z imionami. „${CHAIN.kamien.say()}”`);toast(`${p.name} prosi: kamień z imionami`)}}
// zwiadowcy chętniej idą tam, skąd przyszło wiosło
{const _st=scoutTarget;scoutTarget=function(p){const s=S&&S.spr&&S.spr.a.find(x=>x.chain==='szalupa');if(s&&Math.random()<.3){const t=nearestWalk(s.tg[0],s.tg[1]);if(t)return t}return _st(p)}}
// ---------- widok: karta zadań w księdze Osada, podpowiedź pod celem ----------
function zadHTML(){if(!S)return'';const g=goalInfo();const R=sprInit();let h='<div class="card zad">';
 if(g){h+=`<p style="margin:0 0 4px"><span class="cz-ey">${g.ch||'Cel'}</span><br><b style="color:var(--hi)">${g.t}</b></p><p class="mut" style="margin:0 0 4px">${g.d||''}</p>${g.how&&g.how!==g.d?`<details><summary>Jak to zrobić?</summary><p class="mut">${g.how}</p></details>`:''}`}
 R.a.filter(s=>pById(s.pid)&&CHAIN[s.chain]).forEach(s=>{const d=CHAIN[s.chain],p=pById(s.pid);
  h+=`<div class="spr"><p style="margin:6px 0 2px"><span class="cz-ey">Opowieść</span><br><b style="color:var(--hi)">${d.t}</b> <span class="mut">· ${p.name}</span></p><p class="mut" style="margin:0;font-style:italic">„${d.say()}”</p><details><summary>Jak?</summary><p class="mut">${d.how(s)}</p></details></div>`});
 return h+'</div>'}
{const st=document.createElement('style');st.textContent=`.zad details{margin:2px 0 0}.zad summary{cursor:pointer;color:var(--gold);font-size:13px;list-style:none}.zad summary::-webkit-details-marker{display:none}.zad summary::before{content:'› ';}.zad details[open] summary::before{content:'⌄ '}.zad details p{margin:4px 0 0}.zad .spr{border-top:1px solid var(--line);padding-top:4px;margin-top:6px}
#cz-goal em{display:block;font-style:normal;font-size:12.5px;color:var(--mut);margin-top:3px;line-height:1.3}`;document.head.appendChild(st)}
{const _cs=czSumHTML;czSumHTML=function(){return _cs()+zadHTML()}}
{const _th=troubleHTML;troubleHTML=function(){return(!czOn&&S?zadHTML():'')+_th()}}
czShowGoal=function(){const g=goalInfo();if(!g)return;setH(czGoal,`<small>${g.ch||'Cel'}</small><span>${g.t}</span>${g.d&&g.d!==g.how?`<em>${g.d}</em>`:''}`);czGoal.classList.add('on');gameCancelLater(czGoalTm);czGoalTm=gameLater(()=>czGoal.classList.remove('on'),11000)};
{const _gt=goalsTick;goalsTick=function(){_gt();try{sprTick()}catch(e){console.warn(e)}}}
// ---------- 2.5: ślepe uliczki ----------
// kajuta: gdy sztorm zabrał wrak, zanim ktoś się do niej dostał, cel nie blokuje aktu
ACTS[1].g[2][1]=()=>S.wreck.parts[2].open||!!S.wreck.gone;
// koza: przeczucie z pracy myśliwych i hodowców, wiedza z próby
ACTS[3].g[1][2]='Przeczucie, jak oswoić kozy, przychodzi z pracy myśliwych i hodowców, a wiedzę daje próba (Wiedza → Hodowla). Potem zagroda i hodowca, blisko hal z kozami.';
ZH['Oswój pierwszą kozę']=()=>tech('h_zagr')?(S.bld.some(b=>b.kind==='zagroda')?'Zagroda stoi. Hodowca musi jeszcze zagnać kozy z hal.':'Wiemy już, jak podejść kozy. Brakuje płotu, za który można by je zagnać.'):'Myśliwi widzą dzikie kozy na halach, ale nikt jeszcze nie wie, jak je oswoić.';
// prośby tylko wtedy, gdy da się je spełnić
{const m=REQS.ubrania.make;REQS.ubrania.make=()=>hasB('szwalnia')?m():null}
{const m=REQS.cieply.make;REQS.cieply.make=()=>(S.res.gwozdzie>=16||hasB('kuznia'))?m():null}
// skrzynia kapitana: księgi, których nikt nie wyniósł przed sztormem, wracają z morzem
function bookRescueTick(){if(!S||!S.wreck||!S.wreck.gone||S.seen.skrzynia||S.epoch===2)return;
 const lost=[];S.wreck.parts.forEach(pt=>Object.entries(pt.items).forEach(([k,v])=>{if(k.startsWith('ks_')&&v>0&&!S.books[k.slice(3)])lost.push(k.slice(3))}));
 if(!lost.length){S.seen.skrzynia=1;return}S.skrzD=S.skrzD||S.day+1+Math.random();if(S.day<S.skrzD||evOpen||placing||!isWork())return;
 const p=adultsZ()[0];openEvent({ey:'Opowieść',t:'Skrzynia kapitana',text:()=>`Kilka dni po sztormie ${p?p.name:'ktoś'} znajduje na plaży okutą skrzynię oblepioną wodorostami. To skrzynia z kajuty kapitana. Smoła trzymała szczelnie: w środku, owinięte w natłuszczone płótno, leżą suche księgi.`,
  opts:[{n:'Zanieść do obozu',d:'księgi do przeczytania',f:()=>{S.seen.skrzynia=1;lost.forEach(b=>{if(!S.books[b])S.books[b]=1});S.wreck.parts.forEach(pt=>Object.keys(pt.items).forEach(k=>{if(k.startsWith('ks_'))pt.items[k]=0}));pamAdd(1);return'W skrzyni: '+lost.map(b=>'„'+BOOKS[b]+'”').join(' i ')+'. Trzeba je przeczytać (Praca → czytelnicy).'}}]},{})}
{const _st=sprTick;sprTick=function(){_st();try{bookRescueTick()}catch(e){}}}
// plac budowy tylko tam, dokąd da się dojść z osady
{const _cp=checkPlace;checkPlace=function(kind,i,j){if(!_cp(kind,i,j))return false;if(!reach)return true;const e=entryOf(kind,i,j);return!e||!!reach[e[1]*N+e[0]]}}
// zdunowie bez próby, czytelnicy bez księgi, zwiadowcy bez nieznanego: pomagają robotnikom, zamiast stać
{const _pj=planJob;planJob=function(p){const r=_pj(p);if(r||!S||!isWorker(p)||p.fireB||restNow(p)||!isWork())return r;const j=p.job;
  if(j!=='zdun'&&j!=='czyt'&&j!=='zwiad')return r;const why=p.act||'';p.job='rob';let ok=false;try{ok=_pj(p)}finally{p.job=j}
  if(ok)p.act=(j==='zdun'?'nie ma próby, pomaga: ':j==='czyt'?'nie ma co czytać, pomaga: ':'okolica odkryta, pomaga: ')+p.act;else p.act=why;return ok}}
window.__zad={bookRescueTick,goalInfo:()=>goalInfo(),CHAIN,sprTick,zadHTML,wreckEmpty,zCoast,chainTick};
