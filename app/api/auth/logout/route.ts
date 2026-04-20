import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("pulsar_session", "", {
    ...cookieOptions,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
