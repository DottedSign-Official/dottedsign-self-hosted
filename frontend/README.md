## 環境變數

容器部署時，環境變數由專案根目錄的 `frontend.env` 提供（參考根目錄的
`frontend.env.sample`，各變數說明見 `docs/configuration.md`）。

本機開發（`yarn dev`）時，請在此目錄自行建立 `.env`（內容同
`frontend.env.sample`）。此檔已被 git 與 docker build 排除，不會被提交或
打包進 image。

## Available Scripts

在專案目錄中，您可以運行以下指令：

### `yarn dev`

在開發模式下運行應用。<br>
打開 [http://localhost:3000](http://localhost:3000) 在瀏覽器中查看。

### `yarn build`

為生產環境將應用程式建構到 `.next` 文件夾。<br>
它正確地將 React 打包在生產模式並優化建構以獲得最佳性能。

### `yarn start`

在生產模式下啟動應用程式。
應用程式應先用 `next build` 編譯。

### `yarn test`

運行 Jest 進行測試。

### `yarn format`

使用 Prettier 格式化 `.ts`, `.js`, `.jsx`, `.tsx` 文件。

### `yarn eslint`

使用 ESLint 自動修正 `.ts`, `.js`, `.jsx`, `.tsx` 文件中的代碼問題。

### 其他

Husky 將被設定為在每次 commit 前自動執行 `yarn eslint` 和 `yarn format`。
