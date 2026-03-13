# Tasks: 2048 遊戲

**Input**: Design documents from `/specs/001-2048-game/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ui-contract.md ✅, quickstart.md ✅
**Language**: 本文件使用繁體中文（專有名詞保留英文）

**Tests**: 測試為必要項目。所有實作 MUST 遵循 TDD（先寫測試並確認失敗，再進行實作）。

**Organization**: 任務依 User Story 分群，每個故事可獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案、無未完成依賴）
- **[Story]**: 所屬 User Story（US1, US2, US3）
- 描述含精確檔案路徑

## Path Conventions

- 前端原始碼：`site/`（index.html、style.css、game.js）
- 測試：`tests/unit/`
- 規格文件：`specs/001-2048-game/`（請勿刪除或覆蓋）

---

## Phase 1: Setup（共用基礎建設）

**目的**: 專案初始化與基礎結構

- [ ] T001 執行 Git 可運作檢查（`git status`，必要時 `git diff`）
- [ ] T002 依 plan.md 建立專案結構：建立 `site/` 與 `tests/unit/` 目錄
- [ ] T003 初始化 npm 專案並安裝 Vitest：在 repo 根目錄執行 `npm init -y`，新增 `package.json` 並設定 `vitest` 依賴與 `"test": "vitest run"` 指令
- [ ] T004 [P] 建立空白進入點檔案：`site/index.html`、`site/style.css`、`site/game.js`（佔位用，Phase 3 填充）
- [ ] T005 [P] 建立測試骨架檔案：`tests/unit/board.test.js`、`tests/unit/score.test.js`、`tests/unit/endgame.test.js`（匯入 game.js 並留空）

---

## Phase 2: Foundational（阻塞前提）

**目的**: 所有 User Story 開始前 MUST 完成的核心基礎

**⚠️ CRITICAL**: User Story 實作不可在本 Phase 完成前開始

- [ ] T006 執行 Git 可運作檢查（進入基礎階段前）
- [ ] T007 在 `site/index.html` 中建立完整 DOM 骨架：含 `#game-board`（4×4 `.cell`）、`#score-display`、`#best-score-display`、`#restart-btn`、`#message-overlay`、`#message-text`、`#continue-btn`，符合 contracts/ui-contract.md 規範
- [ ] T008 [P] 在 `site/style.css` 中建立棋盤基礎版面：4×4 Grid 佈局、`.cell` 與 `.tile` 基礎樣式、`.message-overlay.hidden` 隱藏規則
- [ ] T009 在 `site/game.js` 中宣告模組出口（export）：`export { slideRow, isGameOver, rotateBoard, initGame, move }`，確保測試可直接匯入

**Checkpoint**: 基礎完成——各 User Story 可平行開始

---

## Phase 3: User Story 1 — 核心遊戲玩法（Priority: P1）🎯 MVP

**目標**: 可完整遊玩的 2048 遊戲：4×4 棋盤、方塊移動與合併、勝利／結束判斷

**Independent Test**: 在空白棋盤上執行一系列滑動操作，驗證方塊移動、合併規則、新方塊出現，以及勝利／結束條件正確觸發

### 測試 — User Story 1（TDD：先寫並確認失敗）⚠️

> **注意：先執行 `npm test` 確認測試失敗，再進行實作**

- [ ] T010 [P] [US1] 在 `tests/unit/board.test.js` 撰寫 `slideRow` 單元測試：覆蓋空列、無合併滑動、相鄰合併、非相鄰合併、一次移動只合併一次（FR-007）、回傳 `{result, delta}`
- [ ] T011 [P] [US1] 在 `tests/unit/board.test.js` 撰寫 `rotateBoard` 單元測試：順時針旋轉 1–3 次、旋轉 4 次還原原始棋盤
- [ ] T012 [P] [US1] 在 `tests/unit/endgame.test.js` 撰寫 `isGameOver` 單元測試：有空格時回傳 false、有可合併方塊時回傳 false、棋盤填滿且無合併時回傳 true

### 實作 — User Story 1

