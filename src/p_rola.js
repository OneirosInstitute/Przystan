
/* ================= 3.2: uprawa roli — gleba, wilgoć, uprawy, szkody, nowe pole ================= */
const SOIL={czarna:{n:'czarna ziemia',f0:1.1,y:1.08,dry:1,c:0x4a3826,d:'najlepsza: tłusta i ciemna'},lesna:{n:'leśna ziemia',f0:.95,y:1,dry:.9,c:0x55402a,d:'próchnica po lesie, pełna korzeni'},
 piasek:{n:'piaszczysta',f0:.9,y:.92,dry:1.4,c:0x8a7550,d:'lekka i sucha, szybko traci wodę'},mokra:{n:'podmokła',f0:1.05,y:1,dry:.55,c:0x3a3226,d:'żyzna, ale w ulewy staje na niej woda'},
 kamien:{n:'kamienista',f0:.9,y:.92,dry:1.15,c:0x6a5e4c,d:'pełna kamieni, ciężko się orze'}};
const CROP={zboze:{n:'zboże',acc:'zboże',res:'ziarno',k:1},len:{n:'len',acc:'len',res:'wlokna',k:.55},kapusta:{n:'kapusta i rzepa',acc:'kapustę i rzepę',res:'warzywa',k:.8}};
function soilAt(i0,j0,w,h){const c={};let sl=0,n=0;for(let a=0;a<w;a++)for(let b=0;b<h;b++){const i=i0+a,j=j0+b;if(i<0||j<0||i>=N||j>=N)continue;const bi=biomeOf(i,j);c[bi]=(c[bi]||0)+1;sl+=slope(i,j);n++}
 if(!n)return'czarna';const bi=Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];
 if((c.wet||0)>=n*.35)return'mokra';if(bi==='coast'||(c.coast||0)>=n*.4)return'piasek';if(bi==='high'||sl/n>.6)return'kamien';if(bi==='meadow')return'czarna';return'lesna'}
function rolaInit(b){const f=b.field;if(!f)return null;if(!f.soil){f.soil=soilAt(b.i,b.j,BD[b.kind].w,BD[b.kind].h);if(!f.harvN&&f.st==='puste'&&f.fert>=.999)f.fert=SOIL[f.soil].f0}
 if(f.m===undefined)f.m=.55;if(!f.want)f.want='zboze';if(f.st!=='puste'&&!f.cur)f.cur='zboze';return f}
const cropKnown=c=>c==='zboze'||(c==='len'&&tech('u_len'))||(c==='kapusta'&&S.know.warzywa==='tak');
// co pójdzie w ziemię przy najbliższym siewie: w trójpolówce wybór dotyczy roku jarego
function rolaNext(b){const f=b.field;if(!f)return'zboze';fieldInit(f);if(f.mode==='trzy'&&f.rot!==1)return'zboze';const w=f.want||'zboze';return cropKnown(w)?w:'zboze'}
const rolaCur=b=>(b.field&&b.field.cur)||'zboze';
function rolaMoistMul(f,b){const m=f.m;if(m<.15)return .35;if(m<.3)return .7;if(m<=.8)return 1;if(f.soil==='mokra'&&!hasExt(b,'rowy'))return m>.9?.5:.75;return m>.92?.7:.88}
const rolaWords=m=>m<.15?'sucha jak pieprz':m<.3?'przesycha':m<=.8?'w sam raz':m<=.92?'mokra':'stoi na niej woda';
function rolaWater(b){const f=b.field;if(f.wsD===Math.floor(S.day))return f.ws;f.wsD=Math.floor(S.day);const c=bCenter(b);
 let ok=S.bld.some(w=>w.kind==='studnia'&&bDone(w)&&Math.hypot(bCenter(w).x-c.x,bCenter(w).z-c.z)<16);
 if(!ok){const[ci,cj]=tileOf(c.x,c.z);for(let r=3;r<=6&&!ok;r++)for(let a=0;a<12&&!ok;a++){const i=Math.round(ci+Math.cos(a*.52)*r),j=Math.round(cj+Math.sin(a*.52)*r);if(i>=0&&j>=0&&i<N&&j<N&&!land[j*N+i])ok=true}}
 f.ws=ok;return ok}
