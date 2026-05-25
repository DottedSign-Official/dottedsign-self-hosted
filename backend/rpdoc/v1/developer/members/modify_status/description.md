# Description

Change Member Status

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |

# Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| email | `String` | `X` | Member Email |
| status | `String` | `X` | What status you want to view: `active`, `inactive`. |

# Response

Return status `200` and data: ok.
