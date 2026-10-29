# Przystań 4.9.0-rc.24: myśliwy, leśniczy i łowiska

Podstawa: 4.9.0-rc.23 (`954ed325fa9539e26fff5925472243ae434f6ec8`).

Pakiet 5 z „Przystań — plan życia Wyspy” razem z gałęzią leśniczego z planu wiedzy (W3). Leśniczy przestał być tylko kimś, kto sadzi drzewa. Teraz jest opiekunem lasu i zwierzyny, a jego fach trzeba przekazać uczniowi.

## Leśniczy
- **Własny fach.** Leśniczy uczy się przy sadzeniu i obchodach lasu. Mistrz może wziąć ucznia, jak w każdym innym fachu. Kto w starym zapisie pracował w leśniczówce, dostaje poziom fachu leśniczego zależny od fachu drwala (1 albo 2).
- **Obchód lasu.** Gdy nie ma gdzie sadzić, leśniczy nie stoi bezczynnie, tylko obchodzi las i liczy zwierzynę w okolicy.
- **Paśniki zimą** (z wiedzą „Paśniki i lizawki”). Leśniczy wykłada siano i ziarno (2 dziennie). Stada w okolicy, które dokarmiano zimą, mają wiosną dodatkowe młode.
- **Rada leśniczego** (z wiedzą „Łowy z umiarem”). Gdy stado w zasięgu myśliwych ledwo się trzyma albo wiosną ma młode, leśniczy przychodzi z radą. Ty decydujesz:
  - **posłuchać:** przez 5 dni nikt nie poluje na to stado;
  - **polować dalej:** mięso od razu.
- **Współpraca z myśliwym.** Gdy leśniczówka i chata myśliwego stoją blisko siebie, po kilku dniach leśniczy i myśliwy zaczynają chodzić razem po lesie. Od tej pory myśliwi nie ruszają stad, które ledwo się trzymają.
- **Bez następcy gorzej.** Gdy umrze doświadczony leśniczy, a nikt nie chodził z nim na obchody, przez dwa lata zwierzyna odrasta wolniej. Wiedza z gałęzi leśniczego żyje w ludziach jak każda inna, więc bez znawców przepada.

## Myśliwy
- **Tropienie z wiadomością.** Gdy w zasięgu chaty nie ma zwierzyny, myśliwy wraca z informacją, gdzie jest najbliższa, np. „Najbliżej są sarny, w krainie Stary Buk” albo „blisko osady”. Do tego rada: dać łowisku odpocząć albo postawić chatę dalej.
- **Karta chaty myśliwego** pokazuje, jaka zwierzyna jest w zasięgu, ile jej było kilka dni temu i czy jej ubywa. Gdy ubywa, radzi to samo. Podobną kartę ma leśniczówka, z liczeniem w szerszej okolicy.

## Gałąź leśniczego w drzewku (Hodowla)
| Węzeł | Epoka | Wymaga | Daje |
| --- | --- | --- | --- |
| Łowy z umiarem | I | tropienie oraz stojące leśniczówka i chata myśliwego | rada leśniczego; stada, na które się nie poluje, odrastają o połowę szybciej |
| Odnowienie lasu | I | łowy z umiarem, sadzonki krzewów | leśniczy sadzi dwa razy szybciej; szkółka drzew przy leśniczówce |
| Paśniki i lizawki | II | łowy z umiarem, siano na zimę | zimowe dokarmianie stad |
| Gajówka | II | paśniki, odnowienie lasu | urząd leśniczego osady: zwierzyna na całej wyspie odrasta szybciej |

Przeczucie tych węzłów rośnie z pracy leśniczego oraz myśliwego (przy łowach z umiarem i gajówce), drwala (odnowienie lasu) albo hodowcy (paśniki). Szkółka drzew przy leśniczówce wymaga teraz odnowienia lasu. Szkółki, które już stoją, zostają.

## Wiec: obyczaj łowów
Po roku polowań wiec decyduje, ile wolno brać z lasu:
- **Łowy bez zakazów:** więcej mięsa teraz, mniej zwierzyny później.
- **Okres ochronny wiosną:** wiosną nikt nie poluje, a stada rodzą więcej młodych.
- **Święty gaj:** najbliższy znany las staje się ostoją. Nie wolno w nim polować ani ścinać drzew, a zwierzyna chętnie tam wraca. Gaj jest nazwanym miejscem na mapie.

## Obława na wilki
Po napadzie wilków na zagrodę (najwyżej raz na pół roku) przychodzi karta:
- **Obława:** pada jeden albo dwa wilki, reszta watahy ucieka daleko, ale ktoś może wrócić pogryziony;
- **Pilnować zagrody nocami:** przez pół roku wilki napadają o połowę rzadziej, ale ludzie są trochę niewyspani.

Zasadzka na dziki w zbożu już była w grze („Dziki w zbożu”) i działa bez zmian.

## Testy
- `tests/lowy.test.mjs` (nowy, 8 przypadków):
  - fach leśniczego, także w starym zapisie;
  - gałąź leśniczego w drzewku;
  - tropienie z wiadomością i karta chaty;
  - obchód lasu i paśnik z młodymi wiosną;
  - rada leśniczego;
  - współpraca;
  - okres ochronny i święty gaj;
  - obława na wilki.
- `tests/postep.test.mjs`: Hodowla ma w epoce II pięć węzłów.
- Przebiegi z botem, który stawia też leśniczówkę, bez błędów i ostrzeżeń:
  - epoka I, 80 dni: 18 z 39 węzłów;
  - epoka II, 30 dni: 8 z 14 węzłów.
- Kontrola w GitHubie: wszystkie dotychczasowe testy przechodzą.
