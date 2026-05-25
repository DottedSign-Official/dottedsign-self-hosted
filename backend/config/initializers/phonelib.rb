Phonelib.default_country = "TW"

# parse special numbers (Short Codes, Emergency etc.)
Phonelib.parse_special = true

# allow vanity phone numbers conversion
Phonelib.vanity_conversion = true

# disable sanitizing of passed phone number (keeping digits only)
Phonelib.strict_check = true

# change sanitized symbols on parsed number, so non-specified symbols won't be wiped and will fail the parsing
Phonelib.sanitize_regex = '[\.\-\+]'
