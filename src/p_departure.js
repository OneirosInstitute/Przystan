/* Wspólna odprawa i powrót. Księga opłat jest częścią zapisu, cele powrotu tylko chwilowe. */
function expSeaExit(people){const shipyard=S.bld.find(building=>building.kind==='szkutnia'&&bDone(building));return shipyard?workSiteTiles(shipyard).find(tile=>expRouteReady(people,tile))||null:null;}
function expCharge(people,food,boats=0){
 if(!people.length||!Number.isFinite(food)||food<0||foodTotal()+1e-9<food||(S.res.lodz||0)<boats)return null;
 const total=foodTotal(),paid={};let remaining=food;
 const available=FOOD.filter(resource=>(S.res[resource]||0)>0);
 available.forEach((resource,index)=>{const quantity=index===available.length-1?remaining:Math.min(S.res[resource],food*S.res[resource]/total);paid[resource]=quantity;remaining-=quantity;});
 if(Math.abs(remaining)>1e-6||Object.entries(paid).some(([resource,quantity])=>quantity<0||quantity>(S.res[resource]||0)+1e-6))return null;
 for(const [resource,quantity] of Object.entries(paid))S.res[resource]=Math.max(0,S.res[resource]-quantity);
 if(boats){paid.lodz=boats;S.res.lodz-=boats;}
 return {schema:1,food,paid,crew:people.map(person=>({id:person.id,job:person.job||'rob',wb:person.wb??null}))};
}
function expLedgerValid(expedition){
 const ledger=expedition.departure;if(!ledger||ledger.schema!==1||!ledger.paid||Array.isArray(ledger.paid)||!Array.isArray(ledger.crew)||ledger.crew.length!==expedition.ppl.length)return false;
 if(!Number.isFinite(ledger.food)||ledger.food<0||Math.abs(ledger.food-Math.ceil(K*expedition.ppl.length*expedition.days))>1.000001)return false;
 const ids=new Set();for(const person of ledger.crew){if(!Number.isSafeInteger(person.id)||!expedition.ppl.includes(person.id)||ids.has(person.id)||!['rob','bud','kar','wb','zwiad','zdun','czyt'].includes(person.job)||(person.wb!==null&&!Number.isSafeInteger(person.wb)))return false;ids.add(person.id);}
 let food=0;for(const [resource,quantity] of Object.entries(ledger.paid)){if(!Number.isFinite(quantity)||quantity<0)return false;if(FOOD.includes(resource))food+=quantity;else if(resource!=='lodz')return false;}
 const boats=ledger.paid.lodz||0,expected=expedition.type==='rejs'?1:expedition.type==='horyzont'&&!expedition.big?2:0;
 return Math.abs(food-ledger.food)<1e-6&&boats===expected;
}
function expCancelWhy(expedition){if(!expedition||!S.exps.includes(expedition))return 'Wyprawa jest zakończona.';if(expedition.started||S.people.some(person=>person.exp===expedition.id&&person.state==='away'))return 'Załoga już wyruszyła.';if(!expLedgerValid(expedition))return 'Starszy zapis nie zawiera księgi opłat — zwrot nie jest dostępny.';return '';}
function cancelExp(id){
 const expedition=S.exps.find(candidate=>candidate.id===id);if(expCancelWhy(expedition))return false;
 S.exps=S.exps.filter(candidate=>candidate!==expedition);
 for(const [resource,quantity] of Object.entries(expedition.departure.paid))S.res[resource]=(S.res[resource]||0)+quantity;
 for(const record of expedition.departure.crew){const person=S.people.find(candidate=>candidate.id===record.id);if(!person||person.exp!==id)continue;release(person);person.exp=null;person.path=null;person.after=null;person.routeGoal=null;person.state='idle';person.wait=.2;person.job=record.job;person.wb=record.wb;if(person.job==='wb'&&!bById(person.wb)){person.job='rob';person.wb=null;}person.act='przygotowania odwołane';}
 log('Odwołano przygotowanie wyprawy. Zwrócono pobraną żywność i łodzie.');assign();renderPanel();renderSel();save();return true;
}
function expCancelHTML(expedition){const reason=expCancelWhy(expedition);return reason?'<p class="mut">'+escapeHtml(reason)+'</p>':'<button data-exp-cancel="'+expedition.id+'">Odwołaj przygotowania i zwróć zapasy</button>';}
let expReturnSlots=null;
function expSafeReturnSlots(expedition,people){
 const camps=navCampTiles();if(!camps.length)return null;const components=navComponents(walk),home=components[camps[0][1]*N+camps[0][0]],occupied=new Set(S.people.filter(person=>!people.includes(person)&&!['away','sleep'].includes(person.state)).map(person=>tileOf(person.x,person.z).join(':'))),candidates=[];
 for(const center of [expedition.exit,[camp.i,camp.j]])for(let dz=-8;dz<=8;dz++)for(let dx=-8;dx<=8;dx++){const i=center[0]+dx,j=center[1]+dz,key=i+':'+j;if(i<0||j<0||i>=N||j>=N||!walk[j*N+i]||components[j*N+i]!==home||occupied.has(key)||candidates.some(tile=>tile[0]===i&&tile[1]===j))continue;candidates.push([i,j]);}
 candidates.sort((a,b)=>Math.hypot(a[0]-expedition.exit[0],a[1]-expedition.exit[1])-Math.hypot(b[0]-expedition.exit[0],b[1]-expedition.exit[1]));
 if(candidates.length<people.length)return null;return new Map(people.map((person,index)=>[person.id,candidates[index]]));
}
function expReturn(person,expedition){const tile=expReturnSlots?.get(person.id);if(!tile)throw Error('Brak sprawdzonego miejsca powrotu');release(person);person.job='rob';person.exp=null;person.state='idle';person.x=tcx(tile[0]);person.z=tcx(tile[1]);person.path=null;person.after=null;person.routeGoal=null;person.navWait=0;person.navResumeAct=null;person.wait=.2;}
const departureFinish=finishExp;
finishExp=function(expedition,people){
 if(!S.exps.includes(expedition))return false;
 const slots=expSafeReturnSlots(expedition,people);if(!slots){expedition.returnBlocked='Powrót czeka na bezpieczne miejsce przy osadzie — odblokuj przejście.';expedition.left=0;return false;}
 expReturnSlots=slots;delete expedition.returnBlocked;try{departureFinish(expedition,people);return true;}finally{expReturnSlots=null;}
};
document.addEventListener('click',event=>{const control=event.target.closest('[data-exp-cancel]');if(control&&S){event.preventDefault();cancelExp(Number(control.dataset.expCancel));}},true);
