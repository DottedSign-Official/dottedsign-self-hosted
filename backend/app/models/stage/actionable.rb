class Stage
  module Actionable
    extend ActiveSupport::Concern

    included do
      scope :still_no_action, -> { where(status: [:initial, :processing]) }
      scope :on_going, -> { where.not(status: [:done, :declined, :canceled]) }
      scope :started, -> { where(status: [:processing, :signed, :modifying, :reviewed]) }
      scope :acting, -> { where(status: [:processing, :modifying, :reviewed]) }
      scope :filled, -> { where(status: [:signed, :done]) }
      scope :finished, -> { where(status: [:done, :declined, :canceled]) }

      # signer
      scope :signing, -> { where(action: [:sign], status: [:processing, :modifying]) }

      # reviewer
      scope :reviewing, -> { where(action: [:review], status: [:processing]) }
    end
  
    def on_going?
      !finished?
    end

    def started?
      processing? || signed? || modifying? || reviewed?
    end

    def acting?
      processing? || modifying? || reviewed?
    end

    def filled?
      signed? || done?
    end
  
    def finished?
      done? || declined? || canceled?
    end

    def signing?
      action_sign? && (processing? || modifying?)
    end

    def reviewing?
      action_review? && processing?
    end
  end
end
