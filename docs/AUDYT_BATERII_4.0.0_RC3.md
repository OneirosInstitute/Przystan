# Przystań 4.0.0-rc.3 — praca w tle i bateria

Data: 17 października 2026. Baza: `dbb965e6d76148daf06c3bad002708d03b780763` (wdrożona RC2). Zakres: aplikacja web/PWA, renderer, symulacja, audio, timery, żądania sieciowe i service worker. Brak połączenia z fizycznym telefonem użytkownika.

## Co wykryto w RC2

1. **Renderer i symulacja miały już osłonę `document.hidden`.** Nie ma podstaw do twierdzenia, że zgłoszony telefon rysował scenę po zminimalizowaniu. Sama pętla nadal rezerwowała następny `requestAnimationFrame`; przeglądarki zwykle usypiają takie wywołania, ale aplikacja nie anulowała ich samodzielnie.
2. **Interwał zapisu pozostawał zarejestrowany co 15 sekund.** Ukryta karta nie zapisywała przez ten interwał, lecz jego callback mógł się budzić zależnie od polityki przeglądarki. Dialogi oczekujące na zakończenie innego dialogu ponawiały próby co 0,7–4 sekundy. To nie był dowód wysokiego zużycia baterii telefonu, lecz rzeczywista zbędna praca w kodzie.
3. **Audio miało osłonę widoczności, ale brakowało obsługi odrzuconych Promise oraz wyścigu suspend/resume.** Późne zakończenie suspend mogło pozostawić grę bez dźwięku po powrocie. Nie wykazano, że na telefonie użytkownika dźwięk rzeczywiście działał w tle.
4. **Żądanie wyspy tygodnia mogło dobiegać końca w tle**, z natywnym limitem 4 sekund. Nie znaleziono ciągłego pollingu poza zegarem gry.
5. **Przy wyjściu te same dane mogły być zapisywane kolejno przez visibilitychange, pagehide i beforeunload.** To dodatkowa serializacja i zapis, szczególnie kosztowne przy dużej osadzie.

## Wprowadzone zachowanie

- Wspólna bramka widoczności, `pagehide/pageshow` i `freeze/resume` zatrzymuje rekurencyjną pętlę klatek oraz interwał zapisu.
- Timery dialogów, budów i komunikatów przechowują pozostały czas. W tle nie uruchamiają kolejnych prób. Wracają po ponownym pokazaniu gry.
- Po ukryciu następuje jeden udany zapis. Kolejne zdarzenie wyjścia może ponowić próbę, jeżeli zapis się nie udał. Błąd nadal jest widoczny i nie zamienia się w pozorny sukces.
- Audio jest usypiane także przy pagehide i freeze. Operacje suspend/resume są serializowane, odrzucenia obsłużone; interakcja gracza może ponowić resume, gdy wymaga tego polityka przeglądarki.
- Aktywne żądania wyspy tygodnia są przerywane, a nowe nie startują w tle. Przerwany sezonowy wynik może być wysłany po powrocie zwykłym zegarem gry. Wczytanie listy na ekranie startowym nie jest automatycznie ponawiane.
- Animacje CSS są wstrzymywane. Powrót odtwarza dokładnie jedną pętlę i jeden interwał. Czas spędzony w tle nie jest nadrabiany przez symulację. Szybkość gry i ręczna pauza pozostają zachowane.
- Początkowo ukryta strona nie wykonuje zdjęcia sceny startowej ani nie planuje klatek. Jednorazowa inicjalizacja modułów i geometrii nadal jest częścią uruchomienia strony.

## Co działa po zamknięciu

Service worker generowany w `build.js` obsługuje wyłącznie install, activate i fetch oraz pamięć podręczną plików. Nie zawiera renderera, zegara symulacji, Web Audio, push, sync ani periodicSync. Kod klienta nie zakłada WebSocket, EventSource, Web Worker, geolokalizacji ani Wake Lock. Przeglądarka może sama wykonać skończoną instalację/aktualizację cache; to nie jest działająca w tle rozgrywka.

