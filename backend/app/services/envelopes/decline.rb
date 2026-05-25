module Envelopes
  class Decline < Normal::Decline

    def initialize(envelope_id, member, decline_info, client_info)
      @envelope_id = envelope_id
      @member = member
      @decline_info = decline_info
      @client_info = client_info
    end

    def call
      setup_envelope
      setup_stage
      check_accessibility
      ActiveRecord::Base.transaction do
        decline_the_tasks
        decline_the_envelope
      end
      email_members
      @result = @envelope.display(@member.id)
    end

    private

    def setup_envelope
      @envelope = Envelope.includes(:sign_tasks).find_by_id(@envelope_id)
      raise ServiceError.new(:envelope_not_found) if @envelope.nil?
    end

    def setup_stage
      @stage = @envelope.processing_stages.find_by(actor: @member)
      raise ServiceError.new(:not_signer_turn) if @stage.nil?
    end

    def check_accessibility
      accessibility = @envelope.accessibility_of(@member, 'decline_task', check_stage: @stage)
      raise ServiceError.new(accessibility) unless accessibility == :accessible
    end

    def decline_the_tasks
      SignStage.specific_sequence_in_envelope(@envelope.id, @stage.sequence).each do |stage|
        decline_the_task(stage)
      end
    end

    def decline_the_task(stage)
      stage.declined!
      @task = stage.sign_task
      event = @task.add_sign_event(:declined, @member.id, stage_info: stage.basic_info, client_info: @client_info)
      @task.do_declined
      decline_attrs = {
        sign_task: @task,
        sign_stage: stage,
        sign_event: event
      }.merge(@decline_info)
      DeclineLog.create(decline_attrs)
      notify_members
    end

    def decline_the_envelope
      @stage.declined!
      @envelope.add_sign_event(:declined, @member.id, stage_info: @stage.basic_info, client_info: @client_info)
      @envelope.do_declined
    end

    def email_members
      Notification::DeclinedMailWorker.perform_async(@envelope.id, @envelope.class.name)
    end

  end
end
