export type ThemeTag =
  | "Mobile"
  | "PC"
  | "Anime"
  | "Dark"
  | "Light"
  | "Minimal"
  | "Retro"
  | "Neon";

export type ThemeItem = {
  id: string;
  name: string;
  description: string;
  tags: ThemeTag[];
  author: string;
  popularity: number;
  releaseDate: string;
  useCount: number;
};

export const themes: ThemeItem[] = [
  {
    id: "mobile-wave",
    name: "Mobile Wave",
    description: "Hareketli, dokunmatik uyumlu mobil tema. Butonlar ve kartlar mobil bakışa uygun.",
    tags: ["Mobile", "Dark", "Neon"],
    author: "PulsarDev",
    popularity: 78,
    releaseDate: "2026-04-18",
    useCount: 228,
  },
  {
    id: "pc-slate",
    name: "PC Slate",
    description: "Masaüstü odaklı, temiz panel düzeni ve düzenli satırlar.",
    tags: ["PC", "Minimal", "Light"],
    author: "OpenAnimeLabs",
    popularity: 63,
    releaseDate: "2026-04-10",
    useCount: 156,
  },
  {
    id: "anime-night",
    name: "Anime Night",
    description: "Koyu arka plan ve canlı vurgu renklerle anime temasına özel deneyim.",
    tags: ["Anime", "Dark", "Neon"],
    author: "NeoSensei",
    popularity: 91,
    releaseDate: "2026-04-20",
    useCount: 341,
  },
  {
    id: "soft-glow",
    name: "Soft Glow",
    description: "Açık tonlu, yumuşak renk paleti ve sade tipografi.",
    tags: ["Light", "Minimal"],
    author: "ThemeSmith",
    popularity: 52,
    releaseDate: "2026-04-14",
    useCount: 98,
  },
];
