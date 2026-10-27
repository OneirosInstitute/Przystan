# Przystań 4.9.0-rc.12: przysiółki później, dalej i z własną kartą

Podstawa: 4.9.0-rc.11 (`632567eddcbbe243dd62fd749c6a29e42535f186`).

## Objawy
- **Za wcześnie:** pierwszy przysiółek był celem aktu IV, już przy 20–23 osobach. Osada była ledwie postawiona, a trzeba było odesłać rodzinę, która nie chciała iść, i stracić dwie osoby z Przystani.
- **Za blisko:** przysiółki stawały w najbliższych krainach, np. tuż obok gliniska. Rodzina odchodziła kawałek dalej i mieszkała w szałasie, a gdy Przystań urosła, przysiółek stał przy samej osadzie.
- **Bez karty:** przysiółka na mapie nie dało się dotknąć, więc nie było widać, kto tam mieszka, ilu ich jest i ile mają zapasów.

## Co się zmieniło
**Epoka I to Przystań:**
- Pierwszy przysiółek nie jest już celem aktu IV.
- Przysiółek da się założyć dopiero, gdy w Przystani mieszka co najmniej 50 osób. Wcześniej karta Wspólnoty mówi: „Przysiółek zakłada się, gdy w Przystani mieszka co najmniej 50 osób (teraz N). Najpierw osada musi przetrwać i urosnąć”.
- Prośba młodych „Chcemy iść na swoje” też przychodzi dopiero od 50 mieszkańców.

**Przysiółki daleko:**
- Trzy krainy najbliżej Przystani zostają zwykłymi krainami wyspy, bez przysiółków.
- Przysiółek staje w krainie co najmniej 50 kroków od obozu.
- W samej krainie miejsce wybiera się z dala od obozu i od budynków osady.
- Dotyczy to także przysiółków zakładanych przez inne przysiółki w epoce III.

**Dawne przysiółki za blisko:**
- Przysiółek, który stoi za blisko, raz przenosi się dalej, do najbliższej dozwolonej krainy.
- Zabiera cały dobytek, budynki, etap rozwoju i drogę.
- Kronika i karta przysiółka mówią o przenosinach.

**Karta przysiółka na mapie:** dotknięcie przysiółka otwiera kartę. Pokazuje ona:
- nazwę, rodzaj, krainę, liczbę ludzi (dorośli i dzieci) i ród;
- więź z Przystanią i zapasy jedzenia, słowem i paskiem;
- drogę i odległość w krokach;
- **Mieszkańcy:** imię i wiek każdego, z oznaczeniem starszego, a także pochowanych;
- **Zapasy i dobytek:** jedzenie, to, co przysiółek daje, i skład materiału;
- prośbę przysiółka z przyciskiem wysyłki;
- rozwój od obozowiska do dworu: etap, czego brakuje, budowy w toku, prośby rodu o zgodę i listę możliwych budów;
- **Co u nich słychać:** ostatnie ważne wieści, np. narodziny, śmierci, prośby, budowy i przenosiny;
- przyciski „Dary” i „Cała wspólnota”.

**Mieszkańcy po imieniu:**
- Lista mieszkańców nadąża za liczbą ludzi.
- Założyciele mają prawdziwy wiek i płeć.
- Gdy ktoś umiera, z listy znika ta sama osoba, którą wymienia kronika.
- Gdy umrze starszy, starszym zostaje najstarszy dorosły.

## Technicznie
- `src/p_przysiolki.js` nakłada się na:
  - `hamRegionOK`, `kolWhyNot`, `e3FreeNear`, `hamletSpot`;
  - `kolDaily` (jednorazowe przenosiny, flaga `S.hamMv`);
  - `hamDeath`, `foundHamlet`, `log` (wieści `h.news`);
  - `select`, `onTap`, `renderSel`.
- Nowe pola zapisu: `h.mies` (mieszkańcy) i `h.news` (wieści).
- `src/p_kol.js`: usunięty cel „Załóż pierwszy przysiółek” z aktu IV.
- Epoka IV ma własne folwarki i własne karty, więc karta przysiółka się w niej nie otwiera.

## Testy
- `tests/przysiolki.test.mjs` (4 przypadki):
  - próg 50 osób i brak celu w akcie IV;
  - trzy najbliższe krainy wyłączone, odległość co najmniej 50 kroków;
  - przenosiny dawnego przysiółka z zachowaniem budynków;
  - mieszkańcy, śmierć konkretnej osoby i zawartość karty.
- Dostosowane do nowych zasad:
  - `tests/hamlets-build.test.mjs` zakłada przysiółek w krainie leśnej, bo najbliższa wolna kraina jest teraz dalej i ma inny rodzaj;
  - `tests/hamlets-ring.test.mjs` zdejmuje próg 50 osób dla sprawdzenia mapy wiecu.
