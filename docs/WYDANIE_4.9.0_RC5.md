# Przystań 4.9.0-rc.5: wieczorna karta opowieści

Podstawa: 4.9.0-rc.4 (`e4926f241775a3996b561a9bc7c6640159ab12d2`).

## Objaw
Wieczorne rozmowy, nocne zdania i wydarzenia dnia znikały po kilku sekundach. Po „Przewiń noc” migały tylko przez chwilę, więc nie dało się ich przeczytać.

## Co się zmieniło
**Wieczorem:**
- Gdy zapada noc, w tej samej chwili co przycisk „Przewiń noc”, czas staje i na dole ekranu pojawia się karta.
- Strony karty:
  1. **Wieczór**: rozmowy przy ogniu z imionami mówiących.
  2. **Dziś w osadzie**: sceny dnia w całości, a także narodziny, śluby, wyprawy, połów i polowanie.
  3. **Nocą**: nocne zdanie.
- Dotknięcie pokazuje następną stronę. Ostatnie zamyka kartę, a czas rusza w poprzednim tempie. Po zamknięciu można przewinąć noc.

**Rano:**
- Jeśli komuś coś się przyśniło, sen pokazuje się na takiej samej karcie.
- Dawne poranne „Wczoraj” zastąpiła wieczorna strona „Dziś w osadzie”.

**Kronika:**
- Wszystko trafia też do „Wieczorów przy ogniu”.
- Kartę można wyłączyć przyciskiem „Wieczorne opowieści na ekranie”. Wtedy wszystko zostaje tylko w Kronice.

## Technicznie
- `src/p_opowiesci.js`:
  - składa wieczór, dzień i noc naraz przy `T1−0,01`, czyli o tej samej porze, od której widać przycisk przewijania nocy;
  - zapisuje sceny dnia (`S.dzD`).
- Karta czeka, aż zamknie się otwarte wydarzenie albo panel.
- Przewijanie nocy nie kończy się samo, dopóki karta jest otwarta.
- Działa także w epoce IV.

## Testy
`tests/opowiesci.test.mjs` (3 przypadki)
