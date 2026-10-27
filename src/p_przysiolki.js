
/* ================= 4.9.0-rc.12 Przysiółki: później, dalej i z własną kartą ================= */
// 1. Epoka I to przede wszystkim Przystań: przetrwać, potem urosnąć. Przysiółek zakłada się dopiero,
//    gdy w osadzie mieszka co najmniej 50 osób (także prośba młodych „Chcemy iść na swoje”).
// 2. Przysiółki stają daleko: trzy krainy najbliżej Przystani zostają zwykłymi krainami wyspy,
//    a miejsce na przysiółek wybiera się co najmniej 50 kroków od obozu i z dala od zabudowy osady.
//    Dawne przysiółki, które stoją za blisko, raz przenoszą się dalej, z całym dobytkiem i etapem rozwoju.
// 3. Przysiółek na mapie można dotknąć. Karta pokazuje mieszkańców, zapasy, dobytek, budowy,
//    prośby i najważniejsze wieści z przysiółka, a stąd można wysłać dary albo pomoc.
let HAM_MIN=50;const HAM_DIST=50,HAM_BLD=24;
let hamNearC=null;
function hamNear3(){const key=camp.i+','+camp.j+','+REGIONS.length;if(hamNearC&&hamNearC.key===key)return hamNearC.set;
 const d=r=>Math.hypot(r.i-camp.i,r.j-camp.j);const ids=REGIONS.filter(r=>r&&r.id!==0).sort((a,b)=>d(a)-d(b)).slice(0,3).map(r=>r.id);hamNearC={key,set:new Set(ids)};return hamNearC.set}
function hamFar(r){return !!r&&!hamNear3().has(r.id)&&Math.hypot(r.i-camp.i,r.j-camp.j)>=HAM_DIST}
{const _ok=hamRegionOK;hamRegionOK=function(r){return _ok(r)&&hamFar(r)}}
{const _wn=kolWhyNot;kolWhyNot=function(){const n=S.people.length;if(n<HAM_MIN)return`Przysiółek zakłada się, gdy w Przystani mieszka co najmniej ${HAM_MIN} osób (teraz ${n}). Najpierw osada musi przetrwać i urosnąć.`;return _wn()}}
{const ev=EVENTS.find(e=>e.id==='kol_mlodzi');if(ev){const c0=ev.cond;ev.cond=()=>S.people.length>=HAM_MIN&&c0()}}
// córki przysiółków (epoka III) też nie stają tuż przy Przystani
{const _fn=e3FreeNear;e3FreeNear=function(h){const ok=new Set(e3Regs().map(r=>r.id)),used=new Set((S.hamlets||[]).map(x=>x.rid));
  return REGIONS.filter(r=>r&&r.id!==0&&ok.has(r.id)&&!used.has(r.id)&&hamFar(r)).sort((a,b)=>Math.hypot(a.i-h.i,a.j-h.j)-Math.hypot(b.i-h.i,b.j-h.j))[0]||null}}
// miejsce w krainie: z dala od obozu i od budynków osady
function hamBldDist(i,j){let m=1e9;for(const b of S.bld){const d=BD[b.kind];if(!d)continue;const dd=Math.hypot(b.i+d.w/2-i,b.j+d.h/2-j);if(dd<m)m=dd}return m}
hamletSpot=function(r){let best=null,bs=1e9;for(let rr=0;rr<20;rr++)for(let a=0;a<24;a++){const i=Math.round(r.i+Math.cos(a/24*6.283)*rr),j=Math.round(r.j+Math.sin(a/24*6.283)*rr);if(i<3||j<3||i>N-4||j>N-4)continue;const k=j*N+i;if(!land[k]||beach[k]||occ[k]>=0)continue;
  const dc=Math.hypot(i-camp.i,j-camp.j),db=hamBldDist(i,j);const sc=forestF(i+.5,j+.5)*20+rr*.6+(tileH(i,j)>6?8:0)+Math.max(0,HAM_DIST-dc)*4+Math.max(0,HAM_BLD-db)*4;if(sc<bs){bs=sc;best=[i,j]}}return best||[r.i,r.j]};
