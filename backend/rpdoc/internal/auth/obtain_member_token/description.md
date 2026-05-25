# Description

Get Member Access Token.

# Request Header

None


# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| client_id | `String` | `O` | Client UID. |
| client_secret | `String` | `O` | Client Secret. |
| email | `String` | `O` | Account Email. |

# Response

| Parameter | Type |  Description |
| --------- | ---- |  ----------- |
| access_token | `String` |  Access Token. |
| token_type | `String` |  Access Token Type. |
| expires_in | `Integer` | Access Token Expire in seconds. |
| refresh_token | `String` |  Refresh Token. |
| created_at | `Integer` |  Access Token Create Timestamp. |
| for_app | `String` | Access Token from application name. |
