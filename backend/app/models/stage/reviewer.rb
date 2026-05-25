class Stage
  module Reviewer
    extend ActiveSupport::Concern

    included do
      has_many :review_logs, as: :stage, dependent: :destroy
    end

    def base_stage
      sign_task.sign_stages.find_by(id: actor_info['base_stage_id'])
    end

    def sibling_review_stages(include_self: false)
      @sibling_review_stages ||= sign_task.sign_stages.action_review.where("(actor_info ->> 'base_stage_id')::integer = ?", actor_info['base_stage_id'])
      include_self ? @sibling_review_stages : @sibling_review_stages.where.not(id: id)
    end

    def trigger_next_review
      next_review = sibling_review_stages.initial.find_by(sequence: sequence + 1)
      return if next_review.blank?
      next_review.do_processing
    end
  
    def trigger_complete_review
      return unless sibling_review_stages.pluck(:status).all?('done')
      base_stage.reviewed!
      base_stage.before_done if base_stage.skip_confirm?
      Notification::ConfirmMailWorker.perform_async(base_stage.id)
    end
  
    def do_pass
      self.done!
      trigger_next_review
      trigger_complete_review
    end

    def do_reject(reject_message=nil)
      sibling_review_stages(include_self: true).update_all(status: 'initial')
      base_stage.do_modify(reviewer_id: actor_id, message: reject_message)
    end

    def had_acted?
      sign_events.where(action_name: [:review_passed, :review_rejected]).present?
    end
  end
end
