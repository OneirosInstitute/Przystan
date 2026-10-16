/* Jedno ognisko Przystani: odziedziczony punkt lądowania jest sercem osady.
   Starsze zapisy migrujemy tylko, jeżeli nowy plac nie koliduje z zabudową. */
function originHeartAnchor(){return [camp.i-2,camp.j-2]}
function originHeartCanOccupy(building){
 const [originI,originJ]=originHeartAnchor();if(originI<0||originJ<0||originI+5>=N||originJ+5>=N)return false;
 for(let offsetI=0;offsetI<5;offsetI++)for(let offsetJ=0;offsetJ<5;offsetJ++){
  const index=(originJ+offsetJ)*N+originI+offsetI;
  const occupant=occ[index];if(occupant>=0&&occupant!==999&&(!building||occupant!==building.id))return false;
 }
 return true;
}
function heartAtOrigin(){const building=scB();return !!building&&building.i===camp.i-2&&building.j===camp.j-2}
function originHeartReady(){if(!S||!S.bld)return false;
 let building=scB();if(!originHeartCanOccupy(building))return false;
 const [originI,originJ]=originHeartAnchor();
 if(!building){building={id:S.nid++,kind:'serce',i:originI,j:originJ,prog:SERCE[1].work,work:SERCE[1].work,workers:0,want:0,mat:SERCE[1].cost.drewno,del:SERCE[1].cost.drewno,haul:0,inTr:0,cmp:1,bd:S.day,cond:1,st:1};S.bld.push(building)}
 else if(!heartAtOrigin()){
  // Nie przenosimy źródłowego zapisu, jeżeli wymagałoby to wyburzenia innego budynku.
  for(let offsetI=0;offsetI<5;offsetI++)for(let offsetJ=0;offsetJ<5;offsetJ++){
   const index=(building.j+offsetJ)*N+building.i+offsetI;
   if(occ[index]===building.id)occ[index]=-1;
  }
  building.i=originI;building.j=originJ;
 }
 scOcc(building);scKnow();rebuildMesh(building);campG.visible=false;
 if(!S.seen.originHeart){S.seen.originHeart=1;log('Pierwsze ognisko z dnia lądowania pozostaje sercem Przystani. Każda rozbudowa wyrasta z tego samego miejsca.')}
 return true;
}
{const originalOriginBoot=boot;boot=function(fresh){const result=originalOriginBoot(fresh);
 try{if(!originHeartReady()){const building=scB();campG.visible=!building;
  if(!S.seen.originBlocked){S.seen.originBlocked=1;log('Przeniesienie serca do pierwszego ogniska jest zablokowane przez istniejącą zabudowę. Żaden budynek nie został przesunięty.')}}}
 catch(error){console.warn('origin hearth migration',error)}return result;
}}
// Przy ponownej budowie statycznych dekoracji nie należy ponownie pokazywać drugiego ogniska.
{const originalOriginStatic=buildStatic;buildStatic=function(){const result=originalOriginStatic();if(S&&scB())campG.visible=false;return result}}
window.__originHeart={originHeartAnchor,originHeartCanOccupy,heartAtOrigin,originHeartReady};
