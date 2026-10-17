# Kontrakty integracji Epoki IV

- `E4World.create({seed, core, town})` tworzy wersjonowany świat 384×384 z utrzymanym centrum starej mapy. `core` jest jawną próbką wysokości; `town` zachowuje położenie istniejącej osady.
- `E4World.height(world,x,z)`, `E4World.regionAt(world,x,z)`, `E4World.route(world,from,to)` są deterministyczne. Zależności renderera nie występują w modelu.
- `E4Domain.migrate(snapshot, options)` zwraca nowy stan, zachowuje identyfikatory istniejących osób i jawnie oznacza brak biografii dawnych anonimowych mieszkańców. Nie modyfikuje argumentu.
- `snapshot.people` pozostaje jedynym kanonicznym zbiorem żywych osób. Rodzina, ród, ośrodek oraz transport wskazują osoby po ID. Zmarli trafiają do zwartego archiwum genealogii.
- Lokalne magazyny i ładunki nie dublują `snapshot.res` głównej osady. Użytkownik przenosi osoby i zasoby przez jawne, trwałe działania.
- Silnik Epoki IV używa kontrolowanego zegara oraz zapisanego stanu generatora losowego. Kamera nie jest argumentem ekonomii ani demografii.
- Integracja z `boot`, `step`, `frame`, `renderPanel`, `save/decodeSave` następuje po testach modeli. Wcześniejsze epoki zachowują dotychczasową ścieżkę wykonania.
- Budynki, receptury i gatunki zgłaszane jako gotowe muszą mieć koszt, czas, dostępność, wynik, zapis, UI oraz wizualizację. Rozmiar mapy i obsługiwana populacja wymagają benchmarków.

## Gospodarka

- `E4Economy.catalog` opisuje kompletne koszty, pracę i receptury specjalizacji; klient UI używa tego samego katalogu.
- `E4Economy.found(state,{householdId,regionId,specialization})` sprawdza teren, transport, rodzinę i środki przed jakąkolwiek mutacją. Wyprawa założycielska ma rzeczywistą pojemność oraz zapasy na podróż i początek gospodarstwa.
- `E4Economy.project(state,settlementId,kind)` rezerwuje składniki i tworzy trwały projekt budowy; wykonanie wymaga pracy mieszkańców.
- `E4Economy.ship(state,{from,to,items})` zabiera dokładnie jedną partię ze źródła, zapisuje trasę, przewoźników oraz ładunek. Docelowy magazyn otrzymuje towar dopiero po dotarciu.
- `E4Economy.advance(state,days,onDay=null)` rozlicza w deterministycznej kolejności pracę, uprawy, przetwórstwo, utrzymanie, transport i popyt. Opcjonalny `onDay(state)` następuje po gospodarce doby i jest jedynym miejscem uruchamiania demografii przez zegar. Nie odczytuje kamery ani zegara systemowego.
- Kolejne wywołanie po serializacji daje ten sam bilans. Niedobór wejść, brak pracownika, drogi lub pojemności jest jawnym wynikiem, nie darmową produkcją.

## Produkcja i życie

- `batch(state,settlementId,recipeId)` od razu rezerwuje składniki; praca i dojrzewanie pozostają osobnymi, zapisanymi etapami. Materiały występują w magazynie albo partii, nigdy w obu.
- `trial(state,settlementId,cropId)`, `capture(state,settlementId,species)`, `slaughter(state,settlementId,animalId)` rozliczają koszt, źródło i wynik. Sadzonki, dzika przyroda i udomowione zwierzęta nie są tym samym zasobem.
- `extendHouse(state,houseId,extension)` zachowuje rodzaj i ID dawnego domu, pobiera materiały i tworzy projekt rozbudowy. Nie tworzy domu rodowego w miejscu chaty.
- `join(state,personId,partnerId)` przewozi przyszłego partnera; nowe gospodarstwo i związek powstają po dotarciu, nie w chwili zamówienia przeprowadzki.
- `E4Population.daily(state)` zmienia wiek, narodziny, związki, naukę i sukcesję raz na dobę. `state.people` jest jedynym zbiorem żywych mieszkańców; archiwum zachowuje zmarłych i genealogiczne odwołania.
- Utrzymano rytm starzenia wcześniejszej gry: 0,1 roku biologicznego na dobę rozgrywki; rok kalendarzowy ma 20 dób. Próby długowieczne podają liczbę dób i pokolenia, nie utożsamiają tych dwóch skal.
- Przyroda jest wspólna dla krainy. Otwarcie panelu i ustawienie kamery nie uruchamiają produkcji ani jej losowania. Mikrosekundy doby, reszta kroku i generator losowy należą do zapisu.

## Granica z wcześniejszą grą

- `e4Prepare()` wstrzymuje nowe stare zlecenia, pozwalając dokończyć istniejące dostawy i wyprawy. Ponowne polecenie odwołuje przygotowania.
- `e4Start()` wymaga ukończenia III i zakończenia aktywnych decyzji, ruchów i wypraw. Migracja odbywa się na kopii; przed zamianą stanu zapisuje kopię wcześniejszej epoki. Nieudana inicjalizacja przywraca poprzedni stan.
- `e4Daily(state)` rozlicza już opłacone dawne budowy i kolejki, wywołuje demografię, aktualizuje pochodne wizualne oraz zapis. Pozostały do zebrania stary plon nie jest zastępowany nowym pełnym plonem.
- `e4Restore`, `e4BuildWorld`, `e4Sync`, `e4Draw` oraz `e4Panel` są granicą 3D/DOM. Modele domeny nie odczytują ich stanu.
- Faza IV omija dawną produkcję darów przez animację wozu i zagregowane narodziny przysiółków. Wcześniejsze fazy korzystają z poprzednich funkcji.
