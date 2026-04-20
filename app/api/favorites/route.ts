import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserFavorites, initDatabase } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET(request: Request) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  try {
    const favorites = await getUserFavorites(user.id);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Favorites fetch failed", error);
    return NextResponse.json({ error: "Favoriler yüklenemedi." }, { status: 500 });
  }
}
