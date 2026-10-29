
/* ================= 3.3.2 Łowy hodowców: zagroda nie musi stać przy halach ================= */
// Hodowca wyprawia się tam, gdzie pasą się dzikie kozy, oswaja jedną i prowadzi ją do zagrody na postronku.
// Zagroda może więc stać przy osadzie. Bliskie stado to krótka droga, dalekie to cała wyprawa.
const ZAG_NEAR=25;
try{delete BD.zagroda.r;BD.zagroda.d='Hodowcy chodzą na łowy tam, gdzie pasą się dzikie kozy, choćby daleko na halach, oswajają je i prowadzą do zagrody. Oswojone dają mleko i rodzą młode. Ktoś musi zostać przy zagrodzie: bez opieki kozy uciekają, a wilki polują.'}catch(e){}
function kozRelease(person){if(!person.kozN)return;const [i,j]=tileOf(person.x,person.z);
 const herd=S.herds.find(item=>item.type==='koza'&&Math.hypot(item.x-person.x,item.z-person.z)<4);
 if(herd){herd.n+=person.kozN;herd.max=Math.max(herd.max,herd.n)}else S.herds.push({type:'koza',i,j,x:person.x,z:person.z,tx:person.x,tz:person.z,n:person.kozN,max:Math.max(ANIMAL.koza[1],person.kozN),tame:0});
 person.kozN=0;person.kozB=null;log('Brak wolnej zagrody. '+person.name+' wypuszcza prowadzoną kozę tam, gdzie stoi.');toast('Koza wypuszczona: brakuje miejsca w zagrodzie.');
}
function kozResume(person){
 const pens=S.bld.filter(building=>building.kind==='zagroda'&&bDone(building)&&(building.animals||0)+S.people.filter(other=>other!==person&&other.kozB===building.id).reduce((sum,other)=>sum+(other.kozN||0),0)+person.kozN<=penCap(building));
 const preferred=pens.find(building=>building.id===person.kozB);if(preferred)pens.splice(pens.indexOf(preferred),1),pens.unshift(preferred);
 for(const pen of pens){const entry=buildingEntryFor(person,pen);if(!entry)continue;person.kozB=pen.id;if(go(person,entry,'kozdom',null)){person.act='prowadzi kozę do zagrody';return true}}
 if(!pens.length){kozRelease(person);person.state='idle';person.wait=.4;return true}
 person.state='idle';person.wait=2;person.act='brak drogi do zagrody, prowadzi kozę';return true;
}
function kozDeliver(person){if(!person.kozN){person.state='idle';return}
 const pen=bById(person.kozB),entry=person.routeGoal;
 const arrived=pen&&workSiteContains(pen,entry)&&Math.hypot(person.x-tcx(entry[0]),person.z-tcx(entry[1]))<=.8;
 if(!pen||pen.kind!=='zagroda'||!bDone(pen)||(pen.animals||0)+person.kozN>penCap(pen)||!arrived){kozResume(person);return}
 pen.animals=(pen.animals||0)+person.kozN;
 if(!S.seen.koza1){S.seen.koza1=S.seen.koza=1;log(person.name+' przyprowadza do zagrody pierwszą oswojoną kozę.');toast('Pierwsza oswojona koza')}
 person.kozN=0;person.kozB=null;person.state='idle';person.wait=.4;
}
{const _oa=onArrive;onArrive=function(p){const a=p.after;
  if(a==='kozdom'){p.after=null;kozDeliver(p);return}
  // stado poszło dalej, zanim hodowca doszedł: idzie jego śladem
  if(a==='tame'){const h=S.herds[p.herd];if(h&&h.n>0){const d=Math.hypot(h.x-p.x,h.z-p.z);if(d>=4.5&&d<40&&isWork()){const st=nearestWalk(...tileOf(h.x,h.z));if(st&&go(p,st,'tame',null)){p.act='idzie śladem kóz';return}}}}
  return _oa(p)}}
// koza na postronku nie może zostać przy człowieku, którego odwołano do innej pracy
function kozDaily(){S.people.forEach(person=>{if(person.kozN&&person.after!=='kozdom')kozResume(person)})}
// Dzienna aktualizacja: p_daily.js (jedna jawna kolejność).
// widać, jak koza idzie za hodowcą
{const _da=drawAnimals;drawAnimals=function(){_da();if(!S||typeof zMeshes!=='function')return;const L=S.people.filter(p=>p.kozN&&pMesh[p.id]&&pMesh[p.id].visible);if(!L.length)return;
  const P=zMeshes('koza_z',80);let a=P.walkA.count,b=P.walkB.count;
  L.forEach((p,i)=>{const dr=p.dir||0,x=p.x-Math.sin(dr)*.75+Math.cos(dr)*.35,z=p.z-Math.cos(dr)*.75-Math.sin(dr)*.35;const mv=p.state==='move';
   zDummy.position.set(x,Hy(x,z),z);zDummy.rotation.set(0,Math.atan2(-Math.cos(dr),Math.sin(dr)),0);zDummy.scale.setScalar(.95);zDummy.updateMatrix();
   const A=!mv||(Math.floor(clock*5+i)%2===0);if(A&&a<80)P.walkA.setMatrixAt(a++,zDummy.matrix);else if(b<80)P.walkB.setMatrixAt(b++,zDummy.matrix)});
  P.walkA.count=a;P.walkB.count=b;P.walkA.visible=a>0;P.walkB.visible=b>0;P.walkA.instanceMatrix.needsUpdate=P.walkB.instanceMatrix.needsUpdate=true}}
