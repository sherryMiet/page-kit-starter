/**
 * Single source of truth for all editable content. These Zod schemas validate
 * the JSON in `content/` at load time and double as the TypeScript types used
 * throughout the app. A dashboard can generate forms directly from these
 * schemas, so every field is editable without touching code.
 *
 * The profile/theme/navigation/post schemas (and the primitives they depend
 * on) live in `./blocks/site`, vendored byte-for-byte from the page-kit repo
 * so the dashboard and this site always agree on the content shape.
 */

export {
  linkSchema,
  imageSchema,
  profileSchema,
  themeSchema,
  navigationSchema,
  postFrontmatterSchema,
  type Link,
  type Image,
  type ColorSet,
  type ProfileContent as Profile,
  type ThemeContent as Theme,
  type NavigationContent as Navigation,
  type PostFrontmatter,
} from "./blocks/site";

/* ------------------------------------------------------------------ */
/* Blog post frontmatter (posts/*.md)                                  */
/* ------------------------------------------------------------------ */

import type { PostFrontmatter } from "./blocks/site";

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
};
