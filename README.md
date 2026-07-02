# PageKit Starter

A beautiful, fast, customizable website template system. **Edit everything through
content — no code changes required.**

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

Everything you see is driven by files in `content/`, validated by Zod schemas in
[`lib/schemas.ts`](lib/schemas.ts). Because the schemas are the single source of
truth, a dashboard can generate editing forms from them automatically.

| File | Controls |
| --- | --- |
| `content/profile.json` | Site name, tagline, author, contact, socials |
| `content/theme.json` | Colors (light/dark), fonts, radius |
| `content/navigation.json` | Header & footer links |
| `content/pages/*.json` | The ordered list of **sections** that make up a page |
| `content/posts/*.md` | Blog posts (Markdown + frontmatter) |

### Theme engine

`theme.json` tokens become CSS custom properties via
[`lib/theme/index.ts`](lib/theme/index.ts); Tailwind reads those variables (see
`tailwind.config.ts`). Change one token and the **entire site re-themes**,
including dark mode. A pre-paint inline script applies the saved color mode to
avoid a flash.

### Composing a page

A page is a JSON list of sections rendered by
[`components/SectionRenderer.tsx`](components/SectionRenderer.tsx):

```json
{
  "title": "Home",
  "sections": [
    { "type": "hero", "heading": "...", "ctas": [] },
    { "type": "features", "heading": "...", "items": [] }
  ]
}
```

Reorder, remove, or duplicate sections by editing the array — no code.

## Available sections

`hero` · `about` · `features` · `services` · `projects` · `testimonials` ·
`faq` · `pricing` · `contact`

### Adding a new section

1. Add a variant to the `sectionSchema` union in `lib/schemas.ts`.
2. Build the component in `components/sections/`.
3. Register it in `components/SectionRenderer.tsx` (the `switch` is
   exhaustiveness-checked, so TypeScript will remind you).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |
| `npm run typecheck` | Type-check without emitting |

## License

MIT — open source and free to use.
