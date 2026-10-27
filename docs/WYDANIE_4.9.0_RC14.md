# Przystań 4.9.0-rc.14: dachy budynków w lustrzanym odbiciu

Podstawa: 4.9.0-rc.13 (`f7832f594bb1395b2276393c25f03a013a2c542c`).

## Objaw
Na telefonie część chat, domów i warsztatów wyglądała na rozebrane:
- nie było dachu ani części ścian;
- widać było ciemne wnętrze, belki i krokwie;
- skrzyżowane deski szczytu wisiały w powietrzu, a długie deski i żerdzie sterczały ukośnie ponad budynkiem.

Przez pierwsze sekundy po postawieniu albo rozbudowie budynek wyglądał dobrze, a potem psuł się znowu. Tak było np. zaraz po komunikacie „Gotowe: Zielnik rodzinny”.

## Przyczyna
Od 4.9.0-rc.11 mniej więcej co drugi budynek danego rodzaju stoi w lustrzanym odbiciu (ujemna skala w osi X).

Gotowe budynki są po 2,5 sekundy łączone we wspólne bryły, jedną na materiał w każdym kwadracie wyspy. To oszczędza wywołania rysowania i baterię. Przy łączeniu każdy wierzchołek jest przenoszony do świata razem z odbiciem, ale kolejność wierzchołków w trójkątach zostawała ta sama. Odbicie odwraca tę kolejność, więc karta graficzna uznawała zewnętrzne strony dachu i ścian za tylne i ich nie rysowała. Zostawały elementy widoczne od środka.

Pojedynczy budynek three.js odwraca sam (sprawdza wyznacznik macierzy), dlatego przed połączeniem i z parametrem `?nobatch` wszystko było dobrze.

Pomiar w teście: bez poprawki wszystkie 3362 trójkąty lustrzanej chaty we wspólnej bryle były odwrócone, a w zwykłej chacie żaden.

## Naprawa
- **Łączenie brył** (`src/p_e2m.js`, `batBuild`): gdy wyznacznik macierzy budynku jest ujemny, 2. i 3. wierzchołek każdego trójkąta zamieniają się miejscami. Dotyczy to położenia, normalnych, współrzędnych faktur i kolorów. Lustrzane budynki we wspólnej bryle mają znów dach i ściany na zewnątrz, także w cieniach.
- **Dym z komina** (`src/p_end.js`, `src/p_odkr.js`): przy lustrzanym budynku dym wychodził z drugiej strony dachu, bez komina. Teraz położenie dymu odbija się razem z budynkiem. Dotyczy chaty, domu, łaźni, wędzarni, piekarza, słodowni, cegielni, pieca i odkrywki.

## Sprawdzone i wykluczone
- **Utrata faktur po resecie GPU** (naprawiona w 4.8.0-rc.4): daje czarne, ale pełne ściany. Tutaj brakowało brył, więc to nie ta przyczyna. Zabezpieczenie z `p_tekstury.js` działa bez zmian.
- **Szczegóły z daleka** (`p_lod.js`): dotyczą tylko drzew, krzaków i drobiazgów, nie budynków.
- **Ruchome części budynków** (flagi, kołowroty, kury): nie trafiają do wspólnych brył i są rysowane osobno.
- **Inne lustrzane modele**: przysiółki i wioska powitalna używają modeli bez odbicia. Folwarki epoki IV nie są łączone we wspólne bryły.

## Testy
- `tests/odmiany.test.mjs`, nowy przypadek: lustrzana chata z rozbudową, połączona we wspólną bryłę, ma trójkąty skierowane na zewnątrz tak samo jak zwykła. Bez poprawki test nie przechodzi: 3362 z 3362 trójkątów odwróconych.
- W przeglądarce, na grafice niskiej, wysokiej i ultra: ta sama wieś ze wspólnymi bryłami wygląda tak samo jak bez łączenia (`?nobatch`). Dachy lustrzanych domów są na miejscu, z bliska widać komin i dym nad nim.
