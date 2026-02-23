import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resimAdi = searchParams.get('ad');

  if (!resimAdi) return new NextResponse("Resim adı eksik", { status: 400 });

  try {
    // Gerçek IP adresini al
    const forwarded = request.headers.get('x-forwarded-for');
    const rawIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    
    // Güvenlik için maskelenmiş IP (Log listesi için)
    const maskedIp = rawIp.split('.').slice(0, 2).join('.') + '.x.x';
    const zaman = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    // 1. Genel Sayaçları Artır
    await redis.incr('toplam_gosterim');
    await redis.sadd('tekil_ips', rawIp); 

    // 2. IP Bazlı Son Görülme Kaydet (Sorgulanacak veri bu)
    await redis.set(`last_seen_ip:${rawIp}`, zaman);
    
    // 3. Aktivite Loguna Ekle (Maskeli IP ile)
    await redis.lpush('aktivite_logu', { ip: maskedIp, zaman, resim: resimAdi });
    await redis.ltrim('aktivite_logu', 0, 29); // Son 30 kayıt

  } catch (err) {
    console.error("Takip hatası:", err);
  }

  const gercekResimUrl = new URL(`/${resimAdi}`, request.url);
  return NextResponse.redirect(gercekResimUrl, { status: 307 });
}
