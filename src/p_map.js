
/* ================= regiony wyspy ================= */
const REGION=new Int8Array(N*N).fill(-1);
const REGIONS=[];
(function(){const r0=rng(SEED+404);const seeds=[];
 const cand=[];for(let j=4;j<N-4;j+=3)for(let i=4;i<N-4;i+=3)if(land[j*N+i])cand.push([i,j]);
 for(let k=cand.length-1;k>0;k--){const q=(r0()*(k+1))|0;const t=cand[k];cand[k]=cand[q];cand[q]=t}
 seeds.push([camp.i,camp.j]);
 for(const c of cand){if(seeds.length>=26)break;if(seeds.every(s=>Math.hypot(s[0]-c[0],s[1]-c[1])>=28))seeds.push(c)}
 const st=seeds.map(()=>({n:0,h:0,f:0,b:0,x:0,z:0}));
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i;if(!land[k])continue;let best=0,bd=1e9;
  for(let q=0;q<seeds.length;q++){const w=(n2(i*.09,j*.09)-.5)*14;const d=Math.hypot(seeds[q][0]-i,seeds[q][1]-j)+w*(q%2?1:-1);if(d<bd){bd=d;best=q}}
  REGION[k]=best;const s=st[best];s.n++;s.h+=tileH(i,j);s.f+=forestF(i+.5,j+.5)>.5?1:0;s.b+=beach[k];s.x+=i;s.z+=j}
 const POOL={high:['Łysa Góra','Siwy Grzbiet','Kruczy Kamień','Wietrzna Grań','Kamienne Progi'],
  forest:['Czarny Bór','Głuchy Las','Wilcze Ostępy','Mszary','Stary Bór','Jodłowy Jar','Leszy Kąt'],
  coast:['Zatoka Mgieł','Słony Cypel','Foczy Brzeg','Siwa Plaża','Kamienista Zatoka','Mewi Cypel'],
  meadow:['Wrzosowisko','Siwa Łąka','Wilcze Błota','Jasna Polana','Paprociowe Pole','Dzwonkowy Stok']};
 const used={high:0,forest:0,coast:0,meadow:0};
 st.forEach((s,q)=>{if(s.n<40)return;const h=s.h/s.n,f=s.f/s.n,b=s.b/s.n;
  const type=h>6.2?'high':b>.12?'coast':f>.62?'forest':'meadow';
  let name=q===0?'Zatoka Wraku':POOL[type][used[type]++%POOL[type].length];
  // środek: kafel regionu najbliższy średniej
  const mx=s.x/s.n,mz=s.z/s.n;let ci=seeds[q][0],cj=seeds[q][1],bd=1e9;
  for(let j=0;j<N;j+=2)for(let i=0;i<N;i+=2)if(REGION[j*N+i]===q){const d=Math.hypot(i-mx,j-mz);if(d<bd){bd=d;ci=i;cj=j}}
  REGIONS[q]={id:q,name,type,n:s.n,i:ci,j:cj,seen:0}});
})();
const regLayer=$('labels');
REGIONS.forEach(r=>{if(!r)return;const el=document.createElement('div');el.className='rl';el.innerHTML='<i>?</i><span>Nieznany teren</span>';el.style.opacity=0;
 el.addEventListener('click',()=>{if(!r.known)return;const title=r.el.querySelector('span');if(title){title.style.display='block';gameCancelLater(r._nameTimer);r._nameTimer=gameLater(()=>{title.style.display=''},2600)}else lookAt(tcx(r.i),tcx(r.j),1.25)});regLayer.appendChild(el);r.el=el});
const campLbl=document.createElement('div');campLbl.className='rl camp';campLbl.innerHTML=`<i>${'P'}</i><span>Przystań</span>`;regLayer.appendChild(campLbl);
campLbl.addEventListener('click',()=>lookAt(tcx(camp.i),tcx(camp.j),1.6));
let regT=0;
function regionScan(quiet){if(!S)return;S.regs=S.regs||{};atlasScan(quiet);const cnt=new Array(REGIONS.length).fill(0);
 for(let k=0;k<N*N;k++){const r=REGION[k];if(r>=0&&rev[k])cnt[r]++}
 REGIONS.forEach(r=>{if(!r)return;r.seen=cnt[r.id]/r.n;const was=!!S.regs[r.id];if(!was&&r.seen>=.22){S.regs[r.id]=1;
   if(!quiet){techXp('nauka',8);log('Zwiadowcy nazwali nowe miejsce: '+r.name+'.');toast('Nowe miejsce: '+r.name);S.hope=clamp(S.hope+.01,0,1)}}
  r.known=!!S.regs[r.id];
  const ex=S.exps&&S.exps.some(e=>e.r===r.id);const h=r.known?`<i>${ex?'⚑':r.type==='high'?'▲':r.type==='coast'?'≈':r.type==='forest'?'♣':'·'}</i><span>${r.name}</span>`:`<i>${ex?'⚑':'?'}</i><span>Nieznany teren</span>`;
  if(r.el._h!==h){r.el._h=h;r.el.innerHTML=h;r.el.classList.toggle('known',r.known);r.el.classList.toggle('unk',!r.known);r.el.style.pointerEvents=r.known?'auto':'none';r.el.style.cursor='pointer'}})}
