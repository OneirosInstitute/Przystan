# Przystań 4.6.0-rc.1 — Budowa w przysiółkach

> **4.6.0-rc.3** (baza `222f659`) dodaje pracę we wsi i powiększa zagrodę.
> - **Karczowanie pniaków** (`p_karcz.js`). Ścięte drzewo zostawia pniak. Tam, gdzie wieś się buduje i rośnie (do kilku pól od chat i budów, przy placu), pniaki się wykopuje: najpierw przy budowach, potem przy gotowych domach. Robią to budowniczowie, gdy nie mają budowy, wolne ręce, gdy nie ma nic pilniejszego, i nowa praca „Karczowanie” w Ludzie → Praca (karczownicy z − i +, bez pniaków pracują jak wolne ręce). Pniak znika na zawsze, korzenie dają 2 opału. Wykarczowane pniaki liczą się do celu karczowisk w epoce II, a po wczytaniu gry nie wracają.
> - **Zagroda** ma kwadratowy wybieg na całe swoje pole zamiast małego kółka, szopa i siano stoją przy płocie, a kozy rozchodzą się po stałych miejscach całego wybiegu zamiast tłoczyć się przy sianie. „Większy wybieg” to prawdziwy ogrodzony wybieg przed zagrodą na sześć kolejnych kóz.
> - Nowy zestaw `karczowanie` (3 przypadki).

> **4.6.0-rc.2** (baza `41c48eb`) usuwa podwójne ładowanie po aktualizacji. Do tej pory gra z telefonu brała stronę najpierw z pamięci, więc po każdym nowym wydaniu uruchamiała się najpierw stara wersja (ekran tytułowy, wczytanie wyspy), a po kilkunastu sekundach cała strona ładowała się drugi raz już w nowej. Teraz pracownik offline (`sw.js`) bierze stronę najpierw z sieci (czeka do 3,5 s) i z pamięci tylko bez sieci. Strona rejestruje pracownika z numerem wersji (`sw.js?v=…`) i nie przeładowuje się, gdy nowy pracownik ma tę samą wersję co ona. Serwer odpowiada „bez zmian” (304, `ETag`), więc przy niezmienionej grze telefon nie pobiera jej od nowa. Sprawdzone w przeglądarce z prawdziwym serwerem: po podmianie wersji jedno ładowanie od razu w nowej wersji, a bez sieci gra startuje z pamięci. Jedno podwójne ładowanie zdarzy się jeszcze przy przejściu z 4.6.0-rc.1, bo tamta wersja pracownika działa po staremu.

Baza: main 4.5.0-rc.2 `f29008133744e8902c9d1381ba4de22714678c69`. Wydanie wypchnięte na main (Railway buduje z main).
Cały [projekt przysiółka i folwarku](PROJEKT_PRZYSIOLEK_FOLWARK.md), zaakceptowany 20.10.2026, w jednym wydaniu: etapy 0–4 (od szałasu do wsi z domem rodu) w epokach I–III i etapy 5–7 (folwark, folwark rozwinięty, dwór z folwarkiem) w epoce IV.

## Nowe

- **Nic nie staje samo** (`p_przys.js`). Do 4.5 etap przysiółka rósł z liczbą ludzi, a chaty, płot, dom i studnia pojawiały się same. Teraz etap wynika z tego, co stoi (`HREQ`, `hamStage`), a każda budowa to decyzja gracza:
  - lista „Co można zbudować” w karcie przysiółka (Ludzie → Wspólnota), z kosztem i powodem, gdy coś jeszcze nie jest możliwe;
  - prośba rodu o zgodę (`hamPropose`): najpierw o dach, gdy jest ciasno, potem o to, czego brakuje do następnego etapu. „Nie teraz” lekko ochładza więź;
  - najwyżej dwie budowy naraz.
- **Przebudowy w miejscu.** Na czele podwórza szałas → chata z bali → dom z piecem (od epoki II) → dom rodu (od epoki III). Na środku podwórza ognisko → studnia. Stanowisko krainy → warsztat krainy, ziemianka → spichlerz, ogród → zielnik, boczne chaty → domy z piecem.
- **Materiał i praca.** Przysiółek ma własny mały skład. Dorośli najpierw zbierają w krainie to, co tam jest (drewno, kamień, glina, w łąkach i z pola ziarno), a potem budują. Gwoździe, deski, cegłę, płótno i resztę trzeba posłać z Przystani („Poślij z Przystani”). Tragarze idą ścieżką, widać ich na mapie, a po drodze dochodzą szybciej. Koszty są takie same jak w Przystani.
- **Budowniczowie z Przystani tylko za zgodą.** Przy dużej budowie mały przysiółek prosi o dwóch budowniczych. Wiec może ich posłać: idą jak wyprawa, z jedzeniem na drogę, na ten czas ubywa ich w Przystani, a budowa idzie około dwa razy szybciej. Mogą też zostać w domu, wtedy przysiółek buduje sam, wolniej.
- **Ludzi tylu, ile dachów** (`hamCap`, `hamRoom`). Narodziny, wesela i przybysze tylko wtedy, gdy jest miejsce (szałas 5, chata 6, dom z piecem 8, dom rodu 14). Pożar i osuwisko zabierają ostatnio postawiony dach.
- **Kraina zasiedlona od chaty z bali.** Tak liczą Wspólnota i cele epoki III („przysiółki w połowie krain”, „ogień w każdej krainie”).
- **Stałe miejsca na działce** (`HSLOT`, `hamBuildModel`). Dom na czele podwórza, chaty po bokach, stodoła przy drodze do Przystani (brama zwrócona ku ścieżce), ogród za domem, pola po bokach. Tam, gdzie trwa budowa, stoi rusztowanie ze stosem bali. Podwórze bez drzew rośnie z etapem.
- **Warsztat krainy** dokłada wyrób do darów: wędzone ryby, deski, kamień albo ser.

