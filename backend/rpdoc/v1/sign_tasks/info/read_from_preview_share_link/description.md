# Description

To read the task by jwt_code.

> How to read a task?
>
1. Use the response `download_link` to download the pdf file for show sign field at the pdf.
2. To display the fields using the 'xfdf_text' in 'stage_infos


# Query Parameters

Query Parameters extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `O` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |

# Response

Response body extends [SignTask Object](#signtask-object), and it contains additional info belows.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **download_link** | `String` | `X` | The pdf download url, if the task is completed, it will be `completed pdf`; else it will be `original pdf`. |
| **complete_link** | `String` | `O` | The pdf download url, it will have value only if the task is completed. |
| **attachment_link** | `String` | `O` | The attachment download url, it will have value only if the task is completed and the task has attachment file. |
| **xfdf_ready** | `Boolean` | `X` | `true` means this task draft is ready to start. It used to let client decide when to trigger `POST Start Draft API` if the client doesn't use socket. |
