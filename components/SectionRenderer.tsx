import type { Section } from "@/lib/schemas";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Faq } from "./sections/Faq";
import { Features } from "./sections/Features";
import { Hero } from "./sections/Hero";
import { Pricing } from "./sections/Pricing";
import { Projects } from "./sections/Projects";
import { Services } from "./sections/Services";
import { Testimonials } from "./sections/Testimonials";

/**
 * The content renderer. Maps each `type` from a page's JSON section list to its
 * component. Adding a new section means: add it to the schema union, build the
 * component, and register it here. Pages stay pure data.
 */
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.type) {
          case "hero":
            return <Hero key={i} {...section} />;
          case "about":
            return <About key={i} {...section} />;
          case "features":
            return <Features key={i} {...section} />;
          case "services":
            return <Services key={i} {...section} />;
          case "projects":
            return <Projects key={i} {...section} />;
          case "testimonials":
            return <Testimonials key={i} {...section} />;
          case "faq":
            return <Faq key={i} {...section} />;
          case "pricing":
            return <Pricing key={i} {...section} />;
          case "contact":
            return <Contact key={i} {...section} />;
          default: {
            // Exhaustiveness guard: a new section type without a case is a
            // compile-time error here.
            const _never: never = section;
            return _never;
          }
        }
      })}
    </>
  );
}
