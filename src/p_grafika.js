
// ================= 1.7 Grafika: światło, woda, teren, trawa, liście, ludzie, pogoda =================
const G17={sunDir:new THREE.Vector3(0,1,0),wet:0,low:0,fps:0,fpsN:0,fpsT:0};
const GN=`float g_hs(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float g_vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(g_hs(i),g_hs(i+vec2(1,0)),f.x),mix(g_hs(i+vec2(0,1)),g_hs(i+vec2(1,1)),f.x),f.y);}`;

// ---------- światło: mocniejsze słońce, słabsze rozproszone, złota godzina ----------
{const _l=lighting;lighting=function(){const Lt=_l();if(!S)return Lt;const e=Lt.e,day=Lt.day;const low=day*(1-sstep(.22,.62,e));G17.low=low;
  const dim=WX.dim;
  sun.intensity*=1.12;hemi.intensity*=.6+.12*(1-dim);renderer.toneMappingExposure*=.84+.2*(1-day);
  sun.color.setRGB(1,.74+.2*(1-low)*day,.5+.38*(1-low)*day);
  hemi.color.setRGB(.5+.32*day,.6+.28*day,.86+.1*day);hemi.groundColor.setRGB(.34+.06*day,.33+.04*day,.24);
  G17.sunDir.copy(sun.position).sub(sun.target.position).normalize();
  wUni.uSunDir.value.copy(G17.sunDir);wUni.uSky.value.copy(scene.background);wUni.uLow.value=low;wUni.uCamP.value.copy(cam.position);
  // gradacja kolorów (tylko z obróbką obrazu)
  const yd=yday(),aut=yd>=24&&yd<48?1:0,win=yd>=48&&yd<72?1:0,night=Lt.night;const U=compMat.uniforms;
  U.uGain.value.set(1+.06*low+.04*aut-.03*win-.03*night,1-.01*low-.01*night,1-.1*low-.08*aut+.04*win+.05*night);
  U.uLift.value.set(.006+.01*low,.012,.026+.02*night+.012*win);
  U.uSat.value=1.16+.06*aut-.18*win-.08*night-(1-dim)*.25;
  // mokra ziemia w deszczu
  G17.wet=WX.wet;TU.uWet.value=G17.wet;TU.uT.value=clock;TU.uDay.value=day;
  return Lt}}

// ---------- obróbka obrazu: gradacja kolorów, cienie chmur także na morzu ----------
Object.assign(compMat.uniforms,{uGain:{value:new THREE.Vector3(1,1,1)},uLift:{value:new THREE.Vector3(0,0,0)},uSat:{value:1}});
compMat.fragmentShader=compMat.fragmentShader
 .replace('uniform float uDpr;varying vec2 vUv;','uniform float uDpr;uniform vec3 uGain;uniform vec3 uLift;uniform float uSat;varying vec2 vUv;')
 .replace('if(uCloud>0.&&d<.9999){vec4 v=uIP*vec4(vUv*2.-1.,d*2.-1.,1.);v/=v.w;vec3 w=(uCW*v).xyz;',
  'if(uCloud>0.){vec3 w;if(d<.9999){vec4 v=uIP*vec4(vUv*2.-1.,d*2.-1.,1.);v/=v.w;w=(uCW*v).xyz;}else{vec4 a=uIP*vec4(vUv*2.-1.,-1.,1.);a/=a.w;vec4 b=uIP*vec4(vUv*2.-1.,1.,1.);b/=b.w;vec3 A=(uCW*a).xyz,B=(uCW*b).xyz;float tt=clamp((-.04-A.y)/(B.y-A.y),0.,1.);w=mix(A,B,tt);}')
 .replace('c=mix(c,c*c*(3.-2.*c),.32);','c=mix(c,c*c*(3.-2.*c),.32);c=c*uGain+uLift*(1.-c);{float lg=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(lg),c,uSat);}');
compMat.needsUpdate=true;

