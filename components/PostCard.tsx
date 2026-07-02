import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "group grid gap-6 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-2"
          : "group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
      }
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={800}
            height={featured ? 500 : 400}
            className={`w-full object-cover ${featured ? "h-full min-h-56" : "aspect-[3/2]"}`}
          />
        ) : (
          <div
            className={`w-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] ${
              featured ? "h-full min-h-56" : "aspect-[3/2]"
            }`}
          />
        )}
      </Link>
      <div className="flex flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
            {post.category}
          </span>
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-semibold">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
