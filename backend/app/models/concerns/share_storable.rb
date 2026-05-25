module ShareStorable

  def upload_link_for(label)
    service_file = ServiceFile.setup_for(self, label)
    service_file.upload_link
  end

  def upload_service_file(label, *args, **keywords)
    service_file = ServiceFile.setup_for(self, label)
    service_file.upload(*args, **keywords)
  end

  def download_link_for(label)
    service_file = service_files.find_by(label: label)
    return if service_file.nil?
    service_file.download_link
  end

  def remove_service_file(label)
    service_file = service_files.find_by(label: label)
    service_file.destroy if service_file.present?
  end

end
