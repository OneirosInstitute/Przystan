// ================= 2.0 modele budowli epoki II =================
const mClay=M(0x9a6448),mClayD=M(0x6e4632),mPeat=M(0x3a2c20),mPeatL=M(0x4e3b2a),mOre=M(0x7a4a34),mSlag=M(0x2e2a28),mIron=M(0x4a4c50,{metalness:.5,roughness:.5}),mTar=M(0x1c1a18,{roughness:.4});
const mPuddle=new THREE.MeshStandardMaterial({color:0x2c3a3c,roughness:.15,metalness:.2});
const mCanvR=TM(TX.canvas,0xc0806a,{side:THREE.DoubleSide}),mCanvB=TM(TX.canvas,0x8aa0b4,{side:THREE.DoubleSide}),mCanvN=TM(TX.canvas,0xe8dcc0,{side:THREE.DoubleSide});
const mBlack=new THREE.MeshBasicMaterial({color:0x0a0806});const mLogsE=TM(TX.logs,0xd0c0a8),mLogsE2=TM(TX.logs,0xa89884),mShingE=TM(TX.shingle,0xe0d8cc);
function rock(g,x,y,z,r,rot){const m=mesh(new THREE.DodecahedronGeometry(r,0),matStone,x,y,z,rot||0,(rot||0)*1.7,0);m.scale.y=.75;g.add(m);return m}
function basket(g,x,z,c){g.add(cyl(.16,.16,mWattle,x,.08,z,0,0,0,9));const f=new THREE.Mesh(new THREE.SphereGeometry(.13,7,4,0,6.3,0,1.3),M(c));f.position.set(x,.14,z);f.scale.y=.5;g.add(f)}
// kram: słupki, lada, daszek z płótna i towar
function stall(g,x,z,canv,goods){const s=new THREE.Group();s.position.set(x,0,z);for(const sx of[-1,1]){s.add(cyl(.035,1.25,matLog2,sx*.4,.62,-.28,0,0,0,5),cyl(.035,1.05,matLog2,sx*.4,.52,.24,0,0,0,5))}
 s.add(tbox(.88,.07,.42,mPlank,0,.56,.05,0,1.6),tbox(.86,.5,.04,mPlankD,0,.28,.24,0,1.6));
 const aw=new THREE.Mesh(new THREE.PlaneGeometry(1.0,.75),canv);aw.rotation.x=-Math.PI/2+.38;aw.position.set(0,1.12,0);aw.castShadow=true;s.add(aw);
 const fr=new THREE.Mesh(new THREE.PlaneGeometry(1.0,.12),canv);fr.position.set(0,.98,.36);s.add(fr);goods(s);g.add(s);return s}
function e2Targ3(g){g.add(tbox(2.9,.03,1.9,M(0x7a6a52),0,.015,0,0,1));
 stall(g,-1.0,-.25,mCanvR,s=>{for(let k=0;k<5;k++)s.add(mesh(new THREE.SphereGeometry(.06,6,4),M(k%2?0xa83a2a:0x8aa040),-.3+k*.14,.64,.05));s.add(cyl(.11,.08,M(0xd8c070),.25,.64,0,0,0,0,10));basket(s,-.25,.45,0x8a2445)});
 stall(g,0,-.3,mCanvN,s=>{for(let k=0;k<4;k++){const f=tbox(.05,.26,.02,M(0x9aa0a4,{metalness:.3,roughness:.4}),-.3+k*.18,.86,.22);s.add(f)}s.add(cyl(.02,.8,matDark,0,.99,.22,0,0,Math.PI/2,4));barrel(s,.3,.48,.7);crate(s,-.28,.5,.3)});
 stall(g,1.0,-.25,mCanvB,s=>{for(let k=0;k<3;k++)s.add(cyl(.08,.16,mClay,-.25+k*.2,.68,.04,0,0,0,8));const hd=new THREE.Mesh(new THREE.PlaneGeometry(.45,.35),M(0x9a7452,{side:THREE.DoubleSide}));hd.position.set(.0,.32,.27);s.add(hd);sack(s,.3,.5,.9)});
 sack(g,-.5,.6,1);sack(g,-.35,.72,.8);barrel(g,.45,.7,.8);crate(g,.8,.65,.5);basket(g,1.25,.7,0x5a7a3a);basket(g,-1.3,.65,0x7a5030);
 g.add(cyl(.06,2.0,matLog2,1.42,1.0,.85,0,0,0,6));for(const[c,y]of[[0xa83a2a,1.85],[0xe8e0cc,1.75],[0x4a6a8a,1.65]]){const rb=new THREE.Mesh(new THREE.PlaneGeometry(.06,.45),M(c,{side:THREE.DoubleSide}));rb.position.set(1.42+.05,y-.2,.85);rb.rotation.y=y*3;g.add(rb)}}
