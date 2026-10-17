
/* ================= 0.22: wygląd budynków — budowa warstwami, plac budowy z materiałem, śparogi i ozdoby rosnące z poziomem i wiekiem, zapasy przy składach, śnieg na dachach ================= */
// ---------- budowa warstwami ----------
const _bb3=new THREE.Box3();
function buildPrep(g){g.scale.y=1;g.updateMatrixWorld(true);const gy=g.position.y,list=[];let top=0;
 g.traverse(o=>{if(!(o.isMesh||o.isSprite)||o.userData.sitePile)return;let skip=false;for(let a=o;a&&a!==g;a=a.parent)if(a.userData.sitePile)skip=true;if(skip)return;
  _bb3.setFromObject(o);if(_bb3.isEmpty())return;const mn=_bb3.min.y-gy,mx=_bb3.max.y-gy;top=Math.max(top,mx);
  let ok=o.isMesh&&!o.isInstancedMesh&&Math.abs(o.rotation.x)<1e-3&&Math.abs(o.rotation.z)<1e-3;for(let a=o.parent;a&&a!==g;a=a.parent){if(Math.abs(a.rotation.x)>1e-3||Math.abs(a.rotation.z)>1e-3||Math.abs(a.scale.y-1)>1e-3)ok=false}
  let gmin=0;if(ok){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();gmin=o.geometry.boundingBox.min.y}
  list.push({o,mn,mx,y0:o.position.y,sy:o.scale.y,gmin,part:ok&&mx-mn>.22})});g.userData.bp={list,top:Math.max(top,.5)}}
function buildApply(g,f){if(!g)return;if(!g.userData.bp)buildPrep(g);const P=g.userData.bp;f=Math.min(1,Math.max(0,f));const done=f>=.999,H=P.top*(.05+1.0*f);
 for(const e of P.list){const o=e.o;if(done||e.mx<=H){o.visible=true;if(e.part){o.scale.y=e.sy;o.position.y=e.y0}}
  else if(e.mn>=H)o.visible=false;
  else{const k=(H-e.mn)/(e.mx-e.mn);if(e.part){o.visible=true;o.scale.y=e.sy*k;o.position.y=e.y0+e.gmin*e.sy*(1-k)}else o.visible=k>.55}}
 if(g.userData.site)siteApply(g,f)}
// plac budowy: paliki ze sznurkiem i kupka doniesionego materiału
const SITE={log:new THREE.CylinderGeometry(.075,.075,.9,6),stone:new THREE.DodecahedronGeometry(.14,0),plank:new THREE.BoxGeometry(.9,.05,.2),stake:new THREE.BoxGeometry(.05,.42,.05),rope:new THREE.BoxGeometry(1,.012,.012)};
function siteMake(g,b){const d=BD[b.kind],W=d.w*.5,H=d.h*.5,s=new THREE.Group();s.userData.sitePile=1;
 const st=new THREE.Group();[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([x,z])=>st.add(mesh(SITE.stake,matDark,x*(W+.05),.21,z*(H+.05))));
 [[0,-1,W*2+.1,0],[0,1,W*2+.1,0],[-1,0,H*2+.1,Math.PI/2],[1,0,H*2+.1,Math.PI/2]].forEach(([x,z,l,r])=>{const m=mesh(SITE.rope,M(0xd8cfb4),x*(W+.05),.36,z*(H+.05),0,r,0);m.scale.x=l;st.add(m)});s.add(st);
 const pile=new THREE.Group();pile.position.set(W+.75,0,-H*.15);pile.rotation.y=.2;const logs=[],stones=[],planks=[];
 for(let k=0;k<9;k++){const r=(k/3)|0,c=k%3;const m=mesh(SITE.log,matLog,(c-1)*.16+(r%2)*.08,.08+r*.14,0,0,0,Math.PI/2);m.rotation.y=Math.PI/2;logs.push(m);pile.add(m)}
 for(let k=0;k<6;k++){const m=mesh(SITE.stone,matStone,-.3+(k%3)*.22,.08+((k/3)|0)*.16,.55+(k%2)*.08,k,k*2,0);stones.push(m);pile.add(m)}
 for(let k=0;k<5;k++){const m=mesh(SITE.plank,mPlank,.0,.03+k*.055,-.55,0,.1*(k%2),0);planks.push(m);pile.add(m)}
 s.add(pile);g.add(s);g.userData.site={grp:s,st,logs,stones,planks}}
