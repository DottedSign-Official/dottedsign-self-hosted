# Description

Sort the template tag order.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **external_member_id** | `Integer` | `O` | Member ID. |
| **move_tag** | `String` | `O` | The Tag which will be moved to other place.
| **behind_tag** | `String` | `X` | Move tag will be moved behind this tag. If not provide this parameter, Move tag will become first order.

# Response

Array of tags(`String`).
