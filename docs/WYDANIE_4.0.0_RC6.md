# Przystań 4.0.0-rc.6

Kumulatywna paczka zawiera RC5 FAST1 oraz konsolidację doby i hardening zegara, ruchu i danych pracy. Klasyczne menu z Zadaniami pozostaje. Zapis doby wykonywany jest po dziennych aktualizacjach. Szczegóły: `AUDYT_HARDENING_RC6.md`; następny etap: `PLAN_ROZWOJU_PO_RC6.md`.

## Termux

Pobierz `Przystan_4.0.0_RC6_HARDENING_TERMUX.zip` do Pobranych, następnie:

```bash
PRZYSTAN_STAGE="$(mktemp -d "$HOME/przystan-rc6-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC6_HARDENING_TERMUX.zip" -d "$PRZYSTAN_STAGE"
bash "$PRZYSTAN_STAGE/Przystan_4.0.0_RC6_HARDENING/WDROZ_TERMUX.sh"
```

Instalator sprawdza integralność, repozytorium OneirosInstitute/Przystan, gałąź main, czysty stan i bazę `2ad9ac443492552da5690146b734c4600b295db7`. Następnie kopiuje pliki, buduje grę, wykonuje regresje instalacyjne i próbę silnika. Dopiero po przejściu kontroli tworzy commit i wysyła go do origin/main. Nie omijaj zatrzymania przy innej bazie repozytorium; wymaga ona scalenia zmian.

Tryb `--prepare-only` wykonuje przygotowanie i weryfikację bez commitu i wysyłania. Szybszy harmonogram testów z RC5 FAST1 pozostaje; nie usuwa sprawdzanych przypadków. Dwie symulacje po 1500 dni wykonywane są przed wydaniem i udokumentowane w `weryfikacja6/`.

Podczas przygotowania RC6 potwierdzono wdrożenie RC5 na main. Paczka została oparta na tym aktualnym commicie; pliki gry RC5 były identyczne z bazą przeglądu. RC6 zawiera również przyspieszenie FAST1.
