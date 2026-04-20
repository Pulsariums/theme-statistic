"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PREDEFINED_THEME_TAGS, normalizeThemeSlug } from "@/lib/theme-helpers";

type GalleryAsset = {
  category: string;
  fileName: string;
  url: string;
  label: string;
  imagePath: string;
  views: number;
  downloads: number;
};

const defaultThumbnail = "https://via.placeholder.com/640x360?text=Pulsar+Theme";

function encodeSvgDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
}

function createPatternDataUrl(background: string, foreground: string, variant: number) {
  const svg = variant === 1
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${background}"/><circle cx="50" cy="50" r="30" fill="${foreground}" opacity="0.7"/><circle cx="150" cy="150" r="30" fill="${foreground}" opacity="0.7"/><circle cx="110" cy="70" r="20" fill="${foreground}" opacity="0.5"/></svg>`
    : variant === 2
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${background}"/><path d="M0 40 L200 40 L200 60 L0 60 Z M0 100 L200 100 L200 120 L0 120 Z" fill="${foreground}" opacity="0.3"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${background}"/><path d="M20 0 L0 20 L20 40 L40 20 Z M80 0 L60 20 L80 40 L100 20 Z M140 0 L120 20 L140 40 L160 20 Z" fill="${foreground}" opacity="0.35"/></svg>`;
  return encodeSvgDataUrl(svg);
}

export default function ThemeUploadPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageLabel, setSelectedImageLabel] = useState("");
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState("");
  const [selectedThumbnailLabel, setSelectedThumbnailLabel] = useState("");
  const [patternOptions, setPatternOptions] = useState<GalleryAsset[]>([]);
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);
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

  useEffect(() => {
    const generated = normalizeThemeSlug(name || "");
    setSlug(generated || `theme-${Math.floor(1000 + Math.random() * 9000)}`);
  }, [name]);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8b5cf6";
    const surface = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#ffffff";
    const variantOptions = [
      { category: "pattern", fileName: "pattern-1.svg", url: createPatternDataUrl(surface, color, 1), label: "Modern desen" },
      { category: "pattern", fileName: "pattern-2.svg", url: createPatternDataUrl(surface, color, 2), label: "Çizgili desen" },
      { category: "pattern", fileName: "pattern-3.svg", url: createPatternDataUrl(surface, color, 3), label: "Geometrik desen" },
    ];
    setPatternOptions(variantOptions as GalleryAsset[]);
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      setGalleryLoading(true);
      try {
        const response = await fetch("/api/gallery-assets", { cache: "no-store" });
        const result = await response.json();
        if (response.ok) {
          setGalleryAssets(result.assets ?? []);
          setGalleryError(null);
        } else {
          setGalleryError(result.error || "Galeri yüklenemedi.");
        }
      } catch {
        setGalleryError("Galeriye bağlanılamadı.");
      } finally {
        setGalleryLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const imageUrl = mainImageUrl.trim() || selectedImageUrl;
    const finalThumbnail = thumbnailUrl.trim() || selectedThumbnailUrl || imageUrl || defaultThumbnail;
    if (!name.trim() || !cssCode.trim()) {
      setError("Tema adı ve CSS kodu gereklidir.");
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
          description,
          author,
          tags: selectedTags,
          mainImageUrl: imageUrl,
          selectedImageUrl: selectedImageUrl,
          cssCode,
          thumbnailUrl: finalThumbnail,
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

            <div className="space-y-1 text-sm text-[var(--text)]">
              <span>Otomatik Oluşan Slug</span>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)]">
                {slug || "tema"}
              </div>
              <p className="text-xs text-[var(--muted)]">Slug ismi otomatik oluşturulur; aynıysa sonuna sayı eklenir.</p>
            </div>
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
            <div className="space-y-1 text-sm text-[var(--text)]">
              <div className="flex items-center justify-between">
                <span>Etiketler</span>
                <span className="text-xs text-[var(--muted)]">Sabit listeden seçin</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_THEME_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTags((current) =>
                          current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
                        );
                      }}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        selected
                          ? "bg-[var(--accent)] text-[var(--text)]"
                          : "bg-[var(--surface-strong)] text-[var(--muted)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
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
            <span>Görsel URL'si (opsiyonel)</span>
            <input
              value={mainImageUrl}
              onChange={(event) => setMainImageUrl(event.target.value)}
              placeholder="https://example.com/ana-gorsel.jpg"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
            <p className="text-xs text-[var(--muted)]">Link alanını doldurduysan bu kullanılacak; boş bırakırsan aşağıdaki seçtiğin görsel kullanılacak.</p>
          </label>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Standart Desenler</p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Tema Önizleme Seç</h2>
              </div>
              {selectedImageUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImageUrl("");
                    setSelectedImageLabel("");
                  }}
                  className="rounded-full bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-strong)]"
                >
                  Seçimi Temizle
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Standart desenlerle tema görselini hızlıca seçebilirsin. Bu desenler sitenin mevcut renk temasına uyumlu görünür.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {patternOptions.map((pattern) => (
                <button
                  key={pattern.fileName}
                  type="button"
                  onClick={() => {
                    setSelectedImageUrl(pattern.url);
                    setSelectedImageLabel(pattern.label);
                  }}
                  className={`rounded-3xl border p-0 text-left transition ${
                    selectedImageUrl === pattern.url ? "border-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--accent)]"
                  }`}
                >
                  <div className="relative h-28 overflow-hidden rounded-t-3xl bg-[var(--surface)]">
                    <div className="h-full w-full" style={{ backgroundImage: `url(${pattern.url})`, backgroundSize: "cover" }} />
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-sm font-semibold text-[var(--text)]">{pattern.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Galeri</p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Galeri Görseli Seç</h2>
              </div>
              {selectedImageUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImageUrl("");
                    setSelectedImageLabel("");
                  }}
                  className="rounded-full bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface-strong)]"
                >
                  Seçimi Temizle
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Aşağıdaki galeriden istediğin görseli seçerek tema için otomatik görsel olarak kullanabilirsin.</p>
            {galleryLoading ? (
              <div className="mt-6 text-[var(--muted)]">Galeri yükleniyor...</div>
            ) : galleryError ? (
              <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-950/10 p-4 text-sm text-red-200">{galleryError}</div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {galleryAssets.map((asset) => (
                  <div
                    key={asset.imagePath}
                    className={`group overflow-hidden rounded-3xl border p-0 transition ${
                      selectedImageUrl === asset.url || selectedThumbnailUrl === asset.url
                        ? "border-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <div className="relative h-40 overflow-hidden bg-[var(--surface)]">
                      <img src={asset.url} alt={asset.label} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{asset.label}</p>
                        <p className="text-xs text-[var(--muted)]">{asset.category}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImageUrl(asset.url);
                            setSelectedImageLabel(asset.label);
                          }}
                          className="rounded-full bg-[var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--surface)]"
                        >
                          Tema Görseli Olarak Seç
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedThumbnailUrl(asset.url);
                            setSelectedThumbnailLabel(asset.label);
                          }}
                          className="rounded-full bg-[var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--surface)]"
                        >
                          Thumbnail Olarak Seç
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedImageUrl ? (
              <div className="mt-4 rounded-3xl border border-[var(--accent)] bg-[var(--surface)] p-4 text-sm text-[var(--text)]">
                Seçilen tema görseli: <span className="font-semibold">{selectedImageLabel}</span>
              </div>
            ) : null}
            {selectedThumbnailUrl ? (
              <div className="mt-4 rounded-3xl border border-[var(--accent)] bg-[var(--surface)] p-4 text-sm text-[var(--text)]">
                Seçilen thumbnail: <span className="font-semibold">{selectedThumbnailLabel}</span>
              </div>
            ) : null}
          </section>

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
