# Description

Show all templates that shared to others.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| filter_type | `String` | `X` | You can filter by different type and whether the template is self-shared or not. Filter Type: `self` or `other`. |
| page | `Integer` | `X` | Page Number, default is 1. |
| per_page | `Integer` | `X` | Template Number Per Page, default is 10. |

# Response

| Property Name | Value |  Description |
| --- | --- | --- |
| shares | `Array of` [Shares Object](#shares-object)  | Template Basic Object. |
| total_count | `Integer` | How many templates related to member. |
| current_page | `Integer` | Current page number. |
| total_pages | `Integer` | Total pages. |

## Shares Object

| Property Name | Value |  Description |
| --- | --- | ---  |
| template_id | `Integer`  | Template ID. |
| name | `String`  | Template Name. |
| code | `String`  | Template Code. |
| self_group_share | `Boolean`  | Whether it is shared within your own group.|
| share_groups | `Array of` [Shares Groups Object](#shares-groups-object)   | Which groups it is currently shared with. |

## Shares Groups Object

| Property Name | Value |  Description |
| --- | --- | ---  |
| group_id | `Integer`  | Group ID. |
| name | `String`  | Group Name. |

