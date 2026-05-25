# Description

Update the member's name and lang.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **name** | `String` | `X` | Member name. |
| **lang** | `String` | `X` | Member lang. |

# Response

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
