# Description

To resend the sign request mail to the signer.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |
| **sign_task_id** | `Integer` | `O` | SignTask ID. |
| **email** | `String` | `O` | Signer's email. |

# Response

Return status `200` and `data: {email: sending_email}`.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **email** | `String` | `X` | signer email |

JackRabbit-Server will send the sign request mail later.
