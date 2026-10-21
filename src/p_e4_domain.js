/* Epoka IV: kanoniczne osoby, gospodarstwa, rody, ośrodki i historia. */
const E4Domain=(()=>{
 const worldApi=typeof E4World==='undefined'?require('./p_e4_world.js'):E4World;
 const catalog=typeof E4Catalog==='undefined'?require('./p_e4_catalog.js'):E4Catalog;
 const skills=['drwal','kamieniarz','zbieracz','rybak','mysliwy','ciesla','murarz','krawiec','kowal','rolnik','hodowca'];
 const clone=value=>JSON.parse(JSON.stringify(value));
 const finite=value=>typeof value==='number'&&Number.isFinite(value);
 const identity=value=>Number.isSafeInteger(value)&&value>=0;
 const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 function nextId(collection,start=1){return Math.max(start,...Object.keys(collection||{}).map(Number).filter(Number.isSafeInteger).map(value=>value+1))}
 function random(state){let value=state.e4.randomState|0;value^=value<<13;value^=value>>>17;value^=value<<5;state.e4.randomState=value>>>0||1;return state.e4.randomState/4294967296}
 function record(state,type,text,data={}){const entry={id:state.e4.nextEvent++,day:state.day,type,text,...data};state.e4.events.push(entry);if(state.e4.events.length>600)state.e4.events.splice(0,state.e4.events.length-600);return entry}
 function stock(state,settlementId){const settlement=state.e4.settlements[settlementId];if(!settlement)throw new Error('Nieznany ośrodek');return settlementId==='przystan'?state.res:settlement.stock}
 function need(person){return person.age<3?.3:person.age<12?.6:person.age>55?.8:1}
 function residents(state,settlementId){return state.people.filter(person=>person.settlementId===settlementId)}
 function members(state,householdId){return state.people.filter(person=>person.fam===householdId)}
 function household(state,{clanId,settlementId,homeId=null}){
  const id=Math.max(state.fid||1,nextId(state.fams));state.fid=id+1;state.fams[id]={id,home:null,sp:0};
  state.e4.households[id]={id,clanId,settlementId,homeId,created:state.day};return state.e4.households[id];
 }
 function addPerson(state,profile){
  const id=Math.max(state.pid||0,...state.people.map(person=>person.id+1),...Object.keys(state.e4.archive).map(Number).map(value=>value+1));state.pid=id+1;
  const skillNames=Object.keys(state.people[0]?.sk||{});if(!skillNames.length)skillNames.push(...skills);
  const sk=Object.fromEntries(skillNames.map(name=>[name,0])),xp=Object.fromEntries(skillNames.map(name=>[name,0]));
  const person={id,name:profile.name||'Mieszkaniec '+id,age:profile.age??0,sex:profile.sex||'k',fam:profile.fam,pair:null,sk,xp,job:null,wb:null,state:'idle',x:profile.x||0,z:profile.z||0,path:null,after:null,tgt:null,carry:null,wt:0,wait:0,mentor:null,cloth:0x8a7860,act:'odpoczywa',trait:'Cierpliwy',tool:{t:0,d:0},coat:100,hp:1,par:[],gp:[],born:1,...profile};
  person.generation=profile.generation||1;person.settlementId=profile.settlementId||state.e4.households[person.fam]?.settlementId||'przystan';
  state.people.push(person);return person;
 }
 function archivePerson(state,person,reason){
  state.e4.archive[person.id]={id:person.id,name:person.name,sex:person.sex,clanId:person.rod,fam:person.fam,par:(person.par||[]).slice(),gp:(person.gp||[]).slice(),generation:person.generation||1,age:person.age,birthDay:person.birthDay??null,deathDay:state.day,reason,skills:{...person.sk},historyUnknown:!!person.historyUnknown};
  state.people=state.people.filter(candidate=>candidate.id!==person.id);
  for(const partner of state.people){if(partner.pair===person.id)partner.pair=null;if(partner.betrothed===person.id)delete partner.betrothed;}
  state.died=(state.died||0)+1;record(state,'death',person.name+' umiera. Ród zachowuje jego historię.',{personId:person.id,clanId:person.rod});
 }
 function createSettlement(state,profile){
  if(state.e4.settlements[profile.id])throw new Error('Ośrodek już istnieje');
  const region=worldApi.regionAt(state.e4.world,profile.x,profile.z);
  const settlement={id:profile.id,name:profile.name,clanId:profile.clanId??null,x:profile.x,z:profile.z,regionId:region?.id||null,stock:profile.id==='przystan'?null:{},stage:'oboz',buildings:{schronienie:1},projects:[],fields:[],herd:[],captures:[],trials:[],plans:[],invested:{},conditions:{},output:{},consumed:{},animals:{koza:0,kura:0,swinia:0},batches:[],capacity:400,homeCapacity:8,autonomy:true,priority:'żywność',status:'Powstaje gospodarstwo',proposals:[],declined:{},founded:state.day,road:0,route:null,headId:null,land:{strains:{},fertility:region?.fertility??.6,timber:Math.round((region?.forest??.4)*1200),forestPressure:0,huntPressure:0,wild:{koza:8,kura:12,swinia:6},seeds:{zboze:1,warzywa:1,winogrona:0,jablka:0,len:0,chmiel:0,ziola:1}},...profile};
  state.e4.settlements[settlement.id]=settlement;return settlement;
 }
 // Budynki przysiółka (4.6) w języku epoki IV. Przysiółek bez zapisanych budynków dostaje to, co odpowiada jego etapowi.
 function hamletEstate(hamlet,day){
  let bud=hamlet.bud&&typeof hamlet.bud==='object'?{...hamlet.bud}:null;
  if(!bud){const st=Math.max(0,Math.min(4,Math.floor(hamlet.st||0)));bud={glowa:'szalas',srodek:'ognisko'};
   if(st>=1)Object.assign(bud,{glowa:'chata',praca:'stanowisko',tyl:'ogrod'});if(st>=2)Object.assign(bud,{lewa:'chata2',zapas:'ziemianka',srodek:'studnia',pole1:'pole'});
   if(st>=3)Object.assign(bud,{glowa:'dom',prawa:'chata3',plot:'plot',brama:'stodola',praca:'warsztat'});if(st>=4)Object.assign(bud,{glowa:'domrodu',zapas:'spichlerz',pole2:'pole2'});}
  const caps={szalas:5,chata:6,dom:8,domrodu:14,chata2:6,dom2:8,chata3:6,dom3:8},buildings={schronienie:1},fields=[];let storage=0;
  const houses=['lewa','prawa'].filter(slot=>bud[slot]).length+(['chata','dom'].includes(bud.glowa)?1:0);if(houses)buildings.chata=houses;
  if(bud.glowa==='domrodu')buildings.dom_rodowy=1;
  if(bud.zapas==='ziemianka')buildings.piwnica=1;if(bud.zapas==='spichlerz'){buildings.magazyn=1;storage+=800}
  if(bud.tyl){buildings.ogrodek=1;fields.push('warzywa')}if(bud.tyl==='zielnik'){buildings.zielnik=1;fields.push('ziola')}
  for(const slot of ['pole1','pole2'])if(bud[slot]){buildings.pole=(buildings.pole||0)+1;fields.push('zboze')}
  const homeCapacity=Math.max(8,['glowa','lewa','prawa'].reduce((total,slot)=>total+(caps[bud[slot]]||0),0));
  return{bud,buildings,fields,storage,homeCapacity,stage:bud.glowa==='domrodu'?'folwark':'zagroda'};
 }
 function migrate(snapshot,{world,dailyFactor=4.8}={}){
  if(!object(snapshot)||!Array.isArray(snapshot.people)||!snapshot.people.length||!object(snapshot.fams)||!object(snapshot.res))throw new Error('Brak poprawnej osady do migracji');
  if(snapshot.e4){if(!validate(snapshot))throw new Error('Nieprawidłowy zapis Epoki IV');return clone(snapshot)}
  if(!world||!finite(dailyFactor)||dailyFactor<=0)throw new Error('Brak świata lub nieprawidłowy rytm gospodarki');
  const state=clone(snapshot);state.epoch=4;state.e4={schema:1,world:clone(world),dailyFactor,randomState:(world.seed^0x4e4f5244)>>>0||1,started:state.day,lastDay:Math.floor(state.day),elapsed:0,households:{},settlements:{},archive:{},events:[],transports:[],nextTransport:1,nextEstate:1,nextEvent:1,policy:{reserveDays:12,shareSurplus:true,autoExpand:false,autoBuild:false,v46:1},migration:{sourceVersion:snapshot.ver||null,day:state.day,reservesConverted:[],unknownResidents:0},unlocks:{uprawy:1,hodowla:1,przetworstwo:1},stats:{births:0,deaths:0,deliveries:0,succession:0,maxGeneration:1}};
  state.rody=state.rody||{};
  const ensureClan=(requested,name)=>{if(identity(requested)&&state.rody[requested])return requested;const id=nextId(state.rody);state.rody[id]={id,name:name||'Założyciele',day:state.day};return id};
  const town=createSettlement(state,{id:'przystan',name:state.vname||'Przystań',x:world.town.x,z:world.town.z,stage:'osada',capacity:1200,homeCapacity:Math.max(state.people.length+4,40),buildings:{schronienie:1},road:2});
  for(const family of Object.values(state.fams)){
   const familyMembers=state.people.filter(person=>person.fam===family.id),first=familyMembers[0];
   const clanId=ensureClan(first?.rod,first?.name||'Założyciele');
   state.e4.households[family.id]={id:family.id,clanId,settlementId:'przystan',homeId:family.home??null,created:state.day};
   for(const person of familyMembers){if(!identity(person.rod)||!state.rody[person.rod])person.rod=clanId;person.settlementId='przystan';person.generation=person.generation||1;person.birthDay=person.birthDay??state.day-person.age*10;if(person.par?.includes(null)){person.par=person.par.filter(id=>id!==null);person.unknownFather=true;}if(person.gp?.includes(null))person.gp=person.gp.filter(id=>id!==null);}
  }
  state.pid=Math.max(state.pid||0,...state.people.map(person=>person.id+1));state.fid=Math.max(state.fid||1,nextId(state.fams));
  for(const hamlet of state.hamlets||[]){
   // 4.6: przysiółek przechodzi z tym, co zbudował; z domem rodu od razu jest folwarkiem
   const built=hamletEstate(hamlet,state.day);
   const clanId=ensureClan(hamlet.rod,hamlet.head||hamlet.name),settlement=createSettlement(state,{id:'przysiolek:'+hamlet.id,name:hamlet.name,clanId,x:hamlet.i-(snapshot.mapN||192)/2+.5,z:hamlet.j-(snapshot.mapN||192)/2+.5,stage:built.stage,legacyHamletId:hamlet.id,...(Number.isFinite(hamlet.ang)?{ang:hamlet.ang}:{}),buildings:built.buildings,homeCapacity:built.homeCapacity,capacity:400+built.storage,bud:built.bud,road:hamlet.road===2?2:1});
   settlement.fields=built.fields.map((crop,index)=>({id:900000+hamlet.id*20+index,crop,planted:state.day,age:30,progress:0,soil:1,sown:false,harvests:0}));
   const family=household(state,{clanId,settlementId:settlement.id,homeId:null});
   const count=Math.max(0,Math.floor(hamlet.pop||0));
   for(let index=0;index<count;index++){
    const name=hamlet.ppl?.[index]||'Mieszkaniec '+hamlet.id+'·'+(index+1),person=addPerson(state,{name,age:25,sex:/a$/.test(name)?'k':index%2?'k':'m',fam:family.id,rod:clanId,settlementId:settlement.id,x:settlement.x,z:settlement.z,historyUnknown:true,ageEstimated:true,sexEstimated:true,born:0});
    if(settlement.headId===null)settlement.headId=person.id;state.e4.migration.unknownResidents++;
   }
   const quantity=Math.floor(Math.max(0,Math.min(1,hamlet.zap??.4))*count*dailyFactor*10);
   settlement.stock.suchary=quantity;state.e4.migration.reservesConverted.push({source:hamlet.id,legacyFraction:hamlet.zap??.4,quantity,resource:'suchary'});
  }
  const livingIds=new Set(state.people.map(person=>person.id));
  for(const person of state.people)for(const ancestorId of [...person.par||[],...person.gp||[]])if(identity(ancestorId)&&!livingIds.has(ancestorId))state.e4.archive[ancestorId]??={id:ancestorId,name:null,historyUnknown:true,par:[],deathDay:null};
  town.headId=state.people.filter(person=>person.settlementId==='przystan'&&person.age>=18).sort((first,second)=>second.age-first.age)[0]?.id??null;
  record(state,'epoch','Rody rozpoczynają wspólną historię folwarków.');
  if(!validate(state))throw new Error('Migracja nie spełnia kontraktu tożsamości');return state;
 }
 // Wspólny kontrakt zegara dla importu i wykonywania symulacji.
 function clockIssue(state){
  const model=state.e4;
  if(!object(model)||!finite(state.day)||state.day<0||!finite(state.t)||state.t<0||!Array.isArray(model.transports))return 'Nieprawidłowy czas osady';
  if(model.simTicks===undefined)return Number.isSafeInteger(Math.round(state.day*1000000))&&!model.transports.length?'':'Niepełny zegar transportu';
  if(!identity(model.simTicks)||Math.abs(model.simTicks/1000000-state.day)>1e-6||!finite(model.fraction)||model.fraction<0||model.fraction>=1.000001)return 'Niespójny zegar symulacji';
  if(!identity(model.startTicks)||model.startTicks>model.simTicks||!finite(model.startTime)||model.startTime<0||!finite(model.elapsed)||model.elapsed<0)return 'Nieprawidłowy początek zegara';
  const elapsed=(model.simTicks-model.startTicks)/1000000;
  if(Math.abs(model.elapsed-elapsed)>1e-6||Math.abs(state.t-(model.startTime+elapsed*240))>1e-6)return 'Niespójny czas od rozpoczęcia epoki';
  if(model.transports.some(transport=>!object(transport)||!identity(transport.started)||transport.started>model.simTicks||!identity(transport.arrival)||transport.arrival<=model.simTicks))return 'Przeterminowany lub przyszły start transportu';
  return '';
 }
 function validPoint(point){return object(point)&&finite(point.x)&&finite(point.z)&&Math.abs(point.x)<=192&&Math.abs(point.z)<=192;}
 function validPath(points,length,minimum=0,arrivalTolerance=0){
  if(!Array.isArray(points)||points.length<minimum||points.length>10000||!finite(length)||length<0||!points.every(validPoint))return false;
  let measured=0;for(let index=1;index<points.length;index++)measured+=Math.hypot(points[index].x-points[index-1].x,points[index].z-points[index-1].z);
  return length===0&&measured<arrivalTolerance||Math.abs(measured-length)<=1e-6*Math.max(1,measured);
 }
 function validLabor(person){
  for(const key of ['e4Credits','e4UsedCredits'])if(person[key]!==undefined&&(!object(person[key])||!Object.values(person[key]).every(value=>finite(value)&&value>=0&&(key!=='e4Credits'||identity(value)))))return false;
  if(person.e4AttendanceTicks!==undefined&&!identity(person.e4AttendanceTicks))return false;
  if(person.e4AttendanceDay!==undefined&&!identity(person.e4AttendanceDay))return false;
  return true;
 }
 function validate(state){try{
  const model=state.e4;if(state.epoch!==4||!object(model)||model.schema!==1||!object(model.world)||model.world.version!==1||model.world.size!==384||!identity(model.world.seed)||model.world.seed!==state.seed||!Array.isArray(model.world.regions)||!model.world.regions.length||model.world.regions.length>144)return false;
  if(model.world.core&&((model.world.core.size!==192&&model.world.core.size!==384)||model.world.core.step!==2||model.world.core.heights?.length!==(model.world.core.size/2+1)**2||!model.world.core.heights.every(finite)))return false;
  if(!finite(model.dailyFactor)||model.dailyFactor<=0||model.dailyFactor>20||!identity(model.randomState)||!object(model.households)||!object(model.settlements)||!object(model.archive)||!Array.isArray(model.events)||!Array.isArray(model.transports)||model.events.length>600)return false;
  if(!['nextTransport','nextEstate','nextEvent'].every(key=>identity(model[key])&&model[key]>=1)||model.randomState>4294967295)return false;
  if(model.nauki!==undefined&&(!object(model.nauki)||!object(model.nauki.done)||(model.nauki.active!==null&&model.nauki.active!==undefined&&(!object(model.nauki.active)||typeof model.nauki.active.id!=='string'||!finite(model.nauki.active.progress)||!finite(model.nauki.active.work)))))return false;   // 4.7: nauki rodów
  if(!model.world.regions.every(region=>typeof region.id==='string'&&finite(region.x)&&finite(region.z)&&Math.abs(region.x)<=192&&Math.abs(region.z)<=192&&['fertility','moisture','sun','forest','ore','clay','fish','nectar'].every(key=>finite(region[key])&&region[key]>=0&&region[key]<=1)))return false;
  if(!Array.isArray(state.people)||!object(state.fams)||!object(state.rody)||!object(state.res))return false;
  const peopleIds=new Set();for(const person of state.people){
   if(!identity(person.id)||peopleIds.has(person.id)||!state.rody[person.rod]||!state.fams[person.fam]||!model.households[person.fam]||!model.settlements[person.settlementId])return false;peopleIds.add(person.id);
   if(model.households[person.fam].settlementId!==person.settlementId||!finite(person.age)||person.age<0||!finite(person.x)||!finite(person.z)||Math.abs(person.x)>192||Math.abs(person.z)>192||!['m','k'].includes(person.sex)||!identity(person.generation)||person.generation<1)return false;
   const action=person.e4Action;if(action&&(!object(action)||!['build','forge','sew','craft','field','care','chop','gather','mine','rest','sleep','wash','meal','family','teach','learn'].includes(action.kind)||!model.settlements[action.settlementId]||!['start','arrival','end','accounted','length'].every(key=>finite(action[key]))||action.end<=action.start||action.arrival<action.start||!validPoint(action.target)||!finite(action.plannedHours)||action.plannedHours<0||action.plannedHours>2||action.accounted<action.start-1e-9||action.accounted>action.end+1e-9||!validPath(action.route,action.length,0,.1)||action.route.length>2000))return false;
   if(!validLabor(person))return false;
   const parents=person.par||[];if(!Array.isArray(parents)||parents.length>2||!parents.every(identity)||parents.includes(person.id))return false;
  }
  for(const [key,family]of Object.entries(model.households))if(String(family.id)!==key||!identity(family.id)||!state.fams[family.id]||!state.rody[family.clanId]||!model.settlements[family.settlementId])return false;
  for(const settlement of Object.values(model.settlements)){
   if(!finite(settlement.x)||!finite(settlement.z)||Math.abs(settlement.x)>192||Math.abs(settlement.z)>192||!finite(settlement.capacity)||settlement.capacity<0||!Array.isArray(settlement.projects)||!Array.isArray(settlement.fields)||!object(settlement.buildings)||!object(settlement.animals))return false;
   const resources=settlement.id==='przystan'?state.res:settlement.stock;if(!validResources(resources))return false;
   if(!Object.entries(settlement.buildings).every(([kind,count])=>(kind==='schronienie'||Object.hasOwn(catalog.buildings,kind))&&identity(count)))return false;
   if(!settlement.projects.every(project=>Object.hasOwn(catalog.buildings,project.kind)&&finite(project.progress)&&project.progress>=0&&finite(project.work)&&project.work>0&&project.progress<=project.work+1e-6&&validResources(project.materials)))return false;
   if(!settlement.fields.every(field=>Object.hasOwn(catalog.crops,field.crop)&&finite(field.age)&&field.age>=0&&finite(field.progress)&&field.progress>=0&&finite(field.soil)&&field.soil>=0&&field.soil<=1))return false;
   if(!settlement.batches.every(batch=>Object.hasOwn(catalog.recipes,batch.recipe)&&validResources(batch.materials)&&finite(batch.progress)&&batch.progress>=0&&finite(batch.work)&&batch.work>0&&(batch.readyAt===null||identity(batch.readyAt))))return false;
   if(settlement.herd&&!settlement.herd.every(animal=>identity(animal.id)&&Object.hasOwn(catalog.animals,animal.species)&&['k','m'].includes(animal.sex)&&finite(animal.age)&&animal.age>=0&&finite(animal.hp)&&animal.hp>0&&animal.hp<=1))return false;
  }
  const transportIds=new Set();for(const transport of model.transports){if(!identity(transport.id)||transportIds.has(transport.id)||!model.settlements[transport.from]||!model.settlements[transport.to]||!validResources(transport.items)||!validResources(transport.travelFood)||!['outbound','returning'].includes(transport.phase)||!identity(transport.started)||!identity(transport.arrival)||transport.arrival<=transport.started||!finite(transport.duration)||transport.duration<=0||!Array.isArray(transport.peopleIds)||!transport.peopleIds.length||!transport.peopleIds.every(id=>peopleIds.has(id))||!validRoute(transport.route))return false;transportIds.add(transport.id);}
  const crew=new Set();for(const transport of model.transports)for(const personId of transport.peopleIds){if(crew.has(personId)||state.people.find(person=>person.id===personId).e4Transport!==transport.id)return false;crew.add(personId);}
  for(const person of state.people){if((person.par||[]).some(id=>!peopleIds.has(id)&&!model.archive[id]))return false;if(person.e4Pregnancy){const pregnancy=person.e4Pregnancy;if(!finite(pregnancy.due))return false;if(pregnancy.father===null){if(!pregnancy.unknownFather)return false;}else if(!identity(pregnancy.father)||!peopleIds.has(pregnancy.father)&&!model.archive[pregnancy.father])return false;}}
  if(model.vehicles){const ids=new Set();for(const vehicle of model.vehicles){if(!identity(vehicle.id)||ids.has(vehicle.id)||!model.settlements[vehicle.owner]||vehicle.transportId!==null&&!transportIds.has(vehicle.transportId))return false;ids.add(vehicle.id);}}
  if(model.nature)for(const pool of Object.values(model.nature)){if(!object(pool)||!['timber','maxTimber','ore','clay','stone','fish','maxFish','forage','maxForage','herbs','wildGrain'].every(key=>finite(pool[key])&&pool[key]>=0)||!object(pool.wild)||!Object.values(pool.wild).every(quantity=>finite(quantity)&&quantity>=0))return false;}
  for(const person of state.people)if(person.e4Transport!==undefined&&!transportIds.has(person.e4Transport))return false;
  if(clockIssue(state))return false;
  return true;
 }catch(error){return false}}
 function validResources(resources){return object(resources)&&Object.entries(resources).every(([resource,quantity])=>Object.hasOwn(catalog.resources,resource)&&finite(quantity)&&quantity>=0);}
 function validRoute(route){return object(route)&&validPath(route.points,route.length,1);}
 return{migrate,validate,clockIssue,random,record,stock,need,residents,members,household,addPerson,archivePerson,createSettlement,clone};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4Domain;
