# Przystań 4.9.0-rc.17: swaty zostają, zaloty to dodatkowa droga

Podstawa: 4.9.0-rc.16 (`66ddc5cf94cda452d7b147b3ce53403ed0ec9253`).

## Zmiana
W 4.9.0-rc.16 zaloty przejęły swaty: para, którą dawniej swatano od razu, dostawała najpierw wątek zalotów z kartą decyzji. Decyzja z 28.10.2026: **swaty mają zostać, a romans to dodatkowa opcja.**

**Teraz:**
- swaty działają jak przed rc.16: para, która bardzo się lubi, dostaje swatów z chlebem i solą, a za kilka dni jest wesele, bez dodatkowej karty;
- zaloty to osobna, dodatkowa droga do ślubu. Zaczynają się od sceny daru, od przycisku „Pchnij ich ku sobie” albo czasem z samej więzi i mają swoją kartę w punkcie zwrotnym;
- swaty nie łączą tylko kogoś, kto jest w trakcie innej historii z trzecią osobą, żeby nie przerwać jej w połowie;
- para, która ma właśnie zaloty, może zostać wyswatana. Wątek kończy się wtedy weselem ze swatów („Swaty zrobiły swoje”) i trafia do Kroniki jak każdy inny.

## Testy
- `tests/watki.test.mjs`: przypadek o swatach napisany od nowa:
  - swaty wybierają parę po staremu, bez wymuszonego wątku;
  - swaty nie przerywają zalotów kogoś z trzecią osobą;
  - wyswatanie pary w trakcie zalotów kończy wątek weselem.
- Przebieg z botem, epoka II, 40 dni: 3 wątki (zaloty zakończone weselem, zgoda, rozejście), każdy z jedną kartą, bez błędów i ostrzeżeń.
