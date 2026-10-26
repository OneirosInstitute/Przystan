
/* ================= 4.9.0-rc.7 Wielkie budynki na własnym placu ================= */
// Dwór, dom cechowy, zajazd, browar, szpital i chata wiecowa mają wokół siebie plac szerokości jednego pola.
// Na placu nie stanie żaden inny budynek: podgląd budowy robi się czerwony i mówi, czyj to plac.
// Na wolnym placu przed budynkiem stoi dziedziniec (płot z bramą, lipy, stoły, grządki, krąg wiecowy).
const PLAC={dwor:1,cech:1,zajazd:1,browar:1,szpital:1,domwsp:1};
const PLAC_N={dwor:'dworu rodu',cech:'domu cechowego',zajazd:'zajazdu',browar:'browaru',szpital:'szpitala',domwsp:'chaty wiecowej'};
function placOf(kind){return PLAC[kind]||0}
function rectHit(a,b){return a[0]<b[0]+b[2]&&b[0]<a[0]+a[2]&&a[1]<b[1]+b[3]&&b[1]<a[1]+a[3]}
function placConflict(kind,i,j,skip){if(!S||!BD[kind])return null;const d=BD[kind],m=placOf(kind),R=[i,j,d.w,d.h],Rp=[i-m,j-m,d.w+2*m,d.h+2*m];
 for(const b of S.bld){if(b===skip||b.id===skip)continue;const e=BD[b.kind];if(!e)continue;const B=[b.i,b.j,e.w,e.h],mb=placOf(b.kind);
  const Bp=[b.i-mb,b.j-mb,e.w+2*mb,e.h+2*mb];
  if((m&&rectHit(Rp,B))||(mb&&rectHit(R,Bp))||(m&&mb&&rectHit(Rp,Bp)))return b}return null}
{const _cp=checkPlace;checkPlace=function(kind,i,j){if(!_cp(kind,i,j))return false;try{return !placConflict(kind,i,j)}catch(e){return true}}}
// podgląd: plac budowanego budynku i plac, który zawadza
const placG=new THREE.Group();placG.renderOrder=3;scene.add(placG);
const placMat={ok:new THREE.MeshBasicMaterial({color:0x66cc66,transparent:true,opacity:.18,depthWrite:false}),no:new THREE.MeshBasicMaterial({color:0xcc4433,transparent:true,opacity:.32,depthWrite:false})};
function placBox(i,j,w,h,m,bad){const x=tcx(i)+(w-1)/2,z=tcx(j)+(h-1)/2,W=w+2*m,D=h+2*m;const o=new THREE.Mesh(new THREE.BoxGeometry(W,.12,D),bad?placMat.no:placMat.ok);
 let y=-1e9;for(const[a,b]of[[-W/2,-D/2],[W/2,-D/2],[-W/2,D/2],[W/2,D/2],[0,0]])y=Math.max(y,Hy(x+a,z+b));o.position.set(x,y+.12,z);placG.add(o)}
function placClear(){placG.children.slice().forEach(o=>{placG.remove(o);o.geometry.dispose()})}
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);try{placClear();if(!placing||!ghostTile||!BD[placing])return;const [gi,gj]=ghostTile,d=BD[placing],m=placOf(placing);
  const hit=placConflict(placing,gi,gj);if(m)placBox(gi,gj,d.w,d.h,m,!!hit);
  if(hit){const e=BD[hit.kind],mb=placOf(hit.kind);if(mb)placBox(hit.i,hit.j,e.w,e.h,mb,true);else placBox(hit.i,hit.j,e.w,e.h,0,true);
   const el=$('pinfo');if(el){const big=mb?hit.kind:placing,msg=`Za blisko: plac ${PLAC_N[big]||''} musi zostać wolny (jedno pole wokół).`;
    const sp=[...el.querySelectorAll('.no')].find(x=>/^Tu nie da się budować/.test(x.textContent));if(sp)sp.textContent=msg;else el.insertAdjacentHTML('beforeend',`<div class="no" style="margin-top:4px">${msg}</div>`);el.style.display='block'}}}catch(e){}}}
{const _cpl=cancelPlace;cancelPlace=function(){_cpl();placClear()}}
{const _tp=tryPlace;tryPlace=function(){if(placing&&ghostTile){const hit=placConflict(placing,ghostTile[0],ghostTile[1]);if(hit){const big=placOf(hit.kind)?hit.kind:placing;toast(`Za blisko: plac ${PLAC_N[big]||''} musi zostać wolny.`);return}}const r=_tp();if(!placing)placClear();return r}}

