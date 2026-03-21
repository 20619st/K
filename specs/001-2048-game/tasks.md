---
description: "Task list for 2048 遊戲 feature implementation"
---

# Tasks: 2048 遊戲

**Input**: Design documents from `/specs/001-2048-game/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ui-contract.md ✓, quickstart.md ✓
**Language**: 請使用繁體中文撰寫本文件（專有名詞可保留英文）

**Tests**: 測試為必要項目。所有實作 MUST 遵循 TDD（先寫測試並確認失敗，再進行實作）。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

```text
site/
├── index.html    # 遊戲主頁（DOM 結構）
├── style.css     # 樣式（棋盤、方塊色彩、RWD）
└── game.js       # 遊戲邏輯（純函式 + DOM 操作）

tests/
└── unit/
    ├── board.test.js    # 棋盤邏輯：slideRow, rotateBoard, move, spawnTile
    ├── score.test.js    # 分數計算與最高分追蹤
    └── endgame.test.js  # 勝利／結束判斷
```

---

## Phase 1: Setup（共用基礎）

**Purpose**: 專案初始化與基本結構建立

- [ ] T001 執行 Git 可運作檢查（`git status` 並確認工作樹狀態正常）
- [ ] T002 建立專案目錄結構：`site/`、`tests/unit/` 於 repository root
- [ ] T003 初始化 npm 專案並安裝 Vitest（`npm init -y && npm install --save-dev vitest`），更新 `package.json` 加入 `"test": "vitest run"` script
- [ ] T004 [P] 在 `package.json` 加入 `"type": "module"` 並確認 Vitest 設定可正常執行（`npm test` 應回報 no test files found）
- [ ] T005 [P] 建立 `.gitignore` 排除 `node_modules/` 與測試覆蓋率報告

**Checkpoint**: `npm test` 可執行（無錯誤），專案目錄結構就緒

---

## Phase 2: Foundational（基礎先決條件）

**Purpose**: 所有 User Story 實作前必須完成的核心 HTML/CSS 骨架

**⚠️ CRITICAL**: 所有 User Story 工作必須等此階段完成才可開始

- [ ] T006 執行 Git 可運作檢查（進入基礎階段前）
- [ ] T007 建立 `site/index.html`：基本 HTML5 骨架、`<link>` 引入 `style.css`、以 `<script type="module" src="game.js">` 引入邏輯，依 `contracts/ui-contract.md` DOM 契約加入 `#game-board`（含 16 個 `.cell`，各帶 `data-row`/`data-col`）
- [ ] T007A [P] 在 `site/index.html` 加入分數區塊：`#score-display`、`#best-score-display`
- [ ] T007B [P] 在 `site/index.html` 加入控制元件：`#restart-btn`、`#message-overlay`（預設隱藏含 `.hidden` class）、`#message-text`、`#continue-btn`
- [ ] T008 [P] 建立 `site/style.css`：棋盤格佈局（CSS Grid 4×4）、`.message-overlay.hidden` 隱藏樣式、基礎 RWD（行動裝置）；方塊色彩可暫以佔位符填入（Phase N 完善）
- [ ] T009 [P] 建立 `site/game.js` 模組骨架：export `slideRow`、`rotateBoard`、`isGameOver` 三個純函式（函式體暫為 `throw new Error('not implemented')`）以供測試匯入
- [ ] T010 驗證規格檔保護（FR-014）：確認 `spec.md`、`plan.md`、`tasks.md` 於工作樹中未被刪除或覆蓋（`git status` 確認）

**Checkpoint**: DOM 骨架就緒，純函式 export 已宣告，規格檔完整保留

---

## Phase 3: User Story 1 - 核心遊戲玩法（Priority: P1）🎯 MVP

**Goal**: 玩家可在 4×4 棋盤上進行完整的 2048 遊戲：滑動合併、新方塊生成、勝利與結束判斷、鍵盤與觸控輸入。

**Independent Test**: 開啟 `site/index.html`，進行一系列方向鍵操作，驗證方塊正確移動合併、每次有效移動後出現新方塊、棋盤滿時顯示「遊戲結束」、合併出 2048 時顯示「恭喜！你達到 2048！」。

### Tests for User Story 1（MANDATORY）⚠️

> **NOTE: 先寫測試並確認失敗（Red），才可進入實作（Green）**