function siteApply(g,f){const S0=g.userData.site,b=bById(g.userData.bid);if(!S0||!b)return;const r=b.mat?Math.min(1,(b.del||0)/b.mat):1;const rem=Math.max(0,Math.min(1,r-f+.06));
 const c=BD[b.kind].cost||{};const hasL=(c.drewno||0)+(c.deski||0)>0,hasS=(c.kamien||0)+(c.glina||0)+(c.cegla||0)>0;
 S0.logs.forEach((m,i)=>m.visible=(c.drewno||!hasS)&&i<Math.ceil(rem*S0.logs.length));S0.stones.forEach((m,i)=>m.visible=hasS&&i<Math.ceil(rem*S0.stones.length));S0.planks.forEach((m,i)=>m.visible=!!c.deski&&i<Math.ceil(rem*S0.planks.length));
 S0.st.visible=f<.3}
{const _ab=addBuildingMesh;addBuildingMesh=function(b){const g=_ab(b);if(!bDone(b)){g.scale.y=1;g.userData.bid=b.id;siteMake(g,b);buildApply(g,b.prog/b.work)}return g}}
// dokończenie: kurz i krótkie „przysiadnięcie” budynku
const puffs=[];const puffMat=new THREE.SpriteMaterial({map:softTex,color:0xd8ccb4,transparent:true,opacity:0,depthWrite:false});
function dustPuff(x,y,z,n,sz){for(let k=0;k<n;k++){const s=new THREE.Sprite(puffMat.clone());const a=k/n*6.28;s.position.set(x+Math.cos(a)*sz*.5,y+.2,z+Math.sin(a)*sz*.5);s.userData={vx:Math.cos(a)*.9,vz:Math.sin(a)*.9,t:0,life:1.1+Math.random()*.6,s0:.5+Math.random()*.4};s.scale.set(.5,.5,1);scene.add(s);puffs.push(s)}}
{const _cs=completeSite;completeSite=function(s){_cs(s);s.bd=S.day;const g=bMesh[s.id];if(g){if(g.userData.site){retireObjects(g.userData.site.grp);g.userData.site=null}buildApply(g,1);g.userData.bp=null;g.userData.popT=0;const c=bCenter(s);dustPuff(c.x,Hy(c.x,c.z),c.z,10,BD[s.kind].w);gameLater(()=>{if(bMesh[s.id]===g)rebuildMesh(s)},1300)}}}
function budFrame(rdt){for(let k=puffs.length-1;k>=0;k--){const p=puffs[k],u=p.userData;u.t+=rdt;const a=u.t/u.life;if(a>=1){scene.remove(p);p.material.dispose();puffs.splice(k,1);continue}
  p.position.x+=u.vx*rdt*(1-a);p.position.z+=u.vz*rdt*(1-a);p.position.y+=rdt*.5;const sc=u.s0+a*1.6;p.scale.set(sc,sc,1);p.material.opacity=.55*Math.sin(a*Math.PI)}
 for(const id in bMesh){const g=bMesh[id];if(g.userData.popT===undefined)continue;g.userData.popT+=rdt;const t=g.userData.popT;if(t>.7){g.scale.set(1,1,1);delete g.userData.popT;continue}const k=Math.sin(t/.7*Math.PI)*Math.exp(-t*3);g.scale.set(1+k*.06,1-k*.08,1+k*.06)}}

// ---------- ozdoby: śparogi, kalenica, ścieżka do drzwi, znak rodu, sezonowe ----------
const BG={board:new THREE.BoxGeometry(.06,.62,.05),head:new THREE.BoxGeometry(.06,.12,.18),body:new THREE.BoxGeometry(.07,.16,.5),flag:new THREE.BoxGeometry(.04,.1,.12),step:new THREE.CylinderGeometry(.16,.18,.05,7),
 box:new THREE.BoxGeometry(.5,.12,.14),fl:new THREE.SphereGeometry(.05,5,4),onion:new THREE.SphereGeometry(.05,5,4),herb:new THREE.ConeGeometry(.05,.2,5),block:new THREE.CylinderGeometry(.18,.2,.3,8)};
