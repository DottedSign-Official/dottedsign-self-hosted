# Description

To show the sign task detail.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Path Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `X` | {{sign_task_id}}, **required if code is** **`nil`**. |

# Query Parameters

See [Client Request Object](#client-request-object).

# Response

See [SignTask Object](#signtask-object).
