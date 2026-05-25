# Description

To create a template.

> How to create a `template`?
>
> 1. First request to the **`POST`** **Create Template API** to build the template record at the server.
> 2. Use the response `upload_link` to upload the pdf file to the server side. Please refer to **`POST`** **Upload File
     API**.

# Request Header

| Parameters        | Value                   | Required | Description                |
|-------------------|-------------------------|----------|----------------------------|
| **Authorization** | Bearer {{access_token}} | `O`      | Member Identity.           |
| **Content-Type**  | `application/json`      | `O`      | Request Body Content Type. |

# Request Body

| Parameter      |                               Type                               | Required | Description                                                 |
|----------------|:----------------------------------------------------------------:|:--------:|-------------------------------------------------------------|
| file_name      |                             `String`                             |   `O`    | Task file name.                                             |
| has_order      |                            `Boolean`                             |   `O`    | Signers should sign sequentially if it is `true`.           |
| stages         | `Array of` [SignStage Request Object](#signstage-request-object) |   `O`    | SignStage Request Object.                                   |
| tags           |                        `Array of String`                         |   `X`    | Tags, e.g., `[tag1, tag2]`                                  |
| **client**     |                             `String`                             |   `O`    | `web` or `app`, to verify the source come from.             |
| **ip_address** |                             `String`                             |   `O`    | Task owner's ip_address, in order to record the sign event. |
| **work_id**    |                               `X`                                | `String` | Require if quick sign.                                      |

# SignStage Request Object

| Parameter              |                                                 Type                                                 | Required | Description                                                |
|------------------------|:----------------------------------------------------------------------------------------------------:|:--------:|------------------------------------------------------------|
| email                  |                                               `String`                                               |   `*`    | Signer email, required for **task** creation and update.   |
| name                   |                                               `String`                                               |   `*`    | Signer name, required for **task** creation and update.    |
| role                   |                                               `String`                                               |   `*`    | Signer role, required for **template** creation and update |
| attachment_settings    | `Array of` [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) |   `X`    | SignStage AttachmentSetting Object                         |
| custom_message_setting |   [SignStage CustomMessageSetting Request Object](#signstage-custommessagesetting-request-object)    |   `X`    | SignStage CustomMessage Request Object                     |
| xfdf_info              |                `Array of` [FieldSetting Request Object](#fieldsetting-request-object)                |   `O`    | FieldSetting Request Object.                               |
| stage_setting          |                     [StageSetting Request Object](#stagesetting-request-object)                      |   `X`    | StageSetting Request Object.                               |
| verify                 |                  `Array of` [Otp Verify Request Object](#otp-verify-request-object)                  |   `X`    | Otp Verify Request Object.                                 |

# SignStage AttachmentSetting Request Object

| Parameter                          |       Type        | Required | Description                                                                                                                                                                                                                                    |
|------------------------------------|:-----------------:|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| attachment_id                      |     `String`      |   `X`    | Unique key in the same task, **will be changed by backend server**.                                                                                                                                                                            |
| file_name                          |     `String`      |   `O`    | Attachment name.                                                                                                                                                                                                                               |
| force                              |     `Boolean`     |   `O`    | Signer must upload attachment or not.                                                                                                                                                                                                          |
| viewable_in_processing             |     `Boolean`     |   `X`    | Signer can view viewable attachments or not when task is processing.                                                                                                                                                                           |
| viewable_in_processing_attachments | `Array of String` |   `X`    | Which attachment can signer view, required if `viewable_in_processing` is `true`. Should contain all viewable `attachment_id` defined in [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) by default. |
| viewable_in_completed              |     `Boolean`     |   `X`    | Signer can view the merged attachment or not when task is completed.                                                                                                                                                                           |

# SignStage CustomMessageSetting Request Object

| Parameter           |   Type    | Required | Description      |
|---------------------|:---------:|:--------:|------------------|
| processing_viewable | `Boolean` |   `X`    | Default `false`. |
| completed_viewable  | `Boolean` |   `X`    | Default `false`. |

# FieldSetting Request Object

| Parameter  |                                    Type                                     | Required | Description                                                                                                                                |
|------------|:---------------------------------------------------------------------------:|:--------:|--------------------------------------------------------------------------------------------------------------------------------------------|
| field_type |                                  `String`                                   |   `O`    | Including `signature`, `textfield`, `datefield`, `checkbox`, `radio`, `systemtime`                                                         |
| object_id  |                                  `String`                                   |   `O`    | Field object ID generated by frontend (current style follows regex format `/DottedSign\_[a-z0-9-]+/`),  should be unique in the same task. |
| custom_id  |                                  `String`                                   |   `O`    | Field user custom ID,  should be unique in the same task.                                                                                  |
| page       |                                  `Integer`                                  |   `O`    | The page for current signature object. Start from `0`.                                                                                     |
| coord      |                                `Float Array`                                |   `O`    | The position for current field object, e.g., `[100.10, 200.20, 300.30, 400.40]`.                                                           |
| options    | [FieldSetting Options Request Object](#fieldsetting-options-request-object) |   `O`    | FieldSetting Options Request Object.                                                                                                       |

# FieldSetting Options Request Object

| Parameter        |         Type          | Required | Description                                                                                                                |
|------------------|:---------------------:|:--------:|----------------------------------------------------------------------------------------------------------------------------|
| force            |       `Boolean`       |   `X`    | Used for all field_type, default `true` for `signature`, `textfield`, and `datefield`; otherwise `false`.                  |
| default          | `String` or `Boolean` |   `X`    | Used for`textfield`(default `""`), `datefield`(default `null`), `checkbox`(default `false`), and `radio`(default `false`). |
| read_only        |       `Boolean`       |   `X`    | Used for`textfield`, `datefield`, `checkbox`, and `radio`, default `false`.                                                |
| is_multi_line    |       `Boolean`       |   `X`    | Used for`textfield`, default `false`.                                                                                      |
| font_size        |       `Integer`       |   `X`    | Used for `textfield`, default `14`, range from `8` to `34`.                                                                |
| font_size_fixed  |       `Boolean`       |   `X`    | Used for `textfield`, `datefield`, default `false`.                                                                        |
| alignment        |       `String`        |   `X`    | Used for all field type, default `left`, including `left`, `center`, and `right`.                                          |
| alignment_fixed  |       `Boolean`       |   `X`    | Used for `textfield`, `datefield`, default `false`.                                                                        |
| length           |       `Integer`       |   `X`    | Used for `textfield`, default `500`, range from `1` to `500`.                                                              |
| validation       |       `String`        |   `X`    | Used for `textfield`, default `null`, including `null`, `email`, `letters`, `numbers`, and `regex`.                        |
| validation_regex |       `String`        |   `X`    | Used for `textfield`, default `null` but except `validation` is `regex`, e.g., `[A-Za-z0-9]+`                              |
| date_format      |       `String`        |   `X`    | Used for `datefield`, default `yyyy/mm/dd`, but member preference is preferred.                                            |
| date_setting     |       `String`        |   `X`    | Used for `datefield`, default `current_only`, including `current_only`, `future_enable`, `past_enable`, and `no_limit`.    |
| zone             |       `Boolean`       |   `X`    | Used for `datefield`, default `0`.                                                                                         |
| visible_ca       |       `Boolean`       |   `X`    | Used for `signature`, default `false`. If `true`, signer can use visible CA.                                               |

# StageSetting Request Object

| Parameter      |   Type    | Required | Description                                                                                     |
|----------------|:---------:|:--------:|-------------------------------------------------------------------------------------------------|
| forward_enable | `Boolean` |   `X`    | Signer can forward the stage to others or not, default `true` for owner but `false` for signer. |
| decline_enable | `Boolean` |   `X`    | Signer can decline the task or not, default `false` for owner but `true` for signer.            |

# Otp Verify Request Object

| Parameters    | Type     | Required | Description                                                                                                                      |
|---------------|----------|----------|----------------------------------------------------------------------------------------------------------------------------------|
| verify_type   | `String` | `O`      | Verify type. Available: `email` , `phone` ,`cht_personal` ,`cht_company` or `signer_detect`                                      |
| verify_source | `String` | `O`      | Currently only `phone` and `signer_detect` are used, enter the phone number and the country code                                 |
| occassion     | `String` | `O`      | The occasion currently only `sign` and  `read` are used, choose the appropriate verification method according to your situation. |
| sequence      | `String` | `O`      | Order for signer. Ignore it when `has_order` is `false`. Start from `1`                                                          |

# Response

Response Body extends [Template Object](#template-object), and it contains additional info belows.

| Parameter                 |   Type    | Nullable? | Description                                                                            |
|---------------------------|:---------:|:---------:|----------------------------------------------------------------------------------------|
| **over_attachment_limit** | `Boolean` |    `X`    | The template has over limited attachments if it is `true`.                             |
| **upload_link**           | `String`  |    `X`    | Link to upload template original file. Please refer to **`POST`** **Upload File API**. |

