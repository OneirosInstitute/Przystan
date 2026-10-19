# Przystań — projekt wyspy, złóż, folwarków, gospodarki i menu

Data: 19 października 2026. Baza: 4.0.0-rc.10 (`2729bba`) i RC11.
Status: projekt docelowy. Część „Wdrożone w RC11” opisuje, co już działa. Reszta to plan kolejnych wydań.

## 0. Zasady, które obowiązują wszystko poniżej

1. **Realizm przed wygodą.** Każda rzecz w grze ma przyczynę widoczną w świecie. Ogień pod strzechą potrzebuje okapu i dymnika. Ruda leży tam, gdzie jest złoże, a nie w każdej krainie po trochu. Towar jedzie drogą albo łodzią i ktoś go wiezie.
2. **Czytelna logika.** Gracz zawsze wie, dlaczego coś stoi. Każda blokada ma przyczynę i wskazanie miejsca na mapie („brak kamienia w składzie”, „nikt nie jest budowniczym”, „szyb zalany”).
3. **Ludzie robią to, co widać.** Produkcja, budowa i transport wynikają z pracy konkretnych osób w konkretnych miejscach. Nie ma nagród za sam zamiar pracy.
4. **Telefon to wzorzec.** Nowe systemy liczą się raz na dobę albo na zdarzenie, nie w każdej klatce. Rzeczy daleko od kamery nie są aktualizowane. Pomiar baterii i FPS na fizycznym telefonie jest częścią odbioru.
5. **Stare zapisy działają dalej.** Każda zmiana ma migrację. Osada z RC10 wczytuje się bez utraty ludzi, budynków ani postępu.

## 1. Wdrożone w RC11

| Obszar | Co działa |
|---|---|
| Zatory | Ludzie ustępują sobie bez zakleszczeń. Z dwóch czekających ustępuje jeden, ostatnie kroki do celu nie czekają na tłum, a kto czeka ponad 2 s, przeciska się. Ekipa wraku rozkłada się na kilka stanowisk. Test `crowd-flow` gra pół pierwszego dnia i pilnuje, żeby osada pracowała. |
| Drogi | Ścieżki wydeptują się same z ruchu ludzi i dają +10% szybkości. Budowa → Drogi: wybierasz nawierzchnię (ścieżka utwardzona, droga kamienna, bruk), dotykasz budynku albo wydeptanego śladu. Trasa biegnie od najbliższej drogi albo od obozu po śladach ludzi. Podgląd pokazuje długość, koszt i czas. Układają budowniczowie, kafel po kaflu, a kamień schodzi ze składu przy każdym kaflu. |
| Domy | Rozbudowa szałasu i chaty zawsze ma przycisk. Gdy nie można, przycisk jest wyłączony, a lista ✓/✗ mówi, czego brakuje: wiedzy, miejsca, każdego materiału z osobna. Karta domu pokazuje spiżarkę (porcje i dni), ciepło, ubrania i zdrowie rodziny. |
| Wiata | Nad paleniskiem jest gliniany okap i komin z dymnikiem ponad strzechą. Dym wychodzi kominem. |
| Zorza | Zorza jest przypięta do świata: zielona poświata na ziemi, śniegu i morzu oraz fałdowane kurtyny nad morzem za wyspą. Nigdy nie zasłania lądu i nie pływa z kamerą. |
| Zadania główne | Po trzy na epokę, na górze zakładki Zadania. Epoka idzie dalej dopiero po ich wykonaniu (wiec pokoleń, koniec epoki II, koniec epoki III, wejście w epokę IV). Wątek: ogień na cyplu i światło na zachodzie, przybysz z Wysp Kręgu i zimny rok, rejs na zachód i ognie na wzgórzach. Wyprawy zadań można pokazać i śledzić. |

### Wdrożone w 4.1.0-rc.1

