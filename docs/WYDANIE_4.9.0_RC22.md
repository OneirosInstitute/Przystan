# Przystań 4.9.0-rc.22: wiedza pół na pół

Podstawa: 4.9.0-rc.21 (`2e423a1c585b3a25008668256f0913328d3b3811`).

Pierwszy pakiet (W1) z „Przystań — plan wiedzy i rozwoju”, zatwierdzonego 29.10.2026. Drzewko wiedzy przestało rozwijać się samo. Praca ludzi daje przeczucie, a wiedzę daje dopiero próba, którą wybiera gracz.

## Co było nie tak
Każda sekunda pracy każdej osoby dodawała punkty całej dziedzinie, a gra sama wybierała następny węzeł. Drwal przy wyrębie rozwijał przy okazji „Krosno”. Na świeżej grze bez gracza w 12 dni poznało się 10 z 37 węzłów epoki I. Nic nie kosztowało i nie było czego wybierać.

## Teraz
- **Przeczucie z praktyki.** Doświadczenie trafia tylko do węzłów fachu, który pracuje: „Wędzenie” rośnie z pracy myśliwych i rybaków, „Krosno” z pracy krawców, „Mapa wyspy” ze zwiadów i wypraw, „Kronika osady” z czytania, nauczania, opowieści i odkryć. Przeczucie dochodzi najwyżej do połowy węzła. Gdy jest pełne, Kronika notuje: „Przeczucie: wędzenie. Ludzie wiedzą już, od czego zacząć.”
- **Pierwszy rząd z samej praktyki.** Rozpoznawanie roślin, tropienie i kronika osady przychodzą same, bo rozbitkowie uczą się ich, żeby przeżyć pierwsze dni.
- **Próba wybierana przez gracza.** W zakładce Wiedza węzeł z pełnym przeczuciem ma przycisk „Zacznij próbę”. Przed startem widać:
  - **kto ją poprowadzi:** osoba z fachem węzła na co najmniej 2, a przy nauce ktoś starszy, nauczyciel albo dociekliwy. Gracz może wskazać kogoś innego;
  - **materiały:** w epoce I od kilku do kilkunastu sztuk, np. wędzenie to 8 mięsa i 8 kłód, krosno to 6 desek i 4 włókna;
  - **czas:** 2–4 dni w epoce I, 3–4 w epoce II, 5–6 w epoce III;
  - **szansę:** 50% przy fachu 2, 65% przy 3, 80% przy 4.
- **Osoba w próbie** przez ten czas nie pracuje gdzie indziej. Po próbie wraca do swojego warsztatu. Gdy umrze albo wyjedzie, próbę przejmuje ktoś inny z fachem, a jeśli nikogo nie ma, próba czeka.
- **Porażka** zabiera materiały, ale następna próba ma o 20 punktów większą szansę. Czasem kosztuje więcej: oswajanie kóz może poturbować, bartnictwo pogryźć pszczołami, hartowanie poparzyć, a wypalanie garnków podpalić drewno obok.
- **Jedno badanie naraz.** Dotyczy też dawnych prób cegły, pieca zduńskiego i wytopu. Od „Szkoły przy wiecu” (epoka III) osada może prowadzić do trzech badań.
- **Kolejka.** Następne badanie można ustawić z wyprzedzeniem. Zacznie się samo, gdy zwolni się miejsce i będą przeczucie, osoba i materiały. Przerwanie próby oddaje materiały, ale czas przepada.
- **Szkoła skraca próby.** „Nauka dzieci” o 10%, „Szkoła przy wiecu” o kolejne 15%. „Rachunek na karbach” przyspiesza przeczucie o 10%.
- Udana próba trafia do wieczornego okna i do Kroniki, a osoba, która ją przeprowadziła, zostaje pierwszym znawcą tej wiedzy.

## Widok
- Na górze zakładki Wiedza jest karta „Badania”: co trwa, kto, jaka szansa, ile dni zostało, kolejka i węzły z pełnym przeczuciem.
- Węzeł w drzewku ma pasek przeczucia albo napis „można próbować”, „w kolejce” lub „próba N%”.
- Podpowiedzi celów („czego brakuje”) mówią, skąd przyjdzie przeczucie i kiedy zacząć próbę.

## Stare zapisy
- Poznane węzły zostają poznane.
- Zebrane punkty przechodzą w przeczucie, najwyżej do połowy węzła.
- Cel wybrany przyciskiem „Skup się na tym” staje się pierwszym badaniem w kolejce.
- Wspólny zapas nadmiarowych punktów znika.
- Epoka IV ma własne nauki rodów i działa bez zmian.

## Testy
- `tests/badania.test.mjs` (nowy, 9 przypadków):
  - przeczucie tylko z fachu węzła, najwyżej do połowy, pierwszy rząd z samej praktyki;
  - warunki próby: przeczucie, osoba z fachem, materiały;
  - jedno badanie naraz razem z dawnymi próbami, trzy od szkoły;
  - udana próba i powrót osoby do warsztatu;
  - porażka z większą szansą następnej i z raną przy oswajaniu kóz;
  - przerwanie z oddaniem materiałów i kolejka, która rusza sama;
  - przejęcie próby po śmierci osoby albo jej wstrzymanie;
  - przejście starego zapisu i zapis trwającej próby;
  - widok w zakładce Wiedza.
- Przebiegi z botem, który zaczyna próby jak gracz:
  - epoka I, 80 dni, dwa przebiegi: 19 i 16 z 37 węzłów (w pierwszych 20 dniach 6 i 7). Wcześniej, bez gracza, 10 węzłów w 12 dni;
  - epoka II, 30 dni: 6 z 12 węzłów, jeden co ok. 5 dni;
  - epoka III, 30 dni: 6 z 12 węzłów;
  - bez błędów i ostrzeżeń.

  Bot buduje bez przerwy i często nie zostawia drewna na próbę: w jednym przebiegu epoki I przez połowę dni nie miał materiałów. Gracz, który odłoży kilka kłód, pójdzie szybciej.
- Kontrola w GitHubie: wszystkie dotychczasowe testy przechodzą bez zmian.
