"use client";

import { useState } from "react";

type Props = {
  imageUrl: string;
  downloadApi: string;
};

export default function GalleryDetailActions({ imageUrl, downloadApi }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("Link panoya kopyalandı.");
    } catch {
      setStatus("Link kopyalanamadı.");
    }
    setTimeout(() => setStatus(null), 2000);
  };

  const handleDownload = async () => {
    try {
      await fetch(downloadApi, { method: "POST" });
      window.open(imageUrl, "_blank");
    } catch {
      setStatus("İndirme kaydı yapılamadı.");
      setTimeout(() => setStatus(null), 2000);
    }
  };

  return (
    <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] sm:w-auto"
        >
          Linki Kopyala
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)] sm:w-auto"
        >
          Görseli İndir
        </button>
      </div>
      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
      <p className="text-sm text-[var(--muted)]">Bu sayfa, görsel bağlantısını kopyalamanıza ve indirme hareketlerini kaydetmenize izin verir.</p>
    </div>
  );
}
