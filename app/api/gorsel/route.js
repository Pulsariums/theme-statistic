import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ad = searchParams.get('ad');
  if (!ad) return new NextResponse("Dosya adi eksik", { status: 400 });

  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const referer = request.headers.get('referer') || '';
    
    // DÜZELTME: openani.me (e harfi yok) olarak güncellendi
    const isOpenAnime = referer.includes('openani.me');
    const suan = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    // Toplam isteği her zaman artır
    await redis.incr('total_req_count');

    if (isOpenAnime) {
      await redis.incr('oa_total_hits');
      await redis.sadd('oa_unique_ips', ip);
      await redis.set(`last_seen_oa:${ip}`, suan);
    } else {
      await redis.incr('ext_total_hits');
      await redis.sadd('ext_unique_ips', ip);
    }

    const logType = isOpenAnime ? "✅ OpenAnime" : "❌ Dış İstek";
    const maskedIp = ip.split('.').slice(0, 2).join('.') + '.x.x';
    await redis.lpush('global_logs', JSON.stringify({ type: logType, ip: maskedIp, zaman: suan, resim: ad }));
    await redis.ltrim('global_logs', 0, 19);

  } catch (e) { console.error(e); }

  const gercekResimUrl = new URL(`/${ad}`, request.url);
  
  // ÖNEMLİ: Tarayıcının bu linki cachelemesini engelliyoruz (No-Store)
  return NextResponse.redirect(gercekResimUrl, { 
    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
