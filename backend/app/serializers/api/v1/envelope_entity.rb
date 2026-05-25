class Api::V1::EnvelopeEntity < BaseEntity
  expose :id, as: :envelope_id
  expose :envelope_name
  expose :sign_type
  expose :has_order
  expose :status
  expose :thumbnail_info, as: :thumbnail
  expose :task_infos, if: { with_task_infos: true }
  expose :stage_infos
  expose :envelope_owner_info
  expose :verify_info
  expose :download_info, merge: true, if: { with_download_info: true }
  expose :image_info, if: { with_image_info: true }

  expose :access_info do |envelope|
    envelope.access_info(options[:current_member])
  end

  expose :full_info, merge: true, unless: :batch do
    expose :current_stage_ids do |_|
      current_stages.pluck(:id)
    end

    expose :current_member_turn do |_|
      current_stages.pluck(:actor_id).include?(options[:current_member].try(:id))
    end

    expose :setting_info, merge: true
  end

  expose :decline_reasons

  expose :created_at do |envelope|
    envelope.created_at.to_i
  end

  expose :modified_at do |envelope|
    envelope.modified_at.to_i
  end

  expose :tag_info do |envelope|
    envelope.tag_info_for(options[:current_member])
  end

  alias :envelope :object

  def stage_infos
    stage_options = options.merge(task_stages_by_sequence: envelope.group_task_stages_by_sequence(with_xfdf: options[:with_xfdf])) unless options[:batch]
    @stage_entities ||= Api::V1::EnvelopeStageEntity.represent(envelope.stages, stage_options)
  end

  def envelope_owner_info
    {
      name: (envelope.owner_id == options[:current_member].try(:id)) ? 'Me' : envelope.owner.display_name,
      sequence: 0,
      email: envelope.owner.email,
      status: :send,
      icon_url: envelope.owner.icon_url
    }
  end

  def verify_info
    return unless options[:service].present?
    {
      identity_verify_token: options[:service].result[:identity_verify_token]
    }
  end

  def download_info
    {
      download_link: envelope.download_link_for('original')
    }
  end

  def current_stages
    return @current_stages if @current_stages.present?
    stage_status = envelope.completed? ? 'done' : 'processing'
    @current_stages = envelope.dummy_stages.select { |stage| stage.status == stage_status }
  end

  def setting_info
    if envelope.envelope_setting.nil?
      owner_preference = envelope.owner.preferences
      setting_attrs = {
        forget_remind: owner_preference['forget_remind'],
        need_otp_verify: owner_preference['force_receiver_otp'],
        receiver_lang: owner_preference['receiver_lang']
      }
      EnvelopeSetting.setup_from_request(envelope.owner_id, envelope.id, setting_attrs)
    end
    Api::V1::EnvelopeSettingEntity.represent(envelope.envelope_setting, options)
  end

  def decline_reasons
    return Api::V1::DeclineReasonEntity.represent(DeclineReason.active_system_reserved) if options[:current_member].try(:group).nil?

    Api::V1::DeclineReasonEntity.represent(options[:current_member].group.active_system_and_group_decline_reasons)
  end

  def image_info
    return @image_info if @image_info.present?
    image_ids = FieldSetting.where(source_type: 'SignTask', source_id: envelope.sign_tasks.pluck(:id), field_type: 'image').pluck(:field_value).compact
    @image_info = {
      images: Image.with_attached_file.where(id: image_ids).map { |image| { id: image.id, raw: image.raw_file_base64 } }
    }
  end

  def envelopes_read
    {
      download_link: envelope.download_link_for('original'),
      complete_link: envelope.download_link_for('completed'),
      reference_links: envelope.reference_download_links(member_id: options[:current_member].try(:id)),
      completed_reference_links: envelope.completed_reference_download_links(member_id: options[:current_member].try(:id)),
      xfdf_ready: envelope.xfdf_ready?,
      viewable_attachments: options[:service].result&.slice(:viewable_attachments)&.dig(:viewable_attachments),
      image_info: image_info
    }
  end

end
