import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sorguUser = searchParams.get('ara');

  // 1. KULLANICI SORGU SİSTEMİ (?ara=isim)
  if (sorguUser) {
    const sonGiris = await redis.get(`son_gorulme:${sorguUser}`);
    return NextResponse.json({
      kullanici: sorguUser,
      son_aktivite: sonGiris || "Bulunamadı"
    });
  }

  // 2. GENEL VERİLERİ ÇEK
  const toplam = await redis.get('toplam_gosterim') || 0;
  const tekil = await redis.scard('tekil_ips') || 0;
  const loglar = await redis.lrange('aktivite_logu', 0, 19) || []; 

  // 3. HTML PANEL TASARIMI
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pulsar İstatistik Paneli</title>
      <style>
        body { font-family: sans-serif; background: #0a0a0a; color: #fff; padding: 20px; }
        .container { max-width: 600px; margin: auto; }
        .card { background: #151515; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #333; }
        h1 { color: #00e5ff; }
        .stats { display: flex; gap: 20px; font-size: 1.2rem; }
        .stats div { flex: 1; background: #222; padding: 10px; border-radius: 5px; text-align: center; }
        input { width: 70%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #000; color: #fff; }
        button { padding: 10px 15px; border-radius: 5px; border: none; background: #00e5ff; color: #000; font-weight: bold; cursor: pointer; }
        ul { list-style: none; padding: 0; }
        li { background: #1a1a1a; padding: 10px; border-radius: 5px; margin-bottom: 5px; border-left: 3px solid #00e5ff; font-size: 0.9rem; }
        .user { color: #00e5ff; font-weight: bold; }
        .time { color: #888; font-size: 0.8rem; float: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Tema Kontrol Paneli</h1>
        
        <div class="card stats">
          <div><b>${toplam}</b><br><small>Görüntülenme</small></div>
          <div><b>${tekil}</b><br><small>Tekil Kişi</small></div>
        </div>

        <div class="card">
          <h3>🔍 Kullanıcı Sorgula</h3>
          <input type="text" id="userInput" placeholder="Kullanıcı adı...">
          <button onclick="sorgula()">Ara</button>
          <p id="sonuc" style="margin-top:10px; color:#00e5ff;"></p>
        </div>

        <h3>📜 Son 20 Hareket</h3>
        <ul>
          ${loglar.map(l => {
            const item = typeof l === 'string' ? JSON.parse(l) : l;
            return `<li>
              <span class="user">${item.user}</span> 
              <span class="time">${item.zaman}</span>
              <br><small>Resim: ${item.resim} | IP: ${item.ip}</small>
            </li>`;
          }).join('')}
        </ul>
      </div>

      <script>
        async function sorgula() {
          const val = document.getElementById('userInput').value;
          const res = await fetch('/api/durum?ara=' + val);
          const data = await res.json();
          document.getElementById('sonuc').innerText = data.kullanici + ': ' + data.son_aktivite;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
