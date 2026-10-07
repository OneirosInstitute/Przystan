
/* ================= 0.19: kolonizacja — przysiółki z własnej woli, ścieżki i drogi, wędrowcy, żywe przysiółki, zagrożenia w głębi wyspy, mapa wspólnoty ================= */
const HAM_T={coast:{n:'rybacki',g:[['ryby',3],['ryby',2],['skory',1],['drewno',2]],food:[.95,.8,.3,.7],d:'ryby, foki i drewno z wyrzutów'},
 forest:{n:'leśny',g:[['miod',1],['skory',1],['drewno',3],['grzyby',2],['mieso',2]],food:[.85,.9,.32,.62],d:'drewno, miód, skóry i grzyby'},
 high:{n:'górski',g:[['kamien',3],['ruda',1],['skory',1],['mleko',1]],food:[.8,.78,.28,.62],d:'kamień, ruda i skóry'},
 meadow:{n:'polny',g:[['ziarno',2],['mleko',2],['jagody',2],['ziola',1]],food:[.88,1,.3,.55],d:'ziarno, mleko i zioła'}};
const HAM_ADJ={coast:['rybacki','rybacka','rybackie'],forest:['leśny','leśna','leśne'],high:['górski','górska','górskie'],meadow:['polny','polna','polne']},HST_G=[2,1,0,2,1];
function hamKind(h){return HST[h.st][0]+' '+HAM_ADJ[hType(h)][HST_G[h.st]]}
function dniW(n){return n===1?'dzień':'dni'}
const HAM_NEED=[.5,.5,.8,.6];
const HST=[['obozowisko',0],['zagroda',5],['przysiółek',9],['osiedle',14],['wieś',24]];
function hType(h){const r=REGIONS[h.rid];return r&&HAM_T[r.type]?r.type:'forest'}
function hamGifts(h){return HAM_T[hType(h)].g}
function hamDng(h){return({coast:.2,meadow:.3,forest:.5,high:.6}[hType(h)]||.4)+Math.min(.3,Math.hypot(h.i-camp.i,h.j-camp.j)/220)-(h.pal?.15:0)-(h.road===2?.1:0)}
function zapWord(z){return z>=.7?'pełne':z>=.4?'wystarczą':z>=.18?'skąpe':'głód'}
function kolInit(){ludInit();S.hamlets.forEach(h=>{if(h.zap===undefined)h.zap=.45;if(h.st===undefined){h.st=0;HST.forEach((s,i)=>{if(h.pop>=s[1])h.st=i})}if(!h.road)h.road=1;if(!h.head)h.head=h.ppl&&h.ppl[0]||'?';if(hamPath[h.id]===undefined)kolPath(h)})}
function settledCount(){return 1+new Set((S.hamlets||[]).map(h=>h.rid)).size}
function regionCount(){return REGIONS.filter(Boolean).length}
function freeRegions(){const used=new Set((S.hamlets||[]).map(h=>h.rid));return REGIONS.filter(r=>r&&r.id!==0&&!used.has(r.id)&&S.regs&&S.regs[r.id]).sort((a,b)=>Math.hypot(a.i-camp.i,a.j-camp.j)-Math.hypot(b.i-camp.i,b.j-camp.j))}

/* ---- ścieżki: A* po lądzie, wydeptane w ziemi ---- */
const hamPath={};let forC=null;
function forAt(i,j){if(!forC){forC=new Float32Array(N*N);for(let b=0;b<N;b++)for(let a=0;a<N;a++)forC[b*N+a]=forestF(a+.5,b+.5)}return forC[j*N+i]}
function kolAstar(si,sj,ti,tj){const NN=N*N,g=new Float32Array(NN).fill(1e9),from=new Int32Array(NN).fill(-1),cl=new Uint8Array(NN),hk=[],hf=[];
 const sw=(a,b)=>{let t=hk[a];hk[a]=hk[b];hk[b]=t;t=hf[a];hf[a]=hf[b];hf[b]=t};
 const push=(k,f)=>{hk.push(k);hf.push(f);let c=hk.length-1;while(c>0){const p=(c-1)>>1;if(hf[p]<=hf[c])break;sw(p,c);c=p}};
 const pop=()=>{const k=hk[0],lk=hk.pop(),lf=hf.pop();if(hk.length){hk[0]=lk;hf[0]=lf;let c=0;for(;;){const l=c*2+1,r=l+1;let m=c;if(l<hk.length&&hf[l]<hf[m])m=l;if(r<hk.length&&hf[r]<hf[m])m=r;if(m===c)break;sw(m,c);c=m}}return k};
 const s=sj*N+si,t=tj*N+ti;g[s]=0;push(s,0);const D=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];let it=0;
 while(hk.length&&it++<90000){const k=pop();if(cl[k])continue;cl[k]=1;if(k===t)break;const i=k%N,j=(k/N)|0,hh=tileH(i,j);
  for(const[di,dj,dc]of D){const a=i+di,b=j+dj;if(a<1||b<1||a>=N-1||b>=N-1)continue;const n=b*N+a;if(cl[n]||!land[n])continue;if(dc>1&&(!land[j*N+a]||!land[b*N+i]))continue;
   const c=dc*(1+Math.abs(tileH(a,b)-hh)*2.2+forAt(a,b)*.7+(occ[n]>=0&&n!==t?5:0))*(tread[n]>.4?.55:1);const ng=g[k]+c;
   if(ng<g[n]){g[n]=ng;from[n]=k;push(n,ng+Math.hypot(a-ti,b-tj)*.55)}}}
 if(t!==s&&from[t]<0)return null;const out=[];for(let k=t;k>=0;k=from[k]){out.push(k);if(k===s)break}return out.reverse()}
function kolPath(h){const tl=kolAstar(camp.i,camp.j,h.i,h.j);if(!tl||tl.length<2){hamPath[h.id]=null;return null}
 let pts=tl.map(k=>[tcx(k%N),tcx((k/N)|0)]);for(let q=0;q<2;q++){const o=[pts[0]];for(let a=0;a<pts.length-1;a++){const p=pts[a],n=pts[a+1];o.push([p[0]*.75+n[0]*.25,p[1]*.75+n[1]*.25],[p[0]*.25+n[0]*.75,p[1]*.25+n[1]*.75])}o.push(pts[pts.length-1]);pts=o}
 const cum=[0];for(let a=1;a<pts.length;a++)cum.push(cum[a-1]+Math.hypot(pts[a][0]-pts[a-1][0],pts[a][1]-pts[a-1][1]));
 const P={tiles:tl,set:new Set(tl),pts,cum,len:cum[cum.length-1]};hamPath[h.id]=P;return P}
function kolClearPath(h,wide){const P=hamPath[h.id];if(!P)return;nodeBy.tree.forEach(n=>{if(n.amt<=0)return;const t=tileOf(n.x,n.z),k=t[1]*N+t[0];
  let hit=P.set.has(k)||P.set.has(k+1)||P.set.has(k-1)||P.set.has(k+N)||P.set.has(k-N);if(!hit&&wide)hit=[N+1,N-1,-N+1,-N-1,2,-2,2*N,-2*N].some(d=>P.set.has(k+d));
  if(hit){n.amt=0;const q=nodes.indexOf(n);if(q>=0)S.nodeAmt[q]=0;setTree(n)}})}
function kolTread(){(S.hamlets||[]).forEach(h=>{const P=hamPath[h.id];if(!P)return;const road=h.road===2,v=road?1:.75;
  P.tiles.forEach(k=>{if(tread[k]<v)tread[k]=v;if(road)for(const d of[1,-1,N,-N]){const n=k+d;if(n>=0&&n<N*N&&land[n]&&tread[n]<.7)tread[n]=.7}})});treadDirty=true}
