/* Granice obserwacji: symulacja, dostawa, zwrot i przesunięcie mają osobne znaczenie. */
{const previousBoot=boot;boot=function(fresh){const result=previousBoot(fresh);ResourceFlow.attach(S,{reset:!!fresh});return result}}
{const previousStart=e4Start;e4Start=function(){const result=previousStart();if(result.ok)ResourceFlow.attach(S);return result}}
{const previousPerson=stepPerson;stepPerson=function(person,delta){return ResourceFlow.run(S,'economy',()=>previousPerson(person,delta))}}
{const previousTrip=finishTrip;finishTrip=function(person,items){person.carryOrigin=person.workKind==='wreck'?'other':'economy';return previousTrip(person,items)}}
{const previousDeposit=deposit;deposit=function(person){const result=ResourceFlow.run(S,person.carryOrigin||(person.workKind==='wreck'?'other':'economy'),()=>previousDeposit(person));if(!person.carry)delete person.carryOrigin;return result}}
{const previousPantry=gospEat;gospEat=function(){return ResourceFlow.run(S,'other',()=>previousPantry())}}
{const previousFuel=scFuelBack;scFuelBack=function(before){return ResourceFlow.run(S,'refund',()=>previousFuel(before))}}
{const previousHeart=scDaily;scDaily=function(){return ResourceFlow.run(S,'refund',()=>previousHeart())}}
