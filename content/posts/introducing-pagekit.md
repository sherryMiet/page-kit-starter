---
schemaVersion: "1.0.0"
status: "published"
title: "Introducing PageKit"
excerpt: "A beautiful, fast, content-driven template system you can launch in minutes."
date: "2026-06-01"
category: "Announcements"
tags: ["release", "product"]
featured: true
author: "Alex Rivera"
cover:
  src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"
  alt: "Abstract gradient"
---

## Why we built PageKit

Most website templates make a quiet promise they can't keep: *"just edit the content."*
In practice, changing a headline means hunting through JSX, and re-theming means a
rewrite. We wanted something different — a template system where **content is the
source of truth**.

### Everything is editable

- **Pages** are composed from a JSON list of sections.
- **Theme** is a set of tokens in `theme.json`.
- **Posts** are Markdown with frontmatter.

No piece of content requires touching a component. A dashboard can generate forms
straight from the schema, so non-technical editors are first-class citizens.

### Fast by default

PageKit is built on the Next.js App Router with static-first rendering. Pages ship
as HTML, hydrate only what they need, and score 100 on Lighthouse out of the box.

> Great defaults, fully customizable. That's the whole idea.

Give it a try, and let us know what you build.
