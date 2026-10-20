
/* ================= 3.1: zwierzęta — nowe modele i chód (pozy przełączane jak klatki) ================= */
const ZV={v:new THREE.Vector3(),u:new THREE.Vector3(0,1,0),q:new THREE.Quaternion(),s:new THREE.Vector3(1,1,1)};
// odcinek od punktu A do B (zwężający się walec), z kolorem
function zLimb(T,A,B,r1,r2,col,seg){const dx=B[0]-A[0],dy=B[1]-A[1],dz=B[2]-A[2],len=Math.hypot(dx,dy,dz)||1e-3;ZV.v.set(dx/len,dy/len,dz/len);ZV.q.setFromUnitVectors(ZV.u,ZV.v);
 const m=new THREE.Matrix4().compose(new THREE.Vector3((A[0]+B[0])/2,(A[1]+B[1])/2,(A[2]+B[2])/2),ZV.q.clone(),ZV.s);T.push([new THREE.CylinderGeometry(r2,r1,len,seg||7),col,m])}
function zBall(T,x,y,z,rx,ry,rz,col,ws,hs,rot){T.push([new THREE.SphereGeometry(1,ws||12,hs||9),col,mdM(x,y,z,rot?rot[0]:0,rot?rot[1]:0,rot?rot[2]:0,rx,ry,rz)])}
function zCone(T,x,y,z,r,h,col,rx,ry,rz,seg){T.push([new THREE.ConeGeometry(r,h,seg||6),col,mdM(x,y,z,rx||0,ry||0,rz||0)])}
// noga: biodro H, kąt wykroku s (do przodu +), długości u/l, grubości; zwraca stopę
function zLeg(T,H,s,k,u,l,r,col,colLo,hoof,front){const K=[H[0]+u*Math.sin(s),H[1]-u*Math.cos(s),H[2]];const s2=front?s*.35-k:s*1.25+k;const F=[K[0]+l*Math.sin(s2),Math.max(.012,K[1]-l*Math.cos(s2)),K[2]];
 zLimb(T,H,K,r,r*.72,col,7);zBall(T,K[0],K[1],K[2],r*.72,r*.72,r*.72,col,7,5);zLimb(T,K,F,r*.7,r*.48,colLo||col,6);if(hoof)T.push([new THREE.CylinderGeometry(r*.5,r*.55,.035,6),hoof,mdM(F[0]+.006,F[1]+.01,F[2])]);return F}
const C3=(r,g,b)=>new THREE.Color(r,g,b);
// łączenie części; kolor części może być funkcją wysokości (−1 spód … 1 grzbiet) liczonej przed przekształceniem
function zMerge(parts){let n=0;const gs=parts.map(([g,c,m])=>{let q=g.index?g.toNonIndexed():g.clone();const k=q.attributes.position.count,cols=new Float32Array(k*3);
  if(typeof c==='function'){const pa=q.attributes.position.array;let lo=1e9,hi=-1e9;for(let i=0;i<k;i++){lo=Math.min(lo,pa[i*3+1]);hi=Math.max(hi,pa[i*3+1])}for(let i=0;i<k;i++){const t=hi>lo?((pa[i*3+1]-lo)/(hi-lo))*2-1:0;const cc=c(t);cols[i*3]=cc.r;cols[i*3+1]=cc.g;cols[i*3+2]=cc.b}}
  else{const cc=mdCol(c);for(let i=0;i<k;i++){cols[i*3]=cc.r;cols[i*3+1]=cc.g;cols[i*3+2]=cc.b}}
  if(m)q.applyMatrix4(m);if(!q.attributes.normal)q.computeVertexNormals();n+=k;return[q,cols]});
 const P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);let o=0;
 for(const[q,cols]of gs){const k=q.attributes.position.count;P.set(q.attributes.position.array,o*3);N.set(q.attributes.normal.array,o*3);C.set(cols,o*3);o+=k;q.dispose()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingSphere();return g}
