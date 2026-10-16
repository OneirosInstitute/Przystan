
/* ================= atmosfera ================= */
const firelight=new THREE.PointLight(0xff9a50,0,16,1.5);scene.add(firelight);
const mistTex=(function(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const r0=rng(77);for(let k=0;k<14;k++){const px=24+r0()*80,py=24+r0()*80,r=18+r0()*26;const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)}return new THREE.CanvasTexture(c)})();
const mists=[],MW=104;{const r0=rng(78);for(let k=0;k<48;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(26,26),new THREE.MeshBasicMaterial({map:mistTex,transparent:true,opacity:0,depthWrite:false,color:0xdfe6e6,fog:false}));m.rotation.x=-Math.PI/2;m.renderOrder=5;m.userData={x:(r0()*2-1)*MW,z:(r0()*2-1)*MW,y:22+r0()*2,sp:.15+r0()*.2};m.visible=false;scene.add(m);mists.push(m)}}
/* zawijanie w świecie: cząstka ma stałe miejsce na wyspie, a tylko kafel wokół kamery się przesuwa */
const wxMistCol=new THREE.Color(0xdfe6e6),wxMistDark=new THREE.Color(0x4c535a);
function wrapC(v,c,R){const P=2*R;return c+((((v-c+R)%P)+P)%P)-R}
const smoke=[];for(let k=0;k<26;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,color:0xc9cecc,transparent:true,opacity:0,depthWrite:false}));s.userData={t:k*.16,src:k};s.scale.set(.6,.6,1);scene.add(s);smoke.push(s)}
const ffN=90,ffGeo=new THREE.BufferGeometry(),ffPos=new Float32Array(ffN*3),ffSeed=new Float32Array(ffN*3);{const r0=rng(79);for(let k=0;k<ffN*3;k++)ffSeed[k]=r0()}
ffGeo.setAttribute('position',new THREE.BufferAttribute(ffPos,3));
const ff=new THREE.Points(ffGeo,new THREE.PointsMaterial({map:glowTex,size:.6,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xe8ff9a,opacity:0}));ff.frustumCulled=false;scene.add(ff);
const skyDay=new THREE.Color(0xa9bcbf),skyDusk=new THREE.Color(0x7b5a5c),skyNight=new THREE.Color(0x1a2530),skyW=new THREE.Color(0xc6cfd2),skyC=new THREE.Color();
let treadT=0,clock=0,last=performance.now(),uiT=0,panT=0,fpsAcc=0,fpsN=0,qLevel=LOWQ?2:0;
function lighting(){const t=tod();let e=0;if(t>=T0&&t<T1)e=Math.sin((t-T0)/(T1-T0)*Math.PI);
 const day=sstep(0,.35,e);const ang=Math.PI*clamp((t-T0)/(T1-T0),0,1);
 sun.position.set(camT.x-Math.cos(ang)*60,12+Math.sin(ang)*55,camT.z+30);
 const dim=WX.dim;sun.intensity=(.15+e*1.5)*dim;sun.color.setRGB(1,.75+.2*day,.55+.4*day);
 hemi.intensity=(.55+.45*day)*(.6+.4*dim);renderer.toneMappingExposure=.72+.28*dim;hemi.color.setRGB(.55+.35*day,.62+.3*day,.85+.1*day);
 const winter=yday()>=48&&yday()<72;
 skyC.copy(skyNight).lerp(skyDusk,sstep(0,.14,e)).lerp(winter?skyW:skyDay,sstep(.1,.45,e));if(dim<1)skyC.lerp(new THREE.Color(0x5d666b),(1-dim)*.8*sstep(.1,.45,e));
 scene.background=skyC;scene.fog.color.copy(skyC);wUni.uFog.value.copy(skyC);
 wUni.uDay.value=.3+.7*day;wUni.uSun.value.setRGB(1,.9+.1*day,.82+.18*day);
 const night=1-sstep(0,.3,e);
 fires.forEach((f,k)=>{f.sp.material.opacity=(.03+.62*night)*(.85+.15*Math.sin(clock*9+k*2)*Math.sin(clock*13+k));const fl=.85+.3*Math.sin(clock*11+k);f.fl.scale.set(.9+.15*Math.sin(clock*7+k),fl,.9+.15*Math.sin(clock*7+k));f.fl2.scale.y=.8+.4*Math.sin(clock*15+k)});
 firelight.intensity=(.6+1.8*night)*(1+.15*Math.sin(clock*10));
 mWin.emissiveIntensity=night*2.4+(1-day)*.4;mLantern.emissiveIntensity=night*4;
 return{e,night,day}}
