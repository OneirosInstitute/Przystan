# Przystań 4.9.0-rc.7: wielkie budynki na własnym placu

Podstawa: 4.9.0-rc.6 (`fcc093d70ccd4ab489a6656a7bc6dbff9d3f0a46`).

To paczka 2 z planu budynków (paczka 1 to warsztaty z charakterem w 4.9.0-rc.1).

## Plac wokół wielkich budynków
Sześć wielkich budynków ma od początku plac szerokości jednego pola wokół siebie:
- dwór rodu;
- dom cechowy;
- zajazd;
- browar;
- szpital;
- chata wiecowa.

**Inne budynki na placu:**
- Gdy podgląd budowy wchodzi na plac, robi się czerwony.
- Czerwony jest też plac budynku, któremu nowa budowla zawadza.
- Zamiast ogólnego „Tu nie da się budować” karta mówi: „Za blisko: plac dworu rodu musi zostać wolny (jedno pole wokół)”.
- Dotknięcie nie stawia budynku, tylko pokazuje komunikat.

**Wielki budynek obok wielkiego:** dwa wielkie budynki nie mogą dzielić jednego placu. Ich place mogą do siebie przylegać.

**Wolne miejsce:** gdy plac i miejsce są wolne, podgląd placu jest zielony.

**Małe budynki** stoją obok siebie jak dotąd.

## Nowe modele
**Dwór rodu:**
- biały dworek z gankiem na kolumnach i łamanym dachem;
- przed nim dziedziniec z płotem, bramą i lipami.

**Dom cechowy:**
- murowany parter i drewniane piętro;
- szczyt od frontu, godło cechu, kram przed wejściem.

**Zajazd:**
- karczma z podcieniem i wozownią;
- wiecha, stół z ławami, beczki.

**Szpital:**
- długi biały dom;
- suszarnia ziół i grządki.

**Chata wiecowa:**
- długa hala ze stromą strzechą;
- słup z czterema twarzami, krąg wiecowy.

**Browar:** dziedziniec z beczkami i drzewem.

**Kiedy rysuje się dziedziniec:** tylko wtedy, gdy pas przed budynkiem jest wolny. Dotyczy to też starych zapisów, w których coś już tam stoi.

**Stary wygląd:** parametr `?oldbld` przywraca dawne modele.

## Wydajność
Liczba elementów jest porównywalna z dawnymi modelami: 81–154 siatki na budynek, wcześniej 55–152. Każdy z tych budynków stoi w osadzie najwyżej kilka razy.

## Technicznie
- `src/p_dwory.js` (w `build.js` po `p_warsztaty.js`):
  - `placConflict`;
  - nakładki na `checkPlace`, `moveGhost`, `tryPlace`, `cancelPlace`, `makeBuildingModel`, `newModel`.
- W epoce IV plac i dziedziniec się nie rysują, bo epoka ma własną zabudowę folwarków.

## Testy
`tests/dwory.test.mjs` (3 przypadki):
- plac i jego narożniki;
- dwa wielkie budynki;
- małe budynki obok siebie;
- obecność modeli.

## Dalej
Następne paczki planu:
- **B:** widoczne poziomy budynków.
- **C:** styl epoki po remoncie lub rozbudowie.
- **D:** życie i animacje, tylko na grafice wysokiej i ultra.
- **E:** urozmaicenie.
