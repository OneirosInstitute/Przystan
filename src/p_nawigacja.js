
/* ================= 4.2 Menu: pięć działów, widoki i wyszukiwarka budowy (projekt: docs/PROJEKT_WYSPY_5.md, rozdz. 7) ================= */
// Dwa poziomy i nigdy więcej: dział (Osada, Ludzie, Budowa, Zadania, Wiedza), a w nim widok albo pasek budowy.
// Widoki korzystają z tych samych zakładek co wcześniej (TABS zostają), dzielą tylko ich sekcje między siebie,
// więc każda funkcja, która woła openSheet('osada') albo openSheet('kronika'), działa jak dawniej.
const NV_PEOPLE=['osada:people','osada:community','osada:memory'],NV_JOURNAL=['game:watki','game:journal','game:save'];
const NV=[
 {k:'osada',n:'Osada',i:'dom',v:[{k:'przeglad',n:'Przegląd',t:'osada',hide:NV_PEOPLE},{k:'kronika',n:'Kronika',t:'kronika',only:NV_JOURNAL},{k:'opcje',n:'Opcje',t:'kronika',hide:NV_JOURNAL}]},
 {k:'ludzie',n:'Ludzie',i:'ludzie',v:[{k:'praca',n:'Praca',t:'praca'},{k:'mieszkancy',n:'Mieszkańcy',t:'osada',only:NV_PEOPLE}]},
 {k:'budowa',n:'Budowa',i:'budowa',v:[{k:'budowa',n:'Budowa',t:'budowa'}]},
 {k:'zadania',n:'Zadania',i:'zadania',v:[{k:'zadania',n:'Zadania',t:'zadania'},{k:'wyprawy',n:'Wyprawy',t:'wyprawy'}]},
 {k:'wiedza',n:'Wiedza',i:'wiedza',v:[{k:'wiedza',n:'Wiedza',t:'wiedza'},{k:'natura',n:'Natura',t:'natura'}]}];
const NV_VIEWS={};NV.forEach(s=>s.v.forEach(v=>{v.s=s.k;NV_VIEWS[v.k]=v}));
let nvView=null,nvNext=null,nvQ='',nvP='';
const nvLast=(()=>{try{const o=JSON.parse(localStorage.getItem('przystan-nav')||'{}');return o&&typeof o==='object'?o:{}}catch(e){return{}}})();
const nvSec=k=>NV.find(s=>s.k===k);
function nvSecView(k){const s=nvSec(k);return s.v.find(v=>v.k===nvLast[k])||s.v[0]}
function nvViewFor(t){if(nvNext&&NV_VIEWS[nvNext]&&NV_VIEWS[nvNext].t===t)return nvNext;if(nvView&&NV_VIEWS[nvView].t===t)return nvView;
 for(const s of NV)for(const v of s.v)if(v.t===t)return v.k;return null}
