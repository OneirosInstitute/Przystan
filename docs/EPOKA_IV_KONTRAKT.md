# Przystań — Epoka IV: Rody, folwarki i wielka wyspa

Data: 16 października 2026. Status: kontrakt projektu i plan implementacji;
mechaniki opisane jako docelowe nie są jeszcze wdrożone.
Punkt odniesienia technicznego: paczka 3.4.2, build `92b1b04354`.

## 1. Decyzje użytkownika

- Domy z bali pozostają obecnymi domami. Mają rozwój przez piwniczkę, ogródek,
  zielnik i domowe wyroby. Zachowują swoją rolę i skalę.
- W późniejszym etapie rodzina przeprowadza się do przysiółka i buduje większy
  dom rodowy. Dom jest początkiem rozrastającego się folwarku.
- Każdy folwark ma odrębną historię, układ oraz specjalizację gospodarczą.
  Całość tworzy gospodarkę Przystani: rolnictwo, hodowlę, przetwórstwo,
  rzemiosło, przemysł i wymianę.
- To docelowy rdzeń Epoki IV. Przejście zachowuje osadę, ludzi i wcześniejszy rozwój.
- Wyspa ma być większa i znacznie bardziej różnorodna. Musi zapewniać przestrzeń
  i zasoby dla autonomicznej społeczności rodowej przez wiele pokoleń.
- Rozwój przebiega etapami z testami, a finalny update trafia do jednej paczki
  z komendami Termux i kontrolą checkpointu Git.

## 2. Docelowe doświadczenie gracza

Przystań jest głównym ośrodkiem wspólnoty. W miarę wzrostu populacji rody zakładają
siedziby w kolejnych krainach. Dom rodowy otaczają zabudowania gospodarcze,
pola, uprawy wieloletnie, pastwiska i warsztaty. Wieloletnia praca zmienia krajobraz.
Rodziny mają własne potrzeby i plany, a gracz wyznacza kierunek, rezerwy, ziemię
oraz ważne inwestycje. Codzienne zadania wykonuje społeczność.

W piątym pokoleniu można rozpoznać potomków założycieli, prześledzić przekazanie
fachu, zobaczyć pochodzenie majątku i odnaleźć ślady dawnych decyzji w krajobrazie.
Wymiana między folwarkami jest potrzebna również dobrze rozwiniętej wspólnocie.

## 3. Większa wyspa i różnorodność

Powiększenie ma zwiększać użyteczny ląd i liczbę sensownych miejsc zamieszkania.
Pierwszym wariantem do benchmarku jest około czterokrotna powierzchnia lądu.
To propozycja skali do sprawdzenia, nie potwierdzona wydajność ani sztywny rozmiar.
Zwiększanie rozmiaru nie może jednocześnie rozwlec istniejących budynków i odległości.

| Kraina | Możliwości | Koszt lub ograniczenie |
|---|---|---|
| Żyzne doliny i równiny | Zboża, warzywa, młyn, piekarstwo | Powodzie, choroby upraw, wyjałowienie |
| Osłonięte słoneczne zbocza | Winnice, sady, winiarnia | Przymrozki, długi czas do pierwszych zbiorów |
| Łąki i obrzeża lasu | Pastwiska, pasieki, zioła | Zapas zimowy, presja wypasu, drapieżniki |
| Stare lasy i bory | Drewno, owoce runa, łowiectwo | Regeneracja, oddalenie, wypieranie zwierzyny |
| Wzgórza i złoża | Kamień, ruda, hutnictwo | Trudny transport, opał, mało żywności |
| Strumienie, mokradła i jeziora | Woda, ryby, glina, młyny wodne | Przeprawy, podmokły teren, sezonowe poziomy wody |
| Wybrzeża, zatoki i półwyspy | Rybołówstwo, przystanie, transport łodzią | Sztormy, zasolenie, ekspozycja na wiatr |

