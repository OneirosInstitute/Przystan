
/* ================= 2.7: wozy na drogach między osadą a przysiółkami ================= */
const HAN_RES={coast:['ryby',6],forest:['drewno',6],high:['kamien',5],meadow:['ziarno',5]};
const carts=[];
function cartSpawn(h,dir){const P=hamPath[h.id];if(!P||carts.length>=8)return false;const g=wozMesh();g.visible=false;
 const fake={id:91000+((Math.random()*8000)|0),sex:Math.random()<.5?'k':'m',age:22+Math.random()*25,cloth:WCL[(Math.random()*WCL.length)|0]};const m=makePersonMesh(fake);m.scale.setScalar(personScale(fake));m.visible=false;
 if(m.userData.carry)m.userData.carry.visible=false;wGroup.add(m);carts.push({g,m,P,h:h.id,s:dir>0?0:P.len,dir,sp:.62+Math.random()*.08,ph:Math.random()*6});return true}
function cartFree(c){scene.remove(c.g);wGroup.remove(c.m);c.g.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
function cartArrive(c){const h=(S.hamlets||[]).find(x=>x.id===c.h);if(!h)return;
 if(c.dir<0){const[r,q]=HAN_RES[hType(h)]||['drewno',5];S.res[r]=(S.res[r]||0)+q;S.hanN=(S.hanN||0)+1;if(!S.seen.han1){S.seen.han1=1;log(`Pierwszy wóz z przysiółka ${h.name} wjeżdża do osady: ${RN[r].toLowerCase()} na wymianę.`)}}
 else{h.zap=Math.min(1,(h.zap||.5)+.03);h.wiez=Math.min(1,(h.wiez||.5)+.01)}}
function cartFrame(rdt){if(!S)return;const gdt=rdt*(S.speed||0);
 for(let k=carts.length-1;k>=0;k--){const C=carts[k];C.s+=C.dir*C.sp*gdt;if(C.s<0||C.s>C.P.len){cartArrive(C);cartFree(C);carts.splice(k,1);continue}
  const c=C.P.cum;let lo=0,hi=c.length-1;while(hi-lo>1){const md=(lo+hi)>>1;if(c[md]<=C.s)lo=md;else hi=md}
  const a=C.P.pts[lo],b=C.P.pts[hi],u=(C.s-c[lo])/Math.max(1e-4,c[hi]-c[lo]),x=a[0]+(b[0]-a[0])*u,z=a[1]+(b[1]-a[1])*u;
  const d=Math.atan2((b[0]-a[0])*C.dir,(b[1]-a[1])*C.dir),fx=Math.sin(d),fz=Math.cos(d);const t=tileOf(x,z),vis=revAt(t[0],t[1]);
  C.m.position.set(x,Hy(x,z),z);C.m.rotation.y=d;C.m.visible=vis;const U=C.m.userData;const sw=gdt>0?Math.sin(clock*9+C.ph)*.5:0;
  if(U.lL){U.lL.rotation.x=sw;U.lR.rotation.x=-sw;U.aL.rotation.x=U.aR.rotation.x=.38}
  const cx=x-fx*1.05,cz=z-fz*1.05;C.g.position.set(cx,Hy(cx,cz),cz);C.g.rotation.y=d;C.g.visible=vis;C.g.userData.load.visible=C.dir<0}}
// co jakiś czas wóz rusza do przysiółka z drogą albo wraca z niego z towarem
let hanT=0;
{const _mt=mapTick;mapTick=function(rdt){_mt(rdt);try{cartFrame(rdt)}catch(e){}if(!S)return;hanT+=rdt*(S.speed||0);if(hanT<40)return;hanT=0;
  if(!(S.wozy>0)&&S.epoch!==2)return;const L=(S.hamlets||[]).filter(h=>h.road===2&&hamPath[h.id]&&!(h.arr&&S.day<h.arr)&&!carts.some(c=>c.h===h.id));if(!L.length||!isWork())return;
  const h=L[(Math.random()*L.length)|0];cartSpawn(h,Math.random()<.5?1:-1)}}
window.__han={carts,cartSpawn,cartFrame};
