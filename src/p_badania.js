
/* ================= 4.9.0-rc.22 Wiedza pół na pół: przeczucie z praktyki, próba z decyzji gracza ================= */
// Plan wiedzy i rozwoju, pakiet W1 (zatwierdzony 29.10.2026):
// - praca daje przeczucie tylko węzłom swojego fachu, najwyżej do połowy węzła;
// - drugą połowę daje próba, którą wybiera gracz: jedna osoba z fachem, materiały, kilka dni pracy i szansa powodzenia;
// - porażka zabiera materiały, ale następna próba jest pewniejsza; czasem kosztuje coś więcej (rana, oparzenie, pożar);
// - bez „Szkoły przy wiecu” trwa jedno badanie naraz (razem z dawnymi próbami cegły, pieca i wytopu), potem najwyżej trzy;
// - pierwszy rząd epoki I (rozpoznawanie roślin, tropienie, kronika) przychodzi z samej praktyki.
// skąd przychodzi przeczucie: fachy (jak w CN) albo rodzaje nauki
const TPRAC={
 u_rozp:['zbieracz'],u_ziel:['zbieracz','leczenie'],u_pole:['zbieracz'],u_susz:['zbieracz'],u_bart:['zbieracz'],u_odlog:['rolnik'],u_sad:['zbieracz','rolnik'],u_nawoz:['rolnik','hodowca'],u_selek:['rolnik'],u_len:['rolnik','zbieracz'],
 h_trop:['mysliwy','zwiad','wyprawa'],h_wedz:['mysliwy','rybak'],h_zagr:['mysliwy','hodowca'],h_garb:['mysliwy'],h_sieci:['rybak'],h_doj:['hodowca'],h_ostr:['hodowca','ciesla'],h_rozr:['hodowca'],h_siersc:['hodowca','krawiec'],
 r_narz:['kamieniarz','kowal','drwal'],r_zrab:['ciesla'],r_tkac:['krawiec'],r_stal:['kowal'],r_garn:['murarz'],r_woz:['ciesla'],
 n_kron:['nauka','czytanie','nauczanie','opowiesc','odkrycie','zwiad','wyprawa','proba'],n_kal:['opowiesc','nauczanie','rolnik','wyprawa'],n_mapa:['zwiad','wyprawa'],n_szk:['nauczanie','opowiesc'],
 n_opat:['leczenie','zbieracz'],n_znaki:['odkrycie','zwiad'],n_gwiazd:['rybak','wyprawa'],n_pamiec:['czytanie','nauczanie','nauka'],
 u_radlo:['rolnik','kowal'],u_inspekt:['rolnik'],u_trojpol:['rolnik','hodowca'],h_lodzie:['rybak','ciesla'],h_siano:['hodowca','rolnik'],h_ser:['hodowca'],
 r_czeladz:['kowal','ciesla','murarz','krawiec'],r_kolo:['murarz'],r_gont:['ciesla'],n_rach:['nauka','czytanie','nauczanie'],n_leki:['leczenie','zbieracz'],n_miern:['zwiad','ciesla'],
 u_mlyn:['rolnik'],u_przys:['rolnik'],u_chmiel:['rolnik'],h_woly:['hodowca'],h_hale:['hodowca'],h_masar:['mysliwy','hodowca'],
 r_kute:['kowal'],r_kolowrot:['kamieniarz','ciesla'],r_zaprawa:['murarz','kamieniarz'],n_szkola:['nauczanie','czytanie'],n_atlas:['zwiad','wyprawa'],n_prawo:['nauczanie','nauka']};