// brama grodu: dwie wieże z bali, pomost, wrota
function e2Brama(g){const G=new THREE.Group();G.userData.gate=1;g.add(G);
 for(const sx of[-1,1]){const x=sx*.72;G.add(tbox(.66,.25,.66,mStone,x,.12,0,0,.9));G.add(tbox(.56,1.85,.56,mLogsE,x,.25+.92,0,0,1.1));
  const r=new THREE.Mesh(new THREE.ConeGeometry(.52,.55,4),mShingE);r.rotation.y=Math.PI/4;r.position.set(x,2.42,0);r.castShadow=true;G.add(r);G.add(tbox(.12,.12,.04,mBlack,x,1.75,.29),tbox(.12,.12,.04,mBlack,x,1.75,-.29));
  for(let q=0;q<4;q++)G.add(cyl(.11,1.4,mPal,sx*(1.1+q*.22),.62,0,0,0,0,6)),G.add(mesh(new THREE.ConeGeometry(.11,.25,6),mPal,sx*(1.1+q*.22),1.44,0))}
 G.add(tbox(.92,.1,.62,mPlank,0,1.55,0,0,1.5));for(let q=0;q<5;q++)G.add(cyl(.025,.35,matDark,-.4+q*.2,1.75,.28,0,0,0,4));G.add(tbox(.9,.04,.04,matDark,0,1.9,.28));
 const lw=tbox(.42,1.25,.07,mPlankD,-.21,.66,.06,0,1.6),rw=tbox(.42,1.25,.07,mPlankD,.21,.66,-.06,0,1.6);rw.rotation.y=.9;rw.position.set(.42,.66,.2);G.add(lw,rw);
 for(const w of[lw])for(const y of[.3,1.0])w.add(tbox(.44,.06,.03,mIron,0,y-.66,.05));G.add(tbox(.95,.06,.3,mStone,0,.03,0))}
// stanica: chata z nadwieszonym piętrem i częstokół
function e2Stanica(g){g.add(tbox(1.3,.25,1.3,mStone,0,.12,0,0,.9));g.add(tbox(1.15,1.0,1.15,mLogsE,0,.75,0,0,1.1));logEnds(g,1.15,1.15,1.0,.25);
 g.add(tbox(1.5,.12,1.5,mPlankD,0,1.31,0,0,1.5));g.add(tbox(1.38,.62,1.38,mLogsE2,0,1.68,0,0,1.1));for(const[x,z,r]of[[0,.7,0],[0,-.7,0],[.7,0,Math.PI/2],[-.7,0,Math.PI/2]])g.add(tbox(.2,.08,.04,mBlack,x,1.72,z,r));
 const rf=new THREE.Mesh(new THREE.ConeGeometry(1.25,.75,4),mShingE);rf.rotation.y=Math.PI/4;rf.position.y=2.36;rf.castShadow=true;g.add(rf);door(g,0,.58,0,.42,.7);
 for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.05,.8,matLog2,sx*.72,1.0,sz*.72,0,0,0,5));
 const R=.98;for(let q=0;q<28;q++){const a=q/28*6.283;if(Math.abs(Math.sin(a))>.7&&Math.cos(a)>-.1&&Math.sin(a)>0)continue;const x=Math.cos(a)*R*1.0,z=Math.sin(a)*R;if(Math.abs(x)<.98&&Math.abs(z)<.98&&q%2)continue;
  g.add(cyl(.06,.75+(q%3)*.06,mPal,x,.38,z,0,0,0,5))}
 woodpile(g,.7,.75,6,0);g.add(cyl(.16,.04,matStone,-.65,.02,.78,0,0,0,8))}
