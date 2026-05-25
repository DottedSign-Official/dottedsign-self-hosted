# Description

Upload Member Avatar.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |
| Content-Type | `multipart/form-data` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **avatar** | `File` | `O` | Member Avatar File. |

# Response

Return status `200` and `{data: "ok"}`.
