class Role < ApplicationRecord
  belongs_to :group
  has_many :member_roles, dependent: :destroy
  has_many :members, through: :member_roles

  RESERVED_NAME = %i[admin manager member].freeze

  class << self
    def change_priorities(sorted_role_ids)
      transaction do
        raise if sorted_role_ids.length != count

        sorted_role_ids.each_with_index do |role_id, index|
          priority = index + 1
          role = find(role_id)
          raise ArgumentError if role.admin? && priority != 1

          role.update!(priority: priority)
        end
      end
    end
  end

  def reserved?
    RESERVED_NAME.include?(name.to_sym)
  end

  def admin?
    name.to_sym == :admin
  end
end