// kopanka torfu: rowy, kałuże, stosy cegiełek torfu, kładka
function e2Torf(g){g.add(tbox(1.9,.03,1.9,M(0x4a4a34),0,.0,0,0,1));
 for(const[x,z,w,d]of[[-.45,-.45,.9,.5],[.45,.2,.8,.45]]){g.add(tbox(w,.06,d,mPeat,x,.0,z,0,1));const p=new THREE.Mesh(new THREE.PlaneGeometry(w*.8,d*.6),mPuddle);p.rotation.x=-Math.PI/2;p.position.set(x,.035,z);g.add(p)}
 const st=(x,z,n)=>{for(let l=0;l<n;l++)for(let a=0;a<n-l;a++)for(let b=0;b<2;b++)g.add(tbox(.16,.08,.1,l%2?mPeatL:mPeat,x+(a-(n-l-1)/2)*.17,.05+l*.085,z+(b-.5)*.12,(l%2)*.1))};
 st(.5,-.5,4);st(-.55,.6,3);st(.1,.72,3);st(-.1,-.15,2);
 for(let q=0;q<3;q++)g.add(tbox(.14,.035,.6,mPlankD,-.85+q*.17,.04,.05,0,1.5));
 g.add(tbox(.03,.6,.03,matDark,.1,.3,-.2,.2));g.add(tbox(.14,.18,.02,mIron,.1,.05,-.2));
 const sh=new THREE.Group();sh.position.set(.6,0,.5);shed(sh,.6,.55,.62,mThatchOld);g.add(sh)}
// dymarka: gliniany piec, miech, ruda i żużel
function e2Dymarka(g){g.add(tbox(1.9,.03,1.9,M(0x5a4a3a),0,.01,0,0,1));
 const f=new THREE.Mesh(new THREE.CylinderGeometry(.2,.42,1.15,10),mClay);f.position.set(-.25,.58,-.1);f.castShadow=true;g.add(f);
 const lip=new THREE.Mesh(new THREE.TorusGeometry(.2,.05,5,10),mClayD);lip.rotation.x=Math.PI/2;lip.position.set(-.25,1.16,-.1);g.add(lip);
 const gl=new THREE.Mesh(new THREE.SphereGeometry(.12,8,5),mGlow);gl.position.set(-.25,1.13,-.1);gl.userData.noMerge=1;g.add(gl);
 g.add(tbox(.18,.16,.1,mBlack,-.25,.18,.3));g.add(tbox(.32,.06,.22,mClayD,-.25,.04,.38));
 const bel=new THREE.Group();bel.position.set(.25,.25,-.1);bel.add(tbox(.36,.12,.26,M(0x8a6a4a),0,0,0),tbox(.36,.03,.26,mPlankD,0,.08,0),tbox(.3,.04,.04,mClayD,-.2,.0,0));bel.rotation.z=.12;g.add(bel);
 for(let q=0;q<7;q++)rock(g,.55+(q%3)*.16,.08,.55+((q/3)|0)*.14,.1+(q%2)*.04,q).material=mOre;
 for(let q=0;q<5;q++){const s=mesh(new THREE.DodecahedronGeometry(.08+(q%2)*.04,0),mSlag,-.75+(q%3)*.14,.05,.6+((q/3)|0)*.14,q,q);g.add(s)}
 const sh=new THREE.Group();sh.position.set(.55,0,-.55);shed(sh,.8,.7,.85,mBoards);g.add(sh);woodpile(g,.6,-.6,6,Math.PI/2)}
// sztolnia: skalne zbocze, obudowa wejścia, wózek z rudą
function e2Sztolnia(g){for(const[x,y,z,r]of[[-.55,.35,-.55,.62],[.4,.4,-.6,.7],[0,.75,-.7,.62],[-.85,.15,.1,.4],[.85,.2,.05,.45],[.2,1.05,-.85,.45]])rock(g,x,y,z,r,x*3+z);
 g.add(tbox(.62,.75,.2,mBlack,0,.38,-.08));for(const sx of[-1,1])g.add(tbox(.1,.85,.1,matLog2,sx*.36,.42,.04));g.add(tbox(.9,.12,.14,matLog2,0,.88,.04));g.add(tbox(.62,.05,.6,mPlankD,0,.03,.35,0,1.5));
 for(let q=0;q<4;q++)g.add(tbox(.06,.04,.7,mPlankG,-.3+q*.2,.05,.55));
 const cart=new THREE.Group();cart.position.set(.25,0,.62);cart.add(tbox(.38,.2,.26,mPlank,0,.2,0,0,1.5));for(const sx of[-1,1])for(const sz of[-1,1])cart.add(cyl(.06,.03,mIron,sx*.14,.07,sz*.14,0,0,Math.PI/2,8));for(let q=0;q<4;q++)cart.add(mesh(new THREE.DodecahedronGeometry(.06,0),mOre,(q-1.5)*.07,.32,(q%2-.5)*.08));g.add(cart);
 for(let q=0;q<6;q++)rock(g,-.55+(q%3)*.14,.06,.6+((q/3)|0)*.13,.08,q).material=mOre;
 g.add(tbox(.04,.6,.04,matDark,.7,.3,.5,.3));g.add(tbox(.16,.05,.04,mIron,.7,.58,.5,.3))}
