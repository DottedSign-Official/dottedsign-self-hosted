# Description

If the task is come from template, you would not need to upload the pdf file again.

Call this api instead to upload the file.

> How to create a `draft` or `create_and_invite` task?
>
> 1.  First request to the **`POST`** **Create Draft Task API** to build the task record at the server.

> 2-1. Use the response `upload_link` to upload the pdf file to the server side. Please refer to **`POST`** **Upload File API**.

> 2-2. `Phase 2 Update` If the task is come from template, you would not need to upload the pdf file again. Call **`POST`** **Share Template Original File to SignTask Original File API** to link original file from which template instead.

> 3 . Wait the socket send the message which event is `task_uploaded`. If you don't have socket server or socket is not workable, just set a timeout trigger and call the **`GET`** **Read Sign Task API** to check the task status is `draft` and xfdf_ready is `true`.

> 4-1. If the action is **save to a draft task**, the create draft task processing is already done.

> 4-2. If the action is **create and invite task**, next you need to call **`POST`** **Start Draft Task API** to start the draft task to send the email for sign request.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **template_id** | `Integer` | `O` | Template id which this sign task used. |
| **sign_task_id** | `Integer` | `O` | SignTask id. |

# Response

Return status `200`