function rolaBoars(b){const c=bCenter(b);return S.herds.find(h=>h.type==='dzik'&&h.n>0&&Math.hypot(h.x-c.x,h.z-c.z)<22)}
function rolaProt(b){return(hasExt(b,'plot')?.3:1)*(hasExt(b,'strach')?.85:1)*(typeof dogGuard==='function'?dogGuard():1)*(S.fieldWatch>S.day?.35:1)*(S.bld.some(h=>h.kind==='mysliwy'&&bDone(h)&&Math.hypot(bCenter(h).x-bCenter(b).x,bCenter(h).z-bCenter(b).z)<20)?.75:1)}
// ---------- dzień na polach ----------
function rolaDaily(){const sea=seasonIdx(),k=S.weather.k,i=wxI(),day=Math.floor(S.day),sk=Math.floor(S.day/SD);let boarHit=null;
 S.bld.forEach(b=>{const f=b.field;if(!f||!bDone(b))return;rolaInit(b);const so=SOIL[f.soil];
  let dm;if(sea===2)dm=(.65-f.m)*.3;else{dm=({rain:.08+.2*i,storm:.3,burza:.3,grad:.2,odwilz:.25,fog:.04,snow:.05,clear:sea===0?-.1:-.06,drought:-.17,wiatr:-.11,babie:-.07,frost:-.02})[k]||0;if(dm<0)dm*=so.dry;else if(f.soil==='mokra')dm*=1.2}
  f.m=clamp(f.m+dm,0,1);if(hasExt(b,'rowy')&&f.m>.75)f.m=Math.max(.75,f.m-.12);
  const c=rolaCur(b);
  if(f.st==='rosnie'&&sea!==2){const mm=rolaMoistMul(f,b),cm=c==='len'?1.25:c==='kapusta'?.95:1;const base=K/30*(tech('u_selek')?1.15:1)*(hasExt(b,'rowy')?1.15:1);f.g=Math.max(0,f.g+base*(mm*cm-1));if(mm<.75)f.ms=(f.ms||0)+1;
   if(f.m<.15&&!rolaWater(b)&&!S.seen['susza'+sk]){S.seen['susza'+sk]=1;log('Na polach ziemia pęka od suszy, zboże więdnie. Bez studni w pobliżu nie ma czym podlać.')}
   if(f.soil==='mokra'&&f.m>.95&&!hasExt(b,'rowy')&&!S.seen['zalew'+sk]){S.seen['zalew'+sk]=1;log('Na podmokłym polu stoi woda i zboże żółknie. Rowy odprowadziłyby ją do strumienia.')}}
  // przymrozek na wschodach
  if(S.szron===day&&sea===3&&f.st==='rosnie'&&f.g<.4&&c!=='kapusta'){f.g=Math.max(0,f.g-.1);if(!S.seen['przym'+day]){S.seen['przym'+day]=1;log('Przymrozek ściął młode wschody. Odbiją, ale straciły kilka dni.')}}
  // grad
  if(k==='grad'&&f.gradD!==day&&(f.st==='rosnie'||f.st==='dojrzale')){f.gradD=day;if(f.st==='rosnie'){f.g=Math.max(0,f.g-.15);f.q=Math.max(0,(f.q||0)-.2)}else f.left=Math.floor(f.left*(c==='kapusta'?.85:c==='len'?.75:.65));f.hit=S.day;
   if(!S.seen['grad'+day]){S.seen['grad'+day]=1;log('Grad położył zboże na polach. Kłosy leżą w błocie, część da się jeszcze podnieść.');toast('Grad na polach')}}
  // deszcz w żniwa: ziarno kiełkuje w kłosach
  if(f.st==='dojrzale'&&c==='zboze'&&wxWetDay()&&f.left>0){f.left=Math.floor(f.left*(k==='storm'||k==='burza'?.93:.96));if(!S.seen['poras'+sk]){S.seen['poras'+sk]=1;log('Deszcz w żniwa: ziarno w niezebranych kłosach zaczyna kiełkować. Trzeba zbierać, póki coś zostało.')}}
  // dziki ryją nocą
  if((f.st==='rosnie'||f.st==='dojrzale')&&sea!==2){const h=rolaBoars(b);if(h&&Math.random()<.07*rolaProt(b)){f.ryte=S.day;if(f.st==='rosnie'){f.g=Math.max(0,f.g-.12);f.q=Math.max(0,(f.q||0)-.3)}else f.left=Math.floor(f.left*.8);boarHit=b}}
  fieldVis(b)});
 if(boarHit){if(!S.dzikEv){S.dzikEv=1;rolaBoarEvent(boarHit)}else if(!S.seen['dzikL'+sk]){S.seen['dzikL'+sk]=1;log('Dziki znów ryły nocą na polu przy lesie.')}}}