// ---------- woda: odbicie nieba, słońce na falach ----------
Object.assign(wUni,{uSunDir:{value:new THREE.Vector3(0,1,0)},uSky:{value:new THREE.Color(.6,.7,.75)},uLow:{value:0},uCamP:{value:new THREE.Vector3()}});
wMat.fragmentShader=wMat.fragmentShader
 .replace('uniform float uGlint;','uniform float uGlint;uniform vec3 uSunDir;uniform vec3 uSky;uniform float uLow;uniform vec3 uCamP;')
 .replace('c*=uSun*(.3+.7*uDay);',`c*=uSun*(.3+.7*uDay);
  {vec3 V=normalize(uCamP-vW);vec2 q=vW.xz*1.25+vec2(uT*.32,uT*.21);float h0=vn(q),hx=vn(q+vec2(.15,0.)),hz=vn(q+vec2(0.,.15));
   vec2 q2=vW.xz*3.1-vec2(uT*.45,-uT*.38);float k0=vn(q2),kx=vn(q2+vec2(.15,0.)),kz=vn(q2+vec2(0.,.15));
   vec3 Nn=normalize(vec3((h0-hx)*1.6+(k0-kx)*.8,1.,(h0-hz)*1.6+(k0-kz)*.8));
   float fr=pow(1.-max(dot(V,Nn),0.),4.);float deepM=smoothstep(.2,1.6,d)*(1.-band*.6);
   c=mix(c,uSky*(.45+.55*uDay),clamp(.1+fr*1.6,0.,.55)*deepM);
   vec3 R=reflect(-V,Nn);float sh=mix(220.,55.,uLow);float sp=pow(max(dot(R,uSunDir),0.),sh);
   c+=uSun*vec3(1.,.9,.75)*sp*mix(2.2,3.4,uLow)*uDay*deepM;}`);
wMat.needsUpdate=true;

// ---------- teren: faktura, mokry piasek, dno pod wodą, refleksy świetlne na dnie ----------
const TU={uT:{value:0},uWet:{value:0},uDay:{value:1},uDet:{value:1},uCau:{value:1},uRime:{value:0}};
{const tm=terrain.material;const prev=tm.onBeforeCompile;tm.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);Object.assign(sh.uniforms,TU);
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTW;').replace('#include <begin_vertex>','#include <begin_vertex>\nvTW=(modelMatrix*vec4(transformed,1.)).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vTW;uniform float uT;uniform float uWet;uniform float uDay;uniform float uDet;uniform float uCau;uniform float uRime;\n'+GN)
   .replace('#include <color_fragment>',`#include <color_fragment>
   float landF=smoothstep(-.06,.08,vTW.y);
   {float n1=g_vn(vTW.xz*1.7),n2=g_vn(vTW.xz*5.4),n3=g_vn(vTW.xz*.31);diffuseColor.rgb*=mix(1.,.84+.16*n1+.1*n2+.14*(n3-.5),uDet*landF);}
   float dw=-.04-vTW.y;if(dw>0.)diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.5,.72,.76),clamp(dw*.7,0.,.85));
   float wetB=(1.-smoothstep(.03,.2,vTW.y))*smoothstep(-.12,-.02,vTW.y);diffuseColor.rgb*=1.-.24*wetB-.12*uWet*landF;
   float pud=uWet*smoothstep(.6,.78,g_vn(vTW.xz*.85+3.1))*landF;diffuseColor.rgb*=1.-.22*pud;
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.82,.86,.9),uRime*landF*(.12+.38*smoothstep(.3,.8,g_vn(vTW.xz*3.1)))*smoothstep(.04,.3,vTW.y));`)
   .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.3,max(wetB,uWet*landF*.75));roughnessFactor=mix(roughnessFactor,.08,pud);')
   .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
   if(dw>0.&&uCau>0.){vec2 q=vTW.xz*1.15;float a=g_vn(q+vec2(uT*.35,uT*.22)),b=g_vn(q*1.7-vec2(uT*.28,-uT*.31));float cs=pow(1.-abs(a-b),9.);totalEmissiveRadiance+=vec3(.5,.72,.66)*cs*uCau*uDay*(1.-smoothstep(.05,1.3,dw));}`)};
 tm.customProgramCacheKey=()=>'terr17';tm.needsUpdate=true}

// ---------- liście prześwietlone słońcem ----------
function backlit(m){const prev=m.onBeforeCompile;m.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.fragmentShader=sh.fragmentShader.replace('#include <opaque_fragment>',`
 #if NUM_DIR_LIGHTS>0
 {vec3 Vv=normalize(vViewPosition);float bl=pow(max(dot(-Vv,directionalLights[0].direction),0.),3.);outgoingLight+=diffuseColor.rgb*directionalLights[0].color*bl*.5;}
 #endif
 #include <opaque_fragment>`)};const pk=m.customProgramCacheKey;m.customProgramCacheKey=()=>(pk?pk.call(m):'')+'bl';m.needsUpdate=true}