const hamRib={};const ribMat=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
function kolRibbon(h){const old=hamRib[h.id];const key=h.road+'|'+(hamPath[h.id]?1:0);if(old&&old.userData.key===key)return;if(old){scene.remove(old);old.geometry.dispose();delete hamRib[h.id]}
 const P=hamPath[h.id];if(!P)return;const road=h.road===2,w=road?.62:.32,pts=P.pts,n=pts.length,pos=new Float32Array(n*3*3),col=new Float32Array(n*3*4),idx=[];
 const c0=road?[.54,.45,.33]:[.47,.39,.29],ce=road?[.46,.39,.29]:[.42,.35,.26];
 for(let a=0;a<n;a++){const p=pts[a],q=pts[Math.min(n-1,a+1)],o=pts[Math.max(0,a-1)];let dx=q[0]-o[0],dz=q[1]-o[1];const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;const nx=-dz,nz=dx;
  const end=Math.min(1,Math.min(P.cum[a],P.len-P.cum[a])/2.5);
  for(let s=0;s<3;s++){const off=(s-1)*w*(.9+.15*Math.sin(a*.7)),x=p[0]+nx*off,z=p[1]+nz*off,k=(a*3+s);pos[k*3]=x;pos[k*3+1]=Hy(x,z)+.035;pos[k*3+2]=z;
   const cc=s===1?c0:ce;col[k*4]=cc[0];col[k*4+1]=cc[1];col[k*4+2]=cc[2];col[k*4+3]=(s===1?(road?.95:.8):0)*end}}
 for(let a=0;a<n-1;a++)for(let s=0;s<2;s++){const i0=a*3+s,i1=i0+1,i2=i0+3,i3=i0+4;idx.push(i0,i1,i2,i1,i3,i2)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,4));g.setIndex(idx);g.computeVertexNormals();
 const m=new THREE.Mesh(g,ribMat);m.receiveShadow=true;m.renderOrder=1;m.userData.key=key;scene.add(m);hamRib[h.id]=m}
function kolReveal(h){const P=hamPath[h.id];if(!P)return;P.tiles.forEach((k,a)=>{if(a%3===0)reveal(k%N,(k/N)|0,2)})}

/* ---- wędrowcy na ścieżkach ---- */
const walkers=[],wGroup=new THREE.Group();scene.add(wGroup);
const WCL=[0x6b5a44,0x5a6650,0x7a5a4a,0x4e5a63,0x8a7a5a,0x6a4e3c];
function spawnWalker(h,dir,look,carry,delay){const P=hamPath[h.id];if(!P||walkers.length>12)return 0;
 const f=look||{id:90000+((Math.random()*9000)|0),sex:Math.random()<.5?'k':'m',age:20+Math.random()*30};const fake={id:f.id,sex:f.sex,age:f.age,cloth:f.cloth||WCL[(Math.random()*WCL.length)|0]};
 const m=makePersonMesh(fake);m.scale.setScalar(personScale(fake));m.userData.carry.visible=!!carry;m.visible=false;wGroup.add(m);
 const sp=fake.age<12?.75:.95+Math.random()*.15;walkers.push({m,P,s:dir>0?0:P.len,dir,sp,wait:delay||0,ph:Math.random()*6});return P.len/sp}
function walkGift(h,res){spawnWalker(h,-1,null,1,0);if(h.pop>=6&&Math.random()<.5)spawnWalker(h,-1,null,1,3+Math.random()*4)}
function kolFrame(rdt){if(!S||!walkers.length)return;const gdt=rdt*(S.speed||0);
 for(let w=walkers.length-1;w>=0;w--){const W=walkers[w];if(W.wait>0){W.wait-=gdt;W.m.visible=false;continue}
  W.s+=W.dir*W.sp*gdt;if(W.s<0||W.s>W.P.len){wGroup.remove(W.m);walkers.splice(w,1);continue}
  const c=W.P.cum;let lo=0,hi=c.length-1;while(hi-lo>1){const md=(lo+hi)>>1;if(c[md]<=W.s)lo=md;else hi=md}
  const a=W.P.pts[lo],b=W.P.pts[hi],u=(W.s-c[lo])/Math.max(1e-4,c[hi]-c[lo]),x=a[0]+(b[0]-a[0])*u,z=a[1]+(b[1]-a[1])*u;
  W.m.position.set(x,Hy(x,z),z);W.m.rotation.y=Math.atan2((b[0]-a[0])*W.dir,(b[1]-a[1])*W.dir);const t=tileOf(x,z);W.m.visible=revAt(t[0],t[1]);
  const sw=gdt>0?Math.sin(clock*10+W.ph)*.6:0,U=W.m.userData;U.lL.rotation.x=sw;U.lR.rotation.x=-sw;U.aL.rotation.x=-sw*.8;U.aR.rotation.x=U.carry.visible?-1.1:sw*.8}}
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);kolFrame(rdt)}}

/* ---- przysiółki w 3D: rosną z etapem ---- */
function fishCamp(){const g=new THREE.Group();const fish=r=>{for(let k=0;k<5;k++)r.add(tbox(.07,.24,.04,M(0x9fb0b4),-.3+k*.15,.62,0))};rack(g,0,0,0,fish);rack(g,1.1,.4,.4,fish);
 const hull=tbox(1.7,.28,.6,mPlankD,-.6,.16,1.2);hull.rotation.y=.3;g.add(hull);g.add(tbox(.05,.05,1.9,matDark,-.6,.34,1.2,.3));return g}
function ringFence(g,x0,z0,R,tall,gapA){const step=tall?.34:1.0,n=Math.floor(R*6.283/step),ph=tall?1.5:.85;const pos=[];
 for(let k=0;k<n;k++){const a=k/n*6.283;let d=Math.abs(((a-gapA+9.42)%6.283)-3.14);if(d<.32)continue;pos.push([x0+Math.cos(a)*R,z0+Math.sin(a)*R,a])}
 const geo=new THREE.CylinderGeometry(tall?.09:.05,tall?.1:.06,ph,5),im=new THREE.InstancedMesh(geo,matDark,pos.length),dm=new THREE.Object3D();
 pos.forEach((p,k)=>{dm.position.set(p[0],Hy(p[0],p[1])+ph/2-.05,p[1]);dm.rotation.set(0,0,tall?(k%3-1)*.04:0);dm.scale.set(1,tall?.9+((k*7)%5)*.05:1,1);dm.updateMatrix();im.setMatrixAt(k,dm.matrix)});
 im.castShadow=true;g.add(im);if(!tall&&pos.length>1){const rg=new THREE.BoxGeometry(1,.05,.04),rm=new THREE.InstancedMesh(rg,mPlank,pos.length*2);let q=0;
  for(let k=0;k<pos.length-1;k++){const a=pos[k],b=pos[k+1];const L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L>step*1.6)continue;
   for(const hy of[.35,.65]){dm.position.set((a[0]+b[0])/2,(Hy(a[0],a[1])+Hy(b[0],b[1]))/2+hy,(a[1]+b[1])/2);dm.rotation.set(0,-Math.atan2(b[1]-a[1],b[0]-a[0]),0);dm.scale.set(L,1,1);dm.updateMatrix();rm.setMatrixAt(q++,dm.matrix)}}
  rm.count=q;g.add(rm)}}