- [ ] T013 [US1] 在 `site/game.js` 實作 `slideRow(row)`：過濾零值、從左依序合併相鄰相同值（每個方塊只合併一次）、補零至長度 4、回傳 `{result: number[], delta: number}`
- [ ] T014 [US1] 在 `site/game.js` 實作 `rotateBoard(board, times)`：純函式，順時針旋轉棋盤 `times` 次（1–3）
- [ ] T015 [US1] 在 `site/game.js` 實作 `isGameOver(board)`：純函式，判斷棋盤是否無法再移動（填滿且四方向皆無法合併）
- [ ] T016 [US1] 在 `site/game.js` 實作棋盤初始化：建立 4×4 全零陣列，呼叫 `spawnTile` 兩次（數值為 2 佔 90%、4 佔 10%）
- [ ] T017 [US1] 在 `site/game.js` 實作 `spawnTile(board)`：在隨機空格放置 2（90%）或 4（10%）
- [ ] T018 [US1] 在 `site/game.js` 實作 `move(direction)`：旋轉棋盤 → 對每列呼叫 `slideRow` → 旋轉回原方向 → 若棋盤有變化則呼叫 `spawnTile` → 觸發勝利／結束判斷
- [ ] T019 [US1] 在 `site/game.js` 實作勝利判斷：設 `hasWon` 旗標（布林值），出現 2048 方塊時顯示勝利 overlay，勝利提示僅顯示一次（FR-008）；「繼續遊戲」按鈕觸發關閉 overlay 並繼續
- [ ] T020 [US1] 在 `site/game.js` 實作結束判斷：呼叫 `isGameOver`，顯示「遊戲結束」overlay
- [ ] T021 [US1] 在 `site/game.js` 實作 DOM 渲染函式 `renderBoard(board)`：清空並重建 `#game-board` 內的 `.tile` 元素，依數值套用 `.tile-N` class（含 `.tile-super`）
- [ ] T022 [US1] 在 `site/game.js` 綁定鍵盤事件：監聽 `keydown` 的 `ArrowUp/Down/Left/Right`，呼叫對應 `move(direction)`
- [ ] T023 [US1] 在 `site/game.js` 綁定觸控 swipe 事件：監聽 `touchstart`/`touchend`，ΔX 或 ΔY > 30px 時觸發 `move(direction)`
- [ ] T024 [US1] 執行 `npm test` 確認所有 US1 測試通過（T010–T012 覆蓋範圍）

**Checkpoint**: User Story 1 已可完整遊玩並通過所有單元測試

- [ ] T024A [US1] 更新 `tasks.md` 勾選狀態，確保與實際完成一致

---

## Phase 4: User Story 2 — 分數記錄與最高分（Priority: P2）

**目標**: 即時分數顯示與頁面存活期間最高分追蹤

**Independent Test**: 在已知棋盤狀態下執行合併操作，驗證分數正確累加，以及重新開始後最高分保留

### 測試 — User Story 2（TDD：先寫並確認失敗）⚠️

- [ ] T025 [P] [US2] 在 `tests/unit/score.test.js` 撰寫分數計算測試：合併後 `score += mergedValue`、`bestScore = Math.max(bestScore, score)`、重新開始後 `score = 0` 且 `bestScore` 保留

### 實作 — User Story 2

- [ ] T026 [US2] 在 `site/game.js` 新增 `score` 與 `bestScore` 狀態變數，在 `move()` 內累加 `slideRow` 回傳的 `delta`
- [ ] T027 [US2] 在 `site/game.js` 實作 `updateScoreDisplay()`：更新 `#score-display` 與 `#best-score-display` 文字內容，於每次 `move()` 後呼叫
- [ ] T028 [US2] 執行 `npm test` 確認所有 US2 測試通過（T025 覆蓋範圍）

**Checkpoint**: User Story 1 與 2 均可獨立驗證且通過測試

- [ ] T028A [US2] 更新 `tasks.md` 勾選狀態，確保與實際完成一致

---

## Phase 5: User Story 3 — 重新開始遊戲（Priority: P3）

**目標**: 任意時刻透過「重新開始」按鈕重置遊戲

**Independent Test**: 在任意遊戲狀態下點擊「重新開始」，驗證棋盤清空、分數歸零、初始方塊正確出現

### 實作 — User Story 3

- [ ] T029 [US3] 在 `site/game.js` 實作 `initGame()`：重設 board（4×4 全零）、score = 0、status = 'playing'、hasWon = false、生成 2 個初始方塊、隱藏 `#message-overlay`、呼叫 `renderBoard` 與 `updateScoreDisplay`
- [ ] T030 [US3] 在 `site/game.js` 綁定 `#restart-btn` 點擊事件：呼叫 `initGame()`（bestScore 保留）
- [ ] T031 [US3] 在 `site/game.js` 綁定 `#message-overlay` 內「重新開始」按鈕點擊事件：呼叫 `initGame()`
- [ ] T032 [US3] 在 `site/index.html` 底部加入 `<script type="module" src="game.js"></script>` 並呼叫 `initGame()` 以啟動遊戲

**Checkpoint**: 所有 User Story 均可獨立運作並通過測試

- [ ] T032A [US3] 更新 `tasks.md` 勾選狀態，確保與實際完成一致

---

## Phase 6: Polish & Cross-Cutting Concerns

**目的**: 跨故事的視覺完善與品質收尾