// karta zagrody: gdzie są dzikie kozy i kto jest na łowach
function kozSeen(){return S.herds.filter(h=>{if(h.type!=='koza'||h.n<=0)return false;const t=tileOf(h.x,h.z);return revAt(t[0],t[1])})}
function kozNear(x,z){return kozSeen().map(h=>[h,Math.hypot(h.x-x,h.z-z)]).sort((a,b)=>a[1]-b[1])[0]||null}
function kozWhere(h){const t=tileOf(h.x,h.z),r=regionAt(t[0],t[1]);return r&&r.known&&r.name?`, w krainie ${r.name}`:''}
{const _bp=bldPanelHTML;bldPanelHTML=function(b){let h=_bp(b);if(!S||b.kind!=='zagroda'||!bDone(b))return h;const c=bCenter(b);const n=kozNear(c.x,c.z);
  const out=S.people.filter(q=>q.wb===b.id&&(q.after==='tame'||(q.state==='work'&&q.workKind==='tame')||q.kozN));
  const t=!n?'Nikt jeszcze nie widział dzikich kóz. Zwiadowcy muszą odsłonić hale.':`Dzikie kozy: najbliższe stado ${Math.round(n[1])} ${krokW(Math.round(n[1]))} stąd${kozWhere(n[0])}${n[1]>ZAG_NEAR?'. Hodowcy chodzą tam na łowy':''}.`;
  return h+`<p class="mut">${t}${out.length?` Na łowach: ${out.map(q=>q.name+(q.kozN?' (wraca z kozą)':'')).join(', ')}.`:''}</p>`}}
// opisy celu i wiedzy
try{ACTS[3].g.forEach(g=>{if(g[0]==='Oswój pierwszą kozę')g[2]='Przeczucie, jak oswoić kozy, przychodzi z pracy myśliwych i hodowców, a wiedzę daje próba (Wiedza → Hodowla). Potem zagroda, choćby przy osadzie, i hodowca: sam chodzi na łowy tam, gdzie pasą się dzikie kozy.'})}catch(e){}
// krok celu „Oswój pierwszą kozę”: zasięg zagrody już nie blokuje
CEL['Oswój pierwszą kozę']=()=>{
 if(!tech('h_zagr')){const t=TECH_BY.h_zagr,st=techState(t),pc=Math.round(100*(S.tp.h_zagr||0)/t.xp);
  return st==='avail'?{txt:typeof badCelTxt==='function'?badCelTxt(t)[0].toUpperCase()+badCelTxt(t).slice(1)+'.':`Najpierw wiedza „Oswajanie kóz” (Wiedza → Hodowla): ${pc}%.`,hint:['wiedza',null,'[data-tn="h_zagr"]']}
   :{txt:'Najpierw trzeba poznać tropienie zwierzyny, a potem oswajanie kóz (Wiedza → Hodowla). Przeczucie przychodzi z pracy myśliwych i hodowców.',hint:['wiedza',null,null]}}
 const seen=kozSeen();const done=S.bld.filter(b=>b.kind==='zagroda'&&bDone(b));
 if(!done.length){const s=celBuild('zagroda',1);if(!s.wait&&s.kind)s.txt+=' Może stać przy osadzie: hodowca sam pójdzie po kozy na łowy.';return s}
 const b=done.slice().sort((x,y)=>celWorkers(y).length-celWorkers(x).length)[0],ws=celWorkers(b),c=bCenter(b);
 if(!seen.length)return{txt:'Zagroda stoi, ale nikt jeszcze nie widział dzikich kóz. Zwiadowcy muszą odsłonić hale (Praca → Zwiadowcy).',hint:['praca',null,'[data-al="zwiad"][data-d="1"]']};
 const n=kozNear(c.x,c.z);
 if(!ws.length)return{txt:`Zagroda stoi. Najbliższe dzikie kozy pasą się ${Math.round(n[1])} ${krokW(Math.round(n[1]))} od niej${kozWhere(n[0])}. Brakuje hodowcy: przydziel kogoś do zagrody (Praca), a pójdzie po nie na łowy.`,hint:celAddW(b)};
 const lead=ws.find(q=>q.kozN);if(lead)return{txt:`${lead.name} prowadzi kozę do zagrody.`,wait:1};
 const tam=ws.find(q=>q.state==='work'&&q.workKind==='tame');if(tam)return{txt:`${tam.name} oswaja dzikie kozy${kozWhere(S.herds[tam.herd]||n[0])}. ${(b.animals||0)?'Kolejna':'Pierwsza'} pójdzie na postronku po trzech podejściach, teraz ${b.tame||0} z 3.`,wait:1};
 const go1=ws.find(q=>q.after==='tame');if(go1)return{txt:`${go1.name} idzie na łowy po kozy: najbliższe stado ${Math.round(n[1])} ${krokW(Math.round(n[1]))} od zagrody${kozWhere(n[0])}.`,wait:1};
 return{txt:`Hodowca wyruszy na łowy za dnia: najbliższe stado ${Math.round(n[1])} ${krokW(Math.round(n[1]))} od zagrody${kozWhere(n[0])}.`,wait:1}};
window.__hod={kozDeliver,kozNear,kozSeen,ZAG_NEAR};
