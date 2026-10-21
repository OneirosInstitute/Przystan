# Przystań 4.8.0-rc.1 — Dusza osadnika i wieczory

Baza: main 4.7.0-rc.1 `50739a6`. Pierwsze z trzech wydań planu [Życie osadników](PROJEKT_ZYCIE_OSADNIKOW.md) (zaakceptowanego 21.10.2026 z decyzjami: nastrój zmienia pracę, sny mogą się sprawdzać, więcej słowiańskiego folkloru).

## Poprawka: ludzie stojący na plaży po Marzannie

Zgłoszenie z 21.10, wieczorem: po topieniu Marzanny cała wieś stała półkolem na brzegu przez kilka dni, także po ponownym uruchomieniu. Na wyspie 2207 tego nie da się odtworzyć: świeży obrzęd, także z przewijaniem nocy, kończy się dobrze. Wszystkie objawy pasują jednak do jednego mechanizmu, więc naprawiony jest właśnie on, razem z dwiema furtkami, przez które mógł się uruchomić:

- **Główna przyczyna:** w `step` (`p_rest.js`) pętla po ludziach była jedną całością. Gdy dla jednej osoby coś poszło nie tak, przerywała się w każdej klatce: nikt dalej na liście się nie ruszał, a czas płynął. Zapis zachowywał ten stan, więc po ponownym uruchomieniu było to samo. Teraz każda osoba liczy się osobno. Kto trafi na błąd, zaczyna od nowa: puszcza cel, staje i w razie potrzeby wraca na najbliższe dostępne pole (`personReset`). Reszta wsi żyje dalej. Ślad błędu zostaje w zapisie (`S.fault`, ostatnie 12), więc z pobranego zapisu da się sprawdzić, co to było.
- **Strażnik:** sprawdza po jednej osobie na krok, więc nie obciąża baterii. Kto w porze pracy od dłuższej chwili (0,12 doby) stoi w miejscu poza drogą, z zablokowaną drogą, z pozostałością po obrzędzie albo „w ruchu” bez trasy, zaczyna od nowa.
- **Obrzęd zapisany w połowie:** jeśli gra została zamknięta w czasie obrzędu, po ponownym uruchomieniu obrzęd był już po czasie, ale nikt go nie zamykał. Teraz kończy się sam, a ludzie, którzy jeszcze szli na obrzęd, wracają do zwykłego dnia.
- **Miejsca przy Marzannie** są wybierane tylko na polach połączonych z resztą wyspy (`nearReach`), nie na odciętym skrawku plaży.
- **Test:** `obrzedy-brzeg` sprawdza osobę, która się wywraca (inni dalej chodzą, ślad jest w zapisie), oraz zapis z obrzędem w połowie (obrzęd się kończy, ludzie się rozchodzą).

## Dusza osadnika (`p_dusza.js`)

- **Usposobienie:** każdy ma dwa rysy z szesnastu:
  - gadatliwy, milczący, rozśpiewany, marzyciel;
  - zrzędliwy, wesoły, bogobojny, ciekawski;
  - tęskniący, opiekuńczy, porywczy, łagodny;
  - dumny, zabobonny, kpiarz, gospodarny.
- **Upodobania:** ulubione miejsce, ulubiona pora roku, ulubiona praca i jeden lęk.
- **Stałe dla każdej osoby:** charakter liczy się z numeru osoby i wyspy. Ten sam człowiek ma go zawsze, także w starym zapisie. Dzieci po części dziedziczą go po rodzicach.
- **Nastrój:**
  - liczony raz na dobę z zadowolenia z życia, które już było w grze (jedzenie, ciepło, dach, zdrowie, bliscy, praca, nadzieja), i z uczuć (stałe usposobienie do świata, dni lepsze i gorsze, wspomnienia, ulubiona praca i pora roku, pogoda, wieczór z ludźmi);
  - zmienia pracę o najwyżej 8% w górę lub w dół i zastępuje dawny wpływ zadowolenia;
  - w karcie osoby: „Nastrój: w żałobie · żałoba po …, czeka na własny dom”.
- **Dzień:**
  - co ktoś dziś robił i co przyniósł, liczone przy pracy jednym dodawaniem;
  - zdarzenia dnia: awans, budowa, wyprawa, rana, ślub, narodziny, sen.
- **Wspomnienia:**
  - do 12 na osobę: ślub, narodziny dziecka, śmierć bliskiego, pierwszy własny dom, budowa, wyprawa, mistrzostwo, rana, sen, który się sprawdził;
  - ważne zostają na zawsze, a drobne bledną;
  - rocznice („rok temu o tej porze…”).
- **Karta osoby:** usposobienie, upodobania, „Dziś” i rozwijane „Wspomnienia”.
- **Awanse:** jedna linijka dnia („Troje lepiej zna swój fach: …”) zamiast osobnego wpisu dla każdego. Biegłość (4) i mistrzostwo (5) zostają osobno.

