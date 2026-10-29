/* ================= losowość i szum ================= */
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function makeNoise(seed){const r=rng(seed),P=new Float32Array(65536);for(let i=0;i<65536;i++)P[i]=r();
 const sm=t=>t*t*(3-2*t);
 return function(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const g=(a,b)=>P[((b&255)<<8)|(a&255)];
  const a=g(xi,yi),b=g(xi+1,yi),c=g(xi,yi+1),d=g(xi+1,yi+1),u=sm(xf),v=sm(yf);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}}
const SEED=(()=>{try{const u=new URLSearchParams(location.search).get('seed');if(u&&+u>0)return +u;const l=localStorage.getItem('przystan-seed');if(l&&+l>0)return +l}catch(e){}return 2207})(), n1=makeNoise(SEED), n2=makeNoise(SEED+7), n3=makeNoise(SEED+13);
function fbm(nf,x,y,o){let a=.5,f=1,s=0,t=0;for(let k=0;k<o;k++){s+=nf(x*f,y*f)*a;t+=a;a*=.5;f*=2.03}return s/t}
const clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t, sstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
// 4.5: barwy liniowe z tablicy (na dużej wyspie Math.pow w każdym wierzchołku był wąskim gardłem przy wczytaniu)
const LUT22=(()=>{const t=new Float32Array(4097);for(let k=0;k<=4096;k++)t[k]=Math.pow(k/4096,2.2);return t})();
const L=v=>{v=v<0?0:v>1?1:v;const x=v*4096,a=x|0;return a>=4096?LUT22[4096]:LUT22[a]+(LUT22[a+1]-LUT22[a])*(x-a)};

/* ================= teren ================= */
const HH=new Float32Array(VW*VW), H=new Float32Array(VW*VW);
// dawna wyspa liczy się w swoich współrzędnych (192×192), więc wychodzi co do kafla taka sama jak przed 4.5
function field(x,y){const u=x/N0,v=y/N0;
 const wx=(fbm(n2,u*3+3.1,v*3+1.7,3)-.5)*.55,wy=(fbm(n2,u*3+8.3,v*3+2.9,3)-.5)*.55;
 const d=Math.hypot((u-.5)*2+wx,(v-.5)*2+wy);
 let h=1-Math.pow(d,1.7)*1.3;
 h+=(fbm(n1,u*5,v*5,4)-.5)*.62;
 h+=(n3(u*44,v*44)-.5)*.035;
 if(h>.42){const r=1-Math.abs(fbm(n3,u*6+20,v*6+11,3)*2-1);h+=(h-.42)*r*r*1.1}
 return h}
