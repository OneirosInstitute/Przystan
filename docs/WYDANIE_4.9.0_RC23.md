# Przystań 4.9.0-rc.23: źródła wiedzy

Podstawa: 4.9.0-rc.22 (`BASE_HASH`).

Drugi pakiet (W2) z „Przystań — plan wiedzy i rozwoju”. Wiedza nie bierze się z niczego: oprócz praktyki ma źródła, które skracają drogę. Do tego mgła wiedzy w drzewku i podpowiedzi przy wieczornym ogniu.

## Co daje źródło
- **Źródło z wyspy** (ślad dawnego ludu, przysiółek, przypadek): próba może ruszyć już przy połowie przeczucia, kosztuje połowę materiałów, a szansa rośnie o 15 punktów procentowych.
- **Pamięć rozbitka** nie zastępuje praktyki. Działa przy samej próbie: gdy prowadzi ją ten, kto pamięta, potrzeba połowy materiałów, a szansa rośnie o 15 punktów procentowych.
- W karcie węzła widać, skąd osada o nim wie, np. „Pamięć z domu: Radosław”.

## Pamięć rozbitków
- Każdy dorosły rozbitek pamięta z domu jedną rzecz, a starsi od 40 lat dwie. Najczęściej coś ze swojego fachu, a starsi także z nauki. Część to wiedza na epokę II, np. kamieniarz pamięta miernictwo.
- Na karcie osoby widać: „Pamięta z domu: wędzenie, miernictwo (przyda się w epoce II)”.
- Kto pamięta, może poprowadzić próbę nawet bez biegłości w fachu, a szansa liczy się wtedy jak przy fachu na poziomie 2.
- Gdy umrze albo odpłynie, pamięć przepada, jeśli nikt inny tego nie pamięta: „Radosław zabrał do grobu pamięć z domu: wędzenie. Tego nikt już nie pamięta.”
- Na liście „Na co czekamy” pojawia się ostrzeżenie, gdy coś pamięta już tylko ktoś starszy niż 58 lat.

## Ślady dawnego ludu
Dar dawnego ludu nie daje już gotowej wiedzy. Daje pełne przeczucie oraz tańszą i pewniejszą próbę. Dotyczy to zielarstwa, garncarstwa, sieci, oswajania kóz i sadzonek. Rozpoznawanie roślin, pierwszy rząd, nadal przychodzi od razu.

## Przypadki
Raz na grę każdy z tych przypadków podsuwa pomysł:
- po pożarze w popiele leżą wypalone grudy gliny, więc przychodzi pomysł na garncarstwo;
- po wilkach w zagrodzie pomysł na ostrokół;
- po ranie, która się paprała, pomysł na opatrywanie ran.

## Przysiółki (od epoki II)
- Każdy przysiółek zna się na czymś według swojej krainy:
  - wybrzeże na sieciach, łodziach i masarstwie;
  - łąki na ziarnie, radle, trójpolówce i młynie;
  - las na zrębie, gontach i kołowrocie;
  - hale na hodowli, sianie, wypasie i zaprawie.
- Gdy więź z przysiółkiem jest dość mocna (co najmniej 45%), staje się on źródłem: „W przysiółku Dąbrowa znają się na tym: łodzie klepkowe. Próba w osadzie będzie tańsza i pewniejsza.”
- Każdy wóz z przysiółka przywozi trochę przeczucia (8% węzła).

## Mgła wiedzy
Widać węzły dostępne i jeden rząd dalej. Głębsze mają tylko nazwę ze znakiem zapytania i napis „nieznane”. Opis pojawia się dopiero wtedy, gdy osada pozna poprzednika.

## Podpowiedzi przy ogniu
Gdy przeczucie jest pełne, ktoś z fachu mówi o tym w wieczornym oknie, w miejscu jednej z rozmów. Na przykład: „Ryby, które wisiały nad ogniskiem, wytrzymały dłużej niż reszta. Może dym je chroni.” Każda podpowiedź pada raz.

## Testy
- `tests/zrodla.test.mjs` (nowy, 8 przypadków):
  - pamięć rozbitków nadawana raz, widoczna na karcie;
  - połowa przeczucia, połowa materiałów i wyższa szansa;
  - utrata pamięci po śmierci;
  - ślad zamiast gotowej wiedzy;
  - przypadki z pożaru i wilków, każdy raz;
  - przysiółek według krainy i przeczucie z wozu;
  - mgła wiedzy;
  - podpowiedź przy ogniu.
- `tests/badania.test.mjs` sprawdza samą mechanikę prób, bez losowej pamięci rozbitków.
- Przebiegi z botem:
  SOAK_LINES
