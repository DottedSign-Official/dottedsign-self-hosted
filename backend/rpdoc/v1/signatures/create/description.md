# Description

Create a signature.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization**) header need to access this API. |
| **category** | `String` | `O` | Only allow type is `stamp`, `initial` or `signature`. |
| **file_type** | `String` | `O` | Only allow image file is `png`, `svg`, `jpg` or `jpeg`. |
| **raw** | `String` | `O` | base64, image content. |
| **sign_video** | `String` | `X` | base64, sign video content. |

# Response
See [Signature Object](#signature-object).