// piwnica w skale: kopiec z darnią, kamienne czoło, drzwi
function e2Piwnica(g){const mound=new THREE.Mesh(new THREE.SphereGeometry(1,14,8,0,6.283,0,Math.PI/2),mSod);mound.scale.set(.95,.62,.85);mound.position.set(0,0,-.15);mound.castShadow=true;mound.receiveShadow=true;g.add(mound);
 rock(g,-.62,.2,-.55,.42,1);rock(g,.55,.25,-.6,.36,2);
 g.add(tbox(1.0,.72,.24,mStone,0,.36,.55,0,.9));door(g,0,.68,0,.42,.6);g.add(tbox(1.1,.1,.32,mStone,0,.74,.55));
 g.add(cyl(.06,.4,matStone,.3,.62,-.2,0,0,0,6));barrel(g,-.62,.72,.75);barrel(g,.65,.75,.7);g.add(tbox(.5,.06,.25,mStone,0,.03,.88))}
// szkutnia: otwarta wiata, pochylnia ku wodzie, kocioł ze smołą, kłody
function e2Szkutnia(g){g.add(tbox(2.9,.03,1.9,M(0x7a6a52),0,.01,0,0,1))}
function e2SzkFull(G,b){// lokalnie +z wskazuje wodę
 for(const sx of[-1,1]){const r=tbox(.1,.08,4.0,matLog2,sx*.42,.1,.7);r.rotation.x=.07;G.add(r)}for(let q=0;q<8;q++)G.add(tbox(1.05,.05,.12,mPlankG,0,.12-q*.03,-1.0+q*.5,0,1.5));
 const w=2.0,d=1.4,h=1.2,zc=-.85;for(const sx of[-1,1])for(const sz of[-1,1])G.add(tbox(.11,h,.11,matLog2,sx*(w/2-.05),h/2,sz*(d/2-.06)+zc));
 for(const sx of[-1,1])G.add(tbox(.07,.07,d,matLog2,sx*(w/2-.05),h-.03,zc));{const rf=gable(w,d,.5,mBoards,h,.2);rf.position.z=zc;G.add(rf)}for(let q=0;q<5;q++)G.add(tbox(.05,.34,.05,matDark,-.7+q*.35,.17,zc-.4));G.add(tbox(1.6,.05,.1,matLog,0,.35,zc-.4))
 const st=S&&S.e2&&S.e2.r1==='wielka'?Math.min(4,S.e2.big||0):-1;
 if(st>=0){const hh=e2BigHull(st,(S.e2.bigP||0)/BIG[Math.min(3,st)].need);hh.scale.setScalar(.8);hh.position.set(0,.1,1.05);G.add(hh)}
 else if(S&&(S.res.lodz||0)>=1){const bt=e2BoatMesh(false);bt.position.set(0,.34,.7);G.add(bt);const b2=e2BoatMesh(false);b2.position.set(0,.36,2.1);b2.rotation.x=.07;if((S.res.lodz||0)>=2)G.add(b2)}
 else{for(let q=0;q<7;q++){const t=q/6,a2=.5-.22*Math.abs(t-.5);for(const sx of[-1,1]){const r=tbox(.04,a2,.04,M(0x8a6a44),sx*.3,.22+a2/2,.1+t*1.6);r.rotation.z=-sx*.35;G.add(r)}}G.add(tbox(.08,.08,1.8,matLog2,0,.2,.9))}
 woodpile(G,-1.25,-.6,10,0);G.add(tbox(1.0,.04,.3,mPlank,1.25,.4,-.8,1.4,1.5));
 const k=new THREE.Group();k.position.set(1.2,0,.3);k.add(cyl(.16,.22,mTar,0,.3,0,0,0,0,10));for(let q=0;q<3;q++){const a=q/3*6.28;k.add(cyl(.02,.42,matDark,Math.cos(a)*.18,.2,Math.sin(a)*.18,Math.sin(a)*.3,0,-Math.cos(a)*.3,4))}k.add(cyl(.12,.04,matStone,0,.03,0,0,0,0,7));G.add(k);
 for(let q=0;q<3;q++)G.add(tbox(.9,.03,.14,mPlank,-1.2,.05+q*.035,.5,Math.PI/2,1.5));G.add(tbox(.04,.6,.04,matDark,1.25,.3,-1.2,.3))}
