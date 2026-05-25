# Description

To filter sign task list.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **category** | `String` | `O` | What category you want to view: `waiting_for_me`, `waiting_for_others`. |
| **filter** | `String` | `O` | What filter you want to use: `expire_soon`, `expired`. |
| **page** | `Integer` | `X` | Which pages you want to search, default is `1`. |
| **per_page** | `Integer` | `X` | Numbers of task showing per_page, default is `10`. |

# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **tasks** | `Array of` [SignTask Object](#signtask-object) | `X` | SignTask Object. |
| **summary** | [Filter Summary Object](#filter-summary-object) | `X` | Filter Summary Object. |
| **current_page** | `Integer` | `X` | Current page number. |
| **total_pages** | `Integer` | `X` | Total pages. |


