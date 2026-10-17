# Weryfikacja 4.0.0-rc.3

Baza: `dbb965e6d76148daf06c3bad002708d03b780763`. Build: `17f0c39c6b`.

| Wymaganie | Dowód | Wynik |
| --- | --- | --- |
| Brak rysowania i zegarów ukrytej gry | Chromium/WebGL 412×870 i 1280×800, po 16 s; emulowana widoczność dokumentu | PASS: 0 nowych callbacków rAF i draw calls, 0 zarejestrowanych interwałów/timerów, audio suspended |
| Bezpieczny powrót i szybkie przełączanie | Prawdziwy AudioContext, 8 przełączeń, natywny freeze/resume CDP, pagehide/pageshow | PASS: jedna pętla i jeden interwał, audio running |
| Bez nadrabiania czasu w tle | Test deterministyczny: godzina między freeze a resume | PASS |
| Timery dialogów i sieć śpią | Testy cyklu życia; brak nowych żądań podczas ukrycia w Chromium | PASS |
| Zapis przy ukryciu i po błędzie | Dedup zdarzeń wyjścia, retry po nieudanym zapisie, restart w Chromium | PASS |
| Pomoc przysiółkom, śledzenie i stan zapisany | Istniejący scenariusz browser-tasks na obu ekranach, przekazanie raz, realny limit localStorage, diagnoza, offline reload | PASS |
| Regresja logiki i składnia buildu | `npm run build`, `npm test` | PASS: 26 zestawów, 114 przypadków |
| Pełny silnik I/III/IV | `npm run test:runtime` | PASS: 12 000 klatek, 10 restartów, 45 zapisów automatycznych |
| Bateria i cykl życia Androida | Brak fizycznego telefonu/ADB | NIEZWERYFIKOWANE |

`lifecycle-before.log` dokumentuje sześć regresji wykrytych w bazowej RC2. `lifecycle-final.log` ma 17 zielonych przypadków (8 nowych + 9 zapisu); pełna bramka zawiera te przypadki. Natywne zatrzymanie Chromium i emulowane ukrycie są opisane osobno: test nie udaje pomiaru baterii telefonu. Renderer to software ANGLE/SwiftShader. Pierwsze szerokie uruchomienie zatrzymał test oczekujący jeszcze tekstu wersji RC2; produkt zwracał prawidłowe RC3. Zaktualizowano tę oczekiwaną wersję, wykonano osobny test zapisu i ponownie uruchomiono pełną bramkę. To korekta fixture wersji, nie kolejny błąd zapisu.

Polecenia: `npm run build`, `node --test tests/lifecycle.test.mjs tests/autosave.test.mjs`, `npm test`, `npm run test:runtime`, `node tools/browser-lifecycle.cjs`, `node tools/browser-tasks.cjs`, `bash -n WDROZ_TERMUX.sh`, `git diff --check`. Testy przeglądarkowe wymagają Playwright i Chromium; ścieżki można przekazać przez `PRZYSTAN_PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` i `PRZYSTAN_CHROMIUM_ARGS` (tablica JSON). `PRZYSTAN_START_SERVER=1` uruchamia własny serwer QA; `PRZYSTAN_BROWSER_OUTPUT` wskazuje katalog dowodów, a `DATA_DIR` izoluje dane.

Brak bezpośredniego push z tego środowiska. Instalator Termux sam wykonuje bramki przed commitem i push. Archiwum zawiera sumy każdego pliku. Przygotowanie kopii repo i porównanie buildu z paczką opisuje `package-rehearsal.log`. Nie dołączono zrzutów ekranowych ani plików osady użytkownika.
