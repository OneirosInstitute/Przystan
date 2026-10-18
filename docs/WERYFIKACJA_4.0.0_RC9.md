# Odbiór 4.0.0-rc.9

Końcowa baza: `fd11ce669488ef4e3a698f16ec737a7390b1147b` (main RC8). Początkowa baza RC7 zmieniła się podczas pracy. Instalator zatrzymał się przed kopiowaniem. Porównano wszystkie 366 śledzonych plików nowego main z dostarczonym RC8: zero różnic. Po dopasowaniu strażników wersji wykonano pełną próbę instalatora od nowa na czystej kopii RC8. Paczka jest kumulatywna.

| Bramka | Wynik |
|---|---|
| Odtworzenie usterek na RC8 przed zmianą | 8 prób, 8 potwierdzonych porażek; dodatkowo końcowa próba rogu stanowiska zawiodła przed poprawką |
| Nowe regresje RC9 | 13/13 PASS, w tym restart i jednokrotna dostawa oraz jedna próba obejmująca 30 definicji produkcji |
| Regresje integracji i UI | 32 skierowane przypadków PASS; 4 kontroli nowej bazy wdrożenia PASS |
| Pełna pula instalacyjna | 41 zestawów, 221 przypadków PASS |
| Końcowy instalator na czystym main RC8 | Ponownie 221 przypadków, build, próba silnika, integralność i diff --check PASS; bez commitu/push, HEAD niezmieniony |
| Własne zmiany użytkownika | Próba z dopisanym README odrzucona przed kopiowaniem, bajty pliku zachowane |
| Silnik z instalatora | 12 000 klatek, 10 restartów, 45 automatycznych zapisów; epoki I, III i IV |
| Chromium — nawigacja | 412×870 i 870×412: blokada wyjścia, brak postępu, Zadania i lokalizowanie w obu menu, czas marszu, inna strona budowy, brak przeskoku, odczyt i jednokrotne dostarczenie PASS |
| Chromium — stanowiska i SI | Dwa widoki: rozdzielne stanowiska, płynne dojście z rogu kafla, modele w pozycjach symulacji, przerwanie produkcji chorego, wspólny powód oczekiwania, wykonawcy i wskazanie pracowni oraz restart PASS |
| Chromium — pełny ekran i bilans | 352×768, 768×352, 412×870: Fullscreen ze standalone, bilans produkcji i zużycia +40/−16, rozwijane opcje, odświeżanie i zamykanie, safe-area; rzeczywista aktualizacja SW, błąd zapisu i ponowienie PASS |
| Chromium — menu i offline | Oba tryby klasycznego menu, osiem zakładek, trzy wielkości ekranu, pomoc przysiółkowi, śledzenie i mapa oraz epoka IV PASS |
| Chromium — minimalizacja | 16 sekund w dwóch widokach bez nowych klatek, rysowania, interwałów, timeoutów i ruchu sieciowego; dźwięk zawieszony, freeze/resume i odczyt PASS |

Pierwsza pełna pula `install-tests.log` obejmowała 220 przypadków. Po wykryciu i poprawce rogu stanowiska powtórzono 32 skierowane przypadki, wszystkie próby Chromium oraz końcowy instalator z 221 przypadkami i próbą silnika. `installer-prepare.log` jest końcowym dowodem integracji.

Dane i surowe logi: `weryfikacja9/results.json` i pliki obok. Kontrakt: `KONTRAKT_RC9_DROGI.md`. Usterki, zmiany i kolejka: `AUDYT_DROGI_RC9.md`. Wyniki skierowane są częściami pełnej puli; nie należy dodawać ich ponownie do 221.

## Granice odbioru

Dwie próby pokoleń po 1500 dni nie były uruchamiane ponownie. Historyczne wyniki RC6 zachowano w poprzednich raportach; nie są świeżym dowodem RC9. Źródła gospodarki i modelu epoki IV, cyklu życia, menu, bilansu i zapisu są identyczne z RC8. Zmiana nawigacji starszych epok jest celowa, nie deklarujemy pełnej zgodności zachowania ze starym silnikiem.

Próby nowej nawigacji w Chromium używają kontrolowanych przeszkód w siatce przejść, z rzeczywistym silnikiem, interfejsem i zapisem. Nie dowodzą każdej topologii naturalnej wyspy. Dialogi początkowe obsługiwano rzeczywistymi przyciskami. Weryfikacja zapisu dotyczy `save()`, `serializeSave()` i `decodeSave()`; żywy graf zawiera również przejściowe undefined i odwołania do sceny, które serializer pomija.

Nie wdrożono nowego silnika kolizji ani nowych modeli mieszkańców. Kontrola budowy chroni kafle pod osobami, ale nie analizuje odcięcia całego korytarza. Osoba już uwięziona w starszym zapisie zachowuje ładunek i czeka na otwarcie drogi. Stare błędne flagi away, odprawa morska, powrót z abstrakcyjnej wyprawy i zwrot kosztów przy anulowaniu pozostają w kolejce.

Node 24, Chromium 133 z programowym WebGL. Bateria, temperatura, czas klatki, dotyk, paski systemowe i ubijanie procesu na fizycznym Androidzie nie były mierzone. Zdalnego CI Node 18/24 nie uruchamiano. Z tego środowiska nie wykonano commitu ani push. Po wdrożeniu zamknąć i ponownie otworzyć aplikację, sprawdzić **4.0.0-rc.9** w Kronika → Opcje gry i zachować dane aplikacji.
