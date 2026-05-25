# Description
create group decline reason

`system_reserved`: `false`

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |


# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |
| **content** | `O` | `String` | DeclineReason content. |

# Response Body

See [DeclineReason Object](#declinereason-object).
