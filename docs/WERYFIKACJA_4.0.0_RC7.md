# Odbiór 4.0.0-rc.7

Paczka kumulatywna RC6 + cztery poprawki interfejsu. Baza wdrożenia: `eb38cf5cce165aedaf13d57d711da3d63d640911`. Wszystkie 306 śledzonych plików aktualnego main porównano z zatwierdzoną, wypakowaną paczką RC6: zgodne bajtowo. Wyniki maszynowe: `weryfikacja7/results.json`.

## Wymagania i dowody

| Wymaganie | Zmiana | Świeża weryfikacja |
|---|---|---|
| Pełny ekran w pionie | Start dotykowy wywołuje Fullscreen także w standalone; mapa wypełnia viewport, wcięcia chronią kontrolki raz; ręczne ponowienie w Opcjach | Chromium: rzeczywiste wejście w Fullscreen po kliknięciu; scena równa viewportowi 352×768, 412×870 i 768×352; symulowane wcięcie 24 px zastosowane raz |
| Rozwijane opcje | Klasyczne osiem zakładek, sekcje details/summary, zapis stanu rozwinięcia, opcje gry na miejscu | Oba tryby; rozwinięcie zachowane po odświeżeniu liczb, brak odsyłaczy w Opcjach |
| Dane live | Osobno zapas, produkcja/pozyskanie, zużycie i saldo na dobę, wspólny widok zapasów w epokach I–IV | Chromium: rzeczywiste +10 i −4 przez 0,25 doby dają +40 / −16 / +24; zapis/odczyt zachowuje liczniki; dostawy nie udają produkcji |
| Przejrzyste menu | Potrzeby przed szczegółami, zwijane grupy, czytelne zapasy; szybkie zamknięcie i powrót okna na początek | Osiem zakładek w obu trybach, pion/poziom i desktop; brak poziomego przepełnienia tabeli na 352 px; Zadania, pomoc, śledzenie i lokalizowanie zachowane |
| Bezpieczna aktualizacja | Zmiana service workera odświeża grę po skutecznym zapisie; nieudany zapis zostawia grę otwartą z ponowieniem | Rzeczywista aktualizacja workera w Chromium: jeden reload, stan zachowany; błąd zapisu i ponowienie zachowują najnowsze zasoby |

## Bramy wydania

- Końcowa próba instalatora na czystej kopii aktualnego main: **38 zestawów, 192 przypadki PASS**, budowa, składnia, próba silnika i integralność PASS. Tryb `--prepare-only`, HEAD bez zmiany, bez push.
- Negatywna próba instalatora: własna zmiana README zatrzymuje instalację przed kopiowaniem; zawartość pliku identyczna po odmowie.
- Nowe testy bilansu, integracji i mobilnego UI: **18 przypadków PASS**. Są częścią powyższych 192, nie dodatkową pulą.
- Próba silnika: **12 000 klatek, 10 restartów i 45 zapisów automatycznych**, epoki I, III i IV. Instalator powtarza ją na skopiowanej paczce.
- Gospodarka epoki IV: po 8 dobach obserwowany i nieobserwowany stan gry są identyczne po usunięciu metadanych pomiaru.
- Chromium: menu 412×870, 870×412 i 1280×800; nowe UI 352×768, 412×870 i 768×352; oba tryby, epoka IV, odczyt offline, zadania i pomoc PASS.
- Cykl życia: 16 s ukrycia bez nowych klatek, rysowania, interwałów i timeoutów; dźwięk zawieszony. Freeze/resume oraz zapis/odczyt PASS.

Pierwsza próba instalatora po wykryciu wdrożonego RC6 wykazała test metadanych nadal związany z bazą RC5. Poprawiono oczekiwaną bazę w teście; końcową próbę wykonano od nowa na czystym klonie. Log pierwszej próby zachowano. Anulowane równoległe kontrole z tej próby nie są zaliczone jako sukces.

## Interpretacja bilansu

Liczniki obserwują rzeczywiste zmiany magazynu i nie zmieniają zasad gospodarki, zasobów, RNG ani zegara. Pomiar obejmuje bieżącą i poprzednią dobę, trafia do zapisu i rozpoczyna się przy pierwszym uruchomieniu RC7. Brakujące wcześniejsze przepływy nie są zgadywane. Posiłki i część produkcji rozliczają się na koniec doby. Zapotrzebowanie na posiłki jest osobną miarą, nie zamiennikiem faktycznego zużycia. Spiżarki rodzin i ładunki w drodze pozostają poza magazynem; dostawy, handel i przesunięcia są pozostałymi zmianami, a nie produkcją.

## Ograniczenia

Dwie próby 1500 dni z RC6 nie zostały powtórzone w RC7; zachowane wyniki są w `weryfikacja6/`. Liczba 192 obejmuje świeże kontrole instalacyjne bez tych dwóch scenariuszy. Zasady gospodarki i planera SI nie były zmieniane w RC7; dodano granice obserwacji przepływów.

Weryfikacja lokalna: Node 24, Chromium 133 z programowym WebGL. Nie mierzono baterii, temperatury, GPU, FPS, odczuć dotyku ani ubicia procesu na fizycznym Androidzie. W szczególności test API Fullscreen w Chromium nie potwierdza jeszcze pasków systemowych konkretnego telefonu. Zdalne CI Node 18/24 jest skonfigurowane, ale nie uruchamiano go w tym zadaniu.

Po wdrożeniu ze starszego interfejsu trzeba raz zamknąć aplikację całkowicie i otworzyć ponownie; stare wersje nie mają jeszcze nowej obsługi zmiany workera. Nie usuwać danych aplikacji. Numer w Kronika → Opcje gry ma wynosić **4.0.0-rc.7**.
