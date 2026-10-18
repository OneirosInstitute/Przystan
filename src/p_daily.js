/* Epoki I–III: jeden przebieg doby. Epoka IV ma osobny zegar E4Economy.
   Kolejność zachowuje wcześniejszy łańcuch siedmiu nakładek newDay.
   Zapis następuje dopiero po dziennych aktualizacjach wszystkich systemów. */
function dailyPhase(name,callback){
 try{callback()}catch(error){console.warn('Doba ['+name+']',error)}
}
function newDay(){return ResourceFlow.run(S,'economy',()=>{
 const fuelBefore=S?(S.res.opal||0):0;
 const spoilMeat=SPOIL.mieso,spoilFish=SPOIL.ryby;
 const salted=S&&(S.res.sol||0)>=1;
 try{
  if(salted){SPOIL.mieso=spoilMeat*.55;SPOIL.ryby=spoilFish*.55}
  legacyDayCore();
  dailyPhase('zapasy',zapSnap);
  dailyPhase('epoka II',e2Daily);
  dailyPhase('epoka II: rozwój',e2Daily21);
  dailyPhase('epoka II: zwyczaje',e2Daily22);
 }finally{
  // Przywróć dokładne wartości także po błędzie; bez dryfu mnożenia/dzielenia.
  SPOIL.mieso=spoilMeat;SPOIL.ryby=spoilFish;
 }
 dailyPhase('hodowla',kozDaily);
 dailyPhase('serce osady',()=>{scFuelBack(fuelBefore);scDaily();scTick()});
 save();
 },Math.max(0,Math.floor(S.day)-1))}
