# Description

To list the member's

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Authorization | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| search_email | `String` | `X` | Search Email |
| search_group_name | `String` | `X` | Search group name |
| filter_none_group | `Boolean` | `X` | If you want filter not join group members, set the value to `true` |
| filter_status | `String` | `X` | What status you want to view: `active`, `inactive`. |
| page | `Integer` | `X` | Which pages you want to search, default is `1`. |
| per_page | `Integer` | `X` | Numbers of task showing per_page, default is `10`. |

# Response

| Property Name | Value | Description |
| --- | --- |  --- |
| members | `Array of` [Member Object](#member-object)` | Members object |
| current_page | `Integer` | Current page number. |
| total_pages | `Integer` |  Total pages. |


## Member Object

| Property Name | Value | Description |
| --- | --- |  --- |
| id | `Integer` | Member ID. |
| email | `String` | Member Email. |
| profile | `Object of` [Profile Object](#profile-object)` | Member Profile. |

## Profile Object

| Property Name | Value | Description |
| --- | --- |  --- |
| language | `String` | Member Language. |
| full_name | `String` | Member Full Name. |
| first_name | `String` | Member First Name. |
| telephone | `String` | Member Telephone. |
| nationality | `String` | Member Nationality. |
| address | `String` | Member Address. |
| organization | `String` | Member Organization. |
