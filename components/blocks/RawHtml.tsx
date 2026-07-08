import type { BlockComponentProps } from "./registry";

/**
 * Weebly-import escape hatch: renders `props.html` unsanitized. The build-time
 * validator (lib/blocks/validate.ts) already warns on disallowed tags for
 * `text` blocks; `raw-html` is intentionally exempt from that check, so this
 * component trusts its input as-is.
 */
export function RawHtml({ node }: BlockComponentProps) {
  const html = node.props.html as string;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
