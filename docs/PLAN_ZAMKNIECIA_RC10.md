# Przystań — zakres pozostały po RC9

Aktualizacja: 18 października 2026. Baza robocza: dostarczone RC9 (build c0609e5291). Dokument aktualizuje kolejkę; nowe Zapasy nie są jeszcze wdrożone w RC9. Wydanej paczki nie zmieniamy po dostarczeniu.

## Stan i wielkość pracy

Pozostały zakres porządkujemy w sześć większych bloków. To podział roboczy, a nie sześć drobnych poprawek ani procent ukończenia całej gry. Największy nakład mają zachowanie mieszkańców, animacje oraz spójne otoczenie budynków i wyspy. Panel Zapasów jest niewielką częścią całości. Liczby godzin nie wynikają z obecnych dowodów; nowe odtworzone usterki mogą zwiększyć nakład.

RC9 zamknęło potwierdzone usterki transportu budowlanego, wyjść wypraw i stanowisk produkcyjnych. Końcowe dowody RC9: 41 zestawów / 221 przypadków, 12 000 klatek symulacji, 10 restartów i 45 autosave oraz Chromium. Nie oznacza to odbioru całego poniższego zakresu.

## 1. Zapasy i czytelność menu — nowy priorytet

Zachować charakter i kategorie widoku ze zrzutu: Jedzenie, Opał i budulec, Rzemiosło, Z wyspy. Zachować klasyczny układ całego menu w obu trybach.

Domyślnie każdy zasób pokazuje nazwę, bieżący zapas oraz jedną liczbę bilansu produkcyjnego na dobę gry:

- zielony ze znakiem +: produkcja przewyższa zużycie;
- czerwony ze znakiem −: zużycie przewyższa produkcję;
- neutralny: równowaga;
- kreska / zbieranie danych: brak wystarczającej obserwacji, zamiast pozornego zera.

Stan magazynu i bilans są odrębne: duży zapas może mieć czerwony deficyt, mały zapas może mieć zieloną nadwyżkę. Kolorowi towarzyszy znak liczby i jednostka, aby nie polegać wyłącznie na rozpoznawaniu barw.

Szczegóły są domyślnie zwinięte i rozwijają się w tym samym panelu. Pokazują rzeczywistą produkcję /dobę, zużycie /dobę, bilans produkcyjny, okres obserwacji oraz pozostałe wpływy i odpływy. Stan rozwinięcia pozostaje podczas aktualizacji liczb; panel nie przeskakuje i nie otwiera innej strony. Na wierzchu pozostają też czytelna informacja o żywności i dniach zapasu oraz zamknięcie panelu.

### Kontrakt liczb

Bilans produkcyjny = zmierzona produkcja − zmierzone zużycie. Dar, import, odzysk lub inny dopływ nie może udawać produkcji. Bieżące ResourceFlow.stats.netRate obejmuje również inne przepływy; nowy widok wymaga świadomego oddzielenia tych wartości. Nie wolno pomalować starego netRate i uznać tego za realizację wymagania.

Korzystamy ze wspólnego istniejącego pomiaru ResourceFlow i czasu gry. Nie dodajemy drugiego licznika zasobów ani fikcyjnej prognozy. Nie sumujemy różnych jednostek materiałów w jeden bilans całej gospodarki. Brak danych o szczegółowej przyczynie zużycia nie może być zastępowany wymyślonym rozbiciem.

Widok obejmuje Przystań i ośrodki epoki IV. Liczby aktualizują się w istniejącym cyklu odświeżania; bez nowych pętli działających w tle. Pauza nie zwiększa czasu obserwacji.

### Odbiór

- Plus, minus, równowaga i brak danych; znaki, barwy i jednostki zgodne z liczbami.
- Import nie maskuje deficytu produkcji. Duży zapas z deficytem nadal czerwony.
- Szczegóły rozwijane w miejscu, czytelne w obu trybach; bez poziomego przepełnienia na małym telefonie.
- Odświeżanie, pauza, zmiana doby, odczyt zapisu i zmiana ośrodka nie gubią znaczenia danych.
- Minimalizacja nie uruchamia dodatkowej pracy ani renderowania.

## 2. SI, drogi i transport — domknięcie

- Lekkie omijanie innych mieszkańców, kolejki i wąskie przejścia.
- Wykrywanie zamknięcia całego korytarza przez budowę; obecne RC9 chroni tylko bezpośrednie pozycje mieszkańców.
- Powrót z wyprawy na bezpieczne, dostępne miejsce, odprawy morskie i transport zwierząt / czynności domowych.
- Anulowanie przygotowania wyprawy i zwrot faktycznie opłaconych kosztów bez powielania zasobów, jeżeli wynika to z zatwierdzonego kontraktu.
- Ocena starych błędnych stanów away: brak zgadywania historii i automatycznego dopisywania nagród.
- Dalsza konsolidacja priorytetów planera: potrzeba, przydział, rezerwacja, droga, wykonanie, wynik, ponowienie.

