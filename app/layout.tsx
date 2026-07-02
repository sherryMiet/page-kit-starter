import type { Metadata } from "next";
import { getNavigation, getProfile, getTheme } from "@/lib/content";
import { generateThemeCss, themeInitScript } from "@/lib/theme";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export function generateMetadata(): Metadata {
  const profile = getProfile();
  return {
    title: {
      default: `${profile.siteName}${profile.tagline ? ` — ${profile.tagline}` : ""}`,
      template: `%s · ${profile.siteName}`,
    },
    description: profile.description,
    openGraph: {
      title: profile.siteName,
      description: profile.description,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = getTheme();
  const profile = getProfile();
  const navigation = getNavigation();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme tokens → CSS variables, generated from content/theme.json */}
        <style dangerouslySetInnerHTML={{ __html: generateThemeCss(theme) }} />
        {/* Apply color mode before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript(theme.defaultMode),
          }}
        />
      </head>
      <body>
        <Navbar profile={profile} navigation={navigation} />
        <main>{children}</main>
        <Footer profile={profile} navigation={navigation} />
      </body>
    </html>
  );
}
