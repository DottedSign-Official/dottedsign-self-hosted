class Api::V1::TemplateEntity < BaseEntity
  expose :id, as: :template_id
  expose :file_name
  expose :owner_id
  expose :has_order
  expose :status
  expose :code
  expose :thumbnail
  expose :share_info
  expose :created_at

  expose :full_info, merge: true, unless: :batch do
    expose :detail
    expose :setting_info, merge: true
    expose :download_link, if: { with_download_link: true }
    expose :upload_link, if: { with_upload_link: true }
    expose :tags, if: { with_tag: true }
    expose :reference_upload_links
    expose :completed_reference_upload_links
  end

  private

  alias :template :object

  def thumbnail
    template.original_file&.download_link(attach_type: 'thumbnail', will_expired: false)
  end

  def share_info
    template.share_info(options[:current_member].try(:id))
  end

  def created_at
    template.created_at.to_i
  end

  def detail
    @template_stage_entity ||= Api::V1::TemplateStageEntity.represent(template.stages, options)
  end

  def setting_info
    if template.template_setting.nil?
      owner_preference = template.owner.preferences
      setting_attrs = {
        forget_remind: owner_preference['forget_remind'],
        need_otp_verify: owner_preference['force_receiver_otp'],
        receiver_lang: owner_preference['receiver_lang']
      }
      TemplateSetting.setup_from_request(template.owner_id, template.id, setting_attrs)
    end
    Api::V1::TemplateSettingEntity.represent(template.template_setting, options)
  end

  def download_link
    template.download_link_for('original')
  end

  def upload_link
    template.upload_link_for('original')
  end

  def tags
    template.tag_info_for(options[:current_member].try(:id))
  end

end
