# PageKit 架構：Block Tree 驅動、程式碼與內容分離

## 核心目標

> **Dashboard 與 AI 只能操作內容（block tree JSON）。兩者都不能產生 React code。**

整個系統因此切成兩個互不重疊的平面：

| 平面 | 內容物 | 誰能改 | 形式 |
|---|---|---|---|
| **內容平面 (Content Plane)** | `content/profile.json`、`content/theme.json`、`content/navigation.json`、`content/pages/*.json`、`content/posts/*.md` | Dashboard、AI | 純資料，必須通過 `lib/blocks/validate.ts` 驗證 |
| **程式碼平面 (Code Plane)** | block 元件、registry、renderer、theme engine 、vendored `lib/blocks/` | 只有工程師（含用 Claude Code 開發時） | TypeScript / React |

**`components/blocks/registry.tsx` 是唯一的橋**：它把 block 的 `type` 字串對應到預先寫好的 React 元件。內容平面只能「引用」既有的 block 類型，永遠無法「定義」新的渲染行為——而且引用了不存在的類型也不會炸頁面，只會優雅降級（見下）。

---

## 1. Vendored `lib/blocks/`（權威定義，來自 page-kit 主 repo）

`lib/blocks/schema.ts`、`lib/blocks/validate.ts`、`lib/blocks/html.ts` 三個檔案是從 page-kit（`src/lib/blocks/`）**逐字複製**過來的，檔頭都有 `VENDORED FROM ...` 標記。**這個 repo 不改這三個檔**；schema 要變動時，先改 page-kit 那邊，測試過再同步複製過來。除了 zod，這三個檔刻意保持零依賴，方便原封不動地搬移。

- `schema.ts` — `BlockNode`（`{id, type, props, children}` 遞迴樹）、`PageDocument`（`{version, slug, title, meta?, blocks}`）、`blockPropsRegistry`（每種已知 type 的 props zod schema）、`containerChildRules`（容器允許哪些已知子節點）、`CONTENT_BLOCK_TYPES`、`MAX_BLOCK_DEPTH`。
- `validate.ts` — `validatePageDocument(input)`：結構層（id/type/props/children/version/slug）嚴格檢查，錯了就整份拒絕；block type 層寬鬆——未知 type 只是 warning，讓新編輯器產出的文件在舊程式碼上仍可驗證（降級渲染）。
- `html.ts` — `sanitizeRestrictedHtml()` / `findDisallowedHtmlTags()`：`text` block 的 `html` 只允許 `p/br/strong/em/b/i/a/ul/ol/li`，其餘標籤剝除但保留文字內容；`<a>` 只留安全的 `href`。

---

## 2. 內容模型：Block Tree

一個頁面 = `PageDocument`：

```ts
{
  version: 1,
  slug: "landing",       // ^[a-z0-9][a-z0-9-]*$
  title: "...",
  meta?: { description?: string },
  blocks: BlockNode[]
}
```

`BlockNode` 是遞迴樹：`{ id, type, props, children }`。`type` 刻意是開放字串（不是封閉 union）——未知類型不會讓整份文件解析失敗，只會在驗證與渲染兩層分別警告、跳過。

11 種已知 block type（`blockPropsRegistry` 的 key）：

- 版面容器（`containerChildRules` 定義巢狀規則）：`section`（只能放 `row`）→ `row`（只能放 `column`）→ `column`（放內容 block 或再一層 `row`）。
- 內容 block（葉節點，不能有 children）：`heading`、`text`、`image`、`button`、`divider`、`spacer`、`raw-html`、`post-list`。

`post-list` 是唯一的 async server component（呼叫 `getAllPosts()`），其餘都是同步元件。

---

## 3. Block Registry（橋接層）

`components/blocks/registry.tsx`：

```tsx
export type BlockComponentProps = { node: BlockNode; children?: ReactNode };

export const blockRegistry: Record<string, ComponentType<BlockComponentProps>> = {
  section: Section, row: Row, column: Column,
  heading: Heading, text: Text, image: Image, button: Button,
  divider: Divider, spacer: Spacer, "raw-html": RawHtml, "post-list": PostList,
};
```

