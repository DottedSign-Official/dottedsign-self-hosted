# Description

Resend the one-time password again via email or mobile SMS message.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body
Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |
| **sign_task_id** | `Integer` | `O` | {{sign_task_id}}. |
| **uuid** | `String` | `O` | {{uuid}}, which response at the **`PUT`** **Sign the Task API**. |
| **signer_email** | `String` | `O` | {{signer_email}}. |

# Response

Array of [VerifyInfo Object](#verifyinfo-object)

# VerifyInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | --- | ------- | ----------- |
| **verify_type** | `String` | `X` | `email` or `phone`. |
| **verify_source** | `String` | `X` | Signer email. |
| **uuid** | `String` | `X` | Put the uuid into the **`PUT`** **Sign the Task API** request body. |