| Obszar | Co działa |
|---|---|
| Złoża | Węgiel, torf, ruda, kamień i glina w dużych złożach z warstwami (płytka, głębsza, najgłębsza). Po dwa złoża rudy, kamienia i gliny na każdej wyspie, z ziarna wyspy, daleko od siebie i od obozu. Złoże rozpoznaje ten, kto do niego dojdzie. |
| Wydobycie | Kopalnia rudy, szyb węglowy, łom kamienia i gliniak stoją na złożu i czerpią z warstw, do których sięgają. Odkrywka bierze tylko płytką warstwę węgla, szyb głębsze. Po wyczerpaniu ludzie przestają pracować, a kronika podpowiada szyb. |
| Widok | Paliki w kolorze surowca wokół odkrytego złoża, karta z paskami warstw i przyciskami budowli. |

### Wdrożone w 4.2.0-rc.1

| Obszar | Co działa |
|---|---|
| Menu | Pięć działów: Osada (Przegląd, Kronika, Opcje), Ludzie (Praca, Mieszkańcy), Budowa, Zadania (Zadania, Wyprawy), Wiedza (Wiedza, Natura). Pod działami najwyżej jeden rząd. Dział pamięta ostatni widok. |
| Budowa | Wyszukiwarka i lista rozwijana rodzajów z liczbami, na początku „Możesz postawić teraz”. |

## 2. Wyspa: jedna, większa, odkrywana stopniowo

### 2.1 Rozmiar

Dziś epoki I–III grają na rdzeniu 192×192, a epoka IV dokleja do niego zewnętrzny pierścień (384×384). Docelowo jest **jedna wyspa 384×384 od pierwszego dnia**, ale:

- start i epoka I dzieją się w rdzeniu, a reszta wyspy leży pod mgłą;
- zewnętrzne krainy odsłaniają zwiadowcy i wyprawy od epoki I. Osadzać się tam można od epoki II (przysiółki), a w pełni od III;
- wydajność: teren dzielimy na sektory 32×32. Szczegółowy model (drzewa, krzewy, detale) mają tylko sektory odkryte i bliskie kamerze. Dalekie sektory to uproszczona siatka bez detali. Na słabym telefonie szczegółowy promień jest mniejszy.

Odległości w rdzeniu się nie zmieniają, więc stare zapisy i budynki zostają na miejscu. Nowe zapisy dostają wersję generatora (`worldVersion: 2`), a stare przechodzą migrację do pierścienia tak jak dziś przy wejściu w epokę IV.

### 2.2 Krainy z charakterem

Krainę (sektor albo zlewnię) opisują liczby: żyzność, wilgotność, nasłonecznienie, wiatr, wysokość, las. Z nich wynika **charakter**, czyli jedna z dziesięciu ról. Każdy seed musi mieć każdą rolę co najmniej raz w zasięgu lądowym.

| Charakter | Co daje | Czym płaci | Wygląd |
|---|---|---|---|
| Żyzne Niziny | Zboże, warzywa, len, pastwiska; pola dają +30% | Powodzie przy rzece, chwasty, wyjałowienie bez odłogu | Ciemna ziemia, pola, wierzby |
| Słoneczne Stoki | Winnice, sady, zioła słoneczne | Przymrozki wiosną, erozja bez tarasów | Tarasy, jasna trawa |
| Kwietne Łąki | Pożytek pszczeli (barcie, pasieki), siano, zioła | Susza latem, wypas niszczy kwiaty | Kolorowe łąki, rzadkie drzewa |
| Stare Bory | Drewno budulcowe, smoła, grzyby, zwierzyna | Wolny odrost, wilki, gubienie drogi | Gęste sosny i świerki |
| Grąd i Dąbrowa | Dąb na łodzie i belki, żołędzie dla świń, bartnictwo | Wycinka niszczy barcie | Dęby, lipy, polany |
| Kamienna Grań | Kamień, łupek, granit na bruk | Mało jedzenia, mróz, trudny transport | Skały, piarg, kosodrzewina |
| Zagłębie | Węgiel kamienny, ruda żelaza (jedno duże złoże) | Woda w szybach, choroby górników, hałdy | Hałdy, szyby, kierat, czarne ścieżki |
| Mokradła | Torf, ruda darniowa, trzcina, ptactwo | Gorączka bagienna, grząskie drogi bez grobli | Trzciny, oczka wodne, kładki |
| Gliniska nad rzeką | Glina garncarska i ceglana, wiklina, młyn wodny | Wylewy, błoto | Brzegi, gliniaki, piece |
| Wybrzeże i Zatoki | Ryby, sól z warzelni, bursztyn, port | Sztormy, zasolenie pól, wiatr | Plaże, wydmy, pomosty |

