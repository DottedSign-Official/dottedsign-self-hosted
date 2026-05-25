module Envelopes
  class Verify < Normal::Verify
    attr_reader :envelope

    def initialize(envelope_id, member, sign_info, client_info)
      @envelope_id = envelope_id
      @member = member
      @sign_info = sign_info
      @verify_info = sign_info[:verify_info] || {}
      @code_info = sign_info.slice(:code)
      @client_info = client_info
      @attachment_info = sign_info[:attachment_info] || {}
    end

    def call
      check_client
      check_envelope
      check_stage
      detect_action_mode
      executable_check
      verify_now
      save_verify_events
    end

    private

    def check_envelope
      checker = EnvelopeChecker.call(@envelope_id, @member, check_action: 'sign_the_task')
      raise checker.error if checker.failed?
      @envelope = checker.result
      raise ServiceError.new(:envelope_not_signable) unless @envelope.signable?
      @actor = @member
    end

    def check_stage
      @stage = @envelope.processing_stages.find_by(actor_id: @actor.id)
      raise ServiceError.new(:not_signer_turn) if @stage.nil?
    end

    def attachment_check
      sign_stages = SignStage.specific_sequence_in_envelope(@envelope.id, @stage.sequence)
      attachment_ids = @attachment_info.pluck(:attachment_id)
      raise ServiceError.new(:attachment_not_ready, attachment_upload_data(sign_stages, attachment_ids)) if @attachment_info.any? { |info| info[:uploaded] == false }
      return if attachment_ready?(sign_stages, attachment_ids)
      allow_attachment_ids = sign_stages.flat_map { |stage| stage.attachment_setting.pluck('attachment_id') }
      raise ServiceError.new(:attachment_setting_not_found) if attachment_ids.present? && (attachment_ids - allow_attachment_ids).present?
      raise ServiceError.new(:attachment_not_ready, attachment_upload_data(sign_stages, attachment_ids))
    end

    def attachment_upload_data(sign_stages, attachment_ids)
      upload_data = {}
      sign_stages.each do |stage|
        stage_attachment_ids = stage.attachment_setting.pluck('attachment_id')
        matched_attachment_ids = attachment_ids & stage_attachment_ids
        matched_attachment_ids.each do |attachment_id|
          upload_data[attachment_id] = stage.upload_link_for(attachment_id)
        end
      end
      { attachment_upload_info: upload_data }
    end

    def attachment_ready?(sign_stages, attachment_ids)
      attachment_ids ||= []
      uploaded_attachment_ids = sign_stages.flat_map { |stage| stage.attachments.pluck(:label) }
      required_attachment_ids = sign_stages.flat_map { |stage| stage.attachment_setting.select { |setting| setting['force'] }.pluck('attachment_id') }
      return false if ((required_attachment_ids | attachment_ids) - uploaded_attachment_ids).present?
      delete_attachment_ids = uploaded_attachment_ids - attachment_ids
      delete_attachments(sign_stages.map(&:id), delete_attachment_ids) if delete_attachment_ids.present?
      true
    end

    def delete_attachments(sign_stage_ids, delete_attachment_ids)
      ServiceFile.where(storable_type: 'SignStage', storable_id: sign_stage_ids, label: delete_attachment_ids).destroy_all
    end

    def save_verify_events
      return if @verify_event_infos.blank?
      verified_stage = StageFinder.find_by_sequence(@stage.source.sign_stages, @stage.sequence)
      @verify_event_infos.each do |event_info|
        other_info = event_info[:other_info]
        @envelope.add_sign_event(@verify_action, @verify_member_id, stage_info: @stage.event_info, client_info: @client_info, other_info: other_info)
        @envelope.sign_tasks.each do |task|
          task.add_sign_event(@verify_action, @verify_member_id, stage_info: verified_stage.event_info, client_info: @client_info, other_info: other_info)
        end
      end
      Rails.cache.delete("#{verified_stage.class.base_class.name}:#{verified_stage.id}:verify_source")
    end
  end
end
