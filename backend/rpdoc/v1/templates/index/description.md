# Description

List templates that the member can use.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **search_tags** | `Array` | `X` | Tag Filter. |
| **terms** | `String` | `X` | Search Template Name. |
| **page** | `Integer` | `X` | Page Number, default is 1. |
| **per_page** | `Integer` | `X` | Template Number Per Page, default is 10. |

# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **templates** | `Array of` [Template Basic Object](#template-basic-object) | `X` | Template Basic Object. |
| **share_count** | `Integer` | `X` | How many templates are share to others. |
| **total_count** | `Integer` | `X` | How many templates related to member. |
| **current_page** | `Integer` | `X` | Current page number. |
| **total_pages** | `Integer` | `X` | Total pages. |