/* ---- dachy: czterospadowy, łamany, namiotowy (jedna funkcja: ścięty ostrosłup) ---- */
const _dU=new THREE.Vector3(0,1,0),_dA=new THREE.Vector3(),_dB=new THREE.Vector3(),_dC=new THREE.Vector3(),_dN=new THREE.Vector3(),_dT=new THREE.Vector3(),_dBt=new THREE.Vector3();
function roofFr(w0,d0,w1,d1,h,mat,y,sc){sc=sc||1.1;const a=[[-w0/2,0,-d0/2],[w0/2,0,-d0/2],[w0/2,0,d0/2],[-w0/2,0,d0/2]],b=[[-w1/2,h,-d1/2],[w1/2,h,-d1/2],[w1/2,h,d1/2],[-w1/2,h,d1/2]];
 const P=[],U=[];const tri=(p,q,r)=>{_dA.fromArray(p);_dB.fromArray(q);_dC.fromArray(r);_dN.subVectors(_dB,_dA).cross(_dC.clone().sub(_dA));if(_dN.lengthSq()<1e-10)return;_dN.normalize();
  _dT.crossVectors(_dU,_dN);if(_dT.lengthSq()<1e-6)_dT.set(1,0,0);_dT.normalize();_dBt.crossVectors(_dN,_dT);for(const v of[p,q,r]){P.push(v[0],v[1],v[2]);_dA.fromArray(v);U.push(_dA.dot(_dT)*sc,_dA.dot(_dBt)*sc)}};
 for(let k=0;k<4;k++){const n=(k+1)%4;tri(a[k],b[n],a[n]);tri(a[k],b[k],b[n])}if(w1>0&&d1>0){tri(b[3],b[2],b[1]);tri(b[3],b[1],b[0])}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
 const m=new THREE.Mesh(g,mat);m.position.y=y||0;m.castShadow=m.receiveShadow=true;return m}
const dMat={plaster:wkMt(0xece6d6),plaster2:wkMt(0xe2dccb),beam:wkMt(0x4a3626),green:TM(TX.shingle,0x8aa088),red:TM(TX.shingle,0xc89070),lime:wkMt(0x5f8a45),lime2:wkMt(0x4e7a3a),gravel:wkMt(0xb8ad94),
 bed:wkMt(0x4a3524),linen:wkMt(0xf2f0e8,{side:THREE.DoubleSide}),banner:wkMt(0x8a2a22,{side:THREE.DoubleSide}),banner2:wkMt(0x2a4a7a,{side:THREE.DoubleSide}),gold:wkMt(0xc8a040,{metalness:.4,roughness:.45})};
function dCol(g,x,z,h,r,mat){g.add(cyl(r||.065,h,mat||dMat.plaster,x,h/2,z,0,0,0,8));g.add(tbox((r||.065)*2.6,.06,(r||.065)*2.6,mat||dMat.plaster,x,h-.03,z));g.add(tbox((r||.065)*2.6,.06,(r||.065)*2.6,mat||dMat.plaster,x,.03,z))}
function dTree(g,x,z,s){s=s||1;g.add(cyl(.06*s,.8*s,matLog2,x,.4*s,z,0,0,0,6));const c=mesh(new THREE.IcosahedronGeometry(.36*s,0),dMat.lime,x,1.0*s,z);c.scale.y=1.15;g.add(c);g.add(mesh(new THREE.IcosahedronGeometry(.24*s,0),dMat.lime2,x+.12*s,1.3*s,z-.05))}
function dFence(g,x0,x1,z,gate,mat){mat=mat||dMat.plaster;const segs=gate?[[x0,-gate/2],[gate/2,x1]]:[[x0,x1]];for(const[a,b]of segs){const L=b-a;if(L<.1)continue;g.add(tbox(L,.05,.03,mat,(a+b)/2,.36,z,0,2),tbox(L,.05,.03,mat,(a+b)/2,.16,z,0,2));
  for(let k=0;k<=Math.round(L/.17);k++){const x=a+k*L/Math.round(L/.17||1);g.add(tbox(.045,.46,.025,mat,x,.23,z+.02))}}
 if(gate)for(const s of[-1,1]){g.add(tbox(.16,.75,.16,mat,s*(gate/2+.08),.37,z));g.add(tbox(.2,.06,.2,matStone,s*(gate/2+.08),.77,z))}}
