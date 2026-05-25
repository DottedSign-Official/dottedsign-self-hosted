# Description

Show the template detail information.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameter

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **template_id** | `Integer` | `O` | Template id. |

# Response
Response Body extends [Template Object](#template-object), and it contains additional info belows.

| Parameter | Type | Nullable? | Description |
| --------- | :--: | :-------: | ----------- |
| **over_attachment_limit** | `Boolean` | `X` | The template has over limited attachments if it is `true`. |
| **download_link** | `String` | `X` | Link to download template original file. |
