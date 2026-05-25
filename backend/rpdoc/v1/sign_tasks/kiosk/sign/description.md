# Description

To sign a kiosk task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body
Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | SignTask ID. |
| **signature_info** | `Array of` [SignatureInfo Request Object](#signatureinfo-request-object) | `O` | SignatureInfo Request Object. |
| **attachment_info** | `Array of` [AttachmentInfo Request Object](#attachmentinfo-request-object) | `O` | AttachmentInfo Request Object, required if need to upload attachment. |

# Response

See [SignTask Object](#signtask-object).
