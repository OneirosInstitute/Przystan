# Wdrożenie Przystań 3.4.1 przez Termux

Pobierz `Przystan_3.4.1_STABILIZACJA_TERMUX.zip` do `~/storage/downloads/`.
Skrypt wybiera istniejące `~/Przystan` lub `~/dev/Przystan`; przy braku obu
klonuje wskazane repo do `~/dev/Przystan`. Wymaga działającego SSH do GitHub,
Node.js, npm, Git i unzip. Nie ma zależności npm do instalowania.

Repozytorium musi być czyste. Po pobraniu `main` bramka sprawdza dokładny commit
bazowy; zatrzymuje się, jeżeli w międzyczasie pojawiły się nowe zmiany.
Każde niepowodzenie zatrzymuje kolejne polecenia. Nie ma force pusha ani resetu.

```bash
(
set -e
if [ -d "$HOME/Przystan/.git" ]; then
  cd "$HOME/Przystan"
elif [ -d "$HOME/dev/Przystan/.git" ]; then
  cd "$HOME/dev/Przystan"
else
  mkdir -p "$HOME/dev"
  git clone git@github.com:OneirosInstitute/Przystan.git "$HOME/dev/Przystan"
  cd "$HOME/dev/Przystan"
fi
test -z "$(git status --porcelain)"
git switch main
unzip -q -o "$HOME/storage/downloads/Przystan_3.4.1_STABILIZACJA_TERMUX.zip"
node Przystan_3.4.1_STABILIZACJA/tools/deploy-check.cjs --before-pull
git pull --ff-only origin main
node Przystan_3.4.1_STABILIZACJA/tools/deploy-check.cjs
cp -r Przystan_3.4.1_STABILIZACJA/. .
node tools/verify-package.cjs
rm -rf Przystan_3.4.1_STABILIZACJA
npm run build
npm test
npm run test:runtime
git status
git add .
git commit -m "3.4.1: stabilizacja zapisu, kampanii, gospodarki i API"
git push origin main
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
test -z "$(git status --porcelain)"
git status
)
```

W tym przygotowaniu nie wykonano zdalnego commita, pusha ani wdrożenia usługi.
Powyższe polecenia wykonują je dopiero na urządzeniu użytkownika. Po pushu
warto sprawdzić wynik CI i przeprowadzić próbę Chrome/PWA na telefonie.
