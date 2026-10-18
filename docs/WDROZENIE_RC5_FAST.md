# RC5 FAST1 — szybsze wdrożenie

Zmiana dotyczy uruchamiania testów w Termux. Kod gry, zasoby, serwer i build są identyczne z wydanym RC5; hash aplikacji pozostaje `cca61713bd`.

## Kontrakt

- Instalacja wykonuje wszystkie 160 kontroli: dotychczasowe 154 oraz sześć nowych kontroli samego sterownika. Osobna próba silnika nadal obejmuje 12 000 klatek, dziesięć restartów i 45 automatycznych zapisów.
- Każdy zestaw działa w osobnym procesie Node. Najwyżej dwa zestawy uruchamiają się równolegle. Wymagane są co najmniej dwa dostępne rdzenie, 3 GiB pamięci całkowitej i 1,5 GiB wolnej pamięci; przy ograniczeniach wybierany jest jeden proces. Uwzględniono limity cgroup v2, gdy są dostępne.
- Build poprzedza testy. Próba silnika, kontrola integralności, kontrola Git i publikacja następują po zielonych testach. Błąd, niepełne podsumowanie, przekroczony limit czasu lub przerwanie blokują przejście dalej. Kolejka nie uruchamia następnych zestawów po wykryciu błędu, a aktywne procesy otrzymują sygnał zakończenia. Po krótkim czasie stosowany jest SIGKILL do całej grupy testu.
- Zachowano indywidualne limity czasu i limit wyjścia 8 MiB. Każdy zaplanowany zestaw musi zakończyć się poprawnym podsumowaniem.
- `npm test` nadal uruchamia pełne 162 przypadki szeregowo, wraz z obiema symulacjami po 1500 dni. Dwie długie próby pozostają wyłącznie dotychczasowym wyjątkiem trybu instalacji. Nie dodano pomijania innych przypadków ani pamięci podręcznej wyników.
- Diagnostycznie można wymusić jeden proces: `npm run test:install -- --workers=1`.

## Zależności i izolacja

Sprawdzono wszystkie 32 dotychczasowe pliki testów. Dane gry i przeglądarki są lokalne dla osobnego procesu. Test serwera używa portu 0 i własnego katalogu tymczasowego. Próba budowania kopiuje źródła do własnego katalogu. Równoległe testy nie zapisują do wspólnego źródła ani do repozytorium użytkownika. Testy sterownika tworzą własne, krótkie zestawy w katalogach tymczasowych.

## Wyniki

- Porównanie tych samych 154 przypadków: **268.0 s → 150.5 s**, o **43.8% krócej** (1.78×). Oba przebiegi: 32 zestawy, 154 kontrole, 0 błędów. Node v24.19.0.
- Sześć regresji sterownika — PASS: zasoby/opcje/podsumowanie, wykonanie wszystkich zestawów i limit równoległości, przerwanie po błędzie, timeout z procesem potomnym, ścieżki i rozróżnienie pełnej oraz instalacyjnej próby.
- Próba `--prepare-only` na czystej kopii aktualnego repozytorium: **33 zestawy, 160 kontroli, 0 błędów**, build, 12 000 klatek próby silnika i integralność — PASS. Własne zmiany gracza zatrzymują instalację przed kopiowaniem — PASS. Bez commitu i push z tego środowiska..

## Zachowane dowody gry

Porównano wszystkie 90 plików źródła gry, zasobów, serwera i budowania z oryginalnym RC5: identyczne bajtowo. Raport RC5 w `docs/WERYFIKACJA_4.0.0_RC5.md` oraz `docs/weryfikacja5/` zachowuje wynik 156 kontroli, obu prób po 1500 dni i Chromium dla tego samego kodu gry. Nie powtarzano długich symulacji ani kontroli wyglądu tylko z powodu zmiany sterownika instalacji. Nowa próba instalacyjna obejmuje wszystkie 160 krótszych przypadków, sześć kontroli sterownika i próbę silnika. Pełna ścieżka 162 przypadków pozostaje dostępna przez `npm test`; zachowanie pełnego i instalacyjnego wyboru sprawdza osobna regresja.

Pomiar porównawczy obejmuje te same 154 przypadki w obu wariantach. To pojedynczy pomiar na tym samym środowisku Node, bez równoległego obciążania go innym dużym zadaniem. Nie jest to obietnica identycznego czasu na fizycznym telefonie. Wyniki zależą od procesora, wolnej pamięci i temperatury; słabsze urządzenia zachowują wykonanie szeregowe.

## Instalacja

Pobierz `Przystan_4.0.0_RC5_SI_TERMUX_FAST.zip` do Pobranych:

```bash
STAGING="$(mktemp -d "$HOME/przystan-rc5-fast-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC5_SI_TERMUX_FAST.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC5_SI/WDROZ_TERMUX.sh"
```

Końcowy warunek publikacji pozostaje `CHECKPOINT PASS: working tree clean, HEAD == origin/main`.
