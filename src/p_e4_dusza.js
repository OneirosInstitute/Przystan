
/* ================= 4.8.0-rc.3 Dusza osadnika w epoce IV ================= */
// Rody mają te same usposobienia, nastrój, dzień, wspomnienia, wieczory, noce, sny i małe sceny co wcześniejsze epoki.
// Gospodarka rodów liczy się osobno (E4Economy), więc tu jest dzienny most: z pracy rodów powstaje zapis dnia,
// z narodzin, ślubów, przeprowadzek, śmierci i nauk powstają wspomnienia, a nastrój wraca do pracy (useLabor, ±8%).
function e4Who(id){return S.people.find(p=>p.id===id)||(S.e4&&S.e4.archive[id])||null}
function e4Kin(a,b){return a.fam===b.fam||(a.par||[]).includes(b.id)||(b.par||[]).includes(a.id)||((a.par||[]).length&&(b.par||[]).some(id=>(a.par||[]).includes(id)))}
function duszaE4Daily(){if(!S||S.epoch!==4||!S.e4)return;const d=Math.floor(S.day),alive=new Set(S.people.map(p=>p.id));
 // śmierć: kogo wczoraj było, a dziś już nie ma
 const before=S.e4Alive||[];for(const id of before){if(alive.has(id))continue;const dead=S.e4.archive[id];if(!dead||!dead.name)continue;
  S.people.filter(q=>e4Kin(q,dead)||relGet(q,{id})>=30).forEach(q=>memAdd(q,'smierc',dead.name,q.pair===id||(dead.par||[]).includes(q.id)||(q.par||[]).includes(id)?-.75:-.45,1));
  S.zmarli=S.zmarli||[];S.zmarli.push([d,dead.name,dead.sex]);if(S.zmarli.length>30)S.zmarli.shift()}
 S.e4Alive=[...alive];
 const done=(S.e4.nauki&&S.e4.nauki.done)||{},knew=new Set(S.e4NDone||[]);
 for(const p of S.people){soulOf(p);const z=dzOf(p);
  // zapis dnia z pracy rodów: godziny na fach (skala jak przy pracy w osadzie)
  const w=p.e4LastWork;if(w&&w.skill&&w.hours>0&&w.day!==undefined&&Math.abs(w.day-(d-1))<=1)z.w[w.skill]=(z.w[w.skill]||0)+w.hours*25;
  if((p.par||[]).length&&p.age<1&&!p.mB){p.mB=1;p.par.map(id=>S.people.find(q=>q.id===id)).filter(Boolean).forEach(q=>memAdd(q,'dziecko',p.name,MEMW.dziecko,1))}
  if(p.pair!==null&&p.pair!==undefined&&p.mPair!==p.pair){if(p.mPair!==undefined){const q=e4Who(p.pair);if(q)memAdd(p,'slub',q.name,MEMW.slub,1)}p.mPair=p.pair}
  if(p.mSet!==undefined&&p.mSet!==p.settlementId&&!p.e4Transport){const st=S.e4.settlements[p.settlementId];if(st)memAdd(p,'dom','nowy dom: '+st.name,MEMW.dom,1)}
  if(!p.e4Transport)p.mSet=p.settlementId;
  for(const id of Object.keys(done))if(!knew.has(id)&&p.age>=12&&Math.random()<.5){const r=E4Catalog.research[id];if(r)memAdd(p,'radosc','nowa nauka: '+r.name.toLowerCase())}
  // zadowolenie z życia rodów: jedzenie, ciepło, zdrowie, bliscy
  const fed=Number.isFinite(p.e4Fed)?p.e4Fed:(Number.isFinite(p.fedR)?p.fedR:1),warm=Number.isFinite(p.warm)?p.warm:1,fr=relsOf(p).some(x=>x[1]>=30)||S.people.some(q=>q!==p&&q.fam===p.fam);
  p.zad=clamp(.36*fed+.2*warm+.26*p.hp+.18*(fr?1:.55),0,1);moodCalc(p)}
 S.e4NDone=Object.keys(done)}
{const _ed=e4Daily;e4Daily=function(state){const r=_ed(state);try{duszaE4Daily()}catch(e){console.warn('dusza IV',e)}return r}}
// wieczory, noce, poranki i małe sceny płyną z zegarem rodów
{const _st=step;step=function(dt){_st(dt);if(S?.epoch!==4)return;try{wTick()}catch(e){console.warn('wieczór IV',e)}try{sceneTick()}catch(e){console.warn('sceny IV',e)}}}
// obraz rodów nie woła klasycznej klatki mapy, więc dymki rozmów pokazuje się tutaj
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(S?.epoch!==4)return;try{czTalkTick()}catch(e){}try{scBubFrame()}catch(e){}}}

