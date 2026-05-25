class PdfFormGenerateWorker < GeneralWorker

  def perform(storable_type, storable_id)
    generator = KmpdfTool::PdfFormGenerator.call(storable_type, storable_id)
    raise generator.error if generator.failed?

    formed_pdf = generator.result
    storable = generator.storable
    storable.upload_service_file('full', io: File.open(formed_pdf), content_type: 'application/pdf', filename: 'file.pdf')
  ensure
    FileUtils.rm_rf(generator.working_dir) if generator&.working_dir.present?
  end
end
