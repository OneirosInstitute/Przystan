# Przystań 4.2.0-rc.1 — Menu

Baza: main 4.1.0-rc.1 `7cac133e752076ccc7687d8a57b9309dc090d06d`. Wydanie wypchnięte prosto na main (Railway buduje z main).
Drugi krok planu z [projektu wyspy](PROJEKT_WYSPY_5.md), rozdział 7: jedno menu z pięcioma działami.

## Co się zmieniło

Przedtem było osiem zakładek w przewijanym rzędzie, a Budowa miała pod nimi jeszcze trzy rzędy rodzajów. Teraz jest pięć działów i pod nimi najwyżej jeden rząd.

| Dział | Widoki | Dawne zakładki |
|---|---|---|
| Osada | Przegląd · Kronika · Opcje | Ludzie (potrzeby, zapasy, cele), Kronika |
| Ludzie | Praca · Mieszkańcy | Praca, Ludzie (rodziny, wspólnota, rody, pamięć) |
| Budowa | wyszukiwarka + lista rodzajów | Budowa z kategoriami, Remonty, Drogi, Ład wsi |
| Zadania | Zadania · Wyprawy | Zadania, Wyprawy |
| Wiedza | Wiedza · Natura | Wiedza, Natura |

- **Budowa:** pole „Szukaj budynku” (nazwa, rodzaj, od czterech liter także opis, bez polskich znaków) i lista rozwijana rodzajów z liczbami („Przetwórstwo (8 z 11)”). Pierwsza pozycja to „Możesz postawić teraz”: tylko to, na co starcza materiałów.
- **Opcje gry** są w Osada → Opcje, a kronika i zapis w Osada → Kronika.
- Dział pamięta ostatni widok. W pełnym menu dotknięcie aktywnego działu zamyka księgę. Przeciągnięcie nagłówka księgi w dół też ją zamyka.
- W pełnym menu tytuł księgi to nazwa widoku. W Cichej wyspie zostaje nazwa osady.
- Wskazówki pierwszych dni prowadzą po kolei: dział, widok, rodzaj budowli, przycisk.
- Teksty w grze mówią „Ludzie → Praca” zamiast „zakładka Praca”.

**Zgodność.** Dawne zakładki (`TABS`) zostały pod spodem i widoki dzielą tylko ich sekcje. Dlatego każde miejsce w grze, które otwiera `openSheet('osada')` albo `openSheet('kronika')`, działa jak przedtem: trafia w pierwszy widok z tą zakładką. Zapis gry się nie zmienia.

## Testy

- Nowy zestaw `menu-nav` (3 przypadki): działy pokrywają wszystkie dawne zakładki, oba paski mają po pięć przycisków, widoki dzielą sekcje Osady i Kroniki, wyszukiwarka i „Możesz postawić teraz”.
- `tools/browser-workspace.cjs` przechodzi przez działy i widoki zamiast ośmiu zakładek. Opcje otwiera przez Osada → Opcje.
- `npm run test:install`: 50 zestawów. `npm run test:runtime`: pętla epok I, III i IV.
- Przeglądarka z WebGL (programowym): 412×870 w Cichej wyspie, 360×740 w pełnym menu, 870×412 w poziomie. Wszystkie działy i widoki działają, nic nie wystaje poza ekran, przyciski mają co najmniej 44 px, nie ma błędów w konsoli. `browser-workspace`: część menu przechodzi. Krok offline z service workerem nie przechodzi w tym środowisku; tak samo nie przechodzi na 4.1.0-rc.1.

## Jeszcze nie w tym wydaniu

Wyszukiwarka w Ludziach (po imieniu i fachu) i jeden wzornik karty dla wszystkich budynków (stan, wymagania ✓/✗, jeden przycisk, „Pokaż na mapie”). Karty budowy i rozbudowy domu już mają ten układ.

## Do sprawdzenia na telefonie

Czy lista rodzajów (natywny wybór) wygodnie się otwiera, czy klawiatura przy wyszukiwaniu nie zasłania wyników, i czy gest w dół na nagłówku nie myli się z przewijaniem.
