# Przystań 4.9.0-rc.11: urozmaicenie, czyli budynki w lustrzanym odbiciu

Podstawa: 4.9.0-rc.10 (`0f9b02ba180eec78fd44fdfd86e71ffd4745ae09`).

To paczka E, ostatnia z planu budynków.

## Co się zmieniło
- **Lustrzane odbicie:** mniej więcej co drugi budynek danego rodzaju stoi w lustrzanym odbiciu. Komin, boczne okno, przybudówka, podwórze i stosy są wtedy po drugiej stronie.
- **Rzędy budynków:** rząd chat albo takich samych warsztatów nie wygląda już jak kopia jednego budynku. Razem z wcześniejszymi różnicami (ściany, dachy, okiennice, koniki, epoka, poziom) każdy budynek ma swój wygląd.
- **Stałość:** wybór zależy od numeru budynku, więc po wczytaniu zapisu wszystko stoi tak samo.
- **Bez odbicia** zostają:
  - serce osady i pola;
  - wielkie budynki z placem i dziedzińcem;
  - wiatrak;
  - budynki na brzegu (pomost, przystań, szkutnia).
- **Sąsiedztwo:** przybudówka i podwórze z poziomów 2 i 3 sprawdzają sąsiada po tej stronie, po której naprawdę stoją.
- **Dym z kominów** odpływa w tę samą stronę nad zwykłymi i odbitymi domami (przygotowane już w 4.9.0-rc.10).
- **Przełącznik:** parametr `?nomir` wyłącza odbicia.

## Wydajność
Odbicie to ujemna skala grupy budynku, więc nie dochodzą nowe siatki, wywołania rysowania ani pamięć. Scalanie siatek budynku działa bez zmian.

## Technicznie
- `src/p_odmiany.js`: `bMir(b)` oraz nakładki na `makeBuildingModel` i `budFrame`, bo sprężyste „wyskoczenie” po ukończeniu budowy ustawiało skalę od nowa.
- `src/p_poziomy.js`: `lvFree` zamienia strony w odbitym budynku.

## Testy
`tests/odmiany.test.mjs` (2 przypadki):
- około połowy budynków jest odbitych, zawsze tak samo;
- wyłączone rodzaje nie są odbijane;
- odbicie zostaje po „wyskoczeniu”;
- przybudówka sprawdza właściwego sąsiada.
