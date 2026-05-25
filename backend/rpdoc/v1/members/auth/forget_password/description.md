# Description

If the member forget password, send forget password mail with this api.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **email** | `String` | `O` | {{email}} |

# Response

Return status `200` and `{data: "ok"}`.
