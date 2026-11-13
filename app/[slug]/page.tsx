import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getPageSlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPageSlugs()
    .filter((slug) => slug !== "landing")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    return pageMetadata(getPage(slug));
  } catch {
    return {};
  }
}

export default async function ContentPage({ params }: Params) {
  const { slug } = await params;
  if (!getPageSlugs().includes(slug)) notFound();

  const page = getPage(slug);
  return <BlockRenderer blocks={page.blocks} pageSlug={slug} />;
}
