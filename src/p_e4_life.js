/* Kanoniczne działania mieszkańców. Zegar symulacji steruje trasą i pozą, nigdy renderer. */
const E4Life=(()=>{
 const world=typeof E4World==='undefined'?require('./p_e4_world.js'):E4World;
 const catalog=typeof E4Catalog==='undefined'?require('./p_e4_catalog.js'):E4Catalog;
 let environment={};
 const workFactor=(state,p)=>p.hp*(p.age>60?.7:1)*(((p.settlementId==='przystan'?state.res:state.e4.settlements[p.settlementId].stock).narz||0)>0?1:((p.settlementId==='przystan'?state.res:state.e4.settlements[p.settlementId].stock).narzk||0)>0?.92:.85);
 const configure=options=>{environment=options||{}};
 const pointCaches=new WeakMap();
 function point(state,settlement,index,radius=7){let cache=pointCaches.get(state.e4.world);if(!cache){cache=new Map();pointCaches.set(state.e4.world,cache)}const key=[settlement.id,settlement.x,settlement.z,index,radius].join(':');if(cache.has(key))return cache.get(key);const angle=index*2.3999632297,distance=radius+Math.floor(index/12)*4;let answer={x:settlement.x,z:settlement.z};for(let n=0;n<8;n++){const x=settlement.x+Math.cos(angle+n*.4)*distance,z=settlement.z+Math.sin(angle+n*.4)*distance;if(world.height(state.e4.world,x,z)>.2){answer={x,z};break;}}cache.set(key,answer);return answer;}
 function fieldPoint(state,settlement,index){
  let cache=pointCaches.get(state.e4.world);if(!cache){cache=new Map();pointCaches.set(state.e4.world,cache)}
  const key=['field',settlement.id,settlement.x,settlement.z,index].join(':');if(cache.has(key))return cache.get(key);
  const angle=index*2.3999632297,distance=15+2*Math.sqrt(index);let answer={x:settlement.x,z:settlement.z};
  for(let attempt=0;attempt<32;attempt++){const direction=angle+attempt*Math.PI/16,x=settlement.x+Math.cos(direction)*distance,z=settlement.z+Math.sin(direction)*distance;if(Math.abs(x)<=192&&Math.abs(z)<=192&&world.height(state.e4.world,x,z)>.2){answer={x,z};break;}}
  cache.set(key,answer);return answer;
 }
 function home(state,person){const settlement=state.e4.settlements[person.settlementId],known=environment.home?.(state,person);if(known)return known;const kind=settlement.buildings.dom_rodowy?'dom_rodowy':settlement.buildings.chata?'chata':null;return kind?site(state,person,kind):{x:settlement.x,z:settlement.z+1.5}}
 function buildingKinds(state,settlement){const kinds=[];for(const [kind,count]of Object.entries(settlement.buildings))for(let i=0;i<count;i++)if(kind!=='schronienie'&&!catalog.buildings[kind]?.crop&&!['pole','ogrodek','zielnik','len'].includes(kind)&&!(settlement.id==='przystan'&&state.bld.some(b=>b.prog>=b.work&&state.e4.legacyMapping?.[b.kind]===kind)))kinds.push(kind);return kinds.concat(settlement.projects.map(p=>p.kind));}
 function site(state,person,kind){const settlement=state.e4.settlements[person.settlementId],known=environment.site?.(state,person,kind);if(known)return known;const keys=buildingKinds(state,settlement),index=Math.max(0,keys.indexOf(kind));const center=point(state,settlement,index,settlement.id==='przystan'?15:7);return{x:center.x,z:center.z+2.5}}
 function route(state,person,target){
  if(environment.route)return environment.route(state,person,target);
  if(Math.hypot(person.x-target.x,person.z-target.z)<.1)return {points:[{x:person.x,z:person.z},target],length:0};
  const length=Math.hypot(person.x-target.x,person.z-target.z),steps=Math.max(1,Math.ceil(length));let clear=true;for(let i=0;i<=steps;i++)if(world.height(state.e4.world,person.x+(target.x-person.x)*i/steps,person.z+(target.z-person.z)*i/steps)<=.15){clear=false;break;}if(clear)return {points:[{x:person.x,z:person.z},target],length};
  return world.route(state.e4.world,person,target);
 }
 function task(state,person,time=state.day){
  const settlement=state.e4.settlements[person.settlementId],stock=settlement.id==='przystan'?state.res:settlement.stock,day=Math.floor(time),choices=[],winter=day%20>=10&&day%20<15;
  const sick=state.people.find(p=>p.id!==person.id&&p.settlementId===person.settlementId&&!p.e4Transport&&p.hp<.6&&p.fam===person.fam);
  if(sick&&person.hp>.6)choices.push({id:'care:'+sick.id,kind:'care',skill:'zbieracz',personId:sick.id,text:'opiekuje się: '+sick.name,target:home(state,sick),work:.5,priority:10});
  const earned={},reserved={};for(const peer of state.people){if(peer.settlementId!==settlement.id)continue;const factor=workFactor(state,peer);if(peer.e4AttendanceDay===day)for(const [key,ticks]of Object.entries(peer.e4Credits||{})){const skill=peer.e4CreditSkills?.[key];earned[key]=(earned[key]||0)+ticks*8/420000*factor*(1+.05*Math.min(5,peer.sk[skill]||0));}const action=peer.e4Action;if(peer!==person&&action?.taskId&&!action.blocked&&action.end>time+1e-9)reserved[action.taskId]=(reserved[action.taskId]||0)+(action.plannedHours||0)*factor*(1+.05*Math.min(5,peer.sk[action.skill]||0));}
  const add=order=>{order.remaining=Math.max(0,order.work-(earned[order.id]||0)-(reserved[order.id]||0));if(order.remaining>.001)choices.push(order);};

  for(const project of settlement.projects)add({id:'project:'+settlement.id+':'+project.kind+':'+project.started,kind:'build',skill:'ciesla',text:'buduje: '+catalog.buildings[project.kind].name.toLowerCase(),target:site(state,person,project.kind),work:project.work-project.progress,priority:project.kind==='pole'&&!settlement.fields.length?10:3});
  if(settlement.id==='przystan')for(const b of state.bld)if(b.prog<b.work||b.proj)add({id:'legacy:'+b.id,kind:'build',skill:'ciesla',text:'kończy budowę w osadzie',target:site(state,person,b.kind),work:Math.max(0,(b.mat||0)-(b.del||0))/6+Math.max(0,b.work-b.prog)*2+(b.proj?Math.max(0,b.proj.work-b.proj.prog)*2:0),priority:4});
  for(const batch of settlement.batches)if(batch.readyAt===null){const recipe=catalog.recipes[batch.recipe];add({id:'batch:'+batch.id,kind:recipe.skill==='kowal'?'forge':recipe.skill==='krawiec'?'sew':'craft',skill:recipe.skill,text:recipe.name.toLowerCase(),target:site(state,person,recipe.building),work:batch.work-batch.progress,priority:3});}
  if(!winter)for(const field of settlement.fields)add({id:'crop:'+settlement.id+':'+field.id,kind:'field',skill:catalog.crops[field.crop].skill,text:'pielęgnuje '+catalog.crops[field.crop].name.toLowerCase(),target:field.x!==undefined?{x:field.x,z:field.z+1}:fieldPoint(state,settlement,settlement.fields.indexOf(field)),work:.6,priority:5});
  for(const trial of settlement.trials)add({id:'experiment:'+settlement.id+':'+trial.crop,kind:'field',skill:'rolnik',text:'prowadzi próby upraw',target:site(state,person,'pole'),work:trial.work-trial.progress,priority:2});
  if(settlement.herd.length)add({id:'herd:'+settlement.id,kind:'care',skill:'hodowca',text:'opiekuje się zwierzętami',target:site(state,person,'zagroda'),work:settlement.herd.length*.1,priority:6});
  for(const capture of settlement.captures||[])add({id:'capture:'+settlement.id+':'+capture.species,kind:'care',skill:'hodowca',text:'oswaja zwierzę',target:site(state,person,'zagroda'),work:capture.work-capture.progress,priority:4});
  if(settlement.buildings.pasieka&&!winter)add({id:'apiary:'+settlement.id,kind:'gather',skill:'zbieracz',text:'dogląda pasieki',target:site(state,person,'pasieka'),work:.4,priority:4});
  const residents=state.people.filter(p=>p.settlementId===settlement.id),need=residents.reduce((sum,p)=>sum+(p.age<3?.3:p.age<12?.6:p.age>55?.8:1),0)*state.e4.dailyFactor,food=catalog.food.reduce((sum,key)=>sum+(stock[key]||0),0),grain=Math.max(10,settlement.fields.filter(f=>f.crop==='zboze').length*2+12),region=world.regionAt(state.e4.world,settlement.x,settlement.z),pool=state.e4.nature[region?.id||'centrum'];
  const raw={drewno:['drwal',60,'timber',3],kamien:['kamieniarz',40,'stone',2],glina:['kamieniarz',30,'clay',3],ruda:settlement.buildings.szyb&&pool?.oreDeep>0?['kamieniarz',settlement.buildings.huta?30:0,'oreDeep',3.75]:['kamieniarz',settlement.buildings.huta?30:0,'ore',1.5],ziarno:['rolnik',winter?0:grain,'wildGrain',3],jagody:['zbieracz',winter||food>=need*8?0:Math.min(40,need*2),'forage',6],ryby:['rybak',food>=need*8?0:Math.min(30,need),'fish',5],ziola:['zbieracz',winter||!settlement.buildings.zielarnia?0:8,'herbs',2]};
  for(const [resource,[skill,minimum,source,rate]]of Object.entries(raw))if((stock[resource]||0)<minimum&&(pool?.[source]??0)>0)add({id:'supply:'+settlement.id+':'+resource,kind:resource==='drewno'?'chop':['kamien','glina','ruda'].includes(resource)?'mine':'gather',skill,text:source==='oreDeep'?'kopie rudę w szybie':'pozyskuje '+catalog.resources[resource].toLowerCase(),target:point(state,settlement,person.id%8,18),work:Math.min(minimum-(stock[resource]||0),pool[source])/rate,priority:food<need*4&&catalog.food.includes(resource)?8:2});
  if(!choices.length)return {kind:'rest',text:'odpoczywa po wykonanej pracy',target:home(state,person)};
  const offset=(person.id+day)%choices.length,score=order=>order.priority+(person.sk[order.skill]||0)*.15-Math.hypot(order.target.x-person.x,order.target.z-person.z)*.035;return choices.slice(offset).concat(choices.slice(0,offset)).sort((a,b)=>score(b)-score(a))[0];
 }
 function choose(state,person,time){
  const hour=((time%1)+1)%1,day=Math.floor(time),settlement=state.e4.settlements[person.settlementId],atHome=home(state,person);
  if(person.hp<.4||person.ill)return {kind:'rest',text:'odpoczywa i wraca do zdrowia',target:atHome,until:day+1};
  if(hour<.23||hour>=.9)return {kind:'sleep',text:'śpi w domu',target:atHome,until:hour<.23?day+.23:day+1.23};
  if(hour<.27)return {kind:'wash',text:'myje się przed pracą',target:point(state,settlement,person.fam,4),until:day+.27};
  if(hour>=.49&&hour<.53)return {kind:'meal',text:'je posiłek z rodziną',target:atHome,until:day+.53};
  if(hour>=.73)return {kind:'family',text:'spędza wieczór z rodziną',target:atHome,until:day+.9};
  const skill=catalog.specialties[settlement.specialization]?.skill||'rolnik',mentor=state.people.filter(p=>p.settlementId===person.settlementId&&!p.e4Transport&&p.hp>.5&&!p.ill&&p.age>=18&&p.age<72).sort((a,b)=>(b.sk[skill]||0)-(a.sk[skill]||0)||a.id-b.id)[0];
  if(hour>=.69&&hour<.73&&mentor&&(person.id===mentor.id||person.age>=8&&person.age<18))return {kind:person.id===mentor.id?'teach':'learn',skill,text:person.id===mentor.id?'przekazuje fach młodszym':'uczy się od: '+mentor.name,target:point(state,settlement,0,4),mentorId:mentor.id,until:day+.73};
  if(person.age<16||person.age>=72)return {kind:'rest',text:person.age<8?'bawi się przy domu':person.age<16?'pomaga rodzinie i bawi się':'odpoczywa przed domem',target:atHome,until:day+(hour<.49?.49:hour<.69?.69:.73)};
  return {...task(state,person,time),until:day+(hour<.49?.49:hour<.69?.69:.73)};
 }
 function begin(state,person,time){
  const previousDay=state.day;state.day=time;const next=choose(state,person,time+1e-9);state.day=previousDay;const path=route(state,person,next.target),speed=(person.age<12?1.6:2.3)*(.6+.4*person.hp)*(person.age>60?.8:1),travel=path?path.length/(speed*240):0;
  const productivity=Math.max(.1,workFactor(state,person))*(1+.05*Math.min(5,person.sk[next.skill]||0)),plannedHours=next.skill?Math.min(2,(next.remaining??next.work??2)/productivity):0,workEnd=plannedHours?time+travel+plannedHours*.42/8:next.until;
  const action={id:person.id+':'+Math.round(time*1e6),kind:next.kind,taskId:next.id||null,skill:next.skill||null,mentorId:next.mentorId??null,personId:next.personId??null,settlementId:person.settlementId,text:next.text,start:time,arrival:time+travel,end:Math.max(time+1e-6,Math.min(next.until,workEnd)),plannedHours,route:path?.points||[],length:path?.length||0,target:next.target,blocked:!path,revision:environment.revision?.()??0,accounted:time};
  person.e4Action=action;return action;
 }
 function advanceSegment(state,from,to){
  for(const person of state.people){if(person.e4Transport)continue;let cursor=from,iterations=0;
   while(cursor<to-1e-10&&iterations++<100){let action=person.e4Action;if(!action||action.settlementId!==person.settlementId||action.end<=cursor+1e-10||(person.hp<.4&&action.kind!=='rest'))action=begin(state,person,cursor);
    if(environment.revision&&action.revision!==environment.revision()){const path=route(state,person,action.target);action.route=path?.points||[];action.length=path?.length||0;action.blocked=!path;action.start=cursor;action.arrival=cursor+(path?.length||0)/(2*240);action.revision=environment.revision();}
    const end=Math.min(to,action.end),duration=action.arrival-action.start;
    if(!action.blocked){let distance=duration>0?Math.min(1,Math.max(0,(end-action.start)/duration))*action.length:action.length;const points=action.route;let position=points[0]||action.target;
     for(let i=1;i<points.length;i++){const first=points[i-1],second=points[i],length=Math.hypot(second.x-first.x,second.z-first.z);if(distance<=length){const ratio=length?distance/length:1;position={x:first.x+(second.x-first.x)*ratio,z:first.z+(second.z-first.z)*ratio};break}distance-=length;position=second;}
     let segment=Math.max(1,action.route.length-1);if(end<action.arrival){let remaining=(end-action.start)/Math.max(1e-9,duration)*action.length;for(let i=1;i<action.route.length;i++){segment=i;remaining-=Math.hypot(action.route[i].x-action.route[i-1].x,action.route[i].z-action.route[i-1].z);if(remaining<=0)break;}}if(action.route.length>1){const a=action.route[segment-1],b=action.route[segment];person.dir=Math.atan2(b.x-a.x,b.z-a.z);}person.x=position.x;person.z=position.z;
    }
    const arrived=!action.blocked&&end>=action.arrival-1e-9;person.state=action.blocked?'idle':!arrived?'move':action.kind==='sleep'?'sleep':['rest','family'].includes(action.kind)?'eve':'work';person.act=action.blocked?'Brak drogi — odblokuj przejście':!arrived?'idzie: '+action.text:action.text;
    action.phase=action.blocked?'blocked':arrived?'doing':'travel';
    if(arrived&&action.skill&&!['teach','learn','meal','wash'].includes(action.kind)){const day=Math.floor(Math.max(action.start,end-1e-9));if(person.e4AttendanceDay!==day){person.e4AttendanceDay=day;person.e4AttendanceTicks=0;person.e4Credits={};person.e4CreditSkills={};}const ticks=Math.max(0,Math.round(end*1e6)-Math.round(Math.max(action.accounted,action.arrival)*1e6));person.e4AttendanceTicks+=ticks;if(action.taskId){person.e4Credits[action.taskId]=(person.e4Credits[action.taskId]||0)+ticks;person.e4CreditSkills[action.taskId]=action.skill;}}

    action.accounted=end;cursor=end;
   }
  }
 }
 function advance(state,from,to){let cursor=from;while(cursor<to-1e-10){for(const person of state.people)if(!person.e4Transport&&(!person.e4Action||person.e4Action.settlementId!==person.settlementId||person.e4Action.end<=cursor+1e-10||(person.hp<.4&&person.e4Action.kind!=='rest')))begin(state,person,cursor);const day=Math.floor(cursor),next=[.23,.27,.49,.53,.69,.73,.9,1].map(t=>day+t).find(t=>t>cursor+1e-10),event=Math.min(Infinity,...state.people.filter(p=>!p.e4Transport).flatMap(p=>[p.e4Action.end,p.e4Action.arrival]).filter(t=>t>cursor+1e-10)),end=Math.min(to,next,event);advanceSegment(state,cursor,end);
  for(const person of state.people){const action=person.e4Action;if(action?.kind==='care'&&action.personId!==null&&!action.careDone&&end>=action.end-1e-10&&action.phase==='doing'){const patient=state.people.find(p=>p.id===action.personId);if(patient&&Math.hypot(patient.x-person.x,patient.z-person.z)<=3){patient.hp=Math.min(1,patient.hp+Math.min(.04,Math.max(0,action.end-action.arrival)*.2));}action.careDone=true;}if(action?.kind!=='learn'||action.lessonDone||end<action.end-1e-10||action.blocked)continue;const mentor=state.people.find(p=>p.id===action.mentorId),teaching=mentor?.e4Action;if(mentor&&mentor.hp>.5&&!mentor.ill&&teaching?.kind==='teach'&&teaching.phase==='doing'&&action.phase==='doing'&&Math.hypot(mentor.x-person.x,mentor.z-person.z)<=3){const duration=Math.max(0,action.end-Math.max(action.arrival,teaching.arrival)),skill=teaching.skill;person.e4MentorId=mentor.id;person.sk[skill]=Math.min(mentor.sk[skill]||0,Math.round(((person.sk[skill]||0)+duration*.2)*1e8)/1e8);}action.lessonDone=true;}
  cursor=end;
 }}
 return {configure,point,fieldPoint,site,home,route,task,choose,advance,buildingKinds};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4Life;
