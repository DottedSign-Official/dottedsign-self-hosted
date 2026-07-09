[English](../README.md) | [繁體中文](../README.zh-TW.md)

# Configuration Reference

This document lists every environment variable consumed by JackRabbit Server.
Variables are grouped by purpose, matching the section headers in
`backend.env.sample`. Defaults reflect the values in that sample file unless
noted otherwise.

## Table of Contents

- [Secrets Generated at First Boot](#secrets-generated-at-first-boot)
- [Backend Environment](#backend-environment)
- [Storage](#storage)
- [Encrypted Settings](#encrypted-settings)
- [Connection](#connection)
- [Concurrency](#concurrency)
- [Email](#email)
- [SMS](#sms)
- [Internal Mailer Paths](#internal-mailer-paths)
- [Initial Users & Auth](#initial-users--auth)
- [Other](#other)
- [LDAP](#ldap)
- [Group](#group)
- [Callback](#callback)
- [SignTask](#signtask)
- [KMPDF](#kmpdf)
- [Frontend Environment (frontend.env)](#frontend-environment-frontendenv)

## Secrets Generated at First Boot

On first start, `rake config:bootstrap_secrets` (already wired into the sample
`docker-compose.yml`) generates the following per-install secrets if they do
not exist:

- `backend/config/master.key` and `backend/config/credentials.yml.enc` —
  Rails credentials (contains a random `secret_key_base`).
- `backend/config/on_premise_rsa/password/private.pem` / `public.pem` —
  RSA key pair used to encrypt/decrypt the `CRYPTO_*` password values.

These files are unique to your installation. If you want to keep or reuse
them, mount the corresponding paths as volumes (the sample compose file mounts
the whole `./backend` directory, which covers them). Without a volume mount,
the keys are regenerated when the container is rebuilt, and any previously
encrypted `CRYPTO_*` values or credentials become undecryptable.

## Backend Environment

| Name | Required | Default | Description                                                                                                                                                                                                                            |
| --- | --- | --- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `RAILS_ENV` | Yes | `development` | Rails environment. Use `production` in deployments.                                                                                                                                                                                    |
| `OPENSSL_PASS` | Yes | (sample value) | Passphrase used by `rake config:decrypt_files` to decrypt the bundled `*.enc` config files. Must be set before service start. The bundled `.enc` files are encrypted with the public sample passphrase, so treat their current contents as public. If you change this value, re-encrypt the config files first with `rake config:encrypt_files` — otherwise the service fails to boot. |
| `WEB_BRANCH_DEEPLINK` | Yes | `http://127.0.0.1` | Base URL embedded in outbound deep links.                                                                                                                                                                                              |
| `SERVER_HOST` | Yes | `http://127.0.0.1` | Public base URL of the backend.                                                                                                                                                                                                        |
| `RECORD_ENCRYPTION_KEY` | Yes | (empty) | Key for encrypting sensitive database fields such as CA digital-signature certificates (32 hex chars). The service refuses to boot when unset. Generate your own with `openssl rand -hex 16`. Keep it stable and backed up — changing or losing it makes previously encrypted records unreadable. |

## Storage

`STORAGE_SERVICE` selects the backend; only the matching credential block is required.

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `STORAGE_SERVICE` | Yes | `local` | One of `local`, `amazon`, `azure`. Matches a key in `config/storage.yml`. |
| `AWS_ACCESS_KEY_ID` | Conditional | (empty) | Required when `STORAGE_SERVICE=amazon`. |
| `AWS_SECRET_ACCESS_KEY` | Conditional | (empty) | Required when `STORAGE_SERVICE=amazon`. |
| `AWS_S3_REGION` | Conditional | (empty) | Required when `STORAGE_SERVICE=amazon`. |
| `AWS_S3_BUCKET` | Conditional | (empty) | Required when `STORAGE_SERVICE=amazon`. |
| `AZURE_STORAGE_ACCOUNT_NAME` | Conditional | (empty) | Required when `STORAGE_SERVICE=azure`. |
| `AZURE_STORAGE_ACCESS_KEY` | Conditional | (empty) | Required when `STORAGE_SERVICE=azure`. |
| `AZURE_STORAGE_CONTAINER` | Conditional | (empty) | Required when `STORAGE_SERVICE=azure`. |

## Encrypted Settings

`CRYPTO_*` password variables (e.g. `CRYPTO_DATABASE_PASSWORD`) hold values
encrypted with the RSA key pair below. Encrypt a plaintext password with
`rake config:encrypt_password[your_password]`. The key pair is auto-generated
at first boot if missing — see
[Secrets Generated at First Boot](#secrets-generated-at-first-boot) for how to
persist it across container rebuilds.

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `CRYPTO_PASSWORD_RSA_FOLDER` | No | `config/on_premise_rsa/password` | Folder holding the RSA key pair used for `CRYPTO_*` values. |
| `CRYPTO_PASSWORD_RSA_PRIVATE_KEY_FILE` | No | `private.pem` | Private key file name inside the RSA folder. |
| `CRYPTO_PASSWORD_RSA_PUBLIC_KEY_FILE` | No | `public.pem` | Public key file name inside the RSA folder. |

## Connection

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_HOST` | Yes | `postgres` | PostgreSQL host. |
| `DATABASE_PORT` | Yes | `5432` | PostgreSQL port. |
| `DATABASE_NAME` | Yes | `jackrabbit_server_development` | Database name. |
| `DATABASE_USERNAME` | Yes | `postgres` | Database user. |
| `DATABASE_PASSWORD` | Yes | (sample value) | Database password. Must match `POSTGRES_PASSWORD` in `docker-compose.yml` — change both together. Prefer `CRYPTO_DATABASE_PASSWORD` in production. |
| `CRYPTO_DATABASE_PASSWORD` | No | (empty) | Encrypted variant of `DATABASE_PASSWORD`. |
| `REDIS_PASSWORD` | No | (empty) | Redis password. Set one if Redis is reachable beyond the internal compose network; never expose port 6379 publicly without auth. |
| `CRYPTO_REDIS_PASSWORD` | No | (empty) | Encrypted variant of `REDIS_PASSWORD`. |
| `REDIS_HOST` | Yes | `redis` | Redis host. |

## Concurrency

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `PUMA_CONCURRENCY` | No | `2` | Puma workers. |
| `SIDEKIQ_CONCURRENCY` | No | `10` | Sidekiq worker concurrency. |
| `DATABASE_POOL` | No | `30` | ActiveRecord connection pool size. |
| `RAILS_MAX_THREADS` | No | `5` | Puma max threads per worker. |
| `RAILS_MIN_THREADS` | No | `5` | Puma min threads per worker. |

## Email

| Name | Required | Default                 | Description                                                                                                                                                              |
| --- | --- |-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MAIL_ENABLE` | No | `false`                 | Toggle outbound email globally.                                                                                                                                          |
| `MAIL_HOST` | Conditional | `mail_host`             | Hostname used in mailer server URL, or the host used by this project.  You can set host to the same value as SERVER_HOST, since this project includes the mailer server. |
| `MAIL_DELIVERY_METHOD` | Conditional | `smtp`                  | Delivery method (`smtp`, `ses`).                                                                                                                                         |
| `SMTP_HOST` | Conditional | (empty)                 | Required when `MAIL_DELIVERY_METHOD=smtp`.                                                                                                                               |
| `SMTP_PORT` | Conditional | (empty)                 | SMTP port.                                                                                                                                                               |
| `SMTP_DOMAIN` | Conditional | `gmail.com`             | SMTP HELO domain.                                                                                                                                                        |
| `SMTP_DEFAULT_SENDER` | Conditional | `kdan.sample@gmail.com` | Default From address.                                                                                                                                                    |
| `SMTP_DISPLAY_NAME` | Conditional | `Local_Test`            | Display name on outbound mail.                                                                                                                                           |
| `SMTP_USER` | Conditional | `kdan.sample@gmail.com` | SMTP auth user.                                                                                                                                                          |
| `SMTP_PASSWORD` | Conditional | (empty)                 | SMTP auth password. Prefer `CRYPTO_SMTP_PASSWORD`.                                                                                                                       |
| `CRYPTO_SMTP_PASSWORD` | No | (empty)                 | Encrypted variant.                                                                                                                                                       |
| `SMTP_AUTH` | Conditional | (empty)                 | Auth method (`plain`, `login`, `cram_md5`).                                                                                                                              |
| `SMTP_OPENSSL_VERIFY_MODE` | No | `none`                  | TLS verify mode (`none`, `peer`). Use `peer` in production — `none` skips certificate verification and exposes SMTP credentials to man-in-the-middle attacks.            |

## SMS

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `SMS_SERVICE_NAME` | No | `mitake` | SMS provider key. |
| `SMS_HOST` | No | `https://smsapi.mitake.com.tw` | SMS API host. |
| `SMS_PATH` | No | `/api/mtk/SmSend?CharsetURL=UTF8` | SMS API path. |
| `SMS_USER_NAME` | Conditional | `sms_user_name` | Required when SMS is used. |
| `SMS_PASSWORD` | Conditional | `sms_password` | Required when SMS is used. |

## Internal Mailer Paths

These map mailer events to internal API paths. Default values match
`backend.env.sample`; override only if you re-wire the mailer service.

| Name | Required | Default |
| --- | --- | --- |
| `CONFIRM_PATH` | No | `/api/internal/mailer/confirmation_instruction` |
| `WELCOME_PATH` | No | `/api/internal/mailer/first_time_welcome` |
| `GROUP_INVITE_PATH` | No | `/api/internal/mailer/group_invite` |
| `GROUP_CANCEL_PATH` | No | `/api/internal/mailer/group_cancel` |
| `SIGN_REQUEST_PATH` | No | `/api/internal/mailer/sign_request` |
| `SIGN_COMPLETE_PATH` | No | `/api/internal/mailer/sign_complete` |
| `KIOSK_COMPLETE_PATH` | No | `/api/internal/mailer/kiosk_complete` |
| `SIGN_DECLINE_PATH` | No | `/api/internal/mailer/sign_decline` |
| `DOC_BACKUP_PATH` | No | `/api/internal/mailer/doc_backup` |
| `FORGET_REMIND_PATH` | No | `/api/internal/mailer/forget_remind` |
| `EXPIRE_REMIND_PATH` | No | `/api/internal/mailer/expire_remind` |
| `EMAIL_VERIFY_PATH` | No | `/api/internal/mailer/signer_verify` |
| `VERIFY_METHOD_CHANGE_PATH` | No | `/api/internal/mailer/verify_method_change` |
| `DEADLINE_CHANGE_PATH` | No | `/api/internal/mailer/deadline_change` |
| `FORWARD_REQUEST_PATH` | No | `/api/internal/mailer/forward_request` |
| `TASK_UPDATE_PATH` | No | `/api/internal/mailer/task_update` |
| `TASK_DISABLE_PATH` | No | `/api/internal/mailer/task_disable` |
| `SIGNER_CA_FAIL_NOTIFY_PATH` | No | `/api/internal/mailer/signer_ca_fail_notify` |
| `SYSTEM_CA_FAIL_NOTIFY_PATH` | No | `/api/internal/mailer/ca_fail_notify` |
| `PUBLIC_FORM_COMPRESS_DOWNLOAD_MAIL_PATH` | No | `/api/internal/mailer/public_form_compress_download` |


## Initial Users & Auth

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `AUTH_HOST` | No | (empty) | External auth host, if delegated. |
| `AUTH_CLIENT_NAME` | No | (empty) | OAuth client display name. |
| `AUTH_CLIENT_ID` | Yes | (sample value) | OAuth client ID seeded at first boot. The sample value is publicly known — generate your own (e.g. `openssl rand -hex 32`) before any production deployment. |
| `AUTH_CLIENT_SECRET` | Yes | (sample value) | OAuth client secret. The sample value is publicly known — generate your own before any production deployment. |
| `MEMBER` | Yes | `default@sample.com` | Initial regular user email. |
| `MEMBER_PASSWORD` | Yes | `00000000` | Initial regular user password. Change before exposing the service. |
| `CRYPTO_MEMBER_PASSWORD` | No | (empty) | Encrypted variant of `MEMBER_PASSWORD`. |
| `JWT_SECRET` | Yes | (empty) | JWT signing secret. Must be set to a self-generated random value (e.g. `openssl rand -hex 32`). If left empty, the app falls back to a default that is publicly visible in this open-source codebase, allowing anyone to forge tokens. |
| `OTP_KEY` | Yes | (empty) | OTP derivation secret. Must be set to a self-generated random value (e.g. `openssl rand -hex 32`). Same risk as `JWT_SECRET` if left empty. |
| `SUPER_ADMIN` | Yes | `admin1@test.com,admin2@test.com` | Comma-separated initial super-admin emails. |
| `SUPER_ADMIN_PASSWORD` | Yes | `00000000` | Super-admin initial password. Change before exposing the service. |
| `CRYPTO_SUPER_ADMIN_PASSWORD` | No | (empty) | Encrypted variant. |
| `SIDEKIQ_USER_NAME` | Yes | `test` | Basic-auth user for the `/sidekiq` dashboard. Note: the bundled nginx routes `/sidekiq` publicly — change these credentials or restrict access before exposing the service. |
| `SIDEKIQ_PASSWORD` | Yes | `00000000` | Basic-auth password for `/sidekiq`. Change before exposing the service. |
| `CRYPTO_SIDEKIQ_PASSWORD` | No | (empty) | Encrypted variant. |

## Other

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `TZ` | No | `Asia/Taipei` | Container time zone. |

## LDAP

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `LEVERET_AUTH_LDAP_ENABLE` | No | `false` | Toggle LDAP integration via `leveret_auth`. |
| `LEVERET_AUTH_LDAP_FILE_PATH` | Conditional | (empty) | Path to LDAP YAML config when LDAP is enabled. |

## Group

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `GROUP_USE` | No | `true` | Enable group features. |
| `GROUP_TEMPLATE_SHARE_ENABLE` | No | `true` | Allow template sharing within a group. |

## Callback

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `CALLBACK_HOST` | No | `http://127.0.0.1` | Base URL for outbound callbacks. |
| `CALLBACK_ENABLE_TASK_COMPLETED` | No | `false` | Enable `task.completed` callback. |
| `CALLBACK_ENABLE_ENVELOPE_COMPLETED` | No | `false` | Enable `envelope.completed` callback. |
| `CALLBACK_ENABLE_STAGE_DONE` | No | `false` | Enable `stage.done` callback. |
| `TASK_COMPLETED_PATH` | No | `/callback/task` | Path appended to `CALLBACK_HOST`. |
| `ENVELOPE_COMPLETED_PATH` | No | `/callback/envelope` | Path appended to `CALLBACK_HOST`. |
| `STAGE_DONE_PATH` | No | `/callback/stage` | Path appended to `CALLBACK_HOST`. |
| `COMPRESS_SIGNATURE_PHOTO_FILE` | No | `false` | Compress signature photo before callback. |
| `COMPRESS_SIGNATURE_STROKE_FILE` | No | `false` | Compress signature stroke file before callback. |
| `COMPRESS_SIGNATURE_VIDEO_FILE` | No | `false` | Compress signature video file before callback. |

## SignTask

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `WITH_SIGN_URL_ENABLE` | No | `true` | Include sign URL in task payload. |

## KMPDF

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `FONT_FOLDER_ENABLE` | No | `false` | Use custom font folder when rendering PDFs. |
| `CUSTOM_FONT_NAME` | Conditional | (empty) | Required when `FONT_FOLDER_ENABLE=true`. |
| `CUSTOM_FONT_PATH` | Conditional | (empty) | Required when `FONT_FOLDER_ENABLE=true`. |

## Frontend Environment (frontend.env)

Variables consumed by the frontend service, provided via the top-level
`frontend.env` file (copy `frontend.env.sample`). `AUTH_CLIENT_ID` /
`AUTH_CLIENT_SECRET` must be identical to the values in `backend.env` —
change both files together.

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_HOST` | No | (empty) | Base URL the browser uses to reach the API. Leave empty to use the same origin as the site (recommended behind the bundled nginx). Baked into the client bundle at image build time — pass it as a build argument (`NEXT_PUBLIC_API_HOST=... docker compose build`); setting it in `frontend.env` only affects the server side. |
| `BACKEND_HOST` | Yes | `http://on_premise_backend:3000` | Internal URL the frontend server uses to reach the backend container. Matches the compose service name. |
| `AUTH_CLIENT_ID` | Yes | (sample value) | OAuth client ID. Must equal `AUTH_CLIENT_ID` in `backend.env`. The sample value is publicly known — replace before production. |
| `AUTH_CLIENT_SECRET` | Yes | (sample value) | OAuth client secret. Must equal `AUTH_CLIENT_SECRET` in `backend.env`. Replace before production. |
