import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resimAdi = searchParams.get('ad');

  if (!resimAdi) {
    return new NextResponse("Resim adi eksik", { status: 400 });
  }

  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const rawIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const maskedIp = rawIp.split('.').slice(0, 2).join('.') + '.x.x';
    const zaman = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    // Veritabanı işlemleri
    await redis.incr('toplam_gosterim');
    await redis.sadd('tekil_ips', rawIp); 
    await redis.set(`last_seen_ip:${rawIp}`, zaman);
    
    // Log listesi
    await redis.lpush('aktivite_logu', JSON.stringify({ ip: maskedIp, zaman, resim: resimAdi }));
    await redis.ltrim('aktivite_logu', 0, 29);
  } catch (err) {
    console.error("Takip hatasi:", err);
  }

  const gercekResimUrl = new URL(`/${resimAdi}`, request.url);
  return NextResponse.redirect(gercekResimUrl, { status: 307 });
}
