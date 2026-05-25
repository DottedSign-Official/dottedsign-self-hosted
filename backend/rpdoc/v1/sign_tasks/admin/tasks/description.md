# Description

Get Group Tasks List.

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Query Params

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |
| **category** | `O` | `String` | Task List Category. Includuing `waiting_for_group`, `waiting_for_other_groups`, `group_completed`, `group_canceled`, `group_draft`. |
| **emails\[\]** | `X` | `String` | Member Emails. |
| **start_from** | `O` | `Integer` | Task List Start From Timestamp. |
| **end_at** | `O` | `Integer` | Task List End At Timestamp. |
| **page** | `X` | `Integer` | Task List Page. Default `1`. |

# Response

Array of [SignTask Object](#signtask-object)
