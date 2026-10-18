# Audyt RC9 — dojścia i transport

Osiem skierowanych prób na kodzie RC8 odtworzyło osiem nieprawidłowości. Końcowa kontrola potwierdziła także dziewiąty problem: pętlę pracy przy rogu kafla stanowiska. Wszystkie naprawiono na sprawdzonej granicy wywołania.

| Problem i skutek | Zmiana |
|---|---|
| `planJob` oznaczał uczestnika jako away po nieudanym `go`; czas i nagrody wyprawy mogły postępować bez wyjścia | Nieudane wyjście pozostawia postać w osadzie z blokadą i ponowieniem; `expTick` czeka na całą załogę |
| `goNow` zaliczał przybycie z sąsiedniego kafla, także przy przeszkodzie | Korzysta z rzeczywistej trasy i czasu marszu; zamknięte cele dostaw i wypraw nie są zastępowane innymi kaflami |
| `goNow` przesuwał noszącego na nearestWalk po nieudanej trasie | Usunięto przestawianie współrzędnych |
| Planer gospodarczy przestawiał każdą osobę z zablokowanego kafla | Usunięto przestawianie; zachowana ciągła możliwość zejścia na dostępny sąsiedni kafel |
| Budynek można było postawić pod mieszkańcem | Kontrola przy podglądzie i potwierdzeniu, przed kosztem i zmianą terenu; osoby poza osadą nie blokują placu |
| Zwiad pobierał jedzenie i ludzi, choć nie mieli dojścia | Kontrola dojścia przed pobraniem zapasów, także przy misjach budynku |
| Uczestnik wyprawy mógł mieć niedokończoną dostawę | Tacy mieszkańcy nie są kandydatami do zwiadu ani misji budynku |
| Dostawa wybierała jedno geometrycznie najbliższe wejście, choć dostępna była inna strona | Wspólny wybór osiągalnego obwodu budowy; magazyny udostępniają wszystkie strony, źródło dowozu musi być osiągalne |

Dodatkowo mieszkaniec stojący już na kaflu stanowiska, ale przy jego rogu, dochodzi płynnie do pozycji pracy. Wcześniej natychmiastowe przybycie i kontrola odległości mogły nawzajem przerywać pracę w nieskończonej pętli. Test przed poprawką zawodził; poprawkę obejmuje też próba Chromium.

## Konsolidacja

Istniejąca geometria stanowisk RC8 obsługuje wszystkie 30 definicji produkcji starszych epok. Nie dodano osobnej tabeli rezerwacji ani kolejnego planera. Przerwanie przez zmianę przydziału, chorobę, pożar, zamknięcie stanowiska lub odległą pozycję następuje przed naliczaniem pracy, produktów i doświadczenia. Dotyczy też ręcznego zlecenia wozu w warsztacie. Inne wejścia do budów i magazynów korzystają ze wspólnej geometrii bez rezerwowania miejsca pracy.

Zadania i panel wypraw korzystają z jednego odczytu blokady wyjścia. Przed opuszczeniem osady mapa wskazuje dokładny kafel wyjścia, po opuszczeniu — przybliżony region. Nie nalicza się postępu przygotowania jako czasu poza osadą.

## Następne etapy i granice

- Lokalne omijanie przechodniów i wąskich przejść, kolejki oraz płynniejsze animacje życia codziennego; dalsze dopracowanie modeli ludzi.
- Rozpoznawanie odcięcia całego obszaru przez nową budowę: obecna kontrola zapobiega budowie bezpośrednio pod osobą, a nie każdemu możliwemu zamknięciu korytarza.
- Zapis z osobą już otoczoną ścianami zachowuje ładunek i czeka na odblokowanie; nie naprawia geometrii przez przeskok. Współrzędne powrotu z abstrakcyjnej wyprawy oraz odprawa morska wymagają osobnego przeglądu. Kontrola prowiantu przed startem RC9 dotyczy zwiadu/zbioru lądowego i misji budynków; statki nadal zachowują własne odprawy.
- Stare wyprawy błędnie oznaczone jako away przez RC8 nie mają wiarygodnego historycznego znacznika odejścia; RC9 nie zgaduje ich historii ani nie cofa już naliczonych nagród.
- Pomiar fizycznego Androida: bateria, temperatura, czas klatki, dotyk i ubijanie aplikacji przez system.
- Rozwój epoki IV, przysiółków i różnorodnych folwarków pozostaje wcześniejszym planem; ten etap nie zmienia ich gospodarki.
