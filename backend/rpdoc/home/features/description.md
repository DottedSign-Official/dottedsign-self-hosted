# Description

Get Feature Stat.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Request body
None.

# Response
| Parameter | Type | Nullable? | Description |
| --------- | --- | ------- | ----------- |
| developer_console | `Boolean` | `X` | If member can access developer console, it will be `true`, otherwise `false`. |
| group_enable | `Boolean` | `X` | If project enable group feature, it will be `true`, otherwise `false`. |