const BM={carve:M(0x8a6a44),paint:[M(0x3f5f7a),M(0x7a3a2a),M(0x4a6a3a),M(0xb08a3a)],fl:[M(0xe8c84a),M(0xc8463c),M(0xf2efe4),M(0x8a6ab8)],onion:M(0xc79a5a),herb:M(0x6a8a4a)};
function ridges(g){const r=[];g.traverse(o=>{if(o.userData&&o.userData.ridge)r.push(o)});return r}
function sparogi(gr){const R=gr.userData.ridge;[-1,1].forEach(z=>{[-1,1].forEach(s=>{const m=mesh(BG.board,BM.carve,s*.1,R.y+.16,z*(R.D-.04),0,0,s*.62);gr.add(m)});
  [-1,1].forEach(s=>{const h=mesh(BG.head,BM.carve,s*.27,R.y+.42,z*(R.D-.04),0,0,s*.3);gr.add(h)})})}
function ridgeFigure(gr,col){const R=gr.userData.ridge;const f=new THREE.Group();f.add(mesh(BG.body,BM.carve,0,0,0));f.add(mesh(BG.head,BM.carve,0,.13,.27,-.5,0,0));f.add(mesh(BG.flag,col||BM.paint[0],0,.1,-.27,.4,0,0));f.position.set(0,R.y+.1,0);gr.add(f)}
function famOfHouse(b){return Object.values(S.fams||{}).find(f=>f.home===b.id)}
function budDeco(g,b){const d=BD[b.kind];if(!d||!bDone(b))return;const W=d.w*.5,H=d.h*.5,isH=d.house&&b.kind!=='szalas';const age=b.bd===undefined?YEAR*2:S.day-b.bd;const sea=seasonIdx();
 const hl=isH?(age>=YEAR*1.5?3:age>=YEAR*.4?2:1)+(b.kind==='dom'?1:0):lvOf(b)+(d.wk&&condOf(b)>.8&&age>YEAR*2?1:0);const r0=rng(b.id*131+7);
 const rs=ridges(g);if(hl>=2)rs.forEach(sparogi);if(hl>=3&&rs[0])ridgeFigure(rs[0],BM.paint[b.id%4]);
 if(isH){const dz=H-.15,dx=.35;
  if(hl>=2){for(let k=0;k<3;k++)g.add(mesh(BG.step,matStone,dx+(r0()-.5)*.15,.025,dz+.45+k*.36,0,r0()*3,0));g.add(mesh(BG.block,matLog2,-W-.35,.15,dz-.1));g.add(tbox(.04,.4,.04,matDark,-W-.33,.42,dz-.08))}
  if(hl>=3){const bx=new THREE.Group();bx.add(mesh(BG.box,mPlankD,0,0,0));for(let k=0;k<5;k++)bx.add(mesh(BG.fl,BM.fl[(k+b.id)%4],-.2+k*.1,.09,0));bx.position.set(W-.5,.3+.62*1.15-.3,dz+.12);g.add(bx)}
  // znak rodu nad drzwiami
  const f=famOfHouse(b),m=f&&famMembers(f.id)[0],z=m&&S.rody&&S.rody[m.rod]&&S.rody[m.rod].znak;if(z&&typeof znakMat==='function'){const sp=new THREE.Sprite(znakMat(z));sp.scale.set(.32,.32,1);sp.position.set(dx,1.22,dz+.2);g.add(sp)}
  // jesienią pod okapem wiszą wianki cebuli i pęki ziół
  if(sea===1&&hl>=2){for(let k=0;k<4;k++)g.add(mesh(k%2?BG.herb:BG.onion,k%2?BM.herb:BM.onion,-W+.4+k*.22,1.25-(k%2)*.05,dz+.28,k%2?Math.PI:0,0,0))}
  if(sea===2)woodpile(g,W+.35,-H+.4,10,Math.PI/2)}
 else if(hl>=2&&d.wk){for(let k=0;k<2;k++)g.add(mesh(BG.step,matStone,(r0()-.5)*.3,.025,H+.4+k*.36,0,r0()*3,0))}
 if(hl>=3&&!isH&&d.wk){lantern(g,W-.15,1.1,H+.1)}
 stockMake(g,b)}
{const _av=addBldVisuals;addBldVisuals=function(g,b){_av(g,b);try{budDeco(g,b)}catch(e){console.warn(e)}}}
// zapasy widoczne przy spiżarni, składzie i drewutni
const STK={spizarnia:()=>foodTotal()/Math.max(1,foodCap()),sklad:()=>((S.res.drewno||0)+(S.res.kamien||0)+(S.res.deski||0)+(S.res.glina||0))/500,drewutnia:()=>(S.res.opal||0)/160};
function stockMake(g,b){if(!STK[b.kind]||!bDone(b))return;if(g.userData.stock)g.remove(g.userData.stock);const d=BD[b.kind],W=d.w*.5,H=d.h*.5,s=new THREE.Group();g.add(s);g.userData.stock=s;
 const n=Math.round(Math.min(1,Math.max(0,STK[b.kind]()))*8);b._stk=n;
 for(let k=0;k<n;k++){const x=-W+.25+(k%4)*.42,z=H+.35+((k/4)|0)*.42;
  if(b.kind==='spizarnia'){if(k%3===2)barrel(s,x,z,.75);else sack(s,x,z,1)}
  else if(b.kind==='sklad'){if(k%2)crate(s,x,z,k*.4);else woodpile(s,x,z,5,0)}
  else{woodpile(s,-W-.3,-H+.3+k*.32,5,Math.PI/2)}}}