const BAD_TAG={nauka:'nauka w osadzie',czytanie:'czytanie ksiąg',nauczanie:'nauczanie przy ogniu',opowiesc:'opowieści przy ogniu',odkrycie:'odkrycia i ślady',zwiad:'zwiady',wyprawa:'wyprawy',proba:'dawne próby',leczenie:'leczenie chorych'};
// materiały próby: w epoce I od kilku do kilkunastu sztuk, później więcej
const TCOST={
 u_ziel:{ziola:6,drewno:4},u_susz:{jagody:15,drewno:6},u_bart:{drewno:6,ziola:3},u_odlog:{ziarno:10},u_sad:{jagody:10,drewno:4},u_nawoz:{ziarno:10,drewno:6},u_selek:{ziarno:20},u_len:{wlokna:6,ziarno:6},
 h_wedz:{mieso:8,drewno:8},h_zagr:{jagody:10,drewno:10},h_garb:{skory:4,drewno:6},h_sieci:{wlokna:8,drewno:4},h_doj:{mleko:6,drewno:4},h_ostr:{drewno:20},h_rozr:{ziarno:8,drewno:4},h_siersc:{skory:2,drewno:4},
 r_narz:{kamien:10,drewno:6},r_zrab:{drewno:16},r_tkac:{deski:6,wlokna:4},r_stal:{narz:2,wegiel:4},r_garn:{glina:12,drewno:8},r_woz:{drewno:12,deski:4},
 n_kal:{drewno:3},n_mapa:{drewno:3,skory:1},n_szk:{jagody:8},n_opat:{ziola:6,plotno:2},n_znaki:{drewno:4},n_gwiazd:{ryby:6,drewno:6},n_pamiec:{skory:4,drewno:2},
 u_radlo:{narz:2,drewno:10},u_inspekt:{deski:6,plotno:2},u_trojpol:{ziarno:30},h_lodzie:{deski:12,gwozdzie:6},h_siano:{drewno:10,ziarno:10},h_ser:{mleko:20,naczynia:4},
 r_czeladz:{narz:3,deski:6},r_kolo:{drewno:8,glina:20},r_gont:{deski:12,gwozdzie:8},n_rach:{drewno:6,ziarno:10},n_leki:{ziola:12,naczynia:3},n_miern:{wlokna:8,drewno:8},
 u_mlyn:{kamien:20,ziarno:20},u_przys:{ziarno:30,deski:6},u_chmiel:{ziarno:30,naczynia:6},h_woly:{ziarno:20,drewno:16},h_hale:{drewno:12,ziarno:12},h_masar:{mieso:25,drewno:10},
 r_kute:{narz:3,wegiel:10,drewno:10},r_kolowrot:{drewno:16,deski:8,gwozdzie:6},r_zaprawa:{kamien:30,wegiel:10},n_szkola:{deski:10,plotno:4},n_atlas:{skory:8,plotno:2},n_prawo:{kamien:12,deski:4}};
// porażka czasem kosztuje więcej: tylko tam, gdzie to naturalne
const TRISK={h_zagr:'rana',u_bart:'zadlo',r_stal:'oparzenie',r_kute:'oparzenie',r_garn:'pozar',h_woly:'rana'};
const BAD_WD=115;   // ile sekund próby to jeden dzień pracy (dzień pracy trwa ok. 140 s, część schodzi na drogę)
const BAD_RISK_P=.35;
const tRoot=t=>tEp(t)===1&&t.r===0&&!t.sync;
const tHalf=t=>tRoot(t)?t.xp:t.xp*.5;
const badOn=()=>!!(S&&S.tech&&S.epoch!==4);
function badS(){S.bad=S.bad||[];S.bq=S.bq||[];S.tfail=S.tfail||{};S.bsel=S.bsel||{};S.tnote=S.tnote||{};return S}
function badSlots(){return tech('n_szkola')?3:1}
function badUsed(){badS();return S.bad.length+(S.know&&S.know.active?1:0)}
function badFullTxt(){return badSlots()>1?`Trwają już ${badSlots()} badania. Więcej naraz osada nie udźwignie.`:'Na raz trwa jedno badanie. Więcej pozwoli dopiero szkoła przy wiecu.'}
// indeks: tag → węzły, które z niego czerpią (TECH jest stały po wczytaniu gry)
let BAD_IDX=null;
function badIdx(){if(BAD_IDX)return BAD_IDX;BAD_IDX={};for(const t of TECH){const P=TPRAC[t.id];if(!P||t.sync)continue;for(const g of P)(BAD_IDX[g]||(BAD_IDX[g]=[])).push(t)}return BAD_IDX}
// próg przeczucia w epokach II–III jest kilka razy wyższy, a pracują przy nim te same fachy, więc praktyka liczy się tam mocniej
const badEpM=t=>tEp(t)===1?1:tEp(t)===2?3:4.5;
function badPractice(tag,v){if(!badOn()||!(v>0))return;const I=badIdx(),now=epNow();const tags=Array.isArray(tag)?tag:[tag];const hit=new Set();
 for(const g of tags){const L=I[g];if(!L)continue;for(const t of L){if(hit.has(t)||S.tech[t.id]||tEp(t)>now||!t.req.every(r=>tech(r)))continue;hit.add(t);
  const cap=tHalf(t),cur=S.tp[t.id]||0;if(cur>=cap)continue;S.tp[t.id]=Math.min(cap,cur+v*badEpM(t));
  if(S.tp[t.id]>=cap-1e-9&&tRoot(t)){if(!t.gate||t.gate())techDone(t)}else if(!tRoot(t)&&badFeel(t)>=badFeelNeed(t)-1e-9)badReadyNote(t)}}}
