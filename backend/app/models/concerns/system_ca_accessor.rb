module SystemCaAccessor
  extend ActiveSupport::Concern
  included do
    has_many :system_ca_access_rights, as: :accessor, dependent: :destroy
    has_many :system_cas, as: :accessor, through: :system_ca_access_rights
  end
end