function atmosphere(rdt,Lt){
 const fogA=(1-Lt.day)*.55+.25+(yday()>=24&&yday()<48?.15:0);
 const wfog=1+2*WX.fog+1.2*WX.dark;const mo=Math.min(.5,.11*fogA*wfog+.16*WX.dark)*(qLevel>=2?0:1);const msp=1+4*WX.wind*WX.wind;wxMistCol.setHex(0xdfe6e6).lerp(wxMistDark,WX.dark);
 mists.forEach(m=>{const u=m.userData;u.x+=WX.wx*u.sp*rdt*msp;u.z+=WX.wz*u.sp*rdt*msp;if(u.x>MW)u.x-=2*MW;else if(u.x<-MW)u.x+=2*MW;if(u.z>MW)u.z-=2*MW;else if(u.z<-MW)u.z+=2*MW;m.position.set(u.x,u.y,u.z);const ed=Math.min(1,(MW-Math.abs(u.x))/14,(MW-Math.abs(u.z))/14);m.material.opacity=mo*Math.max(0,ed);m.material.color.copy(wxMistCol);m.visible=m.material.opacity>.004});
 const cx=tcx(camp.i),cz=tcx(camp.j),cy=Hy(cx,cz);
 const chims=[[cx,cy+.6,cz]];S.bld.forEach(b=>{if(!bDone(b))return;const c=bCenter(b);if(b.kind==='laznia')chims.push([c.x-.45,Hy(c.x,c.z)+2.3,c.z]);else if(b.kind==='domwsp')chims.push([c.x,Hy(c.x,c.z)+3.4,c.z]);else if(b.kind==='serce'){const st=b.st||1;chims.push(st>=3?[c.x+(st>=5?1.2:0),Hy(c.x,c.z)+(st>=5?3.9:st>=4?3.4:3.0),c.z-1.45]:[c.x,Hy(c.x,c.z)+(st===2?2.4:.6),c.z+.5])}else if(b.kind==='browar'||b.kind==='slodownia'||b.kind==='piekarz')chims.push([c.x+(b.kind==='piekarz'?-1.55:.6),Hy(c.x,c.z)+(b.kind==='piekarz'?1.3:2.4),c.z+(b.kind==='piekarz'?-.1:-.3)]);else if(hasExt(b,'wedzarnia'))chims.push([c.x-BD[b.kind].w*.5-.25,Hy(c.x,c.z)+1.3,c.z]);if(b.kind==='chata'||b.kind==='dom')chims.push([c.x-.95,Hy(c.x,c.z)+2.7,c.z]);else if(b.kind==='cegielnia'||b.kind==='piec')chims.push([c.x+.5,Hy(c.x,c.z)+2.3,c.z]);else if(b.kind==='szalas'&&seasonIdx()!==0)chims.push([c.x,Hy(c.x,c.z)+1.7,c.z])});
 if(typeof kolChims==='function')kolChims(chims);
 smoke.forEach((s,k)=>{const u=s.userData;u.t+=rdt*.55;if(u.t>4){u.t=0;u.src=(u.src+7)}const c=chims[u.src%chims.length];const a=u.t/4;
  const wd=a*(.5+2.6*WX.wind);s.position.set(c[0]+Math.sin(u.t*1.3+k)*.3+WX.wx*wd,c[1]+a*(3.2-1.6*WX.wind),c[2]+WX.wz*wd);const sc=.4+a*1.7;s.scale.set(sc,sc,1);s.material.opacity=.3*Math.sin(a*Math.PI)});
 const summer=yday()<40||yday()>=76;const fo=summer?Lt.night:0;ff.material.opacity=fo*.95;ff.visible=fo>.01;
 if(fo>.01){for(let k=0;k<ffN;k++){const r=4+ffSeed[k*3]*14,a=ffSeed[k*3+1]*6.28+clock*.05*(ffSeed[k*3+2]-.5);const x=cx+Math.cos(a)*r+Math.sin(clock*.7+k)*.6,z=cz+Math.sin(a)*r+Math.cos(clock*.6+k)*.6;ffPos[k*3]=x;ffPos[k*3+1]=Hy(x,z)+.5+Math.sin(clock*1.3+k)*.3;ffPos[k*3+2]=z}ffGeo.attributes.position.needsUpdate=true}}
