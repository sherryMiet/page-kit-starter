import Image from "next/image";
import type { Section } from "@/lib/schemas";
import { SectionHeading } from "../ui/SectionHeading";

type Props = Extract<Section, { type: "testimonials" }>;

export function Testimonials({ heading, items }: Props) {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <SectionHeading heading={heading} />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                “{item.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                {item.avatar && (
                  <Image
                    src={item.avatar.src}
                    alt={item.avatar.alt}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold">{item.author}</p>
                  {item.role && (
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
