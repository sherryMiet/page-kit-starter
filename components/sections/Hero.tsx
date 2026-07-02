import Image from "next/image";
import type { Section } from "@/lib/schemas";
import { Button } from "../ui/Button";

type Props = Extract<Section, { type: "hero" }>;

export function Hero({ eyebrow, heading, subheading, image, ctas }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-accent),transparent)]"
      />
      <div className="container py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-4 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">
            {heading}
          </h1>
          {subheading && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {subheading}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {ctas.map((cta) => (
                <Button key={cta.href} href={cta.href} variant={cta.variant} size="lg">
                  {cta.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {image && (
          <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-lg border border-border shadow-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 1600}
              height={image.height ?? 900}
              className="h-auto w-full"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
