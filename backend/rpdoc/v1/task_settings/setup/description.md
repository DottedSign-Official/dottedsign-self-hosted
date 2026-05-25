# Description

Setup the task setting.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

Request body extends [TaskSetting Request Object](#tasksetting-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | sign task id, which task needs to be setting. |

# Response

Return status `200` and `task_setting` inside data.

# task_setting object

See [TaskSetting Object](#tasksetting-object).
