# Przystań 4.9.0-rc.6: opis sprawy nad głową i korekta polszczyzny

Podstawa: 4.9.0-rc.5 (`b6da7bcb5f9b1ce873f5329da40e2ba8982866a2`).

## Sprawa nad głową
**Objaw:** nad mieszkańcem wisiał wykrzyknik albo inny znak, ale po wybraniu tej osoby nie było widać, o co chodzi.

**Teraz** karta osoby zaczyna się od opisu sprawy:
- **Prośba:** czego ta osoba chce, jej własne słowa, co trzeba zrobić i ile dni zostało. Karta mówi też, że spełniona prośba dodaje nadziei, a zapomniana zwiększa niezgodę.
- **Sprawa** z łańcucha opowieści: co mówi ta osoba i jak pomóc.
- **Znaki potrzeb** (pożar, słabnięcie, głód, zimno, woda, niezgoda): co się dzieje i co pomaga.
- Przycisk „Wszystkie potrzeby i sprawy” otwiera listę spraw całej osady.

## Polszczyzna w całej grze
Przejrzano wszystkie teksty gry (około 320 tysięcy znaków). Poprawek: 138, w 47 plikach.

**Liczebniki:** nowe funkcje `plW` (1 osoba, 2 osoby, 5 osób, 22 osoby) i `latW` (1 rok, 3 lata, 5 lat). Odmiana jest poprawna także dla 12–14 i 22–24. Dotyczy m.in.:
- bezdomnych, budynków do remontu, kur, bursztynu, dzików, zwierząt w zagrodzie, pól drogi;
- mieszkańców i ośrodków w epoce IV;
- pilnych spraw oraz terminów („za 1 dzień”, „za 3 dni”).

**Rodzaj:** wiele komunikatów było zawsze w rodzaju męskim. Teraz zależą od płci osoby, np.:
- „wyszła czerwona i szczęśliwa”, „chciałaby ławę”, „staje jak wryta”;
- „wróciła z wyprawy”, „Zgubiła się w lesie”, „pilnuje stosu sama”;
- „mistrzyni”, „chora”, „poturbowana”, „pierwsza”, „-latka”;
- „za nią pół wsi”, „żeby rosła mocna”.

**Jednostki:** „80 porcji opału”, „10 porcji ziarna”, „40 porcji jedzenia” zamiast „80 opału” czy „10 ziarna” w zdaniach (skrótowe zapisy kosztów zostały).

**Składnia i słownictwo:**
- „orła nad granią”, „płot trzyma je z daleka”;
- „Trzeba je wyleczyć” (o osobach), „czego nie uniesie czterech ludzi”;
- „Nie spełniono wniosku (imię)” zamiast imienia w mianowniku po „Wniosek”;
- spójne myślniki i dwukropki w komunikatach;
- sprzeczności w treści: „troje młodych” zamiast „młoda para”, gdy odchodzą trzy osoby.

## Technicznie
- `src/p_sprawa.js`: `sprawaHTML(p)` oraz nakładka na `ludCard`.
- `plW` i `latW` w `src/p_const.js`. Lokalna kopia `plW` z `p_cel.js` została usunięta.
- Moduły epoki IV ładowane w testach osobno (`p_e4_audit`, `p_e4_domain`, `p_e4_economy`) nie zależą od nowych funkcji.

## Testy
`tests/sprawa.test.mjs` (3 przypadki):
- prośba na karcie osoby;
- brak karty bez sprawy;
- odmiana liczebników.
