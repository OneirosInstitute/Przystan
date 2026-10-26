
/* ================= 0.22: żywy świat — obrzędy i wesela w 3D, burze, zorza, dźwięk w przestrzeni, opowieści życia, kamera przy ważnych chwilach ================= */
// ---------- kamera przy ważnych chwilach ----------
let autoCam=true;try{autoCam=localStorage.getItem('przystan-autocam')!=='0'}catch(e){}
let camGoal=null,lastUserT=0,lastFocusT=-1e9;
cv.addEventListener('pointerdown',()=>{lastUserT=performance.now();camGoal=null},true);
function camFocus(x,z,zm){if(!autoCam||!S)return;const now=performance.now();if(now-lastUserT<7000||now-lastFocusT<45000)return;if(!$('sheet').hidden||placing||(typeof ladTool!=='undefined'&&ladTool)||document.body.classList.contains('photo'))return;
 lastFocusT=now;camGoal={x,z,zm:zm||1.9,t:0};follow=false;if(overview)overview=null}
function camTick(rdt){if(!camGoal)return;camGoal.t+=rdt;const k=Math.min(1,rdt*1.5);camT.x+=(camGoal.x-camT.x)*k;camT.z+=(camGoal.z-camT.z)*k;zoomT+=(camGoal.zm-zoomT)*k;setCam();if(camGoal.t>3.5)camGoal=null}
{const _sf=startFire;startFire=function(b){_sf(b);if(b&&S){const c=bCenter(b);camFocus(c.x,c.z,1.8)}}}

// ---------- obrzędy i wesela ----------
const CER_N={kupala:'Noc Kupały',dziady:'Dziady',gody:'Szczodre Gody',marzanna:'Topienie Marzanny',wesele:'Wesele'};
function waterNear(x,z){const[ci,cj]=tileOf(x,z);let best=null,bd=1e9;for(let r=2;r<28;r+=1)for(let a=0;a<24;a++){const i=Math.round(ci+Math.cos(a/24*6.283)*r),j=Math.round(cj+Math.sin(a/24*6.283)*r);if(i<1||j<1||i>=N-1||j>=N-1)continue;if(!land[j*N+i]&&tileHH(i,j)<-.15){const d=Math.hypot(i-ci,j-cj);if(d<bd){bd=d;best=[i,j]}}}return best?{x:tcx(best[0]),z:tcx(best[1])}:null}
function cerCenter(k){let x=tcx(camp.i),z=tcx(camp.j)+2.2;const gj=S.bld.find(b=>b.kind==='gaj'&&bDone(b)),cm=S.bld.find(b=>b.kind==='cmentarz'&&bDone(b));
 if(k==='kupala'&&gj){const c=bCenter(gj);x=c.x;z=c.z+2.6}if(k==='dziady'&&cm){const c=bCenter(cm);x=c.x;z=c.z+2.4}
 if(k==='marzanna'){const w=waterNear(x,z);if(w){const dx=w.x-x,dz=w.z-z,l=Math.hypot(dx,dz)||1;x=w.x-dx/l*2.4;z=w.z-dz/l*2.4}}
 const t=nearestWalk(...tileOf(x,z));if(t){x=tcx(t[0]);z=tcx(t[1])}return{x,z}}