const badFeel=t=>Math.min(1,(S.tp[t.id]||0)/tHalf(t));
// W2: źródło z wyspy (ślad, przysiółek, przypadek) zastępuje połowę praktyki; pamięć rozbitka działa przy samej próbie
const badFeelNeed=t=>S&&S.tsrc&&S.tsrc[t.id]?.5:1;
const badFeelOk=t=>badFeel(t)>=badFeelNeed(t)-1e-9;
function badTagTxt(t){const P=TPRAC[t.id]||[];return P.map(g=>CN[g]?CN[g].toLowerCase():BAD_TAG[g]).filter(Boolean).join(', ')}
function badReadyNote(t){badS();if(S.tnote[t.id])return;S.tnote[t.id]=1;const dn=DOMS.find(d=>d[0]===t.d)[1];
 log(`Przeczucie: ${t.n.toLowerCase()}. Ludzie wiedzą już, od czego zacząć. Można spróbować (Wiedza → ${dn}).`)}
// kto może prowadzić próbę: fach węzła na co najmniej 2; nauka: starsi, nauczyciele i dociekliwi
const badCrafts=t=>t.d==='nauka'?[]:(TPRAC[t.id]||[]).filter(g=>CN[g]);
const badSage=p=>(p.trait==='Nauczyciel'?3:0)+(p.age>=50?2:p.age>=35?1:0)+(p.trait==='Dociekliwy'?1:0);
const badSkill=(t,p)=>{const C=badCrafts(t);return C.length?Math.max(...C.map(c=>p.sk[c]||0)):badSage(p)};
const badBestCraft=(t,p)=>{const C=badCrafts(t);return C.slice().sort((a,b)=>(p.sk[b]||0)-(p.sk[a]||0))[0]};
// kto pamięta z domu (W2), może poprowadzić próbę nawet bez biegłości w fachu
const badRem=(t,p)=>!!(p&&p.pam&&p.pam.includes(t.id));
function badWho(t){badS();const busy=new Set(S.bad.map(b=>b.pid));const C=badCrafts(t);
 return S.people.filter(p=>p.age>=16&&isWorker(p)&&p.job!=='wyp'&&p.state!=='away'&&!p.exp&&!busy.has(p.id)&&p.hp>.35&&(!C.length||badRem(t,p)||C.some(c=>(p.sk[c]||0)>=2)))
  .sort((a,b)=>badRem(t,b)-badRem(t,a)||badSkill(t,b)-badSkill(t,a)||((a.job==='rob')?0:1)-((b.job==='rob')?0:1)||a.id-b.id)}
function badPick(t){const L=badWho(t);const want=S.bsel&&S.bsel[t.id];return L.find(p=>p.id===want)||L[0]||null}
function badChance(t,p){const f=S.tfail[t.id]||0;let c=t.d==='nauka'?.5+.06*badSage(p):.5+.15*(Math.max(badSkill(t,p),badRem(t,p)?2:0)-2);
 c+=(S.tsrc&&S.tsrc[t.id]?.15:0)+(badRem(t,p)?.15:0);
 c+=.2*f+(p.trait==='Uparty'?.08:0)+(p.trait==='Dociekliwy'&&t.d!=='nauka'?.05:0)+(tech('n_kron')&&t.d!=='nauka'?.03:0);return clamp(c,.1,.95)}
