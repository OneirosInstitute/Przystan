/* ================= generacja świata ================= */
function treeSpecies(bi,R){const r=R();if(bi==='decid')return r<.5?'oak':r<.8?'birch':'pine';if(bi==='conif')return r<.55?'spruce':'pine';if(bi==='wet')return r<.7?'birch':'spruce';if(bi==='high')return r<.6?'spruce':'pine';return r<.45?'oak':r<.75?'birch':'pine'}
let S=null;
const nodes=[];
let camp={i:0,j:0}, wreck={i:0,j:0,stand:[0,0]}, reach=null;
const tribe=[], herdsDef=[];
const R=rng(SEED+99);
(function worldGen(){
 recomputeWalk();
 const dirC=(i,j)=>{const dx=N/2-i,dy=N/2-j,l=Math.hypot(dx,dy)||1;return[dx/l,dy/l]};
 for(const need of[6,3,0]){let best=1e9;
  for(let j=2;j<N-2;j++)for(let i=2;i<N-2;i++){const k=j*N+i;if(!beach[k])continue;let wi=-1,wj=-1;
   for(const[dx,dy]of[[0,1],[1,0],[-1,0],[0,-1]]){const a=i+dx,b=j+dy;if(!land[b*N+a]&&tileHH(a,b)>-.25){wi=a;wj=b;break}}
   if(wi<0)continue;const[ux,uy]=dirC(i,j);let inland=0;for(let r=2;r<9;r++){const a=Math.round(i+ux*r),b=Math.round(j+uy*r);if(land[b*N+a]&&tileHH(a,b)<.35&&slope(a,b)<.6)inland++}
   const d=Math.hypot(i-N*.5,j-N*.9)-inland*2;if(inland>=need&&d<best){best=d;wreck={i:wi,j:wj,stand:[i,j]}}}
  if(best<1e9)break}
 const[ux,uy]=dirC(wreck.stand[0],wreck.stand[1]);const cx0=Math.round(wreck.stand[0]+ux*7),cy0=Math.round(wreck.stand[1]+uy*7);let best=1e9;
 for(let j=cy0-7;j<=cy0+7;j++)for(let i=cx0-7;i<=cx0+7;i++){if(i<2||j<2||i>N-3||j>N-3)continue;const k=j*N+i;if(!land[k]||beach[k]||slope(i,j)>.5)continue;const h=tileHH(i,j);if(h<.08||h>.5)continue;
  const d=Math.hypot(i-cx0,j-cy0)+slope(i,j)*6;if(d<best){best=d;camp={i,j}}}
 occ[camp.j*N+camp.i]=999;recomputeWalk();
 reach=new Uint8Array(N*N);const st0=nearestWalk(camp.i,camp.j+1);const stk=[st0];reach[st0[1]*N+st0[0]]=1;
 while(stk.length){const[x,y]=stk.pop();for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const a=x+dx,b=y+dy;if(a<0||b<0||a>=N||b>=N)continue;const k=b*N+a;if(walk[k]&&!reach[k]){reach[k]=1;stk.push([a,b])}}}
 const near0=(type,i,j,r)=>nodeBy0[type]&&nodeBy0[type].some(n=>Math.abs(n.i-i)<r&&Math.abs(n.j-j)<r&&Math.hypot(n.i-i,n.j-j)<r);const nodeBy0={};
 const add=(type,i,j,x,z,amt,extra)=>{const n=Object.assign({id:nodes.length,type,i,j,x,z,amt,max:amt,claim:0,bad:0,stand:[i,j]},extra||{});nodes.push(n);(nodeBy0[type]||(nodeBy0[type]=[])).push(n);return n};
 const dc=(i,j)=>Math.hypot(i-camp.i,j-camp.j);
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(!land[k]||!reach[k]||beach[k])continue;const h=tileH(i,j);if(h>9.5||slope(i,j)>1.6)continue;
  if(dc(i,j)<4)continue;
  const f=forestF(i+.5,j+.5),bi=biomeOf(i,j);let p=f>.52?.55:(f>.46?.14:.018);if(bi==='wet')p=Math.max(p*.5,.12);if(bi==='high')p*=.6;
  if(R()<p){const sp=treeSpecies(bi,R);add('tree',i,j,tcx(i)+(R()-.5)*.8,tcx(j)+(R()-.5)*.8,5,{sc:.8+R()*.6,rot:R()*6.28,sh:R(),sp,leaf:sp==='oak'||sp==='birch'})}}
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(!land[k]||!reach[k]||beach[k]||tileH(i,j)>6.5)continue;const f=forestF(i+.5,j+.5);
  if(f>.32&&f<.6&&R()<.07&&dc(i,j)>2)add('bush',i,j,tcx(i)+(R()-.5)*.7,tcx(j)+(R()-.5)*.7,4,{sc:.8+R()*.4});
  else if(f>.55&&R()<.035&&dc(i,j)>2)add('grzyb',i,j,tcx(i)+(R()-.5)*.7,tcx(j)+(R()-.5)*.7,3,{sc:.8+R()*.5,rot:R()*6.28})}
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(!land[k]||!reach[k]||beach[k]||tileH(i,j)>4.5)continue;const f=forestF(i+.5,j+.5);
  if(f<.33&&R()<.022&&dc(i,j)>3)add('zboze',i,j,tcx(i)+(R()-.5)*.7,tcx(j)+(R()-.5)*.7,3,{sc:.8+R()*.4,rot:R()*6.28});
  else if(f>.4&&f<.5&&R()<.02&&dc(i,j)>3)add('len',i,j,tcx(i)+(R()-.5)*.7,tcx(j)+(R()-.5)*.7,3,{sc:.8+R()*.4,rot:R()*6.28});
  else if(f>.3&&f<.56&&R()<.014&&dc(i,j)>3)add('ziola',i,j,tcx(i)+(R()-.5)*.7,tcx(j)+(R()-.5)*.7,3,{sc:.8+R()*.4,rot:R()*6.28});
  else if(biomeOf(i,j)==='decid'&&R()<.006&&dc(i,j)>5&&!near0('ul',i,j,9))add('ul',i,j,tcx(i)+(R()-.5)*.5,tcx(j)+(R()-.5)*.5,4,{sc:.9+R()*.3,rot:R()*6.28})}
 for(let t=0;t<21000;t++){const i=(R()*N)|0,j=(R()*N)|0,k=j*N+i;if(!land[k]||!reach[k])continue;const h=tileHH(i,j);
  if(h>.06&&h<.22&&n1(i*.21+7,j*.21)>.58&&!near0('ruda',i,j,6))add('ruda',i,j,tcx(i)+(R()-.5)*.5,tcx(j)+(R()-.5)*.5,10,{sc:.8+R()*.4,rot:R()*6.28})}
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(!land[k]||!reach[k])continue;const h=tileH(i,j);
  if((h>6.5&&R()<.08)||(n2(i*.3,j*.3)>.74&&R()<.16)||(beach[k]&&R()<.012))add('rock',i,j,tcx(i)+(R()-.5)*.6,tcx(j)+(R()-.5)*.6,8,{sc:.7+R()*.9,rot:R()*6.28})}
 for(let t=0;t<16000;t++){const i=(R()*N)|0,j=(R()*N)|0,k=j*N+i;if(!land[k]||!reach[k])continue;const h=tileHH(i,j);
  if(h>.05&&h<.16&&n2(i*.25,j*.25)>.48&&!near0('clay',i,j,7))add('clay',i,j,tcx(i),tcx(j),14)}
 for(let t=0;t<36000;t++){const i=(R()*N)|0,j=(R()*N)|0,k=j*N+i;if(land[k])continue;const hh=tileHH(i,j);if(hh<-.3)continue;
  let st=null;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=i+dx,b=j+dy;if(a>=0&&b>=0&&a<N&&b<N&&land[b*N+a]&&reach[b*N+a]){st=[a,b];break}}
  if(st&&!near0('fish',i,j,6))add('fish',i,j,tcx(i),tcx(j),30,{stand:st})}
 const near=(type,r)=>nodes.filter(n=>n.type===type&&dc(n.i,n.j)<r).length;
 const fill=(type,need,r,amt)=>{let g=0;while(near(type,r)<need&&g++<800){const i=clamp(Math.round(camp.i+(R()-.5)*r*2),1,N-2),j=clamp(Math.round(camp.j+(R()-.5)*r*2),1,N-2),k=j*N+i;
   if(!land[k]||!reach[k]||beach[k]||dc(i,j)<3||dc(i,j)>r)continue;const sp=['oak','birch','pine','spruce'][(R()*4)|0];add(type,i,j,tcx(i)+(R()-.5)*.6,tcx(j)+(R()-.5)*.6,amt,{sc:.7+R()*.8,rot:R()*6.28,sh:R(),sp,leaf:sp==='oak'||sp==='birch'})}};
 fill('bush',14,14,4);fill('zboze',6,20,3);fill('len',4,22,3);fill('ruda',3,30,10);fill('grzyb',6,16,3);fill('rock',6,16,8);fill('tree',40,16,5);fill('clay',2,22,14);fill('ziola',4,20,3);fill('ul',1,28,4);
 for(let t=0;t<6000&&near('fish',16)<3;t++){const i=clamp(Math.round(camp.i+(R()-.5)*32),1,N-2),j=clamp(Math.round(camp.j+(R()-.5)*32),1,N-2);if(land[j*N+i])continue;
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=i+dx,b=j+dy;if(land[b*N+a]&&reach[b*N+a]){add('fish',i,j,tcx(i),tcx(j),30,{stand:[a,b]});break}}}
 for(let t=0;t<40000&&tribe.length<TRIBE.length;t++){const i=(R()*(N-8)+4)|0,j=(R()*(N-8)+4)|0,k=j*N+i;if(!land[k]||!reach[k]||beach[k]||slope(i,j)>.9||tileH(i,j)>8)continue;
  if(dc(i,j)<34)continue;if(tribe.some(s=>Math.hypot(s.i-i,s.j-j)<22))continue;tribe.push({k:tribe.length,i,j})}
 // stada: sarny, kozy, dziki, wilki
 const herdPlan=[['sarna',22,12,16],['koza',12,8,14],['dzik',10,14,16],['wilk',6,36,24],['zajac',16,8,12],['lis',8,14,18],['foka',6,10,18],['niedzwiedz',3,45,40]];
 const okH={sarna:(b,f)=>b!=='coast'&&b!=='high',koza:(b,f)=>f<=.45&&b!=='coast',dzik:(b,f)=>f>=.52&&b!=='coast',wilk:(b,f)=>f>=.52&&b!=='coast',zajac:b=>b==='meadow',lis:(b,f)=>f>.4&&f<.62&&b!=='coast',foka:b=>b==='coast',niedzwiedz:b=>b==='conif'||b==='high'};
 herdPlan.forEach(([type,cnt,minD,sep])=>{let made=0;for(let t=0;t<40000&&made<cnt;t++){const i=(R()*(N-10)+5)|0,j=(R()*(N-10)+5)|0,k=j*N+i;if(!land[k]||!reach[k]||tileH(i,j)>8.5)continue;const f=forestF(i+.5,j+.5);
  if(!okH[type](biomeOf(i,j),f))continue;
  const dd=dc(i,j);if(dd<minD||(made<2&&(type==='sarna'||type==='koza'||type==='dzik')&&dd>(type==='koza'?18:26)))continue;if(herdsDef.some(h=>h.type===type&&Math.hypot(h.i-i,h.j-j)<sep))continue;herdsDef.push({i,j,type});made++}})
})();
const nodeBy={};['tree','rock','bush','grzyb','clay','fish','zboze','len','ruda','ziola','ul'].forEach(t=>nodeBy[t]=nodes.filter(n=>n.type===t));
const tileNodes=new Map();nodes.forEach(n=>{const k=n.type==='fish'?n.stand[1]*N+n.stand[0]:n.j*N+n.i;if(!tileNodes.has(k))tileNodes.set(k,[]);tileNodes.get(k).push(n)});

/* ================= instancje ================= */
const dummy=new THREE.Object3D(),tmpC=new THREE.Color();
function mergeGeos(list){const P=[],Nn=[],C=[];list.forEach(({g,y,c,x,z,s,rx,rz,ry})=>{if(g.index)g=g.toNonIndexed();if(s)g.scale(s[0],s[1],s[2]);if(rx)g.rotateX(rx);if(rz)g.rotateZ(rz);if(ry)g.rotateY(ry);g.translate(x||0,y||0,z||0);if(!g.attributes.normal)g.computeVertexNormals();P.push(...g.attributes.position.array);Nn.push(...g.attributes.normal.array);const n=g.attributes.position.count;for(let k=0;k<n;k++)C.push(c[0],c[1],c[2])});
 const m=new THREE.BufferGeometry();m.setAttribute('position',new THREE.Float32BufferAttribute(P,3));m.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));m.setAttribute('color',new THREE.Float32BufferAttribute(C,3));return m}
const W1=[1,1,1];
const pineG=mergeGeos([{g:new THREE.ConeGeometry(.74,1.3,10),y:1.05,c:[.72,.78,.74]},{g:new THREE.ConeGeometry(.6,1.15,10),y:1.6,c:[.84,.9,.85]},{g:new THREE.ConeGeometry(.45,1,10),y:2.15,c:[.94,1,.95]},{g:new THREE.ConeGeometry(.28,.8,10),y:2.65,c:W1}]);
const spruceG=mergeGeos([{g:new THREE.ConeGeometry(.62,1.0,9),y:.85,c:[.66,.72,.7]},{g:new THREE.ConeGeometry(.54,.95,9),y:1.35,c:[.76,.82,.8]},{g:new THREE.ConeGeometry(.46,.9,9),y:1.85,c:[.86,.92,.9]},{g:new THREE.ConeGeometry(.36,.85,9),y:2.35,c:[.94,1,.97]},{g:new THREE.ConeGeometry(.25,.8,9),y:2.85,c:W1},{g:new THREE.ConeGeometry(.12,.55,7),y:3.3,c:W1}]);
const oakG=mergeGeos([{g:new THREE.SphereGeometry(.78,10,7),y:1.85,c:[.9,.94,.88],s:[1.1,.8,1.05]},{g:new THREE.SphereGeometry(.56,9,6),y:2.35,x:.3,z:.18,c:W1},{g:new THREE.SphereGeometry(.54,9,6),y:2.05,x:-.5,z:-.14,c:[.8,.86,.8]},{g:new THREE.SphereGeometry(.5,9,6),y:1.72,x:.5,z:-.36,c:[.74,.8,.74]},{g:new THREE.SphereGeometry(.44,8,6),y:2.6,x:-.2,z:-.08,c:[1.04,1.06,1]},{g:new THREE.SphereGeometry(.42,8,6),y:1.9,x:-.1,z:.55,c:[.82,.88,.82]}]);
const birchG=mergeGeos([{g:new THREE.SphereGeometry(.36,9,6),y:2.05,c:[.9,.95,.88],s:[1,1.35,1]},{g:new THREE.SphereGeometry(.3,8,6),y:2.55,x:.12,z:.08,c:W1,s:[1,1.4,1]},{g:new THREE.SphereGeometry(.28,8,6),y:1.75,x:-.2,z:-.1,c:[.82,.88,.8],s:[1,1.3,1]},{g:new THREE.SphereGeometry(.24,8,6),y:2.2,x:.24,z:-.18,c:[.86,.9,.84],s:[1,1.3,1]}]);
const trunkG=new THREE.CylinderGeometry(.07,.12,1.3,6);trunkG.translate(0,.65,0);
const oakTrunkG=mergeGeos([{g:new THREE.CylinderGeometry(.11,.17,1.5,7),y:.75,c:W1},{g:new THREE.CylinderGeometry(.04,.07,.8,5),y:1.45,x:.22,c:W1,rz:-.6},{g:new THREE.CylinderGeometry(.04,.07,.8,5),y:1.4,x:-.22,c:W1,rz:.6}]);
const birchTrunkG=mergeGeos([{g:new THREE.CylinderGeometry(.045,.07,2.1,6),y:1.05,c:[.92,.9,.86]},{g:new THREE.CylinderGeometry(.072,.072,.06,6),y:.4,c:[.18,.17,.16]},{g:new THREE.CylinderGeometry(.066,.066,.05,6),y:.85,c:[.2,.19,.18]},{g:new THREE.CylinderGeometry(.06,.06,.05,6),y:1.3,c:[.2,.19,.18]},{g:new THREE.CylinderGeometry(.055,.055,.04,6),y:1.62,c:[.2,.19,.18]}]);
const TSP={pine:{g:pineG,tg:trunkG,col:()=>seasonCol(SPINE,curYd)},spruce:{g:spruceG,tg:trunkG,col:()=>seasonCol(SSPR,curYd)},oak:{g:oakG,tg:oakTrunkG,col:()=>seasonCol(SC,curYd),leaf:1},birch:{g:birchG,tg:birchTrunkG,col:()=>seasonCol(SBIR,curYd),leaf:1}};
const SSPR=[[.16,.27,.24],[.17,.27,.23],[.38,.45,.45],[.17,.29,.25]];
const SBIR=[[.56,.62,.36],[.84,.68,.26],[.6,.56,.5],[.6,.7,.38]];
const crownM={},trunkM={};
for(const sp in TSP){const list=nodeBy.tree.filter(n=>n.sp===sp);list.forEach((n,k)=>n.k=k);
 crownM[sp]=new THREE.InstancedMesh(TSP[sp].g,windify(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95}),sp==='birch'?.009:.0065),Math.max(1,list.length));
 crownM[sp].instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,list.length)*3),3);
 trunkM[sp]=new THREE.InstancedMesh(TSP[sp].tg,sp==='birch'?new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9}):new THREE.MeshStandardMaterial({color:sp==='oak'?0x4e3c2c:0x5c4632,roughness:1,flatShading:true,vertexColors:sp==='oak'}),Math.max(1,list.length));
 [crownM[sp],trunkM[sp]].forEach(m=>{m.castShadow=true;m.receiveShadow=true;scene.add(m)})}
let curYd=0;
function setTree(n){const seen=revAt(n.i,n.j);const y=Hy(n.x,n.z)-.03;let s;
 const cm=crownM[n.sp],tm=trunkM[n.sp];
 dummy.position.set(n.x,y,n.z);dummy.rotation.set(0,n.rot,0);
 if(n.amt>0)s=n.sc*(0.55+0.45*n.amt/n.max);else if(n.grow>0)s=n.sc*(.18+.6*n.grow);else s=0;
 if(n.gone){dummy.scale.set(0,0,0);dummy.updateMatrix();tm.setMatrixAt(n.k,dummy.matrix);cm.setMatrixAt(n.k,dummy.matrix);return}
 if(s===0){dummy.scale.set(n.sc*1.6,.12,n.sc*1.6);dummy.updateMatrix();tm.setMatrixAt(n.k,dummy.matrix);dummy.scale.set(0,0,0);dummy.updateMatrix();cm.setMatrixAt(n.k,dummy.matrix);return}
 dummy.scale.set(s,s,s);dummy.updateMatrix();tm.setMatrixAt(n.k,dummy.matrix);
 const bare=n.leaf&&curYd>=52&&curYd<74;
 if(bare){dummy.scale.set(s*.5,s*.7,s*.5);dummy.updateMatrix()}
 cm.setMatrixAt(n.k,dummy.matrix);
 const c=TSP[n.sp].col();const v=.82+n.sh*.36;
 if(seen)tmpC.setRGB(L(c[0]*v),L(c[1]*v),L(c[2]*v));else tmpC.setRGB(L(c[0]*v)*.12+MIST[0]*.9,L(c[1]*v)*.12+MIST[1]*.9,L(c[2]*v)*.12+MIST[2]*.9);cm.setColorAt(n.k,tmpC)}
const rocks=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.42,0),new THREE.MeshStandardMaterial({color:0x99958b,roughness:1,flatShading:true}),Math.max(1,nodeBy.rock.length));
rocks.castShadow=true;rocks.receiveShadow=true;scene.add(rocks);nodeBy.rock.forEach((n,k)=>n.k=k);
function setRock(n){const s=n.amt>0&&revAt(n.i,n.j)?n.sc*(0.5+0.5*n.amt/n.max):0;dummy.position.set(n.x,Hy(n.x,n.z)+.08,n.z);dummy.rotation.set(n.rot*.3,n.rot,0);dummy.scale.set(s,s*.7,s);dummy.updateMatrix();rocks.setMatrixAt(n.k,dummy.matrix)}
const bushG=mergeGeos([{g:new THREE.SphereGeometry(.32,8,6),y:.24,c:W1,s:[1,.8,1]},{g:new THREE.SphereGeometry(.22,7,5),y:.22,x:.28,c:[.85,.9,.85]},{g:new THREE.SphereGeometry(.2,7,5),y:.18,x:-.24,z:.14,c:[.75,.82,.75]}]);
const bushes=new THREE.InstancedMesh(bushG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),Math.max(1,nodeBy.bush.length));
bushes.castShadow=true;bushes.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,nodeBy.bush.length)*3),3);scene.add(bushes);nodeBy.bush.forEach((n,k)=>n.k=k);
const berryG=mergeGeos([{g:new THREE.IcosahedronGeometry(.065,0),y:.42,x:.1,c:W1},{g:new THREE.IcosahedronGeometry(.065,0),y:.36,x:-.15,z:.15,c:W1},{g:new THREE.IcosahedronGeometry(.065,0),y:.3,x:.3,z:-.1,c:W1},{g:new THREE.IcosahedronGeometry(.065,0),y:.34,x:-.05,z:-.22,c:W1}]);
const berries=new THREE.InstancedMesh(berryG,new THREE.MeshStandardMaterial({color:0xa02a55,roughness:.45,emissive:0x2a0510}),Math.max(1,nodeBy.bush.length));scene.add(berries);
function setBush(n){const seen=revAt(n.i,n.j);const w=curYd>=48&&curYd<72;dummy.position.set(n.x,Hy(n.x,n.z),n.z);dummy.rotation.set(0,n.i*1.7,0);const s=seen&&!n.gone?(n.sc||1)*(.85+.15*n.amt/n.max):0;dummy.scale.set(s,s,s);dummy.updateMatrix();bushes.setMatrixAt(n.k,dummy.matrix);
 const c=w?[.46,.42,.37]:[.34,.45,.27];tmpC.setRGB(L(c[0]),L(c[1]),L(c[2]));bushes.setColorAt(n.k,tmpC);
 const bs=seen&&!w&&n.amt>=1?s*(.6+.4*n.amt/n.max):0;dummy.scale.set(bs,bs,bs);dummy.updateMatrix();berries.setMatrixAt(n.k,dummy.matrix)}
const mushG=mergeGeos([{g:new THREE.CylinderGeometry(.04,.05,.16,5),y:.08,c:[.82,.78,.66]},{g:new THREE.ConeGeometry(.13,.1,7),y:.19,c:[.36,.12,.04]},{g:new THREE.CylinderGeometry(.03,.04,.12,5),y:.06,x:.16,z:.06,c:[.82,.78,.66]},{g:new THREE.ConeGeometry(.09,.08,7),y:.15,x:.16,z:.06,c:[.45,.16,.05]}]);
const mushM=new THREE.InstancedMesh(mushG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.8,flatShading:true}),Math.max(1,nodeBy.grzyb.length));scene.add(mushM);nodeBy.grzyb.forEach((n,k)=>n.k=k);
function setMush(n){const s=n.amt>=1&&revAt(n.i,n.j)&&!n.gone?n.sc*1.3:0;dummy.position.set(n.x,Hy(n.x,n.z),n.z);dummy.rotation.set(0,n.rot,0);dummy.scale.set(s,s,s);dummy.updateMatrix();mushM.setMatrixAt(n.k,dummy.matrix)}
const zbozeG=mergeGeos([{g:new THREE.ConeGeometry(.05,.55,3),y:.27,c:W1},{g:new THREE.ConeGeometry(.05,.5,3),y:.25,x:.1,z:.05,c:[.9,.9,.8]},{g:new THREE.ConeGeometry(.05,.5,3),y:.25,x:-.1,z:.06,c:[.95,.9,.8]},{g:new THREE.ConeGeometry(.05,.45,3),y:.22,x:.02,z:-.1,c:[.85,.85,.75]},{g:new THREE.ConeGeometry(.045,.5,3),y:.25,x:.14,z:-.08,c:W1},{g:new THREE.ConeGeometry(.045,.48,3),y:.24,x:-.13,z:-.07,c:[.9,.9,.85]}]);
const zbozeM=new THREE.InstancedMesh(zbozeG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),Math.max(1,nodeBy.zboze.length));zbozeM.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,nodeBy.zboze.length)*3),3);scene.add(zbozeM);nodeBy.zboze.forEach((n,k)=>n.k=k);
function setZboze(n){const s=revAt(n.i,n.j)&&!n.gone?n.sc*(n.amt>=1?1.2:.6):0;dummy.position.set(n.x,Hy(n.x,n.z),n.z);dummy.rotation.set(0,n.rot,0);dummy.scale.set(s,s,s);dummy.updateMatrix();zbozeM.setMatrixAt(n.k,dummy.matrix);
 const ripe=curYd>=14&&curYd<44&&n.amt>=1,w=curYd>=48&&curYd<72;const c=w?[.55,.5,.4]:ripe?[.86,.72,.36]:[.5,.62,.3];tmpC.setRGB(L(c[0]),L(c[1]),L(c[2]));zbozeM.setColorAt(n.k,tmpC)}
