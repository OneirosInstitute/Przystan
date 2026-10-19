
/* ================= RC11 Drogi: ścieżki wydeptują się same, gracz utwardza wybraną trasę ================= */
// 1. Każdy krok człowieka wydeptuje kafel (tread). Kafel wydeptany na ≥ TREAD_PATH to wydeptana ścieżka: o 10% szybciej.
// 2. W Budowie → Drogi wybierasz nawierzchnię i dotykasz celu (budynku albo wydeptanej ścieżki). Gra prowadzi trasę
//    od istniejącej sieci dróg albo od obozu do celu, trzymając się wydeptanych śladów, i pokazuje długość i koszt.
// 3. Po zatwierdzeniu trasę układają budowniczowie, kafel po kaflu; kamień schodzi ze składu przy każdym kaflu.
const DROGI={
 sciezka:{n:'Ścieżka utwardzona',kr:'ścieżka',lv:1,sp:1.2,cost:.25,work:5,col:0xb89a6a,d:'Ubita ziemia z drobnym żwirem. Nie rozmaka po deszczu, chodzi się po niej o 20% szybciej.'},
 bruk:{n:'Droga kamienna',kr:'droga kamienna',lv:2,sp:1.3,cost:1,work:10,col:0x9a968c,d:'Płaskie kamienie wbite w ziemię. Sucha w każdą pogodę, chodzi się o 30% szybciej, wozy jadą pewniej.'},
 kostka:{n:'Bruk',kr:'bruk',lv:3,sp:1.4,cost:2,work:18,col:0x8a8680,need:()=>typeof scSt==='function'&&scSt()>=3,why:'Bruk układają kamieniarze, gdy osada ma Dom osadników (serce osady, trzeci etap).',d:'Kostka kamienna ułożona w łuki. Najszybsza nawierzchnia: o 40% szybciej. Tak wyglądają drogi w mieście.'}};
const DR_K=Object.keys(DROGI);
const TREAD_PATH=.55;
const drLv=k=>{const x=S&&S.lad&&S.lad[k];return x&&DROGI[x.t]?DROGI[x.t].lv:0};
const drInit=()=>{S.roads=S.roads||[];S.roadId=S.roadId||0;return S.roads};
// prędkość: nawierzchnia albo wydeptany ślad
ladSpeed=function(p){if(!S)return 1;const t=tileOf(p.x,p.z),k=t[1]*N+t[0];const x=S.lad&&S.lad[k];if(x&&DROGI[x.t])return DROGI[x.t].sp;return tread[k]>=TREAD_PATH?1.1:1};
function drTileOK(k){const i=k%N,j=(k/N)|0;if(i<1||j<1||i>=N-1||j>=N-1)return false;if(!land[k]||!walk[k]||occ[k]>=0)return false;const x=S.lad&&S.lad[k];if(x&&!DROGI[x.t])return false;return true}
const drCampD=k=>Math.hypot(k%N-camp.i,((k/N)|0)-camp.j);
// trasa: Dijkstra od celu do sieci dróg (co najmniej tej nawierzchni) albo do obozu; wydeptane i drogi są tańsze
function drRoute(ti,tj,lv){const NN=N*N,g=new Float32Array(NN).fill(1e9),from=new Int32Array(NN).fill(-1),cl=new Uint8Array(NN);const hk=[],hf=[];
 const push=(k,f)=>{hk.push(k);hf.push(f);let c=hk.length-1;while(c>0){const p=(c-1)>>1;if(hf[p]<=hf[c])break;[hk[p],hk[c]]=[hk[c],hk[p]];[hf[p],hf[c]]=[hf[c],hf[p]];c=p}};
 const pop=()=>{const k=hk[0],lk=hk.pop(),lf=hf.pop();if(hk.length){hk[0]=lk;hf[0]=lf;let c=0;for(;;){const l=c*2+1,r=l+1;let m=c;if(l<hk.length&&hf[l]<hf[m])m=l;if(r<hk.length&&hf[r]<hf[m])m=r;if(m===c)break;[hk[m],hk[c]]=[hk[c],hk[m]];[hf[m],hf[c]]=[hf[c],hf[m]];c=m}}return k};
 const s=tj*N+ti;if(!walk[s])return null;g[s]=0;push(s,0);let goal=-1,n=0;
 while(hk.length&&n<60000){const k=pop();if(cl[k])continue;cl[k]=1;n++;
  if(k!==s&&(drLv(k)>=lv||drCampD(k)<=3.2)){goal=k;break}
  const i=k%N,j=(k/N)|0,h0=tileH(i,j);
  for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const x=i+di,y=j+dj;if(x<1||y<1||x>=N-1||y>=N-1)continue;const q=y*N+x;if(cl[q]||!walk[q])continue;
   if(di&&dj&&(!walk[j*N+x]||!walk[y*N+i]))continue;
   const road=drLv(q);let c=(di&&dj?1.414:1)*(1+Math.min(3,Math.abs(tileH(x,y)-h0)*2.5));
   c*=road>=lv?.15:road?.5:tread[q]>=TREAD_PATH?.45:tread[q]>.25?.72:1;if(!drTileOK(q)&&drCampD(q)>3.2)c*=6;
   const ng=g[k]+c;if(ng<g[q]){g[q]=ng;from[q]=k;push(q,ng)}}}
 if(goal<0)return null;const out=[];for(let k=goal;k>=0;k=from[k]){out.push(k);if(k===s)break}return out}