const DZ_EV={t:'Dziki w zbożu',ey:'Pole',text:c=>`Rano pole przy lesie wygląda jak po orce: dziki przyszły nocą, zryły bruzdy i wydeptały połowę zasiewu. Ślady prowadzą do zarośli.\n\nJeśli nic się nie zrobi, wrócą.`,
 opts:[{n:'Czuwać nocami przy polach',d:'dziki rzadziej, ale ludzie są niewyspani',f:()=>{S.fieldWatch=S.day+YEAR*.5;return'Mężczyźni na zmianę siedzą przy ognisku na skraju pola, z kołatkami i psami. Dziki trzymają się z daleka, ale w dzień ludzie ziewają przy pracy.'}},
  {n:'Ogrodzić pola płotem z żerdzi',d:'8 kłód na każde pole przy lesie',f:()=>{const L=S.bld.filter(b=>b.field&&bDone(b)&&!hasExt(b,'plot')&&rolaBoars(b));let n=0;for(const b of L){if(S.res.drewno<8)break;S.res.drewno-=8;b.ext=(b.ext||[]).concat(['plot']);rebuildMesh(b);n++}
   return n?`Wokół ${n===1?'pola':n+' pól'} staje płot z żerdzi wbitych w ziemię. Dzik się przeciśnie, ale nie tak łatwo.`:'Na płot nie starczy drewna. Trzeba go będzie postawić później, przy rozbudowie pola.'}},
  {n:'Zapolować na dziki',d:'mięso, ale dzik potrafi zranić',f:()=>{const b=S.bld.filter(x=>x.field&&bDone(x)).map(rolaBoars).find(Boolean);const ad=S.people.filter(p=>isAdult(p)&&p.job!=='wyp'&&p.hp>.5);
   if(!b||!ad.length)return'Nie ma kogo posłać. Dziki zostają w zaroślach.';const n=Math.min(2,b.n);b.n-=n;S.res.mieso=(S.res.mieso||0)+10*n;const p=ad.sort((x,y)=>(y.sk.mysliwy||0)-(x.sk.mysliwy||0))[0];
   if(Math.random()<.3){p.hp=Math.max(.15,p.hp-.35);p.hurt=1;return`Obława w zaroślach. ${n} ${n===1?'dzik':'dziki'} padają, ale odyniec rozpruwa ${p.name} udo. Wróci do sił za kilka dni.`}
   return`Obława w zaroślach. ${n===1?'Dzik pada':'Dwa dziki padają'} pod oszczepami. Mięsa starczy na kilka dni, a reszta stada odchodzi w głąb lasu.`}}]};
function rolaBoarEvent(b){if(typeof evOpen!=='undefined'&&evOpen){S.dzikEv=0;return}try{openEvent(DZ_EV,{b})}catch(e){console.warn(e)}}
{const _fd=fieldDaily;fieldDaily=function(){S.bld.forEach(b=>{if(b.field&&b.field.st==='dojrzale'&&rolaCur(b)==='kapusta')b.field.frostHit=1});_fd();try{rolaDaily()}catch(e){console.warn(e)}}}
{const _e=eff;eff=function(p){return _e(p)*(S&&S.fieldWatch>S.day&&isAdult(p)?.97:1)}}
// ---------- plon: gleba i susza ----------
{const _fm=fieldMul;fieldMul=function(b){const f=b.field;rolaInit(b);return _fm(b)*SOIL[f.soil].y*Math.max(.7,1-.05*(f.ms||0))}}
{const _fl=fertLoss;fertLoss=function(f){const c=f.cur||'zboze';return _fl(f)*(c==='len'?1.25:c==='kapusta'?1.1:1)}}
function rolaRipe(b,f){const c=rolaCur(b),n=Math.round(f.left*CROP[c].k);
 if(c==='len'){log(`Len na polu zbrązowiał, torebki nasion grzechoczą na wietrze. Czas go rwać: około ${n} włókna.`);toast('Len do rwania')}
 else if(c==='kapusta'){log(`Kapusta zawiązała twarde głowy, rzepa gruba jak pięść. Około ${n} warzyw do zebrania.`);toast('Kapusta do zbioru')}
 else{log('Zboże na polu dojrzało: około '+f.left+' ziarna do zebrania.');toast('Zboże dojrzało')}}
