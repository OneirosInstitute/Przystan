# Przystań 4.9.0-rc.26: włosy i chusty

Podstawa: 4.9.0-rc.25 (`e9b25174c0c3fe733e446a7a3df27132329f6806`).

Poprawka po grze na telefonie: dzieci i kobiety wyglądały na „pół łyse”.

## Co było nie tak
- **Chusta zakrywała całą głowę razem z twarzą.** Przy jasnych, lnianych chustach z daleka było widać tylko gładką, jasną kulę z opaską, jak łysą czaszkę. Dotyczyło to obu modeli ludzi: dokładnego i uproszczonego (najniższa jakość grafiki).
- **Włosy przebijała wydłużona głowa.** Głowa jest lekko wydłużona: u dorosłych do 1,15 raza, u dzieci 1,2 raza. Włosy były zwykłą półkulą, więc czubek i tył głowy przebijały przez nie, najmocniej u dzieci.

## Teraz
- **Chusta obejmuje twarz.** Zakrywa czoło, uszy i tył głowy, a oczy, nos i usta są widoczne. Haftowana opaska biegnie po brzegu chusty.
- **Włosy mają kształt głowy.** Włosy pasują kształtem do głowy każdej osoby, więc głowa nigdzie przez nie nie przebija.
- **Włosy z tyłu sięgają karku.** U kobiet bez chusty, u dziewczynek, u mężczyzn i u chłopców. Brzeg włosów kobiet jest nad brwiami.

## Sprawdzenie
- Zbliżenia modeli w przeglądarce (Chromium) z kilku stron: kobieta w chuście, kobieta bez chusty, dziewczynka, chłopiec, mężczyzna z brodą, starsza kobieta. Bez błędów konsoli.
- Kontrola w GitHubie: wszystkie dotychczasowe testy.

Bogatsze modele ludzi (stroje, fryzury, twarze) to osobny, większy pakiet na później.
