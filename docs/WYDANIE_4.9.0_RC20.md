# Przystań 4.9.0-rc.20: dzikie zwierzęta unikają ludzi

Podstawa: 4.9.0-rc.19 (`81492e3d616e2fe61a707da7de795b83bc9c6903`).

Pierwszy pakiet z „Przystań — plan życia Wyspy”. Lisy, sarny, kozy i inne dzikie zwierzęta przestały chodzić między chatami.

## Co było nie tak
Każde stado krążyło na stałe wokół jednego punktu z generowania mapy i nic go nie płoszyło. Pierwsze stada saren, kóz i dzików leżą celowo blisko ogniska, więc osada rosła prosto na nie. Stado wybite do zera odrastało samo w tym samym miejscu.

## Teraz
- **Dystans od ludzi i psów.** Każdy gatunek ucieka, gdy ktoś podejdzie za blisko: sarna 14 pól, koza 12, dzik 8, zając 6, lis 8, wilk 18, niedźwiedź 20, foka 6. Psy płoszą z nieco mniejszej odległości. Stado ucieka w stronę spokojniejszego miejsca i przez chwilę biegnie szybciej.
- **Odległość od zabudowań.** Stada trzymają się z dala od chat, pól, zagród, ogniska i przysiółków: sarna i koza 9 pól, dzik 6, zając 4, lis 5, wilk 12, niedźwiedź 14, foka 10. Spacerują tylko poza tą strefą.
- **Nowa ostoja.** Gdy osada zajmie miejsce, wokół którego żyło stado, raz na dobę stado szuka najbliższego spokojnego miejsca ze swoim siedliskiem: sarna w lesie lub na łące, koza na halach i skałach, foka na plaży. Nie wybiera miejsca tuż obok innego stada tego samego gatunku.
- **Noc.** Dystans od ludzi spada o połowę. Bliżej podchodzą tylko szkodniki: dzik do pól z plonem (poza zimą), lis pod zagrody z kozami, wilk zimą pod zagrody. Rano wracają do lasu. Sarny, kozy, zające, niedźwiedzie i foki nie wchodzą do osady nigdy.
- **Myśliwy podchodzi.** Stado nie ucieka przed myśliwym, który na nie poluje, ale może go zwęszyć raz przy każdym podejściu. Szansa to 35% dla nowicjusza i 10% dla mistrza, nocą mniej. Spłoszone stado ucieka, a myśliwy idzie jego śladem. Hodowca oswajający kozy działa jak dotąd.
- **Nic z niczego.** Młode rodzą się tylko w stadzie, które ma co najmniej dwa zwierzęta. Wybite stado albo samotne zwierzę dostaje dwa zwierzęta z sąsiedniego stada tego samego gatunku: wiosną lub latem, z odległości do 80 pól, jeśli tamto liczy co najmniej cztery sztuki. Pusta ostoja w środku osady pozostaje pusta.

## Koszt
Odległość od zabudowań to jedna mapa liczona raz na dobę i od nowa, gdy przybędzie budynek. Ucieczka jest sprawdzana co 0,4 s czasu gry na siatce ludzi 16 × 16 pól, bez liczenia każdego z każdym. Ruch i rysowanie zwierząt się nie zmieniają.

## Testy
- `tests/przyroda.test.mjs` (nowy, 7 przypadków):
  - w dzień żadne dzikie stado nie zostaje między chatami;
  - nowa ostoja ma właściwe siedlisko i jest dość daleko od zabudowań;
  - ucieczka przed człowiekiem;
  - myśliwy może zostać zwęszony najwyżej raz przy jednym podejściu;
  - nocą podchodzą tylko szkodniki;
  - wybite stado nie odrasta samo, a wraca tylko z sąsiedztwa;
  - nowa ostoja przetrwa zapis.
- Pomiar w dojrzałej osadzie (epoka II): na starcie 11 stad stało bliżej niż 12 pól od zabudowań, w tym sarny przy samych chatach. Po jednym dniu gry zostały tam 2–4 stada (dzik, zające, lis), każde poza swoją strefą. Najbliższe sarny były ponad 30 pól od ogniska, a myśliwy dalej przynosił mięso.
- Przebiegi z botem, każdy bez błędów i ostrzeżeń: epoka I przez 80 dni, epoka II przez 60 dni, epoka III przez 50 dni. Osady rosły, a historie ludzi szły swoim rytmem (16–17 w każdym przebiegu).