function cerSet(k,ids,dayOff){const d=Math.floor(S.day)+(dayOff||0);if(S.cer&&S.cer.d===d&&S.cer.k!=='wesele'&&k!=='wesele')return;S.cer={k,d,ids:ids||[],c:cerCenter(k),t0:T1-.045,t1:T1+.12}}
const cerActive=()=>!!(S&&S.cer&&Math.floor(S.day)===S.cer.d&&tod()>=S.cer.t0&&tod()<S.cer.t1);
function cerIn(p){return p.age>=3&&p.job!=='wyp'&&p.state!=='away'&&p.hp>.3&&!p.fireB}
let cerRT=null;// stan wizualny obrzędu
function cerStart(){if(cerRT)cerEnd();const C=S.cer;C.slots=S.people.filter(cerIn).map(p=>p.id);C.on=1;const y=Hy(C.c.x,C.c.z);
 // 4.6.0-rc.4: przy Marzannie ludzie stoją półkolem od strony lądu, nie w wodzie
 if(C.k==='marzanna'){const w=waterNear(C.c.x,C.c.z);C.land=w?Math.atan2(C.c.z-w.z,C.c.x-w.x):Math.PI/2}
 const g=new THREE.Group();scene.add(g);const dance=C.k!=='dziady';cerRT={g,t:0,mus:2,w:[],eff:null};
 if(dance||C.k==='marzanna'){const f=makeFire(g,C.c.x,y,C.c.z);f.scale.setScalar(C.k==='marzanna'?1.2:2.3)}
 if(C.k==='wesele'){const pole=new THREE.Group();pole.add(cyl(.04,2.2,matDark,0,1.1,0,0,0,0,5));[0xc8463c,0xe8c84a,0xf2efe4,0x4a6a9a].forEach((c,i)=>{const r=new THREE.Mesh(new THREE.PlaneGeometry(.06,.9),M(c,{side:THREE.DoubleSide}));r.position.set(Math.cos(i*1.6)*.07,1.75,Math.sin(i*1.6)*.07);r.rotation.y=i*1.6;pole.add(r)});pole.add(mesh(new THREE.SphereGeometry(.22,7,5),M(0x5c7f3a),0,2.25,0));pole.position.set(C.c.x+1.4,Hy(C.c.x+1.4,C.c.z-1),C.c.z-1);g.add(pole)}
 if(C.k==='dziady'){for(let q=0;q<12;q++){const a=q/12*6.283,x=C.c.x+Math.cos(a)*1.3,z=C.c.z-1.4+Math.sin(a)*.9;g.add(cyl(.035,.12,M(0xe8dcc0),x,Hy(x,z)+.06,z,0,0,0,5));const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffb060,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.8}));s.scale.set(.5,.5,1);s.position.set(x,Hy(x,z)+.2,z);g.add(s);cerRT.w.push({s,ph:q})}}
 if(C.k==='kupala'){const w=waterNear(C.c.x,C.c.z);if(w){for(let q=0;q<7;q++){const wr=new THREE.Group();wr.add(mesh(new THREE.TorusGeometry(.16,.05,5,10),M(0x4f7a34),0,0,0,Math.PI/2));for(let f=0;f<4;f++)wr.add(mesh(new THREE.SphereGeometry(.04,5,4),M([0xe8c84a,0xc8463c,0xf2efe4,0x8a6ab8][f]),Math.cos(f*1.6)*.16,.04,Math.sin(f*1.6)*.16));
   const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffc070,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.9}));s.scale.set(.6,.6,1);s.position.y=.15;wr.add(s);
   const dx=w.x-C.c.x,dz=w.z-C.c.z,l=Math.hypot(dx,dz)||1;wr.position.set(w.x+(q-3)*.35,0,w.z);g.add(wr);cerRT.w.push({wr,vx:dx/l*.12+(q-3)*.01,vz:dz/l*.12,ph:q,delay:q*1.6})}}}
 if(C.k==='marzanna'){const ef=new THREE.Group();ef.add(cyl(.03,1.4,matDark,0,.7,0,0,0,0,5));ef.add(mesh(new THREE.ConeGeometry(.28,.8,7),M(0xc9b87a),0,.75,0));ef.add(mesh(new THREE.SphereGeometry(.13,7,5),M(0xd8cfb4),0,1.28,0));ef.add(mesh(new THREE.BoxGeometry(.7,.05,.05),matDark,0,1.05,0));
  [0xc8463c,0x4a6a9a,0xe8c84a].forEach((c,i)=>{const r=new THREE.Mesh(new THREE.PlaneGeometry(.05,.5),M(c,{side:THREE.DoubleSide}));r.position.set(-.3+i*.3,.8,.1);ef.add(r)});ef.position.set(C.c.x,Hy(C.c.x,C.c.z),C.c.z);g.add(ef);cerRT.eff={ef,w:waterNear(C.c.x,C.c.z)}}
 camFocus(C.c.x,C.c.z,2.0);if(C.k==='wesele'||C.k==='kupala')toast(CER_N[C.k]+': cała osada przy ogniu')}