const zMix=(a,b,t)=>new THREE.Color(a.r+(b.r-a.r)*t,a.g+(b.g-a.g)*t,a.b+(b.b-a.b)*t);
const zSm=(e0,e1,x)=>{const t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t)};
const zGrad=sp=>t=>{let c=zMix(sp.belly,sp.col,zSm(-.75,-.1,t));return zMix(c,sp.dark,zSm(.45,.95,t))};
// opis gatunków: wymiary, kolory, cechy
const ZSP={
 sarna:{L:.56,ry:.13,rz:.1,u:.21,l:.21,lr:.034,col:C3(.46,.27,.13),dark:C3(.32,.19,.1),belly:C3(.7,.58,.44),leg:C3(.36,.23,.13),lo:C3(.26,.17,.1),hoof:C3(.08,.06,.05),neck:[.5,.23,.045],head:[.075,.058,.055],snout:[.09,.03],ear:[.032,.1,'up'],tail:'puch',rump:C3(.88,.85,.78),graze:1,step:5.5},
 koza:{L:.46,ry:.135,rz:.11,u:.15,l:.15,lr:.034,col:C3(.6,.53,.43),dark:C3(.38,.31,.24),belly:C3(.72,.66,.56),leg:C3(.45,.38,.3),lo:C3(.32,.27,.21),hoof:C3(.1,.08,.06),neck:[.62,.15,.05],head:[.07,.06,.05],snout:[.07,.035],ear:[.025,.08,'side'],tail:'kozi',horn:1,beard:1,graze:1,step:5},
 dzik:{L:.62,ry:.17,rz:.135,u:.12,l:.13,lr:.042,col:C3(.24,.19,.14),dark:C3(.14,.11,.08),belly:C3(.3,.24,.18),leg:C3(.18,.14,.1),lo:C3(.12,.09,.07),hoof:C3(.05,.04,.03),neck:[1.25,.08,.11],head:[.12,.1,.09],snout:[.17,.065],ear:[.035,.08,'up'],tail:'cienki',tusk:1,mane:1,graze:1,step:6},
 wilk:{L:.6,ry:.125,rz:.1,u:.2,l:.2,lr:.034,col:C3(.44,.42,.38),dark:C3(.28,.27,.25),belly:C3(.66,.64,.58),leg:C3(.4,.38,.34),lo:C3(.34,.32,.29),neck:[.95,.15,.07],head:[.085,.07,.065],snout:[.13,.04],ear:[.03,.09,'up'],tail:'pita',step:6},
 pies:{L:.54,ry:.12,rz:.095,u:.17,l:.17,lr:.032,col:C3(.34,.33,.31),dark:C3(.26,.25,.23),belly:C3(.44,.43,.4),leg:C3(.32,.31,.29),lo:C3(.3,.29,.27),neck:[.85,.14,.065],head:[.085,.072,.068],snout:[.1,.042],ear:[.032,.08,'klap'],tail:'zakrecony',step:6.5},
 lis:{L:.42,ry:.085,rz:.07,u:.12,l:.12,lr:.022,col:C3(.8,.42,.15),dark:C3(.6,.3,.1),belly:C3(.92,.88,.8),leg:C3(.7,.36,.13),lo:C3(.12,.08,.06),neck:[.9,.1,.045],head:[.06,.05,.05],snout:[.1,.025],ear:[.032,.09,'up'],tail:'lisia',step:7},
 zajac:{L:.3,ry:.1,rz:.08,u:.07,l:.08,lr:.022,col:C3(.56,.47,.35),dark:C3(.42,.35,.26),belly:C3(.78,.72,.62),leg:C3(.5,.42,.32),lo:C3(.46,.39,.3),neck:[.4,.06,.04],head:[.055,.05,.045],snout:[.04,.025],ear:[.022,.17,'dlugie'],tail:'pompon',hare:1,graze:1,step:4},
 niedzwiedz:{L:.92,ry:.25,rz:.2,u:.2,l:.21,lr:.08,col:C3(.24,.16,.09),dark:C3(.15,.1,.06),belly:C3(.2,.14,.08),leg:C3(.24,.17,.1),lo:C3(.18,.13,.08),hoof:C3(.08,.06,.04),neck:[1.15,.14,.13],head:[.14,.12,.12],snout:[.1,.06],ear:[.04,.04,'krag'],tail:'kikut',hump:1,step:3.2}};
