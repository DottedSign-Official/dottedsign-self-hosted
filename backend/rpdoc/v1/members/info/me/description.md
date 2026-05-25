# Description

Obtain the member preference setting.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |

# Query Parameters

None.

# Response

Response Body extends [Member Object](#member-object), and it contains additional info belows.

| Parameter | Type | Nullable? | Description |
| --------- | :--: | :-------: | ----------- |
| signatures | `Array of `[Signature Object](#signature-object) | `O` | Member name. |