function dSideFence(g,x,z0,z1,mat){mat=mat||dMat.plaster;const L=z1-z0;g.add(tbox(.03,.05,L,mat,x,.36,(z0+z1)/2,0,2),tbox(.03,.05,L,mat,x,.16,(z0+z1)/2,0,2));const n=Math.max(1,Math.round(L/.17));for(let k=0;k<=n;k++)g.add(tbox(.025,.46,.045,mat,x+.02,.23,z0+k*L/n))}
// czy przed budynkiem (pas placu od frontu) nic nie stoi
function placFront(bb){if(!bb||bb.i===undefined||!S||S.epoch===4)return false;const d=BD[bb.kind];const F=[bb.i-1,bb.j+d.h,d.w+2,1];
 for(const b of S.bld){if(b===bb||b.id===bb.id)continue;const e=BD[b.kind];if(e&&rectHit(F,[b.i,b.j,e.w,e.h]))return false}return true}

/* ---- dwór rodu: biały dworek z gankiem na kolumnach, dach łamany, lipy i biały płot z bramą ---- */
function dDwor(g,bb){wNo(1);const w=2.5,d=1.35,h=1.0,y0=.22;g.add(tbox(w+.16,y0,d+.16,mStone,0,y0/2,-.15,0,.9));g.add(tbox(w,h,d,dMat.plaster,0,y0+h/2,-.15));
 for(const x of[-w/2,w/2])for(const z of[-.15-d/2,-.15+d/2])g.add(tbox(.08,h,.08,dMat.plaster2,x,y0+h/2,z));
 const top=y0+h;g.add(tbox(w+.1,.08,d+.1,dMat.beam,0,top+.04,-.15));
 const r1=roofFr(w+.42,d+.42,w-.1,d*.5,.55,mShingle,top+.08);r1.position.z=-.15;g.add(r1);const r2=roofFr(w-.1,d*.5,w-.8,0,.32,mShingle,top+.63);r2.position.z=-.15;g.add(r2);
 for(const x of[-.75,.75]){g.add(tbox(.24,.75,.24,dMat.plaster,x,top+.75,-.3));g.add(tbox(.32,.06,.32,matStone,x,top+1.13,-.3))}
 const fz=-.15+d/2;for(const x of[-.85,.85]){win(g,x,y0+h*.55,fz+.03)}win(g,w/2+.03,y0+h*.55,-.15,Math.PI/2);win(g,-w/2-.03,y0+h*.55,-.15,-Math.PI/2);
 // ganek: cztery kolumny i trójkątny szczyt
 const gz=fz+.42;for(const x of[-.45,-.17,.17,.45])dCol(g,x,gz,h+.02,.055);g.add(tbox(1.1,.1,.6,dMat.beam,0,y0+h+.05,fz+.25));
 const pd=gable(1.12,.62,.42,mShingle,y0+h+.1,.06);pd.position.z=fz+.27;g.add(pd);const ty=new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.54,0,0),new THREE.Vector3(.54,0,0),new THREE.Vector3(0,.4,0)]),dMat.plaster);
 ty.geometry.computeVertexNormals();ty.position.set(0,y0+h+.1,gz+.04);g.add(ty);g.add(mesh(new THREE.CircleGeometry(.08,10),wkM.ochre,0,y0+h+.25,gz+.05));
 g.add(tbox(1.2,.12,.62,mStone,0,.06,fz+.28,0,.9),tbox(.8,.07,.2,mStone,0,.035,gz+.32));door(g,0,fz+.04,0,.5,.82);
 // dziedziniec na placu
 if(placFront(bb)){const z=d/2+.95-.15+.15;g.add(tbox(.5,.02,1.0,dMat.gravel,0,.012,fz+.95));dFence(g,-2.35,2.35,1.85,.7);dSideFence(g,-2.35,1.0,1.85);dSideFence(g,2.35,1.0,1.85);
  dTree(g,-1.55,1.35,1.05);dTree(g,1.6,1.3,.95);const kl=mesh(new THREE.CylinderGeometry(.3,.34,.1,12),dMat.bed,-.7,.05,1.35);g.add(kl);for(let k=0;k<7;k++)g.add(mesh(new THREE.SphereGeometry(.05,5,4),wkMt([0xc04050,0xe0c050,0xe8e4d8][k%3]),-.7+Math.cos(k)*.2,.13,1.35+Math.sin(k)*.2))}}

