# Description

To obtain the task share link.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | {{sign_task_id}} |

# Response

Return status `200` and data: `share_link` url.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **share_link** | `String` | `X` | share link url. |
