# Przystań 3.4.1 — paczka stabilizacyjna

Data: 16 października 2026. Repozytorium: `OneirosInstitute/Przystan`, gałąź `main`.
Baza: `e7c666f9697295bf9520f54e0318d1e4720db677` (audytowana wersja 3.4.0).

To paczka poprawek do odtworzonych problemów audytu. Zachowuje zawartość gry,
trzy epoki i dotychczasowy klucz zapisu. Nie jest potwierdzeniem jakości AAAA
na wszystkich urządzeniach. Nie dodaje brakujących dużych systemów projektowych,
takich jak pełny rodzinny łańcuch przetworów i owce.

## Kontrakt poprawek

1. Ładunek, materiał w drodze i prowadzona koza nie znikają przy odczycie,
   północy, zmianie etatu ani utracie celu. Dostawa wymaga drogi i dojścia.
2. Zapis zwraca sukces lub porażkę. Awaria nie udaje sukcesu; eksport działa
   na bieżącym stanie. Nieprawidłowy import nie zastępuje dobrego zapisu.
3. Wykonany wybór nie pobiera nagrody ani kosztu po raz drugi. Księgi oraz
   wybory prowadzące do następnych epok pozostają dostępne po restarcie.
4. Racje rozdzielają tę samą pulę wyżywienia. Pojemność nie usuwa towaru;
   przepełnienie ma jawną reprezentację jako zapas poza osłoną.
5. Każde badane błędne żądanie HTTP dostaje odpowiedź. Tabela wyników jawnie
   opisuje swój model zaufania, a tożsamości prób są niezależne od nazw.
6. Prywatne zasoby wycofanych modeli są zwalniane. Zasób nadal używany przez
   inny obiekt sceny pozostaje aktywny.

## Powiązanie z raportem

| ID | Wprowadzona zmiana | Dowód regresji |
|---|---|---|
| R01 | Zachowanie ładunku przy odczycie i wznowienie fizycznej dostawy | `persistence`, `mechanics`: bilans 28 kłód, droga po restarcie |
| R02 | Jawny wynik i alert zapisu; eksport bieżącego stanu; bezpieczniejszy backup | `persistence`: quota, eksport i ochrona primary |
| R03 | Walidacja rdzenia stanu, typów, liczb, wyspy, budynków, rodzin, pogody i stad | `persistence`: odrzucone warianty, zachowane storage |
| R04 | Flaga skrzyni dopiero po odebraniu; migracja blokady; dziennik decyzji | `persistence`: skrzynia, jaskinia, wynik wyboru, wiec i kontekst |
| R05 | Zwolnienie rezerwacji budowy we wspólnej funkcji `release` | `mechanics`: cztery zmiany etatu, także w drodze |
| R06 | Rekoncyliacja transportu zamiast resetowania go o północy | `mechanics`: 6 jednostek dostarczone dokładnie raz |
| R07 | Jedna semantyka przepełnienia dla wszystkich źródeł; brak kasowania dostawy | `mechanics`: 611 łącznie, 11 poza osłoną |
| R08 | Ważony podział ograniczonej puli z nasyceniem potrzeb | `mechanics`: zachowanie ekwiwalentu dla trzech polityk |
| R09 | Sprawdzenie wykonalności produkcji przed wyjściem do warsztatu | `mechanics`: drewutnia bez drewna przechodzi do pomocy |
| R10 | Brak wymuszonego dopisania zasobów po błędzie trasy i wieczorem | `mechanics`: odcięta droga, koniec zmiany i realne dojście |
| R11 | Bramka alarmu obejmuje cały łańcuch planerów i aktywną budowę | `mechanics`: alarm zwalnia plac, nie planuje nowej budowy |
| R12 | Zależności technologii używają aktualnej wiedzy `tech()` | `mechanics`: zapomniany rodzic nie otwiera dziecka |
| R13 | Wspólne pobranie jedzenia z niezmiennej puli; brak uczty przy niedoborze | `mechanics`: dokładnie 60 porcji, brak darmowej nagrody |
| R14 | Rezerwacja miejsca dla prowadzonej kozy, alternatywna zagroda lub jawne wypuszczenie | `mechanics`: zachowany bilans stada po pełnym/usuniętym celu |
| R15 | Walidacja URL/JSON, limit bajtów, timeout i lokalne przechwycenie awarii API | `server`: prawdziwy HTTP, NUL, błędne kodowanie, null, zły JSON i limit |
| R16 | Podpisane ID prób, punkty z metryk, jawna tabela deklaracji | `server`: fałszywy wynik odrzucony, dwie takie same nazwy pozostają osobno |
| R17 | Odrzucenie markupów w zapisie i kodowanie wskazanych nazw w UI/rankingu | `resources`, `persistence`: znacznik nie tworzy elementu karty |
| R18 | Zwalnianie geometrii, materiałów i tekstur wycofanych obiektów | `resources`: 20 przebudów, 0 niezwolnionych prywatnych geometrii; zasób współdzielony zachowany |
| R19 | Ukryta karta nie symuluje ani nie nadrabia całego czasu po powrocie | `session`: dziesięć klatek ukrytej karty bez zmiany doby |
| R20 | Cache własnego scope; hash obejmuje assety; własna spójna powłoka offline | `resources`, `build-deploy`: obce cache zachowane i zmiana samych assetów zmienia wersję |
| R21, znaleziony podczas napraw | Pole `path` kampanii nie jest trasą osoby i musi przetrwać zapis | `session`: zapis/odczyt epoki III oraz migracja starej drogi |

