- [Client Request Object](#client-request-object)
- [Group DeclineOption Request Object](#group-declineoption-request-object)
- [SignTask Request Object](#signtask-request-object)
- [SignTask Basic Request Object](#signtask-basic-request-object)
- [Template Request Object](#template-request-object)
- [Template Basic Request Object](#template-basic-request-object)
- [TaskSetting Request Object](#tasksetting-request-object)
- [TaskSetting CcInfo Request Object](#tasksetting-ccinfo-request-object)
- [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object)
- [Otp Verify Request Object](#otp-verify-request-object)
- [SignStage Request Object](#signstage-request-object)
- [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object)
- [SignStage CustomMessageSetting Request Object](#signstage-custommessagesetting-request-object)
- [FieldSetting Request Object](#fieldsetting-request-object)
- [FieldSetting Options Request Object](#fieldsetting-options-request-object)
- [StageSetting Request Object](#stagesetting-request-object)
- [SignatureInfo Request Object](#signatureinfo-request-object)
- [AttachmentInfo Request Object](#attachmentinfo-request-object)
- [VerifyData Request Object](#verifydata-request-object)
- [NewSigner Request Object](#newsigner-request-object)
- [KioskStage Request Object](#kioskstage-request-object)
- [KioskRequisite Request Object](#kioskrequisite-request-object)
- [KioskOther Request Object](#kioskother-request-object)

# Client Request Object

| Parameter            |    Type    |  Required  | Description                                                 |
| -------------------- | :--------: | :--------: | ----------------------------------------------------------- |
| **client**     | `String` |   `O`   | `web` or `app`, to verify the source come from.         |
| **ip_address** | `String` |   `O`   | Task owner's ip_address, in order to record the sign event. |
| **work_id**    |   `X`   | `String` | Require if quick sign.                                      |

# Group DeclineOption Request Object

| Parameter |    Type    | Required | Description |
| --------- | :--------: | :------: | ----------- |
| content   | `String` |  `O`  | content     |

# SignTask Request Object

SignTask Request Object extends [SignTask Basic Request Object](#signtask-basic-request-object), with [TaskSetting Request Object](#tasksetting-request-object).

# SignTask Basic Request Object

| Parameter |                              Type                              | Required | Description                                         |
| --------- | :-------------------------------------------------------------: | :------: | --------------------------------------------------- |
| file_name |                           `String`                           |  `O`  | Task file name.                                     |
| has_order |                           `Boolean`                           |  `O`  | Signers should sign sequentially if it is `true`. |
| stages    | `Array of` [SignStage Request Object](#signstage-request-object) |  `O`  | SignStage Request Object.                           |

# Template Request Object

Template Request Object extends [Template Basic Request Object](#template-basic-request-object), with [TaskSetting Request Object](#tasksetting-request-object).

# Template Basic Request Object

| Parameter |                              Type                              | Required | Description                                         |
| --------- | :-------------------------------------------------------------: | :------: | --------------------------------------------------- |
| file_name |                           `String`                           |  `O`  | Task file name.                                     |
| has_order |                           `Boolean`                           |  `O`  | Signers should sign sequentially if it is `true`. |
| stages    | `Array of` [SignStage Request Object](#signstage-request-object) |  `O`  | SignStage Request Object.                           |
| tags      |                       `Array of String`                       |  `X`  | Tags, e.g.,`[tag1, tag2]`                         |

# TaskSetting Request Object

| Parameter                   |                                           Type                                           | Required | Description                                                                                                                                            |
| --------------------------- | :--------------------------------------------------------------------------------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| deadline                    |                                       `Integer`                                       |  `X`  | Deadline Timestamp.                                                                                                                                    |
| forget_remind               |                                       `Boolean`                                       |  `X`  | Signer will receive reminders if they have not finished signing in 2 and 6 days if the task is still not signed. Default as member preference setting. |
| expire_remind               |                                       `Boolean`                                       |  `X`  | Signer will receive reminders if the task is about to expire. Default as member preference setting.                                                    |
| remind_days_before_expire   |                                       `Integer`                                       |  `*`  | Required if `expire_remind` is `true`. Default as member preference setting.                                                                       |
| cc_info                     |    `Array of` [TaskSetting CcInfo Request Object](#tasksetting-ccinfo-request-object)    |  `X`  | TaskSetting CcInfo Request Object.                                                                                                                     |
| message                     |                                        `String`                                        |  `X`  | Custom message that signer will see when task is processing.                                                                                           |
| completed_message           |                                        `String`                                        |  `X`  | Custom message that signer will see when task is completed.                                                                                            |
| receiver_lang               |                                        `String`                                        |  `X`  | Create a task for sending emails with a language , default to English . Available language include:`en`,`zh-tw`                                    |
| reference_setting           | [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object) |  `X`  | TaskSetting ReferenceSetting Request Object.                                                                                                           |
| completed_reference_setting | [TaskSetting ReferenceSetting Request Object](#tasksetting-referencesetting-request-object) |  `X`  | TaskSetting ReferenceSetting Request Object.                                                                                                           |
| need_ca                     |                                       `Boolean`                                       |  `X`  | You can setting completed file with CA if you have the CA authority                                                                                    |

# TaskSetting CcInfo Request Object

| Parameter |    Type    | Required | Description |
| --------- | :--------: | :------: | ----------- |
| email     | `String` |  `O`  | Cc email.   |
| name      | `String` |  `O`  | Cc Name.    |

# TaskSetting ReferenceSetting Request Object

| Parameter    |    Type    | Required | Description                  |
| ------------ | :--------: | :------: | ---------------------------- |
| reference_id | `String` |  `O`  | Unique key in the same task. |
| file_name    | `String` |  `O`  | Reference name.              |
| type         | `String` |  `O`  | Including `pdf`, `png`.  |

# SignStage Request Object

| Parameter              |                                                Type                                                | Required | Description                                                     |
| ---------------------- | :-------------------------------------------------------------------------------------------------: | :------: | --------------------------------------------------------------- |
| email                  |                                             `String`                                             |  `*`  | Signer email, required for**task** creation and update.   |
| name                   |                                             `String`                                             |  `*`  | Signer name, required for**task** creation and update.    |
| role                   |                                             `String`                                             |  `*`  | Signer role, required for**template** creation and update |
| action                 |                                             `String`                                             |  `*`  | Signer action, including `sign` and `review`. Default `sign`.  |
| attachment_settings    | `Array of` [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) |  `X`  | SignStage AttachmentSetting Object                              |
| custom_message_setting |    [SignStage CustomMessageSetting Request Object](#signstage-custommessagesetting-request-object)    |  `X`  | SignStage CustomMessage Request Object                          |
| xfdf_info              |                `Array of` [FieldSetting Request Object](#fieldsetting-request-object)                |  `O`  | FieldSetting Request Object.                                    |
| stage_setting          |                      [StageSetting Request Object](#stagesetting-request-object)                      |  `X`  | StageSetting Request Object.                                    |
| verify                 |                  `Array of` [Otp Verify Request Object](#otp-verify-request-object)                  |  `X`  | Otp Verify Request Object.                                      |

# SignStage AttachmentSetting Request Object

| Parameter                          |        Type        | Required | Description                                                                                                                                                                                                                                       |
| ---------------------------------- | :-----------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attachment_id                      |     `String`     |  `X`  | Unique key in the same task,**will be changed by backend server**.                                                                                                                                                                          |
| file_name                          |     `String`     |  `O`  | Attachment name.                                                                                                                                                                                                                                  |
| force                              |     `Boolean`     |  `O`  | Signer must upload attachment or not.                                                                                                                                                                                                             |
| viewable_in_processing             |     `Boolean`     |  `X`  | Signer can view viewable attachments or not when task is processing.                                                                                                                                                                              |
| viewable_in_processing_attachments | `Array of String` |  `X`  | Which attachment can signer view, required if `viewable_in_processing` is `true`. Should contain all viewable `attachment_id` defined in [SignStage AttachmentSetting Request Object](#signstage-attachmentsetting-request-object) by default. |
| viewable_in_completed              |     `Boolean`     |  `X`  | Signer can view the merged attachment or not when task is completed.                                                                                                                                                                              |

# SignStage CustomMessageSetting Request Object

| Parameter           |    Type    | Required | Description        |
| ------------------- | :---------: | :------: | ------------------ |
| processing_viewable | `Boolean` |  `X`  | Default `false`. |
| completed_viewable  | `Boolean` |  `X`  | Default `false`. |

# FieldSetting Request Object

| Parameter  |                                   Type                                   | Required | Description                                                                                                                                  |
| ---------- | :----------------------------------------------------------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
| field_type |                                `String`                                |  `O`  | Including `signature`, `textfield`, `datefield`, `checkbox`, `radio`, `systemtime`                                               |
| object_id  |                                `String`                                |  `O`  | Field object ID generated by frontend (current style follows regex format `/DottedSign\_[a-z0-9-]+/`),  should be unique in the same task. |
| custom_id  |                                `String`                                |  `O`  | Field user custom ID,  should be unique in the same task.                                                                                    |
| page       |                               `Integer`                               |  `O`  | The page for current signature object. Start from `0`.                                                                                     |
| coord      |                             `Float Array`                             |  `O`  | The position for current field object, e.g.,`[100.10, 200.20, 300.30, 400.40]`.                                                            |
| options    | [FieldSetting Options Request Object](#fieldsetting-options-request-object) |  `O`  | FieldSetting Options Request Object.                                                                                                         |

# FieldSetting Options Request Object

| Parameter        |           Type           | Required | Description                                                                                                                                 |
| ---------------- | :-----------------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------- |
| force            |        `Boolean`        |  `X`  | Used for all field_type, default `true` for `signature`, `textfield`, and `datefield`; otherwise `false`.                         |
| default          | `String` or `Boolean` |  `X`  | Used for `textfield`(default `""`), `datefield`(default `null`), `checkbox`(default `false`), and `radio`(default `false`). |
| read_only        |        `Boolean`        |  `X`  | Used for `textfield`, `datefield`, `checkbox`, and `radio`, default `false`.                                                      |
| is_multi_line    |        `Boolean`        |  `X`  | Used for `textfield`, default `false`.                                                                                                  |
| font_size        |        `Integer`        |  `X`  | Used for `textfield`, default `14`, range from `8` to `34`.                                                                         |
| font_size_fixed  |        `Boolean`        |  `X`  | Used for `textfield`, `datefield`, default `false`.                                                                                   |
| alignment        |        `String`        |  `X`  | Used for all field_tpye, default `left`, including `left`, `center`, and `right`.                                                   |
| alignment_fixed  |        `Boolean`        |  `X`  | Used for `textfield`, `datefield`, default `false`.                                                                                   |
| length           |        `Integer`        |  `X`  | Used for `textfield`, default `500`, range from `1` to `500`.                                                                       |
| validation       |        `String`        |  `X`  | Used for `textfield`, default `null`, including `null`, `email`, `letters`, `numbers`, and `regex`.                           |
| validation_regex |        `String`        |  `X`  | Used for `textfield`, default `null` but except `validation` is `regex`, e.g., `[A-Za-z0-9]+`                                     |
| date_format      |        `String`        |  `X`  | Used for `datefield`, default `yyyy/mm/dd`, but member preference is preferred.                                                         |
| date_setting     |        `String`        |  `X`  | Used for `datefield`, default `current_only`, including `current_only`, `future_enable`, `past_enable`, and `no_limit`.         |
| zone             |        `Boolean`        |  `X`  | Used for `datefield`, default `0`.                                                                                                      |

# StageSetting Request Object

| Parameter      |    Type    | Required | Description                                                                                         |
| -------------- | :---------: | :------: | --------------------------------------------------------------------------------------------------- |
| forward_enable | `Boolean` |  `X`  | Signer can forward the stage to others or not, default `true` for owner but `false` for signer. |
| decline_enable | `Boolean` |  `X`  | Signer can decline the task or not, default `false` for owner but `true` for signer.            |

# SignatureInfo Request Object

| Parameter   |                   Type                   | Required | Description                                                                                                                                                                  |
| ----------- | :--------------------------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| object_id   |                `String`                |  `O`  | Sign Field Object ID.                                                                                                                                                        |
| type        |                `String`                |  `O`  | Sign Field Type. Available:`signature` / `guest_signature` / `checkbox` / `radio` / `textfield` / `datefield`                                                    |
| value       | `Integer` or `Boolean` or `String` |  `O`  | Sign Field Value.`Integer` if type `signature` or `guest_signature`, `Boolean` if type `checkbox` or `radio`, `String` if type `textfield` or `datefield`. |
| font_size   |               `Integer`               |  `X`  | Used for `textfield`, default `14`, range from `8` to `34`.                                                                                                          |
| alignment   |                `String`                |  `X`  | Used for all field_tpye, default `left`, including `left`, `center`, and `right`.                                                                                    |
| date_format |                `String`                |  `X`  | Used for `datefield`, default `yyyy/mm/dd`, but member preference is preferred.                                                                                          |
| zone        |               `Boolean`               |  `X`  | Used for `datefield`, default `0`.                                                                                                                                       |
| changed     |               `Boolean`               |  `X`  | Used for frontend to record the field is changed or not.                                                                              |

> **注意：If type params is signature or guest_signature, should call create signature/guest_signature api first, and then set signature_id/guest_signature_id as value params**

# AttachmentInfo Request Object

| Parameters      | Value      | Required | Description                                     |
| --------------- | ---------- | -------- | ----------------------------------------------- |
| attachment_id   | `String` | `O`    | Attachment ID get from task info.               |
| attachment_type | `String` | `O`    | File type of the attachment. ex: pdf/png/jpg... |

# VerifyData Request Object

| Parameters  | Type       | Required | Description                                                                                                                                                                                      |
| ----------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| uuid        | `String` | `O`    | What uuid you obtain. Obtain uuid at the**`error response`** **Sign the Task failed (need otp verify)** or **`POST`** **Trigger Verify Again (Send OTP Again) API**. |
| verify_data | `String` | `O`    | What the code member receive at email or mobile SMS message.                                                                                                                                     |

# NewSigner Request Object

| Parameters | Type       | Required | Description                |
| ---------- | ---------- | -------- | -------------------------- |
| name       | `String` | `O`    | New signer's name.         |
| email      | `String` | `O`    | New signer's email.        |
| phone      | `String` | `O`    | New signer's phone number. |

# KioskStage Request Object

| Parameters | Type                                                        | Required | Description                    |
| ---------- | ----------------------------------------------------------- | -------- | ------------------------------ |
| role       | `String`                                                  | `O`    | Stage Role.                    |
| requisite  | [KioskRequisite Request Object](kioskrequisite-request-object) | `O`    | KioskRequisite Request Object. |
| others     | [KioskOther Request Object](kioskother-request-object)         | `O`    | KioskOther Request Object.     |

# KioskRequisite Request Object

| Parameter |    Type    | Required | Description                                                              |
| --------- | :--------: | :------: | ------------------------------------------------------------------------ |
| name      | `String` |  `O`  | Name Requisite for Kiosk Signer. Available:`required` / `optional`.  |
| email     | `String` |  `O`  | Email Requisite for Kiosk Signer. Available:`required` / `optional`. |
| phone     | `String` |  `O`  | Phone Requisite for Kiosk Signer. Available:`required` / `optional`. |

# KioskOther Request Object

| Parameter  |    Type    | Required | Description                  |
| ---------- | :---------: | :------: | ---------------------------- |
| informable | `boolean` |  `O`  | If signer need email notify. |

# Otp Verify Request Object

| Parameters    | Type       | Required | Description                                                                                                                          |
| ------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| verify_type   | `String` | `O`    | Verify type. Available:`email` , `phone` ,`cht_personal` ,`cht_company` or `signer_detect`                                 |
| verify_source | `String` | `O`    | Currently only `phone` and `signer_detect` are used, enter the phone number and the country code                                 |
| occassion     | `String` | `O`    | The occasion currently only `sign` and  `read` are used, choose the appropriate verification method according to your situation. |
| sequence      | `String` | `O`    | Order for signer. Ignore it when `has_order` is `false`. Start from `1`                                                        |