function badDays(t){const e=tEp(t);let d=e===1?(t.r<=2?3:4):e===2?(t.r<=4?3:4):(t.r<=6?5:6);return d}
const badNeed=t=>badDays(t)*BAD_WD*(tech('n_szk')?.9:1)*(tech('n_szkola')?.85:1);
// źródło z zewnątrz (ślad, przysiółek) albo prowadzący, który pamięta to z domu: połowa materiałów
function badCost(t,p){const c=TCOST[t.id]||{drewno:6};const half=badRem(t,p)||(S.tsrc&&S.tsrc[t.id]);if(!half)return c;const o={};for(const k in c)o[k]=Math.max(1,Math.ceil(c[k]/2));return o}
const badCostTxt=c=>Object.entries(c).map(([k,v])=>`${(RN[k]||k).toLowerCase()} ${v}`).join(', ');
function badMiss(c){return Object.entries(c).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>`${(RN[k]||k).toLowerCase()} ${Math.ceil(v-(S.res[k]||0))}`)}
// stan węzła z punktu widzenia nauki: z praktyki, przeczucie, gotowy do próby, w kolejce, w próbie
function badState(t){if(!badOn())return'';badS();if(S.bad.some(b=>b.id===t.id))return'bada';if(tRoot(t))return'root';if(badFeelOk(t))return S.bq.includes(t.id)?'kol':'ready';return S.bq.includes(t.id)?'kol':'czuje'}
function badProg(t){const b=(S.bad||[]).find(x=>x.id===t.id);return b?Math.min(1,b.prog/b.need):0}
// czy można zacząć: powód odmowy albo pusty tekst
function badWhy(t,p){if(!badOn())return'W tej epoce wiedza rodzi się inaczej.';if(S.tech[t.id])return'Osada to już umie.';if(t.sync)return'To poznaje się inaczej (księga albo dawna próba).';
 if(tEp(t)>epNow())return`Przyjdzie z epoką: ${EP_N[tEp(t)]}.`;if(!t.req.every(r=>tech(r)))return'Najpierw trzeba poznać to, co wyżej.';if(tRoot(t))return'To przyjdzie z samej praktyki.';
 if((S.bad||[]).some(b=>b.id===t.id))return'Próba już trwa.';if(t.gate&&!t.gate())return t.gt();
 if(!badFeelOk(t))return`Najpierw przeczucie z pracy (${Math.round(100*badFeel(t))}%${badFeelNeed(t)<1?', wystarczy 50%':''}): ${badTagTxt(t)}.`;
 if(!p)return badCrafts(t).length?`Nikt nie umie dość: potrzebny ${badCrafts(t).map(c=>CN[c].toLowerCase()).join(' albo ')} z biegłością 2.`:'Nie ma kogo posadzić do nauki: wszyscy dorośli są zajęci albo chorzy.';
 const m=badMiss(badCost(t,p));if(m.length)return'Brakuje: '+m.join(', ')+'.';if(badUsed()>=badSlots())return badFullTxt();return''}
function badStart(id,pid){const t=TECH_BY[id];if(!t)return'Nie ma takiej wiedzy.';badS();if(pid!==undefined)S.bsel[id]=pid;const p=badPick(t);const why=badWhy(t,p);if(why)return why;
 const cost=badCost(t,p);Object.entries(cost).forEach(([k,v])=>S.res[k]-=v);const ch=badChance(t,p),need=badNeed(t);
 p.badPrev={job:p.job||'rob',wb:p.wb??null};if(p.state==='work'||p.state==='move'){release(p);p.path=null}if(p.state!=='sleep')p.state='idle';p.wait=0;p.job='bad';p.wb=null;
 S.bad.push({id,pid:p.id,pn:p.name,prog:0,need,ch,cost,d0:S.day});S.bq=S.bq.filter(x=>x!==id);const c=badBestCraft(t,p);const d=badDays(t);
 log(`Zaczyna się próba: ${t.n.toLowerCase()}. Prowadzi ją ${p.name}${badRem(t,p)?`, ${gw(p,'który','która')} pamięta to z domu`:c?` (${CN[c].toLowerCase()} ${p.sk[c]})`:''}, potrwa ok. ${d} ${dniW(d)}.`);toast('Próba: '+t.n);assign();if(tab==='wiedza')renderPanel();return''}
// osoba wraca do dawnej pracy, jeśli ta jeszcze istnieje
function badRelease(b){const p=pById(b.pid);if(!p||p.job!=='bad')return;const pr=p.badPrev||{job:'rob',wb:null};p.badPrev=null;
 if(pr.job==='wb'&&pr.wb!=null&&bById(pr.wb)&&bDone(bById(pr.wb))){p.job='wb';p.wb=pr.wb}else{p.job=['zwiad','zdun','czyt'].includes(pr.job)?pr.job:'rob';p.wb=null}
 if(p.state==='work'){release(p);p.state='idle'}p.wait=.3;assign()}
