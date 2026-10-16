# Przystań · wydanie S02–S05 · 2026-10-16

Baza: `51c41a1b6852638e8fee045113d123f7d26bd07f` (S01, `main`).

## Zmiany

- **S02 | Planowanie przed zimą.** Wolni mieszkańcy zwiększają priorytet opału i żywności jesienią, gdy w magazynach zaczyna ich brakować przed zimą. Dotychczasowe świadome przydziały gracza i system S01 pozostają aktywne.
- **S03 | Gospodarstwo domowe.** Rodziny, których dorosły członek rzeczywiście wrócił wieczorem do gotowego domu, mogą przygotować przetwory. Każda partia zużywa 3 porcje warzyw i produkuje 2 porcje kiszonek. Najwyżej dwie partie dziennie w całej osadzie. Działanie jest idempotentne i zapisywane ze stanem gry.
- **S04 | Regeneracja dzikich stad.** Każde udane polowanie zwiększa presję na dane stado, spowalniając jego rozród. Presja stopniowo maleje bez polowania, pozostaje w przedziale 0–1 i przechodzi przez zapis/wczytanie.
- **S05 | Animacje a bateria.** W aktywnym trybie oszczędzania baterii animacje instancji dzikich zwierząt są aktualizowane maksymalnie 8 razy/s. Symulacja populacji, polowania i ekonomii pozostaje nienaruszona.

## Zachowany zakres

Pozostają wszystkie poprzednie systemy w integracji 3.4.1, łącznie z S01, budynkami, zadaniami, mapą, ogniskiem, wyprawami i autosave. Nie podmieniamy ich osobnymi wersjami.

## Bramy

1. Poprawność plików archiwum i manifestu.
2. Build + pełny `npm test`.
3. Testy `test:runtime` obu epok.
4. Testy UI w Chromium, jeśli środowisko pozwala uruchomić renderer.
5. Przed wdrożeniem: zgodność `HEAD`, czyste repo, suma każdego pliku bazowego.
6. Po wdrożeniu: Git `working tree clean` i `HEAD == origin/main`.

Zastrzeżenie: zielona symulacja nie dowodzi płynności WebGL ani zużycia energii na prawdziwym telefonie. Testy wydajności i baterii na urządzeniu pozostają osobną bramką akceptacji mobilnej. Szersze systemy autonomii, magazynów lokalnych, dziedziczenia zawodów i pełnej migracji gatunków nie są częścią tego wydania; nie należy mylić tego inkrementu z kompletną realizacją wizji wszystkich etapów.

## Raport automatyczny (sesja przygotowania wydania)

- Build: PASS.
- Regresja: 16 plików testów, **54/54 PASS**.
- Runtime: **PASS**, 2400 klatek epoki I + 4800 epoki III, testowane restarty i zapisy.
- WebGL/Chromium: niezaliczone środowiskowo (`ERR_BLOCKED_BY_ADMINISTRATOR` dla localhost i file URL).
- Rzeczywisty telefon: brak miarodajnego pomiaru FPS, temperatury lub poboru energii.
