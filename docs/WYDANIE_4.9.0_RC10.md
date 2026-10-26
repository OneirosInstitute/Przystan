# Przystań 4.9.0-rc.10: życie przy budynkach

Podstawa: 4.9.0-rc.9 (`e46f4da4a7d9c26f05b17d7a600276c5002ec8eb`).

To paczka D z planu budynków. Zgodnie z decyzją ruch jest tylko na grafice wysokiej i ultra.

## Co się rusza
- **Dym z kominów domów:** trzy kłęby wędrują w górę, rosną, rzedną i odpływają z wiatrem. Jesienią, zimą i wiosną dym idzie cały dzień, latem tylko rano i wieczorem. Komin pali się tylko w gotowym domu.
- **Dym nad warsztatami** (kuźnia, wędzarnia, mielerz, piekarnie): unosi się i faluje.
- **Żar** w paleniskach i piecach migocze.
- **Proporce poziomu 3** łopoczą, mocniej przy silnym wietrze.
- **Pranie na sznurze** kołysze się.
- **Kury w kurniku** dziobią.
- **Skrzydła wiatraka** kręcą się jak dotąd.

## Bateria i wydajność
- **Grafika niska (oszczędzanie baterii):** dym z kominów nie powstaje, nic się nie rusza, a siatki budynków scalają się jak dotąd.
- **Kiedy ruch się zatrzymuje:** w trybie oszczędzania baterii, gdy czas stoi i gdy karta gry jest ukryta.
- **Zasięg:** ruszają się tylko budynki blisko środka widoku.
- **Koszt:** pomiar w osadzie z 38 ożywionymi budynkami:
  - pętla zajmuje ok. 0,02 ms na klatkę;
  - wywołania rysowania: +3% (2189 → 2259), bo chorągiewki i kury nie są scalane z resztą budynku.

## Technicznie
- `src/p_ozywienie.js`:
  - rejestr ożywionych budynków (`OZ_IDS`), uzupełniany przy `addBuildingMesh`;
  - nakładki na `wSmoke`, `wGlow`, `laundry`, `logHouse` (dym z komina) i `mergeGroup` (pomija to, co ma się ruszać).
- `src/p_poziomy.js`: proporzec poziomu 3 oznaczony do ruchu.
- `server.js`: tabela wyspy tygodnia zapisuje do 16 znaków wersji, bo „4.9.0-rc.10” obcinało się do „4.9.0-rc.1”.

## Testy
`tests/ozywienie.test.mjs` (3 przypadki):
- na wysokiej grafice komin dymi zimą, a proporzec się rusza;
- na niskiej grafice nic się nie rusza i nie ma dymu z kominów;
- latem kominy dymią tylko rano i wieczorem.
