# Przystań 4.3.0-rc.1 — Krainy z charakterem

Baza: main 4.2.0-rc.1 `8fbdcba5ca32bacba9941ee5472ca4c286a1328d`. Wydanie wypchnięte prosto na main (Railway buduje z main).
Trzeci krok planu z [projektu wyspy](PROJEKT_WYSPY_5.md), rozdział 2.2. Wyspa 384 od pierwszego dnia przesuwa się na 4.4, folwarki ze złóż na 4.5.

## Nowe

**Krainy** (`p_krainy.js`, po `p_zloza.js`). Każda kraina rdzenia (`REGIONS`) dostaje jedną z dziesięciu ról. Rola zależy od tego, co leży pod krainą:

- udział lasu iglastego i liściastego, łąk, mokradeł, hal i wybrzeża;
- średnie nachylenie i nachylenie ku południu;
- złoża: Zagłębie dostaje kraina z węglem albo rudą, Gliniska kraina ze złożem gliny.

Przydział ma dwa kroki. Najpierw każda rola dostaje najlepiej pasującą krainę, więc każda rola jest na wyspie. Potem reszta krain dostaje swoją najlepszą rolę bez złóż. Rola trzyma się dawnego rodzaju terenu, z którego powstała nazwa, więc „Siwa Plaża” nie staje się Starym Borem. Kraina obozu nie bierze udziału w pierwszym kroku, chyba że leży w niej złoże.

| Kraina | Wpływ |
|---|---|
| Żyzne Niziny | plon pól ×1,3, zagroda ×1,15 |
| Słoneczne Stoki | winnica ×1,35, chmielnik ×1,2, ogród ziołowy ×1,25 |
| Kwietne Łąki | barć ×1,5, zagroda ×1,2, zbieracz ×1,1 |
| Stare Bory | drwal ×1,2, myśliwy, mielerz, leśniczówka ×1,15 |
| Grąd i Dąbrowa | barć ×1,25, drwal i myśliwy ×1,1 |
| Kamienna Grań | kamieniołom ×1,25, łom ×1,15 |
| Zagłębie | odkrywka, szyb, kopalnia ×1,1, wykop rudy ×1,15 |
| Mokradła | kopanka torfu ×1,2, wykop rudy ×1,25, ogród ziołowy ×1,1 |
| Gliniska nad wodą | glinianka ×1,25, gliniak ×1,15, piec do cegły, garncarnia ×1,1 |
| Wybrzeże i Zatoki | pomost ×1,2, warzelnia ×1,15 |

Wpływ działa przez `bMul` (zbieranie, polowanie, warsztaty) i `fieldMul` (plon). Pokazują go:

- karta krainy w Zadania → Wyprawy;
- podgląd stawiania („Kwietne Łąki: praca +50%”);
- karta budynku;
- podpis pod nazwą krainy na mapie;
- wpis w kronice przy nazwaniu krainy.

**Wygląd.** Barwa ziemi zależy od krainy: niziny są soczyście zielone, łąki i stoki jaśniejsze, mokradła oliwkowe, Zagłębie lekko szare. Barwa liczona jest w `paintBase` raz na porę roku, a zimą różnice prawie znikają. Na Kwietnych Łąkach kwitną kępki kwiatów w sześciu barwach, mniej na stokach, nizinach i w grądach. To jedna siatka z instancjami (najwyżej 2400 kwiatów), przeliczana raz na dzień, i tylko gdy zmieni się pora roku albo liczba budynków. Jesienią jest ich jedna trzecia, zimą wcale.

## Testy

- Nowy zestaw `regions-character` (2 przypadki): wszystkie dziesięć ról na wyspach 2207, 4096 i 12345; Zagłębie zawsze przy węglu albo rudzie; barć na łące ×1,5, drwal w borze ×1,2, pole na nizinie ×1,3.
- `npm run test:install`: 51 zestawów. `npm run test:runtime`: pętla epok I, III i IV.
- Pięć wysp sprawdzonych ręcznie: wszystkie role są, nazwy pasują do ról (wybrzeże, mokradło albo glinisko na plażach, bory i grądy w lasach).
- Przeglądarka z WebGL (programowym): kwitnąca łąka z sarnami, barwa nizin, karty krain w Wyprawach, brak błędów w konsoli.

## Jeszcze nie w tym wydaniu

Koszty krain z projektu (powodzie na nizinach, przymrozki na stokach, susza na łąkach, choroby górników) i wyspa 384 od pierwszego dnia.

## Do sprawdzenia na telefonie

Płynność przy widoku na dużą łąkę z kwiatami, czytelność podpisu krainy na mapie.
