# Description

Rename a tag.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **old_tag** | `String` | `O` | Original Tag Name |
| **new_tag** | `String` | `O` | Update Tag Name |

# Response

Return status `200` and data: [tag_list_object](#tag_list_object).

# tag_list_object

Array of tags(`String`).
