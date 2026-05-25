# Description

Change member password.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **old_password** | `String` | `O` | Old Password. |
| **password** | `String` | `O` | New Password. |
| **password_confirmation** | `String` | `O` | New Password. |

# Response

Return status `200` and `{data: "ok"}`.
