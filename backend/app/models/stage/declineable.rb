class Stage
  module Declineable
    extend ActiveSupport::Concern

    def allowed_to_decline?(member_id)
      return false if source.owner_id == member_id
      actor_id == member_id && stage_setting.present? && stage_setting.decline_enable
    end
  end
end