function drawAnimals(){Object.keys(animM).forEach(t=>{const m=animM[t];animIdx[t].forEach((hi,slot)=>{const h=S.herds[hi];const ti=tileOf(h.x,h.z);const seen=revAt(ti[0],ti[1]);
  for(let q=0;q<7;q++){const o=deerOff[hi*7+q];
   if(h&&q<h.n&&seen){const a=o.a+Math.sin(clock*.2+o.ph)*.4;const rr=o.r*(t==='wilk'?1.4:1);const x=h.x+Math.cos(a)*rr,z=h.z+Math.sin(a)*rr;const moving=Math.hypot(h.tx-h.x,h.tz-h.z)>.3;
    dummy.position.set(x,Hy(x,z),z);dummy.rotation.set(0,moving?Math.atan2(-(h.tz-h.z),h.tx-h.x):o.rot+Math.sin(clock*.3+o.ph)*.5,moving||t==='wilk'?0:Math.max(0,Math.sin(clock*.5+o.ph))*.25);dummy.scale.setScalar(t==='sarna'?1.15:1.05)}
   else{dummy.position.set(0,-50,0);dummy.scale.setScalar(0)}
   dummy.updateMatrix();m.setMatrixAt(slot*7+q,dummy.matrix)}});m.instanceMatrix.needsUpdate=true});
 let k=0;S.bld.forEach(b=>{if(b.kind!=='zagroda'||!bDone(b))return;const c=bCenter(b);for(let q=0;q<(b.animals||0)&&k<80;q++,k++){const o=deerOff[herdsDef.length*7+k];const a=o.a+clock*.05*(o.ph-3)*.1,r=.3+o.r*.45;const x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;
  dummy.position.set(x,Hy(x,z),z);dummy.rotation.set(0,o.rot+Math.sin(clock*.4+o.ph),0);dummy.scale.setScalar(.95);dummy.updateMatrix();penM.setMatrixAt(k,dummy.matrix)}});
 for(;k<80;k++){dummy.position.set(0,-50,0);dummy.scale.setScalar(0);dummy.updateMatrix();penM.setMatrixAt(k,dummy.matrix)}penM.instanceMatrix.needsUpdate=true}
