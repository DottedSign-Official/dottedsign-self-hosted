class Stage
  module Reviewee
    extend ActiveSupport::Concern

    included do
      has_many :sign_logs, as: :stage, dependent: :destroy
    end

    def skip_confirm?
      stage_setting&.reviewed_skip_confirm
    end

    def review_stages
      @review_stages ||= sign_task.sign_stages.action_review.where("(actor_info ->> 'base_stage_id')::integer = ?", id)
    end

    def last_review_log
      @last_review_log ||= ReviewLog.where(stage: review_stages).order(:created_at).last
    end

    def last_sign_log
      @last_sign_log ||= SignLog.where(stage: self).order(:created_at).last
    end

    def do_modify(reviewer_id: nil, message: nil)
      clean_signature_fields
      self.modifying!
      Notification::ModifyMailWorker.perform_async(id, reviewer_id, message)
    end

    def clean_signature_fields
      field_settings.where(field_type: 'signature').update_all(field_value: nil)
    end

    def had_acted?
      sign_events.where(action_name: [:signed]).present?
    end
  end
end
