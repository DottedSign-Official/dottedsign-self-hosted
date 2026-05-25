class ThumbnailMakerWorker < GeneralWorker

  def perform(file_id)
    maker = ThumbnailMaker.call(file_id)
    raise maker.error if maker.failed?
    thumbnail_path = maker.result
    maker.service_file.thumbnail.attach(io: File.open(thumbnail_path), content_type: 'image/png', filename: 'file.png')
  ensure
    FileUtils.rm_rf(maker.working_dir) if maker.working_dir.present?
  end

end