function drPlan(t,ti,tj){const d=DROGI[t],route=drRoute(ti,tj,d.lv);if(!route)return null;
 const tiles=route.filter(k=>drTileOK(k)&&drLv(k)<d.lv&&drCampD(k)>1.6);
 const trod=tiles.filter(k=>tread[k]>=TREAD_PATH||drLv(k)>0).length;
 return{t,route,tiles,trod,stone:Math.ceil(tiles.length*d.cost),work:tiles.length*d.work}}
// ---------- budowa przez budowniczych ----------
function drNext(p){for(const r of drInit()){if(r.wait&&S.day<r.wait)continue;const d=DROGI[r.t];if(S.res.kamien<d.cost){r.why='czeka na kamień w składzie';continue}r.why='';
  for(const k of r.tiles){if(drLv(k)>=d.lv||(r.skip&&r.skip.includes(k)))continue;if(!drTileOK(k)){(r.skip=r.skip||[]).push(k);continue}if(S.people.some(q=>q!==p&&q.roadK===k))continue;return[r,k]}}return null}
function drJob(p){const nx=drNext(p);if(!nx)return false;const[r,k]=nx;if(go(p,[k%N,(k/N)|0],'road',null)){p.roadK=k;p.roadId=r.id;p.act='układa drogę: '+DROGI[r.t].kr;return true}(r.skip=r.skip||[]).push(k);return false}
function drDone(r){const d=DROGI[r.t];return r.tiles.every(k=>drLv(k)>=d.lv||(r.skip&&r.skip.includes(k)))}
function drLay(r,k,p){const d=DROGI[r.t];S.res.kamien=Math.max(0,S.res.kamien-d.cost);ladInit();
 nodes.forEach(n=>{if(n.type!=='fish'&&n.i===k%N&&n.j===((k/N)|0)&&n.amt>0){if(n.type==='tree')S.res.drewno+=2;n.gone=1;n.amt=0;S.nodeAmt[n.id]=0;nodeVis(n)}});
 S.lad[k]={t:r.t,d:S.day};decoHidden.add(k);ladDeco(k);ladDirty=1;tread[k]=Math.max(tread[k],.9+.03*d.lv);treadDirty=true;r.n=(r.n||0)+1;drPlanVis();
 if(drDone(r)){S.roads=S.roads.filter(x=>x!==r);log(`Gotowe: ${d.kr} ${r.to?'do celu: '+r.to:''} (${r.n} pól). ${p?p.name+' kładzie ostatni kamień.':''}`);toast(`${d.n} gotowa`);try{sfx('bell')}catch(e){}}}
{const _pj=planJob;planJob=function(p){if(p.roadK&&!(p.state==='work'&&p.workKind==='road')&&p.after!=='road')p.roadK=null;
  if(S&&S.roads&&S.roads.length&&isWork()&&!p.fireB&&isAdult(p)&&!restNow(p)&&!pendingDelivery(p)){
   if(p.job==='bud'&&!budSites()&&!haulSite(6)&&drJob(p))return true;
   const r=_pj(p);if(r)return r;if((p.job==='rob'||!p.job)&&isWorker(p))return drJob(p);return r}
  return _pj(p)}}
{const _oa=onArrive;onArrive=function(p){if(p.after!=='road')return _oa(p);p.after=null;p.state='work';p.workKind='road';p.wt=0}}
{const _sp=stepPerson;stepPerson=function(p,dt){if(p.state==='work'&&p.workKind==='road'){
  const r=(S.roads||[]).find(x=>x.id===p.roadId);if(!r||!isWork()||p.fireB||drLv(p.roadK)>=DROGI[r.t].lv){p.state='idle';p.workKind=null;p.roadK=null;p.wait=.2;return _sp(p,dt)}
  if(S.res.kamien<DROGI[r.t].cost){r.why='czeka na kamień w składzie';r.wait=S.day+.05;p.state='idle';p.workKind=null;p.roadK=null;p.wait=.5;return}
  p.wt+=dt*eff(p)*craftEff(p,'kamieniarz');gainXp(p,'kamieniarz',dt*.6);p.act='układa drogę: '+DROGI[r.t].kr;
  if(p.wt>=DROGI[r.t].work){p.wt=0;const k=p.roadK;p.state='idle';p.workKind=null;p.roadK=null;p.wait=.1;drLay(r,k,p)}return}
 return _sp(p,dt)}}