Kraina ma funkcjonalne cechy: wilgotność, żyzność, nasłonecznienie, wiatr,
dostęp do wody, surowce i połączenia transportowe. Wizualny biom wynika z tych
cech i pomaga je odczytać. Łańcuch hydrologiczny musi być spójny: młyn wymaga
odpowiedniego cieku, nie samej etykiety regionu. Każdy seed musi zapewnić
osiągalne ścieżki rozwoju i alternatywy dla brakującego surowca.

## 4. Dom i folwark: osobne role

Zwykły dom jest podstawą gospodarstwa rodzinnego. Piwnica zwiększa pojemność
oraz trwałość zapasów; ogródek i zielnik wymagają miejsca i pielęgnacji;
domowe wyroby zużywają składniki oraz czas domowników. Rozbudowy są widoczne.

Dom rodowy wymaga miejsca w przysiółku, materiałów, pracy oraz zabezpieczenia
pierwszego sezonu. Samo wskazanie miejsca nie tworzy gotowej siedziby.
Przeprowadzka przenosi konkretnych ludzi i ładunki; dotychczasowy dom zostaje
zachowany w świecie i może zostać ponownie przydzielony zgodnie z zasadami własności.

Folwark wyrasta stopniowo z domu rodowego. Ma granice użytkowania terenu,
lokalne zapasy, warsztaty, miejsca pracy, potrzeby i połączenia z innymi ośrodkami.
Ród może prowadzić działalność podstawową i pomocniczą. Specjalizacja wynika
z warunków i inwestycji; nie zamyka trwale innych możliwości.

| Specjalizacja | Przykładowy łańcuch |
|---|---|
| Winiarska | Sadzonki → dojrzała winnica → winogrona → fermentacja → wino |
| Browarnicza i karczemna | Zboże, dodatki i woda → warzenie → dojrzewanie → karczma |
| Mięsna | Zwierzęta → ubój → rozbiór → solenie, suszenie lub wędzenie |
| Hodowlana | Pozyskanie i oswojenie → rozród → opieka i pasza → produkty hodowli |
| Hutnicza i narzędziowa | Ruda i opał → wytop → metal → narzędzia i naprawy |
| Rolnicza, młynarska i piekarska | Nasiona → pole → zboże → mąka → pieczywo |
| Leśna i drzewna | Gospodarka lasem → ścinka → transport → tartak → wyroby drewniane |
| Tkacka | Len i inne dostępne włókna → obróbka → przędza → tkanina → odzież |
| Garncarska | Glina i opał → formowanie → suszenie → wypał → naczynia |
| Sadownicza i pszczelarska | Sady i rośliny pożytkowe → owoce, miód i wosk → wyroby |
| Zielarska | Pozyskanie roślin → próba uprawy → pielęgnacja → zbiór i suszenie |

Każdy łańcuch potrzebuje pełnego rozliczenia wejść, pracy, czasu, miejsca,
transportu, produktu i strat. Gatunki, receptury oraz metody mają własne warunki
odkrycia. Obecność opisu lub budynku w katalogu nie oznacza działającej mechaniki.

## 5. Ród, rodzina i mieszkaniec

- Mieszkaniec zachowuje stabilną tożsamość w całym świecie: wiek, rodziców,
  związki, rodzinę, ród, miejsce zamieszkania, zdrowie, umiejętności i ważne zdarzenia.
- Rodzina jest bieżącym gospodarstwem domowym. Ród łączy pokolenia i gałęzie
  mieszkające w różnych domach lub przysiółkach.
- Dom i warsztaty mają jednoznacznych użytkowników oraz opiekuna majątku.
  Przeprowadzka nie klonuje osób, narzędzi, zwierząt ani zapasów.
- Sukcesja uwzględnia następców, dzieci, partnerów i przekazanie opieki nad
  folwarkiem. Śmierć aktualnej głowy rodu nie usuwa zakładu ani własności.
