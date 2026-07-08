import { z } from "zod";

/**
 * Single source of truth for all editable content. These Zod schemas validate
 * the JSON in `content/` at load time and double as the TypeScript types used
 * throughout the app. A dashboard can generate forms directly from these
 * schemas, so every field is editable without touching code.
 *
 * The profile/theme/navigation schemas (and the primitives they depend on)
 * live in `./blocks/site`, vendored byte-for-byte from the page-kit repo so
 * the dashboard and this site always agree on the site-level content shape.
 */

import { imageSchema } from "./blocks/site";

export {
  linkSchema,
  imageSchema,
  profileSchema,
  themeSchema,
  navigationSchema,
  type Link,
  type Image,
  type ColorSet,
  type ProfileContent as Profile,
  type ThemeContent as Theme,
  type NavigationContent as Navigation,
} from "./blocks/site";

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
