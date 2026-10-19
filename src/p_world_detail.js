/* Detal ma jeden cykl w istniejącej klatce; nie jest źródłem zasobów ani przeszkodą SI. */
const worldDetails=new THREE.Group();scene.add(worldDetails);
const worldDetailModels=new Map();let worldDetailState=null,worldDetailClock=1,worldDetailTerrain=null,worldDetailTerrainKey='';
function worldDetailPlan(building){
 const definition=BD[building.kind];if(!definition||!bDone(building))return null;
 const entries=workSiteTiles(building).slice(0,12),center=bCenter(building),ext=building.ext||[];
 return {id:building.id,kind:building.kind,center,entries,house:!!definition.house,production:!!definition.prod,wood:['drwal','drewutnia','pracownia','warsztat','szkutnia'].includes(building.kind),stone:['ruda','kamien','kuznia','dymarka','garncarnia'].includes(building.kind),ext:ext.slice()};
}
function worldDetailModel(plan){
 const parts=[],add=(geometry,color,x,y,z,rx=0)=>parts.push([geometry,color,mdM(x,y,z,rx)]),winter=seasonIdx()===2;
 // Każde oznaczenie stanowiska pochodzi z tych samych pól co cele SI.
 for(const tile of plan.entries){const x=tcx(tile[0]),z=tcx(tile[1]);add(new THREE.BoxGeometry(.24,.025,.32),winter?0xb0aba0:0x8a7656,x,Hy(x,z)+.025,z);}
 const building=bById(plan.id),definition=BD[plan.kind],x=tcx(building.i)+.25,z=tcx(building.j)+.25,y=Hy(x,z);
 if(plan.production){add(new THREE.BoxGeometry(.48,.06,.3),0x8c6c46,x,y+.45,z);for(const side of [-1,1])add(new THREE.BoxGeometry(.045,.42,.22),0x4d3828,x+side*.18,y+.22,z);}
 if(plan.wood)for(let index=0;index<4;index++)add(new THREE.CylinderGeometry(.055,.06,.48,6),0x7c5837,x+.18*(index%2),y+.07+.12*Math.floor(index/2),z+.4,Math.PI/2);
 else if(plan.stone)for(let index=0;index<3;index++)add(new THREE.DodecahedronGeometry(.11,0),plan.kind==='ruda'?0x675b53:0x77786f,x+index*.12,y+.1,z+.4);
 else if(plan.production||plan.house){add(new THREE.CylinderGeometry(.12,.1,.3,8),0x8b6640,x,y+.15,z+.4);for(const height of [.08,.24])add(new THREE.CylinderGeometry(.123,.123,.018,8),0x4a4035,x,y+height,z+.4);}
 if(plan.ext.includes('wyroby'))add(new THREE.CylinderGeometry(.075,.07,.16,8),0xa6784a,x+.3,y+.08,z+.45);
 if(!parts.length)return null;const model=new THREE.Mesh(mdMerge(parts),MD.mat);model.receiveShadow=true;model.userData.detail=true;model.userData.stations=plan.entries;return model;
}
function worldDetailTerrainPlan(){
 const tiles=[],ci=Math.round(camT.x+N/2-.5),cj=Math.round(camT.z+N/2-.5);
 for(let dj=-20;dj<=20;dj+=4)for(let di=-20;di<=20;di+=4){const i=ci+di,j=cj+dj,index=j*N+i;if(i<1||j<1||i>=N-1||j>=N-1||!land[index]||!rev[index]||occ[index]>=0)continue;const x=tcx(i),z=tcx(j),y=Hy(x,z);if(y<.1)continue;tiles.push({i,j,x,y,z,biome:biomeOf(i,j),path:tread[index]>.35});}
 return tiles.slice(0,121);
}
function worldDetailTerrainModel(){
 const parts=[],winter=seasonIdx()===2;for(const tile of worldDetailTerrainPlan()){
  if(tile.path){for(const side of [-1,1])parts.push([new THREE.DodecahedronGeometry(.065,0),0x7d7b6e,mdM(tile.x+side*.32,tile.y+.04,tile.z+.1)]);}
  else if(tile.biome==='wet'||tile.biome==='coast'){for(let stem=0;stem<3;stem++)parts.push([new THREE.CylinderGeometry(.009,.014,.28+stem*.05,3),winter?0xaaa48b:0x747750,mdM(tile.x+stem*.055,tile.y+.14,tile.z)]);}
  else if(tile.biome==='high'){parts.push([new THREE.DodecahedronGeometry(.16,0),winter?0xadafa8:0x7c8076,mdM(tile.x,tile.y+.06,tile.z,0,0,0,1,.5,1.3)]);}
  else{const color=winter?0x9c9b86:seasonIdx()===1?0x827246:0x6c7951;for(let blade=0;blade<3;blade++)parts.push([new THREE.ConeGeometry(.04,.13,3),color,mdM(tile.x+blade*.05,tile.y+.065,tile.z+blade*.03)]);}
 }
 if(!parts.length)return null;const model=new THREE.Mesh(mdMerge(parts),MD.mat);model.receiveShadow=true;model.userData.detail=true;return model;
}
function worldDetailClear(){for(const model of worldDetailModels.values())retireObjects(model);worldDetailModels.clear();if(worldDetailTerrain)retireObjects(worldDetailTerrain);worldDetailTerrain=null;worldDetailTerrainKey='';}
function worldDetailTick(delta){
 if(!S)return;if(worldDetailState!==S){worldDetailClear();worldDetailState=S;worldDetailClock=1;}
 worldDetailClock+=delta;if(worldDetailClock<.5)return;worldDetailClock=0;
 if(GFX.level===0){if(worldDetailModels.size||worldDetailTerrain)worldDetailClear();return;}
 const limit=GFX.level===2?48:32,visible=S.bld.filter(building=>bDone(building)&&revAt(building.i,building.j)&&Math.hypot(bCenter(building).x-camT.x,bCenter(building).z-camT.z)<40).sort((a,b)=>Math.hypot(bCenter(a).x-camT.x,bCenter(a).z-camT.z)-Math.hypot(bCenter(b).x-camT.x,bCenter(b).z-camT.z)).slice(0,limit),ids=new Set(visible.map(building=>building.id));
 for(const [id,model] of worldDetailModels)if(!ids.has(id)){retireObjects(model);worldDetailModels.delete(id);}
 for(const building of visible){const plan=worldDetailPlan(building);if(!plan)continue;const key=JSON.stringify([plan.kind,plan.entries,plan.ext,seasonIdx()]),previous=worldDetailModels.get(building.id);if(previous?.userData.key===key)continue;if(previous)retireObjects(previous);const model=worldDetailModel(plan);if(model){model.userData.key=key;worldDetails.add(model);worldDetailModels.set(building.id,model);}}
 const terrainKey=[Math.floor(camT.x/8),Math.floor(camT.z/8),seasonIdx(),walkRevision,Math.floor(S.day)].join(':');if(terrainKey!==worldDetailTerrainKey){if(worldDetailTerrain)retireObjects(worldDetailTerrain);worldDetailTerrain=worldDetailTerrainModel();if(worldDetailTerrain)worldDetails.add(worldDetailTerrain);worldDetailTerrainKey=terrainKey;}
}
