import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, updateUserRole } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await ensureDb();
  const user = await getCurrentUser(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const params = await context.params;
  const id = Number(params.id);
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Geçersiz kullanıcı ID'si." }, { status: 400 });
  }

  const body = await request.json();
  const role = body.role === "admin" ? "admin" : "user";

  try {
    const updated = await updateUserRole(id, role);
    if (!updated) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Role update failed", error);
    return NextResponse.json({ error: "Kullanıcı rolü güncellenemedi." }, { status: 500 });
  }
}
