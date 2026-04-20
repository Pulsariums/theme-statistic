import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { findUserById, UserRecord } from "./db";

const JWT_SECRET = process.env.JWT_SECRET ?? "pulsar-dev-secret";
const COOKIE_NAME = "pulsar_session";

export function createSessionToken(user: UserRecord) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }

    if (typeof payload.sub !== "number" || typeof payload.role !== "string" || typeof payload.iat !== "number" || typeof payload.exp !== "number") {
      return null;
    }

    return {
      sub: payload.sub,
      role: payload.role,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

function parseCookieHeader(request: Request | NextRequest | null) {
  if (!request) {
    return null;
  }

  if ("cookies" in request && typeof request.cookies?.get === "function") {
    return request.cookies.get(COOKIE_NAME)?.value ?? null;
  }

  const header = request.headers.get("cookie") || "";
  const cookies = header.split(";").map((item) => item.trim());
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === COOKIE_NAME) {
      return rest.join("=");
    }
  }
  return null;
}

export async function getCurrentUser(request: Request | NextRequest | string | null) {
  const cookie = typeof request === "string" ? request : parseCookieHeader(request);
  if (!cookie) {
    return null;
  }

  const payload = verifySessionToken(cookie);
  if (!payload || !payload.sub) {
    return null;
  }

  return await findUserById(payload.sub);
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