/* ---- dom cechowy: murowany parter z podcieniami, piętro z bali, szczyt do ulicy, sygnaturka, godło cechu ---- */
function dCech(g,bb){wNo(1);const w=2.4,d=1.35,h1=.85,h2=.8;g.add(tbox(w,h1,d-.35,mStone,0,h1/2,-.32,0,1.2));
 g.add(tbox(w+.06,.1,d+.06,dMat.beam,0,h1+.05,-.15));g.add(tbox(w,h2,d,mLogs,0,h1+.1+h2/2,-.15,0,1.1));
 for(const x of[-1.1,-.55,0,.55,1.1])g.add(tbox(.12,h1,.12,dMat.beam,x,h1/2,-.15+d/2-.06));for(let k=0;k<4;k++){const a=tbox(.5,.08,.06,dMat.beam,-.825+k*.55,h1-.06,-.15+d/2-.06);g.add(a)}
 const rs=wSub(g,0,-.15,Math.PI/2);rs.add(gable(d,w,.95,mShingle,h1+.1+h2,.18));
 const fz=-.15+d/2;for(const x of[-.75,0,.75])win(g,x,h1+.1+h2*.55,fz+.03);door(g,0,-.15+(d-.35)/2-.32+.17+.02,0,.46,.72);
 // szczyt od frontu: deskowanie i okienko
 const gy=h1+.1+h2,tri=new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-w/2,0,0),new THREE.Vector3(w/2,0,0),new THREE.Vector3(0,.93,0)]),mPlankD);tri.geometry.computeVertexNormals();
 tri.position.set(0,gy,-.15+d/2+.01);g.add(tri);win(g,0,gy+.32,-.15+d/2+.03);
 // sygnaturka na kalenicy
 const sy=wSub(g,0,-.15);sy.position.y=h1+.1+h2+.85;sy.add(tbox(.24,.32,.24,mPlankD,0,.16,0,0,1.4));const sp=mesh(new THREE.ConeGeometry(.2,.55,4),mShingle,0,.6,0);sp.rotation.y=Math.PI/4;sy.add(sp);sy.add(cyl(.015,.25,dMat.gold,0,.98,0,0,0,0,4));
 // godło cechu: tarcza z dwoma narzędziami na wysięgniku
 const em=wSub(g,.95,fz+.1);em.add(tbox(.04,.04,.45,matDark,0,h1+.55,.2));const sh=mesh(new THREE.CircleGeometry(.2,12),dMat.gold,0,h1+.3,.42);sh.rotation.y=Math.PI/2;em.add(sh);
 for(const s of[-1,1]){const t=tbox(.03,.3,.02,matDark,.01,h1+.3,.42);t.rotation.x=s*.6;t.rotation.y=Math.PI/2;em.add(t)}
 // stragan na placu
 if(placFront(bb)){const st=wSub(g,-1.05,1.45);st.add(tbox(.9,.06,.45,mPlank,0,.45,0,0,2));for(const x of[-.4,.4])for(const z of[-.18,.18])st.add(tbox(.05,z<0?1.0:.85,.05,matDark,x,(z<0?1.0:.85)/2,z));
  const aw=tbox(1.0,.03,.55,wkMt(0xb04a32),0,.95,0);aw.rotation.x=.25;st.add(aw);for(let k=0;k<4;k++)st.add(mesh(wkG.pot,mPot,-.3+k*.2,.53,0));wBarrel(g,-.2,0,1.5,.8);wBarrel(g,.2,0,1.6,.75);sack(g,.6,1.45);sack(g,.85,1.55,.9);
  g.add(tbox(.6,.02,1.0,dMat.gravel,0,.012,1.2))}}

