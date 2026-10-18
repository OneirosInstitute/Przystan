# RC7 — kontrakt poprawy interfejsu

1. Pełny ekran: start dotykowy próbuje wejść w pełny ekran również w zainstalowanej aplikacji standalone; brak blokowania orientacji. Mapa wypełnia viewport, wcięcia chronią kontrolki tylko raz. Dostępne ręczne ponowienie.
2. Opcje: klasyczne osiem zakładek pozostaje. Szczegóły otwierają się na miejscu przez `details/summary`, ze stanem rozwinięcia zachowanym przy odświeżaniu. Bez katalogu Działy i odsyłaczy udających opcje.
3. Bilans: dla zasobów w magazynie widać stan, produkcję/pozyskanie, zużycie i bilans na dobę gry. Liczniki obserwują rzeczywiste operacje; dostawy i przesunięcia nie stają się produkcją. Pomiar przetrwa zapis/odczyt. Nie zmienia zasobów, pracy ani czasu. Zapotrzebowanie jest oznaczone osobno od pomiaru.
4. Czytelność: podsumowanie i pilne potrzeby przed szczegółami; rozwijane grupy zapasów i opcji; czytelność w obu trybach, pionie i poziomie. Zadania i istniejące działania zachowane.
5. Aktualizacja: nowy service worker może odświeżyć aktywną grę dopiero po skutecznym zapisie; ukryta karta czeka na powrót. Pierwsza instalacja nie powoduje pętli odświeżeń. Brak nowych okresowych zadań w tle.

Odbiór: regresje skierowane na powyższe zachowania, pełne regresje instalacyjne, próba silnika, Chromium/WebGL z dotykiem i orientacjami, próba instalatora i integralności ZIP. Fizyczne paski systemowe Androida wymagają testu na urządzeniu.
