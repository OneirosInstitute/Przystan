# Przystań 4.9.0-rc.2: nikt nie utknie na plaży po Marzannie

Podstawa: 4.9.0-rc.1 (`0f8692778dbdf131bdb8a7310c6ce3334f27be20`).

## Objaw
Po topieniu Marzanny cała wieś stała półkolem na brzegu, także przez kolejne dni. Na karcie osoby było „Czeka · Brak drogi do celu”.

## Przyczyna
Gra ma dwie zasady chodzenia, które się rozjechały:
- **Mapa dostępności** (`reach`, liczona przy tworzeniu świata) uznawała pole za dostępne także wtedy, gdy dało się na nie wejść tylko na ukos, przeciskając się między dwoma polami bez przejścia.
- **Wyznaczanie drogi** (`astar`) takiego przejścia nie dopuszcza.

Na wyspie nr 2207 jest 41 takich pól, z czego 32 na plaży. Obrzęd ustawia ludzi półkolem przy wodzie i część półkola wypadała właśnie na nich. Potem:
- nikt z nich nie mógł wyznaczyć drogi;
- strażnik z 4.8.0-rc.1 ich nie ruszał, bo według mapy stali na dostępnym polu.

Zostało to odtworzone w teście. Na poprzedniej wersji 18 z 18 osób zostaje na takim polu, a 17 ma „Brak drogi do celu”. Na nowej wychodzą wszyscy.

## Naprawa
- `navReach()` liczy dostępność według reguł wyznaczania drogi. Jest przeliczana, gdy zmieni się mapa przejść, i najpóźniej co dwie minuty gry.
- Mapy świata nie zmieniono, więc istniejące wyspy, złoża i zasoby zostają takie same.
- Z nowej mapy korzystają:
  - miejsca w półkolu obrzędu Marzanny;
  - strażnik stojących;
  - powrót osoby na drogę po błędzie;
  - początek każdej trasy: kto stoi na takim polu, najpierw schodzi na najbliższe dostępne.

Zapis, w którym ludzie już stoją na plaży, naprawia się sam po wczytaniu.

## Testy
`tests/obrzedy-brzeg.test.mjs`: nowy przypadek, w którym wszyscy stoją na takich polach plaży (wyspa 2207). Po krótkim czasie wszyscy pracują i nikt nie czeka na drogę.