function cerEnd(){if(cerRT){for(let k=fires.length-1;k>=0;k--){let o=fires[k].g;while(o&&o!==cerRT.g)o=o.parent;if(o)fires.splice(k,1)}scene.remove(cerRT.g);cerRT=null}if(S&&S.cer)S.cer.on=0;if(S)S.people.forEach(p=>{if(p.cerA||(p.state==='move'&&!p.path)){p.cerA=0;if(p.state==='move'&&!p.path){p.state='idle';p.wait=.2}}})}
function cerPos(p,C){const n=C.slots.length,i=C.slots.indexOf(p.id),t=clock;const cx=C.c.x,cz=C.c.z;
 if(C.k==='wesele'&&C.ids.includes(p.id)){const s=C.ids.indexOf(p.id)?1:-1;return{x:cx+s*.55+Math.sin(t*1.3)*.1,z:cz+1.15,dir:s>0?-Math.PI/2:Math.PI/2,move:false}}
 if(C.k==='dziady'){const a=Math.PI*(.15+.7*(i/Math.max(1,n-1)));const r=2.4+(i%2)*.7;const x=cx+Math.cos(a)*r,z=cz-1.4+Math.sin(a)*r;return{x,z,dir:Math.atan2(cx-x,cz-1.4-z),move:false}}
 if(C.k==='marzanna'){const base=C.land===undefined?Math.PI/2:C.land,a=base+Math.PI*(-.32+.64*(i/Math.max(1,n-1))),r=2.2+(i%2)*.8;let x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;
  const t=tileOf(x,z);if(!okReach(t[0],t[1])){const s=nearReach(t[0],t[1],8)||nearestWalk(t[0],t[1]);if(s){x=tcx(s[0]);z=tcx(s[1])}}return{x,z,dir:Math.atan2(cx-x,cz-z),move:false}}
 const outer=p.sex==='m'&&p.age>=12||i%3===2;const r=outer?2.9+n*.03:1.9+n*.02,w=outer?-.32:.42;const a=(i/n)*6.283+t*w;return{x:cx+Math.cos(a)*r,z:cz+Math.sin(a)*r,dir:a+(w>0?0:Math.PI),move:true}}
{const _sp=stepPerson;stepPerson=function(p,dt){const C=S.cer;if(C&&C.on&&cerActive()&&C.slots&&C.slots.includes(p.id)&&cerIn(p)){const q=cerPos(p,C);
  if(!p.cerA){const dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz);if(d<.6){p.cerA=1}else{const st=Math.min(d,(isChild(p)?1.8:2.5)*dt);p.x+=dx/d*st;p.z+=dz/d*st;p.dir=Math.atan2(dx,dz);p.state='move';p.path=null;p.act='idzie na '+CER_N[C.k].toLowerCase();return}}
  p.x+=(q.x-p.x)*Math.min(1,dt*6);p.z+=(q.z-p.z)*Math.min(1,dt*6);p.dir=q.dir;p.state=q.move?'move':'idle';p.path=null;p.act=q.move?'tańczy przy ogniu':C.k==='dziady'?'wspomina zmarłych':'patrzy';return}
 _sp(p,dt)}}
function cerFrame(rdt){if(!S)return;const C=S.cer,act=cerActive();if(act&&C&&(!C.on||!cerRT||!C.slots))cerStart();if(!act&&(cerRT||(C&&C.on)))cerEnd();/* 4.8: obrzęd zapisany jako trwający, a już po czasie, też się kończy */if(!cerRT)return;cerRT.t+=rdt;
 firelight.position.set(C.c.x,Hy(C.c.x,C.c.z)+2,C.c.z);firelight.intensity=Math.max(firelight.intensity,(C.k==='dziady'?1.4:3.2)*(1+.15*Math.sin(clock*9)));
 cerRT.w.forEach(w=>{if(w.s&&!w.wr)w.s.material.opacity=.55+.3*Math.sin(clock*7+w.ph);if(w.wr){if(cerRT.t<w.delay){w.wr.visible=false;return}w.wr.visible=true;w.wr.position.x+=w.vx*rdt*(S.speed||1);w.wr.position.z+=w.vz*rdt*(S.speed||1);w.wr.position.y=.02+Math.sin(clock*1.6+w.ph)*.04;w.wr.rotation.y+=rdt*.2}});
 if(cerRT.eff){const e=cerRT.eff,u=cerRT.t;if(e.w&&u>6){const k=Math.min(1,(u-6)/6);e.ef.position.x=C.c.x+(e.w.x-C.c.x)*k;e.ef.position.z=C.c.z+(e.w.z-C.c.z)*k;e.ef.position.y=Hy(e.ef.position.x,e.ef.position.z)*(1-k)+(-.3-Math.max(0,u-12)*.08)*k;e.ef.rotation.z=k*.9}}
 if(C.k!=='dziady'){cerRT.mus-=rdt;if(cerRT.mus<=0){cerRT.mus=5+Math.random()*3;if(typeof fujarka==='function')fujarka()}}}
