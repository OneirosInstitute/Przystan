# Przystań 4.7.0-rc.1 — Drzewo postępu w każdej epoce

Baza: main 4.6.0-rc.4 `c7e7d41`. Prace na gałęzi `wyspa-384`, wydanie scalone na main (Railway buduje z main).

Do tej pory drzewo postępu kończyło się na epoce I: przy przejściu do epoki II wszystko było już poznane, a dalej nie było czego się uczyć. Teraz każda epoka dokłada nową wiedzę, a część z niej otwiera nowe rozbudowy budynków.

## Drzewo w Wiedzy (`p_tech.js`, `p_postep.js`)

- Węzeł może mieć epokę (`ep`). Umiejętność z dalszej epoki czeka, aż osada do niej dojdzie (`epNow()`: epoka II po wiecu pokoleń, III od wiecu całej wyspy, IV po Wiecu Rodów).
- Epoki II i III dokładają w każdej z czterech dziedzin po trzy umiejętności: dwie na początek i jedną, która łączy obie. To razem 24 nowe węzły. Doświadczenie dalej przychodzi z pracy ludzi w danej dziedzinie, tak jak w epoce I. Progi wynoszą 450 i 650 w epoce II oraz 750 i 1000 w epoce III. W gotowej wsi każda dziedzina zbiera 15–30 doświadczenia dziennie, więc pierwsza umiejętność przychodzi po roku–półtora, a cała epoka zajmuje kilka lat.
- Drzewo ma pasy epok z nagłówkiem i licznikiem. Epoka w pełni poznana zwija się do jednej linii („Pokaż”). Pod drzewem karta zapowiada, co przyniesie następna epoka.
- Gotowa wieś z szybkiego startu (koniec epoki I) zna całą epokę I, ale nie dostaje za darmo nowych umiejętności. Szybki start epoki III zna całą epokę II.

| Dziedzina | Epoka II · Wieś | Epoka III · Cała wyspa |
|---|---|---|
| Uprawa | Radło z lemieszem (zboże +15% szybciej, Brona) · Rozsada i inspekty (ogrody +50%, Inspekt) · Trójpolówka z obornikiem (plon +15%, gleba męczy się o 40% mniej) | Młynarstwo (żarna, wiatrak, piekarnie +30%) · Pola przysiółków (przysiółki +20%) · Słód i chmiel (browar, słodownia, chmielnik, miodosytnia, winnica, winiarnia +25%) |
| Hodowla | Łodzie klepkowe (ryby +20%, Suszarnia sieci) · Siano na zimę (mleko zimą bez obory, Kojec) · Ser podpuszczkowy (serownia i kiszonki +30%, mleko psuje się wolniej) | Woły w zaprzęgu (wozy +25% szybciej i częściej, Stajnia) · Wypas na halach (mleko i sierść +15%, więcej koźląt) · Masarstwo (mięso i ryby psują się o 30% wolniej, Solarnia) |
| Rzemiosło | Czeladnicy (miejsce na rozbudowę więcej w każdym budynku z pracownikami) · Koło garncarskie (garncarnia, cegła, glina +25%, Półki do suszenia) · Gont i więźba (zużycie −30%, Strych) | Okucia wozów (wozy +30% szybciej) · Kołowrót i bloczek (kamieniołomy, łomy, kopalnie, szyby +20%, Kołowrót) · Zaprawa wapienna (poziom 3 −25%, budowy +15%) |
| Nauka | Rachunek na karbach (doświadczenie +10%) · Lecznictwo (choroby zimą −30%, zielarka leczy szybciej, Suszarnia ziół) · Miernictwo (drogi do przysiółków −30%, szybciej) | Szkoła przy wiecu (uczniowie i dzieci +50%) · Atlas wyspy (wyprawy −25% czasu, −20% ryzyka) · Spisane prawo (przysiółki rosną o połowę szybciej) |

Każdy efekt działa tam, gdzie mówi opis. Pracownie mają mnożnik w `bMul`, a reszta siedzi w swoich miejscach: pola, ryby i mleko w `p_rest.js`, zużycie, poziomy i miejsca na rozbudowy w `p_bld.js`, drogi w `roadCost`, wyprawy w `expDays` i `expRisk`, wozy w `p_handel.js` i `p_woz.js`, choroby w `p_rok.js`, przysiółki w `hamRate` i `p_ludzie.js`.

## Rozbudowy budynków

