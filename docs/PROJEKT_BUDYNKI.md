# Projekt: budynki z charakterem (4.9)

## Stan obecny (przegląd 73 budynków, 4.8.0-rc.4)

**Co wiadomo o budynkach dziś:**
- Około 20 warsztatów stoi na tej samej małej chatce z dwuspadowym dachem. Chodzi o bednarnię, miodosytnię, chatę myśliwego, pracownię, chatę drwala, izbę nauki, kamieniołom, leśniczówkę, chatę ptaszników, serownię, warsztat, wykop rudy, gliniankę, żarna, garncarnię, winiarnię, słodownię i browar. Różnią się tylko drobiazgami przy ścianie, więc z odległości gry trudno je rozpoznać.
- Poziomy 2 i 3 dokładają jedynie przybudówkę ze skrzynią i chorągiewkę.
- Budynki „wielkie” (dwór rodu, dom cechowy, zajazd, browar, szpital) są niewiele większe od chaty.
- Budynek słabo pokazuje, czy ktoś w nim pracuje i co powstaje.

**Budżet wydajności:**
- Budynek ma średnio około 1800 trójkątów: najprostszy piec 340, dom 4800.
- Cała klatka wioski z epoki II to około 930 tys. trójkątów i 1250 wywołań rysowania. Większość przypada na trawę i drzewa.
- Gotowe budynki są już łączone w bryły według materiału, więc dodatkowe detale nie zwiększają liczby wywołań rysowania.

## Pomysł: pięć warstw, każda osobno wydawana

### A. Sylwetka rzemiosła
Każdy budynek dostaje jeden duży znak rozpoznawczy, widoczny z daleka, oraz układ podwórza właściwy dla swojej pracy:

| Budynek | Znak rozpoznawczy |
|---|---|
| kuźnia | otwarte palenisko pod daszkiem, kowadło na pniu, miech, koryto do hartowania, podkowy na ścianie |
| garncarnia | kopulasty piec, regały z suszącymi się garnkami, koło garncarskie pod okapem |
| bednarnia | piramida beczek, klepki w kozłach, obręcze, dół do giętej klepki |
| browar, słodownia | wysoka suszarnia słodu z wywietrznikiem, kadzie, worki |
| miodosytnia, barć | regał z gąsiorami, kadź miodu, ule kłodowe obok |
| myśliwy | ramy do suszenia skór, poroże nad drzwiami, wieszak na zwierzynę |
| drwal, drewutnia | sągi, pień z siekierą, kozioł do piłowania |
| leśniczówka | grządki sadzonek za płotkiem, konewki |
| ptasznik | gołębnik na słupie, rozpięte sieci |
| kamieniołom, łom | bloki kamienia, drewniany żuraw, ława kamieniarza |
| ruda, kopalnia, szyb | wieża szybowa z kołem, hałdy, wózek na torze z bali |
| żarna, wiatrak | żarna pod zadaszeniem, worki; skrzydła wiatraka obracają się z wiatrem |
| serownia | półki z serami, prasa, cebrzyk |
| izba nauki | ławy przed wejściem, tablica, liczydło |
| zielarka, szpital | sznury z suszonymi ziołami, grządki ziół |
| szwalnia | krosno pod okapem, płótno na płocie |
| warsztat, pracownia | warsztat z belką, tokarnia, wióry |
| winiarnia, winnica | prasa do wina, beczki, kosze winogron |

Budynki wielkie (dwór, dom cechowy, zajazd, browar, szpital) dostają:
- plan w kształcie litery L albo z podwórzem;
- ganek na słupach i rzeźbione szczyty;
- ogrodzone podwórze i szyld.

### B. Widoczna rozbudowa (poziomy 1–3)
- Poziom 1: jedna izba i proste podwórze.
- Poziom 2: skrzydło albo szopa robocza z własnymi sprzętami. Pracy jest widocznie więcej.
- Poziom 3: pełne zagospodarowane podwórze z płotem, drugi dach, zdobienia i lepsze wykończenie.

Istniejące dobudówki (EXT) pozostają i są dokładane na wierzch.

### C. Styl epoki
- **I:** kora, plecionka, strzecha i surowe bale.
- **II:** ciosane bale, deski, gont, malowane okiennice.
- **III:** mur pruski, tynk, cegła, dachówka, murowane kominy.
- **IV:** dworskie i folwarczne: gonty z wywiniętym okapem, ganki, bramy.

### D. Życie budynku
- Dym z komina tylko wtedy, gdy ktoś pracuje.
- Palenisko kuźni żarzy się przy pracy.
- Drzwi są otwarte, gdy w środku ktoś jest.
- Nocą w oknach pali się światło.
- Przy budynku rosną stosy tego, co powstaje.
- Zimą na dachu leży śnieg.

### E. Różnorodność egzemplarzy
- Każdy budynek ma inny spadek dachu, stronę ganku i kolor okiennic.
- Zdobienia pochodzą ze słowiańskiego zestawu: koziołki na szczycie, słoneczka, rozety, wycinane nadokienniki.
- Dwie chaty obok siebie nigdy nie są identyczne.

## Wydajność i bateria
- Do 3–4 tys. trójkątów na budynek z bliska. Z daleka drobiazgi znikają, bo LOD działa tak jak przy trawie.
- Wszystko łączone według materiału, więc liczba wywołań rysowania nie rośnie.
- Najwyżej 2–3 nowe małe faktury po 128 px.
- Animacje (skrzydła wiatraka, koło wodne, dym, żar) działają tylko na grafice średniej i wysokiej. Zatrzymują się, gdy budynku nie widać.
- Pomiar FPS i trójkątów przed i po na każdym poziomie grafiki.
