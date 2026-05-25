# Description

Generate shorten link

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Request Parameters

| Parameters | Type | Required | Description |
| ---| ---  | --- | --- |
| **will_expired** | `Boolean` | X | Setting 'false' for the link will make it not expire. The default value is 'true' |

# Response

| Property Name | Value | Description |
| --- | --- | --- |
| **shore_link** | `String` | shore link. |
