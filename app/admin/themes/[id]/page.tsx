import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getThemeById, getThemeVersions } from "@/lib/db";
import MyThemeEditor from "@/app/components/my-theme-editor";
import Link from "next/link";

export default async function AdminThemeEditPage({ params }: { params: { id: string } }) {
  const cookiesStore = await cookies();
  const cookieValue = cookiesStore.get("pulsar_session")?.value ?? null;
  const user = await getCurrentUser(cookieValue);

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  const themeId = Number(params.id);
  if (!themeId || isNaN(themeId)) {
    return notFound();
  }

  const theme = await getThemeById(themeId);
  if (!theme) {
    return notFound();
  }

  const versions = await getThemeVersions(theme.id);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Admin Tema Düzenleme</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">{theme.name}</h1>
              <p className="mt-2 text-[var(--muted)]">Bu temanın detaylarını admin olarak düzenleyebilirsiniz.</p>
            </div>
            <Link href="/admin" className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Admin Paneline Dön
            </Link>
          </div>
        </div>
        <MyThemeEditor theme={theme} versions={versions} />
      </div>
    </main>
  );
}
