# Description

Get Group Tasks Report.

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

# Response

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **sent_trend** | `Array of` [SentTrend Object](#senttrend-object) | `X` | SentTrend Object. |
| **completed_trend** | `Array of` [CompletedTrend Object](#completedtrend-object) | `X` | CompletedTrend Object. |
| **sent** | `Integer` | `X` | Total Sent Count of Group Task. |
| **waiting** | `Integer` | `X` | Total Waiting Count of Group Task. |
| **completed** | `Integer` | `X` | Total Completed Count of Group Task. |
| **complete_rate** | `String` | `X` | Complete Rate of Group Task. |
| **cancel_rate** | `String` | `X` | Cancel Rate of Group Task. |
| **spent_time_avg** | `Float` | `X` | Average Sent Time of complete a Group Task. |

# SentTrend Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **date** | `String` | `X` | Date. Format `yyyy-mm-dd` |
| **count** | `Integer` | `X` | Daily Task Sent Count. |

# CompletedTrend Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **date** | `String` | `X` | Date. Format `yyyy-mm-dd` |
| **count** | `Integer` | `X` | Daily Task Completed Count. |
