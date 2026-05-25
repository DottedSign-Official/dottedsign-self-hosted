- [Blank Success Response](#blank-success-response)
- [Member Object](#member-object)
  - [Member Profile Object](#member-profile-object)
  - [Token Object](#token-object)
- [SignTask Object](#signtask-object)
  - [SignTask Basic Object](#signtask-basic-object)
  - [SignTask Owner Object](#signtask-owner-object)
  - [SignTask Thumbnail Object](#signtask-thumbnail-object)
  - [SignTask AccessInfo Object](#signtask-accessinfo-object)
  - [SignTask VerifyInfo Object](#signtask-verifyinfo-object)
- [Template Object](#template-object)
  - [Template Basic Object](#template-basic-object)
  - [ShareInfo Object](#shareinfo-object)
- [TaskSetting Object](#tasksetting-object)
  - [TaskSetting CcInfo Object](#tasksetting-ccinfo-object)
  - [TaskSetting ReferenceSetting Object](#tasksetting-referencesetting-object)
- [SignStage Object](#signstage-object)
  - [SignStage AttachmentSetting Object](#signstage-attachmentsetting-object)
  - [SignStage CustomMessageSetting Object](#signstage-custommessagesetting-object)
- [DummyStage Object](#dummystage-object)
- [FieldSetting Object](#fieldsetting-object)
  - [FieldSetting Options Object](#fieldsetting-options-object)
- [StageSetting Object](#stagesetting-object)
- [DeclineReason Object](#declinereason-object)
- [Signature Object](#signature-object)
- [BulkMission Object](#bulkmission-object)
- [Group Object](#group-object)
- [Filter Summary Object](#filter-summary-object)
- [Attachment Object](#attachment_object)

# Member Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| id | `Integer` | `X` | Member ID. |
| group_id | `Integer` | `X` | Member's group ID. |
| name | `String` | `X` | Member Name. |
| email | `String` | `X` | Member Email. |
| phone_code | `String` | `X` | Member Phone Code. |
| phone_number | `String` | `X` | Member Phone number. |
| unconfirmed_email | `String` | `X` | Member Unconfirmed Email. |
| created_at | `Integer` | `X` | Member Create Time. |
| language | `String` | `X` | Member Language. |
| icon_url | `String` | `X` | Member Icon URL. |
| receiver_lang | `String` | `X` | Member Prefer Lang for his signers. |
| date_format | `String` | `X` | Member Prefer Date Format. |
| is_registered | `Boolean` | `X` | If member already registered. |
| is_admin | `Boolean` | `X` | If the member is an admin, return true. |
| confirmed | `Boolean` | `X` | If member already confirm. |
| forget_remind | `Boolean` | `X` | Member Prefer Forget Remind Setting. |
| expire_remind | `Boolean` | `X` | Member Prefer Expire Remind Setting. |
| remind_days_before_expire | `Boolean` | `X` | Member Prefer Remind Days Before Task Expire. |
| otp_via_email | `Boolean` | `X` | Member Prefer Receive OTP with Email. |
| otp_via_phone | `Boolean` | `X` | Member Prefer Receive OTP with Sms. |
| force_receiver_otp | `Boolean` | `X` | Member Prefer to always Receive OTP. |
| profile | [Member Profile Object](#member-profile-object) | `X` | Member Profile Object. |
| current_permission | [Permission Object](#permission-object) | `X` | Member current permission |

# Member Profile Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| id | `Integer` | `X` | Profile ID. |
| member_id | `Integer` | `X` | Member ID. |
| language | `String` | `O` | Profile Language. |
| full_name | `String` | `O` | Profile Full Name (Not real, just for convenience). |
| first_name | `String` | `O` | Profile First Name (Not real, just for convenience). |
| telephone | `String` | `O` | Profile Telephone (Not real, just for convenience). |
| nationality | `String` | `O` | Profile Nationality (Not real, just for convenience). |
| address | `String` | `O` | Profile Address (Not real, just for convenience). |
| organization | `String` | `O` | Profile Organization (Not real, just for convenience). |
| email | `String` | `O` | Profile Email (Not real, just for convenience). |
| icon_url | `String` | `O` | Member Icon URL. |

# Member Auth Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| token_info | [Token Object](#token-object) | `X` | Token Object. |

# Token Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| access_token | `String` | `X` | Access Token. |
| token_type | `String` | `X` | Access Token Type. |
| expires_in | `Integer` | `X` | Access Token Expire in seconds. |
| refresh_token | `String` | `X` | Refresh Token. |
| created_at | `Integer` | `X` | Access Token Create Timestamp. |
| for_app | `String` | `X` | Access Token from application name. |

# Blank Success Response
`{"data": "ok"}`

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
| reference_links | `Array` of [TaskSetting Reference Link Object](#tasksetting-reference-link-object)| `O` | The reference of invite sign task | 
| completed_reference_setting | [TaskSetting ReferenceSetting Object](#tasksetting-referencesetting-object) | `O` | TaskSetting ReferenceSetting Request Object. |
| completed_reference_links | `Array` of [TaskSetting Reference Link Object](#tasksetting-reference-link-object)| `O` | The reference of completed sign task | 
| viewable_attachments | `Array` of [TaskSetting Reference Link Object](#tasksetting-reference-link-object)| `O` | The reference of invite sign task | 

# TaskSetting CcInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| email | `String` | `X` | Email. |
| name | `String` | `X` | Name. |

# TaskSetting Reference Link Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| reference_id | `String` | `X` | Unique key in the same task. |
| file_name | `String` | `X` | Reference name. |
| type | `String` | `X` | Includeing `pdf`, `png`. |
| upload_link | `String` | `X` | The upload link of reference. |

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
| action | `String` | `X` | Signer action, including `sign` and `review`. |
| actor_info | `Object` | `X` | Actor information, including `base_stage_id` for stage with `review` action. |
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

# SignStage FullInfo Object

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
| full_info | [Stage FullInfo Object](#stage-full-info-object)| `X` | SignStage include full_info  Object |

# Stage FullInfo Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| attachment_count | `Integer` | `X` | Total of the attachment number. |
| attachment_settings | Array of [SignStage AttachmentSetting Object](#signstage-attachmentsetting-object) | `O` | SignStage Attachment Object |
| custom_message_setting | [SignStage CustomMessageSetting Object](#signstage-custommessagesetting-object) | `O` | SignStage CustomMessageSetting Object |
| need_otp_verify | `Boolean` | `X` | `true` or `false` |
| field_groups | Array of [FieldGroup Object](#fieldgroup-object) | `X` | Array of FieldSetting Object |
| field_settings | Array of [FieldSetting Object](#fieldsetting-object) | `X` | FieldSetting Object |
| pdf_object_info | Array of `pdf object id` | `X` | Array of PDF object id|
| stage_setting | [StageSetting Object](#stagesetting-object) | `X`  | StageSetting Object. |
| xfdf_text | `String` | `O`| The Xfdf format text|

# SignStage AttachmentSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| attachment_id | `String` | `X` | Unique key in the same task, with format `attachmeny_{stage_id}_{attachment_num}/` |
| file_name | `String` | `X` | Attachment name. |
| force | `Boolean` | `X` | Signer must upload or not. |
| viewable_in_processing | `Boolean` | `X` | The signer can view attachment return `true`.|

# SignStage CustomMessageSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| processing_viewable | `Boolean` | `X` | Default `false`. |
| completed_viewable | `Boolean` | `X` | Default `false`. |

# DummyStage Object

DummyStage Object extends [SignStage Basic Object](#signstage-basic-object), with additional info as below.

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| role | `String` | `X` | Stage Role. |
| attachment_settings | `Array of` [SignStage AttachmentSetting Object](#signstage-attachmentsetting-object) | `O` | SignStage Attachment Object |
| attachment_count | `Integer` | `X` | Total of the attachment number. |
| field_settings | `Array of` [FieldSetting Object](#fieldsetting-object) | `X` | FieldSetting Object |
| stage_setting | [StageSetting Object](#stagesetting-object) | `X`  | StageSetting Object. |

# FieldSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| field_type | `String` | `X` | Including `signature`, `textfield`, `datefield`, `checkbox`, `radio` |
| field_value | `String`, or `Boolean` | `O` | String value if `field_type` is `signature`, `textfield` or `datefield`; boolean value if `field_type` is `checkbox` or `radio`. |
| field_object_id | `String` | `X` | ID with regex format `/DottedSign\_[a-z0-9-]+/`, and it is unique in the same task. |
| custom_id | `String` | `X` | custom_id set by user, and it is unique in the same task. |
| page | `Integer` | `X` | The page for current signature object. Start from `0`. |
| coord | `Float Array` | `X` |  The position for current field object, e.g., `[100.10, 200.20, 300.30, 400.40]`. |
| options | [FieldSetting Options Object](#fieldsetting-options-object) | `X` | FieldSetting Options Request Object. |

# FieldSetting Options Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| force | `Boolean` | `X` | Default `true` for `signature`, `textfield`, and `datefield`; otherwise `false`. |
| default | `String` or `Boolean` | `*` | Exist for`textfield`(default `""`), `datefield`(default `null`), `checkbox`(default `false`), and `radio`(default `false`). **Can not use in template creation and update.** |
| read_only | `Boolean` | `*` | Exist for`textfield`, `datefield`, `checkbox`, `systemtime` , and `radio`, default `false`. **Can not use in template creation and update.** |
| is_multi_line | `Boolean` | `*` | Exist for`textfield`, default `false`. |
| font_size | `Integer` | `*` | Exist for `textfield`, `datefield`, `systemtime`, default `14`, range from `8` to `34`.|
| font_size_fixed | `Boolean` | `*` | Exist for `textfield`, `datefield`, `systemtime`, default `false`. |
| alignment | `String` | `*` | Exist for all field_tpye, default `left`, including `left`, `center`, and `right`. |
| alignment_fixed | `Boolean` | `*` | Exist for `textfield`, `datefield`, `systemtime`, default `false`. |
| length | `Integer` | `*` | Exist for `textfield`, default `500`, range from `1` to `500`. |
| validation | `String` | `*` | Exist for `textfield`, default `null`, including `null`, `email`, `letters`, `numbers`, and `regex`. |
| validation_regex | `String` | `*` | Exist for `textfield`, default `null` but except `validation` is `regex`, e.g., `[A-Za-z0-9]+` |
| date_format | `String` | `*` | Exist for `datefield`, default `yyyy/mm/dd`, but member preference is preferred. |
| date_setting | `String` | `*` | Exist for `datefield`, default `current_only`, including `current_only`, `future_enable`, `past_enable`, and `no_limit`. |
| zone | `Boolean` | `*` | Exist for `datefield`, default `0`, from `-12` to `14` |

# StageSetting Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| forward_enable | `Boolean` | `X` | Signer can forward the stage to others or not, default `false`. |
| decline_enable | `Boolean` | `X` | Signer can decline the task or not, default `true`. |
| viewable_in_processing | `Boolean` | `X` | Signer can view viewable attachments or not when task is processing. |
| viewable_in_completed | `Boolean` | `X` | Signer can view the merged attachment or not when task is completed. |
| viewable_in_processing_attachments | `Array of String` | `X` | Which attachment can signer view if `viewable_in_processing` is `true`, default should contain all viewable `attachment_id` defined in [SignStage AttachmentSetting Object](#signstage-attachmentsetting-object) |

# Template Object
Template Object extends [Template Basic Object](#template-basic-object), with [TaskSetting Object](#tasksetting-object).

# Template Basic Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| template_id | `Integer` | `X` | Task ID. |
| file_name | `String` | `X` | Task file name. |
| has_order | `Boolean` | `X` | Signers should sign sequentially if it is `true`. |
| created_at | `Integer` | `X` | Task created timestamp. |
| last_modified_at | `Integer` | `X` | Task last modified timestamp. |
| status | `String` | `X` | Including `active` and `deleted` |
| details | `Array of` [DummyStage Object](#dummystage-object) | `X` | DummyStage Object. |
| thumbnail | `String` | `X` | The thumbnail link of template thumbnail. |
| share_info | [ShareInfo Object](#shareinfo-object) | `O` | Template ShareInfo Object |
| tags | [Tag Object](#tag-object) | `X` | Tag Object.  |

# ShareInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| share_by_me | `Boolean` | `X` | Template is shared to other group members, and it is shared by me.|
| share_by_others | `Boolean` | `X` | Template is shared by other group members. |

# Tag Object
It's a hash which has Tag Name as key, boolean as value.

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **\[Tag Name\]** | `Boolean` | `X` | `true` if tag is append to template. `false` if tag not append to template. |

# Group Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| id | `Integer` | `X` | Group ID.|
| name | `String` | `X` | Group Name. |
| unique_name | `String` | `X` | Group UUID. |
| status | `String` | `X` | Status of Group. Including `active`, `suspend`, `dead`|
| icon_url | `String` | `O` | Group Icon URL. |
| group_members | `Array of` [GroupMember Object](#groupmember-object) | `X` | Group UUID. |

# PublicForm Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| uuid | `String` | `X` | Public Form UUID. |
| template_name | `String` | `X` | Public Form Related Template name. |
| form_name | `String` | `X` | Public Form Name. |
| description | `String` | `O` | Public Form Description. |
| sent_num | `Integer` | `X` | Sent Task Number of Public Form. |
| finish_num | `Integer` | `X` | Finish Task Number of Public Form. |
| goal_num | `Integer` | `O` | Goal Task Num to Finish the Form. |
| end_at | `Integer` | `O` | Timestamp to End the Form. |
| status | `String` | `X` | Public Form Status. `publish`/`unpublish` |
| signer_infos | `Array of` [SignerInfo Object] | `X` | SignerInfo Object. |

# Signature Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| id | `Integer` | `X` | Signature ID. |
| member_id | `Integer` | `X` | Member ID. |
| category | `String` | `X` | Signature Category. Available: `signature`, `initial`, `stamp`. |
| file_type | `String` | `X` | Signature File Type. Available: `png`, `jpg` |
| raw | `String` | `X` | Signature Base64 Encode Raw String. |
| created_at | `String` | `X` | Created date. |
| updated_at | `String` | `X` | Updated date. |

# BulkMission Object

| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| **uuid** | `String` | `X` | A unique id for each bulk mission. |
| **template_name** | `String` | `X` | What template create the bulk send mission. |
| **count** | `Integer` | `X` | Total mission will create and send. |
| **processing_count** | `Integer` | `X` | Total processing mission requests. |
| **completed_count** | `Integer` | `X` | Total finished mission requests. |
| **status** | `String` | `X` | The mission's status is `processing` or `completed`. `completed` means all the sign requests are finished. |
| **created_at** | `Integer` | `X` | Create timestamp. |


# GroupMember Object
| Parameter | Type | Nullable? | Description |
| --------- | :----: | :-------: | ----------- |
| name | `String` | `X` | Group Member Name.|
| email | `String` | `X` | Group Member Email. |
| status | `String` | `X` | Group Member Status. Including `waiting`, `accepted`, `removed`, `canceled`, `disabled` |
| roles | `Array of String` | `X` | Group Member Roles in group. Available Roles: `admin`, `manager`, `member` |

# Role Response Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **name** | `String` | `X` | Role name. |
| **permission** | [Permission Object](#permission-object) | `X` | Group Role. |
| **priority** | `Integer` | `X` | Role priority. |

# Permission Response Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **role** | `String` | `X` | Group Role. |
| **permission** | [Permission Object](#permission-object) | `X` | Group Role. |

# Permission Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **manage_users** | `Boolean` | `X` | Able to manage group members, ex. invite / remove / assign role of group member. |
| **view_users** | `Boolean` | `X` | Able to view group members. |
| **manage_permission** | `Boolean` | `X` | Able to manage group permissions. |
| **view_team_tasks** | `Boolean` | `X` | Able to view team tasks. |
| **download_processing_task_self_sender** | `Boolean` | `X` | Able to download self owned processing group task. |
| **download_processing_task_group_sender** | `Boolean` | `X` | Able to download group others owned processing group task. |
| **download_processing_task_self_signer** | `Boolean` | `X` | Able to download self signed processing group task. |
| **download_processing_task_group_signer** | `Boolean` | `X` | Able to download group others signed processing group task. |
| **download_completed_task_self_sender** | `Boolean` | `X` | Able to download self owned completed group task. |
| **download_completed_task_group_sender** | `Boolean` | `X` | Able to download group others owned completed group task. |
| **download_completed_task_self_signer** | `Boolean` | `X` | Able to download self signed completed group task. |
| **download_completed_task_group_signer** | `Boolean` | `X` | Able to download group others signed completed group task. |
| **download_sign_and_send_self_task** | `Boolean` | `X` | Able to download self owned sign_and_send group task. |
| **download_sign_and_send_group_task** | `Boolean` | `X` | Able to download group others owned sign_and_send group task. |
| **download_audit_trail_self_sender** | `Boolean` | `X` | Able to download audit trail of self owned group task. |
| **download_audit_trail_group_sender** | `Boolean` | `X` | Able to download audit trail of group others owned group task. |
| **download_audit_trail_self_signer** | `Boolean` | `X` | Able to download audit trail of self signed group task. |
| **download_audit_trail_group_signer** | `Boolean` | `X` | Able to download audit trail of group others signed group task. |
| **delete_processing_task_self_sender** | `Boolean` | `X` | Able to delete self owned processing group task. |
| **delete_sign_and_send_self_task** | `Boolean` | `X` | Able to delete self owned sign_and_send group task. |
| **manage_company_name** | `Boolean` | `X` | Able to manage group name. |
| **manage_company_logo** | `Boolean` | `X` | Able to manage group icon. |
| **share_template** | `Boolean` | `X` | Able to share template. |
| **bulk_send** | `Boolean` | `X` | Able to do bulk send. |
| **report_access** | `Boolean` | `X` | Able to access group task report. |

# DeclineReason Object

| Parameter | Type | Nullable? | Description |
| --------- | :---: | :-------: | ----------- |
| id | `Integer` | `X` | Decline reason ID. |
| system_reserved | `Boolean` | `X` | true if create by super admin.|
| status | `String` | `X` | `active` or `deleted` |
| content | `String` | `X` | Decline reason content.|
| created_at | `Datetime` | `X` | Create time.|
| updated_at | `Datetime` | `X` | Update time.|



## Filter Summary Object

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **expire_soon** | `Integer` | `X` | How many task is expire soon on selected category. |
| **expired** | `Integer` | `X` | How many task is expired on selected category. |

## Attachment Object

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **attachment_id** | `Integer` | `X` | Attachment ID. e.g: `atatchment_1_1`|
| **file_id** | `Integer` | `X` | Attachment File ID.|
| **file_name** | `String` | `X` | Attachment File name.|
| **signer_name** | `String` | `X` | The signer name of attachment file.|