Rola krainy jest widoczna w jej nazwie na mapie (np. „Zagłębie pod Wronią Granią”) i na karcie krainy. Zwiad pokazuje ją od razu, a złoża dopiero po poszukiwaniach (rozdz. 3.3).

## 3. Złoża: skupione, duże, skończone

### 3.1 Dlaczego zmiana

Dziś ruda i kamień są rozsiane po całej wyspie drobnymi węzłami, a w epoce IV każda kraina ma trochę „rudy”. To nie pozwala na górnicze zagłębie ani na prawdziwą specjalizację folwarków. Docelowo surowce kopalne leżą w **złożach**: kilku dużych, nazwanych miejscach.

### 3.2 Model złoża

```
złoże {
  id, nazwa,                // „Czarne Pole”, „Rudne Wzgórze”
  surowiec,                 // wegiel_k | ruda | kamien | glina | torf | sol | bursztyn | ruda_d (darniowa)
  środek (i,j), kształt,    // elipsa 6–20 pól, obrócona
  warstwy: [                 // od płytkiej do głębokiej
    {głębokość:1, zasób:1200, jakość:.7},  // odkrywka albo płytki szyb
    {głębokość:2, zasób:4000, jakość:.9},  // szyb z kieratem
    {głębokość:3, zasób:9000, jakość:1.0}  // głęboki szyb z odwadnianiem (epoka III+)
  ],
  wydobyto, odkryte:0|1|2   // 0 nieznane, 1 podejrzewane (ślady), 2 rozpoznane (wiemy, gdzie i ile)
}
```

Liczba złóż na seed:

| Surowiec | Złoża | Wielkość łączna (porcje) | Uwagi |
|---|---|---|---|
| Węgiel kamienny | 1 (Zagłębie), czasem 2 | 10–15 tys. | Zastępuje węgiel drzewny w hutach od epoki III |
| Ruda żelaza (skalna) | 1–2 | 8–12 tys. | W Zagłębiu albo na Grani |
| Ruda darniowa | 2–3 (mokradła) | 1–2 tys. każde | Odnawia się bardzo wolno, płytka |
| Kamień budowlany | 3–4 kamieniołomy | praktycznie bez dna | Jakość: łupek, wapień, granit (bruk) |
| Glina | 2–3 gliniska | 3–6 tys. | Nad rzeką; garncarska i ceglana |
| Torf | 2–3 torfowiska | 2–5 tys. | Opał bez wycinki lasu |
| Sól | 1 solanka na wybrzeżu | odnawialna | Warzelnia potrzebuje opału |
| Bursztyn | 1–2 plaże | rzadki | Handel, ozdoby, mir |

Drobne węzły (kamienie polne, glina przy strumieniu) zostają na start epoki I, żeby rozbitkowie mieli z czego budować. Wyczerpują się jednak i nie odrastają. Od epoki II osada musi sięgać do złóż.

### 3.3 Odkrywanie