- [ ] T011 [P] [US1] 在 `tests/unit/board.test.js` 撰寫 `slideRow` 單元測試：空列回傳原列、全部滑到左側、相鄰相同值合併為兩倍、合併後左側填滿、同一方塊僅合併一次（FR-007）、`delta` 等於合併後數值之和；執行 `npm test` 確認測試**失敗**（Red）
- [ ] T012 [P] [US1] 在 `tests/unit/board.test.js` 撰寫 `rotateBoard` 單元測試：順時針旋轉 1 次結果正確、旋轉 4 次回到原始棋盤；執行 `npm test` 確認測試**失敗**（Red）
- [ ] T013 [P] [US1] 在 `tests/unit/endgame.test.js` 撰寫 `isGameOver` 單元測試：空格存在時回傳 `false`、相鄰相同值存在時回傳 `false`、棋盤填滿且無相鄰相同值時回傳 `true`；執行 `npm test` 確認測試**失敗**（Red）

### Implementation for User Story 1

- [ ] T014 [US1] 在 `site/game.js` 實作 `slideRow(row)`：過濾零值、由左至右合併相鄰相同值（每值僅合併一次）、補零至長度 4、回傳 `{ result, delta }`；執行 `npm test` 確認 T011 測試**通過**（Green）
- [ ] T015 [US1] 在 `site/game.js` 實作 `rotateBoard(board, times)`：純函式，順時針旋轉棋盤 `times` 次；執行 `npm test` 確認 T012 測試**通過**（Green）
- [ ] T016 [US1] 在 `site/game.js` 實作 `isGameOver(board)`：棋盤滿且四方向均無相鄰相同值時回傳 `true`；執行 `npm test` 確認 T013 測試**通過**（Green）
- [ ] T017 [US1] 在 `site/game.js` 實作 `spawnTile(board)`：從空格（值為 0）隨機選一格，填入 2（90%）或 4（10%），回傳更新後的棋盤（不變動原棋盤）
- [ ] T018 [US1] 在 `site/game.js` 實作 `move(direction)`：使用 `rotateBoard` 將目標方向映射為向左、對每列執行 `slideRow`、旋轉回原方向、比較新舊棋盤是否有變化，有變化則呼叫 `spawnTile` 並觸發 DOM 更新；`slideRow` 回傳的 `delta` 暫收集至區域變數（US2 將於 T027 接入 score 狀態與顯示）
- [ ] T019 [US1] 在 `site/game.js` 實作 `initGame()`：重設 `board`（4×4 全零）、`score`、`status`（`'playing'`）、`hasWon`（`false`）、呼叫 `spawnTile` 兩次生成初始方塊、呼叫 DOM render 函式
- [ ] T020 [US1] 在 `site/game.js` 實作 DOM render 函式 `renderBoard()`：依 `board` 狀態更新 16 個 `.cell` 內的 `.tile` 元素與 `data-value` 屬性（DOM 更新依 `#game-board` 內的 `.cell` 清單）
- [ ] T021 [US1] 在 `site/game.js` 加入勝利偵測：移動後若有值 ≥ 2048 且 `hasWon === false`，設 `hasWon = true` 並顯示 `#message-overlay`（`#message-text` 設為「恭喜！你達到 2048！」，`#continue-btn` 可見）
- [ ] T021A [US1] 在 `site/game.js` 加入結束偵測：若 `isGameOver()` 為 `true`，設 `status = 'over'` 並顯示 `#message-overlay`（`#message-text` 設為「遊戲結束」）
- [ ] T021B [US1] 在 `site/game.js` 加入 `#continue-btn` 點擊事件：隱藏 `#message-overlay`（加回 `.hidden` class）、`status` 回 `'playing'`（勝利提示不再出現，因 `hasWon` 已為 `true`）
- [ ] T022 [US1] 在 `site/game.js` 加入鍵盤輸入：`keydown` 監聽 `ArrowUp/Down/Left/Right`，僅在 `status === 'playing'` 時呼叫 `move(direction)`（依 `contracts/ui-contract.md` 行為契約）
- [ ] T023 [US1] 在 `site/game.js` 加入觸控 swipe 輸入：`touchstart` 記錄起點、`touchend` 計算 ΔX/ΔY，閾值 30px，`abs(dx) > abs(dy)` 判斷水平方向，僅在 `status === 'playing'` 時呼叫 `move(direction)`（依 `contracts/ui-contract.md`）
- [ ] T024 [US1] 以 `DOMContentLoaded` 事件呼叫 `initGame()` 啟動遊戲，於 `site/game.js` 底部完成初始化接線

**Checkpoint**: 開啟 `site/index.html`，可進行完整核心遊戲（移動、合併、新方塊、勝利、結束）；`npm test` 全部通過

- [ ] T024A [US1] 更新 `tasks.md` 勾選狀態，確保與實際完成一致；執行 `git status` 確認可運作

---

