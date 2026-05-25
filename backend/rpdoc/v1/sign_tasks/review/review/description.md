### Description
Review the task. Server would record a `review_passed` or `review_rejected` event in audit trail and return task info.

### Request
#### Request Header
See [General Header Object](#gerenal-header-object).

### Request Body
| Parameter          |                                                Type                                                | Required | Description                                                                |
|:-------------------|:--------------------------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------------------------------|
| sign_task_id       |                                             `Integer`                                              |   `O`    | Task ID.                                                                   |
| review_message     |                                              `String`                                              |   `*`    | Message, required if result is `reject`.                                   |
| review_fields      |      `Array of` [SignStage ReviewInfo Request Object](#signstage-reviewfield-request-object)       |   `X`    | SignStage ReviewInfo Request Object.                                       |
| review_attachments | `Array of` [SignStage ReviewAttachment Request Object](#signstage-reviewattachment-request-object) |   `X`    | SignStage ReviewAttachment Request Object.                                 |


- SignStage ReviewField Requset Object
| Parameter       |   Type    | Required | Description                    |
|:----------------|:---------:|:--------:|:-------------------------------|
| field_object_id | `String`  |   `O`    | Field custom ID.               |
| accepted        | `Boolean` |   `O`    | pass or reject for this field. |
- SignStage ReviewAttachment Request Object
| Parameter     |   Type    | Required | Description                         |
|:--------------|:---------:|:--------:|:------------------------------------|
| attachment_id | `String`  |   `O`    | Unique key of attachment.           |
| accepted      | `Boolean` |   `O`    | pass or reject for this attachment. |


### Response
#### Response Body
See [SignTask Object](#signtask-object).