Odbiór: brak przechodzenia przez budynki, teleportów i utraty ładunku; czas i nagrody wynikają z rzeczywistego działania. Blokada ma widoczną przyczynę i sposób wskazania miejsca.

## 3. Wygląd ludzi i codzienność

- Dopracować proporcje i czytelność sylwetek, rozróżnienie wieku i fachów oraz ubiór.
- Płynne przejścia: marsz, niesienie, praca, posiłek, odpoczynek, spotkanie rodzinne, nauka.
- Narzędzia, ładunki i gesty mają odpowiadać rzeczywistej fazie działania i zasobowi.
- Płynność na telefonie ma pierwszeństwo przed liczbą elementów modelu.

Odbiór: animacja nie zastępuje logiki. Brak produkcji, postępu i doświadczenia za sam zamiar pracy. Pauza utrzymuje pozycję; model i stan symulacji są zgodne.

## 4. Budynki, otoczenie i wyspa

- Czytelne wejścia, dziedzińce, składy i widoczne stanowiska pracy.
- Zwykłe domy z bali pozostają domami rodzinnymi: piwniczka, ogródek, zielnik i domowe wyroby.
- Spójniejsze brzegi, grunt, mokradła, skały, roślinność i ścieżki; detale wynikające z miejsca i pory roku.
- Zgodność widocznego zasobu z możliwością zbioru; dekoracja nie może przypadkowo zamykać trasy.

Odbiór: wspólne pozycje modelu, celu SI i stanowiska; limity geometrii i odległości rysowania oraz sprawdzona wydajność.

## 5. Gospodarka, rody i konsolidacja

- Macierz surowiec → przetwarzanie → odbiorca → utrzymanie, wykrywanie potrzeb bez drogi rozwiązania i produkcji bez zastosowania.
- Odbiór istniejącej epoki IV i dalsze dopracowanie autonomii, wymiany, specjalizacji folwarków i ciągłości pokoleń. Podstawy epoki IV już istnieją; nie oznaczamy ich jako nowej implementacji od zera.
- Dom rodowy powstaje po przeprowadzce rodziny do przysiółka. Folwarki różnią się miejscem, rodem i rolą gospodarczą.
- Winiarnia i winnica, browar i karczma, mięso i wędzarnie, hodowla, hutnictwo i narzędzia, uprawy z młynem i piekarstwem, tartak i wyroby drewniane, pasieka.
- Konsolidacja pozostałych warstw aktualizacji i renderowania oraz odporność zapisu na przerwanie ważnych zdarzeń.

Odbiór: każdy wymagany wyrób ma osiągalne źródło i zastosowanie. Po niedoborze gospodarka potrafi wznowić łańcuch. Przejście doby, dostawa, narodziny i zakończenie budowy pozostają spójne po restarcie.

## 6. Odbiór końcowy i paczka

- Kontrole po każdym bloku: przegląd kodu i wywołań, build, testy, następnie wykonanie scenariusza w grze. Czerwona bramka zatrzymuje zależne prace.
- Końcowe regresje integracji, zapisu / migracji, zadań i gospodarki oraz aktualne próby pokoleń dla zmienionych zasad.
- Chromium: pion, poziom, oba tryby klasycznego menu, online / offline, aktualizacja, minimalizacja i wznowienie.
- Fizyczny Android: FPS / czas klatki, pamięć, temperatura, bateria, dotyk i przerwanie procesu. To wymaga rzeczywistego urządzenia; samo Chromium na serwerze nie zamyka tego punktu.
- Jeden zbiorczy ZIP po zielonych bramkach, z raportem i komendami Termux; aktualna baza main porównana przed przygotowaniem instalatora. Checkpoint docelowego repo robi zweryfikowany instalator.

## Materiały odniesienia

Dostarczony zrzut widoku Zapasów 6934.jpg oraz aktualne pliki RC9: docs/PLAN_ROZWOJU_PO_RC6.md, docs/AUDYT_DROGI_RC9.md, docs/E4_KOLEJKA.md, src/p_cisza.js, src/p_flow.js, src/p_menu.js, src/p_ui_sections.js. Dokument jest specyfikacją kolejnej pracy, nie raportem z wdrożenia nowego panelu.