const lenG=mergeGeos([{g:new THREE.CylinderGeometry(.015,.015,.6,3),y:.3,c:[.4,.55,.3]},{g:new THREE.IcosahedronGeometry(.05,0),y:.62,c:[.45,.55,.95]},{g:new THREE.CylinderGeometry(.015,.015,.55,3),y:.27,x:.1,c:[.4,.55,.3]},{g:new THREE.IcosahedronGeometry(.05,0),y:.57,x:.1,c:[.5,.6,.95]},{g:new THREE.CylinderGeometry(.015,.015,.5,3),y:.25,x:-.08,z:.08,c:[.4,.55,.3]},{g:new THREE.IcosahedronGeometry(.05,0),y:.52,x:-.08,z:.08,c:[.45,.55,.9]}]);
const lenM=new THREE.InstancedMesh(lenG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),Math.max(1,nodeBy.len.length));scene.add(lenM);nodeBy.len.forEach((n,k)=>n.k=k);
function setLen(n){const s=revAt(n.i,n.j)&&!n.gone&&n.amt>=1&&!(curYd>=48&&curYd<72)?n.sc*1.3:0;dummy.position.set(n.x,Hy(n.x,n.z),n.z);dummy.rotation.set(0,n.rot,0);dummy.scale.set(s,s,s);dummy.updateMatrix();lenM.setMatrixAt(n.k,dummy.matrix)}
const ziolaG=mergeGeos([{g:new THREE.CylinderGeometry(.012,.012,.42,3),y:.21,c:[.36,.5,.28]},{g:new THREE.SphereGeometry(.06,6,4),y:.44,c:[.62,.42,.78]},{g:new THREE.CylinderGeometry(.012,.012,.36,3),y:.18,x:.09,z:.04,c:[.36,.5,.28]},{g:new THREE.SphereGeometry(.055,6,4),y:.38,x:.09,z:.04,c:[.92,.8,.28]},{g:new THREE.CylinderGeometry(.012,.012,.32,3),y:.16,x:-.07,z:.08,c:[.36,.5,.28]},{g:new THREE.SphereGeometry(.05,6,4),y:.34,x:-.07,z:.08,c:[.95,.95,.9]},{g:new THREE.SphereGeometry(.14,7,4),y:.06,c:[.34,.48,.26],s:[1.3,.45,1.3]}]);
const ziolaM=new THREE.InstancedMesh(ziolaG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9}),Math.max(1,nodeBy.ziola.length));scene.add(ziolaM);nodeBy.ziola.forEach((n,k)=>n.k=k);
function setZiola(n){const s=revAt(n.i,n.j)&&!n.gone&&n.amt>=1&&!(curYd>=48&&curYd<72)?n.sc*1.4:0;dummy.position.set(n.x,Hy(n.x,n.z),n.z);dummy.rotation.set(0,n.rot,0);dummy.scale.set(s,s,s);dummy.updateMatrix();ziolaM.setMatrixAt(n.k,dummy.matrix)}
const ulG=mergeGeos([{g:new THREE.CylinderGeometry(.24,.3,.9,8),y:.45,c:[.36,.28,.2]},{g:new THREE.CylinderGeometry(.25,.25,.05,8),y:.9,c:[.55,.45,.32]},{g:new THREE.SphereGeometry(.09,6,4),y:.55,z:.24,c:[.08,.06,.05],s:[1,1.4,.5]},{g:new THREE.SphereGeometry(.13,7,5),y:.3,x:.22,z:.12,c:[.82,.6,.18],s:[1,1.3,.7]},{g:new THREE.CylinderGeometry(.04,.06,.5,5),y:.95,x:.12,c:[.32,.25,.18],rz:-.5}]);
const ulM=new THREE.InstancedMesh(ulG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85}),Math.max(1,nodeBy.ul.length));ulM.castShadow=true;scene.add(ulM);nodeBy.ul.forEach((n,k)=>n.k=k);
function setUl(n){const s=revAt(n.i,n.j)&&!n.gone?n.sc:0;dummy.position.set(n.x,Hy(n.x,n.z)-.02,n.z);dummy.rotation.set(0,n.rot,0);dummy.scale.set(s,s,s);dummy.updateMatrix();ulM.setMatrixAt(n.k,dummy.matrix)}
const rudaM=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.32,0),new THREE.MeshStandardMaterial({color:0x7a4a30,roughness:1,flatShading:true}),Math.max(1,nodeBy.ruda.length));rudaM.receiveShadow=true;scene.add(rudaM);nodeBy.ruda.forEach((n,k)=>n.k=k);
const rudaPool=new THREE.InstancedMesh(new THREE.CylinderGeometry(.7,.75,.04,9),new THREE.MeshStandardMaterial({color:0x5a4a2a,roughness:.4,metalness:.1}),Math.max(1,nodeBy.ruda.length));scene.add(rudaPool);
function setRuda(n){const s=revAt(n.i,n.j)&&!n.gone&&n.amt>=1?n.sc*(.6+.4*n.amt/n.max):0;dummy.position.set(n.x,Hy(n.x,n.z)+.05,n.z);dummy.rotation.set(n.rot,n.rot*2,0);dummy.scale.set(s,s*.5,s);dummy.updateMatrix();rudaM.setMatrixAt(n.k,dummy.matrix);
 dummy.position.set(n.x,Hy(n.x,n.z)+.02,n.z);dummy.rotation.set(0,n.rot,0);dummy.scale.set(s?1:0,1,s?1:0);dummy.updateMatrix();rudaPool.setMatrixAt(n.k,dummy.matrix)}
const clays=new THREE.InstancedMesh(new THREE.CylinderGeometry(.55,.62,.07,8),new THREE.MeshStandardMaterial({color:0xb36a3c,roughness:1,flatShading:true}),Math.max(1,nodeBy.clay.length));
clays.receiveShadow=true;scene.add(clays);nodeBy.clay.forEach((n,k)=>n.k=k);
function setClay(n){const s=n.amt>0&&revAt(n.i,n.j)&&!n.gone?.6+.4*n.amt/n.max:0;dummy.position.set(n.x,Hy(n.x,n.z)+.03,n.z);dummy.rotation.set(0,n.i,0);dummy.scale.set(s,1,s);dummy.updateMatrix();clays.setMatrixAt(n.k,dummy.matrix)}
const ripples=nodeBy.fish.map(n=>{const m=new THREE.Mesh(new THREE.RingGeometry(.25,.34,18),new THREE.MeshBasicMaterial({color:0xdff0f2,transparent:true,opacity:.5,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(n.x,.0,n.z);m.renderOrder=3;scene.add(m);n.rip=m;return m});
// sarny
const deerG=mergeGeos([{g:new THREE.BoxGeometry(.5,.24,.2),y:.5,c:[.3,.15,.07]},{g:new THREE.BoxGeometry(.1,.3,.1),y:.7,x:.24,c:[.28,.14,.06],rz:-.5},{g:new THREE.BoxGeometry(.2,.12,.11),y:.86,x:.36,c:[.28,.14,.06]},{g:new THREE.BoxGeometry(.05,.36,.05),y:.2,x:.18,z:.06,c:[.12,.07,.035]},{g:new THREE.BoxGeometry(.05,.36,.05),y:.2,x:.18,z:-.06,c:[.12,.07,.035]},{g:new THREE.BoxGeometry(.05,.36,.05),y:.2,x:-.18,z:.06,c:[.12,.07,.035]},{g:new THREE.BoxGeometry(.05,.36,.05),y:.2,x:-.18,z:-.06,c:[.12,.07,.035]},{g:new THREE.BoxGeometry(.08,.08,.08),y:.58,x:-.27,c:[.85,.8,.74]},{g:new THREE.BoxGeometry(.04,.12,.04),y:.98,x:.33,z:.04,c:[.18,.1,.05]},{g:new THREE.BoxGeometry(.04,.12,.04),y:.98,x:.33,z:-.04,c:[.18,.1,.05]}]);
const quad=(body,leg,head,extra)=>mergeGeos([{g:new THREE.BoxGeometry(body[0],body[1],body[2]),y:body[3],c:body[4]},{g:new THREE.BoxGeometry(head[0],head[1],head[2]),y:head[3],x:head[4],c:head[5]},
 {g:new THREE.BoxGeometry(.05,leg[0],.05),y:leg[0]/2,x:body[0]*.35,z:.06,c:leg[1]},{g:new THREE.BoxGeometry(.05,leg[0],.05),y:leg[0]/2,x:body[0]*.35,z:-.06,c:leg[1]},{g:new THREE.BoxGeometry(.05,leg[0],.05),y:leg[0]/2,x:-body[0]*.35,z:.06,c:leg[1]},{g:new THREE.BoxGeometry(.05,leg[0],.05),y:leg[0]/2,x:-body[0]*.35,z:-.06,c:leg[1]}].concat(extra||[]));
const goatG=quad([.42,.24,.2,.42,[.56,.5,.42]],[.3,[.2,.18,.15]],[.16,.13,.11,.6,.26,[.5,.45,.38]],[{g:new THREE.ConeGeometry(.03,.16,4),y:.72,x:.24,z:.04,c:[.25,.2,.15],rz:.6},{g:new THREE.ConeGeometry(.03,.16,4),y:.72,x:.24,z:-.04,c:[.25,.2,.15],rz:.6}]);
const boarG=quad([.55,.28,.24,.38,[.13,.09,.06]],[.22,[.07,.05,.03]],[.22,.18,.16,.38,.33,[.15,.1,.07]],[{g:new THREE.BoxGeometry(.06,.02,.02),y:.33,x:.46,z:.06,c:[.85,.8,.7]},{g:new THREE.BoxGeometry(.06,.02,.02),y:.33,x:.46,z:-.06,c:[.85,.8,.7]}]);
const wolfG=quad([.55,.2,.18,.48,[.32,.31,.29]],[.36,[.2,.19,.18]],[.2,.14,.12,.6,.34,[.3,.29,.27]],[{g:new THREE.BoxGeometry(.3,.06,.06),y:.46,x:-.38,c:[.28,.27,.25],rz:.5},{g:new THREE.ConeGeometry(.03,.08,3),y:.71,x:.3,z:.04,c:[.25,.24,.22]},{g:new THREE.ConeGeometry(.03,.08,3),y:.71,x:.3,z:-.04,c:[.25,.24,.22]}]);
const hareG=quad([.26,.15,.13,.17,[.5,.43,.34]],[.1,[.42,.36,.28]],[.11,.1,.09,.27,.15,[.52,.45,.36]],[{g:new THREE.BoxGeometry(.03,.15,.035),y:.38,x:.14,z:.025,c:[.48,.41,.32],rz:-.2},{g:new THREE.BoxGeometry(.03,.15,.035),y:.38,x:.14,z:-.025,c:[.48,.41,.32],rz:-.2},{g:new THREE.SphereGeometry(.035,5,4),y:.2,x:-.14,c:[.92,.9,.86]}]);
const foxG=quad([.42,.15,.13,.28,[.72,.36,.13]],[.2,[.14,.1,.08]],[.15,.11,.1,.36,.25,[.72,.36,.13]],[{g:new THREE.BoxGeometry(.28,.08,.08),y:.27,x:-.33,c:[.7,.34,.12],rz:.35},{g:new THREE.BoxGeometry(.07,.07,.07),y:.2,x:-.47,c:[.95,.93,.9]},{g:new THREE.BoxGeometry(.09,.05,.06),y:.33,x:.35,c:[.92,.9,.85]},{g:new THREE.ConeGeometry(.025,.07,3),y:.45,x:.24,z:.035,c:[.2,.12,.08]},{g:new THREE.ConeGeometry(.025,.07,3),y:.45,x:.24,z:-.035,c:[.2,.12,.08]}]);
const sealG=mergeGeos([{g:new THREE.SphereGeometry(.22,9,6),y:.16,c:[.42,.42,.43],s:[2.3,.75,1]},{g:new THREE.SphereGeometry(.12,8,6),y:.27,x:.48,c:[.38,.38,.4]},{g:new THREE.BoxGeometry(.18,.03,.06),y:.08,x:-.5,z:.06,c:[.3,.3,.32],rx:.3},{g:new THREE.BoxGeometry(.18,.03,.06),y:.08,x:-.5,z:-.06,c:[.3,.3,.32],rx:-.3},{g:new THREE.BoxGeometry(.12,.03,.05),y:.08,x:.2,z:.2,c:[.3,.3,.32]},{g:new THREE.BoxGeometry(.12,.03,.05),y:.08,x:.2,z:-.2,c:[.3,.3,.32]}]);
const bearG=quad([.8,.42,.4,.62,[.23,.16,.1]],[.42,[.17,.12,.08]],[.28,.24,.24,.74,.5,[.25,.18,.11]],[{g:new THREE.BoxGeometry(.12,.1,.12),y:.7,x:.68,c:[.42,.32,.22]},{g:new THREE.SphereGeometry(.05,5,4),y:.9,x:.46,z:.09,c:[.2,.14,.09]},{g:new THREE.SphereGeometry(.05,5,4),y:.9,x:.46,z:-.09,c:[.2,.14,.09]},{g:new THREE.SphereGeometry(.24,7,5),y:.8,x:.15,c:[.25,.17,.1],s:[1.3,.8,1]}]);
const ANIMG={sarna:deerG,koza:goatG,dzik:boarG,wilk:wolfG,zajac:hareG,lis:foxG,foka:sealG,niedzwiedz:bearG};
const animM={},animIdx={};Object.keys(ANIMG).forEach(t=>{animIdx[t]=herdsDef.map((h,i)=>h.type===t?i:-1).filter(i=>i>=0);const m=new THREE.InstancedMesh(ANIMG[t],new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,flatShading:true}),Math.max(1,animIdx[t].length*7));m.castShadow=true;scene.add(m);animM[t]=m});
const penM=new THREE.InstancedMesh(goatG,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,flatShading:true}),80);penM.castShadow=true;scene.add(penM);
const deerOff=[];{const r0=rng(91);for(let k=0;k<herdsDef.length*7+80;k++)deerOff.push({a:r0()*6.28,r:.6+r0()*1.6,ph:r0()*6.28,rot:r0()*6.28})}
// dekoracja
const tuftG=mergeGeos([{g:new THREE.ConeGeometry(.05,.42,3),y:.21,c:W1},{g:new THREE.ConeGeometry(.05,.34,3),y:.17,x:.09,z:.04,c:[.85,.9,.8]},{g:new THREE.ConeGeometry(.05,.3,3),y:.15,x:-.08,z:-.05,c:[.9,.95,.85]},{g:new THREE.ConeGeometry(.04,.26,3),y:.13,x:.02,z:-.1,c:[.8,.85,.75]}]);
const deco={tuft:[],flower:[],pebble:[],drift:[],fern:[],reed:[],heath:[],log:[],snag:[]};const DECO_T=Object.keys(deco);const tileDeco=new Map();
{const RD=rng(SEED+5);const put=(type,k,item)=>{deco[type].push(item);if(!tileDeco.has(k))tileDeco.set(k,[]);tileDeco.get(k).push([type,deco[type].length-1])};
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(!land[k])continue;const h=tileH(i,j),f=forestF(i+.5,j+.5);
  const P=()=>[tcx(i)+(RD()-.5),tcx(j)+(RD()-.5),RD()];
  if(beach[k]){if(RD()<.18)put('pebble',k,P());if(RD()<.03)put('drift',k,P());if(RD()<.3)put('tuft',k,[...P(),2]);continue}
  const bi=biomeOf(i,j);
  if(bi==='high'||(bi==='meadow'&&h>4)){if(RD()<.4)put('heath',k,P());if(RD()<.25)put('heath',k,P())}
  if(h>8.5)continue;
  if(bi==='decid'||bi==='conif'){if(RD()<(bi==='decid'?.3:.16))put('fern',k,P());if(RD()<.012)put('log',k,P());if(bi==='conif'&&RD()<.005)put('snag',k,P())}
  if(bi==='wet'){if(RD()<.6)put('reed',k,P());if(RD()<.3)put('reed',k,P());if(RD()<.008)put('snag',k,P())}
  else if(tileHH(i,j)<.06&&RD()<.25)put('reed',k,P());
  const nT=f<.46?2:1;for(let q=0;q<nT;q++)if(RD()<.7)put('tuft',k,[tcx(i)+(RD()-.5),tcx(j)+(RD()-.5),RD(),f>.52?1:0]);
  if(f<.42&&RD()<.3)put('flower',k,[tcx(i)+(RD()-.5),tcx(j)+(RD()-.5),RD()])}}
const tufts=new THREE.InstancedMesh(tuftG,windify(new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),.35),Math.max(1,deco.tuft.length));
tufts.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,deco.tuft.length)*3),3);tufts.receiveShadow=true;scene.add(tufts);
const flowerG=mergeGeos([{g:new THREE.IcosahedronGeometry(.06,0),y:.2,c:W1},{g:new THREE.IcosahedronGeometry(.055,0),y:.16,x:.12,z:.05,c:W1},{g:new THREE.IcosahedronGeometry(.055,0),y:.14,x:-.08,z:.1,c:W1}]);
const flowers=new THREE.InstancedMesh(flowerG,new THREE.MeshStandardMaterial({roughness:.8}),Math.max(1,deco.flower.length));
flowers.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,deco.flower.length)*3),3);scene.add(flowers);
const pebbles=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.09,0),new THREE.MeshStandardMaterial({color:0x9a958a,roughness:1,flatShading:true}),Math.max(1,deco.pebble.length));scene.add(pebbles);
const drifts=new THREE.InstancedMesh(new THREE.CylinderGeometry(.07,.09,1.2,5),new THREE.MeshStandardMaterial({color:0x9a8670,roughness:1,flatShading:true}),Math.max(1,deco.drift.length));drifts.castShadow=true;scene.add(drifts);
const FLC=[[.9,.82,.3],[.82,.32,.42],[.94,.93,.88],[.55,.48,.85],[.9,.55,.25]];
let dS={g:[.4,.54,.25],winter:false,bloom:true};
const decoHidden=new Set();
function setDeco(type,k){if(DM&&DM[type])return setDeco2(type,k);
 if(type==='tuft'){const[x,z,r,f]=deco.tuft[k];const ti=tileOf(x,z),seen=revAt(ti[0],ti[1])&&!decoHidden.has(ti[1]*N+ti[0])&&tread[ti[1]*N+ti[0]]<.35;const s=seen?(.7+r*.6)*(dS.winter?.6:1):0;
  dummy.position.set(x,Hy(x,z),z);dummy.rotation.set(0,r*6.28,0);dummy.scale.set(s,s,s);dummy.updateMatrix();tufts.setMatrixAt(k,dummy.matrix);
  const v=(.78+r*.4)*(f===1?.72:1),g=f===2?[.66,.64,.46]:dS.g;tmpC.setRGB(L(g[0]*v*1.05),L(g[1]*v*1.1),L(g[2]*v));tufts.setColorAt(k,tmpC)}
 else if(type==='flower'){const[x,z,r]=deco.flower[k];const ti=tileOf(x,z),s=revAt(ti[0],ti[1])&&dS.bloom&&!decoHidden.has(ti[1]*N+ti[0])?.9+r*.4:0;dummy.position.set(x,Hy(x,z),z);dummy.rotation.set(0,r*9,0);dummy.scale.set(s,s,s);dummy.updateMatrix();flowers.setMatrixAt(k,dummy.matrix);
  const c=FLC[(r*FLC.length)|0];tmpC.setRGB(L(c[0]),L(c[1]),L(c[2]));flowers.setColorAt(k,tmpC)}
 else if(type==='pebble'){const[x,z,r]=deco.pebble[k];const ti=tileOf(x,z),s=revAt(ti[0],ti[1])?.6+r:0;dummy.position.set(x,Hy(x,z)+.02,z);dummy.rotation.set(r*3,r*6,0);dummy.scale.set(s,s*.6,s);dummy.updateMatrix();pebbles.setMatrixAt(k,dummy.matrix)}
 else{const[x,z,r]=deco.drift[k];const ti=tileOf(x,z),s=revAt(ti[0],ti[1])&&!decoHidden.has(ti[1]*N+ti[0])?.8+r*.6:0;dummy.position.set(x,Hy(x,z)+.06,z);dummy.rotation.set(Math.PI/2,0,r*6.28);dummy.scale.set(s,s,s);dummy.updateMatrix();drifts.setMatrixAt(k,dummy.matrix)}}
const fernG=mergeGeos([0,1,2,3,4,5].map(q=>({g:new THREE.BoxGeometry(.05,.012,.42).translate(0,0,.21),y:.12,c:q%2?[.9,.95,.88]:W1,rx:-.55,ry:q*1.05+.2})));
const reedG=mergeGeos([{g:new THREE.CylinderGeometry(.012,.016,.9,3),y:.45,c:W1},{g:new THREE.CylinderGeometry(.012,.016,.75,3),y:.37,x:.08,z:.03,c:[.9,.9,.85]},{g:new THREE.CylinderGeometry(.012,.016,.8,3),y:.4,x:-.06,z:.07,c:W1},{g:new THREE.CylinderGeometry(.012,.016,.65,3),y:.32,x:.02,z:-.08,c:[.85,.9,.8]},{g:new THREE.CylinderGeometry(.03,.03,.14,5),y:.82,c:[.42,.26,.14]},{g:new THREE.CylinderGeometry(.028,.028,.12,5),y:.72,x:-.06,z:.07,c:[.42,.26,.14]}]);
const heathG=mergeGeos([{g:new THREE.SphereGeometry(.16,6,4),y:.08,c:W1,s:[1.2,.6,1.1]},{g:new THREE.SphereGeometry(.12,6,4),y:.08,x:.16,z:.06,c:[.9,.9,.9],s:[1.1,.6,1]},{g:new THREE.SphereGeometry(.11,6,4),y:.07,x:-.12,z:.1,c:[.82,.82,.82],s:[1.1,.6,1]}]);
const logG=mergeGeos([{g:new THREE.CylinderGeometry(.11,.13,1.3,7),y:.1,c:[.42,.33,.24],rz:Math.PI/2},{g:new THREE.BoxGeometry(.9,.04,.14),y:.2,c:[.36,.48,.26]},{g:new THREE.CylinderGeometry(.04,.05,.35,5),y:.22,x:.3,z:.05,c:[.4,.31,.22],rx:.9}]);
const snagG=mergeGeos([{g:new THREE.CylinderGeometry(.05,.11,2.4,6),y:1.2,c:[.55,.52,.47]},{g:new THREE.CylinderGeometry(.025,.04,.7,4),y:1.6,x:.22,c:[.5,.47,.42],rz:-.9},{g:new THREE.CylinderGeometry(.02,.035,.5,4),y:1.9,x:-.16,c:[.5,.47,.42],rz:.8},{g:new THREE.CylinderGeometry(.11,.14,.1,6),y:.04,c:[.4,.36,.3]}]);
const mkI=(g,n,o)=>{const m=new THREE.InstancedMesh(g,new THREE.MeshStandardMaterial(Object.assign({vertexColors:true,roughness:1},o||{})),Math.max(1,n));m.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1,n)*3),3);scene.add(m);return m};
const ferns=mkI(fernG,deco.fern.length,{side:THREE.DoubleSide}),reeds=mkI(reedG,deco.reed.length),heaths=mkI(heathG,deco.heath.length),logsD=mkI(logG,deco.log.length),snags=mkI(snagG,deco.snag.length);
logsD.castShadow=snags.castShadow=true;windify(ferns.material,.5);windify(reeds.material,.09);windify(flowers.material,.4);
const DM={fern:ferns,reed:reeds,heath:heaths,log:logsD,snag:snags};
const SFERN=[[.32,.46,.24],[.62,.46,.22],[.4,.34,.26],[.36,.52,.26]],SREED=[[.5,.56,.32],[.66,.58,.36],[.66,.6,.48],[.46,.56,.3]],SHEATH=[[.56,.36,.56],[.48,.34,.42],[.4,.36,.34],[.34,.4,.28]];
function setDeco2(type,k){const[x,z,r]=deco[type][k];const ti=tileOf(x,z),tk=ti[1]*N+ti[0];const seen=revAt(ti[0],ti[1])&&!decoHidden.has(tk)&&!(tread&&tread[tk]>.45);const m=DM[type];let s=seen?(.75+r*.5):0,c=[.5,.5,.5];
 if(type==='fern'){if(dS.winter)s*=.0;c=seasonCol(SFERN,curYd)}else if(type==='reed'){c=seasonCol(SREED,curYd);s*=1.1}else if(type==='heath'){c=seasonCol(SHEATH,curYd)}else c=[1,1,1];
 dummy.position.set(x,Hy(x,z)-.01,z);dummy.rotation.set(0,r*6.28,0);dummy.scale.set(s,s*(type==='reed'?.8+r*.5:1),s);dummy.updateMatrix();m.setMatrixAt(k,dummy.matrix);const v=.85+r*.3;tmpC.setRGB(L(c[0]*v),L(c[1]*v),L(c[2]*v));m.setColorAt(k,tmpC)}
const decoMeshes=[tufts,flowers,pebbles,drifts,ferns,reeds,heaths,logsD,snags];
function decoSeason(){dS={g:seasonCol(SG,curYd),winter:curYd>=48&&curYd<72,bloom:(curYd<24||curYd>=76)}}
function refreshDeco(){decoSeason();for(const t of DECO_T)for(let k=0;k<deco[t].length;k++)setDeco(t,k);decoMeshes.forEach(m=>{m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true})}
const nodeMeshes=[...Object.values(crownM),...Object.values(trunkM),ziolaM,ulM,rocks,bushes,berries,mushM,clays,zbozeM,lenM,rudaM,rudaPool];
function nodeSet(n){if(n.type==='tree')setTree(n);else if(n.type==='rock')setRock(n);else if(n.type==='bush')setBush(n);else if(n.type==='grzyb')setMush(n);else if(n.type==='clay')setClay(n);else if(n.type==='zboze')setZboze(n);else if(n.type==='len')setLen(n);else if(n.type==='ruda')setRuda(n);else if(n.type==='ziola')setZiola(n);else if(n.type==='ul')setUl(n);else if(n.type==='fish')n.rip.visible=revAt(n.stand[0],n.stand[1])}
function refreshNodes(){nodes.forEach(nodeSet);nodeMeshes.forEach(m=>{m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true})}
function nodeVis(n){nodeSet(n);nodeMeshes.forEach(m=>{m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true})}

/* ================= modele ================= */
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.95,flatShading:true},o||{}));
function mesh(g,m,x,y,z,rx,ry,rz){const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);if(rx)o.rotation.x=rx;if(ry)o.rotation.y=ry;if(rz)o.rotation.z=rz;o.castShadow=true;o.receiveShadow=true;return o}
const matWood=M(0x7a5a3c),matDark=M(0x3e2e20),matLog=M(0x86663f),matLog2=M(0x6d5034),matCanvas=M(0xcdbd9c),matStone=M(0x95928a),matThatch=M(0x7a6c42),matBrick=M(0xa65f3e),matTile=M(0xbd7656),matMoss=M(0x5d7040),matBone=M(0xe0dac8),matHide=M(0x9a7452),matWin=M(0xe8b060,{emissive:0x664018});
const glowTex=(function(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,32);g.addColorStop(0,'rgba(255,205,130,1)');g.addColorStop(.35,'rgba(255,140,50,.55)');g.addColorStop(1,'rgba(255,100,20,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const softTex=(function(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const fires=[];
function makeFire(parent,x,y,z,small){const g=new THREE.Group();g.position.set(x,y,z);
 for(let k=0;k<8;k++){const a=k/8*6.28;g.add(mesh(new THREE.DodecahedronGeometry(.13,0),matStone,Math.cos(a)*.36,.07,Math.sin(a)*.36))}
 g.add(mesh(new THREE.CylinderGeometry(.05,.05,.55,5),matDark,0,.1,0,0,.6,1.3));g.add(mesh(new THREE.CylinderGeometry(.05,.05,.55,5),matDark,0,.1,0,0,-.6,1.3));
 const fl=new THREE.Mesh(new THREE.ConeGeometry(.17,.55,6),new THREE.MeshBasicMaterial({color:0xffa040,toneMapped:false}));fl.position.y=.33;g.add(fl);
 const fl2=new THREE.Mesh(new THREE.ConeGeometry(.09,.35,5),new THREE.MeshBasicMaterial({color:0xfff0a0,toneMapped:false}));fl2.position.y=.28;g.add(fl2);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));sp.scale.set(2.6,2.6,1);sp.position.y=.5;g.add(sp);
 parent.add(g);fires.push({g,fl,fl2,sp});return g}
