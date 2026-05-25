class ShareSetting < ApplicationRecord
  belongs_to :shared, polymorphic: true
  belongs_to :target, polymorphic: true

  PER_PAGE = 10

  class << self
    def setup(sharable, target)
      setting = ShareSetting.find_or_initialize_by(shared: sharable, target: target)
      setting.save!
      setting
    end

    def remove(sharable, target)
      setting = ShareSetting.find_by(shared: sharable, target: target)
      setting.destroy! if setting.present?
    end
  end

end
