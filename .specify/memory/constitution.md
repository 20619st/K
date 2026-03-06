<!--
Sync Impact Report
Version change: N/A（template 未定義） -> 1.0.0
Modified principles:
- Template Principle 1 -> I. 最小可行與避免過度設計
- Template Principle 2 -> II. 每階段 Git 可運作確認
- Template Principle 3 -> III. TDD 優先（不可妥協）
- Template Principle 4 -> IV. Implement 階段任務勾選與規格保護
- Template Principle 5 -> V. 網站專案預設靜態前端優先
Added sections:
- 技術與文件約束
- 開發流程與品質關卡
Removed sections:
- 無
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ⚠ pending: .specify/templates/commands/*.md（目錄不存在，無需更新）
- ✅ README.md（已檢查，無需修改）
Follow-up TODOs:
- 無
-->

# K 專案憲章

## Core Principles

### I. 最小可行與避免過度設計
所有方案 MUST 以最小可行產品（MVP）為起點，僅實作當前需求所需能力。未被需求、
測試或營運目標直接驅動的抽象化與擴充 MUST 延後。理由：降低複雜度與回歸風險，
提升交付速度與可維護性。

### II. 每階段 Git 可運作確認
每個階段（spec、plan、tasks、implement）開始與結束時 MUST 驗證 Git 可正常運作，
至少包含 `git status` 可執行且工作樹狀態可解讀；需要比對差異時 MUST 可執行
`git diff`。理由：確保變更可追蹤、可審查、可回溯。

### III. TDD 優先（不可妥協）
功能實作 MUST 遵循 TDD：先寫測試、先看到失敗（Red）、再最小實作（Green）、
最後重構（Refactor）。未先建立失敗測試的功能程式碼不得視為完成。理由：以可執行
規格驅動品質，避免需求漂移與隱性回歸。

### IV. Implement 階段任務勾選與規格保護
implement 階段執行時，`tasks.md` 的 checkbox MUST 與實際完成狀態一致並即時更新。
同時 MUST 避免刪除、覆蓋或重置 `spec.md`、`plan.md`、`tasks.md` 等規格檔案，
尤其在套用框架或腳手架模板時。理由：維持執行透明度與需求可追溯性。

### V. 網站專案預設靜態前端優先
若需求屬網站專案且無明確反證，架構 MUST 優先採前端靜態網站，並以可部署到
GitHub Pages 為預設目標。僅在需求明確需要伺服器端能力時才引入後端。理由：
降低部署與維運成本，縮短交付路徑。

## 技術與文件約束

- 規格文件與協作回覆 MUST 使用繁體中文，除非外部標準或法規要求其他語言。
- 除非有明確必要（例如審計、法遵或交接要求），SHOULD NOT 額外建立總結型
	Markdown 文件，以避免文件分裂與維護負擔。
- 所有新增流程約束 MUST 能映射到可檢查的行為（命令、測試、勾選紀錄或檔案差異）。

## 開發流程與品質關卡

1. Spec 階段：確認範圍與 MVP 邊界，並執行 Git 可運作檢查。
2. Plan 階段：產出技術方案與憲章檢查清單，並再次執行 Git 可運作檢查。
3. Tasks 階段：將工作拆解為可驗證任務，包含先測試後實作的順序，並執行 Git 檢查。
4. Implement 階段：依 `tasks.md` 執行與勾選、堅持 TDD、保護規格檔，階段前後都要
	 完成 Git 檢查。

## Governance

本憲章優先於一般慣例與臨時流程。修訂程序 MUST 透過可審查變更提出，並同步更新受
影響模板與流程文件。

版本規則採語意化版號：
- MAJOR：移除或重新定義核心原則，造成治理不相容。
- MINOR：新增原則、章節，或實質擴充既有規範。
- PATCH：措辭澄清、排版或不改變治理意圖之微調。

合規審查 MUST 在 PR 或階段交付時進行，至少確認：MVP 原則、Git 檢查、TDD 證據、
`tasks.md` 勾選一致性、以及規格檔保護要求。

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