const hamM2={};
hamVis=function(){if(!S||!S.hamlets)return;Object.keys(hamM).forEach(id=>{if(!S.hamlets.some(h=>h.id===+id)){const g=hamM[id];if(hamRib[id]){scene.remove(hamRib[id]);delete hamRib[id]}for(let k=fires.length-1;k>=0;k--)if(fires[k].g.parent===g)fires.splice(k,1);scene.remove(g);delete hamM[id]}});
 S.hamlets.forEach(h=>{if(hamPath[h.id]===undefined)kolPath(h);const key=h.st+'|'+(h.pal?1:0)+'|'+(hamPath[h.id]?1:0);let g=hamM[h.id];
  if(g&&g.userData.key!==key){for(let k=fires.length-1;k>=0;k--)if(fires[k].g.parent===g)fires.splice(k,1);scene.remove(g);g=null;delete hamM[h.id]}
  if(!g){g=new THREE.Group();g.userData={key,chims:[]};const x0=tcx(h.i),z0=tcx(h.j),a0=h.id*2.1;const R=3.2+h.st*.9;
   const x00=x0,z00=z0;nodeBy.tree.forEach(n=>{if(n.amt>0&&Math.hypot(n.x-x00,n.z-z00)<R+(h.pal?2:1.5)){n.amt=0;const k=nodes.indexOf(n);if(k>=0)S.nodeAmt[k]=0;setTree(n)}});
   const put=(m,lx,lz,ry)=>{const c=Math.cos(a0),s=Math.sin(a0),wx=x0+lx*c-lz*s,wz=z0+lx*s+lz*c;m.position.set(wx,Hy(wx,wz),wz);m.rotation.y=(ry||0)-a0;g.add(m);return[wx,wz]};
   put(makeBuildingModel('szalas',null),-1.4,.2,.4);{const c=Math.cos(a0),s=Math.sin(a0),wx=x0+.3*c-1.4*s,wz=z0+.3*s+1.4*c;makeFire(g,wx,Hy(wx,wz),wz,true)}
   if(h.st>=1){const p=put(makeBuildingModel('chata',null),1.6,-.4,-.5);g.userData.chims.push(p)}
   if(h.st>=2){const ty=hType(h);put(ty==='coast'?fishCamp():makeBuildingModel(ty==='forest'?'drwal':ty==='high'?'kamien':'zagroda',null),-.3,-3.0,.1);const p=put(makeBuildingModel('chata',null),-2.3,2.6,.9);g.userData.chims.push(p)}
   if(h.st>=3){const p=put(makeBuildingModel('chata',null),3.5,2.2,-1.2);g.userData.chims.push(p)}
   if(h.st>=4){const p=put(makeBuildingModel('dom',null),-4.2,-1.4,.3);g.userData.chims.push(p);put(makeBuildingModel('studnia',null),1.4,3.4,0)}
   const P=hamPath[h.id];let gap=0;if(P&&P.tiles.length>3){const k=P.tiles[P.tiles.length-4];gap=Math.atan2(tcx((k/N)|0)-z0,tcx(k%N)-x0)}
   if(h.pal)ringFence(g,x0,z0,R+1.1,true,gap);else if(h.st>=3)ringFence(g,x0,z0,R+.8,false,gap);
   g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(g);hamM[h.id]=g}
  g.visible=revAt(h.i,h.j)&&!(h.arr&&S.day<h.arr);kolRibbon(h)})}
function kolChims(ch){if(!S||!S.hamlets)return;S.hamlets.forEach(h=>{const g=hamM[h.id];if(!g||!g.visible)return;g.userData.chims.forEach(p=>{if(Math.hypot(p[0]-camT.x,p[1]-camT.z)<45)ch.push([p[0]-.95,Hy(p[0],p[1])+2.6,p[1]])})})}

/* ---- życie przysiółków ---- */
function hamDeath(h,why){if(h.pop<=0)return null;h.pop--;const sex=Math.random()<.5?'k':'m',nm=newName(sex);S.deadNames=S.deadNames||[];S.deadNames.push(nm);h.lost=(h.lost||0)+1;h.lostN=(h.lostN||[]).concat(nm).slice(-12);
 if(h.pop<=0)setTimeout(()=>hamGone(h),50);return nm}
function hamGone(h){if(!S.hamlets.includes(h))return;S.hamlets=S.hamlets.filter(x=>x!==h);log(`Przysiółek ${h.name} opustoszał. Chaty stoją puste, ścieżka zarasta. Na Dziady wspomina się tych, którzy tam żyli.`);hamVis()}
const NEEDS={jedzenie:[25,'jedzenia'],opal:[10,'opału'],narz:[1,'narzędzi'],odziez:[2,'ciepłej odzieży'],ziarno:[6,'ziarna na siew'],naczynia:[3,'naczyń'],plotno:[3,'płótna']};
function genNeed(h){const sea=seasonIdx();let k;if(h.zap<.3)k=sea===2&&Math.random()<.4?'opal':'jedzenie';else if(sea===3&&hType(h)==='meadow')k='ziarno';else if(sea===2)k=Math.random()<.5?'opal':'odziez';else k=['narz','odziez','naczynia','plotno'][(Math.random()*4)|0];
 h.need={k,q:NEEDS[k][0],until:S.day+SD};log(`${h.head} z przysiółka ${h.name} przysyła wieść: brakuje im ${NEEDS[k][1]}. Proszą o ${NEEDS[k][0]}.`)}
function needHave(k,q){if(k==='jedzenie')return foodTotal()>=q+20;if(k==='narz')return S.res.narz+S.res.narzk>=q;return(S.res[k]||0)>=q}
function needTake(k,q){if(k==='jedzenie'){const t=foodTotal();FOOD.forEach(x=>S.res[x]=Math.max(0,S.res[x]-q*(S.res[x]/t)));return}if(k==='narz'){const a=Math.min(S.res.narzk,q);S.res.narzk-=a;S.res.narz-=q-a;return}S.res[k]-=q}
function roadCost(h){const P=hamPath[h.id],L=P?P.len:60;return{drewno:Math.round(8+L*.2),kamien:Math.round(4+L*.1),dni:Math.max(2,Math.round(L/20))}}
function kolDaily(){if(!S.hamlets)return;kolInit();const sea=seasonIdx();
 S.people.forEach(p=>{if(p.waitHome&&!p.waitD)p.waitD=S.day;if(!p.waitHome)p.waitD=0});
 S.hamlets.slice().forEach(h=>{const T=HAM_T[hType(h)];
  const pro=T.food[sea]*(1+.05*h.st)*(h.road===2?1.06:1),need=HAM_NEED[sea]*(sea===2?dM():1);h.zap=clamp(h.zap+(pro-need)*.045,0,1);
  if(Math.random()<K*.0004*h.pop){h.pop--;h.lost=(h.lost||0)+1;if(Math.random()<.3){const sx=Math.random()<.5?'k':'m';log(`W przysiółku ${h.name} zmarł${sx==='k'?'a':''} ${sx==='k'?'stara':'stary'} ${newName(sx)}. Pochowano ${sx==='k'?'ją':'go'} pod brzozą za chatami.`)}if(h.pop<=0){setTimeout(()=>hamGone(h),50);return}}
  if(h.zap<.08&&h.pop>1&&Math.random()<.07*dM()){const nm=hamDeath(h,'glod');if(nm)log(`W przysiółku ${h.name} głód. Zmarł${nm.slice(-1)==='a'?'a':''} ${nm}.`)}
  const nx=HST[h.st+1];if(nx&&h.pop>=nx[1]&&h.zap>.3&&S.day-(h.stD||h.day)>=SD){h.st++;h.stD=S.day;pamAdd(1,'przysiolek');
   log(['',`W przysiółku ${h.name} stanęła pierwsza chata z bali. To już nie obozowisko, tylko zagroda.`,`W przysiółku ${h.name} jest już kilka chat i ${T.n==='rybacki'?'suszarnie ryb':T.n==='leśny'?'chata drwala':T.n==='górski'?'łom kamienia':'zagroda dla kóz'}. Ludzie mówią o nim jak o prawdziwym miejscu.`,`Wokół przysiółka ${h.name} stanął płot. Osiedle ma swoje pola i swoje ścieżki.`,`${h.name} to już wieś. Druga osada na wyspie, z domem rodu i studnią.`][h.st]);toast(h.name+': '+HST[h.st][0])}
  if(h.need&&S.day>h.need.until){h.wiez=Math.max(0,h.wiez-.1);log(`Nikt nie odpowiedział na prośbę przysiółka ${h.name}. Więź jest ${wiezWord(h)}.`);h.need=null}
  else if(!h.need&&S.day-(h.needD||h.day)>SD*1.5&&Math.random()<(h.zap<.3?.3:.05)){genNeed(h);h.needD=S.day}
  if(h.rb){h.rb.p++;if(h.rb.p>=h.rb.n){h.rb=null;h.road=2;kolClearPath(h,true);pamAdd(2,'droga');log(`Droga do przysiółka ${h.name} gotowa: wyrównana, z kładkami przez strumienie i palami przy brzegu. Ludzie chodzą nią co kilka dni.`);toast('Droga do '+h.name+' gotowa');song('Pieśń o drodze do przysiółka '+h.name)}}
  if([0,18,25,30].includes(Math.floor(rday()))&&h.wiez>=.3)for(let k=0;k<Math.min(4,1+(h.pop>>2));k++)spawnWalker(h,-1,null,0,k*2+Math.random()*3);
  if(h.road===2&&Math.random()<.4)spawnWalker(h,Math.random()<.5?1:-1,null,Math.random()<.4,Math.random()*30)
  else if(Math.random()<.12*h.wiez)spawnWalker(h,Math.random()<.5?1:-1,null,0,Math.random()*30)});
 kolTread();hamVis()}
{const _ad=actDaily;actDaily=function(){_ad();kolDaily()}}

