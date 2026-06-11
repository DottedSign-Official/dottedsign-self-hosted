[English](../README.md) | [繁體中文](../README.zh-TW.md)

# Configuration Reference

This document lists every environment variable consumed by JackRabbit Server.
Variables are grouped by purpose, matching the section headers in
`backend.env.sample`. Defaults reflect the values in that sample file unless
noted otherwise.

## Table of Contents

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

## Backend Environment

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `RAILS_ENV` | Yes | `development` | Rails environment. Use `production` in deployments. |
| `OPENSSL_PASS` | Yes | (sample value) | Master pass for decrypting `CRYPTO_*` fields via `rake config:decrypt_files`. Must be set before service start. |
| `WEB_BRANCH_DEEPLINK` | Yes | `http://127.0.0.1` | Base URL embedded in outbound deep links. |
| `SERVER_HOST` | Yes | `http://127.0.0.1` | Public base URL of the backend. |

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

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `CRYPTO_PASSWORD_RSA_FOLDER` | No | (empty) | Encrypted RSA folder location. Decrypted at boot. |
| `CRYPTO_PASSWORD_RSA_PRIVATE_KEY` | No | (empty) | Encrypted RSA private key. |
| `CRYPTO_PASSWORD_RSA_PUBLIC_KEY` | No | (empty) | Encrypted RSA public key. |

## Connection

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_HOST` | Yes | `postgres` | PostgreSQL host. |
| `DATABASE_PORT` | Yes | `5432` | PostgreSQL port. |
| `DATABASE_NAME` | Yes | `jackrabbit_server_development` | Database name. |
| `DATABASE_USERNAME` | Yes | `postgres` | Database user. |
| `DATABASE_PASSWORD` | Yes | (sample value) | Database password. Prefer `CRYPTO_DATABASE_PASSWORD` in production. |
| `CRYPTO_DATABASE_PASSWORD` | No | (empty) | Encrypted variant of `DATABASE_PASSWORD`. |
| `REDIS_PASSWORD` | No | (empty) | Redis password. |
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
| `SMTP_OPENSSL_VERIFY_MODE` | No | `none`                  | TLS verify mode (`none`, `peer`).                                                                                                                                        |

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
| `AUTH_CLIENT_ID` | Yes | (sample value) | OAuth client ID seeded at first boot. Replace before exposing the service. |
| `AUTH_CLIENT_SECRET` | Yes | (sample value) | OAuth client secret. Replace before exposing the service. |
| `MEMBER` | Yes | `default@sample.com` | Initial regular user email. |
| `MEMBER_PASSWORD` | Yes | `00000000` | Initial regular user password. Change before exposing the service. |
| `CRYPTO_MEMBER_PASSWORD` | No | (empty) | Encrypted variant of `MEMBER_PASSWORD`. |
| `JWT_SECRET` | Yes | (empty) | JWT signing secret. Must be set. |
| `OTP_KEY` | Yes | (empty) | OTP secret. Must be set. |
| `SUPER_ADMIN` | Yes | `admin1@test.com,admin2@test.com` | Comma-separated initial super-admin emails. |
| `SUPER_ADMIN_PASSWORD` | Yes | `00000000` | Super-admin initial password. Change before exposing the service. |
| `CRYPTO_SUPER_ADMIN_PASSWORD` | No | (empty) | Encrypted variant. |
| `SIDEKIQ_USER_NAME` | Yes | `jackrabbit` | Basic-auth user for `/sidekiq`. |
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
