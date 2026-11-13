import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  return pageMetadata(getPage("landing"));
}

export default function HomePage() {
  const page = getPage("landing");
  return <BlockRenderer blocks={page.blocks} pageSlug="landing" />;
}
