
/* ================= grafika: poziomy jakości, wiatr, obróbka obrazu ================= */
// Poziomy: 2 Ultra (obróbka obrazu, cienie 4096, wiatr, drobiny, blask wody), 1 Wysoka, 0 Niska.
const GFXU={t:{value:0},amp:{value:1}};
function windify(m,k){m.onBeforeCompile=sh=>{sh.uniforms.uWT=GFXU.t;sh.uniforms.uWA=GFXU.amp;sh.uniforms.uWK={value:k};
  sh.vertexShader='uniform float uWT;uniform float uWA;uniform float uWK;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
  { vec2 ip=vec2(0.);
  #ifdef USE_INSTANCING
   ip=instanceMatrix[3].xz;
  #endif
   float hh=max(position.y,0.);float ph=uWT*1.7+ip.x*.37+ip.y*.29;float g=hh*hh*uWK*uWA;
   transformed.x+=(sin(ph)*.7+sin(ph*2.7+1.3)*.3)*g; transformed.z+=(cos(ph*.83)*.5+sin(ph*3.1)*.2)*g*.8; }`)};
 m.customProgramCacheKey=()=>'wind'+k;return m}
const GFX={level:1,forced:false,gpu:'',rt:null,b1:null,b2:null,hdr:true,lastR:0,slow:0,zoomS:-1};
const pScene=new THREE.Scene(),pCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1),pQuad=new THREE.Mesh(new THREE.PlaneGeometry(2,2));pQuad.frustumCulled=false;pScene.add(pQuad);
const PV='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const NOISE=`float hs(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}`;
const brightMat=new THREE.ShaderMaterial({uniforms:{tCol:{value:null},uPx:{value:new THREE.Vector2()},uTh:{value:1}},vertexShader:PV,depthTest:false,depthWrite:false,
 fragmentShader:`uniform sampler2D tCol;uniform vec2 uPx;uniform float uTh;varying vec2 vUv;
 void main(){vec3 c=(texture2D(tCol,vUv+uPx*vec2(-1.,-1.)).rgb+texture2D(tCol,vUv+uPx*vec2(1.,-1.)).rgb+texture2D(tCol,vUv+uPx*vec2(-1.,1.)).rgb+texture2D(tCol,vUv+uPx*vec2(1.,1.)).rgb)*.25;
  float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(uTh,uTh*1.8,l),1.);}`});
const blurMat=new THREE.ShaderMaterial({uniforms:{tCol:{value:null},uDir:{value:new THREE.Vector2()}},vertexShader:PV,depthTest:false,depthWrite:false,
 fragmentShader:`uniform sampler2D tCol;uniform vec2 uDir;varying vec2 vUv;
 void main(){vec3 c=texture2D(tCol,vUv).rgb*.227;c+=(texture2D(tCol,vUv+uDir*1.385).rgb+texture2D(tCol,vUv-uDir*1.385).rgb)*.316;c+=(texture2D(tCol,vUv+uDir*3.23).rgb+texture2D(tCol,vUv-uDir*3.23).rgb)*.07;gl_FragColor=vec4(c,1.);}`});
const compMat=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,vertexShader:PV,
 uniforms:{tCol:{value:null},tDep:{value:null},tBl:{value:null},uRes:{value:new THREE.Vector2(1,1)},uExp:{value:1},uT:{value:0},uAO:{value:.55},uAOR:{value:6},uTilt:{value:.5},uCloud:{value:.2},uBloom:{value:.45},
  uNear:{value:1},uFar:{value:500},uIP:{value:new THREE.Matrix4()},uCW:{value:new THREE.Matrix4()},uWind:{value:new THREE.Vector2(.012,.007)},uDpr:{value:1}},
 fragmentShader:`uniform sampler2D tCol;uniform sampler2D tDep;uniform sampler2D tBl;uniform vec2 uRes;uniform float uExp;uniform float uT;uniform float uAO;uniform float uAOR;uniform float uTilt;uniform float uCloud;uniform float uBloom;
 uniform float uNear;uniform float uFar;uniform mat4 uIP;uniform mat4 uCW;uniform vec2 uWind;uniform float uDpr;varying vec2 vUv;
 ${NOISE}
 vec3 RRT(vec3 v){vec3 a=v*(v+0.0245786)-0.000090537;vec3 b=v*(0.983729*v+0.4329510)+0.238081;return a/b;}
 vec3 aces(vec3 color){const mat3 I=mat3(vec3(0.59719,0.07600,0.02840),vec3(0.35458,0.90834,0.13383),vec3(0.04823,0.01566,0.83777));const mat3 O=mat3(vec3(1.60475,-0.10208,-0.00327),vec3(-0.53108,1.10813,-0.07276),vec3(-0.07367,-0.00605,1.07602));
  color*=uExp/0.6;color=I*color;color=RRT(color);color=O*color;return clamp(color,0.,1.);}
 vec3 toS(vec3 c){return mix(pow(c,vec3(.41666))*1.055-vec3(.055),c*12.92,vec3(lessThanEqual(c,vec3(.0031308))));}
 float dep(vec2 uv){return texture2D(tDep,uv).x;}
 void main(){vec2 px=1./uRes;float d=dep(vUv);float rng=uFar-uNear;
  vec3 c=texture2D(tCol,vUv).rgb;
  float tb=uTilt*smoothstep(.16,.52,abs(vUv.y-.5));
  if(tb>.02){vec3 acc=c;for(int k=0;k<10;k++){float a=float(k)*2.39996+.5;float r=sqrt((float(k)+.5)/10.);acc+=texture2D(tCol,vUv+vec2(cos(a),sin(a))*r*tb*6.*uDpr*px).rgb;}c=acc/11.;}
  if(uAO>0.&&d<.9999){float occ=0.;
   for(int s=0;s<2;s++){float R=uAOR*(s==0?1.:2.4)*uDpr;for(int k=0;k<6;k++){float a=float(k)*1.0472+.4+float(s)*.5;vec2 o=vec2(cos(a),sin(a))*R*px;
    float d1=dep(vUv+o),d2=dep(vUv-o);float df=(d-(d1+d2)*.5)*rng;occ+=smoothstep(.015,.18,df)*(1.-smoothstep(.3,.8,df));}}
   c*=1.-uAO*clamp(occ/9.,0.,1.);}
  if(uCloud>0.&&d<.9999){vec4 v=uIP*vec4(vUv*2.-1.,d*2.-1.,1.);v/=v.w;vec3 w=(uCW*v).xyz;
   float n=vn(w.xz*.03+uWind*uT)*.65+vn(w.xz*.08+uWind*uT*1.4+3.7)*.35;c*=1.-uCloud*smoothstep(.48,.74,n);}
  c+=texture2D(tBl,vUv).rgb*uBloom;
  c=toS(aces(c));
  c=mix(c,c*c*(3.-2.*c),.32);{float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,1.06);}
  vec2 q=(vUv-.5)*vec2(uRes.x/uRes.y,1.);c*=mix(.74,1.,smoothstep(1.05,.32,length(q)));
  c+=(hs(vUv*uRes+fract(uT*7.3)*91.)-.5)*.02;
  gl_FragColor=vec4(c,1.);}`});
function gfxPick(){const q=new URLSearchParams(location.search);
 try{const gl=renderer.getContext(),dx=gl.getExtension('WEBGL_debug_renderer_info');if(dx)GFX.gpu=String(gl.getParameter(dx.UNMASKED_RENDERER_WEBGL)||'')}catch(e){}
 if(q.has('gfx')){GFX.forced=true;return clamp(+q.get('gfx')|0,0,2)}
 if(LOWQ)return 0;let s=null;try{s=localStorage.getItem('przystan-gfx')}catch(e){}if(s==='0'||s==='1'||s==='2')return +s;
 const strong=/Adreno[^0-9]*(7[3-9]\d|8\d\d)|Mali-G(7[1-9]|71\d|72\d|9\d\d)|Immortalis|Apple|NVIDIA|GeForce|Radeon|Intel.*(Iris|Arc)/i.test(GFX.gpu);
 return renderer.capabilities.isWebGL2&&(strong||!coarse)?2:1}
function gfxDispose(){['rt','b1','b2'].forEach(k=>{if(GFX[k]){if(GFX[k].depthTexture)GFX[k].depthTexture.dispose();GFX[k].dispose();GFX[k]=null}})}
function gfxResize(){gfxDispose();if(GFX.level<2)return;const v=new THREE.Vector2();renderer.getDrawingBufferSize(v);const w=Math.max(2,v.x|0),h=Math.max(2,v.y|0);
 const ex=renderer.extensions;GFX.hdr=renderer.capabilities.isWebGL2&&(ex.has('EXT_color_buffer_float')||ex.has('EXT_color_buffer_half_float'));const type=GFX.hdr?THREE.HalfFloatType:THREE.UnsignedByteType;
 const dt=new THREE.DepthTexture(w,h);dt.type=THREE.UnsignedIntType;
 GFX.rt=new THREE.WebGLRenderTarget(w,h,{type,depthTexture:dt,samples:renderer.capabilities.isWebGL2?4:0});
 const bw=Math.max(2,w>>2),bh=Math.max(2,h>>2);GFX.b1=new THREE.WebGLRenderTarget(bw,bh,{type});GFX.b2=new THREE.WebGLRenderTarget(bw,bh,{type});
 compMat.uniforms.uRes.value.set(w,h);compMat.uniforms.uDpr.value=renderer.getPixelRatio();brightMat.uniforms.uPx.value.set(1/w,1/h)}
function gfxShadow(){const sz=GFX.level===2?4096:2048;if(sun.shadow.mapSize.x!==sz){sun.shadow.mapSize.set(sz,sz);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}}
function gfxSetLevel(l,quiet){l=clamp(l|0,0,2);GFX.level=l;const dpr=devicePixelRatio||1;
 renderer.setPixelRatio(l===2?Math.min(dpr,coarse?2.2:2):l===1?Math.min(dpr,coarse?1.6:2):1);
 const sh=l>0&&!LOWQ&&qLevel<1;renderer.shadowMap.enabled=sh;sun.castShadow=sh;gfxShadow();
 if(typeof tufts!=='undefined')tufts.visible=l>0;wUni.uGlint.value=l===2?1:0;GFXU.amp.value=l===2?1:l===1?.7:0;
 scene.traverse(o=>{if(o.material)[].concat(o.material).forEach(mm=>mm.needsUpdate=true)});
 if(typeof resize==='function')resize();else gfxResize();
 if(!quiet){try{localStorage.setItem('przystan-gfx',String(l))}catch(e){}toast('Grafika: '+['niska','wysoka','ultra'][l])}
 if(typeof renderCtl==='function')renderCtl()}
// drobiny: liście jesienią, pyłki latem w słońcu
const ptN=260,ptGeo=new THREE.BufferGeometry(),ptPos=new Float32Array(ptN*3),ptSeed=new Float32Array(ptN*4);{const r0=rng(91);for(let k=0;k<ptN*4;k++)ptSeed[k]=r0()}
ptGeo.setAttribute('position',new THREE.BufferAttribute(ptPos,3));
const ptMat=new THREE.PointsMaterial({size:.14,transparent:true,depthWrite:false,opacity:0,color:0xd8a050,sizeAttenuation:true});const gPts=new THREE.Points(ptGeo,ptMat);gPts.frustumCulled=false;scene.add(gPts);
function gfxParticles(rdt,Lt){if(GFX.level<2||!S){gPts.visible=false;return}
 const autumn=yday()>=24&&yday()<48,summer=yday()<24||yday()>=76,wk=S.weather.k;
 const on=autumn?(.85*(.4+.6*Lt.day)):summer&&Lt.day>.3&&wk!=='rain'&&wk!=='storm'?.5*Lt.day:0;gPts.visible=on>.01;if(!gPts.visible)return;
 ptMat.opacity=on;ptMat.color.setHex(autumn?0xc88a3e:0xf2e6b0);ptMat.size=(autumn?.16:.07)*Math.max(.8,zoom*.7);
 const R=26/Math.max(.4,zoom),wind=wk==='storm'?3:1;
 for(let k=0;k<ptN;k++){const a=ptSeed[k*4],b=ptSeed[k*4+1],sp=ptSeed[k*4+2],ph=ptSeed[k*4+3];const T=clock*(autumn?.07:.03)*(.5+sp)*wind+ph;const f=T%1;
  const x=camT.x+(a-.5)*2*R+Math.sin(clock*.6+ph*9)*.8+f*(autumn?6:2),z=camT.z+(b-.5)*2*R+Math.cos(clock*.5+ph*7)*.6+f*2;
  const g=Hy(x,z);ptPos[k*3]=x;ptPos[k*3+1]=autumn?g+(1-f)*4.5+.05:g+.6+Math.sin(clock*.9+ph*20)*.4+sp;ptPos[k*3+2]=z}
 ptGeo.attributes.position.needsUpdate=true}
function gfxTick(rdt,Lt){GFXU.t.value=clock;const wk=S?S.weather.k:'clear';const tgt=(wk==='storm'?3.2:wk==='rain'?1.7:wk==='snow'?1.3:1)*(GFX.level===2?1:GFX.level===1?.7:0);GFXU.amp.value+=(tgt-GFXU.amp.value)*Math.min(1,rdt*.8);
 if(GFX.level===2&&Math.abs(GFX.zoomS-zoom)>.02){GFX.zoomS=zoom;const e=clamp(32/zoom*1.15,12,40);const s=sun.shadow.camera;s.left=-e;s.right=e;s.top=e;s.bottom=-e;s.updateProjectionMatrix()}
 if(Lt)gfxParticles(rdt,Lt)}
function gfxSkip(now){if(GFX.level===2&&now-GFX.lastR<10.5)return true;GFX.lastR=now;return false}
function gfxRender(){if(GFX.level<2){renderer.render(scene,cam);return}if(!GFX.rt)gfxResize();
 const U=compMat.uniforms;renderer.setRenderTarget(GFX.rt);renderer.render(scene,cam);
 brightMat.uniforms.tCol.value=GFX.rt.texture;brightMat.uniforms.uTh.value=GFX.hdr?1.5:.86;pQuad.material=brightMat;renderer.setRenderTarget(GFX.b1);renderer.render(pScene,pCam);
 const bw=GFX.b1.width,bh=GFX.b1.height;pQuad.material=blurMat;
 for(const st of[1,2.2]){blurMat.uniforms.tCol.value=GFX.b1.texture;blurMat.uniforms.uDir.value.set(st/bw,0);renderer.setRenderTarget(GFX.b2);renderer.render(pScene,pCam);
  blurMat.uniforms.tCol.value=GFX.b2.texture;blurMat.uniforms.uDir.value.set(0,st/bh);renderer.setRenderTarget(GFX.b1);renderer.render(pScene,pCam)}
 U.tCol.value=GFX.rt.texture;U.tDep.value=GFX.rt.depthTexture;U.tBl.value=GFX.b1.texture;U.uExp.value=renderer.toneMappingExposure;U.uT.value=clock;
 U.uNear.value=cam.near;U.uFar.value=cam.far;U.uIP.value.copy(cam.projectionMatrixInverse);U.uCW.value.copy(cam.matrixWorld);
 U.uTilt.value=clamp(.2+(zoom-1)*.3,.12,.7);U.uAOR.value=clamp(3+zoom*2.4,3,12);
 const wk=S?S.weather.k:'clear',day=S?clamp(sun.intensity/1.2,0,1):1;U.uCloud.value=(wk==='clear'||wk==='drought'?.24:wk==='fog'?.05:.1)*day;
 U.uBloom.value=S?.22+.35*(1-day):.22;
 pQuad.material=compMat;renderer.setRenderTarget(null);renderer.render(pScene,pCam)}
// spowolnienie: z Ultra najpierw schodzimy na Wysoką
function gfxSlow(avg){if(GFX.level===2&&!GFX.forced){if(avg>.036){GFX.slow++;if(GFX.slow>=3){GFX.slow=0;gfxSetLevel(1,true);toast('Grafika obniżona do wysokiej, żeby gra szła płynnie');}}else GFX.slow=0;return true}return false}
GFX.level=gfxPick();
