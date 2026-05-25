module Envelopes
  class Read < Normal::Read
    attr_reader :source, :stage

    def initialize(envelope_id, member, read_info, client_info)
      @envelope_id = envelope_id
      @member = member
      @read_info = read_info
      @client_info = client_info
    end

    def call
      verify_for_read
      record_view_event
      record_quick_accept_event if @stage.present? && @action_mode == :quick
      @result = @verify_tokens
      @result[:current_available_actions] = current_available_actions
      @result[:viewable_attachments] = StageViewableAttachments.call(@envelope.id, @stage&.id, @reader.id, 'Envelope').result
      @result
    end

    private

    def verify_for_read
      verify = ReadVerify.call(@envelope_id, @member, @read_info, @client_info)
      raise verify.error if verify.failed?
      @source = @envelope = verify.envelope
      @stage = verify.stage
      @stage_info = verify.stage&.basic_info || {}
      @sign_stage_info = StageFinder.find_by_sequence(@envelope.sign_stages, verify.stage&.sequence)&.basic_info || {}
      @action_mode = verify.action_mode
      @reader = verify.member
      @quick_sign_accept_at = verify.quick_sign_accept_at
      @verify_tokens = verify.result
    end

    def record_view_event
      action_name = @envelope.related_member_ids.include?(@reader.id) ? :viewed : :group_viewed
      @envelope.add_sign_event(action_name, @reader.id, stage_info: @stage_info, client_info: @client_info, other_info: event_extra_info)
      @envelope.sign_tasks.each do |task|
        task.add_sign_event(action_name, @reader.id, stage_info: @sign_stage_info, client_info: @client_info, other_info: event_extra_info)
      end
    end

    def record_quick_accept_event
      quick_sign_info = event_extra_info
      quick_sign_info[:created_at] = Time.at(@quick_sign_accept_at)
      quick_sign_info[:waiting_member_emails] = []
      @envelope.add_sign_event(:accept_quick_sign, @reader.id, stage_info: @stage_info, client_info: @client_info, other_info: quick_sign_info)
      @envelope.sign_tasks.each do |task|
        task.add_sign_event(:accept_quick_sign, @reader.id, stage_info: @sign_stage_info, client_info: @client_info, other_info: quick_sign_info)
      end
    end

    def current_available_actions
      actions = ['view']
      case @stage&.class&.base_class&.name
      when 'DummyStage'
        actions << 'sign' if @stage.signing?
        actions << 'review' if @stage.reviewing?
        actions << 'confirm' if @stage.reviewed?
      end

      actions
    end
  end
end