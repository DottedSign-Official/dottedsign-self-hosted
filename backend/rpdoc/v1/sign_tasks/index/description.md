# Description

To list the member's sign task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **category** | `String` | `O` | What category you want to view: `waiting_for_me`, `waiting_for_others`, `completed` or `draft`. |
| **page** | `Integer` | `X` | Which pages you want to search, default is `1`. |
| **per_page** | `Integer` | `X` | Numbers of task showing per_page, default is `10`. |

# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **tasks** | `Array of` [SignTask Object](#signtask-object) | `X` | SignTask Object. |
| **summary** | [TaskList Summary Object](#tasklist-summary-object) | `X` | TaskList Summary Object |
| **filter_summary** | [Filter Summary Object](#filter-summary-object) | `X` | Filter Summary Object. |
| **current_page** | `Integer` | `X` | Current page number. |
| **total_pages** | `Integer` | `X` | Total pages. |

# SignTask Object
SignTask Object extends [SignTask Basic Object](#signtask-basic-object), with [TaskSetting Object](#tasksetting-object).

# SignTask Basic Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| task_id | `Integer` | `X` | Task ID. |
| file_name | `String` | `X` | Task file name. |
| has_order | `Boolean` | `X` | Signers should sign sequentially if it is `true`. |
| sign_type | `String` | `X` | Including `sign_and_send`, `create_and_invite` |
| created_at | `Integer` | `X` | Task created timestamp. |
| modified_at | `Integer` | `X` | Task last modified timestamp. |
| status | `String` | `X` | Including `draft`, `waiting`, `completed`, `declined`, `expired`, and `deleted` |
| current_stage_ids | `Array of Integer` | `O` | Array of current signer's stage ids. If `has_order` is `false`, all stage ids are included.
| current_member_turn | `Boolean` | `X` | It's current member turn. |
| own_by_me | `Boolean` | `X` | Task owned by current member. |
| stage_infos | Array of [SignStage Object](#signstage-object) | `X` | Array of sign stage object. |
| task_owner_info | [SignTask Owner Object](#signtask-owner--object) | `X` | SignTask owner object. |
| thumbnail | [SignTask Thumbnail Object](#signtask-thumbnail-object) | `X` | Task Thumbnail Object. |
| decline_reasons | `Array of` [DeclineReasonObject](#declinereason-object) | `X` | Array of decline reason object. |

# SignTask Owner Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| name | `String` | `X` | Owner name. |
| sequence | `Integer` | `X` | Only `0`. |
| email | `String` | `X` | Owner email. |
| action_type | `String` | `X` | Only `sent` |
| icon_url | `String` | `X` | Member Icon URL. |

# SignTask Thumbnail Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| original | `String` | `O` | Original PDF thumbnails Link. |
| completed | `String` | `O` | Completed PDF thumbnails Link. |

# SignTask AccessInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| view | `Boolean` | `X` | Member can read the task or not. |
| sign | `Boolean` | `X` | Member can sign the task or not. |
| review | `Boolean` | `X` | Member can review the task or not. |
| decline | `Boolean` | `X` | Member can decline tje task or not. |
| confirm | `Boolean` | `X` | Member can confirm the task or not. |
| delete | `Boolean` | `X` | Member can delete the task or not. |
| update | `Boolean` | `X` | Member can update the task or not. |
| download_task | `Boolean` | `X` | Member can download PDF or not. |
| download_audit_trail | `Boolean` | `X` | Member can download audit_trail PDF or not. |
| download_attachment | `Boolean` | `X` | Member can view/download attachments or not. |
| change_signer | `Boolean` | `X` | Member can change signer or not. |
| manage_tags | `Boolean` | `X` | Member can manage tags or not. |

# SignTask VerifyInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| verify_type | `String` | `O` | The verify type: `email`、`phone` |
| verify_source | `String` | `O` | The verify source like email or phone number   |
| uuid | `String` | `O` | The uuid is for quick signer |
| sequence | `Integer` | `O` | The verify sequence |
| occassion | `String` | `O` | The verify occassion like `read` or `sign` |
| occassion | `String` | `O` | The verify occassion like `read` or `sign` |
| identity_verify_token | `String` | `O` | The token that is generated after identity verification |

# TaskSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| deadline | `Integer`  | `O` | Deadline Timestamp. |
| forget_remind | `Boolean` | `X` | Signer will receive reminders if they have not finished signing in 2 and 6 days if the task is still not signed. Default as member preference setting. |
| expire_remind | `Boolean` | `X` | Signer will receive reminders if the task is about to expire. Default as member preference setting. |
| remind_days_before_expire | `Integer` | `O` | Required if `expire_remind` is `true`. Default as member preference setting. |
| need_otp_verify | `Boolean` | `X` | Force signers use one-time password to authenticate their identity before sign a document. Default `false` but may still required by member preference setting. |
| cc_info | `Array of` [TaskSetting CcInfo Object](#tasksetting-ccinfo-object)  | `O` | TaskSetting CcInfo Request Object. |
| message | `String` | `O` | Custom message that signer will see when task is processing. |
| completed_message | `String` | `O` | Custom message that signer will see when task is completed. |
| reference_setting | [TaskSetting ReferenceSetting Object](#tasksetting-referencesetting-object) | `O` | TaskSetting ReferenceSetting Request Object. |
| completed_reference_setting | [TaskSetting ReferenceSetting Object](#tasksetting-referencesetting-object) | `O` | TaskSetting ReferenceSetting Request Object. |

# TaskSetting CcInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| email | `String` | `X` | Email. |
| name | `String` | `X` | Name. |

# TaskSetting ReferenceSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| reference_id | `String` | `X` | Unique key in the same task. |
| file_name | `String` | `X` | Reference name. |
| type | `String` | `X` | Includeing `pdf`, `png`. |

# SignStage Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| stage_id | `Integer` | `X` | Stage ID. |
| task_id | `Integer` | `X` | Task ID. |
| stage_type | `String` | `X` | Stage Type: `SignStage` or `DummyStage`. |
| email | `String` | `O` | Signer Email |
| name | `String` | `X` | Signer name. |
| sequence | `Integer` | `X` | Order for signer. Ignore it when `has_order` is `false`. Start from `1` |
| action_type | `String` | `X` | Status for signer, including `initial`, `processing`, `done`, `declined`, `canceled`, `signed`, `modifying`, and `reviewed`. |
| icon_url | `String` | `X` | Member Icon URL. |
| need_otp_verify | `Boolean` | `X` | `true` or `false` |
| field_settings | Array of [FieldSetting Object](#fieldsetting-object) | `X` | FieldSetting Object |
| pdf_object_info | Array of `pdf object id` | `X` | Array of PDF object id|
| custom_message_setting | [SignStage CustomMessageSetting Object](#signstage-custommessagesetting-object) | `O` | SignStage CustomMessageSetting Object |
| attachment_settings | Array of [SignStage AttachmentSetting Object](#signstage-attachmentsetting-object) | `O` | SignStage Attachment Object |
| attachment_count | `Integer` | `X` | Total of the attachment number. |
| stage_setting | [StageSetting Object](#stagesetting-object) | `X`  | StageSetting Object. |

# SignStage AttachmentSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| attachment_id | `String` | `X` | Unique key in the same task, with format `attachmeny_{stage_id}_{attachment_num}/` |
| file_name | `String` | `X` | Attachment name. |
| force | `Boolean` | `X` | Signer must upload or not. |

# SignStage CustomMessageSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| viewable_in_processing | `Boolean` | `X` | Default `false`. |
| viewable_in_completed | `Boolean` | `X` | Default `false`. |

# TaskList Summary Object

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **waiting_for_me** | `Integer` | `X` | How many task belongs to waiting_for_me category. |
| **waiting_for_others** | `Integer` | `X` | How many task belongs to waiting_for_others category. |
| **completed** | `Integer` | `X` | How many task belongs to completed category. |
| **draft** | `Integer` | `X` | How many task belongs to draft category. |