function zQuad(sp,pose,variant){const T=[];const rx=sp.L/2,legH=sp.u+sp.l,by=legH+sp.ry*.72;const grz=pose==='graze',w=pose==='walkA'?1:pose==='walkB'?-1:0;
 const hop=sp.hare&&w!==0;const bodyTilt=sp.hare?(hop?-.25:-.12):0;
 // tułów: kłoda z piersią i zadem
 const GR=zGrad(sp);zBall(T,0,by,0,rx,sp.ry,sp.rz,GR,16,12,[0,0,bodyTilt]);zBall(T,rx*.52,by+sp.ry*.06,0,rx*.46,sp.ry*1.04,sp.rz*1.04,GR,14,10);zBall(T,-rx*.55,by+(sp.hare?sp.ry*.35:0),0,rx*.45,sp.ry*.98,sp.rz*1.02,GR,14,10);
 if(sp.rump)zBall(T,-rx*.92,by+sp.ry*.1,0,rx*.12,sp.ry*.55,sp.rz*.7,sp.rump,8,6);
 if(sp.hump)zBall(T,rx*.42,by+sp.ry*.75,0,rx*.32,sp.ry*.45,sp.rz*.7,sp.dark,10,7);
 if(sp.mane)for(let k=0;k<6;k++)zCone(T,rx*.55-k*rx*.22,by+sp.ry*.95,0,.022,.08,sp.dark,0,0,-.35,4);
 // nogi: przód i tył, lewa i prawa; w chodzie przekątne idą razem
 const fz=sp.rz*.62,sw=.42*(sp.hare?0:1);
 const legs=[[rx*.62,1,1],[rx*.62,1,-1],[-rx*.62,0,1],[-rx*.62,0,-1]];
 legs.forEach(([lx,front,side])=>{let s=0;if(w)s=sw*w*((front?1:-1)*side);if(hop)s=front?.55:-.5;
  const H=[lx,by-sp.ry*.25,side*fz];const uu=sp.hare&&!front?sp.u*1.4:sp.u,ll=sp.hare&&!front?sp.l*1.2:sp.l,rr=sp.hare&&!front?sp.lr*1.5:sp.lr;
  zLeg(T,H,s,front?.05:-.1,uu,ll,rr,sp.leg,sp.lo,sp.hoof,front)});
 // szyja i głowa
 const na=grz?2.2:sp.neck[0],nl=sp.neck[1],N0=[rx*.78,by+sp.ry*.35,0];const N1=[N0[0]+Math.sin(na)*nl,N0[1]+Math.cos(na)*nl,0];
 zLimb(T,N0,N1,sp.neck[2]*1.15,sp.neck[2],GR,8);const hd=sp.head,ha=grz?-1.1:-.12+(sp.hare?.1:0);
 const Hc=[N1[0]+hd[0]*.45,N1[1]+(grz?-hd[1]*.4:hd[1]*.15),0];zBall(T,Hc[0],Hc[1],0,hd[0],hd[1],hd[2],t=>zMix(sp.belly,sp.col,zSm(-.9,-.2,t)),12,9,[0,0,ha]);
 const sx=Math.cos(ha),sy=Math.sin(ha);const S0=[Hc[0]+hd[0]*.6*sx,Hc[1]+hd[0]*.6*sy-hd[1]*.15,0],S1=[S0[0]+sp.snout[0]*sx,S0[1]+sp.snout[0]*sy-.01,0];
 zLimb(T,S0,S1,sp.snout[1]*1.2,sp.snout[1]*.75,sp.belly===sp.col?sp.dark:sp.col,8);zBall(T,S1[0],S1[1],0,sp.snout[1]*.8,sp.snout[1]*.7,sp.snout[1]*.8,C3(.06,.05,.05),6,5);
 if(sp.tusk)[-1,1].forEach(z=>zCone(T,S1[0]-.03,S1[1]+.005,z*sp.snout[1]*.9,.011,.06,C3(.9,.86,.76),0,0,-.9+Math.PI,5));
 [-1,1].forEach(z=>zBall(T,Hc[0]+hd[0]*.35,Hc[1]+hd[1]*.35,z*hd[2]*.78,.013,.013,.013,C3(.03,.03,.03),6,5));
 // uszy
 const er=sp.ear;[-1,1].forEach(z=>{const ex=Hc[0]-hd[0]*.15,ey=Hc[1]+hd[1]*.75,ez=z*hd[2]*.55;
  if(er[2]==='up')zCone(T,ex,ey+er[1]*.4,ez,er[0],er[1],sp.dark,z*.25,0,.1,4);
  else if(er[2]==='side')zCone(T,ex,ey,ez+z*er[1]*.45,er[0],er[1],sp.col,z*1.35,0,0,4);
  else if(er[2]==='klap')zCone(T,ex+.01,ey-.005,ez+z*.02,er[0],er[1],sp.dark,z*2.2,0,-.3,4);
  else if(er[2]==='dlugie'){zLimb(T,[ex,ey,ez],[ex-.04,ey+er[1],ez+z*.03],er[0],er[0]*.8,sp.col,5);zBall(T,ex-.042,ey+er[1],ez+z*.03,er[0]*.8,er[0]*.6,er[0]*.8,C3(.1,.08,.07),5,4)}
  else zBall(T,ex,ey,ez,er[0],er[0],er[0]*.6,sp.dark,7,5)});
 if(sp.horn)[-1,1].forEach(z=>{let p=[Hc[0]+hd[0]*.1,Hc[1]+hd[1]*.9,z*hd[2]*.35];for(let k=0;k<3;k++){const q=[p[0]-.035,p[1]+.04-k*.018,p[2]+z*.008];zLimb(T,p,q,.014-k*.003,.011-k*.003,C3(.42,.36,.28),5);p=q}});
 if(sp.beard)zCone(T,S1[0]-.04,S1[1]-.05,0,.018,.07,sp.dark,Math.PI,0,0,5);
 if(variant==='rogacz')[-1,1].forEach(z=>{const b=[Hc[0],Hc[1]+hd[1]*.9,z*hd[2]*.35],t=[b[0]-.01,b[1]+.13,b[2]+z*.03];zLimb(T,b,t,.011,.007,C3(.5,.42,.3),5);zLimb(T,[b[0],b[1]+.06,b[2]],[b[0]+.04,b[1]+.11,b[2]+z*.01],.008,.005,C3(.5,.42,.3),4);zLimb(T,[t[0],t[1]-.03,t[2]],[t[0]-.04,t[1]+.01,t[2]+z*.01],.007,.004,C3(.5,.42,.3),4)});
 // ogon
 const tb=[-rx*1.0,by+sp.ry*.35+(sp.hare?sp.ry*.3:0),0];
 if(sp.tail==='pita'||sp.tail==='lisia'){const len=sp.tail==='lisia'?.34:.3,r=sp.tail==='lisia'?.055:.05,ang=w?-.9:-1.2;const e=[tb[0]-len*Math.cos(ang)*.85,tb[1]+Math.sin(ang)*len*.85,0];
  zLimb(T,tb,e,r*.55,r,sp.col,8);zBall(T,e[0],e[1],0,r*.95,r*.95,r*.95,sp.tail==='lisia'?C3(.95,.93,.88):sp.dark,7,5)}
 else if(sp.tail==='zakrecony'){zLimb(T,tb,[tb[0]-.06,tb[1]+.1,0],.022,.026,sp.col,6);zBall(T,tb[0]-.03,tb[1]+.13,0,.035,.03,.03,sp.col,6,5)}
 else if(sp.tail==='puch')zBall(T,tb[0]+.01,tb[1],0,.03,.045,.035,sp.rump||sp.belly,6,5);
 else if(sp.tail==='pompon')zBall(T,tb[0],tb[1],0,.035,.035,.035,C3(.95,.94,.9),6,5);
 else if(sp.tail==='kozi')zCone(T,tb[0],tb[1]+.03,0,.02,.07,sp.dark,0,0,.7,4);
 else if(sp.tail==='cienki'){zLimb(T,tb,[tb[0]-.05,tb[1]-.15,0],.012,.01,sp.dark,4);zBall(T,tb[0]-.05,tb[1]-.16,0,.018,.03,.018,sp.dark,5,4)}
 else zBall(T,tb[0]+.02,tb[1],0,.04,.04,.04,sp.col,6,5);
 return zMerge(T)}
