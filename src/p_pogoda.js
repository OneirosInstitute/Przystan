
/* ================= 3.2: pogoda — natężenie, rytm dnia, wiatr, nowe zjawiska ================= */
// ---------- skutki w rozgrywce ----------
const WX_WET=new Set(['rain','storm','burza','grad']);
function wxWetDay(){return WX_WET.has(S.weather.k)||S.weather.k==='odwilz'}
function wxWear(){return({storm:2,zamiec:1.6,wiatr:1.5,grad:1.4,burza:1.25})[S.weather.k]||1}
function wxRisk(){return({storm:1.5,zamiec:1.7,burza:1.25,fog:1.15,wiatr:1.2,grad:1.1})[S.weather.k]||1}
function wxSea(){return({storm:2,wiatr:1.5,zamiec:1.6,fog:1.3,burza:1.4})[S.weather.k]||1}
function wxFire(){return({drought:3,babie:1.6,wiatr:1.8,rain:.25,storm:.3,burza:.35,grad:.3,snow:.25,zamiec:.2,odwilz:.5,fog:.7})[S.weather.k]||1}
const wxI=()=>S.weather.i===undefined?.7:S.weather.i;
// burza: rano parno, po południu przechodzi, wieczorem czyste niebo
function wxBurzaWin(){const w=S.weather;if(w.t0===undefined){w.t0=.5+Math.random()*.08;w.t1=w.t0+.13+Math.random()*.08}return[w.t0,w.t1]}
function wxPhase(){const k=S.weather.k;if(k!=='burza'&&k!=='grad')return-1;const[a,b]=wxBurzaWin(),t=tod();return t<a?0:t<b?1:2}
function wxName(w){w=w||S.weather;const k=w.k,i=w.i===undefined?.7:w.i,t=S?tod():.5;
 if(k==='rain')return i<.42?'mżawka':i>.85?'ulewa':'deszcz';if(k==='snow')return i>.85?'gęsty śnieg':i<.5?'prószy śnieg':'śnieg';
 if(k==='fog'&&t>.5&&t<.78)return'mglisto';
 if(k==='burza'&&w===S.weather){const ph=wxPhase();return ph===0?'parno, zbiera się na burzę':ph===1?'burza':'po burzy'}
 if(k==='grad'&&w===S.weather){const ph=wxPhase();return ph===1?'grad':'zimny deszcz'}
 return WEATHER[k][0]}
function wxIcon(night){const k=S.weather.k,ph=wxPhase();if(k==='clear'||k==='drought'||k==='babie'||(k==='burza'&&ph!==1))return night?'moon':'sun';
 if(k==='frost'||k==='zamiec')return'snow';if(k==='odwilz')return'rain';if(k==='burza')return'storm';if(k==='grad')return ph===1?'grad':'rain';return IC[k]?k:'sun'}
IC.grad='<path d="M7 13h10a4 4 0 00.5-8 6 6 0 00-11.3 1.5A3.3 3.3 0 007 13z"/><circle cx="8" cy="17" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="16" cy="17" r="1"/><circle cx="10" cy="22" r=".8"/><circle cx="14" cy="22" r=".8"/>';
IC.wiatr='<path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>';
// ---------- losowanie pogody (z dnia na dzień) ----------
function wxFix(k,yd){const sn=S.snowC||0;
 if(k==='babie'&&!(yd>=24&&yd<40))return'clear';
 if(k==='odwilz'&&!(yd>=56&&yd<84&&sn>.12))return yd>=72?'rain':'fog';
 if(k==='burza'&&!(yd<26||yd>=84))return'rain';
 if(k==='grad'&&!(yd<22||yd>=80))return'rain';
 if(k==='zamiec'&&!(yd>=48&&yd<74))return'snow';
 return k}
