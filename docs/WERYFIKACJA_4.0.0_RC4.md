# Weryfikacja 4.0.0-rc.4 — 17 października 2026

Aktualizację instalatora na bazie RC3 opisuje `WDROZENIE_RC4_PO_RC3_2026-10-17.md`. Poniższe wyniki są historycznymi wynikami pierwotnej RC4; kod gry pozostaje identyczny.

Pełna paczka zawiera RC3 i Epokę IV. Baza zdalnego main sprawdzona przed pakowaniem: `dbb965e6d76148daf06c3bad002708d03b780763`. Build: `607d90d0e4`. Wersja: `4.0.0-rc.4`.

## Wymagania i świeże dowody

| Wymaganie | Sprawdzenie | Wynik |
| --- | --- | --- |
| Brak rudy kieruje kuźnię po rudę | `production-supply.test.mjs` i Chromium z rzeczywistymi węzłami świata oraz pathfindingiem | PASS: przydział `wb` i budynek 501 zachowane; bez zastępowania braku rudy zbieraniem opału |
| Wolniejsze, fizyczne zaopatrzenie | Porównanie czasu zbioru przy tych samych umiejętnościach, rezerwacja i skończone złoże | PASS: 55% tempa pracy; zwykły plon, droga i dostawa |
| Restart w drodze nie duplikuje zasobu | Chromium 412×870, zapis/reload z rudą w rękach | PASS: ładunek 1,5 rudy, źródło 10→9, dostawa 0→1,5; źródło pozostaje 9 |
| Pełne progi kierują do prac wspólnych | Test wszystkich skonfigurowanych wyjść, także przy pustych wejściach | PASS |
| Brak źródła lub ogniwa łańcucha | Test źródeł wyczerpanych, zajętych, ukrytych i bez drogi; istniejący/brakujący mielerz | PASS: jawna blokada, bez tworzenia surowców i bez pozornego rozwiązania |
| Powrót do produkcji i zmiana przydziału | Test dostawy innego pracownika i ręcznego przeniesienia | PASS: zwolniona rezerwacja i zachowane pierwszeństwo nowego przydziału |
| Zadania, pomoc, śledzenie i mapa | Chromium na trzech rozmiarach; osobne scenariusze prośby i zapisu na dwóch rozmiarach | PASS: pomoc raz, przypięcie, lokalizacja, osoby, zapis stanu i offline reload |
| Cele pokazują rzeczywiste warunki aktu | Testy I/II/III i widok Chromium | PASS: bieżące predykaty/osiągnięcia zamiast starej listy `S.goals` |
| Całe menu w obu trybach | Chromium 412×870, 870×412, 1280×800 | PASS: pięć widocznych wejść, dziesięć działów, brak poziomego przepełnienia nawigacji, wyszukiwanie osób, rozwijane sekcje, pauza i przełączanie trybu |
| Epoka IV zachowuje swoje akcje | Testy widoków oraz rzeczywiste przejście do Epoki IV w Chromium | PASS: nowe widoki, lokalne magazyny, praca i transport dostępne |
| Bateria/Fotografia nie zatruwa zapisu | Regresja przed/po i kliknięcie Baterii w Chromium | PASS: przyciski bez `data-sp` nie ustawiają już tempa na `NaN`; zapis poprawny |
| Zapełniony localStorage i błędny zapis | Rzeczywiste przekroczenie limitu Chromium, diagnostyka, naprawa danych fixture, offline reload | PASS: odzysk miejsca kopii, brak podwójnej pomocy, jawny błąd i poprawny późniejszy zapis |
| Ukryta gra śpi | Chromium/WebGL 412×870 i 1280×800, po 16 s ukrycia | PASS: brak przyrostu klatek/draw calls i żądań sieci; 0 zarejestrowanych timerów, audio suspended |
| Powrót nie mnoży pętli | 8 szybkich przełączeń, natywny freeze/resume CDP, pagehide/pageshow | PASS: jedna pętla, jeden interwał i wznowione audio; zapis zachowany |
| Składnia i regresje całej gry | `npm run build`, `npm test` | PASS: 28 zestawów, 130 przypadków |
| Pełna pętla silnika i restarty | `npm run test:runtime` | PASS: 12 000 klatek, 10 restartów, 45 automatycznych zapisów; epoki I, III i IV |
| Instalacja paczki | Czysta kopia bazy, kontrola repo, fetch/fast-forward, kopiowanie, deterministyczny build, manifest i porównanie bajtów | Zobacz `weryfikacja4rc4/package-rehearsal.log`; bez commitu i push |

