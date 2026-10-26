/* Pracownik zachowuje warsztat; brak składników uruchamia fizyczne zaopatrzenie. */
const SUPPLY_NODES={drewno:['tree'],kamien:['rock'],glina:['clay'],ruda:['ruda'],ziarno:['zboze'],wlokna:['len'],ziola:['ziola'],jagody:['bush'],grzyby:['grzyb'],ryby:['fish'],miod:['ul']};
function productionSupplyRecipes(building){
 return [].concat(BD[building.kind].prod||[]).filter(recipe=>['ready','shortage'].includes(productionPolicy(building,recipe).mode));
}
function productionSupplyState(building){
 const recipes=productionSupplyRecipes(building),needs=[],blockers=[];let requiredBuilding=null;
 if(!recipes.length){const policies=[].concat(BD[building.kind].prod||[]).map(recipe=>productionPolicy(building,recipe)),blocked=policies.find(policy=>policy.mode==='blocked');return {mode:blocked?'blocked':'covered',needs,reason:blocked?.reason||'Osiągnięty docelowy zapas.'};}
 if(productionReady(building))return {mode:'ready',needs,reason:'Składniki gotowe do produkcji.'};
 const resolve=(resource,quantity,chain=[])=>{
  if((S.res[resource]||0)>=quantity)return;
  if(SUPPLY_NODES[resource]){needs.push({resource,quantity,chain});return}
  if(chain.includes(resource)||chain.length>=4){blockers.push('Zatrzymany łańcuch: '+RN[resource]+'.');return}
  const producers=S.bld.filter(candidate=>bDone(candidate)&&[].concat(BD[candidate.kind].prod||[]).some(recipe=>recipe.out[resource]));
  if(!producers.length){const kind=BKEYS.find(key=>[].concat(BD[key].prod||[]).some(recipe=>recipe.out[resource]))||{skory:'mysliwy',mieso:'mysliwy',mleko:'zagroda',warzywa:'pole'}[resource];requiredBuilding||=kind;blockers.push('Potrzeba: '+RN[resource]+'. '+(kind?'Uruchom '+BD[kind].n.toLowerCase()+'.':'Ten zasób wymaga hodowli, uprawy lub wyprawy.'));return}
  const producer=producers[0],recipe=[].concat(BD[producer.kind].prod).find(candidate=>candidate.out[resource]);
  const shortages=Object.entries(recipe.in).filter(([key,amount])=>(S.res[key]||0)<amount);
  if(!shortages.length){blockers.push('Czeka na '+RN[resource].toLowerCase()+': '+BD[producer.kind].n+'. Sprawdź przydział pracy i próg produkcji.');return}
  for(const [key,amount]of shortages)resolve(key,amount,[...chain,resource]);
 };
 const recipe=recipes[0];
 for(const [resource,quantity]of Object.entries(recipe.in))resolve(resource,quantity+(recipe.reserve?.()[resource]||0));
 return {mode:'shortage',needs,requiredBuilding,reason:needs.length?'Brakuje: '+needs.map(need=>RN[need.resource].toLowerCase()).join(', ')+'.':blockers.join(' ')||'Warunki produkcji jeszcze niespełnione.'};
}
function productionSupportJob(person){
 const building=bById(person.wb);if(!building||!BD[building.kind].prod)return false;
 const state=productionSupplyState(building);delete person.supply;person.chK=null;person.limC=false;
 if(state.mode==='ready')return false;
 if(state.mode==='covered')return limChore(person,'zapas');
 if(state.mode==='blocked'){person.state='idle';person.wait=4;person.act=state.reason;return true;}
 const center=bCenter(building),candidates=[];
 for(const need of state.needs)for(const type of SUPPLY_NODES[need.resource])for(const node of nodeBy[type]||[]){
  if(!mkUsable(node)||node.claim>=1||node.bad>S.t||mkWhy(node)||seasonYield(type)<=0)continue;
  const tile=mkStand(node);if(!revAt(tile[0],tile[1])||Math.hypot(node.x-center.x,node.z-center.z)>36)continue;
  candidates.push({node,need,distance:Math.hypot(node.x-person.x,node.z-person.z)});
 }
 candidates.sort((first,second)=>first.distance-second.distance);
 for(const {node,need}of candidates.slice(0,12)){
  const tile=nearestWalk(...mkStand(node));if(!tile||!go(person,tile,'mark',node))continue;
  node.claim++;person.mkAuto=true;person.supply={building:building.id,resource:need.resource,node:node.id};
  person.act='zaopatrzenie '+BD[building.kind].n.toLowerCase()+': zbiera '+RN[need.resource].toLowerCase();return true;
 }
 person.state='idle';person.wait=4;
 person.act=state.needs.length?'Zaopatrzenie: brak osiągalnego źródła — '+state.needs.map(need=>RN[need.resource].toLowerCase()).join(', ')+'. Odkryj zasoby lub odblokuj ich pozyskiwanie.':state.reason;
 return true;
}
function supplyShouldReturn(person){const building=bById(person.wb);return person.job!=='wb'||!building||person.supply?.building!==building.id||productionSupplyState(building).mode!=='shortage'}
{const previousStep=stepPerson;stepPerson=function(person,delta){
 if(person.supply&&!pendingDelivery(person)&&S?.epoch!==4){
  if(supplyShouldReturn(person)){release(person);person.path=null;person.state='idle';person.wait=0;delete person.supply;return previousStep(person,delta)}
  if(person.state==='work'&&person.workKind==='mark'&&isWork()&&!person.fireB)return previousStep(person,delta*.55);
 }
 return previousStep(person,delta);
}}
function productionPolicyHTML(building){const activity=workshopActivity(building),state=activity.policy,workers=S.people.filter(person=>person.job==='wb'&&person.wb===building.id),gathering=workers.filter(person=>person.supply).length;
 return '<p class="mut">Cele: '+[].concat(BD[building.kind].prod).map(recipe=>Object.keys(recipe.out).map(key=>RN[key]).join(' i ')+': '+(recipeTarget(building,recipe)||'bez limitu')).join(' · ')+'</p><small style="color:var(--gold);text-transform:uppercase;letter-spacing:.08em">Rytm pracowni</small><p><b>'+escapeHtml(activity.label)+'</b>'+ (gathering?' · '+gathering+' '+plW(gathering,'osoba pozyskuje','osoby pozyskują','osób pozyskuje')+' składniki':'')+'</p><p class="mut">'+escapeHtml(activity.reason)+'</p>'+(state.needs.length?'<p class="mut">'+state.needs.map(need=>RN[need.resource]+': '+fmt(S.res[need.resource]||0)+' / '+need.quantity).join(' · ')+'</p>':'')+workshopPeopleHTML(building)+'<p class="mut">Brak składników → pozyskiwanie i dowóz. Pełny zapas → pomoc osadzie. Zaopatrzenie: 55% zwykłego tempa zbioru przy tych samych umiejętnościach.</p>';
}
{const previousSelection=renderSel;renderSel=function(){previousSelection();if(!S||S.epoch===4||selB===null)return;const building=bById(selB);if(!building||!bDone(building)||!BD[building.kind].prod)return;
 const selection=$('sel');let policy=selection.querySelector('.production-policy');if(!policy){policy=document.createElement('div');policy.className='production-policy';selection.querySelector('h4')?.insertAdjacentElement('afterend',policy)}if(policy)setH(policy,productionPolicyHTML(building));
}}
