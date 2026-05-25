# Description

Change Group Permission Setting

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |
| **permissions** | `O` | `Array of` [Permission Request Object](#permission-request-object) | Group ID. |

# Permission Request Object

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **role** | `O` | `String` | Group Role. |
| **manage_users** | `X` | `Boolean` | Able to manage group members, ex. invite / remove / assign role of group member. |
| **view_users** | `X` | `Boolean` | Able to view group members. |
| **manage_permission** | `X` | `Boolean` | Able to manage group permissions. |
| **view_team_tasks** | `X` | `Boolean` | Able to view team tasks. |
| **download_processing_task_self_sender** | `X` | `Boolean` | Able to download self owned processing group task. |
| **download_processing_task_group_sender** | `X` | `Boolean` | Able to download group others owned processing group task. |
| **download_processing_task_self_signer** | `X` | `Boolean` | Able to download self signed processing group task. |
| **download_processing_task_group_signer** | `X` | `Boolean` | Able to download group others signed processing group task. |
| **download_completed_task_self_sender** | `X` | `Boolean` | Able to download self owned completed group task. |
| **download_completed_task_group_sender** | `X` | `Boolean` | Able to download group others owned completed group task. |
| **download_completed_task_self_signer** | `X` | `Boolean` | Able to download self signed completed group task. |
| **download_completed_task_group_signer** | `X` | `Boolean` | Able to download group others signed completed group task. |
| **download_sign_and_send_self_task** | `X` | `Boolean` | Able to download self owned sign_and_send group task. |
| **download_sign_and_send_group_task** | `X` | `Boolean` | Able to download group others owned sign_and_send group task. |
| **download_audit_trail_self_sender** | `X` | `Boolean` | Able to download audit trail of self owned group task. |
| **download_audit_trail_group_sender** | `X` | `Boolean` | Able to download audit trail of group others owned group task. |
| **download_audit_trail_self_signer** | `X` | `Boolean` | Able to download audit trail of self signed group task. |
| **download_audit_trail_group_signer** | `X` | `Boolean` | Able to download audit trail of group others signed group task. |
| **delete_processing_task_self_sender** | `X` | `Boolean` | Able to delete self owned processing group task. |
| **delete_sign_and_send_self_task** | `X` | `Boolean` | Able to delete self owned sign_and_send group task. |
| **manage_company_name** | `X` | `Boolean` | Able to manage group name. |
| **manage_company_logo** | `X` | `Boolean` | Able to manage group icon. |
| **share_template** | `X` | `Boolean` | Able to share template. |
| **bulk_send** | `X` | `Boolean` | Able to do bulk send. |
| **report_access** | `X` | `Boolean` | Able to access group task report. |


# Response

Array of [Permission Response Object](#permission-response-object).
