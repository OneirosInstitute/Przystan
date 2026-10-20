# Przystań — przysiółek, który rośnie w folwark

Data: 20 października 2026. Baza: 4.5.0-rc.2 (`f290081`).
Status: zaakceptowany 20.10.2026, wdrożony w całości w 4.6.0-rc.1 (etapy 0–7).
Decyzje: budowniczowie z Przystani pomagają tylko za zgodą (przysiółek wysyła prośbę); w epoce IV codzienna praca zostaje automatyczna, a nowe budynki wymagają zgody; kraina liczy się jako zasiedlona od chaty z bali.
Plansza: [Przystan_przysiolek_folwark_etapy.png](Przystan_przysiolek_folwark_etapy.png).

## 0. Co już jest (żeby nie robić drugi raz)

| Co | Gdzie | Jak działa dziś | Co z tym robimy |
|---|---|---|---|
| Etapy przysiółka | `p_kol.js` (`HST`, `kolDaily`) | Obozowisko → zagroda → przysiółek → osiedle → wieś. Etap rośnie **sam**, gdy przybywa ludzi i jest jedzenie | Etap wynika z tego, co zbudowano, a nie z liczby ludzi |
| Wygląd przysiółka | `p_kol.js` (`hamVis`) | Budynki pojawiają się same z etapem: szałas i ognisko, chata, budynek krainy, płot, dom i studnia | Każdy budynek staje dopiero po budowie, w stałym miejscu na działce |
| Ludzie w przysiółku | `p_ludzie.js`, `p_e2d.js`, `p_e21.js` | Liczba ludzi rośnie z narodzin i zdarzeń, do około 38, bez względu na dachy | Ludzi przybywa tylko wtedy, gdy jest dla nich dach |
| Rozbudowa domów w Przystani | `p_const.js` (`BD`), od 1.8.3 | Szałas → chata → dom z piecem, w tym samym miejscu | Ta sama zasada w przysiółku |
| Folwark epoki IV | `p_e4_*` | Etapy w drodze → zagroda → folwark (po domu rodowym), budynki specjalności z katalogu, dopasowanie do krainy (4.4) | Zostaje i staje się etapami 5–7 |
| Przejście do epoki IV | `p_e4_domain.js` (`migrate`) | Każdy przysiółek zaczyna od nowa jako zagroda z samym schronieniem, a jego chaty i dom rodu przepadają | Przysiółek przechodzi z tym, co ma |
| Budowanie w epoce IV | `p_e4_economy.js` (`autoPlan`) | Folwark sam stawia pola, chaty, magazyny i budynki specjalności (`autonomy: true` od początku) | Codzienna praca zostaje sama, nowe budynki tylko za zgodą gracza |
| Kierunek folwarku | `PROJEKT_WYSPY_5.md` §4, `EPOKA_IV_KONTRAKT.md` §4 | Tabela rodzajów folwarków i zasada, że folwark wyrasta z domu rodowego | To ten projekt rozpisuje krok po kroku |

Tego, jak przysiółek ma wyglądać od szałasu do pełnego folwarku i kto o tym decyduje, nie było nigdzie rozpisane.

## 1. Zasady

1. **Nic nie staje samo.** Każdy budynek w przysiółku to decyzja gracza: wybór z listy w karcie przysiółka albo zgoda na prośbę rodu („Ród Dobromira prosi o zgodę na stodołę”).
2. **Budują ludzie przysiółka**, z materiału, który mają na miejscu albo który przyniosą tragarze i wozy z Przystani. Przy dużych budowach Przystań może posłać swoich budowniczych.
3. **Rośnie w miejscu.** Szałas na czele podwórza przebudowuje się w chatę, chatę w dom z piecem, dom w dom rodu, a dom rodu w dwór. Ognisko na środku podwórza zastępuje studnia. Raz postawiony budynek nie przeskakuje w inne miejsce.
4. **Ludzi jest tylu, ile dachów.** Gdy brakuje miejsca, para czeka albo wraca do Przystani, a przysiółek prosi o nową chatę.
5. **Kraina decyduje o pracy.** Pierwszy budynek pracy wynika z krainy (suszarnia ryb, chata drwala, łom, zagroda kóz). W epoce IV specjalność folwarku musi pasować do krainy, tak jak od 4.4.
6. **Telefon to wzorzec.** Przysiółek liczy się raz na dobę, a model przebudowuje się tylko wtedy, gdy coś stanie.

## 2. Etapy

Etap to nazwa tego, co stoi. Przechodzi się na niego, gdy są postawione wszystkie budynki z kolumny „Trzeba mieć”.

