
/* ================= 2.3: dowóz na budowy i wozy z warsztatu ================= */
// urobek idzie najpierw na pobliską budowę; daleka budowa dostaje materiał ze składu, a wozem niesie się cztery razy więcej
const WOZ_FAR=22,WOZ_NEAR=18,WOZ_T=90,WOZ_CAP=4,WOZ_COST={deski:8,drewno:6,gwozdzie:10};
TECH.push({id:'r_woz',d:'rzemioslo',r:3,c:0,n:'Koło i oś',xp:150,req:['r_zrab'],gate:()=>hasB('warsztat'),desc:'Koło z jednej deski, oś z twardego drewna, smarowana łojem.',eff:'Warsztat może zrobić wóz. Wozem dowozi się na dalekie budowy cztery razy więcej materiału.'});
TECH_BY.r_woz=TECH[TECH.length-1];TCRAFT.r_woz=['ciesla'];
function storeSpots(){const L=[[camp.i,camp.j+1]];S.bld.forEach(b=>{if(bDone(b)&&BD[b.kind].store==='all'){L.push(...workSiteTiles(b))}});return L}
function siteDist(s){let d=1e9;for(const c of storeSpots())d=Math.min(d,Math.hypot(c[0]-s.i,c[1]-s.j));return d}
function siteFar(s){return siteDist(s)>WOZ_FAR}
const wozN=()=>S.wozy||0,wozUsed=()=>S.people.filter(p=>p.woz).length,wozFree=()=>Math.max(0,wozN()-wozUsed());
// skąd brać materiał na budowę: ze składu najbliższego budowie
function haulFrom(p,s){let best=null,bd=1e9;for(const c of storeSpots()){const d=Math.hypot(c[0]-s.i,c[1]-s.j),[i,j]=tileOf(p.x,p.z);if(d<bd&&walk[c[1]*N+c[0]]&&astar(i,j,c[0],c[1])){bd=d;best=c}}
 if(tech('r_woz')&&!p.woz&&bd>WOZ_FAR&&wozFree()>0){p.woz=1;if(!S.seen.wozJ){S.seen.wozJ=1;log(p.name+' zaprzęga się do wozu i jedzie po materiał na daleką budowę.')}}
 return(best&&nearestWalk(best[0],best[1]))||storeTile(p,false)}
{const _he=haulEnd;haulEnd=function(p){_he(p);p.woz=0}}
{const _hd=haulDaily;haulDaily=function(){_hd();S.people.forEach(p=>{if(!p.haulB)p.woz=0})}}
// budowa, która czeka na ten urobek i jest blisko
function siteNeeding(p,items){const[pi,pj]=tileOf(p.x,p.z);let best=null,bd=1e9;
 for(const s of S.bld){if(bDone(s)||!s.mat||(s.unr>S.day))continue;const need=s.mat-(s.del||0)-(s.inTr||0);if(need<.3)continue;
  const c=BD[s.kind].cost||{};if(!items.some(x=>c[x.res]&&x.q>0))continue;const d=Math.hypot(s.i-pi,s.j-pj);if(d>WOZ_NEAR||d>=bd||siteFar(s))continue;bd=d;best=s}
 return best}
{const _ft=finishTrip;finishTrip=function(p,items){
  if(S&&items&&items.length&&!p.haulB&&!p.siteB){const s=siteNeeding(p,items);if(s){const e=buildingEntryFor(p,s),c=BD[s.kind].cost||{};
   const w=items.reduce((a,x)=>a+(c[x.res]?x.q*(MATW[x.res]===undefined?.5:MATW[x.res]):0),0),q=Math.min(w,s.mat-(s.del||0)-(s.inTr||0));
   if(e&&q>0){p.carry=items;s.inTr=(s.inTr||0)+q;p.siteB=s.id;p.siteQ=q;if(goNow(p,e,'siteDrop')){p.act='niesie prosto na budowę: '+items.map(x=>RN[x.res].toLowerCase()).join(', ');return}
    s.inTr=Math.max(0,s.inTr-q);p.siteB=null;p.siteQ=0}}}
  return _ft(p,items)}}
{const _oa=onArrive;onArrive=function(p){if(p.after!=='siteDrop')return _oa(p);p.after=null;p.wt=0;const s=bById(p.siteB);
  deposit(p);if(s){s.inTr=Math.max(0,(s.inTr||0)-(p.siteQ||0));if(!bDone(s)&&s.mat){s.del=Math.min(s.mat,(s.del||0)+(p.siteQ||0));
   if(!S.seen.siteDrop){S.seen.siteDrop=1;log(p.name+' niesie urobek prosto na budowę: '+BD[s.kind].n.toLowerCase()+'. Nie trzeba go potem nosić ze składu.')}}
  }p.siteB=null;p.siteQ=0;p.state='idle';p.wait=.3}}
