import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase, hideGalleryAsset } from "@/lib/db";

const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
const galleryRoot = path.join(process.cwd(), "public", "images");

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function DELETE(request: Request) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const url = new URL(request.url);
  const category = String(url.searchParams.get("category") || "").trim();
  const fileName = String(url.searchParams.get("fileName") || "").trim();
  if (!category || !fileName) {
    return NextResponse.json({ error: "Kategori ve dosya adı gereklidir." }, { status: 400 });
  }

  const imagePath = path.posix.join("images", category, fileName);

  try {
    const hidden = await hideGalleryAsset(imagePath);
    if (!hidden) {
      return NextResponse.json({ error: "Görsel bulunamadı veya zaten gizlenmiş." }, { status: 404 });
    }

    return NextResponse.json({ success: true, imagePath });
  } catch (error) {
    console.error("Gallery asset delete failed", error);
    return NextResponse.json({ error: "Görsel gizlenemedi." }, { status: 500 });
  }
}

function sanitizeCategory(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "uncategorized";
}

function sanitizeFileName(value: string) {
  return value
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_.]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || `image-${Date.now()}`;
}

function isFileLike(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).name === "string" &&
    typeof (value as any).arrayBuffer === "function"
  );
}

const allowedCategories = ["backgrounds", "logos", "stickers", "patterns", "gif"];

export async function POST(request: NextRequest) {
  await ensureDb();
  const currentUser = await getCurrentUser(request);
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const rawCategory = String(formData.get("category") ?? "").trim().toLowerCase();
    const label = String(formData.get("label") ?? "").trim();
    const file = formData.get("file");

    if (!rawCategory || !allowedCategories.includes(rawCategory) || !file || !isFileLike(file)) {
      return NextResponse.json({ error: `Geçersiz kategori veya görsel dosyası. Kategori için şu seçeneklerden birini seçin: ${allowedCategories.join(", ")}` }, { status: 400 });
    }

    const extension = path.extname((file as any).name || "").toLowerCase();
    if (!validExtensions.includes(extension)) {
      return NextResponse.json({ error: "Geçersiz dosya formatı. Sadece png, jpg, jpeg, webp, gif veya svg kabul edilir." }, { status: 400 });
    }

    const category = sanitizeCategory(rawCategory);
    const directory = path.join(galleryRoot, category);
    await fs.mkdir(directory, { recursive: true });

    const baseName = sanitizeFileName(path.basename((file as any).name || `image-${Date.now()}`, extension));
    let fileName = `${baseName}${extension}`;
    let filePath = path.join(directory, fileName);
    let suffix = 1;
    while (true) {
      try {
        await fs.access(filePath);
        fileName = `${baseName}-${suffix++}${extension}`;
        filePath = path.join(directory, fileName);
      } catch {
        break;
      }
    }

    const buffer = Buffer.from(await (file as any).arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const imagePath = path.posix.join("images", category, fileName);
    const url = `/${imagePath}`;
    const assetLabel = label || path.basename(baseName).replace(/[-_]/g, " ");

    return NextResponse.json({
      asset: {
        category,
        fileName,
        url,
        label: assetLabel,
        imagePath,
        views: 0,
        downloads: 0,
      },
    });
  } catch (error) {
    console.error("Gallery asset upload failed", error);
    return NextResponse.json({ error: "Sunucuda görsel yükleme sırasında hata oluştu." }, { status: 500 });
  }
}