// pochylnia ku wodzie i łódź (mała albo wielka, etapami)
function e2WaterDir(b){const d=BD[b.kind];let sx=0,sz=0;for(let a=-3;a<=d.w+2;a++)for(let q=-3;q<=d.h+2;q++){const x=b.i+a,y=b.j+q;if(x<0||y<0||x>=N||y>=N)continue;if(!land[y*N+x]){sx+=a-(d.w-1)/2;sz+=q-(d.h-1)/2}}return Math.atan2(sx,sz)}
// kadłub: przekroje od dziobu do rufy, zwężone na końcach, burty wznoszą się ku dziobowi
function hullGeo(L,W,D,nz,nr){nz=nz||14;nr=nr||8;const P=[],U=[],I=[];for(let s=0;s<=nz;s++){const t=s/nz,e=Math.abs(2*t-1),f=Math.max(0,1-Math.pow(e,2.2));const w=W*Math.max(.03,Math.sqrt(f)),d=D*(.3+.7*Math.pow(f,.4)),yt=D*.32*e*e;
  for(let a=0;a<=nr;a++){const u=a/nr,ph=(u-.5)*Math.PI;P.push(w*Math.sin(ph),D-d*Math.cos(ph)+yt,(t-.5)*L);U.push(u*W*2.2,t*L*1.2)}}
 for(let s=0;s<nz;s++)for(let a=0;a<nr;a++){const i=s*(nr+1)+a;I.push(i,i+1,i+nr+1,i+1,i+nr+2,i+nr+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();return g}
const mHull=TM(TX.planks,0x9a7a58,{side:THREE.DoubleSide}),mHullD=TM(TX.planks,0x8a6a4a,{side:THREE.DoubleSide});
function e2BigHull(st,frac){const G=new THREE.Group();const L=3.1;
 G.add(tbox(.12,.12,L,matLog2,0,.12,0));const stem=tbox(.1,.9,.1,matLog2,0,.55,L/2-.05);stem.rotation.x=-.25;G.add(stem);const st2=tbox(.1,.75,.1,matLog2,0,.48,-L/2+.05);st2.rotation.x=.2;G.add(st2);
 if(st<2&&(st>=1||frac>.2)){const n=st>=1?11:Math.max(1,Math.round(11*frac));for(let q=0;q<n;q++){const z=-L/2+.3+q*(L-.6)/10,wd=.5+.35*Math.sin(Math.PI*(q+.5)/11);for(const sx of[-1,1]){const r=tbox(.05,.62,.05,M(0x8a6a44),sx*wd*.82,.45,z);r.rotation.z=-sx*.42;G.add(r)}G.add(tbox(wd*1.5,.05,.05,M(0x8a6a44),0,.18,z))}}
 if(st>=2){const hm=new THREE.Mesh(hullGeo(L*1.02,.78,.78,16,10),mHull);hm.position.y=.06;hm.castShadow=true;hm.receiveShadow=true;G.add(hm);G.add(tbox(.12,.08,L*.98,matLog2,.0,.84,0));for(const sx of[-1,1]){const gw=tbox(.06,.06,L*.9,matLog2,sx*.72,.84,0);G.add(gw)}for(let q=0;q<4;q++)G.add(tbox(1.3,.05,.18,mPlankD,0,.66,-L/2+.7+q*.55,0,1.4))}
 else if(st===1&&frac>.05){for(const sx of[-1,1])for(let r=0;r<Math.round(5*frac);r++){const pl=tbox(.04,.12,L*.85,TM(TX.planks,0xa08060),sx*(.38+r*.06),.28+r*.1,0);pl.rotation.z=-sx*(.35+r*.08);G.add(pl)}}
 if(st>=3){G.add(cyl(.05,2.6,matLog2,0,2.0,.25,0,0,0,6));if(st>=4){const sl=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.6,4,4),mCanvN);const p=sl.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),x=p.getX(i);p.setZ(i,Math.cos(x/1.3*Math.PI)*.12*(1-Math.abs(y)/1.6))}sl.geometry.computeVertexNormals();sl.position.set(0,2.0,.32);sl.rotation.y=Math.PI/2;sl.castShadow=true;G.add(sl);
  G.add(cyl(.008,2.4,M(0xcfc6b0),0,1.9,1.1,.55,0,0,3),cyl(.008,2.3,M(0xcfc6b0),0,1.9,-.6,-.5,0,0,3))}else{G.add(cyl(.03,1.2,matLog2,0,2.2,.25,0,0,Math.PI/2,5))}}
 return G}
{const _nm=newModel;newModel=function(kind,g){if(kind==='targ'){e2Targ3(g);return 1}if(kind==='brama'){e2Brama(g);return 1}if(kind==='stanica'){e2Stanica(g);return 1}if(kind==='torfowisko'){e2Torf(g);return 1}
 if(kind==='dymarka'){e2Dymarka(g);return 1}if(kind==='sztolnia'){e2Sztolnia(g);return 1}if(kind==='piwnica'){e2Piwnica(g);return 1}if(kind==='szkutnia'){e2Szkutnia(g);return 1}return _nm(kind,g)}}
{const _av=addBldVisuals;addBldVisuals=function(g,b){_av(g,b);try{
 if(b.kind==='brama'){const gt=g.children.find(o=>o.userData&&o.userData.gate);if(gt){const c=bCenter(b);gt.rotation.y=Math.atan2(c.x-tcx(camp.i),c.z-tcx(camp.j))}}
 if(b.kind==='szkutnia'){const a=e2WaterDir(b);const sl=new THREE.Group();sl.rotation.y=a;e2SzkFull(sl,b);g.add(sl)}}catch(er){console.warn(er)}}}
