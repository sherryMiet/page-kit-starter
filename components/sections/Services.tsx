import type { Section } from "@/lib/schemas";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

type Props = Extract<Section, { type: "services" }>;

export function Services({ heading, subheading, items }: Props) {
  return (
    <section id="services" className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <SectionHeading heading={heading} subheading={subheading} />
        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.title}
              className="flex gap-5 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold">
                    {item.title}
                  </h3>
                  {item.price && (
                    <span className="text-sm font-medium text-primary">
                      {item.price}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