function cerDaily(){const rd=Math.floor(rday()),yr=Math.floor(S.day/YEAR),ob=law('obrzedy');
 if(rd===0&&yr>=1)cerSet('kupala');else if(rd===9&&(S.died||0)>=1&&ob)cerSet('dziady');else if(rd===12&&ob)cerSet('gody');else if(rd===15&&ob)cerSet('marzanna')}
{const _w=wedding;wedding=function(k,m){_w(k,m);if(S)cerSet('wesele',[k.id,m.id],tod()>T1-.06?1:0)}}

// ---------- burze ----------
let flashA=0,boltT=8,boltM=null;const boltMat=new THREE.MeshBasicMaterial({color:0xe8f0ff,transparent:true,opacity:0,toneMapped:false,depthWrite:false});
function thunder(delay,str){if(typeof AUD==='undefined'||!AUD||muted)return;try{const t=AUD.currentTime+delay,len=AUD.sampleRate*3,b=AUD.createBuffer(1,len,AUD.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;l=(l+.04*w)/1.04;d[i]=l*6*Math.pow(1-i/len,1.6)*(1+.6*Math.sin(i/len*30))}
 const s=AUD.createBufferSource();s.buffer=b;const f=AUD.createBiquadFilter();f.type='lowpass';f.frequency.value=180+str*200;const g=AUD.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.25*str,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+2.8);s.connect(f);f.connect(g);g.connect(AUD.destination);s.start(t)}catch(e){}}
function bolt(x,z){if(boltM){scene.remove(boltM);boltM.children.forEach(c=>c.geometry.dispose())}const g=new THREE.Group();let px=x+(Math.random()-.5)*6,py=Hy(x,z)+34,pz=z+(Math.random()-.5)*6;const y0=Hy(x,z);
 for(let k=0;k<11;k++){const t=(k+1)/11,nx=x+(px-x)*(1-t)*.3+(Math.random()-.5)*1.6*(1-t),ny=y0+(py-y0)*(1-t),nz=z+(pz-z)*(1-t)*.3+(Math.random()-.5)*1.6*(1-t);
  const L=Math.hypot(nx-px,ny-py,nz-pz),m=new THREE.Mesh(new THREE.BoxGeometry(.16,L,.16),boltMat);m.position.set((px+nx)/2,(py+ny)/2,(pz+nz)/2);m.lookAt(nx,ny,nz);m.rotateX(Math.PI/2);g.add(m);px=nx;py=ny;pz=nz}
 scene.add(g);boltM=g;boltMat.opacity=1}
