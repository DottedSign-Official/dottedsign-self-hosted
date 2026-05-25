# Description

Obtain the members contact list for quick manage task signers.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Query Parameters

None.

# Response

Return status `200` and `contact list` **array** inside data.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **email** | `String` | `X` | Contact email. |
| **name** | `String` | `X` | Contact name. |
| **phone** | `String` | `O` | Contact phone. |
