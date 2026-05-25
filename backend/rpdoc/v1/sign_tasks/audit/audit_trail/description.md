# Description

To obtain the sudit trial infomation.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Request body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | Sign Task ID. |

# Response body

Response body extends [SignTask Object](#signtask-object), and it contains additional info belows.

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **audit_trial** | `Array of` [Audit Trail Object](#audit-trail-object) | `X` | Audit trail object. |

# Audit Trail Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **event_date** | `String` | `X` | Sign event date. |
| **event_time** | `String` | `X` | Sign event time.
| **action_name** | `String` | `X` | What action do at the task.. |
| **role** | `String` | `X` | Who do this action. |
| **ip_address** | `String` | `X` | IP address.|
| **device** | `String` | `X` | The device of the person who executes the action.|
| **sign_mode** | `String` | `X` | Sign mode. |
