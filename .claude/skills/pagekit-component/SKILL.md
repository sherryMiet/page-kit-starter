---
name: pagekit-component
description: Frontend Engineer 的工作流。當使用者要實作或修改 section 的 React 元件、content renderer、section 註冊表，或 landing/blog/portfolio 的頁面與路由時使用。Stack 為 Next.js (App Router) + TypeScript + Tailwind，元件吃 @/lib/schemas 推導出的型別，樣式只用 theme 的 CSS 變數 token。
---

# PageKit Component（Frontend Engineer）

你擁有 **Theme Engine、Content Renderer、Blog Pages、Landing Pages**。元件是純粹的「型別 → JSX」對應：吃 `@/lib/schemas` 的型別當 props，所有視覺用 Tailwind token，沒有寫死的顏色或字體。

## 鐵則

- **型別來自 schema**：props 一律用 `Section`、`Page`、`Profile`、`Post` 等從 `@/lib/schemas` 匯出的型別，**不要**重新定義 interface。
- **只用 token class**：`bg-background / text-foreground / bg-card / text-muted-foreground / border-border / bg-primary / text-primary-foreground / bg-accent` 等，以及 `rounded-lg|md|sm`、`font-sans|heading`。禁止寫死 hex 或 `text-gray-500`，否則主題切換會失效。
- **響應式**：用 `container` 置中，行動優先（先寫手機樣式再加 `md:` / `lg:`）。
- **無障礙**：語意化標籤、正確的標題層級、圖片必填 `alt`、互動元素有 focus-visible 與 ARIA。
- **動畫**：進場用 `animate-fade-up`（已定義於 tailwind config）。
- **圖片**：用 `next/image`；遠端網域已在 `next.config.mjs` 放行。
- 路徑別名 `@/*`。Server Component 優先，需要互動 (主題切換、表單) 才加 `"use client"`。

## Section Renderer 模式

Content renderer 接收 `Page.sections`（discriminated union 陣列），依 `section.type` 對應到元件。維持一個註冊表，例如：

```tsx
// components/sections/index.ts
const registry = {
  hero: HeroSection,
  features: FeaturesSection,
  // ...每個 type 一個
} satisfies Record<SectionType, ComponentType<any>>;
```

renderer 走訪 `sections`，用 `section.type` 查表並把整個 section 物件當 props 傳入。**新增一個 section type 時，schema、元件、註冊表三者都要補上**——TypeScript 的 `Record<SectionType, …>` 會強制你補齊，缺一個就編譯失敗。

## 流程（實作一個 section 元件）

1. 確認該 section 的 schema（若尚未設計，先用 `pagekit-section`）。
2. 在 `components/sections/<Type>Section.tsx` 建立元件，props 型別用 `Extract<Section, { type: "<type>" }>`。
3. 用 token class 刻出符合視覺規格的 RWD 版面。
4. 在 `components/sections/index.ts` 註冊表登記。
5. 若是新頁面，於 `app/` 建立路由，讀取對應的 `content/*.json`，用 schema 驗證後交給 renderer。

## 驗證

務必執行：

```bash
npm run typecheck
npm run lint
```

兩者通過才算完成。可能的話 `npm run dev` 目視確認 light/dark 與手機/桌機版面。回報跑了哪些檢查與結果。
