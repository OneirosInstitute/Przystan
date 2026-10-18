# Przystań 4.0.0-rc.8 — SI i stanowiska

Paczka kumulatywna: RC7 oraz sprawdzony etap SI. Stary układ menu pozostaje. Kuźnia, pracownia cieśli i pole wybierają wolne, osiągalne stanowiska. Nie ma naliczania pracy z odległej pozycji, po utracie przydziału, ciężkiej chorobie lub zamknięciu stanowiska. Dostawy zachowują ładunek. Pracownie pokazują wykonawców i trafiają do Zadań ze stanem, miejscem oraz lokalizowaniem.

```bash
PRZYSTAN_STAGE="$(mktemp -d "$HOME/przystan-rc8-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC8_SI_TERMUX.zip" -d "$PRZYSTAN_STAGE"
bash "$PRZYSTAN_STAGE/Przystan_4.0.0_RC8_SI/WDROZ_TERMUX.sh"
```

Baza instalatora to zweryfikowany main RC7 `09b977acc293785f24de77fb8cb2d8224f0833b6`. Jeżeli main zmieni się przed wdrożeniem, instalator zatrzyma się przed kopiowaniem; wymaga wtedy scalenia z nowym main, nie pomijania kontroli.

Po wdrożeniu zamknij aplikację całkowicie i otwórz ponownie. W Kronika → Opcje gry ma być **4.0.0-rc.8**. Zachowaj dane aplikacji. Pomiar produkcji i zużycia z RC7 pozostaje w zapisie; starszy zapis rozpoczyna pomiar przy pierwszym uruchomieniu.

Nie publikowano tej paczki zdalnie w środowisku przygotowania. Skrypt buduje grę, wykonuje testy i próbę silnika, a dopiero następnie robi commit i push. Opcja `--prepare-only` pozwala sprawdzić bez publikacji.

Audyt i ograniczenia: `AUDYT_SI_RC8.md`, `WERYFIKACJA_4.0.0_RC8.md`. To etap SI i trzech stanowisk, bez deklaracji ukończenia całej przebudowy wyspy i grafiki.