/* ---- faktury proceduralne ---- */
function ctex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
const RT=rng(4242);
const TX={
 logs:ctex(128,128,(x,w,h)=>{const n=6,rh=h/n;for(let i=0;i<n;i++){const y=i*rh;const g=x.createLinearGradient(0,y,0,y+rh);const b=150+RT()*30;g.addColorStop(0,`rgb(${b*.55|0},${b*.42|0},${b*.3|0})`);g.addColorStop(.35,`rgb(${b*.85|0},${b*.66|0},${b*.45|0})`);g.addColorStop(1,`rgb(${b*.42|0},${b*.31|0},${b*.21|0})`);x.fillStyle=g;x.fillRect(0,y,w,rh);
  x.strokeStyle='rgba(40,25,15,.35)';x.lineWidth=1;for(let k=0;k<5;k++){x.beginPath();const yy=y+3+RT()*(rh-6);x.moveTo(RT()*w*.3,yy);x.lineTo(w*.5+RT()*w*.5,yy+RT()*2-1);x.stroke()}
  for(let k=0;k<2;k++){x.fillStyle='rgba(45,30,18,.5)';x.beginPath();x.ellipse(RT()*w,y+rh*.5,2+RT()*2,1.5,0,0,6.3);x.fill()}}
  x.fillStyle='rgba(20,12,6,.55)';for(let i=0;i<=n;i++)x.fillRect(0,i*rh-1,w,2)}),
 planks:ctex(128,128,(x,w,h)=>{const n=6,pw=w/n;for(let i=0;i<n;i++){const b=140+RT()*40;x.fillStyle=`rgb(${b*.78|0},${b*.6|0},${b*.42|0})`;x.fillRect(i*pw,0,pw,h);
  x.strokeStyle='rgba(60,40,25,.3)';for(let k=0;k<6;k++){x.beginPath();const xx=i*pw+2+RT()*(pw-4);x.moveTo(xx,0);x.bezierCurveTo(xx+3,h*.3,xx-3,h*.6,xx+1,h);x.stroke()}
  x.fillStyle='rgba(25,15,8,.7)';x.fillRect(i*pw,0,1.5,h);x.fillStyle='rgba(30,30,30,.8)';x.fillRect(i*pw+pw/2-1,8,2,2);x.fillRect(i*pw+pw/2-1,h-10,2,2)}}),
 thatch:ctex(128,128,(x,w,h)=>{x.fillStyle='#8a7442';x.fillRect(0,0,w,h);for(let k=0;k<900;k++){const xx=RT()*w,yy=RT()*h,l=8+RT()*16;const b=110+RT()*90;x.strokeStyle=`rgba(${b|0},${b*.82|0},${b*.45|0},.8)`;x.lineWidth=1+RT();x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+RT()*3-1.5,yy+l);x.stroke()}
  x.fillStyle='rgba(40,30,15,.35)';for(let i=0;i<4;i++)x.fillRect(0,i*32+28,w,4)}),
 stone:ctex(128,128,(x,w,h)=>{x.fillStyle='#4a4842';x.fillRect(0,0,w,h);let y=0;while(y<h){const rh=14+RT()*12;let xx=-RT()*20;while(xx<w){const rw=18+RT()*22;const b=110+RT()*60;x.fillStyle=`rgb(${b|0},${b*.97|0},${b*.9|0})`;x.beginPath();x.roundRect?x.roundRect(xx+1.5,y+1.5,rw-3,rh-3,5):x.rect(xx+1.5,y+1.5,rw-3,rh-3);x.fill();
   x.fillStyle='rgba(255,255,255,.08)';x.fillRect(xx+3,y+3,rw-8,3);xx+=rw}y+=rh}}),
 canvas:ctex(64,64,(x,w,h)=>{x.fillStyle='#d6c7a6';x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,100,70,.15)';for(let i=0;i<w;i+=2){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}
  for(let k=0;k<5;k++){x.fillStyle=`rgba(110,85,50,${.08+RT()*.1})`;x.beginPath();x.arc(RT()*w,RT()*h,4+RT()*10,0,6.3);x.fill()}}),
 shingle:ctex(128,128,(x,w,h)=>{x.fillStyle='#3a3026';x.fillRect(0,0,w,h);const rh=16,sw=14;for(let r=0;r<h/rh;r++)for(let c=-1;c<w/sw+1;c++){const b=95+RT()*45;x.fillStyle=`rgb(${b|0},${b*.84|0},${b*.68|0})`;x.fillRect(c*sw+(r%2)*sw/2+1,r*rh,sw-2,rh-2);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(c*sw+(r%2)*sw/2+1,r*rh+rh-5,sw-2,3)}}),
 wattle:ctex(64,64,(x,w,h)=>{x.fillStyle='#4a3826';x.fillRect(0,0,w,h);for(let r=0;r<8;r++){const b=110+RT()*40;x.strokeStyle=`rgb(${b|0},${b*.78|0},${b*.55|0})`;x.lineWidth=5;x.beginPath();for(let xx=0;xx<=w;xx+=4)x.lineTo(xx,r*8+4+Math.sin(xx/8*Math.PI+r)*2);x.stroke()}x.fillStyle='#3a2a1a';for(let c=0;c<4;c++)x.fillRect(c*16+6,0,4,h)}),
 brick:ctex(128,128,(x,w,h)=>{x.fillStyle='#6a5a4a';x.fillRect(0,0,w,h);const bh=12,bw=28;for(let r=0;r<h/bh;r++)for(let c=-1;c<w/bw+1;c++){const b=150+RT()*50;x.fillStyle=`rgb(${b|0},${b*.55|0},${b*.38|0})`;x.fillRect(c*bw+(r%2)*bw/2+1,r*bh+1,bw-2,bh-2)}})
};
function TM(t,col,o){return new THREE.MeshStandardMaterial(Object.assign({map:t,color:col||0xffffff,roughness:.95},o||{}))}
const mShingle=TM(TX.shingle),mWattle=TM(TX.wattle),mLantern=new THREE.MeshStandardMaterial({color:0x2a2018,emissive:0xffb050,emissiveIntensity:0,roughness:.6});
const mLogsD=TM(TX.logs,0xb4a490),mLogsG=TM(TX.logs,0xb0b0a8),mThatchOld=TM(TX.thatch,0x9a9a7a),mPlankG=TM(TX.planks,0xb4aea4);
const mLogs=TM(TX.logs),mPlank=TM(TX.planks),mPlankD=TM(TX.planks,0x9a8a7a),mThatch=TM(TX.thatch),mStone=TM(TX.stone),mCanvas=TM(TX.canvas,0xffffff,{side:THREE.DoubleSide}),mBrick=TM(TX.brick);
const mWin=new THREE.MeshStandardMaterial({color:0x2a2018,emissive:0xffb050,emissiveIntensity:0,roughness:.6});
const mGlow=new THREE.MeshBasicMaterial({color:0xff8a3a,toneMapped:false});
/* prostopadłościan z UV w skali świata */
function tbox(w,h,d,mat,x,y,z,ry,sc){const g=new THREE.BoxGeometry(w,h,d);const uv=g.attributes.uv,s=sc||1;const dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
 for(let f=0;f<6;f++)for(let v=0;v<4;v++){const k=f*4+v;uv.setXY(k,uv.getX(k)*dims[f][0]*s,uv.getY(k)*dims[f][1]*s)}
 const m=new THREE.Mesh(g,mat);m.position.set(x||0,y||0,z||0);if(ry)m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;return m}
/* dach dwuspadowy z okapem */
function gable(w,d,h,mat,y,over,sc){over=over===undefined?.25:over;const W=w/2+over,D=d/2+over,s=sc||1.2;
 const P=[-W,0,-D, W,0,-D, 0,h,-D, -W,0,D, W,0,D, 0,h,D];
 const tri=[[0,5,2,0,3,5],[1,5,4,1,2,5],[0,2,1],[3,4,5]];const pos=[],uvs=[];const sl=Math.hypot(W,h);
 const add=(ids,uvf)=>ids.forEach(i=>{pos.push(P[i*3],P[i*3+1],P[i*3+2]);uvs.push(...uvf(i))});
 add(tri[0],i=>[(P[i*3+2]+D)*s,(i===2||i===5?sl:0)*s]);add(tri[1],i=>[(P[i*3+2]+D)*s,(i===2||i===5?sl:0)*s]);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.computeVertexNormals();
 const m=new THREE.Mesh(geo,mat);m.position.y=y;m.castShadow=true;m.receiveShadow=true;
 const gp=[],gu=[];[[0,1,2],[3,5,4]].forEach(t=>t.forEach(i=>{gp.push(P[i*3]*(w/2)/W,P[i*3+1]*.98,P[i*3+2]>0?d/2:-d/2);gu.push((P[i*3]+W)*s*.8,P[i*3+1]*s*.8)}));
 const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(gp,3));gg.setAttribute('uv',new THREE.Float32BufferAttribute(gu,2));gg.computeVertexNormals();
 const gm=new THREE.Mesh(gg,mPlankD);gm.material=new THREE.MeshStandardMaterial({map:TX.planks,color:0xa08a70,side:THREE.DoubleSide,roughness:.95});gm.position.y=y;gm.castShadow=true;
 const grp=new THREE.Group();grp.add(m,gm);const rp=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,D*2+.1,6),matLog2);rp.rotation.x=Math.PI/2;rp.position.set(0,y+h+.02,0);rp.castShadow=true;grp.add(rp);return grp}
function cyl(r,h,mat,x,y,z,rx,ry,rz,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg||7),mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;m.receiveShadow=true;return m}
function woodpile(g,x,z,n,ry){const p=new THREE.Group();for(let k=0;k<n;k++){const row=(k/5)|0,col=k%5;p.add(cyl(.08,.6,matLog,(col-2)*.17+(row%2)*.08,.08+row*.15,0,0,0,Math.PI/2,6))}p.position.set(x,0,z);p.rotation.y=ry||0;g.add(p)}
function barrel(g,x,z,s){const b=cyl(.17*(s||1),.42*(s||1),mPlank,x,.21*(s||1),z,0,0,0,10);g.add(b);g.add(cyl(.175*(s||1),.03,M(0x3a3632),x,.12*(s||1),z,0,0,0,10),cyl(.175*(s||1),.03,M(0x3a3632),x,.32*(s||1),z,0,0,0,10))}
function crate(g,x,z,r){g.add(tbox(.42,.36,.42,mPlank,x,.18,z,r||0,1.5))}
function door(g,x,z,ry,w,h){w=w||.46;h=h||.78;const d=new THREE.Group();d.position.set(x,0,z);d.rotation.y=ry||0;d.add(tbox(w,h,.06,mPlankD,0,h/2,0,0,1.6));
 d.add(tbox(.07,h+.06,.08,matLog2,-w/2-.03,h/2,.02),tbox(.07,h+.06,.08,matLog2,w/2+.03,h/2,.02),tbox(w+.16,.08,.09,matLog2,0,h+.04,.02));
 d.add(tbox(.03,.03,.03,M(0x2a2a2a),w/2-.1,h*.5,.05));d.add(mesh(new THREE.BoxGeometry(w+.25,.07,.3),matStone,0,.035,.2));g.add(d);return d}
function lantern(g,x,y,z){g.add(tbox(.03,.18,.03,matDark,x,y+.1,z));const l=new THREE.Mesh(new THREE.BoxGeometry(.1,.13,.1),mLantern);l.position.set(x,y-.05,z);g.add(l)}
function logEnds(g,w,d,h,y0){for(const sx of[-1,1])for(const sz of[-1,1])for(let y=y0+.1,q=0;y<y0+h;y+=.19,q++){if(q%2)g.add(cyl(.075,.34,matLog,sx*(w/2+.06),y,sz*d/2,0,0,Math.PI/2,6));else g.add(cyl(.075,.34,matLog,sx*w/2,y,sz*(d/2+.06),Math.PI/2,0,0,6))}}
function stones(g,w,d){const r0=rng((w*97+d*31)|0);for(let k=0;k<10;k++){const a=r0(),side=(r0()*4)|0;const x=side<2?(a-.5)*w:(side===2?-1:1)*w/2,z=side<2?(side?1:-1)*d/2:(a-.5)*d;g.add(mesh(new THREE.DodecahedronGeometry(.09+r0()*.06,0),matStone,x*1.02,.06,z*1.02,r0()*3,r0()*3,0))}}
function garden(g,x,z,w,d){g.add(tbox(w,.05,d,M(0x4a3524),x,.03,z));for(let r=0;r<3;r++)for(let c=0;c<4;c++)g.add(mesh(new THREE.SphereGeometry(.09,6,4),M(r%2?0x6a8a3a:0x5a7a40),x-w/2+.2+c*(w-.4)/3,.09,z-d/2+.18+r*(d-.36)/2));
 g.add(tbox(w+.1,.28,.04,mWattle,x,.14,z+d/2+.04,0,2),tbox(.04,.28,d,mWattle,x-w/2-.03,.14,z,0,2),tbox(.04,.28,d,mWattle,x+w/2+.03,.14,z,0,2))}
function laundry(g,x,z,ry){const l=new THREE.Group();l.position.set(x,0,z);l.rotation.y=ry||0;l.add(cyl(.03,1,matDark,-.6,.5,0,0,0,0,5),cyl(.03,1,matDark,.6,.5,0,0,0,0,5),cyl(.008,1.2,M(0xcfc6b0),0,.95,0,0,0,Math.PI/2,3));
 [[-.35,0xc9bd9c],[0,0x8a6a4c],[.32,0x6a7a8a]].forEach(([px,c])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(.24,.3),M(c,{side:THREE.DoubleSide}));p.position.set(px,.78,0);l.add(p)});g.add(l)}
function sack(g,x,z,s){const m=mesh(new THREE.SphereGeometry(.16*(s||1),7,5),mCanvas,x,.15*(s||1),z);m.scale.y=1.25;g.add(m)}
function win(g,x,y,z,ry){const w=new THREE.Group();w.position.set(x,y,z);w.rotation.y=ry||0;w.add(tbox(.38,.34,.05,matDark,0,0,0));const p=new THREE.Mesh(new THREE.PlaneGeometry(.26,.22),mWin);p.position.z=.03;w.add(p);
 w.add(tbox(.03,.24,.02,matDark,0,0,.04),tbox(.26,.03,.02,matDark,0,0,.04));w.add(tbox(.46,.04,.1,mPlank,0,-.19,.04,0,2));
 w.add(tbox(.14,.32,.03,mPlankD,-.27,0,.04,0,2),tbox(.14,.32,.03,mPlankD,.27,0,.04,0,2));g.add(w)}
function logHouse(g,w,d,h,opt){opt=opt||{};g.add(tbox(w+.14,.3,d+.14,mStone,0,.15,0,0,.9));stones(g,w+.2,d+.2);g.add(tbox(w,h,d,opt.logs||[mLogs,mLogs,mLogsD,mLogsG][(VR()*4)|0],0,.3+h/2,0,0,1.1));
 logEnds(g,w,d,h,.3);if(opt.lamp!==false)lantern(g,(opt.dx||0)+.4,.3+h*.78,d/2+.12);
 const r=gable(w,d,opt.rh||h*.85,opt.roof||(VR()<.35?mThatchOld:mThatch),.3+h,opt.over===undefined?.32:opt.over);g.add(r);door(g,opt.dx||0,d/2+.04,0);
 if(opt.win!==false){win(g,w/2-.5,.3+h*.6,d/2+.04);if(w>1.8)win(g,-w/2+.5,.3+h*.6,d/2+.04);if(opt.sidewin)win(g,w/2+.04,.3+h*.6,0,Math.PI/2)}
 if(opt.chim){const ch=1.0+(opt.rh||h*.85)*.5;g.add(tbox(.36,ch,.36,opt.chimM||mStone,opt.chim,.3+h+.3,-d*.2,0,1.2));g.add(tbox(.46,.07,.46,matStone,opt.chim,.3+h+.3+ch/2+.03,-d*.2))}}
function plankHut(g0,w,d,h,opt){opt=opt||{};const g=new THREE.Group();g0.add(g);g.add(tbox(w+.08,.16,d+.08,mStone,0,.08,0,0,.9));g.add(tbox(w,h,d,VR()<.35?mPlankG:mPlank,0,.16+h/2,0,0,1.2));for(const sx of[-1,1])for(const sz of[-1,1])g.add(tbox(.1,h+.02,.1,matLog2,sx*w/2,.16+h/2,sz*d/2));
 g.add(tbox(w+.04,.08,.06,matLog2,0,.16+h-.04,d/2+.02));g.add(gable(w,d,opt.rh||h*.8,opt.roof||(VR()<.3?mThatchOld:mThatch),.16+h,opt.over===undefined?.28:opt.over));door(g,opt.dx||0,d/2+.04,0);if(opt.win)win(g,w/2-.38,.16+h*.6,d/2+.04);if(opt.lamp)lantern(g,(opt.dx||0)+.36,.16+h*.8,d/2+.1);return g}
function shed(g,w,d,h,roof){for(const sx of[-1,1])for(const sz of[-1,1])g.add(tbox(.1,h,.1,matDark,sx*(w/2-.05),h/2,sz*(d/2-.05)));g.add(gable(w,d,h*.45,roof||mThatch,h,.15))}
function rack(g,x,z,ry,hang){const r=new THREE.Group();r.add(tbox(.06,.9,.06,matDark,-.4,.45,0),tbox(.06,.9,.06,matDark,.4,.45,0),cyl(.025,.9,matDark,0,.85,0,0,0,Math.PI/2,5));hang(r);r.position.set(x,0,z);r.rotation.y=ry||0;g.add(r)}
function rowboat(g,x,z,ry){const b=new THREE.Group();const hull=new THREE.Mesh(new THREE.CylinderGeometry(.32,.18,1.5,10,1,true,0,Math.PI),M(0x6a4a30,{side:THREE.DoubleSide}));hull.rotation.set(0,0,Math.PI/2);hull.rotation.x=Math.PI/2;hull.rotation.order='ZXY';
 const h2=new THREE.Mesh(new THREE.CylinderGeometry(.33,.2,1.5,10,1,false,Math.PI,Math.PI),M(0x5a3a22));h2.rotation.z=Math.PI/2;b.add(h2);b.add(tbox(.08,.05,.5,mPlank,0,.0,0));b.add(cyl(.02,1.1,matWood,.2,.05,.15,0,.3,Math.PI/2.2,4));b.position.set(x,-.02,z);b.rotation.y=ry||0;b.traverse(o=>{o.castShadow=true});g.add(b)}
function makeBuildingModel(kind,bb){const g=new THREE.Group();VR=rng(bb?bb.id*7919+13:Math.floor(Math.random()*1e6));if(newModel(kind,g)){if(bb)addBldVisuals(g,bb);return g}
 if(kind==='szalas'){const t=gable(1.4,1.7,1.3,mCanvas,0,.12);g.add(t);for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.012,1.0,M(0xcfc6b0),sx*1.05,.32,sz*.75,0,0,sx*-.9,3),cyl(.025,.25,matDark,sx*1.42,.1,sz*.75,0,0,0,4));rack(g,-1.25,.2,Math.PI/2,r=>{const h=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),M(0x9a7452,{side:THREE.DoubleSide}));h.position.y=.55;r.add(h)});for(const z of[-.95,.95])g.add(cyl(.04,1.5,matDark,0,.72,z,0,0,0,5));g.add(cyl(.035,2.1,matDark,0,1.32,0,Math.PI/2,0,0,5));
  g.add(tbox(.9,.12,1.2,M(0x7a6a4a),0,.06,-.1));barrel(g,.85,.7,.8);g.add(cyl(.12,.02,matStone,-.9,.02,.9,0,0,0,8));woodpile(g,-.9,-.6,5,1.2)}
 else if(kind==='chata'){logHouse(g,2.5,1.6,1.15,{chim:-.85,dx:.35,sidewin:true,roof:VR()<.5?mShingle:mThatch});woodpile(g,1.6,-.2,10,Math.PI/2);g.add(tbox(.25,.9,1.3,mPlankD,1.62,.6,-.2));barrel(g,-1.5,.8);g.add(tbox(.9,.08,.25,mPlank,-.5,.42,1.15));g.add(tbox(.08,.4,.2,matDark,-.85,.2,1.15),tbox(.08,.4,.2,matDark,-.15,.2,1.15));
  if(VR()<.6)laundry(g,1.0,1.4,.2);g.add(cyl(.12,.18,mPlank,-1.25,.09,1.1,0,0,0,8))}
 else if(kind==='zbieracz'){plankHut(g,1.5,1.25,.95,{win:true,lamp:true});rack(g,-1.05,.55,Math.PI/2,r=>{for(let k=0;k<4;k++){const b=new THREE.Mesh(new THREE.ConeGeometry(.07,.22,5),M(k%2?0x7a6a9a:0xb0a050));b.position.set(0,.66,-.27+k*.18);b.rotation.x=Math.PI;r.add(b)}});for(let k=0;k<3;k++){g.add(cyl(.17,.2,M(0x9a7a4a),1.0,.1,-.45+k*.42,0,0,0,9));g.add(cyl(.13,.04,M([0x8a2445,0x7a5030,0x8a6a3a][k]),1.0,.2,-.45+k*.42,0,0,0,9))}
  rack(g,-.2,-.95,0,r=>{for(let k=0;k<5;k++)r.add(new THREE.Mesh(new THREE.ConeGeometry(.06,.25,5),M(0x5a7a3a)).translateX(-.3+k*.15).translateY(.68))})}
 else if(kind==='mysliwy'){logHouse(g,1.6,1.3,.95,{win:false});g.add(tbox(.4,.06,.06,matBone,0,1.22,.72));for(const s of[-1,1])g.add(cyl(.02,.3,matBone,s*.18,1.32,.72,0,0,s*.6,4));
  rack(g,1.15,.1,Math.PI/2,r=>{const hide=new THREE.Mesh(new THREE.PlaneGeometry(.7,.55),M(0x9a7452,{side:THREE.DoubleSide}));hide.position.y=.55;r.add(hide)});g.add(cyl(.02,1.4,matDark,-1.0,.7,.5,0,0,.15,4),cyl(.02,1.4,matDark,-1.05,.7,.3,0,0,.2,4))}
 else if(kind==='pomost'){g.add(tbox(.8,.08,2.4,mPlank,.4,.32,1.0,0,1.5));for(const[x,z]of[[.05,.2],[.75,.2],[.05,1.1],[.75,1.1],[.05,2.0],[.75,2.0]])g.add(cyl(.06,1.2,matDark,x,-.25,z,0,0,0,6));
  plankHut(g,1.1,.9,.75,{}).position.x-=.5;rowboat(g,1.25,1.4,.1);rack(g,-.6,.9,Math.PI/2,r=>{const n=new THREE.Mesh(new THREE.PlaneGeometry(.7,.55,6,5),new THREE.MeshBasicMaterial({color:0x4a4a3a,wireframe:true}));n.position.y=.55;r.add(n)});barrel(g,.4,-.1,.8)}
 else if(kind==='drwal'){logHouse(g,1.5,1.2,.95,{win:false});{const sh=new THREE.Group();sh.add(tbox(.08,.5,.08,matDark,-.25,.25,-.1),tbox(.08,.5,.08,matDark,-.25,.25,.1),tbox(.08,.5,.08,matDark,.25,.25,-.1),tbox(.08,.5,.08,matDark,.25,.25,.1),cyl(.1,.9,matLog,0,.55,0,0,0,Math.PI/2,7));sh.position.set(-.2,0,1.05);g.add(sh)}woodpile(g,1.15,0,15,Math.PI/2);g.add(cyl(.22,.32,matLog2,-1.0,.16,.6,0,0,0,9));g.add(tbox(.04,.45,.04,matDark,-.98,.5,.6,0));g.add(tbox(.18,.1,.04,M(0x555a60,{metalness:.5,roughness:.4}),-.98,.42,.6))}
 else if(kind==='lesnik'){plankHut(g,1.3,1.1,.85,{roof:TM(TX.thatch,0x8aa060)});for(let a=0;a<3;a++)for(let b=0;b<3;b++){g.add(tbox(.25,.06,.25,M(0x4a3420),-.95+a*.32,.03,-.65+b*.32));g.add(new THREE.Mesh(new THREE.ConeGeometry(.08,.28,6),M(0x3f7a3a)).translateX(-.95+a*.32).translateY(.2).translateZ(-.65+b*.32))}barrel(g,.9,.6,.7)}
 else if(kind==='kamien'){logHouse(g,1.3,1.1,.85,{win:false,roof:mPlankD});for(let k=0;k<7;k++)g.add(mesh(new THREE.DodecahedronGeometry(.16+RT()*.08,0),matStone,.85+(k%3)*.18,.12+((k/3)|0)*.16,-.4+(k%2)*.3));g.add(tbox(.5,.3,.35,mStone,-.9,.15,.6,.3,1.5))}
 else if(kind==='glinianka'){plankHut(g,1.1,1.0,.8,{});g.add(cyl(.6,.06,M(0xb36a3c,{roughness:.5}),.55,.03,.55,0,0,0,10));for(let k=0;k<4;k++)g.add(cyl(.09,.2,M(0xb36a3c),-.8+k*.22,.1,.62,0,0,0,8))}
 else if(kind==='drewutnia'){shed(g,1.7,1.2,1.1);for(let r=0;r<4;r++)for(let c=0;c<6;c++)g.add(tbox(.5,.13,.13,mLogs,-.2+(c%2)*.05,.08+r*.14,-.38+c*.15,0,2));g.add(cyl(.22,.3,matLog2,.6,.15,.3,0,0,0,9))}
 else if(kind==='warsztat'){plankHut(g,1.6,1.3,1.0,{win:true,lamp:true,roof:mShingle});g.add(tbox(.9,.08,.45,mPlank,1.05,.5,.1,Math.PI/2));g.add(tbox(.06,.45,.06,matDark,1.05,.25,-.25),tbox(.06,.45,.06,matDark,1.05,.25,.45));g.add(mesh(new THREE.DodecahedronGeometry(.16,0),matStone,1.05,.62,.15));crate(g,-1.0,.6)}
 else if(kind==='szwalnia'){plankHut(g,1.4,1.2,.9,{win:true,lamp:true});laundry(g,-.2,1.2,0);rack(g,1.0,-.1,Math.PI/2,r=>{const c=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),mCanvas);c.position.y=.55;r.add(c)});rack(g,-.9,.75,0,r=>{const h=new THREE.Mesh(new THREE.PlaneGeometry(.5,.45),M(0x9a7452,{side:THREE.DoubleSide}));h.position.y=.55;r.add(h)})}
 else if(kind==='sklad'){shed(g,1.8,1.6,1.0,mShingle);sack(g,-.85,.75);sack(g,-.6,.85,.9);sack(g,-.75,.55,.8);for(let k=0;k<4;k++)crate(g,-.45+(k%2)*.5,-.35+((k/2)|0)*.5,k*.3);barrel(g,.55,.45);barrel(g,.55,-.1);g.add(cyl(.2,.4,mCanvas,-.4,.2,.55,Math.PI/2,0,0,8))}
 else if(kind==='spizarnia'){for(const[x,z]of[[-.65,-.6],[.65,-.6],[-.65,.6],[.65,.6]])g.add(cyl(.09,.6,matLog2,x,.3,z,0,0,0,7));g.add(tbox(1.6,.1,1.5,mPlank,0,.62,0));
  g.add(tbox(1.5,1.0,1.4,mLogs,0,1.17,0,0,1.1));g.add(gable(1.5,1.4,.8,mThatch,1.67,.3));door(g,0,.75,0,.4,.6);g.children[g.children.length-1].position.y=1.0;
  for(let k=0;k<5;k++)g.add(tbox(.5,.04,.06,mPlank,0,.12+k*.13,1.0+k*.06,0));barrel(g,-.9,.9,.8)}
 else if(kind==='cegielnia'){g.add(mesh(new THREE.SphereGeometry(.9,12,8,0,6.283,0,1.6),TM(TX.brick,0xffffff),0,0,0));g.add(tbox(.4,.36,.2,matDark,0,.18,.86));const gl=new THREE.Mesh(new THREE.PlaneGeometry(.3,.26),mGlow);gl.position.set(0,.18,.97);g.add(gl);
  g.add(cyl(.18,1.0,mBrick,.5,1.0,-.2,0,0,0,8));for(let k=0;k<3;k++)g.add(tbox(.5,.12,.25,mBrick,-1.0,.06+k*.12,.3,0,3))}
 else if(kind==='piec'){g.add(tbox(1.5,.9,1.3,mBrick,0,.45,0,0,1.6));g.add(mesh(new THREE.SphereGeometry(.7,10,7,0,6.283,0,1.57),mBrick,0,.9,0));g.add(cyl(.18,1.5,mBrick,.5,1.5,-.3,0,0,0,8));const gl=new THREE.Mesh(new THREE.PlaneGeometry(.4,.3),mGlow);gl.position.set(0,.4,.66);g.add(gl)}
 else if(kind==='pracownia'){shed(g,1.8,1.4,1.1,mPlankD);g.add(tbox(1.2,.12,.35,mLogs,0,.55,0,0,2));g.add(tbox(.06,.55,.06,matDark,-.45,.27,0),tbox(.06,.55,.06,matDark,.45,.27,0));for(let k=0;k<6;k++)g.add(tbox(1.1,.05,.24,mPlank,0,.04+k*.06,.5,0,2))}
 else if(kind==='mielerz'){g.add(mesh(new THREE.SphereGeometry(.95,10,6,0,6.283,0,1.4),M(0x3a332b),0,-.15,0));for(let k=0;k<8;k++)g.add(cyl(.07,.7,matLog2,.95,.08+(k%3)*.13,-.6+((k/3)|0)*.3,0,0,Math.PI/2,6))}
 else if(kind==='ruda'){plankHut(g,1.1,1.0,.8,{});g.add(cyl(.6,.05,M(0x4a3a20,{roughness:.3}),.5,.03,.5,0,0,0,10));for(let k=0;k<6;k++)g.add(mesh(new THREE.DodecahedronGeometry(.13,0),M(0x7a4a30),-.75+(k%3)*.2,.1+((k/3)|0)*.14,.7))}
 else if(kind==='kuznia'){g.add(tbox(1.7,.15,1.5,mStone,0,.07,0,0,1));shed(g,1.8,1.6,1.15,mPlankD);g.add(tbox(.7,.7,.6,mStone,-.45,.42,-.35,0,1.4));g.add(tbox(.34,1.4,.34,mStone,-.45,1.4,-.4,0,1.4));
  const gl=new THREE.Mesh(new THREE.BoxGeometry(.4,.06,.35),mGlow);gl.position.set(-.45,.8,-.3);g.add(gl);g.add(tbox(.36,.14,.18,M(0x404448,{metalness:.6,roughness:.35}),.4,.52,.3));g.add(cyl(.13,.36,matLog2,.4,.22,.3,0,0,0,8));barrel(g,.65,-.45,.8)}
 else if(kind==='zagroda'){for(let k=0;k<14;k++){const a=k/14*6.283;g.add(cyl(.05,.7,matDark,Math.cos(a)*1.35,.35,Math.sin(a)*1.35,0,0,0,5))}
  for(let k=0;k<14;k++){const a=(k+.5)/14*6.283;for(const y of[.25,.5])g.add(tbox(.62,.07,.05,mPlank,Math.cos(a)*1.33,y,Math.sin(a)*1.33,-a+Math.PI/2,2))}
  {const hg=plankHut(g,.8,.6,.55,{rh:.35});hg.position.x+=.55;hg.position.z-=.6}g.add(cyl(.32,.35,mThatch,-.55,.18,-.5,0,0,0,9));g.add(tbox(.6,.15,.22,mPlank,-.5,.08,.55,0,2))}
 else if(kind==='studnia'){g.add(cyl(.36,.5,mStone,0,.25,0,0,0,0,12));const wt=new THREE.Mesh(new THREE.CircleGeometry(.29,14),M(0x1a2a30,{roughness:.2}));wt.rotation.x=-Math.PI/2;wt.position.y=.44;g.add(wt);
  g.add(tbox(.08,1.1,.08,matLog2,-.38,.55,0),tbox(.08,1.1,.08,matLog2,.38,.55,0));g.add(cyl(.06,.85,matLog,0,.9,0,0,0,Math.PI/2,7));g.add(gable(.95,.62,.32,mShingle,1.1,.08));
  g.add(cyl(.008,.35,M(0x9a8a6a),0,.72,0,0,0,0,3));g.add(cyl(.08,.13,mPlank,0,.5,0,0,0,0,8));g.add(cyl(.09,.14,mPlank,.5,.07,.25,0,0,0,8))}
 else if(kind==='cmentarz'){g.add(tbox(1.85,.03,1.85,M(0x4a5a34),0,.015,0));
  g.add(tbox(1.9,.3,.04,mWattle,0,.15,.93,0,2),tbox(1.9,.3,.04,mWattle,0,.15,-.93,0,2),tbox(.04,.3,1.9,mWattle,.93,.15,0,0,2),tbox(.04,.3,.7,mWattle,-.93,.15,-.6,0,2),tbox(.04,.3,.7,mWattle,-.93,.15,.6,0,2));
  for(let k=0;k<5;k++){const x=-.45+(k%3)*.45,z=-.4+((k/3)|0)*.7;const mo=mesh(new THREE.SphereGeometry(.22,8,5,0,6.283,0,1.4),M(0x4a3a28),x,0,z);mo.scale.set(.8,.5,1.4);g.add(mo);
   if(k%2)g.add(tbox(.09,.42,.05,matLog2,x,.24,z-.32),tbox(.28,.06,.05,matLog2,x,.34,z-.32));else for(let q=0;q<3;q++)g.add(mesh(new THREE.DodecahedronGeometry(.07-q*.015,0),matStone,x,.06+q*.08,z-.32));
   g.add(mesh(new THREE.SphereGeometry(.04,5,4),M([0xd8c060,0xe8e4d8,0xa0609a][k%3]),x+.08,.1,z+.05))}
  g.add(tbox(.6,.06,.18,mPlank,.5,.22,.72),tbox(.06,.2,.12,matDark,.27,.1,.72),tbox(.06,.2,.12,matDark,.73,.1,.72))}
 else if(kind==='dom'){logHouse(g,2.6,1.7,1.35,{chim:-.9,chimM:mBrick,dx:.4,sidewin:true,roof:mShingle,rh:1.05});
  g.add(tbox(.08,.95,.08,matLog2,.05,.47,1.25),tbox(.08,.95,.08,matLog2,.75,.47,1.25));{const pr=gable(.9,.5,.25,mShingle,.95,.06);pr.position.set(.4,0,1.1);g.add(pr)}
  g.add(tbox(.9,.08,.25,mPlank,-.55,.42,1.15),tbox(.08,.4,.2,matDark,-.9,.2,1.15),tbox(.08,.4,.2,matDark,-.2,.2,1.15));woodpile(g,1.65,-.3,12,Math.PI/2);barrel(g,1.55,.75);
  for(let k=0;k<3;k++)g.add(mesh(new THREE.SphereGeometry(.05,5,4),M([0xc04050,0xe0c050,0xd8d8f0][k]),-1.3+k*.12,.48,1.14))}
 else if(kind==='pole'){g.add(tbox(3.8,.05,3.8,M(0x5a4228),0,.03,0));for(let k=0;k<7;k++)g.add(tbox(3.6,.07,.18,M(0x4a3420),0,.05,-1.6+k*.53));
  const crops=new THREE.Group();for(let a=0;a<7;a++)for(let b=0;b<6;b++){const c=new THREE.Mesh(new THREE.ConeGeometry(.12,.6,4),M(0x6a8a3a));c.position.set(-1.5+b*.6,.3,-1.6+a*.53);c.castShadow=true;crops.add(c)}g.add(crops);g.userData.crops=crops;
  for(let k=0;k<8;k++)g.add(tbox(.06,.35,.06,matDark,-1.9+k*.54,.17,1.92));g.add(tbox(3.8,.05,.05,matWood,0,.3,1.92))}
 if(bb)addBldVisuals(g,bb);return g}