function wxRoll(s,yd){const roll=WROLL[s];let x=Math.random(),k='clear';for(const[w,pr]of roll){if(x<pr){k=w;break}x-=pr}return wxFix(k,yd)}
const WX_STR={clear:.22,drought:.12,babie:.1,fog:.06,frost:.18,rain:.42,snow:.3,storm:.92,burza:.32,grad:.55,zamiec:.95,odwilz:.32,wiatr:.84};
function wxNewWeather(sea){const yd=yday();const nxt=S.weather.next;
 let k=nxt&&WROLL[sea].some(w=>w[0]===nxt)?wxFix(nxt,yd):wxRoll(sea,yd);
 const R=Math.random(),len={burza:1,grad:1,zamiec:1+(R<.4?1:0),wiatr:1+(R<.5?1:0),babie:2+((R*3)|0),odwilz:2+(R<.5?1:0)}[k]||1+((R*3)|0);
 const i=k==='rain'?.3+.7*Math.pow(Math.random(),.8):k==='snow'?.4+.6*Math.random():k==='fog'?.55+.45*Math.random():.6+.4*Math.random();
 const yd3=((S.day+len)%YEAR)*96/YEAR,nx=wxRoll(Math.floor(yd3/24)%4,yd3);S.weather={k,left:len,next:nx,i,ph:Math.random()*6.28};
 // wiatr: krąży powoli, najczęściej od zachodu
 const W=S.wind||(S.wind={a:.35,s:.22});W.a+=(Math.random()-.5)*.9+(.35-W.a)*.15;W.s=clamp(WX_STR[k]*(.85+.3*Math.random()),.03,1);
 const once=(t)=>{const key='wx'+k+Math.floor(S.day/SD);if(S.seen[key])return;S.seen[key]=1;log(t)};
 if(k==='frost')log('Siarczysty mróz. Domy palą dwa razy więcej opału, a kto nie ma ciepłej odzieży, marznie.');
 if(k==='storm'){S.lastStorm=S.day;log('Nadciąga sztorm. Praca idzie wolno, morze bije o brzeg.')}
 if(k==='burza'){S.lastBurza=S.day;once('Od rana parno i duszno, muchy gryzą. Nad lasem rosną białe wieże chmur: po południu będzie burza.')}
 if(k==='grad')once('Powietrze nagle chłodnieje, chmury mają sinozielony kolor. Kto ma rozum, chowa się pod dach, zanim sypnie gradem.');
 if(k==='zamiec')once('Zamieć. Wiatr niesie śnieg poziomo, nie widać sąsiedniej chaty. Kto może, siedzi przy ogniu, a kto musi wyjść, trzyma się płotów.');
 if(k==='odwilz')once('Odwilż. Z dachów kapie, śnieg siada i szarzeje, ścieżki toną w błocie.');
 if(k==='wiatr')once('Wichura. Drzewa trzeszczą, z dachów lecą wiechcie słomy, a morze jest białe od grzyw.');
 if(k==='babie'){S.wh=(S.wh||0)+.02;once('Babie lato. Ciepło jak w środku lata, a w powietrzu płyną srebrne nitki pajęczyn. Ludzie chętniej wychodzą w pole.')}
 if((nx==='frost'||nx==='storm'||nx==='zamiec'||nx==='grad')&&tech('n_kal'))toast('Znaki na niebie: za '+S.weather.left+' d. '+WEATHER[nx][0]);
 // poranny szron po pogodnej nocy (wiosną to przymrozek)
 S.szron=-1;if((k==='clear'||k==='fog'||k==='frost'||k==='babie')&&((sea===3&&yd<88)||(sea===1&&yd>=34)||sea===2)&&Math.random()<(k==='frost'?1:.42))S.szron=Math.floor(S.day+(tod()>.5?1:0))}
Object.assign(SIGN,{burza:['Od rana parno, jaskółki nisko, a krowie bąki gryzą do krwi.','po południu będzie burza'],grad:['Wieczorem chmury sine z zielonym brzegiem, a wiatr nagle zimny.','może sypnąć gradem'],
 zamiec:['Śnieg kręci się przy ziemi jak dym, a wrony chowają się w zagajniku.','idzie zamieć'],odwilz:['Wiatr ciągnie od morza ciepłem, a sople w południe płaczą.','idzie odwilż'],
 wiatr:['Rano niebo czerwone, chmury pędzą wysoko jak rozczochrane konie.','będzie wichura'],babie:['Na trawie srebrzą się pajęczyny, a rano mgiełka leży nisko.','idzie babie lato'],
 fog:['Wieczorem woda paruje, w dolinach kładzie się biała pierzyna.','rano będzie mgła']});
