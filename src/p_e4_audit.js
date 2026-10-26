/* Łańcuchy są odczytem katalogu i stanu, bez drugiej symulacji gospodarki. */
const E4Audit=(()=>{
 const catalog=typeof E4Catalog==='undefined'?require('./p_e4_catalog.js'):E4Catalog;
 const domain=typeof E4Domain==='undefined'?require('./p_e4_domain.js'):E4Domain;
 const world=typeof E4World==='undefined'?require('./p_e4_world.js'):E4World;
 const raw={drewno:['Las','timber'],kamien:['Odkrywka kamienia','stone'],ruda:['Złoże rudy','ore'],glina:['Odkrywka gliny','clay'],ziarno:['Dzikie zboże lub pole','wildGrain'],jagody:['Runo leśne','forage'],ryby:['Łowisko','fish'],ziola:['Dzikie zioła lub zielnik','herbs'],mieso:['Polowanie albo hodowla',null],skory:['Polowanie albo hodowla',null],mleko:['Dorosłe kozy w zagrodzie',null],jaja:['Kury w kurniku',null],miod:['Pasieka',null],wosk:['Pasieka',null],pierze:['Kurnik',null],bursztyn:['Wybrzeże',null]};
 function matrix(){
  const result=Object.fromEntries(Object.keys(catalog.resources).map(resource=>[resource,{resource,sources:[],uses:[]} ]));
  const source=(resource,label)=>result[resource]?.sources.push(label),use=(resource,label)=>result[resource]?.uses.push(label);
  for(const [resource,[label]] of Object.entries(raw))source(resource,label);
  for(const crop of Object.values(catalog.crops)){source(crop.resource,crop.name);if(crop.seed)use(crop.seed,'Siew: '+crop.name);}
  for(const [id,recipe] of Object.entries(catalog.recipes)){for(const resource of Object.keys(recipe.input))use(resource,'Przetwarzanie: '+id);for(const resource of Object.keys(recipe.output))source(resource,'Receptura: '+id);}
  for(const [id,building] of Object.entries(catalog.buildings))for(const resource of Object.keys(building.cost))use(resource,'Budowa: '+id);
  for(const resource of catalog.food)use(resource,'Posiłki');for(const resource of Object.keys(catalog.householdUse))use(resource,'Wyposażenie domów');
  for(const resource of ['narz','narzk'])use(resource,'Praca i zużycie narzędzi');for(const resource of ['odziez','leki','ziola'])use(resource,'Ubiór i zdrowie');for(const resource of ['piwo','wino','mpitny'])use(resource,'Karczma');use('opal','Ogrzewanie');use('woz','Transport i przeprowadzki');
  return Object.values(result);
 }
 function contract(){const rows=matrix(),required=new Set([...Object.values(catalog.recipes).flatMap(recipe=>Object.keys(recipe.input)),...Object.values(catalog.buildings).flatMap(building=>Object.keys(building.cost))]),produced=new Set(Object.values(catalog.recipes).flatMap(recipe=>Object.keys(recipe.output)));return {missingSources:rows.filter(row=>required.has(row.resource)&&!row.sources.length).map(row=>row.resource),unusedProducts:rows.filter(row=>produced.has(row.resource)&&!row.uses.length).map(row=>row.resource),unknownRecipes:Object.entries(catalog.recipes).filter(([,recipe])=>Object.keys({...recipe.input,...recipe.output}).some(resource=>!catalog.resources[resource])).map(([id])=>id),rows};}
 function source(state,settlement,resource){
  const region=world.regionAt(state.e4.world,settlement.x,settlement.z),pool=state.e4.nature?.[region?.id||'centrum'];
  const natural=raw[resource];if(natural){if(natural[1]&&pool?.[natural[1]]<=.001)return natural[0]+': zasób wyczerpany. Sprowadź '+catalog.resources[resource].toLowerCase()+' z innej krainy.';return natural[0]+'. Sprawdź pracowników, porę roku i zapas krainy w Naturze.';}
  const crop=Object.values(catalog.crops).find(candidate=>candidate.resource===resource);if(crop)return crop.name+': pole, sadzonki i praca do zbiorów (Natura).';
  const producers=Object.values(catalog.recipes).filter(recipe=>recipe.output[resource]),local=producers.find(recipe=>settlement.buildings[recipe.building]),recipe=local||producers[0];
  return recipe?(local?'Uruchom ':'Zbuduj '+(catalog.buildings[recipe.building]?.name||recipe.building)+' i uruchom ')+recipe.name.toLowerCase()+'. Możesz też dowieźć wyrób z innego ośrodka.':'Zasób z wcześniejszej epoki lub dostawy.';
 }
 function status(state,settlementId){
  const settlement=state.e4.settlements[settlementId];if(!settlement)return [];
  const stock=domain.stock(state,settlementId),results=[];
  for(const [id,recipe] of Object.entries(catalog.recipes)){
   if(!settlement.buildings[recipe.building]||settlement.batches.some(batch=>batch.recipe===id)||Object.entries(recipe.output).every(([resource])=>(stock[resource]||0)>=60))continue;
   const missing=Object.entries(recipe.input).filter(([resource,quantity])=>(stock[resource]||0)+1e-9<quantity).map(([resource,quantity])=>({resource,quantity:quantity-(stock[resource]||0),source:source(state,settlement,resource)}));
   if(missing.length)results.push({id,name:recipe.name,missing});
  }
  return results;
 }
 return {matrix,contract,status,source};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4Audit;
function e4ChainHTML(settlement){const rows=E4Audit.status(S,settlement.id);return uiDisclosure('e4:chains:'+settlement.id,'Co zatrzymuje łańcuchy',rows.length?rows.map(row=>'<div class="card"><h4>'+escapeHtml(row.name)+'</h4>'+row.missing.map(item=>'<p>Brakuje: <b>'+escapeHtml(E4Catalog.resources[item.resource])+' '+fmt(item.quantity)+'</b><br><small>'+escapeHtml(item.source)+'</small></p>').join('')+'</div>').join(''):'<p>W dostępnych pracowniach niczego nie brakuje. Sprawdź kolejki, pracowników i miejsce w magazynie.</p>',false,rows.length?(n=>n===1?'1 pracownia czeka':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?n+' pracownie czekają':n+' pracowni czeka')(rows.length)+' na składniki':'Składniki dostępne lub partia już trwa');}
