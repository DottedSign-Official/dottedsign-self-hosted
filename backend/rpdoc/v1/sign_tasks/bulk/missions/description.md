# Description

To list the member's bulk mission.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Path Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **page** | `Integer` | `X` | Which pages you want to search, default is `1`. |
| **per_page** | `Integer` | `X` | Numbers of task showing per_page, default is `10`. |

# Response

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **missions** | `Array of` [BulkMission Object](#bulkmission-object) | `X` | Mission object. |
| **current_page** | `Integer` | `X` | Current page number. |
| **total_pages** | `Integer` | `X` | Total pages. |

