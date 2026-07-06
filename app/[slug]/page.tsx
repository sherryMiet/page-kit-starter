import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getPageNames } from "@/lib/content";
import { SectionRenderer } from "@/components/SectionRenderer";

type Params = { params: Promise<{ slug: string }> };

// "landing" is served at "/" (app/page.tsx); every other page file under
// content/pages/ gets its own route here. Static routes like /blog win over
// this dynamic segment, so a page named "blog" would be shadowed.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPageNames()
    .filter((name) => name !== "landing")
    .map((name) => ({ slug: name }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!getPageNames().includes(slug)) return {};
  const page = getPage(slug);
  return { title: page.title, description: page.description };
}

export default async function ContentPage({ params }: Params) {
  const { slug } = await params;
  if (slug === "landing" || !getPageNames().includes(slug)) notFound();

  const page = getPage(slug);
  return <SectionRenderer sections={page.sections} />;
}
