class Api::V1::SignLogEntity < BaseEntity
  expose :stage_id, as: :signed_stage_id

  expose :signed_fields do |sign_log|
    sign_log.signed_fields&.each do |signed_field|
      signed_field['field_type'] = field_object_id_map[signed_field['field_object_id']].field_type
    end
  end

  expose :signed_attachments

  private

  alias :sign_log :object

  def field_object_id_map
    sign_log.stage.field_settings.index_by(&:field_object_id) || {}
  end
end
