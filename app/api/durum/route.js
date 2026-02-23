import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sorguIp = searchParams.get('ara');

  // 1. IP SORGU SİSTEMİ
  if (sorguIp) {
    const sonGiris = await redis.get(`last_seen_ip:${sorguIp}`);
    return NextResponse.json({
      ip: sorguIp,
      son_aktivite: sonGiris || "Bu IP ile henüz giriş yapılmadı."
    });
  }

  // 2. GENEL VERİLER
  const toplam = await redis.get('toplam_gosterim') || 0;
  const tekil = await redis.scard('tekil_ips') || 0;
  const rawLoglar = await redis.lrange('aktivite_logu', 0, 19) || []; 

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pulsar IP Takip Paneli</title>
      <style>
        body { font-family: sans-serif; background: #0a0a0a; color: #fff; padding: 20px; line-height: 1.5; }
        .container { max-width: 600px; margin: auto; }
        .card { background: #151515; padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #333; }
        h1 { color: #00e5ff; margin-bottom: 10px; }
        .stats { display: flex; gap: 20px; }
        .stats div { flex: 1; background: #222; padding: 15px; border-radius: 8px; text-align: center; }
        input { width: 70%; padding: 12px; border-radius: 5px; border: 1px solid #444; background: #000; color: #fff; }
        button { padding: 12px 20px; border-radius: 5px; border: none; background: #00e5ff; color: #000; font-weight: bold; cursor: pointer; }
        ul { list-style: none; padding: 0; }
        li { background: #1a1a1a; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #00e5ff; }
        .ip-addr { color: #00e5ff; font-family: monospace; font-weight: bold; }
        .time { color: #888; font-size: 0.85rem; float: right; }
        .resim-info { color: #666; font-size: 0.8rem; display: block; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Takip Paneli</h1>
        
        <div class="card stats">
          <div><b style="font-size:1.5rem;">${toplam}</b><br><small>Toplam Görüntülenme</small></div>
          <div><b style="font-size:1.5rem;">${tekil}</b><br><small>Tekil IP Sayısı</small></div>
        </div>

        <div class="card">
          <h3>🔍 IP Sorgula</h3>
          <p style="font-size:0.8rem; color:#aaa; margin-bottom:10px;">Tam IP yazarak son giriş zamanını bul:</p>
          <div style="display:flex; gap:10px;">
            <input type="text" id="ipInput" placeholder="Örn: 176.23.xx.xx">
            <button onclick="sorgula()">Ara</button>
          </div>
          <div id="sonuc" style="margin-top:15px; font-weight:bold; color:#00e5ff;"></div>
        </div>

        <h3>📜 Son 20 Aktivite</h3>
        <ul>
          ${rawLoglar.map(l => {
            const item = typeof l === 'string' ? JSON.parse(l) : l;
            return `<li>
              <span class="ip-addr">${item.ip}</span> 
              <span class="time">${item.zaman}</span>
              <span class="resim-info">Görsel: ${item.resim}</span>
            </li>`;
          }).join('')}
        </ul>
      </div>

      <script>
        async function sorgula() {
          const val = document.getElementById('ipInput').value.trim();
          if(!val) return;
          const res = await fetch('/api/durum?ara=' + val);
          const data = await res.json();
          document.getElementById('sonuc').innerText = "Son Görülme: " + data.son_aktivite;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}        .stats div { flex: 1; background: #222; padding: 15px; border-radius: 8px; text-align: center; }
        input { width: 70%; padding: 10px; border-radius: 5px; border: 1px solid #444; background: #000; color: #fff; margin-bottom: 10px; }
        button { padding: 10px 20px; border-radius: 5px; border: none; background: #00e5ff; color: #000; font-weight: bold; cursor: pointer; }
        ul { list-style: none; padding: 0; }
        li { background: #1a1a1a; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #00e5ff; }
        .ip-addr { color: #00e5ff; font-family: monospace; }
        .time { color: #888; font-size: 0.85rem; float: right; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 IP Takip Paneli</h1>
        
        <div class="card stats">
          <div><b>${toplam}</b><br><small>Toplam İstek</small></div>
          <div><b>${tekil}</b><br><small>Tekil IP Sayısı</small></div>
        </div>

        <div class="card">
          <h3>🔍 IP Adresi Sorgula</h3>
          <p style="font-size:0.8rem; color:#aaa;">Bir kullanıcının tam IP adresini yazarak en son ne zaman girdiğini görebilirsin.</p>
          <input type="text" id="ipInput" placeholder="Örn: 176.234.12.34">
          <button onclick="sorgula()">Sorgula</button>
          <div id="sonuc" style="margin-top:15px; font-weight:bold; color:#00e5ff;"></div>
        </div>

        <h3>📜 Son 20 Aktivite (IP'ler Gizlenmiştir)</h3>
        <ul>
          ${loglar.map(l => {
            const item = typeof l === 'string' ? JSON.parse(l) : l;
            return `<li>
              <span class="ip-addr">${item.ip}</span> 
              <span class="time">${item.zaman}</span>
              <br><small style="color:#666;">Dosya: ${item.resim}</small>
            </li>`;
          }).join('')}
        </ul>
      </div>

      <script>
        async function sorgula() {
          const val = document.getElementById('ipInput').value.trim();
          if(!val) return;
          const res = await fetch('/api/durum?ara=' + val);
          const data = await res.json();
          document.getElementById('sonuc').innerText = "Son Görülme: " + data.son_aktivite;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}        .stats { display: flex; gap: 20px; font-size: 1.2rem; }
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