Object.values(crownM).forEach(cm=>backlit(cm.material));if(typeof bushes!=='undefined'&&bushes.material)backlit(bushes.material);

// ---------- gęsta trawa wokół kamery ----------
const grassG=(()=>{const P=[],C=[],Nm=[];for(let k=0;k<4;k++){const a=k*1.7+.4,ca=Math.cos(a)*.03,sa=Math.sin(a)*.03,ox=Math.cos(a*2.3)*.07,oz=Math.sin(a*2.3)*.07,h=.2+k*.05,lean=.05+.03*k;
  P.push(ox-ca,0,oz-sa,ox+ca,0,oz+sa,ox+Math.cos(a+1.57)*lean,h,oz+Math.sin(a+1.57)*lean);C.push(.5,.56,.44,.5,.56,.44,1.18,1.16,1.02);for(let v=0;v<3;v++)Nm.push(0,1,0)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('color',new THREE.Float32BufferAttribute(C,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(Nm,3));return g})();
const GRMAX=26000;const grassM=new THREE.InstancedMesh(grassG,windify(new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:1}),2.4),GRMAX);
grassM.receiveShadow=true;grassM.castShadow=false;grassM.count=0;grassM.frustumCulled=false;scene.add(grassM);
const GR={cx:1e9,cz:1e9,lvl:-1,t:0,yd:-1};const grD=new THREE.Object3D();
function grassBuild(){const lvl=GFX.level;const per=lvl===2?11:lvl===1?5:0;const R=Math.round(clamp(30/Math.max(.5,zoom),11,22));const ci=Math.floor(camT.x+N/2),cj=Math.floor(camT.z+N/2);let n=0;
 GR.cx=camT.x;GR.cz=camT.z;GR.lvl=lvl;GR.R=R;
 if(per&&!(yday()>=50&&yday()<70))for(let j=cj-R;j<=cj+R&&n<GRMAX;j++)for(let i=ci-R;i<=ci+R&&n<GRMAX;i++){if(i<1||j<1||i>=N-1||j>=N-1)continue;const k=j*N+i;
  if(!land[k]||!rev[k]||beach[k]||occ[k]>=0||tread[k]>.32)continue;const hh=tileHH(i,j),h=tileH(i,j);if(hh<.1||h>7.5||slope(i,j)>1.1)continue;
  const ff=forestF(i+.5,j+.5);const cnt=Math.round(per*(ff>.55?.35:ff>.45?.7:1)*(1-tread[k]*2));
  for(let q=0;q<cnt&&n<GRMAX;q++){const r1=vh(i*3.1+q,j*1.7),r2=vh(i*1.3,j*2.9+q*1.7),r3=vh(i+q*5.1,j+q*.7);const x=i-N/2+r1,z=j-N/2+r2;
   grD.position.set(x,Hy(x,z)-.02,z);grD.rotation.set(0,r3*6.28,0);const s=.75+r3*.6;grD.scale.set(s,s*(.8+r1*.5),s);grD.updateMatrix();grassM.setMatrixAt(n++,grD.matrix)}}
 grassM.count=n;grassM.instanceMatrix.needsUpdate=true;grassTint()}
