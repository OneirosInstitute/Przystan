# Odbiór 4.0.0-rc.6

Weryfikacja lokalna: Node 24, Chromium 133 z programowym WebGL. Bazą jest wdrożone RC5 `2ad9ac443492552da5690146b734c4600b295db7`.

## Wyniki

| Bramka | Wynik |
|---|---|
| Pokrycie regresji wydania | 35 zestawów, 176 przypadków, wszystkie zakończone pomyślnie w dwóch partiach |
| Końcowy instalator z czystej kopii main | 35 zestawów, 174 kontrole instalacyjne, próba silnika i integralność PASS |
| Ochrona własnych zmian | Instalator odrzucił brudny katalog przed kopiowaniem; plik użytkownika pozostał identyczny |
| Epoki I–III | Po 40 dobach w każdej epoce stan gry identyczny z RC5 przy tym samym ziarnie i zegarze testowym |
| 1500 dni: jedna osada | 125 żyjących, 9 pokoleń, 168 narodzin, 61 zgonów, 27 sukcesji |
| 1500 dni: wiele osad | 635 żyjących, 4 zamieszkane ośrodki, 8 pokoleń, 62 dostawy, 81 sukcesji |
| Praca i pola | 196 z 200 pól zebranych w 6 dni w próbie dużego gospodarstwa; 11 specjalizacji uruchamia właściwy produkt |
| Próba pętli silnika | 12 000 klatek, 10 restartów i 45 zapisów automatycznych w epokach I, III i IV |
| Chromium: menu | Dwa tryby, 8 działów, 412×870, 870×412 i 1280×800; Zadania, pomoc, śledzenie, lokalizowanie i odczyt offline PASS |
| Chromium: ludzie | Pozycje modelu zgodne z osobą, stała pozycja na pauzie, prędkości 1/2/4/8, zgodne położenie 200 pól, poprawny zapis |
| Chromium: RC6 | Zapis obejmuje końcową zmianę doby; uszkodzony zegar odrzucony bez zmiany działającej osady |
| Chromium: cykl życia | 16 s ukrycia bez nowych klatek, rysowania, interwałów i timeoutów; dźwięk zawieszony; freeze/resume i odczyt zapisu PASS |

## Sposób wykonania i ograniczenia

Pierwsze wywołanie `npm test` zakończyło się kodem 1 bez końcowego podsumowania, po pomyślnym wykonaniu pierwszych 13 zestawów, w tym obu symulacji 1500 dni. Przyczyny zakończenia procesu nie ustalono. Nie uznano tego wywołania za zieloną bramkę. Pozostałe 22 zestawy wykonano osobno, szeregowo, z kontrolą kodów wyjścia i kompletnych podsumowań. Łącznie pokryto wszystkie 176 przypadków. Rozliczenie nazw i przypadków jest w `weryfikacja6/release-gates.json`.

Po dopracowaniu reguł katalogów i aktualizacji bazy wdrożenia powtórzono testy odpowiednich kontraktów oraz pełny końcowy instalator na aktualnym źródle. Próba instalatora wykryła dodatkowo test przywiązany do numeru RC5; poprawiony test porównuje komunikat z wersją paczki. Końcowa próba przeszła w całości. Użyto trybu `--prepare-only`; HEAD pozostał na bazie, bez zewnętrznego commitu i push.

Porównanie epok I–III to syntetyczna próba zachowania przy kontrolowanym zegarze i zasobach, a nie osobny dowód balansu. Długie próby epoki IV obejmują rzeczywistą pracę, zużycie zasobów, transport i kolejne pokolenia.

Programowy WebGL nie mierzy wydajności telefonu. Nie sprawdzono zużycia baterii, temperatury, odczuć dotyku, FPS na fizycznym Androidzie ani ubicia procesu przez system. CI dla Node 18/24 jest skonfigurowane, ale nie uruchamiano go zdalnie w tym zadaniu.

## Zakres zmian

`AUDYT_HARDENING_RC6.md` opisuje potwierdzone usterki, ich poprawki i pozostały dług. `PLAN_ROZWOJU_PO_RC6.md` zawiera kolejność dalszych prac. RC6 konsoliduje przebieg doby; nie jest przebudową całego planera SI ani całej fizyki i renderowania.
