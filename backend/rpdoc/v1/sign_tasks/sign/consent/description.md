# Description

Must need to consent to sign the task if the member is non register.

> How to read a task?
>
> 1.  First request to the **`GET`** **Preview File API** to check this member is involved the task or not. If he involved, he can view the task.
> 2.  Use the **`GET`** **Preview File API** response preview_url to download the original pdf file to render the file without assign field.
> 3.  Request the **`GET`** **Read Sign Task API** to obtain the xfdf_info for show sign field at the pdf if the member can sign the document.

> If the signer is quick sign type. (non register member)
>
> 1.  First request to the **`GET`** **Preview File API** to check this member is involved the task or not. If he involved, he can view the task.
> 2.  Then request to **`GET`** **Read Sign Task API**, he will face the error response such like the example of **Read Sign Task failed (non register member has not accept to sign)**.
> 3.  Let the signer agree the sign consent, and call the **`POST`** **Consent to Sign Task API**.
> 4.  Call the **`GET`** **Read Sign Task API** again with same work_id.
> 5.  Call the **`PUT`** **Sign the Task** to sign the task with same work_id.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body
Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `O` | Task preview code. |
| **check** | `Boolean` | `O` | `true` if the signer consent to sign the task. |

# Response

| Parameter | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **accepted_at** | `Integer` | `X` | Accept timestamp. |
| **client** | `String` | `X` | `web` or `app`. |
| **ip_address** | `String` | `X` | Member ip address. |
| **work_id** | `String` | `X` | This tab of browser's work id. |
