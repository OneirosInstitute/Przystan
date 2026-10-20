/* Epoka IV: własność zasobów, projekty, konwoje i deterministyczny zegar. */
const E4Economy=(()=>{
 const flow=typeof ResourceFlow==='undefined'?require('./p_flow.js'):ResourceFlow;
 const domain=typeof E4Domain==='undefined'?require('./p_e4_domain.js'):E4Domain;
 const worldApi=typeof E4World==='undefined'?require('./p_e4_world.js'):E4World;
 const catalog=typeof E4Catalog==='undefined'?require('./p_e4_catalog.js'):E4Catalog;
 const life=typeof E4Life==='undefined'?require('./p_e4_life.js'):E4Life;
 const ticksPerDay=1000000;
 const sum=resources=>Object.values(resources).reduce((total,quantity)=>total+quantity,0);
 const validItems=items=>!!items&&typeof items==='object'&&!Array.isArray(items)&&Object.keys(items).length>0&&Object.entries(items).every(([resource,quantity])=>Object.hasOwn(catalog.resources,resource)&&Number.isFinite(quantity)&&quantity>0);
 const foodTotal=resources=>catalog.food.reduce((total,resource)=>total+(resources[resource]||0),0);
 function foodItems(resources,quantity){const total=foodTotal(resources);if(!Number.isFinite(quantity)||quantity<0||total+1e-9<quantity)return null;const items={};for(const resource of catalog.food)if(resources[resource]>0&&quantity>0)items[resource]=quantity*(resources[resource]/total);return items}
 function add(resources,items){for(const [resource,quantity]of Object.entries(items))resources[resource]=(resources[resource]||0)+quantity}
 function take(resources,items){for(const [resource,quantity]of Object.entries(items))resources[resource]=Math.max(0,(resources[resource]||0)-quantity)}
 const has=(resources,items)=>Object.entries(items).every(([resource,quantity])=>(resources[resource]||0)+1e-9>=quantity);
 const workers=(state,settlementId)=>domain.residents(state,settlementId).filter(person=>person.age>=16&&person.age<72&&person.hp>.35&&!person.e4Transport);
 function freeCapacity(state,settlement){const incoming=state.e4.transports.filter(transport=>transport.to===settlement.id&&transport.phase==='outbound').reduce((total,transport)=>total+sum(transport.items),0),promised=settlement.batches.reduce((total,batch)=>total+sum(catalog.recipes[batch.recipe].output),0);return settlement.capacity-sum(domain.stock(state,settlement.id))-incoming-promised;}
 function ensure(state){
  const model=state.e4;if(!model||model.schema!==1)throw new Error('Brak modelu Epoki IV');
  if(model.simTicks===undefined){model.simTicks=Math.round(state.day*ticksPerDay);model.startTicks=model.simTicks;model.startTime=state.t||0;model.fraction=0;model.vehicles=Array.from({length:Math.max(0,Math.floor(state.wozy||0))},(_,index)=>({id:index+1,owner:'przystan',transportId:null}));model.nextBatch=1;model.nextAnimal=1;model.nature={};}
  for(const settlement of Object.values(model.settlements)){settlement.invested??={};settlement.conditions??={};settlement.herd??=[];settlement.plans??=[];settlement.output??={};settlement.consumed??={};settlement.trials??=[];settlement.land.strains??={};settlement.buildings.schronienie??=1;}
  if(model.fieldLayoutVersion!==1){for(const person of state.people)if(person.e4Action?.taskId?.startsWith('crop:'))delete person.e4Action;model.fieldLayoutVersion=1;}
  if(!model.natureInitialized){model.natureInitialized=true;for(const region of model.world.regions)nature(state,region);}
  return model;
 }
 function materialCost(required,stock){const cost={...required},missing=Math.max(0,(cost.narz||0)-(stock.narz||0));if(missing&&(stock.narzk||0)>=missing*2){cost.narz-=missing;if(!cost.narz)delete cost.narz;cost.narzk=(cost.narzk||0)+missing*2;}return cost;}
 function project(state,settlementId,kind){
  ensure(state);const settlement=state.e4.settlements[settlementId],definition=catalog.buildings[kind];
  if(!settlement||!definition)return{ok:false,reason:'Nieznany projekt.'};
  if(definition.crop&&!(settlement.land.seeds[definition.crop]>0))return{ok:false,reason:'Najpierw pozyskaj sadzonki: '+catalog.crops[definition.crop].name+'.'};
  if(settlement.projects.some(item=>item.kind===kind))return{ok:false,reason:'Te prace już trwają.'};
  if((settlement.buildings[kind]||0)>0&&!['pole','ogrodek','zielnik','len','skrzydlo','chata','magazyn'].includes(kind))return{ok:false,reason:'Ten budynek już stoi.'};
  const resources=domain.stock(state,settlementId),cost=materialCost(definition.cost,resources);if(!has(resources,cost))return{ok:false,reason:'Brakuje materiałów: '+Object.entries(definition.cost).filter(([resource,quantity])=>(resources[resource]||0)<quantity).map(([resource])=>catalog.resources[resource]).join(', ')};
  if(!workers(state,settlementId).length)return{ok:false,reason:'Brakuje dorosłego budowniczego.'};
  take(resources,cost);if(definition.crop)settlement.land.seeds[definition.crop]--;settlement.projects.push({kind,work:definition.labor,progress:0,materials:{...cost},started:state.day});
  domain.record(state,'build',settlement.name+': rozpoczynają '+definition.name.toLowerCase()+'.',{settlementId});return{ok:true};
 }
 function routeFor(state,source,target){return source.route&&target.id==='przystan'?{points:source.route.points.slice().reverse(),length:source.route.length}:target.route&&source.id==='przystan'?target.route:worldApi.route(state.e4.world,source,target)}
 function courier(state,sourceId){const vehicle=state.e4.vehicles.find(candidate=>candidate.owner===sourceId&&!candidate.transportId),worker=workers(state,sourceId).sort((first,second)=>first.id-second.id)[0];return{vehicle,worker,capacity:vehicle?250:30}}
 function startTransport(state,{source,target,items,route,peopleIds,founding=false,vehicle=null,travelFood={}}){
  const id=state.e4.nextTransport++,duration=Math.max(.08,route.length/(vehicle?34:24));
  const transport={id,from:source.id,to:target.id,items:{...items},travelFood:{...travelFood},peopleIds:peopleIds.slice(),vehicleId:vehicle?.id??null,route:domain.clone(route),started:state.e4.simTicks,arrival:state.e4.simTicks+Math.ceil(duration*ticksPerDay),duration,phase:'outbound',founding};
  state.e4.transports.push(transport);for(const person of state.people)if(peopleIds.includes(person.id)){person.e4Transport=id;delete person.e4Action;person.state='move';person.act=founding?'przeprowadza się z rodziną':'wiezie zapasy';person.path=null;person.tgt=null;person.after=null;}
  if(vehicle)vehicle.transportId=id;return transport;
 }
 function ship(state,{from,to,items}){
  ensure(state);const source=state.e4.settlements[from],target=state.e4.settlements[to];
  if(!source||!target||source===target||!validItems(items))return{ok:false,reason:'Nieprawidłowy transport.'};
  if(sum(items)>freeCapacity(state,target)+1e-9)return{ok:false,reason:'Brakuje miejsca w magazynie odbiorcy.'};
  const resources=domain.stock(state,from);if(!has(resources,items))return{ok:false,reason:'Brakuje wskazanego towaru.'};
  const {worker,vehicle,capacity}=courier(state,from);if(!worker)return{ok:false,reason:'Brakuje wolnego przewoźnika.'};
  const route=routeFor(state,source,target);if(!route)return{ok:false,reason:'Brak drogi lądowej.'};
  const duration=Math.max(.08,route.length/(vehicle?34:24)),provisions=foodItems(resources,state.e4.dailyFactor*domain.need(worker)*(Math.ceil(duration*2)+1));
  if(!provisions)return{ok:false,reason:'Brakuje jedzenia dla przewoźnika.'};
  const debit={...items};add(debit,provisions);
  if(!has(resources,debit))return{ok:false,reason:'Towar i prowiant przekraczają zapasy.'};
  if(sum(debit)>capacity+1e-9)return{ok:false,reason:'Ładunek przekracza pojemność transportu: '+capacity+'.'};
  take(resources,debit);const transport=startTransport(state,{source,target,items,route,peopleIds:[worker.id],vehicle,travelFood:provisions});return{ok:true,id:transport.id};
 }
 function found(state,{householdId,regionId,specialization}){
  ensure(state);const family=state.e4.households[householdId],region=state.e4.world.regions.find(candidate=>candidate.id===regionId),definition=catalog.specialties[specialization];
  if(!family||!region||!definition)return{ok:false,reason:'Wybierz rodzinę, krainę i specjalizację.'};
  {const fit=catalog.specialtyFit(specialization,region);if(!fit.ok)return{ok:false,reason:`${definition.name} nie ma tu z czego żyć. Brakuje: ${fit.missing.join(', ')}.`};}
  if(Object.values(state.e4.settlements).some(settlement=>settlement.regionId===regionId))return{ok:false,reason:'W tej krainie działa już ośrodek.'};
  const source=state.e4.settlements[family.settlementId],people=domain.members(state,family.id);
  if(people.filter(person=>person.age>=16&&person.age<65&&person.hp>.45).length<2||people.some(person=>person.e4Transport||person.job==='wyp'||person.carry?.length||person.kozN))return{ok:false,reason:'Rodzina potrzebuje dwóch zdrowych dorosłych i zakończonych dostaw lub wypraw.'};
  if(source.id==='przystan'&&domain.residents(state,source.id).length-people.length<8)return{ok:false,reason:'W Przystani musi zostać co najmniej osiem osób.'};
  const route=worldApi.route(state.e4.world,source,region);if(!route)return{ok:false,reason:'Brak drogi do wybranej krainy.'};
  const vehicle=state.e4.vehicles.find(candidate=>candidate.owner===source.id&&!candidate.transportId),duration=Math.max(.08,route.length/(vehicle?34:24));
  const base={drewno:36,deski:12,kamien:10,narz:2,opal:24,ziarno:10},resources=domain.stock(state,source.id),foodNeed=people.reduce((total,person)=>total+domain.need(person),0)*state.e4.dailyFactor*(Math.ceil(duration)+16),afterBase={...resources};
  if(!has(resources,base))return{ok:false,reason:'Potrzeba 36 kłód, 12 desek, 10 kamienia, 2 narzędzi, 24 opału i 10 ziarna.'};take(afterBase,base);
  const provisions=foodItems(afterBase,foodNeed);if(!provisions)return{ok:false,reason:'Brakuje zapasów na podróż i początek gospodarstwa: '+Math.ceil(foodNeed)+' porcji.'};
  const items={...base};add(items,provisions);const capacity=people.reduce((total,person)=>total+(person.age>=16?80:30),0)+(vehicle?250:0);
  if(sum(items)>capacity)return{ok:false,reason:'Rodzina potrzebuje wolnego wozu na dobytek i zapasy.'};
  const id='folwark:'+state.e4.nextEstate++,settlement=domain.createSettlement(state,{id,name:'Folwark '+(state.rody[family.clanId]?.name||'rodu'),clanId:family.clanId,x:region.x,z:region.z,regionId,stage:'podroz',specialization,route,road:1,foundingFamily:family.id});
  take(resources,items);const transport=startTransport(state,{source,target:settlement,items,route,peopleIds:people.map(person=>person.id),founding:true,vehicle});
  domain.record(state,'founding',people.map(person=>person.name).join(', ')+' wyruszają założyć '+settlement.name+'.',{settlementId:id,clanId:family.clanId});return{ok:true,id,transportId:transport.id};
 }
 function join(state,personId,partnerId){
  ensure(state);const person=state.people.find(candidate=>candidate.id===personId),partner=state.people.find(candidate=>candidate.id===partnerId);if(!person||!partner||person.e4Transport||partner.e4Transport||person.settlementId===partner.settlementId)return{ok:false,reason:'Niedostępna przeprowadzka.'};
  const source=state.e4.settlements[person.settlementId],target=state.e4.settlements[partner.settlementId],incoming=state.e4.transports.filter(t=>t.to===target.id&&t.phase==='outbound'&&(t.joinPartner!==undefined||t.founding)).reduce((sum,t)=>sum+t.peopleIds.length,0),targetResidents=domain.residents(state,target.id);if(workers(state,source.id).length<=2)return{ok:false,reason:'W gospodarstwie muszą pozostać co najmniej dwie osoby zdolne do pracy.'};if(targetResidents.length+incoming+1>target.homeCapacity)return{ok:false,reason:'Najpierw przygotuj miejsce dla nowej rodziny.'};const dailyNeed=(targetResidents.reduce((sum,p)=>sum+domain.need(p),0)+incoming+domain.need(person))*state.e4.dailyFactor;if(foodTotal(domain.stock(state,target.id))<dailyNeed*4)return{ok:false,reason:'Najpierw odbuduj zapas żywności dla powiększonego gospodarstwa.'};const route=routeFor(state,source,target);if(!route)return{ok:false,reason:'Brak drogi.'};
  const resources=domain.stock(state,source.id),duration=Math.max(.08,route.length/24),food=foodItems(resources,state.e4.dailyFactor*domain.need(person)*(Math.ceil(duration)+1));if(!food)return{ok:false,reason:'Brak prowiantu.'};
  take(resources,food);const transport=startTransport(state,{source,target,route,items:food,peopleIds:[person.id]});transport.joinPartner=partner.id;person.betrothed=partner.id;partner.betrothed=person.id;return{ok:true};
 }
 function positionOnRoute(transport,tick){const progress=Math.max(0,Math.min(1,(tick-transport.started)/Math.max(1,transport.arrival-transport.started))),points=transport.route.points,targetDistance=transport.route.length*progress;let walked=0;
  for(let index=1;index<points.length;index++){const first=points[index-1],second=points[index],length=Math.hypot(second.x-first.x,second.z-first.z);if(walked+length>=targetDistance){const fraction=length?(targetDistance-walked)/length:0;return{x:first.x+(second.x-first.x)*fraction,z:first.z+(second.z-first.z)*fraction}}walked+=length}return points[points.length-1];
 }
 function arrive(state,transport){
  const target=state.e4.settlements[transport.to],vehicle=state.e4.vehicles.find(candidate=>candidate.id===transport.vehicleId),people=state.people.filter(person=>transport.peopleIds.includes(person.id));
  if(!target){transport.to=transport.from;transport.route.points.reverse();transport.started=state.e4.simTicks;transport.arrival+=Math.ceil(transport.duration*ticksPerDay);transport.phase='returning';return}
  if(transport.phase==='outbound'){
   if(transport.joinPartner!==undefined){const partner=state.people.find(candidate=>candidate.id===transport.joinPartner),person=people[0];if(partner&&person){const family=domain.household(state,{clanId:partner.rod,settlementId:target.id,homeId:target.id+':dom'});person.settlementId=target.id;person.fam=family.id;partner.fam=family.id;person.pair=partner.id;partner.pair=person.id;delete person.betrothed;delete partner.betrothed;delete person.e4Transport;person.x=target.x;person.z=target.z;domain.record(state,'marriage',person.name+' i '+partner.name+' zakładają rodzinę w '+target.name+'.',{clanId:partner.rod,settlementId:target.id});}else for(const member of people){const family=domain.household(state,{clanId:member.rod,settlementId:target.id});member.fam=family.id;member.settlementId=target.id;delete member.e4Transport;delete member.betrothed;}add(domain.stock(state,target.id),transport.items);return true;}
   add(domain.stock(state,target.id),transport.items);transport.items={};state.e4.stats.deliveries++;
   if(transport.founding){
    for(const person of people){person.settlementId=target.id;delete person.e4Transport;person.x=target.x;person.z=target.z;person.state='idle';person.act='urządza gospodarstwo';const family=state.e4.households[person.fam];family.settlementId=target.id;family.homeId=null;state.fams[person.fam].home=null;}
    if(vehicle){vehicle.owner=target.id;vehicle.transportId=null}target.stage='zagroda';target.headId=people.filter(person=>person.age>=16).sort((first,second)=>second.age-first.age)[0]?.id??null;
    project(state,target.id,'dom_rodowy');domain.record(state,'arrival',target.name+': rodzina dotarła z dobytkiem. Rozpoczyna budowę domu rodowego.',{settlementId:target.id});return true;
   }
   domain.record(state,'delivery',target.name+': dotarła dostawa.',{settlementId:target.id});
   transport.phase='returning';transport.to=transport.from;transport.route.points.reverse();transport.started=state.e4.simTicks;transport.arrival=state.e4.simTicks+Math.ceil(transport.duration*ticksPerDay);return false;
  }
  add(domain.stock(state,transport.from),transport.travelFood);add(domain.stock(state,transport.from),transport.items);
  for(const person of people){delete person.e4Transport;person.x=target.x;person.z=target.z;person.state='idle';person.act='wraca z dostawy'}if(vehicle)vehicle.transportId=null;return true;
 }
 function completeProject(state,settlement,project){
  const definition=catalog.buildings[project.kind];settlement.buildings[project.kind]=(settlement.buildings[project.kind]||0)+1;settlement.conditions[project.kind]=1;
  const invested=settlement.invested[project.kind]??={};add(invested,project.materials);
  if(definition.storage)settlement.capacity+=definition.storage;if(definition.capacity)settlement.homeCapacity=Math.max(settlement.homeCapacity,definition.capacity);
  if(definition.capacityAdd)settlement.homeCapacity+=definition.capacityAdd;
  if(project.houseId!==undefined){const house=state.bld.find(building=>building.id===project.houseId);if(house){house.ext??=[];if(!house.ext.includes(project.extension))house.ext.push(project.extension)}}
  if(project.kind==='dom_rodowy'){settlement.stage='folwark';for(const family of Object.values(state.e4.households))if(family.settlementId===settlement.id)family.homeId=settlement.id+':dom_rodowy'}
  const crop=definition.crop||({pole:'zboze',ogrodek:'warzywa',zielnik:'ziola'})[project.kind];
  if(crop)settlement.fields.push({id:state.e4.nextBatch++,crop,planted:state.day,age:0,progress:0,soil:1,sown:true,harvests:0});
  domain.record(state,'complete',settlement.name+': ukończono '+definition.name.toLowerCase()+'.',{settlementId:settlement.id});
 }
 function extendHouse(state,houseId,extension){
  ensure(state);const house=state.bld.find(building=>building.id===houseId),kinds={ogrod:'ogrodek',piwnica:'piwnica',zielnik:'zielnik',wyroby:'wyroby'},kind=kinds[extension],settlement=state.e4.settlements.przystan;
  if(!house||!['chata','dom'].includes(house.kind)||house.prog<house.work||!kind||house.ext?.includes(extension)||settlement.projects.some(item=>item.houseId===houseId&&item.extension===extension))return{ok:false,reason:'Ta rozbudowa domu jest niedostępna.'};
  const definition=catalog.buildings[kind],resources=state.res;if(!has(resources,definition.cost)||!workers(state,'przystan').length)return{ok:false,reason:'Brakuje materiałów lub budowniczego.'};
  take(resources,definition.cost);settlement.projects.push({kind,houseId,extension,work:definition.labor,progress:0,materials:{...definition.cost},started:state.day});return{ok:true};
 }
 function batch(state,settlementId,recipeId){
  ensure(state);const settlement=state.e4.settlements[settlementId],recipe=catalog.recipes[recipeId];
  if(!settlement||!recipe||!settlement.buildings[recipe.building])return{ok:false,reason:'Potrzebny budynek: '+(catalog.buildings[recipe?.building]?.name||'pracownia')+'.'};
  if(!workers(state,settlementId).length)return{ok:false,reason:'Brakuje rzemieślnika.'};
  if(settlement.batches.length>=32)return{ok:false,reason:'Pracownie mają już pełne kolejki.'};
  const resources=domain.stock(state,settlementId),seedReserve=recipe.input.ziarno?Math.max(2,settlement.fields.filter(field=>field.crop==='zboze').length*2):0;if(seedReserve&&(resources.ziarno||0)<recipe.input.ziarno+seedReserve)return{ok:false,reason:'Ziarno na siew jest chronione: '+seedReserve+'. Uzupełnij plony lub dowieź ziarno.'};if(!has(resources,recipe.input))return{ok:false,reason:'Brakuje składników: '+Object.keys(recipe.input).filter(key=>(resources[key]||0)<recipe.input[key]).map(key=>catalog.resources[key]).join(', ')};
  if(sum(recipe.output)-sum(recipe.input)>freeCapacity(state,settlement))return{ok:false,reason:'Brakuje miejsca w magazynie.'};
  take(resources,recipe.input);settlement.batches.push({id:state.e4.nextBatch++,recipe:recipeId,materials:{...recipe.input},progress:0,work:recipe.labor,readyAt:null,started:state.day});return{ok:true};
 }
 let accountingState=null;
 function useLabor(people,quantity,skill,activity,taskId){
  let remaining=quantity,done=0;
  for(const person of people.slice().sort((first,second)=>(second.sk[skill]||0)-(first.sk[skill]||0)||first.id-second.id)){
   const productivity=1+.05*Math.min(5,person.sk[skill]||0),factor=accountingState?person.hp*(person.age>60?.7:1)*((domain.stock(accountingState,person.settlementId).narz||0)>0?1:(domain.stock(accountingState,person.settlementId).narzk||0)>0?.92:.85):1,credit=accountingState?(person.e4AttendanceDay===Math.floor(accountingState.day)-1?(person.e4Credits?.[taskId]||0)*8/420000*factor-(person.e4UsedCredits?.[taskId]||0):0):Infinity,effort=Math.min(person.e4HoursLeft||0,Math.max(0,credit),remaining/productivity);if(effort<=0)continue;
   person.e4HoursLeft-=effort;person.e4Labor+=effort;if(accountingState){person.e4UsedCredits??={};person.e4UsedCredits[taskId]=(person.e4UsedCredits[taskId]||0)+effort;}person.e4LastWork={activity,skill,taskId:taskId||null,hours:effort,day:person.e4LaborDay};person.e4Skill=skill;person.xp[skill]=(person.xp[skill]||0)+effort*.02;person.sk[skill]=Math.min(5,(person.sk[skill]||0)+effort*.0007);remaining-=effort*productivity;done+=effort*productivity;
  }return done;
 }
 function recordedLabor(state,people,quantity,skill,activity,taskId){const previous=accountingState;accountingState=state;try{return useLabor(people,quantity,skill,activity,taskId)}finally{accountingState=previous}}
 const laborLeft=people=>people.reduce((total,person)=>total+(person.e4HoursLeft||0),0);
 const winter=state=>(state.day%20+20)%20>=10&&(state.day%20+20)%20<15;
 function nature(state,settlement){
  if(state.e4.simTicks===undefined)ensure(state);
  const region=worldApi.regionAt(state.e4.world,settlement.x,settlement.z),id=region?.id||'centrum';
  if(!state.e4.nature[id]){const forest=region?.forest??.5;state.e4.nature[id]={timber:forest*8000,maxTimber:forest*8000,ore:(region?.ore??.3)*5000,clay:(region?.clay??.4)*5000,stone:4000,fish:(region?.fish??.3)*1500,maxFish:(region?.fish??.3)*1500,forage:(region?.fertility??.6)*800,maxForage:(region?.fertility??.6)*800,herbs:180,wildGrain:80,wild:{koza:8,kura:12,swinia:6},cuttings:{winogrona:8,jablka:8,chmiel:8,len:12},lastDay:Math.floor(state.day)};}
  const pool=state.e4.nature[id];if(pool.oreDeep===undefined)pool.oreDeep=(region?.ore??0)>=.6?Math.round(region.ore*20000):0;
  return pool;
 }
 function regenerate(state){
  for(const pool of Object.values(state.e4.nature)){if(pool.lastDay>=Math.floor(state.day))continue;pool.lastDay=Math.floor(state.day);pool.timber=Math.min(pool.maxTimber,pool.timber+(winter(state)?0:pool.maxTimber*.0007));pool.fish=Math.min(pool.maxFish,pool.fish+pool.maxFish*.008);pool.forage=Math.min(pool.maxForage,pool.forage+(winter(state)?0:pool.maxForage*.018));pool.herbs=Math.min(180,pool.herbs+(winter(state)?0:2));pool.wildGrain=Math.min(150,pool.wildGrain+(winter(state)?0:4));if(!winter(state))for(const species of Object.keys(pool.wild))pool.wild[species]=Math.min(species==='kura'?24:16,pool.wild[species]+.025*pool.wild[species]);}
 }
 function gather(state,settlement,people,resource,quantity){
  const pool=nature(state,settlement),mapping={drewno:['timber',3,'drwal'],kamien:['stone',2,'kamieniarz'],ruda:['ore',1.5,'kamieniarz'],glina:['clay',3,'kamieniarz'],jagody:['forage',6,'zbieracz'],ryby:['fish',5,'rybak'],ziola:['herbs',2,'zbieracz'],ziarno:['wildGrain',3,'rolnik']},definition=mapping[resource];if(!definition)return 0;
  if((resource==='jagody'||resource==='ziola'||resource==='ziarno')&&winter(state))return 0;
  // 4.4: szyb sięga głębokiego złoża rudy i wydobywa dwa i pół raza szybciej niż kopanie z powierzchni
  let field=definition[0],rate=definition[1],act='pozyskuje '+catalog.resources[resource].toLowerCase();if(resource==='ruda'&&settlement.buildings.szyb&&pool.oreDeep>0){field='oreDeep';rate*=2.5;act='kopie rudę w szybie'}
  const work=useLabor(people,Math.min(quantity,pool[field],Math.max(0,freeCapacity(state,settlement)))/rate,definition[2],act,'supply:'+settlement.id+':'+resource),yielded=Math.min(pool[field],work*rate);pool[field]-=yielded;add(domain.stock(state,settlement.id),{[resource]:yielded});add(settlement.output,{[resource]:yielded});return yielded;
 }
 function trial(state,settlementId,cropId){
  ensure(state);const settlement=state.e4.settlements[settlementId];if(!settlement||!catalog.crops[cropId]||!['winogrona','jablka','chmiel','len'].includes(cropId))return{ok:false,reason:'Nieznana próba uprawy.'};
  if(settlement.trials.some(item=>item.crop===cropId))return{ok:false,reason:'Ta próba już trwa.'};
  const stock=domain.stock(state,settlementId),cost=materialCost({narz:1,ziarno:3},stock),pool=nature(state,settlement);if(!workers(state,settlementId).length||!has(stock,cost)||pool.cuttings[cropId]<1)return{ok:false,reason:'Potrzeba pracy, narzędzia, 3 ziarna i dzikich sadzonek w krainie.'};
  take(stock,cost);pool.cuttings[cropId]--;settlement.trials.push({crop:cropId,progress:0,work:20,started:state.day});return{ok:true};
 }
 function experiments(state,settlement,people){
  const finished=[];for(const item of settlement.trials){item.progress+=useLabor(people,item.work-item.progress,'rolnik','prowadzi próby upraw','experiment:'+settlement.id+':'+item.crop);if(item.progress<item.work-.001)continue;
   const region=worldApi.regionAt(state.e4.world,settlement.x,settlement.z),chance=item.crop==='winogrona'&&region?.sun<.5?.35:.8,success=domain.random(state)<chance;
   if(success){settlement.land.seeds[item.crop]=(settlement.land.seeds[item.crop]||0)+3;settlement.land.strains[item.crop]=(settlement.land.strains[item.crop]||0)+1;}
   domain.record(state,'trial',settlement.name+': '+(success?'przyjęły się sadzonki '+catalog.crops[item.crop].name.toLowerCase():'próba '+catalog.crops[item.crop].name.toLowerCase()+' nie powiodła się')+'.',{settlementId:settlement.id});finished.push(item);
  }settlement.trials=settlement.trials.filter(item=>!finished.includes(item));
 }
 function feed(state,settlement){
  const resources=domain.stock(state,settlement.id),people=domain.residents(state,settlement.id).filter(person=>!person.e4Transport),need=people.reduce((total,person)=>total+domain.need(person),0)*state.e4.dailyFactor;
  const protectedStock={...resources};protectedStock.ziarno=Math.max(0,(resources.ziarno||0)-Math.max(2,settlement.fields.filter(field=>field.crop==='zboze').length*2));settlement.processingReserve={};for(const [id,recipe]of Object.entries(catalog.recipes)){const output=Object.keys(recipe.output)[0];if(!settlement.buildings[recipe.building]||(resources[output]||0)>=60||settlement.batches.some(b=>b.recipe===id))continue;for(const [key,quantity]of Object.entries(recipe.input)){if(!catalog.food.includes(key))continue;const reserved=Math.min(quantity,protectedStock[key]||0),candidate={...protectedStock,[key]:Math.max(0,(protectedStock[key]||0)-reserved)};if(foodTotal(candidate)>=need){protectedStock[key]=candidate[key];settlement.processingReserve[key]=Math.max(settlement.processingReserve[key]||0,reserved);}}}const eaten=foodItems(protectedStock,Math.min(need,foodTotal(protectedStock)))||{};take(resources,eaten);add(settlement.consumed,eaten);settlement.fed=need?sum(eaten)/need:1;settlement.reserveDays=need?foodTotal(resources)/need:0;
  const fuelNeed=winter(state)?Math.max(.5,people.length*.25):0,heated=(resources.opal||0)>=fuelNeed;take(resources,{opal:Math.min(resources.opal||0,fuelNeed)});
  for(const person of people){person.e4Fed=person.fedR=settlement.fed;person.warm=heated?1:.35;person.hp=Math.max(0,Math.min(1,person.hp+(settlement.fed>.99?.015:-(1-settlement.fed)*.09)-(winter(state)&&!heated?.025:0)));}
  for(const [resource,rate]of Object.entries(catalog.spoil)){const loss=(resources[resource]||0)*rate*(settlement.buildings.piwnica?.45:1);if(loss){take(resources,{[resource]:loss});settlement.spoiled??={};add(settlement.spoiled,{[resource]:loss});}}
  settlement.status=settlement.fed<.99?'Niedobór jedzenia':winter(state)&&!heated?'Brakuje opału':settlement.reserveDays<4?'Odbudowują zapasy':'Gospodarstwo pracuje';
  for(const person of people){if(person.ill){const fresh=['warzywa','jagody','kiszonki','jablka'].some(key=>(resources[key]||0)>.1),herb=(resources.leki||0)>=.1||(resources.ziola||0)>=.1;if(herb){const key=(resources.leki||0)>=.1?'leki':'ziola';take(resources,{[key]:.1});add(settlement.consumed,{[key]:.1});}const over=person.ill.k==='szkorbut'?fresh&&state.day-person.ill.d>=2:state.day-person.ill.d>=(herb?3:5);if(over)person.ill=null;else person.hp=Math.max(0,person.hp-(herb?.008:.02));}if(person.hurt&&person.hp>.9)person.hurt=0;person.coat=Math.max(0,(person.coat??80)-.25*(1-.25*(settlement.comfort?.pierze||0)));if(person.coat<20&&(resources.odziez||0)>=1){take(resources,{odziez:1});add(settlement.consumed,{odziez:1});person.coat=100;}if(person.hp<.9&&(resources.leki||0)>=.1){take(resources,{leki:.1});add(settlement.consumed,{leki:.1});person.hp=Math.min(1,person.hp+.04);}if(winter(state)&&person.coat<10)person.hp=Math.max(0,person.hp-.005);}
  settlement.comfort={};for(const [key,definition]of Object.entries(catalog.householdUse)){const need=people.length*definition.daily,used=Math.min(resources[key]||0,need);take(resources,{[key]:used});add(settlement.consumed,{[key]:used});settlement.comfort[key]=need?used/need:1;}
  const toolKind=(resources.narz||0)>0?'narz':'narzk',tools=Math.min(resources[toolKind]||0,workers(state,settlement.id).length*(toolKind==='narz'?.005:.01)*(1-.2*(settlement.comfort.wosk||0)));take(resources,{[toolKind]:tools});add(settlement.consumed,{[toolKind]:tools});
  if(settlement.buildings.karczma)for(const person of people.filter(person=>person.age>=18)){const drink=['piwo','wino','mpitny'].find(resource=>(resources[resource]||0)>=.04);if(drink){take(resources,{[drink]:.04});add(settlement.consumed,{[drink]:.04});}}
 }
 function provisionTransports(state){for(const transport of state.e4.transports){const people=state.people.filter(person=>transport.peopleIds.includes(person.id)),need=people.reduce((total,person)=>total+domain.need(person),0)*state.e4.dailyFactor,resources=transport.founding||transport.joinPartner!==undefined?transport.items:transport.travelFood,eaten=foodItems(resources,Math.min(need,foodTotal(resources)))||{};take(resources,eaten);for(const person of people){person.e4Fed=person.fedR=need?sum(eaten)/need:1;person.hp=Math.max(0,person.hp-(1-person.e4Fed)*.06)}transport.consumed??={};add(transport.consumed,eaten);}}
 function supplyChain(state,settlement,people,resource,quantity,seen=[]){
  const stock=domain.stock(state,settlement.id);if((stock[resource]||0)>=quantity||seen.includes(resource)||seen.length>8)return;
  if(['drewno','kamien','glina','ruda','ziarno','jagody','ryby','ziola'].includes(resource)){gather(state,settlement,people,resource,quantity-(stock[resource]||0));return;}
  const candidates=Object.entries(catalog.recipes).filter(([,recipe])=>recipe.output[resource]),entry=candidates.find(([,recipe])=>settlement.buildings[recipe.building])||candidates[0];if(!entry)return;
  const [id,recipe]=entry;if(!settlement.buildings[recipe.building]){if(settlement.id!=='przystan'){settlement.blocker='Potrzebny import: '+catalog.resources[resource]+'. Zapewnij dostawę lub warsztat.';return;}const definition=catalog.buildings[recipe.building];if(!definition)return;const cost=materialCost(definition.cost,stock);for(const [key,value]of Object.entries(cost))supplyChain(state,settlement,people,key,value,[...seen,resource]);if(settlement.projects.length<2&&!settlement.projects.some(p=>p.kind===recipe.building))project(state,settlement.id,recipe.building);return;}
  for(const [key,value]of Object.entries(recipe.input))supplyChain(state,settlement,people,key,value+(key==='ziarno'?Math.max(2,settlement.fields.filter(f=>f.crop==='zboze').length*2):0),[...seen,resource]);
  if(!settlement.batches.some(b=>b.recipe===id)&&settlement.batches.length<6)batch(state,settlement.id,id);
 }
 function autoPlan(state,settlement,people){
  if(!settlement.autonomy||!people.length||settlement.stage==='podroz')return;
  const resources=domain.stock(state,settlement.id),residents=domain.residents(state,settlement.id),need=residents.reduce((total,person)=>total+domain.need(person),0)*state.e4.dailyFactor;
  if((resources.ziarno||0)<10)gather(state,settlement,people,'ziarno',10-(resources.ziarno||0));
  if(foodTotal(resources)<need*8){gather(state,settlement,people,'jagody',Math.min(need*2,40));gather(state,settlement,people,'ryby',Math.min(need,30));}
  const grainPlots=settlement.fields.filter(field=>field.crop==='zboze').length+settlement.projects.filter(item=>item.kind==='pole').length,annualYield=(catalog.crops.zboze.yield*.8*(.6+settlement.land.fertility*.7)-catalog.crops.zboze.seedCost)*.75,target=Math.ceil(need*catalog.crops.zboze.days/annualYield*1.1)+1;settlement.grainTarget=target;
  if(grainPlots<target&&settlement.projects.length<2)project(state,settlement.id,'pole');
  const completedGrain=settlement.fields.filter(field=>field.crop==='zboze').length,edibleFood=foodTotal(resources)-Math.min(resources.ziarno||0,Math.max(2,completedGrain*2)),housingNeeded=residents.length>=settlement.homeCapacity-3;
  settlement.growthBlocker=housingNeeded&&completedGrain<target?'Rozbudowa domu czeka: najpierw ukończ pola zboża ('+completedGrain+'/'+target+').':housingNeeded&&edibleFood<need*8?'Rozbudowa domu czeka: zgromadź żywność na 8 dni.':'';
  if(housingNeeded&&!settlement.growthBlocker)project(state,settlement.id,settlement.id==='przystan'?'chata':'skrzydlo');
  if(settlement.capacity<Math.max(need*12+500,sum(resources)+need*4))project(state,settlement.id,'magazyn');
  const specialty=catalog.specialties[settlement.specialization],next=specialty?.buildings.find(kind=>!settlement.buildings[kind]&&!settlement.projects.some(item=>item.kind===kind));
  if(next&&settlement.projects.length<2){const definition=catalog.buildings[next];if(definition.crop&&!settlement.land.seeds[definition.crop]){if(!(resources.narz>=1))supplyChain(state,settlement,people,'narzk',2);trial(state,settlement.id,definition.crop);}const cost=materialCost(definition.cost,resources);for(const [key,value]of Object.entries(cost))supplyChain(state,settlement,people,key,value);const outcome=project(state,settlement.id,next);settlement.blocker=outcome.ok?'':outcome.reason;}
  for(const species of Object.keys(catalog.animals))if(settlement.buildings[catalog.animals[species].building]&&(settlement.animals[species]||0)<2&&!(settlement.captures||[]).some(item=>item.species===species))capture(state,settlement.id,species);
  if(settlement.specialization==='miesny'){const animal=settlement.herd.find(candidate=>candidate.species==='swinia'&&candidate.age>=18&&settlement.animals.swinia>4);if(animal&&(resources.mieso||0)<30)slaughter(state,settlement.id,animal.id);}
  for(const [resource,targetQuantity]of Object.entries({drewno:60,kamien:40,glina:30,ruda:settlement.buildings.huta?30:0}))if((resources[resource]||0)<targetQuantity)gather(state,settlement,people,resource,targetQuantity-(resources[resource]||0));
  const desired=['opal','deski_reczne','woz',...(specialty?.recipes||(settlement.id==='przystan'?Object.keys(catalog.recipes):[])),'naczynia','cegla','sol','narzk',...(settlement.buildings.szwalnia?['odziez_skory']:[])];
  for(const recipeId of desired){const recipe=catalog.recipes[recipeId],output=Object.keys(recipe.output)[0],limit=output==='opal'?Math.max(30,residents.length*3):output==='deski'?40:60;
   const owned=output==='woz'?state.e4.vehicles.filter(vehicle=>vehicle.owner===settlement.id).length:(resources[output]||0),target=output==='woz'?Math.max(1,Math.ceil(residents.length/12)):limit;
   if(owned<target)for(const [key,value]of Object.entries(recipe.input))supplyChain(state,settlement,people,key,value);
   if(owned<target&&!settlement.batches.some(item=>item.recipe===recipeId)&&settlement.batches.length<6)batch(state,settlement.id,recipeId);}
 }
 function grow(state,settlement,people){
  const resources=domain.stock(state,settlement.id);
  for(const field of settlement.fields){const crop=catalog.crops[field.crop];field.age++;if(!field.sown){const seed=crop.seed?{[crop.seed]:crop.seedCost}:{};if(!has(resources,seed))continue;take(resources,seed);field.sown=true;field.progress=0;}
   if(winter(state))continue;const care=useLabor(people,.6,crop.skill,'pielęgnuje '+crop.name.toLowerCase(),'crop:'+settlement.id+':'+field.id);if(care<.3)continue;
   field.progress+=care/.6;if(field.age<crop.maturity||field.progress<crop.days-.001)continue;
   const region=worldApi.regionAt(state.e4.world,settlement.x,settlement.z),climate=crop.sun?Math.min(1,(region?.sun||.5)/crop.sun):1;
   const quantity=field.legacyYield!=null?field.legacyYield:Math.round(crop.yield*field.soil*(.6+settlement.land.fertility*.7)*climate*100)/100;
   if(quantity>freeCapacity(state,settlement)){settlement.status='Magazyn pełny — zbiory czekają na polu';continue;}
   add(resources,{[crop.resource]:quantity});add(settlement.output,{[crop.resource]:quantity});delete field.legacyYield;field.harvests++;field.progress=0;field.sown=false;field.soil=Math.max(.8,field.soil-.002+(settlement.buildings.rowy?.003:0));if(crop.maturity||field.crop==='len')settlement.land.seeds[field.crop]=(settlement.land.seeds[field.crop]||0)+1;state.e4.stats.harvests=(state.e4.stats.harvests||0)+1;
  }
 }
 function capture(state,settlementId,species){
  ensure(state);const settlement=state.e4.settlements[settlementId],definition=catalog.animals[species];if(!settlement||!definition||!settlement.buildings[definition.building])return{ok:false,reason:'Najpierw przygotuj schronienie dla zwierząt.'};
  const resources=domain.stock(state,settlementId),pool=nature(state,settlement);settlement.captures??=[];
  if(!workers(state,settlementId).length||!has(resources,{ziarno:2})||pool.wild[species]<1||settlement.herd.filter(animal=>animal.species===species).length+settlement.captures.length>=definition.capacity)return{ok:false,reason:'Brakuje opiekuna, paszy, miejsca lub dzikiego zwierzęcia.'};
  take(resources,{ziarno:2});pool.wild[species]--;settlement.captures.push({species,progress:0,work:12});return{ok:true};
 }
 function animalOutput(state,settlement,items){if(sum(items)>freeCapacity(state,settlement)){settlement.lostProduction??={};add(settlement.lostProduction,items);return;}add(domain.stock(state,settlement.id),items);add(settlement.output,items);}
 function husbandry(state,settlement,people){
  const resources=domain.stock(state,settlement.id),done=[];settlement.captures??=[];
  for(const item of settlement.captures){item.progress+=useLabor(people,item.work-item.progress,'hodowca','oswaja zwierzę','capture:'+settlement.id+':'+item.species);if(item.progress<item.work-.001)continue;
   const same=settlement.herd.filter(animal=>animal.species===item.species),sex=same.some(animal=>animal.sex==='k')?'m':'k';settlement.herd.push({id:state.e4.nextAnimal++,species:item.species,sex,age:catalog.animals[item.species].adult,hp:1,par:[],pregnant:null});done.push(item);
  }settlement.captures=settlement.captures.filter(item=>!done.includes(item));
  const newborns=[],dead=[];for(const animal of settlement.herd){const definition=catalog.animals[animal.species];animal.age++;
   const feedStock={...resources};feedStock.ziarno=Math.max(0,(resources.ziarno||0)-settlement.fields.filter(field=>field.crop==='zboze').length*2-2);const food=foodItems(feedStock,definition.feed),care=useLabor(people,.1,'hodowca','opiekuje się zwierzętami','herd:'+settlement.id);
   if(food&&care>.05){take(resources,food);add(settlement.consumed,food);animal.hp=Math.min(1,animal.hp+.025);
    if(animal.sex==='k'&&animal.age>=definition.adult){if(definition.milk)animalOutput(state,settlement,{mleko:definition.milk*(winter(state)?.5:1)});if(definition.eggs&&!winter(state))animalOutput(state,settlement,{jaja:definition.eggs,pierze:.025});}
   }else animal.hp-=.09;
   if(animal.hp<=0||animal.age>(animal.species==='kura'?250:650)){dead.push(animal);continue;}
   const same=settlement.herd.filter(candidate=>candidate.species===animal.species),father=same.find(candidate=>candidate.sex==='m'&&candidate.age>=definition.adult&&candidate.hp>.7&&!animal.par.includes(candidate.id));
   if(animal.sex==='k'&&animal.age>=definition.adult&&animal.hp>.8&&father&&same.length+newborns.filter(candidate=>candidate.species===animal.species).length<definition.capacity){
    if(!animal.pregnant&&!winter(state)&&domain.random(state)<.12)animal.pregnant={due:state.day+definition.gestation,father:father.id};
    if(animal.pregnant&&animal.pregnant.due<=state.day){newborns.push({id:state.e4.nextAnimal++,species:animal.species,sex:domain.random(state)<.5?'k':'m',age:0,hp:1,par:[animal.id,animal.pregnant.father],pregnant:null});animal.pregnant=null;state.e4.stats.animalBirths=(state.e4.stats.animalBirths||0)+1;}
   }
  }settlement.herd=settlement.herd.filter(animal=>!dead.includes(animal)).concat(newborns);for(const species of Object.keys(catalog.animals))settlement.animals[species]=settlement.herd.filter(animal=>animal.species===species).length;
  if(settlement.buildings.pasieka&&!winter(state)&&useLabor(people,.4,'zbieracz','dogląda pasieki','apiary:'+settlement.id)>=.39){const region=worldApi.regionAt(state.e4.world,settlement.x,settlement.z),nectar=region?.nectar||.5;animalOutput(state,settlement,{miod:nectar*2,wosk:nectar*.2});}
 }
 function slaughter(state,settlementId,animalId){ensure(state);const settlement=state.e4.settlements[settlementId],animal=settlement?.herd.find(candidate=>candidate.id===animalId);if(!animal||!workers(state,settlementId).length)return{ok:false,reason:'Brak zwierzęcia lub hodowcy.'};const definition=catalog.animals[animal.species],items={mieso:definition.meat*Math.min(1,animal.age/definition.adult),skory:definition.skin};if(sum(items)>freeCapacity(state,settlement))return{ok:false,reason:'Brakuje miejsca na mięso i skóry.'};settlement.herd=settlement.herd.filter(candidate=>candidate!==animal);add(domain.stock(state,settlementId),items);add(settlement.output,items);settlement.animals[animal.species]--;return{ok:true};}
 function process(state,settlement,people){
  const resources=domain.stock(state,settlement.id),complete=[];
  for(const item of settlement.batches){const recipe=catalog.recipes[item.recipe];if(item.readyAt===null){item.progress+=useLabor(people,item.work-item.progress,recipe.skill,recipe.name.toLowerCase(),'batch:'+item.id);if(item.progress>=item.work-.001)item.readyAt=state.e4.simTicks+recipe.days*ticksPerDay;}
   if(item.readyAt!==null&&item.readyAt<=state.e4.simTicks){add(resources,recipe.output);if(item.recipe==='woz'){resources.woz=Math.max(0,resources.woz-1);const id=Math.max(0,...state.e4.vehicles.map(vehicle=>vehicle.id))+1;state.e4.vehicles.push({id,owner:settlement.id,transportId:null});state.wozy=(state.wozy||0)+1;}add(settlement.output,recipe.output);add(settlement.consumed,item.materials);complete.push(item);state.e4.stats.batches=(state.e4.stats.batches||0)+1;}
  }settlement.batches=settlement.batches.filter(item=>!complete.includes(item));
 }
 function daily(state){
  const previousAccounting=accountingState;accountingState=state;try{
  regenerate(state);provisionTransports(state);
  for(const settlement of Object.values(state.e4.settlements)){
   const available=workers(state,settlement.id);
   for(const person of available){person.e4UsedCredits={};person.e4LaborDay=state.day;person.e4Labor=0;person.e4HoursLeft=8*Math.min(1,person.e4AttendanceDay===Math.floor(state.day)-1?(person.e4AttendanceTicks||0)/420000:0)*person.hp*(person.age>60?.7:1)*((domain.stock(state,settlement.id).narz||0)>0?1:(domain.stock(state,settlement.id).narzk||0)>0?.92:.85);person.e4MentorId=null}
   autoPlan(state,settlement,available);
   for(const project of settlement.projects)project.progress+=useLabor(available,Math.min(project.work-project.progress,Math.max(4,laborLeft(available)*.45)),'ciesla','buduje: '+catalog.buildings[project.kind].name.toLowerCase(),'project:'+settlement.id+':'+project.kind+':'+project.started);
   const completed=settlement.projects.filter(project=>project.progress>=project.work-.001);settlement.projects=settlement.projects.filter(project=>!completed.includes(project));for(const project of completed)completeProject(state,settlement,project);
   grow(state,settlement,available);husbandry(state,settlement,available);experiments(state,settlement,available);process(state,settlement,available);feed(state,settlement);settlement.laborLeft=laborLeft(available);
  }
 }finally{accountingState=previousAccounting}
 }
 function advance(state,days,onDay=null){
  if(!Number.isFinite(days)||days<0||days>10000)throw new Error('Nieprawidłowy krok czasu');
  const issue=domain.clockIssue(state);if(issue)throw new Error(issue);
  const currentTicks=state.e4.simTicks??Math.round(state.day*ticksPerDay);
  if(!Number.isSafeInteger(currentTicks+Math.floor(days*ticksPerDay+(state.e4.fraction||0)+1e-9)))throw new Error('Przepełnienie zegara symulacji');
  const model=ensure(state);
  const exact=days*ticksPerDay+model.fraction,delta=Math.floor(exact+1e-9);model.fraction=Math.max(0,exact-delta);const target=model.simTicks+delta;
  while(model.simTicks<target){
   const previousTicks=model.simTicks,midnight=(Math.floor(model.simTicks/ticksPerDay)+1)*ticksPerDay,arrival=Math.min(Infinity,...model.transports.map(transport=>transport.arrival));model.simTicks=Math.min(target,midnight,arrival);state.day=model.simTicks/ticksPerDay;state.t=model.startTime+(model.simTicks-model.startTicks)/ticksPerDay*240;model.elapsed=(model.simTicks-model.startTicks)/ticksPerDay;
   life.advance(state,previousTicks/ticksPerDay,model.simTicks/ticksPerDay);
   for(const transport of model.transports){const position=positionOnRoute(transport,model.simTicks);for(const person of state.people)if(transport.peopleIds.includes(person.id)){person.x=position.x;person.z=position.z}}
   const finished=[];for(const transport of model.transports)if(transport.arrival<=model.simTicks&&arrive(state,transport))finished.push(transport);model.transports=model.transports.filter(transport=>!finished.includes(transport));
   if(model.simTicks===midnight){daily(state);model.lastDay=Math.floor(state.day);if(onDay)onDay(state)}
  }
  return state;
 }
 // Te same funkcje i argumenty; obserwacja nie zmienia komend ani bilansu.
 function observed(operation,mode,completedDay=false){return function(state,...args){return flow.run(state,mode,()=>operation(state,...args),completedDay?Math.max(0,Math.floor(state.day)-1):undefined)}}
 ship=observed(ship,'other');found=observed(found,'other');join=observed(join,'other');arrive=observed(arrive,'other');
 project=observed(project,'economy');extendHouse=observed(extendHouse,'economy');batch=observed(batch,'economy');trial=observed(trial,'economy');capture=observed(capture,'economy');slaughter=observed(slaughter,'economy');gather=observed(gather,'economy');
 daily=observed(daily,'economy',true);advance=observed(advance,'economy');
 return{recordedLabor,catalog,ensure,foodTotal,foodItems,add,take,has,workers,project,extendHouse,batch,trial,capture,slaughter,nature,gather,ship,found,join,advance,daily,positionOnRoute,ticksPerDay};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4Economy;
