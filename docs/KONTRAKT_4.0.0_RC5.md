# RC5 — logika i mieszkańcy

Zakres zatwierdzony: A1–A7 z audytu 2026-10-17. Paczka kumuluje RC4 FIX.

- Jedna jawna polityka przepisu: cel, sezon, sprawność, rezerwa siewna, brak wejścia. Własny cel zastępuje domyślny; zero oznacza bez limitu.
- Ruch sprawdza aktualną siatkę, ponawia trasę i zwalnia rezerwacje bez kasowania ładunku. Brak drogi jest widoczną blokadą.
- Zamiar posiłku, powrotu i mycia nie jest wykonaniem. Efekt wymaga dotarcia i czasu.
- Epoka IV zachowuje agregację gospodarczą, lecz osoby mają zapisane działania, trasy i czas, wspólny odczyt potrzeb oraz faktyczną lokalizację mapy i modelu. Praca zdalna i dekoracyjne okręgi są usuwane.
- Fach zwiększa wydajność przy zachowaniu godzin i zasobów. Mistrz musi być dostępny, przy pracy lub w umówionej nauce.
- Wyroby drewniane, wosk, skóry, pierze i bursztyn otrzymują jawne zastosowanie i mierzalny skutek. Domy z bali nie zamieniają się w folwarki.
- Modele aktualizują etap życia. Animacja wynika ze stanu, dystansu i pracy; pauza zamraża pozę. LOD ogranicza koszt z daleka.
- Starsze zapisy pozostają czytelne, przejścia nie dublują dostaw ani skutków. Brak renderowania/symulacji w ukryciu.
- Menu: przywrócony układ sprzed RC4. Dawne zakładki i karty, Zadania w tym samym panelu, ustawienia w Kronice; bez Pulpitu i katalogu Działów. Postępy, akcje pomocy i lokalizowanie pozostają.
- Odbiór: regresje L01–L11, pełny zestaw, runtime, Chromium obu trybów i epok, próba instalatora, integralność ZIP. Fizyczny telefon wymaga osobnego pomiaru użytkownika i nie może być zastąpiony programowym WebGL.

Hierarchia I–III: zagrożenie/zdrowie → bezpieczne rozliczenie ładunku → potrzeby → przydział → zaopatrzenie → prace wspólne. E4: podróż/zdrowie → posiłek/sen → zobowiązanie i zaopatrzenie → nauka/rodzina.

Testy wydania `npm test` obejmują wszystkie 162 przypadki, w tym dwie symulacje po 1500 dni. `npm run test:install` zachowuje pozostałe 160 przypadków (także migrację dawnych bliźniąt), a instalator dodatkowo uruchamia 12 000 klatek próby silnika. Nie pomija się ciężkich scenariuszy przed spakowaniem wydania.

FAST1: sześć nowych przypadków sprawdza sterownik testów. Pełne testy pozostają szeregowe; instalacja uruchamia najwyżej dwa niezależne zestawy równolegle, gdy pozwalają procesor i pamięć. Żadna nowa kontrola nie jest pomijana. Szczegóły dowodów oraz zachowane wyniki niezmienionej gry: `WDROZENIE_RC5_FAST.md`.