function badCancel(id){badS();const b=S.bad.find(x=>x.id===id);if(!b)return;S.bad=S.bad.filter(x=>x!==b);Object.entries(b.cost||{}).forEach(([k,v])=>S.res[k]=(S.res[k]||0)+v);badRelease(b);
 log(`Przerwano próbę: ${TECH_BY[id].n.toLowerCase()}. Materiały wróciły do składu.`);badAuto();if(tab==='wiedza')renderPanel()}
function badRisk(t,p){const k=TRISK[t.id];if(!k||Math.random()>=BAD_RISK_P)return'';
 if(k==='rana'){p.hp=Math.max(.15,p.hp-.25);return` ${p.name} ${gw(p,'został','została')} przy tym ${gw(p,'poturbowany','poturbowana')}.`}
 if(k==='zadlo'){p.hp=Math.max(.2,p.hp-.15);return` ${p.name} ma twarz spuchniętą od żądeł.`}
 if(k==='oparzenie'){p.hp=Math.max(.15,p.hp-.25);return` ${p.name} ${gw(p,'poparzył','poparzyła')} sobie ręce przy ogniu.`}
 if(k==='pozar'&&typeof startFire==='function'){const c={x:tcx(camp.i),z:tcx(camp.j)};const B=S.bld.filter(b=>bDone(b)&&!b.fire&&b.kind!=='serce'&&!BD[b.kind].house).sort((a,b)=>{const A=bCenter(a),C=bCenter(b);return Math.hypot(A.x-c.x,A.z-c.z)-Math.hypot(C.x-c.x,C.z-c.z)})[0];
  if(B){startFire(B);return' Od wypalania zajęło się drewno obok.'}}
 return''}
function badFinish(b){const t=TECH_BY[b.id],p=pById(b.pid);S.bad=S.bad.filter(x=>x!==b);if(!t){if(p)badRelease(b);return}const f=S.tfail[t.id]||0;
 if(Math.random()<b.ch){log(`Próba udana: ${t.n.toLowerCase()}. ${p?p.name+' ':''}${f?`po ${f} ${f===1?'nieudanej próbie':'nieudanych próbach'} `:''}${p?gw(p,'pokazał','pokazała')+' osadzie, jak to robić.':''}`.replace(/\s+$/,'').replace(/ \.$/,'.'));
  techDone(t);delete S.tfail[t.id];if(p&&TCRAFT[t.id]){S.tKnow=S.tKnow||{};const K2=S.tKnow[t.id]||(S.tKnow[t.id]=[]);if(!K2.includes(p.id))K2.push(p.id)}}
 else{S.tfail[t.id]=f+1;const x=p?badRisk(t,p):'';log(`Próba nieudana: ${t.n.toLowerCase()}.${x} Materiały przepadły, ale ${p?p.name:'osada'} wie już więcej: następnym razem pójdzie pewniej.`);toast('Próba nieudana: '+t.n)}
 if(p)badRelease(b);badAuto();if(tab==='wiedza')renderPanel()}
function badTick(p,dt){const b=(S.bad||[]).find(x=>x.pid===p.id);if(!b){p.job='rob';p.state='idle';return}const t=TECH_BY[b.id];
 b.prog+=dt*clamp(eff(p),.45,1.2);const c=badBestCraft(t,p);if(c)gainXp(p,c,dt*.5);p.act='próba: '+t.n.toLowerCase();if(b.prog>=b.need)badFinish(b)}
// kolejka: następne badanie zaczyna się samo, gdy zwolni się miejsce i są ludzie i materiały
function badAuto(){if(!badOn())return;badS();S.bq=S.bq.filter(id=>TECH_BY[id]&&!S.tech[id]&&!S.bad.some(b=>b.id===id));
 for(const id of S.bq.slice()){if(badUsed()>=badSlots())break;const t=TECH_BY[id];if(!badWhy(t,badPick(t)))badStart(id)}}
