import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { SectionRenderer } from "@/components/SectionRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("landing");
  return { title: page.title, description: page.description };
}

export default function HomePage() {
  const page = getPage("landing");
  return <SectionRenderer sections={page.sections} />;
}
