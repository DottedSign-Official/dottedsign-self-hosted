# Description

Oauth refresh token.

# Request Body

| Parameter | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
|  client_id | String | `O` | the uid of application |
|  client_secret | String | `O` | secret of application |
|  grant_type | String | `O` | `refresh_token` |
|  refresh_token    | String | `O` | refresh_token |

# Response Body

| Parameter | Type | Nullable? | Description |
| --------- | ---- | --------- | ----------- |
|  access_token | String | `X` | the access token |
|  token_type | String | `X` | token type|
|  expires_in | Integer | `X` | expired time |
|  refresh_token | String | `X` | refresh token |
|  created_at | Integer | `X` | created timestamp |
