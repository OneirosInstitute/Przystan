# Przystań 4.9.0-rc.8: widoczne poziomy budynków

Podstawa: 4.9.0-rc.7 (`7e430697da043eb857870cb87aea1ca117d17ae4`).

To paczka B z planu budynków.

## Objaw
Rozbudowa do poziomu 2 i 3 prawie nie zmieniała wyglądu. Każdy budynek dostawał tę samą szopkę ze skrzynką, a na poziomie 3 chorągiewkę i kilka kamieni.

## Co się zmieniło
**Poziom 2:**
- Z boku stoi przybudówka na kamiennej podmurówce, kryta strzechą.
- Pod nią leży zapas typowy dla fachu (szczegóły w tabeli niżej).

**Poziom 3:**
- Przybudówka jest kryta gontem.
- Z drugiej strony powstaje ogrodzone podwórze z większym zapasem.
- Do drzwi prowadzi ścieżka z płaskich kamieni.
- Przed budynkiem stoi proporzec w barwie fachu.

**Zapas zależy od fachu:**

| Fach | Zapas | Barwa proporca |
|---|---|---|
| drewno (drwal, leśnik, drewutnia, pracownia, warsztat, bednarnia, szkutnia) | kłody i deski | brązowa |
| ogień (kuźnia, dymarka, mielerz, cegielnia, garncarnia) | szczapy i kopiec węgla | czerwona |
| łowy (zbieracz, myśliwy, ptasznik, pomost, przystań, pasieka, ogród ziół) | żerdź z suszonymi rybami i mięsem, kosze | niebieska |
| przetwórnie (żarna, piekarnie, serownia, kiszarnia, warzelnia, słodownia, browar, miodosytnia, winiarnia, wiatrak, szwalnia) | beczki i worki | złota |
| kopalnie i wyrobiska | hałda urobku, bryły rudy, taczka | szara |
| składy (skład, spiżarnia, piwnica, spichlerz, stodoła) | skrzynie i worki | fioletowa |
| zagrody (zagroda, kurnik, chmielnik, winnica) | stóg siana i koryto | zielona |

**Ciasna zabudowa:** gdy tuż obok stoi inny budynek, przybudówka, podwórze czy ścieżka nie stają w nim. Dotyczy to też starych zapisów.

**Stary wygląd:** parametr `?oldbld` przywraca dawny wygląd poziomów.

## Technicznie
- `src/p_poziomy.js` nakłada się na `levelDeco` i `addBldVisuals`, które przekazują budynek do sprawdzenia sąsiedztwa.
- Własna przybudówka wyłącza losową przybudówkę z „Budynków z charakterem”, żeby nie stały dwie.
- Pola, serce osady, gaj, studnia, wieża, cmentarz, ława, plac, brama, targ, domy oraz wielkie budynki z placem (dom cechowy, zajazd, browar, szpital, chata wiecowa; mają własny dziedziniec) zostają jak dotąd.

## Testy
`tests/poziomy.test.mjs` (3 przypadki):
- każdy poziom dodaje elementy;
- zapas zależy od fachu;
- nic nie wchodzi w sąsiedni budynek.