/* ---- wieczór po swojemu w epoce IV (E4Life pyta o to przez environment.evening) ---- */
function e4Evening(state,person,time){if(!person.lub||person.age<12||person.e4Transport)return null;const d=Math.floor(time),h=dHash(person.id,d+313)%100;
 const st=state.e4.settlements[person.settlementId];if(!st)return null;const home=q=>{try{return E4Life.home(state,q)}catch(e){return null}};
 const sm=(person.mem||[]).some(m=>m[1]==='smierc'&&d-m[0]<=3);
 if(sm&&st.id==='przystan'){const g=S.bld.find(b=>b.kind==='cmentarz'&&bDone(b));if(g){const t=entryOf(g.kind,g.i,g.j);if(t)return{text:'stoi przy grobie bliskiej osoby',target:{x:tcx(t[0]),z:tcx(t[1])}}}}
 let w=18;if(usp(person,'gadula')||usp(person,'wesoly'))w+=8;if(usp(person,'marzy'))w+=6;if(h>=w)return null;const k=dHash(person.id,d+71)%4;
 if(k<=1){const fr=relsOf(person).filter(x=>x[1]>=18&&x[0].settlementId===person.settlementId&&x[0].fam!==person.fam&&!x[0].e4Transport).map(x=>x[0]);
  const kin=state.people.filter(q=>q!==person&&q.settlementId===person.settlementId&&q.fam!==person.fam&&!q.e4Transport&&e4Kin(person,q));const L=fr.concat(kin);
  if(L.length){const f=L[dHash(person.id,d)%L.length],t=home(f);if(t)return{text:'siedzi '+zInst(f)+' przed '+gw(f,'jego','jej')+' domem',target:{x:t.x+(person.id%2?.8:-.8),z:t.z+.6}}}}
 if(k===2&&(usp(person,'bogo')||usp(person,'zabobon'))&&st.id==='przystan'){const g=S.bld.find(b=>b.kind==='gaj'&&bDone(b));if(g){const t=entryOf(g.kind,g.i,g.j);if(t)return{text:'siedzi pod świętym dębem',target:{x:tcx(t[0]),z:tcx(t[1])}}}}
 if(st.id==='przystan'){const pl=wolPlace(person);if(pl)return{text:pl[1],target:{x:tcx(pl[0][0]),z:tcx(pl[0][1])}}}
 const t=E4Life.point(state,st,(person.id%5)+11,13);return t?{text:['patrzy, jak słońce zachodzi nad polami','siedzi na miedzy i słucha świerszczy','spaceruje skrajem lasu'][person.id%3],target:t}:null}

