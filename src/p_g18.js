// ================= 1.8 Grafika II: nowy Three.js, światło, teren, barwy, modele =================
// --- zgodność z dawnym światłem: natężenia jak w r149 (×π), zanik światła punktowego jak dawniej ---
THREE.ShaderChunk.lights_pars_begin=THREE.ShaderChunk.lights_pars_begin.replace(/float getDistanceAttenuation\([\s\S]*?return distanceFalloff;\s*\}/,
 `float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
	return 1.0;
}`);
const G18={lights:[],lt:-1};
{const _r=renderer.render.bind(renderer);renderer.render=function(sc,c){if(sc!==scene)return _r(sc,c);
  if(clock-G18.lt>2||G18.lt<0){G18.lt=clock;G18.lights=[];scene.traverse(o=>{if(o.isLight)G18.lights.push(o)})}
  const L=G18.lights;for(const l of L){l._i0=l.intensity;if(!l.isLightProbe)l.intensity*=Math.PI}
  try{_r(sc,c)}finally{for(const l of L)l.intensity=l._i0}}}
window.__g18=G18;

// ================= KROK 2: światło z nieba (IBL), miękkie cienie, okluzja otoczenia =================
const ENV={probe:null,lt:-9,key:'',on:false,dirs:null,H:new THREE.Color(),Z:new THREE.Color(),G:new THREE.Color(),S:new THREE.Color(),D:new THREE.Vector3(0,1,0)};
const _ec=new THREE.Color(),_eb=[];for(let i=0;i<9;i++)_eb.push(0);
function envDirs(){const N=160,L=[];const ga=Math.PI*(3-Math.sqrt(5));for(let i=0;i<N;i++){const y=1-(i+.5)/N*2,r=Math.sqrt(1-y*y),a=i*ga;L.push(new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r))}return L}
function envSky(d,o){const y=d.y;if(y>0){const t=Math.pow(y,.55);o.copy(ENV.H).lerp(ENV.Z,t)}else{const t=Math.pow(Math.min(-y*3,1),.5);o.copy(ENV.H).lerp(ENV.G,t)}
 const s=Math.max(d.dot(ENV.D),0);const k=(y>-.05?(Math.pow(s,6)*.5+Math.pow(s,90)*4):0)+.35*Math.pow(Math.max(1-Math.abs(y),0),4)*Math.pow(s,1.5);o.r+=ENV.S.r*k;o.g+=ENV.S.g*k;o.b+=ENV.S.b*k;return o}
function envUpdate(){if(!ENV.probe){ENV.probe=new THREE.LightProbe();ENV.probe.userData.noPi=1;scene.add(ENV.probe);ENV.dirs=envDirs()}
 const sky=scene.background&&scene.background.isColor?scene.background:_ec.setRGB(.5,.6,.65);
 {const lh=hemi.color.r*.3+hemi.color.g*.55+hemi.color.b*.15,ls=Math.max(.02,sky.r*.3+sky.g*.55+sky.b*.15);ENV.H.copy(sky).multiplyScalar(lh/ls).lerp(hemi.color,.5);}
 ENV.Z.copy(ENV.H).multiply(_ec.setRGB(.86,.94,1.12));ENV.G.copy(hemi.groundColor);ENV.S.copy(sun.color).multiplyScalar(Math.min(1.6,sun.intensity)*.3);ENV.D.copy(G17.sunDir);
 const q=v=>Math.round(v*60);const key=[ENV.H.r,ENV.H.g,ENV.H.b,ENV.G.r,ENV.S.r,ENV.S.g,ENV.D.x,ENV.D.y,ENV.D.z].map(q).join(',');
 if(key===ENV.key||clock-ENV.lt<.4)return;ENV.key=key;ENV.lt=clock;
 const sh=ENV.probe.sh;sh.zero();const w=4*Math.PI/ENV.dirs.length,c=new THREE.Color();
 for(const d of ENV.dirs){envSky(d,c);THREE.SphericalHarmonics3.getBasisAt(d,_eb);for(let j=0;j<9;j++){sh.coefficients[j].x+=c.r*_eb[j]*w;sh.coefficients[j].y+=c.g*_eb[j]*w;sh.coefficients[j].z+=c.b*_eb[j]*w}}}
// natężenia: część światła z półkuli przechodzi na niebo; cienie miękkie
{const _l=lighting;lighting=function(){const Lt=_l();if(!S)return Lt;
  ENV.on=GFX.level>0&&!LOWQ&&!window.__noEnv;scene.environment=null;
  if(ENV.on){const h=hemi.intensity;try{envUpdate()}catch(e){ENV.on=false;console.warn(e)}
   if(ENV.on){hemi.intensity=h*.38;ENV.probe.intensity=h*.62*(GFX.level===2?1:.9);ENV.probe.visible=true}}
  if(!ENV.on&&ENV.probe)ENV.probe.intensity=0;
  sun.shadow.radius=GFX.level===2?3.2:GFX.level===1?1.8:1;
  return Lt}}

// ---------- okluzja otoczenia: osobny przebieg w połowie rozdzielczości + rozmycie z głębią ----------
const aoMat=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,vertexShader:PV,
 uniforms:{tDep:{value:null},uIP:{value:new THREE.Matrix4()},uRes:{value:new THREE.Vector2(1,1)},uR:{value:.9},uI:{value:1},uPS:{value:new THREE.Vector2(.05,.05)}},
 fragmentShader:`uniform sampler2D tDep;uniform mat4 uIP;uniform vec2 uRes;uniform float uR;uniform float uI;uniform vec2 uPS;varying vec2 vUv;
  vec3 vp(vec2 uv){float d=texture2D(tDep,uv).x;vec4 v=uIP*vec4(uv*2.-1.,d*2.-1.,1.);return v.xyz/v.w;}
  float ign(vec2 p){return fract(52.9829189*fract(dot(p,vec2(.06711056,.00583715))));}
  void main(){float d=texture2D(tDep,vUv).x;if(d>.9999){gl_FragColor=vec4(1.);return;}
   vec2 px=1./uRes;vec3 P=vp(vUv);
   vec3 a=vp(vUv+vec2(px.x,0.)),b=vp(vUv-vec2(px.x,0.)),c=vp(vUv+vec2(0.,px.y)),e=vp(vUv-vec2(0.,px.y));
   vec3 dx=abs(a.z-P.z)<abs(P.z-b.z)?a-P:P-b;vec3 dy=abs(c.z-P.z)<abs(P.z-e.z)?c-P:P-e;vec3 Nc=cross(dx,dy);if(!(dot(Nc,Nc)>1e-24)){gl_FragColor=vec4(1.);return;}vec3 N=normalize(Nc);
   float ang=ign(gl_FragCoord.xy)*6.2832;float occ=0.;float R2=uR*uR;
   for(int i=0;i<14;i++){float fi=(float(i)+.5)/14.;float an=ang+float(i)*2.39996;vec2 o=vec2(cos(an),sin(an))*sqrt(fi)*uR*uPS;
    vec3 v=vp(vUv+o)-P;float vv=dot(v,v);float vn=dot(v,N);occ+=max(vn-.012*uR,0.)/(vv+.02*R2)*max(1.-vv/R2/2.25,0.);}
   float ao=clamp(1.-uI*occ*uR*.32,0.,1.);if(!(ao>=0.&&ao<=1.))ao=1.;gl_FragColor=vec4(ao,ao,ao,1.);}`});
const aoBlur=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,vertexShader:PV,
 uniforms:{tAO:{value:null},tDep:{value:null},uDir:{value:new THREE.Vector2()},uNF:{value:new THREE.Vector2(1,500)}},
 fragmentShader:`uniform sampler2D tAO;uniform sampler2D tDep;uniform vec2 uDir;uniform vec2 uNF;varying vec2 vUv;
  void main(){float d0=texture2D(tDep,vUv).x;float s=0.,w=0.;for(int i=-3;i<=3;i++){vec2 uv=vUv+uDir*float(i);float dd=abs(texture2D(tDep,uv).x-d0)*(uNF.y-uNF.x);
   float wt=(1.-abs(float(i))/4.5)*exp(-dd*dd*6.);s+=texture2D(tAO,uv).r*wt;w+=wt;}float a=s/max(w,1e-4);gl_FragColor=vec4(a,a,a,1.);}`});
Object.assign(compMat.uniforms,{tAO:{value:null},uAO2:{value:0}});
compMat.fragmentShader=compMat.fragmentShader.replace('uniform float uDpr;','uniform float uDpr;uniform sampler2D tAO;uniform float uAO2;')
 .replace('if(uCloud>0.)','if(uAO2>0.)c*=mix(1.,texture2D(tAO,vUv).r,uAO2);\n  if(uCloud>0.)');
compMat.needsUpdate=true;
{const _gr=gfxResize;gfxResize=function(){_gr();['ao1','ao2'].forEach(k=>{if(GFX[k]){GFX[k].dispose();GFX[k]=null}});if(GFX.level<2||!GFX.rt)return;
  const w=Math.max(2,GFX.rt.width>>1),h=Math.max(2,GFX.rt.height>>1);GFX.ao1=new THREE.WebGLRenderTarget(w,h,{type:THREE.UnsignedByteType});GFX.ao2=new THREE.WebGLRenderTarget(w,h,{type:THREE.UnsignedByteType});
  aoMat.uniforms.uRes.value.set(w,h)}}