// przy zmianie planu niesiony na budowę urobek trafia do zapasów, a budowa przestaje na niego czekać
{const _pj=planJob;planJob=function(p){if(p.siteB&&p.after!=='siteDrop'){const s=bById(p.siteB);if(s)s.inTr=Math.max(0,(s.inTr||0)-(p.siteQ||0));p.siteB=null;p.siteQ=0}return _pj(p)}}
// wóz w warsztacie
function wozWhy(b){if(!tech('r_woz'))return'Najpierw trzeba poznać koło i oś (Wiedza → rzemiosło).';const m=Object.entries(WOZ_COST).filter(([k,v])=>(S.res[k]||0)<v);return m.length?'Brakuje: '+m.map(([k,v])=>RN[k].toLowerCase()+' '+Math.ceil(v-(S.res[k]||0))).join(', ')+'.':''}
function wozOrder(id){const b=bById(id);if(!b)return;const why=wozWhy(b);if(why){toast(why);return}Object.entries(WOZ_COST).forEach(([k,v])=>S.res[k]-=v);b.wozQ=(b.wozQ||0)+1;toast('Warsztat zrobi wóz');renderPanel();if(typeof renderSel==='function')renderSel()}
{const _bp=bldPanelHTML;bldPanelHTML=function(b){let h=_bp(b);
  if(!bDone(b)&&b.mat){const pc=Math.round(100*Math.min(1,(b.del||0)/b.mat)),far=siteFar(b);
   h+=`<p class="mut">Materiał na miejscu: ${pc}%${far?` · daleko od składu${tech('r_woz')?` · wozy: ${wozFree()}/${wozN()} wolne`:' · wozy będą po poznaniu koła i osi'}`:' · urobek z okolicy idzie prosto tutaj'}</p>`}
  if(b.kind==='warsztat'&&bDone(b)&&tech('r_woz')){const why=wozWhy(b),q=b.wozQ||0;
   h+=`<div class="ext"><b>Wóz</b><small>Dwa koła, skrzynia z desek i dyszel. Woźnica bierze naraz cztery razy więcej materiału na daleką budowę. Osada ma ${wozN()} ${wozN()===1?'wóz':wozN()>=2&&wozN()<=4?'wozy':'wozów'}${wozUsed()?', w drodze '+wozUsed():''}.${q?` W robocie: ${q}, postęp ${Math.round(100*(b.wozP||0)/WOZ_T)}%.`:''}${q&&!S.people.some(p=>p.job==='wb'&&p.wb===b.id)?' <span class="no">Nikt nie pracuje w warsztacie.</span>':''}</small><span class="cost">${costHTML(WOZ_COST)}</span><button data-woz="${b.id}" ${why?'disabled':''}>Zrób wóz</button></div>`}
  return h}}
document.addEventListener('click',ev=>{if(!S)return;const t=ev.target.closest('[data-woz]');if(t){ev.stopPropagation();wozOrder(+t.dataset.woz)}},true);
{const _sp=stepPerson;stepPerson=function(p,dt){const b=p.tgt;
  if(p.state==='work'&&p.workKind==='prod'&&b&&b.kind==='warsztat'&&(b.wozQ||0)>0&&isWork()&&!p.fireB){
   b.wozP=(b.wozP||0)+dt*eff(p)*craftEff(p,'ciesla');gainXp(p,'ciesla',dt);p.act='robi wóz';
   if(b.wozP>=WOZ_T){b.wozP=0;b.wozQ--;S.wozy=wozN()+1;log(p.name+' kończy wóz. Osada ma '+S.wozy+' '+(S.wozy===1?'wóz':S.wozy<5?'wozy':'wozów')+' do dowozu na dalekie budowy.');toast('Gotowy wóz');sfx('bell')}return}
  return _sp(p,dt)}}
