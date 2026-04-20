import { promises as fs } from "fs";
import path from "path";
import {
  getImageUsageSummary,
  getImageUsageHistory,
  getGalleryAssetUsage,
  recordImageDownload,
  recordImageView,
  getHiddenGalleryAssetPaths,
} from "@/lib/db";

export type GalleryAsset = {
  category: string;
  fileName: string;
  url: string;
  label: string;
  imagePath: string;
  views: number;
  downloads: number;
};

const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
const galleryRoot = path.join(process.cwd(), "public", "images");

function isValidImageFile(name: string) {
  return validExtensions.includes(path.extname(name).toLowerCase());
}

export async function getGalleryAssets(): Promise<GalleryAsset[]> {
  let categories: string[] = [];

  try {
    const entries = await fs.readdir(galleryRoot, { withFileTypes: true });
    categories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    categories = [];
  }

  const assets: GalleryAsset[] = [];
  for (const category of categories) {
    const categoryPath = path.join(galleryRoot, category);
    const items = await fs.readdir(categoryPath, { withFileTypes: true });
    for (const item of items) {
      if (!item.isFile() || !isValidImageFile(item.name)) continue;
      const imagePath = path.posix.join("images", category, item.name);
      const url = `/${imagePath}`;
      const label = path.basename(item.name, path.extname(item.name)).replace(/[-_]/g, " ");
      assets.push({
        category,
        fileName: item.name,
        url,
        label,
        imagePath,
        views: 0,
        downloads: 0,
      });
    }
  }

  if (assets.length === 0) {
    return assets;
  }

  const hiddenPaths = await getHiddenGalleryAssetPaths();
  const hiddenSet = new Set(hiddenPaths);
  const visibleAssets = assets.filter((asset) => !hiddenSet.has(asset.imagePath));
  if (visibleAssets.length === 0) {
    return visibleAssets;
  }

  let summary = [] as Array<{ image_path: string; views: number; downloads: number }>;
  try {
    summary = await getImageUsageSummary(visibleAssets.map((asset) => asset.imagePath));
  } catch {
    summary = [];
  }

  const summaryMap = new Map(summary.map((item) => [item.image_path, item]));

  return visibleAssets.map((asset) => {
    const usage = summaryMap.get(asset.imagePath);
    return {
      ...asset,
      views: usage?.views ?? 0,
      downloads: usage?.downloads ?? 0,
    };
  });
}

export async function getGalleryAsset(category: string, fileName: string): Promise<GalleryAsset | null> {
  const imagePath = path.posix.join("images", category, fileName);
  const diskPath = path.join(galleryRoot, category, fileName);

  try {
    const stat = await fs.stat(diskPath);
    if (!stat.isFile() || !isValidImageFile(fileName)) {
      return null;
    }
  } catch {
    return null;
  }

  const label = path.basename(fileName, path.extname(fileName)).replace(/[-_]/g, " ");
  let usage = null;
  try {
    usage = await getGalleryAssetUsage(imagePath);
  } catch {
    usage = null;
  }

  const hiddenPaths = await getHiddenGalleryAssetPaths();
  if (hiddenPaths.includes(imagePath)) {
    return null;
  }

  return {
    category,
    fileName,
    url: `/${imagePath}`,
    label,
    imagePath,
    views: usage?.views ?? 0,
    downloads: usage?.downloads ?? 0,
  };
}

export async function getGalleryAssetHistory(imagePath: string, days = 14) {
  try {
    return await getImageUsageHistory(imagePath, days);
  } catch {
    return [];
  }
}

export async function recordGalleryAssetView(imagePath: string) {
  try {
    await recordImageView(imagePath);
  } catch {
    // fail silently if tracking database is unavailable
  }
}

export async function recordGalleryAssetDownload(imagePath: string) {
  try {
    await recordImageDownload(imagePath);
  } catch {
    // fail silently if tracking database is unavailable
  }
}
