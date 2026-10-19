# Przystań 4.0.0-rc.10

Aktualna paczka: **Przystan_4.0.0_RC10_MASTER_TERMUX.zip**.

[Wdrożenie](docs/WYDANIE_4.0.0_RC10.md) · [Audyt](docs/AUDYT_MASTER_RC10.md) · [Weryfikacja](docs/WERYFIKACJA_4.0.0_RC10.md).

Kumulatywne RC10 zachowuje klasyczne menu i wszystkie poprawki RC9. Budynki od razu pokazują opis, koszt i akcję. Zapasy mają podpisany zielony/czerwony bilans produkcji oraz rozwijane szczegóły. Nowe zmiany obejmują lokalne ustępowanie postaci, ochronę korytarzy przy budowie, odprawy i bezpieczne powroty wypraw, odwoływanie niewyruszonej załogi ze zwrotem udokumentowanych kosztów, ruch i wygląd mieszkańców, ograniczone budżetem detale świata oraz wyjaśnienia braków gospodarki IV. Istniejące rody i specjalizacje są zachowane. Starsze niejednoznaczne flagi away nie dostają odtworzonych nagród ani fikcyjnego zwrotu.

Budowanie: `npm run build`. Kontrole instalacyjne: `npm run test:install`, `npm run test:runtime`. Pełna pula z długimi scenariuszami pokoleń: `npm test`. Sprawdzenie paczki: `node tools/verify-package.cjs`.
