class Api::V1::FieldSettingGroupEntity < BaseEntity
  expose :field_group_object_id
  expose :field_group_type
  expose :full_options, as: :options
end