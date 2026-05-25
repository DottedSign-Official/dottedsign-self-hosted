# Description

Obtain the member's signatures (signature/stamp).

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **category** | `String` | `X` | `stamp`, `signature`, if nil, return all category. |

# Response

Array of [Signature Object](#signature-object).
