export const PREDEFINED_THEME_TAGS = [
  "dark",
  "neon",
  "anime",
  "retrowave",
  "minimal",
  "pastel",
  "space",
  "cyberpunk",
  "fantasy",
  "vintage",
];

export function normalizeThemeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
