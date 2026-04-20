import { NextResponse } from "next/server";
import { getPublishedThemes, initDatabase } from "@/lib/db";

export async function GET() {
  try {
    await initDatabase();
    const themes = await getPublishedThemes();
    return NextResponse.json({ themes });
  } catch (error) {
    return NextResponse.json({ themes: [], error: "Veritabanına bağlanılamadı." }, { status: 500 });
  }
}
