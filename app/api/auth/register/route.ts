import { NextResponse } from "next/server";
import { createUser, findUserByUsername, findUserByEmail, initDatabase } from "@/lib/db";
import { createSessionToken, cookieOptions } from "@/lib/auth";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function POST(request: Request) {
  await ensureDb();
  const body = await request.json();
  const username = String(body.username || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const confirmPassword = String(body.confirmPassword || "").trim();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Kullanıcı adı, e-posta ve şifre gereklidir." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Şifreler eşleşmiyor." }, { status: 400 });
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    return NextResponse.json({ error: "Bu kullanıcı adı zaten kullanılıyor." }, { status: 409 });
  }

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  }

  try {
    const user = await createUser({ username, email, password });
    const token = createSessionToken(user);
    const response = NextResponse.json({ user });
    response.cookies.set("pulsar_session", token, cookieOptions);
    return response;
  } catch (error) {
    console.error("Register failed", error);
    return NextResponse.json({ error: "Kayıt işlemi sırasında hata oluştu." }, { status: 500 });
  }
}
