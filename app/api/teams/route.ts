import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createTeam, findTeamsForUser, initDatabase } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export async function GET(request: Request) {
  await ensureDb();
  const cookieHeader = request.headers.get("cookie") || null;
  const user = await getCurrentUser(cookieHeader);
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const teams = await findTeamsForUser(user.id);
  return NextResponse.json({ teams });
}

export async function POST(request: Request) {
  await ensureDb();
  const cookieHeader = request.headers.get("cookie") || null;
  const user = await getCurrentUser(cookieHeader);
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();

  if (!name) {
    return NextResponse.json({ error: "Takım adı gereklidir." }, { status: 400 });
  }

  try {
    const team = await createTeam({ name, description, owner_id: user.id });
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Team creation failed", error);
    return NextResponse.json({ error: "Takım oluşturulamadı." }, { status: 500 });
  }
}
