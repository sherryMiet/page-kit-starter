// VENDORED FROM page-kit src/lib/blocks/html.ts — DO NOT EDIT; sync from the page-kit repo.
/**
 * Restricted HTML helpers for `text` blocks.
 *
 * Text blocks store a small subset of HTML produced by our own editor. These
 * helpers run on the server/build side to (a) sanitize that HTML down to the
 * whitelist and (b) report out-of-whitelist tags for build warnings. Input is
 * trusted-ish (our own editor), so this is deliberately simpler than a full
 * DOMPurify-grade sanitizer — but it must still strip scripts, comments,
 * attributes and dangerous URL schemes.
 *
 * NOTE: this file is vendored into page-kit-starter (lib/blocks/html.ts).
 * Keep it dependency-free, and sync the copy after editing.
 */

/** The only tags allowed inside a `text` block. Single source of truth. */
export const RESTRICTED_HTML_TAGS = ["p", "br", "strong", "em", "b", "i", "a", "ul", "ol", "li"] as const;

const ALLOWED_TAGS = new Set<string>(RESTRICTED_HTML_TAGS);

/** Matches comments, script/style elements (with content), and lone tags. */
const HTML_TOKEN_PATTERN =
  /<!--[\s\S]*?(?:-->|$)|<(script|style)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$)|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g;

const HREF_PATTERN = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

/** True when the href resolves to a javascript:/data:/vbscript: scheme. */
function hasDangerousScheme(href: string): boolean {
  // Browsers ignore whitespace and control characters inside the scheme, so
  // "  java\nscript:" is still executable. Strip them before checking.
  const collapsed = href.replace(/[\s\u0000-\u001f]/g, "").toLowerCase();
  return /^(javascript|data|vbscript):/.test(collapsed);
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/**
 * Reduce `html` to the restricted whitelist:
 * - comments and <script>/<style> elements are removed together with their content;
 * - tags outside the whitelist lose their markup but keep their text content;
 * - <a> keeps only a safe `href` (javascript:/data:/vbscript: are dropped);
 * - every other whitelisted tag keeps no attributes at all.
 */
export function sanitizeRestrictedHtml(html: string): string {
  return html.replace(HTML_TOKEN_PATTERN, (token, rawBlock, tagName: string | undefined, attrs: string | undefined) => {
    // Comment or <script>/<style> element: drop entirely, content included.
    if (tagName === undefined) {
      return "";
    }

    const name = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) {
      // Unknown tag: remove the markup, keep surrounding text content.
      return "";
    }

    if (token.startsWith("</")) {
      return `</${name}>`;
    }

    if (name === "a") {
      const match = (attrs ?? "").match(HREF_PATTERN);
      const href = match?.[1] ?? match?.[2] ?? match?.[3];
      if (href !== undefined && !hasDangerousScheme(href)) {
        return `<a href="${escapeAttribute(href)}">`;
      }
      return "<a>";
    }

    return `<${name}>`;
  });
}

/**
 * List the tag names in `html` that fall outside the whitelist (deduped,
 * lowercase). Used to surface build warnings for `text` blocks.
 */
export function findDisallowedHtmlTags(html: string): string[] {
  const found = new Set<string>();
  const withoutComments = html.replace(/<!--[\s\S]*?(?:-->|$)/g, "");
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:"[^"]*"|'[^']*'|[^"'>])*>/g;

  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(withoutComments)) !== null) {
    const name = match[1].toLowerCase();
    if (!ALLOWED_TAGS.has(name)) {
      found.add(name);
    }
  }

  return [...found];
}
