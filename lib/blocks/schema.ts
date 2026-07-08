// VENDORED FROM page-kit src/lib/blocks/schema.ts — DO NOT EDIT; sync from the page-kit repo.
/**
 * Block tree schema — the authoritative definition of PageKit's page documents.
 *
 * A page is a versioned document holding a tree of blocks. Layout blocks
 * (section > row > column) provide structure; content blocks (heading, text,
 * image, ...) are leaves. `type` is intentionally an open string so unknown
 * blocks degrade gracefully (renderer skips them, validator warns) instead of
 * hard-failing the whole document.
 *
 * NOTE: this file is vendored into page-kit-starter (lib/blocks/schema.ts).
 * Keep it dependency-free apart from zod, and sync the copy after editing.
 */

import { z } from "zod";

export interface BlockNode {
  /** Unique within the tree. */
  id: string;
  /** Open string so unknown block types degrade gracefully. */
  type: string;
  props: Record<string, unknown>;
  children: BlockNode[];
}

export interface PageDocument {
  version: 1;
  /** ^[a-z0-9][a-z0-9-]*$ */
  slug: string;
  title: string;
  meta?: { description?: string };
  blocks: BlockNode[];
}

/** Shape accepted by the schema before defaults are applied. */
type BlockNodeInput = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: BlockNodeInput[];
};

export const blockNodeSchema: z.ZodType<BlockNode, z.ZodTypeDef, BlockNodeInput> = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      type: z.string().min(1),
      props: z.record(z.unknown()),
      children: z.array(blockNodeSchema).default([])
    })
    .strict()
);

export const pageDocumentSchema = z
  .object({
    version: z.literal(1),
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    title: z.string(),
    meta: z
      .object({
        description: z.string().optional()
      })
      .strict()
      .optional(),
    blocks: z.array(blockNodeSchema)
  })
  .strict();

/** Maximum nesting depth; the top-level `blocks` entries are at depth 1. */
export const MAX_BLOCK_DEPTH = 8;

export const LAYOUT_BLOCK_TYPES = ["section", "row", "column"] as const;

export const CONTENT_BLOCK_TYPES = [
  "heading",
  "text",
  "image",
  "button",
  "divider",
  "spacer",
  "raw-html",
  "post-list"
] as const;

/**
 * Props schema per known block type. Types absent from this registry are
 * "unknown" — the validator warns about them instead of erroring.
 */
export const blockPropsRegistry: Record<string, z.ZodTypeAny> = {
  section: z
    .object({
      background: z
        .object({
          color: z.string().optional(),
          imageSrc: z.string().optional()
        })
        .strict()
        .optional(),
      padding: z.enum(["none", "sm", "md", "lg"]).optional(),
      width: z.enum(["full", "contained"]).optional()
    })
    .strict(),
  row: z
    .object({
      gap: z.enum(["none", "sm", "md", "lg"]).optional(),
      align: z.enum(["start", "center", "end", "stretch"]).optional()
    })
    .strict(),
  column: z
    .object({
      span: z.number().int().min(1).max(12).optional(),
      align: z.enum(["start", "center", "end"]).optional()
    })
    .strict(),
  heading: z
    .object({
      text: z.string(),
      level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
      align: z.enum(["left", "center", "right"]).optional()
    })
    .strict(),
  text: z
    .object({
      html: z.string()
    })
    .strict(),
  image: z
    .object({
      src: z.string().min(1),
      alt: z.string(),
      aspect: z.enum(["auto", "16:9", "4:3", "1:1"]).optional(),
      link: z.string().optional()
    })
    .strict(),
  button: z
    .object({
      label: z.string().min(1),
      href: z.string(),
      variant: z.enum(["primary", "secondary", "ghost"]).optional(),
      align: z.enum(["left", "center", "right"]).optional()
    })
    .strict(),
  divider: z.object({}).strict(),
  spacer: z
    .object({
      size: z.enum(["sm", "md", "lg", "xl"]).optional()
    })
    .strict(),
  "raw-html": z
    .object({
      html: z.string()
    })
    .strict(),
  "post-list": z
    .object({
      limit: z.number().int().positive().optional(),
      tag: z.string().optional()
    })
    .strict()
};

/**
 * Which known child types each container accepts. Used by the validator (a
 * misplaced known child is a warning, not an error — the renderer auto-wraps)
 * and later by the editor and renderer.
 */
export const containerChildRules: Record<string, string[]> = {
  section: ["row"],
  row: ["column"],
  column: [...CONTENT_BLOCK_TYPES, "row"]
};
