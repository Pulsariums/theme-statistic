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
    
    // Filtre: openanime.me veya beta.openanime.me içeriyor mu?
    const isOpenAnime = referer.includes('openanime.me');
    const suan = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    // 1. Her durumda Toplam İstek Sayısını Artır
    await redis.incr('total_req_count');

    if (isOpenAnime) {
      // --- OPENANIME TRAFİĞİ ---
      await redis.incr('oa_total_hits'); // Toplam OA isteği
      await redis.sadd('oa_unique_ips', ip); // Tekil OA kullanıcısı (SADD ile IP tekilleşir)
      await redis.set(`last_seen_oa:${ip}`, suan); // Bu IP en son ne zaman OA'daydı?
    } else {
      // --- DIŞ TRAFİK (Botlar, tarayıcıdan direkt girenler vs.) ---
      await redis.incr('ext_total_hits');
      await redis.sadd('ext_unique_ips', ip);
    }

    // Ortak Log (Panelde görmek için - Son 20)
    const logType = isOpenAnime ? "✅ OpenAnime" : "❌ Dış İstek";
    const maskedIp = ip.split('.').slice(0, 2).join('.') + '.x.x';
    await redis.lpush('global_logs', JSON.stringify({ type: logType, ip: maskedIp, zaman: suan, resim: ad }));
    await redis.ltrim('global_logs', 0, 19);

  } catch (e) { console.error(e); }

  return NextResponse.redirect(new URL(`/${ad}`, request.url), { status: 307 });
}
