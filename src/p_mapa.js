
// ================= 1.1 Mapa: zaznaczanie zasobów i budowniczowie =================
// [budynek, co robi człowiek, do czego zaznaczone, ikona, surowiec, ile z jednego kursu]
const MKT={tree:['drwal','ścina zaznaczone drzewo','do wycinki','axe','kłody',1.5],rock:['kamien','łupie zaznaczony głaz','do wydobycia','pick','kamień',1],
 clay:['glinianka','kopie zaznaczoną glinę','do wydobycia','pick','glina',1.5],ruda:['ruda','kopie zaznaczoną rudę','do wydobycia','pick','ruda',1.5],
 bush:['zbieracz','zbiera zaznaczone jagody','do zbioru','bask','jagody',3],grzyb:['zbieracz','zbiera zaznaczone grzyby','do zbioru','bask','grzyby',3.5],
 zboze:['zbieracz','zbiera zaznaczone zboże','do zbioru','bask','ziarno',2.5],len:['zbieracz','rwie zaznaczony len','do zbioru','bask','włókna',2.5],
 ziola:['zbieracz','zbiera zaznaczone zioła','do zbioru','bask','zioła',2],ul:['zbieracz','podbiera miód z barci','do zbioru','bask','miód',3],
 fish:['pomost','łowi w zaznaczonym łowisku','do połowu','fish','ryby',4]};
const MK_VERB={'do wycinki':'Zetnij','do wydobycia':'Wydobądź','do zbioru':'Zbierz','do połowu':'Łów'};
const TREE_N={oak:'Dąb',birch:'Brzoza',pine:'Sosna',spruce:'Świerk'};
const NODE_N={rock:'Głaz',clay:'Odsłonięcie gliny',ruda:'Ruda darniowa',bush:'Krzak jagód',grzyb:'Grzyby',zboze:'Dzikie zboże',len:'Dziki len',ziola:'Zioła',ul:'Dzika barć',fish:'Łowisko'};
const nodeName=n=>n.type==='tree'?(TREE_N[n.sp]||'Drzewo'):NODE_N[n.type]||'Zasób';
let selN=null;
const mkOn=n=>!!(S&&S.mark&&S.mark[n.id]);
function mkWhy(n){if(n.type==='ziola'&&!tech('u_rozp'))return'Nikt jeszcze nie odróżnia ziół leczniczych od chwastów (Wiedza: rozpoznawanie roślin).';
 if(n.type==='ul'&&!tech('u_bart'))return'Bez wiedzy o bartnictwie pszczoły nikogo do barci nie dopuszczą.';
 const k=MKT[n.type]&&MKT[n.type][0];if(k&&n.type!=='fish'&&!bAvail(k))return'Tego jeszcze nie umiemy. Zajrzyj do zakładki Wiedza.';return''}
function mkStand(n){return n.type==='fish'?n.stand:[n.i,n.j]}
function mkUsable(n){return n&&!n.gone&&n.amt>=1-1e-6}
function mkSet(n,on){S.mark=S.mark||{};if(on){if(!MKT[n.type]||!mkUsable(n))return false;S.mark[n.id]=1}else delete S.mark[n.id];mkDirty=true;return true}
function mkArea(n,on,r){r=r||4.5;let c=0;for(const q of nodeBy[n.type]){if(Math.hypot(q.x-n.x,q.z-n.z)>r)continue;const st=mkStand(q);if(!revAt(st[0],st[1]))continue;
  if(on){if(!mkOn(q)&&mkUsable(q)){mkSet(q,true);c++}}else if(mkOn(q)){mkSet(q,false);c++}}return c}
function mkCount(){const c={};let tot=0;for(const id in (S.mark||{})){const n=nodes[id];if(!n)continue;const v=MKT[n.type][2];c[v]=(c[v]||0)+1;tot++}c.tot=tot;return c}
function mkCountText(c){return['do wycinki','do wydobycia','do zbioru','do połowu'].filter(v=>c[v]).map(v=>`${v} ${c[v]}`).join(' · ')}
function mkClean(){if(!S||!S.mark)return;for(const id in S.mark){const n=nodes[id];if(!n||!mkUsable(n)){delete S.mark[id];mkDirty=true}}}
function mkWorkers(n){return S.people.filter(p=>p.tgt===n&&(p.state==='work'||p.state==='move'))}

