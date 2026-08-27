# Discovering the live data source

There does not appear to be a publicly documented, stable Ballclubz/WBSC developer API in the sources reviewed for this package. Therefore the package does **not** hard-code an unverified endpoint.

## Evidence found

- Ballclubz describes professional scoring, advanced stats, play-by-play and live streaming.
- WBSC Academy provides a Ballclubz scoring course for scorers.
- The open-source `keero/baseball-streaming` project documents fetching game data from a default base URL of `https://game.wbsc.org`, with a numeric game ID, and using the output in OBS. This is implementation evidence, not authorization or an official API contract.

## Safe discovery procedure

1. Obtain authorization from the competition/data owner and check applicable terms.
2. Open the public live game or box-score page in Chrome/Edge.
3. Open Developer Tools → Network, filter `Fetch/XHR`, then reload.
4. During a scoring change, inspect JSON responses that change. Look for score, inning, balls, strikes, outs, runners, lineups, play-by-play and stats.
5. Copy the **request URL** as shown by the browser. Identify the numeric game ID in the page URL or request.
6. Test the URL without copying session credentials. If it requires cookies/tokens, request supported access from the provider rather than bypassing controls.
7. Put the URL in `config/local.json` as `dataUrl`; replace the specific ID with `{gameId}`.
8. Start this service, compare `/api/raw` and `/api/state`, then adjust `normalizer.js` paths if needed.

## Browser-only vs local proxy

A pure browser overlay can be blocked by CORS and would expose authorization headers. This package uses a small local Node.js proxy and SSE so OBS loads ordinary HTML while the server performs controlled polling.
