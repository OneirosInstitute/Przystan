/* Dziennik zadań: te same dane co symulacja, szczegóły dopiero po otwarciu. */
function taskMilestones(){
 if(!S||S.epoch===4)return [];
 let goals=[],completed={},prefix='';
 if(e3On()&&S.e3){goals=E3A[S.e3.a]?.g||[];completed=S.e3.g;prefix=S.e3.a+'_'}
 else if(S.epoch===2&&S.e2){goals=e2Act()?.g||[];completed=S.e2.g;prefix=S.e2.a+'_'}
 else{actInit();goals=ACTS[S.act]?.g||GOALS;completed=S.agoals||{};prefix=S.act+'_'}
 return goals.map((goal,index)=>{let done=!!completed[prefix+index],detail=goal[2]||'';try{done=done||!!goal[1]();if(typeof goal[3]==='function')detail=goal[3]()}catch(error){}
  return {id:'milestone:'+S.epoch+':'+prefix+index,title:goal[0],done,detail};
 });
}
{const previousTasks=taskList;taskList=function(){
 const tasks=previousTasks();if(!S)return tasks;
 for(const task of tasks)if(task.hamletId){const need=S.hamlets.find(hamlet=>hamlet.id===task.hamletId)?.need;if(need){const available=need.k==='jedzenie'?Math.max(0,foodTotal()-20):need.k==='narz'?(S.res.narz||0)+(S.res.narzk||0):S.res[need.k]||0;task.progress=taskPercent(available,need.q);}}
 if(S.epoch!==4){
  const current=goalInfo();for(const goal of taskMilestones())if(!goal.done&&goal.title!==current?.t)tasks.push({id:goal.id,category:'Cel osady',title:goal.title,detail:goal.detail,status:'Do wykonania',progress:null,urgent:false,peopleIds:[],location:taskCampLocation(),action:{tab:HINT[goal.title]?.[0]||'budowa',label:'Przejdź do wykonania'}});
  for(const building of S.bld){if(!bDone(building)||!BD[building.kind].prod)continue;const state=productionSupplyState(building);if(state.mode!=='shortage')continue;
   const workers=S.people.filter(person=>person.job==='wb'&&person.wb===building.id),need=state.needs[0];
   tasks.push({id:'production:'+building.id,category:'Zaopatrzenie',title:'Zaopatrzenie — '+BD[building.kind].n,detail:state.reason,status:workers.some(person=>person.supply)?'Pracownicy pozyskują składniki':workers.length?'Brak składników':'Brak pracowników i składników',urgent:false,progress:need?taskPercent(S.res[need.resource]||0,need.quantity):null,peopleIds:workers.map(person=>person.id),location:taskBuildingLocation(building),action:{tab:state.requiredBuilding?'budowa':'praca',kind:state.requiredBuilding,label:state.requiredBuilding?'Uruchom potrzebne ogniwo':'Sprawdź produkcję'}});
  }
 }
 return tasks;
}}
const previousTaskCard=taskCardHTML;
taskCardHTML=function(task,state){
 const original=previousTaskCard(task,state),titleEnd=original.indexOf('</h4>')+5;
 const expanded=state.expanded?.[task.id]??(state.selected===task.id||state.pinned===task.id);
 const summary=`<summary><span><small>${escapeHtml(task.category)}${state.pinned===task.id?' · śledzone':''}</small><b>${escapeHtml(task.title)}</b><em>${escapeHtml(task.status)}${task.progress!==null?' · '+task.progress+'%':''}</em></span><i aria-hidden="true">⌄</i></summary>`;
 const body=original.slice(titleEnd,original.lastIndexOf('</article>'));
 return `<details class="card task-card${state.selected===task.id?' task-selected':''}" data-task-card="${escapeHtml(task.id)}" ${expanded?'open':''}>${summary}<div class="task-detail">${body}</div></details>`;
};
function taskGoalsHTML(){
 const goals=taskMilestones(),done=goals.filter(goal=>goal.done).length;
 if(!goals.length)return '<p class="mut">Rozwój w tej epoce śledzisz przez budowy, próby i produkcję gospodarstw.</p>';
 return `<section class="task-milestones"><div class="menu-ey">Bieżący akt</div><h3>${done} z ${goals.length} warunków spełnionych</h3><progress max="${goals.length}" value="${done}" aria-label="Postęp aktu"></progress>${goals.map(goal=>`<div class="milestone ${goal.done?'done':''}"><span aria-hidden="true">${goal.done?'✓':'○'}</span><div><b>${escapeHtml(goal.title)}</b><small>${goal.done?'Osiągnięte':escapeHtml(goal.detail)}</small></div></div>`).join('')}</section>`;
}
taskRender=function(){
 const state=taskState(),tasks=taskList(),body=$('body'),scroll=body.scrollTop,filter=state.filter||'all';
 const shown=tasks.filter(task=>filter==='urgent'?task.urgent:filter==='pinned'?task.id===state.pinned:true).sort((first,second)=>(second.id===state.selected)-(first.id===state.selected)||(second.id===state.pinned)-(first.id===state.pinned)||Number(second.urgent)-Number(first.urgent));
 let markup=`<div class="menu-ey">Dziennik osady</div><div class="task-heading"><h3>Każda sprawa ma swój następny krok.</h3><span>${tasks.length} aktywnych</span></div><div class="task-filters">${[['all','Wszystkie'],['urgent','Pilne'],['pinned','Śledzone'],['goals','Cele'],['people','Kto co robi']].map(([key,name])=>`<button data-task-filter="${key}" aria-pressed="${filter===key}">${name}</button>`).join('')}</div>`;
 if(filter==='people')markup+=taskPeopleHTML(S.people.map(person=>person.id));
 else if(filter==='goals')markup+=taskGoalsHTML();
 else markup+=shown.map(task=>taskCardHTML(task,state)).join('')||'<p class="lead">'+(filter==='pinned'?'Otwórz zadanie i wybierz „Śledź zadanie”.':'Brak aktywnych spraw w tej kategorii.')+'</p>';
 markup+='<details class="task-history"><summary>Ostatnio zakończone ('+state.history.length+')</summary>'+state.history.map(entry=>'<p><b>'+escapeHtml(entry.title)+'</b><br>'+escapeHtml(entry.status)+' · dzień '+Math.floor(entry.day+1)+'</p>').join('')+'</details>';
 if(body._taskMarkup!==markup){body.innerHTML=markup;body._taskMarkup=markup;body._h=null}body.scrollTop=scroll;$('stitle').textContent='Zadania';czChips();
};
document.addEventListener('toggle',event=>{const id=event.target.dataset?.taskCard;if(!S||!id)return;const state=taskState();state.expanded||={};state.expanded[id]=event.target.open;const keys=Object.keys(state.expanded);for(const key of keys.slice(0,Math.max(0,keys.length-120)))delete state.expanded[key];},true);
const taskTracker=document.createElement('div');taskTracker.id='task-tracker';taskTracker.hidden=true;$('app').appendChild(taskTracker);let taskTrackerElapsed=1;
function taskTrackerTick(delta){
 taskTrackerElapsed+=delta;if(taskTrackerElapsed<.5)return;taskTrackerElapsed=0;
 const pinned=S?.tasksUI?.pinned,task=pinned&&taskList().find(candidate=>candidate.id===pinned);
 taskTracker.hidden=!task;if(!task)return;
 setH(taskTracker,`<div><small>Śledzone zadanie</small><button data-task-open="${escapeHtml(task.id)}">${escapeHtml(task.title)}</button><span>${escapeHtml(task.status)}${task.progress!==null?' · '+task.progress+'%':''}</span></div><button data-task-locate="${escapeHtml(task.id)}" aria-label="Pokaż cel na mapie">${ico('dom')}</button><button data-task-unpin="1" aria-label="Przestań śledzić">×</button>`);
}
document.addEventListener('click',event=>{if(!event.target.closest('[data-task-unpin]')||!S)return;taskState().pinned=null;taskTrackerElapsed=1;taskTrackerTick(0);save()});
{const previousMap=mapTick;mapTick=function(delta){previousMap(delta);taskTrackerTick(delta)}}
