
/* ================= 4.9.0-rc.1 Sylwetki rzemiosł ================= */
// Każdy warsztat ma swój znak rozpoznawczy widoczny z daleka i podwórze ułożone pod swoją pracę.
// Modele korzystają z tych samych pomocników co reszta (plankHut, logHouse, gable, shed), więc wykonanie
// (surowe, porządne, mistrzowskie), kolory, koniki i szyldy działają na nich tak samo jak wcześniej.
const WKC={};function wkMt(c,o){const k=c+'|'+(o?JSON.stringify(o):'');return WKC[k]||(WKC[k]=M(c,o))}
const W_UP=new THREE.Vector3(0,1,0),W_V=new THREE.Vector3();
const wkG={pot:new THREE.SphereGeometry(.075,7,5),cheese:new THREE.CylinderGeometry(.1,.1,.065,9),hoop:new THREE.TorusGeometry(.15,.013,4,12),grape:new THREE.IcosahedronGeometry(.045,0),
 ore:new THREE.DodecahedronGeometry(.1,0),coal:new THREE.DodecahedronGeometry(.08,0),hen:new THREE.SphereGeometry(.07,6,4),jug:new THREE.SphereGeometry(.085,8,6)};
const wkM={copper:wkMt(0xb0683a,{metalness:.55,roughness:.38}),iron:wkMt(0x3c3e42,{metalness:.55,roughness:.42}),bark:wkMt(0x5a4632),clay:wkMt(0xa0603a),clayRaw:wkMt(0x8a7a62),earth:wkMt(0x3a332b),turf:wkMt(0x4f5a34),
 cheese:wkMt(0xe0bf5a),glass:wkMt(0x5a8a62,{roughness:.25}),grape:wkMt(0x4a2450),honey:wkMt(0xd8a030,{roughness:.3}),meat:wkMt(0x7a2e26),feather:wkMt(0xe8e2d4),hen2:wkMt(0xa8643a),comb:wkMt(0xc0302a),
 grain:wkMt(0xc8a050),sawdust:wkMt(0xcdb58a),water:wkMt(0x34505a,{roughness:.12}),rope:wkMt(0xb8a682),red:wkMt(0x9a3a2a),blue:wkMt(0x3a5a8a),ochre:wkMt(0xc09a40),flax:wkMt(0xe6dcc4),coal:wkMt(0x1c1c1e,{roughness:.5,metalness:.15})};
const W_LESR=TM(TX.thatch,0x8aa060);
const W_SMOKE=new THREE.SpriteMaterial({map:softTex,transparent:true,opacity:.22,depthWrite:false,color:0xd0d4d0});
// pomocnicy
function wNo(log){if(!STY)return;STY.lean=false;STY.pots=false;STY.ganek=false;STY.bench=false;if(log)STY.herbs=false}
function wSub(g,x,z,ry){const s=new THREE.Group();s.position.set(x,0,z);if(ry)s.rotation.y=ry;g.add(s);return s}
function wBeam(g,a,b,r,mat,seg){W_V.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const L=W_V.length();const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,seg||5),mat);
 m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.quaternion.setFromUnitVectors(W_UP,W_V.normalize());m.castShadow=m.receiveShadow=true;g.add(m);return m}
function wSc(m,x,y,z){m.scale.set(x,y,z);return m}
function wPost(g,x,z,h,r,mat){g.add(cyl(r||.045,h,mat||matLog2,x,h/2,z,0,0,0,5))}
function wBarrel(g,x,y,z,s,lie,ry){s=s||1;const b=new THREE.Group();b.add(cyl(.17*s,.42*s,mPlank,0,0,0,0,0,0,10),cyl(.178*s,.03*s,wkM.iron,0,-.11*s,0,0,0,0,10),cyl(.178*s,.03*s,wkM.iron,0,.11*s,0,0,0,0,10));
 b.position.set(x,y+(lie?.17*s:.21*s),z);if(lie)b.rotation.set(0,ry||0,Math.PI/2);else if(ry)b.rotation.y=ry;g.add(b);return b}
function wLogs(g,x,z,len,rows,cols,ry,r){r=r||.075;const p=new THREE.Group();for(let a=0;a<rows;a++)for(let c=0;c<cols-(a%2?1:0);c++)p.add(cyl(r,len,matLog,0,r+a*r*1.75,(c-(cols-1)/2)*r*2.05+(a%2?r:0),0,0,Math.PI/2,6));
 p.position.set(x,0,z);p.rotation.y=ry||0;g.add(p);return p}
function wBoards(g,x,z,len,n,ry){const p=new THREE.Group();for(let k=0;k<n;k++){for(let c=0;c<3;c++)p.add(tbox(len,.035,.15,mPlank,0,.04+k*.07,(c-1)*.16,0,2));if(k<n-1)for(const q of[-len*.38,len*.38])p.add(tbox(.04,.035,.5,matDark,q,.075+k*.07,0))}
 p.position.set(x,0,z);p.rotation.y=ry||0;g.add(p);return p}
function wSmoke(g,x,y,z,s){const sp=new THREE.Sprite(W_SMOKE);sp.scale.set(s||.9,s||.9,1);sp.position.set(x,y,z);g.add(sp);return sp}
function wGlow(g,x,y,z,w,h,ry){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mGlow);p.position.set(x,y,z);if(ry)p.rotation.y=ry;g.add(p);return p}
function wShelf(g,x,z,w,levels,ry,fill){const s=wSub(g,x,z,ry);for(const sx of[-1,1])for(const sz of[-1,1])s.add(tbox(.05,.3+levels*.3,.05,matDark,sx*(w/2-.03),(.3+levels*.3)/2,sz*.13));
 for(let k=0;k<levels;k++){s.add(tbox(w,.035,.3,mPlank,0,.3+k*.3,0,0,2));if(fill)fill(s,.3+k*.3+.02,k)}return s}