function scaffold(kind){const d=BD[kind];const g=new THREE.Group();const w=d.w*.92,h=d.h*.92,H=1.6;for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.04,H,matDark,sx*w/2,H/2,sz*h/2,0,0,0,5));
 for(const y of[.6,1.2]){g.add(tbox(w,.05,.06,mPlank,0,y,h/2),tbox(w,.05,.06,mPlank,0,y,-h/2),tbox(.06,.05,h,mPlank,w/2,y,0),tbox(.06,.05,h,mPlank,-w/2,y,0))}
 g.add(tbox(.6,.06,.5,mPlank,w/2+.35,.03,0));g.add(cyl(.07,.7,matLog,w/2+.35,.12,.3,0,0,Math.PI/2,6));return g}

function makeTribeModel(k){const g=new THREE.Group();
 if(k===0){for(let q=0;q<9;q++){const a=q/9*6.28;g.add(mesh(new THREE.BoxGeometry(.32,1.0+((q*7)%3)*.25,.22),matStone,Math.cos(a)*1.6,.45,Math.sin(a)*1.6,0,-a,(q%3-1)*.08))}}
 else if(k===1){g.add(mesh(new THREE.SphereGeometry(1.4,10,6,0,6.283,0,1.4),matMoss,0,-.35,0));g.add(mesh(new THREE.BoxGeometry(.9,.15,.6),matStone,0,.95,0,.1))}
 else if(k===2){g.add(mesh(new THREE.DodecahedronGeometry(1.2,0),matStone,0,.7,0,0,.4));const p=new THREE.Mesh(new THREE.PlaneGeometry(.9,.6),M(0xa5502e,{side:THREE.DoubleSide}));p.position.set(.1,.85,1.02);g.add(p)}
 else if(k===3){for(let q=0;q<10;q++){const a=q/10*6.28;g.add(mesh(new THREE.DodecahedronGeometry(.16,0),M(0x3a3632),Math.cos(a)*.6,.06,Math.sin(a)*.6))}g.add(mesh(new THREE.CylinderGeometry(.5,.5,.04,10),M(0x2a2622),0,.02,0))}
 else if(k===4){g.add(mesh(new THREE.CylinderGeometry(.18,.22,2.4,7),matDark,0,1.2,0,0,0,.08));for(let q=0;q<3;q++)g.add(mesh(new THREE.BoxGeometry(.3,.18,.3),matLog2,0,.8+q*.55,.1))}
 else if(k===5){for(let q=0;q<12;q++)g.add(mesh(new THREE.CylinderGeometry(.04,.04,.6,4),matBone,(q%4)*.3-.45,.04,((q/4)|0)*.35-.35,0,0,Math.PI/2))}
 else if(k===6){for(let q=0;q<8;q++)g.add(mesh(new THREE.TetrahedronGeometry(.12,0),M(0x5a5a5e),(q%4)*.25-.4,.06,((q/4)|0)*.3,q,q*2,0))}
 else{for(let q=0;q<4;q++){const a=q/4*6.28;g.add(mesh(new THREE.CylinderGeometry(.75,.6,.08,10),M(0x3f3a2e),Math.cos(a)*1.7,.0,Math.sin(a)*1.7))}}
 return g}
const bGroup=new THREE.Group(),campG=new THREE.Group(),wreckG=new THREE.Group(),tribeG=new THREE.Group();scene.add(bGroup,campG,wreckG,tribeG);
function buildStatic(){wreckG.clear();campG.clear();tribeG.clear();
 const cx=tcx(camp.i),cz=tcx(camp.j),y=Hy(cx,cz);campG.position.set(cx,y,cz);makeFire(campG,0,0,0);
 for(let k=0;k<4;k++)campG.add(mesh(new THREE.BoxGeometry(.55,.4,.45),matWood,1.25+(k%2)*.55,.2+(k>>1)*.4,.85+(k>>1)*.1,0,k*.3));
 campG.add(mesh(new THREE.BoxGeometry(1.4,.05,1.1),matCanvas,-1.3,.03,.9));
 campG.add(mesh(new THREE.CylinderGeometry(.06,.06,1.5,5),matDark,-1.2,.75,-1.1));campG.add(mesh(new THREE.CylinderGeometry(.06,.06,1.5,5),matDark,-.2,.75,-1.5));
 campG.add(mesh(new THREE.PlaneGeometry(1.4,1.0),M(0xcdbd9c,{side:THREE.DoubleSide}),-.7,1.2,-1.3,-.9,.35,0));
 for(const[x,z,r]of[[.9,-.8,.3],[-.9,.5,1.5],[1.4,-.2,2.4]])campG.add(mesh(new THREE.CylinderGeometry(.13,.13,.9,6),matLog2,x,.13,z,0,r,Math.PI/2));
 const wx=tcx(wreck.i),wz=tcx(wreck.j);wreckG.position.set(wx,-.15,wz);wreckG.rotation.y=Math.atan2(tcx(wreck.stand[0])-wx,tcx(wreck.stand[1])-wz)+Math.PI/2;
 wreckG.add(mesh(new THREE.BoxGeometry(4.6,.55,1.4),matDark,0,.22,0,0,0,.13));
 for(let k=-3;k<=3;k++){wreckG.add(mesh(new THREE.BoxGeometry(.13,1.2,.13),matWood,k*.6,.75,.62,0,0,.1*k));if(k%2)wreckG.add(mesh(new THREE.BoxGeometry(.13,.95,.13),matWood,k*.6,.62,-.62,0,0,-.1*k))}
 wreckG.add(mesh(new THREE.BoxGeometry(2.6,.08,.3),matLog2,-.3,1.2,.62,0,0,.05));
 wreckG.add(mesh(new THREE.CylinderGeometry(.08,.1,3.4,6),matWood,.7,1.6,0,0,0,.72));
 wreckG.add(mesh(new THREE.PlaneGeometry(1.5,1.2),M(0xc6ba9e,{side:THREE.DoubleSide}),1.4,1.5,.05,0,.2,.72));
 tribe.forEach(t=>{const m=makeTribeModel(t.k);const x=tcx(t.i),z=tcx(t.j);m.position.set(x,Hy(x,z),z);m.rotation.y=t.i;m.visible=revAt(t.i,t.j);tribeG.add(m);t.m=m})}

/* ================= osadnicy ================= */
const CLOTH=[0x8a6a4c,0x587a62,0x9a6250,0x586c8e,0x8a805a,0x765676,0x7a9862,0xa07040,0x668888];
// [imię, wiek, płeć, rodzina, umiejętności]
const PEOPLE0=[
 ['Bożydar',38,'m',1,{drwal:3,ciesla:1},'Wytrwały'],['Dobrawa',31,'k',1,{zbieracz:3,rybak:1},'Cierpliwy'],['Wiesia',9,'k',1,{},'Dociekliwy'],['Mirek',8,'m',1,{},'Pogodny'],
 ['Radosław',42,'m',2,{kamieniarz:3,mysliwy:1},'Ostrożny'],['Bogumiła',39,'k',2,{rolnik:2,zbieracz:2},'Dociekliwy'],['Sława',15,'k',2,{zbieracz:1,krawiec:1},'Dociekliwy'],['Mila',6,'k',2,{},'Pogodny'],
 ['Wojsław',45,'m',3,{kowal:2,murarz:1},'Uparty'],['Ludmiła',34,'k',3,{ciesla:3,krawiec:1},'Wytrwały'],['Staś',14,'m',3,{drwal:1},'Pogodny'],['Bolko',5,'m',3,{},'Wytrwały'],['Mira',4,'k',3,{},'Cierpliwy'],
 ['Dobromir',36,'m',4,{ciesla:2,mysliwy:2},'Silny'],['Radomira',29,'k',4,{rybak:3,mysliwy:1},'Ostrożny'],
 ['Lubomir',63,'m',5,{murarz:4,kamieniarz:2},'Nauczyciel'],['Wszebora',58,'k',5,{zbieracz:3,hodowca:2,krawiec:2},'Cierpliwy'],
 ['Jagna',23,'k',6,{krawiec:2,hodowca:1},'Pogodny']];
const PAIRS=[[0,1],[4,5],[8,9],[13,14],[15,16]];
const lvXp=l=>l<=0?0:LVL[l-1];
function newPerson(id,name,age,sex,fam,skills,trait){const sk={},xp={};Object.keys(CN).forEach(c=>{const l=(skills&&skills[c])||0;sk[c]=l;xp[c]=lvXp(l)+(l?10:0)});
 return{id,name,age,sex,fam,pair:null,sk,xp,job:null,wb:null,state:'idle',x:0,z:0,path:null,after:null,tgt:null,carry:null,wt:0,wait:0,mentor:null,cloth:CLOTH[id%CLOTH.length],act:'odpoczywa',trait:trait||TKEYS[(Math.random()*TKEYS.length)|0],
  tool:{t:age>=12?2:0,d:age>=12?60+Math.random()*120:0},coat:70+Math.random()*110,hp:1}}
const isChild=p=>p.age<12;
const isAdult=p=>p.age>=12;
function packRev(){let s='';for(let k=0;k<N*N;k+=8){let b=0;for(let q=0;q<8;q++)if(rev[k+q])b|=1<<q;s+=String.fromCharCode(b)}return btoa(s)}
function unpackRev(str){const s=atob(str);for(let k=0;k<s.length;k++){const b=s.charCodeAt(k);for(let q=0;q<8;q++)rev[k*8+q]=(b>>q)&1}revDirty=true}
function freshState(){
 const st={t:0,day:.27,res:{miod:0,ziola:0,warzywa:0,maka:0,chleb:0,ser:0,kiszonki:0,naczynia:0,suchary:420,jagody:0,grzyby:0,ryby:0,mieso:0,ziarno:0,mleko:0,drewno:22,opal:45,kamien:0,glina:0,deski:0,gwozdzie:0,plotno:0,skory:0,odziez:4,narz:8,narzk:0,cegla:0,ruda:0,wegiel:0,wlokna:0},
  wreck:{parts:JSON.parse(JSON.stringify(WRECK0)),target:-1,gone:0},books:{ciesla:2,zdun:2,dziennik:2,kowal:0,siew:0},readP:{},weather:{k:'clear',left:2},zbozeTot:0,people:[],pid:0,fams:{},fid:7,
  alloc:{zwiad:1,zdun:0,czyt:0},bld:[],nid:1,know:{cegla:'nie',piec:'nie',kuznia:'nie',pole:'nie',cegla_p:0,piec_p:0,kuznia_p:0,cegla_f:0,piec_f:0,kuznia_f:0,active:null},
  bonus:{},hope:.55,health:1,warm:1,hungerDays:0,log:[],nodeAmt:nodes.map(n=>n.amt),grow:{},speed:1,seen:{},found:[],rev:'',tier:0,
  laws:{},cust:{},custQ:[],custLog:{},offices:{},dis:.08,reqs:[],reqNext:4,toolQ:{},thirst:0,tech:{},tp:{},focus:{},bank:{},dxp:{},atlas:{},exps:[],expSize:2,herds:herdsDef.map(h=>({type:h.type,i:h.i,j:h.j,x:tcx(h.i),z:tcx(h.j),tx:tcx(h.i),tz:tcx(h.j),n:Math.max(2,ANIMAL[h.type][1]-1-((h.i+h.j)%2)),max:ANIMAL[h.type][1],tame:0})),born:0,died:0,variety:1,fedR:1,diff:DIFF_SEL};
 PEOPLE0.forEach((d,i)=>{const p=newPerson(st.pid++,d[0],d[1],d[2],d[3],d[4],d[5]);const a=i/18*6.28;p.x=tcx(camp.i)+Math.cos(a)*1.9;p.z=tcx(camp.j)+Math.sin(a)*1.9;st.people.push(p)});
 for(let f=1;f<=6;f++)st.fams[f]={id:f,home:null};
 PAIRS.forEach(([a,b])=>{st.people[a].pair=st.people[b].id;st.people[b].pair=st.people[a].id});
 return st}
function packTread(){let s='';for(let k=0;k<N*N;k++)s+=String.fromCharCode(Math.round(tread[k]*15)+65);return s.replace(/A{3,}/g,m=>'~'+m.length+'~')}
function unpackTread(str){const s=str.replace(/~(\d+)~/g,(m,n)=>'A'.repeat(+n));for(let k=0;k<N*N&&k<s.length;k++)tread[k]=(s.charCodeAt(k)-65)/15}
function save(){try{S.rev=packRev();S.tread=packTread();localStorage.setItem(SAVEKEY,JSON.stringify(S,(k,v)=>(k==='mentor'||k==='tgt'||k==='path'||k==='after')?undefined:v))}catch(e){}}
function load(){try{const s=localStorage.getItem(SAVEKEY);if(!s)return null;const o=JSON.parse(s);if(!o||!o.people||!o.nodeAmt||o.nodeAmt.length!==nodes.length)return null;
 wildFixRes(o);o.people.forEach(p=>{p.path=null;p.tgt=null;p.after=null;p.state='idle';p.carry=null});o.bld.forEach(b=>{b.workers=0});return o}catch(e){return null}}
function log(t){S.log.unshift({d:Math.floor(S.day)+1,t});if(S.log.length>120)S.log.pop()}
const adultsPool=()=>S.people.filter(isWorker);
const pById=id=>S.people.find(p=>p.id===id);
const bById=id=>S.bld.find(b=>b.id===id);
const bDone=b=>b.prog>=b.work;
const bCenter=b=>{const d=BD[b.kind];return{x:tcx(b.i)+(d.w-1)/2,z:tcx(b.j)+(d.h-1)/2}};

