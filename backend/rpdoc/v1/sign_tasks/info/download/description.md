# Description

To download the task pdf file.

If the task is completed, the link is for downloading completed pdf file, else is for downloading the original pdf file.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Query Parameters

Query Parameters extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |
| **sign_task_id** | `Integer` | `O` | {{sign_task_id}} |

# Response

Return status `200` and direct downloading pdf file.
