import { NextResponse } from "next/server";
import { createTheme, getPublishedThemes, initDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET() {
  try {
    await ensureDb();
    const themes = await getPublishedThemes();
    return NextResponse.json({ themes });
  } catch (error) {
    return NextResponse.json({ themes: [], error: "Veritabanına bağlanılamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureDb();
  const currentUser = await getCurrentUser(request as any);
  if (!currentUser) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim() || String(name).toLowerCase().replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const description = String(body.description || "").trim();
  const author = String(body.author || currentUser.username).trim();
  const tags = typeof body.tags === "string"
    ? body.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
    : Array.isArray(body.tags)
    ? body.tags.map(String).map((tag: string) => tag.trim()).filter(Boolean)
    : [];
  const mainImageUrl = String(body.mainImageUrl || "").trim();
  const cssCode = String(body.cssCode || body.css_code || "").trim();
  const thumbnailUrl = String(body.thumbnailUrl || mainImageUrl || "").trim();
  const rawStatus = String(body.status || "pending").trim();
  const status = rawStatus === "draft" || rawStatus === "pending" || rawStatus === "published" || rawStatus === "archived" ? rawStatus : "pending";
  const finalStatus = currentUser.role === "admin" ? status : status === "draft" ? "draft" : "pending";

  const defaultThumbnail = "https://via.placeholder.com/640x360?text=Pulsar+Theme";
  if (!name || !mainImageUrl || !cssCode) {
    return NextResponse.json({ error: "Tema adı, görsel URL'si ve CSS kodu gereklidir." }, { status: 400 });
  }

  try {
    const theme = await createTheme({
      slug,
      name,
      description,
      author,
      tags,
      thumbnail_url: thumbnailUrl || defaultThumbnail,
      image_urls: [mainImageUrl],
      css_code: cssCode,
      owner_id: currentUser.id,
      status: finalStatus,
    });
    return NextResponse.json({ theme });
  } catch (error) {
    console.error("Create theme failed", error);
    return NextResponse.json({ error: "Tema oluşturulamadı." }, { status: 500 });
  }
}
