# Description

Get Group Member Tasks Report.

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

# Response

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **sent_summary** | `Array of` [MemberSentSummary Object](#membersentsummary-object) | `X` | MemberSentSummary Object. |
| **complete_summary** | `Array of` [MemberCompleteSummary Object](#membercompletesummary-object) | `X` | MemberCompleteSummary Object. |
| **sent_time_avg_summary** | `Array of` [MemberSentTimeSummary Object](#membersenttimesummary-object) | `X` | MemberSentTimeSummary Object. |

# MemberSentSummary Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **waiting** | `Integer` | `X` | Waiting Task Count of Member. |
| **total** | `Integer` | `X` | Total Task Count of Member. |
| **completed** | `Integer` | `X` | Completed Task Count of Member. |
| **member** | [Member Object](#member-object) | `X` | Member Info. |

# MemberCompleteSummary Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **completed** | `Integer` | `X` | Completed Task Count of Member. |
| **member** | [Member Object](#member-object) | `X` | Member Info. |

# MemberSentTimeSummary Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **spent_time_avg** | `Float` | `X` | Average Spent Time to complete task of Member. |
| **member** | [Member Object](#member-object) | `X` | Member Info. |

# Member Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **name** | `String` | `X` | Member Name. |
| **email** | `String` | `X` | Member Email. |
| **group inactive** | `Boolean` | `X` | Member Group is inacitve or not. |
| **display_name** | `String` | `X` | Member Display Name. |