const v3r=new THREE.Vector3();
function placeRegionLabels(){const show=sstep(1.05,.75,zoom);
 const labelsVisible=zoom>=.84;regLayer.classList.toggle('map-labels-expanded',labelsVisible);const put=(el,x,z,op)=>{v3r.set(x,Hy(x,z)+1.2,z).project(cam);if(op<=.02||v3r.x<-1.1||v3r.x>1.1||v3r.y<-1.1||v3r.y>1.1){el.style.display='none';return}
  el.style.display='flex';el.style.left=((v3r.x+1)/2*innerWidth)+'px';el.style.top=((1-v3r.y)/2*innerHeight)+'px';el.style.opacity=op};
 REGIONS.forEach(r=>{if(!r||!r.el)return;if(r.id===0){r.el.style.display='none';return}
  const op=(r.known?1:sstep(.6,.4,zoom)*.85)*show;put(r.el,tcx(r.i),tcx(r.j),op)});
 put(campLbl,tcx(camp.i),tcx(camp.j),show)}
function regionAt(i,j){const r=REGION[j*N+i];return r>=0?REGIONS[r]:null}

/* ================= minimapa ================= */
const mcv=$('mcv'),mctx=mcv.getContext('2d');
const mBase=document.createElement('canvas');mBase.width=mBase.height=N;const mbx=mBase.getContext('2d');const mImg=mbx.createImageData(N,N);
const toS=v=>Math.round(Math.pow(clamp(v,0,1),1/2.2)*255);
function minimapBase(){const d=mImg.data;
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,o=k*4,vk=j*VW+i;let r,g,b;
  if(land[k]){if(rev[k]){r=toS(baseCol[vk*3]);g=toS(baseCol[vk*3+1]);b=toS(baseCol[vk*3+2]);
    const f=forestF(i+.5,j+.5);if(f>.5&&!beach[k]){r*=.78;g*=.84;b*=.8}}
   else{r=70;g=80;b=84}}
  else{const dp=clamp(-tileHH(i,j)*3,0,1);r=lerp(70,28,dp);g=lerp(118,64,dp);b=lerp(120,78,dp)}
  d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}
 mbx.putImageData(mImg,0,0)}
const MS=mcv.width,MC=MS/2,MSC=MS/(N*1.44);
function mProj(x,z){const c=Math.cos(yaw),s=Math.sin(yaw);return[MC+MSC*(x*c-z*s),MC+MSC*(x*s+z*c)]}
function drawMinimap(){const c=Math.cos(yaw),s=Math.sin(yaw);
 mctx.setTransform(1,0,0,1,0,0);mctx.fillStyle='#1d3a3e';mctx.fillRect(0,0,MS,MS);
 mctx.setTransform(MSC*c,MSC*s,-MSC*s,MSC*c,MC,MC);mctx.imageSmoothingEnabled=true;mctx.drawImage(mBase,-N/2,-N/2,N,N);
 mctx.setTransform(1,0,0,1,0,0);
 if(S){mctx.fillStyle='#e2c48c';S.bld.forEach(b=>{const p=bCenter(b);const q=mProj(p.x,p.z);mctx.fillRect(q[0]-2,q[1]-2,4,4)});
  mctx.fillStyle='#f4ecd8';S.people.forEach(p=>{const q=mProj(p.x,p.z);mctx.fillRect(q[0]-1,q[1]-1,2,2)})}
 const q=mProj(tcx(camp.i),tcx(camp.j));mctx.strokeStyle='#e2c48c';mctx.lineWidth=2;mctx.beginPath();mctx.arc(q[0],q[1],5,0,6.29);mctx.stroke();
 const size=34/zoom,asp=innerWidth/innerHeight,hw=size*asp/2*MSC,hh=size/2/Math.sin(pitch)*MSC;const v=mProj(camT.x,camT.z);
 mctx.strokeStyle='#f4ecd8cc';mctx.lineWidth=1.5;mctx.strokeRect(v[0]-hw,v[1]-hh,hw*2,hh*2)}
let miniT=0,miniBaseT=0;
function mapTick(rdt){placeRegionLabels();miniT+=rdt;miniBaseT+=rdt;
 if(miniBaseT>2.5){miniBaseT=0;minimapBase();regionScan(false)}
 if(miniT>.25){miniT=0;drawMinimap()}}
mcv.addEventListener('pointerdown',e=>{e.stopPropagation();const r=mcv.getBoundingClientRect();const px=(e.clientX-r.left)/r.width*MS,py=(e.clientY-r.top)/r.height*MS;
 const xp=(px-MC)/MSC,yp=(py-MC)/MSC,c=Math.cos(yaw),s=Math.sin(yaw);const x=xp*c+yp*s,z=-xp*s+yp*c;
 if(!S)return;lookAt(x,z,overview?1.3:zoomT);drawMinimap()});

/* Przy widoku wyspy nazwy nie przesłaniają terenu; dotknięcie znacznika ujawnia nazwę. */
