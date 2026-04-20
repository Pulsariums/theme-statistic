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
};

export const themes: ThemeItem[] = [
  {
    id: "mobile-wave",
    name: "Mobile Wave",
    description: "Hareketli, dokunmatik uyumlu mobil tema. Butonlar ve kartlar mobil gözükür.",
    tags: ["Mobile", "Dark", "Neon"],
    author: "PulsarDev",
    popularity: 78,
  },
  {
    id: "pc-slate",
    name: "PC Slate",
    description: "Masaüstü odaklı, clean panel yapısı ve düzenli satırlar.",
    tags: ["PC", "Minimal", "Light"],
    author: "OpenAnimeLabs",
    popularity: 63,
  },
  {
    id: "anime-night",
    name: "Anime Night",
    description: "Koyu arka plan ve canlı vurgu renklerle anime temasına özel tasarım.",
    tags: ["Anime", "Dark", "Neon"],
    author: "NeoSensei",
    popularity: 91,
  },
  {
    id: "soft-glow",
    name: "Soft Glow",
    description: "Açık tonlu, yumuşak renk paleti ve sade tipografi.",
    tags: ["Light", "Minimal"],
    author: "ThemeSmith",
    popularity: 52,
  },
];