// siew: len i kapusta nie potrzebują ziarna
const rolaFree=b=>b&&b.field&&b.field.st==='puste'&&rolaNext(b)!=='zboze';
{const _pj=planJob;planJob=function(p){const b=p.job==='wb'&&p.wb?bById(p.wb):null;const free=rolaFree(b)&&S.res.ziarno<10;if(free)S.res.ziarno+=10;let r;try{r=_pj(p)}finally{if(free)S.res.ziarno-=10}
  if(b&&b.field){const f=b.field;rolaInit(b);
   if(!r&&f.st==='rosnie'&&f.q>=1&&f.m<.32&&rolaWater(b)){const e=entryOf(b.kind,b.i,b.j);if(e&&go(p,e,'field',b)){p.act='nosi wodę na pole';return true}}
   const c=f.st==='puste'?rolaNext(b):rolaCur(b);if(c!=='zboze'&&typeof p.act==='string'){const M=c==='len'?{sieje:'sieje len',pieli:'pieli len','żnie zboże':'rwie len','zboże rośnie':'len rośnie'}:{sieje:'sadzi kapustę i rzepę',pieli:'okopuje grządki','żnie zboże':'zbiera kapustę','zboże rośnie':'kapusta rośnie'};if(M[p.act])p.act=M[p.act]}}
  return r}}
{const _sp=stepPerson;stepPerson=function(p,dt){if(p.state!=='work'||p.workKind!=='field'||!p.tgt||!p.tgt.field)return _sp(p,dt);const b=p.tgt,f=b.field;rolaInit(b);const st0=f.st,nx=rolaNext(b),free=st0==='puste'&&nx!=='zboze';
  if(free)S.res.ziarno+=10;try{_sp(p,dt)}finally{if(free&&f.st==='puste')S.res.ziarno-=10}
  if(st0==='puste'&&f.st==='rosnie'){f.cur=nx;f.ms=0;f.stub=-9;f.hit=-9;if(nx!=='zboze')log(nx==='len'?'Na polu zasiano len. Za kilka tygodni zakwitnie na niebiesko.':'Na polu posadzono kapustę i rzepę. Trzeba pielić i okopywać.');fieldVis(b)}
  if(f.st==='rosnie'&&f.m<.32&&rolaWater(b)){f.m=Math.min(.6,f.m+dt*eff(p)*.0028);p.act='nosi wodę na pole'}
  if(SOIL[f.soil].dry&&f.soil==='kamien'&&st0==='puste')p.wt-=dt*.15*eff(p)}}
{const _ft=finishTrip;finishTrip=function(p,items){if(p.workKind==='field'&&p.tgt&&p.tgt.field){const c=rolaCur(p.tgt);if(c!=='zboze')items=items.map(it=>it.res==='ziarno'?{res:CROP[c].res,q:Math.round(it.q*CROP[c].k*10)/10}:it)}return _ft(p,items)}}
{const _fd=fieldDone;fieldDone=function(b){const f=b.field;const c=rolaCur(b);f.harvN=(f.harvN||0)+1;f.stub=c==='zboze'?S.day:-9;
  if(c==='zboze'){const r=_fd(b);fieldVis(b);return r}
  const war0=S.res.warzywa||0,fert0=f.fert,mono0=f.mono||0,L=log;log=function(t){if(/^Żniwa skończone/.test(t))return;return L.apply(this,arguments)};try{_fd(b)}finally{log=L}
  if(f.mode==='trzy'&&f.rot===2){S.res.warzywa=war0;f.fert=fert0}if(f.mode!=='trzy'){f.mono=0;f.weed=Math.max(0,(f.weed||0)-.18)}
  log(c==='len'?'Len wyrwany z korzeniami i rozłożony na łące do roszenia. Z łodyg będzie włókno na płótno.':'Kapusta i rzepa zebrane. Część pójdzie do beczek na kiszonki, reszta do piwnicy.');fieldVis(b)}}
// ---------- nowe pole: bruzdy, łan, kopki, płot ----------
const RL={};
const sRGB=(r,g,b)=>new THREE.Color().setRGB(r,g,b,THREE.SRGBColorSpace);
function rlTuft(){const T=[];for(let q=0;q<7;q++){const a=q*.9,r=q?.035+.025*(q%2):0,h=.48+.1*Math.sin(q*3.1);const tx=Math.cos(a)*.13,tz=Math.sin(a)*.13;
  T.push([new THREE.CylinderGeometry(.007,.012,h,3),sRGB(.86,.86,.86),mdM(Math.cos(a)*r,h/2,Math.sin(a)*r,tx,0,tz)]);T.push([new THREE.CylinderGeometry(.02,.011,.12,4),sRGB(1,1,1),mdM(Math.cos(a)*(r+h*.13),h+.03,Math.sin(a)*(r+h*.13),tx*1.4,0,tz*1.4)])}
 for(let q=0;q<3;q++){const a=q*2.1+.5;T.push([new THREE.PlaneGeometry(.025,.22),sRGB(.8,.8,.8),mdM(Math.cos(a)*.04,.12,Math.sin(a)*.04,0,a,.5)])}return mdMerge(T)}
function rlLen(){return mdMerge([0,1,2,3,4].map(q=>{const a=q*1.26+.4,r=q?.045:0,h=.6+.06*Math.sin(q*2.3);return[new THREE.CylinderGeometry(.005,.008,h,3),sRGB(.86,.86,.86),mdM(Math.cos(a)*r,h/2,Math.sin(a)*r,Math.cos(a)*.08,0,Math.sin(a)*.08)]})
 .concat([0,1,2,3,4].map(q=>{const a=q*1.26+.4,r=q?.045:0,h=.6+.06*Math.sin(q*2.3);return[new THREE.SphereGeometry(.018,5,4),sRGB(1,1,1),mdM(Math.cos(a)*(r+.05),h,Math.sin(a)*(r+.05))]})))}
