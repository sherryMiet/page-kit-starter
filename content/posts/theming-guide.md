---
schemaVersion: "1.0.0"
status: "published"
title: "Theming PageKit"
excerpt: "How the token-based theme engine works, and how to make it yours."
date: "2026-06-08"
category: "Guides"
tags: ["theming", "design-system"]
author: "Alex Rivera"
---

## One file to rule the look

The entire visual system flows from `content/theme.json`. It defines colors for
light and dark modes, the font stack, and the corner radius:

```json
{
  "radius": "0.75rem",
  "colors": {
    "light": { "primary": "#6366f1", "background": "#ffffff" },
    "dark":  { "primary": "#818cf8", "background": "#09090b" }
  }
}
```

### How it reaches the screen

1. The theme engine turns those tokens into CSS custom properties.
2. Tailwind maps utility classes like `bg-primary` to those variables.
3. A tiny inline script applies the saved color mode before first paint.

Because every component reads the variables, **changing one token re-themes the
whole site** — including dark mode — with zero code changes.

### Make it yours

Try swapping `primary` to your brand color and reload. That's the whole workflow.
