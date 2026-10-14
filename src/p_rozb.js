
/* ================= 2.5: rozbiórka budynków i anulowanie budowy ================= */
const ROZB_NO={brama:'Bramy grodu się nie rozbiera: na niej trzyma się cały ostrokół.'};
const ROZB_SAD={cmentarz:'To miejsce, gdzie leżą nasi zmarli. Ludzie źle to przyjmą.',gaj:'Gaj jest święty dla starszych. Ludzie źle to przyjmą.'};
let rozbAsk=null;
function costMul(c,m){const o={};Object.entries(c||{}).forEach(([k,v])=>{const q=Math.floor(v*m);if(q>0)o[k]=q});return o}
const cancelBack=b=>costMul(BD[b.kind].cost,1-.5*Math.min(1,b.prog/b.work));
const rozbBack=b=>costMul(BD[b.kind].cost,.5);
const costTxt=c=>Object.keys(c).length?Object.entries(c).map(([k,v])=>RN[k].toLowerCase()+' '+v).join(' · '):'nic';
// ludzie, którzy szli do tego budynku albo dla niego nosili, zostają zwolnieni
function bldRelease(b){S.people.forEach(p=>{
  if(p.tgt===b){p.tgt=null;p.path=null;p.state='idle';p.wait=.2;p.after=null}
  if(p.haulB===b.id){haulEnd(p);if(p.state!=='away'){p.path=null;p.state='idle';p.wait=.2}}
  if(p.siteB===b.id){if(p.carry)deposit(p);p.siteB=null;p.siteQ=0;p.path=null;p.state='idle';p.wait=.2}
  if(p.job==='wb'&&p.wb===b.id){p.job='rob';p.wb=null;if(p.state==='work'){p.state='idle';p.wait=.2}}})}
function bldCancel(id){const b=bById(id);if(!b||bDone(b))return;const back=cancelBack(b);Object.entries(back).forEach(([k,v])=>S.res[k]=(S.res[k]||0)+v);
 bldRelease(b);removeBuilding(b);rozbAsk=null;log(`Budowa odwołana: ${BD[b.kind].n.toLowerCase()}. Wraca do zapasów: ${costTxt(back)}.`);toast('Budowa odwołana');renderPanel()}
function bldRozb(id){const b=bById(id);if(!b||!bDone(b))return;if(ROZB_NO[b.kind]){toast(ROZB_NO[b.kind]);return}if(b.fire){toast('Najpierw trzeba ugasić pożar.');return}
 if(b.proj&&b.proj.t!=='rozb'){toast('Tu trwają inne prace. Najpierw niech się skończą.');return}
 b.proj={t:'rozb',prog:0,work:Math.max(2,Math.ceil(BD[b.kind].work*.35))};b.want=0;S.people.forEach(p=>{if(p.job==='wb'&&p.wb===b.id){p.job='rob';p.wb=null;if(p.state==='work'){p.state='idle';p.wait=.2}}});
 rozbAsk=null;if(ROZB_SAD[b.kind]){S.hope=clamp(S.hope-.05,0,1);S.dis=clamp((S.dis||0)+.05,0,1)}
 log(`Zaczyna się rozbiórka: ${BD[b.kind].n.toLowerCase()}.`);rebuildMesh(b);assign();if(freeCount()===0)toast('Nikt nie rozbiera: wszyscy mają pracę.');renderSel();renderPanel()}