// ---- przeniesienie przysiółków, które stoją za blisko ----
function hamTooClose(h){return Math.hypot(h.i-camp.i,h.j-camp.j)<HAM_DIST||hamNear3().has(h.rid)}
function hamRelocate(h){const used=new Set(S.hamlets.filter(x=>x!==h).map(x=>x.rid));
 const r=REGIONS.filter(r=>r&&r.id!==0&&!used.has(r.id)&&hamRegionOK(r)&&S.regs&&S.regs[r.id]).sort((a,b)=>Math.hypot(a.i-camp.i,a.j-camp.j)-Math.hypot(b.i-camp.i,b.j-camp.j))[0];if(!r)return false;
 const old=hamM[h.id];if(old){for(let k=fires.length-1;k>=0;k--)if(fires[k].g.parent===old)fires.splice(k,1);retireObjects(old);delete hamM[h.id]}
 if(typeof hamRib!=='undefined'&&hamRib[h.id]){try{retireObjects(hamRib[h.id])}catch(e){}delete hamRib[h.id]}
 const[i,j]=hamletSpot(r);h.rid=r.id;h.i=i;h.j=j;delete h.ang;delete hamPath[h.id];reveal(i,j,6);
 try{kolPath(h);kolReveal(h);kolClearPath(h,h.road===2);kolTread()}catch(e){}hamVis();
 log(`Przysiółek ${h.name} przenosi się dalej od Przystani, do krainy ${r.name}. Za blisko było do pól i warsztatów osady. Chaty i dobytek stawiają na nowo, tak jak stały.`);return true}
{const _kd=kolDaily;kolDaily=function(){if(S&&S.hamlets&&!S.hamMv&&S.epoch!==4){let left=0;S.hamlets.slice().forEach(h=>{if(h.arr&&S.day<h.arr){left++;return}if(hamTooClose(h)&&!hamRelocate(h))left++});if(!left)S.hamMv=1}return _kd()}}

// ---- mieszkańcy przysiółka: imiona, wiek, kto jest starszym ----
function hzAge(f){return Math.max(0,(S.day-f.b)/YEAR)}
function hzNew(h,adult){const s=Math.random()<.5?'k':'m',used=new Set((h.mies||[]).map(f=>f.n));let n=newName(s);for(let q=0;q<6&&used.has(n);q++)n=newName(s);
 const age=adult?18+Math.random()*12:0;return{n,s,b:S.day-age*YEAR}}
function hamFolks(h){if(!h.mies){const P=h.ppl||[];h.mies=P.map((n,k)=>({n,s:/a$/.test(n)?'k':'m',b:S.day-(k===0?38+Math.random()*10:k<3?20+Math.random()*14:4+Math.random()*10)*YEAR}))}
 const L=h.mies;while(L.length<h.pop)L.push(hzNew(h,Math.random()<.35));
 while(L.length>h.pop&&L.length){let k=0,w=-1;L.forEach((f,q)=>{const s=hzAge(f)+(f.n===h.head?-30:0)+Math.random()*25;if(s>w){w=s;k=q}});L.splice(k,1)}
 if(L.length&&!L.some(f=>f.n===h.head)){const a=L.filter(f=>hzAge(f)>=16).sort((x,y)=>hzAge(y)-hzAge(x))[0];if(a)h.head=a.n}
 return L}
// śmierć w przysiółku zabiera kogoś z listy mieszkańców (to samo imię w kronice i na karcie)
{const _hd=hamDeath;hamDeath=function(h,why){if(!h||h.pop<=0)return _hd(h,why);const L=hamFolks(h);
  let v=null,w=-1;L.forEach(f=>{const s=(f.n===h.head?0:1)*(hzAge(f)*.8+Math.random()*30);if(s>w){w=s;v=f}});if(!v)return _hd(h,why);
  const nn=newName;newName=()=>v.n;let r;try{r=_hd(h,why)}finally{newName=nn}h.mies=L.filter(f=>f!==v);return r}}
// założyciele z prawdziwym wiekiem i płcią
{const _fh=foundHamlet;foundHamlet=function(m,why,rid,o){const snap=(m||[]).map(p=>({n:p.name,s:p.sex,b:S.day-(p.age||20)*YEAR}));const h=_fh(m,why,rid,o);if(h&&snap.length)h.mies=snap;return h}}
// ---- wieści: wszystko, co kronika mówi o przysiółku, trafia też na jego kartę ----
{const _lg=log;log=function(t){_lg(t);try{if(S&&S.hamlets&&typeof t==='string')for(const h of S.hamlets){if(h.name&&t.includes(h.name)){h.news=h.news||[];h.news.unshift({d:Math.floor(S.day)+1,t});if(h.news.length>10)h.news.length=10}}}catch(e){}}}