// foka: wrzecionowate ciało, płetwy; w ruchu faluje
function zFoka(pose){const T=[],w=pose==='walkA'?1:pose==='walkB'?-1:0,col=C3(.42,.43,.44),dk=C3(.3,.31,.33),lt=C3(.6,.6,.58);
 T.push([new THREE.LatheGeometry([[.0,-.5],[.07,-.44],[.14,-.3],[.2,-.1],[.21,.05],[.18,.2],[.13,.3],[0,.36]].map(([r,y])=>new THREE.Vector2(r,y)),14),col,mdM(0,.17+w*.02,0,0,0,-Math.PI/2+w*.06,1,1,.85)]);
 zBall(T,.4,.27+w*.04,0,.12,.105,.105,col,12,9);zBall(T,.5,.24+w*.04,0,.055,.045,.05,lt,8,6);zBall(T,.545,.245+w*.04,0,.02,.016,.022,C3(.05,.05,.05),6,5);
 [-1,1].forEach(z=>{zBall(T,.46,.3+w*.04,z*.06,.016,.016,.016,C3(.02,.02,.02),6,5);zBall(T,.18,.07,z*.17,.09,.018,.04,dk,7,5,[0,z*.5,0])});
 zBall(T,-.52,.1,.04,.1,.016,.045,dk,7,5,[0,.5,0]);zBall(T,-.52,.1,-.04,.1,.016,.045,dk,7,5,[0,-.5,0]);
 for(let k=0;k<9;k++)zBall(T,-.32+((k*53)%9)*.075,.25+((k*29)%3)*.02,((k*37)%7-3)*.035,.018,.01,.016,dk,5,4);
 return zMerge(T)}
