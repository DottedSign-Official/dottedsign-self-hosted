# Description
Get group decline reasons

`system_reserved`: `false`


# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |


# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |


# Response Body

`Array of` [DeclineReason Object](#declinereason-object).
