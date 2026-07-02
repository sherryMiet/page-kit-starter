import Image from "next/image";
import type { Section } from "@/lib/schemas";

type Props = Extract<Section, { type: "about" }>;

export function About({ heading, body, image, stats }: Props) {
  return (
    <section id="about" className="border-t border-border py-20 sm:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {body}
          </p>

          {stats.length > 0 && (
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-3xl font-bold text-primary">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          )}
        </div>

        {image ? (
          <div className="overflow-hidden rounded-lg border border-border">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 800}
              height={image.height ?? 600}
              className="h-auto w-full"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))] opacity-90" />
        )}
      </div>
    </section>
  );
}
