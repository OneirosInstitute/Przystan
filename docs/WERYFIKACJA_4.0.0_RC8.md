# Odbiór 4.0.0-rc.8

Baza: `09b977acc293785f24de77fb8cb2d8224f0833b6` (main RC7). Pierwsza próba instalatora prawidłowo zatrzymała się po aktualizacji main z RC6 do RC7, przed kopiowaniem. Wszystkie 333 śledzone pliki nowego main są bajtowo zgodne z dostarczoną paczką RC7; po porównaniu zmieniono bazę i wykonano końcową próbę od nowa. RC8 jest kumulatywne i zawiera całe RC7. Audyt: `AUDYT_SI_RC8.md`, kontrakt: `KONTRAKT_RC8_SI.md`, dane: `weryfikacja8/results.json`.

| Bramka | Wynik |
|---|---|
| Odtworzenia usterek przed zmianą | 6 z 8 prób zawodziło: zajęte stanowisko, inne wejście, praca z odległości, choroba, zmiana pracy, zamknięcie stanowiska |
| Te same próby po poprawce | 8/8 PASS |
| Nowe testy SI i kontraktu | 16 przypadków PASS; zawarte w pełnej puli, nie dodawane do niej ponownie |
| Pełne regresje instalacyjne | 40 zestawów, 208 przypadków PASS |
| Końcowy instalator z czystego main | Build, 208 przypadków, próba silnika, integralność i diff --check PASS; --prepare-only, HEAD niezmieniony, bez push |
| Ochrona własnych zmian | Zmieniony README zatrzymuje instalację przed kopiowaniem; plik pozostaje identyczny |
| Próba silnika instalatora | 12 000 klatek, 10 restartów i 45 automatycznych zapisów, epoki I, III i IV |
| Chromium — nowe SI | Pion 412×870 i poziom 870×412; różne stanowiska, zgodne pozycje modeli, przerwanie produkcji przez chorobę, jedna przyczyna oczekiwania w trzech widokach, oba menu, Zadania, wskazanie zakładu i odczyt po restarcie PASS |
| Chromium — regresje RC7 | 352×768, 768×352, 412×870: rzeczywisty Fullscreen ze standalone, bilans +40 / −16 / +24, rozwijane sekcje, aktualizacja PWA po zapisie, błąd zapisu i ponowienie PASS |
| Chromium — klasyczne menu | Dwa tryby, osiem zakładek, 412×870, 870×412 i 1280×800; pomoc, śledzenie, lokalizowanie i odczyt offline, epoka IV PASS |
| Chromium — minimalizacja | 16 s bez nowych klatek, rysowania, interwałów i timeoutów; dźwięk zawieszony, freeze/resume i odczyt zapisu PASS |

## Interpretacja i ograniczenia

Obserwator bilansu RC7 pozostaje w zapisie. RC8 nie zmienia gospodarki epoki IV, jej zegara ani zasad rozliczania. Dwie próby pokoleń po 1500 dni zachowano jako historyczne wyniki RC6 w `weryfikacja6/`; nie wykonano ich ponownie i nie zaliczono do 208 świeżych przypadków. Zachowanie starszych epok celowo zmienia się przy trzech wskazanych miejscach pracy — historyczna równość RC6 z RC5 nie jest dowodem równości RC8.

Nowa próba Chromium początkowo napotkała dialogi fabularne po sztucznym przeskoku o 15 dni i wymianę elementu podczas wykonywania zrzutu. Scenariusz przygotowuje teraz pierwszy zwykły dzień pracy, odpowiada na dialogi przez rzeczywiste przyciski i zapisuje cały viewport. Nie usuwa `evOpen` ani nie czyści decyzji, aby wymusić przejście. Walidacja odczytu dotyczy rzeczywistego `serializeSave()` i `decodeSave()`, bo żywy obiekt po odbudowie świata zawiera także przejściowe pola undefined (np. `bld.proj`), które format JSON pomija. Zapis i ponowny odczyt tego formatu przechodzą. Końcowe próby przechodzą.

Nie ukończono przebudowy całego planera, całej fizyki ani wszystkich modeli. Piętnaście pozostałych nakładek, pozostałe wejścia i transport, dojścia do wypraw, wyjście po zabudowaniu terenu i lokalne unikanie ludzi są w kolejce. Wspólna geometria stanowisk dotyczy kuźni, pracowni cieśli i pola.

Po końcowym dopracowaniu opisów i obsługi identyfikatora budynku 0 powtórzono 26 skierowanych przypadków, próbę SI w Chromium oraz cały instalator z 208 testami i próbą silnika. Pozostałe próby Chromium dotyczą poprzedniego sprawdzonego buildu RC8 (zmienione później: teksty bieżącej czynności i obsługa id 0).

Node 24, Chromium 133 z programowym WebGL. Brak pomiaru fizycznego Androida: bateria, temperatura, czas klatki, dotyk, paski systemowe i ubijanie procesu przez OS pozostają niezweryfikowane. Skonfigurowanego zdalnego CI Node 18/24 nie uruchamiano w tym zadaniu.

Po wdrożeniu całkowicie zamknąć grę i otworzyć ponownie; sprawdzić **4.0.0-rc.8** w Kronika → Opcje gry. Zachować dane aplikacji. Instalator robi commit i push dopiero po swoich zielonych bramkach.