function wCone(g,r,h,seg,mat,x,y,z,ry){const m=mesh(new THREE.ConeGeometry(r,h,seg),mat,x,y,z);if(ry)m.rotation.y=ry;g.add(m);return m}
function wWattle(g,x1,z1,x2,z2,h){const L=Math.hypot(x2-x1,z2-z1);const f=tbox(L,h||.32,.04,mWattle,(x1+x2)/2,(h||.32)/2,(z1+z2)/2,-Math.atan2(z2-z1,x2-x1),2);g.add(f);
 const n=Math.max(2,Math.round(L/.4));for(let k=0;k<=n;k++)g.add(cyl(.025,(h||.32)+.12,matDark,x1+(x2-x1)*k/n,((h||.32)+.12)/2,z1+(z2-z1)*k/n,0,0,0,4))}

/* ---- bednarnia: piramida beczek, obręcze, klepki ---- */
function wBednarnia(g){wNo();const h=plankHut(g,1.1,.85,.82,{win:true,lamp:true});h.position.set(-.4,0,-.5);
 const sh=wSub(g,.52,-.45);shed(sh,.86,.75,.95);sh.add(tbox(.62,.06,.2,mPlank,0,.42,0,0,2),tbox(.05,.42,.05,matDark,-.25,.21,0),tbox(.05,.42,.05,matDark,.25,.21,0));
 const half=new THREE.Mesh(new THREE.CylinderGeometry(.15,.21,.34,10,1,true),wkMt(0x9a7652,{side:THREE.DoubleSide}));half.position.set(0,.63,0);half.castShadow=true;sh.add(half);
 // piramida 3-2-1 przed warsztatem
 {const py=wSub(g,.36,.36,-Math.PI/4);for(let i=0;i<3;i++)wBarrel(py,0,0,-.34+i*.34,.95,true,0);for(let i=0;i<2;i++)wBarrel(py,0,.28,-.17+i*.34,.95,true,0);wBarrel(py,0,.56,0,.95,true,0)}
 wBarrel(g,-.62,0,.55,.85);wBarrel(g,-.86,0,.25,.75);
 // słup z obręczami
 wPost(g,-.88,-.05,1.15,.04);for(let k=0;k<3;k++){const r=new THREE.Mesh(wkG.hoop,wkM.iron);r.position.set(-.88,.5+k*.2,.06);r.scale.setScalar(1-k*.12);g.add(r)}
 // klepki oparte o ścianę
 for(let k=0;k<7;k++){const s=tbox(.07,.7,.025,mPlank,-.85+k*.085,.33,-.04,0,2);s.rotation.x=-.22;g.add(s)}}

/* ---- browar: suszarnia słodu jak wieża, kocioł z miedzi, kadzie ---- */
function wBrowar(g){wNo(1);const m=wSub(g,-.45,-.25);logHouse(m,1.6,1.15,1.0,{chim:0,win:true,rh:.95});
 const t=wSub(g,.88,-.3);t.add(tbox(.82,.5,.82,mStone,0,.25,0,0,1.2));t.add(tbox(.74,1.15,.74,mLogsD,0,.5+.575,0,0,1.1));
 const rf=mesh(new THREE.ConeGeometry(.66,.62,4),mShingle,0,1.65+.31,0);rf.rotation.y=Math.PI/4;t.add(rf);
 t.add(tbox(.26,.22,.26,mPlankD,0,2.35,0,0,1.5));const cp=mesh(new THREE.ConeGeometry(.24,.24,4),mShingle,0,2.58,0);cp.rotation.y=Math.PI/4;t.add(cp);
 for(const s of[-1,1])t.add(tbox(.2,.035,.02,matDark,s*.0,2.3+s*.05,.135));wSmoke(t,0,2.95,0,1.0);door(t,0,.42,0,.4,.42);
 // kocioł pod daszkiem
 const k=wSub(g,.75,.55);k.add(cyl(.32,.26,mStone,0,.13,0,0,0,0,9));k.add(new THREE.Mesh(new THREE.CylinderGeometry(.27,.22,.32,12),wkM.copper).translateY(.42));wGlow(k,0,.12,.33,.22,.1);
 for(const[x,z]of[[-.38,-.3],[.38,-.3],[-.38,.3],[.38,.3]])wPost(k,x,z,1.0,.035,matDark);k.add(gable(.9,.75,.28,mBoards,1.0,.08));
 // kadzie i worki
 for(const[x,z]of[[-1.05,.62],[-.48,.7]]){g.add(cyl(.26,.38,mPlank,x,.19,z,0,0,0,12),cyl(.265,.03,wkM.iron,x,.3,z,0,0,0,12));g.add(cyl(.23,.02,wkM.honey,x,.37,z,0,0,0,12))}
 sack(g,.05,.78);sack(g,.25,.86,.9);wBarrel(g,-1.25,0,-.75,.8);wBarrel(g,-1.25,0,-.35,.8)}

/* ---- słodownia: niska suszarnia z wywietrznikiem na kalenicy, rozsypane ziarno ---- */
function wSlodownia(g){wNo(1);const m=wSub(g,0,-.38);logHouse(m,1.6,.95,.72,{win:false,rh:.6});const H=STY&&STY.house;const ry=.3+(H?H.h+H.rh:.72+.6);
 const v=wSub(m,0,0);for(const x of[-.5,0,.5])for(const z of[-.18,.18])v.add(tbox(.05,.2,.05,matDark,x,ry+.06,z));v.add(gable(1.15,.42,.18,mBoards,ry+.16,.06));
 m.add(tbox(.34,1.3,.34,mStone,.95,.65,-.25,0,1.2),tbox(.42,.06,.42,matStone,.95,1.33,-.25));wSmoke(m,.95,1.75,-.25,.8);
 g.add(tbox(1.25,.04,.5,wkM.grain,-.1,.03,.5));for(let k=0;k<5;k++)g.add(tbox(1.2,.02,.03,wkMt(0xa8843c),-.1,.055,.3+k*.1));
 wBeam(g,[.6,.04,.55],[.95,.75,.65],.02,matWood);g.add(tbox(.32,.04,.06,matWood,.6,.06,.52));sack(g,-.85,.62);sack(g,-.85,.32,.85)}

