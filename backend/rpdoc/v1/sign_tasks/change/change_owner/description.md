# Description

Change the owner of an existing sign task.

# Endpoint

| Method | Path |
| --- | --- |
| `POST` | `/api/v1/sign_tasks/{sign_task_id}/change_owner` |

# Path Parameter

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sign_task_id` | `Integer` | `O` | Identifier of the sign task that needs a new owner. |

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `X` | Required for authenticated members. |
| **Content-Type** | `application/json` | `X` | Request body content type. |

# Request Body

| Parameters | Type | Required? | Description |
| --- | --- | --- | --- |
| **new_owner** | [NewOwner Request Object](#newowner-request-object) | `O` | Data for the member who will become the new owner. |

# Example Request

```json
{
    "new_owner": {
        "email": "test@example.com"
   }
}
```

# NewOwner Request Object

| Parameters | Type | Required | Description |
| --- | --- | --- | --- |
| email | `String` | `O` | Email of the new owner. Must belong to an existing member. |

# Response

| Property Name | Type | Nullable? | Description |
| --- | --- | --- | --- |
| **new_owner** | `String` | `X` | The owner name of the task that was updated. |

# Example Response

```json
{
    "data": {
        "new_owner": "nick"
    }
}
```

# Notes
- Changing the owner of a sign task will also update the group association to match that of the new owner.

