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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Tema Oluşturucu</p>
              <h1 className="text-4xl font-semibold">OpenAnime Tema Builder</h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Tema preview yok; burası tema kurallarını, OpenAnime uyumlu CSS tekniklerini ve değişken tabanlı tema üretimini hazırlamak için.
              </p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-cyan-400 px-5 py-3 text-slate-950 transition hover:bg-cyan-300">
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold text-white">Tema Konfigürasyonu</h2>
              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-200">Tema Adı</label>
                  <input
                    value={options.name}
                    onChange={(event) => setField("name", event.target.value)}
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-200">Slug</label>
                  <input
                    value={options.slug}
                    onChange={(event) => setField("slug", event.target.value)}
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-200">Açıklama</label>
                  <textarea
                    value={options.description}
                    onChange={(event) => setField("description", event.target.value)}
                    rows={3}
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-200">Logo Metni</label>
                  <input
                    value={options.logoText}
                    onChange={(event) => setField("logoText", event.target.value)}
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-200">Ana Renk</label>
                    <input
                      type="color"
                      value={options.primaryColor}
                      onChange={(event) => setField("primaryColor", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-950 p-0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-200">Vurgu Rengi</label>
                    <input
                      type="color"
                      value={options.accentColor}
                      onChange={(event) => setField("accentColor", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-800 bg-slate-950 p-0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-200">Logo Fontu</label>
                    <select
                      value={options.logoFont}
                      onChange={(event) => setField("logoFont", event.target.value)}
                      className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    >
                      <option>Permanent Marker</option>
                      <option>Shadows Into Light</option>
                      <option>Fredoka</option>
                      <option>Poppins</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-200">Arka Plan Görsel URL</label>
                  <input
                    value={options.backgroundImage}
                    onChange={(event) => setField("backgroundImage", event.target.value)}
                    placeholder="https://..."
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-200">Kart Köşe Radius</label>
                    <input
                      value={options.cardRadius}
                      onChange={(event) => setField("cardRadius", event.target.value)}
                      className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-200">Geçiş Süresi</label>
                    <input
                      value={options.transitionDuration}
                      onChange={(event) => setField("transitionDuration", event.target.value)}
                      className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-200">Tema Modu</label>
                    <select
                      value={options.themeMode}
                      onChange={(event) => setField("themeMode", event.target.value as ThemeBuilderOptions["themeMode"])}
                      className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    >
                      {Object.entries(modeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={options.useImportant}
                      onChange={(event) => setField("useImportant", event.target.checked)}
                      className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-cyan-400"
                    />
                    <span className="text-sm">Önemli Override Kullan</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-semibold text-white">Üretilen CSS</h2>
              <p className="mt-3 text-slate-400">
                OpenAnime hedefli seçiciler, tema değişkenleri ve tracker desteği ile oluşturulmuş CSS.
              </p>
              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <textarea
                  readOnly
                  value={generatedCss}
                  rows={22}
                  className="w-full resize-none rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-100 outline-none"
                />
              </div>
            </section>
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950/70 p-6 text-slate-300">
            <h3 className="text-lg font-semibold text-white">Not</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Bu builder sayfası canlı preview içermiyor. OpenAnime sitesine ait canlı CSS bilgisi terminalden alınamadı, bu yapı yereldeki tema teknikleri ve OpenAnime uyumlu seçiciler üzerinden hazırlandı.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              İleride site güncellendiğinde bu builder da güncellenecek şekilde `themeId`, `html.fds-theme-dark`, `html.fds-theme-light`, logo override ve kart override teknikleri tutarlı kalmalı.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
