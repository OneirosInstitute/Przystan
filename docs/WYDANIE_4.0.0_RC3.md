# 4.0.0-rc.3 — uśpienie gry w tle

Pełna paczka zawiera wcześniejszą Epokę IV, Zadania, pomoc przysiółkom i diagnostykę zapisu oraz poprawki cyklu życia aplikacji opisane w `AUDYT_BATERII_4.0.0_RC3.md`. Zachowuje format zapisu `przystan-v7`. Nie wymaga czyszczenia danych ani zaczynania osady od nowa.

Pobierz `Przystan_4.0.0_RC3_BATERIA_TERMUX.zip` do Pobranych. W Termuksie:

```bash
termux-setup-storage
pkg install -y git nodejs-lts unzip openssh

STAGING="$(mktemp -d "$HOME/przystan-rc3-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC3_BATERIA_TERMUX.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC3_BATERIA/WDROZ_TERMUX.sh"
```

Skrypt znajduje repozytorium w `~/Przystan` lub `~/dev/Przystan`; w przeciwnym razie klonuje je przez SSH. Możesz podać inną lokalizację jako argument. Weryfikuje sumy plików, właściwe repo/main, brak własnych zmian i bazę `dbb965e6d76148daf06c3bad002708d03b780763`. Zmiana main w międzyczasie zatrzymuje instalację przed kopiowaniem. Nie używa resetu ani wymuszonego push.

Po skopiowaniu uruchamia build, pełne testy i symulację silnika; dopiero wtedy wykonuje commit i push, a następnie sprawdza czyste drzewo oraz HEAD równe origin/main. Opcja `--prepare-only` kończy się przed commitem i push. Paczka nie została wypchnięta z narzędzi autora.

Po wdrożeniu zamknij wszystkie okna gry i otwórz ją ponownie. W Kronice sprawdź wersję **4.0.0-rc.3**. Stara otwarta karta może nadal wykonywać poprzedni kod mimo wdrożenia nowych plików. Nie czyść danych przeglądarki.

Odbiór na telefonie: rozpocznij od zapisanej osady; schowaj aplikację na minutę i wróć. Data gry nie powinna przeskoczyć, dźwięk powinien wrócić zgodnie z ustawieniem, a zapis przetrwać ponowne otwarcie. Powtórz przy blokadzie ekranu i po usunięciu aplikacji z ostatnich. To test zachowania; ocenę baterii wykonaj oddzielnie na porównywalnym czasie i obciążeniu, bez ładowania i nagrywania ekranu.
