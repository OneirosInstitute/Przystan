#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail
trap 'echo "STOP: wdrożenie zatrzymane. Nie pomijaj czerwonej bramki." >&2' ERR

MODE=publish
if [ "${1:-}" = '--prepare-only' ]; then MODE=prepare; shift; fi
[ "$#" -le 1 ] || { echo 'Użycie: bash WDROZ_TERMUX.sh [--prepare-only] [katalog-repo]'; exit 1; }
PACKAGE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
EXPECTED_COMMIT='492e8bfd1a8ba058f467701115f1e74146343180'
REPOSITORY="${1:-}"
if [ -z "$REPOSITORY" ]; then
 if [ -d "$HOME/Przystan/.git" ]; then REPOSITORY="$HOME/Przystan";
 elif [ -d "$HOME/dev/Przystan/.git" ]; then REPOSITORY="$HOME/dev/Przystan";
 else
  mkdir -p "$HOME/dev"
  git clone git@github.com:OneirosInstitute/Przystan.git "$HOME/dev/Przystan"
  REPOSITORY="$HOME/dev/Przystan"
 fi
fi
[ -d "$REPOSITORY/.git" ] || { echo "STOP: brak repozytorium $REPOSITORY"; exit 1; }
REPOSITORY="$(cd -- "$REPOSITORY" && pwd)"
[ "$PACKAGE_DIR" != "$REPOSITORY" ] || { echo 'STOP: uruchom skrypt z wypakowanej paczki poza repozytorium.'; exit 1; }
node "$PACKAGE_DIR/tools/verify-package.cjs"
cd "$REPOSITORY"
node "$PACKAGE_DIR/tools/deploy-check.cjs" --before-pull
git fetch origin main
[ "$(git rev-parse origin/main)" = "$EXPECTED_COMMIT" ] || { echo 'STOP: main zmienił się od przygotowania paczki. Potrzebne ponowne scalenie.'; exit 1; }
git merge --ff-only origin/main
node "$PACKAGE_DIR/tools/deploy-check.cjs"
cp -r "$PACKAGE_DIR"/. "$REPOSITORY"/
node tools/verify-package.cjs
npm run build
npm run test:install
npm run test:runtime
node tools/verify-package.cjs
git diff --check
git status --short
if [ "$MODE" = prepare ]; then
 echo 'PREPARE PASS: pliki skopiowane, testy zielone; bez commitu i push.'
 exit 0
fi
git add -- .github .gitignore KSIEGA.md README.md WDROZ_TERMUX.sh assets build.js docs package.json railway.json release-manifest.json server.js src tests tools
git diff --cached --quiet && { echo 'STOP: brak zmian do commitu.'; exit 1; }
git commit -m '4.0.0-rc.10: zapasy, SI, ludzie i hardening gospodarki'
git push origin main
git fetch origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]
[ -z "$(git status --porcelain)" ]
git status
echo 'CHECKPOINT PASS: working tree clean, HEAD == origin/main'