/* ===== modele ludzi ===== */
const pGroup=new THREE.Group();scene.add(pGroup);
const skinC=[0xe0b896,0xd0a07c,0xe8c4a2,0xb07e60];const hairC=[0x3a2a1c,0x6b4a2a,0x1e1a17,0x8a6a3a,0xc4bcb0];
const shadowMat=new THREE.MeshBasicMaterial({map:softTex,color:0x000000,transparent:true,opacity:.35,depthWrite:false});
function makePersonMesh(p){const g=new THREE.Group();
 const cl=M(p.cloth),sk=M(skinC[p.id%4]),pants=M(p.sex==='k'?0x5a4a3e:0x46423a);
 const torso=mesh(new THREE.CylinderGeometry(.12,p.sex==='k'?.19:.15,p.sex==='k'?.5:.42,7),cl,0,p.sex==='k'?.55:.58,0);
 const head=mesh(new THREE.SphereGeometry(.105,8,6),sk,0,.9,0);
 const hair=mesh(new THREE.SphereGeometry(.112,8,5,0,6.283,0,p.sex==='k'?1.9:1.4),M(p.age>55?hairC[4]:hairC[p.id%4]),0,.92,-.012);
 const lL=mesh(new THREE.BoxGeometry(.08,.36,.09).translate(0,-.16,0),pants,-.06,.37,0),lR=mesh(new THREE.BoxGeometry(.08,.36,.09).translate(0,-.16,0),pants,.06,.37,0);
 const aL=mesh(new THREE.BoxGeometry(.06,.32,.07).translate(0,-.14,0),cl,-.17,.74,0),aR=mesh(new THREE.BoxGeometry(.06,.32,.07).translate(0,-.14,0),cl,.17,.74,0);
 g.add(torso,head,hair,lL,lR,aL,aR);
 if(p.age>=12&&p.sex==='m'&&p.id%2===0)g.add(mesh(new THREE.CylinderGeometry(.17,.17,.03,10),M(0x5a4630),0,1.0,0),mesh(new THREE.CylinderGeometry(.09,.1,.09,8),M(0x5a4630),0,1.05,0));
 const carry=mesh(new THREE.BoxGeometry(.24,.16,.22),M(0x8a6a40),0,.76,-.2);carry.visible=false;g.add(carry);
 const sh=new THREE.Mesh(new THREE.PlaneGeometry(.8,.8),shadowMat);sh.rotation.x=-Math.PI/2;sh.position.y=.03;g.add(sh);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.32,.4,24),new THREE.MeshBasicMaterial({color:0xf4ead0,transparent:true,opacity:.95,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;g.add(ring);
 g.traverse(o=>{o.userData.pid=p.id});
 g.userData={pid:p.id,carry,torso,lL,lR,aL,aR,ring,sc:0};return g}
let pMesh={};
function personScale(p){return(p.age<12?(.42+p.age*.045):(p.age>55?.95:1))*1.55}
function buildPeopleMeshes(){pGroup.clear();pMesh={};S.people.forEach(addPersonMesh)}
function addPersonMesh(p){const m=makePersonMesh(p);pMesh[p.id]=m;pGroup.add(m);m.scale.setScalar(personScale(p))}
function removePersonMesh(id){const m=pMesh[id];if(m){pGroup.remove(m);delete pMesh[id]}}

/* ===== budynki ===== */
let bMesh={};
function addBuildingMesh(b){const g=makeBuildingModel(b.kind,b);if(g.userData.crops)setTimeout(()=>fieldVis(b),0);const c=bCenter(b);g.position.set(c.x,Hy(c.x,c.z),c.z);g.traverse(o=>{o.userData.bid=b.id});g.userData.bid=b.id;bGroup.add(g);bMesh[b.id]=g;g.scale.y=bDone(b)?1:Math.max(.12,b.prog/b.work);
 if(!bDone(b)){const sc=scaffold(b.kind);sc.position.copy(g.position);bGroup.add(sc);g.userData.scaf=sc}return g}
function levelFootprint(i,j,w,h){let sum=0,c=0;for(let a=0;a<=w;a++)for(let b=0;b<=h;b++){sum+=H[(j+b)*VW+i+a];c++}const m=Math.max(sum/c,.05),pos=tGeo.attributes.position.array;
 for(let a=0;a<=w;a++)for(let b=0;b<=h;b++){const k=(j+b)*VW+i+a;if(BD.pomost&&H[k]<0)continue;H[k]=m;pos[k*3+1]=m}tGeo.attributes.position.needsUpdate=true;tGeo.computeBoundingSphere()}
function placeFootprint(kind,i,j,val){const d=BD[kind];for(let a=0;a<d.w;a++)for(let b=0;b<d.h;b++){occ[(j+b)*N+i+a]=val;decoHidden.add((j+b)*N+i+a)}recomputeWalk();levelFootprint(i,j,d.w,d.h)}
function entryOf(kind,i,j){const d=BD[kind];const cand=[];for(let a=-1;a<=d.w;a++)for(let b=-1;b<=d.h;b++){if(a>=0&&a<d.w&&b>=0&&b<d.h)continue;const x=i+a,y=j+b;if(x>=0&&y>=0&&x<N&&y<N&&walk[y*N+x])cand.push([x,y,Math.hypot(x-camp.i,y-camp.j)])}
 cand.sort((p,q)=>p[2]-q[2]);return cand.length?[cand[0][0],cand[0][1]]:null}
const yday=()=>S?(S.day%YEAR)*96/YEAR:6;
const rday=()=>S.day%YEAR;
function rebuildWorldFromState(){
 bGroup.clear();bMesh={};fires.length=0;decoHidden.clear();
 occ.fill(-1);occ[camp.j*N+camp.i]=999;
 tread.fill(0);for(let dj=-4;dj<=4;dj++)for(let di=-4;di<=4;di++){const d=Math.hypot(di,dj);if(d<4.5){const k=(camp.j+dj)*N+camp.i+di;tread[k]=Math.max(tread[k],.7-d*.13)}}if(S.tread)unpackTread(S.tread);
 rev.fill(0);revNew.length=0;if(S.rev)unpackRev(S.rev);else{reveal(camp.i,camp.j,18);reveal(wreck.stand[0],wreck.stand[1],8)}
 buildStatic();
 S.bld.forEach(b=>{placeFootprint(b.kind,b.i,b.j,b.id);addBuildingMesh(b)});
 recomputeWalk();
 nodes.forEach((n,k)=>{n.amt=S.nodeAmt[k];n.grow=S.grow[k]||0;n.claim=0});
 S.bld.forEach(b=>{const d=BD[b.kind];nodes.forEach(n=>{if(n.type!=='fish'&&n.i>=b.i&&n.i<b.i+d.w&&n.j>=b.j&&n.j<b.j+d.h)n.gone=1})});
 curYd=yday();paintBase(curYd);fogPass(true)}

/* ================= logika ================= */
const tod=()=>S.day%1;
const isWork=()=>{const t=tod();return t>=T0&&t<T1+(law('dlugi')?.05:0)};
const seasonIdx=()=>Math.floor(yday()/24);
const foodTotal=()=>FOOD.reduce((a,k)=>a+(S.res[k]||0),0);
function foodCap(){let c=600;S.bld.forEach(b=>{if(!bDone(b))return;if(BD[b.kind].store)c+=BD[b.kind].cap*(1+.5*(lvOf(b)-1))+(hasExt(b,'dobud')?200:0);if(hasExt(b,'piwnica'))c+=80});return c}
const hasB=k=>S.bld.some(b=>b.kind===k&&bDone(b));
function homeOf(p){const f=S.fams[p.fam];return f&&f.home?bById(f.home):null}
const traitN=(p)=>p.sex==='k'?TRAITS[p.trait][0]:p.trait;
function eff(p){const tool=p.tool.t===2?1:p.tool.t===1?.8:.55;const w=WEATHER[S.weather.k][1]*(S.buff&&S.buff.until>S.day?(S.buff.k==='praca'?1.1:.93):1);return(0.65+0.35*S.hope)*(p.age>=55?.75:p.age<16?.85:1)*(0.6+0.4*p.hp)*tool*w*(p.trait==='Wytrwały'?1.1:1)*(p.trait==='Silny'&&p.job==='wb'?1.06:1)*(p.age<12?.5:1)*(1-Math.max(0,(S.dis||0)-.5)*.5)*(p.hp<.5&&law('kazdy')?.8:1)*(law('u_swoje')?1.06:law('u_wspolne')?.96:1)}
function craftEff(p,c){return 1+0.18*(p.sk[c]||0)+(S.bonus[c]||0)}
function seasonYield(kind){const s=seasonIdx();if(kind==='bush')return[1,.6,0,.7][s];if(kind==='grzyb')return[.8,1.3,0,.4][s];if(kind==='zboze')return[.7,1,0,0][s];if(kind==='len')return[1,.8,0,.4][s];if(kind==='ziola')return[1,.7,0,.6][s];if(kind==='ul')return[1,.8,0,.3][s];if(kind==='fish')return[1,.9,.7,.9][s];return 1}
function gainXp(p,c,dt){let m=1;p.mentor=null;p.worked=1;
 for(const q of S.people){if(q!==p&&q.wb===p.wb&&q.job===p.job&&isAdult(q)&&q.sk[c]>p.sk[c]&&q.sk[c]>=2&&(!p.mentor||q.sk[c]>p.mentor.sk[c]))p.mentor=q}
 if(p.mentor)m=(p.mentor.trait==='Nauczyciel'?2.6:2)*(tech('n_kron')?1.25:1);if(law('npracy'))m*=1.2;if(p.trait==='Dociekliwy')m*=1.25;if(S.offCraft===c&&offHolder('mistrz')&&offHolder('mistrz')!==p)m*=1.25;techXp(DOMC[c],dt*.09);
 const Lv=p.sk[c];const masterOf=Object.keys(CN).filter(q=>p.sk[q]>=3).length;if(Lv===2&&masterOf>=3){p.xp[c]=Math.min(p.xp[c]+dt*m,LVL[2]-1);if(!p.capLog){p.capLog=1;log(p.name+' jest mistrzem w trzech fachach. Na czwarty nie starczy już życia.')}return}
 p.xp[c]+=dt*m;if(Lv<5&&p.xp[c]>=LVL[Lv]){p.sk[c]=Lv+1;log(p.name+' awansuje: '+CN[c]+' '+(Lv+1)+'.');
  if(p.mentor&&p.mentor.sk[c]>=Lv+1&&Lv+1>=2&&(S.bonus[c]||0)<.3&&Math.random()<.2){S.bonus[c]=(S.bonus[c]||0)+.06;log(p.name+' wpada na ulepszenie w fachu '+CN[c]+'. Wszyscy pracują tym szybciej.');toast('Pomysł ucznia: '+CN[c]+' idzie sprawniej')}}}
function inRange(n,b){const c=bCenter(b),r=rOf(b);return Math.hypot(n.x-c.x,n.z-c.z)<=r}
function pickNodeB(p,b){const d=BD[b.kind];let best=null,bd=1e9;
 for(const t of d.nodes){const arr=nodeBy[t];const max=t==='fish'?2:1;
  for(const n of arr){if(n.amt<1-1e-6||n.gone||n.claim>=max||n.bad>S.t||!revAt(n.stand[0],n.stand[1])||seasonYield(t)<=0)continue;if((t==='ziola'&&!tech('u_rozp'))||(t==='ul'&&!tech('u_bart')))continue;if(!inRange(n,b))continue;
   const dd=Math.abs(n.x-p.x)+Math.abs(n.z-p.z);if(dd<bd){bd=dd;best=n}}}
 return best}
function countInRange(kind,i,j){const d=BD[kind];if(!d.r)return null;const c={x:tcx(i)+(d.w-1)/2,z:tcx(j)+(d.h-1)/2};let n=0;
 if(d.nodes){for(const t of d.nodes)for(const q of nodeBy[t]){if(q.amt>=1&&!q.gone&&revAt(q.stand[0],q.stand[1])&&Math.hypot(q.x-c.x,q.z-c.z)<=d.r)n++}}
 else if(kind==='mysliwy'){S.herds.forEach(h=>{if(ANIMAL[h.type][3]&&Math.hypot(h.x-c.x,h.z-c.z)<=d.r+3)n+=h.n})}
 else if(kind==='zagroda'){S.herds.forEach(h=>{if(h.type==='koza'&&Math.hypot(h.x-c.x,h.z-c.z)<=d.r+3)n+=h.n})}
 else if(kind==='lesnik'){for(const q of nodeBy.tree){if(!q.gone&&q.amt<=0&&!(q.grow>0)&&Math.hypot(q.x-c.x,q.z-c.z)<=d.r)n++}}
 return n}
function rangeLabel(kind,n){if(n===null)return'';if(kind==='mysliwy')return`zwierzyny w pobliżu: ${n}`;if(kind==='zagroda')return`dzikich kóz w pobliżu: ${n}`;if(kind==='lesnik')return`pniaków do obsadzenia: ${n}`;const nm={ruda:'złóż rudy',zbieracz:'krzewów, grzybów, zbóż, lnu i ziół',pomost:'łowisk',drwal:'drzew',kamien:'odkrywek kamienia',glinianka:'odsłonięć gliny'}[kind];return`w zasięgu ${nm}: ${n}`}
function go(p,tile,after,tgt){const[sx,sy]=tileOf(p.x,p.z);const path=astar(sx,sy,tile[0],tile[1]);
 if(!path){if(tgt&&tgt.type)tgt.bad=S.t+40;return false}
 p.path=path.map(([i,j])=>({x:tcx(i)+(Math.random()-.5)*.35,z:tcx(j)+(Math.random()-.5)*.35}));p.after=after;p.tgt=tgt||null;p.state='move';if(!p.path.length){p.path=null;onArrive(p)}return true}
function storeTile(p,food){const cands=[[camp.i,camp.j+1]];S.bld.forEach(b=>{const d=BD[b.kind];if(bDone(b)&&d.store&&(d.store==='all'||food)){const e=entryOf(b.kind,b.i,b.j);if(e)cands.push(e)}});
 const[pi,pj]=tileOf(p.x,p.z);let best=cands[0],bd=1e9;cands.forEach(c=>{const d=Math.hypot(c[0]-pi,c[1]-pj);if(d<bd){bd=d;best=c}});return nearestWalk(best[0],best[1])||[camp.i,camp.j+1]}
function release(p){if(p.tgt&&p.tgt.claim>0&&p.tgt.type)p.tgt.claim--;p.tgt=null}
function scoutTarget(p){let best=null,bd=1e9;const i0=tileOf(p.x,p.z);
 for(let t=0;t<16;t++){const a=Math.random()*6.28;
  for(let r=4;r<N;r+=2){const i=Math.round(i0[0]+Math.cos(a)*r),j=Math.round(i0[1]+Math.sin(a)*r);if(i<1||j<1||i>=N-1||j>=N-1)break;const k=j*N+i;
   if(!rev[k]){if(walk[k]&&reach[k]&&r<bd){bd=r;best=[i,j]}break}}}
 return best}
function homeSpot(p){const h=homeOf(p);if(h&&bDone(h)){const e=entryOf(h.kind,h.i,h.j);if(e)return e}
 const a=Math.random()*6.28,r=1.4+Math.random()*1.6;return nearestWalk(...tileOf(tcx(camp.i)+Math.cos(a)*r,tcx(camp.j)+Math.sin(a)*r))}
function wanderNear(p){const h=homeOf(p);const c=h&&bDone(h)?bCenter(h):{x:tcx(camp.i),z:tcx(camp.j)};const a=Math.random()*6.28,r=1.5+Math.random()*3;
 const t=nearestWalk(...tileOf(c.x+Math.cos(a)*r,c.z+Math.sin(a)*r));if(t)go(p,t,'idle',null)}
const wreckLeft=()=>!S.wreck.gone&&S.wreck.parts.some(p=>p.open&&Object.values(p.items).some(v=>v>0));
const wreckTodo=()=>!S.wreck.gone&&(wreckLeft()||(S.wreck.target>=0&&!S.wreck.parts[S.wreck.target].open));
const inSow=()=>{const d=yday(),x=tech('n_kal')?5:0;return d>=72-x||d<10+x};
function planJob(p){
 if(p.fireB){const b=bById(p.fireB);if(!b||!b.fire){p.fireB=null;return false}const e=entryOf(b.kind,b.i,b.j);p.act='biegnie gasić pożar';if(e&&go(p,e,'gasic',b))return true;p.fireB=null;return false}
 if(!isWorker(p)){p.act=p.age<3?'raczkuje przy domu':'bawi się';if(Math.random()<.5)wanderNear(p);return true}
 if(p.hp<.5&&law('odpoczynek')&&p.job!=='wyp'){p.act='odpoczywa, wraca do zdrowia';wanderNear(p);return true}
 if(p.job==='wb'){const b=bById(p.wb);if(!b||!bDone(b)){p.job='rob';p.wb=null;return false}const d=BD[b.kind];if(b.proj&&b.proj.t==='rep'){const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'build',b)){b.workers=(b.workers||0)+1;p.act='remontuje swój warsztat';return true}}if(condOf(b)<.15){p.act='budynek w ruinie, czeka na remont';return false}
  if(d.nodes){const n=pickNodeB(p,b);if(!n){p.act='brak zasobów w zasięgu';return false}const st=nearestWalk(n.stand[0],n.stand[1]);if(!st)return false;
   if(go(p,st,'work',n)){n.claim++;p.act={zbieracz:'zbiera',pomost:'łowi ryby',drwal:'ścina drzewo',kamien:'łupie kamień',glinianka:'kopie glinę',ruda:'kopie rudę'}[b.kind];return true}return false}
  if(b.kind==='mysliwy'){const c=bCenter(b);let best=null,bd=1e9;S.herds.forEach(h=>{const ti=tileOf(h.x,h.z);if(h.n<=0||!ANIMAL[h.type][3]||!revAt(ti[0],ti[1]))return;if(h.type==='niedzwiedz'&&(p.sk.mysliwy||0)<3)return;const dd=Math.hypot(h.x-c.x,h.z-c.z);if(dd<=rOf(b)+3&&dd<bd){bd=dd;best=h}});
   if(!best){p.act='nie ma zwierzyny w zasięgu';return false}const st=nearestWalk(...tileOf(best.x,best.z));if(st&&go(p,st,'hunt',null)){p.herd=S.herds.indexOf(best);p.act='tropi: '+ANIMAL[best.type][0];return true}return false}
  if(b.kind==='zagroda'){const c=bCenter(b);const e=entryOf(b.kind,b.i,b.j);
   if((b.animals||0)<penCap(b)){let best=null,bd=1e9;S.herds.forEach(h=>{const ti=tileOf(h.x,h.z);if(h.type!=='koza'||h.n<=0||!revAt(ti[0],ti[1]))return;const dd=Math.hypot(h.x-c.x,h.z-c.z);if(dd<=rOf(b)+3&&dd<bd){bd=dd;best=h}});
    if(best&&Math.random()<.75){const st=nearestWalk(...tileOf(best.x,best.z));if(st&&go(p,st,'tame',null)){p.herd=S.herds.indexOf(best);p.act='oswaja kozy';return true}}}
   if(e&&go(p,e,'care',b)){p.act=(b.animals||0)?'doi i karmi kozy':'naprawia płot';return true}return false}
  if(d.field){const e=entryOf(b.kind,b.i,b.j);const f=b.field||(b.field={st:'puste',g:0,fert:1,q:0,left:0});
   if(f.st==='puste'){if(!inSow()){p.act='pole czeka na siew';return false}if(S.res.ziarno<10){p.act='brak ziarna do siewu';return false}}
   if(f.st==='rosnie'&&f.q>=1){p.act='zboże rośnie';return false}
   if(e&&go(p,e,'field',b)){p.act={puste:'sieje',rosnie:'pieli',dojrzale:'żnie zboże'}[f.st];return true}return false}
  if(b.kind==='lesnik'){const c=bCenter(b);let best=null,bd=1e9;for(const n of nodeBy.tree){if(n.gone||n.amt>0||n.grow>0||n.claim>0||!revAt(n.i,n.j))continue;const dd=Math.hypot(n.x-c.x,n.z-c.z);if(dd<=rOf(b)&&dd<bd){bd=dd;best=n}}
   if(!best){p.act='nie ma gdzie sadzić';return false}const st=nearestWalk(best.i,best.j);if(st&&go(p,st,'plant',best)){best.claim++;p.act='sadzi drzewo';return true}return false}
  if(d.prod){const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'prod',b)){p.act={drewutnia:'rąbie opał',warsztat:'robi narzędzia',szwalnia:'szyje i tka',cegielnia:'wypala cegły',pracownia:'piłuje deski',mielerz:'pilnuje mielerza',kuznia:'kuje żelazo',zarna:'miele ziarno',piekarnia:'piecze chleb',serownia:'robi ser',garncarnia:'lepi garnki',kiszarnia:'kisi kapustę i grzyby'}[b.kind];return true}return false}
  return false}
 if(p.job==='wyp'){const e=S.exps.find(x=>x.id===p.exp);if(!e){p.job='rob';p.exp=null;return false}if(go(p,e.exit,'away',null)){p.act='wyrusza na wyprawę';return true}p.state='away';return true}
 if(p.job==='zwiad'){const t=scoutTarget(p);if(!t){p.act='cała okolica odkryta';return false}if(go(p,t,'scout',null)){p.act='idzie w nieznane';return true}return false}
 if(p.job==='zdun'){const k=S.know;if(!k.active){p.act='czeka na próbę';return false}if(go(p,[camp.i,camp.j+1],'zdun',null)){p.act='próba: '+TRIAL[k.active].n.toLowerCase();return true}return false}
 if(p.job==='czyt'){const bk=Object.keys(S.books).find(k=>S.books[k]===1);if(!bk){p.act='nie ma nic do czytania';return false}const t=homeSpot(p)||[camp.i,camp.j+1];if(go(p,[camp.i,camp.j+1],'read',null)){p.book=bk;p.act='czyta: '+BOOKS[bk];return true}return false}
 // robotnicy: budowa, potem wrak
 const s=S.bld.find(x=>(!bDone(x)||x.proj)&&(x.workers||0)<4);
 if(s){const e=entryOf(s.kind,s.i,s.j);if(e&&go(p,e,'build',s)){s.workers=(s.workers||0)+1;p.act='buduje: '+BD[s.kind].n.toLowerCase();return true}}
 if(wreckTodo()){if(go(p,wreck.stand,'wreck',null)){p.act='przy wraku';return true}}
 p.act='bez zajęcia';return false}
function finishTrip(p,items){p.carry=items;p.act='niesie: '+items.map(c=>RN[c.res].toLowerCase()).join(', ');
 const food=items.some(c=>FOOD.includes(c.res));const t=storeTile(p,food);if(!go(p,t,'deposit',null)){deposit(p);p.state='idle'}}
function deposit(p){if(!p.carry)return;p.carry.forEach(c=>{let q=c.q;if(FOOD.includes(c.res)){const room=foodCap()-foodTotal();if(q>room){q=Math.max(0,room);toastOnce('cap'+Math.floor(S.day/10),'Brak miejsca na żywność. Postaw spiżarnię.')}}S.res[c.res]=(S.res[c.res]||0)+q});p.carry=null}
function onArrive(p){const a=p.after;p.after=null;p.wt=0;
 if(a==='work'||a==='build'||a==='wreck'||a==='zdun'||a==='prod'||a==='plant'||a==='care'||a==='field'||a==='read'){p.state='work';p.workKind=a}
 else if(a==='tame'){const h=S.herds[p.herd];if(h&&h.n>0&&Math.hypot(h.x-p.x,h.z-p.z)<4.5){p.state='work';p.workKind='tame'}else{p.state='idle';p.wait=.5}}
 else if(a==='hunt'){const h=S.herds[p.herd];if(h&&h.n>0&&Math.hypot(h.x-p.x,h.z-p.z)<4.5){p.state='work';p.workKind='hunt'}else{p.state='idle';p.wait=.5}}
 else if(a==='scout'){const[i,j]=tileOf(p.x,p.z);reveal(i,j,6);techXp('nauka',.5);p.state='idle';p.wait=4;p.act='rozgląda się'}
 else if(a==='deposit'){deposit(p);p.state='idle';p.wait=.4;p.act='odpoczywa'}
 else if(a==='sleep'){p.state='sleep';p.act='śpi'}
 else if(a==='away'){p.state='away';p.act='na wyprawie'}
 else if(a==='gasic'){p.state='work';p.workKind='gasic';p.act='gasi pożar'}
 else p.state='idle'}
function stepPerson(p,dt){
 if(p.job==='wyp'&&p.state==='away')return;
 const work=isWork()||p.job==='wyp'||!!p.fireB;
 if(p.state==='move'&&p.path&&p.path.length){const sp=(isChild(p)?1.6:2.3)*(p.carry?.85:1)*(typeof ladSpeed==='function'?ladSpeed(p):1);let st=sp*dt;
  while(st>0&&p.path.length){const w=p.path[0],dx=w.x-p.x,dz=w.z-p.z,d=Math.hypot(dx,dz);if(d<=st){p.x=w.x;p.z=w.z;p.path.shift();st-=d}else{p.x+=dx/d*st;p.z+=dz/d*st;p.dir=Math.atan2(dx,dz);st=0}}
  {const tk=tileOf(p.x,p.z),kk=tk[1]*N+tk[0];if(kk!==p.lt){p.lt=kk;tread[kk]=Math.min(1,tread[kk]+(isChild(p)?.012:.03));treadDirty=true}}
  p.rvT=(p.rvT||0)+dt;if(p.rvT>.6){p.rvT=0;const[i,j]=tileOf(p.x,p.z);if(p.job==='zwiad')reveal(i,j,3);else if(!rev[j*N+i])reveal(i,j,3)}
  if(!p.path.length){p.path=null;onArrive(p)}return}
 if(p.state==='move')p.state='idle';
 if(!work){if(p.state==='work'){if(p.workKind==='build'&&p.tgt&&p.tgt.workers)p.tgt.workers--;release(p)}
  if(p.state!=='sleep'){if(p.carry)deposit(p);const t=homeSpot(p);if(t&&go(p,t,'sleep',null)){p.act='wraca do domu'}else{p.state='sleep'}}
  return}
 if(p.state==='sleep'){p.state='idle';p.wait=Math.random()*2}
 if(p.state==='idle'){p.wait-=dt;if(p.wait>0)return;if(!planJob(p)){p.wait=2.5;if(Math.random()<.3)wanderNear(p)}else if(isChild(p))p.wait=2+Math.random()*4;return}
 if(p.state==='work'){const k=p.workKind;const e=eff(p);
  if(k==='work'){const n=p.tgt,b=bById(p.wb);if(!n||n.amt<1-1e-6||!b){release(p);p.state='idle';p.wait=.2;return}const d=BD[b.kind];const c=d.c;
   p.wt+=dt*e*craftEff(p,c)*bMul(b);gainXp(p,c,dt);const T={zbieracz:n.type==='ul'?9:5,pomost:8,drwal:7,kamien:9,glinianka:7,ruda:9}[b.kind];
   if(p.wt>=T){p.wt=0;n.amt=Math.max(0,n.amt-1);S.nodeAmt[n.id]=n.amt;nodeVis(n);release(p);
    const gm=(tech('u_rozp')?1.15:1)*(hasExt(b,'kosze')?1.25:1);let items;if(n.type==='bush')items=[{res:'jagody',q:3*seasonYield('bush')*gm}];else if(n.type==='grzyb')items=[{res:'grzyby',q:3.5*seasonYield('grzyb')*gm}];else if(n.type==='fish')items=[{res:'ryby',q:4*seasonYield('fish')*(tech('h_sieci')?1.25:1)*(tech('n_gwiazd')?1.2:1)*(hasExt(b,'lodz')?1.25:1)}];
    else if(n.type==='ziola')items=[{res:'ziola',q:2*gm}];
    else if(n.type==='ul'){items=[{res:'miod',q:3}];if(!S.seen.miod){S.seen.miod=1;log(p.name+' przynosi pierwszy plaster dzikiego miodu.')}if(Math.random()<(p.trait==='Ostrożny'?.03:.08)){p.hp=Math.max(.3,p.hp-.08);toastOnce('zadlo'+Math.floor(S.day),p.name+' pogryziony przez pszczoły')}}
    else if(n.type==='zboze'){items=[{res:'ziarno',q:2.5*seasonYield('zboze')}];S.zbozeTot+=2.5;if(S.know.pole!=='tak'&&S.zbozeTot>=25){S.know.pole='tak';log(p.name+' zauważa, że ziarno rozsypane przy obozie wykiełkowało. Można założyć pole.');toast('Odkrycie: dzikie zboże da się siać')}}
    else if(n.type==='len')items=[{res:'wlokna',q:2.5*gm*(tech('u_len')?1.5:1)}];else if(n.type==='ruda')items=[{res:'ruda',q:1.5*(hasExt(b,'pluczka')?1.5:1)}];
    else if(n.type==='tree')items=[{res:'drewno',q:1.5+(hasExt(b,'wiatad')?.5:0)}];else if(n.type==='rock')items=[{res:'kamien',q:1}];else items=[{res:'glina',q:1.5*(hasExt(b,'dol')?1.5:1)}];
    finishTrip(p,items)}return}
  if(k==='hunt'){const h=S.herds[p.herd];if(!h||h.n<=0){p.state='idle';return}p.wt+=dt*e*craftEff(p,'mysliwy')*(tech('h_trop')?1.2:1)*bMul(bById(p.wb));gainXp(p,'mysliwy',dt);
   if(p.wt>=6){p.wt=0;h.n--;const a=Math.random()*6.28;h.tx=clamp(h.x+Math.cos(a)*9,-N/2+3,N/2-3);h.tz=clamp(h.z+Math.sin(a)*9,-N/2+3,N/2-3);toastOnce('hunt','Pierwsze udane polowanie');
    const dng={dzik:[.1,.35,'dzika'],niedzwiedz:[.25,.5,'niedźwiedzia'],lis:[.02,.1,'lisa']}[h.type];const trk=tech('h_trop')?.7:1;
    if(dng&&Math.random()<dng[0]*trk*(S.slady&&S.slady.luk?.6:1)*(p.trait==='Ostrożny'?.45:1)*(1-Math.min(.5,.08*offLv('lowczy')))){p.hp=Math.max(.1,p.hp-dng[1]);p.hurt=1;log(p.name+' ranny przez '+dng[2]+'. Wróci do sił za kilka dni.');toast(p.name+' ranny przez '+dng[2])}
    if(h.type==='niedzwiedz')log(p.name+' wraca z polowania na niedźwiedzia. Mięsa starczy na długo, a futro ogrzeje całą rodzinę.');
    finishTrip(p,[{res:'mieso',q:ANIMAL[h.type][2]},{res:'skory',q:ANIMAL[h.type][3]*(tech('h_garb')?1.5:1)*(hasExt(bById(p.wb),'garbarnia')?1.3:1)}])}return}
  if(k==='tame'){const h=S.herds[p.herd],b=bById(p.wb);if(!h||h.n<=0||!b){p.state='idle';return}p.wt+=dt*e*craftEff(p,'hodowca');gainXp(p,'hodowca',dt);
   if(Math.hypot(h.x-p.x,h.z-p.z)>6){p.state='idle';return}h.calm=S.t+3;
   if(p.wt>=18){p.wt=0;b.tame=(b.tame||0)+1;if(b.tame>=3){b.tame=0;h.n--;b.animals=(b.animals||0)+1;if(b.animals===1)log(p.name+' sprowadza do zagrody pierwszą oswojoną kozę.');toastOnce('koza','Pierwsza oswojona koza');const e=entryOf(b.kind,b.i,b.j);if(e)go(p,e,'idle',null);else p.state='idle'}}return}
  if(k==='care'){const b=p.tgt;if(!b||!bById(b.id)){p.state='idle';return}gainXp(p,'hodowca',dt);b.care=(b.care||0)+dt*e*craftEff(p,'hodowca');p.wt+=dt;if(p.wt>12){p.state='idle';p.wait=1}return}
  if(k==='field'){const b=p.tgt;if(!b||!bById(b.id)){p.state='idle';return}const f=b.field;gainXp(p,'rolnik',dt);p.wt+=dt*e*craftEff(p,'rolnik');
   if(f.st==='puste'){if(p.wt>=10){p.wt=0;if(S.res.ziarno>=10&&inSow()){S.res.ziarno-=10;f.st='rosnie';f.g=0;f.q=0;log('Zasiano pole. Teraz pielenie i czekanie.');fieldVis(b)}p.state='idle'}}
   else if(f.st==='rosnie'){f.q=Math.min(1,f.q+dt*e*.004);if(p.wt>=12){p.state='idle';p.wait=.5}}
   else if(f.st==='dojrzale'){if(p.wt>=6){p.wt=0;const q=Math.min(6,f.left);f.left-=q;if(f.left<=0){f.st='puste';S.seen.harvest=1;adaptHarvest();f.fert=Math.max(.3,f.fert-(tech('u_odlog')?.06:.12));f.g=0;log('Żniwa skończone. Gleba na tym polu jest trochę bardziej zmęczona.');fieldVis(b)}if(q>0)finishTrip(p,[{res:'ziarno',q}]);else p.state='idle'}}
   return}
  if(k==='read'){const bk=p.book;if(!bk||S.books[bk]!==1){p.state='idle';return}S.readP[bk]=(S.readP[bk]||0)+dt*e*(p.trait==='Dociekliwy'?1.3:1)*(p.age<20?1.1:1);techXp('nauka',dt*.08);p.act='czyta: '+BOOKS[bk];
   if(S.readP[bk]>=200){S.books[bk]=2;log(p.name+' kończy czytać „'+BOOKS[bk]+'”.'+(bk==='kowal'?' Można spróbować postawić kuźnię (zakładka Wiedza).':bk==='siew'?' Wiemy, jak założyć pole.':''));toast('Przeczytano: '+BOOKS[bk]);if(bk==='siew')S.know.pole='tak';p.state='idle'}return}
  if(k==='plant'){const n=p.tgt;if(!n||n.amt>0||n.grow>0){release(p);p.state='idle';return}p.wt+=dt*e;gainXp(p,'drwal',dt*.5);if(p.wt>=5){n.grow=.03;S.grow[n.id]=n.grow;nodeVis(n);release(p);p.state='idle';p.wait=.3}return}
  if(k==='gasic'){const b=p.tgt;if(!b||!b.fire){p.fireB=null;p.state='idle';p.wait=.3;return}b.fire.s-=dt*.011*e*(wellCount()?1:.35)*(law('straz')?1.4:1);p.dir=(p.dir||0)+Math.sin(clock*3)*.02;return}
  if(k==='build'){const s=p.tgt;if(s&&bDone(s)&&s.proj&&bById(s.id)){s.proj.prog+=dt*e*craftEff(p,'ciesla')*(tech('r_zrab')?1.25:1)*(1+.04*offLv('budowa'));gainXp(p,'ciesla',dt);if(s.proj.prog>=s.proj.work){finishProj(s);p.tgt=null;p.state='idle';p.wait=.2}return}
  if(!s||bDone(s)){if(s&&s.workers>0)s.workers--;p.tgt=null;p.state='idle';p.wait=.2;return}
   s.prog+=dt*e*craftEff(p,'ciesla')*(tech('r_zrab')?1.25:1)*(1+.04*offLv('budowa'));gainXp(p,'ciesla',dt);{const bm=bMesh[s.id];if(bm)bm.scale.y=Math.max(.12,Math.min(1,s.prog/s.work))}
   if(bDone(s)){completeSite(s);p.tgt=null;p.state='idle';p.wait=.2}return}
  if(k==='wreck'){const W=S.wreck;if(W.gone){p.state='idle';return}gainXp(p,'ciesla',dt);
   const tg=W.target>=0?W.parts[W.target]:null;
   if(tg&&!tg.open){tg.prog=(tg.prog||0)+dt*e*craftEff(p,'ciesla')*WEATHER[S.weather.k][1];p.act='rozpoznaje: '+tg.n.toLowerCase();if(tg.prog>=tg.need){tg.open=1;W.target=-1;const it=Object.entries(tg.items).filter(([k,v])=>v>0).map(([k,v])=>k.startsWith('ks_')?'księga „'+BOOKS[k.slice(3)]+'”':RN[k].toLowerCase()+' '+v);log('Rozpoznano: '+tg.n.toLowerCase()+'. W środku: '+it.join(', ')+'.');toast('Dostęp do części wraku: '+tg.n);p.state='idle'}return}
   p.wt+=dt*e*craftEff(p,'ciesla')*(S.wreckRush&&S.day<S.wreckRush?2:1);if(p.wt>=6){p.wt=0;const part=(tg&&tg.open&&Object.values(tg.items).some(v=>v>0))?tg:W.parts.find(x=>x.open&&Object.values(x.items).some(v=>v>0));if(!part){p.state='idle';return}
    const keys=Object.keys(part.items).filter(k=>part.items[k]>0);const x=keys[(Math.random()*keys.length)|0];
    if(x.startsWith('ks_')){part.items[x]=0;const bk=x.slice(3);S.books[bk]=1;log(p.name+' wynosi z wraku księgę: „'+BOOKS[bk]+'”. Trzeba ją przeczytać (zakładka Praca, czytelnicy).');toast('Znaleziono księgę: '+BOOKS[bk]);p.state='idle';return}
    const q=Math.min({narz:2,gwozdzie:8,deski:3,plotno:1,wlokna:3,ziarno:5,odziez:2,skory:2,suchary:8}[x]||2,part.items[x]);part.items[x]-=q;
    if(!wreckLeft()&&W.parts.every(x=>x.open))log('Wrak rozebrany do ostatniej deski. Teraz wszystko trzeba zrobić samemu.');finishTrip(p,[{res:x,q}])}return}
  if(k==='zdun'){const kn=S.know;if(!kn.active){p.state='idle';return}const T=TRIAL[kn.active];gainXp(p,T.c,dt);techXp('nauka',dt*.04);kn[kn.active+'_p']+=dt*e*craftEff(p,T.c);
   if(kn[kn.active+'_p']>=T.need)finishTrial(p);return}
  if(k==='prod'){const b=p.tgt;if(!b||!bById(b.id)){p.state='idle';return}const d=BD[b.kind];const list=[].concat(d.prod);const has=pr=>Object.entries(pr.in).every(([r,v])=>(S.res[r]||0)>=v);
   const pr=list.find(x=>has(x)&&(!x.when||x.when()));
   if(!pr&&list.some(has)){p.act='zapas wystarczy, odpoczywa';p.wt=0;p.wait=6;p.state='idle';return}
   if(!pr){const p0=list[0];p.act='czeka na: '+Object.keys(p0.in).filter(r=>(S.res[r]||0)<p0.in[r]).map(r=>RN[r].toLowerCase()).join(', ');p.wt=0;p.wait=3;p.state='idle';return}
   p.wt+=dt*e*craftEff(p,d.c)*bMul(b);gainXp(p,d.c,dt);if(p.wt>=pr.t*(pr.out.plotno&&tech('r_tkac')?.6:1)){p.wt=0;Object.entries(pr.in).forEach(([r,v])=>S.res[r]-=v);if(b.kind==='drewutnia'&&hasExt(b,'wiata'))S.res.opal+=1;Object.entries(pr.out).forEach(([r,v])=>{S.res[r]=(S.res[r]||0)+v;if(r==='narz'||r==='narzk'||r==='odziez'){const q=.7+.12*Math.max(...S.people.filter(x=>x.wb===b.id).map(x=>x.sk[d.c]||0),0);S.toolQ=S.toolQ||{};const o=S.toolQ[r]||1,st=Math.max(0,S.res[r]-v);S.toolQ[r]=(o*st+q*v)/(st+v)}});if(b.kind==='cegielnia')toastOnce('cegla','Pierwsze cegły wyjęte z pieca')}return}}}
