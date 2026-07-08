# Description

Get the license info.

# Request Header

| Parameters | Value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | `application/json` | `O` | Request Body Content Type. |

# Response

Return status `200` and data: of `license_info_object`.

# license_info_object

| Property Name | Value | Description |
| --- | --- | --- |
| **starts_at** | `String` | License start time. |
| **expires_at** | `String` | License expire time. |
| **group_enable** | `Boolean` | Enable or disable group.   |
| **sign_task** | `Object` | Object of  [Sign Task Object](#sign-task-object). |
| **otp_verify** | `Object` | Object of [Otp Verify Object](#otp-verify-object). |
| **authenticate_member** | `Object` | Object of [Authenticate Member Object](#authenticate-member-object). |
| **certificate_authority** | `Object` | Object of [Certificate Authority Object](#certificate-authority-object). |


# Sign Task Object
| Property Name | Value | Description |
| --- | --- | --- |
| **kiosk_task_enable** | `Boolean` |  Enable or disable kiosk task  |
| **decline_task_enable** | `Boolean` |  Can decline task ?   |
| **change_signer_enable** | `Boolean` | Can change signer ?   |

# Otp Verify Object
| Property Name | Value | Description |
| --- | --- | --- |
| **smtp_enable** | `Boolean` |  Enable or disable SMTP for opt  |
| **sms_enable** | `Boolean` |  Enable or disable SMS for opt   |
| **cht_cert_enable** | `Boolean` | Enable or disable cht_cert for opt   |

# Authenticate Member Object
| Property Name | Value | Description |
| --- | --- | --- |
| **ldap_enable** | `Boolean` | Can this project use ldap login? |

# Certificate Authority Object
| Property Name | Value | Description |
| --- | --- | --- |
| **system_ca_enable** | `Boolean` |  Enable or disable system ca  |
