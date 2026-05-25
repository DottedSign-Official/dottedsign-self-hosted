class Api::V1::DeclineReasonEntity < BaseEntity
  expose :id, :status, :system_reserved, :content, :created_at, :updated_at
end
