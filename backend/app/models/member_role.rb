class MemberRole < ApplicationRecord
  belongs_to :member
  belongs_to :role
end
