# Przystań, wdrożenie z Termux

Paczka ma pełną strukturę `Przystan-main/` i służy do podmiany roboczych plików w czystym repo po utworzeniu kopii zapasowej. Wymagane `node >=18`, `unzip`, `git` oraz skonfigurowany dostęp SSH GitHub.

```bash
pkg install -y git nodejs unzip rsync
cd ~/Przystan  # zamień ścieżkę na rzeczywistą lokalizację repo
[ "$(git branch --show-current)" = main ] || { echo 'Nie jesteś na main'; exit 1; }
git fetch origin
[ -z "$(git status --porcelain)" ] || { echo 'Drzewo nie jest czyste'; exit 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo 'Local main nie jest zgodny z origin/main'; exit 1; }
mkdir -p "$HOME/przystan_patch_restore"
cp -a . "$HOME/przystan_patch_restore/Przystan_$(date +%Y%m%d_%H%M%S)"
rm -rf "$HOME/przystan_patch_unpack"
mkdir -p "$HOME/przystan_patch_unpack"
unzip -q "$HOME/storage/downloads/Przystan_RELEASE_2026-10-16.zip" -d "$HOME/przystan_patch_unpack"
rsync -a --exclude='.git' --exclude='node_modules' "$HOME/przystan_patch_unpack/Przystan-main/" ./
npm run build && npm test && npm run test:runtime && node tools/verify-package.cjs || { echo 'STOP: czerwona bramka'; exit 1; }
git status
git add -A
git commit -m "Przystan: misje budynkow, ognisko, autosave i UI"
git push origin main
git status
[ -z "$(git status --porcelain)" ] || { echo 'Drzewo nieczyste po wdrożeniu'; exit 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo 'Brak zgodności z origin/main'; exit 1; }
```

OSTRZEŻENIE: zweryfikuj ścieżkę repo, że `/storage/downloads/` zawiera właściwy plik ZIP, oraz zrób niezależny eksport zapisu gry przed testem wersji na produkcji. Na telefonie sprawdź 3 ponowne uruchomienia po autosave, animację zorzy, dotyk i zużycie baterii.
