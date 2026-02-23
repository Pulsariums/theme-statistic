import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ad = searchParams.get('ad');

  // Ad yoksa hata dön
  if (!ad) {
    return new NextResponse("Dosya adi eksik", { status: 400 });
  }

  // Yönlendirilecek URL
  const resUrl = new URL(`/${ad}`, request.url);

  try {
    const redis = Redis.fromEnv();
    const headers = request.headers;
    const ip = headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const ua = headers.get('user-agent') || 'unknown';
    
    // Parmak izi oluştur
    const fp = `fp-${ua.substring(0, 10)}-${ip.substring(0, 5)}`;
    let deviceId = request.cookies.get('device_id')?.value || fp;

    const referer = headers.get('referer') || '';
    
    // Sadece OpenAnime'den geliyorsa say
    if (referer.includes('openani.me')) {
      await redis.incr('oa_total_hits');
      await redis.sadd('oa_users', deviceId);
      await redis.sadd('oa_ips', ip);
    }

    // Resmi yönlendir ve çerez bırak
    const response = NextResponse.redirect(resUrl, { status: 307 });
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.cookies.set('device_id', deviceId, { maxAge: 31536000, path: '/', sameSite: 'none', secure: true });
    
    return response;

  } catch (e) {
    // Hata olsa bile resmi açmaya çalış
    return NextResponse.redirect(resUrl, { status: 307 });
  }
}
