# Wydanie 4.0.0-rc.4

**Aktualizacja instalatora po RC3:** użyj paczki z końcówką `_FIX.zip`. Wymaga zweryfikowanego checkpointu RC3 `aec87a056e7b52e580f9e923b524cb8212334e46`. Kod gry RC4 pozostaje identyczny. Szczegóły: `WDROZENIE_RC4_PO_RC3_2026-10-17.md`.

Jedna pełna paczka: **zaopatrzenie pracowników produkcji, rozbudowany dziennik Zadań i nowe menu Cichej wyspy oraz Pełnego widoku**. Zawiera także wszystkie poprawki RC3 i Epokę IV. Klucz zapisu `przystan-v7` pozostaje zgodny. Nie trzeba instalować pośrednich paczek.

Pracownik warsztatu z brakującym surowcem pozyskuje go na odkrytej, osiągalnej mapie i niesie do magazynu. Zachowuje przydział do warsztatu. Ma 55% tempa zbioru przy tych samych umiejętnościach. Gotowy zapas kieruje go do prac społecznych. Złoże, wiedza, pora roku i transport nadal ograniczają pracę. Jeżeli brakuje przetwórni lub możliwego źródła, zadanie pokazuje blokadę.

Nowe wejście **Zadania** jest widoczne w obu trybach. Zawiera cele aktu, prośby, zaopatrzenie, budowy i pozostałe aktywne czynności. **Działy → Gra i zapis** prowadzi do zmiany trybu, zapisu/importu i ustawień. Szczegóły układu są w `MENU_4.0.0_RC4.md`.

Dodatkowo usunięto odtworzony błąd obsługi paska tempa: przycisk Bateria/Fotografia bez `data-sp` mógł wpisać `NaN` jako szybkość i zablokować zapis. Tylko rzeczywisty przycisk tempa ustawia teraz szybkość. Nie dowodzi to przyczyny wcześniejszego problemu konkretnej osady użytkownika — jej pliku awaryjnego nie dostarczono.

## Termux

Pobierz ZIP do katalogu Pobrane, następnie:

```bash
STAGING="$(mktemp -d "$HOME/przystan-rc4-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC4_OSADA_TERMUX_FIX.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC4_OSADA/WDROZ_TERMUX.sh"
```

Jeśli urządzenie nie ma jeszcze narzędzi lub dostępu do Pobranych: `termux-setup-storage` oraz `pkg install -y git nodejs-lts unzip openssh`.

Instalator szuka repo w `~/Przystan` lub `~/dev/Przystan`, ewentualnie klonuje je przez SSH. Można przekazać własny katalog repo jako argument. Sprawdza repo, main, brak własnych zmian i dokładną bazę `aec87a056e7b52e580f9e923b524cb8212334e46`. Zmiana main zatrzymuje instalację przed kopiowaniem. Integralność plików, build, pełne testy i runtime są bramką przed commitem i push. `--prepare-only` kończy się przed commitem/push. Z narzędzi autora nie wykonano push.

Po wdrożeniu zamknij stare okna gry i otwórz ją ponownie. W zapisie/Kronice potwierdź wersję **4.0.0-rc.4**. Zachowaj dotychczasowe dane przeglądarki.
