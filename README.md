# Przystań 4.5.0-rc.1

Spokojna gra o rozbitkach, którzy budują osadę na dzikiej wyspie (PWA, Three.js).

4.5.0-rc.1 to wyspa 384 × 384: dawna wyspa zostaje bez zmian pośrodku (z tymi samymi złożami na początek gry), a wokół niej Cicha Zatoka, trzy przesmyki i nowy ląd z 17 krainami, dwiema rzekami i dużymi złożami, które ciągną osadę dalej, gdy złoża dawnej wyspy się kończą. Drobna przyroda rysuje się tylko blisko kamery, stare zapisy przechodzą same, Budowa znów ma przyciski rodzajów, a księga dostała haft i drewno.

4.4.0-rc.2 dodał krainom koszty: wylewy na nizinach, przymrozki w winnicach, gorączka bagienna, kaszel górniczy, wypas, który zjada łąki barciom. 4.4.0-rc.1 związał folwarki epoki IV z ziemią i złożami: huta tylko przy rudzie, z szybem do głębokiego złoża, tartak w starym lesie, garncarze przy glinie; formularz pokazuje, co w krainie pasuje.

4.3.0-rc.2 dodał wyszukiwarkę w Ludziach i usuwa szary pas w widoku całej wyspy. 4.3.0-rc.1 dał krainom charakter: dziesięć ról (Żyzne Niziny, Kwietne Łąki, Stare Bory, Zagłębie i inne) na każdej wyspie. Budynki pracują szybciej w swojej krainie, pola na nizinach rodzą więcej, a łąki kwitną.

4.2.0-rc.1 uporządkował menu: pięć działów (Osada, Ludzie, Budowa, Zadania, Wiedza) z widokami w jednym rzędzie, wyszukiwarka budowli i „Możesz postawić teraz”.

4.1.0-rc.1 dodał złoża: węgiel, torf, ruda, kamień i glina w dużych, skupionych złożach z warstwami, które się wyczerpują, oraz kopalnię rudy, szyb węglowy, łom kamienia i gliniak stawiane na odkrytym złożu.

RC11 naprawił zatory ludzi z RC9–RC10 i dodał: drogi wydeptywane z ruchu i utwardzane przez budowniczych (Budowa → Drogi), rozbudowę domów zawsze z przyciskiem i listą wymagań, dymnik nad wiatą, zorzę zakotwiczoną w świecie oraz po trzy zadania główne na epokę w zakładce Zadania.

[Wydanie 4.5.0-rc.1](docs/WYDANIE_4.5.0_RC1.md) · [Wydanie 4.4.0-rc.1](docs/WYDANIE_4.4.0_RC1.md) · [Wydanie 4.3.0-rc.1](docs/WYDANIE_4.3.0_RC1.md) · [Wydanie 4.2.0-rc.1](docs/WYDANIE_4.2.0_RC1.md) · [Wydanie 4.1.0-rc.1](docs/WYDANIE_4.1.0_RC1.md) · [Wydanie RC11](docs/WYDANIE_4.0.0_RC11.md) · [Projekt wyspy, złóż i menu](docs/PROJEKT_WYSPY_5.md) · [Księga gry](KSIEGA.md)

Budowanie: `npm run build`. Testy: `npm run test:install`, `npm run test:runtime`, pełna pula `npm test`. Sprawdzenie paczki: `node tools/verify-package.cjs`.
