import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, getThemeById, updateThemeDetails, createThemeVersion } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
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
  if (!theme || (theme.owner_id !== user.id && user.role !== "admin")) {
    return NextResponse.json({ error: "Tema bulunamadı veya yetkiniz yok." }, { status: 404 });
  }

  return NextResponse.json({ theme });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
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
  if (!theme || (theme.owner_id !== user.id && user.role !== "admin")) {
    return NextResponse.json({ error: "Tema bulunamadı veya yetkiniz yok." }, { status: 404 });
  }

  const body = await request.json();
  const updates: {
    name?: string;
    description?: string;
    author?: string;
    tags?: string[];
    thumbnail_url?: string | null;
    css_code?: string | null;
    status?: "draft" | "pending" | "published" | "archived";
  } = {};

  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.description === "string") updates.description = body.description.trim();
  if (typeof body.author === "string") updates.author = body.author.trim();
  if (typeof body.tags === "string") {
    updates.tags = body.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
  } else if (Array.isArray(body.tags)) {
    updates.tags = body.tags.map(String).map((tag: string) => tag.trim()).filter(Boolean);
  }
  if (typeof body.thumbnailUrl === "string") updates.thumbnail_url = body.thumbnailUrl.trim() || null;
  if (typeof body.status === "string" && ["draft", "pending", "published", "archived"].includes(body.status)) {
    updates.status = body.status as "draft" | "pending" | "published" | "archived";
  }

  const newCssCode = typeof body.newCssCode === "string" ? body.newCssCode.trim() : null;
  const versionName = typeof body.versionName === "string" ? body.versionName.trim() : "v" + (Math.floor(Date.now() / 1000)).toString();

  try {
    if (newCssCode) {
      await updateThemeDetails(id, { css_code: newCssCode });
      await createThemeVersion(id, versionName, newCssCode);
    }
    const updated = await updateThemeDetails(id, updates);
    return NextResponse.json({ theme: updated });
  } catch (error) {
    console.error("Theme update failed", error);
    return NextResponse.json({ error: "Tema güncellenemedi." }, { status: 500 });
  }
}
