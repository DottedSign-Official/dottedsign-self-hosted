[English](./README.md) | [繁體中文](./README.zh-TW.md)

# 點點簽 DottedSign Self-Hosted：企業級私有化部署電子簽章系統

[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-4b5fe6)](./LICENSE) ![Deploy: Docker Compose](https://img.shields.io/badge/deploy-Docker%20Compose-2496ed?logo=docker&logoColor=white)

*Self-host DottedSign with Docker Compose — your data, your server.*

![點點簽 DottedSign Self-Hosted — 你的資料、你的伺服器，完整簽署流程](./docs/assets/dottedsign-self-hosted-overview.png)

**已服務全球超過 4,200 家企業、突破 100 萬用戶。** 點點簽 DottedSign Self-Hosted 讓重視資料主權的企業，在自有網路環境或常用雲端中，自主運行完整的點點簽簽署系統。專為有合規需求或封閉網路環境的組織打造，開源的 DocuSign 替代方案，提供一套你能完全掌控的彈性電子簽署流程。

## 核心特色

- 資料主權：文件與簽署紀錄留存於企業自有伺服器，不經第三方基礎設施。誰能存取、保留多久，全由你決定。
- 支援 Docker 部署：提供 Docker Compose 安裝流程，協助 IT 人員快速完成環境建置與概念驗證 (POC) 測試
- 免費開源版體驗：本開源版本提供永久授權使用，包含基本簽署功能與 API 核心模組，支援無限制的簽署次數與用戶數（註：此版本完成之簽署文件將帶有免費版識別標示）
- 彈性部署：同一套 Docker Compose，環境由你選——自有伺服器，或你已在使用的雲端（AWS、GCP、Azure、Snowflake）。在不同環境間移動，運行方式都一樣。

## 快速開始 (Quick Start)

### 系統環境需求 (Prerequisites)：

- Docker 20+
- Docker Compose v2
- 建議 8 GB RAM（涵蓋 Postgres、Redis、backend、worker、frontend、nginx 全套服務）

### 步驟 1：Clone 專案

```bash
git clone https://github.com/DottedSign-Official/dottedsign-self-hosted.git dottedsign-self-hosted
cd dottedsign-self-hosted
```

### 步驟 2：設定環境變數

請複製範例檔並分別更名為 `backend.env` 與 `frontend.env`，根據您的環境進行設定

```bash
cp backend.env.sample backend.env
cp frontend.env.sample frontend.env
```

`frontend.env` 的設定必須與 `backend.env` 對應：兩份檔案中的
`AUTH_CLIENT_ID` 與 `AUTH_CLIENT_SECRET` 必須完全一致 — backend 首次啟動時
會以這組值建立 OAuth client，前端則用同一組值取得 token。修改其中一份時，
請務必同步修改另一份。`BACKEND_HOST` 預設指向 Docker Compose 內的 backend
服務名稱，一般不需修改。

可完整參考（每個變數、預設值與是否必填）位於
[`docs/configuration.md`](./docs/configuration.md)。

啟動服務的必填變數：

| 變數                                                                                              | 用途            |
|-------------------------------------------------------------------------------------------------|---------------|
| `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_NAME` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` | PostgreSQL 連線 |
| `REDIS_HOST`                                                                                    | Redis 連線      |
| `SERVER_HOST` / `WEB_BRANCH_DEEPLINK`                                                           | 對外服務 URL      |
| `JWT_SECRET`                                                                                    | JWT 簽章金鑰      |
| `OTP_KEY`                                                                                       | OTP 金鑰        |
| `RECORD_ENCRYPTION_KEY`                                                                         | 資料庫敏感欄位加密金鑰   |
| `SUPER_ADMIN` / `SUPER_ADMIN_PASSWORD`                                                          | 初始超級管理員       |
| `MEMBER` / `MEMBER_PASSWORD`                                                                    | 初始一般使用者       |

#### 請務必產生自己的金鑰（重要）

`JWT_SECRET` 與 `OTP_KEY` 在 `backend.env.sample` 中為空值。若留空或直接沿用範例值，
系統會使用開源程式碼中公開可見的預設值，等同於使用公開且已知的弱密鑰，
任何人都可能藉此偽造 token 或一次性密碼。正式部署前，請務必自行產生安全金鑰：

```bash
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 32   # OTP_KEY
openssl rand -hex 16   # RECORD_ENCRYPTION_KEY（32 個 hex 字元）
```

`AUTH_CLIENT_ID` 與 `AUTH_CLIENT_SECRET` 同樣僅為範例值。基於相同的資安考量，
正式環境務必更換為自行產生的隨機值（例如 `openssl rand -hex 32`），
避免使用公開範例憑證 — 並記得在 `backend.env` 與 `frontend.env`
兩份檔案中設定相同的一組值。

### 步驟 3：啟動服務

```bash
docker compose up -d
```

服務啟動後，即可透過瀏覽器造訪 `http://127.0.0.1` 或 `http://{env.host}` 開始使用 DottedSign

預設帳號可至 `backend.env` 確認

#### 將服務暴露至 localhost 以外前的檢查清單

快速開始的預設值僅適用於本機概念驗證（POC）。在任何他人可連線的環境部署前，
請逐項確認：

- 更換所有預設密碼：`SUPER_ADMIN_PASSWORD`、`MEMBER_PASSWORD`，以及
  `SIDEKIQ_USER_NAME` / `SIDEKIQ_PASSWORD` — 隨附的 nginx 會將 `/sidekiq`
  管理介面對外開放，僅靠這組 basic auth 帳密保護。
- `DATABASE_PASSWORD` 必須與 `docker-compose.yml` 中的 `POSTGRES_PASSWORD`
  一起更換（兩者必須一致）；若 Redis 可能被 compose 內部網路以外連線，
  請設定 `REDIS_PASSWORD`。
- 範例檔中的 `OPENSSL_PASS` 為公開已知，因此它所保護的 `*.enc` 設定檔內容
  應視同公開。若要改用自己的密碼，請先執行 `rake config:encrypt_files`
  重新加密後再更新 `OPENSSL_PASS` — 只改變數會導致服務無法啟動。
- 設定 `RAILS_ENV=production`。

#### 自動產生的金鑰與資料保存

首次啟動時，backend 會自動產生此安裝專屬的機密資料（`rake config:bootstrap_secrets`）：

- `backend/config/master.key` / `backend/config/credentials.yml.enc` — Rails credentials
- `backend/config/on_premise_rsa/password/` — 用於加解密 `CRYPTO_*` 加密密碼值的 RSA 金鑰對

若需要保留或重複使用這些資訊，請將對應的檔案或資料目錄透過 volume 掛載出來，
避免容器重建後遺失。

隨附的 `docker-compose.yml` 僅為簡易範例：它掛載了整個 `./backend` 目錄，
因此上述金鑰與上傳文件（`backend/tmp/storage`）會保存在主機上。
請依實際部署需求自行調整，例如 storage 與 password RSA 金鑰對
（`backend/config/on_premise_rsa/password` 內的 pem 檔）的保存方式與掛載路徑。
若改用預先建置的 image 而不掛載原始碼目錄，請務必將上述路徑
（以及 PostgreSQL 資料目錄）以 volume 掛載，否則容器重建後金鑰與資料將會遺失。

### 其他技術文件

- [OpenAPI README](./openapi/README.md) —— API 規格與本機預覽
- [Configuration Reference](./docs/configuration.md) —— 完整環境變數

## **API 整合情境**

**API 串接，嵌入您的內部系統**

DottedSign Self-Hosted 提供完整的 REST API，讓 IT 團隊可以將電子簽名流程嵌入企業既有的業務系統，無需使用者切換平台。

**常見整合情境**

| 產業/角色 | 使用情境                                                                        |
|-------|-----------------------------------------------------------------------------|
| 法務    | 法務合約審閱完成後，自動觸發簽署流程，雙方線上完成用印; 可應用系統：CLM 合約生命週期管理系統（如 Ironclad、Icertis、Conga） |
| 旅遊    | 訂單成立後自動產生保險合約並寄送給客戶簽署; 可應用系統：旅遊平台訂單系統                                       |
| 人資    | 新進員工到職當天，HR 系統自動發送報到簽署文件（勞動契約、保密協議等; 可應用系統：HRM 人資系統                         |
| 醫療    | 手術同意書線上簽署，存回結果至病歷資料; 可應用系統：HIS 醫院資訊系統、EMR 電子病歷系統                            |
| 商務    | 自動產出銷售合約，推送給客戶簽署，簽完回寫商機狀態; 可應用系統：CRM 系統（Salesforce、HubSpot、Pipedrive）       |

透過 API，您可以：

- 發起簽署任務：指定簽署人、欄位位置、到期時間
- 即時追蹤狀態：掌握每份文件的簽署進度
- 自動歸檔：簽署完成後自動取回 PDF，存入您的文件管理系統

## Self-Hosted 還是 SaaS？哪個適合你

兩者跑的是同一套 DottedSign 簽署體驗，差別在於**資料放在哪、由誰維運**。

|        | Self-Hosted（本專案）                             | SaaS             |
|--------|----------------------------------------------|------------------|
| 資料存放位置 | 自有伺服器——內網，或你常用的雲端平台（AWS／GCP／Azure／Snowflake） | DottedSign 託管的雲端 |
| 適合誰    | 有資料主權／合規需求、封閉網路環境的組織                         | 立刻開始簽署的團隊        |
| 部署方式   | 自行以 Docker Compose 部署                        | 免部署，註冊即用         |
| 維運與更新  | 由你的 IT 團隊負責                                  | 由 DottedSign 負責  |
| 授權     | 開源 AGPL-3.0（永久授權）；另有商業授權                     | 訂閱制方案            |
| 進階安全模組 | 透過商業授權提供（如經認可的數位憑證、Email／簡訊 OTP）             | 依方案內含            |

不確定哪個適合？[聯繫點點簽團隊](https://www.dottedsign.com/zh-tw/request-demo/)。

## 常見問題 FAQ

### 開源版真的免費嗎？

是的。本開源版採 AGPL-3.0 永久授權，包含基本簽署功能與 API 核心模組，支援無限制的簽署次數與用戶數。此版本完成的簽署文件會帶有免費版識別標示。

### 除了自有伺服器，可以部署在雲端嗎？

可以。同一套 Docker Compose 既能跑在企業內網，也能部署於你常用的雲端平台——AWS、GCP、Azure、Snowflake。

### 開始前需要準備什麼？

Docker 20+、Docker Compose v2，建議 8 GB RAM（涵蓋 Postgres、Redis、backend、worker、frontend、nginx 全套服務）。詳見上方快速開始。

### 開源版與商業授權差在哪？

開源版涵蓋核心簽署作業流程；商業授權可解鎖進階安全模組（如經認可的數位憑證、Email OTP、簡訊 OTP）、透過組織權限管理控制台（Admin
Console）設定成員角色與權限，並支援深度整合／客製化，且不受 AGPL-3.0 開源規範限制。

### 只在內部使用，也要受 AGPL-3.0 約束嗎？

若僅於組織內部安裝使用，未對外散布、亦未透過網路對外提供服務予第三方，則不受開源條款的強制影響。若修改原始碼並對外提供服務予第三方，依約定須將修改後的原始碼以
AGPL-3.0 開源。有不開源的客製化需求，建議洽詢商業授權。

### 怎麼取得技術支援？

部署問題歡迎於 GitHub Issues 提出，由社群協助。授權客戶享有比照 SaaS 標準的 SLA
支援服務——詳情請[洽業務團隊](https://www.dottedsign.com/zh-tw/request-demo/?help=inquiry_enterprise_plan)。

## **企業導入實績與案例**

點點簽 DottedSign 累積豐富的企業服務經驗，提供尋求 Self-Hosted 方案的企業技術合規與穩定性的參考：

- **市場實績**：全球已服務超過 4,200 家企業，全球突破**百萬用戶**導入。
- **大型製造業**：推動 ESG 無紙化，數位簽章加速內部合規流程。
- **跨國旅遊集團**：旅遊合約數位化，打造低碳簽署體驗。
- **大型金融證券**：導入視訊電子簽章，開展金融科技新應用。
- **零售 / 連鎖集團**：每年超過 1,000 份人事文件全面無紙化。
- **科技上市企業**：完善對外電子化商務流程。
- **知名旅遊電商**：結合 RPA 自動化，招募合約 1 天內有效簽回。

👉 [查看更多客戶故事](https://www.dottedsign.com/zh-tw/blog/category/user-story)

## 進階需求與商業授權

目前的開源版本涵蓋了核心的簽署作業流程。若您的組織有以下進階需求：

1. 解鎖進階安全模組：如經認可的數位憑證、Email OTP、簡訊 OTP 等功能
2. 專屬客製化與系統整合：需要對系統進行深度整合，或不希望受限於 AGPL-3.0 的開源規範

👉 歡迎聯繫 [點點簽業務專人服務](https://www.dottedsign.com/zh-tw/request-demo/?help=inquiry_enterprise_plan) 洽詢商業授權方案與報價

## AGPL-3.0 開源授權與注意事項

本開源版本基於**AGPL-3.0 條款**發佈

- 若您的組織僅於內部安裝使用，未對外散布、亦未透過網路對外提供本系統服務予第三方，將不受開源條款的強制影響
- 若您修改了系統原始碼（例如調整介面），並將修改後的系統對外提供服務予第三方，則依約定必須將修改後的原始碼一併以 AGPL-3.0
  開源。如有不開源的客製化需求，建議洽詢商業授權

## 技術支援 (Support)

- 開源版技術討論：如遇部署技術問題，歡迎於 GitHub Issues 提出，由社群共同交流與協助。
- 商業授權與服務支援：授權客戶享有比照 SaaS 標準的 SLA 支援服務，詳情請洽業務團隊。