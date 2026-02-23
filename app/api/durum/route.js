import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ara = searchParams.get('ara');

  // IP Sorgu (Gerçek zamanlı OA kontrolü)
  if (ara) {
    const data = await redis.get(`last_seen_oa:${ara}`);
    return NextResponse.json({ ip: ara, son_oa_giris: data || "OA üzerinde kaydı yok" });
  }

  // Verileri Topla
  const totalReq = await redis.get('total_req_count') || 0;
  
  const oaTotal = await redis.get('oa_total_hits') || 0;
  const oaUnique = await redis.scard('oa_unique_ips') || 0;
  
  const extTotal = await redis.get('ext_total_hits') || 0;
  const extUnique = await redis.scard('ext_unique_ips') || 0;

  const logs = await redis.lrange('global_logs', 0, 15) || [];

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8"><title>Pulsar Analiz</title>
      <style>
        body { background:#0a0a0a; color:#eee; font-family:sans-serif; padding:20px; }
        .grid { display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px; }
        .card { background:#111; padding:15px; border-radius:10px; border:1px solid #333; }
        .oa { border-top: 4px solid #00ffcc; }
        .ext { border-top: 4px solid #ff4444; }
        h2 { margin:0; font-size:1rem; color:#888; }
        .val { font-size:1.8rem; font-weight:bold; color:#fff; display:block; margin:5px 0; }
        input { padding:10px; background:#000; border:1px solid #444; color:#fff; border-radius:5px; }
        button { padding:10px; background:#00ffcc; border:none; border-radius:5px; font-weight:bold; cursor:pointer; }
        li { background:#161616; padding:10px; margin-bottom:5px; list-style:none; border-radius:5px; font-size:0.9rem; }
        b { color:#00ffcc; }
      </style>
    </head>
    <body>
      <h1>📊 Tema İstatistikleri</h1>
      <div class="card" style="margin-bottom:15px; text-align:center;">
        <h2>GENEL TOPLAM İSTEK</h2>
        <span class="val">${totalReq}</span>
      </div>

      <div class="grid">
        <div class="card oa">
          <h2>📺 OpenAnime Kullanıcıları</h2>
          <span class="val">${oaUnique} Kişi</span>
          <small>Toplam: ${oaTotal} İstek</small>
        </div>
        <div class="card ext">
          <h2>🌍 Dış / Direkt İstekler</h2>
          <span class="val">${extUnique} IP</span>
          <small>Toplam: ${extTotal} İstek</small>
        </div>
      </div>

      <div class="card">
        <h3>🔍 Gerçek Zamanlı IP Sorgula (OA)</h3>
        <input type="text" id="ip" placeholder="Tam IP adresi...">
        <button onclick="sorgu()">Sorgula</button>
        <p id="res" style="color:#00ffcc; font-weight:bold; margin-top:10px;"></p>
      </div>

      <h3>📜 Son Hareketler</h3>
      <ul>
        ${logs.map(x => {
          const item = typeof x === 'string' ? JSON.parse(x) : x;
          return `<li><b>${item.type}</b> | ${item.ip} | ${item.zaman} <br><small>Dosya: ${item.resim}</small></li>`;
        }).join('')}
      </ul>

      <script>
        async function sorgu(){
          const v = document.getElementById('ip').value;
          const r = await fetch('/api/durum?ara='+v);
          const d = await r.json();
          document.getElementById('res').innerText = "Son OA Aktivitesi: " + d.son_oa_giris;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