function nvGo(k){const v=NV_VIEWS[k];if(!v||!S)return;const moved=nvView!==k;nvNext=k;try{openSheet(v.t)}finally{nvNext=null}if(moved)$('body').scrollTop=0}
{const _os=openSheet;openSheet=function(t){nvView=nvViewFor(t);if(nvView){nvLast[NV_VIEWS[nvView].s]=nvView;try{localStorage.setItem('przystan-nav',JSON.stringify(nvLast))}catch(e){}}return _os(t)}}
// ---------- widok: które sekcje zakładki są widoczne ----------
function nvApply(){const b=$('body'),v=NV_VIEWS[nvView];let mode='';
 if(v&&(v.only||v.hide)){const h=String(b.innerHTML||'');if((v.only||v.hide).some(k=>h.includes(`data-ui-section="${k}"`)))mode=v.k}
 if(b.dataset.nv!==mode)b.dataset.nv=mode}
{const css=[];for(const v of Object.values(NV_VIEWS)){if(v.only)css.push(`#body[data-nv="${v.k}"]>*${v.only.map(k=>`:not([data-ui-section="${k}"])`).join('')}{display:none!important}`);
  if(v.hide)css.push(v.hide.map(k=>`#body[data-nv="${v.k}"]>[data-ui-section="${k}"]`).join(',')+'{display:none!important}')}
 const st=document.createElement('style');st.textContent=css.join('\n')+`
#nv-view{flex-shrink:0;padding:0 14px 10px;border-bottom:1px solid var(--line)}#nv-view[hidden],#sheet.min #nv-view{display:none}
.nv-seg{display:flex;gap:3px;padding:3px;border-radius:12px;background:#0000002e;border:1px solid var(--line)}
.nv-seg button{flex:1 1 0;min-width:0;min-height:42px;border:0;border-radius:9px;background:transparent;color:var(--fg);font:600 14.5px var(--sans);padding:0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nv-seg button.on{background:#2c2a20;color:var(--hi);box-shadow:inset 0 0 0 1px var(--gold)}
#nv-tools{display:flex;gap:6px;align-items:stretch}#nv-tools[hidden],#nv-seg[hidden],#nv-p[hidden],#nv-hint[hidden]{display:none}
#nv-p{display:block;width:100%;box-sizing:border-box;margin-top:8px;height:44px;border-radius:10px;border:1px solid var(--line);background:#0000002e;color:var(--hi);font:500 15px var(--sans);padding:0 12px}#nv-p::placeholder{color:var(--mut)}#nv-p:focus{outline:2px solid var(--gold);outline-offset:1px}
#body .nv-miss{display:none!important}
#nv-q{flex:1 1 100%;min-width:0;height:44px;border-radius:10px;border:1px solid var(--line);background:#0000002e;color:var(--hi);font:500 15px var(--sans);padding:0 12px}
#nv-q::placeholder{color:var(--mut)}#nv-q:focus{outline:2px solid var(--gold);outline-offset:1px}
body.cz #cz-chips{overflow:visible;gap:4px}body.cz #cz-chips button{flex:1 1 0;min-width:0;padding:0 2px;font-size:14px;overflow:hidden;text-overflow:ellipsis}body.cz #cz-chips button.on{font-weight:650}
@media(max-height:460px),(max-width:370px){body.cz #cz-chips button{font-size:13px}}
#nv-hint{font-size:13px;color:var(--mut);margin:6px 2px 0}
`;document.head.appendChild(st)}
// ---------- pasek działów: Cicha wyspa w panelu, pełne menu na dole ----------
{const el=document.createElement('div');el.id='nv-view';el.hidden=true;el.innerHTML='<div class="nv-seg" id="nv-seg" role="tablist"></div><div id="nv-tools" hidden><input id="nv-q" type="search" enterkeyhint="search" autocomplete="off" placeholder="Szukaj budynku" aria-label="Szukaj budynku"></div><input id="nv-p" type="search" enterkeyhint="search" autocomplete="off" placeholder="Szukaj osoby, fachu albo budynku" aria-label="Szukaj osoby, fachu albo budynku" hidden><div id="nv-hint" hidden></div>';
 $('sheet').insertBefore(el,$('body'))}
