# Description

To read a kiosk task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body
Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | SignTask ID. |
| **signer_info** | [SignerInfo Request Object](#signerinfo-request-object) | `O` | SignerInfo Request Object. |

# SignerInfo Request Object

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **name** | `String` | `X` | Kiosk Signer Name. Required if related stage requisite of name is true. |
| **email** | `String` | `X` | Kiosk Signer Email. Required if related stage requisite of email is true. |
| **phone** | `String` | `X` | Kiosk Signer Phone. Required if related stage requisite of phone is true. |

# Response

Response body extends [SignTask Object](#signtask-object), and it contains additional info belows.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **download_link** | `String` | `X` | The pdf download url, if the task is completed, it will be `completed pdf`; else it will be `original pdf`. |
| **access_info** | [Task Access Object](#task-access-object) | `X` | Task Access Object. |