## Phase 4: User Story 2 - 分數記錄與最高分（Priority: P2）

**Goal**: 玩家在遊戲中即時看到當前分數；每次合併自動累計分數；頁面存活期間最高分持續保留。

**Independent Test**: 在已知棋盤狀態下執行合併操作，確認 `#score-display` 正確累加；重新開始後分數歸零、最高分保留。

### Tests for User Story 2（MANDATORY）⚠️

> **NOTE: 先寫測試並確認失敗（Red），才可進入實作（Green）**

- [ ] T025 [P] [US2] 在 `tests/unit/score.test.js` 撰寫分數計算測試：初始分數為 0、合併兩個 64 後 `delta` 為 128、同一次移動多次合併分數正確累加；執行 `npm test` 確認測試**失敗**（Red）
- [ ] T026 [P] [US2] 在 `tests/unit/score.test.js` 撰寫最高分追蹤測試：新遊戲開始時最高分保留、當前分數超過最高分時最高分更新；執行 `npm test` 確認測試**失敗**（Red）

### Implementation for User Story 2

- [ ] T027 [US2] 在 `site/game.js` 確認 `move()` 中累計 `slideRow` 回傳的 `delta` 到 `score` 變數；`score` 超過 `bestScore` 時更新 `bestScore`；執行 `npm test` 確認 T025、T026 測試**通過**（Green）
- [ ] T028 [US2] 在 `site/game.js` 更新 DOM：每次移動後以 `score` 與 `bestScore` 更新 `#score-display` 與 `#best-score-display` 的 `textContent`；`initGame()` 重置 `score = 0`（`bestScore` 不重置）

**Checkpoint**: 分數即時顯示於畫面，最高分在重新開始後保留；`npm test` 全部通過

- [ ] T028A [US2] 更新 `tasks.md` 勾選狀態；執行 `git status` 確認可運作

---

## Phase 5: User Story 3 - 重新開始遊戲（Priority: P3）

**Goal**: 玩家隨時可點擊「重新開始」按鈕清空棋盤、歸零分數、生成 2 個初始方塊並繼續遊玩。

**Independent Test**: 在遊戲進行中、遊戲結束畫面、勝利畫面各點擊「重新開始」，確認棋盤清空、分數歸零、初始方塊出現、覆蓋層隱藏。

### Tests for User Story 3（MANDATORY）⚠️

> **NOTE: 先寫測試並確認失敗（Red），才可進入實作（Green）**

- [ ] T029 [P] [US3] 在 `tests/unit/board.test.js` 新增 `initGame` 後狀態測試（需將 `initGame` 及相關狀態 export 供測試使用）：`score === 0`、`hasWon === false`、`status === 'playing'`、棋盤上恰好有 2 個非零方塊；執行 `npm test` 確認測試**失敗**（Red）

### Implementation for User Story 3

- [ ] T030 [US3] 在 `site/game.js` 加入 `#restart-btn` 的 `click` 事件監聽：呼叫 `initGame()`，同時隱藏 `#message-overlay`（若可見）；確認 `initGame()` 已正確重置 `score`、`hasWon`、`status`（`bestScore` 不重置）；執行 `npm test` 確認 T029 測試**通過**（Green）

**Checkpoint**: 所有三個 User Story 均可獨立運作；`npm test` 全部通過

- [ ] T030A [US3] 更新 `tasks.md` 勾選狀態；執行 `git status` 確認可運作

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 跨故事完善，提升視覺品質與部署就緒度

- [ ] T031 [P] 在 `site/style.css` 完善方塊色彩：依 `.tile-2`、`.tile-4`、`.tile-8`、`.tile-16`、`.tile-32`、`.tile-64`、`.tile-128`、`.tile-256`、`.tile-512`、`.tile-1024`、`.tile-2048`、`.tile-super` 設定對應背景色與文字色（參考原版 2048 配色）；`renderBoard()` 同步更新 `.tile` 的 CSS class
- [ ] T032 [P] 依 `quickstart.md` 執行端對端驗收：在瀏覽器開啟 `site/index.html`，按照 quickstart.md 描述的步驟完整驗證三個 User Story，確認全部 Acceptance Scenarios 正確通過
- [ ] T033 執行最終 Git 可運作檢查（`git status` + `git diff --stat`），確認所有變更已追蹤，規格檔（`spec.md`、`plan.md`、`tasks.md`）完整保留
- [ ] T034 [P] 確認 GitHub Pages 部署設定：`site/index.html` 位於正確路徑，`package.json` 可供 CI 執行 `npm test`，並在 README.md 中補充本地開發與部署說明

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup（Phase 1）**: 無依賴，可立即開始
- **Foundational（Phase 2）**: 依賴 Phase 1 完成，**阻擋所有 User Story**
- **User Story 1（Phase 3）**: 依賴 Phase 2；為 P2、P3 的先決條件（`move()`、`initGame()` 邏輯）
- **User Story 2（Phase 4）**: 依賴 Phase 2；可與 US1 並行，但分數 delta 邏輯位於 `move()` 中，建議 US1 先完成後再接入 US2 顯示
- **User Story 3（Phase 5）**: 依賴 Phase 2；`#restart-btn` 呼叫 `initGame()`，建議 US1 完成後再確認整合
- **Polish（Final Phase）**: 依賴所有 User Story 完成

