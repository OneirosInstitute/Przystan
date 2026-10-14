
// ================= 1.2 Cicha wyspa: ekran bez menu, wszystko pod palcem =================
let czPaused=null;let czOn=true;try{czOn=localStorage.getItem('przystan-ui')!=='pelne'}catch(e){}
document.body.classList.toggle('cz',czOn);
{const st=document.createElement('style');st.textContent=`
body.cz #date,body.cz #stats,body.cz #res,body.cz #goal,body.cz #needs,body.cz #tabbar,body.cz #brand{display:none!important}
body.cz #speed{display:none!important}
body.cz.czpop #speed{display:flex!important;position:absolute;right:10px;left:auto;top:58px;bottom:auto;height:auto;flex-wrap:wrap;justify-content:flex-end;max-width:min(340px,calc(100% - 20px));padding:6px;gap:4px;z-index:6}
body.cz.czpop #speed button{width:auto;min-width:44px;height:44px;padding:0 10px;font-size:15px}
body.cz.czpop #speed i{display:none}
#cz-top,#cz-bot,#cz-goal,#cz-edge,#cz-talk{display:none}
body.cz #cz-top{display:flex;position:absolute;left:0;right:0;top:0;padding:10px 12px 18px;padding-top:calc(10px + env(safe-area-inset-top,0px));align-items:center;justify-content:space-between;gap:8px;z-index:3;pointer-events:none;background:linear-gradient(#141b18aa,#141b1800)}
#cz-top>*{pointer-events:auto}
#cz-l{display:flex;align-items:center;gap:7px;flex-wrap:wrap;min-width:0}
#cz-date{background:none;border:0;padding:4px 2px;color:var(--hi);text-align:left;text-shadow:0 1px 3px #000a;cursor:pointer}
#cz-date b{font-family:var(--serif);font-size:19px;font-weight:700}
#cz-date small{font-size:13.5px;color:#e6e0cc;margin-left:7px}
.czc{height:28px;padding:0 10px;border-radius:14px;display:inline-flex;align-items:center;gap:5px;font-size:13.5px;font-weight:700;border:1px solid var(--ember);background:#3c1e12d9;color:#f6c48e;cursor:pointer}
.czc.bad{border-color:var(--bad);background:#30140fe6;color:#f4b3aa;animation:czp 1.6s ease-out infinite}
@keyframes czp{0%{box-shadow:0 0 0 0 #d4746a88}80%{box-shadow:0 0 0 9px #d4746a00}}
#cz-tempo{height:40px;min-width:56px;padding:0 12px;border-radius:20px;border:1px solid #c9a66b88;background:#18201cc7;color:var(--hi);font:600 15px var(--sans);display:flex;align-items:center;gap:6px;flex-shrink:0}
#cz-tempo svg{width:15px;height:15px}
body.cz #cz-goal{display:block;position:absolute;left:12px;top:calc(56px + env(safe-area-inset-top,0px));max-width:min(78%,360px);padding:7px 12px;border-radius:12px;background:var(--panel);border:1px solid var(--line);z-index:3;opacity:0;transform:translateY(-6px);transition:opacity .5s,transform .5s;pointer-events:none}
body.cz #cz-goal.on{opacity:1;transform:none;pointer-events:auto}
#cz-goal small{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
#cz-goal span{font-family:var(--serif);font-size:16px;color:var(--hi)}
body.cz #cz-bot{display:flex;position:absolute;left:0;right:0;bottom:calc(20px + env(safe-area-inset-bottom,0px));justify-content:center;align-items:center;gap:12px;z-index:3;pointer-events:none}
#cz-bot button{pointer-events:auto}
.czr{width:48px;height:48px;border-radius:24px;border:1px solid var(--line);background:#18201cd9;display:flex;align-items:center;justify-content:center;color:var(--fg);padding:0}
.czr svg{width:22px;height:22px}.czr.on{border-color:var(--gold);color:var(--gold)}
#cz-osada{height:52px;padding:0 26px;border-radius:26px;border:1px solid var(--gold);background:#18201ce6;color:var(--hi);font:700 18px var(--serif);display:flex;align-items:center;gap:10px;box-shadow:0 6px 18px #0006}
#cz-osada svg{width:20px;height:20px;color:var(--gold)}
body.cz.open #cz-bot,body.cz.selon #cz-bot,body.cz.placing #cz-bot,body.photo #cz-bot,body.photo #cz-top,body.photo #cz-edge,body.photo #cz-talk,body.pre #cz-top,body.pre #cz-bot,body.pre #cz-edge,body.pre #cz-talk,body.pre #cz-goal{display:none!important}
body.cz #cz-edge{display:block;position:absolute;inset:0;pointer-events:none;z-index:3}
.cze{position:absolute;height:44px;padding:0 12px;border-radius:22px;display:none;align-items:center;gap:7px;font:600 14.5px var(--sans);pointer-events:auto;white-space:nowrap;border:1px solid var(--gold);background:#18201cf0;color:var(--hi);box-shadow:0 4px 14px #0007;transform:translate(-50%,-50%)}
.cze.bad{border-color:var(--bad);background:#30140ff0;color:#f4d6cf;animation:czp 1.6s ease-out infinite}
.cze.warn{border-color:var(--ember)}
.cze svg{width:16px;height:16px;flex-shrink:0}
body.cz #cz-talk{display:flex;flex-direction:column;gap:8px;position:absolute;left:18px;right:18px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:2;pointer-events:none;opacity:0;transition:opacity 1.2s}
body.cz #cz-talk.on{opacity:1}
body.cz.open #cz-talk,body.cz.selon #cz-talk{opacity:0}
#cz-talk small{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);text-shadow:0 1px 3px #000}
#cz-talk p{margin:0;font-family:var(--serif);font-style:italic;font-size:18px;line-height:1.3;color:var(--hi);text-shadow:0 1px 4px #000,0 0 12px #000a}
#cz-talk p span{font-family:var(--sans);font-style:normal;font-size:13.5px;color:#d8d6c6;margin-left:6px}
#cz-chips{display:none}
body.cz #cz-chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 10px;border-bottom:1px solid var(--line)}
#cz-chips button{height:36px;padding:0 13px;border-radius:18px;border:1px solid var(--line);background:transparent;color:var(--fg);font:500 14.5px var(--sans)}
#cz-chips button.on{border-color:var(--gold);background:#2c2a20;color:var(--hi);font-weight:700}
body.cz #sel{padding:14px 14px 12px;border-radius:14px;width:340px;bottom:calc(20px + env(safe-area-inset-bottom,0px))}
body.cz #sel h4{font-size:20px;padding-right:46px}
body.cz #sel p{font-size:14.5px;line-height:1.4}
body.cz #sel button{min-height:40px}
.cz-x{position:absolute;right:8px;top:8px;width:40px;height:40px;border-radius:20px;border:1px solid var(--line);background:transparent;color:var(--fg);display:flex;align-items:center;justify-content:center;padding:0}
.cz-x svg{width:17px;height:17px}
.cz-act{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.cz-act button{flex:1 1 auto}
.cz-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:#1c2420;margin:6px 0}
.cz-row.top{border-color:var(--gold)}
.cz-row div{flex:1;min-width:0}
.cz-row b{display:block;font-family:var(--serif);font-size:16.5px;color:var(--hi)}
.cz-row small{display:block;font-size:13.5px;color:#b9bcaa;line-height:1.3}
.cz-row button{flex-shrink:0;min-width:84px}
.cz-ey{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.cz-jobs button{display:block;width:100%;text-align:left;margin:4px 0}
body.cz #toast{top:calc(64px + env(safe-area-inset-top,0px))}
body.cz #sheet{top:60px}
@media (max-width:760px){
 body.cz #sheet{left:0;right:0;bottom:0;top:auto;width:auto;height:calc(100% - 118px);border-radius:16px 16px 0 0;border:0;border-top:1px solid var(--gold)}
 body.cz #sel{left:8px;right:8px;width:auto;max-width:none;bottom:calc(10px + env(safe-area-inset-bottom,0px));max-height:64%}
 body.cz #cancel{bottom:calc(24px + env(safe-area-inset-bottom,0px))}
 body.cz #pinfo{bottom:calc(76px + env(safe-area-inset-bottom,0px))}
}
@media (hover:none),(pointer:coarse){body.cz #ctl,body.cz #mini{display:none!important}}
@media (max-height:460px) and (min-width:600px){body.cz #sheet{top:8px;height:auto;bottom:8px;left:auto;right:8px;width:360px;border-radius:12px}body.cz #cz-talk{bottom:76px}}
`;document.head.appendChild(st)}
const czMk=(tag,id,html,parent)=>{const e=document.createElement(tag);e.id=id;e.innerHTML=html||'';(parent||$('app')).appendChild(e);return e};
const CZ_BOOK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>';
const CZ_ISLE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15c2-6 5-9 9-9 4 0 7 3 7 6 0 4-4 7-9 7-3 0-6-1-7-4z"/><path d="M9 13l2-2 3 2"/></svg>';
const CZ_FIRE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4"/></svg>';
const CZ_ARR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
const czTop=czMk('div','cz-top','<div id="cz-l"><button id="cz-date" aria-label="Pora roku i cel"></button><span id="cz-thr"></span></div><button id="cz-tempo" aria-label="Tempo gry"></button>');
const czGoal=czMk('div','cz-goal','');
const czBot=czMk('div','cz-bot',`<button class="czr" id="cz-isl" aria-label="Cała wyspa">${CZ_ISLE}</button><button id="cz-osada">${CZ_BOOK}Osada</button><button class="czr" id="cz-home" aria-label="Wróć do obozu">${ico('dom')}</button>`);
const czEdge=czMk('div','cz-edge','');
const czTalk=czMk('div','cz-talk','');
{const ch=document.createElement('div');ch.id='cz-chips';$('sheet').insertBefore(ch,$('body'))}
// zdjęcie w menu tempa
if(!$('speed').querySelector('[data-photo]'))$('speed').insertAdjacentHTML('beforeend','<button data-photo="1" aria-label="Tryb zdjęć" style="width:auto;padding:0 10px">Foto</button>');

