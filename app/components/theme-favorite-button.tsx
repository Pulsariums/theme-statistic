"use client";

import { useEffect, useState } from "react";

type Props = {
  themeId: number;
};

export default function ThemeFavoriteButton({ themeId }: Props) {
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/${themeId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          setFavorite(false);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setFavorite(Boolean(data.favorite));
      } catch {
        setFavorite(false);
      } finally {
        setLoading(false);
      }
    };
    loadStatus();
  }, [themeId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/favorites/${themeId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setFavorite(Boolean(data.favorite));
        setMessage(data.favorite ? "Favorilere eklendi." : "Favorilerden çıkarıldı.");
      } else {
        setMessage(data.error || "Favori güncellenemedi.");
      }
    } catch {
      setMessage("Favori güncellenemedi.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
      >
        {loading ? "Yükleniyor..." : favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      </button>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
