# RC6 — przegląd logiki, hardening i konsolidacja

To odbiór ograniczonego etapu technicznego, a nie potwierdzenie gotowości całej gry do premiery. Przegląd objął architekturę składania gry, przebieg doby oraz granice zapisu, zegara, ruchu i pracy epoki IV. Plan dalszego przeglądu SI i świata: `PLAN_ROZWOJU_PO_RC6.md`.

## Potwierdzone problemy i poprawki

| ID | Problem przed poprawką | Skutek / poprawka |
|---|---|---|
| H1 | Rdzeń doby wykonywał `save()` przed dziennymi aktualizacjami późniejszych warstw | Ostatni zapis doby mógł pomijać aktualizacje epoki II i serca osady. Zapis jest teraz na końcu jawnego przebiegu wszystkich faz. |
| H2 | `newDay` był siedmiokrotnie nadpisywany w różnych plikach | Kolejność była zakodowana w zamknięciach zależnych od ładowania. Jest jedna definicja w `p_daily.js` i jawne wywołania faz. Rdzeń zachowuje swoją logikę. |
| H3 | Walidacja epoki IV sprawdzała bieżący licznik, lecz nie jego początek i upływ | Uszkodzone `startTime`/`startTicks` mogły przejść import i zanieczyścić następny krok czasu. Jeden kontrakt `clockIssue` służy importowi i wykonaniu. |
| H4 | Zapis przyjmował transport z terminem przybycia równym lub wcześniejszym od bieżącego zegara | Pętla wybierająca najbliższe zdarzenie mogła wrócić do wcześniejszego czasu. Taki stan jest odrzucany także przed wykonaniem kroku. |
| H5 | Zapis działania nie sprawdzał celu, zgodności długości trasy z geometrią ani ujemnych rozliczeń pracy | Uszkodzony cel/trasa mógł powodować błąd ruchu, a ujemny dziennik zniekształcać rozliczanie pracy. Dodano sprawdzanie tych danych. |
| H7 | Walidacja katalogu akceptowała odziedziczone nazwy, np. `toString`, jako budynek, uprawę lub recepturę | Zapis mógł wskazać element bez definicji gospodarczej. Walidacja wymaga teraz własnego wpisu katalogu. |
| H6 | Odrzucony argument kroku czasu był sprawdzany po inicjalizacji modelu | Błędne wywołanie zmieniało stan mimo wyjątku. Argument, kontrakt zegara i przepełnienie licznika są sprawdzane przed mutacją. |

H3–H5 oraz H7 dotyczą przede wszystkim uszkodzonych lub zmienionych danych zapisu. Testy nie dowodzą, że normalna rozgrywka sama tworzyła takie stany. Nie są to zabezpieczenia przed dowolnym oszustwem w grze uruchamianej po stronie klienta.

## Zachowana semantyka doby

Kolejność: zapamiętanie opału → tymczasowa ochrona żywności solą → rdzeń doby → historia zapasów → trzy aktualizacje epoki II → przywrócenie psucia → hodowla → serce osady → zapis.

Ustawienia psucia wracają do dokładnie zapamiętanych wartości, także przy wyjątku rdzenia. Błąd opcjonalnej fazy jest raportowany przez `console.warn`; późniejsze fazy zachowują dotychczasową możliwość wykonania. Wyjątek rdzenia nie wykonuje końcowego zapisu. Nie dodano transakcyjnego cofania wszystkich mutacji całej doby — to wymaga osobnego projektu.

Epoka IV zachowuje swój deterministyczny zegar i obsługę zdarzeń. Walidacja dopuszcza dojście dłuższe niż dostępne okno pracy oraz działanie zablokowane bez trasy. Zachowano istniejącą tolerancję dotarcia mniejszą niż 0,1 jednostki. Trasa transportu może składać się z jednego punktu, jeśli ma zerową długość zgodną z geometrią.

## Pozostały dług architektoniczny

Przed zmianą proste wyszukiwanie przypisań funkcji wykazało 17 nakładek planowania pracy, 10 kroku osoby i 30 aktualizacji mapy. Same liczby nie dowodzą błędnego zachowania. Wskazują koszt zmian i potrzebę testów charakterystycznych przed kolejną konsolidacją. RC6 usuwa siedem nakładek doby, nie przepisuje całej architektury.

Kolejny etap to kontrakt decyzji SI i współdzielone wejścia/stanowiska pracy. Następnie detale budynków, wyspy i życia codziennego, powiązane z rzeczywistym stanem symulacji.

## Dowody

Bieżące wyniki i logi: `weryfikacja6/`. Starsze katalogi `weryfikacja5*` i wcześniejsze opisują wcześniejsze wydania. Podsumowanie odbioru RC6: `WERYFIKACJA_4.0.0_RC6.md`.
