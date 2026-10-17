# Przystań

Naprawa instalacji RC4 po RC3: **Przystan_4.0.0_RC4_OSADA_TERMUX_FIX.zip**. [Instrukcja i raport](docs/WDROZENIE_RC4_PO_RC3_2026-10-17.md).

Spokojna gra o osiemnastu rozbitkach, którzy budują osadę na dzikiej, nieznanej wyspie. Izometryczny widok 3D (Three.js), czas rzeczywisty, pory roku, pokolenia i wiedza przekazywana od mistrza do ucznia. Gra działa w przeglądarce i instaluje się na telefonie jako aplikacja na pełnym ekranie (PWA), także bez internetu.

## Uruchomienie

```bash
npm start          # buduje dist/ i uruchamia serwer na http://localhost:3000
npm run build      # tylko buduje dist/
npm test           # składnia obu skryptów i regresje logiki/API
npm run test:runtime # pełna pętla silnika i restarty; bez prawdziwego GPU/DOM
```

Nie ma zależności do instalowania. Wystarczy Node.js 18 lub nowszy.

## Wydanie 4.0.0-rc.4

Pracownicy warsztatów pozyskują brakujące składniki, zachowując przydział do
produkcji. Zadania pokazują postęp, blokady, wykonawców i lokalizację, a wybraną
sprawę można śledzić na mapie. Cicha wyspa i Pełne menu mają pięć stałych wejść:
Pulpit, Zadania, Praca, Budowa i Działy. Duże sekcje rozwijają się na żądanie.

Naprawiono także obsługę przycisków Bateria/Fotografia, która mogła ustawić
nieprawidłowe tempo i uniemożliwić zapis. Paczka zawiera RC3 oraz Epokę IV.

[Projekt obu trybów menu](docs/MENU_4.0.0_RC4.md) · [ZIP i Termux](docs/WYDANIE_4.0.0_RC4.md) · [Weryfikacja](docs/WERYFIKACJA_4.0.0_RC4.md)

## Wydanie 4.0.0-rc.3

Zminimalizowana gra anuluje pętlę klatek i interwał zapisu, usypia audio oraz timery dialogów, przerywa żądania wyspy tygodnia i wstrzymuje animacje CSS. Powrót uruchamia jeden zegar bez nadrabiania czasu w tle. Format zapisów i zawartość Epoki IV pozostają zgodne.

[Audyt baterii i ograniczenia pomiaru](docs/AUDYT_BATERII_4.0.0_RC3.md) · [ZIP i Termux](docs/WYDANIE_4.0.0_RC3.md) · [Weryfikacja](docs/WERYFIKACJA_4.0.0_RC3.md)

## Wydanie 4.0.0-rc.2

Dział Zadania: prośby z akcją pomocy, ukrywanie przeczytanych znaczników,
wykonawcy i lokalizowanie na mapie. Odzyskiwanie miejsca zajętego przez
dodatkową kopię zapasu oraz jawna diagnostyka zapisu. Dokładna przyczyna
awarii osady ze zrzutu wymaga jej pliku JSON.

Instrukcja: [docs/WYDANIE_4.0.0_RC2.md](docs/WYDANIE_4.0.0_RC2.md).

## Wydanie 4.0.0-rc.1 — zawarte w paczce

Epoka IV: większa wyspa, rody, domy rodowe, jedenaście specjalizacji folwarków,
rzeczywiste magazyny i transport oraz ciągłość społeczności przez pokolenia.
Zwykłe domy zachowują swoją tożsamość i otrzymują rozbudowy. Naprawiono także
odrzucanie zapisu podczas przewijania nocy.

Instrukcja i komendy: [docs/WYDANIE_4.0.0_RC1.md](docs/WYDANIE_4.0.0_RC1.md).
Raport rozróżnia testy logiki, Chromium/PWA i odbiór na fizycznym telefonie.
Oznaczenie RC pozostaje do wykonania tego ostatniego odbioru.

## Wydanie 3.4.2 — historia

Pełna integracja S01–S05 z naprawą autosave i wdrożeniem przez Termux:
[docs/WYDANIE_3.4.2_TERMUX.md](docs/WYDANIE_3.4.2_TERMUX.md).
Zapis powstaje przy starcie, co 15 sekund (także w pauzie) i przy przejściu w tło.
Kronika pokazuje godzinę udanego zapisu i przycisk „Zapisz teraz”.

## Stabilizacja 3.4.1

Opis poprawek i ograniczeń: [docs/STABILIZACJA_3.4.1.md](docs/STABILIZACJA_3.4.1.md).
Testy uruchamiaj po buildzie. Czerwony build lub test zatrzymuje commit i wdrożenie.
Scenariusze silnika używają prawdziwego kodu gry oraz atrap DOM, canvas i GPU.
Nie zastępują testu Chrome/PWA i dotyku na telefonie.

Zapis pozostaje pod kluczem `przystan-v7`. Błąd zapisu jest widoczny, a eksport
zapisuje aktualną osadę. Import odrzuca dane nieprawidłowe i zapis innej wyspy;
nie zastępuje nimi poprawnej osady. Przy nieodczytywalnym primary i backupie
automatyczne nadpisanie jest wstrzymane, a plik można zachować do odzyskania.

Pojemność żywności oznacza miejsce pod osłoną. Nadmiar nie znika: pozostaje
dostępny poza osłoną i szybciej się psuje. Karta osady pokazuje tę ilość.

Wyspa tygodnia publikuje **deklarowane wyniki lokalnej gry**. Serwer przelicza
punkty z metryk i rozdziela próby podpisanym tokenem, lecz nie odtwarza przebiegu
gry ani nie potwierdza jej uczciwości. Nazwa nie jest kontem. Dla trwałości
tabeli oraz klucza podpisu ustaw trwały `DATA_DIR`; plik klucza pozostaje na serwerze.

## Railway

1. W Railway: **New Project → Deploy from GitHub repo → przystan**.
2. Railway sam wykryje Node.js i użyje `railway.json` (budowa: `npm run build`, start: `npm start`).
3. W ustawieniach usługi: **Settings → Networking → Generate Domain**.
4. Otwórz adres `https://…up.railway.app` w Chrome na telefonie i wybierz „Zainstaluj grę na telefonie”.

Każdy `git push` na gałąź `main` wdraża nową wersję. Zainstalowana gra pobierze ją przy następnym uruchomieniu z internetem.

## Struktura

- `src/` – kod gry podzielony na części, sklejane w tej kolejności przez `build.js`:
  - `p_head.html` – wygląd i układ interfejsu,
  - `p_const.js` – ikony, budynki, zasoby, pogoda,
  - `p_mid.js` – teren, woda, biomy,
  - `p_rest.js` – świat, modele, ludzie, logika, interfejs,
  - `p_map.js` – regiony i minimapa,
  - `p_tech.js` – drzewka postępu,
  - `p_exp.js` – atlas natury i wyprawy,
  - `p_v8.js` – woda, pożary, rozbudowa, obyczaje i wiec, prośby, dymki,
  - `p_bld.js` – poziomy budynków, rozbudowy i nowe budynki wspólnoty,
  - `p_story.js` – wydarzenia, cele, dźwięk,
  - `p_end.js` – atmosfera, pętla gry, start, pełny ekran.
- `assets/` – ikony, zrzuty ekranu do okna instalacji, Three.js r149.
- `build.js` – składa `dist/index.html`, manifest i service worker.
- `server.js` – serwer plików bez zależności.