function badQueue(id,on){badS();const t=TECH_BY[id];if(!t)return;if(on){if(!S.bq.includes(id)&&!S.bad.some(b=>b.id===id))S.bq.push(id);toast('W kolejce: '+t.n)}else S.bq=S.bq.filter(x=>x!==id);badAuto();if(tab==='wiedza')renderPanel()}
// pilnowanie: osoba umarła, wyjechała albo zajęła się czym innym, więc próbę przejmuje ktoś inny albo czeka
function badWatch(){if(!badOn())return;badS();for(const b of S.bad){const p=b.pid!=null?pById(b.pid):null;if(p&&p.job==='bad')continue;const t=TECH_BY[b.id];if(!t)continue;
  const was=p?p.name:b.pn;if(p&&p.job!=='bad')p.badPrev=null;b.pid=null;const q=badPick(t);
  if(q){q.badPrev={job:q.job||'rob',wb:q.wb??null};if(q.state==='work'||q.state==='move'){release(q);q.path=null}if(q.state!=='sleep')q.state='idle';q.job='bad';q.wb=null;b.pid=q.id;b.pn=q.name;
   log(`${was?was+' nie może dalej prowadzić próby':'Próba czekała na kogoś'} (${t.n.toLowerCase()}). Przejmuje ją ${q.name}.`);assign()}
  else if(!b.waitLog){b.waitLog=1;log(`Próba (${t.n.toLowerCase()}) stanęła: nie ma kto jej prowadzić. Wróci, gdy znajdzie się ktoś z fachem.`)}}
 for(const b of S.bad){const p=pById(b.pid);if(p){b.pn=p.name;b.waitLog=0}}
 S.people.forEach(p=>{if(p.job==='bad'&&!S.bad.some(b=>b.pid===p.id)){p.job='rob';p.wb=null;p.badPrev=null}})}
// przejście ze starego systemu: punkty w przeczucie (najwyżej połowa), wybrany cel do kolejki, bank znika
function badMigrate(){if(!S||!S.tech)return;badS();if(!S.badV){S.badV=1;
  for(const d in (S.focus||{})){const id=S.focus[d];if(id&&TECH_BY[id]&&!S.tech[id]&&!TECH_BY[id].sync&&!tRoot(TECH_BY[id])&&!S.bq.includes(id))S.bq.push(id)}
  for(const id in (S.tp||{})){const t=TECH_BY[id];if(t&&!S.tech[id])S.tp[id]=Math.min(S.tp[id],tHalf(t))}}
 S.focus={};delete S.bank;badWatch()}
// ---------- widok ----------
{const st=document.createElement('style');st.textContent=`.tn.b-ready{border-color:var(--gold)}.tn.b-ready .ts{color:var(--gold2)}.tn.b-kol .ts{color:var(--hi)}.tn.b-bada .ts{color:var(--hi)}
.bad-card .bad-row{margin:6px 0 8px}.bad-card .bad-row p{margin:2px 0}.bad-card .pbar{margin:4px 0}.bad-card button.lnk,.tdet button.lnk{background:none;border:0;padding:0 2px;min-height:0;height:auto;line-height:inherit;box-shadow:none;color:var(--hi);text-decoration:underline;font:inherit;cursor:pointer}
.bad-q{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0}.bad-q button{font-size:12px;padding:3px 8px}.tdet .bad-try p{margin:3px 0}.tdet .bad-try .no{color:var(--bad)}`;document.head.appendChild(st)}
function badRowHTML(b){const t=TECH_BY[b.id],p=pById(b.pid);const pc=Math.round(100*Math.min(1,b.prog/b.need));const left=Math.max(.5,(b.need-b.prog)/BAD_WD);const c=p?badBestCraft(t,p):null;
 return`<div class="bad-row"><p><b style="color:var(--hi)">${t.n}</b> <span class="mut">· ${DOMS.find(d=>d[0]===t.d)[1]}</span></p>
 <p class="mut">${p?`${p.name}${c?`, ${CN[c].toLowerCase()} ${p.sk[c]}`:''}`:'czeka na kogoś, kto ją poprowadzi'} · szansa ${Math.round(100*b.ch)}% · jeszcze ok. ${Math.ceil(left)} ${dniW(Math.ceil(left))}</p>
 <div class="pbar"><div style="width:${pc}%"></div></div><button class="lnk" data-bcancel="${b.id}">Przerwij (materiały wrócą, czas przepadnie)</button></div>`}
