# Quickstart: 2048 遊戲

**Branch**: `001-2048-game`  
**Date**: 2026-03-13

## 先決條件

- Node.js ≥ 18（用於執行 Vitest 測試）
- 現代瀏覽器（Chrome、Firefox、Safari 或 Edge 最新版）
- Git

## 本地開發

```bash
# 1. 安裝測試依賴（僅需一次）
npm install

# 2. 在瀏覽器中直接開啟遊戲
open site/index.html
# 或在 Windows:
# start site/index.html
```

> 遊戲為純靜態頁面，無需啟動伺服器，直接以瀏覽器開啟 `site/index.html` 即可遊玩。

## 執行測試

```bash
# 執行所有 unit tests（TDD: 應先寫失敗測試）
npm test

# 監聽模式（開發時推薦）
npm run test:watch
```

## 專案結構

```text
site/
├── index.html      # 遊戲主頁
├── style.css       # 樣式
└── game.js         # 遊戲邏輯

tests/
└── unit/
    ├── board.test.js    # 棋盤移動／合併邏輯
    ├── score.test.js    # 分數計算
    └── endgame.test.js  # 勝利／結束條件

specs/001-2048-game/  # 規格文件（請勿刪除或覆蓋）
```

## 部署至 GitHub Pages

1. 在 GitHub 儲存庫設定中，將 Pages source 設為 `main` 分支的 `/site` 目錄
2. 或將 `site/` 內容推送至 `gh-pages` 分支根目錄
3. 部署後可透過 `https://<username>.github.io/<repo>/` 存取

## TDD 工作流程

```bash
# Step 1: 先寫失敗測試（Red）
# 例：在 tests/unit/board.test.js 新增測試案例

# Step 2: 執行測試，確認失敗
npm test

# Step 3: 最小實作使測試通過（Green）
# 編輯 site/game.js

# Step 4: 重構（Refactor）
# 執行 npm test 確認仍通過
```

## 注意事項

- 規格文件（`specs/001-2048-game/spec.md`、`plan.md`、`tasks.md`）**不得**被刪除或覆蓋（FR-014）
- 遊戲不需要網路連線或後端服務
- 最高分僅在頁面存活期間保留（關閉頁面後不持久化）
