import { NextResponse } from "next/server";
import { getGalleryAssets } from "@/lib/gallery";
import { initDatabase } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET() {
  await ensureDb();
  try {
    const assets = await getGalleryAssets();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Failed to fetch gallery assets", error);
    return NextResponse.json({ assets: [] }, { status: 500 });
  }
}
