# Description

List task detail

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `O` | `Integer` | SignTask ID.  |

# Response

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **id** | `Integer` | `X` | Task ID. |
| **owner** | `String` | `X` | Task owner name. |
| **file_name** | `String` | `X` | Task file name. |
| **sign_has_order** | `Boolean` | `X` | Signers should sign sequentially if it is `true`. |
| **sign_type** | `String` | `X` | Including `sign_and_send`, `create_and_invite` |
| **created_at** | `Integer` | `X` | Task created timestamp. |
| **status** | `String` | `X` | Including `draft`, `waiting`, `completed`, `declined`, `expired`, and `deleted` |
| **sign_stages_count** | `Integer` | `X` | Stages count of Task. |
| **sign_stage** | `Array of` [SignStage HealthCheck Object](#signstage-health-check-object) | `X` | SignStage HealthCheck Object. |
| **sign_event** | `Array of` [SignEvent HealthCheck Object](#signevent-health-check-object) | `X` | SignEvent HealthCheck Object |

# SignStage Health Check Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **id** | `Integer` | `X` | Stage ID. |
| **email** | `String` | `X` | Stage Email. |
| **sequence** | `Integer` | `X` | Stage Sequence. |
| **status** | `String` | `X` | Stage Staus. Including `initial`, `processing`, `done`, `declined`, `canceled` |
| **attachment_setting** | `Array of` [SignStage AttachmentSetting Object](#signstage-attachmentsetting-object) | `O` | SignStage Attachment Object. |
| **uploaded_attachment** | `Array of String` | `O` | Uploaded Attachments Labels. |
| **stage_setting** | [StageSetting Object](#stagesetting-object) | `X` | StageSetting Object. |
| **forward_logs** | `Array of` [ForwardLog Object](#forwardlog-object) | `X` | ForwardLog Object. |
| **decline_log** | [DeclineLog Object](#declinelog-object) | `X` | DeclineLog Object. |
| **field_types** | [FieldType HealthCheck Object](#fieldtype-healthcheck-object) | `X` | FieldType HealthCheck Object. |

#ForwardLog Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **old_email** | `String` | `X` | Stage Original Email. |
| **new_email** | `String` | `X` | Stage New Email. |
| **forward_by** | `String` | `X` | The Role who Forward the stage. It could be `owner` or `signer`. |
| **updated_at** | `String` | `X` | Happen time of the forward. |

#DeclineLog Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **reply_to** | `String` | `X` |  |
| **updated_at** | `String` | `X` | Stage New Email. |


# FieldType HealthCheck Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **field_type** | `String` | `X` | Field Type. If it has `*` at the end, it means the field is required; otherwise optional. |
| **field_count** | `Integer` | `X` | Field Count of such field_type |


# SignEvent Health Check Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **event_datetime** | `Integer` | `X` | Event Happen timestamp. |
| **action_name** | `String` | `X` | Event Action Name. |
| **event_email** | `String` | `X` | Member Email of the one who cause the event. |
| **ip_address** | `String` | `X` | Ip Address of the one who cause the event. |
| **device** | `String` | `X` | Device of the one who cause the event. |