// ---------- kto bierze zaznaczone: wolne ręce, budowniczowie bez budowy, ludzie z chaty w zasięgu ----------
function markPick(p){let best=null,bd=1e9;
 for(const id in (S.mark||{})){const n=nodes[id];if(!mkUsable(n)){delete S.mark[id];mkDirty=true;continue}
  const max=n.type==='fish'?2:1;if(n.claim>=max||n.bad>S.t||seasonYield(n.type)<=0||mkWhy(n))continue;
  const d=Math.abs(n.x-p.x)+Math.abs(n.z-p.z);if(d<bd){bd=d;best=n}}
 return best}
function markJob(p){for(let t=0;t<3;t++){const n=markPick(p);if(!n)return false;const s=mkStand(n);const st=nearestWalk(s[0],s[1]);if(!st){n.bad=S.t+40;continue}
  if(go(p,st,'mark',n)){n.claim++;p.act=MKT[n.type][1];return true}}return false}
function budSites(){return S.bld.filter(b=>((!bDone(b)&&!(b.unr>S.day))||b.proj)&&(b.workers||0)<4).length}
function asRob(p){p.job='rob';let r=false;try{r=planJob0(p)}finally{if(p.job==='rob')p.job='bud'}return r}
let planJob0=null;
{const _pj=planJob;planJob0=_pj;planJob=function(p){
  if(!S||p.fireB||!isAdult(p)||!isWorker(p)||(p.hp<.5&&law('odpoczynek')))return _pj(p);
  if(p.job==='bud'){if(p.haulB&&typeof haulEnd==='function')haulEnd(p);
   if(budSites()||haulSite(6)){if(asRob(p))return true}
   if(markJob(p))return true;return asRob(p)}
  if((p.job==='rob'||!p.job)&&S.mark&&markJob(p))return true;
  return _pj(p)}}
{const _oa=onArrive;onArrive=function(p){if(p.after!=='mark')return _oa(p);p.after=null;p.wt=0;p.state='work';p.workKind='mark'}}
function mkYield(p,n){const gm=tech('u_rozp')?1.15:1,sy=seasonYield(n.type);
 switch(n.type){case'bush':return[{res:'jagody',q:3*sy*gm}];case'grzyb':return[{res:'grzyby',q:3.5*sy*gm}];
  case'fish':return[{res:'ryby',q:4*sy*(tech('h_sieci')?1.25:1)*(tech('n_gwiazd')?1.2:1)*(hasB('pomost')?1:.75)}];
  case'ziola':return[{res:'ziola',q:2*gm}];
  case'ul':if(Math.random()<(p.trait==='Ostrożny'?.03:.08)){p.hp=Math.max(.3,p.hp-.08);toastOnce('zadlo'+Math.floor(S.day),p.name+' pogryziony przez pszczoły')}if(!S.seen.miod){S.seen.miod=1;log(p.name+' przynosi pierwszy plaster dzikiego miodu.')}return[{res:'miod',q:3}];
  case'zboze':{const q=2.5*sy;S.zbozeTot=(S.zbozeTot||0)+q;if(S.know.pole!=='tak'&&S.zbozeTot>=25){S.know.pole='tak';log(p.name+' zauważa, że ziarno rozsypane przy obozie wykiełkowało. Można założyć pole.');toast('Odkrycie: dzikie zboże da się siać')}return[{res:'ziarno',q}]}
  case'len':return[{res:'wlokna',q:2.5*gm*(tech('u_len')?1.5:1)}];case'ruda':return[{res:'ruda',q:1.5}];
  case'tree':return[{res:'drewno',q:1.5}];case'rock':return[{res:'kamien',q:1}];default:return[{res:'glina',q:1.5}]}}
{const _sp=stepPerson;stepPerson=function(p,dt){
  if(p.state==='work'&&p.workKind==='mark'&&isWork()&&!p.fireB){const n=p.tgt;
   if(!n||!mkUsable(n)||!mkOn(n)){release(p);p.state='idle';p.wait=.2;return}
   const kd=MKT[n.type][0],c=BD[kd].c;p.wt+=dt*eff(p)*craftEff(p,c)*(p.job==='wb'?1:.8);gainXp(p,c,dt);
   const T={tree:7,rock:9,clay:7,ruda:9,fish:8,ul:9}[n.type]||5;
   if(p.wt>=T){p.wt=0;n.amt=Math.max(0,n.amt-1);S.nodeAmt[n.id]=n.amt;nodeVis(n);release(p);const items=mkYield(p,n);
    if(!mkUsable(n)){delete S.mark[n.id];mkDirty=true;if(n.type==='tree'&&!S.seen.mkTree){S.seen.mkTree=1;log(p.name+' ścina pierwsze zaznaczone drzewo. Zostaje pniak, który leśnik może kiedyś obsadzić.')}}
    finishTrip(p,items)}
   return}
  return _sp(p,dt)}}
