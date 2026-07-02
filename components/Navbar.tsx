import Link from "next/link";
import type { Navigation, Profile } from "@/lib/schemas";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({
  profile,
  navigation,
}: {
  profile: Profile;
  navigation: Navigation;
}) {
  const { links, cta } = navigation.header;
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight">
          {profile.siteName}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {cta && (
            <Button href={cta.href} variant={cta.variant} size="sm" className="hidden sm:inline-flex">
              {cta.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
