import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ad = searchParams.get('ad');

  if (!ad) {
    return new NextResponse("Dosya adi eksik", { status: 400 });
  }

  const resUrl = new URL(`/${ad}`, request.url);

  try {
    const headers = request.headers;
    const ip = headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const ua = headers.get('user-agent') || 'unknown';
    const referer = headers.get('referer') || '';

    // Basit Parmak İzi
    const fp = `fp-${ua.substring(0, 10)}-${ip.split('.').slice(0, 2).join('.')}`;
    let deviceId = request.cookies.get('device_id')?.value || fp;

    const isOpenAnime = referer.includes('openani.me');
    const suan = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    await redis.incr('total_hits');

    if (isOpenAnime) {
      await redis.sadd('oa_users', deviceId);
      await redis.sadd('oa_ips', ip);
      await redis.set(`seen:${deviceId}`, suan);
    }

    const maskedIp = ip.split('.').slice(0, 2).join('.') + '.x.x';
    const logObj = { t: isOpenAnime ? "OA" : "EXT", id: deviceId.substring(0, 8), ip: maskedIp, z: suan, img: ad };
    
    await redis.lpush('logs', JSON.stringify(logObj));
    await redis.ltrim('logs', 0, 19);

    const response = NextResponse.redirect(resUrl, { status: 307 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.cookies.set('device_id', deviceId, { maxAge: 31536000, path: '/', sameSite: 'none', secure: true });
    
    return response;

  } catch (e) {
    console.error(e);
    return NextResponse.redirect(resUrl, { status: 307 });
  }
}
    const resUrl = new URL(`/${ad}`, request.url);
    const response = NextResponse.redirect(resUrl, { status: 307 });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.cookies.set('device_id', finalId, { maxAge: 31536000, path: '/', sameSite: 'none', secure: true });

    return response;
  } catch (e) {
    return NextResponse.redirect(new URL(`/${ad}`, request.url), { status: 307 });
  }
}    }

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
