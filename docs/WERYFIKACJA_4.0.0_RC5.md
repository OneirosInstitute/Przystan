# Odbiór Przystani 4.0.0-rc.5

Baza: RC4 FIX, commit `fb2d75a9186737126c55ad365dab1f78266256ec`. Wszystkie 211 śledzonych plików bazy porównano z paczką RC4 FIX: zgodne. Zmiany powstawały w osobnej kopii. Nie wykonano z tego środowiska publikacji, commitu ani push do repo użytkownika.

## Zakres i dowody

| Pozycja audytu | Zmienione miejsce | Dowód |
|---|---|---|
| L01–L02 | definicje przepisów, `productionPolicy`, `productionSupplyState` | własny cel 200 desek przy dawnym progu 80; trzy przetwórnie ziarna; blokada sezonowa i remont |
| L03 | `go`, `movePerson`, rewizja siatki | postawienie obrysu na aktywnej trasie nie dopuszcza wejścia w zajęte pola; dostawy i wznowienia zachowują właściciela |
| L04 | rytm dnia i domowe przetwory | odcięta droga nie daje obecności; posiłek wymaga czasu i zużywa żywność; zachowane testy przetworów i powtórnego zapisu |
| L05 | automat Epoki IV | 70 istniejących wozów nie uruchamia budowy kolejnego |
| L06 | `E4Life`, `recordedLabor`, widok i śledzenie | renderer nie zmienia pozycji; godziny związane z identyfikatorem zadania; niedostępne stanowisko nie produkuje; brak ponownego użycia godzin; rzeczywisty zapis i restart |
| L07 | wyżywienie i zdrowie po migracji | sytość stara/nowa zgodna; gorączka i rana ustępują według stanu leczenia; aktualizuje się ciepło |
| L08 | doświadczenie oraz lekcje E4 | odległy, śpiący lub niedostępny mistrz nie uczy; obecny nauczyciel i uczeń na zajęciach — tak |
| L09 | profile modeli i animacja | zmiana etapu wieku bez restartu; kolana i łokcie; krok zależny od dystansu; zatrzymanie pozy po pauzie |
| L10 | katalog, zużycie domowe i wyroby ze skór | skończone zapasy mają odbiorców i koszt; bilans rejestruje wyroby hodowli; pełny magazyn nie przyjmuje dodatkowej produkcji zwierzęcej |
| L11 | wydajność fachu | identyczne 8 godzin: 24 kłody przy fachu 0, 30 przy fachu 5; bez zwiększania godzin i surowca natury |

Osobna regresja dużego folwarku: 200 pracowników i 200 pól, sześć dni wzrostu. Stary układ doprowadzał do zbioru 117 pól, zwarty układ 196 — bez zmiany plonu, kosztu lub wymaganej pracy. Pełna próba pokoleniowa pozostaje bramką wydania.

Dodatkowo sprawdzono ochronę siewu, zamienniki narzędzi, wyczerpaną rudę, rezerwę składników serowni oraz jej zwolnienie podczas głodu. Planer wykorzystuje jawny priorytet potrzeb, opieki, hodowli, pól, budowy, przetwórstwa i zaopatrzenia. Zakończenie odcinka pracy uruchamia kolejny wybór; nie trzeba czekać do następnej doby na nową czynność.

Epoka IV zatwierdza gospodarkę raz na dobę. Indywidualna księga godzin powstaje podczas przejścia i pracy na miejscu, a rozliczenie zużywa ją wyłącznie dla właściwego zadania. Przenoszone towary pozostają w dotychczasowym systemie rzeczywistych konwojów. Nie zastąpiono transportów ozdobnym ruchem.

Menu przywrócono do układu sprzed RC4: klasyczne zakładki i karty. Zadania pozostają w tej samej księdze, a Kronika zawiera zapis i wybór trybu także w Epoce IV. Osobno sprawdzany jest powrót z Zadań do poprzedniego panelu, bez pozostawiania treści z pamięci podręcznej.

## Wyniki końcowe

- Build i składnia: PASS.
- Pełny zestaw: **32 zestawy, 156 przypadków, 0 błędów**.
- Próba silnika: **12 000 klatek, epoki I/III/IV, 10 restartów i 45 automatycznych zapisów** — PASS.
- Wszystkie 11 specjalizacji: 200 dni każda, bez późniejszego dosypywania zasobów, główny wyrób obecny — PASS.
- Pokolenia: dwie próby po 1500 dni, osada i sieć ośrodków; tożsamość, sukcesja, dostawy i rzeczywisty dekoder zapisu — PASS. Szczegóły w `results.json`.
- Przywrócone klasyczne menu: nawigacja, zwijanie, zadania, cele, zapis i przełączanie epok — PASS.
- Chromium: menu w 412×870, 870×412 i 1280×800, oba tryby, pomoc, śledzenie, lokalizowanie, zapis offline i Epoka IV — PASS.
- Chromium: rzeczywiste modele, kolana/łokcie, tempo 1×/2×/4×/8×, zgodność pozycji, pauza i zapis — PASS.
- Usypianie: kontrole JS oraz osobna próba Chromium widoczności i natywnego freeze — PASS.
- Instalator: próba `--prepare-only` na kopii aktualnego repozytorium, build/154 kontrole instalacyjne/runtime/integralność — PASS; bez commitu i push.

W `docs/weryfikacja5/` znajdują się końcowe logi, podsumowania i dane środowiska. Zrzuty przeglądarkowe służyły ocenie wewnętrznej i nie są częścią paczki.

## Granice odbioru

- Przeglądarka używała programowego WebGL. To dowód wykonania kodu i zachowania interfejsu, a nie pomiar FPS, temperatury lub baterii fizycznego telefonu.
- Jedenaście specjalizacji badano osobno jako wariant głównego ośrodka z zapasem startowym i bez późniejszego dosypywania. Test wielopokoleniowy obejmuje kilka współpracujących ośrodków. Nie jest to dowód przejścia całej kampanii każdą możliwą drogą ani jednoczesnego, naturalnego założenia wszystkich jedenastu folwarków.
- Model postaci zachowuje styl wyspy. Końcową czytelność gestów i odczucie płynności należy potwierdzić na urządzeniu docelowym przy jego liczbie mieszkańców i ustawieniach grafiki.
- Nowe zapisy pozostają w schemacie 1; pola działań są opcjonalne dla starszych zapisów. Po pierwszym wczytaniu starszej Epoki IV osoby rozpoczynają planowanie, bez przyznawania niewykonanej pracy.

## Krótki odbiór na telefonie

1. Wczytaj dotychczasowy zapis i sprawdź dzień, zasoby oraz liczbę mieszkańców. Zapisz, zamknij aplikację i wczytaj ponownie.
2. Wskaż osobę z Zadań, zatrzymaj czas i wznów. Jej model i znacznik powinny pozostać w tym samym miejscu.
3. Obejrzyj chód z ładunkiem i pracę przy 1×, potem 2×/4×/8×. Porównaj tryb baterii i oba tryby menu.
4. Przenieś aplikację w tło na kilka minut. Po powrocie doba nie powinna nadrobić nieobecności. Rzeczywiste zużycie energii oceniaj w statystykach Androida po porównywalnych sesjach.

Kontrola rozbudowy: zaległe pola i chronione ziarno nie pozwalają autonomii zwiększać pojemności domów; ukończone pola i osiem dni żywności odblokowują rozbudowę. Regresja `ai-life.test.mjs` — PASS.