// ---------- rysowanie: cele i płynne przejścia ----------
const wxT={};let wxRainHi=-99,wxBowDay=-1,wxPrevK='';
function wxNoise(){const d=S.day,ph=S.weather.ph||0;return .5+.5*Math.sin(d*9.1+ph)*Math.sin(d*3.7+1.3+ph*.5)}
function wxTargets(){const w=S.weather,k=w.k,i=wxI(),t=tod(),n=wxNoise(),sea=seasonIdx();const T=wxT;
 T.rain=0;T.snow=0;T.hail=0;T.fog=0;T.dim=1;T.cloud=.24;T.wind=S.wind?S.wind.s:WX_STR[k]||.22;T.storm=0;T.dark=0;T.heat=0;T.blow=0;T.bow=0;
 if(k==='drought'){T.cloud=.05;T.heat=Math.max(0,Math.sin(Math.PI*clamp((t-.3)/.48,0,1)));T.fog=.1*T.heat}
 else if(k==='babie'){T.cloud=.1;T.fog=t<.36?.32:.06}
 else if(k==='frost'){T.cloud=.07;T.dim=.97}
 else if(k==='fog'){const dawn=t<.42?1:t<.62?1-(t-.42)/.2*.55:.45;T.fog=clamp(i*dawn,0,1);T.dim=1-.24*T.fog;T.cloud=.03}
 else if(k==='rain'){const shower=i<.55&&sea!==2;const r=shower?i*1.5*sstep(.38,.62,n):i*(.55+.45*n);T.rain=r;T.dim=.95-.33*Math.min(1,r*1.2)-(shower?0:.08);T.fog=.1+.28*r;T.cloud=shower?.18:.08;T.dark=.3*Math.max(0,r-.6)}
 else if(k==='storm'){T.rain=.72+.28*n;T.dim=.45;T.fog=.45;T.dark=.6;T.storm=.22;T.cloud=.06}
 else if(k==='burza'||k==='grad'){const[a,b]=wxBurzaWin();
  if(t<a){T.heat=k==='burza'?.45*Math.max(0,Math.sin(Math.PI*clamp((t-.3)/.4,0,1))):0;const pre=sstep(a-.1,a,t);T.dark=pre*.9;T.dim=1-.5*pre;T.cloud=.22-.14*pre;T.wind=lerp(.18,.6,pre);if(k==='grad')T.rain=.15*pre}
  else if(t<b){const f=(t-a)/(b-a),env=Math.min(1,f*6,(1-f)*5);T.rain=(k==='burza'?.95:.6)*env;T.dark=env;T.dim=1-.62*env;T.fog=.32*env;T.wind=.45+.4*env*(.7+.3*Math.sin(S.day*40));T.storm=k==='burza'?env:.35*env;T.cloud=.06;
   if(k==='grad'){const hw=sstep(0,.08,f)*(1-sstep(.4,.55,f));T.hail=hw;T.rain=.35+.3*hw}}
  else{const f=sstep(b,b+.05,t);T.rain=(1-f)*.4;T.dark=(1-f)*.5;T.dim=.8+.2*f;T.cloud=.12+.1*f;T.wind=lerp(.4,.15,f);
   if(t<Math.min(b+.075,.79)&&t>b+.012&&tod()>T0)T.bow=1}}
 else if(k==='snow'){T.snow=i*(.55+.45*n);T.dim=.8;T.fog=.28+.15*i;T.cloud=.05}
 else if(k==='zamiec'){T.snow=1;T.blow=1;T.dim=.55;T.fog=.75;T.dark=.15;T.cloud=0}
 else if(k==='odwilz'){T.rain=n>.55?.2:0;T.fog=.45;T.dim=.74;T.cloud=.05}
 else if(k==='wiatr'){T.cloud=.32;T.dim=.93}
 // przelotny deszcz i tęcza
 if(k==='rain'&&i<.55&&sea!==2){if(T.rain>.25)wxRainHi=S.day;else if(T.rain<.04&&S.day-wxRainHi<.04&&t>.3&&t<.76)T.bow=1}
 // pod wieczór chmurzy się przed zmianą na deszcz
 const nx=w.next;if(w.left<=1&&t>.68&&(nx==='rain'||nx==='storm'||nx==='snow'||nx==='zamiec')&&T.rain<.05){const f=sstep(.68,.8,t);T.dim=Math.min(T.dim,1-.12*f);T.cloud=Math.max(.08,T.cloud-.1*f)}
 // szron rano
 T.rime=Math.max(k==='frost'?(t<.42?.85:.4):(S.szron===Math.floor(S.day)&&t<.42)?.75*(1-sstep(.3,.42,t)):0,T.hail*.9);
 if(k==='zamiec'||k==='storm'||k==='wiatr'||k==='grad'||k==='burza')T.wind=Math.max(T.wind,k==='burza'?T.wind:(S.wind?S.wind.s:.8));
 return T}