function rlFlow(){return mdMerge([0,1,2,3,4].map(q=>{const a=q*1.26+.4,r=q?.045:0,h=.6+.06*Math.sin(q*2.3);return[new THREE.CircleGeometry(.035,5),sRGB(1,1,1),mdM(Math.cos(a)*(r+.05),h+.02,Math.sin(a)*(r+.05),-Math.PI/2)]}))}
function rlKap(){const T=[[new THREE.SphereGeometry(.12,9,7),sRGB(1,1,1),mdM(0,.11,0,0,0,0,1,.82,1)]];for(let q=0;q<6;q++){const a=q*1.047;T.push([new THREE.SphereGeometry(.11,7,5),sRGB(.8,.82,.8),mdM(Math.cos(a)*.11,.07,Math.sin(a)*.11,Math.sin(a)*.9,0,-Math.cos(a)*.9,1,.22,.8)])}return mdMerge(T)}
function rlKopka(){const T=[];for(let q=0;q<8;q++){const a=q*.785;T.push([new THREE.CylinderGeometry(.045,.07,.42,5),sRGB(.74+.06*(q%2),.62+.05*(q%2),.34),mdM(Math.cos(a)*.075,.2,Math.sin(a)*.075,Math.sin(a)*.24,0,-Math.cos(a)*.24)]);
  T.push([new THREE.ConeGeometry(.05,.1,5),sRGB(.8,.68,.38),mdM(Math.cos(a)*.11,.44,Math.sin(a)*.11,Math.sin(a)*.5,0,-Math.cos(a)*.5)])}
 T.push([new THREE.CylinderGeometry(.04,.13,.16,6),sRGB(.66,.55,.3),mdM(0,.47,0)]);return mdMerge(T)}
// ziemia i płot dopasowane do terenu pod polem
function rlSoilG(soil,hO){const g=new THREE.PlaneGeometry(3.86,3.86,8,28);g.rotateX(-Math.PI/2);const p=g.attributes.position,col=new Float32Array(p.count*3),base=new THREE.Color(SOIL[soil].c);
 for(let k=0;k<p.count;k++){const x=p.getX(k),z=p.getZ(k),r=Math.max(0,Math.cos((z+1.6)/.533*Math.PI*2)),edge=Math.max(Math.abs(x),Math.abs(z))>1.88?1:0;p.setY(k,hO(x,z)+.05+.05*r*(1-edge)-.03*edge);const s=.78+.3*r;col[k*3]=base.r*s;col[k*3+1]=base.g*s;col[k*3+2]=base.b*s}
 g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();return g}
function rlFenceG(all,hO){const T=[],wood=new THREE.Color(0x5a4630),w2=new THREE.Color(0x6a5238),up=new THREE.Vector3(0,1,0),dv=new THREE.Vector3(),qq=new THREE.Quaternion();
 const side=(x0,z0,x1,z1,n)=>{const P=[];for(let k=0;k<=n;k++){const t=k/n,x=lerp(x0,x1,t),z=lerp(z0,z1,t),y=hO(x,z);P.push([x,y,z]);T.push([new THREE.CylinderGeometry(.03,.035,.42,5),wood,mdM(x,y+.19,z,0,0,.03*Math.sin(k*2.1))])}
  for(let k=0;k<n;k++){const A=P[k],B=P[k+1];for(const hy of[.18,.32]){dv.set(B[0]-A[0],B[1]-A[1],B[2]-A[2]);const L=dv.length();dv.normalize();qq.setFromUnitVectors(up,dv);
   T.push([new THREE.CylinderGeometry(.018,.018,L,4),w2,new THREE.Matrix4().compose(new THREE.Vector3((A[0]+B[0])/2,(A[1]+B[1])/2+hy,(A[2]+B[2])/2),qq,new THREE.Vector3(1,1,1))])}}};
 side(-1.92,1.92,1.92,1.92,7);if(all){side(-1.92,-1.92,1.92,-1.92,7);side(-1.92,-1.92,-1.92,1.92,7);side(1.92,-1.92,1.92,1.6,6)}return mdMerge(T)}
function rlGeo(){if(RL.tuft)return;RL.tuft=rlTuft();RL.len=rlLen();RL.flow=rlFlow();RL.kap=rlKap();RL.kop=rlKopka();
 RL.mat=windify(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92,side:THREE.DoubleSide}),.55);RL.matK=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85});RL.matF=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,side:THREE.DoubleSide});RL.fMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95})}
