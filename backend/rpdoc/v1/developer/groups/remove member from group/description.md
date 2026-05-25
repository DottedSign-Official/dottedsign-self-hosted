# Description

This API can remove member from group.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| assignee_email | `String` | `O` | Assign member email |
| group_id | `Integer` | `O` | Group id. |

# Response

Return status `200` and data: ok.
