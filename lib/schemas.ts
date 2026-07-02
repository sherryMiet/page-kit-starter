import { z } from "zod";

/**
 * Single source of truth for all editable content. These Zod schemas validate
 * the JSON in `content/` at load time and double as the TypeScript types used
 * throughout the app. A dashboard can generate forms directly from these
 * schemas, so every field is editable without touching code.
 */

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
export type Profile = z.infer<typeof profileSchema>;

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
export type Theme = z.infer<typeof themeSchema>;

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
export type Navigation = z.infer<typeof navigationSchema>;

/* ------------------------------------------------------------------ */
/* Page sections — discriminated union keyed on `type`                 */
/* ------------------------------------------------------------------ */

const itemBase = { title: z.string(), description: z.string().optional() };

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hero"),
    eyebrow: z.string().optional(),
    heading: z.string(),
    subheading: z.string().optional(),
    image: imageSchema.optional(),
    ctas: z.array(ctaSchema).default([]),
  }),
  z.object({
    type: z.literal("about"),
    heading: z.string(),
    body: z.string(),
    image: imageSchema.optional(),
    stats: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .default([]),
  }),
  z.object({
    type: z.literal("features"),
    heading: z.string(),
    subheading: z.string().optional(),
    items: z.array(
      z.object({ ...itemBase, icon: z.string().optional() }),
    ),
  }),
  z.object({
    type: z.literal("services"),
    heading: z.string(),
    subheading: z.string().optional(),
    items: z.array(
      z.object({ ...itemBase, icon: z.string().optional(), price: z.string().optional() }),
    ),
  }),
  z.object({
    type: z.literal("projects"),
    heading: z.string(),
    subheading: z.string().optional(),
    items: z.array(
      z.object({
        ...itemBase,
        image: imageSchema.optional(),
        href: z.string().optional(),
        tags: z.array(z.string()).default([]),
      }),
    ),
  }),
  z.object({
    type: z.literal("testimonials"),
    heading: z.string(),
    items: z.array(
      z.object({
        quote: z.string(),
        author: z.string(),
        role: z.string().optional(),
        avatar: imageSchema.optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("faq"),
    heading: z.string(),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  z.object({
    type: z.literal("pricing"),
    heading: z.string(),
    subheading: z.string().optional(),
    plans: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        period: z.string().optional(),
        description: z.string().optional(),
        features: z.array(z.string()).default([]),
        cta: ctaSchema.optional(),
        featured: z.boolean().default(false),
      }),
    ),
  }),
  z.object({
    type: z.literal("contact"),
    heading: z.string(),
    subheading: z.string().optional(),
    email: z.string().optional(),
  }),
]);
export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section["type"];

export const pageSchema = z.object({
  schemaVersion: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(sectionSchema),
});
export type Page = z.infer<typeof pageSchema>;

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
