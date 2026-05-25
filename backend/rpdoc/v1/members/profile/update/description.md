# Description

Update the member's profile.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Property Name | Value | Required? | Description |
| --- | --- | --- | --- |
| **email** | `String` | `X` | Member's email. |
| **full_name** | `String` | `X` | Member's full name. |
| **first_name** | `String` | `X` | Member's first name. |
| **telephone** | `String` | `X` | Member's telephone. |
| **nationality** | `String` | `X` | Member's nationality. |
| **address** | `String` | `X` | Member's address. |
| **organization** | `String` | `X` | Member's organization. |

# Response

See [Member Profile Object](#member-profile-object).
