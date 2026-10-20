
/* Trwałość zapisu: walidacja przed zmianą stanu i jawny wynik operacji. */
const saveStatus={ok:null,at:0,error:'',blocked:false,blockedRaw:null,spaceRecovered:false};
let saveDecodeError='';
function saveInvalid(reason){saveDecodeError=reason;return false}
function saveStatusText(){const version='Przystań '+GAME_VER+' · ';return version+(saveStatus.ok===true?'Zapisano w przeglądarce o '+new Date(saveStatus.at).toLocaleTimeString('pl-PL')+'.'+(saveStatus.spaceRecovered?' Zwolniono miejsce zajęte przez dodatkową kopię.':''):saveStatus.ok===false?'Zapis nie działa: '+saveStatus.error+' Pobierz plik awaryjny.':'Oczekiwanie na pierwszy zapis.')}
function updateSaveStatus(){const element=document.getElementById('save-status');if(element)element.textContent=saveStatusText()}
function persistentSpeed(speed,previous=1){return speed===40?([1,2,4,8].includes(previous)?previous:1):speed}
function serializeSave(){
 if(!S)throw new Error('Brak osady');
 const previous=typeof nocSkip!=='undefined'&&nocSkip?nocSkip.prev:1;
 const snapshot=Object.assign({},S,{rev:packRev(),tread:packTread(),ver:GAME_VER,saveSchema:1,mapN:N,speed:persistentSpeed(S.speed,previous)});
 if(S.pendingDecision)snapshot.pendingDecision={...S.pendingDecision,prev:persistentSpeed(S.pendingDecision.prev,previous)};
 return JSON.stringify(snapshot,(key,value)=>['mentor','tgt','navResumeAct','navWait','navRetry'].includes(key)||(key==='path'&&Array.isArray(value))?undefined:value);
}
function saveWarning(error){
 saveStatus.ok=false;saveStatus.error=(error?.name&&error.name!=='Error'?error.name+': ':'')+String(error&&error.message||error);
 updateSaveStatus();
 toast('Nie udało się zapisać gry. Pobierz aktualny zapis do pliku.');
 let warning=document.getElementById('save-warning');
 if(!warning||!warning.dataset.saveWarning){
  warning=document.createElement('button');warning.id='save-warning';warning.dataset.saveWarning='1';
  warning.setAttribute('role','alert');
  warning.style.cssText='position:fixed;top:calc(8px + var(--safe-top));left:8px;right:8px;z-index:20000;padding:12px;background:#702f27;color:#fff;border:2px solid #f0c88c';
  warning.textContent='Zapis nie działa — dotknij, aby pobrać plik awaryjny';
  warning.addEventListener('click',()=>{try{dlFile('przystan-zapis-awaryjny.json',saveStatus.blockedRaw||serializeSave(),'application/json')}catch(error){toast('Nie udało się przygotować pliku zapisu')}});
  document.body.appendChild(warning);
 }
 warning.hidden=false;
}
function saveTreeIssue(value,path='$',depth=0){
 if(depth>18)return path+': zbyt głęboka struktura';
 if(typeof value==='number')return Number.isFinite(value)?'':path+': liczba nie jest skończona';
 if(typeof value==='string')return value.length<=250000&&!/[<>\u0000]/.test(value)?'':path+': niedozwolony lub zbyt długi tekst';
 if(value===null||typeof value==='boolean')return '';
 if(!value||typeof value!=='object')return path+': nieobsługiwany typ';
 if(Array.isArray(value)){if(value.length>N*N)return path+': zbyt długa lista';for(let index=0;index<value.length;index++){const issue=saveTreeIssue(value[index],path+'['+index+']',depth+1);if(issue)return issue}return ''}
 for(const [key,item]of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key)||/[<>"'\u0000]/.test(key))return path+': niedozwolony klucz';const issue=saveTreeIssue(item,path+'.'+key,depth+1);if(issue)return issue}return '';
}
function validSaveTree(value,depth=0){return !saveTreeIssue(value,'$',depth)}
function storeSave(text){
 saveStatus.spaceRecovered=false;
 try{localStorage.setItem(SAVEKEY,text);return}catch(error){
  if(!/quota/i.test(String(error?.name)+' '+String(error?.message)))throw error;
  const primary=localStorage.getItem(SAVEKEY),backup=localStorage.getItem(SAVEKEY+'-bak');
  if(!backup||!decodeSave(primary))throw error;
  localStorage.removeItem(SAVEKEY+'-bak');
  try{localStorage.setItem(SAVEKEY,text);saveStatus.spaceRecovered=true;return}catch(retryError){try{localStorage.setItem(SAVEKEY+'-bak',backup)}catch(restoreError){}throw retryError}
 }
}
function saveDiagnostics(){
 const diagnostic={version:GAME_VER,ok:saveStatus.ok,lastSavedAt:saveStatus.at,error:saveStatus.error,blocked:saveStatus.blocked,day:S?.day,epoch:S?.epoch||1,seed:S?.seed,spaceRecovered:saveStatus.spaceRecovered};
 try{diagnostic.snapshotBytes=new TextEncoder().encode(serializeSave()).length;diagnostic.hasStoredSave=!!localStorage.getItem(SAVEKEY);diagnostic.hasBackup=!!localStorage.getItem(SAVEKEY+'-bak')}catch(error){diagnostic.storageError=String(error?.name)+': '+String(error?.message)}return diagnostic;
}
function validateSave(state){
 const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 const number=value=>typeof value==='number'&&Number.isFinite(value);
 const positive=value=>number(value)&&value>=0;
 const id=value=>Number.isSafeInteger(value)&&value>=0;
 if(!object(state))return saveInvalid('$: brak osady');const treeIssue=saveTreeIssue(state);if(treeIssue)return saveInvalid(treeIssue);if(!positive(state.day)||!positive(state.t))return saveInvalid('day/t: nieprawidłowy czas');
 if(state.saveSchema!==undefined&&state.saveSchema!==1)return saveInvalid('saveSchema: nieobsługiwana wersja');
 if(state.epoch===2&&!Object.hasOwn(PATHS,state.path))return saveInvalid('path: brak drogi rozwoju epoki II');
 if(state.seed!==SEED||!Array.isArray(state.nodeAmt)||state.nodeAmt.length!==nodes.length||!state.nodeAmt.every(positive))return saveInvalid('seed/nodeAmt: inna wyspa lub nieprawidłowe zasoby mapy');
 if(!object(state.fams)||!object(state.res)||!object(state.books)||!object(state.know)||!object(state.alloc)||!object(state.grow))return saveInvalid('fams/res/books/know/alloc/grow: brak wymaganych danych');
 const invalidResource=Object.keys(state.res).find(resource=>!positive(state.res[resource]));if(invalidResource!==undefined)return saveInvalid('res.'+invalidResource+': ujemny lub nieprawidłowy zasób');
 if(!Object.keys(state.res).every(resource=>Object.hasOwn(RN,resource)))return saveInvalid('res: nieznany rodzaj zasobu');
 if(!Array.isArray(state.people)||!Array.isArray(state.bld)||!Array.isArray(state.herds)||!Array.isArray(state.log))return saveInvalid('people/bld/herds/log: brak wymaganej listy');
 if(!object(state.wreck)||!Array.isArray(state.wreck.parts)||state.wreck.parts.length!==WRECK0.length)return saveInvalid('wreck.parts: nieprawidłowy wrak');
 if(!state.wreck.parts.every(part=>object(part)&&object(part.items)&&Object.values(part.items).every(positive)))return saveInvalid('wreck.parts.items: nieprawidłowy ładunek');
 if(!object(state.weather)||!Object.hasOwn(WEATHER,state.weather.k)||!number(state.weather.left))return saveInvalid('weather: nieprawidłowa pogoda');
 if(!state.herds.every(herd=>object(herd)&&Object.hasOwn(ANIMAL,herd.type)&&positive(herd.n)&&positive(herd.max)&&number(herd.x)&&number(herd.z)&&number(herd.tx)&&number(herd.tz)))return saveInvalid('herds: nieprawidłowe stado');
 if(!number(state.speed)||![0,1,2,4,8].includes(state.speed))return saveInvalid('speed: nieobsługiwane tempo');
 const peopleIds=new Set(),buildingIds=new Set();
 for(const building of state.bld){
  const definition=BD[building.kind];
  if(!object(building)||!definition||!id(building.id)||buildingIds.has(building.id))return saveInvalid('bld: nieprawidłowy lub powtórzony budynek');
  buildingIds.add(building.id);
  if(!id(building.i)||!id(building.j)||building.i+definition.w>N||building.j+definition.h>N)return saveInvalid('bld: budynek poza mapą');
  if(!positive(building.prog)||!positive(building.work)||!building.work)return saveInvalid('bld.prog/work: nieprawidłowy postęp');
  if(building.proj&&(!positive(building.proj.prog)||!positive(building.proj.work)||!['rep','lv','ext','rozb','serce'].includes(building.proj.t)))return saveInvalid('bld.proj: nieprawidłowa budowa');
  if(building.proj?.t==='ext'&&!(EXT[building.kind]||[]).some(extension=>extension.id===building.proj.id))return saveInvalid('bld.proj: nieznana rozbudowa');
  if(building.proj?.t==='serce'&&(!Number.isInteger(building.proj.id)||building.proj.id<2||building.proj.id>5))return saveInvalid('bld.proj: nieznany poziom serca');
  if(building.field&&(!object(building.field)||!['puste','rosnie','dojrzale'].includes(building.field.st)))return saveInvalid('bld.field: nieprawidłowy stan uprawy');
 }
 for(const [personIndex,person] of state.people.entries()){
  if(!object(person)||!id(person.id)||peopleIds.has(person.id)||!object(state.fams[person.fam]))return saveInvalid('people: nieprawidłowa tożsamość lub rodzina');
  peopleIds.add(person.id);
  if(typeof person.name!=='string'||person.name.length>100||!positive(person.age)||person.age>250||!number(person.x)||!number(person.z))return saveInvalid('people: nieprawidłowe imię, wiek lub położenie');
  if(!positive(person.hp)||person.hp>1)return saveInvalid('people['+personIndex+'].hp: nieprawidłowe zdrowie');
  if(!['k','m'].includes(person.sex)||!Object.hasOwn(TRAITS,person.trait))return saveInvalid('people['+personIndex+'].sex/trait: nieprawidłowa płeć lub cecha');
  if(person.job!==null&&person.job!==undefined&&!['rob','bud','wb','zwiad','zdun','czyt','wyp'].includes(person.job))return saveInvalid('people.job: nieznana praca');
  if(!object(person.sk)||!object(person.xp)||!Object.values(person.sk).every(positive)||!Object.values(person.xp).every(positive))return saveInvalid('people.sk/xp: nieprawidłowe umiejętności');
  // Woda jest znacznikiem wykonywanej pracy (q=0), a nie zasobem magazynu.
  if(person.carry!==null&&person.carry!==undefined&&(!Array.isArray(person.carry)||!person.carry.every(item=>object(item)&&typeof item.res==='string'&&positive(item.q)&&(Object.hasOwn(RN,item.res)||waterDelivery(person)))))return saveInvalid('people.carry: nieprawidłowy ładunek');
  if(person.chWaterTo!==null&&person.chWaterTo!==undefined&&(!Array.isArray(person.chWaterTo)||person.chWaterTo.length!==2||!person.chWaterTo.every(coordinate=>Number.isInteger(coordinate)&&coordinate>=0&&coordinate<N)))return saveInvalid('people.chWaterTo: nieprawidłowa dostawa wody');
 }
 if(!Array.isArray(state.exps))return saveInvalid('exps: brak listy wypraw');
 const expeditionIds=new Set();for(const expedition of state.exps){if(!object(expedition)||!id(expedition.id)||expeditionIds.has(expedition.id)||!id(expedition.r)||!REGIONS[expedition.r]||!['zwiad','zbior','rejs','horyzont'].includes(expedition.type)||!Array.isArray(expedition.ppl)||!expedition.ppl.every(id)||!number(expedition.days)||expedition.days<=0||expedition.days>3650||!number(expedition.left)||expedition.left>expedition.days||!Array.isArray(expedition.exit)||expedition.exit.length!==2||!expedition.exit.every(value=>id(value)&&value<N))return saveInvalid('exps: nieprawidłowa odprawa');expeditionIds.add(expedition.id);if(expedition.departure&&!expLedgerValid(expedition))return saveInvalid('exps.departure: nieprawidłowa księga opłat');}
 if(!state.people.every(person=>person.pair===null||person.pair===undefined||peopleIds.has(person.pair)))return saveInvalid('people.pair: brak partnera');
 if(!Object.values(state.fams).every(family=>object(family)&&id(family.id)&&(family.sp===undefined||positive(family.sp))&&(family.home===null||family.home===undefined||buildingIds.has(family.home))))return saveInvalid('fams: nieprawidłowy dom lub zapasy');
 if(state.pendingDecision&&(!Object.hasOwn(DECISION_RECOVERY,state.pendingDecision.id)&&!EVENTS.some(event=>event.id===state.pendingDecision.id)))return saveInvalid('pendingDecision.id: nieznane zdarzenie');
 if(state.pendingDecision&&(!object(state.pendingDecision)||typeof state.pendingDecision.id!=='string'||!['choice','result'].includes(state.pendingDecision.phase)))return saveInvalid('pendingDecision: nieprawidłowa decyzja');
 return true;
}
function decodeSave(text){
 try{
  saveDecodeError='';if(typeof text!=='string'||text.length>8*1024*1024){saveInvalid('Plik zapisu jest pusty lub zbyt duży.');return null}
  let state=JSON.parse(text);
  const issue=saveTreeIssue(state);if(issue){saveInvalid(issue);return null}if(!state||!state.fams||!state.people||!state.nodeAmt){saveInvalid('Brak wymaganych danych osady.');return null}
  state=wyMigrate(saveFix(state));
  state.speed=persistentSpeed(state.speed);
  if(state.pendingDecision)state.pendingDecision.prev=persistentSpeed(state.pendingDecision.prev);
  if(state.epoch===2&&!state.path){
   const remembered=Object.keys(PATHS).filter(route=>state.tech&&state.tech['e2_'+route]);
   const branches=Object.keys(ROZ).filter(route=>ROZ[route].o.some(option=>option.id===state.e2?.r1));
   const history=[...(state.kron||[]).map(entry=>entry[1]),...(state.log||[]).map(entry=>entry.t)];
   const recorded=Object.keys(PATHS).filter(route=>history.some(entry=>typeof entry==='string'&&entry.includes('Wiec pokoleń wybiera drogę: '+PATHS[route].n+'.')));
   const candidates=remembered.length===1?remembered:branches.length===1?branches:recorded;
   if(candidates.length===1)state.path=candidates[0];
  }
  return validateSave(state)?state:null;
 }catch(error){saveInvalid('Nie można odczytać zapisu: '+String(error.message));return null}
}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))}
