
// ================= 1.6 Pamięć wyspy: wiedza żyje w ludziach, miejsca nazywane od wydarzeń =================
// kto musi umieć (fach co najmniej 2), żeby wiedza nie zginęła
const TCRAFT={u_rozp:['zbieracz'],u_ziel:['zbieracz'],u_susz:['zbieracz'],u_bart:['zbieracz'],u_odlog:['rolnik'],u_sad:['zbieracz','rolnik'],u_nawoz:['rolnik','hodowca'],u_selek:['rolnik'],u_len:['rolnik','zbieracz'],
 h_trop:['mysliwy'],h_wedz:['mysliwy','rybak'],h_zagr:['hodowca'],h_garb:['mysliwy'],h_sieci:['rybak'],h_doj:['hodowca'],h_ostr:['hodowca'],h_rozr:['hodowca'],h_siersc:['hodowca'],
 r_narz:['kamieniarz','kowal'],r_zrab:['ciesla'],r_cegla:['murarz'],r_tkac:['krawiec'],r_kuznia:['kowal'],r_piec:['murarz'],r_stal:['kowal'],r_garn:['murarz']};
const TKNOW={r_cegla:'cegla',r_piec:'piec',r_kuznia:'kuznia'};
{const _t=tech;tech=function(id){return _t(id)&&!(S&&S.lostT&&S.lostT[id])}}
const tLearned=()=>Object.keys(TCRAFT).filter(t=>S.tech&&S.tech[t]);
function tHolders(t,min){const K2=(S.tKnow&&S.tKnow[t])||[];return S.people.filter(p=>p.age>=12&&(TCRAFT[t].some(c=>(p.sk[c]||0)>=(min||2))||(!min&&K2.includes(p.id))))}
function tKnowInit(t){S.tKnow=S.tKnow||{};if(S.tKnow[t])return;let L=S.people.filter(p=>p.age>=12&&TCRAFT[t].some(c=>(p.sk[c]||0)>=1));if(!L.length)L=S.people.filter(p=>p.age>=12).sort((a,b)=>Math.max(...TCRAFT[t].map(c=>b.sk[c]||0))-Math.max(...TCRAFT[t].map(c=>a.sk[c]||0))).slice(0,3);S.tKnow[t]=L.map(p=>p.id)}
function tKnowDaily(t){const K2=S.tKnow[t];S.people.forEach(p=>{if(p.age>=12&&!K2.includes(p.id)&&TCRAFT[t].includes(jobCraft(p))&&TCRAFT[t].some(c=>(p.sk[c]||0)>=1))K2.push(p.id)});S.tKnow[t]=K2.filter(id=>pById(id))}
function tSafe(){return S.tech&&S.tech.n_pamiec&&!(S.lostT&&S.lostT.n_pamiec)}
function wiedzaDaily(){if(!S.tech)return;S.lostT=S.lostT||{};S.told=S.told||{};S.warnT=S.warnT||{};
 // opowieści przy ogniu przechowują wiedzę starszych
 if(S.wieczM==='opowiesci')tLearned().forEach(t=>{if(tHolders(t).some(p=>p.age>=48))S.told[t]=S.day});
 for(const t of tLearned()){const T=TECH_BY[t];if(!S.lostT[t]){tKnowInit(t);tKnowDaily(t)}const H=tHolders(t);
  if(S.lostT[t]){const told=S.told[t]&&S.day-S.told[t]<YEAR*1.5;const H1=told?tHolders(t,1):[];const who=H[0]||H1[0];
   if(who){delete S.lostT[t];S.tKnow=S.tKnow||{};S.tKnow[t]=[who.id];if(TKNOW[t]&&S.know[TKNOW[t]]==='zapomniane')S.know[TKNOW[t]]='tak';log(`Wiedza wraca: ${T.n.toLowerCase()}. ${who.name} ${who.sex==='k'?'doszła':'doszedł'} do tego ${H[0]?'własną ręką':'dzięki temu, co starsi opowiadali przy ogniu'}.`);toast('Wiedza wraca: '+T.n)}continue}
  if(tSafe())continue;
  if(!H.length){S.lostT[t]=S.day;if(S.tKnow)delete S.tKnow[t];if(TKNOW[t]&&S.know[TKNOW[t]]==='tak')S.know[TKNOW[t]]='zapomniane';
   log(`Nikt już nie umie: ${T.n.toLowerCase()}. Ta wiedza odeszła razem z ludźmi.${S.told[t]?' Coś zostało w opowieściach starszych: kto podszkoli się w fachu, może do tego wrócić.':' Trzeba będzie dojść do niej od nowa.'}`);toast('Zapomniano: '+T.n);continue}
  if(H.length===1&&(!S.warnT[t]||S.day-S.warnT[t]>YEAR)){S.warnT[t]=S.day;const p=H[0];log(`Tylko ${p.name} (${Math.floor(p.age)} lat) umie jeszcze: ${T.n.toLowerCase()}. Bez ucznia ta wiedza zginie razem z ${p.sex==='k'?'nią':'nim'}.`)}}}
