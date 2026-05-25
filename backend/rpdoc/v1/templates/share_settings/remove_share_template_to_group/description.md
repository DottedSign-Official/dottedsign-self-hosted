# Description

If you are a group admin, you can remove the template that is shared by other groups.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| template_id | `Integer` | `O` | Template ID. |
| group_id | `Integer` | `O` | Group ID. |

# Response

Return status `200` and data: ok.
