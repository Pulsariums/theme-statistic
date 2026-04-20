import { cookies } from "next/headers";
import TeamsClient from "@/app/teams/TeamsClient";
import { getCurrentUser } from "@/lib/auth";
import { findTeamsForUser, initDatabase, type TeamRecord } from "@/lib/db";

async function ensureDb() {
  try {
    await initDatabase();
  } catch (error) {
    console.error("Database initialization failed", error);
  }
}

export default async function TeamsPage() {
  await ensureDb();
  const cookieValue = (await cookies()).get("pulsar_session")?.value ?? null;
  const user = await getCurrentUser(cookieValue);

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-6 py-24 sm:px-10">
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-sm">
            <h1 className="text-3xl font-semibold">Giriş gerekiyor</h1>
            <p className="mt-4 text-[var(--muted)]">Takım sayfasına erişmek için önce giriş yapmalısınız.</p>
            <a href="/login" className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">Giriş Yap</a>
          </div>
        </div>
      </main>
    );
  }

  const teams: TeamRecord[] = await findTeamsForUser(user.id);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]/90">Takımlar</p>
              <h1 className="text-4xl font-semibold text-[var(--text)]">Takım Alanı</h1>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">Buradan takım oluşturabilir, üyeliğinize ait takımları görüntüleyebilir ve yönetebilirsiniz.</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-4">
              <p className="text-sm text-[var(--muted)]">Aktif kullanıcı:</p>
              <p className="mt-1 text-base font-semibold text-[var(--text)]">{user.username}</p>
            </div>
          </div>
        </section>

        <TeamsClient initialTeams={teams} />
      </div>
    </main>
  );
}
