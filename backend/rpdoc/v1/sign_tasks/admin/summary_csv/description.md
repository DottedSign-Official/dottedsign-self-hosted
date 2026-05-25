# Description

Export Group Tasks Report CSV.

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |
| **emails** | `X` | `Array of String` | Group Member Email. |
| **start_from** | `O` | `Integer` | Group Member Task Report Start From Timestamp. |
| **end_at** | `O` | `Integer` | Group Member Task Report End At Timestamp. |
| **zone** | `O` | `Integer` | Group Member Task Report Timezone. |

# Response Header

| **Content-Type** | text/csv |

# Response

CSV file content.

# CSV Heads
[`Date`, `Created Tasks`, `Completed Tasks`]
