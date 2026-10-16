# Weryfikacja Przystani 3.4.2 · 2026-10-16

Baza Git: `20d185673cb48ac9a45358f3046f41ed8d34800d`, main repozytorium
`OneirosInstitute/Przystan`. Build: `92b1b04354`. Środowisko: Node.js 24.19.0.

## Wyniki świeżej próby na czystym repozytorium

| Bramka | Wynik |
|---|---|
| Integralność źródłowej paczki MASTER | PASS, wszystkie wpisy jej manifestu zgodne |
| Zachowanie transportu S01 i jego testu z aktualnego main | PASS, identyczne bajty |
| Uruchomienie skryptu wdrożenia w trybie prepare-only | PASS, exit 0 |
| Integralność rozpakowanej paczki przed kopiowaniem i po nim | PASS |
| `npm run build` | PASS |
| `npm test` | PASS, 17 plików testowych, 63 przypadki, 0 błędów |
| `npm run test:runtime` | PASS, 7200 klatek, 6 restartów |
| Integralność po buildzie i runtime | PASS |
| `git diff --check` oraz `bash -n WDROZ_TERMUX.sh` | PASS |

Pełny zapis terminala: `verification_3.4.2.log` w tym katalogu.
Próba objęła rzeczywiste polecenia skryptu: preflight Git, fetch main,
fast-forward, kopiowanie także plików ukrytych, build, testy i integralność.
Zakończyła się przed commitem i push; z tej sesji nic nie opublikowano.

## Symulacja z automatycznymi zapisami

Restart odczytuje ostatni autosave, bez ręcznego zapisu tuż przed restartem.
Porównywana jest doba i populacja z rzeczywiście zapisanym snapshotem;
zmiany od ostatniego cyklu autosave nie są traktowane jako zapisane.
Licznik zapisów obejmuje automatyczny timer, zapis dobowy i zapis po starcie.

| Epoka | Klatki | Restarty | Zapisy automatyczne | Ludzie na końcu | Dostawy handlowe |
|---|---:|---:|---:|---:|---:|
| 1 | 2400 | 2 | 9 | 18 | 0 |
| 3 | 4800 | 4 | 18 | 34 | 9 |

## Pokrycie naprawy autosave

Dziewięć nowych testów sprawdza: zapis po pełnym uruchomieniu osady,
15-sekundowy timer podczas pauzy i odczyt po restarcie, transport wody
przez zapis/restart z pojedynczym rozliczeniem, schowanie i opuszczenie strony,
błąd storage i ponowienie zapisu, ochronę uszkodzonego starego pliku,
wąski wyjątek walidacji znacznika wody, ręczny zapis z prawdziwym wynikiem
oraz dostawę wody przez noc i zmianę przydziału. Dodatkowy istniejący test
sprawdza zapis otwartej decyzji podczas pauzy.

Przed poprawką odtworzono odrzucenie stanu z prawidłowym znacznikiem
`carry=[{res:'woda',q:0}]` oraz brak natychmiastowego zapisu przy starcie.
Przed poprawką dodatkowej krawędzi zmiana przydziału blokowała dokończenie
dostawy wody; test przeszedł po skorygowaniu bramki pracownika.

## Granice potwierdzenia

Testy uruchamiają rzeczywisty złożony kod gry i prawdziwy serwer HTTP,
z kontrolowanymi atrapami DOM, localStorage, canvas i renderera GPU.
Nie wykonano w tej sesji testu realnego WebGL, Androida/Termuxa/PWA, dotyku,
zużycia baterii, wielogodzinnej sesji ani wszystkich zakończeń kampanii.
Node.js 18 jest w konfiguracji CI, ale ta sesja potwierdza Node.js 24.
Wynik dotyczy integracji i opisanych napraw; nie jest certyfikacją jakości AAAA.

Źródłowy załącznik MASTER: SHA-256
`4395e23dedf74f89b53b8d64e1b8fd79adb47485fb974b0622be0838bbef1359`.
