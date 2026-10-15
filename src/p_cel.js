
/* ================= 3.3.1 Cele krok po kroku: opis i podpowiedź zawsze wskazują następny brakujący krok ================= */
// Wcześniej podpowiedź do celu była stała: przy „Oswój pierwszą kozę” pulsował przycisk budowy zagrody także wtedy,
// gdy zagroda już stała, a brakowało hodowcy albo kóz w jej zasięgu. Teraz każdy cel sprawdza stan osady i mówi, co dalej.
const plW=(n,a,b,c)=>n===1?a:(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?b:c;
const celCat=c=>(CATS.find(x=>x[0]===c)||[])[1]||'';
// biernik nazwy budynku: zagroda → zagrodę, chata zbieracza → chatę zbieracza, szałas → szałas
const celAcc=n=>{const w=n.split(' ');w[0]=w[0].toLowerCase();if(w[0]!=='żarna')w[0]=w[0].replace(/a$/,'ę');return w.join(' ')};
// budynki liczą się razem z tym, w co je rozbudowano (szałas → chata → dom)
const CEL_UP={szalas:['szalas','chata','dom'],chata:['chata','dom']};
const celCnt=k=>S.bld.filter(b=>(CEL_UP[k]||[k]).includes(b.kind)&&bDone(b)).length;
function celMiss(cost){return Object.entries(cost||{}).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>`${(RN[k]||k).toLowerCase()} ${Math.ceil(v-(S.res[k]||0))}`)}
function celNeed(k){const n=BD[k].need,t=TECH_BY[n];
 if(t){const st=techState(t),pc=t.xp?Math.round(100*(S.tp[t.id]||0)/t.xp):0;const dn=(DOMS.find(d=>d[0]===t.d)||[])[1]||'Wiedza';
  return{txt:st==='avail'?`najpierw wiedza „${t.n}” (Wiedza → ${dn}): ${pc}%, rośnie z pracy w tej dziedzinie`:`najpierw wiedza „${t.n}” (Wiedza → ${dn}); wcześniej trzeba poznać to, co ją poprzedza`,hint:['wiedza',null,st==='avail'?`[data-focus="${t.id}"]`:null]}}
 const tr=typeof TRIAL!=='undefined'&&TRIAL[n];if(tr)return{txt:`najpierw próba: ${tr.n.toLowerCase()} (Wiedza → Próby)`,hint:['wiedza',null,`[data-try="${n}"]`]};
 return{txt:'najpierw trzeba to odkryć na wyspie',hint:null}}
// budowa: stoi? w budowie? czego brakuje?
function celBuild(k,n,o){o=o||{};n=n||1;const d=BD[k];const done=celCnt(k);if(done>=n)return{ok:1,txt:''};
 const sites=S.bld.filter(b=>(CEL_UP[k]||[k]).includes(b.kind)&&!bDone(b));
 if(sites.length&&sites.length>=n-done){const b=sites[0],pr=Math.round(100*b.prog/b.work),mt=b.mat?Math.round(100*Math.min(1,(b.del||0)/b.mat)):100;
  let t=`${BD[b.kind].n}: budowa ${pr}%${b.mat&&mt<100?`, materiał na miejscu ${mt}%`:''}.`;
  if(freeCount()<=0)return{txt:t+' Nikt nie buduje: wszyscy mają przydział. Zwolnij kogoś w zakładce Praca.',hint:['praca',null,null]};
  return{txt:t+' Budową zajmują się wolni robotnicy.',wait:1}}
 if(!bAvail(k)){const N=celNeed(k);return{txt:`${d.n}: ${N.txt}.`,hint:N.hint,wait:!N.hint}}
 const miss=celMiss(d.cost);const pre=(done||n>1)&&!o.noPre?`Stoi ${done} z ${n}. `:'';
 return{txt:pre+(miss.length?`Na ${celAcc(d.n)} brakuje: ${miss.join(', ')}.`:`Można postawić ${celAcc(d.n)} (Budowa → ${celCat(d.cat)}).`)+(o.where?' '+o.where:''),hint:['budowa',d.cat,`[data-b="${k}"]`],kind:k}}