/* ---- miodosytnia: gąsiory na półkach, kadź miodu, kłody bartne ---- */
function wMiodosytnia(g){wNo();const h=plankHut(g,1.15,.85,.85,{win:true,lamp:true});h.position.set(-.35,0,-.5);
 wShelf(g,.45,.22,.8,2,0,(s,y)=>{for(let k=0;k<3;k++){const j=mesh(wkG.jug,k%2?wkM.glass:mPot,-.26+k*.26,y+.1,0);j.scale.set(1.2,1.4,1.2);s.add(j);s.add(cyl(.03,.1,k%2?wkM.glass:mPot,-.26+k*.26,y+.26,0,0,0,0,5))}});
 g.add(cyl(.23,.36,mPlank,-.62,.18,.5,0,0,0,12),cyl(.235,.03,wkM.iron,-.62,.28,.5,0,0,0,12),cyl(.2,.02,wkM.honey,-.62,.355,.5,0,0,0,12));
 for(const[x,z]of[[.82,-.72],[.82,-.32]]){g.add(cyl(.14,.85,wkM.bark,x,.43,z,0,0,0,8));wCone(g,.2,.18,7,mThatch,x,.95,z);g.add(tbox(.04,.12,.02,matDark,x,.5,z+.14))}}

/* ---- myśliwy: ramy ze skórami, suszona zwierzyna, poroże ---- */
function wMysliwy(g){wNo(1);const m=wSub(g,-.38,-.48);logHouse(m,1.2,.85,.82,{win:false,rh:.7});const H=STY&&STY.house;const top=.3+(H?H.h:.82)+.12;
 m.add(tbox(.36,.06,.06,matBone,0,top,.48));for(const s of[-1,1]){wBeam(m,[s*.14,top,.48],[s*.42,top+.42,.52],.022,matBone,4);wBeam(m,[s*.3,top+.2,.5],[s*.18,top+.42,.52],.016,matBone,4);wBeam(m,[s*.38,top+.32,.51],[s*.52,top+.5,.52],.016,matBone,4)}
 for(const[x,z,ry]of[[.52,.4,.55],[.72,-.3,.95]]){const f=wSub(g,x,z,ry);f.scale.setScalar(1.18);for(const s of[-1,1]){f.add(tbox(.04,.95,.04,matLog2,s*.38,.47,0));}f.add(tbox(.8,.04,.04,matLog2,0,.9,0),tbox(.8,.04,.04,matLog2,0,.12,0));
  const hd=new THREE.Mesh(new THREE.PlaneGeometry(.62,.66),wkMt(0x9a7452,{side:THREE.DoubleSide}));hd.position.set(0,.5,0);hd.castShadow=true;f.add(hd);for(let k=0;k<4;k++)f.add(tbox(.008,.008,.01,wkM.rope,0,.18+k*.22,0))}
 const r=wSub(g,-.55,.5);r.add(tbox(.04,.85,.04,matDark,-.4,.42,0),tbox(.04,.85,.04,matDark,.4,.42,0));r.add(cyl(.02,.86,matDark,0,.82,0,0,0,Math.PI/2,5));
 for(let k=0;k<5;k++){const s=tbox(.06,.3,.03,wkM.meat,-.3+k*.15,.62,0);s.rotation.z=(k%2-.5)*.12;r.add(s)}
 for(const x of[-.05,.08])wBeam(g,[x+.12,.02,-.02],[x,1.2,-.05],.018,matWood,4);g.add(wSc(mesh(new THREE.SphereGeometry(.18,7,4),wkMt(0x6a4a30),.0,.04,.75),1.4,.25,1))}

/* ---- drwal: sągi, kozioł z kłodą, pień z siekierą ---- */
function wDrwal(g){wNo();const h=plankHut(g,.95,.78,.78,{});h.position.set(-.48,0,-.55);
 wLogs(g,.42,-.55,1.05,5,6,0,.075);wLogs(g,-.62,.2,.9,4,4,Math.PI/2,.075);
 const sh=wSub(g,.42,.3,.25);for(const x of[-.3,.3]){wBeam(sh,[x-.14,0,-.16],[x+.14,.55,.16],.025,matDark,4);wBeam(sh,[x+.14,0,-.16],[x-.14,.55,.16],.025,matDark,4)}sh.add(cyl(.11,1.0,matLog,0,.6,0,0,0,Math.PI/2,7));
 g.add(cyl(.17,.3,matLog2,-.05,.15,.72,0,0,0,9));wBeam(g,[-.05,.3,.72],[.12,.62,.62],.018,matWood,4);g.add(tbox(.04,.11,.15,wkM.iron,.13,.62,.58,-.4));
 for(let k=0;k<5;k++){const c=tbox(.08,.06,.16,matLog2,-.3+((k*37)%9)*.04,.03,.88-((k*13)%5)*.03,k);g.add(c)}g.add(cyl(.12,1.3,matLog,.55,.12,.82,0,.1,Math.PI/2,7))}

/* ---- leśniczówka: szkółka sadzonek za płotkiem ---- */
function wLesnik(g){wNo();const h=plankHut(g,.95,.8,.8,{roof:W_LESR});h.position.set(-.5,0,-.55);
 for(let a=0;a<3;a++)for(let b=0;b<4;b++){const x=.02+b*.24,z=-.62+a*.42;g.add(tbox(.2,.06,.34,wkMt(0x4a3420),x,.03,z));const s=.12+(a*.12)+(b*.03);
  g.add(cyl(.012,s*.5,matDark,x,.06+s*.25,z,0,0,0,3));wCone(g,.035+s*.18,s,6,wkMt(a===2?0x356b38:0x4a8a40),x,.06+s*.5+s*.4,z)}
 wWattle(g,-.12,-.85,.95,-.85,.28);wWattle(g,.95,-.85,.95,.3,.28);wWattle(g,-.12,.3,.95,.3,.28);
 g.add(cyl(.09,.14,mPlank,-.15,.07,.55,0,0,0,8));const tr=mesh(new THREE.SphereGeometry(.13,7,5),mCanvas,-.5,.12,.6);g.add(tr);wCone(g,.16,.6,6,wkMt(0x3f7a3a),-.5,.55,.6);
 g.add(tbox(.04,.6,.04,matWood,-.78,.3,.5))}

