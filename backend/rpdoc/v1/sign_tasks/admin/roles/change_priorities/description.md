# Description

Change Group Role Priorities

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `Integer` | `O` | Group ID. |
| **role_ids** | `Array of Integer` | `O` | The all of roles id order by the priority tou want to change |