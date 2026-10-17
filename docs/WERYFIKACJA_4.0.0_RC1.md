# Weryfikacja Przystani 4.0.0-rc.1

Data zamknięcia: 2026-10-17. Baza main:
`8cdbc74771162954d8e412c77b80a5f1f867cc17`. Build: `3a363c13af`.

Werdykt: implementacja Epoki IV oraz odtworzona awaria zapisu przechodzą
automatyczne bramki i próby Chromium. Paczka jest kandydatem RC1. Zatwierdzenie
produkcyjne wymaga odbioru wydajności i dotyku na fizycznym telefonie.

## Dowody

| Obszar | Wynik i zakres |
| --- | --- |
| Build i składnia | PASS; deterministyczny build `3a363c13af` |
| Regresje | PASS; 23 zestawy, 93 przypadki, bez pominiętych testów |
| Runtime gry | PASS; 12 000 klatek, 10 restartów, 45 automatycznych zapisów; epoki I, III i IV |
| Jeden ośrodek | 1500 dób; 69 żyjących, 8 pokoleń, 111 narodzin, 60 zgonów, 26 sukcesji; zapis 247 677 bajtów |
| Cztery ośrodki | 1500 dób; 573 żyjących, 8 pokoleń, 793 narodziny, 262 zgony, 81 sukcesji; zapis 888 117 bajtów |
| Gospodarka czterech ośrodków | 2135 partii produkcji, 48 124 odbiorów plonów, 262 narodziny zwierząt, 5 dostaw; bez ręcznego uzupełniania po wyposażeniu scenariusza |
| Chromium | PASS; prawdziwy DOM i WebGL, ekrany 1280×800 oraz 412×870, wszystkie siedem paneli, bez błędów JS i przepełnienia szerokości |
| Zapis w Chromium | PASS; 25,9 doby, 3 ośrodki, 21 osób; restart transportu, autosave podczas nocy 40×, ponowne wejście offline z service workera |
| Instalator | PASS na czystym klonie bazy: integralność, build, 93 testy i runtime; `--prepare-only`, bez commitu/push |
| Telefon fizyczny | Niezweryfikowane: FPS, pamięć, temperatura, dotyk i długa sesja na Androidzie |

Testy runtime Node używają atrap DOM/GPU i sprawdzają logikę oraz restart.
Chromium uruchomiono osobno z programowym ANGLE/SwiftShader. Żaden z tych
wyników nie jest pomiarem płynności na telefonie. Testy pokoleń używają
referencyjnych scenariuszy i nie dowodzą poprawnego balansu każdej możliwej osady.
Podział kroku czasu i restart zachowują identyczny wynik deterministycznej symulacji.

## Naprawa przyczyny awarii zapisu

Przewijanie nocy ustawia przejściowo `S.speed=40`, podczas gdy dawny walidator
akceptował wyłącznie zwykłe tempa. Autosave w tej chwili lub na granicy doby
odrzucał własny snapshot. Zapis przechowuje teraz normalne tempo powrotu,
także dla oczekującej decyzji; stan działającej gry nadal przewija noc.
Import starszego snapshotu z 40× normalizuje tempo. Regresje obejmują timer,
północ, decyzję i import. Zrzut użytkownika pokazuje komunikat błędu; nie
otrzymano jego pliku JSON i nie potwierdzono odzyskania tej konkretnej osady.

## Migracja i mechanika

- Stare budynki zachowują miejsce i postęp; opłacone budowy i wozy kończą się
  jednokrotnie. Pole z pięcioma pozostałymi jednostkami plonu daje pięć.
- Epoka IV ma jedną listę żyjących osób. Brakujące tożsamości dawnych
  anonimowych mieszkańców są migrowane jawnie, bez wymyślania rodziców.
  Przypadek bliźniąt z brakującym ID ojca zachowuje znaną matkę.
- Migracja czeka na aktywne wyprawy, dostawy i decyzje, robi osobną kopię
  starego zapisu, waliduje nowy stan i wycofuje podmianę przy błędzie widoku.
- Zweryfikowano wszystkie receptury, modele budynków i siedem typów upraw,
  dojrzewanie winnicy, próby odmian, fermentację oraz zapis partii w toku.
- Kozy, kury i świnie mają test oswajania, rozmnażania i nieodwracalnego uboju;
  kozy dają mleko, kury jaja. Oswajanie uszczupla dziką populację.
- Dostawy mają prawdziwy ładunek, rezerwę miejsca, załogę, prowiant i trasę.
  Brak pracy, materiałów lub miejsca zatrzymuje proces z widoczną przyczyną.
- Wspólne zasoby krain są skończone i odnawialne; autonomia nie tworzy dóbr
  ze starej pętli zagregowanych przysiółków. Nauka, pokrewieństwo i następstwo
  zachowują identyfikatory przez kolejne pokolenia i zapis/wczytanie.

## Powtarzalność i wdrożenie

W katalogu repo: `npm run build`, `npm test`, `npm run test:runtime`.
Opcjonalna próba prawdziwej przeglądarki: `node tools/browser-e4.cjs`;
wymaga Playwright i Chromium poza zależnościami gry. Można podać
`PRZYSTAN_PLAYWRIGHT_MODULE`, `PRZYSTAN_CHROMIUM_MODULE` lub `CHROMIUM_PATH`;
`PRZYSTAN_START_SERVER=1` uruchamia lokalny serwer na porcie 4317. Podstawowe bramki i wdrożenie Termux nie wymagają tych pakietów.

Surowe dowody są w `docs/weryfikacja4/`. Manifest zawiera SHA-256 plików
paczki. Instalator sprawdza integralność przed i po buildzie, stan drzewa,
adres repo, main i dokładną bazę. Nie wykonano zdalnego commitu ani push.
Publikację wykonuje użytkownik standardowym uruchomieniem `WDROZ_TERMUX.sh`.
Nie sprawdzono wdrożenia produkcyjnego po tym przyszłym pushu.
