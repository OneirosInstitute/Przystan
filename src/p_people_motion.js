function dailyPropGeo(kind){return mdG('daily:'+kind,()=>kind==='book'?mdMerge([[new THREE.BoxGeometry(.18,.025,.13),0x5a3c28,mdM(0,-.17,.11)],[new THREE.BoxGeometry(.16,.018,.115),0xd8ccb0,mdM(0,-.15,.11)]]):mdMerge([[new THREE.CylinderGeometry(.075,.045,.055,10,1,true),0x8a5d39,mdM(0,-.17,.08)],[new THREE.CircleGeometry(.067,10),0xb18b52,mdM(0,-.148,.08,-Math.PI/2)]]));}
/* Poza wynika z działania. Dystans steruje krokiem, czas gry gestem pracy. */
function personMotion(p){
 if(S.epoch===4)return p.e4Action?.phase==='doing'?p.e4Action.kind:p.state==='move'?'walk':'rest';
 if(p.carry)return 'carry';if(p.state==='move')return 'walk';if(p.state==='sleep')return 'sleep';if(p.state==='eve')return p.eveK==='bania'?'wash':'family';
 if(p.state!=='work')return 'rest';const k=p.workKind;
 if(k==='rytm')return p.ryK==='wash'?'wash':'meal';if(k==='read'||k==='zdun')return 'read';if(k==='care'||k==='tame')return 'care';if(k==='field'||k==='plant')return 'field';if(k==='build'||k==='wreck')return 'build';
 const tool=toolFor(p);return {siekiera:'chop',kilof:'mine',sierp:'field',lopata:'field',wedka:'fish',luk:'hunt',kosz:'gather'}[tool]||(k==='prod'&&(BD[bById(p.wb)?.kind]?.c==='kowal')?'forge':k==='prod'&&BD[bById(p.wb)?.kind]?.c==='krawiec'?'sew':'craft');
}
function animatePerson(p,m,rdt){
 const u=m.userData;const winter=isWinterNow();if(u.p18){personWinter(m,winter);const tool=p.carry?null:toolFor(p);if(tool){if(!u.tool){u.tool=new THREE.Mesh(toolGeo(tool),MD.mat);(u.elbowR||u.aR).add(u.tool)}if(u.toolK!==tool){u.tool.geometry=toolGeo(tool);u.toolK=tool}u.tool.visible=true;}else if(u.tool)u.tool.visible=false;}
 const position={x:p.x,z:p.z},distance=u.lastPosition?Math.hypot(p.x-u.lastPosition.x,p.z-u.lastPosition.z):0;u.lastPosition=position;
 if(S.speed===0&&u.poseReady)return;
 const poseParts=u.poseParts||(u.poseParts=[u.torso,u.lL,u.lR,u.aL,u.aR,u.kneeL,u.kneeR,u.elbowL,u.elbowR].filter(Boolean)),pose=u.poseValues||(u.poseValues=new Float32Array(poseParts.length*6)),blendPose=!!u.poseReady;
 poseParts.forEach((part,index)=>{const offset=index*6;pose[offset]=part.rotation.x;pose[offset+1]=part.rotation.y;pose[offset+2]=part.rotation.z;pose[offset+3]=part.position.x;pose[offset+4]=part.position.y;pose[offset+5]=part.position.z;});
 const mode=personMotion(p),walking=p.state==='move'&&distance>.00001,dt=rdt*S.speed;u.motionTime=(u.motionTime||0)+dt;u.stride=(u.stride||0)+distance/(p.age<12?.6:.95)*Math.PI*2;
 const phase=u.stride||0,swing=walking?Math.sin(phase)*.5:0,beat=Math.sin(u.motionTime*5+p.id),bend=walking?Math.abs(Math.sin(phase))*.014:0,old=p.age>60;
 let direction=p.dir??m.rotation.y;if(walking){let difference=((direction-m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;m.rotation.y+=difference*Math.min(1,dt*9);}else if(p.tgt?.x!==undefined){const target=Math.atan2(p.tgt.x-p.x,p.tgt.z-p.z),difference=((target-m.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;m.rotation.y+=difference*Math.min(1,dt*7);}
 u.lL.rotation.set(swing,0,0);u.lR.rotation.set(-swing,0,0);u.aL.rotation.set(-swing*.65,0,-.06);u.aR.rotation.set(swing*.65,0,.06);u.torso.rotation.set(old?.08:0,0,walking?Math.sin(phase)*.025:0);
 u.torso.position.y=.5+bend;u.aL.position.y=u.aR.position.y=.76+bend;u.lL.position.y=u.lR.position.y=.5;
 if(u.kneeL){u.kneeL.rotation.x=walking?Math.max(0,-Math.sin(phase))*.65:0;u.kneeR.rotation.x=walking?Math.max(0,Math.sin(phase))*.65:0;u.elbowL.rotation.x=u.elbowR.rotation.x=-.1;}
 if(!walking){
  if(['family','rest','meal','read','learn','sleep'].includes(mode)&&p.age>=6){u.lL.rotation.x=u.lR.rotation.x=-1.15;if(u.kneeL)u.kneeL.rotation.x=u.kneeR.rotation.x=1.25;u.torso.position.y=.34;u.aL.position.y=u.aR.position.y=.6;u.lL.position.y=u.lR.position.y=.34;u.aL.rotation.x=-.45;u.aR.rotation.x=-.45;}
  if(mode==='meal'){u.aR.rotation.x=-.9+beat*.3;if(u.elbowR)u.elbowR.rotation.x=-.9;}
  if(mode==='read'||mode==='learn'||mode==='teach'){u.aL.rotation.x=-.8;u.aR.rotation.x=-.85;if(u.elbowR)u.elbowR.rotation.x=-.5;}
  if(mode==='chop'||mode==='mine'||mode==='build'||mode==='forge'){const power=mode==='forge'?.45:.8;u.aR.rotation.x=-1.1+beat*power;u.aL.rotation.x=mode==='chop'?u.aR.rotation.x:-.4;u.torso.rotation.x=.1+Math.max(0,beat)*.13;if(u.elbowR)u.elbowR.rotation.x=-.25-Math.max(0,-beat)*.5;}
  if(['field','gather','care'].includes(mode)){u.torso.rotation.x=.25+beat*.08;u.aR.rotation.x=-.7+beat*.25;u.aL.rotation.x=-.35;if(u.elbowR)u.elbowR.rotation.x=-.4;}
  if(mode==='sew'){u.aL.rotation.x=-.7;u.aR.rotation.x=-.8+beat*.09;if(u.elbowR)u.elbowR.rotation.x=-.7;}
  if(mode==='wash'){u.aL.rotation.x=-1.5+beat*.15;u.aR.rotation.x=-1.5-beat*.15;}
  if(mode==='craft'||mode==='fish'||mode==='hunt'){u.aL.rotation.x=-.6;u.aR.rotation.x=-.8+beat*.18;}
 }
 u.carry.visible=!!p.carry;if(p.carry){u.aL.rotation.x=u.aR.rotation.x=-.8;u.carry.position.set(0,.72+bend,.25);if(u.elbowR)u.elbowL.rotation.x=u.elbowR.rotation.x=-.65;const item=p.carry[0];if(item)u.carry.material.color.set({drewno:0x8a6a40,ruda:0x777174,kamien:0x8c8a80,glina:0xa9683c,jagody:0x8a3a55,deski:0xb08a55,plotno:0xc9bda0}[item.res]||0x888888);}
 // Stopy podążają za lokalnym nachyleniem bez przesuwania pozycji osoby.
 if(u.kneeL&&walking){const half=.14*Math.cos(m.rotation.y),left=Hy(p.x-half,p.z),right=Hy(p.x+half,p.z),base=Hy(p.x,p.z);u.lL.position.y=.5+clamp((left-base)/m.scale.y,-.06,.06);u.lR.position.y=.5+clamp((right-base)/m.scale.y,-.06,.06);}
 if(u.head){const targetY=u.torso.position.y-.5;u.head.position.y=targetY;u.head.rotation.x=mode==='read'||mode==='learn'||mode==='meal'?.1:old?.045:0;}
 if(u.p18){const prop=['meal','read','learn','teach'].includes(mode)&&!walking&&!p.carry?(mode==='meal'?'bowl':'book'):null;if(prop){if(!u.dailyProp){u.dailyProp=new THREE.Mesh(dailyPropGeo(prop),MD.mat);(u.elbowL||u.aL).add(u.dailyProp);}if(u.dailyPropKind!==prop){u.dailyProp.geometry=dailyPropGeo(prop);u.dailyPropKind=prop;}u.dailyProp.visible=true;}else if(u.dailyProp)u.dailyProp.visible=false;}
 if(blendPose){const alpha=1-Math.exp(-Math.min(.1,Math.max(0,dt))*14);poseParts.forEach((part,index)=>{const offset=index*6;part.rotation.set(pose[offset]+(part.rotation.x-pose[offset])*alpha,pose[offset+1]+(part.rotation.y-pose[offset+1])*alpha,pose[offset+2]+(part.rotation.z-pose[offset+2])*alpha);part.position.set(pose[offset+3]+(part.position.x-pose[offset+3])*alpha,pose[offset+4]+(part.position.y-pose[offset+4])*alpha,pose[offset+5]+(part.position.z-pose[offset+5])*alpha);});if(u.head)u.head.position.y=u.torso.position.y-.5;}
 u.motionMode=mode;u.poseReady=true;
}
{const previousCard=ludCard;ludCard=function(person){
 const activity=personActivity(person),location=taskPersonLocation(person);
 const cargo=activity.cargo.length?'<p>Niesie: '+activity.cargo.map(item=>escapeHtml(RN[item.res]||item.res)+' '+fmt(item.q)).join(', ')+'</p>':'';
 const assignment=activity.building?'<p class="mut">Przydział: '+escapeHtml(activity.building)+'</p>':'';
 const station=activity.station?'<p class="mut">'+(activity.phase==='travel'?'Stanowisko zarezerwowane; jest w drodze.':'Jest przy stanowisku pracy.')+'</p>':'';
 const daily=S.epoch===4?'<details><summary>Dobowy przydział gospodarczy</summary><p class="mut">'+escapeHtml(person.e4LastWork?.activity||'Jeszcze bez rozliczonej pracy')+' · '+(person.e4Labor||0).toFixed(1)+' h. Gospodarstwo rozlicza produkcję na koniec doby.</p></details>':'';
 return '<div class="card"><h4>Teraz · '+escapeHtml(activity.label)+'</h4><p>'+escapeHtml(activity.reason)+'</p><p class="mut">Miejsce: '+escapeHtml(location.label)+'</p>'+assignment+station+cargo+daily+'</div>'+previousCard(person);
};}