1. **Ślady**: zwiad widzi „czarne kamienie w strumieniu”, „rdzawą wodę”, „białą glinę”, a złoże dostaje stan `odkryte=1`.
2. **Poszukiwania** (zadanie budynku, jak wyprawa po kozę): kamieniarz albo górnik idzie z kilofem, kopie próbne doły przez 1–2 dni i wraca z wynikiem. Złoże dostaje stan `odkryte=2`, a na mapie pojawia się jego zarys, warstwy i szacunek wielkości.
3. Wiedza „Górnictwo” (Wiedza → Rzemiosło) odblokowuje szyb. Bez niej da się tylko kopać odkrywkę.

### 3.4 Wydobycie: budynki na złożu, nie cały folwark

Kopalnię tworzy kilka małych budynków stawianych **wewnątrz zarysu złoża**:

| Budynek | Warstwa | Pracownicy | Uwagi |
|---|---|---|---|
| Odkrywka / wyrobisko | 1 | 2–4 | Tanio, powoli zjada teren (dziura w ziemi zostaje) |
| Szyb z kieratem | 2 | 3 + koń albo wół | Potrzebuje drewna na obudowę co rok |
| Głęboki szyb z odwadnianiem | 3 | 4–6 | Pompa na kieracie albo wiatraku, ryzyko zalania |
| Hałda | — | — | Rośnie z urobkiem; zajmuje teren, później rekultywacja |
| Sztygarówka (skład przy kopalni) | — | 1 | Urobek czeka tu na wóz |

Wydobycie zużywa zasób warstwy. Gdy płytka warstwa się kończy, gracz dostaje ostrzeżenie z wyprzedzeniem („zostało na ok. 2 lata”) i decyzję: głębszy szyb albo nowe złoże.

## 4. Folwarki: specjalizacja z miejsca

Folwark wyrasta z domu rodowego (epoka IV), a jego kierunek wynika z charakteru krainy i bliskich złóż. **Folwark nie stoi na złożu.** Stoi obok, a do złoża jego ludzie chodzą albo jeżdżą drogą.

| Folwark | Gdzie | Rdzeń zabudowy | Na złożu / w terenie | Potrzebuje z zewnątrz |
|---|---|---|---|---|
| Górniczo-hutniczy | Zagłębie | Dom rodowy, czeladnia, kuźnia, dymarka → wielki piec | Szyby, hałdy, sztygarówka | Jedzenia, drewna na obudowy, zwierząt pociągowych |
| Rolniczy z młynem | Żyzne Niziny | Dom, stodoła, spichlerz, młyn | Pola w trójpolówce | Narzędzi, soli |
| Winiarski | Słoneczne Stoki | Dom, tłocznia, piwnica | Winnice na tarasach | Beczek (bednarz), szkła albo glinianych dzbanów |
| Pszczelarsko-sadowniczy | Kwietne Łąki, Grąd | Dom, pracownia wosku, miodosytnia | Barcie w lesie, ule na łące, sady | Zboża, ochrony łąk przed wypasem |
| Leśny i smolarski | Stare Bory | Dom, tartak, smolarnia, mielerz | Zręby i szkółki | Jedzenia |
| Garncarsko-ceglarski | Gliniska | Dom, warsztat, piec do wypału | Gliniak | Opału (torf albo węgiel) |
| Torfowo-rudny | Mokradła | Dom na grobli, suszarnia torfu, dymarka | Kopanki torfu, ruda darniowa | Zboża, drewna |
| Rybacko-solny | Wybrzeże | Dom, wędzarnia, warzelnia, przystań | Łowiska, solanka | Opału, beczek |
| Kamieniarski | Grań | Dom, warsztat kamieniarski | Kamieniołom | Jedzenia; daje bruk dla całej wyspy |

Specjalizacja nie zamyka innych dróg. Każdy folwark i tak ma ogród, zwierzęta i zapasy na zimę, ale główny dochód i nadwyżka pochodzą z jego roli.

## 5. Gospodarka: łańcuchy, transport, rezerwy

### 5.1 Łańcuchy

Każdy łańcuch ma pełny bilans: wejście → praca → czas → miejsce → produkt → straty. Najważniejsze nowe łańcuchy:

