import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { initDatabase } from "@/lib/db";

const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
const galleryRoot = path.join(process.cwd(), "public", "images");

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
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

export async function POST(request: NextRequest) {
  await ensureDb();
  const currentUser = await getCurrentUser(request);
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const formData = await request.formData();
  const rawCategory = String(formData.get("category") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const file = formData.get("file");

  if (!rawCategory || !file || !(file instanceof File)) {
    return NextResponse.json({ error: "Kategori ve görsel dosyası gereklidir." }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!validExtensions.includes(extension)) {
    return NextResponse.json({ error: "Geçersiz dosya formatı. Sadece png, jpg, jpeg, webp, gif veya svg kabul edilir." }, { status: 400 });
  }

  const category = sanitizeCategory(rawCategory);
  const directory = path.join(galleryRoot, category);
  await fs.mkdir(directory, { recursive: true });

  const baseName = sanitizeFileName(path.basename(file.name, extension));
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

  const buffer = Buffer.from(await file.arrayBuffer());
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
}