// ludzie z chaty roboczej biorą najpierw zaznaczone w zasięgu
{const _pn=pickNodeB;pickNodeB=function(p,b){const d=BD[b.kind];if(S&&S.mark&&d.nodes){let best=null,bd=1e9;
  for(const id in S.mark){const n=nodes[id];if(!n||!d.nodes.includes(n.type)||!mkUsable(n))continue;const max=n.type==='fish'?2:1;
   if(n.claim>=max||n.bad>S.t||seasonYield(n.type)<=0||mkWhy(n)||!inRange(n,b))continue;const dd=Math.abs(n.x-p.x)+Math.abs(n.z-p.z);if(dd<bd){bd=dd;best=n}}
  if(best)return best}return _pn(p,b)}}

// ---------- budowniczowie w przydziale ----------
{const _as=assign;assign=function(){_as();if(!S)return;S.alloc=S.alloc||{};const want=S.alloc.bud||0;const pool=adultsPool();
  const cur=pool.filter(p=>p.job==='bud').sort((x,y)=>(y.sk.ciesla||0)-(x.sk.ciesla||0));
  while(cur.length>want)cur.pop().job='rob';
  let have=cur.length;if(have<want){const f=pool.filter(p=>p.job==='rob'||!p.job).sort((x,y)=>((y.sk.ciesla||0)-(x.sk.ciesla||0))||(x.age-y.age));while(have<want&&f.length){f.shift().job='bud';have++}}}}
{const _jl=jobLabel;jobLabel=function(p){if(p.job==='bud'&&!isChild(p))return p.sex==='k'?'budowniczka':'budowniczy';return _jl(p)}}
function budRowHTML(){const bs=S.people.filter(p=>p.job==='bud');const sites=S.bld.filter(b=>!bDone(b)).length,proj=S.bld.filter(b=>bDone(b)&&b.proj).length;
 const what=sites||proj?[sites?`placów budowy: ${sites}`:'',proj?`rozbudów i remontów: ${proj}`:''].filter(Boolean).join(', '):'nie ma teraz budów, więc pomagają przy zaznaczonych i przy wraku';
 return`<div class="row"><div class="n">Budowniczowie<small>${bs.length?bs.map(p=>p.name).join(', '):'nikt'} · ${what}. Budują i donoszą materiał, zanim zajmą się czymkolwiek innym.</small></div><button class="mini" data-al="bud" data-d="-1" aria-label="Mniej budowniczych">−</button><span class="cnt">${S.alloc.bud||0}</span><button class="mini" data-al="bud" data-d="1" aria-label="Więcej budowniczych">+</button></div>`}
function mkCardHTML(){const c=mkCount();return`<div class="card"><h4>Zaznaczone na mapie</h4><p>${c.tot?mkCountText(c):'Nic nie jest zaznaczone.'}</p><p class="mut">Dotknij drzewa, głazu, krzaka, gliny albo łowiska na mapie, żeby zaznaczyć je do wycinki, wydobycia albo zbioru. Zaznaczone biorą najpierw wolne ręce, potem budowniczowie bez budowy. Ludzie z chaty roboczej biorą najpierw zaznaczone w jej zasięgu.</p>${c.tot?`<div style="display:flex;gap:6px;flex-wrap:wrap"><button data-mkc="show">Pokaż najbliższe</button><button data-mkc="clear">Odznacz wszystko</button></div>`:''}</div>`}

