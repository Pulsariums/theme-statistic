import { NextResponse } from "next/server";
import { getAllThemes, getAllUsers, initDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await initDatabase();
    const user = await getCurrentUser(request as any);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const query = new URL(request.url).searchParams.get("q") || undefined;
    const [users, themes] = await Promise.all([getAllUsers(query || undefined), getAllThemes()]);
    return NextResponse.json({ user, users, themes });
  } catch (error) {
    return NextResponse.json({ error: "Admin verilerine ulaşılamadı." }, { status: 500 });
  }
}
