import type { Metadata } from "next";
import type { PageDocument } from "@/lib/blocks/schema";
import { getProfile } from "@/lib/content";

/** Share image for a page or post, falling back to the site-wide default. */
export function shareImages(src?: string): { images: string[] } | Record<string, never> {
  const image = src || getProfile().shareImage;
  return image ? { images: [image] } : {};
}

/**
 * <head> metadata for a block page: SEO title (overrides the page title and
 * the "· Site" template), description, share image and noindex — all from
 * the page's `meta` in content/pages/<slug>.json.
 */
export function pageMetadata(page: PageDocument): Metadata {
  const meta = page.meta ?? {};
  const ogTitle = meta.title || page.title;
  return {
    title: meta.title ? { absolute: meta.title } : page.title,
    description: meta.description,
    // Next replaces (does not merge) the layout's openGraph, so restate it whole.
    openGraph: { title: ogTitle, description: meta.description, type: "website", ...shareImages(meta.image) },
    ...(meta.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
