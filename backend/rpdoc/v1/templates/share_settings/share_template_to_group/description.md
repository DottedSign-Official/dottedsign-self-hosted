# Description

If you are a group admin, you can share the template with other groups, but the license must have the group share.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| template_id | `Integer` | `O` | Template ID. |
| group_ids | `Array of Integer` | `O` | Group IDs. |

# Response

Return status `200` and data: ok.
