# Description

Obtain Group Permission Setting

# Request Header

| Parameters | Description |
| --- | --- |
| **Authorization** | Bearer {{access_token}} |
| **Content-Type** | application/json |

# Request Body

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **group_id** | `O` | `Integer` | Group ID. |

# Response

Array of [Permission Response Object](#permission-response-object)

* Permission Response Object

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **role** | `String` | `O` | Group Role. |
| **permission** | [Permission Object](#permission-object) | `O` | Group Role. |


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
