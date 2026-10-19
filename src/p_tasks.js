
/* Jedna bramka dla trwałych dostaw i polityki pracy, przed wszystkimi planerami. */
function pendingDelivery(person){return !!(person.kozN||person.carry&&person.carry.length||person.haulQ>0||person.siteQ>0)}
function waterDelivery(person){return person.chK==='woda'&&person.chPh===1&&person.carry?.length===1&&person.carry[0].res==='woda'&&person.carry[0].q===0}
function resumeWaterDelivery(person){
 const home=bById(person.chWaterHome)??nearHouse(person),candidates=home?[buildingEntryFor(person,home)]:[person.chWaterTo,campDeliveryEntry(person)];
 for(const destination of candidates){if(!deliverySpotFree(person,destination))continue;
  if(go(person,destination,'chore',null)){person.chWaterTo=destination.slice();person.act='niesie wodę';return true;}
 }
 person.state='idle';person.path=null;person.after=null;person.wait=2;person.act='brak drogi do dostawy wody';return true;
}
function resumeDelivery(person){
 if(waterDelivery(person))return resumeWaterDelivery(person);
 if(person.kozN)return kozResume(person);
 const site=person.haulB?bById(person.haulB):person.siteB?bById(person.siteB):null;
 if(site&&!bDone(site)&&((person.haulQ||0)>0||(person.siteQ||0)>0)){
  const entry=buildingEntryFor(person,site),arrival=person.haulB?'haulDrop':'siteDrop';
  if(entry&&go(person,entry,arrival,null)){person.act='niesie materiał na budowę';return true}
 }else{
  if(person.haulB)haulEnd(person);
  if(person.siteB){const previous=bById(person.siteB);if(previous)previous.inTr=Math.max(0,(previous.inTr||0)-(person.siteQ||0));person.siteB=null;person.siteQ=0}
  if(!person.carry||!person.carry.some(item=>item.q>0)){person.carry=null;return false}
  const destination=storeTile(person,person.carry.some(item=>FOOD.includes(item.res)));
  if(destination&&go(person,destination,'deposit',null)){person.act='niesie do magazynu';return true}
 }
 person.state='idle';person.path=null;person.after=null;person.wait=2;
 person.act='brak drogi do dostawy — zachowuje ładunek';return true;
}
{const previousStep=stepPerson;stepPerson=function(person,dt){
 if(waterDelivery(person)){
  if(person.state==='move'&&person.after==='chore'&&person.path?.length){movePerson(person,dt);return}
  if(person.state==='work'&&person.workKind==='chore'){const destination=person.chWaterTo;if(!destination||!walk[destination[1]*N+destination[0]]||Math.hypot(person.x-tcx(destination[0]),person.z-tcx(destination[1]))>.8){release(person);resumeWaterDelivery(person);return}if(isWork())return previousStep(person,dt);return}
  if(person.wait>0){person.wait-=dt;return}release(person);return resumeWaterDelivery(person);
 }
 if(pendingDelivery(person)&&person.state!=='away'){
  const delivering=person.state==='move'&&person.path&&person.path.length&&['deposit','haulDrop','siteDrop','kozdom'].includes(person.after);
  if(!delivering){if(person.wait>0){person.wait-=dt;return}release(person);resumeDelivery(person);return}
  // Dostawa trwa także po końcu zmiany; wieczór nie może dopisać towaru na odległość.
  movePerson(person,dt);return;
 }
 return previousStep(person,dt);
}}

{const previousTrouble=troubleHTML;troubleHTML=function(){const excess=S?foodOverflow():0;return(excess>0?`<div class="card"><h4>Żywność poza osłoną: ${fmt(excess)}</h4><p>Zapasy pod dachem mieszczą ${fmt(foodCap())} porcji. Nadmiar pozostaje dostępny, ale szybciej się psuje. Postaw spiżarnię.</p></div>`:'')+previousTrouble()}}

{const style=document.createElement('style');style.textContent='@media(pointer:coarse){#sheet button,#ev button,#sel button{min-width:44px;min-height:44px}}';document.head.appendChild(style)}
