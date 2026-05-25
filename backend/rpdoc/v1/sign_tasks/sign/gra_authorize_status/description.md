# Description

Get gra authorize status by sign stage id

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| sign_stage_id | `Integer` | `O` | sign stage id |

# Response

| Parameters | Value | Description |
| --- | --- | --- |
| status| `string` | Status of the gra authorize |