const celWorkers=b=>S.people.filter(p=>p.job==='wb'&&p.wb===b.id);
const celAddW=b=>['praca',null,`[data-w="${b.id}"][data-d="1"]`];
function celHouseKind(){return bAvail('chata')&&canAfford(BD.chata.cost)?'chata':'szalas'}
// ---------- kroki celów epoki I ----------
const CEL={
 'Postaw chatę zbieracza':()=>celBuild('zbieracz',1,{where:'Najlepiej przy krzewach jagód i grzybach.'}),
 'Postaw chatę drwala':()=>celBuild('drwal',1,{where:'Najlepiej na skraju lasu.'}),
 'Każda rodzina pod własnym dachem':()=>{const hf=Object.values(S.fams).filter(f=>famMembers(f.id).length&&!(f.home&&bById(f.home)&&bDone(bById(f.home))));
  if(!hf.length)return{txt:'Wszyscy mają już dach nad głową.',wait:1};const ppl=hf.reduce((a,f)=>a+famMembers(f.id).length,0);
  const sites=S.bld.filter(b=>BD[b.kind].house&&!bDone(b));const head=`Pod gołym niebem: ${hf.length} ${plW(hf.length,'rodzina','rodziny','rodzin')} (${ppl} ${osb(ppl)}).`;
  if(sites.length>=hf.length){const s=celBuild(sites[0].kind,celCnt(sites[0].kind)+1,{noPre:1});return{txt:head+' '+s.txt,hint:s.hint,wait:s.wait}}
  const k=celHouseKind();const s=celBuild(k,celCnt(k)+1,{noPre:1});return{txt:head+(sites.length?` W budowie ${sites.length}, potrzeba jeszcze ${hf.length-sites.length}.`:'')+' '+s.txt,hint:s.hint,kind:s.kind}},
 'Postaw drewutnię i zgromadź 80 opału':()=>{const s=celBuild('drewutnia',1);if(!s.ok)return s;const dw=S.bld.find(b=>b.kind==='drewutnia'&&bDone(b));
  if(S.res.opal>=80)return{txt:`Opału jest ${fmt(S.res.opal)}.`,wait:1};
  if(!celWorkers(dw).length)return{txt:`Drewutnia stoi, ale nikt w niej nie rąbie. Przydziel do niej ludzi (Praca). Opał: ${fmt(S.res.opal)} z 80.`,hint:celAddW(dw)};
  if(S.res.drewno<2){const dr=S.bld.find(b=>b.kind==='drwal'&&bDone(b));return{txt:`W drewutni nie ma czego rąbać: kłód ${fmt(S.res.drewno)}. Drwale muszą najpierw ściąć drzewa.`,hint:dr?celAddW(dr):['budowa','surowce','[data-b="drwal"]']}}
  return{txt:`Drewutnia rąbie kłody: opał ${fmt(S.res.opal)} z 80.`,wait:1}},
 'Przeczytaj księgę z wraku':()=>{const bk=Object.keys(S.books).find(k=>S.books[k]===1);if(!bk)return null;const pc=Math.round(100*(S.readP[bk]||0)/200);
  if(S.people.some(p=>p.job==='czyt'))return{txt:`Czytanie „${BOOKS[bk]}”: ${pc}%.`,wait:1};
  return{txt:`„${BOOKS[bk]}” leży w obozie. Przydziel czytelnika (Praca → Czytelnicy).${pc?` Przeczytano ${pc}%.`:''}`,hint:['praca',null,'[data-al="czyt"][data-d="1"]']}},
 'Oswój pierwszą kozę':()=>{
  if(!tech('h_zagr')){const t=TECH_BY.h_zagr,st=techState(t),pc=Math.round(100*(S.tp.h_zagr||0)/t.xp);
   return st==='avail'?{txt:`Najpierw wiedza „Oswajanie kóz” (Wiedza → Hodowla): ${pc}%. Rośnie z pracy myśliwych i rybaków, szybciej, gdy osada się na niej skupi.`,hint:['wiedza',null,'[data-focus="h_zagr"]']}
    :{txt:'Najpierw trzeba poznać tropienie zwierzyny, a potem oswajanie kóz (Wiedza → Hodowla). Wiedza rośnie z pracy myśliwych i rybaków.',hint:['wiedza',null,null]}}
  const seen=S.herds.filter(h=>{if(h.type!=='koza'||h.n<=0)return false;const t=tileOf(h.x,h.z);return revAt(t[0],t[1])});
  const near=(x,z)=>seen.map(h=>[h,Math.hypot(h.x-x,h.z-z)]).sort((a,b)=>a[1]-b[1])[0];
  const where=()=>{const c=near(tcx(camp.i),tcx(camp.j));if(!c)return'Nikt jeszcze nie widział dzikich kóz: zwiadowcy muszą odsłonić hale.';const t=tileOf(c[0].x,c[0].z),r=regionAt(t[0],t[1]);return`Dzikie kozy pasą się ${Math.round(c[1])} kroków od obozu${r&&r.known&&r.name?`, w krainie ${r.name}`:''}. Zagroda musi stać najwyżej ${BD.zagroda.r+3} kroków od nich.`};
  const pens=S.bld.filter(b=>b.kind==='zagroda'),done=pens.filter(bDone);
  if(!done.length){const s=celBuild('zagroda',1);if(!s.wait&&s.kind)s.txt+=' '+where();return s}
  const inR=b=>{const c=bCenter(b);return seen.filter(h=>Math.hypot(h.x-c.x,h.z-c.z)<=rOf(b)+3).reduce((a,h)=>a+h.n,0)};
  const best=done.slice().sort((a,b)=>inR(b)-inR(a)||celWorkers(b).length-celWorkers(a).length)[0],n=inR(best),ws=celWorkers(best);
  if(n<=0){if(!seen.length)return{txt:'Zagroda stoi, ale nikt jeszcze nie widział dzikich kóz. Zwiadowcy muszą odsłonić hale (Praca → Zwiadowcy).',hint:['praca',null,'[data-al="zwiad"][data-d="1"]']};
   const c=near(bCenter(best).x,bCenter(best).z);const t=tileOf(c[0].x,c[0].z),r=regionAt(t[0],t[1]);
   return{txt:`Zagroda stoi, ale w jej zasięgu nie ma dzikich kóz. Najbliższe stado pasie się ${Math.round(c[1])} kroków od zagrody${r&&r.known&&r.name?`, w krainie ${r.name}`:''}, a zasięg to ${rOf(best)+3}. Postaw zagrodę bliżej hal albo poczekaj, aż kozy zejdą niżej.`,hint:['budowa','uprawa','[data-b="zagroda"]'],kind:'zagroda'}}
  if(!ws.length)return{txt:`Zagroda stoi, a w pobliżu pasą się kozy (${n}). Brakuje hodowcy: przydziel kogoś do zagrody (Praca).`,hint:celAddW(best)};
  return{txt:`${ws[0].name} oswaja dzikie kozy w pobliżu zagrody (${n}). ${(best.animals||0)?'Kolejna':'Pierwsza'} będzie po trzech podejściach, teraz ${best.tame||0} z 3.`,wait:1}},
 'Zbierz pierwsze plony z pola':()=>{if(S.know.pole!=='tak')return null;const done=S.bld.filter(b=>b.kind==='pole'&&bDone(b));
  if(!done.length){const s=celBuild('pole',1);if(S.res.ziarno<10&&!s.wait)s.txt+=` Do siewu potrzeba 10 ziarna, jest ${fmt(S.res.ziarno)}.`;return s}
  const ripe=done.find(b=>b.field&&b.field.st==='dojrzale'),grow=done.find(b=>b.field&&b.field.st==='rosnie');
  const noW=b=>!celWorkers(b).length;
  if(ripe)return noW(ripe)?{txt:'Zboże dojrzało, ale nikt nie pracuje na polu. Przydziel rolnika (Praca).',hint:celAddW(ripe)}:{txt:'Zboże dojrzało: rolnicy zbierają plony.',wait:1};
  if(grow){const g=Math.round(100*(grow.field.g||0));return noW(grow)?{txt:`Zboże rośnie: ${g}%. Bez rolnika zarośnie chwastami: przydziel kogoś do pola (Praca).`,hint:celAddW(grow)}:{txt:`Zboże rośnie: ${g}%. Rolnicy pielą.`,wait:1}}
  if(!inSow())return{txt:'Pole czeka na siew: ziarno idzie w ziemię wiosną albo na początku lata.'+(S.res.ziarno<10?` Do siewu potrzeba 10 ziarna, jest ${fmt(S.res.ziarno)}.`:''),wait:1};
  if(S.res.ziarno<10)return{txt:`Pora siewu, ale brakuje ziarna: jest ${fmt(S.res.ziarno)}, potrzeba 10. Zbieracze znajdują dzikie zboże.`,wait:1};
  const f0=done[0];return noW(f0)?{txt:'Pora siewu. Przydziel rolnika do pola (Praca).',hint:celAddW(f0)}:{txt:'Pora siewu: rolnicy sieją.',wait:1}},
 'Osada: 4 domy i 20 osób':()=>celVillage(4,20),
 'Wieś: 8 domów i 32 osoby':()=>celVillage(8,32),
 'Wytop żelazo':()=>{const k=S.know;if(k.kuznia==='tak')return{ok:1,txt:''};
  if(S.books.kowal!==2){if(S.books.kowal===1)return CEL['Przeczytaj księgę z wraku']()||{txt:'Księgę kowalską trzeba przeczytać (Praca → Czytelnicy).',hint:['praca',null,'[data-al="czyt"][data-d="1"]']};
   return S.wreck&&!S.wreck.gone?{txt:'Księga kowalska leży w kajucie kapitana na wraku. Najpierw trzeba się do niej dostać (Praca → Wrak).',hint:['praca',null,'[data-wt="2"]']}:{txt:'Księga kowalska przepadła z wrakiem. Może morze jeszcze coś odda.',wait:1}}
  if(k.active==='kuznia'){const pc=Math.round(100*(k.kuznia_p||0)/TRIAL.kuznia.need);return S.people.some(p=>p.job==='zdun')?{txt:`Próba wytopu: ${pc}%.${k.kuznia_f?` Nieudanych prób: ${k.kuznia_f}.`:''}`,wait:1}:{txt:`Próba wytopu stoi (${pc}%): nikt jej nie prowadzi. Przydziel zduna (Praca → Próby).`,hint:['praca',null,'[data-al="zdun"][data-d="1"]']}}
  if(k.active)return{txt:`Trwa inna próba (${TRIAL[k.active].n.toLowerCase()}). Wytop zacznie się po niej.`,wait:1};
  const c=TRIAL.kuznia.cost;if((S.res.ruda||0)<c.ruda){const s=celBuild('ruda',1);if(!s.ok)return{txt:`Do wytopu potrzeba ${c.ruda} rudy, jest ${fmt(S.res.ruda||0)}. `+s.txt,hint:s.hint,kind:s.kind,wait:s.wait};const b=S.bld.find(b=>b.kind==='ruda'&&bDone(b));return!celWorkers(b).length?{txt:`Do wytopu potrzeba ${c.ruda} rudy, jest ${fmt(S.res.ruda||0)}. Przy rudzie nikt nie pracuje (Praca).`,hint:celAddW(b)}:{txt:`Kopią rudę: ${fmt(S.res.ruda||0)} z ${c.ruda}.`,wait:1}}
  if((S.res.wegiel||0)<c.wegiel){const s=celBuild('mielerz',1);if(!s.ok)return{txt:`Do wytopu potrzeba ${c.wegiel} węgla drzewnego, jest ${fmt(S.res.wegiel||0)}. `+s.txt,hint:s.hint,kind:s.kind,wait:s.wait};const b=S.bld.find(b=>b.kind==='mielerz'&&bDone(b));return!celWorkers(b).length?{txt:`Do wytopu potrzeba ${c.wegiel} węgla, jest ${fmt(S.res.wegiel||0)}. Przy mielerzu nikt nie pracuje (Praca).`,hint:celAddW(b)}:{txt:`Mielerz pali węgiel: ${fmt(S.res.wegiel||0)} z ${c.wegiel}.`,wait:1}}
  return{txt:`Ruda i węgiel są. Zacznij próbę wytopu (Wiedza → Próby → Kuźnia).${k.kuznia_f?` Nieudanych prób: ${k.kuznia_f}.`:''}`,hint:['wiedza',null,'[data-try="kuznia"]']}},
 'Poznaj 70% krain wyspy':()=>{const pc=Math.round(knownFrac()*100);const sc=S.people.filter(p=>p.job==='zwiad').length,ex=(S.exps||[]).length;
  return sc||ex?{txt:`Znamy ${pc}% krain z 70%. ${sc?`Zwiadowców: ${sc}.`:''}${ex?` Wypraw w drodze: ${ex}.`:''}`,wait:1}:{txt:`Znamy ${pc}% krain z 70%. Nikt nie chodzi na zwiad: przydziel zwiadowców (Praca) albo wyślij wyprawę.`,hint:['praca',null,'[data-al="zwiad"][data-d="1"]']}},
 'Załóż pierwszy przysiółek':()=>{if((S.hamlets||[]).length)return{ok:1,txt:''};const why=typeof kolWhyNot==='function'?kolWhyNot():'';
  if(!why)return{txt:'Są chętni i jest poznana kraina bez przysiółka. Ludzie → Wspólnota → Nowy przysiółek.',hint:['osada',null,'[data-knew]']};
  if(/krainy/.test(why))return{txt:why,hint:['praca',null,'[data-al="zwiad"][data-d="1"]']};if(/Osada/.test(why)){const v=celVillage(4,20);return{txt:why+' '+v.txt,hint:v.hint,kind:v.kind,wait:v.wait}}
  if(/rodziny/.test(why)){const k=celHouseKind();return{txt:why+' Chętniej idą młode pary, które czekają na własny dom.',wait:1}}return{txt:why,wait:1}},
 'Odkryj trzy ślady dawnego ludu':()=>{const sc=S.people.filter(p=>p.job==='zwiad').length,ex=(S.exps||[]).length;
  return sc||ex?{txt:`Znaleźliśmy ${S.found.length} z 3 śladów. Zwiadowcy i wyprawy szukają w głębi lądu.`,wait:1}:{txt:`Znaleźliśmy ${S.found.length} z 3 śladów. Ślady leżą w głębi lądu: przydziel zwiadowców (Praca) albo wyślij wyprawę.`,hint:['praca',null,'[data-al="zwiad"][data-d="1"]']}}};