const RL_N=112;
function rolaModel(b){rlGeo();const g=new THREE.Group();const f=b&&b.field;const soil=(f&&f.soil)||(b?soilAt(b.i,b.j,4,4):'czarna');
 const c0=b?bCenter(b):null,h0=c0?Hy(c0.x,c0.z):0;const hO=c0?(x,z)=>Math.max(-.2,Math.min(.6,Hy(c0.x+x,c0.z+z)-h0)):()=>0;
 const sm=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1});if(typeof addSnow==='function')addSnow(sm);
 const so=new THREE.Mesh(rlSoilG(soil,hO),sm);so.receiveShadow=true;g.add(so);
 const crops=new THREE.Group();const im=new THREE.InstancedMesh(RL.tuft,RL.mat,RL_N);im.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(RL_N*3),3);im.castShadow=true;im.receiveShadow=true;
 const fl=new THREE.InstancedMesh(RL.flow,RL.matF,RL_N);fl.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(RL_N*3),3);fl.visible=false;
 const kp=new THREE.InstancedMesh(RL.kop,RL.matK,6);kp.castShadow=true;kp.visible=false;
 const r0=rng(((b&&b.id)||1)*131+7),base=[];for(let a=0;a<7;a++)for(let c=0;c<16;c++){const x=-1.69+c*.225+(r0()-.5)*.07,z=-1.6+a*.533+(r0()-.5)*.06;base.push({x,y:hO(x,z)+.05,z,r:r0()*6.28,v:.86+.26*r0(),s:.85+.3*r0()})}
 for(let q=0;q<6;q++){const x=-1.2+(q%3)*1.2+(r0()-.5)*.3,z=-.8+Math.floor(q/3)*1.6+(r0()-.5)*.3;dummy.position.set(x,hO(x,z)+.04,z);dummy.rotation.set(0,r0()*6.28,0);dummy.scale.setScalar(.9+.2*r0());dummy.updateMatrix();kp.setMatrixAt(q,dummy.matrix)}
 crops.add(im,fl,kp);crops.userData={inst:null,rl:im,fl,kp,base,noMerge:1};g.add(crops);g.userData.crops=crops;
 const all=!!(b&&hasExt(b,'plot'));const fe=new THREE.Mesh(rlFenceG(all,hO),RL.fMat);fe.castShadow=true;g.add(fe);g.userData.rola={soilM:sm,soil,fence:fe,all,hO};return g}
{const _mbp=makeBuildingModel;makeBuildingModel=function(kind,bb){if(kind!=='pole'||/nocropi/.test(location.search))return _mbp(kind,bb);const g=rolaModel(bb);if(bb)addBldVisuals(g,bb);return g}}
const RLC={zg:new THREE.Color(),c:new THREE.Color(),a:new THREE.Color(),b:new THREE.Color()};
function rlCol(o,r,g,b){return o.setRGB(r,g,b,THREE.SRGBColorSpace)}
{const _fv=fieldVis;fieldVis=function(b){const m=bMesh[b.id];const cr=m&&m.userData.crops;if(!cr||!cr.userData.rl)return _fv(b);const im=cr.userData.rl,fl=cr.userData.fl,kp=cr.userData.kp,B=cr.userData.base;
  const f=b.field||{st:'puste',g:0};if(b.field)rolaInit(b);const st=f.st,sea=seasonIdx(),c=st==='puste'?(f.mode==='trzy'&&f.rot===2?'ugor':'none'):rolaCur(b);
  const gg=st==='dojrzale'?1:st==='rosnie'?f.g:0;const stub=st==='puste'&&f.stub>0&&S&&S.day-f.stub<YEAR*.45&&sea!==3&&(f.cur||'zboze')==='zboze';const ryte=f.ryte&&S&&S.day-f.ryte<1.5,hit=f.hit&&S&&S.day-f.hit<1.2;
  const geo=c==='len'?RL.len:c==='kapusta'?RL.kap:RL.tuft;if(im.geometry!==geo)im.geometry=geo;
  // kolory etapu
  const A=RLC.a,Bc=RLC.b;if(c==='len'){rlCol(A,.4,.6,.32);rlCol(Bc,.62,.52,.32)}else if(c==='kapusta'){rlCol(A,.36,.56,.4);rlCol(Bc,.6,.72,.52)}else{rlCol(A,.4,.62,.26);rlCol(Bc,.86,.72,.36)}
  const M4=new THREE.Matrix4(),q=new THREE.Quaternion(),e3=new THREE.Euler(),sv=new THREE.Vector3(),pv=new THREE.Vector3();let showF=false;
  B.forEach((p,i)=>{let s=0,sy=1,tilt=0;const col=RLC.c;
   if(c==='ugor'){s=sea===2?0:.35+.25*((i*7)%5)/5;sy=.7;rlCol(col,.52,.58,.3).lerp(rlCol(RLC.zg,.7,.64,.42),((i*3)%4)/4)}
   else if(stub){s=.9;sy=.16;rlCol(col,.8,.7,.44)}
   else if(c!=='none'&&gg>0){if(c==='kapusta'&&i%2)s=0;else{s=(.22+.78*gg)*p.s;col.copy(A).lerp(Bc,c==='zboze'?Math.max(0,gg-.55)/.45:c==='len'?(st==='dojrzale'?1:0):gg)}
    if(ryte&&((i*13+(f.ryte*7|0))%5===0))s=0;if(hit&&c!=='kapusta'){tilt=.9+.4*Math.sin(i)}}
   col.multiplyScalar(p.v);im.setColorAt(i,col);e3.set(tilt*Math.cos(p.r),p.r,tilt*Math.sin(p.r));q.setFromEuler(e3);M4.compose(pv.set(p.x,p.y,p.z),q,sv.set(s,s*sy,s));im.setMatrixAt(i,M4);
   if(c==='len'&&st==='rosnie'&&gg>.45&&gg<.9&&s>0){showF=true;const fs=s*Math.min(1,(gg-.45)*6)*(1-Math.max(0,gg-.82)*10);M4.compose(pv.set(p.x,p.y,p.z),q,sv.set(s,s,s));fl.setMatrixAt(i,M4);fl.setColorAt(i,rlCol(RLC.zg,.42+.1*p.v,.56,.92).multiplyScalar(fs>0?1:0))}
   else fl.setMatrixAt(i,M4.makeScale(0,0,0))});
  im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;fl.visible=showF;if(showF){fl.instanceMatrix.needsUpdate=true;fl.instanceColor.needsUpdate=true}
  kp.visible=stub&&S.day-f.stub<2.2;
  // ziemia: mokra ciemnieje, sucha jaśnieje
  const R=m.userData.rola;if(R){const mo=f.m===undefined?.55:f.m;const k=mo<.2?1.18:mo>.8?.78:1.05-.3*(mo-.2);R.soilM.color.setScalar(k);
   const all=hasExt(b,'plot');if(R.all!==all){R.all=all;R.fence.geometry=rlFenceG(all,R.hO)}}}}
