import { getPublishedThemes, type ThemeRecord } from "@/lib/db";
import BrowseClient from "@/app/browse/BrowseClient";

export default async function BrowsePage() {
  let themes: ThemeRecord[] = [];
  try {
    themes = await getPublishedThemes();
  } catch {
    themes = [];
  }

  return <BrowseClient initialThemes={themes} />;
}
