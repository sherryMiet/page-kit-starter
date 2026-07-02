---
name: pagekit-section
description: Template Designer 的工作流。當使用者要設計一個新的「可重用 section 類型」(例如 hero、features、pricing、timeline、skills…) 時使用。負責定義該 section 的 Zod schema（加入 sectionSchema 的 discriminated union）、欄位設計、範例內容與視覺/響應式/無障礙規格。實作 React 元件交給 pagekit-component。
---

# PageKit Section（Template Designer）

你設計**可重用的 section 類型**。每個 section 是 `@/lib/schemas` 中 `sectionSchema` discriminated union 的一個成員，以 `type` 字面量區分。內容由 JSON 驅動，所以你的 schema 就是這個 section 「能被編輯的所有欄位」。

## 已有的 section 類型

`hero, about, features, services, projects, testimonials, faq, pricing, contact`

Portfolio / Blog 還需要的（依專案 README）：`works, timeline, skills, experience, featured-posts, recent-posts, categories, newsletter, author-profile`。

## 設計原則

- **內容優先**：欄位只放「內容」，不放樣式決策（顏色、間距交給元件 + theme）。
- **務實的選用性**：必要欄位用必填，裝飾性欄位 `.optional()`，陣列給 `.default([])`，避免內容缺欄就壞掉。
- **沿用既有 primitive**：`imageSchema`、`linkSchema`、`ctaSchema`、`itemBase`（`{ title, description? }`）已存在，重用它們以維持一致性。
- **可由 Dashboard 生成表單**：欄位命名清楚、扁平、可預測，因為表單會直接從 schema 產生。

## 流程

1. **定義 `type` 字面量**（kebab-case，例 `"timeline"`）並確認與既有不衝突。
2. **設計欄位**：通常有一個 `heading`、選填 `subheading`，加上一個 `items` / `plans` / 自訂結構陣列。參考既有 section 的形狀維持風格一致。
3. **加入 `sectionSchema` 的 discriminated union**（在 `lib/schemas.ts`），緊接相似的 section 之後。
4. **寫視覺規格**給 Frontend Engineer（給 pagekit-component 用）：
   - 桌機 / 平板 / 手機的版面（欄數、堆疊方式）。
   - 用到哪些 Tailwind token（`bg-card`、`text-muted-foreground`、`rounded-lg`…）與 `container`。
   - 無障礙：標題層級、focus 狀態、圖片 alt、互動元素的 ARIA。
   - 進場動畫可用既有的 `animate-fade-up`。
5. **產出範例內容 JSON**（一段符合新 schema 的 `sections[]` 物件），方便測試與當預設內容。

## 驗證

修改 `lib/schemas.ts` 後執行 `npm run typecheck`，確認 discriminated union 與型別匯出（`Section` / `SectionType`）仍正確。

## 交接

完成後輸出：(1) 新增的 schema 片段、(2) 視覺/響應式/無障礙規格、(3) 範例內容 JSON。建議接著用 `pagekit-component` 實作對應的 React 元件並接進 renderer。
