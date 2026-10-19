# Odbiór 4.0.0-rc.10 MASTER

Build `12b4501c3d`. Baza main RC9 `492e8bfd1a8ba058f467701115f1e74146343180`. Wszystkie 400 śledzonych plików bazy zgadzały się z wydanym RC9. Paczka jest kumulatywna i zachowuje klasyczne menu.

| Bramka | Świeży wynik |
|---|---|
| Build i składnia | PASS |
| Pełna pula instalacyjna | 47 zestawów / 248 przypadków PASS |
| Dwa rozszerzone scenariusze | Po 1500 dni PASS; nie są częścią powyższej liczby |
| Suma unikalnych przypadków | 250; ponowne przebiegi nie są dodawane do sumy |
| Autonomia jednej osady | 125 żyjących, 9 pokoleń, 168 narodzin i 27 sukcesji |
| Kilka społeczności | 635 żyjących, 4 zamieszkałe ośrodki, 8 pokoleń, 62 dostawy, 56263 zbiory |
| Rzeczywisty serializer po pokoleniach | PASS; dekoder akceptuje końcowy zapis |
| Próba silnika | 12 000 klatek, 10 restartów i 45 automatycznych zapisów w epokach I, III i IV; bez nieoczekiwanych ostrzeżeń |
| Chromium MASTER | Pion i poziom, modele szczegółowe i rzeczywiste stanowiska, pełne karty budowy w obu menu, podpisane czerwone/zielone Zapasy, zwinięte szczegóły PASS |
| Chromium nawigacja i SI | Zamknięte wyjścia, zachowany ładunek i jednokrotny dowóz, stanowiska, dojście z rogu kafla, chory pracownik, wspólna przyczyna blokady, lokalizowanie osób/budynku, restart PASS |
| Chromium mobilne UI | 352×768, 768×352, 412×870; fullscreen ze standalone, bilans +40/−16 i netto +24, odświeżanie, zamykanie i safe area PASS |
| Aktualizacja PWA | Rzeczywista zmiana SW, zapis przed reload, błąd zapisu zatrzymuje reload, ponowienie zachowuje grę PASS |
| Menu i offline | Dwa tryby, osiem zakładek, trzy rozmiary, pomoc Lubomirowicom jednokrotnie, zadania, śledzenie, mapa, offline i epoka IV PASS |
| Minimalizacja | W dwóch widokach brak nowych klatek, rysowania, timerów i żądań w ukryciu; dźwięk suspend oraz freeze/resume PASS |
| Instalator na czystym main RC9 | Ponownie build, 248 przypadków, próba silnika, integralność i diff --check PASS; HEAD pozostał bazą, bez push |
| Ochrona własnych zmian | Zmienione README odrzucone przed kopiowaniem; jego bajty i HEAD zachowane |
| ZIP | CRC, kompletność manifestu, składnia i identyczna odbudowa dist sprawdzane przy pakowaniu |

Pierwsze pełne przebiegi wykryły integrację nowych kolejek z dostawami wody i drewna. Po wspólnej bramce wyboru wolnego miejsca odbioru dłuższa próba silnika odtworzyła zakończenie trasy wewnątrz ponowienia: dalsze przetwarzanie zamkniętej ścieżki powodowało wyjątek. Deterministyczny test potwierdził błąd przed zmianą. Kontrola ruchu kończy teraz bieżący krok natychmiast po ustąpieniu/ponownym planowaniu, a test sprawdza jednokrotne oddanie ładunku. Powtórzono pełną pulę oraz cały przebieg silnika i końcowe scenariusze Chromium. Nie zaliczono przerwanej próby przeglądarki jako dowodu. Scenariusz stanowisk w Chromium uruchamia teraz obu pracowników równocześnie i przesuwa czas oraz pozostałych mieszkańców: dawna próba przesuwała pojedynczą osobę przez nieruchomy tłum przy zatrzymanym zegarze. Po tej poprawce scenariusza oba stanowiska sprawdzono ponownie w pionie i poziomie; reguł produkcji ani asercji fizycznego dojścia nie osłabiono.

Próby pokoleń mają świeży log. Sześć plików silnika świata/modelu/życia/gospodarki/demografii IV pozostało identycznych z RC9 i ich hashe sprawdzono ponownie; późniejsze poprawki ruchu starszych epok nie zmieniły tego silnika. Powtórzona próba instalatora jest dodatkowym wykonaniem tych samych kontroli, nie dodatkowymi unikalnymi przypadkami.

Surowe logi i wyniki: weryfikacja10/results.json i pliki obok. Szczegółowe zmiany, konsolidacja i ograniczenia: AUDYT_MASTER_RC10.md. Powiązania gospodarki: MACIERZ_GOSPODARKI_RC10.md. Kontrakt: KONTRAKT_RC10_MASTER.md i PLAN_ZAMKNIECIA_RC10.md.

## Granice odbioru

Chromium używa programowego WebGL. Nie wykonano pomiarów FPS/czasu klatki, baterii, temperatury, dotyku, pasków systemowych ani ubijania procesu na fizycznym Androidzie. Kontrolowane trasy nie pokrywają każdej topologii wyspy. Nie odtwarzamy niejednoznacznej historii starych away ani nie dopisujemy nagród czy zwrotów bez księgi opłat. Dziewięć i osiem pokoleń w tych scenariuszach nie jest dowodem nieskończonej trwałości każdej konfiguracji gospodarki; złoża mineralne pozostają skończone. Nie uruchamiano zdalnego CI Node 18/24 i nie wykonywano z tego środowiska commitu ani push. Końcowy checkpoint robi instalator uruchomiony przez użytkownika.