/* ---- ptasznik: gołębnik na słupie, sieci, klatki ---- */
function wPtasznik(g){wNo();const h=plankHut(g,1.05,.8,.8,{win:true});h.position.set(-.4,0,-.5);
 const d=wSub(g,.62,.22);d.add(cyl(.06,1.75,matLog2,0,.87,0,0,0,0,6));d.add(tbox(.5,.06,.5,mPlank,0,1.78,0,0,2),tbox(.42,.38,.42,mPlankG,0,2.0,0,0,1.5));
 const rf=mesh(new THREE.ConeGeometry(.42,.34,4),mBoards,0,2.36,0);rf.rotation.y=Math.PI/4;d.add(rf);for(const x of[-.1,.1])d.add(tbox(.08,.1,.02,matDark,x,2.02,.215));d.add(tbox(.46,.02,.08,mPlank,0,1.92,.26));
 for(let k=0;k<3;k++)d.add(wSc(mesh(wkG.hen,wkM.feather,-.15+k*.15,1.86+(k%2)*.02,.24),.75,.7,1));
 const n=wSub(g,.6,-.42,1.2);n.add(tbox(.04,1.1,.04,matDark,-.5,.55,0),tbox(.04,1.1,.04,matDark,.5,.55,0));const net=new THREE.Mesh(new THREE.PlaneGeometry(.96,.8,6,5),new THREE.MeshBasicMaterial({color:0x4a4a3a,wireframe:true}));net.position.y=.62;n.add(net);
 for(const[x,z]of[[-.7,.45],[-.45,.62]]){g.add(tbox(.24,.2,.2,new THREE.MeshBasicMaterial({color:0x6a5a40,wireframe:true}),x,.32,z));g.add(tbox(.26,.03,.22,mPlank,x,.21,z))}g.add(tbox(.6,.04,.2,mPlank,-.58,.2,.55),tbox(.04,.2,.15,matDark,-.85,.1,.55),tbox(.04,.2,.15,matDark,-.31,.1,.55))}

/* ---- kamieniołom: żuraw, bloki, ława kamieniarza ---- */
function wKamien(g){wNo();const s=wSub(g,-.5,-.55);shed(s,.85,.7,.85,mPlankD);s.add(tbox(.6,.3,.35,mStone,0,.15,0,0,1.2));
 const ap=[.2,1.75,-.05];for(const[x,z]of[[-.25,-.45],[.7,-.35],[.2,.42]])wBeam(g,[x,0,z],ap,.04,matLog2,5);g.add(cyl(.012,.95,wkM.rope,.2,1.25,-.05,0,0,0,3));
 g.add(tbox(.32,.26,.3,mStone,.2,.66,-.05,0,1.4));g.add(tbox(.06,.06,.32,wkM.iron,.2,.81,-.05));
 for(const[x,y,z,w]of[[.7,0,.5,.42],[.68,.3,.48,.34],[.25,0,.72,.36],[-.15,0,.72,.3]])g.add(tbox(w,.3,.32,mStone,x,y+.15,z,(x*7)%1,1.3));
 const b=wSub(g,-.55,.35);b.add(cyl(.09,.55,matLog,-.22,.09,0,Math.PI/2,0,0,6),cyl(.09,.55,matLog,.22,.09,0,Math.PI/2,0,0,6),tbox(.6,.25,.4,mStone,0,.3,0,0,1.3));
 for(let k=0;k<8;k++)g.add(mesh(new THREE.DodecahedronGeometry(.05+(k%3)*.02,0),matStone,-.15+((k*7)%5)*.08,.04,.15+((k*3)%4)*.06,k,k))}

/* ---- wykop rudy: kołowrót nad szybem, rude hałdy, taczka ---- */
function wRuda(g){wNo();const h=plankHut(g,.85,.7,.72,{});h.position.set(-.55,0,-.6);
 const w=wSub(g,.3,-.05);w.add(cyl(.42,.05,wkMt(0x241c14),0,.02,0,0,0,0,12));for(const s of[-1,1])w.add(cyl(.18,.12,mStone,s*.32,.06,0,0,0,0,7));
 for(const s of[-1,1])w.add(tbox(.07,.95,.07,matLog2,s*.48,.47,0));w.add(cyl(.07,1.05,matLog,0,.82,0,0,0,Math.PI/2,7));w.add(tbox(.04,.25,.04,matDark,.6,.72,.08),tbox(.15,.03,.03,matDark,.66,.6,.08));
 w.add(cyl(.01,.6,wkM.rope,0,.5,0,0,0,0,3));w.add(cyl(.1,.14,mPlank,0,.2,0,0,0,0,8));w.add(gable(1.15,.5,.25,mBoards,1.0,.08));
 for(const[x,z,n]of[[-.6,.45,9],[.75,.62,6]])for(let k=0;k<n;k++){const a=k*2.3,r=(k%3)*.1;g.add(mesh(wkG.ore,wkMt(k%2?0x8a3e26:0x6a3422),x+Math.cos(a)*r,.08+(k>5?.12:0),z+Math.sin(a)*r,k,k*2))}
 const t=wSub(g,-.05,.6,.5);t.add(tbox(.3,.12,.42,mPlankD,0,.22,0,0,2),cyl(.08,.04,matDark,0,.08,.25,0,0,Math.PI/2,8));for(const s of[-1,1])t.add(tbox(.03,.03,.5,matDark,s*.12,.2,-.3));for(let k=0;k<3;k++)t.add(mesh(wkG.ore,wkMt(0x8a3e26),-.08+k*.08,.32,0))}

