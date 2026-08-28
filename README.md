# WBSC OBS Static Suite

Pacchetto solo HTML, CSS e JavaScript. Ogni overlay è indipendente ed è caricabile come **Browser Source > File locale** in OBS.

## Configurazione

Aprire `config.js` e cambiare:

```js
window.WBSC_CONFIG = {
  gameId: '204415',
  refreshMs: 1000
};
```

Il client legge `latest.json` come testo e usa il numero restituito per scaricare `play{numero}.json`. Il file snapshot viene scaricato soltanto quando il numero cambia.

## Moduli

- `overlays/scorebug.html`
- `overlays/linescore.html`
- `overlays/batting.html`
- `overlays/pitching.html`
- `overlays/defense.html`
- `overlays/spraychart.html`
- `overlays/playbyplay.html`

## OBS

Aggiungere una Browser Source, selezionare **File locale**, scegliere un modulo e impostare una tela 1920 x 1080. Mantenere la trasparenza della sorgente.

## Note sui dati

- `latest.json` viene interpretato come numero snapshot, non come JSON.
- I moduli mantengono in memoria l'ultimo snapshot valido in caso di errore temporaneo.
- L'ERA mostrata viene letta dal feed. La colonna ER non è presente nell'esempio fornito: il modulo applica una stima `R - E`, che non equivale sempre agli earned runs ufficiali. Se il feed espone un campo ER dedicato, sostituire la formula nel file `pitching.html`.
- La spray chart usa `hd` e `hp` dei play con `r1 = 9`. Verde indica descrizioni contenenti hit/reaches; rosso indica gli altri ball-in-play. È una visualizzazione euristica.
- Verificare autorizzazioni, condizioni d'uso e frequenza consentita dal fornitore dei dati.