/* ptaki: mewy nad zatokami, kruki nad borem, bielik nad halami */
const birds=[];
(function(){const r0=rng(321);const pickT=(test,near,tries)=>{for(let t=0;t<(tries||4000);t++){const i=(r0()*N)|0,j=(r0()*N)|0;if(test(i,j)&&(!near||Math.hypot(i-camp.i,j-camp.j)<near))return[i,j]}return null};
 const fl=[];const c0=pickT((i,j)=>BIOME[j*N+i]===1,16);if(c0)fl.push(['mewa',c0,5]);for(let q=0;q<4;q++){const c=pickT((i,j)=>BIOME[j*N+i]===1);if(c)fl.push(['mewa',c,3+((r0()*3)|0)])}
 for(let q=0;q<3;q++){const c=pickT((i,j)=>BIOME[j*N+i]===4);if(c)fl.push(['kruk',c,2])}for(let q=0;q<2;q++){const c=pickT((i,j)=>BIOME[j*N+i]===2);if(c)fl.push(['orzel',c,1])}
 const COL={mewa:[0xe6e6e0,0x7a7c80],kruk:[0x1c1c20,0x1c1c20],orzel:[0x4a3a2a,0xe8e4d8]};const SC={mewa:1,kruk:1.1,orzel:2.1};
 fl.forEach(([t,c,n])=>{for(let k=0;k<n;k++){const g=new THREE.Group();const bm=M(COL[t][0]),tm=M(COL[t][1]);
  g.add(mesh(new THREE.BoxGeometry(.09,.07,.32),bm,0,0,0));g.add(mesh(new THREE.BoxGeometry(.07,.06,.09),t==='orzel'?tm:bm,0,.02,.18));
  const wl=new THREE.Group(),wr=new THREE.Group();wl.add(mesh(new THREE.BoxGeometry(.42,.015,.13),bm,-.21,0,0));wr.add(mesh(new THREE.BoxGeometry(.42,.015,.13),bm,.21,0,0));
  wl.add(mesh(new THREE.BoxGeometry(.12,.016,.1),tm,-.4,0,-.01));wr.add(mesh(new THREE.BoxGeometry(.12,.016,.1),tm,.4,0,-.01));g.add(wl,wr);g.scale.setScalar(SC[t]);g.visible=false;g.traverse(o=>{o.castShadow=false});scene.add(g);
  birds.push({g,wl,wr,t,c:[tcx(c[0]),tcx(c[1])],r:(t==='orzel'?9:4)+r0()*4,h:(t==='orzel'?13:t==='mewa'?6:5)+r0()*3,a:r0()*6.28,sp:(t==='orzel'?.12:.3)+r0()*.15,ph:r0()*6.28,ti:c})}})})();
function drawBirds(rdt){for(const b of birds){const seen=revAt(b.ti[0],b.ti[1])&&!((WX.wind>.75||WX.rain>.6||WX.snow>.7)&&b.t!=='mewa');b.g.visible=seen;if(!seen)continue;
 b.a+=rdt*b.sp;const x=b.c[0]+Math.cos(b.a)*b.r,z=b.c[1]+Math.sin(b.a)*b.r*.8;b.g.position.set(x,Hy(b.c[0],b.c[1])+b.h+Math.sin(clock*.7+b.ph)*.6,z);
 b.g.rotation.set(0,Math.atan2(-Math.sin(b.a),Math.cos(b.a)*.8)+Math.PI,(b.t==='orzel'?.25:.15));
 const glide=b.t==='orzel'||Math.sin(clock*.5+b.ph)>.2;const f=glide?.08+Math.sin(clock*2+b.ph)*.05:Math.sin(clock*(b.t==='kruk'?9:11)+b.ph)*.65;b.wl.rotation.z=-f;b.wr.rotation.z=f}}
