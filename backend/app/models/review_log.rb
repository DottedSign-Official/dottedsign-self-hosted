class ReviewLog < ApplicationRecord
  belongs_to :source, polymorphic: true
  belongs_to :stage, polymorphic: true
  belongs_to :sign_event

end
