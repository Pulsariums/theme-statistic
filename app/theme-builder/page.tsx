"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildOpenAnimeThemeCss, ThemeBuilderOptions } from "@/lib/theme-builder";

const defaultOptions: ThemeBuilderOptions = {
  name: "OpenAnime Starter",
  slug: "openanime-starter",
  description: "OpenAnime uyumlu koyu tema üretiyor.",
  logoText: "Pulsar Themes",
  logoFont: "Permanent Marker",
  primaryColor: "#8b5cf6",
  accentColor: "#f472b6",
  backgroundImage: "",
  cardRadius: "1.4rem",
  transitionDuration: "0.28s",
  themeMode: "dark",
  useImportant: true,
};

const modeLabels: Record<ThemeBuilderOptions["themeMode"], string> = {
  dark: "Koyu",
  light: "Açık",
  system: "Sistem",
};

export default function ThemeBuilderPage() {
  const [options, setOptions] = useState<ThemeBuilderOptions>(defaultOptions);

  const generatedCss = useMemo(() => buildOpenAnimeThemeCss(options), [options]);

  const setField = <K extends keyof ThemeBuilderOptions>(field: K, value: ThemeBuilderOptions[K]) => {
    setOptions((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]/80">Tema Oluşturucu</p>
              <h1 className="text-4xl font-semibold text-[var(--text)]">OpenAnime Tema Builder</h1>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Tema preview yok; burası tema kurallarını, OpenAnime uyumlu CSS tekniklerini ve değişken tabanlı tema üretimini hazırlamak için.
              </p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
              <h2 className="text-2xl font-semibold text-[var(--text)]">Tema Konfigürasyonu</h2>
              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--text)]">Tema Adı</label>
                  <input
                    value={options.name}
                    onChange={(event) => setField("name", event.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--text)]">Slug</label>
                  <input
                    value={options.slug}
                    onChange={(event) => setField("slug", event.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--text)]">Açıklama</label>
                  <textarea
                    value={options.description}
                    onChange={(event) => setField("description", event.target.value)}
                    rows={3}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--text)]">Logo Metni</label>
                  <input
                    value={options.logoText}
                    onChange={(event) => setField("logoText", event.target.value)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text)]">Ana Renk</label>
                    <input
                      type="color"
                      value={options.primaryColor}
                      onChange={(event) => setField("primaryColor", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text)]">Vurgu Rengi</label>
                    <input
                      type="color"
                      value={options.accentColor}
                      onChange={(event) => setField("accentColor", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] p-0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text)]">Logo Fontu</label>
                    <select
                      value={options.logoFont}
                      onChange={(event) => setField("logoFont", event.target.value)}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    >
                      <option>Permanent Marker</option>
                      <option>Shadows Into Light</option>
                      <option>Fredoka</option>
                      <option>Poppins</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--text)]">Arka Plan Görsel URL</label>
                  <input
                    value={options.backgroundImage}
                    onChange={(event) => setField("backgroundImage", event.target.value)}
                    placeholder="https://..."
                    className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text)]">Kart Köşe Radius</label>
                    <input
                      value={options.cardRadius}
                      onChange={(event) => setField("cardRadius", event.target.value)}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text)]">Geçiş Süresi</label>
                    <input
                      value={options.transitionDuration}
                      onChange={(event) => setField("transitionDuration", event.target.value)}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text)]">Tema Modu</label>
                    <select
                      value={options.themeMode}
                      onChange={(event) => setField("themeMode", event.target.value as ThemeBuilderOptions["themeMode"])}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    >
                      {Object.entries(modeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] transition">
                    <input
                      type="checkbox"
                      checked={options.useImportant}
                      onChange={(event) => setField("useImportant", event.target.checked)}
                      className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]"
                    />
                    <span className="text-sm">Önemli Override Kullan</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
              <h2 className="text-2xl font-semibold text-[var(--text)]">Üretilen CSS</h2>
              <p className="mt-3 text-[var(--muted)]">
                OpenAnime hedefli seçiciler, tema değişkenleri ve tracker desteği ile oluşturulmuş CSS.
              </p>
              <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] p-4">
                <textarea
                  readOnly
                  value={generatedCss}
                  rows={22}
                  className="w-full resize-none rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-xs text-[var(--input-text)] outline-none"
                />
              </div>
            </section>
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)]/70 p-6 text-[var(--muted)]">
            <h3 className="text-lg font-semibold text-[var(--text)]">Not</h3>
            <p className="mt-3 text-sm leading-7">
              Bu builder sayfası canlı preview içermiyor. OpenAnime sitesine ait canlı CSS bilgisi terminalden alınamadı, bu yapı yereldeki tema teknikleri ve OpenAnime uyumlu seçiciler üzerinden hazırlandı.
            </p>
            <p className="mt-3 text-sm leading-7">
              İleride site güncellendiğinde bu builder da güncellenecek şekilde `themeId`, `html.fds-theme-dark`, `html.fds-theme-light`, logo override ve kart override teknikleri tutarlı kalmalı.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
