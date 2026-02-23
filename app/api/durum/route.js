import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET() {
  const tekil = await redis.scard('tekil_kisi_sayisi');
  const toplam = await redis.get('toplam_gosterim');
  const detaylar = await redis.hgetall('hangi_resim_kac_kere');
  const son_olay = await redis.get('son_olay');

  return NextResponse.json({
    Toplam_Tekil_Kullanici: tekil || 0,
    Toplam_Gosterim_Sayisi: toplam || 0,
    Resimlere_Gore_Detay: detaylar || {},
    // BURAYI DÜZELTTİK: Artık JSON.parse() kullanmıyoruz çünkü Upstash bunu kendisi yapıyor.
    Son_Gelen: son_olay || "Henüz kimse gelmedi"
  });
}
