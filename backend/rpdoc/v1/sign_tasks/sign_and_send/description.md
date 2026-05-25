# Description

Create a sign and send task.

> How to create a `sign and send` task?
>
> 1.  First request to the **`POST`** **Create Sign and Send Task API** to build the task record at the server.
> 2.  Use the response `upload_link` to upload the pdf file to the server side. Please refer to **`POST`** **Upload File API**.
> 3.  Wait the socket send the message which event is `task_completed`. Then the client can refresh and call **`GET`** **Preview File API** and **`GET`** **Read Sign Task API** to render the completed sign and send task. If you don't have socket server or socket is not workable, just wait the timeout trigger and call the Preview and Read API.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **file_name** | `String` | `O` | Task file name. |
| **pdf_object_info** | `String Array`, | `O` | Signer's pdf_object_id. It means which sign fields are belongs to the signer. Generated uuid by client side. |
| **xfdf_info** | `Array of` [FieldSetting Request Object](#fieldsetting-request-object) | `O` | FieldSetting Request Object. |
| **sign_info** | `Array of` [SignatureInfo Request Object](#signatureinfo-request-object) | `O` | SignatureInfo Request Object. |
| **attachment_setting** | `Array of` [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) | `X` | SignStage AttachmentSetting Request Object. |

# Response

Response body extends [SignTask Object](#signtask-object), and it contains additional info belows.

| Parameter | Type | Nullable? | Description |
| --------- | --- | ------- | ----------- |
| **upload_link** | `String` | `X` | Upload the pdf file to the server side. Please refer to **`POST`** **Upload File API**. |
| **attachment_upload_infos** | [Attachment UploadInfo Object](#attachment-uploadinfo-object) | `X` | Attachment UploadInfo Object. |

- Attachment UploadInfo Object

| Parameter | Type | Nullable? | Description |
| --------- | --- | ------- | ----------- |
| **[attachment file name]** | `String` | `X` | Attachment Upload Link for attachment with provided attachment name. Please refer to **`POST`** **Upload File API** for uploading the file to the server. |
