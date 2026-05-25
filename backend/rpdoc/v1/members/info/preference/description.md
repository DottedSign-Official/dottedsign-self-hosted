# Description

Update the member preference setting.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **date_format** | `String` | `X` | Member preference: date format. `yyyy/mm/dd` (Default), `dd/mm/yyyy`, `yyyy-mm-dd` or `dd-mm-yyyy`. |
| **forget_remind** | `Boolean` | `X` | Member preference: Recipients will receive automatic reminders if they have not finished signing in 2 days and will get another one after 6 days if the document is still not signed. |
| **expire_remind** | `Boolean` | `X` | Member preference: Send an expiry reminder email to inform the recipient the signing task is about to expire if it is `true`. |
| **remind_days_before_expire** | `Integer` | `X` | Member preference: Send an expiry reminder email to inform the recipient the signing task is about to expire before N days if expire_remind is `true`. |
| **otp_via_email** | `Boolean` | `X` | Member preference: receive a one-time password in member email if is `true`. |
| **otp_via_phone** | `Boolean` | `X` | Member preference: receive a one-time password in mobile message if is `true`. |
| **phone_code** | `String` | `X` | require if otp_via_phone is `true`. |
| **phone_number** | `String` | `X` | require if otp_via_phone is `true`. |
| **receiver_lang** | `String` | `X` | Language of the notification mail to signers. (For those who do not have account only) Default is `en`. |
| **force_receiver_otp** | `Boolean` | `X` | Force your recipients use one-time password to authenticate their identity before sign a document if it is `true`. |

# Response

See [Member Object](#member-object)
