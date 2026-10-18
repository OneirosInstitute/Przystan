# Przystań 4.0.0-rc.9 — dojścia i transport

Paczka kumulatywna, zawiera wszystkie poprawki RC8 i RC7. Klasyczne menu pozostaje w obu trybach. Zablokowane wyjście wyprawy widać w Zadaniach wraz z lokalizacją; czas wyprawy zaczyna upływać po wyjściu całej załogi. Przed nowym zwiadem lub misją budynku kontrolowane jest dojście i brak niedokończonej dostawy u uczestników. Nieudana próba nie pobiera prowiantu.

```bash
PRZYSTAN_STAGE="$(mktemp -d "$HOME/przystan-rc9-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC9_DROGI_TERMUX.zip" -d "$PRZYSTAN_STAGE"
bash "$PRZYSTAN_STAGE/Przystan_4.0.0_RC9_DROGI/WDROZ_TERMUX.sh"
```

Baza instalatora: main RC8 `fd11ce669488ef4e3a698f16ec737a7390b1147b`. Jeżeli main zmieni się, instalator zatrzyma się przed kopiowaniem. Wymaga wtedy porównania i scalenia, nie omijania kontroli. Próbę bez publikacji wykonuje `bash WDROZ_TERMUX.sh --prepare-only /ścieżka/do/Przystan`.

Skrypt sprawdza integralność, repozytorium i własne zmiany, pobiera main, buduje grę i wykonuje testy oraz próbę silnika; dopiero potem robi commit i push. Z tego środowiska nie publikowano zmian.

Po wdrożeniu całkowicie zamknij aplikację i otwórz ją ponownie. W Kronika → Opcje gry sprawdź **4.0.0-rc.9**. Zachowaj dane aplikacji.
