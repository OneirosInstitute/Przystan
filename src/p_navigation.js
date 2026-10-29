/* Nawigacja: jedna siatka świata, lokalny ruch osób i kontrola nowych odcięć. */
function navComponents(mask){const labels=new Int32Array(N*N),queue=new Int32Array(N*N);let component=0;for(let start=0;start<mask.length;start++){if(!mask[start]||labels[start])continue;let head=0,tail=1;queue[0]=start;labels[start]=++component;while(head<tail){const cell=queue[head++],x=cell%N,z=(cell/N)|0;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const nx=x+dx,nz=z+dz,next=nz*N+nx;if(nx<0||nz<0||nx>=N||nz>=N||!mask[next]||labels[next]||(dx&&dz&&(!mask[z*N+nx]||!mask[nz*N+x])))continue;labels[next]=component;queue[tail++]=next;}}}return labels;}
function navCampTiles(){return [[camp.i,camp.j+1],[camp.i+1,camp.j],[camp.i-1,camp.j],[camp.i,camp.j-1]].filter(([x,z])=>x>=0&&z>=0&&x<N&&z<N&&walk[z*N+x]);}
function placementIsolation(kind,i,j){
 const definition=BD[kind],inside=tile=>tile[0]>=i&&tile[0]<i+definition.w&&tile[1]>=j&&tile[1]<j+definition.h;
 for(const building of S.bld){const entries=workSiteTiles(building);if(entries.length&&entries.every(inside))return 'Budowa zamknęłaby wszystkie wejścia: '+BD[building.kind].n+'.';}
 if((S.exps||[]).some(expedition=>!expedition.started&&S.people.some(person=>person.exp===expedition.id&&person.state!=='away')&&inside(expedition.exit)))return 'Tu jest wyjście przygotowywanej wyprawy.';
 // Połączony obwód gwarantuje obejście prostokąta bez pełnego przeglądu wyspy.
 const perimeter=workSiteTiles({kind,i,j}),keys=new Set(perimeter.map(([x,z])=>z*N+x));let connected=0;
 if(perimeter.length){const queue=[perimeter[0]],seen=new Set([perimeter[0][1]*N+perimeter[0][0]]);for(let head=0;head<queue.length;head++){const [x,z]=queue[head];connected++;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,nz=z+dz,key=nz*N+nx;if((!dx&&!dz)||!keys.has(key)||seen.has(key)||(dx&&dz&&(!keys.has(z*N+nx)||!keys.has(nz*N+x))))continue;seen.add(key);queue.push([nx,nz]);}}}
 if(perimeter.length&&connected===perimeter.length)return '';
 const before=navComponents(walk),mask=walk.slice();for(let x=i;x<i+definition.w;x++)for(let z=j;z<j+definition.h;z++)mask[z*N+x]=0;const after=navComponents(mask),anchors=new Map();
 for(const tile of navCampTiles()){const key=tile[1]*N+tile[0];if(mask[key]){anchors.set(before[key],after[key]);break;}}
 for(const person of S.people){if(person.state==='away')continue;const tile=tileOf(person.x,person.z),key=tile[1]*N+tile[0],old=before[key];if(!old||!mask[key])continue;if(!anchors.has(old))anchors.set(old,after[key]);else if(anchors.get(old)!==after[key])return 'Budowa odcięłaby mieszkańca od osady — zostaw przejście.';}
 for(const building of S.bld){const entries=workSiteTiles(building),previous=entries.find(([x,z])=>anchors.has(before[z*N+x]));if(previous&&!entries.some(([x,z])=>mask[z*N+x]&&after[z*N+x]===anchors.get(before[previous[1]*N+previous[0]])))return 'Budowa odcięłaby dojście: '+BD[building.kind].n+'.';}
 return '';
}
const navCrowd={active:false,state:null,cells:new Map()};
function navRebuildCrowd(){navCrowd.state=S;navCrowd.cells.clear();for(const person of S.people){if(['away','sleep'].includes(person.state))continue;const key=Math.floor(person.x)+':'+Math.floor(person.z);if(!navCrowd.cells.has(key))navCrowd.cells.set(key,new Set());navCrowd.cells.get(key).add(person);}}
function navBeginStep(){navCrowd.active=true;navRebuildCrowd();}
function navEndStep(){navCrowd.active=false;}
function navPeers(person,x,z){if(!navCrowd.active||navCrowd.state!==S)navRebuildCrowd();const peers=new Set();for(let column=Math.floor(Math.min(person.x,x)-.6);column<=Math.floor(Math.max(person.x,x)+.6);column++)for(let row=Math.floor(Math.min(person.z,z)-.6);row<=Math.floor(Math.max(person.z,z)+.6);row++)for(const peer of navCrowd.cells.get(column+':'+row)||[])if(peer!==person)peers.add(peer);return peers;}
function navMoved(person,oldX,oldZ){if(!navCrowd.active)return;const previous=Math.floor(oldX)+':'+Math.floor(oldZ),current=Math.floor(person.x)+':'+Math.floor(person.z);if(previous===current)return;navCrowd.cells.get(previous)?.delete(person);if(!navCrowd.cells.has(current))navCrowd.cells.set(current,new Set());navCrowd.cells.get(current).add(person);}
function navCrowdRoute(person){
 const start=tileOf(person.x,person.z),goal=person.routeGoal;if(!goal||!walk[goal[1]*N+goal[0]])return null;
 const direction={x:tcx(goal[0])-person.x,z:tcx(goal[1])-person.z},length=Math.hypot(direction.x,direction.z)||1,right={x:-direction.z/length,z:direction.x/length};
 const candidates=[];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const x=start[0]+dx,z=start[1]+dz;if(x<0||z<0||x>=N||z>=N||!walk[z*N+x]||(dx&&dz&&(!walk[start[1]*N+x]||!walk[z*N+start[0]])))continue;const projection=dx*right.x+dz*right.z;if(projection>.25)candidates.push({tile:[x,z],projection});}
 candidates.sort((a,b)=>b.projection-a.projection);const changed=[];
 try{
  for(const peer of S.people){if(peer===person||['away','sleep'].includes(peer.state)||Math.hypot(peer.x-person.x,peer.z-person.z)>8)continue;const tile=tileOf(peer.x,peer.z),key=tile[1]*N+tile[0];if((tile[0]!==start[0]||tile[1]!==start[1])&&walk[key]){changed.push(key);walk[key]=0;}}
  // 4.9.0-rc.27: każdy wariant obejścia szuka krótko (do 4000 pól zamiast 40 000); wcześniej przy zastawionym celu każdy przeszukiwał pół wyspy
  for(const candidate of candidates){const [x,z]=candidate.tile;if(!walk[z*N+x])continue;const route=astar(x,z,goal[0],goal[1],4000);if(route)return [candidate.tile,...route];}
  return astar(start[0],start[1],goal[0],goal[1],4000);
 }finally{for(const key of changed)walk[key]=1;}
}
// RC11: ustępowanie bez zakleszczeń. Trzy zasady: ostatnie kroki do celu (bez ładunku) nie czekają na tłum przy celu;
// z dwóch czekających ustępuje ten z wyższym numerem; kto czeka dłużej niż NAV_GHOST, przeciska się przez tłum.
const NAV_GHOST=2.2,NAV_SQUEEZE=1.6;
function navBlocks(person,peer){if(peer.navWait>1.1&&person.navWait>1.1&&peer.id>person.id)return false;return true;}
function navPauseForCrowd(person,point,distance,delta){const dx=point.x-person.x,dz=point.z-person.z,length=Math.hypot(dx,dz);if(length<1e-8)return false;const travel=Math.min(distance,length),x=person.x+dx/length*travel,z=person.z+dz/length*travel,vx=x-person.x,vz=z-person.z;
 if(person.navGhost>S.t)return false;
 const goal=person.routeGoal;if(goal&&!pendingDelivery(person)&&Math.hypot(person.x-tcx(goal[0]),person.z-tcx(goal[1]))<1.3){if(person.navResumeAct){person.act=person.navResumeAct;delete person.navResumeAct}delete person.navWait;return false;}
 let occupied=false;for(const peer of navPeers(person,x,z)){if(!navBlocks(person,peer))continue;const start=Math.hypot(peer.x-person.x,peer.z-person.z),end=Math.hypot(peer.x-x,peer.z-z),radius=(person.age<12?.16:.22)+(peer.age<12?.16:.22),fraction=clamp(((peer.x-person.x)*vx+(peer.z-person.z)*vz)/(vx*vx+vz*vz||1),0,1),closest=Math.hypot(peer.x-person.x-vx*fraction,peer.z-person.z-vz*fraction);if(closest<radius&&!(start<radius&&end>start+1e-6)){occupied=true;break;}}
 if(!occupied){if(person.navResumeAct)person.act=person.navResumeAct;delete person.navResumeAct;delete person.navWait;delete person.navRetry;return false;}
 person.navResumeAct??=person.act;person.navWait=(person.navWait||0)+delta;
 if(person.navWait>=NAV_GHOST){person.navGhost=S.t+NAV_SQUEEZE;if(person.navResumeAct)person.act=person.navResumeAct;delete person.navResumeAct;delete person.navWait;delete person.navRetry;return false;}
 person.act='Ustępuje przejścia';
 if(person.navWait>=.6&&(!(person.navRetry>S.t))){person.navRetry=S.t+1.5;
  // Punkt odbioru może zająć ktoś już po wyznaczeniu drogi. Wybierz wolne wejście tą samą bramką co po restarcie.
  if(pendingDelivery(person)&&person.routeGoal&&Math.hypot(person.x-tcx(person.routeGoal[0]),person.z-tcx(person.routeGoal[1]))<2){release(person);resumeDelivery(person);return true;}
  const route=navCrowdRoute(person);if(route?.length)person.path=route.map(([i,j])=>({x:tcx(i),z:tcx(j)}));
 }
 return true;
}
