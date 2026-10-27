# Przystań 4.9.0-rc.15: start gry bez starego menu i bez zbędnych ekranów, dymek, który nie skacze

Podstawa: 4.9.0-rc.14 (`1953da7de8618995ef1834b41d2e00708ed4c574`).

## Jak to sprawdzono
Start gry został nagrany w Playwright i Chromium klatka po klatce, na ekranie telefonu (412×915) z dotykiem. Telefon był spowolniony: procesor 4×, wolniejsza sieć. Nagrania objęły:
- pierwsze uruchomienie bez zapisu;
- powrót z zapisem i z pracownikiem offline.

Skrypt notował każdą zmianę tego, co zasłania ekran (stare menu, nowy start, karta wydarzenia, panel), i za każdym razem dotykał najbardziej widocznego przycisku, tak jak gracz.

## Co było nie tak
**Przed zmianami, pierwsze uruchomienie:**

| czas | ekran |
|---|---|
| 0,4–17 s | **stare menu** („Dzika wyspa · rok pierwszy”, „Zejdź na brzeg”), bo stało w samym HTML-u, zanim ruszył skrypt gry |
| ok. 19 s | pusta wyspa: tytuł i przyciski nowego startu wjeżdżały z opóźnieniem do 1 s |
| ok. 21 s | nowy ekran startowy |
| po dotknięciu | kilka sekund bez reakcji: budowa świata blokowała rysowanie, przycisk wyglądał na niedziałający |
| 2 s po zejściu na brzeg | karta „Pierwsza noc przy ognisku”, a po wyborze druga karta z „Dalej” |

Wychodziło więc: stare menu, start, decyzja i jej wynik, czyli cztery ekrany, zanim dało się grać.

**Przy powrocie z zapisem:**
1. stare menu (ok. 15 s na spowolnionym telefonie);
2. ekran startowy z „Wróć do osady”;
3. karta „Od ostatniego razu” z jedynym przyciskiem „Wracam do osady”;
4. druga karta „Dobrze cię widzieć. Osada czekała.” z „Dalej”.

Znów cztery ekrany.

Od 4.9.0-rc.13 otwarta gra przeładowuje się raz po nowym wydaniu. Po takim przeładowaniu wracało całe stare menu i ekran startowy, a gracz musiał znów nacisnąć „Wróć do osady”.

## Co się zmieniło
- **Ekran wczytywania zamiast starego menu** (`src/p_head.html`, `build.js`):
  - zanim ruszy skrypt gry, widać herb, „Przystań” i „Ocalić to, co umiemy. Zbudować dom.” dokładnie w miejscu nowego ekranu startowego, a na dole „Wczytywanie wyspy…”;
  - stare menu jest ukryte już w arkuszu stylów w nagłówku strony, przed jakimkolwiek skryptem;
  - herb rysuje przy budowaniu ta sama funkcja co na ekranie startowym;
  - gdy wczytywanie trwa ponad 12 s, pojawia się wyjaśnienie, że za pierwszym razem gra pobiera całą wyspę.
- **Płynna zamiana na ekran startowy** (`src/p_start.js`):
  - herb, tytuł i podtytuł zostają w tym samym miejscu, co do piksela na telefonie, małym telefonie i komputerze;
  - nie znikają i nie wjeżdżają drugi raz, a przyciski pojawiają się od razu.
- **Przycisk odpowiada od razu** (`src/p_end.js`):
  - po dotknięciu pokazuje „Schodzimy na brzeg…” albo „Wracamy do osady…”, a reszta opcji przygasa;
  - świat buduje się w następnej klatce, a podwójne dotknięcie nie uruchamia gry dwa razy;
  - pełny ekran jest nadal proszony w samym dotknięciu.
- **„Pierwsza noc przy ognisku” o zmierzchu** (`src/p_v8.js`, `src/p_story.js`):
  - karta przychodzi o pierwszym zmierzchu, czyli około 1:45 gry przy zwykłej prędkości, tak jak mówi jej tekst („Zanim ktoś zaśnie…”);
  - po wyborze nie ma drugiej karty z „Dalej”: postanowienie zostaje na pasku przez 7 s i trafia do kroniki;
  - karta czeka, gdy otwarta jest wieczorna opowieść.
- **„Od ostatniego razu” na jedno dotknięcie** (`src/p_szlif.js`, `src/p_story.js`):
  - podsumowanie (kto się urodził, kto odszedł, na co czekamy, cel) zostaje;
  - „Wracam do osady” zamyka je od razu, a „Dobrze cię widzieć. Osada czekała.” pokazuje się na chwilę na pasku zamiast drugiej karty.