function wxFrame(rdt){if(!S)return;const T=wxTargets(),sp=Math.max(1,S.speed||0),a=Math.min(1,rdt*(.35+.25*sp));
 for(const k of['rain','snow','hail','fog','dim','cloud','storm','dark','heat','blow','rime'])WX[k]+=(T[k]-WX[k])*a;
 WX.wind+=(T.wind-WX.wind)*Math.min(1,rdt*.4*sp);WX.bow+=(T.bow-WX.bow)*Math.min(1,rdt*.6);
 const W=S.wind||{a:.35};const tx=Math.cos(W.a),tz=Math.sin(W.a);WX.wx+=(tx-WX.wx)*Math.min(1,rdt*.2);WX.wz+=(tz-WX.wz)*Math.min(1,rdt*.2);const l=Math.hypot(WX.wx,WX.wz)||1;WX.wx/=l;WX.wz/=l;
 // ziemia mokra po deszczu, schnie powoli w słońcu i na wietrze
 const wetT=S.weather.k==='odwilz'?.85:WX.rain>.04?Math.min(1,.45+WX.rain):WX.snow>.3?.35:0;const g=rdt*(S.speed||0);
 WX.wet+=wetT>WX.wet?(wetT-WX.wet)*Math.min(1,g*.05):(wetT-WX.wet)*Math.min(1,g*.004*(1+2.5*WX.heat+1.5*WX.wind)*(S.weather.k==='fog'?.3:1));
 wUni.uRough.value=clamp((WX.wind-.45)/.45,0,1);TU.uRime.value=WX.rime;wUni.uRainW.value=Math.min(1,WX.rain+WX.hail);const cs=(.012+.05*WX.wind)*rdt;WX.cox+=WX.wx*cs;WX.coz+=WX.wz*cs;
 if(WX.bow>.5&&wxBowDay!==Math.floor(S.day)){wxBowDay=Math.floor(S.day);S.wh=(S.wh||0)+.008;const y=Math.floor(S.day/YEAR);if(!S.seen['tecza'+y]){S.seen['tecza'+y]=1;log('Nad morzem staje tęcza. Dzieci wołają, że pije wodę z morza, a starzy mówią, że po tęczy deszcz już nie wróci.')}}
 wxFx(rdt)}
