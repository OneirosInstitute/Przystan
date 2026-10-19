# RC10 MASTER — kontrakt jednej sesji

Baza: wydane RC9, build c0609e5291. RC9 pozostaje niezmienione. Przed pakowaniem porównanie z aktualnym main. Zakres PLAN_ZAMKNIECIA_RC10.md realizowany kolejno, z buildem i testami przed kolejnym blokiem.

1. Zapasy: nazwa, ilość, bilans produkcja−zużycie; zielony/czerwony/neutralny/brak danych. Szczegóły rozwijane w miejscu, także inne przepływy i okres pomiaru. Oba tryby i wszystkie ośrodki; istniejący licznik i brak nowych pętli w tle.
2. SI: ciągły ruch z omijaniem i ustępowaniem; ochrona przed odcięciem mieszkańców i wejść; bezpieczny powrót; kontrola odpraw lądowych i morskich; anulowanie oddaje raz tylko udokumentowane koszty niewyruszonej załogi; osiągalne wejścia dostaw domowych i zwierząt. Bez zgadywania historii starych away.
3. Ludzie: czytelniejsze sylwetki i wiek, detale rodu, poprawne narzędzia i ładunki, płynne przejścia marszu, pracy, odpoczynku, posiłku i nauki. Render nie rozlicza pracy i nie przesuwa symulacji.
4. Świat: otoczenie budynków i stanowisk, widoczne rozbudowy domów, lokalne detale biotopów i ścieżek. Bez zmieniania kolizji dekoracją; limity geometrii i odległości, zwalnianie pamięci, jeden punkt aktualizacji.
5. Gospodarka: przegląd źródło→receptura→odbiorca→utrzymanie i jawne braki, odbiór istniejących specjalizacji i przeprowadzek rodów, odzyskiwanie łańcuchów po niedoborach, odporność przerwanych zapisów i próby pokoleń. Konsolidacja zdublowanych aktualizacji w zmienianych miejscach.
6. Odbiór: regresje, runtime, próby pokoleń, Chromium w obu orientacjach i trybach, offline, aktualizacja, minimalizacja. Próba instalatora na aktualnej bazie i ochrona własnych zmian. Jeden ZIP z raportem i komendami. Fizyczny Android pozostaje jawnie niewykonanym punktem: pomiary baterii, temperatury, FPS, dotyku i ubijania procesu wymagają urządzenia.

Zachowujemy klasyczne menu, kanon świata i działające zasady rozwoju rodów. Każda poprawka ma oddzielny przypadek odbioru. Czerwona bramka zatrzymuje zależną pracę. Zmiana istniejącej sygnatury wymaga sprawdzenia wszystkich wywołań. Nie publikujemy z tego środowiska; commit i push wykonuje sprawdzony instalator w Termuksie.

Korekta 18.10, 21:29: katalog Budowa pokazuje każdą dostępną kartę od razu z opisem, kosztem, liczbą pracowników i akcją Postaw/brakami; bez zwijania kart. Kategorie i klasyczny układ pozostają.
