import { NextResponse } from "next/server";
import { authenticateUser, initDatabase } from "@/lib/db";
import { createSessionToken, cookieOptions, getCurrentUser } from "@/lib/auth";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET(request: Request) {
  await ensureDb();
  const user = await getCurrentUser(request as any);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  await ensureDb();
  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "").trim();

  if (!username || !password) {
    return NextResponse.json({ error: "Kullanıcı adı ve şifre gereklidir." }, { status: 400 });
  }

  try {
    const user = await authenticateUser(username, password);
    if (!user) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre." }, { status: 401 });
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({ user });
    response.cookies.set("pulsar_session", token, cookieOptions);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Giriş işlemi sırasında hata oluştu." }, { status: 500 });
  }
}
