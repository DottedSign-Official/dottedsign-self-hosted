# Description

This API can assign member to group.

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
| role | `String` | `O` | Group role. |

# Response

Return status `200` and data: ok.
