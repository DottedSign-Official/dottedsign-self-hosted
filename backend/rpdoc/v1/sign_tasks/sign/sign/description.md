# Description

To sign the task.

### OTP

> please check `Sign the Task failed (need otp verify)` examples to know how to process the task which need OTP verification. First request server will return 403 and send the OTP code to the target signer, signer will need to add the OTP code to the request body when user received. Then Second request will success.

### Quick Sign

> If the signer is quick sign type. (non register member)
>
> 1.  First request to the **`GET`** **Preview File API** to check this member is involved the task or not. If he involved, he can view the task.
> 2.  Then request to **`GET`** **Read Sign Task API**, he/she will face the error response such like the example of **Read Sign Task failed (non register member has not accept to sign)**.
> 3.  Let the signer agree the sign consent, and call the **`POST`** **Consent to Sign Task API**.
> 4.  Call the **`GET`** **Read Sign Task API** again with same work_id.
> 5.  Call the **`PUT`** **Sign the Task** to sign the task with same work_id.

### Sign with Attachment `Phase 2 Update`

> If the signer needs to upload attachments
>
> 1.  First request will face the error response such like the example **Sign the Task failed (attachment not ready)**, the error response will give the upload links.
> 2.  Upload the attachment.
> 3.  Resend the **`PUT`** **Sign the Task** to sign the task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Type | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |
| **sign_task_id** | `Integer` | `O` | {{sign_task_id}}. |
| **signature_info** | `Array of` [SignatureInfo Request Object](#signatureinfo-request-object) | `O` | SignatureInfo Request Object. |
| **verify_info** | [VerifyData Request Object](#verifydata-request-object) | `X` | VerifyData Request Object, required if need otp verify. |
| **attachment_info** | `Array of` [AttachmentInfo Request Object](#attachmentinfo-request-object) | `X` | AttachmentInfo Request Object, required if need to upload attachment. |

# Response
Response body extends [SignTask Object](#signtask-object), and it contains additional info belows.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **after_sign_category** | `String` | `X` | The task belongs to which current member category after sign. Available: `completed` / `waiting_for_me` / `waiting_for_others` |
