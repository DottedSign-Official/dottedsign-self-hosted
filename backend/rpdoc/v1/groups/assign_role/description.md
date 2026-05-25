# Description

Assign Roles to Group Members.

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |
| **email** | `O` | `String` | Assigned Member Email. |
| **roles** | `O` | `Array of String` | Array of assigned roles. |

# Response

Array of Roles after assign.
