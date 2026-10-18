# Następny etap Przystani

Najpierw należy dopracować współdziałanie SI, transportu, pracy i zapisu. Następnie detale powinny pokazywać to, co rzeczywiście dzieje się w symulacji. Klasyczne menu i zakładka Zadania pozostają podstawą obsługi.

| Kolejność | Zakres | Warunek odbioru |
|---|---|---|
| 1 — rozpoczęty w RC6 | Hardening stanu, jeden przebieg doby, aktualny zapis po wszystkich fazach | Regresje, zgodność zachowania starszych epok, odrzucanie uszkodzonego stanu, testy pokoleń |
| 2 | Konsolidacja planera SI: potrzeba → wybór → rezerwacja → droga → działanie → wynik → ponowne planowanie | Jedna przyczyna oczekiwania, brak podwójnego przydziału; brak surowca kieruje do jego zdobywania; osiągnięty zapas kieruje do pomocy; zadanie wskazuje wykonawcę i miejsce |
| 3 | Nawigacja i fizyka ruchu: wejścia, obejścia, stanowiska pracy, lekkie unikanie innych ludzi, ładunki | Zamknięcie przejścia nie zabiera ładunku; brak przejścia nie daje pracy; postać nie przechodzi przez budynek; zmiana trasy nie teleportuje |
| 4 | Budynki i ich otoczenie: wejście, dziedziniec, składy, widoczne stanowiska, ogródek, zielnik, piwniczka, domowe wyroby | Model, cel SI i miejsce działania mają wspólne współrzędne; wygląd odpowiada stanowi budowy i produkcji |
| 5 | Wyspa: spójne strefy roślinności, grunt, plaże, mokradła, skały, ścieżki i czytelne zasoby | Zasób widoczny odpowiada zasobowi możliwemu do zebrania; gęstsze detale nie blokują tras przypadkowo; limit geometrii i odległości rysowania |
| 6 | Codzienność mieszkańców: gesty fachów, niesienie narzędzi i towarów, wspólne posiłki, odpoczynek, rodzina, nauka | Animacja wynika z działania i etapu drogi; pauza utrzymuje pozycję; brak nagród za sam zamiar pracy lub spotkania |
| 7 | Folwarki i życie rodów: specjalizacje, zależności między osadami, przestrzeń dla kolejnych pokoleń | Każdy wyrób ma źródło i zastosowanie, a osada potrafi odbudować łańcuch po niedoborze; społeczeństwo nie zależy wyłącznie od zapasu startowego |

## Co znaczy fizyka w tej grze

Priorytetem są poprawne dojścia, przeszkody, zbocza, wejścia, kolejki do stanowisk i zachowanie ładunków. Dodanie ogólnego silnika ciał sztywnych wymagałoby osobnego uzasadnienia i budżetu telefonu. Sceny pracy powinny korzystać z lekkiej nawigacji i rezerwacji stanowisk.

## Kolejna konkretna paczka: SI i stanowiska

1. Spisać obecne reguły 17 warstw planowania pracy i punkty ich pierwszeństwa. Nie przepisywać ich naraz.
2. Wyodrębnić decyzję od wykonania: wybrany cel, powód, warunki rozpoczęcia, warunki przerwania, ładunek i rezerwacja.
3. Ujednolicić stan oczekiwania i przyczynę blokady dla panelu osoby, budynku i Zadań.
4. Wprowadzać wspólne wejścia i stanowiska kolejno dla kuźni, tartaku i pola; dopiero po sprawdzeniu przenosić pozostałe fachy.
5. Sprawdzić: brak rudy, wyczerpanie złoża, pełny magazyn, osiągnięty cel, zablokowana droga, choroba, śmierć wykonawcy, zmiana przydziału, restart w trakcie transportu.

## Dodatkowo do kolejki

- **Martwe końce gospodarki:** macierz surowiec → przetwarzanie → odbiorca → utrzymanie; automatyczne raportowanie produkcji bez odbiorcy oraz potrzeb bez dostępnego sposobu rozwiązania.
- **Diagnostyka gracza:** ostatni udany zapis, rozmiar zapisu, etap działania, przyczyna oczekiwania, wykonawca i miejsce. Bez zalewania głównego ekranu danymi.
- **Odporność na przerwanie:** restart na granicy doby, przed i po dostawie, ślubie, narodzinach, zakończeniu budowy i zadania.
- **Budżet telefonu:** pomiary na fizycznym Androidzie — czas klatki, pamięć, nagrzewanie i zużycie energii; osobno gra widoczna, pauza i minimalizacja.
- **Konsolidacja renderowania:** po planerze ograniczyć nakładki aktualizacji mapy, zachowując uśpienie w tle. Kosztowne aktualizacje powinny wynikać ze zmiany danych, nie z każdej klatki.

## Zasady świata

Domy z bali pozostają domami rodzinnymi i rozwijają zaplecze. Dom rodowy powstaje później, po rzeczywistej przeprowadzce rodziny do przysiółka. Folwarki mogą rozwijać winnicę i winiarnię, browar i karczmę, mięso i wędzarnie, hodowlę, hutnictwo i narzędzia, pola i młyn z piekarnią, tartak i wyroby drewniane oraz pasiekę. Różnorodność ma wynikać z miejsca, rodu i powiązań gospodarczych.

## Checkpoint RC8

Pierwszy przekrój etapów 2–3 jest wykonany: jedna zewnętrzna bramka priorytetów zamiast trzech nakładek, wspólny kontrakt bieżącej czynności, rezerwacje i dojście do kuźni, pracowni cieśli i pola. Pracownie mają wykonawców i lokalizacje w Zadaniach. Szczegóły i pozostałe ryzyka: `AUDYT_SI_RC8.md`.

Następny zakres: pozostałe wejścia i transport, dojście do wyjścia wyprawy, bezpieczne wyjście z zabudowanego terenu, lekkie unikanie w drodze. Następnie widoczne dziedzińce, stanowiska i narzędzia oraz detale wyspy i codzienności. Nie oznaczamy całych etapów 2–7 jako ukończonych.