// pola odświeżają się co jakiś czas (wilgoć, kopki, ściernisko)
let rolaVT=0;{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;rolaVT+=rdt;if(rolaVT<2)return;rolaVT=0;S.bld.forEach(b=>{if(b.kind==='pole'&&bDone(b))fieldVis(b)})}}
// ---------- rozbudowa: płot ----------
EXT.pole.push({id:'plot',n:'Płot z żerdzi',d:'Dziki rzadko wchodzą na pole.',cost:{drewno:8},work:3});EXTV.plot=()=>{};
TECH_BY.u_len.eff=TECH_BY.u_len.eff+' Len można też siać na polu.';
// ---------- karta pola: gleba, wilgoć, uprawa, kalendarz ----------
function rolaETA(b){const f=b.field;const mm=rolaMoistMul(f,b),c=rolaCur(b),cm=c==='len'?1.25:c==='kapusta'?.95:1;const r=K/30*(tech('u_selek')?1.15:1)*(hasExt(b,'rowy')?1.15:1)*mm*cm;return Math.max(1,Math.ceil((1-f.g)/Math.max(.01,r)))}
function rolaNow(b){const f=b.field,sea=seasonIdx(),c=rolaCur(b);
 if(f.st==='dojrzale')return c==='len'?'Teraz: rwanie lnu.':c==='kapusta'?'Teraz: zbiór kapusty i rzepy.':'Teraz: żniwa. Zboże nie poczeka, deszcz i mróz zabierają plon.';
 if(f.st==='rosnie')return sea===2?'Zimą nic nie rośnie. Wschody czekają pod śniegiem.':`Rośnie. Dojrzeje za około ${rolaETA(b)} ${rolaETA(b)===1?'dzień':'dni'}.`;
 if(f.mode==='trzy'&&f.rot===2)return'Ugór: pole odpoczywa przez rok, kozy mogą tu paść.';
 const yd=yday(),x=tech('n_kal')?5:0;if(inSow())return'Teraz: siew. Rolnicy idą w pole, gdy jest czym siać.';const d=Math.ceil((((72-x)-yd+96)%96)/(96/YEAR));return`Siew wiosną i na początku lata, za około ${d} ${d===1?'dzień':'dni'}.`}
