import { Check } from "lucide-react";
import type { Section } from "@/lib/schemas";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";
import { cn } from "@/lib/utils";

type Props = Extract<Section, { type: "pricing" }>;

export function Pricing({ heading, subheading, plans }: Props) {
  return (
    <section id="pricing" className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-lg border bg-card p-7",
                plan.featured
                  ? "border-primary shadow-lg ring-1 ring-primary"
                  : "border-border",
              )}
            >
              {plan.featured && (
                <span className="mb-4 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
              {plan.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              )}
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.cta && (
                <Button
                  href={plan.cta.href}
                  variant={plan.featured ? "primary" : plan.cta.variant}
                  className="mt-7 w-full"
                >
                  {plan.cta.label}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
