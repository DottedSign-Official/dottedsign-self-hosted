class AddDefaultAvatarAction < ActiveRecord::Migration[6.1]
  def up
    upload_default_avatar
  end

  def down
  end

  private

  def upload_default_avatar
    file_name = "user_icon.png"
    content_type = "image/png"
    file = Rails.root.join('public', 'user_icon.png')
    image = Image.create!
    image.upload_service_file('default_avatar', io: File.open(file), content_type: content_type, filename: file_name, skip_callback: true)
  end
end
