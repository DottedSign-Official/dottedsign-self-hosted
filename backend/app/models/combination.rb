class Combination < ApplicationRecord
  prepend ::Groupable
  include Accessible
  include Searchable
  include Shareable
  include GroupSearchable if GROUP_USE

  belongs_to :owner, class_name: "Member", foreign_key: "owner_id"
  belongs_to :group, optional: true
  has_many :dummy_stages, -> { display_order }, as: :source

  def stages
    dummy_stages
  end
end
