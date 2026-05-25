TimezoneMapping = {hour_zone: {}, zone_hour: {}}

ActiveSupport::TimeZone.all.each do |zone|
  hour = zone.utc_offset / 60.0 / 60.0
  zone_name = zone.tzinfo.name
  TimezoneMapping[:hour_zone][hour] = zone_name
  TimezoneMapping[:zone_hour][zone_name] = hour >= 0 ? "+#{hour}" : hour.to_s
end

# in_time_zone method can not support +14, only -12 ~ +13, must use 'Etc/GMT-14'.
TimezoneMapping[:hour_zone][14.0] = 'Etc/GMT-14'
TimezoneMapping[:zone_hour]['Etc/GMT-14'] = '+14.0'

TimezoneMapping[:hour_zone].default = 'Etc/UTC'
TimezoneMapping[:zone_hour].default = '+0.0'