Object.assign(SIGNK,{dymarka:'narz',szkutnia:'deski',torfowisko:'opal',sztolnia:'ruda'});
window.__e2m={e2BigHull,e2BoatMesh,e2WaterDir};
// ---------- mniej wywołań rysowania: takie same materiały w budynkach stają się jednym ----------
const MATC=new Map(),FNID=new WeakMap();let fnN=0;
const fnId=f=>{if(!f)return 0;if(!FNID.has(f))FNID.set(f,++fnN);return FNID.get(f)};
function matKey(m){if(!m||Array.isArray(m)||!m.isMeshStandardMaterial||m.transparent)return null;if(m.emissive&&m.emissive.getHex())return null;let ud='';try{ud=JSON.stringify(m.userData||{});if(ud.length>200)return null}catch(e){return null}
 const cp=m.customProgramCacheKey!==THREE.Material.prototype.customProgramCacheKey?'c'+fnId(m.customProgramCacheKey)+':'+m.customProgramCacheKey():'';
 return[m.color.getHex(),m.map?m.map.uuid:'',m.roughness,m.metalness,m.side,m.vertexColors?1:0,m.flatShading?1:0,m.depthWrite?1:0,m.alphaTest,fnId(m.onBeforeCompile),cp,m.normalMap?m.normalMap.uuid:'',m.bumpMap?m.bumpMap.uuid:'',ud].join('|')}
// gładkie kolory (bez faktury) idą do jednego materiału z kolorem w wierzchołkach
const VCM=new Map(),PCK=THREE.Material.prototype.customProgramCacheKey;
function vcKey(m){if(!m||Array.isArray(m)||!m.isMeshStandardMaterial||m.map||m.transparent||m.vertexColors||m.normalMap||m.bumpMap||m.alphaTest)return null;if(m.emissive&&m.emissive.getHex())return null;
 return[m.roughness,m.metalness,m.side,m.flatShading?1:0,fnId(m.onBeforeCompile),m.customProgramCacheKey!==PCK?m.customProgramCacheKey():''].join('|')}