const ZPOSE=['stand','walkA','walkB','graze'];
const ZG={};// ZG[typ][poza|wariant]
function zBuild(t){if(ZG[t])return ZG[t];const o={};ZPOSE.forEach(p=>{o[p]=t==='foka'?zFoka(p==='graze'?'stand':p):zQuad(ZSP[t],p)});if(t==='sarna')ZPOSE.forEach(p=>o['r_'+p]=zQuad(ZSP.sarna,p,'rogacz'));ZG[t]=o;return o}
const ZMAT=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92,metalness:0});
const ZM={};// instancje: ZM[typ][klucz]
function zMeshes(t,max){if(ZM[t])return ZM[t];const G=zBuild(t),o={};Object.keys(G).forEach(k=>{const m=new THREE.InstancedMesh(G[k],ZMAT,max);m.count=0;m.castShadow=true;m.receiveShadow=true;m.frustumCulled=false;scene.add(m);o[k]=m});ZM[t]=o;return o}
const zDummy=new THREE.Object3D();
drawAnimals=function(){Object.keys(animM).forEach(t=>{animM[t].visible=false;const Ms=zMeshes(t,Math.max(1,animIdx[t].length*7));const cnt={};Object.keys(Ms).forEach(k=>cnt[k]=0);const sp=ZSP[t]||{};
  animIdx[t].forEach((hi,slot)=>{const h=S.herds[hi];if(!h)return;if(lodFar||Math.hypot(h.x-camT.x,h.z-camT.z)>lodR+12)return;/* 4.5: zwierzęta tylko w oknie wokół kamery */const ti=tileOf(h.x,h.z);if(!revAt(ti[0],ti[1]))return;const moving=Math.hypot(h.tx-h.x,h.tz-h.z)>.3;
   for(let q=0;q<Math.min(7,h.n);q++){const o=deerOff[hi*7+q];const a=o.a+Math.sin(clock*.2+o.ph)*.4;const rr=o.r*(t==='wilk'?1.4:1);const x=h.x+Math.cos(a)*rr,z=h.z+Math.sin(a)*rr;
    let pose='stand';if(moving)pose=(Math.floor(clock*(sp.step||5)+o.ph*3)%2)?'walkA':'walkB';else if(sp.graze&&Math.sin(clock*.35+o.ph*2.1)>.25)pose='graze';
    const key=(t==='sarna'&&q===0?'r_':'')+pose;const m=Ms[key];if(!m)continue;
    zDummy.position.set(x,Hy(x,z),z);zDummy.rotation.set(0,moving?Math.atan2(-(h.tz-h.z),h.tx-h.x):o.rot+Math.sin(clock*.3+o.ph)*.5,0);
    zDummy.scale.setScalar((t==='sarna'?1.15:t==='zajac'?1.1:1.05)*(.92+.16*((q*7+hi)%5)/4));zDummy.updateMatrix();m.setMatrixAt(cnt[key]++,zDummy.matrix)}});
  Object.keys(Ms).forEach(k=>{Ms[k].count=cnt[k];Ms[k].visible=cnt[k]>0;Ms[k].instanceMatrix.needsUpdate=true})});
 // kozy w zagrodach: stoją albo skubią trawę
 const P=zMeshes('koza_z',80);penM.visible=false;let ns=0,ng=0;let k=0;
 S.bld.forEach(b=>{if(b.kind!=='zagroda'||!bDone(b))return;const c=bCenter(b);for(let q=0;q<(b.animals||0)&&k<80;q++,k++){const o=deerOff[herdsDef.length*7+k];const a=o.a+clock*.05*(o.ph-3)*.1,r=.3+o.r*.45;const x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;
  zDummy.position.set(x,Hy(x,z),z);zDummy.rotation.set(0,o.rot+Math.sin(clock*.4+o.ph),0);zDummy.scale.setScalar(.95);zDummy.updateMatrix();
  if(Math.sin(clock*.3+o.ph*1.7)>.1)P.graze.setMatrixAt(ng++,zDummy.matrix);else P.stand.setMatrixAt(ns++,zDummy.matrix)}});
 P.stand.count=ns;P.graze.count=ng;P.walkA.count=0;P.walkB.count=0;P.stand.visible=ns>0;P.graze.visible=ng>0;P.walkA.visible=P.walkB.visible=false;P.stand.instanceMatrix.needsUpdate=P.graze.instanceMatrix.needsUpdate=true};
// kozy domowe: jaśniejsze, łaciate
ZSP.koza_z=Object.assign({},ZSP.koza,{col:C3(.82,.78,.7),dark:C3(.52,.42,.32),belly:C3(.9,.87,.8),leg:C3(.7,.66,.58),lo:C3(.5,.44,.36)});
// psy: nowy model, chód z klatek
{const _df=dogFrame;dogFrame=function(){_df();if(!S||!S.dogs)return;const G=zBuild('pies');for(const id in dogMesh){const m=dogMesh[id];const d=S.dogs.find(x=>x.id===+id);if(!d)continue;
  const pose=d.st==='sleep'?'stand':d.mv?((Math.floor(clock*7+d.id)%2)?'walkA':'walkB'):'stand';if(m.geometry!==G[pose])m.geometry=G[pose];
  if(d.st==='sleep'){m.scale.y=m.scale.x*.75}}}}
ZSP.pies.graze=0;
window.__zw={zBuild,ZSP,ZG,zQuad,zFoka};
