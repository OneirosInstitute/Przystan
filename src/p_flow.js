/* Obserwacja rzeczywistych ruchów magazynowych; żadnych prognoz ani zmian zasobów. */
const ResourceFlow=(()=>{
 const observers=new WeakMap(),proxies=new WeakMap();
 const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
 const safeKey=key=>typeof key==='string'&&/^[a-zA-Z0-9:_-]{1,80}$/.test(key)&&!['__proto__','prototype','constructor'].includes(key);
 const amount=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=1e15;
 function valid(ledger,day){
  if(!object(ledger)||ledger.schema!==1||!object(ledger.centers)||Object.keys(ledger.centers).length>160)return false;
  return Object.entries(ledger.centers).every(([key,center])=>safeKey(key)&&object(center)&&Array.isArray(center.bins)&&center.bins.length<=2&&center.bins.every(bin=>object(bin)&&Number.isInteger(bin.day)&&bin.day>=0&&bin.day<=Math.floor(day)&&amount(bin.since)&&bin.since>=bin.day&&bin.since<=bin.day+1&&['produced','used','incoming','outgoing'].every(kind=>object(bin[kind])&&Object.keys(bin[kind]).length<=160&&Object.entries(bin[kind]).every(([resource,quantity])=>safeKey(resource)&&amount(quantity)))));
 }
 function ledger(state){if(!valid(state.resourceFlow,state.day))state.resourceFlow={schema:1,centers:{}};return state.resourceFlow;}
 function binFor(state,centerId,day=Math.floor(state.day)){
  const data=state.resourceFlow,center=data.centers[centerId]??={bins:[]};
  center.bins=center.bins.filter(bin=>bin.day>=Math.floor(state.day)-1&&bin.day<=Math.floor(state.day));
  let bin=center.bins.find(item=>item.day===day);
  if(!bin){bin={day,since:Math.max(day,Math.min(state.day,day+1)),produced:{},used:{},incoming:{},outgoing:{}};center.bins.push(bin);center.bins.sort((a,b)=>a.day-b.day)}
  return bin;
 }
 function record(state,centerId,key,delta){
  if(!safeKey(key)||!Number.isFinite(delta)||Math.abs(delta)<1e-12)return;
  const observer=observers.get(state);if(!observer)return;
  const context=observer.context||{mode:'other'},day=context.day??Math.floor(state.day),bin=binFor(state,centerId,day);if(context.completedDay)bin.complete=true;
  const add=(kind,quantity)=>{bin[kind][key]=(bin[kind][key]||0)+quantity};
  if(context.mode==='refund'&&delta>0){const restored=Math.min(bin.used[key]||0,delta);bin.used[key]=(bin.used[key]||0)-restored;if(delta>restored)add('incoming',delta-restored);return}
  const economic=context.mode==='economy'||context.mode==='refund';
  add(economic?(delta>0?'produced':'used'):(delta>0?'incoming':'outgoing'),Math.abs(delta));
 }
 function watchStock(state,centerId,stock){
  if(!object(stock))return stock;
  if(proxies.get(stock)?.state===state&&proxies.get(stock).centerId===centerId)return stock;
  const proxy=new Proxy(stock,{set(target,key,value){const previous=Number(target[key]||0),success=Reflect.set(target,key,value);if(success&&typeof value==='number')record(state,centerId,key,value-previous);return success},deleteProperty(target,key){const previous=target[key],success=Reflect.deleteProperty(target,key);if(success&&typeof previous==='number')record(state,centerId,key,-previous);return success}});
  proxies.set(proxy,{state,centerId});return proxy;
 }
 function watch(state){
  if(!observers.has(state))return;
  if(!object(state.resourceFlow)||state.resourceFlow.schema!==1)state.resourceFlow={schema:1,centers:{}};
  state.res=watchStock(state,'przystan',state.res);binFor(state,'przystan');
  for(const settlement of Object.values(state.e4?.settlements||{}))if(settlement.id!=='przystan'&&safeKey(settlement.id)){settlement.stock=watchStock(state,settlement.id,settlement.stock);binFor(state,settlement.id)}
 }
 function attach(state,{reset=false}={}){
  if(!state||!object(state.res)||!Number.isFinite(state.day))return;
  if(reset)state.resourceFlow={schema:1,centers:{}};else ledger(state);
  if(!observers.has(state))observers.set(state,{context:null});watch(state);
 }
 function run(state,mode,operation,day){
  const observer=observers.get(state);if(!observer)return operation();
  watch(state);const previous=observer.context;observer.context={mode,day:day??previous?.day,completedDay:day!==undefined||previous?.completedDay};
  try{return operation()}finally{observer.context=previous}
 }
 function stats(state,centerId,resources){
  watch(state);const keys=Array.isArray(resources)?resources:[resources],bins=state.resourceFlow?.centers?.[centerId]?.bins||[];
  const sum=kind=>bins.reduce((total,bin)=>total+keys.reduce((value,key)=>value+(bin[kind][key]||0),0),0);
  const produced=sum('produced'),used=sum('used'),other=sum('incoming')-sum('outgoing'),since=bins.length?Math.min(...bins.map(bin=>bin.complete?bin.day:bin.since)):state.day,elapsed=Math.max(0,state.day-since),rate=value=>elapsed>1e-9?value/elapsed:0;
  return {produced,used,other,elapsed,productionRate:rate(produced),useRate:rate(used),otherRate:rate(other),netRate:rate(produced-used+other)};
 }
 return {attach,run,stats,watch};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=ResourceFlow;
