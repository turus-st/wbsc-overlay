# WBSC Game Data → OBS Browser Overlays

A ready-to-run Node.js package that polls a configurable live JSON source, normalizes it, and pushes updates to transparent HTML/CSS/JS overlays through Server-Sent Events (SSE).

## Quick start

1. Install **Node.js 20+**.
2. In this folder run:
   ```bash
   npm install
   npm start
   ```
3. Open `http://127.0.0.1:3199/control.html`.
4. In OBS add a **Browser Source** for each required module, for example `http://127.0.0.1:3199/scoreboard.html` at 1920×1080.

It starts in `demo` mode, so every overlay works immediately.

## Connect live WBSC / Ballclubz data

Copy `config/default.json` to `config/local.json`, set `mode` to `live`, paste the observed JSON URL into `dataUrl`, and start with:

**Windows PowerShell**
```powershell
$env:WBSC_CONFIG="config/local.json"; npm start
```

**macOS/Linux**
```bash
WBSC_CONFIG=config/local.json npm start
```

`{gameId}` in `dataUrl` is replaced automatically. Example template only, not a guaranteed public WBSC endpoint:
```json
"dataUrl": "https://game.wbsc.org/.../{gameId}/..."
```

See `docs/LIVE-DATA-DISCOVERY.md` for a source-safe discovery procedure. If cookies or an API key are required, configure only the minimum required headers in `requestHeaders`; do not publish secrets or embed them in overlay HTML.

## Included modules

- `scoreboard.html`: home/away names, score, inning, count, outs, runners
- `lineups.html`: both lineups
- `situation.html`: inning half, count, bases, current batter/pitcher, latest play
- `innings.html`: inning-by-inning line score, R/H/E
- `stats.html`: all team-stat keys supplied by the upstream payload
- `control.html`: status, links, preview and diagnostics

## Adapting a different payload

Open `/api/raw` and `/api/state`. If a field is missing, add its source path to the relevant `first(...)` path list in `normalizer.js`. The normalizer intentionally supports multiple common field names and returns placeholders rather than breaking the overlay.

## Reliability and security

The Node proxy avoids exposing credentials to OBS, reduces browser CORS problems, retains the last valid state when polling fails, displays an error badge, and exposes `/api/health`. Keep the server on `127.0.0.1` unless you deliberately secure it for LAN/public access. Confirm your right to access and rebroadcast the game data and comply with WBSC/Ballclubz terms and rate limits.

## Test
```bash
npm test
```
