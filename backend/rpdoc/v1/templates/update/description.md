# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Path Parameter

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **template_id** | `Integer` | `O` | Template id. |

# Request Body
[Template Request Object](#template-request-object) extends wit [Client Request Object](#client-request-object).

**For Template File Replacement:**
When you need to replace the template file, add `is_replace_template: true` to the request body. The response will include `upload_link` for file upload.

| Parameter | Type | Required? | Description |
| --- | --- | --- | --- |
| **is_replace_template** | `Boolean` | `X` | Set to `true` to receive upload link for template file replacement. |

# Response
Response Body extends [Template Object](#template-object), and it contains additional info belows.

| Parameter | Type | Nullable? | Description |
| --------- | :--: | :-------: | ----------- |
| **over_attachment_limit** | `Boolean` | `X` | The template has over limited attachments if it is `true`. |
| **upload_link** | `String` | `X` | Link to upload template file (only returned when `is_replace_template` is `true`). |

# Template File Replacement Flow

1. **Update Template with Upload Link Request**
   ```
   PUT /api/v1/templates/:id
   Content-Type: application/json
   
   {
     "file_name": "Updated Template Name",
     "is_replace_template": true
   }
   ```

2. **Response with Upload Link**
   ```json
   {
     "status": "success",
     "data": {
       "template_id": 123,
       "file_name": "Updated Template Name",
       "upload_link": "http://example.com/api/v1/files/upload/xyz123",
       // ... other template info
     }
   }
   ```

3. **Upload New Template File**
   ```
   POST /api/v1/files/upload/xyz123
   Content-Type: multipart/form-data
   
   file: [PDF file]
   ```

> **Note:** The file upload will automatically regenerate thumbnails, XFDF, and other related files. If the user cancels the operation, the original template file remains unchanged.
