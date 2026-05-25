# Description

Delete a member's signature.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Path Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **id** | `Integer` | `O` | {{signature_id}} |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization**) header need to access this API. |

# Response

Return status `200` and `{data: "ok"}`.
