import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPost, getProfile } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = post.author ?? getProfile().author.name;

  return (
    <article className="container max-w-3xl py-16 sm:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to blog
      </Link>

      <header className="mt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-accent-foreground">
            {post.category}
          </span>
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        <p className="mt-4 text-sm text-muted-foreground">By {author}</p>
      </header>

      {post.cover && (
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          width={1200}
          height={630}
          className="mt-10 aspect-[16/9] w-full rounded-lg border border-border object-cover"
          priority
        />
      )}

      <div className="mt-10">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  );
}
