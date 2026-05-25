# Description

To rollback the stage of task.

### Quick Sign

with code

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Type | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |
| **sign_task_id** | `Integer` | `X` | If signer is member, member required sign_task_id|
| **stage_id** | `Integer` | `X` | If signer is member, member required stage_id|

# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **data** | `String` | `X` | ok. If status 200|
