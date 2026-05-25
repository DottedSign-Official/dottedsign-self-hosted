[English](./README.md) | [繁體中文](./README.zh-TW.md)

# Self-Hosted OpenAPI

OpenAPI specification and local preview guide for the DottedSign Self-Host deployment.

## Specification File

Main OpenAPI file:

```text
openapi/self_hosted.yml
```

Paths and components are located in `openapi/paths/` and `openapi/components/` respectively.

## Local Preview

Two preview options are available — choose based on your needs:

- Redoc
- Swagger UI (watcher)

### Redoc

```bash
npx redoc-cli serve openapi/self_hosted.yml
```

Default address:

```text
http://localhost:8080
```

### Swagger UI (watcher)

```bash
npx -y swagger-ui-watcher openapi/self_hosted.yml --port 8080
```

Default address:

```text
http://127.0.0.1:8080
```

Any file changes under `openapi/` will automatically refresh the page. If the document does not conform to the OpenAPI specification, an Errors block will appear at the top of the page indicating what needs to be fixed.

## Export Static HTML

Bundle into a single HTML file:

```bash
npx redoc-cli bundle openapi/self_hosted.yml -o redoc-static.html
```

Output file:

```text
redoc-static.html
```