function stockDaily(){S.bld.forEach(b=>{if(!STK[b.kind]||!bDone(b))return;const g=bMesh[b.id];if(!g)return;const n=Math.round(Math.min(1,Math.max(0,STK[b.kind]()))*8);if(n!==b._stk)stockMake(g,b)})}

// ---------- śnieg na dachach i wszystkim, co patrzy w niebo ----------
const SNOWU={value:0};
function addSnow(m){if(!m||m.userData.snow)return;m.userData.snow=1;const prev=m.onBeforeCompile;
 m.onBeforeCompile=function(sh,r){if(prev)prev.call(this,sh,r);sh.uniforms.uSnow=SNOWU;
  sh.vertexShader='varying vec3 vSnN;\n'+sh.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\n vSnN=normalize(mat3(modelMatrix)*objectNormal);');
  sh.fragmentShader='uniform float uSnow;varying vec3 vSnN;\n'+sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\n {float sn=uSnow*smoothstep(.4,.78,vSnN.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.89,.93),sn);}')};
 const k0=m.customProgramCacheKey?m.customProgramCacheKey.bind(m):null;m.customProgramCacheKey=()=>(k0?k0():'')+'|snow';m.needsUpdate=true}
[mThatch,mThatchOld,mShingle,mCanvas,matThatch,mPlank,mPlankD,mPlankG,matStone,mStone,mLogs,mLogsD,mLogsG,matLog,matLog2,matWood,matTile,mBrick,matDark,typeof LM!=='undefined'?LM.stone:null,BM.carve].forEach(addSnow);
function snowDaily(){const sea=seasonIdx(),w=S.weather.k;let c=S.snowC||0;if(sea===2)c+=w==='snow'?.4*(S.weather.i||.8)+.08:w==='zamiec'?.55:w==='frost'?.06:w==='odwilz'?-.4:w==='clear'?-.02:-.05;else if(sea===3&&w==='odwilz')c-=.45;else if(sea===3)c-=.25;else c-=.5;S.snowC=Math.max(0,Math.min(1,c))}
{const _ad=actDaily;actDaily=function(){_ad();snowDaily();stockDaily();if(seasonIdx()!==S.budSea){S.budSea=seasonIdx();S.bld.forEach(b=>{if(bDone(b)&&BD[b.kind].house)rebuildMesh(b)})}}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;budFrame(rdt);const t=Math.max((S.snowC||0)*(seasonIdx()===2||seasonIdx()===3?1:0),WX.rime*.42);SNOWU.value+=(t-SNOWU.value)*Math.min(1,rdt*.6)}}
