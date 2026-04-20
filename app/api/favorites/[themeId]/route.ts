import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, toggleThemeFavorite, isThemeFavorited } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET(request: Request, context: { params: Promise<{ themeId: string }> }) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const params = await context.params;
  const themeId = Number(params.themeId);
  if (!themeId || isNaN(themeId)) {
    return NextResponse.json({ error: "Geçersiz tema ID'si." }, { status: 400 });
  }

  try {
    const favorite = await isThemeFavorited(user.id, themeId);
    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Favorite status failed", error);
    return NextResponse.json({ error: "Favori durumu alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ themeId: string }> }) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const params = await context.params;
  const themeId = Number(params.themeId);
  if (!themeId || isNaN(themeId)) {
    return NextResponse.json({ error: "Geçersiz tema ID'si." }, { status: 400 });
  }

  try {
    const favorite = await toggleThemeFavorite(user.id, themeId);
    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Favorite toggle failed", error);
    return NextResponse.json({ error: "Favori kaydı yapılamadı." }, { status: 500 });
  }
}
