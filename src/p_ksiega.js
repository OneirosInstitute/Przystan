// Księga: nawigację obsługuje p_menu.js. Tutaj pozostają informacje o budowach.

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