/* ---- zakładanie przysiółków ---- */
function willWord(m){const fid=m[0].fam,f=S.fams[fid],hm=f&&f.home?bById(f.home):null;const z=m.filter(isAdult).reduce((a,p)=>a+(p.zad||.5),0)/Math.max(1,m.filter(isAdult).length);
 if(m.some(p=>p.waitHome)||!hm||hm.kind==='szalas'||z<.45)return['chętnie',2];if(hm&&(hm.kind==='dom'||hm.kind==='chata')&&z>=.62)return['niechętnie',0];return['rozważą',1]}
function kolCands(){const out=[],seen=new Set();
 S.people.filter(p=>p.waitHome&&p.sex==='k').forEach(k=>{const m=pById(k.pair);if(!m)return;seen.add(k.id);seen.add(m.id);out.push({m:[k,m],n:`${k.name} i ${m.name}`,d:'młoda para bez własnego domu'})});
 Object.values(S.fams).forEach(f=>{const mem=famMembers(f.id).filter(p=>!seen.has(p.id));if(mem.filter(isAdult).length<2||mem.length>8)return;  out.push({m:mem,n:`Rodzina ${gen(famName(f.id))}`,fam:1,d:`${mem.length} ${osb(mem.length)}`})});
 return out.map(c=>{c.w=willWord(c.m);return c}).sort((a,b)=>b.w[1]-a.w[1]||a.m.length-b.m.length).slice(0,4)}
function kolWhyNot(){if(S.tier<1)return'Najpierw osada musi stanąć na nogach: poziom Osada (4 domy, 20 osób).';if(!freeRegions().length)return'Nie ma poznanej krainy bez przysiółka. Wyślij zwiadowców albo wyprawę.';if(!kolCands().length)return'Nie ma rodziny ani młodej pary, która mogłaby pójść.';if(S.people.length<14)return'Osada jest za mała, żeby ktoś odchodził.';return''}
function kolSupply(){const ok=foodTotal()>=60&&S.res.drewno>=15&&S.res.narz+S.res.narzk>=1;if(ok){needTake('jedzenie',30);S.res.drewno-=15;needTake('narz',1)}return ok}
function kolGo(c,rid,eager){const r=REGIONS[rid];const sup=kolSupply();const snap=c.m.map(p=>({id:p.id,sex:p.sex,age:p.age,cloth:p.cloth,x:p.x,z:p.z}));
 if(c.w[1]===0){S.dis=clamp((S.dis||0)+.04,0,1)}
 const h=foundHamlet(c.m,'wola',rid,{wiez:c.w[1]===0?.38:eager?.62:.55,zap:sup?.62:.36,quiet:true});if(!h)return null;
 Object.values(S.fams).forEach(f=>{if(!famMembers(f.id).length){f.home=null;delete S.fams[f.id]}});
 kolInit();kolPath(h);kolReveal(h);kolClearPath(h,false);kolTread();let tmax=0;snap.forEach((p,k)=>{const t=spawnWalker(h,1,p,k===0&&sup,k*1.4);tmax=Math.max(tmax,(t||0)+k*1.4)});h.arr=S.day+tmax/DAY;
 log(`${c.n} ${c.fam?'wyrusza':'wyruszają we dwoje'} do krainy ${r.name}. ${sup?'Biorą na drogę jedzenie, kłody i narzędzia.':'Idą z tym, co uniosą.'} Za kilka dni staną tam pierwsze szałasy. Tak zaczyna się ${h.name}.`);
 toast('Nowy przysiółek: '+h.name);sfx('bell');hamVis();return h}
{const _f=foundHamlet;foundHamlet=function(m,why,rid,o){const snap=(m||[]).map(p=>({id:p.id,sex:p.sex,age:p.age,cloth:p.cloth}));const h=_f(m,why,rid,o);
 if(h&&why!=='wola'){kolInit();kolPath(h);kolReveal(h);kolClearPath(h,false);kolTread();let tmax=0;snap.forEach((p,k)=>{const t=spawnWalker(h,1,p,0,k*1.4);tmax=Math.max(tmax,(t||0)+k*1.4)});h.arr=S.day+tmax/DAY;hamVis()}return h}}
function kolNew(){const why=kolWhyNot();if(why){toast(why);return}const rs=freeRegions().slice(0,4);
 openEvent({ey:'Wiec',t:'Nowy przysiółek',text:()=>'Ktoś rozkłada na ziemi mapę wyspy wyrysowaną węglem na korze. Wiec radzi, gdzie warto osiąść. Daleko jest więcej ziemi, ale dłuższa droga i więcej niebezpieczeństw.',
  opts:rs.map(r=>{const d=Math.round(Math.hypot(r.i-camp.i,r.j-camp.j)),dg=hamDng({rid:r.id,i:r.i,j:r.j});return{n:r.name,d:`przysiółek ${HAM_T[r.type].n}: ${HAM_T[r.type].d} · ${d<45?'blisko':d<90?'pół dnia drogi':'daleko'} · ${dg<.4?'spokojnie':dg<.6?'trzeba uważać':'groźnie'}`,
   f:()=>{S.kolR=r.id;setTimeout(kolWho,400);return`Wiec wybiera krainę ${r.name}. Teraz trzeba zapytać, kto pójdzie.`}}}).concat([{n:'Jeszcze nie teraz',d:'',f:()=>'Mapa wraca pod belkę. Może na wiosnę.'}])},{})}
function kolWho(){if(evOpen){setTimeout(kolWho,700);return}const rid=S.kolR;const r=REGIONS[rid];if(!r)return;const cs=kolCands();if(!cs.length){toast('Nikt nie może teraz pójść.');return}
 const sup=foodTotal()>=60&&S.res.drewno>=15&&S.res.narz+S.res.narzk>=1;
 openEvent({ey:'Wiec',t:'Kto pójdzie: '+r.name,text:()=>`Do krainy ${r.name} trzeba iść z rodziną i dobytkiem. ${sup?'Osada da im na drogę 30 jedzenia, 15 kłód i narzędzia.':'Osada nie ma teraz zapasów, żeby ich wyposażyć. Pójdą z tym, co uniosą.'} Kto pójdzie niechętnie, będzie miał żal.`,
  opts:cs.map(c=>({n:c.n,d:`${c.d} · ${c.w[0]}`,f:()=>{const h=kolGo(c,rid,c.w[1]===2);return h?(c.w[1]===0?`Idą, ale bez radości. Na odchodne nikt się nie odwraca. ${h.name} będzie pamiętał, że ich wysłano.`:`Żegnają się przy ognisku. Rano idą ścieżką w głąb wyspy, a dzieci machają, dopóki ich widać.`):'Nie udało się wyruszyć.'}})).concat([{n:'Nikt, jeszcze nie teraz',d:'',f:()=>'Wiec się rozchodzi. Kraina poczeka.'}])},{})}