function badPanelHTML(){if(!badOn())return'';badS();const used=badUsed(),slots=badSlots();let h=`<div class="card bad-card"><h4>Badania <small class="mut">${used} z ${slots}</small></h4>`;
 S.bad.forEach(b=>{if(TECH_BY[b.id])h+=badRowHTML(b)});
 if(S.know&&S.know.active&&typeof TRIAL!=='undefined'&&TRIAL[S.know.active]){const T=TRIAL[S.know.active];h+=`<div class="bad-row"><p><b style="color:var(--hi)">${T.n}</b> <span class="mut">· dawna próba, prowadzą ją zduni (niżej)</span></p></div>`}
 if(!used){const R=TECH.filter(t=>techAvail(t)&&badState(t)==='ready');
  h+=R.length?`<p class="mut">Nic nie jest teraz badane. Przeczucie mają już:</p><div class="bad-q">${R.slice(0,8).map(t=>`<button data-bgo="${t.id}">${t.n}</button>`).join('')}</div>`:
   '<p class="mut">Nic nie jest teraz badane. Przeczucie rośnie z pracy ludzi; gdy któryś węzeł będzie gotowy, można zacząć próbę.</p>'}
 if(S.bq.length)h+=`<p class="mut" style="margin-top:6px">Następne w kolejce:</p><div class="bad-q">${S.bq.map(id=>TECH_BY[id]?`<button data-bunq="${id}" title="Usuń z kolejki">${TECH_BY[id].n} ✕</button>`:'').join('')}</div>`;
 return h+'</div>'}
function badNodeHTML(t){if(!badOn())return'';badS();const bs=badState(t);let h='';
 if(bs==='root'){const pc=Math.round(100*badFeel(t));return`<div class="pbar"><div style="width:${pc}%"></div></div><p class="mut">${pc}% · przyjdzie z samej praktyki: ${badTagTxt(t)}.</p>`}
 if(bs==='bada'){const b=S.bad.find(x=>x.id===t.id);return badRowHTML(b)}
 const pc=Math.round(100*badFeel(t)),ok=badFeelOk(t);h+=`<p class="mut" style="margin-bottom:2px">Przeczucie z pracy: ${pc}%${!ok?` · rośnie z: ${badTagTxt(t)}`:' · ludzie wiedzą, od czego zacząć'}.</p><div class="pbar"><div style="width:${pc}%"></div></div>`;
 if(typeof zrSrcHTML==='function')h+=zrSrcHTML(t);
 const p=badPick(t),why=badWhy(t,p),cost=badCost(t,p),L=badWho(t);const f=S.tfail[t.id]||0;
 h+=`<div class="bad-try"><p><b style="color:var(--gold2)">Próba:</b> ${badDays(t)} ${dniW(badDays(t))} pracy jednej osoby.</p>`;
 if(p){const c=badBestCraft(t,p);h+=`<p>Kto: ${p.name}${badRem(t,p)?`, ${gw(p,'pamięta','pamięta')} to z domu`:c?` (${CN[c].toLowerCase()} ${p.sk[c]})`:` (${Math.floor(p.age)} l.)`}${L.length>1?` <button class="lnk" data-bwho="${t.id}">ktoś inny</button>`:''}</p>
  <p>Szansa: ${Math.round(100*badChance(t,p))}%${f?` <span class="mut">(po ${f} ${f===1?'nieudanej':'nieudanych'})</span>`:''}</p>`}
 h+=`<p>Materiały: ${Object.entries(cost).map(([k,v])=>`<span class="${(S.res[k]||0)>=v?'':'no'}">${(RN[k]||k).toLowerCase()} ${v}</span>`).join(', ')}</p>`;
 if(!why)h+=`<button class="pri" data-bstart="${t.id}">Zacznij próbę</button>`;
 else{h+=`<p class="mut">${!ok&&!/Najpierw trzeba/.test(why)?(badFeelNeed(t)<1?'Dzięki źródłu wystarczy połowa przeczucia.':'Próbę można zacząć, gdy przeczucie będzie pełne.'):why}</p>`;if(bs==='kol')h+=`<button data-bunq="${t.id}">Usuń z kolejki</button>`;else if(!/już umie|z samej praktyki|Próba już trwa/.test(why))h+=`<button data-bq="${t.id}">Dodaj do kolejki</button> <span class="mut">zacznie się sama, gdy będzie można</span>`}
 return h+'</div>'}