// ---------- dotyk: wybór zasobu na mapie ----------
const mkV=new THREE.Vector3();
function nodeTopH(n){if(n.type==='tree')return 2.9*n.sc*(.55+.45*n.amt/n.max);if(n.type==='rock')return .55*(n.sc||1)+.2;if(n.type==='ruda'||n.type==='clay')return .3;if(n.type==='fish')return .15;if(n.type==='ul')return 1.6;return .45}
function nodeAtScreen(x,y){const r=cv.getBoundingClientRect();let best=null,bd=32;
 for(const n of nodes){if(!mkUsable(n)||!MKT[n.type])continue;const st=mkStand(n);if(!revAt(st[0],st[1]))continue;const gy=n.type==='fish'?Math.max(Hy(n.x,n.z),-.1):Hy(n.x,n.z);const h=nodeTopH(n);
  for(const f of n.type==='tree'?[.25,.6]:[.5]){mkV.set(n.x,gy+h*f,n.z).project(cam);if(mkV.z>1||mkV.z<-1)continue;const sx=(mkV.x+1)/2*r.width+r.left,sy=(1-mkV.y)/2*r.height+r.top;const d=Math.hypot(sx-x,sy-y);if(d<bd){bd=d;best=n}}}
 return best}
const mkRing=new THREE.Mesh(new THREE.RingGeometry(.52,.68,48),new THREE.MeshBasicMaterial({color:0xe2c48c,transparent:true,opacity:.85,depthTest:false,depthWrite:false,toneMapped:false}));mkRing.rotation.x=-Math.PI/2;mkRing.renderOrder=9;mkRing.visible=false;scene.add(mkRing);
function selectN(n){select(null);selN=n.id;mkRing.visible=true;const s=n.type==='tree'?1.15:n.type==='fish'?1.4:.9;mkRing.scale.set(s,s,s);mkRing.position.set(n.x,Math.max(Hy(n.x,n.z),-.1)+.08,n.z);renderSel()}
{const _ot=onTap;onTap=function(x,y){if(!S||placing||(typeof ladTool!=='undefined'&&ladTool))return _ot(x,y);
  const hs=pick(x,y,[pGroup])[0];if(hs&&hs.object.userData.pid!==undefined)return _ot(x,y);
  const hb=pick(x,y,[bGroup])[0];if(hb&&hb.object.userData.bid!==undefined)return _ot(x,y);
  const n=nodeAtScreen(x,y);if(n){selectN(n);if(!S.seen.mkHelp){S.seen.mkHelp=1;toast('Zasoby na mapie można zaznaczać do pracy')}return}
  _ot(x,y)}}
{const _sel=select;select=function(id){selN=null;mkRing.visible=false;return _sel(id)}}
{const _rs=renderSel;renderSel=function(){if(selN===null)return _rs();const el=$('sel');const n=nodes[selN];
  if(!n||!mkUsable(n)){selN=null;mkRing.visible=false;el.style.display='none';el._h=null;return}
  const M=MKT[n.type],on=mkOn(n),why=mkWhy(n),ws=mkWorkers(n);el.style.display='block';
  const left=n.amt*M[5];const sy=seasonYield(n.type);
  let near=0,nearOn=0;for(const q of nodeBy[n.type]){if(Math.hypot(q.x-n.x,q.z-n.z)>4.5)continue;const st=mkStand(q);if(!revAt(st[0],st[1])||!mkUsable(q))continue;if(mkOn(q))nearOn++;else near++}
  let h=`<h4>${nodeName(n)}</h4><p>Zostało: ${M[4]} ${Math.max(1,Math.round(left))}</p>`;
  if(sy<=0)h+=`<p class="mut">O tej porze roku nic tu nie urośnie. Zaznaczone poczeka do wiosny.</p>`;
  if(on)h+=`<p><b style="color:var(--gold)">Zaznaczone ${M[2]}.</b> ${ws.length?'Pracuje: '+ws.map(p=>p.name).join(', ')+'.':'Czeka na wolne ręce.'}</p>`;
  if(why)h+=`<p class="no">${why}</p>`;
  if(!why){h+=`<div style="display:flex;gap:6px;flex-wrap:wrap;margin:4px 0">${on?`<button data-mk="0">Odznacz</button>`:`<button class="pri" data-mk="1">Zaznacz ${M[2]}</button>`}${near?`<button data-mka="1">Zaznacz okolicę (${near})</button>`:''}${nearOn>1||(nearOn&&!on)?`<button data-mka="0">Odznacz okolicę</button>`:''}</div>`}
  const kd=M[0];const hasHut=S.bld.some(b=>b.kind===kd&&bDone(b)&&inRange(n,b));
  h+=`<p class="mut">${n.type==='tree'?'Las nie odrasta sam: pniaki obsadza leśnik. ':''}${hasHut?`W zasięgu jest ${BD[kd].n.toLowerCase()}: jej ludzie wezmą to najpierw.`:'Zaznaczone biorą wolne ręce i budowniczowie bez budowy.'}</p>`;
  if(el._h!==h){el._h=h;el.innerHTML=h}}}