/* ---- wydarzenia: prośby młodych, zagrożenia, dobre chwile ---- */
function thrOK(){return(S.hamlets||[]).length&&S.day>=(S.kolTT||0)}
function thrSet(){S.kolTT=S.day+(YEAR/4)/dM()}
function hamPick(f){const c=(S.hamlets||[]).filter(h=>!(h.arr&&S.day<h.arr)&&h.pop>0&&f(h));if(!c.length)return null;let tot=c.reduce((a,h)=>a+hamDng(h),0),x=Math.random()*tot;for(const h of c){x-=hamDng(h);if(x<=0)return h}return c[0]}
const isT=(...t)=>h=>t.includes(hType(h));
function bad(p){return Math.random()<p*dM()}
EVENTS.push(
 {id:'kol_mlodzi',w:3,cd:50,cond:()=>S.tier>=1&&freeRegions().length>0&&(S.hamlets||[]).length<14&&S.people.some(p=>p.waitHome&&p.waitD&&S.day-p.waitD>=SD),t:'Chcemy iść na swoje',
  ctx:()=>{const k=S.people.find(p=>p.waitHome&&p.sex==='k'&&p.waitD&&S.day-p.waitD>=SD);const m=k&&pById(k.pair);if(!m)return null;return{k,m,r:freeRegions()[0]}},
  text:c=>`${c.k.name} i ${c.m.name} od dawna czekają na własny dom. Przychodzą na wiec razem i mówią, że nie chcą dłużej spać u rodziców. Słyszeli, że w krainie ${c.r.name} jest dobra ziemia. Chcą tam iść i postawić własną chatę.`,
  opts:[{n:'Pobłogosławić i wyposażyć',d:'30 jedzenia, 15 kłód i narzędzia, jeśli są',f:c=>{const h=kolGo({m:[c.k,c.m],n:`${c.k.name} i ${c.m.name}`,w:['chętnie',2]},c.r.id,true);return h?'Starsi kładą im ręce na głowach. Rano idą, a matka długo stoi na ścieżce.':'Nie da się teraz iść.'}},
   {n:'Poprosić, żeby zostali',d:'zostaną, ale z żalem',f:c=>{[c.k,c.m].forEach(p=>{p.waitD=S.day;p.zad=Math.max(0,(p.zad||.5)-.12)});return'Zostają. Mówią, że poczekają, ale widać, że myślami są już daleko.'}}]},
 {id:'kol_niedzw',w:1,cd:60,cond:()=>thrOK()&&seasonIdx()!==2&&!!hamPick(isT('forest','high')),t:'Niedźwiedź przy przysiółku',ctx:()=>{const h=hamPick(isT('forest','high'));if(!h)return null;thrSet();return{h}},
  text:c=>`Z przysiółka ${c.h.name} przybiega chłopak, cały zdyszany. Niedźwiedź od trzech nocy krąży wokół zagród. Rozbił ul i porwał kozę. Ludzie boją się chodzić do lasu.`,
  opts:[{n:'Wysłać myśliwego',d:'skóry i mięso albo rany',f:c=>{const p=S.people.filter(isAdult).sort((a,b)=>b.sk.mysliwy-a.sk.mysliwy)[0];if(!p)return'Nie ma kogo posłać.';
    if(Math.random()<.45+.12*p.sk.mysliwy){S.res.skory+=3;S.res.mieso+=12;c.h.wiez=Math.min(1,c.h.wiez+.12);p.xp.mysliwy=(p.xp.mysliwy||0)+40;pamAdd(1,'czyn');return`${p.name} tropi niedźwiedzia dwa dni i wraca ze skórą. W przysiółku ${c.h.name} będą o tym długo opowiadać.`}
    p.hp=Math.max(.15,p.hp-.4);p.hurt=1;c.h.zap=Math.max(0,c.h.zap-.08);return`${p.name} wraca poturbowany, z rozdartym ramieniem. Niedźwiedź uciekł w góry, ale może wrócić.`}},
   {n:'Niech radzą sobie sami',d:'',f:c=>{if(bad(.4)){const nm=hamDeath(c.h);c.h.wiez=Math.max(0,c.h.wiez-.08);return`Przy barciach niedźwiedź atakuje. Ginie ${nm}. W przysiółku ${c.h.name} mówią, że osada ich zostawiła.`}c.h.zap=Math.max(0,c.h.zap-.08);return'Palą ogniska wokół zagród i walą w kotły. Po tygodniu niedźwiedź odchodzi.'}}]},
 {id:'kol_wilki',w:1,cd:60,cond:()=>thrOK()&&seasonIdx()===2&&!!hamPick(h=>!h.pal),t:'Wilki zimą',ctx:()=>{const h=hamPick(h=>!h.pal);if(!h)return null;thrSet();return{h}},
  text:c=>`Zima jest długa, a wilki podchodzą pod same chaty w przysiółku ${c.h.name}. Nocą słychać, jak drapią w drzwi obory.`,
  opts:[{n:'Pomóc postawić częstokół',d:'20 kłód, przysiółek będzie bezpieczniejszy',f:c=>{if(S.res.drewno<20)return'Nie ma tylu kłód. Ludzie z przysiółka muszą sobie radzić sami.';S.res.drewno-=20;c.h.pal=1;c.h.wiez=Math.min(1,c.h.wiez+.1);hamVis();return`Ludzie z osady idą z siekierami. W trzy dni wokół przysiółka ${c.h.name} staje częstokół z zaostrzonych pali.`}},
   {n:'Posłać opał i jedzenie',d:'15 jedzenia i 8 opału',f:c=>{if(!needHave('jedzenie',15)||S.res.opal<8)return'Za mało zapasów.';needTake('jedzenie',15);S.res.opal-=8;c.h.zap=Math.min(1,c.h.zap+.15);spawnWalker(c.h,1,null,1,0);return bad(.35)?'Dary pomagają przetrwać, ale wilki i tak zabierają kilka kóz.':'Przy większych ogniach wilki trzymają się z daleka.'}},
   {n:'Nic nie możemy zrobić',d:'',f:c=>{c.h.wiez=Math.max(0,c.h.wiez-.06);if(bad(.4)){const nm=hamDeath(c.h);return`W drodze po drewno wilki atakują. Ginie ${nm}. Do wiosny nikt z przysiółka nie przychodzi do osady.`}c.h.zap=Math.max(0,c.h.zap-.1);return'Wilki zabierają kozy, ale ludzie przetrwali.'}}]},
 {id:'kol_goraczka',w:1,cd:70,cond:()=>thrOK()&&[0,3].includes(seasonIdx())&&!!hamPick(isT('forest','meadow')),t:'Gorączka z bagien',ctx:()=>{const h=hamPick(isT('forest','meadow'));if(!h)return null;thrSet();return{h}},
  text:c=>`W przysiółku ${c.h.name} kilka osób leży w gorączce. Ziemia tam podmokła, wieczorami nad trawą stoi mgła i chmary komarów.`,
  opts:[{n:'Posłać zielarkę z ziołami',d:'6 ziół',f:c=>{if(S.res.ziola<6)return'Nie ma tylu ziół. Chorzy muszą wydobrzeć sami.';S.res.ziola-=6;const z=offHolder('zielarka');if(Math.random()<(z?.88:.6)){c.h.wiez=Math.min(1,c.h.wiez+.12);return`${z?z.name:'Ktoś z osady'} siedzi przy chorych cztery noce. Wszyscy wstają.`}const nm=hamDeath(c.h);return`Zioła pomagają większości, ale ${nm} nie wydobrzał${nm.slice(-1)==='a'?'a':''}.`}},
   {n:'Niech przyjdą leczyć się do nas',d:'choroba może przejść na osadę',f:c=>{c.h.wiez=Math.min(1,c.h.wiez+.06);if(Math.random()<.3){S.health=clamp(S.health-.08,0,1);return'Chorzy wracają do zdrowia, ale gorączka przechodzi na kilka osób w osadzie.'}return'Chorzy leżą w osadzie przy ciepłym piecu i po tygodniu wracają do siebie.'}},
   {n:'Czekać, aż przejdzie',d:'',f:c=>{if(bad(.5)){const nm=hamDeath(c.h);return`Gorączka mija po dwóch tygodniach. Umiera ${nm}.`}return'Gorączka mija sama. Ludzie są osłabieni, ale żyją.'}}]},
 {id:'kol_pozar',w:1,cd:80,cond:()=>thrOK()&&seasonIdx()===0&&!!hamPick(isT('forest')),t:'Las płonie',ctx:()=>{const h=hamPick(isT('forest'));if(!h)return null;thrSet();return{h}},
  text:c=>`Nad lasem za przysiółkiem ${c.h.name} stoi słup dymu. Las płonie, a wiatr niesie ogień w stronę chat.`,
  opts:[{n:'Wszyscy do gaszenia',d:'osada traci dzień pracy',f:c=>{needTake('jedzenie',Math.min(10,foodTotal()));S.hope=clamp(S.hope-.02,0,1);if(Math.random()<.85){c.h.wiez=Math.min(1,c.h.wiez+.12);return'Kopią rowy i gaszą ogień gałęziami do późnej nocy. Chaty ocalały.'}c.h.st=Math.max(0,c.h.st-1);hamVis();return'Ognia nie udało się zatrzymać. Spłonęła jedna chata, ale ludzie są cali.'}},
   {n:'Niech uciekają z dobytkiem',d:'',f:c=>{c.h.st=Math.max(0,c.h.st-1);c.h.zap=Math.max(0,c.h.zap-.2);hamVis();return`Ludzie z przysiółka ${c.h.name} uciekają do strumienia. Ogień zabiera chaty i zapasy. Zaczną od nowa.`}}]},
 {id:'kol_osuwisko',w:1,cd:80,cond:()=>thrOK()&&seasonIdx()===3&&!!hamPick(isT('high')),t:'Osuwisko',ctx:()=>{const h=hamPick(isT('high'));if(!h)return null;thrSet();return{h}},
  text:c=>`Wiosenne roztopy podmyły zbocze nad przysiółkiem ${c.h.name}. Ziemia z kamieniami zsunęła się na chaty.`,
  opts:[{n:'Posłać cieśli i kłody',d:'15 kłód',f:c=>{if(S.res.drewno<15)return'Nie ma tylu kłód.';S.res.drewno-=15;c.h.wiez=Math.min(1,c.h.wiez+.1);return'Cieśle z osady w tydzień stawiają nowe ściany. Zbocze podparto palami.'}},
   {n:'Odbudują sami',d:'',f:c=>{c.h.st=Math.max(0,c.h.st-1);hamVis();if(bad(.3)){const nm=hamDeath(c.h);return`Pod ziemią zostaje ${nm}. Resztę wykopują własnymi rękami.`}return'Odbudowują powoli, z tego, co zostało.'}}]},
 {id:'kol_sztorm',w:1,cd:70,cond:()=>thrOK()&&[1,3].includes(seasonIdx())&&!!hamPick(isT('coast')),t:'Sztorm połamał łodzie',ctx:()=>{const h=hamPick(isT('coast'));if(!h)return null;thrSet();return{h}},
  text:c=>`Sztorm połamał łodzie w przysiółku ${c.h.name}. Bez łodzi nie będzie ryb na zimę.`,
  opts:[{n:'Posłać deski na nowe łodzie',d:'10 desek',f:c=>{if(S.res.deski<10)return'Nie ma tylu desek.';S.res.deski-=10;c.h.wiez=Math.min(1,c.h.wiez+.1);return'W dwa tygodnie na brzegu leżą nowe łodzie, pachnące żywicą.'}},
   {n:'Niech łowią z brzegu',d:'',f:c=>{c.h.zap=Math.max(0,c.h.zap-.25);return'Łowią z brzegu i ze skał. Ryb jest mniej, zima będzie chuda.'}}]},
 {id:'kol_zaginiony',w:1,cd:60,cond:()=>thrOK()&&!!hamPick(h=>hType(h)!=='coast'),t:'Zaginiony w puszczy',ctx:()=>{const h=hamPick(h=>hType(h)!=='coast');if(!h)return null;thrSet();return{h}},
  text:c=>`Z przysiółka ${c.h.name} ktoś poszedł w puszczę po żywicę i nie wrócił. Minęły dwie noce.`,
  opts:[{n:'Wysłać ludzi na poszukiwania',d:'dwoje dorosłych na dzień',f:c=>{if(Math.random()<.7){c.h.wiez=Math.min(1,c.h.wiez+.12);pamAdd(1,'czyn');if(Math.random()<.3)song('Pieśń o tym, co zabłądził w puszczy');return'Znajdują go w wąwozie ze skręconą nogą. Niosą go na noszach z gałęzi do samego przysiółka.'}const nm=hamDeath(c.h);return`Szukają trzy dni. Znajdują tylko torbę z żywicą. ${nm} nie wróci.`}},
   {n:'Czekać',d:'',f:c=>{if(Math.random()<.4)return'Czwartego dnia wraca sam, wychudzony, ale żywy.';const nm=hamDeath(c.h);return`${nm} nie wraca. Puszcza nie oddaje tego, co zabrała.`}}]},
 {id:'kol_wesele',w:1,cd:70,cond:()=>(S.hamlets||[]).some(h=>h.pop>=5&&h.wiez>=.3&&!(h.arr&&S.day<h.arr)),t:'Wesele w przysiółku',ctx:()=>{const c=S.hamlets.filter(h=>h.pop>=5&&h.wiez>=.3);return c.length?{h:c[(Math.random()*c.length)|0]}:null},
  text:c=>`W przysiółku ${c.h.name} będzie wesele. Przyszli z zaproszeniem dla całej osady, z wieńcem z kłosów i dzbanem miodu.`,
  opts:[{n:'Iść całą osadą',d:'10 jedzenia na dary, nadzieja i więź',f:c=>{if(needHave('jedzenie',10))needTake('jedzenie',10);S.hope=clamp(S.hope+.05,0,1);S.wh=(S.wh||0)+.02;c.h.wiez=Math.min(1,c.h.wiez+.2);c.h.pop++;for(let k=0;k<4;k++)spawnWalker(c.h,1,null,0,k*2);return'Idą ścieżką z pochodniami i śpiewem. Wesele trwa do rana, a młodzi z osady i przysiółka tańczą razem.'}},
   {n:'Posłać dary i życzenia',d:'',f:c=>{c.h.wiez=Math.min(1,c.h.wiez+.08);c.h.pop++;spawnWalker(c.h,1,null,1,0);return'Posłaniec niesie dary i wraca z kołaczem.'}}]},
 {id:'kol_slad',w:1,cd:999,cond:()=>(S.hamlets||[]).some(h=>tribe.some(t=>!S.found.includes(t.k)&&Math.hypot(t.i-h.i,t.j-h.j)<36)),t:'Coś w głębi lasu',
  ctx:()=>{for(const h of S.hamlets){const t=tribe.find(t=>!S.found.includes(t.k)&&Math.hypot(t.i-h.i,t.j-h.j)<36);if(t)return{h,t}}return null},
  text:c=>`Ludzie z przysiółka ${c.h.name} znaleźli w głębi lasu coś, czego nie umieją nazwać. Mówią o kamieniach ułożonych ręką człowieka.`,
  opts:[{n:'Posłać kogoś, by obejrzał',d:'odsłania kawałek wyspy',f:c=>{reveal(c.t.i,c.t.j,7);return'Ktoś z osady idzie z przewodnikiem z przysiółka. To ślad dawnego ludu.'}},{n:'Niech zostanie w spokoju',d:'',f:()=>'Nikt tam nie chodzi. Dzieci z przysiółka opowiadają o tym miejscu straszne historie.'}]},
 {id:'kol_dobry',w:1,cd:80,cond:()=>seasonIdx()===1&&(S.hamlets||[]).some(h=>h.zap>.7&&h.pop>=4),t:'Dobry rok w przysiółku',ctx:()=>{const h=S.hamlets.find(h=>h.zap>.7&&h.pop>=4);return h?{h}:null},
  text:c=>`W przysiółku ${c.h.name} był dobry rok. ${c.h.head} przysyła ludzi z pełnymi koszami: chcą się podzielić.`,
  opts:[{n:'Przyjąć z wdzięcznością',d:'dary z przysiółka',f:c=>{const g=hamGifts(c.h);g.forEach(([k,v])=>S.res[k]=(S.res[k]||0)+Math.round(v*c.h.pop*.6));c.h.zap-=.15;c.h.wiez=Math.min(1,c.h.wiez+.05);walkGift(c.h);return'Kosze stawia się na środku osady. Wieczorem jest uczta.'}},
   {n:'Niech zachowają na zimę',d:'',f:c=>{c.h.zap=Math.min(1,c.h.zap+.1);c.h.wiez=Math.min(1,c.h.wiez+.1);return'Wiec dziękuje i odsyła kosze. W przysiółku długo pamiętają ten gest.'}}]});