/* ---- zajazd: karczma z podcieniem, wozownia z wozem, wiecha, stół z ławami, poidło ---- */
function dZajazd(g,bb){wNo(1);const m=wSub(g,-.45,-.2);logHouse(m,1.9,1.3,1.0,{chim:-.5,win:true,rh:1.0,roof:mShingle});
 const fz=-.2+.65;for(const x of[-1.3,-.75,-.15,.4])g.add(tbox(.08,1.05,.08,matLog2,x,.53,fz+.42));const pr=tbox(1.95,.04,.55,mBoards,-.45,1.12,fz+.22,0,2);pr.rotation.x=.25;g.add(pr);
 // wozownia z wozem i sianem
 const wz=wSub(g,1.02,-.12);for(const x of[-.42,.42])for(const z of[-.6,.6])wz.add(tbox(.08,1.05,.08,matLog2,x,.52,z));wz.add(gable(.95,1.35,.4,mThatch,1.05,.12));
 wz.add(tbox(.45,.15,.75,mPlankD,0,.38,.05,0,2));for(const z of[-.22,.32])wz.add(cyl(.17,.04,matDark,.26,.2,z,0,0,Math.PI/2,10),cyl(.17,.04,matDark,-.26,.2,z,0,0,Math.PI/2,10));
 wz.add(mesh(new THREE.SphereGeometry(.24,7,4,0,6.283,0,1.57),mThatch,0,.45,-.1));wz.add(tbox(.04,.04,.6,matWood,0,.3,.7));
 // wiecha: tyczka z wiankiem i szyld z kuflem
 const wc=wSub(g,.4,.95);wc.add(cyl(.04,1.7,matLog2,0,.85,0,0,0,0,5));wc.add(tbox(.5,.04,.04,matLog2,-.22,1.6,0));const wr=new THREE.Mesh(new THREE.TorusGeometry(.13,.04,5,10),dMat.lime);wr.position.set(-.38,1.45,0);wr.rotation.y=Math.PI/2;wc.add(wr);
 wc.add(tbox(.04,.32,.26,mPlankD,-.2,1.32,0));wc.add(cyl(.05,.09,dMat.gold,-.17,1.32,.0,0,0,Math.PI/2,7));
 // stół z ławami i beczka
 const t=wSub(g,-.75,1.1);t.add(tbox(1.0,.06,.38,mPlank,0,.5,0,0,2),tbox(.06,.48,.3,matDark,-.4,.24,0),tbox(.06,.48,.3,matDark,.4,.24,0));for(const z of[-.38,.38])t.add(tbox(1.0,.05,.16,mPlank,0,.3,z,0,2),tbox(.05,.28,.12,matDark,-.4,.14,z),tbox(.05,.28,.12,matDark,.4,.14,z));
 for(let k=0;k<3;k++)t.add(cyl(.04,.1,mPot2,-.3+k*.3,.58,0,0,0,0,7));wBarrel(g,-1.4,0,.85,.9);
 if(placFront(bb)){g.add(tbox(.9,.02,1.1,dMat.gravel,1.0,.012,1.3));g.add(tbox(.8,.05,.06,matLog2,1.25,.5,1.55),tbox(.06,.5,.06,matLog2,.88,.25,1.55),tbox(.06,.5,.06,matLog2,1.62,.25,1.55));
  g.add(tbox(.7,.2,.25,mPlank,1.25,.1,1.75,0,2),tbox(.62,.02,.18,wkM.water,1.25,.21,1.75));dTree(g,-1.95,1.5,.9)}}