/* ---- glinianka: wykop gliny z wodą, kopiec, surówka na deskach ---- */
function wGlinianka(g){wNo();const s=wSub(g,.55,-.58);shed(s,.75,.6,.75,mBoards);s.add(tbox(.5,.25,.3,mPlank,0,.13,0,0,1.4));
 g.add(tbox(1.05,.05,.8,wkM.clay,.2,.02,.25));g.add(cyl(.28,.02,wkM.water,.32,.05,.3,0,0,0,10));
 for(let k=0;k<6;k++){const a=k*1.05;g.add(wSc(mesh(new THREE.SphereGeometry(.12,6,4),wkMt(0x8a5232),.2+Math.cos(a)*.48,.03,.25+Math.sin(a)*.38),1.3,.4,1))}
 const hp=mesh(new THREE.SphereGeometry(.32,8,5,0,6.283,0,1.57),wkM.clay,-.6,0,.5);hp.scale.y=.7;g.add(hp);wBeam(g,[-.48,.15,.48],[-.35,.75,.6],.018,matWood,4);g.add(tbox(.12,.16,.02,wkM.iron,-.5,.1,.46,.3));
 const r=wSub(g,-.55,-.25);r.add(tbox(.8,.04,.32,mPlank,0,.3,0,0,2),tbox(.04,.3,.25,matDark,-.35,.15,0),tbox(.04,.3,.25,matDark,.35,.15,0));for(let k=0;k<5;k++)r.add(tbox(.12,.07,.2,wkM.clayRaw,-.3+k*.15,.36,0))}

/* ---- żarna: okrągła wiata ze stożkowym dachem, kamienie żarnowe ---- */
function wZarna(g){wNo();const R=.72;for(let k=0;k<6;k++){const a=k/6*6.283+.26;wPost(g,Math.cos(a)*R,Math.sin(a)*R,1.12,.05)}
 const rf=mesh(new THREE.ConeGeometry(1.02,.75,8),STY?STY.roof:mThatch,0,1.12+.37,0);rf.rotation.y=Math.PI/8;g.add(rf);g.add(cyl(.05,.25,matLog2,0,1.95,0,0,0,0,5));
 g.add(cyl(.34,.32,matLog,0,.16,0,0,0,0,10),cyl(.33,.1,mStone,0,.37,0,0,0,0,12),cyl(.31,.1,mStone,0,.48,0,0,0,0,12));wBeam(g,[.22,.53,0],[.22,.86,0],.02,matWood,4);
 g.add(tbox(.36,.12,.22,mPlank,0,.13,.4));for(const[x,z,s]of[[-.5,.35,1],[-.62,.05,.9],[.5,.4,.95],[.58,-.25,1]])sack(g,x,z,s);g.add(cyl(.1,.05,mCanvas,.0,.31,.38,0,0,0,8))}

/* ---- serownia: regał z serami pod daszkiem, prasa z kamieniem, konewki mleka ---- */
function wSerownia(g){wNo();const h=plankHut(g,1.1,.85,.85,{win:true,lamp:true});h.position.set(-.38,0,-.52);
 const s=wShelf(g,.55,-.1,.72,3,-Math.PI/2,(q,y)=>{for(let k=0;k<3;k++)q.add(new THREE.Mesh(wkG.cheese,wkM.cheese).translateX(-.22+k*.22).translateY(y+.035))});
 s.add(gable(.85,.45,.18,mBoards,1.22,.06));
 const p=wSub(g,-.55,.5);p.add(tbox(.42,.2,.42,mPlank,0,.1,0,0,2),cyl(.15,.14,wkM.cheese,0,.27,0,0,0,0,9),tbox(.3,.06,.3,mPlank,0,.37,0));for(const x of[-.22,.22])p.add(tbox(.05,.8,.05,matDark,x,.4,0));
 p.add(tbox(.6,.05,.07,matDark,.1,.8,0));p.add(mesh(new THREE.DodecahedronGeometry(.11,0),matStone,.32,.9,0));wBeam(p,[0,.4,0],[0,.78,0],.03,matWood,5);
 for(const[x,z]of[[.05,.62],[.22,.72]]){g.add(cyl(.08,.26,wkMt(0xb0b4b0,{metalness:.3,roughness:.5}),x,.13,z,0,0,0,8),cyl(.05,.06,wkMt(0xb0b4b0,{metalness:.3,roughness:.5}),x,.29,z,0,0,0,8))}}

/* ---- izba nauki: ławy na podwórzu, tablica, klepadło ---- */
function wIzbanauki(g){wNo();const h=plankHut(g,1.5,.85,.95,{win:true,lamp:true,roof:mShingle});h.position.set(-.1,0,-.52);
 for(let k=0;k<2;k++)g.add(tbox(.8,.05,.18,mPlank,.15,.3,.3+k*.32,0,2),tbox(.05,.3,.15,matDark,-.2,.15,.3+k*.32),tbox(.05,.3,.15,matDark,.5,.15,.3+k*.32));
 const t=wSub(g,-.7,.35,.5);t.add(tbox(.62,.45,.04,wkMt(0x2a2a26),0,.8,0));wBeam(t,[-.25,0,.1],[-.22,1.05,0],.02,matDark,4);wBeam(t,[.25,0,.1],[.22,1.05,0],.02,matDark,4);wBeam(t,[0,0,-.3],[0,.95,-.02],.02,matDark,4);
 for(let k=0;k<3;k++)t.add(tbox(.3-k*.08,.01,.01,wkMt(0xe8e8e0),-.08+k*.04,.9-k*.1,.025));
 const kl=wSub(g,.82,.5);kl.add(tbox(.05,1.1,.05,matLog2,-.18,.55,0),tbox(.05,1.1,.05,matLog2,.18,.55,0),tbox(.45,.05,.05,matLog2,0,1.1,0));
 kl.add(cyl(.006,.2,wkM.rope,0,.98,0,0,0,0,3));kl.add(tbox(.24,.32,.04,mPlankD,0,.75,0,0,1.5));wBeam(kl,[.12,.35,.12],[.2,.62,.15],.015,matWood,4)}