// ---------- krople na wodzie, rozbryzgi, grad, tęcza ----------
const WXR_N=70,wxRipG=new THREE.RingGeometry(.1,.16,12);wxRipG.rotateX(-Math.PI/2);
const wxRip=new THREE.InstancedMesh(wxRipG,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}),WXR_N);
wxRip.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(WXR_N*3),3);wxRip.frustumCulled=false;wxRip.renderOrder=3;wxRip.visible=false;scene.add(wxRip);
const wxRipS=[];for(let k=0;k<WXR_N;k++)wxRipS.push({x:0,z:0,l:Math.random(),on:0});
const WXS_N=140,wxSpG=new THREE.BufferGeometry(),wxSpP=new Float32Array(WXS_N*3),wxSpL=new Float32Array(WXS_N);wxSpG.setAttribute('position',new THREE.BufferAttribute(wxSpP,3));
const wxSplash=new THREE.Points(wxSpG,new THREE.PointsMaterial({color:0xdde8f0,size:2.2,sizeAttenuation:false,transparent:true,opacity:.5,depthWrite:false}));wxSplash.frustumCulled=false;wxSplash.visible=false;scene.add(wxSplash);
const WXH_N=320,wxHG=new THREE.BufferGeometry(),wxHP=new Float32Array(WXH_N*3),wxHV=new Float32Array(WXH_N);wxHG.setAttribute('position',new THREE.BufferAttribute(wxHP,3));
{const r0=rng(612);for(let k=0;k<WXH_N;k++){wxHP[k*3]=(r0()-.5)*50;wxHP[k*3+1]=r0()*22;wxHP[k*3+2]=(r0()-.5)*50;wxHV[k]=-18-r0()*8}}
const wxHail=new THREE.Points(wxHG,new THREE.PointsMaterial({map:softTex,color:0xf4f8ff,size:4.6,sizeAttenuation:false,transparent:true,opacity:.95,depthWrite:false}));wxHail.frustumCulled=false;wxHail.visible=false;scene.add(wxHail);
const wxBowM=new THREE.Mesh(new THREE.RingGeometry(26,30,72,1,0,Math.PI),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,side:THREE.DoubleSide,
 uniforms:{uOp:{value:0}},vertexShader:'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform float uOp;varying vec2 vP;vec3 sp(float t){return clamp(vec3(abs(t*6.-3.)-1.,2.-abs(t*6.-2.),2.-abs(t*6.-4.)),0.,1.);}
 void main(){float r=length(vP);float t=clamp((r-26.)/4.,0.,1.);float e=smoothstep(0.,.4,t)*(1.-smoothstep(.6,1.,t));float h=smoothstep(0.,11.,vP.y);vec3 col=mix(sp(.76*(1.-t)),vec3(1.),.3);gl_FragColor=vec4(col*e*h*uOp,1.);}`}));
wxBowM.frustumCulled=false;wxBowM.visible=false;wxBowM.renderOrder=6;scene.add(wxBowM);
// fale z grzywami przy wietrze, deszcz matowi wodę
Object.assign(wUni,{uRough:{value:0},uRainW:{value:0}});
wMat.vertexShader=wMat.vertexShader.replace('void main(){vD=depth;','uniform float uRough;void main(){vD=depth;').replace('p.y+=w*.035*clamp(depth,0.,1.);','p.y+=w*.035*(1.+3.5*uRough)*clamp(depth,0.,1.);');
wMat.fragmentShader=wMat.fragmentShader.replace('uniform float uGlint;','uniform float uGlint;uniform float uRough;uniform float uRainW;').replace('float a=mix(.5,1.,smoothstep(0.,2.2,d));',`{float wc=vn(vW.xz*1.7+vec2(uT*.9,uT*.55))*.65+vn(vW.xz*4.3-vec2(uT*1.3,-uT*.7))*.35;c=mix(c,vec3(.78,.83,.84)*(.35+.65*uDay),uRough*smoothstep(.66,.84,wc)*smoothstep(.3,1.6,d)*.75);
 c=mix(c,vec3(dot(c,vec3(.33)))*1.08,uRainW*.35);}
 float a=mix(.5,1.,smoothstep(0.,2.2,d));`);
wMat.needsUpdate=true;
const isWaterAt=(x,z)=>{const t=tileOf(x,z);if(t[0]<0||t[1]<0||t[0]>=N||t[1]>=N)return true;return!land[t[1]*N+t[0]]};
function wxFx(rdt){const R=Math.min(26,15/Math.max(.35,zoom)),act=Math.min(1,WX.rain*1.1+WX.hail);
 // kręgi na wodzie
 wxRip.visible=act>.02&&GFX.level>0;if(wxRip.visible){const M4=new THREE.Matrix4(),c=new THREE.Color();
  for(let k=0;k<WXR_N;k++){const s=wxRipS[k];s.l+=rdt*(1.5+s.on*.4);if(s.l>=1){s.l-=1;s.on=Math.random()<act?1:0;if(s.on){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*R;s.x=camT.x+Math.cos(a)*r;s.z=camT.z+Math.sin(a)*r;if(!isWaterAt(s.x,s.z))s.on=0}}
   const sc=s.on?.4+1.6*s.l:0;M4.makeScale(sc,1,sc);M4.setPosition(s.x,.012,s.z);wxRip.setMatrixAt(k,M4);const f=s.on?(1-s.l)*(1-s.l)*.8:0;c.setRGB(f,f,f*1.05);wxRip.setColorAt(k,c)}
  wxRip.instanceMatrix.needsUpdate=true;wxRip.instanceColor.needsUpdate=true}
 // rozbryzgi na ziemi
 wxSplash.visible=WX.rain>.15&&GFX.level>0;if(wxSplash.visible){const n=Math.round(WXS_N*Math.min(1,WX.rain));wxSpG.setDrawRange(0,n);
  for(let k=0;k<n;k++){wxSpL[k]-=rdt*6;if(wxSpL[k]<=0){wxSpL[k]=.6+Math.random()*.6;const a=Math.random()*6.283,r=Math.sqrt(Math.random())*R*.8;const x=camT.x+Math.cos(a)*r,z=camT.z+Math.sin(a)*r;wxSpP[k*3]=x;wxSpP[k*3+1]=Math.max(Hy(x,z),0)+.04;wxSpP[k*3+2]=z}}
  wxSpG.attributes.position.needsUpdate=true;wxSplash.material.opacity=.25+.35*WX.rain}
 // grad: biała kasza, która odbija się od ziemi
 wxHail.visible=WX.hail>.02;if(wxHail.visible){const base=Hy(camT.x,camT.z),n=Math.round(WXH_N*Math.min(1,WX.hail));wxHG.setDrawRange(0,n);
  for(let k=0;k<n;k++){let y=wxHP[k*3+1]+wxHV[k]*rdt;wxHV[k]-=30*rdt;if(y<0){if(wxHV[k]<-6){y=0;wxHV[k]=-wxHV[k]*.32}else{y=18+Math.random()*6;wxHV[k]=-18-Math.random()*8;wxHP[k*3]+=(Math.random()-.5)*6;wxHP[k*3+2]+=(Math.random()-.5)*6}}
   wxHP[k*3+1]=y;wxHP[k*3]=wrapC(wxHP[k*3]+WX.wx*3*rdt,camT.x,24);wxHP[k*3+2]=wrapC(wxHP[k*3+2]+WX.wz*3*rdt,camT.z,24)}
  wxHG.attributes.position.needsUpdate=true;wxHail.position.set(0,base,0);wxHail.material.opacity=Math.min(1,WX.hail*1.4)}
 // tęcza po drugiej stronie wyspy, plecami do patrzącego
 const bo=WX.bow*(sun.intensity>.25?1:0);wxBowM.visible=bo>.01;if(wxBowM.visible){const H=17/zoom,hw=H*innerWidth/innerHeight,Rr=clamp(1.25*hw,.8*H,1.5*H),sc=Rr/28,d=.3*H,hc=(.92*H-Rr*Math.cos(pitch)-d*Math.sin(pitch))/Math.cos(pitch);wxBowM.scale.setScalar(sc);
  wxBowM.position.set(camT.x-Math.sin(yaw)*d,Hy(camT.x,camT.z)+hc,camT.z-Math.cos(yaw)*d);wxBowM.rotation.set(0,yaw,0);wxBowM.material.uniforms.uOp.value=.16*bo}}
// ---------- piorun: czasem trafia w strzechę ----------
function wxBoltHit(x,z){if(!S||S.weather.k!=='burza'||S.day<8)return;const key='grom'+Math.floor(S.day);if(S.seen[key])return;
 const b=S.bld.filter(b=>bDone(b)&&!b.fire&&['szalas','chata','zbieracz','mysliwy','drwal','drewutnia','sklad','stodola'].includes(b.kind)).map(b=>[b,Math.hypot(bCenter(b).x-x,bCenter(b).z-z)]).filter(q=>q[1]<5).sort((p,q)=>p[1]-q[1])[0];
 if(!b||Math.random()>.05)return;S.seen[key]=1;try{bolt(bCenter(b[0]).x,bCenter(b[0]).z);startFire(b[0]);log('Piorun bije prosto w strzechę: '+BD[b[0].kind].n.toLowerCase()+' staje w ogniu. Starzy mówią, że ognia od pioruna nie gasi się wodą, ale ludzie i tak biegną z wiadrami.')}catch(e){}}
// ---------- dźwięk deszczu i gradu ----------
function wxSound(){if(!AUD||!amb)return;if(!amb.rain){try{const len=AUD.sampleRate*3,buf=AUD.createBuffer(1,len,AUD.sampleRate),d=buf.getChannelData(0);for(let q=0;q<len;q++)d[q]=(Math.random()*2-1)*(.6+.4*Math.random());
  const s=AUD.createBufferSource();s.buffer=buf;s.loop=true;const fl=AUD.createBiquadFilter();fl.type='bandpass';fl.frequency.value=2400;fl.Q.value=.6;const lp=AUD.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5200;
  const gn=AUD.createGain();gn.gain.value=0;s.connect(fl);fl.connect(lp);lp.connect(gn);gn.connect(AUD.destination);s.start(0,Math.random()*2);amb.rain={gn,fl}}catch(e){amb.rain={gn:{gain:{setTargetAtTime(){}}},fl:{frequency:{setTargetAtTime(){}}}};return}}
 const near=1/Math.max(.6,zoom),g=(.05*WX.rain+.035*WX.hail)*(.7+.3*near);amb.rain.gn.gain.setTargetAtTime(g,AUD.currentTime,.6);amb.rain.fl.frequency.setTargetAtTime(1500+1600*WX.rain+1800*WX.hail,AUD.currentTime,.6);
 if(WX.hail>.3&&Math.random()<.35*WX.hail)sfx('crack')}
// ---------- karta „Niebo” ----------
const WX_DESC={clear:'Czyste niebo, gdzieniegdzie biały obłok.',drought:'Żar leje się z nieba, ziemia pęka, woda w strumieniu opada.',babie:'Ciepło i cicho, po trawie płyną srebrne nitki pajęczyn.',
 frost:'Powietrze szczypie w twarz, śnieg skrzypi pod nogami.',fog:'Biała mgła leży nisko, najgęstsza o świcie. Rybacy i myśliwi błądzą.',rain:'Szare niebo i deszcz.',storm:'Wicher od morza, ulewa i fale bijące o brzeg.',
 burza:'Letnia burza: rano parno, po południu pioruny i ulewa, wieczorem znów czysto.',grad:'Zimne powietrze i sine chmury. Grad bije w zboże i w strzechy.',snow:'Pada śnieg.',zamiec:'Śnieg niesiony poziomo, nie widać nic na kilka kroków.',
 odwilz:'Śnieg topnieje, wszędzie błoto i kałuże.',wiatr:'Silny wiatr bez deszczu. Ogień łatwo się roznosi, a łodzie zostają na brzegu.'};
function wxWindWord(s){return s<.12?'cisza':s<.3?'lekki wiatr':s<.55?'wietrznie':s<.78?'silny wiatr':'wichura'}
function wxFromSea(){const ci=camp.i,cj=camp.j;const dx=-(S.wind?Math.cos(S.wind.a):1),dz=-(S.wind?Math.sin(S.wind.a):0);let sea=0;for(let r=4;r<=16;r+=4){const i=Math.round(ci+dx*r),j=Math.round(cj+dz*r);if(i<0||j<0||i>=N||j>=N||!land[j*N+i])sea++}return sea>=2}
function wxCard(){if(!S)return'';const w=S.weather,k=w.k,sea=seasonIdx(),tmp=k==='odwilz'?1:WEATHER[k][2]+[4,0,-8,-1][sea];
 const L=[];const wm=WEATHER[k][1];L.push(['Praca pod gołym niebem',Math.round(wm*100)+'%',wm<.75?'bad':wm>1?'ok':'']);
 const f=wxFire();L.push(['Ryzyko pożaru',f>=1.6?'wysokie':f<=.5?'niskie':'zwykłe',f>=1.6?'bad':f<=.5?'ok':'']);
 const sm=wxSea();L.push(['Morze',sm>=1.6?'wzburzone, łodzie na brzegu':sm>1?'niespokojne':'spokojne',sm>=1.6?'bad':'']);
 if(wxRisk()>1.1)L.push(['Wyprawy','trudniejsze, łatwiej o wypadek','bad']);
 if(wxWear()>1)L.push(['Budynki','niszczeją szybciej','bad']);
 if(tmp<-6&&sea!==0)L.push(['Opał','domy palą więcej','bad']);
 if(typeof rolaWxLine==='function'){const r=rolaWxLine();if(r)L.push(r)}
 const ground=(S.snowC||0)>.3&&(sea===2||sea===3)?'pod śniegiem':WX.rain>.3?'mokra od deszczu':WX.wet>.6?'rozmokła, w koleinach stoi woda':WX.wet>.25?'wilgotna':k==='drought'?'sucha i spękana':'sucha';
 const feel=tmp<=-10?'tęgi mróz':tmp<=-4?'mróz':tmp<=0?'zimno':tmp<=3?'chłodno':tmp<=6?'ciepło':'gorąco';
 let fc='';if(tech('n_kal')&&w.next)fc=`<p class="mut">Kalendarz: za ${w.left} d. ${WEATHER[w.next][0]}.</p>`;else if(S.signFor&&SIGN[w.next]&&S.signFor.startsWith(w.next+':'))fc=`<p class="mut">Znaki: ${SIGN[w.next][0]} Starsi mówią: ${SIGN[w.next][1]}.</p>`;else fc='<p class="mut">Starsi patrzą w niebo, ale nic nie mówią.</p>';
 return`<div class="wxh">${ico(wxIcon(tod()>.82||tod()<.2))}<div><b>${wxName()[0].toUpperCase()+wxName().slice(1)}</b><small>${feel} · ${wxWindWord(S.wind?S.wind.s:.2)}${(S.wind&&S.wind.s>.3)?(wxFromSea()?' od morza':' od lądu'):''} · ziemia ${ground}</small></div></div>
 <p>${k==='rain'?(wxI()<.42?'Drobna mżawka. Wszystko powoli wilgotnieje, ale da się pracować.':wxI()>.85?'Ulewa. Woda leje się z nieba, w bruzdach stoją kałuże.':'Szare niebo i równy deszcz. Ziemia nasiąka.'):k==='burza'?['Parno i duszno. Nad lasem rosną białe wieże chmur.','Burza: pioruny bliżej i dalej, ulewa, wicher szarpie strzechy.','Burza przeszła. Pachnie mokrą ziemią, z liści kapie.'][Math.max(0,wxPhase())]:WX_DESC[k]||''}</p>${L.map(([a,b,c])=>`<div class="wxr"><span>${a}</span><b class="${c||''}">${b}</b></div>`).join('')}${fc}`}
const wxPop=document.createElement('div');wxPop.id='wxpop';wxPop.hidden=true;document.body.appendChild(wxPop);
{const st=document.createElement('style');st.textContent=`#wxpop{position:absolute;z-index:30;left:10px;top:calc(56px + env(safe-area-inset-top,0px));width:min(340px,calc(100vw - 20px));box-sizing:border-box;padding:12px 14px;border-radius:14px;background:#141b18f2;border:1px solid #c9a66b55;color:var(--txt,#e8e2d0);font:14px var(--sans);box-shadow:0 6px 24px #000a}
#wxpop[hidden]{display:none}#wxpop .wxh{display:flex;gap:10px;align-items:center;margin-bottom:6px}#wxpop .wxh svg{width:30px;height:30px;color:var(--gold2,#d8b878);flex:none}#wxpop .wxh b{display:block;font-family:var(--serif);font-size:19px;color:var(--hi,#f4ecd8)}
#wxpop .wxh small{display:block;color:var(--mut,#a8a290);font-size:12.5px}#wxpop p{margin:6px 0;line-height:1.35}#wxpop .wxr{display:flex;justify-content:space-between;gap:10px;padding:3px 0;border-top:1px solid #ffffff10}#wxpop .wxr span{color:var(--mut,#a8a290)}#wxpop .wxr b{font-weight:600;text-align:right}#wxpop .wxr b.bad{color:#e0a080}#wxpop .wxr b.ok{color:#a8d090}
#cz-wx{background:none;border:0;padding:2px 4px;margin-left:2px;color:var(--gold2,#d8b878);cursor:pointer;filter:drop-shadow(0 1px 2px #000a);vertical-align:middle}#cz-wx svg{width:22px;height:22px}body:not(.cz) #cz-wx{display:none}#date{cursor:pointer}`;document.head.appendChild(st)}
function wxPopShow(el){if(!S)return;if(!wxPop.hidden){wxPop.hidden=true;return}wxPop.innerHTML=wxCard();wxPop.hidden=false;
 try{const r=(el||$('cz-date')).getBoundingClientRect();const top=Math.max(r.bottom+6,48);wxPop.style.top=Math.min(top,innerHeight-wxPop.offsetHeight-8)+'px';wxPop.style.left=Math.max(10,Math.min(r.left,innerWidth-wxPop.offsetWidth-10))+'px'}catch(e){}}
document.addEventListener('pointerdown',e=>{if(wxPop.hidden)return;if(e.target.closest('#wxpop,#cz-wx,#date'))return;wxPop.hidden=true},true);
$('date').addEventListener('click',()=>wxPopShow($('date')));
{const l=$('cz-l');if(l){const b=document.createElement('button');b.id='cz-wx';b.type='button';b.setAttribute('aria-label','Pogoda');const d=$('cz-date');d.insertAdjacentElement('afterend',b);b.addEventListener('click',e=>{e.stopPropagation();wxPopShow($('cz-l')||b)})}}
let wxUiT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);if(!S)return;try{wxFrame(rdt)}catch(e){console.warn(e)}wxUiT+=rdt;if(wxUiT>1){wxUiT=0;const b=$('cz-wx');if(b){const h=ico(wxIcon(tod()>.82||tod()<.2));if(b._h!==h){b._h=h;b.innerHTML=h}}if(!wxPop.hidden)wxPop.innerHTML=wxCard()}}}
// wczytanie starego zapisu: brak natężenia i wiatru
{const _b=boot;boot=function(f){_b(f);if(!S)return;if(S.weather&&S.weather.i===undefined)S.weather.i=.7;if(!S.wind)S.wind={a:.35,s:WX_STR[S.weather.k]||.22};const T=wxTargets();Object.assign(WX,{rain:T.rain,snow:T.snow,fog:T.fog,dim:T.dim,cloud:T.cloud,wind:T.wind,dark:T.dark,heat:T.heat,blow:T.blow,rime:T.rime,wet:wxWetDay()?.8:0})}}
window.__wx={WX,wxTargets,wxCard,wxNewWeather,wxRoll,wxPopShow,set:(k,i,t0)=>{S.weather.k=k;S.weather.i=i===undefined?.7:i;S.weather.left=Math.max(S.weather.left,2);if(t0!==undefined){S.weather.t0=t0;S.weather.t1=t0+.18}if(S.wind)S.wind.s=WX_STR[k]}};
