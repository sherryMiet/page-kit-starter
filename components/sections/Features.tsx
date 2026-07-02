import type { Section } from "@/lib/schemas";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

type Props = Extract<Section, { type: "features" }>;

export function Features({ heading, subheading, items }: Props) {
  return (
    <section id="features" className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <SectionHeading heading={heading} subheading={subheading} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-primary">
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
