import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, deleteThemeById } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Geçersiz tema ID'si." }, { status: 400 });
  }

  try {
    await deleteThemeById(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete failed", error);
    return NextResponse.json({ error: "Tema silinemedi." }, { status: 500 });
  }
}
