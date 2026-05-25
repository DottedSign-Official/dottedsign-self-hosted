# Description

This API can change member role in group.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| assignee_email | `String` | `O` | Assign member email |
| roles | `Array in String` | `O` | roles |

# Response

Return status `200` and data: ok.
