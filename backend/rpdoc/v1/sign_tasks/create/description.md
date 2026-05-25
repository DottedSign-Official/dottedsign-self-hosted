# Description

Create a `draft` task or `create_and_invite` task.

> How to create a `draft` or `create_and_invite` task?
>
> 1. First request to the **`POST`** **Create Draft Task API** to build the task record at the server.

> 2-1. Use the response `upload_link` to upload the pdf file to the server side. Please refer to **`POST`** **Upload
File API**.

> 2-2. `Phase 2 Update` If the task is come from template, you would not need to upload the pdf file again. Call *
*`POST`** **Share Template Original File to SignTask Original File API** to link original file from which template
> instead.

> 3 . Wait the socket send the message which event is `task_uploaded`. If you don't have socket server or socket is not
> workable, just set a timeout trigger and call the **`GET`** **Read Sign Task API** to check the task status is `draft`
> and xfdf_ready is `true`.

> 4-1. If the action is **save to a draft task**, the create draft task processing is already done.

> 4-2. If the action is **create and invite task**, next you need to call **`POST`** **Start Draft Task API** to start
> the draft task to send the email for sign request.

# Request Header

| Parameters    | Value                   | Required | Description                |
|---------------|-------------------------|----------|----------------------------|
| Authorization | Bearer {{access_token}} | `O`      | Member Identity.           |
| Content-Type  | `application/json`      | `O`      | Request Body Content Type. |

# Request Body

