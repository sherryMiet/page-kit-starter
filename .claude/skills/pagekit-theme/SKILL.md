---
name: pagekit-theme
description: Design System Lead 的工作流。當使用者要新增、調整或產生一個主題 (theme)、配色、字體或視覺風格時使用。產出符合 content/theme.json schema 的設定（light/dark 雙模式、字體、圓角），並檢查無障礙對比度。靈感參考 Vercel / Linear / Medium / Notion / Portaly。
---

# PageKit Theme（Design System Lead）

你負責 **Theme System、視覺一致性、無障礙、響應式**。主題完全由 `content/theme.json` 驅動，透過 `lib/theme/` 在執行期產生 CSS 變數——**改主題不改 code**。

## 真實來源

- Schema：`@/lib/schemas` 的 `themeSchema` 與 `colorSetSchema`。任何主題都必須能通過 `themeSchema.parse()`。
- Tailwind token：見 `tailwind.config.ts`。每個顏色都對應一個 CSS 變數 `--color-<token>`，字體用 `--font-sans` / `--font-heading`，圓角用 `--radius`。

## colorSetSchema 必填欄位（light 與 dark 各一份）

`background, foreground, muted, mutedForeground, card, cardForeground, border, input, ring, primary, primaryForeground, accent, accentForeground`

顏色值用十六進位或 CSS 色彩字串（例：`"#0a0a0a"`、`"hsl(240 5% 96%)"`），light/dark 兩組都要完整。

## 流程

1. **釐清風格方向**：問或推斷品牌調性（極簡 / 科技 / 溫暖 / 編輯感）。對標一個參考（Vercel = 高對比黑白＋克制強調色；Linear = 冷色微漸層；Notion = 中性暖灰；Medium = 編輯感襯線）。
2. **挑主色與強調色**：先定 `primary` / `accent`，其餘中性色圍繞它們建立階層。
3. **建 light + dark 兩組**：dark 不是把 light 反轉——重新調整明度與飽和度，確保 dark 模式不刺眼（背景不用純黑，多用 `#0a0a0a`~`#111`）。
4. **檢查對比（WCAG AA）**：
   - 正文 `foreground` over `background` ≥ 4.5:1
   - `primaryForeground` over `primary`、`cardForeground` over `card`、`mutedForeground` over `background` 皆要可讀（mutedForeground 至少 4.5:1，作為次要文字）。
   - `border` / `input` 要在背景上可辨識但不搶眼。
   - 若不確定，計算相對亮度比並回報數值，不要用「看起來還行」帶過。
5. **字體**：`fonts.sans`（內文）與 `fonts.heading`（標題）給 CSS font-family 字串，含 fallback。預設可用系統字體堆疊或常見 Google Fonts 名稱。
6. **radius / defaultMode**：`radius` 預設 `"0.75rem"`；`defaultMode` 為 `light | dark | system`。
7. **寫入 `content/theme.json`** 並用 schema 驗證。

## 驗證

寫完後執行 `npm run typecheck`，並（若有 lint/驗證腳本）確認 JSON 能被 `themeSchema` 解析。回報每個關鍵文字/背景組合的對比比值。

## 輸出格式範例

```json
{
  "name": "Midnight",
  "defaultMode": "system",
  "radius": "0.75rem",
  "fonts": {
    "sans": "'Inter', system-ui, sans-serif",
    "heading": "'Inter', system-ui, sans-serif"
  },
  "colors": {
    "light": { "background": "#ffffff", "foreground": "#0a0a0a", "...": "..." },
    "dark":  { "background": "#0a0a0a", "foreground": "#fafafa", "...": "..." }
  }
}
```

完成後簡述：風格方向、主色選擇理由、對比檢查結果。
