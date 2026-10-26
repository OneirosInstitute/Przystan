# Przystań 4.9.0-rc.9: styl epoki po remoncie albo rozbudowie

Podstawa: 4.9.0-rc.8 (`fea2327057170c9324addb5a08ba3a518fbb551a`).

To paczka C z planu budynków. Zgodnie z decyzją: styl epoki zmienia się dopiero po remoncie albo rozbudowie.

## Co się zmieniło
Każdy budynek pamięta, w stylu której epoki stoi. Jest to epoka, w której go postawiono albo ostatnio wyremontowano lub rozbudowano.

**Epoka I (rozbitkowie):**
- ciemne, surowe bale;
- darń albo stara strzecha;
- bez malowanych okiennic, koników i ganków.

**Epoka II (wieś):** wygląd jak dotąd, czyli strzecha i gont, malowane okiennice, koniki.

**Epoka III (cała wyspa):**
- bielone ściany;
- dachy z gontu i desek;
- zawsze malowane okiennice;
- koniki na szczytach i obramienia okien.

## Kiedy styl się zmienia
- Gdy osada wchodzi w nową epokę, stare budynki zostają takie, jakie były. W kronice pojawia się wtedy jedna wskazówka.
- Remont albo rozbudowa do wyższego poziomu przenosi budynek w styl bieżącej epoki. Rozbudowa szałasu w chatę i chaty w dom też.
- Dobudówki (np. suszarnia, łódź) stylu nie zmieniają.
- Karta budynku pokazuje styl, np. „Styl: epoka I · rozbitkowie. Remont albo rozbudowa przeniesie go w styl epoki II”.
- Budynki ze starych zapisów nie mają zapisanej epoki i wyglądają dokładnie tak jak wcześniej.

## Technicznie
- `src/p_epoki.js`:
  - nowe pole zapisu `b.ep`;
  - nakładki na `styFor`, `finishProj`, `upgradeB`, `tryPlace`, `addBuildingMesh`, `bldPanelHTML`, `mapTick`.
- Epokę bierze z `epNow()`, więc epoka III liczy się od uruchomienia wyspy (`S.e3.on`).
- W epoce IV pole `b.ep` się nie zmienia, bo epoka ma własne folwarki.

## Testy
`tests/epoki.test.mjs` (2 przypadki):
- remont i rozbudowa zmieniają styl, dobudówka nie;
- karta budynku;
- nowy budynek dostaje styl swojej epoki;
- dachy, okiennice i koniki epoki I i III.