const HH0=new Float32Array(VW0*VW0),land0=new Uint8Array(N0*N0);for(let j=0;j<VW0;j++)for(let i=0;i<VW0;i++)HH0[j*VW0+i]=field(i,j);
for(let j=0;j<N0;j++)for(let i=0;i<N0;i++)land0[j*N0+i]=(HH0[j*VW0+i]+HH0[j*VW0+i+1]+HH0[(j+1)*VW0+i]+HH0[(j+1)*VW0+i+1])/4>0.02?1:0;
wyBuild(HH,HH0,land0);
for(let k=0;k<VW*VW;k++){const h=HH[k];H[k]=h>0?Math.pow(Math.min(h,1.6),1.35)*8:Math.max(h*5,-2.6)}
function Hy(x,z){const fx=clamp(x+N/2,0,N-1e-3),fz=clamp(z+N/2,0,N-1e-3),i=Math.floor(fx),j=Math.floor(fz),u=fx-i,v=fz-j;
 const a=H[j*VW+i],b=H[j*VW+i+1],c=H[(j+1)*VW+i],d=H[(j+1)*VW+i+1];return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
const tcx=i=>i-N/2+.5;
const tileHH=(i,j)=>(HH[j*VW+i]+HH[j*VW+i+1]+HH[(j+1)*VW+i]+HH[(j+1)*VW+i+1])/4;
const tileH=(i,j)=>(H[j*VW+i]+H[j*VW+i+1]+H[(j+1)*VW+i]+H[(j+1)*VW+i+1])/4;
const land=new Uint8Array(N*N), beach=new Uint8Array(N*N), occ=new Int16Array(N*N).fill(-1);
for(let j=0;j<N;j++)for(let i=0;i<N;i++){const h=tileHH(i,j);land[j*N+i]=h>0.02?1:0;beach[j*N+i]=(h>0.02&&h<0.075)?1:0}
function slope(i,j){const a=H[j*VW+i],b=H[j*VW+i+1],c=H[(j+1)*VW+i],d=H[(j+1)*VW+i+1];return Math.max(a,b,c,d)-Math.min(a,b,c,d)}
const forestF=wyForest;
const tread=new Float32Array(N*N);let treadDirty=false;
const wetF=wyWet;
// biomy: plaża, hale, las liściasty, bór, mokradło, łąka
function biomeOf(i,j){const k=j*N+i;if(!land[k])return'sea';if(beach[k])return'coast';const h=tileH(i,j);if(h>6.5)return'high';
 const f=forestF(i+.5,j+.5),w=wetF(i+.5,j+.5),hh=tileHH(i,j);
 if(hh<.24&&w>.56)return'wet';if(f>.5)return(h>4||w<.42)?'conif':'decid';return'meadow'}

/* ================= renderer, scena ================= */
// gradacja barw: wyciszona, chłodna paleta (jak przy pochmurnym świetle północy)
THREE.ShaderChunk.tonemapping_fragment+=`
 { float lum=dot(gl_FragColor.rgb,vec3(.2126,.7152,.0722)); gl_FragColor.rgb=mix(vec3(lum),gl_FragColor.rgb,.74); gl_FragColor.rgb=gl_FragColor.rgb*vec3(.96,.99,1.02)+vec3(.0025,.0035,.0045); }`;
const coarse=matchMedia('(pointer:coarse)').matches;
const scene=new THREE.Scene();
const cv=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,coarse?1.6:2));
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
scene.fog=new THREE.Fog(0xa9bcbf,170,300);
const cam=new THREE.OrthographicCamera(-10,10,10,-10,1,500);
const hemi=new THREE.HemisphereLight(0xdde7e8,0x46503e,.8);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d0,1.2);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);{const s=sun.shadow.camera;s.left=-32;s.right=32;s.top=32;s.bottom=-32;s.near=1;s.far=220}sun.shadow.bias=-0.0007;sun.shadow.normalBias=.03;
scene.add(sun);scene.add(sun.target);
const LOWQ=/lowq/.test(location.search);

/* ======== mgła nieznanego ======== */
const rev=new Uint8Array(N*N);let revDirty=true;const revNew=[];
function reveal(ci,cj,r){let ch=false;const r2=r*r;for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(di*di+dj*dj>r2)continue;const i=ci+di,j=cj+dj;if(i<0||j<0||i>=N||j>=N)continue;const k=j*N+i;if(!rev[k]){rev[k]=1;ch=true;revNew.push(k)}}if(ch)revDirty=true;return ch}
const revAt=(i,j)=>i>=0&&j>=0&&i<N&&j<N&&rev[j*N+i]===1;

/* ======== mesh terenu ======== */
const tGeo=new THREE.BufferGeometry();const baseCol=new Float32Array(VW*VW*3);
(function(){const pos=new Float32Array(VW*VW*3),col=new Float32Array(VW*VW*3),idx=[];
 for(let j=0;j<VW;j++)for(let i=0;i<VW;i++){const k=j*VW+i;pos[k*3]=i-N/2;pos[k*3+1]=H[k];pos[k*3+2]=j-N/2}
 // 4.5: dno głębokiego morza nie jest widoczne pod nieprzezroczystą wodą, więc nie trafia do siatki (mniej trójkątów na dużej wyspie)
 tGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));tGeo.setAttribute('color',new THREE.BufferAttribute(col,3))})();
