# Implementation Plan: 2048 遊戲

**Branch**: `001-2048-game` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-2048-game/spec.md`

**Language**: 請使用繁體中文撰寫本文件（專有名詞可保留英文）

## Summary

以靜態前端網頁實作瀏覽器端 2048 滑動方塊拼圖遊戲。採用原生 HTML5 + CSS3 + 
JavaScript（ES6+），不依賴外部框架，可直接部署至 GitHub Pages。核心功能包含
4×4 棋盤、鍵盤與觸控操作、合併邏輯、分數計算、勝利／結束判斷，以及重新開始。

## Technical Context

**Language/Version**: HTML5 + CSS3 + JavaScript (ES6+)  
**Primary Dependencies**: 無外部框架（Vanilla JS）；測試使用 Vitest  
**Storage**: 無持久化（最高分僅在頁面存活期間以 JS 變數保存）  
**Testing**: Vitest（unit tests for game logic）  
**Target Platform**: 現代瀏覽器（Chrome、Firefox、Safari、Edge 最新版）；GitHub Pages 靜態部署  
**Project Type**: 靜態前端網頁應用（Single HTML page）  
**Performance Goals**: 每次移動操作視覺回應 ≤100ms（SC-002）  
**Constraints**: 純靜態，無伺服器需求；spec 檔案不得被覆蓋（FR-014）  
**Scale/Scope**: 單頁應用，約 300–500 行 JS 核心邏輯

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] 已確認採最小可行方案（MVP）：原生 JS 單頁，無框架依賴，最小可行實作
- [x] 已執行 Git 可運作檢查：`git status` 可正常執行，工作樹狀態正常
- [x] 已定義 TDD 流程：先以 Vitest 寫失敗測試，再最小實作使其通過，最後重構
- [x] 若為網站專案，已優先評估前端靜態網站與 GitHub Pages 部署：FR-015 明確要求靜態前端，本計畫採用 GitHub Pages 作為預設部署目標
- [x] implement 階段已規劃：`tasks.md` checkbox 需與實作同步
- [x] implement 階段已規劃：不得刪除或覆蓋 `spec.md`/`plan.md`/`tasks.md`（FR-014 明確要求）

## Project Structure

### Documentation (this feature)

```text
specs/001-2048-game/
├── spec.md              # 功能規格（輸入）
├── plan.md              # 本文件（/speckit.plan 產出）
├── research.md          # Phase 0 產出
├── data-model.md        # Phase 1 產出
├── quickstart.md        # Phase 1 產出
├── contracts/           # Phase 1 產出
│   └── ui-contract.md
└── tasks.md             # Phase 2 產出（/speckit.tasks 指令，非本指令建立）
```

### Source Code (repository root)

```text
site/
├── index.html           # 遊戲主頁（含 DOM 結構）
├── style.css            # 樣式（棋盤格、方塊色彩、RWD）
└── game.js              # 遊戲邏輯（Board、Move、Score）

tests/
└── unit/
    ├── board.test.js    # 棋盤初始化、移動、合併邏輯
    ├── score.test.js    # 分數計算
    └── endgame.test.js  # 勝利／結束判斷
```

**Structure Decision**: 採 Option 2 變體——靜態前端（GitHub Pages），所有遊戲邏輯
集中於 `site/game.js`，`site/index.html` 與 `site/style.css` 負責呈現。測試以
Vitest 執行，僅測試純函式邏輯（無 DOM 依賴）。

## Complexity Tracking

> 無 Constitution Check 違規，此節留空。
