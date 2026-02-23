import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ara = searchParams.get('ara');

  if (ara) {
    const data = await redis.get(`last_seen_ip:${ara}`);
    return NextResponse.json({ ip: ara, son: data || "Kayit yok" });
  }

  const toplam = await redis.get('toplam_gosterim') || 0;
  const tekil = await redis.scard('tekil_ips') || 0;
  const loglar = await redis.lrange('aktivite_logu', 0, 15) || [];

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Pulsar Panel</title>
      <style>
        body { background:#0a0a0a; color:#fff; font-family:sans-serif; padding:20px; }
        .box { background:#111; padding:15px; border-radius:10px; border:1px solid #333; margin-bottom:20px; }
        h2 { color:#00e5ff; margin:0 0 10px 0; }
        input { padding:10px; border-radius:5px; border:1px solid #444; background:#000; color:#fff; width:200px; }
        button { padding:10px; background:#00e5ff; border:none; border-radius:5px; cursor:pointer; font-weight:bold; }
        li { background:#161616; padding:10px; margin-bottom:5px; border-radius:5px; list-style:none; border-left:3px solid #00e5ff; }
        small { color:#666; }
      </style>
    </head>
    <body>
      <h1>🚀 Takip Sistemi</h1>
      <div class="box" style="display:flex; gap:20px; text-align:center;">
        <div style="flex:1;"><b>${toplam}</b><br>Toplam</div>
        <div style="flex:1;"><b>${tekil}</b><br>Tekil Kişi</div>
      </div>
      <div class="box">
        <h3>IP Sorgula</h3>
        <input type="text" id="ip" placeholder="Tam IP adresi...">
        <button onclick="sorgula()">Sorgula</button>
        <div id="res" style="margin-top:10px; font-weight:bold; color:#00e5ff;"></div>
      </div>
      <h3>Son Hareketler</h3>
      <ul>
        ${loglar.map(x => {
          const item = typeof x === 'string' ? JSON.parse(x) : x;
          return `<li>${item.ip} - ${item.zaman}<br><small>Dosya: ${item.resim}</small></li>`;
        }).join('')}
      </ul>
      <script>
        async function sorgula(){
          const v = document.getElementById('ip').value;
          const r = await fetch('/api/durum?ara='+v);
          const d = await r.json();
          document.getElementById('res').innerText = "Son Gorulme: " + d.son;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}        input { width: 60%; padding: 12px; border-radius: 5px; border: 1px solid #444; background: #000; color: #fff; }
        button { padding: 12px 20px; border-radius: 5px; border: none; background: #00e5ff; font-weight: bold; cursor: pointer; }
        ul { list-style: none; padding: 0; }
        li { background: #1a1a1a; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #00e5ff; }
        .time { color: #888; font-size: 0.8rem; float: right; }
      </style>
    </head>
    <body>
      <h1>🚀 Takip Paneli</h1>
      <div class="card stats">
        <div><b style="font-size:1.5rem;">${toplam}</b><br><small>Istek</small></div>
        <div><b style="font-size:1.5rem;">${tekil}</b><br><small>Tekil IP</small></div>
      </div>
      <div class="card">
        <h3>🔍 IP Sorgula</h3>
        <input type="text" id="ipInput" placeholder="Tam IP adresi...">
        <button onclick="sorgula()">Ara</button>
        <div id="sonuc" style="margin-top:15px; color:#00e5ff;"></div>
      </div>
      <h3>📜 Son Hareketler</h3>
      <ul>
        ${rawLoglar.map(l => {
          const item = typeof l === 'string' ? JSON.parse(l) : l;
          return `<li><span>${item.ip}</span><span class="time">${item.zaman}</span><br><small style="color:#555">${item.resim}</small></li>`;
        }).join('')}
      </ul>
      <script>
        async function sorgula() {
          const val = document.getElementById('ipInput').value.trim();
          if(!val) return;
          const res = await fetch('/api/durum?ara=' + val);
          const data = await res.json();
          document.getElementById('sonuc').innerText = "Son Gorulme: " + data.son_aktivite;
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}        .stats div { flex: 1; background: #222; padding: 15px; border-radius: 8px; text-align: center; }
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
