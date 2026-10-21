# Projekt: życie osadników, wieczory i ich SI

Stan: zaakceptowany 21.10.2026 (po 4.7.0-rc.1), z decyzjami i folklorem niżej. Wdrażany w wydaniach 4.8.

## Co jest dziś i dlaczego się powtarza

Sprawdzone w kodzie i w 30-dniowej symulacji gotowej wsi epoki II:

- **„Przy ognisku”** (`czTalkLines` w `p_cisza.js`) to około 20 zdań. Większość odpala się tylko w kryzysie: głód, brak opału, choroba, kłótnie. W spokojnej osadzie zostają 3–4 zdania zapasowe („Cicho dziś. Tylko fale i ogień.”, „Plecy bolą, ale dach nad głową jest.”, „Ryby podchodzą pod brzeg…”, pytanie dziecka o powrót). W próbie każdy z 12 wieczorów miał przynajmniej jedno z nich.
- **Kronika** to w większości awanse („X awansuje: drwal 1”) i znaki pogody. Te same zdania wracają co kilka dni.
- **Wydarzenia z wyborem:** jest ich 32, ale połowa należy do przysiółków albo do kryzysów. W spokojnej wsi epoki II przez 30 dni trafiły się tylko 2.
- **Osadnik** ma jedną cechę (do pracy), umiejętności, rodzinę i liczbę sympatii do innych. Nie ma nastroju, upodobań ani pamięci tego, co przeżył. Dlatego nie ma o czym mówić wieczorem: nie wie, co robił dziś ani co go spotkało rok temu.
- **SI** jest oparta na pracy i rytmie dnia: mycie, wspólny posiłek, wieczór przed domem albo przy ognisku, sobotnia bania; dzieci bawią się w berka, puszczają kaczki i patrzą na rodziców. Czas wolny jest wszędzie taki sam. Nikt nikogo nie odwiedza, nie unika, nie ma ulubionego miejsca.

Wniosek: żeby zdania się nie powtarzały, samo dopisanie stu nowych nie wystarczy. Osadnicy muszą mieć z czego mówić, czyli własne przeżycia, charakter i relacje. Wtedy zdania składają się z tego, co naprawdę się wydarzyło.

## Pomysł w jednym akapicie

Każdy osadnik dostaje **usposobienie i upodobania**, **nastrój** liczony raz dziennie i **pamięć**: co robił dziś i najważniejsze przeżycia z całego życia. Wieczorem i nocą **generator zdań** składa wypowiedzi z tych przeżyć, z relacji, stanu osady, pory roku i epoki. Pilnuje przy tym, żeby ten sam temat i ten sam szablon nie wracały przez wiele wieczorów. **Wydarzenia** dzielą się na duże (z wyborem, jak dziś) i nowe **małe sceny** z życia, które nie zatrzymują gry. Każde zostawia ślad w pamięci ludzi, więc potem się o nim mówi. **SI czasu wolnego** wybiera zajęcie według potrzeb i charakteru: odwiedziny u przyjaciela, ławka przed chatą, wieczorny połów, gaj, zabawa z dziećmi, unikanie zwaśnionego.

## 1. Wnętrze osadnika (model)

