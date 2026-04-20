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
      thumbnail_url TEXT,
      image_urls TEXT[],
      css_code TEXT,
      moderation_reason TEXT,
      delete_requested_at TIMESTAMPTZ,
      deleted_at TIMESTAMPTZ,
      use_count INTEGER NOT NULL DEFAULT 0,
      release_date DATE,
      owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE themes ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;`);
  await pool.query(`ALTER TABLE themes ADD COLUMN IF NOT EXISTS image_urls TEXT[];`);
  await pool.query(`ALTER TABLE themes ADD COLUMN IF NOT EXISTS css_code TEXT;`);
  await pool.query(`ALTER TABLE themes ADD COLUMN IF NOT EXISTS moderation_reason TEXT;`);
  await pool.query(`ALTER TABLE themes ADD COLUMN IF NOT EXISTS delete_requested_at TIMESTAMPTZ;`);
  await pool.query(`ALTER TABLE themes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS theme_usage_daily (
      id SERIAL PRIMARY KEY,
      theme_id INTEGER REFERENCES themes(id) ON DELETE CASCADE,
      usage_date DATE NOT NULL,
      use_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(theme_id, usage_date)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS image_usage_daily (
      id SERIAL PRIMARY KEY,
      image_path TEXT NOT NULL,
      usage_date DATE NOT NULL,
      view_count INTEGER NOT NULL DEFAULT 0,
      download_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(image_path, usage_date)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      theme_id INTEGER REFERENCES themes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, theme_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS theme_versions (
      id SERIAL PRIMARY KEY,
      theme_id INTEGER REFERENCES themes(id) ON DELETE CASCADE,
      version_name TEXT NOT NULL,
      css_code TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS hidden_gallery_images (
      id SERIAL PRIMARY KEY,
      image_path TEXT UNIQUE NOT NULL,
      hidden_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await ensureAdminUser();
}

export async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const email = process.env.ADMIN_EMAIL ?? "admin@pulsarthemes.local";
  const password = process.env.ADMIN_PASSWORD ?? "malbyte3169";

  const existing = await findUserByUsername(username);
  if (existing) {
    await ensureAdminPassword(username, password);
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

export async function ensureAdminPassword(username: string, password: string) {
  const row = await findUserCredentialsByUsername(username);
  if (!row) {
    return null;
  }

  const matches = await argon2.verify(row.password_hash, password);
  if (matches) {
    return row;
  }

  const password_hash = await argon2.hash(password);
  await query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [password_hash, row.id]);
  return row;
}

export async function findUserCredentialsByUsername(username: string) {
  const row = await getPool().query(`SELECT * FROM users WHERE username = $1 LIMIT 1`, [username]);
  return row.rows[0] as (UserRecord & { password_hash: string }) | undefined;
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

export async function themeSlugExists(slug: string) {
  const rows = await query<{ exists: boolean }>(
    `SELECT EXISTS(SELECT 1 FROM themes WHERE slug = $1) AS exists`,
    [slug]
  );
  return rows[0]?.exists ?? false;
}

export async function ensureUniqueThemeSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 2;
  while (await themeSlugExists(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }
  return slug;
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
  thumbnail_url: string | null;
  image_urls: string[] | null;
  css_code: string | null;
  moderation_reason: string | null;
  delete_requested_at: string | null;
  deleted_at: string | null;
  use_count: number;
  release_date: string | null;
  owner_id: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function cleanupPendingDeletes() {
  await query(`DELETE FROM themes WHERE delete_requested_at IS NOT NULL AND deleted_at IS NULL AND delete_requested_at <= NOW() - INTERVAL '7 days'`);
}

export async function getPublishedThemes() {
  await cleanupPendingDeletes();
  return query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at FROM themes WHERE status = 'published' AND delete_requested_at IS NULL AND deleted_at IS NULL ORDER BY release_date DESC NULLS LAST LIMIT 18`
  );
}

export async function getThemeBySlug(slug: string) {
  const rows = await query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at FROM themes WHERE slug = $1 AND status = 'published' AND delete_requested_at IS NULL AND deleted_at IS NULL LIMIT 1`,
    [slug]
  );
  return rows[0] ?? null;
}

export async function getThemeBySlugIncludingPrivate(slug: string) {
  const rows = await query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at FROM themes WHERE slug = $1 AND deleted_at IS NULL LIMIT 1`,
    [slug]
  );
  return rows[0] ?? null;
}

export async function updateThemeStatus(id: number, status: "draft" | "pending" | "published" | "archived", moderation_reason?: string | null) {
  const rows = await query<ThemeRecord>(
    `UPDATE themes SET status = $1, moderation_reason = $2 WHERE id = $3 RETURNING id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, use_count, release_date, owner_id, status, created_at, updated_at`,
    [status, moderation_reason || null, id]
  );
  return rows[0] ?? null;
}

export async function recordThemeUsage(themeId: number) {
  await query(
    `INSERT INTO theme_usage_daily (theme_id, usage_date, use_count) VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (theme_id, usage_date) DO UPDATE SET use_count = theme_usage_daily.use_count + 1`,
    [themeId]
  );
  await query(`UPDATE themes SET use_count = use_count + 1 WHERE id = $1`, [themeId]);
}

export async function getThemeUsageHistory(themeId: number, days = 14) {
  return query<{ usage_date: string; use_count: number }>(
    `SELECT usage_date, use_count FROM theme_usage_daily WHERE theme_id = $1 AND usage_date >= CURRENT_DATE - INTERVAL '${days - 1} days' ORDER BY usage_date ASC`,
    [themeId]
  );
}

export async function getImageUsageSummary(imagePaths: string[]) {
  if (imagePaths.length === 0) {
    return [];
  }

  return query<{ image_path: string; views: number; downloads: number }>(
    `SELECT image_path, COALESCE(SUM(view_count), 0) AS views, COALESCE(SUM(download_count), 0) AS downloads
     FROM image_usage_daily
     WHERE image_path = ANY($1)
     GROUP BY image_path`,
    [imagePaths]
  );
}

export async function getGalleryAssetUsage(imagePath: string) {
  const rows = await query<{ image_path: string; views: number; downloads: number }>(
    `SELECT image_path, COALESCE(SUM(view_count), 0) AS views, COALESCE(SUM(download_count), 0) AS downloads
     FROM image_usage_daily
     WHERE image_path = $1
     GROUP BY image_path`,
    [imagePath]
  );
  return rows[0] ?? null;
}

export async function recordImageView(imagePath: string) {
  await query(
    `INSERT INTO image_usage_daily (image_path, usage_date, view_count) VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (image_path, usage_date) DO UPDATE SET view_count = image_usage_daily.view_count + 1`,
    [imagePath]
  );
}

export async function recordImageDownload(imagePath: string) {
  await query(
    `INSERT INTO image_usage_daily (image_path, usage_date, download_count) VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (image_path, usage_date) DO UPDATE SET download_count = image_usage_daily.download_count + 1`,
    [imagePath]
  );
}

export async function getImageUsageHistory(imagePath: string, days = 14) {
  return query<{ usage_date: string; view_count: number; download_count: number }>(
    `SELECT usage_date, view_count, download_count FROM image_usage_daily
     WHERE image_path = $1 AND usage_date >= CURRENT_DATE - INTERVAL '${days - 1} days'
     ORDER BY usage_date ASC`,
    [imagePath]
  );
}

export async function getAllThemes() {
  return query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, use_count, release_date, owner_id, status, created_at, updated_at FROM themes ORDER BY created_at DESC`
  );
}

export async function getUserThemes(userId: number) {
  await cleanupPendingDeletes();
  return query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at FROM themes WHERE owner_id = $1 AND deleted_at IS NULL ORDER BY updated_at DESC`,
    [userId]
  );
}

export async function getThemeById(id: number) {
  const rows = await query<ThemeRecord>(
    `SELECT id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at FROM themes WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function getUserFavorites(userId: number) {
  return query<ThemeRecord>(
    `SELECT t.id, t.slug, t.name, t.description, t.author, t.tags, t.thumbnail_url, t.image_urls, t.css_code, t.moderation_reason, t.use_count, t.release_date, t.owner_id, t.status, t.created_at, t.updated_at
     FROM themes t
     JOIN favorites f ON f.theme_id = t.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
}

export async function isThemeFavorited(userId: number, themeId: number) {
  const rows = await query<{ exists: boolean }>(
    `SELECT EXISTS(SELECT 1 FROM favorites WHERE user_id = $1 AND theme_id = $2) AS exists`,
    [userId, themeId]
  );
  return rows[0]?.exists ?? false;
}

export async function toggleThemeFavorite(userId: number, themeId: number) {
  const existing = await isThemeFavorited(userId, themeId);
  if (existing) {
    await query(`DELETE FROM favorites WHERE user_id = $1 AND theme_id = $2`, [userId, themeId]);
    return false;
  }

  await query(`INSERT INTO favorites (user_id, theme_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, themeId]);
  return true;
}

export async function getThemeVersions(themeId: number) {
  return query<{ id: number; version_name: string; css_code: string; created_at: string }>(
    `SELECT id, version_name, css_code, created_at FROM theme_versions WHERE theme_id = $1 ORDER BY created_at DESC`,
    [themeId]
  );
}

export async function createThemeVersion(themeId: number, versionName: string, css_code: string) {
  const rows = await query<{ id: number; version_name: string; css_code: string; created_at: string }>(
    `INSERT INTO theme_versions (theme_id, version_name, css_code) VALUES ($1, $2, $3) RETURNING id, version_name, css_code, created_at`,
    [themeId, versionName, css_code]
  );
  return rows[0];
}

export async function getHiddenGalleryAssetPaths() {
  const rows = await query<{ image_path: string }>(`SELECT image_path FROM hidden_gallery_images`);
  return rows.map((row) => row.image_path);
}

export async function hideGalleryAsset(imagePath: string) {
  const rows = await query<{ image_path: string }>(
    `INSERT INTO hidden_gallery_images (image_path) VALUES ($1) ON CONFLICT (image_path) DO NOTHING RETURNING image_path`,
    [imagePath]
  );
  return rows[0] ?? null;
}

export async function updateThemeDetails(id: number, data: {
  name?: string;
  description?: string;
  author?: string;
  tags?: string[];
  thumbnail_url?: string | null;
  css_code?: string | null;
  moderation_reason?: string | null;
  delete_requested_at?: string | null;
  deleted_at?: string | null;
  status?: "draft" | "pending" | "published" | "archived" | "pending_delete";
}) {
  const fields = [] as string[];
  const values = [] as Array<any>;
  let idx = 1;

  if (data.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(data.description);
  }
  if (data.author !== undefined) {
    fields.push(`author = $${idx++}`);
    values.push(data.author);
  }
  if (data.tags !== undefined) {
    fields.push(`tags = $${idx++}`);
    values.push(data.tags);
  }
  if (data.thumbnail_url !== undefined) {
    fields.push(`thumbnail_url = $${idx++}`);
    values.push(data.thumbnail_url);
  }
  if (data.css_code !== undefined) {
    fields.push(`css_code = $${idx++}`);
    values.push(data.css_code);
  }
  if (data.moderation_reason !== undefined) {
    fields.push(`moderation_reason = $${idx++}`);
    values.push(data.moderation_reason);
  }
  if (data.delete_requested_at !== undefined) {
    fields.push(`delete_requested_at = $${idx++}`);
    values.push(data.delete_requested_at);
  }
  if (data.deleted_at !== undefined) {
    fields.push(`deleted_at = $${idx++}`);
    values.push(data.deleted_at);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(data.status);
  }

  if (fields.length === 0) {
    return await getThemeById(id);
  }

  values.push(id);
  const queryText = `UPDATE themes SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, use_count, release_date, owner_id, status, created_at, updated_at`;
  const rows = await query<ThemeRecord>(queryText, values);
  return rows[0] ?? null;
}

export async function createTheme(options: {
  slug: string;
  name: string;
  description: string;
  author?: string;
  tags?: string[];
  thumbnail_url?: string;
  image_urls?: string[] | null;
  css_code?: string | null;
  moderation_reason?: string | null;
  owner_id: number | null;
  status?: "draft" | "pending" | "published" | "archived";
}) {
  const rows = await query<ThemeRecord>(
    `INSERT INTO themes (slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, owner_id, status, release_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) RETURNING id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at`,
    [
      options.slug,
      options.name,
      options.description,
      options.author || null,
      options.tags || null,
      options.thumbnail_url || null,
      options.image_urls || null,
      options.css_code || null,
      options.moderation_reason || null,
      null,
      null,
      options.owner_id,
      options.status || "pending",
    ]
  );
  return rows[0];
}

export async function requestThemeDeletion(id: number) {
  const rows = await query<ThemeRecord>(
    `UPDATE themes SET status = 'pending_delete', delete_requested_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id, slug, name, description, author, tags, thumbnail_url, image_urls, css_code, moderation_reason, delete_requested_at, deleted_at, use_count, release_date, owner_id, status, created_at, updated_at`,
    [id]
  );
  return rows[0] ?? null;
}

export async function deleteThemeById(id: number) {
  await query(`DELETE FROM themes WHERE id = $1`, [id]);
}

export async function incrementThemeUseCount(id: number) {
  await query(`UPDATE themes SET use_count = use_count + 1 WHERE id = $1`, [id]);
}