- Nowe gałęzie rodu mogą usamodzielnić się, jeśli są ludzie, miejsce i środki.
  Gospodarstwo może też podupaść, połączyć się z innym lub opustoszeć.
- Fach jest nabywany przez praktykę, naukę i przekaz wiedzy. Utrata mistrza
  ma konsekwencje, ale istnieją księgi, uczniowie oraz sposoby odzyskania wiedzy.
- Potomstwo wynika z warunków życia. Wzrost nie jest wymuszonym mnożnikiem
  populacji; dostęp do domu, opieki i żywności ma realny wpływ.

Pokrewieństwo i kronika pozostają czytelne przez co najmniej pięć pokoleń.
Archiwum zmarłych przechowuje istotne dane genealogii i historii bez utrzymywania
pełnego aktywnego planera każdej zmarłej osoby.

## 6. Autonomia z czytelnymi zasadami

Gracz ustala kierunek działalności, miejsca inwestycji, rezerwy, dozwolone zasoby
i zasady pomocy między ośrodkami. Rody proponują rozwój, rozdzielają pracę,
wychowują następców, utrzymują zapasy i zgłaszają braki.

Planowanie obejmuje potrzeby natychmiastowe, przygotowanie sezonu i inwestycje
wieloletnie. Przerywanie pracy zachowuje materiał oraz postęp. Planer wskazuje
powód przestoju i najbliższy możliwy krok. Powtarzalny brak drogi lub surowca
uruchamia ponowne planowanie, a nie nieskończone przełączanie zadania.

Sygnały dla gracza: niedobór krytyczny, propozycja rozwoju, udane usamodzielnienie,
sukcesja i problem wymagający decyzji. Zwykłe dostawy oraz rutynowe prace nie
zasypują powiadomieniami. Gospodarka działa także przy zamkniętych panelach.

## 7. Gospodarka wspólnoty i trwałość wyspy

Folwarki mają lokalne zapasy i utrzymują własną ludność. Rezerwy Przystani oraz
wymiana wspierają całą wspólnotę. Towar ma właściciela/opiekuna, lokalizację
i stan: zarezerwowany, zabrany, w drodze, dostarczony lub utracony.
Jedna partia nie może równocześnie leżeć w magazynie i jechać w wozie.

Specjalizacja tworzy zależności: hodowla potrzebuje paszy i narzędzi; browar zboża,
wody oraz naczyń; hutnictwo rudy, opału i żywności. Transport uwzględnia pojemność,
drogę, czas, pogodę i utrzymanie. Brak połączenia ma widoczną konsekwencję.

Dla gry wielopokoleniowej potrzebny jest bilans odnawiania lasu, gleby, stad,
roślin i nasion oraz utrzymania narzędzi i budynków. Źródła nieodnawialne mają
jawną skończoność, odzysk materiału albo alternatywną ścieżkę zaopatrzenia.
Gracz otrzymuje ostrzeżenia z wyprzedzeniem. Wyspa może zostać zaniedbana,
ale świat nie kończy się automatycznie po wyczerpaniu startowych zasobów.

## 8. Odczytany stan techniczny i wynikające wymagania

Inspekcja lokalnej paczki 3.4.2, bez modyfikowania kodu gry:

| Miejsce | Obecny mechanizm | Wymaganie Epoki IV |
|---|---|---|
| `src/p_const.js`, `src/p_mid.js` | Mapa 192×192; generowanie zależy od `N` i `seed`; tablice obejmują całą mapę | Wersjonowany generator i współrzędne świata, podział terenu i pomiary kosztów |
| `src/p_ludzie.js`, `src/p_kol.js` | Przysiółki częściowo używają zbiorczego `pop`, zapasów i uproszczonych danych mieszkańców | Pełne trwałe rekordy osób i rodów również poza Przystanią |
| `src/p_rod.js`, `src/p_rest.js` | Istnieje demografia, rodzice i dziadkowie, ciąża, wiek oraz zgony | Wspólne zasady życia dla wszystkich ośrodków, sukcesja i wielopokoleniowy zapis |
| `src/p_save.js`, `src/p_szlif.js` | Zapis zależy od seeda i liczby węzłów; część migracji mapuje węzły po indeksie | Jawna wersja świata i stabilne ID, testowane migracje terenu oraz zapisów |
| `src/p_rest.js`, `src/p_kol.js` | Trasy oraz pomocnicze tablice zależą od rozmiaru mapy | Budżet planowania, graf dróg między krainami i lokalne wyznaczanie tras |