// tekst dla podpowiedzi celu („czego brakuje”)
function badCelTxt(t){const dn=(DOMS.find(d=>d[0]===t.d)||[])[1]||'Wiedza';const bs=badState(t);
 if(bs==='bada')return`trwa próba: ${t.n.toLowerCase()} (${Math.round(100*badProg(t))}%)`;
 if(bs==='root')return`najpierw wiedza „${t.n}” (Wiedza → ${dn}): ${Math.round(100*badFeel(t))}%, przyjdzie z samej pracy`;
 if(!badFeelOk(t))return`najpierw wiedza „${t.n}” (Wiedza → ${dn}): przeczucie ${Math.round(100*badFeel(t))}% z pracy (${badTagTxt(t)}), potem próba`;
 return`najpierw próba: ${t.n.toLowerCase()} (Wiedza → ${dn})`}
$('body').addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!S)return;const d=t.dataset;
 if(d.bstart){const why=badStart(d.bstart);if(why)toast(why)}
 else if(d.bq)badQueue(d.bq,true);else if(d.bunq)badQueue(d.bunq,false);else if(d.bcancel)badCancel(d.bcancel);
 else if(d.bwho){const T=TECH_BY[d.bwho],L=badWho(T),cur=badPick(T);const k=L.indexOf(cur);const n=L[(k+1)%L.length];if(n){S.bsel[d.bwho]=n.id;renderPanel()}}
 else if(d.bgo){const T=TECH_BY[d.bgo];if(T){techDom=T.d;techSel=T.id;renderPanel()}}});
// ---------- osoba w próbie: idzie na miejsce przy ognisku i pracuje ----------
{const _pj=planJob;planJob=function(p){if(p.job!=='bad'||p.fireB||!isWorker(p)||restNow(p))return _pj(p);
  const b=(S.bad||[]).find(x=>x.pid===p.id);if(!b){p.job='rob';return _pj(p)}const k=S.bad.indexOf(b);const t=TECH_BY[b.id];
  const sp=nearestWalk(camp.i+2-k*2,camp.j-2)||[camp.i,camp.j+1];if(go(p,sp,'bad',null)){p.act='idzie na próbę: '+t.n.toLowerCase();return true}return false}}
{const _oa=onArrive;onArrive=function(p){if(p.after==='bad'){p.after=null;p.wt=0;p.state='work';p.workKind='bad';return}_oa(p)}}
{const _sp=stepPerson;stepPerson=function(p,dt){if(p.state==='work'&&p.workKind==='bad'&&isWork()&&!p.fireB){if(p.job!=='bad'){p.state='idle';return}if(restNow(p)){p.state='idle';return}badTick(p,dt);return}_sp(p,dt)}}
{const _pm=personMotion;personMotion=function(p){if(S&&S.epoch!==4&&p.state==='work'&&p.workKind==='bad'&&!p.carry)return 'craft';return _pm(p)}}
{const _jl=jobLabel;jobLabel=function(p){if(p.job==='bad'){const b=(S.bad||[]).find(x=>x.pid===p.id);return b&&TECH_BY[b.id]?'próba: '+TECH_BY[b.id].n.toLowerCase():'próba'}return _jl(p)}}
// leczenie chorych też uczy (zielarka, chata zielarki)
{const _ad=actDaily;actDaily=function(){_ad();if(!badOn())return;try{const sick=S.people.filter(p=>p.hp<.7).length;if(sick&&(hasB('izbachorych')||offHolder('zielarz')))techXp('nauka',sick*2*K,'leczenie');badWatch();badAuto()}catch(e){console.warn(e)}}}
// co kilka sekund: pilnuj osób i kolejki (tanio: kilka porównań)
let badT=0;{const _st=step;step=function(dt){_st(dt);if(!S)return;badT+=dt;if(badT>=4){badT=0;if(badOn()&&((S.bad&&S.bad.length)||(S.bq&&S.bq.length))){badWatch();badAuto()}}}}
{const _b=boot;boot=function(f){_b(f);try{badMigrate()}catch(e){console.warn(e)}}}
// na co czekamy i lista spraw
{const _cz=czekamy;czekamy=function(){const L=_cz();if(!badOn())return L;(S.bad||[]).forEach(b=>{const t=TECH_BY[b.id];if(t)L.push([`Próba: ${t.n.toLowerCase()} ${Math.round(100*Math.min(1,b.prog/b.need))}%`,2])});return L.sort((a,b)=>a[1]-b[1])}}
window.__bad={TPRAC,TCOST,badPractice,badStart,badCancel,badQueue,badWhy,badPick,badWho,badChance,badDays,badNeed,badFeel,badState,badAuto,badWatch,badMigrate,badFinish,badSlots,badUsed,tHalf,tRoot,get BAD_WD(){return BAD_WD}};