/* ---- warsztat: osełka na kole, stojak z narzędziami, warsztat z imadłem ---- */
function wWarsztat(g){wNo();const h=plankHut(g,1.1,.85,.88,{win:true,lamp:true,roof:mShingle});h.position.set(-.38,0,-.52);
 const k=wSub(g,.5,.35);k.add(tbox(.06,.65,.06,matDark,-.2,.32,0),tbox(.06,.65,.06,matDark,.2,.32,0));const wh=cyl(.36,.12,mStone,0,.66,0,0,0,Math.PI/2,14);k.add(wh);k.add(cyl(.025,.55,wkM.iron,0,.62,0,0,0,Math.PI/2,5));
 k.add(tbox(.04,.18,.04,matDark,.3,.52,0),tbox(.38,.12,.3,mPlank,0,.18,0,0,2));k.add(tbox(.34,.04,.26,wkM.water,0,.25,0));
 const r=wSub(g,.6,-.45);r.add(tbox(.05,.9,.05,matDark,-.3,.45,0),tbox(.05,.9,.05,matDark,.3,.45,0),tbox(.7,.05,.05,matDark,0,.88,0));
 for(let i=0;i<4;i++){const x=-.22+i*.15;r.add(cyl(.012,.5,matWood,x,.6,0,0,0,0,4));r.add(tbox(i%2?.12:.06,.1,.02,wkM.iron,x+.03,i%2?.4:.82,0))}
 const b=wSub(g,-.6,.45);b.add(tbox(.7,.07,.32,mPlank,0,.5,0,0,2));for(const x of[-.3,.3])b.add(tbox(.06,.5,.28,matDark,x,.25,0));b.add(tbox(.1,.12,.12,wkM.iron,.25,.6,.1),tbox(.4,.04,.08,mPlankD,-.1,.56,0))}

/* ---- pracownia cieśli: dół traczy z kłodą na kozłach, piła, stosy desek ---- */
function wPracownia(g){wNo();const s=wSub(g,-.55,-.58);shed(s,.8,.6,.85,mBoards);s.add(tbox(.6,.06,.3,mPlank,0,.45,0,0,2));
 const t=wSub(g,.15,.2);for(const x of[-.5,.5]){wBeam(t,[x,0,-.25],[x,1.0,0],.035,matLog2,5);wBeam(t,[x,0,.25],[x,1.0,0],.035,matLog2,5)}
 t.add(cyl(.15,1.5,matLog,0,1.12,0,0,0,Math.PI/2,8));t.add(tbox(.03,1.15,.12,wkM.iron,.15,.85,0));t.add(tbox(.25,.04,.04,matWood,.15,1.42,0),tbox(.25,.04,.04,matWood,.15,.3,0));
 g.add(wSc(mesh(new THREE.SphereGeometry(.3,8,4,0,6.283,0,1.57),wkM.sawdust,.15,0,.2),1.3,.18,1));
 wBoards(g,.45,-.62,1.0,4,0);wBoards(g,-.62,.55,.75,3,Math.PI/2)}

/* ---- garncarnia: kopulasty piec, regały z garnkami, koło garncarskie ---- */
function wGarncarnia(g){wNo();const k=wSub(g,.45,-.4);const d=mesh(new THREE.SphereGeometry(.5,12,7,0,6.283,0,1.57),wkM.clay,0,0,0);d.scale.y=1.05;k.add(d);
 k.add(tbox(.24,.24,.12,matDark,0,.13,.46));wGlow(k,0,.13,.53,.18,.15);k.add(cyl(.09,.4,wkM.clay,0,.62,-.1,0,0,0,7));wSmoke(k,0,1.05,-.1,.7);
 const r=wShelf(g,-.6,-.45,.72,3,0,(s,y,l)=>{for(let q=0;q<3;q++){const p=mesh(wkG.pot,l===2?wkM.clayRaw:mPot,-.22+q*.22,y+.07,0);p.scale.y=1.2;s.add(p)}});
 const a=wSub(g,-.3,.45);for(const[x,z]of[[-.38,-.3],[.38,-.3]])a.add(tbox(.05,.9,.05,matDark,x,.45,z));for(const[x,z]of[[-.38,.3],[.38,.3]])a.add(tbox(.05,.7,.05,matDark,x,.35,z));
 const aw=tbox(.9,.03,.75,mBoards,0,.82,0);aw.rotation.x=.25;a.add(aw);a.add(cyl(.05,.36,matDark,0,.18,0,0,0,0,6),cyl(.19,.04,matLog2,0,.38,0,0,0,0,12),cyl(.07,.1,wkM.clayRaw,0,.45,0,0,0,0,9));a.add(cyl(.11,.24,matLog2,.28,.12,.1,0,0,0,7));
 const hp=mesh(new THREE.SphereGeometry(.22,7,4,0,6.283,0,1.57),wkM.clayRaw,.62,0,.55);hp.scale.y=.7;g.add(hp)}