function bldRozbStop(id){const b=bById(id);if(!b||!b.proj||b.proj.t!=='rozb')return;b.proj=null;b.workers=0;S.people.forEach(p=>{if(p.tgt===b){p.tgt=null;p.state='idle';p.wait=.2}});rebuildMesh(b);log(`Rozbiórka wstrzymana: ${BD[b.kind].n.toLowerCase()} zostaje.`);renderSel();renderPanel()}
{const _fp=finishProj;finishProj=function(b){if(!b.proj||b.proj.t!=='rozb')return _fp(b);const back=rozbBack(b);Object.entries(back).forEach(([k,v])=>S.res[k]=(S.res[k]||0)+v);
  const c=bCenter(b);try{dustPuff(c.x,Hy(c.x,c.z),c.z,12,BD[b.kind].w)}catch(e){}b.proj=null;bldRelease(b);removeBuilding(b);
  log(`Rozebrano: ${BD[b.kind].n.toLowerCase()}. Z rozbiórki do zapasów: ${costTxt(back)}.`);toast('Rozebrano: '+BD[b.kind].n);renderPanel()}}
// ludzie przy rozbiórce mówią, co robią
{const _pj=planJob;planJob=function(p){const r=_pj(p);if(r&&p.tgt&&p.tgt.proj&&p.tgt.proj.t==='rozb'&&p.after==='build')p.act='rozbiera: '+BD[p.tgt.kind].n.toLowerCase();return r}}
// karta budynku: anuluj budowę, rozbierz, wstrzymaj rozbiórkę
{const _bp=bldPanelHTML;bldPanelHTML=function(b){let h=_bp(b);if(!S)return h;const n=BD[b.kind].n.toLowerCase();
  if(!bDone(b)){const back=cancelBack(b);h+=rozbAsk===b.id?`<div class="rozb"><p>Odwołać budowę? Wróci: ${costTxt(back)}.</p><button class="pri" data-anul="${b.id}">Tak, odwołaj</button><button data-rozbno="1">Nie</button></div>`
    :`<div class="rozb"><button data-rozbask="${b.id}">Anuluj budowę</button><span class="cost">wróci: ${costTxt(back)}</span></div>`;return h}
  if(b.proj&&b.proj.t==='rozb'){h+=`<div class="rozb"><button data-rozbstop="${b.id}">Wstrzymaj rozbiórkę</button></div>`;return h}
  if(ROZB_NO[b.kind])return h+`<p class="mut rozb">${ROZB_NO[b.kind]}</p>`;
  const back=rozbBack(b);const fam=BD[b.kind].house?Object.values(S.fams).find(f=>f.home===b.id):null;
  h+=rozbAsk===b.id?`<div class="rozb"><p>Rozebrać ten budynek (${n})? Robotnicy rozbiorą go w kilka godzin, a z materiału wróci: ${costTxt(back)}.${fam?' Rodzina straci dach nad głową.':''}${ROZB_SAD[b.kind]?' '+ROZB_SAD[b.kind]:''}</p><button class="pri" data-rozb="${b.id}">Tak, rozbierz</button><button data-rozbno="1">Nie</button></div>`
   :`<div class="rozb"><button data-rozbask="${b.id}">Rozbierz</button><span class="cost">wróci: ${costTxt(back)}</span></div>`;return h}}
document.addEventListener('click',ev=>{if(!S)return;const t=ev.target.closest('[data-rozbask],[data-rozb],[data-anul],[data-rozbno],[data-rozbstop]');if(!t)return;ev.stopPropagation();
 if(t.dataset.rozbask)rozbAsk=+t.dataset.rozbask;else if(t.dataset.rozbno)rozbAsk=null;else if(t.dataset.anul)bldCancel(+t.dataset.anul);else if(t.dataset.rozb)bldRozb(+t.dataset.rozb);else if(t.dataset.rozbstop)bldRozbStop(+t.dataset.rozbstop);
 const el=$('sel');if(el)el._h=null;renderSel();renderPanel()},true);
{const _s=select;select=function(id){rozbAsk=null;return _s(id)}}
{const st=document.createElement('style');st.textContent='.rozb{margin:8px 0 2px;padding-top:8px;border-top:1px solid var(--line)}.rozb p{margin:0 0 6px}.rozb button{margin:0 6px 4px 0}.rozb .cost{font-size:12.5px}';document.head.appendChild(st)}
window.__rozb={bldCancel,bldRozb,bldRozbStop,cancelBack,rozbBack};
