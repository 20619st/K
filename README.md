# K

## 2048 遊戲

一個在瀏覽器中運行的 2048 滑動方塊拼圖遊戲，採用純 HTML5 + CSS3 + JavaScript（ES6+），可直接部署至 GitHub Pages。

### 功能

- 4×4 棋盤，鍵盤方向鍵與觸控 Swipe 操作
- 合併邏輯（相同方塊合併一次，FR-007）
- 即時分數與最高分（頁面存活期間）
- 勝利（2048 方塊）與遊戲結束偵測
- 重新開始按鈕

### 本地開發

```bash
# 直接用瀏覽器開啟
open site/index.html
```

### 執行測試

```bash
npm install
npm test
```

### GitHub Pages 部署

將 `site/` 目錄的內容部署至 GitHub Pages，或直接設定 Pages 來源為 `site/` 資料夾。
