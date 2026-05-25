# Description

If you are a developer, this API cna update groups.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |


# Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| group_name | `String` | `O` | Group Name. |
| group_id | `Integer` | `O` | Group id. |


# Response

Return status `200` and data: ok.
