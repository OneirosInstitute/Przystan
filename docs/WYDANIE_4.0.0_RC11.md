# Przystań 4.0.0-rc.11

Baza: main RC10 `2729bbabf1add082b5491881f64ddeaf2b67c505`. Wydanie wypchnięte prosto na main (Railway buduje z main).

## Naprawione

**Zatory ludzi (regresja z RC9 i RC10).** W nowej grze pierwszego dnia większość osadników stała.
W RC9 ludzie trzymali ładunek bez drogi do dostawy, a w RC10 stali w kolejkach przy wraku i obozie z napisem „Przejście zajęte — ustępuje i szuka obejścia”.

| Wersja | Jedzenie po 1. dniu | Deski z wraku | Ludzie w zatorze |
|---|---|---|---|
| 3.4 – RC8 | +40 do +53 | +50 | 0% |
| RC9 | −82 | 0 | (brak drogi do dostawy) |
| RC10 | −82 | 0 | ok. 50% |
| RC11 | +61 | +50 | ok. 4% (chwilowe ustąpienia) |

Zmiany w `p_navigation.js`:
- ostatnie kroki do celu (bez ładunku) nie czekają na tłum przy celu;
- z dwóch osób, które czekają na siebie dłużej niż 1 s, ustępuje ta z wyższym numerem;
- kto czeka dłużej niż 2,2 s, przeciska się przez tłum przez 1,6 s.

Ekipa wraku dostaje kilka stanowisk wokół mielizny zamiast jednego kafla (`p_ratunek.js`).
Test `crowd-flow` gra pół pierwszego dnia nowej gry i sprawdza: najwięcej 35% ludzi ustępuje naraz, nikt nie czeka ponad 6 s, coś zostało wyniesione z wraku, jedzenie nie spada, nikt nie ma „brak drogi”. Ten test na RC10 nie przechodzi, a na RC11 przechodzi.

## Nowe

- **Drogi** (`p_drogi.js`). Ścieżki wydeptują się z ruchu ludzi i dają +10% szybkości. Zakładka Budowa → Drogi z trzema nawierzchniami. Trasa jest liczona od sieci dróg albo obozu do wskazanego budynku i preferuje wydeptane ślady. Podgląd pokazuje długość, wydeptane pola, kamień i czas. Drogę układają budowniczowie (a gdy ich nie ma, wolne ręce), a kamień schodzi ze składu przy każdym kaflu. Płoty, ławy i ozdoby zostały w Ładzie wsi.
- **Rozbudowa domu** (`p_rest.js`, `p_bld.js`). Zawsze jest przycisk. Wymagania mają postać listy ✓/✗: wiedza z drogą do niej, miejsce, każdy materiał z ilością. Do tego karta zapasów domu: spiżarka, ciepło, ubrania, zdrowie. Zamiast „Poziom 1 · rozbudowy” jest „Rozbudowy przy domu”.
- **Wiata** (`p_serce.js`, `p_end.js`). Ma gliniany okap nad paleniskiem i komin z dymnikiem ponad strzechą, a dym wychodzi kominem.
- **Zorza** (`p_swiat.js`). Jest zakotwiczona w świecie: poświata w shaderach terenu i wody oraz kurtyny nad morzem za wyspą, ustawiane według kierunku kamery. Dawna nakładka przypięta do kamery jest usunięta.
- **Zadania główne** (`p_glow.js`). Po trzy na epokę, na górze zakładki Zadania. Bramy: wiec pokoleń, koniec epoki II, koniec epoki III i Wiec Rodów. Start od epoki II albo III zalicza wcześniejsze zadania. Opis jest w Księdze.

## Testy

- `npm run test:install`: 48 zestawów, w tym nowy `crowd-flow`.
- Zmienione asercje: w `repair-regression` sprawdzamy nową kartę rozbudowy (przycisk wyłączony, lista braków) i zorzę bez przypięcia do kamery. W `persistence` przygotowanie testu wiecu zalicza zadania główne epoki I, bo bez nich wiec się nie zbiera.
- `npm run test:runtime`: pętla epok I, III i IV.
- Przeglądarka z WebGL (programowym): produkcja pierwszego dnia, zatory, wytyczenie i ułożenie drogi do kamieniołomu (26 pól w 1,2 dnia przez dwóch budowniczych), karta chaty i domu, wiata w dzień i w nocy, zorza w czterech ujęciach, pełne przejście zadań głównych epok I–III.

## Do sprawdzenia na telefonie

FPS i nagrzewanie w nocy z zorzą, czytelność paska Dróg przy dużym palcu, długie trasy (ponad 80 pól), wczytanie zapisu z RC10 w trakcie epoki I i II.
