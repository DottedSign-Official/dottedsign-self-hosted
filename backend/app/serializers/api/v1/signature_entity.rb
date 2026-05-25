class Api::V1::SignatureEntity < BaseEntity
  expose :id, :member_id, :category, :file_type, :created_at, :updated_at
  expose :raw_file_base64, as: :raw
end