Po ukryciu zachowujemy obiekty sceny i bufory dla szybkiego powrotu. Pamięć zajęta przez uśpiony proces nie oznacza, że scena jest rysowana. Nie wymuszamy utraty kontekstu WebGL ani zamykania procesu przeglądarki. Nagłe zabicie procesu przez Androida nie gwarantuje zdarzenia wyjścia — dlatego zapis przy ukryciu pozostaje istotny.

Natywne, jednorazowe timery sprzątania pobranego pliku i limitu pobierania pozostają ograniczone czasowo. Mogą zakończyć wcześniej zlecone pobieranie; nie ponawiają pracy ani nie renderują sceny. Dwa jednorazowe callbacki rAF interfejsu nie są cyklicznym zegarem gry.

## Koszt przy otwartej grze

Największe spodziewane koszty to WebGL: rozdzielczość zależna od DPR, cienie (Ultra 4096), postprocessing i animacje świata. Te cechy nie zostały usunięte. Istniejący tryb Bateria ogranicza rozdzielczość i liczbę klatek; Niska grafika zmniejsza dalszy koszt. Zwykła pauza przy widocznej scenie nadal pozwala animować wodę i otoczenie (docelowo 20 kl./s, w oszczędnym 8 kl./s po uspokojeniu interakcji). Na małym ekranie otwarta księga ogranicza scenę do 12/6 kl./s. Są to limity kodu, a nie zmierzony FPS telefonu ani procent oszczędności.

## Termux po pomiarach

Wcześniejsze instrukcje pomiaru w tej rozmowie zawierały `termux-wake-lock`. Jeżeli zostały użyte, po zakończeniu pomiarów wykonaj `termux-wake-unlock`. Pierwsze polecenie zapobiega uśpieniu CPU przez blokadę Termuksa; drugie ją zwalnia. To niezależne od pętli gry. Nie ustalono, czy blokada na telefonie użytkownika jest obecnie aktywna. Nie zwalniaj jej podczas pomiaru, który celowo wymaga działania w tle. Źródło: [oficjalne narzędzia Termux](https://github.com/termux/termux-tools/blob/master/doc/termux.1.md.in).

## Weryfikacja i jej granice

Regresje obejmują zatrzymanie schedulerów, osobny pagehide i freeze, kolejność powrotu, brak nadrabiania godziny w tle, ponawianie dialogów dopiero po powrocie, wyścig audio, odrzucony suspend, początkowo ukryty start, deduplikację/ponowienie zapisu oraz anulowanie żądań. Pierwsze sześć testów wykryło brak wymaganego zachowania w niezmienionej RC2.

Test Chromium mierzy rzeczywiste wywołania WebGL, kolejki rAF, interwały, timery i stan prawdziwego AudioContext na 412×870 i 1280×800. Ukrycie `document` jest jawnie emulowane przez izolowany test; freeze/resume dodatkowo pochodzi z natywnego CDP. Pozwala to sprawdzić własną bramkę aplikacji także bez pomocy automatycznego throttlingu przeglądarki. Nie jest to test fizycznego zminimalizowania aplikacji na Androidzie. Szczegółowe wyniki i komendy są w `WERYFIKACJA_4.0.0_RC3.md` i katalogu `weryfikacja4rc3`.

Brak pomiaru prądu, procentów baterii, temperatury i mocy GPU telefonu. Brak dowodu dotyczącego pozostałych kart Chrome i innych aplikacji. Poprawka nie pozwala obiecać zerowego poboru energii przez cały proces przeglądarki. Nie stanowi też rozpoznania wcześniejszego błędu zapisu konkretnej osady użytkownika, którego pliku awaryjnego nadal nie otrzymano.

Dokumentacja platformy: [Chrome Page Lifecycle](https://developer.chrome.com/docs/web-platform/page-lifecycle-api), [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [AudioContext.suspend](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/suspend).