| Parameter                   |                                            Type                                             | Required | Description                                                                                                                                            |
|-----------------------------|:-------------------------------------------------------------------------------------------:|:--------:|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| file_name                   |                                          `String`                                           |   `O`    | Task file name.                                                                                                                                        |
| has_order                   |                                          `Boolean`                                          |   `O`    | Signers should sign sequentially if it is `true`.                                                                                                      |
| stages                      |              `Array of` [SignStage Request Object](#signstage-request-object)               |   `O`    | SignStage Request Object.                                                                                                                              |
| deadline                    |                                          `Integer`                                          |   `X`    | Deadline Timestamp.                                                                                                                                    |
| forget_remind               |                                          `Boolean`                                          |   `X`    | Signer will receive reminders if they have not finished signing in 2 and 6 days if the task is still not signed. Default as member preference setting. |
| expire_remind               |                                          `Boolean`                                          |   `X`    | Signer will receive reminders if the task is about to expire. Default as member preference setting.                                                    |
| remind_days_before_expire   |                                          `Integer`                                          |   `*`    | Required if `expire_remind` is `true`. Default as member preference setting.                                                                           |
| cc_info                     |     `Array of` [TaskSetting CcInfo Request Object](#tasksetting-ccinfo-request-object)      |   `X`    | TaskSetting CcInfo Request Object.                                                                                                                     |
| message                     |                                          `String`                                           |   `X`    | Custom message that signer will see when task is processing.                                                                                           |
| completed_message           |                                          `String`                                           |   `X`    | Custom message that signer will see when task is completed.                                                                                            |
| receiver_lang               |                                          `String`                                           |   `X`    | Create a task for sending emails with a language , default to English . Available language include: `en`,`zh-tw`                                       |
| reference_setting           | [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object) |   `X`    | TaskSetting ReferenceSetting Request Object.                                                                                                           |
| completed_reference_setting | [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object) |   `X`    | TaskSetting ReferenceSetting Request Object.                                                                                                           |
| need_ca                     |                                          `Boolean`                                          |   `X`    | You can setting completed file with CA if you have the CA authority                                                                                    |
| client                      |                                          `String`                                           |   `O`    | `web` or `app`, to verify the source come from.                                                                                                        |
| ip_address                  |                                          `String`                                           |   `O`    | Task owner's ip_address, in order to record the sign event.                                                                                            |

# SignStage Request Object

| Parameter              |                                                 Type                                                 | Required | Description                                                |
|------------------------|:----------------------------------------------------------------------------------------------------:|:--------:|------------------------------------------------------------|
| email                  |                                               `String`                                               |   `*`    | Signer email, required for **task** creation and update.   |
| name                   |                                               `String`                                               |   `*`    | Signer name, required for **task** creation and update.    |
| role                   |                                               `String`                                               |   `*`    | Signer role, required for **template** creation and update |
| attachment_settings    | `Array of` [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) |   `X`    | SignStage AttachmentSetting Object                         |
| custom_message_setting |   [SignStage CustomMessageSetting Request Object](#signstage-custommessagesetting-request-object)    |   `X`    | SignStage CustomMessage Request Object                     |
| xfdf_info              |                           `Array of` [Xfdf Info Object](#xfdf-info-object)                           |    O     | Xfdf infomation object.                                    |
| stage_setting          |                     [StageSetting Request Object](#stagesetting-request-object)                      |   `X`    | StageSetting Request Object.                               |
| verify                 |                  `Array of` [Otp Verify Request Object](#otp-verify-request-object)                  |   `X`    | Otp Verify Request Object.                                 |

# Xfdf Info Object

| Parameters | Required                                     | Description                                                                                                                                                             |
|------------|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| field_type | O, `String`                                  | What field type need to assign: `signature`, `textfield` or `checkbox`.                                                                                                 |
| object_id  | O, `String`                                  | {{pdf_object_id}}，self-created from client side with UUID format. Ex: `JackRabbit_0af8d8f0-b335-11e9-9f0b-71fc684c0184`. It must including at `pdf_object_info` arrray. |
| coord      | O, `Float Array`                             | The position for current filed object. ex: `[279.9301130524152, 703.4744864264838, 363.775950668037, 731.4230989650245]`                                                |
| page       | O, `Integer`                                 | The page for current signature object. Start from `0`                                                                                                                   |
| style      | X, `Integer`                                 | Require if the field type is `checkbox`. `0` means `chekckbox` and `1` means `radio button`.                                                                            |
| is_date    | X, `Boolean`                                 | Require if the field type is `textfiled`. `true` means this textfield is `datefield` type.                                                                              |
| options    | `Hash of` [Options Object](#options-object). | More detail settings.                                                                                                                                                   |

# TaskSetting CcInfo Request Object

| Parameter |   Type   | Required | Description |
|-----------|:--------:|:--------:|-------------|
| email     | `String` |   `O`    | Cc email.   |
| name      | `String` |   `O`    | Cc Name.    |

# TaskSetting ReferenceSetting Request Object

| Parameter    |   Type   | Required | Description                  |
|--------------|:--------:|:--------:|------------------------------|
| reference_id | `String` |   `O`    | Unique key in the same task. |
| file_name    | `String` |   `O`    | Reference name.              |
| type         | `String` |   `O`    | Including `pdf`, `png`.      |

# SignStage AttachmentSetting Request Object

| Parameter              |   Type    | Required | Description                                                          |
|------------------------|:---------:|:--------:|----------------------------------------------------------------------|
| attachment_id          | `String`  |   `X`    | Unique key in the same task, **will be changed by backend server**.  |
| file_name              | `String`  |   `O`    | Attachment name.                                                     |
| force                  | `Boolean` |   `O`    | Signer must upload attachment or not.                                |
| viewable_in_processing | `Boolean` |   `X`    | Signer can view viewable attachments or not when task is processing. |

# StageSetting Request Object

| Parameter                          |       Type        | Required | Description                                                                                                                                                                                                                                    |
|------------------------------------|:-----------------:|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| forward_enable                     |     `Boolean`     |   `X`    | Signer can forward the stage to others or not, default `true` for owner but `false` for signer.                                                                                                                                                |
| decline_enable                     |     `Boolean`     |   `X`    | Signer can decline the task or not, default `false` for owner but `true` for signer.                                                                                                                                                           |
| viewable_in_processing             |     `Boolean`     |   `X`    | Signer can view viewable attachments or not when task is processing.                                                                                                                                                                           |
| viewable_in_processing_attachments | `Array of String` |   `X`    | Which attachment can signer view, required if `viewable_in_processing` is `true`. Should contain all viewable `attachment_id` defined in [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) by default. |
| viewable_in_completed              |     `Boolean`     |   `X`    | Signer can view the merged attachment or not when task is completed.                                                                                                                                                                           |

# Otp Verify Request Object

| Parameters    | Type     | Required | Description                                                                                                                      |
|---------------|----------|----------|----------------------------------------------------------------------------------------------------------------------------------|
| verify_type   | `String` | `O`      | Verify type. Available: `email` , `phone` ,`cht_personal` ,`cht_company` or `signer_detect`                                      |
| verify_source | `String` | `O`      | Currently only `phone` and `signer_detect` are used, enter the phone number and the country code                                 |
| occassion     | `String` | `O`      | The occasion currently only `sign` and  `read` are used, choose the appropriate verification method according to your situation. |
| sequence      | `String` | `O`      | Order for signer. Ignore it when `has_order` is `false`. Start from `1`                                                          |

# SignStage CustomMessageSetting Request Object

| Parameter           |   Type    | Required | Description      |
|---------------------|:---------:|:--------:|------------------|
| processing_viewable | `Boolean` |   `X`    | Default `false`. |
| completed_viewable  | `Boolean` |   `X`    | Default `false`. |

# Options Object

| Parameters    | Type      | Required | Description                                                                                                                                                                                             |
|---------------|-----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| force         | `Boolean` | X        | `true` when this field is must required to sign. `false`                                                                                                                                                |
| date_setting  | `String`  | X        | Only `datefield` type need to set.`no_limit`: any date. `current_only`: only today can be choose. `future_enable`: only future date can be choose. `past_enable`: only date before today can be choose. |
| is_multi_line | `Boolean` | X        | Only field_type `textfield` has this option. `true` will allow signer to switch line.                                                                                                                   |
| font_size     | `Integer` | `X`      | Used for `textfield`, default `14`, range from `8` to `34`.                                                                                                                                             |
| visible_ca    | `Boolean` | `X`      | Used for `signature`, default `false`. If `true`, signer can use visible CA.                                                                                                                            |

# Response

Response body extends [SignTask Object](#signtask-object), and it contains additional info belows.

| Parameter               |                             Type                              | Nullable? | Description                                                                             |
|-------------------------|:-------------------------------------------------------------:|:---------:|-----------------------------------------------------------------------------------------|
| upload_link             |                           `String`                            |    `X`    | Upload the pdf file to the server side. Please refer to **`POST`** **Upload File API**. |
| attachment_upload_infos | [Attachment UploadInfo Object](#attachment-uploadinfo-object) |    `O`    | It will be null.                                                                        |