/* opady: deszcz jako kreski, śnieg jako płatki */
const PN=900,rGeo=new THREE.BufferGeometry(),rPos=new Float32Array(PN*6),sGeo=new THREE.BufferGeometry(),sPos=new Float32Array(PN*3);
{const r0=rng(55);for(let k=0;k<PN;k++){const x=(r0()-.5)*60,y=r0()*26,z=(r0()-.5)*60;rPos.set([x,y,z,x+.12,y+.9,z+.05],k*6);sPos.set([x,y,z],k*3)}}
rGeo.setAttribute('position',new THREE.BufferAttribute(rPos,3));sGeo.setAttribute('position',new THREE.BufferAttribute(sPos,3));
const rain=new THREE.LineSegments(rGeo,new THREE.LineBasicMaterial({color:0xc8d8e4,transparent:true,opacity:.55,depthWrite:false}));rain.frustumCulled=false;scene.add(rain);
const snowP=new THREE.Points(sGeo,new THREE.PointsMaterial({map:softTex,size:5,sizeAttenuation:false,transparent:true,depthWrite:false,color:0xffffff,opacity:.95}));snowP.frustumCulled=false;scene.add(snowP);
function weatherFx(rdt){const blowM=WX.blow>.2&&WX.rain<.01,isRain=WX.rain>.01||blowM,isSnow=WX.snow>.01;rain.visible=isRain;snowP.visible=isSnow;
 const base=Hy(camT.x,camT.z),ws=WX.wind;
 if(isRain){const r=blowM?WX.blow*.7:WX.rain;const n=Math.max(1,Math.round(PN*Math.min(1,r*1.15)));rGeo.setDrawRange(0,n*2);const sp=blowM?3.5:16+16*WX.rain+8*ws,wx=WX.wx*(blowM?15:1+9*ws*ws),wz=WX.wz*(blowM?15:1+9*ws*ws),L=blowM?.22:.75+.35*WX.rain;rain.material.color.setHex(blowM?0xf2f6fa:0xc8d8e4);
  for(let q=0;q<n;q++){let y=rPos[q*6+1]-sp*rdt,x=rPos[q*6]+wx*rdt,z=rPos[q*6+2]+wz*rdt;if(y<0){y+=26;x+=(Math.random()-.5)*8;z+=(Math.random()-.5)*8}x=wrapC(x,camT.x,30);z=wrapC(z,camT.z,30);rPos.set([x,y,z,x-wx/sp*L,y+L,z-wz/sp*L],q*6)}
  rGeo.attributes.position.needsUpdate=true;rain.position.set(0,base,0);rain.material.opacity=blowM?.42*WX.blow:Math.min(.75,.32+.42*WX.rain)}
 if(isSnow){const n=Math.max(1,Math.round(PN*Math.min(1,WX.snow)));sGeo.setDrawRange(0,n);const fall=2.2+1.4*WX.blow,hx=WX.wx*(.4+11*WX.blow),hz=WX.wz*(.4+11*WX.blow);
  for(let q=0;q<n;q++){let y=sPos[q*3+1]-fall*rdt;sPos[q*3]+=Math.sin(clock*.8+q)*rdt*.7+hx*rdt;sPos[q*3+2]+=hz*rdt;if(y<0)y+=26;sPos[q*3]=wrapC(sPos[q*3],camT.x,30);sPos[q*3+2]=wrapC(sPos[q*3+2],camT.z,30);sPos[q*3+1]=y}
  sGeo.attributes.position.needsUpdate=true;snowP.position.set(0,base,0);snowP.material.size=5-1.2*WX.blow}
 const fogK=Math.min(1,WX.fog+.35*WX.rain+.3*WX.snow+.5*WX.blow);{const sz=34/zoom,ov=sstep(.5,.25,zoom);scene.fog.near=160+lerp(.05,-.45,fogK)*sz+ov*sz*.25;scene.fog.far=160+lerp(1.7,.95,fogK)*sz+ov*sz*.6;}wUni.uFogN.value=scene.fog.near;wUni.uFogF.value=scene.fog.far;
 return fogK}
