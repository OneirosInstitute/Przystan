/* Epoka IV: deterministyczny świat, bez zależności DOM i renderera. */
const E4World=(()=>{
 const limit=(value,minimum,maximum)=>Math.max(minimum,Math.min(maximum,value));
 const routeCache=new WeakMap();
 function noise(seed,column,row){let hash=Math.imul(column,374761393)^Math.imul(row,668265263)^seed;hash=Math.imul(hash^(hash>>>13),1274126177);return((hash^(hash>>>16))>>>0)/4294967296}
 function smooth(seed,x,z,scale){const column=Math.floor(x/scale),row=Math.floor(z/scale);let horizontal=x/scale-column,vertical=z/scale-row;horizontal=horizontal*horizontal*(3-2*horizontal);vertical=vertical*vertical*(3-2*vertical);
  const first=noise(seed,column,row),second=noise(seed,column+1,row),third=noise(seed,column,row+1),fourth=noise(seed,column+1,row+1);
  return first+(second-first)*horizontal+(third-first)*vertical+(first-second-third+fourth)*horizontal*vertical;
 }
 function legacyHeight(core,x,z){const count=core.size/core.step+1,horizontal=limit((x+core.size/2)/core.step,0,count-1.000001),vertical=limit((z+core.size/2)/core.step,0,count-1.000001),column=Math.floor(horizontal),row=Math.floor(vertical),offset=row*count+column,fractionX=horizontal-column,fractionZ=vertical-row;
  const first=core.heights[offset],second=core.heights[offset+1],third=core.heights[offset+count],fourth=core.heights[offset+count+1];
  return first+(second-first)*fractionX+(third-first)*fractionZ+(first-second-third+fourth)*fractionX*fractionZ;
 }
 function height(world,x,z){
  if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>world.size/2||Math.abs(z)>world.size/2)return -4;
  const radial=Math.hypot(x/(world.size*.49),z/(world.size*.49));
  const outer=(1-radial*radial)*5+(smooth(world.seed+70,x,z,43)-.5)*3+(smooth(world.seed+103,x,z,15)-.5)*.7;
  if(Math.abs(x)<=96&&Math.abs(z)<=96){
   const original=world.core?legacyHeight(world.core,x,z):(1-Math.pow(Math.hypot(x,z)/80,2))*5;
   if(original>.05)return original;
   const edge=limit((Math.max(Math.abs(x),Math.abs(z))-86)/10,0,1);
   const neck=Math.abs(z)<7&&Math.abs(x)>35?Math.min(1,(7-Math.abs(z))/2):0;
   if(z>world.town.z+5&&Math.abs(x-world.town.x)<14)return Math.min(-.4,original);
   return Math.max(original,original+(Math.max(original,outer)-original)*edge,neck>0?1.1*neck-.1:-4);
  }
  if(z>world.town.z+5&&Math.abs(x-world.town.x)<14)return -1.2;
  return outer;
 }
 const biomeNames={valley:'Żyzna Dolina',slope:'Słoneczny Stok',forest:'Stary Bór',meadow:'Miodowa Łąka',high:'Kamienna Grań',wet:'Źródliska',coast:'Zatoka'};
 function describe(world,x,z,id){const altitude=height(world,x,z),moisture=smooth(world.seed+901,x,z,38),forest=smooth(world.seed+151,x,z,27),sun=limit(.8-.04*altitude+smooth(world.seed+182,x,z,40)*.2-moisture*.2,0,1),fertility=limit(.45+moisture*.45-altitude*.025,0,1);
  let biome=altitude>5.4?'high':altitude<1?'coast':moisture>.69?'wet':forest>.61?'forest':sun>.71&&altitude>2.8?'slope':fertility>.7?'valley':'meadow';
  // 4.4: poza graniami też bywa złoże rudy (Zagłębie): tam może stanąć folwark hutników z szybem
  const oreNoise=smooth(world.seed+650,x,z,31),ore=biome==='high'?.85:oreNoise>.74&&biome!=='coast'?.7:oreNoise*.35;
  return{id,x,z,name:(ore>=.6&&biome!=='high'?'Zagłębie':biomeNames[biome])+' '+id.split(':').slice(1).join('·'),biome,fertility,moisture,sun,forest,ore,clay:moisture*.8,water:biome==='wet'||biome==='coast'||moisture>.48,fish:biome==='coast'?1:biome==='wet'?.6:.1,nectar:limit(fertility*.7+forest*.3,0,1)};
 }
 function create({seed,core=null,town={x:0,z:65}}={}){
  if(!Number.isSafeInteger(seed)||seed<=0||!Number.isFinite(town.x)||!Number.isFinite(town.z)||Math.abs(town.x)>96||Math.abs(town.z)>96)throw new Error('Nieprawidłowy opis wyspy');
  if(core&&(core.size!==192||core.step!==2||!Array.isArray(core.heights)||core.heights.length!==97*97||!core.heights.every(Number.isFinite)))throw new Error('Nieprawidłowy rdzeń starej mapy');
  const world={version:1,seed,size:384,sectorSize:32,town:{...town},core:core?{...core,heights:core.heights.slice()}:null,regions:[]};
  for(let row=0;row<12;row++)for(let column=0;column<12;column++){
   const centerX=-176+column*32,centerZ=-176+row*32;let position=null;
   for(const offset of [[0,0],[-8,0],[8,0],[0,-8],[0,8]])if(height(world,centerX+offset[0],centerZ+offset[1])>.3){position={x:centerX+offset[0],z:centerZ+offset[1]};break}
   if(position)world.regions.push(describe(world,position.x,position.z,'kraina:'+column+':'+row));
  }
  return world;
 }
 function regionAt(world,x,z){return world.regions.reduce((nearest,region)=>!nearest||Math.hypot(region.x-x,region.z-z)<Math.hypot(nearest.x-x,nearest.z-z)?region:nearest,null)}
 function sectors(world){const items=[];for(let row=0;row<world.size/world.sectorSize;row++)for(let column=0;column<world.size/world.sectorSize;column++)items.push({id:column+':'+row,x:-world.size/2+column*world.sectorSize,z:-world.size/2+row*world.sectorSize,size:world.sectorSize});return items}
 function route(world,from,to){
  const spacing=4,count=world.size/spacing,half=world.size/2;
  const coordinate=index=>({x:(index%count)*spacing-half+spacing/2,z:Math.floor(index/count)*spacing-half+spacing/2});
  const ground=index=>{const position=coordinate(index);return height(world,position.x,position.z)};
  const nearest=position=>{let best=-1,bestDistance=Infinity;const centerColumn=Math.floor((position.x+half)/spacing),centerRow=Math.floor((position.z+half)/spacing);
   for(let row=centerRow-2;row<=centerRow+2;row++)for(let column=centerColumn-2;column<=centerColumn+2;column++)if(row>=0&&column>=0&&row<count&&column<count){const index=row*count+column,point=coordinate(index),distance=Math.hypot(point.x-position.x,point.z-position.z);if(distance<bestDistance&&ground(index)>.1){best=index;bestDistance=distance}}
   return bestDistance<=10?best:-1;
  };
  const start=nearest(from),destination=nearest(to);if(start<0||destination<0)return null;
  let cache=routeCache.get(world);if(!cache){cache=new Map();routeCache.set(world,cache)}
  const key=start+':'+destination;
  const copy=result=>result?{length:result.length,points:result.points.map(point=>({...point}))}:null;
  if(cache.has(key))return copy(cache.get(key));
  const costs=new Float64Array(count*count).fill(Infinity),parents=new Int32Array(count*count).fill(-1),closed=new Uint8Array(count*count),heap=[];
  const push=item=>{heap.push(item);let index=heap.length-1;while(index){const parent=(index-1)>>1;if(heap[parent].priority<=item.priority)break;heap[index]=heap[parent];index=parent}heap[index]=item};
  const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let index=0;while(index*2+1<heap.length){let child=index*2+1;if(child+1<heap.length&&heap[child+1].priority<heap[child].priority)child++;if(heap[child].priority>=last.priority)break;heap[index]=heap[child];index=child}heap[index]=last}return first};
  const target=coordinate(destination);costs[start]=0;push({index:start,priority:0});
  while(heap.length){const current=pop().index;if(closed[current])continue;closed[current]=1;if(current===destination)break;
   const column=current%count,row=Math.floor(current/count),elevation=ground(current);
   for(let deltaRow=-1;deltaRow<=1;deltaRow++)for(let deltaColumn=-1;deltaColumn<=1;deltaColumn++){
    if(!deltaColumn&&!deltaRow)continue;const nextColumn=column+deltaColumn,nextRow=row+deltaRow;if(nextColumn<0||nextRow<0||nextColumn>=count||nextRow>=count)continue;
    const next=nextRow*count+nextColumn,nextHeight=ground(next);if(closed[next]||nextHeight<=.1)continue;
    if(deltaColumn&&deltaRow&&(ground(row*count+nextColumn)<=.1||ground(nextRow*count+column)<=.1))continue;
    const distance=Math.hypot(deltaColumn,deltaRow)*spacing,candidate=costs[current]+distance+Math.abs(nextHeight-elevation)*2;
    if(candidate>=costs[next])continue;costs[next]=candidate;parents[next]=current;const point=coordinate(next);push({index:next,priority:candidate+Math.hypot(point.x-target.x,point.z-target.z)});
   }
  }
  if(!closed[destination]){cache.set(key,null);return null}
  const points=[];for(let index=destination;index>=0;index=parents[index]){points.push(coordinate(index));if(index===start)break}points.reverse();
  let length=0;for(let index=1;index<points.length;index++)length+=Math.hypot(points[index].x-points[index-1].x,points[index].z-points[index-1].z);
  const result={points,length};if(cache.size>256)cache.clear();cache.set(key,result);return copy(result);
 }
 return{create,height,regionAt,sectors,route,noise};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4World;