/* ---- o czym mówi się w rodach ---- */
const E4Pl=()=>Object.values(S.e4.settlements).filter(s=>s.id!=='przystan');
TALK.push(
 {k:'e4_folw',t:'epoka',c:()=>epNow()===4&&E4Pl().length>0,a:A=>A.age>=16,s:()=>E4Pl().map(s=>s.name),x:['Ciekawe, jak sobie radzą w {s}. Dawno nie było od nich wozu.','W {s} podobno zboże po pas. Może w przyszłym roku pojadę.','Kto by pomyślał, że będziemy mieć {s}. Mój dziadek spał pod gołym niebem.']},
 {k:'e4_rod',t:'epoka',c:()=>epNow()===4,a:A=>A.age>=16&&S.rody&&S.rody[A.rod],v:A=>({r:S.rody[A.rod].name}),x:['Ród {r} nie da sobie w kaszę dmuchać. Tak było i tak będzie.','Na Wiecu Rodów znowu się kłócili o miedzę. Ale nasz ród {r} postawił na swoim.','Nad drzwiami mamy znak rodu {r}. Wyciął go jeszcze mój dziad.']},
 {k:'e4_przodek',t:'pamiec',c:()=>epNow()===4,a:A=>A.age>=14&&(A.generation||1)>=2,v:A=>{const L=Object.values(S.e4.archive).filter(x=>x&&x.name&&(x.generation||1)===1);const z=L.length?L[dHash(A.id,Math.floor(S.day))%L.length]:null;return z?{n:z.name}:null},x:['Babka mówiła, że {n} przypłynął|przypłynęła na tamtym statku. Pierwsze pokolenie.','Nosimy imiona po tych z pierwszego pokolenia. Ja mam coś z {n}, tak mówią.']},
 {k:'e4_woz',t:'osada',c:()=>epNow()===4&&(S.e4.transports||[]).length>0,a:A=>A.age>=16,x:['Wóz pojechał z rana. Oby woźnica zdążył przed deszczem.','Na drodze do folwarku znowu błoto po osie. Ktoś musi wreszcie wysypać tam żwiru.']},
 {k:'e4_nauka',t:'osada',c:()=>epNow()===4&&S.e4.nauki&&Object.keys(S.e4.nauki.done||{}).length>0,a:A=>A.age>=16,s:()=>Object.keys(S.e4.nauki.done).map(id=>E4Catalog.research[id]&&E4Catalog.research[id].name.toLowerCase()).filter(Boolean),x:['Odkąd znamy tę naukę ({s}), robota idzie inaczej. Starzy kręcą głowami, ale jedzą.','Wiec dobrze zrobił, że kazał się uczyć. Teraz każdy mówi o jednym: {s}.']},
 {k:'e4_trunek',t:'osada',c:()=>epNow()===4&&Object.values(S.e4.settlements).some(s=>s.buildings.karczma),a:A=>A.age>=18,x:['W karczmie wczoraj piwo jak miód. Jutro głowa jak kamień.','Karczmarz mówi, że wino z naszej winnicy pije się nawet w folwarkach za lasem.']},
 {k:'e4_dwor',t:'epoka',c:()=>epNow()===4&&Object.values(S.e4.settlements).some(s=>s.buildings.dwor),a:A=>A.age>=16,x:['We dworze palą świece nawet w zwykły dzień. Kto by pomyślał.','Dwór stoi jak gród. Ale chleb pieką tam taki sam jak u nas.']}
);
// przodek: forma czasownika zależy od płci przodka, nie mówiącego
{const T=TALK.find(t=>t.k==='e4_przodek');T.v=A=>{const L=Object.values(S.e4.archive).filter(x=>x&&x.name&&(x.generation||1)===1);const z=L.length?L[dHash(A.id,Math.floor(S.day))%L.length]:null;return z?{n:z.name,ng:gen(z.name),pz:z.sex==='k'?'przypłynęła':'przypłynął'}:null};
 T.a=A=>A.age>=14&&(A.generation||1)>=2&&Object.values(S.e4.archive).some(x=>x&&x.name&&(x.generation||1)===1);
 T.x=['Babka mówiła, że {n} {pz} na tamtym statku. Pierwsze pokolenie.','Nosimy imiona po tych z pierwszego pokolenia. Ja mam coś z {ng}, tak mówią.']}
window.__e4dusza={duszaE4Daily,e4Evening};
