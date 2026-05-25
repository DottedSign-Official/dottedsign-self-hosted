module Normal
  class ReviewVerify < Verify

    attr_reader :base_stage

    def initialize(task_id, member, review_info, client_info)
      @task_id = task_id
      @member = member
      @review_info = review_info
      @client_info = client_info
    end

    def call
      check_client
      check_task(check_action: 'review_task')
      check_stage
      detect_action_mode
      executable_check
    end

    def check_stage
      @stage = @task.sign_stages.action_review.acting.order(:sequence).find_by(actor_id: @actor.id)
      raise ServiceError.new(:not_signer_turn) if @stage.nil?
      @base_stage = @stage.base_stage
    end

    def executable_check
      review_fields_check
      review_attachments_check
    end

    def review_fields_check
      review_fields = @review_info[:review_fields].pluck(:field_object_id)
      raise ServiceError.new(:invalid_params, error_message: 'invalid review fields') unless @base_stage.pdf_object_info.length == review_fields.length
      raise ServiceError.new(:invalid_params, error_message: 'invalid review fields') if (@base_stage.pdf_object_info - review_fields).present?
    end

    def review_attachments_check
      review_attachments = @review_info[:review_attachments]&.pluck(:attachment_id) || []
      reviewable_attachment_ids = @base_stage.attachments.pluck(:label)
      raise ServiceError.new(:invalid_params, error_message: 'invalid review attachments') unless reviewable_attachment_ids.length == review_attachments.length
      raise ServiceError.new(:invalid_params, error_message: 'invalid review attachments') if (reviewable_attachment_ids - review_attachments).present?
    end
  end
end