function wiedzaHTML(){const L=tLearned();if(!L.length)return'';const lost=L.filter(t=>S.lostT&&S.lostT[t]);const risk=L.filter(t=>!(S.lostT&&S.lostT[t])&&tHolders(t).length===1);const safe=L.length-lost.length-risk.length;
 const row=(t,txt,c)=>`<p style="margin:3px 0"><b style="color:${c}">${TECH_BY[t].n}</b> <span class="mut">${txt}</span></p>`;
 return`<div class="card"><h4>Wiedza w ludziach</h4>${tSafe()?'<p class="mut">Księga osady przechowuje to, co umieją mistrzowie. Nic już nie zginie.</p>':''}`+
  risk.map(t=>{const p=tHolders(t)[0];return row(t,`umie tylko ${p.name}, ${Math.floor(p.age)} l. Potrzebny uczeń: ${TCRAFT[t].map(c=>CN[c].toLowerCase()).join(' albo ')}.`,'var(--ember)')}).join('')+
  lost.map(t=>row(t,`zapomniane. Wróci, gdy ktoś dojdzie do biegłości 2 w fachu: ${TCRAFT[t].map(c=>CN[c].toLowerCase()).join(' albo ')}${S.told&&S.told[t]&&S.day-S.told[t]<YEAR*1.5?' (dzięki opowieściom wystarczy 1)':''}.`,'var(--bad)')).join('')+
  `<p class="mut">${safe?`${safe} ${safe===1?'umiejętność ma':safe<5?'umiejętności mają':'umiejętności ma'} kilku znawców. `:''}Wiedza żyje w ludziach: w tych, którzy ją poznali i pracują w tym fachu, i w każdym, kto doszedł w nim do biegłości 2. Gdy umrze ostatni, osada ją traci. Wieczory z opowieściami starszych pomagają ją potem odzyskać.</p></div>`}
{const _rp=renderPanel;renderPanel=function(){_rp();if(!S||tab!=='wiedza'||$('sheet').hidden)return;const el=$('body');if(el.querySelector('.wz-card'))return;const h=wiedzaHTML();if(h)el.insertAdjacentHTML('afterbegin',`<div class="wz-card">${h}</div>`)}}
{const _cz=czekamy;czekamy=function(){const L=_cz();if(!S.tech)return L;tLearned().forEach(t=>{if(S.lostT&&S.lostT[t])L.push([`Zapomniane: ${TECH_BY[t].n.toLowerCase()}`,2]);else if(!tSafe()&&tHolders(t).length===1)L.push([`Tylko ${tHolders(t)[0].name} umie: ${TECH_BY[t].n.toLowerCase()}`,1])});return L.sort((a,b)=>a[1]-b[1])}}

// ---------- miejsca nazywane od wydarzeń ----------
function placeAdd(n,x,z,why){S.places=S.places||[];if(S.places.length>=24)return null;if(S.places.some(q=>Math.hypot(q.x-x,q.z-z)<7||q.n===n))return null;
 if(Math.hypot(x-tcx(camp.i),z-tcx(camp.j))<6)return null;const q={n,x,z,why,d:Math.floor(S.day)+1};S.places.push(q);log(`Od tej pory ludzie mówią na to miejsce: ${n}.`);plcDirty=true;return q}
