import { NextResponse } from "next/server";
import { initDatabase, query } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
    throw error;
  }
}

export async function GET() {
  try {
    await ensureDb();
    await query("SELECT 1 as ok");
    return NextResponse.json({ status: "ok", message: "Database bağlantısı sağlandı." });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Database bağlantısı kurulamadı." }, { status: 500 });
  }
}