// ---------- górna linia ----------
const CZ_TABS=[['osada','Ludzie'],['praca','Praca'],['budowa','Budowa'],['wyprawy','Wyprawy'],['wiedza','Wiedza'],['natura','Natura'],['kronika','Kronika']];
function czNeedDays(){const need=K*S.people.reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)*(law('oszczedne')?.8:1)||1;return foodTotal()/need}
function czThreats(){const L=[],days=czNeedDays(),sea=seasonIdx();
 if(S.bld.some(b=>b.fire))L.push(['pożar',4,'bad']);
 if(days<5){const d=Math.max(0,Math.floor(days));L.push([`jedzenie na ${d} ${dniW(d)}`,days<2?3:2,days<2?'bad':''])}
 if((sea===1||sea===2)&&S.res.opal<30)L.push([`mało opału: ${fmt(S.res.opal)}`,S.res.opal<10?3:2,S.res.opal<10?'bad':'']);
 if(S.warm<.4)L.push(['zimno w domach',2,'']);if(S.health<.5)L.push(['choroby',2,'']);if((S.dis||0)>.6)L.push(['kłótnie',2,'']);
 const hl=S.people.filter(p=>!homeOf(p)).length;if(hl&&(sea===1||sea===2))L.push([`bez dachu: ${hl}`,1,'']);
 return L.sort((a,b)=>b[1]-a[1]).slice(0,2)}
