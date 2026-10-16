
/* Trwałość zapisu: walidacja przed zmianą stanu i jawny wynik operacji. */
const saveStatus={ok:null,at:0,error:'',blocked:false,blockedRaw:null};
function serializeSave(){
 if(!S)throw new Error('Brak osady');
 const snapshot=Object.assign({},S,{rev:packRev(),tread:packTread(),ver:GAME_VER,saveSchema:1});
 return JSON.stringify(snapshot,(key,value)=>['mentor','tgt'].includes(key)||(key==='path'&&Array.isArray(value))?undefined:value);
}
function saveWarning(error){
 saveStatus.ok=false;saveStatus.error=String(error&&error.message||error);
 toast('Nie udało się zapisać gry. Pobierz aktualny zapis do pliku.');
 let warning=document.getElementById('save-warning');
 if(!warning||!warning.dataset.saveWarning){
  warning=document.createElement('button');warning.id='save-warning';warning.dataset.saveWarning='1';
  warning.setAttribute('role','alert');
  warning.style.cssText='position:fixed;top:8px;left:8px;right:8px;z-index:20000;padding:12px;background:#702f27;color:#fff;border:2px solid #f0c88c';
  warning.textContent='Zapis nie działa — dotknij, aby pobrać plik awaryjny';
  warning.addEventListener('click',()=>{try{dlFile('przystan-zapis-awaryjny.json',saveStatus.blockedRaw||serializeSave(),'application/json')}catch(error){toast('Nie udało się przygotować pliku zapisu')}});
  document.body.appendChild(warning);
 }
 warning.hidden=false;
}
function validSaveTree(value,depth=0){
 if(depth>18)return false;
 if(typeof value==='number')return Number.isFinite(value);
 if(typeof value==='string')return value.length<=250000&&!/[<>\u0000]/.test(value);
 if(value===null||typeof value==='boolean')return true;
 if(!value||typeof value!=='object')return false;
 if(Array.isArray(value))return value.length<=N*N&&value.every(item=>validSaveTree(item,depth+1));
 return Object.entries(value).every(([key,item])=>!['__proto__','prototype','constructor'].includes(key)&&!/[<>"'\u0000]/.test(key)&&validSaveTree(item,depth+1));
}
function validateSave(state){
 const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 const number=value=>typeof value==='number'&&Number.isFinite(value);
 const positive=value=>number(value)&&value>=0;
 const id=value=>Number.isSafeInteger(value)&&value>=0;
 if(!object(state)||!validSaveTree(state)||!positive(state.day)||!positive(state.t))return false;
 if(state.saveSchema!==undefined&&state.saveSchema!==1)return false;
 if(state.epoch===2&&!Object.hasOwn(PATHS,state.path))return false;
 if(state.seed!==SEED||!Array.isArray(state.nodeAmt)||state.nodeAmt.length!==nodes.length||!state.nodeAmt.every(positive))return false;
 if(!object(state.fams)||!object(state.res)||!object(state.books)||!object(state.know)||!object(state.alloc)||!object(state.grow))return false;
 if(!Object.values(state.res).every(positive))return false;
 if(!Object.keys(state.res).every(resource=>Object.hasOwn(RN,resource)))return false;
 if(!Array.isArray(state.people)||!Array.isArray(state.bld)||!Array.isArray(state.herds)||!Array.isArray(state.log))return false;
 if(!object(state.wreck)||!Array.isArray(state.wreck.parts)||state.wreck.parts.length!==WRECK0.length)return false;
 if(!state.wreck.parts.every(part=>object(part)&&object(part.items)&&Object.values(part.items).every(positive)))return false;
 if(!object(state.weather)||!Object.hasOwn(WEATHER,state.weather.k)||!number(state.weather.left))return false;
 if(!state.herds.every(herd=>object(herd)&&Object.hasOwn(ANIMAL,herd.type)&&positive(herd.n)&&positive(herd.max)&&number(herd.x)&&number(herd.z)&&number(herd.tx)&&number(herd.tz)))return false;
 if(!number(state.speed)||![0,1,2,4,8].includes(state.speed))return false;
 const peopleIds=new Set(),buildingIds=new Set();
 for(const building of state.bld){
  const definition=BD[building.kind];
  if(!object(building)||!definition||!id(building.id)||buildingIds.has(building.id))return false;
  buildingIds.add(building.id);
  if(!id(building.i)||!id(building.j)||building.i+definition.w>N||building.j+definition.h>N)return false;
  if(!positive(building.prog)||!positive(building.work)||!building.work)return false;
  if(building.proj&&(!positive(building.proj.prog)||!positive(building.proj.work)||!['rep','lv','ext','rozb','serce'].includes(building.proj.t)))return false;
  if(building.proj?.t==='ext'&&!(EXT[building.kind]||[]).some(extension=>extension.id===building.proj.id))return false;
  if(building.proj?.t==='serce'&&(!Number.isInteger(building.proj.id)||building.proj.id<2||building.proj.id>5))return false;
  if(building.field&&(!object(building.field)||!['puste','rosnie','dojrzale'].includes(building.field.st)))return false;
 }
 for(const person of state.people){
  if(!object(person)||!id(person.id)||peopleIds.has(person.id)||!object(state.fams[person.fam]))return false;
  peopleIds.add(person.id);
  if(typeof person.name!=='string'||person.name.length>100||!positive(person.age)||person.age>250||!number(person.x)||!number(person.z))return false;
  if(!['k','m'].includes(person.sex)||!Object.hasOwn(TRAITS,person.trait)||!positive(person.hp)||person.hp>1)return false;
  if(person.job!==null&&person.job!==undefined&&!['rob','bud','wb','zwiad','zdun','czyt','wyp'].includes(person.job))return false;
  if(!object(person.sk)||!object(person.xp)||!Object.values(person.sk).every(positive)||!Object.values(person.xp).every(positive))return false;
  if(person.carry!==null&&person.carry!==undefined&&(!Array.isArray(person.carry)||!person.carry.every(item=>object(item)&&typeof item.res==='string'&&Object.hasOwn(RN,item.res)&&positive(item.q))))return false;
 }
 if(!state.people.every(person=>person.pair===null||person.pair===undefined||peopleIds.has(person.pair)))return false;
 if(!Object.values(state.fams).every(family=>object(family)&&id(family.id)&&(family.sp===undefined||positive(family.sp))&&(family.home===null||family.home===undefined||buildingIds.has(family.home))))return false;
 if(state.pendingDecision&&(!Object.hasOwn(DECISION_RECOVERY,state.pendingDecision.id)&&!EVENTS.some(event=>event.id===state.pendingDecision.id)))return false;
 if(state.pendingDecision&&(!object(state.pendingDecision)||typeof state.pendingDecision.id!=='string'||!['choice','result'].includes(state.pendingDecision.phase)))return false;
 return true;
}
function decodeSave(text){
 try{
  if(typeof text!=='string'||text.length>8*1024*1024)return null;
  let state=JSON.parse(text);
  if(!validSaveTree(state)||!state||!state.fams||!state.people||!state.nodeAmt)return null;
  state=saveFix(state);
  if(state.epoch===2&&!state.path){
   const remembered=Object.keys(PATHS).filter(route=>state.tech&&state.tech['e2_'+route]);
   const branches=Object.keys(ROZ).filter(route=>ROZ[route].o.some(option=>option.id===state.e2?.r1));
   const history=[...(state.kron||[]).map(entry=>entry[1]),...(state.log||[]).map(entry=>entry.t)];
   const recorded=Object.keys(PATHS).filter(route=>history.some(entry=>typeof entry==='string'&&entry.includes('Wiec pokoleń wybiera drogę: '+PATHS[route].n+'.')));
   const candidates=remembered.length===1?remembered:branches.length===1?branches:recorded;
   if(candidates.length===1)state.path=candidates[0];
  }
  return validateSave(state)?state:null;
 }catch(error){return null}
}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))}
