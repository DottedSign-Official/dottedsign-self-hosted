module PdfReader
  def download_and_read_page(file_path, service_file)
    file = service_file.download_to_local(file_path)
    raise ServiceError.new(:file_not_ready) if file.nil?

    read_pdf_page(file_path)
  end

  def read_pdf_page(file_path)
    reader = PDF::Reader.new(file_path)
    reader.page_count
  rescue
    raise ServiceError.new(:incorrect_pdf_file)
  end
end
