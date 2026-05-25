class SignTask
  module Signable
    extend ActiveSupport::Concern

    include TaskRelated::Signable

    def digit_cert_on_stage?
      stages.with_signers.any?(&:need_stage_cert?)
    end

    def visible_ca_on_stage?
      stages.with_signers.any?(&:is_visible_ca?)
    end

  end
end
