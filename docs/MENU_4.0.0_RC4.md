# Projekt i działający układ menu

Menu jest wdrożone w grze, a nie wyłącznie narysowane jako makieta. Zachowuje leśną kolorystykę, złote akcenty i typografię Przystani. Nowe powierzchnie korzystają z podziałów i hierarchii tekstu zamiast wielu ramek i długiego szeregu pigułek.

## Pięć stałych wejść

| Wejście | Pierwszy widok | Co otwierasz dalej |
| --- | --- | --- |
| Pulpit | Cztery podstawowe liczby, maksymalnie trzy bieżące sprawy | Szczegóły zadania, mieszkańcy, magazyn i warunki aktu |
| Zadania | Zwięzła lista spraw | Rozwijana karta: warunki, postęp, osoby, lokalizacja, wykonanie i przypięcie |
| Praca | Grupy przydziałów i roboczych budynków | Warsztaty, budowa/mapa, czytelnicy, próby, wrak i prace społeczne |
| Budowa | Kategorie i aktualne budowy | Koszty, dostępność, miejsca budowy, remonty i ozdoby |
| Działy | Cztery grupy tematyczne | Dziesięć obszarów bez poziomego przewijania zakładek |

Działy: **Ludzie i wspólnota** (mieszkańcy, wspólnota); **Gospodarka** (praca, magazyn); **Rozwój** (budowa, wiedza, natura); **Wyspa i pamięć** (wyprawy/transport, kronika, gra/zapis). Zachowano dostęp do starych akcji rodzin, rodów, rady, przysiółków, obyczajów, badań i zapisów. Duże sekcje mają zapamiętywane rozwinięcie. Mieszkańcy mają wyszukiwanie po imieniu, czynności i miejscu oraz strony po 20 osób.

## Cicha wyspa

Na mapie pozostają skróty wyspy, Zadań, Pulpitu osady i powrotu do obozu. Otwarcie księgi wstrzymuje działającą symulację; zamknięcie przywraca wcześniejsze tempo. Ręczna pauza pozostaje pauzą. Na telefonie menu jest wysokim arkuszem z osobnym nagłówkiem i pięcioma widocznymi przyciskami. Na szerokim ekranie zajmuje prawą część widoku; mapa pozostaje po lewej.

## Pełne menu

Na mapie jest stały pasek pięciu wejść oraz informacyjny HUD. Symulacja może działać przy otwartym panelu. W nagłówku znajduje się przycisk pauzy/wznowienia. Na szerokim ekranie panel daje więcej miejsca do zarządzania, a atlas działów układa się w dwie kolumny. Na małym ekranie pasek mapy jest ukrywany podczas otwarcia panelu, żeby nie powielać tej samej nawigacji.

Przełączanie widoków jest w **Działy → Gra i zapis**. Oba widoki mają te same funkcje. Epoka IV korzysta z tej samej nawigacji, pokazując rody, gospodarstwa, lokalne magazyny i rzeczywiste transporty.

## Dziennik zadań

Filtry: Wszystkie, Pilne, Śledzone, Cele, Kto co robi. Prośby pokazują przygotowanie zapasów; 100% zapasów nie przekazuje ich automatycznie — służy do tego przycisk pomocy. Budowy, wyprawy, czytanie, próby, uprawy i partie produkcji korzystają z własnych liczników silnika. Cele aktu są checklistą rzeczywistych warunków; nie opierają się na nieaktualizowanej, historycznej tablicy `S.goals`.

Przypięte zadanie ma niewielki pasek na mapie z otwarciem szczegółów i lokalizacją. Prośbę można przeczytać i schować jej znacznik, zachowując ją w dzienniku. Mieszkańcy są lokalizowani według aktualnej pozycji; położenie dalekiej wyprawy nadal jest uczciwie oznaczone jako przybliżone.

## Zaopatrzenie i warsztaty

Karta wybranego budynku opisuje rytm: **Produkcja → Zaopatrzenie → Prace wspólne**. Gdy brakuje składników, dziennik pokazuje blokadę i aktualne czynności przypisanych pracowników. Brak przetwórni kieruje do jej budowy lub wymaganej wiedzy. Gdy przetwórnia istnieje i ma surowce, komunikat kieruje do przydziału pracy i sprawdzenia progów. Nie powstaje fikcyjny węgiel, mąka ani mleko.

Zachowano istniejące progi i warunki przepisów, w tym ograniczenia sezonu oraz rezerwę ziarna na siew. Nowe zaopatrzenie dotyczy przydziałów do budynków epok I–III; Epoka IV zachowuje własną autonomię i rozliczanie godzin pracy.

## Sprawdzanie widoku

Rzeczywisty DOM/WebGL sprawdzany jest na 412×870, 870×412 i 1280×800. Test obejmuje dotykowy profil przeglądarki, widoczność pięciu wejść, brak poziomego przepełnienia paneli, wyszukiwanie osób, rozwijanie, pomoc, przypięcie, mapę, pauzę, zmianę trybu, offline i Epokę IV. Symulacja dotyku nie jest testem fizycznego Androida ani pomiarem FPS telefonu. Wewnętrzne zrzuty QA służą kontroli układu i nie są częścią archiwum użytkownika.
