import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, updateThemeStatus } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
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

  const body = await request.json();
  const status = ["draft", "pending", "published", "archived"].includes(body.status)
    ? body.status
    : "pending";

  try {
    const theme = await updateThemeStatus(id, status as "draft" | "pending" | "published" | "archived");
    return NextResponse.json({ theme });
  } catch (error) {
    console.error("Theme status update failed", error);
    return NextResponse.json({ error: "Tema durumu güncellenemedi." }, { status: 500 });
  }
}
