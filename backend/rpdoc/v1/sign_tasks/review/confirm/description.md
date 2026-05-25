### Description
Confirm the task. Server would record a `confirmed` event in audit trail and return task info.

### Request
#### Request Header
See [General Header Object](#gerenal-header-object).

### Request Body
| Parameter   |                                       Type                                        | Required | Description                                                                |
|:------------|:---------------------------------------------------------------------------------:|:--------:|:---------------------------------------------------------------------------|
| task_id     |                                     `Integer`                                     |   `O`    | Task ID.                                                                   |
| verify_info | [VerifyMethod VerifyInfo Request Object](#verifymethod-verifyinfo-request-object) |   `X`    | VerifyMethod VerifyInfo Request Object.                                    |

Steps (if signer needs verification):
1. Client should call API without `verify_info`, and server would send OTP to user and return corresponding `uuid`.
2. Client should call API with `verify_info`, including `uuid` and user received OTP code as `verify_data`. Server would verify the code and return task info.

### Response
#### Response Body
See [SignTask Object](#signtask-object).
