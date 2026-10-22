# Przystań 4.9.0-rc.1: sylwetki rzemiosł

Podstawa: 4.8.0-rc.4 (`2b1ea38b676d74ebd61d2ff9cd1c8f17a58f7ad5`). To pierwsza paczka planu [budynki z charakterem](PROJEKT_BUDYNKI.md).

## Co się zmieniło
Wcześniej około 20 warsztatów stało na tej samej małej chatce. Teraz każdy z 22 budynków ma swój znak rozpoznawczy, ustawiony z przodu placu, od strony kamery. Chata jest na tyłach i nie zasłania pracy.

| Budynek | Wygląd |
|---|---|
| bednarnia | piramida beczek, słup z obręczami, klepki pod ścianą, wiata z niedokończoną beczką |
| browar | suszarnia słodu jak wieża z wywietrznikiem i dymem, miedziany kocioł nad żarem, kadzie, worki |
| słodownia | niska suszarnia z wywietrznikiem na kalenicy, murowany komin, rozsypane ziarno z grabiami |
| miodosytnia | regał z gąsiorami (szkło i glina), kadź miodu, kłody bartne |
| chata myśliwego | ramy z rozpiętymi skórami, suszona zwierzyna, poroże na szczycie, oszczepy |
| chata drwala | dwa sągi, kozioł z kłodą, pień z wbitą siekierą, ścięty pień, wióry |
| leśniczówka | szkółka: sadzonki trzech wielkości za płotkiem z plecionki, drzewko z bryłą korzeni |
| chata ptaszników | gołębnik na słupie, rozpięte sieci, klatki |
| kamieniołom | drewniany żuraw na trzech nogach z blokiem, ociosane bloki, ława kamieniarza, odłamki |
| wykop rudy | kołowrót nad szybem pod daszkiem, rude hałdy, taczka z rudą |
| glinianka | wykop gliny z kałużą, kopiec z łopatą, surówka na deskach |
| żarna | okrągła wiata na sześciu słupach ze stożkowym dachem, kamienie żarnowe, worki |
| serownia | regał z kręgami sera pod daszkiem, prasa z kamieniem, konwie mleka |
| izba nauki | ławy na podwórzu, tablica na sztalugach, klepadło |
| warsztat | wielka osełka na kole z korytem, stojak z narzędziami, ława z imadłem |
| pracownia cieśli | dół traczy: kłoda na wysokich kozłach i piła, trociny, stosy desek z przekładkami |
| garncarnia | kopulasty piec z żarem i dymem, regał z garnkami, koło garncarskie pod okapem |
| winiarnia | tłocznia z belką, beczki na legarach, kosze winogron |
| szwalnia | krosno pod okapem, czerwone, niebieskie i żółte płótna na sznurze, kołowrotek |
| kurnik | kurnik na palach z drabinką i gniazdami, wybieg z plecionki z furtką, grzędy, koryto, kury |
| barć | pięć wysokich kłód bartnych z daszkami i wlotami, pszczelnik ze słomiankami, kwiaty, dymiarka |
| mielerz | kopiec z łatami darni, dymniki, żar u podstawy, drabina, węgiel, sąg, szałas węglarza |

Epoka IV korzysta z nowego kurnika, a tartak z dołu traczy.

## Co zostało bez zmian
Wykonanie (surowe, porządne, mistrzowskie), kolory ścian, koniki, szyldy i płotki działają na nowych modelach tak samo jak wcześniej.

## Wydajność
- Wioska z epoki II: 1167 wywołań rysowania (wcześniej 1171), trójkąty +1,6%.
- Budynek ma od 850 do 2800 trójkątów.
- Gotowe budynki nadal są łączone w bryły według materiału.
- `?oldbld` w adresie pokazuje stare modele, do porównania.

## Testy
`tests/warsztaty.test.mjs` sprawdza:
- czy modele powstają na każdym poziomie i każdej grafice w budżecie trójkątów;
- czy mieszczą się na placu;
- czy żadne dwa nie są takie same;
- czy epoka IV używa nowych modeli.