/* ---- winiarnia: tłocznia, beczki na legarach, kosze winogron ---- */
function wWiniarnia(g){wNo();const h=plankHut(g,1.1,.85,.88,{win:true,lamp:true});h.position.set(-.38,0,-.52);
 const p=wSub(g,.45,.3);p.add(cyl(.34,.22,mPlank,0,.11,0,0,0,0,12),cyl(.345,.03,wkM.iron,0,.18,0,0,0,0,12),cyl(.3,.02,wkM.grape,0,.225,0,0,0,0,12));
 for(const x of[-.3,.3])p.add(tbox(.07,1.0,.07,matLog2,x,.5,0));p.add(tbox(.75,.1,.12,matLog2,0,1.0,0));p.add(cyl(.04,.55,matWood,0,.72,0,0,0,0,6));p.add(tbox(.36,.07,.36,mPlank,0,.46,0));wBeam(p,[0,.82,0],[.5,.9,.25],.02,matWood,4);
 const lr=wSub(g,.62,-.5);lr.add(tbox(.06,.08,.8,matLog2,-.13,.04,0),tbox(.06,.08,.8,matLog2,.13,.04,0));for(const z of[-.24,.24])wBarrel(lr,0,.04,z,.8,true,0);
 for(const[x,z]of[[-.62,.5],[-.3,.66]]){g.add(cyl(.15,.17,mWattle,x,.09,z,0,0,0,9));for(let k=0;k<6;k++)g.add(new THREE.Mesh(wkG.grape,wkM.grape).translateX(x+Math.cos(k)*.07).translateY(.2+(k%2)*.04).translateZ(z+Math.sin(k)*.07))}}

/* ---- szwalnia: krosno pod okapem, kolorowe płótna na sznurze, kołowrotek ---- */
function wSzwalnia(g){wNo();const h=plankHut(g,1.1,.85,.88,{win:true,lamp:true});h.position.set(-.38,0,-.52);
 const l=wSub(g,.5,-.3);for(const[x,z]of[[-.35,-.25],[.35,-.25],[-.35,.25],[.35,.25]])l.add(tbox(.05,.85,.05,matDark,x,.42,z));l.add(tbox(.78,.05,.05,matDark,0,.85,-.25),tbox(.78,.05,.05,matDark,0,.85,.25),tbox(.78,.06,.08,matLog2,0,.5,.25));
 const wp=new THREE.Mesh(new THREE.PlaneGeometry(.66,.6),wkMt(0xe6dcc4,{side:THREE.DoubleSide}));wp.rotation.x=-1.0;wp.position.set(0,.68,0);l.add(wp);l.add(cyl(.06,.7,wkM.red,0,.52,.32,0,0,Math.PI/2,7));
 const aw=tbox(.95,.03,.75,mBoards,0,.9,0);aw.rotation.x=.18;l.add(aw);
 const c=wSub(g,-.1,.62);c.add(tbox(.04,1.0,.04,matDark,-.75,.5,0),tbox(.04,1.0,.04,matDark,.75,.5,0),cyl(.006,1.5,wkM.rope,0,.95,0,0,0,Math.PI/2,3));
 [[wkM.red,-.45],[wkM.blue,0],[wkM.ochre,.45]].forEach(([m,x])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(.36,.55),m===wkM.red?wkMt(0x9a3a2a,{side:THREE.DoubleSide}):m===wkM.blue?wkMt(0x3a5a8a,{side:THREE.DoubleSide}):wkMt(0xc09a40,{side:THREE.DoubleSide}));p.position.set(x,.68,0);p.castShadow=true;c.add(p)});
 const s=wSub(g,-.72,.18);const wh=new THREE.Mesh(new THREE.TorusGeometry(.2,.02,4,14),matWood);wh.position.set(0,.45,0);wh.rotation.y=Math.PI/2;s.add(wh);s.add(tbox(.05,.4,.05,matDark,0,.2,0),tbox(.4,.05,.12,matDark,0,.08,0))}

/* ---- kurnik: kurnik na palach z drabinką, wybieg z plecionki, grzędy, gniazda ---- */
function wKurnik(g){wNo();const k=wSub(g,-.28,-.42);for(const[x,z]of[[-.42,-.32],[.42,-.32],[-.42,.32],[.42,.32]])k.add(cyl(.05,.5,matLog2,x,.25,z,0,0,0,6));
 k.add(tbox(1.0,.07,.78,mPlankD,0,.5,0,0,2),tbox(.92,.55,.7,mPlank,0,.8,0,0,1.2));k.add(gable(.92,.7,.4,STY?STY.roof:mThatch,1.07,.15));
 k.add(tbox(.18,.22,.03,matDark,.2,.66,.36));for(let i=0;i<3;i++)k.add(tbox(.22,.2,.24,mPlankD,-.62,.66,-.22+i*.24),tbox(.2,.06,.22,mThatch,-.62,.6,-.22+i*.24));
 const rp=new THREE.Mesh(new THREE.BoxGeometry(.18,.03,.7),mPlankD);rp.position.set(.2,.27,.66);rp.rotation.x=.72;rp.castShadow=true;k.add(rp);for(let i=0;i<5;i++)k.add(tbox(.17,.02,.02,matDark,.2,.07+i*.1,.92-i*.11));
 const E=.94;wWattle(g,-E,-E,E,-E,.36);wWattle(g,E,-E,E,E,.36);wWattle(g,-E,-E,-E,E,.36);wWattle(g,-E,E,-.25,E,.36);wWattle(g,.25,E,E,E,.36);
 for(const x of[-.25,.25])g.add(cyl(.04,.6,matLog2,x,.3,E,0,0,0,5));
 const p=wSub(g,.55,.15);p.add(tbox(.05,.55,.05,matDark,-.3,.27,0),tbox(.05,.55,.05,matDark,.3,.27,0));p.add(cyl(.022,.66,matWood,0,.38,0,0,0,Math.PI/2,5),cyl(.022,.66,matWood,0,.55,0,0,0,Math.PI/2,5));
 g.add(tbox(.5,.08,.12,mPlank,.45,.04,.62));g.add(tbox(.44,.02,.08,wkM.grain,.45,.09,.62));
 for(const[x,z,m,ry]of[[.1,.4,wkM.feather,0],[.62,.42,wkM.hen2,1.2],[-.6,.55,wkM.feather,2.4]]){const h=wSub(g,x,z,ry);h.add(wSc(mesh(wkG.hen,m,0,.12,0),.85,.85,1.25));h.add(wSc(mesh(wkG.hen,m,0,.21,.08),.5,.55,.5));h.add(tbox(.03,.04,.02,wkM.comb,0,.27,.1))}}