function celVillage(H,P){const h=zHouses(),p=S.people.length;
 if(h<H){const k=celHouseKind();const s=celBuild(k,celCnt(k)+1,{noPre:1});return{txt:`Domów ${h} z ${H}, ludzi ${p} z ${P}. `+s.txt,hint:s.hint,kind:s.kind,wait:s.wait}}
 if(p>=P)return{txt:`Domów ${h}, ludzi ${p}. Wieś awansuje o świcie.`,wait:1};
 const wait=S.people.filter(q=>q.waitHome&&q.sex==='k').length;
 if(wait){const k=celHouseKind();const s=celBuild(k,celCnt(k)+1,{noPre:1});return{txt:`Ludzi ${p} z ${P}. ${wait===1?'Młoda para czeka':`${wait} ${plW(wait,'para czeka','pary czekają','par czeka')}`} na własny dom, a bez niego nie będzie dzieci. `+s.txt,hint:s.hint,kind:s.kind,wait:s.wait}}
 const full=Object.values(S.fams).some(f=>typeof rodSpace==='function'&&f.home&&rodSpace(f)<=0&&famMembers(f.id).some(w=>w.sex==='k'&&w.pair!==null&&w.age>=18&&w.age<46));
 return{txt:`Domów ${h}, ludzi ${p} z ${P}. Ludzi przybywa z narodzin${full?'; w niektórych domach jest już ciasno, nowy dom zrobi miejsce na dzieci':''}.`,wait:!full,hint:full?['budowa','dom',`[data-b="${celHouseKind()}"]`]:null,kind:full?celHouseKind():null}}