function frame(now){requestAnimationFrame(frame);if(document.hidden){last=now;return}if(gfxSkip(now))return;const rdt=Math.min(.25,(now-last)/1000);last=now;clock+=rdt;
 wUni.uT.value=clock;
 GFXU.t.value=clock;if(!S){yaw+=rdt*.04;yawT=yaw;setCam();introLight();gfxRender();return}
 if(S.speed>0&&S.people.length){let dt=rdt*S.speed;while(dt>0){const s=Math.min(.1,dt);step(s);dt-=s}storyTick()}
 fogT+=rdt;if(fogT>.8){fogT=0;fogPass(false)}
 treadT+=rdt;if(treadT>3&&treadDirty){treadT=0;treadDirty=false;applyTread();applyFog();for(const t of['tuft','fern','heath','reed'])for(let k=0;k<deco[t].length;k++){const it=deco[t][k];const ti=tileOf(it[0],it[1]);if(tread[ti[1]*N+ti[0]]>.3)setDeco(t,k)}decoMeshes.forEach(m=>m.instanceMatrix.needsUpdate=true)}
 if(Math.abs(yawT-yaw)>.001){yaw+=(yawT-yaw)*Math.min(1,rdt*8);setCam()}
 if(Math.abs(zoomT-zoom)>.001){zoom+=(zoomT-zoom)*Math.min(1,rdt*10);setCam()}
 if(follow&&selId!==null){const p=pById(selId);if(p){camT.x+=(p.x-camT.x)*Math.min(1,rdt*4);camT.z+=(p.z-camT.z)*Math.min(1,rdt*4);setCam()}}
 for(const p of S.people){const m=pMesh[p.id];if(!m)continue;m.position.set(p.x,Hy(p.x,p.z),p.z);if(p.dir!==undefined)m.rotation.y=p.dir;
  m.visible=!(p.state==='sleep'&&homeOf(p)&&bDone(homeOf(p)))&&p.state!=='away'&&!(p.inHall&&p.state==='eve');
  const u=m.userData,walking=p.state==='move'&&S.speed>0,working=p.state==='work'&&S.speed>0,sw=walking?Math.sin(clock*10+p.id)*.6:0;
  u.lL.rotation.x=sw;u.lR.rotation.x=-sw;u.aL.rotation.x=working?-1.2+Math.sin(clock*9+p.id)*.7:-sw*.8;u.aR.rotation.x=working?-1.0+Math.sin(clock*9+p.id+1)*.7:sw*.8;
  u.torso.rotation.x=working?.25:0;
  u.carry.visible=!!p.carry;if(p.carry)u.carry.material.color.set({drewno:0x8a6a40,kamien:0x8c8a80,glina:0xa9683c,jagody:0x8a3a55,grzyby:0xb07a4a,ryby:0x8fa4ac,mieso:0x9a4a3a,deski:0xb08a55,gwozdzie:0x555555,plotno:0xc9bda0,narz:0x666a70}[p.carry[0].res]||0x888888)}
 drawAnimals();drawBirds(rdt);fireFxTick(rdt);bubbleTick(rdt);const wf=weatherFx(rdt);
 ripples.forEach((m,k)=>{const s=1+.3*Math.sin(clock*1.6+k);m.scale.set(s,s,s);m.material.opacity=.3+.22*Math.sin(clock*1.6+k)});
 const Lt=lighting();firelight.position.set(campX(),Hy(campX(),campZ())+1.8,campZ());atmosphere(rdt,Lt);gfxTick(rdt,Lt);
 rangeRing.material.opacity=.4+.2*Math.sin(clock*3);
 mapTick(rdt);
 soundTick(rdt,Lt);
 uiT+=rdt;if(uiT>.4){uiT=0;renderTop();renderSel();goalsTick();techTick();custTick()}
 placeLabel();
 panT+=rdt;if(panT>1.5){panT=0;if(tab&&tab!=='praca'&&tab!=='budowa')renderPanel()}
 gfxRender();if(typeof photoGrab==='function')photoGrab();
 if(typeof batMeasure!=='function'||batMeasure()){fpsAcc+=rdt;fpsN++}if(fpsN===45){const avg=fpsAcc/fpsN;if(!gfxSlow(avg)&&avg>.04&&qLevel<2&&!GFX.forced){qLevel++;
   if(qLevel===1){renderer.shadowMap.enabled=false;sun.castShadow=false;scene.traverse(o=>{if(o.material)[].concat(o.material).forEach(mm=>mm.needsUpdate=true)})}
   if(qLevel===2){renderer.setPixelRatio(1);tufts.visible=false;resize()}}fpsAcc=0;fpsN=0}}
function introLight(){scene.background=skyDay;scene.fog.color.copy(skyDay);wUni.uFog.value.copy(skyDay);sun.position.set(camT.x+30,45,camT.z+25);sun.intensity=1.4;hemi.intensity=.9;wUni.uDay.value=1}
if(LOWQ){renderer.shadowMap.enabled=false;sun.castShadow=false}
gfxSetLevel(GFX.level,true);

