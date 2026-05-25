# Description

Obtain the member's timeline in date range. From the perspective of the `event` timeline, not the sign task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Query Parameters

| Property Name | Value | Required? | Description |
| --- | --- | --- | --- |
| **start_from** | `Date` | `X` | `yyyy-mm-dd`. Date range start. If give the `start_from`, you must give the `end_at`, too. |
| **end_at** | `Date` | `X` | `yyyy-mm-dd`. Date range end. If give the `end_at`, you must give the `start_from`, too. |
| **show_delete** | `Boolean` | `X` | Show deleted task records. Default is `false`. |
| **page** | `Integer` | `X` | Which page. Default is `1`. |
| **per_page** | `Integer` | `X` | How many rows in a page. Default is `10`. |

# Response

Return status `200` and `timelines` Array inside data.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **timelines** | `Array` | `X` | Array of task event timeline [Timelines Object](#timelines-object). |
| **current_page** | `Integer` | `X` | current page. |
| **total_pages** | `Integer` | `X` | total pages. |

# Timelines Object

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **file_status** | `String` | `X` | file status. `waiting_for_others`, `waiting_for_me`, `draft` |
| **action_name** | `String` | `X` | `sent`, `created` or `signed` |
| **role** | `String` | `X` | Singer's name or Me |
| **file_name** | `String` | `X` | Task Name |
| **sign_task_id** | `Integer` | `X` | Task ID |
| **task_deleted** | `Boolean` | `X` | Task is deleted or not. |
| **task_expired** | `Boolean` | `X` | Task is expired or not. |
| **created_at** | `Integer` | `X` | When the server created the member. (Time integer format) |
| **thumbnail** | `Object` | `O` | thumbnail url of task, include two key: original, completed. If thumbnail created failed, the key value will be `null`. |
