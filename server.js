import express from 'express';
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
import {normalizeGame} from './normalizer.js'; import demo from './demo-data.js';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const cfg=JSON.parse(fs.readFileSync(process.env.WBSC_CONFIG || path.join(__dirname,'config/default.json'),'utf8'));
const app=express(); app.use(express.static(path.join(__dirname,'public')));
let raw=demo, state=normalizeGame(demo,cfg), error=null, lastUpdated=new Date().toISOString(); const clients=new Set();
function event(res,name,obj){res.write(`event: ${name}\ndata: ${JSON.stringify(obj)}\n\n`)}
function publish(){const payload={...state,meta:{...state.meta,lastUpdated,error,source:cfg.mode,stale:Date.now()-Date.parse(lastUpdated)>cfg.staleAfterMs}}; for(const c of clients) event(c,'game',payload)}
async function poll(){
 if(cfg.mode==='demo'){raw=demo; state=normalizeGame(raw,cfg); lastUpdated=new Date().toISOString(); error=null; publish(); return}
 if(!cfg.dataUrl){error='config.dataUrl is empty'; publish(); return}
 try{const url=cfg.dataUrl.replaceAll('{gameId}',encodeURIComponent(cfg.gameId)); const r=await fetch(url,{headers:{accept:'application/json',...cfg.requestHeaders}}); if(!r.ok) throw new Error(`Upstream HTTP ${r.status}`); raw=await r.json(); state=normalizeGame(raw,cfg); lastUpdated=new Date().toISOString(); error=null; publish()}catch(e){error=e.message; publish()}
}
app.get('/api/state',(q,r)=>r.json({...state,meta:{...state.meta,lastUpdated,error,source:cfg.mode}}));
app.get('/api/raw',(q,r)=>r.json(raw));
app.get('/api/health',(q,r)=>r.json({ok:!error,mode:cfg.mode,lastUpdated,error,clients:clients.size}));
app.get('/events',(q,r)=>{r.set({'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','Access-Control-Allow-Origin':'*'}); r.flushHeaders(); clients.add(r); event(r,'game',{...state,meta:{...state.meta,lastUpdated,error,source:cfg.mode}}); const ping=setInterval(()=>r.write(': ping\n\n'),15000); q.on('close',()=>{clearInterval(ping);clients.delete(r)})});
app.listen(cfg.port,()=>console.log(`WBSC OBS overlays: http://127.0.0.1:${cfg.port}/control.html`));
poll(); setInterval(poll,Math.max(500,cfg.pollMs));
