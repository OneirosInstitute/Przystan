# Przystań 4.5.0-rc.1 — Wyspa 384

Baza: main 4.4.0-rc.2 `9d043ed1c0840d33b4c5354579b4a8b85d67a55f`. Prace na gałęzi `wyspa-384`, wydanie scalone na main (Railway buduje z main).
Piąty krok planu z [projektu wyspy](PROJEKT_WYSPY_5.md): jedna wyspa 384 × 384 od pierwszego dnia, szczegóły blisko kamery, krainy zewnętrzne.

## Wyspa 384

Projekt nowego lądu powstał najpierw jako mapa do akceptacji (narzędzie w Pythonie: `design.py`, `preview.py`, mapa `Przystan_wyspa_384_projekt.png`), a dopiero potem jako generator w grze (`src/p_wyspa.js`). Układ zaakceptowany 20.10.2026 z warunkiem: dawna wyspa zachowuje swoje złoża na początek gry.

- **Dawna wyspa bez zmian.** Rdzeń 192 × 192 liczy się starym kodem w swoich współrzędnych (`LEG`, `worldGenCore`, `odkGen`, `zlGen`, krainy z `p_map.js`) i dopiero potem przesuwa o 96 pól na środek mapy. Sprawdzone dla wysp 2207 i 31: teren, 7397 i 6338 rzeczy (drzewa, krzaki, kamienie…), ślady dawnego ludu, krainy z rolami, stada, plemię, obóz i wrak są identyczne jak w 4.4.0-rc.2. Złoża dawnej wyspy mają te same warstwy co dawniej, więc start i tempo pierwszych lat się nie zmieniają.
- **Nowy ląd** (`WY` w `p_wyspa.js`): Cicha Zatoka wokół rdzenia, trzy przesmyki (groble z plażami), 17 krain z rolami z 4.3, grań z Szczytem Peruna, wschodni grzbiet, rzeki Wierzbna i Czarna Struga z brodami co ~34 pola, Jezioro Lipowe, Wyspy Mew. Kształty z projektu, brzegi z szumu.
- **Złoża nowego lądu są duże**: węgiel 4000 / 15 000 / 40 000, ruda 3000 / 12 000 / 30 000, łom 8000 / 25 000 / 60 000, glina 4000 / 10 000, torf 3000 / 8000, sól i bursztyn. Każde leży w swojej krainie (ścisłe dopasowanie do krainy z projektu, na innych wyspach też).
- **Rzeźba bez ścian.** Rzeki mają skarpy na 2,5–6,5 pola (w górach szersza dolina), brody są niską suchą przeprawą, przesmyki schodzą do wody łagodnie, nowy ląd ma plażę na ostatnich polach przed morzem, a linia brzegu jest wygładzona (bez schodków z siatki pól), dno morza łagodnie opada od każdego brzegu, a dawne morze przy rdzeniu przechodzi w nowe bez progu.
- **Dojście:** na wyspach 2207, 31 i 4096 z obozu da się dojść pieszo do 99,4% pól nowego lądu.
- **Każde pole lądu ma krainę.** Przesmyki przy dawnej wyspie i nowe płycizny dostają najpierw krainę sąsiada z nowego lądu, żeby krainy dawnej wyspy zostały takie jak przed 4.5 (na wyspach 2207 i 31 co do pola).

## Stare zapisy

`wyMigrate` w `p_save.js` przesuwa zapis z mapy 192 na 384: budynki, stada, przysiółki, cele i drogi ludzi, ład wsi, drogi i ich przerwy, odkryte pola (`rev`) i wydeptanie (`tread`), przylądek i tratwę z zadań. Na ekranie wszystko stoi tam, gdzie stało (współrzędne świata się nie zmieniają). Zapis po przejściu ma `mapN: 384`.

`wyMigrateE4`: zapisy epoki IV z 4.0–4.4 miały zastępczy pierścień krain. Świat epoki IV buduje się od nowa z prawdziwej mapy (`e4RealRegions`), osada i folwarki przenoszą się do najbliższej wolnej krainy nowego lądu razem z ludźmi, a wozy w drodze docierają w następnym kroku. Sprawdzone na zapisie z 4.4.0-rc.2 z folwarkiem w zastępczym pierścieniu: folwark stoi na lądzie, w krainie nowego lądu, gra idzie dalej, zapis przechodzi `validateSave`.

## Szczegóły blisko kamery (`p_lod.js`)

