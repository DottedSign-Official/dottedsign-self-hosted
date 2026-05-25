class SystemCaAccessRight < ApplicationRecord
  belongs_to :system_ca
  belongs_to :accessor, polymorphic: true

  validates :accessor_id, uniqueness: { scope: [:accessor_type, :system_ca_id] }
end
