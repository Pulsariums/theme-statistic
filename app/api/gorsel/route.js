import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ad = searchParams.get('ad');
  if (!ad) return new NextResponse("Dosya adi eksik", { status: 400 });

  try {
    const headers = request.headers;
    const ua = headers.get('user-agent') || 'unknown';
    const lang = headers.get('accept-language') || 'unknown';
    const ip = headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    
    // 1. GİZLİ PARMAK İZİ OLUŞTUR (Çerez çalışmazsa yedek bu)
    // IP'nin ilk iki bloğu + Cihaz modeli + Dil
    const fingerprint = `fp-${ua}-${lang}-${ip.split('.').slice(0, 2).join('.')}`;
    
    // 2. ÇEREZ KONTROLÜ
    let deviceId = request.cookies.get('device_id')?.value;
    
    // 3. KESİN KİMLİK BELİRLEME
    // Eğer çerez varsa onu kullan, yoksa parmak izini kullan
    const finalIdentity = deviceId || fingerprint;

    const isOpenAnime = (headers.get('referer') || '').includes('openani.me');
    const suan = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    if (isOpenAnime) {
      // Redis'e 'tekil_cihazlar' kümesine ekle (Aynı parmak izi gelirse saymaz)
      await redis.sadd('oa_unique_identities', finalIdentity);
      await redis.sadd('oa_raw_ips', ip);
      await redis.set(`last_seen_id:${finalIdentity}`, suan);
      await redis.incr('oa_total_hits');
    }

    // Log (Panelde göreceğin kısım)
    const maskedIp = ip.split('.').slice(0, 2).join('.') + '.x.x';
    await redis.lpush('global_logs', JSON.stringify({ 
      type: isOpenAnime ? "✅ OA" : "❌ DIŞ", 
      id: finalIdentity.substring(0, 12), // Kimliğin bir kısmını göster
      ip: maskedIp, 
      zaman: suan, 
      resim: ad 
    }));
    await redis.ltrim('global_logs', 0, 19);

    const response = NextResponse.redirect(new URL(`/${ad}`, request.url), { status: 307 });
    
    // Çerezi her ihtimale karşı yine de set edelim
    response.cookies.set('device_id', deviceId || fingerprint, {
      maxAge: 31536000, // 1 Yıl
      path: '/',
      sameSite: 'none', // Cross-site desteği
      secure: true
    });

    return response;

  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL(`/${ad}`, request.url), { status: 307 });
  }
}    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