- Drzewa, krzaki, kamienie, zioła, trawy, kwiaty, kamyki, paprocie, trzcina, wrzos, kłody i kikuty: jedna siatka z instancjami na całą wyspę jako wzorzec (nic nie rysuje, przyjmuje zmiany) i widok z instancjami z sektorów 8 × 8 pól wokół kadru, dodatkowo tylko tymi w kadrze. Odświeżanie najwyżej ~8 razy na sekundę i tylko po ruchu kamery albo zmianie wzorca.
- Z daleka (kadr szerszy niż 120 pól, przy najniższej grafice 90) drobiazgi znikają, a korony drzew zamieniają się w jeden stożek albo kulę.
- Teren w 64 kawałkach po 48 × 48 pól, bez kawałków samego głębokiego morza; woda tylko tam, gdzie w pobliżu jest płycizna albo ląd.
- Zwierzęta chodzą tylko w pobliżu kamery i nie z daleka.
- Liczby (przeglądarka, telefon 412 × 870, grafika 0): widok startowy około 0,2 mln trójkątów (4.4.0-rc.2: około 0,8 mln), widok całej wyspy około 0,9 mln przy ~680 wywołaniach rysowania.
- Nowa gra w przeglądarce (ta sama maszyna, grafika programowa, dwa pomiary) jest gotowa po 9,4–10,2 s zamiast 13,4–15,2 s w 4.4.0-rc.2: więcej terenu do policzenia, ale dużo mniej do zbudowania i narysowania. Generator nowego lądu liczy szum średniej skali co 2 pola, a dużej co 4, i wygładza.

## Menu

- **Budowa:** wróciły przyciski rodzajów w kilku rzędach, tak jak przed 4.2. Lista rozwijana z 4.2 była przy wielu budynkach mniej wygodna. Pierwszy przycisk to „Możesz teraz” z liczbą budynków, na które starcza materiałów. Wyszukiwarka zostaje nad przyciskami, a dotknięcie rodzaju czyści wyszukiwanie. Reszta menu (pięć działów i widoki) bez zmian.
- **Wygląd księgi** (`p_klimat.js`, tylko CSS):
  - u góry pas haftu krzyżykowego w marzannie i bursztynie;
  - tło z delikatnym słojem lnu;
  - działy jak rzeźbione drewniane tabliczki, wybrany z bursztynową nitką pod spodem;
  - widoki działu ciszej, bez drewna;
  - pod nagłówkami ten sam ścieg co w haftowanym pasie;
  - cieplejsze karty i bursztynowe przyciski.

  Bez animacji, więc bateria tego nie odczuje.

## Epoka IV na prawdziwej mapie

Świat epoki IV (`p_e4_world.js`, `p_e4_game.js`) bierze teraz krainy z mapy gry zamiast zastępczego pierścienia: rola krainy daje jej liczby (żyzność, las, ruda…), pule surowców biorą się z rzeczy na mapie i ze wszystkich złóż (z warstwami), wysokość terenu jest wszędzie ta sama co w grze. Trasy wozów sięgają całej mapy.

## Testy

- Wszystkie 52 zestawy (265 przypadków) przechodzą na wyspie 384 (`npm run test:install`, `npm run test:runtime`, `tools/verify-package.cjs`).
- Zmienione oczekiwania: pola w testach ruchu, epoki IV i przepływu ludzi przesunięte o 96 (ten sam teren co dawniej), `e4-fit` szuka krainy z głęboką rudą poza dawną wyspą, `crowd-flow` ma próg średniego czekania 0,2 i najgorszego 0,6.
- Poza zestawami, skryptami w przeglądarce i w Node:
  - dawna wyspa identyczna z 4.4.0-rc.2 dla wysp 2207 i 31 (teren, rzeczy, ślady, krainy, stada, plemię, obóz, wrak);
  - przejście zapisu z 4.4.0-rc.2 (budynki, ład wsi, odkryte pola, ludzie) i zapisu epoki IV z folwarkiem w zastępczym pierścieniu;
  - dojście pieszo na nowy ląd dla wysp 2207, 31, 4096;
  - zrzuty: start, przesmyk, Zagłębie, łąki, grań, cała wyspa, formularz folwarku z Czarnym Zagłębiem w epoce IV; bez błędów w konsoli.

## Jeszcze nie w tym wydaniu

- Przysiółki na nowym lądzie od epoki II (plan 4.5 w projekcie wyspy).
- Próba na prawdziwym telefonie (FPS i bateria w rdzeniu), bo przeglądarka bez okna rysuje programowo.
