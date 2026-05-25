class Stage
  module Signable
    extend ActiveSupport::Concern

    def sign(sign_info, options: {})
      insert = DataInsert.call(self.class.name, id, sign_info, options: options)
      raise insert.error if insert.failed?
      signed!
      return trigger_next_stages if review_stages.initial.present?
      before_done
    end

    def before_done
      return unless (signed? && review_stages.blank?) || reviewed? || processing_file?
      return generate_stage_file if stage_file.nil? && source.file_processable?
      Rails.cache.delete("signtask:#{source_id}:dummystage:#{id}:sign_info") if self.class.base_class.name == "DummyStage"
      do_done
    end

    def do_done
      self.done!
      mark_stage_last_action
      trigger_stage_done_callback if sign_task.present? && !sign_task.in_envelope?
      trigger_next_stages
      trigger_completed_task
      envelope_stage.envelope_stage_do_done if sign_task.in_envelope?
    end

    def need_stage_cert?
      respond_to?(:verify_methods) ? verify_methods.any?(&:need_cert?) : false
    end

    def use_system_cert?
      respond_to?(:verify_methods) ? verify_methods.any?(&:system_cert?) : false
    end

    def use_personal_cert?
      respond_to?(:verify_methods) ? verify_methods.any?(&:personal_cert?) : false
    end

    def use_company_cert?
      respond_to?(:verify_methods) ? verify_methods.any?(&:company_cert?) : false
    end

    def is_visible_ca?
      self.field_settings.find_by("options->>'visible_ca' = ?", "true").present?
    end

    def visible_ca_field_object_id
      self.field_settings.find_by("options->>'visible_ca' = ?", "true")&.field_object_id
    end

    def ca_retryable?
      !use_personal_cert? && !use_company_cert?
    end

    def ca_not_retryable?
      !ca_retryable?
    end

    def custom_cert_method
      stage = self.is_a?(SignStage) ? self : self.source.sign_stages.find_by(sequence: sequence)
      stage.verify_methods.find_by(verify_type: ['cht_personal', 'cht_company'])
    end

    def obtain_system_cert_verify_info
      return unless use_system_cert?
      self.verify_methods.find_by(verify_type: 'cht_system')
    end

    def generate_stage_file
      processing_file!
      stage_file = ServiceFile.setup_for(self, "stage_#{id}")
      # Envelope sign use transaction in sign flow to ensure all stages status change together
      # It will cause file_not_found error in ReadableFileGeneratorWorker if we enqueue job here directly
      ReadableFileGeneratorWorker.perform_in(SignTask::START_CHECK_DURATION, stage_file.id, need_stage_cert? || is_visible_ca?)
    end

    def mark_stage_last_action
      last_signed_event = sign_events.where(action_name: 'signed').order(created_at: :desc).first
      last_verified_event = sign_events.where(action_name: 'verified').order(created_at: :desc).first
      last_signed_event&.set_as_stage_last_action
      last_verified_event&.set_as_stage_last_action
    end

    def trigger_stage_done_callback
      CallbackWorker.perform_async(self.class.base_class.name, id)
    end
  end
end