function grassTint(){const c=seasonCol(SG,curYd);grassM.material.color.setRGB(c[0]*.98,c[1]*.98,c[2]*.92);GR.yd=Math.floor(curYd)}
function grassTick(rdt){if(!S)return;GR.t+=rdt;const show=GFX.level>0&&zoom>=.85&&!overview;grassM.visible=show;if(!show)return;
 if(GR.lvl!==GFX.level||Math.hypot(camT.x-GR.cx,camT.z-GR.cz)>4.5||(GR.t>8&&(GR.t=0,true))||Math.abs(clamp(30/Math.max(.5,zoom),11,22)-GR.R)>3)grassBuild();
 else if(Math.floor(curYd)!==GR.yd)grassTint()}

// ---------- ludzie: pasy, buty, chusty, brody, sakwy ----------
const PM={belt:M(0x2e241a),boot:M(0x2a2018),beard:[M(0x4a3626),M(0x6b4e30),M(0x2a221c),M(0x9a948a)],chusta:[M(0xb04a36),M(0xc8b48a),M(0x5a6a7a),M(0x7a5a8a),M(0xe0d6c0)],bag:M(0x7a5a3a)};
// Detale postaci są scalane w kanonicznym makePersonMesh / makePerson18.

// ---------- mgła o świcie nad wodą i nizinami ----------
const dawnMist=[];function mistInit(){const r0=rng(171);let k=0;for(let t=0;t<6000&&k<44;t++){const x=(r0()*2-1)*92,z=(r0()*2-1)*92,h=Hy(x,z);if(h>.7||h<-1.6)continue;
 let near=false;for(const o of dawnMist){if(Math.hypot(o.userData.x-x,o.userData.z-z)<9){near=true;break}}if(near)continue;
 const m=new THREE.Mesh(new THREE.PlaneGeometry(17,17),new THREE.MeshBasicMaterial({map:mistTex,transparent:true,opacity:0,depthWrite:false,color:0xe6ecee,fog:false}));m.rotation.x=-Math.PI/2;m.renderOrder=4;m.visible=false;
 m.userData={x,z,y:Math.max(h,-.04)+.35+(k%8)*.04,low:h<.5,ph:r0()*6.28,sp:.04+r0()*.05};scene.add(m);dawnMist.push(m);k++}}
function mistTick(rdt){if(!S)return;if(!dawnMist.length)mistInit();const t=tod();const f=Math.max(1-Math.abs(t-.255)/.07,0)+Math.max(1-Math.abs(t-.86)/.06,0)*.3;const amt=Math.min(1,f*(1+.9*WX.fog)+WX.fog*(t<.45?.6:.3))*(1-WX.wind*.8)*(GFX.level>0?1:0);const col=t>.5?0x8a8f96:0xe6ecee;
 dawnMist.forEach(m=>{const u=m.userData;m.visible=amt>.004;if(!m.visible)return;const a=clock*u.sp+u.ph;m.position.set(u.x+Math.sin(a)*2.2,u.y,u.z+Math.cos(a*.8)*1.6);m.material.opacity=amt*(u.low?.32:.13);m.material.color.setHex(col)})}

// ---------- licznik klatek w menu tempa ----------
{const sp=$('speed');if(sp&&!$('fpsv'))sp.insertAdjacentHTML('beforeend','<span id="fpsv" style="font-size:12.5px;color:var(--mut);padding:0 8px;align-self:center;white-space:nowrap"></span>')}
function fpsTick(rdt){G17.fpsN++;G17.fpsT+=rdt;if(G17.fpsT>=1){G17.fps=Math.round(G17.fpsN/G17.fpsT);G17.fpsN=0;G17.fpsT=0;const e=$('fpsv');if(e)e.textContent=G17.fps+' klatek/s · '+['niska','wysoka','ultra'][GFX.level]}}

