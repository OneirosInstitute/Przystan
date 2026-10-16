
/* Jedna bramka dla trwałych dostaw i polityki pracy, przed wszystkimi planerami. */
function pendingDelivery(person){return !!(person.kozN||person.carry&&person.carry.length||person.haulQ>0||person.siteQ>0)}
function resumeDelivery(person){
 if(person.kozN)return kozResume(person);
 const site=person.haulB?bById(person.haulB):person.siteB?bById(person.siteB):null;
 if(site&&!bDone(site)&&((person.haulQ||0)>0||(person.siteQ||0)>0)){
  const entry=entryOf(site.kind,site.i,site.j),arrival=person.haulB?'haulDrop':'siteDrop';
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
{const previousPlanner=planJob;planJob=function(person){
 if(pendingDelivery(person))return resumeDelivery(person);
 if(S&&racjeOn('zbior')&&!person.fireB&&isWorker(person)&&isWork()&&!restNow(person)){
  if(choreDo(person,'zbior')||choreDo(person,'ryby'))return true;
  person.act='szuka jedzenia — brak dostępnego zbioru';person.wait=3;return false;
 }
 return previousPlanner(person);
}}
{const previousStep=stepPerson;stepPerson=function(person,dt){
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
