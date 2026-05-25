class Api::Internal::TaskInfoEntity < BaseEntity
  expose :id, as: :task_id

  expose :file_name
  expose :status
  expose :task_owner_email do |task|
    task.owner.email
  end
  expose :stage_infos
  expose :created_at do |task|
    task.created_at.to_i
  end

  alias :task :object

  def current_stages
    return @current_stages if @current_stages.present?
    stage_status = task.completed? ? 'done' : 'processing'
    @current_stages = task.sign_stages.select { |stage| stage.status == stage_status }
  end

  def stage_infos
    task.sign_stages.map do |stage|
      stage_attachment_hash = stage.attachment_setting.map { |item| [item["attachment_id"], item["file_name"]] }.to_h
      {
        signer_email: stage.email,
        status: stage.status,
        field_settings: stage.field_settings.select { |field_setting| field_setting.custom_id.present? }.map do |field_setting|
          {
            field_type: field_setting.field_type,
            field_value: field_setting.field_value,
            custom_id: field_setting.custom_id
          }
        end,
        attachments: stage.attachments.map do |attachment|
          {
            name: stage_attachment_hash[attachment.label],
            download_url: attachment.internal_download_link
          }
        end
      }
    end
  end

end