// „Osada” i „Wieś” zaliczają się od razu, gdy liczby się zgadzają (wcześniej dopiero o świcie)
try{ACTS[3].g.forEach(g=>{if(g[0]==='Osada: 4 domy i 20 osób'){const f=g[1];g[1]=()=>f()||tierOf()>=1}});ACTS[5].g.forEach(g=>{if(g[0]==='Wieś: 8 domów i 32 osoby'){const f=g[1];g[1]=()=>f()||tierOf()>=2}})}catch(e){}
// pamięć podręczna: kroki liczą się najwyżej kilka razy na sekundę
const celC={};
function celGet(t){const f=CEL[t];if(!f||!S)return null;const now=performance.now(),c=celC[t];if(c&&now-c.at<350)return c.v;let v=null;try{v=f()}catch(e){console.warn('cel',t,e);v=null}celC[t]={at:now,v};return v}
// wpięcie: opis (ZH), czekanie (ZW) i podpowiedź (HINT) czytają bieżący krok
{const HINT0=Object.assign({},HINT),ZH0=Object.assign({},ZH),ZW0=Object.assign({},ZW);
 Object.keys(CEL).forEach(t=>{
  ZH[t]=()=>{const s=celGet(t);return s&&s.txt?s.txt:(ZH0[t]?ZH0[t]():'')};
  ZW[t]=()=>{const s=celGet(t);return s?!!s.wait:(ZW0[t]?ZW0[t]():false)};
  Object.defineProperty(HINT,t,{configurable:true,enumerable:true,get:()=>{const s=celGet(t);return s?(s.hint||undefined):HINT0[t]}})})}
