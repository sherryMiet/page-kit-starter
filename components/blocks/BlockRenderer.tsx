import type { ReactNode } from "react";
import { blockPropsRegistry, containerChildRules, type BlockNode } from "@/lib/blocks/schema";
import { blockRegistry } from "./registry";

/** Synthesizes a wrapper node around `child`. Ids are namespaced so they can't collide with real ids. */
function wrap(type: string, child: BlockNode): BlockNode {
  return { id: `__auto-${type}-${child.id}`, type, props: {}, children: [child] };
}

/**
 * Builds the wrapper chain needed to legally nest `child` under a container
 * whose default child type is `defaultChildType` (`containerChildRules[parentType][0]`).
 * Walks down through each level's own default child until `child`'s type is
 * an allowed child of the innermost wrapper (or we run out of known
 * containers to wrap with, in which case we stop — the caller's placement
 * warning already fired).
 *
 * Example: section's default child is "row"; row's default child is
 * "column"; a `heading` under `section` becomes `row > column > heading`.
 */
function wrapForContainer(defaultChildType: string, child: BlockNode): BlockNode {
  const allowedInWrapper = containerChildRules[defaultChildType];
  if (allowedInWrapper === undefined || allowedInWrapper.includes(child.type)) {
    return wrap(defaultChildType, child);
  }
  return wrap(defaultChildType, wrapForContainer(allowedInWrapper[0], child));
}

function warnUnknown(node: BlockNode, pageSlug: string, seen: Set<string>): void {
  const key = `unknown:${node.id}`;
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(`[blocks] unknown block type "${node.type}" (id=${node.id}, page=${pageSlug})`);
}

function warnPlacement(child: BlockNode, parentType: string, pageSlug: string, seen: Set<string>): void {
  const key = `placement:${child.id}`;
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(
    `[blocks] "${child.type}" is not an allowed child of "${parentType}", auto-wrapping (id=${child.id}, page=${pageSlug})`,
  );
}

function warnProps(node: BlockNode, pageSlug: string, seen: Set<string>): void {
  const key = `props:${node.id}`;
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(`[blocks] invalid props for block type "${node.type}" (id=${node.id}, page=${pageSlug}), skipping`);
}

/**
 * Renders a single node. Returns null (and warns once) when:
 * - the type is unknown to the registry, or
 * - its props fail the registry schema (defensive; build-time validation
 *   should already have caught this).
 * Misplaced known children of a known container are auto-wrapped in the
 * container's default child chain before being rendered.
 */
function renderNode(node: BlockNode, pageSlug: string, warned: Set<string>): ReactNode {
  const Component = blockRegistry[node.type];
  const propsSchema = blockPropsRegistry[node.type];

  if (Component === undefined || propsSchema === undefined) {
    warnUnknown(node, pageSlug, warned);
    return null;
  }

  const parsed = propsSchema.safeParse(node.props);
  if (!parsed.success) {
    warnProps(node, pageSlug, warned);
    return null;
  }

  const allowedChildren = containerChildRules[node.type];
  const cleanNode: BlockNode = { ...node, props: parsed.data as Record<string, unknown> };

  if (allowedChildren === undefined) {
    // Known content block: leaf, no children to render.
    return <Component key={node.id} node={cleanNode} />;
  }

  const renderedChildren = node.children
    .map((child) => {
      const isKnown = blockRegistry[child.type] !== undefined;
      if (isKnown && !allowedChildren.includes(child.type)) {
        warnPlacement(child, node.type, pageSlug, warned);
        const wrapped = wrapForContainer(allowedChildren[0], child);
        return renderNode(wrapped, pageSlug, warned);
      }
      return renderNode(child, pageSlug, warned);
    })
    .filter((el) => el !== null);

  return (
    <Component key={node.id} node={cleanNode}>
      {renderedChildren}
    </Component>
  );
}

export function BlockRenderer({ blocks, pageSlug }: { blocks: BlockNode[]; pageSlug: string }) {
  const warned = new Set<string>();
  return <>{blocks.map((block) => renderNode(block, pageSlug, warned))}</>;
}