- **żelazo**: ruda + węgiel (drzewny albo kamienny) → dymarka / piec → łupa → kuźnia → narzędzia, gwoździe, okucia;
- **bruk**: kamień z Grani → kamieniarz → kostka → drogi brukowane i rynek;
- **cegła**: glina + opał → wypał → cegły → domy z piecem, kominy, ratusz;
- **sól**: solanka + opał → warzelnia → sól → solenie mięsa i ryb (zapas na zimę), handel;
- **miód i wosk**: barć / ul na kwietnej łące → miód, wosk → miód pitny, świece (światło w domach zimą).

### 5.2 Transport

- Towar ma miejsce i stan: w składzie, zarezerwowany, w drodze, dostarczony (to już działa w epoce IV i trzeba to przenieść do epok I–III).
- **Nawierzchnia ma znaczenie.** Wóz po wydeptanej ścieżce wiezie 4 porcje i jedzie wolno. Po drodze kamiennej wiezie 8 porcji o 30% szybciej, a po bruku 12 porcji o 40% szybciej. Bez drogi do Zagłębia wielki piec stoi.
- Drogi się zużywają. Nieużywana ścieżka zarasta (to już działa), a droga kamienna co kilka lat potrzebuje naprawy. Remonty dróg robią budowniczowie razem z remontami budynków.
- Brody i kładki, a później mosty, są osobnymi budowlami na rzekach.

### 5.3 Rezerwy i decyzje gracza

Gracz ustala rezerwy (np. „zostaw 200 porcji jedzenia w Przystani”), kierunek folwarku i duże inwestycje: szyb, most, wielki piec. Codzienną pracę wykonują ludzie sami.

## 6. Społeczność

- **Potrzeby**: jedzenie (różnorodne), ciepło, dach, zdrowie, wspólnota (wieczory, święta), sens (fach, mistrzostwo, pamięć). Brak potrzeby ma widoczny skutek i przyczynę na karcie osoby.
- **Ród i fach**: górnik rodzi górnika, ale dziecko może wybrać fach po matce, mistrzu albo z potrzeby wspólnoty. Fach z kopalni (sztygar) wymaga lat praktyki.
- **Napięcia**: Zagłębie brudzi wodę w dole rzeki, wypas niszczy kwietne łąki, wycinka zabiera barcie. To spory dla rady z decyzją i konsekwencją, a nie losowe zdarzenia.
- **Wędrówki**: młode rodziny idą tam, gdzie jest praca i ziemia. Folwark górniczy przyciąga ludzi, gdy płaci jedzeniem, a traci ich, gdy głoduje.

## 7. Menu: jeden projekt

### 7.1 Problem

W RC10 jest dziewięć zakładek w poziomym pasku (Ludzie, Praca, Budowa, Zadania, Wyprawy, Wiedza, Natura, Kronika, Osada), a pod nimi drugi i trzeci rząd kategorii. Na telefonie pasek się przewija, kategorie zajmują pół ekranu, a karty budynków są różnie zbudowane.

### 7.2 Architektura

Pięć sekcji. Każda ma tę samą budowę: nagłówek z liczbami, filtr, lista kart, karta rozwinięta w miejscu.

| Sekcja | Zawiera (dzisiejsze zakładki) | Pierwsza rzecz na ekranie |
|---|---|---|
| **Osada** | Przegląd, Zapasy z bilansem, kłopoty, rada | „Co wymaga uwagi”: 1–3 najważniejsze sprawy z przyciskiem działania |
| **Ludzie** | Ludzie, Praca, rodziny, rody | Przydział pracy jako suwaki z liczbą ludzi, potem lista osób |
| **Budowa** | Budowa, Drogi, Ład wsi, Remonty | Wyszukiwarka i „Możesz postawić teraz”, kategorie jako jedna lista rozwijana |
| **Zadania** | Zadania główne, cele aktu, prośby, budowy w toku, wyprawy, drogi | Zadania główne epoki, potem bieżące sprawy |
| **Wiedza** | Wiedza, Natura, Kronika, Księga | Najbliższe odkrycie i co do niego prowadzi |

