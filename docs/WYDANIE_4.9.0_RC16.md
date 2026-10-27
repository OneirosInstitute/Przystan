# Przystań 4.9.0-rc.16: wątki (zaloty i spory), przednówek nie zatrzymuje drewutni

Podstawa: 4.9.0-rc.15 (`116a3ef78166fb6f7b164db67b3bb0794724523c`).

Pierwszy pakiet ze [scenariusza życia gry](https://claude.ai/artifact/AWJy7SgUUQDJdduWYvmTxH): silnik wątków oraz dwa pierwsze wątki, zaloty i spór. Przy okazji poprawka przednówka, przez który stała drewutnia i budowy.

## Wątki
Wątek to historia dwóch osób, która trwa kilka dni gry. Idzie przez pięć kroków:
1. **Zalążek:** pierwsza mała scena.
2. **Narastanie:** druga scena, mniej więcej dzień później.
3. **Narastanie:** trzecia scena, znowu dzień później.
4. **Punkt zwrotny:** jedna karta z wyborem.
5. **Rozwiązanie:** zostaje we wspomnieniach i w kronice.

Między krokami mija od 0,8 do 1,6 dnia (przy zwykłej prędkości 3–6 minut). Krok przychodzi dopiero, gdy obie osoby są w osadzie, a nie na wyprawie.

**Zasady:**
- naraz najwyżej 3 wątki, a jedna osoba bierze udział tylko w jednym;
- najwyżej jedna karta wątku na dzień gry; karta nie wchodzi na inne wydarzenie ani na wieczorną opowieść;
- po zakończeniu wątku przez dzień nic nowego się nie zaczyna;
- wątki zaczynają się z tego, co się wydarzyło: scena „zalot” (dar dla dziewczyny albo chłopaka) zaczyna zaloty, a scena „kłótnia przy studni” zaczyna spór, i ta scena jest pierwszym krokiem wątku;
- wątek zaczyna się też z więzi, gdy dwoje wolnych bardzo się lubi albo dwoje z różnych rodzin bardzo się nie lubi;
- wątki działają w epokach I–III. Epoka IV (folwarki) dostanie własne w kolejnym pakiecie.

**Zaloty:**
- narastanie: wieczory razem przy ogniu, wspólna droga znad strumienia, zaszyta koszula, a potem plotka przy studni albo zazdrosny rywal tej samej płci;
- karta „Zaloty”: jeśli rodzic jednego z nich nie lubi drugiego, sprzeciwia się wprost. Do wyboru: „Niech swaci idą z chlebem i solą” (wesele za 2–3 dni, gorycz u rodzica), „Niech poczekają do wiosny” (wesele na wiosnę, w czasie czekania jeszcze jedna scena) albo „Zostawić to im” (sami się dogadają albo rozejdą się spokojnie);
- **swaty idą przez wątek:** para, którą dotąd swatano od razu, dostaje teraz wątek zalotów, i to od razu w dalszym kroku, bo już się lubią. Po staremu tylko wtedy, gdy trwają już 3 wątki;
- **„Pchnij ich ku sobie”** (nieobowiązkowe): na karcie wolnej osoby, gdy jest ktoś, kogo lubi. Przycisk zaczyna zaloty od wspólnej roboty albo miejsca przy ogniu;
- złe zakończenia (porzucenie, ucieczka) dopiero w epoce IV, zgodnie z decyzją z 27.10.2026. Wcześniej rozstanie jest zawsze spokojne.

**Spór:**
- narastanie: rozrzucone narzędzia, odejście od ognia, złe słowo przy studni, a potem do sporu wtrącają się rodziny;
- od epoki III trzeci krok to bójka (oboje słabsi), kradzież ziarna albo podpalenie snopków (ubywa ziarna);
- karta „Spór”:
  - „Niech starszy ich pogodzi”: najszanowniejszy starszy; łagodny ma większą szansę;
  - „Sąd na wiecu”: rację ma ten z większym posłuchem;
  - „Niech pracują razem przy jednym dachu”: po dwóch dniach zgoda albo rozejście bez kłótni;
  - od epoki III także „Wiec wygania winnego”: ten z mniejszym posłuchem idzie do najdalszego przysiółka albo, gdy przysiółków nie ma, w głąb wyspy.

**Gdzie to widać:**
- dymek nad osobą z nazwą wątku („Zaloty”, „Spór”). Dymki idą po kolei, a każdy pokazuje się dopiero, gdy osoba jest na ekranie;
- karta osoby: „Zaloty: Bożydar i Wszebora”, od którego dnia, na jakim etapie i trzy ostatnie zdarzenia;
- Kronika (Osada → Kronika): nowy dział „Wątki” na górze, z trwającymi historiami i zakończonymi jak rozdziały;
- dymek chowa się, gdy otwarta jest karta osoby, bo na karcie jest ta sama historia. Działa to także przy zatrzymanym czasie, kiedy gra dla oszczędności baterii nie rysuje klatek;
- wspomnienia osób (zalot, kłótnia, zgoda, rozstanie, ślub);
- karta wątku zamyka się jednym dotknięciem, a wynik zostaje na pasku i w kronice;
- karta otwarta w chwili zapisu wraca po wczytaniu.

## Przednówek nie zatrzymuje drewutni
**Objaw:** wiosną drewutnia przestała robić opał. Pracownica miała przydział, kłód było 166, opału 0, a ona zbierała jagody. Budowniczowie też nie budowali, a rozbudowa drewutni stała na 0%. Karta drewutni pokazywała przy tym „Gotowe do produkcji”.

**Przyczyna:** wydarzenie „Przednówek” przychodzi wiosną, gdy jedzenia jest na mniej niż 8 dni. Jego opcja „Wszyscy w las i nad wodę” na 6 dni gry wysyłała do zbierania jedzenia każdego, kto pracuje, także drewutnię przy zerowym opale i ludzi przy polach w czasie siewu. Nic w grze tego nie tłumaczyło. Odtworzone w symulacji: przez 4 dni opał 0, rozbudowa 0%, wszyscy przy jagodach.

**Teraz:**
- przy swoich pracach zostają: pola, zbieracze, rybacy, myśliwi, hodowcy, wytwórcy jedzenia i drewutnia, dopóki opału jest mniej niż 5 porcji na osobę (co najmniej 60). Do zbierania idą budowniczowie i reszta warsztatów, tak jak zapowiada opcja;
- przednówek kończy się sam, gdy jedzenia znów jest co najmniej na 14 dni;
- karta budynku mówi, co się dzieje („Przednówek: tu praca idzie dalej, bo opału jest mało”, „…pracownicy szukają jedzenia jeszcze 3 dni”, „…budowy stoją jeszcze 3 dni”), a przycisk „Wracamy do zwykłych prac” kończy przednówek wcześniej;
- przy osobie widać „przednówek: zbiera jagody i grzyby”;
- opis opcji mówi teraz, kto pracuje dalej.

## Długie przebiegi z botem
Epoka I przez 80 dni (wyspa 2207), z botem, który odpowiada na karty i zamyka wieczorne opowieści:
- 11 wątków: 8 sporów i 2 zaloty, w tym jedno wesele i jedno spokojne rozstanie;
- spory kończyły się zgodą, wyrokiem wiecu albo rozejściem;
- każdy wątek trwał 4–6 dni i miał dokładnie jedną kartę;
- bez błędów stanu, bez ostrzeżeń w konsoli, a zapis i wczytanie działały.

W pierwszych latach przeważają spory, bo wolnych dorosłych jest mało. Zaloty przybywają, gdy dorastają dzieci rozbitków.

## Testy
- `tests/watki.test.mjs` (10 przypadków):
  - zaloty od pierwszego kroku do wesela, z jedną kartą;
  - spór w epoce I bez bójki, rozstrzygnięty sądem;
  - spór w epoce III z eskalacją i wygnaniem do przysiółka;
  - limity: 3 wątki, jedna osoba w jednym, jedna karta na dzień;
  - wątek zaczęty ze sceny;
  - swaty przez wątek i po staremu przy braku miejsca;
  - zapis i wczytanie, także z otwartą kartą;
  - śmierć uczestnika i epoka IV;
  - karta osoby z przyciskiem „Pchnij ich ku sobie”;
  - dział „Wątki” w zakładce Kronika i odmiana „od 1 dnia”.
- `tests/przednowek.test.mjs` (2 przypadki):
  - kto zostaje przy pracy, notka na karcie budynku, przycisk powrotu;
  - samoczynny koniec przy pełniejszej spiżarni.
