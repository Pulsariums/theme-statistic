import { NextResponse } from "next/server";
import { createTheme, getPublishedThemes, initDatabase, ensureUniqueThemeSlug } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { normalizeThemeSlug, PREDEFINED_THEME_TAGS } from "@/lib/theme-helpers";

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
  const rawSlug = String(body.slug || "").trim();
  const baseSlug = rawSlug ? normalizeThemeSlug(rawSlug) : normalizeThemeSlug(name);
  const normalizedSlug = baseSlug || "tema";
  const description = String(body.description || "").trim();
  const author = String(body.author || currentUser.username).trim();
  const incomingTags = typeof body.tags === "string"
    ? body.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
    : Array.isArray(body.tags)
    ? body.tags.map(String).map((tag: string) => tag.trim()).filter(Boolean)
    : [];
  const tags = incomingTags.filter((tag: string) => PREDEFINED_THEME_TAGS.includes(tag));
  const selectedImageUrl = String(body.mainImageUrl || body.selectedImageUrl || "").trim();
  const cssCode = String(body.cssCode || body.css_code || "").trim();
  const thumbnailUrl = String(body.thumbnailUrl || selectedImageUrl || "").trim();
  const rawStatus = String(body.status || "pending").trim();
  const status = rawStatus === "draft" || rawStatus === "pending" || rawStatus === "published" || rawStatus === "archived" ? rawStatus : "pending";
  const finalStatus = currentUser.role === "admin" ? status : status === "draft" ? "draft" : "pending";

  const defaultThumbnail = "https://via.placeholder.com/640x360?text=Pulsar+Theme";
  if (!name || !cssCode) {
    return NextResponse.json({ error: "Tema adı ve CSS kodu gereklidir." }, { status: 400 });
  }

  try {
    const uniqueSlug = await ensureUniqueThemeSlug(normalizedSlug);
    const theme = await createTheme({
      slug: uniqueSlug,
      name,
      description,
      author,
      tags,
      thumbnail_url: thumbnailUrl || defaultThumbnail,
      image_urls: selectedImageUrl ? [selectedImageUrl] : null,
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