let czGoalT=null,czGoalTm=0;
function czShowGoal(){const g=goalInfo();if(!g)return;setH(czGoal,`<small>${g.ch||'Cel'}</small><span>${g.t}</span>`);czGoal.classList.add('on');clearTimeout(czGoalTm);czGoalTm=setTimeout(()=>czGoal.classList.remove('on'),9000)}
{const _rt=renderTop;renderTop=function(){_rt();if(!czOn||!S)return;
  const d=Math.floor(rday()),s=Math.floor(d/SD),t=tod();const part=t<.2?'noc':t<.3?'świt':t<.7?'dzień':t<.82?'zmierzch':'noc';
  setH($('cz-date'),`<b>${SEAS[s]} · ${d%SD+1}</b><small>${part} · ${WEATHER[S.weather.k][0]}</small>`);
  setH($('cz-thr'),czThreats().map(x=>`<button class="czc ${x[2]}" data-czthr="1">${x[0]==='pożar'?CZ_FIRE:''}${x[0]}</button>`).join(''));
  setH($('cz-tempo'),S.speed===0?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 5v14M16 5v14"/></svg>${czPaused&&!$('sheet').hidden?'czas stoi':'stoi'}`:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>${S.speed}×`);
  $('cz-isl').classList.toggle('on',!!overview);document.body.classList.toggle('placing',!!placing);
  const g=goalInfo();const gt=g?g.t:null;if(gt!==czGoalT){czGoalT=gt;if(gt)czShowGoal()}}}
$('cz-date').addEventListener('click',()=>{if(S)czShowGoal()});
$('cz-tempo').addEventListener('click',e=>{e.stopPropagation();document.body.classList.toggle('czpop')});
$('speed').addEventListener('click',e=>{if(e.target.closest('[data-sp],[data-photo]'))document.body.classList.remove('czpop')});
$('cz-top').addEventListener('click',e=>{if(e.target.closest('[data-czthr]'))openSheet('osada')});
$('cz-isl').addEventListener('click',()=>{if(S)toggleOverview()});
$('cz-home').addEventListener('click',()=>{if(S)lookAt(tcx(camp.i),tcx(camp.j),Math.max(zoomT,1.4))});
let czLastTab='osada';
$('cz-osada').addEventListener('click',()=>{if(S)openSheet(czLastTab)});
cv.addEventListener('pointerdown',()=>document.body.classList.remove('czpop'));

// ---------- księga Osada: działy zamiast zakładek, gra stoi ----------
function czChips(){if(!czOn)return;const el=$('cz-chips');setH(el,CZ_TABS.map(([k,n])=>`<button data-czt="${k}" class="${tab===k?'on':''}">${n}</button>`).join(''))}
$('cz-chips').addEventListener('click',e=>{const b=e.target.closest('[data-czt]');if(b&&S)openSheet(b.dataset.czt)});
{const _os=openSheet;openSheet=function(t){const was=$('sheet').hidden;_os(t);czLastTab=t;if(czOn&&was&&S&&S.speed>0){czPaused=S.speed;setSpeed(0)}document.body.classList.remove('czpop');if(czOn)select(null);czChips()}}
{const _cs=closeSheet;closeSheet=function(){_cs();if(czPaused&&S&&S.speed===0)setSpeed(czPaused);czPaused=null}}
{const _rp=renderPanel;renderPanel=function(){_rp();if(!czOn||!S||$('sheet').hidden)return;$('stitle').textContent=S.vname||'Przystań';czChips()}}
function domW(n){return n===1?'dom':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'domy':'domów'}
function czSumHTML(){const pop=S.people.length,houses=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length,days=czNeedDays(),sea=seasonIdx();
 let s=`${pop} ${osb(pop)}, ${houses} ${domW(houses)}. `;
 s+=days>=12?'Jedzenia starczy na długo.':days>=5?`Jedzenia na ${Math.floor(days)} dni.`:days>=1?`Jedzenia zostało na ${Math.floor(days)} ${dniW(Math.floor(days))}. To pilne.`:'Spiżarnia jest pusta.';
 if(sea===1||sea===2)s+=S.res.opal<10?' Opału prawie nie ma.':S.res.opal<30?' Opału ledwo starczy.':'';
 const hl=S.people.filter(p=>!homeOf(p)).length;if(hl)s+=` Bez dachu: ${hl}.`;
 if((S.dis||0)>.6)s+=' Ludzie się kłócą.';else if(S.hope>.75)s+=' Ludzie mają nadzieję.';
 const g=goalInfo();const pc=v=>Math.round(v*100)+'%';
 return`<div class="card"><p style="font-family:var(--serif);font-size:17px;color:var(--hi);margin:0 0 6px;line-height:1.35">${s}</p><p class="mut" style="margin:4px 0 0">Ciepło ${pc(S.warm)} · zdrowie ${pc(S.health)} · nadzieja ${pc(S.hope)} · niezgoda ${pc(S.dis||0)}</p></div>`}
{const _th=troubleHTML;troubleHTML=function(){return(czOn&&S?czSumHTML():'')+_th()}}

// ---------- karty: zamknij, człowiek, teren ----------
let selT=null,czJobs=false;
{const _sel=select;select=function(id){selT=null;czJobs=false;return _sel(id)}}
function krokW(n){return n===1?'krok':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'kroki':'kroków'}
function czGoalKind(){const g=goalInfo();const h=g&&HINT[g.t];const m=h&&String(h[2]).match(/data-b="(\w+)"/);return m?m[1]:null}
function czSuggest(i,j){const out=[],gk=czGoalKind();const homeless=Object.values(S.fams).filter(f=>!f.home&&famMembers(f.id).length);
 for(const k of BKEYS){const d=BD[k];if(!CATS.some(c=>c[0]===d.cat)||!bAvail(k))continue;
  const ni=clamp(i-((d.w-1)>>1),0,N-d.w),nj=clamp(j-((d.h-1)>>1),0,N-d.h);if(!checkPlace(k,ni,nj))continue;
  let sc=3,why='';if(k===gk){sc+=100;why='to teraz najważniejszy cel'}
  const n=countInRange(k,ni,nj);
  if(n!==null){if(n<2&&k!==gk)continue;sc+=Math.min(40,n*2);if(!S.bld.some(b=>b.kind===k))sc+=15;why=why||rangeLabel(k,n)}
  else if(d.house){if(homeless.length){sc+=50+8*homeless.length;why=why||(homeless.length===1?`rodzina ${gen(famName(homeless[0].id))} śpi pod gołym niebem`:`rodzin bez dachu: ${homeless.length}`)}else why=why||'dom dla młodej pary'}
  else if(d.store){const f=foodTotal()/foodCap();sc+=f>.8?35:6;why=why||(f>.8?'zapasy ledwo się mieszczą':`mieści ${d.cap} żywności`)}
  else{let t=(d.d||'').split('. ')[0];if(t.length>70)t=t.slice(0,68)+'…';why=why||t}
  const af=canAfford(d.cost);if(!af)sc-=20;out.push({k,why,sc,af})}
 return out.sort((a,b)=>b.sc-a.sc)}
function czTerrHTML(i,j){const k=j*N+i,r=regionAt(i,j);let trees=0;for(const q of nodeBy.tree)if(!q.gone&&q.amt>0&&Math.abs(q.i-i)<=3&&Math.abs(q.j-j)<=3)trees++;
 const what=beach[k]?'Brzeg':trees>=5?'Skraj lasu':slope(i,j)>.7?'Zbocze':'Polana';const dist=Math.round(Math.hypot(i-camp.i,j-camp.j));
 const L=czSuggest(i,j);let h=`<div class="cz-ey">Postaw tu</div><h4>${what}${r&&r.known&&r.name?` · ${r.name}`:''}</h4><p class="mut">${dist<2?'przy obozie':`${dist} ${krokW(dist)} od obozu`}${trees?` · drzew wokół: ${trees}`:''}</p>`;
 if(!L.length)h+='<p>Tu nie da się nic postawić: woda, stromizna albo zajęte miejsce.</p>';
 L.slice(0,3).forEach((s,n)=>{const d=BD[s.k];h+=`<div class="cz-row${n===0?' top':''}"><div><b>${d.n}</b><small>${s.why} · ${costHTML(d.cost)}</small></div><button class="${n===0&&s.af?'pri':''}" data-czput="${s.k}">${s.af?'Postaw':'Brakuje'}</button></div>`});
 if(L.length>3)h+=`<button data-czall="1" style="width:100%;margin-top:4px">Wszystkie budynki, które tu pasują (${L.length})</button>`;
 else h+=`<button data-czall="1" style="width:100%;margin-top:4px">Wszystkie budynki</button>`;
 return h}
function selectT(i,j){select(null);selT={i,j};if(typeof mkRing!=='undefined'){mkRing.visible=true;mkRing.scale.set(1.3,1.3,1.3);const x=tcx(i),z=tcx(j);mkRing.position.set(x,Hy(x,z)+.08,z)}renderSel()}
function czPersonAct(p){if(!isAdult(p)||!isWorker(p)||p.job==='wyp')return`<div class="cz-act"><button data-czfol="1">Idź za ${p.sex==='k'?'nią':'nim'}</button></div>`;
 if(czJobs){const opts=[['rob','Wolne ręce (robotnik)'],['bud',p.sex==='k'?'Budowniczka':'Budowniczy'],['zwiad',p.sex==='k'?'Zwiadowczyni':'Zwiadowca']];
  S.bld.filter(b=>bDone(b)&&BD[b.kind].wk).forEach(b=>{const here=p.job==='wb'&&p.wb===b.id;const full=(b.want||0)>=wkOf(b)&&!here;if(!full)opts.push(['b:'+b.id,`${BD[b.kind].n} (${b.want||0}/${wkOf(b)})`])});
  const cur=p.job==='wb'?'b:'+p.wb:p.job;
  return`<div class="cz-jobs"><div class="cz-ey" style="margin-top:8px">Nowa praca dla: ${p.name}</div>${opts.map(([v,n])=>`<button data-czset="${v}" class="${v===cur?'pri':''}">${n}</button>`).join('')}</div>`}
 return`<div class="cz-act"><button class="pri" data-czjob="1">Zmień pracę</button><button data-czfol="1">Idź za ${p.sex==='k'?'nią':'nim'}</button></div>`}
function czSetJob(p,v){if(p.job==='wb'){const b=bById(p.wb);if(b)b.want=Math.max(0,(b.want||0)-1)}
 else if(p.job==='bud'||p.job==='zwiad'||p.job==='zdun'||p.job==='czyt')S.alloc[p.job]=Math.max(0,(S.alloc[p.job]||0)-1);
 if(p.state==='work'||p.state==='move'){release(p);p.path=null;p.state='idle'}p.wait=.1;
 if(v==='rob'){p.job='rob';p.wb=null}else if(v==='bud'||v==='zwiad'){S.alloc[v]=(S.alloc[v]||0)+1;p.job=v;p.wb=null}
 else if(v.startsWith('b:')){const b=bById(+v.slice(2));if(b){b.want=Math.min(wkOf(b),(b.want||0)+1);p.job='wb';p.wb=b.id}}
 assign();czJobs=false;$('sel')._h=null;renderSel();if(tab)renderPanel();toast(`${p.name}: ${jobLabel(p)}`)}
{const _rs=renderSel;renderSel=function(){const el=$('sel');
  if(selT&&S){el.style.display='block';const h=czTerrHTML(selT.i,selT.j);if(el._h!==h){el._h=h;el.innerHTML=h}}else _rs();
  if(!czOn)return;const vis=el.style.display==='block';document.body.classList.toggle('selon',vis);if(!vis)return;
  if(!el.querySelector('.cz-x'))el.insertAdjacentHTML('afterbegin',`<button class="cz-x" aria-label="Zamknij">${ico('x')}</button>`);
  if(selId!==null&&selN===null&&!selT&&!el.querySelector('.cz-act,.cz-jobs')){const p=pById(selId);if(p)el.insertAdjacentHTML('beforeend',czPersonAct(p))}}}
$('sel').addEventListener('click',e=>{if(!S)return;const t=e.target.closest('button');if(!t)return;
 if(t.classList.contains('cz-x')){select(null);return}
 if(t.dataset.czput){const k=t.dataset.czput,{i,j}=selT||{};if(i===undefined)return;startPlace(k);moveGhost(i,j);if(ghostTile&&checkPlace(k,ghostTile[0],ghostTile[1])&&canAfford(BD[k].cost))tryPlace();return}
 if(t.dataset.czall){openSheet('budowa');return}
 const p=selId!==null?pById(selId):null;if(!p)return;
 if(t.dataset.czjob){czJobs=true;const el=$('sel');el.querySelectorAll('.cz-act').forEach(x=>x.remove());el.insertAdjacentHTML('beforeend',czPersonAct(p));return}
 if(t.dataset.czset){czSetJob(p,t.dataset.czset);return}
 if(t.dataset.czfol){follow=true;toast(`Kamera idzie za: ${p.name}`)}});
{const _ot=onTap;onTap=function(x,y){document.body.classList.remove('czpop');
  if(!S||!czOn||placing||(typeof ladTool!=='undefined'&&ladTool)||document.body.classList.contains('photo'))return _ot(x,y);
  const hadSel=$('sel').style.display==='block';
  const hs=pick(x,y,[pGroup])[0];if(hs&&hs.object.userData.pid!==undefined)return _ot(x,y);
  const hb=pick(x,y,[bGroup])[0];if(hb&&hb.object.userData.bid!==undefined)return _ot(x,y);
  if(typeof nodeAtScreen==='function'&&nodeAtScreen(x,y))return _ot(x,y);
  if(hadSel){select(null);return}
  const h=pick(x,y,[terrain])[0];if(!h){select(null);return}
  const i=Math.floor(h.point.x+N/2),j=Math.floor(h.point.z+N/2);if(i<1||j<1||i>=N-1||j>=N-1||!land[j*N+i]||!rev[j*N+i]){select(null);return}
  selectT(i,j)}}

// ---------- znaki przy krawędzi ekranu ----------
const czEl={},czV=new THREE.Vector3();
const CZ_CERN={kupala:'Noc Kupały',wesele:'Wesele',dziady:'Dziady',gody:'Szczodre Gody',marzanna:'Topienie Marzanny'};
function czTargets(){const T=[];S.bld.forEach(b=>{if(b.fire){const c=bCenter(b);T.push({k:'f'+b.id,x:c.x,z:c.z,t:'Pożar: '+BD[b.kind].n.toLowerCase(),c:'bad',ic:CZ_FIRE,b:b.id})}});
 const C=S.cer;if(C&&C.c&&typeof cerActive==='function'&&cerActive())T.push({k:'cer',x:C.c.x,z:C.c.z,t:CZ_CERN[C.k]||'Obrzęd',c:''});
 (S.hamlets||[]).forEach(h=>{if(h.need&&revAt(h.i,h.j))T.push({k:'h'+h.id,x:tcx(h.i),z:tcx(h.j),t:`${h.name} prosi o pomoc`,c:'warn',ham:1})});return T}
function czEdgeTick(){if(!S||!czOn)return;const r=cv.getBoundingClientRect(),W=r.width,H=r.height,seen={};
 const T=czTargets();
 for(const t of T){seen[t.k]=1;let e=czEl[t.k];if(!e){e=document.createElement('button');e.className='cze';e.addEventListener('click',()=>{lookAt(e._t.x,e._t.z,Math.max(zoomT,1.3));if(e._t.b!==undefined)selectB(e._t.b);if(e._t.ham)openSheet('osada')});czEdge.appendChild(e);czEl[t.k]=e}
  e._t=t;e.className='cze '+t.c;czV.set(t.x,Hy(t.x,t.z)+1,t.z).project(cam);let sx=(czV.x+1)/2*W,sy=(1-czV.y)/2*H;const behind=czV.z>1;
  const m=36,top=78,bot=H-110;const inside=!behind&&sx>m&&sx<W-m&&sy>top&&sy<bot;if(inside){e.style.display='none';continue}
  let dx=sx-W/2,dy=sy-H/2;if(behind){dx=-dx;dy=-dy}const s=Math.min((W/2-m-60)/Math.max(1e-3,Math.abs(dx)),((bot-top)/2-10)/Math.max(1e-3,Math.abs(dy)));
  const px=W/2+dx*s,py=(top+bot)/2+dy*s;const ang=Math.atan2(dy,dx)*180/Math.PI;
  const h=`${t.ic||''}${t.t}<span style="display:inline-flex;transform:rotate(${Math.round(ang)}deg)">${CZ_ARR}</span>`;if(e._h!==h){e._h=h;e.innerHTML=h}
  e.style.display='flex';e.style.left=Math.round(clamp(px,110,W-110))+'px';e.style.top=Math.round(py)+'px'}
 for(const k in czEl)if(!seen[k]){czEl[k].remove();delete czEl[k]}}

// ---------- przy ognisku: co mówią we wsi ----------
function czRecent(rx,days){const d0=Math.floor(S.day)-days;return(S.kron||[]).some(x=>x[0]>=d0&&rx.test(x[1]))}
function czTalkLines(){const C=[],sea=seasonIdx(),days=czNeedDays(),ad=S.people.filter(isAdult);const pick=a=>a[(Math.random()*a.length)|0];
 const add=(t,w,subj)=>C.push({t,w,subj});
 if(days<4)add('W spiżarni coraz luźniej. Długo tak nie pociągniemy.',5);
 if((sea===1||sea===2)&&S.res.opal<30)add('Opału starczy na parę nocy. Trzeba iść z siekierą.',5);
 const hf=Object.values(S.fams).filter(f=>!f.home&&famMembers(f.id).length);if(hf.length&&(sea===1||sea===2))add(`Rodzina ${gen(famName(hf[0].id))} znowu śpi pod gołym niebem.`,4);
 const sick=S.people.filter(p=>p.hp<.5);if(sick.length){const p=pick(sick);add(`${p.name} słabnie od kilku dni. Trzeba kogoś, kto zna się na ziołach.`,3,p)}
 const idle=ad.filter(p=>p.job==='rob'&&/bez zajęcia/.test(p.act||''));if(idle.length){const p=pick(idle);add(`${p.name} znowu ${p.sex==='k'?'chodziła':'chodził'} cały dzień bez zajęcia.`,2,p)}
 if((S.dis||0)>.5)add('Każdy ciągnie w swoją stronę. Tak się nie da żyć.',4);
 if(czRecent(/zmarł|umiera|umarł|zmarła/,3))add('Przy ognisku jest ciszej, odkąd zabrakło jednego głosu.',4);
 if(czRecent(/wesel|ślub/,3))add('Dawno nie było tak wesoło jak na tym weselu.',3);
 if(czRecent(/Ukończono/,1))add('Jeszcze jedna budowa skończona. Ręce bolą, ale było warto.',2);
 const mk=S.mark?Object.keys(S.mark).length:0;if(mk>8)add('Las przy obozie rzednie. Za parę lat po drewno trzeba będzie chodzić dalej.',2);
 if(!S.wreck.gone&&YEAR-5-Math.floor(S.day)<10&&YEAR-5-Math.floor(S.day)>0)add('Wrak długo nie wytrzyma. Morze już go szarpie.',4);
 if(sea===1&&SD-Math.floor(rday())%SD<5)add('Czuć już zimę w powietrzu.',3);
 if(sea===3)add('Ziemia odmarza. Niedługo trzeba będzie siać.',1);
 if(S.hope>.75&&days>8)add('Pierwszy raz od rozbicia myślę, że damy radę.',2);
 const kids=S.people.filter(p=>p.age>=5&&p.age<12);if(kids.length){const k=pick(kids);add(`${k.name} pyta, czy kiedyś wrócimy. Nie wiem, co ${k.sex==='k'?'jej':'mu'} powiedzieć.`,1,k)}
 add('Cicho dziś. Tylko fale i ogień.',1);add('Ryby podchodzą pod brzeg. Jutro może być dobry połów.',1);add('Plecy bolą, ale dach nad głową jest.',1);
 const out=[];for(let n=0;n<2&&C.length;n++){let tot=C.reduce((a,c)=>a+c.w,0),x=Math.random()*tot,c=C[0];for(const q of C){if(x<q.w){c=q;break}x-=q.w}C.splice(C.indexOf(c),1);
  const sp=ad.filter(p=>p!==c.subj&&p.job!=='wyp');if(sp.length)out.push([c.t,pick(sp).name])}
 return out}
let czTalkOn=false;
function czTalkTick(){if(!S||!czOn)return;const t=tod(),d=Math.floor(S.day);
 if(!czTalkOn&&t>=.8&&t<.93&&S.czTalkD!==d&&!evOpen&&S.people.length>1){S.czTalkD=d;const L=czTalkLines();if(!L.length)return;
  czTalk.innerHTML='<small>Przy ognisku</small>'+L.map(([x,n])=>`<p>„${x}”<span>${n}</span></p>`).join('');czTalk.classList.add('on');czTalkOn=true}
 else if(czTalkOn&&(t>=.95||t<.8)){czTalk.classList.remove('on');czTalkOn=false}}

// ---------- gesty: obrót dwoma palcami ----------
let czRot=null;
cv.addEventListener('pointermove',()=>{if(!czOn||pts.size!==2){czRot=null;return}const a=[...pts.values()];const ang=Math.atan2(a[1].y-a[0].y,a[1].x-a[0].x);if(czRot===null){czRot=ang;return}let d=ang-czRot;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;if(Math.abs(d)<.5)yawT+=CZ_ROTS*d;czRot=ang});
cv.addEventListener('pointerup',()=>{if(pts.size<2)czRot=null});
const CZ_ROTS=1;

// ---------- wskazówki: Osada i działy zamiast zakładek ----------
hintTick=function(rdt){hintT+=rdt;if(hintT<.6)return;hintT=0;hintEl.forEach(e=>e.classList.remove('hintp'));hintEl=[];if(!S||!hintsOn||(S.act||1)>4||evOpen||placing)return;
 const g=goalInfo();if(!g)return;const h=HINT[g.t];if(!h)return;const[tb,cat0,sel]=h;const cat=typeof cat0==='function'?cat0():cat0;let el=null;
 if($('sheet').hidden)el=czOn?$('cz-osada'):document.querySelector(`#tabbar [data-tab="${tb}"]`);
 else if(tab!==tb)el=czOn?document.querySelector(`#cz-chips [data-czt="${tb}"]`):document.querySelector(`#tabbar [data-tab="${tb}"]`);
 else if(cat&&tb==='budowa'&&buildCat!==cat)el=document.querySelector(`[data-bcat="${cat}"]`);
 else el=document.querySelector('#body '+sel);
 if(el){el.classList.add('hintp');hintEl.push(el)}};

// ---------- przełącznik w Kronice ----------
{const _kt=kronTools;kronTools=function(){return _kt()+`<div class="card"><h4>Wygląd ekranu</h4><p class="mut">Cicha wyspa: na ekranie tylko świat, pora roku i przycisk Osada. Pełne menu: dawny układ z zakładkami i paskami.</p><button data-czui="1" class="pri">${czOn?'Cicha wyspa (włączona)':'Pełne menu (włączone)'}</button></div>`}}
document.addEventListener('click',e=>{if(!e.target.closest('[data-czui]'))return;czOn=!czOn;try{localStorage.setItem('przystan-ui',czOn?'cicha':'pelne')}catch(er){}document.body.classList.toggle('cz',czOn);document.body.classList.remove('selon','czpop');renderCtl();renderPanel();renderTop()});

{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{czEdgeTick();czTalkTick()}catch(e){}}}
window.__cz={rt:()=>renderTop(),czSuggest,selectT,czThreats,czTalkLines,czSetJob,czEdgeTick,get selT(){return selT},czSumHTML,setRot(v){}};
// pierwsza gra: jedno zdanie o tym, jak się gra bez menu
{const _b=boot;boot=function(fresh){_b(fresh);try{if(czOn&&S&&!S.seen.czHelp){S.seen.czHelp=1;setTimeout(()=>{if(evOpen)return;const el=$('toast');el.textContent='Dotknij ziemi, budynku, drzewa albo człowieka. Resztę znajdziesz w księdze Osada.';el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),7000)},12000)}}catch(e){}}}