- [ ] T033 [P] 在 `site/style.css` 補完各數值方塊配色：`.tile-2` 到 `.tile-2048` 及 `.tile-super`，套用與原版 2048 相近的背景與文字色
- [ ] T034 [P] 在 `site/style.css` 補完 RWD 響應式排版：viewport < 500px 時棋盤縮放適配手機螢幕
- [ ] T035 依 `specs/001-2048-game/quickstart.md` 執行本地驗收：`open site/index.html` 手動驗證三個 User Story 的 Acceptance Scenarios
- [ ] T036 執行最終 `npm test` 確認全部測試通過
- [ ] T037 執行 Git 可運作檢查（`git status`、`git diff`），確認所有變更可追蹤
- [ ] T038 [P] 確認 `specs/001-2048-game/` 下的規格文件未被刪除或覆蓋（spec.md、plan.md、tasks.md）

---

## Dependencies & Execution Order

### Phase 相依關係

- **Setup (Phase 1)**: 無相依，可立即開始
- **Foundational (Phase 2)**: 依賴 Phase 1 完成——BLOCKS 所有 User Story
- **User Stories (Phase 3–5)**: 均依賴 Phase 2 完成
  - 按優先順序依序執行：US1（P1）→ US2（P2）→ US3（P3）
  - 或在人手充足時平行進行
- **Polish (Phase 6)**: 依賴所有 User Story Phase 完成

### User Story 相依關係

- **US1 (P1)**: Phase 2 完成後即可開始，無對其他故事的相依
- **US2 (P2)**: Phase 2 完成後即可開始；`slideRow` 的 `delta` 回傳值由 US1 實作提供，建議 US1 完成後開始
- **US3 (P3)**: 依賴 US1（`initGame` 需要棋盤初始化與渲染邏輯）

### 各 Story 內部順序

- 測試 MUST 先寫並確認失敗，再進行實作（TDD 原則）
- 純函式（slideRow、rotateBoard、isGameOver）先實作，再建構 move() 與 initGame()
- 核心邏輯完成後再綁定 DOM 事件

### 平行機會

- Phase 1 所有 [P] 任務可平行執行
- Phase 2 所有 [P] 任務可平行執行
- Phase 3 的測試任務（T010–T012）可平行撰寫
- Phase 3 的純函式實作（T013–T015）彼此無依賴，可平行
- Phase 6 所有 [P] 任務可平行執行

---

## Parallel Example: User Story 1

```bash
# 平行撰寫所有 US1 測試：
Task: "tests/unit/board.test.js — slideRow 測試（T010）"
Task: "tests/unit/board.test.js — rotateBoard 測試（T011）"
Task: "tests/unit/endgame.test.js — isGameOver 測試（T012）"

# 平行實作 US1 純函式（測試失敗確認後）：
Task: "site/game.js — slideRow 實作（T013）"
Task: "site/game.js — rotateBoard 實作（T014）"
Task: "site/game.js — isGameOver 實作（T015）"
```

---

## Implementation Strategy

### MVP First（僅 User Story 1）

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（CRITICAL——阻塞所有故事）
3. 完成 Phase 3: User Story 1
4. **停下來驗證**：手動開啟 `site/index.html`，確認核心遊戲可玩
5. 若 MVP 已就緒，可部署至 GitHub Pages

### Incremental Delivery

1. Setup + Foundational → 基礎就緒
2. + User Story 1 → 可玩的 2048 MVP，測試後部署
3. + User Story 2 → 加入分數系統，測試後部署
4. + User Story 3 → 加入重新開始，測試後部署
5. 每個故事增加價值，不破壞前一個故事

### Parallel Team Strategy

有多位開發者時：

1. 共同完成 Setup + Foundational
2. Phase 2 完成後：
   - 開發者 A：User Story 1（核心玩法）
   - 開發者 B：User Story 2（分數系統，等待 slideRow delta 介面確定）
   - 開發者 C：User Story 3（重新開始，等待 initGame 介面確定）

---

## Notes

- **[P]** 標記 = 不同檔案、無未完成依賴，可平行執行
- **[Story]** 標記對應 spec.md 中的 User Story，確保需求可追溯
- 每個故事應可獨立完成並測試
- 測試必須先寫並確認失敗（Red），再實作（Green），再重構（Refactor）
- 每個階段開始與結束都要執行 Git 可運作檢查
- **MUST NOT** 刪除或覆蓋規格文件（`spec.md`、`plan.md`、`tasks.md`）
- `tasks.md` 的 checkbox 必須反映實際進度，不可延後補記
- 每個任務或邏輯群組完成後即 commit
- 在任意 Checkpoint 停下驗證，確保故事可獨立運作
- 避免：模糊任務、同檔案衝突、破壞獨立性的跨故事依賴
