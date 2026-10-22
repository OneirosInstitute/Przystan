# Przystań 4.9.0-rc.4: nowy ekran startowy

Podstawa: 4.9.0-rc.3 (`2c09ebc3ac414e733d5024d292a441e3ced2b736`).

## Co się zmieniło
Dawny ekran był ciemną kartą z formularzem: dwa akapity, rząd liczb i kilka przycisków jeden pod drugim. Teraz:

- **Tło to żywa wyspa.** Kamera powoli krąży nad wrakiem, plażą i morzem, na pełnym ekranie. Krążyła tak już wcześniej, tylko była przyciemniona i schowana za kartą, więc wydajność się nie zmienia.
- **Herb z wycinanki.** Herb wygląda jak dwuwarstwowa wycinanka z ząbkowanym brzegiem. W środku łódź, z której zamiast masztu wyrasta drzewo życia, na gałęziach dwa ptaki, pod łodzią fale. To połączenie rozbitków z przystanią.
  - Przy wejściu herb „rozkłada się” od środkowego zgięcia, tak jak przy robieniu prawdziwej wycinanki.
  - Potem pojawiają się tytuł i przyciski.
  - Przy wyłączonych animacjach w telefonie wszystko jest widoczne od razu.
- **Nowa gra.** Na dole jedno zdanie o rozbitkach i przycisk „Zejdź na brzeg”.
- **Zapisana gra.** Widać nazwę osady, rok, porę roku, epokę i liczbę ludzi (także w przysiółkach) oraz jedno zdanie z ostatniego wieczoru przy ogniu. Do tego przyciski „Wróć do osady” i „Zacznij od nowa”.
- **„Inne początki”.** W tym panelu są:
  - poziom trudności;
  - wyspa i wyzwanie;
  - wyspa tygodnia;
  - starty od epoki II i III;
  - instalacja gry na telefonie.

  Panel otwiera się sam po wylosowaniu nowej wyspy.

## Technicznie
- `src/p_start.js` przestawia elementy dawnego ekranu, które dokładały inne moduły, i nic nie usuwa.
- Herb to SVG rysowany w kodzie, bez plików graficznych.
- Pisma: Alegreya i Alegreya Sans, te same co w grze.

## Testy
`tests/start.test.mjs`
