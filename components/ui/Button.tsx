import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  secondary:
    "border border-border bg-card text-foreground hover:bg-muted",
  ghost: "text-foreground hover:bg-muted",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

type ButtonAsLink = {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, "href">;

export function Button({
  href,
  variant = "primary",
  size = "md",
  external,
  className,
  ...props
}: ButtonAsLink) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external || /^https?:|^mailto:/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...(props as ComponentProps<"a">)}
      />
    );
  }
  return <Link href={href} className={classes} {...props} />;
}