// stara osada z epoki II ma już wozy
{const _b=e2Build;e2Build=function(){const r=_b.apply(this,arguments);if(S){S.tech.r_woz=1;S.wozy=Math.max(S.wozy||0,2)}return r}}
// wygląd: wózek ciągnięty przez woźnicę, wolne wozy stoją przy warsztacie
const wozG=[],wozMat={};
function wozMesh(){if(!wozMat.b){wozMat.b=M(0x8a6a48);wozMat.d=M(0x6e5236);wozMat.w=M(0x4a3a2a);wozMat.l=M(0x9c7a52)}
 const g=new THREE.Group();g.add(mesh(new THREE.BoxGeometry(.62,.06,.9),wozMat.b,0,.34,0));
 [[-.31,0],[.31,0]].forEach(([x])=>{g.add(mesh(new THREE.BoxGeometry(.04,.16,.9),wozMat.d,x,.44,0))});g.add(mesh(new THREE.BoxGeometry(.62,.16,.04),wozMat.d,0,.44,-.44));g.add(mesh(new THREE.BoxGeometry(.62,.16,.04),wozMat.d,0,.44,.44));
 [-.36,.36].forEach(x=>{const wh=mesh(new THREE.CylinderGeometry(.24,.24,.05,10),wozMat.w,x,.24,-.05,0,0,Math.PI/2);g.add(wh);g.add(mesh(new THREE.BoxGeometry(.03,.42,.03),wozMat.d,x,.24,-.05))});
 g.add(mesh(new THREE.CylinderGeometry(.03,.03,.82,6),wozMat.d,0,.24,-.05,0,0,Math.PI/2));
 [-.2,.2].forEach(x=>g.add(mesh(new THREE.BoxGeometry(.035,.035,.8),wozMat.d,x,.36,.82)));g.add(mesh(new THREE.BoxGeometry(.44,.035,.035),wozMat.d,0,.36,1.2));
 const load=new THREE.Group();for(let k=0;k<5;k++)load.add(mesh(new THREE.CylinderGeometry(.07,.07,.8,7),wozMat.l,-.2+k*.1,.53+(k%2)*.08,0,Math.PI/2,0,0));g.add(load);g.userData.load=load;
 g.scale.setScalar(.85);g.traverse(o=>{o.castShadow=true});scene.add(g);return g}
function wozTick(){if(!S)return;const n=wozN();while(wozG.length<Math.min(n,12))wozG.push(wozMesh());let k=0;
 S.people.forEach(p=>{if(!p.woz||k>=wozG.length||p.state==='away')return;const g=wozG[k++];const pm=pMesh[p.id];g.visible=!pm||pm.visible!==false;const d=p.dir||0,fx=Math.sin(d),fz=Math.cos(d);
  const x=p.x-fx*1.05,z=p.z-fz*1.05;g.position.set(x,Hy(x,z),z);g.rotation.y=d;g.userData.load.visible=!!(p.haulQ>0);const u=pm&&pm.userData;if(u&&u.carry)u.carry.visible=false;});
 const w=S.bld.find(b=>b.kind==='warsztat'&&bDone(b));let q=0;
 for(;k<wozG.length;k++,q++){const g=wozG[k];if(!w||q>=4){g.visible=false;continue}const c=bCenter(w),a=(w.rot||0)+.4+q*.55;const x=c.x+Math.cos(a)*2.1,z=c.z+Math.sin(a)*2.1;g.visible=true;g.position.set(x,Hy(x,z),z);g.rotation.y=a+1.2;g.userData.load.visible=false}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;for(const p of S.people){if(!p.woz)continue;const m=pMesh[p.id],u=m&&m.userData;if(u&&u.aL){u.aL.rotation.x=u.aR.rotation.x=.38;u.aL.rotation.z=-.1;u.aR.rotation.z=.1}}}}
{const _db=drawBirds;drawBirds=function(rdt){_db(rdt);try{wozTick()}catch(e){}}}
window.__woz={panel:b=>bldPanelHTML(b),techHTML:()=>{techDom="rzemioslo";return techHTML()},siteFar,siteDist,wozFree,wozOrder,haulFrom,siteNeeding,wozG};
