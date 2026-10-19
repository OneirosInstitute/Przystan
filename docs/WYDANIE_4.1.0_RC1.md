# Przystań 4.1.0-rc.1 — Złoża

Baza: main RC11 `e1541e93b40dd1352958a7ed268e1642b28a20db`. Wydanie wypchnięte prosto na main (Railway buduje z main).
Pierwszy krok planu z [projektu wyspy](PROJEKT_WYSPY_5.md), rozdział 3: złoża skupione, duże i skończone.

## Nowe

**Złoża** (`p_zloza.js`, w kolejności budowania po `p_odkr.js`). Złoża dopisują się do miejsc na wyspie (`ODK`), więc działają jak odkrycia: z daleka zagadka, rozpoznanie na miejscu, wpis w kronice, wiedza o budowlach.

| Złoże | Położenie (z ziarna wyspy) | Warstwy | Budowle |
|---|---|---|---|
| Węgiel | wychodnie z 4.0 | 2000 / 6000 / 12000 | odkrywka (płytka), **szyb węglowy** (głębsza, najgłębsza) |
| Torf | torfowiska z 4.0 | 1500 / 3500 | kopanka torfu |
| Ruda | 2 złoża, wyżyny i stoki, 25–90 pól od obozu | 1500 / 5000 / 9000 | **kopalnia rudy** |
| Kamień | 2 złoża przy skałach, 14–75 pól | 4000 / 12000 / 30000 | **łom kamienia** |
| Glina | 2 złoża nad wodą, 10–75 pól | 2000 / 5000 | **gliniak** |

- Budynek musi stać na odkrytym złożu (do 9 pól od środka). Postawienie gdzie indziej pokazuje powód w podglądzie i w komunikacie.
- Produkcja zjada warstwy, do których budynek sięga. Gdy są puste, ludzie przestają pracować („złoże wyczerpane — potrzebny głębszy szyb albo inne złoże”), kronika o tym mówi i podpowiada szyb, jeśli głębiej coś zostało.
- Odkryte złoże otaczają paliki w kolorze surowca z jasnymi tabliczkami. Karta złoża pokazuje warstwy z paskami, kto tam pracuje i przyciski budowli (przycisk zaczyna stawianie od razu przy złożu).
- Modele: kopalnia i szyb z wieżą wyciągową, kieratem i hałdą; łom ze schodkową ścianą i żurawiem; gliniak z wyrobiskiem, kałużą i daszkiem do suszenia cegieł.
- „Jeszcze nie umiecie” przy nowych budowlach mówi, co odkryć.

**Zgodność zapisów.** Żyła odkrywki z 4.0 (600 porcji) przechodzi w płytką warstwę: to, co już wykopano, zostaje odjęte. Budynki postawione wcześniej przy złożu rozpoznają je pierwszego dnia po wczytaniu.

## Testy

- Nowy zestaw `deposits` (5 przypadków): komplet złóż w zasięgu na wyspie 2207 i trzech innych (31, 4096, 12345), rozpoznanie złoża dopiero na miejscu i odblokowanie kopalni, łom zjadający warstwy i stający po wyczerpaniu, odmowa budowy poza złożem, przejście starej żyły węgla.
- `tests/runtime.mjs` przyjmuje `search` (np. `?seed=31`), żeby testy mogły grać na innych wyspach.
- `npm run test:install`: 49 zestawów. `npm run test:runtime`: pętla epok I, III i IV.
- Przeglądarka z WebGL (programowym): położenie dziesięciu złóż, odkrycie wszystkich, łom, kopalnia i gliniak postawione na złożach, dwa dni pracy: kamień +132 i warstwa 4000 → 3868, ruda i glina przybywają, karta złoża z warstwami, brak błędów w konsoli.
- Osiem wysp (2207, 31, 777, 4096, 12345, 9001, 555, 1): każda ma po dwa złoża rudy, kamienia i gliny oraz węgiel, wszystkie osiągalne lądem, najdalsze 136 pól od obozu.

## Jeszcze nie w tym wydaniu

Charaktery krain (żyzne doliny, kwitnące łąki z barciami), poszukiwania z wyborem, gdzie kopać, i hałdy rosnące z wydobyciem są w planie 4.3 i 4.4 razem z wyspą 384 i folwarkami ze złóż. Przebudowa menu to 4.2.

## Do sprawdzenia na telefonie

Czy paliki złoża są dobrze widoczne z oddalenia, czy przycisk budowli w karcie złoża trafia z podglądem we właściwe miejsce, płynność po dobudowaniu kilku kopalń.