function fieldVis(b){const m=bMesh[b.id];if(!m||!m.userData.crops)return;const f=b.field||{st:'puste',g:0};const g=f.st==='puste'?0:f.st==='dojrzale'?1:f.g;const col=new THREE.Color().setRGB(L(lerp(.42,.86,g)),L(lerp(.6,.7,g)),L(lerp(.25,.3,g)));
 m.userData.crops.children.forEach((c,i)=>{const s=g<=0?0:.25+.75*g;c.scale.set(s,s*(.85+((i*7)%5)*.06),s);c.material.color.copy(col)})}
function completeSite(s){{const old=bMesh[s.id];if(old){old.scale.y=1;if(old.userData.scaf){bGroup.remove(old.userData.scaf);old.userData.scaf=null}}}log('Ukończono: '+BD[s.kind].n.toLowerCase()+'.');toast('Ukończono: '+BD[s.kind].n);
 if(s.kind==='wieza'){reveal(s.i,s.j,26);log('Ze strażnicy widać daleko w głąb wyspy.')}if(BD[s.kind].house)assignHomes();if(BD[s.kind].wk){s.want=Math.min(BD[s.kind].wk,Math.max(1,Math.min(2,freeCount())));assign()}renderPanel()}
const TRIAL={cegla:{n:'Wypał cegły',c:'murarz',need:150,base:.3,cost:{glina:8,drewno:6},ok:'Próba udała się: znamy wypał cegły. Można postawić piec do cegły.',bad:'cegły popękały w ogniu'},piec:{n:'Piec zduński',c:'murarz',need:240,base:.22,cost:{cegla:6},ok:'Próba udała się: sklepienie pieca trzyma ciąg.',bad:'sklepienie się zawaliło'},kuznia:{n:'Kuźnia',c:'kowal',need:240,base:.25,cost:{ruda:6,wegiel:4},ok:'Próba udała się: z rudy wytopiono pierwsze żelazo. Można postawić kuźnię.',bad:'wytop zostawił tylko żużel'}};
function finishTrial(p){const kn=S.know,t=kn.active,T=TRIAL[t];kn.active=null;kn[t+'_p']=0;
 const chance=clamp(T.base+.16*(p.sk[T.c]||0)+.12*kn[t+'_f']+(p.trait==='Uparty'?.08:0),.05,.95);
 if(Math.random()<chance){kn[t]='tak';log(T.ok);toast('Poznano: '+T.n)}
 else{kn[t+'_f']++;log(p.name+': próba nieudana ('+T.bad+'). Następna będzie pewniejsza.');toast('Próba nieudana. Można spróbować ponownie.')}
 p.state='idle'}
/* przydział: budynki robocze, zwiad, zdun; reszta to robotnicy */
function assign(){const pool=adultsPool();
 pool.forEach(p=>{if(p.job==='wb'&&!bById(p.wb)){p.job=null;p.wb=null}});
 const drop=p=>{p.job=null;p.wb=null;if(p.state==='work'||p.state==='move'){release(p);p.path=null;p.state='idle'}};
 S.bld.forEach(b=>{if(!BD[b.kind].wk||!bDone(b))return;const cur=pool.filter(p=>p.job==='wb'&&p.wb===b.id).sort((x,y)=>y.sk[BD[b.kind].c]-x.sk[BD[b.kind].c]);while(cur.length>(b.want||0))drop(cur.pop())});
 ['zwiad','zdun','czyt'].forEach(j=>{const cur=pool.filter(p=>p.job===j);while(cur.length>(S.alloc[j]||0))drop(cur.pop())});
 const free=()=>pool.filter(p=>!p.job||p.job==='rob');
 S.bld.forEach(b=>{const d=BD[b.kind];if(!d.wk||!bDone(b))return;let have=pool.filter(p=>p.job==='wb'&&p.wb===b.id).length;
  while(have<(b.want||0)){const f=free().sort((x,y)=>(y.sk[d.c]-x.sk[d.c])||(x.age-y.age));if(!f.length)break;const p=f[0];if(p.state!=='sleep'){release(p);p.path=null;p.state='idle'}p.job='wb';p.wb=b.id;have++}});
 ['zwiad','zdun','czyt'].forEach(j=>{let have=pool.filter(p=>p.job===j).length;while(have<(S.alloc[j]||0)){const sk=j==='zdun'?(S.know.active?TRIAL[S.know.active].c:'murarz'):'zbieracz';const f=free().sort((x,y)=>j==='czyt'?((y.trait==='Dociekliwy')-(x.trait==='Dociekliwy')||x.age-y.age):(y.sk[sk]-x.sk[sk]));if(!f.length)break;f[0].job=j;f[0].wb=null;have++}});
 pool.forEach(p=>{if(!p.job)p.job='rob'});S.people.forEach(p=>{if(!isWorker(p)){p.job=null;p.wb=null}})}
const freeCount=()=>adultsPool().filter(p=>p.job==='rob'||!p.job).length;
function setWant(b,delta){const d=BD[b.kind];const cur=b.want||0;if(delta>0){if(cur>=wkOf(b)){toast('Ten budynek mieści '+wkOf(b)+' pracowników. Ulepsz go, by mieścił więcej.');return}if(freeCount()<=0){toast('Brak wolnych rąk. Zwolnij kogoś z innej pracy.');return}}
 b.want=clamp(cur+delta,0,wkOf(b));assign();renderPanel();renderSel()}
function setAlloc(id,delta){if(delta>0&&freeCount()<=0){toast('Brak wolnych rąk. Zwolnij kogoś z innej pracy.');return}S.alloc[id]=Math.max(0,(S.alloc[id]||0)+delta);assign();renderPanel()}
/* rodziny i domy */
function famMembers(fid){return S.people.filter(p=>p.fam===fid)}
function assignHomes(){const free=S.bld.filter(b=>bDone(b)&&BD[b.kind].house&&!Object.values(S.fams).some(f=>f.home===b.id));
 const homeless=Object.values(S.fams).filter(f=>!f.home&&famMembers(f.id).length).sort((a,b)=>famMembers(b.id).length-famMembers(a.id).length);
 while(free.length&&homeless.length){const f=homeless.shift();const h=free.shift();f.home=h.id;log('Rodzina '+famName(f.id)+' wprowadza się do domu ('+BD[h.kind].n.toLowerCase()+').')}}
function famName(fid){const m=famMembers(fid).filter(isAdult).sort((a,b)=>b.age-a.age)[0]||famMembers(fid)[0];return m?m.name:'?'}
function newName(sex){const pool=NAMES[sex];const used=new Set(S.people.map(p=>p.name));const c=pool.filter(n=>!used.has(n));return(c.length?c:pool)[(Math.random()*(c.length||pool.length))|0]}
function killPerson(p,why){S.people=S.people.filter(q=>q!==p);release(p);if(p.pair!==null){const q=pById(p.pair);if(q)q.pair=null}
 removePersonMesh(p.id);if(selId===p.id)select(null);S.died++;S.dis=clamp((S.dis||0)+(law('cmentarz')?.015:law('morze')?.06:.04),0,1);S.hope=clamp(S.hope-(law('cmentarz')?.01:.03),0,1);
 const best=Object.keys(CN).filter(c=>p.sk[c]>=3).filter(c=>!S.people.some(q=>q.sk[c]>=p.sk[c]-1));
 if(best.length&&tech('n_pamiec')){best.forEach(c=>{const h=S.people.filter(isAdult).sort((a,b)=>b.sk[c]-a.sk[c]||b.xp[c]-a.xp[c])[0];if(h){h.sk[c]=Math.max(h.sk[c],p.sk[c]-1);h.xp[c]=Math.max(h.xp[c],lvXp(h.sk[c]))}});log(p.name+' umiera'+(why?' ('+why+')':'')+' w wieku '+Math.floor(p.age)+' lat. Księga osady przechowa to, co umiał: uczniowie przejmują fach.')}
 else log(p.name+' umiera'+(why?' ('+why+')':'')+' w wieku '+Math.floor(p.age)+' lat.'+(best.length?' Razem z nim ginie wiedza: '+best.map(c=>CN[c]+' '+p.sk[c]).join(', ')+'.':''));
 const f=S.fams[p.fam];if(f&&!famMembers(f.id).length){f.home=null;delete S.fams[f.id]}
 assign()}
function familyLife(){
 // narodziny
 Object.values(S.fams).forEach(f=>{const h=f.home?bById(f.home):null;if(!h||!bDone(h))return;const mem=famMembers(f.id);if(mem.length>=BD[h.kind].house)return;
  const w=mem.find(p=>p.sex==='k'&&p.age>=18&&p.age<=44&&p.pair!==null&&!p.waitHome&&pById(p.pair)&&pById(p.pair).fam===f.id);if(!w)return;
  if(Math.random()<.014*K*(.5+S.hope)*(S.fedR>.9?1:.3)){const sex=Math.random()<.5?'k':'m';const c=newPerson(S.pid++,newName(sex),0,sex,f.id,{},TKEYS[(Math.random()*TKEYS.length)|0]);c.born=1;c.rod=(pById(w.pair)||w).rod;c.par=[w.id,w.pair];c.mirX=0;const hc=bCenter(h);c.x=hc.x+.6;c.z=hc.z+.8;S.people.push(c);addPersonMesh(c);S.born++;
   log('Rodzi się '+c.name+' w rodzinie '+famName(f.id)+'.');toast('Narodziny: '+c.name)}});
 assignHomes()}
function dailyPeople(cold,fuelHeated){
 const sea=seasonIdx();S.diedToday=0;
 for(const p of [...S.people]){
  // ciepło
  const h=homeOf(p);let w;if(!cold)w=1;else if(p.job==='wyp')w=p.coat>0?.8:.4;else if(h&&bDone(h))w=fuelHeated.has(h.id)?1:.35;else w=S.campFire?.5:.15;
  if(cold&&w<1&&p.coat>0)w=Math.min(1,w+.25);p.warm=w;
  if(p.hp<.9&&S.res.ziola>=.05){S.res.ziola-=.05;p.hp=Math.min(1,p.hp+K*(tech('u_ziel')?.03:.012))}
  if(p.hurt){p.hp=Math.min(1,p.hp+K*(tech('n_opat')?.03:.0));if(p.hp>.9)p.hurt=0}
  const pat=p.trait==='Cierpliwy'?.75:1;p.hp=clamp(p.hp+K*((S.fedR>=.999?.03:-(1-S.fedR)*.04*pat*hungerMul(p))+(w<.6?-(0.6-w)*.08*pat:.008)+(S.variety-2)*.006),0,1);
  if(p.worked){p.tool.d-=K;if(p.tool.t&&p.tool.d<=0){p.tool.t=0;toastOnce('tool','Narzędzia się zużywają. Warsztat zrobi kamienne.')}p.worked=0}
  if(isAdult(p)&&p.tool.t===0&&p.job!=='rob'){const TQ=S.toolQ||{};if(S.res.narz>=1){S.res.narz--;p.tool={t:2,d:(tech('r_stal')?225:150)*(TQ.narz||1)}}else if(S.res.narzk>=1){S.res.narzk--;p.tool={t:1,d:(tech('r_narz')?85:50)*(TQ.narzk||1)}}}
  p.coat-=(cold?(sea===2?1.4:.9):.3)*K;if(p.coat<=0&&S.res.odziez>=1){S.res.odziez--;p.coat=(tech('r_tkac')?230:170)*((S.toolQ||{}).odziez||1)}
  const was=p.age;p.age+=2/YEAR;if(was<12&&p.age>=12){log(p.name+' kończy 12 lat i może pracować.');p.tool={t:0,d:0};const m=pMesh[p.id];if(m)m.scale.setScalar(personScale(p));assign()}
  else if(Math.floor(was)!==Math.floor(p.age)&&p.age<13){const m=pMesh[p.id];if(m)m.scale.setScalar(personScale(p))}
  // dzieci podpatrują rodziców
  if(isChild(p)&&p.age>=6){const par=famMembers(p.fam).filter(isAdult);if(par.length){const c=Object.keys(CN).sort((a,b)=>Math.max(...par.map(q=>q.sk[b]))-Math.max(...par.map(q=>q.sk[a])))[0];p.xp[c]+=4*K*(tech('n_szk')?2:1)*(law('nauka')?1.5:1)*(hasB('izbanauki')?1.5:1);if(p.sk[c]<1&&p.xp[c]>=LVL[0]){p.sk[c]=1;log(p.name+' podpatrzył rodziców i zna podstawy fachu: '+CN[c]+'.')}}}
  // śmierć
  if(p.age>62&&Math.random()<(p.age-62)*.0007*K)killPerson(p,'ze starości');
  else if(p.hp<=.02&&!S.diedToday&&Math.random()<.1){S.diedToday=1;killPerson(p,S.fedR<.6?'z głodu':'z wyziębienia')}}
 S.health=S.people.length?S.people.reduce((a,p)=>a+p.hp,0)/S.people.length:0;
 S.warm=S.people.length?S.people.reduce((a,p)=>a+(p.warm===undefined?1:p.warm),0)/S.people.length:1}
function tierOf(){const houses=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length,pop=S.people.length;let t=0;TIERS.forEach((x,i)=>{if(houses>=x[1]&&pop>=x[2])t=i});return t}
function newDay(){
 expTick();
 const need=K*S.people.filter(p=>p.job!=='wyp').reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)*(law('oszczedne')?.8:1);
 // jedzenie: każdy rodzaj po trochu
 const seedRes=Math.min(S.res.ziarno,10*S.bld.filter(b=>b.field).length);const avail=k=>k==='ziarno'?S.res.ziarno-seedRes:S.res[k];
 const tot=FOOD.reduce((a,k)=>a+Math.max(0,avail(k)),0);const types=FOOD.filter(k=>avail(k)>.5);S.variety=types.length;
 if(tot>0){const take=Math.min(tot,need);FOOD.forEach(k=>{S.res[k]-=take*(Math.max(0,avail(k))/tot)})}
 S.fedR=need>0?Math.min(1,tot/need):1;
 if(S.fedR<1){S.hungerDays++;if(S.hungerDays===1)log('Zabrakło jedzenia dla wszystkich. Ludzie słabną.')}else S.hungerDays=0;
 const sp=hasB('piec')?.5:1,spz=(hasB('spizarnia')?.5:1)*(anyExt('lodownia')?.8:1),garn=dM()*(tech('r_garn')?.75:1)*(1-Math.min(.3,(S.res.naczynia||0)*.01))*(law('zapasy')?.8:1)*(1-Math.min(.3,.05*offLv('spizarnia')));FOOD.forEach(k=>{const tm=((k==='jagody'||k==='grzyby')&&tech('u_susz')?.6:1)*((k==='jagody'||k==='grzyby')&&anyExt('suszarnia')?.7:1)*((k==='mieso'||k==='ryby')&&tech('h_wedz')?.5:1)*((k==='mieso'||k==='ryby')&&anyExt('wedzarnia')?.6:1)*(k==='mleko'&&tech('h_doj')?.4:1);S.res[k]=Math.max(0,(S.res[k]||0)*Math.pow(1-SPOIL[k]*sp*spz*garn*tm,K))});
 // opał
 const sea=seasonIdx();S.weather.left--;if(S.weather.left<=0){const rollW=s=>{const roll=WROLL[s];let x=Math.random(),k='clear';for(const[w,pr]of roll){if(x<pr){k=w;break}x-=pr}return k};const k=S.weather.next&&WROLL[sea].some(w=>w[0]===S.weather.next)?S.weather.next:rollW(sea);
  const nx=rollW(Math.floor(((S.day+3)%YEAR)*96/YEAR/24)%4);S.weather={k,left:1+((Math.random()*3)|0),next:nx};if(k==='frost')log('Siarczysty mróz. Domy palą dwa razy więcej opału, a kto nie ma ciepłej odzieży, marznie.');
  if((nx==='frost'||nx==='storm')&&tech('n_kal'))toast('Znaki na niebie: za '+S.weather.left+' d. '+WEATHER[nx][0]);if(k==='storm'){S.lastStorm=S.day;log('Nadciąga sztorm. Praca idzie wolno, morze bije o brzeg.')}}
 const tmp=WEATHER[S.weather.k][2];const fac=K*([0,1,1.6,.7][sea]*(1+Math.max(0,-tmp)*.06)+(sea===0&&tmp<0?.3:0)),cold=fac>0;const heated=new Set();
 if(cold){const homes=Object.values(S.fams).map(f=>f.home?bById(f.home):null).filter(h=>h&&bDone(h));
  homes.forEach(h=>{const use=BD[h.kind].fuel*fac*(hasB('piec')?.6:1)*(law('z_oszcz')?.85:1)*(condOf(h)<.5?2-condOf(h):1);if(S.res.opal>=use){S.res.opal-=use;heated.add(h.id)}else if(S.res.drewno>=use*2){S.res.drewno-=use*2;heated.add(h.id);toastOnce('logs'+Math.floor(S.day/24),'Brak opału: ludzie palą całe kłody. Postaw drewutnię.')}});
 const homeless=S.people.filter(p=>!homeOf(p)).length;S.campFire=false;if(homeless){const use=1.2*fac;if(S.res.opal>=use){S.res.opal-=use;S.campFire=true}else if(S.res.drewno>=use*2){S.res.drewno-=use*2;S.campFire=true}}
  if(homes.length>heated.size&&!S.seen['fuel'+Math.floor(S.day/YEAR)+sea]){S.seen['fuel'+Math.floor(S.day/YEAR)+sea]=1;log('Nie starcza opału dla wszystkich domów. Ludzie marzną.')}}
 waterDaily();
 dailyPeople(cold,heated);
 if(law('odpoczynek'))S.people.forEach(p=>{if(p.hp<.5)p.hp=Math.min(1,p.hp+.02*K)});
 if(law('oszczedne'))S.people.forEach(p=>{p.hp=Math.max(.2,p.hp-.006*K)});if(law('dlugi'))S.people.forEach(p=>{if(isWorker(p)&&p.job!=='wyp')p.hp=Math.max(.25,p.hp-.004*K)});
 bldDaily();wearDaily();lawDaily();slavDaily();disDaily();reqTick();fireRoll();
 {const lv=offLv('zielarz');if(lv)S.people.forEach(p=>{if(p.hp<.9)p.hp=Math.min(1,p.hp+.004*lv*K*(tech('u_ziel')?1.5:1))})}
 familyLife();ludDaily();urzDaily();pamDaily();actDaily();
 techXp('nauka',K*S.people.filter(p=>isAdult(p)&&(p.trait==='Nauczyciel'||p.age>55)).reduce((a,p)=>a+(p.trait==='Nauczyciel'?.7:.25),0));techTick();
 const t=tierOf();if(t>S.tier){S.tier=t;log('Osada rośnie: teraz to '+TIERS[t][0].toLowerCase()+'.');toast('Nowy poziom: '+TIERS[t][0])}
 const housed=S.people.length?S.people.filter(p=>homeOf(p)).length/S.people.length:0;
 const tgt=.22+.25*Math.min(1,S.fedR)+.18*S.warm+.13*housed+.09*Math.min(1,(S.variety-1)/4)+.05*S.tier+.006*S.people.filter(p=>p.trait==='Pogodny').length-.2*(S.dis||0)+(law('wspolne')?.04:0)+(law('opowiesci')?.04:0)+(law('nauka')?.02:0)-(law('pomoc')?.04:0)+(law('u_wspolne')?.04:0)-(law('z_oszcz')?.03:0)+(hasB('cmentarz')?.02:0)+Math.min(.05,.01*anyExt('ganek'))+(hasB('laznia')&&S.bathOk?.03:0)+(hasB('domwsp')?.03:0)+slavHope();S.hope=clamp(S.hope+(tgt-S.hope)*.3,.05,1);
 // przyroda
 for(let k=0;k<N*N;k++)if(tread[k]>0)tread[k]*=.985;treadDirty=true;
 nodes.forEach((n,k)=>{if(n.type==='bush'&&n.amt<n.max&&sea!==2){n.amt=Math.min(n.max,n.amt+.35*K*(tech('u_sad')?1.5:1)*(.6+.8*Math.random()));S.nodeAmt[k]=n.amt}
  else if((n.type==='ziola'||n.type==='ul')&&n.amt<n.max&&sea!==2){n.amt=Math.min(n.max,n.amt+(n.type==='ul'?.12:.25)*K*(.6+.8*Math.random()));S.nodeAmt[k]=n.amt}
  else if((n.type==='grzyb'||n.type==='zboze'||n.type==='len')&&n.amt<n.max&&sea!==2&&(n.type!=='grzyb'||sea<2)){n.amt=Math.min(n.max,n.amt+.3*K*(n.type==='len'&&tech('u_len')?2:1)*(.6+.8*Math.random()));S.nodeAmt[k]=n.amt}
  else if(n.type==='fish'&&n.amt<n.max){n.amt=Math.min(n.max,n.amt+1.5*K);S.nodeAmt[k]=n.amt}
  else if(n.type==='tree'&&n.grow>0&&sea!==2){n.grow+=K/60*(anyExt('szkolka')?1.5:1);if(n.grow>=1){n.grow=0;n.amt=n.max;S.nodeAmt[k]=n.amt}S.grow[k]=n.grow}});
 S.herds.forEach(h=>{if(h.n<h.max&&sea!==2&&Math.random()<K*(h.type==='wilk'?.03:.11))h.n++});
 // zagrody: mleko, przychówek, opieka, wilki
 S.bld.forEach(b=>{if(b.kind!=='zagroda'||!bDone(b))return;const a=b.animals||0;const cared=(b.care||0)>20;b.care=0;
  if(a){S.res.mleko+=K*a*(sea===2&&!hasExt(b,'obora')?.4:.9)*(cared?1:.4)*(tech('h_doj')?1.4:1);if(tech('h_siersc'))S.res.wlokna+=K*a*.12;if((sea===3||(tech('h_rozr')&&sea!==2))&&a>=2&&a<penCap(b)&&Math.random()<K*.06*a/2*(tech('h_rozr')?2:1)){b.animals++;log('W zagrodzie urodziło się koźlę.')}
   if(!cared&&(sea===2||Math.random()<.02)&&Math.random()<.08*K){b.animals--;log('Koza uciekła z zaniedbanej zagrody.')}}
  const c=bCenter(b);S.herds.forEach(h=>{if(h.type!=='wilk'||h.n<2||!b.animals)return;if(Math.hypot(h.x-c.x,h.z-c.z)<26&&Math.random()<dM()*K*(cared?.02:.07)*(tech('h_ostr')?.3:1)*(law('straz')?.3:1)*(hasExt(b,'obora')?.5:1)*(hasB('wieza')?.8:1)){b.animals--;log('Wilki w nocy zagryzły kozę w zagrodzie.');toast('Wilki napadły na zagrodę')}})});
 // pola
 S.bld.forEach(b=>{if(!b.field)return;const f=b.field;if(f.st==='rosnie'&&sea!==2){f.g+=K/30*(tech('u_selek')?1.15:1)*(hasExt(b,'rowy')?1.15:1);if(f.g>=1){f.st='dojrzale';const best=Math.max(0,...S.people.filter(p=>p.wb===b.id).map(p=>p.sk.rolnik));f.left=Math.round(70*f.fert*(.6+.4*f.q)*(1+.1*best)*(tech('u_selek')?1.2:1)*(tech('u_nawoz')&&S.bld.some(z=>z.kind==='zagroda'&&(z.animals||0)>0)?1.25:1)*(hasExt(b,'strach')?1.1:1)*(1+.1*(lvOf(b)-1))*(1+.3*(S.adapt||0)));log('Zboże na polu dojrzało: około '+f.left+' ziarna do zebrania.');toast('Zboże dojrzało')}fieldVis(b)}
  else if(f.st==='dojrzale'&&sea===2){f.left=Math.floor(f.left/2);if(f.left<=0){f.st='puste';fieldVis(b)}}
  else if(f.st==='puste'&&sea!==2)f.fert=Math.min(1,f.fert+.003*K*(tech('u_odlog')?3:1)*(hasExt(b,'rowy')?1.5:1))});
 // wrak: rozpad i sztorm
 if(!S.wreck.gone){const dd=Math.floor(rday());if(dd%SD===0&&S.day>2){S.wreck.parts.forEach(pt=>{Object.keys(pt.items).forEach(k=>{if(!k.startsWith('ks_'))pt.items[k]=Math.floor(pt.items[k]*.8)})});log('Fale i korozja niszczą wrak. Część ładunku przepadła.')}
  if(Math.floor(S.day)===YEAR-5){S.wreck.gone=1;wreckG.visible=false;log('Wiosenny sztorm zerwał wrak z mielizny. Co nie zostało wyniesione, przepadło.');toast('Sztorm zabrał wrak')}
  else if(Math.floor(S.day)===YEAR-10)toast('Za 5 dni wiosenny sztorm może zabrać wrak')}
 // rozbitkowie z morza
 if(false){const k=2+((Math.random()*2)|0);const fid=S.fid++;S.fams[fid]={id:fid,home:null};const names=[];
  for(let q=0;q<k;q++){const sex=q===0?'m':q===1?'k':(Math.random()<.5?'k':'m');const age=q<2?20+Math.random()*20:4+Math.random()*8;const cr=Object.keys(CN)[(Math.random()*8)|0];const p=newPerson(S.pid++,newName(sex),age,sex,fid,{[cr]:1+((Math.random()*2)|0)});
   p.x=tcx(wreck.stand[0])+q*.5;p.z=tcx(wreck.stand[1]);p.tool={t:0,d:0};p.hp=.6;S.people.push(p);addPersonMesh(p);names.push(p.name)}
  const ps=S.people.slice(-k);ps[0].pair=ps[1].id;ps[1].pair=ps[0].id;reveal(wreck.stand[0],wreck.stand[1],4);
  log('Morze wyrzuciło na brzeg rozbitków z innego statku: '+names.join(', ')+'. Przyjęliśmy ich do osady.');toast('Na brzegu pojawili się rozbitkowie');assign();assignHomes()}
 S.day=Math.floor(S.day);
 const d=Math.floor(rday());if(d%SD===0)log('Nastaje '+SEAS[d/SD].toLowerCase()+'.');
 curYd=yday();paintBase(curYd);fogPass(true);
 if(S.bld.some(b=>!bDone(b))&&freeCount()===0)toastOnce('nobuild'+Math.floor(S.day/6),'Budowy stoją: nikt nie jest wolny. Zdejmij kogoś z pracy w zakładce Praca.');
 if(d===SD){const need=K*S.people.reduce((a,p)=>a+(p.age<12?.6:1),0);if(foodTotal()<need*8)log('Przed nami zima, a zapasów jest na mniej niż 8 dób. Trzeba więcej zbieraczy, rybaków i myśliwych.')}
 if(!S.people.length){log('Osada wymarła. Wyspa znów należy do lasu.');toast('Osada wymarła')}
 if(tab)renderPanel();
 save()}