// „Postaw tu” proponuje budynek celu tylko wtedy, gdy naprawdę trzeba go postawić
czGoalKind=function(){const g=goalInfo();if(!g)return null;if(g.kind!==undefined)return g.kind;const s=celGet(g.t);if(s)return s.kind||null;const h=HINT[g.t];const m=h&&String(h[2]).match(/data-b="(\w+)"/);return m?m[1]:null};
// ---------- epoka II i III: postęp przy każdym celu ----------
// czy w wyrażeniu jest && albo ? poza nawiasami (wtedy to nie jest prosty licznik)
function celTop(x){let d=0;for(let i=0;i<x.length;i++){const c=x[i];if(c==='('||c==='['||c==='{')d++;else if(c===')'||c===']'||c==='}')d--;else if(d===0&&(c==='?'||(c==='&'&&x[i+1]==='&')))return true}return false}
function celProg(f){const src=String(f).replace(/\s+/g,' ');const m=src.match(/^\(\)=>\s*(.+?)\s*>=\s*(\d+)\s*$/);if(!m||celTop(m[1]))return null;
 let v;try{v=eval(m[1])}catch(e){return null}if(typeof v!=='number'||!isFinite(v))return null;return[Math.floor(v),+m[2]]}
function celKinds(f){const out=[];String(f).replace(/(?:hasDone|cntDone|hasB)\('(\w+)'\)|kind==='(\w+)'/g,(m,a,b)=>{const k=a||b;if(BD[k]&&!out.includes(k))out.push(k)});return out}
// cele epoki II ze złożonym warunkiem: postęp opisany słowami
const CEL2={
 'Każda rodzina w chacie albo domu':()=>{const f=Object.values(S.fams).filter(x=>famMembers(x.id).length);const bad=f.filter(x=>{const h=x.home&&bById(x.home);return!(h&&h.kind!=='szalas'&&bDone(h))});return bad.length?`W szałasie albo bez domu: ${bad.length} ${plW(bad.length,'rodzina','rodziny','rodzin')} z ${f.length}. Szałas rozbudujesz w chatę z jego karty.`:''},
 'Drogi do wszystkich przysiółków':()=>{const h=S.hamlets||[];const r=h.filter(x=>x.road===2).length;return h.length<2?`Przysiółków: ${h.length}, potrzeba co najmniej dwóch.`:`Drogi do ${r} z ${h.length} przysiółków.`},
 'Droga do najdalszego przysiółka':()=>{const h=typeof e2FarHam==='function'?e2FarHam():null;return!h?'Nie ma jeszcze przysiółka.':(S.hamlets||[]).length<2?'Potrzeba co najmniej dwóch przysiółków.':h.road===2?'':`Najdalszy przysiółek to ${h.name}. Drogę zaczyna się z jego karty (Ludzie → Wspólnota).`},
 'Każdy przysiółek ma zapasy':()=>{const h=S.hamlets||[];const ok=h.filter(x=>(x.zap||0)>=.4);return h.length<2?`Przysiółków: ${h.length}, potrzeba co najmniej dwóch.`:`Zapasy ma ${ok.length} z ${h.length} przysiółków${h.length>ok.length?`; brakuje w: ${h.filter(x=>(x.zap||0)<.4).map(x=>x.name).join(', ')}`:''}.`},
 'Mistrz w każdym fachu':()=>{const miss=Object.keys(CN).filter(c=>!S.people.some(p=>p.sk[c]>=3));return miss.length?`Brakuje mistrzów: ${miss.map(c=>CN[c]).join(', ')}.`:''},
 'Każda rodzina z pełną spiżarką':()=>{const n=Object.values(S.fams).filter(f=>famMembers(f.id).length).length;const k=typeof e2FullSp==='function'?e2FullSp():0;return`Pełne spiżarki: ${k} z ${n} rodzin.`}};
