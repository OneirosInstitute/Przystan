# Przystań

Spokojna gra o osiemnastu rozbitkach, którzy budują osadę na dzikiej, nieznanej wyspie. Izometryczny widok 3D (Three.js), czas rzeczywisty, pory roku, pokolenia i wiedza przekazywana od mistrza do ucznia. Gra działa w przeglądarce i instaluje się na telefonie jako aplikacja na pełnym ekranie (PWA), także bez internetu.

## Uruchomienie

```bash
npm start          # buduje dist/ i uruchamia serwer na http://localhost:3000
npm run build      # tylko buduje dist/
```

Nie ma zależności do instalowania. Wystarczy Node.js 18 lub nowszy.

## Railway

1. W Railway: **New Project → Deploy from GitHub repo → przystan**.
2. Railway sam wykryje Node.js i użyje `railway.json` (budowa: `npm run build`, start: `npm start`).
3. W ustawieniach usługi: **Settings → Networking → Generate Domain**.
4. Otwórz adres `https://…up.railway.app` w Chrome na telefonie i wybierz „Zainstaluj grę na telefonie”.

Każdy `git push` na gałąź `main` wdraża nową wersję. Zainstalowana gra pobierze ją przy następnym uruchomieniu z internetem.

## Struktura

- `src/` – kod gry podzielony na części, sklejane w tej kolejności przez `build.js`:
  - `p_head.html` – wygląd i układ interfejsu,
  - `p_const.js` – ikony, budynki, zasoby, pogoda,
  - `p_mid.js` – teren, woda, biomy,
  - `p_rest.js` – świat, modele, ludzie, logika, interfejs,
  - `p_map.js` – regiony i minimapa,
  - `p_tech.js` – drzewka postępu,
  - `p_exp.js` – atlas natury i wyprawy,
  - `p_v8.js` – woda, pożary, rozbudowa, obyczaje i wiec, prośby, dymki,
  - `p_bld.js` – poziomy budynków, rozbudowy i nowe budynki wspólnoty,
  - `p_story.js` – wydarzenia, cele, dźwięk,
  - `p_end.js` – atmosfera, pętla gry, start, pełny ekran.
- `assets/` – ikony, zrzuty ekranu do okna instalacji, Three.js r149.
- `build.js` – składa `dist/index.html`, manifest i service worker.
- `server.js` – serwer plików bez zależności.
