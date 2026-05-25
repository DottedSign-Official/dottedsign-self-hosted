# Description

To download the pdf file.


# Query Parameters

Query Parameters extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **sign_task_id** | `Integer` | `O` | Sign Task ID. |
| **label** | `Integer` | `O` | What label you want to view: `completed` or `audit_trail` |
| **download_type** | `Integer` | `X` | `file` or `base64` , to download type , default is `base64` |

# Response

Return status `200` and direct downloading pdf file or download pdf base64 string.
