# Description

Get the country list.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| **Authorization** | Bearer {{access_token}} | `O` | Member Identity. |

# Query Parameters

| Parameters | Required | Description |
| --- | --- | --- |
| **lang** | X | Display language of country name, if not provided, Default is `en`. Current available lang: `en`, `ja`, `zh-CN`, `zh-TW`. |

# Response

Return status `200` and data: Array of  [Country List Object](#country-list-object) .

# Country List Object

| Property Name | Value | Description |
| --- | --- | --- |
| **name** | `String` | Country name. |
| **alpha2** | `String` | Country alpha-2 code. |
| **alpha3** | `String` | Country alpha-3 code. |
| **calling_code** | `String` | Country calling codes. |