// ---------- wygląd: bruk, paliki planowanej trasy, podgląd ----------
const DRG={cob:new THREE.BoxGeometry(.27,.06,.27),peg:new THREE.CylinderGeometry(.03,.04,.42,4),tile:new THREE.PlaneGeometry(.92,.92)};DRG.tile.rotateX(-Math.PI/2);
const DRM={cob:M(0x8f8b84),peg:M(0xd9c8a0),prev:new THREE.MeshBasicMaterial({color:0xf0cf86,transparent:true,opacity:.6,depthWrite:false,depthTest:false,toneMapped:false})};
{const _lb=ladBuild;ladBuild=function(){_lb();if(!S||!S.lad)return;const ks=Object.entries(S.lad).filter(([k,v])=>v.t==='kostka').map(([k])=>+k);if(!ks.length)return;
  const m=new THREE.InstancedMesh(DRG.cob,DRM.cob,ks.length*9),o=new THREE.Object3D();let q=0;ks.forEach(k=>{const x0=tcx(k%N),z0=tcx((k/N)|0),r=rng(k);for(let a=0;a<3;a++)for(let b=0;b<3;b++){const x=x0+(a-1)*.3+(r()-.5)*.03,z=z0+(b-1)*.3+(r()-.5)*.03;o.position.set(x,Hy(x,z)+.015,z);o.rotation.set(0,(r()-.5)*.25,0);o.scale.set(1,1,1);o.updateMatrix();m.setMatrixAt(q++,o.matrix)}});
  m.receiveShadow=true;ladG.add(m)}}
const drPlanG=new THREE.Group();scene.add(drPlanG);let drPrev=null;
function drInst(geo,mat,ks,y){if(!ks.length)return null;const m=new THREE.InstancedMesh(geo,mat,ks.length),o=new THREE.Object3D();ks.forEach((k,q)=>{const x=tcx(k%N),z=tcx((k/N)|0);o.position.set(x,Hy(x,z)+y,z);o.updateMatrix();m.setMatrixAt(q,o.matrix)});m.frustumCulled=false;return m}
function drPlanVis(){drPlanG.children.slice().forEach(o=>{drPlanG.remove(o);o.dispose&&o.dispose()});if(!S||!S.roads)return;
 const ks=[];S.roads.forEach(r=>{const d=DROGI[r.t];r.tiles.forEach((k,i)=>{if(i%2===0&&drLv(k)<d.lv&&!(r.skip&&r.skip.includes(k)))ks.push(k)})});const m=drInst(DRG.peg,DRM.peg,ks.slice(0,800),.2);if(m)drPlanG.add(m)}