- **Usposobienie:** dwa z około 16, obok obecnej cechy do pracy. Na przykład Gaduła, Milczek, Śpiewak, Marzyciel, Zrzęda, Wesołek, Pobożny, Ciekawski, Tęskniący, Opiekuńczy, Porywczy, Łagodny, Dumny, Bojaźliwy, Żartowniś, Gospodarny. Usposobienie decyduje, o czym ktoś mówi i jak spędza czas, a w zdaniach zmienia ton.
- **Upodobania:** ulubione miejsce (morze, las, ogień, pola, góry), ulubiona pora roku, ulubiona praca (zwykle ta, w której jest najlepszy, ale nie zawsze) i jeden lęk (wilki, morze, burza, ciemność, choroba).
- **Stare zapisy:** usposobienie i upodobania liczą się z numeru osoby. Każdy dostaje je od razu, zawsze te same, bez losowania przy każdym wczytaniu. Dzieci po części dziedziczą je po rodzicach.
- **Nastrój** (od −1 do 1, liczony raz dziennie):
  - składa się z sytości, ciepła, zdrowia, dachu, pracy zgodnej z upodobaniem, bliskich obok, ostatnich przeżyć (żałoba, wesele, narodziny), pogody i pory roku;
  - w karcie osoby jest jedno słowo: „pogodna”, „zmęczony”, „w żałobie”, „zakochana”, „tęskni”;
  - lekko wpływa na pracę (najwyżej ±8%), na to, o czym ktoś mówi, i na szansę scen (kłótnie, żarty, zaloty).
- **Zmęczenie i towarzystwo:** dwie lekkie potrzeby, liczone z godzin pracy i z tego, z kim ktoś spędził wieczór. Kierują wyborem zajęcia w czasie wolnym.
- **Dziennik dnia:** zwykłe liczniki, co ktoś robił, z kim pracował, co przyniósł, co znalazł i co go spotkało (rana, pierwsza duża ryba, ukończona budowa). Kasuje się co rano. To z niego biorą się zdania „dziś”.
- **Wspomnienia:**
  - do 12 na osobę, każde z dniem, rodzajem, wagą i powiązaniem (osoba, miejsce);
  - ważne zostają na zawsze: ślub, śmierć bliskiego, narodziny dziecka, pierwszy dom, ocalenie;
  - drobne bledną z czasem;
  - powiązane z kimś znikają razem z tą osobą tylko wtedy, gdy były drobne;
  - rocznice („rok temu dziś…”) liczą się z kalendarza gry.

## 2. Wieczór i noc: generator zdań

**Skąd bierze tematy** (każdy temat ma wagę zależną od sytuacji):

| Źródło | Przykład |
|---|---|
| dzisiejszy dzień osoby | „Pełna sieć dzisiaj. Radosław mówi, że to jego węzeł, ale to moja ręka.” |
| wspomnienie i rocznica | „Rok temu o tej porze stawialiśmy pierwszą chatę. Ręce mnie jeszcze bolą od tamtej zimy.” |
| relacje | „Dobrosława znowu nie przyszła do ognia. Chyba wciąż ma żal o tamto pole.” |
| stan osady (jak dziś, rozszerzone) | „Spichrz pełny. Pierwszy raz nie liczę worków przed snem.” |
| pora roku, pogoda, przyroda | „Bociany wróciły na stary dąb. Teraz to już na pewno wiosna.” |
| usposobienie | Marzyciel: „Gdyby tak zbudować łódź i popłynąć za tamte chmury…” / Zrzęda: „Kasza znowu przypalona. Kto dziś stał przy kotle?” |
| epoka | I: tęsknota za domem i statkiem; II: pola, przysiółki, wiec; III: drogi, wozy, nowe krainy; IV: rody i folwarki |
| starzy i dzieci | starzy opowiadają podania i o dawnym ludzie wyspy (tylko te ślady, które osada już znalazła); dzieci pytają |
| pieśni osady | Śpiewak nuci pieśń, którą osada naprawdę ułożyła („Pieśń o rejsie na zachód”) |

**Rozmowy:** czasem nie dwa osobne zdania, tylko wymiana. Ktoś pyta, a ktoś inny odpowiada, w tonie zależnym od ich relacji: przyjaciele żartują, zwaśnieni się docinają, para mówi do siebie ciepło.

**Gdzie i kto mówi:** mówią ludzie, którzy naprawdę siedzą w tym miejscu (ognisko, przed domem, bania, ciepła izba). Nagłówek mówi, gdzie to było. Dotknięcie imienia otwiera kartę osoby.