// teren w kawałkach 48×48 kafli: wspólne tablice wierzchołków i barw, osobne listy trójkątów; kawałek poza kadrem się nie rysuje
const TCH=48,terrain=new THREE.Group();terrain.material=new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:1,metalness:0});
for(let cj=0;cj<N;cj+=TCH)for(let ci=0;ci<N;ci+=TCH){const idx=[];
 for(let j=cj;j<cj+TCH;j++)for(let i=ci;i<ci+TCH;i++){const a=j*VW+i,b=a+1,c=a+VW,d=c+1;if(Math.max(H[a],H[b],H[c],H[d])<-2.45)continue;if((i+j)&1)idx.push(a,c,b,b,c,d);else idx.push(a,c,d,a,d,b)}
 if(!idx.length)continue;const g=new THREE.BufferGeometry();g.setAttribute('position',tGeo.attributes.position);g.setAttribute('color',tGeo.attributes.color);g.setIndex(idx);
 g.boundingSphere=new THREE.Sphere(new THREE.Vector3(ci+TCH/2-N/2,4,cj+TCH/2-N/2),TCH*.75+12);const m=new THREE.Mesh(g,terrain.material);m.receiveShadow=true;terrain.add(m)}
terrain.receiveShadow=true;scene.add(terrain);
const SG=[[.47,.54,.31],[.6,.53,.32],[.82,.85,.86],[.5,.6,.34]];
const SC=[[.44,.53,.3],[.72,.5,.24],[.52,.49,.44],[.5,.6,.32]];
const SPINE=[[.2,.32,.27],[.21,.31,.26],[.42,.49,.48],[.21,.34,.28]];
function seasonCol(tab,yd){const p=yd/24-.5,a=Math.floor(p),f=p-a;const A=tab[((a%4)+4)%4],B=tab[(((a+1)%4)+4)%4];return A.map((v,i)=>v+(B[i]-v)*f)}
function vh(i,j){const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s)}
const baseCol0=new Float32Array(VW*VW*3);
const DIRT=[L(.44),L(.37),L(.27)];
// 4.5: przeliczenie tylko prostokąta, w którym coś się zmieniło (na wyspie 384 całość jest czterokrotnie droższa)
let tcRect=null;const tcAdd=(i0,j0,i1,j1)=>{i0=Math.max(0,i0);j0=Math.max(0,j0);i1=Math.min(VW-1,i1);j1=Math.min(VW-1,j1);tcRect=tcRect?[Math.min(tcRect[0],i0),Math.min(tcRect[1],j0),Math.max(tcRect[2],i1),Math.max(tcRect[3],j1)]:[i0,j0,i1,j1]};
function applyTread(R){const i0=R?Math.max(0,R[0]):0,j0=R?Math.max(0,R[1]):0,i1=R?Math.min(VW-1,R[2]):VW-1,j1=R?Math.min(VW-1,R[3]):VW-1;for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){let t=0;for(let dj=-1;dj<=0;dj++)for(let di=-1;di<=0;di++){const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<N&&b<N)t+=tread[b*N+a]}
  const a=Math.min(.78,t*.36),k=(j*VW+i)*3;baseCol[k]=baseCol0[k]+(DIRT[0]-baseCol0[k])*a;baseCol[k+1]=baseCol0[k+1]+(DIRT[1]-baseCol0[k+1])*a;baseCol[k+2]=baseCol0[k+2]+(DIRT[2]-baseCol0[k+2])*a}}