- **Powrót po aktualizacji** (`src/p_update.js`):
  - gdy gra przeładowuje się po nowym wydaniu w czasie gry, wraca sama do osady, bez ekranu startowego i bez podsumowania „Od ostatniego razu” (chyba że trzeba pokazać notkę o uzupełnionym zapisie);
  - powrót przychodzi w pierwszej klatce po wczytaniu, bez żadnego licznika. Gdy przeładowanie zastało grę w tle, czeka, aż gracz ją zobaczy, bo ukryta strona nie planuje niczego, co zużywa baterię (pilnują tego testy `lifecycle`);
  - zwykłe uruchomienie i aktualizacja na ekranie startowym nadal pokazują start;
  - dźwięk, którego przeglądarka nie pozwala włączyć bez dotknięcia, budzi się przy pierwszym dotknięciu.

- **Dymek małej sceny nad osobą** (`src/p_sceny.js`):
  - **Objaw:** gdy osoba z historią chodziła po mapie, dymek ciągle zmieniał wielkość i trudno było cokolwiek przeczytać.
  - **Przyczyna:** dymek stał w punkcie osoby i był przesunięty o połowę w lewo, ale miał tylko największą szerokość. Przeglądarka liczyła jego szerokość z miejsca od osoby do prawej krawędzi ekranu. Zmierzone na ekranie 412 px: przy przejściu osoby od lewej do prawej dymek zwężał się z 300 do 79 px i rósł z 73 do 337 px. Przy lewej krawędzi połowa wychodziła poza ekran.
  - **Teraz:** szerokość zależy tylko od tekstu (do 300 px), dymek zawsze mieści się cały na ekranie, a ogonek dalej wskazuje osobę. Czas wyświetlania zależy od długości zdania: od 6 do 14 s zamiast stałych 7 s.

**Teraz:**
- pierwsze uruchomienie: ekran wczytywania, ekran startowy i jedno dotknięcie, a pierwsza decyzja przychodzi dopiero wieczorem w grze;
- powrót z zapisem: ekran wczytywania, ekran startowy, „Wróć do osady”, a jeśli coś się wydarzyło, jedna karta „Od ostatniego razu” zamykana jednym dotknięciem;
- aktualizacja w czasie gry: ekran wczytywania, a potem od razu osada.

## Testy
- **`tests/start-boot.test.mjs`** (7 przypadków):
  - stare menu ukryte przed skryptem, a ekran wczytywania z prawdziwym herbem na swoim miejscu;
  - ekran startowy zastępuje ekran wczytywania bez ponownego wjazdu tytułu;
  - przycisk reaguje od razu, a gra startuje raz;
  - „Pierwsza noc” o zmierzchu, bez drugiej karty, z wynikiem na pasku i w kronice;
  - pierwsza decyzja czeka na koniec wieczornej opowieści;
  - powrót do osady po aktualizacji w czasie gry, ale nie po zwykłym przeładowaniu;
  - „Od ostatniego razu” zamykane jednym dotknięciem i pomijane po przeładowaniu z powodu aktualizacji.
- **`tests/start.test.mjs`:** herb nie składa się drugi raz, bo stoi już na ekranie wczytywania.
- **Narzędzia przeglądarkowe:**
  - wszystkie 11 po dotknięciu „Zejdź na brzeg” czeka, aż gra naprawdę wystartuje, bo start jest teraz o klatkę później;
  - `browser-ai`, `browser-master`, `browser-mobile-ui` i `browser-navigation` same kolejkują umowę przy ognisku, bo nie przychodzi już zaraz po starcie;
  - `browser-mobile-ui` sprawdza, że po aktualizacji gra wraca do osady bez ekranu startowego.
  - `browser-e4` czeka na pierwsze klatki gry przed kliknięciem wiecu; wcześniej czas dawała mu karta „Pierwszej nocy” zaraz po starcie.
  - `browser-tasks` ustawia umowę przed skokiem do drugiego dnia, bo inaczej karta „Pierwszej nocy” zasłoniłaby przycisk diagnozy zapisu w Kronice.
- **Nagranie po zmianach**, na tych samych ustawieniach: stare menu nie pojawia się ani razu, ani przy pierwszym uruchomieniu, ani przy powrocie z zapisem.