## Co znaleziono i poprawiono

`supply-before.log` i `menu-before.log` dokumentują brak wymaganych zachowań przed wdrożeniem. `settings-wiring-before.log` odtwarza rzeczywisty błąd `NaN !== 2`: wspólny listener paska tempa traktował także Baterię/Fotografię jak przycisk szybkości. Poprawka ogranicza zapis tempa do przycisków z `data-sp`. Nie potwierdza to przyczyny awarii konkretnej osady użytkownika, ponieważ nie otrzymano jej pliku awaryjnego.

Pierwszy test prawdziwego układu wykrył nawigację przesuniętą o 62 px poza ekran. Przyczyną był starszy kod w `p_ksiega.js`, który przenosił zakładki do nagłówka i narzucał poziomy scroll. Usunięto wyłącznie ten stary fragment nagłówka; końcowe scenariusze obu trybów i wszystkich trzech rozmiarów przeszły ponownie.

Za kod odpowiadają przede wszystkim `p_supply.js`, `p_journal.js`, `p_menu.js`, punkt integracji w `p_ratunek.js` i poprawka listenera w `p_rest.js`. Przejrzano wywołania zmienianych funkcji. Pełna bramka obejmuje również wcześniejsze naprawy zapisu, zadań i usypiania. Szczegółowy projekt całego menu jest w `MENU_4.0.0_RC4.md`.

## Granice wyniku

Chromium korzysta z programowego ANGLE/SwiftShader. Test widoczności świadomie nadpisuje właściwości widoczności dokumentu w izolowanej stronie; zatrzymanie/wznowienie przez CDP jest natywne. Nie jest to pomiar baterii, GPU, temperatury ani FPS fizycznego Androida. Profil dotykowy przeglądarki nie zastępuje odbioru palcem na telefonie. Ubicie procesu przez Androida pozostaje nieweryfikowane.

Scenariusz zaopatrzenia używa prawdziwego świata i drogi oraz wstawionego testowego rekordu kuźni. Weryfikuje logikę i kartę budynku; nie udaje nowego testu procesu budowy jego modelu. Runtime używa kontrolowanego czasu i atrap DOM/GPU; nie jest wielodniowym testem urządzenia.

Zachowano istniejące progi, warunki przepisów i rezerwę ziarna. Zaopatrzenie dotyczy indywidualnych przydziałów epok I–III; Epoka IV zachowuje własną autonomiczną gospodarkę. Zmiana klucza zapisu, reset osady i bezpośrednie wdrożenie z tego środowiska nie były potrzebne. Status RC pozostaje do odbioru na fizycznym telefonie.

## Odtworzenie

`npm run build`, `npm test`, `npm run test:runtime`, `node tools/browser-workspace.cjs`, `node tools/browser-supply.cjs`, `node tools/browser-lifecycle.cjs`, `node tools/browser-tasks.cjs`, `bash -n WDROZ_TERMUX.sh`, `git diff --check`.

Narzędzia Chromium uruchamiaj kolejno; korzystają ze wspólnego portu 4317. Wymagają zewnętrznego Playwright i Chromium. Obsługują `PRZYSTAN_PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, `PRZYSTAN_CHROMIUM_ARGS` (tablica JSON), `PRZYSTAN_START_SERVER=1`, `PRZYSTAN_BROWSER_OUTPUT` i izolowany `DATA_DIR`. Biblioteki QA nie są zależnościami samej gry.

Logi i raporty JSON znajdują się w `weryfikacja4rc4/`. Wewnętrznych zrzutów QA ani zapisu użytkownika nie dołączono. Próba paczki nie udaje ponownego wykonania całego instalatora: pełne testy i runtime przeprowadzono na identycznych bajtach źródła, a w czystej kopii ponowiono kontrolę wdrożenia, kopiowanie, build i integralność.
