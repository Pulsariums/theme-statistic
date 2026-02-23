import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const total = await redis.get('total_hits') || 0;
    const users = await redis.scard('oa_users') || 0;
    const ips = await redis.scard('oa_ips') || 0;
    const rawLogs = await redis.lrange('logs', 0, 15) || [];

    let listItems = "";
    rawLogs.forEach(l => {
      const i = typeof l === 'string' ? JSON.parse(l) : l;
      const color = i.t === "OA" ? "#00ffcc" : "#ff4444";
      listItems += "<li style='background:#111;padding:10px;margin-bottom:5px;border-radius:5px;border-left:3px solid " + color + ";font-size:0.8rem;list-style:none;'><b>[" + i.t + "]</b> " + i.ip + " - " + i.z + "<br><small style='color:#666'>Gorsel: " + i.img + "</small></li>";
    });

    const html = "<!DOCTYPE html>" +
      "<html><head><meta charset='UTF-8'><title>Panel</title>" +
      "<style>body{background:#000;color:#fff;font-family:sans-serif;padding:20px;}.card{background:#111;padding:20px;border-radius:10px;border:1px solid #333;margin-bottom:20px;}.val{font-size:2rem;color:#00ffcc;font-weight:bold;}</style>" +
      "</head><body>" +
      "<h1>Panel</h1>" +
      "<div class='card'>" +
      "<div>Gercek Kullanici: <span class='val'>" + users + "</span></div>" +
      "<small>Farkli IP: " + ips + " | Toplam Istek: " + total + "</small>" +
      "</div>" +
      "<h3>Son Hareketler</h3>" +
      "<ul style='padding:0;'>" + listItems + "</ul>" +
      "</body></html>";

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 200
    });
  } catch (err) {
    return new Response("Hata olustu: " + err.message, { status: 500 });
  }
}  }
}      <body>
        <h1>📊 İstatistikler</h1>
        <div class="card">
          <small>GERÇEK KULLANICI (TEKİL)</small>
          <span class="val">${users}</span>
        </div>
        <div class="grid">
          <div class="sub">İstek: <b>${total}</b></div>
          <div class="sub">IP: <b>${ips}</b></div>
        </div>
        <h3>📜 Son Hareketler</h3>
        <ul style="padding:0;">${logItems}</ul>
      </body>
      </html>
    `;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}        </div>
        <h3>📜 Son Hareketler</h3>
        <ul>${logItems}</ul>
      </body>
      </html>
    `;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}        </div>
        <div class="sub-card">
          <small>FARKLI İP SAYISI</small><br><b>${totalIps}</b>
        </div>
      </div>

      <h3 style="margin-top:30px; color:#888;">📜 Son Hareketler (Cihaz Kimlikli)</h3>
      <ul>
        ${logs.map(x => {
          const i = JSON.parse(x);
          return `<li>
            <span class="tag-oa">${i.type}</span> | ID: <code>${i.id}</code> | IP: ${i.ip} | ${i.zaman.split(' ')[1]}
            <br><small style="color:#444;">Dosya: ${i.resim}</small>
          </li>`;
        }).join('')}
      </ul>
    </body>
    </html>
  `;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}        .ext { border-top: 4px solid #ff4444; }
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