/* ---- panel Wspólnota ---- */
hamletHTML=function(){kolInit();const hs=S.hamlets;if(S.tier<1&&!hs.length)return'';const tot=hs.reduce((a,h)=>a+h.pop,0),why=kolWhyNot();
 let h=`<h3>Wspólnota</h3><div class="card"><h4>Zasiedlone krainy: ${settledCount()} z ${regionCount()}</h4><p>${S.people.length} ${osb(S.people.length)} w osadzie${hs.length?` i ${tot} w ${hs.length===1?'przysiółku':'przysiółkach'}`:''}. Celem jest cała wyspa: przysiółek w każdej krainie.</p>
 <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><button data-kmap>Mapa wspólnoty</button><button data-knew ${why?'disabled':''} class="${why?'':'pri'}">Nowy przysiółek</button></div>${why?`<p class="mut" style="margin-top:4px">${why}</p>`:''}</div>`;
 hs.forEach(x=>{const r=REGIONS[x.rid],T=HAM_T[hType(x)],rc=roadCost(x),trav=x.arr&&S.day<x.arr;
  h+=`<div class="card"><h4>${x.name} <span class="mut" style="font-size:13px">${hamKind(x)}</span></h4>
  <p>${r&&r.known?r.name+' · ':''}${x.pop} ${osb(x.pop)} · więź ${wiezWord(x)} · zapasy ${zapWord(x.zap)}${x.pal?' · częstokół':''}</p>
  <p class="mut">Starszy: ${x.head} · ${rodName(x.rod)} · daje: ${T.d}${x.lost?` · pochowano: ${x.lost}`:''}</p>
  ${trav?'<p class="mut">Są jeszcze w drodze.</p>':''}
  ${x.need?`<p><b>Prośba:</b> ${NEEDS[x.need.k][1]} (${x.need.q}). Czekają jeszcze ${Math.max(1,Math.ceil(x.need.until-S.day))} ${dniW(Math.max(1,Math.ceil(x.need.until-S.day)))}.</p><button data-kneed="${x.id}" ${needHave(x.need.k,x.need.q)?'class="pri"':'disabled'}>Wyślij ${NEEDS[x.need.k][1]}</button>`:''}
  <p class="mut" style="margin-top:4px">${x.road===2?'Droga z osady: wyrównana, ludzie chodzą często.':x.rb?`Droga w budowie: ${Math.round(100*x.rb.p/x.rb.n)}%.`:hamPath[x.id]?`Wydeptana ścieżka, ${Math.round(hamPath[x.id].len)} kroków.`:'Brak drogi lądem.'}</p>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px"><button data-kdar="${x.id}">Dary (20 jedzenia, 6 opału)</button>${x.road!==2&&!x.rb&&hamPath[x.id]?`<button data-kroad="${x.id}" ${S.res.drewno>=rc.drewno&&S.res.kamien>=rc.kamien?'':'disabled'}>Wytycz drogę (${rc.drewno} kłód, ${rc.kamien} kamienia)</button>`:''}<button data-klook="${x.id}">Pokaż</button></div></div>`});
 return h};
