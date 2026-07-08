// VENDORED FROM page-kit src/lib/blocks/site.ts — DO NOT EDIT; sync from the page-kit repo.
/**
 * Site-level content schema — profile, theme, and navigation.
 *
 * These are the singleton content files (`content/profile.json`,
 * `content/theme.json`, `content/navigation.json`) that describe the site
 * shell, as opposed to the per-page block tree in `schema.ts`. The
 * definitions here are the authoritative source and are byte-for-byte
 * identical (modulo a banner comment) to the shape the starter site's own
 * `lib/schemas.ts` expects and renders — see `docs/CONTENT_SCHEMA.md` for
 * background.
 *
 * NOTE: this file is vendored into page-kit-starter (lib/blocks/site.ts).
 * Keep it dependency-free apart from zod, and sync the copy after editing.
 */

import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
});
export type Link = z.infer<typeof linkSchema>;

export const imageSchema = z.object({
  src: z.string(),
  alt: z.string().default(""),
  width: z.number().optional(),
  height: z.number().optional(),
});
export type Image = z.infer<typeof imageSchema>;

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost"]).default("primary"),
});

/* ------------------------------------------------------------------ */
/* profile.json                                                        */
/* ------------------------------------------------------------------ */

export const profileSchema = z.object({
  schemaVersion: z.string().optional(),
  siteName: z.string(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  logo: imageSchema.optional(),
  author: z.object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    avatar: imageSchema.optional(),
  }),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
  socials: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      }),
    )
    .default([]),
});
export type ProfileContent = z.infer<typeof profileSchema>;

/* ------------------------------------------------------------------ */
/* theme.json                                                          */
/* ------------------------------------------------------------------ */

const colorSetSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  card: z.string(),
  cardForeground: z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
  primary: z.string(),
  primaryForeground: z.string(),
  accent: z.string(),
  accentForeground: z.string(),
});
export type ColorSet = z.infer<typeof colorSetSchema>;

export const themeSchema = z.object({
  schemaVersion: z.string().optional(),
  name: z.string().default("Default"),
  defaultMode: z.enum(["light", "dark", "system"]).default("system"),
  radius: z.string().default("0.75rem"),
  fonts: z.object({
    sans: z.string(),
    heading: z.string(),
  }),
  colors: z.object({
    light: colorSetSchema,
    dark: colorSetSchema,
  }),
});
export type ThemeContent = z.infer<typeof themeSchema>;

/* ------------------------------------------------------------------ */
/* navigation.json                                                     */
/* ------------------------------------------------------------------ */

export const navigationSchema = z.object({
  schemaVersion: z.string().optional(),
  header: z.object({
    links: z.array(linkSchema),
    cta: ctaSchema.optional(),
  }),
  footer: z.object({
    groups: z.array(
      z.object({
        title: z.string(),
        links: z.array(linkSchema),
      }),
    ),
    note: z.string().optional(),
  }),
});
export type NavigationContent = z.infer<typeof navigationSchema>;

/* ------------------------------------------------------------------ */
/* Blog post frontmatter (posts/*.md)                                  */
/* ------------------------------------------------------------------ */

export const postFrontmatterSchema = z.object({
  schemaVersion: z.string().optional(),
  title: z.string(),
  excerpt: z.string().optional(),
  date: z.string(),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
  cover: imageSchema.optional(),
  featured: z.boolean().default(false),
  author: z.string().optional(),
  // Draft posts stay in the repository but are never rendered on the site.
  status: z.enum(["draft", "published"]).default("published"),
});
export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};
