module Referenceable

  def reference_files
    uploaded_files.select { |file| /^reference_/.match?(file.label) }
  end

  def completed_reference_files
    uploaded_files.select { |file| /^completed_reference_/.match?(file.label) }
  end

  def reference_setting
    setting&.reference_setting || []
  end

  def completed_reference_setting
    setting&.completed_reference_setting || []
  end

  # Upload Links

  def reference_upload_links
    reference_setting.map { |setting| setting.merge(upload_link: upload_link_for(setting['reference_id'])) }
  end

  def completed_reference_upload_links
    completed_reference_setting.map { |setting| setting.merge(upload_link: upload_link_for(setting['reference_id'])) }
  end

  # Download Links

  def reference_download_links(member_id: nil)
    can_view_processing_message?(member_id: member_id) ? reference_setting.map { |setting| download_link_for(setting['reference_id']) } : []
  end

  def completed_reference_download_links(member_id: nil)
    can_view_completed_message?(member_id: member_id) ? completed_reference_setting.map { |setting| download_link_for(setting['reference_id']) } : []
  end

  def can_view_processing_message?(member_id: nil)
    return true if owner_id == member_id

    stage = stages.find_by(actor_id: member_id)
    return false if stage.nil?

    stage.custom_message_setting['processing_viewable']
  end

  def can_view_completed_message?(member_id: nil)
    return true if owner_id == member_id
    return false if respond_to?(:completed?) && !completed?

    stage = stages.find_by(actor_id: member_id)
    return false if stage.nil?

    stage.custom_message_setting['completed_viewable']
  end

end