## Wieczory, noce i poranki (`p_wieczor.js`)

- **Przy ognisku** (albo przed chatami, w bani, w izbie, czyli tam, gdzie ludzie naprawdę siedzą) mówią 2–3 osoby albo rozmawiają ze sobą dwie.
- **Skąd tematy:**
  - dzień mówiącego;
  - wspomnienia i rocznice;
  - bliscy (przyjaciel, zwaśniony, żona albo mąż, dziecko);
  - stan osady;
  - pora roku, pogoda, przyroda (zwierzęta pory roku, co jest w kotle według zapasów, ogień, niebo);
  - ludowe przysłowia pogodowe, usposobienie, epoka, starzy i dzieci;
  - pieśni, które osada ułożyła;
  - wierzenia.
- **Wierzenia:**
  - zmora (dusi, jeździ na kozach, nóż pod poduszką);
  - topielec, południca, boginki i dziwożona (czerwona wstążka, dziurawiec, pieluchy przed zachodem);
  - płanetnik (mąka w ogień), leszy (odwrócona kurtka), błędne ogniki, domowik;
  - licho, kukułka, bocian, wilkołak, rusałki;
  - Dziady, Kupała, Gromniczna;
  - starzy znają ludowe opowieści o niebie.
- **Bez powtórek:**
  - osada pamięta około 70 ostatnich zdań i tematów i nie wraca do nich;
  - ten sam mówca nie częściej niż co trzeci wieczór, chyba że to gaduła;
  - w teście ze 100 wieczorów to samo zdanie wraca najwcześniej po 15 wieczorach (w praktyce po około 30), a różnych zdań jest ponad 150.
- **Nocą** jedna linijka narracji:
  - dziecko płacze przez sen, ktoś czuwa przy ogniu;
  - odgłosy pory roku;
  - zmora, lunatyk, młodzi pod wierzbą, plusk w stawie;
  - albo sen.
- **Sny, które się sprawdzają** (decyzja 4): sen bierze się z prawdziwej przyszłości gry. Marzyciele, zabobonni i bogobojni śnią częściej. Gdy sen się sprawdzi, rano jest o tym linijka, wpis w Kronice i wspomnienie śniącego.

  | Co ktoś śni | Co zapowiada |
  |---|---|
  | czarny koń na wodzie, ogień na dąb, biała gęś, szklane kwiaty | pogodę z prognozy |
  | ryba w czystej wodzie | dziecko w rodzinie, w której ktoś jest w ciąży |
  | wypadający ząb | odejście kogoś bardzo słabego |
  | ogień od lasu | pożar w suszy |
  | koguty na progu | kłótnię |

- **Rano** karta „Wczoraj”: 2–3 najważniejsze chwile z dzienników ludzi i z Kroniki.
- **Kiedy to się dzieje:** zdania składają się z zegarem gry, także bez ekranu, raz na wieczór i raz na noc. Na ekranie są pokazywane przez ustalony czas, więc da się je przeczytać także przy przewijaniu nocy.
- **Kronika → Wieczory przy ogniu:** ostatnie 20 wieczorów z nocami.

## Zapis

Nowe pola osoby: `us`, `lub`, `mood`, `dzn`, `dznY`, `mem`. Pola osady: `wm` (pamięć zdań), `wArch` (archiwum wieczorów), `sen`, `zmarli`, `lvq`. Usposobienie, nastrój i wspomnienia są sprawdzane w `validateSave`. Stary zapis dostaje charakter przy pierwszym dniu.

## Testy

- Nowy zestaw `dusza` (7 przypadków):
  - charakter stały i taki sam po usunięciu z zapisu;
  - wieczory bez powtórek (100 wieczorów) i różne noce;
  - zgodność form męskich i żeńskich we wszystkich zdaniach, dla każdej pary płci;
  - nastrój w zakresie i ±8% pracy;
  - awanse w jednej linijce, żałoba rodziny po śmierci;
  - sen, który się sprawdza;
  - wieczory na zegarze gry, w Kronice i po wczytaniu.
- Pełna bramka (`npm run test:install`, `npm run test:runtime`, `tools/verify-package.cjs`).
- W przeglądarce (telefon 412 × 870):
  - wieczór przy ognisku, noc, rano;
  - karta osoby;
  - bez błędów w konsoli.

## Następne wydania

- **4.8.0-rc.2:** wydarzenia. Małe sceny bez zatrzymania gry i nowe duże wydarzenia o ludziach i wierzeniach (zjawy, zaloty, spory), losowane z różnorodnością.
- **4.8.0-rc.3:** SI czasu wolnego. Odwiedziny, ulubione miejsca, rozmowy w drodze, unikanie zwaśnionych, samodzielna zmiana pracy, reakcje na burzę, wilki i żałobę.
