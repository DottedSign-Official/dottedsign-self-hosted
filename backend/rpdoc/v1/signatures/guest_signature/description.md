# Description

Create a guest signature.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |


# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization**) header need to access this API. |
| **raw** | `String` | `O` | base64, image content. |
| **sign_video** | `String` | `X` | base64, sign video content. |

# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **id** | `Integer` | `X` | Signature ID. |
| **raw** | `String` | `X` | Base64 image content. |
| **created_at** | `String` | `X` | Created date. |
| **updated_at** | `String` | `X` | Updated date. |
