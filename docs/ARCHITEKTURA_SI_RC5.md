# Reguły SI po RC5

## Epoki I–III

Zagrożenie i stan zdrowia → bezpieczne zakończenie dostawy → potrzeby dnia → przydział gracza → zaopatrzenie warsztatu → prace społeczne. Poprawki wykorzystują istniejące punkty `go`, `movePerson`, `productionPolicy`, `onArrive` i rytm dobowy. Nie dodano osobnego zegara lub timera SI.

Wspólne zasoby magazynu nie są rezerwowane drugi raz przez zaopatrzeniowca. Pozyskuje on rzeczywisty węzeł i niesie wynik do magazynu. Zmiana potrzeby zwalnia węzeł, ale nie kasuje pobranego ładunku.

## Epoka IV

`E4Life` jest częścią symulacji. `E4Life.configure` dostarcza wejścia rzeczywistych starych domów i budynków oraz trasowanie na aktualnej siatce centrum. Dalsza wyspa używa lądowych tras świata E4. Rewizja siatki wymusza ponowne trasowanie.

Działanie osoby zawiera identyfikator, rodzaj, zadanie, trasę, cel, początek, dotarcie, koniec, etap oraz rozliczony czas. Rodzaj steruje pozą; opis tekstowy nie jest parserem animacji. Model, karta i mapa czytają tę samą pozycję.

Wspólna oś zdarzeń uwzględnia pory dnia, dotarcie i koniec działania. Dopiero czas na stanowisku tworzy wpis w `e4Credits`, z powiązanym fachem. Rozliczenie dobowe zużywa odpowiedni wpis dokładnie raz. Sen, mycie, posiłek i lekcja nie dają godzin produkcyjnych. Choroba i dojście ograniczają dostępne godziny. Wcześniej opłacone budowy osady korzystają z oddzielnych identyfikatorów `legacy`.

Posiłki rozliczają rzeczywistą żywność. Ziarno siewne jest chronione. Rezerwę przetwórstwa odkłada się tylko przy wystarczającym alternatywnym jedzeniu. Surowce nie stają się produktem za samo wskazanie pracy. Natura, pojemność, opłacona partia i wymagany budynek nadal są sprawdzane.

Mistrz uczy przy pracy w dawnych epokach albo na umówionej lekcji w E4. Uczeń i nauczyciel muszą dotrzeć. Opiekun pomaga po rzeczywistym wykonaniu wizyty, a nie na podstawie odległego przydziału.

## Zapis i koszt wykonania

Działanie, rozliczony czas, ładunek i księga godzin są zapisywane. Brak nowego pola w RC4 oznacza rozpoczęcie planowania, bez sztucznych godzin wstecz. Renderowanie nie dopisuje pracy ani nie zmienia współrzędnych osób.

Punkty miejsc są buforowane poza stanem zapisu. Rozliczenie czasu używa całkowitych ticków; wynik pozostaje zgodny przy dzieleniu kroku zegara. Modele stosują dwa poziomy szczegółowości i współdzielone geometrie narzędzi. Usypianiem nadal zarządza pojedynczy istniejący moduł cyklu życia aplikacji.

Wybór stanowiska uwzględnia priorytet, fach i odległość od osoby. Dzięki temu obsługa pól nie wymusza losowych przejść przez całą osadę pomiędzy krótkimi czynnościami.

Pola bez jawnych współrzędnych korzystają z `E4Life.fieldPoint` zarówno podczas planowania, jak i rysowania. Promień rośnie z pierwiastkiem liczby pól; zachowana gęstość zapobiega dojazdom dłuższym od odcinka pracy. Jawne współrzędne dawnych pól są zachowane. `fieldLayoutVersion` włącza ten układ jednokrotnie i unieważnia stare działania przy polach; nie zmienia położenia osób ani ich wcześniejszego bilansu.

Autonomiczna rozbudowa domów czeka na ukończone pola zboża wymagane dla bieżącej populacji i osiem dni jadalnego zapasu. Chronione ziarno siewne nie liczy się jako żywność. Blokada jest pokazana w podsumowaniu folwarku; ręczna budowa pozostaje dostępna.
