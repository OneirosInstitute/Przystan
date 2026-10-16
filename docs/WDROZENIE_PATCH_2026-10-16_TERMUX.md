# Przystań S01, wdrożenie przez Termux

**Ważne:** pakiet ma pliki w katalogu głównym ZIP, bez katalogu `Przystan-main/`.
Źródłem wdrożenia jest aktualne repozytorium `~/dev/Przystan`, a nie starsza kopia lokalna.
Wariant wymaga zatwierdzenia testu WebGL/dotyku na urządzeniu przed pushem produkcyjnym.

## 1. Przygotowanie

```bash
pkg install -y git nodejs unzip rsync
cd ~/dev/Przystan || return 1
git fetch origin || return 1
[ "$(git branch --show-current)" = main ] || { echo 'STOP: branch'; return 1; }
[ -z "$(git status --porcelain)" ] || { echo 'STOP: uncommitted changes'; return 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo 'STOP: local != origin/main'; return 1; }
```

## 2. Kontrola archiwum (bez zmieniania repo)

```bash
ARCHIVE="$HOME/storage/downloads/Przystan_S01_PRODUCTION_CANDIDATE_2026-10-16.zip"
STAGE="$HOME/przystan_s01_final_stage"
[ -f "$ARCHIVE" ] || { echo 'STOP: missing ZIP'; return 1; }
mkdir -p "$STAGE"
unzip -t "$ARCHIVE" || return 1
unzip -oq "$ARCHIVE" -d "$STAGE" || return 1
cd "$STAGE" || return 1
node tools/verify-package.cjs || return 1
npm run build || return 1
npm test || return 1
npm run test:runtime || return 1
```

## 3. Bezpieczna synchronizacja, po akceptacji testu urządzenia

```bash
cd ~/dev/Przystan || return 1
[ -z "$(git status --porcelain)" ] || { echo 'STOP: dirty repo'; return 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo 'STOP: origin advanced'; return 1; }
mkdir -p "$HOME/przystan_backup_s01"
git archive HEAD | tar -x -C "$HOME/przystan_backup_s01" || return 1
rsync -a --exclude='.git' --exclude='node_modules' --exclude='*.bak' "$STAGE/" ./ || return 1
git status --short
npm run build && npm test && npm run test:runtime && node tools/verify-package.cjs || { echo 'STOP: failed gate'; return 1; }
```

## 4. Checkpoint Git, tylko po zielonej bramce i testach urządzenia

```bash
cd ~/dev/Przystan || return 1
git diff --check || return 1
git add -A
git diff --cached --stat
git commit -m 'Przystan: S01 NPC priority integration' || return 1
git push origin main || return 1
git status
[ -z "$(git status --porcelain)" ] || { echo 'STOP: dirty after push'; return 1; }
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo 'STOP: origin mismatch'; return 1; }
```

**Nie kopiuj kopii zapisu gry ani katalogu `data/` między repozytoriami.**
