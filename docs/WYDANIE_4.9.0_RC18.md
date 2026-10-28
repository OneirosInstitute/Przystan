# Przystań 4.9.0-rc.18: przyjaźń, żałoba, mistrz i uczeń

Podstawa: 4.9.0-rc.17 (`7343e0fc012bb2b265d8babfb8b1689b3cdef82d`).

Trzeci pakiet ze „Scenariusza życia gry”. Do zalotów i sporów dochodzą trzy nowe rodzaje historii, a przy wieczornym ogniu ludzie rozmawiają o tym, co dzieje się w osadzie.

## Przyjaźń: pobratymstwo i posestrzenie
- Dwie osoby z różnych rodzin, które bardzo się lubią, przez kilka dni są nierozłączne: razem wychodzą do pracy, jedna wyręcza drugą, dzielą się chlebem.
- W punkcie zwrotnym karta pyta, czy mają zawrzeć dawny obyczaj przy ogniu, z chlebem, solą i nacięciem dłoni. Dwie kobiety zawierają **posestrzenie**, a pozostali **pobratymstwo**.
- Obrzęd zostawia trwałe wspomnienie i mocną więź. Na karcie osoby widać na stałe „Pobratym: …” albo „Posestra: …”.
- Każdy ma tylko jednego pobratymca na życie. Pobratymcy nigdy nie trafiają do sporu przeciw sobie, a po śmierci jednego z nich drugi jest wśród najbliższych w żałobie.
- Przyjaźń może zacząć się od sceny daru.

## Żałoba
- Po śmierci kogoś bliskiego żałoba zaczyna się od razu, nawet jeśli przed chwilą skończyła się inna historia. Kolejność bliskości: małżonek, dziecko, rodzic, pobratymiec, przyjaciel. Przy osobie w żałobie jest ktoś, kto ją pociesza: przyjaciel, ktoś z rodziny albo ktoś szanowany ze starszych.
- Przez kilka dni widać, jak ktoś nie wychodzi z domu, chodzi wieczorami na grób, a w końcu wraca do pracy.
- Karta: „Uczcić pamięć przy ogniu, jak na Dziady” (pieśń „Pamięci …” trafia do pieśni osady), „Niech pracuje przy boku …” albo „Dać czas”, po którym żałoba sama mija po dwóch dniach.
- Tytuł w Kronice i na karcie: „Żałoba: Bożydar · Dobrawa †”.

## Mistrz i uczeń
- Ktoś starszy z fachem na poziomie 4 albo 5 bierze pod skrzydła młodego (14–25 lat), który zna ten fach najwyżej na 2. Najchętniej wybiera kogoś z tego samego warsztatu.
- Każdy krok nauki przesuwa ucznia w fachu.
- Karta: „Niech pokaże majstersztyk”, czyli awans w fachu albo wstyd przy wszystkich (szansa rośnie z poziomem), albo „Niech jeszcze się uczy”, wolniej, ale pewniej.
- Gdy mistrz umrze, uczeń przejmuje fach: wpis w dzienniku i więcej szacunku w osadzie.

## Plotki przy ogniu
Wieczorne rozmowy wspominają trwające spory i żałoby, naukę u mistrza, a po kilku dniach także dawne, zakończone historie: „Pamiętasz kłótnię Bożydara i Radosława? Cała osada wtedy słyszała”.

## Rytm
Przyjaźń i nauka u mistrza to rzadsze historie: ten sam rodzaj wraca najwcześniej po 10 i 12 dniach. Żałoba nie czeka. Nadal biegną najwyżej 3 historie naraz, a karta pojawia się najwyżej raz dziennie.

## Poprawki tekstów
„Od śmierci X minął dzień / minęły 3 dni / minęło 5 dni”, „uczy się od 1 dnia”, rodzaj żeński przy posestrzeniu („są sobie bliższe niż rodzina”). Na karcie osoby mistrz zawsze stoi przed uczniem.

## Testy
- `tests/watki3.test.mjs` (nowy, 6 przypadków):
  - pobratymstwo z trwałym wspomnieniem, linią na karcie osoby, jednym pobratymcem na życie i bez sporów między pobratymcami;
  - posestrzenie;
  - żałoba po śmierci małżonka z pieśnią pamięci;
  - „Dać czas” z odmianą „minął / minęły / minęło”;
  - mistrz i uczeń z majstersztykiem i przejęciem fachu;
  - plotki: każda linia wypełniona do końca.
- `tests/watki.test.mjs`: śmierć kończy spór, a zaczyna żałobę.
- Przebiegi z botem, każdy bez błędów i ostrzeżeń, z jedną kartą na historię:
  - epoka I, 80 dni: 15 historii (6 przyjaźni, w tym 2 pobratymstwa; 4 nauki u mistrza, 3 spory, 1 wesele z zalotów);
  - epoka II, 60 dni: 14;
  - epoka III, 50 dni: 13.
  Przed wprowadzeniem odstępu między historiami tego samego rodzaju było ich 27 w 80 dni, w tym 8 pobratymstw.
- Przeglądarka (Chromium, 412×870): karty żałoby, mistrza i posestrzenia, karta osoby i Kronika bez błędów konsoli.
