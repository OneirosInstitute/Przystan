# Przystań 4.9.0-rc.13: przegląd całego main

Podstawa: 4.9.0-rc.12 (`fe1a683`).

To wydanie nie dodaje treści. Zbiera poprawki z przeglądu całego kodu main:
- analiza statyczna całego pakietu (podwójne definicje, nakładki na stałe, wyniki `ok:false` bez komunikatu);
- długie przebiegi gry z botem i sprawdzaniem stanu po każdym dniu (epoka I przez 80 dni na trzech wyspach, epoki II, III i IV, wariant z bogatą osadą);
- przejście po wszystkich zakładkach, sekcjach i kartach w przeglądarce, na telefonie i na komputerze;
- wszystkie narzędzia przeglądarkowe projektu.

## Znalezione błędy i poprawki

### Wyspa tygodnia (`src/p_tydzien.js`, `server.js`)
- **Wynik w epoce III i IV był niższy niż na serwerze.** Gra dodawała premię 500 tylko w epoce II, a serwer dodaje ją od epoki II wzwyż. Teraz premia jest liczona od epoki II wzwyż, tak samo w grze i na serwerze.
- **Epoka IV nie mogła wysłać wyniku.** Serwer przyjmował tylko epoki 1–3, więc odpowiadał 400. Teraz przyjmuje 1–4, a epokę 5 nadal odrzuca.
- **Błąd wysyłki wracał co 5 sekund.** Po każdym błędzie gra próbowała ponownie przy następnym takcie mapy, co bez sieci zużywało baterię. Teraz:
  - odrzucenie przez serwer (4xx) czeka do następnej pory roku;
  - brak sieci albo błąd serwera (5xx) próbuje ponownie po 30 s, potem po 1 min, 2 min i tak dalej, najrzadziej co 10 minut.
- **Nieoczekiwana odpowiedź serwera.** Odpowiedź `tydzien` jest teraz sprawdzana (tydzień, numer wyspy, wyzwanie), zanim pojawi się na ekranie startowym. Wiersze tabeli zamieniają wynik, liczbę ludzi i dzień na liczby.

### Serwer (`server.js`)
- **Brakujący plik zwracał stronę gry.** Brakujący skrypt, obrazek albo ikona dostawały `index.html` z kodem 200. Przeglądarka i pracownik offline zapisywały wtedy HTML pod adresem skryptu. Teraz brakujący plik z rozszerzeniem (innym niż `.html`) dostaje 404, bez zapisu w pamięci podręcznej. Adresy bez rozszerzenia nadal prowadzą do gry.

### Aktualizacja w czasie gry (`src/p_update.js`)
- **Otwarta gra nie przeładowywała się po nowym wydaniu.**
  - Od 4.6.0-rc.2 strona pomijała przeładowanie, gdy adres nowego pracownika offline miał jej wersję.
  - Gdy wydanie wchodziło w czasie gry, nowy pracownik przychodził pod tym samym adresem, więc stara strona grała dalej, a pamięć podręczna miała już pliki nowej wersji.
  - Teraz przeładowanie jest pomijane tylko wtedy, gdy nowego pracownika zarejestrowała ta strona, czyli gdy adres zmienił się na jej wersję.
  - Nowa treść pod tym samym adresem to nowe wydanie. Gra zapisuje się wtedy i ładuje raz.
  - Pojedyncze ładowanie po wejściu do nowej wersji, wprowadzone w 4.6.0-rc.2, zostaje bez zmian.

### Epoka IV: głód (`src/p_e4_economy.js`)
- **Przy braku jedzenia wszyscy umierali tego samego dnia.** Każdy tracił siły w tym samym tempie, więc po kilku dniach osada wymierała naraz i bez ostrzeżenia. Teraz:
  - małe dzieci i starsi słabną szybciej, a reszta w różnym tempie, zależnym od osoby i stałym między zapisami;
  - pierwszy dzień głodu daje jedno ostrzeżenie w kronice: „brakuje jedzenia. Ludzie słabną…”. Kolejne ostrzeżenie przychodzi dopiero po tym, jak osada znów była najedzona.

