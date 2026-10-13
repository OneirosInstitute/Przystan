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
  const wk=S.weather.k,wm={rain:'deszcz',storm:'burza',fog:'mgla',drought:'susza',snow:'snieg'}[wk];if(wm)lkMix(o,LOOK[wm],.85);
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
 const skin=mdCol(skinC[id%4]),cloth=mdCol(p.cloth),hair=mdCol(old?hairC[4]:hairC[id%4]);
 const linen=mdCol(0xd8ccb0),pants=mdCol(k?0x5a4a3e:(id%3?0x4a463c:0x6a5a44)),emb=mdCol(EMB[id%4]),shoe=mdCol(id%2?0x8a6a44:0x5a4630),belt=mdCol(id%3===0?0x8a2a22:0x3a2c1e);
 // tułów z głową (jedna bryła), punkt obrotu w biodrach
 const T=[];const h0=.5;
 if(k){T.push([mdLathe([[.0,.06],[.205,.06],[.19,.16],[.165,.3],[.13,.46],[.118,.54],[.13,.62],[.14,.68],[.135,.74],[.1,.79],[.05,.82],[0,.83]].map(([r,y])=>[r,y-h0]),14),cloth]);
  T.push([new THREE.CylinderGeometry(.208,.208,.03,14,1,true),emb,mdM(0,.08-h0,0)]);
  if(adult&&id%3!==2){const ac=mdCol(id%2?0xb8ac90:0x5a4a3a);T.push([new THREE.CylinderGeometry(.13,.178,.34,10,1,true,-.75,1.5),ac,mdM(0,.37-h0,.006)]);T.push([new THREE.CylinderGeometry(.18,.18,.018,10,1,true,-.75,1.5),emb,mdM(0,.21-h0,.006)])}}
 else{T.push([mdLathe([[0,.37],[.16,.37],[.15,.44],[.122,.52],[.135,.6],[.148,.68],[.14,.75],[.1,.8],[.05,.83],[0,.84]].map(([r,y])=>[r,y-h0]),14),cloth]);
  T.push([new THREE.CylinderGeometry(.162,.162,.025,14,1,true),emb,mdM(0,.385-h0,0)]);}
 T.push([new THREE.CylinderGeometry(k?.122:.128,k?.124:.13,.04,14),belt,mdM(0,(k?.55:.52)-h0,0)]);
 T.push([new THREE.CylinderGeometry(.052,.05,.03,10,1,true),emb,mdM(0,.81-h0,0)]);
 [-1,1].forEach(s=>T.push([new THREE.SphereGeometry(.056,10,8),cloth,mdM(s*.15,.755-h0,0,0,0,0,1,.85,1)]));
 // szyja i głowa
 T.push([new THREE.CylinderGeometry(.04,.046,.07,10),skin,mdM(0,.84-h0,0)]);
 const hy=.935-h0;T.push([new THREE.SphereGeometry(.098,16,12),skin,mdM(0,hy,0,0,0,0,1,1.1,1)]);
 T.push([new THREE.SphereGeometry(.02,8,6),skin,mdM(0,hy-.012,.095,0,0,0,1,1.2,1.1)]);
 [-1,1].forEach(s=>{T.push([new THREE.SphereGeometry(.0125,6,5),mdCol(0x1c1612),mdM(s*.034,hy+.018,.086)]);T.push([new THREE.SphereGeometry(.02,6,5),skin,mdM(s*.097,hy,0,0,0,0,.6,1,1)])});
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
 const arm=s=>{const A=[];A.push([new THREE.CylinderGeometry(.044,.038,.18,10),cloth,mdM(0,-.09,0)]);A.push([new THREE.SphereGeometry(.039,10,6),cloth,mdM(0,-.18,0)]);
  A.push([new THREE.CylinderGeometry(.037,.032,.15,10),cloth,mdM(0,-.255,.018,-.25)]);A.push([new THREE.CylinderGeometry(.04,.04,.02,10,1,true),emb,mdM(0,-.32,.035,-.25)]);
  A.push([new THREE.SphereGeometry(.033,10,8),skin,mdM(0,-.355,.045,0,0,0,.9,1.15,.8)]);const m=new THREE.Mesh(mdMerge(A),MD.mat);m.position.set(s*.168,.76,0);return m};
 const aL=arm(-1),aR=arm(1);
 // nogi: udo, łydka w onucach, łapcie
 const leg=s=>{const L=[];L.push([new THREE.CylinderGeometry(.06,.05,.25,10),pants,mdM(0,-.125,0)]);L.push([new THREE.SphereGeometry(.05,10,6),pants,mdM(0,-.25,0)]);
  L.push([new THREE.CylinderGeometry(.049,.04,.21,10),k?pants:linen,mdM(0,-.355,0)]);if(!k)[.31,.37,.43].forEach(y=>L.push([new THREE.CylinderGeometry(.052-(y-.31)*.05,.052-(y-.31)*.05,.012,10,1,true),mdCol(0x5a4630),mdM(0,-y,0,.25*(y>.35?1:-1))]));
  L.push([new THREE.SphereGeometry(.05,10,6),shoe,mdM(0,-.47,.03,0,0,0,.95,.6,1.55)]);const m=new THREE.Mesh(mdMerge(L),MD.mat);m.position.set(s*.066,.5,0);return m};
 const lL=leg(-1),lR=leg(1);
 [torso,aL,aR,lL,lR].forEach(m=>{m.castShadow=true;m.receiveShadow=true});
 g.add(torso,aL,aR,lL,lR);
 const carry=new THREE.Mesh(mdG('carry',()=>new THREE.BoxGeometry(.24,.16,.22)),M(0x8a6a40));carry.position.set(0,.72,.2);carry.visible=false;carry.castShadow=true;g.add(carry);
 const sh=new THREE.Mesh(mdG('psh',()=>new THREE.PlaneGeometry(.8,.8)),shadowMat);sh.rotation.x=-Math.PI/2;sh.position.y=.03;g.add(sh);
 const ring=new THREE.Mesh(mdG('pring',()=>new THREE.RingGeometry(.32,.4,24)),new THREE.MeshBasicMaterial({color:0xf4ead0,transparent:true,opacity:.95,depthWrite:false,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;g.add(ring);
 g.traverse(o=>{o.userData.pid=p.id});
 g.userData={pid:p.id,carry,torso,lL,lR,aL,aR,ring,sc:0,p18:1};return g}
{const _mp=makePersonMesh;makePersonMesh=function(p){if(GFX.level===0&&!window.__p18)return _mp(p);try{return makePerson18(p)}catch(e){console.warn(e);return _mp(p)}}}
// ruch: kołysanie przy chodzie, ręce przy noszeniu, siedzenie przy ogniu
const ANI={sit:/siedzi|je wspólny|odpoczywa|leży|bawi się w berka|^słucha/};
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;const run=S.speed>0;
  for(const p of S.people){const m=pMesh[p.id];if(!m||!m.visible)continue;const u=m.userData;if(!u.p18)continue;
   const walk=p.state==='move'&&run,sit=!walk&&p.state!=='work'&&ANI.sit.test(p.act||'')&&p.age>=6;
   const by=walk?Math.abs(Math.sin(clock*10+p.id))*.022:0;const sy=sit?-.2:0;
   u.torso.position.y=.5+by+sy;u.aL.position.y=u.aR.position.y=.76+by+sy;u.lL.position.y=u.lR.position.y=.5+sy;
   if(sit){u.lL.rotation.x=u.lR.rotation.x=-1.35;u.aL.rotation.x=-.5;u.aR.rotation.x=-.45;u.torso.rotation.x=-.05}
   else if(p.carry&&!(p.state==='work')){u.aL.rotation.x=u.aR.rotation.x=-1.05+(walk?Math.sin(clock*10+p.id)*.06:0);u.aL.rotation.z=-.25;u.aR.rotation.z=.25;u.carry.position.set(0,.74+by,.24)}
   else{u.aL.rotation.z=-.06;u.aR.rotation.z=.06;if(walk)u.torso.rotation.z=Math.sin(clock*10+p.id)*.035;else u.torso.rotation.z=0}}}}

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
    const lx=cyl(r,w+.26,mBal[(row+1)%3],0,y+off*0,0,0,0,Math.PI/2,8);lx.position.z=d/2-r*.6;g.add(lx);const lx2=lx.clone();lx2.position.z=-d/2+r*.6;lx2.material=mBal[row%3];g.add(lx2);
    const lz=cyl(r,d+.26,mBal[row%3],w/2-r*.6,y+step/2,0,Math.PI/2,0,0,8);if(y+step/2<.3+h-r*.3){g.add(lz);const lz2=lz.clone();lz2.position.x=-w/2+r*.6;lz2.material=mBal[(row+2)%3];g.add(lz2)}}
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
function cullAdd(src){if(!src||!src.isInstancedMesh||src.userData.cull)return;const dst=new THREE.InstancedMesh(src.geometry,src.material,src.count);
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
