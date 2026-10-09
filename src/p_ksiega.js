// ================= 1.7.1 Księga: działy w jednym rzędzie, wyższy arkusz, place budowy z powodem =================
{const st=document.createElement('style');st.textContent=`
body.cz #stitle{display:none}
body.cz #shead{padding:8px 6px 8px 10px;gap:4px;justify-content:flex-start}
body.cz #shead #cz-chips{flex:1;min-width:0;display:flex;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;padding:2px 0;border:0;gap:6px;scrollbar-width:none;overscroll-behavior-x:contain;touch-action:pan-x}
body.cz #shead #cz-chips::-webkit-scrollbar{display:none}
body.cz #shead #cz-chips button{flex-shrink:0;width:auto;height:38px;padding:0 14px;border-radius:19px;display:block;color:var(--fg)}
body.cz #shead #cz-chips button.on{color:var(--hi)}
body.cz #shead .b{flex-shrink:0;border-left:1px solid var(--line);padding-left:4px}
body.cz #shead .b button{width:38px;height:38px}
@media (max-width:760px){body.cz #sheet{height:auto;top:calc(58px + env(safe-area-inset-top,0px))}body.cz #sheet.min{top:auto}}
`;document.head.appendChild(st)}
{const sh=$('shead'),ch=$('cz-chips');if(sh&&ch)sh.insertBefore(ch,sh.querySelector('.b'))}
{const _cc=czChips;czChips=function(){_cc();const el=$('cz-chips'),a=el&&el.querySelector('.on');if(!a||el._on===a.dataset.czt)return;el._on=a.dataset.czt;
  const l=a.offsetLeft-el.offsetLeft,r=l+a.offsetWidth;if(l<el.scrollLeft+8)el.scrollLeft=Math.max(0,l-24);else if(r>el.scrollLeft+el.clientWidth-8)el.scrollLeft=r-el.clientWidth+24}}

// ---------- place budowy: co się dzieje i dlaczego ----------
function siteWhy(s){
 if(s.unr>S.day)return['nie da się dojść','bad'];
 const cap=typeof siteCap==='function'?siteCap(s):s.work;
 const matWait=s.mat&&(s.del||0)<s.mat-.01&&s.prog>=cap-.02;
 if(matWait)return (s.haul||0)>0?['donoszą materiał','']:['czeka na dowóz','warn'];
 if(s.workers)return[`buduje: ${s.workers}`,'ok'];
 if((s.haul||0)>0)return['donoszą materiał',''];
 if(!isWork()){const t=tod();return[t<T0?'zaczną rano':'po pracy, jutro dalej','']}
 const free=S.people.filter(p=>isAdult(p)&&(p.job==='rob'||p.job==='bud'||!p.job)&&!(p.hp<.5)).length;
 if(!free)return['nikt nie ma wolnych rąk','warn'];
 return['czeka w kolejce',''];
}
function sitesHTML(){const sites=S.bld.filter(b=>!bDone(b));if(!sites.length)return'';
 const bs=S.people.filter(p=>p.job==='bud').length,want=(S.alloc&&S.alloc.bud)||0;
 const rows=sites.map(s=>{const pc=Math.round(100*s.prog/s.work),[w,c]=siteWhy(s);const m=s.mat?Math.round(100*Math.min(1,(s.del||0)/s.mat)):100;
  return`<div class="site" data-site="${s.id}"><b>${BD[s.kind].n} <span class="mut" style="font-weight:400">${pc}%${m<100?` · materiał ${m}%`:''}</span></b><i class="${c}">${w}</i><div class="pbar"><div style="width:${pc}%"></div></div></div>`}).join('');
 const stuck=sites.some(s=>{const w=siteWhy(s)[1];return w==='warn'||w==='bad'});
 return`<div class="card sites"><h4>Budowy<small>dotknij, żeby zobaczyć</small></h4>${rows}<div class="sbud"><span>Budowniczowie${stuck&&!bs?'<br>bez nich budują tylko wolne ręce':''}</span><button class="mini" data-al="bud" data-d="-1" aria-label="Mniej budowniczych">−</button><span class="cnt">${want}</span><button class="mini" data-al="bud" data-d="1" aria-label="Więcej budowniczych">+</button></div></div>`}
$('body').addEventListener('click',e=>{const r=e.target.closest('[data-site]');if(!r||!S)return;const b=bById(+r.dataset.site);if(!b)return;const c=bCenter(b);closeSheet();lookAt(c.x,c.z,Math.max(zoomT,1.6));selectB(b.id)});
{const st=document.createElement('style');st.textContent=`body.cz.open #toast{top:auto;bottom:calc(18px + env(safe-area-inset-bottom,0px))}`;document.head.appendChild(st)}
{const st=document.createElement('style');st.textContent=`body.cz.open #cz-goal{display:none}`;document.head.appendChild(st)}
