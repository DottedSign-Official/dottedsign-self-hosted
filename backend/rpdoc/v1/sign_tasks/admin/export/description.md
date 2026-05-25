# Description

Export Group Tasks CSV.

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |
| **category** | `O` | `String` | Task List Category. Includuing `waiting_for_group`, `waiting_for_other_groups`, `group_completed`, `group_canceled`, `group_draft`. |
| **start_from** | `O` | `Integer` | Task List Start From Timestamp. |
| **end_at** | `O` | `Integer` | Task List End At Timestamp. |

# Response Header

| **Content-Type** | text/csv |

# Response

CSV file content.

* CSV Heads
[`Task ID`, `Task Name`, `Sender's Name`, `Sender's Email`, `Created Time`, `Task Status`, `Last Modified Time`]
