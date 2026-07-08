import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("landing");
  return { title: page.title, description: page.meta?.description };
}

export default function HomePage() {
  const page = getPage("landing");
  return <BlockRenderer blocks={page.blocks} pageSlug="landing" />;
}
