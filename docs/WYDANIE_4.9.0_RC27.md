# Przystań 4.9.0-rc.27: lżejsze omijanie tłumu

Podstawa: 4.9.0-rc.26 (`d183189cb7da38b22588409ded9a97970b5eb582`).

Optymalizacja po pomiarze zużycia zasobów. Gra wykonuje o ok. połowę mniej pracy procesora w logice, co oznacza mniej grzania i dłuższą baterię.

## Co zjadało czas
Pomiar przeprowadzono w gotowej wsi epoki II (35 osób, ok. 8 dni gry). Ok. 36% czasu logiki szło na omijanie tłumu:
- gdy ktoś utknął za inną osobą, gra co 0,8 sekundy przeliczała mu drogę od nowa, osobno dla każdego wariantu obejścia (do 8);
- każde przeliczenie mogło przeszukać do 40 000 pól, czyli pół wyspy, zwłaszcza gdy cel był chwilowo zastawiony;
- przy każdym polu liczyło też od nowa nachylenie terenu.

## Teraz
- **Przeliczenie drogi przy utknięciu najwyżej co 1,5 sekundy.**
- **Krótkie obejście.** Każdy wariant obejścia szuka najwyżej 4000 pól zamiast 40 000. Gdy obejścia nie ma, osoba jak dotąd po ok. 2 sekundach przeciska się przez tłum.
- **Nachylenie terenu liczone raz** dla każdego pola. Pamięć czyści się przy każdej zmianie mapy: przy nowym budynku, nowej grze i wczytaniu.
- **Odstęp między ludźmi zostaje taki jak był** (0,22), mimo mniejszych postaci. Przy mniejszym odstępie osoba wchodziła na pole przeszkody i obejście przestawało działać, co wyłapał test nawigacji.

## Pomiar (ten sam przebieg przed i po)
| | Przed | Po |
| --- | --- | --- |
| Cały przebieg (ze startem gry) | 42,6 s | 22,0 s |
| Omijanie tłumu | ok. 15 s | 0,7 s |
| Rozgrywka bez startu gry | ok. 35 s | ok. 15 s |

Rysowanie było już ograniczone wcześniej (30 klatek w zwykłej grze, 20 w pauzie, 12 pod otwartą księgą, mniej w trybie oszczędnym). Na telefonie średnia jakość grafiki albo tryb oszczędny dodatkowo oszczędzają baterię.

## Sprawdzenie
- Kontrola w GitHubie: wszystkie testy, w tym przepływ tłumu, nawigacja i zakleszczenia.
