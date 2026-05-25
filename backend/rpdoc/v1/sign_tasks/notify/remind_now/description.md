# Description

To send sign remind mail to the signer.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | SignTask ID. |
| **email** | `String` | `O` | Signer's email. |

# Response

Return status `200` and `data: {reminded_emails: [sending_email_1, sending_email_2, ...]}`.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **reminded_emails** | `Array of String` | `X` | Email array of reminded signers. |

JackRabbit-Server will send the sign remind mail later.
