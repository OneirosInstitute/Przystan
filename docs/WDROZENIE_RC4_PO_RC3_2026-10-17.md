# Naprawa wdrożenia RC4 po RC3

Objaw: po poprawnym wdrożeniu RC3 instalator RC4 wypisywał „STOP: main zmienił się od przygotowania paczki”. RC3 zakończyło się czystym checkpointem `aec87a056e7b52e580f9e923b524cb8212334e46`, a pierwotny RC4 oczekiwał starszego `dbb965e6d76148daf06c3bad002708d03b780763`.

Sprawdzono nowy main: wszystkie 175 śledzonych plików jest identycznych z wcześniej dostarczoną paczką RC3. Nie stwierdzono innych zmian do scalenia. Pełną zawartość RC4 przygotowano na tej zweryfikowanej bazie.

Zakres: oczekiwana baza w `WDROZ_TERMUX.sh`, kontroli repo i manifeście, regresja ich zgodności oraz dokumentacja. Ochrona przed obcym repo, inną gałęzią, własnymi zmianami, kolejną zmianą main i naruszeniem integralności pozostaje aktywna.

Kod w `src/`, zasoby, konfiguracja aplikacji i pliki zbudowanej gry są identyczne z pierwotnym RC4. Wersja nadal wynosi `4.0.0-rc.4`, build `607d90d0e4`. Poprawka nie obejmuje ustaleń późniejszego audytu SI.

Paczka do użycia: **Przystan_4.0.0_RC4_OSADA_TERMUX_FIX.zip**. Zawiera całą RC4 oraz wcześniejsze RC3 i Epokę IV.

```bash
STAGING="$(mktemp -d "$HOME/przystan-rc4-fix-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC4_OSADA_TERMUX_FIX.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC4_OSADA/WDROZ_TERMUX.sh"
```

## Weryfikacja

- Regresja przed poprawką: odtworzony błędny hash RC2, oczekiwany zweryfikowany RC3. Po poprawce 4 przypadki wdrożenia/integralności przechodzą.
- Wykonano rzeczywisty `WDROZ_TERMUX.sh --prepare-only` na czystej kopii checkpointu RC3: kontrola repo, fetch i fast-forward, kopiowanie, build, 28 zestawów / 131 przypadków, runtime i końcowa integralność przeszły. Końcowy komunikat: `PREPARE PASS`.
- Runtime: 12 000 klatek, 10 restartów i 45 automatycznych zapisów w epokach I, III i IV.
- Osobna próba z lokalnym plikiem użytkownika: instalator odrzucił brudne repo przed kopiowaniem; plik oraz stare pliki gry pozostały niezmienione.
- Kod wykonywalny paczki porównano bajtowo z przetestowaną kopią. Kod gry, zasoby i `dist/` porównano także z pierwotną paczką RC4: są identyczne. Z tego powodu nie powtarzano testów wizualnych Chromium — ta poprawka nie zmienia widoku ani mechaniki.
- Po próbie dołączono wyłącznie dokumentację i logi, ponownie przeliczono manifest i sprawdzono integralność końcowego ZIP-a.

Dowody znajdują się w `weryfikacja_rc4_wdrozenie/`. Zrzutu telefonu nie dołączono. Próba odbyła się w Bash/Node w środowisku Linux; nie jest nowym testem na fizycznym telefonie. Instalator uruchomiony przez użytkownika powtarza bramki przed publikacją.
 Nie wykonuje się stąd commitu ani push. Publikuje je instalator uruchomiony przez użytkownika w Termux.
