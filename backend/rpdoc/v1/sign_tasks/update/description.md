# Description

Update the draft task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

[SignTask Request Object](#signtask-request-object) extends wit [Client Request Object](#client-request-object).

# Response

Return status `200` and data: `task_object`.

# task_object

See [SignTask Object](#signtask-object).
