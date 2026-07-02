---
name: pagekit-content
description: Content Architecture Lead 的工作流。當使用者要產生或編輯網站內容時使用——profile.json、theme.json、navigation.json、頁面的 sections JSON（landing/portfolio）、以及 posts/*.md 部落格文章。確保所有內容都通過 @/lib/schemas 驗證、彼此一致，且完全可透過 Dashboard 編輯而不需改 code。
---

# PageKit Content（Content Architecture Lead）

你擁有所有 **JSON schema 與內容**。核心約束：**任何內容都不應該需要改 code**——所有東西都靠 `content/` 下的 JSON 與 `posts/` 下的 markdown 驅動，並由 `@/lib/schemas` 驗證。

## 內容檔案與對應 schema

| 檔案 | Schema |
|---|---|
| `content/profile.json` | `profileSchema` |
| `content/theme.json` | `themeSchema`（配色細節交給 `pagekit-theme`）|
| `content/navigation.json` | `navigationSchema` |
| 頁面內容（landing/portfolio）`content/*.json` | `pageSchema`（`sections[]` 為 `sectionSchema` union）|
| `posts/*.md` | frontmatter 用 `postFrontmatterSchema`，內文為 markdown |

## 流程

1. **先讀 schema**：打開 `lib/schemas.ts` 確認當前欄位（必填 / 選填 / 預設 / enum）。schema 是唯一真實來源，不要假設欄位。
2. **產生內容**並嚴格符合 schema：
   - 必填欄位一定要有；選填欄位有助於完整度就補。
   - enum 值只能用允許的字串（如 cta `variant` 限 `primary|secondary|ghost`；section `type` 限 union 內的字面量）。
   - URL / email 欄位給合法格式（schema 有 `.url()` / `.email()` 驗證）。
3. **內容要可信、具體**：寫真實感的文案，不要 lorem ipsum；數字、名稱、連結要前後一致。
4. **跨檔一致性**：`navigation` 的連結要對應實際存在的頁面/區段；`profile` 的 author 與部落格文章的 `author` 一致；socials 用真實平台名。
5. **部落格文章**：`posts/<slug>.md`，YAML frontmatter 含 `title, date (ISO), category, tags[], featured` 等，內文用 GFM markdown（支援表格、清單）。`slug / readingTime / content` 由載入器產生，不要寫進 frontmatter。
6. **Dashboard 可編輯性把關**：若某個內容需求無法用現有 schema 表達，**不要硬塞或要求改元件**——回報缺口並建議用 `pagekit-section` 擴充 schema，維持「內容不碰 code」的原則。

## 驗證

產生 JSON / markdown 後，確認能被對應 schema `parse()`（可寫個臨時 node 腳本或跑專案的內容載入）。執行 `npm run typecheck` 確認 `resolveJsonModule` 匯入無誤。回報每個檔案是否通過驗證。

## 輸出

完成後列出：建立/修改了哪些檔案、各自對應的 schema、驗證結果，以及任何因 schema 限制而無法滿足的內容需求。
