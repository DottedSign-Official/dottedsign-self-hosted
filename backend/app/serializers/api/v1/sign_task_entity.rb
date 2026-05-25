class Api::V1::SignTaskEntity < BaseEntity
  expose :id, as: :task_id

  expose :file_name
  expose :sign_type
  expose :has_order
  expose :status
  expose :thumbnail_info, as: :thumbnail
  expose :task_owner_info
  expose :stage_infos
  expose :verify_info
  expose :download_info, merge: true, if: { with_download_info: true }
  expose :image_info, if: { with_image_info: true }

  expose :access_info do |task|
    task.access_info(options[:current_member])
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

  expose :created_at do |task|
    task.created_at.to_i
  end

  expose :modified_at do |task|
    task.modified_at.to_i
  end

  expose :tag_info do |task|
    task.tag_info_for(options[:current_member])
  end

  alias :task :object

  def download_info
    {
      download_link: task.download_link_for('original')
    }
  end

  def current_stages
    return @current_stages if @current_stages.present?
    stage_action = task.completed? ? 'done' : 'acting'
    @current_stages = task.sign_stages.select { |stage| stage.send("#{stage_action}?") }
  end

  def task_owner_info
    {
      name: (task.owner_id == options[:current_member].try(:id)) ? 'Me' : task.owner.display_name,
      sequence: 0,
      email: task.owner.email,
      status: :send,
      icon_url: task.owner.icon_url
    }
  end

  def stage_infos
    @stage_entities ||= Api::V1::TaskStageEntity.represent(task.stages, options)
  end

  def decline_reasons
    return Api::V1::DeclineReasonEntity.represent(DeclineReason.active_system_reserved) if options[:current_member].try(:group).nil?

    Api::V1::DeclineReasonEntity.represent(options[:current_member].group.active_system_and_group_decline_reasons)
  end

  def setting_info
    if task.task_setting.nil?
      owner_preference = task.owner.preferences
      setting_attrs = {
        forget_remind: owner_preference['forget_remind'],
        need_otp_verify: owner_preference['force_receiver_otp'],
        receiver_lang: owner_preference['receiver_lang']
      }
      TaskSetting.setup_from_request(task.owner_id, task.id, setting_attrs)
    end
    Api::V1::TaskSettingEntity.represent(task.task_setting, options)
  end

  def image_info
    return @image_info if @image_info.present?
    image_ids = task.field_settings.where(field_type: 'image').pluck(:field_value).compact
    @image_info = {
      images: Image.with_attached_file.where(id: image_ids).map { |image| { id: image.id, raw: image.raw_file_base64 } }
    }
  end

  def normal_read
    review_info = {}
    review_info.merge!(Api::V1::ReviewLogEntity.represent(options[:service].viewing_stage&.last_review_log).as_json || {}) if options[:service].stage&.signing? || options[:service].stage&.reviewing?
    review_info.merge!(Api::V1::SignLogEntity.represent(options[:service].viewing_stage&.last_sign_log).as_json || {}) if options[:service].stage&.reviewing?
    {
      download_link: task.download_link_for('original'),
      complete_link: task.download_link_for('completed'),
      reference_links: task.reference_download_links(member_id: options[:current_member].try(:id)),
      completed_reference_links: task.completed_reference_download_links(member_id: options[:current_member].try(:id)),
      xfdf_ready: task.xfdf_ready?,
      viewable_attachments: options[:service].result&.slice(:viewable_attachments)&.dig(:viewable_attachments),
      review_info: review_info,
      current_available_actions: options[:service].result.dig(:current_available_actions).to_a
    }
  end

  def kiosk_read
    {
      download_link: task.download_link_for('original'),
      reference_links: task.reference_download_links(member_id: options[:current_member].try(:id)),
    }
  end

  def kiosk_sign
    {}
  end

  def verify_info
    return unless options[:service].present?
    {
      identity_verify_token: options[:service].result[:identity_verify_token]
    }
  end

end
