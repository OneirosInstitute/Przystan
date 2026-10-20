# Przystań 4.4.0-rc.1 — Folwarki ze złóż i ziemi

> **4.4.0-rc.2** (baza `80feed4`) domyka krainy z 4.3: każda kraina ma swoją cenę. Na nizinach woda wylewa w ulewy i odwilż. Na stokach wiosenny przymrozek ścina kwiat winorośli (winnica dwa dni o połowę wolniej), a deszcz zmywa ziemię (pola −10%). Na kwietnych łąkach każda zagroda, a w grądzie każda chata drwala, zabiera barciom 12% pożytku. Na grani i w borach jest mniej jedzenia. Na mokradłach latem łapie się gorączkę bagienną, a w Zagłębiu kaszel górniczy (dwie nowe choroby, zioła je łagodzą). Na gliniskach wiosną jest błoto. Na wybrzeżu słony wiatr osłabia pola, a w sztorm pomost stoi. Karta krainy ma wiersz „Czym płaci”, a podgląd stawiania i karta budynku pokazują też minusy. Kraina obozu daje plusy, ale nie płaci, żeby początek gry został łagodny. Test: `regions-character` (3 przypadki).

Baza: main 4.3.0-rc.2 `4c410e42271aeb24cbbbd8196c86ef087a04cb69`. Wydanie wypchnięte prosto na main (Railway buduje z main).
Czwarty krok planu z [projektu wyspy](PROJEKT_WYSPY_5.md), rozdział 4. Kolejność w planie się zmienia: folwarki są teraz w 4.4, a wyspa 384 od pierwszego dnia w 4.5.

## Nowe

- **Specjalizacja pasuje do krainy** (`p_e4_catalog.js`: `fitNeeds`, `specialtyFit`). Każda z jedenastu specjalizacji ma wymagania wobec liczb krainy: żyzność, słońce, wilgotność, las, ruda, glina, pożytek. `E4Economy.found` odmawia, gdy kraina ich nie spełnia, i podaje, czego brakuje („Cech hutniczy i narzędzia nie ma tu z czego żyć. Brakuje: złoże rudy w skale.”).
- **Formularz „Załóż folwark”** (`p_e4_ui.js`):
  - lista krain mówi, co tam pasuje, najpierw to, co na wyspie rzadkie;
  - specjalizacje mają ✓ albo ✗ dla wybranej krainy;
  - pod spodem jest zdanie, czego brakuje;
  - przycisk jest wyłączony, gdy nie ma z czego żyć.
- **Szyb kopalni rudy** (`szyb`, model kopalni z 4.1). Folwark hutników stawia go jako pierwszy. Szyb sięga głębokiego złoża (`oreDeep`, w Zagłębiu ruda×20 000) i daje 2,5 raza więcej rudy z tej samej pracy. Ludzie przy nim „kopią rudę w szybie”. Karta folwarku pokazuje rudę na wierzchu i w głębi, kamień i glinę.
- **Zagłębia w pierścieniu** (`p_e4_world.js`). Poza graniami jest od jednego do trzech Zagłębi z rudą 0,7, nazwanych „Zagłębie …”. Światy zapisane wcześniej zostają bez zmian, bo krainy są w zapisie.
- **Złoża rdzenia przechodzą do krain** (`p_e4_game.js`). Przy Wiecu Rodów odkryte złoża z 4.1 trafiają do pul swoich krain z tym, co w nich zostało: ruda w głąb (pod szyb), kamień i glina na wierzch.

## Testy

- Nowy zestaw `e4-fit` (4 przypadki):
  - na trzech wyspach każda specjalizacja ma choć jedną krainę;
  - huta pasuje do grani, a nie do łąki;
  - założenie huty bez rudy jest odrzucone i nic się nie zmienia;
  - szyb bierze z głębokiego złoża i z tej samej pracy daje 2,5 raza więcej;
  - złoże rudy z rdzenia przechodzi do krainy w całości.
- `ai-specialties` (11 folwarków przez 200 dni) daje te same wyniki, a huta nadal robi narzędzia.
- `npm run test:install`: 52 zestawy. `npm run test:runtime`: pętla epok I, III i IV.
- Przeglądarka: formularz w epoce IV z Zagłębiem (huta ✓) i Zatoką (huta ✗, przycisk wyłączony), brak błędów w konsoli.

## Jeszcze nie w tym wydaniu

Wozy zależne od nawierzchni drogi, napięcia między folwarkami (woda, wypas na łąkach z barciami) i wyspa 384 od pierwszego dnia.