/* ================= start ================= */
function boot(fresh){
 evOpen=null;$('ev').hidden=true;if(fresh){saveStatus.blocked=false;saveStatus.blockedRaw=null}
 S=fresh?freshState():(load()||freshState());custInit();
 if(!S.log.length){log('Wyszliśmy na brzeg. Wrak leży na płyciźnie, w obozie płonie ognisko. Wyspa sięga dalej, niż widać.');
  log('Suchary z wraku wystarczą na mniej więcej jedną porę roku. Postaw chatę zbieracza i chatę drwala (zakładka Budowa), potem przydziel do nich ludzi.');
  log('Wrak zniszczy wiosenny sztorm. Wolni robotnicy wynoszą z niego, co się da. W zakładce Praca wskaż, którą część rozpoznać: w kajucie kapitana podobno są księgi.');
  log('Każda rodzina potrzebuje domu: bez własnego dachu para nie będzie miała dzieci. Przed zimą potrzebny jest opał z drewutni.')}
 rebuildWorldFromState();wreckG.visible=!S.wreck.gone;buildPeopleMeshes();assign();assignHomes();
 camT.x=tcx(camp.i)+1;camT.z=tcx(camp.j)+2;zoom=zoomT=1.6;overview=null;setSpeed(S.speed||1);resize();regionScan(true);minimapBase();renderTop();renderCtl();
 if(innerWidth>760&&innerHeight>460)openSheet('budowa');restoreDecision();if(saveStatus.blocked)saveWarning(new Error('Nie udało się odczytać zapisu. Automatyczne nadpisanie wstrzymane.'))}
