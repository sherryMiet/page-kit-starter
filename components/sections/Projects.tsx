import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/schemas";
import { SectionHeading } from "../ui/SectionHeading";

type Props = Extract<Section, { type: "projects" }>;

export function Projects({ heading, subheading, items }: Props) {
  return (
    <section id="projects" className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <SectionHeading heading={heading} subheading={subheading} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const card = (
              <article className="group h-full overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40">
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width ?? 600}
                    height={item.image.height ?? 400}
                    className="aspect-[3/2] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[3/2] w-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))]" />
                )}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
            return (
              <li key={item.title}>
                {item.href ? <Link href={item.href}>{card}</Link> : card}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