Dziennik odtwarza zdarzenia z `EVENTS` oraz nazwane wybory kampanii i osady.
Nie serializuje funkcji JavaScript ani kodu z importu. Nowe rodzaje trwałych
decyzji muszą mieć stabilny identyfikator i bezpieczny sposób odtworzenia kontekstu.
Pozostałe anonimowe sceny narracyjne wymagają osobnego pokrycia w pełnych przejściach.

## Weryfikacja i jej granice

- `npm run build`: poprawne złożenie wszystkich części.
- `npm test`: składnia dwóch skryptów HTML oraz 33 testy; brak zależności npm.
- `npm run test:runtime`: pełna pętla w scenariuszach epok I i III, 7200 klatek,
  6 restartów, 8 dostaw handlowych w scenariuszu epoki III.
- Osobny test API uruchamia prawdziwy serwer na losowym lokalnym porcie
  i używa tymczasowych danych; nie dotyka publicznej tabeli.
- Kontrola wdrożenia sprawdza repo, gałąź, dokładną bazę i obce zmiany.
  Nie wykonuje commita, pusha, resetu ani czyszczenia repozytorium.
- CI jest skonfigurowane dla Node 18 i 24. Lokalnie wykonano Node 24.19.0;
  zdalne uruchomienie CI nastąpi dopiero po pushu.

DOM, canvas, dźwięk i renderer GPU w testach silnika są atrapami. Próby nie
mierzą FPS, termiki, baterii, dotyku, rzeczywistego XSS w przeglądarce ani
aktualizacji PWA na urządzeniu. Nie ukończono wszystkich 28 gałęzi kampanii.
Naprawa zwalniania zasobów ma dowód zdarzeń `dispose`, a nie pomiar GPU.

## Zachowanie przy granicach

- Nieczytelny primary i backup wstrzymują automatyczne nadpisanie. Przycisk
  ostrzegawczy pozwala pobrać oryginalny uszkodzony plik do odzyskania.
- Import jest ograniczony do tej samej wyspy i 8 MiB. Zły plik nie zmienia primary.
- Prowadzona koza, dla której nie ma wolnej zagrody, wraca do dzikiego stada
  w miejscu człowieka. Gracz otrzymuje komunikat; zwierzę nie znika z bilansu.
- Przepełnienie żywności pozostaje w `S.res`; ilość poza osłoną jest wyliczana
  jako nadwyżka nad pojemnością i zwiększa psucie w dobowym rozliczeniu.
- Ranking nie ma autorytatywnego serwera symulacji. Walidacja metryk i token
  nie są dowodem uczciwego przejścia. Klucz podpisu nie jest wysyłany klientowi.

## Przed finalnym wydaniem

Po nałożeniu paczki wykonać fizyczny Chrome/PWA: import starego zapisu,
pełny restart, przełączenie aplikacji, zapis z ładunkiem, przebudowy, dotyk,
skalowanie tekstu i aktualizację z 3.4.0. Zmierzyć późną osadę i pamięć GPU.
Pełne przejścia kampanii oraz zgodność dużych obietnic funkcjonalnych pozostają
oddzielnymi bramkami. Zielona paczka naprawcza nie zastępuje ich zamknięcia.
