
/* ================= 4.6.0-rc.3 Karczowanie pniaków we wsi ================= */
// Ścięte drzewo zostawia pniak. Tam, gdzie wieś się buduje i rośnie (przy chatach, budowach i placu), wolne ręce
// wykopują pniaki, gdy nie ma nic pilniejszego. Najpierw przy budowach, potem przy gotowych domach.
// Pniak znika na zawsze (tam już nic nie odrośnie, leśnik go nie obsadzi), a korzenie idą na opał.
// Obszar wsi liczy się z mapy kafli raz na jakiś czas, nie w każdej klatce (bateria).
let karMask=null,karList=[],karKey='',karT=-1e9;
function karVillage(){const M=new Uint8Array(N*N),stamp=(ci,cj,r,v)=>{const R=Math.ceil(r);for(let j=Math.max(0,cj-R);j<=Math.min(N-1,cj+R);j++)for(let i=Math.max(0,ci-R);i<=Math.min(N-1,ci+R);i++){if((i-ci)**2+(j-cj)**2>r*r)continue;const k=j*N+i;if(M[k]<v)M[k]=v}};
 stamp(camp.i,camp.j,9,1);
 for(const b of S.bld){const d=BD[b.kind];if(!d)continue;const ci=Math.round(b.i+d.w/2),cj=Math.round(b.j+d.h/2),r=Math.max(d.w,d.h)/2;
  if(bDone(b))stamp(ci,cj,r+3.5,1);else stamp(ci,cj,r+2.5,2)}   // 2: przy budowie, pierwszeństwo
 return M}
function karStumps(){const key=S.bld.length+'|'+S.bld.filter(bDone).length+'|'+(S.karczN||0);
 if(karMask&&key===karKey&&S.t-karT<20)return karList;karKey=key;karT=S.t;karMask=karVillage();
 karList=nodeBy.tree.filter(n=>!n.gone&&n.amt<=0&&!(n.grow>0)&&karMask[n.j*N+n.i]&&revAt(n.i,n.j));return karList}
function karJob(p){if(!S||!isWorker(p)||!isWork())return false;const L=karStumps();if(!L.length)return false;let best=null,bd=1e9;
 for(const n of L){if(n.gone||n.claim>=1||n.bad>S.t)continue;const d=Math.abs(n.x-p.x)+Math.abs(n.z-p.z)-(karMask[n.j*N+n.i]===2?20:0);if(d<bd){bd=d;best=n}}
 if(!best)return false;const st=nearestWalk(best.i,best.j);if(!st){best.bad=S.t+60;return false}
 if(go(p,st,'karcz',best)){best.claim++;p.act=karMask[best.j*N+best.i]===2?'karczuje pniak przy budowie':'karczuje pniak we wsi';return true}return false}
// gdy nie ma nic pilnego, wolne ręce karczują
{const _aj=autoJob;autoJob=function(p){if(_aj(p))return true;return karJob(p)}}
{const _oa=onArrive;onArrive=function(p){if(p.after!=='karcz')return _oa(p);p.after=null;p.wt=0;p.state='work';p.workKind='karcz'}}
{const _sp=stepPerson;stepPerson=function(p,dt){
  if(p.state==='work'&&p.workKind==='karcz'&&!p.fireB){const n=p.tgt;
   if(!n||n.gone||n.amt>0||n.grow>0||!isWork()){release(p);p.state='idle';p.wait=.2;return}
   p.wt+=dt*eff(p)*craftEff(p,'drwal');gainXp(p,'drwal',dt*.5);
   if(p.wt>=8+6*(n.sc||1)){p.wt=0;n.gone=1;n.claim=0;S.karcz=S.karcz||[];S.karcz.push(n.id);S.karczN=(S.karczN||0)+1;nodeVis(n);release(p);karT=-1e9;
    if(!S.seen.karcz){S.seen.karcz=1;log(p.name+' wykopuje pierwszy pniak przy chatach. Korzenie suszy się na opał, a ziemia jest równa pod nowe budowy.')}
    finishTrip(p,[{res:'opal',q:2}])}
   return}
  return _sp(p,dt)}}
// po wczytaniu: wykarczowane pniaki nie wracają
{const _rw=rebuildWorldFromState;rebuildWorldFromState=function(){_rw();karMask=null;if(!S||!S.karcz||!S.karcz.length)return;
  for(const id of S.karcz){const n=nodes[id];if(n&&n.type==='tree'){n.gone=1;n.amt=0;nodeSet(n)}}nodeMeshes.forEach(m=>{m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true})}}
// praca we wsi: „Karczowanie” w Ludzie → Praca (tak jak budowniczowie); karczownicy bez pniaków pracują jak wolne ręce
{const _as=assign;assign=function(){_as();if(!S)return;S.alloc=S.alloc||{};const want=S.alloc.kar||0,pool=adultsPool();
  const cur=pool.filter(p=>p.job==='kar').sort((x,y)=>(y.sk.drwal||0)-(x.sk.drwal||0));while(cur.length>want)cur.pop().job='rob';
  let have=cur.length;if(have<want){const f=pool.filter(p=>p.job==='rob'||!p.job).sort((x,y)=>((y.sk.drwal||0)-(x.sk.drwal||0))||(x.age-y.age));while(have<want&&f.length){f.shift().job='kar';have++}}}}
{const _jl=jobLabel;jobLabel=function(p){if(p.job==='kar'&&!isChild(p))return p.sex==='k'?'karczowniczka':'karczownik';return _jl(p)}}
{const _pj=planJob;planJob=function(p){
  if(!S||p.fireB||!isAdult(p)||!isWorker(p)||restNow(p))return _pj(p);
  if(p.job==='kar'){if(karJob(p))return true;p.job='rob';let r=false;try{r=_pj(p)}finally{if(p.job==='rob')p.job='kar'}return r}
  // budowniczowie bez budowy najpierw równają teren przy budowach i we wsi
  if(p.job==='bud'&&!budSites()&&!haulSite(6)&&!(S.mark&&Object.keys(S.mark).length)&&karJob(p))return true;
  return _pj(p)}}
function karRowHTML(){const ks=S.people.filter(p=>p.job==='kar'),n=karStumps().length,near=karList.filter(x=>karMask[x.j*N+x.i]===2).length;
 return`<div class="row"><div class="n">Karczowanie<small>${ks.length?ks.map(p=>p.name).join(', '):'nikt'} · pniaków we wsi: ${n}${near?`, przy budowach: ${near}`:''}. Wykopują pniaki przy chatach i budowach, korzenie idą na opał. Gdy nie ma pniaków, pracują jak wolne ręce.</small></div><button class="mini" data-al="kar" data-d="-1" aria-label="Mniej karczowników">−</button><span class="cnt">${S.alloc.kar||0}</span><button class="mini" data-al="kar" data-d="1" aria-label="Więcej karczowników">+</button></div>`}
{const _br=budRowHTML;budRowHTML=function(){return _br()+karRowHTML()}}
