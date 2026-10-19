# RC10 MASTER — zakres napraw i konsolidacji

Paczka kumulatywna na main RC9 `492e8bfd1a8ba058f467701115f1e74146343180`. Porównanie 400 plików z niezmienioną wydaną paczką RC9: zero różnic. Nie pominięto pośrednich zmian.

## Menu i Zapasy

Klasyczne menu i kategorie pozostają. Karty dostępnych budynków są stale otwarte: opis, koszt, osobodni, obsada, akcja albo konkretne braki. Dane produkcyjne pozostają w Zapasach: stan, podpisany bilans produkcja minus zużycie na dobę. Zieleń oznacza nadwyżkę, czerwień deficyt, znak i jednostka uzupełniają kolor. Brak obserwacji nie jest zerem. Szczegóły rozwijane w miejscu. Import i dar nie maskują ujemnego bilansu produkcji. Przystań oraz wybrany ośrodek IV korzystają z tego samego ResourceFlow.

## SI i dostawy

Ruch wykrywa przecięcie z sąsiadem na całym odcinku kroku, ustępuje i szuka obejścia po prawej stronie. Siatka sąsiadów jest budowana raz na krok symulacji, aktualizowana po ruchu. Nie ma nowych timerów ani teleportowania utkniętego mieszkańca. Sprawdzanie budowy chroni dojścia do istniejących budynków i połączenia mieszkańców z osadą; test obejmuje odcięcie całego wąskiego korytarza.

Dostawy kozy i wody wybierają osiągalne wejście; bramka wykonania wymaga fizycznego dojścia. Zajęte miejsce odbioru jest pomijane. Obóz ma kilka prawdziwych miejsc odbioru, zamiast stałego kafla mogącego leżeć pod paleniskiem. Poprawkę sprawdzono także dotychczasowymi testami autosave i przenoszenia wiadra przez noc. Ładunek pozostaje przy osobie po błędzie trasy i po restarcie.

Wszystkie cztery rodzaje odpraw (zwiad/zbiór, zadanie budynku, rejs przybrzeżny, horyzont) zapisują rzeczywiste koszty w jednej księdze opłat. Morze sprawdza dojście całej załogi przed pobraniem żywności i łodzi. Przygotowanie można anulować przed odejściem pierwszej osoby. Usunięcie aktywnej wyprawy poprzedza zwrot, a powtórzenie polecenia niczego nie dopisuje. Księga podlega walidacji zapisu. Powrót najpierw szuka różnych bezpiecznych kafli połączonych z obozem; brak miejsca wstrzymuje wszystkie nagrody i skutki warstw zakończenia. Nie odtwarza się nagród ani opłat dawnych błędnych away. Starsze wyprawy bez księgi zachowują się jak wcześniej, bez nowego zwrotu. Ocena dawnej flagi away na podstawie samej odległości nie daje pewnego dowodu historii, dlatego nie jest automatyczną migracją.

## Ludzie i otoczenie

Uproszczony model ma połączone geometrycznie twarz, włosy, dłonie, mankiety, pas i buty oraz rodowy kolor obszycia. Usunięto starą dekorującą warstwę, która nadpisywała kończyny i dodawała drugi komplet części. Model szczegółowy zachowuje łokcie i kolana, ma mniejsze oczy i nos oraz rodowy kolor. Pozy przechodzą płynnie między marszem, pracą i codziennością; krok zależy od przebytego dystansu. Posiłek i nauka mają miskę lub księgę. Ładunek chowa narzędzie. Pauza zamraża pozę. Renderer nie zmienia zapasów, doświadczenia ani pozycji symulacji.

Oznaczenia stanowisk wynikają z workSiteTiles, nie z osobnego zestawu celów. Przy budynkach pojawiają się małe stoły, beczki i materiały właściwe fachowi. Dodatkowe drobne detale brzegu, mokradeł, skał i skraju ścieżek są dekoracją, nie nowym surowcem do zbioru. Geometria nie zmienia walk/occ ani zasobów. Limit: 32 otoczenia w jakości wysokiej, 48 w ultra, 40 jednostek od kamery, jeden połączony model lokalnego gruntu z maksymalnie 121 próbkami. Niska jakość wyłącza ten dodatek. Zmiana kamery, jakości lub osady zwalnia wycofane geometrie. Aktualizacja działa wyłącznie w istniejącej klatce, maksymalnie dwa razy na sekundę; cykl uśpienia nadal odcina całą klatkę.

Ogrody, zielniki, piwnice i domowe wyroby przy zwykłych domach istniały wcześniej i pozostają oparte na rzeczywistych rozbudowach. Epoka IV korzysta teraz z jednej funkcji punktu budynku dla modelu i logiki. Nie przedstawiamy istniejących jedenastu specjalizacji jako funkcji zbudowanej od zera.

## Gospodarka i zapis

Macierz źródło → receptura → odbiorca obejmuje każdy wymagany składnik receptur i kosztów budowy IV oraz każdy wytwarzany recepturą produkt. Źródła terenowe, uprawy, zwierzęta, pasieka, przetwarzanie, budowa, żywienie, zdrowie, ubiór, wyposażenie i transport mają jawne zastosowania. Dawne zasoby statku nie są obowiązkowymi produktami IV. Rozwijana sekcja pracy pokazuje brakujące ilości i sposób uruchomienia łańcucha. Wyczerpane lokalne złoże wskazuje potrzebę dostawy z innej krainy; nie udaje odnawialnej rudy.

Nie zmieniono reguł ani kodu gospodarki, demografii, kalendarza i modelu IV; ich hashe porównano z RC9. Świeżo powtórzono próby długiej autonomii. Testy obejmują wznowienie partii po uzupełnieniu składnika, brak pobrania kosztów przy błędzie i jednokrotne zakończenie po restarcie. Weryfikacja dotyczy serializacji, dekodera i rzeczywistego zapisu, a nie nieoczyszczonego grafu sceny. Nowa walidacja wypraw odrzuca nieprawidłowe typy, cele i księgi opłat. Przejściowe dane kolejki pieszych nie są zapisywane.

## Granice dowodów

To przetestowana aktualizacja gry; nie certyfikat gotowości AAAA. Kontrolowane scenariusze nie wyczerpują każdej topologii naturalnej wyspy. Gdy przejście jest fizycznie niemożliwe, człowiek czeka z ładunkiem na odblokowanie; kolizje nie wyburzają budynków i nie przesuwają ludzi siłą. Starsze niejednoznaczne flagi wypraw wymagają oceny zapisu, bez zgadywania historii. Pomiary zużycia baterii, temperatury, dotyku, czasu klatki i ubijania procesu na fizycznym Androidzie pozostają do wykonania na urządzeniu. Chromium z programowym WebGL sprawdza logikę, DOM, rysowanie i zawieszanie cyklu; nie zastępuje telefonu. Z tego środowiska nie wykonano publikacji, commitu ani push do repozytorium użytkownika.

Końcowe liczby i surowe wyniki: WERYFIKACJA_4.0.0_RC10.md oraz weryfikacja10/results.json.
