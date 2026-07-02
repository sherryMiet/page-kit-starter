import type { ColorSet, Theme } from "../schemas";

/**
 * The theme engine. Turns the structured `theme.json` tokens into the CSS
 * custom properties that Tailwind reads (see `tailwind.config.ts`). Light
 * tokens live on `:root`; dark tokens live under `.dark`, matching Tailwind's
 * class-based dark mode. Because everything flows through these variables,
 * re-theming the whole site is a pure content edit.
 */

const COLOR_VARS: Record<keyof ColorSet, string> = {
  background: "--color-background",
  foreground: "--color-foreground",
  muted: "--color-muted",
  mutedForeground: "--color-muted-foreground",
  card: "--color-card",
  cardForeground: "--color-card-foreground",
  border: "--color-border",
  input: "--color-input",
  ring: "--color-ring",
  primary: "--color-primary",
  primaryForeground: "--color-primary-foreground",
  accent: "--color-accent",
  accentForeground: "--color-accent-foreground",
};

function colorBlock(colors: ColorSet): string {
  return (Object.keys(COLOR_VARS) as (keyof ColorSet)[])
    .map((key) => `  ${COLOR_VARS[key]}: ${colors[key]};`)
    .join("\n");
}

/** Build the global CSS injected once in the root layout. */
export function generateThemeCss(theme: Theme): string {
  return `:root {
${colorBlock(theme.colors.light)}
  --radius: ${theme.radius};
  --font-sans: ${theme.fonts.sans};
  --font-heading: ${theme.fonts.heading};
}

.dark {
${colorBlock(theme.colors.dark)}
}`;
}

/**
 * Inline script that applies the saved/system color mode before first paint,
 * preventing a flash of the wrong theme. Stringified and injected in <head>.
 */
export function themeInitScript(defaultMode: Theme["defaultMode"]): string {
  return `(function(){try{var s=localStorage.getItem('theme');var m=s||'${defaultMode}';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
}