$('sel').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S||selN===null)return;const n=nodes[selN];if(!n)return;
 if(b.dataset.mk!==undefined){mkSet(n,b.dataset.mk==='1');if(b.dataset.mk==='1')toastOnce('mkFirst','Zaznaczone. Zajmą się tym wolne ręce.');}
 else if(b.dataset.mka!==undefined){const c=mkArea(n,b.dataset.mka==='1');toast(b.dataset.mka==='1'?`Zaznaczono jeszcze ${c}`:`Odznaczono ${c}`)}
 else return;$('sel')._h=null;renderSel();mkSync();if(tab==='praca')renderPanel()});
$('body').addEventListener('click',e=>{const b=e.target.closest('[data-mkc]');if(!b||!S)return;
 if(b.dataset.mkc==='clear'){S.mark={};mkDirty=true;mkSync();toast('Odznaczono wszystko');renderPanel();return}
 if(b.dataset.mkc==='show'){const c={x:tcx(camp.i),z:tcx(camp.j)};let best=null,bd=1e9;for(const id in S.mark){const n=nodes[id];if(!n)continue;const d=Math.hypot(n.x-c.x,n.z-c.z);if(d<bd){bd=d;best=n}}
  if(best){closeSheet();lookAt(best.x,best.z,Math.max(zoomT,1.3));selectN(best)}}});

// ---------- znaczniki nad zaznaczonymi ----------
const mkGroup=new THREE.Group();mkGroup.renderOrder=8;scene.add(mkGroup);
const mkMat={};
function mkIcon(kind){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
 g.beginPath();g.arc(32,32,27,0,6.283);g.fillStyle='rgba(22,20,16,.88)';g.fill();g.lineWidth=3.5;g.strokeStyle='#e2c48c';g.stroke();
 g.strokeStyle='#f1e6cc';g.fillStyle='#f1e6cc';g.lineWidth=4;g.lineCap='round';g.lineJoin='round';
 if(kind==='axe'){g.beginPath();g.moveTo(22,46);g.lineTo(40,20);g.stroke();g.beginPath();g.moveTo(36,16);g.quadraticCurveTo(50,16,48,30);g.lineTo(40,26);g.closePath();g.fill()}
 else if(kind==='pick'){g.beginPath();g.moveTo(24,46);g.lineTo(38,22);g.stroke();g.beginPath();g.moveTo(20,22);g.quadraticCurveTo(36,10,50,26);g.stroke()}
 else if(kind==='bask'){g.beginPath();g.moveTo(18,30);g.lineTo(46,30);g.lineTo(42,46);g.lineTo(22,46);g.closePath();g.fill();g.beginPath();g.arc(32,30,11,Math.PI,0);g.stroke()}
 else{g.beginPath();g.ellipse(30,32,13,7,0,0,6.283);g.fill();g.beginPath();g.moveTo(41,32);g.lineTo(50,24);g.lineTo(50,40);g.closePath();g.fill();g.fillStyle='#16140f';g.beginPath();g.arc(23,30,1.8,0,6.283);g.fill()}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,toneMapped:false})}
