# PageKit 架構：Schema 驅動、程式碼與內容分離

## 核心目標

> **Dashboard 與 AI 只能操作 schema（內容）。兩者都不能產生 React code。**

整個系統因此切成兩個互不重疊的平面：

| 平面 | 內容物 | 誰能改 | 形式 |
|---|---|---|---|
| **內容平面 (Content Plane)** | `content/profile.json`、`content/theme.json`、`content/navigation.json`、`content/pages/*.json`、`content/posts/*.md` | Dashboard、AI | 純資料，必須通過 Zod schema 驗證 |
| **程式碼平面 (Code Plane)** | section React 元件、registry、renderer、theme engine | 只有工程師（含用 Claude Code 開發時） | TypeScript / React |

**registry 是唯一的橋**：它把 schema 裡的 `type` 字面量對應到預先寫好的 React 元件。內容平面只能「引用」既有的 section 類型，永遠無法「定義」新的渲染行為。

---

## 1. Schema 設計（內容平面的契約）

全部集中在 `lib/schemas.ts`，既是執行期驗證（Zod）也是編譯期型別（`z.infer`）。Dashboard 的表單與 AI 的輸出都直接由這些 schema 生成／約束。

- **`profileSchema`** — 站台身份：`siteName`、`tagline`、`author`、`contact`、`socials`。
- **`themeSchema`** — 視覺系統：`colors.light` / `colors.dark`（各 13 個 token）、`fonts`、`radius`、`defaultMode`。配色是**資料**，不是 code（見第 5 節）。
- **`pageSchema`** — 一個頁面 = `{ title, description?, sections: Section[] }`。
- **`sectionSchema`** — 以 `type` 為判別鍵的 **discriminated union**。這是整個架構的關鍵：
  - 它是一個**封閉集合**。`type` 只能是 union 內既有的字面量（`hero`、`about`、`features`…）。
  - 任何帶有未知 `type` 的 JSON，`sectionSchema.parse()` 會**直接拒絕**。
  - 因此內容平面不可能引入「沒有對應元件」的 section。

> 新增一種 section **類型**（改 union + 寫元件 + 登記 registry）是工程動作，要經 code review。
> 新增一個 section **實例**（在 JSON 裡多放一個 `{ "type": "hero", ... }`）是純內容動作，Dashboard/AI 隨意做。

---

## 2. Section Registry（橋接層）

`components/sections/registry.tsx`。用 mapped type 強制「每一個 section 類型都必須有一個元件，且元件的 props 形狀必須與該 section 變體完全吻合」：

```tsx
import type { ComponentType } from "react";
import type { Section, SectionType } from "@/lib/schemas";

// 取出某個 type 對應的 section 變體
type SectionProps<T extends SectionType> = Extract<Section, { type: T }>;

// 強制涵蓋所有 SectionType；少一個就編譯失敗
type SectionRegistry = { [T in SectionType]: ComponentType<SectionProps<T>> };

export const sectionRegistry: SectionRegistry = {
  hero: HeroSection,
  about: AboutSection,
  features: FeaturesSection,
  services: ServicesSection,
  projects: ProjectsSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  pricing: PricingSection,
  contact: ContactSection,
};
```

**雙向保證**：
- schema 端：`sectionSchema` 拒絕未知 type → 內容不會引用不存在的元件。
- registry 端：`{ [T in SectionType]: ... }` → 加了新 type 卻忘了寫元件，**`npm run typecheck` 直接報錯**。

兩邊夾住，內容平面與程式碼平面永遠保持同步，而 Dashboard/AI 完全碰不到這個檔案。

---

## 3. Renderer 架構（資料 → 畫面）

`components/PageRenderer.tsx`。把驗證過的 `Page` 走訪、查 registry、渲染。它**不含任何 section-specific 邏輯**——只是查表。

```tsx
import type { Page, Section } from "@/lib/schemas";
import { sectionRegistry } from "@/components/sections/registry";

function renderSection(section: Section, index: number) {
  // 依 type 縮窄；registry 已保證型別吻合
  const Component = sectionRegistry[section.type] as ComponentType<typeof section>;
  return <Component key={index} {...section} />;
}

export function PageRenderer({ page }: { page: Page }) {
  return <>{page.sections.map(renderSection)}</>;
}
```

完整資料流：

```
content/pages/*.json · content/posts/*.md (Dashboard/AI 產出)
      │
      ▼
lib/content.ts  ──►  schema.parse()   ← 信任邊界：未驗證的資料到此為止
   getPage()           │ 失敗 → 拋錯、拒絕載入，不渲染
      ▼ 驗證過、帶型別 (Page)
PageRenderer  ──►  sectionRegistry[type]  ──►  <XxxSection {...props} />
```

> 實際路徑慣例（見 `lib/content.ts`）：頁面在 `content/pages/<name>.json`，
> 部落格在 `content/posts/<slug>.md`，單例設定在 `content/` 根目錄。

---

## 4. 內容載入器（信任邊界）

`lib/content.ts`（標記 `server-only`）是內容平面進入系統的唯一閘門。所有來自 Dashboard/AI 的 JSON / markdown 都必須在這裡通過 `schema.parse()` 才會被渲染——驗證失敗就拋錯拒絕，不會有「未驗證資料」流進元件。元件本身**永遠不讀檔**，只接收已驗證、帶型別的資料。已實作於本 repo（`getProfile / getTheme / getNavigation / getPage / getAllPosts / getPost / getCategories`）。

---

## 5. Theme 也是資料

`theme.json` → theme engine (`lib/theme/`) → 在執行期注入 CSS 變數（`--color-primary` 等）。section 元件只用 Tailwind 的 token class（`bg-primary`、`text-muted-foreground`…），對應這些變數。

結果：**連視覺風格都是內容**。換主題 = 改 `theme.json`，不需動任何 React。Dashboard/AI 改配色也只是在編輯 schema。

---

## 為什麼這樣就達成目標

1. Dashboard/AI 的輸出**只有 JSON / markdown**，且一律經 Zod 驗證。
2. `sectionSchema` 是封閉 union → 內容無法引入新的渲染行為，只能組合既有 section。
3. 新行為（新 section 類型）**必然**要在程式碼平面新增元件並登記 registry → 落在工程師與 code review 的守備範圍。
4. registry 的 mapped type 確保兩平面永遠同步，缺漏在 `typecheck` 就被擋下。

→ Dashboard 與 AI 能完全掌控**內容**，卻在架構上**無法**產生或修改 React。