{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{grassTick(rdt);mistTick(rdt);fpsTick(rdt);TU.uDet.value=GFX.level===0?.5:1;TU.uCau.value=GFX.level===2?1:GFX.level===1?.6:0}catch(e){console.warn(e)}}}
window.__g17={G17,grassBuild,get grassN(){return grassM.count},TU};
// ---------- starzenie budynków: ciemniejące drewno i mech przy zużyciu ----------
const AGEC={};
function ageMat(m,bk){if(!m||!m.color||m.isMeshBasicMaterial||(m.emissiveIntensity>0&&m.emissive&&m.emissive.getHex()))return m;const key=m.uuid+':'+bk;if(AGEC[key])return AGEC[key];
 const c=m.clone();c.onBeforeCompile=m.onBeforeCompile;if(m.customProgramCacheKey!==THREE.Material.prototype.customProgramCacheKey)c.customProgramCacheKey=m.customProgramCacheKey;
 const f=bk===1?.84:.7,g=bk===1?.03:.07;c.color.setRGB(m.color.r*f,m.color.g*f+g*.5,m.color.b*f*.95);AGEC[key]=c;return c}
function ageBld(b){const g=bMesh[b.id];if(!g||!bDone(b))return;const cnd=condOf(b);const bk=cnd>=.65?0:cnd>=.4?1:2;if(g.userData.ageBk===bk)return;g.userData.ageBk=bk;
 g.traverse(o=>{if(!o.isMesh||o.userData.noAge)return;if(!o.userData.baseMat)o.userData.baseMat=o.material;const base=o.userData.baseMat;o.material=bk===0?base:Array.isArray(base)?base.map(x=>ageMat(x,bk)):ageMat(base,bk)})}
let ageT=0;
// ---------- ryby wyskakujące z wody ----------
const fishJ={m:null,t:0,dur:0,x:0,z:0,dx:0,dz:0,next:3};
function fishTick(rdt){if(!S||GFX.level===0)return;if(!fishJ.m){fishJ.m=new THREE.Mesh(new THREE.SphereGeometry(.09,6,4).scale(2.2,.7,.8),new THREE.MeshStandardMaterial({color:0xb8c4c8,roughness:.3,metalness:.4}));fishJ.m.visible=false;scene.add(fishJ.m)}
 const f=fishJ;if(f.dur>0){f.t+=rdt;const a=f.t/f.dur;if(a>=1){f.dur=0;f.m.visible=false;if(typeof dustPuff==='function')dustPuff(f.x+f.dx,-.02,f.z+f.dz,4,.5);return}
  f.m.visible=true;f.m.position.set(f.x+f.dx*a,-.05+Math.sin(a*Math.PI)*.75,f.z+f.dz*a);f.m.rotation.set(0,Math.atan2(-f.dz,f.dx),(.5-a)*2.2);return}
 f.next-=rdt;if(f.next>0)return;f.next=4+Math.random()*7;const L=nodeBy.fish.filter(n=>revAt(n.stand[0],n.stand[1])&&Math.abs(n.x-camT.x)<18/Math.max(.5,zoom)+6&&Math.abs(n.z-camT.z)<22/Math.max(.5,zoom)+6);
 if(!L.length||tod()<T0||tod()>.86)return;const n=L[(Math.random()*L.length)|0];const a=Math.random()*6.28;f.x=n.x+(Math.random()-.5)*1.5;f.z=n.z+(Math.random()-.5)*1.5;f.dx=Math.cos(a)*1.1;f.dz=Math.sin(a)*1.1;f.t=0;f.dur=.75}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{fishTick(rdt);ageT+=rdt;if(ageT>2&&S){ageT=0;S.bld.forEach(ageBld)}}catch(e){console.warn(e)}}}