/* ===== pełny ekran i instalacja ===== */
function fsAvail(){const d=document.documentElement;return !!(d.requestFullscreen||d.webkitRequestFullscreen)&&(document.fullscreenEnabled!==false)}
function isFull(){return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function isStandalone(){return matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}
function goFull(){const d=document.documentElement;const f=d.requestFullscreen||d.webkitRequestFullscreen;if(!f||isFull())return Promise.resolve();try{const r=f.call(d,{navigationUI:'hide'});return r&&r.catch?r.catch(()=>{}):Promise.resolve()}catch(e){return Promise.resolve()}}
function toggleFull(){if(isFull()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else goFull().then(()=>{if(!isFull())toast('Przeglądarka nie pozwala tu na pełny ekran. Zainstaluj grę albo otwórz ją bezpośrednio.')})}
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{renderCtl();setTimeout(resize,120)}));
let installEv=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEv=e;$('goInstall').hidden=false});
addEventListener('appinstalled',()=>{installEv=null;$('goInstall').hidden=true;try{toast('Gra zainstalowana. Znajdziesz ją na ekranie głównym.')}catch(e){}});
$('goInstall').addEventListener('click',()=>{if(!installEv)return;installEv.prompt();installEv.userChoice.finally(()=>{installEv=null;$('goInstall').hidden=true})});
if('serviceWorker' in navigator&&document.querySelector('link[rel=manifest]')&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
function startGame(fresh){if(coarse&&!isStandalone())goFull();$('intro').style.display='none';document.body.classList.remove('pre');audioStart();boot(fresh)}
let hasSave=false;try{hasSave=!!localStorage.getItem(SAVEKEY)}catch(e){}
if(hasSave){$('go').textContent='Wróć do osady';$('goNew').hidden=false}
$('go').addEventListener('click',()=>startGame(false));
$('goNew').addEventListener('click',()=>{try{localStorage.removeItem(SAVEKEY)}catch(e){}startGame(true)});
// Zapis awaryjny przy przejściu aplikacji w tło oraz cykliczny niezależny od upływu dni w grze.
// Odstęp w czasie rzeczywistym działa również przy zatrzymanej symulacji.
const autosaveIntervalMs=90000;
setInterval(()=>{if(S&&!document.hidden&&!saveStatus.blocked)save()},autosaveIntervalMs);
addEventListener('pagehide',()=>{if(S)save()});
addEventListener('beforeunload',()=>{if(S)save()});
document.addEventListener('visibilitychange',()=>{last=performance.now();batLastR=0;if(S&&document.hidden)save()});
reveal(camp.i,camp.j,24);curYd=6;paintBase(6);applyFog();refreshNodes();refreshDeco();buildStatic();revNew.length=0;
camT.x=tcx(camp.i);camT.z=tcx(camp.j);zoom=zoomT=1.1;resize();
document.body.classList.add('pre');
try{const w0=innerWidth,h0=innerHeight;renderer.setSize(640,640,false);const asp0=1;
 const z0=.62;const size=34/z0;cam.left=-size/2;cam.right=size/2;cam.top=size/2;cam.bottom=-size/2;cam.updateProjectionMatrix();
 const yy=yaw;yaw=Math.PI*.18;const cx=camT.x,cz=camT.z;camT.x=tcx(camp.i)+6;camT.z=tcx(camp.j)-4;
 const h=Hy(camT.x,camT.z),r=160;cam.position.set(camT.x+Math.sin(yaw)*Math.cos(pitch)*r,h+Math.sin(pitch)*r,camT.z+Math.cos(yaw)*Math.cos(pitch)*r);cam.lookAt(camT.x,h,camT.z);
 introLight();sun.position.set(camT.x-40,38,camT.z+30);renderer.render(scene,cam);$('introPic').style.backgroundImage=`url(${cv.toDataURL('image/jpeg',.86)})`;
 yaw=yawT=yy;camT.x=cx;camT.z=cz;resize()}catch(e){}
requestAnimationFrame(frame);
window.__g={mapTick:r=>mapTick(r),storyTick:()=>storyTick(),get S(){return S},get fxDbg(){return{mists,dawnMist,rain,camT,walk,wreck,nodes}},ludInit,countInRange,isWorkerX:p=>isWorker(p),foodCap,renderer,czekamy,sinceLast,mergeGroup,saveFix,hintTick,save,load,buildApply,buildPrep,bMeshOf:id=>bMesh[id],rebuildMesh,completeSite,SNOWU,cerSet,cerActive,cerStart,cerEnd,flashA:()=>flashA,bolt,stormTick,zorzaMat,lifeStory,camFocus,dustPuff,setCam,assignHomes,killPerson,bById,tod,yday,entryOf,gospEat,spizCap,spizTot,wieczDaily,wieczAuto,przOn,przHost,haulSite,matOf,gospMade,qWord,gospHTML,fedOf,famMembers,lookAt,SLAD,sladDo,sladDaily,sladTick,ladPut,ladDel,ladStart,ladEnd,ladTap,ladScore,ladBuild,ladDaily,photoMode,line4,tribe,TRIBE,camp,techDone,TECH_BY,homeOf,bDone,kolNew,kolWho,hamRib,kolRibbon,kolGo,kolCands,kolDaily,kmapOpen,kmapClose,hamPath,walkers,freeRegions,settledCount,hamVis,genNeed,EVENTS,openEvent,goalsTick2:()=>goalsTick(),actDaily,wiecPokolen,ksiegaText,goalInfo2:()=>goalInfo(),rokNaWyspie,pamDaily,song,askVName,pamHTML,urzDaily,officesHTML,openSpor,obyStage,custHTML2:()=>custHTML(),ludDaily,foundHamlet,zadOf,relAdd,relGet,wedding,rodyHTML,hamletHTML,ludCard,mirWord,slowHTML,troubleHTML,kronText,FOOD,foodTotal,gfxSetLevel,get GFX(){return GFX},setYaw(v){yaw=yawT=v},get yaw(){return yaw},slavDaily,slavHTML,custHTML,get evOpen(){return evOpen},startProj,finishProj,rebuildMesh,custChange,custTick,custInit,setOffice,lawDaily,startFire,upgradeB,reqTick,disDaily,REGIONS,sendExp,tech,regionScan,toggleOverview,step,newDay,assign,nodes,startGame,setAlloc,setWant,startPlace,tryPlace,moveGhost,checkPlace,camp,wreck,tribe,rev,fogPass,openSheet,closeSheet,setCam,select,selectB,reveal,deco,BD,bById,countInRange,
 get ghostTile(){return ghostTile},get placing(){return placing},get zoom(){return zoom},setZoom(z){zoom=zoomT=z;setCam()},get qLevel(){return qLevel},setTime(t){S.day=Math.floor(S.day)+t},look(x,z){camT.x=x;camT.z=z;setCam()},
 build(kind,i,j){startPlace(kind);moveGhost(i,j);const gt=ghostTile;const ok=checkPlace(kind,gt[0],gt[1]);if(ok)tryPlace();else cancelPlace();return ok},
 scene,Hy,tcx,pGroup,bGroup,nodeBy,pickNodeB,inRange,TRIAL,herdsDef,planJob,astar,tileOf,nearestWalk,finishAll(){S.bld.forEach(b=>{if(!bDone(b)){b.prog=b.work;completeSite(b)}})}};
});
</script>
