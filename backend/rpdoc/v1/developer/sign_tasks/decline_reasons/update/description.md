# Description
update system reserved decline reason

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **decline_reason_id** | `O` | `Integer` | DeclineReason ID. |
| **content** | `O` | `String` | DeclineReason content. |

# Response Body

See [DeclineReason Object](#declinereason-object).
