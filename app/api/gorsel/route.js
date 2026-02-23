import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Veritabanına bağlan
const redis = Redis.fromEnv();

export async function GET(request) {
  // 1. Linkten resim adını al (Örn: ?ad=bg.jpg)
  const { searchParams } = new URL(request.url);
  const resimAdi = searchParams.get('ad');

  if (!resimAdi) {
    return new NextResponse("Hata: Resim adi yazmadın! (?ad=arkaplan.png gibi ekle)", { status: 400 });
  }

  // 2. Ziyaretçiyi Say ve Kaydet
  try {
    const ip = request.headers.get('x-forwarded-for') || 'bilinmeyen-ip';
    
    await redis.incr('toplam_gosterim'); // Toplam kaç kere tetiklendi
    await redis.hincrby('hangi_resim_kac_kere', resimAdi, 1); // Bu resim kaç kere açıldı
    await redis.sadd('tekil_kisi_sayisi', ip); // Benzersiz kişi sayısı
    
    // Son gireni not al
    await redis.set('son_olay', JSON.stringify({
      zaman: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
      ip: ip,
      resim: resimAdi
    }));
  } catch (err) {
    console.error("Sayım hatası:", err);
  }

  // 3. Tarayıcıyı çaktırmadan "public" klasöründeki gerçek resme yönlendir!
  // Bu sayede dosya okuma, bozuk resim vs. derdi olmaz.
  const gercekResimUrl = new URL(`/${resimAdi}`, request.url);
  return NextResponse.redirect(gercekResimUrl, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate' // Her girişi tekrar saysın diye
    }
  });
}
