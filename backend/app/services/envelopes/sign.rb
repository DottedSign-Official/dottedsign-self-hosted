module Envelopes
  class Sign < ServiceCaller

    def initialize(envelope_id, member, sign_info, client_info)
      @envelope_id = envelope_id
      @member = member
      @sign_info = sign_info
      @client_info = client_info
    end

    def call
      verify_for_sign # will setup attachment files if needed (cannot be in transaction)

      ActiveRecord::Base.transaction do
        change_status
        sign_the_tasks
      end

      record_sign_event # not the main flow (no need to be in transaction)
      @result = envelope_info
    end

    private

    def verify_for_sign
      verify = Verify.call(@envelope_id, @member, @sign_info, @client_info)
      if verify.failed?
        raise ServiceError.new(:system_ca_not_found) if verify.error.message.match?(/system_ca_not_found/)
        raise verify.error
      end
      @envelope = verify.envelope
      @stage = verify.stage
      @action_mode = verify.action_mode
      @signer = verify.member
    end

    def change_status
      @stage.processing_file!
    end

    def sign_the_tasks
      sign_stages = SignStage.specific_sequence_in_envelope(@envelope.id, @stage.sequence)
      stage_pdf_object_infos_by_task = sign_stages.group_by(&:sign_task_id).transform_values { |stages|  stages.flat_map(&:pdf_object_info) }
      @envelope.sign_tasks.each do |task|
        signature_info = @sign_info[:signature_info].select { |signature| stage_pdf_object_infos_by_task[task.id].include?(signature[:object_id]) }
        sign_info = @sign_info.merge(signature_info: signature_info)
        sign_the_task = Normal::Sign.call(task.id, @signer, sign_info, @client_info, skip_verify: true)
        raise sign_the_task.error if sign_the_task.failed?
      end
    end

    def record_sign_event
      stage_info = @stage.basic_info
      stage_info[:other_info] = { 'stage_last_action' => true } if @stage.done?
      @envelope.add_sign_event(:signed, @signer.id, stage_info: stage_info, client_info: @client_info, other_info: { action_mode: @action_mode })
    end

    def envelope_info
      envelope_info = @envelope.display(@member.id)
      envelope_info[:after_sign_category] = @envelope.category_after_stage_sign(@stage)
      envelope_info
    end
  end
end