function aoPass(){if(!GFX.ao1||window.__noAO||overview||zoom<.36)return false;const A=aoMat.uniforms;A.tDep.value=GFX.rt.depthTexture;A.uIP.value.copy(cam.projectionMatrixInverse);
 A.uPS.value.set(cam.zoom/(cam.right-cam.left),cam.zoom/(cam.top-cam.bottom));A.uR.value=clamp(.55+.35/Math.max(.3,zoom),.6,1.6);
 pQuad.material=aoMat;renderer.setRenderTarget(GFX.ao1);renderer.render(pScene,pCam);
 const B=aoBlur.uniforms;B.tDep.value=GFX.rt.depthTexture;B.uNF.value.set(cam.near,cam.far);
 B.tAO.value=GFX.ao1.texture;B.uDir.value.set(1.4/GFX.ao1.width,0);pQuad.material=aoBlur;renderer.setRenderTarget(GFX.ao2);renderer.render(pScene,pCam);
 B.tAO.value=GFX.ao2.texture;B.uDir.value.set(0,1.4/GFX.ao1.height);renderer.setRenderTarget(GFX.ao1);renderer.render(pScene,pCam);return true}
// przebieg okluzji wstawiony między scenę a poświatę: podmieniamy materiał jasności na chwilę
{const _gr=gfxRender;gfxRender=function(){if(GFX.level<2)return _gr();
  const _rr=renderer.render.bind(renderer);let done=false;
  const hook=function(sc,c){const r=_rr(sc,c);if(!done&&sc===scene&&renderer.getRenderTarget()===GFX.rt){done=true;const ok=aoPass();compMat.uniforms.tAO.value=ok?GFX.ao1.texture:null;const za=overview?0:clamp((zoom-.35)/.35,0,1);compMat.uniforms.uAO2.value=ok?.85*za:0;compMat.uniforms.uAO.value=ok?0:.55*za;renderer.setRenderTarget(GFX.rt)}return r};
  renderer.render=hook;try{_gr()}finally{renderer.render=_rr}}}
window.__env=ENV;

