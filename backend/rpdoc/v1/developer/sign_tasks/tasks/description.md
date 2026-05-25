# Description

List all related tasks.

# Request Header

| Parameters        | Value                   | Required | Description      |
|-------------------|-------------------------|----------|------------------|
| **Authorization** | Bearer {{access_token}} | `O`      | Member Identity. |

# Query Parameters

| Parameters             | Required | Value      | Description                                                                    |
|------------------------|----------|------------|--------------------------------------------------------------------------------|
| **search_email**       | `X`      | `String`   | Search email                                                                   |
| **search_task_id**     | `X`      | `Interage` | Search task from id                                                            |
| **search_task_status** | `X`      | `String`   | Search Type: 'draft', 'waiting', 'completed', 'deleted', 'expired', 'declined' |
| **start_from**         | `X`      | `String`   | start date for time range. sample: `2024-01-01`                                |
| **end_at**             | `X`      | `String`   | end date for time range. sample: `2024-01-01`                                  |
| **search_ca_status**   | `X`      | `String`   | Search Type: `success`,`failed` or `ca_fail_retrying`                          |
| **page**               | `X`      | `Interage` | Default value is `1`                                                           |
| **per_page**           | `X`      | `Interage` | Default value is `50`                                                          |

# Response

| Parameter      |                            Type                            | Nullable? | Description          |
|----------------|:----------------------------------------------------------:|:---------:|----------------------|
| **task_infos** | `Array of` [SignTask Basic Object](#signtask-basic-object) |    `X`    | SignTask Basic Info. |

# SignTask Basic Object

| Parameter      |   Type    | Nullable? | Description                                                                         |
|----------------|:---------:|:---------:|-------------------------------------------------------------------------------------|
| **id**         | `Integer` |    `X`    | Task ID.                                                                            |
| **file_name**  | `String`  |    `O`    | Task filename.                                                                      |
| **status**     | `String`  |    `X`    | Task status. `draft` / `waiting` / `completed` / `expired` / `deleted` / `declined` |
| **created_at** | `String`  |    `X`    | Task create time. Format `YYYY-MM-DD`T`HH:MM:DD`Z                                   |
| **owner**      | `String`  |    `X`    | Task owner email.                                                                   |
| **viewable**   | `Boolean` |    `X`    | Is task viewable for members.                                                       |
| **ca_status**  | `String`  |    `X`    | Task ca status. `not_need` / `success` / `failed` / `ca_fail_retrying`              |
