# Description

Decline the task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request body

Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **code** | `X` | `String` | JWT code. Require if quick sign. |
| **sign_task_id** | `O` | `Integer` | SignTask ID. |
| **decline_reason_id** | `X` | `Integer` | DeclineReason ID. |
| **reason** | `X` | `String` | The message for why decline task. |
| **reply_to** | `X` | `Array` | Reply to some one. |
| **work_id** | `X` | `String` | require work_id if quick signer |

# Response
See [SignTask Object](#signtask-object).