**Noc:** osobna, krótka linijka narracji, nie mowa. Na przykład:
- „Mała Mila płacze przez sen. Matka nuci jej coś cicho.”
- „Przy ogniu czuwa Wojsław. Raz po raz dorzuca szczapę i patrzy na las.”
- „Bolko śni o statku. Rano powie, że widział go na horyzoncie.”
- Zimą: „Śnieg skrzypi pod czyimiś krokami. To tylko Łata wraca z obchodu.”

**Wspomnienie dnia:** rano, po przewinięciu nocy albo przy pierwszym spojrzeniu, krótka karta „Wczoraj” z 2–3 najważniejszymi chwilami dnia z dzienników ludzi. Bez listy awansów. Awanse zbiorą się w jedną linijkę („Troje lepiej zna swój fach.”), żeby nie zalewały Kroniki.

**Bez powtórek:**
- Osada pamięta około 60 ostatnich szablonów i tematów. Powtórka w tym oknie jest mocno karana.
- Ten sam mówca nie częściej niż co trzeci wieczór, chyba że to Gaduła.
- Każdy szablon ma 2–4 warianty i miejsca na imiona, rzeczy i miejsca.
- Cel: ponad 150 szablonów, czyli ponad 500 różnych zdań. Test sprawdzi, że w 100 wieczorach ten sam tekst nie wraca częściej niż co 15 wieczorów.

**Kronika → Wieczory:** archiwum ostatnich 20 wieczorów, do przeczytania jak dziennik.

## 3. Losowe wydarzenia

**Dwie warstwy:**

1. **Duże wydarzenia (z wyborem)** zostają jak dziś. Dochodzi około 15 nowych, związanych z ludźmi:
   - zaloty, które mogą skończyć się weselem albo zazdrością;
   - spór o miedzę albo o łódź;
   - ktoś tęskni i chce iść na cypel wypatrywać statku;
   - starzec chce przed śmiercią opowiedzieć swoją opowieść (pieśń, pamięć osady);
   - zakład kowala z cieślą;
   - dzieci podbierają miód;
   - lunatyk;
   - sen, który ktoś bierze za znak;
   - wędrowny grajek albo goście z przysiółka (epoka II i dalej);
   - swaty między przysiółkami;
   - plotki woźniców (epoka III);
   - spór rodów o granicę (epoka IV).
2. **Małe sceny (nowe)** nie zatrzymują gry: krótka linijka nad osobą na mapie i wpis w Kronice. Około 40 na start, na przykład:
   - pierwsze słowo dziecka, pierwszy ząb;
   - imieniny według polskiego kalendarza imion;
   - dzieci budują szałas;
   - ktoś znajduje bursztyn na plaży;
   - bociany wracają, pierwszy śnieg, rój pszczół na płocie;
   - sowa na dachu, którą starzy biorą za zły znak;
   - łoś przechodzi przez wieś, wieloryb na mieliźnie;
   - beczka wyrzucona po sztormie;
   - wspólne grzybobranie po deszczu;
   - ktoś uczy się pływać.

**Zasady losowania:**
- Waga wydarzenia zależy od sytuacji: nastroju, pory roku, relacji, epoki i tego, co jest na mapie.
- Kategorie się zmieniają: po kłótni nie przychodzi zaraz kolejna kłótnia.
- Każde wydarzenie ma swój czas odnowienia, a cała kategoria własny.
- Małe sceny mniej więcej raz dziennie, duże jak dziś (co 1,3–3 dni, jeśli coś pasuje).
- Każde wydarzenie zostawia ślad: zmienia nastrój, relacje i wspomnienia uczestników. Dlatego wieczorem i za rok ktoś do niego wraca („Pamiętasz, jak Mila zgubiła się w lesie?”).

## 4. SI: czas wolny, relacje, reakcje

