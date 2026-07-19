/**
 * Serves imported/uploaded images from `content/assets/` at `/assets/<file>`.
 *
 * PageKit keeps images in `content/` (never in source dirs like `public/`), so
 * this route bridges that to a public URL. Every asset present at build time is
 * prerendered as a static file via generateStaticParams; assets added later are
 * served on demand (dynamicParams defaults to true).
 */
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

const ASSETS_DIR = path.join(process.cwd(), "content", "assets");

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml"
};

export function generateStaticParams(): { path: string[] }[] {
  try {
    return fs
      .readdirSync(ASSETS_DIR)
      .filter((name) => CONTENT_TYPES[path.extname(name).toLowerCase()])
      .map((name) => ({ path: [name] }));
  } catch {
    return [];
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path: segments } = await params;
  const name = segments?.[0];

  // content/assets is a single flat directory — reject nesting and traversal.
  if (!name || segments.length !== 1 || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new Response("Not found", { status: 404 });
  }

  const type = CONTENT_TYPES[path.extname(name).toLowerCase()];
  if (!type) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const bytes = fs.readFileSync(path.join(ASSETS_DIR, name));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "content-type": type,
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
