class VerifyMethod
  module Triggerable
    extend ActiveSupport::Concern

    OTP_TYPES = ['email', 'sms', 'signer_detect'].freeze

    def trigger_now
      self.trigger_at = Time.zone.now.to_i
      need_verify_infos = trigger
      same_stage_verify_steps.update_all(trigger_at: trigger_at)
      need_verify_infos
    end

    def trigger_next_step
      next_step = VerifyMethod.send(execute_type).find_by(stage_type: stage_type, stage_id: stage_id, sequence: sequence + 1)
      return if next_step.blank?
      next_step.trigger_now
    end

    def triggerable?
      return true if trigger_at.nil?
      Time.at(trigger_at) + TRIGGER_INTERVAL < Time.zone.now
    end

    def need_otp?
      ([verify_type] & OTP_TYPES).present?
    end

    def need_cert?
      CERT_TYPE.include?(verify_type)
    end

    def system_cert?
      verify_type == 'cht_system'
    end

    def personal_cert?
      verify_type == 'cht_personal'
    end

    def company_cert?
      verify_type == 'cht_company'
    end

    private

    def trigger_otp
      infos = verify_infos + same_stage_verify_steps.where.not(id: id).map(&:verify_infos).flatten
      deliver = OtpDeliver.call(stage_type, stage_id, uuid, infos, otp_secret_key, need_cache: false)
      deliver.success? ? deliver.result : raise(deliver.error)
    end

    def trigger_cert
      cache_info = { uuid: uuid, verify_type: verify_type, envelope_info: build_envelope_info }.compact
      email = stage.action == 'form_sign' ? stage.actor_info['email'] : stage.email
      auth = CaAuthenticator.call(email, verify_type, cache_info: cache_info)
      auth.success? ? verify_infos(custom_info: auth.result) : raise(auth.error)
    end

    def build_envelope_info
      envelope = stage.source.envelope
      return if envelope.nil?
      {
        envelope_name: envelope.envelope_name,
        task_infos: envelope.sign_tasks.pluck(:file_name, :long_id).map do |file_name, long_id|
          { title: file_name, uuid: long_id }
        end
      }
    end

    def trigger
      if system_cert?
        VerifyMethod.check_system_ca_accessibility(stage_type, stage_id, verify_source)
        Rails.cache.write("#{stage_type}:#{stage_id}:verify_source", { cht_system: "" }, expires_in: VerifyMethod::CERT_INTERVAL)
        verify_infos
      elsif need_otp?
        trigger_otp
      elsif need_cert?
        trigger_cert
      else
        verify_infos
      end
    end

  end
end