**Czas wolny** (po pracy, w święta i w czasie „bez zajęcia”):
- Wybór z kilku zajęć z oceną według potrzeb i charakteru:
  - odwiedziny u przyjaciela (idzie pod jego chatę i siadają razem);
  - ławka przed domem;
  - ognisko;
  - wieczorny połów z brzegu;
  - ulubione miejsce (cypel, skraj lasu, gaj);
  - zabawa z dziećmi;
  - własny ogród;
  - pomoc sąsiadowi przy drobnej robocie.
- Wszystko widać na mapie i w opisie osoby („siedzi z Dobromirem przed jego chatą”).
- Wybór liczy się tylko w chwili, gdy ktoś szuka zajęcia, a nie w każdej klatce. To nie obciąża baterii.

**Relacje w ruchu:**
- przyjaciele, którzy mijają się na ścieżce, przystają na chwilę rozmowy;
- zwaśnieni siadają przy innym ogniu i nie pracują razem, jeśli jest wybór;
- sympatia rośnie od wspólnej pracy, wieczorów i pomocy, a maleje od sporów;
- zaloty rosną z sympatii i prowadzą do wesel, które już są w grze.

**Upodobania przy pracy:**
- Przy automatycznym przydziale SI bierze pod uwagę ulubioną pracę, gdy kandydaci są podobni.
- Kto długo robi to, czego nie lubi, prosi o zmianę. To prośba jak dzisiejsze: gracz się zgadza albo nie. Nikt nie zmienia pracy sam.

**Reakcje:**
- w burzę ludzie chowają się pod dach;
- gdy wilki są blisko, dzieci zostają przy domach;
- po śmierci bliskiego przez kilka dni wolniejsza praca i odwiedziny na grobie;
- po weselu taniec przy ogniu;
- ten, kto boi się morza, niechętnie wypływa.

**Starzy i dzieci:** starzy przekazują opowieści, dzieci naśladują pracę rodziców i bawią się według pór roku: sanki, budowanie szałasu, łapanie żab.

**Epoka IV:** te same usposobienia, nastrój i zdania. Czas wolny działa przez obecne działania rodów (rodzina, posiłek, odwiedziny jako nowe działanie).

## 5. Bateria i wydajność

- Nastrój, potrzeby i porządki we wspomnieniach liczą się raz dziennie.
- Zdania składają się raz na wieczór i raz na noc.
- Wybór zajęcia w czasie wolnym liczy się tylko przy przejściu do nowego zajęcia.
- Przystawanie na rozmowę: sprawdzanie sąsiadów najwyżej co sekundę i tylko dla osób w ruchu w kadrze.
- Nowe pola w zapisie są małe (wspomnienia z limitem, liczniki dnia), z walidacją w `validateSave`.

## 6. Wydania

1. **4.8.0-rc.1: wnętrze i wieczory.** Usposobienia, upodobania, nastrój, dziennik dnia, wspomnienia, generator „Przy ognisku” i „Nocą”, karta „Wczoraj”, zbieranie awansów, nowa sekcja w karcie osoby, Kronika → Wieczory. Testy różnorodności i zapisu, zrzuty.
2. **4.8.0-rc.2: wydarzenia.** Małe sceny (około 40), nowe duże wydarzenia (około 15), losowanie z różnorodnością, ślady w pamięci i relacjach.
3. **4.8.0-rc.3: SI czasu wolnego.** Odwiedziny, ulubione miejsca, rozmowy w drodze, unikanie zwaśnionych, prośby o zmianę pracy, reakcje na burzę, wilki i żałobę.

Każde wydanie przechodzi pełną bramkę testów i kontrolę w przeglądarce. Każde ma też własny zestaw testów: różnorodność zdań, stare zapisy, brak kosztu w klatce, zapis i wczytanie.

## Decyzje (21.10.2026)

