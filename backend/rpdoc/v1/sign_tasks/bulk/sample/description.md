# Description

To download the bulk sample CSV file.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Path Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **template_id** | `Integer` | `O` | Template ID which you want to use at bulk send. |

# Response

Return status `200` and direct downloading the sample CSV file.
