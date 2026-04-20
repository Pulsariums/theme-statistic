"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const defaultThumbnail = "https://via.placeholder.com/640x360?text=Pulsar+Theme";

export default function ThemeUploadPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth", { cache: "no-store", credentials: "include" });
        if (!response.ok) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !mainImageUrl.trim() || !cssCode.trim()) {
      setError("Tema adı, ana görsel URL'si ve CSS kodu zorunludur.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          author,
          tags,
          mainImageUrl,
          cssCode,
          thumbnailUrl: thumbnailUrl || defaultThumbnail,
          status,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Tema yüklenirken bir hata oluştu.");
        return;
      }

      setSuccess("Tema başarıyla yüklendi. Gözat sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/browse"), 1200);
    } catch (err) {
      setError("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/10">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Tema Yükle</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Kendi OpenAnime uyumlu temalarını paylaş. Tema CSS dosyası ve kodu yüklenmelidir; yayınlama için yönetici onayı gerekecektir.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-[var(--text)]">
              <span>Tema adı</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Cyber Pulse"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>

            <label className="space-y-1 text-sm text-[var(--text)]">
              <span>Slug (isteğe bağlı)</span>
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="cyber-pulse"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm text-[var(--text)]">
            <span>Açıklama</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Tema hakkında kısa bir açıklama yazın."
              className="w-full rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-[var(--text)]">
              <span>Yazar</span>
              <input
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Senin adın veya takma adın"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="space-y-1 text-sm text-[var(--text)]">
              <span>Etiketler</span>
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="dark, neon, anime"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm text-[var(--text)]">
            <span>CSS Dosyası</span>
            <input
              type="file"
              accept=".css"
              onChange={async (event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) {
                  return;
                }
                const text = await file.text();
                setCssCode(text);
              }}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
            <p className="text-xs text-[var(--muted)]">CSS dosyasını seçerek yükleyin. Aşağıdaki kutuya da içerik ekleyebilirsiniz.</p>
          </label>

          <label className="space-y-1 text-sm text-[var(--text)]">
            <span>CSS İçeriği</span>
            <textarea
              value={cssCode}
              onChange={(event) => setCssCode(event.target.value)}
              rows={8}
              placeholder="Tema CSS kodunu buraya yapıştırın..."
              className="w-full rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
            <p className="text-xs text-[var(--muted)]">Bu alan boş olamaz; tema CSS içeriği yükleme için gereklidir.</p>
          </label>

          <label className="space-y-1 text-sm text-[var(--text)]">
            <span>Ana Görsel URL'si</span>
            <input
              value={mainImageUrl}
              onChange={(event) => setMainImageUrl(event.target.value)}
              placeholder="https://example.com/ana-gorsel.jpg"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
            <p className="text-xs text-[var(--muted)]">Tema tarayıcıda gösterilecek ana görsel. Bu alan zorunludur.</p>
          </label>

          <label className="space-y-1 text-sm text-[var(--text)]">
            <span>Thumbnail URL'si (isteğe bağlı)</span>
            <input
              value={thumbnailUrl}
              onChange={(event) => setThumbnailUrl(event.target.value)}
              placeholder={defaultThumbnail}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
            <p className="text-xs text-[var(--muted)]">Boş bırakırsanız varsayılan bir görsel kullanılacaktır.</p>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-[var(--text)]">
              <span>Durum</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="pending">Kontrol için bekle</option>
                <option value="draft">Taslak</option>
              </select>
            </label>
            <div className="space-y-1 text-sm text-[var(--text)]">
              <span>Kayıt Bilgisi</span>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">
                <p>Girişli kullanıcı olarak tema yüklenecek.</p>
              </div>
            </div>
          </div>

          {error ? <p className="rounded-3xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
          {success ? <p className="rounded-3xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-3xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Temayı Yükle"}
          </button>
        </form>
      </div>
    </main>
  );
}
