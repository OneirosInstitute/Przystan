# Przystań 4.8.0-rc.2 — Wydarzenia, wierzenia i czas wolny

Baza: main 4.8.0-rc.1 `d008975`. Drugie i trzecie wydanie planu [Życie osadników](PROJEKT_ZYCIE_OSADNIKOW.md) w jednym, żeby szybciej trafiło do gry: małe sceny i nowe wydarzenia (`p_sceny.js`) oraz SI czasu wolnego (`p_wolny.js`).

## Małe sceny z życia (`p_sceny.js`)

Mniej więcej raz na dobę coś się dzieje bez zatrzymywania gry: linijka w dymku nad człowiekiem (przez kilka sekund, tylko gdy widać go na ekranie) i wpis w Kronice. Każda scena zostawia ślad w pamięci i w relacjach, więc wieczorem przy ogniu ktoś do niej wraca.

- **Dzieci i rodzina:** pierwsze słowo, pierwszy ząbek, szałas w zagajniku, nauka pływania, podebrany miód, zjazd z górki na korze, opowieści starych na progu.
- **Ludzie:**
  - imieniny (każdy ma swój dzień w roku);
  - zaloty;
  - kłótnia przy studni;
  - zgoda (często za sprawą kogoś łagodnego);
  - dar od przyjaciela;
  - śpiew przy pracy, zakład kowala z cieślą;
  - zgubiony nóż za pasem;
  - kąpiel w zatoce.
- **Przyroda:**
  - powrót bocianów, pierwszy śnieg, jarzębina na srogą zimę;
  - łoś we wsi, rój pszczół na płocie;
  - grzybobranie po deszczu;
  - bursztyn na plaży, beczka po sztormie, wieloryb na mieliźnie.
- **Wierzenia i zjawy** (to, co ludzie twierdzą, że widzieli; skutki przez ich strach i zabiegi):
  - południca na miedzy w południe;
  - topielec przy stawie;
  - zmora, która siada na piersi (rano mak i miotła w zagrodzie albo nóż pod poduszką);
  - boginki przy połogu (czerwona wstążka i dziurawiec);
  - błędne ogniki nad mokradłem;
  - leszy, który wodzi w kółko (kaftan na lewą stronę, placek na pniu);
  - płanetnik w burzę (mąka na wiatr);
  - domowik za piecem (miseczka mleka);
  - puszczyk na dachu, wilkołak w pełnię, kukułka, która liczy lata.
- **Zwyczaje:** pierwszy grzmot (tarzanie się w trawie), kwiat paproci w noc Kupały, jesienne wróżby panien z wosku, Gromniczna, zielony tydzień (majenie chat i rusałki).
- **Losowanie:** kategorie się zmieniają (po kłótni przez jakiś czas nie przychodzi kolejna), każda scena ma swój czas odnowienia, a sceny nocne zdarzają się nocą, południowe w południe.

## Nowe wydarzenia z wyborem

- **Zaloty:** starsi z rodziny nie chcą zgody na ślub. Do wyboru: wiec błogosławi, młodzi czekają rok albo rodziny siadają przy ogniu.
- **Tęsknota:** ktoś chce wypatrywać statku z cypla. Do wyboru: puścić, iść razem z nim albo zatrzymać przy pracy.
- **Ostatnia opowieść:** stary człowiek prosi całą wieś do ognia. Powstaje pieśń.
- **Lepkie palce:** dzieci podbierały miód. Do wyboru: praca przy barci, śmiech albo kara.
- **Zmora w zagrodzie:** do wyboru mak, miotła i lustro albo czuwanie. Przy czuwaniu wychodzi na jaw kuna.
- **Kąpiel po zmroku:** dzieci chcą do wody, a matka boi się topielca.
- **Żniwa w upale:** odpoczynek w południe, bo chodzi południca, albo żęcie bez przerwy z ryzykiem udaru.
- **Sen, który ostrzega** (sny mogą się sprawdzać): zapowiedziana pogoda przychodzi naprawdę. Kto posłuchał snu, ma bezpieczne łodzie i zapasy, a kto go wyśmiał, traci część jedzenia.
- **Od epoki II:** grajek z przysiółka i swaty z przysiółka (wesele i nowa osoba w osadzie).
- **Od epoki III:** plotki woźniców o światłach w nieodkrytej krainie.
- **Wszystkie wydarzenia:** gdy przyszło jedno jakiegoś rodzaju, przez jakiś czas przychodzą inne (`storyTick`).

## SI czasu wolnego (`p_wolny.js`)

- **Wieczór po swojemu:** zamiast ogniska albo ławki przed domem, w zależności od usposobienia i upodobań:
  - odwiedziny u przyjaciela albo u rodziny (siedzą razem przed jego chatą);
  - ulubione miejsce: morze, skraj lasu, miedza, wzgórze;
  - święty gaj (bogobojni i zabobonni);
  - połów z brzegu na kolację (trochę ryb);
  - ogród przy chacie (gospodarni).

  Żałoba prowadzi na mogiłę bliskiej osoby. Kto ma zwaśnionego przy ogniu, zostaje przed swoim domem. W złą pogodę i zimą częściej zostaje się przy ogniu. Opisy w karcie osoby: „idzie w odwiedziny do Radosława”, „siedzi ze Stasiem przed jego chatą”.
- **Rozmowy w drodze:** przyjaciele, którzy mijają się na ścieżce, przystają na chwilę rozmowy i zwracają się do siebie. Więź trochę rośnie. Ta sama osoba nie przystaje częściej niż raz na kilka godzin gry.
- **Wspólny wieczór zbliża:** goście i gospodarze, ludzie przy jednym ogniu.
- **Burza i wilki:** dzieci i ci, którzy boją się burzy albo wilków, biegną do chat i tam przeczekują.
- **Praca, którą się lubi** (decyzja 3: SI sama): kto przez kilka dni robi pracę, której nie lubi, zamienia się z kimś, kto lubianą przez niego pracę wykonuje równie dobrze. Obsada budynków się nie zmienia, a zamiana jest w Kronice.
- **Wydajność:** wybór zajęcia liczy się tylko wtedy, gdy ktoś szuka wieczornego miejsca. Rozmowy w drodze sprawdzają sąsiadów najwyżej raz na sekundę gry dla osoby w ruchu.

## Testy

- `sceny` (4 przypadki):
  - sceny przychodzą, są różne i zostają w pamięci;
  - każda scena i każde nowe wydarzenie działa dla kobiet i mężczyzn, bez pustych miejsc w tekście;
  - sen posłuchany i wyśmiany;
  - kategorie wydarzeń się zmieniają.
- `wolny` (4 przypadki):
  - wieczory na różne sposoby;
  - odmiana imion („z Dobrawą”, „ze Stasiem”, „z Mirkiem”);
  - rozmowa w drodze i dzieci w burzy;
  - zamiana pracy bez zmiany obsady.
- Pełna bramka i kontrola w przeglądarce.