const mkSpr={};let mkDirty=true,mkT=0;
function mkSync(){if(!S)return;mkClean();const want=S.mark||{};
 for(const id in mkSpr){if(!want[id]){mkGroup.remove(mkSpr[id]);delete mkSpr[id]}}
 for(const id in want){const n=nodes[id];if(!n)continue;let s=mkSpr[id];const ic=MKT[n.type][3];
  if(!s){s=new THREE.Sprite(mkMat[ic]||(mkMat[ic]=mkIcon(ic)));s.renderOrder=8;s.userData.n=n;mkSpr[id]=s;mkGroup.add(s)}
  s.userData.y=Math.max(Hy(n.x,n.z),-.1)+nodeTopH(n)+(n.type==='tree'?.35:.55)}
 mkDirty=false}
function mkFrame(rdt){if(!S)return;mkT+=rdt;if(mkDirty||mkT>.7){mkT=0;mkSync()}
 const sc=.62*clamp(1.3/Math.max(.1,zoom),1,3.5);const t=performance.now()/1000;if(mkRing.visible)mkRing.material.opacity=.6+.25*Math.sin(t*3);
 for(const id in mkSpr){const s=mkSpr[id],n=s.userData.n;const w=mkWorkers(n).length;s.position.set(n.x,s.userData.y+Math.sin(t*2.2+n.id)*.07,n.z);const k=sc*(w?1.12:1);s.scale.set(k,k,k);s.material.opacity=1}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{mkFrame(rdt)}catch(e){}}}

// ---------- dzień, zapis, na co czekamy ----------
{const _ad=actDaily;actDaily=function(){_ad();if(!S)return;mkClean();mkDirty=true;assign()}}
{const _cz=czekamy;czekamy=function(){const L=_cz();if(!S||!S.mark)return L;const c=mkCount();if(!c.tot)return L;
  const hands=S.people.filter(p=>(p.job==='rob'||p.job==='bud')&&isWorker(p)).length;
  L.push(hands?[`Zaznaczone na mapie: ${mkCountText(c)}`,4]:[`Zaznaczone na mapie czekają (${c.tot}), a wszyscy mają inną pracę`,1]);return L.sort((a,b)=>a[1]-b[1])}}
function mkInit(){if(!S)return;S.mark=S.mark||{};S.alloc=S.alloc||{};if(S.alloc.bud===undefined)S.alloc.bud=3;for(const s of Object.values(mkSpr))mkGroup.remove(s);for(const k in mkSpr)delete mkSpr[k];selN=null;assign();mkDirty=true}
{const _b=boot;boot=function(fresh){_b(fresh);try{mkInit()}catch(e){console.warn(e)}}}
window.__mk={mkSet,mkArea,mkCount,nodeAtScreen,selectN,markPick,markJob,budRowHTML,mkCardHTML,mkSync,nodeName,get selN(){return selN},scr(n,f){const r=cv.getBoundingClientRect();mkV.set(n.x,Hy(n.x,n.z)+nodeTopH(n)*(f||.6),n.z).project(cam);return[(mkV.x+1)/2*r.width+r.left,(1-mkV.y)/2*r.height+r.top]},get spr(){return Object.keys(mkSpr).length},nodeTopH};
// nowy plac budowy: budowniczowie odkładają zaznaczoną robotę
{const _tp=tryPlace;tryPlace=function(){const n0=S?S.bld.length:0;_tp();if(S&&S.bld.length>n0)S.people.forEach(p=>{if(p.job==='bud'&&!p.carry&&(p.after==='mark'||p.workKind==='mark')&&(p.state==='work'||p.state==='move')){release(p);p.path=null;p.after=null;p.workKind=null;p.state='idle';p.wait=.1}})}}