- **Ludzie przy budowie.** Przy budowie, na której naprawdę się pracuje, stoją dwie albo trzy osoby z przysiółka i ciosają bale. Widać je tylko w promieniu 40 pól od kamery. Są osobno od scalonego modelu przysiółka i nie liczą niczego.
- **Plansza etapów** w karcie przysiółka i folwarku: osiem kroków od obozowiska do dworu, z zaznaczonym bieżącym, a pod nią lista tego, czego brakuje do następnego.

## Epoka IV: z przysiółka folwark

- **Przejście z dorobkiem** (`hamletEstate` w `p_e4_domain.js`). Do 4.5 każdy przysiółek zaczynał epokę IV od nowa jako zagroda ze schronieniem i dostawał przypadkową specjalność. Teraz chaty i domy przechodzą jako chaty, dom rodu jako dom rodowy (przysiółek jest od razu folwarkiem), ziemianka jako piwniczka, spichlerz jako magazyn, ogród i zielnik jako ogródek i zielnik, a pola jako pola zboża. Miejsca pod dachem zostają, a działka zachowuje obrót.
- **Kierunek folwarku wybiera gracz** (`E4Economy.specialize`) z listy ze znakami ✓ i ✗ dla krainy (dopasowanie z 4.4).
- **Nowe budynki za zgodą, codzienna praca sama.** Siew, żniwa, wypas, wyroby, zbieranie i dostawy rody prowadzą same. Pola, chaty, skrzydła, magazyny, budynki specjalności i pracownie w Przystani stają się prośbami rodu (`want`, `decide`): karta „Ród prosi o zgodę” z kosztem i powodem („ciasno: 12 z 12 miejsc”, „pól zboża 1 z 3”). „Nie teraz” odkłada prośbę na 10 dni. W polityce jest przełącznik „Nowe budynki: za twoją zgodą / rody budują same”, a nowe gałęzie rodów domyślnie czekają na polecenie. Starsze zapisy epoki IV przechodzą na tryb zgody raz (`policy.v46`).
- **Etapy 5–7** (`e4FolwarkStage`):
  - Folwark: dom rodowy, specjalność i jej pierwszy budynek, czworak, magazyn, dwa pola zboża;
  - Folwark rozwinięty: cały łańcuch specjalności, piwniczka, skrzydło domu rodowego, obora (zagroda rodowa), sad albo pasieka;
  - Dwór z folwarkiem: nowy budynek „Dwór” (przebudowa domu rodowego, wymaga skrzydła), drugi czworak, kuźnia albo karczma.
- **Ten sam układ działki** (`E4SLOT`, `e4SlotPos`). Dom rodowy, a potem dwór stoi na czele podwórza, czworaki po bokach, budynki specjalności w miejscu warsztatu i przy bramie, obora obok stodoły, kuźnia i karczma w narożnikach, sad i pasieka za domem. Studnia, stodoła i płot z czasów przysiółka zostają, a ludzie pracują przy tych samych miejscach (`site` w `E4Life`). Czworak jest dłuższy od chaty, a dwór największy.

## Stare zapisy

Przysiółek bez budynków w zapisie (`bud`) dostaje to, co było widać na jego modelu (`hamGrant` według dawnego etapu), więc jego etap się nie cofa. Gdy ludzi jest więcej niż dachów, nikt nie odchodzi, ale nikt nowy nie zamieszka, dopóki nie stanie chata.

## Testy

- Nowy zestaw `hamlets-build` (5 przypadków): nowy przysiółek sam nic nie buduje i nie rośnie ponad dach, ród prosi o chatę; chata wymaga zbierania i gwoździ z Przystani i zastępuje szałas w miejscu; budowniczowie idą tylko za zgodą i wracają; stare przysiółki zachowują wygląd, a epoka III liczy tylko przysiółki z chatą; w epoce IV wieś z domem rodu jest od razu folwarkiem, zachowuje dachy i obrót, a nic nowego nie staje bez zgody.
- Testy, które sprawdzają długie życie rodów albo łańcuchy specjalności (`e4-population`, `ai-specialties`, `e4-integration`), symulują gracza, który zgadza się na każdą budowę (`policy.autoBuild=true`), bo sprawdzają gospodarkę, a nie zgody. Oba scenariusze pięciu pokoleń (1500 dni) przechodzą.
- `npm run test:install`, `npm run test:runtime`, `tools/verify-package.cjs`.
- Przeglądarka: zrzuty etapów 0–4 z rusztowaniem i ludźmi przy budowie, karta przysiółka z planszą etapów i prośbami, wieś z domem rodu przed epoką IV i ten sam folwark po niej jako dwór z folwarkiem, bez błędów w konsoli.

## Następne kroki

Próba na telefonie: płynność i bateria przy kilku przysiółkach z budowami blisko kamery.