function placeNear(x,z,r){let best=null,bd=r||8;(S.places||[]).forEach(q=>{const d=Math.hypot(q.x-x,q.z-z);if(d<bd){bd=d;best=q}});return best}
const GRAVE_N=['Mogiła','Kamień','Kopiec'];
{const _kp=killPerson;killPerson=function(p,why){const x=p.x,z=p.z,far=Math.hypot(x-tcx(camp.i),z-tcx(camp.j))>14;_kp(p,why);
  try{if(far&&why!=='ze starości'&&why!=='na wyprawie'&&p.state!=='away')placeAdd(`${GRAVE_N[p.id%3]} ${gen(p.name)}`,x,z,`tu ${p.sex==='k'?'zmarła':'zmarł'} ${p.name}`)}catch(e){}}}
{const _se=searchEnd;searchEnd=function(){const s=S.search;const kid=s?pById(s.pid):null;_se();try{if(s&&kid&&s.ok)placeAdd(`Wykrot ${gen(kid.name)}`,s.x,s.z,`tu znaleziono zgubione dziecko: ${kid.name}`)}catch(e){}}}
{const _wp=wolfPups;wolfPups=function(n){_wp(n);try{const w=S.herds.filter(h=>h.type==='wilk').sort((a,b)=>Math.hypot(a.x-tcx(camp.i),a.z-tcx(camp.j))-Math.hypot(b.x-tcx(camp.i),b.z-tcx(camp.j)))[0];if(w)placeAdd('Wilcze Legowisko',w.x,w.z,'tu znaleziono wilcze szczenięta')}catch(e){}}}
{const _ef=endFire;endFire=function(b){const burnt=b.fire&&b.fire.hp<=0;const c=bCenter(b);_ef(b);if(burnt)try{placeAdd('Pogorzelisko',c.x,c.z,'tu spłonął '+BD[b.kind].n.toLowerCase())}catch(e){}}}
function plcDogGrave(d){const a=Math.random()*6.28;placeAdd(`Brzoza ${gen(d.name)}`,tcx(camp.i)+Math.cos(a)*7.5,tcx(camp.j)+Math.sin(a)*7.5,`tu pochowano psa: ${d.name}`)}
{const _dd=dogDaily;dogDaily=function(){const before=(S.dogs||[]).filter(d=>!d.dead).map(d=>d.id);_dd();(S.dogs||[]).forEach(d=>{if(d.dead&&!d.gone&&before.includes(d.id))try{plcDogGrave(d)}catch(e){}})}}
// etykiety na mapie
let plcDirty=true;const plcEl={};const plcV=new THREE.Vector3();
{const st=document.createElement('style');st.textContent=`.plc{position:absolute;transform:translate(-50%,-100%);font-family:var(--serif);font-style:italic;font-size:13.5px;color:#f1e6cc;text-shadow:0 1px 3px #000,0 0 8px #000a;white-space:nowrap;pointer-events:none;display:none}.plc::before{content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:#c9a66b;margin-right:5px;vertical-align:middle}body.pre .plc{display:none!important}`;document.head.appendChild(st)}
function plcFrame(){if(!S)return;const P=S.places||[];if(plcDirty){plcDirty=false;P.forEach((q,k)=>{if(!plcEl[k]){const e=document.createElement('div');e.className='plc';$('labels').appendChild(e);plcEl[k]=e}plcEl[k].textContent=q.n})}
 const op=Math.max(0,Math.min(1,(zoom-.75)/.3));
 P.forEach((q,k)=>{const e=plcEl[k];if(!e)return;const ti=tileOf(q.x,q.z);if(op<=.02||!revAt(ti[0],ti[1])){e.style.display='none';return}plcV.set(q.x,Hy(q.x,q.z)+.8,q.z).project(cam);
  if(plcV.z>1||Math.abs(plcV.x)>1.05||Math.abs(plcV.y)>1.05){e.style.display='none';return}e.style.display='block';e.style.opacity=op;e.style.left=((plcV.x+1)/2*innerWidth)+'px';e.style.top=((1-plcV.y)/2*innerHeight)+'px'})}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{plcFrame()}catch(e){}}}
// nazwa w karcie „Postaw tu”, w kronice i przy ognisku
{const _th=czTerrHTML;czTerrHTML=function(i,j){let h=_th(i,j);const q=placeNear(tcx(i),tcx(j),7);if(q)h=h.replace('</h4>',`</h4><p style="color:var(--gold)">Ludzie mówią na to miejsce: ${q.n}. <span class="mut">${q.why[0].toUpperCase()+q.why.slice(1)}.</span></p>`);return h}}
{const _kt=kronTools;kronTools=function(){const P=S.places||[];return _kt()+(P.length?`<div class="card"><h4>Miejsca na wyspie</h4>${P.map(q=>`<p style="margin:3px 0"><b style="color:var(--hi)">${q.n}</b> <span class="mut">${q.why}, dzień ${q.d}</span></p>`).join('')}</div>`:'')}}
{const _ct=czTalkLines;czTalkLines=function(){const L=_ct();const P=S.places||[];if(P.length&&Math.random()<.25&&L.length){const q=P[(Math.random()*P.length)|0];const ad=S.people.filter(isAdult);const sp=ad[(Math.random()*ad.length)|0];
  if(sp)L[L.length-1]=[/^(Mogiła|Kamień|Kopiec)/.test(q.n)?`Byłam dziś przy miejscu, które nazwaliśmy „${q.n}”. Ktoś zostawił tam garść jagód.`.replace('Byłam',sp.sex==='k'?'Byłam':'Byłem'):`Dzieci już mówią „${q.n}”, jakby ta nazwa była tu od zawsze.`,sp.name]}return L}}
{const _ad=actDaily;actDaily=function(){_ad();if(!S)return;try{wiedzaDaily()}catch(e){console.warn(e)}}}
{const _b=boot;boot=function(f){_b(f);plcDirty=true;for(const k in plcEl){plcEl[k].remove();delete plcEl[k]}}}
window.__wz={wiedzaDaily,wiedzaHTML,tHolders,placeAdd,TCRAFT,get places(){return S.places}};
