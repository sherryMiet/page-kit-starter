import Link from "next/link";
import type { Navigation, Profile } from "@/lib/schemas";

export function Footer({
  profile,
  navigation,
}: {
  profile: Profile;
  navigation: Navigation;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <p className="font-heading text-lg font-bold">{profile.siteName}</p>
            {profile.tagline && (
              <p className="mt-2 text-sm text-muted-foreground">
                {profile.tagline}
              </p>
            )}
            {profile.socials.length > 0 && (
              <ul className="mt-4 flex gap-4">
                {profile.socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {navigation.footer.groups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.siteName}. All rights reserved.
          </p>
          {navigation.footer.note && <p>{navigation.footer.note}</p>}
        </div>
      </div>
    </footer>
  );
}
