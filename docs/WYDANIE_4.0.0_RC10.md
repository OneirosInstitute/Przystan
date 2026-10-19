# Wdrożenie RC10 MASTER — Termux

Paczka kumulatywna na main RC9 `492e8bfd1a8ba058f467701115f1e74146343180`. Instalator nie nadpisuje własnych zmian i odmawia kopiowania, jeżeli main przesunął się od przygotowania paczki. Nie obchodzić czerwonej bramki ani nie kasować danych gry. Zapis przed aktualizacją wykona aplikacja; można dodatkowo pobrać plik z Kronika → zapis.

Pobierz Przystan_4.0.0_RC10_MASTER_TERMUX.zip do folderu Download telefonu. Następnie:

```bash
PRZYSTAN_STAGE="$(mktemp -d "$HOME/przystan-rc10-XXXXXX")"
unzip -q "$HOME/storage/downloads/Przystan_4.0.0_RC10_MASTER_TERMUX.zip" -d "$PRZYSTAN_STAGE"
bash "$PRZYSTAN_STAGE/Przystan_4.0.0_RC10_MASTER/WDROZ_TERMUX.sh"
```

Skrypt odnajduje repo w ~/Przystan albo ~/dev/Przystan, a przy braku klonuje OneirosInstitute/Przystan. Sprawdza integralność, tożsamość repo, main, bazę i czystość. Buduje, wykonuje kontrole instalacyjne i silnika, ponownie sprawdza integralność, następnie commit, push i porównanie HEAD z origin/main. Końcowy komunikat: CHECKPOINT PASS: working tree clean, HEAD == origin/main.

Opcjonalna próba bez commitu i push: `bash /ścieżka/do/WDROZ_TERMUX.sh --prepare-only /ścieżka/do/repo`. Taka próba kopiuje pliki; jest przeznaczona na kopię repo, nie jako dodatkowy krok przed normalnym wdrożeniem.

Po aktualizacji zamknij i otwórz grę. W Kronika → Opcje gry sprawdź 4.0.0-rc.10. Aktualizacja PWA zapisuje stan przed ponownym załadowaniem. Jeśli zapis się nie powiedzie, pozostawia działającą grę i pozwala ponowić operację. Nie czyść pamięci aplikacji ani localStorage.

Bateria, temperatura, dotyk i zachowanie po ubiciu procesu wymagają odbioru na fizycznym Androidzie. Wyniki automatyczne i ich granice: WERYFIKACJA_4.0.0_RC10.md.
