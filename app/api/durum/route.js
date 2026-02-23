import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    const hits = await redis.get('oa_total_hits') || 0;
    const users = await redis.scard('oa_users') || 0;
    const ips = await redis.scard('oa_ips') || 0;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Panel</title>
        <style>
          body { background:#0a0a0a; color:#fff; font-family:sans-serif; padding:20px; }
          .card { background:#111; padding:20px; border-radius:10px; border:1px solid #333; }
          .val { font-size:2.5rem; color:#00ffcc; font-weight:bold; }
        </style>
      </head>
      <body>
        <h1>📊 İstatistikler</h1>
        <div class="card">
          <div>GERÇEK KİŞİ (CİHAZ): <span class="val">${users}</span></div>
          <br>
          <small>Toplam İstek: ${hits} | Farklı IP Sayısı: ${ips}</small>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, { 
      headers: { 'Content-Type': 'text/html; charset=utf-8' } 
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
