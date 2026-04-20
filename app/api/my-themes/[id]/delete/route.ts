import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, getThemeById, requestThemeDeletion } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Geçersiz tema ID'si." }, { status: 400 });
  }

  const theme = await getThemeById(id);
  if (!theme || theme.owner_id !== user.id) {
    return NextResponse.json({ error: "Tema bulunamadı veya yetkiniz yok." }, { status: 404 });
  }

  if (theme.delete_requested_at) {
    return NextResponse.json({ error: "Silme isteği zaten gönderildi." }, { status: 400 });
  }

  try {
    const updatedTheme = await requestThemeDeletion(id);
    return NextResponse.json({ theme: updatedTheme });
  } catch (error) {
    console.error("Delete request failed", error);
    return NextResponse.json({ error: "Silme isteği gönderilemedi." }, { status: 500 });
  }
}
