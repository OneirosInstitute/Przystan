# RC8 — SI i stanowiska pracy

Kontrakt: `KONTRAKT_RC8_SI.md`. To ograniczony, sprawdzalny etap konsolidacji, a nie certyfikat całej gry ani przepisanie całego planera.

## Potwierdzone usterki

| ID | Zachowanie przed poprawką | Naprawa |
|---|---|---|
| AI1 | Gdy siedem starych pozycji było zajęte, `go` wracało do wejściowego pola i przyjmowało kolejną osobę na to samo miejsce | Kuźnia, pracownia cieśli i pole wymagają wolnego pola na obwodzie. Rezerwacja wynika z aktywnego celu osoby i powstaje dopiero po znalezieniu trasy |
| AI2 | Wybór wejścia sprawdzał pierwszy spacerowalny punkt, a nie osiągalny punkt; niedostępna strona blokowała działający budynek | Sprawdzanie kolejnych wolnych pozycji wokół tego samego budynku |
| AI3 | Stan `work/prod` wystarczał do produkcji nawet po zmianie pozycji daleko od warsztatu | Przed naliczeniem pracy wymagany jest właściwy budynek, cel drogi i obecność na stanowisku |
| AI4 | Ciężko chory wykonawca kontynuował bieżącą produkcję, mimo zasady odpoczynku | Zwalnia stanowisko przed kolejnym krokiem pracy; priorytet odpoczynku jest przed dawnymi planerami fachów |
| AI5 | Zmiana przydziału poza typowym przyciskiem mogła zostawić poprzedni `tgt` i naliczać dawną produkcję | Sprawdzenie aktualnej pracy i zakładu przed wykonaniem. Wyjątek dotyczy rzeczywistej pomocy wolnych ludzi przy pilnych żniwach |
| AI6 | Zamknięcie pola stanowiska nie przerywało osoby już pracującej | Zamknięte stanowisko wymaga ponownego dojścia i nie daje plonów ani produkcji |
| AI7 | Przy braku jakiegokolwiek wejścia planer nie wywoływał nawigacji i zostawiał stare „odpoczywa” obok informacji o gotowości warsztatu | Jedna przyczyna braku dojścia w osobie, pracowni i zadaniu produkcyjnym |

Sześć usterek mechanicznych odtworzono przed zmianą przez publiczne `go`, `planJob` i `stepPerson`: 6/8 nowych prób wtedy zawodziło. Po poprawce wszystkie przechodzą. Próbę AI7 dodano podczas sprawdzania spójności trzech widoków; wykazała pominięte wywołanie przy pustym wejściu i została poprawiona w punkcie wyboru celu.

## Reguły i priorytety

Trzy zewnętrzne nakładki (`p_tasks`, `p_e4_game`, `p_supply`) scalono w jedną bramkę `p_ai`: trwała dostawa → przygotowanie Wiecu → pożar lub odpoczynek chorego → zbiór kryzysowy → dotychczasowe fachy. Pożar nadal przechodzi do dawnego wykonania; nie zmieniano jego reguł. Przy dostawie ciężko chory zachowuje ładunek i kończy drogę; potem może odpocząć. Przygotowania Wiecu również nie odbierają dostawy.

Przed zmianą było 17 nadpisań planera; po scaleniu trzech w jedno pozostało 15. To pierwszy przekrój konsolidacji. Nie ukrywamy pozostałych warstw za deklaracją nowej architektury.

| Plik przed RC8, według ładowania | Rola |
|---|---|
| p_gosp | Dostawa materiałów i rozpoczęcie robót |
| p_mapa | Zaznaczenia mapy, budowniczowie, prace wspólne |
| p_zycie | Poszukiwania, tłoka, posiłki, mycie, dzieci |
| p_rok — 1 | Zerowanie trybu pomocy pracownika |
| p_rok — 2 | Pilne żniwa przed pogodą |
| p_ratunek — 1 | Zajęcia zastępcze i zaopatrzenie pracowni |
| p_ratunek — 2 | Pierwszeństwo pilnych prac na wraku |
| p_woz | Porządkowanie rezerwacji dostawy na plac |
| p_zad | Pomoc bezczynnych czytelników, zdunów i zwiadowców |
| p_rozb | Opis rozbiórki |
| p_opow | Droga na szczyt w opowieści |
| p_rola | Płodozmian i podlewanie |
| p_odkr — 1 | Odkrycia i kurnik |
| p_odkr — 2 | Wyczerpana żyła |
| p_e4_game | Przygotowania do Wiecu — przeniesione do p_ai |
| p_tasks | Trwałe dostawy i kryzys żywności — przeniesione do p_ai |
| p_supply | Zakończenie zaopatrzenia — przeniesione do p_ai |

Nadpisania są zamknięciami; ostatnia załadowana warstwa jest sprawdzana przed wcześniejszą, a część wykonuje zajęcie zastępcze dopiero po wyniku wcześniejszej. Sam porządek ładowania nie jest listą bezwarunkowego pierwszeństwa. Numery i miejsca są w `weryfikacja8/planner-layers-before.json`.

## Kontrakt działania i geometria

`personActivity` odczytuje rzeczywisty etap, powód, cel, zakład, rezerwację i ładunek. Korzystają z niego karta człowieka, lista wykonawców pracowni i Zadania. Epoka IV używa tego samego opisu, lecz zachowuje własne `e4Action` i planer. Odpoczynek E4 nie jest opisywany jako produkcja.

`workSiteContains`, `workSiteTiles` i `workSiteRoute` są wspólnym kontraktem obwodu trzech wskazanych miejsc. Kontrola każdej klatki ma stały koszt, bez tworzenia listy wszystkich stanowisk. Szukanie dróg zachodzi przy wyborze nowego celu. Brak nowego interwału, timera czy niezależnego zegara SI.

Rezerwacje są odczytywane z aktywnych osób; nie ma dodatkowego rejestru do zapisu. Odczyt starszych epok zeruje przejściowe drogi i cele zgodnie z dotychczasowym kontraktem, zachowuje ładunek, a następnie planuje ponownie. Pozycje modelu ludzi muszą odpowiadać symulacji. Nie dodano ogólnego silnika ciał sztywnych. Przegląd zrzutów wykazał dodatkowo sprzeczne „w drodze · leży”. Wspólny opis mówi teraz o powrocie na odpoczynek lub drodze do stanowiska i zdobywaniu składników dopiero po dotarciu. Zabezpiecza to test kontraktu oraz próba przeglądarkowa.

## Pozostała kolejka

- Przenieść sprawdzone wejścia i stanowiska na pozostałe fachy, transport i wejścia do domów; rozwinąć lokalne unikanie innych ludzi w drodze.
- Usuwać pozostałe nakładki dopiero z testami ich wyjątków: pożary, wyprawy, odkrycia, rytuały i życie rodzinne. Sprawdzić osobno nieudane dojście do wyjścia wyprawy i odzyskiwanie pozycji po zabudowaniu terenu.
- Dodać widoczne dziedzińce i stanowiska, animacje narzędzi związane z faktyczną czynnością oraz czytelne wejścia do modeli budynków.
- Uzupełnić macierz surowiec → przetworzenie → odbiorca → utrzymanie, z wykrywaniem martwych łańcuchów.
- Dalej: detale wyspy, życie rodziny i specjalizacje folwarków; pomiary czasu klatki i energii na fizycznym Androidzie.
