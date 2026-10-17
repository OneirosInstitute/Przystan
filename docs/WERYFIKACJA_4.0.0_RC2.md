# Weryfikacja Przystani 4.0.0-rc.2

Data: 2026-10-17. Baza: `1ea311b282a7e6b1c845b364903daada06144555`.
Build: `744284579f`. Jedna paczka zawiera całą grę, także Epokę IV.

## Wynik

| Wymaganie | Zmiana i świeży dowód | Status |
| --- | --- | --- |
| Brak miejsca zajętego przez dodatkową kopię | `storeSave`, walidacja głównego zapisu, usunięcie wyłącznie kopii i ponowienie; testy Node i prawdziwy limit Chromium | Potwierdzone |
| Nieudane ponowienie zapisu | Dobry główny snapshot zachowany, próba odtworzenia kopii, jawny błąd; test regresji | Potwierdzone |
| Rozpoznawalny powód błędu | Walidator wskazuje pole; wersja i przyczyna w Kronice; eksport JSON diagnozy wykonany w Chromium | Potwierdzone |
| Konkretna awaria osady użytkownika | Dostępne są zrzuty, ale nie otrzymano pełnego JSON zapisu ani komunikatu przyczyny | Niepotwierdzone |
| Pomoc Lubomirowicom | Widoczna ilość i zapasy, akcja Wyślij, kontrola braków; 92 → 90 sztuk odzieży, jednokrotna realizacja i restart | Potwierdzone |
| Powiadomienie → sposób realizacji | Znacznik otwiera konkretną kartę Zadania; przycisk pomocy oraz przejście do pracy, budowy lub wiedzy | Potwierdzone |
| Zamykanie przeczytanego znacznika | × i Schowaj znacznik; potrzeba zostaje na liście, ukrycie przetrwa restart, nowa potrzeba znów ma znacznik | Potwierdzone |
| Zadania i wykonawcy | Wspólna lista celów, próśb, budów, pól, wypraw, książek, prób, produkcji i transportów; aktualne ID i czynności mieszkańców | Potwierdzone |
| Lokalizowanie | Kamera na celu/osobie, zaznaczenie budynku lub zasobu; transport korzysta z bieżącej trasy, wyprawa pokazuje przybliżoną krainę | Potwierdzone |
| Instalator Termux | Czysty klon dokładnej bazy, integralność, build, pełne testy i runtime w `--prepare-only` | Potwierdzone lokalnie |
| Wdrożenie produkcyjne | Nie wykonano zdalnego commitu/push ani odbioru strony po przyszłym wdrożeniu użytkownika | Niezweryfikowane |
| Fizyczny telefon | Dotyk, FPS, pamięć, temperatura i dłuższa sesja na Androidzie | Niezweryfikowane |

## Bramki

- Build i składnia: PASS; `744284579f`.
- Pełny test z paczki instalacyjnej: **25 zestawów, 106 przypadków, 0 błędów i 0 pominiętych**.
- Runtime: **12 000 klatek, 10 restartów i 45 autosave**, epoki I, III i IV.
  To symulacja z atrapami DOM/GPU, a nie pomiar FPS telefonu.
- Testy autonomii Epoki IV nadal przechodzą do ósmego pokolenia, w tym
  scenariusz 1500 dób i czterech zamieszkanych ośrodków, bez ręcznego
  uzupełniania dóbr po wyposażeniu scenariusza referencyjnego.
- Prawdziwy Chromium, 412×870 i 1280×800: przejście ze znacznika do pomocy,
  ukrywanie, wykonanie prośby, ponowne wejście, lokalizowanie osoby,
  eksport diagnozy, przepełnienie rzeczywistego localStorage i powrót offline.
  Nie usunięto niezwiązanej wartości testowej w magazynie przeglądarki.
- Osobno Chromium dla Epoki IV: założenie folwarku przez UI, rzeczywisty
  transport i restart, 25 dób rozwoju, wszystkie osiem działów, zapis podczas
  przewijania nocy i ponowne wejście offline. Bez błędów JavaScript.
- Chromium używa programowego ANGLE/SwiftShader. Interakcje automatyczne i
  rozmiar mobilny nie zastępują dotyku ani wydajności fizycznego urządzenia.

## Granice naprawy zapisu

Awaria quota została odtworzona i usunięta. Nie przypisujemy jej automatycznie
zrzutom użytkownika. Walidator nadal chroni poprzedni dobry zapis przed
uszkodzonym stanem. Nie dodano mechanizmu ukrywającego błąd ani kasującego dane
witryny. Bez pliku awaryjnego nie potwierdzono przyczyny i odzyskania tej
konkretnej osady. Po wdrożeniu trzeba sprawdzić wersję 4.0.0-rc.2 w Kronice;
jeżeli zapis nadal zawodzi, potrzebny jest pełny JSON oraz eksport diagnozy.

Dodatkowa długa próba kampanii I i III nie odtworzyła zgłoszonej awarii.
Jej wynik nie zastępuje testu na stanie z telefonu.

## Dowody i powtórzenie

Surowe wyniki: `docs/weryfikacja4rc2/`. Manifest paczki zawiera SHA-256
wszystkich plików poza nim samym. Archiwum zweryfikowano także po kompresji.
Końcowe uzupełnienie raportu i logów nie zmieniało kodu, testów ani builda
sprawdzonego w czystym klonie.

Polecenia: `npm run build`, `npm test`, `npm run test:runtime`.
Opcjonalne próby DOM/WebGL: `node tools/browser-tasks.cjs` oraz
`node tools/browser-e4.cjs`. Wymagają Playwright i Chromium poza zależnościami
gry; zmienne `PRZYSTAN_PLAYWRIGHT_MODULE`, `PRZYSTAN_CHROMIUM_MODULE` lub
`CHROMIUM_PATH` wskazują ich instalację. `PRZYSTAN_START_SERVER=1` uruchamia
lokalny serwer. Próby przeglądarki nie są uruchamiane przez instalator Termux.
