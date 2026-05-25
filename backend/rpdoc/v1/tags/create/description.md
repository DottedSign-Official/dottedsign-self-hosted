# Description

Create a new tag for template classification.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **new_tag** | `String` | `O` | Tag Name |

# Response
Array of tags(`String`).