function stormTick(rdt){if(!S)return;const k=S.weather.k;if(boltMat.opacity>0){boltMat.opacity=Math.max(0,boltMat.opacity-rdt*3.5);if(boltMat.opacity===0&&boltM){scene.remove(boltM);boltM=null}}
 flashA=Math.max(0,flashA-rdt*4);if(WX.storm<.15||!S.speed)return;boltT-=rdt*Math.min(3,S.speed);if(boltT>0)return;boltT=(2+Math.random()*7)/Math.max(.25,WX.storm);
 const a=Math.random()*6.283,r=6+Math.random()*26/Math.max(.5,zoom),x=camT.x+Math.cos(a)*r,z=camT.z+Math.sin(a)*r;flashA=1;gameLater(()=>flashA=.8,120);bolt(x,z);thunder(Math.min(2.5,r*.06),1.2-Math.min(.8,r/40));
 wxBoltHit(x,z);if(Math.random()<.18){const t=nodeBy.tree.filter(n=>n.amt>0&&revAt(n.i,n.j)&&Math.hypot(n.x-x,n.z-z)<8).sort((p,q)=>q.sc-p.sc)[0];if(t){t.amt=0;const q=nodes.indexOf(t);if(q>=0)S.nodeAmt[q]=0;nodeVis(t);bolt(t.x,t.z);dustPuff(t.x,Hy(t.x,t.z)+1,t.z,6,1);
   if(!S.seen['piorun'+Math.floor(S.day/4)]){S.seen['piorun'+Math.floor(S.day/4)]=1;log('Piorun trzaska w wysokie drzewo za osadą. Zostaje osmalony kikut. Starzy mówią, że Perun bił w coś złego, co się w nim ukryło.');S.wh=(S.wh||0)+.005;if(typeof placeAdd==='function')placeAdd({oak:'Spalony Dąb',birch:'Spalona Brzoza',pine:'Spalona Sosna',spruce:'Spalony Świerk'}[t.sp]||'Spalone Drzewo',t.x,t.z,'tu piorun trafił w drzewo')}}}}
{const _l=lighting;lighting=function(){const L=_l();if(flashA>0){hemi.intensity+=flashA*2.4;renderer.toneMappingExposure+=flashA*.5;scene.background.lerp(new THREE.Color(0xc8d4ff),flashA*.45)}return L}}

// ---------- zorza ----------
// 3.5: zorza przypięta do świata, nie do ekranu. Dwie warstwy:
// 1) zielona poświata na ziemi, śniegu i morzu (w shaderach terenu i wody) — widać ją przy każdym przybliżeniu, niczego nie zasłania;
// 2) fałdowane kurtyny nad morzem za wyspą, po przeciwnej stronie niż patrzący — widać je z daleka i przy brzegu, nigdy nad lądem.
const AUR_GL=`float a_hs(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5453);}
float a_vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*f*(f*(f*6.-15.)+10.);return mix(mix(a_hs(i),a_hs(i+vec2(1,0)),f.x),mix(a_hs(i+vec2(0,1)),a_hs(i+vec2(1,1)),f.x),f.y);}
vec3 aurGround(vec2 p,float t){vec2 q=p*.011;float w=a_vn(q*vec2(1.,.7)+vec2(t*.011,-t*.007))*2.2+a_vn(q*2.3-vec2(t*.006,0.))*.8;float b=.5+.5*sin(q.y*3.2+q.x*.9+w*2.4+t*.03);b=b*b*b;b*=smoothstep(.2,.7,a_vn(q*.8+vec2(7.,-t*.005)));
 float fl=.55+.45*a_vn(p*.045+vec2(t*.02,0.));vec3 c=mix(vec3(.12,.95,.55),vec3(.45,.32,.95),smoothstep(.35,.8,a_vn(q*.6+vec2(3.,t*.004))));return c*b*fl;}`;