document.addEventListener('click',e=>{if(!S)return;const t=e.target.closest('[data-kmap],[data-knew],[data-kneed],[data-kroad],[data-klook],[data-kdar]');if(!t||t.disabled)return;
 if(t.dataset.kmap!==undefined){kmapOpen();return}if(t.dataset.knew!==undefined){kolNew();return}
 const h=S.hamlets.find(x=>x.id===+(t.dataset.kneed||t.dataset.kroad||t.dataset.klook||t.dataset.kdar));if(!h)return;
 if(t.dataset.klook){closeSheet();lookAt(tcx(h.i),tcx(h.j),1.5);return}
 if(t.dataset.kneed&&h.need){const{k,q}=h.need;if(!needHave(k,q)){toast('Za mało.');return}needTake(k,q);h.zap=Math.min(1,h.zap+(k==='jedzenie'?.25:.1));h.wiez=Math.min(1,h.wiez+.15);h.need=null;spawnWalker(h,1,null,1,0);log(`Do przysiółka ${h.name} poszło: ${NEEDS[k][1]} (${q}). Więź jest ${wiezWord(h)}.`);toast('Wysłane');}
 if(t.dataset.kdar){if(foodTotal()<40||S.res.opal<6){toast('Za mało zapasów, żeby się dzielić.');return}needTake('jedzenie',20);S.res.opal-=6;h.wiez=Math.min(1,h.wiez+.15);h.zap=Math.min(1,h.zap+.2);spawnWalker(h,1,null,1,0);log(`Do przysiółka ${h.name} poszły dary: jedzenie i opał. Więź jest ${wiezWord(h)}.`);toast('Dary wysłane')}
 if(t.dataset.kroad){const c=roadCost(h);if(S.res.drewno<c.drewno||S.res.kamien<c.kamien){toast('Za mało kłód albo kamienia.');return}S.res.drewno-=c.drewno;S.res.kamien-=c.kamien;h.rb={p:0,n:c.dni};log(`Osada wytycza drogę do przysiółka ${h.name}: karczowanie, kładki, kamienie w błoto. Potrwa około ${c.dni} dni.`);toast('Droga w budowie')}
 renderPanel()});

