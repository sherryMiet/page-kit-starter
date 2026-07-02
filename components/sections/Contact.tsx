import type { Section } from "@/lib/schemas";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";

type Props = Extract<Section, { type: "contact" }>;

export function Contact({ heading, subheading, email }: Props) {
  return (
    <section id="contact" className="border-t border-border py-20 sm:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center sm:p-12">
          <SectionHeading heading={heading} subheading={subheading} />
          {email && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button href={`mailto:${email}`} size="lg" external>
                Email us
              </Button>
              <a
                href={`mailto:${email}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {email}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