// 4.5: szum (las, plamy, ziarno barwy) liczony raz i we współrzędnych dawnej wyspy, więc jej barwy są jak dawniej; pora roku tylko miesza
let pbFF=null,pbR=null,pbM=null;
function paintBase(yd){const g=seasonCol(SG,yd);const winter=yd>=50&&yd<70;
 if(!pbFF){pbFF=new Float32Array(VW*VW);pbR=new Float32Array(VW*VW);pbM=new Float32Array(VW*VW);
  for(let j=0;j<VW;j++)for(let i=0;i<VW;i++){const k=j*VW+i,li=i-OFF,lj=j-OFF;pbR[k]=(vh(li,lj)-.5)*.05;pbM[k]=(n2(li*.18,lj*.18)-.5)*.1;pbFF[k]=sstep(.45,.62,forestF(i,j))}}
 const s0=winter?.78:.74,s1=winter?.78:.67,s2=winter?.76:.52;
 for(let j=0;j<VW;j++)for(let i=0;i<VW;i++){const k=j*VW+i,hh=HH[k],h=H[k],r=pbR[k],m=pbM[k],ff=pbFF[k];
  let c0=g[0]*(1-.3*ff)+r+m,c1=g[1]*(1-.2*ff)+r+m*.6,c2=g[2]*(1-.25*ff)+r;
  const rk=clamp(sstep(7,9,h)+sstep(.6,1.5,slope(Math.min(i,N-1),Math.min(j,N-1)))*.6,0,1);c0=lerp(c0,.55+r,rk);c1=lerp(c1,.55+r,rk);c2=lerp(c2,.52+r,rk);
  const snow=sstep(11,12.5,h);c0=lerp(c0,.88,snow);c1=lerp(c1,.9,snow);c2=lerp(c2,.92,snow);
  const sa=1-sstep(.03,.085,hh);c0=lerp(c0,s0+r,sa);c1=lerp(c1,s1+r,sa);c2=lerp(c2,s2+r,sa);
  const wet=1-sstep(-.12,.03,hh);c0=lerp(c0,.42,wet);c1=lerp(c1,.38,wet);c2=lerp(c2,.3,wet);
  baseCol0[k*3]=L(c0);baseCol0[k*3+1]=L(c1);baseCol0[k*3+2]=L(c2)}
 applyTread()}
const MIST=[L(.2),L(.235),L(.265)];
function applyFog(R){const col=tGeo.attributes.color.array,i0=R?Math.max(0,R[0]):0,j0=R?Math.max(0,R[1]):0,i1=R?Math.min(VW-1,R[2]):VW-1,j1=R?Math.min(VW-1,R[3]):VW-1;
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const k=j*VW+i;let s=0,c=0;
  for(let dj=-1;dj<=0;dj++)for(let di=-1;di<=0;di++){const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<N&&b<N){s+=rev[b*N+a];c++}}
  const f=c?s/c:0,m=1-f;
  col[k*3]=baseCol[k*3]*(f+m*.12)+m*MIST[0];col[k*3+1]=baseCol[k*3+1]*(f+m*.12)+m*MIST[1];col[k*3+2]=baseCol[k*3+2]*(f+m*.12)+m*MIST[2]}
 const at=tGeo.attributes.color;if(R&&at.addUpdateRange){at.clearUpdateRanges();at.addUpdateRange(j0*VW*3,(j1-j0+1)*VW*3)}else if(at.clearUpdateRanges)at.clearUpdateRanges();at.needsUpdate=true}

/* ======== woda (shader z pianą) ======== */
const WM=40, WW=N+WM*2;
// 4.5: drobna siatka wody tylko tam, gdzie woda jest płytka (brzegi, zatoki, rzeki); głębia to jedna płaszczyzna oceanu pod spodem
const wGeo=(()=>{const W=WW+1,dep=new Float32Array(W*W),pos=new Float32Array(W*W*3);
 for(let j=0;j<W;j++)for(let i=0;i<W;i++){const k=j*W+i,x=i-WW/2,z=j-WW/2,cx=clamp(x,-N/2,N/2),cz=clamp(z,-N/2,N/2);dep[k]=-Hy(cx,cz)+Math.hypot(x-cx,z-cz)*.07;pos[k*3]=x;pos[k*3+1]=0;pos[k*3+2]=z}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('depth',new THREE.BufferAttribute(dep,1));g.userData.parts=[];
 const C=8;for(let bj=0;bj<WW;bj+=48)for(let bi=0;bi<WW;bi+=48){const idx=[];
  for(let cj=bj;cj<Math.min(WW,bj+48);cj+=C)for(let ci=bi;ci<Math.min(WW,bi+48);ci+=C){let mn=1e9;for(let j=cj;j<=Math.min(WW,cj+C);j++)for(let i=ci;i<=Math.min(WW,ci+C);i++)mn=Math.min(mn,dep[j*W+i]);if(mn>2.55)continue;
   for(let j=cj;j<Math.min(WW,cj+C);j++)for(let i=ci;i<Math.min(WW,ci+C);i++){const a=j*W+i,b=a+1,c=a+W,d=c+1;idx.push(a,c,b,b,c,d)}}
  if(idx.length)g.userData.parts.push({idx,c:[bi+24-WW/2,bj+24-WW/2]})}
 return g})();