/* ---- mapa wspólnoty ---- */
{const d=document.createElement('div');d.id='kmap';d.hidden=true;d.innerHTML=`<div class="kbox"><div class="khead"><div><div class="eyebrow">Wyspa</div><b>Mapa wspólnoty</b></div><button data-kclose aria-label="Zamknij">✕</button></div><canvas id="kcv"></canvas><div id="kleg"></div></div>`;document.body.appendChild(d);
 const st=document.createElement('style');st.textContent=`#kmap{position:fixed;inset:0;z-index:70;background:rgba(8,12,12,.72);display:flex;align-items:center;justify-content:center;padding:10px}#kmap[hidden]{display:none}
 #kmap .kbox{background:#161b1a;border:1px solid #3b3a2e;border-radius:14px;padding:12px;width:min(760px,100%);max-height:100%;overflow:auto;box-shadow:0 10px 40px #0008}
 #kmap .khead{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}#kmap .khead .eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}#kmap .khead b{font-family:Georgia,serif;font-size:20px;color:var(--hi)}#kmap .khead button{width:38px;height:38px;padding:0}
 #kcv{width:min(100%,calc(100vh - 210px));aspect-ratio:1;display:block;margin:0 auto;border-radius:10px;touch-action:none;cursor:pointer}#kleg{margin-top:8px;font-size:13px;color:var(--mut);line-height:1.45}#kleg b{color:var(--hi);font-weight:600}#kleg .kr{display:flex;justify-content:space-between;gap:8px;border-top:1px solid #2a2f2c;padding:5px 0}`;document.head.appendChild(st);
 d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-kclose]'))kmapClose()});
 $('kcv').addEventListener('pointerdown',e=>{const c=$('kcv'),r=c.getBoundingClientRect(),ti=(e.clientX-r.left)/r.width*N,tj=(e.clientY-r.top)/r.height*N;
  let best=null,bd=6;[{i:camp.i,j:camp.j,o:null}].concat(S.hamlets.map(h=>({i:h.i,j:h.j,o:h}))).forEach(m=>{const dd=Math.hypot(m.i-ti,m.j-tj);if(dd<bd){bd=dd;best=m}});
  if(!best){const rg=regionAt(clamp(Math.floor(ti),0,N-1),clamp(Math.floor(tj),0,N-1));if(rg&&rg.known){kmapClose();lookAt(tcx(rg.i),tcx(rg.j),1.25)}return}
  kmapClose();lookAt(tcx(best.i),tcx(best.j),1.5)});
 const sm=document.querySelector('#mini small');if(sm){sm.textContent='WYSPA · MAPA';sm.style.cursor='pointer';sm.style.pointerEvents='auto';sm.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();if(S)kmapOpen()})}}
let kmapPrev=null;
function kmapOpen(){if(!S)return;kolInit();minimapBase();$('kmap').hidden=false;kmapPrev=S.speed;kmapDraw()}
function kmapClose(){$('kmap').hidden=true}
function kmapDraw(){const c=$('kcv'),W=Math.round(c.getBoundingClientRect().width*Math.min(2,devicePixelRatio||1))||600;c.width=c.height=W;const x=c.getContext('2d'),s=W/N;
 x.imageSmoothingEnabled=true;x.drawImage(mBase,0,0,W,W);x.fillStyle='rgba(10,16,16,.18)';x.fillRect(0,0,W,W);
 const P=(i,j)=>[i*s,j*s];x.lineCap='round';x.lineJoin='round';
 S.hamlets.forEach(h=>{const Pt=hamPath[h.id];if(!Pt)return;x.beginPath();Pt.pts.forEach((p,k)=>{const q=P(p[0]+N/2,p[1]+N/2);k?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});
  if(h.road===2){x.setLineDash([]);x.strokeStyle='#d9c08a';x.lineWidth=Math.max(2,s*.9)}else{x.setLineDash([s*1.6,s*1.4]);x.strokeStyle=h.rb?'#e2c48c':'#cdbb94cc';x.lineWidth=Math.max(1.2,s*.55)}x.stroke()});x.setLineDash([]);
 const font=(sz,b)=>`${b?'600 ':''}${Math.round(sz)}px Georgia, serif`;const lab=(t,i,j,sz,col,b)=>{const q=P(i,j);x.font=font(sz,b);x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(12,16,15,.85)';x.strokeText(t,q[0],q[1]);x.fillStyle=col;x.fillText(t,q[0],q[1])};
 REGIONS.forEach(r=>{if(!r||r.id===0||!r.known)return;lab(r.name,r.i+.5,r.j+.5,W/52,'#e9e2cfdd')});
 (S.exps||[]).forEach(e=>{const r=REGIONS[e.r];if(r)lab('⚑',r.i+.5,r.j-2.5,W/40,'#e2c48c')});
 const mark=(i,j,rad,fill)=>{const q=P(i+.5,j+.5);x.beginPath();x.arc(q[0],q[1],rad,0,6.283);x.fillStyle=fill;x.fill();x.lineWidth=2;x.strokeStyle='#14100a';x.stroke()};
 mark(camp.i,camp.j,W/62,'#e2c48c');lab(`${S.vname||'Przystań'} · ${S.people.length}`,camp.i+.5,camp.j-3.4,W/40,'#f4ecd8',1);
 S.hamlets.forEach(h=>{if(!revAt(h.i,h.j))return;const a=.45+.55*h.wiez;mark(h.i,h.j,W/110+h.st*W/300,`rgba(214,186,128,${a})`);lab(`${h.name} · ${h.pop}`,h.i+.5,h.j-2.6,W/48,'#efe6cf',1);if(h.need)lab('!',h.i+3.2,h.j+1.2,W/34,'#e8915a',1)});
 const tot=S.hamlets.reduce((a,h)=>a+h.pop,0),roads=S.hamlets.filter(h=>h.road===2).length,unk=REGIONS.filter(r=>r&&!r.known).length;
 $('kleg').innerHTML=`<p><b>Zasiedlone krainy: ${settledCount()} z ${regionCount()}</b> · nieznanych: ${unk} · wspólnota: ${S.people.length+tot} ${osb(S.people.length+tot)} (osada ${S.people.length}, przysiółki ${tot}) · drogi: ${roads}</p>
 <p>Linia przerywana to ścieżka wydeptana, ciągła to droga. Znak „!” oznacza prośbę przysiółka. Dotknij osady albo przysiółka, żeby tam spojrzeć.</p>`+
 S.hamlets.map(h=>`<div class="kr"><span><b>${h.name}</b> · ${hamKind(h)}</span><span>${h.pop} ${osb(h.pop)} · więź ${wiezWord(h)} · zapasy ${zapWord(h.zap)}</span></div>`).join('')}
addEventListener('resize',()=>{if(!$('kmap').hidden)kmapDraw()});
{const _dm=drawMinimap;drawMinimap=function(){_dm();if(!S||!S.hamlets)return;mctx.fillStyle='#d9b878';S.hamlets.forEach(h=>{if(!revAt(h.i,h.j))return;const q=mProj(tcx(h.i),tcx(h.j));mctx.fillRect(q[0]-3,q[1]-3,6,6)})}}

/* ---- akty, epoka II, księga ---- */
ACTS[4].g.push(['Załóż pierwszy przysiółek',()=>(S.hamlets||[]).length>=1,'Ludzie → Wspólnota → Nowy przysiółek. Rodzina albo młoda para idzie w poznaną krainę.']);
{const _gi=goalInfo;goalInfo=function(){const g=_gi();if(S&&S.epoch===2&&g)return{ch:g.ch,t:`Zasiedl wyspę: ${settledCount()} z ${regionCount()} krain`,d:`${PATHS[S.path].goal}. Nowe przysiółki zakładasz w zakładce Ludzie → Wspólnota.`};return g}}
{const _kt=ksiegaText;ksiegaText=function(){let t=_kt();const hs=S.hamlets||[];if(!hs.length)return t;
 const sec='PRZYSIÓŁKI\n\n'+hs.map(h=>`${h.name} (${hamKind(h)}): ${h.pop} ${osb(h.pop)}, starszy ${h.head}, założony ${dayName(Math.floor(h.day)+1)}${h.road===2?', z drogą do osady':''}.`).join('\n')+`\n\nZasiedlone krainy: ${settledCount()} z ${regionCount()}.\n\n`;
 const k=t.indexOf('Pamięć osady:');return k>=0?t.slice(0,k)+sec+t.slice(k):t+'\n\n'+sec}}