1. Nastrój wpływa na wydajność pracy, najwyżej ±8%.
2. Małe sceny bez zatrzymania gry, mniej więcej raz dziennie.
3. SI może sama przestawić człowieka do innej pracy: z pracy, której nie lubi, do pracy, którą lubi, kiedy ta praca czeka i osada na tym nie traci. Gracz widzi to w Kronice i może cofnąć.
4. Sny mogą naprawdę zapowiadać (pogodę, narodziny, nieszczęście). Zjawy zostają tym, co ludzie twierdzą, że widzieli. Ich skutki biorą się z ludzkiego strachu i ludzkich zabiegów, a nie z mocy zjaw.
5. Więcej słowiańskiego folkloru, wierzeń, dawnych zwyczajów i obaw.

## 7. Folklor słowiański

Zasada gry zostaje ta sama co w `p_slav.js`: wierzenia działają przez ludzi (strach, otucha, zabiegi, zgoda albo kłótnia). Wyjątek to sny, które mogą się sprawdzić (decyzja 4). Dzięki temu nie wiadomo, czy ktoś naprawdę widział topielca, ale cała wieś i tak omija tę wodę po zmroku.

**Istoty, w które wierzą osadnicy:**

| Istota | Gdzie i kiedy | Co mówią ludzie | Co ludzie robią |
|---|---|---|---|
| Zmora (mara) | nocą, w chacie, w stajni i zagrodzie | siada na piersi i dusi, nie da się krzyknąć ani ruszyć ręką; nocą jeździ na koniach i kozach, rano są zmęczone i mokre, grzywy splecione w warkoczyki; zmorą bywa siódma córka | mak nad zwierzętami, miotła w zagrodzie, lustro, nóż pod poduszką, zatkana dziurka w drzwiach |
| Południca | upał, samo południe, miedza i pole w żniwa | kobieta w bieli z sierpem, zadaje pytania, kto nie odpowie albo śpi w słońcu na miedzy, tego zamroczy; wyrywa dzieci z zboża | w południe przerwa w cieniu, dzieci nie chodzą w zboże |
| Topielec (utopiec) | woda stojąca, bagna, stawy, nocą | dusza utopionego, ciągnie w głąb, topi bydło przy wodzie | nie kąpać się po zmroku i w święta, nie chodzić samemu nad wodę |
| Boginki, mamuny, dziwożona | przy wodzie, w gęstwinie; czas połogu | podmieniają niemowlęta na odmieńce, piorą nocą w rzece | czerwona wstążka na rączce dziecka, nie prać pieluch po zachodzie słońca, osłaniać dziecko od księżyca, dziurawiec w izbie, nie odwracać się od śpiącego dziecka |
| Płanetnik | burza, grad | dusza utopionego albo wisielca, kieruje chmurami, sprowadza grad; dobry płanetnik ostrzega przed burzą | mąka rzucana na wiatr albo w ogień, by go zjednać |
| Leszy (borowy) | bór, mgła | zwodzi w kółko, gwiżdże, śmieje się | wywinąć odzież na lewą stronę, zostawić coś na pniu |
| Błędne ogniki, błędnica | bagna, jesienne noce | dusze, które zwodzą wędrowców z drogi | nie iść za światłem, wracać tą samą drogą |
| Domowik, ubożę | przy palenisku | dba o dom, gdy go karmić; obrażony psoci i odchodzi | okruchy i mleko przy piecu, nie gwizdać w izbie |
| Licho, bieda | gdy choroba albo nieszczęście | „licho nie śpi” | zioła nad drzwiami, nie wywoływać licha po imieniu |
| Strzyga, upiór | rzadko, po złej śmierci | ktoś, kto urodził się z dwiema duszami albo z zębami | rzadki wątek, tylko w opowieściach starych |
| Wilkołak | zima, wilki pod osadą | ktoś przemienia się w wilka | opowieść przy ogniu, niepokój |
| Rusałki | zielone dni wiosny, nad wodą | dziewczęta zmarłe przed ślubem, tańczą i łaskoczą | nie kąpać się w zielony tydzień |