| Etap | Trzeba mieć | Dachy (osób) | Kiedy | Co daje |
|---|---|---|---|---|
| 0 Obozowisko | szałas, ognisko z okapem | 5 | przy założeniu | dary z krainy, prośby |
| 1 Zagroda | szałas przebudowany w chatę, stanowisko krainy, mały ogród | 6 | od założenia | więcej darów krainy, pierwsze zapasy na miejscu |
| 2 Przysiółek | druga chata, ziemianka, studnia, pole albo ogród z zielnikiem | 12 | od założenia | droga do Przystani, zapasy na zimę, mniej chorób latem |
| 3 Osiedle | chata na czele przebudowana w dom z piecem, trzecia chata, płot, stodoła, warsztat krainy | 20 | od epoki II | warsztat robi wyroby (wędzone ryby, deski, kamień ciosany, sery), wesela i obrzędy na miejscu |
| 4 Wieś z domem rodu | dom przebudowany w dom rodu, spichlerz, drugie pole | 26 (30 z bocznymi domami) | od epoki III | siedziba rodu: głowa rodu, sukcesja, w epoce IV od razu folwark |
| 5 Folwark | specjalność dopasowana do krainy i jej pierwszy budynek, czworak (z chaty 2), magazyn, trójpolówka | 40 | epoka IV | nadwyżka specjalności, własny wóz |
| 6 Folwark rozwinięty | pełny łańcuch specjalności (2–4 budynki), obora, piwnica, skrzydło domu rodu, sad i pasieka, droga kamienna do Przystani | 55 | epoka IV | handel z innymi folwarkami, uczniowie fachu |
| 7 Dwór z folwarkiem | dom rodu przebudowany w dwór (dwa skrzydła i ganek), drugi czworak, kuźnia albo karczma, ogrodzenie z bramą | 70 | epoka IV | miejsce jarmarku i wiecu rodu, pełna samodzielność |

Etapy 0–4 to epoki I–III (na nowym lądzie od epoki II). Etapy 5–7 to dzisiejszy folwark epoki IV, uzupełniony o układ i przebudowy.

## 3. Jak się buduje w przysiółku

**Wybór.** W karcie przysiółka jest dział „Budowa”: tylko to, co pasuje do etapu i krainy, z kosztem, czasem i powodem blokady („brak 8 gliny — tragarze przyniosą za 2 dni”). Jednocześnie trwają najwyżej dwie budowy.

**Prośby rodu.** Raz na jakiś czas ród prosi o konkretną budowę, gdy jej potrzebuje (para czeka na chatę, zapasy gniją bez ziemianki). Zgoda zaczyna budowę, a odmowa ochładza więź, tak jak dziś przy prośbach o jedzenie.

**Materiał.** Przysiółek dostaje prawdziwy mały skład: drewno, kamień, glina, deski, gwoździe, płótno, narzędzia. To, co daje kraina, zbiera sam (drewno prawie wszędzie, kamień na grani i w Zagłębiu, glina na gliniskach i nizinach). Resztę przynoszą z Przystani tragarze po ścieżce (4 porcje na osobę) albo wóz po drodze. To ci sami wędrowcy, których już widać na ścieżkach, tylko teraz niosą to, czego naprawdę brakuje.

**Praca.** Budują dorośli przysiółka, z wyjątkiem tych, którzy zdobywają jedzenie. Ekipa budowniczych z Przystani skraca dużą budowę o połowę, ale na ten czas ubywa ich w Przystani.

**Koszty.** Takie same jak w Przystani, żeby gracz nie uczył się dwóch cenników:

| Budowa | Koszt | Praca (osobodni, rok ma 20 dni) |
|---|---|---|
| Szałas z ogniskiem (przy założeniu) | 8 drewna, 2 płótna (niosą założyciele) | 1 |
| Szałas → chata z bali | 30 drewna, 10 kamienia, 8 gliny, 16 gwoździ | 3 |
| Nowa chata | jak wyżej | 3 |
| Stanowisko krainy | suszarnia ryb 8 drewna / chata drwala 8 drewna / łom 10 drewna / zagroda kóz 24 drewna | 1,5 |
| Ziemianka | 8 drewna, 6 kamienia | 1,2 |
| Studnia | 12 kamienia, 4 drewna | 1,5 |
| Pole | 4 drewna, 10 ziarna na siew | 1,5 |
| Płot | 1 drewno na 2 pola obwodu (około 30) | 2 |
| Stodoła | 24 drewna, 8 desek | 2,5 |
| Chata → dom z piecem | 20 drewna, 20 cegły, 16 desek, 24 gwoździe, 10 kamienia | 4 |
| Warsztat krainy | 16 drewna, 8 kamienia, 6 desek | 2,5 |
| Dom → dom rodu | 30 drewna, 10 desek, 8 kamienia (jak `dom_rodowy` w epoce IV) | 6 |
| Etapy 5–7 | koszty z katalogu epoki IV (`p_e4_catalog.js`) | jak dziś |

Cegła i gwoździe są tylko w Przystani, więc dom z piecem w przysiółku wymaga dostaw z Przystani.

## 4. Ludzie i dachy

- Pojemność przysiółka to suma miejsc w chatach i domach (szałas 5, chata 6, dom z piecem 8, dom rodu 14, czworak 12, dwór 18). Boczne chaty można od osiedla przebudować w domy z piecem.
- Narodziny i przybysze (`p_ludzie.js`, `p_e2d.js`, `p_e21.js`, zdarzenia) liczą się tylko do pojemności. Ponad nią para czeka (`waitHome`), a ród prosi o chatę.
- Gdy dach się pali albo niszczeje, ludzie śpią ciasno: więcej chorób zimą, aż do naprawy.

