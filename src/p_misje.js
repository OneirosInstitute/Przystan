/* Przystań: zadania budynków, oparte na jednym silniku wypraw. */
const BUILDING_MISSIONS={
 zagroda:{title:'Poszukiwanie dzikiej kozy',region:'high',kind:'koza',description:'Hodowca zbiera żywność i wyrusza w hale. Po powrocie może przyprowadzić dziką kozę.'},
 mysliwy:{title:'Tropienie zwierzyny',region:'forest',kind:'tropy',description:'Myśliwy wyrusza po nowe tropy. Po powrocie przynosi obserwacje i zdobycz.'},
 zbieracz:{title:'Rozpoznanie roślin',region:'meadow',kind:'rosliny',description:'Zbieracz poznaje nowe stanowiska dzikich roślin.'},
 pomost:{title:'Zwiad po wybrzeżu',region:'coast',kind:'brzeg',description:'Rybak sprawdza nowe łowiska i brzeg.'}
};
function missionFor(building){return building&&BUILDING_MISSIONS[building.kind]||null}
function missionRegion(definition){return REGIONS.filter(region=>region&&region.type===definition.region&&region.id!==0).sort((left,right)=>regDist(left)-regDist(right))[0]||null}
function missionEligible(building){return S.people.filter(person=>person.job==='wb'&&person.wb===building.id&&person.hp>.55&&person.age>=16&&person.age<60&&person.state!=='away'&&!person.exp&&!pendingDelivery(person))}
function missionInProgress(building){return S.exps.find(expedition=>expedition.missionBuilding===building.id)}
function missionRequirement(building){const definition=missionFor(building);if(!definition)return 'Budynek nie ma wyprawy.';
 if(!bDone(building))return 'Najpierw ukończ budynek.';
 if(building.proj)return 'Poczekaj na zakończenie prac w budynku.';
 if(missionInProgress(building))return 'Zadanie już trwa.';
 if(definition.kind==='koza'&&!tech('h_zagr'))return 'Najpierw poznaj oswajanie zwierząt (Wiedza → Hodowla).';
 if(definition.kind==='koza'&&(building.animals||0)+S.people.filter(person=>person.kozB===building.id&&person.kozN).reduce((total,person)=>total+person.kozN,0)>=penCap(building))return 'Zagroda jest pełna. Rozbuduj wybieg albo przygotuj kolejną zagrodę.';
 if(!missionRegion(definition))return 'Nie odnaleziono terenu wyprawy.';
 if(!missionEligible(building).length)return 'Przydziel dorosłego, zdrowego pracownika do budynku.';
 const target=missionRegion(definition);if(S.exps.some(expedition=>expedition.r===target.id))return 'Na ten teren wyruszyła już inna wyprawa.';
 if(foodTotal()<expFood(target,'zwiad',1))return `Potrzebne zapasy żywności: ${expFood(target,'zwiad',1)} porcji.`;
 if(!expRouteReady([missionEligible(building)[0]],exitTile(target)))return 'Brak drogi do wyjścia wyprawy — odblokuj przejście z osady.';
 if(definition.kind==='koza'&&!S.bld.some(item=>item.id===building.id&&item.kind==='zagroda'))return 'Brakuje zagrody.';
 return '';
}
function sendBuildingMission(buildingId){const building=bById(buildingId);if(!building)return false;const definition=missionFor(building),reason=missionRequirement(building);if(reason){toast(reason);return false}
 const target=missionRegion(definition),person=missionEligible(building)[0],food=expFood(target,'zwiad',1),total=foodTotal();
 if(total<=0)return false;
 FOOD.forEach(resource=>{S.res[resource]-=food*S.res[resource]/total});
 const days=expDays(target,'zwiad'),expedition={id:(S.expN=(S.expN||0)+1),r:target.id,type:'zwiad',ppl:[person.id],days,left:days,exit:exitTile(target),risk:expRisk(target,1),missionBuilding:building.id,missionKind:definition.kind};
 S.exps.push(expedition);release(person);person.path=null;person.state='idle';person.wait=0;person.job='wyp';person.wb=null;person.exp=expedition.id;person.act='przygotowuje wyprawę: '+definition.title.toLowerCase();
 log(`${person.name} zabiera ${food} porcji żywności i wyrusza na zadanie „${definition.title}”. Powrót za około ${days} dni.`);toast('Zadanie rozpoczęte');assign();renderSel();renderPanel();save();return true;
}
const previousMissionFinish=finishExp;
finishExp=function(expedition,people){const building=expedition.missionBuilding?bById(expedition.missionBuilding):null,kind=expedition.missionKind;
 const returningIds=people.map(person=>person.id);previousMissionFinish(expedition,people);
 if(!building||!kind)return;
 const returned=returningIds.map(id=>S.people.find(person=>person.id===id)).filter(Boolean);
 if(!returned.length){log('Wyprawa z budynku nie wróciła.');return}
 if(kind==='koza'){const found=S.herds.some(herd=>herd.type==='koza'&&herd.n>0);
  if(found&&(building.animals||0)<penCap(building)){const herd=S.herds.find(herd=>herd.type==='koza'&&herd.n>0);herd.n--;building.animals=(building.animals||0)+1;S.seen.koza=1;log(`${returned[0].name} wraca z dziką kozą. W zagrodzie jest teraz ${building.animals} zwierząt.`);toast('Koza dotarła do zagrody')}
  else log('Poszukiwanie kozy nie powiodło się: brak wolnego miejsca w zagrodzie lub dzikiego stada.');}
 else if(kind==='tropy'){S.res.mieso=(S.res.mieso||0)+3;log('Tropiciel wrócił z nowymi tropami i mięsem.')}
 else if(kind==='rosliny'){S.res.ziola=(S.res.ziola||0)+3;log('Zbieracz wrócił z próbkami ziół.')}
 else if(kind==='brzeg'){S.res.ryby=(S.res.ryby||0)+4;log('Rybak wrócił z rozpoznania wybrzeża.')}
 returned.forEach(person=>{if(!bDone(building)||!missionFor(building)||person.job!=='rob'||!(building.want>0))return;
  const workers=S.people.filter(worker=>worker.job==='wb'&&worker.wb===building.id);
  if(workers.length>=building.want){const replacement=workers[workers.length-1];if(replacement){release(replacement);replacement.job='rob';replacement.wb=null;replacement.state='idle';replacement.act='wraca do wolnych prac';}}
  person.job='wb';person.wb=building.id;person.act='wrócił z wyprawy';});assign();renderPanel();save();
};
const previousMissionBuildingPanel=bldPanelHTML;
bldPanelHTML=function(building){let content=previousMissionBuildingPanel(building);const definition=missionFor(building);if(!definition||!bDone(building))return content;
 const running=missionInProgress(building),reason=missionRequirement(building),target=missionRegion(definition);
 content+=`<div class="ext"><b>Zadanie: ${definition.title}</b><small>${definition.description}</small>`;
 if(running){const explorer=S.people.find(person=>person.exp===running.id),percentage=Math.round(100*(running.days-running.left)/running.days);
 content+=`<p>Wyprawa: ${explorer?explorer.name:'w drodze'} · ${expDepartureStatus(running).blocked?escapeHtml(expDepartureStatus(running).reason):explorer&&explorer.state!=='away'?'zbiera zapasy i wychodzi':'pozostało '+running.left+' dni'}</p><div class="pbar"><div style="width:${percentage}%"></div></div><button data-mission-locate="${running.r}">Pokaż teren wyprawy</button>`}
 else content+=`<p class="mut">${reason||`Czas: ${expDays(target,'zwiad')} dni · żywność: ${expFood(target,'zwiad',1)} porcji`}</p><button data-mission-start="${building.id}" ${reason?'disabled':''}>Wyrusz na poszukiwanie</button>`;
 return content+'</div>';
};
document.addEventListener('click',event=>{const control=event.target.closest('[data-mission-start],[data-mission-locate]');if(!control||!S)return;
 event.preventDefault();event.stopPropagation();if(control.dataset.missionStart)sendBuildingMission(Number(control.dataset.missionStart));
 else{const region=REGIONS[Number(control.dataset.missionLocate)];if(region){if(innerWidth<=760)closeSheet();lookAt(tcx(region.i),tcx(region.j),1.15)}}},true);