/* ---- szpital: długi biały dom z gankiem, ławy dla chorych, suszarnia ziół, grządki, białe płótna ---- */
function dSzpital(g,bb){wNo(1);const w=2.7,d=1.15,h=.9,y0=.18;g.add(tbox(w+.12,y0,d+.12,mStone,0,y0/2,-.3,0,.9));g.add(tbox(w,h,d,dMat.plaster,0,y0+h/2,-.3));
 for(const x of[-w/2,-w/6,w/6,w/2])g.add(tbox(.08,h,.08,dMat.beam,x,y0+h/2,-.3+d/2+.01));g.add(tbox(w,.07,.04,dMat.beam,0,y0+h*.5,-.3+d/2+.02));
 const r=roofFr(w+.4,d+.4,w-.5,0,.85,dMat.green,y0+h);r.position.z=-.3;g.add(r);g.add(tbox(.24,.6,.24,dMat.plaster,.7,y0+h+.55,-.45),tbox(.3,.05,.3,matStone,.7,y0+h+.86,-.45));
 const fz=-.3+d/2;for(const x of[-.95,-.45,.45,.95])win(g,x,y0+h*.6,fz+.03);door(g,0,fz+.04,0,.5,.75);
 for(const x of[-1.2,-.4,.4,1.2])g.add(tbox(.07,.95,.07,matLog2,x,.47,fz+.5));const vr=tbox(2.7,.04,.62,dMat.green,0,1.0,fz+.27,0,2);vr.rotation.x=.22;g.add(vr);g.add(tbox(2.7,.06,.6,mPlank,0,.06,fz+.28,0,2));
 for(const x of[-.85,.85])g.add(tbox(.6,.05,.16,mPlank,x,.3,fz+.12,0,2),tbox(.05,.26,.12,matDark,x-.25,.14,fz+.12),tbox(.05,.26,.12,matDark,x+.25,.14,fz+.12));
 rack(g,-1.25,-1.0,0,r=>{for(let k=0;k<5;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(.06,.2,5),k%2?mHerb:wkMt(0x9a7aa8));c.position.set(-.32+k*.16,.7,0);c.rotation.x=Math.PI;r.add(c)}});
 if(placFront(bb)){for(let r0=0;r0<3;r0++){g.add(tbox(1.1,.08,.26,dMat.bed,-1.05,.04,1.1+r0*.33));for(let c=0;c<5;c++)g.add(mesh(new THREE.SphereGeometry(.07,5,4),[mHerb,wkMt(0x9a7aa8),wkMt(0xe0c050)][(r0+c)%3],-1.45+c*.2,.12,1.1+r0*.33))}
  const ln=wSub(g,1.0,1.45);ln.add(tbox(.04,1.0,.04,matDark,-.7,.5,0),tbox(.04,1.0,.04,matDark,.7,.5,0),cyl(.006,1.4,wkM.rope,0,.95,0,0,0,Math.PI/2,3));
  for(const x of[-.4,0,.4]){const p=new THREE.Mesh(new THREE.PlaneGeometry(.34,.5),dMat.linen);p.position.set(x,.68,0);p.castShadow=true;ln.add(p)}g.add(tbox(.5,.02,.9,dMat.gravel,0,.012,1.3))}}

