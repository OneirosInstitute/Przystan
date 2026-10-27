/* Jedna zewnętrzna bramka priorytetów; dawne fachy zachowują swoje wykonanie. */
{const legacyPlanner=planJob;planJob=function(person){
 if(pendingDelivery(person))return resumeDelivery(person);
 if(person.supply)delete person.supply;
 delete person.blocked;
 if(S?.e4Preparing){person.state='idle';person.wait=1;person.act='czeka na Wiec Rodów';return false;}
 if(S&&!person.fireB&&isWorker(person)&&restNow(person)){release(person);person.path=null;restSpot(person);return true;}
 if(S&&racjeOn('zbior')&&!person.fireB&&isWorker(person)&&isWork()&&!racjeKeeps(person)){
  if(choreDo(person,'zbior')||choreDo(person,'ryby')){person.act='przednówek: '+person.act;return true}
  person.act='szuka jedzenia — brak dostępnego zbioru';person.wait=3;return false;
 }
 const planned=legacyPlanner(person);if(!planned&&person.blocked)person.act=person.blocked.reason;return planned;
}}
{const legacyStep=stepPerson;stepPerson=function(person,delta){
 if(S?.epoch!==4&&!pendingDelivery(person)){
  const reason=workSiteCheck(person);
  if(reason){release(person);person.path=null;person.state='idle';person.wait=0;person.wt=0;person.act=reason;}
 }
 return legacyStep(person,delta);
}}
/* Odczyt kanonicznego działania: ten sam opis w osobie, pracowni i Zadaniach. */
function personActivity(person){
 const phases={travel:'W drodze',working:'Pracuje',waiting:'Czeka',rest:'Odpoczywa',away:'Poza osadą'},action=person.e4Action;
 let phase='rest',reason=person.act||'odpoczywa',destination=null;
 if(S.epoch===4){
  if(person.e4Transport){phase='travel';reason=person.act||'przewozi ładunek';}
  else if(action){phase=action.phase==='travel'?'travel':action.phase==='doing'?(['sleep','rest','family','meal','wash'].includes(action.kind)?'rest':'working'):'waiting';if(action.blocked)reason='Brak drogi do celu';destination=action.target?{x:action.target.x,z:action.target.z}:null;}
 }else{
  if(person.state==='move'){
   phase=person.navWait>0?'waiting':'travel';if(person.routeGoal)destination={x:tcx(person.routeGoal[0]),z:tcx(person.routeGoal[1])};
   if(person.navWait>0)reason=person.act;
   else if(restNow(person)&&!person.fireB&&!pendingDelivery(person))reason='wraca na odpoczynek, aby odzyskać zdrowie';
   else if(workSiteManaged(person.tgt,person.after))reason='idzie do stanowiska: '+BD[person.tgt.kind].n.toLowerCase();
   else if(person.supply&&person.after==='mark')reason='idzie po '+(RN[person.supply.resource]||person.supply.resource).toLowerCase()+' dla pracowni';
  }
  else if(person.state==='work')phase='working';
  else if(person.state==='away')phase='away';
  else if(person.blocked){phase='waiting';reason=person.blocked.reason;}
  else if(person.job==='wb'&&isWork()&&!restNow(person)&&person.state==='idle')phase='waiting';
 }
 const building=person.job==='wb'?bById(person.wb):person.tgt?.kind?person.tgt:null;
 return {phase,label:phases[phase],reason,destination,buildingId:building?.id??null,building:building?BD[building.kind].n:null,station:workSiteManaged(person.tgt,person.after||person.workKind)&&workSiteActive(person)?person.routeGoal?.slice()||null:null,cargo:person.carry||[]};
}
function personActivityText(person){const activity=personActivity(person);return activity.label+' · '+activity.reason;}
function workshopActivity(building){
 const policy=productionSupplyState(building),people=S.people.filter(person=>person.job==='wb'&&person.wb===building.id);
 const working=people.some(person=>person.state==='work'&&person.workKind==='prod'&&person.tgt===building),supplying=people.some(person=>person.supply?.building===building.id);
 const blocked=people.find(person=>person.state==='idle'&&person.blocked?.buildingId===building.id);
 let label={ready:working?'Produkcja':'Gotowe do produkcji',shortage:supplying?'Zaopatrzenie':'Brak składników',covered:'Prace wspólne',blocked:'Produkcja wstrzymana'}[policy.mode],reason=policy.reason;
 if(!people.length){label='Brak obsady';reason='Przydziel pracowników w Ludzie → Praca.';}
 else if(!working&&!supplying&&blocked){label='Oczekiwanie na stanowisko';reason=personActivity(blocked).reason;}
 return {label,reason,policy,peopleIds:people.map(person=>person.id)};
}
function workshopPeopleHTML(building){
 const people=S.people.filter(person=>person.job==='wb'&&person.wb===building.id);
 return people.length?uiDisclosure('workshop:'+building.id+':people','Wykonawcy i miejsca',people.map(person=>{const activity=personActivity(person),location=taskPersonLocation(person);return '<p><b>'+escapeHtml(person.name)+'</b> · '+escapeHtml(personActivityText(person))+'<br><small>'+escapeHtml(location.label)+(activity.station?(activity.phase==='travel'?' · w drodze do stanowiska':' · przy stanowisku'):'')+'</small> <button data-task-person="'+person.id+'">Pokaż osobę</button></p>';}).join(''),false,people.length+' osób'):'';
}
