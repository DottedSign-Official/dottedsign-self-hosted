# Description

Oauth login by password.

# Request Body

| Parameter | Type | Required? | Description |
| --------- | ---- | --------- | ----------- |
|  client_id | String | `O` | the uid of application |
|  client_secret | String | `O` | secret of application |
|  grant_type | String | `O` | `password` |
|  email    | String | `O` | the email of member |
|  password | String | `O` | password of member |
|  provider    | String | `X` | provider name, support list: `ldap`. use database authenticate if not given |

# Response Body

| Parameter | Type | Nullable? | Description |
| --------- | ---- | --------- | ----------- |
|  access_token | String | `X` | the access token |
|  token_type | String | `X` | token type|
|  expires_in | Integer | `X` | expired time |
|  refresh_token | String | `X` | refresh token |
|  created_at | Integer | `X` | created timestamp |
