import { ChevronDown } from "lucide-react";
import type { Section } from "@/lib/schemas";
import { SectionHeading } from "../ui/SectionHeading";

type Props = Extract<Section, { type: "faq" }>;

export function Faq({ heading, items }: Props) {
  return (
    <section id="faq" className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <SectionHeading heading={heading} />
        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border rounded-lg border border-border bg-card">
          {items.map((item, i) => (
            <details key={i} className="group p-5 [&_summary]:list-none">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium">
                {item.question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
