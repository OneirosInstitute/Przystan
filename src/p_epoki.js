
/* ================= 4.9.0-rc.9 Styl epoki po remoncie albo rozbudowie ================= */
// Budynek nosi styl epoki, w której go postawiono albo ostatnio wyremontowano lub rozbudowano (b.ep).
// Gdy osada wchodzi w nową epokę, stare budynki zostają takie, jakie były. Nowy styl dostają dopiero po remoncie albo rozbudowie.
//  epoka I (rozbitkowie): surowe bale, darń i stara strzecha, bez malowanych okiennic i koników;
//  epoka II (wieś): jak dotąd, strzecha i gont, okiennice, koniki;
//  epoka III (cała wyspa): bielone ściany, gont i deski na dachach, malowane okiennice, koniki i obramienia.
// Budynki ze starych zapisów nie mają b.ep i wyglądają tak samo jak przed tą wersją.
const EPS_N={1:'I · rozbitkowie',2:'II · wieś',3:'III · cała wyspa'};
let EP_NEW=false;
function epS(){if(!S)return 0;const e=epNow();return e>=1&&e<=3?e:0}
{const _ab=addBuildingMesh;addBuildingMesh=function(b){if(EP_NEW&&b&&b.ep===undefined&&epS())b.ep=epS();return _ab(b)}}
{const _tp=tryPlace;tryPlace=function(){EP_NEW=true;try{return _tp()}finally{EP_NEW=false}}}
{const _fp=finishProj;finishProj=function(b){const t=b&&b.proj&&b.proj.t,e=epS();
  if(b&&e&&(t==='rep'||t==='lv')){const was=b.ep;b.ep=e;if(was&&e>was)log(`${BD[b.kind].n}: po ${t==='rep'?'remoncie':'rozbudowie'} w stylu epoki ${EPS_N[e].split(' · ')[0]}.`)}
  return _fp(b)}}
{const _ub=upgradeB;upgradeB=function(id){const b=bById(id),k0=b&&b.kind,e0=b&&b.ep;if(b&&epS())b.ep=epS();const r=_ub(id);if(b&&b.kind===k0)b.ep=e0;return r}}
{const _sf=styFor;styFor=function(kind,bb){const T=_sf(kind,bb);const e=bb&&bb.ep;if(!e||!T)return T;const r=T.r,house=kind==='chata'||kind==='dom';const fire=['kuznia','laznia','mielerz','dymarka'].includes(kind);
  if(e===1){T.pal=fire||r()<.55?'dark':r()<.5?'grey':'nat';T.roof=styPick(r,[[mThatchOld,.4],[mSod,.35],[mThatch,.25]]);T.sh=0;T.koniki=false;T.trims=false;T.pots=false;T.ganek=false}
  else if(e===3){if(!fire)T.pal=styPick(r,house?[['white',.6],['nat',.25],['grey',.15]]:[['white',.45],['nat',.35],['grey',.2]]);
   if(kind!=='kuznia')T.roof=styPick(r,[[mShingle,.55],[mBoards,.3],[mThatch,.15]]);T.sh=T.sh||styPick(r,[[0x4a6a8a,.4],[0x5a7a4a,.3],[0x8a3a2a,.3]]);T.koniki=true;T.trims=true}
  return T}}
// karta budynku: w jakim stylu stoi i co go zmieni
{const _bp=bldPanelHTML;bldPanelHTML=function(b){let h=_bp(b);try{const e=b&&b.ep,now=epS();if(h&&e&&EPS_N[e]){h+=`<p class="mut">Styl: epoka ${EPS_N[e]}${now>e?`. Remont albo rozbudowa przeniesie go w styl epoki ${EPS_N[now].split(' · ')[0]}.`:'.'}</p>`}}catch(er){}return h}}
// przy przejściu do nowej epoki jedna wskazówka w kronice
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{const e=epS();if(!S||!e)return;if(!S.epSeen)S.epSeen=e;if(e>S.epSeen){S.epSeen=e;if(e>=2)log(`Nowa epoka, nowy styl budowania. Stare budynki zmienią wygląd po remoncie albo rozbudowie.`)}}catch(er){}}}
window.__ep={EPS_N,epS};
