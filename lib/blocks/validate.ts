// VENDORED FROM page-kit src/lib/blocks/validate.ts — DO NOT EDIT; sync from the page-kit repo.
/**
 * Page document validation.
 *
 * Two layers with different strictness:
 * - structure (id/type/props/children/version/slug) is STRICT — a malformed
 *   tree is an error and nothing else is checked;
 * - block types are LENIENT — unknown types are warnings so documents written
 *   by a newer editor still validate (and render, degraded) on older code.
 *
 * Every issue carries the JSON path of the offending node — in the `path`
 * field and repeated inside `message` — e.g. `blocks.0.children.2.props.level`.
 *
 * NOTE: this file is vendored into page-kit-starter (lib/blocks/validate.ts).
 * Keep it dependency-free apart from zod and ./schema / ./html, and sync the
 * copy after editing.
 */

import { findDisallowedHtmlTags } from "./html";
import {
  blockPropsRegistry,
  containerChildRules,
  MAX_BLOCK_DEPTH,
  pageDocumentSchema,
  type BlockNode
} from "./schema";

export interface BlockIssue {
  path: string;
  message: string;
  code: string;
}

export interface PageValidationResult {
  errors: BlockIssue[];
  warnings: BlockIssue[];
}

function joinPath(segments: ReadonlyArray<string | number>): string {
  return segments.length === 0 ? "(root)" : segments.join(".");
}

export function validatePageDocument(input: unknown): PageValidationResult {
  const errors: BlockIssue[] = [];
  const warnings: BlockIssue[] = [];

  // Layer 1 — strict structure. On failure, report and stop: the tree shape
  // cannot be trusted, so the walks below would only produce noise.
  const parsed = pageDocumentSchema.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const path = joinPath(issue.path);
      errors.push({
        path,
        message: `${path}: ${issue.message}`,
        code: "INVALID_STRUCTURE"
      });
    }
    return { errors, warnings };
  }

  const blocks = parsed.data.blocks;
  checkDepth(blocks, "blocks", 1, errors);
  checkDuplicateIds(blocks, "blocks", errors);
  walkBlockTypes(blocks, "blocks", errors, warnings);

  return { errors, warnings };
}

/** Independent depth walk; top-level `blocks` entries are at depth 1. */
function checkDepth(nodes: BlockNode[], basePath: string, depth: number, errors: BlockIssue[]): void {
  nodes.forEach((node, index) => {
    const path = `${basePath}.${index}`;
    if (depth > MAX_BLOCK_DEPTH) {
      errors.push({
        path,
        message: `${path}: block nesting depth ${depth} exceeds the maximum of ${MAX_BLOCK_DEPTH}`,
        code: "MAX_DEPTH_EXCEEDED"
      });
      return; // Everything below is even deeper; one error per branch is enough.
    }
    checkDepth(node.children, `${path}.children`, depth + 1, errors);
  });
}

function checkDuplicateIds(nodes: BlockNode[], basePath: string, errors: BlockIssue[]): void {
  const seen = new Map<string, string>();

  const walk = (children: BlockNode[], path: string): void => {
    children.forEach((node, index) => {
      const nodePath = `${path}.${index}`;
      const firstPath = seen.get(node.id);
      if (firstPath !== undefined) {
        errors.push({
          path: `${nodePath}.id`,
          message: `${nodePath}.id: duplicate block id "${node.id}" (first used at ${firstPath})`,
          code: "DUPLICATE_ID"
        });
      } else {
        seen.set(node.id, nodePath);
      }
      walk(node.children, `${nodePath}.children`);
    });
  };

  walk(nodes, basePath);
}

/** Layer 2 — lenient block-type checks (props, placement, children, html). */
function walkBlockTypes(nodes: BlockNode[], basePath: string, errors: BlockIssue[], warnings: BlockIssue[]): void {
  nodes.forEach((node, index) => {
    const path = `${basePath}.${index}`;
    const propsSchema = blockPropsRegistry[node.type];

    if (propsSchema === undefined) {
      // Unknown type: warn and skip the whole subtree — we cannot judge the
      // children of a block we do not understand.
      warnings.push({
        path,
        message: `${path}: unknown block type "${node.type}"`,
        code: "UNKNOWN_BLOCK_TYPE"
      });
      return;
    }

    const propsResult = propsSchema.safeParse(node.props);
    if (!propsResult.success) {
      for (const issue of propsResult.error.issues) {
        const issuePath = joinPath([`${path}.props`, ...issue.path]);
        errors.push({
          path: issuePath,
          message: `${issuePath}: ${issue.message}`,
          code: "INVALID_PROPS"
        });
      }
    }

    const allowedChildren = containerChildRules[node.type];
    if (allowedChildren === undefined) {
      // Known content block: it must be a leaf.
      if (node.children.length > 0) {
        errors.push({
          path: `${path}.children`,
          message: `${path}.children: "${node.type}" blocks cannot have children`,
          code: "UNEXPECTED_CHILDREN"
        });
      }
    } else {
      // Known container: misplaced KNOWN children are warnings only — the
      // renderer auto-wraps them in the missing container.
      node.children.forEach((child, childIndex) => {
        if (blockPropsRegistry[child.type] !== undefined && !allowedChildren.includes(child.type)) {
          const childPath = `${path}.children.${childIndex}`;
          warnings.push({
            path: childPath,
            message: `${childPath}: "${child.type}" is not an allowed child of "${node.type}"`,
            code: "INVALID_PLACEMENT"
          });
        }
      });
    }

    if (node.type === "text" && typeof node.props.html === "string") {
      for (const tag of findDisallowedHtmlTags(node.props.html)) {
        warnings.push({
          path: `${path}.props.html`,
          message: `${path}.props.html: disallowed HTML tag <${tag}>`,
          code: "DISALLOWED_HTML_TAG"
        });
      }
    }

    walkBlockTypes(node.children, `${path}.children`, errors, warnings);
  });
}
