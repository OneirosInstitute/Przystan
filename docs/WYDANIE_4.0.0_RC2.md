# Przystań 4.0.0-rc.2 — Zadania i zapis

Paczka zbiorcza z całą Epoką IV. Baza main:
`1ea311b282a7e6b1c845b364903daada06144555` (4.0.0-rc.1).

## Pomoc i zadania

W księdze Osady wybierz **Zadania**, drugi dział po Ludziach.

- Prośba Lubomirowic prowadzi bezpośrednio do karty z ilością potrzebnych dóbr,
  stanem magazynu, terminem i przyciskiem **Wyślij**. Przy braku zapasów jest
  podana konkretna przyczyna oraz **Jak zdobyć zapasy**.
- **×** na znaczniku oraz **Schowaj znacznik** na karcie chowają powiadomienie.
  Prośba pozostaje w Zadaniach. Nowa potrzeba tego samego przysiółka znów
  pokazuje znacznik. Odczyt i ukrycie przetrwają zapis/wczytanie.
- **Śledź zadanie** wyróżnia je na liście. **Pokaż na mapie** kieruje kamerę
  na istniejący cel. **Pokaż osobę** lokalizuje wykonawcę.
- Filtr **Kto co robi** pokazuje mieszkańców, ich bieżące czynności i miejsca.
  Dla osób na wyprawie dostępny jest przybliżony teren krainy; dokładna
  pozycja poza osadą nie jest wymyślana.
- Lista obejmuje cele osady, prośby, opowieści, budowy i rozbudowy, pola,
  zaznaczone zasoby, wyprawy, czytanie i próby. W IV obejmuje też projekty,
  partie produkcji, uprawy, doświadczenia i rzeczywiste transporty.
- Ostatnio zakończone prośby są zapamiętywane. Pomoc z karty przysiółka i z
  Zadań przechodzi przez jedną bramkę; zasoby nie są pobierane podwójnie.

## Zapis — zakres poprawki i brakujący dowód

Usunięto odtworzoną blokadę zapisu, gdy dodatkowa kopia zajmuje potrzebne
miejsce w localStorage. Gra najpierw sprawdza główny zapis, zwalnia wyłącznie
drugą kopię gry i ponawia zapis. Przy nieudanej próbie zachowuje główny zapis
i próbuje odtworzyć kopię. Nie czyści innych kluczy ani danych witryny.

Walidator nadal odrzuca uszkodzone dane, ale wskazuje teraz przyczynę i pole,
np. `people[0].hp`. Kronika pokazuje wersję gry oraz szczegóły błędu.
Przycisk **Pobierz diagnozę zapisu** tworzy mały raport JSON. Eksport pełnego
pliku awaryjnego pozostaje dostępny na czerwonym komunikacie.

Zrzuty 6888/6889/6897/6898 nie zawierają stanu gry ani treści błędu systemowego.
Bez pliku awaryjnego JSON użytkownika nie potwierdzono, czy powodem jego
konkretnej awarii jest limit miejsca, walidacja, uprawnienia czy starsza karta
z poprzednią wersją. Nie oznaczamy tej konkretnej osady jako odzyskanej.

Po instalacji otwórz grę ponownie i sprawdź w **Kronice**, czy widnieje
`4.0.0-rc.2`. Wybierz **Zapisz teraz**. Jeśli błąd pozostanie, pobierz diagnozę
i pełny plik awaryjny; te pliki umożliwiają dokładne odtworzenie awarii.

## Termux

Pobierz ZIP do folderu Pobrane, a następnie:

```bash
termux-setup-storage
pkg install -y git nodejs-lts unzip openssh
STAGING="$(mktemp -d "$HOME/przystan-rc2-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC2_ZAPIS_ZADANIA_TERMUX.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC2_ZAPIS_ZADANIA/WDROZ_TERMUX.sh"
```

Skrypt wymaga istniejącego dostępu do GitHub. Sprawdza repozytorium, main,
czystość drzewa, bazę, sumy plików, build, testy i runtime. Dopiero wtedy
wykonuje commit i push. Inna baza lub własne zmiany zatrzymują wdrożenie.
Nie stosuj reset/force do obchodzenia blokady. Tryb `--prepare-only` wykonuje
lokalne bramki bez commitu/push.

Status RC pozostaje do odbioru na fizycznym telefonie: dotyk, płynność,
pamięć i nagrzewanie. Automatyczne wyniki są opisane w raporcie weryfikacji.
