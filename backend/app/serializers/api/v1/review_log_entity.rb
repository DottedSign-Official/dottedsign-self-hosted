class Api::V1::ReviewLogEntity < BaseEntity
  expose :reviewed_at do |review_log|
    review_log.created_at.to_i
  end

  expose :reviewed_by do |review_log|
    {
      name: review_log.stage.actor_display_name,
      email: review_log.stage.email
    }
  end

  expose :reviewed_message

  expose :reviewed_fields do |review_log|
    review_log.reviewed_fields&.each do |reviewed_field|
      reviewed_field['field_type'] = field_object_id_map[reviewed_field['field_object_id']].field_type
    end
  end

  expose :reviewed_attachments

  private

  alias :review_log :object

  def field_object_id_map
    review_log.stage.base_stage.field_settings.index_by(&:field_object_id) || {}
  end
end
