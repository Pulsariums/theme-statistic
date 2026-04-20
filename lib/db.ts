import { Pool } from "pg";
import argon2 from "argon2";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  buildConnectionStringFromEnv();

if (!connectionString) {
  console.warn("DATABASE_URL is not configured. Database-backed auth and theme management will be disabled.");
}

function buildConnectionStringFromEnv() {
  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const user = process.env.PGUSER || process.env.POSTGRES_USER;
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const database = process.env.PGDATABASE || process.env.POSTGRES_DATABASE;
  const sslmode = "require";

  if (!host || !user || !password || !database) {
    return undefined;
  }

  const encodedPassword = encodeURIComponent(password);
  return `postgresql://${user}:${encodedPassword}@${host}/${database}?sslmode=${sslmode}`;
}

declare global {
  // eslint-disable-next-line no-var
  var __pulsar_pg_pool: Pool | undefined;
}

function getPool(): Pool {
  if (!connectionString) {
    throw new Error("DATABASE_URL not configured");
  }

  if (!global.__pulsar_pg_pool) {
    global.__pulsar_pg_pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }

  return global.__pulsar_pg_pool;
}

export async function query<T = any>(queryText: string, params: Array<any> = []): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(queryText, params);
  return result.rows;
}

export async function initDatabase() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS themes (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      author TEXT,
      tags TEXT[],
      use_count INTEGER NOT NULL DEFAULT 0,
      release_date DATE,
      owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await ensureAdminUser();
}

export async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const email = process.env.ADMIN_EMAIL ?? "admin@pulsarthemes.local";
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";

  const existing = await findUserByUsername(username);
  if (existing) {
    return existing;
  }

  return createUser({
    username,
    email,
    password,
    name: "Pulsar Admin",
    role: "admin",
  });
}

export type UserRecord = {
  id: number;
  username: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
  created_at: string;
};

export async function findUserByUsername(username: string) {
  const rows = await query<UserRecord>(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username]);
  return rows[0] ?? null;
}

export async function findUserByEmail(email: string) {
  const rows = await query<UserRecord>(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
  return rows[0] ?? null;
}

export async function findUserById(id: number) {
  const rows = await query<UserRecord>(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const rows = await query<UserRecord>(
    `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, name, role, created_at`,
    [role, id]
  );
  return rows[0] ?? null;
}

export async function createUser(options: {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: "user" | "admin";
}) {
  const password_hash = await argon2.hash(options.password);
  const rows = await query<UserRecord>(
    `INSERT INTO users (username, email, name, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, role, created_at`,
    [options.username, options.email, options.name || null, password_hash, options.role || "user"]
  );
  return rows[0];
}

export async function authenticateUser(username: string, password: string) {
  const row = await getPool().query(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username]);
  const user = row.rows[0] as (UserRecord & { password_hash: string }) | undefined;
  if (!user) {
    return null;
  }

  const verified = await argon2.verify(user.password_hash, password);
  if (!verified) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
  };
}

export async function getAllUsers(term?: string) {
  if (!term) {
    return query<UserRecord>(`SELECT id, username, email, name, role, created_at FROM users ORDER BY created_at DESC`);
  }

  return query<UserRecord>(
    `SELECT id, username, email, name, role, created_at FROM users WHERE username ILIKE $1 OR email ILIKE $1 OR name ILIKE $1 ORDER BY created_at DESC`,
    [`%${term}%`]
  );
}

export type ThemeRecord = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  author: string | null;
  tags: string[] | null;
  use_count: number;
  release_date: string | null;
  owner_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function getPublishedThemes() {
  return query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, use_count, release_date, owner_id, status, created_at, updated_at FROM themes WHERE status = 'published' ORDER BY release_date DESC NULLS LAST LIMIT 18`
  );
}

export async function getAllThemes() {
  return query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, use_count, release_date, owner_id, status, created_at, updated_at FROM themes ORDER BY created_at DESC`);
}

export async function incrementThemeUseCount(id: number) {
  await query(`UPDATE themes SET use_count = use_count + 1 WHERE id = $1`, [id]);
}
