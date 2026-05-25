class Api::V1::ProfileEntity < BaseEntity
  expose :language
  expose :full_name
  expose :first_name
  expose :telephone
  expose :nationality
  expose :address
  expose :organization
end
