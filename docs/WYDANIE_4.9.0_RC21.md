# Przystań 4.9.0-rc.21: jedno okno wieczoru, mapa spokoju wyspy, szybsza kontrola

Podstawa: 4.9.0-rc.20 (`2b42df531328b78e4c16aef97bb6ae163c6ae0ac`).

Pierwsze większe wydanie zamiast kilku małych (decyzja z 29.10.2026). Łączy trzy rzeczy: jedno okno na koniec dnia, drugi pakiet życia wyspy i kontrolę wydania w GitHubie.

## Jedno okno na koniec dnia, jedno po nocy
Dotąd wieczorem trzeba było przeklikać trzy karty („Wieczór”, „Dziś w osadzie”, „Nocą”), a rano często czwartą ze snem.

**Teraz:**
- **Wieczór to jedno okno** z 1–5 rzeczami z przebiegu dnia:
  - najpierw ważne wydarzenia (narodziny, wesele, powrót wyprawy, nowy dom, sprawdzony sen), najwyżej trzy;
  - potem jedna albo dwie wypowiedzi przy ogniu;
  - potem drobne sceny dnia.

  W zwyczajny dzień okno jest krótkie: rozmowa i może jedna scena. Jedno dotknięcie je zamyka.
  - Te same zdania nie wracają co wieczór: codzienny połów tej samej osoby pojawia się najwyżej raz na 3 dni. Ślub, kłótnia i zgoda pary to jeden wpis, a nie dwa.
- **Rano okno pokazuje się tylko wtedy, gdy jest po co:**
  - w nocy coś się stało (wilki przy zagrodzie, dziki w zbożu, pożar, sztorm, kradzież, koza uciekła z zagrody). Zdarzenia idą po kolei, a wieczór już ich nie powtarza. Narodziny i śmierć trafiają do wieczornego podsumowania, nie do porannego;
  - ktoś opowiada sen;
  - sen sprawdził się.

  Spokojna noc nie otwiera żadnego okna. Nocne zdanie (puszczyk, plusk w stawie) otwiera ranek tylko po co dziesiątej spokojnej nocy.
- **Sny prorocze są rzadkie:** najwyżej jeden na 8 nocy i z szansą 7% zamiast 32% co noc.
- Wszystko trafia jak dotąd do Kroniki („Wieczory przy ogniu”), a przełącznik wieczornych opowieści działa bez zmian.

## Życie wyspy, pakiet 2: mapa spokoju i siedlisk
- Wyspa ma zgrubną mapę 24 × 24 komórek po 16 × 16 pól. Raz na dobę każda komórka dostaje:
  - **spokój:** odległość od zabudowań, wydeptane ścieżki i polowania w okolicy;
  - **las:** ile drzew naprawdę stoi; wycięte się nie liczą.
- **Pojemność** komórki dla gatunku to siedlisko × las × spokój. Sarna, wilk i niedźwiedź źle znoszą niepokój, a lis, dzik i zając lepiej. Wycinka zabiera miejsce sarnom, dzikom, wilkom i niedźwiedziom, a zającom go dodaje.
- **Wędrówki.** Raz na dobę stado sprawdza, czy jego ostoja je wyżywi i czy nie jest tam za ciasno. Jeśli nie, przenosi się do lepszej komórki w pobliżu: najdalej dwie komórki, nie częściej niż co 3 dni i nie więcej niż 16 stad dziennie.
- **Kronika** zapisuje odejście zwierzyny ze znanej krainy razem z powodem, najwyżej raz na dobę, np. „Sarny odeszły z krainy Zatoka Wraku w stronę krainy Jasna Polana. Za blisko tam ludzi, ścieżek i polowań.” Inne powody to „Wycięto tam las.” i „Za ciasno im tam było.”.
- Koszt: pierwsze liczenie siedlisk ok. 0,25 s raz na grę, potem ok. 12 ms raz na dobę gry.

## Kontrola wydania w GitHubie
- Testy dzielą się na 8 równoległych części, wyrównanych według zmierzonych czasów plików (`tools/test-weights.json`, `--shard` w `tools/run-tests-serial.cjs`). Każda część trwa 2–4 minuty zamiast 75 minut lokalnie.
- 11 testów przeglądarkowych (Chromium) idzie równolegle w GitHubie, każdy z jednym powtórzeniem widocznym w logu jako „powtórka”.
- Osobno: symulacja działania gry, zgodność z Node 18, a dla commitów wydania i main także integralność paczki. Długie scenariusze 1500 dni z epoki IV idą tylko dla main, bez blokowania wydań.
- Repozytorium jest publiczne, więc minuty GitHub Actions nic nie kosztują.

## Testy
- `tests/dzien.test.mjs` (nowy, 4 przypadki):
  - jedno okno wieczoru z 1–5 rzeczami, ważne pierwsze;
  - spokojna noc bez okna, noc z wilkami z oknem;
  - sny najwyżej co 8 nocy;
  - stary format karty dalej działa.
- `tests/przyroda.test.mjs` (+4 przypadki):
  - wycinka wypędza sarny i wilki, zające zostają;
  - stado przenosi się z niespokojnego miejsca, a Kronika podaje powód;
  - stado po przeprowadzce zostaje co najmniej 3 dni;
  - najwyżej jeden wpis o przyrodzie na dobę.
- `tests/deploy-runner.test.mjs` (+1 przypadek): podział na części obejmuje każdy plik dokładnie raz, jest wyrównany i taki sam na każdej maszynie.
- Przebiegi z botem, bez błędów i ostrzeżeń:
  - epoka I, 80 dni: 98 okien do przeklikania (80 wieczorów i 18 poranków); wcześniej ok. 230 kart;
  - epoka II, 40 dni: 49 okien (40 wieczorów i 9 poranków).
- Kontrola w GitHubie (8 części testów, 11 testów przeglądarkowych, symulacja działania, Node 18) trwa ok. 9 minut.
