# Przystań 4.0.0-rc.5 — SI i życie mieszkańców

Wydanie kumuluje RC4 FIX. Baza repozytorium: `fb2d75a9186737126c55ad365dab1f78266256ec`.

## Co zmienia się w grze

- Przywrócono poprzedni układ menu: dawne zakładki, karty i panel osady. Zadania zachowują postęp, filtry, śledzenie, pomoc i lokalizowanie osób. Osada otwiera ostatni dział; zapis i przełączanie widoku są w Kronice. Nie ma Pulpitu ani katalogu Działów.

- Pracownie respektują własny cel produkcji. Domyślne cele, sezon, remont i rezerwa siewna są rozdzielone. Brak wejścia uruchamia zaopatrzenie właściwego łańcucha, pełny zapas — pomoc wspólnocie.
- Zamknięta droga unieważnia trasę. Mieszkaniec szuka nowej albo pokazuje przyczynę oczekiwania. Zachowuje niesiony ładunek i zwalnia rezerwację niedostępnego stanowiska.
- Posiłek, mycie i domowy wieczór wymagają dotarcia oraz czasu. Nie ma już dopisywania żywności za sam zamiar posiłku ani przetworów z nieodbytego wieczoru.
- Epoka IV ma zapisane działania: cel, trasę, etap, czas, zadanie i wykonawcę. Renderer pokazuje kanoniczne współrzędne. Pauza nie przestawia ludzi.
- Godziny pracy w Epoce IV powstają po dotarciu do konkretnego zadania. Dziennik godzin wiąże je z identyfikatorem budowy, partii, pola, hodowli lub pozyskiwania. Inna pracownia nie może przejąć tych samych godzin. Wyniki gospodarcze nadal zatwierdzane są na koniec doby.
- Zdrowie, sytość, ciepło, choroby i urazy mają zgodny odczyt po migracji. Chorzy odpoczywają, a obecny opiekun może pomóc. Nauka wymaga dostępnego nauczyciela i dotarcia na zajęcia.
- Pola folwarków mają zwarte rozmieszczenie, wspólne dla mapy i planera pracy. Nowe pola pozostają w zasięgu dnia pracy także w dużej osadzie. Dawne pola o jawnych współrzędnych pozostają na swoim miejscu; przy aktualizacji układu pracownicy ponawiają dojście bez przestawiania osób.
- Przeprowadzki po ślubie sprawdzają miejsce i zapasy odbiorcy oraz pozostawiają pracujące osoby w osadzie. Bilans pól uwzględnia glebę, siew i zimową przerwę.
- Fach poprawia wydajność do 25% przy poziomie 5. Nie zwiększa liczby dostępnych godzin ani ilości surowca w naturze.
- Automat liczy istniejące wozy zamiast pustego licznika wyrobów. Narzędzia kamienne umożliwiają rozruch zaplecza; przy budowie zastępują żelazne w proporcji 2:1. Próby upraw także przyjmują ten odpowiednik.
- Wyroby drewniane wyposażają domy; wosk służy oświetleniu i konserwacji narzędzi; pierze trafia do posłań; bursztyn do rodowych ozdób i obrzędów; skóry do kożuchów. Zużycie pojawia się w bilansie.
- Przy dostatecznej ilości innej żywności pracownie zachowują składniki następnej partii. W razie głodu taka rezerwa żywnościowa jest zwalniana; ziarno na siew pozostaje chronione.
- Ludzie mają rozpoznawalne etapy życia, rodzinne cechy i proporcje, ruchome kolana i łokcie oraz osobne gesty prac i codzienności. Dystans napędza krok. Modele zmieniają etap życia bez restartu. Z daleka działa prostszy model, a miejsca i trasy są buforowane.

Domy z bali pozostają domami. Domy rodowe i folwarki powstają po przeprowadzce rodziny.

## Wdrożenie z Termux

Pobierz `Przystan_4.0.0_RC5_SI_TERMUX_FAST.zip` do folderu Pobrane. Następnie:

```bash
STAGING="$(mktemp -d "$HOME/przystan-rc5-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC5_SI_TERMUX_FAST.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC5_SI/WDROZ_TERMUX.sh"
```

Instalator sprawdzi integralność, tożsamość repo, gałąź, czysty stan i bazę. Zbuduje grę, uruchomi 160 kontroli instalacyjnych oraz próbę silnika. Dwie ciężkie symulacje po 1500 dni są bramką wydania wykonaną przed utworzeniem ZIP-a; ich wyniki są w raporcie. Dopiero po zielonych kontrolach wykona commit i push. Testy instalacyjne mogą potrwać kilka minut. Instalator wypisuje nazwę bieżącego zestawu. Na końcu musi pojawić się `CHECKPOINT PASS: working tree clean, HEAD == origin/main`.

Nie rozpakowuj paczki bezpośrednio do repozytorium przed uruchomieniem instalatora. Własne zmiany i nieznana nowsza baza zatrzymują instalację przed kopiowaniem.

## Odbiór

Wyniki i ograniczenia opisuje `docs/WERYFIKACJA_4.0.0_RC5.md`. To kandydat do wydania: sprawdzenie fizycznego telefonu i odczucia animacji podczas dłuższej gry pozostają testem użytkowym.

FAST1 zmienia sterownik uruchamiania kontroli. Maksymalnie dwa procesy testowe pracują równolegle; build, próba silnika, integralność i operacje Git pozostają osobnymi bramkami. Grupa procesów nieudanego lub przerwanego testu jest zatrzymywana. Pełny opis: `WDROZENIE_RC5_FAST.md`.