function step(dt){const before=Math.floor(S.day);S.day+=dt/DAY;S.t+=dt;for(const p of S.people)stepPerson(p,dt);stepHerds(dt);fireStep(dt);if(Math.floor(S.day)>before)newDay()}
function stepHerds(dt){S.herds.forEach((h,k)=>{if(h.calm>S.t)return;const dx=h.tx-h.x,dz=h.tz-h.z,d=Math.hypot(dx,dz);
 if(d<.3){if(Math.random()<dt*.15){const def=herdsDef[k];const a=Math.random()*6.28,r=Math.random()*(h.type==='wilk'?16:9);const tx=tcx(def.i)+Math.cos(a)*r*(h.type==='foka'?.35:1),tz=tcx(def.j)+Math.sin(a)*r*(h.type==='foka'?.35:1);const ti=tileOf(tx,tz),tk=ti[1]*N+ti[0];if(walk[tk]&&(h.type!=='foka'||beach[tk])){h.tx=tx;h.tz=tz}}}
 else{const sp=(h.type==='zajac'?1.1:h.type==='foka'?.15:.5)*dt;h.x+=dx/d*Math.min(sp,d);h.z+=dz/d*Math.min(sp,d)}})}
let fogT=0;
function fogPass(force){
 if(force){revNew.length=0;revDirty=false;applyFog();refreshNodes();refreshDeco()}
 else{if(!revDirty)return;revDirty=false;applyFog();const list=revNew.splice(0);decoSeason();
  for(const k of list){const ns=tileNodes.get(k);if(ns)ns.forEach(nodeSet);const ds=tileDeco.get(k);if(ds)ds.forEach(([t,i])=>setDeco(t,i))}
  nodeMeshes.concat(decoMeshes).forEach(m=>{m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true})}
 if(S)tribe.forEach(t=>{const seen=revAt(t.i,t.j);if(t.m)t.m.visible=seen;if(seen&&!S.found.includes(t.k)){S.found.push(t.k);techXp('nauka',25);log('Ślad dawnego ludu: '+TRIBE[t.k][0].toLowerCase()+'. '+TRIBE[t.k][1]);toast('Odkryto: '+TRIBE[t.k][0])}})}

/* ================= budowanie ================= */
let placing=null,ghost=null,ghostTile=null;
const ringMat=new THREE.MeshBasicMaterial({color:0xf4ead0,transparent:true,opacity:.55,depthTest:false,depthWrite:false,toneMapped:false});
const rangeRing=new THREE.Mesh(new THREE.RingGeometry(.94,1,96),ringMat);rangeRing.rotation.x=-Math.PI/2;rangeRing.renderOrder=9;rangeRing.visible=false;scene.add(rangeRing);
function showRing(kind,x,z){const r=BD[kind]&&BD[kind].r;if(!r){rangeRing.visible=false;return}rangeRing.visible=true;rangeRing.scale.set(r,r,r);rangeRing.position.set(x,Hy(x,z)+.4,z)}
const canAfford=c=>Object.entries(c).every(([k,v])=>(S.res[k]||0)>=v);
const bAvail=k=>{const d=BD[k];return !d.need||(TECH_BY[d.need]?tech(d.need):S.know[d.need]==='tak')};
function checkPlace(kind,i,j){const d=BD[kind];if(i<0||j<0||i+d.w>N||j+d.h>N)return false;let mn=1e9,mx=-1e9;
 for(let a=0;a<d.w;a++)for(let b=0;b<d.h;b++){const k=(j+b)*N+i+a;if(!land[k]||occ[k]>=0||!rev[k]||tileHH(i+a,j+b)<.04)return false}
 for(let a=0;a<=d.w;a++)for(let b=0;b<=d.h;b++){const h=H[(j+b)*VW+i+a];mn=Math.min(mn,h);mx=Math.max(mx,h)}
 if(mx-mn>1.3)return false;
 if(d.shore){let w=false;for(let a=-1;a<=d.w;a++)for(let b=-1;b<=d.h;b++){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<N&&y<N&&!land[y*N+x])w=true}if(!w)return false}
 return !!entryOf(kind,i,j)}
function startPlace(kind){if(!bAvail(kind))return;placing=kind;$('cancel').style.display='block';closeSheet();select(null);
 toast(coarse?'Dotknij miejsca, potem dotknij jeszcze raz, by postawić':'Wskaż miejsce i kliknij, by postawić');
 if(ghost)scene.remove(ghost);const d=BD[kind];ghost=new THREE.Mesh(new THREE.BoxGeometry(d.w,.3,d.h),new THREE.MeshBasicMaterial({color:0x66cc66,transparent:true,opacity:.5,depthWrite:false}));ghost.visible=false;scene.add(ghost);ghostTile=null;
 const c=camT;moveGhost(...tileOf(c.x,c.z))}
function cancelPlace(){placing=null;if(ghost){scene.remove(ghost);ghost=null}ghostTile=null;$('cancel').style.display='none';$('pinfo').style.display='none';rangeRing.visible=false;renderSel()}
function moveGhost(i,j){if(!placing)return;const d=BD[placing];i=clamp(i-((d.w-1)>>1),0,N-d.w);j=clamp(j-((d.h-1)>>1),0,N-d.h);ghostTile=[i,j];const ok=checkPlace(placing,i,j);
 ghost.visible=true;const x=tcx(i)+(d.w-1)/2,z=tcx(j)+(d.h-1)/2;ghost.position.set(x,Hy(x,z)+.2,z);ghost.material.color.set(ok?0x66cc66:0xcc5544);showRing(placing,x,z);
 const n=countInRange(placing,i,j);const el=$('pinfo');el.style.display='block';
 el.innerHTML=`<b>${d.n}</b> · ${costHTML(d.cost)}${n!==null?'<br>'+rangeLabel(placing,n):''}${ok?'':'<br><span class="no">Tu nie da się budować'+(d.shore?': pomost musi stać przy wodzie':'')+'</span>'}`}
function tryPlace(){if(!placing||!ghostTile)return;const kind=placing,[i,j]=ghostTile,d=BD[kind];
 if(!checkPlace(kind,i,j)){toast(d.shore?'Pomost musi stać na brzegu, przy wodzie':'Tu nie da się budować: woda, stromizna, nieodkryty teren albo zajęte');return}
 if(!canAfford(d.cost)){toast('Brakuje: '+Object.entries(d.cost).filter(([k,v])=>(S.res[k]||0)<v).map(([k,v])=>RN[k].toLowerCase()+' '+Math.ceil(v-(S.res[k]||0))).join(', '));return}
 Object.entries(d.cost).forEach(([k,v])=>S.res[k]-=v);
 nodes.forEach(n=>{if(n.type!=='fish'&&n.i>=i&&n.i<i+d.w&&n.j>=j&&n.j<j+d.h){n.gone=1;n.amt=0;S.nodeAmt[n.id]=0;nodeVis(n)}});
 const b={id:S.nid++,kind,i,j,prog:0,work:d.work,workers:0,want:0};S.bld.push(b);placeFootprint(kind,i,j,b.id);addBuildingMesh(b);
 for(let a=0;a<d.w;a++)for(let q=0;q<d.h;q++){const ds=tileDeco.get((j+q)*N+i+a);if(ds)ds.forEach(([t,x])=>setDeco(t,x))}decoMeshes.forEach(m=>m.instanceMatrix.needsUpdate=true);
 if(freeCount()===0)toast('Nikt nie buduje: wszyscy mają pracę. Zwolnij kogoś w zakładce Praca.');
 log('Rozpoczęto budowę: '+d.n.toLowerCase()+'.');cancelPlace()}

/* ================= kamera i wejście ================= */
let camT={x:0,z:0},yaw=Math.PI/4,yawT=yaw,zoom=1.6,zoomT=1.6;const pitch=.64;
const ZMIN=.22,ZMAX=3.2;
function setCam(){const size=34/zoom,asp=innerWidth/innerHeight;cam.left=-size*asp/2;cam.right=size*asp/2;cam.top=size/2;cam.bottom=-size/2;cam.updateProjectionMatrix();
 const h=Hy(camT.x,camT.z);const r=160;cam.position.set(camT.x+Math.sin(yaw)*Math.cos(pitch)*r,h+Math.sin(pitch)*r,camT.z+Math.cos(yaw)*Math.cos(pitch)*r);cam.lookAt(camT.x,h,camT.z);
 sun.target.position.set(camT.x,0,camT.z);sun.target.updateMatrixWorld()}
function resize(){renderer.setSize(innerWidth,innerHeight,false);setCam();gfxResize()}
addEventListener('resize',resize);
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
function pick(cx,cy,objs){const r=cv.getBoundingClientRect();mv.set((cx-r.left)/r.width*2-1,-((cy-r.top)/r.height)*2+1);ray.setFromCamera(mv,cam);return ray.intersectObjects(objs,true)}
const pts=new Map();let drag=null,pinch=null,follow=false;
function panBy(dx,dy){const size=34/zoom,upp=size/innerHeight;const rx=Math.cos(yaw),rz=-Math.sin(yaw),fx=-Math.sin(yaw),fz=-Math.cos(yaw);
 camT.x=clamp(camT.x-(dx*rx*upp)+(dy*fx*upp/Math.sin(pitch)),-N/2+4,N/2-4);camT.z=clamp(camT.z-(dx*rz*upp)+(dy*fz*upp/Math.sin(pitch)),-N/2+4,N/2-4);follow=false;setCam()}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pts.size===1)drag={x:e.clientX,y:e.clientY,moved:0,t:performance.now()};
 else if(pts.size===2){const a=[...pts.values()];pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),z:zoom};drag=null}});
cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);
 if(placing&&e.pointerType==='mouse'&&!drag){const h=pick(e.clientX,e.clientY,[terrain])[0];if(h)moveGhost(Math.floor(h.point.x+N/2),Math.floor(h.point.z+N/2))}
 if(!p)return;p.x=e.clientX;p.y=e.clientY;
 if(pinch&&pts.size>=2){const a=[...pts.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);zoom=zoomT=clamp(pinch.z*d/pinch.d,ZMIN,ZMAX);setCam();return}
 if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved+=Math.abs(dx)+Math.abs(dy);if(drag.moved>6)panBy(dx,dy);drag.x=e.clientX;drag.y=e.clientY}});
cv.addEventListener('pointerup',e=>{const was=pts.has(e.pointerId);pts.delete(e.pointerId);if(pts.size<2)pinch=null;
 if(drag&&was&&drag.moved<=6&&performance.now()-drag.t<600)onTap(e.clientX,e.clientY);if(pts.size===0)drag=null});
cv.addEventListener('pointercancel',e=>{pts.delete(e.pointerId);pinch=null;drag=null});
cv.addEventListener('wheel',e=>{e.preventDefault();zoomT=clamp(zoomT*(e.deltaY<0?1.12:.89),ZMIN,ZMAX)},{passive:false});
addEventListener('keydown',e=>{if(!S)return;if(e.key==='q')yawT+=Math.PI/2;if(e.key==='e')yawT-=Math.PI/2;if(e.key==='Escape'){cancelPlace();select(null)}if(e.key===' '){e.preventDefault();setSpeed(S.speed===0?1:0)}
 const st=60;if(e.key==='w'||e.key==='ArrowUp')panBy(0,st);if(e.key==='s'||e.key==='ArrowDown')panBy(0,-st);if(e.key==='a'||e.key==='ArrowLeft')panBy(st,0);if(e.key==='d'||e.key==='ArrowRight')panBy(-st,0)});
let selId=null,selB=null;
function onTap(x,y){
 if(!S)return;
 if(placing){const h=pick(x,y,[terrain])[0];if(h){const i=Math.floor(h.point.x+N/2),j=Math.floor(h.point.z+N/2),d=BD[placing];const ni=clamp(i-((d.w-1)>>1),0,N-d.w),nj=clamp(j-((d.h-1)>>1),0,N-d.h);
   if(ghostTile&&ghostTile[0]===ni&&ghostTile[1]===nj)tryPlace();else moveGhost(i,j)}return}
 const hs=pick(x,y,[pGroup])[0];if(hs&&hs.object.userData.pid!==undefined){select(hs.object.userData.pid);return}
 const hb=pick(x,y,[bGroup])[0];if(hb&&hb.object.userData.bid!==undefined){selectB(hb.object.userData.bid);return}
 select(null)}
function select(id){if(selId!==null&&pMesh[selId])pMesh[selId].userData.ring.visible=false;selId=id;selB=null;rangeRing.visible=false;if(id!==null&&pMesh[id])pMesh[id].userData.ring.visible=true;if(id===null)follow=false;renderSel()}
function selectB(id){select(null);selB=id;const b=bById(id);if(b){const c=bCenter(b);showRing(b.kind,c.x,c.z)}renderSel()}

/* ================= UI ================= */
function $(id){return document.getElementById(id)}
let tab=null;
const TABS=[['budowa','Budowa'],['praca','Praca'],['osada','Ludzie'],['wyprawy','Wyprawy'],['wiedza','Wiedza'],['natura','Natura'],['kronika','Kronika']];
$('tabbar').innerHTML=TABS.map(([k,n])=>`<button data-tab="${k}">${ico(k)}<span>${n}</span></button>`).join('');
$('speed').innerHTML=[[0,ico('pause')],[1,'1×'],[2,'2×'],[4,'4×'],[8,'8×']].map(([v,l])=>`<button data-sp="${v}" aria-label="Tempo ${v}">${l}</button>`).join('')+`<i></i><button data-snd="1" aria-label="Dźwięk"></button><button data-fs="1" aria-label="Pełny ekran"></button><button data-gfx="1" aria-label="Jakość grafiki" style="font-size:11px;letter-spacing:.06em"></button>`;
function renderCtl(){{const gb=$('speed').querySelector('[data-gfx]');if(gb)gb.textContent=['NISKA','WYS.','ULTRA'][GFX.level];}const sb=$('speed').querySelector('[data-snd]');if(sb)sb.innerHTML=ico(muted?'mute':'snd');const fb=$('speed').querySelector('[data-fs]');if(fb){fb.innerHTML=ico(isFull()?'fsx':'fs');fb.style.display=fsAvail()?'':'none'}
 $('ctl').innerHTML=`<button class="txt${overview?' on':''}" data-c="isl" aria-label="Cała wyspa">Wyspa</button><button data-c="eye" class="${document.body.classList.contains('clean')?'on':''}" aria-label="Czysty widok">${ico('eye')}</button><button data-c="rl" aria-label="Obróć w lewo">${ico('rotl')}</button><button data-c="rr" aria-label="Obróć w prawo">${ico('rotr')}</button><button data-c="zin" aria-label="Przybliż">${ico('plus')}</button><button data-c="zout" aria-label="Oddal">${ico('minus')}</button><button data-c="home" aria-label="Wróć do obozu">${ico('dom')}</button>`}
setTimeout(renderCtl,0);
let overview=null;
function islandZoom(){const asp=innerWidth/innerHeight;return clamp(34/Math.max(128*N/144,205*N/144/asp),.07,1)}
function toggleOverview(on){if(on===undefined)on=!overview;
 if(on&&!overview){overview={x:camT.x,z:camT.z,zoom:zoomT};camT.x=0;camT.z=4;zoomT=islandZoom();follow=false;setCam()}
 else if(!on&&overview){camT.x=overview.x;camT.z=overview.z;zoomT=Math.max(overview.zoom,.6);overview=null;setCam()}
 renderCtl()}
function lookAt(x,z,zm){if(overview)overview=null;camT.x=clamp(x,-N/2+4,N/2-4);camT.z=clamp(z,-N/2+4,N/2-4);if(zm)zoomT=zm;follow=false;setCam();renderCtl()}
$('ctl').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const c=b.dataset.c;
 if(c==='isl'){toggleOverview();return}
 if(c==='eye'){document.body.classList.toggle('clean');renderCtl();return}
 if(c==='zin'){zoomT=clamp(zoomT*1.3,ZMIN,ZMAX);if(overview&&zoomT>.6){overview=null;renderCtl()}}
 if(c==='zout')zoomT=clamp(zoomT/1.3,overview?.1:ZMIN,ZMAX);if(c==='rl')yawT+=Math.PI/2;if(c==='rr')yawT-=Math.PI/2;
 if(c==='home'){lookAt(tcx(camp.i),tcx(camp.j),Math.max(zoomT,1.4));if(placing)moveGhost(camp.i+2,camp.j+2)}});