function celAct(){if(!S)return null;if(typeof e3On==='function'&&e3On()&&S.e3&&typeof E3A!=='undefined')return E3A[S.e3.a]||null;if(S.epoch===2&&typeof e2Act==='function')return e2Act();return null}
{const _gi=goalInfo;goalInfo=function(){const g=_gi();if(!g||!S||(!(S.epoch===2)&&!(typeof e3On==='function'&&e3On())))return g;
  const A=celAct();const x=A&&A.g&&A.g.find(q=>q[0]===g.t);if(!x)return g;let d='',kind=null;
  if(CEL2[g.t]){try{d=CEL2[g.t]()}catch(e){d=''}return Object.assign({},g,{d:d||g.d,how:x[2]})}
  const ks=celKinds(x[1]);if(ks.length&&/hasDone|cntDone|hasB|kind===/.test(String(x[1]))&&!/e2InWal|road|\.pop/.test(String(x[1]))){const p=celProg(x[1]);const s=celBuild(ks[0],p?p[1]:1);if(!s.ok){d=s.txt;kind=s.kind||null}}
  else if(!(typeof e3On==='function'&&e3On())){const p=celProg(x[1]);if(p&&p[1]>1)d=`Postęp: ${Math.min(p[0],p[1])} z ${p[1]}.`}
  return Object.assign({},g,{d:d?`${d}`:g.d,how:x[2],kind})}}
// prośba o kozie mleko: „Jak?” mówi, czego teraz brakuje
try{const d0=REQS.kozy.d;Object.defineProperty(REQS.kozy,'d',{configurable:true,enumerable:true,get:()=>{try{const s=S&&CEL['Oswój pierwszą kozę']();return s&&s.txt?s.txt:d0}catch(e){return d0}}})}catch(e){}
window.__cel={CEL,celGet,celBuild,celProg,celKinds,flush:()=>{for(const k in celC)delete celC[k]}};
