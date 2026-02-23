import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const tekil = await redis.scard('tekil_ips');
    const toplam = await redis.get('toplam_gosterim');

    return NextResponse.json({
      Toplam_Tekil_Kullanici: tekil || 0,
      Toplam_Gosterim: toplam || 0
    });
  } catch (err) {
    return NextResponse.json({ hata: err.message });
  }
}
