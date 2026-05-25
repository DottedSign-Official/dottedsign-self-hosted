class Api::V1::FieldSettingEntity < BaseEntity
  expose :field_object_id
  expose :field_group_object_id
  expose :custom_id
  expose :field_type
  expose :field_value
  expose :coord
  expose :page
  expose :options

  expose :photo_link, if: -> (field_setting) { field_setting.field_type == 'signature' && field_setting.options['photo'] == true } do |field_setting|
    signature_class = field_setting.options['signature_type']&.camelize&.safe_constantize || Signature
    signature_class.find_by(id: field_setting.field_value)&.photo_file&.download_link
  end

  private

  alias :field_setting :object

  def field_group_object_id
    field_setting.field_setting_group&.field_group_object_id
  end
end
