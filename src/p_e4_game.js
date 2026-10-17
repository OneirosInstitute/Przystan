/* Granica wcześniejszych epok: jeden zegar i jedna gospodarka po Wiecu Rodów. */
Object.assign(RN,E4Catalog.resources);
let e4Selected='przystan';
function e4Ready(){return !!S?.e3?.done&&!evOpen&&!S.pendingDecision&&!(S.exps||[]).some(expedition=>!expedition.done)&&!S.people.some(pendingDelivery)&&!walkers.length;}
function e4Prepare(){if(!S?.e3?.done)return{ok:false,reason:'Najpierw ukończ epokę III.'};if(S.e4Preparing){delete S.e4Preparing;toast('Przygotowania do Wiecu odwołane.');return{ok:true};}S.e4Preparing=true;setSpeed(1);closeSheet();toast('Wiec Rodów: mieszkańcy kończą rozpoczęte dostawy i wyprawy.');return{ok:true};}
function e4Start(){
 if(S?.epoch===4)return{ok:true};if(!e4Ready())return{ok:false,reason:'Ukończ epokę III oraz powroty wypraw i dostawy.'};
 const previousState=S;
 try{
  const snapshot=JSON.parse(serializeSave()),heights=[];for(let row=0;row<=N;row+=2)for(let column=0;column<=N;column+=2)heights.push(Math.round(H[row*VW+column]*10000)/10000);
  const world=E4World.create({seed:SEED,town:{x:tcx(camp.i),z:tcx(camp.j)},core:{size:N,step:2,heights}}),next=E4Domain.migrate(snapshot,{world,dailyFactor:K});E4Economy.ensure(next);
  const town=next.e4.settlements.przystan,mapping={zarna:'mlyn',wiatrak:'mlyn',piekarnia:'piekarnia',piekarz:'piekarnia',piec:'piekarnia',drwal:'tartak',warsztat:'stolarnia',bednarnia:'stolarnia',slodownia:'browar',browar:'browar',winiarnia:'winiarnia',miodosytnia:'winiarnia',pracownia:'wyroby',szwalnia:'szwalnia',garncarnia:'garncarnia',cegielnia:'cegielnia',mielerz:'mielerz',kuznia:'kuznia',dymarka:'huta',serownia:'serownia',zagroda:'zagroda',kurnik:'kurnik',pasieka:'pasieka',ogrodziol:'zielnik',kiszarnia:'wyroby',sklad:'magazyn',spichlerz:'magazyn',spizarnia:'magazyn'};next.e4.legacyMapping=mapping;
  town.homeCapacity=next.bld.filter(building=>building.prog>=building.work).reduce((capacity,building)=>capacity+(BD[building.kind].house||0),0)||next.people.length+4;town.capacity=foodCap()+600;
  for(const building of next.bld){if(building.prog<building.work)continue;const kind=mapping[building.kind];if(kind)town.buildings[kind]=(town.buildings[kind]||0)+1;
   if(building.kind==='szwalnia')town.buildings.przasnia=1;
   const center=bCenter(building);if(building.field){const field=building.field;town.fields.push({id:next.e4.nextBatch++,crop:'zboze',planted:next.day,age:10,progress:field.st==='dojrzale'?6:Math.max(0,(field.g||0)*6),soil:Math.min(1,field.fert||1),sown:field.st!=='puste',harvests:0,legacyId:building.id,legacyYield:field.st==='dojrzale'?Math.max(0,field.left||0):null,x:center.x,z:center.z});}
   const crop=building.kind==='winnica'?'winogrona':building.kind==='chmielnik'?'chmiel':null;if(crop)town.fields.push({id:next.e4.nextBatch++,crop,planted:next.day,age:40,progress:0,soil:1,sown:true,harvests:0,legacyId:building.id,x:center.x,z:center.z});
   for(let queue=0;queue<(building.wozQ||0);queue++)town.batches.push({id:next.e4.nextBatch++,recipe:'woz',materials:{...WOZ_COST},progress:queue===0?Math.min(15.99,(building.wozP||0)/WOZ_T*16):0,work:16,readyAt:null,started:next.day});if(building.wozQ){building.wozQ=0;building.wozP=0;}
   for(const extension of building.ext||[]){const crop=extension==='ogrod'?'warzywa':extension==='zielnik'?'ziola':null;if(crop)town.fields.push({id:next.e4.nextBatch++,crop,planted:next.day,age:10,progress:0,soil:1,sown:true,harvests:0,houseId:building.id});if(extension==='wyroby')town.buildings.wyroby=1;if(extension==='piwnica')town.buildings.piwnica=1;}
   for(let index=0;index<(building.animals||0);index++)town.herd.push({id:next.e4.nextAnimal++,species:'koza',sex:index%2?'m':'k',age:40,hp:1,par:[],pregnant:null,legacyPen:building.id});if(building.animals!==undefined)building.animals=0;
  }
  for(const settlement of Object.values(next.e4.settlements)){if(settlement.legacyHamletId){settlement.homeCapacity=Math.max(8,E4Domain.residents(next,settlement.id).length+4);settlement.specialization=Object.keys(E4Catalog.specialties)[settlement.legacyHamletId%11];}
  }
  for(const region of world.regions)if(Math.abs(region.x)<96&&Math.abs(region.z)<96){const pool=E4Economy.nature(next,region);for(const key of ['timber','ore','clay','stone','forage','fish','wildGrain'])pool[key]=0;pool.wild={koza:0,kura:0,swinia:0};}
  // Każdy stary węzeł trafia do jednej krainy. Wycięty las nie wraca podczas migracji.
  for(const node of nodes){const region=E4World.regionAt(world,node.x,node.z),settlement=region;if(!settlement)continue;const pool=E4Economy.nature(next,settlement),key={tree:'timber',rock:'stone',ruda:'ore',clay:'clay',bush:'forage',grzyb:'forage',fish:'fish',zboze:'wildGrain'}[node.type];if(key)pool[key]+=Math.max(0,next.nodeAmt[nodes.indexOf(node)]||0);}
  for(const herd of next.herds){const species={koza:'koza',kura:'kura',dzik:'swinia'}[herd.type];if(species)E4Economy.nature(next,herd).wild[species]+=herd.n;}
  for(const person of next.people){person.job=null;person.wb=null;person.path=null;person.after=null;person.state='idle';person.waitHome=0;}
  next.e4.policy.autoExpand=true;delete next.e4Preparing;
  if(!validateSave(next))throw new Error('Migracja nie przeszła walidacji.');
  localStorage.setItem(SAVEKEY+'-przed-epoka4',serializeSave());S=next;e4Restore();save();openSheet('osada');return{ok:true};
 }catch(error){if(S!==previousState){S=previousState;try{rebuildWorldFromState();buildPeopleMeshes();renderTop();renderPanel();}catch(restoreError){console.warn(restoreError)}}toast('Nie udało się rozpocząć epoki IV: '+error.message);return{ok:false,reason:error.message};}
}
function e4Restore(){document.body.classList.add('epoka4');rev.fill(1);applyFog();refreshNodes();refreshDeco();E4Economy.ensure(S);e4Selected=S.e4.settlements[e4Selected]?e4Selected:'przystan';nocSkip=null;e4BuildWorld();buildPeopleMeshes();}
function e4Daily(state){
 // Materiały dawnych budów zostały już pobrane w poprzedniej epoce.
 const workers=E4Economy.workers(state,'przystan'),initialLabor=workers.reduce((total,person)=>total+(person.e4HoursLeft||0),0);let labor=initialLabor;
 for(const building of state.bld){if(labor<=0)break;if(building.prog<building.work){const missing=Math.max(0,(building.mat||0)-(building.del||0)),haul=Math.min(missing,labor*6);building.del=(building.del||0)+haul;labor-=haul/6;const work=Math.min(building.work-building.prog,labor*.5);building.prog+=work;labor-=work*2;if(building.prog>=building.work){completeSite(building);const kind=state.e4.legacyMapping?.[building.kind],town=state.e4.settlements.przystan;if(kind)town.buildings[kind]=(town.buildings[kind]||0)+1;if(BD[building.kind].house)town.homeCapacity+=BD[building.kind].house;if(building.field){const center=bCenter(building);town.fields.push({id:state.e4.nextBatch++,crop:'zboze',planted:state.day,age:0,progress:0,soil:1,sown:false,harvests:0,legacyId:building.id,x:center.x,z:center.z});}}}
  if(building.proj&&labor>0){const work=Math.min(building.proj.work-building.proj.prog,labor*.5);building.proj.prog+=work;labor-=work*2;if(building.proj.prog>=building.proj.work)finishProj(building);}
 }
 let usedLabor=initialLabor-labor;for(const worker of workers){const used=Math.min(worker.e4HoursLeft||0,usedLabor);worker.e4HoursLeft-=used;worker.e4Labor+=used;usedLabor-=used;}state.e4.settlements.przystan.laborLeft=labor;
 if(--state.weather.left<=0){const choices=seasonIdx()===2?['snow','frost','clear']:['clear','rain','fog'];state.weather.k=choices[Math.floor(E4Domain.random(state)*choices.length)];state.weather.left=2;}
 for(const field of state.e4.settlements.przystan.fields)if(field.legacyId!==undefined){const building=state.bld.find(candidate=>candidate.id===field.legacyId);if(building?.field){building.field.st=field.sown?'rosnie':'puste';building.field.g=field.progress/E4Catalog.crops[field.crop].days;fieldVis(building);}}
 E4Population.daily(state);state.people.forEach(person=>{person.job=null;person.wb=null});curYd=yday();paintBase(curYd);e4Sync();save();
}
{const previousStep=step;step=function(dt){if(S?.epoch===4){E4Economy.advance(S,dt/DAY,e4Daily);return}previousStep(dt)}}
{const previousPlanner=planJob;planJob=function(person){if(S?.e4Preparing&&!pendingDelivery(person)){person.state='idle';person.wait=1;person.act='czeka na Wiec Rodów';return false}return previousPlanner(person)}}
{const previousStory=storyTick;storyTick=function(){if(S?.epoch===4)return;if(S?.e4Preparing&&e4Ready()){e4Start();return}previousStory()}}
{const previousEvent=openEvent;openEvent=function(){if(S?.epoch!==4)return previousEvent.apply(this,arguments)}}
{const previousValidate=validateSave;validateSave=function(state){return previousValidate(state)&&(state.epoch!==4||E4Domain.validate(state)||saveInvalid('e4: nieprawidłowe dane rodów, folwarków lub transportu'))}}
{const previousMap=mapTick;mapTick=function(delta){if(S?.epoch!==4)return previousMap(delta);e4Draw(delta);wxFrame(delta);if(nocSkip&&Math.floor(S.day)>=nocSkip.d0&&tod()>=T0&&tod()<T1-.05)nocEnd();nocUI()}}
{const previousPan=panBy;panBy=function(dx,dy){if(S?.epoch!==4)return previousPan(dx,dy);const size=34/zoom,unit=size/innerHeight;camT.x=clamp(camT.x-dx*Math.cos(yaw)*unit-dy*Math.sin(yaw)*unit/Math.sin(pitch),-188,188);camT.z=clamp(camT.z+dx*Math.sin(yaw)*unit-dy*Math.cos(yaw)*unit/Math.sin(pitch),-188,188);follow=false;setCam()}}
{const previousHeight=Hy;Hy=function(x,z){return S?.epoch===4?E4World.height(S.e4.world,x,z):previousHeight(x,z)}}
{const previousLook=lookAt;lookAt=function(x,z,magnification){if(S?.epoch!==4)return previousLook(x,z,magnification);overview=null;camT.x=clamp(x,-188,188);camT.z=clamp(z,-188,188);if(magnification)zoomT=magnification;setCam()}}
{const previousIslandZoom=islandZoom;islandZoom=function(){return S?.epoch===4?Math.max(.04,34/Math.max(430,600/(innerWidth/innerHeight))):previousIslandZoom()}}
{const previousRebuild=rebuildWorldFromState;rebuildWorldFromState=function(){e4ClearWorld();previousRebuild();if(S?.epoch===4)e4Restore()}}
{const previousGoals=goalsTick;goalsTick=function(){if(S?.epoch!==4)previousGoals()}}
{const previousTech=techTick;techTick=function(){if(S?.epoch!==4)previousTech()}}
{const previousCustom=custTick;custTick=function(){if(S?.epoch!==4)previousCustom()}}

{const previousFog=fogPass;fogPass=function(force){if(S?.epoch!==4)return previousFog(force)}}
