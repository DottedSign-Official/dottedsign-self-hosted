## Request Header
| Parameters | Description |
| --- | --- |
| **Content-Type** | application/json |

# Request Body

**You can use either template_id or template_code.**
**if given `template_code` and `template_id` at same time, it will used to find template instead of `template_id`.**

| Parameters | Type | Required  | Description |
| --- |--- |  --- | --- |
| member_id | `Integer` | O | Member ID. |
| template_id | `Integer`| △ | Template ID. |
| template_code | `String`| △ | Template Code. |
| file_name | `String` | O | Template file name. |
| client |`String` | O, | `web` or `app`, to verify the source come from. |
| ip_address | `String`| O | Template owner's ip_address, in order to record the sign event. |
| file |  `String`| X | pdf file encode to base64 if you want change base pdf |
| forget_remind | `Boolean` | X |  Signer will receive reminders if they have not finished signing in 2 and 6 days if the task is still not signed. Default as member preference setting. |
| expire_remind | `Boolean` | X |  Signer will receive reminders if the task is about to expire. Default as member preference setting. |
| with_sign_url | `Boolean` |  X | The response will return quick sign url if it is `true`   |
| stages | `Array of` [Stages Object](#stages-object)|O | Sign stage information object. |
| receiver_lang | `String` | X | Create a task for sending emails with a language , default to English . Available language include: `en`,`zh-tw` |
| need_ca | `Boolean`| X | You can setting completed file with CA if you have the CA authority  |

# Stages Object
| Parameters | Type | Required  | Description |
| --- |--- |  --- | --- |
| email | `String` | O | Signer email. |
| name | `String` | O |Signer name. |
| role | `String` | O |Signer role. |
| stage_setting | `Object of` [StageSetting Request Object](#stagesetting-request-object) | O|Request Schema StageSetting Request Object. |
| verify |`Array of` [Otp Verify Request Object](#otp-verify-request-object) | X  |Otp Verify Request Object. |

# StageSetting Request Object
| Parameter | Type | Required | Description |
| --------- | :----: | :------: | ----------- |
| forward_enable | `Boolean` | `X` | Signer can forward the stage to others or not, default `true` for owner but `false` for signer. |
| decline_enable | `Boolean` | `X` | Signer can decline the task or not, default `false` for owner but `true` for signer. |

# Otp Verify Request Object
| Parameters | Type | Required | Description |
| --- | --- | --- | --- |
| **verify_type** | `String` | `O` | Verify type. Available: `email` , `phone` ,`cht_personal` ,`cht_company` or `signer_detect` |
| **verify_source** | `String` | `O` | Currently only `phone` and `signer_detect` are used, enter the phone number and the country code  |
| **occassion** | `String` | `O` |  The occasion type Available: `sign` and `read` params  |
| **sequence** | `String` | `O` | Order for signer. Ignore it when `has_order` is `false`. Start from `1` |
