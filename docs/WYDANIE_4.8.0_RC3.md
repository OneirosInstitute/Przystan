# Przystań 4.8.0-rc.3 — życie osadników w epoce IV

Podstawa: 4.8.0-rc.2 (`c397ce156df94d1263d993bfa7de57fa90dc033c`).

Epoka IV (rody i folwarki) ma własną symulację, więc do tej pory nie widziała tego, co 4.8 dało wcześniejszym epokom. Teraz widzi.

## Co działa w epoce IV

- **Usposobienie i nastrój.** Każdy członek rodu ma swoje cechy i ulubione zajęcie. Nastrój liczy się z jedzenia, ciepła, zdrowia i bliskich. W pracy rodów działa jak w osadzie: dobry przyspiesza robotę do +8%, zły spowalnia do −8%.
- **Zapis dnia.** Godziny pracy rodów zamieniają się w zapis dnia (co kto robił), więc awanse i opis dnia na karcie osoby mają z czego się brać.
- **Wspomnienia z życia rodów.** Narodziny dziecka, ślub, przeprowadzka do folwarku („nowy dom: …”), śmierć w rodzie i nowa nauka. Śmierć pamiętają krewni i bliscy przyjaciele, a najmocniej małżonek, rodzice i dzieci.
- **Wieczory, noce, poranki i sny** idą z zegarem rodów: rozmowy przy ogniu (w Przystani, w domu rodowym, we dworze), nocne zdania, poranne „wczoraj” i sny, które coś zapowiadają.
- **Małe sceny** pojawiają się mniej więcej raz na dobę jako dymek nad człowiekiem. Trafiają też do kroniki rodów jako wpis „scena”. Biorą tylko ludzi, którzy są na miejscu, a nie w drodze wozem.
- **Wieczór po swojemu.** Po pracy ludzie odwiedzają przyjaciół i krewnych z innych rodów, stoją przy grobie bliskiej osoby, siadają pod świętym dębem, idą w ulubione miejsce w Przystani albo na skraj pola w folwarku.
- **Nowe rozmowy:** o folwarkach, o rodzie, o przodkach z pierwszego pokolenia (z właściwą formą: „przypłynął/przypłynęła”), o wozach na drodze, o nowych naukach, o karczmie i o dworze.
- **Kronika rodów** ma sekcję „Wieczory przy ogniu”.

## Technicznie

- `src/p_e4_dusza.js`:
  - dzienny most `duszaE4Daily` przez `e4Daily`;
  - wieczory, noce i sceny na kroku epoki IV;
  - dymki na klatce obrazu rodów.
- `E4Life` pyta o wieczór przez `environment.evening`. Gdy nie ma odpowiedzi, zostaje stare zachowanie (z rodziną).
- `E4Economy.useLabor` mnoży wydajność przez nastrój (±8%).
- Wybór jest deterministyczny (`dHash`), więc zapis i odczyt gry dają ten sam wieczór.
- Testy: `tests/e4-dusza.test.mjs` (4 przypadki).