function drPrevShow(tiles){if(drPrev){scene.remove(drPrev);drPrev.dispose();drPrev=null}if(!tiles||!tiles.length)return;drPrev=drInst(DRG.tile,DRM.prev,tiles.slice(0,900),.12);drPrev.renderOrder=20;scene.add(drPrev)}
// ---------- narzędzie: wybór nawierzchni i celu ----------
let drTool=null,drCur=null;
const drBar=document.createElement('div');drBar.id='drbar';drBar.className='ui';drBar.hidden=true;document.body.appendChild(drBar);
function drStart(t){const d=DROGI[t];if(d.need&&!d.need()){toast(d.why);return}drTool=t;drCur=null;closeSheet();if(placing)cancelPlace();if(typeof ladTool!=='undefined'&&ladTool)ladEnd();select(null);drBar.hidden=false;drRender()}
function drEnd(){drTool=null;drCur=null;drPrevShow(null);drBar.hidden=true}
function drTarget(x,y){const hb=pick(x,y,[bGroup])[0];let b=null;if(hb){let o=hb.object;while(o&&o.userData.bid===undefined)o=o.parent;if(o)b=bById(o.userData.bid)}
 if(b){const e=entryOf(b.kind,b.i,b.j);if(e)return{i:e[0],j:e[1],to:BD[b.kind].n.toLowerCase()}}
 const h=pick(x,y,[terrain])[0];if(!h)return null;let i=Math.floor(h.point.x+N/2),j=Math.floor(h.point.z+N/2);const w=nearestWalk(i,j);if(!w)return null;[i,j]=w;
 const rg=typeof regionAt==='function'?regionAt(i,j):null;return{i,j,to:tread[j*N+i]>=TREAD_PATH?'wydeptana ścieżka'+(rg&&rg.known?' w krainie '+rg.name:''):(rg&&rg.known?'miejsce w krainie '+rg.name:'wskazane miejsce')}}
function drTap(x,y){const tg=drTarget(x,y);if(!tg){toast('Tam nie da się poprowadzić drogi');return}const P=drPlan(drTool,tg.i,tg.j);
 if(!P){toast('Nie ma przejścia z osady do tego miejsca');drCur=null;drPrevShow(null);drRender();return}
 if(!P.tiles.length){toast('Ta trasa ma już taką nawierzchnię');drCur=null;drPrevShow(null);drRender();return}
 drCur=Object.assign(P,{to:tg.to});drPrevShow(P.tiles);drRender()}
function drConfirm(){const P=drCur;if(!P)return;const r={id:++S.roadId,t:P.t,tiles:P.tiles,to:P.to,n:0,d0:S.day};drInit().push(r);
 const b=S.people.filter(p=>p.job==='bud').length;log(`Wytyczono: ${DROGI[P.t].kr} do celu: ${P.to}, ${P.tiles.length} pól.${b?' Budowniczowie wbijają paliki.':' Nikt nie jest budowniczym: drogę ułożą wolne ręce, kiedy znajdą czas.'}`);
 toast('Trasa wytyczona');drCur=null;drPrevShow(null);drPlanVis();drRender()}
function drDays(work){const b=Math.max(1,S.people.filter(p=>p.job==='bud').length);return work/b/(DAY*(T1-T0))}
function drRender(){const t=drTool,d=DROGI[t];let h=`<div class="lt">${DR_K.map(k=>{const x=DROGI[k],ok=!x.need||x.need();return`<button data-drt="${k}" class="${k===t?'on':''}${ok?'':' dim'}">${x.n}</button>`}).join('')}</div>`;
 if(drCur){const P=drCur,ok=S.res.kamien>=P.stone;h+=`<div class="li"><span><b>${d.n}</b> do: ${P.to}<br>${P.tiles.length} pól, z tego ${P.trod} już wydeptanych · kamień ${P.stone}${ok?'':` (w składzie ${Math.floor(S.res.kamien)})`} · ok. ${Math.max(.1,drDays(P.work)).toFixed(1)} dnia pracy</span>
  <span style="display:flex;gap:6px"><button data-drx="new">Inny cel</button><button class="pri" data-drx="ok">Wytycz</button></span></div>`}
 else h+=`<div class="li"><span><b>${d.n}</b> · kamień ${d.cost} za pole · o ${Math.round((d.sp-1)*100)}% szybciej<br>Dotknij budynku albo wydeptanej ścieżki, do której ma prowadzić droga.</span><span><button class="pri" data-drx="end">Gotowe</button></span></div>`;
 drBar.innerHTML=h}