// ---- karta przysiółka po dotknięciu na mapie ----
let selH=null;const hzV=new THREE.Vector3();
{const _sel=select;select=function(id){selH=null;return _sel(id)}}
function hamAtScreen(x,y){if(!S||!S.hamlets||S.epoch===4)return null;const gs=S.hamlets.map(h=>hamM[h.id]).filter(g=>g&&g.visible);
 if(gs.length){const hit=pick(x,y,gs)[0];if(hit){let o=hit.object;while(o&&!gs.includes(o))o=o.parent;const id=Object.keys(hamM).find(k=>hamM[k]===o);if(id!==undefined){const h=S.hamlets.find(q=>q.id===+id);if(h)return h}}}
 const r=cv.getBoundingClientRect();let best=null,bd=40;for(const h of S.hamlets){const g=hamM[h.id];if(!g||!g.visible)continue;hzV.set(tcx(h.i),Hy(tcx(h.i),tcx(h.j))+1,tcx(h.j)).project(cam);if(hzV.z>1)continue;
  const d=Math.hypot((hzV.x+1)/2*r.width+r.left-x,(1-hzV.y)/2*r.height+r.top-y);if(d<bd){bd=d;best=h}}return best}
{const _ot=onTap;onTap=function(x,y){if(S&&!placing&&!(typeof ladTool!=='undefined'&&ladTool)&&!(typeof drTool!=='undefined'&&drTool)&&!document.body.classList.contains('photo')&&!pick(x,y,[bGroup])[0]){const h=hamAtScreen(x,y);if(h){select(null);selH=h.id;renderSel();return}}return _ot(x,y)}}
function hzDays(d){const n=Math.max(0,Math.floor(S.day)+1-d);return n===0?'dziś':n===1?'wczoraj':n+' '+dniW(n)+' temu'}
function hamCardHTML(h){hamInit(h);const r=REGIONS[h.rid],T=HAM_T[hType(h)],L=hamFolks(h),trav=h.arr&&S.day<h.arr;
 const P=hamPath[h.id],steps=P?Math.round(P.len):Math.round(Math.hypot(h.i-camp.i,h.j-camp.j)*1.3);
 const ad=L.filter(f=>hzAge(f)>=16),kids=L.length-ad.length;
 let s=`<h4>${escapeHtml(h.name)} <span class="mut" style="font-size:13px">${hamKind(h)}</span></h4>
 <p>${r&&r.known?escapeHtml(r.name)+' · ':''}${h.pop} ${osb(h.pop)} (${ad.length} ${plW(ad.length,'dorosły','dorosłych','dorosłych')}, ${kids} ${plW(kids,'dziecko','dzieci','dzieci')}) · ${rodName(h.rod)}</p>
 <div class="hz-stats"><div><small>Więź z Przystanią</small><b>${wiezWord(h)}</b><i style="--v:${Math.round((h.wiez||0)*100)}%"></i></div><div><small>Zapasy jedzenia</small><b>${zapWord(h.zap||0)}</b><i style="--v:${Math.round((h.zap||0)*100)}%"></i></div></div>`;
 if(trav)s+=`<p class="mut">Są jeszcze w drodze. Pierwsze szałasy staną za kilka dni.</p>`;
 s+=`<p class="mut">Droga: ${h.road===2?'wyrównana':h.rb?'w budowie '+Math.round(100*h.rb.p/h.rb.n)+'%':P?'wydeptana ścieżka':'brak drogi lądem'}, około ${steps} kroków od Przystani${h.pal?' · częstokół':''}.</p>`;
 // mieszkańcy
 s+=`<details class="hz-sec" open><summary>Mieszkańcy</summary><div class="hz-folk">`+L.slice().sort((a,b)=>(b.n===h.head)-(a.n===h.head)||hzAge(b)-hzAge(a)).map(f=>{const a=Math.floor(hzAge(f));return`<span>${escapeHtml(f.n)}<small>${f.n===h.head?'starsz'+(f.s==='k'?'a':'y')+' · ':''}${a<1?'niemowlę':a+' '+latW(a)}</small></span>`}).join('')+`</div>${h.lost?`<p class="mut">Pochowano tam: ${h.lost} ${osb(h.lost)}${(h.lostN||[]).length?' (ostatnio '+h.lostN.slice(-2).map(escapeHtml).join(', ')+')':''}.</p>`:''}</details>`;
 // zapasy i dobytek
 const mag=Object.entries(h.mag||{}).filter(([k,v])=>v>=1);
 s+=`<details class="hz-sec"><summary>Zapasy i dobytek</summary><p>Jedzenia mają ${Math.round((h.zap||0)*100)}% tego, co trzeba na spokojną zimę. Przysiółek daje: ${T.d}.</p><p>${mag.length?'W składzie: '+mag.map(([k,v])=>(RN[k]||k).toLowerCase()+' '+Math.floor(v)).join(', ')+'.':'Skład jest pusty. Materiał na budowy przynoszą tragarze z Przystani albo zbierają sami.'}</p></details>`;
 if(h.need)s+=`<div class="hask"><p><b>Prośba:</b> ${NEEDS[h.need.k][1]} (${h.need.q}). Czekają jeszcze ${Math.max(1,Math.ceil(h.need.until-S.day))} ${dniW(Math.max(1,Math.ceil(h.need.until-S.day)))}.</p><button data-kneed="${h.id}" ${needHave(h.need.k,h.need.q)?'class="pri"':'disabled'}>Wyślij ${NEEDS[h.need.k][1]}</button></div>`;
 // rozwój: etap, budowy, prośby rodu
 s+=hamBudHTML(h);
 // wieści
 const N2=(h.news||[]).slice(0,5);s+=`<details class="hz-sec" ${N2.length?'open':''}><summary>Co u nich słychać</summary>${N2.length?N2.map(x=>`<p class="hz-news"><small>${hzDays(x.d)}</small>${escapeHtml(x.t)}</p>`).join(''):'<p class="mut">Ostatnio nic ważnego. Wieści z przysiółka trafiają tutaj i do kroniki.</p>'}</details>`;
 s+=`<div class="cz-act" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button data-kdar="${h.id}">Dary (20 porcji jedzenia, 6 porcji opału)</button><button data-hzall="1">Cała wspólnota</button></div>`;
 return s}
{const _rs=renderSel;renderSel=function(){const el=$('sel');if(selH!==null&&S){const h=(S.hamlets||[]).find(q=>q.id===selH);if(!h||S.epoch===4){selH=null;return _rs()}el.style.display='block';const s=hamCardHTML(h);
   if(el._h!==s){const keep=[...el.querySelectorAll('details')].map(d=>d.open);el._h=s;el.innerHTML=s;const ds=el.querySelectorAll('details');keep.forEach((o,k)=>{if(ds[k])ds[k].open=o})}
   if(typeof czOn!=='undefined'&&czOn){document.body.classList.add('selon');if(!el.querySelector('.cz-x'))el.insertAdjacentHTML('afterbegin',`<button class="cz-x" aria-label="Zamknij">${ico('x')}</button>`)}return}return _rs()}}