- Rozbudowa może wymagać wiedzy (`need`). Bez niej karta budynku pokazuje rozbudowę z opisem i informacją, czego się nauczyć („wymaga wiedzy „Siano na zimę” (Wiedza → Hodowla)”). Rozbudowa z dalszej epoki pojawia się dopiero, gdy ta epoka jest blisko. Takiej rozbudowy nie da się zacząć ani opłacić.
- Nowe rozbudowy, każda z własnym wyglądem:
  - przy polu Brona (plon +10%);
  - przy chacie i domu Inspekt (warzywa także zimą);
  - przy pomoście Suszarnia sieci (+25%);
  - przy zagrodzie Kojec (4 kozy więcej, z boku zagrody, każda koza ma swoje miejsce);
  - przy składzie Strych (+200);
  - przy spiżarni Solarnia;
  - przy garncarni Półki do suszenia;
  - przy chacie zielarki Suszarnia ziół;
  - przy zajeździe Stajnia (wozy przywożą +25%);
  - przy kamieniołomie, wykopie rudy, łomie, kopalni i szybie Kołowrót z bloczkiem;
  - przy kurniku Grzędy i gniazda.
- Pracownie z dalszych epok, które nie miały żadnej rozbudowy (żarna, piec chlebowy, serownia, komora kiszonek, bednarnia, słodownia, browar, miodosytnia, piekarnia, winiarnia, wiatrak, kopanka torfu, dymarka, sztolnia, szkutnia, ptasznicy, odkrywka, łom, gliniak, kopalnia, szyb), mają teraz „Lepsze stanowisko”.
- Czeladnicy dają każdemu budynkowi z pracownikami miejsce na jeszcze jedną rozbudowę. Domy zostają przy swoich pięciu.
- Poprawka: karta zagrody pokazywała zawsze „/10” kóz, także z większym wybiegiem. Teraz pokazuje prawdziwą pojemność.

## Epoka IV: nauki rodów (`p_e4_catalog.js`, `p_e4_economy.js`, `p_e4_life.js`, `p_e4_ui.js`)

- Osiem nauk w tych samych czterech dziedzinach, po dwie w każdej:
  - Uprawa: Koniczyna w płodozmianie (plony +15%), a po niej Szczepienie drzew (próby udają się częściej, sady, winnice i chmielniki owocują o ćwierć wcześniej).
  - Hodowla: Pasza z koniczyny (mleko i jaja +20%), a po niej Peklowanie solą (mięso, ryby i wędliny psują się o 40% wolniej).
  - Rzemiosło: Piła ramowa (drewno +25%, budowy +15%), a po niej Wielki piec (partie w pracowniach −20% pracy).
  - Nauka: Księgi rachunkowe (magazyny +20%), a po nich Gościńce (dostawy i przeprowadzki +25% szybciej).
- Wiec uczy się jednej rzeczy naraz w wybranym ośrodku (Wiedza → Nauki rodów). Wybrany ośrodek płaci materiałem raz, a ludzie naprawdę chodzą się uczyć: to zwykłe zadanie w ich dniu, z godzinami pracy jak przy budowie czy próbach upraw. Zadanie widać w Zadaniach.
- Wiedza należy do wszystkich ośrodków. Zapis `S.e4.nauki` (`done`, `active`), sprawdzany przez `E4Domain.validate`. Starsze zapisy dostają pusty stan przy wczytaniu.
- Bez poznanych nauk symulacja liczy dokładnie tak jak wcześniej, więc wcześniejsze zestawy epoki IV dają te same wyniki.

## Bateria

Drzewo liczy się tylko przy otwartej Wiedzy. Mnożniki to pojedyncze sprawdzenia przy pracy. Miejsca kóz w zagrodzie są zapamiętane dla każdej zagrody i liczą się od nowa tylko po zmianie jej rozbudów, nie w każdej klatce.

## Testy

- Nowy zestaw `postep` (8 przypadków):
  - trzy umiejętności na epokę w każdej dziedzinie; nic nie zależy od późniejszej epoki;
  - epoka II zbiera doświadczenie we wszystkich dziedzinach, a epoka III jest zamknięta;
  - zwijanie poznanej epoki;
  - szybki start epoki III;
  - działanie efektów;
  - rozbudowa wymagająca wiedzy (nie da się jej zacząć ani zapłacić, a po nauce działa, przechodzi zapis i wczytanie);
  - wygląd wszystkich nowych rozbudów;
  - nauki rodów (jedna naraz, płatność raz, ludzie się uczą, efekt, zapis, walidacja).
- Wszystkie zestawy (`npm run test:install`, `npm run test:runtime`, `tools/verify-package.cjs`).
- W przeglądarce (telefon 412 × 870):
  - drzewo w epokach II i III, zwinięte i rozwinięte;
  - karta zagrody z kojcem;
  - wygląd rozbudów przy zagrodzie, składzie, polu, pomoście, kamieniołomie i chacie;
  - nauki rodów w epoce IV: przycisk, postęp i ludzie, którzy „uczą się”;
  - bez błędów w konsoli.