function toVC(o){const k=vcKey(o.material);if(!k)return;let vm=VCM.get(k);if(!vm){vm=o.material.clone();vm.color.setRGB(1,1,1);vm.vertexColors=true;vm.onBeforeCompile=o.material.onBeforeCompile;if(o.material.customProgramCacheKey!==PCK)vm.customProgramCacheKey=o.material.customProgramCacheKey;VCM.set(k,vm)}
 const src=o.geometry;if(!src||!src.attributes||!src.attributes.position)return;const geo=src.index?src.toNonIndexed():src.clone();const n=geo.attributes.position.count,C=new Float32Array(n*3),c=o.material.color;for(let i=0;i<n;i++){C[i*3]=c.r;C[i*3+1]=c.g;C[i*3+2]=c.b}
 geo.setAttribute('color',new THREE.BufferAttribute(C,3));o.geometry=geo;o.material=vm}
{const _mg=mergeGroup;mergeGroup=function(g){if(g&&!/nomatc/.test(location.search))g.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.noMerge||o.userData.noAge)return;if(o.parent&&o.parent.userData&&o.parent.userData.noMerge)return;
  if(!/novc/.test(location.search)&&vcKey(o.material)){toVC(o);return}const k=matKey(o.material);if(!k)return;const c=MATC.get(k);if(c)o.material=c;else MATC.set(k,o.material)});return _mg(g)}}
// ---------- wsadowe rysowanie gotowych budynków: jedna bryła na materiał w każdym kwadracie wyspy ----------
const BAT={cells:new Map(),t:0,on:!/nobatch/.test(location.search),CELL:32};const batG=new THREE.Group();batG.name='batch';scene.add(batG);
{const _ab=addBuildingMesh;addBuildingMesh=function(b){const g=_ab(b);if(g)g.userData.t0=performance.now();return g}}
function batOk(b){const g=bMesh[b.id];if(!g||g.parent!==bGroup||!bDone(b)||b.fire)return false;const u=g.userData;if(u.scaf||u.site||u.bp||u.popT>0||!u.t0||performance.now()-u.t0<2500)return false;return g.scale.y===1&&g.visible}
function batMeshes(g,fn){const walk=o=>{if(o!==g&&(o.userData.noMerge||o.isSprite))return;if(o.isMesh&&!o.isInstancedMesh&&o.material&&!Array.isArray(o.material)&&o.material.isMeshStandardMaterial&&!o.material.transparent&&o.geometry&&o.geometry.attributes.position&&(o.visible||o.userData.bHid))fn(o);for(const c of o.children)walk(c)};walk(g)}
const _bP=new THREE.Vector3(),_bN=new THREE.Vector3(),_bM3=new THREE.Matrix3();
function batBuild(list){const byMat=new Map();list.forEach(b=>{const g=bMesh[b.id];g.updateMatrixWorld(true);batMeshes(g,o=>{if(!byMat.has(o.material))byMat.set(o.material,[]);byMat.get(o.material).push(o)})});
 const out=[];byMat.forEach((L,mat)=>{let tot=0;const parts=L.map(o=>{const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry;tot+=geo.attributes.position.count;return[o,geo]});
  const P=new Float32Array(tot*3),Nn=new Float32Array(tot*3),U=new Float32Array(tot*2),useC=!!mat.vertexColors,C=useC?new Float32Array(tot*3):null;let off=0;let sh=false;
  for(const[o,geo]of parts){const M4=o.matrixWorld;_bM3.getNormalMatrix(M4);const pa=geo.attributes.position,na=geo.attributes.normal,ua=geo.attributes.uv,ca=geo.attributes.color;if(o.castShadow)sh=true;
   // 4.9.0-rc.14: budynek w lustrzanym odbiciu (ujemna skala) odwraca kolejność wierzchołków. Pojedynczą bryłę three.js obraca sam,
   // ale we wspólnej bryle trzeba zamienić 2. i 3. wierzchołek każdego trójkąta, inaczej dach i ściany są widziane od środka i znikają.
   const flip=M4.determinant()<0;
   for(let i=0;i<pa.count;i++){const t=flip?off+i-i%3+(i%3===0?0:3-i%3):off+i;_bP.fromBufferAttribute(pa,i).applyMatrix4(M4);P[t*3]=_bP.x;P[t*3+1]=_bP.y;P[t*3+2]=_bP.z;
    if(na){_bN.fromBufferAttribute(na,i).applyMatrix3(_bM3).normalize();Nn[t*3]=_bN.x;Nn[t*3+1]=_bN.y;Nn[t*3+2]=_bN.z}
    if(ua){U[t*2]=ua.getX(i);U[t*2+1]=ua.getY(i)}if(C){if(ca){C[t*3]=ca.getX(i);C[t*3+1]=ca.getY(i);C[t*3+2]=ca.getZ(i)}else C[t*3]=C[t*3+1]=C[t*3+2]=1}}
   off+=pa.count;if(geo!==o.geometry)geo.dispose()}
  const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(P,3));mg.setAttribute('normal',new THREE.BufferAttribute(Nn,3));mg.setAttribute('uv',new THREE.BufferAttribute(U,2));if(C)mg.setAttribute('color',new THREE.BufferAttribute(C,3));mg.computeBoundingSphere();mg.computeBoundingBox();
  const m=new THREE.Mesh(mg,mat);m.castShadow=sh;m.receiveShadow=true;m.matrixAutoUpdate=false;m.updateMatrix();batG.add(m);out.push(m)});
 list.forEach(b=>batMeshes(bMesh[b.id],o=>{o.visible=false;o.userData.bHid=1}));return out}
