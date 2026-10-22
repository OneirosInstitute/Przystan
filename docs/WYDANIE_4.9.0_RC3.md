# Przystań 4.9.0-rc.3: zejście z odciętej plaży także nocą

Podstawa: 4.9.0-rc.2 (`0b1587e31c6b32cbadc224d4c77b8ec6eb679bd5`).

## Objaw
Po Marzannie ludzie nadal stali na plaży. Nocą „szli do chat”, a rano znów siedzieli na brzegu.

## Przyczyna
Działały dwa mechanizmy:
- **Na starej wersji** osoba na odciętym polu nie mogła wyznaczyć drogi. Nocą przechodziła w sen w miejscu: gra pokazywała ją w chacie, ale osoba zostawała na plaży. Rano wstawała tam, gdzie spała.
- **Na 4.9.0-rc.2** droga była już wyznaczana od najbliższego dostępnego pola. Pierwszy krok wymagał jednak przejścia na ukos między dwiema przeszkodami, a sprawdzanie ruchu go zabraniało. Droga była więc wyznaczana w kółko i do rana nikt nie zrobił kroku. Dopiero strażnik w godzinach pracy przenosił ludzi.

## Naprawa
- Wyznaczanie drogi (`astar`) i sprawdzanie ruchu pozwalają na krok na ukos tylko z pola odciętego od wsi. Wejść tak na takie pole nadal nie można, więc nikt nie zostanie tam zaprowadzony.
- Wieczorem cała grupa schodzi z plaży w kilka chwil i idzie do ogniska oraz do domów.

## Testy
`tests/obrzedy-brzeg.test.mjs` sprawdza wieczorem na wyspie 2207:
- czy wszyscy schodzą z odciętych pól przed nocą;
- czy żadna droga z wioski nie prowadzi na takie pole.
