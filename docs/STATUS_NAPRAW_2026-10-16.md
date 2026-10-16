# Przystań, pakiet naprawczy 2026-10-16

## Zaimplementowane
- Mapa: etykiety regionów znikają przy oddaleniu; przy dotknięciu znacznika nazwa pojawia się czasowo. Znaczniki pozostają.
- Panel Osady: poziomo przewijalne kategorie na wąskich ekranach.
- Budynki: zadania dla zagrody, chaty myśliwego, zbieracza i pomostu. Wyznaczony pracownik zabiera prawdziwe zapasy, opuszcza osadę istniejącym systemem wypraw, wraca po upływie czasu z wynikiem i może wrócić do pracy. W panelu zadania widoczny czas, postęp i lokalizacja. Każda wyprawa sprawdza przydział, koszt, dostępność celu i ryzyko.
- Zagroda: oswajanie kozy wymaga właściwej wiedzy i wolnego miejsca. Po pomyślnym powrocie jedno dzikie zwierzę przechodzi z realnego stada do zagrody.
- Chaty: przejrzyste informacje o kolejnych poziomach i blokadach, zapasy dla rodziny.
- Ognisko: nowe rozgrywki korzystają z pierwotnego ogniska w miejscu lądowania jako jedynego serca Przystani; migracja starych zapisów jest bezkolizyjna i zachowuje zabudowę.
- Epoki: dotychczasowe wieloetapowe ciągi zadań głównych I–V oraz dalszych epok pozostają aktywne, bez resetu postępów.
- Pogoda: zorza ma kontrolę głębi, mniejszą intensywność oraz ograniczenie do odpowiedniego zbliżenia.
- Autosave: regularnie co 90 sekund czasu rzeczywistego i przy opuszczaniu strony, bez usuwania walidacji zapisu.

## Kontrola i ograniczenia
- Wszystkie bramy CLI i testy automatyczne należy wykonać przed produkcyjnym wdrożeniem: `npm run build`, `npm test`, `npm run test:runtime`, `node tools/verify-package.cjs`.
- Zapis awaryjny użytkownika testowany z zachowaniem liczby mieszkańców, budynków i doby, oraz prawidłowym ponownym serializowaniem.
- Mobilny Chromium/Playwright: przetestowano układ DOM oraz uruchomienie przycisku misji na atrapowym rendererze. Środowisko nie udostępnia działającego WebGL: NIE oznacza to certyfikacji renderera GPU, wyglądu zorzy ani poboru energii na telefonie.
- Po wdrożeniu wymagany jeszcze test na prawdziwym urządzeniu: całonocny autosave/restart, GPU zorzy i deszczu, FPS/temperatura/bateria, przełączenie aplikacji w tło.
- ZIP nie zawiera folderu `.git`. Commit i push wykonuje operator po zielonych bramach.
