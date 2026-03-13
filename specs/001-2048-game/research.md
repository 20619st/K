# Research: 2048 遊戲實作

**Phase**: 0 — 研究與決策  
**Branch**: `001-2048-game`  
**Date**: 2026-03-13

## 1. 技術堆疊選擇

**Decision**: 原生 HTML5 + CSS3 + JavaScript (ES6+)，無外部框架  
**Rationale**:  
- 規格 FR-015 明確要求靜態前端架構；原生 JS 最輕量、零依賴、可直接開啟或部署至 GitHub Pages  
- 2048 遊戲邏輯為純數據操作（4×4 二維陣列），不需要複雜的狀態管理或虛擬 DOM  
- 減少框架學習曲線與打包工具複雜度，符合憲章「最小可行」原則  

**Alternatives considered**:  
- React/Vue：引入打包工具（Vite）與元件化，對此規模過度設計  
- TypeScript：型別安全有益，但增加建置步驟；可在未來版本引入

---

## 2. 測試框架選擇

**Decision**: Vitest（用於遊戲邏輯的 unit test）  
**Rationale**:  
- 支援 ES module，與原生 JS 相容性佳；與 Vite 生態整合良好  
- 提供 `describe`/`it`/`expect` API，語法清晰，符合 TDD 工作流  
- 只測試純函式（`slideRow`、`mergeRow`、`calcScore`、`isGameOver` 等），無需 DOM mock  

**Alternatives considered**:  
- Jest：需要額外設定 ES module 轉換（`transform`），配置複雜度較高  
- Mocha + Chai：可用，但 Vitest 生態更現代

---

## 3. 棋盤資料結構

**Decision**: 4×4 二維陣列（`number[][]`），空格以 `0` 表示  
**Rationale**:  
- 直觀映射 4×4 棋盤，索引存取 O(1)  
- 規格 Key Entities 中已明確定義：「4×4 的格子結構，儲存每格的方塊數值（0 代表空格）」  
- 合併邏輯（slide 操作）可以 row/column 一維陣列處理，簡化實作  

**Alternatives considered**:  
- `Map<string, number>`（以 `"r,c"` 為 key）：稀疏性較好，但對 4×4 過度設計  
- 一維陣列（長度 16）：需要手動計算索引，可讀性差

---

## 4. 移動邏輯設計

**Decision**: 統一「向左滑動」函式 + 旋轉棋盤的組合  
**Rationale**:  
- 「向左滑動一行」的邏輯最直觀：過濾空格 → 合併相鄰相同值 → 補零  
- 上/下/右方向可透過旋轉棋盤矩陣、執行向左滑動、再旋轉回來實現  
- 四個方向共用同一核心邏輯，減少重複、降低 bug 率  
- FR-007（同一方塊不合併超過一次）在「合併相鄰相同值」步驟中以已合併標記確保  

**Alternatives considered**:  
- 每方向獨立實作：重複程式碼多，維護成本高

---

## 5. 觸控手勢

**Decision**: 原生 Touch Events API（`touchstart` / `touchend`），計算 ΔX/ΔY 判斷方向  
**Rationale**:  
- 無需外部手勢庫（如 Hammer.js），符合「零依賴」方針  
- 只需判斷四方向，邏輯簡單：取 `Math.abs(dx) > Math.abs(dy)` 判橫／縱，再取正負號  

**Alternatives considered**:  
- Pointer Events API：跨平台一致性更好，但觸控裝置支援 Touch Events 已足夠  
- Hammer.js：引入外部依賴，過度設計

---

## 6. 部署策略

**Decision**: GitHub Pages（靜態部署，`site/` 目錄為根）  
**Rationale**:  
- 憲章 V（網站專案預設靜態前端優先）與 FR-015 的直接要求  
- 靜態頁面（`index.html` + `style.css` + `game.js`）可零配置部署至 GitHub Pages  
- 本地開發直接以瀏覽器開啟 `site/index.html` 即可，無需伺服器  

**Alternatives considered**:  
- Netlify / Vercel：可用但不必要，GitHub Pages 對此規模已足夠

---

## 7. 勝利提示只顯示一次

**Decision**: 以 `boolean` 旗標 `hasWon` 在 game state 中追蹤  
**Rationale**:  
- 規格 Edge Cases 要求「勝利提示只出現一次」  
- 實作最簡單：勝利提示顯示後設 `hasWon = true`，後續合併出 2048 不再觸發  

---

## 解決的 NEEDS CLARIFICATION

| 項目 | 決策 |
|------|------|
| 測試框架 | Vitest |
| 棋盤資料結構 | `number[][]`（0 = 空格） |
| 移動演算法 | 旋轉 + 向左滑動 |
| 觸控支援 | 原生 Touch Events |
| 部署平台 | GitHub Pages（`site/` 根目錄） |
| 最高分持久化 | 不持久化（頁面存活期間 JS 變數） |
