/* Katalog Epoki IV: dane wspólne dla symulacji, paneli i wizualizacji. */
const E4Catalog=(()=>{
 const resources={woz:'Wozy',suchary:'Suchary',jagody:'Jagody',grzyby:'Grzyby',ryby:'Ryby',mieso:'Mięso',ziarno:'Ziarno',warzywa:'Warzywa',mleko:'Mleko',jaja:'Jaja',maka:'Mąka',chleb:'Chleb',ser:'Ser',kiszonki:'Kiszonki',miod:'Miód',ziola:'Zioła',drewno:'Kłody',opal:'Opał',kamien:'Kamień',glina:'Glina',deski:'Deski',narz:'Narzędzia',narzk:'Narzędzia kamienne',gwozdzie:'Gwoździe',plotno:'Płótno',skory:'Skóry',odziez:'Odzież',ruda:'Ruda',wegiel:'Węgiel drzewny',wlokna:'Włókna',naczynia:'Naczynia',sol:'Sól',winogrona:'Winogrona',jablka:'Jabłka',chmiel:'Chmiel',slod:'Słód',wino:'Wino',piwo:'Piwo',mpitny:'Miód pitny',beczki:'Beczki',wedliny:'Wędliny',suszone_ryby:'Suszone ryby',zelazo:'Żelazo',wyroby_drewniane:'Wyroby drewniane',wosk:'Wosk',leki:'Preparaty zielarskie',pierze:'Pierze',bursztyn:'Bursztyn',cegla:'Cegły',lodz:'Łodzie',_sh:'Praca przy statku',_wl:'Praca przy łodzi'};
 const food=['suchary','jagody','grzyby','ryby','mieso','ziarno','warzywa','mleko','jaja','maka','chleb','ser','kiszonki','miod','winogrona','jablka','wedliny','suszone_ryby'];
 const spoil={suchary:.0004,jagody:.035,grzyby:.035,ryby:.045,mieso:.04,ziarno:.001,warzywa:.012,mleko:.06,jaja:.006,maka:.003,chleb:.012,ser:.004,kiszonki:.001,miod:.0002,winogrona:.02,jablka:.008,wedliny:.002,suszone_ryby:.002};
 const crops={
  zboze:{name:'Zboże',resource:'ziarno',seed:'ziarno',seedCost:2,days:6,maturity:0,yield:42,skill:'rolnik'},
  warzywa:{name:'Warzywnik',resource:'warzywa',seed:null,seedCost:0,days:4,maturity:0,yield:24,skill:'rolnik'},
  winogrona:{name:'Winorośl',resource:'winogrona',seed:null,seedCost:0,days:5,maturity:30,yield:24,skill:'rolnik',sun:.64},
  jablka:{name:'Sad jabłoniowy',resource:'jablka',seed:null,seedCost:0,days:6,maturity:40,yield:32,skill:'rolnik'},
  chmiel:{name:'Chmielnik',resource:'chmiel',seed:null,seedCost:0,days:6,maturity:8,yield:12,skill:'rolnik'},
  len:{name:'Len',resource:'wlokna',seed:null,seedCost:0,days:6,maturity:0,yield:18,skill:'rolnik'},
  ziola:{name:'Zielnik',resource:'ziola',seed:null,seedCost:0,days:5,maturity:0,yield:14,skill:'zbieracz'}
 };
 const buildings={
  dom_rodowy:{name:'Dom rodowy',model:'dom',cost:{drewno:30,deski:10,kamien:8},labor:64,capacity:12},
  chata:{name:'Nowa chata z bali',model:'chata',cost:{drewno:30,kamien:10,deski:4},labor:40,capacityAdd:6},
  skrzydlo:{name:'Skrzydło domu rodowego',model:'chata',cost:{drewno:24,deski:12,kamien:8},labor:48,capacityAdd:8},
  dwor:{name:'Dwór (przebudowa domu rodowego)',model:'dwor',cost:{drewno:40,deski:24,kamien:20,cegla:12},labor:120,capacityAdd:8,needs:['dom_rodowy','skrzydlo']},
  magazyn:{name:'Spichlerz i magazyn',model:'sklad',cost:{drewno:18,deski:8,kamien:4},labor:24,storage:800},
  piwnica:{name:'Piwniczka',model:'kiszarnia',cost:{kamien:12,deski:6},labor:20,storage:250},
  ogrodek:{name:'Ogródek rodzinny',model:'pole',cost:{drewno:3},labor:6},
  zielnik:{name:'Zielnik przy domu',model:'ogrodziol',cost:{drewno:3,kamien:2},labor:6},
  wyroby:{name:'Pracownia domowa',model:'pracownia',cost:{drewno:6,deski:4},labor:12},
  pole:{name:'Pole uprawne',model:'pole',cost:{drewno:3,ziarno:2},labor:8},
  mlyn:{name:'Młyn',model:'wiatrak',cost:{deski:14,kamien:16,narz:1},labor:36},
  piekarnia:{name:'Cech piekarzy',model:'piekarnia',cost:{cegla:12,kamien:12,deski:8},labor:32},
  winnica:{name:'Winnica',model:'pole',cost:{drewno:12,deski:4},labor:32,crop:'winogrona'},
  winiarnia:{name:'Winiarnia',model:'winiarnia',cost:{deski:18,kamien:12,naczynia:4},labor:36},
  chmielnik:{name:'Chmielnik',model:'pole',cost:{drewno:8},labor:18,crop:'chmiel'},
  browar:{name:'Browar',model:'browar',cost:{deski:16,kamien:10,naczynia:4},labor:36},
  karczma:{name:'Karczma',model:'zajazd',cost:{drewno:24,deski:18,kamien:8},labor:40},
  wedzarnia:{name:'Wędzarnia i masarnia',model:'pomost',cost:{drewno:16,kamien:8,deski:6},labor:24},
  zagroda:{name:'Zagroda rodowa',model:'zagroda',cost:{drewno:20,deski:6},labor:24},
  kurnik:{name:'Kurnik',model:'zbieracz',cost:{drewno:10,deski:4},labor:16},
  chlew:{name:'Chlew',model:'zagroda',cost:{drewno:16,kamien:6},labor:20},
  serownia:{name:'Serownia',model:'serownia',cost:{deski:10,kamien:8,naczynia:2},labor:20},
  huta:{name:'Cech hutniczy',model:'kuznia',cost:{kamien:20,cegla:16,deski:8,narz:2},labor:48},
  kuznia:{name:'Kuźnia narzędzi',model:'kuznia',cost:{kamien:14,cegla:8,deski:6},labor:32},
  mielerz:{name:'Mielerz',model:'mielerz',cost:{drewno:8,kamien:4},labor:12},
  szyb:{name:'Szyb kopalni rudy',model:'kopalnia',cost:{drewno:24,deski:10,kamien:12,narz:2},labor:30},
  tartak:{name:'Tartak',model:'drwal',cost:{drewno:18,deski:8,narz:2},labor:28},
  stolarnia:{name:'Cech wyrobów drewnianych',model:'warsztat',cost:{deski:14,narz:2},labor:24},
  przasnia:{name:'Prząśnia i tkalnia',model:'szwalnia',cost:{deski:12,wlokna:4},labor:24},
  szwalnia:{name:'Pracownia odzieży',model:'szwalnia',cost:{deski:8,narz:1},labor:20},
  garncarnia:{name:'Cech garncarski',model:'garncarnia',cost:{glina:12,kamien:8,drewno:8},labor:24},
  cegielnia:{name:'Piec ceglarski',model:'cegielnia',cost:{kamien:12,glina:10,drewno:8},labor:24},
  sad:{name:'Sad rodowy',model:'pole',cost:{drewno:8,kamien:2},labor:24,crop:'jablka'},
  pasieka:{name:'Pasieka',model:'pasieka',cost:{drewno:12,deski:4},labor:18},
  zielarnia:{name:'Pracownia zielarska',model:'ogrodziol',cost:{deski:10,naczynia:3},labor:20},
  len:{name:'Poletko lnu',model:'pole',cost:{drewno:3},labor:8,crop:'len'},
  rowy:{name:'Rowy i nawadnianie',model:'studnia',cost:{kamien:8,drewno:6},labor:20}
 };
 const recipes={
  woz:{name:'Budowa wozu',building:'stolarnia',input:{deski:12,gwozdzie:8,zelazo:1},output:{woz:1},labor:16,days:0,skill:'ciesla'},
  narzk:{name:'Wyrób narzędzi kamiennych',building:'schronienie',input:{kamien:3,drewno:2},output:{narzk:1},labor:5,days:0,skill:'ciesla'},
  deski_reczne:{name:'Ręczne ciosanie desek',building:'schronienie',input:{drewno:10},output:{deski:5},labor:12,days:0,skill:'ciesla'},
  opal:{name:'Rąbanie opału',building:'schronienie',input:{drewno:6},output:{opal:12},labor:2,days:0,skill:'drwal'},
  sol:{name:'Odparowanie soli morskiej',building:'schronienie',input:{opal:4},output:{sol:6},labor:4,days:2,skill:'murarz'},
  kiszonki:{name:'Kiszenie warzyw',building:'wyroby',input:{warzywa:6},output:{kiszonki:4},labor:2,days:2,skill:'rolnik'},
  maka:{name:'Mielenie ziarna',building:'mlyn',input:{ziarno:12},output:{maka:12},labor:2,days:0,skill:'rolnik'},
  chleb:{name:'Wypiek chleba',building:'piekarnia',input:{maka:10,opal:1},output:{chleb:16},labor:3,days:0,skill:'rolnik'},
  wino:{name:'Fermentacja wina',building:'winiarnia',input:{winogrona:12,beczki:1},output:{wino:8},labor:2,days:6,skill:'rolnik'},
  slod:{name:'Słodowanie ziarna',building:'browar',input:{ziarno:10},output:{slod:9},labor:2,days:2,skill:'rolnik'},
  piwo:{name:'Warzenie piwa',building:'browar',input:{slod:8,chmiel:1,opal:1,beczki:1},output:{piwo:12},labor:3,days:3,skill:'rolnik'},
  mpitny:{name:'Nastaw miodu pitnego',building:'winiarnia',input:{miod:8,beczki:1},output:{mpitny:10},labor:2,days:5,skill:'zbieracz'},
  wedliny:{name:'Solenie i wędzenie',building:'wedzarnia',input:{mieso:10,sol:1,opal:1},output:{wedliny:8},labor:3,days:1,skill:'mysliwy'},
  suszone_ryby:{name:'Suszenie ryb',building:'wedzarnia',input:{ryby:10,opal:1},output:{suszone_ryby:7},labor:2,days:1,skill:'rybak'},
  ser:{name:'Wyrób sera',building:'serownia',input:{mleko:8},output:{ser:5},labor:2,days:1,skill:'hodowca'},
  wegiel:{name:'Wypał węgla',building:'mielerz',input:{drewno:8},output:{wegiel:6},labor:2,days:1,skill:'drwal'},
  zelazo:{name:'Wytop żelaza',building:'huta',input:{ruda:8,wegiel:6},output:{zelazo:4},labor:4,days:1,skill:'kowal'},
  narz:{name:'Kucie narzędzi',building:'kuznia',input:{zelazo:2,drewno:1,wegiel:1},output:{narz:2},labor:3,days:0,skill:'kowal'},
  gwozdzie:{name:'Kucie gwoździ',building:'kuznia',input:{zelazo:1,wegiel:1},output:{gwozdzie:12},labor:2,days:0,skill:'kowal'},
  deski:{name:'Przecieranie drewna',building:'tartak',input:{drewno:10},output:{deski:8},labor:3,days:0,skill:'drwal'},
  wyroby_drewniane:{name:'Wyroby drewniane',building:'stolarnia',input:{deski:6,gwozdzie:2},output:{wyroby_drewniane:4},labor:3,days:0,skill:'ciesla'},
  beczki:{name:'Bednarstwo',building:'stolarnia',input:{deski:4,zelazo:.25},output:{beczki:2},labor:2,days:0,skill:'ciesla'},
  plotno:{name:'Przędzenie i tkanie',building:'przasnia',input:{wlokna:10},output:{plotno:5},labor:4,days:0,skill:'krawiec'},
  odziez:{name:'Szycie ubrań',building:'szwalnia',input:{plotno:4},output:{odziez:2},labor:3,days:0,skill:'krawiec'},
  odziez_skory:{name:'Szycie kożuchów',building:'szwalnia',input:{skory:3},output:{odziez:2},labor:4,days:0,skill:'krawiec'},
  naczynia:{name:'Wypał naczyń',building:'garncarnia',input:{glina:8,opal:2},output:{naczynia:6},labor:3,days:1,skill:'murarz'},
  cegla:{name:'Wypał cegieł',building:'cegielnia',input:{glina:12,opal:3},output:{cegla:10},labor:3,days:1,skill:'murarz'},
  leki:{name:'Suszenie i przygotowanie ziół',building:'zielarnia',input:{ziola:8,naczynia:.5},output:{leki:5},labor:3,days:1,skill:'zbieracz'}
 };
 const householdUse={wyroby_drewniane:{daily:.012,effect:'Wyposażenie domów — wygoda i trwałe meble'},wosk:{daily:.006,effect:'Świece i konserwacja — zużycie narzędzi mniejsze do 20%'},pierze:{daily:.006,effect:'Ciepłe posłania — mniej zużywanej odzieży'},bursztyn:{daily:.0005,effect:'Rodowe ozdoby i obrzędy — pamięć i nadzieja'}};
 const specialties={
  rolniczy:{name:'Pola, młyn i cech piekarzy',buildings:['pole','mlyn','piekarnia','magazyn'],crops:['zboze'],recipes:['maka','chleb'],skill:'rolnik'},
  winiarski:{name:'Winnica i winiarnia',buildings:['winnica','winiarnia','piwnica','stolarnia'],crops:['winogrona'],recipes:['wino','beczki'],skill:'rolnik'},
  browarniczy:{name:'Browar i karczma',buildings:['chmielnik','browar','karczma','stolarnia'],crops:['zboze','chmiel'],recipes:['slod','piwo','beczki'],skill:'rolnik'},
  miesny:{name:'Wyroby mięsne i wędzarnie',buildings:['zagroda','chlew','wedzarnia','piwnica'],crops:['warzywa'],recipes:['wedliny','suszone_ryby'],skill:'mysliwy'},
  hodowlany:{name:'Hodowla kóz, kur i świń',buildings:['zagroda','kurnik','chlew','serownia'],crops:['zboze'],recipes:['ser'],skill:'hodowca'},
  hutniczy:{name:'Cech hutniczy i narzędzia',buildings:['szyb','mielerz','huta','kuznia','magazyn'],crops:['warzywa'],recipes:['wegiel','zelazo','narz','gwozdzie'],skill:'kowal'},
  drzewny:{name:'Tartak i wyroby drewniane',buildings:['tartak','stolarnia','magazyn'],crops:['warzywa'],recipes:['deski','wyroby_drewniane','beczki'],skill:'drwal'},
  tkacki:{name:'Len, tkaniny i odzież',buildings:['len','przasnia','szwalnia'],crops:['len'],recipes:['plotno','odziez'],skill:'krawiec'},
  garncarski:{name:'Cech garncarski i ceglarski',buildings:['garncarnia','cegielnia','magazyn'],crops:['warzywa'],recipes:['naczynia','cegla'],skill:'murarz'},
  sadowniczy:{name:'Sad i pasieka',buildings:['sad','pasieka','wyroby','winiarnia'],crops:['jablka'],recipes:['kiszonki','mpitny'],skill:'zbieracz'},
  zielarski:{name:'Zielnik i wyroby zielarskie',buildings:['zielnik','zielarnia','wyroby'],crops:['ziola'],recipes:['leki','kiszonki'],skill:'zbieracz'}
 };
 const animals={koza:{name:'Koza',building:'zagroda',feed:.2,milk:.7,gestation:25,adult:20,capacity:16,meat:7,skin:1},kura:{name:'Kura',building:'kurnik',feed:.07,eggs:.3,gestation:7,adult:8,capacity:32,meat:2,skin:0},swinia:{name:'Świnia',building:'chlew',feed:.5,gestation:20,adult:18,capacity:12,meat:18,skin:2}};
 // 4.4: folwark rośnie z tego, co daje kraina. Wymagania: [cecha krainy, próg (ujemny = najwyżej), czego trzeba]
 const fitNeeds={rolniczy:[['fertility',.6,'żyzna ziemia']],winiarski:[['sun',.7,'dużo słońca']],browarniczy:[['fertility',.55,'żyzna ziemia pod zboże i chmiel']],
  miesny:[['fertility',.45,'pastwiska']],hodowlany:[['fertility',.45,'pastwiska'],['moisture',-.85,'suche łąki, nie bagno']],hutniczy:[['ore',.6,'złoże rudy w skale']],
  drzewny:[['forest',.55,'stary las']],tkacki:[['fertility',.55,'żyzna ziemia pod len'],['moisture',.35,'wilgoć dla lnu']],garncarski:[['clay',.45,'złoże gliny']],
  sadowniczy:[['nectar',.55,'pożytek dla pszczół'],['sun',.6,'słońce dla sadu']],zielarski:[['moisture',.45,'wilgotne łąki i zioła']]};
 function specialtyFit(key,region){const needs=fitNeeds[key]||[];if(!region)return{ok:false,missing:['kraina'],score:0};const missing=[];let score=1;
  for(const[k,t,label]of needs){const v=region[k]??0;const ok=t>=0?v>=t:v<=-t;if(!ok)missing.push(label);score=Math.min(score,t>=0?v/t:(-t)/Math.max(.01,v))}
  return{ok:!missing.length,missing,score:Math.round(Math.min(score,2)*100)/100,needs:needs.map(n=>n[2])}}
 // 4.7: nauki rodów, czyli drzewo postępu epoki IV. Wiec wybiera, czego się uczyć; uczą się ludzie w wybranym ośrodku, pracą i materiałem.
 const research={
  e4_koniczyna:{name:'Koniczyna w płodozmianie',domain:'uprawa',req:[],cost:{ziarno:10},labor:40,skill:'rolnik',site:'pole',desc:'Koniczyna na ugorze oddaje ziemi to, co zboże z niej wzięło.',effect:'Plony pól o 15% większe.'},
  e4_szczep:{name:'Szczepienie drzew',domain:'uprawa',req:['e4_koniczyna'],cost:{narz:1,drewno:6},labor:50,skill:'rolnik',site:'sad',desc:'Zraz z dobrej jabłoni na dzikiej podkładce.',effect:'Próby upraw udają się częściej, a sady, winnice i chmielniki owocują o ćwierć wcześniej.'},
  e4_pasza:{name:'Pasza z koniczyny',domain:'hodowla',req:[],cost:{ziarno:8},labor:40,skill:'hodowca',site:'zagroda',desc:'Siano z koniczyną i otręby zimą, kiedy łąka śpi.',effect:'Mleko i jaja: o 20% więcej.'},
  e4_pekl:{name:'Peklowanie solą',domain:'hodowla',req:['e4_pasza'],cost:{sol:6},labor:50,skill:'hodowca',site:'wedzarnia',desc:'Solanka, beczka i chłodna piwnica.',effect:'Mięso, ryby i wędliny psują się o 40% wolniej.'},
  e4_rama:{name:'Piła ramowa',domain:'rzemioslo',req:[],cost:{narz:2,deski:6},labor:50,skill:'ciesla',site:'tartak',desc:'Kilka pił w jednej ramie tnie kłodę na deski za jednym razem.',effect:'Drewno pozyskuje się o 25% szybciej, a budowy idą o 15% szybciej.'},
  e4_piec:{name:'Wielki piec',domain:'rzemioslo',req:['e4_rama'],cost:{cegla:12,kamien:10},labor:70,skill:'kowal',site:'kuznia',desc:'Wyższy piec i miechy od koła: żelazo płynie, a nie tylko mięknie.',effect:'Partie w pracowniach wymagają o 20% mniej pracy.'},
  e4_ksiegi:{name:'Księgi rachunkowe',domain:'nauka',req:[],cost:{deski:4,plotno:2},labor:40,skill:'rolnik',site:'magazyn',desc:'Każdy worek i każda beczka zapisane: co przyszło, co wyszło, co zostało.',effect:'Magazyny mieszczą o 20% więcej.'},
  e4_goscince:{name:'Gościńce między folwarkami',domain:'nauka',req:['e4_ksiegi'],cost:{kamien:20,drewno:10},labor:60,skill:'ciesla',site:'magazyn',desc:'Ubite drogi z rowami, mosty na brodach, znaki na rozstajach.',effect:'Dostawy i przeprowadzki jadą o 25% szybciej.'}
 };
 return{resources,food,spoil,crops,buildings,recipes,specialties,animals,householdUse,fitNeeds,specialtyFit,research};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=E4Catalog;
