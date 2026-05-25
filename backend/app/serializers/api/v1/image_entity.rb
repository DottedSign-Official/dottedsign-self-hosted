class Api::V1::ImageEntity < BaseEntity
  expose :id, as: :image_id
  expose :raw_file_base64, as: :raw

  expose :created_at do |image|
    image.created_at.to_i
  end
end
