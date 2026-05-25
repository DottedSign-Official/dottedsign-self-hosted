# Description

If the member still not receive his confirm email , you can use this api to send it again.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **email** | `String` | `O` | {{email}} |

# Response

Return status `200` and `{data: "ok"}`.