const nvCur=()=>nvView&&!$('sheet').hidden?NV_VIEWS[nvView].s:null;
const nvOn=el=>{const cur=nvCur();for(const b of el.children)b.classList.toggle('on',b.dataset.nvs===cur)};
czChips=function(){if(!czOn)return;const el=$('cz-chips');setH(el,NV.map(s=>`<button data-czt="${nvSecView(s.k).t}" data-nvs="${s.k}">${s.n}</button>`).join(''));nvOn(el)};
function nvTabbar(){const el=$('tabbar');setH(el,NV.map(s=>`<button data-tab="${nvSecView(s.k).t}" data-nvs="${s.k}">${ico(s.i)}<span>${s.n}</span></button>`).join(''));nvOn(el)}
function nvNav(){if(!S)return;czChips();nvTabbar();const box=$('nv-view');if($('sheet').hidden||!nvView){box.hidden=true;return}
 const s=nvSec(NV_VIEWS[nvView].s),build=s.k==='budowa';box.hidden=!(s.v.length>1||build);
 setH($('nv-seg'),s.v.length>1?s.v.map(v=>`<button role="tab" data-nvv="${v.k}" class="${v.k===nvView?'on':''}" aria-selected="${v.k===nvView}">${v.n}</button>`).join(''):'');$('nv-seg').hidden=s.v.length<2;
 const ppl=s.k==='ludzie';$('nv-p').hidden=!ppl;if(ppl){const q=$('nv-p');if(document.activeElement!==q&&q.value!==nvP)q.value=nvP}if(!ppl)$('nv-hint').hidden=true;
 $('nv-tools').hidden=!build;if(build){const q=$('nv-q');if(document.activeElement!==q&&q.value!==nvQ)q.value=nvQ}}
{const _rp=renderPanel;renderPanel=function(){_rp();if(!S)return;try{if(!$('sheet').hidden&&tab){if(!nvView||NV_VIEWS[nvView].t!==tab)nvView=nvViewFor(tab);nvApply();nvPeople();if(!czOn&&nvView){const s=nvSec(NV_VIEWS[nvView].s),t=s.v.length>1?NV_VIEWS[nvView].n:s.n;if($('stitle').textContent!==t)$('stitle').textContent=t}}nvNav()}catch(e){console.warn(e)}}}
{const _cs=closeSheet;closeSheet=function(){const r=_cs();try{nvNav()}catch(e){}return r}}
// kliknięcia: dział, widok, rodzaj budowli, wyszukiwarka
function nvSecClick(e){const b=e.target.closest&&e.target.closest('[data-nvs]');if(!b||!S)return;e.stopImmediatePropagation();e.preventDefault();const k=b.dataset.nvs;
 if(nvCur()===k&&!czOn){closeSheet();return}nvGo(nvSecView(k).k)}
$('cz-chips').addEventListener('click',nvSecClick,true);$('tabbar').addEventListener('click',nvSecClick,true);
$('nv-seg').addEventListener('click',e=>{const b=e.target.closest('[data-nvv]');if(!b||!S)return;nvGo(b.dataset.nvv)});
$('nv-q').addEventListener('input',e=>{nvQ=String(e.target.value||'').slice(0,40);if(nvQ&&['remont','drogi','lad'].includes(buildCat))buildCat='teraz';$('body')._h=null;renderPanel();$('body').scrollTop=0});
$('nv-q').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur();if(e.key==='Escape'){e.stopPropagation();e.target.value='';nvQ='';$('body')._h=null;renderPanel()}});
// ---------- wyszukiwarka w Ludziach: po imieniu, fachu albo budynku ----------
const nvOpened=new Set();
function nvPeople(){const b=$('body');if(!b.querySelectorAll)return;const on=nvView&&NV_VIEWS[nvView].s==='ludzie',q=on?nvNorm(nvP).trim():'';
 if(!q&&!b.querySelector('.nv-miss')&&!nvOpened.size)return;let n=0;const v=NV_VIEWS[nvView]||{},L=[...b.querySelectorAll('.card,.row')].filter(e=>!e.querySelector('.card,.row'));
 const shown=e=>{const k=e.closest('[data-ui-section]')?.dataset.uiSection;return!k||!b.dataset.nv||(v.only?v.only.includes(k):!(v.hide||[]).includes(k))};
 for(const e of L){const ok=!q||nvNorm(e.textContent).includes(q);e.classList.toggle('nv-miss',!ok);if(!ok||!q||!shown(e))continue;n++;
  // rozwiń zwinięte sekcje z trafieniem; po wyczyszczeniu wracają do stanu sprzed szukania
  for(let d=e.closest('details');d&&b.contains(d);d=d.parentElement&&d.parentElement.closest('details'))if(!d.open){d.open=true;nvOpened.add(d)}}
 if(!q){for(const d of nvOpened)if(b.contains(d))d.open=false;nvOpened.clear()}
 const h=$('nv-hint'),txt=q?(n?`Pasuje: ${n}`:`Nic nie pasuje do „${nvP.trim()}”.`):'';h.hidden=!txt;if(h.textContent!==txt)h.textContent=txt}