### 7.3 Zasady wzornika

- Jedna karta na rzecz. Ten sam układ wszędzie: tytuł, stan, jedno zdanie opisu, wymagania ✓/✗, jeden główny przycisk i „Pokaż na mapie”.
- Przycisk zawsze jest. Gdy akcji nie da się wykonać, przycisk jest wyłączony, a obok widać, czego brakuje.
- Stan rozwinięcia, filtr i przewinięcie zostają zapamiętane przy odświeżaniu liczb.
- Wyszukiwarka w Budowie i w Ludziach (po nazwie i fachu).
- Maksymalnie dwa poziomy nawigacji: sekcja, a potem filtr. Nigdy trzy rzędy przycisków.
- Liczby z jednostką i znakiem (+/−), kolor nigdy nie jest jedynym nośnikiem znaczenia.
- Dotyk: cele co najmniej 44 px, panel zamyka się gestem w dół, a górna krawędź panelu nie zasłania celu (podgląd zostaje widoczny).

## 8. Realizm: lista kontrolna

| Rzecz | Stan | Zasada |
|---|---|---|
| Ogień pod dachem | RC11: okap i dymnik w wiacie | Każde palenisko pod dachem ma komin albo dymnik |
| Domy | do sprawdzenia | Dom z piecem ma komin murowany; szałas nie ma pieca |
| Kuźnia, piekarnia, wędzarnia | do sprawdzenia | Komin, osobno stojący przez ryzyko pożaru |
| Kopalnie | projekt | Obudowa drewniana zużywa się co rok; woda w szybie |
| Drogi | RC11 | Nawierzchnia z materiału i pracy; zarasta bez ruchu |
| Pory roku | jest | Zimą nie ma budowy dróg ani odkrywki (ziemia zamarznięta) |

## 9. Plan wdrożenia

| Wydanie | Zakres | Odbiór |
|---|---|---|
| **RC11** | Zatory, drogi z wydeptywania, karta rozbudowy domów, dymnik, zorza w świecie, zadania główne | Testy RC10 + `crowd-flow`, próby w przeglądarce, telefon |
| **4.1 Złoża** (rc.1 wdrożone: złoża z warstwami, odkrywanie, kopalnia, szyb, łom, gliniak, wyczerpywanie; zostają charaktery krain, poszukiwania i hałdy) | Charaktery krain w rdzeniu 192, złoża skupione z warstwami, ślady i poszukiwania, odkrywka i szyb, hałdy, wyczerpywanie | Każdy seed ma komplet złóż w zasięgu; symulacja 20 lat bez braku kamienia i rudy przy rozsądnej grze |
| **4.2 Menu** (rc.1 wdrożone: pięć działów, widoki, wyszukiwarka i „teraz” w Budowie; zostaje wyszukiwarka w Ludziach i wspólny wzornik karty) | Pięć sekcji, wzornik karty, wyszukiwarka, Zapasy w Osadzie | Test na 360×740 i 768×352; brak trzech rzędów przycisków |
| **4.3 Wyspa 384** | Jedna wyspa od startu, sektory i poziomy szczegółów, krainy zewnętrzne, przysiółki w pierścieniu od epoki II | FPS i bateria na telefonie nie gorsze niż RC11 w rdzeniu |
| **4.4 Folwarki ze złóż** | Specjalizacja folwarku z charakteru krainy i złoża, wozy zależne od nawierzchni, napięcia (woda, łąki, barcie) | Pięć pokoleń autonomii bez sztucznych dopisków zasobów |

Każde wydanie kończy się kompletem testów, próbą w przeglądarce z WebGL (zatory, produkcja pierwszego dnia, zrzuty) i krótką listą do sprawdzenia na telefonie.
