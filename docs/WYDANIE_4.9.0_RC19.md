# Przystań 4.9.0-rc.19: rywalizacja, tajemnica, tęsknota za domem

Podstawa: 4.9.0-rc.18 (`c0b39c7e8cf53d21a212ded93062fc2cc302ff7c`).

Czwarty pakiet ze „Scenariusza życia gry”. Dochodzą trzy rodzaje historii. Ich zakończenia zostawiają w osadzie przezwiska i pieśni, a wszystkie historie trafiają do Księgi rozbitków.

## Rywalizacja
- Dwoje najlepszych w tym samym fachu, z różnych rodzin, na podobnym poziomie (co najmniej 2, różnica najwyżej jeden stopień).
- Zaczyna się od zakładu albo przechwałki przy studni. Potem ludzie porównują ich robotę (oboje uczą się szybciej), a rodziny zaczynają kibicować.
- Karta: konkurs na najbliższym święcie (Kupała, dożynki, Szczodre Gody albo powitanie wiosny, zależnie od pory roku) albo podział pracy.
  - Zwycięzca konkursu zyskuje szacunek osady i przezwisko od fachu: rybak to „Szczupak”, kowal to „Młot”, krawiec to „Złota Igła”.
  - Przegrany podaje rękę albo się obraża.

## Tajemnica
Jedna osoba coś ukrywa, a druga to odkrywa. Są trzy rodzaje tajemnic:
- **Zapasy.** Ze spiżarni ubywa jedzenia, bo matka albo ojciec bierze je dla głodnych dzieci. Karta: wybaczyć po cichu, oddać sprawę starszym (wstyd i mniej szacunku, bez wygnania) albo pomóc rodzinie z zapasów osady.
- **Ukryta choroba.** Ktoś kaszle po nocach i prosi, żeby nikomu nie mówić. Karta: powiedzieć starszym i leczyć (dwa zioła, jeśli są) albo dotrzymać słowa.
- **Nocne wyjścia.** Ktoś po kryjomu nosi drewno i jedzenie samotnej starszej osobie. Karta: opowiedzieć o tym przy ogniu (szacunek) albo zachować sekret i pomagać razem.

## Tęsknota za domem
- Tylko w epoce I i tylko rozbitkowie, którzy pamiętają dom za morzem, najczęściej najstarsi. Każdy przeżywa ją najwyżej raz.
- Zaczyna się od patrzenia co wieczór na morze. Potem przychodzą opowieści o rzece i lipie przed chatą, a w końcu znoszenie desek z wraku.
- Karta:
  - **zostać i założyć sad**, z przezwiskiem „Sadownik” albo „Sadowniczka”;
  - **opowiedzieć o domu przy ogniu**, po czym powstaje pieśń „O domu za morzem”;
  - **pozwolić odpłynąć**. Rozbitek znika z osady na zawsze i zabiera łódź osady albo 20 drewna na łódź z wraku. Jego małżonek jest wolny, bliska osoba długo to pamięta, a powstaje pieśń „… odpływa”.
- Jeśli rozbitek umrze, zanim zapadnie decyzja, bliska osoba dostaje po nim łódkę z kory jako trwałą pamiątkę.

## Przezwiska, pieśni, Księga rozbitków
- Przezwisko jest na całe życie, a każdy dostaje najwyżej jedno. Widać je na karcie osoby (Zwą go: „Szczupak”) i w dzienniku.
- Księga rozbitków ma trzy nowe działy: HISTORIE (ostatnie zakończone historie z ich zakończeniem), PRZEZWISKA i ODPŁYNĘLI ZA MORZE.
- Przy ogniu ludzie rozmawiają o rywalach, o tym, że ktoś chodzi nocami, o kimś, kto patrzy na morze, i o tych, którzy odpłynęli („Ciekawe, czy Wojsław dopłynął do domu”).

## Rytm
Ten sam rodzaj historii wraca najwcześniej po kilku dniach: rywalizacja po 8, tajemnica po 10, tęsknota po 15. Nadal biegną najwyżej 3 historie naraz, a karta pojawia się najwyżej raz dziennie.

## Testy
- `tests/watki4.test.mjs` (nowy, 11 przypadków):
  - rywalizacja z konkursem i przezwiskiem;
  - rywalizacja zakończona podziałem pracy;
  - tajemnica zapasów z pomocą osady i z osądem starszych (bez wygnania);
  - ukryta choroba leczona ziołami;
  - nocne wyjścia;
  - gra znajduje różne rodzaje tajemnic;
  - tęsknota tylko u rozbitków w epoce I, z odpłynięciem (osoba znika, małżonek wolny, pieśń, łódź, Księga);
  - sad z przezwiskiem;
  - pamiątka po śmierci;
  - plotki wypełnione do końca.
- Przebiegi z botem, każdy bez błędów i ostrzeżeń:
  - epoka I, 80 dni: 23 historie, w tym 4 tajemnice, 4 rywalizacje i 3 tęsknoty;
  - epoka II, 60 dni: 19;
  - epoka III, 50 dni: 11.
  Bez odstępu 2,5 dnia między nowymi historiami w epoce I było ich 30.
- Przeglądarka (Chromium, 412×870): karty rywalizacji, tajemnicy i tęsknoty, karta osoby, Kronika i Księga bez błędów konsoli.
