# Description

Obtain Group Role List

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `Integer` | `O` | Group ID. |
| **name** | `String` | `O` | Role name. |
| **permission** | [Permission Object](#permission-object) | `O` | Role Permission. |

# Response

* Response Object

[Role Response Object](#role-response-object)