const AUR={a:0},aurV=new THREE.Vector3();
const aurMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,side:THREE.DoubleSide,uniforms:{uT:{value:0},uA:{value:0}},
 vertexShader:`varying vec2 vU;uniform float uT;
 float h1(float x){return fract(sin(x*127.1)*43758.5);}float s1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h1(i),h1(i+1.),f);}
 void main(){vU=uv;vec3 p=position;float u=uv.x;float fold=(s1(u*5.+uT*.02)-.5)*16.+sin(u*13.+uT*.05)*3.;vec2 d=normalize(p.xz);p.xz+=d*fold;
  p.y+=sin(u*9.+uT*.03)*1.4*uv.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
 fragmentShader:`varying vec2 vU;uniform float uT,uA;
 float h1(float x){return fract(sin(x*127.1)*43758.5);}float s1(float x){float i=floor(x),f=fract(x);f=f*f*f*(f*(f*6.-15.)+10.);return mix(h1(i),h1(i+1.),f);}
 void main(){float u=vU.x,v=vU.y;float r=s1(u*70.+uT*.05)*.55+s1(u*170.-uT*.08)*.3+s1(u*23.+uT*.03)*.35;r=smoothstep(.25,1.05,r);
  float edge=smoothstep(0.,.16,v)*exp(-v*2.4);float top=smoothstep(.25,1.,v)*(1.-smoothstep(.75,1.,v));
  float side=smoothstep(0.,.18,u)*smoothstep(1.,.82,u);float pul=.75+.25*s1(u*3.+uT*.04);
  vec3 c=vec3(.15,1.,.6)*edge*(.45+.75*r)+vec3(.55,.25,.9)*top*.45*(.5+.5*r);
  float a=(edge*(.4+.6*r)+top*.25)*side*pul*uA;gl_FragColor=vec4(c*side*pul*uA,a);}`});
const aurGeo=(()=>{const n=96,R=N*.5+14,H=46,y0=3,span=2.3;const P=[],U=[],I=[];for(let k=0;k<=n;k++){const u=k/n,a=(u-.5)*span;for(let r=0;r<2;r++){P.push(Math.cos(a)*R,y0+r*H,Math.sin(a)*R);U.push(u,r)}}
 for(let k=0;k<n;k++){const a=k*2;I.push(a,a+1,a+2,a+1,a+3,a+2)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);return g})();
const zorza=new THREE.Mesh(aurGeo,aurMat);zorza.renderOrder=4;zorza.frustumCulled=false;zorza.visible=false;scene.add(zorza);
// poświata w wodzie: woda odbija niebo mocniej niż ziemia
wUni.uAur={value:0};
wMat.fragmentShader=wMat.fragmentShader.replace('uniform float uGlint;','uniform float uGlint;uniform float uAur;\n'+AUR_GL+'\n').replace('gl_FragColor=vec4(c,a);','if(uAur>.001)c+=aurGround(vW.xz,uT)*uAur*.13*(.5+.5*smoothstep(.2,2.,d));\n  gl_FragColor=vec4(c,a);');wMat.needsUpdate=true;
// poświata na ziemi i śniegu
const AURU={uAur:{value:0},uAurT:{value:0}};
{const tm=terrain.material;const prev=tm.onBeforeCompile;tm.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);Object.assign(sh.uniforms,AURU);
  if(!/varying vec3 vAW;/.test(sh.vertexShader))sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vAW;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAW=(modelMatrix*vec4(transformed,1.)).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vAW;uniform float uAur;uniform float uAurT;\n'+AUR_GL)
   .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n if(uAur>.001)totalEmissiveRadiance+=aurGround(vAW.xz,uAurT)*diffuseColor.rgb*uAur*.55*smoothstep(-.05,.3,vAW.y);')};tm.needsUpdate=true}
function zorzaDaily(){const sea=seasonIdx(),w=S.weather.k;if(sea===2&&(w==='clear'||w==='frost')&&Math.random()<.3){S.zorzaN=Math.floor(S.day);
  if(!S.seen.zorza1){S.seen.zorza1=1;log('Nocą nad morzem tańczą zorze: zielone i fioletowe zasłony na całe niebo. Dzieci nie chcą iść spać. Starzy mówią, że to dusze przodków tańczą na niebie, bo jest im dobrze, że o nich pamiętamy.');if(typeof song==='function')song('Pieśń o zorzy nad morzem');S.hope=clamp(S.hope+.02,0,1)}
  else if(Math.random()<.35)log('Znowu zorze nad morzem. Ludzie stoją przed chatami z zadartymi głowami.')}}
function zorzaFrame(rdt,Lt){const on=S&&S.zorzaN===Math.floor(S.day+(tod()<.3?-1:0))&&Lt&&Lt.night>.4&&(S.weather.k==='clear'||S.weather.k==='frost');const tgt=on?Math.min(1,(Lt.night-.4)*2):0;AUR.a+=(tgt-AUR.a)*Math.min(1,rdt*.35);if(AUR.a<.004)AUR.a=tgt?AUR.a:0;
 const a=AUR.a;wUni.uAur.value=a;AURU.uAur.value=a;zorza.visible=a>.01;if(!a)return;const t=clock;AURU.uAurT.value=t;aurMat.uniforms.uT.value=t;aurMat.uniforms.uA.value=a;
 // kurtyny po drugiej stronie wyspy niż patrzący: obracają się z kamerą, nie jeżdżą za nią
 cam.getWorldDirection(aurV);zorza.rotation.y=-Math.atan2(aurV.z,aurV.x)}
{const _at=atmosphere;atmosphere=function(rdt,Lt){_at(rdt,Lt);zorzaFrame(rdt,Lt)}}

// ---------- dźwięk w przestrzeni: praca słychać tam, gdzie się dzieje ----------
const _v3s=new THREE.Vector3();
function sfxAt(kind,x,z){if(typeof AUD==='undefined'||!AUD||muted)return;_v3s.set(x,Hy(x,z),z).project(cam);if(Math.abs(_v3s.x)>1.15||Math.abs(_v3s.y)>1.15)return;
 const pan=Math.max(-1,Math.min(1,_v3s.x*.85)),vol=Math.min(1.3,Math.max(.25,zoom/1.6))*(1-.35*Math.hypot(_v3s.x,_v3s.y));const t=AUD.currentTime;let out=AUD.destination;
 try{if(AUD.createStereoPanner){const p=AUD.createStereoPanner();p.pan.value=pan;p.connect(AUD.destination);out=p}
  const noise=(len,f,q,g,type)=>{const b=AUD.createBuffer(1,Math.floor(AUD.sampleRate*len),AUD.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);const s=AUD.createBufferSource();s.buffer=b;const fl=AUD.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.value=f;fl.Q.value=q;const gn=AUD.createGain();gn.gain.value=g*vol;s.connect(fl);fl.connect(gn);gn.connect(out);s.start(t)};
  const tone=(f0,f1,dur,g,type)=>{const o=AUD.createOscillator(),gn=AUD.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);gn.gain.setValueAtTime(.0001,t);gn.gain.exponentialRampToValueAtTime(g*vol,t+.005);gn.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(gn);gn.connect(out);o.start(t);o.stop(t+dur+.02)};
  if(kind==='chop'){noise(.08,900,1.2,.09);tone(140,70,.12,.06)}
  else if(kind==='stone'){noise(.04,2600,3,.06);gameLater(()=>{},0)}
  else if(kind==='hammer'){tone(240,160,.07,.05,'triangle');noise(.03,1800,2,.04)}
  else if(kind==='anvil'){tone(1350,1300,.5,.035);tone(2050,2000,.35,.02)}
  else if(kind==='saw'){noise(.25,1400,6,.035)}}catch(e){}}
let wsT=1;
function workSoundTick(rdt){wsT-=rdt;if(wsT>0||!S||!S.speed)return;wsT=.35+Math.random()*.7;const R=20/Math.max(.4,zoom);
 const c=S.people.filter(p=>p.state==='work'&&Math.abs(p.x-camT.x)<R&&Math.abs(p.z-camT.z)<R);if(!c.length)return;const p=c[(Math.random()*c.length)|0];const b=p.wb?bById(p.wb):null;
 let k=null;if(p.workKind==='build'||p.workKind==='wreck')k='hammer';else if(p.workKind==='work'&&b)k=b.kind==='drwal'?'chop':b.kind==='kamien'||b.kind==='ruda'?'stone':null;else if(p.workKind==='prod'&&b)k=b.kind==='kuznia'?'anvil':b.kind==='pracownia'?'saw':b.kind==='drewutnia'?'chop':b.kind==='warsztat'?'hammer':null;
 if(k)sfxAt(k,p.x,p.z)}
{const _st=soundTick;soundTick=function(rdt,Lt){_st(rdt,Lt);try{workSoundTick(rdt)}catch(e){}}}

// ---------- opowieści życia ----------
function zyAdd(p,t){if(!p)return;p.zy=p.zy||[];p.zy.push([Math.floor(S.day)+1,t]);if(p.zy.length>14)p.zy.shift()}
{const _w=wedding;wedding=function(k,m){_w(k,m);zyAdd(k,'ślub z '+m.name);zyAdd(m,'ślub z '+k.name)}}
function lvWord(l){return l>=5?'mistrz nad mistrzami':l>=4?'mistrz':l>=3?'czeladnik':l>=2?'zna się na rzeczy':'dopiero się uczy'}
function lifeStory(p){const L=[];const bd=Math.max(1,Math.floor(S.day-p.age*YEAR/2)+1);
 L.push(p.born?`Urodził${p.sex==='k'?'a':''} się na wyspie (${dayName(bd)}).`:`Wyszedł${p.sex==='k'?'a':''} na brzeg z rozbitego statku jako ${Math.max(0,Math.floor(p.age-S.day*2/YEAR))}-${gw(p,'latek','latka')}.`);
 const c=Object.keys(CN).sort((a,b)=>(p.sk[b]||0)-(p.sk[a]||0))[0];if(p.age>=12&&(p.sk[c]||0)>=1)L.push(`Fach: ${CN[c]}, ${lvWord(p.sk[c])}.`);
 const q=p.pair!==null&&p.pair!==undefined?pById(p.pair):null;const kids=S.people.filter(x=>(x.par||[]).includes(p.id));
 if(q)L.push(`${p.sex==='k'?'Mąż':'Żona'}: ${q.name}.`);if(kids.length)L.push(`Dzieci: ${kids.map(x=>x.name).join(', ')}.`);
 if(typeof OFFS!=='undefined')OFFS.forEach(o=>{if(offHolder(o.id)===p)L.push(`Urząd: ${offTitle(o.id,p).toLowerCase()}.`)});
 (S.pamiatki||[]).forEach(it=>{if(it.by===p.name)L.push(`Zrobił${p.sex==='k'?'a':''}: ${it.n.toLowerCase()}.`);else if(it.owner===p.id)L.push(`Ma pamiątkę: ${it.n.toLowerCase()}.`)});
 (p.zy||[]).forEach(([d,t])=>{if(!t.startsWith('ślub'))L.push(`${dayName(d)}: ${t}.`)});
 if(typeof friendsOf==='function'){const f=friendsOf(p)[0];if(f)L.push(`Najbliżej ${p.sex==='k'?'jej':'mu'} do: ${f[0].name}.`)}
 return L}
{const _lc=ludCard;ludCard=function(p){let h=_lc(p);try{const L=lifeStory(p);h+=`<div class="card" style="margin-top:8px"><h4 style="font-size:15px">Opowieść życia</h4><p class="mut" style="line-height:1.5">${L.join(' ')}</p></div>`}catch(e){}return h}}
{const _kp=killPerson;killPerson=function(p,why){let t='';try{const L=lifeStory(p).filter(x=>!x.startsWith('Najbliżej'));t=`Wspomnienie: ${p.name}, ${Math.floor(p.age)} l. ${L.join(' ')}`}catch(e){}_kp(p,why);if(t&&S){S.wspom=S.wspom||[];S.wspom.push({d:Math.floor(S.day)+1,t});if(S.wspom.length>80)S.wspom.shift();log(t)}}}
{const _kt=ksiegaText;ksiegaText=function(){let t=_kt();const w=(S.wspom||[]).slice(-30);if(!w.length)return t;const sec='WSPOMNIENIA\n\n'+w.map(x=>x.t).join('\n')+'\n\n';const k=t.indexOf('Pamięć osady:');return k>=0?t.slice(0,k)+sec+t.slice(k):t+'\n\n'+sec}}

// ---------- codziennie, co klatkę, ustawienia ----------
{const _ad=actDaily;actDaily=function(){_ad();cerDaily();zorzaDaily()}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;camTick(rdt);cerFrame(rdt);stormTick(rdt)}}
{const _kt=kronTools;kronTools=function(){return _kt()+uiDisclosure('game:camera','Kamera',`<div class="card"><h4>Kamera przy ważnych chwilach</h4><p class="mut">Przy obrzędach, weselach i pożarach kamera sama płynie w to miejsce, jeśli nie przesuwasz widoku.</p><button data-autocam class="${autoCam?'pri':''}">${autoCam?'Włączona':'Wyłączona'}</button></div>`)}}
document.addEventListener('click',e=>{if(!e.target.closest('[data-autocam]'))return;autoCam=!autoCam;try{localStorage.setItem('przystan-autocam',autoCam?'1':'0')}catch(er){}renderPanel()});

{const _sT=storyTick;storyTick=function(){if(cerActive())return;_sT()}}