因為 `type` 是開放字串，這裡不是（也不能是）像舊 `SectionType` 那樣的窮舉映射——`Record<string, ...>` 才能表達「型別上允許未知 key，執行期查不到就降級」。新增一種 block **類型**（改 vendored schema + 寫元件 + 登記 registry）是工程動作；新增一個 block **實例**（JSON 裡多放一個 `{type:"heading",...}`）是純內容動作，Dashboard/AI 隨意做。

---

## 4. Renderer 架構與優雅降級合約

`components/blocks/BlockRenderer.tsx` 遞迴走訪 `blocks: BlockNode[]`，對每個節點：

1. **未知 type**（`blockRegistry` 查無元件）→ `console.warn` 一次（含 `id`、`page` slug），整個子樹回傳 `null` 跳過，頁面其餘部分照常渲染。
2. **props 驗證失敗**（防禦性：正常情況下 `getPage()` 已經在 build 時擋掉）→ warn 一次並跳過該節點。
3. **已知容器下出現不被允許的已知子節點**（例如 `section` 下直接放 `heading`，而 `containerChildRules.section = ["row"]`）→ 自動包上該容器的預設子鏈（`section→row→column`）再渲染，並 warn 一次。包裝節點的 id 用 `__auto-<type>-<原id>` 命名以避免撞號。

```
content/pages/*.json (Dashboard/AI 產出)
      │
      ▼
lib/content.ts getPage()  ──►  validatePageDocument()   ← 信任邊界
      │ errors 非空 → throw，拒絕載入；warnings → console.warn 逐條印
      ▼ 驗證過的 PageDocument
BlockRenderer  ──►  blockRegistry[type]  ──►  <XxxBlock node={...}>{children}</XxxBlock>
                     │ 查無 → warn + 跳過子樹
                     │ 已知子節點放錯位置 → warn + 自動包容器
```

每個 warning 都會同時出現在兩層：`lib/content.ts`（load 時，來自 `validatePageDocument` 的 warnings 陣列）與 `BlockRenderer`（render 時，同一批問題會被獨立偵測一次，因為 renderer 不能假設呼叫端一定跑過驗證）。

---

## 5. 內容載入器（信任邊界）

`lib/content.ts`（標記 `server-only`）：

- `getPage(slug)` — 讀 `content/pages/<slug>.json` → `validatePageDocument()`。有 `errors` 就 throw，訊息逐條列出 `path: message`；有 `warnings` 就 `console.warn`（不擋渲染）。回傳型別是 vendored 的 `PageDocument`。
- `getPageSlugs()` — 掃 `content/pages/*.json` 檔名，防禦性排除 `"blog"`（`app/blog` 是實體路由，不能被同名內容頁蓋掉）。

## 6. 路由

- `app/page.tsx` — `getPage("landing")` → `<BlockRenderer blocks={page.blocks} pageSlug="landing" />`。
- `app/[slug]/page.tsx` — `generateStaticParams` 用 `getPageSlugs()`（排除 `landing`，它是首頁）；找不到對應檔案（不在 `getPageSlugs()` 清單）就 `notFound()`。

---

## 7. Theme 也是資料

`theme.json` → theme engine (`lib/theme/`) → 在執行期注入 CSS 變數（`--color-primary` 等）。block 元件只用 Tailwind 的 token class（`bg-primary`、`text-muted-foreground`…）或直接讀 `var(--color-*)`（例如 `section.background.color`），對應這些變數。換主題 = 改 `theme.json`，不需動任何 React。

---

## 為什麼這樣就達成目標

1. Dashboard/AI 的輸出**只有 JSON / markdown**，且一律經 `validatePageDocument()` 驗證。
2. `type` 開放字串 + 兩層降級（未知類型跳過、已知類型錯放自動包容器）→ 內容平面即使產出「程式碼平面尚未支援」的 block，也不會讓整頁掛掉，只會局部降級。
3. 新行為（新 block 類型）**必然**要在程式碼平面新增元件並登記 `blockRegistry` → 落在工程師與 code review 的守備範圍；schema 本身改動則落在 page-kit 主 repo，vendored 副本手動同步。
4. `lib/blocks/` 三個檔案零依賴、逐字同步，保證 page-kit（編輯器/驗證）與 page-kit-starter（渲染）看到的是同一份權威定義，不會分裂成兩套規則。

→ Dashboard 與 AI 能完全掌控**內容**（包含任意深度的巢狀佈局），卻在架構上**無法**產生或修改 React，也無法讓渲染直接崩潰。
