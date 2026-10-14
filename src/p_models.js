/* ---- faktury proceduralne ---- */
function ctex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}
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
 brick:ctex(128,128,(x,w,h)=>{x.fillStyle='#6a5a4a';x.fillRect(0,0,w,h);const bh=12,bw=28;for(let r=0;r<h/bh;r++)for(let c=-1;c<w/bw+1;c++){const b=150+RT()*50;x.fillStyle=`rgb(${b|0},${b*.55|0},${b*.38|0})`;x.fillRect(c*bw+(r%2)*bw/2+1,r*bh+1,bw-2,bh-2)}})
};
function TM(t,col,o){return new THREE.MeshStandardMaterial(Object.assign({map:t,color:col||0xffffff,roughness:.95},o||{}))}
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
 const grp=new THREE.Group();grp.add(m,gm);return grp}
function cyl(r,h,mat,x,y,z,rx,ry,rz,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg||7),mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;m.receiveShadow=true;return m}
function woodpile(g,x,z,n,ry){const p=new THREE.Group();for(let k=0;k<n;k++){const row=(k/5)|0,col=k%5;p.add(cyl(.08,.6,matLog,(col-2)*.17+(row%2)*.08,.08+row*.15,0,0,0,Math.PI/2,6))}p.position.set(x,0,z);p.rotation.y=ry||0;g.add(p)}
function barrel(g,x,z,s){const b=cyl(.17*(s||1),.42*(s||1),mPlank,x,.21*(s||1),z,0,0,0,10);g.add(b);g.add(cyl(.175*(s||1),.03,M(0x3a3632),x,.12*(s||1),z,0,0,0,10),cyl(.175*(s||1),.03,M(0x3a3632),x,.32*(s||1),z,0,0,0,10))}
function crate(g,x,z,r){g.add(tbox(.42,.36,.42,mPlank,x,.18,z,r||0,1.5))}
function door(g,x,z,ry,w,h){g.add(tbox(w||.46,h||.78,.06,mPlankD,x,(h||.78)/2,z,ry||0,1.6))}
function win(g,x,y,z,ry){const f=tbox(.36,.32,.05,matDark,x,y,z,ry||0);g.add(f);const p=new THREE.Mesh(new THREE.PlaneGeometry(.26,.22),mWin);p.position.set(x,y,z);p.rotation.y=ry||0;p.translateZ(.03);g.add(p)}
function logHouse(g,w,d,h,opt){opt=opt||{};g.add(tbox(w+.12,.28,d+.12,mStone,0,.14,0,0,.9));g.add(tbox(w,h,d,mLogs,0,.28+h/2,0,0,1.1));
 for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.09,h+.1,matLog2,sx*w/2,.28+h/2,sz*d/2,0,0,0,6));
 const r=gable(w,d,opt.rh||h*.85,opt.roof||mThatch,.28+h,opt.over);g.add(r);door(g,opt.dx||0,d/2+.04,0);
 if(opt.win!==false){win(g,w/2-.45,.28+h*.62,d/2+.04);if(w>1.8)win(g,-w/2+.45,.28+h*.62,d/2+.04)}
 if(opt.chim)g.add(tbox(.34,1.0+(opt.rh||h*.85)*.5,.34,mStone,opt.chim,.28+h+.3,-d*.2,0,1.2))}
function plankHut(g,w,d,h,opt){opt=opt||{};g.add(tbox(w,h,d,mPlank,0,h/2,0,0,1.2));g.add(gable(w,d,opt.rh||h*.8,opt.roof||mThatch,h,opt.over));door(g,opt.dx||0,d/2+.04,0);if(opt.win)win(g,w/2-.35,h*.6,d/2+.04)}
function shed(g,w,d,h,roof){for(const sx of[-1,1])for(const sz of[-1,1])g.add(tbox(.1,h,.1,matDark,sx*(w/2-.05),h/2,sz*(d/2-.05)));g.add(gable(w,d,h*.45,roof||mThatch,h,.15))}
function rack(g,x,z,ry,hang){const r=new THREE.Group();r.add(tbox(.06,.9,.06,matDark,-.4,.45,0),tbox(.06,.9,.06,matDark,.4,.45,0),cyl(.025,.9,matDark,0,.85,0,0,0,Math.PI/2,5));hang(r);r.position.set(x,0,z);r.rotation.y=ry||0;g.add(r)}
function rowboat(g,x,z,ry){const b=new THREE.Group();const hull=new THREE.Mesh(new THREE.CylinderGeometry(.32,.18,1.5,10,1,true,0,Math.PI),M(0x6a4a30,{side:THREE.DoubleSide}));hull.rotation.set(0,0,Math.PI/2);hull.rotation.x=Math.PI/2;hull.rotation.order='ZXY';
 const h2=new THREE.Mesh(new THREE.CylinderGeometry(.33,.2,1.5,10,1,false,Math.PI,Math.PI),M(0x5a3a22));h2.rotation.z=Math.PI/2;b.add(h2);b.add(tbox(.08,.05,.5,mPlank,0,.0,0));b.add(cyl(.02,1.1,matWood,.2,.05,.15,0,.3,Math.PI/2.2,4));b.position.set(x,-.02,z);b.rotation.y=ry||0;b.traverse(o=>{o.castShadow=true});g.add(b)}