### User Story Dependencies

- **US1（P1）**: Phase 2 完成後可立即開始，無對其他 Story 的依賴，**獨立可測試 MVP**
- **US2（P2）**: Phase 2 完成後可立即開始；`delta` 計算嵌入 US1 的 `slideRow()`，建議與 US1 協調或於 US1 完成後接入 DOM 顯示
- **US3（P3）**: Phase 2 完成後可立即開始；`#restart-btn` 呼叫 `initGame()`（US1 定義），建議 US1 完成後再完整驗證

### Within Each User Story

- 測試 MUST 先撰寫並確認**失敗（Red）**，才可進入實作
- 純函式（`slideRow`、`rotateBoard`、`isGameOver`）先於 DOM 操作實作
- 核心邏輯完成後再接入事件監聽與 DOM 更新
- 每個 Story 完成後即可獨立測試與展示

---

## Parallel Execution Examples

### Parallel Example: User Story 1（Tests）

```bash
# T011、T012、T013 可同時撰寫（不同測試檔案）
Task: "slideRow 單元測試 in tests/unit/board.test.js"        # T011
Task: "rotateBoard 單元測試 in tests/unit/board.test.js"     # T012
Task: "isGameOver 單元測試 in tests/unit/endgame.test.js"    # T013
```

### Parallel Example: User Story 1（Implementation）

```bash
# T014、T015、T016 可同時實作（不同純函式，同在 game.js 但不互相依賴）
Task: "實作 slideRow() in site/game.js"      # T014
Task: "實作 rotateBoard() in site/game.js"   # T015
Task: "實作 isGameOver() in site/game.js"    # T016
```

### Parallel Example: User Story 2（Tests）

```bash
# T025、T026 可同時撰寫（同在 score.test.js，不同測試區塊）
Task: "分數計算測試 in tests/unit/score.test.js"    # T025
Task: "最高分追蹤測試 in tests/unit/score.test.js"  # T026
```

---

## Implementation Strategy

### MVP First（User Story 1 Only）

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（CRITICAL，阻擋所有 Story）
3. 完成 Phase 3: User Story 1（TDD：先 Red，再 Green）
4. **STOP and VALIDATE**: 開啟 `site/index.html`，獨立驗證 US1
5. 部署至 GitHub Pages 作為 MVP 展示

### Incremental Delivery

1. Setup + Foundational → 基礎就緒
2. US1 完成 → 完整可玩的 2048 核心 → **MVP 部署**
3. US2 完成 → 加入分數顯示 → 再次部署
4. US3 完成 → 加入重新開始 → 完整功能部署
5. Polish → 視覺色彩完善 → 最終部署

### Parallel Team Strategy

1. 團隊完成 Setup + Foundational
2. Foundational 完成後：
   - Developer A：User Story 1（核心邏輯）
   - Developer B：User Story 2（分數顯示，測試先行）
   - Developer C：User Story 3（重新開始，測試先行）
3. 各 Story 獨立完成後合併，確認整合正確

---

## Notes

- **[P]** 標記任務 = 不同檔案或獨立邏輯，可並行執行
- **[Story]** 標籤映射到對應的 User Story，便於追蹤
- TDD 流程**不可妥協**（憲章 III）：每個測試任務必須先執行 `npm test` 確認**失敗**，才可進入對應實作任務
- 每個階段開始與結束均需執行 `git status`（至少），確認 Git 可運作（憲章 II）
- implement 期間**不得刪除或覆蓋**規格文件（`spec.md`、`plan.md`、`tasks.md`）（FR-014、憲章 IV）
- `tasks.md` 的 checkbox 必須反映實際進度，**即時更新**，不可延後補記（憲章 IV）
- 每完成一個邏輯群組即 `git commit`
- 在任意 Checkpoint 停下獨立驗證該 Story，確認功能正確後再繼續
- 避免：模糊任務描述、同一檔案衝突、跨 Story 依賴破壞獨立性
