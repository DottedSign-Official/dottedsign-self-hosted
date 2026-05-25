class Api::V1::FormTaskEntity < Api::V1::SignTaskEntity
  # override parent exposes
  expose :access_info do |task|
    task.access_info(options[:current_member], check_stage: options[:service]&.stage, actions: [:view])
  end

  # custom action data came from services
  def form_read
    info = options[:service].result
    info[:xfdf_ready] = task.xfdf_ready?
    info[:image_info] = image_info
    info[:reference_links] = task.reference_download_links(member_id: options[:current_member].try(:id))
    info
  end

  def form_sign
    options[:service].result
  end
end
