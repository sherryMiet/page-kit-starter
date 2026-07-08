import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { validatePageDocument } from "./blocks/validate";
import type { PageDocument } from "./blocks/schema";
import {
  navigationSchema,
  postFrontmatterSchema,
  profileSchema,
  themeSchema,
  type Navigation,
  type Post,
  type Profile,
  type Theme,
} from "./schemas";

/**
 * Loads and validates all editable content from the `content/` directory.
 * Every reader runs the raw JSON/markdown through a Zod schema so malformed
 * content fails loudly with a clear message instead of rendering broken UI.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<T>(file: string, parse: (data: unknown) => T): T {
  const full = path.join(CONTENT_DIR, file);
  try {
    const raw = fs.readFileSync(full, "utf8");
    return parse(JSON.parse(raw));
  } catch (err) {
    throw new Error(
      `Failed to load content "${file}": ${(err as Error).message}`,
    );
  }
}

export function getProfile(): Profile {
  return readJson("profile.json", (d) => profileSchema.parse(d));
}

export function getTheme(): Theme {
  return readJson("theme.json", (d) => themeSchema.parse(d));
}

export function getNavigation(): Navigation {
  return readJson("navigation.json", (d) => navigationSchema.parse(d));
}

const PAGES_DIR = path.join(CONTENT_DIR, "pages");

export function getPage(slug: string): PageDocument {
  return readJson(`pages/${slug}.json`, (d) => {
    const result = validatePageDocument(d);
    if (result.errors.length > 0) {
      const lines = result.errors.map((issue) => `  - ${issue.path}: ${issue.message}`);
      throw new Error(`Invalid page "content/pages/${slug}.json":\n${lines.join("\n")}`);
    }
    for (const warning of result.warnings) {
      console.warn(`[content] content/pages/${slug}.json — ${warning.path}: ${warning.message}`);
    }
    return d as PageDocument;
  });
}

/**
 * Slugs of every page under content/pages, derived from filenames. Defensively
 * excludes "blog", which is always a real route (app/blog) and must never be
 * shadowed by a content page of the same slug.
 */
export function getPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .filter((slug) => slug !== "blog");
}

/* -------------------------------- Blog -------------------------------- */

const POSTS_DIR = path.join(CONTENT_DIR, "posts");

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const frontmatter = postFrontmatterSchema.parse(data);
      return { ...frontmatter, slug, content, readingTime: readingTime(content) };
    })
    .filter((post) => post.status !== "draft")
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}