Samo zwiększenie stałej rozmiaru zmieniłoby sposób generowania terenu, koszty
tras i znaczenie indeksów. Rozszerzenie istniejącego świata wymaga osobnej migracji.
Nie należy uznawać obecnych krótkich testów runtime za dowód wielopokoleniowej
stabilności lub wydajności większej mapy.

## 9. Architektura dla telefonu i większej populacji

Renderowanie i symulacja są oddzielone. Kamera wpływa na szczegółowość modeli
oraz animacji; nie może zmieniać tego, kto żyje, kto rodzi dziecko, ile jest
żywności ani czy folwark wykonał dostawę.

Bliskie obszary otrzymują szczegółowy ruch i animacje. Dalsze ośrodki mogą być
liczone zdarzeniowo lub w większych krokach, ale zachowują osoby, zasoby,
przyczyny zmian i ograniczenia pojemności. Zmiana poziomu szczegółowości
nie nalicza drugi raz produkcji ani nie gubi ładunku.

Teren jest dzielony na sektory. Trasy dalekie korzystają z sieci połączeń
między krainami, a ruch lokalny z lokalnych tras. Planer, generowanie terenu,
przebudowy modeli i zapis mają mierzone budżety pracy. Przyspieszenie czasu
musi respektować te same zasady gospodarki i demografii.

Robocze scenariusze obciążenia: 100, 300 i 600 mieszkańców, 10–30 rodów oraz
kilka do kilkunastu aktywnych ośrodków. Są to propozycje do benchmarku;
obsługiwany zakres zostanie zadeklarowany po pomiarach na telefonie.
Bramka mobilna ma badać stabilne 30 FPS, przycięcia, pamięć, temperaturę
i długą sesję w zwykłym widoku gry. Nie obiecujemy tych wyników przed testem.

## 10. Zapis i migracja

Zapis rozdziela wersję schematu, wersję generatora, seed i parametry świata.
Używa trwałych ID dla mieszkańców, rodów, domów, ośrodków, działek, stad,
partii towaru i transportów. Serializacja nie zależy od modeli Three.js.

Migracja zachowuje istniejącą osadę i rozpoznawalny teren. Przed jej uruchomieniem
powstaje kopia starego zapisu. Próba odbywa się na kopii stanu; niepowodzenie
pozostawia oryginał. Nie przesuwamy zabudowy na wodę ani nie odtwarzamy
nowej mapy pod starymi współrzędnymi.

Znane dane mieszkańców dawnych przysiółków są zachowywane. Jeżeli starszy zapis
nie zawiera pełnej biografii lub pokrewieństwa, migracja oznacza brak danych.
Nie przedstawia wymyślonej genealogii jako odzyskanej historii rozgrywki.

Import/eksport, kopia zapasowa, autosave podczas pauzy i cykl tło/powrót muszą
obejmować wszystkie ośrodki, sukcesję, budowy i ładunki w drodze. Przywrócenie
zawieszonej czynności kontynuuje rozliczenie dokładnie raz.

## 11. Kolejność realizacji jednej dużej aktualizacji