/* ---- chata wiecowa: długa hala ze stromą strzechą, rzeźbione słupy podcienia, słup z czterema twarzami, krąg wiecowy ---- */
function dDomwsp(g,bb){wNo(1);const m=wSub(g,0,-.2);logHouse(m,3.5,1.4,1.1,{chim:0,win:false,rh:1.45,dx:-1.1});const H=STY&&STY.house;
 for(const x of[-.3,.6,1.3])win(m,x,.3+1.1*.6,.73);const fz=-.2+.72;
 for(let k=0;k<6;k++){const x=-1.62+k*.65;g.add(tbox(.11,1.05,.11,matLog2,x,.53,fz+.45));g.add(tbox(.17,.1,.17,dMat.beam,x,.95,fz+.45));g.add(tbox(.17,.1,.17,dMat.beam,x,.35,fz+.45))}
 const pr=tbox(3.6,.04,.6,mThatch,0,1.14,fz+.24,0,2);pr.rotation.x=.3;g.add(pr);g.add(tbox(3.5,.06,.55,mPlank,0,.05,fz+.24,0,2));
 // słup z czterema twarzami
 const sl=wSub(g,-1.85,fz+.75);sl.add(cyl(.12,1.9,matLog2,0,.95,0,0,0,0,8));for(let k=0;k<4;k++){const a=k*Math.PI/2;sl.add(tbox(.12,.16,.04,dMat.beam,Math.sin(a)*.11,1.55,Math.cos(a)*.11,a));sl.add(tbox(.06,.03,.03,wkM.red,Math.sin(a)*.13,1.45,Math.cos(a)*.13,a))}
 sl.add(mesh(new THREE.ConeGeometry(.17,.25,8),mThatch,0,2.02,0));
 // krąg wiecowy na placu
 if(placFront(bb)){const cx=.4,cz=1.45;g.add(cyl(.2,.06,matStone,cx,.03,cz,0,0,0,9));wGlow(g,cx,.08,cz,.2,.12);for(let k=0;k<3;k++){const a=k*2.1;g.add(cyl(.03,.32,matLog2,cx+Math.cos(a)*.06,.15,cz+Math.sin(a)*.06,Math.sin(a)*.5,0,Math.cos(a)*.5,4))}
  for(let k=0;k<5;k++){const a=Math.PI*(.05+k*.225);g.add(cyl(.08,.75,matLog,cx+Math.cos(a)*.75,.09,cz-Math.sin(a)*.0+Math.sin(a)*.42*-1+.25,0,-a+Math.PI/2,Math.PI/2,6))}
  for(const[x,mat]of[[-1.0,dMat.banner],[1.75,dMat.banner2]]){g.add(cyl(.03,1.9,matDark,x,.95,1.75,0,0,0,5));const b=new THREE.Mesh(new THREE.PlaneGeometry(.32,.6),mat);b.position.set(x+.17,1.5,1.75);b.castShadow=true;g.add(b)}}}

/* ---- browar: dziedziniec z ogródkiem piwnym ---- */
function dBrowarPlac(g,bb){if(!placFront(bb))return;const t=wSub(g,-.9,1.45);t.add(tbox(.9,.06,.34,mPlank,0,.48,0,0,2),tbox(.06,.46,.28,matDark,-.36,.23,0),tbox(.06,.46,.28,matDark,.36,.23,0));
 for(const z of[-.34,.34])t.add(tbox(.9,.05,.14,mPlank,0,.28,z,0,2));for(let k=0;k<3;k++)t.add(cyl(.04,.1,mPot2,-.25+k*.25,.56,0,0,0,0,7));
 for(let i=0;i<3;i++)wBarrel(g,.45+i*.36,0,1.55,.85,true,0);wBarrel(g,.63,.29,1.55,.85,true,0);dTree(g,1.95,1.3,.85)}

const D_MODELS={dwor:dDwor,cech:dCech,zajazd:dZajazd,szpital:dSzpital,domwsp:dDomwsp};let D_BB=null;
{const _mb=makeBuildingModel;makeBuildingModel=function(kind,bb){const keep=D_BB;D_BB=bb||null;try{const g=_mb(kind,bb);if(kind==='browar'&&bb&&!/oldbld/.test(location.search)){try{dBrowarPlac(g,bb)}catch(e){}}return g}finally{D_BB=keep}}}
{const _nm=newModel;newModel=function(kind,g){const f=D_MODELS[kind];if(f&&!/oldbld/.test(location.search)){try{f(g,D_BB);return 1}catch(e){console.warn('dwór',kind,e);g.clear()}}return _nm(kind,g)}}
window.__dwory={PLAC,placConflict,D_MODELS,roofFr};