function rolaRisks(b){const f=b.field,sea=seasonIdx(),c=rolaCur(b),L=[];
 if(f.st!=='puste'&&sea!==2&&rolaBoars(b))L.push(hasExt(b,'plot')?'dziki w pobliżu, ale płot je trzyma z dala':S.fieldWatch>S.day?'dziki w pobliżu, przy polu czuwają ludzie':'dziki w pobliżu: nocą mogą zryć pole');
 if(f.st==='rosnie'&&sea===3&&f.g<.4&&c!=='kapusta')L.push('przymrozki na wschody');if(f.st!=='puste'&&(sea===0||sea===3))L.push('grad i letnie burze');
 if(f.st==='dojrzale'&&c==='zboze')L.push('deszcz w żniwa: ziarno kiełkuje w kłosach');if(f.m<.3&&f.st==='rosnie')L.push(rolaWater(b)?'susza: rolnicy noszą wodę':'susza, a wody nie ma blisko');
 if(f.soil==='mokra'&&!hasExt(b,'rowy'))L.push('w ulewy staje woda (rowy pomogą)');return L}
{const _fc=fieldCard;fieldCard=function(b){let h=_fc(b);const f=b.field;if(!f)return h;rolaInit(b);const so=SOIL[f.soil],nx=rolaNext(b),cur=f.st!=='puste'?rolaCur(b):null;
  const opts=['zboze','len','kapusta'].filter(cropKnown);const can=!(f.mode==='trzy'&&f.rot!==1);
  const R=rolaRisks(b);
  h+=`<div class="rola-box"><p><b>Gleba:</b> ${so.n} <span class="mut">(${so.d})</span> · <b>ziemia</b> ${rolaWords(f.m)}</p><p>${rolaNow(b)}</p>${cur?`<p class="mut">Na polu: ${CROP[cur].n}.</p>`:''}
  ${opts.length>1?`<p class="mut">${can?'Następny siew':'Następny siew w roku jarym'}: ${CROP[can?nx:'zboze'].n}.</p>${can?`<div class="cz-act">${opts.map(c=>`<button data-fcrop="${c}" class="${(f.want||'zboze')===c?'pri':''}">${c==='zboze'?'Zboże':c==='len'?'Len':'Kapusta'}</button>`).join('')}</div>`:''}`:''}
  ${R.length?`<p class="mut">Zagrożenia: ${R.join('; ')}.</p>`:''}</div>`;return h}}
{const _rs=renderSel;renderSel=function(){_rs();if(!S||selB===null)return;const el=$('sel');const rb=el.querySelector('.rot-box'),ro=el.querySelector('.rola-box');if(!rb||rb._mv)return;rb._mv=1;
  const ps=[...el.querySelectorAll('p')].find(p=>!rb.contains(p)&&!(ro&&ro.contains(p))&&/żyzność|czeka na siew/.test(p.textContent));if(ps){if(ro)ps.after(ro);ps.after(rb);if(ro)rb.after(ro)}}}
$('sel').addEventListener('click',e=>{if(!S||selB===null)return;const t=e.target.closest('[data-fcrop]');if(!t)return;const b=bById(selB);if(!b||!b.field)return;b.field.want=t.dataset.fcrop;$('sel')._h=null;renderSel()});
// gleba widoczna przy stawianiu pola
{const _mg=moveGhost;moveGhost=function(i,j){_mg(i,j);if(placing!=='pole'||!ghostTile)return;const el=$('pinfo');if(!el)return;const s=SOIL[soilAt(ghostTile[0],ghostTile[1],4,4)];el.insertAdjacentHTML('beforeend',`<br><span class="${s.f0>=1?'ok':s.f0<.9?'no':''}">Gleba: ${s.n}, ${s.d}</span>`)}}
{const _th=czTerrHTML;czTerrHTML=function(i,j){let h=_th(i,j);try{const s=SOIL[soilAt(i-1,j-1,4,4)];h=h.replace('</h4>',`</h4><p class="mut">Ziemia pod pole: ${s.n}, ${s.d}.</p>`)}catch(e){}return h}}
// linijka do karty „Niebo”
function rolaWxLine(){const F=S.bld.filter(b=>b.field&&bDone(b)&&b.field.st==='rosnie');if(!F.length)return null;const m=F.reduce((a,b)=>a+(b.field.m===undefined?.55:b.field.m),0)/F.length;
 return['Pola',m<.3?'przesychają':m>.85?'za mokro':'ziemia w sam raz',m<.3||m>.85?'bad':'ok']}
// wiedza o warzywach w osadach z drugiej epoki
{const _b=boot;boot=function(f){_b(f);if(S&&S.epoch>=2&&S.know&&!S.know.warzywa)S.know.warzywa='tak'}}
window.__rola={soilAt,rolaDaily,rolaNext,rolaCur,SOIL,rolaModel,rolaBoarEvent,rolaWater,DZ_EV};
