# Przystań 4.0.0-rc.1 — Rody i folwarki

Baza: `OneirosInstitute/Przystan`, main
`8cdbc74771162954d8e412c77b80a5f1f867cc17` (3.4.2).
Paczka zawiera całą implementację Epoki IV i poprawkę zapisu. Oznaczenie RC
pozostaje do odbioru płynności, pamięci i dotyku na fizycznym telefonie.

## Naprawa zapisu

Przewijanie nocy używa chwilowego tempa 40×, które dawny walidator odrzucał.
Snapshot zapisuje teraz zwykłe tempo powrotu, także w oczekującej decyzji.
Wczytanie dawnego zapisu z 40× normalizuje tempo, zachowując stan osady.
Odtworzono ten błąd i dodano regresje timera, północy, decyzji i importu.
Zrzut ekranu potwierdza komunikat; bez pliku JSON nie można potwierdzić
odzyskania konkretnej osady użytkownika.

## Rozgrywka

- Epoka IV pojawia się po ukończeniu III. W panelu osady wybierz Wiec Rodów.
  Mieszkańcy kończą aktywne dostawy i wyprawy przed zmianą epoki.
- Stare chaty i domy pozostają na swoich miejscach. Mają ogródek, piwniczkę,
  zielnik i pracownię domowych wyrobów. Budowy, rozbudowy, dojrzewające pola
  i opłacone kolejki wozów zachowują postęp.
- Wyprawy pozwalają wybrać całą rodzinę, krainę i specjalizację. Rodzina
  zabiera rzeczywiste materiały i prowiant, idzie trasą lądową, po dotarciu
  buduje dom rodowy. Dotychczasowy dom nie zmienia się w folwark.
- Wyspa ma 384×384 kroki wobec dawnych 192×192: czterokrotną powierzchnię
  siatki. Dawna osada i ląd w centrum pozostają rozpoznawalne; krainy mają
  różną żyzność, nasłonecznienie, lasy, złoża, wodę i pożytki dla pszczół.
- Jedenaście specjalizacji obejmuje zboże/młyn/piekarnię, winnicę/winiarnię,
  browar/karczmę, mięso/wędzenie, kozy/kury/świnie, hutnictwo/narzędzia,
  drewno/bednarstwo, tkaniny/odzież, garncarstwo/cegły, sad/pasiekę oraz zioła.
- Receptury mają składniki, pracę i czas. Fermentacja i inne partie przetrwają
  restart. Magazyny rezerwują miejsce dla dostaw i rozpoczętej produkcji;
  brak miejsca wstrzymuje odbiór plonu. Zima zatrzymuje wzrost upraw.
- Nowe odmiany wymagają prób i sadzonek. Winnica dojrzewa 30 dni, sad 40 dni.
  Zwierzęta mają własne ID, płeć, wiek, rodziców, zdrowie i ciążę. Oswajanie
  uszczupla dzikie stado, hodowla zużywa paszę i pracę, ubój usuwa zwierzę.
- Autonomia odbudowuje żywność, rozwija dach i składy, wykonuje fach, zamawia
  brakujące dobra u sąsiadów i chroni rezerwę dawcy. Transport potrzebuje
  przewoźnika, prowiantu, trasy i pojemności; towar dociera dopiero u celu.
- Jedna lista osób obejmuje całą wyspę. Związki unikają bliskiego pokrewieństwa,
  partnerzy z innych osad przeprowadzają się fizycznie, dzieci dziedziczą
  genealogiczne ID, uczniowie uczą się od mistrzów, następcy przejmują ośrodki.
  Zmarli pozostają w archiwum. Brakujące biografie dawnych anonimowych
  mieszkańców są jawnie oznaczone, wiek i płeć tych osób są oszacowaniami.

## Zapis i powrót

Zapis pozostaje lokalny dla tego samego adresu strony i przeglądarki. Nadal
działa timer 15 s, zapis doby, przejście w tło oraz eksport/import JSON.
Przed migracją powstaje osobna kopia `przystan-v7-przed-epoka4`.
Nie kasuj danych witryny podczas aktualizacji. Przed wdrożeniem pobierz
aktualny zapis w Kronice. Błąd miejsca lub uprawnień przeglądarki pozostaje
jawnym błędem z eksportem awaryjnym, nie fikcyjnym potwierdzeniem zapisu.

## Termux

Archiwum wypakuj do osobnego katalogu. Instalator rozpoznaje istniejące
`~/Przystan` albo `~/dev/Przystan`, w przeciwnym razie klonuje repo przez SSH.
Wymaga wcześniej działającego dostępu SSH do GitHub.

```bash
termux-setup-storage
pkg install -y git nodejs-lts unzip openssh
STAGING="$(mktemp -d "$HOME/przystan-e4-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC1_EPOKA_IV_TERMUX.zip" -d "$STAGING"
bash "$STAGING/Przystan_4.0.0_RC1_EPOKA_IV/WDROZ_TERMUX.sh"
```

Skrypt sprawdza repo, main, czystość drzewa i dokładną bazę; potem kopiuje
pliki, weryfikuje sumy, buduje grę, uruchamia testy i runtime. Dopiero po
zielonych bramkach wykonuje commit i push. Kończy kontrolą czystego drzewa
oraz `HEAD == origin/main`. Zatrzymania na zmienionym main nie obchodź
poleceniami reset/force. Wariant `--prepare-only` wykonuje lokalne bramki bez
commitu i push. Konfiguracja istniejącego hostingu pozostaje w repo.

## Odbiór na urządzeniu

1. Wczytaj własny zapis 3.4.2 i wyeksportuj go przed Wiecem Rodów.
2. Przewiń noc, odczekaj autosave, schowaj aplikację, uruchom ją ponownie.
3. Po ukończeniu III wejdź w IV; załóż folwark i uruchom grę ponownie w drodze.
4. Sprawdź stare domy, postęp budów, magazyny, genealogię i rozliczenie dostawy.
5. Otwórz widok całej wyspy, przybliż folwarki, sprawdź dotyk i przewijanie paneli.
6. Porównaj jakość niską i wysoką podczas dłuższej sesji; zmierz FPS, zużycie
   pamięci i temperaturę urządzenia. Te pomiary są warunkiem zatwierdzenia
   wydania produkcyjnego, nie są zastąpione wynikiem testów Node/Chromium.
