# Przystań 4.8.0-rc.4 — budynki nie czernieją

Podstawa: 4.8.0-rc.3 (`be101e5c4162de3c515a98ef6703eb26b2bb3a3c`).

## Objaw

Na telefonie ściany, dachy, namioty i beczki zrobiły się czarne i bez detali. Komin, belki, drzewa i trawa wyglądały dobrze.

## Przyczyna

Chrome na Androidzie trzyma płótna 2D na GPU. Faktury budynków (bale, deski, strzecha, gont, kamień, cegła, płótno, plecionka) są rysowane na takich płótnach.

Gdy GPU się resetuje (przełączenie aplikacji, blokada ekranu, mało pamięci), dzieje się kolejno:
1. płótna tracą zawartość;
2. WebGL odzyskuje kontekst i wgrywa faktury jeszcze raz, ale z pustych płócien;
3. każda powierzchnia z fakturą robi się czarna.

Elementy bez faktury nie zmieniają wyglądu. Odtworzone w przeglądarce testowej: utrata kontekstu WebGL i wyczyszczone płótna dają dokładnie ten obraz.

## Naprawa

- `src/p_tekstury.js` (ładowany jako pierwszy): płótna 2D poza dokumentem (faktury, znaki, dymki) dostają `willReadFrequently`. Są wtedy trzymane w zwykłej pamięci, której reset GPU nie rusza.
- `ctex`: gdyby płótno jednak straciło zawartość, na zdarzenie `contextrestored` faktura rysuje się na nowo i jest wgrywana ponownie.
- Po `webglcontextrestored` wszystkie faktury ze sceny są oznaczane do ponownego wgrania. Licznik resetów jest zapisywany w `GPU`, do diagnozy.

Gra, która już ma czarne budynki, wraca do normy po ponownym uruchomieniu.

Testy: `tests/tekstury.test.mjs` (2 przypadki) i kontrola w przeglądarce (utrata i odzyskanie kontekstu WebGL z wyczyszczonymi płótnami).