$('speed').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;if(b.dataset.snd){toggleMute();renderCtl();return}if(b.dataset.fs){toggleFull();return}if(b.dataset.gfx){gfxSetLevel((GFX.level+2)%3);return}setSpeed(+b.dataset.sp)});
function setSpeed(v){S.speed=v;[...$('speed').querySelectorAll('[data-sp]')].forEach(b=>b.classList.toggle('on',+b.dataset.sp===v))}
$('stats').addEventListener('click',()=>{$('res').classList.toggle('on')});
$('res').addEventListener('click',()=>$('res').classList.remove('on'));
let goalMin=innerWidth<=760||innerHeight<=460;
$('goal').addEventListener('click',()=>{goalMin=!goalMin;$('goal')._h=null;renderTop()});
$('smin').innerHTML=ico('minus');$('sclose').innerHTML=ico('x');
$('smin').addEventListener('click',()=>{const sh=$('sheet');sh.classList.toggle('min');$('smin').innerHTML=ico(sh.classList.contains('min')?'plus':'minus')});
$('tabbar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const t=b.dataset.tab;if(tab===t&&!$('sheet').hidden)closeSheet();else openSheet(t)});
$('sclose').addEventListener('click',closeSheet);
function openSheet(t){tab=t;const wd=t==='wiedza'||t==='natura'||t==='wyprawy';$('sheet').classList.toggle('wide',wd);document.body.classList.toggle('wide',wd);$('sheet').hidden=false;$('sheet').classList.remove('min');$('smin').innerHTML=ico('minus');$('res').classList.remove('on');document.body.classList.add('open');renderPanel()}
function closeSheet(){$('sheet').hidden=true;document.body.classList.remove('open');tab=null;[...$('tabbar').children].forEach(b=>b.classList.remove('on'))}
$('cancel').addEventListener('click',cancelPlace);
let toastT=0;function toast(t){const el=$('toast');el.textContent=t;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2800)}
function toastOnce(k,t){if(S.seen[k])return;S.seen[k]=1;toast(t)}
const fmt=v=>Math.floor(v+1e-6);
const costHTML=c=>Object.entries(c).map(([k,v])=>`<span class="${S&&(S.res[k]||0)>=v?'':'no'}">${RN[k].toLowerCase()} ${v}</span>`).join(' · ');
const skillTags=(p,max)=>Object.keys(CN).filter(c=>p.sk[c]>0).sort((a,b)=>p.sk[b]-p.sk[a]).slice(0,max||3).map(c=>`<span class="tag">${CN[c]} ${p.sk[c]}</span>`).join('');
let landCount=0;for(let k=0;k<N*N;k++)if(land[k])landCount++;
function jobLabel(p){if(isChild(p))return'dziecko';if(p.job==='wyp')return'na wyprawie';if(p.job==='wb'){const b=bById(p.wb);return b?BD[b.kind].n.toLowerCase():'robotnik'}if(p.job==='zwiad')return'zwiadowca';if(p.job==='zdun')return'próby';if(p.job==='czyt')return'czytelnik';return'robotnik'}
function workBuildings(){return S.bld.filter(b=>BD[b.kind].wk)}
function renderPanel(){
 if($('sheet').hidden||!S||!tab)return;
 [...$('tabbar').children].forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
 $('stitle').textContent=TABS.find(t=>t[0]===tab)[1];
 const el=$('body'),st=el.scrollTop;let h='';
 if(tab==='osada'){h+=troubleHTML()+reqHTML();h+=`<div class="card"><h4>Niezgoda ${Math.round((S.dis||0)*100)}%</h4><p>${(S.dis||0)<.35?'Ludzie trzymają się razem.':(S.dis||0)<.6?'Słychać szemranie. Ludzie pracują trochę wolniej.':(S.dis||0)<.85?'Kłótnie co wieczór. Praca idzie wyraźnie wolniej.':'Osada się rozpada. Ktoś może odejść w głąb wyspy.'}</p><p class="mut">Rośnie przez głód, zimno, brak wody, śmierć, pożary, surowe prawa i niespełnione prośby. Spada, gdy prośby są spełniane, przy wieczorach przy ognisku i wspólnych posiłkach.</p></div>`+custHTML();h+='<h3>Osada</h3>';const pop=S.people.length,kids=S.people.filter(isChild).length,old=S.people.filter(p=>p.age>55).length;
  const houses=S.bld.filter(b=>bDone(b)&&BD[b.kind].house).length;const homeless=S.people.filter(p=>!homeOf(p)).length;const nt=TIERS[S.tier+1];
  h+=`<div class="card"><h4>${TIERS[S.tier][0]}</h4><p>${pop} osób: ${pop-kids-old} dorosłych, ${kids} dzieci, ${old} starszych. Domów: ${houses}, bez dachu: ${homeless}.</p><p class="mut">Urodzeni: ${S.born} · zmarli: ${S.died}${nt?` · następny poziom (${nt[0].toLowerCase()}): ${nt[1]} domów i ${nt[2]} osób`:''}</p></div>`;
  h+=`<h3>Zapasy</h3><div class="card"><p><b>Żywność ${fmt(foodTotal())}/${foodCap()}</b> · rodzajów: ${S.variety}</p><p>${FOOD.map(k=>`${RN[k].toLowerCase()} ${fmt(S.res[k])}`).join(' · ')}</p>`+
   `<p>opał ${fmt(S.res.opal)} · kłody ${fmt(S.res.drewno)} · kamień ${fmt(S.res.kamien)} · glina ${fmt(S.res.glina)}</p><p>narzędzia: żelazne ${fmt(S.res.narz)}, kamienne ${fmt(S.res.narzk)} · odzież ${fmt(S.res.odziez)} · skóry ${fmt(S.res.skory)}</p><p>ruda ${fmt(S.res.ruda)} · węgiel ${fmt(S.res.wegiel)} · włókna ${fmt(S.res.wlokna)}</p><p>deski ${fmt(S.res.deski)} · gwoździe ${fmt(S.res.gwozdzie)} · płótno ${fmt(S.res.plotno)}${S.res.cegla?` · cegły ${fmt(S.res.cegla)}`:''}</p></div>`;
  S.goals=S.goals||{};h+='<h3>Cele</h3><div class="card">'+GOALS.map((g,i)=>`<p>${S.goals[i]?'<span class="ok">✓</span>':'<span class="mut">○</span>'} ${g[0]}</p>`).join('')+'</div>';
  h+=pamHTML()+rodyHTML()+hamletHTML();h+='<h3>Rodziny</h3>';
  Object.values(S.fams).forEach(f=>{const mem=famMembers(f.id);if(!mem.length)return;const hm=f.home?bById(f.home):null;
   h+=`<div class="card"><h4>Rodzina ${famName(f.id)}</h4><p class="mut">${hm?BD[hm.kind].n:'bez domu, śpi w obozie'}</p>`+mem.sort((a,b)=>b.age-a.age).map(p=>`<div class="row" data-p="${p.id}" style="cursor:pointer;padding:5px 0"><div class="n"><b style="color:var(--hi)">${p.name}</b> <span class="mut">${Math.floor(p.age)} l. · ${traitN(p).toLowerCase()}</span><small>${jobLabel(p)} · ${p.act}${p.mentor?' · uczy się od: '+p.mentor.name:''}</small><div>${skillTags(p,3)}</div></div></div>`).join('')+`</div>`})}
 else if(tab==='praca'){const wbs=workBuildings();
  h+=`<p class="lead">Wolne ręce: <b style="color:var(--hi)">${freeCount()}</b> z ${adultsPool().length}. Wolni pracują jako robotnicy: budują i rozbierają wrak.</p>`;
  if(!wbs.length)h+='<p class="lead">Nie ma jeszcze budynków roboczych. Postaw chatę zbieracza i chatę drwala w zakładce Budowa.</p>';
  wbs.forEach(b=>{const d=BD[b.kind];const ws=S.people.filter(p=>p.job==='wb'&&p.wb===b.id);const n=countInRange(b.kind,b.i,b.j);
   h+=`<div class="row"><div class="n">${d.n}${bDone(b)?'':' <span class="mut">(w budowie)</span>'}<small>${ws.length?ws.map(p=>p.name).join(', '):'nikt nie pracuje'}${n!==null?' · '+rangeLabel(b.kind,n):''}</small></div><button class="mini" data-w="${b.id}" data-d="-1" aria-label="Mniej">−</button><span class="cnt">${b.want||0}/${wkOf(b)}</span><button class="mini" data-w="${b.id}" data-d="1" aria-label="Więcej">+</button></div>`});
  h+='<h3>Bez budynku</h3>';
  let c=0;for(let k=0;k<N*N;k++)if(rev[k]&&land[k])c++;
  h+=`<div class="row"><div class="n">Zwiadowcy<small>Odsłaniają wyspę. Odkryto ${Math.round(100*c/landCount)}%.</small></div><button class="mini" data-al="zwiad" data-d="-1">−</button><span class="cnt">${S.alloc.zwiad||0}</span><button class="mini" data-al="zwiad" data-d="1">+</button></div>`;
  h+=`<div class="row"><div class="n">Próby<small>Zduni i kowale prowadzą próby z zakładki Wiedza.</small></div><button class="mini" data-al="zdun" data-d="-1">−</button><span class="cnt">${S.alloc.zdun||0}</span><button class="mini" data-al="zdun" data-d="1">+</button></div>`;
  const unread=Object.keys(S.books).filter(k=>S.books[k]===1);h+=`<div class="row"><div class="n">Czytelnicy<small>${unread.length?'Do przeczytania: '+unread.map(k=>'„'+BOOKS[k]+'” '+Math.round(100*(S.readP[k]||0)/200)+'%').join(', '):'Brak nieprzeczytanych ksiąg.'}</small></div><button class="mini" data-al="czyt" data-d="-1">−</button><span class="cnt">${S.alloc.czyt||0}</span><button class="mini" data-al="czyt" data-d="1">+</button></div>`;
  const W=S.wreck;h+='<h3>Wrak</h3>';
  if(W.gone)h+='<p class="lead">Wraku już nie ma. Zabrał go wiosenny sztorm.</p>';
  else{const left=YEAR-5-Math.floor(S.day);h+=`<p class="lead">Robotnicy bez innej pracy rozbierają wrak. Każda pora roku niszczy część ładunku, a za ${left} dni sztorm może go zabrać.</p>`;
   W.parts.forEach((pt,i)=>{const it=Object.entries(pt.items).filter(([k,v])=>v>0).map(([k,v])=>k.startsWith('ks_')?'księga':RN[k].toLowerCase()+' '+v);
    h+=`<div class="card"><h4 style="font-size:15px">${pt.n}</h4>`+(pt.open?`<p>${it.length?it.join(' · '):'pusto'}</p>${it.length?`<button data-wt="${i}" ${W.target===i?'class="pri"':''}>${W.target===i?'Wynoszą to najpierw':'Wynieś najpierw'}</button>`:''}`:
     `<p class="mut">Nierozpoznane. Trzeba się dostać do środka.</p>${W.target===i?`<div class="pbar"><div style="width:${Math.round(100*(pt.prog||0)/pt.need)}%"></div></div>`:''}<button data-wt="${i}" ${W.target===i?'class="pri"':''}>${W.target===i?'Rozpoznają':'Rozpoznaj'}</button>`)+`</div>`})}}
 else if(tab==='wyprawy'){h+=expHTML()}
 else if(tab==='natura'){h+=natureHTML()}
 else if(tab==='budowa'){const need=S.bld.filter(b=>bDone(b)&&condOf(b)<.5);
  if(!buildCat)buildCat=S.bld.some(b=>b.kind==='zbieracz')?'dom':'jedzenie';
  h+=`<div class="dchips bchips">${CATS.map(([c,cn])=>{const ks=BKEYS.filter(k=>BD[k].cat===c);const av=ks.filter(bAvail).length;return`<button data-bcat="${c}" class="${buildCat===c?'on':''}">${cn}<small>${av}/${ks.length}</small></button>`}).join('')}<button data-bcat="remont" class="${buildCat==='remont'?'on':''}">Remonty<small${need.length?' style="color:var(--ember)"':''}>${need.length?need.length+' do zrobienia':'w porządku'}</small></button>${typeof ladChip==='function'?ladChip():''}</div>`;
  const sites=S.bld.filter(b=>!bDone(b));if(sites.length){h+=`<div class="card"><h4 style="font-size:15px">Place budowy</h4>${sites.map(s=>{const pc=Math.round(100*s.prog/s.work);return`<div class="cost" style="margin-top:4px">${BD[s.kind].n} · ${pc}% · przy pracy: ${s.workers||0}</div><div class="pbar"><div style="width:${pc}%"></div></div>`}).join('')}</div>`}
  if(buildCat==='lad'&&typeof ladBuildHTML==='function'){h+=ladBuildHTML()}else if(buildCat==='remont'){h+=`<div class="card"><h4>Remonty</h4><p>Budynki zużywają się co roku: szybciej nad morzem, na mokradłach i w górach, wolniej, gdy są wyżej ulepszone. Remont potrzebny jest zwykle co 2–3 lata.</p><p class="mut">${need.length?'Wymaga remontu: '+need.map(b=>BD[b.kind].n.toLowerCase()+' '+Math.round(condOf(b)*100)+'%').join(', ')+'.':'Wszystko w dobrym stanie.'}</p><button data-autorep="1" class="${S.autoRep!==false?'pri':''}">${S.autoRep!==false?'Remonty automatyczne: włączone':'Remonty automatyczne: wyłączone'}</button></div>`}
  else{const ks=BKEYS.filter(k=>BD[k].cat===buildCat).sort((a,b)=>(bAvail(b)?1:0)-(bAvail(a)?1:0));
   ks.forEach(k=>{const d=BD[k],av=bAvail(k),cnt=S.bld.filter(b=>b.kind===k).length;
    h+=`<div class="card"${av?'':' style="opacity:.62"'}><h4>${d.n}${cnt?`<small style="font-weight:400;color:var(--mut);font-size:12px"> · masz ${cnt}</small>`:''}</h4><p>${d.d}</p>${av?`<div class="cost">${costHTML(d.cost)} · ${d.work} osobodni${d.wk?` · ${d.wk} prac.`:''}${d.r?` · zasięg ${d.r}`:''}</div><button class="pri" style="margin-top:7px" data-b="${k}">Postaw</button>`:`<div class="cost">Najpierw trzeba poznać: ${TECH_BY[d.need]?'„'+TECH_BY[d.need].n+'” (Wiedza)':{pole:'uprawę pola (Wiedza)',piec:'budowę pieca (Wiedza, próby)',cegla:'wypał cegły (Wiedza, próby)',kuznia:'wytop żelaza (Wiedza, próby)'}[d.need]||'odpowiednią wiedzę'}.</div>`}</div>`})}}
 else if(tab==='wiedza'){const k=S.know;const mason=adultsPool().sort((a,b)=>b.sk.murarz-a.sk.murarz)[0]||S.people[0];
  h+=techHTML();h+='<h3>Próby</h3><p class="lead">Niektórych rzeczy nie da się wyczytać ani podpatrzyć. Trzeba spróbować, często wiele razy. Próby prowadzą zduni (zakładka Praca).</p>';
  h+=`<div class="card"><h4>Wypał cegły</h4><p>Źródło: praktyka i mistrz (${mason.name}, murarz ${mason.sk.murarz}). Pierwsze wypały często pękają.</p>`+
   (k.cegla==='tak'?'<p class="ok">Poznane. Możesz postawić piec do cegły.</p>':`<div class="cost">${costHTML({glina:8,drewno:6})}${k.cegla_f?` · porażki: ${k.cegla_f}`:''}</div>`+
   (k.active==='cegla'?`<div class="pbar"><div style="width:${Math.round(100*k.cegla_p/150)}%"></div></div><p class="mut">Próba trwa. Zdun musi być przy pracy.</p>`:`<button class="pri" style="margin-top:7px" data-try="cegla">Spróbuj</button>`))+`</div>`;
  h+=`<div class="card"><h4>Piec zduński</h4><p>Źródło: fragmenty podręcznika zduńskiego z wraku, mistrz i próby. Książka opisuje sklepienie i ciąg, ale nie zastąpi ręki.</p>`+
   (k.piec==='tak'?'<p class="ok">Poznane. Możesz postawić piec zduński.</p>':k.cegla!=='tak'?'<div class="cost"><span class="no">Najpierw trzeba poznać wypał cegły.</span></div>':`<div class="cost">${costHTML({cegla:6})}${k.piec_f?` · porażki: ${k.piec_f}`:''}</div>`+
   (k.active==='piec'?`<div class="pbar"><div style="width:${Math.round(100*k.piec_p/240)}%"></div></div><p class="mut">Próba trwa.</p>`:`<button class="pri" style="margin-top:7px" data-try="piec">Spróbuj</button>`))+`</div>`;
  const kz=k.kuznia||'nie';h+=`<div class="card"><h4>Kuźnia</h4><p>Źródło: „${BOOKS.kowal}” z kajuty kapitana, kowal (${(adultsPool().sort((a,b)=>b.sk.kowal-a.sk.kowal)[0]||{name:'-'}).name}) i próby wytopu.</p>`+
   (kz==='tak'?'<p class="ok">Poznane. Możesz postawić kuźnię.</p>':S.books.kowal!==2?`<div class="cost"><span class="no">${S.books.kowal===1?'Księgę trzeba przeczytać (czytelnicy w zakładce Praca).':'Księga leży w kajucie kapitana na wraku.'}</span></div>`:`<div class="cost">${costHTML(TRIAL.kuznia.cost)}${k.kuznia_f?` · porażki: ${k.kuznia_f}`:''}</div>`+
   (k.active==='kuznia'?`<div class="pbar"><div style="width:${Math.round(100*k.kuznia_p/240)}%"></div></div><p class="mut">Próba trwa.</p>`:`<button class="pri" style="margin-top:7px" data-try="kuznia">Spróbuj</button>`))+`</div>`;
  h+=`<div class="card"><h4>Pole</h4><p>Źródło: obserwacja dzikiego zboża albo księga „${BOOKS.siew}”.</p>${k.pole==='tak'?'<p class="ok">Poznane. Pola są w zakładce Budowa.</p>':`<p class="mut">Zbieracze zebrali ${Math.floor(S.zbozeTot)} z 25 ziarna potrzebnych do odkrycia.</p>`}</div>`;
  h+=`<div class="card"><h4>Uczniowie i dzieci</h4><p>Kto pracuje obok mistrza swojego fachu, uczy się dwa razy szybciej. Dzieci od szóstego roku podpatrują rodziców. Gdy mistrz umiera bez następcy, jego wiedza ginie.</p><p>${Object.keys(S.bonus).length?'Ulepszenia uczniów: '+Object.entries(S.bonus).map(([c,v])=>`${CN[c]} +${Math.round(v*100)}%`).join(', '):'Ulepszeń uczniów jeszcze nie ma.'}</p></div>`;
  h+=`<div class="card"><h4>Księgi</h4>${Object.keys(BOOKS).map(b=>`<p>„${BOOKS[b]}”: ${S.books[b]===2?'<span class="ok">przeczytana</span>':S.books[b]===1?'do przeczytania':'<span class="mut">na wraku</span>'}</p>`).join('')}</div>`;
  h+=typeof sladHTML==='function'?sladHTML():''}
 else{h+=kronTools()+'<div class="log">'+S.log.map(l=>`<p><small>doba ${l.d}</small>${l.t}</p>`).join('')+'</div>'}
 if(h!==el._h){el._h=h;el.innerHTML=h;el.scrollTop=st}}
let buildCat=null;
function onPanelClick(e){const t=e.target.closest('button,[data-p],[data-rg]');if(!t)return;
 if(t.dataset.bcat){buildCat=t.dataset.bcat;$('body')._h=null;renderPanel();$('body').scrollTop=0;return}
 if(t.dataset.w){const b=bById(+t.dataset.w);if(b)setWant(b,+t.dataset.d)}
 else if(t.dataset.al)setAlloc(t.dataset.al,+t.dataset.d);
 else if(t.dataset.b)startPlace(t.dataset.b);
 else if(t.dataset.wt!==undefined){const i=+t.dataset.wt;S.wreck.target=S.wreck.target===i?-1:i;renderPanel()}
 else if(t.dataset.try){const k=S.know,id=t.dataset.try;const cost=TRIAL[id].cost;if(k.active){toast('Trwa już inna próba');return}
  if(!canAfford(cost)){toast('Brakuje materiałów na próbę');return}
  if(!S.people.some(p=>p.job==='zdun')){if(freeCount()>0){S.alloc.zdun=Math.max(1,S.alloc.zdun);assign();toast('Przydzieliłem zduna (zakładka Praca)')}else{toast('Przydziel zduna w zakładce Praca');return}}
  Object.entries(cost).forEach(([a,b])=>S.res[a]-=b);k.active=id;k[id+'_p']=0;log('Zaczyna się próba: '+TRIAL[id].n.toLowerCase()+'.');assign();renderPanel()}
 else if(t.dataset.up){upgradeB(+t.dataset.up)}
 else if(t.dataset.rep){startProj(bById(+t.dataset.rep),'rep')}
 else if(t.dataset.autorep){S.autoRep=!S.autoRep;renderPanel()}
 else if(t.dataset.lv){startProj(bById(+t.dataset.lv),'lv')}
 else if(t.dataset.ext){startProj(bById(+t.dataset.ext),'ext',t.dataset.eid)}
 else if(t.dataset.cust){custChange(t.dataset.cust,t.dataset.co)}
 else if(t.dataset.ex){sendExp(+t.dataset.ex,t.dataset.et)}
 else if(t.dataset.xs){S.expSize=clamp(S.expSize+(+t.dataset.xs),1,6);renderPanel()}
 else if(t.dataset.rg){const r=REGIONS[+t.dataset.rg];if(innerWidth<=760)closeSheet();lookAt(tcx(r.i),tcx(r.j),.9)}
 else if(t.dataset.dom){techDom=t.dataset.dom;techSel=null;renderPanel()}
 else if(t.dataset.tn){techSel=t.dataset.tn;renderPanel()}
 else if(t.dataset.focus){const tt=TECH_BY[t.dataset.focus];S.focus[tt.d]=tt.id;toast('Osada skupia się na: '+tt.n);renderPanel()}
 else if(t.dataset.p){const id=+t.dataset.p;select(id);follow=true;if(innerWidth<=760)closeSheet()}
 else if(t.dataset.x==='close')select(null)}
$('body').addEventListener('click',onPanelClick);
$('body').addEventListener('change',e=>{const t=e.target;if(t.dataset&&t.dataset.off)setOffice(t.dataset.off,t.value)});
$('sel').addEventListener('click',onPanelClick);
function renderSel(){const el=$('sel');
 if(selB!==null){const b=bById(selB);if(!b){selB=null;el.style.display='none';return}const d=BD[b.kind];el.style.display='block';let h=`<h4>${d.n}</h4>`;
  if(!bDone(b))h+=`<p>W budowie: ${Math.round(100*b.prog/b.work)}% · przy pracy: ${b.workers||0}</p>`;
  else if(d.wk){const ws=S.people.filter(p=>p.job==='wb'&&p.wb===b.id);const n=countInRange(b.kind,b.i,b.j);
   h+=`<p>${ws.length?ws.map(p=>p.name+' ('+p.act+')').join(', '):'Nikt tu nie pracuje.'}</p>${n!==null?`<p class="mut">${rangeLabel(b.kind,n)}</p>`:''}${d.prod?`<p class="mut">${[].concat(d.prod).map(pr=>Object.entries(pr.in).map(([r,v])=>RN[r].toLowerCase()+' '+v).join(' + ')+' → '+Object.entries(pr.out).map(([r,v])=>RN[r].toLowerCase()+' '+v).join(', ')).join('<br>')}</p>`:''}
   <div class="row" style="border:0;padding:4px 0 0"><div class="n">Pracownicy</div><button class="mini" data-w="${b.id}" data-d="-1">−</button><span class="cnt">${b.want||0}/${wkOf(b)}</span><button class="mini" data-w="${b.id}" data-d="1">+</button></div>${slowHTML(b)}`}
  else if(d.pen||d.field){}
  if(bDone(b)&&d.pen)h+=`<p>Kozy w zagrodzie: ${b.animals||0}/10 · ${goatStage(b)}</p>`;
  if(bDone(b)&&d.field){const f=b.field||{st:'puste',g:0,fert:1};h+=`<p>${{puste:'Pole czeka na siew',rosnie:'Rośnie: '+Math.round(f.g*100)+'%, plewienie '+Math.round((f.q||0)*100)+'%',dojrzale:'Dojrzałe, do zebrania: '+f.left}[f.st]} · żyzność ${Math.round(f.fert*100)}% · odmiana wyspowa ${Math.round((S.adapt||0)*100)}%</p>`}
  h+=bldPanelHTML(b);
  if(b.fire)h+=`<p class="no">Pali się! Zostało ${Math.round(b.fire.hp*100)}%. Gaszenie: ${Math.round((1-b.fire.s)*100)}%.</p>`;
  if(bDone(b)&&UPG[b.kind]){const to=UPG[b.kind],av=bAvail(to);h+=av?`<p class="mut">Rozbudowa: ${BD[to].n.toLowerCase()} · ${costHTML(upCost(b.kind,to))}</p><button class="pri" data-up="${b.id}" style="margin:2px 0 6px">Rozbuduj</button>`:`<p class="mut">Rozbudowa w ${BD[to].n.toLowerCase()}: najpierw ${to==='dom'?'piec zduński (Wiedza)':'wiedza'}.</p>`}
  if(d.house){const f=Object.values(S.fams).find(x=>x.home===b.id);h+=f?`<p>Rodzina ${famName(f.id)}: ${famMembers(f.id).map(p=>p.name).join(', ')}.</p>`:'<p>Wolny dom. Zamieszka w nim rodzina bez dachu albo młoda para.</p>'}
  if(d.store)h+=`<p>Mieści ${d.cap} żywności${d.store==='all'?' i dowolne surowce':''}.</p>`;
  h+=`<p class="mut">${d.d}</p>`;if(el._h!==h){el._h=h;el.innerHTML=h}return}
 if(selId===null){el.style.display='none';return}const p=pById(selId);if(!p){selId=null;el.style.display='none';return}el.style.display='block';
 const tl=['bez narzędzi','narzędzia kamienne','narzędzia żelazne'][p.tool.t];
 const hh=`<h4>${p.name} <span class="mut" style="font-size:13px">${Math.floor(p.age)} l.</span></h4><p>${jobLabel(p)} · ${p.act}</p><p class="mut">${traitN(p)}: ${TRAITS[p.trait][1]}</p><div>${skillTags(p,6)||'<span class="tag">bez fachu</span>'}</div><p class="mut">rodzina ${famName(p.fam)} · zdrowie ${Math.round(p.hp*100)}%${isAdult(p)?' · '+tl:''}${p.coat<=0?' · bez ciepłej odzieży':''}</p>${p.mentor?`<p class="mut">uczy się od: ${p.mentor.name}</p>`:''}`+ludCard(p);if(el._h!==hh){el._h=hh;el.innerHTML=hh}}
const v3=new THREE.Vector3();
function placeLabel(){const el=$('lbl');if(selId===null||!S){el.style.display='none';return}const p=pById(selId);if(!p){el.style.display='none';return}v3.set(p.x,Hy(p.x,p.z)+2.1,p.z).project(cam);
 if(Math.abs(v3.x)>1||Math.abs(v3.y)>1){el.style.display='none';return}el.style.display='block';el.textContent=p.name;el.style.left=((v3.x+1)/2*innerWidth)+'px';el.style.top=((1-v3.y)/2*innerHeight)+'px'}
function setH(el,h){if(el&&el._h!==h){el._h=h;el.innerHTML=h}}
function renderTop(){
 const d=Math.floor(rday()),s=Math.floor(d/SD),t=tod();const part=t<.2?'noc':t<.3?'świt':t<.7?'dzień':t<.82?'zmierzch':'noc';
 const wk=S.weather.k,wi=wk==='clear'||wk==='drought'?(part==='noc'?'moon':'sun'):wk==='frost'?'snow':wk;
 setH($('date'),`<div><b>${SEAS[s]} · ${d%SD+1}</b><small>Rok ${Math.floor(S.day/YEAR)+1} · ${part} · ${WEATHER[wk][0]}${tech('n_kal')&&S.weather.next?` → ${WEATHER[S.weather.next][0]}`:''}</small></div>${ico(wi)}`);
 const need=K*S.people.reduce((a,p)=>a+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)*(law('oszczedne')?.8:1)||1;const days=foodTotal()/need;
 const fc=days<2?' bad':days<5?' warn':'',oc=seasonIdx()>=1&&S.res.opal<20?' warn':'';
 setH($('stats'),`<div class="st${fc}">${ico('zywnosc')}<div><b>${fmt(foodTotal())}<small> / ${days>=99?'99+':Math.floor(days)} d</small></b><span>Żywność</span></div></div><div class="st">${ico('drewno')}<div><b>${fmt(S.res.drewno)}</b><span>Drewno</span></div></div><div class="st${oc}">${ico('opal')}<div><b>${fmt(S.res.opal)}</b><span>Opał</span></div></div><div class="st">${ico('ludzie')}<div><b>${S.people.length}</b><span>Ludzie</span></div></div><div class="more">${ico('chev')}</div>`);
 const items=[['zywnosc','Żywność',foodTotal(),'/'+foodCap()],['opal','Opał',S.res.opal],['drewno','Kłody',S.res.drewno],['kamien','Kamień',S.res.kamien],['glina','Glina',S.res.glina],['narz','Narzędzia',S.res.narz+S.res.narzk],['odziez','Odzież',S.res.odziez],['skory','Skóry',S.res.skory],['deski','Deski',S.res.deski],['gwozdzie','Gwoździe',S.res.gwozdzie],['plotno','Płótno',S.res.plotno]];
 if(S.res.cegla>0||S.know.cegla==='tak')items.push(['cegla','Cegły',S.res.cegla]);['ruda','wegiel','wlokna','maka','naczynia'].forEach(k=>{if(S.res[k]>0)items.push([k,RN[k],S.res[k]])});
 setH($('res'),items.map(([k,n,v,ex])=>`<span title="${n}">${ico(k)}<em>${n}</em>${fmt(v)}${ex?`<small>${ex}</small>`:''}</span>`).join(''));
 const col=v=>v<.35?'var(--bad)':v<.65?'var(--ember)':'var(--moss)';
 const nd=[['Żywność',Math.min(1,days/10),Math.round(Math.min(1,days/10)*100)+'%',days<2?'var(--bad)':days<5?'var(--ember)':'var(--moss)'],
  ['Ciepło',S.warm,Math.round(S.warm*100)+'%',col(S.warm)],['Zdrowie',S.health,Math.round(S.health*100)+'%',col(S.health)],['Woda',Math.min(1,waterCap()/Math.max(1,S.people.length)),waterNeedOn()?Math.round(Math.min(1,waterCap()/Math.max(1,S.people.length))*100)+'%':'ok',waterNeedOn()?col(Math.min(1,waterCap()/Math.max(1,S.people.length))):'var(--moss)'],['Nadzieja',S.hope,Math.round(S.hope*100)+'%',col(S.hope)],['Niezgoda',S.dis||0,Math.round((S.dis||0)*100)+'%',(S.dis||0)>.65?'var(--bad)':(S.dis||0)>.35?'var(--ember)':'var(--moss)']];
 setH($('needs'),nd.map(([n,v,tx,c])=>`<div class="need"><span>${n}<b>${tx}</b></span><div class="nb"><div style="width:${Math.round(v*100)}%;background:${c}"></div></div></div>`).join(''));
 const gi=goalInfo();const gl=$('goal');gl.classList.toggle('min',goalMin);
 setH(gl,gi?`<div class="ey"><span>${gi.ch}</span>${ico(goalMin?'plus':'minus')}</div><div class="t">${gi.t}</div><div class="d">${gi.d}</div>`:`<div class="ey"><span>Kronika</span></div><div class="t">Wszystkie cele osiągnięte</div>`)}
