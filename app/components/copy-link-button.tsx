"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
};

export default function CopyLinkButton({ value, label = "Linki Kopyala" }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Link panoya kopyalandı.");
    } catch {
      setStatus("Link kopyalanamadı.");
    }
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
      >
        {label}
      </button>
      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
    </div>
  );
}
