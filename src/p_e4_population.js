/* Życie rodów: te same osoby, biologiczny wiek, związki, narodziny i sukcesja. */
const E4Population=(()=>{
 const domain=typeof E4Domain==='undefined'?require('./p_e4_domain.js'):E4Domain;
 const economy=typeof E4Economy==='undefined'?require('./p_e4_economy.js'):E4Economy;
 const world=typeof E4World==='undefined'?require('./p_e4_world.js'):E4World;
 const names={k:['Dobrawa','Mirosława','Jagna','Bogna','Wanda','Radochna','Sława','Nawoja','Milena','Ludmiła'],m:['Mieszko','Dobromir','Witosz','Radosław','Wojmir','Bolech','Sambor','Miłosz','Bogdan','Leszek']};
 const ancestors=person=>new Set([person.id,...person.par||[],...person.gp||[]]);
 function related(first,second){const kin=ancestors(first);return[...ancestors(second)].some(id=>kin.has(id))||first.fam===second.fam;}
 function marry(state,first,second){
  if(first.settlementId!==second.settlementId)return economy.join(state,first.id,second.id).ok;
  const family=domain.household(state,{clanId:first.rod,settlementId:first.settlementId,homeId:first.settlementId+':dom'});first.fam=second.fam=family.id;first.pair=second.id;second.pair=first.id;
  domain.record(state,'marriage',first.name+' i '+second.name+' zakładają nową gałąź rodu.',{clanId:first.rod,settlementId:first.settlementId});return true;
 }
 function birth(state,mother){
  const pregnancy=mother.e4Pregnancy,father=state.people.find(person=>person.id===pregnancy.father)||state.e4.archive[pregnancy.father],generation=Math.max(mother.generation,father?.generation||1)+1;
  for(let index=0;index<Math.min(2,pregnancy.count||1);index++){const sex=domain.random(state)<.5?'k':'m',child=domain.addPerson(state,{name:names[sex][Math.floor(domain.random(state)*names[sex].length)],sex,age:0,fam:mother.fam,rod:mother.rod,settlementId:mother.settlementId,par:pregnancy.father===null?[mother.id]:[mother.id,pregnancy.father],gp:[...new Set([...(mother.par||[]),...(father?.par||[])])],generation,birthDay:state.day,x:mother.x+.3,z:mother.z+.3,trait:mother.trait,unknownFather:!!pregnancy.unknownFather});state.born=(state.born||0)+1;state.e4.stats.births++;state.e4.stats.maxGeneration=Math.max(state.e4.stats.maxGeneration,generation);domain.record(state,'birth',mother.name+' rodzi dziecko: '+child.name+'. Pokolenie '+generation+'.',{personId:child.id,clanId:mother.rod,settlementId:mother.settlementId});}
  mother.e4LastBirth=state.day;delete mother.e4Pregnancy;delete mother.ciaza;
 }
 function sharing(state){
  const settlements=Object.values(state.e4.settlements).filter(settlement=>settlement.stage!=='podroz'&&domain.residents(state,settlement.id).length);
  if(state.e4.policy.shareSurplus)for(const target of settlements){if(state.e4.transports.some(transport=>transport.to===target.id&&transport.phase==='outbound'))continue;
   const stock=domain.stock(state,target.id),need=domain.residents(state,target.id).reduce((total,person)=>total+domain.need(person),0)*state.e4.dailyFactor,wanted={};if(economy.foodTotal(stock)<need*4)wanted.suchary=need*6;
   const specialty=economy.catalog.specialties[target.specialization];for(const recipeId of specialty?.recipes||[])for(const [key,quantity]of Object.entries(economy.catalog.recipes[recipeId].input))if(!economy.catalog.food.includes(key)&&(stock[key]||0)<quantity*2)wanted[key]=quantity*3;
   const next=specialty?.buildings.find(kind=>!target.buildings[kind]);for(const [key,quantity]of Object.entries(economy.catalog.buildings[next]?.cost||{}))if((stock[key]||0)<quantity)wanted[key]=quantity-(stock[key]||0);
   for(const [resource,quantity]of Object.entries(wanted)){const donor=settlements.filter(candidate=>candidate!==target).sort((first,second)=>Math.hypot(first.x-target.x,first.z-target.z)-Math.hypot(second.x-target.x,second.z-target.z)).find(candidate=>{const source=domain.stock(state,candidate.id),daily=domain.residents(state,candidate.id).reduce((total,person)=>total+domain.need(person),0)*state.e4.dailyFactor;return resource==='suchary'?economy.foodTotal(source)>daily*state.e4.policy.reserveDays+quantity:(source[resource]||0)>quantity+20});
    if(!donor)continue;const maxLoad=state.e4.vehicles.some(vehicle=>vehicle.owner===donor.id&&!vehicle.transportId)?100:15;let items;if(resource==='suchary')items=economy.foodItems(domain.stock(state,donor.id),Math.min(maxLoad,quantity));else items={[resource]:Math.min(maxLoad,quantity)};if(items&&economy.ship(state,{from:donor.id,to:target.id,items}).ok)break;
   }
  }
  if(state.e4.policy.autoExpand&&Math.floor(state.day)%20===0&&settlements.length<32){const families=Object.values(state.e4.households).filter(family=>domain.members(state,family.id).some(person=>person.age>=18&&person.age<35));
   for(const family of families){const source=state.e4.settlements[family.settlementId];if(domain.residents(state,source.id).length<16||source.reserveDays<12)continue;
    const region=state.e4.world.regions.filter(candidate=>!settlements.some(settlement=>settlement.regionId===candidate.id)).sort((first,second)=>Math.hypot(first.x-source.x,first.z-source.z)-Math.hypot(second.x-source.x,second.z-source.z)).find(candidate=>world.route(state.e4.world,source,candidate));if(!region)break;
    const specializations=Object.keys(economy.catalog.specialties),specialization=specializations.find(key=>!settlements.some(settlement=>settlement.specialization===key))||specializations[state.e4.nextEstate%specializations.length];if(economy.found(state,{householdId:family.id,regionId:region.id,specialization}).ok)break;
   }
  }
 }
 function daily(state){
  economy.ensure(state);const deceased=[];
  for(const person of state.people){person.age=Math.round((person.age+.1)*1e8)/1e8;if(person.ciaza&&!person.e4Pregnancy)person.e4Pregnancy={father:person.pair??null,unknownFather:person.pair==null,due:person.ciaza.d,count:person.ciaza.n||1};
   if(!person.e4Transport&&(person.hp<=0||person.age>90||person.age>68&&domain.random(state)<.001+(person.age-68)*.0004))deceased.push(person);
   if(person.age>=8&&person.age<18){const mentors=domain.residents(state,person.settlementId).filter(candidate=>candidate.age>=18&&candidate.hp>.5),settlement=state.e4.settlements[person.settlementId],skill=economy.catalog.specialties[settlement.specialization]?.skill||'rolnik',mentor=mentors.sort((first,second)=>(second.sk[skill]||0)-(first.sk[skill]||0)||first.id-second.id)[0];if(mentor){person.e4MentorId=mentor.id;person.sk[skill]=Math.min(mentor.sk[skill]||0,(person.sk[skill]||0)+.006);person.act='uczy się od: '+mentor.name;}}
  }
  for(const person of deceased){domain.archivePerson(state,person,person.hp<=0?'głód lub wychłodzenie':'starość');state.e4.stats.deaths++;}
  for(const settlement of Object.values(state.e4.settlements)){const head=state.people.find(person=>person.id===settlement.headId);if(!head){const successor=domain.residents(state,settlement.id).filter(person=>person.age>=16&&!person.e4Transport).sort((first,second)=>second.age-first.age||first.id-second.id)[0];if(successor){settlement.headId=successor.id;state.e4.stats.succession++;domain.record(state,'succession',successor.name+' przejmuje opiekę nad '+settlement.name+'.',{personId:successor.id,settlementId:settlement.id,clanId:successor.rod});}}}
  for(const mother of state.people.slice()){if(mother.e4Transport)continue;if(mother.e4Pregnancy&&mother.e4Pregnancy.due<=state.day){birth(state,mother);continue;}
   const settlement=state.e4.settlements[mother.settlementId],partner=state.people.find(person=>person.id===mother.pair);
   if(mother.sex==='k'&&mother.age>=18&&mother.age<42&&!mother.e4Pregnancy&&partner&&partner.fam===mother.fam&&!partner.e4Transport&&mother.hp>.7&&settlement.fed>.95&&settlement.reserveDays>3&&domain.residents(state,settlement.id).length<settlement.homeCapacity&&state.day-(mother.e4LastBirth??-100)>23&&domain.random(state)<.035)mother.e4Pregnancy={father:partner.id,due:state.day+7};
  }
  const singles=state.people.filter(person=>person.age>=18&&person.age<48&&person.pair==null&&!person.betrothed&&!person.e4Transport&&person.hp>.7);
  for(const first of singles){if(first.pair!=null||first.betrothed)continue;const settlement=state.e4.settlements[first.settlementId];if(settlement.fed<.99)continue;const second=singles.find(candidate=>candidate!==first&&candidate.pair==null&&!candidate.betrothed&&candidate.sex!==first.sex&&Math.abs(candidate.age-first.age)<15&&!related(first,candidate));if(second)marry(state,first,second);}
  sharing(state);state.hope=Math.max(.1,Math.min(1,Object.values(state.e4.settlements).reduce((total,settlement)=>total+(settlement.fed??1),0)/Object.keys(state.e4.settlements).length));state.fedR=state.e4.settlements.przystan.fed??1;
 }
 return{daily,related,marry};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4Population;