### Epoka IV: zakładanie folwarku i dostawy (`src/p_e4_ui.js`)
- **Wybór krainy i specjalizacji znikał sam.**
  - Panel epoki IV przerysowuje się, gdy zmieniają się liczby (zapasy, dzień).
  - Każde przerysowanie wracało do pierwszej rodziny, krainy i specjalizacji, więc wybrany zestaw przepadał po chwili.
  - Przycisk „Wyślij rodzinę” robił się wtedy nieaktywny („Ta kraina tego nie udźwignie”).
  - Teraz wybory w polach panelu (rodzina, kraina, specjalizacja, cel i towar dostawy) zostają po odświeżeniu.

### Wieczorna karta i zapis (`src/p_opowiesci.js`)
- **Zapis w trakcie czytania wieczornej karty zapamiętywał pauzę.** Karta zatrzymuje czas. Jeśli w tym czasie gra zapisała się (np. przy wyjściu z aplikacji), po wczytaniu stała w miejscu. Teraz zapis bierze prędkość sprzed karty, a gra nadal stoi, dopóki karta jest otwarta.

### Wiec rodów w epoce III (`src/p_e4_ui.js`)
- **Przycisk zwołania wiecu za wcześnie nic nie robił.** Teraz pokazuje powód, np. że najpierw trzeba skończyć zadania główne epoki III.

### Rozwijane sekcje (`src/p_ui_sections.js`)
- **Sekcja otwarta dotknięciem zamykała się sama.** Gdy panel przerysował się, zanim przeglądarka zgłosiła rozwinięcie, sekcja wracała do poprzedniego stanu. Teraz stan sekcji zapisuje się już w chwili dotknięcia nagłówka.

### Przysiółki a cele epoki III (`src/p_przysiolki.js`)
- **Cel epoki III liczył krainy, w których nie wolno już stawiać przysiółków.** Od rc.12 trzy krainy najbliżej Przystani nie przyjmują przysiółków. Mimo to:
  - cel „zasiedl krainy” nadal liczył je jako potrzebne, przez co był nie do wykonania;
  - licznik zasiedlonych krain ich nie liczył.
- Teraz trzy najbliższe krainy liczą się jako zasiedlone przez samą Przystań. Potrzebne są tylko krainy, w których przysiółek wolno założyć.

## Narzędzia przeglądarkowe dopasowane do gry
- `tools/browser-tasks.cjs`, `tools/browser-mobile-ui.cjs`: wersja z `package.json` zamiast wpisanej na stałe `4.0.0-rc.4`.
- `tools/browser-mobile-ui.cjs`: nawigacja przez dolne menu (`nvGo`) zamiast dawnych arkuszy.
- `tools/browser-workspace.cjs`, `tools/browser-e4.cjs`: zadania główne epoki III oznaczone jako zrobione przed wiecem, bo od 4.x wiec ich wymaga.
- `tools/browser-e4.cjs`: otwarte sekcje i wybór krainy oraz specjalności, dla których założenie folwarku jest możliwe.

## Testy
- **`tests/debug-fixes.test.mjs` (6 przypadków):**
  - wynik w każdej epoce oraz ponawianie z rosnącą przerwą;
  - jedno ostrzeżenie o głodzie i różne tempo słabnięcia;
  - zapis w trakcie wieczornej karty;
  - powód przy za wczesnym wiecu;
  - stan sekcji zapisany przy dotknięciu;
  - przeładowanie po wydaniu w czasie gry tylko wtedy, gdy trzeba.
- **`tests/server.test.mjs`:** epoka IV przyjęta, epoka 5 odrzucona; brakujący skrypt i ikona dają 404, a strona bez rozszerzenia daje grę.
- **`tests/przysiolki.test.mjs`:** nowy przypadek: trzy najbliższe krainy liczą się jako zasiedlone i nie są potrzebne do celu epoki III.
- **Długie przebiegi z botem (stan sprawdzany co dzień, zapis i wczytanie co 5 dni):**
  - epoka I przez 80 dni na wyspach 2207, 1234 i 777;
  - epoka II przez 60 dni, epoka III przez 50 dni;
  - wariant z bogatą osadą.
  - Wynik: bez NaN, bez ujemnych zapasów, bez wiszących odwołań, bez ostrzeżeń w konsoli.
- **Przegląd w przeglądarce:** wszystkie zakładki, sekcje i karty, na telefonie i na komputerze, bez błędów.
- **Narzędzia przeglądarkowe:** wszystkie przechodzą (ai, e4, hardening, lifecycle, master, mobile-ui, navigation, people, supply, tasks, workspace).
