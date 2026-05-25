# Description

To change the task's signer.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Type | Required? | Description |
| --- | --- | --- | --- |
| **sign_stage_id** | `Integer` | `O` | Which sign stage signer you want to change. |
| **new_signer** | [NewSigner Request Object](#newsigner-request-object) | `O` | NewSigner Request Object. |
| **client** | `String` | `O` | `web` or `app` |

# NewSigner Request Object
| Parameters | Type | Required | Description |
| --- | --- | --- | --- |
| name | `String` | `O` | New signer's name. |
| email | `String` | `O` | New signer's email. |
| lang | `String` | `O` | New signer's lang. |
# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `X` | Sign task ID. |

# NewSigner Request Object
| Parameters | Type | Required | Description |
| --- | --- | --- | --- |
| name | `String` | `O` | New signer's name. |
| email | `String` | `O` | New signer's email. |
| phone | `String` | `O` | New signer's phone number. |