# Description

To delete the draft task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Path Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | {{sign_task_id}} |

# Request Body

See [Client Request Object](#client-request-object).

# Response

Return status `200` and data: ok.
