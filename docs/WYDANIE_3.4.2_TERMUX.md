# Przystań 3.4.2: jedna paczka S01–S05 i autosave

Baza: `OneirosInstitute/Przystan`, `main`, commit `20d185673cb48ac9a45358f3046f41ed8d34800d`.
Dołączono `Przystan_S02_S05_MASTER_2026-10-16.zip`. Moduł transportu
`src/p_woz.js` pozostaje dokładnie w wersji aktualnego main, z poprawką S01.
W paczce są pełne źródła, lokalne zasoby, gotowy `dist/`, testy oraz skrypt wdrożenia.

## Naprawa zapisu

Odtworzono błąd w dotychczasowej wersji: praca noszenia wody ustawia
`carry=[{res:'woda',q:0}]`. Walidator dopuszczał tylko zasoby magazynu,
więc odrzucał stan gry podczas tej pracy i zachowywał starszy zapis.
Wyjątek obejmuje teraz wyłącznie zerowy znacznik prawidłowej fazy noszenia wody.
Nie dopuszcza dowolnych zasobów ani dodatnich ilości wody w magazynie.
Transport wody wznawia się po restarcie; efekt nalicza się po dotarciu, raz.

Nowa osada zapisuje się po zakończeniu wszystkich kroków uruchomienia.
Autosave działa co 15 sekund czasu rzeczywistego, również podczas pauzy,
a także przy zmianie dnia i schowaniu/opuszczeniu strony. Karta „Kronika i zapis”
pokazuje godzinę ostatniego udanego zapisu oraz przycisk „Zapisz teraz”.
Błąd pamięci przeglądarki pozostawia poprzedni zapis i widoczną informację;
następny autosave ponawia próbę. Nieczytelnego starego zapisu nie nadpisujemy.
Klucz pozostaje `przystan-v7`, bez resetu osady.

## Zawartość integracji

- S01: priorytety i przydziały oraz poprawka dostaw na zakończone place budowy z main.
- S02: jesienne przygotowanie żywności i opału.
- S03: przetwory domowe z rzeczywistym kosztem i limitem dziennym.
- S04: presja polowań i regeneracja stad.
- S05: ograniczanie animacji zwierząt w trybie baterii.
- Zachowane wcześniejsze poprawki 3.4.1, ognisko, zadania budynków, UI i kampania.

## Wdrożenie przez Termux

Pobierz `Przystan_3.4.2_S01_S05_AUTOSAVE_TERMUX.zip` do Download i wykonaj:

```bash
(
set -e
ARCHIVE="$HOME/storage/downloads/Przystan_3.4.2_S01_S05_AUTOSAVE_TERMUX.zip"
STAGING="$(mktemp -d "$HOME/przystan-342.XXXXXX")"
unzip -q "$ARCHIVE" -d "$STAGING"
bash "$STAGING/Przystan_3.4.2_S01_S05_AUTOSAVE/WDROZ_TERMUX.sh"
)
```

Wymagane: Git, Node.js 18+, unzip i dostęp GitHub skonfigurowany w Termux.
Skrypt znajduje `$HOME/Przystan` lub `$HOME/dev/Przystan`; jeśli repo nie istnieje,
klonuje je przez SSH do drugiej lokalizacji. Opcjonalnie można podać katalog repo
jako jedyny argument skryptu. Przed kopiowaniem sprawdza repo, main, czysty Git,
konkretny commit bazowy i integralność paczki. Po kopiowaniu wykonuje build,
pełne testy, runtime i kontrolę integralności, dopiero potem commit i push.
Jeśli main zmieni się od wskazanej bazy, skrypt zatrzyma się przed kopiowaniem.
Nie używa resetu, force push ani kasowania lokalnych zmian.

`--prepare-only [katalog-repo]` wykonuje tę samą ścieżkę kopiowania i testów,
kończąc przed commitem/push. Ten tryb zmienia lokalne pliki repo.

## Weryfikacja

Wyniki wydania opisuje `docs/WERYFIKACJA_3.4.2.md`.
Sprawdzenia GPU, dotyku, wydajności i rzeczywistego Androida/PWA pozostają
poza automatyczną symulacją. Po wdrożeniu otwórz dotychczasowy adres gry,
sprawdź wersję 3.4.2, zmień stan osady, odczekaj 15 sekund, sprawdź godzinę zapisu,
schowaj grę i wróć. Zapis w przeglądarce należy do danego adresu i profilu;
przenoszenie na inny adres/telefon odbywa się przez eksport/import pliku.
