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

# Response

# Response Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **roles** | `Array of` [Role Response Object](#role-response-object) | `X` | Group Roles. |
