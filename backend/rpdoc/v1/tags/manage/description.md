# Description

Add the tag on the sign task, envelope or template.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Request Body

| Parameters | Value | Required? | Description |
| --- | --- | --- | --- |
| **taggable_type** | `String` | `O` | The Object Type of Item which tag will be attach on. Current Available Types: \[`Template`,`SignTask`,`Envelope`,`Batch`\]<br>If you want to batch update multiple sign tasks and envelopes, use `Batch`. |
| **taggable_id** | `Integer`, `Array of Integer`, `Object` | `O` | The Object ID of Item which tag will be attach on. <br> - When `Integer`: The ID of the target item.<br> - When `Array of Integer`: An array of IDs of the target items.<br> - When `Object`:  If `taggable_type` is `Batch`, you **must** use object to specify `SignTask` and `Envelope` ids.<br> For example: <br> `{"task_ids": [1, 2, 3], "envelope_ids": [4, 5, 6]}`  |
| **add_tags** | `Array of String` | `C` | All Tag Names which will be attach to the taggable item. The values must exist at member's tag list. |
| **remove_tags** | `Array of String` | `C` | All Tag Names which will be remove from the taggable item. The values must exist at member's tag list. |

# Response

Object with tag_name as key, boolean as value.

| Property Name | Value | Nullable? | Description |
| --- | --- | --- | --- |
| **\[Tag Name\]** | `Boolean` | `X` | `true` if tag is appended to target. |
