# Description

Member Login.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **client_id** | `String` | `O` | Client UID. |
| **client_secret** | `String` | `O` | Client Secret. |
| **email** | `String` | `O` | Account Email. |
| **password** | `String` | `O` | Account Password. |

# Response
Response Body extends [Member Object](#member-object), and it contains additional info belows.

| Parameter | Type | Nullable? | Description |
| --------- | :--: | :-------: | ----------- |
| token_info | [Token Object](#token-object) | `X` | Token Object. |
