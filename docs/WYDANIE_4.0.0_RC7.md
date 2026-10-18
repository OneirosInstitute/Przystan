# Przystań 4.0.0-rc.7 — ekran, menu i bilans

Paczka kumulatywna: RC6 oraz poprawki zgłoszone na zrzutach 6924–6927.

- Dotykowy start próbuje włączyć pełny ekran także w zainstalowanej aplikacji standalone. Scena zajmuje cały viewport; bezpieczne wcięcia stosowane są do kontrolek pojedynczo. Pełny ekran można ponowić w Kronika → Opcje gry.
- Klasyczne zakładki pozostają. Potrzeby, zapasy, rodziny, wspólnota, cele i pamięć mają rozwijane sekcje. Wybór budynku i opcje gry rozwijają szczegóły na miejscu. Stan rozwinięcia jest zachowany przy odświeżaniu liczb.
- Zapasy pokazują stan, produkcję/pozyskanie, zużycie i bilans na dobę gry. Osobno widoczne jest zapotrzebowanie na posiłki. Te same dane są w szybkim oknie zapasów i w menu, w obu trybach i epoce IV.
- Pomiar obserwuje rzeczywiste operacje magazynowe. Dostawa i przesunięcie zapasów nie są produkcją. Historia pomiaru trafia do zapisu; pierwsze uruchomienie po aktualizacji rozpoczyna pomiar, bez wymyślania historycznych wyników. Posiłki i część produkcji są rozliczane na koniec doby.
- Aktualizacja service workera odświeża stronę po skutecznym zapisie. Przy błędzie zapisu aktualna gra pozostaje otwarta; przycisk pozwala ponowić aktualizację. Pierwsze przejęcie strony i aktualizacja ukrytej karty nie powodują natychmiastowego przeładowania.

## Termux

```bash
PRZYSTAN_STAGE="$(mktemp -d "$HOME/przystan-rc7-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC7_UI_TERMUX.zip" -d "$PRZYSTAN_STAGE"
bash "$PRZYSTAN_STAGE/Przystan_4.0.0_RC7_UI/WDROZ_TERMUX.sh"
```

Po wdrożeniu zamknij grę całkowicie i otwórz ponownie. W Kronice, po rozwinięciu Opcji gry, ma być wersja **4.0.0-rc.7**. Jest to potrzebne przy przejściu ze starszego interfejsu, który nie miał jeszcze obsługi odświeżenia po zmianie service workera. Zachowaj dane aplikacji i zapis osady.

Instalator sprawdza repozytorium OneirosInstitute/Przystan, gałąź main, czysty katalog i bazę `eb38cf5cce165aedaf13d57d711da3d63d640911`. Następnie buduje grę, uruchamia kontrole i próbę silnika. Commit i push następują po zielonych bramkach. Inna baza lub własne zmiany zatrzymują instalację przed kopiowaniem. Tryb `--prepare-only` służy weryfikacji bez publikowania.

Pełny ekran w przeglądarce jest zależny od jej obsługi i zgody na wywołanie API po geście użytkownika. Obsługę potwierdzamy w Chromium; fizyczne paski i zachowanie konkretnego telefonu wymagają testu na nim.