/* ---- barć (pasieka): kłody bartne z daszkami, pszczelnik ze słomiankami, kwiaty ---- */
function wPasieka(g){wNo();const pts=[[-.7,-.15],[-.35,-.5],[.05,-.68],[.45,-.6],[.75,-.25]];
 pts.forEach(([x,z],i)=>{const h=1.0+((i*37)%3)*.12;g.add(cyl(.16,h,wkM.bark,x,h/2,z,0,0,0,8));g.add(cyl(.17,.04,matLog2,x,h*.35,z,0,0,0,8));
  const cap=wCone(g,.24,.22,6,STY?STY.roof:mThatch,x,h+.1,z);cap.rotation.y=i;g.add(tbox(.06,.16,.03,matDark,x,h*.55,z+.155));g.add(tbox(.12,.025,.08,mPlankD,x,h*.55-.09,z+.17))});
 const s=wSub(g,-.1,.42);for(const x of[-.42,.42]){s.add(tbox(.05,.75,.05,matDark,x,.37,-.15),tbox(.05,.6,.05,matDark,x,.3,.15))}const rf=tbox(.95,.04,.42,mBoards,0,.72,0,0,2);rf.rotation.x=-.25;s.add(rf);
 s.add(tbox(.88,.04,.3,mPlank,0,.3,0,0,2));{const sk=wSub(s,0,0);sk.position.y=.32;for(let k=0;k<3;k++)skep(sk,-.3+k*.3,0)}
 g.add(tbox(.5,.05,.16,mPlank,.65,.28,.55),tbox(.05,.28,.12,matDark,.45,.14,.55),tbox(.05,.28,.12,matDark,.85,.14,.55));
 g.add(cyl(.06,.12,mPot2,.62,.37,.55,0,0,0,7));wSmoke(g,.62,.62,.55,.35);
 for(let k=0;k<12;k++){const a=k*2.4,r=.25+((k*7)%5)*.12;g.add(mesh(new THREE.SphereGeometry(.05,5,4),wkMt([0x9a6aa8,0xe0c050,0xe8e4d8,0xc04050][k%4]),Math.cos(a)*r*1.3,.06,.15+Math.sin(a)*r*.6))}}

/* ---- mielerz: kopiec z darnią, dymniki, żar u podstawy, drabina, węgiel, szałas węglarza ---- */
function wMielerz(g){wNo();const d=mesh(new THREE.SphereGeometry(.78,14,8,0,6.283,0,1.57),wkM.earth,.05,0,-.05);d.scale.y=.85;g.add(d);
 for(let k=0;k<7;k++){const a=k*.9+.3,el=.35+(k%3)*.25;const x=.05+Math.cos(a)*Math.cos(el)*.74,z=-.05+Math.sin(a)*Math.cos(el)*.74,y=Math.sin(el)*.78*.85;
  const p=mesh(new THREE.SphereGeometry(.16,6,3),wkM.turf,x,y,z);p.scale.set(1,1,.3);p.lookAt(.05+x*2,y*2,-.05+z*2);g.add(p)}
 for(const[a,el]of[[.6,.9],[2.5,.7],[4.2,1.1]]){const x=.05+Math.cos(a)*Math.cos(el)*.76,z=-.05+Math.sin(a)*Math.cos(el)*.76,y=Math.sin(el)*.66;g.add(tbox(.07,.07,.07,matDark,x,y,z));wSmoke(g,x,y+.3,z,.4)}
 wSmoke(g,.05,.95,-.05,.6);for(let k=0;k<6;k++){const a=k/6*6.283+.4;wGlow(g,.05+Math.cos(a)*.76,.06,-.05+Math.sin(a)*.76,.1,.06,-a+Math.PI/2)}
 const l=wSub(g,.55,.35,-.7);for(const s of[-1,1])wBeam(l,[s*.12,0,.25],[s*.12,.78,-.2],.02,matWood,4);for(let k=1;k<5;k++)l.add(tbox(.26,.02,.02,matWood,0,k*.16,.25-k*.09));
 for(let k=0;k<10;k++){const a=k*2.4,r=(k%4)*.07;g.add(mesh(wkG.coal,wkM.coal,.72+Math.cos(a)*r,.06+(k>6?.08:0),.68+Math.sin(a)*r,k,k))}
 wLogs(g,-.68,.62,.62,3,3,0,.065);
 const sz=wSub(g,-.68,-.7,.5);for(const s of[-1,1]){const pl=tbox(.5,.03,.55,mBoards,s*.17,.33,0,0,2);pl.rotation.z=s*-.95;sz.add(pl)}}

/* ---- zbieracz: kosze i grzyby na sznurach, suszarnia jagód ---- */
// (zbieracz zostaje przy swoim modelu; poprawki przy następnych paczkach)

const W_MODELS={bednarnia:wBednarnia,browar:wBrowar,slodownia:wSlodownia,miodosytnia:wMiodosytnia,mysliwy:wMysliwy,drwal:wDrwal,lesnik:wLesnik,ptasznik:wPtasznik,kamien:wKamien,ruda:wRuda,
 glinianka:wGlinianka,zarna:wZarna,serownia:wSerownia,izbanauki:wIzbanauki,warsztat:wWarsztat,pracownia:wPracownia,garncarnia:wGarncarnia,winiarnia:wWiniarnia,szwalnia:wSzwalnia,kurnik:wKurnik,pasieka:wPasieka,mielerz:wMielerz};
{const _nm=newModel;newModel=function(kind,g){const f=W_MODELS[kind];if(f&&!/oldbld/.test(location.search)){try{f(g);return 1}catch(e){console.warn('warsztat',kind,e);g.clear()}}return _nm(kind,g)}}
window.__warsztaty={W_MODELS};