// ================= KROK 3: teren z fakturami (trawa, ziemia, piasek, skała, śnieg) i wypukłością =================
const TG18={uTex:{value:1}};
{const tm=terrain.material;const prev=tm.onBeforeCompile;tm.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);Object.assign(sh.uniforms,TG18);
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTN;').replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nvTN=normalize(mat3(modelMatrix)*objectNormal);');
  sh.fragmentShader=sh.fragmentShader.replace(GN,GN+`
varying vec3 vTN;uniform float uTex;
vec2 t_h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}
vec2 t_vor(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=t_h2(i+g);float d=length(g+o-f);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}return vec2(d1,d2);}
float t_fbm(vec2 p){return g_vn(p)*.5+g_vn(p*2.03+7.1)*.3+g_vn(p*4.1+3.3)*.2;}
vec3 t_bump(vec3 sp,vec3 sn,float h){vec3 sx=dFdx(sp),sy=dFdy(sp);float hx=dFdx(h),hy=dFdy(h);vec3 r1=cross(sy,sn),r2=cross(sn,sx);float det=dot(sx,r1);vec3 gr=sign(det)*(hx*r1+hy*r2);vec3 nn=abs(det)*sn-gr;float l2=dot(nn,nn);bool ok=abs(det)>1e-10&&l2>1e-20&&!(any(isnan(nn))||any(isinf(nn)));nn=ok?nn*inversesqrt(max(l2,1e-20)):sn;return dot(nn,sn)>.2?nn:sn;}
`).replace('float landF=smoothstep(-.06,.08,vTW.y);',`float landF=smoothstep(-.06,.08,vTW.y);
   float tH=0.;
   if(uTex>0.){vec3 bc=sqrt(max(diffuseColor.rgb,0.));float lum=dot(bc,vec3(.3,.55,.15));float mx=max(bc.r,max(bc.g,bc.b)),mn=min(bc.r,min(bc.g,bc.b));float sat=(mx-mn)/max(mx,.01);
    float gate=smoothstep(.2,.32,lum)*landF*uTex;
    vec2 p=vTW.xz;float fw=length(fwidth(p));float fine=1.-smoothstep(.04,.12,fw);float mid=1.-smoothstep(.15,.45,fw);
    float wG=smoothstep(.01,.07,bc.g-max(bc.r,bc.b)*.98);
    float wSnow=smoothstep(.78,.86,lum)*(1.-smoothstep(.06,.12,sat));
    float wSand=(1.-wG)*smoothstep(.55,.66,lum)*smoothstep(.12,.22,sat)*(1.-wSnow);
    float steep=1.-vTN.y;float wRock=max(smoothstep(.4,.65,steep),(1.-smoothstep(.07,.14,sat))*(1.-wSnow)*smoothstep(5.5,7.5,vTW.y))*(1.-wSand)*(1.-wG*.7);
    float wDirt=clamp(1.-wG-wSand-wRock-wSnow,0.,1.);
    float m=0.;
    // trawa: kępki, źdźbła, suche plamy
    {vec2 q=mat2(.8,-.6,.6,.8)*p;float bl=g_vn(q*vec2(26.,6.))*.55+g_vn(q*vec2(7.,30.)+4.)*.45;float cl=t_fbm(p*.9);float dry=smoothstep(.62,.8,t_fbm(p*.35+11.));
     float gm=(1.+.3*(bl-.5)*fine+.22*(cl-.5));m+=wG*(gm-1.);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.22,1.1,.62),wG*dry*.55*gate);tH+=wG*(bl*.5*fine+cl*.5);}
    // ziemia: grudki, kamyki, koleiny
    {vec2 v=vec2(1.,2.);if(uTex>.9)v=t_vor(p*2.6);float peb=(1.-smoothstep(.1,.2,v.x))*mid*step(.55,t_h2(floor(p*2.6)).x);float mot=t_fbm(p*1.3);float ru=g_vn(p*9.)*fine;
     m+=wDirt*(.2*(mot-.5)+.12*peb+.08*(ru-.5));tH+=wDirt*(peb*.7+mot*.5+ru*.2);}
    // piasek: zmarszczki od wiatru
    {float rp=sin(dot(p,vec2(.9,.43))*7.+t_fbm(p*.8)*5.)*.5+.5;float gr2=g_vn(p*14.);m+=wSand*(.07*(rp-.5)*mid+.05*(gr2-.5)*fine);tH+=wSand*rp*.6;}
    // skała: warstwy i pęknięcia
    {vec2 v=vec2(1.,2.);if(uTex>.9)v=t_vor(p*1.6+vTW.y*.3);float st=sin(vTW.y*9.+t_fbm(p*1.2)*4.)*.5+.5;float ck=1.-smoothstep(.0,.05,v.y-v.x);float lich=smoothstep(.6,.75,t_fbm(p*2.2+5.));
     m+=wRock*(.14*(st-.5)-.22*ck*mid+.1*(t_fbm(p*3.)-.5));diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.9,1.05,.78),wRock*lich*.4*gate);tH+=wRock*(st*.6-ck*.8);}
    // śnieg: zaspy i iskry
    {float dr=t_fbm(p*.6);m+=wSnow*.06*(dr-.5);tH+=wSnow*dr*.5;}
    diffuseColor.rgb*=1.+m*gate;tH*=gate;
   }`).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
   if(uTex>0.){if(any(isnan(vec2(tH)))||any(isinf(vec2(tH))))tH=0.;normal=t_bump(-vViewPosition,normal,tH*.045);}`)};
 const pk=tm.customProgramCacheKey;tm.customProgramCacheKey=()=>(pk?pk.call(tm):'')+'t18';tm.needsUpdate=true}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);TG18.uTex.value=GFX.level===0||window.__noTex?0:GFX.level===1?.6:1}}

// ================= KROK 4: barwy pór roku i pogody (gradacja jak tablica barw) =================
Object.assign(compMat.uniforms,{uShT:{value:new THREE.Vector3(1,1,1)},uHiT:{value:new THREE.Vector3(1,1,1)},uCon:{value:1},uVib:{value:0}});
compMat.fragmentShader=compMat.fragmentShader.replace('uniform float uDpr;','uniform float uDpr;uniform vec3 uShT;uniform vec3 uHiT;uniform float uCon;uniform float uVib;')
 .replace('vec2 q=(vUv-.5)*vec2(uRes.x/uRes.y,1.);',`{float lg=dot(c,vec3(.2126,.7152,.0722));c*=mix(uShT,uHiT,smoothstep(.12,.82,lg));c=(c-.5)*uCon+.5;
   float mxc=max(c.r,max(c.g,c.b)),mnc=min(c.r,min(c.g,c.b));float lg2=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(lg2),c,1.+uVib*(1.-clamp((mxc-mnc)*1.6,0.,1.)));c=clamp(c,0.,1.);}
  vec2 q=(vUv-.5)*vec2(uRes.x/uRes.y,1.);`);
compMat.needsUpdate=true;
// [cień rgb, światło rgb, kontrast, żywość]
const LOOK={lato:[[.97,1.,1.03],[1.04,1.015,.95],1.05,.2],jesien:[[1.,.96,1.02],[1.07,1.,.86],1.06,.16],zima:[[.94,.98,1.07],[.98,1.,1.04],1.,-.08],wiosna:[[.97,1.01,1.02],[1.01,1.04,.97],1.03,.24],
 deszcz:[[.95,.99,1.05],[.96,.99,1.02],.94,-.2],burza:[[.92,.96,1.06],[.95,.98,1.02],1.02,-.25],mgla:[[1.04,1.05,1.06],[.98,.99,1.],.86,-.25],susza:[[1.02,.98,.94],[1.08,1.02,.88],1.08,.05],snieg:[[.95,.99,1.08],[1.,1.01,1.03],.97,-.12],
 noc:[[.9,.96,1.12],[1.,1.,1.02],1.02,-.1]};
const _lk=[[0,0,0],[0,0,0],0,0];
function lkMix(o,a,w){for(let i=0;i<2;i++)for(let k=0;k<3;k++)o[i][k]+=(a[i][k]-1)*w;o[2]+=(a[2]-1)*w;o[3]+=a[3]*w}
{const _l=lighting;lighting=function(){const Lt=_l();if(!S)return Lt;
  const yd=yday(),seas=[['lato',0],['jesien',24],['zima',48],['wiosna',72]];const o=[[1,1,1],[1,1,1],1,0];
  // płynne przejścia: każda pora waży wg odległości od swojego środka
  let tw=0;const ws=seas.map(([k,s])=>{let d=Math.abs(((yd-(s+12))%96+96+48)%96-48);const w=Math.max(0,1-Math.max(0,d-8)/8);tw+=w;return[k,w]});
  ws.forEach(([k,w])=>{if(w>0)lkMix(o,LOOK[k],w/tw)});
  if(WX.rain>.005)lkMix(o,LOOK.deszcz,Math.min(1,WX.rain*1.3)*(1-WX.dark)*.85);if(WX.dark>.005)lkMix(o,LOOK.burza,WX.dark*.85);if(WX.fog>.005)lkMix(o,LOOK.mgla,WX.fog*.85);if(WX.heat>.005)lkMix(o,LOOK.susza,WX.heat*.85);if(WX.snow>.005)lkMix(o,LOOK.snieg,Math.min(1,WX.snow*1.4)*.85);if(WX.rime>.005)lkMix(o,LOOK.zima,WX.rime*.35);
  if(Lt.night>0)lkMix(o,LOOK.noc,Lt.night*.8);
  const U=compMat.uniforms;U.uShT.value.set(...o[0]);U.uHiT.value.set(...o[1]);U.uCon.value=o[2];U.uVib.value=o[3];G18.look=o;
  return Lt}}

// ================= KROK 5a: nowi ludzie — gładkie bryły, stroje, twarze; 5 wywołań rysowania na osobę =================
const MD={mat:new THREE.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:0}),m4:new THREE.Matrix4(),q:new THREE.Quaternion(),e:new THREE.Euler(),v:new THREE.Vector3(),s:new THREE.Vector3()};
function mdM(x,y,z,rx,ry,rz,sx,sy,sz){MD.e.set(rx||0,ry||0,rz||0);MD.q.setFromEuler(MD.e);MD.v.set(x||0,y||0,z||0);MD.s.set(sx||1,sy===undefined?(sx||1):sy,sz===undefined?(sx||1):sz);return new THREE.Matrix4().compose(MD.v,MD.q,MD.s)}
function mdCol(c){return c&&c.isColor?c:new THREE.Color(c)}
// części: [geometria, kolor, macierz]
function mdMerge(parts){let n=0;const gs=parts.map(([g,c,m])=>{let q=g.index?g.toNonIndexed():g.clone();if(m)q.applyMatrix4(m);if(!q.attributes.normal)q.computeVertexNormals();n+=q.attributes.position.count;return[q,mdCol(c)]});
 const P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);let o=0;
 for(const[q,c]of gs){const p=q.attributes.position.array,nn=q.attributes.normal.array,k=q.attributes.position.count;P.set(p,o*3);N.set(nn,o*3);for(let i=0;i<k;i++){C[(o+i)*3]=c.r;C[(o+i)*3+1]=c.g;C[(o+i)*3+2]=c.b}o+=k;q.dispose()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingSphere();return g}
function mdLathe(pts,seg){return new THREE.LatheGeometry(pts.map(([r,y])=>new THREE.Vector2(r,y)),seg||12)}
const MDG={};function mdG(k,f){return MDG[k]||(MDG[k]=f())}
const EMB=[0x8a2a22,0x6a2a1a,0x2a3a6a,0x7a5a1a];
function makePerson18(p){const g=new THREE.Group();const k=p.sex==='k',adult=p.age>=12,old=p.age>55,id=p.id;
 const skin=mdCol(skinC[(p.rod||p.fam||id)%4]),cloth=mdCol(p.cloth),hair=mdCol(old?hairC[4]:hairC[id%4]);
 const linen=mdCol(0xd8ccb0),pants=mdCol(k?0x5a4a3e:(id%3?0x4a463c:0x6a5a44)),emb=mdCol(EMB[(p.rod||p.fam||id)%4]),shoe=mdCol(id%2?0x8a6a44:0x5a4630),belt=mdCol(id%3===0?0x8a2a22:0x3a2c1e);
 // tułów z głową (jedna bryła), punkt obrotu w biodrach
 const T=[];const h0=.5;
 if(k){T.push([mdLathe([[.0,.06],[.205,.06],[.19,.16],[.165,.3],[.13,.46],[.118,.54],[.13,.62],[.14,.68],[.135,.74],[.1,.79],[.05,.82],[0,.83]].map(([r,y])=>[r,y-h0]),14),cloth]);
  T.push([new THREE.CylinderGeometry(.208,.208,.03,14,1,true),emb,mdM(0,.08-h0,0)]);
  if(adult&&id%3!==2){const ac=mdCol(id%2?0xb8ac90:0x5a4a3a);T.push([new THREE.CylinderGeometry(.13,.178,.34,10,6,true,-.75,1.5),ac,mdM(0,.37-h0,.006)]);T.push([new THREE.CylinderGeometry(.18,.18,.018,10,1,true,-.75,1.5),emb,mdM(0,.21-h0,.006)])}}
 else{T.push([mdLathe([[0,.37],[.16,.37],[.15,.44],[.122,.52],[.135,.6],[.148,.68],[.14,.75],[.1,.8],[.05,.83],[0,.84]].map(([r,y])=>[r,y-h0]),14),cloth]);
  T.push([new THREE.CylinderGeometry(.162,.162,.025,14,1,true),emb,mdM(0,.385-h0,0)]);}
 T.push([new THREE.CylinderGeometry(k?.122:.128,k?.124:.13,.04,14),belt,mdM(0,(k?.55:.52)-h0,0)]);
 T.push([new THREE.CylinderGeometry(.052,.05,.03,10,1,true),emb,mdM(0,.81-h0,0)]);
 [-1,1].forEach(s=>T.push([new THREE.SphereGeometry(.056,10,8),cloth,mdM(s*.15,.755-h0,0,0,0,0,1,.85,1)]));
 // szyja i głowa
 T.push([new THREE.CylinderGeometry(.04,.046,.07,10),skin,mdM(0,.84-h0,0)]);
 const hy=.935-h0;T.push([new THREE.SphereGeometry(.098,16,12),skin,mdM(0,hy,0,0,0,0,.94+(id%5)*.03,adult?1.08+(id%3)*.035:1.2,.95+(id%4)*.025)]);
 T.push([new THREE.SphereGeometry(.016,8,6),skin,mdM(0,hy-.012,.095,0,0,0,1,1.2,1.1)]);
 [-1,1].forEach(s=>{T.push([new THREE.SphereGeometry(.008,6,5),mdCol(0x1c1612),mdM(s*.034,hy+.018,.086)]);T.push([new THREE.SphereGeometry(.02,6,5),skin,mdM(s*.097,hy,0,0,0,0,.6,1,1)])});
 T.push([new THREE.SphereGeometry(.022,6,4),mdCol(0x9a5a4a),mdM(0,hy-.05,.082,0,0,0,1.3,.4,.6)]);
 // włosy, chusty, brody, kapelusze
 if(k){const covered=adult&&id%3!==1;
  if(covered){const ch=mdCol(PM.chusta[id%5].color);T.push([new THREE.SphereGeometry(.112,16,10,0,6.283,0,1.8),ch,mdM(0,hy+.005,-.008,-.15)]);T.push([new THREE.ConeGeometry(.05,.1,6),ch,mdM(0,hy-.07,-.1,.5)]);T.push([new THREE.CylinderGeometry(.115,.12,.02,14,1,true),emb,mdM(0,hy+.04,-.005,-.15)]);}
  else{T.push([new THREE.SphereGeometry(.104,16,10,0,6.283,0,1.6),hair,mdM(0,hy+.01,-.008,-.2)]);T.push([new THREE.CylinderGeometry(.026,.016,.32,8),hair,mdM(0,hy-.2,-.1,.12)]);T.push([new THREE.SphereGeometry(.024,6,5),mdCol(0x8a2a22),mdM(0,hy-.36,-.12)])}}
 else{T.push([new THREE.SphereGeometry(.104,16,10,0,6.283,0,1.45),hair,mdM(0,hy+.006,-.012,-.25)]);
  if(adult&&p.age>=24&&id%3!==0){const bc=mdCol(PM.beard[old?3:id%3].color);T.push([new THREE.SphereGeometry(.078,12,8),bc,mdM(0,hy-.06,.035,0,0,0,1,.95,.75)]);T.push([new THREE.SphereGeometry(.03,8,5),bc,mdM(0,hy-.025,.088,0,0,0,1.6,.5,.6)])}
  if(adult&&id%2===0){const hc=mdCol(id%4===0?0x5a4630:0x6e6252);T.push([new THREE.CylinderGeometry(.17,.17,.018,16),hc,mdM(0,hy+.07,0)]);T.push([mdLathe([[.095,0],[.1,.05],[.09,.1],[.05,.115],[0,.118]],14),hc,mdM(0,hy+.075,0)])}
  else if(adult&&id%5===1){T.push([mdLathe([[.112,0],[.115,.06],[.1,.11],[.05,.13],[0,.13]],14),mdCol(0x6a5038),mdM(0,hy+.02,0)])}}
 if(adult&&id%4===2){T.push([new THREE.BoxGeometry(.03,.42,.02),mdCol(0x5a4026),mdM(.03,.62-h0,.125,0,0,.62)]);T.push([new THREE.BoxGeometry(.14,.13,.07),mdCol(0x7a5a3a),mdM(.14,.46-h0,.1)])}
 const torso=new THREE.Mesh(mdMerge(T),MD.mat);torso.position.y=h0;
 // ręce: rękaw, łokieć lekko zgięty, dłoń
 const arm=s=>{const upper=new THREE.Mesh(mdMerge([[new THREE.CylinderGeometry(.044,.038,.18,8),cloth,mdM(0,-.09,0)],[new THREE.SphereGeometry(.039,8,6),cloth,mdM(0,-.18,0)]]),MD.mat);
 const lower=new THREE.Mesh(mdMerge([[new THREE.CylinderGeometry(.037,.032,.15,8),cloth,mdM(0,-.075,.018,-.15)],[new THREE.CylinderGeometry(.04,.04,.02,8,1,true),emb,mdM(0,-.14,.035)],[new THREE.SphereGeometry(.033,8,6),skin,mdM(0,-.175,.045,0,0,0,.9,1.15,.8)]]),MD.mat);lower.position.y=-.18;upper.add(lower);upper.userData.joint=lower;upper.position.set(s*(.158+(id%5)*.005),.76,0);return upper};
 const aL=arm(-1),aR=arm(1),bodyWidth=.94+((p.rod||p.fam||id)%5)*.035;torso.scale.x=bodyWidth;aL.position.x*=bodyWidth;aR.position.x*=bodyWidth;
 // nogi: udo, łydka w onucach, łapcie
 const leg=s=>{const upper=new THREE.Mesh(mdMerge([[new THREE.CylinderGeometry(.06,.05,.25,8),pants,mdM(0,-.125,0)],[new THREE.SphereGeometry(.05,8,6),pants,mdM(0,-.25,0)]]),MD.mat),parts=[[new THREE.CylinderGeometry(.049,.04,.21,8),k?pants:linen,mdM(0,-.105,0)],[new THREE.SphereGeometry(.05,8,6),shoe,mdM(0,-.22,.03,0,0,0,.95,.6,1.55)]];
 if(!k)[.06,.12,.18].forEach(y=>parts.push([new THREE.CylinderGeometry(.05,.05,.012,8,1,true),belt,mdM(0,-y,0)]));const lower=new THREE.Mesh(mdMerge(parts),MD.mat);lower.position.y=-.25;upper.add(lower);upper.userData.joint=lower;upper.position.set(s*.066,.5,0);return upper};
 const lL=leg(-1),lR=leg(1);
 [torso,aL,aR,lL,lR].forEach(m=>m.traverse(part=>{part.castShadow=true;part.receiveShadow=true}));
 g.add(torso,aL,aR,lL,lR);
 const carry=new THREE.Mesh(mdG('carry',()=>new THREE.BoxGeometry(.24,.16,.22)),M(0x8a6a40));carry.position.set(0,.72,.2);carry.visible=false;carry.castShadow=true;g.add(carry);
 const sh=new THREE.Mesh(mdG('psh',()=>new THREE.PlaneGeometry(.8,.8)),shadowMat);sh.rotation.x=-Math.PI/2;sh.position.y=.03;g.add(sh);
 const ring=new THREE.Mesh(mdG('pring',()=>new THREE.RingGeometry(.32,.4,24)),new THREE.MeshBasicMaterial({color:0xf4ead0,transparent:true,opacity:.95,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;g.add(ring);
 g.traverse(o=>{o.userData.pid=p.id});
 g.userData={pid:p.id,carry,torso,lL,lR,aL,aR,ring,elbowL:aL.userData.joint,elbowR:aR.userData.joint,kneeL:lL.userData.joint,kneeR:lR.userData.joint,sc:0,p18:1};return g}
const makePersonLow=makePersonMesh;
{const _mp=makePersonMesh;makePersonMesh=function(p){if(GFX.level===0&&!window.__p18)return _mp(p);try{return makePerson18(p)}catch(e){console.warn(e);return _mp(p)}}}
// ================= KROK 5b: drzewa — sosna z koroną w górze, świerk z postrzępionymi piętrami, dęby i brzozy z kępami liści =================
function t3n(x,y,z){const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s)}
function sn3(x,y,z){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz;const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz);
 const L=(a,b,t)=>a+(b-a)*t;const c=(i,j,k)=>t3n(ix+i,iy+j,iz+k);
 return L(L(L(c(0,0,0),c(1,0,0),u),L(c(0,1,0),c(1,1,0),u),v),L(L(c(0,0,1),c(1,0,1),u),L(c(0,1,1),c(1,1,1),u),v),w)}
// kępa liści: kula zniekształcona szumem, ciemniejsza od spodu i w głębi
function tClump(r,seg,amp,seed,sx,sy,sz,c0){const g=new THREE.SphereGeometry(r,seg,Math.max(4,seg-2));const p=g.attributes.position,n=p.count,col=new Float32Array(n*3);
 for(let i=0;i<n;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const l=Math.hypot(x,y,z)||1;const d=1+amp*(sn3(x/l*2.2+seed,y/l*2.2+seed*1.7,z/l*2.2-seed)-.5)*2+amp*.5*(sn3(x/l*5+seed,y/l*5,z/l*5)-.5);
  p.setXYZ(i,x*d*(sx||1),y*d*(sy||1),z*d*(sz||1));const h=(y/l+1)/2;const k=(.72+.34*h)*(.86+.28*(d-1+.5));col[i*3]=c0[0]*k;col[i*3+1]=c0[1]*k;col[i*3+2]=c0[2]*k}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();return g}
// stożek świerka z postrzępionym, opadającym brzegiem
function tTier(r,h,seg,droop,c0){const g=new THREE.ConeGeometry(r,h,seg,2);const p=g.attributes.position,n=p.count,col=new Float32Array(n*3);
 for(let i=0;i<n;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const rr=Math.hypot(x,z);if(y<-h/2+1e-3&&rr>1e-4){const a=Math.atan2(z,x);const j=Math.round(a/(Math.PI*2/seg));const tip=(j&1)?.74:1.08;x*=tip;z*=tip;y-=(j&1)?0:droop}
  else if(Math.abs(y)<h*.26&&rr>1e-4){x*=1.06;z*=1.06}
  p.setXYZ(i,x,y,z);const hh=(y+h/2)/h;const k=.66+.4*hh;col[i*3]=c0[0]*k;col[i*3+1]=c0[1]*k;col[i*3+2]=c0[2]*k}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();return g}
function tMerge(list){let n=0;const gs=list.map(([g,m])=>{const q=g.index?g.toNonIndexed():g;if(m)q.applyMatrix4(m);n+=q.attributes.position.count;return q});
 const P=new Float32Array(n*3),N=new Float32Array(n*3),C=new Float32Array(n*3);let o=0;for(const q of gs){P.set(q.attributes.position.array,o*3);N.set(q.attributes.normal.array,o*3);
  if(q.attributes.color)C.set(q.attributes.color.array,o*3);else C.fill(1,o*3,(o+q.attributes.position.count)*3);o+=q.attributes.position.count}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));g.computeBoundingSphere();return g}
function tBark(r0,r1,h,seg,c0,branches){const L=[];const g=new THREE.CylinderGeometry(r1,r0,h,seg,3);g.translate(0,h/2,0);const p=g.attributes.position,col=new Float32Array(p.count*3);
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const w=1+.12*(sn3(x*9,y*3,z*9)-.5);p.setXYZ(i,x*w,y,z*w);const k=.82+.3*sn3(x*14,y*6,z*14);col[i*3]=c0[0]*k;col[i*3+1]=c0[1]*k;col[i*3+2]=c0[2]*k}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();L.push([g]);
 (branches||[]).forEach(([y,a,len,r,tilt])=>{const b=new THREE.CylinderGeometry(r*.5,r,len,5);b.translate(0,len/2,0);const bc=new Float32Array(b.attributes.position.count*3);for(let i=0;i<bc.length;i+=3){bc[i]=c0[0]*.9;bc[i+1]=c0[1]*.9;bc[i+2]=c0[2]*.9}b.setAttribute('color',new THREE.BufferAttribute(bc,3));
  L.push([b,mdM(0,y,0,0,a,0).multiply(mdM(0,0,0,0,0,-tilt))])});return tMerge(L)}
const TG={};
{const W=[1,1,1];
 // sosna zwyczajna: wysoki pień, płaska korona z kilku kęp
 TG.pine=tMerge([[tClump(.62,9,.22,1.3,1,.5,1,[1.0,1.06,1.0]),mdM(0,2.55,0)],[tClump(.48,8,.24,2.1,1,.55,1,[1.1,1.16,1.08]),mdM(.42,2.85,.2)],[tClump(.46,8,.24,3.4,1,.5,1,[1.04,1.1,1.04]),mdM(-.4,2.75,-.24)],
  [tClump(.4,7,.25,4.2,1,.55,1,[1.2,1.24,1.16]),mdM(.05,3.1,-.1)],[tClump(.36,7,.25,5.7,1,.5,1,[.98,1.04,1]),mdM(-.15,2.3,.42)],[tClump(.3,7,.25,6.6,1,.5,1,[.95,1,.96]),mdM(.3,2.15,-.4)]]);
 TG.pineT=tBark(.12,.06,2.7,7,[1.15,.78,.55],[[2.1,.4,.55,.04,.9],[2.35,2.6,.5,.035,1],[1.9,4.4,.45,.035,.95]]);
 // świerk: siedem postrzępionych pięter
 const sp=[];[[.78,.95,.62],[.7,.9,.98],[.62,.86,1.36],[.54,.8,1.74],[.45,.74,2.1],[.35,.66,2.45],[.24,.56,2.78],[.12,.45,3.08]].forEach(([r,h,y],k)=>{const c=.62+k*.055;sp.push([tTier(r,h,12,.12,[c,c*1.06,c*1.03]),mdM(0,y,0,0,k*.7,0)])});TG.spruce=tMerge(sp);
 // dąb: szeroka korona z kęp
 TG.oak=tMerge([[tClump(.72,9,.2,1.1,1.15,.78,1.05,[.86,.92,.86]),mdM(0,1.9,0)],[tClump(.52,8,.24,2.3,1,.85,1,[1,1.04,.98]),mdM(.42,2.32,.2)],[tClump(.5,8,.24,3.1,1,.85,1,[.8,.86,.8]),mdM(-.52,2.05,-.16)],
  [tClump(.46,8,.24,4.4,1,.85,1,[.74,.8,.74]),mdM(.5,1.7,-.4)],[tClump(.42,8,.24,5.2,1,.85,1,[1.04,1.06,1]),mdM(-.2,2.62,-.08)],[tClump(.42,8,.24,6.1,1,.85,1,[.82,.88,.82]),mdM(-.08,1.88,.6)],[tClump(.34,7,.26,7.3,1,.85,1,[.95,1,.95]),mdM(.15,2.15,-.62)]]);
 TG.oakT=tBark(.18,.1,1.55,8,W,[[1.3,.3,.75,.07,.75],[1.25,2.6,.7,.065,.8],[1.4,4.6,.6,.06,.7]]);
 // brzoza: smukłe, wiszące kępy
 TG.birch=tMerge([[tClump(.36,8,.22,1.7,1,1.35,1,[.9,.95,.88]),mdM(0,2.05,0)],[tClump(.3,8,.22,2.8,1,1.45,1,W),mdM(.13,2.58,.08)],[tClump(.28,7,.24,3.9,1,1.3,1,[.82,.88,.8]),mdM(-.22,1.74,-.1)],
  [tClump(.25,7,.24,4.6,1,1.35,1,[.86,.9,.84]),mdM(.26,2.2,-.2)],[tClump(.22,7,.24,5.9,1,1.4,1,[.92,.96,.9]),mdM(-.12,2.42,.22)]]);}
function treeSwap(){for(const sp in TG){if(sp.endsWith('T'))continue;const cm=crownM[sp];if(!cm||cm.userData.t18)continue;cm.geometry=TG[sp];cm.userData.t18=1;
  const tk=TG[sp+'T'],tm=trunkM[sp];if(tk&&tm){tm.geometry=tk;tm.material.vertexColors=true;if(sp==='pine')tm.material.color.setHex(0x7a5236);tm.material.flatShading=false;tm.material.needsUpdate=true}}}
try{treeSwap()}catch(e){console.warn('drzewa',e)}

// ================= KROK 5c: domy z prawdziwych bali, grube strzechy =================
const mBal=[0x8a6a46,0x7a5c3c,0x6e5236].map(c=>TM(TX.planks,c));const mBalEnd=M(0xa88a62);
{const _lh=logHouse;logHouse=function(g,w,d,h,opt){const n0=g.children.length;_lh(g,w,d,h,opt);if(GFX.level===0)return;
  // znajdź i zastąp płaską ścianę z bali (pierwszy prostopadłościan o wymiarach ściany)
  for(let i=n0;i<g.children.length;i++){const c=g.children[i];const p=c.geometry&&c.geometry.parameters;if(p&&Math.abs(p.width-w)<1e-6&&Math.abs(p.height-h)<1e-6&&Math.abs(p.depth-d)<1e-6){
   c.scale.set((w-.16)/w,1,(d-.16)/d);c.material=matDark;
   const r=.1,step=.19,y0=.3+r*.9;let row=0;for(let y=y0;y<.3+h-r*.4;y+=step,row++){const off=row%2?step/2:0;
    const lx=cyl(r,w+.26,balM((row+1)%3),0,y+off*0,0,0,0,Math.PI/2,8);lx.position.z=d/2-r*.6;g.add(lx);const lx2=lx.clone();lx2.position.z=-d/2+r*.6;lx2.material=balM(row%3);g.add(lx2);
    const lz=cyl(r,d+.26,balM(row%3),w/2-r*.6,y+step/2,0,Math.PI/2,0,0,8);if(y+step/2<.3+h-r*.3){g.add(lz);const lz2=lz.clone();lz2.position.x=-w/2+r*.6;lz2.material=balM((row+2)%3);g.add(lz2)}}
   break}}
  // usuń stare krótkie końcówki bali, nowe bale wystają same
  for(let i=g.children.length-1;i>=n0;i--){const c=g.children[i];const p=c.geometry&&c.geometry.parameters;if(c.material===matLog&&p&&p.height===.34&&p.radiusTop===.075)g.remove(c)}}}
{const _ga=gable;gable=function(w,d,h,mat,y,over,sc){const grp=_ga(w,d,h,mat,y,over,sc);if(GFX.level===0)return grp;const R=grp.userData.ridge;
  const thatch=mat===mThatch||mat===mThatchOld;if(!thatch&&mat!==mShingle)return grp;
  const rr=thatch?.085:.04;const W=R.W,D=R.D;
  for(const s of[-1,1]){const e=cyl(rr,D*2+.06,mat,s*W*.99,y+rr*.3,0,Math.PI/2,0,0,8);grp.add(e)}
  const sl=Math.hypot(W,h),ang=Math.atan2(h,W);
  for(const s of[-1,1])for(const t of[-1,1]){const v=cyl(rr*.8,sl+.04,thatch?mat:matLog2,s*W/2,y+h/2,t*(D-.01),0,0,s*(Math.PI/2-ang),6);grp.add(v)}
  if(thatch){const cap=cyl(.12,D*2+.14,mat,0,y+h+.02,0,Math.PI/2,0,0,8);cap.scale.set(1,1,.7);grp.add(cap)}
  return grp}}

// ================= wydajność: rysujemy tylko to, co w kadrze (wycinanie pojedynczych drzew, krzaków, kępek) =================
const CULL={list:[],t:-9,v:new THREE.Vector3(),key:''};
function cullAdd(src){if(!src||!src.isInstancedMesh||src.userData.cull||src.userData.lod)return;   /* 4.5: siatki z oknem wokół kamery (p_lod) wycinają kadr same */const dst=new THREE.InstancedMesh(src.geometry,src.material,src.count);
 dst.castShadow=src.castShadow;dst.receiveShadow=src.receiveShadow;dst.frustumCulled=false;dst.count=0;dst.renderOrder=src.renderOrder;
 if(src.instanceColor)dst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(src.count*3),3);
 src.layers.set(31);src.userData.cull=dst;dst.userData.src=src;(src.parent||scene).add(dst);CULL.list.push(src)}
function cullUpdate(force){const v=CULL.v;cam.updateMatrixWorld();
 for(const src of CULL.list){const dst=src.userData.cull;dst.visible=src.visible;if(dst.geometry!==src.geometry)dst.geometry=src.geometry;if(dst.material!==src.material)dst.material=src.material;
  if(!src.visible)continue;const A=src.instanceMatrix.array,B=dst.instanceMatrix.array,CA=src.instanceColor&&src.instanceColor.array,CB=dst.instanceColor&&dst.instanceColor.array;let n=0;
  for(let i=0;i<src.count;i++){const o=i*16;if(A[o]===0&&A[o+5]===0&&A[o+10]===0)continue;v.set(A[o+12],A[o+13],A[o+14]).project(cam);if(v.x<-1.3||v.x>1.3||v.y<-1.45||v.y>1.3)continue;
   for(let k=0;k<16;k++)B[n*16+k]=A[o+k];if(CA){CB[n*3]=CA[i*3];CB[n*3+1]=CA[i*3+1];CB[n*3+2]=CA[i*3+2]}n++}
  dst.count=n;dst.instanceMatrix.needsUpdate=true;if(CB)dst.instanceColor.needsUpdate=true}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;
  if(!CULL.init){CULL.init=1;try{for(const sp in crownM){cullAdd(crownM[sp]);cullAdd(trunkM[sp])}[bushes,berries,rocks,mushM,zbozeM,lenM,ziolaM].forEach(cullAdd);decoMeshes.forEach(m=>{if(m.count>200)cullAdd(m)})}catch(e){console.warn('cull',e)}}
  const key=[camT.x,camT.z,zoom,yaw].map(x=>Math.round(x*8)).join(',')+(CULL.list.map(s=>s.instanceMatrix.version+(s.instanceColor?s.instanceColor.version:0)).join('.'));
  if(key!==CULL.key&&clock-CULL.t>.12||clock-CULL.t>2){CULL.key=key;CULL.t=clock;cullUpdate()}}}
window.__cull=CULL;

// ---------- bezpiecznik: pojedyncze piksele bez liczby (NaN/Inf) nie mogą rozlać się w czarne plamy ----------
brightMat.fragmentShader=brightMat.fragmentShader.replace('float l=max(c.r,max(c.g,c.b));','if(any(isnan(c))||any(isinf(c)))c=vec3(0.);c=min(c,vec3(64.));float l=max(c.r,max(c.g,c.b));');brightMat.needsUpdate=true;
blurMat.fragmentShader=blurMat.fragmentShader.replace('gl_FragColor=vec4(c,1.);}','if(any(isnan(c))||any(isinf(c)))c=vec3(0.);gl_FragColor=vec4(c,1.);}');blurMat.needsUpdate=true;
compMat.fragmentShader=compMat.fragmentShader.replace('vec3 c=texture2D(tCol,vUv).rgb;','vec3 c=texture2D(tCol,vUv).rgb;if(any(isnan(c))||any(isinf(c)))c=vec3(0.);').replace('c+=texture2D(tBl,vUv).rgb*uBloom;','{vec3 bl=texture2D(tBl,vUv).rgb;if(!(any(isnan(bl))||any(isinf(bl))))c+=bl*uBloom;}');compMat.needsUpdate=true;

// ujemne barwy przed tonowaniem też zerujemy
compMat.fragmentShader=compMat.fragmentShader.replace('c=toS(aces(c));','c=toS(aces(max(c,vec3(0.))));');compMat.needsUpdate=true;


// ================= 1.9 Budynki z charakterem: każdy dom inny, słowiańskie detale =================
let STY=null;
const TXN=ctex(128,128,(x,w,h)=>{const n=4,ph=h/n;for(let i=0;i<n;i++){const b=205+RT()*30;x.fillStyle=`rgb(${b|0},${b|0},${b|0})`;x.fillRect(0,i*ph,w,ph);
 x.strokeStyle='rgba(60,60,60,.22)';for(let k=0;k<7;k++){x.beginPath();const yy=i*ph+2+RT()*(ph-4);x.moveTo(0,yy);x.bezierCurveTo(w*.3,yy+3,w*.6,yy-3,w,yy+1);x.stroke()}
 x.fillStyle='rgba(40,40,40,.35)';x.fillRect(0,i*ph,w,1.5);for(let k=0;k<2;k++){x.fillStyle='rgba(50,50,50,.35)';x.beginPath();x.ellipse(RT()*w,i*ph+ph*.5,2.5,1.6,0,0,6.3);x.fill()}}});
TXN.repeat.set(1,1);
const PAL={nat:[0x9a7652,0x8a6846,0x7a5c3c],dark:[0x5a4430,0x4e3a2a,0x463424],grey:[0xa8a296,0x9a948a,0x8c877e],white:[0xf4f6f4,0xeceeee,0xe6eaee]};
const PALM={};function palMats(k){return PALM[k]||(PALM[k]=PAL[k].map(c=>new THREE.MeshStandardMaterial({map:TXN,color:c,roughness:.92})))}
function balM(i){return palMats(STY&&STY.pal||'nat')[i%3]}
const mBoards=TM(TX.planks,0x9a8670),mSod=TM(TX.thatch,0x7c9a4e),mDarkThatch=TM(TX.thatch,0x6a5e44),mPlankW=new THREE.MeshStandardMaterial({map:TXN,color:0xf0f2f0,roughness:.92}),mPlankGr=new THREE.MeshStandardMaterial({map:TXN,color:0xa29c90,roughness:.92});
const SHC={};function shutM(c){return SHC[c]||(SHC[c]=TM(TX.planks,c))}
const mPot=M(0x9a5a34,{flatShading:false,roughness:.7}),mPot2=M(0x6a4a3a,{flatShading:false,roughness:.6}),mHerb=M(0x6a7a3a),mGarlic=M(0xe8e0cc);
function styPick(r,list){let t=0;list.forEach(x=>t+=x[1]);let v=r()*t;for(const x of list){if(v<x[1])return x[0];v-=x[1]}return list[0][0]}
// wykonanie: 1 surowe, 2 porządne, 3 mistrzowskie (poziom budynku, a dla domów rodzaj i rozbudowy)
function qOf(kind,bb){if(kind==='szalas')return 1;if(kind==='dom')return 3;if(kind==='chata')return bb&&bb.ext&&bb.ext.length>=2?3:2;
 if(BD[kind]&&(BD[kind].wk||BD[kind].store)&&kind!=='pole')return bb?Math.min(3,lvOf(bb)):1;return 2}
function styFor(kind,bb){const r=rng(((bb&&bb.id)||((Math.random()*1e6)|0))*104729+kind.length*131+7);const house=kind==='chata'||kind==='dom';const q=qOf(kind,bb);
 let pal=['kuznia','laznia','mielerz','drwal'].includes(kind)?(r()<.7?'dark':'nat'):house?styPick(r,[['nat',.4],['white',.3],['grey',.15],['dark',.15]]):styPick(r,[['nat',.5],['grey',.25],['dark',.2],['white',.05]]);
 if(q===1)pal=r()<.6?'dark':r()<.5?'grey':'nat';if(q===3&&!['kuznia','laznia','mielerz'].includes(kind))pal=r()<.5?'white':'nat';
 let roof=house?styPick(r,[[mShingle,.32],[mThatch,.3],[mThatchOld,.12],[mBoards,.14],[mSod,.12]]):styPick(r,[[mThatch,.3],[mThatchOld,.2],[mBoards,.2],[mShingle,.12],[mSod,.18]]);
 if(q===1)roof=styPick(r,[[mThatchOld,.4],[mSod,.35],[mThatch,.25]]);else if(q===3&&!house)roof=styPick(r,[[mShingle,.45],[mBoards,.25],[mThatch,.3]]);
 let sh=house||r()<.4?styPick(r,[[0x4a6a8a,.3],[0x3e5a74,.15],[0x5a7a4a,.2],[0x8a3a2a,.15],[0x6a5a8a,.08],[0,.12]]):0;
 if(q===1)sh=0;else if(q===3&&!sh)sh=styPick(r,[[0x4a6a8a,.4],[0x5a7a4a,.3],[0x8a3a2a,.3]]);
 const roof2=kind==='kuznia'?mDarkThatch:(kind==='dom'||kind==='domwsp')?(r()<.62?mShingle:mBoards):roof;
 return{r,kind,q,pal,roof:roof2,sh,pitch:.85+r()*.42,over:(q===1?.16:.22)+r()*.22,jw:(q===3?.97:.93)+r()*.06,jh:(q===1?.88:q===3?.98:.92)+r()*.14,dx:(r()-.5)*.5,
  koniki:q>=3||kind==='domwsp'||(q===2&&r()<(house?.6:.3)),ganek:q>=2&&(house?r()<(q===3?.85:.45):q===3&&r()<.4),lean:r()<(house?.45:.3),pots:q>=2&&r()<(house?.55:.25),herbs:r()<(q===1?.6:.4),bench:q>=2&&r()<.5,trims:q>=3,gables:[],house:null}}
const ROOFS=[mThatch,mThatchOld,mShingle];
{const _lh=logHouse;logHouse=function(g,w,d,h,opt){opt=Object.assign({},opt||{});const S0=STY;
  if(S0&&!S0.house){w*=S0.jw;h*=S0.jh;opt.rh=(opt.rh||h*.85)*S0.pitch;if(opt.over===undefined)opt.over=S0.over;if(!opt.roof||ROOFS.includes(opt.roof))opt.roof=S0.roof;if(opt.dx===undefined)opt.dx=S0.dx;
   S0.house={w,d,h,rh:opt.rh,dx:opt.dx||0,y0:.3,type:'log'}}
  return _lh(g,w,d,h,opt)}}
{const _ph=plankHut;plankHut=function(g0,w,d,h,opt){opt=Object.assign({},opt||{});const S0=STY;let rec=null;
  if(S0&&!S0.house){w*=S0.jw;h*=S0.jh;opt.rh=(opt.rh||h*.8)*S0.pitch;if(opt.over===undefined)opt.over=S0.over;if(!opt.roof||ROOFS.includes(opt.roof))opt.roof=S0.roof;rec={w,d,h,rh:opt.rh,dx:opt.dx||0,y0:.16,type:'plank'};S0.house=rec}
  const g=_ph(g0,w,d,h,opt);
  if(S0&&(S0.pal==='white'||S0.pal==='grey'))g.traverse(o=>{const p=o.geometry&&o.geometry.parameters;if(o.isMesh&&(o.material===mPlank||o.material===mPlankG)&&p&&p.height>.6)o.material=S0.pal==='white'?mPlankW:mPlankGr});
  if(rec)rec.grp=g;return g}}
{const _sh=shed;shed=function(g,w,d,h,roof){if(STY&&(!roof||ROOFS.includes(roof)))roof=STY.roof;return _sh(g,w,d,h*(STY?STY.jh:1),roof)}}
{const _ga=gable;gable=function(w,d,h,mat,y,over,sc){const grp=_ga(w,d,h,mat,y,over,sc);if(STY)STY.gables.push({grp,w,d,h,mat});return grp}}
{const _wi=win;win=function(g,x,y,z,ry){_wi(g,x,y,z,ry);const wg=g.children[g.children.length-1];if(STY&&STY.sh&&wg)wg.traverse(o=>{if(o.isMesh&&o.material===mPlankD)o.material=shutM(STY.sh)})}}
{const _do=door;door=function(g,x,z,ry,w,h){const d=_do(g,x,z,ry,w,h);if(STY&&STY.sh&&STY.r()<.6&&d)d.traverse(o=>{if(o.isMesh&&o.material===mPlankD)o.material=shutM(STY.sh)});return d}}
// koniki na szczycie dachu
function koniki(gb){const R=gb.grp.userData.ridge;if(!R)return;const y=R.y,D=R.D,ang=Math.atan2(R.h,R.W);const mt=matLog2;
 for(const z of[-D-.02,D+.02])for(const s of[-1,1]){const b=tbox(.05,.62,.04,mt,s*.1,y+.12,z);b.rotation.z=s*-(Math.PI/2-ang)*.55;gb.grp.add(b);
  const hd=tbox(.16,.07,.045,mt,s*.27,y+.38,z);hd.rotation.z=s*-.5;gb.grp.add(hd);const ear=tbox(.03,.06,.04,mt,s*.22,y+.43,z);gb.grp.add(ear)}}
function ganek(g,H){const z0=H.d/2,x=H.dx,top=H.y0+H.h*.8;g.add(tbox(.07,top,.07,matLog2,x-.42,top/2,z0+.42),tbox(.07,top,.07,matLog2,x+.42,top/2,z0+.42));
 const pr=gable(1.05,.5,.3,STY.roof,top,.06);pr.position.set(x,0,z0+.2);g.add(pr);g.add(tbox(1.0,.06,.5,mPlank,x,.06,z0+.25,0,2))}
function leanTo(g,H,kind){const fw=BD[kind].w,margin=(fw-H.w)/2;const lw=Math.max(.3,Math.min(.55,margin+.18));const s=STY.r()<.5?-1:1;const x0=s*(H.w/2+lw/2);const hh=H.y0+H.h*.72;
 for(const z of[-H.d/2+.08,H.d/2-.08])g.add(tbox(.06,hh*.8,.06,matDark,x0+s*lw/2-s*.03,hh*.4,z));
 const rf=tbox(lw+.12,.05,H.d+.1,STY.roof===mSod?mSod:mBoards,x0,hh*.92,0,0,2);rf.rotation.z=s*-.32;g.add(rf);
 if(STY.r()<.6)woodpile(g,x0,0,Math.max(4,Math.round(H.d*3)),Math.PI/2);else{barrel(g,x0,-H.d*.2,.7);crate(g,x0,H.d*.2,.3)}}
function potsFence(g,kind){const fw=BD[kind].w,fh=BD[kind].h;const s=STY.r()<.5?-1:1;const x=s*(fw/2-.35),z=fh/2-.12;const fg=new THREE.Group();fg.position.set(x,0,z);
 fg.add(tbox(.8,.3,.04,mWattle,0,.17,0,0,2));for(const q of[-.38,0,.38]){fg.add(tbox(.04,.5,.04,matDark,q,.25,0));if(STY.r()<.8){const p=mesh(new THREE.SphereGeometry(.08,8,6,0,6.283,0,1.7),STY.r()<.5?mPot:mPot2,q,.55,0);p.rotation.x=Math.PI;g.add(fg);fg.add(p)}}g.add(fg)}
function herbs(g,H){const z=H.d/2+.12,y=H.y0+H.h-.04;for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(.05,.18,5),k===1?mGarlic:mHerb);c.position.set(H.dx+(k-1)*.18+(H.dx>0?-.5:.5),y-.1,z);c.rotation.x=Math.PI;c.castShadow=true;g.add(c)}}
function bench(g,H){const x=H.dx>0?H.dx-.75:H.dx+.75,z=H.d/2+.2;g.add(tbox(.62,.05,.18,mPlank,x,.3,z,0,2),tbox(.05,.28,.14,matDark,x-.25,.14,z),tbox(.05,.28,.14,matDark,x+.25,.14,z))}
function addCharacter(g,kind){const T=STY;if(!T)return;const H=T.house;const main=T.gables.slice().sort((a,b)=>b.w*b.d-a.w*a.d)[0];
 try{if(main&&T.koniki&&H)koniki(main);
  if(H&&H.type==='log'){if(T.ganek)ganek(g,H);if(T.lean)leanTo(g,H,kind);if(T.herbs)herbs(g,H);if(T.bench&&!T.ganek)bench(g,H)}
  else if(H&&H.type==='plank'){const G=H.grp||g;if(T.herbs)herbs(G,H);if(T.lean&&BD[kind].w>=2)leanTo(G,H,kind)}
  if(T.pots&&BD[kind].w>=2&&BD[kind].h>=2)potsFence(g,kind);
  if(kind==='domwsp'&&main){for(const gb of T.gables)if(gb!==main&&gb.w>2)koniki(gb);
   const top=.3+1.25*.82;for(let k=0;k<5;k++)g.add(tbox(.08,top,.08,matLog2,-1.6+k*.8,top/2,1.25));const pr=gable(3.6,.55,.25,T.roof,top,.05);pr.position.set(0,0,1.0);g.add(pr)}
  if(kind==='kuznia'){const bl=new THREE.Group();bl.position.set(.05,0,-.45);bl.add(tbox(.38,.12,.26,matHide,0,.72,0,0,2),tbox(.42,.04,.3,mPlankD,0,.64,0,0,2),tbox(.42,.04,.3,mPlankD,0,.8,0,0,2));g.add(bl);
   for(let k=0;k<3;k++){const hs=new THREE.Mesh(new THREE.TorusGeometry(.07,.015,4,10,4.2),M(0x3a3c40,{metalness:.5,roughness:.4}));hs.position.set(-.85+k*.16,1.05,.62);g.add(hs)}}
  if(kind==='laznia'){g.add(cyl(.16,.28,mPlank,.95,.14,-.45,0,0,0,9));const st=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,transparent:true,opacity:.35,depthWrite:false,color:0xe8ece8}));st.scale.set(1.2,1.2,1);st.position.set(-.45,1.9,-.3);g.add(st)}
 }catch(e){console.warn('budynek',kind,e)}}
{const _mb=makeBuildingModel;makeBuildingModel=function(kind,bb){if(GFX.level===0&&!window.__b19)return _mb(kind,bb);STY=styFor(kind,bb);try{const g=_mb(kind,bb);addCharacter(g,kind);return g}finally{STY=null}}}
window.__mk18={makeBuildingModel:(k,b)=>makeBuildingModel(k,b),BD,BKEYS};
// szyldy rzemiosła: deska z wymalowanym znakiem przy wejściu
const SIGNK={drwal:'drewno',kamien:'kamien',glinianka:'glina',ruda:'ruda',zbieracz:'zywnosc',mysliwy:'skory',pomost:'woda',pracownia:'deski',warsztat:'narz',kuznia:'narz',szwalnia:'odziez',mielerz:'wegiel',cegielnia:'cegla',drewutnia:'opal',garncarnia:'glina',piekarnia:'ziarno',zarna:'ziarno',serownia:'zywnosc',kiszarnia:'zapasy',spizarnia:'zapasy',sklad:'zapasy',izbanauki:'wiedza',izbachorych:'ziola',pasieka:'miod',ogrodziol:'ziola',lesnik:'natura',zagroda:'skory',laznia:'woda'};
const SIGNT={};
function signTex(key){if(SIGNT[key])return SIGNT[key];const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');
 x.fillStyle='#7a5a38';x.fillRect(0,0,96,96);x.fillStyle='rgba(40,25,12,.35)';for(let i=0;i<4;i++)x.fillRect(0,i*24+22,96,2);x.strokeStyle='#3a2414';x.lineWidth=6;x.strokeRect(3,3,90,90);
 x.save();x.translate(48-24*1.6,48-24*1.6);x.scale(1.6,1.6);x.strokeStyle='#efe2c0';x.lineWidth=2.2;x.lineCap='round';x.lineJoin='round';const svg=IC[key]||'';
 (svg.match(/d="([^"]+)"/g)||[]).forEach(m=>{x.stroke(new Path2D(m.slice(3,-1)))});(svg.match(/<circle[^>]*>/g)||[]).forEach(m=>{const g=a=>+(m.match(new RegExp(a+'="([\\d.]+)"'))||[0,0])[1];x.beginPath();x.arc(g('cx'),g('cy'),g('r'),0,6.283);x.stroke()});
 (svg.match(/<rect[^>]*>/g)||[]).forEach(m=>{const g=a=>+(m.match(new RegExp(a+'="([\\d.]+)"'))||[0,0])[1];x.strokeRect(g('x'),g('y'),g('width'),g('height'))});(svg.match(/<ellipse[^>]*>/g)||[]).forEach(m=>{const g=a=>+(m.match(new RegExp(a+'="([\\d.]+)"'))||[0,0])[1];x.beginPath();x.ellipse(g('cx'),g('cy'),g('rx'),g('ry'),0,0,6.283);x.stroke()});x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return SIGNT[key]=new THREE.MeshStandardMaterial({map:t,roughness:.9,side:THREE.DoubleSide})}
function tradeSign(g,kind){const key=SIGNK[kind];if(!key||!IC[key])return;const fw=BD[kind].w,fh=BD[kind].h;const s=STY&&STY.r()<.5?-1:1;const x=s*(fw/2-.18),z=fh/2-.14;
 const sg=new THREE.Group();sg.position.set(x,0,z);sg.add(tbox(.06,1.2,.06,matLog2,0,.6,0));sg.add(tbox(.5,.04,.04,matLog2,-s*.22,1.15,0));
 const bd=new THREE.Mesh(new THREE.PlaneGeometry(.42,.42),signTex(key));bd.position.set(-s*.27,.86,0);bd.castShadow=true;sg.add(bd);
 for(const q of[-.14,.14])sg.add(tbox(.008,.08,.008,matDark,-s*.27+q,1.1,0));g.add(sg)}
{const _ac=addCharacter;addCharacter=function(g,kind){_ac(g,kind);try{tradeSign(g,kind)}catch(e){console.warn('szyld',e)}}}
// --- wykonanie widoczne na budynku ---
const TXNL=ctex(128,128,(x,w,h)=>{const n=6,rh=h/n;for(let i=0;i<n;i++){const y=i*rh;const gr=x.createLinearGradient(0,y,0,y+rh);const b=200+RT()*35;gr.addColorStop(0,`rgb(${b*.62|0},${b*.62|0},${b*.62|0})`);gr.addColorStop(.4,`rgb(${b|0},${b|0},${b|0})`);gr.addColorStop(1,`rgb(${b*.78|0},${b*.78|0},${b*.78|0})`);x.fillStyle=gr;x.fillRect(0,y,w,rh);
 x.strokeStyle='rgba(60,60,60,.25)';for(let k=0;k<4;k++){x.beginPath();const yy=y+3+RT()*(rh-6);x.moveTo(RT()*w*.3,yy);x.lineTo(w*.5+RT()*w*.5,yy+RT()*2-1);x.stroke()}}x.fillStyle='rgba(30,30,30,.5)';for(let i=0;i<=n;i++)x.fillRect(0,i*rh-1,w,2)});
const PALL={};function palLog(k){return PALL[k]||(PALL[k]=new THREE.MeshStandardMaterial({map:TXNL,color:PAL[k][0],roughness:.95}))}
const mTrim=M(0xf0ece0,{flatShading:false}),mFlow=[M(0xc04050),M(0xe0c050),M(0xd8d8f0),M(0x8a5aa8)],mSillW=M(0x5a4430);
{const _wi2=win;win=function(g,x,y,z,ry){_wi2(g,x,y,z,ry);const T=STY;if(!T)return;const wg=g.children[g.children.length-1];if(!wg)return;
  if(T.q===1){wg.traverse(o=>{if(o.isMesh&&o.material===mWin&&o.geometry.parameters&&o.geometry.parameters.width>.2){o.scale.set(.75,.7,1)}});return}
  if(T.trims){const tc=T.pal==='white'?shutM(T.sh||0x4a6a8a):mTrim;wg.add(tbox(.5,.05,.03,tc,0,.21,.05),tbox(.46,.04,.03,tc,0,-.2,.05),tbox(.04,.42,.03,tc,-.22,0,.05),tbox(.04,.42,.03,tc,.22,0,.05));
   const top=tbox(.58,.07,.06,tc,0,.27,.06);wg.add(top);const pk=tbox(.12,.12,.04,tc,0,.33,.06);pk.rotation.z=Math.PI/4;wg.add(pk);
   if(T.r()<.75){wg.add(tbox(.44,.08,.11,mPlank,0,-.27,.1,0,2));for(let k=0;k<4;k++)wg.add(mesh(new THREE.SphereGeometry(.045,6,4),mFlow[(k+((x*7)|0))&3],-.15+k*.1,-.2,.1))}}}}
{const _lh2=logHouse;logHouse=function(g,w,d,h,opt){const n0=g.children.length;const r=_lh2(g,w,d,h,opt);const T=STY;if(!T||!T.house)return r;const H=T.house;
  for(let i=n0;i<g.children.length;i++){const c=g.children[i];const p=c.geometry&&c.geometry.parameters;if(c.material===mStone&&p&&Math.abs(p.height-.3)<1e-6&&p.width>H.w){
    if(T.q===1){c.material=matLog2;c.scale.y=.55;c.position.y=.08}else if(T.q===3){g.add(tbox(p.width+.2,.12,p.depth+.2,mStone,0,.06,0,0,.9))}break}}
  if(T.q===1&&T.r()<.7)for(let k=0;k<3;k++){const pt=tbox(.3+T.r()*.2,.04,.26,mThatchOld,(T.r()-.5)*H.w*.6,.3+H.h+H.rh*.45,(T.r()-.5)*H.d*.5);pt.rotation.z=(T.r()<.5?1:-1)*Math.atan2(H.rh,H.w/2+.3);g.add(pt)}
  return r}}
{const _ph2=plankHut;plankHut=function(g0,w,d,h,opt){const g=_ph2(g0,w,d,h,opt);const T=STY;if(!T)return g;
  for(const c of g.children){const p=c.geometry&&c.geometry.parameters;if(c.material===mStone&&p&&Math.abs(p.height-.16)<1e-6){if(T.q===1){c.material=matLog2;c.scale.y=.6}else if(T.q===3)g.add(tbox(p.width+.18,.1,p.depth+.18,mStone,0,.05,0,0,.9));break}}return g}}
{const _ga2=gable;gable=function(w,d,h,mat,y,over,sc){if(STY&&(mat===mThatch||mat===mThatchOld||(mat===mShingle&&STY.kind!=='studnia')))mat=STY.roof;return _ga2(w,d,h,mat,y,over,sc)}}
// odmiany pozostałych budynków
function variants(g,kind){const T=STY;if(!T)return;const r=T.r;
 // ściany z bali i desek w kolorze budynku
 g.traverse(o=>{if(!o.isMesh)return;const p=o.geometry&&o.geometry.parameters;
  if(o.material===mLogs||o.material===mLogsD||o.material===mLogsG){if(T.pal!=='nat'||r()<.5)o.material=palLog(T.pal)}
  else if((o.material===mPlank||o.material===mPlankG)&&p&&p.height>.6&&T.pal!=='nat')o.material=palMats(T.pal)[0]});
 if(kind==='szalas'){const tint=[0xffffff,0xe8dcc0,0xd8d0c0,0xc8bca4][(r()*4)|0];const cm=mCanvas.clone();cm.color.setHex(tint);g.traverse(o=>{if(o.isMesh&&o.material===mCanvas)o.material=cm});
  const pm=mCanvas.clone();pm.color.setHex(0x9a8a6a);for(let k=0;k<2+((r()*3)|0);k++){const pa=new THREE.Mesh(new THREE.PlaneGeometry(.22+r()*.15,.18+r()*.12),pm);const s=r()<.5?-1:1;const a=Math.atan2(1.3,.82);
   pa.position.set(s*(.25+r()*.4),.35+r()*.6,(r()-.5)*1.3);pa.rotation.set(0,s*Math.PI/2,0);pa.rotateX(-(Math.PI/2-a)*s*0);pa.rotation.z=s*(Math.PI/2-a);pa.translateZ(.012);g.add(pa)}}
 if(kind==='studnia'&&r()<.5){g.traverse(o=>{const p=o.geometry&&o.geometry.parameters;if(o.isMesh&&o.material===mStone&&p&&Math.abs((p.radiusTop||0)-.36)<1e-6)o.visible=false});
  for(let k=0;k<4;k++){const y=.07+k*.13;g.add(tbox(.8,.13,.13,palLog(T.pal),0,y,.34+(k%2)*.02,0,1.4),tbox(.8,.13,.13,palLog(T.pal),0,y,-.34,0,1.4),tbox(.13,.13,.7,palLog(T.pal),.34,y+.065,0,0,1.4),tbox(.13,.13,.7,palLog(T.pal),-.34,y+.065,0,0,1.4))}}
 if(kind==='zagroda'&&r()<.5)g.traverse(o=>{const p=o.geometry&&o.geometry.parameters;if(o.isMesh&&o.material===mPlank&&p&&Math.abs((p.width||0)-.62)<1e-6){o.material=mWattle;o.scale.y=3.2;o.position.y=Math.max(o.position.y,.27)}});
 if(kind==='spizarnia'&&T.q>=2)for(const[x,z]of[[-.65,-.6],[.65,-.6],[-.65,.6],[.65,.6]])g.add(mesh(new THREE.CylinderGeometry(.2,.12,.08,8),matStone,x,.62,z));
}
{const _ac2=addCharacter;addCharacter=function(g,kind){try{variants(g,kind)}catch(e){console.warn('odmiany',e)}_ac2(g,kind)}}
// szyld według wykonania
{const _st=signTex;signTex=function(key){const T=STY;const q=T?T.q:2;const k2=key+'|'+q;if(SIGNT[k2])return SIGNT[k2];const m=_st(key);delete SIGNT[key];
  if(q!==2){const c=m.map.image;const x=c.getContext('2d');if(q===1){x.fillStyle='rgba(30,20,10,.35)';x.fillRect(0,0,96,96)}else{x.strokeStyle='#8a2a22';x.lineWidth=5;x.strokeRect(9,9,78,78);x.fillStyle='#e0c060';[[12,12],[84,12],[12,84],[84,84]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,4,0,6.3);x.fill()})}m.map.needsUpdate=true}
  return SIGNT[k2]=m}}
// karta budynku: wykonanie i trwałość
{const _rs=renderSel;renderSel=function(){_rs();try{if(!S||selB===null)return;const b=bById(selB);if(!b||!bDone(b))return;const el=$('sel');if(!el||el.querySelector('.q18'))return;
  const q=qOf(b.kind,b);const nm=['surowe','porządne','mistrzowskie'][q-1];const wr=b.kind==='szalas'?'szałas niszczeje najszybciej':b.kind==='dom'?'dom z piecem niszczeje najwolniej':(BD[b.kind].wk||BD[b.kind].store)?['zużycie zwykłe','zużycie o 15% wolniejsze','zużycie o 30% wolniejsze'][q-1]:'';
  const tip=q<3&&(BD[b.kind].wk||BD[b.kind].store)?' Rozbudowa poprawi wykonanie.':q<3&&b.kind==='chata'?' Dwie dobudówki dadzą mistrzowskie wykończenie.':'';
  const h=el.querySelector('h4');if(h)h.insertAdjacentHTML('afterend',`<p class="mut q18">Wykonanie: <b style="color:var(--gold2)">${nm}</b>${wr?' · '+wr:''}.${tip}</p>`)}catch(e){}}}
// chwila rozbudowy: kurz i dźwięk
{const _fp=finishProj;finishProj=function(b){const t=b.proj&&b.proj.t;_fp(b);if(t==='lv'||t==='ext'||(t&&t!=='rep')){try{const c=bCenter(b);dustPuff(c.x,Hy(c.x,c.z),c.z,10,BD[b.kind].w);if(typeof sfx==='function')sfx('bell')}catch(e){}}}}
// wykonanie widać także w skali i obejściu: surowe niższe i mniejsze, mistrzowskie większe, z płotkiem i furtką
function picket(g,kind,T){const fw=BD[kind].w,fh=BD[kind].h;if(fw<2)return;const z=fh/2+.02,mat=T.pal==='white'?mTrim:mPlank;const gap=.55,half=fw/2-.08;
 for(const s of[-1,1]){const x0=s*gap/2,x1=s*half;const len=Math.abs(x1-x0);const cx=(x0+x1)/2;g.add(tbox(len,.05,.03,mat,cx,.32,z,0,2),tbox(len,.05,.03,mat,cx,.16,z,0,2));
  for(let k=0;k<=Math.round(len/.16);k++){const x=x0+s*k*.16;const p=tbox(.045,.42,.025,mat,x,.21,z+.02,0,2);g.add(p);const tip=tbox(.04,.04,.02,mat,x,.43,z+.02);tip.rotation.z=Math.PI/4;g.add(tip)}}}
{const _ac3=addCharacter;addCharacter=function(g,kind){_ac3(g,kind);const T=STY;if(!T)return;
  const sc=T.q===1?.92:T.q===3?1.06:1;if(sc!==1)for(const c of g.children){c.position.x*=sc;c.position.z*=sc;c.position.y*=sc;c.scale.multiplyScalar(sc)}
  if(T.q===3&&kind!=='domwsp'&&!['zagroda','cmentarz','ogrodziol','pomost','pasieka','studnia','gaj','wieza','mielerz','szalas'].includes(kind))try{picket(g,kind,T)}catch(e){}}}
