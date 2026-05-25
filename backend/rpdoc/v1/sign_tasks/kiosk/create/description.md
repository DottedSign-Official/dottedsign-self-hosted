# Description

To create a `kiosk` task.

> How to complete a `kiosk` task?
>
> 1.  First request to the **`POST`** **Create Kiosk Task API** to build the task record at the server.

> 2. Use the response `sign_task_id` to call **`POST`** **Read Kiosk Task API** and view the kiosk task.

> 2-1. If get `signer_info_not_ready` error. Call **`POST`** **Read Kiosk Task API** again with require signer_info base on `signer_requisite` error data.

> 3 . Call **`PUT`** **Sign Kiosk Task API** to sign kiosk task.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body
Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| template_id | `Integer` | `O` | Template ID. |
| file_name | `String` | `O` | Kiosk Task Name. |
| stages | `Array of` [KioskStage Request Object](#kioskstage-request-object) | `O` | KioskStage Request Object. |
| file |  `String`| X | pdf file encode to base64 if you want change base pdf |

# Response

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `X` | Kiosk Task ID. |
