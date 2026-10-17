# 4.0.0-rc.2 — zapis i obsługa zadań

Baza: main `1ea311b282a7e6b1c845b364903daada06144555`.

1. Zapis pozostaje zgodny z wcześniejszymi plikami. Nie nadpisujemy dobrego
   snapshotu stanem odrzuconym przez walidator. Błąd pokazuje wersję i konkretną
   przyczynę. Przy braku miejsca można zwolnić wyłącznie dodatkową kopię gry,
   po sprawdzeniu głównego zapisu; nie czyścimy danych witryny.
2. Każda prośba przysiółka ma widoczną akcję pomocy, ilość, dostępne zapasy,
   powód blokady i lokalizację. Jedna ścieżka wykonania obsługuje kartę
   przysiółka i listę zadań, bez podwójnego pobierania zasobów.
3. Odczytanie prośby prowadzi bezpośrednio do jej karty w Zadaniach. Zamknięcie
   znacznika ukrywa tylko to powiadomienie; nie anuluje potrzeby. Nowa potrzeba
   tego samego przysiółka znów może wyświetlić znacznik. Stan przetrwa restart.
4. Dział Zadania obejmuje cele, prośby, budowy/rozbudowy, wyprawy, badania,
   czytanie i transport Epoki IV. Pokazuje status, postęp, wykonawców,
   bieżącą czynność i lokalizację. Dane są wyprowadzane z rzeczywistego stanu.
   Kliknięcie osoby lub celu przesuwa kamerę i zaznacza istniejący obiekt.
5. Weryfikacja: odtworzenia błędów przed naprawą, regresje zapisu i zadań,
   pełny build/test/runtime, Chromium w pionie, próba instalatora i jeden ZIP.
   Bez pliku awaryjnego użytkownika wynik dotyczący jego konkretnej osady
   pozostaje niepotwierdzony. Nie wykonujemy zdalnego pushu.
