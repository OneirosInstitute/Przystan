/* Stanowiska są geometrią i aktywnymi celami osób, bez drugiej tabeli rezerwacji. */
function workSiteManaged(building,action){return !!building&&((building.kind==='pole'&&action==='field')||(BD[building.kind]?.prod&&action==='prod'))}
function workSiteContains(building,tile){
 if(!Array.isArray(tile)||tile.length!==2||!tile.every(Number.isInteger))return false;
 const [x,z]=tile,definition=BD[building.kind],column=x-building.i,row=z-building.j;
 return x>=0&&z>=0&&x<N&&z<N&&walk[z*N+x]&&column>=-1&&column<=definition.w&&row>=-1&&row<=definition.h&&!(column>=0&&column<definition.w&&row>=0&&row<definition.h);
}
function workSiteTiles(building){
 const definition=BD[building.kind],positions=[];
 for(let column=-1;column<=definition.w;column++)for(let row=-1;row<=definition.h;row++){
  if(column>=0&&column<definition.w&&row>=0&&row<definition.h)continue;
  const x=building.i+column,z=building.j+row;
  if(workSiteContains(building,[x,z]))positions.push([x,z]);
 }
 return positions;
}
function deliverySpotFree(person,tile){return !!tile&&!!walk[tile[1]*N+tile[0]]&&!S.people.some(peer=>peer!==person&&!['away','sleep'].includes(peer.state)&&Math.hypot(peer.x-tcx(tile[0]),peer.z-tcx(tile[1]))<.6);}
function buildingEntryFor(person,building){
 const start=tileOf(person.x,person.z),preferred=entryOf(building.kind,building.i,building.j),positions=workSiteTiles(building);
 positions.sort((a,b)=>(preferred&&a[0]===preferred[0]&&a[1]===preferred[1]?-1:preferred&&b[0]===preferred[0]&&b[1]===preferred[1]?1:Math.hypot(a[0]-start[0],a[1]-start[1])-Math.hypot(b[0]-start[0],b[1]-start[1])));
 return positions.find(tile=>deliverySpotFree(person,tile)&&astar(start[0],start[1],tile[0],tile[1]))||null;
}
function workSiteActive(person){return !!person.tgt?.kind&&((person.state==='move'&&['prod','field','build','care'].includes(person.after))||(person.state==='work'&&['prod','field','build','care'].includes(person.workKind)))}
function workSiteRoute(person,building,preferred){
 const occupied=new Set(S.people.filter(peer=>peer!==person&&workSiteActive(peer)).map(peer=>(peer.routeGoal||tileOf(peer.x,peer.z)).join(':')));
 const positions=workSiteTiles(building);
 if(!positions.length)return {ok:false,code:'station_closed',reason:'Brak dojścia do stanowisk — odblokuj teren przy budynku.'};
 const available=positions.filter(tile=>!occupied.has(tile.join(':')));
 if(!available.length)return {ok:false,code:'station_busy',reason:'Brak wolnego stanowiska przy budynku — czeka na miejsce.'};
 const start=tileOf(person.x,person.z),entrance=preferred||available[0];
 available.sort((first,second)=>Math.hypot(first[0]-entrance[0],first[1]-entrance[1])-Math.hypot(second[0]-entrance[0],second[1]-entrance[1])||Math.hypot(first[0]-start[0],first[1]-start[1])-Math.hypot(second[0]-start[0],second[1]-start[1]));
 for(const tile of available){const path=astar(start[0],start[1],tile[0],tile[1]);if(path)return {ok:true,tile,path};}
 return {ok:false,code:'route',reason:'Brak drogi do stanowiska — odblokuj dojście do budynku.'};
}
function workSiteAuthorized(person,building,action){
 return (person.job==='wb'&&person.wb===building.id)||(action==='field'&&['rob','bud'].includes(person.job)&&S.rush?.until>S.day&&building.field?.st==='dojrzale');
}
function workSiteCheck(person){
 const building=person.tgt,action=person.state==='move'?person.after:person.workKind;
 if(!workSiteManaged(building,action)||!['move','work'].includes(person.state))return null;
 if(bById(building.id)!==building||!bDone(building))return 'Miejsce pracy jest już niedostępne.';
 if(!workSiteAuthorized(person,building,action))return 'Przydział pracy zmienił się — wybiera nowe zajęcie.';
 if(restNow(person)&&!person.fireB)return 'Odpoczynek chorego — stanowisko zwolnione.';
 if(person.fireB)return 'Przerywa pracę, aby gasić pożar.';
 const goal=person.routeGoal;
 if(!workSiteContains(building,goal))return 'Stanowisko zamknięte — potrzebne nowe dojście.';
 if(person.state==='work'&&Math.hypot(person.x-tcx(goal[0]),person.z-tcx(goal[1]))>.6)return 'Najpierw musi dojść do stanowiska.';
 return null;
}
/* Odbiór przy obozie ma kilka fizycznych miejsc, a nie jeden kafel zajęty paleniskiem. */
function campDeliveryEntry(person){
 const start=tileOf(person.x,person.z),positions=[];
 for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){const i=camp.i+dx,j=camp.j+dz;if(i<0||j<0||i>=N||j>=N||!walk[j*N+i])continue;if(!deliverySpotFree(person,[i,j]))continue;positions.push([i,j]);}
 positions.sort((a,b)=>Math.hypot(a[0]-start[0],a[1]-start[1])-Math.hypot(b[0]-start[0],b[1]-start[1]));return positions.find(tile=>deliverySpotFree(person,tile)&&astar(start[0],start[1],tile[0],tile[1]))||null;
}