document.addEventListener('click',e=>{if(!S)return;const t=e.target.closest('[data-hzall]');if(!t)return;select(null);openSheet('osada')});
// po każdej akcji na karcie (dary, prośba, budowa) odśwież ją od razu
document.addEventListener('click',e=>{if(selH!==null&&e.target.closest('#sel [data-kdar],#sel [data-kneed],#sel [data-hbud],#sel [data-hsend],#sel [data-hhelp],#sel [data-hprop]'))gameLater(()=>{if(selH!==null)renderSel()},0)});
{const st=document.createElement('style');st.textContent=`.hz-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0}.hz-stats div{background:#ffffff08;border:1px solid #33402f;border-radius:8px;padding:6px 8px}
.hz-stats small{display:block;font-size:11px;color:var(--mut)}.hz-stats b{display:block;color:var(--hi);font-weight:600;margin:1px 0 4px}.hz-stats i{display:block;height:4px;border-radius:2px;background:linear-gradient(90deg,#c9a66b var(--v),#2c352f var(--v))}
.hz-sec{margin:6px 0;border-top:1px solid #2a2f2c}.hz-sec summary{cursor:pointer;padding:6px 0;color:var(--hi)}.hz-folk{display:flex;flex-wrap:wrap;gap:4px 10px;margin-bottom:4px}.hz-folk span{font-size:14px;color:var(--hi)}.hz-folk small{display:block;font-size:11px;color:var(--mut)}
.hz-news{margin:4px 0;font-size:14px;line-height:1.4}.hz-news small{display:block;font-size:11px;color:var(--gold,#c9a66b)}`;document.head.appendChild(st)}
window.__przys={get min(){return HAM_MIN},set min(v){HAM_MIN=v},hamFar,hamNear3,hamFolks,hamCardHTML,hamAtScreen,hamRelocate,hamTooClose,get selH(){return selH},set selH(v){selH=v}};
