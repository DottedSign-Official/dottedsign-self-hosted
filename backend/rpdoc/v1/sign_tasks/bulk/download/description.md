# Description

To download the bulk mission completed file.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **mission_uuid** | `String` | `O` | Mission uuid. |

# Response

Return status `200` and direct downloading mission compress zip file.

Zip file only including completed file.