## 5. Folwark (epoka IV)

- **Przejście bez straty.** Przy Wiecu Rodów przysiółek przechodzi z tym, co ma: chaty jako chaty, dom rodu jako `dom_rodowy`, warsztat i pola jako budynki i pola folwarku. Przysiółek z domem rodu od razu jest folwarkiem (etap 5 czeka tylko na specjalność), a nie zagrodą od zera.
- **Specjalność** wybiera gracz z listy pasujących do krainy (jest od 4.4). Jej budynki stają w stałych miejscach: pierwszy w miejscu warsztatu, kolejne przy bramie.
- **Autonomia** dzieli się na dwie części. Codzienna praca (siew, żniwa, wypas, wyroby, transport) zostaje sama. Nowe budynki i przebudowy wymagają zgody gracza: ród proponuje, gracz się zgadza albo nie. Dziś `autoPlan` stawia je sam od pierwszego dnia.

## 6. Wygląd: czworobok wokół podwórza

Układ jak w dawnym folwarku. Na środku jest podwórze z ogniskiem, potem studnią, a na końcu studnią z żurawiem. Na czele podwórza stoi dom, który rośnie od szałasu do dworu, a za nim jest ogród, później sad i pasieka. Po bokach są chaty, które później stają się czworakami, czyli domami dla pracowników. Niżej są budynki pracy (stanowisko → warsztat → specjalność) i zapasy (ziemianka → spichlerz → magazyn). Od strony drogi do Przystani stoją stodoła i obora, a przez bramę wychodzi droga. Pola leżą za ogrodzeniem, a ogrodzenie rośnie od płotu do ogrodzenia z bramą (ostrokół z zagrożeń zostaje).

Każde miejsce na działce ma stały numer i obrót. Plansza `Przystan_przysiolek_folwark_etapy.png` pokazuje wszystkie osiem etapów na tej samej działce. Działka ma około 26 na 26 pól plus pola po bokach, więc przy zakładaniu trzeba sprawdzać, czy jest tyle płaskiego lądu (`hamletSpot` szuka dziś miejsca tylko na szałas).

Budowa jest widoczna: rusztowanie z bali, stos materiału i dwie albo trzy postacie przy pracy, gdy kamera jest blisko. Z daleka przysiółek jest jedną scaloną bryłą, tak jak dziś.

## 7. Stare zapisy

- Przysiółek z etapem `st` dostaje budynki, które dziś widać na jego modelu: 0 szałas; 1 chata i ogród; 2 do tego stanowisko krainy, druga chata i ziemianka; 3 do tego trzecia chata i płot; 4 do tego dom rodu i studnia. Etap się nie cofa.
- Gdy ludzi jest więcej niż dachów, nikt nie odchodzi, ale nikt nowy nie przybędzie, dopóki nie stanie chata. Kronika mówi o tym raz.
- Zapisy epoki IV: folwarki zostają jak są. Przysiółki, które przeszły jako zagroda ze schronieniem, dostają z powrotem chaty według dawnego etapu, jeśli zapis go pamięta (`legacyHamletId`).

## 8. Bateria i płynność

Przysiółek liczy się raz na dobę gry. Model buduje się z gotowych modeli budynków i scala w jedną bryłę (`mergeGroup`, jak dziś), tylko po ukończeniu budowy. Postacie przy budowie pokazują się tylko w pobliżu kamery (jak zwierzęta od 4.5).

## 9. Plan wydań

| Wydanie | Zakres | Odbiór |
|---|---|---|
| 4.6.0-rc.1 | skład przysiółka, lista budowy w karcie, przebudowy w miejscu, etapy 0–4 z budynków, dachy ograniczają ludzi, tragarze z materiałem, prośby rodu o budowę, migracja starych przysiółków | test: przysiółek bez budowy nie rośnie; budowa chaty wymaga materiału i pracy; stary zapis zachowuje wygląd |
| 4.6.0-rc.2 | przejście do epoki IV z dorobkiem przysiółka, autonomia bez samodzielnego budowania, specjalność w stałych miejscach, etapy 5–7, czworaki, dwór | test: przysiółek z domem rodu staje się folwarkiem; folwark nie stawia budynku bez zgody |
| 4.6.0-rc.3 | wygląd budowy (rusztowania, ludzie przy pracy), plansza etapów w karcie przysiółka, dopracowanie modeli czworaka i dworu | zrzuty wszystkich etapów, próba na telefonie |

## 10. Decyzje (20.10.2026)

1. Budowniczowie z Przystani pomagają tylko za zgodą: przysiółek wysyła prośbę, wiec się zgadza albo odmawia.
2. W epoce IV codzienna praca folwarku zostaje automatyczna, a nowe budynki i przebudowy wymagają zgody gracza.
3. Kraina liczy się jako zasiedlona (Wspólnota i cele epoki III), gdy przysiółek ma co najmniej chatę z bali.
