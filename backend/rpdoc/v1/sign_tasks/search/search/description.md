# Description

To search the sign task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **target** | `String` | `X` | Search Target: `document` or `recipient`. |
| **terms** | `String` | `X` | Target terms. |
| **start_from** | `Date` | `X` | start form date. ex: `2021-01-01`. |
| **end_at** | `Date` | `X` | end at date. ex: `2021-02-20`. |
| **page** | `Integer` | `X` | Which pages you want to search, default is `1`. |
| **per_page** | `Integer` | `X` | Numbers of task showing per_page, default is `10`. |

# Response

Return status `200` and data: `task_list_object`.

# task_list_object

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **tasks** | `Array of` [SignTask Object](#signtask-object) | `X` | SignTask Object. |
| **total_count** | `Integer` | `X` | Total task amount. |
| **current_page** | `Integer` | `X` | Current page number. |
| **total_pages** | `Integer` | `X` | Total pages. |