function makeBuildingModel(kind){const g=new THREE.Group();
 if(kind==='szalas'){const t=gable(1.4,1.7,1.3,mCanvas,0,.12);g.add(t);for(const z of[-.95,.95])g.add(cyl(.04,1.5,matDark,0,.72,z,0,0,0,5));g.add(cyl(.035,2.1,matDark,0,1.32,0,Math.PI/2,0,0,5));
  g.add(tbox(.9,.12,1.2,M(0x7a6a4a),0,.06,-.1));barrel(g,.85,.7,.8);g.add(cyl(.12,.02,matStone,-.9,.02,.9,0,0,0,8));woodpile(g,-.9,-.6,5,1.2)}
 else if(kind==='chata'){logHouse(g,2.5,1.6,1.15,{chim:-.85,dx:.35});woodpile(g,1.55,-.2,10,Math.PI/2);barrel(g,-1.45,.75);g.add(tbox(.9,.08,.25,mPlank,-.5,.42,1.05));g.add(tbox(.08,.4,.2,matDark,-.85,.2,1.05),tbox(.08,.4,.2,matDark,-.15,.2,1.05))}
 else if(kind==='zbieracz'){plankHut(g,1.5,1.25,.95,{win:true});for(let k=0;k<3;k++){g.add(cyl(.17,.2,M(0x9a7a4a),1.0,.1,-.45+k*.42,0,0,0,9));g.add(cyl(.13,.04,M([0x8a2445,0x7a5030,0x8a6a3a][k]),1.0,.2,-.45+k*.42,0,0,0,9))}
  rack(g,-.2,-.95,0,r=>{for(let k=0;k<5;k++)r.add(new THREE.Mesh(new THREE.ConeGeometry(.06,.25,5),M(0x5a7a3a)).translateX(-.3+k*.15).translateY(.68))})}
 else if(kind==='mysliwy'){logHouse(g,1.6,1.3,.95,{win:false});g.add(tbox(.4,.06,.06,matBone,0,1.22,.72));for(const s of[-1,1])g.add(cyl(.02,.3,matBone,s*.18,1.32,.72,0,0,s*.6,4));
  rack(g,1.15,.1,Math.PI/2,r=>{const hide=new THREE.Mesh(new THREE.PlaneGeometry(.7,.55),M(0x9a7452,{side:THREE.DoubleSide}));hide.position.y=.55;r.add(hide)});g.add(cyl(.02,1.4,matDark,-1.0,.7,.5,0,0,.15,4),cyl(.02,1.4,matDark,-1.05,.7,.3,0,0,.2,4))}
 else if(kind==='pomost'){g.add(tbox(.8,.08,2.4,mPlank,.4,.32,1.0,0,1.5));for(const[x,z]of[[.05,.2],[.75,.2],[.05,1.1],[.75,1.1],[.05,2.0],[.75,2.0]])g.add(cyl(.06,1.2,matDark,x,-.25,z,0,0,0,6));
  plankHut(g,1.1,.9,.75,{});g.children.slice(-3).forEach(o=>o.position.x-=.5);rowboat(g,1.25,1.4,.1);rack(g,-.6,.9,Math.PI/2,r=>{const n=new THREE.Mesh(new THREE.PlaneGeometry(.7,.55,6,5),new THREE.MeshBasicMaterial({color:0x4a4a3a,wireframe:true}));n.position.y=.55;r.add(n)});barrel(g,.4,-.1,.8)}
 else if(kind==='drwal'){logHouse(g,1.5,1.2,.95,{win:false});woodpile(g,1.15,0,15,Math.PI/2);g.add(cyl(.22,.32,matLog2,-1.0,.16,.6,0,0,0,9));g.add(tbox(.04,.45,.04,matDark,-.98,.5,.6,0));g.add(tbox(.18,.1,.04,M(0x555a60,{metalness:.5,roughness:.4}),-.98,.42,.6))}
 else if(kind==='lesnik'){plankHut(g,1.3,1.1,.85,{roof:TM(TX.thatch,0x8aa060)});for(let a=0;a<3;a++)for(let b=0;b<3;b++){g.add(tbox(.25,.06,.25,M(0x4a3420),-.95+a*.32,.03,-.65+b*.32));g.add(new THREE.Mesh(new THREE.ConeGeometry(.08,.28,6),M(0x3f7a3a)).translateX(-.95+a*.32).translateY(.2).translateZ(-.65+b*.32))}barrel(g,.9,.6,.7)}
 else if(kind==='kamien'){logHouse(g,1.3,1.1,.85,{win:false,roof:mPlankD});for(let k=0;k<7;k++)g.add(mesh(new THREE.DodecahedronGeometry(.16+RT()*.08,0),matStone,.85+(k%3)*.18,.12+((k/3)|0)*.16,-.4+(k%2)*.3));g.add(tbox(.5,.3,.35,mStone,-.9,.15,.6,.3,1.5))}
 else if(kind==='glinianka'){plankHut(g,1.1,1.0,.8,{});g.add(cyl(.6,.06,M(0xb36a3c,{roughness:.5}),.55,.03,.55,0,0,0,10));for(let k=0;k<4;k++)g.add(cyl(.09,.2,M(0xb36a3c),-.8+k*.22,.1,.62,0,0,0,8))}
 else if(kind==='drewutnia'){shed(g,1.7,1.2,1.1);for(let r=0;r<4;r++)for(let c=0;c<6;c++)g.add(tbox(.5,.13,.13,mLogs,-.2+(c%2)*.05,.08+r*.14,-.38+c*.15,0,2));g.add(cyl(.22,.3,matLog2,.6,.15,.3,0,0,0,9))}
 else if(kind==='warsztat'){plankHut(g,1.6,1.3,1.0,{win:true});g.add(tbox(.9,.08,.45,mPlank,1.05,.5,.1,Math.PI/2));g.add(tbox(.06,.45,.06,matDark,1.05,.25,-.25),tbox(.06,.45,.06,matDark,1.05,.25,.45));g.add(mesh(new THREE.DodecahedronGeometry(.16,0),matStone,1.05,.62,.15));crate(g,-1.0,.6)}
 else if(kind==='szwalnia'){plankHut(g,1.4,1.2,.9,{win:true});rack(g,1.0,-.1,Math.PI/2,r=>{const c=new THREE.Mesh(new THREE.PlaneGeometry(.6,.5),mCanvas);c.position.y=.55;r.add(c)});rack(g,-.9,.75,0,r=>{const h=new THREE.Mesh(new THREE.PlaneGeometry(.5,.45),M(0x9a7452,{side:THREE.DoubleSide}));h.position.y=.55;r.add(h)})}
 else if(kind==='sklad'){shed(g,1.8,1.6,1.0,mPlankD);for(let k=0;k<4;k++)crate(g,-.45+(k%2)*.5,-.35+((k/2)|0)*.5,k*.3);barrel(g,.55,.45);barrel(g,.55,-.1);g.add(cyl(.2,.4,mCanvas,-.4,.2,.55,Math.PI/2,0,0,8))}
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
  plankHut(g,.8,.6,.55,{rh:.35});g.children.slice(-3).forEach(o=>{o.position.x+=.55;o.position.z-=.6});g.add(cyl(.32,.35,mThatch,-.55,.18,-.5,0,0,0,9));g.add(tbox(.6,.15,.22,mPlank,-.5,.08,.55,0,2))}
 else if(kind==='pole'){g.add(tbox(3.8,.05,3.8,M(0x5a4228),0,.03,0));for(let k=0;k<7;k++)g.add(tbox(3.6,.07,.18,M(0x4a3420),0,.05,-1.6+k*.53));
  const crops=new THREE.Group();for(let a=0;a<7;a++)for(let b=0;b<6;b++){const c=new THREE.Mesh(new THREE.ConeGeometry(.12,.6,4),M(0x6a8a3a));c.position.set(-1.5+b*.6,.3,-1.6+a*.53);c.castShadow=true;crops.add(c)}g.add(crops);g.userData.crops=crops;
  for(let k=0;k<8;k++)g.add(tbox(.06,.35,.06,matDark,-1.9+k*.54,.17,1.92));g.add(tbox(3.8,.05,.05,matWood,0,.3,1.92))}
 return g}
function scaffold(kind){const d=BD[kind];const g=new THREE.Group();const w=d.w*.92,h=d.h*.92,H=1.6;for(const sx of[-1,1])for(const sz of[-1,1])g.add(cyl(.04,H,matDark,sx*w/2,H/2,sz*h/2,0,0,0,5));
 for(const y of[.6,1.2]){g.add(tbox(w,.05,.06,mPlank,0,y,h/2),tbox(w,.05,.06,mPlank,0,y,-h/2),tbox(.06,.05,h,mPlank,w/2,y,0),tbox(.06,.05,h,mPlank,-w/2,y,0))}
 g.add(tbox(.6,.06,.5,mPlank,w/2+.35,.03,0));g.add(cyl(.07,.7,matLog,w/2+.35,.12,.3,0,0,Math.PI/2,6));return g}
