# Description

Display a list of all groups, but the member must be a group admin to access this API.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| search_group_name | `String` | `X` | Perform a fuzzy search for similar names.|
| page | `Integer` | `X` | Page Number, default is 1. |
| per_page | `Integer` | `X` | Template Number Per Page, default is 10. |

# Response

| Property Name | Value |  Description |
| --- | --- | --- |
| groups | `Array of` [Groups Object](#Groups-object)  | Template Basic Object. |
| total_count | `Integer` | How many templates related to member. |
| current_page | `Integer` | Current page number. |
| total_pages | `Integer` | Total pages. |

## Groups Object

| Property Name | Value |  Description |
| --- | --- | ---  |
| group_id | `Integer`  | Group ID. |
| name | `String`  | Group Name. |