| Etap | Rezultat | Warunek przejścia |
|---|---|---|
| E4.0 — model i migracja | Tożsamości świata, mieszkańców, rodów, ośrodków i zapasów; kompatybilność 3.4.2 | Odczyt dawnych zapisów, zachowanie ludzi/majątku i poprawny rollback |
| E4.1 — krainy i skala | Wersjonowany teren, sektory, zróżnicowanie i połączenia | Determinizm, brak kolizji migracji, benchmark świata i tras |
| E4.2 — siedziby rodowe | Rozwój obecnych domów, przeprowadzka, budowa domu rodowego | Pełny cykl pracy, realny koszt, brak duplikacji osób i zasobów |
| E4.3 — pierwszy działający folwark | Pole → zboże → młyn → pieczywo → lokalne zużycie i dostawa | Działający łańcuch, braki, sezonowość, restart w każdym kroku |
| E4.4 — pozostałe specjalizacje | Hodowla, przetwórstwo, drewno, metal, napoje i rzemiosła | Każdy deklarowany łańcuch działa i jest widoczny w świecie oraz UI |
| E4.5 — autonomia i pokolenia | Planowanie, następcy, nauka, odgałęzienia rodów i pomoc | Co najmniej pięć pokoleń z zachowaniem tożsamości i ciągłości produkcji |
| E4.6 — integracja i wydanie | Balans, UI, pełny zapis, testy urządzenia, jeden ZIP i Termux | Wszystkie bramki zielone i jawny raport ograniczeń |

Każdy etap ma odrębny kontrakt, sprawdzone wywołania, build, testy i dopiero
potem symulację. Czerwony wynik zatrzymuje dalszy etap. Finalna paczka zawiera
cały zatwierdzony zakres; raport nie nazywa stubów gotową mechaniką.

## 12. Kryteria odbioru całej Epoki IV

1. Pięć kolejnych pokoleń w kilku ośrodkach, z prawidłowymi narodzinami,
   zgonami, pokrewieństwem, nauką i sukcesją; bez ręcznego dostarczania zasobów
   w scenariuszu referencyjnym z wystarczającymi warunkami i priorytetami.
2. Folwark kontynuuje pracę po śmierci założyciela. Jego historia pozostaje czytelna.
3. Przeprowadzka oraz ponowne wczytanie nie zmieniają sumy osób, materiałów,
   towarów i zwierząt poza jawnie rozliczonymi narodzinami, produkcją, zużyciem i stratą.
4. Przy identycznym scenariuszu kamera skierowana na inny region nie zmienia
   wyników demografii i bilansu. Dopuszczalne tolerancje liczbowe są zdefiniowane.
5. Brak wejścia, drogi, pracownika lub pojemności zatrzymuje odpowiednie zadanie
   i wskazuje przyczynę. Dostawa nie teleportuje towaru do odciętego folwarku.
6. Każdy wymieniony jako gotowy gatunek, przetwór i zakład ma działający cykl,
   koszt, zapis, UI i obserwowalny wpływ na gospodarkę.
7. Istniejący zapis 3.4.2 przechodzi migrację bez utraty osady; nieudana migracja
   pozostawia plik do odtworzenia.
8. Wydajność oraz pamięć są zmierzone na prawdziwym telefonie przy docelowej
   mapie i populacji. Kilka minut atrapowego runtime nie zastępuje tej bramki.
9. Co najmniej jeden test długiej sesji obejmuje tło/powrót, kilka restartów,
   dziedziczenie i transport w toku; krótkie testy regresji nadal pozostają zielone.
10. Paczka wdrożenia rozpoznaje właściwe repo i bazę, przechodzi build/testy
    przed publikacją i kończy checkpointem `working tree clean`, `HEAD == origin/main`.

## 13. Otwarte parametry do ustalenia w implementacji

Dokładny rozmiar mapy i obsługiwana liczba mieszkańców wynikną z benchmarków.
Tempo starzenia wobec kalendarza, przepisy sukcesji, zasady opieki nad majątkiem,
model rozliczeń między rodami i szczegóły wszystkich gatunków wymagają osobnych
kontraktów przed implementacją odpowiednich etapów. Do tego czasu zachowujemy
zgodne zachowanie wcześniejszych epok i nie dopisujemy arbitralnych systemów.
