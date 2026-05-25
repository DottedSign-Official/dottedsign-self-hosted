class Api::V1::SystemCaEntity < BaseEntity
  expose :id
  expose :name

  expose :secret_info, merge: true, if: { show_secret_info: true } do
    expose :cluster_id
    expose :token
    expose :email
    expose :accessor_emails, as: :members
  end
end
