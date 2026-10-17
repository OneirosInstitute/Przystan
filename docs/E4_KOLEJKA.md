# Epoka IV — kolejka wykonania

Baza: main `8cdbc74771162954d8e412c77b80a5f1f867cc17`, Przystań 3.4.2.

1. [x] Blokada zapisu przy przewijaniu nocy: tempo 40× zastępujemy w snapshotach zwykłym tempem powrotu. Regresje i Chromium PASS. Zrzut 6886 potwierdza objaw; nie zawiera samego JSON osady.
2. [x] Trwała tożsamość mieszkańców, gospodarstw i rodów we wszystkich ośrodkach; migracja danych i jawne braki dawnych biografii.
3. [x] Większa wyspa 384×384, funkcjonalne krainy, sektory oraz lądowe połączenia transportowe.
4. [x] Rozbudowy zwykłych domów, przeprowadzka całej rodziny i budowa nowego domu rodowego.
5. [x] Jedenaście specjalizacji folwarków, realne receptury, uprawy, hodowla i magazyny.
6. [x] Autonomia, dziedziczenie, nauka i ciągłość ośmiu pokoleń w testach 1500 dób, także w czterech ośrodkach.
7. [x] Integracja 3D/UI/zapisu, 93 regresje, 12 000 klatek runtime i Chromium dla dwóch rozmiarów ekranu.
8. [x] Jedna paczka Termux z kontrolą integralności i instalatorem blokującym niezgodną bazę.
9. [ ] Odbiór na fizycznym telefonie: pomiary FPS, pamięci i temperatury oraz interakcje dotykowe. Z tego powodu wydanie ma status RC1.

Czerwony build lub test zatrzymuje etap. Szczegóły dowodów i granic weryfikacji: `WERYFIKACJA_4.0.0_RC1.md`. Nie wykonano zdalnego commit/push; wykonuje je użytkownik przez instalator.
