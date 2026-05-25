module Convertible
  extend ActiveSupport::Concern

  def png?
    file_type == 'png'
  end

  def file_type
    File.extname(self.raw_file.file.filename.to_s).strip[1..]
  end

  def update_to_png!
    return if png?
    convert = ImageConvert.call(raw_file_base64)
    raise convert.error if convert.failed?

    is_force_upload = ActiveRecord::Base.connection.transaction_open? # In sign, it call DataInsert's update_to_png!. It uses a transaction and may error without force_upload.
    self.raw_file.upload(io: StringIO.new(Base64.decode64(convert.result)), content_type: 'image/png', filename: 'file.png', skip_callback: true, force_upload: is_force_upload)
    self.update!(file_type: 'png') if self.class.name == 'Signature'
  end
end
