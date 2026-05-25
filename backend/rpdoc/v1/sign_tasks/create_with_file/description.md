# Request Header

| Parameters    | Description             |
|---------------|-------------------------|
| Content-Type  | application/json        |
| Authorization | Bearer {{access_token}} |

# Request Body

| Parameters                  | Type                                                                                        | Required | Description                                                                                                                                            |
|-----------------------------|---------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| file_name                   | `String`                                                                                    | O        | Template file name.                                                                                                                                    |
| client                      | `String`                                                                                    | O        | `web` or `app`, to verify the source come from.                                                                                                        |
| ip_address                  | `String`                                                                                    | O        | Template owner's ip_address, in order to record the sign event.                                                                                        |
| has_order                   | `Boolean`                                                                                   | O        | The template has sign sequentially if it is `true`.                                                                                                    |
| file                        | `String`                                                                                    | O        | pdf file encode to base64                                                                                                                              |
| with_sign_url               | `Boolean`                                                                                   | X        | The response will return quick sign url if it is `true`                                                                                                |
| need_ca                     | `Boolean`                                                                                   | X        | You can setting completed file with CA if you have the CA authority                                                                                    |
| deadline                    | `Integer`                                                                                   | X        | Deadline Timestamp.                                                                                                                                    |
| forget_remind               | `Boolean`                                                                                   | X        | Signer will receive reminders if they have not finished signing in 2 and 6 days if the task is still not signed. Default as member preference setting. |
| expire_remind               | `Boolean`                                                                                   | X        | Signer will receive reminders if the task is about to expire. Default as member preference setting.                                                    |
| remind_days_before_expire   | `Integer`                                                                                   | X        | Required if `expire_remind` is `true`. Default as member preference setting.                                                                           |
| message                     | `String`                                                                                    | X        | Custom message that signer will see when task is processing.                                                                                           |
| completed_message           | `String`                                                                                    | X        | Custom message that signer will see when task is completed.                                                                                            |
| receiver_lang               | `String`                                                                                    | X        | Create a task for sending emails with a language , default to English . Available language include: `en`,`zh-tw`                                       |
| need_ca                     | `Boolean`                                                                                   | X        | You can setting completed file with CA if you have the CA authority                                                                                    |
| reference_setting           | [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object) | X        | TaskSetting ReferenceSetting Request Object.                                                                                                           |
| completed_reference_setting | [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object) | X        | TaskSetting ReferenceSetting Request Object.                                                                                                           |
| cc_info                     | `Array of` [TaskSetting CcInfo Request Object](#tasksetting-ccinfo-request-object)          | X        | TaskSetting CcInfo Request Object.                                                                                                                     |
| stages                      | `Array of` [Stages Object](#stages-object)                                                  | O        | Sign stage infomation object.                                                                                                                          |

# TaskSetting ReferenceSetting Request Object

| Parameter    |    Type     |           Required           | Description |
|--------------|:-----------:|:----------------------------:|-------------|
| reference_id | O, `String` | Unique key in the same task. |
| file_name    | O, `String` |       Reference name.        |
| type         | O, `String` |   Including `pdf`, `png`.    |

# TaskSetting CcInfo Request Object

| Parameter |   Type   | Required | Description |
|-----------|:--------:|:--------:|-------------|
| email     | `String` |   `O`    | Cc email.   |
| name      | `String` |   `O`    | Cc Name.    |

# Stages Object

| Parameters          | Type                                                                                                 | Required | Description                                                                                                  |
|---------------------|------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------|
| email               | `String`                                                                                             | `O`      | stage signer email.                                                                                          |
| name                | `String`                                                                                             | `O`      | stage signer Name.                                                                                           |
| pdf_object_info     | `String Array`                                                                                       | O        | Signer's pdf_object_id. It means which sign fields are belongs to the signer. Generated uuid by client side. |
| xfdf_info           | `Array of` [Xfdf Info Object](#xfdf-info-object)                                                     | O        | Xfdf infomation object.                                                                                      |
| stage_setting       | `Object of` [StageSetting Request Object](#stagesetting-request-object)                              | O        | Request Schema StageSetting Request Object.                                                                  |
| verify              | `Array of` [Otp Verify Request Object](#otp-verify-request-object)                                   | `X`      | Otp Verify Request Object.                                                                                   |
| attachment_settings | `Array of` [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) | `X`      | SignStage AttachmentSetting Object                                                                           |

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

# StageSetting Request Object

| Parameter                          |       Type        | Required | Description                                                                                                                                                                                                                                    |
|------------------------------------|:-----------------:|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| forward_enable                     |     `Boolean`     |   `X`    | Signer can forward the stage to others or not, default `true` for owner but `false` for signer.                                                                                                                                                |
| decline_enable                     |     `Boolean`     |   `X`    | Signer can decline the task or not, default `false` for owner but `true` for signer.                                                                                                                                                           |
| viewable_in_processing             |     `Boolean`     |   `X`    | Signer can view viewable attachments or not when task is processing.                                                                                                                                                                           |
| viewable_in_processing_attachments | `Array of String` |   `X`    | Which attachment can signer view, required if `viewable_in_processing` is `true`. Should contain all viewable `attachment_id` defined in [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) by default. |
| viewable_in_completed              |     `Boolean`     |   `X`    | Signer can view the merged attachment or not when task is completed.                                                                                                                                                                           |

# SignStage AttachmentSetting Request Object

| Parameter              |   Type    | Required | Description                                                          |
|------------------------|:---------:|:--------:|----------------------------------------------------------------------|
| attachment_id          | `String`  |   `X`    | Unique key in the same task, **will be changed by backend server**.  |
| file_name              | `String`  |   `O`    | Attachment name.                                                     |
| force                  | `Boolean` |   `O`    | Signer must upload attachment or not.                                |
| viewable_in_processing | `Boolean` |   `X`    | Signer can view viewable attachments or not when task is processing. |

# Otp Verify Request Object

| Parameters    | Type     | Required | Description                                                                                      |
|---------------|----------|----------|--------------------------------------------------------------------------------------------------|
| verify_type   | `String` | `O`      | Verify type. Available: `email` , `phone` ,`cht_personal` ,`cht_company` or `signer_detect`      |
| verify_source | `String` | `O`      | Currently only `phone` and `signer_detect` are used, enter the phone number and the country code |
| occassion     | `String` | `O`      | The occasion type Available: `sign` and `read` params                                            |
| sequence      | `String` | `O`      | Order for signer. Ignore it when `has_order` is `false`. Start from `1`                          |

# Options Object

| Parameters       | Type                  | Required | Description                                                                                                                |
|------------------|-----------------------|----------|----------------------------------------------------------------------------------------------------------------------------|
| force            | `Boolean`             | `X`      | Used for all field_type, default `true` for `signature`, `textfield`, and `datefield`; otherwise `false`.                  |
| default          | `String` or `Boolean` | `X`      | Used for`textfield`(default `""`), `datefield`(default `null`), `checkbox`(default `false`), and `radio`(default `false`). |
| read_only        | `Boolean`             | `X`      | Used for`textfield`, `datefield`, `checkbox`, and `radio`, default `false`.                                                |
| is_multi_line    | `Boolean`             | `X`      | Used for`textfield`, default `false`.                                                                                      |
| font_size        | `Integer`             | `X`      | Used for `textfield`, default `14`, range from `8` to `34`.                                                                |
| font_size_fixed  | `Boolean`             | `X`      | Used for `textfield`, `datefield`, default `false`.                                                                        |
| alignment        | `String`              | `X`      | Used for all field type, default `left`, including `left`, `center`, and `right`.                                          |
| alignment_fixed  | `Boolean`             | `X`      | Used for `textfield`, `datefield`, default `false`.                                                                        |
| length           | `Integer`             | `X`      | Used for `textfield`, default `500`, range from `1` to `500`.                                                              |
| validation       | `String`              | `X`      | Used for `textfield`, default `null`, including `null`, `email`, `letters`, `numbers`, and `regex`.                        |
| validation_regex | `String`              | `X`      | Used for `textfield`, default `null` but except `validation` is `regex`, e.g., `[A-Za-z0-9]+`                              |
| date_format      | `String`              | `X`      | Used for `datefield`, default `yyyy/mm/dd`, but member preference is preferred.                                            |
| date_setting     | `String`              | `X`      | Used for `datefield`, default `current_only`, including `current_only`, `future_enable`, `past_enable`, and `no_limit`.    |
| zone             | `Boolean`             | `X`      | Used for `datefield`, default `0`.                                                                                         |
| visible_ca       | `Boolean`             | `X`      | Used for `signature`, default `false`. If `true`, signer can use visible CA.                                               |
