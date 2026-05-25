class VerifyMethod
  module Verifiable
    extend ActiveSupport::Concern

    def verify(verify_data)
      return Time.now.to_i if system_cert?

      if need_otp?
        verify_at = otp_verify(verify_data)
      elsif need_cert?
        verify_at = ca_verify
      end
      verify_at
    end

    def set_verify_time(verify_time)
      verify_at = Time.at(verify_time)
      same_stage_verify_steps.update_all(last_verify_at: verify_at)
    end

    private

    def otp_verify(otp)
      totp.verify(otp, drift_behind: (OTP_INTERVAL.to_i - totp.interval))
    end

    def ca_verify
      tid = Rails.cache.read("ca_auth:#{uuid}")
      return nil if tid.blank?
      Rails.cache.write("#{stage_type}:#{stage_id}:tid", tid)
      Time.now.to_i
    end

  end
end
