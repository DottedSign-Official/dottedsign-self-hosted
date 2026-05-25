# Description

Reset member password.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **confirmation_token** | `String` | `O` | Confirm Token. |

# Response

Return status `200` and `{data: "ok"}`.
