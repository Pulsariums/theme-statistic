import { NextResponse } from "next/server";
import { getGalleryAsset, recordGalleryAssetDownload } from "@/lib/gallery";
import { initDatabase } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ category: string; imageName: string }> }) {
  await ensureDb();
  const params = await context.params;
  const { category, imageName } = params;
  const asset = await getGalleryAsset(category, imageName);
  if (!asset) {
    return NextResponse.json({ error: "Görsel bulunamadı." }, { status: 404 });
  }

  try {
    await recordGalleryAssetDownload(asset.imagePath);
    return NextResponse.json({ url: asset.url });
  } catch (error) {
    console.error("Gallery download failed", error);
    return NextResponse.json({ error: "İndirme kaydedilemedi." }, { status: 500 });
  }
}