function batFree(c){c.meshes.forEach(m=>{batG.remove(m);m.geometry.dispose()});c.items.forEach(([id,g])=>{if(bMesh[id]===g)batMeshes(g,o=>{if(o.userData.bHid){o.visible=true;o.userData.bHid=0}})})}
function batTick(rdt){if(!S||!BAT.on)return;BAT.t-=rdt;if(BAT.t>0)return;BAT.t=.5;
 const want=new Map();for(const b of S.bld){if(!batOk(b))continue;const c=bCenter(b),k=Math.floor((c.x+N/2)/BAT.CELL)+','+Math.floor((c.z+N/2)/BAT.CELL);if(!want.has(k))want.set(k,[]);want.get(k).push(b)}
 const keys=new Set([...want.keys(),...BAT.cells.keys()]);let built=0;
 for(const k of keys){const L=want.get(k)||[];const sig=L.map(b=>b.id+':'+bMesh[b.id].uuid+':'+(bMesh[b.id].userData.ageBk||0)).join(',');const cur=BAT.cells.get(k);if(cur&&cur.sig===sig)continue;
  if(built>=2)continue;if(cur)batFree(cur);BAT.cells.delete(k);if(!L.length)continue;const meshes=batBuild(L);BAT.cells.set(k,{sig,meshes,items:L.map(b=>[b.id,bMesh[b.id]])});built++}}
function batReset(){BAT.cells.forEach(c=>batFree(c));BAT.cells.clear()}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{batTick(rdt)}catch(er){console.warn('batch',er);BAT.on=false;batReset()}}}
{const _rw=rebuildWorldFromState;rebuildWorldFromState=function(){batReset();return _rw()}}
window.__bat=BAT;
// pole: kłosy jako jedna bryła z instancjami zamiast czterdziestu dwóch osobnych
{const _mbp=makeBuildingModel;makeBuildingModel=function(kind,bb){const g=_mbp(kind,bb);if(kind==='pole'&&g.userData.crops&&!/nocropi/.test(location.search)){const cr=g.userData.crops;const Lc=cr.children.filter(c=>c.isMesh);if(Lc.length){
 const im=new THREE.InstancedMesh(new THREE.ConeGeometry(.12,.6,4),M(0x6a8a3a),Lc.length);Lc.forEach((c,i)=>{c.updateMatrix();im.setMatrixAt(i,c.matrix)});im.castShadow=true;im.receiveShadow=true;im.userData.base=Lc.map(c=>c.position.clone());
 Lc.forEach(c=>cr.remove(c));cr.add(im);cr.userData.inst=im;cr.userData.noMerge=1}}return g}}
{const _fv=fieldVis;fieldVis=function(b){const m=bMesh[b.id];const cr=m&&m.userData.crops;if(!cr||!cr.userData.inst)return _fv(b);const im=cr.userData.inst;const f=b.field||{st:'puste',g:0};const gg=f.st==='puste'?0:f.st==='dojrzale'?1:f.g;
 im.material.color.setRGB(L(lerp(.42,.86,gg)),L(lerp(.6,.7,gg)),L(lerp(.25,.3,gg)));const M4=new THREE.Matrix4(),q=new THREE.Quaternion(),sv=new THREE.Vector3();const s=gg<=0?0:.25+.75*gg;
 im.userData.base.forEach((p,i)=>{M4.compose(p,q,sv.set(s,s*(.85+((i*7)%5)*.06),s));im.setMatrixAt(i,M4)});im.instanceMatrix.needsUpdate=true}}
