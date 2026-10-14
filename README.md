# Namenssuche für den Camper-Bus 🚐

Kleine Web-App (GitHub Pages), auf der Freunde Namen für den Camper (Ford Tourneo Connect mit Campingbox & Dachzelt) vorschlagen und per 👍 abstimmen. Vorschläge landen über Google Apps Script in einem Google Sheet.

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette Seite (Formular, Ranking, Teilen, Hell/Dunkel, Offline-Hinweis) |
| `sw.js` | Service Worker für Offline/PWA – bei Änderungen Version `V` hochzählen |
| `manifest.json` | PWA-Manifest |
| `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App-Icons |
| `logo.jpg` | Camper-Bild oben auf der Seite (360 × 360 px) |

## Einstellungen (oben im `<script>` der index.html)

- `sheetApiUrl` – URL der Apps-Script-Web-App
- `VOTING_END` – Ende der Abstimmung, z. B. `'2026-11-30T20:00:00+01:00'`. Leer = kein Enddatum. Danach sind Formular und Daumen gesperrt und der Gewinner steht oben.
- `SHARE_TEXT` – Text für den „Link teilen“-Button
