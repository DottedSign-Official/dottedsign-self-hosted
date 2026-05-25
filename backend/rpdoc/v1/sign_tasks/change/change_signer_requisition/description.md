# Description

To request change signer and send the email to the task owner.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Member Identity. Required if member is login. |
| **Content-Type** | `application/json` | `O` | Request Body Content Type. |

# Request Body

Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **code** | `String` | `X` | Task preview code. Required if not registered member (without **Authorization** header) need to access this API. |
| **sign_task_id** | `Integer` | `O` | Sign task ID. |
| **message** | `String` | `X` | The message to the task owner. **Required** if new_signer is not given. |
| **new_signer** | [NewSigner Request Object](#newsigner-request-object) | `X` | NewSigner Request Object. |

# Response

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **request_sent_to** | `String` | `X` | task owner's display name |
