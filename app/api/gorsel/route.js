import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resimAdi = searchParams.get('ad');
  const user = searchParams.get('user') || 'Anonim';

  if (!resimAdi) return new NextResponse("Resim adi eksik", { status: 400 });

  try {
    // IP Adresini al ve maskele (Gizlilik için)
    const forwarded = request.headers.get('x-forwarded-for');
    const rawIp = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    const maskedIp = rawIp.split('.').slice(0, 2).join('.') + '.x.x';
    
    const zaman = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    // Veritabanı işlemleri
    await redis.incr('toplam_gosterim');
    await redis.sadd('tekil_ips', rawIp); 
    await redis.set(`son_gorulme:${user}`, zaman);
    
    // Aktivite akışı (Son 50 işlem)
    await redis.lpush('aktivite_logu', { user, zaman, resim: resimAdi, ip: maskedIp });
    await redis.ltrim('aktivite_logu', 0, 49);

  } catch (err) {
    console.error("Takip hatası:", err);
  }

  // Resmi GitHub public klasöründen çekip yönlendir
  const gercekResimUrl = new URL(`/${resimAdi}`, request.url);
  return NextResponse.redirect(gercekResimUrl, { status: 307 });
}  return NextResponse.redirect(gercekResimUrl, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate' // Her girişi tekrar saysın diye
    }
  });
}
