[English](./README.md) | [繁體中文](./README.zh-TW.md)

# Self-Hosted OpenAPI

DottedSign Self-Host 部署版本的 OpenAPI 規格與本機預覽說明。

## 規格檔

主 OpenAPI 檔案：

```text
openapi/self_hosted.yml
```

路徑/元件分別放在 `openapi/paths/` 與 `openapi/components/`。

## 本機預覽

提供兩種預覽方式，依用途選擇：

- Redoc
- Swagger UI（watcher）

### Redoc

```bash
npx redoc-cli serve openapi/self_hosted.yml
```

預設位址：

```text
http://localhost:8080
```

### Swagger UI（watcher）

```bash
npx -y swagger-ui-watcher openapi/self_hosted.yml --port 8080
```

預設位址：

```text
http://127.0.0.1:8080
```

`openapi/` 內檔案變更會自動重新整理頁面。若文件不符 OpenAPI 規範，頁面上方會出現 Errors 區塊提示需要修正的位置。

## 輸出靜態 HTML

打包成單一 HTML：

```bash
npx redoc-cli bundle openapi/self_hosted.yml -o redoc-static.html
```

產出檔案：

```text
redoc-static.html
```