$('nv-p').addEventListener('input',e=>{nvP=String(e.target.value||'').slice(0,40);nvPeople();$('body').scrollTop=0});
$('nv-p').addEventListener('keydown',e=>{if(e.key==='Enter')e.target.blur();if(e.key==='Escape'){e.stopPropagation();e.target.value='';nvP='';nvPeople()}});
// ---------- wyszukiwarka i „Możesz postawić teraz” w Budowie ----------
$('body').addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-bcat]')&&nvQ){nvQ='';$('nv-q').value=''}},true);
const nvNorm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ł/g,'l');
function nvKeys(){const q=nvNorm(nvQ).trim();
 if(q){const cn=Object.fromEntries(CATS);const rank=k=>{const n=nvNorm(BD[k].n);return n.startsWith(q)?0:n.includes(q)?1:2};return BKEYS.filter(k=>{const d=BD[k];return nvNorm(d.n).includes(q)||nvNorm(cn[d.cat]).includes(q)||q.length>=4&&nvNorm(d.d).includes(q)}).sort((a,b)=>rank(a)-rank(b))}
 if(buildCat==='teraz')return BKEYS.filter(k=>bAvail(k)&&canAfford(BD[k].cost));
 return BKEYS.filter(k=>BD[k].cat===buildCat)}
function nvEmpty(){return nvQ.trim()?`Nic nie pasuje do „${escapeHtml(nvQ.trim())}”. Spróbuj krócej, na przykład „chata” albo „pole”.`:buildCat==='teraz'?'Na nic nie starcza teraz materiałów. Wybierz rodzaj budowli, żeby zobaczyć, czego brakuje.':'Nic tu jeszcze nie ma.'}
// ---------- gest: przeciągnięcie nagłówka w dół zamyka panel ----------
{let sy=null,sx=0;$('shead').addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button'))return;sy=e.clientY;sx=e.clientX},{passive:true});
 addEventListener('pointerup',e=>{if(sy!==null&&e.clientY-sy>70&&Math.abs(e.clientX-sx)<60&&S&&!$('sheet').hidden)closeSheet();sy=null},{passive:true});addEventListener('pointercancel',()=>{sy=null},{passive:true})}
// ---------- wskazówki pierwszych dni wskazują dział, widok i rodzaj budowli ----------
hintTick=function(rdt){hintT+=rdt;if(hintT<.6)return;hintT=0;hintEl.forEach(e=>e.classList.remove('hintp'));hintEl=[];if(!S||!hintsOn||(S.act||1)>4||evOpen||placing)return;
 const g=goalInfo();if(!g)return;const h=HINT[g.t];if(!h)return;const[tb,cat0,sel]=h;const cat=typeof cat0==='function'?cat0():cat0;let el=null;
 const vk=sel==='[data-knew]'?'mieszkancy':nvViewFor(tb),v=NV_VIEWS[vk];if(!v)return;const secBtn=()=>document.querySelector(czOn?`#cz-chips [data-nvs="${v.s}"]`:`#tabbar [data-nvs="${v.s}"]`);
 if($('sheet').hidden)el=czOn?$('cz-osada'):secBtn();
 else if(nvCur()!==v.s)el=secBtn();
 else if(nvView!==vk||tab!==tb)el=document.querySelector(`#nv-seg [data-nvv="${vk}"]`);
 else if(cat&&tb==='budowa'&&buildCat!==cat)el=document.querySelector(`#body [data-bcat="${cat}"]`);
 else el=document.querySelector('#body '+sel);
 if(el){el.classList.add('hintp');hintEl.push(el)}};
{const _b=boot;boot=function(f){_b(f);try{nvNav()}catch(e){}}}
try{nvNav()}catch(e){}
window.__nv={NV,NV_VIEWS,nvGo,nvKeys,nvPeople,get p(){return nvP},set p(v){nvP=v},get view(){return nvView},get q(){return nvQ},set q(v){nvQ=v}};