**Znaki i przesądy:**
- puszczyk woła „pójdź” na dachu: ktoś umrze;
- pies wyje nocą;
- kukułka: ile kuknie, tyle lat życia;
- bocian na dachu chroni przed pożarem;
- pierwszy grzmot wiosną: tarzać się po trawie na zdrowie;
- jaskółki nisko: deszcz;
- czerwony zachód: dobra pogoda;
- halo wokół księżyca: opady;
- obfita jarzębina: sroga zima;
- żaby rechoczą głośno: ładnie;
- mrówki chowają się: deszcz;
- splunąć przez lewe ramię na urok;
- nie wołać licha;
- nie przechodzić przez miedzę w południe.

Część znaków pogody jest już w grze (`SIGN` w `p_rok.js` i `p_pogoda.js`). Nowe zdania z nich korzystają i dopisują ludowe przysłowia.

**Zwyczaje doroczne** (rok gry ma 20 dni, więc mniejsze zwyczaje to krótkie sceny bez zgromadzenia, a duże obrzędy zostają jak są):
- Gromniczna pod koniec zimy: zapalona gromnica broni przed wilkami i piorunem, „gdy w Gromniczną z dachów ciecze, zima jeszcze się przewlecze”;
- Jare Gody i pierwsza orka, pierwszy grzmot;
- zielony tydzień (rusałki, majenie chat zielonymi gałęziami);
- Kupała (jest): kwiat paproci, którego szuka młodzież, wianki;
- dożynki (są);
- jesienne wróżby panien (lanie wosku, liczenie sztachet w płocie);
- Dziady (są);
- Szczodre Gody (są): wróżby z wieczerzy, puste miejsce;
- Marzanna (jest).

**Sny, które się sprawdzają:**
- Śni się pod wpływem prawdziwej przyszłości gry:
  - pogody na następne dni (gra zna prognozę);
  - narodzin (ktoś w rodzinie jest w ciąży);
  - nieszczęścia (ktoś ciężko chory albo bardzo stary);
  - burzy i sztormu, pożaru przy dużej suszy.
- Ludowe znaczenia snów:
  - woda czysta: zdrowie;
  - woda mętna: choroba;
  - wypadający ząb: śmierć kogoś bliskiego;
  - ryba: dziecko;
  - ogień: kłótnia albo pożar;
  - wesele we śnie: smutek;
  - pszczoły: zamożność;
  - koń: wieści.
- Marzyciel i zabobonni śnią częściej. Rano karta „Wczoraj” mówi, że sen się sprawdził, a Kronika to zapisuje. Sen, który się sprawdził, wzmacnia wiarę w sny.
- Sny są rzadkie, mniej więcej jeden na kilka nocy, żeby zostały znakiem, a nie szumem.

**Źródła (do treści i nazw):**
- [Południca (Wikipedia)](https://en.wikipedia.org/wiki/Lady_Midday)
- [Płanetnik (Wikipedia)](https://en.wikipedia.org/wiki/P%C5%82anetnik)
- [Topielec (Wikipedia)](https://en.wikipedia.org/wiki/Topielec)
- [Boginka (Wikipedia)](https://en.wikipedia.org/wiki/Boginka)
- [Dziwożona (Wikipedia)](https://en.wikipedia.org/wiki/Dziwo%C5%BCona)
- [Błędnica (Wikipedia)](https://en.wikipedia.org/wiki/B%C5%82%C4%99dnica_(Slavic_demoness))
- [Zmora, Słownik stereotypów i symboli ludowych (UMCS)](https://phavi.umcs.pl/at/attachments/2022/0402/223914-zmora-ii-sgl-tom-x.pdf)
- [Zmora/mara na Południowym Podlasiu (Studia Mythologica Slavica)](https://ojs.zrc-sazu.si/sms/article/view/10422)
- [Wieści pogodowe, przysłowia i znaki (KPODR)](https://www.kpodr.pl/wp-content/uploads/2021/02/Wiesci-pogodowe.pdf)