const wUni={uT:{value:0},uDay:{value:1},uFog:{value:new THREE.Color(0xa9bcbf)},uFogN:{value:170},uFogF:{value:300},uSun:{value:new THREE.Color(1,1,1)},uGlint:{value:0}};
const wMat=new THREE.ShaderMaterial({uniforms:wUni,transparent:true,depthWrite:false,
 vertexShader:`attribute float depth;varying float vD;varying vec3 vW;varying float vFd;uniform float uT;
 void main(){vD=depth;vec3 p=position;float w=sin(p.x*.6+uT*1.3)*.5+sin(p.z*.5+uT*1.1)*.5;p.y+=w*.035*clamp(depth,0.,1.);
 vec4 wp=modelMatrix*vec4(p,1.);vW=wp.xyz;vec4 mv=viewMatrix*wp;vFd=-mv.z;gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`varying float vD;varying vec3 vW;varying float vFd;uniform float uT;uniform float uDay;uniform vec3 uFog;uniform float uFogN;uniform float uFogF;uniform vec3 uSun;uniform float uGlint;
 float hs(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
 void main(){if(vD<-.05)discard;float d=max(vD,0.);
  vec3 shallow=vec3(.16,.34,.33),mid=vec3(.04,.14,.17),deep=vec3(.012,.05,.075);
  vec3 c=mix(shallow,mid,smoothstep(.0,.9,d));c=mix(c,deep,smoothstep(.9,2.6,d));
  float n=vn(vW.xz*1.6+vec2(uT*.25,uT*.18))*.6+vn(vW.xz*4.+vec2(-uT*.4,uT*.3))*.4;
  c+=vec3(.02,.035,.04)*smoothstep(.6,.9,n)*(1.-smoothstep(0.,3.,d)*.5);
  float band=smoothstep(.45,0.,d);float wave=.5+.5*sin(d*24.-uT*2.2+n*3.);
  float foam=band*smoothstep(.4,.95,wave*.7+n*.5)+smoothstep(.1,0.,d)*.8;
  c=mix(c,vec3(.74,.8,.79),clamp(foam,0.,1.)*.75);
  c*=uSun*(.3+.7*uDay);
  if(uGlint>0.){float g1=vn(vW.xz*5.+vec2(uT*.7,-uT*.5)),g2=vn(vW.xz*7.3+vec2(-uT*.6,uT*.8));float sp=pow(max(g1*g2-.6,0.)/.4,5.)*5.;c+=uSun*vec3(1.,.93,.8)*sp*uGlint*uDay*uDay*(1.-band)*smoothstep(.2,1.5,d);}
  float a=mix(.5,1.,smoothstep(0.,2.2,d));a=max(a,clamp(foam,0.,1.)*.85);
  float fg=smoothstep(uFogN,uFogF,vFd);c=mix(c,uFog,fg);
  gl_FragColor=vec4(c,a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
 }`});
const water=new THREE.Group();water.position.y=-.04;water.material=wMat;
for(const P of wGeo.userData.parts){const g=new THREE.BufferGeometry();g.setAttribute('position',wGeo.attributes.position);g.setAttribute('depth',wGeo.attributes.depth);g.setIndex(P.idx);g.boundingSphere=new THREE.Sphere(new THREE.Vector3(P.c[0],0,P.c[1]),48*.75+4);const m=new THREE.Mesh(g,wMat);m.renderOrder=2;water.add(m)}
scene.add(water);
const oGeo=new THREE.PlaneGeometry(2000,2000,1,1);oGeo.rotateX(-Math.PI/2);oGeo.setAttribute('depth',new THREE.BufferAttribute(new Float32Array([4,4,4,4]),1));
const ocean=new THREE.Mesh(oGeo,wMat);ocean.position.y=-.09;ocean.renderOrder=1;scene.add(ocean);

/* ================= siatka chodzenia i A* (kopiec) ================= */
const walk=new Uint8Array(N*N);
let walkRevision=0;
const SLOPEC=new Uint8Array(N*N);   // 4.9.0-rc.27: pamięć stromizny pól (astar), czyszczona przy każdej zmianie mapy
function recomputeWalk(){SLOPEC.fill(0);walkRevision++;for(let k=0;k<N*N;k++)walk[k]=(land[k]&&occ[k]<0)?1:0}
const tileOf=(x,z)=>[clamp(Math.floor(x+N/2),0,N-1),clamp(Math.floor(z+N/2),0,N-1)];
const AG=new Float32Array(N*N),AF=new Float32Array(N*N),AC=new Int32Array(N*N),AS=new Uint32Array(N*N),AX=new Uint32Array(N*N);let stamp=1;
const heap=[];
function hpush(k){heap.push(k);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(AF[heap[p]]<=AF[heap[i]])break;const t=heap[p];heap[p]=heap[i];heap[i]=t;i=p}}
function hpop(){const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){const l=i*2+1,r=l+1;let m=i;if(l<heap.length&&AF[heap[l]]<AF[heap[m]])m=l;if(r<heap.length&&AF[heap[r]]<AF[heap[m]])m=r;if(m===i)break;const t=heap[m];heap[m]=heap[i];heap[i]=t;i=m}}return top}
// 4.9.0-rc.27: stromizna pola liczona raz (0 = jeszcze nie liczona, 1 = łagodnie, 2 = stromo); levelFootprint czyści ją pod nowym budynkiem
function steepAt(k){let v=SLOPEC[k];if(!v){v=slope(k%N,(k/N)|0)>1.1?2:1;SLOPEC[k]=v}return v===2}
// maxIt: omijanie tłumu szuka tylko krótkiego obejścia, zwykła droga może przejść całą wyspę
function astar(sx,sy,gx,gy,maxIt){
 if(sx===gx&&sy===gy)return[];stamp++;heap.length=0;
 // 4.9.0-rc.2: kto stoi na polu odciętym od wsi (wejście tylko na ukos między przeszkodami), może tak samo z niego zejść; wejść tak nie można
 const RA=(typeof S!=='undefined'&&S&&reach&&S.epoch!==4)?navReach():null;
 const S0=sy*N+sx,G=gy*N+gx;AS[S0]=stamp;AG[S0]=0;AF[S0]=0;AC[S0]=-1;hpush(S0);
 const hf=k=>{const dx=Math.abs(k%N-gx),dy=Math.abs(((k/N)|0)-gy);return Math.max(dx,dy)+.414*Math.min(dx,dy)};
 let it=0;
 const LIM=maxIt||40000;while(heap.length&&it++<LIM){const cur=hpop();if(AX[cur]===stamp)continue;AX[cur]=stamp;
  if(cur===G){const p=[];let c=cur;while(c!==S0){p.push(c);c=AC[c]}p.reverse();return p.map(k=>[k%N,(k/N)|0])}
  const cx=cur%N,cy=(cur/N)|0;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=N||ny>=N)continue;const nk=ny*N+nx;
   if(AX[nk]===stamp||(!walk[nk]&&nk!==G))continue;
   if(dx&&dy&&(!walk[cy*N+nx]||!walk[ny*N+cx])&&!(RA&&!RA[cur]))continue;
   const ng=AG[cur]+(dx&&dy?1.414:1)+(steepAt(nk)?.7:0);
   if(AS[nk]!==stamp||ng<AG[nk]){AS[nk]=stamp;AG[nk]=ng;AC[nk]=cur;AF[nk]=ng+hf(nk)*1.05;hpush(nk)}}}
 return null}
function nearestWalk(i,j){if(walk[j*N+i])return[i,j];for(let r=1;r<7;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const x=i+dx,y=j+dy;if(x>=0&&y>=0&&x<N&&y<N&&walk[y*N+x]&&Math.max(Math.abs(dx),Math.abs(dy))===r)return[x,y]}return null}

