# UI Contract: 2048 遊戲

**Phase**: 1 — 介面契約  
**Branch**: `001-2048-game`  
**Date**: 2026-03-13

## 概述

本文件定義 2048 遊戲的 UI 介面契約，包含 DOM 元素識別碼、CSS Class 命名、
JavaScript 公開函式簽章，以及使用者可感知的行為契約。

---

## DOM 元素契約

| 元素 ID / Class | 元素類型 | 用途 |
|----------------|----------|------|
| `#game-board` | `div` | 4×4 棋盤容器 |
| `.cell` | `div` | 16 個格子（`data-row`, `data-col` 屬性） |
| `.tile` | `div` | 方塊元素，動態建立，含 `data-value` 屬性與對應 CSS class |
| `#score-display` | `span` | 當前分數顯示 |
| `#best-score-display` | `span` | 最高分顯示 |
| `#restart-btn` | `button` | 重新開始按鈕 |
| `#message-overlay` | `div` | 勝利／結束訊息覆蓋層（預設隱藏） |
| `#message-text` | `p` | 訊息文字（「恭喜！你達到 2048！」或「遊戲結束」） |
| `#continue-btn` | `button` | 繼續遊戲按鈕（僅勝利時可見） |

---

## CSS Class 契約

| Class | 說明 |
|-------|------|
| `.tile-2` | 數值 2 的方塊樣式 |
| `.tile-4` | 數值 4 的方塊樣式 |
| `.tile-8` … `.tile-2048` | 依此類推 |
| `.tile-super` | 數值超過 2048 的方塊（繼續遊戲後可能出現） |
| `.message-overlay.hidden` | 訊息覆蓋層隱藏狀態 |

---

## JavaScript 公開函式契約

以下函式為 `game.js` 對外（HTML 事件）或對測試暴露的介面：

### `initGame(): void`
- 初始化或重置遊戲：重設 board、score、status、hasWon
- 生成 2 個初始方塊
- 更新 DOM 顯示

### `move(direction: 'up'|'down'|'left'|'right'): void`
- 執行一次移動：slide + merge + spawnTile（若有棋盤變化）
- 更新分數與 DOM
- 觸發勝利或結束檢查

### `slideRow(row: number[]): { result: number[], delta: number }`
- 純函式，向左滑動並合併一列
- **可被測試直接呼叫**

### `isGameOver(board: number[][]): boolean`
- 純函式，判斷棋盤是否無法再移動
- **可被測試直接呼叫**

### `rotateBoard(board: number[][], times: number): number[][]`
- 純函式，順時針旋轉棋盤 `times` 次（1–3）
- **可被測試直接呼叫**

---

## 行為契約

### 有效移動
- **前置條件**: 遊戲狀態為 `playing`
- **觸發**: 鍵盤方向鍵（`keydown: ArrowUp/Down/Left/Right`）或觸控 swipe（ΔX 或 ΔY > 30px）
- **後置條件**: 棋盤更新、分數更新、若有變化則生成新方塊、DOM 重新渲染

### 無效移動（棋盤無變化）
- **行為**: 不生成新方塊，DOM 不更新，狀態不變

### 勝利條件
- **觸發**: 合併後出現數值 ≥ 2048 的方塊，且 `hasWon === false`
- **行為**: 顯示 `#message-overlay`（訊息：「恭喜！你達到 2048！」），設 `hasWon = true`
- **繼續遊戲**: 點擊 `#continue-btn` → 隱藏 overlay，狀態回 `playing`，勝利提示不再出現

### 遊戲結束條件
- **觸發**: 棋盤滿且 `isGameOver() === true`
- **行為**: 顯示 `#message-overlay`（訊息：「遊戲結束」），狀態設為 `over`

### 重新開始
- **觸發**: 點擊 `#restart-btn`（任何時候）
- **行為**: 呼叫 `initGame()`，分數歸零，最高分保留，`hasWon = false`

---

## 觸控 Swipe 規格

| 參數 | 值 |
|------|----|
| 最小 swipe 距離 | 30px |
| 方向判斷 | `abs(dx) > abs(dy)` → 水平（左/右）；否則垂直（上/下） |
| 觸控事件 | `touchstart`（記錄起點）、`touchend`（計算 ΔX/ΔY） |