drBar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.dataset.drt){drStart(b.dataset.drt);return}const a=b.dataset.drx;if(a==='end')drEnd();else if(a==='new'){drCur=null;drPrevShow(null);drRender()}else if(a==='ok')drConfirm()});
{const _ot=onTap;onTap=function(x,y){if(drTool&&S){drTap(x,y);return}_ot(x,y)}}
addEventListener('keydown',e=>{if(e.key==='Escape'&&drTool)drEnd()});
// ---------- karta „Drogi” w Budowie ----------
function drCounts(){const c={};Object.values(S.lad||{}).forEach(v=>{if(DROGI[v.t])c[v.t]=(c[v.t]||0)+1});let w=0;for(let k=0;k<N*N;k++)if(tread[k]>=TREAD_PATH&&!(S.lad&&S.lad[k]))w++;c.wyd=w;return c}
function roadsHTML(){const c=drCounts(),R=drInit(),bud=S.people.filter(p=>p.job==='bud').length;
 let h=`<div class="card"><h4>Drogi</h4><p>Ścieżki wydeptują się same: tam, gdzie ludzie chodzą codziennie, trawa znika, a chodzi się o 10% szybciej. Wydeptaną ścieżkę można utwardzić: wybierz nawierzchnię i dotknij budynku albo wydeptanego śladu. Trasa pójdzie od najbliższej drogi albo od obozu, po śladach ludzi.</p>
  <p class="mut">Wydeptane: ${c.wyd} pól · ścieżki utwardzone: ${c.sciezka||0} · drogi kamienne: ${c.bruk||0} · bruk: ${c.kostka||0}</p></div>`;
 if(R.length){h+=`<div class="card"><h4>Układane teraz</h4>`+R.map(r=>{const d=DROGI[r.t],tot=r.tiles.length,dn=r.tiles.filter(k=>drLv(k)>=d.lv).length;return`<div class="drp"><p><b>${d.n}</b> do: ${r.to||'celu'} · ${dn} z ${tot} pól</p><div class="pbar"><div style="width:${Math.round(dn/tot*100)}%"></div></div>
   <p class="mut">${r.why?r.why[0].toUpperCase()+r.why.slice(1)+'. ':''}${bud?'':'Nikt nie jest budowniczym: układają tylko wolne ręce. '}Kamień: ${d.cost} za pole.</p><div class="mqb"><button data-drshow="${r.id}">Pokaż</button><button data-drdel="${r.id}">Przerwij</button></div></div>`}).join('')+`</div>`}
 DR_K.forEach(k=>{const d=DROGI[k],ok=!d.need||d.need();h+=`<div class="card"${ok?'':' style="opacity:.65"'}><h4>${d.n}</h4><p>${d.d}</p><div class="cost">kamień ${d.cost} za pole<span class="sep">·</span>${d.work} s pracy za pole<span class="sep">·</span>${Math.round((d.sp-1)*100)}% szybciej</div>${ok?`<button class="pri" style="margin-top:7px" data-drt="${k}">Wytycz trasę</button>`:`<div class="cost">${d.why}</div>`}</div>`});
 return h}
document.addEventListener('click',e=>{const b=e.target.closest('[data-drt],[data-drshow],[data-drdel]');if(!b||!S||b.closest('#drbar'))return;e.stopPropagation();
 if(b.dataset.drt){drStart(b.dataset.drt);return}const id=+(b.dataset.drshow||b.dataset.drdel);const r=(S.roads||[]).find(x=>x.id===id);if(!r)return;
 if(b.dataset.drdel){S.roads=S.roads.filter(x=>x!==r);drPlanVis();log(`Przerwano układanie: ${DROGI[r.t].kr} do celu: ${r.to}.`);renderPanel();return}
 const k=r.tiles.find(q=>drLv(q)<DROGI[r.t].lv)??r.tiles[0];closeSheet();lookAt(tcx(k%N),tcx((k/N)|0),Math.max(zoomT,1.2))},true);
{const st=document.createElement('style');st.textContent=`#drbar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + var(--safe-bottom,0px));z-index:40;background:rgba(22,26,25,.95);border:1px solid #3b3a2e;border-radius:14px;padding:8px;width:min(560px,calc(100% - 24px));box-shadow:0 8px 30px #0007}
#drbar[hidden]{display:none}#drbar .lt{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}#drbar .lt button{flex:0 0 auto;padding:7px 10px;font-size:13px}#drbar .lt button.on{border-color:var(--gold);color:var(--hi);background:#2c2a20}#drbar .lt button.dim{opacity:.55}
#drbar .li{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;font-size:13px;color:var(--mut);line-height:1.35}#drbar .li b{color:var(--hi)}#drbar .li button{min-height:40px}
.drp{border-top:1px solid #ffffff10;padding-top:6px;margin-top:6px}.drp p{margin:3px 0}`;document.head.appendChild(st)}
{const _b=boot;boot=function(f){_b(f);try{drEnd();drInit();drPlanVis()}catch(e){console.warn(e)}}}
window.__dr={DROGI,drRoute,drPlan,drStart,drEnd,drTap,drConfirm,drNext,drJob,roadsHTML,drCounts,get cur(){return drCur},set cur(v){drCur=v}};
