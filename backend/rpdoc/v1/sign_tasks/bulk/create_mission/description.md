# Description

To create the bulk mission.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. Required if member is login. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

Request body extends [Client Request Object](#client-request-object), and it contains additional info belows.

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **template_id** | `Integer` | `O` | Which template user want to use. |
| **tasks** | `Array` | `Array of` [Mission Task Object](#mission-task-object) | `O` |

# Mission Task Object

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **file_name** | `String` | `O` | Sign task's title. |
| **message** | `String` | `O` | What message you want to leave to signers. |
| **stages** | `Array` | `O` | `Array of` [Mission Stage Object](#mission-stage-object) |

# Mission Stage Object

If your template has `N` sign stages to ask to sign, you must give `N` stages information for inside.

| Parameters | Required | Value | Description |
| --- | --- | --- | --- |
| **email** | `String` | `O` | Signer's email. |
| **name** | `String` | `O` | Singer's name. |
| **role** | `String` | `O` | Singer's role. |

# Response

Return status `200` and data: `bulk_mission_object`.

# bulk_mission_object

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **bulk_uuid** | `String` | `X` | Unique bulk id. |
| **bulk_count** | `Integer` | `X` | How many sign requests are created. |
